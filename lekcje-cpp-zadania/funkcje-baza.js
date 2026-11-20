// Funkcje — baza zadań na koniec lekcji: 10 łatwych, 10 średnich i 8 trudnych, z wielkim finałem (automat z przekąskami).
// Zadania rosną powoli: najpierw jedna, dwie funkcje liczące, potem funkcje-pytania, referencje i vectory, dalej kilka
// współpracujących funkcji (konwersje w obie strony, gry, szyfry), a na końcu zadania, które bez podziału na funkcje
// stają się nie do ogarnięcia (daty, wyszukiwanie binarne po odpowiedzi, szachy, geometria, symulacja automatu).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./funkcje-pomoc');
    const { calk, czyPierwsza, sumaCyfr, naRzymskie, zRzymskich, czyPoprawnaData, numerDnia, dzienTygodnia, zNumeru, nwd, nwdBig, dniWMiesiacu, IMIONA, SLOWA } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');

    // Mastermind: (czarne, białe) dla kodu i strzału (napisy z 4 cyfr 1–6).
    const ocen = (k, s) => { let c = 0; const A = Array(7).fill(0), B = Array(7).fill(0); for (let i = 0; i < 4; i++) { if (k[i] === s[i]) c++; A[k[i]]++; B[s[i]]++; } let w = 0; for (let d = 1; d <= 6; d++) w += Math.min(A[d], B[d]); return [c, w - c]; };
    const KODY = []; for (let a = 1; a <= 6; a++) for (let b = 1; b <= 6; b++) for (let c = 1; c <= 6; c++) for (let d = 1; d <= 6; d++) KODY.push(`${a}${b}${c}${d}`);
    const losKod = (r) => Array.from({ length: 4 }, () => r.int(1, 6)).join('');

    // Automat z przekąskami (wielki finał): ten sam stan i te same reguły co w treści zadania.
    const NOMY = [10, 20, 50, 100, 200, 500];
    const nowyAutomat = () => {
        const A = { mon: [0, 0, 0, 0, 0, 0], kr: 0, T: new Map() };
        const zl = (g) => `${Math.floor(g / 100)}.${String(g % 100).padStart(2, '0')}`;
        const wydaj = (k) => { const z = A.mon.slice(); const w = []; for (let i = 5; i >= 0; i--) while (k >= NOMY[i] && z[i] > 0) { k -= NOMY[i]; z[i]--; w.push(NOMY[i]); } if (k !== 0) return null; A.mon = z; return w; };
        A.wykonaj = (l) => {
            const t = l.split(' ');
            if (t[0] === 'TOWAR') { A.T.set(t[1], { n: t[2], c: Number(t[3]), i: Number(t[4]) }); return []; }
            if (t[0] === 'MONETY') { t.slice(1).forEach((x, i) => { A.mon[i] += Number(x); }); return []; }
            if (t[0] === 'WRZUC') { const m = Number(t[1]); A.kr += m; A.mon[NOMY.indexOf(m)]++; return []; }
            if (t[0] === 'WYBIERZ') {
                const x = A.T.get(t[1]); if (!x || x.i === 0) return ['BRAK TOWARU'];
                if (A.kr < x.c) return [`ZA MALO, brakuje ${zl(x.c - A.kr)}`];
                const reszta = A.kr - x.c; const w = wydaj(reszta); if (!w) return ['NIE MOGE WYDAC RESZTY'];
                x.i--; A.kr = 0; return [reszta > 0 ? `WYDANO ${x.n}, reszta ${zl(reszta)}: ${w.join(' ')}` : `WYDANO ${x.n}`];
            }
            if (t[0] === 'ZWROT') { if (A.kr === 0) return ['NIC DO ZWROTU']; const w = wydaj(A.kr); if (!w) return ['NIE MOGE ZWROCIC']; const s = `ZWROT ${zl(A.kr)}: ${w.join(' ')}`; A.kr = 0; return [s]; }
            if (t[0] === 'STAN') return [`kredyt ${zl(A.kr)}, monety: ${NOMY.map((m, i) => `${m}x${A.mon[i]}`).join(' ')}`];
            const k = [...A.T.keys()].sort(); if (!k.length) return ['BRAK TOWAROW'];
            return k.map((kk) => { const x = A.T.get(kk); return `${kk} ${x.n} ${zl(x.c)} x ${x.i}`; });
        };
        return A;
    };

    return [
        // ================================================================ ŁATWE
        {
            id: 'fun-b-temperatury', krok: 9, level: 'latwe',
            title: 'Przelicznik temperatur',
            short: 'Celsjusz, Fahrenheit i Kelwin w dowolną stronę. Dwie funkcje: do Celsjusza i z Celsjusza — każde przeliczenie to ich złożenie.',
            tags: ['return double', 'złożenie funkcji', 'fixed i setprecision'],
            statement: ['Termometr pokazuje temperaturę w jednej skali, a trzeba ją podać w innej. Skale: C (Celsjusz), F (Fahrenheit) i K (Kelwin). Wzory: F = C · 9 / 5 + 32 oraz K = C + 273.15.',
                'Zamiast sześciu wzorów (każda skala na każdą) napisz dwie funkcje: double naCelsjusza(double x, char skala) i double zCelsjusza(double c, char skala). Przeliczenie ze skali A na B to zCelsjusza(naCelsjusza(x, A), B). Licz dokładnie według podanych wzorów (z F na C: (x − 32) · 5 / 9, z K na C: x − 273.15).'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy: temperatura x, skala źródłowa i skala docelowa.'],
            output_format: ['q wierszy: temperatura w skali docelowej z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ q ≤ 1000', '−500 ≤ x ≤ 1000, x ma najwyżej jedną cyfrę po kropce.'],
            examples: [{ input: '3\n100 C F\n32 F C\n0 K C', note: 'Woda wrze w 212 °F, 32 °F to 0 °C, a 0 K to −273.15 °C.' }],
            hint: R`double naCelsjusza(double x, char s) { if (s == 'F') return (x - 32) * 5 / 9; if (s == 'K') return x - 273.15; return x; } i odwrotnie double zCelsjusza(double c, char s) { if (s == 'F') return c * 9 / 5 + 32; if (s == 'K') return c + 273.15; return c; }. Wynik: cout << fixed << setprecision(2) << zCelsjusza(naCelsjusza(x, a), b);.`,
            tests: (r) => {
                const S = ['C', 'F', 'K'];
                const nC = (x, s) => (s === 'F' ? (x - 32) * 5 / 9 : s === 'K' ? x - 273.15 : x), zC = (c, s) => (s === 'F' ? c * 9 / 5 + 32 : s === 'K' ? c + 273.15 : c);
                const pol = () => { for (;;) { const k = r.int(-5000, 10000); const x = r() < 0.5 ? k / 10 : Math.round(k / 10); const a = r.pick(S), b = r.pick(S); if (h.safe(zC(nC(x, a), b), 2)) return `${x} ${a} ${b}`; } };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['0 C C']), d(['-40 C F', '-40 F C', '1000 K F', '-500 F K', '36.6 C F', '98.6 F C']), d(Array.from({ length: 30 }, pol)), d(Array.from({ length: 1000 }, pol))];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); return calk(q, 1, 1000) && L.length === q + 1 && L.slice(1).every((l) => { const m = l.match(/^(-?\d+(?:\.\d)?) ([CFK]) ([CFK])$/); return m && Number(m[1]) >= -500 && Number(m[1]) <= 1000; }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [xs, a, b] = l.split(' '); const x = Number(xs); const c = a === 'F' ? (x - 32) * 5 / 9 : a === 'K' ? x - 273.15 : x; return h.fx(b === 'F' ? c * 9 / 5 + 32 : b === 'K' ? c + 273.15 : c, 2); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
double naCelsjusza(double x, char s) {
    if (s == 'F') return (x - 32) * 5 / 9;
    if (s == 'K') return x - 273.15;
    return x;
}
double zCelsjusza(double c, char s) {
    if (s == 'F') return c * 9 / 5 + 32;
    if (s == 'K') return c + 273.15;
    return c;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        double x;
        char a, b;
        cin >> x >> a >> b;
        cout << fixed << setprecision(2) << zCelsjusza(naCelsjusza(x, a), b) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-automorficzne', krok: 9, level: 'latwe',
            title: 'Liczby automorficzne',
            short: 'Kwadrat liczby kończy się nią samą: 25² = 625, 76² = 5776. Funkcja-pytanie z potęgą dziesiątki i resztą z dzielenia.',
            tags: ['funkcja bool', 'long long', 'reszta z dzielenia przez 10ᵏ'],
            statement: ['Liczba jest automorficzna, jeśli jej kwadrat kończy się jej cyframi: 5² = 25, 6² = 36, 25² = 625, 76² = 5776.',
                'Napisz funkcję bool automorficzna(long long x). Dla każdego przedziału [a, b] wypisz wszystkie liczby automorficzne z tego przedziału rosnąco albo BRAK, jeśli nie ma żadnej.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy liczby a i b.'],
            output_format: ['q wierszy: liczby automorficzne z przedziału, oddzielone spacjami, albo BRAK.'],
            constraints: ['1 ≤ q ≤ 10', '1 ≤ a ≤ b ≤ 10⁶'],
            examples: [{ input: '2\n1 100\n100 300', note: 'Do 100 są to 1, 5, 6, 25 i 76. Następna jest 376, więc w [100, 300] nie ma żadnej.' }],
            hint: R`Weź p = najmniejszą potęgę 10 większą od x (long long p = 1; while (p <= x) p *= 10;) — wtedy x * x % p to ostatnie cyfry kwadratu, tyle, ile cyfr ma x. Funkcja: return x * x % p == x;. Kwadrat 10⁶ to 10¹² — potrzebny long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                return [d([[1, 1]]), d([[1, 1000000], [377, 624], [7, 24], [890625, 890625]]), d(Array.from({ length: 10 }, () => { const a = r.int(1, 1000000); return [a, Math.min(1000000, a + r.int(0, 200000))]; })), d(Array.from({ length: 10 }, () => [r.int(1, 100), 1000000]))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10) && t.length === 2 * t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) && t.slice(1).every((x, i, a) => i % 2 === 0 || a[i - 1] <= x) ? null : 'dane'; },
            solve: (inp) => {
                const A = []; for (let x = 1n; x <= 1000000n; x++) { let p = 1n; while (p <= x) p *= 10n; if ((x * x) % p === x) A.push(Number(x)); }
                const t = nums(inp).slice(1); const o = []; for (let i = 0; i < t.length; i += 2) { const w = A.filter((x) => x >= t[i] && x <= t[i + 1]); o.push(w.length ? w.join(' ') : 'BRAK'); } return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool automorficzna(long long x) {
    long long p = 1;
    while (p <= x) p *= 10;
    return x * x % p == x;
}
int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        long long a, b;
        cin >> a >> b;
        bool byla = false;
        for (long long x = a; x <= b; x++) {
            if (automorficzna(x)) {
                if (byla) cout << " ";
                cout << x;
                byla = true;
            }
        }
        if (!byla) cout << "BRAK";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-najblizsza-pierwsza', krok: 9, level: 'latwe',
            title: 'Najbliższa liczba pierwsza',
            short: 'Dla każdej liczby: najbliższa liczba pierwsza, przy remisie mniejsza. Odległość d = 0, 1, 2, … i dwa pytania czyPierwsza(x − d), czyPierwsza(x + d).',
            tags: ['funkcja bool', 'szukanie w obie strony', 'pierwszość do √n'],
            statement: ['Dla każdej liczby x znajdź najbliższą jej liczbę pierwszą. Jeśli dwie liczby pierwsze są tak samo daleko (jedna mniejsza, druga większa od x), wybierz mniejszą. Sama x też może być pierwsza.',
                'Napisz bool czyPierwsza(long long x) i sprawdzaj kolejne odległości d = 0, 1, 2, …: najpierw x − d, potem x + d.'],
            input_format: ['W pierwszym wierszu q.', 'W drugim wierszu q liczb.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ q ≤ 1000', '1 ≤ x ≤ 10⁹'],
            examples: [{ input: '4\n10 1 8 13', note: '10: 9 nie jest pierwsza, 11 jest. 1: najbliższa jest 2. 8: 7 i 9 są w odległości 1, ale pierwsza jest tylko 7. 13 jest pierwsza.' }],
            hint: R`for (long long d = 0; ; d++) { if (x - d >= 2 && czyPierwsza(x - d)) { cout << x - d; break; } if (czyPierwsza(x + d)) { cout << x + d; break; } } — kolejność sprawdzania załatwia remis: przy tej samej odległości mniejsza liczba wygrywa. Odstępy między liczbami pierwszymi do 10⁹ są krótkie (kilkaset), więc pętla szybko się kończy.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([1]), d([2, 3, 4, 6, 9, 15, 1000000000, 999999999, 370261, 370262, 370303]), d(Array.from({ length: 40 }, (_, i) => i + 1)), d(r.arr(1000, 1, 1000000000)), d(r.arr(1000, 1, 1000))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).map((x) => { for (let d = 0; ; d++) { if (x - d >= 2 && czyPierwsza(x - d)) return x - d; if (czyPierwsza(x + d)) return x + d; } }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool czyPierwsza(long long x) {
    if (x < 2) return false;
    for (long long d = 2; d * d <= x; d++)
        if (x % d == 0) return false;
    return true;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        for (long long d = 0;; d++) {
            if (x - d >= 2 && czyPierwsza(x - d)) {
                cout << x - d << "\n";
                break;
            }
            if (czyPierwsza(x + d)) {
                cout << x + d << "\n";
                break;
            }
        }
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-proporcje', krok: 9, level: 'latwe',
            title: 'Proporcje w przepisie',
            short: 'Przepis na wielki gar: 200 g, 300 g, 500 g… Najmniejsza wersja o tych samych proporcjach to podzielenie wszystkiego przez NWD całej listy.',
            tags: ['funkcja nwd', 'NWD wielu liczb', 'wynik jednej funkcji wraca do niej'],
            statement: ['Przepis podaje ilości n składników (w gramach). Chcesz przygotować najmniejszą porcję, w której proporcje są takie same, a wszystkie ilości są całkowite.',
                'Napisz funkcję long long nwd(long long a, long long b) (algorytm Euklidesa) i policz NWD całej listy: zacznij od pierwszej liczby i kolejno g = nwd(g, x). Wypisz ilości podzielone przez g.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: nowe ilości, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda ilość ≤ 10⁹'],
            examples: [{ input: '3\n200 300 500', note: 'NWD(200, 300, 500) = 100, więc porcja to 2, 3 i 5 gramów — proporcje 2 : 3 : 5 bez zmian.' }],
            hint: R`long long nwd(long long a, long long b) { while (b != 0) { long long r = a % b; a = b; b = r; } return a; }. NWD wielu liczb liczy się „po kolei”: long long g = t[0]; for (…) g = nwd(g, t[i]);. Wynik funkcji od razu wraca do niej jako argument.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const zG = (n, g, mx) => Array.from({ length: n }, () => g * r.int(1, Math.floor(mx / g)));
                return [d([7]), d([1000000000, 1000000000]), d([6, 10, 15]), d(zG(10, 12, 1000)), d(zG(1000, 30030, 1000000000)), d(r.arr(1000, 1, 1000000000)), d(zG(1000, 999999937, 1000000000))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp).slice(1); const g = t.reduce((a, b) => nwd(a, b)); return t.map((x) => x / g).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long nwd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
int main() {
    int n;
    cin >> n;
    vector<long long> t(n);
    for (int i = 0; i < n; i++) cin >> t[i];
    long long g = t[0];
    for (int i = 1; i < n; i++) g = nwd(g, t[i]);
    for (int i = 0; i < n; i++) {
        if (i > 0) cout << " ";
        cout << t[i] / g;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-b-wielomian', krok: 9, level: 'latwe',
            title: 'Wartości wielomianu',
            short: 'W(x) = 1·x² − 3x + 2 w wielu punktach. Schemat Hornera w funkcji, która dostaje współczynniki przez const & — bez kopiowania przy każdym pytaniu.',
            tags: ['const vector<long long> &', 'schemat Hornera', 'jedna funkcja, wiele pytań'],
            statement: ['Wielomian stopnia d ma współczynniki a_d, a_{d−1}, …, a_0 (od najwyższej potęgi): W(x) = a_d · xᵈ + … + a_1 · x + a_0. Policz jego wartość w q punktach.',
                'Napisz funkcję long long wartosc(const vector<long long> &a, long long x), która liczy W(x) schematem Hornera: zaczynasz od w = 0 i dla każdego współczynnika (od najwyższego) robisz w = w · x + a_i.'],
            input_format: ['W pierwszym wierszu d.', 'W drugim wierszu d + 1 współczynników: a_d, …, a_0.', 'W trzecim wierszu q, w czwartym q punktów x.'],
            output_format: ['q wierszy z wartościami W(x).'],
            constraints: ['0 ≤ d ≤ 10', '−100 ≤ a_i ≤ 100', '1 ≤ q ≤ 1000, −10 ≤ x ≤ 10'],
            examples: [{ input: '2\n1 -3 2\n3\n0 1 5', note: 'W(x) = x² − 3x + 2. W(0) = 2, W(1) = 1 − 3 + 2 = 0, W(5) = 25 − 15 + 2 = 12.' }],
            hint: R`long long wartosc(const vector<long long> &a, long long x) { long long w = 0; for (long long c : a) w = w * x + c; return w; } — dla 1, −3, 2 i x = 5: w = 1, potem 1 · 5 − 3 = 2, potem 2 · 5 + 2 = 12. Bez & funkcja kopiowałaby współczynniki przy każdym z q wywołań.`,
            tests: (r) => {
                const d = (a, X) => `${a.length - 1}\n${a.join(' ')}\n${X.length}\n${X.join(' ')}`;
                return [d([5], [0]), d([1, -3, 2], [-10, -1, 0, 1, 2, 10]), d(Array(11).fill(100), [10, -10, 9, -9]), d(Array.from({ length: 11 }, (_, i) => (i % 2 ? -100 : 100)), [10, -10]), d(r.arr(r.int(1, 10) + 1, -100, 100), r.arr(1000, -10, 10)), d(r.arr(11, -100, 100), r.arr(1000, -10, 10))];
            },
            check: (inp) => { const L = linie(inp); const dd = Number(L[0]); const a = L[1].split(' ').map(Number); const q = Number(L[2]); const X = (L[3] || '').split(' ').map(Number); return calk(dd, 0, 10) && a.length === dd + 1 && a.every((x) => calk(x, -100, 100)) && calk(q, 1, 1000) && X.length === q && X.every((x) => calk(x, -10, 10)) && L.length === 4 ? null : 'dane'; },
            solve: (inp) => { const L = linie(inp); const a = L[1].split(' ').map(BigInt); return L[3].split(' ').map(BigInt).map((x) => String(a.reduce((w, c) => w * x + c, 0n))).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long wartosc(const vector<long long> &a, long long x) {
    long long w = 0;
    for (long long c : a) w = w * x + c;
    return w;
}
int main() {
    int d;
    cin >> d;
    vector<long long> a(d + 1);
    for (int i = 0; i <= d; i++) cin >> a[i];
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        cout << wartosc(a, x) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-oczko', krok: 9, level: 'latwe',
            title: 'Oczko',
            short: 'Karty 2–9, T, J, Q, K liczą się po swojemu, a as jako 11 albo 1. Funkcja wartosciKarty i funkcja wartosciReki, która poprawia asy, gdy jest za dużo.',
            tags: ['funkcja z char', 'funkcja z string', 'funkcja woła funkcję'],
            statement: ['W oczko karty mają wartości: 2–9 tyle, ile oczek, T (dziesiątka), J, Q, K po 10, a as (A) — 11. Gdy suma ręki przekracza 21, a w ręce są asy liczone za 11, kolejne asy zaczynają się liczyć za 1, dopóki suma nie spadnie do 21 albo asy się nie skończą.',
                'W każdej rundzie grają dwaj gracze. Ręka powyżej 21 przegrywa; jeśli obie przekroczyły 21 albo mają tę samą wartość — remis; w przeciwnym razie wygrywa wyższa. Napisz int wartoscKarty(char c) i int wartoscReki(string reka).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy dwie ręce (napisy ze znaków 23456789TJQKA).'],
            output_format: ['n wierszy: wartości obu rąk i werdykt — wygrywa 1, wygrywa 2 albo remis.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każda ręka ma od 2 do 10 kart.'],
            examples: [{ input: '3\nAK T9\nAA 99\nT9A KQ5', note: 'AK to 21. AA: 22 to za dużo, więc jeden as liczy się za 1 — razem 12. T9A: 30, as za 1 daje 20; KQ5 to 25, czyli za dużo — wygrywa gracz 1.' }],
            hint: R`int wartoscReki(string r) { int suma = 0, asy = 0; for (char c : r) { suma += wartoscKarty(c); if (c == 'A') asy++; } while (suma > 21 && asy > 0) { suma -= 10; asy--; } return suma; } — zamiana asa z 11 na 1 to odjęcie 10.`,
            tests: (r) => {
                const K = '23456789TJQKA';
                const reka = () => r.word(r.int(2, r.pick([3, 4, 10])), K);
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                return [d([['AA', 'AA']]), d([['AK', 'KA'], ['AAAA', '22'], ['KQ', 'JT'], ['KQ2', 'KQ3'], ['AAAAAAAAAA', 'A9'], ['99', 'T9A']]), d(Array.from({ length: 30 }, () => [reka(), reka()])), d(Array.from({ length: 1000 }, () => [reka(), reka()]))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 1000) && L.length === n + 1 && L.slice(1).every((l) => /^[2-9TJQKA]{2,10} [2-9TJQKA]{2,10}$/.test(l)) ? null : 'dane'; },
            solve: (inp) => {
                const w = (s) => { let suma = 0, a = 0; for (const c of s) { suma += c === 'A' ? 11 : 'TJQK'.includes(c) ? 10 : Number(c); if (c === 'A') a++; } while (suma > 21 && a > 0) { suma -= 10; a--; } return suma; };
                return linie(inp).slice(1).map((l) => { const [x, y] = l.split(' ').map(w); let v; if ((x > 21 && y > 21) || x === y) v = 'remis'; else if (x > 21) v = 'wygrywa 2'; else if (y > 21) v = 'wygrywa 1'; else v = x > y ? 'wygrywa 1' : 'wygrywa 2'; return `${x} ${y} ${v}`; }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int wartoscKarty(char c) {
    if (c == 'A') return 11;
    if (c == 'T' || c == 'J' || c == 'Q' || c == 'K') return 10;
    return c - '0';
}
int wartoscReki(string r) {
    int suma = 0, asy = 0;
    for (char c : r) {
        suma += wartoscKarty(c);
        if (c == 'A') asy++;
    }
    while (suma > 21 && asy > 0) {
        suma -= 10;
        asy--;
    }
    return suma;
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string a, b;
        cin >> a >> b;
        int x = wartoscReki(a), y = wartoscReki(b);
        cout << x << " " << y << " ";
        if ((x > 21 && y > 21) || x == y) cout << "remis\n";
        else if (x > 21) cout << "wygrywa 2\n";
        else if (y > 21) cout << "wygrywa 1\n";
        else if (x > y) cout << "wygrywa 1\n";
        else cout << "wygrywa 2\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-kwadrat-lacinski', krok: 9, level: 'latwe',
            title: 'Czy to kwadrat łaciński?',
            short: 'W każdym wierszu i w każdej kolumnie każda z liczb 1…n dokładnie raz. Dwie funkcje-pytania na globalnej tablicy: wierszOk(r) i kolumnaOk(c).',
            tags: ['funkcje bool', 'globalna tablica 2D', 'tablica odwiedzin'],
            statement: ['Kwadrat łaciński stopnia n to tablica n × n wypełniona liczbami od 1 do n tak, że w każdym wierszu i w każdej kolumnie każda liczba występuje dokładnie raz (jak w sudoku, ale bez małych kwadratów).',
                'Dla każdej z t tablic wypisz TAK albo NIE. Trzymaj tablicę w zmiennej globalnej i napisz funkcje bool wierszOk(int r) i bool kolumnaOk(int c).'],
            input_format: ['W pierwszym wierszu t.', 'Każda tablica: wiersz z n i n wierszy po n liczb.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 10', '1 ≤ n ≤ 40', 'Wszystkie liczby są od 1 do n.'],
            examples: [{ input: '2\n3\n1 2 3\n2 3 1\n3 1 2\n3\n1 2 3\n2 3 1\n2 3 1', note: 'Pierwsza tablica jest kwadratem łacińskim. W drugiej wiersze są dobre, ale w kolumnach liczby się powtarzają.' }],
            hint: R`bool wierszOk(int r) { bool bylo[45] = {}; for (int c = 0; c < n; c++) { if (bylo[t[r][c]]) return false; bylo[t[r][c]] = true; } return true; } — tablica bylo jest lokalna, więc przy każdym wywołaniu jest pusta. kolumnaOk wygląda tak samo, tylko idzie w dół kolumny.`,
            tests: (r) => {
                const lac = (n) => { const p = r.shuffle(Array.from({ length: n }, (_, i) => i)), q = r.shuffle(Array.from({ length: n }, (_, i) => i)), s = r.shuffle(Array.from({ length: n }, (_, i) => i + 1)); return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => s[(p[i] + q[j]) % n])); };
                const psuj = (a) => { const n = a.length; if (n < 2) return a; const b = a.map((w) => w.slice()); const k = r.int(0, 2); if (k === 0) { const i = r.int(0, n - 1), j = r.int(0, n - 1); let v; do v = r.int(1, n); while (v === b[i][j]); b[i][j] = v; } else if (k === 1) { const i = r.int(0, n - 1); let j; do j = r.int(0, n - 1); while (j === i); b[j] = b[i].slice(); } else { const j = r.int(0, n - 1); for (let i = 0; i < n; i++) b[i][j] = b[i][(j + 1) % n]; } return b; };
                const d = (T) => `${T.length}\n${T.map((a) => `${a.length}\n${a.map((w) => w.join(' ')).join('\n')}`).join('\n')}`;
                return [d([[[1]]]), d([[[1, 2], [2, 1]], [[1, 2], [1, 2]], [[1, 1], [2, 2]], [[2, 1], [1, 2]]]), d(Array.from({ length: 10 }, () => { const a = lac(r.int(1, 8)); return r() < 0.5 ? a : psuj(a); })), d(Array.from({ length: 10 }, () => { const a = lac(40); return r() < 0.4 ? a : psuj(a); }))];
            },
            check: (inp) => { const t = nums(inp); let i = 1; if (!calk(t[0], 1, 10)) return 't'; for (let k = 0; k < t[0]; k++) { const n = t[i++]; if (!calk(n, 1, 40)) return 'n'; for (let j = 0; j < n * n; j++) if (!calk(t[i++], 1, n)) return 'liczba'; } return i === t.length ? null : 'dlugosc'; },
            solve: (inp) => { const t = nums(inp); let i = 1; const o = []; for (let k = 0; k < t[0]; k++) { const n = t[i++]; const a = []; for (let w = 0; w < n; w++) { a.push(t.slice(i, i + n)); i += n; } let ok = true; for (let w = 0; w < n; w++) { if (new Set(a[w]).size !== n) ok = false; if (new Set(a.map((x) => x[w])).size !== n) ok = false; } o.push(ok ? 'TAK' : 'NIE'); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n;
int t[45][45];
bool wierszOk(int r) {
    bool bylo[45] = {};
    for (int c = 0; c < n; c++) {
        if (bylo[t[r][c]]) return false;
        bylo[t[r][c]] = true;
    }
    return true;
}
bool kolumnaOk(int c) {
    bool bylo[45] = {};
    for (int r = 0; r < n; r++) {
        if (bylo[t[r][c]]) return false;
        bylo[t[r][c]] = true;
    }
    return true;
}
int main() {
    int ile;
    cin >> ile;
    for (int k = 0; k < ile; k++) {
        cin >> n;
        for (int r = 0; r < n; r++)
            for (int c = 0; c < n; c++) cin >> t[r][c];
        bool ok = true;
        for (int i = 0; i < n; i++)
            if (!wierszOk(i) || !kolumnaOk(i)) ok = false;
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-data-za-k-dni', krok: 9, level: 'latwe',
            title: 'Data za k dni',
            short: 'Funkcja jutro(d, m, r) przestawia datę o jeden dzień — przez referencje. Wywołana k razy daje datę za k dni, z przełomem miesięcy i lat przestępnych.',
            tags: ['trzy parametry przez &', 'funkcja woła funkcję', 'setw i setfill'],
            statement: ['Dla każdej daty i liczby k podaj datę, która wypadnie k dni później.',
                'Napisz funkcje bool przestepny(int r), int dniWMiesiacu(int m, int r) i void jutro(int &d, int &m, int &r), która zmienia datę na następny dzień. Wypisz datę w formacie DD.MM.RRRR (dzień i miesiąc zawsze dwiema cyframi).'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy: d, m, r i k.'],
            output_format: ['q wierszy z datami w formacie DD.MM.RRRR.'],
            constraints: ['1 ≤ q ≤ 100', 'Daty są poprawne, 1000 ≤ r ≤ 9000.', '0 ≤ k ≤ 10⁵'],
            examples: [{ input: '2\n28 2 2024 2\n31 12 2023 1', note: '2024 jest przestępny: po 28 lutego jest 29 lutego, a potem 1 marca. Po sylwestrze — 1 stycznia następnego roku.' }],
            hint: R`void jutro(int &d, int &m, int &r) { d++; if (d > dniWMiesiacu(m, r)) { d = 1; m++; if (m > 12) { m = 1; r++; } } }. Wypisanie z zerami: cout << setfill('0') << setw(2) << d << "." << setw(2) << m << "." << r << "\n";.`,
            tests: (r) => {
                const data = () => { for (;;) { const rr = r.int(1000, 8700), m = r.int(1, 12), d = r.int(1, 31); if (czyPoprawnaData(d, m, rr)) return [d, m, rr]; } };
                const dd = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                return [dd([[1, 1, 1000, 0]]), dd([[28, 2, 1900, 1], [28, 2, 2000, 1], [31, 12, 8999, 1], [31, 1, 2023, 30], [1, 1, 2000, 100000]]), dd(Array.from({ length: 30 }, () => [...data(), r.int(0, 800)])), dd(Array.from({ length: 100 }, () => [...data(), r.int(90000, 100000)]))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 100) || t.length !== 4 * t[0] + 1) return 'q'; for (let i = 1; i < t.length; i += 4) if (!czyPoprawnaData(t[i], t[i + 1], t[i + 2]) || !calk(t[i + 2], 1000, 9000) || !calk(t[i + 3], 0, 1e5)) return 'dane'; return null; },
            solve: (inp) => { const t = nums(inp); const o = []; for (let i = 1; i < t.length; i += 4) { const [d, m, rr] = zNumeru(numerDnia(t[i], t[i + 1], t[i + 2]) + t[i + 3]); o.push(`${String(d).padStart(2, '0')}.${String(m).padStart(2, '0')}.${rr}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool przestepny(int r) {
    return (r % 4 == 0 && r % 100 != 0) || r % 400 == 0;
}
int dniWMiesiacu(int m, int r) {
    if (m == 2) return przestepny(r) ? 29 : 28;
    if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
    return 31;
}
void jutro(int &d, int &m, int &r) {
    d++;
    if (d > dniWMiesiacu(m, r)) {
        d = 1;
        m++;
        if (m > 12) {
            m = 1;
            r++;
        }
    }
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int d, m, r, k;
        cin >> d >> m >> r >> k;
        for (int j = 0; j < k; j++) jutro(d, m, r);
        cout << setfill('0') << setw(2) << d << "." << setw(2) << m << "." << r << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-palindromy-w-zdaniu', krok: 9, level: 'latwe',
            title: 'Najdłuższy palindrom w zdaniu',
            short: 'W każdym zdaniu szukamy najdłuższego słowa, które czyta się tak samo od tyłu. Funkcja palindrom(s) i słowa wyjmowane ze zdania przez stringstream.',
            tags: ['funkcja bool z napisem', 'const string &', 'getline i stringstream'],
            statement: ['Dla każdego zdania znajdź najdłuższe słowo, które jest palindromem (czyta się tak samo od przodu i od tyłu, np. kajak, oko, a). Jeśli kilka ma tę samą długość, wybierz to, które występuje pierwsze. Jeśli żadne słowo nie jest palindromem, wypisz BRAK.',
                'Napisz funkcję bool palindrom(const string &s).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy jedno zdanie: słowa z małych liter oddzielone pojedynczymi spacjami.'],
            output_format: ['n wierszy z odpowiedziami.'],
            constraints: ['1 ≤ n ≤ 100', 'Zdanie ma od 1 do 200 znaków.'],
            examples: [{ input: '3\nkajak i oko\npies je kosc\nala ma kota', note: 'W pierwszym zdaniu palindromy to kajak, i, oko — najdłuższy jest kajak. W drugim nie ma żadnego. ala też jest palindromem.' }],
            hint: R`bool palindrom(const string &s) { for (int i = 0, j = s.size() - 1; i < j; i++, j--) if (s[i] != s[j]) return false; return true; }. Zdanie: getline(cin, w); stringstream ss(w); while (ss >> slowo) if (palindrom(slowo) && slowo.size() > najlepsze.size()) najlepsze = slowo; — znak > (a nie >=) zostawia pierwsze z równie długich.`,
            tests: (r) => {
                const PAL = ['kajak', 'oko', 'i', 'a', 'w', 'zaz', 'ala', 'kok', 'potop', 'radar', 'level', 'abba', 'ono', 'anna', 'sedes', 'malam', 'xyzyx'];
                const NIE = ['pies', 'je', 'kot', 'dom', 'las', 'szkola', 'kosc', 'rower', 'ma', 'kota', 'gra', 'ekran', 'mysz'];
                const zd = () => { for (;;) { const k = r.int(1, 12); const s = Array.from({ length: k }, () => (r() < 0.3 ? r.pick(PAL) : r() < 0.1 ? r.word(r.int(1, 3), 'ab') : r.pick(NIE))).join(' '); if (s.length <= 200) return s; } };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['a']), d(['pies', 'kot ala oko', 'abba anna', 'xyzyx kajak potop', 'kosc']), d(Array.from({ length: 30 }, zd)), d(Array.from({ length: 100 }, zd))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 100) && L.length === n + 1 && L.slice(1).every((l) => l.length <= 200 && /^[a-z]+( [a-z]+)*$/.test(l)) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { let b = ''; for (const s of l.split(' ')) if (s === [...s].reverse().join('') && s.length > b.length) b = s; return b || 'BRAK'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool palindrom(const string &s) {
    for (int i = 0, j = (int)s.size() - 1; i < j; i++, j--)
        if (s[i] != s[j]) return false;
    return true;
}
int main() {
    int n;
    cin >> n;
    cin.ignore();
    for (int i = 0; i < n; i++) {
        string w, slowo, najlepsze = "";
        getline(cin, w);
        stringstream ss(w);
        while (ss >> slowo)
            if (palindrom(slowo) && slowo.size() > najlepsze.size()) najlepsze = slowo;
        if (najlepsze == "") cout << "BRAK\n";
        else cout << najlepsze << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-statystyka-klasowki', krok: 9, level: 'latwe',
            title: 'Statystyka klasówki',
            short: 'Średnia, mediana i dominanta wyników. Trzy funkcje — dwie czytają vector przez const &, a mediana celowo dostaje kopię, bo musi go posortować.',
            tags: ['const & albo kopia — świadomie', 'funkcje zwracające double', 'sortowanie kopii'],
            statement: ['Nauczyciel chce trzy liczby opisujące wyniki klasówki: średnią (z dwiema cyframi po kropce), medianę (środkowy wynik po posortowaniu; przy parzystej liczbie wyników — średnia dwóch środkowych, z jedną cyfrą po kropce) i dominantę (najczęstszy wynik; przy remisie — najmniejszy).',
                'Napisz double srednia(const vector<int> &v), double mediana(vector<int> v) i int dominanta(const vector<int> &v). Mediana dostaje kopię celowo: sortuje ją, a oryginalna lista zostaje w kolejności z wejścia.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n wyników.'],
            output_format: ['Trzy wiersze: srednia X.XX, mediana Y.Y, dominanta Z'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każdy wynik ≤ 100'],
            examples: [{ input: '6\n5 3 5 1 4 6', note: 'Suma 24, więc średnia 4.00. Po posortowaniu: 1 3 4 5 5 6 — środkowe to 4 i 5, mediana 4.5. Najczęściej (dwa razy) pojawia się 5.' }],
            hint: R`double mediana(vector<int> v) { sort(v.begin(), v.end()); int n = v.size(); if (n % 2 == 1) return v[n / 2]; return (v[n / 2 - 1] + v[n / 2]) / 2.0; }. Średnia: (double)suma / v.size(). Wypisz średnią z setprecision(2), a medianę z setprecision(1) — przy fixed.`,
            tests: (r) => {
                const dobre = (a) => h.safe(a.reduce((s, x) => s + x, 0) / a.length, 2);
                const los = (n, lo, hi) => { for (;;) { const a = r.arr(n, lo, hi); if (dobre(a)) return a; } };
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([7]), d([100, 0]), d([3, 3, 1, 1]), d(los(9, 0, 10)), d(los(100, 0, 100)), d(los(1000, 0, 100)), d(los(999, 40, 60))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 100)) ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp).slice(1); const n = a.length; const s = a.slice().sort((x, y) => x - y);
                const med = n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2; const c = new Map(); for (const x of a) c.set(x, (c.get(x) || 0) + 1);
                let dom = -1, dc = 0; for (const [x, k] of c) if (k > dc || (k === dc && x < dom)) { dom = x; dc = k; }
                return `srednia ${h.fx(a.reduce((p, x) => p + x, 0) / n, 2)}\nmediana ${med.toFixed(1)}\ndominanta ${dom}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
double srednia(const vector<int> &v) {
    long long s = 0;
    for (int x : v) s += x;
    return (double)s / v.size();
}
double mediana(vector<int> v) {
    sort(v.begin(), v.end());
    int n = v.size();
    if (n % 2 == 1) return v[n / 2];
    return (v[n / 2 - 1] + v[n / 2]) / 2.0;
}
int dominanta(const vector<int> &v) {
    int ile[101] = {};
    for (int x : v) ile[x]++;
    int w = 0;
    for (int x = 1; x <= 100; x++)
        if (ile[x] > ile[w]) w = x;
    return w;
}
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (int i = 0; i < n; i++) cin >> v[i];
    cout << fixed << setprecision(2) << "srednia " << srednia(v) << "\n";
    cout << setprecision(1) << "mediana " << mediana(v) << "\n";
    cout << "dominanta " << dominanta(v) << "\n";
    return 0;
}`,
        },

        // ================================================================ ŚREDNIE
        {
            id: 'fun-b-rzymski-kalkulator', krok: 9, level: 'srednie',
            title: 'Rzymski kalkulator',
            short: 'XIV + XXVIII = XLII. Dwie funkcje, które robią odwrotne rzeczy: z rzymskiej na liczbę i z liczby na rzymską — a między nimi zwykłe działanie.',
            tags: ['dwie funkcje odwrotne', 'return string i return int', 'złożenie funkcji'],
            statement: ['Rzymianie liczyli bez zera i bez cyfr arabskich. Twój kalkulator dostaje działania na liczbach rzymskich: A op B, gdzie op to +, - albo *, i wypisuje wynik też po rzymsku. Wyniki zawsze mieszczą się w przedziale od 1 do 3999.',
                'Wartości: M = 1000, D = 500, C = 100, L = 50, X = 10, V = 5, I = 1; znak mniejszy stojący przed większym odejmujemy (IV = 4, XC = 90). Napisz int zRzymskiej(string s) i string naRzymska(int x).'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy działanie: liczba rzymska, znak działania i liczba rzymska.'],
            output_format: ['q wierszy z wynikami zapisanymi po rzymsku.'],
            constraints: ['1 ≤ q ≤ 1000', 'Liczby są zapisane poprawnie, od I do MMMCMXCIX, a wynik każdego działania jest od 1 do 3999.'],
            examples: [{ input: '3\nXIV + XXVIII\nM - I\nXII * XII', note: '14 + 28 = 42 = XLII, 1000 − 1 = 999 = CMXCIX, 12 · 12 = 144 = CXLIV.' }],
            hint: R`zRzymskiej: przejdź po znakach; jeśli wartość znaku jest mniejsza niż wartość następnego, odejmij ją, w przeciwnym razie dodaj. Wartość znaku zwraca osobna funkcja int wartosc(char c). naRzymska znasz z części 3: tabela 13 wartości od 1000 do 1 i odejmowanie, dopóki się da.`,
            tests: (r) => {
                const pol = () => { for (;;) { const op = r.pick(['+', '-', '*']); const a = r.int(1, op === '*' ? 200 : 3999), b = r.int(1, op === '*' ? 60 : 3999); const w = op === '+' ? a + b : op === '-' ? a - b : a * b; if (w >= 1 && w <= 3999) return `${naRzymskie(a)} ${op} ${naRzymskie(b)}`; } };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['I + I']), d(['MMMCMXCVIII + I', 'MMMCMXCIX - MMMCMXCVIII', 'LXIII * LXIII', 'CDXLIV + CDXLIV', 'IX * CDXLIV']), d(Array.from({ length: 30 }, pol)), d(Array.from({ length: 1000 }, pol))];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); return calk(q, 1, 1000) && L.length === q + 1 && L.slice(1).every((l) => { const m = l.match(/^([MDCLXVI]+) ([-+*]) ([MDCLXVI]+)$/); if (!m) return false; const a = zRzymskich(m[1]), b = zRzymskich(m[3]); if (naRzymskie(a) !== m[1] || naRzymskie(b) !== m[3] || a > 3999 || b > 3999) return false; const w = m[2] === '+' ? a + b : m[2] === '-' ? a - b : a * b; return w >= 1 && w <= 3999; }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [a, op, b] = l.split(' '); const x = zRzymskich(a), y = zRzymskich(b); return naRzymskie(op === '+' ? x + y : op === '-' ? x - y : x * y); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int wartosc(char c) {
    if (c == 'M') return 1000;
    if (c == 'D') return 500;
    if (c == 'C') return 100;
    if (c == 'L') return 50;
    if (c == 'X') return 10;
    if (c == 'V') return 5;
    return 1;
}
int zRzymskiej(string s) {
    int w = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        if (i + 1 < (int)s.size() && wartosc(s[i]) < wartosc(s[i + 1])) w -= wartosc(s[i]);
        else w += wartosc(s[i]);
    }
    return w;
}
string naRzymska(int x) {
    int w[] = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
    string z[] = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
    string s = "";
    for (int i = 0; i < 13; i++) {
        while (x >= w[i]) {
            s += z[i];
            x -= w[i];
        }
    }
    return s;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string a, op, b;
        cin >> a >> op >> b;
        int x = zRzymskiej(a), y = zRzymskiej(b), wynik;
        if (op == "+") wynik = x + y;
        else if (op == "-") wynik = x - y;
        else wynik = x * y;
        cout << naRzymska(wynik) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-rzeka-liczb', krok: 9, level: 'srednie',
            title: 'Rzeka liczb',
            short: 'Rzeka zaczyna się w k i płynie: każdy następny wyraz to poprzedni plus suma jego cyfr. Gdzie spotkają się dwie rzeki? Funkcja nastepny(x) i dwa „wskaźniki”.',
            tags: ['funkcja w pętli', 'suma cyfr', 'gonienie mniejszego'],
            statement: ['Rzeka liczb zaczynająca się w k to ciąg: k, potem k + suma cyfr k, i tak dalej. Rzeka 32: 32, 37, 47, 58, … Dwie rzeki, które mają wspólną liczbę, od tego miejsca płyną już razem.',
                'Dla każdej pary rzek (startujących w a i w b) znajdź pierwszą wspólną liczbę. Napisz funkcję long long nastepny(long long x) i zawsze przesuwaj tę rzekę, która jest akurat niżej — aż się zrównają.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy liczby a i b.'],
            output_format: ['q wierszy: miejsce spotkania rzek.'],
            constraints: ['1 ≤ q ≤ 100', '1 ≤ a, b ≤ 10⁶', 'Rzeki z każdej pary na pewno się spotykają, w liczbie mniejszej niż 10⁹.'],
            examples: [{ input: '2\n32 47\n471 480', note: 'Rzeka 32 po dwóch krokach dochodzi do 47. Rzeka 471: 471, 483, 498, 519; rzeka 480: 480, 492, 507, 519.' }],
            hint: R`long long nastepny(long long x) { return x + sumaCyfr(x); }. Spotkanie: while (a != b) { if (a < b) a = nastepny(a); else b = nastepny(b); } — skoro rzeki płyną tylko w górę, rzeka niższa nie może przegapić wyższej, jeśli mają się spotkać.`,
            tests: (r) => {
                const nx = (x) => x + sumaCyfr(x);
                // Do testów bierzemy tylko pary, które spotykają się poniżej 2 · 10⁶ (pary, które się nie spotykają, odrzucamy szybko).
                const spot = (a, b) => { while (a !== b) { if (a < b) a = nx(a); else b = nx(b); if (a >= 2e6 || b >= 2e6) return null; } return a; };
                const para = (mx) => { for (;;) { const a = r.int(1, mx), b = r.int(1, mx); if (spot(a, b) !== null) return [a, b]; } };
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                return [d([[1, 1]]), d([[1, 2], [3, 6], [9, 18], [1000000, 999999]].filter(([a, b]) => spot(a, b) !== null)), d(Array.from({ length: 20 }, () => para(1000))), d(Array.from({ length: 100 }, () => para(1000000)))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 100) || t.length !== 2 * t[0] + 1 || !t.slice(1).every((x) => calk(x, 1, 1e6))) return 'dane'; const nx = (x) => x + sumaCyfr(x); for (let i = 1; i < t.length; i += 2) { let a = t[i], b = t[i + 1]; while (a !== b) { if (a < b) a = nx(a); else b = nx(b); if (a >= 1e7 || b >= 1e7) return 'nie spotykają się poniżej 10⁷'; } } return null; },
            solve: (inp) => { const t = nums(inp); const nx = (x) => x + sumaCyfr(x); const o = []; for (let i = 1; i < t.length; i += 2) { let a = t[i], b = t[i + 1]; while (a !== b) { if (a < b) a = nx(a); else b = nx(b); } o.push(a); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long sumaCyfr(long long x) {
    long long s = 0;
    while (x > 0) {
        s += x % 10;
        x /= 10;
    }
    return s;
}
long long nastepny(long long x) {
    return x + sumaCyfr(x);
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long a, b;
        cin >> a >> b;
        while (a != b) {
            if (a < b) a = nastepny(a);
            else b = nastepny(b);
        }
        cout << a << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-mastermind', krok: 9, level: 'srednie',
            title: 'Mastermind',
            short: 'Tajny kod z czterech cyfr i strzały gracza. Funkcja ocen(kod, strzal) zwraca parę: ile cyfr trafionych na swoim miejscu, a ile — nie na swoim.',
            tags: ['funkcja zwracająca pair', 'zliczanie cyfr', 'const string &'],
            statement: ['W grze Mastermind jeden gracz wymyśla kod z czterech cyfr od 1 do 6 (cyfry mogą się powtarzać), a drugi zgaduje. Po każdym strzale dostaje dwie liczby: czarne — ile cyfr stoi na dobrym miejscu, i białe — ile jeszcze cyfr strzału występuje w kodzie, ale na innym miejscu.',
                'Białe liczy się tak: dla każdej cyfry weź mniejszą z liczb jej wystąpień w kodzie i w strzale, dodaj te minima i odejmij czarne. Napisz pair<int, int> ocen(const string &kod, const string &strzal).'],
            input_format: ['W pierwszym wierszu tajny kod i n.', 'W każdym z n kolejnych wierszy jeden strzał.'],
            output_format: ['n wierszy: liczba czarnych i liczba białych.'],
            constraints: ['1 ≤ n ≤ 1000', 'Kod i strzały to napisy z 4 cyfr od 1 do 6.'],
            examples: [{ input: '1234 3\n1243\n5612\n1234', note: '1243: 1 i 2 na miejscach (2 czarne), 3 i 4 zamienione (2 białe). 5612: żadnej cyfry na miejscu, ale 1 i 2 są w kodzie — 2 białe.' }],
            hint: R`W ocen: int c = 0, ileK[7] = {}, ileS[7] = {}; for (int i = 0; i < 4; i++) { if (kod[i] == strzal[i]) c++; ileK[kod[i] - '0']++; ileS[strzal[i] - '0']++; } int w = 0; for (int d = 1; d <= 6; d++) w += min(ileK[d], ileS[d]); return {c, w - c};. W main: auto [c, b] = ocen(kod, s);.`,
            tests: (r) => {
                const d = (k, a) => `${k} ${a.length}\n${a.join('\n')}`;
                const k1 = losKod(r);
                return [d('1111', ['1111']), d('1122', ['2211', '1212', '3456', '1111', '2222', '1122']), d(losKod(r), Array.from({ length: 30 }, () => losKod(r))), d(k1, [...Array.from({ length: 999 }, () => losKod(r)), k1]), d('6543', r.shuffle(KODY).slice(0, 1000))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[1]); return /^[1-6]{4}$/.test(t[0]) && calk(n, 1, 1000) && t.length === n + 2 && t.slice(2).every((s) => /^[1-6]{4}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp); return t.slice(2).map((s) => ocen(t[0], s).join(' ')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
pair<int, int> ocen(const string &kod, const string &strzal) {
    int c = 0, ileK[7] = {}, ileS[7] = {};
    for (int i = 0; i < 4; i++) {
        if (kod[i] == strzal[i]) c++;
        ileK[kod[i] - '0']++;
        ileS[strzal[i] - '0']++;
    }
    int w = 0;
    for (int d = 1; d <= 6; d++) w += min(ileK[d], ileS[d]);
    return {c, w - c};
}
int main() {
    string kod;
    int n;
    cin >> kod >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        auto [c, b] = ocen(kod, s);
        cout << c << " " << b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-adres-ip', krok: 9, level: 'srednie',
            title: 'Poprawny adres IP',
            short: 'Cztery liczby od 0 do 255 oddzielone kropkami, bez zer z przodu. Funkcja dzieli napis po kropkach, druga ocenia jedną część, trzecia — cały adres.',
            tags: ['funkcja zwracająca vector<string>', 'funkcje bool', 'puste kawałki napisu'],
            statement: ['Adres IP (w wersji 4) to cztery części oddzielone kropkami, np. 192.168.0.1. Każda część to liczba od 0 do 255 zapisana od jednej do trzech cyfr i bez zer z przodu (0 jest dobre, 01 i 00 — nie). Pustych części nie ma.',
                'Dla każdego napisu wypisz TAK, jeśli jest poprawnym adresem, albo NIE. Napisz vector<string> podziel(const string &s) (dzieli po kropkach, zostawiając też puste kawałki), bool dobraCzesc(const string &p) i bool dobryAdres(const string &s).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy napis z cyfr i kropek.'],
            output_format: ['n wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 1000', 'Napisy mają od 1 do 20 znaków.'],
            examples: [{ input: '5\n192.168.0.1\n256.1.1.1\n10.01.0.1\n1.2.3\n1..2.3', note: '256 przekracza 255, 01 ma zero z przodu, 1.2.3 ma tylko trzy części, a 1..2.3 — pustą część.' }],
            hint: R`podziel: string cz = ""; for (char c : s) { if (c == '.') { w.push_back(cz); cz = ""; } else cz += c; } w.push_back(cz); — dzięki temu "1..2" daje trzy kawałki, w tym pusty. dobraCzesc: niepusta, najwyżej 3 cyfry, nie zaczyna się od 0, chyba że to samo "0", i stoi(p) <= 255. dobryAdres: dokładnie 4 kawałki i każdy dobry.`,
            tests: (r) => {
                const cz = () => { const p = r(); if (p < 0.7) return String(r.int(0, 255)); if (p < 0.8) return String(r.int(256, 999)); if (p < 0.9) return '0' + String(r.int(0, 99)); return ''; };
                const adr = () => { for (;;) { const k = r() < 0.8 ? 4 : r.pick([1, 2, 3, 5, 6]); const s = Array.from({ length: k }, () => (r() < 0.75 ? String(r.int(0, 255)) : cz())).join('.'); if (s.length >= 1 && s.length <= 20) return s; } };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['0.0.0.0']), d(['255.255.255.255', '255.255.255.256', '1.2.3.4.', '.1.2.3', '1.2.3.4.5', '00.0.0.0', '1.1.1.01', '1', '.', '...', '1234.1.1.1', '127.0.0.1']), d(Array.from({ length: 30 }, adr)), d(Array.from({ length: 1000 }, adr))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 1000) && t.length === n + 1 && t.slice(1).every((s) => /^[0-9.]{1,20}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => { const c = s.split('.'); return c.length === 4 && c.every((p) => /^(0|[1-9]\d{0,2})$/.test(p) && Number(p) <= 255) ? 'TAK' : 'NIE'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<string> podziel(const string &s) {
    vector<string> w;
    string cz = "";
    for (char c : s) {
        if (c == '.') {
            w.push_back(cz);
            cz = "";
        } else cz += c;
    }
    w.push_back(cz);
    return w;
}
bool dobraCzesc(const string &p) {
    if (p.empty() || p.size() > 3) return false;
    if (p[0] == '0' && p.size() > 1) return false;
    return stoi(p) <= 255;
}
bool dobryAdres(const string &s) {
    vector<string> c = podziel(s);
    if (c.size() != 4) return false;
    for (const string &p : c)
        if (!dobraCzesc(p)) return false;
    return true;
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        cout << (dobryAdres(s) ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-luhn', krok: 9, level: 'srednie',
            title: 'Algorytm Luhna',
            short: 'Tak bank sprawdza numer karty: co druga cyfra od końca razy dwa, suma podzielna przez 10. Dla błędnego numeru — jaka powinna być ostatnia cyfra.',
            tags: ['funkcja licząca sumę', 'funkcja bool', 'cyfra kontrolna'],
            statement: ['Numery kart płatniczych kończą się cyfrą kontrolną według algorytmu Luhna: idąc od prawej, co drugą cyfrę (drugą, czwartą, szóstą… od końca) mnożymy przez 2, a jeśli wyjdzie więcej niż 9 — odejmujemy 9. Potem sumujemy wszystkie cyfry (zmienione i niezmienione). Numer jest poprawny, gdy suma dzieli się przez 10.',
                'Dla każdego numeru wypisz POPRAWNY albo BLEDNY, ostatnia cyfra powinna byc d — gdzie d to jedyna cyfra, która wpisana na ostatnie miejsce dałaby poprawny numer. Napisz int sumaLuhna(const string &s) i funkcje, które z niej korzystają.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy numer (napis z cyfr).'],
            output_format: ['n wierszy z werdyktami.'],
            constraints: ['1 ≤ n ≤ 1000', 'Numery mają od 2 do 19 cyfr.'],
            examples: [{ input: '2\n79927398713\n79927398710', note: 'Pierwszy numer daje sumę 70 — jest poprawny. Drugi różni się tylko ostatnią cyfrą: zamiast 0 powinno być 3.' }],
            hint: R`int sumaLuhna(const string &s) { int suma = 0; for (int i = s.size() - 1, k = 0; i >= 0; i--, k++) { int c = s[i] - '0'; if (k % 2 == 1) { c *= 2; if (c > 9) c -= 9; } suma += c; } return suma; } — k liczy pozycje od końca od zera. Ostatnia cyfra nie jest podwajana, więc wystarczy policzyć sumę z ostatnią cyfrą równą 0: dobra cyfra to (10 − suma % 10) % 10.`,
            tests: (r) => {
                const suma = (s) => { let w = 0; for (let i = s.length - 1, k = 0; i >= 0; i--, k++) { let c = Number(s[i]); if (k % 2) { c *= 2; if (c > 9) c -= 9; } w += c; } return w; };
                const dobry = (n) => { const s = r.word(n - 1, '0123456789') + '0'; const c = (10 - (suma(s) % 10)) % 10; return s.slice(0, -1) + c; };
                const los = () => (r() < 0.5 ? dobry(r.int(2, 19)) : r.word(r.int(2, 19), '0123456789'));
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['00']), d(['79927398713', '79927398710', '4539578763621486', '1234567812345670', '18', '59', '9999999999999999999']), d(Array.from({ length: 30 }, los)), d(Array.from({ length: 1000 }, los))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 1000) && t.length === n + 1 && t.slice(1).every((s) => /^\d{2,19}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => {
                const suma = (s) => { let w = 0; for (let i = s.length - 1, k = 0; i >= 0; i--, k++) { let c = Number(s[i]); if (k % 2) { c *= 2; if (c > 9) c -= 9; } w += c; } return w; };
                return toks(inp).slice(1).map((s) => (suma(s) % 10 === 0 ? 'POPRAWNY' : `BLEDNY, ostatnia cyfra powinna byc ${(10 - (suma(s.slice(0, -1) + '0') % 10)) % 10}`)).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int sumaLuhna(const string &s) {
    int suma = 0;
    for (int i = (int)s.size() - 1, k = 0; i >= 0; i--, k++) {
        int c = s[i] - '0';
        if (k % 2 == 1) {
            c *= 2;
            if (c > 9) c -= 9;
        }
        suma += c;
    }
    return suma;
}
bool poprawny(const string &s) {
    return sumaLuhna(s) % 10 == 0;
}
int dobraCyfra(string s) {
    s.back() = '0';
    return (10 - sumaLuhna(s) % 10) % 10;
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        if (poprawny(s)) cout << "POPRAWNY\n";
        else cout << "BLEDNY, ostatnia cyfra powinna byc " << dobraCyfra(s) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-szyfr-plotkowy', krok: 9, level: 'srednie',
            title: 'Szyfr płotkowy',
            short: 'Tekst pisany zygzakiem na k „sztachetach” i odczytany wiersz po wierszu. Szyfrowanie i odszyfrowanie to dwie funkcje — a numer sztachety dla pozycji liczy trzecia.',
            tags: ['funkcje zwracające string', 'funkcja pomocnicza dla obu', 'zygzak'],
            statement: ['W szyfrze płotkowym z k sztachetami litery tekstu pisze się zygzakiem: pierwsza na sztachecie 0, następna na 1, … aż do k − 1, potem z powrotem w górę do 0, znowu w dół i tak dalej. Szyfrogram to litery ze sztachety 0, potem ze sztachety 1, …, na końcu z k − 1 (w każdej w kolejności z tekstu).',
                'Polecenie S k tekst — zaszyfruj; O k szyfrogram — odszyfruj. Napisz int sztacheta(int i, int k) (na której sztachecie stoi i-ta litera), string szyfruj(const string &s, int k) i string odszyfruj(const string &s, int k).'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy polecenie: S albo O, liczba k i napis z wielkich liter.'],
            output_format: ['q wierszy z wynikami.'],
            constraints: ['1 ≤ q ≤ 20', '2 ≤ k ≤ 10', 'Napisy mają od 1 do 1000 wielkich liter angielskich.'],
            examples: [{ input: '2\nS 3 WEAREDISCOVERED\nO 3 WECRERDSOEEAIVD', note: 'Sztacheta 0: W, E, C, R; sztacheta 1: E, R, D, S, O, E, E; sztacheta 2: A, I, V, D. Odszyfrowanie odtwarza tekst.' }],
            hint: R`int sztacheta(int i, int k) { int okres = 2 * (k - 1); int r = i % okres; return r < k ? r : okres - r; }. Szyfrowanie: dla s = 0..k−1 dopisz litery, dla których sztacheta(i, k) == s. Odszyfrowanie: ten sam porządek pozycji — przejdź s = 0..k−1 i i = 0..n−1, a kolejną literę szyfrogramu wstaw na pozycję i, gdy sztacheta(i, k) == s.`,
            tests: (r) => {
                const sz = (i, k) => { const o = 2 * (k - 1); const x = i % o; return x < k ? x : o - x; };
                const enc = (s, k) => { let w = ''; for (let a = 0; a < k; a++) for (let i = 0; i < s.length; i++) if (sz(i, k) === a) w += s[i]; return w; };
                const pol = () => { const k = r.int(2, 10); const s = r.word(r.int(1, 1000), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'); return r() < 0.5 ? `S ${k} ${s}` : `O ${k} ${enc(s, k)}`; };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['S 2 A']), d(['S 2 ALAMAKOTA', 'O 2 AAAOALMKT', 'S 10 ABC', 'O 4 PMERAOIORWNGA', 'S 4 PROGRAMOWANIE']), d(Array.from({ length: 8 }, pol)), d(Array.from({ length: 20 }, pol))];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); return calk(q, 1, 20) && L.length === q + 1 && L.slice(1).every((l) => { const m = l.match(/^[SO] (\d+) ([A-Z]{1,1000})$/); return m && calk(Number(m[1]), 2, 10); }) ? null : 'dane'; },
            solve: (inp) => {
                const sz = (i, k) => { const o = 2 * (k - 1); const x = i % o; return x < k ? x : o - x; };
                return linie(inp).slice(1).map((l) => {
                    const [c, ks, s] = l.split(' '); const k = Number(ks); const kol = []; for (let a = 0; a < k; a++) for (let i = 0; i < s.length; i++) if (sz(i, k) === a) kol.push(i);
                    if (c === 'S') return kol.map((i) => s[i]).join(''); const w = Array(s.length); kol.forEach((i, j) => { w[i] = s[j]; }); return w.join('');
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int sztacheta(int i, int k) {
    int okres = 2 * (k - 1);
    int r = i % okres;
    if (r < k) return r;
    return okres - r;
}
string szyfruj(const string &s, int k) {
    string w = "";
    for (int a = 0; a < k; a++)
        for (int i = 0; i < (int)s.size(); i++)
            if (sztacheta(i, k) == a) w += s[i];
    return w;
}
string odszyfruj(const string &s, int k) {
    string w(s.size(), ' ');
    int j = 0;
    for (int a = 0; a < k; a++)
        for (int i = 0; i < (int)s.size(); i++)
            if (sztacheta(i, k) == a) w[i] = s[j++];
    return w;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string c, s;
        int k;
        cin >> c >> k >> s;
        if (c == "S") cout << szyfruj(s, k) << "\n";
        else cout << odszyfruj(s, k) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-ulamki-egipskie', krok: 9, level: 'srednie',
            title: 'Ułamki egipskie',
            short: 'Egipcjanie zapisywali ułamki jako sumy różnych ułamków z jedynką w liczniku: 4/13 = 1/4 + 1/18 + 1/468. Zachłannie: zawsze największy taki ułamek, który się mieści.',
            tags: ['funkcja nwd', 'zaokrąglanie dzielenia w górę', 'pętla do zera'],
            statement: ['Każdy ułamek a/b mniejszy od 1 da się zapisać jako sumę różnych ułamków postaci 1/c. Metoda zachłanna: weź największy ułamek 1/c, który nie przekracza tego, co zostało (c to a/b zaokrąglone w górę, czyli najmniejsze c z c · a ≥ b), odejmij go i powtarzaj, aż nic nie zostanie.',
                'Napisz long long nwd(long long a, long long b) i long long wGore(long long b, long long a) (dzielenie b / a zaokrąglone w górę). Po każdym odejmowaniu skracaj ułamek.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy liczby a i b.'],
            output_format: ['q wierszy w formacie a/b = 1/c1 + 1/c2 + … (a i b tak jak w wejściu).'],
            constraints: ['1 ≤ q ≤ 300', '1 ≤ a < b ≤ 25'],
            examples: [{ input: '2\n4 13\n2 3', note: '4/13 − 1/4 = 3/52; 3/52 − 1/18 = 2/936 = 1/468. A 2/3 = 1/2 + 1/6.' }],
            hint: R`Pętla: while (a > 0) { long long c = wGore(b, a); wypisz 1/c; a = a * c - b; b = b * c; long long g = nwd(a, b); a /= g; b /= g; } — z a/b − 1/c = (a · c − b) / (b · c). wGore(b, a) to (b + a − 1) / a. Mianowniki szybko rosną (nawet do milionów), więc wszystko w long long.`,
            tests: (r) => {
                const wsz = []; for (let b = 2; b <= 25; b++) for (let a = 1; a < b; a++) wsz.push([a, b]);
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                return [d([[1, 2]]), d([[4, 17], [24, 25], [5, 25], [2, 4], [4, 25], [21, 23]]), d(Array.from({ length: 30 }, () => r.pick(wsz))), d(r.shuffle(wsz))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 300) && t.length === 2 * t[0] + 1 && t.slice(1).every((x, i, a) => (i % 2 === 0 ? calk(x, 1, 24) : calk(x, a[i - 1] + 1, 25))) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp).slice(1); const o = []; for (let i = 0; i < t.length; i += 2) { let a = BigInt(t[i]), b = BigInt(t[i + 1]); const cz = []; while (a > 0n) { const c = (b + a - 1n) / a; cz.push(`1/${c}`); a = a * c - b; b = b * c; const g = nwdBig(a, b); a /= g; b /= g; } o.push(`${t[i]}/${t[i + 1]} = ${cz.join(' + ')}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long nwd(long long a, long long b) {
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    return a;
}
long long wGore(long long b, long long a) {
    return (b + a - 1) / a;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long a, b;
        cin >> a >> b;
        cout << a << "/" << b << " =";
        bool pierwszy = true;
        while (a > 0) {
            long long c = wGore(b, a);
            if (!pierwszy) cout << " +";
            cout << " 1/" << c;
            pierwszy = false;
            a = a * c - b;
            b = b * c;
            long long g = nwd(a, b);
            a /= g;
            b /= g;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-ulamki-lancuchowe', krok: 9, level: 'srednie',
            title: 'Ułamek łańcuchowy w obie strony',
            short: '415/93 = [4; 2, 6, 7]. Jedna funkcja rozwija ułamek algorytmem Euklidesa w vector, druga zwija vector z powrotem w parę (licznik, mianownik).',
            tags: ['funkcja zwracająca vector', 'funkcja zwracająca pair', 'dwie funkcje odwrotne'],
            statement: ['Ułamek łańcuchowy [q₀; q₁, q₂, …, qₖ] to q₀ + 1 / (q₁ + 1 / (q₂ + … + 1 / qₖ)). Na przykład 415/93 = 4 + 43/93, 93/43 = 2 + 7/43, 43/7 = 6 + 1/7, 7/1 = 7, więc 415/93 = [4; 2, 6, 7] — to dokładnie kolejne ilorazy z algorytmu Euklidesa.',
                'Polecenie R a b — rozwiń a/b i wypisz [q₀; q₁, …] (sam [q₀], gdy jest tylko jeden wyraz). Polecenie Z k q₀ … qₖ₋₁ — zwiń i wypisz ułamek p/q w postaci nieskracalnej. Napisz vector<long long> rozwin(long long a, long long b) i pair<long long, long long> zwin(const vector<long long> &q).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy jedno polecenie.'],
            output_format: ['n wierszy z wynikami.'],
            constraints: ['1 ≤ n ≤ 1000', 'R: 1 ≤ a, b ≤ 10⁹', 'Z: 1 ≤ k ≤ 10, 0 ≤ q₀ ≤ 50, 1 ≤ qᵢ ≤ 50 dla i ≥ 1'],
            examples: [{ input: '3\nR 415 93\nZ 4 4 2 6 7\nR 6 3', note: 'Zwinięcie [4; 2, 6, 7] daje z powrotem 415/93. 6/3 = 2 — jeden wyraz.' }],
            hint: R`rozwin: while (b != 0) { w.push_back(a / b); long long r = a % b; a = b; b = r; }. zwin od końca: p = q[k−1], m = 1; potem dla i = k−2 … 0: nowe p = q[i] · p + m, nowe m = stare p (bo q[i] + 1/(p/m) = (q[i] · p + m) / p). Tak liczony ułamek wychodzi od razu nieskracalny.`,
            tests: (r) => {
                const pol = () => { if (r() < 0.5) return `R ${r.int(1, r.pick([100, 1000000000]))} ${r.int(1, r.pick([100, 1000000000]))}`; const k = r.int(1, 10); return `Z ${k} ${[r.int(0, 50), ...r.arr(k - 1, 1, r.pick([3, 50]))].join(' ')}`; };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['R 1 1']), d(['R 1 1000000000', 'R 1000000000 1', 'R 832040 514229', 'Z 1 0', 'Z 10 50 50 50 50 50 50 50 50 50 50', 'Z 2 0 1', 'Z 3 1 1 1']), d(Array.from({ length: 40 }, pol)), d(Array.from({ length: 1000 }, pol))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 1000) && L.length === n + 1 && L.slice(1).every((l) => { const t = l.split(' '); if (t[0] === 'R') return t.length === 3 && calk(Number(t[1]), 1, 1e9) && calk(Number(t[2]), 1, 1e9); if (t[0] !== 'Z') return false; const k = Number(t[1]); return calk(k, 1, 10) && t.length === k + 2 && calk(Number(t[2]), 0, 50) && t.slice(3).every((x) => calk(Number(x), 1, 50)); }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => {
                const t = l.split(' ');
                if (t[0] === 'R') { let a = BigInt(t[1]), b = BigInt(t[2]); const w = []; while (b !== 0n) { w.push(a / b); [a, b] = [b, a % b]; } return w.length === 1 ? `[${w[0]}]` : `[${w[0]}; ${w.slice(1).join(', ')}]`; }
                const q = t.slice(2).map(BigInt); let p = q[q.length - 1], m = 1n; for (let i = q.length - 2; i >= 0; i--) [p, m] = [q[i] * p + m, p]; return `${p}/${m}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<long long> rozwin(long long a, long long b) {
    vector<long long> w;
    while (b != 0) {
        w.push_back(a / b);
        long long r = a % b;
        a = b;
        b = r;
    }
    return w;
}
pair<long long, long long> zwin(const vector<long long> &q) {
    long long p = q.back(), m = 1;
    for (int i = (int)q.size() - 2; i >= 0; i--) {
        long long nowe = q[i] * p + m;
        m = p;
        p = nowe;
    }
    return {p, m};
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string c;
        cin >> c;
        if (c == "R") {
            long long a, b;
            cin >> a >> b;
            vector<long long> w = rozwin(a, b);
            cout << "[" << w[0];
            for (int j = 1; j < (int)w.size(); j++) cout << (j == 1 ? "; " : ", ") << w[j];
            cout << "]\n";
        } else {
            int k;
            cin >> k;
            vector<long long> q(k);
            for (int j = 0; j < k; j++) cin >> q[j];
            auto [p, m] = zwin(q);
            cout << p << "/" << m << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-pilka-w-pudelku', krok: 9, level: 'srednie',
            title: 'Piłka w pudełku',
            short: 'Piłka odbija się od ścian przez 10¹⁸ sekund. Zamiast symulować — jedna funkcja odbij(p, L), która „składa” prostą drogę w odbicia. Wywołana raz dla x, raz dla y.',
            tags: ['jedna funkcja dla dwóch osi', 'modulo z ujemnymi', 'olbrzymi czas'],
            statement: ['W prostokątnym pudełku o szerokości W i wysokości H (punkty od (0, 0) do (W, H)) leci piłka. Startuje z punktu (x, y) i co sekundę przesuwa się o vx w poziomie i o vy w pionie (każde to 1 albo −1). Od ścian odbija się idealnie, jak światło od lustra. Gdzie będzie po t sekundach?',
                'W poziomie i w pionie dzieje się to samo, niezależnie. Gdyby ścian nie było, piłka byłaby w x + vx · t. Odbicia „składają” tę prostą drogę: ruch powtarza się co 2W, a w drugiej połowie okresu piłka wraca. Napisz long long odbij(long long p, long long L) i użyj jej dla obu osi.'],
            input_format: ['W pierwszym wierszu W, H i q.', 'W każdym z q kolejnych wierszy: x, y, vx, vy i t.'],
            output_format: ['q wierszy: współrzędne piłki po t sekundach.'],
            constraints: ['1 ≤ W, H ≤ 10⁹, 1 ≤ q ≤ 1000', '0 ≤ x ≤ W, 0 ≤ y ≤ H, vx, vy ∈ {−1, 1}', '0 ≤ t ≤ 10¹⁸'],
            examples: [{ input: '10 5 2\n0 0 1 1 3\n9 4 1 1 3', note: 'Pierwsza piłka nie dolatuje do ścian: (3, 3). Druga: w poziomie 9 + 3 = 12, czyli 2 za ścianą W = 10 — wraca do 8; w pionie 4 + 3 = 7, czyli 2 za ścianą H = 5 — wraca do 3.' }],
            hint: R`long long odbij(long long p, long long L) { long long okres = 2 * L; p %= okres; if (p < 0) p += okres; if (p > L) p = okres - p; return p; }. W main: cout << odbij(x + vx * t, W) << " " << odbij(y + vy * t, H);. Reszta z dzielenia liczby ujemnej jest w C++ ujemna — stąd poprawka if (p < 0).`,
            tests: (r) => {
                const T = () => (r() < 0.3 ? r.big(0, 1000n) : r.big(0, 10n ** 18n));
                const d = (W, H, a) => `${W} ${H} ${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = (W, H, q) => Array.from({ length: q }, () => [r.int(0, W), r.int(0, H), r.pick([-1, 1]), r.pick([-1, 1]), String(T())]);
                return [d(1, 1, [[0, 0, 1, 1, '0']]), d(10, 5, [[0, 0, -1, -1, '1'], [10, 5, 1, 1, '1'], [3, 2, 1, -1, '20'], [0, 0, 1, 1, '1000000000000000000'], [10, 5, -1, -1, '999999999999999999']]), d(7, 3, los(7, 3, 30)), d(1000000000, 999999937, los(1000000000, 999999937, 1000)), d(1, 2, los(1, 2, 1000))];
            },
            check: (inp) => { const L = linie(inp); const [W, H, q] = L[0].split(' ').map(Number); if (!calk(W, 1, 1e9) || !calk(H, 1, 1e9) || !calk(q, 1, 1000) || L.length !== q + 1) return 'W H q'; return L.slice(1).every((l) => { const t = l.split(' '); return t.length === 5 && calk(Number(t[0]), 0, W) && calk(Number(t[1]), 0, H) && ['1', '-1'].includes(t[2]) && ['1', '-1'].includes(t[3]) && /^\d{1,19}$/.test(t[4]) && BigInt(t[4]) <= 10n ** 18n; }) ? null : 'piłka'; },
            solve: (inp) => {
                const L = linie(inp); const [W, H] = L[0].split(' ').map(BigInt);
                const odb = (p, Lg) => { const o = 2n * Lg; p %= o; if (p < 0n) p += o; if (p > Lg) p = o - p; return p; };
                return L.slice(1).map((l) => { const [x, y, vx, vy, t] = l.split(' ').map(BigInt); return `${odb(x + vx * t, W)} ${odb(y + vy * t, H)}`; }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long odbij(long long p, long long L) {
    long long okres = 2 * L;
    p %= okres;
    if (p < 0) p += okres;
    if (p > L) p = okres - p;
    return p;
}
int main() {
    long long W, H;
    int q;
    cin >> W >> H >> q;
    for (int i = 0; i < q; i++) {
        long long x, y, vx, vy, t;
        cin >> x >> y >> vx >> vy >> t;
        cout << odbij(x + vx * t, W) << " " << odbij(y + vy * t, H) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-weze-i-drabiny', krok: 9, level: 'srednie',
            title: 'Węże i drabiny',
            short: 'Gracze rzucają kostką, drabiny wynoszą w górę, węże ściągają w dół, a na pole 100 trzeba trafić dokładnie. Funkcja ruch(pole, rzut) robi cały jeden ruch.',
            tags: ['symulacja gry', 'globalna tablica skoków', 'funkcja zwracająca nowe pole'],
            statement: ['Plansza ma pola od 1 do 100, a gracze (od 2 do 4) zaczynają poza planszą — na polu 0. Rzucają po kolei: gracz 1, 2, …, p, znowu 1 i tak dalej. Ruch: nowe pole = pole + rzut; jeśli to więcej niż 100, gracz zostaje, gdzie był. Jeśli gracz stanie na początku drabiny albo na głowie węża, od razu przenosi się na jej koniec (ogon węża).',
                'Wygrywa ten, kto pierwszy stanie dokładnie na polu 100 — wypisz Gracz g wygrywa w rzucie j (j to numer rzutu w całej grze, od 1). Dalsze rzuty się nie liczą. Jeśli rzuty się skończą, wypisz Nikt nie wygral: i pola wszystkich graczy. Napisz int ruch(int pole, int rzut) korzystającą z globalnej tablicy skok[101].'],
            input_format: ['W pierwszym wierszu p i s — liczba graczy oraz liczba węży i drabin.', 'W każdym z s kolejnych wierszy a i b: z pola a przenosimy się na pole b.', 'Potem wiersz z n i wiersz z n rzutami.'],
            output_format: ['Jeden wiersz z wynikiem gry.'],
            constraints: ['2 ≤ p ≤ 4, 0 ≤ s ≤ 20', '2 ≤ a ≤ 99, 1 ≤ b ≤ 100, a ≠ b; wszystkie a są różne i żadne b nie jest początkiem innego węża ani drabiny.', '1 ≤ n ≤ 10⁴, każdy rzut od 1 do 6'],
            examples: [{ input: '2 2\n4 100\n50 5\n4\n1 2 3 6', note: 'Gracz 1: pole 1, gracz 2: pole 2, gracz 1 rzuca 3, staje na 4 i drabina wnosi go na 100 — wygrywa w trzecim rzucie.' },
                { input: '2 1\n3 22\n6\n2 6 1 6 4 3', note: 'Gracz 1: 2, potem 3 → drabina na 22, potem 26. Gracz 2: 6, 12, 15. Rzuty się skończyły.' }],
            hint: R`int ruch(int pole, int rzut) { int nowe = pole + rzut; if (nowe > 100) return pole; if (skok[nowe] != 0) nowe = skok[nowe]; return nowe; }. Pola graczy trzymaj w vector<int> pole(p, 0);. Gracz, który rzuca j-ty rzut (od 0), to j % p. Wyzeruj skok przed wczytaniem węży i drabin.`,
            tests: (r) => {
                const plansza = (s) => { const A = new Set(), B = new Set(); const o = []; let prob = 0; while (o.length < s && prob++ < 10000) { const a = r.int(2, 99); let b = r() < 0.5 ? r.int(a + 1, 100) : r.int(1, a - 1); if (b === a || A.has(a) || A.has(b) || B.has(a)) continue; if (a === 100) continue; A.add(a); B.add(b); o.push([a, b]); } return o; };
                const gra = (p, s, n) => { const pl = plansza(s); return `${p} ${pl.length}\n${pl.map(([a, b]) => `${a} ${b}`).join('\n')}${pl.length ? '\n' : ''}${n}\n${r.arr(n, 1, 6).join(' ')}`; };
                return ['2 0\n1\n6', '4 1\n99 100\n4\n6 6 6 6', gra(2, 5, 30), gra(3, 20, 200), gra(4, 20, 10000), gra(2, 0, 10000), gra(4, 15, 40)];
            },
            check: (inp) => {
                const L = linie(inp); const [p, s] = L[0].split(' ').map(Number); if (!calk(p, 2, 4) || !calk(s, 0, 20)) return 'p s';
                const A = new Set(), B = []; for (const l of L.slice(1, 1 + s)) { const [a, b] = l.split(' ').map(Number); if (!calk(a, 2, 99) || !calk(b, 1, 100) || a === b || A.has(a)) return 'skok'; A.add(a); B.push(b); }
                if (B.some((b) => A.has(b))) return 'łańcuch'; const n = Number(L[1 + s]); const R2 = (L[2 + s] || '').split(' ').map(Number);
                return calk(n, 1, 1e4) && R2.length === n && R2.every((x) => calk(x, 1, 6)) && L.length === s + 3 ? null : 'rzuty';
            },
            solve: (inp) => {
                const L = linie(inp); const [p, s] = L[0].split(' ').map(Number); const sk = new Array(101).fill(0);
                for (const l of L.slice(1, 1 + s)) { const [a, b] = l.split(' ').map(Number); sk[a] = b; }
                const R2 = L[2 + s].split(' ').map(Number); const pos = new Array(p).fill(0);
                for (let j = 0; j < R2.length; j++) { const g = j % p; let nw = pos[g] + R2[j]; if (nw <= 100) { if (sk[nw]) nw = sk[nw]; pos[g] = nw; } if (pos[g] === 100) return `Gracz ${g + 1} wygrywa w rzucie ${j + 1}`; }
                return `Nikt nie wygral: ${pos.join(' ')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int skok[101];
int ruch(int pole, int rzut) {
    int nowe = pole + rzut;
    if (nowe > 100) return pole;
    if (skok[nowe] != 0) nowe = skok[nowe];
    return nowe;
}
int main() {
    for (int i = 0; i <= 100; i++) skok[i] = 0;
    int p, s;
    cin >> p >> s;
    for (int i = 0; i < s; i++) {
        int a, b;
        cin >> a >> b;
        skok[a] = b;
    }
    int n;
    cin >> n;
    vector<int> rzuty(n);
    for (int i = 0; i < n; i++) cin >> rzuty[i];
    vector<int> pole(p, 0);
    for (int j = 0; j < n; j++) {
        int g = j % p;
        pole[g] = ruch(pole[g], rzuty[j]);
        if (pole[g] == 100) {
            cout << "Gracz " << g + 1 << " wygrywa w rzucie " << j + 1 << "\n";
            return 0;
        }
    }
    cout << "Nikt nie wygral:";
    for (int x : pole) cout << " " << x;
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ TRUDNE
        {
            id: 'fun-b-dni-robocze', krok: 9, level: 'trudne',
            title: 'Dni robocze',
            short: 'Ile poniedziałków–piątków jest między dwiema datami, nawet odległymi o tysiące lat? Numer dnia z części 8 i funkcja robocze(n) — bez liczenia dzień po dniu.',
            tags: ['rozbijanie zadania na funkcje', 'wzór zamiast pętli', 'dzień tygodnia z numeru dnia'],
            statement: ['Policz dni robocze (od poniedziałku do piątku) między dwiema datami — obie daty wliczają się do przedziału, a mogą być podane w dowolnej kolejności. Świąt nie uwzględniamy.',
                'Wskazówka do kalendarza: jeśli dni numerujemy od 1 stycznia roku 1 (w kalendarzu gregoriańskim liczonym wstecz) jako dnia numer 1, to dzień numer 1 był poniedziałkiem — więc dni o numerach 1–5 każdego tygodnia (licząc po 7 od początku) są robocze. Napisz long long numerDnia(int d, int m, int r) oraz long long robocze(long long n) — liczbę dni roboczych wśród dni o numerach od 1 do n.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy dwie daty: d₁ m₁ r₁ d₂ m₂ r₂.'],
            output_format: ['q wierszy: liczba dni roboczych w przedziale.'],
            constraints: ['1 ≤ q ≤ 1000', 'Daty są poprawne, lata od 1 do 9999.'],
            examples: [{ input: '3\n20 11 2026 20 11 2026\n16 11 2026 22 11 2026\n22 11 2026 16 11 2026', note: '20 listopada 2026 to piątek — 1 dzień roboczy. Od poniedziałku 16 do niedzieli 22 listopada jest ich 5, w obie strony.' }],
            hint: R`robocze(n) = 5 · (n / 7) + min(n % 7, 5) — pełne tygodnie dają po 5 dni, a z niepełnego liczą się najwyżej pierwsze 5 dni. Odpowiedź to robocze(b) - robocze(a - 1), gdzie a ≤ b to numery dni. Przedział może mieć miliony dni, a pytań jest tysiąc — liczenie dzień po dniu byłoby za wolne.`,
            tests: (r) => {
                const data = (lo, hi) => { for (;;) { const rr = r.int(lo, hi), m = r.int(1, 12), d = r.int(1, 31); if (czyPoprawnaData(d, m, rr)) return [d, m, rr]; } };
                const d = (a) => `${a.length}\n${a.map((x) => x.flat().join(' ')).join('\n')}`;
                return [d([[[1, 1, 1], [1, 1, 1]]]), d([[[1, 1, 1], [31, 12, 9999]], [[7, 1, 1], [6, 1, 1]], [[21, 11, 2026], [22, 11, 2026]], [[20, 11, 2026], [23, 11, 2026]], [[29, 2, 2024], [1, 3, 2024]]]), d(Array.from({ length: 40 }, () => { const a = data(2020, 2030); return [a, r() < 0.5 ? a : data(2020, 2030)]; })), d(Array.from({ length: 1000 }, () => [data(1, 9999), data(1, 9999)]))];
            },
            check: (inp) => { const t = nums(inp); if (!calk(t[0], 1, 1000) || t.length !== 6 * t[0] + 1) return 'q'; for (let i = 1; i < t.length; i += 3) if (!czyPoprawnaData(t[i], t[i + 1], t[i + 2]) || t[i + 2] > 9999) return 'data'; return null; },
            solve: (inp) => {
                const t = nums(inp); const rob = (n) => 5 * Math.floor(n / 7) + Math.min(n % 7, 5); const o = [];
                for (let i = 1; i < t.length; i += 6) { let a = numerDnia(t[i], t[i + 1], t[i + 2]), b = numerDnia(t[i + 3], t[i + 4], t[i + 5]); if (a > b) [a, b] = [b, a]; o.push(rob(b) - rob(a - 1)); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool przestepny(int r) {
    return (r % 4 == 0 && r % 100 != 0) || r % 400 == 0;
}
int dniWMiesiacu(int m, int r) {
    if (m == 2) return przestepny(r) ? 29 : 28;
    if (m == 4 || m == 6 || m == 9 || m == 11) return 30;
    return 31;
}
long long numerDnia(int d, int m, int r) {
    long long y = r - 1;
    long long n = y * 365 + y / 4 - y / 100 + y / 400;
    for (int i = 1; i < m; i++) n += dniWMiesiacu(i, r);
    return n + d;
}
long long robocze(long long n) {
    return 5 * (n / 7) + min(n % 7, 5LL);
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int d1, m1, r1, d2, m2, r2;
        cin >> d1 >> m1 >> r1 >> d2 >> m2 >> r2;
        long long a = numerDnia(d1, m1, r1), b = numerDnia(d2, m2, r2);
        if (a > b) swap(a, b);
        cout << robocze(b) - robocze(a - 1) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-ksiazki', krok: 9, level: 'trudne',
            title: 'Przepisywanie książek',
            short: 'n książek, k skrybów, każdy dostaje kolejne tomy. Jak najmniejsza praca najbardziej zajętego? Funkcja daSie(limit) i wyszukiwanie binarne po odpowiedzi.',
            tags: ['funkcja-pytanie bool', 'wyszukiwanie binarne po wyniku', 'zachłanne sprawdzanie'],
            statement: ['W klasztorze trzeba przepisać n książek stojących w rzędzie; i-ta ma pᵢ stron. Jest k skrybów. Każdy dostaje spójny kawałek rzędu (kilka kolejnych książek, co najmniej jedną), a każda książka trafia do dokładnie jednego skryby.',
                'Podziel książki tak, żeby najbardziej obciążony skryba miał jak najmniej stron, i wypisz tę liczbę. Napisz bool daSie(const vector<long long> &p, int k, long long limit) — czy da się podzielić książki tak, żeby nikt nie dostał więcej niż limit stron — i znajdź najmniejszy dobry limit wyszukiwaniem binarnym.'],
            input_format: ['W pierwszym wierszu n i k.', 'W drugim wierszu n liczb pᵢ.'],
            output_format: ['Jedna liczba — najmniejsze możliwe obciążenie najbardziej zajętego skryby.'],
            constraints: ['1 ≤ k ≤ n ≤ 10⁴', '1 ≤ pᵢ ≤ 10⁵'],
            examples: [{ input: '5 2\n10 20 30 40 50', note: 'Podział 10 20 30 | 40 50 daje 60 i 90 stron. Każdy inny podział daje komuś więcej niż 90 (np. 10 20 30 40 | 50 to 100).' }],
            hint: R`daSie: idź po książkach i dokładaj je obecnemu skrybie; gdy następna przekroczyłaby limit — zacznij nowego skrybę. Jeśli wystarczy najwyżej k skrybów (i żadna książka sama nie przekracza limitu), odpowiedź brzmi tak. Im większy limit, tym łatwiej, więc szukaj binarnie między największą książką a sumą wszystkich.`,
            tests: (r) => {
                const d = (k, a) => `${a.length} ${k}\n${a.join(' ')}`;
                return [d(1, [7]), d(3, [5, 5, 5]), d(1, [1, 2, 3]), d(2, [100000, 1, 1, 1, 100000]), d(4, r.arr(20, 1, 100)), d(r.int(1, 100), r.arr(10000, 1, 100000)), d(10000, r.arr(10000, 1, 100000)), d(7, r.arr(10000, 99000, 100000)), d(1000, r.arr(10000, 1, 10))];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 1e4) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e5)) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const k = t[1]; const p = t.slice(2);
                const da = (L) => { let c = 1, s = 0; for (const x of p) { if (x > L) return false; if (s + x > L) { c++; s = x; } else s += x; } return c <= k; };
                let lo = Math.max(...p), hi = p.reduce((a, b) => a + b, 0); while (lo < hi) { const m = Math.floor((lo + hi) / 2); if (da(m)) hi = m; else lo = m + 1; } return String(lo);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bool daSie(const vector<long long> &p, int k, long long limit) {
    int skrybowie = 1;
    long long teraz = 0;
    for (long long x : p) {
        if (x > limit) return false;
        if (teraz + x > limit) {
            skrybowie++;
            teraz = x;
        } else teraz += x;
    }
    return skrybowie <= k;
}
int main() {
    int n, k;
    cin >> n >> k;
    vector<long long> p(n);
    long long lo = 0, hi = 0;
    for (int i = 0; i < n; i++) {
        cin >> p[i];
        lo = max(lo, p[i]);
        hi += p[i];
    }
    while (lo < hi) {
        long long s = (lo + hi) / 2;
        if (daSie(p, k, s)) hi = s;
        else lo = s + 1;
    }
    cout << lo << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-b-general', krok: 9, level: 'trudne',
            title: 'Generał w kości',
            short: 'Pięć kości i trzynaście kategorii punktowania — od jedynek po generała. Funkcja punkty(kosci, kategoria) i mniejsze funkcje-pomocnicy: ile razy wypadło, full, strit.',
            tags: ['wiele małych funkcji', 'const vector<int> &', 'wybór najlepszej opcji'],
            statement: ['W grze w generała rzuca się pięcioma kośćmi i wybiera kategorię. Punkty: JEDYNKI, DWOJKI, TROJKI, CZWORKI, PIATKI, SZOSTKI — suma kości z tą liczbą oczek; TRZY — suma wszystkich kości, jeśli jakaś liczba oczek wypadła co najmniej 3 razy (inaczej 0); CZTERY — tak samo dla co najmniej 4 razy; FULL — 25 za trzy jednakowe i dwie inne jednakowe; MALYSTRIT — 30 za cztery kolejne liczby (1–4, 2–5 albo 3–6); DUZYSTRIT — 40 za pięć kolejnych; GENERAL — 50 za pięć jednakowych; SZANSA — suma wszystkich kości.',
                'Dla każdego rzutu wypisz najlepiej punktowaną kategorię i jej punkty. Przy remisie wybierz kategorię wymienioną wcześniej (w kolejności z listy powyżej). Napisz int ile(const vector<int> &k, int oczka), int punkty(const vector<int> &k, int kategoria) i funkcje-pomocniki dla fulla i stritów.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy pięć liczb od 1 do 6.'],
            output_format: ['t wierszy: nazwa kategorii i liczba punktów.'],
            constraints: ['1 ≤ t ≤ 1000'],
            examples: [{ input: '4\n1 1 1 2 2\n2 3 4 5 6\n6 6 6 5 5\n1 3 4 2 6', note: 'Full za 25 bije trójkę (7). Duży strit to 40. W 6 6 6 5 5 trójka daje 28 — więcej niż full; szansa też daje 28, ale stoi dalej na liście. W ostatnim rzucie są 1, 2, 3, 4 — mały strit.' }],
            hint: R`Trzymaj nazwy w tablicy string NAZWY[13] = {"JEDYNKI", …, "SZANSA"}; i napisz punkty(k, nr) z if-ami po numerze kategorii. Najlepsza: int naj = 0; for (int c = 1; c < 13; c++) if (punkty(k, c) > punkty(k, naj)) naj = c; — znak > zostawia wcześniejszą przy remisie. Mały strit: sprawdź trzy możliwe początki 1, 2 i 3 funkcją bool maKolejne(k, od, dl).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const wsz = []; for (let a = 1; a <= 6; a++) for (let b = a; b <= 6; b++) for (let c = b; c <= 6; c++) for (let e = c; e <= 6; e++) for (let f = e; f <= 6; f++) wsz.push(r.shuffle([a, b, c, e, f]));
                return [d([[1, 1, 1, 1, 1]]), d([[1, 2, 3, 4, 5], [6, 5, 4, 3, 2], [1, 2, 3, 4, 4], [3, 3, 3, 3, 2], [2, 2, 3, 3, 3], [6, 6, 6, 6, 6], [1, 1, 2, 2, 3]]), d(wsz), d(Array.from({ length: 1000 }, () => r.arr(5, 1, 6)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === 5 * t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 6)) ? null : 'dane'; },
            solve: (inp) => {
                const N = ['JEDYNKI', 'DWOJKI', 'TROJKI', 'CZWORKI', 'PIATKI', 'SZOSTKI', 'TRZY', 'CZTERY', 'FULL', 'MALYSTRIT', 'DUZYSTRIT', 'GENERAL', 'SZANSA'];
                const t = nums(inp); const o = [];
                for (let i = 1; i < t.length; i += 5) {
                    const k = t.slice(i, i + 5); const c = Array(7).fill(0); for (const x of k) c[x]++; const s = k.reduce((a, b) => a + b, 0); const mx = Math.max(...c);
                    const kol = (od, dl) => { for (let x = od; x < od + dl; x++) if (!c[x]) return false; return true; };
                    const p = [1, 2, 3, 4, 5, 6].map((f) => c[f] * f).concat([mx >= 3 ? s : 0, mx >= 4 ? s : 0, c.includes(3) && c.includes(2) ? 25 : 0, kol(1, 4) || kol(2, 4) || kol(3, 4) ? 30 : 0, kol(1, 5) || kol(2, 5) ? 40 : 0, mx === 5 ? 50 : 0, s]);
                    let b = 0; for (let j = 1; j < 13; j++) if (p[j] > p[b]) b = j; o.push(`${N[b]} ${p[b]}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string NAZWY[13] = {"JEDYNKI", "DWOJKI", "TROJKI", "CZWORKI", "PIATKI", "SZOSTKI", "TRZY", "CZTERY", "FULL", "MALYSTRIT", "DUZYSTRIT", "GENERAL", "SZANSA"};
int ile(const vector<int> &k, int oczka) {
    int w = 0;
    for (int x : k)
        if (x == oczka) w++;
    return w;
}
int suma(const vector<int> &k) {
    int s = 0;
    for (int x : k) s += x;
    return s;
}
int najwiecejTakich(const vector<int> &k) {
    int w = 0;
    for (int o = 1; o <= 6; o++) w = max(w, ile(k, o));
    return w;
}
bool full(const vector<int> &k) {
    bool trzy = false, dwa = false;
    for (int o = 1; o <= 6; o++) {
        if (ile(k, o) == 3) trzy = true;
        if (ile(k, o) == 2) dwa = true;
    }
    return trzy && dwa;
}
bool maKolejne(const vector<int> &k, int od, int dl) {
    for (int o = od; o < od + dl; o++)
        if (ile(k, o) == 0) return false;
    return true;
}
int punkty(const vector<int> &k, int kat) {
    if (kat < 6) return ile(k, kat + 1) * (kat + 1);
    if (kat == 6) return najwiecejTakich(k) >= 3 ? suma(k) : 0;
    if (kat == 7) return najwiecejTakich(k) >= 4 ? suma(k) : 0;
    if (kat == 8) return full(k) ? 25 : 0;
    if (kat == 9) return (maKolejne(k, 1, 4) || maKolejne(k, 2, 4) || maKolejne(k, 3, 4)) ? 30 : 0;
    if (kat == 10) return (maKolejne(k, 1, 5) || maKolejne(k, 2, 5)) ? 40 : 0;
    if (kat == 11) return najwiecejTakich(k) == 5 ? 50 : 0;
    return suma(k);
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        vector<int> k(5);
        for (int j = 0; j < 5; j++) cin >> k[j];
        int naj = 0;
        for (int c = 1; c < 13; c++)
            if (punkty(k, c) > punkty(k, naj)) naj = c;
        cout << NAZWY[naj] << " " << punkty(k, naj) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-szach', krok: 9, level: 'trudne',
            title: 'Szach!',
            short: 'Na szachownicy kilka figur. Czy któryś król jest atakowany? Osobne funkcje na skoczka, pionka, króla i figury „dalekiego zasięgu”, którym inne figury mogą zasłonić drogę.',
            tags: ['rozbijanie zadania na funkcje', 'kierunki dr, dc', 'promień z zasłanianiem'],
            statement: ['Szachownica ma 8 wierszy po 8 pól (wiersz 0 na górze). Pole puste to kropka. Figury białe to wielkie litery, czarne — małe: K — król, H — hetman, W — wieża, G — goniec, S — skoczek, P — pion. Na planszy jest dokładnie jeden biały i jeden czarny król.',
                'Wieża atakuje w pionie i poziomie, goniec po skosach, hetman na oba sposoby — każde z nich aż do pierwszej figury na drodze (tę figurę też atakuje). Skoczek atakuje pola o ruch „literą L”, król — 8 sąsiednich pól. Biały pion atakuje dwa pola po skosie w górę (wiersz o 1 mniejszy), czarny — po skosie w dół.',
                'Dla każdej planszy wypisz BIALY, jeśli atakowany jest tylko biały król, CZARNY — tylko czarny, OBA albo BRAK. Napisz bool atakowane(int r, int c, bool przezBiale) i pomocnicze funkcje.'],
            input_format: ['W pierwszym wierszu t.', 'Każda plansza to 8 wierszy po 8 znaków.'],
            output_format: ['t wierszy z odpowiedziami.'],
            constraints: ['1 ≤ t ≤ 100'],
            examples: [{ input: '2\n....k...\n........\n..G.....\n........\n........\n........\n........\n....K...\n....k...\n....w...\n........\n........\n....P...\n........\n........\n....K...', note: 'Na pierwszej planszy biały goniec atakuje czarnego króla po skosie. Na drugiej czarna wieża patrzy w dół kolumny, ale zasłania ją biały pion — nikt nie jest szachowany.' }],
            hint: R`bool promien(int r, int c, int dr, int dc, char a, char b) { r += dr; c += dc; while (naPlanszy(r, c)) { if (p[r][c] != '.') return p[r][c] == a || p[r][c] == b; r += dr; c += dc; } return false; } — pierwsza figura na drodze decyduje. Dla ataku białych: wieża/hetman w 4 prostych kierunkach to promien(…, 'W', 'H'), goniec/hetman po skosach — promien(…, 'G', 'H'). Biały pion atakuje pole (r, c), jeśli stoi na (r + 1, c ± 1).`,
            tests: (r) => {
                const FIG = 'HWGSP';
                const plansza = (ile) => { const b = Array.from({ length: 8 }, () => Array(8).fill('.')); const wolne = () => { for (;;) { const x = r.int(0, 7), y = r.int(0, 7); if (b[x][y] === '.') return [x, y]; } }; let [x, y] = wolne(); b[x][y] = 'K'; [x, y] = wolne(); b[x][y] = 'k'; for (let i = 0; i < ile; i++) { const f = r.pick(FIG); [x, y] = wolne(); if (f === 'P' && (x === 0 || x === 7)) continue; b[x][y] = r() < 0.5 ? f : f.toLowerCase(); } return b.map((w) => w.join('')).join('\n'); };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['K.......\n........\n........\n........\n........\n........\n........\n.......k']), d(['....k...\n....P...\n........\n........\n........\n........\n........\n....K...', '....k...\n...P....\n........\n........\n........\n........\n........\nK.......', 'k.......\n.K......\n........\n........\n........\n........\n........\n........', '........\n........\n...s....\n........\n....K...\n........\n........\nk.......', 'k......H\n........\n........\n........\n........\n........\n........\nK......h', '.......k\n......p.\n.....K..\n........\n........\n........\n........\n........']), d(Array.from({ length: 50 }, () => plansza(r.int(0, 6)))), d(Array.from({ length: 100 }, () => plansza(r.int(2, 16))))];
            },
            check: (inp) => { const L = linie(inp); const t = Number(L[0]); if (!calk(t, 1, 100) || L.length !== 8 * t + 1) return 't'; for (let i = 0; i < t; i++) { const b = L.slice(1 + 8 * i, 9 + 8 * i); if (!b.every((w) => /^[.KHWGSPkhwgsp]{8}$/.test(w))) return 'wiersz'; const s = b.join(''); if (s.split('K').length !== 2 || s.split('k').length !== 2) return 'króle'; } return null; },
            solve: (inp) => {
                const L = linie(inp); const t = Number(L[0]); const o = [];
                for (let i = 0; i < t; i++) {
                    const b = L.slice(1 + 8 * i, 9 + 8 * i); const na = (x, y) => x >= 0 && x < 8 && y >= 0 && y < 8;
                    const prom = (x, y, dx, dy, A) => { x += dx; y += dy; while (na(x, y)) { if (b[x][y] !== '.') return A.includes(b[x][y]); x += dx; y += dy; } return false; };
                    const at = (x, y, bia) => {
                        const F = (c) => (bia ? c : c.toLowerCase()); const jest = (xx, yy, c) => na(xx, yy) && b[xx][yy] === F(c);
                        for (const [dx, dy] of [[1, 2], [2, 1], [-1, 2], [-2, 1], [1, -2], [2, -1], [-1, -2], [-2, -1]]) if (jest(x + dx, y + dy, 'S')) return true;
                        for (let dx = -1; dx <= 1; dx++) for (let dy = -1; dy <= 1; dy++) if ((dx || dy) && jest(x + dx, y + dy, 'K')) return true;
                        const pr = bia ? x + 1 : x - 1; if (jest(pr, y - 1, 'P') || jest(pr, y + 1, 'P')) return true;
                        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (prom(x, y, dx, dy, F('W') + F('H'))) return true;
                        for (const [dx, dy] of [[1, 1], [1, -1], [-1, 1], [-1, -1]]) if (prom(x, y, dx, dy, F('G') + F('H'))) return true;
                        return false;
                    };
                    let kb, kc; for (let x = 0; x < 8; x++) for (let y = 0; y < 8; y++) { if (b[x][y] === 'K') kb = [x, y]; if (b[x][y] === 'k') kc = [x, y]; }
                    const wb = at(kb[0], kb[1], false), wc = at(kc[0], kc[1], true);
                    o.push(wb && wc ? 'OBA' : wb ? 'BIALY' : wc ? 'CZARNY' : 'BRAK');
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string p[8];
bool naPlanszy(int r, int c) {
    return r >= 0 && r < 8 && c >= 0 && c < 8;
}
bool jest(int r, int c, char f) {
    return naPlanszy(r, c) && p[r][c] == f;
}
bool promien(int r, int c, int dr, int dc, char a, char b) {
    r += dr;
    c += dc;
    while (naPlanszy(r, c)) {
        if (p[r][c] != '.') return p[r][c] == a || p[r][c] == b;
        r += dr;
        c += dc;
    }
    return false;
}
char figura(char f, bool biala) {
    return biala ? f : (char)tolower(f);
}
bool atakowane(int r, int c, bool przezBiale) {
    int skoki[8][2] = {{1, 2}, {2, 1}, {-1, 2}, {-2, 1}, {1, -2}, {2, -1}, {-1, -2}, {-2, -1}};
    for (int i = 0; i < 8; i++)
        if (jest(r + skoki[i][0], c + skoki[i][1], figura('S', przezBiale))) return true;
    for (int dr = -1; dr <= 1; dr++)
        for (int dc = -1; dc <= 1; dc++)
            if ((dr != 0 || dc != 0) && jest(r + dr, c + dc, figura('K', przezBiale))) return true;
    int pr = przezBiale ? r + 1 : r - 1;
    if (jest(pr, c - 1, figura('P', przezBiale)) || jest(pr, c + 1, figura('P', przezBiale))) return true;
    int proste[4][2] = {{1, 0}, {-1, 0}, {0, 1}, {0, -1}};
    int skosy[4][2] = {{1, 1}, {1, -1}, {-1, 1}, {-1, -1}};
    for (int i = 0; i < 4; i++) {
        if (promien(r, c, proste[i][0], proste[i][1], figura('W', przezBiale), figura('H', przezBiale))) return true;
        if (promien(r, c, skosy[i][0], skosy[i][1], figura('G', przezBiale), figura('H', przezBiale))) return true;
    }
    return false;
}
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        for (int i = 0; i < 8; i++) cin >> p[i];
        int br = 0, bc = 0, cr = 0, cc = 0;
        for (int r = 0; r < 8; r++)
            for (int c = 0; c < 8; c++) {
                if (p[r][c] == 'K') { br = r; bc = c; }
                if (p[r][c] == 'k') { cr = r; cc = c; }
            }
        bool bialy = atakowane(br, bc, false), czarny = atakowane(cr, cc, true);
        if (bialy && czarny) cout << "OBA\n";
        else if (bialy) cout << "BIALY\n";
        else if (czarny) cout << "CZARNY\n";
        else cout << "BRAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-mastermind-ile', krok: 9, level: 'trudne',
            title: 'Mastermind od tyłu',
            short: 'Znamy strzały i ich oceny — ile tajnych kodów pasuje do wszystkich naraz? Przegląd wszystkich 1296 kodów i funkcja ocen z poprzedniego zadania, wywoływana tysiące razy.',
            tags: ['przegląd wszystkich możliwości', 'funkcja zwracająca pair', 'funkcja bool pasuje'],
            statement: ['Gracz w Mastermind (kody z 4 cyfr od 1 do 6, ocena: czarne i białe jak w zadaniu Mastermind) zapisał swoje strzały i oceny, które dostał. Policz, ile tajnych kodów jest zgodnych ze wszystkimi ocenami naraz, i podaj najmniejszy z nich (jako liczbę).',
                'Napisz pair<int, int> ocen(const string &kod, const string &strzal) oraz bool pasuje(const string &kod, …), która sprawdza kod ze wszystkimi strzałami. Kodów jest tylko 6⁴ = 1296 — można sprawdzić każdy.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test: wiersz z n i n wierszy: strzał, liczba czarnych, liczba białych.'],
            output_format: ['t wierszy: liczba pasujących kodów i najmniejszy z nich albo samo 0, gdy żaden nie pasuje.'],
            constraints: ['1 ≤ t ≤ 20', '1 ≤ n ≤ 10'],
            examples: [{ input: '1\n3\n1234 2 0\n1256 1 1\n6543 0 2', note: 'Pasuje 14 kodów, a najmniejszy z nich to 1135: dwie cyfry na miejscu przy 1234, jedna na miejscu i jedna nie przy 1256, dwie nie na miejscu przy 6543.' }],
            hint: R`Kody wygeneruj czterema pętlami for (a = 1..6) … i złóż napis: string kod = {char('0' + a), char('0' + b), …};. Idąc w tej kolejności, pierwszy pasujący kod jest od razu najmniejszy. bool pasuje(…) zwraca false przy pierwszym strzale, którego ocena się nie zgadza.`,
            tests: (r) => {
                const test = (n, zepsuj) => { const sek = losKod(r); const L = Array.from({ length: n }, () => { const s = losKod(r); let [c, b] = ocen(sek, s); if (zepsuj && r() < 0.3) { if (c + b < 4) b++; else if (c > 0) { c--; b++; } } return `${s} ${c} ${b}`; }); return L; };
                const d = (T) => `${T.length}\n${T.map((L) => `${L.length}\n${L.join('\n')}`).join('\n')}`;
                return [d([['1111 4 0']]), d([['1234 2 0', '1256 1 1', '6543 0 2'], ['1111 0 0', '2222 0 0', '3333 0 0', '4444 0 0', '5555 0 0'], ['1234 0 4'], ['1122 4 0', '1122 0 0']]), d(Array.from({ length: 20 }, () => test(r.int(1, 4), false))), d(Array.from({ length: 20 }, () => test(r.int(3, 10), r() < 0.5)))];
            },
            check: (inp) => { const L = linie(inp); const t = Number(L[0]); let i = 1; if (!calk(t, 1, 20)) return 't'; for (let k = 0; k < t; k++) { const n = Number(L[i++]); if (!calk(n, 1, 10)) return 'n'; for (let j = 0; j < n; j++) { const m = (L[i++] || '').match(/^([1-6]{4}) ([0-4]) ([0-4])$/); if (!m || Number(m[2]) + Number(m[3]) > 4) return 'strzał'; } } return i === L.length ? null : 'długość'; },
            solve: (inp) => { const L = linie(inp); const t = Number(L[0]); let i = 1; const o = []; for (let k = 0; k < t; k++) { const n = Number(L[i++]); const G = L.slice(i, i + n).map((l) => l.split(' ')); i += n; const ok = KODY.filter((kod) => G.every(([s, c, b]) => { const [x, y] = ocen(kod, s); return x === Number(c) && y === Number(b); })); o.push(ok.length ? `${ok.length} ${ok[0]}` : '0'); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
pair<int, int> ocen(const string &kod, const string &strzal) {
    int c = 0, ileK[7] = {}, ileS[7] = {};
    for (int i = 0; i < 4; i++) {
        if (kod[i] == strzal[i]) c++;
        ileK[kod[i] - '0']++;
        ileS[strzal[i] - '0']++;
    }
    int w = 0;
    for (int d = 1; d <= 6; d++) w += min(ileK[d], ileS[d]);
    return {c, w - c};
}
bool pasuje(const string &kod, const vector<string> &strzaly, const vector<int> &czarne, const vector<int> &biale) {
    for (int i = 0; i < (int)strzaly.size(); i++) {
        auto [c, b] = ocen(kod, strzaly[i]);
        if (c != czarne[i] || b != biale[i]) return false;
    }
    return true;
}
int main() {
    int t;
    cin >> t;
    for (int k = 0; k < t; k++) {
        int n;
        cin >> n;
        vector<string> s(n);
        vector<int> cz(n), bi(n);
        for (int i = 0; i < n; i++) cin >> s[i] >> cz[i] >> bi[i];
        int ile = 0;
        string naj = "";
        for (int a = 1; a <= 6; a++)
            for (int b = 1; b <= 6; b++)
                for (int c = 1; c <= 6; c++)
                    for (int d = 1; d <= 6; d++) {
                        string kod = {char('0' + a), char('0' + b), char('0' + c), char('0' + d)};
                        if (pasuje(kod, s, cz, bi)) {
                            if (ile == 0) naj = kod;
                            ile++;
                        }
                    }
        if (ile == 0) cout << "0\n";
        else cout << ile << " " << naj << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-fibonacci-macierz', krok: 9, level: 'trudne',
            title: 'Olbrzymi Fibonacci',
            short: 'F(10¹⁸) modulo 10⁹ + 7 — pętla nie zdąży. Mnożenie macierzy 2 × 2 w funkcji i szybkie potęgowanie w drugiej: około 60 mnożeń zamiast 10¹⁸ kroków.',
            tags: ['funkcja zwracająca vector 2D', 'szybkie potęgowanie', 'modulo w long long'],
            statement: ['Ciąg Fibonacciego: F(0) = 0, F(1) = 1, F(n) = F(n − 1) + F(n − 2). Dla każdego zapytania n wypisz F(n) mod 1 000 000 007.',
                'Przyda się sztuczka: macierz M = [[1, 1], [1, 0]] podniesiona do potęgi n to [[F(n + 1), F(n)], [F(n), F(n − 1)]]. Napisz vector<vector<long long>> mnoz(const vector<vector<long long>> &a, const vector<vector<long long>> &b) (iloczyn macierzy 2 × 2 modulo 10⁹ + 7) i funkcję, która podnosi macierz do potęgi n szybkim potęgowaniem (kwadrat i mnożenie przy jedynkach w zapisie dwójkowym n).'],
            input_format: ['W pierwszym wierszu q.', 'W drugim wierszu q liczb n.'],
            output_format: ['q wierszy: F(n) mod 1 000 000 007.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n0 1 10 100', note: 'F(10) = 55. F(100) ma 21 cyfr — jego reszta z dzielenia przez 1 000 000 007 to 687995182.' }],
            hint: R`Element iloczynu: c[i][j] = (a[i][0] * b[0][j] + a[i][1] * b[1][j]) % MOD — każdy iloczyn jest mniejszy niż 10¹⁸ + 1, więc suma dwóch mieści się w long long. Potęga: wynik = macierz jednostkowa [[1, 0], [0, 1]]; while (n > 0) { if (n % 2 == 1) wynik = mnoz(wynik, m); m = mnoz(m, m); n /= 2; }. Odpowiedź to wynik[0][1].`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d(['0']), d(['1', '2', '3', '10', '100', '1000000000000000000', '999999999999999999', '1000000006', '2000000016']), d(Array.from({ length: 50 }, (_, i) => String(i))), d(Array.from({ length: 1000 }, () => String(r.big(0, 10n ** 18n))))];
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); return calk(q, 1, 1000) && t.length === q + 1 && t.slice(1).every((x) => /^\d{1,19}$/.test(x) && BigInt(x) <= 10n ** 18n) ? null : 'dane'; },
            solve: (inp) => {
                const M = 1000000007n;
                const fib = (n) => { if (n === 0n) return [0n, 1n]; const [a, b] = fib(n / 2n); const c = (a * ((2n * b - a + M) % M)) % M, e = (a * a + b * b) % M; return n % 2n === 0n ? [c, e] : [e, (c + e) % M]; };
                return toks(inp).slice(1).map((x) => String(fib(BigInt(x))[0])).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const long long MOD = 1000000007;
vector<vector<long long>> mnoz(const vector<vector<long long>> &a, const vector<vector<long long>> &b) {
    vector<vector<long long>> c(2, vector<long long>(2));
    for (int i = 0; i < 2; i++)
        for (int j = 0; j < 2; j++) c[i][j] = (a[i][0] * b[0][j] + a[i][1] * b[1][j]) % MOD;
    return c;
}
vector<vector<long long>> potega(vector<vector<long long>> m, long long n) {
    vector<vector<long long>> wynik = {{1, 0}, {0, 1}};
    while (n > 0) {
        if (n % 2 == 1) wynik = mnoz(wynik, m);
        m = mnoz(m, m);
        n /= 2;
    }
    return wynik;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long n;
        cin >> n;
        vector<vector<long long>> m = {{1, 1}, {1, 0}};
        cout << potega(m, n)[0][1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-punkt-w-wielokacie', krok: 9, level: 'trudne',
            title: 'Punkt w wielokącie',
            short: 'Czy punkt leży wewnątrz działki o dziwnym kształcie, na jej granicy, czy na zewnątrz? Funkcja naOdcinku i promień w prawo, który liczy przecięcia z bokami.',
            tags: ['geometria na liczbach całkowitych', 'iloczyn wektorowy', 'nieparzysta liczba przecięć'],
            statement: ['Działka ma kształt wielokąta o n wierzchołkach (podanych po kolei, boki się nie przecinają). Dla każdego z q punktów wypisz WEWNATRZ, NA BRZEGU albo NA ZEWNATRZ.',
                'Metoda promienia: z punktu puść poziomą półprostą w prawo i policz, ile boków przetnie — nieparzysta liczba znaczy, że punkt jest w środku. Bok (a, b) liczymy, gdy jeden koniec leży ostro powyżej wysokości punktu, a drugi nie (wtedy wierzchołki na wysokości punktu liczą się dobrze), i gdy przecięcie leży na prawo od punktu. Zanim zaczniesz liczyć, sprawdź funkcją bool naOdcinku(…), czy punkt nie leży na którymś boku.'],
            input_format: ['W pierwszym wierszu n, potem n wierszy z wierzchołkami x y.', 'Następnie q i q wierszy z punktami x y.'],
            output_format: ['q wierszy: WEWNATRZ, NA BRZEGU albo NA ZEWNATRZ.'],
            constraints: ['3 ≤ n ≤ 1000, 1 ≤ q ≤ 1000', '−10⁴ ≤ wszystkie współrzędne ≤ 10⁴'],
            examples: [{ input: '4\n0 0\n4 0\n4 4\n0 4\n3\n2 2\n4 1\n5 2', note: 'Kwadrat 4 × 4: punkt (2, 2) jest w środku, (4, 1) na prawym boku, a (5, 2) poza kwadratem.' }],
            hint: R`naOdcinku(a, b, p): iloczyn wektorowy (b − a) × (p − a) równy 0 i p w prostokącie wyznaczonym przez a i b. Przecięcie: if ((a.y > p.y) != (b.y > p.y)) — x przecięcia to a.x + (p.y − a.y)(b.x − a.x)/(b.y − a.y); żeby nie dzielić, porównaj (p.x − a.x)(b.y − a.y) z (p.y − a.y)(b.x − a.x), pamiętając, że przy ujemnym b.y − a.y nierówność się odwraca.`,
            tests: (r) => {
                const gwiazda = (n, M) => {
                    for (;;) {
                        const cx = r.int(-M / 2, M / 2), cy = r.int(-M / 2, M / 2); const pts = new Map();
                        for (let i = 0; i < n * 2 && pts.size < n; i++) { const a = r() * 2 * Math.PI, R0 = r.int(1, M / 2); const x = Math.max(-M, Math.min(M, Math.round(cx + R0 * Math.cos(a)))), y = Math.max(-M, Math.min(M, Math.round(cy + R0 * Math.sin(a)))); if (x === cx && y === cy) continue; const k = Math.atan2(y - cy, x - cx); if (![...pts.keys()].some((q) => Math.abs(q - k) < 1e-12)) pts.set(k, [x, y]); }
                        const P0 = [...pts.entries()].sort((p, q) => p[0] - q[0]); if (P0.length < 3) continue; let ok = true;
                        for (let i = 0; i < P0.length; i++) { const g = (i + 1 < P0.length ? P0[i + 1][0] : P0[0][0] + 2 * Math.PI) - P0[i][0]; if (g >= Math.PI - 1e-9) ok = false; }
                        if (ok) return P0.map((p) => p[1]);
                    }
                };
                const naBoku = (W) => { const i = r.int(0, W.length - 1); const [ax, ay] = W[i], [bx, by] = W[(i + 1) % W.length]; const g = nwd(Math.abs(bx - ax), Math.abs(by - ay)) || 1; const k = r.int(0, g); return [ax + (k * (bx - ax)) / g, ay + (k * (by - ay)) / g]; };
                const pyt = (W, q, M) => { const xs = W.map((p) => p[0]), ys = W.map((p) => p[1]); const [x0, x1, y0, y1] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)]; return Array.from({ length: q }, () => { const p = r(); if (p < 0.15) return r.pick(W); if (p < 0.35) return naBoku(W); if (p < 0.5) return [r.int(x0, x1), r.pick(ys)]; return [Math.max(-M, Math.min(M, r.int(x0 - 3, x1 + 3))), Math.max(-M, Math.min(M, r.int(y0 - 3, y1 + 3)))]; }); };
                const d = (W, Q) => `${W.length}\n${W.map((p) => p.join(' ')).join('\n')}\n${Q.length}\n${Q.map((p) => p.join(' ')).join('\n')}`;
                const U = [[0, 0], [9, 0], [9, 9], [6, 9], [6, 3], [3, 3], [3, 9], [0, 9]];
                const grzebien = [[0, 0], [10, 0], [10, 2], [8, 2], [8, 6], [6, 6], [6, 2], [4, 2], [4, 6], [2, 6], [2, 2], [0, 2]];
                const zebaty = [[0, 0], [2, 4], [4, 0], [6, 4], [8, 0], [8, 8], [0, 8]];
                const wspolliniowe = [[0, 0], [2, 0], [4, 0], [4, 2], [4, 4], [0, 4]];
                const W1 = gwiazda(30, 100), W2 = gwiazda(1000, 10000), W3 = gwiazda(200, 40);
                return [d([[0, 0], [4, 0], [4, 4], [0, 4]], [[2, 2], [4, 1], [5, 2]]), d(U, pyt(U, 200, 20).concat([[4, 6], [4, 3], [3, 6], [7, 9], [1, 9], [-1, 9]])), d(grzebien, pyt(grzebien, 300, 20)), d(zebaty, pyt(zebaty, 300, 20).concat([[1, 4], [2, 4], [5, 4], [9, 4]])), d(wspolliniowe, pyt(wspolliniowe, 200, 10)), d(W1, pyt(W1, 500, 10000)), d(W3, pyt(W3, 1000, 10000)), d(W2, pyt(W2, 1000, 10000))];
            },
            check: (inp) => {
                const t = nums(inp); const n = t[0]; if (!calk(n, 3, 1000)) return 'n'; const q = t[1 + 2 * n]; if (!calk(q, 1, 1000) || t.length !== 2 + 2 * n + 2 * q) return 'q';
                if (!t.slice(1).every((x, i) => i === 2 * n || calk(x, -1e4, 1e4))) return 'zakres';
                const W = Array.from({ length: n }, (_, i) => [t[1 + 2 * i], t[2 + 2 * i]]);
                const kr = (a, b, c) => (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]); const sg = (x) => (x > 0) - (x < 0);
                const na = (a, b, c) => Math.min(a[0], b[0]) <= c[0] && c[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= c[1] && c[1] <= Math.max(a[1], b[1]);
                const prz = (a, b, c, e) => { const d1 = sg(kr(c, e, a)), d2 = sg(kr(c, e, b)), d3 = sg(kr(a, b, c)), d4 = sg(kr(a, b, e)); if (d1 * d2 < 0 && d3 * d4 < 0) return true; return (d1 === 0 && na(c, e, a)) || (d2 === 0 && na(c, e, b)) || (d3 === 0 && na(a, b, c)) || (d4 === 0 && na(a, b, e)); };
                for (let i = 0; i < n; i++) { const a = W[i], b = W[(i + 1) % n]; if (a[0] === b[0] && a[1] === b[1]) return 'zerowy bok'; for (let j = i + 2; j < n; j++) { if (i === 0 && j === n - 1) continue; if (prz(a, b, W[j], W[(j + 1) % n])) return 'boki się przecinają'; } }
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const n = t[0]; const W = Array.from({ length: n }, (_, i) => [t[1 + 2 * i], t[2 + 2 * i]]); const q = t[1 + 2 * n]; const o = [];
                for (let k = 0; k < q; k++) {
                    const p = [t[2 + 2 * n + 2 * k], t[3 + 2 * n + 2 * k]]; let brzeg = false, w = false;
                    for (let i = 0; i < n; i++) {
                        const a = W[i], b = W[(i + 1) % n];
                        if ((b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0]) === 0 && Math.min(a[0], b[0]) <= p[0] && p[0] <= Math.max(a[0], b[0]) && Math.min(a[1], b[1]) <= p[1] && p[1] <= Math.max(a[1], b[1])) brzeg = true;
                        if ((a[1] > p[1]) !== (b[1] > p[1])) { const L = (p[0] - a[0]) * (b[1] - a[1]), Rr = (p[1] - a[1]) * (b[0] - a[0]); if (b[1] - a[1] > 0 ? L < Rr : L > Rr) w = !w; }
                    }
                    o.push(brzeg ? 'NA BRZEGU' : w ? 'WEWNATRZ' : 'NA ZEWNATRZ');
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n;
long long wx[1005], wy[1005];
long long iloczyn(long long ax, long long ay, long long bx, long long by, long long cx, long long cy) {
    return (bx - ax) * (cy - ay) - (by - ay) * (cx - ax);
}
bool naOdcinku(long long ax, long long ay, long long bx, long long by, long long px, long long py) {
    return iloczyn(ax, ay, bx, by, px, py) == 0 && min(ax, bx) <= px && px <= max(ax, bx) && min(ay, by) <= py && py <= max(ay, by);
}
bool naBrzegu(long long px, long long py) {
    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        if (naOdcinku(wx[i], wy[i], wx[j], wy[j], px, py)) return true;
    }
    return false;
}
bool wewnatrz(long long px, long long py) {
    bool w = false;
    for (int i = 0; i < n; i++) {
        int j = (i + 1) % n;
        long long ax = wx[i], ay = wy[i], bx = wx[j], by = wy[j];
        if ((ay > py) != (by > py)) {
            long long l = (px - ax) * (by - ay), p = (py - ay) * (bx - ax);
            if (by - ay > 0 ? l < p : l > p) w = !w;
        }
    }
    return w;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> wx[i] >> wy[i];
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x, y;
        cin >> x >> y;
        if (naBrzegu(x, y)) cout << "NA BRZEGU\n";
        else if (wewnatrz(x, y)) cout << "WEWNATRZ\n";
        else cout << "NA ZEWNATRZ\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-b-final-automat', krok: 9, level: 'trudne',
            title: 'Wielki finał: automat z przekąskami',
            short: 'Towary, monety, kredyt i reszta wydawana z tego, co automat ma w środku. Kilkanaście poleceń — każde to osobna funkcja, a wspólny stan trzymają mapy i tablica monet.',
            tags: ['rozbijanie dużego zadania', 'map i globalny stan', 'funkcja bool z wynikiem przez &'],
            statement: ['Symulujesz automat z przekąskami. Kwoty są w groszach, a wypisuje się je jako złote z dwiema cyframi po kropce (250 → 2.50). Monety: 10, 20, 50, 100, 200 i 500 groszy. Polecenia:',
                'TOWAR kod nazwa cena ilosc — nowy towar w przegródce kod. MONETY a b c d e f — serwisant dokłada monety (kolejno a sztuk po 10 gr, b po 20 gr, …, f po 500 gr). WRZUC m — klient wrzuca monetę m; trafia ona od razu do automatu, a kredyt rośnie o m. (Te trzy polecenia niczego nie wypisują.)',
                'WYBIERZ kod — jeśli takiego towaru nie ma albo się skończył: BRAK TOWARU; jeśli kredyt jest mniejszy od ceny: ZA MALO, brakuje X.XX; w przeciwnym razie automat wydaje resztę (kredyt − cena) zachłannie: zawsze największą monetą, jaką ma i która nie przekracza pozostałej kwoty. Jeśli tak się nie da wydać dokładnie: NIE MOGE WYDAC RESZTY (nic się nie zmienia). Jeśli się da: towar ubywa, kredyt spada do 0 i wypisz WYDANO nazwa albo — gdy jest reszta — WYDANO nazwa, reszta X.XX: i wydane monety od największej.',
                'ZWROT — jeśli kredyt to 0: NIC DO ZWROTU; inaczej automat oddaje kredyt tak samo zachłannie: ZWROT X.XX: monety, albo NIE MOGE ZWROCIC, gdy się nie da. STAN — kredyt X.XX, monety: 10xA 20xB 50xC 100xD 200xE 500xF. RAPORT — dla każdego towaru w kolejności kodów: kod nazwa cena x ilosc (albo BRAK TOWAROW).'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Wiersze wypisywane przez polecenia, w kolejności.'],
            constraints: ['1 ≤ q ≤ 1000', 'Kody: litera A–F i cyfra 1–9, różne dla różnych towarów; nazwy: od 1 do 15 małych liter.', 'Ceny to wielokrotności 10 od 10 do 2000, ilości od 1 do 20; w MONETY każda liczba od 0 do 50.', 'Kredyt nigdy nie przekracza 5000 groszy. Program wypisuje co najmniej jeden wiersz.'],
            examples: [{ input: '9\nTOWAR A1 baton 250 2\nMONETY 0 2 1 0 0 0\nWRZUC 200\nWYBIERZ A1\nWRZUC 100\nWYBIERZ A1\nSTAN\nWYBIERZ B7\nRAPORT', note: 'Po 2.00 zł brakuje 0.50. Po dorzuceniu 1 zł kredyt to 3.00, reszta 0.50 — automat ma monetę 50 gr. Kredyt znowu jest zerowy, a monety: 2 po 20 gr, 1 po 2 zł i 1 po 1 zł.' }],
            hint: R`Stan: int monety[6]; const int NOM[6] = {10, 20, 50, 100, 200, 500}; long long kredyt; i mapy map<string, string> nazwa; map<string, int> cena, ilosc;. Najważniejsza funkcja: bool wydaj(long long kwota, vector<int> &wydane) — liczy na kopii licznika monet, a monety z automatu zabiera dopiero wtedy, gdy uda się wydać całą kwotę. string zl(long long gr) zamienia grosze na tekst X.XX.`,
            tests: (r) => {
                const NAZ = ['baton', 'chipsy', 'woda', 'sok', 'gumy', 'wafel', 'cola', 'orzeszki', 'paluszki', 'czekolada', 'lizak', 'herbatniki', 'kanapka', 'jogurt', 'zelki'];
                // Sesja automatu: przy każdym poleceniu symulator mówi, jaki jest prawdziwy kredyt (nigdy ponad 5000 gr).
                const sesja = (q, mn) => {
                    const A = nowyAutomat(); const o = []; const dodaj = (l) => { o.push(l); A.wykonaj(l); };
                    const kody = r.shuffle(['A', 'B', 'C', 'D', 'E', 'F'].flatMap((l) => [1, 2, 3, 4, 5, 6, 7, 8, 9].map((c) => l + c)));
                    const uzyte = kody.slice(0, r.int(3, 12)); const wolne = kody.slice(12);
                    for (const k of uzyte) dodaj(`TOWAR ${k} ${r.pick(NAZ)} ${10 * r.int(1, r.pick([30, 200]))} ${r.int(1, r.pick([3, 20]))}`);
                    if (mn) dodaj(`MONETY ${Array.from({ length: 6 }, () => r.int(0, mn)).join(' ')}`);
                    while (o.length < q) {
                        const p = r();
                        if (p < 0.5) {
                            // klient: wrzuca monety, aż starczy na wybrany towar, i go wybiera (czasem jeszcze prosi o zwrot)
                            const k = r.pick(uzyte), x = A.T.get(k);
                            while (A.kr < x.c && o.length < q - 2) { const m = r.pick(r() < 0.5 ? NOMY : [50, 100, 200]); if (A.kr + m > 5000) break; dodaj(`WRZUC ${m}`); }
                            if (o.length < q) dodaj(`WYBIERZ ${k}`);
                            if (o.length < q && r() < 0.3) dodaj('ZWROT');
                        } else if (p < 0.6) { const m = r.pick(NOMY); if (A.kr + m <= 5000) dodaj(`WRZUC ${m}`); }
                        else if (p < 0.75) dodaj(`WYBIERZ ${r() < 0.85 ? r.pick(uzyte) : r.pick(kody)}`);
                        else if (p < 0.83) dodaj('ZWROT');
                        else if (p < 0.9) dodaj('STAN');
                        else if (p < 0.92) dodaj('RAPORT');
                        else if (p < 0.95) dodaj(`MONETY ${Array.from({ length: 6 }, () => r.int(0, 3)).join(' ')}`);
                        else if (wolne.length) { const k = wolne.pop(); uzyte.push(k); dodaj(`TOWAR ${k} ${r.pick(NAZ)} ${10 * r.int(1, 30)} ${r.int(1, 5)}`); }
                    }
                    return o;
                };
                const d = (o) => `${o.length}\n${o.join('\n')}`;
                return [d(['STAN']), d(['TOWAR A1 woda 150 1', 'WRZUC 200', 'WYBIERZ A1', 'ZWROT', 'MONETY 0 0 1 0 0 0', 'WYBIERZ A1', 'WYBIERZ A1', 'WRZUC 500', 'WYBIERZ A1', 'ZWROT', 'STAN', 'RAPORT']), d(['RAPORT', 'ZWROT', 'WRZUC 20', 'WRZUC 20', 'WRZUC 20', 'MONETY 0 0 1 0 0 0', 'ZWROT', 'STAN']), d(sesja(60, 5)), d(sesja(300, 0)), d(sesja(1000, 50)), d(sesja(1000, 2))];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1000) || L.length !== q + 1) return 'q'; const kody = new Set(); const A = nowyAutomat(); let wyp = 0;
                for (const l of L.slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'TOWAR') { if (t.length !== 5 || !/^[A-F][1-9]$/.test(t[1]) || kody.has(t[1]) || !/^[a-z]{1,15}$/.test(t[2]) || !calk(Number(t[3]), 10, 2000) || Number(t[3]) % 10 || !calk(Number(t[4]), 1, 20)) return 'towar'; kody.add(t[1]); }
                    else if (t[0] === 'MONETY') { if (t.length !== 7 || !t.slice(1).every((x) => calk(Number(x), 0, 50))) return 'monety'; }
                    else if (t[0] === 'WRZUC') { if (t.length !== 2 || !NOMY.includes(Number(t[1]))) return 'wrzuc'; }
                    else if (t[0] === 'WYBIERZ') { if (t.length !== 2 || !/^[A-F][1-9]$/.test(t[1])) return 'wybierz'; }
                    else if (!(['ZWROT', 'STAN', 'RAPORT'].includes(t[0]) && t.length === 1)) return 'polecenie';
                    wyp += A.wykonaj(l).length;
                    if (A.kr > 5000) return 'kredyt';
                }
                return wyp ? null : 'nic nie wypisuje';
            },
            solve: (inp) => { const A = nowyAutomat(); return linie(inp).slice(1).flatMap((l) => A.wykonaj(l)).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int NOM[6] = {10, 20, 50, 100, 200, 500};
int monety[6];
long long kredyt;
map<string, string> nazwa;
map<string, int> cena, ilosc;
string zl(long long gr) {
    string s = to_string(gr / 100) + ".";
    if (gr % 100 < 10) s += "0";
    return s + to_string(gr % 100);
}
bool wydaj(long long kwota, vector<int> &wydane) {
    int zostaje[6];
    for (int i = 0; i < 6; i++) zostaje[i] = monety[i];
    wydane.clear();
    for (int i = 5; i >= 0; i--) {
        while (kwota >= NOM[i] && zostaje[i] > 0) {
            kwota -= NOM[i];
            zostaje[i]--;
            wydane.push_back(NOM[i]);
        }
    }
    if (kwota != 0) return false;
    for (int i = 0; i < 6; i++) monety[i] = zostaje[i];
    return true;
}
string lista(const vector<int> &w) {
    string s = "";
    for (int x : w) s += " " + to_string(x);
    return s;
}
void wrzuc(int m) {
    kredyt += m;
    for (int i = 0; i < 6; i++)
        if (NOM[i] == m) monety[i]++;
}
void wybierz(const string &kod) {
    if (!ilosc.count(kod) || ilosc[kod] == 0) {
        cout << "BRAK TOWARU\n";
        return;
    }
    if (kredyt < cena[kod]) {
        cout << "ZA MALO, brakuje " << zl(cena[kod] - kredyt) << "\n";
        return;
    }
    long long reszta = kredyt - cena[kod];
    vector<int> w;
    if (!wydaj(reszta, w)) {
        cout << "NIE MOGE WYDAC RESZTY\n";
        return;
    }
    ilosc[kod]--;
    kredyt = 0;
    cout << "WYDANO " << nazwa[kod];
    if (reszta > 0) cout << ", reszta " << zl(reszta) << ":" << lista(w);
    cout << "\n";
}
void zwrot() {
    if (kredyt == 0) {
        cout << "NIC DO ZWROTU\n";
        return;
    }
    vector<int> w;
    if (!wydaj(kredyt, w)) {
        cout << "NIE MOGE ZWROCIC\n";
        return;
    }
    cout << "ZWROT " << zl(kredyt) << ":" << lista(w) << "\n";
    kredyt = 0;
}
void stan() {
    cout << "kredyt " << zl(kredyt) << ", monety:";
    for (int i = 0; i < 6; i++) cout << " " << NOM[i] << "x" << monety[i];
    cout << "\n";
}
void raport() {
    if (cena.empty()) cout << "BRAK TOWAROW\n";
    for (auto [kod, c] : cena) cout << kod << " " << nazwa[kod] << " " << zl(c) << " x " << ilosc[kod] << "\n";
}
int main() {
    for (int i = 0; i < 6; i++) monety[i] = 0;
    kredyt = 0;
    nazwa.clear();
    cena.clear();
    ilosc.clear();
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "TOWAR") {
            string kod, n;
            int c, il;
            cin >> kod >> n >> c >> il;
            nazwa[kod] = n;
            cena[kod] = c;
            ilosc[kod] = il;
        } else if (p == "MONETY") {
            for (int j = 0; j < 6; j++) {
                int x;
                cin >> x;
                monety[j] += x;
            }
        } else if (p == "WRZUC") {
            int m;
            cin >> m;
            wrzuc(m);
        } else if (p == "WYBIERZ") {
            string kod;
            cin >> kod;
            wybierz(kod);
        } else if (p == "ZWROT") zwrot();
        else if (p == "STAN") stan();
        else raport();
    }
    return 0;
}`,
        },
    ];
};
