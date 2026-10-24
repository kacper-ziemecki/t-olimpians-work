#!/usr/bin/env python3
"""
Lokalne proxy do Szkopula — ta sama funkcjonalnosc co worker.js, tyle ze na wlasnym
komputerze. Do testow strony pod http://localhost:8765 przed wrzuceniem na hosting.

Uruchomienie:
    python szkopul-proxy/szkopul-proxy.py
    (domyslnie nasluchuje na http://127.0.0.1:8770)

Na stronie w okienku "Polacz ze Szkopulem" wpisz wtedy adres:
    http://127.0.0.1:8770

Na produkcji (t-olimpians.com) uzyj worker.js na Cloudflare Workers — lokalny skrypt
dziala tylko na tym komputerze.

Wymaga wylacznie biblioteki standardowej.
"""
import http.server
import json
import re
import sys
import urllib.error
import urllib.parse
import urllib.request

SZKOPUL = "https://szkopul.edu.pl"

UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/124.0 Safari/537.36")

# Skad wolno wolac proxy. Lokalnie i tak tylko z wlasnej maszyny, ale bez
# naglowka CORS przegladarka odrzuci odpowiedz.
ALLOWED_ORIGINS = [
    "http://localhost:8765",
    "http://127.0.0.1:8765",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

PORT = 8770
MAX_PAGES = 30


# ─────────────────────────── HTTP do Szkopula ───────────────────────────

class _NoRedirect(urllib.request.HTTPRedirectHandler):
    """Przy logowaniu potrzebujemy surowej odpowiedzi 302 razem z Set-Cookie."""

    def redirect_request(self, req, fp, code, msg, headers, newurl):
        return None


def szk_request(path, method="GET", data=None, cookies=None, headers=None,
                follow=True, raw_body=None, content_type=None):
    """Jedno zapytanie do Szkopula. Zwraca (status, naglowki, tresc_bajtami)."""
    url = path if path.startswith("http") else SZKOPUL + path
    body = raw_body
    if body is None and data is not None:
        body = urllib.parse.urlencode(data).encode("utf-8")

    hdrs = {"User-Agent": UA, "Accept-Language": "pl,en;q=0.8"}
    if cookies:
        hdrs["Cookie"] = "; ".join("%s=%s" % (k, v) for k, v in cookies.items() if v)
    if content_type:
        hdrs["Content-Type"] = content_type
    elif body is not None:
        hdrs["Content-Type"] = "application/x-www-form-urlencoded"
    if headers:
        hdrs.update(headers)

    req = urllib.request.Request(url, data=body, headers=hdrs, method=method)
    opener = urllib.request.build_opener() if follow else urllib.request.build_opener(_NoRedirect)
    try:
        with opener.open(req, timeout=45) as r:
            return r.status, r.headers, r.read()
    except urllib.error.HTTPError as e:
        return e.code, e.headers, e.read()


def cookies_from(headers):
    """Set-Cookie -> slownik {nazwa: wartosc}."""
    out = {}
    for line in headers.get_all("Set-Cookie") or []:
        m = re.match(r"\s*([^=;]+)=([^;]*)", line)
        if m:
            out[m.group(1).strip()] = m.group(2).strip()
    return out


# ─────────────────────── parsowanie stron Szkopula ───────────────────────

def strip_tags(s):
    s = re.sub(r"<[^>]*>", " ", s)
    s = (s.replace("&nbsp;", " ").replace("&amp;", "&").replace("&lt;", "<")
          .replace("&gt;", ">").replace("&quot;", '"').replace("&#39;", "'"))
    return re.sub(r"\s+", " ", s).strip()


def parse_problem_rows(html):
    """Wiersze listy /problemset/: klucz zadania + wynik uzytkownika."""
    out = []
    for row in re.findall(r"<tr>(.*?)</tr>", html, re.S):
        key = re.search(r"/problemset/problem/([0-9a-zA-Z_=-]+)/site/", row)
        if not key:
            continue
        res = re.search(r"result--(OK|TRIED|FAILED)[^>]*>\s*([0-9]+)\s*<", row)
        if not res:
            continue
        out.append({"key": key.group(1), "status": res.group(1),
                    "score": int(res.group(2))})
    return out


def parse_submissions(html):
    """Tabela zgloszen: komorki maja id postaci submission<ID>-<pole>."""
    by = {}

    def rec(sid):
        return by.setdefault(sid, {"id": sid, "date": None, "status": None,
                                   "score": None, "message": None})

    for sid, cell in re.findall(r'id="submission(\d+)-link"[^>]*>(.*?)</td>', html, re.S):
        rec(int(sid))["date"] = strip_tags(cell)

    for sid, cls, cell in re.findall(
            r'id="submission(\d+)-status"[^>]*class="([^"]*)"[^>]*>(.*?)</td>', html, re.S):
        r = rec(int(sid))
        m = re.search(r"submission--([A-Za-z_?]+)", cls)
        r["status"] = m.group(1) if m else None
        r["message"] = strip_tags(cell)

    for sid, cell in re.findall(r'id="submission(\d+)-score"[^>]*>(.*?)</td>', html, re.S):
        txt = strip_tags(cell)
        m = re.match(r"^(\d+)", txt)
        rec(int(sid))["score"] = int(m.group(1)) if m else None

    return sorted(by.values(), key=lambda s: -s["id"])


# ─────────────────────────── logika endpointow ───────────────────────────

class SzkopulError(Exception):
    def __init__(self, message, status=502, expired=False, detail=None):
        super().__init__(message)
        self.message = message
        self.status = status
        self.expired = expired
        self.detail = detail


def do_login(login, password):
    code, headers, _ = szk_request("/account/login/")
    csrf = cookies_from(headers).get("csrftoken")
    if not csrf:
        raise SzkopulError("Szkopuł nie oddał tokenu CSRF.", 502)

    code, headers, body = szk_request(
        "/account/login/", method="POST", follow=False,
        cookies={"csrftoken": csrf},
        headers={"Referer": SZKOPUL + "/account/login/", "Origin": SZKOPUL},
        data={
            "csrfmiddlewaretoken": csrf,
            "login_view-current_step": "auth",
            "auth-username": login,
            "auth-password": password,
        })

    jar = cookies_from(headers)
    session = jar.get("sessionid")
    if not session:
        html = body.decode("utf-8", "replace")
        two_factor = re.search(r'current_step"\s+value="(?!auth)', html) is not None
        raise SzkopulError(
            "To konto ma włączone logowanie dwuskładnikowe — proxy tego nie obsługuje."
            if two_factor else "Zły login lub hasło.", 401)

    new_csrf = jar.get("csrftoken") or csrf
    _, who_headers, _ = szk_request("/problemset/",
                                    cookies={"sessionid": session, "csrftoken": new_csrf})
    username = who_headers.get("X-Username")
    return {"session": session, "csrf": new_csrf,
            "username": username if username and username != "-" else login}


def do_scores(session, csrf):
    found = {}
    # "solved" + "attempted" = wszystko, czego user dotknal. Reszty bazy nie ruszamy.
    for flt in ("solved", "attempted"):
        for page in range(1, MAX_PAGES + 1):
            code, _, body = szk_request(
                "/problemset/?filter=%s&page=%d" % (flt, page),
                cookies={"sessionid": session, "csrftoken": csrf})
            if code in (302, 403):
                raise SzkopulError("Sesja Szkopuła wygasła — zaloguj się ponownie.",
                                   401, expired=True)
            if code != 200:
                raise SzkopulError("Szkopuł nie odpowiada (HTTP %d)." % code, 502)
            html = body.decode("utf-8", "replace")
            if 'id="navbar-login"' in html:
                raise SzkopulError("Sesja Szkopuła wygasła — zaloguj się ponownie.",
                                   401, expired=True)
            rows = parse_problem_rows(html)
            for r in rows:
                prev = found.get(r["key"])
                if prev is None or r["score"] > prev["score"]:
                    found[r["key"]] = r
            if len(rows) < 20:      # ostatnia strona
                break
    return list(found.values())


def do_submissions(key, session, csrf):
    code, _, body = szk_request(
        "/problemset/problem/%s/site/?key=submissions" % urllib.parse.quote(key),
        cookies={"sessionid": session, "csrftoken": csrf})
    if code != 200:
        raise SzkopulError("Szkopuł nie odpowiada (HTTP %d)." % code, 502)
    html = body.decode("utf-8", "replace")
    if 'id="navbar-login"' in html:
        raise SzkopulError("Sesja Szkopuła wygasła — zaloguj się ponownie.", 401, expired=True)
    return parse_submissions(html)


def do_submit(key, session, csrf, raw_body, content_type):
    code, _, body = szk_request(
        "/api/problemset/submit/%s" % urllib.parse.quote(key),
        method="POST", raw_body=raw_body, content_type=content_type,
        cookies={"sessionid": session, "csrftoken": csrf},
        headers={"X-CSRFToken": csrf,
                 "Referer": SZKOPUL + "/problemset/problem/%s/site/" % key,
                 "Origin": SZKOPUL})
    text = body.decode("utf-8", "replace")
    if code in (401, 403):
        raise SzkopulError("Szkopuł odrzucił sesję — zaloguj się ponownie.",
                           401, expired=True, detail=text[:400])
    if code >= 400:
        raise SzkopulError("Szkopuł odrzucił zgłoszenie.", 400, detail=text[:600])
    try:
        sid = json.loads(text)
    except ValueError:
        sid = None
    return {"id": sid if isinstance(sid, int) else None}


# ─────────────────────────── serwer HTTP ───────────────────────────

class Handler(http.server.BaseHTTPRequestHandler):
    server_version = "SzkopulProxy/1.0"
    protocol_version = "HTTP/1.1"

    def log_message(self, fmt, *args):
        # Domyslny log wypisywalby cala sciezke; wystarczy metoda + endpoint.
        sys.stderr.write("[proxy] %s %s\n" % (self.command, self.path.split("?")[0]))

    # ---- pomocnicze ----

    def _origin(self):
        return self.headers.get("Origin", "")

    def _cors(self):
        origin = self._origin()
        allow = origin if origin in ALLOWED_ORIGINS else (ALLOWED_ORIGINS[0] if ALLOWED_ORIGINS else "*")
        self.send_header("Access-Control-Allow-Origin", allow)
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers",
                         "Content-Type, X-Szkopul-Session, X-Szkopul-Csrf")
        self.send_header("Access-Control-Max-Age", "86400")
        self.send_header("Vary", "Origin")

    def _json(self, data, status=200):
        payload = json.dumps(data, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(payload)))
        self.send_header("Cache-Control", "no-store")
        self._cors()
        self.end_headers()
        self.wfile.write(payload)

    def _fail(self, err):
        out = {"error": err.message}
        if err.expired:
            out["expired"] = True
        if err.detail:
            out["detail"] = err.detail
        self._json(out, err.status)

    def _session(self):
        session = self.headers.get("X-Szkopul-Session")
        csrf = self.headers.get("X-Szkopul-Csrf") or ""
        if not session:
            raise SzkopulError("Brak sesji.", 401)
        return session, csrf

    def _body(self):
        length = int(self.headers.get("Content-Length") or 0)
        return self.rfile.read(length) if length else b""

    # ---- metody HTTP ----

    def do_OPTIONS(self):
        self.send_response(204)
        self._cors()
        self.send_header("Content-Length", "0")
        self.end_headers()

    def do_GET(self):
        path = urllib.parse.urlparse(self.path).path.rstrip("/") or "/"
        try:
            if path in ("/", "/ping"):
                code, _, _ = szk_request("/api/ping")
                self._json({"ok": code == 200, "szkopul": "pong" if code == 200 else "HTTP %d" % code})
                return
            if path == "/scores":
                session, csrf = self._session()
                problems = do_scores(session, csrf)
                self._json({"problems": problems, "count": len(problems)})
                return
            m = re.match(r"^/submissions/([0-9a-zA-Z_=-]+)$", path)
            if m:
                session, csrf = self._session()
                self._json({"submissions": do_submissions(m.group(1), session, csrf)})
                return
            self._json({"error": "Nieznany endpoint: " + path}, 404)
        except SzkopulError as e:
            self._fail(e)
        except Exception as e:                                  # noqa: BLE001
            self._json({"error": "Błąd proxy: %s" % e}, 500)

    def do_POST(self):
        path = urllib.parse.urlparse(self.path).path.rstrip("/") or "/"
        try:
            if path == "/login":
                data = json.loads(self._body().decode("utf-8") or "{}")
                login = str(data.get("login", "")).strip()
                password = str(data.get("password", ""))
                if not login or not password:
                    raise SzkopulError("Podaj login i hasło.", 400)
                self._json(do_login(login, password))
                return
            m = re.match(r"^/submit/([0-9a-zA-Z_=-]+)$", path)
            if m:
                session, csrf = self._session()
                ctype = self.headers.get("Content-Type", "")
                if "multipart/form-data" not in ctype:
                    raise SzkopulError('Oczekiwano multipart/form-data z polem "file".', 400)
                self._json(do_submit(m.group(1), session, csrf, self._body(), ctype))
                return
            self._json({"error": "Nieznany endpoint: " + path}, 404)
        except SzkopulError as e:
            self._fail(e)
        except Exception as e:                                  # noqa: BLE001
            self._json({"error": "Błąd proxy: %s" % e}, 500)


def main():
    port = PORT
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    srv = http.server.ThreadingHTTPServer(("127.0.0.1", port), Handler)
    print("Proxy Szkopula dziala na http://127.0.0.1:%d" % port)
    print("Na stronie wpisz ten adres w okienku 'Polacz ze Szkopulem'.")
    print("Ctrl+C konczy.")
    try:
        srv.serve_forever()
    except KeyboardInterrupt:
        print("\nKoniec.")


if __name__ == "__main__":
    main()
