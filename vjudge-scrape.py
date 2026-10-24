#!/usr/bin/env python3
"""
Synchronizacja rankingu zestawow z vjudge.net + ratingow zadan z CodeChef.

Punkty = suma ratingow (difficulty_rating z CodeChef) wszystkich zadan,
ktore dana osoba zaliczyla na Accepted. Kazde zadanie liczy sie raz,
niezaleznie od liczby zgloszen.

Zapisuje:
  vjudge-leaderboard.json  - dane dla strony (ten plik wrzucasz na hosting)
  materialy.html           - odswieza wbudowany snapshot rankingu
  .vjudge-cache.json       - lokalny cache ratingow CodeChef (nie wrzucaj)

Uruchomienie:  python vjudge-scrape.py

Zrodla (publiczne, bez logowania):
  vjudge.net/contest/<id>                     -> lista zadan zestawu
  vjudge.net/contest/rank/single/<id>         -> uczestnicy + zgloszenia
  codechef.com/api/list/problems?start_rating -> katalog zadan z ratingami
"""
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.abspath(__file__))
SRC_HTML = os.path.join(ROOT, "materialy.html")
OUT_JSON = os.path.join(ROOT, "vjudge-leaderboard.json")
CACHE = os.path.join(ROOT, ".vjudge-cache.json")

SNAP_START = "/* LB_SNAPSHOT_START */"
SNAP_END = "/* LB_SNAPSHOT_END */"

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def get(url, tries=4, json_out=False):
    """GET z retry i rosnacym backoffem."""
    last = None
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": UA,
                "Accept": "application/json, text/html;q=0.9,*/*;q=0.8",
                "Accept-Language": "en-US,en;q=0.9",
            })
            with urllib.request.urlopen(req, timeout=45) as r:
                body = r.read().decode("utf-8", "replace")
            return json.loads(body) if json_out else body
        except (urllib.error.HTTPError, urllib.error.URLError, OSError, ValueError) as e:
            last = e
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("nie udalo sie pobrac %s: %s" % (url, last))


# ────────────────────────────── zestawy ──────────────────────────────

def read_psets():
    """Wyciaga z materialy.html id konkursow + zakresy ratingow zestawow."""
    src = open(SRC_HTML, encoding="utf-8").read()

    def arr(name):
        m = re.search(r"const %s = \[(.*?)\];" % name, src, re.S)
        return re.findall(r"'([^']*)'", m.group(1)) if m else []

    names = arr("PSET_NAMES")
    topics = arr("PSET_TOPICS")

    m = re.search(r"const PSET_URLS = \{(.*?)\};", src, re.S)
    if not m:
        raise RuntimeError("nie znalazlem PSET_URLS w materialy.html")
    ids = sorted((int(i), int(cid)) for i, cid in
                 re.findall(r"(\d+):\s*'https://vjudge.net/contest/(\d+)'", m.group(1)))

    out = []
    for idx, cid in ids:
        rng = names[idx] if idx < len(names) else ""
        lo = hi = None
        mm = re.match(r"\s*(\d+)\D+(\d+)", rng)
        if mm:
            lo, hi = int(mm.group(1)), int(mm.group(2))
        out.append({"idx": idx, "contestId": cid, "range": rng, "lo": lo, "hi": hi,
                    "topic": topics[idx] if idx < len(topics) else ""})
    return out


def fetch_set(pset):
    """Lista zadan (ze strony konkursu) + ranking (z API) jednego zestawu."""
    cid = pset["contestId"]

    page = get("https://vjudge.net/contest/%d" % cid)
    m = re.search(r'<textarea[^>]*name="dataJson"[^>]*>(.*?)</textarea>', page, re.S)
    meta = json.loads(html.unescape(m.group(1))) if m else {}
    problems = meta.get("problems") or []

    rank = get("https://vjudge.net/contest/rank/single/%d" % cid, json_out=True)

    out = dict(pset)
    out["title"] = meta.get("title") or rank.get("title") or ("zestaw %d" % (pset["idx"] + 1))
    out["problems"] = [{"num": p.get("num"), "title": p.get("title") or "", "oj": p.get("oj")}
                       for p in problems]
    out["managerName"] = meta.get("managerName") or ""
    out["begin"] = rank.get("begin") or meta.get("begin") or 0
    out["participants"] = rank.get("participants") or {}
    out["submissions"] = rank.get("submissions") or []
    print("  zestaw %2d (#%d): %2d zadan, %2d uczestnikow, %4d zgloszen"
          % (out["idx"] + 1, cid, len(out["problems"]),
             len(out["participants"]), len(out["submissions"])), flush=True)
    return out


