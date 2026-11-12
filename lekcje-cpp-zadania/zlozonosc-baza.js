// Złożoność czasowa — baza zadań na koniec lekcji: od rozgrzewki (ramka z płytek, kasy, kuranty, turniej pucharowy,
// domek z kart, powyżej średniej, wynik wolnego programu, żarówki, numerowanie stron, wspólne wielokrotności) przez zadania
// średnie (k-ta liczba niepodzielna, liczby bliźniacze, trzy dzielniki, pary o różnicy k, który okres cieplejszy, rozkład
// jazdy, dokładnie k warstw, pary z dwóch list, najlepszy fragment, różne czynniki pierwsze) do trudnych (liczby gładkie,
// fragment bez powtórzeń, fragmenty o sumie zero, maszyny, tabliczka mnożenia, trójkąty, dzielniki do n) i wielkiego
// finału — wyprzedaży. W każdym zadaniu wolne rozwiązanie nie zdąży: sprawdzarka mierzy czas.
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
    const gcdB = (a, b) => { while (b) [a, b] = [b, a % b]; return a; };
    // dzielenie całkowite dla liczb < 2^53 (Math.floor(x / d) czasem zaokrągla w górę)
    const dziel = (x, d) => { let q = Math.floor(x / d); if (q * d > x) q--; return q; };
    const gen = (t, od = 0) => P.czytajGen(t, od);
    const dobryG = (t, od, maxN, maxM) => t.slice(od, od + 5).every((x) => /^\d+$/.test(x)) && P.dobryGen(t, od, maxN, maxM);
    const sprawdzGen = (maxN, maxM, minN = 1) => (inp) => { const t = toks(inp); return t.length === 5 && dobryG(t, 0, maxN, maxM) && Number(t[0]) >= minN ? null : 'parametry generatora'; };
    const sprawdzGenPlus = (maxN, maxM, ok) => (inp) => { const t = toks(inp); return t.length === 6 && dobryG(t, 0, maxN, maxM) && liczba(t[5]) && ok(Number(t[0]), big(t[5])) ? null : 'parametry'; };
    const lb = (a, v) => { let l = 0, r = a.length; while (l < r) { const s = (l + r) >> 1; if (a[s] < v) l = s + 1; else r = s; } return l; };
    const ub = (a, v) => { let l = 0, r = a.length; while (l < r) { const s = (l + r) >> 1; if (a[s] <= v) l = s + 1; else r = s; } return l; };
    // sito do 10^7 (liczone raz): zl[i] = 1, gdy i nie jest pierwsza
    let ZL = null;
    const zlozone = () => {
        if (ZL) return ZL;
        const N = 10000000;
        ZL = new Uint8Array(N + 1);
        ZL[0] = ZL[1] = 1;
        for (let p = 2; p * p <= N; p++) if (!ZL[p]) for (let k = p * p; k <= N; k += p) ZL[k] = 1;
        return ZL;
    };
    // wszystkie liczby gładkie (2^a 3^b 5^c) do 10^18, posortowane
    let GLADKIE = null;
    const gladkie = () => {
        if (GLADKIE) return GLADKIE;
        const out = [];
        for (let p2 = 1n; p2 <= E18; p2 *= 2n) for (let p3 = p2; p3 <= E18; p3 *= 3n) for (let p5 = p3; p5 <= E18; p5 *= 5n) out.push(p5);
        GLADKIE = out.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
        return GLADKIE;
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
    // sito do stałej N zadeklarowanej w programie
    const SITO_CPP = R`    vector<bool> zlozona(N + 1, false);
    zlozona[0] = zlozona[1] = true;
    for (long long p = 2; p * p <= N; p++)
        if (!zlozona[p])
            for (long long k = p * p; k <= N; k += p) zlozona[k] = true;
`;

    return [
        // ================================================================ ROZGRZEWKA
        {
            id: 'zc-b-ramka', krok: 9, level: 'latwe',
            title: 'Ramka z płytek',
            short: 'Podłoga n × m: ile płytek leży przy brzegu, a ile w środku? Wzór zamiast liczenia płytek po kolei.',
            tags: ['prostokąt w środku', 'jeden wiersz to pułapka', 'long long'],
            statement: ['Prostokątna podłoga jest wyłożona n × m kwadratowymi płytkami (n wierszy, m kolumn). Płytki leżące przy brzegu podłogi — w pierwszym lub ostatnim wierszu albo w pierwszej lub ostatniej kolumnie — są ciemne, a wszystkie pozostałe jasne. Dla każdego z t zapytań wypisz liczbę ciemnych i liczbę jasnych płytek.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: n i m.'],
            output_format: ['t wierszy — w każdym liczba ciemnych i liczba jasnych płytek.'],
            constraints: ['1 ≤ t ≤ 600', '1 ≤ n, m ≤ 10⁹'],
            examples: [{ input: '3\n3 4\n1 5\n1000000000 1000000000', note: 'W podłodze 3 × 4 jasne są tylko dwie środkowe płytki. Gdy podłoga ma jeden wiersz, wszystkie płytki leżą przy brzegu.' }],
            hint: R`Nie przechodź po płytkach — może ich być 10¹⁸. Jasne płytki tworzą prostokąt (n − 2) × (m − 2), o ile n i m są co najmniej 2; ciemne to wszystkie pozostałe: n · m − jasne. Gdy n = 1 albo m = 1, jasnych płytek nie ma — uważaj, bo wzór (n − 2) · (m − 2) dałby wtedy bzdurę (dla n = m = 1 nawet dodatnią). Wszystko w long long.`,
            tests: (r) => [wiersze([['1', '1'], ['1', '2'], ['2', '1'], ['2', '2'], ['2', '3'], ['3', '3'], ['1', '1000000000'], ['1000000000', '1'], ['1000000000', '1000000000'], ['2', '1000000000']]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 8)), String(r.int(1, 8))])),
                wiersze(losZ(r, 600, () => [String(r.int(0, 3) ? r.int(1, 1000000000) : r.int(1, 3)), String(r.int(0, 3) ? r.int(1, 1000000000) : r.int(1, 3))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 600, ([n, m]) => n >= 1n && n <= 1000000000n && m >= 1n && m <= 1000000000n),
            solve: (inp) => zapytania(inp, 2).map(([n, m]) => { const N = big(n), M = big(m); const j = N >= 2n && M >= 2n ? (N - 2n) * (M - 2n) : 0n; return `${N * M - j} ${j}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, m;
        cin >> n >> m;
        long long jasne = 0;
        if (n >= 2 && m >= 2) jasne = (n - 2) * (m - 2);
        cout << n * m - jasne << " " << jasne << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-kasy', krok: 9, level: 'latwe',
            title: 'Kasy w sklepie',
            short: 'n klientów, k kas, każdy klient to c minut. Kiedy wszyscy będą obsłużeni? Dzielenie z zaokrągleniem w górę.',
            tags: ['dzielenie w górę', '(n + k − 1) / k', 'long long'],
            statement: ['W sklepie czeka n klientów i działa k kas. Obsłużenie jednego klienta trwa dokładnie c minut, a każda kasa obsługuje naraz jednego klienta. Gdy kasa się zwalnia, od razu podchodzi do niej następny klient z kolejki. Dla każdego z t zapytań (liczby n, k, c) wypisz, po ilu minutach wszyscy klienci będą obsłużeni.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby: n, k, c.'],
            output_format: ['t wierszy — czasy w minutach.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n, k ≤ 10¹⁸', '1 ≤ c ≤ 9'],
            examples: [{ input: '3\n10 3 2\n6 3 5\n1 1000 7', note: 'Dziesięciu klientów przy trzech kasach: cztery tury (3 + 3 + 3 + 1), każda po 2 minuty.' }],
            hint: R`Kasy pracują równocześnie, więc klienci są obsługiwani turami po k osób, a każda tura trwa c minut. Tur potrzeba n / k zaokrąglone w górę — na liczbach całkowitych (n + k − 1) / k. Wynik to liczba tur razy c (do 9 · 10¹⁸ — jeszcze mieści się w long long). Symulowanie tura po turze dla n = 10¹⁸ i k = 1 nie zdąży.`,
            tests: (r) => [wiersze([[String(E18), '1', '9'], [String(E18), String(E18), '9'], ['1', String(E18), '1'], [String(E18 - 1n), '2', '9'], ['7', '7', '3'], ['8', '7', '3'], ['1', '1', '1']]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 30)), String(r.int(1, 10)), String(r.int(1, 9))])),
                wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 1n, E18) : losLog(r, 18)), String(losLog(r, 18)), String(r.int(1, 9))]))],
            check: (inp) => sprawdzZapytania(inp, 3, 1000, ([n, k, c]) => n >= 1n && n <= E18 && k >= 1n && k <= E18 && c >= 1n && c <= 9n),
            solve: (inp) => zapytania(inp, 3).map(([n, k, c]) => String((big(n) + big(k) - 1n) / big(k) * big(c))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, k, c;
        cin >> n >> k >> c;
        long long tury = (n + k - 1) / k;
        cout << tury * c << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-kuranty', krok: 9, level: 'latwe',
            title: 'Kuranty',
            short: 'Zegar o każdej pełnej godzinie wybija tyle uderzeń, która jest godzina. Ile uderzeń przez h godzin? Co 12 godzin wszystko się powtarza.',
            tags: ['okres 12 godzin', '1 + 2 + … + 12 = 78', 'long long'],
            statement: ['Zegar na wieży o każdej pełnej godzinie wybija tyle uderzeń, ile wskazuje mała wskazówka: o pierwszej — 1, o drugiej — 2, …, o dwunastej — 12 (także o północy). Zegar ruszył tuż po północy. Dla każdego z t zapytań (liczby h) wypisz, ile uderzeń wybije łącznie przez najbliższe h godzin, czyli o pełnych godzinach 1, 2, …, h po starcie.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba h.'],
            output_format: ['t wierszy — liczby uderzeń.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ h ≤ 10¹⁸'],
            examples: [{ input: '3\n3\n12\n25', note: 'Przez 25 godzin: dwa pełne obroty tarczy (2 · 78) i jeszcze jedno uderzenie o pierwszej.' }],
            hint: R`Co 12 godzin wszystko się powtarza, a jeden pełny obrót tarczy to 1 + 2 + … + 12 = 78 uderzeń. Pełnych obrotów jest h / 12, a po nich zostaje r = h % 12 godzin, które dają 1 + 2 + … + r = r · (r + 1) / 2 uderzeń. Pętla po godzinach dla h = 10¹⁸ nie zdąży, a wynik przekracza 6 · 10¹⁸ — long long.`,
            tests: (r) => [wiersze([['1'], ['11'], ['12'], ['13'], ['23'], ['24'], [String(E18)], [String(E18 - 1n)]]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 60))])),
                wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 1n, E18) : losLog(r, 18))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([hh]) => hh >= 1n && hh <= E18),
            solve: (inp) => zapytania(inp, 1).map(([hh]) => { const H = big(hh), rr = H % 12n; return String((H / 12n) * 78n + rr * (rr + 1n) / 2n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long h;
        cin >> h;
        long long r = h % 12;
        cout << (h / 12) * 78 + r * (r + 1) / 2 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-turniej', krok: 9, level: 'latwe',
            title: 'Turniej pucharowy',
            short: 'n zawodników, przegrany odpada. Ile meczów i ile rund? Mecze bez pętli, rundy — pętlą z połowieniem.',
            tags: ['n − 1 meczów', 'połowienie w górę', 'logarytm'],
            statement: ['W turnieju pucharowym gra n zawodników. W każdej rundzie zawodnicy grają w parach, a przegrany odpada. Jeśli w rundzie jest nieparzysta liczba zawodników, jeden z nich przechodzi do następnej rundy bez gry. Turniej kończy się, gdy zostaje jeden zwycięzca. Dla każdego z t zapytań (liczby n) wypisz liczbę rund i liczbę rozegranych meczów.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — w każdym liczba rund i liczba meczów.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n8\n5\n1', note: 'Pięciu zawodników: 5 → 3 → 2 → 1 — trzy rundy i cztery mecze (2 + 1 + 1). Samotny zawodnik wygrywa bez gry.' }],
            hint: R`Mecze: każdy mecz eliminuje dokładnie jednego zawodnika, a odpaść musi n − 1 z nich — więc meczów jest n − 1, bez żadnej pętli. Rundy: po rundzie zostaje (n + 1) / 2 zawodników (połowa zaokrąglona w górę). Pętla while (n > 1) n = (n + 1) / 2; wykona się najwyżej około 60 razy.`,
            tests: (r) => [wiersze([['1'], ['2'], ['3'], ['4'], ['5'], [String(2n ** 59n)], [String(2n ** 59n + 1n)], [String(E18)]]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 100))])),
                wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 1n, E18) : losLog(r, 18))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= E18),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { let N = big(n); const mecze = N - 1n; let rundy = 0; while (N > 1n) { N = (N + 1n) / 2n; rundy++; } return `${rundy} ${mecze}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long mecze = n - 1;
        int rundy = 0;
        while (n > 1) {
            n = (n + 1) / 2;
            rundy++;
        }
        cout << rundy << " " << mecze << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-domek-z-kart', krok: 9, level: 'latwe',
            title: 'Domek z kart',
            short: 'Ile kart potrzeba na domek z k pięter? Daszki i poziome karty — dwie sumy Gaussa.',
            tags: ['suma Gaussa', 'k(3k + 1) / 2', 'long long'],
            statement: ['Domek z kart buduje się piętrami. Najwyższe piętro to jeden daszek z dwóch opartych o siebie kart. Każde niższe piętro ma o jeden daszek więcej niż piętro nad nim. Daszki piętra wyżej stoją na kartach położonych poziomo — po jednej poziomej karcie pod każdym z nich. Dla każdego z t zapytań (liczby pięter k) wypisz, ile kart potrzeba na cały domek.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba k.'],
            output_format: ['t wierszy — liczby kart.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '3\n1\n2\n3', note: 'Dwa piętra: daszek na górze (2 karty), dwa daszki na dole (4 karty) i jedna pozioma karta między nimi — razem 7.' }],
            hint: R`Daszki: na piętrach jest 1 + 2 + … + k daszków po dwie karty — razem k · (k + 1) kart. Poziome karty leżą pod daszkami wszystkich pięter oprócz najniższego: 1 + 2 + … + (k − 1) = (k − 1) · k / 2. Dodaj obie części (albo uprość do k · (3k + 1) / 2). Wszystko w long long — wynik sięga 1,5 · 10¹⁸.`,
            tests: (r) => [wiersze([['1'], ['2'], ['3'], ['1000000000'], ['999999999']]), wiersze(losZ(r, 30, () => [String(r.int(1, 100))])), wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? r.int(1, 1000000000) : r.int(1, 100000))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([k]) => k >= 1n && k <= 1000000000n),
            solve: (inp) => zapytania(inp, 1).map(([k]) => { const K = big(k); return String(K * (3n * K + 1n) / 2n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long k;
        cin >> k;
        long long daszki = k * (k + 1);          // 1 + 2 + ... + k daszków po 2 karty
        long long poziome = (k - 1) * k / 2;     // 1 + 2 + ... + (k - 1)
        cout << daszki + poziome << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-powyzej-sredniej', krok: 9, level: 'latwe',
            title: 'Powyżej średniej',
            short: 'Ile liczb z generatora jest większych od średniej? Dwa przejścia i mnożenie zamiast dzielenia.',
            tags: ['dwa przejścia', 'x · n > suma', 'bez liczb z przecinkiem'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz, ile jego wyrazów jest większych od średniej arytmetycznej wszystkich wyrazów.'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — ile wyrazów jest powyżej średniej.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'Średnia ciągu 3, 2, 5, 6, 3 to 19 / 5 = 3,8. Większe od niej są 5 i 6.' }],
            hint: R`Najpierw jedną pętlą policz sumę, potem drugą — licz wyrazy większe od średniej. Nie dziel: średnia nie musi być całkowita, a dzielenie całkowite ją obetnie. Warunek x > suma / n to to samo co x · n > suma — a to liczy się dokładnie w long long (do 10¹⁵). Liczenie średniej od nowa dla każdego wyrazu to O(n²).`,
            tests: (r) => ['1 5 3 2 10', '10 0 0 0 1', '10 0 1 1 1000', '7 4 0 4 5', P.losGen(r, 50, 100), P.losGen(r, 1000, 1000000000), '1000000 0 1 1 1000000000', '1000000 999999999 1 999999999 1000000000', P.losGen(r, 1000000, 1000000000), P.losGen(r, 1000000, 7)],
            check: sprawdzGen(1000000, 1000000000),
            solve: (inp) => { const { n, x } = gen(toks(inp)); let s = 0; for (let i = 0; i < n; i++) s += x[i]; let c = 0; for (let i = 0; i < n; i++) if (x[i] * n > s) c++; return String(c); },
            cpp: GEN_CPP + R`    long long suma = 0;
    for (int i = 0; i < n; i++) suma += x[i];
    int ile = 0;
    for (int i = 0; i < n; i++)
        if (x[i] * n > suma) ile++;     // x > suma / n, ale bez dzielenia
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-b-wynik-wolnego-programu', krok: 9, level: 'latwe',
            title: 'Wynik wolnego programu',
            short: 'Program z pętlą w pętli liczy pary o parzystej sumie. Wypisz to samo w O(n): wystarczy policzyć parzyste i nieparzyste.',
            tags: ['parzystość sumy', 'p · (p − 1) / 2', 'O(n) zamiast O(n²)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) w vectorze x i wypisz to, co wypisałby poniższy program — ale tak, żeby Twój program zdążył:', 'long long ile = 0; for (int i = 0; i < n; i++) for (int j = i + 1; j < n; j++) if ((x[i] + x[j]) % 2 == 0) ile++; cout << ile;'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — wynik programu z treści.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'Nieparzyste 3, 5, 3 tworzą trzy pary, parzyste 2 i 6 — jedną. Razem 4.' }],
            hint: R`Suma dwóch liczb jest parzysta, gdy obie są parzyste albo obie nieparzyste. Policz w jednym przejściu, ile jest wyrazów parzystych (p) i nieparzystych (q). Par z dwóch parzystych jest p · (p − 1) / 2, z dwóch nieparzystych — q · (q − 1) / 2. Program z treści dla miliona liczb zrobiłby pół biliona obrotów. Wynik w long long.`,
            tests: (r) => ['1 5 3 2 10', '2 1 1 1 10', '10 0 0 0 1', P.losGen(r, 50, 100), P.losGen(r, 1000, 1000000000), '1000000 0 1 1 1000000000', P.losGen(r, 1000000, 1000000000), P.losGen(r, 1000000, 999999937), '1000000 0 0 2 1000000000'],
            check: sprawdzGen(1000000, 1000000000),
            solve: (inp) => { const { n, x } = gen(toks(inp)); let p = 0; for (let i = 0; i < n; i++) if (x[i] % 2 === 0) p++; const q = n - p; return String(B(p) * B(p - 1) / 2n + B(q) * B(q - 1) / 2n); },
            cpp: GEN_CPP + R`    long long p = 0, q = 0;   // ile parzystych, ile nieparzystych
    for (int i = 0; i < n; i++) {
        if (x[i] % 2 == 0) p++;
        else q++;
    }
    cout << p * (p - 1) / 2 + q * (q - 1) / 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-b-zarowki', krok: 9, level: 'latwe',
            title: 'Żarówki na korytarzu',
            short: 'n żarówek, n osób, każda przełącza wielokrotności swojego numeru. Ile świeci na końcu? Wystarczy pierwiastek.',
            tags: ['dzielniki parami', 'kwadraty', 'pierwiastek z poprawką'],
            statement: ['Na korytarzu wisi n zgaszonych żarówek ponumerowanych od 1 do n. Przez korytarz przechodzi kolejno n osób: osoba numer i przełącza (zapala zgaszoną albo gasi zapaloną) każdą żarówkę, której numer jest wielokrotnością i. Dla każdego z t zapytań (liczby n) wypisz, ile żarówek świeci, gdy przejdą wszyscy.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby świecących żarówek.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n10\n1\n100', note: 'Dla n = 10 świecą żarówki 1, 4 i 9.' }],
            hint: R`Żarówka numer k jest przełączana tyle razy, ile k ma dzielników. Dzielniki chodzą parami (d i k / d), więc ich liczba jest nieparzysta tylko wtedy, gdy para się „skleja” (d = k / d) — czyli dla kwadratów. Świecą więc żarówki 1, 4, 9, 16, …, a jest ich tyle, ile wynosi pierwiastek z n zaokrąglony w dół. Licz go przez sqrtl z poprawką, jak w lekcji. Symulacja dla n = 10¹⁸ nie wchodzi w grę.`,
            tests: (r) => {
                const k = 999999999n;
                return [wiersze([['1'], ['2'], ['3'], ['4'], [String(E18)], [String(E18 - 1n)], [String(k * k)], [String(k * k - 1n)], [String(k * k + 1n)]]),
                    wiersze(losZ(r, 30, () => [String(r.int(1, 200))])),
                    wiersze(losZ(r, 1000, () => { if (r.int(0, 2) === 0) { const q = bigLos(r, 1n, 1000000000n); const v = q * q + B(r.int(-1, 1)); return [String(v < 1n ? 1n : v > E18 ? E18 : v)]; } return [String(r.int(0, 1) ? bigLos(r, 1n, E18) : losLog(r, 18))]; }))];
            },
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= E18),
            solve: (inp) => zapytania(inp, 1).map(([n]) => String(isqrt(big(n)))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long k = sqrtl(n);
        while (k * k > n) k--;
        while ((k + 1) * (k + 1) <= n) k++;
        cout << k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-numerowanie-stron', krok: 9, level: 'latwe',
            title: 'Numerowanie stron',
            short: 'Ile cyfr trzeba wydrukować, żeby ponumerować strony od 1 do n? Pogrupuj strony według liczby cyfr.',
            tags: ['grupy 1–9, 10–99, …', 'potęgi dziesiątki', 'long long'],
            statement: ['Książka ma n stron ponumerowanych od 1 do n. Dla każdego z t zapytań (liczby n) wypisz, ile cyfr trzeba łącznie wydrukować, żeby ponumerować wszystkie strony.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby cyfr.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁷'],
            examples: [{ input: '3\n9\n11\n100', note: 'Strony 1–9 to 9 cyfr, a strony 10 i 11 — jeszcze 4. Do setki: 9 + 90 · 2 + 3 = 192.' }],
            hint: R`Strony jednocyfrowe to 1–9 (9 stron), dwucyfrowe 10–99 (90 stron), trzycyfrowe 100–999 (900 stron) i tak dalej. Idź po potęgach dziesiątki p = 1, 10, 100, …, dopóki p ≤ n: w grupie od p do 10p − 1 do książki należy min(n, 10p − 1) − p + 1 stron, a każda z nich ma tyle cyfr, ile wynosi numer grupy. Grup jest najwyżej 18. Pętla po wszystkich stronach dla n = 10¹⁷ nie zdąży.`,
            tests: (r) => {
                const E17 = 10n ** 17n;
                return [wiersze([['1'], ['10'], ['99'], ['100'], ['101'], [String(E17)], [String(E17 - 1n)], [String(10n ** 16n)]]),
                    wiersze(losZ(r, 30, () => [String(r.int(1, 1000))])),
                    wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 1n, E17) : losLog(r, 17))]))];
            },
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= 10n ** 17n),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { const N = big(n); let s = 0n, d = 1n; for (let p = 1n; p <= N; p *= 10n, d++) { const kon = N < 10n * p - 1n ? N : 10n * p - 1n; s += (kon - p + 1n) * d; } return String(s); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long cyfry = 0;
        long long d = 1;    // ile cyfr mają strony z bieżącej grupy
        for (long long p = 1; p <= n; p *= 10) {
            long long koniec = min(n, 10 * p - 1);
            cyfry += (koniec - p + 1) * d;
            d++;
        }
        cout << cyfry << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-wspolne-wielokrotnosci', krok: 9, level: 'latwe',
            title: 'Wspólne wielokrotności',
            short: 'Ile liczb od 1 do n dzieli się i przez a, i przez b? NWW z lekcji o modulo — uważaj, żeby się nie przepełniła.',
            tags: ['NWW = a / NWD · b', 'przepełnienie', 'n / NWW'],
            statement: ['Dla każdego z t zapytań (liczby n, a, b) wypisz, ile liczb od 1 do n dzieli się jednocześnie przez a i przez b.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby: n, a, b.'],
            output_format: ['t wierszy — odpowiedzi.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n, a, b ≤ 10¹⁸'],
            examples: [{ input: '3\n100 4 6\n100 7 7\n1000000000000000000 999999999989 999999999961', note: 'Przez 4 i przez 6 dzielą się dokładnie wielokrotności 12 — do 100 jest ich 8. W ostatnim zapytaniu NWW to prawie 10²⁴.' }],
            hint: R`Liczba dzieli się przez a i przez b dokładnie wtedy, gdy dzieli się przez ich najmniejszą wspólną wielokrotność: NWW = a / NWD(a, b) · b (najpierw dziel, potem mnóż). Odpowiedź to n / NWW. Pułapka: NWW może przekroczyć zakres long long — na przykład dla dwóch dużych liczb pierwszych. Zanim pomnożysz, sprawdź, czy a / NWD > n / b: wtedy NWW > n i odpowiedź to 0.`,
            tests: (r) => [wiersze([[String(E18), '1', '1'], [String(E18), String(E18), String(E18)], ['1', '2', '3'], [String(E18), '1000000000', '1000000007'], [String(E18), '2', '500000000000000000'], [String(E18), '999999999989', '999999999961'], ['12', '12', '4'], ['11', '12', '4']]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 100)), String(r.int(1, 12)), String(r.int(1, 12))])),
                wiersze(losZ(r, 1000, () => {
                    // zwykle mała NWW (wynik > 0), czasem ogromna (wynik 0, pułapka przepełnienia)
                    const rodzaj = r.int(0, 4), g = losLog(r, 9);
                    const gr = rodzaj <= 2 ? 1000n : rodzaj === 3 ? 1000000n : E18 / g;
                    const u = bigLos(r, 1n, gr < E18 / g ? gr : E18 / g), v = bigLos(r, 1n, gr < E18 / g ? gr : E18 / g);
                    return [String(r.int(0, 1) ? bigLos(r, E18 / 1000n, E18) : losLog(r, 18)), String(g * u), String(g * v)];
                }))],
            check: (inp) => sprawdzZapytania(inp, 3, 1000, ([n, a, b]) => n >= 1n && n <= E18 && a >= 1n && a <= E18 && b >= 1n && b <= E18),
            solve: (inp) => zapytania(inp, 3).map(([n, a, b]) => { const N = big(n), A = big(a), Bb = big(b); const nww = A / gcdB(A, Bb) * Bb; return String(N / nww); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, a, b;
        cin >> n >> a >> b;
        long long g = __gcd(a, b);
        if (a / g > n / b) cout << 0 << "\n";      // NWW > n — i mogłoby się przepełnić
        else cout << n / (a / g * b) << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ ŚREDNIE
        {
            id: 'zc-b-kta-niepodzielna', krok: 9, level: 'srednie',
            title: 'k-ta liczba niepodzielna przez p',
            short: 'Wypisz k-tą dodatnią liczbę, która nie dzieli się przez p. Grupy po p liczb — wzór w O(1).',
            tags: ['grupy po p liczb', 'k + (k − 1) / (p − 1)', 'long long'],
            statement: ['Wypisujemy po kolei dodatnie liczby całkowite, pomijając wszystkie podzielne przez p. Dla każdego z t zapytań (liczby k i p) wypisz k-tą wypisaną liczbę.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: k i p.'],
            output_format: ['t wierszy — szukane liczby.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ k ≤ 10¹⁸', '2 ≤ p ≤ 10¹⁸'],
            examples: [{ input: '3\n5 3\n1 2\n1000000000000000000 2', note: 'Liczby niepodzielne przez 3: 1, 2, 4, 5, 7, … — piąta to 7. Niepodzielne przez 2 to liczby nieparzyste.' }],
            hint: R`W każdej grupie p kolejnych liczb (1…p, p + 1…2p, …) jest p − 1 liczb niepodzielnych przez p, a ostatnia jest podzielna. Przed k-tą wypisaną liczbą pełnych grup jest (k − 1) / (p − 1) i każda z nich dokłada jedną pominiętą liczbę. Wynik to k + (k − 1) / (p − 1). Wypisywanie po kolei dla k = 10¹⁸ nie zdąży.`,
            tests: (r) => [wiersze([['1', '2'], [String(E18), '2'], [String(E18), String(E18)], [String(E18), '3'], ['5', '3'], ['4', '5'], ['5', '5']]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 50)), String(r.int(2, 7))])),
                wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 1n, E18) : losLog(r, 18)), String(r.int(0, 1) ? B(r.int(2, 100)) : bigLos(r, 2n, losLog(r, 18) + 1n))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([k, p]) => k >= 1n && k <= E18 && p >= 2n && p <= E18),
            solve: (inp) => zapytania(inp, 2).map(([k, p]) => { const K = big(k), Pp = big(p); return String(K + (K - 1n) / (Pp - 1n)); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long k, p;
        cin >> k >> p;
        cout << k + (k - 1) / (p - 1) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-blizniacze', krok: 9, level: 'srednie',
            title: 'Liczby pierwsze bliźniacze',
            short: 'Ile par liczb pierwszych (p, p + 2) mieści się do n? 3000 pytań do 10⁷ — sito i tablica prefiksowa.',
            tags: ['sito Eratostenesa', 'pary p, p + 2', 'policz raz'],
            statement: ['Liczby pierwsze bliźniacze to pary liczb pierwszych różniących się o 2, na przykład (3, 5), (5, 7), (11, 13). Dostajesz q pytań; w każdym jest liczba n — wypisz, ile jest par bliźniaczych (p, p + 2), w których p + 2 ≤ n.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy liczba n.'],
            output_format: ['q wierszy — odpowiedzi.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ n ≤ 10⁷'],
            examples: [{ input: '3\n13\n4\n10000000', note: 'Do 13: (3, 5), (5, 7) i (11, 13).' }],
            hint: R`Zrób raz sito do 10⁷. Potem tablica ile: ile[i] = ile[i − 1] + 1, jeśli i oraz i − 2 są pierwsze (w przeciwnym razie + 0) — liczy pary, których większa liczba jest ≤ i. Odpowiedź na pytanie to ile[n]. Szukanie par osobno dla każdego pytania to miliardy działań.`,
            tests: (r) => [wiersze(Array.from({ length: 20 }, (_, i) => [String(i + 1)])), wiersze(losZ(r, 30, () => [String(r.int(1, 1000))])),
                wiersze(losZ(r, 3000, () => [String(r.int(9000000, 10000000))])), wiersze(losZ(r, 3000, () => [String(r.int(0, 1) ? r.int(1, 10000000) : Number(losLog(r, 7)))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 3000, ([n]) => n >= 1n && n <= 10000000n),
            solve: (inp) => { const zl = zlozone(); const N = 10000000; const ile = new Int32Array(N + 1); for (let i = 3; i <= N; i++) ile[i] = ile[i - 1] + (!zl[i] && !zl[i - 2] ? 1 : 0); return zapytania(inp, 1).map(([n]) => ile[Number(n)]).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const int N = 10000000;
` + SITO_CPP + R`    vector<int> ile(N + 1, 0);   // ile[i] — ile par (p, p + 2) z p + 2 <= i
    for (int i = 3; i <= N; i++)
        ile[i] = ile[i - 1] + (!zlozona[i] && !zlozona[i - 2] ? 1 : 0);
    int q;
    cin >> q;
    while (q--) {
        int n;
        cin >> n;
        cout << ile[n] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-trzy-dzielniki', krok: 9, level: 'srednie',
            title: 'Liczby z trzema dzielnikami',
            short: 'Ile liczb do n ma dokładnie trzy dzielniki? To kwadraty liczb pierwszych — sito do miliona i pierwiastek.',
            tags: ['kwadraty liczb pierwszych', 'sito do √n', 'pierwiastek z poprawką'],
            statement: ['Dostajesz q pytań; w każdym jest liczba n — wypisz, ile liczb od 1 do n ma dokładnie trzy dodatnie dzielniki.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy liczba n.'],
            output_format: ['q wierszy — odpowiedzi.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ n ≤ 10¹²'],
            examples: [{ input: '3\n10\n50\n1000000000000', note: 'Do 50 dokładnie trzy dzielniki mają 4, 9, 25 i 49 — kwadraty liczb pierwszych 2, 3, 5 i 7.' }],
            hint: R`Dzielniki chodzą parami, więc nieparzystą liczbę dzielników mają tylko kwadraty. Kwadrat k² ma dokładnie trzy dzielniki (1, k i k²) wtedy, gdy k jest liczbą pierwszą. Szukamy więc liczb pierwszych p z p² ≤ n, czyli p ≤ √n ≤ 10⁶. Zrób raz sito do 10⁶ i tablicę „ile liczb pierwszych do i”, a dla każdego pytania policz pierwiastek z n (sqrtl z poprawką).`,
            tests: (r) => {
                const T12 = 1000000000000n, p2 = 999983n * 999983n;
                return [wiersze([['1'], ['3'], ['4'], ['8'], ['9'], [String(T12)], [String(p2)], [String(p2 - 1n)], [String(T12 - 1n)]]),
                    wiersze(losZ(r, 30, () => [String(r.int(1, 400))])),
                    wiersze(losZ(r, 3000, () => { if (r.int(0, 2) === 0) { const q = bigLos(r, 1n, 1000000n); const v = q * q + B(r.int(-1, 0)); return [String(v < 1n ? 1n : v)]; } return [String(r.int(0, 1) ? bigLos(r, 1n, T12) : losLog(r, 12))]; }))];
            },
            check: (inp) => sprawdzZapytania(inp, 1, 3000, ([n]) => n >= 1n && n <= 1000000000000n),
            solve: (inp) => { const zl = zlozone(); const ile = new Int32Array(1000001); for (let i = 1; i <= 1000000; i++) ile[i] = ile[i - 1] + (zl[i] ? 0 : 1); return zapytania(inp, 1).map(([n]) => ile[Number(isqrt(big(n)))]).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const int N = 1000000;
` + SITO_CPP + R`    vector<int> ile(N + 1, 0);   // ile[i] — ile liczb pierwszych od 1 do i
    for (int i = 1; i <= N; i++) ile[i] = ile[i - 1] + (zlozona[i] ? 0 : 1);
    int q;
    cin >> q;
    while (q--) {
        long long n;
        cin >> n;
        long long k = sqrtl(n);
        while (k * k > n) k--;
        while ((k + 1) * (k + 1) <= n) k++;
        cout << ile[k] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-pary-o-roznicy-k', krok: 9, level: 'srednie',
            title: 'Pary o różnicy k',
            short: 'Ile par wyrazów różni się dokładnie o k? Tablica zliczeń: każda wartość v łączy się z v + k.',
            tags: ['tablica zliczeń', 'ile[v] · ile[v + k]', 'O(n + m)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz, ile jest par indeksów i < j, dla których |xᵢ − xⱼ| = k.'],
            input_format: ['Jeden wiersz z sześcioma liczbami: n, s, a, b, m, k.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁶', '0 ≤ s, a, b < m', '1 ≤ k ≤ 10⁶'],
            examples: [{ input: '5 3 7 1 10 1', note: 'Ciąg 3, 2, 5, 6, 3. Różnicę 1 mają dwie pary „3 i 2” (trójki są dwie) oraz para 5 i 6.' }],
            hint: R`Dla każdej wartości v policz, ile razy występuje: ile[v]. Każdy wyraz równy v łączy się w parę z każdym wyrazem równym v + k — takich par jest ile[v] · ile[v + k]. Zsumuj to po wszystkich v, dla których v + k < m. Pętla po wszystkich parach to pół biliona sprawdzeń. Wynik w long long.`,
            // generatory „pełnego okresu” (a = 21 albo 5) dają wiele różnych wartości, więc i wiele par
            tests: (r) => ['1 5 3 2 10 1', '10 0 0 0 1 1', '12 1 1 1 10 3', `50 ${r.int(0, 63)} 5 3 64 2`, `1000 ${r.int(0, 999)} 21 7 1000 7`, `${P.losGen(r, 1000, 1000)} 7`,
                '1000000 5 21 7 1000000 1', '1000000 5 21 7 1000000 999999', `600000 ${r.int(0, 999999)} 21 7 1000000 1000`, `1000000 ${r.int(0, 524287)} 5 3 524288 1`,
                `1000000 ${r.int(0, 999)} 21 13 1000 1`, `${P.losGen(r, 1000000, 1000000)} 1000`, `${P.losGen(r, 1000000, 500000)} 1000000`],
            check: sprawdzGenPlus(1000000, 1000000, (n, k) => k >= 1n && k <= 1000000n),
            solve: (inp) => { const t = toks(inp); const { n, m, x } = gen(t); const k = Number(t[5]); const c = new Float64Array(m); for (let i = 0; i < n; i++) c[x[i]]++; let p = 0; for (let v = 0; v + k < m; v++) p += c[v] * c[v + k]; return String(p); },
            cpp: GEN_CPP + R`    long long k;
    cin >> k;
    vector<long long> ile(m, 0);
    for (int i = 0; i < n; i++) ile[x[i]]++;
    long long pary = 0;
    for (long long v = 0; v + k < m; v++) pary += ile[v] * ile[v + k];
    cout << pary << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-b-ktory-okres', krok: 9, level: 'srednie',
            title: 'Który okres był cieplejszy?',
            short: 'Porównaj średnie temperatury dwóch okresów — sumy prefiksowe i mnożenie na krzyż zamiast dzielenia.',
            tags: ['sumy prefiksowe', 'mnożenie na krzyż', 'bez liczb z przecinkiem'],
            statement: ['Ciąg z generatora (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) to pomiary temperatury w kolejnych n godzinach. Dostajesz q pytań; w każdym są dwa okresy [l₁, r₁] i [l₂, r₂]. Wypisz 1, jeśli średnia temperatura w pierwszym okresie jest wyższa, 2 — jeśli w drugim, albo 0, jeśli średnie są równe.'],
            input_format: ['W pierwszym wierszu pięć liczb: n, s, a, b, m.', 'W drugim wierszu liczba q.', 'W każdym z następnych q wierszy cztery liczby: l₁, r₁, l₂, r₂.'],
            output_format: ['q wierszy — 1, 2 albo 0.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁶', '0 ≤ s, a, b < m', '1 ≤ q ≤ 2500', '1 ≤ l₁ ≤ r₁ ≤ n, 1 ≤ l₂ ≤ r₂ ≤ n'],
            examples: [{ input: '5 3 7 1 10\n3\n1 1 2 2\n1 2 3 4\n1 1 5 5', note: 'Ciąg 3, 2, 5, 6, 3. Średnia z [1, 2] to 2,5, a z [3, 4] — 5,5. Pierwszy i piąty wyraz są równe.' }],
            hint: R`Sumy okresów licz z sum prefiksowych — jedno odejmowanie na okres. Średnie to suma₁ / d₁ i suma₂ / d₂ (d — długości okresów), ale dzielenie całkowite obcina, a liczby z przecinkiem bywają niedokładne. Porównaj na krzyż: suma₁ / d₁ > suma₂ / d₂ wtedy i tylko wtedy, gdy suma₁ · d₂ > suma₂ · d₁. Iloczyny sięgają 10¹⁸ — long long. Liczenie każdej sumy pętlą to O(n) na pytanie.`,
            tests: (r) => {
                const okres = (n, dl) => { if (dl) { const l = r.int(1, Math.max(1, Math.floor(n / 10))); return [l, r.int(Math.max(l, Math.ceil((9 * n) / 10)), n)]; } const l = r.int(1, n); return [l, r.int(l, n)]; };
                const t = (gp, q, dl) => { const n = Number(gp.split(' ')[0]); return `${gp}\n${q}\n${losZ(r, q, () => { const a = okres(n, dl); const b = r.int(0, 9) ? okres(n, dl) : a; return `${a.join(' ')} ${b.join(' ')}`; }).join('\n')}`; };
                return [t('1 5 3 2 10', 1, false), t('6 2 1 1 3', 10, false), t('20 0 0 0 1', 10, false), t(P.losGen(r, 50, 100), 30, false), t(P.losGen(r, 1000, 1000000), 500, false),
                    t(P.losGen(r, 1000000, 1000000), 2500, true), t('1000000 5 21 7 1000000', 2500, true), t(P.losGen(r, 1000000, 1000), 2500, false)];
            },
            check: (inp) => {
                const t = toks(inp);
                if (!dobryG(t, 0, 1000000, 1000000)) return 'parametry generatora';
                const n = Number(t[0]), q = Number(t[5]);
                if (!(Number.isInteger(q) && q >= 1 && q <= 2500 && t.length === 6 + 4 * q)) return 'liczba pytań';
                for (let i = 0; i < q; i++) { const [l1, r1, l2, r2] = t.slice(6 + 4 * i, 10 + 4 * i).map(Number); if (!(l1 >= 1 && l1 <= r1 && r1 <= n && l2 >= 1 && l2 <= r2 && r2 <= n)) return 'okres'; }
                return null;
            },
            solve: (inp) => {
                const t = toks(inp); const { n, x } = gen(t);
                const Pr = new Float64Array(n + 1); for (let i = 1; i <= n; i++) Pr[i] = Pr[i - 1] + x[i - 1];
                const q = Number(t[5]); const out = [];
                for (let i = 0; i < q; i++) {
                    const [l1, r1, l2, r2] = t.slice(6 + 4 * i, 10 + 4 * i).map(Number);
                    const a = B(Pr[r1] - Pr[l1 - 1]) * B(r2 - l2 + 1), b = B(Pr[r2] - Pr[l2 - 1]) * B(r1 - l1 + 1);
                    out.push(a > b ? 1 : a < b ? 2 : 0);
                }
                return out.join('\n');
            },
            cpp: GEN_CPP + R`    vector<long long> P(n + 1, 0);
    for (int i = 1; i <= n; i++) P[i] = P[i - 1] + x[i - 1];
    int q;
    cin >> q;
    while (q--) {
        long long l1, r1, l2, r2;
        cin >> l1 >> r1 >> l2 >> r2;
        long long s1 = P[r1] - P[l1 - 1], d1 = r1 - l1 + 1;
        long long s2 = P[r2] - P[l2 - 1], d2 = r2 - l2 + 1;
        if (s1 * d2 > s2 * d1) cout << 1 << "\n";      // s1 / d1 > s2 / d2
        else if (s1 * d2 < s2 * d1) cout << 2 << "\n";
        else cout << 0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-rozklad-jazdy', krok: 9, level: 'srednie',
            title: 'Rozkład jazdy',
            short: 'Autobusy odjeżdżają o różnych porach, pasażerowie przychodzą na przystanek. Ile łącznie czekają? Sort i lower_bound.',
            tags: ['sort', 'lower_bound', 'suma czekania'],
            statement: ['Godziny odjazdów autobusów (w minutach, w dowolnej kolejności) daje generator z lekcji: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m. Na przystanek przychodzi q pasażerów; pasażer, który przyszedł w minucie t, wsiada do pierwszego autobusu odjeżdżającego w minucie t lub później. Wypisz łączny czas czekania wszystkich pasażerów, którzy odjechali, oraz liczbę pasażerów, dla których nie było już żadnego autobusu.'],
            input_format: ['W pierwszym wierszu pięć liczb: n, s, a, b, m.', 'W drugim wierszu liczba q.', 'W trzecim wierszu q liczb t — minuty przyjścia pasażerów.'],
            output_format: ['Dwie liczby: łączny czas czekania i liczba pasażerów bez autobusu.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '1 ≤ q ≤ 5000', '0 ≤ t ≤ 10⁹'],
            examples: [{ input: '5 3 7 1 10\n4\n0 4 6 7', note: 'Odjazdy po posortowaniu: 2, 3, 3, 5, 6. Pasażer z minuty 0 czeka 2 minuty, z minuty 4 — minutę, z minuty 6 nie czeka wcale, a z minuty 7 nie ma już autobusu.' }],
            hint: R`Posortuj godziny odjazdów raz. Dla pasażera z minuty t lower_bound(x.begin(), x.end(), t) wskazuje pierwszy autobus o godzinie ≥ t — albo x.end(), jeśli takiego nie ma. Szukanie autobusu pętlą po wszystkich odjazdach to O(n) na pasażera. Łączny czas czekania może przekroczyć zakres int — long long.`,
            tests: (r) => {
                const t = (gp, q) => { const [n, s, a, b, m] = gp.split(' ').map(Number); const x = P.generuj(n, s, a, b, m); return `${gp}\n${q}\n${losZ(r, q, () => { const w = r.int(0, 9); return w <= 2 ? x[r.int(0, n - 1)] : w === 3 ? Math.min(1000000000, Math.max(0, m - r.int(-3000, 3000))) : r.int(0, r.int(0, 1) ? m : 1000000000); }).join(' ')}`; };
                return [t('1 5 3 2 10', 3), t('10 0 0 0 1', 5), t('10 3 1 1 10', 10), t(P.losGen(r, 50, 1000), 30), t(P.losGen(r, 1000, 1000000000), 1000),
                    t(P.losGen(r, 1000000, 1000000000), 5000), t(P.losGen(r, 1000000, 999999937), 5000), t('1000000 0 1 1000 1000000000', 5000)];
            },
            check: (inp) => { const t = toks(inp); if (!dobryG(t, 0, 1000000, 1000000000)) return 'parametry generatora'; const q = Number(t[5]); if (!(Number.isInteger(q) && q >= 1 && q <= 5000 && t.length === 6 + q)) return 'liczba pytań'; return t.slice(6).every((v) => /^\d+$/.test(v) && Number(v) <= 1000000000) ? null : 'minuta'; },
            solve: (inp) => { const t = toks(inp); const a = Float64Array.from(gen(t).x).sort(); let w = 0, brak = 0; for (const v of t.slice(6).map(Number)) { const i = lb(a, v); if (i < a.length) w += a[i] - v; else brak++; } return `${w} ${brak}`; },
            cpp: GEN_CPP + R`    sort(x.begin(), x.end());
    int q;
    cin >> q;
    long long czekanie = 0;
    int bezAutobusu = 0;
    while (q--) {
        long long t;
        cin >> t;
        auto it = lower_bound(x.begin(), x.end(), t);
        if (it == x.end()) bezAutobusu++;
        else czekanie += *it - t;
    }
    cout << czekanie << " " << bezAutobusu << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-b-dokladnie-k-warstw', krok: 9, level: 'srednie',
            title: 'Dokładnie k warstw',
            short: 'Po 5000 malowaniach płotu odpowiedz, ile desek ma dokładnie k warstw. Tablica różnic, a potem tablica zliczeń.',
            tags: ['tablica różnic', 'tablica zliczeń', 'O(n + q + p)'],
            statement: ['Płot ma n desek ponumerowanych od 1 do n. Malarz q razy maluje deski od l do r — każde malowanie kładzie na nich jedną warstwę farby. Potem pada p pytań: ile desek ma dokładnie k warstw?'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z następnych q wierszy dwie liczby: l i r.', 'Potem wiersz z liczbą p i wiersz z p liczbami k.'],
            output_format: ['p wierszy — odpowiedzi.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ q ≤ 5000', '1 ≤ l ≤ r ≤ n', '1 ≤ p ≤ 1000', '0 ≤ k ≤ 10⁹'],
            examples: [{ input: '10 3\n1 4\n3 6\n9 9\n3\n0 1 2', note: 'Warstwy na deskach: 1 1 2 2 1 1 0 0 1 0. Trzy deski są niepomalowane, pięć ma jedną warstwę, dwie — dwie.' }],
            hint: R`Najpierw tablica różnic z lekcji: d[l]++ i d[r + 1]-- dla każdego malowania, a potem jedno przejście, które liczy warstwy na kolejnych deskach. W tym samym przejściu zliczaj: ile[warstwy]++. Warstw jest najwyżej q, więc tablica ile ma q + 1 pól, a dla k > q odpowiedź to 0 (uważaj, żeby nie sięgnąć poza tablicę).`,
            tests: (r) => {
                const t = (n, q, p, dl) => {
                    const prz = losZ(r, q, () => { if (dl) { const l = r.int(1, Math.max(1, Math.floor(n / 10))); return `${l} ${r.int(Math.max(l, Math.ceil((9 * n) / 10)), n)}`; } const l = r.int(1, n); return `${l} ${r.int(l, n)}`; });
                    return `${n} ${q}\n${prz.join('\n')}\n${p}\n${losZ(r, p, () => (r.int(0, 9) ? r.int(0, Math.min(q + 2, 1000000000)) : r.int(0, 1000000000))).join(' ')}`;
                };
                return [t(1, 1, 3, false), t(5, 3, 5, false), t(30, 10, 15, false), t(1000, 500, 300, false), t(1000000, 5000, 1000, true), t(1000000, 5000, 1000, false), t(1000000, 3000, 1000, false)];
            },
            check: (inp) => {
                const t = toks(inp).map(Number); const [n, q] = t;
                if (!(n >= 1 && n <= 1000000 && q >= 1 && q <= 5000)) return 'n, q';
                for (let i = 0; i < q; i++) { const l = t[2 + 2 * i], rr = t[3 + 2 * i]; if (!(Number.isInteger(l) && Number.isInteger(rr) && l >= 1 && l <= rr && rr <= n)) return 'przedział'; }
                const p = t[2 + 2 * q]; if (!(Number.isInteger(p) && p >= 1 && p <= 1000 && t.length === 3 + 2 * q + p)) return 'p';
                return t.slice(3 + 2 * q).every((k) => Number.isInteger(k) && k >= 0 && k <= 1000000000) ? null : 'k';
            },
            solve: (inp) => {
                const t = toks(inp).map(Number); const [n, q] = t;
                const d = new Int32Array(n + 2); for (let i = 0; i < q; i++) { d[t[2 + 2 * i]]++; d[t[3 + 2 * i] + 1]--; }
                const ile = new Int32Array(q + 1); let w = 0; for (let i = 1; i <= n; i++) { w += d[i]; ile[w]++; }
                return t.slice(3 + 2 * q).map((k) => (k <= q ? ile[k] : 0)).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<int> d(n + 2, 0);
    for (int i = 0; i < q; i++) {
        int l, r;
        cin >> l >> r;
        d[l]++;
        d[r + 1]--;
    }
    vector<int> ile(q + 1, 0);   // ile[w] — ile desek ma dokładnie w warstw
    int warstwy = 0;
    for (int i = 1; i <= n; i++) {
        warstwy += d[i];
        ile[warstwy]++;
    }
    int p;
    cin >> p;
    while (p--) {
        long long k;
        cin >> k;
        if (k <= q) cout << ile[k] << "\n";
        else cout << 0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-pary-z-dwoch-list', krok: 9, level: 'srednie',
            title: 'Pary z dwóch list',
            short: 'Ile par (liczba z pierwszej listy i liczba z drugiej) ma sumę ≤ S? Posortuj obie listy i idź dwoma wskaźnikami.',
            tags: ['sort', 'dwa wskaźniki', 'O(n log n)'],
            statement: ['Dwa generatory (każdy jak w lekcji: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) dają dwie listy: x₁, …, xₙ₁ i y₁, …, yₙ₂. Wypisz, ile jest par (i, j), dla których xᵢ + yⱼ ≤ S.'],
            input_format: ['W pierwszym wierszu pięć liczb opisujących pierwszą listę: n₁, s₁, a₁, b₁, m₁.', 'W drugim wierszu pięć liczb opisujących drugą listę: n₂, s₂, a₂, b₂, m₂.', 'W trzecim wierszu liczba S.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n₁, n₂ ≤ 5 · 10⁵', '1 ≤ m₁, m₂ ≤ 10⁹', '0 ≤ s, a, b < m (w każdym wierszu)', '0 ≤ S ≤ 2 · 10⁹'],
            examples: [{ input: '5 3 7 1 10\n4 1 2 3 10\n7', note: 'Listy 3, 2, 5, 6, 3 i 1, 5, 3, 9. Dwójka pasuje do 1, 5 i 3, każda trójka do 1 i 3, a piątka i szóstka — tylko do jedynki: 3 + 2 · 2 + 1 + 1 = 9.' }],
            hint: R`Posortuj obie listy. Idź po x od najmniejszego, a wskaźnik j ustaw na końcu listy y. Dla każdego x cofaj j, dopóki x + y[j] > S — wtedy wszystkie y[0..j] pasują, więc dodaj j + 1. Gdy x rośnie, dobrych y może tylko ubywać, więc j cofa się tylko w lewo i cała pętla to O(n₁ + n₂). Działa też upper_bound dla każdego x. Wynik do 2,5 · 10¹¹ — long long.`,
            tests: (r) => [`1 5 3 2 10\n1 4 3 2 10\n9`, `1 5 3 2 10\n1 4 3 2 10\n8`, `10 0 0 0 1\n7 0 0 0 1\n0`, `${P.losGen(r, 50, 100)}\n${P.losGen(r, 40, 100)}\n100`, `${P.losGen(r, 1000, 1000000000)}\n${P.losGen(r, 1000, 1000000000)}\n1000000000`,
                `${P.losGen(r, 500000, 1000000000)}\n${P.losGen(r, 500000, 1000000000)}\n1000000000`, `${P.losGen(r, 500000, 1000000000)}\n${P.losGen(r, 500000, 1000000000)}\n2000000000`, `${P.losGen(r, 500000, 1000000000)}\n${P.losGen(r, 300000, 1000)}\n300000000`, '500000 0 1 1 1000000000\n500000 0 1 2 1000000000\n600000'],
            check: (inp) => { const t = toks(inp); return t.length === 11 && dobryG(t, 0, 500000, 1000000000) && dobryG(t, 5, 500000, 1000000000) && liczba(t[10]) && Number(t[10]) >= 0 && Number(t[10]) <= 2000000000 ? null : 'parametry'; },
            solve: (inp) => { const t = toks(inp); const x = Float64Array.from(gen(t, 0).x).sort(), y = Float64Array.from(gen(t, 5).x).sort(); const S = Number(t[10]); let j = y.length - 1, c = 0; for (let i = 0; i < x.length; i++) { while (j >= 0 && x[i] + y[j] > S) j--; c += j + 1; } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n1, s1, a1, b1, m1, n2, s2, a2, b2, m2, S;
    cin >> n1 >> s1 >> a1 >> b1 >> m1 >> n2 >> s2 >> a2 >> b2 >> m2 >> S;
    vector<long long> x(n1), y(n2);
    x[0] = s1;
    for (int i = 1; i < n1; i++) x[i] = (x[i - 1] * a1 + b1) % m1;
    y[0] = s2;
    for (int i = 1; i < n2; i++) y[i] = (y[i - 1] * a2 + b2) % m2;
    sort(x.begin(), x.end());
    sort(y.begin(), y.end());
    long long pary = 0;
    int j = n2 - 1;
    for (int i = 0; i < n1; i++) {
        while (j >= 0 && x[i] + y[j] > S) j--;
        pary += j + 1;    // x[i] pasuje do y[0], ..., y[j]
    }
    cout << pary << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-b-najlepszy-fragment', krok: 9, level: 'srednie',
            title: 'Najlepszy fragment',
            short: 'Największa suma spójnego fragmentu ciągu z liczbami ujemnymi. To „najlepszy zysk” na sumach prefiksowych.',
            tags: ['sumy prefiksowe', 'minimum dotąd', 'O(n)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m), a potem od każdego wyrazu odejmij c: zᵢ = xᵢ − c. Wypisz największą sumę niepustego spójnego fragmentu ciągu z.'],
            input_format: ['Jeden wiersz z sześcioma liczbami: n, s, a, b, m, c.'],
            output_format: ['Jedna liczba — największa suma fragmentu.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '0 ≤ c ≤ 10⁹'],
            examples: [{ input: '5 3 7 1 10 4', note: 'Ciąg z to −1, −2, 1, 2, −1. Najlepszy fragment to 1, 2.' }, { input: '3 5 3 2 10 9', note: 'Ciąg z to −4, −2, −6. Gdy wszystkie liczby są ujemne, najlepszy jest jeden wyraz — największy.' }],
            hint: R`Suma fragmentu od i + 1 do j to P[j] − P[i] (sumy prefiksowe, P[0] = 0). Dla każdego j chcemy odjąć najmniejsze P[i] z i < j — dokładnie jak w zadaniu „Najlepszy zysk”: idź po j i pamiętaj najmniejszą sumę prefiksową dotąd. Fragment nie może być pusty, więc minimum bierz tylko z pozycji wcześniejszych niż j. Sprawdzanie wszystkich fragmentów to O(n²).`,
            tests: (r) => ['1 5 3 2 10 9', '1 5 3 2 10 0', '10 0 0 0 1 0', '10 0 0 0 1 5', `${P.losGen(r, 50, 100)} 50`, `${P.losGen(r, 1000, 1000000000)} 500000000`,
                `${P.losGen(r, 1000000, 1000000000)} 500000000`, `${P.losGen(r, 1000000, 1000000000)} 499000000`, `${P.losGen(r, 1000000, 1000000000)} 1000000000`, `${P.losGen(r, 1000000, 1000000000)} 0`, '1000000 0 1 1 1000000000 500000'],
            check: sprawdzGenPlus(1000000, 1000000000, (n, c) => c >= 0n && c <= 1000000000n),
            solve: (inp) => { const t = toks(inp); const { n, x } = gen(t); const c = Number(t[5]); let pre = 0, mn = 0, best = -Infinity; for (let i = 0; i < n; i++) { pre += x[i] - c; if (pre - mn > best) best = pre - mn; if (pre < mn) mn = pre; } return String(best); },
            cpp: GEN_CPP + R`    long long c;
    cin >> c;
    long long pref = 0, najmPref = 0;   // P[0] = 0
    long long najlepsza = x[0] - c;
    for (int i = 0; i < n; i++) {
        pref += x[i] - c;                          // pref = P[i + 1]
        najlepsza = max(najlepsza, pref - najmPref);
        najmPref = min(najmPref, pref);
    }
    cout << najlepsza << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-b-ile-czynnikow', krok: 9, level: 'srednie',
            title: 'Ile różnych czynników pierwszych?',
            short: 'Dla każdej liczby do 10⁷ policz różne czynniki pierwsze — sitem, nie rozkładem każdej liczby osobno.',
            tags: ['sito', 'liczba pierwsza odwiedza wielokrotności', 'O(n log log n)'],
            statement: ['Dla danej liczby n wypisz dziewięć liczb: dla k = 0, 1, …, 8 — ile liczb od 1 do n ma dokładnie k różnych dzielników pierwszych. Liczba 1 nie ma żadnego, a 12 = 2 · 2 · 3 ma dwa: 2 i 3.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dziewięć liczb oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 10⁷'],
            examples: [{ input: '12', note: 'Do 12 dwa różne czynniki pierwsze mają 6, 10 i 12, a jeden — 2, 3, 4, 5, 7, 8, 9 i 11. Liczby do 10⁷ mają najwyżej osiem różnych czynników pierwszych.' }],
            hint: R`Rozkładanie każdej liczby osobno to miliony pętli do pierwiastka. Zrób to jak sito: vector<int> ile(n + 1, 0); dla każdego p od 2 do n — jeśli ile[p] == 0, to żadna mniejsza liczba pierwsza nie dzieli p, więc p jest pierwsza; wtedy dodaj 1 do ile[k] dla każdej wielokrotności k = p, 2p, 3p, … ≤ n. Na koniec zlicz, ile liczb ma każdą wartość ile. Całość to około n · ln ln n kroków.`,
            tests: () => ['1', '2', '30', '1000', '210', '9699690', '10000000', '5000000', '7777777'],
            check: (inp) => (/^\d+$/.test(inp) && Number(inp) >= 1 && Number(inp) <= 10000000 ? null : 'n'),
            solve: (inp) => { const n = Number(inp); const w = new Uint8Array(n + 1); for (let p = 2; p <= n; p++) if (w[p] === 0) for (let k = p; k <= n; k += p) w[k]++; const hist = new Array(9).fill(0); for (let i = 1; i <= n; i++) hist[w[i]]++; return hist.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> ile(n + 1, 0);   // ile[i] — ile różnych liczb pierwszych dzieli i
    for (int p = 2; p <= n; p++)
        if (ile[p] == 0)             // p jest pierwsza
            for (int k = p; k <= n; k += p) ile[k]++;
    vector<int> wynik(9, 0);
    for (int i = 1; i <= n; i++) wynik[ile[i]]++;
    for (int k = 0; k <= 8; k++) cout << wynik[k] << (k < 8 ? " " : "\n");
    return 0;
}`,
        },
        // ================================================================ TRUDNE
        {
            id: 'zc-b-liczby-gladkie', krok: 9, level: 'trudne',
            title: 'Liczby z dzielnikami 2, 3 i 5',
            short: 'Ile liczb do n nie ma innych czynników pierwszych niż 2, 3 i 5? Trzy pętle po potęgach — około 11 tysięcy obrotów nawet dla 10¹⁸.',
            tags: ['potęgi 2, 3 i 5', 'trzy pętle', 'p <= n / 5'],
            statement: ['Liczby gładkie to takie, których jedynymi dzielnikami pierwszymi mogą być 2, 3 i 5: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16, … (1 też się liczy, a na przykład 7 czy 14 — już nie). Dla każdego z t zapytań (liczby n) wypisz, ile liczb gładkich jest od 1 do n.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby liczb gładkich.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n16\n1\n1000000000000000000', note: 'Do 16 są to: 1, 2, 3, 4, 5, 6, 8, 9, 10, 12, 15, 16.' }],
            hint: R`Każda liczba gładka to 2ᵃ · 3ᵇ · 5ᶜ. Przejdź trzema zagnieżdżonymi pętlami: p2 = 1, 2, 4, … (dopóki p2 ≤ n), w środku p3 = p2, 3 · p2, 9 · p2, … (dopóki ≤ n), a w środku p5 = p3, 5 · p3, … — każda kombinacja to jedna liczba gładka. Do 10¹⁸ jest ich niecałe 11 tysięcy. Uważaj na przepełnienie: zamiast p * 5 <= n sprawdzaj p <= n / 5. Sprawdzanie po kolei każdej liczby od 1 do n nie zdąży.`,
            tests: (r) => {
                const g = gladkie();
                return [wiersze([['1'], ['2'], ['7'], ['16'], [String(E18)], [String(E18 - 1n)], [String(g[g.length - 1])], [String(g[g.length - 1] - 1n)]]),
                    wiersze(losZ(r, 30, () => [String(r.int(1, 200))])),
                    wiersze(losZ(r, 1000, () => [String(r.int(0, 2) === 0 ? g[r.int(0, g.length - 1)] + B(r.int(-1, 0)) || 1n : r.int(0, 1) ? bigLos(r, 1n, E18) : losLog(r, 18))]))];
            },
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= E18),
            solve: (inp) => { const g = gladkie(); return zapytania(inp, 1).map(([n]) => { const N = big(n); let l = 0, rr = g.length; while (l < rr) { const s = (l + rr) >> 1; if (g[s] <= N) l = s + 1; else rr = s; } return String(l); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long ile = 0;
        for (long long p2 = 1; ; p2 *= 2) {
            for (long long p3 = p2; ; p3 *= 3) {
                for (long long p5 = p3; ; p5 *= 5) {
                    ile++;                       // p5 = 2^a * 3^b * 5^c <= n
                    if (p5 > n / 5) break;       // p5 * 5 byłoby > n
                }
                if (p3 > n / 3) break;
            }
            if (p2 > n / 2) break;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-bez-powtorzen', krok: 9, level: 'trudne',
            title: 'Najdłuższy fragment bez powtórzeń',
            short: 'Najdłuższy spójny fragment, w którym żadna liczba się nie powtarza. Okno z dwoma wskaźnikami i tablica liczników.',
            tags: ['dwa wskaźniki', 'tablica liczników', 'O(n + m)'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz długość najdłuższego spójnego fragmentu, w którym wszystkie wyrazy są różne.'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — długość fragmentu.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁶', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'W ciągu 3, 2, 5, 6, 3 najdłuższe fragmenty bez powtórzeń to 3, 2, 5, 6 i 2, 5, 6, 3.' }],
            hint: R`Okno jak w zadaniu o sumie ≤ S: prawy koniec idzie po kolei, a w tablicy ile (o rozmiarze m) trzymasz, ile razy każda wartość jest w oknie. Zanim dołożysz x[r], zabieraj wyrazy z lewej, dopóki ile[x[r]] > 0. Każdy wyraz raz wchodzi do okna i raz z niego wychodzi — O(n). Sprawdzanie każdego początku osobno działa wolno, gdy fragmenty bez powtórzeń są długie.`,
            tests: (r) => ['1 0 0 0 1', '10 0 0 0 1', '12 1 1 1 10', P.losGen(r, 50, 30), P.losGen(r, 1000, 1000), '1000000 5 21 7 1000000', '1000000 0 1 1 1000000', '1000000 0 1 1 999999', P.losGen(r, 1000000, 1000000), P.losGen(r, 1000000, 999983), P.losGen(r, 1000000, 5000)],
            check: sprawdzGen(1000000, 1000000),
            solve: (inp) => { const { n, m, x } = gen(toks(inp)); const ile = new Int32Array(m); let l = 0, best = 0; for (let rr = 0; rr < n; rr++) { while (ile[x[rr]] > 0) { ile[x[l]]--; l++; } ile[x[rr]]++; if (rr - l + 1 > best) best = rr - l + 1; } return String(best); },
            cpp: GEN_CPP + R`    vector<int> ile(m, 0);   // ile razy wartość jest w oknie x[l..r]
    int l = 0, najdluzszy = 0;
    for (int r = 0; r < n; r++) {
        while (ile[x[r]] > 0) {   // x[r] już jest w oknie — zabieraj z lewej
            ile[x[l]]--;
            l++;
        }
        ile[x[r]]++;
        najdluzszy = max(najdluzszy, r - l + 1);
    }
    cout << najdluzszy << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-b-fragmenty-o-sumie-zero', krok: 9, level: 'trudne',
            title: 'Fragmenty o sumie zero',
            short: 'Ile spójnych fragmentów ma sumę 0? Taki fragment to dwie równe sumy prefiksowe — posortuj je i policz pary.',
            tags: ['sumy prefiksowe', 'sort', 'pary równych'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m), a potem od każdego wyrazu odejmij c: zᵢ = xᵢ − c. Wypisz, ile jest spójnych fragmentów ciągu z (od l do r, l ≤ r), których suma jest równa 0.'],
            input_format: ['Jeden wiersz z sześcioma liczbami: n, s, a, b, m, c.'],
            output_format: ['Jedna liczba — liczba fragmentów.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '0 ≤ c ≤ 10⁹'],
            examples: [{ input: '5 3 7 1 10 4', note: 'Ciąg z to −1, −2, 1, 2, −1. Sumę 0 mają fragmenty −1, −2, 1, 2 oraz −2, 1, 2, −1.' }],
            hint: R`Suma fragmentu od l do r to P[r] − P[l − 1], więc jest równa 0 dokładnie wtedy, gdy P[r] = P[l − 1]. Policz sumy prefiksowe P[0], P[1], …, P[n] (P[0] = 0) i zlicz pary równych. Posortuj je: równe staną obok siebie, a grupa k równych wartości daje k · (k − 1) / 2 par. Sprawdzanie wszystkich fragmentów to O(n²). Wynik w long long.`,
            tests: (r) => ['1 0 0 0 1 0', '1 5 3 2 10 4', '10 0 0 0 1 0', '12 0 1 1 3 1', `${P.losGen(r, 50, 5)} 2`, `${P.losGen(r, 1000, 3)} 1`,
                '1000000 0 1 1 3 1', `${P.losGen(r, 1000000, 7)} 3`, `${P.losGen(r, 1000000, 1001)} 500`, `${P.losGen(r, 1000000, 1000000000)} 500000000`, '1000000 7 5 3 1048576 524288', '1000000 0 0 0 1 0'],
            check: sprawdzGenPlus(1000000, 1000000000, (n, c) => c >= 0n && c <= 1000000000n),
            solve: (inp) => { const t = toks(inp); const { n, x } = gen(t); const c = Number(t[5]); const Pr = new Float64Array(n + 1); for (let i = 1; i <= n; i++) Pr[i] = Pr[i - 1] + x[i - 1] - c; Pr.sort(); let s = 0n; let i = 0; while (i <= n) { let j = i; while (j <= n && Pr[j] === Pr[i]) j++; const k = B(j - i); s += k * (k - 1n) / 2n; i = j; } return String(s); },
            cpp: GEN_CPP + R`    long long c;
    cin >> c;
    vector<long long> P(n + 1, 0);
    for (int i = 1; i <= n; i++) P[i] = P[i - 1] + x[i - 1] - c;
    sort(P.begin(), P.end());
    long long fragmenty = 0;
    int i = 0;
    while (i <= n) {
        int j = i;
        while (j <= n && P[j] == P[i]) j++;   // P[i..j-1] są równe
        long long k = j - i;
        fragmenty += k * (k - 1) / 2;
        i = j;
    }
    cout << fragmenty << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-b-maszyny', krok: 9, level: 'trudne',
            title: 'Maszyny w fabryce',
            short: 'n maszyn, każda robi jedną sztukę co tᵢ sekund. Po jakim czasie będzie k sztuk? Wyszukiwanie binarne po odpowiedzi.',
            tags: ['wyszukiwanie binarne po odpowiedzi', 'suma T / tᵢ', 'przerwij, zanim się przepełni'],
            statement: ['W fabryce pracuje n maszyn. Maszyna numer i potrzebuje tᵢ sekund na wyprodukowanie jednej sztuki; wszystkie pracują równocześnie i bez przerw, więc po T sekundach maszyna i ma gotowych T / tᵢ sztuk (dzielenie całkowite). Czasy to tᵢ = xᵢ + 1, gdzie x to ciąg z generatora z lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m). Wypisz najmniejsze T, po którym wszystkie maszyny razem wyprodukują co najmniej k sztuk.'],
            input_format: ['Jeden wiersz z sześcioma liczbami: n, s, a, b, m, k.'],
            output_format: ['Jedna liczba — najmniejsze T.'],
            constraints: ['1 ≤ n ≤ 200 000', '1 ≤ m ≤ 10⁶', '0 ≤ s, a, b < m', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '3 1 2 1 5 10', note: 'Czasy maszyn to 2, 4 i 3 sekundy. Po 9 sekundach jest 4 + 2 + 3 = 9 sztuk, po 10 — 5 + 2 + 3 = 10.' }],
            hint: R`Warunek „po T sekundach jest co najmniej k sztuk” jest fałszywy dla małych T i prawdziwy dla dużych — zmienia się tylko raz, więc szukaj T binarnie, jak w lekcji. Odpowiedź leży między 1 a k · t₁ (sama pierwsza maszyna zrobi k sztuk w tym czasie). Szukasz najmniejszego dobrego T: gdy warunek jest spełniony dla środka s = (l + r) / 2, ustaw r = s, a w przeciwnym razie l = s + 1. Dla danego T sumuj T / tᵢ, ale przerwij, gdy suma osiągnie k — dla dużego T i wielu szybkich maszyn mogłaby przepełnić nawet long long.`,
            tests: (r) => ['1 0 0 0 1 1', '1 999999 0 0 1000000 1000000000', '3 1 2 1 5 10', `${P.losGen(r, 30, 20)} 100`, `${P.losGen(r, 1000, 1000000)} 1000000`,
                `${P.losGen(r, 200000, 1000000)} 1000000000`, `${P.losGen(r, 200000, 1000000)} 1`, '200000 0 0 0 1 1000000000', '200000 0 1 1 1000000 1000000000', `${P.losGen(r, 200000, 10)} 1000000000`, `${P.losGen(r, 200000, 1000000)} 987654321`],
            check: sprawdzGenPlus(200000, 1000000, (n, k) => k >= 1n && k <= 1000000000n),
            solve: (inp) => {
                const t = toks(inp); const { n, x } = gen(t); const k = Number(t[5]);
                let l = 1, rr = k * (x[0] + 1);
                while (l < rr) { const T = Math.floor((l + rr) / 2); let s = 0; for (let i = 0; i < n && s < k; i++) s += dziel(T, x[i] + 1); if (s >= k) rr = T; else l = T + 1; }
                return String(l);
            },
            cpp: GEN_CPP + R`    long long k;
    cin >> k;
    long long l = 1, r = k * (x[0] + 1);   // pierwsza maszyna sama zrobi k sztuk w k * t1 sekund
    while (l < r) {
        long long T = (l + r) / 2;
        long long sztuki = 0;
        for (int i = 0; i < n && sztuki < k; i++) sztuki += T / (x[i] + 1);
        if (sztuki >= k) r = T;     // T wystarczy — może da się szybciej
        else l = T + 1;             // za mało — potrzeba więcej czasu
    }
    cout << l << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-b-tabliczka-mnozenia', krok: 9, level: 'trudne',
            title: 'k-ta liczba tabliczki mnożenia',
            short: 'Tabliczka n × m, wszystkie iloczyny ustawione rosnąco. Jaka liczba stoi na miejscu k? Zgaduj binarnie wartość i licz iloczyny ≤ X.',
            tags: ['wyszukiwanie binarne po odpowiedzi', 'min(m, X / i)', 'O(n log)'],
            statement: ['Tabliczka mnożenia ma n wierszy i m kolumn: w wierszu i i kolumnie j stoi liczba i · j. Wszystkie n · m liczb (z powtórzeniami) ustawiamy od najmniejszej do największej. Dla każdego z t zapytań (liczby n, m, k) wypisz liczbę, która stoi na miejscu k (licząc od 1).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby: n, m, k.'],
            output_format: ['t wierszy — szukane liczby.'],
            constraints: ['1 ≤ t ≤ 5', '1 ≤ n ≤ 10⁵', '1 ≤ m ≤ 10⁹', '1 ≤ k ≤ n · m'],
            examples: [{ input: '3\n3 3 5\n2 3 6\n100000 1000000000 1', note: 'Tabliczka 3 × 3 po posortowaniu: 1, 2, 2, 3, 3, 4, 6, 6, 9 — piąta jest trójka.' }],
            hint: R`Wypisanie i posortowanie wszystkich iloczynów to nawet 10¹⁴ liczb. Zamiast tego zgaduj odpowiedź: dla danej wartości X łatwo policzyć, ile iloczynów jest ≤ X — w wierszu i takich liczb jest min(m, X / i), więc wystarczy jedna pętla po wierszach. Szukamy najmniejszego X, dla którego tych iloczynów jest co najmniej k: wyszukiwanie binarne między 1 a n · m (gdy warunek spełniony — r = X, inaczej l = X + 1). Około 47 kroków po 10⁵ dzieleń.`,
            tests: (r) => {
                const q = (n, m) => [String(n), String(m), String(bigLos(r, 1n, B(n) * B(m)))];
                return [wiersze([['1', '1', '1'], ['1', '1000000000', '1000000000'], ['100000', '1', '100000'], ['3', '3', '9'], ['2', '2', '2']]),
                    wiersze(losZ(r, 5, () => q(r.int(1, 10), r.int(1, 10)))), wiersze(losZ(r, 5, () => q(r.int(1, 1000), r.int(1, 1000)))),
                    wiersze(losZ(r, 5, () => q(100000, 1000000000))), wiersze(losZ(r, 5, () => q(r.int(50000, 100000), r.int(1, 1000000000)))), wiersze([['100000', '1000000000', String(100000n * 1000000000n)], ['100000', '1000000000', String(100000n * 1000000000n - 1n)], ['100000', '100000', '5000000000']])];
            },
            check: (inp) => sprawdzZapytania(inp, 3, 5, ([n, m, k]) => n >= 1n && n <= 100000n && m >= 1n && m <= 1000000000n && k >= 1n && k <= n * m),
            solve: (inp) => zapytania(inp, 3).map(([n, m, k]) => {
                const N = Number(n), M = Number(m), K = Number(k);
                let l = 1, rr = N * M;
                while (l < rr) { const X = Math.floor((l + rr) / 2); let c = 0; for (let i = 1; i <= N && i <= X; i++) c += Math.min(M, dziel(X, i)); if (c >= K) rr = X; else l = X + 1; }
                return String(l);
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, m, k;
        cin >> n >> m >> k;
        long long l = 1, r = n * m;
        while (l < r) {
            long long X = (l + r) / 2;
            long long ile = 0;                  // ile iloczynów jest <= X
            for (long long i = 1; i <= n; i++) ile += min(m, X / i);
            if (ile >= k) r = X;
            else l = X + 1;
        }
        cout << l << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-trojkaty', krok: 9, level: 'trudne',
            title: 'Trójkąty z patyków',
            short: 'Ile trójek patyków tworzy trójkąt? Po posortowaniu dla każdego najdłuższego boku dwa wskaźniki — O(n²) zamiast O(n³).',
            tags: ['nierówność trójkąta', 'sort', 'dwa wskaźniki'],
            statement: ['Patyki mają długości dᵢ = xᵢ + 1, gdzie x to ciąg z generatora z lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m). Wypisz, ile jest trójek patyków (o różnych numerach), z których da się zbudować trójkąt, czyli takich, w których suma dwóch krótszych długości jest większa od najdłuższej.'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — liczba trójek.'],
            constraints: ['3 ≤ n ≤ 5000', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'Długości po posortowaniu: 3, 4, 4, 6, 7. Na 10 trójek nie pasują tylko dwie: 3, 4, 7 (z każdą z czwórek), bo 3 + 4 = 7.' }],
            hint: R`Posortuj długości. Trójka a ≤ b ≤ c tworzy trójkąt, gdy a + b > c. Ustal najdłuższy bok c = d[k] i licz pary l < r < k z d[l] + d[r] > d[k]: zacznij od l = 0 i r = k − 1. Jeśli d[l] + d[r] > d[k], to d[r] pasuje z każdym z d[l], …, d[r − 1] — dodaj r − l i przesuń r w lewo; w przeciwnym razie przesuń l w prawo. Dla każdego k to O(n), razem O(n²) = 2,5 · 10⁷. Trzy pętle to ponad 2 · 10¹⁰ trójek.`,
            tests: (r) => ['3 0 0 0 1', '3 1 1 1 10', '5 3 7 1 10', P.losGen(r, 50, 100), P.losGen(r, 1000, 1000000000), '5000 0 1 1 1000000000', P.losGen(r, 5000, 1000000000), P.losGen(r, 5000, 100), '5000 0 0 0 1', '5000 1 2 0 1000000000'],
            check: sprawdzGen(5000, 1000000000, 3),
            solve: (inp) => { const { n, x } = gen(toks(inp)); const d = Float64Array.from(x, (v) => v + 1).sort(); let c = 0; for (let k = 2; k < n; k++) { let l = 0, rr = k - 1; while (l < rr) { if (d[l] + d[rr] > d[k]) { c += rr - l; rr--; } else l++; } } return String(c); },
            cpp: GEN_CPP + R`    vector<long long> d(n);
    for (int i = 0; i < n; i++) d[i] = x[i] + 1;
    sort(d.begin(), d.end());
    long long trojki = 0;
    for (int k = 2; k < n; k++) {      // d[k] — najdłuższy bok
        int l = 0, r = k - 1;
        while (l < r) {
            if (d[l] + d[r] > d[k]) {
                trojki += r - l;       // d[r] pasuje z d[l], ..., d[r - 1]
                r--;
            } else {
                l++;
            }
        }
    }
    cout << trojki << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-b-dzielniki-do-n', krok: 9, level: 'trudne',
            title: 'Dzielniki wszystkich liczb do n',
            short: 'Suma liczby dzielników wszystkich liczb od 1 do n, dla n do 10¹². Pary (d, w) z d · w ≤ n i sztuczka z pierwiastkiem.',
            tags: ['n / d', 'pary d · w ≤ n', 'O(√n)'],
            statement: ['Niech d(i) oznacza liczbę dodatnich dzielników liczby i (na przykład d(6) = 4: 1, 2, 3, 6). Dla każdego z t zapytań (liczby n) wypisz d(1) + d(2) + … + d(n).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — sumy.'],
            constraints: ['1 ≤ t ≤ 10', '1 ≤ n ≤ 10¹²'],
            examples: [{ input: '3\n6\n1\n1000000000000', note: 'd(1) + … + d(6) = 1 + 2 + 2 + 3 + 2 + 4 = 14 — tyle samo, ile obrotów robiła „pętla z krokiem i” dla n = 6.' }],
            hint: R`Każda liczba d jest dzielnikiem n / d liczb od 1 do n (swoich wielokrotności), więc wynik to n/1 + n/2 + … + n/n — jak w zadaniu „Pętla z krokiem i”. Ale dla n = 10¹² ta pętla jest za długa. Inaczej: wynik to liczba par (d, w) z d · w ≤ n, a w każdej takiej parze mniejsza liczba jest ≤ √n. Niech k = ⌊√n⌋. Par z d ≤ k jest n/1 + … + n/k, tyle samo par z w ≤ k, a pary, w których obie liczby są ≤ k (jest ich k²), policzyłeś dwa razy. Wynik: 2 · (n/1 + … + n/k) − k². To milion kroków.`,
            tests: (r) => [wiersze([['1'], ['2'], ['3'], ['4'], ['6'], ['100'], ['1000000000000'], ['999999999999'], ['999998000001'], ['10000000000']]),
                wiersze(losZ(r, 10, () => [String(r.int(1, 10000))])), wiersze(losZ(r, 10, () => [String(bigLos(r, 900000000000n, 1000000000000n))])), wiersze(losZ(r, 10, () => [String(losLog(r, 12))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 10, ([n]) => n >= 1n && n <= 1000000000000n),
            solve: (inp) => zapytania(inp, 1).map(([v]) => { const n = Number(v); const k = Number(isqrt(big(v))); let s = 0; for (let d = 1; d <= k; d++) s += dziel(n, d); return String(B(s) * 2n - B(k) * B(k)); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long k = sqrtl(n);
        while (k * k > n) k--;
        while ((k + 1) * (k + 1) <= n) k++;
        long long suma = 0;
        for (long long d = 1; d <= k; d++) suma += n / d;
        cout << 2 * suma - k * k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-b-wyprzedaz', krok: 9, level: 'trudne',
            title: 'Wielki finał: wyprzedaż',
            short: 'Milion produktów i 3000 klientów z budżetami. Każdy kupuje jak najwięcej najtańszych. Sortowanie, sumy prefiksowe i upper_bound razem.',
            tags: ['sort', 'sumy prefiksowe', 'upper_bound'],
            statement: ['W sklepie jest n produktów; ich ceny to cᵢ = xᵢ + 1, gdzie x to ciąg z generatora z lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m). Przychodzi q klientów, każdy z budżetem B. Klienci są niezależni — każdy widzi cały sklep. Klient chce kupić jak najwięcej produktów (każdy co najwyżej raz), więc kupuje najtańsze, dopóki starcza mu pieniędzy.', 'Dla każdego klienta wypisz, ile produktów kupi. Na koniec wypisz w osobnym wierszu, ile łącznie wydali wszyscy klienci.'],
            input_format: ['W pierwszym wierszu pięć liczb: n, s, a, b, m.', 'W drugim wierszu liczba q.', 'W trzecim wierszu q liczb B — budżety klientów.'],
            output_format: ['q wierszy — liczby kupionych produktów, a potem wiersz z łączną wydaną kwotą.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m', '1 ≤ q ≤ 3000', '0 ≤ B ≤ 10¹⁵'],
            examples: [{ input: '5 3 7 1 10\n4\n0 3 10 1000', note: 'Ceny po posortowaniu: 3, 4, 4, 6, 7. Z budżetem 10 klient kupi 3 i 4 (razem 7) — na drugą czwórkę już mu nie starczy. Klienci wydali razem 0 + 3 + 7 + 24 = 34.' }],
            hint: R`Najtańsze produkty to początek posortowanej listy cen. Policz sumy prefiksowe: P[0] = 0, P[i] = koszt i najtańszych produktów. Rosną, więc liczba produktów, na które stać klienta, to największe i z P[i] ≤ B — znajdziesz je przez upper_bound(P.begin(), P.end(), B) - P.begin() - 1, a wydana kwota to P[i]. Kupowanie produkt po produkcie to O(n) na klienta. Łączna kwota może sięgać 3 · 10¹⁸ — long long.`,
            tests: (r) => {
                const t = (gp, q) => { const [n, s, a, b, m] = gp.split(' ').map(Number); const c = Float64Array.from(P.generuj(n, s, a, b, m), (v) => v + 1).sort(); let suma = 0; const Pr = [0]; for (const v of c) { suma += v; Pr.push(suma); } return `${gp}\n${q}\n${losZ(r, q, () => { const i = r.int(0, n); const v = r.int(0, 3) ? Pr[i] + r.int(-1, 1) * r.int(0, 3) : r.int(0, 1) ? r.int(0, 1000000000) : Number(bigLos(r, 0n, 1000000000000000n)); return Math.max(0, Math.min(1e15, v)); }).join(' ')}`; };
                return [t('1 5 3 2 10', 3), t('10 0 0 0 1', 5), t('5 3 7 1 10', 10), t(P.losGen(r, 50, 100), 30), t(P.losGen(r, 1000, 1000000000), 1000),
                    t(P.losGen(r, 1000000, 1000000000), 3000), t(P.losGen(r, 1000000, 1000), 3000), t('1000000 0 1 1 1000000000', 3000), t(P.losGen(r, 1000000, 999999937), 3000)];
            },
            check: (inp) => { const t = toks(inp); if (!dobryG(t, 0, 1000000, 1000000000)) return 'parametry generatora'; const q = Number(t[5]); if (!(Number.isInteger(q) && q >= 1 && q <= 3000 && t.length === 6 + q)) return 'liczba klientów'; return t.slice(6).every((v) => /^\d+$/.test(v) && big(v) <= 10n ** 15n) ? null : 'budżet'; },
            solve: (inp) => {
                const t = toks(inp); const { n, x } = gen(t);
                const c = Float64Array.from(x, (v) => v + 1).sort(); const Pr = new Float64Array(n + 1); for (let i = 1; i <= n; i++) Pr[i] = Pr[i - 1] + c[i - 1];
                let razem = 0n; const out = [];
                for (const v of t.slice(6).map(Number)) { const i = ub(Pr, v) - 1; out.push(i); razem += B(Pr[i]); }
                out.push(String(razem));
                return out.join('\n');
            },
            cpp: GEN_CPP + R`    vector<long long> ceny(n);
    for (int i = 0; i < n; i++) ceny[i] = x[i] + 1;
    sort(ceny.begin(), ceny.end());
    vector<long long> P(n + 1, 0);   // P[i] — koszt i najtańszych produktów
    for (int i = 1; i <= n; i++) P[i] = P[i - 1] + ceny[i - 1];
    int q;
    cin >> q;
    long long razem = 0;
    while (q--) {
        long long budzet;
        cin >> budzet;
        int ile = upper_bound(P.begin(), P.end(), budzet) - P.begin() - 1;
        cout << ile << "\n";
        razem += P[ile];
    }
    cout << razem << "\n";
    return 0;
}`,
        },
    ];
};
