// Złożoność czasowa — ćwiczenia w trakcie lekcji, części 1–3: liczenie obrotów pętli (od a do b, co k, odejmowanie
// zamiast dzielenia, gdzie skończy pętla, if w pętli, wielokrotności, pościg, dwie zmienne), pętla w pętli (n · m,
// pary, schodki, trójki, kwadraty i prostokąty w kratce, krok równy i) oraz logarytm (połowienie, podwajanie, cyfry,
// pytania w zgadywance, kartka do Księżyca, kolonia bakterii, podnoszenie do kwadratu).
// W tych zadaniach dane są tak duże, że pętla „obrót po obrocie” nie zdąży — trzeba policzyć obroty wzorem.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const R = String.raw;
    const B = BigInt;
    const E18 = 10n ** 18n;
    const big = (x) => B(x);
    // t zapytań po kilka liczb: wejście „t”, potem t wierszy
    const zapytania = (inp, ile) => { const t = toks(inp); const n = Number(t[0]); const out = []; for (let i = 0; i < n; i++) out.push(t.slice(1 + ile * i, 1 + ile * (i + 1))); return out; };
    const sprawdzZapytania = (inp, ile, maxT, ok) => { const t = toks(inp), n = Number(t[0]); if (!(n >= 1 && n <= maxT && t.length === 1 + ile * n)) return 'liczba zapytań'; for (const z of zapytania(inp, ile)) { if (!z.every((x) => /^-?\d+$/.test(x))) return 'nie liczba'; if (!ok(z.map(big))) return 'zakres: ' + z.join(' '); } return null; };
    const wiersze = (lst) => `${lst.length}\n${lst.map((z) => z.join(' ')).join('\n')}`;
    const losZ = (r, n, f) => Array.from({ length: n }, () => f());
    const bigLos = (r, lo, hi) => r.big(lo, hi);

    return [
        // ================================================================ KROK 1 · ile razy wykona się pętla
        {
            id: 'zc-od-a-do-b', krok: 1, level: 'latwe',
            title: 'Ile obrotów od a do b?',
            short: 'Ile razy wykona się for (i = a; i <= b; i++)? Liczby sięgają tryliona — pętla nie zdąży, policz wzorem.',
            tags: ['b − a + 1', 'a > b daje 0', 'long long'],
            statement: ['Dla każdego z t zapytań dostajesz liczby a i b. Wypisz, ile razy wykona się ciało pętli for (long long i = a; i <= b; i++). Jeśli pętla nie wykona się ani razu, wypisz 0.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby całkowite a i b.'],
            output_format: ['t wierszy — liczby obrotów.'],
            constraints: ['1 ≤ t ≤ 1000', '−10¹⁸ ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '3\n3 7\n7 3\n-2 2', note: 'Od 3 do 7: pięć obrotów (3, 4, 5, 6, 7). Od 7 do 3 pętla nie rusza. Od −2 do 2: pięć obrotów.' }],
            hint: R`Od a do b włącznie jest b − a + 1 liczb (pamiętaj o płocie i słupkach). Gdy a > b, warunek jest od razu fałszywy — wynik 0. Pętla z licznikiem zdąży tylko dla małych przedziałów: dla a = −10¹⁸ i b = 10¹⁸ liczyłaby setki lat. Wszystko w long long: b − a + 1 może mieć 2 · 10¹⁸.`,
            tests: (r) => [wiersze([['1', '1'], ['5', '4'], ['0', '0']]), wiersze([[String(-E18), String(E18)], [String(E18), String(-E18)], [String(E18), String(E18)]]),
                wiersze(losZ(r, 20, () => { const a = r.int(-50, 50); return [String(a), String(a + r.int(-5, 40))]; })),
                wiersze(losZ(r, 500, () => { const a = bigLos(r, -E18, E18), b = bigLos(r, -E18, E18); return [String(a), String(b)]; })),
                wiersze(losZ(r, 1000, () => { const a = bigLos(r, -E18, E18 - 1000n); return [String(a), String(a + B(r.int(-3, 1000)))]; }))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([a, b]) => a >= -E18 && a <= E18 && b >= -E18 && b <= E18),
            solve: (inp) => zapytania(inp, 2).map(([a, b]) => { const x = big(b) - big(a) + 1n; return String(x > 0n ? x : 0n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        if (a <= b) cout << b - a + 1 << "\n";
        else cout << 0 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-co-k', krok: 1, level: 'latwe',
            title: 'Co k kroków',
            short: 'Ile obrotów zrobi for (i = a; i <= b; i += k)? Odległość podziel przez krok i dodaj pierwszy obrót.',
            tags: ['(b − a) / k + 1', 'dzielenie całkowite', 'long long'],
            statement: ['Dla każdego z t zapytań dostajesz liczby a, b i k. Wypisz, ile razy wykona się ciało pętli for (long long i = a; i <= b; i += k).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby: a, b, k.'],
            output_format: ['t wierszy — liczby obrotów.'],
            constraints: ['1 ≤ t ≤ 1000', '−10¹⁸ ≤ a, b ≤ 10¹⁸', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '3\n2 20 3\n2 21 3\n5 4 1', note: 'Pierwsza pętla odwiedza 2, 5, 8, 11, 14, 17, 20 — siedem obrotów. Druga tak samo (23 już się nie mieści).' }],
            hint: R`Jeśli a > b — zero. W przeciwnym razie pętla robi pierwszy obrót dla i = a, a potem tyle skoków o k, ile mieści się w odległości b − a: (b − a) / k (dzielenie całkowite). Razem (b - a) / k + 1. Wszystko w long long.`,
            tests: (r) => [wiersze([['0', '0', '1'], ['0', '9', '10'], ['0', '10', '10'], ['-5', '5', '5']]), wiersze([[String(-E18), String(E18), '1'], [String(-E18), String(E18), String(E18)], [String(E18), String(-E18), '7']]),
                wiersze(losZ(r, 30, () => { const a = r.int(-30, 30); return [String(a), String(a + r.int(-3, 60)), String(r.int(1, 9))]; })),
                wiersze(losZ(r, 1000, () => [String(bigLos(r, -E18, E18)), String(bigLos(r, -E18, E18)), String(r.int(0, 2) ? bigLos(r, 1n, 1000000n) : bigLos(r, 1n, E18))]))],
            check: (inp) => sprawdzZapytania(inp, 3, 1000, ([a, b, k]) => a >= -E18 && a <= E18 && b >= -E18 && b <= E18 && k >= 1n && k <= E18),
            solve: (inp) => zapytania(inp, 3).map(([a, b, k]) => { const A = big(a), Bb = big(b), K = big(k); return String(A > Bb ? 0n : (Bb - A) / K + 1n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b, k;
        cin >> a >> b >> k;
        if (a > b) cout << 0 << "\n";
        else cout << (b - a) / k + 1 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-odejmowanie-dzielenie', krok: 1, level: 'latwe',
            title: 'Odejmowanie zamiast dzielenia',
            short: 'Pętla odejmuje k od x, dopóki się da. Ile razy odejmie i co zostanie? To zwykłe / i %.',
            tags: ['x / k', 'x % k', 'pętla zastąpiona działaniem'],
            statement: ['Dla każdego z t zapytań dostajesz liczby x i k. Program wykonuje pętlę while (x >= k) { x -= k; ile++; }, zaczynając od ile = 0. Wypisz, ile wyniesie ile i ile wyniesie x po zakończeniu pętli.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: x i k.'],
            output_format: ['t wierszy — w każdym dwie liczby: ile i końcowe x.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ x ≤ 10¹⁸', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '3\n17 5\n4 9\n1000000000000000000 1', note: 'Z 17 da się odjąć 5 trzy razy, zostaje 2. Z 4 nie da się odjąć 9 ani razu.' }],
            hint: R`Pętla po prostu dzieli z resztą, tylko bardzo wolno: odejmie k dokładnie x / k razy, a zostanie x % k. Dla x = 10¹⁸ i k = 1 pętla zrobiłaby trylion obrotów — dzielenie robi to w jednym kroku.`,
            tests: (r) => [wiersze([['0', '1'], ['5', '5'], ['4', '5'], [String(E18), String(E18)]]),
                wiersze(losZ(r, 30, () => [String(r.int(0, 100)), String(r.int(1, 12))])),
                wiersze(losZ(r, 1000, () => [String(bigLos(r, 0n, E18)), String(r.int(0, 1) ? bigLos(r, 1n, 1000n) : bigLos(r, 1n, E18))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([x, k]) => x >= 0n && x <= E18 && k >= 1n && k <= E18),
            solve: (inp) => zapytania(inp, 2).map(([x, k]) => `${big(x) / big(k)} ${big(x) % big(k)}`).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long x, k;
        cin >> x >> k;
        cout << x / k << " " << x % k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-gdzie-skonczy', krok: 1, level: 'latwe',
            title: 'Gdzie skończy pętla?',
            short: 'Ostatnia wartość i w pętli co k i wartość i po wyjściu z pętli — bez wykonywania pętli.',
            tags: ['liczba obrotów', 'a + k · ile', 'long long'],
            statement: ['Dla każdego z t zapytań dostajesz liczby a, b i k. Rozważ pętlę for (long long i = a; i <= b; i += k). Wypisz ostatnią wartość i, dla której wykonało się ciało pętli, oraz wartość i po zakończeniu pętli. Jeśli pętla nie wykona się ani razu, zamiast pierwszej liczby wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby: a, b, k.'],
            output_format: ['t wierszy — w każdym dwie wartości: ostatnia odwiedzona (albo BRAK) i wartość po pętli.'],
            constraints: ['1 ≤ t ≤ 600', '−10¹⁸ ≤ a, b ≤ 10¹⁸', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '3\n2 21 3\n5 5 10\n9 3 2', note: 'Pierwsza pętla odwiedza 2, 5, …, 20 i kończy z i = 23. Trzecia nie rusza — i zostaje równe 9.' }],
            hint: R`Policz liczbę obrotów: ile = (b − a) / k + 1 (gdy a ≤ b). Ostatnia odwiedzona wartość to a + k · (ile − 1), a po pętli i = a + k · ile — pętla robi jeszcze jedną zmianę i += k, zanim warunek okaże się fałszywy. Gdy a > b, pętla nie rusza i i = a. Iloczyn k · ile nie przekracza b − a + k, więc mieści się w long long.`,
            tests: (r) => [wiersze([['0', '0', '1'], ['0', '-1', '1'], ['-5', '5', '5'], ['1', '100', '1000']]), wiersze([[String(-E18), String(E18), '1'], [String(-E18), String(E18), String(E18)], [String(E18), String(E18), String(E18)]]),
                wiersze(losZ(r, 30, () => { const a = r.int(-30, 30); return [String(a), String(a + r.int(-3, 60)), String(r.int(1, 9))]; })),
                wiersze(losZ(r, 600, () => [String(bigLos(r, -E18, E18)), String(bigLos(r, -E18, E18)), String(r.int(0, 1) ? bigLos(r, 1n, 1000n) : bigLos(r, 1n, E18))]))],
            check: (inp) => sprawdzZapytania(inp, 3, 600, ([a, b, k]) => a >= -E18 && a <= E18 && b >= -E18 && b <= E18 && k >= 1n && k <= E18),
            solve: (inp) => zapytania(inp, 3).map(([a, b, k]) => { const A = big(a), Bb = big(b), K = big(k); if (A > Bb) return `BRAK ${A}`; const ile = (Bb - A) / K + 1n; return `${A + K * (ile - 1n)} ${A + K * ile}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b, k;
        cin >> a >> b >> k;
        if (a > b) {
            cout << "BRAK " << a << "\n";
            continue;
        }
        long long ile = (b - a) / k + 1;
        cout << a + k * (ile - 1) << " " << a + k * ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-if-w-petli', krok: 1, level: 'latwe',
            title: 'if w pętli',
            short: 'Ile razy wykona się instrukcja pod if (i % a == 0), a ile pod else? Pętla idzie do 10¹⁸.',
            tags: ['n / a', 'if w pętli', 'policz zamiast wykonywać'],
            statement: ['Dla każdego z t zapytań dostajesz liczby n i a. Program wykonuje:', 'for (long long i = 1; i <= n; i++) { if (i % a == 0) x++; else y++; }', 'zaczynając od x = 0 i y = 0. Wypisz końcowe wartości x i y.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: n i a.'],
            output_format: ['t wierszy — w każdym x i y oddzielone spacją.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸', '1 ≤ a ≤ 10¹⁸'],
            examples: [{ input: '2\n10 3\n7 10', note: 'Do 10 podzielne przez 3 są 3, 6, 9 — x = 3, a pozostałe 7 liczb trafia do y.' }],
            hint: R`Pętla robi n obrotów. Warunek i % a == 0 jest prawdziwy dla wielokrotności a: a, 2a, 3a, … — jest ich n / a. Wszystkie pozostałe obroty trafiają do else: n − n / a.`,
            tests: (r) => [wiersze([['1', '1'], ['1', '2'], [String(E18), '1'], [String(E18), String(E18)], [String(E18), '7']]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 100)), String(r.int(1, 12))])),
                wiersze(losZ(r, 1000, () => [String(bigLos(r, 1n, E18)), String(r.int(0, 1) ? bigLos(r, 1n, 1000n) : bigLos(r, 1n, E18))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([n, a]) => n >= 1n && n <= E18 && a >= 1n && a <= E18),
            solve: (inp) => zapytania(inp, 2).map(([n, a]) => { const N = big(n), x = N / big(a); return `${x} ${N - x}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, a;
        cin >> n >> a;
        long long x = n / a;
        cout << x << " " << n - x << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-wielokrotnosci-przedzialu', krok: 1, level: 'latwe',
            title: 'Wielokrotności w przedziale',
            short: 'Ile wielokrotności k leży między a i b? Tyle, ile do b, minus tyle, ile do a − 1.',
            tags: ['b / k − (a − 1) / k', 'bez pętli', 'long long'],
            statement: ['Dla każdego z t zapytań dostajesz liczby a, b i k. Wypisz, ile liczb z przedziału od a do b (włącznie) dzieli się przez k.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby: a, b, k.'],
            output_format: ['t wierszy — liczby wielokrotności.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a ≤ b ≤ 10¹⁸', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '3\n50 100 7\n1 10 20\n12 12 4', note: 'Od 50 do 100 wielokrotności 7 to 56, 63, …, 98 — siedem liczb.' }],
            hint: R`Wielokrotności k od 1 do b jest b / k. Od 1 do a − 1 jest ich (a − 1) / k. Różnica to wielokrotności od a do b. Odejmujemy (a − 1), a nie a — inaczej zgubisz samo a, gdy też dzieli się przez k.`,
            tests: (r) => [wiersze([['1', '1', '1'], ['1', '1', '2'], ['5', '5', '5'], ['1', String(E18), '1'], [String(E18), String(E18), String(E18)]]),
                wiersze(losZ(r, 30, () => { const a = r.int(1, 60); return [String(a), String(a + r.int(0, 60)), String(r.int(1, 9))]; })),
                wiersze(losZ(r, 1000, () => { const a = bigLos(r, 1n, E18); const b = bigLos(r, a, E18); return [String(a), String(b), String(r.int(0, 1) ? bigLos(r, 1n, 1000000n) : bigLos(r, 1n, E18))]; }))],
            check: (inp) => sprawdzZapytania(inp, 3, 1000, ([a, b, k]) => a >= 1n && a <= b && b <= E18 && k >= 1n && k <= E18),
            solve: (inp) => zapytania(inp, 3).map(([a, b, k]) => String(big(b) / big(k) - (big(a) - 1n) / big(k))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b, k;
        cin >> a >> b >> k;
        cout << b / k - (a - 1) / k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-poscig', krok: 1, level: 'srednie',
            title: 'Pościg',
            short: 'Bartek ma d metrów przewagi, Ala biegnie szybciej. Po ilu minutach go dogoni? Symulacja minuta po minucie nie zdąży.',
            tags: ['dzielenie w górę', 'różnica prędkości', 'long long'],
            statement: ['Ala i Bartek biegną po długiej prostej drodze w tę samą stronę. Bartek ma na starcie d metrów przewagi. Ala przebiega v₁ metrów na minutę, a Bartek v₂ metrów na minutę, przy czym v₁ > v₂.', 'Dla każdego z t zapytań wypisz, po ilu pełnych minutach Ala po raz pierwszy będzie w tym samym miejscu co Bartek albo przed nim.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby: d, v₁, v₂.'],
            output_format: ['t wierszy — liczby minut.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ d ≤ 10¹⁸', '0 ≤ v₂ < v₁ ≤ 10¹⁸'],
            examples: [{ input: '3\n10 5 3\n9 5 3\n0 2 1', note: 'Co minutę Ala zmniejsza stratę o 2 metry. 10 metrów odrobi w 5 minut, 9 metrów — też dopiero po 5 pełnych minutach.' }],
            hint: R`Co minutę dystans między nimi maleje o v₁ − v₂. Szukamy najmniejszej liczby minut t, dla której t · (v₁ − v₂) ≥ d, czyli d / (v₁ − v₂) zaokrąglone w górę. Bez liczb z przecinkiem: (d + r - 1) / r, gdzie r = v₁ − v₂ (pamiętasz dzielenie w górę z lekcji o zaokrąglaniu). Symulacja minuta po minucie dla d = 10¹⁸ i r = 1 trwałaby wieki.`,
            tests: (r) => [wiersze([['0', '1', '0'], ['1', '1', '0'], [String(E18), '1', '0'], [String(E18), String(E18), '0'], [String(E18), String(E18), String(E18 - 1n)]]),
                wiersze(losZ(r, 30, () => { const v2 = r.int(0, 10); return [String(r.int(0, 100)), String(v2 + r.int(1, 10)), String(v2)]; })),
                wiersze(losZ(r, 1000, () => { const v2 = bigLos(r, 0n, E18 - 1n); const v1 = bigLos(r, v2 + 1n, r.int(0, 1) ? (v2 + 1000n < E18 ? v2 + 1000n : E18) : E18); return [String(bigLos(r, 0n, E18)), String(v1), String(v2)]; }))],
            check: (inp) => sprawdzZapytania(inp, 3, 1000, ([d, v1, v2]) => d >= 0n && d <= E18 && v2 >= 0n && v2 < v1 && v1 <= E18),
            solve: (inp) => zapytania(inp, 3).map(([d, v1, v2]) => { const rr = big(v1) - big(v2); return String((big(d) + rr - 1n) / rr); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long d, v1, v2;
        cin >> d >> v1 >> v2;
        long long r = v1 - v2;
        cout << (d + r - 1) / r << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-dwie-zmienne', krok: 1, level: 'srednie',
            title: 'Pętla z dwiema zmiennymi',
            short: 'a rośnie o p, b maleje o q, dopóki a < b. Ile obrotów i jakie wartości na końcu?',
            tags: ['dzielenie w górę', 'dwie zmienne', 'policz zamiast symulować'],
            statement: ['Dla każdego z t zapytań dostajesz liczby a, b, p, q. Program wykonuje (zaczynając od ile = 0):', 'while (a < b) { a += p; b -= q; ile++; }', 'Wypisz końcowe wartości ile, a i b.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy cztery liczby: a, b, p, q.'],
            output_format: ['t wierszy — w każdym trzy liczby: ile, a, b.'],
            constraints: ['1 ≤ t ≤ 600', '0 ≤ a, b ≤ 10¹⁸', '1 ≤ p, q ≤ 10⁹'],
            examples: [{ input: '3\n0 10 2 1\n5 5 1 1\n0 1000000000000000000 1 1', note: 'W pierwszym zapytaniu odległość 10 maleje co obrót o 3: po 4 obrotach a = 8, b = 6.' }],
            hint: R`W każdym obrocie odległość b − a maleje o p + q. Pętla kończy się, gdy odległość spadnie do zera albo niżej — po (b − a) / (p + q) obrotach zaokrąglonych w górę (i po 0 obrotach, gdy od razu a ≥ b). Potem końcowe a = a + p · ile i b = b − q · ile. Trzecie zapytanie z przykładu to pół tryliona obrotów — symulacja nie zdąży.`,
            tests: (r) => [wiersze([['0', '0', '1', '1'], ['7', '3', '5', '5'], ['0', '1', '1', '1'], ['0', String(E18), '1', '1'], ['0', String(E18), '1000000000', '1000000000']]),
                wiersze(losZ(r, 30, () => [String(r.int(0, 50)), String(r.int(0, 80)), String(r.int(1, 7)), String(r.int(1, 7))])),
                wiersze(losZ(r, 600, () => [String(bigLos(r, 0n, E18)), String(bigLos(r, 0n, E18)), String(r.int(1, r.int(0, 1) ? 10 : 1000000000)), String(r.int(1, r.int(0, 1) ? 10 : 1000000000))]))],
            check: (inp) => sprawdzZapytania(inp, 4, 600, ([a, b, p, q]) => a >= 0n && a <= E18 && b >= 0n && b <= E18 && p >= 1n && p <= 1000000000n && q >= 1n && q <= 1000000000n),
            solve: (inp) => zapytania(inp, 4).map(([a, b, p, q]) => { const A = big(a), Bb = big(b), P = big(p), Q = big(q); const ile = A < Bb ? (Bb - A + P + Q - 1n) / (P + Q) : 0n; return `${ile} ${A + P * ile} ${Bb - Q * ile}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b, p, q;
        cin >> a >> b >> p >> q;
        long long ile = 0;
        if (a < b) ile = (b - a + p + q - 1) / (p + q);
        cout << ile << " " << a + p * ile << " " << b - q * ile << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 2 · pętla w pętli
        {
            id: 'zc-tabliczka', krok: 2, level: 'latwe',
            title: 'Wielka tabliczka mnożenia',
            short: 'Ile razy wykona się ciało pętli w pętli dla n wierszy i m kolumn? Liczby sięgają trzech miliardów.',
            tags: ['n · m', 'pętla w pętli', 'long long'],
            statement: ['Dla każdego z t zapytań dostajesz liczby n i m. Wypisz, ile razy wykona się instrukcja ile++ w programie:', 'for (long long i = 1; i <= n; i++) for (long long j = 1; j <= m; j++) ile++;'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: n i m.'],
            output_format: ['t wierszy — liczby obrotów.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n, m ≤ 3 · 10⁹'],
            examples: [{ input: '2\n3 4\n3000000000 3000000000', note: 'Drugi wynik to 9 · 10¹⁸ — mieści się w long long, ale pętle liczyłyby go setki lat.' }],
            hint: R`Pętla w pętli — mnożymy: wewnętrzna wykonuje się m razy w każdym z n obrotów zewnętrznej, razem n · m. Iloczyn do 9 · 10¹⁸ mieści się w long long (granica to około 9,2 · 10¹⁸).`,
            tests: (r) => [wiersze([['1', '1'], ['1', '3000000000'], ['3000000000', '1'], ['3000000000', '3000000000']]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 30)), String(r.int(1, 30))])),
                wiersze(losZ(r, 1000, () => [String(r.int(1, 3000000000)), String(r.int(1, 3000000000))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([n, m]) => n >= 1n && n <= 3000000000n && m >= 1n && m <= 3000000000n),
            solve: (inp) => zapytania(inp, 2).map(([n, m]) => String(big(n) * big(m))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, m;
        cin >> n >> m;
        cout << n * m << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-kazdy-z-kazdym', krok: 2, level: 'latwe',
            title: 'Każdy z każdym',
            short: 'Turniej n drużyn, każda gra z każdą raz. Ile meczów? Pętla j od i + 1 — wzór n(n − 1)/2.',
            tags: ['pary i < j', 'n · (n − 1) / 2', 'long long'],
            statement: ['W turnieju gra n drużyn i każda rozgrywa z każdą dokładnie jeden mecz. Dla każdego z t zapytań (liczby n) wypisz liczbę meczów, czyli liczbę obrotów pętli for (i = 1; i <= n; i++) for (j = i + 1; j <= n; j++).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby meczów.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 3 · 10⁹'],
            examples: [{ input: '3\n4\n1\n100000', note: 'Cztery drużyny: 3 + 2 + 1 = 6 meczów. Jedna drużyna nie gra z nikim.' }],
            hint: R`Pary i < j to połowa kratki n × n bez przekątnej: n · (n − 1) / 2. Najpierw mnóż, potem dziel — iloczyn n · (n − 1) jest zawsze parzysty. Dla n = 3 · 10⁹ iloczyn to prawie 9 · 10¹⁸ — tylko long long.`,
            tests: (r) => [wiersze([['1'], ['2'], ['3'], ['3000000000'], ['2999999999']]), wiersze(losZ(r, 30, () => [String(r.int(1, 50))])), wiersze(losZ(r, 1000, () => [String(r.int(1, 3000000000))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= 3000000000n),
            solve: (inp) => zapytania(inp, 1).map(([n]) => String(big(n) * (big(n) - 1n) / 2n)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << n * (n - 1) / 2 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-schodki', krok: 2, level: 'latwe',
            title: 'Schodki z gwiazdek',
            short: 'Trójkąt z n wierszy: w i-tym wierszu i gwiazdek. Ile gwiazdek razem? Suma Gaussa.',
            tags: ['n · (n + 1) / 2', 'j od 1 do i', 'long long'],
            statement: ['Program rysuje trójkąt z gwiazdek: w wierszu numer i (od 1 do n) stawia i gwiazdek. Dla każdego z t zapytań (liczby n) wypisz, ile gwiazdek narysuje razem.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby gwiazdek.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 3 · 10⁹'],
            examples: [{ input: '2\n4\n3000000000', note: '1 + 2 + 3 + 4 = 10.' }],
            hint: R`To suma 1 + 2 + … + n. Sztuczka Gaussa: n · (n + 1) / 2. Najpierw mnożenie, potem dzielenie. Dla n = 3 · 10⁹ iloczyn n · (n + 1) jest tuż poniżej granicy long long.`,
            tests: (r) => [wiersze([['1'], ['2'], ['3000000000'], ['2999999999']]), wiersze(losZ(r, 30, () => [String(r.int(1, 50))])), wiersze(losZ(r, 1000, () => [String(r.int(1, 3000000000))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= 3000000000n),
            solve: (inp) => zapytania(inp, 1).map(([n]) => String(big(n) * (big(n) + 1n) / 2n)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << n * (n + 1) / 2 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-po-kolei-i-w-srodku', krok: 2, level: 'latwe',
            title: 'Po kolei i w środku',
            short: 'Trzy fragmenty: pętla po n, pętla w pętli n × m, pętla po m. Ile obrotów robi każdy i ile razem?',
            tags: ['dodawanie i mnożenie', 'n + n · m + m', 'long long'],
            statement: ['Program składa się z trzech fragmentów, stojących jeden po drugim:', 'for (i = 1; i <= n; i++) A++;   for (i = 1; i <= n; i++) for (j = 1; j <= m; j++) B++;   for (j = 1; j <= m; j++) C++;', 'Dla każdego z t zapytań (liczby n i m) wypisz końcowe wartości A, B, C (każda zaczyna od 0) i łączną liczbę obrotów A + B + C.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: n i m.'],
            output_format: ['t wierszy — w każdym cztery liczby: A, B, C i suma.'],
            constraints: ['1 ≤ t ≤ 400', '1 ≤ n, m ≤ 10⁹'],
            examples: [{ input: '2\n3 4\n1000000000 1000000000' }],
            hint: R`Pętle po kolei — dodajemy, pętla w pętli — mnożymy. A = n, B = n · m, C = m, a suma to n + n · m + m. Dla n = m = 10⁹ fragment środkowy ma 10¹⁸ obrotów, a pozostałe dwa razem tylko 2 · 10⁹ — prawie nic. Dlatego cały program ma złożoność O(n · m).`,
            tests: (r) => [wiersze([['1', '1'], ['1000000000', '1000000000'], ['1', '1000000000']]), wiersze(losZ(r, 30, () => [String(r.int(1, 30)), String(r.int(1, 30))])), wiersze(losZ(r, 400, () => [String(r.int(1, 1000000000)), String(r.int(1, 1000000000))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 400, ([n, m]) => n >= 1n && n <= 1000000000n && m >= 1n && m <= 1000000000n),
            solve: (inp) => zapytania(inp, 2).map(([n, m]) => { const N = big(n), M = big(m); return `${N} ${N * M} ${M} ${N + N * M + M}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, m;
        cin >> n >> m;
        cout << n << " " << n * m << " " << m << " " << n + n * m + m << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-trojki', krok: 2, level: 'srednie',
            title: 'Trójki bez powtórzeń',
            short: 'Ile obrotów zrobią trzy pętle i < j < k? To „wybierz 3 z n” — uważaj na kolejność dzielenia.',
            tags: ['n(n − 1)(n − 2) / 6', 'trzy pętle', 'przepełnienie'],
            statement: ['Dla każdego z t zapytań (liczby n) wypisz, ile razy wykona się instrukcja ile++ w programie:', 'for (i = 1; i <= n; i++) for (j = i + 1; j <= n; j++) for (k = j + 1; k <= n; k++) ile++;'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby obrotów.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 2 · 10⁶'],
            examples: [{ input: '3\n4\n2\n2000000', note: 'Dla n = 4 trójki to (1,2,3), (1,2,4), (1,3,4), (2,3,4) — cztery.' }],
            hint: R`Trójek i < j < k jest n · (n − 1) · (n − 2) / 6. Dla n = 2 · 10⁶ iloczyn trzech liczb to 8 · 10¹⁸ — na granicy long long, a przy innych wzorach łatwo ją przekroczyć. Bezpieczniej liczyć po kawałku: najpierw p = n · (n − 1) / 2 (pary), potem p · (n − 2) / 3 — ten iloczyn zawsze dzieli się przez 3. Pętle (nawet dwie) dla n = 2 · 10⁶ nie zdążą.`,
            tests: (r) => [wiersze([['1'], ['2'], ['3'], ['4'], ['2000000'], ['1999999']]), wiersze(losZ(r, 30, () => [String(r.int(1, 40))])), wiersze(losZ(r, 1000, () => [String(r.int(1, 2000000))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= 2000000n),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { const N = big(n); return String(N * (N - 1n) * (N - 2n) / 6n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long pary = n * (n - 1) / 2;
        cout << pary * (n - 2) / 3 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-kwadraty-w-kratce', krok: 2, level: 'srednie',
            title: 'Kwadraty w kratce',
            short: 'Ile kwadratów każdej wielkości mieści się w kratce n × n? Policz według wielkości boku.',
            tags: ['suma kwadratów', 'n(n + 1)(2n + 1) / 6', 'long long'],
            statement: ['Kratka ma n × n pól. Kwadratów o boku k (złożonych z k × k pól) mieści się w niej (n − k + 1)², dla każdego k od 1 do n. Dla każdego z t zapytań (liczby n) wypisz łączną liczbę kwadratów wszystkich wielkości.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby kwadratów.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10⁶'],
            examples: [{ input: '2\n2\n8', note: 'W kratce 2 × 2 są cztery kwadraty 1 × 1 i jeden 2 × 2. Szachownica 8 × 8 ma 204 kwadraty.' }],
            hint: R`Suma (n − k + 1)² dla k od 1 do n to 1² + 2² + … + n², czyli n · (n + 1) · (2n + 1) / 6. Możesz też policzyć ją pętlą po k — n obrotów na zapytanie. Uwaga: przy 1000 zapytaniach z n = 10⁶ to 10⁹ obrotów, na granicy limitu — wzór jest pewniejszy. Iloczyn n · (n + 1) · (2n + 1) dla n = 10⁶ to około 2 · 10¹⁸ — mieści się w long long.`,
            tests: (r) => [wiersze([['1'], ['2'], ['8'], ['1000000']]), wiersze(losZ(r, 30, () => [String(r.int(1, 50))])), wiersze(losZ(r, 1000, () => [String(r.int(900000, 1000000))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= 1000000n),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { const N = big(n); return String(N * (N + 1n) * (2n * N + 1n) / 6n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << n * (n + 1) * (2 * n + 1) / 6 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-prostokaty-w-kratce', krok: 2, level: 'srednie',
            title: 'Prostokąty w kratce',
            short: 'Ile prostokątów (o bokach wzdłuż linii) mieści się w kratce n × m? Wybierz dwie linie pionowe i dwie poziome.',
            tags: ['pary linii', 'iloczyn wzorów', 'long long'],
            statement: ['Kratka ma n wierszy i m kolumn pól. Prostokąt w kratce składa się z całych pól i ma boki wzdłuż linii kratki. Dla każdego z t zapytań wypisz, ile jest wszystkich takich prostokątów (kwadraty też się liczą).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: n i m.'],
            output_format: ['t wierszy — liczby prostokątów.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n, m ≤ 50 000'],
            examples: [{ input: '2\n1 2\n2 2', note: 'Kratka 1 × 2 ma trzy prostokąty: dwa pojedyncze pola i całość. Kratka 2 × 2 — dziewięć.' }],
            hint: R`Prostokąt wyznaczają dwie różne linie poziome (z n + 1 linii) i dwie różne linie pionowe (z m + 1). Par linii poziomych jest (n + 1) · n / 2, pionowych (m + 1) · m / 2, a każda para pasuje do każdej — mnożymy. Pętle po wszystkich prostokątach (cztery zagnieżdżone) albo nawet po ich wymiarach (n · m na zapytanie) nie zdążą.`,
            tests: (r) => [wiersze([['1', '1'], ['1', '2'], ['2', '2'], ['50000', '50000'], ['1', '50000']]), wiersze(losZ(r, 30, () => [String(r.int(1, 20)), String(r.int(1, 20))])), wiersze(losZ(r, 1000, () => [String(r.int(1, 50000)), String(r.int(1, 50000))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([n, m]) => n >= 1n && n <= 50000n && m >= 1n && m <= 50000n),
            solve: (inp) => zapytania(inp, 2).map(([n, m]) => { const N = big(n), M = big(m); return String((N * (N + 1n) / 2n) * (M * (M + 1n) / 2n)); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, m;
        cin >> n >> m;
        cout << (n * (n + 1) / 2) * (m * (m + 1) / 2) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-krok-rowny-i', krok: 2, level: 'srednie',
            title: 'Pętla z krokiem i',
            short: 'Wewnętrzna pętla skacze co i: for (j = i; j <= n; j += i). Ile obrotów razem? Około n · ln n.',
            tags: ['n / i', 'suma po i', 'O(n log n)'],
            statement: ['Wypisz, ile razy wykona się instrukcja ile++ w programie:', 'for (long long i = 1; i <= n; i++) for (long long j = i; j <= n; j += i) ile++;'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba — liczba obrotów.'],
            constraints: ['1 ≤ n ≤ 10⁷'],
            examples: [{ input: '6', note: 'Dla i = 1: 6 obrotów, i = 2: 3, i = 3: 2, i = 4, 5, 6: po 1. Razem 14.' }, { input: '1' }],
            hint: R`Dla ustalonego i wewnętrzna pętla odwiedza i, 2i, 3i, … — tyle wielokrotności i, ile mieści się do n, czyli n / i (część 1). Wystarczy więc jedna pętla po i, która sumuje n / i — O(n). Ciekawostka: wynik to mniej więcej n · ln n, więc nawet podwójna pętla ma tu złożoność O(n log n), a nie O(n²) — ale jedna pętla jest pewniejsza.`,
            tests: () => ['1', '2', '6', '100', '1000', '99991', '1000000', '7777777', '10000000'],
            check: (inp) => (/^\d+$/.test(inp) && Number(inp) >= 1 && Number(inp) <= 10000000 ? null : 'n'),
            solve: (inp) => { const n = Number(inp); let s = 0; for (let i = 1; i <= n; i++) s += Math.floor(n / i); return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long ile = 0;
    for (long long i = 1; i <= n; i++) ile += n / i;
    cout << ile << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 3 · logarytm
        {
            id: 'zc-polowienie', krok: 3, level: 'latwe',
            title: 'Ile razy na pół?',
            short: 'Ile razy można podzielić n przez 2 (całkowicie), zanim zostanie 1? Nawet dla 10¹⁸ to najwyżej 59 kroków.',
            tags: ['n /= 2', 'log₂ n', 'pętla jest szybka'],
            statement: ['Dla każdego z t zapytań (liczby n) wypisz, ile obrotów wykona pętla while (n > 1) n /= 2; (dzielenie całkowite).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby obrotów.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n1000\n1\n1024', note: '1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1: dziewięć dzieleń.' }],
            hint: R`Tu nic nie trzeba wymyślać — po prostu wykonaj pętlę! Każdy obrót zabiera połowę, więc nawet dla 10¹⁸ będzie ich najwyżej 59. To właśnie pokazuje to zadanie: pętle, które dzielą, są bardzo szybkie. Pamiętaj tylko o long long.`,
            tests: (r) => [wiersze([['1'], ['2'], ['3'], ['4'], [String(E18)], [String(2n ** 59n)], [String(2n ** 59n - 1n)]]), wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 1n, E18) : B(r.int(1, 5000)))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= E18),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { let N = big(n), c = 0; while (N > 1n) { N /= 2n; c++; } return String(c); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        int ile = 0;
        while (n > 1) {
            n /= 2;
            ile++;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-podwajanie', krok: 3, level: 'latwe',
            title: 'Potęgi dwójki do n',
            short: 'Ile obrotów zrobi for (p = 1; p <= n; p *= 2)? Uważaj, żeby licznik się nie przepełnił.',
            tags: ['p *= 2', 'log₂ n + 1', 'long long'],
            statement: ['Dla każdego z t zapytań (liczby n) wypisz, ile obrotów wykona pętla for (long long p = 1; p <= n; p *= 2).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby obrotów.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n100\n1\n1024', note: 'Do 100: 1, 2, 4, 8, 16, 32, 64 — siedem obrotów. Do 1024 — jedenaście (z samym 1024).' }],
            hint: R`Wykonaj tę pętlę — obrotów jest najwyżej 60. Licznik p musi być long long: ostatnie p, które przerywa pętlę, jest większe od n, ale najwyżej dwa razy — czyli mniejsze niż 2 · 10¹⁸ i jeszcze mieści się w long long. W int p przepełniłoby się dużo wcześniej i pętla nie skończyłaby się nigdy.`,
            tests: (r) => [wiersze([['1'], ['2'], ['3'], [String(E18)], [String(2n ** 59n)], [String(2n ** 59n - 1n)]]), wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 1n, E18) : B(r.int(1, 5000)))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= E18),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { const N = big(n); let p = 1n, c = 0; while (p <= N) { p *= 2n; c++; } return String(c); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        int ile = 0;
        for (long long p = 1; p <= n; p *= 2) ile++;
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-cyfry-w-systemie', krok: 3, level: 'latwe',
            title: 'Cyfry w innym systemie',
            short: 'Ile cyfr ma liczba n zapisana w systemie o podstawie b? Dziel przez b, dopóki coś zostaje.',
            tags: ['n /= b', 'logarytm o podstawie b', 'zero ma jedną cyfrę'],
            statement: ['Dla każdego z t zapytań dostajesz liczby n i b. Wypisz, ile cyfr ma liczba n zapisana w systemie o podstawie b (na przykład w dwójkowym, gdy b = 2). Zero ma jedną cyfrę.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: n i b.'],
            output_format: ['t wierszy — liczby cyfr.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ n ≤ 10¹⁸', '2 ≤ b ≤ 10'],
            examples: [{ input: '3\n255 2\n255 10\n0 7', note: '255 dwójkowo to 11111111 — osiem cyfr.' }],
            hint: R`Tak jak cyfry dziesiętne: dziel n przez b, dopóki nie zostanie 0, i licz obroty. To logarytm przy podstawie b — najwyżej 60 obrotów. Zero obsłuż osobno: pętla while (n > 0) nie wykona się, a zero ma jedną cyfrę.`,
            tests: (r) => [wiersze([['0', '2'], ['1', '2'], ['9', '10'], ['10', '10'], [String(E18), '10'], [String(E18), '2'], [String(E18), '3']]), wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 0n, E18) : B(r.int(0, 3000))), String(r.int(2, 10))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([n, b]) => n >= 0n && n <= E18 && b >= 2n && b <= 10n),
            solve: (inp) => zapytania(inp, 2).map(([n, b]) => { let N = big(n), c = 0; const Bb = big(b); if (N === 0n) return '1'; while (N > 0n) { N /= Bb; c++; } return String(c); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, b;
        cin >> n >> b;
        int cyfry = 0;
        if (n == 0) cyfry = 1;
        while (n > 0) {
            n /= b;
            cyfry++;
        }
        cout << cyfry << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-ile-pytan', krok: 3, level: 'latwe',
            title: 'Ile pytań w zgadywance?',
            short: 'Ile pytań „czy większa od…?” trzeba w najgorszym razie, żeby odgadnąć liczbę od 1 do n?',
            tags: ['połowienie przedziału', 'najmniejsze k z 2ᵏ ≥ n', 'long long'],
            statement: ['Ktoś pomyślał liczbę od 1 do n, a my zadajemy pytania „czy Twoja liczba jest większa od s?” i za każdym razem pytamy o środek przedziału, w którym liczba może jeszcze być. Dla każdego z t zapytań (liczby n) wypisz, ile pytań wystarczy w najgorszym przypadku. Gdy n = 1, nie trzeba pytać wcale.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby pytań.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n1\n2\n1000000\n1024', note: 'Milion liczb wymaga 20 pytań, bo 2²⁰ = 1 048 576 ≥ 1 000 000, a 2¹⁹ to za mało.' }],
            hint: R`Po k pytaniach zostaje jedna z co najwyżej 2ᵏ możliwości. Wystarczy więc najmniejsze k, dla którego 2ᵏ ≥ n. Licz w pętli: zaczynaj od p = 1 i k = 0, i dopóki p < n, podwajaj p i zwiększaj k. Najwyżej 60 obrotów.`,
            tests: (r) => [wiersze([['1'], ['2'], ['3'], ['4'], ['5'], [String(E18)], [String(2n ** 59n)], [String(2n ** 59n + 1n)]]), wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 1n, E18) : B(r.int(1, 5000)))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= E18),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { const N = big(n); let p = 1n, k = 0; while (p < N) { p *= 2n; k++; } return String(k); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long p = 1;
        int k = 0;
        while (p < n) {
            p *= 2;
            k++;
        }
        cout << k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-kartka-do-ksiezyca', krok: 3, level: 'latwe',
            title: 'Kartka do Księżyca',
            short: 'Kartka ma 0,1 mm grubości, a każde złożenie ją podwaja. Ile złożeń, żeby sięgnąć d milimetrów?',
            tags: ['podwajanie', 'liczby całkowite zamiast 0,1', 'logarytm'],
            statement: ['Kartka papieru ma grubość 0,1 mm. Każde złożenie na pół podwaja jej grubość. Dla każdego z t zapytań (odległości d w milimetrach) wypisz najmniejszą liczbę złożeń, po której grubość będzie co najmniej d milimetrów.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba d (w milimetrach).'],
            output_format: ['t wierszy — liczby złożeń.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ d ≤ 10¹⁵'],
            examples: [{ input: '2\n1\n384400000000', note: 'Po 4 złożeniach kartka ma 1,6 mm. Do Księżyca (384 400 km) wystarczą 42 złożenia!' }],
            hint: R`Nie używaj liczb z przecinkiem: licz grubość w dziesiątych częściach milimetra. Na początku g = 1, cel to 10 · d. Podwajaj g, dopóki g < 10 · d, i licz złożenia. Nawet dla d = 10¹⁵ to około 53 obroty. g i 10 · d trzymaj w long long.`,
            tests: (r) => [wiersze([['1'], ['2'], ['384400000000'], ['1000000000000000']]), wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 1n, 10n ** 15n) : B(r.int(1, 10000)))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([d]) => d >= 1n && d <= 10n ** 15n),
            solve: (inp) => zapytania(inp, 1).map(([d]) => { const cel = big(d) * 10n; let g = 1n, k = 0; while (g < cel) { g *= 2n; k++; } return String(k); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long d;
        cin >> d;
        long long g = 1, cel = 10 * d;
        int zlozenia = 0;
        while (g < cel) {
            g *= 2;
            zlozenia++;
        }
        cout << zlozenia << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-zgadywanie-krokami', krok: 3, level: 'srednie',
            title: 'Zgadywanie krok po kroku',
            short: 'Dla każdej sekretnej liczby policz, ile pytań zada strategia „pytaj o środek”. Każde zgadywanie to ok. 60 kroków.',
            tags: ['wyszukiwanie binarne', 'l, r i środek', 'long long'],
            statement: ['Program zgaduje liczbę x z przedziału od 1 do n tak jak w lekcji: zaczyna od l = 1, r = n i dopóki l < r, wybiera s = (l + r) / 2, zadaje jedno pytanie i ustawia l = s + 1, gdy x > s, albo r = s w przeciwnym razie.', 'Dla danego n i q sekretnych liczb wypisz, ile pytań zada program dla każdej z nich.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu q liczb — sekrety.'],
            output_format: ['q wierszy — liczby pytań.'],
            constraints: ['1 ≤ n ≤ 10¹⁸', '1 ≤ q ≤ 1000', '1 ≤ każdy sekret ≤ n'],
            examples: [{ input: '10 4\n1 7 10 3', note: 'Dla x = 7: [1, 10] → s = 5, tak → [6, 10] → s = 8, nie → [6, 8] → s = 7, nie → [6, 7] → s = 6, tak → [7, 7]. Cztery pytania.' }],
            hint: R`Po prostu wykonaj tę pętlę dla każdego sekretu — każde zgadywanie to najwyżej około 60 obrotów, więc 1000 sekretów to drobiazg. Uważaj tylko na l + r: przy n = 10¹⁸ suma dochodzi do 2 · 10¹⁸, więc long long (mieści się).`,
            tests: (r) => [`1 1\n1`, `2 2\n1 2`, `${E18} 3\n1 ${E18} ${E18 / 2n}`,
                ...[[100n, 50], [1000000n, 300], [E18, 1000], [123456789n, 1000]].map(([n, q]) => `${n} ${q}\n${losZ(r, q, () => String(bigLos(r, 1n, n))).join(' ')}`)],
            check: (inp) => { const t = toks(inp).map(big); const n = t[0], q = Number(t[1]); return n >= 1n && n <= E18 && q >= 1 && q <= 1000 && t.length === q + 2 && t.slice(2).every((x) => x >= 1n && x <= n) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(big); const n = t[0]; return t.slice(2).map((x) => { let l = 1n, rr = n, c = 0; while (l < rr) { const s = (l + rr) / 2n; c++; if (x > s) l = s + 1n; else rr = s; } return String(c); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n;
    int q;
    cin >> n >> q;
    while (q--) {
        long long x;
        cin >> x;
        long long l = 1, r = n;
        int pytania = 0;
        while (l < r) {
            long long s = (l + r) / 2;
            pytania++;
            if (x > s) l = s + 1;
            else r = s;
        }
        cout << pytania << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-kolonia-bakterii', krok: 3, level: 'srednie',
            title: 'Kolonia bakterii',
            short: 'Co godzinę bakterii jest k razy więcej. Po ilu godzinach z a zrobi się co najmniej b? Uważaj na przepełnienie.',
            tags: ['mnożenie przez k', 'logarytm o podstawie k', 'sprawdź przed mnożeniem'],
            statement: ['Na szalce jest a bakterii, a co godzinę ich liczba rośnie k razy. Dla każdego z t zapytań wypisz najmniejszą liczbę pełnych godzin, po których bakterii będzie co najmniej b.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy trzy liczby: a, b, k.'],
            output_format: ['t wierszy — liczby godzin.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a ≤ 10¹⁸', '1 ≤ b ≤ 10¹⁸', '2 ≤ k ≤ 10⁹'],
            examples: [{ input: '3\n1 1000 10\n5 5 2\n3 1000000000000000000 1000000000', note: 'Z 1 do 1000 przy k = 10 to trzy godziny. Gdy już na początku jest a ≥ b — zero godzin.' }],
            hint: R`Mnóż liczbę bakterii przez k, dopóki jest mniejsza od b, i licz godziny — to logarytm, najwyżej 60 obrotów. Pułapka: a · k może przekroczyć zakres long long (10¹⁸ · 10⁹!). Zanim pomnożysz, sprawdź, czy a > b / k — jeśli tak, to po tej godzinie na pewno będzie ich co najmniej b, więc doliczasz ostatnią godzinę i kończysz.`,
            tests: (r) => [wiersze([['1', '1', '2'], ['5', '4', '2'], ['1', String(E18), '2'], ['1', String(E18), '1000000000'], [String(E18), String(E18), '2'], ['3', String(E18), '1000000000']]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 100)), String(r.int(1, 100000)), String(r.int(2, 10))])),
                wiersze(losZ(r, 1000, () => [String(r.int(0, 1) ? bigLos(r, 1n, 1000n) : bigLos(r, 1n, E18)), String(bigLos(r, 1n, E18)), String(r.int(0, 1) ? r.int(2, 10) : r.int(2, 1000000000))]))],
            check: (inp) => sprawdzZapytania(inp, 3, 1000, ([a, b, k]) => a >= 1n && a <= E18 && b >= 1n && b <= E18 && k >= 2n && k <= 1000000000n),
            solve: (inp) => zapytania(inp, 3).map(([a, b, k]) => { let A = big(a); const Bb = big(b), K = big(k); let h = 0; while (A < Bb) { A *= K; h++; } return String(h); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b, k;
        cin >> a >> b >> k;
        int godziny = 0;
        while (a < b) {
            godziny++;
            if (a > b / k) break;   // po tej godzinie na pewno a * k >= b
            a *= k;
        }
        cout << godziny << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-do-kwadratu', krok: 3, level: 'srednie',
            title: 'Do kwadratu, do kwadratu…',
            short: 'Ile razy można podnieść x do kwadratu, nie przekraczając n? Nawet dla 10¹⁸ to najwyżej kilka kroków.',
            tags: ['x = x * x', 'log log n', 'sprawdź przed mnożeniem'],
            statement: ['Zaczynamy od liczby x i podnosimy ją do kwadratu: x → x² → x⁴ → x⁸ → … Dla każdego z t zapytań wypisz, ile razy można to zrobić, zanim wynik przekroczy n (licząc tylko te podniesienia, po których wynik jest nie większy niż n).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: x i n.'],
            output_format: ['t wierszy — liczby podniesień do kwadratu.'],
            constraints: ['1 ≤ t ≤ 1000', '2 ≤ x ≤ 10⁹', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n2 1000000000000000000\n10 99\n3 2', note: '2 → 4 → 16 → 256 → 65 536 → 4 294 967 296: pięć podniesień (następne dałoby 2⁶⁴). 10 → 100 przekracza 99 — zero.' }],
            hint: R`Podnoś do kwadratu, dopóki wynik nie przekroczy n, i licz. Każde podniesienie podwaja wykładnik, więc to „logarytm z logarytmu” — najwyżej kilka obrotów. Pułapka: x · x może przekroczyć long long. Sprawdzaj więc przed mnożeniem: x · x ≤ n wtedy i tylko wtedy, gdy x ≤ n / x (dzielenie całkowite).`,
            tests: (r) => [wiersze([['2', '1'], ['2', '4'], ['2', '3'], ['2', String(E18)], ['1000000000', String(E18)], ['999999999', String(E18)], ['3', '2']]),
                wiersze(losZ(r, 1000, () => [String(r.int(0, 2) ? r.int(2, 100) : r.int(2, 1000000000)), String(r.int(0, 1) ? bigLos(r, 1n, E18) : B(r.int(1, 100000)))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([x, n]) => x >= 2n && x <= 1000000000n && n >= 1n && n <= E18),
            solve: (inp) => zapytania(inp, 2).map(([x, n]) => { let X = big(x); const N = big(n); let c = 0; while (X * X <= N) { X = X * X; c++; } return String(c); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long x, n;
        cin >> x >> n;
        int ile = 0;
        while (x <= n / x) {    // czyli x * x <= n
            x = x * x;
            ile++;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
    ];
};
