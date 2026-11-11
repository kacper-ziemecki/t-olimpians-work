// Wartość bezwzględna — ćwiczenia w trakcie lekcji, części 7–8: przedziały i tarcza (|x − c| ≤ r, 2r + 1 liczb,
// równania |x − a| = d i |x − a| = |x − b|, tolerancja w procentach bez double, stykające się zasięgi, okrągły stół,
// zamek szyfrowy) oraz suma odległości i mediana (sprawdzanie kandydatów, mediana, wszystkie najlepsze miejsca,
// wyrównywanie wież, zbiórka na mapie, średnia a mediana, mediana ważona).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const R = String.raw;
    const MLD = 1000000000;
    const wZakresie = (xs, lo, hi) => xs.every((x) => /^-?\d+$/.test(String(x)) && Number(x) >= lo && Number(x) <= hi);
    const losowe = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const sumaOdl = (v, p) => v.reduce((a, x) => a + Math.abs(x - p), 0);
    const posort = (v) => v.slice().sort((a, b) => a - b);
    // n pozycji: skupiska w kilku miejscach (żeby były powtórzenia) albo losowe
    const domy = (r, n, R2) => { const c = losowe(r, r.int(1, 4), -R2, R2); return Array.from({ length: n }, () => (r.int(0, 2) ? r.int(-R2, R2) : Math.max(-R2, Math.min(R2, r.pick(c) + r.int(-3, 3))))); };

    return [
        // ================================================================ KROK 7 · przedziały i tarcza
        {
            id: 'abs-kontrola-jakosci', krok: 7, level: 'latwe',
            title: 'Kontrola jakości',
            short: 'Paczki o wadze wzorzec ± tolerancja: OK, ZA LEKKA albo ZA CIEZKA dla każdej paczki.',
            tags: ['abs(x - c) <= r', 'kierunek osobno', 'koniec się liczy'],
            statement: ['Paczki z mąką powinny ważyć c gramów z tolerancją r gramów: paczka jest dobra, jeśli jej waga różni się od c co najwyżej o r. Dla każdej z n paczek wypisz w osobnym wierszu OK, jeśli jest dobra, ZA LEKKA, jeśli waży za mało, albo ZA CIEZKA, jeśli waży za dużo.'],
            input_format: ['W pierwszym wierszu liczby c, r i n.', 'W drugim wierszu n liczb — wagi paczek w gramach.'],
            output_format: ['n wierszy — OK, ZA LEKKA albo ZA CIEZKA.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ c ≤ 10⁶', '0 ≤ r ≤ 1000', '1 ≤ każda waga ≤ 2 · 10⁶'],
            examples: [{ input: '500 5 4\n497 492 506 505', note: '505 różni się od 500 dokładnie o 5 — to jeszcze w normie.' }],
            hint: R`Najpierw sprawdź, czy paczka jest w normie: abs(x - c) <= r. Jeśli nie, kierunek odczytasz ze zwykłego porównania: x < c — za lekka, w przeciwnym razie za ciężka. Uważaj na koniec przedziału: <= (a nie <).`,
            tests: (r) => {
                const gen = (n, c, rr) => `${c} ${rr} ${n}\n${Array.from({ length: n }, () => Math.max(1, Math.min(2000000, c + (r.int(0, 3) ? r.int(-2 * rr - 3, 2 * rr + 3) : r.pick([-rr - 1, -rr, rr, rr + 1]))))).join(' ')}`;
                return ['1 0 3\n1 2 1', '1000000 1000 3\n999000 998999 1001001', gen(10, 500, 5), gen(400, 250000, 300), gen(1000, 1000000, 1000), gen(30, 20, 0)];
            },
            check: (inp) => { const t = toks(inp).map(Number), n = t[2]; return n >= 1 && n <= 1000 && t.length === n + 3 && t[0] >= 1 && t[0] <= 1000000 && t[1] >= 0 && t[1] <= 1000 && t.slice(3).every((x) => Number.isInteger(x) && x >= 1 && x <= 2000000) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), c = t[0], rr = t[1]; return t.slice(3).map((x) => (Math.abs(x - c) <= rr ? 'OK' : x < c ? 'ZA LEKKA' : 'ZA CIEZKA')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int c, r, n;
    cin >> c >> r >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (abs(x - c) <= r) cout << "OK\n";
        else if (x < c) cout << "ZA LEKKA\n";
        else cout << "ZA CIEZKA\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-liczby-wokol-srodka', krok: 7, level: 'latwe',
            title: 'Liczby wokół środka',
            short: 'Wypisz, ile jest liczb całkowitych x z |x − c| ≤ r, i wszystkie te liczby rosnąco.',
            tags: ['od c − r do c + r', '2r + 1', 'pętla'],
            statement: ['Wczytaj liczby c i r. W pierwszym wierszu wypisz, ile jest liczb całkowitych x spełniających |x − c| ≤ r, a w drugim — wszystkie te liczby w kolejności rosnącej, oddzielone spacjami.'],
            input_format: ['Jeden wiersz z liczbami c i r.'],
            output_format: ['Dwa wiersze: liczba takich x i same liczby rosnąco.'],
            constraints: ['|c| ≤ 10⁹', '0 ≤ r ≤ 1000'],
            examples: [{ input: '10 3' }, { input: '-1 0', note: 'Dla r = 0 pasuje tylko sam środek.' }],
            hint: R`Warunek |x − c| ≤ r znaczy dokładnie c − r ≤ x ≤ c + r, więc wystarczy pętla od c - r do c + r. Liczb jest 2 · r + 1: r z lewej, r z prawej i sam środek.`,
            tests: (r) => ['0 0', '0 1000', `${MLD} 1000`, `${-MLD} 1000`, '-5 5', ...Array.from({ length: 5 }, () => `${r.int(-MLD, MLD)} ${r.int(0, 1000)}`)],
            check: (inp) => { const t = toks(inp).map(Number); return t.length === 2 && Math.abs(t[0]) <= MLD && t[1] >= 0 && t[1] <= 1000 ? null : 'c r'; },
            solve: (inp) => { const [c, rr] = toks(inp).map(Number); const v = []; for (let x = c - rr; x <= c + rr; x++) v.push(x); return `${2 * rr + 1}\n${v.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long c, r;
    cin >> c >> r;
    cout << 2 * r + 1 << "\n";
    for (long long x = c - r; x <= c + r; x++) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-rownanie-x-a-d', krok: 7, level: 'latwe',
            title: 'Równanie |x − a| = d',
            short: 'Liczby leżące dokładnie d od a: dwie, jedna albo żadna. Wypisz je rosnąco.',
            tags: ['a − d i a + d', 'trzy przypadki', 'rozwiązania rosnąco'],
            statement: ['Dla każdego z t zapytań dostajesz liczby całkowite a i d. Rozwiąż równanie |x − a| = d, czyli znajdź wszystkie liczby x leżące dokładnie d od a. Wypisz w osobnym wierszu liczbę rozwiązań, a po niej, w tym samym wierszu, rozwiązania w kolejności rosnącej.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby a i d.'],
            output_format: ['t wierszy — w każdym liczba rozwiązań i rozwiązania rosnąco, oddzielone spacjami.'],
            constraints: ['1 ≤ t ≤ 1000', '|a|, |d| ≤ 10⁹'],
            examples: [{ input: '3\n4 3\n-2 0\n5 -1', note: 'Pierwsze równanie: 1 i 7. Drugie: tylko −2. Trzecie: moduł nie bywa ujemny — brak rozwiązań.' }],
            hint: R`To równanie |x| = k z części 1, tylko przesunięte o a. Dla d > 0: dwa rozwiązania a - d i a + d (mniejsze pierwsze). Dla d == 0: jedno, samo a. Dla d < 0: zero rozwiązań — wypisz tylko 0.`,
            tests: (r) => [`4\n${MLD} ${MLD}\n${-MLD} ${MLD}\n${MLD} ${-MLD}\n0 0`, '3\n0 1\n0 -1\n7 0',
                ...[10, 400, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => `${r.int(-MLD, MLD)} ${r.int(0, 3) ? r.int(-MLD, MLD) : 0}`).join('\n')}`), `30\n${Array.from({ length: 30 }, () => `${r.int(-5, 5)} ${r.int(-3, 3)}`).join('\n')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const a = t[1 + 2 * i], d = t[2 + 2 * i]; out.push(d > 0 ? `2 ${a - d} ${a + d}` : d === 0 ? `1 ${a}` : '0'); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long a, d;
        cin >> a >> d;
        if (d > 0) cout << 2 << " " << a - d << " " << a + d << "\n";
        else if (d == 0) cout << 1 << " " << a << "\n";
        else cout << 0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-tak-samo-daleko', krok: 7, level: 'srednie',
            title: 'Tak samo daleko',
            short: 'Która liczba całkowita leży tak samo daleko od a i od b? Środek odcinka — o ile istnieje.',
            tags: ['(a + b) / 2', 'parzystość sumy', 'przypadek a = b'],
            statement: ['Dla każdego z t zapytań dostajesz dwie liczby całkowite a i b. Znajdź wszystkie liczby całkowite x, dla których |x − a| = |x − b|. Wypisz w osobnym wierszu tę liczbę, jeśli jest dokładnie jedna; WSZYSTKIE, jeśli pasuje każda liczba całkowita; BRAK, jeśli nie pasuje żadna.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby a i b.'],
            output_format: ['t wierszy — liczba, WSZYSTKIE albo BRAK.'],
            constraints: ['1 ≤ t ≤ 1000', '|a|, |b| ≤ 10⁹'],
            examples: [{ input: '4\n3 7\n3 8\n5 5\n-4 2', note: 'Środek odcinka od 3 do 8 to 5,5 — nie jest liczbą całkowitą.' }],
            hint: R`Liczba tak samo daleko od a i b to środek odcinka: (a + b) / 2. Jest liczbą całkowitą tylko wtedy, gdy suma a + b jest parzysta — sprawdzaj przez (a + b) % 2 == 0 (dla ujemnych nieparzystych sum reszta to −1, więc nie pisz == 1). Osobny przypadek: a == b — wtedy pasuje każda liczba. Suma może sięgać ±2 · 10⁹, więc bezpieczniej w long long.`,
            tests: (r) => [`3\n${MLD} ${MLD}\n${MLD} ${-MLD}\n${-MLD} ${-MLD + 1}`, '4\n-3 -5\n-3 -4\n0 0\n-1 1',
                ...[12, 400, 1000].map((n) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(-MLD, MLD); return `${a} ${r.int(0, 9) === 0 ? a : r.int(-MLD, MLD)}`; }).join('\n')}`), `30\n${Array.from({ length: 30 }, () => `${r.int(-6, 6)} ${r.int(-6, 6)}`).join('\n')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 1000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; out.push(a === b ? 'WSZYSTKIE' : (a + b) % 2 === 0 ? String((a + b) / 2) : 'BRAK'); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long a, b;
        cin >> a >> b;
        if (a == b) cout << "WSZYSTKIE\n";
        else if ((a + b) % 2 == 0) cout << (a + b) / 2 << "\n";
        else cout << "BRAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-tolerancja-procentowa', krok: 7, level: 'srednie',
            title: 'Tolerancja w procentach',
            short: 'Czy pomiar różni się od wzorca co najwyżej o p procent? Same liczby całkowite, bez double.',
            tags: ['abs(x - w) * 100 <= p * w', 'long long', 'bez liczb z przecinkiem'],
            statement: ['Wzorzec ma wartość w, a dopuszczalna tolerancja to p procent wzorca. Pomiar x jest dobry, jeśli różni się od w co najwyżej o p procent wartości w. Dla każdego z n pomiarów wypisz w osobnym wierszu TAK, jeśli jest dobry, albo NIE.'],
            input_format: ['W pierwszym wierszu liczby w, p i n.', 'W drugim wierszu n liczb całkowitych — pomiary.'],
            output_format: ['n wierszy — TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ w ≤ 10⁹', '0 ≤ p ≤ 100', '0 ≤ każdy pomiar ≤ 2 · 10⁹'],
            examples: [{ input: '250 4 3\n260 261 240', note: '4% z 250 to 10: pomiary od 240 do 260 są dobre.' }, { input: '333 1 2\n336 337', note: '1% z 333 to 3,33 — 336 różni się o 3 (dobrze), 337 o 4 (za dużo).' }],
            hint: R`Warunek „|x − w| ≤ p% z w” to abs(x - w) <= p * w / 100. Pomnóż obie strony przez 100, żeby uniknąć ułamków: abs(x - w) * 100 <= p * w. Iloczyny sięgają 2 · 10¹¹, więc wszystko w long long.`,
            tests: (r) => {
                const gen = (n, w, p) => { const dop = Math.floor(p * w / 100); return `${w} ${p} ${n}\n${Array.from({ length: n }, () => Math.max(0, Math.min(2 * MLD, r.int(0, 2) ? w + r.int(-2 * dop - 5, 2 * dop + 5) : w + r.pick([-dop - 1, -dop, dop, dop + 1])))).join(' ')}`; };
                return ['1 0 2\n1 2', `${MLD} 100 3\n0 ${2 * MLD} ${2 * MLD - 1}`, `${MLD} 0 2\n${MLD} ${MLD + 1}`, '333 1 4\n336 337 330 329', gen(10, 250, 4), gen(300, 987654321, 7), gen(1000, MLD, 13), gen(1000, 77, 33), gen(50, 999, 1)];
            },
            check: (inp) => { const t = toks(inp).map(Number), n = t[2]; return n >= 1 && n <= 1000 && t.length === n + 3 && t[0] >= 1 && t[0] <= MLD && t[1] >= 0 && t[1] <= 100 && t.slice(3).every((x) => Number.isInteger(x) && x >= 0 && x <= 2 * MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(BigInt), w = t[0], p = t[1]; return t.slice(3).map((x) => ((x > w ? x - w : w - x) * 100n <= p * w ? 'TAK' : 'NIE')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long w, p;
    int n;
    cin >> w >> p >> n;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (abs(x - w) * 100 <= p * w) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-dwa-nadajniki', krok: 7, level: 'srednie',
            title: 'Dwa nadajniki',
            short: 'Czy zasięgi dwóch nadajników przy drodze się stykają? Jeśli nie — jak długa jest dziura?',
            tags: ['|c1 − c2| ≤ r1 + r2', 'przedziały', 'dziura między zasięgami'],
            statement: ['Przy prostej drodze stoją dwa nadajniki. Pierwszy, w punkcie c1, obejmuje zasięgiem wszystkie punkty odległe od niego co najwyżej o r1, a drugi, w punkcie c2 — co najwyżej o r2.', 'Dla każdego z t zapytań wypisz w osobnym wierszu TAK, jeśli zasięgi stykają się albo nachodzą na siebie, albo NIE i długość dziury między nimi (odległość między końcami zasięgów).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy cztery liczby: c1, r1, c2, r2.'],
            output_format: ['t wierszy — TAK albo NIE i długość dziury.'],
            constraints: ['1 ≤ t ≤ 1000', '|c1|, |c2| ≤ 10⁹', '0 ≤ r1, r2 ≤ 10⁹'],
            examples: [{ input: '3\n4 3 12 3\n0 5 10 5\n-3 1 3 1', note: 'Pierwsze: zasięgi to 1–7 i 9–15, dziura ma długość 2. Drugie: 0–5 i 5–15 stykają się w punkcie 5.' }],
            hint: R`Zasięgi się stykają, gdy odległość środków nie przekracza sumy promieni: abs(c1 - c2) <= r1 + r2. W przeciwnym razie dziura ma długość abs(c1 - c2) - r1 - r2. Nie ma znaczenia, który nadajnik stoi bardziej na lewo — moduł to załatwia.`,
            tests: (r) => {
                const gen = (n, R2) => `${n}\n${Array.from({ length: n }, () => { const c1 = r.int(-R2, R2), c2 = r.int(-R2, R2), d = Math.abs(c1 - c2); const r1 = r.int(0, Math.min(MLD, d)); let r2 = r.int(0, Math.min(MLD, d)); if (r.int(0, 3) === 0) r2 = Math.max(0, Math.min(MLD, d - r1 + r.int(-1, 1))); return `${c1} ${r1} ${c2} ${r2}`; }).join('\n')}`;
                return [`2\n${-MLD} 0 ${MLD} 0\n${-MLD} ${MLD} ${MLD} ${MLD}`, '3\n5 0 5 0\n5 0 6 0\n0 2 3 1', gen(10, 20), gen(400, MLD), gen(1000, MLD), gen(40, 6)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); if (!(n >= 1 && n <= 1000 && t.length === 4 * n + 1)) return 'n'; for (let i = 0; i < n; i++) { const [c1, r1, c2, r2] = t.slice(1 + 4 * i, 5 + 4 * i); if (!wZakresie([c1, c2], -MLD, MLD) || !wZakresie([r1, r2], 0, MLD)) return 'zakres'; } return null; },
            solve: (inp) => { const t = toks(inp).map(Number), out = []; for (let i = 0; i < t[0]; i++) { const [c1, r1, c2, r2] = t.slice(1 + 4 * i, 5 + 4 * i); const d = Math.abs(c1 - c2); out.push(d <= r1 + r2 ? 'TAK' : `NIE ${d - r1 - r2}`); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        long long c1, r1, c2, r2;
        cin >> c1 >> r1 >> c2 >> r2;
        long long d = abs(c1 - c2);
        if (d <= r1 + r2) cout << "TAK\n";
        else cout << "NIE " << d - r1 - r2 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-okragly-stol', krok: 7, level: 'latwe',
            title: 'Okrągły stół',
            short: 'n krzeseł dookoła stołu. O ile krzeseł przesunąć się z a do b, idąc krótszą drogą?',
            tags: ['min(d, n - d)', 'odległość na tarczy', 'numery od 1'],
            statement: ['Wokół okrągłego stołu stoi n krzeseł ponumerowanych kolejno od 1 do n (krzesło n sąsiaduje z krzesłem 1). Dla każdego z t zapytań — numerów krzeseł a i b — wypisz w osobnym wierszu, o ile krzeseł trzeba się przesunąć z a do b, idąc krótszą drogą dookoła stołu.'],
            input_format: ['W pierwszym wierszu liczby n i t.', 'W każdym z następnych t wierszy dwa numery krzeseł a i b.'],
            output_format: ['t wierszy — długości krótszych dróg.'],
            constraints: ['2 ≤ n ≤ 10⁹', '1 ≤ t ≤ 1000', '1 ≤ a, b ≤ n'],
            examples: [{ input: '10 3\n1 8\n2 6\n10 1', note: 'Z 1 do 8 krócej jest „przez 10”: 1 → 10 → 9 → 8, czyli 3 krzesła.' }],
            hint: R`Z a do b prowadzą dwie drogi dookoła stołu: jedna ma d = abs(a - b) krzeseł, druga n - d (razem pełne okrążenie). Wypisz min(d, n - d). Numeracja od 1 niczego nie zmienia — liczy się tylko różnica numerów.`,
            tests: (r) => [`2 3\n1 2\n2 1\n1 1`, `${MLD} 3\n1 ${MLD}\n1 ${MLD / 2 + 1}\n${MLD} ${MLD}`, '7 4\n1 4\n1 5\n4 1\n5 1',
                ...[[12, 20], [1000, 400], [MLD, 1000], [5, 30]].map(([n, q]) => `${n} ${q}\n${Array.from({ length: q }, () => `${r.int(1, n)} ${r.int(1, n)}`).join('\n')}`)],
            check: (inp) => { const t = toks(inp).map(Number), n = t[0], q = t[1]; return n >= 2 && n <= MLD && q >= 1 && q <= 1000 && t.length === 2 * q + 2 && t.slice(2).every((x) => Number.isInteger(x) && x >= 1 && x <= n) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), n = t[0], out = []; for (let i = 0; i < t[1]; i++) { const d = Math.abs(t[2 + 2 * i] - t[3 + 2 * i]); out.push(Math.min(d, n - d)); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, t;
    cin >> n >> t;
    for (int k = 0; k < t; k++) {
        int a, b;
        cin >> a >> b;
        int d = abs(a - b);
        cout << min(d, n - d) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'abs-zamek-szyfrowy', krok: 7, level: 'srednie',
            title: 'Zamek szyfrowy',
            short: 'Kłódka z kółkami 0–9: ile najmniej obrotów, żeby z jednego kodu zrobić drugi?',
            tags: ['min(d, 10 - d)', 'string cyfr', 'suma po kółkach'],
            statement: ['Kłódka ma k kółek z cyframi od 0 do 9. Jeden obrót przesuwa jedno kółko o jedną cyfrę w górę albo w dół (po 9 jest 0, a przed 0 jest 9). Kłódka pokazuje teraz jeden kod, a otwiera ją inny. Ile najmniej obrotów potrzeba, żeby ją otworzyć?'],
            input_format: ['W pierwszym wierszu kod, który pokazuje kłódka, w drugim — kod, który ją otwiera. Oba mają po k cyfr.'],
            output_format: ['Jedna liczba — najmniejsza liczba obrotów.'],
            constraints: ['1 ≤ k ≤ 10 000', 'oba kody mają tyle samo cyfr'],
            examples: [{ input: '1000\n8009', note: '1 → 8: 3 obroty w dół (przez 0 i 9), dwa razy 0 → 0: nic, 0 → 9: 1 obrót w dół. Razem 4.' }, { input: '0000\n5555', note: 'Na każdym kółku obie drogi mają po 5 obrotów.' }],
            hint: R`Kółka obracają się niezależnie, więc liczysz każde osobno i dodajesz. Dla kółka z cyfrą a, które ma pokazać b: d = abs(a - b) (cyfry jako znaki też możesz odejmować), a krótsza droga po tarczy to min(d, 10 - d).`,
            tests: (r) => {
                const kod = (k) => Array.from({ length: k }, () => r.int(0, 9)).join('');
                return ['0\n9', '9\n0', '5\n5', '0123456789\n9876543210', `${'0'.repeat(10000)}\n${'5'.repeat(10000)}`, `${kod(8)}\n${kod(8)}`, `${kod(500)}\n${kod(500)}`, `${kod(10000)}\n${kod(10000)}`];
            },
            check: (inp) => { const t = toks(inp); return t.length === 2 && /^\d{1,10000}$/.test(t[0]) && t[0].length === t[1].length && /^\d+$/.test(t[1]) ? null : 'kody'; },
            solve: (inp) => { const [a, b] = toks(inp); let s = 0; for (let i = 0; i < a.length; i++) { const d = Math.abs(a.charCodeAt(i) - b.charCodeAt(i)); s += Math.min(d, 10 - d); } return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    long long obroty = 0;
    for (int i = 0; i < (int)a.size(); i++) {
        int d = abs(a[i] - b[i]);
        obroty += min(d, 10 - d);
    }
    cout << obroty << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · suma odległości i mediana
        {
            id: 'abs-ile-przejda-razem', krok: 8, level: 'latwe',
            title: 'Ile przejdą razem?',
            short: 'Suma odległości wszystkich domów od miejsca spotkania p — licz w long long.',
            tags: ['suma abs(x[i] - p)', 'long long', 'pętla'],
            statement: ['Przy prostej ulicy mieszka n osób, w podanych punktach. Wszystkie idą na spotkanie w punkcie p. Ile kroków przejdą razem, jeśli każdy krok to przesunięcie o 1?'],
            input_format: ['W pierwszym wierszu liczby n i p.', 'W drugim wierszu n liczb całkowitych — pozycje domów.'],
            output_format: ['Jedna liczba — łączna liczba kroków.'],
            constraints: ['1 ≤ n ≤ 5000', '|p|, |każda pozycja| ≤ 10⁹'],
            examples: [{ input: '5 6\n1 3 4 9 12', note: '5 + 3 + 2 + 3 + 6 = 19.' }],
            hint: R`Dla każdego domu dodaj do sumy abs(x - p). Jedna odległość może mieć 2 miliardy, a 5000 takich — 10¹³, więc suma koniecznie w long long (najprościej: wszystko w long long).`,
            tests: (r) => ['1 0\n0', `1 ${MLD}\n${-MLD}`, `5000 ${MLD}\n${Array(5000).fill(-MLD).join(' ')}`, '4 3\n3 3 3 3',
                ...[[10, 20], [700, MLD], [5000, MLD]].map(([n, R2]) => `${n} ${r.int(-R2, R2)}\n${domy(r, n, R2).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 5000 && t.length === n + 2 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number); return String(sumaOdl(t.slice(2), t[1])); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long p;
    cin >> n >> p;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        suma += abs(x - p);
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-najlepsza-propozycja', krok: 8, level: 'latwe',
            title: 'Najlepsza propozycja',
            short: 'Kilka propozycji miejsca zbiórki — wybierz tę z najmniejszą sumą odległości.',
            tags: ['pętla w pętli', 'suma odległości', 'rekord'],
            statement: ['Przy ulicy mieszka n osób. Zaproponowano m miejsc spotkania, ponumerowanych od 1. Dla każdej propozycji można policzyć, ile kroków przejdą wszyscy razem. Wypisz numer najlepszej propozycji (z najmniejszą sumą) i tę sumę. Przy remisie wybierz propozycję o mniejszym numerze.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n pozycji domów, w trzecim — m pozycji proponowanych miejsc.'],
            output_format: ['Dwie liczby w jednym wierszu: numer propozycji i suma kroków.'],
            constraints: ['1 ≤ n, m ≤ 1000', '|każda pozycja| ≤ 10⁹'],
            examples: [{ input: '5 3\n1 3 4 9 12\n6 3 10', note: 'Sumy: 19, 18 i 25. Najlepsza jest propozycja nr 2.' }],
            hint: R`Dla każdej propozycji policz sumę odległości wszystkich domów (pętla w pętli, najwyżej milion kroków) i zastosuj wzorzec rekordu: zmieniaj najlepszą tylko przy ściśle mniejszej sumie. Sumy trzymaj w long long.`,
            tests: (r) => {
                const gen = (n, m, R2) => `${n} ${m}\n${domy(r, n, R2).join(' ')}\n${losowe(r, m, -R2, R2).join(' ')}`;
                return ['1 1\n0\n0', '2 2\n0 10\n3 7', '3 3\n5 5 5\n4 6 5', gen(5, 4, 15), gen(300, 200, MLD), gen(1000, 1000, MLD), gen(40, 40, 10)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]), m = Number(t[1]); return n >= 1 && n <= 1000 && m >= 1 && m <= 1000 && t.length === n + m + 2 && wZakresie(t.slice(2), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), n = t[0], v = t.slice(2, 2 + n), p = t.slice(2 + n); let k = 0, best = sumaOdl(v, p[0]); p.forEach((q, j) => { const s = sumaOdl(v, q); if (s < best) { best = s; k = j; } }); return `${k + 1} ${best}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<long long> x(n);
    for (int i = 0; i < n; i++) cin >> x[i];
    int najNr = 0;
    long long najSuma = -1;
    for (int j = 1; j <= m; j++) {
        long long p;
        cin >> p;
        long long s = 0;
        for (int i = 0; i < n; i++) s += abs(x[i] - p);
        if (najSuma < 0 || s < najSuma) {
            najSuma = s;
            najNr = j;
        }
    }
    cout << najNr << " " << najSuma << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-zbiorka-przy-ulicy', krok: 8, level: 'srednie',
            title: 'Zbiórka przy ulicy',
            short: 'Gdzie się spotkać, żeby przejść razem jak najmniej? Posortuj i weź medianę.',
            tags: ['sort', 'mediana x[n / 2]', 'long long'],
            statement: ['Przy prostej ulicy mieszka n osób, w podanych punktach (kilka osób może mieszkać w tym samym punkcie). Mają się spotkać w jednym punkcie o współrzędnej całkowitej. Jaka jest najmniejsza możliwa łączna liczba kroków, które przejdą wszyscy razem?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — pozycje.'],
            output_format: ['Jedna liczba — najmniejsza łączna liczba kroków.'],
            constraints: ['1 ≤ n ≤ 8000', '|każda pozycja| ≤ 10⁹'],
            examples: [{ input: '5\n9 1 12 3 4', note: 'Najlepiej spotkać się w punkcie 4 (środkowy dom): 5 + 3 + 8 + 1 + 0 = 17.' }, { input: '4\n12 1 9 3', note: 'Każdy punkt od 3 do 9 daje sumę 17.' }],
            hint: R`Suma odległości jest najmniejsza w medianie: posortuj pozycje i weź x[n / 2]. Potem policz sumę abs(x[i] - m) — w long long, bo 8000 odległości po 2 miliardy to dużo za dużo dla int.`,
            tests: (r) => ['1\n5', '2\n-7 7', `2\n${-MLD} ${MLD}`, `8000\n${Array.from({ length: 8000 }, (_, i) => (i % 2 ? MLD : -MLD)).join(' ')}`, '6\n4 4 4 4 4 4',
                ...[[11, 30], [1000, MLD], [8000, MLD], [7999, 100]].map(([n, R2]) => `${n}\n${domy(r, n, R2).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 8000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = posort(toks(inp).slice(1).map(Number)); return String(sumaOdl(v, v[Math.floor(v.length / 2)])); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> x(n);
    for (int i = 0; i < n; i++) cin >> x[i];
    sort(x.begin(), x.end());
    long long m = x[n / 2];
    long long suma = 0;
    for (int i = 0; i < n; i++) suma += abs(x[i] - m);
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-wszystkie-najlepsze', krok: 8, level: 'srednie',
            title: 'Wszystkie najlepsze miejsca',
            short: 'Przy parzystej liczbie domów najlepszych miejsc jest wiele. Wypisz pierwsze, ostatnie i ile ich jest.',
            tags: ['mediana', 'parzyste n', 'przedział najlepszych miejsc'],
            statement: ['Przy prostej ulicy mieszka n osób, w podanych punktach. Miejsce spotkania (punkt o współrzędnej całkowitej) jest najlepsze, jeśli łączna droga wszystkich osób jest najmniejsza z możliwych.', 'Wypisz w jednym wierszu: najmniejsze najlepsze miejsce, największe najlepsze miejsce i liczbę wszystkich najlepszych miejsc.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — pozycje.'],
            output_format: ['Trzy liczby w jednym wierszu.'],
            constraints: ['1 ≤ n ≤ 8000', '|każda pozycja| ≤ 10⁹'],
            examples: [{ input: '5\n9 1 12 3 4', note: 'Przy nieparzystym n najlepsze miejsce jest jedno — mediana 4.' }, { input: '4\n12 1 9 3', note: 'Każde miejsce od 3 do 9 daje tę samą sumę 17 — razem 7 miejsc.' }],
            hint: R`Posortuj. Przy nieparzystym n najlepsze jest tylko x[n / 2]. Przy parzystym — każdy punkt od x[n / 2 - 1] do x[n / 2] (między dwiema środkowymi pozycjami), czyli x[n / 2] - x[n / 2 - 1] + 1 punktów. Ta liczba może sięgać 2 · 10⁹ + 1 — licz w long long.`,
            tests: (r) => ['1\n5', '2\n-7 7', `2\n${-MLD} ${MLD}`, '4\n3 3 3 3', '6\n1 2 3 10 11 12', '3\n5 5 9',
                ...[[10, 30], [11, 30], [1000, MLD], [8000, MLD], [7999, MLD]].map(([n, R2]) => `${n}\n${domy(r, n, R2).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 8000 && t.length === n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = posort(toks(inp).slice(1).map(Number)), n = v.length; if (n % 2) return `${v[(n - 1) / 2]} ${v[(n - 1) / 2]} 1`; const L = v[n / 2 - 1], P = v[n / 2]; return `${L} ${P} ${P - L + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> x(n);
    for (int i = 0; i < n; i++) cin >> x[i];
    sort(x.begin(), x.end());
    long long L, P;
    if (n % 2 == 1) {
        L = x[n / 2];
        P = x[n / 2];
    } else {
        L = x[n / 2 - 1];
        P = x[n / 2];
    }
    cout << L << " " << P << " " << P - L + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-rowne-wieze', krok: 8, level: 'srednie',
            title: 'Równe wieże',
            short: 'Dokładaj i zdejmuj klocki po jednym. Ile ruchów, żeby wszystkie wieże miały tę samą wysokość?',
            tags: ['mediana', 'suma |h − cel|', 'long long'],
            statement: ['Na stole stoi n wież z klocków o podanych wysokościach. W jednym ruchu można dołożyć jeden klocek na dowolną wieżę albo zdjąć jeden klocek z dowolnej wieży (wieża może zniknąć zupełnie). Ile najmniej ruchów potrzeba, żeby wszystkie wieże miały tę samą wysokość?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — wysokości wież.'],
            output_format: ['Jedna liczba — najmniejsza liczba ruchów.'],
            constraints: ['1 ≤ n ≤ 8000', '0 ≤ każda wysokość ≤ 10⁹'],
            examples: [{ input: '4\n3 8 5 1', note: 'Na przykład do wysokości 5: 2 + 3 + 0 + 4 = 9 ruchów.' }],
            hint: R`To przebrana zbiórka: docelowa wysokość p, a wieża o wysokości h potrzebuje abs(h - p) ruchów. Najlepsza p to mediana wysokości: sortujesz i bierzesz h[n / 2]. Sumę licz w long long.`,
            tests: (r) => ['1\n0', '2\n0 1000000000', '3\n7 7 7', `8000\n${Array.from({ length: 8000 }, (_, i) => (i % 3 ? 0 : MLD)).join(' ')}`,
                ...[[9, 20], [1000, MLD], [8000, MLD], [5000, 50]].map(([n, R2]) => `${n}\n${losowe(r, n, 0, R2).join(' ')}`)],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 8000 && t.length === n + 1 && wZakresie(t.slice(1), 0, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = posort(toks(inp).slice(1).map(Number)); return String(sumaOdl(v, v[Math.floor(v.length / 2)])); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    sort(h.begin(), h.end());
    long long cel = h[n / 2];
    long long ruchy = 0;
    for (int i = 0; i < n; i++) ruchy += abs(h[i] - cel);
    cout << ruchy << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-sklep-na-osiedlu', krok: 8, level: 'srednie',
            title: 'Sklep na osiedlu',
            short: 'Domy na mapie o ulicach w kratkę. Gdzie postawić sklep? Mediana x i mediana y — osobno.',
            tags: ['odległość miejska', 'mediana osobno dla x i y', 'long long'],
            statement: ['Na osiedlu o ulicach w kratkę stoi n domów, w punktach o współrzędnych całkowitych. Trzeba postawić sklep na jakimś skrzyżowaniu (w punkcie o współrzędnych całkowitych — może nawet w miejscu domu) tak, żeby łączna odległość miejska ze wszystkich domów do sklepu była jak najmniejsza. Wypisz tę najmniejszą łączną odległość.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy dwie liczby — współrzędne x i y domu.'],
            output_format: ['Jedna liczba — najmniejsza łączna odległość.'],
            constraints: ['1 ≤ n ≤ 4000', '|każda współrzędna| ≤ 10⁹'],
            examples: [{ input: '3\n0 0\n2 5\n4 1', note: 'Sklep w (2, 1): (2 + 1) + (0 + 4) + (2 + 0) = 9.' }],
            hint: R`Odległość miejska to część pozioma plus pionowa, a każda z nich zależy tylko od jednej współrzędnej sklepu. Wybierz więc osobno: x sklepu = mediana wszystkich x, y sklepu = mediana wszystkich y (dwie osobne tablice, każda posortowana osobno). Sumę licz w long long.`,
            tests: (r) => {
                const gen = (n, R2) => `${n}\n${Array.from({ length: n }, () => `${r.int(-R2, R2)} ${r.int(-R2, R2)}`).join('\n')}`;
                return ['1\n5 -5', `2\n${-MLD} ${-MLD}\n${MLD} ${MLD}`, '4\n0 0\n0 0\n1 1\n1 1', `4000\n${Array.from({ length: 4000 }, (_, i) => (i % 2 ? `${MLD} ${-MLD}` : `${-MLD} ${MLD}`)).join('\n')}`, gen(7, 10), gen(500, MLD), gen(4000, MLD), gen(3999, 50)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 4000 && t.length === 2 * n + 1 && wZakresie(t.slice(1), -MLD, MLD) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(Number), n = t[0], xs = [], ys = []; for (let i = 0; i < n; i++) { xs.push(t[1 + 2 * i]); ys.push(t[2 + 2 * i]); } const sx = posort(xs), sy = posort(ys); return String(sumaOdl(sx, sx[Math.floor(n / 2)]) + sumaOdl(sy, sy[Math.floor(n / 2)])); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> xs(n), ys(n);
    for (int i = 0; i < n; i++) cin >> xs[i] >> ys[i];
    sort(xs.begin(), xs.end());
    sort(ys.begin(), ys.end());
    long long px = xs[n / 2], py = ys[n / 2];
    long long suma = 0;
    for (int i = 0; i < n; i++) suma += abs(xs[i] - px) + abs(ys[i] - py);
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-srednia-czy-mediana', krok: 8, level: 'latwe',
            title: 'Średnia czy mediana?',
            short: 'Łączna droga do średniej (zaokrąglonej w dół) i do mediany. Która propozycja wygrywa?',
            tags: ['średnia', 'mediana', 'porównanie'],
            statement: ['Przy prostej ulicy mieszka n osób, w punktach o współrzędnych nieujemnych. Ala proponuje spotkać się w średniej pozycji, zaokrąglonej w dół do liczby całkowitej. Bartek proponuje medianę: po posortowaniu pozycji element o indeksie n / 2 (licząc od 0, dzielenie całkowite).', 'Wypisz w pierwszym wierszu łączną drogę wszystkich osób do miejsca Ali, a w drugim — do miejsca Bartka.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — pozycje.'],
            output_format: ['Dwa wiersze: łączna droga do średniej i do mediany.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ każda pozycja ≤ 10⁹'],
            examples: [{ input: '3\n10 20 100', note: 'Średnia: 130 / 3 = 43 (w dół). Droga: 33 + 23 + 57 = 113. Mediana 20: 10 + 0 + 80 = 90.' }],
            hint: R`Średnia to suma pozycji podzielona przez n — suma może mieć 5 · 10¹², więc long long; dzielenie całkowite liczb nieujemnych zaokrągla w dół. Mediana: posortuj i weź x[n / 2]. Potem dwie sumy odległości. Zobaczysz, że mediana nigdy nie przegrywa.`,
            tests: (r) => ['1\n7', '2\n0 1000000000', '3\n0 0 9', '4\n1 2 3 1000000000',
                ...[[10, 100], [800, MLD], [5000, MLD], [4999, 1000]].map(([n, R2]) => `${n}\n${losowe(r, n, 0, R2).join(' ')}`), `100\n${Array.from({ length: 100 }, (_, i) => (i < 95 ? r.int(0, 10) : r.int(900000000, MLD))).join(' ')}`],
            check: (inp) => { const t = toks(inp), n = Number(t[0]); return n >= 1 && n <= 5000 && t.length === n + 1 && wZakresie(t.slice(1), 0, MLD) ? null : 'zakres'; },
            solve: (inp) => { const v = posort(toks(inp).slice(1).map(Number)); const sr = Math.floor(v.reduce((a, x) => a + x, 0) / v.length); return `${sumaOdl(v, sr)}\n${sumaOdl(v, v[Math.floor(v.length / 2)])}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> x(n);
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        cin >> x[i];
        suma += x[i];
    }
    long long sr = suma / n;
    sort(x.begin(), x.end());
    long long med = x[n / 2];
    long long doSr = 0, doMed = 0;
    for (int i = 0; i < n; i++) {
        doSr += abs(x[i] - sr);
        doMed += abs(x[i] - med);
    }
    cout << doSr << "\n" << doMed << "\n";
    return 0;
}`,
        },
        {
            id: 'abs-przystanek-dla-wiosek', krok: 8, level: 'srednie',
            title: 'Przystanek dla wiosek',
            short: 'Wioski z różną liczbą mieszkańców. Gdzie postawić przystanek? Liczy się każdy mieszkaniec osobno.',
            tags: ['mediana ważona', 'sortowanie par', 'long long'],
            statement: ['Wzdłuż prostej drogi leży n wiosek. Wioska numer i leży w punkcie xᵢ i mieszka w niej lᵢ osób. Trzeba postawić jeden przystanek w punkcie p o współrzędnej całkowitej. Każdy mieszkaniec chodzi na przystanek osobno, więc wioska dokłada do łącznej drogi lᵢ · |xᵢ − p|.', 'Wypisz najmniejszą możliwą łączną drogę wszystkich mieszkańców.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z następnych n wierszy dwie liczby: pozycja wioski i liczba mieszkańców.'],
            output_format: ['Jedna liczba — najmniejsza łączna droga.'],
            constraints: ['1 ≤ n ≤ 5000', '|każda pozycja| ≤ 10⁹', '1 ≤ każda liczba mieszkańców ≤ 1000'],
            examples: [{ input: '3\n0 1\n10 5\n12 1', note: 'Przystanek w wiosce 10: 1 · 10 + 5 · 0 + 1 · 2 = 12.' }],
            hint: R`Wyobraź sobie, że każdy mieszkaniec to osobny dom — wtedy to zwykła zbiórka i najlepsza jest mediana wszystkich mieszkańców. Posortuj wioski według pozycji (pary {x, l}) i idź od lewej, sumując mieszkańców; pierwsza wioska, na której suma osiągnie co najmniej połowę wszystkich (liczona w górę), to dobre miejsce na przystanek. Prościej, choć wolniej: sprawdź jako p każdą wioskę (5000 · 5000 kroków też się zmieści). Wynik w long long.`,
            tests: (r) => {
                const gen = (n, R2, L) => `${n}\n${Array.from({ length: n }, () => `${r.int(-R2, R2)} ${r.int(1, L)}`).join('\n')}`;
                return ['1\n5 7', `2\n${-MLD} 1000\n${MLD} 1000`, '2\n0 1\n10 1', '3\n0 1000\n5 1\n9 1000', '4\n1 1\n2 1\n3 1\n100 4',
                    gen(8, 20, 5), gen(500, MLD, 1000), gen(5000, MLD, 1000), gen(3000, 50, 3)];
            },
            check: (inp) => { const t = toks(inp), n = Number(t[0]); if (!(n >= 1 && n <= 5000 && t.length === 2 * n + 1)) return 'n'; for (let i = 0; i < n; i++) if (!wZakresie([t[1 + 2 * i]], -MLD, MLD) || !wZakresie([t[2 + 2 * i]], 1, 1000)) return 'wioska'; return null; },
            solve: (inp) => {
                const t = toks(inp).map(Number), n = t[0], w = [];
                for (let i = 0; i < n; i++) w.push([t[1 + 2 * i], t[2 + 2 * i]]);
                w.sort((a, b) => a[0] - b[0]);
                const L = w.reduce((a, x) => a + x[1], 0);
                let s = 0, p = w[0][0];
                for (const [x, l] of w) { s += l; if (2 * s >= L) { p = x; break; } }
                // suma może przekroczyć 2⁵³ — liczymy w BigInt
                return String(w.reduce((a, [x, l]) => a + BigInt(l) * BigInt(Math.abs(x - p)), 0n));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<pair<long long, long long>> w(n);
    long long wszyscy = 0;
    for (int i = 0; i < n; i++) {
        cin >> w[i].first >> w[i].second;
        wszyscy += w[i].second;
    }
    sort(w.begin(), w.end());
    long long p = w[0].first, s = 0;
    for (int i = 0; i < n; i++) {
        s += w[i].second;
        if (2 * s >= wszyscy) {
            p = w[i].first;
            break;
        }
    }
    long long droga = 0;
    for (int i = 0; i < n; i++) droga += w[i].second * abs(w[i].first - p);
    cout << droga << "\n";
    return 0;
}`,
        },
    ];
};
