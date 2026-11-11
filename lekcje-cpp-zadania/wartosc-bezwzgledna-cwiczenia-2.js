// Wartość bezwzględna — ćwiczenia w trakcie lekcji, części 4–6: najbliżej i najdalej (rekord według odległości,
// reguły remisów, pozycja, liczby w zasięgu, sąsiedzi celu, para o sumie najbliżej zera), skoki między sąsiadami
// (winda, największy skok, gładki ciąg, podejścia i zejścia, pisanie jednym palcem, listonosz, najmniejsza różnica
// po sortowaniu, wstrząsy) oraz kroki po kratce (odległość miejska, król, figury szachowe, rysunki z modułem).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const R = String.raw;
    const MLD = 1000000000;
    const wZakresie = (xs, lo, hi) => xs.every((x) => /^-?\d+$/.test(String(x)) && Number(x) >= lo && Number(x) <= hi);
    const losowe = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    // n liczb, część z nich to „bliźniaki” po drugiej stronie celu c (żeby były remisy)
    const zRemisami = (r, n, c, R2) => {
        const v = [];
        for (let i = 0; i < n; i++) {
            if (i > 0 && r.int(0, 3) === 0) { const x = v[r.int(0, i - 1)]; v.push(2 * c - x >= -R2 && 2 * c - x <= R2 ? 2 * c - x : x); }
            else v.push(r.int(-R2, R2));
        }
        return v;
    };
    const IMIONA = ['Ala', 'Bartek', 'Cela', 'Darek', 'Ewa', 'Franek', 'Gosia', 'Henio', 'Iza', 'Janek', 'Kasia', 'Leon', 'Magda', 'Nikodem',
        'Ola', 'Piotr', 'Roksana', 'Szymon', 'Tola', 'Witek', 'Zosia', 'Adam', 'Basia', 'Igor', 'Julia', 'Kuba', 'Lena', 'Marek', 'Natalia', 'Oskar'];
    const KOL = 'abcdefgh';
    const pole = (x, y) => `${KOL[x]}${y + 1}`;

    return [
        // ================================================================ KROK 4 · najbliżej i najdalej
        {
            id: 'abs-najblizej-zera', krok: 4, level: 'latwe',
            title: 'Najbliżej zera',
            short: 'Która liczba leży najbliżej zera? Przy remisie (−3 i 3) wygrywa dodatnia.',
            tags: ['rekord', 'abs(x) < abs(naj)', 'remis: dodatnia'],
            statement: ['Wczytaj n liczb całkowitych i wypisz tę, która leży najbliżej zera — razem z jej znakiem. Jeśli dwie liczby są tak samo blisko zera (na przykład −3 i 3), wybierz dodatnią.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — ta najbliżej zera.'],
            constraints: ['1 ≤ n ≤ 5000', '|każda liczba| ≤ 10⁹'],
            examples: [{ input: '5\n-7 3 -2 9 5' }, { input: '4\n-3 8 3 -5', note: '−3 i 3 leżą tak samo blisko zera — wygrywa dodatnia.' }],
            hint: R`Wzorzec rekordu: naj = pierwsza liczba, a potem dla każdej kolejnej x podmień, gdy abs(x) < abs(naj) albo gdy abs(x) == abs(naj) i x > naj (remis — wtedy wygrywa dodatnia). Zapamiętuj samą liczbę, nie jej moduł — inaczej zgubisz minus.`,
            tests: (r) => ['1\n-5', '2\n-3 3', '2\n3 -3', '3\n0 0 0', `4\n${-MLD} ${MLD} -999999999 999999999`, '5\n-4 -4 -4 4 -4',
                ...[10, 500, 5000].map((n) => `${n}\n${zRemisami(r, n, 0, MLD).join(' ')}`), `30\n${zRemisami(r, 30, 0, 15).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 5000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = toks(inp).slice(1).map(Number); let n = v[0]; for (const x of v) if (Math.abs(x) < Math.abs(n) || (Math.abs(x) === Math.abs(n) && x > n)) n = x; return String(n); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int naj;
    cin >> naj;
    for (int i = 1; i < n; i++) {
        int x;
        cin >> x;
        if (abs(x) < abs(naj) || (abs(x) == abs(naj) && x > naj)) naj = x;
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-ktory-najblizej', krok: 4, level: 'latwe',
            title: 'Który numer jest najbliżej?',
            short: 'Numer uczestnika najbliższego sekretnej liczbie c (przy remisie najmniejszy) i jego odległość.',
            tags: ['abs(x - c)', 'indeks rekordu', 'remis: pierwszy'],
            statement: ['W zgadywance n uczestników, ponumerowanych od 1, podało po jednej liczbie. Sekretna liczba to c. Wypisz numer uczestnika, którego liczba leży najbliżej c, i odległość tej liczby od c. Jeśli kilku uczestników jest tak samo blisko, wybierz najmniejszy numer.'],
            input_format: ['W pierwszym wierszu liczby c i n.', 'W drugim wierszu n liczb całkowitych — liczby kolejnych uczestników.'],
            output_format: ['Dwie liczby w jednym wierszu: numer uczestnika i odległość.'],
            constraints: ['1 ≤ n ≤ 5000', '|c|, |każda liczba| ≤ 10⁹'],
            examples: [{ input: '10 6\n12 5 9 20 11 15', note: 'Odległości: 2, 5, 1, 10, 1, 5. Najbliżej są uczestnicy 3 i 5 — wygrywa mniejszy numer.' }],
            hint: R`Zapamiętuj numer najlepszego uczestnika i jego odległość abs(x - c). Podmieniaj tylko przy ściśle mniejszej odległości (<) — wtedy przy remisie zostaje wcześniejszy, czyli ten z mniejszym numerem. Numeruj od 1: jeśli liczysz indeksy od 0, wypisz indeks + 1.`,
            tests: (r) => ['5 1\n5', `0 2\n${MLD} ${-MLD}`, `${MLD} 3\n${-MLD} 0 ${-MLD}`, '7 4\n9 5 9 5',
                ...[[10, 30], [600, MLD], [5000, MLD], [40, 10]].map(([n, R2]) => { const c = r.int(-R2, R2); return `${c} ${n}\n${zRemisami(r, n, c, R2).join(' ')}`; })],
            check: (inp) => { const t = toks(inp), n = Number(t[1]); return n >= 1 && n <= 5000 && t.length === n + 2 && wZakresie([t[0], ...t.slice(2)], -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), c = t[0], v = t.slice(2); let k = 0; v.forEach((x, i) => { if (Math.abs(x - c) < Math.abs(v[k] - c)) k = i; }); return `${k + 1} ${Math.abs(v[k] - c)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long c;
    int n;
    cin >> c >> n;
    int najNr = 0;
    long long najD = -1;
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        long long d = abs(x - c);
        if (najD < 0 || d < najD) {
            najD = d;
            najNr = i;
        }
    }
    cout << najNr << " " << najD << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-najdalej-od-celu', krok: 4, level: 'latwe',
            title: 'Najdalej od celu',
            short: 'Która liczba leży najdalej od c? Przy remisie wybierz większą.',
            tags: ['abs(x - c)', 'rekord z >', 'remis: większa'],
            statement: ['Wczytaj liczbę c oraz n liczb całkowitych. Wypisz tę liczbę, która leży najdalej od c. Jeśli dwie liczby są tak samo daleko (po dwóch stronach c), wybierz większą.'],
            input_format: ['W pierwszym wierszu liczby c i n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — ta najdalej od c.'],
            constraints: ['1 ≤ n ≤ 5000', '|c|, |każda liczba| ≤ 10⁹'],
            examples: [{ input: '10 4\n12 5 9 20' }, { input: '0 3\n-6 2 6', note: '−6 i 6 są tak samo daleko od zera — wybieramy większą.' }],
            hint: R`Ten sam wzorzec co przy „najbliżej”, tylko odwrotne porównanie: podmień, gdy abs(x - c) > abs(naj - c), albo gdy odległości są równe i x > naj. Odległość może mieć 2 miliardy — mieści się jeszcze w int, ale przy liczeniu w long long nie musisz się nad tym zastanawiać.`,
            tests: (r) => ['5 1\n5', `0 2\n${-MLD} ${MLD}`, `0 2\n${MLD} ${-MLD}`, `${-MLD} 3\n${MLD} ${-MLD} 0`, '3 4\n1 5 5 1',
                ...[[12, 20], [700, MLD], [5000, MLD]].map(([n, R2]) => { const c = r.int(-R2, R2); return `${c} ${n}\n${zRemisami(r, n, c, R2).join(' ')}`; })],
            check: (inp) => { const t = toks(inp), n = Number(t[1]); return n >= 1 && n <= 5000 && t.length === n + 2 && wZakresie([t[0], ...t.slice(2)], -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), c = t[0], v = t.slice(2); let n = v[0]; for (const x of v) { const d = Math.abs(x - c), dn = Math.abs(n - c); if (d > dn || (d === dn && x > n)) n = x; } return String(n); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long c;
    int n;
    cin >> c >> n;
    long long naj;
    cin >> naj;
    for (int i = 1; i < n; i++) {
        long long x;
        cin >> x;
        long long d = abs(x - c), dn = abs(naj - c);
        if (d > dn || (d == dn && x > naj)) naj = x;
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-w-zasiegu', krok: 4, level: 'latwe',
            title: 'W zasięgu nadajnika',
            short: 'Ile domów leży co najwyżej d od nadajnika w punkcie c, a ile poza zasięgiem?',
            tags: ['abs(x - c) <= d', 'liczenie', 'koniec się liczy'],
            statement: ['Przy prostej drodze stoi nadajnik w punkcie c o zasięgu d oraz n domów w podanych punktach. Dom ma zasięg, jeśli jego odległość od nadajnika jest nie większa niż d.', 'Wypisz w jednym wierszu dwie liczby: ile domów ma zasięg, a ile go nie ma.'],
            input_format: ['W pierwszym wierszu liczby c, d i n.', 'W drugim wierszu n liczb całkowitych — pozycje domów.'],
            output_format: ['Dwie liczby w jednym wierszu.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ d ≤ 10⁹', '|c|, |każda pozycja| ≤ 10⁹'],
            examples: [{ input: '10 2 5\n8 9 13 12 7', note: 'Odległości od nadajnika: 2, 1, 3, 2, 3. Zasięg mają domy w punktach 8, 9 i 12.' }],
            hint: R`Dla każdego domu sprawdź warunek abs(x - c) <= d i zwiększ odpowiedni licznik. Uwaga na koniec zasięgu: dom dokładnie d od nadajnika jeszcze ma zasięg (<=, a nie <).`,
            tests: (r) => ['0 0 1\n0', '0 0 1\n1', `0 ${MLD} 3\n${MLD} ${-MLD} 0`, `${MLD} 0 2\n${-MLD} ${MLD}`, '5 3 6\n2 8 1 9 5 5',
                ...[[20, 30], [800, MLD], [5000, MLD]].map(([n, R2]) => { const c = r.int(-R2, R2), d = r.int(0, R2); return `${c} ${d} ${n}\n${Array.from({ length: n }, () => (r.int(0, 3) === 0 ? c + (r.int(0, 1) ? d : -d) : r.int(-R2, R2))).map((x) => Math.max(-R2, Math.min(R2, x))).join(' ')}`; })],
            check: (inp) => { const t = toks(inp), n = Number(t[2]); return n >= 1 && n <= 5000 && t.length === n + 3 && wZakresie([t[0], ...t.slice(3)], -MLD, MLD) && wZakresie([t[1]], 0, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), c = t[0], d = t[1], v = t.slice(3); const tak = v.filter((x) => Math.abs(x - c) <= d).length; return `${tak} ${v.length - tak}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long c, d;
    int n;
    cin >> c >> d >> n;
    int tak = 0, nie = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (abs(x - c) <= d) tak++;
        else nie++;
    }
    cout << tak << " " << nie << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-zgadywanka-imiona', krok: 4, level: 'srednie',
            title: 'Zgadywanka z imionami',
            short: 'Kto zgadł najbliżej sekretu? Wypisz imię — przy remisie wygrywa ten, kto zgadywał wcześniej.',
            tags: ['abs(x - s)', 'string w rekordzie', 'remis: wcześniejszy'],
            statement: ['Sekretna liczba to s. Kolejno zgadywało n osób — każda podała swoje imię i liczbę. Wygrywa osoba, której liczba leży najbliżej sekretu; jeśli kilka osób jest tak samo blisko, wygrywa ta, która zgadywała najwcześniej.', 'Wypisz imię zwycięzcy i jego odległość od sekretu.'],
            input_format: ['W pierwszym wierszu liczby s i n.', 'W każdym z następnych n wierszy imię (słowo z liter) i liczba całkowita.'],
            output_format: ['Jeden wiersz: imię zwycięzcy, spacja i odległość.'],
            constraints: ['1 ≤ n ≤ 1000', '|s|, |każda liczba| ≤ 10⁹', 'imię ma od 1 do 20 liter'],
            examples: [{ input: '50 4\nAla 47\nBartek 55\nCela 53\nDarek 40', note: 'Odległości: 3, 5, 3, 10. Ala i Cela są tak samo blisko, ale Ala zgadywała wcześniej.' }],
            hint: R`Trzymaj dwie zmienne: string najImie i long long najD (na start: dane pierwszej osoby). Dla każdej kolejnej osoby policz d = abs(x - s) i podmień oba pola tylko wtedy, gdy d < najD — wtedy przy remisie zostaje wcześniejsza osoba.`,
            tests: (r) => {
                const gen = (n, R2) => { const s = r.int(-R2, R2); const v = zRemisami(r, n, s, R2); return `${s} ${n}\n${v.map((x) => `${r.pick(IMIONA)} ${x}`).join('\n')}`; };
                return ['7 1\nZosia 7', `0 2\nAdam ${MLD}\nEwa ${-MLD}`, '10 3\nOla 12\nIgor 8\nKuba 10', gen(10, 20), gen(300, MLD), gen(1000, MLD), gen(50, 5)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[1]); if (!(n >= 1 && n <= 1000 && t.length === 2 * n + 2)) return 'n'; for (let i = 0; i < n; i++) if (!/^[A-Za-z]{1,20}$/.test(t[2 + 2 * i]) || !wZakresie([t[3 + 2 * i]], -MLD, MLD)) return 'osoba'; return wZakresie([t[0]], -MLD, MLD) ? null : 's'; },
            solve: (inp) => { const t = toks(inp), s = Number(t[0]), n = Number(t[1]); let ki = 0; for (let i = 1; i < n; i++) if (Math.abs(Number(t[3 + 2 * i]) - s) < Math.abs(Number(t[3 + 2 * ki]) - s)) ki = i; return `${t[2 + 2 * ki]} ${Math.abs(Number(t[3 + 2 * ki]) - s)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long s;
    int n;
    cin >> s >> n;
    string najImie;
    long long najD = -1;
    for (int i = 0; i < n; i++) {
        string imie;
        long long x;
        cin >> imie >> x;
        long long d = abs(x - s);
        if (najD < 0 || d < najD) {
            najD = d;
            najImie = imie;
        }
    }
    cout << najImie << " " << najD << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-najblizszy-przystanek', krok: 4, level: 'srednie',
            title: 'Najbliższy przystanek',
            short: 'Dla każdej osoby: numer najbliższego przystanku przy drodze i odległość do niego.',
            tags: ['dwie pętle', 'rekord dla każdego pytania', 'remis: mniejszy numer'],
            statement: ['Przy prostej drodze stoi m przystanków autobusowych, ponumerowanych od 1, w podanych punktach. Na drodze czeka q osób. Dla każdej osoby wypisz w osobnym wierszu numer przystanku, który leży najbliżej niej, i odległość do niego. Jeśli dwa przystanki są tak samo blisko, wybierz ten o mniejszym numerze.'],
            input_format: ['W pierwszym wierszu liczba m, w drugim — m pozycji przystanków.', 'W trzecim wierszu liczba q, w czwartym — q pozycji osób.'],
            output_format: ['q wierszy — w każdym numer przystanku i odległość.'],
            constraints: ['1 ≤ m, q ≤ 1000', '|każda pozycja| ≤ 10⁹'],
            examples: [{ input: '3\n10 4 25\n4\n7 12 0 30', note: 'Osoba w punkcie 7 ma do przystanków 1 i 2 po 3 — wybieramy przystanek 1.' }],
            hint: R`Dla każdej osoby osobno zrób rekord po wszystkich przystankach: zacznij od przystanku 1 i podmieniaj numer, gdy abs(p[j] - x) jest ściśle mniejsze. To pętla w pętli: q · m ≤ milion porównań — w sam raz.`,
            tests: (r) => {
                const gen = (m, q, R2) => `${m}\n${losowe(r, m, -R2, R2).join(' ')}\n${q}\n${losowe(r, q, -R2, R2).join(' ')}`;
                return ['1\n0\n1\n0', `2\n${-MLD} ${MLD}\n3\n0 ${MLD} ${-MLD}`, '3\n5 5 1\n2\n3 5', gen(5, 10, 20), gen(200, 300, MLD), gen(1000, 1000, MLD), gen(30, 30, 10)];
            },
            check: (inp) => { const t = toks(inp), m = Number(t[0]), q = Number(t[m + 1]); return m >= 1 && m <= 1000 && q >= 1 && q <= 1000 && t.length === m + q + 2 && wZakresie([...t.slice(1, m + 1), ...t.slice(m + 2)], -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), m = t[0], p = t.slice(1, m + 1), xs = t.slice(m + 2); return xs.map((x) => { let k = 0; p.forEach((y, j) => { if (Math.abs(y - x) < Math.abs(p[k] - x)) k = j; }); return `${k + 1} ${Math.abs(p[k] - x)}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int m;
    cin >> m;
    vector<long long> p(m);
    for (int j = 0; j < m; j++) cin >> p[j];
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        int k = 0;
        for (int j = 1; j < m; j++) {
            if (abs(p[j] - x) < abs(p[k] - x)) k = j;
        }
        cout << k + 1 << " " << abs(p[k] - x) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-sasiedzi-celu', krok: 4, level: 'srednie',
            title: 'Sąsiedzi celu',
            short: 'Najbliższa liczba z lewej strony celu, najbliższa z prawej i najbliższa w ogóle.',
            tags: ['max z warunkiem', 'min z warunkiem', 'BRAK'],
            statement: ['Wczytaj cel c i n liczb całkowitych. Wypisz w trzech wierszach:', '1) najbliższą liczbę z lewej strony celu, czyli największą liczbę ≤ c (albo BRAK, jeśli takiej nie ma),', '2) najbliższą liczbę z prawej strony celu, czyli najmniejszą liczbę ≥ c (albo BRAK),', '3) liczbę leżącą najbliżej celu w ogóle — przy remisie mniejszą.'],
            input_format: ['W pierwszym wierszu liczby c i n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Trzy wiersze, jak w treści.'],
            constraints: ['1 ≤ n ≤ 5000', '|c|, |każda liczba| ≤ 10⁹'],
            examples: [{ input: '10 5\n5 12 9 15 20', note: 'Z lewej: 9 (odległość 1), z prawej: 12 (odległość 2). Najbliżej jest 9.' }, { input: '0 3\n4 7 9', note: 'Żadna liczba nie jest ≤ 0.' }],
            hint: R`Lewy sąsiad to zwykłe max, ale tylko wśród liczb x <= c; prawy — min wśród liczb x >= c. Zapamiętuj w osobnych zmiennych, czy już jakąś znalazłeś (bool). Najbliższa w ogóle to zawsze jeden z dwóch sąsiadów: porównaj c - lewy z prawy - c (przy remisie wygrywa lewy, bo jest mniejszy).`,
            tests: (r) => {
                const gen = (n, R2) => { const c = r.int(-R2, R2); return `${c} ${n}\n${zRemisami(r, n, c, R2).join(' ')}`; };
                return ['5 1\n5', '5 1\n3', '5 1\n8', '10 2\n8 12', `0 2\n${MLD} ${-MLD}`, '0 3\n-4 -7 -9', gen(10, 25), gen(500, MLD), gen(5000, MLD), gen(40, 8)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[1]); return n >= 1 && n <= 5000 && t.length === n + 2 && wZakresie([t[0], ...t.slice(2)], -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp).map(Number), c = t[0], v = t.slice(2);
                const lewe = v.filter((x) => x <= c), prawe = v.filter((x) => x >= c);
                const L = lewe.length ? Math.max(...lewe) : null, P = prawe.length ? Math.min(...prawe) : null;
                const naj = L === null ? P : P === null ? L : (c - L <= P - c ? L : P);
                return `${L === null ? 'BRAK' : L}\n${P === null ? 'BRAK' : P}\n${naj}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long c;
    int n;
    cin >> c >> n;
    bool jestL = false, jestP = false;
    long long L = 0, P = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (x <= c && (!jestL || x > L)) { L = x; jestL = true; }
        if (x >= c && (!jestP || x < P)) { P = x; jestP = true; }
    }
    if (jestL) cout << L << "\n"; else cout << "BRAK\n";
    if (jestP) cout << P << "\n"; else cout << "BRAK\n";
    if (!jestP) cout << L << "\n";
    else if (!jestL) cout << P << "\n";
    else if (c - L <= P - c) cout << L << "\n";
    else cout << P << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-suma-najblizej-zera', krok: 4, level: 'srednie',
            title: 'Para o sumie najbliżej zera',
            short: 'Wybierz dwie liczby z różnych pozycji, których suma leży najbliżej zera. Sprawdź wszystkie pary.',
            tags: ['dwie pętle', 'abs(t[i] + t[j])', 'pary i < j'],
            statement: ['Wczytaj n liczb całkowitych. Wybierz dwie liczby stojące na różnych pozycjach tak, żeby ich suma leżała jak najbliżej zera, i wypisz moduł tej sumy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — najmniejszy możliwy moduł sumy dwóch liczb.'],
            constraints: ['2 ≤ n ≤ 1000', '|każda liczba| ≤ 10⁹'],
            examples: [{ input: '5\n-8 3 5 -2 9', note: 'Najlepsze są pary −8 + 9 = 1 i 3 + (−2) = 1.' }, { input: '3\n4 6 10', note: 'Wszystkie liczby są dodatnie — najmniejsza suma to 4 + 6.' }],
            hint: R`Sprawdź każdą parę (i, j) z i < j — dwie pętle — i zapamiętuj najmniejsze abs(t[i] + t[j]). Zacznij od prawdziwej pary, na przykład abs(t[0] + t[1]), a nie od zera. Suma dwóch liczb może mieć 2 miliardy — to jeszcze mieści się w int, ale long long jest bezpieczniejszy.`,
            tests: (r) => ['2\n5 -5', '2\n1000000000 1000000000', '2\n-1000000000 -1000000000', '4\n1 1 1 1', '3\n-7 2 4',
                ...[[10, 30], [300, MLD], [1000, MLD], [1000, 1000]].map(([n, R2]) => `${n}\n${losowe(r, n, -R2, R2).join(' ')}`), `500\n${losowe(r, 500, 1, MLD).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 2 && n <= 1000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = toks(inp).slice(1).map(Number); let best = Infinity; for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) best = Math.min(best, Math.abs(v[i] + v[j])); return String(best); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> t(n);
    for (int i = 0; i < n; i++) cin >> t[i];
    long long naj = abs(t[0] + t[1]);
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            naj = min(naj, abs(t[i] + t[j]));
        }
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 5 · skoki między sąsiadami
        {
            id: 'abs-trasa-windy', krok: 5, level: 'latwe',
            title: 'Trasa windy',
            short: 'Winda rusza z parteru i zatrzymuje się na n przystankach. Ile pięter przejechała?',
            tags: ['abs(p[i] - p[i - 1])', 'suma skoków', 'start z parteru'],
            statement: ['Winda rusza z parteru (poziom 0) i kolejno zatrzymuje się na n podanych poziomach (poziomy ujemne to garaże). Ile pięter przejechała w sumie?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — kolejne przystanki.'],
            output_format: ['Jedna liczba — łączna liczba przejechanych pięter.'],
            constraints: ['1 ≤ n ≤ 10 000', '−50 ≤ każdy poziom ≤ 300'],
            examples: [{ input: '4\n5 2 -1 7', note: '0 → 5 → 2 → −1 → 7: 5 + 3 + 3 + 8 = 19 pięter.' }],
            hint: R`Trzymaj zmienną poprzednia = 0 (parter). Dla każdego przystanku x dodaj do sumy abs(x - poprzednia), a potem ustaw poprzednia = x. Uwaga: parteru nie ma na wejściu — pierwszy skok prowadzi z 0 do pierwszego przystanku.`,
            tests: (r) => ['1\n0', '1\n-50', '2\n300 -50', '5\n7 7 7 7 7', `10000\n${Array.from({ length: 10000 }, (_, i) => (i % 2 ? -50 : 300)).join(' ')}`,
                ...[20, 1000, 10000].map((n) => `${n}\n${losowe(r, n, -50, 300).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 10000 && t.length === n + 1 && wZakresie(t.slice(1), -50, 300) ? null : 'zakres'; },
            solve: (inp) => { const v = toks(inp).slice(1).map(Number); let p = 0, s = 0; for (const x of v) { s += Math.abs(x - p); p = x; } return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int poprzednia = 0;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        suma += abs(x - poprzednia);
        poprzednia = x;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-najwiekszy-skok', krok: 5, level: 'latwe',
            title: 'Największy skok',
            short: 'Największa różnica między sąsiednimi pomiarami i numer pomiaru, do którego nastąpił skok.',
            tags: ['skoki sąsiadów', 'rekord', 'remis: najwcześniejszy'],
            statement: ['Wczytaj n pomiarów wysokości. Skok to różnica (bez znaku) między dwoma sąsiednimi pomiarami. Wypisz największy skok oraz numer pomiaru, do którego ten skok nastąpił — pomiary numerujemy od 1, więc pierwszy skok prowadzi do pomiaru nr 2. Jeśli największy skok wystąpił kilka razy, podaj najwcześniejszy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — kolejne pomiary.'],
            output_format: ['Dwie liczby w jednym wierszu: największy skok i numer pomiaru.'],
            constraints: ['2 ≤ n ≤ 5000', '|każdy pomiar| ≤ 10⁹'],
            examples: [{ input: '6\n120 150 90 95 160 140', note: 'Skoki: 30, 60, 5, 65, 20. Największy (65) prowadzi do pomiaru nr 5.' }],
            hint: R`Pętla od i = 1: skok do pomiaru i to abs(h[i] - h[i - 1]). Zapamiętuj największy skok i jego i; podmieniaj tylko przy skoku ściśle większym. Przy numeracji od 1 pomiar o indeksie i ma numer i + 1. Skok może mieć 2 miliardy — mieści się w int, ale long long jest bezpieczniejszy.`,
            tests: (r) => ['2\n5 5', `2\n${MLD} ${-MLD}`, '4\n1 4 1 4', '5\n10 7 4 1 -2', `3\n${-MLD} ${MLD} ${-MLD}`,
                ...[[20, 50], [800, MLD], [5000, MLD]].map(([n, R2]) => `${n}\n${losowe(r, n, -R2, R2).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 2 && n <= 5000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = toks(inp).slice(1).map(Number); let k = 1; for (let i = 2; i < v.length; i++) if (Math.abs(v[i] - v[i - 1]) > Math.abs(v[k] - v[k - 1])) k = i; return `${Math.abs(v[k] - v[k - 1])} ${k + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    int naj = 1;
    for (int i = 2; i < n; i++) {
        if (abs(h[i] - h[i - 1]) > abs(h[naj] - h[naj - 1])) naj = i;
    }
    cout << abs(h[naj] - h[naj - 1]) << " " << naj + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-gladki-ciag', krok: 5, level: 'latwe',
            title: 'Gładki ciąg',
            short: 'Czy każdy skok między sąsiadami jest nie większy niż k? Jeśli nie — gdzie jest pierwszy za duży?',
            tags: ['abs(a[i] - a[i - 1]) <= k', 'pierwsze złe miejsce', 'break'],
            statement: ['Ciąg n liczb jest gładki, jeśli każde dwie sąsiednie liczby różnią się co najwyżej o k.', 'Wypisz TAK, jeśli ciąg jest gładki. W przeciwnym razie wypisz NIE, a w drugim wierszu numer pierwszej liczby (licząc od 1), która różni się od swojej poprzedniczki o więcej niż k.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['TAK albo NIE i w drugim wierszu numer liczby.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ k ≤ 10⁹', '|każda liczba| ≤ 10⁹'],
            examples: [{ input: '5 3\n1 3 6 4 8', note: 'Skoki: 2, 3, 2, 4. Pierwszy skok większy od 3 prowadzi do piątej liczby.' }, { input: '3 0\n7 7 7' }],
            hint: R`Idź po sąsiadach od i = 1 i przy pierwszym abs(a[i] - a[i - 1]) > k wypisz NIE i numer i + 1, a potem zakończ (return 0 albo break z flagą). Jeśli pętla przejdzie do końca bez wypisania — ciąg jest gładki.`,
            tests: (r) => {
                const gladki = (n, k, start) => { const v = [start]; for (let i = 1; i < n; i++) v.push(Math.max(-MLD, Math.min(MLD, v[i - 1] + r.int(-k, k)))); return v; };
                const out = ['1 0\n5', '2 0\n5 6', `2 ${MLD}\n${MLD} ${-MLD}`, `2 ${MLD}\n${MLD} 0`, '4 1\n1 2 1 2'];
                for (const [n, k] of [[10, 3], [2000, 100], [5000, 1000], [5000, 0]]) {
                    const v = gladki(n, k, r.int(-1000, 1000));
                    out.push(`${n} ${k}\n${v.join(' ')}`);
                    const w = v.slice(); const i = r.int(1, n - 1); w[i] = w[i - 1] + k + 1; out.push(`${n} ${k}\n${w.join(' ')}`);
                }
                return out;
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 5000 && t.length === n + 2 && wZakresie([t[1]], 0, MLD) && wZakresie(t.slice(2), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), k = t[1], v = t.slice(2); for (let i = 1; i < v.length; i++) if (Math.abs(v[i] - v[i - 1]) > k) return `NIE\n${i + 1}`; return 'TAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    for (int i = 1; i < n; i++) {
        if (abs(a[i] - a[i - 1]) > k) {
            cout << "NIE\n" << i + 1 << "\n";
            return 0;
        }
    }
    cout << "TAK\n";
    return 0;
}`,
        },
        {
            id: 'abs-podejscia-zejscia', krok: 5, level: 'latwe',
            title: 'Podejścia i zejścia',
            short: 'Szlak w górach: suma podejść, suma zejść i suma wszystkich zmian wysokości.',
            tags: ['różnica ze znakiem', 'suma modułów', 'dwa liczniki'],
            statement: ['Na szlaku górskim zmierzono wysokość w n kolejnych punktach. Wypisz w jednym wierszu trzy liczby: sumę wszystkich podejść (o ile metrów w sumie szliśmy w górę), sumę wszystkich zejść (o ile metrów w sumie szliśmy w dół) i sumę wszystkich zmian wysokości bez znaku.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — kolejne wysokości w metrach.'],
            output_format: ['Trzy liczby w jednym wierszu.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ każda wysokość ≤ 9000'],
            examples: [{ input: '5\n300 450 400 600 550', note: 'Podejścia: 150 + 200 = 350. Zejścia: 50 + 50 = 100. Wszystkie zmiany: 450.' }],
            hint: R`Policz różnicę ze znakiem d = h[i] - h[i - 1]. Jeśli d > 0, dodaj ją do podejść, a jeśli d < 0 — dodaj -d do zejść. Do trzeciej sumy dodawaj abs(d). Sprawdź na przykładzie, że trzecia liczba to zawsze suma dwóch pierwszych.`,
            tests: (r) => ['1\n500', '2\n0 9000', '2\n9000 0', '4\n100 100 100 100', `10000\n${Array.from({ length: 10000 }, (_, i) => (i % 2 ? 0 : 9000)).join(' ')}`,
                ...[15, 2000, 10000].map((n) => `${n}\n${losowe(r, n, 0, 9000).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 10000 && t.length === n + 1 && wZakresie(t.slice(1), 0, 9000) ? null : 'zakres'; },
            solve: (inp) => { const v = toks(inp).slice(1).map(Number); let g = 0, d = 0; for (let i = 1; i < v.length; i++) { const x = v[i] - v[i - 1]; if (x > 0) g += x; else d -= x; } return `${g} ${d} ${g + d}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    long long gora = 0, dol = 0, razem = 0;
    for (int i = 1; i < n; i++) {
        int d = h[i] - h[i - 1];
        if (d > 0) gora += d;
        else dol += -d;
        razem += abs(d);
    }
    cout << gora << " " << dol << " " << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-jeden-palec', krok: 5, level: 'latwe',
            title: 'Pisanie jednym palcem',
            short: 'Klawiatura z literami a–z w jednym rzędzie. Ile przesunięć palca, żeby napisać słowo?',
            tags: ['abs(z - palec)', 'string', 'start na a'],
            statement: ['Klawiatura ma wszystkie 26 małych liter w jednym rzędzie, w kolejności alfabetycznej. Palec zaczyna na literze a. Przesunięcie palca o jedno pole w lewo albo w prawo to jeden ruch, a naciśnięcie klawisza nic nie kosztuje.', 'Ile ruchów potrzeba, żeby napisać podane słowo?'],
            input_format: ['Jedno słowo z małych liter.'],
            output_format: ['Jedna liczba — liczba ruchów.'],
            constraints: ['słowo ma od 1 do 50 000 liter'],
            examples: [{ input: 'kot', note: 'a → k: 10, k → o: 4, o → t: 5. Razem 19.' }, { input: 'aaa' }],
            hint: R`Zmienna char palec = 'a'. Dla każdej litery z słowa dodaj abs(z - palec) i przesuń palec: palec = z. Litery to kody, więc odejmowanie liter daje ich odległość w alfabecie.`,
            tests: (r) => ['a', 'z', 'za', 'azazaz', 'abcdefghijklmnopqrstuvwxyz', 'zyxwvutsrqponmlkjihgfedcba', r.word(50), r.word(5000), r.word(50000), 'az'.repeat(25000)],
            check: (inp) => (/^[a-z]{1,50000}$/.test(inp) ? null : 'slowo'),
            solve: (inp) => { let p = 97, s = 0; for (const ch of inp) { s += Math.abs(ch.charCodeAt(0) - p); p = ch.charCodeAt(0); } return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    char palec = 'a';
    long long ruchy = 0;
    for (char z : s) {
        ruchy += abs(z - palec);
        palec = z;
    }
    cout << ruchy << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-listonosz', krok: 5, level: 'srednie',
            title: 'Listonosz',
            short: 'Trasa listonosza z poczty przez kolejne domy i z powrotem. A gdyby mógł wybrać kolejność?',
            tags: ['suma skoków', 'start i powrót do 0', 'long long'],
            statement: ['Poczta stoi w punkcie 0 prostej ulicy. Listonosz wychodzi z poczty, odwiedza n domów dokładnie w podanej kolejności i wraca na pocztę.', 'W pierwszym wierszu wypisz długość jego trasy. W drugim wypisz długość najkrótszej możliwej trasy, gdyby listonosz mógł odwiedzić te same domy w dowolnej kolejności (dalej zaczynając i kończąc na poczcie).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — pozycje domów w kolejności odwiedzania.'],
            output_format: ['Dwa wiersze — dwie długości tras.'],
            constraints: ['1 ≤ n ≤ 5000', '|każda pozycja| ≤ 10⁹'],
            examples: [{ input: '3\n5 -2 3', note: '0 → 5 → −2 → 3 → 0: 5 + 7 + 5 + 3 = 20. Najkrócej: najpierw wszystkie domy po prawej (do 5 i z powrotem), potem po lewej (do −2 i z powrotem): 10 + 4 = 14.' }],
            hint: R`Pierwsza trasa: suma skoków abs(x - poprzednia), zaczynając od poprzednia = 0, i na koniec jeszcze abs(ostatnia - 0). Druga: listonosz i tak musi dojść do najdalszego domu po prawej i po lewej stronie poczty — najkrócej jest pójść najpierw w jedną stronę do końca, wrócić i pójść w drugą. To 2 · (prawy koniec) + 2 · (lewy koniec), gdzie końce liczymy od poczty (jeśli z którejś strony nie ma domów, ta część to 0). Sumy trzymaj w long long.`,
            tests: (r) => ['1\n0', '1\n7', '1\n-7', '2\n5 5', `2\n${MLD} ${-MLD}`, `5000\n${Array.from({ length: 5000 }, (_, i) => (i % 2 ? MLD : -MLD)).join(' ')}`,
                ...[[10, 20], [700, MLD], [5000, MLD]].map(([n, R2]) => `${n}\n${losowe(r, n, -R2, R2).join(' ')}`), `100\n${losowe(r, 100, 1, 1000).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 5000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = toks(inp).slice(1).map(Number); let p = 0, s = 0; for (const x of v) { s += Math.abs(x - p); p = x; } s += Math.abs(p); const mx = Math.max(0, ...v), mn = Math.min(0, ...v); return `${s}\n${2 * mx - 2 * mn}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long poprzednia = 0, trasa = 0, prawo = 0, lewo = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        trasa += abs(x - poprzednia);
        poprzednia = x;
        prawo = max(prawo, x);
        lewo = min(lewo, x);
    }
    trasa += abs(poprzednia);
    cout << trasa << "\n" << 2 * prawo - 2 * lewo << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-najmniejsza-roznica', krok: 5, level: 'srednie',
            title: 'Najmniejsza różnica i ile razy',
            short: 'Posortuj i patrz na sąsiadów: najmniejsza różnica dwóch liczb i liczba par, które ją mają.',
            tags: ['sort', 'sąsiedzi po sortowaniu', 'liczenie par'],
            statement: ['Wczytaj n różnych liczb całkowitych. Znajdź najmniejszą różnicę między dwiema z nich i policz, ile par liczb ma dokładnie taką różnicę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych liczb całkowitych.'],
            output_format: ['Dwie liczby w jednym wierszu: najmniejsza różnica i liczba par.'],
            constraints: ['2 ≤ n ≤ 10 000', 'liczby są różne', '|każda liczba| ≤ 10⁶'],
            examples: [{ input: '5\n14 3 9 20 11', note: 'Po posortowaniu: 3, 9, 11, 14, 20. Różnice sąsiadów: 6, 2, 3, 6 — najmniejsza 2, raz.' }, { input: '4\n10 1 7 4', note: 'Różnice sąsiadów po posortowaniu: 3, 3, 3.' }],
            hint: R`Po sort najbliższa para zawsze stoi obok siebie. Co więcej, gdy liczby są różne, żadna para „przez kogoś” nie może mieć najmniejszej różnicy (jest sumą co najmniej dwóch dodatnich różnic). Wystarczy więc przejść po sąsiadach: znaleźć najmniejsze v[i] - v[i - 1] i policzyć, ile razy wystąpiło.`,
            tests: (r) => {
                const rozne = (n, R2) => { const s = new Set(); while (s.size < n) s.add(r.int(-R2, R2)); return r.shuffle([...s]); };
                return ['2\n5 -5', '2\n1000000 -1000000', '5\n1 2 3 4 5', '6\n0 10 20 30 40 50',
                    ...[[10, 40], [1000, 1000000], [10000, 1000000], [3000, 5000], [10000, 12000]].map(([n, R2]) => `${n}\n${rozne(n, R2).join(' ')}`)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 2 && n <= 10000 && t.length === n + 1 && wZakresie(t.slice(1), -1000000, 1000000) && new Set(t.slice(1)).size === n ? null : 'zakres'; },
            solve: (inp) => { const v = toks(inp).slice(1).map(Number).sort((a, b) => a - b); let m = Infinity, c = 0; for (let i = 1; i < v.length; i++) { const d = v[i] - v[i - 1]; if (d < m) { m = d; c = 1; } else if (d === m) c++; } return `${m} ${c}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    sort(v.begin(), v.end());
    int naj = v[1] - v[0], ile = 0;
    for (int i = 1; i < n; i++) {
        int d = v[i] - v[i - 1];
        if (d < naj) {
            naj = d;
            ile = 1;
        } else if (d == naj) {
            ile++;
        }
    }
    cout << naj << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-wstrzasy', krok: 5, level: 'srednie',
            title: 'Wstrząsy',
            short: 'Sejsmograf: ile było wstrząsów (skoków większych od k) i jak długi był najdłuższy spokojny fragment?',
            tags: ['skoki sąsiadów', 'seria', 'liczenie'],
            statement: ['Sejsmograf zapisał n kolejnych odczytów. Wstrząs to skok między dwoma sąsiednimi odczytami większy niż k. Spokojny fragment to kilka kolejnych odczytów, między którymi nie ma żadnego wstrząsu (pojedynczy odczyt też jest spokojnym fragmentem).', 'Wypisz w pierwszym wierszu liczbę wstrząsów, a w drugim — długość (liczbę odczytów) najdłuższego spokojnego fragmentu.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych — kolejne odczyty.'],
            output_format: ['Dwa wiersze: liczba wstrząsów i długość najdłuższego spokojnego fragmentu.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ k ≤ 1000', '|każdy odczyt| ≤ 1000'],
            examples: [{ input: '7 2\n0 1 5 6 6 2 3', note: 'Skoki: 1, 4, 1, 0, 4, 1. Wstrząsy (większe od 2) są dwa. Najdłuższy spokojny fragment to 5 6 6 — trzy odczyty.' }],
            hint: R`To seria z lekcji o max i min. Trzymaj długość bieżącego spokojnego fragmentu (na start 1). Dla każdego i od 1: jeśli abs(a[i] - a[i - 1]) > k, to wstrząs — zwiększ licznik i zacznij nowy fragment od 1; w przeciwnym razie przedłuż fragment o 1. Po każdym kroku aktualizuj najdłuższy.`,
            tests: (r) => ['1 0\n5', '2 0\n5 5', '2 0\n5 6', '5 1000\n-1000 1000 -1000 1000 0', '6 0\n1 1 1 2 2 2',
                ...[[20, 2, 5], [3000, 10, 30], [10000, 50, 150], [10000, 0, 2]].map(([n, k, R2]) => { const v = [0]; for (let i = 1; i < n; i++) v.push(Math.max(-1000, Math.min(1000, v[i - 1] + r.int(-R2, R2)))); return `${n} ${k}\n${v.join(' ')}`; })],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 10000 && t.length === n + 2 && wZakresie([t[1]], 0, 1000) && wZakresie(t.slice(2), -1000, 1000) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), k = t[1], v = t.slice(2); let w = 0, cur = 1, best = 1; for (let i = 1; i < v.length; i++) { if (Math.abs(v[i] - v[i - 1]) > k) { w++; cur = 1; } else cur++; best = Math.max(best, cur); } return `${w}\n${best}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    int wstrzasy = 0, teraz = 1, najdluzszy = 1;
    for (int i = 1; i < n; i++) {
        if (abs(a[i] - a[i - 1]) > k) {
            wstrzasy++;
            teraz = 1;
        } else {
            teraz++;
        }
        najdluzszy = max(najdluzszy, teraz);
    }
    cout << wstrzasy << "\n" << najdluzszy << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 6 · kroki po kratce
        {
            id: 'abs-ulicami-miasta', krok: 6, level: 'latwe',
            title: 'Ulicami miasta',
            short: 'Odległość taksówkarza |x₁ − x₂| + |y₁ − y₂| dla punktów z dużymi współrzędnymi — w long long.',
            tags: ['odległość miejska', 'abs(dx) + abs(dy)', 'long long'],
            statement: ['W mieście ulice tworzą kratkę, a skrzyżowania leżą w punktach o współrzędnych całkowitych. Taksówka jeździ tylko ulicami — w poziomie i w pionie. Dla każdej z t par skrzyżowań wypisz w osobnym wierszu długość najkrótszej trasy taksówki między nimi.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy cztery liczby: x₁ y₁ x₂ y₂.'],
            output_format: ['t wierszy — długości tras.'],
            constraints: ['1 ≤ t ≤ 1000', '|każda współrzędna| ≤ 10⁹'],
            examples: [{ input: '2\n0 0 5 3\n-1 4 2 -2', note: 'W drugim zapytaniu: |−1 − 2| + |4 − (−2)| = 3 + 6 = 9.' }],
            hint: R`Odległość miejska to abs(x1 - x2) + abs(y1 - y2). Każda z dwóch części może mieć 2 miliardy, a suma — 4 miliardy, więc licz w long long (najprościej: wczytuj współrzędne do long long).`,
            tests: (r) => [`1\n${-MLD} ${-MLD} ${MLD} ${MLD}`, `1\n${MLD} ${-MLD} ${-MLD} ${MLD}`, '2\n0 0 0 0\n3 3 3 3', '1\n-5 2 -5 9',
                ...[10, 300, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => losowe(r, 4, -MLD, MLD).join(' ')).join('\n')}`), `20\n${Array.from({ length: 20 }, () => losowe(r, 4, -10, 10).join(' ')).join('\n')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 4 * n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const [a, b, c, d] = t.slice(1 + 4 * i, 5 + 4 * i); out.push(Math.abs(a - c) + Math.abs(b - d)); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        cout << abs(x1 - x2) + abs(y1 - y2) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-krol-kontra-taksowka', krok: 6, level: 'latwe',
            title: 'Król kontra taksówka',
            short: 'Ile ruchów potrzebuje król, a ile taksówka (tylko pion i poziom)? Policz obie odległości.',
            tags: ['max(|dx|, |dy|)', '|dx| + |dy|', 'porównanie'],
            statement: ['Na nieskończonej kratce są dwa pola. Król w jednym ruchu przechodzi na dowolne z ośmiu sąsiednich pól (także na ukos), a taksówka — tylko na jedno z czterech pól obok (w pionie albo w poziomie).', 'Dla każdej z t par pól wypisz w osobnym wierszu dwie liczby: najmniejszą liczbę ruchów króla i najmniejszą liczbę ruchów taksówki.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy cztery liczby: x₁ y₁ x₂ y₂.'],
            output_format: ['t wierszy — w każdym liczba ruchów króla i liczba ruchów taksówki.'],
            constraints: ['1 ≤ t ≤ 1000', '|każda współrzędna| ≤ 10⁶'],
            examples: [{ input: '2\n0 0 5 3\n2 2 2 2', note: 'Król: 3 ruchy na ukos i 2 w bok — razem 5. Taksówka: 5 + 3 = 8.' }],
            hint: R`Policz dx = abs(x1 - x2) i dy = abs(y1 - y2). Taksówka potrzebuje dx + dy ruchów. Król każdym ruchem na ukos zmniejsza obie różnice naraz, więc potrzebuje tyle ruchów, ile wynosi większa z nich: max(dx, dy).`,
            tests: (r) => ['1\n0 0 0 0', '1\n0 0 1 1', '1\n-1000000 -1000000 1000000 1000000', '1\n-1000000 0 1000000 0', '3\n1 1 4 2\n4 2 1 1\n7 -3 7 3',
                ...[15, 400, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => losowe(r, 4, -1000000, 1000000).join(' ')).join('\n')}`), `30\n${Array.from({ length: 30 }, () => losowe(r, 4, -6, 6).join(' ')).join('\n')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 4 * n + 1 && wZakresie(t.slice(1), -1000000, 1000000) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const [a, b, c, d] = t.slice(1 + 4 * i, 5 + 4 * i); const dx = Math.abs(a - c), dy = Math.abs(b - d); out.push(`${Math.max(dx, dy)} ${dx + dy}`); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        int dx = abs(x1 - x2), dy = abs(y1 - y2);
        cout << max(dx, dy) << " " << dx + dy << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-wieza-goniec-hetman', krok: 6, level: 'srednie',
            title: 'Wieża, goniec, hetman',
            short: 'Pola w notacji szachowej (np. c1 h6): czy wieża, goniec i hetman dojdą jednym ruchem?',
            tags: ['abs(a[0] - b[0])', 'dx == dy', 'notacja szachowa'],
            statement: ['Na pustej szachownicy figura stoi na polu A i ma przejść na inne pole B jednym ruchem. Pola są zapisane w notacji szachowej: litera kolumny (od a do h) i cyfra wiersza (od 1 do 8).', 'Wieża porusza się po wierszu albo po kolumnie, goniec — po przekątnej, a hetman — jak wieża albo jak goniec, o dowolną liczbę pól. Dla każdej z t par pól wypisz w osobnym wierszu trzy słowa TAK albo NIE — odpowiedzi dla wieży, gońca i hetmana, w tej kolejności.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwa różne pola, na przykład c1 h6.'],
            output_format: ['t wierszy — w każdym trzy słowa TAK albo NIE oddzielone spacjami.'],
            constraints: ['1 ≤ t ≤ 1000', 'pola A i B są różne'],
            examples: [{ input: '3\nc1 h6\na1 a8\nb2 c4', note: 'c1 i h6 leżą na jednej przekątnej, a1 i a8 — w jednej kolumnie, a b2 i c4 to „literka L” — tam nie dojdzie żadna z tych figur.' }],
            hint: R`Wczytaj pola jako stringi a i b. Różnica kolumn to dx = abs(a[0] - b[0]) (litery mają kolejne kody), a różnica wierszy dy = abs(a[1] - b[1]) (cyfry też). Wieża: dx == 0 || dy == 0. Goniec: dx == dy. Hetman: jedno albo drugie.`,
            tests: (r) => {
                const wszystkie = [];
                for (let a = 0; a < 64; a++) for (let b = 0; b < 64; b++) if (a !== b) wszystkie.push(`${pole(a % 8, a >> 3)} ${pole(b % 8, b >> 3)}`);
                const los = (n) => `${n}\n${Array.from({ length: n }, () => r.pick(wszystkie)).join('\n')}`;
                return ['1\na1 h8', '1\nh1 a8', '1\nd4 d5', '1\nd4 e6', '4\na1 b1\nb1 a1\ne5 e1\nc3 f6', los(20), los(500), los(1000)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); if (!(n >= 1 && n <= 1000 && t.length === 2 * n + 1)) return 'n'; for (let i = 0; i < n; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; if (!/^[a-h][1-8]$/.test(a) || !/^[a-h][1-8]$/.test(b) || a === b) return 'pola'; } return null; },
            solve: (inp) => { const t = toks(inp), out = []; for (let i = 0; i < Number(t[0]); i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; const dx = Math.abs(a.charCodeAt(0) - b.charCodeAt(0)), dy = Math.abs(a.charCodeAt(1) - b.charCodeAt(1)); const w = dx === 0 || dy === 0, g = dx === dy; out.push([w, g, w || g].map((x) => (x ? 'TAK' : 'NIE')).join(' ')); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        string a, b;
        cin >> a >> b;
        int dx = abs(a[0] - b[0]);
        int dy = abs(a[1] - b[1]);
        bool wieza = (dx == 0 || dy == 0);
        bool goniec = (dx == dy);
        cout << (wieza ? "TAK" : "NIE") << " " << (goniec ? "TAK" : "NIE") << " " << (wieza || goniec ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-ruchy-skoczka', krok: 6, level: 'latwe',
            title: 'Ile ruchów ma skoczek?',
            short: 'Na ile pól szachownicy skoczek może przejść z danego pola jednym ruchem? Sprawdź wszystkie 64.',
            tags: ['dx * dy == 2', 'pętla po planszy', 'notacja szachowa'],
            statement: ['Skoczek (konik) w jednym ruchu przechodzi o dwa pola w jednym kierunku i o jedno pole w kierunku prostopadłym — jak litera L. Na środku planszy ma osiem możliwych ruchów, ale przy brzegu mniej, bo nie może wyjść poza szachownicę.', 'Dla każdego z t pól w notacji szachowej wypisz w osobnym wierszu, na ile pól skoczek może z niego przejść jednym ruchem.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W następnych t wierszach pola szachownicy (na przykład d4).'],
            output_format: ['t wierszy — liczby możliwych ruchów.'],
            constraints: ['1 ≤ t ≤ 64'],
            examples: [{ input: '3\na1\nd4\nb1', note: 'Z narożnika a1 skoczek ma tylko 2 ruchy (b3 i c2), z d4 — wszystkie 8.' }],
            hint: R`Najprościej przejrzeć wszystkie 64 pola szachownicy: kolumny od 'a' do 'h' i wiersze od '1' do '8'. Pole jest osiągalne, gdy dx = abs(kolumna - a[0]) i dy = abs(wiersz - a[1]) spełniają dx * dy == 2 — to dokładnie literka L (1 · 2 albo 2 · 1). Policz takie pola.`,
            tests: (r) => {
                const wszystkie = [];
                for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) wszystkie.push(pole(x, y));
                return ['1\na1', '1\nh8', '1\ne5', `64\n${wszystkie.join('\n')}`, `64\n${r.shuffle(wszystkie).join('\n')}`, `10\n${Array.from({ length: 10 }, () => r.pick(wszystkie)).join('\n')}`];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 64 && t.length === n + 1 && t.slice(1).every((p) => /^[a-h][1-8]$/.test(p)) ? null : 'pola'; },
            solve: (inp) => toks(inp).slice(1).map((p) => { let c = 0; for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) if (Math.abs(x - (p.charCodeAt(0) - 97)) * Math.abs(y - (p.charCodeAt(1) - 49)) === 2) c++; return String(c); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        string p;
        cin >> p;
        int ile = 0;
        for (char kol = 'a'; kol <= 'h'; kol++) {
            for (char w = '1'; w <= '8'; w++) {
                int dx = abs(kol - p[0]), dy = abs(w - p[1]);
                if (dx * dy == 2) ile++;
            }
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-kontur-rombu', krok: 6, level: 'latwe',
            title: 'Kontur rombu',
            short: 'Narysuj sam brzeg rombu: gwiazdka tam, gdzie |i| + |j| = n, kropka wszędzie indziej.',
            tags: ['abs(i) + abs(j) == n', 'rysowanie', 'pętle od −n do n'],
            statement: ['Wczytaj n i narysuj kwadrat z 2n + 1 wierszy po 2n + 1 znaków. Wiersze i kolumny numerujemy od −n do n, więc środek ma numer 0. Na polu (i, j) postaw gwiazdkę *, jeśli |i| + |j| = n, a kropkę . w przeciwnym razie. Powstanie kontur rombu.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['2n + 1 wierszy po 2n + 1 znaków.'],
            constraints: ['0 ≤ n ≤ 40'],
            examples: [{ input: '2' }, { input: '0', note: 'Dla n = 0 kwadrat ma jedno pole, a |0| + |0| = 0 — stoi tam gwiazdka.' }],
            hint: R`Dwie pętle: for (int i = -n; i <= n; i++) i w środku for (int j = -n; j <= n; j++). Warunek gwiazdki to abs(i) + abs(j) == n. Po każdym wierszu przejdź do nowej linii. Porównaj z rombem z lekcji: tam było <=, tu jest ==.`,
            tests: () => ['1', '3', '4', '7', '10', '19', '25', '40'],
            check: (inp) => (/^\d+$/.test(inp) && Number(inp) <= 40 ? null : 'n'),
            solve: (inp) => { const n = Number(inp), w = []; for (let i = -n; i <= n; i++) { let s = ''; for (let j = -n; j <= n; j++) s += Math.abs(i) + Math.abs(j) === n ? '*' : '.'; w.push(s); } return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = -n; i <= n; i++) {
        for (int j = -n; j <= n; j++) {
            if (abs(i) + abs(j) == n) cout << '*';
            else cout << '.';
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-kwadratowe-pierscienie', krok: 6, level: 'latwe',
            title: 'Kwadratowe pierścienie',
            short: 'Na każdym polu cyfra max(|i|, |j|) — liczba ruchów króla ze środka. Wyjdą kwadratowe pierścienie.',
            tags: ['max(abs(i), abs(j))', 'rysowanie', 'odległość króla'],
            statement: ['Wczytaj n i wypisz 2n + 1 wierszy po 2n + 1 cyfr. Wiersze i kolumny numerujemy od −n do n. Na polu (i, j) wypisz cyfrę max(|i|, |j|) — tyle ruchów potrzebuje król, żeby dojść ze środka na to pole.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['2n + 1 wierszy po 2n + 1 cyfr (bez spacji).'],
            constraints: ['0 ≤ n ≤ 9'],
            examples: [{ input: '2' }],
            hint: R`Dwie pętle od -n do n, a w środku cout << max(abs(i), abs(j)); — bez spacji. Każda liczba tworzy kwadratowy pierścień: jedynki otaczają zero, dwójki — jedynki i tak dalej.`,
            tests: () => ['0', '1', '3', '4', '5', '6', '7', '8', '9'],
            check: (inp) => (/^\d$/.test(inp) ? null : 'n'),
            solve: (inp) => { const n = Number(inp), w = []; for (let i = -n; i <= n; i++) { let s = ''; for (let j = -n; j <= n; j++) s += Math.max(Math.abs(i), Math.abs(j)); w.push(s); } return w.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = -n; i <= n; i++) {
        for (int j = -n; j <= n; j++) {
            cout << max(abs(i), abs(j));
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-pola-w-zasiegu', krok: 6, level: 'srednie',
            title: 'Ile pól w zasięgu?',
            short: 'Plansza h × w. Ile pól leży co najwyżej d kroków (w pionie i poziomie) od strażnika?',
            tags: ['odległość miejska', 'dwie pętle', 'brzegi planszy'],
            statement: ['Plansza ma h wierszy i w kolumn, numerowanych od 1. Na polu (r, c) stoi strażnik, który widzi każde pole leżące od niego w odległości miejskiej co najwyżej d (odległość miejska to liczba kroków w pionie i poziomie: |i − r| + |j − c|). Ile pól planszy widzi strażnik, razem z polem, na którym stoi?'],
            input_format: ['Jeden wiersz z pięcioma liczbami: h, w, r, c, d.'],
            output_format: ['Jedna liczba — liczba widocznych pól.'],
            constraints: ['1 ≤ h, w ≤ 1000', '1 ≤ r ≤ h', '1 ≤ c ≤ w', '0 ≤ d ≤ 2000'],
            examples: [{ input: '5 5 3 3 1', note: 'Strażnik widzi swoje pole i cztery sąsiednie.' }, { input: '3 4 1 1 2', note: 'Z rogu planszy: (1,1), (1,2), (1,3), (2,1), (2,2), (3,1).' }],
            hint: R`Przejdź po wszystkich polach planszy dwiema pętlami (i od 1 do h, j od 1 do w) i policz te, dla których abs(i - r) + abs(j - c) <= d. Pól jest najwyżej milion — to szybkie. Pola poza planszą same się nie policzą, bo pętle po nich nie przechodzą.`,
            tests: (r) => ['1 1 1 1 0', '1 1 1 1 2000', '1000 1000 500 500 0', '1000 1000 1 1 2000', '1000 1000 1000 1 999', '7 3 4 2 2',
                ...Array.from({ length: 5 }, () => { const hh = r.int(1, 1000), ww = r.int(1, 1000); return `${hh} ${ww} ${r.int(1, hh)} ${r.int(1, ww)} ${r.int(0, 2000)}`; }), '20 30 10 15 6'],
            check: (inp) => { const t = toks(inp).map(Number); return t.length === 5 && t[0] >= 1 && t[0] <= 1000 && t[1] >= 1 && t[1] <= 1000 && t[2] >= 1 && t[2] <= t[0] && t[3] >= 1 && t[3] <= t[1] && t[4] >= 0 && t[4] <= 2000 ? null : 'zakres'; },
            solve: (inp) => { const [H, W, rr, c, d] = toks(inp).map(Number); let ile = 0; for (let i = 1; i <= H; i++) { const di = Math.abs(i - rr); if (di > d) continue; const zostaje = d - di; ile += Math.min(W, c + zostaje) - Math.max(1, c - zostaje) + 1; } return String(ile); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int h, w, r, c, d;
    cin >> h >> w >> r >> c >> d;
    long long ile = 0;
    for (int i = 1; i <= h; i++) {
        for (int j = 1; j <= w; j++) {
            if (abs(i - r) + abs(j - c) <= d) ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-spotkanie-na-skrzyzowaniu', krok: 6, level: 'srednie',
            title: 'Spotkanie na skrzyżowaniu',
            short: 'Dwoje przyjaciół idzie naprzeciw siebie ulicami miasta. Po ilu minutach mogą być razem?',
            tags: ['odległość miejska', 'dzielenie w górę', 'long long'],
            statement: ['Ala stoi na skrzyżowaniu (x₁, y₁), a Bartek na skrzyżowaniu (x₂, y₂) miasta o ulicach w kratkę. Co minutę każde z nich może przejść jeden odcinek ulicy do sąsiedniego skrzyżowania albo poczekać na miejscu. Chcą spotkać się na jakimś skrzyżowaniu.', 'Dla każdej z t par pozycji wypisz w osobnym wierszu, po ilu minutach najwcześniej mogą być razem.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy cztery liczby: x₁ y₁ x₂ y₂.'],
            output_format: ['t wierszy — liczby minut.'],
            constraints: ['1 ≤ t ≤ 1000', '|każda współrzędna| ≤ 10⁹'],
            examples: [{ input: '3\n0 0 4 2\n0 0 3 0\n5 5 5 5', note: 'W drugiej parze odległość to 3: po minucie są o 1 od siebie, a na jednym skrzyżowaniu mogą stanąć dopiero po 2 minutach (jedno idzie, drugie czeka).' }],
            hint: R`Policz odległość miejską d = abs(x1 - x2) + abs(y1 - y2) (w long long — może mieć 4 miliardy). Co minutę odległość między nimi maleje najwyżej o 2, więc potrzeba co najmniej połowy d, zaokrąglonej w górę. Tyle też wystarczy: idą do siebie po najkrótszej trasie. Dzielenie w górę bez ułamków: (d + 1) / 2.`,
            tests: (r) => [`1\n${-MLD} ${-MLD} ${MLD} ${MLD}`, '1\n0 0 0 1', '1\n0 0 1 1', '2\n0 0 0 0\n7 -3 7 -3', `1\n${MLD} 0 ${-MLD} 1`,
                ...[10, 400, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => losowe(r, 4, -MLD, MLD).join(' ')).join('\n')}`), `25\n${Array.from({ length: 25 }, () => losowe(r, 4, -5, 5).join(' ')).join('\n')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 4 * n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const [a, b, c, d] = t.slice(1 + 4 * i, 5 + 4 * i); const D = Math.abs(a - c) + Math.abs(b - d); out.push(Math.floor((D + 1) / 2)); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        long long d = abs(x1 - x2) + abs(y1 - y2);
        cout << (d + 1) / 2 << "\n";
    }
    return 0;
}`,
        },
    ];
};
