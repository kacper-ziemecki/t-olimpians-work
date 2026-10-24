#!/usr/bin/env python3
"""
Pobranie zadan AtCodera posegregowanych tematami do zadania-atcoder.json.

Zrodlo podzialu na tematy: https://atcoder-categories.github.io/ (autor: npc0x0).
Tamta strona trzyma kazda kategorie w osobnym pliku .html z tablica PROBLEMS
w srodku; my sciagamy je wszystkie i sklejamy w jeden plik danych dla
zadania-oi-oij.html. Same dane o zadaniach (tytul, rating, link) pochodza
z AtCodera i z projektu kenkoooo/AtCoder Problems.

Zapisuje:
  zadania-atcoder.json  - dane dla strony (ten plik wrzucasz na hosting)

Uruchomienie:  python atcoder-scrape.py

Po odswiezeniu danych podbij DATA_VERSION w zadania-oi-oij.html (dwa miejsca:
stala w <script> i tagi <link rel="preload"> w <head>), zeby przegladarki
nie podaly staruszka z cache.
"""
import io
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from concurrent.futures import ThreadPoolExecutor

ROOT = os.path.dirname(os.path.abspath(__file__))
OUT_JSON = os.path.join(ROOT, "zadania-atcoder.json")

BASE = "https://atcoder-categories.github.io/"
ZRODLO_REPO = "https://github.com/atcoder-categories/atcoder-categories.github.io"

# Daty startu konkursow z projektu kenkoooo/AtCoder Problems. Potrzebne, bo
# zrodlowa strona przy zadaniach z Daily Training podaje date lustra zamiast
# daty oryginalnego konkursu (np. ABC286 z 2023 r. wychodzi tam jako 2026).
KONKURSY_URL = "https://kenkoooo.com/atcoder/resources/contests.json"

# Prefiks konkursow AtCoder Daily Training - to tylko lustra zwyklych zadan.
ADT = "adt"

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")


def get(url, tries=4):
    """GET z retry i rosnacym backoffem."""
    last = None
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, headers={
                "User-Agent": UA,
                "Accept": "text/html,*/*;q=0.8",
            })
            with urllib.request.urlopen(req, timeout=45) as r:
                return r.read().decode("utf-8", "replace")
        except (urllib.error.HTTPError, urllib.error.URLError, OSError) as e:
            last = e
            time.sleep(1.5 * (attempt + 1))
    raise RuntimeError("nie udalo sie pobrac %s: %s" % (url, last))


def wytnij_tablice(tekst, nazwa):
    """Wycina literal tablicy przypisanej do `const <nazwa> = [...]`.

    Nie da sie tego zrobic samym wyrazeniem regularnym, bo w srodku sa
    zagniezdzone nawiasy — lecimy wiec po znakach i liczymy poziom, pomijajac
    nawiasy wewnatrz napisow.
    """
    m = re.search(r"const\s+%s\s*=\s*\[" % re.escape(nazwa), tekst)
    if not m:
        return None
    start = m.end() - 1
    depth = 0
    w_stringu = None
    i = start
    while i < len(tekst):
        c = tekst[i]
        if w_stringu:
            if c == "\\":
                i += 2
                continue
            if c == w_stringu:
                w_stringu = None
        elif c in "\"'`":
            w_stringu = c
        elif c == "[":
            depth += 1
        elif c == "]":
            depth -= 1
            if depth == 0:
                return tekst[start:i + 1]
        i += 1
    return None


def js_na_json(literal):
    """Literal obiektowy JS -> JSON: klucze w cudzyslowy, bez wiszacych przecinkow."""
    s = re.sub(r'([{,]\s*)([A-Za-z_]\w*)\s*:', r'\1"\2":', literal)
    s = re.sub(r",(\s*[\]}])", r"\1", s)
    return json.loads(s)


def slug(href):
    return href[:-5] if href.endswith(".html") else href


# ─────────────────────── porzadkowanie danych zadania ───────────────────────

def bez_prefiksu(tytul, litera):
    """Zrodlo trzyma tytuly jako "D. Cooking" - litera idzie osobno."""
    p = (litera or "") + "."
    if litera and tytul.startswith(p):
        return tytul[len(p):].strip()
    return tytul.strip()


def litera_z_id(zid):
    """Litera zadania odczytana z identyfikatora, np. abc286_d -> D."""
    sufiks = zid.rsplit("_", 1)[1]
    konkurs = zid.rsplit("_", 1)[0]
    # Od ABC212 osme zadanie nazywa sie na AtCoderze "Ex", a nie "H".
    m = re.match(r"^abc(\d+)$", konkurs)
    if sufiks == "h" and m and int(m.group(1)) >= 212:
        return "Ex"
    return sufiks.upper()


