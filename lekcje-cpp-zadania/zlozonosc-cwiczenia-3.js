// Złożoność czasowa — ćwiczenia w trakcie lekcji, części 6–8: wzór i pierwiastek (suma od a do b, wielokrotności,
// włączanie i wyłączanie, pary o sumie s, kwadraty w przedziale, dzielniki i rozkład w O(√n), wspólne dzielniki),
// „policz raz” (sumy prefiksowe, tablica zliczeń, sito, tablica różnic, okno, brakująca liczba, pary reszt)
// oraz „sortuj i szukaj” (binary_search, lower_bound, upper_bound, sąsiedzi po sortowaniu, dwa wskaźniki,
// wyszukiwanie binarne po odpowiedzi, scalanie dwóch list).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
const P = require('./zlozonosc-pomoc');

module.exports = (h) => {
    const { toks } = h;
    const R = String.raw;
    const B = BigInt;
    const E18 = 10n ** 18n;
    const big = (x) => B(x);
    const liczba = (x) => /^-?\d+$/.test(x);
    const zapytania = (inp, ile) => { const t = toks(inp); const n = Number(t[0]); const out = []; for (let i = 0; i < n; i++) out.push(t.slice(1 + ile * i, 1 + ile * (i + 1))); return out; };
    const sprawdzZapytania = (inp, ile, maxT, ok) => { const t = toks(inp), n = Number(t[0]); if (!(Number.isInteger(n) && n >= 1 && n <= maxT && t.length === 1 + ile * n)) return 'liczba zapytań'; for (const z of zapytania(inp, ile)) { if (!z.every(liczba)) return 'nie liczba'; if (!ok(z.map(big))) return 'zakres: ' + z.join(' '); } return null; };
    const wiersze = (lst) => `${lst.length}\n${lst.map((z) => z.join(' ')).join('\n')}`;
    const losZ = (r, n, f) => Array.from({ length: n }, () => f());
    const bigLos = (r, lo, hi) => r.big(lo, hi);
    const losLog = (r, maxE) => bigLos(r, 1n, 10n ** B(r.int(0, maxE)));
    const isqrt = (n) => { n = B(n); if (n < 2n) return n; let x = B(Math.floor(Math.sqrt(Number(n)))); while (x * x > n) x--; while ((x + 1n) * (x + 1n) <= n) x++; return x; };
    const gcd = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
    // generator: pierwsze pięć tokenów to n s a b m
    const gen = (t, od = 0) => P.czytajGen(t, od);
    const dobryG = (t, od, maxN, maxM) => t.slice(od, od + 5).every((x) => /^\d+$/.test(x)) && P.dobryGen(t, od, maxN, maxM);
    // przedziały [l, r] w ciągu długości n; dlugie — prawie cały ciąg (wolne rozwiązanie nie zdąży)
    const przedzialy = (r, n, q, dlugie) => losZ(r, q, () => {
        if (dlugie) { const l = r.int(1, Math.max(1, Math.floor(n / 10))); return `${l} ${r.int(Math.max(l, Math.ceil((9 * n) / 10)), n)}`; }
        const l = r.int(1, n); return `${l} ${r.int(l, n)}`;
    }).join('\n');
    // wejście: generator, q, potem q par (l, r)
    const sprawdzGenPrzedzialy = (maxN, maxM, maxQ) => (inp) => {
        const t = toks(inp);
        if (!dobryG(t, 0, maxN, maxM)) return 'parametry generatora';
        const n = Number(t[0]), q = Number(t[5]);
        if (!(Number.isInteger(q) && q >= 1 && q <= maxQ && t.length === 6 + 2 * q)) return 'liczba pytań';
        for (let i = 0; i < q; i++) { const l = Number(t[6 + 2 * i]), rr = Number(t[7 + 2 * i]); if (!(Number.isInteger(l) && Number.isInteger(rr) && l >= 1 && l <= rr && rr <= n)) return 'przedział'; }
        return null;
    };
    // wejście: generator, q, potem q liczb (albo par, gdy ile = 2) z zakresu [0, maxV]
    const sprawdzGenPytania = (maxN, maxM, maxQ, ile, maxV) => (inp) => {
        const t = toks(inp);
        if (!dobryG(t, 0, maxN, maxM)) return 'parametry generatora';
        const q = Number(t[5]);
        if (!(Number.isInteger(q) && q >= 1 && q <= maxQ && t.length === 6 + ile * q)) return 'liczba pytań';
        const v = t.slice(6).map(Number);
        if (!v.every((x) => Number.isInteger(x) && x >= 0 && x <= maxV)) return 'pytanie';
        if (ile === 2) for (let i = 0; i < q; i++) if (v[2 * i] > v[2 * i + 1]) return 'lo > hi';
        return null;
    };
    // wejście: generator i jeszcze jedna liczba w tym samym wierszu (k albo S)
    const sprawdzGenPlus = (maxN, maxM, ok) => (inp) => { const t = toks(inp); return t.length === 6 && dobryG(t, 0, maxN, maxM) && liczba(t[5]) && ok(Number(t[0]), big(t[5])) ? null : 'parametry'; };
    // pytania o wartości: część z ciągu (odpowiedź „jest”), część losowych
    const pytaniaWartosci = (r, gp, q, maxV) => { const [n, s, a, b, m] = gp.split(' ').map(Number); const x = P.generuj(n, s, a, b, m); return losZ(r, q, () => (r.int(0, 1) ? x[r.int(0, n - 1)] + r.int(0, 2) * r.int(-1, 1) : r.int(0, maxV))).map((v) => Math.min(maxV, Math.max(0, v))); };
    const posortowany = (inp) => { const g = gen(toks(inp)); return Float64Array.from(g.x).sort(); };
    // pierwsze miejsce w posortowanej tablicy z wartością >= v (lower_bound) albo > v (upper_bound)
    const lb = (a, v) => { let l = 0, r = a.length; while (l < r) { const s = (l + r) >> 1; if (a[s] < v) l = s + 1; else r = s; } return l; };
    const ub = (a, v) => { let l = 0, r = a.length; while (l < r) { const s = (l + r) >> 1; if (a[s] <= v) l = s + 1; else r = s; } return l; };
    // sito do 10^7 liczone raz: ilePierwszych[i] — ile liczb pierwszych od 1 do i
    let SITO = null;
    const ilePierwszych = () => {
        if (SITO) return SITO;
        const N = 10000000, zl = new Uint8Array(N + 1);
        zl[0] = zl[1] = 1;
        for (let p = 2; p * p <= N; p++) if (!zl[p]) for (let k = p * p; k <= N; k += p) zl[k] = 1;
        SITO = new Int32Array(N + 1);
        for (let i = 1; i <= N; i++) SITO[i] = SITO[i - 1] + (zl[i] ? 0 : 1);
        return SITO;
    };
    const GEN_CPP = R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    vector<long long> x(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
`;

    return [
        // ================================================================ KROK 6 · wzór i pierwiastek
        {
            id: 'zc-suma-od-a-do-b', krok: 6, level: 'latwe',
            title: 'Suma od a do b',
            short: 'Suma wszystkich liczb całkowitych od a do b — sztuczką Gaussa, bez pętli. Liczby mogą być ujemne.',
            tags: ['(a + b) · ile / 2', 'liczby ujemne', 'long long'],
            statement: ['Dla każdego z t zapytań (liczby a i b, a ≤ b) wypisz sumę a + (a + 1) + … + b.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby całkowite a i b.'],
            output_format: ['t wierszy — sumy.'],
            constraints: ['1 ≤ t ≤ 1000', '−10⁹ ≤ a ≤ b ≤ 10⁹'],
            examples: [{ input: '3\n3 7\n-1000000000 1000000000\n-5 -3', note: '3 + 4 + 5 + 6 + 7 = 25. W drugim przedziale liczby ujemne i dodatnie się znoszą. −5 + (−4) + (−3) = −12.' }],
            hint: R`Wzór z lekcji: ile = b − a + 1, suma = (a + b) · ile / 2. Dziel na końcu — iloczyn (a + b) · ile jest zawsze parzysty, więc dzielenie jest dokładne (także dla liczb ujemnych). Pętla dla przedziału od −10⁹ do 10⁹ zrobiłaby 2 · 10⁹ obrotów na każde zapytanie, a zapytań jest tysiąc. Wszystko w long long.`,
            tests: (r) => [wiersze([['0', '0'], ['1', '1000000000'], ['-1000000000', '-1000000000'], ['1000000000', '1000000000'], ['-1000000000', '999999999'], ['-999999999', '1000000000'], ['0', '1000000000']]),
                wiersze(losZ(r, 30, () => { const a = r.int(-20, 20); return [String(a), String(a + r.int(0, 15))]; })),
                wiersze(losZ(r, 1000, () => { const a = r.int(-1000000000, 1000000000); return [String(a), String(r.int(0, 1) ? r.int(a, 1000000000) : Math.min(1000000000, a + r.int(0, 1000)))]; }))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([a, b]) => a >= -1000000000n && a <= b && b <= 1000000000n),
            solve: (inp) => zapytania(inp, 2).map(([a, b]) => { const A = big(a), Bb = big(b); return String((A + Bb) * (Bb - A + 1n) / 2n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        long long ile = b - a + 1;
        cout << (a + b) * ile / 2 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-suma-wielokrotnosci', krok: 6, level: 'latwe',
            title: 'Wielokrotności i ich suma',
            short: 'Ile jest wielokrotności k nie większych od n i ile wynosi ich suma? Wyciągnij k przed nawias.',
            tags: ['n / k', 'k · m(m + 1) / 2', 'long long'],
            statement: ['Dla każdego z t zapytań (liczby n i k) wypisz, ile jest dodatnich wielokrotności liczby k nie większych od n, oraz ich sumę.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: n i k.'],
            output_format: ['t wierszy — w każdym dwie liczby: ile wielokrotności i ich suma.'],
            constraints: ['1 ≤ t ≤ 800', '1 ≤ n, k ≤ 2 · 10⁹'],
            examples: [{ input: '3\n20 3\n1000000000 7\n5 10', note: 'Do 20: 3, 6, 9, 12, 15, 18 — sześć liczb o sumie 63. Gdy k > n, nie ma żadnej wielokrotności.' }],
            hint: R`Wielokrotności to k, 2k, …, m · k, gdzie m = n / k (dzielenie całkowite). Ich suma to k · (1 + 2 + … + m) = k · (m · (m + 1) / 2). Licz w tej kolejności: najpierw m · (m + 1) / 2, potem razy k. Pętla po wielokrotnościach dla k = 1 i n = 2 · 10⁹ nie zdąży.`,
            tests: (r) => [wiersze([['1', '1'], ['2000000000', '1'], ['1', '2000000000'], ['2000000000', '2000000000'], ['1999999999', '2'], ['2000000000', '3']]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 60)), String(r.int(1, 12))])),
                wiersze(losZ(r, 800, () => [String(r.int(1, 2000000000)), String(r.int(0, 2) ? r.int(1, 30) : r.int(1, 2000000000))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 800, ([n, k]) => n >= 1n && n <= 2000000000n && k >= 1n && k <= 2000000000n),
            solve: (inp) => zapytania(inp, 2).map(([n, k]) => { const m = big(n) / big(k); return `${m} ${big(k) * (m * (m + 1n) / 2n)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, k;
        cin >> n >> k;
        long long m = n / k;
        cout << m << " " << k * (m * (m + 1) / 2) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-ani-2-ani-3-ani-5', krok: 6, level: 'srednie',
            title: 'Ani przez 2, ani przez 3, ani przez 5',
            short: 'Ile liczb od 1 do n dzieli się przez 2, 3 lub 5, a ile przez żadną z nich? Włączanie i wyłączanie dla trzech liczb.',
            tags: ['włączanie i wyłączanie', 'n / 30', 'long long'],
            statement: ['Dla każdego z t zapytań (liczby n) wypisz dwie liczby: ile liczb od 1 do n dzieli się przez co najmniej jedną z liczb 2, 3, 5 oraz ile nie dzieli się przez żadną z nich.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — w każdym dwie liczby.'],
            constraints: ['1 ≤ t ≤ 600', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n10\n30\n1', note: 'Do 10 przez żadną z liczb 2, 3, 5 nie dzielą się tylko 1 i 7. Do 30 — osiem liczb: 1, 7, 11, 13, 17, 19, 23, 29.' }],
            hint: R`Dodaj grupy: n/2 + n/3 + n/5. Liczby podzielne przez dwie z tych liczb (przez 6, 10 i 15) policzyłeś dwa razy — odejmij je: − n/6 − n/10 − n/15. Ale liczby podzielne przez 30 najpierw dodałeś trzy razy, a potem trzy razy odjąłeś — dodaj je z powrotem: + n/30. Drugi wynik to n minus pierwszy.`,
            tests: (r) => [wiersze([['2'], ['3'], ['5'], ['6'], ['29'], ['31'], [String(E18)], [String(E18 - 1n)]]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 100))])),
                wiersze(losZ(r, 600, () => [String(r.int(0, 1) ? bigLos(r, 1n, E18) : losLog(r, 18))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 600, ([n]) => n >= 1n && n <= E18),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { const N = big(n); const k = N / 2n + N / 3n + N / 5n - N / 6n - N / 10n - N / 15n + N / 30n; return `${k} ${N - k}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long ktoras = n / 2 + n / 3 + n / 5 - n / 6 - n / 10 - n / 15 + n / 30;
        cout << ktoras << " " << n - ktoras << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-pary-w-przedziale', krok: 6, level: 'srednie',
            title: 'Pary o sumie s w przedziale',
            short: 'Ile jest par lo ≤ a < b ≤ hi o sumie s? Dobre a tworzą przedział — policz jego długość, bez pętli.',
            tags: ['przedział dobrych a', 'max i dzielenie', 'O(1)'],
            statement: ['Dla każdego z t zapytań (liczby lo, hi, s) wypisz, ile jest par liczb całkowitych (a, b), dla których lo ≤ a < b ≤ hi oraz a + b = s.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby: lo, hi, s.'],
            output_format: ['t wierszy — liczby par.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ lo ≤ hi ≤ 10¹⁸', '1 ≤ s ≤ 2 · 10¹⁸'],
            examples: [{ input: '3\n1 6 7\n5 10 12\n1 1000000000000 1500000000000', note: 'Od 1 do 6 o sumie 7: (1, 6), (2, 5), (3, 4). Od 5 do 10 o sumie 12 tylko (5, 7) — para (6, 6) odpada, bo a < b.' }],
            hint: R`Skoro b = s − a, wystarczy policzyć dobre a — tworzą przedział. Warunki: a ≥ lo; b ≤ hi, czyli a ≥ s − hi; a < b, czyli a ≤ (s − 1) / 2. Początek przedziału to max(lo, s − hi), koniec — (s − 1) / 2. Jeśli początek ≤ koniec, par jest koniec − początek + 1, w przeciwnym razie 0. Pozostałe warunki (b > lo, a < hi) spełniają się same.`,
            tests: (r) => {
                const T2 = 2n * E18;
                const los = () => {
                    const lo = r.int(0, 1) ? losLog(r, 18) : bigLos(r, 1n, E18);
                    const hi = lo + bigLos(r, 0n, E18 - lo);
                    const s = r.int(0, 3) ? bigLos(r, 2n * lo, 2n * hi) : bigLos(r, 1n, T2);
                    return [String(lo), String(hi), String(s < 1n ? 1n : s)];
                };
                return [wiersze([['1', '1', '2'], ['1', '2', '3'], ['1', String(E18), String(T2)], ['1', String(E18), String(E18 + 1n)], ['1', String(E18), '1'], [String(E18), String(E18), String(T2)], ['3', '5', '100']]),
                    wiersze(losZ(r, 30, () => { const lo = r.int(1, 10); const hi = lo + r.int(0, 10); return [String(lo), String(hi), String(r.int(1, 2 * hi + 2))]; })),
                    wiersze(losZ(r, 1000, los))];
            },
            check: (inp) => sprawdzZapytania(inp, 3, 1000, ([lo, hi, s]) => lo >= 1n && lo <= hi && hi <= E18 && s >= 1n && s <= 2n * E18),
            solve: (inp) => zapytania(inp, 3).map(([lo, hi, s]) => { const L = big(lo), H = big(hi), S = big(s); const od = L > S - H ? L : S - H, doo = (S - 1n) / 2n; return String(od <= doo ? doo - od + 1n : 0n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long lo, hi, s;
        cin >> lo >> hi >> s;
        long long od = max(lo, s - hi);   // najmniejsze dobre a
        long long doo = (s - 1) / 2;      // największe dobre a (a < b)
        if (od <= doo) cout << doo - od + 1 << "\n";
        else cout << 0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-kwadraty-w-przedziale', krok: 6, level: 'srednie',
            title: 'Kwadraty w przedziale',
            short: 'Ile kwadratów liczb całkowitych leży między a i b? Pierwiastek z poprawką — dwa razy.',
            tags: ['sqrtl i poprawka', 'do b minus do a − 1', 'long long'],
            statement: ['Dla każdego z t zapytań (liczby a i b) wypisz, ile liczb z przedziału od a do b (włącznie) jest kwadratami liczb całkowitych (1, 4, 9, 16, …).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: a i b.'],
            output_format: ['t wierszy — liczby kwadratów.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a ≤ b ≤ 10¹⁸'],
            examples: [{ input: '3\n1 50\n10 16\n17 24', note: 'Od 1 do 50: 1, 4, 9, 16, 25, 36, 49. Od 10 do 16 tylko 16. Od 17 do 24 — żadnego.' }],
            hint: R`Kwadratów od 1 do n jest tyle, ile wynosi pierwiastek z n zaokrąglony w dół. Licz go jak w lekcji: k = sqrtl(n), a potem dwie pętle poprawiające (w dół i w górę). W przedziale od a do b kwadratów jest tyle, ile do b, minus tyle, ile do a − 1 — ta sama sztuczka co z wielokrotnościami. Pętla k * k <= b dla b = 10¹⁸ to miliard obrotów na zapytanie.`,
            tests: (r) => {
                const sq = (k) => k * k;
                const brzegi = [['1', '1'], ['1', String(E18)], [String(E18), String(E18)], [String(E18 - 1n), String(E18 - 1n)], [String(sq(999999999n)), String(sq(999999999n))], [String(sq(999999999n) + 1n), String(E18 - 1n)], ['2', '3'], ['4', '4'], ['3', '4']];
                return [wiersze(brzegi), wiersze(losZ(r, 30, () => { const a = r.int(1, 100); return [String(a), String(a + r.int(0, 50))]; })),
                    wiersze(losZ(r, 1000, () => {
                        if (r.int(0, 2) === 0) { const k = bigLos(r, 1n, 1000000000n); const a = sq(k) + B(r.int(-1, 1)); const bb = sq(bigLos(r, k, 1000000000n)) + B(r.int(-1, 0)); return [String(a < 1n ? 1n : a), String(bb < a ? a : bb > E18 ? E18 : bb)]; }
                        const a = r.int(0, 1) ? losLog(r, 18) : bigLos(r, 1n, E18); return [String(a), String(a + bigLos(r, 0n, E18 - a))];
                    }))];
            },
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([a, b]) => a >= 1n && a <= b && b <= E18),
            solve: (inp) => zapytania(inp, 2).map(([a, b]) => String(isqrt(big(b)) - isqrt(big(a) - 1n))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        // ile kwadratów do b
        long long kb = sqrtl(b);
        while (kb * kb > b) kb--;
        while ((kb + 1) * (kb + 1) <= b) kb++;
        // ile kwadratów do a - 1
        long long ka = sqrtl(a - 1);
        while (ka * ka > a - 1) ka--;
        while ((ka + 1) * (ka + 1) <= a - 1) ka++;
        cout << kb - ka << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-doskonala-obfita', krok: 6, level: 'srednie',
            title: 'Doskonała, obfita czy deficytowa?',
            short: 'Suma dzielników właściwych liczby do 10¹² — pętla do pierwiastka, dzielniki parami.',
            tags: ['dzielniki parami', 'O(√n)', 'long long'],
            statement: ['Dzielniki właściwe liczby n to wszystkie jej dodatnie dzielniki mniejsze od n. Liczba jest doskonała, gdy suma jej dzielników właściwych jest równa n (np. 6 = 1 + 2 + 3), obfita — gdy ta suma jest większa od n (np. 12), a deficytowa — gdy jest mniejsza (np. 10).', 'Dla każdego z t zapytań (liczby n) wypisz sumę dzielników właściwych i słowo DOSKONALA, OBFITA albo DEFICYTOWA.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — w każdym suma i słowo.'],
            constraints: ['1 ≤ t ≤ 10', '1 ≤ n ≤ 10¹²'],
            examples: [{ input: '4\n6\n12\n10\n1', note: 'Dzielniki właściwe 12: 1, 2, 3, 4, 6 — suma 16 > 12. Jedynka nie ma dzielników właściwych, więc suma to 0.' }],
            hint: R`Pętla for (long long d = 1; d * d <= n; d++) jak w lekcji: gdy d dzieli n, dodaj d i jego parę n / d (jeśli to inna liczba). Tak dostaniesz sumę wszystkich dzielników — na koniec odejmij samo n, bo nie jest dzielnikiem właściwym. Dla n = 10¹² to milion obrotów zamiast biliona.`,
            tests: (r) => [wiersze([['6'], ['28'], ['496'], ['8128'], ['33550336'], ['8589869056'], ['137438691328'], ['2'], ['945'], ['1000000000000']]),
                wiersze([['999999999989'], ['963761198400'], ['999966000289'], ['999962000357'], ['549755813888'], ['735134400000'], ['999999999999'], ['720720'], ['1'], ['3']]),
                wiersze(losZ(r, 10, () => [String(r.int(1, 100000))])),
                wiersze(losZ(r, 10, () => [String(bigLos(r, 999000000000n, 1000000000000n))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 10, ([n]) => n >= 1n && n <= 1000000000000n),
            solve: (inp) => zapytania(inp, 1).map(([v]) => { const n = Number(v); let s = 0; for (let d = 1; d * d <= n; d++) if (n % d === 0) { s += d; if (d !== n / d) s += n / d; } s -= n; return `${s} ${s === n ? 'DOSKONALA' : s > n ? 'OBFITA' : 'DEFICYTOWA'}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long suma = 0;
        for (long long d = 1; d * d <= n; d++) {
            if (n % d == 0) {
                suma += d;
                if (d != n / d) suma += n / d;
            }
        }
        suma -= n;   // samo n nie jest dzielnikiem właściwym
        cout << suma << " ";
        if (suma == n) cout << "DOSKONALA\n";
        else if (suma > n) cout << "OBFITA\n";
        else cout << "DEFICYTOWA\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-najwiekszy-czynnik', krok: 6, level: 'srednie',
            title: 'Największy czynnik pierwszy',
            short: 'Rozłóż liczbę do 10¹² na czynniki w O(√n): wypisz jej największy czynnik pierwszy i liczbę różnych czynników.',
            tags: ['rozkład na czynniki', 'p * p <= n', 'została liczba pierwsza'],
            statement: ['Dla każdego z t zapytań (liczby n ≥ 2) wypisz największą liczbę pierwszą, która dzieli n, oraz liczbę różnych liczb pierwszych dzielących n.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — w każdym dwie liczby.'],
            constraints: ['1 ≤ t ≤ 10', '2 ≤ n ≤ 10¹²'],
            examples: [{ input: '3\n360\n600851475143\n999999999989', note: '360 = 2 · 2 · 2 · 3 · 3 · 5: największy czynnik to 5, a różnych czynników są trzy. Ostatnia liczba jest pierwsza.' }],
            hint: R`Rozkład z lekcji: dziel n przez kolejne p, dopóki się da (while), i licz te p, przez które udało się podzielić choć raz. Jeśli po pętli zostało n > 1, to jest to jeszcze jeden — i największy — czynnik pierwszy. Najdłużej pętla trwa dla liczby pierwszej albo iloczynu dwóch dużych liczb pierwszych: milion obrotów zamiast biliona.`,
            tests: (r) => [wiersze([['2'], ['4'], ['6'], ['999999999989'], ['999999999961'], ['999999999959'], ['999999999937'], ['999999999899'], ['1000000000000'], ['847288609443']]),
                wiersze([['999962000357'], ['999920001599'], ['999884003243'], ['999966000289'], ['549755813888'], ['963761198400'], ['600851475143'], ['999999999999'], ['30030'], ['9699690']]),
                wiersze(losZ(r, 10, () => [String(r.int(2, 100000))])),
                wiersze(losZ(r, 10, () => [String(bigLos(r, 2n, 1000000000000n))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 10, ([n]) => n >= 2n && n <= 1000000000000n),
            solve: (inp) => zapytania(inp, 1).map(([v]) => { let n = Number(v), naj = 0, c = 0; for (let p = 2; p * p <= n; p++) if (n % p === 0) { c++; naj = p; while (n % p === 0) n /= p; } if (n > 1) { c++; naj = n; } return `${naj} ${c}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long najwiekszy = 0;
        int rozne = 0;
        for (long long p = 2; p * p <= n; p++) {
            if (n % p == 0) {
                rozne++;
                najwiekszy = p;
                while (n % p == 0) n /= p;
            }
        }
        if (n > 1) {   // została jedna duża liczba pierwsza
            rozne++;
            najwiekszy = n;
        }
        cout << najwiekszy << " " << rozne << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-wspolne-dzielniki', krok: 6, level: 'srednie',
            title: 'Wspólne dzielniki',
            short: 'Ile dzielników mają wspólnych liczby a i b? NWD z lekcji o modulo, a potem dzielniki parami.',
            tags: ['NWD', 'dzielniki parami', 'O(√n)'],
            statement: ['Dla każdego z t zapytań (liczby a i b) wypisz, ile jest dodatnich liczb całkowitych, które dzielą jednocześnie a i b.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: a i b.'],
            output_format: ['t wierszy — liczby wspólnych dzielników.'],
            constraints: ['1 ≤ t ≤ 10', '1 ≤ a, b ≤ 10¹²'],
            examples: [{ input: '3\n12 18\n7 13\n963761198400 963761198400', note: 'Wspólne dzielniki 12 i 18 to 1, 2, 3, 6 — dokładnie dzielniki ich NWD, czyli 6.' }],
            hint: R`Liczba dzieli jednocześnie a i b dokładnie wtedy, gdy dzieli ich NWD (pamiętasz __gcd z lekcji o modulo?). Wystarczy więc policzyć dzielniki g = __gcd(a, b) — pętlą do pierwiastka, parami, jak w lekcji. Sprawdzanie każdej liczby od 1 do min(a, b) to nawet bilion obrotów.`,
            tests: (r) => [wiersze([['1', '1'], ['1', '1000000000000'], ['1000000000000', '1000000000000'], ['999999999989', '999999999961'], ['963761198400', '481880599200'], ['999966000289', '999983'], ['735134400000', '963761198400'], ['549755813888', '1000000000000'], ['999999999989', '999999999989'], ['720720', '360360']]),
                wiersze(losZ(r, 10, () => [String(r.int(1, 1000)), String(r.int(1, 1000))])),
                wiersze(losZ(r, 10, () => { const g = bigLos(r, 1n, 1000000n); return [String(g * bigLos(r, 1n, 1000000000000n / g)), String(g * bigLos(r, 1n, 1000000000000n / g))]; })),
                wiersze(losZ(r, 10, () => { const g = bigLos(r, 900000000000n, 1000000000000n); return [String(g), String(g)]; }))],
            check: (inp) => sprawdzZapytania(inp, 2, 10, ([a, b]) => a >= 1n && a <= 1000000000000n && b >= 1n && b <= 1000000000000n),
            solve: (inp) => zapytania(inp, 2).map(([a, b]) => { const g = gcd(Number(a), Number(b)); let c = 0; for (let d = 1; d * d <= g; d++) if (g % d === 0) c += d === g / d ? 1 : 2; return String(c); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        long long g = __gcd(a, b);
        long long ile = 0;
        for (long long d = 1; d * d <= g; d++) {
            if (g % d == 0) {
                ile++;
                if (d != g / d) ile++;
            }
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 7 · policz raz
        {
            id: 'zc-sumy-przedzialow', krok: 7, level: 'latwe',
            title: 'Największa suma przedziału',
            short: 'Milion liczb i 5000 pytań o sumy przedziałów. Sumy prefiksowe: każde pytanie jednym odejmowaniem.',
            tags: ['sumy prefiksowe', 'P[r] − P[l − 1]', 'O(n + q)'],
            statement: ['Wygeneruj ciąg x₁, …, xₙ jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m). Potem przeczytaj q przedziałów [l, r]. Dla każdego oblicz sumę xₗ + … + xᵣ i wypisz największą z tych sum oraz numer pierwszego przedziału (licząc od 1), który ją ma.'],
            input_format: ['W pierwszym wierszu pięć liczb: n, s, a, b, m.', 'W drugim wierszu liczba q.', 'W każdym z następnych q wierszy dwie liczby: l i r.'],
            output_format: ['Dwie liczby: największa suma i numer przedziału.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '1 ≤ q ≤ 5000', '1 ≤ l ≤ r ≤ n'],
            examples: [{ input: '5 3 7 1 10\n3\n1 5\n2 4\n4 4', note: 'Ciąg 3, 2, 5, 6, 3. Sumy przedziałów: 19, 13 i 6 — największa jest pierwsza.' }],
            hint: R`Liczenie każdej sumy pętlą to O(n) na pytanie — przy milionie liczb i 5000 pytań kilka miliardów dodawań. Policz raz sumy prefiksowe: P[0] = 0, P[i] = P[i − 1] + x[i − 1] (vector<long long> P(n + 1)). Suma przedziału [l, r] to P[r] − P[l − 1] — jedno odejmowanie. Największą sumę zmieniaj tylko przy ostrej nierówności (>), żeby zapamiętać pierwszy przedział.`,
            tests: (r) => {
                const t = (gp, q, dl) => `${gp}\n${q}\n${przedzialy(r, Number(gp.split(' ')[0]), q, dl)}`;
                return [t('1 7 3 2 10', 1, false), t('6 2 1 1 3', 5, false), t(P.losGen(r, 20, 100), 15, false), t(P.losGen(r, 1000, 1000000000), 1000, false),
                    t(P.losGen(r, 1000000, 1000000000), 5000, true), t('1000000 0 0 5 1000000000', 5000, false), t(P.losGen(r, 1000000, 999999937), 5000, true)];
            },
            check: sprawdzGenPrzedzialy(1000000, 1000000000, 5000),
            solve: (inp) => { const t = toks(inp); const { n, x } = gen(t); const Pr = new Float64Array(n + 1); for (let i = 1; i <= n; i++) Pr[i] = Pr[i - 1] + x[i - 1]; const q = Number(t[5]); let best = -1, k = 0; for (let j = 0; j < q; j++) { const s = Pr[Number(t[7 + 2 * j])] - Pr[Number(t[6 + 2 * j]) - 1]; if (s > best) { best = s; k = j + 1; } } return `${best} ${k}`; },
            cpp: GEN_CPP + R`    vector<long long> P(n + 1, 0);
    for (int i = 1; i <= n; i++) P[i] = P[i - 1] + x[i - 1];
    int q;
    cin >> q;
    long long najwieksza = -1;
    int ktory = 0;
    for (int j = 1; j <= q; j++) {
        int l, r;
        cin >> l >> r;
        long long suma = P[r] - P[l - 1];
        if (suma > najwieksza) {
            najwieksza = suma;
            ktory = j;
        }
    }
    cout << najwieksza << " " << ktory << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-ile-razy-wystapila', krok: 7, level: 'latwe',
            title: 'Ile razy wystąpiła?',
            short: 'Milion liczb z generatora i 3000 pytań „ile razy wystąpiła liczba v?”. Tablica zliczeń — odpowiedź w O(1).',
            tags: ['tablica zliczeń', 'v może być ≥ m', 'O(n + m + q)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m — wszystkie wyrazy są mniejsze od m). Potem odpowiedz na q pytań: ile razy w ciągu występuje liczba v?'],
            input_format: ['W pierwszym wierszu pięć liczb: n, s, a, b, m.', 'W drugim wierszu liczba q.', 'W trzecim wierszu q liczb v.'],
            output_format: ['q wierszy — odpowiedzi.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁶', '0 ≤ s, a, b < m', '1 ≤ q ≤ 3000', '0 ≤ v ≤ 10⁹'],
            examples: [{ input: '5 3 7 1 10\n4\n3 6 4 1000000000', note: 'W ciągu 3, 2, 5, 6, 3 trójka występuje dwa razy, szóstka raz, czwórki nie ma. Liczba 10⁹ jest większa od m, więc na pewno jej nie ma.' }],
            hint: R`count dla każdego pytania to O(n) — 3000 pytań razy milion liczb. Policz raz: vector<int> ile(m, 0) i ile[x[i]]++ dla każdego wyrazu. Potem odpowiedź to ile[v] — ale tylko gdy v < m! Większe v na pewno nie występuje, a sięganie poza tablicę to błąd.`,
            tests: (r) => {
                const t = (gp, q) => `${gp}\n${q}\n${pytaniaWartosci(r, gp, q, Number(gp.split(' ')[4]) + 5).map((v) => (r.int(0, 9) ? v : r.int(0, 1000000000))).join(' ')}`;
                return [t('1 0 0 0 1', 3), t('10 3 1 1 10', 10), t(P.losGen(r, 50, 20), 30), t(P.losGen(r, 1000, 1000), 500),
                    t(P.losGen(r, 1000000, 1000000), 3000), t('1000000 0 0 0 1', 3000), t(P.losGen(r, 1000000, 50), 3000), t('1000000 5 21 7 1000000', 3000)];
            },
            check: sprawdzGenPytania(1000000, 1000000, 3000, 1, 1000000000),
            solve: (inp) => { const t = toks(inp); const { n, m, x } = gen(t); const ile = new Int32Array(m); for (let i = 0; i < n; i++) ile[x[i]]++; return t.slice(6).map(Number).map((v) => (v < m ? ile[v] : 0)).join('\n'); },
            cpp: GEN_CPP + R`    vector<int> ile(m, 0);
    for (int i = 0; i < n; i++) ile[x[i]]++;
    int q;
    cin >> q;
    while (q--) {
        long long v;
        cin >> v;
        if (v < m) cout << ile[v] << "\n";
        else cout << 0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-przewaga-parzystych', krok: 7, level: 'srednie',
            title: 'Przewaga parzystych',
            short: 'W ilu przedziałach liczb parzystych jest więcej niż nieparzystych? Prefiksowe liczniki parzystych.',
            tags: ['prefiksy liczników', 'długość − parzyste', 'O(n + q)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m), a potem przeczytaj q przedziałów [l, r]. Wypisz, w ilu z tych przedziałów liczb parzystych jest więcej niż nieparzystych.'],
            input_format: ['W pierwszym wierszu pięć liczb: n, s, a, b, m.', 'W drugim wierszu liczba q.', 'W każdym z następnych q wierszy dwie liczby: l i r.'],
            output_format: ['Jedna liczba — ile przedziałów ma przewagę parzystych.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '1 ≤ q ≤ 5000', '1 ≤ l ≤ r ≤ n'],
            examples: [{ input: '5 3 7 1 10\n3\n1 5\n2 4\n3 4', note: 'Ciąg 3, 2, 5, 6, 3. W [2, 4] są dwie parzyste (2, 6) i jedna nieparzysta. W [3, 4] jest remis — to nie przewaga.' }],
            hint: R`Policz raz tablicę P, w której P[i] to liczba parzystych wyrazów wśród pierwszych i (P[0] = 0). W przedziale [l, r] parzystych jest P[r] − P[l − 1], a nieparzystych — długość przedziału r − l + 1 minus tyle. Liczenie każdego przedziału pętlą to O(n) na pytanie — za wolno.`,
            tests: (r) => {
                const t = (gp, q, dl) => `${gp}\n${q}\n${przedzialy(r, Number(gp.split(' ')[0]), q, dl)}`;
                return [t('1 4 3 2 10', 1, false), t('8 1 3 4 11', 10, false), t(P.losGen(r, 30, 7), 20, false), t(P.losGen(r, 1000, 999999937), 1000, false),
                    t(P.losGen(r, 1000000, 999999937), 5000, true), t(P.losGen(r, 1000000, 999999937), 5000, false), t('1000000 0 1 1 1000000000', 5000, false)];
            },
            check: sprawdzGenPrzedzialy(1000000, 1000000000, 5000),
            solve: (inp) => { const t = toks(inp); const { n, x } = gen(t); const Pp = new Int32Array(n + 1); for (let i = 1; i <= n; i++) Pp[i] = Pp[i - 1] + (x[i - 1] % 2 === 0 ? 1 : 0); const q = Number(t[5]); let c = 0; for (let j = 0; j < q; j++) { const l = Number(t[6 + 2 * j]), rr = Number(t[7 + 2 * j]); const p = Pp[rr] - Pp[l - 1]; if (p > rr - l + 1 - p) c++; } return String(c); },
            cpp: GEN_CPP + R`    vector<int> P(n + 1, 0);   // P[i] — ile parzystych wśród pierwszych i wyrazów
    for (int i = 1; i <= n; i++) P[i] = P[i - 1] + (x[i - 1] % 2 == 0 ? 1 : 0);
    int q;
    cin >> q;
    int wynik = 0;
    while (q--) {
        int l, r;
        cin >> l >> r;
        int parzyste = P[r] - P[l - 1];
        int nieparzyste = (r - l + 1) - parzyste;
        if (parzyste > nieparzyste) wynik++;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-pierwsze-w-przedzialach', krok: 7, level: 'srednie',
            title: 'Liczby pierwsze w przedziałach',
            short: '3000 pytań „ile liczb pierwszych jest od a do b?” dla liczb do 10⁷. Sito raz, potem sumy prefiksowe.',
            tags: ['sito Eratostenesa', 'sumy prefiksowe', 'policz raz'],
            statement: ['Dostajesz q pytań. W każdym są liczby a i b — wypisz, ile liczb pierwszych leży w przedziale od a do b (włącznie).'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy dwie liczby: a i b.'],
            output_format: ['q wierszy — odpowiedzi.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ a ≤ b ≤ 10⁷'],
            examples: [{ input: '3\n1 10\n10 20\n1 10000000', note: 'Od 1 do 10: 2, 3, 5, 7. Od 10 do 20: 11, 13, 17, 19. Do dziesięciu milionów jest ich 664 579.' }],
            hint: R`Sprawdzanie każdej liczby z przedziału osobno (nawet do pierwiastka) to miliardy działań. Zrób raz sito Eratostenesa do 10⁷, a potem tablicę ile, w której ile[i] to liczba liczb pierwszych od 1 do i. Odpowiedź na pytanie to ile[b] − ile[a − 1]. Pamiętaj, że 1 nie jest liczbą pierwszą.`,
            tests: (r) => [wiersze([['1', '1'], ['2', '2'], ['1', '2'], ['4', '4'], ['9999991', '10000000'], ['10000000', '10000000']]),
                wiersze(losZ(r, 30, () => { const a = r.int(1, 100); return [String(a), String(a + r.int(0, 60))]; })),
                wiersze(losZ(r, 3000, () => { const a = r.int(1, 1000000); return [String(a), String(r.int(9000000, 10000000))]; })),
                wiersze(losZ(r, 3000, () => { const a = r.int(1, 10000000); return [String(a), String(r.int(a, 10000000))]; }))],
            check: (inp) => sprawdzZapytania(inp, 2, 3000, ([a, b]) => a >= 1n && a <= b && b <= 10000000n),
            solve: (inp) => { const ile = ilePierwszych(); return zapytania(inp, 2).map(([a, b]) => String(ile[Number(b)] - ile[Number(a) - 1])).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const int N = 10000000;
    vector<bool> zlozona(N + 1, false);
    zlozona[0] = zlozona[1] = true;
    for (long long p = 2; p * p <= N; p++)
        if (!zlozona[p])
            for (long long k = p * p; k <= N; k += p) zlozona[k] = true;
    vector<int> ile(N + 1, 0);   // ile[i] — ile liczb pierwszych od 1 do i
    for (int i = 1; i <= N; i++) ile[i] = ile[i - 1] + (zlozona[i] ? 0 : 1);
    int q;
    cin >> q;
    while (q--) {
        int a, b;
        cin >> a >> b;
        cout << ile[b] - ile[a - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-malowanie-plotu', krok: 7, level: 'srednie',
            title: 'Malowanie płotu',
            short: 'Płot z miliona desek i 5000 malowań przedziałów. Tablica różnic: każde malowanie w O(1), na koniec jedno przejście.',
            tags: ['tablica różnic', 'suma bieżąca', 'O(n + q)'],
            statement: ['Płot składa się z n desek ponumerowanych od 1 do n. Malarz q razy maluje wszystkie deski od l do r — każde malowanie kładzie na każdej z tych desek jedną warstwę farby. Wypisz, ile desek ma co najmniej jedną warstwę, i największą liczbę warstw na jednej desce.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z następnych q wierszy dwie liczby: l i r.'],
            output_format: ['Dwie liczby: ile desek jest pomalowanych i ile warstw ma najgrubiej pomalowana deska.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ q ≤ 5000', '1 ≤ l ≤ r ≤ n'],
            examples: [{ input: '10 3\n1 4\n3 6\n9 9', note: 'Warstwy na deskach: 1 1 2 2 1 1 0 0 1 0 — siedem desek pomalowanych, najwięcej dwie warstwy.' }],
            hint: R`Malowanie pętlą po deskach to O(n) na malowanie — 5000 · 10⁶ to za dużo. Tablica różnic z lekcji: dla malowania [l, r] zrób d[l]++ i d[r + 1]-- (tablica o rozmiarze n + 2). Na koniec przejdź po deskach od 1 do n i sumuj: liczba warstw na desce i to d[1] + d[2] + … + d[i].`,
            tests: (r) => {
                const t = (n, q, dl) => `${n} ${q}\n${przedzialy(r, n, q, dl)}`;
                return [t(1, 1, false), t(5, 3, false), t(30, 10, false), t(1000, 500, false), t(1000000, 5000, true), t(1000000, 5000, false), t(1000000, 5000, true)];
            },
            check: (inp) => { const t = toks(inp).map(Number); const [n, q] = t; if (!(n >= 1 && n <= 1000000 && q >= 1 && q <= 5000 && t.length === 2 + 2 * q)) return 'n, q'; for (let i = 0; i < q; i++) { const l = t[2 + 2 * i], rr = t[3 + 2 * i]; if (!(Number.isInteger(l) && Number.isInteger(rr) && l >= 1 && l <= rr && rr <= n)) return 'przedział'; } return null; },
            solve: (inp) => { const t = toks(inp).map(Number); const [n, q] = t; const d = new Int32Array(n + 2); for (let i = 0; i < q; i++) { d[t[2 + 2 * i]]++; d[t[3 + 2 * i] + 1]--; } let w = 0, pom = 0, mx = 0; for (let i = 1; i <= n; i++) { w += d[i]; if (w > 0) pom++; if (w > mx) mx = w; } return `${pom} ${mx}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<int> d(n + 2, 0);
    while (q--) {
        int l, r;
        cin >> l >> r;
        d[l]++;
        d[r + 1]--;
    }
    int warstwy = 0, pomalowane = 0, najwiecej = 0;
    for (int i = 1; i <= n; i++) {
        warstwy += d[i];
        if (warstwy > 0) pomalowane++;
        najwiecej = max(najwiecej, warstwy);
    }
    cout << pomalowane << " " << najwiecej << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-okno-k', krok: 7, level: 'latwe',
            title: 'Najlepsze k wyrazów z rzędu',
            short: 'Największa suma k kolejnych wyrazów ciągu z generatora. Przesuwaj okno: dodaj nowy, odejmij stary.',
            tags: ['okno stałej długości', 'O(n)', 'pierwsze najlepsze okno'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz największą sumę k kolejnych wyrazów oraz numer pierwszego wyrazu (licząc od 1) najwcześniejszego okna, które ją osiąga.'],
            input_format: ['Jeden wiersz z sześcioma liczbami: n, s, a, b, m, k.'],
            output_format: ['Dwie liczby: największa suma i numer początku okna.'],
            constraints: ['1 ≤ k ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10 2', note: 'Ciąg 3, 2, 5, 6, 3. Sumy okien długości 2: 5, 7, 11, 9 — najlepsze zaczyna się od trzeciego wyrazu.' }],
            hint: R`Liczenie każdego okna od nowa to O(n · k) — dla k = 500 000 setki miliardów dodawań. Policz sumę pierwszego okna, a potem przesuwaj je o jeden: dodaj wyraz, który wchodzi, i odejmij ten, który wychodzi. Wynik zmieniaj tylko przy ostrej nierówności (>), żeby zapamiętać najwcześniejsze okno.`,
            tests: (r) => ['1 7 3 2 10 1', '6 2 1 1 3 3', '10 0 0 0 1 4', `${P.losGen(r, 50, 100)} 7`, `${P.losGen(r, 1000, 1000000000)} 100`,
                `${P.losGen(r, 1000000, 1000000000)} 500000`, `${P.losGen(r, 1000000, 1000000000)} 1`, `${P.losGen(r, 1000000, 1000000000)} 1000000`, `${P.losGen(r, 1000000, 999999937)} 300000`, '1000000 0 1 1 1000000000 250000'],
            check: sprawdzGenPlus(1000000, 1000000000, (n, k) => k >= 1n && k <= B(n)),
            solve: (inp) => { const t = toks(inp); const { n, x } = gen(t); const k = Number(t[5]); let s = 0; for (let i = 0; i < k; i++) s += x[i]; let best = s, st = 1; for (let i = k; i < n; i++) { s += x[i] - x[i - k]; if (s > best) { best = s; st = i - k + 2; } } return `${best} ${st}`; },
            cpp: GEN_CPP + R`    long long k;
    cin >> k;
    long long suma = 0;
    for (int i = 0; i < k; i++) suma += x[i];
    long long najwieksza = suma;
    int poczatek = 1;
    for (int i = k; i < n; i++) {
        suma += x[i] - x[i - k];      // wchodzi x[i], wychodzi x[i - k]
        if (suma > najwieksza) {
            najwieksza = suma;
            poczatek = i - k + 2;     // okno x[i-k+1..i], numerując od 1
        }
    }
    cout << najwieksza << " " << poczatek << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-najmniejsza-brakujaca', krok: 7, level: 'srednie',
            title: 'Najmniejsza brakująca liczba',
            short: 'Jaka jest najmniejsza liczba całkowita ≥ 0, której nie ma w ciągu? Zaznaczaj w tablicy tylko liczby do n.',
            tags: ['tablica bool', 'tylko liczby ≤ n', 'O(n)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz najmniejszą liczbę całkowitą nieujemną (0, 1, 2, …), która w nim nie występuje.'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — najmniejsza brakująca.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'W ciągu 3, 2, 5, 6, 3 nie ma zera.' }, { input: '6 0 1 1 1000000000', note: 'Ciąg 0, 1, 2, 3, 4, 5 — brakuje dopiero szóstki.' }],
            hint: R`Sprawdzanie po kolei „czy jest 0? czy jest 1? …” przechodzi za każdym razem cały ciąg, a odpowiedź może sięgać miliona. Zauważ, że n liczb nie może pokryć wszystkich liczb od 0 do n — odpowiedź jest najwyżej n. Utwórz więc vector<bool> jest(n + 1, false), zaznaczaj tylko wyrazy nie większe od n, a potem znajdź pierwsze niezaznaczone pole.`,
            tests: (r) => ['1 0 0 0 1', '1 5 3 2 10', '10 0 0 0 1', '12 1 1 1 10', P.losGen(r, 50, 30), P.losGen(r, 1000, 800), '1000000 0 1 1 1000000000', '1000000 1 1 1 1000000000', '1000000 0 1 1 500000', '1000000 7 5 3 1048576', P.losGen(r, 1000000, 999983), P.losGen(r, 1000000, 1000000000)],
            check: (inp) => { const t = toks(inp); return t.length === 5 && dobryG(t, 0, 1000000, 1000000000) ? null : 'parametry generatora'; },
            solve: (inp) => { const { n, x } = gen(toks(inp)); const jest = new Uint8Array(n + 1); for (let i = 0; i < n; i++) if (x[i] <= n) jest[x[i]] = 1; let v = 0; while (jest[v]) v++; return String(v); },
            cpp: GEN_CPP + R`    vector<bool> jest(n + 1, false);
    for (int i = 0; i < n; i++)
        if (x[i] <= n) jest[x[i]] = true;
    int brak = 0;
    while (jest[brak]) brak++;
    cout << brak << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-pary-podzielne-przez-k', krok: 7, level: 'trudne',
            title: 'Pary o sumie podzielnej przez k',
            short: 'Ile jest par wyrazów, których suma dzieli się przez k? Zlicz reszty z dzielenia — reszta r łączy się z k − r.',
            tags: ['zliczanie reszt', 'pary z grup', 'O(n + k)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz, ile jest par indeksów i < j, dla których xᵢ + xⱼ dzieli się przez k.'],
            input_format: ['Jeden wiersz z sześcioma liczbami: n, s, a, b, m, k.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '1 ≤ k ≤ 10⁶'],
            examples: [{ input: '5 3 7 1 10 3', note: 'Ciąg 3, 2, 5, 6, 3. Przez 3 dzielą się sumy 3 + 6, 3 + 3 i 6 + 3 — trzy pary.' }],
            hint: R`Suma dzieli się przez k, gdy reszty z dzielenia przez k dają razem 0 albo k. Policz, ile wyrazów ma każdą resztę: c[r]. Wyrazy z resztą 0 łączą się między sobą: c[0] · (c[0] − 1) / 2 par. Reszta r łączy się z resztą k − r: dla r < k − r dodaj c[r] · c[k − r]. Gdy k jest parzyste, reszta k / 2 łączy się sama ze sobą — tak jak zero. Pętla po wszystkich parach to pół biliona sprawdzeń. Wynik w long long.`,
            tests: (r) => ['1 4 3 2 10 1', '6 2 1 1 3 3', '10 0 0 0 1 7', `${P.losGen(r, 40, 100)} 4`, `${P.losGen(r, 1000, 1000000000)} 10`,
                `${P.losGen(r, 1000000, 1000000000)} 1`, `${P.losGen(r, 1000000, 1000000000)} 2`, `${P.losGen(r, 1000000, 1000000000)} 1000000`, `${P.losGen(r, 1000000, 1000000000)} 999999`, `${P.losGen(r, 1000000, 1000)} 100`, '1000000 0 1 1 1000000000 5'],
            check: sprawdzGenPlus(1000000, 1000000000, (n, k) => k >= 1n && k <= 1000000n),
            solve: (inp) => { const t = toks(inp); const { n, x } = gen(t); const k = Number(t[5]); const c = new Float64Array(k); for (let i = 0; i < n; i++) c[x[i] % k]++; let p = B(c[0]) * B(c[0] - 1) / 2n; for (let r = 1; r < k - r; r++) p += B(c[r]) * B(c[k - r]); if (k % 2 === 0) p += B(c[k / 2]) * B(c[k / 2] - 1) / 2n; return String(p); },
            cpp: GEN_CPP + R`    long long k;
    cin >> k;
    vector<long long> c(k, 0);   // c[r] — ile wyrazów ma resztę r
    for (int i = 0; i < n; i++) c[x[i] % k]++;
    long long pary = c[0] * (c[0] - 1) / 2;
    for (long long r = 1; r < k - r; r++) pary += c[r] * c[k - r];
    if (k % 2 == 0) pary += c[k / 2] * (c[k / 2] - 1) / 2;
    cout << pary << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · sortuj i szukaj
        {
            id: 'zc-czy-jest-na-liscie', krok: 8, level: 'latwe',
            title: 'Czy jest na liście?',
            short: 'Milion liczb do 10⁹ i 5000 pytań „czy v jest w ciągu?”. Posortuj raz, potem binary_search.',
            tags: ['sort', 'binary_search', 'O((n + q) log n)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m). Potem odpowiedz na q pytań: czy liczba v występuje w ciągu? Wypisz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu pięć liczb: n, s, a, b, m.', 'W drugim wierszu liczba q.', 'W trzecim wierszu q liczb v.'],
            output_format: ['q wierszy — TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '1 ≤ q ≤ 5000', '0 ≤ v ≤ 10⁹'],
            examples: [{ input: '5 3 7 1 10\n4\n6 4 3 0', note: 'Ciąg 3, 2, 5, 6, 3 zawiera 6 i 3, ale nie zawiera 4 ani 0.' }],
            hint: R`find (albo pętla) dla każdego pytania to O(n) — razem miliardy porównań. Liczby sięgają 10⁹, więc tablica zliczeń się nie zmieści. Posortuj vector raz — O(n log n) — a potem każde pytanie to binary_search(x.begin(), x.end(), v): około 20 kroków.`,
            tests: (r) => {
                const t = (gp, q) => `${gp}\n${q}\n${pytaniaWartosci(r, gp, q, 1000000000).join(' ')}`;
                return [t('1 0 0 0 1', 2), t('10 3 1 1 10', 10), t(P.losGen(r, 50, 100), 30), t(P.losGen(r, 1000, 1000000000), 1000),
                    t(P.losGen(r, 1000000, 1000000000), 5000), t(P.losGen(r, 1000000, 999999937), 5000), t('1000000 0 1 2 1000000000', 5000)];
            },
            check: sprawdzGenPytania(1000000, 1000000000, 5000, 1, 1000000000),
            solve: (inp) => { const t = toks(inp); const a = posortowany(inp); return t.slice(6).map(Number).map((v) => { const i = lb(a, v); return i < a.length && a[i] === v ? 'TAK' : 'NIE'; }).join('\n'); },
            cpp: GEN_CPP + R`    sort(x.begin(), x.end());
    int q;
    cin >> q;
    while (q--) {
        long long v;
        cin >> v;
        if (binary_search(x.begin(), x.end(), v)) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-ile-mniejszych', krok: 8, level: 'srednie',
            title: 'Ile mniejszych?',
            short: 'Dla każdego pytania v policz, ile wyrazów jest mniejszych od v. Pozycja z lower_bound to właśnie odpowiedź.',
            tags: ['lower_bound', 'pozycja = ile mniejszych', 'sort raz'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m). Potem odpowiedz na q pytań: ile wyrazów ciągu jest mniejszych od v?'],
            input_format: ['W pierwszym wierszu pięć liczb: n, s, a, b, m.', 'W drugim wierszu liczba q.', 'W trzecim wierszu q liczb v.'],
            output_format: ['q wierszy — odpowiedzi.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '1 ≤ q ≤ 3000', '0 ≤ v ≤ 10⁹'],
            examples: [{ input: '5 3 7 1 10\n4\n3 4 0 10', note: 'Posortowany ciąg: 2 3 3 5 6. Od 3 mniejsza jest tylko dwójka, od 4 — trzy wyrazy, od 10 — wszystkie.' }],
            hint: R`Po posortowaniu wszystkie wyrazy mniejsze od v stoją na początku, a lower_bound(x.begin(), x.end(), v) wskazuje pierwszy wyraz ≥ v. Jego numer — lower_bound(…) - x.begin() — to dokładnie liczba mniejszych wyrazów. Liczenie pętlą osobno dla każdego pytania to O(n · q).`,
            tests: (r) => {
                const t = (gp, q) => `${gp}\n${q}\n${pytaniaWartosci(r, gp, q, 1000000000).join(' ')}`;
                return [t('1 0 0 0 1', 2), t('10 3 1 1 10', 10), t(P.losGen(r, 50, 100), 30), t(P.losGen(r, 1000, 1000000000), 1000),
                    t(P.losGen(r, 1000000, 1000000000), 3000), t(P.losGen(r, 1000000, 1000), 3000), t('1000000 999999999 1 999999999 1000000000', 3000)];
            },
            check: sprawdzGenPytania(1000000, 1000000000, 3000, 1, 1000000000),
            solve: (inp) => { const t = toks(inp); const a = posortowany(inp); return t.slice(6).map(Number).map((v) => lb(a, v)).join('\n'); },
            cpp: GEN_CPP + R`    sort(x.begin(), x.end());
    int q;
    cin >> q;
    while (q--) {
        long long v;
        cin >> v;
        cout << lower_bound(x.begin(), x.end(), v) - x.begin() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-ile-w-przedziale-wartosci', krok: 8, level: 'srednie',
            title: 'Ile w przedziale wartości?',
            short: 'Ile wyrazów ciągu ma wartość od lo do hi? Różnica dwóch wyszukiwań: upper_bound minus lower_bound.',
            tags: ['upper_bound − lower_bound', 'sort raz', 'O(log n) na pytanie'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m). Potem odpowiedz na q pytań: ile wyrazów ciągu ma wartość co najmniej lo i co najwyżej hi?'],
            input_format: ['W pierwszym wierszu pięć liczb: n, s, a, b, m.', 'W drugim wierszu liczba q.', 'W każdym z następnych q wierszy dwie liczby: lo i hi.'],
            output_format: ['q wierszy — odpowiedzi.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '1 ≤ q ≤ 3000', '0 ≤ lo ≤ hi ≤ 10⁹'],
            examples: [{ input: '5 3 7 1 10\n3\n3 5\n0 1\n0 1000000000', note: 'Posortowany ciąg: 2 3 3 5 6. W przedziale wartości [3, 5] leżą 3, 3, 5.' }],
            hint: R`Na posortowanym ciągu wyrazy o wartościach z [lo, hi] stoją obok siebie. Pierwszy z nich wskazuje lower_bound(…, lo), a pierwszy za nimi — upper_bound(…, hi), czyli pierwszy wyraz większy od hi. Odpowiedź to różnica tych dwóch pozycji.`,
            tests: (r) => {
                const t = (gp, q) => { const v = pytaniaWartosci(r, gp, 2 * q, 1000000000); const pary = []; for (let i = 0; i < q; i++) { const [a, b] = [v[2 * i], v[2 * i + 1]]; pary.push(r.int(0, 3) ? `${Math.min(a, b)} ${Math.max(a, b)}` : `${a} ${a}`); } return `${gp}\n${q}\n${pary.join('\n')}`; };
                return [t('1 0 0 0 1', 2), t('10 3 1 1 10', 10), t(P.losGen(r, 50, 100), 30), t(P.losGen(r, 1000, 1000000000), 1000),
                    t(P.losGen(r, 1000000, 1000000000), 3000), t(P.losGen(r, 1000000, 1000), 3000), t(P.losGen(r, 1000000, 999999937), 3000)];
            },
            check: sprawdzGenPytania(1000000, 1000000000, 3000, 2, 1000000000),
            solve: (inp) => { const t = toks(inp); const a = posortowany(inp); const q = Number(t[5]); const out = []; for (let i = 0; i < q; i++) out.push(ub(a, Number(t[7 + 2 * i])) - lb(a, Number(t[6 + 2 * i]))); return out.join('\n'); },
            cpp: GEN_CPP + R`    sort(x.begin(), x.end());
    int q;
    cin >> q;
    while (q--) {
        long long lo, hi;
        cin >> lo >> hi;
        cout << upper_bound(x.begin(), x.end(), hi) - lower_bound(x.begin(), x.end(), lo) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-najmniejsza-roznica', krok: 8, level: 'srednie',
            title: 'Najmniejsza różnica',
            short: 'Które dwa wyrazy są najbliżej siebie? Po posortowaniu wystarczy porównać sąsiadów.',
            tags: ['sort', 'sąsiedzi', 'O(n log n)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz najmniejszą wartość |xᵢ − xⱼ| dla różnych indeksów i ≠ j.'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — najmniejsza różnica.'],
            constraints: ['2 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'Trójka występuje dwa razy — różnica 0.' }, { input: '4 1 2 3 10', note: 'Ciąg 1, 5, 3, 9. Po posortowaniu 1 3 5 9 sąsiedzi różnią się o 2, 2 i 4.' }],
            hint: R`Pętla w pętli po wszystkich parach to pół biliona różnic. Po posortowaniu najbliższe sobie liczby stoją obok siebie — wystarczy sprawdzić różnice sąsiadów x[i + 1] − x[i]: n − 1 odejmowań.`,
            tests: (r) => ['2 5 3 2 10', '2 0 0 0 1', '10 1 1 3 100', P.losGen(r, 50, 1000000000), P.losGen(r, 1000, 1000000000), '1000000 0 1 1000 1000000000', P.losGen(r, 1000000, 1000000000), P.losGen(r, 1000000, 999999937), '1000000 5 21 7 1000000'],
            check: (inp) => { const t = toks(inp); return t.length === 5 && dobryG(t, 0, 1000000, 1000000000) && Number(t[0]) >= 2 ? null : 'parametry generatora'; },
            solve: (inp) => { const a = posortowany(inp); let best = Infinity; for (let i = 0; i + 1 < a.length; i++) best = Math.min(best, a[i + 1] - a[i]); return String(best); },
            cpp: GEN_CPP + R`    sort(x.begin(), x.end());
    long long najmniejsza = x[1] - x[0];
    for (int i = 1; i + 1 < n; i++) najmniejsza = min(najmniejsza, x[i + 1] - x[i]);
    cout << najmniejsza << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-pary-o-sumie-do-s', krok: 8, level: 'srednie',
            title: 'Pary o sumie co najwyżej S',
            short: 'Ile par wyrazów ma sumę ≤ S? Dwa wskaźniki na posortowanym ciągu — jeden z lewej, drugi z prawej.',
            tags: ['dwa wskaźniki', 'sort', 'O(n log n)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz, ile jest par indeksów i < j, dla których xᵢ + xⱼ ≤ S.'],
            input_format: ['Jeden wiersz z sześcioma liczbami: n, s, a, b, m, S.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '0 ≤ S ≤ 2 · 10⁹'],
            examples: [{ input: '5 3 7 1 10 6', note: 'Posortowany ciąg 2 3 3 5 6. Sumę ≤ 6 mają pary 2 + 3 (dwie takie, bo są dwie trójki) i 3 + 3.' }],
            hint: R`Posortuj ciąg. Ustaw l na początku, r na końcu. Jeśli x[l] + x[r] ≤ S, to x[l] tworzy dobrą parę z każdym wyrazem od l + 1 do r — dodaj r − l i przesuń l w prawo. W przeciwnym razie x[r] jest za duże nawet dla najmniejszego wyrazu — przesuń r w lewo. Każdy krok przesuwa jeden wskaźnik, więc pętla robi mniej niż n kroków. Wynik może mieć 5 · 10¹¹ — long long.`,
            tests: (r) => ['1 4 3 2 10 100', '6 2 1 1 3 2', '10 0 0 0 1 0', `${P.losGen(r, 40, 100)} 100`, `${P.losGen(r, 1000, 1000000000)} 1000000000`,
                `${P.losGen(r, 1000000, 1000000000)} 1000000000`, `${P.losGen(r, 1000000, 1000000000)} 2000000000`, `${P.losGen(r, 1000000, 1000000000)} 30000000`, `${P.losGen(r, 1000000, 1000)} 1000`, '1000000 0 1 1 1000000000 999999'],
            check: sprawdzGenPlus(1000000, 1000000000, (n, S) => S >= 0n && S <= 2000000000n),
            solve: (inp) => { const t = toks(inp); const a = posortowany(inp); const S = Number(t[5]); let l = 0, rr = a.length - 1, c = 0; while (l < rr) { if (a[l] + a[rr] <= S) { c += rr - l; l++; } else rr--; } return String(c); },
            cpp: GEN_CPP + R`    long long S;
    cin >> S;
    sort(x.begin(), x.end());
    long long pary = 0;
    int l = 0, r = n - 1;
    while (l < r) {
        if (x[l] + x[r] <= S) {
            pary += r - l;   // x[l] pasuje do x[l+1], ..., x[r]
            l++;
        } else {
            r--;
        }
    }
    cout << pary << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-najdluzszy-fragment', krok: 8, level: 'srednie',
            title: 'Najdłuższy fragment o sumie ≤ S',
            short: 'Najdłuższy spójny fragment ciągu z sumą nie większą niż S. Okno o zmiennej długości — dwa wskaźniki.',
            tags: ['okno zmiennej długości', 'dwa wskaźniki', 'O(n)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz długość najdłuższego spójnego fragmentu (kilku kolejnych wyrazów), którego suma jest nie większa niż S. Jeśli każdy wyraz jest większy od S, wypisz 0.'],
            input_format: ['Jeden wiersz z sześcioma liczbami: n, s, a, b, m, S.'],
            output_format: ['Jedna liczba — długość fragmentu.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '0 ≤ S ≤ 10¹⁵'],
            examples: [{ input: '5 3 7 1 10 10', note: 'Ciąg 3, 2, 5, 6, 3. Fragment 3, 2, 5 ma sumę dokładnie 10 — dłuższego o sumie ≤ 10 nie ma.' }],
            hint: R`Jak w lekcji: prawy koniec okna przesuwa się po kolei, a gdy suma przekroczy S, zabieraj wyrazy z lewej. Wszystkie wyrazy są nieujemne, więc dokładanie zwiększa sumę, a zabieranie — zmniejsza. Każdy wyraz raz wchodzi do okna i raz z niego wychodzi: O(n). Sprawdzanie każdego początku osobno działa wolno, gdy dobre fragmenty są długie — a w testach są fragmenty długie na setki tysięcy wyrazów.`,
            tests: (r) => ['1 7 3 2 10 5', '1 7 3 2 10 7', '6 2 1 1 3 2', `${P.losGen(r, 40, 100)} 200`, `${P.losGen(r, 1000, 1000000000)} 5000000000`,
                `${P.losGen(r, 1000000, 1000000000)} 100000000000000`, `${P.losGen(r, 1000000, 1000000000)} 300000000000000`, `${P.losGen(r, 1000000, 1000000000)} 1000000000000000`, `${P.losGen(r, 1000000, 1000000000)} 1000000`, '1000000 0 1 1 1000000000 200000000000'],
            check: sprawdzGenPlus(1000000, 1000000000, (n, S) => S >= 0n && S <= 10n ** 15n),
            solve: (inp) => { const t = toks(inp); const { n, x } = gen(t); const S = Number(t[5]); let s = 0, l = 0, best = 0; for (let rr = 0; rr < n; rr++) { s += x[rr]; while (s > S) { s -= x[l]; l++; } if (rr - l + 1 > best) best = rr - l + 1; } return String(best); },
            cpp: GEN_CPP + R`    long long S;
    cin >> S;
    long long suma = 0;
    int l = 0, najdluzszy = 0;
    for (int r = 0; r < n; r++) {
        suma += x[r];
        while (suma > S) {   // za dużo — zabieraj z lewej
            suma -= x[l];
            l++;
        }
        najdluzszy = max(najdluzszy, r - l + 1);
    }
    cout << najdluzszy << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-pierwiastek-szescienny', krok: 8, level: 'srednie',
            title: 'Pierwiastek sześcienny bez pomyłek',
            short: 'Największe k, dla którego k³ ≤ n, dla n do 10¹⁸. Wyszukiwanie binarne po odpowiedzi — około 20 kroków.',
            tags: ['wyszukiwanie binarne po odpowiedzi', 's · s · s ≤ n', 'long long'],
            statement: ['Dla każdego z t zapytań (liczby n) wypisz największą liczbę całkowitą k ≥ 0, dla której k³ ≤ n.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — szukane k.'],
            constraints: ['1 ≤ t ≤ 2000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n27\n26\n1000000000000000000\n0', note: '3³ = 27, więc dla 26 odpowiedź to już 2. Pierwiastek sześcienny z 10¹⁸ to dokładnie milion.' }],
            hint: R`Funkcja cbrtl potrafi pomylić się o 1, a pętla k++ dla n = 10¹⁸ to milion obrotów na zapytanie — dwa tysiące zapytań to dwa miliardy. Szukaj binarnie, jak w lekcji: odpowiedź leży między l = 0 a r = 10⁶. Bierz środek s = (l + r + 1) / 2: jeśli s · s · s ≤ n, to l = s, a w przeciwnym razie r = s − 1. Około 20 kroków na zapytanie.`,
            tests: (r) => {
                const sz = (k) => k * k * k;
                const brzegi = [];
                for (const k of [1n, 2n, 10n, 999999n, 1000000n, 123456n]) for (const d of [-1n, 0n, 1n]) { const v = sz(k) + d; if (v >= 0n && v <= E18) brzegi.push([String(v)]); }
                return [wiersze([['0'], ['1'], ['7'], ['8'], ['9'], ...brzegi]), wiersze(losZ(r, 30, () => [String(r.int(0, 2000))])),
                    wiersze(losZ(r, 2000, () => [String(r.int(0, 1) ? losLog(r, 18) : (() => { const k = bigLos(r, 1n, 1000000n); return sz(k) + B(r.int(-1, 0)); })())])),
                    wiersze(losZ(r, 2000, () => [String(bigLos(r, 9n * E18 / 10n, E18))]))];
            },
            check: (inp) => sprawdzZapytania(inp, 1, 2000, ([n]) => n >= 0n && n <= E18),
            solve: (inp) => zapytania(inp, 1).map(([v]) => { const n = big(v); let l = 0n, rr = 1000000n; while (l < rr) { const s = (l + rr + 1n) / 2n; if (s * s * s <= n) l = s; else rr = s - 1n; } return String(l); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long l = 0, r = 1000000;   // odpowiedź na pewno jest w [l, r]
        while (l < r) {
            long long s = (l + r + 1) / 2;
            if (s * s * s <= n) l = s;   // s pasuje — odpowiedź co najmniej s
            else r = s - 1;              // s za duże
        }
        cout << l << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-wspolne-liczby', krok: 8, level: 'srednie',
            title: 'Wspólne liczby dwóch list',
            short: 'Dwie listy po pół miliona liczb. Ile różnych liczb występuje w obu? Posortuj obie i idź dwoma wskaźnikami.',
            tags: ['sort', 'scalanie dwóch list', 'O(n log n)'],
            statement: ['Dwa generatory (każdy jak w lekcji: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) dają dwie listy liczb. Wypisz, ile jest różnych liczb, które występują w obu listach.'],
            input_format: ['W pierwszym wierszu pięć liczb opisujących pierwszą listę: n₁, s₁, a₁, b₁, m₁.', 'W drugim wierszu pięć liczb opisujących drugą listę: n₂, s₂, a₂, b₂, m₂.'],
            output_format: ['Jedna liczba — ile różnych liczb jest w obu listach.'],
            constraints: ['1 ≤ n₁, n₂ ≤ 5 · 10⁵', '1 ≤ m₁, m₂ ≤ 10⁹', '0 ≤ s, a, b < m (w każdym wierszu)'],
            examples: [{ input: '5 3 7 1 10\n4 1 2 3 10', note: 'Listy 3, 2, 5, 6, 3 i 1, 5, 3, 9. Wspólne są 3 i 5 — trójkę liczymy raz, choć w pierwszej liście jest dwa razy.' }],
            hint: R`Porównanie każdej liczby z każdą to O(n₁ · n₂). Posortuj obie listy. Ustaw wskaźnik i na początku pierwszej, j na początku drugiej: jeśli x[i] < y[j], przesuń i; jeśli x[i] > y[j], przesuń j; jeśli są równe — to wspólna liczba: policz ją raz i przeskocz jej wszystkie powtórzenia w obu listach. Wygeneruj listy dwa razy tym samym kodem z lekcji (raz do x, raz do y).`,
            tests: (r) => [`1 5 3 2 10\n1 5 3 2 10`, `1 5 3 2 10\n1 4 3 2 10`, `10 0 0 0 1\n7 0 0 0 1`, `50 ${r.int(0, 63)} 5 3 64\n40 ${r.int(0, 63)} 13 7 64`, `1000 ${r.int(0, 1999)} 21 7 2000\n1000 ${r.int(0, 1999)} 21 7 2000`,
                `500000 ${r.int(0, 999999)} 21 7 1000000\n500000 ${r.int(0, 999999)} 41 13 1000000`, `500000 ${r.int(0, 1048575)} 5 3 1048576\n500000 ${r.int(0, 1048575)} 9 7 1048576`, `500000 0 1 1 1000000000\n500000 250000 1 1 1000000000`, `${P.losGen(r, 500000, 1000000000)}\n${P.losGen(r, 500000, 1000000000)}`, `500000 0 1 3 1000000000\n500000 0 1 5 1000000000`, `${P.losGen(r, 500000, 1000)}\n${P.losGen(r, 500000, 1000000)}`],
            check: (inp) => { const t = toks(inp); return t.length === 10 && dobryG(t, 0, 500000, 1000000000) && dobryG(t, 5, 500000, 1000000000) ? null : 'parametry generatorów'; },
            solve: (inp) => { const t = toks(inp); const x = Float64Array.from(gen(t, 0).x).sort(), y = Float64Array.from(gen(t, 5).x).sort(); let i = 0, j = 0, c = 0; while (i < x.length && j < y.length) { if (x[i] < y[j]) i++; else if (x[i] > y[j]) j++; else { const v = x[i]; c++; while (i < x.length && x[i] === v) i++; while (j < y.length && y[j] === v) j++; } } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n1, s1, a1, b1, m1, n2, s2, a2, b2, m2;
    cin >> n1 >> s1 >> a1 >> b1 >> m1 >> n2 >> s2 >> a2 >> b2 >> m2;
    vector<long long> x(n1), y(n2);
    x[0] = s1;
    for (int i = 1; i < n1; i++) x[i] = (x[i - 1] * a1 + b1) % m1;
    y[0] = s2;
    for (int i = 1; i < n2; i++) y[i] = (y[i - 1] * a2 + b2) % m2;
    sort(x.begin(), x.end());
    sort(y.begin(), y.end());
    int i = 0, j = 0;
    long long wspolne = 0;
    while (i < n1 && j < n2) {
        if (x[i] < y[j]) i++;
        else if (x[i] > y[j]) j++;
        else {
            long long v = x[i];
            wspolne++;
            while (i < n1 && x[i] == v) i++;   // przeskocz powtórzenia
            while (j < n2 && y[j] == v) j++;
        }
    }
    cout << wspolne << "\n";
    return 0;
}`,
        },
    ];
};
