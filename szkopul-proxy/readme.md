# Synchronizacja ze Szkopułem — jak to uruchomić

Strona `zadania-oi-oij.html` potrafi:

* pobrać ze Szkopuła Twoje wyniki dla zadań OI i OIJ,
* pomalować karty: **100 pkt → zielony ptaszek** (zadanie zrobione),
  **1–99 pkt → pomarańczowa liczba punktów**, **0 pkt → czerwony krzyżyk**,
* wysłać rozwiązanie na Szkopuł prosto z karty zadania i poczekać na wynik.

Uczeń loguje się **raz** — sesja Szkopuła żyje potem około dwóch tygodni.

---

## Dlaczego potrzebne jest proxy

Szkopuł nie wysyła nagłówków CORS (sprawdzone: `Access-Control-Allow-Origin`
nie pojawia się w żadnej odpowiedzi). Przeglądarka blokuje więc **każde**
zapytanie z `t-olimpians.com` do `szkopul.edu.pl` — nie da się tego obejść po
stronie strony, niezależnie od tego, czy używamy tokenu API, czy sesji.

Dlatego pomiędzy stroną a Szkopułem musi stanąć mały serwer pośredniczący.
Są tu dwie wersje tego samego:

| plik | do czego |
|---|---|
| `worker.js` | produkcja — Cloudflare Worker, darmowy plan w zupełności wystarcza |
| `szkopul-proxy.py` | testy na własnym komputerze (`http://localhost:8765`) |

Proxy jest **bezstanowe**: nic nie zapisuje, nic nie loguje. Hasło przelatuje
przez nie raz, przy logowaniu, i znika — do przeglądarki wraca samo ciasteczko
sesji Szkopuła.

---

## Wdrożenie na produkcji (Cloudflare Workers)