def normalizuj(z, konkursy):
    """Jedno zadanie ze zrodla -> wiersz do naszego pliku.

    Prostujemy przy okazji dwie rzeczy, ktore na zrodlowej stronie sa krzywe
    dla zadan z AtCoder Daily Training (ok. 1200 z 2700): link prowadzi do
    lustra zamiast do oryginalnego konkursu, a litera i data pochodza z tego
    lustra. Prawdziwy konkurs siedzi w samym identyfikatorze zadania
    (abc286_d -> abc286), wiec da sie to odtworzyc.
    """
    zid = z["id"]
    litera = (z.get("problem_index") or "").strip()
    nazwa = bez_prefiksu((z.get("title") or "").strip(), litera)
    url = z.get("url") or ""
    konkurs = (z.get("contest_id") or "").strip()
    czas = z.get("datetime")

    if konkurs.startswith(ADT):
        konkurs = zid.rsplit("_", 1)[0]
        litera = litera_z_id(zid)
        url = "https://atcoder.jp/contests/%s/tasks/%s" % (konkurs, zid)

    # Data konkursu z kenkoooo jest wiarygodniejsza niz ta ze zrodla; gdy
    # konkursu tam nie ma (zdarza sie przy nowych), zostaje data zrodlowa.
    czas = konkursy.get(konkurs, czas)

    return [nazwa, z.get("difficulty"), url, czas, konkurs, litera]


# ─────────────────────────── pobieranie ───────────────────────────

def pobierz_konkursy():
    """{ id konkursu: epoch startu } z AtCoder Problems."""
    try:
        dane = json.loads(get(KONKURSY_URL))
    except (RuntimeError, ValueError) as e:
        print("  UWAGA: nie pobralem dat konkursow (%s) - zostaja daty ze zrodla" % e)
        return {}
    return {c["id"]: c.get("start_epoch_second") for c in dane if c.get("id")}


def pobierz_drzewo_kategorii():
    html = get(BASE)
    literal = wytnij_tablice(html, "CATEGORIES")
    if not literal:
        raise RuntimeError("nie znalazlem tablicy CATEGORIES na stronie glownej")
    return js_na_json(literal)


def wszystkie_href(drzewo):
    out = []

    def idz(w):
        out.append(w["href"])
        for klucz in ("subs", "subsubs"):
            for dziecko in w.get(klucz) or []:
                idz(dziecko)

    for w in drzewo:
        idz(w)
    return out


def pobierz_kategorie(href):
    """Zwraca liste zadan z jednej strony kategorii.

    Spis tresci na stronie glownej bywa o krok przed plikami — wypisana
    kategoria potrafi jeszcze nie miec swojej podstrony. Taka traktujemy
    jak pusta, zamiast wywracac caly import.
    """
    try:
        html = get(BASE + href)
    except RuntimeError as e:
        print("  UWAGA: %s nie do pobrania (%s)" % (href, e))
        return []
    literal = wytnij_tablice(html, "PROBLEMS")
    if literal is None:
        print("  UWAGA: brak PROBLEMS w %s" % href)
        return []
    try:
        return json.loads(literal)
    except ValueError as e:
        print("  UWAGA: %s nie parsuje sie jako JSON (%s)" % (href, e))
        return []


# ─────────────────────────── budowanie pliku ───────────────────────────

def main():
    print("Pobieram daty konkursow z AtCoder Problems...")
    konkursy = pobierz_konkursy()
    print("  konkursow: %d" % len(konkursy))

    print("Pobieram drzewo kategorii...")
    drzewo = pobierz_drzewo_kategorii()
    hrefs = wszystkie_href(drzewo)
    print("  kategorii (wraz z podkategoriami): %d" % len(hrefs))

    print("Pobieram strony kategorii...")
    with ThreadPoolExecutor(max_workers=8) as ex:
        listy = list(ex.map(pobierz_kategorie, hrefs))
    po_href = dict(zip(hrefs, listy))

    # Zadania powtarzaja sie miedzy kategoriami (jedno zadanie bywa i w "DP",
    # i w "Grafy"), wiec trzymamy je raz w slowniku, a kategorie odwoluja sie
    # do nich po identyfikatorze. Inaczej plik pucholby kilkukrotnie.
    zadania = {}
    przypisan = 0
    for lista in listy:
        for z in lista:
            przypisan += 1
            zid = z["id"]
            if zid in zadania:
                continue
            zadania[zid] = normalizuj(z, konkursy)

    def zbuduj(w):
        wezel = {
            "t": w["title"],
            "s": slug(w["href"]),
            "z": [z["id"] for z in po_href.get(w["href"], [])],
        }
        dzieci = []
        for klucz in ("subs", "subsubs"):
            for d in w.get(klucz) or []:
                dzieci.append(zbuduj(d))
        if dzieci:
            wezel["pod"] = dzieci
        return wezel

    dane = {
        "wersja": time.strftime("%Y-%m-%d"),
        "zrodlo": BASE,
        "zrodloRepo": ZRODLO_REPO,
        "opisPol": "Tytuly i ratingi zadan pochodza z AtCodera i AtCoder Problems; "
                   "podzial na tematy z atcoder-categories.github.io.",
        "zadaniaPola": ["tytul", "rating", "url", "czas", "konkurs", "litera"],
        "zadania": zadania,
        "kategorie": [zbuduj(w) for w in drzewo],
    }

    with io.open(OUT_JSON, "w", encoding="utf-8", newline="\n") as f:
        json.dump(dane, f, ensure_ascii=False, separators=(",", ":"))

    rozmiar = os.path.getsize(OUT_JSON)
    puste = [h for h in hrefs if not po_href.get(h)]
    print("")
    print("Gotowe: %s" % OUT_JSON)
    print("  unikalnych zadan: %d" % len(zadania))
    print("  przypisan do kategorii: %d" % przypisan)
    print("  rozmiar: %.1f kB" % (rozmiar / 1024.0))
    if puste:
        print("  kategorie bez zadan (%d): %s" % (len(puste), ", ".join(puste)))
    return 0


if __name__ == "__main__":
    sys.exit(main())
