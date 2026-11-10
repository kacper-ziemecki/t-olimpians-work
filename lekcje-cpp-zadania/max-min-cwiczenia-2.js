// Max / Min — ćwiczenia w trakcie lekcji, części 4–6: pozycja rekordu i remisy (> i >=, liczba wystąpień, zwycięzca,
// najbliżej celu, kilka kryteriów), max_element / min_element (wartość i numer, kawałek, napis, reguła, iter_swap)
// oraz granice (przycinanie, clamp, przelewanie, wspólna część przedziałów i prostokątów).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks, fx, safe } = h;
    const R = String.raw;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Kacper', 'Wiktoria'];
    const arr = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const czytaj = (inp) => { const a = nums(inp); return { n: a[0], v: a.slice(1, 1 + a[0]) }; };
    const imie = (r) => { const w = r.word(r.int(2, 9)); return w[0].toUpperCase() + w.slice(1); };
    const bmax = (a, b) => (a > b ? a : b);
    const bmin = (a, b) => (a < b ? a : b);

    return [
        // ================================================================ KROK 4 · gdzie, ile razy, kto
        {
            id: 'mm-gdzie-rekord', krok: 4, level: 'latwe',
            title: 'Gdzie był rekord?',
            short: 'Największa liczba i pozycja, na której pojawia się po raz pierwszy.',
            tags: ['if (x > maks)', 'pozycja od 1', 'pierwsze wystąpienie'],
            statement: ['Wczytaj n liczb całkowitych. Wypisz największą z nich oraz numer pozycji, na której pojawia się po raz pierwszy (pozycje numerujemy od 1).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: największa liczba i numer jej pierwszej pozycji.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n3 8 5 8 2', note: 'Ósemka jest na pozycjach 2 i 4 — liczy się pierwsza.' }],
            hint: R`Wczytaj pierwszą liczbę jako rekord z pozycją 1. W pętli od i = 2 pisz: if (x > maks) { maks = x; poz = i; }. Ostry znak > zostawia pierwsze wystąpienie.`,
            tests: (r) => ['1\n-7', '3\n5 5 5', '4\n1 2 3 4', '4\n4 3 2 1', fmt(arr(r, 30, -5, 5)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, 0, 3)), fmt(arr(r, 5000, -1e9, -1e9 + 10))],
            solve: (inp) => { const v = czytaj(inp).v; const m = Math.max(...v); return `${m} ${v.indexOf(m) + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int maks, poz = 1;
    cin >> maks;
    for (int i = 2; i <= n; i++) {
        int x;
        cin >> x;
        if (x > maks) {
            maks = x;
            poz = i;
        }
    }
    cout << maks << " " << poz << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-ostatnie-minimum', krok: 4, level: 'latwe',
            title: 'Ostatnie minimum',
            short: 'Najmniejsza liczba i pozycja jej OSTATNIEGO wystąpienia.',
            tags: ['if (x <= mini)', 'ostatnie wystąpienie', 'pozycja od 1'],
            statement: ['Wczytaj n liczb całkowitych. Wypisz najmniejszą z nich oraz numer pozycji, na której pojawia się po raz ostatni (pozycje numerujemy od 1).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: najmniejsza liczba i numer jej ostatniej pozycji.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n4 2 7 2 9 3', note: 'Dwójka jest na pozycjach 2 i 4 — liczy się ostatnia.' }],
            hint: R`Ostatnie wystąpienie daje warunek z równością: if (x <= mini) { mini = x; poz = i; }. Każda kolejna równa liczba nadpisze pozycję.`,
            tests: (r) => ['1\n9', '3\n5 5 5', '4\n1 2 3 4', '4\n4 3 2 1', fmt(arr(r, 30, -5, 5)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, 0, 3))],
            solve: (inp) => { const v = czytaj(inp).v; const m = Math.min(...v); return `${m} ${v.lastIndexOf(m) + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int mini, poz = 1;
    cin >> mini;
    for (int i = 2; i <= n; i++) {
        int x;
        cin >> x;
        if (x <= mini) {
            mini = x;
            poz = i;
        }
    }
    cout << mini << " " << poz << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-ile-razy-rekord', krok: 4, level: 'latwe',
            title: 'Ile razy padł najlepszy wynik?',
            short: 'Największa liczba i liczba jej wystąpień — w jednej pętli.',
            tags: ['licznik wystąpień', 'ile = 1 przy nowym rekordzie', 'else if (x == maks)'],
            statement: ['Wczytaj n liczb całkowitych. Wypisz największą z nich i to, ile razy występuje.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: największa liczba i liczba jej wystąpień.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n3 8 5 8 2 8' }],
            hint: R`W jednej pętli: if (x > maks) { maks = x; ile = 1; } else if (x == maks) ile++;. Przy nowym rekordzie licznik zaczyna od 1 — stare wyrównania gorszego rekordu się nie liczą.`,
            tests: (r) => ['1\n5', '4\n2 2 5 5', '5\n7 7 7 7 7', '5\n1 1 1 1 2', fmt(arr(r, 40, 0, 4)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, -3, 3)), fmt(arr(r, 5000, -1e9, -999999995))],
            solve: (inp) => { const v = czytaj(inp).v; const m = Math.max(...v); return `${m} ${v.filter((x) => x === m).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int maks, ile = 1;
    cin >> maks;
    for (int i = 1; i < n; i++) {
        int x;
        cin >> x;
        if (x > maks) {
            maks = x;
            ile = 1;
        } else if (x == maks) {
            ile++;
        }
    }
    cout << maks << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-zwyciezca', krok: 4, level: 'latwe',
            title: 'Zwycięzca konkursu',
            short: 'Imiona i punkty — kto wygrał? Przy remisie wygrywa osoba wcześniej na liście.',
            tags: ['rekord z imieniem', 'string kto', 'remis'],
            statement: ['W konkursie wzięło udział n osób. Każda zdobyła pewną liczbę punktów. Wypisz imię zwycięzcy i jego wynik. Jeśli kilka osób ma tyle samo, najwięcej punktów, wygrywa ta, która jest wcześniej na liście.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy imię i liczba punktów.'],
            output_format: ['Jeden wiersz: imię zwycięzcy i jego punkty.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ punkty ≤ 10⁶', 'Imię ma od 2 do 12 liter: wielka, a potem małe.'],
            examples: [{ input: '4\nOla 17\nKuba 23\nEwa 23\nJan 9', note: 'Kuba i Ewa mają po 23 punkty, ale Kuba jest wcześniej.' }],
            hint: R`Obok rekordu punktów trzymaj string kto. Gdy pkt > najw, zmieniasz obie zmienne naraz. Ostry znak > sprawia, że przy remisie zostaje osoba wcześniejsza.`,
            tests: (r) => {
                const t = (n, hi) => `${n}\n${Array.from({ length: n }, () => `${r() < 0.6 ? r.pick(IMIONA) : imie(r)} ${r.int(0, hi)}`).join('\n')}`;
                return ['1\nAla 0', '3\nOla 5\nJan 5\nEwa 5', '3\nOla 1\nJan 2\nEwa 3', t(10, 5), t(500, 1e6), t(1000, 20)];
            },
            solve: (inp) => {
                const t = toks(inp); let kto = t[1], naj = Number(t[2]);
                for (let i = 1; i < Number(t[0]); i++) { const p = Number(t[2 + 2 * i]); if (p > naj) { naj = p; kto = t[1 + 2 * i]; } }
                return `${kto} ${naj}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    string kto;
    int najw;
    cin >> kto >> najw;
    for (int i = 1; i < n; i++) {
        string imie;
        int pkt;
        cin >> imie >> pkt;
        if (pkt > najw) {
            najw = pkt;
            kto = imie;
        }
    }
    cout << kto << " " << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-wszystkie-minima', krok: 4, level: 'latwe',
            title: 'Wszystkie najsłabsze miejsca',
            short: 'Wypisz numery wszystkich pozycji, na których stoi najmniejsza liczba.',
            tags: ['dwa przejścia', 'vector', 'v[i] == mini'],
            statement: ['Wczytaj n liczb całkowitych. Wypisz w jednym wierszu, rosnąco, numery wszystkich pozycji, na których stoi najmniejsza z nich (pozycje numerujemy od 1).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: numery pozycji najmniejszej liczby.'],
            constraints: ['1 ≤ n ≤ 3000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n4 1 9 1 1 7' }],
            hint: R`Dwa przejścia po vectorze: najpierw znajdź minimum, a potem przejdź jeszcze raz i dla każdego v[i] == mini wypisz i + 1.`,
            tests: (r) => ['1\n3', '4\n2 2 2 2', '5\n5 4 3 2 1', fmt(arr(r, 30, 0, 3)), fmt(arr(r, 3000, -1e9, 1e9)), fmt(arr(r, 3000, 0, 2)), fmt(Array(3000).fill(-1000000000))],
            solve: (inp) => { const v = czytaj(inp).v; const m = Math.min(...v); return v.map((x, i) => (x === m ? i + 1 : 0)).filter(Boolean).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int mini = v[0];
    for (auto x : v) mini = min(mini, x);
    for (int i = 0; i < n; i++) {
        if (v[i] == mini) cout << i + 1 << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najblizej-celu', krok: 4, level: 'srednie',
            title: 'Najbliżej celu',
            short: 'Która liczba jest najbliżej celu? Przy remisie wygrywa mniejsza.',
            tags: ['abs(x - c)', 'rekord według własnej miary', 'remis'],
            statement: ['W zgadywance każdy z n uczestników podał jedną liczbę. Wygrywa liczba najbliższa liczbie c. Jeśli dwie liczby są tak samo blisko c, wygrywa mniejsza z nich. Wypisz zwycięską liczbę.'],
            input_format: ['W pierwszym wierszu liczby n i c.', 'W drugim wierszu n liczb całkowitych — odpowiedzi uczestników.'],
            output_format: ['Jedna liczba — zwycięska odpowiedź.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁶ ≤ c ≤ 10⁶', '−10⁶ ≤ każda odpowiedź ≤ 10⁶'],
            examples: [{ input: '5 50\n38 61 44 56 70', note: '44 i 56 są tak samo blisko (o 6), wygrywa mniejsza.' }, { input: '3 0\n-3 3 5' }],
            hint: R`Odległość od celu to abs(x - c). Zwycięzca zmienia się, gdy odległość jest mniejsza — albo gdy jest taka sama, a liczba mniejsza. Możesz też porównywać pary (abs(x - c), x) przez min — remis rozstrzygnie drugie miejsce pary.`,
            tests: (r) => {
                const t = (n, c, lo, hi) => `${n} ${c}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 5\n-5', '2 0\n7 -7', '2 0\n-7 7', '3 10\n10 10 10', '4 -1000000\n1000000 -999999 -1000000 0', t(20, 0, -10, 10), t(5000, 12345, -1e6, 1e6), t(5000, -500, -1000, 0), t(4000, 0, -3, 3)];
            },
            solve: (inp) => {
                const a = nums(inp); const n = a[0], c = a[1]; let b = a[2];
                for (let i = 0; i < n; i++) { const x = a[2 + i]; const d = Math.abs(x - c), db = Math.abs(b - c); if (d < db || (d === db && x < b)) b = x; }
                return String(b);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, c;
    cin >> n >> c;
    int naj;
    cin >> naj;
    for (int i = 1; i < n; i++) {
        int x;
        cin >> x;
        int d = abs(x - c), dn = abs(naj - c);
        if (d < dn || (d == dn && x < naj)) naj = x;
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-punkty-potem-czas', krok: 4, level: 'srednie',
            title: 'Punkty, a potem czas',
            short: 'Wygrywa najwięcej punktów, przy remisie — krótszy czas, a potem kolejność na liście.',
            tags: ['dwa kryteria', 'warunek z || i &&', 'remis'],
            statement: ['Zawodnicy rozwiązywali zadania. Wygrywa osoba z największą liczbą punktów. Przy remisie wygrywa ta, która potrzebowała mniej czasu, a jeśli i czas jest taki sam — ta, która jest wcześniej na liście. Wypisz imię zwycięzcy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy: imię, punkty i czas w minutach.'],
            output_format: ['Imię zwycięzcy.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ punkty ≤ 100', '1 ≤ czas ≤ 300', 'Imię ma od 2 do 12 liter: wielka, a potem małe.'],
            examples: [{ input: '4\nOla 80 120\nKuba 95 200\nEwa 95 150\nJan 95 150', note: 'Kuba, Ewa i Jan mają po 95 punktów. Ewa i Jan byli szybsi od Kuby, a Ewa jest wcześniej niż Jan.' }],
            hint: R`Zwycięzca się zmienia, gdy: pkt > najPkt || (pkt == najPkt && czas < najCzas). Ostre znaki sprawiają, że przy pełnym remisie zostaje osoba wcześniejsza. Możesz też porównywać pary (punkty, −czas) — sztuczka z minusem z lekcji o parach.`,
            tests: (r) => {
                const t = (n, pl, ph, cl, ch) => `${n}\n${Array.from({ length: n }, () => `${r.pick(IMIONA)} ${r.int(pl, ph)} ${r.int(cl, ch)}`).join('\n')}`;
                return ['1\nAla 0 1', '3\nOla 50 100\nJan 50 100\nEwa 50 99', '3\nOla 50 100\nJan 51 300\nEwa 50 1', t(10, 0, 3, 1, 3), t(1000, 0, 100, 1, 300), t(1000, 98, 100, 1, 20)];
            },
            solve: (inp) => {
                const t = toks(inp); let kto = t[1], p = Number(t[2]), c = Number(t[3]);
                for (let i = 1; i < Number(t[0]); i++) { const pp = Number(t[2 + 3 * i]), cc = Number(t[3 + 3 * i]); if (pp > p || (pp === p && cc < c)) { kto = t[1 + 3 * i]; p = pp; c = cc; } }
                return kto;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    string kto;
    int najPkt, najCzas;
    cin >> kto >> najPkt >> najCzas;
    for (int i = 1; i < n; i++) {
        string imie;
        int pkt, czas;
        cin >> imie >> pkt >> czas;
        if (pkt > najPkt || (pkt == najPkt && czas < najCzas)) {
            kto = imie;
            najPkt = pkt;
            najCzas = czas;
        }
    }
    cout << kto << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najdluzsze-imie', krok: 4, level: 'srednie',
            title: 'Najdłuższe imię',
            short: 'Najdłuższe imię z listy, a przy remisie — to, które jest najwcześniej w alfabecie.',
            tags: ['rekord napisów', 's.size()', 'porządek słownikowy przy remisie'],
            statement: ['Wczytaj n imion. Wypisz najdłuższe z nich. Jeśli kilka imion ma tę samą, największą długość, wypisz to, które jest najwcześniej w alfabecie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy jedno imię.'],
            output_format: ['Jedno imię.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imię ma od 2 do 15 liter: wielka, a potem małe.'],
            examples: [{ input: '5\nOla\nBartek\nZuzanna\nTymon\nAndrzej', note: 'Zuzanna i Andrzej mają po 7 liter — Andrzej jest wcześniej w alfabecie.' }],
            hint: R`Najlepsze imię zmienia się, gdy nowe jest dłuższe — albo tak samo długie i wcześniejsze w alfabecie: s.size() > naj.size() || (s.size() == naj.size() && s < naj).`,
            tests: (r) => {
                const t = (n, lo, hi) => `${n}\n${Array.from({ length: n }, () => { const w = r.word(r.int(lo, hi)); return w[0].toUpperCase() + w.slice(1); }).join('\n')}`;
                return ['1\nAl', '3\nAla\nOla\nEla', '3\nOla\nOla\nOla', t(10, 2, 6), t(1000, 2, 15), t(1000, 5, 6)];
            },
            solve: (inp) => {
                const w = toks(inp).slice(1); let b = w[0];
                for (const s of w) if (s.length > b.length || (s.length === b.length && s < b)) b = s;
                return b;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    string naj;
    cin >> naj;
    for (int i = 1; i < n; i++) {
        string s;
        cin >> s;
        if (s.size() > naj.size() || (s.size() == naj.size() && s < naj)) naj = s;
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 5 · max_element i min_element
        {
            id: 'mm-wartosc-i-miejsce', krok: 5, level: 'latwe',
            title: 'Wartość i miejsce',
            short: 'max_element i min_element: wartości i numery pozycji obu skrajnych liczb.',
            tags: ['*max_element', 'max_element − v.begin()', 'min_element'],
            statement: ['Wczytaj n liczb całkowitych do vectora. Wypisz w jednym wierszu cztery liczby: największą liczbę, numer pozycji jej pierwszego wystąpienia, najmniejszą liczbę i numer pozycji jej pierwszego wystąpienia (pozycje numerujemy od 1).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: cztery liczby.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n4 9 2 9 1' }],
            hint: R`max_element(v.begin(), v.end()) daje strzałkę: *strzałka to wartość, a strzałka − v.begin() to numer liczony od 0 — dodaj 1. Z min_element tak samo.`,
            tests: (r) => ['1\n7', '2\n5 5', '3\n1 2 3', fmt(arr(r, 30, -5, 5)), fmt(arr(r, 5000, -1e9, 1e9)), fmt(arr(r, 5000, 0, 2))],
            solve: (inp) => { const v = czytaj(inp).v; const mx = Math.max(...v), mn = Math.min(...v); return `${mx} ${v.indexOf(mx) + 1} ${mn} ${v.indexOf(mn) + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    auto a = max_element(v.begin(), v.end());
    auto b = min_element(v.begin(), v.end());
    cout << *a << " " << a - v.begin() + 1 << " " << *b << " " << b - v.begin() + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-max-w-kawalku', krok: 5, level: 'latwe',
            title: 'Największa w kawałku',
            short: 'q pytań: jaka jest największa liczba między pozycjami a i b?',
            tags: ['max_element na kawałku', 'v.begin() + a - 1', 'zakres [od, do)'],
            statement: ['Wczytaj ciąg n liczb całkowitych, a potem q pytań. Każde pytanie to dwie liczby a i b, a odpowiedzią jest największa liczba spośród tych, które stoją na pozycjach od a do b włącznie (pozycje numerujemy od 1). Odpowiedz na wszystkie pytania.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb całkowitych.', 'W każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['q wierszy — odpowiedzi na pytania.'],
            constraints: ['1 ≤ n, q ≤ 1000', '1 ≤ a ≤ b ≤ n', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6 3\n8 1 6 3 9 2\n2 4\n1 6\n6 6' }],
            hint: R`Pozycja a to pudełko a − 1, a druga strzałka ma pokazywać miejsce ZA pozycją b, czyli pudełko b: *max_element(v.begin() + a - 1, v.begin() + b).`,
            check: (inp) => { const a = nums(inp); const n = a[0], q = a[1]; for (let i = 0; i < q; i++) { const x = a[2 + n + 2 * i], y = a[3 + n + 2 * i]; if (!(1 <= x && x <= y && y <= n)) return 'zle a, b'; } return null; },
            tests: (r) => {
                const t = (n, q, lo, hi) => { const p = Array.from({ length: q }, () => { const x = r.int(1, n), y = r.int(1, n); return `${Math.min(x, y)} ${Math.max(x, y)}`; }); return `${n} ${q}\n${arr(r, n, lo, hi).join(' ')}\n${p.join('\n')}`; };
                return ['1 1\n-5\n1 1', '3 3\n1 2 3\n1 1\n2 3\n1 3', t(10, 10, -9, 9), t(1000, 1000, -1e9, 1e9), t(1000, 1000, 0, 5)];
            },
            solve: (inp) => {
                const a = nums(inp); const n = a[0], q = a[1]; const v = a.slice(2, 2 + n); const out = [];
                for (let i = 0; i < q; i++) { const x = a[2 + n + 2 * i], y = a[3 + n + 2 * i]; let m = -Infinity; for (let k = x - 1; k < y; k++) m = Math.max(m, v[k]); out.push(m); }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    for (int i = 0; i < q; i++) {
        int a, b;
        cin >> a >> b;
        cout << *max_element(v.begin() + a - 1, v.begin() + b) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'mm-najdalsza-litera', krok: 5, level: 'latwe',
            title: 'Najdalej w alfabecie',
            short: 'Która litera słowa jest najdalej w alfabecie i ile razy występuje?',
            tags: ['max_element na string', 'count', 'znaki'],
            statement: ['Wczytaj słowo złożone z małych liter angielskich. Wypisz literę, która jest w nim najdalej w alfabecie, i to, ile razy występuje.'],
            input_format: ['Jedno słowo.'],
            output_format: ['Jeden wiersz: litera i liczba jej wystąpień.'],
            constraints: ['Słowo ma od 1 do 50 000 liter.'],
            examples: [{ input: 'programowanie' }, { input: 'kajak' }],
            hint: R`Napis to rząd znaków, więc *max_element(s.begin(), s.end()) daje szukaną literę, a count(s.begin(), s.end(), litera) — liczbę jej wystąpień.`,
            tests: (r) => ['a', 'z', 'abcabc', 'zzzz', r.word(30), r.word(50000), r.word(50000, 'abc'), r.word(20000, 'mnopqrsy')],
            solve: (inp) => { const s = toks(inp)[0]; let m = 'a'; for (const c of s) if (c > m) m = c; return `${m} ${s.split('').filter((c) => c === m).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    char m = *max_element(s.begin(), s.end());
    cout << m << " " << count(s.begin(), s.end(), m) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-pierwszy-ostatni-pociag', krok: 5, level: 'latwe',
            title: 'Pierwszy i ostatni pociąg',
            short: 'Godziny odjazdów GG:MM w przypadkowej kolejności — który pociąg pierwszy, a który ostatni?',
            tags: ['min i max na string', 'format GG:MM', 'min_element'],
            statement: ['Na tablicy odjazdów wypisano godziny n pociągów w formacie GG:MM (zawsze dwie cyfry godziny i dwie cyfry minut, np. 07:05) w przypadkowej kolejności. Wypisz godzinę odjazdu pierwszego i ostatniego pociągu tego dnia, każdą w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy godzina w formacie GG:MM.'],
            output_format: ['Dwa wiersze: najwcześniejsza i najpóźniejsza godzina.'],
            constraints: ['1 ≤ n ≤ 1000', 'Godziny od 00 do 23, minuty od 00 do 59.'],
            examples: [{ input: '4\n12:30\n07:05\n23:59\n09:45' }],
            hint: R`Nie trzeba niczego przeliczać na minuty! Napisy w tym samym formacie GG:MM porównują się znak po znaku dokładnie tak jak godziny („07:05” < „09:45”, bo '0' = '0', a '7' < '9'). Wystarczą min i max na stringach albo min_element i max_element.`,
            tests: (r) => {
                const g = () => `${String(r.int(0, 23)).padStart(2, '0')}:${String(r.int(0, 59)).padStart(2, '0')}`;
                const t = (n) => `${n}\n${Array.from({ length: n }, g).join('\n')}`;
                return ['1\n00:00', '2\n23:59\n00:00', '3\n09:59\n10:00\n09:05', t(10), t(1000)];
            },
            solve: (inp) => { const w = toks(inp).slice(1).sort(); return `${w[0]}\n${w[w.length - 1]}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> g(n);
    for (auto &x : g) cin >> x;
    cout << *min_element(g.begin(), g.end()) << "\n";
    cout << *max_element(g.begin(), g.end()) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-najdluzsze-slowo-miejsce', krok: 5, level: 'srednie',
            title: 'Najdłuższe słowo i jego miejsce',
            short: 'max_element z własną regułą: najdłuższe słowo i numer jego pozycji.',
            tags: ['max_element z lambdą', 'a.size() < b.size()', 'pierwsze z równych'],
            statement: ['Wczytaj n słów. Wypisz najdłuższe słowo i numer jego pozycji (od 1). Jeśli kilka słów ma tę samą, największą długość, wybierz to, które występuje najwcześniej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów oddzielonych spacjami.'],
            output_format: ['Jeden wiersz: najdłuższe słowo i numer jego pozycji.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każde słowo ma od 1 do 20 małych liter angielskich.'],
            examples: [{ input: '5\nkot zebra pies tygrys jaguar', note: '„tygrys” i „jaguar” mają po 6 liter — „tygrys” jest wcześniej.' }],
            hint: R`max_element z regułą porównującą długości: [](string a, string b) { return a.size() < b.size(); } — przy remisie oddaje pierwsze słowo. Numer pozycji to strzałka − w.begin() + 1.`,
            tests: (r) => {
                const t = (n, lo, hi) => `${n}\n${Array.from({ length: n }, () => r.word(r.int(lo, hi))).join(' ')}`;
                return ['1\na', '3\nab cd ef', '3\na bb a', t(10, 1, 8), t(1000, 1, 20), t(1000, 3, 4)];
            },
            solve: (inp) => { const w = toks(inp).slice(1); let b = 0; w.forEach((s, i) => { if (s.length > w[b].length) b = i; }); return `${w[b]} ${b + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> w(n);
    for (auto &s : w) cin >> s;
    auto it = max_element(w.begin(), w.end(), [](string a, string b) {
        return a.size() < b.size();
    });
    cout << *it << " " << it - w.begin() + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-zamien-skrajne', krok: 5, level: 'srednie',
            title: 'Zamień skrajne',
            short: 'Zamień miejscami największą i najmniejszą liczbę ciągu.',
            tags: ['max_element i min_element', 'iter_swap', 'swap(v[i], v[j])'],
            statement: ['Wczytaj n liczb całkowitych. Zamień miejscami największą liczbę z najmniejszą i wypisz cały ciąg. Jeśli największa albo najmniejsza liczba występuje kilka razy, zamieniasz jej pierwsze wystąpienie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: ciąg po zamianie.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '6\n4 9 2 9 1 1', note: 'Pierwsza dziewiątka (pozycja 2) zamienia się z pierwszą jedynką (pozycja 5).' }],
            hint: R`Strzałki z max_element i min_element możesz od razu przekazać do iter_swap(a, b) — zamienia elementy, na które pokazują. Albo policz numery i użyj swap(v[i], v[j]). Gdy wszystkie liczby są równe, obie strzałki pokazują ten sam element i nic się nie zmienia.`,
            tests: (r) => ['1\n5', '2\n1 2', '3\n7 7 7', '4\n-1 -1 3 3', fmt(arr(r, 30, -9, 9)), fmt(arr(r, 2000, -1e6, 1e6)), fmt(arr(r, 2000, 0, 3))],
            solve: (inp) => { const v = czytaj(inp).v; const i = v.indexOf(Math.max(...v)), j = v.indexOf(Math.min(...v)); [v[i], v[j]] = [v[j], v[i]]; return v.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    iter_swap(max_element(v.begin(), v.end()), min_element(v.begin(), v.end()));
    for (auto x : v) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-srednia-bez-skrajnosci', krok: 5, level: 'srednie',
            title: 'Średnia bez skrajności',
            short: 'Odrzuć jeden najwyższy i jeden najniższy wynik, a z reszty policz średnią.',
            tags: ['*max_element i *min_element', 'long long', 'dzielenie przez double'],
            statement: ['Wczytaj n wyników. Odrzuć jeden najwyższy i jeden najniższy wynik (nawet jeśli się powtarzają, odrzucasz tylko po jednym), a z pozostałych n − 2 wyników policz średnią. Wypisz ją z dokładnie dwiema cyframi po kropce.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — wyniki.'],
            output_format: ['Jedna liczba z dwiema cyframi po kropce.'],
            constraints: ['3 ≤ n ≤ 5000', '0 ≤ każdy wynik ≤ 10⁶'],
            examples: [{ input: '5\n7 1 9 4 9', note: 'Odrzucamy jedną dziewiątkę i jedynkę: (7 + 4 + 9) / 3 = 6.67.' }],
            hint: R`(suma − max − min) / (n − 2). Sumę trzymaj w long long — 5000 wyników po milion to więcej, niż mieści int. Dziel przez (double)(n - 2), a wypisz z fixed i setprecision(2).`,
            tests: (r) => {
                const out = ['3\n0 0 0', '3\n1 1000000 5', '4\n1 2 3 4'];
                const dobre = (n, lo, hi) => { for (;;) { const v = arr(r, n, lo, hi); const s = v.reduce((a, b) => a + b, 0) - Math.max(...v) - Math.min(...v); if (safe(s / (n - 2), 2)) return fmt(v); } };
                out.push(dobre(10, 0, 100), dobre(500, 0, 1e6), dobre(5000, 0, 1e6), dobre(4999, 999000, 1e6));
                return out;
            },
            solve: (inp) => { const v = czytaj(inp).v; const s = v.reduce((a, b) => a + b, 0) - Math.max(...v) - Math.min(...v); return fx(s / (v.length - 2), 2); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> v(n);
    long long suma = 0;
    for (auto &x : v) {
        cin >> x;
        suma += x;
    }
    suma -= *max_element(v.begin(), v.end());
    suma -= *min_element(v.begin(), v.end());
    cout << fixed << setprecision(2) << suma / (double)(n - 2) << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 6 · przycinanie i przedziały
        {
            id: 'mm-przytnij', krok: 6, level: 'latwe',
            title: 'Przytnij do przedziału',
            short: 'Każdą liczbę wciśnij w przedział od L do R.',
            tags: ['max(L, min(R, x))', 'clamp', 'podłoga i sufit'],
            statement: ['Wczytaj n liczb całkowitych oraz granice L i R. Każdą liczbę przytnij do przedziału od L do R: liczby mniejsze od L zamień na L, większe od R — na R, a pozostałe zostaw bez zmian. Wypisz wynik w jednym wierszu.'],
            input_format: ['W pierwszym wierszu liczby n, L i R.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb po przycięciu.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁶ ≤ L ≤ R ≤ 10⁶', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5 0 100\n150 -30 42 100 0' }],
            hint: R`max(L, min(R, x)) albo gotowe clamp(x, L, R). Pamiętaj: przy dolnej granicy stoi max, przy górnej min.`,
            check: (inp) => { const a = nums(inp); return a[1] <= a[2] ? null : 'L > R'; },
            tests: (r) => {
                const t = (n, L, R, lo, hi) => `${n} ${L} ${R}\n${arr(r, n, lo, hi).join(' ')}`;
                return ['1 5 5\n-1000000000', '3 -10 10\n-11 10 11', t(20, 0, 9, -20, 30), t(2000, -1e6, 1e6, -1e9, 1e9), t(2000, -500, 700, -1000, 1000), t(2000, 3, 3, -5, 5)];
            },
            solve: (inp) => { const a = nums(inp); const [n, L, R] = a; return a.slice(3, 3 + n).map((x) => Math.max(L, Math.min(R, x))).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, L, R;
    cin >> n >> L >> R;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        cout << max(L, min(R, x)) << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-punkty-zycia', krok: 6, level: 'latwe',
            title: 'Punkty życia',
            short: 'Mikstury i obrażenia — życie bohatera nie spada poniżej 0 i nie rośnie ponad maksimum.',
            tags: ['max(0, …)', 'min(H, …)', 'symulacja'],
            statement: ['Bohater gry ma na początku P punktów życia, a najwięcej może mieć H. Po kolei dzieje się n zdarzeń: liczba dodatnia to mikstura leczenia (życie rośnie o tyle, ale nie powyżej H), a liczba ujemna — obrażenia (życie maleje o tyle, ale nie poniżej 0). Wypisz w jednym wierszu liczbę punktów życia po każdym zdarzeniu.'],
            input_format: ['W pierwszym wierszu liczby H, P i n.', 'W drugim wierszu n niezerowych liczb całkowitych — zdarzenia.'],
            output_format: ['Jeden wiersz: n liczb — życie po kolejnych zdarzeniach.'],
            constraints: ['1 ≤ H ≤ 1000', '0 ≤ P ≤ H', '1 ≤ n ≤ 2000', '−1000 ≤ każde zdarzenie ≤ 1000'],
            examples: [{ input: '100 30 5\n-12 -45 60 50 -100', note: '30 − 12 = 18; 18 − 45 to mniej niż 0, więc 0; potem 60; 60 + 50 to więcej niż 100, więc 100; na koniec 0.' }],
            hint: R`hp = max(0, min(H, hp + z)); — sufit H i podłoga 0 w jednej linijce. Po spadku do zera mikstura znowu podnosi życie — w tej grze nie ma „końca gry”.`,
            check: (inp) => { const a = nums(inp); return a[1] <= a[0] && a.slice(3).every((x) => x !== 0) ? null : 'zle P albo zero'; },
            tests: (r) => {
                const z = (n, lo, hi) => Array.from({ length: n }, () => { let x = 0; while (x === 0) x = r.int(lo, hi); return x; });
                const t = (H, P, n, lo, hi) => `${H} ${P} ${n}\n${z(n, lo, hi).join(' ')}`;
                return ['1 0 3\n1 1 -1', '1000 1000 2\n1000 -1000', t(50, 25, 20, -30, 30), t(1000, 500, 2000, -400, 400), t(100, 0, 2000, -1000, 1000), t(700, 7, 2000, -20, 25)];
            },
            solve: (inp) => { const a = nums(inp); const [H, P, n] = a; let hp = P; const out = []; for (let i = 0; i < n; i++) { hp = Math.max(0, Math.min(H, hp + a[3 + i])); out.push(hp); } return out.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int H, hp, n;
    cin >> H >> hp >> n;
    for (int i = 0; i < n; i++) {
        int z;
        cin >> z;
        hp = max(0, min(H, hp + z));
        cout << hp << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-wspolny-czas', krok: 6, level: 'latwe',
            title: 'Wspólny czas',
            short: 'Ola i Kuba są wolni w różnych godzinach. Ile minut mogą spędzić razem?',
            tags: ['max początków', 'min końców', 'max(0, …)'],
            statement: ['Ola jest wolna od minuty a1 do minuty b1, a Kuba — od minuty a2 do minuty b2 (minuty liczymy od północy). Wspólny czas zaczyna się, gdy oboje są już wolni, a kończy, gdy któreś z nich przestaje być wolne. Wypisz, ile minut trwa wspólny czas (0, jeśli go nie ma).'],
            input_format: ['Jeden wiersz: cztery liczby całkowite a1, b1, a2, b2.'],
            output_format: ['Jedna liczba — długość wspólnego czasu w minutach.'],
            constraints: ['0 ≤ a1 < b1 ≤ 1440', '0 ≤ a2 < b2 ≤ 1440'],
            examples: [{ input: '840 1080 960 1200', note: 'Wspólny czas od 960 do 1080.' }, { input: '120 300 300 400', note: 'Kuba zaczyna dokładnie wtedy, gdy Ola kończy — wspólnego czasu nie ma.' }],
            hint: R`Początek wspólnego czasu: max(a1, a2). Koniec: min(b1, b2). Długość: max(0, koniec - początek).`,
            check: (inp) => { const [a1, b1, a2, b2] = nums(inp); return a1 < b1 && a2 < b2 && b1 <= 1440 && b2 <= 1440 && a1 >= 0 && a2 >= 0 ? null : 'zle przedzialy'; },
            tests: (r) => {
                const p = () => { const x = r.int(0, 1439), y = r.int(x + 1, 1440); return `${x} ${y}`; };
                return ['0 1440 0 1440', '0 1 1439 1440', '100 200 150 160', '150 160 100 200', '500 600 100 499', ...Array.from({ length: 8 }, () => `${p()} ${p()}`)];
            },
            solve: (inp) => { const [a1, b1, a2, b2] = nums(inp); return String(Math.max(0, Math.min(b1, b2) - Math.max(a1, a2))); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a1, b1, a2, b2;
    cin >> a1 >> b1 >> a2 >> b2;
    cout << max(0, min(b1, b2) - max(a1, a2)) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-przelewanie', krok: 6, level: 'latwe',
            title: 'Z dzbanka do szklanki',
            short: 'Przelewasz wodę, aż dzbanek będzie pusty albo szklanka pełna. Ile gdzie zostanie?',
            tags: ['min(a, p - b)', 'sufit pojemności'],
            statement: ['W dzbanku jest a ml wody, a w szklance b ml. Szklanka mieści najwyżej p ml. Przelewamy wodę z dzbanka do szklanki tak długo, aż dzbanek będzie pusty albo szklanka pełna. Wypisz w jednym wierszu, ile wody zostało w dzbanku i ile jest w szklance.'],
            input_format: ['Jeden wiersz: trzy liczby całkowite a, b, p.'],
            output_format: ['Jeden wiersz: dwie liczby.'],
            constraints: ['0 ≤ a ≤ 10⁹', '0 ≤ b ≤ p ≤ 10⁹'],
            examples: [{ input: '700 150 250' }, { input: '60 150 250', note: 'W dzbanku jest mniej, niż zmieści szklanka — przelewa się wszystko.' }],
            hint: R`Przeleje się min(a, p - b) ml: tyle, ile jest w dzbanku, ale nie więcej, niż zostało miejsca w szklance. Odejmij to od dzbanka i dodaj do szklanki.`,
            check: (inp) => { const [a, b, p] = nums(inp); return b <= p ? null : 'b > p'; },
            tests: (r) => ['0 0 0', '0 5 10', '5 10 10', '1000000000 0 1000000000', '1000000000 1 1000000000', '7 3 10', '8 3 10',
                ...Array.from({ length: 6 }, () => { const p = r.int(0, 1e9), b = r.int(0, p); return `${r.int(0, 1e9)} ${b} ${p}`; })],
            solve: (inp) => { const [a, b, p] = nums(inp); const x = Math.min(a, p - b); return `${a - x} ${b + x}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b, p;
    cin >> a >> b >> p;
    int ile = min(a, p - b);
    cout << a - ile << " " << b + ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-wspolna-czesc-wielu', krok: 6, level: 'srednie',
            title: 'Wspólna część wielu przedziałów',
            short: 'Ile liczb całkowitych należy do wszystkich n przedziałów naraz?',
            tags: ['max początków i min końców', 'dwa rekordy', 'R − L + 1'],
            statement: ['Danych jest n przedziałów liczb całkowitych [l, r] — oba końce należą do przedziału. Wypisz, ile liczb całkowitych należy do wszystkich przedziałów naraz.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby l i r.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 3000', '−10⁹ ≤ l ≤ r ≤ 10⁹'],
            examples: [{ input: '3\n1 10\n4 15\n-2 7', note: 'Wspólna część to [4, 7]: liczby 4, 5, 6, 7.' }, { input: '2\n1 3\n5 8' }],
            hint: R`Wspólna część zaczyna się w największym z początków (L), a kończy w najmniejszym z końców (R) — dwa rekordy w jednej pętli. Liczb całkowitych od L do R jest R − L + 1, a gdy L > R — zero: max(0, R - L + 1).`,
            check: (inp) => { const a = nums(inp); for (let i = 0; i < a[0]; i++) if (a[1 + 2 * i] > a[2 + 2 * i]) return 'l > r'; return null; },
            tests: (r) => {
                const t = (n, lo, hi) => `${n}\n${Array.from({ length: n }, () => { const x = r.int(lo, hi), y = r.int(lo, hi); return `${Math.min(x, y)} ${Math.max(x, y)}`; }).join('\n')}`;
                const sr = (n, c, d) => `${n}\n${Array.from({ length: n }, () => `${c - r.int(0, d)} ${c + r.int(0, d)}`).join('\n')}`;
                return ['1\n-1000000000 1000000000', '1\n5 5', '2\n5 5\n5 5', '2\n1 4\n4 9', t(10, -20, 20), sr(3000, 123456, 1e8), sr(3000, -7, 3), t(3000, -1e9, 1e9)];
            },
            solve: (inp) => { const a = nums(inp); let L = -Infinity, R = Infinity; for (let i = 0; i < a[0]; i++) { L = Math.max(L, a[1 + 2 * i]); R = Math.min(R, a[2 + 2 * i]); } return String(Math.max(0, R - L + 1)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int L = INT_MIN, R = INT_MAX;
    for (int i = 0; i < n; i++) {
        int l, r;
        cin >> l >> r;
        L = max(L, l);
        R = min(R, r);
    }
    cout << max(0, R - L + 1) << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-wspolne-pole', krok: 6, level: 'srednie',
            title: 'Wspólne pole dwóch prostokątów',
            short: 'Dwa prostokąty na planszy — jakie pole ma ich część wspólna?',
            tags: ['wspólna część na osi x i y', 'max(0LL, …)', 'long long'],
            statement: ['Na kartce narysowano dwa prostokąty o bokach równoległych do osi. Każdy opisują współrzędne lewego dolnego rogu (x1, y1) i prawego górnego rogu (x2, y2). Wypisz pole części wspólnej tych prostokątów (0, jeśli się nie nakładają albo tylko stykają bokiem lub rogiem).'],
            input_format: ['Dwa wiersze, w każdym cztery liczby całkowite x1, y1, x2, y2 jednego prostokąta.'],
            output_format: ['Jedna liczba — pole części wspólnej.'],
            constraints: ['−10⁹ ≤ każda współrzędna ≤ 10⁹', 'x1 < x2 oraz y1 < y2'],
            examples: [{ input: '0 0 6 4\n3 2 9 7', note: 'Część wspólna to prostokąt od (3, 2) do (6, 4): 3 · 2 = 6.' }, { input: '0 0 2 2\n2 0 4 2', note: 'Prostokąty tylko się stykają.' }],
            hint: R`Osobno oś x i oś y. Szerokość części wspólnej: max(0LL, min(x2, X2) - max(x1, X1)), wysokość — tak samo z y. Pole = szerokość · wysokość może sięgać 4·10¹⁸, więc wszystko w long long.`,
            check: (inp) => { const a = nums(inp); return a[0] < a[2] && a[1] < a[3] && a[4] < a[6] && a[5] < a[7] ? null : 'zly prostokat'; },
            tests: (r) => {
                const pr = (lo, hi) => { const x = r.int(lo, hi - 1), y = r.int(lo, hi - 1); return `${x} ${y} ${r.int(x + 1, hi)} ${r.int(y + 1, hi)}`; };
                return ['-1000000000 -1000000000 1000000000 1000000000\n-1000000000 -1000000000 1000000000 1000000000', '0 0 1 1\n1 1 2 2', '0 0 10 10\n2 3 4 5', '2 3 4 5\n0 0 10 10',
                    '0 0 5 5\n5 0 9 5', '0 0 5 5\n6 6 9 9', ...Array.from({ length: 6 }, () => `${pr(-10, 10)}\n${pr(-10, 10)}`), ...Array.from({ length: 4 }, () => `${pr(-1e9, 1e9)}\n${pr(-1e9, 1e9)}`)];
            },
            solve: (inp) => {
                const [x1, y1, x2, y2, X1, Y1, X2, Y2] = toks(inp).map(BigInt);
                const s = bmax(0n, bmin(x2, X2) - bmax(x1, X1)), w = bmax(0n, bmin(y2, Y2) - bmax(y1, Y1));
                return String(s * w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long x1, y1, x2, y2, X1, Y1, X2, Y2;
    cin >> x1 >> y1 >> x2 >> y2 >> X1 >> Y1 >> X2 >> Y2;
    long long szer = max(0LL, min(x2, X2) - max(x1, X1));
    long long wys = max(0LL, min(y2, Y2) - max(y1, Y1));
    cout << szer * wys << "\n";
    return 0;
}`,
        },
        {
            id: 'mm-bateria', krok: 6, level: 'srednie',
            title: 'Bateria w telefonie',
            short: 'Ładowanie i zużycie baterii od 0 do 100%. Jaki stan na końcu i ile razy bateria uderzyła w granicę?',
            tags: ['clamp(x, 0, 100)', 'licznik', 'symulacja'],
            statement: ['Telefon ma na początku 50% baterii. Po kolei dzieje się n zdarzeń: liczba dodatnia oznacza ładowanie o tyle punktów procentowych, a ujemna — zużycie. Bateria nigdy nie ma mniej niż 0% ani więcej niż 100%. Wypisz w jednym wierszu stan baterii po wszystkich zdarzeniach oraz liczbę zdarzeń, przy których bateria „uderzyła” w granicę — czyli wynik bez ograniczeń byłby mniejszy od 0 albo większy od 100.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n niezerowych liczb całkowitych — zdarzenia.'],
            output_format: ['Jeden wiersz: stan baterii na końcu i liczba uderzeń w granicę.'],
            constraints: ['1 ≤ n ≤ 5000', '−100 ≤ każde zdarzenie ≤ 100'],
            examples: [{ input: '5\n30 40 -90 -20 15', note: '50 → 80 → 100 (byłoby 120) → 10 → 0 (byłoby −10) → 15. Dwa uderzenia w granicę.' }],
            hint: R`Najpierw policz nowy = bateria + z. Jeśli nowy < 0 albo nowy > 100, zwiększ licznik. Dopiero potem bateria = clamp(nowy, 0, 100); (albo max(0, min(100, nowy))).`,
            check: (inp) => (nums(inp).slice(1).every((x) => x !== 0) ? null : 'zero'),
            tests: (r) => {
                const z = (n, lo, hi) => Array.from({ length: n }, () => { let x = 0; while (x === 0) x = r.int(lo, hi); return x; });
                return ['1\n50', '1\n-50', '1\n51', '2\n100 -100', fmt(z(20, -40, 40)), fmt(z(5000, -100, 100)), fmt(z(5000, -10, 12)), fmt(z(3000, -3, 2))];
            },
            solve: (inp) => { const v = czytaj(inp).v; let b = 50, u = 0; for (const z of v) { const x = b + z; if (x < 0 || x > 100) u++; b = Math.max(0, Math.min(100, x)); } return `${b} ${u}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int bateria = 50, uderzen = 0;
    for (int i = 0; i < n; i++) {
        int z;
        cin >> z;
        int nowy = bateria + z;
        if (nowy < 0 || nowy > 100) uderzen++;
        bateria = clamp(nowy, 0, 100);
    }
    cout << bateria << " " << uderzen << "\n";
    return 0;
}`,
        },
    ];
};