# ────────────────────────── ratingi z CodeChef ──────────────────────────

def fetch_codechef_ratings():
    """Katalog zadan CodeChef z ratingami (przemiatanie po kubelkach ratingu).

    Endpoint /api/list/problems zwraca difficulty_rating = -1, dopoki nie poda
    sie start_rating/end_rating - stad przemiatanie po 100 punktow.
    """
    catalog = {}
    for lo in range(0, 5001, 100):
        hi, off = lo + 99, 0
        while True:
            d = get("https://www.codechef.com/api/list/problems"
                    "?limit=1000&offset=%d&start_rating=%d&end_rating=%d" % (off, lo, hi),
                    json_out=True)
            rows = d.get("data") or []
            for r in rows:
                catalog[r["code"]] = {
                    "name": r["name"],
                    "rating": int(r["difficulty_rating"]),
                    "subs": int(r.get("total_submissions") or 0),
                }
            off += len(rows)
            if not rows or off >= d.get("count", 0):
                break
        time.sleep(0.15)
    return catalog


def load_ratings():
    """Swieze ratingi z CodeChef; przy awarii - ostatni udany cache."""
    try:
        catalog = fetch_codechef_ratings()
        if len(catalog) < 1000:
            raise RuntimeError("podejrzanie malo zadan: %d" % len(catalog))
        json.dump({"fetched": time.strftime("%Y-%m-%dT%H:%M:%S%z"), "problems": catalog},
                  open(CACHE, "w", encoding="utf-8"), ensure_ascii=False)
        print("  CodeChef: %d zadan z ratingiem" % len(catalog), flush=True)
        return catalog
    except Exception as e:
        if os.path.exists(CACHE):
            cached = json.load(open(CACHE, encoding="utf-8"))
            print("  CodeChef niedostepny (%s) - uzywam cache z %s (%d zadan)"
                  % (e, cached.get("fetched"), len(cached["problems"])), flush=True)
            return cached["problems"]
        raise


def build_rating_index(catalog):
    """nazwa zadania (lowercase) -> lista kandydatow (rating, liczba zgloszen)."""
    index = {}
    for code, v in catalog.items():
        index.setdefault(v["name"].strip().lower(), []).append(
            {"code": code, "rating": v["rating"], "subs": v["subs"]})
    return index


def rate_problem(title, index, lo, hi):
    """Rating zadania po tytule. Przy powtarzajacych sie nazwach wybiera ten
    wariant, ktory miesci sie w zakresie ratingow zestawu (nazwy zestawow to
    wlasnie zakresy typu 19-144), a jesli nadal jest remis - popularniejszy."""
    cands = index.get(title.strip().lower())
    if not cands:
        return None, "brak"
    if len(cands) == 1:
        return cands[0]["rating"], "ok"

    if lo is not None:
        inside = [c for c in cands if lo - 1 <= c["rating"] <= hi + 1]
        if inside:
            best = max(inside, key=lambda c: c["subs"])
            return best["rating"], "ok" if len(inside) == 1 else "zakres"
    best = max(cands, key=lambda c: c["subs"])
    return best["rating"], "zgadywane"


# ─────────────────────────────── ranking ───────────────────────────────

def build(data, index):
    users, solved_keys, tried_keys = {}, set(), set()
    stats = {"ok": 0, "zakres": 0, "zgadywane": 0, "brak": 0}

    for p in data:
        # rating kazdego zadania w zestawie (indeks zadania -> punkty)
        p["ratings"] = {}
        for i, prob in enumerate(p["problems"]):
            rating, how = rate_problem(prob["title"], index, p["lo"], p["hi"])
            stats[how] += 1
            if rating is not None:
                p["ratings"][i] = rating
                prob["rating"] = rating
        p["points"] = sum(p["ratings"].values())

        for uid, info in p["participants"].items():
            u = users.setdefault(str(uid), {
                "uid": str(uid),
                "name": info.get("nickname") or info.get("name") or ("user" + str(uid)),
                "login": info.get("name") or "",
                "avatar": info.get("image") or "",
                "points": 0,
                "solved": 0,
                "tried": 0,
                "attempts": 0,
                "best": 0,
                "perSet": {},
                "lastActive": 0,
            })
            if info.get("image"):
                u["avatar"] = info["image"]

        for sub in p["submissions"]:
            u = users.get(str(sub[0]))
            if u is None:
                continue
            pid = sub[1]
            accepted = sub[2] == 1
            offset = sub[3] if len(sub) > 3 else 0

            u["attempts"] += 1
            if p["begin"]:
                u["lastActive"] = max(u["lastActive"], p["begin"] + offset * 1000)

            key = (u["uid"], p["idx"], pid)
            if key not in tried_keys:
                tried_keys.add(key)
                u["tried"] += 1

            if accepted and key not in solved_keys:
                solved_keys.add(key)
                pts = p["ratings"].get(pid, 0)
                u["solved"] += 1
                u["points"] += pts
                u["best"] = max(u["best"], pts)
                u["perSet"][str(p["idx"])] = u["perSet"].get(str(p["idx"]), 0) + 1

    print("  ratingi zadan: %d pewnych, %d po zakresie, %d zgadywanych, %d bez ratingu"
          % (stats["ok"], stats["zakres"], stats["zgadywane"], stats["brak"]), flush=True)

    ranked = sorted((u for u in users.values() if u["attempts"] > 0),
                    key=lambda u: (-u["points"], -u["solved"], u["attempts"], u["name"].lower()))
    managers = set(p["managerName"] for p in data if p["managerName"])
    for u in ranked:
        u["setsTouched"] = len(u["perSet"])
        u["isManager"] = u["login"] in managers or u["name"] in managers
    return ranked, managers


