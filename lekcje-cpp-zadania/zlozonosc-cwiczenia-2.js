// Złożoność czasowa — ćwiczenia w trakcie lekcji, części 4–5: notacja O (najważniejszy składnik, dane razy k,
// od którego n wygrywa liniowy, tabela wzrostu, wielomian czy wykładnicza, najtańszy program, usuwanie z początku,
// połowienie w środku pętli) oraz „czy zdąży?” (tabela ograniczeń, 10⁸ operacji na sekundę, największe n
// w budżecie) i pierwsze zadania z danymi z generatora (suma i skrajne wartości, ile różnych, najczęstsza,
// najlepszy zysk, najdłuższa seria).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
const P = require('./zlozonosc-pomoc');

module.exports = (h) => {
    const { toks } = h;
    const R = String.raw;
    const B = BigInt;
    const E18 = 10n ** 18n;
    const big = (x) => B(x);
    const liczba = (x) => /^-?\d+$/.test(x);
    // t zapytań po kilka tokenów: wejście „t”, potem t wierszy
    const zapytania = (inp, ile) => { const t = toks(inp); const n = Number(t[0]); const out = []; for (let i = 0; i < n; i++) out.push(t.slice(1 + ile * i, 1 + ile * (i + 1))); return out; };
    // ok dostaje tokeny jako napisy (zadania, w których w wierszu jest też napis)
    const sprawdzT = (inp, ile, maxT, ok) => { const t = toks(inp), n = Number(t[0]); if (!(Number.isInteger(n) && n >= 1 && n <= maxT && t.length === 1 + ile * n)) return 'liczba zapytań'; for (const z of zapytania(inp, ile)) if (!ok(z)) return 'zakres: ' + z.join(' '); return null; };
    // ok dostaje liczby jako BigInt
    const sprawdzZapytania = (inp, ile, maxT, ok) => sprawdzT(inp, ile, maxT, (z) => z.every(liczba) && ok(z.map(big)));
    const wiersze = (lst) => `${lst.length}\n${lst.map((z) => z.join(' ')).join('\n')}`;
    const losZ = (r, n, f) => Array.from({ length: n }, () => f());
    const bigLos = (r, lo, hi) => r.big(lo, hi);
    // liczba „logarytmicznie losowa”: najpierw losowa długość, potem liczba do 10^e
    const losLog = (r, maxE) => bigLos(r, 1n, 10n ** B(r.int(0, maxE)));
    // L — liczba obrotów while (x > 1) x /= 2 (logarytm w dół), D — liczba obrotów for (p = 1; p <= n; p *= 2)
    const L = (n) => { let x = B(n), c = 0n; while (x > 1n) { x /= 2n; c++; } return c; };
    const D = (n) => { const N = B(n); let p = 1n, c = 0n; while (p <= N) { p *= 2n; c++; } return c; };
    const isqrt = (n) => { n = B(n); if (n < 2n) return n; let x = B(Math.floor(Math.sqrt(Number(n)))); while (x * x > n) x--; while ((x + 1n) * (x + 1n) <= n) x++; return x; };
    // zadania z generatorem: wejście to pięć liczb n s a b m
    const sprawdzGen = (maxN, maxM) => (inp) => { const t = toks(inp); return t.length === 5 && t.every((x) => /^\d+$/.test(x)) && P.dobryGen(t, 0, maxN, maxM) ? null : 'parametry generatora'; };
    const gen = (inp) => P.czytajGen(toks(inp));
    const KOD = P.KOD_GEN;
    // nagłówek programu z generatorem (wzorcówki C++)
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
        // ================================================================ KROK 4 · notacja O
        {
            id: 'zc-dominujacy-skladnik', krok: 4, level: 'latwe',
            title: 'Najważniejszy składnik',
            short: 'Program wykonuje c₃n³ + c₂n² + c₁n + c₀ operacji. Jaka to złożoność? Zostaw najszybciej rosnący składnik.',
            tags: ['notacja O', 'najwyższa potęga', 'pomiń stałe'],
            statement: ['Program wykonuje c₃ · n³ + c₂ · n² + c₁ · n + c₀ operacji. Dla każdego z t zapytań (czwórki liczb c₃, c₂, c₁, c₀) wypisz złożoność tego programu w notacji O: O(n^3), O(n^2), O(n) albo O(1).', 'Pamiętaj o dwóch zasadach z lekcji: liczy się tylko najszybciej rosnący składnik (taki, którego współczynnik nie jest zerem), a stałe mnożniki pomijamy.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy cztery liczby: c₃, c₂, c₁, c₀.'],
            output_format: ['t wierszy — w każdym jeden z napisów O(n^3), O(n^2), O(n), O(1).'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ c₃, c₂, c₁, c₀ ≤ 10⁹'],
            examples: [{ input: '4\n3 0 5 7\n0 3 5 7\n0 0 1000000000 0\n0 0 0 0', note: 'Wielki współczynnik nie zmienia klasy: 10⁹ · n to wciąż O(n). Program, który nie robi nic, ma stałą pracę — O(1).' }],
            hint: R`Sprawdzaj współczynniki od najwyższej potęgi: jeśli c₃ > 0 — O(n^3); w przeciwnym razie, jeśli c₂ > 0 — O(n^2); jeśli c₁ > 0 — O(n); a gdy wszystkie trzy są zerami — O(1). Wielkość współczynnika nie ma znaczenia, tylko to, czy jest różny od zera. Wypisuj napisy dokładnie jak w przykładzie, bez spacji.`,
            tests: (r) => [wiersze([['0', '0', '0', '1000000000'], ['1', '1', '1', '1'], ['0', '1', '0', '0'], ['0', '0', '1', '0'], ['1000000000', '0', '0', '0']]),
                wiersze(losZ(r, 1000, () => losZ(r, 4, () => String(r.int(0, 2) === 0 ? r.int(1, 1000000000) : 0))))],
            check: (inp) => sprawdzZapytania(inp, 4, 1000, (c) => c.every((x) => x >= 0n && x <= 1000000000n)),
            solve: (inp) => zapytania(inp, 4).map(([c3, c2, c1]) => (big(c3) > 0n ? 'O(n^3)' : big(c2) > 0n ? 'O(n^2)' : big(c1) > 0n ? 'O(n)' : 'O(1)')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long c3, c2, c1, c0;
        cin >> c3 >> c2 >> c1 >> c0;
        if (c3 > 0) cout << "O(n^3)\n";
        else if (c2 > 0) cout << "O(n^2)\n";
        else if (c1 > 0) cout << "O(n)\n";
        else cout << "O(1)\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-dane-razy-k', krok: 4, level: 'latwe',
            title: 'Dane razy k',
            short: 'Program działał c milisekund. Ile potrwa, gdy danych będzie k razy więcej? Zależy od złożoności.',
            tags: ['O(n) → × k', 'O(n²) → × k²', 'string i if'],
            statement: ['Program o złożoności O(1), O(n), O(n^2) albo O(n^3) działał dla pewnych danych przez c milisekund. Ile milisekund będzie działał, gdy danych będzie k razy więcej?', 'Przyjmij, że czas rośnie dokładnie tak, jak mówi złożoność: dla O(n) — k razy, dla O(n^2) — k² razy, dla O(n^3) — k³ razy, a dla O(1) wcale się nie zmienia.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy: złożoność (napis O(1), O(n), O(n^2) albo O(n^3)), czas c i mnożnik k.'],
            output_format: ['t wierszy — nowe czasy w milisekundach.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ c ≤ 1000', '1 ≤ k ≤ 100 000'],
            examples: [{ input: '4\nO(n^2) 10 10\nO(n) 10 10\nO(n^3) 5 4\nO(1) 7 1000', note: 'Jak w lekcji: program O(n²), który dla 1000 liczb działa 0,01 s (10 ms), dla 10 000 liczb potrzebuje już sekundy — 1000 ms.' }],
            hint: R`Wczytaj złożoność do zmiennej typu string i porównuj ją z napisami: if (z == "O(n^2)") … Potem pomnóż c przez k tyle razy, ile wynosi potęga. Wynik może sięgać 1000 · (10⁵)³ = 10¹⁸ — tylko long long.`,
            tests: (r) => {
                const Z = ['O(1)', 'O(n)', 'O(n^2)', 'O(n^3)'];
                return [wiersze([['O(n^3)', '1000', '100000'], ['O(n^2)', '1000', '100000'], ['O(1)', '1', '1'], ['O(n)', '1', '100000'], ['O(n^3)', '1', '1']]),
                    wiersze(losZ(r, 30, () => [r.pick(Z), String(r.int(1, 20)), String(r.int(1, 10))])),
                    wiersze(losZ(r, 1000, () => [r.pick(Z), String(r.int(1, 1000)), String(r.int(0, 1) ? r.int(1, 100) : r.int(1, 100000))]))];
            },
            check: (inp) => sprawdzT(inp, 3, 1000, ([z, c, k]) => ['O(1)', 'O(n)', 'O(n^2)', 'O(n^3)'].includes(z) && liczba(c) && liczba(k) && big(c) >= 1n && big(c) <= 1000n && big(k) >= 1n && big(k) <= 100000n),
            solve: (inp) => zapytania(inp, 3).map(([z, c, k]) => { const p = { 'O(1)': 0n, 'O(n)': 1n, 'O(n^2)': 2n, 'O(n^3)': 3n }[z]; return String(big(c) * big(k) ** p); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        string z;
        long long c, k;
        cin >> z >> c >> k;
        long long czas = c;
        if (z == "O(n)") czas = c * k;
        else if (z == "O(n^2)") czas = c * k * k;
        else if (z == "O(n^3)") czas = c * k * k * k;
        cout << czas << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-od-ktorego-n', krok: 4, level: 'srednie',
            title: 'Od którego n wygrywa liniowy?',
            short: 'Program A robi a · n operacji, program B — b · n². Od którego n program A jest szybszy? Pętla po n nie zdąży.',
            tags: ['stałe mają znaczenie', 'a · n < b · n²', 'dzielenie całkowite'],
            statement: ['Dwa programy rozwiązują to samo zadanie. Program A wykonuje a · n operacji (jest liniowy, ale „ciężki”), a program B — b · n² operacji. Dla każdego z t zapytań (liczby a i b) wypisz najmniejsze n ≥ 1, dla którego program A wykonuje mniej operacji niż program B.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: a i b.'],
            output_format: ['t wierszy — szukane n.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '3\n1000 1\n5 7\n10 5', note: 'Jak w lekcji: 1000 · n i n² remisują dla n = 1000, a od n = 1001 wygrywa program A. Gdy a < b, program A jest lepszy od razu, dla n = 1.' }],
            hint: R`Podziel obie strony nierówności a · n < b · n² przez n (jest dodatnie): a < b · n. Szukamy więc najmniejszego n, dla którego b · n > a. Liczb n ≥ 1, dla których b · n ≤ a, jest dokładnie a / b (dzielenie całkowite) — więc odpowiedź to a / b + 1. Pętla „zwiększaj n, aż się uda” dla a = 10¹⁸ i b = 1 zrobiłaby 10¹⁸ obrotów.`,
            tests: (r) => [wiersze([['1', '1'], ['1', String(E18)], [String(E18), '1'], [String(E18), String(E18)], ['7', '7'], ['14', '7'], ['15', '7']]),
                wiersze(losZ(r, 30, () => [String(r.int(1, 100)), String(r.int(1, 20))])),
                wiersze(losZ(r, 1000, () => [String(losLog(r, 18)), String(losLog(r, 18))]))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([a, b]) => a >= 1n && a <= E18 && b >= 1n && b <= E18),
            solve: (inp) => zapytania(inp, 2).map(([a, b]) => String(big(a) / big(b) + 1n)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        cout << a / b + 1 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-tabela-wzrostu', krok: 4, level: 'latwe',
            title: 'Tabela wzrostu',
            short: 'Dla danego n wypisz log n, n, n log n, n², n³ i 2ⁿ — i zobacz na własne oczy, jak różnie rosną.',
            tags: ['klasy złożoności', '1LL << n', 'long long'],
            statement: ['Dla każdego z t zapytań (liczby n) wypisz w jednym wierszu sześć liczb: L, n, n · L, n², n³ i 2ⁿ, gdzie L to liczba obrotów pętli while (x > 1) x /= 2; zaczynającej od x = n (czyli logarytm z n zaokrąglony w dół).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — w każdym sześć liczb oddzielonych spacjami.'],
            constraints: ['1 ≤ t ≤ 60', '1 ≤ n ≤ 60'],
            examples: [{ input: '3\n1\n10\n60', note: 'Już dla n = 10 liczba 2ⁿ jest większa od n³, a dla n = 60 — ponad pięć bilionów razy większa.' }],
            hint: R`L policz pętlą z dzieleniem przez 2. 2ⁿ to 1LL << n (albo pętla, która n razy mnoży przez 2) — dla n = 60 to około 1,15 · 10¹⁸, więc tylko long long. Zwykłe 1 << n liczy się na int i dla n ≥ 31 daje złe wyniki.`,
            tests: (r) => [wiersze([['2'], ['3'], ['4']]), wiersze(r.shuffle(Array.from({ length: 60 }, (_, i) => [String(i + 1)]))), wiersze(losZ(r, 60, () => [String(r.int(1, 60))]))],
            check: (inp) => sprawdzZapytania(inp, 1, 60, ([n]) => n >= 1n && n <= 60n),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { const N = big(n), l = L(N); return [l, N, N * l, N * N, N * N * N, 2n ** N].join(' '); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        long long L = 0;
        for (long long x = n; x > 1; x /= 2) L++;
        cout << L << " " << n << " " << n * L << " " << n * n << " " << n * n * n << " " << (1LL << n) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-wielomian-czy-wykladnicza', krok: 4, level: 'srednie',
            title: 'Wielomian czy wykładnicza?',
            short: 'Co jest większe: nᵏ czy 2ⁿ? Dla małych n bywa różnie, ale 2ⁿ zawsze w końcu wygrywa.',
            tags: ['nᵏ i 2ⁿ', 'potęgowanie pętlą', 'long long'],
            statement: ['Dla każdego z t zapytań (liczby n i k) porównaj liczby nᵏ i 2ⁿ. Wypisz n^k, jeśli większa jest pierwsza z nich, 2^n, jeśli większa jest druga, albo rowne, jeśli są równe.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: n i k.'],
            output_format: ['t wierszy — w każdym jeden z napisów n^k, 2^n, rowne.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 62', '1 ≤ k ≤ 10'],
            examples: [{ input: '5\n10 3\n4 2\n20 5\n30 5\n62 10', note: 'Dla k = 5 i n = 20 wielomian jest jeszcze większy (3,2 mln wobec 1 mln), ale przy n = 30 wygrywa już 2ⁿ.' }],
            hint: R`Policz obie liczby w long long: p = 1 i k razy p *= n, a q = 1LL << n (albo n razy q *= 2). Największe możliwe wartości to 62¹⁰ ≈ 8,4 · 10¹⁷ i 2⁶² ≈ 4,6 · 10¹⁸ — obie mieszczą się w long long. Porównaj i wypisz napis dokładnie jak w treści.`,
            tests: (r) => {
                const wszystkie = [];
                for (let n = 1; n <= 62; n++) for (let k = 1; k <= 10; k++) wszystkie.push([String(n), String(k)]);
                return [wiersze([['1', '1'], ['2', '1'], ['2', '2'], ['16', '4'], ['4', '2']]), wiersze(r.shuffle(wszystkie)), wiersze(losZ(r, 1000, () => [String(r.int(1, 62)), String(r.int(1, 10))]))];
            },
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([n, k]) => n >= 1n && n <= 62n && k >= 1n && k <= 10n),
            solve: (inp) => zapytania(inp, 2).map(([n, k]) => { const p = big(n) ** big(k), q = 2n ** big(n); return p > q ? 'n^k' : p < q ? '2^n' : 'rowne'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, k;
        cin >> n >> k;
        long long p = 1;
        for (int i = 0; i < k; i++) p *= n;
        long long q = 1LL << n;
        if (p > q) cout << "n^k\n";
        else if (p < q) cout << "2^n\n";
        else cout << "rowne\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-najtanszy-program', krok: 4, level: 'srednie',
            title: 'Najtańszy program',
            short: 'Trzy programy: a · n², b · n · L i c · n operacji. Który jest najtańszy dla danego n? Stałe mają znaczenie!',
            tags: ['stała i kształt', 'porównywanie kosztów', 'remis — wcześniejsza litera'],
            statement: ['Trzy programy rozwiązują to samo zadanie. Dla danych wielkości n program A wykonuje a · n² operacji, program B — b · n · L, a program C — c · n operacji, gdzie L to liczba obrotów pętli for (long long p = 1; p <= n; p *= 2) (dla n = 1 jest to 1, dla n = 1000 — 10).', 'Dla każdego z t zapytań (liczby a, b, c, n) wypisz literę najtańszego programu i liczbę jego operacji. Jeśli kilka programów wykonuje tyle samo operacji, wybierz najwcześniejszą literę alfabetu.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy cztery liczby: a, b, c, n.'],
            output_format: ['t wierszy — w każdym litera (A, B albo C) i liczba operacji.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a, b ≤ 1000', '1 ≤ c ≤ 10⁹', '1 ≤ n ≤ 10⁶'],
            examples: [{ input: '3\n1 10 1000 5\n1 10 1000 1000\n1 10 50 1000000', note: 'Dla małego n wygrywa „lekki” program kwadratowy, dla tysiąca — program B, a dla miliona — program C, choć w każdym obrocie robi aż 50 działań.' }],
            hint: R`Policz L pętlą z treści (najwyżej 20 obrotów), potem trzy koszty w long long (a · n² może mieć 10¹⁵) i wybierz najmniejszy. Przy remisie wygrywa wcześniejsza litera — zacznij od A i zmieniaj wybór tylko przy ostrej nierówności (<), sprawdzając kolejno B i C.`,
            tests: (r) => {
                const losC = () => r.pick([r.int(1, 10), r.int(1, 1000), r.int(1, 1000000), r.int(1, 1000000000)]);
                const losN = () => r.pick([r.int(1, 10), r.int(1, 1000), r.int(1, 1000000)]);
                return [wiersze([['1', '1', '1', '1'], ['1', '1', '2', '2'], ['1000', '1000', '1000000000', '1000000'], ['1', '1', '1', '1000000'], ['2', '1', '4', '2']]),
                    wiersze(losZ(r, 30, () => [String(r.int(1, 5)), String(r.int(1, 10)), String(r.int(1, 100)), String(r.int(1, 30))])),
                    wiersze(losZ(r, 1000, () => [String(r.int(1, 1000)), String(r.int(1, 1000)), String(losC()), String(losN())]))];
            },
            check: (inp) => sprawdzZapytania(inp, 4, 1000, ([a, b, c, n]) => a >= 1n && a <= 1000n && b >= 1n && b <= 1000n && c >= 1n && c <= 1000000000n && n >= 1n && n <= 1000000n),
            solve: (inp) => zapytania(inp, 4).map(([a, b, c, n]) => {
                const N = big(n), koszty = [['A', big(a) * N * N], ['B', big(b) * N * D(N)], ['C', big(c) * N]];
                let best = koszty[0];
                for (const k of koszty) if (k[1] < best[1]) best = k;
                return best.join(' ');
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b, c, n;
        cin >> a >> b >> c >> n;
        long long L = 0;
        for (long long p = 1; p <= n; p *= 2) L++;
        long long kosztA = a * n * n, kosztB = b * n * L, kosztC = c * n;
        char litera = 'A';
        long long najm = kosztA;
        if (kosztB < najm) {
            najm = kosztB;
            litera = 'B';
        }
        if (kosztC < najm) {
            najm = kosztC;
            litera = 'C';
        }
        cout << litera << " " << najm << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-usuwanie-z-poczatku', krok: 4, level: 'srednie',
            title: 'Usuwanie z początku',
            short: 'Każde v.erase(v.begin()) przesuwa wszystkie pozostałe elementy. Ile przesunięć kosztuje usunięcie k pierwszych?',
            tags: ['ukryte koszty', 'erase w pętli', 'suma kolejnych liczb'],
            statement: ['Vector ma n elementów. Program k razy usuwa jego pierwszy element poleceniem v.erase(v.begin()). Każde takie usunięcie przesuwa o jedno miejsce w lewo wszystkie elementy, które zostają w vectorze. Dla każdego z t zapytań (liczby n i k) wypisz łączną liczbę przesunięć elementów.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy dwie liczby: n i k.'],
            output_format: ['t wierszy — liczby przesunięć.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ k ≤ n ≤ 2 · 10⁹'],
            examples: [{ input: '3\n6 6\n6 2\n1 1', note: 'Opróżnienie vectora z sześcioma elementami kosztuje 5 + 4 + 3 + 2 + 1 + 0 = 15 przesunięć — jak w lekcji. Usunięcie dwóch pierwszych: 5 + 4 = 9.' }],
            hint: R`Pierwsze usunięcie przesuwa n − 1 elementów, drugie n − 2, …, k-te n − k. To suma k kolejnych liczb od n − k do n − 1. Policz ją wzorem z lekcji: (pierwsza + ostatnia) · ile / 2, czyli (2n − k − 1) · k / 2 — iloczyn jest zawsze parzysty. Pętla po k dla n = 2 · 10⁹ nie zdąży, a wynik sięga 2 · 10¹⁸ — long long.`,
            tests: (r) => [wiersze([['1', '1'], ['2', '1'], ['2', '2'], ['2000000000', '2000000000'], ['2000000000', '1'], ['2000000000', '1999999999']]),
                wiersze(losZ(r, 30, () => { const n = r.int(1, 30); return [String(n), String(r.int(1, n))]; })),
                wiersze(losZ(r, 1000, () => { const n = r.int(1, 2000000000); return [String(n), String(r.int(0, 1) ? r.int(1, n) : n - r.int(0, Math.min(n - 1, 1000)))]; }))],
            check: (inp) => sprawdzZapytania(inp, 2, 1000, ([n, k]) => k >= 1n && k <= n && n <= 2000000000n),
            solve: (inp) => zapytania(inp, 2).map(([n, k]) => { const N = big(n), K = big(k); return String((2n * N - K - 1n) * K / 2n); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n, k;
        cin >> n >> k;
        cout << (2 * n - k - 1) * k / 2 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-polowienie-w-srodku', krok: 4, level: 'trudne',
            title: 'Połowienie w środku pętli',
            short: 'Dla każdego i od 1 do n wewnętrzna pętla dzieli j przez 2. Ile obrotów razem? Pogrupuj liczby według długości.',
            tags: ['O(n log n)', 'grupy potęg dwójki', 'long long'],
            statement: ['Dla każdego z t zapytań (liczby n) wypisz, ile razy wykona się instrukcja ile++ w programie:', 'for (long long i = 1; i <= n; i++) for (long long j = i; j > 0; j /= 2) ile++;'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — liczby obrotów.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁷'],
            examples: [{ input: '3\n1\n5\n10', note: 'Dla i = 5 wewnętrzna pętla robi trzy obroty (j = 5, 2, 1), dla i = 8 — cztery. Do n = 5: 1 + 2 + 2 + 3 + 3 = 11.' }],
            hint: R`Wewnętrzna pętla dla danego i robi tyle obrotów, ile cyfr ma i w systemie dwójkowym. Liczby od 2ᵏ do 2ᵏ⁺¹ − 1 mają po k + 1 cyfr i jest ich 2ᵏ. Idź więc po potęgach dwójki p = 1, 2, 4, …, dopóki p ≤ n: w grupie od p do 2p − 1 do n należy min(n, 2p − 1) − p + 1 liczb (ostatnia grupa bywa niepełna) i każda daje tyle samo obrotów. Grup jest najwyżej 57. Cały program to O(n log n): dla n = 10¹⁷ liczyłby latami, a grupami — 57 kroków.`,
            tests: (r) => {
                const E17 = 10n ** 17n;
                return [wiersze([['2'], ['3'], ['4'], ['7'], ['8'], ['1000000']]),
                    wiersze(losZ(r, 30, () => [String(r.int(1, 100))])),
                    wiersze([...losZ(r, 60, () => { const p = 2n ** B(r.int(1, 56)); return [String(p + B(r.int(-1, 0)))]; }), [String(E17)], [String(E17 - 1n)], ...losZ(r, 938, () => [String(r.int(0, 1) ? bigLos(r, 1n, E17) : losLog(r, 17))])])];
            },
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= 10n ** 17n),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { const N = big(n); let s = 0n, k = 1n; for (let p = 1n; p <= N; p *= 2n, k++) { const kon = N < 2n * p - 1n ? N : 2n * p - 1n; s += (kon - p + 1n) * k; } return String(s); }).join('\n'),
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
        long long cyfry = 1;    // ile cyfr dwójkowych mają liczby z bieżącej grupy
        for (long long p = 1; p <= n; p *= 2) {
            long long koniec = min(n, 2 * p - 1);
            ile += (koniec - p + 1) * cyfry;
            cyfry++;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 5 · czy zdąży?
        {
            id: 'zc-limit-z-tresci', krok: 5, level: 'latwe',
            title: 'Czego szuka autor zadania?',
            short: 'Z ograniczenia na n odczytaj z tabeli z lekcji, jaka złożoność wystarczy. Ciąg if … else if.',
            tags: ['tabela ograniczeń', 'if … else if', 'long long'],
            statement: ['W lekcji jest tabela, która dla ograniczenia z treści zadania podpowiada, jaka złożoność wystarczy:', 'n ≤ 10 → O(n!), n ≤ 20 → O(2^n), n ≤ 500 → O(n^3), n ≤ 5000 → O(n^2), n ≤ 10⁶ → O(nlogn), n ≤ 10⁸ → O(n), n ≤ 10¹² → O(sqrtn), w pozostałych przypadkach → O(logn).', 'Dla każdego z t zapytań (liczby n — największej wartości z ograniczeń) wypisz złożoność z pierwszego pasującego wiersza tabeli, w dokładnie takiej postaci jak powyżej.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy liczba n.'],
            output_format: ['t wierszy — złożoności.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n200000\n18\n1000000000000\n5000', note: 'n ≤ 200 000 to typowe ograniczenie zadania na sortowanie. Przy 18 elementach można sprawdzić wszystkie podzbiory.' }],
            hint: R`Ciąg if … else if od najmniejszego progu do największego: if (n <= 10) … else if (n <= 20) … Wczytuj n do long long — może mieć 10¹⁸. Uważaj na granice: n = 5000 to jeszcze O(n^2), a n = 5001 — już O(nlogn).`,
            tests: (r) => {
                const progi = [10n, 20n, 500n, 5000n, 1000000n, 100000000n, 1000000000000n];
                const brzegi = [];
                for (const p of progi) brzegi.push([String(p - 1n)], [String(p)], [String(p + 1n)]);
                return [wiersze([['1'], [String(E18)], ...brzegi]), wiersze(losZ(r, 1000, () => [String(losLog(r, 18))]))];
            },
            check: (inp) => sprawdzZapytania(inp, 1, 1000, ([n]) => n >= 1n && n <= E18),
            solve: (inp) => zapytania(inp, 1).map(([n]) => { const N = big(n); return N <= 10n ? 'O(n!)' : N <= 20n ? 'O(2^n)' : N <= 500n ? 'O(n^3)' : N <= 5000n ? 'O(n^2)' : N <= 1000000n ? 'O(nlogn)' : N <= 100000000n ? 'O(n)' : N <= 1000000000000n ? 'O(sqrtn)' : 'O(logn)'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        if (n <= 10) cout << "O(n!)\n";
        else if (n <= 20) cout << "O(2^n)\n";
        else if (n <= 500) cout << "O(n^3)\n";
        else if (n <= 5000) cout << "O(n^2)\n";
        else if (n <= 1000000) cout << "O(nlogn)\n";
        else if (n <= 100000000) cout << "O(n)\n";
        else if (n <= 1000000000000LL) cout << "O(sqrtn)\n";
        else cout << "O(logn)\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-czy-zdazy', krok: 5, level: 'srednie',
            title: 'Czy zdąży w sekundę?',
            short: 'Dla złożoności i n policz operacje i porównaj ze 100 milionami. Uważaj: n³ dla n = 10¹⁸ przepełni long long.',
            tags: ['10⁸ operacji na sekundę', 'przepełnienie', 'najpierw sprawdź, potem mnóż'],
            statement: ['Przyjmujemy regułę z lekcji: program zdąży w sekundę, jeśli wykona co najwyżej 10⁸ operacji. Liczbę operacji dla danego n liczymy tak:', 'O(1) → 1, O(logn) → L, O(sqrtn) → S, O(n) → n, O(nlogn) → n · L, O(n^2) → n², O(n^3) → n³, O(2^n) → 2ⁿ, O(n!) → n!,', 'gdzie L to liczba obrotów pętli while (x > 1) x /= 2; zaczynającej od x = n, a S — liczba obrotów pętli for (long long d = 1; d * d <= n; d++).', 'Dla każdego z t zapytań (złożoność i n) wypisz TAK, jeśli program zdąży, albo NIE.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy złożoność (jeden z dziewięciu napisów z treści) i liczba n.'],
            output_format: ['t wierszy — TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '6\nO(n^2) 5000\nO(n^2) 200000\nO(n^3) 400\nO(2^n) 20\nO(n!) 12\nO(logn) 1000000000000000000', note: '5000² = 2,5 · 10⁷ — zdąży; 200 000² = 4 · 10¹⁰ — nie. 400³ = 6,4 · 10⁷, 2²⁰ ≈ 10⁶, a 12! ≈ 4,8 · 10⁸ — już za dużo.' }],
            hint: R`Nie licz od razu n³ czy 2ⁿ — dla n = 10¹⁸ przepełni się nawet long long. Najpierw odrzuć za duże n: na przykład n³ ≤ 10⁸ może być tylko dla n ≤ 464 (465³ to już ponad 10⁸), więc większe n od razu dają NIE. Taki próg znajdź dla każdej klasy (możesz go policzyć osobnym programem). Dla O(nlogn) najpierw sprawdź n ≤ 10⁸, a dopiero potem mnóż przez L. S ≤ 10⁸ jest dokładnie wtedy, gdy n < (10⁸ + 1)². O(1) i O(logn) zawsze zdążą.`,
            tests: (r) => {
                const Z = ['O(1)', 'O(logn)', 'O(sqrtn)', 'O(n)', 'O(nlogn)', 'O(n^2)', 'O(n^3)', 'O(2^n)', 'O(n!)'];
                const brzegi = [['O(n)', 100000000n], ['O(nlogn)', 4545454n], ['O(n^2)', 10000n], ['O(n^3)', 464n], ['O(2^n)', 26n], ['O(n!)', 11n], ['O(sqrtn)', 10000000200000000n]];
                const b = [];
                for (const [z, p] of brzegi) for (const d of [-1n, 0n, 1n]) b.push([z, String(p + d)]);
                const male = [];
                for (const z of Z) for (const n of [1n, 2n, 3n, E18]) male.push([z, String(n)]);
                return [wiersze(male), wiersze(b), wiersze(losZ(r, 1000, () => { const z = r.pick(Z); const n = r.int(0, 2) ? losLog(r, 18) : B(r.int(1, 30)); return [z, String(n)]; }))];
            },
            check: (inp) => sprawdzT(inp, 2, 1000, ([z, n]) => ['O(1)', 'O(logn)', 'O(sqrtn)', 'O(n)', 'O(nlogn)', 'O(n^2)', 'O(n^3)', 'O(2^n)', 'O(n!)'].includes(z) && liczba(n) && big(n) >= 1n && big(n) <= E18),
            solve: (inp) => {
                const LIM = 100000000n;
                const ops = {
                    'O(1)': () => 1n, 'O(logn)': (n) => L(n), 'O(sqrtn)': (n) => isqrt(n), 'O(n)': (n) => n, 'O(nlogn)': (n) => n * L(n),
                    'O(n^2)': (n) => n * n, 'O(n^3)': (n) => n * n * n, 'O(2^n)': (n) => (n > 100n ? LIM + 1n : 2n ** n),
                    'O(n!)': (n) => { let f = 1n; for (let i = 1n; i <= n && f <= LIM; i++) f *= i; return f; },
                };
                return zapytania(inp, 2).map(([z, n]) => (ops[z](big(n)) <= LIM ? 'TAK' : 'NIE')).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const long long LIMIT = 100000000;
    int t;
    cin >> t;
    while (t--) {
        string z;
        long long n;
        cin >> z >> n;
        bool zdazy;
        if (z == "O(1)" || z == "O(logn)") zdazy = true;
        else if (z == "O(sqrtn)") zdazy = n < (LIMIT + 1) * (LIMIT + 1);
        else if (z == "O(n)") zdazy = n <= LIMIT;
        else if (z == "O(nlogn)") {
            if (n > LIMIT) zdazy = false;
            else {
                long long L = 0;
                for (long long x = n; x > 1; x /= 2) L++;
                zdazy = n * L <= LIMIT;
            }
        }
        else if (z == "O(n^2)") zdazy = n <= 10000;
        else if (z == "O(n^3)") zdazy = n <= 464;
        else if (z == "O(2^n)") zdazy = n <= 26;
        else zdazy = n <= 11;   // O(n!): 11! = 39 916 800, a 12! to już ponad 10^8
        cout << (zdazy ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-najwieksze-n', krok: 5, level: 'srednie',
            title: 'Największe n w budżecie',
            short: 'Masz budżet T operacji. Jak duże dane przerobi program O(n), O(n²), O(n³), O(2ⁿ) albo O(n!)? Tabela z lekcji od drugiej strony.',
            tags: ['tabela od drugiej strony', 'pętla z warunkiem', 'long long'],
            statement: ['Program dla danych wielkości n wykonuje n, n², n³, 2ⁿ albo n! operacji — zależnie od złożoności. Dla każdego z t zapytań (złożoność i budżet T) wypisz największe n ≥ 0, dla którego program wykona nie więcej niż T operacji.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy złożoność (napis O(n), O(n^2), O(n^3), O(2^n) albo O(n!)) i liczba T.'],
            output_format: ['t wierszy — największe n.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ T ≤ 10¹²'],
            examples: [{ input: '5\nO(n) 100000000\nO(n^2) 100000000\nO(n^3) 100000000\nO(2^n) 100000000\nO(n!) 100000000', note: 'To budżet jednej sekundy — i stąd biorą się wiersze tabeli z lekcji: 10⁸, 10⁴, 464, 26 i 11.' }],
            hint: R`Dla O(n) odpowiedź to po prostu T — pętla „n++ dopóki n + 1 ≤ T” zrobiłaby tu nawet bilion obrotów. W pozostałych przypadkach zwiększaj n, dopóki następna wartość mieści się w budżecie: while ((n + 1) * (n + 1) <= T) n++; — i podobnie dla n³. Dla 2ⁿ trzymaj p = 2ⁿ i sprawdzaj p * 2 <= T, a dla n! — f = n! i f * (n + 1) <= T. Dla O(n^2) i T = 10¹² to milion obrotów — szybko.`,
            tests: (r) => {
                const Z = ['O(n)', 'O(n^2)', 'O(n^3)', 'O(2^n)', 'O(n!)'];
                const T12 = 10n ** 12n;
                const brzegi = [];
                for (const v of [1n, 2n, 6n, 24n, 120n, 3628800n, 479001600n, 1000000n, 1000000000n, 2n ** 39n, 999999n * 999999n, 9999n ** 3n, T12])
                    for (const d of [-1n, 0n, 1n]) if (v + d >= 1n && v + d <= T12) for (const z of Z) brzegi.push([z, String(v + d)]);
                const paczki = [];
                for (let i = 0; i < brzegi.length; i += 100) paczki.push(wiersze(brzegi.slice(i, i + 100)));
                return [...paczki, wiersze(losZ(r, 100, () => [r.pick(Z), String(r.int(0, 1) ? losLog(r, 12) : bigLos(r, T12 / 2n, T12))])), wiersze(losZ(r, 100, () => ['O(n^2)', String(bigLos(r, T12 - 1000000n, T12))]))];
            },
            check: (inp) => sprawdzT(inp, 2, 100, ([z, T]) => ['O(n)', 'O(n^2)', 'O(n^3)', 'O(2^n)', 'O(n!)'].includes(z) && liczba(T) && big(T) >= 1n && big(T) <= 10n ** 12n),
            solve: (inp) => zapytania(inp, 2).map(([z, t]) => {
                const T = big(t);
                if (z === 'O(n)') return String(T);
                if (z === 'O(n^2)') return String(isqrt(T));
                let n = 0n;
                if (z === 'O(n^3)') { while ((n + 1n) ** 3n <= T) n++; }
                else if (z === 'O(2^n)') { while (2n ** (n + 1n) <= T) n++; }
                else { let f = 1n; while (f * (n + 1n) <= T) { n++; f *= n; } }
                return String(n);
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        string z;
        long long T;
        cin >> z >> T;
        long long n = 0;
        if (z == "O(n)") n = T;
        else if (z == "O(n^2)") {
            while ((n + 1) * (n + 1) <= T) n++;
        } else if (z == "O(n^3)") {
            while ((n + 1) * (n + 1) * (n + 1) <= T) n++;
        } else if (z == "O(2^n)") {
            long long p = 1;            // p = 2^n
            while (p * 2 <= T) {
                p *= 2;
                n++;
            }
        } else {
            long long f = 1;            // f = n!
            while (f * (n + 1) <= T) {
                n++;
                f *= n;
            }
        }
        cout << n << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zc-generator-suma-min-max', krok: 5, level: 'latwe',
            title: 'Generator: suma, minimum, maksimum',
            short: 'Pierwsze zadanie z danymi z generatora: wygeneruj milion liczb według przepisu z lekcji i policz sumę, najmniejszą i największą.',
            tags: ['generator', 'vector', 'O(n)'],
            statement: ['Wygeneruj ciąg x₁, …, xₙ tak jak w lekcji: x₁ = s, a każdy następny wyraz to xᵢ = (xᵢ₋₁ · a + b) mod m. Wypisz sumę wszystkich wyrazów, najmniejszy wyraz i największy wyraz.'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Trzy liczby: suma, najmniejszy i największy wyraz ciągu.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'Ciąg to 3, 2, 5, 6, 3 — ten sam co w lekcji. Suma 19, najmniejszy wyraz 2, największy 6.' }, { input: '1000000 12345 1103515 12345 1000000000' }],
            hint: `Przepisz generator z lekcji: ${KOD} Wszystko w long long — iloczyn x · a może sięgać 10¹⁸, a suma miliona liczb — 10¹⁵. Potem jedna pętla po vectorze, jak w lekcji o max i min.`,
            tests: (r) => ['1 7 3 2 10', '10 0 0 0 1', '20 5 0 3 10', P.losGen(r, 30, 100), P.losGen(r, 1000, 1000000000), '1000000 0 1 1 1000000000', '1000000 999999999 1 999999999 1000000000', P.losGen(r, 1000000, 1000000000), P.losGen(r, 1000000, 1000)],
            check: sprawdzGen(1000000, 1000000000),
            solve: (inp) => { const { n, x } = gen(inp); let s = 0, mn = x[0], mx = x[0]; for (let i = 0; i < n; i++) { s += x[i]; if (x[i] < mn) mn = x[i]; if (x[i] > mx) mx = x[i]; } return `${s} ${mn} ${mx}`; },
            cpp: GEN_CPP + R`    long long suma = 0, najm = x[0], najw = x[0];
    for (int i = 0; i < n; i++) {
        suma += x[i];
        najm = min(najm, x[i]);
        najw = max(najw, x[i]);
    }
    cout << suma << " " << najm << " " << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-ile-roznych', krok: 5, level: 'srednie',
            title: 'Ile różnych liczb?',
            short: 'Milion liczb z generatora, każda mniejsza od m ≤ 10⁶. Ile różnych? Pętla w pętli nie zdąży — zaznaczaj w tablicy.',
            tags: ['tablica bool', 'O(n + m)', 'generator'],
            statement: ['Wygeneruj ciąg x₁, …, xₙ jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz, ile różnych liczb w nim występuje.'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — ile jest różnych wyrazów.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁶', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'Ciąg 3, 2, 5, 6, 3 — trójka powtarza się, różnych liczb jest cztery.' }],
            hint: R`To przykład z lekcji. Pomysł „dla każdej liczby sprawdź wszystkie wcześniejsze” to O(n²) — pół biliona porównań. Wszystkie liczby są mniejsze od m, więc utwórz vector<bool> bylo(m, false) i przy każdej liczbie sprawdzaj i zaznaczaj jej pole — jedno przejście, O(n + m).`,
            tests: (r) => ['1 0 0 0 1', '10 0 0 0 1', '12 1 1 1 10', P.losGen(r, 50, 30), P.losGen(r, 1000, 1000), '1000000 5 21 7 1000000', '1000000 0 1 1 1000000', P.losGen(r, 1000000, 1000000), P.losGen(r, 1000000, 999983), P.losGen(r, 1000000, 1000)],
            check: sprawdzGen(1000000, 1000000),
            solve: (inp) => { const { n, m, x } = gen(inp); const byl = new Uint8Array(m); let c = 0; for (let i = 0; i < n; i++) if (!byl[x[i]]) { byl[x[i]] = 1; c++; } return String(c); },
            cpp: GEN_CPP + R`    vector<bool> bylo(m, false);
    int rozne = 0;
    for (int i = 0; i < n; i++) {
        if (!bylo[x[i]]) {
            bylo[x[i]] = true;
            rozne++;
        }
    }
    cout << rozne << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-najczestsza', krok: 5, level: 'srednie',
            title: 'Najczęstsza liczba',
            short: 'Która liczba z generatora występuje najczęściej? Tablica zliczeń zamiast liczenia od nowa dla każdej liczby.',
            tags: ['tablica zliczeń', 'O(n + m)', 'remis — najmniejsza'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz liczbę, która występuje w nim najczęściej, oraz ile razy wystąpiła. Jeśli kilka liczb występuje tyle samo razy, wypisz najmniejszą z nich.'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Dwie liczby: najczęstsza liczba i liczba jej wystąpień.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁶', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'W ciągu 3, 2, 5, 6, 3 tylko trójka występuje dwa razy.' }, { input: '6 2 1 1 3', note: 'Ciąg 2, 0, 1, 2, 0, 1 — każda liczba dwa razy, więc wygrywa najmniejsza: 0.' }],
            hint: R`Utwórz vector<int> ile(m, 0) i przy każdym wyrazie zwiększaj jego licznik — O(n). Potem przejdź po wartościach od 0 do m − 1 i wybierz największy licznik. Przechodząc od najmniejszych wartości i zmieniając wybór tylko przy ostrej nierówności (>), sam rozstrzygniesz remisy na korzyść mniejszej liczby. Liczenie count dla każdego wyrazu osobno to O(n²).`,
            tests: (r) => ['1 0 0 0 1', '7 4 0 4 5', '10 3 1 2 7', P.losGen(r, 50, 20), P.losGen(r, 1000, 1000), '1000000 5 21 7 1000000', P.losGen(r, 1000000, 1000000), P.losGen(r, 1000000, 999983), P.losGen(r, 1000000, 1000), P.losGen(r, 1000000, 17)],
            check: sprawdzGen(1000000, 1000000),
            solve: (inp) => { const { n, m, x } = gen(inp); const ile = new Int32Array(m); for (let i = 0; i < n; i++) ile[x[i]]++; let best = 0; for (let v = 1; v < m; v++) if (ile[v] > ile[best]) best = v; return `${best} ${ile[best]}`; },
            cpp: GEN_CPP + R`    vector<int> ile(m, 0);
    for (int i = 0; i < n; i++) ile[x[i]]++;
    int najlepsza = 0;
    for (int v = 1; v < m; v++)
        if (ile[v] > ile[najlepsza]) najlepsza = v;
    cout << najlepsza << " " << ile[najlepsza] << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-najlepszy-zysk', krok: 5, level: 'srednie',
            title: 'Najlepszy zysk',
            short: 'Ceny akcji z generatora. Kup jednego dnia, sprzedaj później — jaki największy zysk? Pamiętaj najniższą cenę dotąd.',
            tags: ['minimum dotąd', 'jedno przejście', 'O(n)'],
            statement: ['Ciąg z generatora (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) to ceny akcji w kolejnych n dniach. Możesz kupić akcję jednego dnia i sprzedać ją któregoś z późniejszych dni. Wypisz największy możliwy zysk, czyli największą różnicę xⱼ − xᵢ dla i < j. Jeśli żadna transakcja nie daje zysku (albo n = 1), wypisz 0.'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — największy zysk.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'Ceny 3, 2, 5, 6, 3: kupujemy za 2 (dzień 2.) i sprzedajemy za 6 (dzień 4.) — zysk 4.' }],
            hint: R`Pętla w pętli (każda para dni) to O(n²). Zamiast tego idź po dniach i pamiętaj najniższą cenę spośród dni wcześniejszych. Sprzedając danego dnia, zarobisz cena − najniższa_dotąd; wybierz największy taki zysk (co najmniej 0). Jedno przejście — O(n).`,
            tests: (r) => ['1 5 3 2 10', '6 9 1 9 10', '10 0 1 1 1000', P.losGen(r, 50, 100), P.losGen(r, 1000, 1000000000), '1000000 999999999 1 999999999 1000000000', '1000000 0 1 1 1000000000', P.losGen(r, 1000000, 1000000000), P.losGen(r, 1000000, 999999937)],
            check: sprawdzGen(1000000, 1000000000),
            solve: (inp) => { const { n, x } = gen(inp); let mn = x[0], z = 0; for (let i = 1; i < n; i++) { if (x[i] - mn > z) z = x[i] - mn; if (x[i] < mn) mn = x[i]; } return String(z); },
            cpp: GEN_CPP + R`    long long najnizsza = x[0], zysk = 0;
    for (int i = 1; i < n; i++) {
        zysk = max(zysk, x[i] - najnizsza);
        najnizsza = min(najnizsza, x[i]);
    }
    cout << zysk << "\n";
    return 0;
}`,
        },
        {
            id: 'zc-najdluzsza-seria', krok: 5, level: 'srednie',
            title: 'Najdłuższa seria wzrostów',
            short: 'Najdłuższy spójny fragment ciągu z generatora, w którym każda liczba jest większa od poprzedniej. Jedno przejście.',
            tags: ['licznik serii', 'O(n)', 'generator'],
            statement: ['Wygeneruj ciąg jak w lekcji (x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m) i wypisz długość najdłuższego spójnego fragmentu, w którym każdy wyraz jest większy od poprzedniego. Fragment złożony z jednego wyrazu też się liczy.'],
            input_format: ['Jeden wiersz z pięcioma liczbami: n, s, a, b, m.'],
            output_format: ['Jedna liczba — długość najdłuższej serii.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '5 3 7 1 10', note: 'W ciągu 3, 2, 5, 6, 3 najdłuższa seria wzrostów to 2, 5, 6.' }],
            hint: R`Idź po ciągu i trzymaj długość bieżącej serii: jeśli x[i] > x[i − 1], seria rośnie o 1, w przeciwnym razie zaczyna się od nowa (długość 1). Po każdym kroku porównuj z najlepszym wynikiem. Sprawdzanie każdego początku osobno działa wolno, gdy serie są długie — a w testach są serie liczące setki tysięcy wyrazów.`,
            tests: (r) => ['1 5 3 2 10', '10 0 0 0 1', '12 0 1 1 5', P.losGen(r, 50, 100), P.losGen(r, 1000, 1000000000), '1000000 0 1 1 1000000000', '1000000 999999000 1 1 1000000000', '1000000 1 1 3 1000000000', P.losGen(r, 1000000, 1000000000)],
            check: sprawdzGen(1000000, 1000000000),
            solve: (inp) => { const { n, x } = gen(inp); let s = 1, best = 1; for (let i = 1; i < n; i++) { s = x[i] > x[i - 1] ? s + 1 : 1; if (s > best) best = s; } return String(best); },
            cpp: GEN_CPP + R`    int seria = 1, najdluzsza = 1;
    for (int i = 1; i < n; i++) {
        if (x[i] > x[i - 1]) seria++;
        else seria = 1;
        najdluzsza = max(najdluzsza, seria);
    }
    cout << najdluzsza << "\n";
    return 0;
}`,
        },
    ];
};