1. Wejdź na [dash.cloudflare.com](https://dash.cloudflare.com) → w lewym
   pasku, w sekcji **Build**, kliknij **Compute** → **Workers** (w starszym
   panelu: **Workers & Pages**).
2. **Create** → **Workers** → szablon **Hello World** → nazwa `szkopul-proxy`
   → **Deploy**.
3. **Edit code** → skasuj domyślny kod (`Ctrl+A`, `Delete`) i wklej całą
   zawartość `worker.js` → **Deploy**.
4. **Settings** → **Variables and Secrets** → dodaj zmienną tekstową:

   | nazwa | wartość |
   |---|---|
   | `ALLOWED_ORIGINS` | `https://t-olimpians.com,https://www.t-olimpians.com` |

   To lista adresów, z których proxy wolno wołać. Bez tej zmiennej worker
   używa listy wbudowanej na górze pliku.
5. Skopiuj adres workera z góry strony — wygląda mniej więcej tak:
   `https://szkopul-proxy.twoj-login.workers.dev`. Sprawdź go od razu
   w przeglądarce: `<adres>/ping` powinno oddać
   `{"ok":true,"szkopul":"pong"}`.
6. Wklej ten adres do `zadania-oi-oij.html`, w jedyną linię przeznaczoną na to
   (szukaj `SZK_DEFAULT_PROXY`, jest tuż nad `SZK_CONN_KEY`):

   ```js
   const SZK_DEFAULT_PROXY = "https://szkopul-proxy.twoj-login.workers.dev";
   ```

   Gdy ta stała jest ustawiona, pole *Adres proxy* znika z okienka logowania —
   uczniowie widzą już tylko login i hasło. Zostawiona pusta (`""`) oznacza,
   że adres wpisuje sobie każdy sam.

---

## Testy lokalne

```bash
python szkopul-proxy/szkopul-proxy.py
```

Proxy nasłuchuje na `http://127.0.0.1:8770` i przyjmuje zapytania ze stron
serwowanych z `localhost:8765` i `localhost:8000` (lista `ALLOWED_ORIGINS`
na górze pliku). Stronę odpal obok:

```bash
python -m http.server 8765
```

i w okienku „Połącz ze Szkopułem" wpisz `http://127.0.0.1:8770`.

Na innym porcie: `python szkopul-proxy/szkopul-proxy.py 9000` — i dopisz swój
adres strony do `ALLOWED_ORIGINS` w pliku.

---

## Co proxy wystawia

| metoda | ścieżka | do czego |
|---|---|---|
| `GET` | `/ping` | sprawdzenie, czy proxy żyje i widzi Szkopuł |
| `POST` | `/login` | `{login, password}` → `{session, csrf, username}` |
| `GET` | `/scores` | wyniki wszystkich zadań, które użytkownik ruszył |
| `GET` | `/submissions/<klucz>` | zgłoszenia do jednego zadania (id, status, punkty) |
| `POST` | `/submit/<klucz>` | wysłanie pliku (`multipart/form-data`, pole `file`) |
| `GET` | `/codechef/<login>` | licznik rozwiązanych zadań z profilu na CodeChefie |

Sesja leci w nagłówku `X-Szkopul-Session`, token CSRF w `X-Szkopul-Csrf`.
`<klucz>` to identyfikator zadania z adresu na Szkopule:
`https://szkopul.edu.pl/problemset/problem/`**`QCCQf92wAoWAOoJ3tHoypvp3`**`/site/`
— ten sam, który siedzi w `zadania-oi.json` i `zadania-oij.json`.

### Skąd biorą się dane

* **Wysyłka** idzie oficjalnym API Szkopuła:
  `POST /api/problemset/submit/<klucz>` (opisane w
  `https://szkopul.edu.pl/api/schema`).
* **Wyniki** API Szkopuła nie udostępnia dla zadań z archiwum, więc proxy
  czyta je ze stron `/problemset/?filter=solved` i `?filter=attempted` —
  to ta sama kolumna „Twój wynik", którą widzisz zalogowany na Szkopule.
  Pobierane są wyłącznie zadania, w których użytkownik ma jakieś zgłoszenie,
  a nie cała baza.
* **Punkty za świeże zgłoszenie** proxy dociąga z zakładki „Zgłoszenia"
  danego zadania, dopóki Szkopuł go ocenia.
* **CodeChef** to jedyny endpoint, który ze Szkopułem nie ma nic wspólnego.
  CodeChef nie ma publicznego API ani nagłówków CORS, a liczba rozwiązanych
  zadań („Total Problems Solved") siedzi w HTML-u profilu — proxy czyta tę
  jedną liczbę (plus rating i gwiazdki) i oddaje jako JSON. Nie wymaga
  logowania i nie dotyka żadnej sesji. Panel „Ile zadań masz zrobionych"
  na stronie z zadaniami korzysta z niego przy podpinaniu konta CodeChefa;
  gdy proxy jest starsze i nie zna tej ścieżki, liczbę wpisuje się ręcznie.

---

## Bezpieczeństwo

* Hasło nie jest nigdzie zapisywane — ani w przeglądarce, ani w proxy.
  Po zalogowaniu strona trzyma w `localStorage` tylko ciasteczko sesji.
* Sesja daje dostęp do konta na Szkopule, więc na wspólnym komputerze warto
  kliknąć **Wyloguj** (czyści sesję i pobrane wyniki).
* Konta z logowaniem dwuskładnikowym nie przejdą — proxy obsługuje tylko
  zwykły login i hasło i powie o tym wprost.
* Trzymaj `ALLOWED_ORIGINS` ustawione na swoje domeny. Gwiazdka (`*`) otwiera
  proxy na cały internet.

---

## Gdy coś nie działa

| objaw | co sprawdzić |
|---|---|
| „Nie mogę połączyć się z proxy" | czy adres jest dobry i czy worker jest wdrożony; wejdź na `<adres>/ping` — powinno oddać `{"ok":true,"szkopul":"pong"}` |
| „Zły login lub hasło" | te same dane działają na `szkopul.edu.pl/account/login/`? |
| „Sesja Szkopuła wygasła" | normalne po ~2 tygodniach — wystarczy zalogować się ponownie |
| wyniki się nie zmieniają | **Synchronizuj teraz** w okienku Szkopuła; strona sama odświeża je nie częściej niż raz na 15 minut |
| zgłoszenie wisi na „ocenianie…" | Szkopuł czasem ocenia dłużej; po ~6 minutach strona odpuszcza, a wynik dojdzie przy najbliższej synchronizacji |
| przeglądarka mówi o CORS | `ALLOWED_ORIGINS` nie zawiera adresu, z którego otwarta jest strona |

Szkopuł bywa też po prostu wyłączony na czas zawodów — wtedy `/ping` oddaje
błąd i nic z tym nie zrobimy.