def write_snapshot(payload):
    """Podmienia wbudowany snapshot w materialy.html (miedzy znacznikami)."""
    src = open(SRC_HTML, encoding="utf-8").read()
    i, j = src.find(SNAP_START), src.find(SNAP_END)
    if i < 0 or j < 0:
        print("  UWAGA: brak znacznikow snapshotu w materialy.html - pomijam")
        return False

    blob = json.dumps(payload, ensure_ascii=False, separators=(",", ":"))
    if "</script" in blob.lower():
        raise RuntimeError("snapshot zawiera </script")

    new = src[:i] + SNAP_START + "\n    const LB_FALLBACK = " + blob + ";\n    " + src[j:]
    if new == src:
        return False
    open(SRC_HTML, "w", encoding="utf-8").write(new)
    return True


def main():
    t0 = time.time()
    psets = read_psets()
    print("Zestawy: %d (z materialy.html)" % len(psets), flush=True)

    print("Pobieram ratingi z CodeChef...", flush=True)
    index = build_rating_index(load_ratings())

    print("Pobieram wyniki z vjudge...", flush=True)
    with ThreadPoolExecutor(max_workers=5) as ex:
        data = sorted(ex.map(fetch_set, psets), key=lambda p: p["idx"])

    ranked, managers = build(data, index)

    total_problems = sum(len(p["problems"]) for p in data)
    total_points = sum(p["points"] for p in data)

    out = {
        "generated": time.strftime("%Y-%m-%dT%H:%M:%S%z"),
        "source": "vjudge.net + codechef.com",
        "scoring": "suma ratingow CodeChef za zadania zaliczone na Accepted",
        "setCount": len(data),
        "totalProblems": total_problems,
        "totalPoints": total_points,
        "managers": sorted(managers),
        "sets": [{"idx": p["idx"], "contestId": p["contestId"], "title": p["title"],
                  "range": p["range"], "topic": p["topic"],
                  "problems": len(p["problems"]), "points": p["points"]} for p in data],
        "users": ranked,
    }
    json.dump(out, open(OUT_JSON, "w", encoding="utf-8"), ensure_ascii=False, indent=1)

    snap = {
        "generated": out["generated"],
        "setCount": out["setCount"],
        "totalProblems": total_problems,
        "totalPoints": total_points,
        "users": [{"name": u["name"], "login": u["login"], "avatar": u["avatar"],
                   "points": u["points"], "solved": u["solved"], "best": u["best"],
                   "attempts": u["attempts"], "setsTouched": u["setsTouched"]}
                  for u in ranked if u["solved"] > 0],
    }
    changed = write_snapshot(snap)

    print("\nZapisano:")
    print("  vjudge-leaderboard.json  (%d osob, %d zadan, %d pkt w puli)"
          % (len(ranked), total_problems, total_points))
    print("  materialy.html           (snapshot %s)"
          % ("odswiezony" if changed else "bez zmian"))
    print("\nRanking:")
    for i, u in enumerate(ranked[:15], 1):
        print("  %2d. %-22s %6d pkt  (%3d zadan, %2d zestawow, najtrudniejsze %d)"
              % (i, u["name"], u["points"], u["solved"], u["setsTouched"], u["best"]))
    print("\nGotowe w %.0f s. Wrzuc na hosting: materialy.html + vjudge-leaderboard.json"
          % (time.time() - t0))
    return 0


if __name__ == "__main__":
    sys.exit(main())
