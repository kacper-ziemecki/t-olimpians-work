// Pair — baza zadań na koniec lekcji: od rozgrzewki z jednym pomysłem (czwarty wierzchołek, aukcja, dzwonki, wieże,
// kino, szachownica Polibiusza) przez zadania średnie (prostokąty, punkty niezdominowane, balony, pole działki)
// po trudne (mrówka Langtona, największy trójkąt, pokrycie odcinka, sklep, robot) i wielki finał: klasyfikacja olimpiady.
// Zadania idą od łatwych przez średnie do trudnych.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Kacper', 'Wiktoria'];
    const MIASTA = ['Warszawa', 'Krakow', 'Gdansk', 'Poznan', 'Wroclaw', 'Lodz', 'Szczecin', 'Lublin', 'Bialystok', 'Katowice', 'Torun',
        'Rzeszow', 'Kielce', 'Opole', 'Olsztyn', 'Zielona', 'Gorzow', 'Bydgoszcz', 'Plock', 'Elblag', 'Radom', 'Tarnow', 'Kalisz', 'Legnica'];
    const lines = (s) => s.split('\n');
    const p2 = (x) => String(x).padStart(2, '0');
    const cmp = (a, b) => { for (let i = 0; i < a.length; i++) { if (a[i] < b[i]) return -1; if (a[i] > b[i]) return 1; } return 0; };
    const znaki = (r, n, alfabet) => Array.from({ length: n }, () => alfabet[Math.floor(r() * alfabet.length)]).join('');
    const RUCH = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const KIER = 'GPDL';
    const pol = (x2) => `${(x2 - (x2 % 2n)) / 2n}.${x2 % 2n ? 5 : 0}`; // połowa liczby BigInt: 7 → 3.5

    return [
        // ================================================================ ROZGRZEWKA
        {
            id: 'pair-b-czwarty-wierzcholek', krok: 9, level: 'latwe',
            title: 'Czwarty wierzchołek',
            short: 'Znasz trzy wierzchołki prostokąta o bokach równoległych do osi. Gdzie jest czwarty?',
            tags: ['punkty jako pary', 'wartość, która występuje raz', 'if / else'],
            statement: ['Prostokąt ma boki równoległe do osi układu współrzędnych. Znasz trzy jego wierzchołki (w dowolnej kolejności). Wypisz współrzędne czwartego wierzchołka.'],
            input_format: ['Trzy wiersze, w każdym współrzędne x i y jednego wierzchołka.'],
            output_format: ['Dwie liczby: x i y czwartego wierzchołka.'],
            constraints: ['1 ≤ współrzędne ≤ 1000', 'Prostokąt ma dodatnie pole.'],
            examples: [{ input: '5 5\n5 7\n7 5', note: 'x = 5 występuje dwa razy, a 7 — raz; tak samo y. Brakujący wierzchołek to (7, 7).' }],
            hint: R`W prostokącie każda współrzędna x występuje w wierzchołkach dokładnie dwa razy. Wśród trzech znanych wierzchołków brakujący x to ten, który występuje tylko raz: jeśli a.first == b.first, to brakuje c.first, i tak dalej. Tak samo dla y.`,
            tests: (r) => {
                const gen = () => { const x1 = r.int(1, 999), x2 = r.int(x1 + 1, 1000), y1 = r.int(1, 999), y2 = r.int(y1 + 1, 1000); const w = r.shuffle([[x1, y1], [x1, y2], [x2, y1], [x2, y2]]).slice(0, 3); return w.map((p) => p.join(' ')).join('\n'); };
                return ['5 5\n5 7\n7 5', '1 1\n1000 1000\n1 1000', ...Array.from({ length: 8 }, gen)];
            },
            solve: (inp) => { const v = nums(inp); const xs = [v[0], v[2], v[4]], ys = [v[1], v[3], v[5]]; const raz = (a) => a.find((x) => a.filter((y) => y === x).length === 1); return `${raz(xs)} ${raz(ys)}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    pair<int, int> a, b, c;
    cin >> a.first >> a.second >> b.first >> b.second >> c.first >> c.second;
    int x, y;
    if (a.first == b.first) x = c.first;
    else if (a.first == c.first) x = b.first;
    else x = a.first;
    if (a.second == b.second) y = c.second;
    else if (a.second == c.second) y = b.second;
    else y = a.second;
    cout << x << " " << y << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-aukcja', krok: 9, level: 'latwe',
            title: 'Aukcja',
            short: 'Oferta liczy się tylko wtedy, gdy przebija najlepszą o co najmniej k zł. Kto wygra i za ile?',
            tags: ['{kwota, imie}', 'warunek przebicia', 'BRAK'],
            statement: ['Na aukcji cena wywoławcza to c złotych, a każda kolejna oferta musi przebić dotychczas najwyższą o co najmniej k złotych. Pierwsza ważna oferta musi wynosić co najmniej c. Oferty, które nie spełniają tych warunków, są odrzucane. Wczytaj n ofert (imię i kwota) w kolejności ich składania i wypisz zwycięzcę oraz jego kwotę — czyli ostatnią ważną ofertę. Jeśli żadna oferta nie była ważna, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu c, k i n.', 'W kolejnych n wierszach imię i kwota oferty.'],
            output_format: ['Imię i kwota zwycięskiej oferty albo BRAK.'],
            constraints: ['1 ≤ c, k ≤ 10⁶', '1 ≤ n ≤ 1000', '1 ≤ kwota ≤ 10⁹'],
            examples: [{ input: '100 10 5\nOla 90\nJan 100\nEwa 105\nIgor 115\nOla 120', note: 'Ola (90) jest poniżej ceny wywoławczej. Ewa przebija tylko o 5. Igor przebija Jana o 15, Ola potem Igora o 5 — za mało.' }],
            hint: R`Trzymaj najlepszą ważną ofertę w parze pair<int, string> {kwota, imie} i flagę, czy już jakaś była. Pierwsza ważna oferta to ta ≥ c, każda następna musi mieć kwotę ≥ najlepsza.first + k.`,
            tests: (r) => {
                const gen = (n) => { const c = r.int(1, 1000), k = r.int(1, 50); let cur = c; const of = Array.from({ length: n }, () => { const kw = Math.max(1, cur + r.int(-30, 80)); if (kw >= cur + k) cur = kw; return `${r.pick(IMIONA)} ${kw}`; }); return `${c} ${k} ${n}\n${of.join('\n')}`; };
                return ['100 10 5\nOla 90\nJan 100\nEwa 105\nIgor 115\nOla 120', '50 5 2\nOla 10\nJan 49', '1 1 1\nAl 1', gen(10), gen(1000), gen(100)];
            },
            solve: (inp) => { const t = toks(inp); const c = Number(t[0]), k = Number(t[1]), n = Number(t[2]); let b = null; for (let i = 0; i < n; i++) { const im = t[3 + 2 * i], kw = Number(t[4 + 2 * i]); if ((b === null && kw >= c) || (b !== null && kw >= b[0] + k)) b = [kw, im]; } return b ? `${b[1]} ${b[0]}` : 'BRAK'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int c, k, n;
    cin >> c >> k >> n;
    pair<int, string> najlepsza;
    bool jest = false;
    for (int i = 0; i < n; i++) {
        string imie;
        int kwota;
        cin >> imie >> kwota;
        if ((!jest && kwota >= c) || (jest && kwota >= najlepsza.first + k)) {
            najlepsza = {kwota, imie};
            jest = true;
        }
    }
    if (jest) cout << najlepsza.second << " " << najlepsza.first << "\n";
    else cout << "BRAK\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-kurier', krok: 9, level: 'latwe',
            title: 'Trasa kuriera',
            short: 'Kurier wyjeżdża z bazy, odwiedza punkty po kolei i wraca. Ile przejedzie ulicami miasta?',
            tags: ['punkt poprzedni i obecny', 'abs', 'long long'],
            statement: ['Kurier startuje z bazy w punkcie (0, 0), odwiedza n punktów w podanej kolejności i na koniec wraca do bazy. Jeździ ulicami ułożonymi w kratkę, więc przejazd z (x₁, y₁) do (x₂, y₂) ma długość |x₁ − x₂| + |y₁ − y₂|. Wypisz długość całej trasy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne punktów.'],
            output_format: ['Długość trasy.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁶ ≤ współrzędne ≤ 10⁶'],
            examples: [{ input: '2\n3 4\n-1 4', note: 'Z bazy do (3, 4): 7. Do (−1, 4): 4. Powrót: 5. Razem 16.' }],
            hint: R`Trzymaj poprzedni punkt w parze (na start {0, 0}). Dla każdego nowego punktu dodaj odległość od poprzedniego i zrób go poprzednim. Na końcu dodaj powrót do bazy. Suma może przekroczyć int.`,
            tests: (r) => ['2\n3 4\n-1 4', '1\n0 0', '1\n1000000 -1000000', `1000\n${Array.from({ length: 1000 }, () => `${r.int(-1e6, 1e6)} ${r.int(-1e6, 1e6)}`).join('\n')}`, `20\n${Array.from({ length: 20 }, () => `${r.int(-9, 9)} ${r.int(-9, 9)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); let px = 0, py = 0, s = 0; for (let i = 0; i < v[0]; i++) { const x = v[1 + 2 * i], y = v[2 + 2 * i]; s += Math.abs(x - px) + Math.abs(y - py); px = x; py = y; } s += Math.abs(px) + Math.abs(py); return String(s); },
            cpp: R`
#include <iostream>
#include <cstdlib>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> poprz = {0, 0};
    long long trasa = 0;
    for (int i = 0; i < n; i++) {
        pair<int, int> p;
        cin >> p.first >> p.second;
        trasa += abs(p.first - poprz.first) + abs(p.second - poprz.second);
        poprz = p;
    }
    trasa += abs(poprz.first) + abs(poprz.second);
    cout << trasa << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-wspolny-wolny-czas', krok: 9, level: 'latwe',
            title: 'Wspólny wolny czas',
            short: 'Każdy z przyjaciół jest wolny w pewnym przedziale. Kiedy wszyscy naraz? Późniejszy początek, wcześniejszy koniec.',
            tags: ['przedziały', 'max początków, min końców', 'BRAK'],
            statement: ['n przyjaciół chce się spotkać. Każdy podał przedział [a, b] (w minutach od początku dnia), w którym jest wolny — razem z oboma końcami. Wypisz przedział czasu, w którym wolni są wszyscy naraz, jako dwie liczby: początek i koniec. Jeśli takiej chwili nie ma, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach początek a i koniec b przedziału.'],
            output_format: ['Dwie liczby albo BRAK.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ a ≤ b ≤ 1440'],
            examples: [{ input: '3\n600 900\n700 1000\n650 720' }, { input: '2\n0 100\n101 200' }],
            hint: R`Wspólna część wszystkich przedziałów to [największy z początków, najmniejszy z końców]. Trzymaj ją w jednej parze i poprawiaj po każdym przedziale przez max i min. Na końcu sprawdź, czy początek nie wypadł za końcem.`,
            tests: (r) => {
                const gen = (n, lo, hi) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(0, lo), b = r.int(Math.max(a, hi), 1440); return `${a} ${b}`; }).join('\n')}`;
                return ['3\n600 900\n700 1000\n650 720', '2\n0 100\n101 200', '1\n5 5', '2\n0 100\n100 200', gen(1000, 700, 720), gen(1000, 800, 600), gen(10, 1440, 0)];
            },
            check: (inp) => { const v = nums(inp); for (let i = 0; i < v[0]; i++) if (v[1 + 2 * i] > v[2 + 2 * i]) return 'a > b'; return null; },
            solve: (inp) => { const v = nums(inp); let a = -Infinity, b = Infinity; for (let i = 0; i < v[0]; i++) { a = Math.max(a, v[1 + 2 * i]); b = Math.min(b, v[2 + 2 * i]); } return a <= b ? `${a} ${b}` : 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> w = {0, 1440};
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        w = {max(w.first, a), min(w.second, b)};
    }
    if (w.first <= w.second) cout << w.first << " " << w.second << "\n";
    else cout << "BRAK\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-dzwonki', krok: 9, level: 'latwe',
            title: 'Dzwonki',
            short: 'Lekcje trwają po 45 minut. Czy o podanej godzinie trwa lekcja, przerwa, czy jest przed albo po lekcjach?',
            tags: ['godziny jako pary', 'minuty od północy', 'przedziały [od, do)'],
            statement: ['W szkole jest n lekcji, każda trwa 45 minut. Znasz godziny rozpoczęcia lekcji (w kolejności, lekcje się nie nakładają). Dla każdej z q godzin wypisz: LEKCJA i — jeśli w tej chwili trwa lekcja numer i (lekcja zaczynająca się o 8:00 trwa od 8:00 do 8:44 włącznie, a o 8:45 już się skończyła); PRZERWA — jeśli to czas między lekcjami; PRZED — jeśli pierwsza lekcja jeszcze się nie zaczęła; PO — jeśli ostatnia lekcja już się skończyła.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach godzina i minuta rozpoczęcia lekcji.', 'Potem liczba q i q wierszy z godzinami (godzina i minuta).'],
            output_format: ['q wierszy: LEKCJA i, PRZERWA, PRZED albo PO.'],
            constraints: ['1 ≤ n ≤ 12', '1 ≤ q ≤ 1000', 'Lekcje kończą się przed północą.'],
            examples: [{ input: '3\n8 0\n8 55\n9 50\n5\n7 59\n8 0\n8 50\n10 34\n10 35' }],
            hint: R`Zamień godziny na minuty od północy. Lekcja i trwa w przedziale [start_i, start_i + 45). Najpierw sprawdź PRZED i PO, a potem przejdź pętlą po lekcjach — jeśli żadna nie trwa, to przerwa.`,
            tests: (r) => {
                const gen = (n, q) => { const st = []; let t = r.int(420, 540); for (let i = 0; i < n; i++) { st.push(t); t += 45 + r.pick([5, 10, 10, 15, 20, 0]); } const q2 = Array.from({ length: q }, () => { const m = r.pick([r.int(0, 1439), r.int(st[0] - 10, t), st[r.int(0, n - 1)], st[r.int(0, n - 1)] + 44, st[r.int(0, n - 1)] + 45]); const mm = Math.min(1439, Math.max(0, m)); return `${Math.floor(mm / 60)} ${mm % 60}`; }); return `${n}\n${st.map((m) => `${Math.floor(m / 60)} ${m % 60}`).join('\n')}\n${q}\n${q2.join('\n')}`; };
                return ['3\n8 0\n8 55\n9 50\n5\n7 59\n8 0\n8 50\n10 34\n10 35', gen(1, 10), gen(8, 200), gen(12, 1000)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const st = []; for (let i = 0; i < n; i++) st.push(v[1 + 2 * i] * 60 + v[2 + 2 * i]); const q = v[1 + 2 * n]; const out = []; for (let k = 0; k < q; k++) { const t = v[2 + 2 * n + 2 * k] * 60 + v[3 + 2 * n + 2 * k]; if (t < st[0]) out.push('PRZED'); else if (t >= st[n - 1] + 45) out.push('PO'); else { const i = st.findIndex((s) => s <= t && t < s + 45); out.push(i >= 0 ? `LEKCJA ${i + 1}` : 'PRZERWA'); } } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> lekcja[15];
    int start[15];
    for (int i = 0; i < n; i++) {
        cin >> lekcja[i].first >> lekcja[i].second;
        start[i] = lekcja[i].first * 60 + lekcja[i].second;
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        pair<int, int> g;
        cin >> g.first >> g.second;
        int t = g.first * 60 + g.second;
        if (t < start[0]) {
            cout << "PRZED\n";
        } else if (t >= start[n - 1] + 45) {
            cout << "PO\n";
        } else {
            int ktora = -1;
            for (int i = 0; i < n; i++) {
                if (start[i] <= t && t < start[i] + 45) ktora = i + 1;
            }
            if (ktora == -1) cout << "PRZERWA\n";
            else cout << "LEKCJA " << ktora << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'pair-b-pociagi', krok: 9, level: 'latwe',
            title: 'Najbliższy pociąg',
            short: 'Rozkład jazdy to godziny odjazdów. O której odjedzie najbliższy pociąg? Może dopiero jutro.',
            tags: ['godziny jako pary', 'najmniejsza ≥ t', 'jutro rano'],
            statement: ['Z dworca codziennie odjeżdża n pociągów, o podanych godzinach (w dowolnej kolejności). Pasażer przychodzi na dworzec o godzinie t. O której odjedzie najbliższy pociąg? Jeśli o godzinie t akurat odjeżdża pociąg, pasażer zdąży. Jeśli dziś nie ma już żadnego pociągu, pojedzie pierwszym jutro rano. Odpowiedz na q pytań, wypisując godziny w postaci HH:MM.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach godziny odjazdów (godzina i minuta).', 'Potem liczba q i q wierszy z godzinami przyjścia pasażerów.'],
            output_format: ['q wierszy z godzinami odjazdu w postaci HH:MM.'],
            constraints: ['1 ≤ n, q ≤ 1000'],
            examples: [{ input: '3\n12 30\n6 15\n18 0\n4\n6 0\n12 30\n12 31\n23 59' }],
            hint: R`Godziny trzymaj jako pary (godzina, minuta) — porównują się chronologicznie. Szukaj najmniejszej pary, która jest ≥ godziny pasażera. Jeśli takiej nie ma, odpowiedzią jest najmniejsza para w ogóle — pierwszy pociąg następnego dnia.`,
            tests: (r) => {
                const g = () => [r.int(0, 23), r.int(0, 59)];
                const gen = (n, q) => `${n}\n${Array.from({ length: n }, () => g().join(' ')).join('\n')}\n${q}\n${Array.from({ length: q }, () => g().join(' ')).join('\n')}`;
                return ['3\n12 30\n6 15\n18 0\n4\n6 0\n12 30\n12 31\n23 59', gen(1, 5), gen(1000, 1000), gen(5, 100)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const d = []; for (let i = 0; i < n; i++) d.push([v[1 + 2 * i], v[2 + 2 * i]]); const q = v[1 + 2 * n]; const out = []; for (let k = 0; k < q; k++) { const t = [v[2 + 2 * n + 2 * k], v[3 + 2 * n + 2 * k]]; let b = null; for (const x of d) if (cmp(x, t) >= 0 && (!b || cmp(x, b) < 0)) b = x; if (!b) { b = d[0]; for (const x of d) if (cmp(x, b) < 0) b = x; } out.push(`${p2(b[0])}:${p2(b[1])}`); } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> d[1005];
    for (int i = 0; i < n; i++) {
        cin >> d[i].first >> d[i].second;
    }
    pair<int, int> pierwszy = d[0];
    for (int i = 0; i < n; i++) pierwszy = min(pierwszy, d[i]);
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        pair<int, int> t;
        cin >> t.first >> t.second;
        pair<int, int> najl = {99, 99};
        for (int i = 0; i < n; i++) {
            if (d[i] >= t && d[i] < najl) najl = d[i];
        }
        if (najl.first == 99) najl = pierwszy;
        if (najl.first < 10) cout << "0";
        cout << najl.first << ":";
        if (najl.second < 10) cout << "0";
        cout << najl.second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-b-wieze', krok: 9, level: 'latwe',
            title: 'Wieże na szachownicy',
            short: 'Ile par wież widzi się nawzajem w tym samym wierszu albo kolumnie? Policz wieże w każdym wierszu i kolumnie.',
            tags: ['pozycje jako pary', 'liczniki wierszy i kolumn', 'k · (k − 1) / 2'],
            statement: ['Na szachownicy N × N stoi n wież, każda na innym polu (wiersz i kolumna od 1 do N). Dwie wieże atakują się, jeśli stoją w tym samym wierszu albo w tej samej kolumnie — inne wieże między nimi nie przeszkadzają. Policz, ile jest par atakujących się wież.'],
            input_format: ['W pierwszym wierszu N i n.', 'W kolejnych n wierszach pozycje wież: wiersz i kolumna.'],
            output_format: ['Liczba par atakujących się wież.'],
            constraints: ['1 ≤ N ≤ 1000', '1 ≤ n ≤ 5000', 'Wieże stoją na różnych polach.'],
            examples: [{ input: '4 4\n1 1\n1 3\n2 3\n4 2', note: 'Pary: wieże z (1, 1) i (1, 3) — ten sam wiersz; z (1, 3) i (2, 3) — ta sama kolumna.' }],
            hint: R`Policz, ile wież stoi w każdym wierszu (int wiersz[1005]) i w każdej kolumnie. k wież w jednym wierszu tworzy k · (k − 1) / 2 par. Zsumuj to po wszystkich wierszach i kolumnach — dwie różne wieże nie mogą mieć naraz tego samego wiersza i kolumny, więc nic nie liczy się dwa razy.`,
            check: (inp) => { const v = nums(inp); const s = new Set(); for (let i = 0; i < v[1]; i++) { const k = `${v[2 + 2 * i]},${v[3 + 2 * i]}`; if (s.has(k)) return 'powtórzone pole'; s.add(k); } return null; },
            tests: (r) => {
                const gen = (N, n) => { const s = new Set(); while (s.size < n) s.add(`${r.int(1, N)} ${r.int(1, N)}`); return `${N} ${n}\n${[...s].join('\n')}`; };
                return ['4 4\n1 1\n1 3\n2 3\n4 2', '1 1\n1 1', gen(8, 8), gen(1000, 5000), gen(80, 5000), gen(10, 60)];
            },
            solve: (inp) => { const v = nums(inp); const w = {}, k = {}; for (let i = 0; i < v[1]; i++) { w[v[2 + 2 * i]] = (w[v[2 + 2 * i]] || 0) + 1; k[v[3 + 2 * i]] = (k[v[3 + 2 * i]] || 0) + 1; } let s = 0; for (const x of [...Object.values(w), ...Object.values(k)]) s += x * (x - 1) / 2; return String(s); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int N, n;
    cin >> N >> n;
    int wiersz[1005] = {}, kolumna[1005] = {};
    for (int i = 0; i < n; i++) {
        pair<int, int> p;
        cin >> p.first >> p.second;
        wiersz[p.first]++;
        kolumna[p.second]++;
    }
    long long pary = 0;
    for (int i = 1; i <= N; i++) {
        pary += (long long)wiersz[i] * (wiersz[i] - 1) / 2;
        pary += (long long)kolumna[i] * (kolumna[i] - 1) / 2;
    }
    cout << pary << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-kino', krok: 9, level: 'latwe',
            title: 'Rezerwacje w kinie',
            short: 'Rezerwacje przychodzą jedna po drugiej. Miejsce wolne — OK, zajęte — ZAJETE. Ile zostało wolnych?',
            tags: ['miejsce jako para', 'tablica bool', 'licznik wolnych'],
            statement: ['Sala kinowa ma R rzędów po S miejsc. Do kasy przychodzi k próśb o rezerwację — każda to numer rzędu i numer miejsca (od 1). Jeśli miejsce jest wolne, kasa je rezerwuje i wypisuje OK. Jeśli jest już zajęte, wypisuje ZAJETE. Na koniec wypisz, ile miejsc w sali zostało wolnych.'],
            input_format: ['W pierwszym wierszu R, S i k.', 'W kolejnych k wierszach rząd i miejsce.'],
            output_format: ['k wierszy: OK albo ZAJETE.', 'Ostatni wiersz: liczba wolnych miejsc.'],
            constraints: ['1 ≤ R, S ≤ 50', '1 ≤ k ≤ 2500'],
            examples: [{ input: '2 3 4\n1 2\n2 3\n1 2\n1 1' }],
            hint: R`Trzymaj zajętość w tablicy bool zajete[55][55] = {};. Prośbę wczytaj do pary i sprawdź zajete[rzad][miejsce]. Licznik wolnych startuje od R · S i maleje przy każdym OK.`,
            tests: (r) => {
                const gen = (R, S, k) => `${R} ${S} ${k}\n${Array.from({ length: k }, () => `${r.int(1, R)} ${r.int(1, S)}`).join('\n')}`;
                return ['2 3 4\n1 2\n2 3\n1 2\n1 1', '1 1 2\n1 1\n1 1', gen(10, 10, 100), gen(50, 50, 2500), gen(3, 4, 30)];
            },
            solve: (inp) => { const v = nums(inp); const [R, S, k] = v; const z = new Set(); const out = []; for (let i = 0; i < k; i++) { const key = `${v[3 + 2 * i]},${v[4 + 2 * i]}`; if (z.has(key)) out.push('ZAJETE'); else { z.add(key); out.push('OK'); } } out.push(String(R * S - z.size)); return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int R, S, k;
    cin >> R >> S >> k;
    bool zajete[55][55] = {};
    int wolne = R * S;
    for (int i = 0; i < k; i++) {
        pair<int, int> m;
        cin >> m.first >> m.second;
        if (zajete[m.first][m.second]) {
            cout << "ZAJETE\n";
        } else {
            zajete[m.first][m.second] = true;
            wolne--;
            cout << "OK\n";
        }
    }
    cout << wolne << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-polibiusz', krok: 9, level: 'latwe',
            title: 'Szachownica Polibiusza',
            short: 'Starożytny szyfr: każda litera to para (wiersz, kolumna) w kwadracie 5 × 5.',
            tags: ['pozycja litery jako para', 'find', 'p / 5 i p % 5'],
            statement: ['Grecki historyk Polibiusz szyfrował litery, wpisując alfabet w kwadrat 5 × 5: w pierwszym wierszu ABCDE, w drugim FGHIK, w trzecim LMNOP, w czwartym QRSTU, w piątym VWXYZ (litera J nie ma własnego pola — zapisuje się ją jak I). Każda litera to para liczb: numer wiersza i numer kolumny (od 1 do 5). Zaszyfruj słowo: dla każdej litery wypisz dwie cyfry — wiersz i kolumnę — a kody kolejnych liter oddziel spacjami.'],
            input_format: ['Jeden wiersz ze słowem z wielkich liter.'],
            output_format: ['Kody kolejnych liter oddzielone spacjami.'],
            constraints: ['Słowo ma od 1 do 1000 liter.'],
            examples: [{ input: 'HELLO', note: 'H stoi w wierszu 2 i kolumnie 3 — kod 23. E to 15, L to 31, O to 34.' }, { input: 'JAJO' }],
            hint: R`Zapisz kwadrat jako napis string k = "ABCDEFGHIKLMNOPQRSTUVWXYZ"; (bez J). Literę J zamień na I. Pozycja p = k.find(c), a para (wiersz, kolumna) to {p / 5 + 1, p % 5 + 1}.`,
            tests: (r) => ['HELLO', 'JAJO', 'Z', 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', znaki(r, 1000, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'), 'OLIMPIADA'],
            solve: (inp) => { const K = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; return [...inp.trim()].map((c) => { const p = K.indexOf(c === 'J' ? 'I' : c); return `${Math.floor(p / 5) + 1}${p % 5 + 1}`; }).join(' '); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string k = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
    string s;
    cin >> s;
    for (char c : s) {
        if (c == 'J') c = 'I';
        int p = k.find(c);
        pair<int, int> poz = {p / 5 + 1, p % 5 + 1};
        cout << poz.first << poz.second << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-skok-w-dal', krok: 9, level: 'latwe',
            title: 'Skok w dal',
            short: 'Każdy ma trzy próby. Wygrywa najlepszy skok, a przy remisie — drugi najlepszy. Para {najlepszy, drugi}.',
            tags: ['{najlepszy, drugi}', 'ostro większa', 'spalone próby'],
            statement: ['W konkursie skoku w dal każdy z n zawodników (numerowanych od 1) oddał trzy skoki. Skok spalony zapisano jako 0. Wygrywa zawodnik z najdłuższym skokiem; przy remisie decyduje jego drugi najlepszy skok, a gdy i ten jest równy — mniejszy numer. Wypisz numer zwycięzcy i jego najlepszy skok.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po trzy liczby — długości skoków w centymetrach (0 to skok spalony).'],
            output_format: ['Numer zwycięzcy i jego najlepszy skok.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każdy skok to 0 albo liczba od 100 do 900.'],
            examples: [{ input: '3\n650 0 702\n702 690 0\n0 702 640', note: 'Wszyscy mają 702. Drugie skoki: 650, 690 i 640 — wygrywa zawodnik 2.' }],
            hint: R`Dla każdego zawodnika ustal najlepszy i drugi najlepszy skok (np. porządkując trzy liczby zamianami albo sort na tablicy trzech liczb). Klucz {najlepszy, drugi} porównuj z rekordem i zmieniaj rekord tylko przy ostro większym kluczu.`,
            tests: (r) => {
                const skok = () => (r() < 0.2 ? 0 : r.int(100, 900));
                return ['3\n650 0 702\n702 690 0\n0 702 640', '1\n0 0 0', '2\n500 500 0\n500 0 500', `1000\n${Array.from({ length: 1000 }, () => `${skok()} ${skok()} ${skok()}`).join('\n')}`, `50\n${Array.from({ length: 50 }, () => `${r.pick([0, 600, 601])} ${r.pick([0, 600, 601])} ${r.pick([0, 599, 600])}`).join('\n')}`];
            },
            solve: (inp) => { const v = nums(inp); let b = null, k = 0; for (let i = 0; i < v[0]; i++) { const s = v.slice(1 + 3 * i, 4 + 3 * i).sort((a, c) => c - a); const key = [s[0], s[1]]; if (!b || cmp(key, b) > 0) { b = key; k = i + 1; } } return `${k} ${b[0]}`; },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> rekord = {-1, -1};
    int kto = 0;
    for (int i = 1; i <= n; i++) {
        int s[3];
        cin >> s[0] >> s[1] >> s[2];
        sort(s, s + 3);                     // rosnąco: s[2] najlepszy, s[1] drugi
        pair<int, int> klucz = {s[2], s[1]};
        if (klucz > rekord) {
            rekord = klucz;
            kto = i;
        }
    }
    cout << kto << " " << rekord.first << "\n";
    return 0;
}`,
        },

        // ================================================================ ŚREDNIE
        {
            id: 'pair-b-przeciecie-prostokatow', krok: 9, level: 'srednie',
            title: 'Przecięcie prostokątów',
            short: 'Dwa prostokąty o bokach wzdłuż osi. Jakie pole ma ich część wspólna?',
            tags: ['rogi jako pary', 'max i min', 'long long'],
            statement: ['Prostokąt o bokach równoległych do osi opisują dwa rogi: lewy dolny (x₁, y₁) i prawy górny (x₂, y₂). Dla każdej z q par prostokątów wypisz pole ich części wspólnej (0, jeśli się nie pokrywają albo tylko stykają).'],
            input_format: ['W pierwszym wierszu liczba q.', 'W kolejnych q wierszach po osiem liczb: x₁ y₁ x₂ y₂ pierwszego prostokąta i tak samo drugiego.'],
            output_format: ['q wierszy z polami części wspólnych.'],
            constraints: ['1 ≤ q ≤ 100', '−10⁹ ≤ współrzędne ≤ 10⁹', 'x₁ < x₂ i y₁ < y₂ w każdym prostokącie.'],
            examples: [{ input: '3\n0 0 4 3 2 1 6 5\n0 0 1 1 1 0 2 1\n-5 -5 5 5 -1 -1 1 1' }],
            hint: R`Szerokość części wspólnej to min(x₂, X₂) − max(x₁, X₁), wysokość — tak samo dla y. Jeśli któraś wyjdzie ujemna albo zero, pole jest 0. Pole może sięgać 4 · 10¹⁸ — licz w long long.`,
            check: (inp) => { const v = nums(inp); for (let i = 0; i < v[0]; i++) { const t = v.slice(1 + 8 * i, 9 + 8 * i); if (!(t[0] < t[2] && t[1] < t[3] && t[4] < t[6] && t[5] < t[7])) return 'zły prostokąt'; } return null; },
            tests: (r) => {
                const pr = (z) => { const a = r.int(-z, z - 1), b = r.int(a + 1, z), c = r.int(-z, z - 1), d = r.int(c + 1, z); return `${a} ${c} ${b} ${d}`; };
                return ['3\n0 0 4 3 2 1 6 5\n0 0 1 1 1 0 2 1\n-5 -5 5 5 -1 -1 1 1', `1\n-1000000000 -1000000000 1000000000 1000000000 -1000000000 -1000000000 1000000000 1000000000`, `100\n${Array.from({ length: 100 }, () => `${pr(10)} ${pr(10)}`).join('\n')}`, `100\n${Array.from({ length: 100 }, () => `${pr(1e9)} ${pr(1e9)}`).join('\n')}`];
            },
            solve: (inp) => { const v = nums(inp).map(BigInt); const out = []; const mx = (a, b) => (a > b ? a : b), mn = (a, b) => (a < b ? a : b); for (let i = 0; i < Number(v[0]); i++) { const [a, b, c, d, e, f, g, hh] = v.slice(1 + 8 * i, 9 + 8 * i); const w = mn(c, g) - mx(a, e), hg = mn(d, hh) - mx(b, f); out.push(w > 0n && hg > 0n ? String(w * hg) : '0'); } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        pair<long long, long long> a1, a2, b1, b2;
        cin >> a1.first >> a1.second >> a2.first >> a2.second;
        cin >> b1.first >> b1.second >> b2.first >> b2.second;
        long long szer = min(a2.first, b2.first) - max(a1.first, b1.first);
        long long wys = min(a2.second, b2.second) - max(a1.second, b1.second);
        if (szer > 0 && wys > 0) cout << szer * wys << "\n";
        else cout << 0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-b-od-najblizszego', krok: 9, level: 'srednie',
            title: 'Od najbliższego',
            short: 'Posortuj punkty według odległości od (0, 0), a przy remisie według (x, y). Klucz {x² + y², {x, y}}.',
            tags: ['para w parze', 'sort', 'odległość bez pierwiastka'],
            statement: ['Wczytaj n punktów i wypisz je posortowane według odległości od początku układu (0, 0) — od najbliższego. Punkty w tej samej odległości ustaw według x rosnąco, a przy równym x — według y rosnąco.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne punktów.'],
            output_format: ['n wierszy z punktami w nowej kolejności.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁴ ≤ x, y ≤ 10⁴'],
            examples: [{ input: '5\n3 4\n-1 0\n0 5\n1 1\n-4 3' }],
            hint: R`Zamiast odległości porównuj jej kwadrat x² + y² — kolejność jest ta sama, a nie ma pierwiastków. Klucz pair<int, pair<int, int>> {x*x + y*y, {x, y}} posortowany przez sort daje dokładnie żądaną kolejność.`,
            tests: (r) => ['5\n3 4\n-1 0\n0 5\n1 1\n-4 3', '1\n0 0', `1000\n${Array.from({ length: 1000 }, () => `${r.int(-1e4, 1e4)} ${r.int(-1e4, 1e4)}`).join('\n')}`, `200\n${Array.from({ length: 200 }, () => `${r.int(-5, 5)} ${r.int(-5, 5)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const t = []; for (let i = 0; i < v[0]; i++) { const x = v[1 + 2 * i], y = v[2 + 2 * i]; t.push([x * x + y * y, x, y]); } return t.sort(cmp).map((p) => `${p[1]} ${p[2]}`).join('\n'); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, pair<int, int>> t[1005];
    for (int i = 0; i < n; i++) {
        int x, y;
        cin >> x >> y;
        t[i] = {x * x + y * y, {x, y}};
    }
    sort(t, t + n);
    for (int i = 0; i < n; i++) {
        cout << t[i].second.first << " " << t[i].second.second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-b-niezdominowane', krok: 9, level: 'srednie',
            title: 'Punkty niezdominowane',
            short: 'Punkt jest zdominowany, gdy inny ma i x, i y nie mniejsze. Które punkty nikt nie dominuje?',
            tags: ['każdy z każdym albo sort', 'pary', 'front Pareto'],
            statement: ['Wczytaj n różnych punktów. Punkt A jest zdominowany, jeśli istnieje inny punkt B, który ma x co najmniej tak duży jak A i y co najmniej tak duży jak A. Wypisz liczbę punktów niezdominowanych, a potem same te punkty — posortowane według x rosnąco — każdy w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne punktów.'],
            output_format: ['Liczba punktów niezdominowanych i te punkty, każdy w osobnym wierszu.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ x, y ≤ 10⁶', 'Punkty są różne.'],
            examples: [{ input: '5\n1 5\n2 3\n4 4\n3 1\n5 2', note: '(2, 3) dominuje (4, 4), a (3, 1) dominuje (5, 2). Zostają (1, 5), (4, 4) i (5, 2).' }],
            hint: R`Najprościej: dla każdego punktu sprawdź pętlą wszystkie pozostałe. Sprytniej: posortuj punkty i przejdź od największego x, pamiętając największe y widziane do tej pory — punkt jest niezdominowany, gdy jego y przebija to maksimum. Pamiętaj, że punkt z takim samym x, ale większym y, też dominuje.`,
            check: (inp) => { const v = nums(inp); const s = new Set(); for (let i = 0; i < v[0]; i++) { const k = `${v[1 + 2 * i]},${v[2 + 2 * i]}`; if (s.has(k)) return 'powtórzony punkt'; s.add(k); } return null; },
            tests: (r) => {
                const gen = (n, z) => { const s = new Set(); while (s.size < n) s.add(`${r.int(0, z)} ${r.int(0, z)}`); return `${n}\n${[...s].join('\n')}`; };
                const front = (n) => { const s = new Set(); while (s.size < n) { const x = r.int(0, 1e6); s.add(`${x} ${Math.max(0, 1e6 - x + r.int(-3, 0))}`); } return `${n}\n${[...s].join('\n')}`; };
                return ['5\n1 5\n2 3\n4 4\n3 1\n5 2', '1\n7 7', gen(1000, 1e6), gen(1000, 40), front(500), gen(20, 5)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const t = []; for (let i = 0; i < n; i++) t.push([v[1 + 2 * i], v[2 + 2 * i]]); const w = t.filter((a, i) => !t.some((b, j) => j !== i && b[0] >= a[0] && b[1] >= a[1])); w.sort(cmp); return [String(w.length), ...w.map((p) => p.join(' '))].join('\n'); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005], w[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    int ile = 0;
    for (int i = 0; i < n; i++) {
        bool zdominowany = false;
        for (int j = 0; j < n; j++) {
            if (j != i && t[j].first >= t[i].first && t[j].second >= t[i].second) {
                zdominowany = true;
                break;
            }
        }
        if (!zdominowany) w[ile++] = t[i];
    }
    sort(w, w + ile);
    cout << ile << "\n";
    for (int i = 0; i < ile; i++) {
        cout << w[i].first << " " << w[i].second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-b-symetria', krok: 9, level: 'srednie',
            title: 'Symetria względem środka',
            short: 'Czy zbiór punktów wygląda tak samo po obrocie o pół obrotu wokół (0, 0)? Dla (x, y) musi być (−x, −y).',
            tags: ['szukanie pary', 'para == para', 'sort + porównanie'],
            statement: ['Wczytaj n różnych punktów. Zbiór jest symetryczny względem początku układu, jeśli dla każdego punktu (x, y) w zbiorze jest też punkt (−x, −y). (Punkt (0, 0) jest symetryczny sam do siebie.) Wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne punktów.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ x, y ≤ 10⁹', 'Punkty są różne.'],
            examples: [{ input: '4\n1 2\n-1 -2\n3 0\n-3 0' }, { input: '2\n1 1\n-1 1' }],
            hint: R`Dla każdego punktu poszukaj w tablicy punktu {-x, -y} — porównując całe pary przez ==. Albo sprytniej: posortuj punkty i posortuj ich „odbicia” (−x, −y) — zbiór jest symetryczny dokładnie wtedy, gdy obie posortowane tablice są takie same.`,
            check: (inp) => { const v = nums(inp); const s = new Set(); for (let i = 0; i < v[0]; i++) { const k = `${v[1 + 2 * i]},${v[2 + 2 * i]}`; if (s.has(k)) return 'powtórzony punkt'; s.add(k); } return null; },
            tests: (r) => {
                const sym = (n, z, zepsuj) => { const s = new Set(); while (s.size < n - 1) { const x = r.int(-z, z), y = r.int(-z, z); s.add(`${x} ${y}`); s.add(`${-x} ${-y}`); } let a = [...s]; if (zepsuj) { let p; do { p = `${r.int(-z, z)} ${r.int(-z, z)}`; } while (s.has(p)); a[r.int(0, a.length - 1)] = p; a = [...new Set(a)]; } return `${a.length}\n${r.shuffle(a).join('\n')}`; };
                return ['4\n1 2\n-1 -2\n3 0\n-3 0', '2\n1 1\n-1 1', '1\n0 0', '1\n5 5', sym(1000, 1e9, false), sym(1000, 1e9, true), sym(400, 20, false), sym(400, 20, true)];
            },
            solve: (inp) => { const v = nums(inp); const s = new Set(); for (let i = 0; i < v[0]; i++) s.add(`${v[1 + 2 * i]},${v[2 + 2 * i]}`); for (let i = 0; i < v[0]; i++) if (!s.has(`${-v[1 + 2 * i]},${-v[2 + 2 * i]}`)) return 'NIE'; return 'TAK'; },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> a[1005], b[1005];
    for (int i = 0; i < n; i++) {
        cin >> a[i].first >> a[i].second;
        b[i] = {-a[i].first, -a[i].second};
    }
    sort(a, a + n);
    sort(b, b + n);
    bool ok = true;
    for (int i = 0; i < n; i++) {
        if (a[i] != b[i]) ok = false;
    }
    cout << (ok ? "TAK" : "NIE") << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-najblizsze-miasto', krok: 9, level: 'srednie',
            title: 'Najbliższe miasto',
            short: 'Dla każdego punktu na mapie wskaż najbliższe miasto. Remis? Wygrywa nazwa wcześniejsza alfabetycznie.',
            tags: ['{odległość, nazwa}', 'min', 'tablica miast'],
            statement: ['Na mapie jest n miast — każde ma nazwę i współrzędne. Dla każdego z q punktów wypisz nazwę miasta, które leży najbliżej, gdy odległość mierzymy jak taksówkarz: |x₁ − x₂| + |y₁ − y₂|. Jeśli kilka miast leży równie blisko, wybierz nazwę wcześniejszą w alfabecie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach: nazwa miasta, x i y.', 'Potem liczba q i q wierszy ze współrzędnymi punktów.'],
            output_format: ['q wierszy z nazwami miast.'],
            constraints: ['1 ≤ n ≤ 24', '1 ≤ q ≤ 1000', 'Nazwy miast są różne.', '−10⁶ ≤ współrzędne ≤ 10⁶'],
            examples: [{ input: '3\nKrakow 0 0\nWarszawa 0 10\nGdansk 5 15\n3\n0 4\n0 5\n3 12', note: 'Punkt (0, 5) jest w tej samej odległości od Krakowa i Warszawy — wygrywa Krakow (K przed W).' }],
            hint: R`Dla każdego punktu szukaj najmniejszej pary pair<int, string> {odległość, nazwa}. Przy równej odległości mniejsza para ma nazwę wcześniejszą w alfabecie — remis rozstrzyga się sam.`,
            tests: (r) => {
                const gen = (n, q, z) => { const m = r.shuffle(MIASTA).slice(0, n); return `${n}\n${m.map((x) => `${x} ${r.int(-z, z)} ${r.int(-z, z)}`).join('\n')}\n${q}\n${Array.from({ length: q }, () => `${r.int(-z, z)} ${r.int(-z, z)}`).join('\n')}`; };
                return ['3\nKrakow 0 0\nWarszawa 0 10\nGdansk 5 15\n3\n0 4\n0 5\n3 12', gen(1, 3, 10), gen(24, 1000, 1e6), gen(24, 500, 10), gen(10, 200, 4)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const m = []; for (let i = 0; i < n; i++) m.push([t[1 + 3 * i], Number(t[2 + 3 * i]), Number(t[3 + 3 * i])]); const q = Number(t[1 + 3 * n]); const out = []; for (let k = 0; k < q; k++) { const x = Number(t[2 + 3 * n + 2 * k]), y = Number(t[3 + 3 * n + 2 * k]); let b = null; for (const [nz, a, c] of m) { const key = [Math.abs(a - x) + Math.abs(c - y), nz]; if (!b || cmp(key, b) < 0) b = key; } out.push(b[1]); } return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <cstdlib>
using namespace std;
int main() {
    int n;
    cin >> n;
    string nazwa[30];
    pair<int, int> poz[30];
    for (int i = 0; i < n; i++) {
        cin >> nazwa[i] >> poz[i].first >> poz[i].second;
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int x, y;
        cin >> x >> y;
        pair<int, string> najl = {2000000000, ""};
        for (int i = 0; i < n; i++) {
            int d = abs(poz[i].first - x) + abs(poz[i].second - y);
            pair<int, string> kandydat = {d, nazwa[i]};
            najl = min(najl, kandydat);
        }
        cout << najl.second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-b-pole-figury', krok: 9, level: 'srednie',
            title: 'Pole figury z prostokątów',
            short: 'Prostokąty nakładają się na siebie. Ile wynosi pole całej figury? Zamaluj kratki na planszy.',
            tags: ['rogi jako pary', 'tablica bool 2D', 'kratki jednostkowe'],
            statement: ['Na kartce w kratkę narysowano n prostokątów o bokach wzdłuż linii kratek. Prostokąt o rogach (x₁, y₁) i (x₂, y₂) zakrywa wszystkie kratki o lewym dolnym rogu (x, y), gdzie x₁ ≤ x < x₂ i y₁ ≤ y < y₂. Prostokąty mogą na siebie nachodzić. Wypisz pole figury, czyli liczbę kratek zakrytych przez co najmniej jeden prostokąt.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach x₁ y₁ x₂ y₂.'],
            output_format: ['Pole figury.'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ x₁ < x₂ ≤ 200', '0 ≤ y₁ < y₂ ≤ 200'],
            examples: [{ input: '2\n0 0 4 3\n2 1 6 5', note: 'Pola to 12 i 16, a część wspólna ma pole 4: razem 12 + 16 − 4 = 24.' }],
            hint: R`Plansza ma tylko 200 × 200 kratek, więc możesz je po prostu zamalować: tablica bool zakryta[200][200] = {}; i dla każdego prostokąta dwie pętle po jego kratkach. Na końcu policz zamalowane kratki.`,
            check: (inp) => { const v = nums(inp); for (let i = 0; i < v[0]; i++) { const [a, b, c, d] = v.slice(1 + 4 * i, 5 + 4 * i); if (!(a < c && b < d && c <= 200 && d <= 200 && a >= 0 && b >= 0)) return 'zły prostokąt'; } return null; },
            tests: (r) => {
                const pr = (z, dl) => { const a = r.int(0, z - 1), b = r.int(0, z - 1); return `${a} ${b} ${Math.min(z, a + r.int(1, dl))} ${Math.min(z, b + r.int(1, dl))}`; };
                return ['2\n0 0 4 3\n2 1 6 5', '1\n0 0 200 200', '3\n0 0 1 1\n0 0 1 1\n1 1 2 2', `100\n${Array.from({ length: 100 }, () => pr(200, 60)).join('\n')}`, `100\n${Array.from({ length: 100 }, () => pr(30, 5)).join('\n')}`, `10\n${Array.from({ length: 10 }, () => pr(200, 200)).join('\n')}`];
            },
            solve: (inp) => { const v = nums(inp); const z = new Set(); for (let i = 0; i < v[0]; i++) { const [a, b, c, d] = v.slice(1 + 4 * i, 5 + 4 * i); for (let x = a; x < c; x++) for (let y = b; y < d; y++) z.add(x * 1000 + y); } return String(z.size); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    bool zakryta[200][200] = {};
    for (int i = 0; i < n; i++) {
        pair<int, int> a, b;
        cin >> a.first >> a.second >> b.first >> b.second;
        for (int x = a.first; x < b.first; x++) {
            for (int y = a.second; y < b.second; y++) {
                zakryta[x][y] = true;
            }
        }
    }
    int pole = 0;
    for (int x = 0; x < 200; x++) {
        for (int y = 0; y < 200; y++) {
            if (zakryta[x][y]) pole++;
        }
    }
    cout << pole << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-balony', krok: 9, level: 'srednie',
            title: 'Balony i strzały',
            short: 'Pionowa strzała przebija każdy balon, nad którym przeleci. Ile strzał wystarczy? Zachłannie, po końcach.',
            tags: ['sort po końcach', 'zachłanny wybór', 'przedziały'],
            statement: ['Nad prostą wiszą balony; balon zajmuje odcinek [a, b] w poziomie (razem z końcami). Strzała wystrzelona pionowo w punkcie x przebija wszystkie balony, dla których a ≤ x ≤ b. Jaka jest najmniejsza liczba strzał, które przebiją wszystkie balony?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach końce balonu a i b.'],
            output_format: ['Najmniejsza liczba strzał.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ a ≤ b ≤ 10⁹'],
            examples: [{ input: '4\n10 16\n2 8\n1 6\n7 12', note: 'Strzała w 6 przebija [2, 8] i [1, 6], a strzała w 12 — [10, 16] i [7, 12].' }],
            hint: R`Posortuj balony po końcach — para {b, a}. Pierwszą strzałę wystrzel w końcu pierwszego balonu: przebije wszystkie, które zaczynają się nie później. Kolejną strzałę potrzebujesz dopiero przy balonie, który zaczyna się za ostatnią strzałą — wystrzel ją w jego końcu.`,
            check: (inp) => { const v = nums(inp); for (let i = 0; i < v[0]; i++) if (v[1 + 2 * i] > v[2 + 2 * i]) return 'a > b'; return null; },
            tests: (r) => {
                const gen = (n, z, dl) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(0, z); return `${a} ${Math.min(1e9, a + r.int(0, dl))}`; }).join('\n')}`;
                return ['4\n10 16\n2 8\n1 6\n7 12', '1\n5 5', '3\n1 2\n2 3\n3 4', gen(2000, 1e9, 1e6), gen(2000, 1000, 50), gen(50, 100, 10)];
            },
            solve: (inp) => { const v = nums(inp); const t = []; for (let i = 0; i < v[0]; i++) t.push([v[2 + 2 * i], v[1 + 2 * i]]); t.sort(cmp); let s = -1, k = 0; for (const [b, a] of t) { if (k === 0 || a > s) { k++; s = b; } } return String(k); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[2005];                 // (koniec, początek)
    for (int i = 0; i < n; i++) {
        cin >> t[i].second >> t[i].first;
    }
    sort(t, t + n);
    int strzaly = 0;
    long long ostatnia = -1;
    for (int i = 0; i < n; i++) {
        if (strzaly == 0 || t[i].second > ostatnia) {
            strzaly++;
            ostatnia = t[i].first;
        }
    }
    cout << strzaly << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-kolizje-w-planie', krok: 9, level: 'srednie',
            title: 'Kolizje w planie',
            short: 'Ile par wydarzeń w kalendarzu nachodzi na siebie? Dwa przedziały kolidują, gdy max(początków) < min(końców).',
            tags: ['przedziały [od, do)', 'każdy z każdym', 'max i min'],
            statement: ['W kalendarzu jest n wydarzeń; wydarzenie trwa od chwili s do chwili e (w chwili e już się skończyło). Dwa wydarzenia kolidują, jeśli trwają naraz choć przez chwilę — wydarzenie kończące się o 10 i wydarzenie zaczynające się o 10 nie kolidują. Policz, ile par wydarzeń koliduje.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach początek s i koniec e wydarzenia.'],
            output_format: ['Liczba kolidujących par.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ s < e ≤ 10⁹'],
            examples: [{ input: '4\n1 5\n4 8\n5 6\n9 10', note: 'Kolidują [1, 5) z [4, 8) oraz [4, 8) z [5, 6). [1, 5) i [5, 6) tylko się stykają.' }],
            hint: R`Dwa przedziały [s₁, e₁) i [s₂, e₂) kolidują dokładnie wtedy, gdy max(s₁, s₂) < min(e₁, e₂). Przy dwóch tysiącach wydarzeń wystarczy sprawdzić każdą parę dwiema pętlami — to około dwóch milionów porównań.`,
            check: (inp) => { const v = nums(inp); for (let i = 0; i < v[0]; i++) if (!(v[1 + 2 * i] < v[2 + 2 * i])) return 's >= e'; return null; },
            tests: (r) => {
                const gen = (n, z, dl) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(0, z); return `${a} ${a + r.int(1, dl)}`; }).join('\n')}`;
                return ['4\n1 5\n4 8\n5 6\n9 10', '1\n0 1', '3\n0 10\n0 10\n0 10', gen(2000, 1e8, 1e6), gen(2000, 1000, 5), gen(100, 50, 10)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const t = []; for (let i = 0; i < n; i++) t.push([v[1 + 2 * i], v[2 + 2 * i]]); let k = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) if (Math.max(t[i][0], t[j][0]) < Math.min(t[i][1], t[j][1])) k++; return String(k); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[2005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    long long kolizje = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if (max(t[i].first, t[j].first) < min(t[i].second, t[j].second)) kolizje++;
        }
    }
    cout << kolizje << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-pole-dzialki', krok: 9, level: 'srednie',
            title: 'Pole działki',
            short: 'Geodeta podał kolejne narożniki działki. Policz jej pole wzorem „sznurowadłowym”.',
            tags: ['wierzchołki jako pary', 'wzór Gaussa', 'long long i połówka'],
            statement: ['Działka ma kształt wielokąta, którego n wierzchołków podano po kolei (wzdłuż obwodu). Pole wielokąta liczy się wzorem Gaussa („sznurowadłowym”): podwojone pole to wartość bezwzględna sumy x_i · y_(i+1) − x_(i+1) · y_i po wszystkich kolejnych parach wierzchołków, gdzie po ostatnim wierzchołku wracamy do pierwszego. Wypisz pole działki z dokładnie jedną cyfrą po kropce (pole zawsze kończy się na .0 albo .5).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne wierzchołków, po kolei.'],
            output_format: ['Pole z jedną cyfrą po kropce.'],
            constraints: ['3 ≤ n ≤ 1000', '−10⁶ ≤ współrzędne ≤ 10⁶', 'Wielokąt nie przecina sam siebie.'],
            examples: [{ input: '4\n0 0\n4 0\n4 3\n0 3', note: 'Prostokąt 4 × 3 ma pole 12.' }, { input: '3\n0 0\n3 0\n0 1' }],
            hint: R`Wierzchołki trzymaj w tablicy par. Licz sumę 2 · pola w long long — pojedynczy iloczyn sięga 10¹². Następny wierzchołek po i-tym to (i + 1) % n. Na końcu weź wartość bezwzględną: jeśli jest parzysta, pole to suma / 2 z „.0”, a jeśli nieparzysta — suma / 2 z „.5”.`,
            tests: (r) => {
                const gwiazda = (n, z) => { const c = Array.from({ length: n }, () => { const a = r() * 2 * Math.PI, d = r.int(1, z); const x = Math.round(Math.cos(a) * d), y = Math.round(Math.sin(a) * d); return [x, y, Math.atan2(y, x)]; }); c.sort((p, q) => p[2] - q[2]); const u = []; const s = new Set(); for (const p of c) { const k = `${p[0]},${p[1]}`; if (!s.has(k)) { s.add(k); u.push(p); } } return `${u.length}\n${u.map((p) => `${p[0]} ${p[1]}`).join('\n')}`; };
                return ['4\n0 0\n4 0\n4 3\n0 3', '3\n0 0\n3 0\n0 1', '3\n-1000000 -1000000\n1000000 -1000000\n1000000 1000000', gwiazda(1000, 1e6), gwiazda(50, 100), gwiazda(10, 10)];
            },
            check: (inp) => (nums(inp)[0] >= 3 ? null : 'za mało wierzchołków'),
            solve: (inp) => { const v = nums(inp); const n = v[0]; let s = 0n; for (let i = 0; i < n; i++) { const j = (i + 1) % n; s += BigInt(v[1 + 2 * i]) * BigInt(v[2 + 2 * j]) - BigInt(v[1 + 2 * j]) * BigInt(v[2 + 2 * i]); } if (s < 0n) s = -s; return pol(s); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<long long, long long> w[1005];
    for (int i = 0; i < n; i++) {
        cin >> w[i].first >> w[i].second;
    }
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        suma += w[i].first * w[j].second - w[j].first * w[i].second;
    }
    if (suma < 0) suma = -suma;
    cout << suma / 2 << (suma % 2 == 0 ? ".0" : ".5") << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-najczestsze-miejsce', krok: 9, level: 'srednie',
            title: 'Najczęściej odwiedzane miejsce',
            short: 'Robot krąży po planszy. W której kratce bywał najczęściej? Remis rozstrzyga para (wiersz, kolumna).',
            tags: ['tablica par (pozycja, licznik)', 'szukaj albo dopisz', 'najmniejsza para'],
            statement: ['Robot startuje w kratce (0, 0) i wykonuje polecenia G, P, D i L (góra, prawo, dół, lewo; w górę maleje numer wiersza). Kratkę startową liczymy jako odwiedzoną raz, a każde wejście robota na kratkę — jako kolejne odwiedziny. Wypisz kratkę odwiedzoną najwięcej razy i liczbę odwiedzin. Jeśli takich kratek jest kilka, wybierz tę z najmniejszym numerem wiersza, a przy równych wierszach — z najmniejszym numerem kolumny.'],
            input_format: ['Jeden wiersz z poleceniami.'],
            output_format: ['Trzy liczby: wiersz, kolumna i liczba odwiedzin.'],
            constraints: ['Poleceń jest od 1 do 2000.'],
            examples: [{ input: 'PLPLP', note: 'Kratki (0, 0) i (0, 1) odwiedzono po 3 razy (do (0, 0) wliczamy start). Mniejsza para to (0, 0).' }],
            hint: R`Trzymaj tablicę par pozycja → licznik: pair<pair<int, int>, int> byl[2005] i liczbę zajętych pudełek. Po każdym ruchu poszukaj pozycji w tablicy: jest — zwiększ licznik, nie ma — dopisz z licznikiem 1. Na koniec wybierz najlepszą: największy licznik, przy remisie najmniejsza pozycja.`,
            tests: (r) => ['PLPLP', 'PLPLD', 'G', 'GD'.repeat(1000), znaki(r, 2000, KIER), znaki(r, 2000, 'GDGDP'), znaki(r, 200, KIER), 'PPPPLLLL'.repeat(250)],
            solve: (inp) => { let w = 0, k = 0; const c = new Map([['0,0', 1]]); for (const ch of inp.trim()) { const d = RUCH[KIER.indexOf(ch)]; w += d[0]; k += d[1]; const key = `${w},${k}`; c.set(key, (c.get(key) || 0) + 1); } let b = null; for (const [key, v] of c) { const [x, y] = key.split(',').map(Number); if (!b || v > b[2] || (v === b[2] && cmp([x, y], [b[0], b[1]]) < 0)) b = [x, y, v]; } return b.join(' '); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    pair<int, int> ruch[4] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
    string kierunki = "GPDL";
    string s;
    cin >> s;
    pair<pair<int, int>, int> byl[2005];
    int ile = 0;
    pair<int, int> poz = {0, 0};
    byl[ile++] = {poz, 1};
    for (char c : s) {
        int k = kierunki.find(c);
        poz.first += ruch[k].first;
        poz.second += ruch[k].second;
        int gdzie = -1;
        for (int i = 0; i < ile; i++) {
            if (byl[i].first == poz) {
                gdzie = i;
                break;
            }
        }
        if (gdzie == -1) byl[ile++] = {poz, 1};
        else byl[gdzie].second++;
    }
    int naj = 0;
    for (int i = 1; i < ile; i++) {
        if (byl[i].second > byl[naj].second ||
            (byl[i].second == byl[naj].second && byl[i].first < byl[naj].first)) {
            naj = i;
        }
    }
    cout << byl[naj].first.first << " " << byl[naj].first.second << " " << byl[naj].second << "\n";
    return 0;
}`,
        },

        // ================================================================ TRUDNE
        {
            id: 'pair-b-mrowka-langtona', krok: 9, level: 'trudne',
            title: 'Mrówka Langtona',
            short: 'Na białym polu w prawo, na czarnym w lewo, przemaluj i krok. Symulacja z kierunkami jako parami.',
            tags: ['kierunki i obroty', 'plansza z przesunięciem', 'symulacja'],
            statement: ['Na nieskończonej planszy wszystkie pola są białe. Mrówka stoi na polu (0, 0) i patrzy w górę. W każdym kroku: jeśli stoi na białym polu, obraca się w prawo, maluje to pole na czarno i idzie o jedno pole do przodu; jeśli stoi na czarnym polu, obraca się w lewo, maluje je na biało i idzie o jedno pole do przodu. Krok w górę zmniejsza numer wiersza, w prawo zwiększa numer kolumny. Po k krokach wypisz liczbę czarnych pól, pozycję mrówki (wiersz i kolumna) i literę kierunku, w którym patrzy: G, P, D albo L.'],
            input_format: ['Jeden wiersz z liczbą k.'],
            output_format: ['Liczba czarnych pól, wiersz, kolumna i litera kierunku, oddzielone spacjami.'],
            constraints: ['0 ≤ k ≤ 1000'],
            examples: [{ input: '4', note: 'Po czterech krokach mrówka obeszła mały kwadrat: cztery pola są czarne, a ona wróciła na start, patrząc w górę.' }, { input: '5' }],
            hint: R`Kierunek to numer d (0 — góra, 1 — prawo, 2 — dół, 3 — lewo) i tablica par kroków. W prawo: d = (d + 1) % 4, w lewo: d = (d + 3) % 4. W k krokach mrówka nie odejdzie dalej niż k pól, więc wystarczy tablica bool czarne[2005][2005] z przesunięciem współrzędnych o 1001. Liczbę czarnych pól zmieniaj przy każdym przemalowaniu.`,
            tests: () => ['4', '5', '0', '1', '10', '100', '500', '777', '1000'],
            solve: (inp) => { const k = Number(inp.trim()); const black = new Set(); let w = 0, c = 0, d = 0; for (let i = 0; i < k; i++) { const key = `${w},${c}`; if (black.has(key)) { d = (d + 3) % 4; black.delete(key); } else { d = (d + 1) % 4; black.add(key); } w += RUCH[d][0]; c += RUCH[d][1]; } return `${black.size} ${w} ${c} ${KIER[d]}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
bool czarne[2005][2005];
int main() {
    for (int i = 0; i < 2005; i++)
        for (int j = 0; j < 2005; j++)
            czarne[i][j] = false;
    pair<int, int> ruch[4] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
    string litery = "GPDL";
    int k;
    cin >> k;
    pair<int, int> poz = {0, 0};
    int d = 0, ile = 0;
    const int P = 1001;                       // przesunięcie: (0, 0) to czarne[1001][1001]
    for (int i = 0; i < k; i++) {
        bool &pole = czarne[poz.first + P][poz.second + P];
        if (pole) {
            d = (d + 3) % 4;
            pole = false;
            ile--;
        } else {
            d = (d + 1) % 4;
            pole = true;
            ile++;
        }
        poz.first += ruch[d].first;
        poz.second += ruch[d].second;
    }
    cout << ile << " " << poz.first << " " << poz.second << " " << litery[d] << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-najwiekszy-trojkat', krok: 9, level: 'trudne',
            title: 'Największy trójkąt',
            short: 'Spośród stu punktów wybierz trzy tworzące trójkąt o największym polu. Iloczyn wektorowy na parach.',
            tags: ['trzy pętle', 'iloczyn wektorowy', 'połówka pola'],
            statement: ['Wczytaj n punktów. Wybierz trzy z nich tak, by tworzyły trójkąt o największym możliwym polu. Pole trójkąta o wierzchołkach A, B, C to połowa wartości bezwzględnej wyrażenia (B.x − A.x) · (C.y − A.y) − (C.x − A.x) · (B.y − A.y). Wypisz największe pole z jedną cyfrą po kropce (zawsze .0 albo .5). Jeśli wszystkie punkty leżą na jednej prostej, pole wynosi 0.0.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne punktów.'],
            output_format: ['Największe pole z jedną cyfrą po kropce.'],
            constraints: ['3 ≤ n ≤ 100', '−10⁴ ≤ współrzędne ≤ 10⁴'],
            examples: [{ input: '5\n0 0\n4 0\n0 3\n1 1\n2 2', note: 'Największy jest trójkąt (0, 0), (4, 0), (0, 3) o polu 6.' }],
            hint: R`Trzy zagnieżdżone pętle i < j < k dają wszystkie trójki — dla stu punktów to około 160 tysięcy. Licz podwojone pole na liczbach całkowitych (long long), zapamiętaj największe, a na końcu wypisz połowę: dzielenie przez 2 i „.0” albo „.5”.`,
            check: (inp) => (nums(inp)[0] >= 3 ? null : 'za mało punktów'),
            tests: (r) => ['5\n0 0\n4 0\n0 3\n1 1\n2 2', '3\n0 0\n1 1\n2 2', '3\n0 0\n1 0\n0 1', `100\n${Array.from({ length: 100 }, () => `${r.int(-1e4, 1e4)} ${r.int(-1e4, 1e4)}`).join('\n')}`, `100\n${Array.from({ length: 100 }, () => `${r.int(-3, 3)} ${r.int(-3, 3)}`).join('\n')}`, `50\n${Array.from({ length: 50 }, (_, i) => `${i} ${2 * i + 1}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const n = v[0]; const p = []; for (let i = 0; i < n; i++) p.push([v[1 + 2 * i], v[2 + 2 * i]]); let b = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) for (let k = j + 1; k < n; k++) { const c = Math.abs((p[j][0] - p[i][0]) * (p[k][1] - p[i][1]) - (p[k][0] - p[i][0]) * (p[j][1] - p[i][1])); if (c > b) b = c; } return pol(BigInt(b)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<long long, long long> p[105];
    for (int i = 0; i < n; i++) {
        cin >> p[i].first >> p[i].second;
    }
    long long najw = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            for (int k = j + 1; k < n; k++) {
                long long c = (p[j].first - p[i].first) * (p[k].second - p[i].second)
                            - (p[k].first - p[i].first) * (p[j].second - p[i].second);
                if (c < 0) c = -c;
                if (c > najw) najw = c;
            }
        }
    }
    cout << najw / 2 << (najw % 2 == 0 ? ".0" : ".5") << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-pokrycie-odcinka', krok: 9, level: 'trudne',
            title: 'Pokrycie odcinka',
            short: 'Najmniej odcinków, które razem zakryją cały odcinek [0, L]. Zachłannie: zawsze sięgaj najdalej.',
            tags: ['sort po początkach', 'zachłanny wybór', 'NIE'],
            statement: ['Masz do zakrycia odcinek [0, L] i n odcinków [a, b] (razem z końcami). Wybierz jak najmniej odcinków, które razem zakryją cały [0, L] — stykające się odcinki, jak [0, 3] i [3, 5], zakrywają wszystko między sobą. Wypisz najmniejszą liczbę odcinków albo NIE, jeśli zakrycie jest niemożliwe.'],
            input_format: ['W pierwszym wierszu L i n.', 'W kolejnych n wierszach końce odcinków a i b.'],
            output_format: ['Najmniejsza liczba odcinków albo NIE.'],
            constraints: ['1 ≤ L ≤ 10⁹', '1 ≤ n ≤ 2000', '0 ≤ a < b ≤ 10⁹'],
            examples: [{ input: '10 4\n0 3\n2 6\n3 8\n6 10', note: 'Wystarczą trzy odcinki: [0, 3], [3, 8] i [6, 10].' }, { input: '10 2\n0 4\n5 10', note: 'Między 4 a 5 nic nie leży.' }],
            hint: R`Posortuj odcinki po początkach. Pamiętaj, dokąd już jest zakryte (na start 0). W każdym kroku spośród odcinków zaczynających się nie dalej niż ten punkt wybierz ten, który sięga najdalej, i przesuń punkt na jego koniec. Jeśli żaden nie pozwala pójść dalej, a punkt jest przed L — odpowiedź NIE.`,
            check: (inp) => { const v = nums(inp); for (let i = 0; i < v[1]; i++) if (!(v[2 + 2 * i] < v[3 + 2 * i])) return 'a >= b'; return null; },
            tests: (r) => {
                const gen = (L, n, dl) => `${L} ${n}\n${Array.from({ length: n }, () => { const a = r.int(0, L - 1); return `${a} ${Math.min(1e9, a + r.int(1, dl))}`; }).join('\n')}`;
                return ['10 4\n0 3\n2 6\n3 8\n6 10', '10 2\n0 4\n5 10', '5 1\n0 5', '5 1\n1 5', '7 3\n0 3\n3 5\n5 7', gen(1e9, 2000, 2e6), gen(1000, 2000, 5), gen(1000, 50, 100), gen(100000, 2000, 300)];
            },
            solve: (inp) => { const v = nums(inp); const [L, n] = v; const t = []; for (let i = 0; i < n; i++) t.push([v[2 + 2 * i], v[3 + 2 * i]]); t.sort(cmp); let cur = 0, i = 0, k = 0; while (cur < L) { let best = cur; while (i < n && t[i][0] <= cur) { best = Math.max(best, t[i][1]); i++; } if (best === cur) return 'NIE'; cur = best; k++; } return String(k); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int L, n;
    cin >> L >> n;
    pair<int, int> t[2005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    sort(t, t + n);
    int zakryte = 0, i = 0, ile = 0;
    while (zakryte < L) {
        int najdalej = zakryte;
        while (i < n && t[i].first <= zakryte) {
            najdalej = max(najdalej, t[i].second);
            i++;
        }
        if (najdalej == zakryte) {
            cout << "NIE\n";
            return 0;
        }
        zakryte = najdalej;
        ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-gdzie-sklep', krok: 9, level: 'trudne',
            title: 'Gdzie zbudować sklep?',
            short: 'Sklep ma być jak najbliżej wszystkich domów (ulicami w kratkę). Mediana x-ów i mediana y-ów!',
            tags: ['sort', 'mediana', 'odległość taksówkarza'],
            statement: ['W mieście o ulicach w kratkę stoi n domów. Sklep trzeba postawić w punkcie o współrzędnych całkowitych tak, by suma odległości od sklepu do wszystkich domów — liczonych jak taksówkarz, |x₁ − x₂| + |y₁ − y₂| — była jak najmniejsza. Wypisz współrzędne sklepu i tę najmniejszą sumę. Jeśli dobrych miejsc jest kilka, wybierz najmniejsze w porządku par: najmniejsze x, a przy równym x — najmniejsze y.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne domów.'],
            output_format: ['Trzy liczby: x i y sklepu oraz suma odległości.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁶ ≤ współrzędne ≤ 10⁶'],
            examples: [{ input: '4\n0 0\n10 0\n0 10\n10 10', note: 'Każdy punkt kwadratu od (0, 0) do (10, 10) daje sumę 40. Najmniejszy w porządku par to (0, 0).' }],
            hint: R`Suma rozpada się na część x-ową i część y-ową, które można optymalizować osobno. Dla samych x najlepszy jest środkowy x po posortowaniu (mediana); przy parzystej liczbie domów dobre jest wszystko między dwoma środkowymi — najmniejsze z nich to x[(n - 1) / 2]. Tak samo y. Sumę licz w long long.`,
            tests: (r) => ['4\n0 0\n10 0\n0 10\n10 10', '1\n-5 7', '2\n0 0\n3 -3', `1000\n${Array.from({ length: 1000 }, () => `${r.int(-1e6, 1e6)} ${r.int(-1e6, 1e6)}`).join('\n')}`, `999\n${Array.from({ length: 999 }, () => `${r.int(-10, 10)} ${r.int(-10, 10)}`).join('\n')}`, `30\n${Array.from({ length: 30 }, () => `${r.int(-100, 100)} ${r.int(-100, 100)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const n = v[0]; const xs = [], ys = []; for (let i = 0; i < n; i++) { xs.push(v[1 + 2 * i]); ys.push(v[2 + 2 * i]); } const sx = xs.slice().sort((a, b) => a - b), sy = ys.slice().sort((a, b) => a - b); const x = sx[(n - 1) >> 1], y = sy[(n - 1) >> 1]; let s = 0; for (let i = 0; i < n; i++) s += Math.abs(xs[i] - x) + Math.abs(ys[i] - y); return `${x} ${y} ${s}`; },
            cpp: R`
#include <iostream>
#include <algorithm>
#include <cstdlib>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> d[1005];
    int xs[1005], ys[1005];
    for (int i = 0; i < n; i++) {
        cin >> d[i].first >> d[i].second;
        xs[i] = d[i].first;
        ys[i] = d[i].second;
    }
    sort(xs, xs + n);
    sort(ys, ys + n);
    pair<int, int> sklep = {xs[(n - 1) / 2], ys[(n - 1) / 2]};
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        suma += abs(d[i].first - sklep.first) + abs(d[i].second - sklep.second);
    }
    cout << sklep.first << " " << sklep.second << " " << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-prostokaty-z-punktow', krok: 9, level: 'trudne',
            title: 'Prostokąty z punktów',
            short: 'Ile prostokątów o bokach wzdłuż osi ma wszystkie cztery wierzchołki wśród danych punktów?',
            tags: ['pary jako przekątne', 'tablica bool 2D', 'każdy z każdym'],
            statement: ['Na kartce zaznaczono n różnych punktów o współrzędnych całkowitych. Policz, ile jest prostokątów o bokach równoległych do osi (i dodatnim polu), których wszystkie cztery wierzchołki są zaznaczonymi punktami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne punktów.'],
            output_format: ['Liczba prostokątów.'],
            constraints: ['1 ≤ n ≤ 300', '0 ≤ x, y ≤ 100', 'Punkty są różne.'],
            examples: [{ input: '6\n0 0\n0 2\n3 0\n3 2\n5 0\n5 2', note: 'Prostokąty: x od 0 do 3, od 0 do 5 i od 3 do 5 — trzy.' }],
            hint: R`Każdy prostokąt ma dokładnie jedną przekątną z lewego dolnego do prawego górnego rogu. Przejdź po parach punktów (i, j), w których j leży ostro na prawo i ostro wyżej od i, i sprawdź w tablicy bool jest[101][101], czy pozostałe dwa rogi też są zaznaczone. Każdy prostokąt policzysz wtedy dokładnie raz.`,
            check: (inp) => { const v = nums(inp); const s = new Set(); for (let i = 0; i < v[0]; i++) { const k = `${v[1 + 2 * i]},${v[2 + 2 * i]}`; if (s.has(k)) return 'powtórzony punkt'; s.add(k); } return null; },
            tests: (r) => {
                const gen = (n, z) => { const s = new Set(); while (s.size < n) s.add(`${r.int(0, z)} ${r.int(0, z)}`); return `${n}\n${[...s].join('\n')}`; };
                const krata = (a, b) => { const p = []; for (let x = 0; x < a; x++) for (let y = 0; y < b; y++) p.push(`${x * 3} ${y * 2}`); return `${p.length}\n${r.shuffle(p).join('\n')}`; };
                return ['6\n0 0\n0 2\n3 0\n3 2\n5 0\n5 2', '1\n5 5', krata(17, 17), krata(10, 30), gen(300, 100), gen(300, 20), gen(60, 8)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const p = []; const s = new Set(); for (let i = 0; i < n; i++) { p.push([v[1 + 2 * i], v[2 + 2 * i]]); s.add(`${v[1 + 2 * i]},${v[2 + 2 * i]}`); } let k = 0; for (const a of p) for (const b of p) if (b[0] > a[0] && b[1] > a[1] && s.has(`${a[0]},${b[1]}`) && s.has(`${b[0]},${a[1]}`)) k++; return String(k); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> p[305];
    bool jest[101][101] = {};
    for (int i = 0; i < n; i++) {
        cin >> p[i].first >> p[i].second;
        jest[p[i].first][p[i].second] = true;
    }
    int ile = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            auto [x1, y1] = p[i];
            auto [x2, y2] = p[j];
            if (x2 > x1 && y2 > y1 && jest[x1][y2] && jest[x2][y1]) ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-robot-z-przeszkodami', krok: 9, level: 'trudne',
            title: 'Robot z przeszkodami',
            short: 'Robot chodzi po planszy z obrotami i staje przed ścianą. Gdzie skończy i ile różnych pól odwiedził?',
            tags: ['kierunki i obroty', 'brzegi i ściany', 'odwiedzone pola'],
            statement: ['Na planszy o n wierszach i m kolumnach kropka to wolne pole, # — ściana, a S — pole startowe robota (wolne). Robot patrzy na początku w górę i wykonuje q poleceń: „F k” — idź k pól do przodu, ale zatrzymaj się wcześniej, jeśli następny krok prowadziłby na ścianę albo poza planszę (pozostałe kroki tego polecenia przepadają); „R” — obróć się w prawo; „L” — obróć się w lewo. Wypisz końcową pozycję robota (wiersz i kolumna, numerowane od 1) i liczbę różnych pól, na których stał — razem ze startowym.'],
            input_format: ['W pierwszym wierszu n i m.', 'W kolejnych n wierszach plansza.', 'Potem liczba q i q wierszy z poleceniami.'],
            output_format: ['Trzy liczby: wiersz, kolumna i liczba różnych odwiedzonych pól.'],
            constraints: ['1 ≤ n, m ≤ 100', 'Na planszy jest dokładnie jedno S.', '1 ≤ q ≤ 1000', '1 ≤ k ≤ 100'],
            examples: [{ input: '3 4\n..#.\n....\nS...\n4\nF 5\nR\nF 3\nR', note: 'Robot idzie w górę do wiersza 1, w prawo zatrzymuje się przed ścianą w kolumnie 3 — stoi w (1, 2). Odwiedził 4 pola.' }],
            hint: R`Połącz schematy z części 6: tablicę par kroków, obroty (d + 1) % 4 i (d + 3) % 4 oraz sprawdzanie brzegów przed zajrzeniem do kratki. Każdy krok „F k” rób osobno w pętli i przerwij ją przez break przy przeszkodzie. Odwiedzone pola zaznaczaj w tablicy bool i licz tylko nowe.`,
            tests: (r) => {
                const gen = (n, m, gest, q, kmax) => {
                    const p = Array.from({ length: n }, () => [...znaki(r, m, '.'.repeat(gest) + '#')]);
                    p[r.int(0, n - 1)][r.int(0, m - 1)] = 'S';
                    const pol = Array.from({ length: q }, () => (r() < 0.55 ? `F ${r.int(1, kmax)}` : r.pick(['R', 'L'])));
                    return `${n} ${m}\n${p.map((x) => x.join('')).join('\n')}\n${q}\n${pol.join('\n')}`;
                };
                return ['3 4\n..#.\n....\nS...\n4\nF 5\nR\nF 3\nR', '1 1\nS\n2\nF 3\nR', gen(10, 10, 4, 50, 5), gen(100, 100, 6, 1000, 100), gen(100, 100, 1, 1000, 10), gen(30, 50, 3, 500, 30)];
            },
            solve: (inp) => {
                const L = lines(inp); const [n, m] = L[0].split(' ').map(Number); const p = L.slice(1, 1 + n); const q = Number(L[1 + n]);
                let w = 0, k = 0; p.forEach((row, i) => { const j = row.indexOf('S'); if (j >= 0) { w = i; k = j; } });
                const odw = new Set([`${w},${k}`]); let d = 0;
                for (let i = 0; i < q; i++) { const t = L[2 + n + i].split(' '); if (t[0] === 'R') d = (d + 1) % 4; else if (t[0] === 'L') d = (d + 3) % 4; else { for (let s = 0; s < Number(t[1]); s++) { const nw = w + RUCH[d][0], nk = k + RUCH[d][1]; if (nw < 0 || nw >= n || nk < 0 || nk >= m || p[nw][nk] === '#') break; w = nw; k = nk; odw.add(`${w},${k}`); } } }
                return `${w + 1} ${k + 1} ${odw.size}`;
            },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    string p[105];
    pair<int, int> poz;
    for (int i = 0; i < n; i++) {
        cin >> p[i];
        for (int j = 0; j < m; j++) {
            if (p[i][j] == 'S') poz = {i, j};
        }
    }
    pair<int, int> ruch[4] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
    bool odw[105][105] = {};
    odw[poz.first][poz.second] = true;
    int ile = 1, d = 0, q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string c;
        cin >> c;
        if (c == "R") {
            d = (d + 1) % 4;
        } else if (c == "L") {
            d = (d + 3) % 4;
        } else {
            int k;
            cin >> k;
            for (int s = 0; s < k; s++) {
                int nw = poz.first + ruch[d].first, nk = poz.second + ruch[d].second;
                if (nw < 0 || nw >= n || nk < 0 || nk >= m || p[nw][nk] == '#') break;
                poz = {nw, nk};
                if (!odw[nw][nk]) {
                    odw[nw][nk] = true;
                    ile++;
                }
            }
        }
    }
    cout << poz.first + 1 << " " << poz.second + 1 << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-b-wspolny-termin', krok: 9, level: 'trudne',
            title: 'Wspólny termin spotkania',
            short: 'Dwie osoby, dwa kalendarze zajęć. Kiedy najwcześniej obie mają wolne L minut naraz?',
            tags: ['scalanie przedziałów', 'luki między przedziałami', 'HH:MM'],
            statement: ['Dwie osoby chcą umówić się na spotkanie trwające L minut, w ciągu jednego dnia (od minuty 0 do 1440). Każda podała listę swoich zajęć: zajęcie trwa od minuty s do minuty e (w minucie e już się skończyło). Spotkanie [T, T + L) nie może nachodzić na żadne zajęcie żadnej z osób i musi skończyć się najpóźniej o 1440. Wypisz najwcześniejszy możliwy początek T w postaci HH:MM albo BRAK, jeśli spotkania nie da się zmieścić.'],
            input_format: ['W pierwszym wierszu L.', 'W drugim wierszu liczba zajęć pierwszej osoby n₁, a w kolejnych n₁ wierszach jej zajęcia (s i e).', 'Potem liczba n₂ i zajęcia drugiej osoby.'],
            output_format: ['Godzina początku spotkania w postaci HH:MM albo BRAK.'],
            constraints: ['1 ≤ L ≤ 1440', '0 ≤ n₁, n₂ ≤ 500', '0 ≤ s < e ≤ 1440'],
            examples: [{ input: '60\n2\n480 600\n720 840\n2\n540 660\n900 960', note: 'Zajęte razem: 480–660, 720–840 i 900–960. Wolne luki: 0–480, 660–720 (60 minut!) … Najwcześniej o 00:00.' }, { input: '90\n1\n0 600\n1\n630 700', note: 'Od 600 do 630 jest tylko 30 minut. Pierwsza luka na 90 minut zaczyna się o 700, czyli 11:40.' }],
            hint: R`Wrzuć zajęcia obu osób do jednej tablicy par i posortuj po początkach. Przechodź po nich, pamiętając, do kiedy jesteś zajęty (na start 0): jeśli następne zajęcie zaczyna się co najmniej L minut po tej chwili, znalazłeś lukę. Nie zapomnij o luce na końcu dnia, do 1440.`,
            check: (inp) => { const v = nums(inp); let i = 1; for (let o = 0; o < 2; o++) { const k = v[i++]; for (let j = 0; j < k; j++) { if (!(v[i] < v[i + 1])) return 's >= e'; i += 2; } } return null; },
            tests: (r) => {
                const lista = (k, dl) => Array.from({ length: k }, () => { const s = r.int(0, 1439); return `${s} ${Math.min(1440, s + r.int(1, dl))}`; });
                const gen = (L, k1, k2, dl) => { const a = lista(k1, dl), b = lista(k2, dl); return `${L}\n${k1}${k1 ? '\n' + a.join('\n') : ''}\n${k2}${k2 ? '\n' + b.join('\n') : ''}`; };
                return ['60\n2\n480 600\n720 840\n2\n540 660\n900 960', '90\n1\n0 600\n1\n630 700', '1440\n0\n0', '1440\n1\n0 1\n0', '30\n1\n0 1440\n0', gen(45, 20, 20, 60), gen(20, 500, 500, 10), gen(120, 10, 10, 200), gen(5, 300, 300, 4)];
            },
            solve: (inp) => { const v = nums(inp); const L = v[0]; const zaj = new Array(1440).fill(false); let i = 1; for (let o = 0; o < 2; o++) { const k = v[i++]; for (let j = 0; j < k; j++) { for (let t = v[i]; t < v[i + 1]; t++) zaj[t] = true; i += 2; } } let run = 0; for (let t = 0; t < 1440; t++) { run = zaj[t] ? 0 : run + 1; if (run >= L) { const T = t - L + 1; return `${p2(Math.floor(T / 60))}:${p2(T % 60)}`; } } return 'BRAK'; },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int L;
    cin >> L;
    pair<int, int> z[1005];
    int n = 0;
    for (int osoba = 0; osoba < 2; osoba++) {
        int k;
        cin >> k;
        for (int i = 0; i < k; i++) {
            cin >> z[n].first >> z[n].second;
            n++;
        }
    }
    sort(z, z + n);
    int wolneOd = 0;
    for (int i = 0; i < n; i++) {
        if (z[i].first - wolneOd >= L) break;      // luka przed tym zajęciem wystarcza
        wolneOd = max(wolneOd, z[i].second);
    }
    if (wolneOd + L <= 1440) {
        if (wolneOd / 60 < 10) cout << "0";
        cout << wolneOd / 60 << ":";
        if (wolneOd % 60 < 10) cout << "0";
        cout << wolneOd % 60 << "\n";
    } else {
        cout << "BRAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-b-klasyfikacja', krok: 9, level: 'trudne',
            title: 'Wielki finał: klasyfikacja olimpiady',
            short: 'Pełna klasyfikacja: suma punktów, potem liczba zadań za 100, potem imię — z miejscami ex aequo.',
            tags: ['para w parze', 'sort', 'ex aequo'],
            statement: ['W olimpiadzie startuje n uczestników, a zadań jest m. Każdy uczestnik ma imię i wynik z każdego zadania (od 0 do 100). Ułóż klasyfikację: wyżej stoi uczestnik z większą sumą punktów; przy równej sumie — ten, kto ma więcej zadań rozwiązanych na 100 punktów. Uczestnicy, którzy mają i tę samą sumę, i tyle samo zadań na 100, dzielą miejsce (ex aequo) i są wypisani alfabetycznie; następne miejsce jest wtedy odpowiednio dalej. Każdy wiersz wyjścia: „miejsce. imię suma”.'],
            input_format: ['W pierwszym wierszu n i m.', 'W kolejnych n wierszach imię i m wyników.'],
            output_format: ['n wierszy klasyfikacji.'],
            constraints: ['1 ≤ n ≤ 500', '1 ≤ m ≤ 10', 'Imiona są różne i mają od 2 do 20 liter.'],
            examples: [{ input: '4 3\nOla 100 50 0\nJan 80 70 0\nEwa 100 0 50\nIgor 100 100 0', note: 'Igor ma 200 punktów. Ola, Jan i Ewa — po 150, ale Ola i Ewa mają po jednym zadaniu na 100, a Jan żadnego. Ewa i Ola dzielą miejsce 2.' }],
            hint: R`Klucz uczestnika: pair<pair<int, int>, string> {{-suma, -ileSetek}, imie}. Minusy dają kolejność od najlepszego, a imię rozstrzyga remisy alfabetycznie. Po sortowaniu miejsce zmieniasz tylko wtedy, gdy t[i].first różni się od t[i - 1].first — wtedy miejsce to i + 1.`,
            tests: (r) => {
                const gen = (n, m, pula) => { const im = new Set(); while (im.size < n) im.add(r() < 0.5 && im.size < IMIONA.length ? r.pick(IMIONA) : r.word(r.int(2, 8)).replace(/^./, (c) => c.toUpperCase())); return `${n} ${m}\n${[...im].map((x) => `${x} ${Array.from({ length: m }, () => r.pick(pula)).join(' ')}`).join('\n')}`; };
                return ['4 3\nOla 100 50 0\nJan 80 70 0\nEwa 100 0 50\nIgor 100 100 0', '1 1\nAl 0', gen(20, 3, [0, 50, 100]), gen(500, 10, Array.from({ length: 101 }, (_, i) => i)), gen(100, 2, [0, 100]), gen(300, 5, [0, 30, 70, 100])];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]), m = Number(t[1]); const a = []; let i = 2; for (let k = 0; k < n; k++) { const im = t[i++]; let s = 0, c = 0; for (let j = 0; j < m; j++) { const x = Number(t[i++]); s += x; if (x === 100) c++; } a.push([-s, -c, im]); } a.sort(cmp); let pl = 1; return a.map((x, j) => { if (j > 0 && (x[0] !== a[j - 1][0] || x[1] !== a[j - 1][1])) pl = j + 1; return `${pl}. ${x[2]} ${-x[0]}`; }).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    pair<pair<int, int>, string> t[505];
    for (int i = 0; i < n; i++) {
        string imie;
        cin >> imie;
        int suma = 0, setki = 0;
        for (int j = 0; j < m; j++) {
            int x;
            cin >> x;
            suma += x;
            if (x == 100) setki++;
        }
        t[i] = {{-suma, -setki}, imie};
    }
    sort(t, t + n);
    int miejsce = 1;
    for (int i = 0; i < n; i++) {
        if (i > 0 && t[i].first != t[i - 1].first) miejsce = i + 1;
        cout << miejsce << ". " << t[i].second << " " << -t[i].first.first << "\n";
    }
    return 0;
}`,
        },
    ];
};
