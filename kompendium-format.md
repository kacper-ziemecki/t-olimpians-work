# Kompendium — format tematu (network-data.json)

Duży widok tematu (popup w sekcji *Kompendium* na `net.html`) pokazuje:

- **odtwarzacz** po lewej,
- **listę zagadnień** po prawej — każde zagadnienie to osobny blok z kilkoma filmami i materiałami,
- **tabelę zadań** pod spodem — zawsze dla **wybranego zagadnienia**, z postępem zapisywanym w przeglądarce.

Zagadnienie wybiera się klikając w jego blok po prawej albo w pozycję na liście „Twój postęp” po lewej.

Wszystko da się dodać, usunąć i zmienić na dwa sposoby:

1. **Na stronie** — przycisk „✎ Modyfikuj temat” w nagłówku dużego widoku (albo „✎ Modyfikuj” nad kompendium).
   Po „💾 Zapisz zmiany” mail zawiera **gotowy JSON do wklejenia** w `network-data.json`.
2. **Ręcznie** — edytując `network-data.json` wg schematu poniżej.

---

## Schemat

Poza `name` **wszystkie pola są opcjonalne**.

```jsonc
{
  "cat": "Nazwa kategorii",
  "topics": [
    {
      "name": "Nazwa tematu",
      "tag": "trzeba",              // trzeba | warto | zadanie | rzadkie | ezoteryczne
      "note": "notatka do całego tematu (pokazuje się na górze popupu)",

      // ── stary, płaski format — nadal obsługiwany, ale w danych już nieużywany ──
      // gdyby się pojawił, trafia do zagadnienia „Materiały i zadania” doklejonego na końcu;
      // linki do YouTube/Vimeo same wpadają do odtwarzacza
      "links": [ { "label": "kurs OI", "url": "https://..." } ],
      "tasks": [ { "name": "Kafelki (X OI)", "url": "https://..." } ],

      // ── nowy format: zagadnienia ──
      "sections": [
        {
          "name": "Zagadnienie 1: wprowadzenie",
          "note": "krótki opis zagadnienia",
          "videos": [
            {
              "title": "Czym są sumy prefiksowe",
              "url": "https://youtu.be/XXXXXXXX",   // YouTube (też /live/, /shorts/, ?list=) i Vimeo grają w stronie,
                                                    // reszta dostaje przycisk „Otwórz materiał”
              "author": "T-Olimpians",
              "duration": "12:30"
            }
          ],
          "links": [ { "label": "notatka PDF", "url": "https://..." } ],
          "tasks": [
            {
              "name": "Podzielność (XXIV OI)",
              "url": "https://szkopul.edu.pl/...",
              "platform": "Szkopuł",                // puste = wykrywane z linku (Codeforces, CSES, AtCoder, SPOJ, ...)
              "level": "latwe",                     // latwe | srednie | trudne
              "hint": "spójrz na sumy prefiksowe modulo k",
              "solution": "https://youtu.be/..."    // link pod ikoną ▶ w kolumnie „Rozwiązanie”
            }
          ]
        }
      ]
    }
  ]
}
```

## Uwagi

- **Wszystkie tematy z treścią są już przepakowane w `sections`** — w pliku nie ma luźnych
  `links` / `tasks` poza zagadnieniami. 31 tematów jest pustych (brak materiałów) i czeka na uzupełnienie.
- Filmy z playlist **OKI poziom 2** i **OKI poziom 3** są rozdzielone po pasujących zagadnieniach
  (pole `author` mówi, z której playlisty pochodzi film). Filmy typu „Zadania Olimpijskie”, gale
  i rozmowy zostały pominięte — nie dotyczą jednego tematu.
- Temat **bez** `sections` nadal działa — jego `links` i `tasks` wylądują w jednym zagadnieniu
  „Materiały i zadania”, a linki wideo automatycznie staną się filmami.
- Temat **z** `sections`, który ma dodatkowo `links` / `tasks` na swoim poziomie, pokaże je
  jako doklejone na końcu zagadnienie „Materiały ogólne”.
- Kolejność zagadnień w pliku = kolejność na stronie (kolory pasków nadawane są automatycznie).
- Postęp ucznia (✓ zrobione, ★ zapisane, notatki, obejrzane filmy) trzymany jest w `localStorage`
  pod kluczem `kompendiumPostep_v1` i jest powiązany z **nazwami** kategorii / tematu / zagadnienia / zadania —
  zmiana nazwy resetuje postęp przy tym elemencie.

## Przykłady z pliku

- `LCA (jump pointery)` (*Algorytmy Grafowe*) — dwa zagadnienia, w każdym po jednym filmie z YouTube.
- `Gąsienica/okienko/two pointers` (*Podstawy Programowania*) — zagadnienie zbiorcze z zadaniami OI
  plus osobne zagadnienie na każdy krok kursu CF ITMO (filmy + każde zadanie osobno).
- `Drzewa przedziałowe…` (*Struktury Danych*) — to samo dla lekcji ITMO Segment Tree 1 i 2.
- `Union-find — zadania` (*Struktury Danych*) — filmy OKI i Strivera w jednym zagadnieniu plus kroki ITMO DSU.

## Kurs Codeforces ITMO (codeforces.com/edu/course/2)

Każdy krok (step) każdej lekcji to osobne zagadnienie o nazwie `ITMO <lekcja> · krok N: <opis>` —
z filmami, linkami „teoria i filmy” / „lista zadań” i wszystkimi zadaniami tego kroku (`platform`: „Codeforces EDU”).
Lekcje trafiły do tematów: Suffix Array → `tablica suffiksowa`, Z-функция → `Algorytm Manachera, funkcja Z`,
Segment Tree 1/2 → oba tematy `Drzewa przedziałowe…`, Binary Search → `Wyszukiwanie binarne` (krok 1)
i `Wyszukiwanie binarne po wyniku` (kroki 2–5), DSU → `Union-find — zadania`,
Введение в теорию графов → `Co to jest graf?`, Two Pointers → `Gąsienica/okienko/two pointers`.

- Filmy są na prywatnym Vimeo Codeforces i nie dają się osadzić na innej domenie, więc `url` filmu
  to strona teorii danego kroku — w odtwarzaczu pojawia się przycisk „Otwórz materiał ↗”.
  Tytuły filmów są przepisane z ich okładek na Codeforces.
- Wszystko wymaga zalogowania i zapisania się na kurs; lekcje Z-функция i grafy są tylko po rosyjsku
  (na Codeforces trzeba przełączyć język na RU).

## Zadania T-Olimpians z manipulacji bitami

Temat `Manipulacje bitami i maski bitowe` ma zagadnienia `T-Olimpians · krok 1: …` – `krok 8: …`
z 89 zadaniami ze strony `zadania-tematowe-app/zadania.html` (`platform`: „T-Olimpians”).
**Generuje je skrypt** `python bity-build.py` z treści w `bity-tresc.py` — razem z zadaniami `bity-*`
w `zadania-tematowe-app/zadania.json` (testy, przykłady, wskazówki). Przy każdym uruchomieniu skrypt
podmienia te zagadnienia i tę notatkę tematu, więc zmiany w nich rób w `bity-tresc.py`, a nie ręcznie
w JSON-ie. Pierwsze zagadnienie tematu (filmy i linki) skrypt zostawia bez zmian.
`python bity-build.py --sprawdz` tylko generuje testy i porównuje wzorcówki z rozwiązaniami siłowymi.

Reszta tematów ma na razie po jednym zagadnieniu nazwanym jak temat — rozbicie na mniejsze
zagadnienia robi się przyciskiem „✎ Modyfikuj temat” albo ręcznie w pliku.
