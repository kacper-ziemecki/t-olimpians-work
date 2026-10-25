// Krok 3 · Wiele wywołań — drzewo rekurencji i memoizacja.
module.exports = (h) => {
    const { reader } = h;
    const many = (t, gen) => `${t}\n` + Array.from({ length: t }, gen).join('\n');
    const fibBig = (n) => { let a = 0n, b = 1n; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a; };
    const MEMO = 'Zwykła rekurencja liczyłaby tu te same wartości miliony razy i nie zmieściłaby się w limicie czasu — zapamiętuj policzone wyniki w tablicy (memoizacja).';

    return [
        // ------------------------------------------------------------ 1
        {
            id: 'rek-fibonacci',
            title: 'Liczby Fibonacciego',
            level: 'latwe',
            statement: [
                'Ciąg Fibonacciego zaczyna się od liczb 0 i 1, a każda następna liczba to suma dwóch poprzednich: 0, 1, 1, 2, 3, 5, 8, 13, 21, … Zapisujemy to tak: F(0) = 0, F(1) = 1, F(n) = F(n − 1) + F(n − 2).',
                'Wczytaj n i wypisz F(n). Napisz funkcję int fib(int n), która przepisuje tę definicję wprost — z dwoma wywołaniami samej siebie.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz jedną liczbę — F(n).'],
            constraints: ['0 ≤ n ≤ 30'],
            examples: [{ input: '7', note: 'F(7) = F(6) + F(5) = 8 + 5 = 13. Funkcja fib(7) woła fib(6) i fib(5), a każda z nich znowu dwie kolejne — powstaje całe drzewo wywołań.' }],
            hint: 'Dwa warunki stopu: fib(0) = 0 i fib(1) = 1 (możesz je połączyć: if (n <= 1) return n;). Krok: return fib(n - 1) + fib(n - 2);. Dla n = 30 funkcja wywoła się ok. 2,7 miliona razy — to jeszcze zmieści się w sekundzie, ale dla n = 50 już nie (o tym w kolejnych zadaniach).',
            tests: () => ['0', '1', '2', '3', '10', '20', '25', '29', '30'],
            solve: (inp) => String(fibBig(Number(inp))),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int fib(int n) {
    if (n <= 1) return n;
    return fib(n - 1) + fib(n - 2);
}
int main() {
    int n;
    cin >> n;
    cout << fib(n) << "\n";
}`,
        },
        // ------------------------------------------------------------ 2
        {
            id: 'rek-linijka',
            title: 'Linijka',
            level: 'latwe',
            statement: [
                'Spójrz na podziałkę linijki: najdłuższa kreska jest na środku, krótsze na środkach połówek, jeszcze krótsze na środkach ćwiartek… Zapiszmy długości kresek liczbami. Linijka rzędu 1 to po prostu „1”, a linijka rzędu n to: linijka rzędu n − 1, potem liczba n, potem jeszcze raz linijka rzędu n − 1.',
                'Na przykład linijka rzędu 3 to 1 2 1 3 1 2 1. Wczytaj n i wypisz linijkę rzędu n. Napisz funkcję void linijka(int n), która woła samą siebie dwa razy.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz w jednym wierszu liczby tworzące linijkę rzędu n, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 14'],
            examples: [{ input: '3', note: 'linijka(3) = linijka(2), 3, linijka(2) = (1 2 1) 3 (1 2 1). Linijka rzędu n ma 2ⁿ − 1 liczb.' }],
            hint: 'void linijka(int n): if (n == 0) return; linijka(n - 1); cout << n << " "; linijka(n - 1);. Liczba n wypisuje się pomiędzy dwoma wywołaniami — w drodze powrotnej z pierwszego, a przed zejściem w drugie.',
            tests: () => ['1', '2', '4', '5', '7', '10', '12', '14'],
            solve: (inp) => { const o = []; const f = (n) => { if (!n) return; f(n - 1); o.push(n); f(n - 1); }; f(Number(inp)); return o.join(' '); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void linijka(int n) {
    if (n == 0) return;
    linijka(n - 1);
    cout << n << " ";
    linijka(n - 1);
}
int main() {
    int n;
    cin >> n;
    linijka(n);
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 3
        {
            id: 'rek-hanoi',
            title: 'Wieże Hanoi',
            level: 'srednie',
            statement: [
                'Są trzy pręty, ponumerowane 1, 2 i 3. Na pręcie 1 leży n krążków — od największego na dole do najmniejszego na górze. Trzeba przenieść wszystkie krążki na pręt 3. W jednym ruchu wolno zdjąć jeden krążek z wierzchu dowolnego pręta i położyć go na wierzchu innego pręta, ale nigdy nie wolno położyć większego krążka na mniejszym.',
                'Wypisz najkrótszy ciąg ruchów. Kluczowy pomysł: żeby przenieść n krążków z pręta A na pręt C, najpierw przenieś n − 1 górnych krążków na pręt pomocniczy B, potem przełóż największy krążek z A na C, a na koniec przenieś n − 1 krążków z B na C.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n — liczba krążków.'],
            output_format: ['W pierwszym wierszu wypisz liczbę ruchów. W każdym z kolejnych wierszy wypisz jeden ruch: dwie liczby — numer pręta, z którego zdejmujemy krążek, i numer pręta, na który go kładziemy.'],
            constraints: ['1 ≤ n ≤ 10'],
            examples: [{ input: '2', note: 'Mały krążek na pręt 2, duży na pręt 3, mały z pręta 2 na pręt 3.' }, { input: '3' }],
            hint: 'void hanoi(int n, int z, int na, int przez): if (n == 0) return; hanoi(n - 1, z, przez, na); cout << z << " " << na << endl; hanoi(n - 1, przez, na, z);. Z main: hanoi(n, 1, 3, 2). Ruchów jest zawsze 2ⁿ − 1 — to też da się policzyć rekurencyjnie: ruchy(n) = 2 · ruchy(n − 1) + 1.',
            tests: () => ['1', '4', '5', '6', '7', '8', '9', '10'],
            solve: (inp) => { const o = []; const f = (n, a, c, b) => { if (!n) return; f(n - 1, a, b, c); o.push(`${a} ${c}`); f(n - 1, b, c, a); }; f(Number(inp), 1, 3, 2); return [String(o.length), ...o].join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
void hanoi(int n, int z, int na, int przez) {
    if (n == 0) return;
    hanoi(n - 1, z, przez, na);
    cout << z << " " << na << "\n";
    hanoi(n - 1, przez, na, z);
}
int main() {
    int n;
    cin >> n;
    cout << (1 << n) - 1 << "\n";
    hanoi(n, 1, 3, 2);
}`,
        },
        // ------------------------------------------------------------ 4
        {
            id: 'rek-fibonacci-memo',
            title: 'Fibonacci z pamięcią',
            level: 'srednie',
            statement: [
                'Znowu liczby Fibonacciego: F(0) = 0, F(1) = 1, F(n) = F(n − 1) + F(n − 2). Tym razem n sięga 90, a zapytań jest wiele.',
                'Dla każdego zapytania wypisz F(n). ' + MEMO,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu F(n).'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 90'],
            examples: [{ input: '3\n10\n50\n90', note: 'Bez pamięci fib(50) wywołałoby się ok. 4 · 10¹⁰ razy. Z pamięcią każde fib(k) liczy się tylko raz — razem 91 obliczeń.' }],
            hint: 'Zrób globalną tablicę long long pamiec[91] wypełnioną na start wartością −1 („jeszcze nie policzone”). W fib(n): jeśli n <= 1 — return n; jeśli pamiec[n] != −1 — return pamiec[n]; w przeciwnym razie policz, ZAPISZ i zwróć: return pamiec[n] = fib(n - 1) + fib(n - 2);. F(90) ≈ 2,9 · 10¹⁸ mieści się w long long.',
            tests: (r) => ['5\n0\n1\n2\n3\n4', '4\n90\n89\n88\n87', '3\n45\n46\n47', many(100, () => String(r.int(0, 90))), many(91, (_, i) => String(90 - i))],
            solve: (inp) => h.nums(inp).slice(1).map((n) => String(fibBig(n))).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long pamiec[91];
long long fib(int n) {
    if (n <= 1) return n;
    if (pamiec[n] != -1) return pamiec[n];
    return pamiec[n] = fib(n - 1) + fib(n - 2);
}
int main() {
    for (int i = 0; i <= 90; i++) pamiec[i] = -1;
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        cout << fib(n) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 5
        {
            id: 'rek-ile-wywolan',
            title: 'Ile wywołań?',
            level: 'srednie',
            statement: [
                'Oto funkcja z zadania „Liczby Fibonacciego”: int fib(int n) { if (n <= 1) return n; return fib(n - 1) + fib(n - 2); }. Ile razy, łącznie z pierwszym wywołaniem, funkcja fib zostanie wywołana, jeśli w main napiszemy fib(n)?',
                'Policz to rekurencyjnie: niech W(n) oznacza liczbę wywołań. Wywołanie fib(n) to jedno wywołanie plus wszystkie wywołania, które zrobią fib(n − 1) i fib(n − 2). ' + MEMO,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu liczbę wywołań W(n).'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 80'],
            examples: [{ input: '4\n0\n1\n4\n30', note: 'fib(4) woła fib(3) i fib(2); fib(3) woła fib(2) i fib(1); każde fib(2) woła fib(1) i fib(0). Razem 9 wywołań. Dla n = 30 — ponad 2,6 miliona.' }],
            hint: 'W(0) = W(1) = 1 (wywołanie, które od razu zwraca wynik). Dla n ≥ 2: W(n) = 1 + W(n − 1) + W(n − 2). To zwykła rekurencja z dwoma wywołaniami — więc liczyłaby się tak samo długo jak fib! Dodaj tablicę pamięci tak jak w „Fibonacci z pamięcią”. Wynik dla n = 80 przekracza 7 · 10¹⁶ — long long.',
            tests: (r) => ['5\n0\n1\n2\n3\n5', '3\n80\n79\n60', many(100, () => String(r.int(0, 80))), many(81, (_, i) => String(i))],
            solve: (inp) => h.nums(inp).slice(1).map((n) => String(2n * fibBig(n + 1) - 1n)).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long pamiec[81];
long long W(int n) {
    if (n <= 1) return 1;
    if (pamiec[n] != -1) return pamiec[n];
    return pamiec[n] = 1 + W(n - 1) + W(n - 2);
}
int main() {
    for (int i = 0; i <= 80; i++) pamiec[i] = -1;
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        cout << W(n) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 6
        {
            id: 'rek-schody',
            title: 'Schody',
            level: 'srednie',
            statement: [
                'Bajtek wchodzi po schodach, które mają n stopni. Jednym krokiem może wejść o jeden stopień albo — gdy mu się spieszy — od razu o dwa stopnie. Na ile różnych sposobów może dojść na sam szczyt? Dwa sposoby są różne, jeśli różnią się ciągiem kroków, np. dla n = 3 są trzy sposoby: 1+1+1, 1+2 i 2+1.',
                'Pomyśl o ostatnim kroku: na szczyt (stopień n) Bajtek wchodzi albo ze stopnia n − 1, albo ze stopnia n − 2. Dla każdego zapytania wypisz liczbę sposobów. ' + MEMO,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu liczbę sposobów wejścia na n-ty stopień.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 80'],
            examples: [{ input: '4\n1\n2\n3\n5', note: 'Dla n = 5 jest 8 sposobów: 5 sposobów kończących się krokiem o 1 (tyle, ile sposobów na 4 stopnie) plus 3 sposoby kończące się krokiem o 2 (tyle, ile na 3 stopnie).' }],
            hint: 'sposoby(n) = sposoby(n − 1) + sposoby(n − 2), a warunki stopu to sposoby(0) = 1 (już stoimy na szczycie — jeden, pusty sposób) i sposoby(1) = 1. Wygląda znajomo? To prawie Fibonacci! Dodaj tablicę pamięci i użyj long long.',
            tests: (r) => ['3\n1\n2\n3', '4\n4\n6\n10\n20', '3\n80\n79\n70', many(100, () => String(r.int(1, 80))), many(80, (_, i) => String(i + 1))],
            solve: (inp) => h.nums(inp).slice(1).map((n) => String(fibBig(n + 1))).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long pamiec[81];
long long sposoby(int n) {
    if (n <= 1) return 1;
    if (pamiec[n] != -1) return pamiec[n];
    return pamiec[n] = sposoby(n - 1) + sposoby(n - 2);
}
int main() {
    for (int i = 0; i <= 80; i++) pamiec[i] = -1;
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        cout << sposoby(n) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 7
        {
            id: 'rek-schody-k',
            title: 'Schody z dłuższymi krokami',
            level: 'srednie',
            statement: [
                'Tym razem Bajtek ma dłuższe nogi: jednym krokiem może wejść o 1, 2, 3, …, albo k stopni. Na ile sposobów może wejść na szczyt schodów o n stopniach?',
                'Ostatni krok mógł mieć długość 1, 2, …, k — wystarczy zsumować liczby sposobów dojścia do stopni n − 1, n − 2, …, n − k (o ile nie są ujemne). Tym razem funkcja woła samą siebie aż k razy — w pętli wolno to zrobić. ' + MEMO,
            ],
            input_format: ['W jedynym wierszu wejścia znajdują się dwie liczby całkowite n i k.'],
            output_format: ['Wypisz jedną liczbę — liczbę sposobów wejścia na n-ty stopień.'],
            constraints: ['1 ≤ n ≤ 60', '1 ≤ k ≤ 10'],
            examples: [{ input: '4 3', note: 'Sposoby: 1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2, 1+3, 3+1 — razem 7.' }, { input: '10 1', note: 'Gdy wolno robić tylko kroki o 1, jest dokładnie jeden sposób.' }],
            hint: 'sposoby(0) = 1. Dla n > 0: wynik = 0; for (int d = 1; d <= k && d <= n; d++) wynik += sposoby(n - d);. Zapamiętaj wynik w tablicy pamiec[n] (k jest stałe dla całego testu, więc wystarczy tablica jednowymiarowa). Wynik zmieści się w long long.',
            tests: () => ['1 1', '1 10', '2 2', '5 2', '10 3', '30 5', '60 2', '60 10', '60 7', '45 4'],
            solve: (inp) => { const [n, k] = h.nums(inp); const d = [1n]; for (let i = 1; i <= n; i++) { let s = 0n; for (let j = 1; j <= k && j <= i; j++) s += d[i - j]; d.push(s); } return String(d[n]); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int k;
long long pamiec[61];
long long sposoby(int n) {
    if (n == 0) return 1;
    if (pamiec[n] != -1) return pamiec[n];
    long long wynik = 0;
    for (int d = 1; d <= k && d <= n; d++) wynik += sposoby(n - d);
    return pamiec[n] = wynik;
}
int main() {
    int n;
    cin >> n >> k;
    for (int i = 0; i <= 60; i++) pamiec[i] = -1;
    cout << sposoby(n) << "\n";
}`,
        },
        // ------------------------------------------------------------ 8
        {
            id: 'rek-newton',
            title: 'Trójkąt Pascala',
            level: 'srednie',
            statement: [
                'Symbol Newtona C(n, k) mówi, na ile sposobów można wybrać k osób z grupy n osób. Spełnia on piękną zależność: C(n, k) = C(n − 1, k − 1) + C(n − 1, k). Dlaczego? Popatrz na jedną konkretną osobę, np. Bajtka: albo go wybieramy (i dobieramy jeszcze k − 1 osób spośród n − 1 pozostałych), albo nie (i wybieramy wszystkie k osób spośród n − 1 pozostałych).',
                'Do tego C(n, 0) = 1 i C(n, n) = 1 — wybrać nikogo albo wszystkich można tylko na jeden sposób. Dla każdego zapytania wypisz C(n, k). ' + MEMO,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajdują się dwie liczby całkowite n i k.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu wartość C(n, k).'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ k ≤ n ≤ 60'],
            examples: [{ input: '4\n4 2\n5 0\n6 6\n10 3', note: 'C(4, 2) = C(3, 1) + C(3, 2) = 3 + 3 = 6 — z czterech osób A, B, C, D pary to AB, AC, AD, BC, BD, CD.' }],
            hint: 'Tablica pamięci jest tu dwuwymiarowa: long long pamiec[61][61], na start wypełniona −1. W funkcji: if (k == 0 || k == n) return 1; if (pamiec[n][k] != -1) return pamiec[n][k]; return pamiec[n][k] = C(n - 1, k - 1) + C(n - 1, k);. Największa wartość, C(60, 30) ≈ 1,18 · 10¹⁷, mieści się w long long.',
            tests: (r) => ['5\n0 0\n1 0\n1 1\n2 1\n3 2', '3\n60 30\n60 29\n59 30', many(100, () => { const n = r.int(0, 60); return `${n} ${r.int(0, n)}`; }), many(61, (_, i) => `60 ${i}`)],
            solve: (inp) => { const C = [[1n]]; for (let n = 1; n <= 60; n++) { C[n] = []; for (let k = 0; k <= n; k++) C[n][k] = (k === 0 || k === n) ? 1n : C[n - 1][k - 1] + C[n - 1][k]; } const t = h.nums(inp); const o = []; for (let i = 1; i < t.length; i += 2) o.push(String(C[t[i]][t[i + 1]])); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long pamiec[61][61];
long long C(int n, int k) {
    if (k == 0 || k == n) return 1;
    if (pamiec[n][k] != -1) return pamiec[n][k];
    return pamiec[n][k] = C(n - 1, k - 1) + C(n - 1, k);
}
int main() {
    for (int i = 0; i <= 60; i++)
        for (int j = 0; j <= 60; j++) pamiec[i][j] = -1;
    int t;
    cin >> t;
    while (t--) {
        int n, k;
        cin >> n >> k;
        cout << C(n, k) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 9
        {
            id: 'rek-sciezki',
            title: 'Ścieżki na planszy',
            level: 'srednie',
            statement: [
                'Plansza ma a wierszy i b kolumn. Pionek stoi w lewym górnym polu i chce dojść do prawego dolnego. W jednym ruchu może przesunąć się o jedno pole w prawo albo o jedno pole w dół. Ile jest różnych ścieżek?',
                'Na pole (i, j) pionek mógł wejść tylko z pola nad nim (i − 1, j) albo z pola po lewej (i, j − 1). ' + MEMO,
            ],
            input_format: ['W jedynym wierszu wejścia znajdują się dwie liczby całkowite a i b.'],
            output_format: ['Wypisz jedną liczbę — liczbę ścieżek.'],
            constraints: ['1 ≤ a, b ≤ 17'],
            examples: [{ input: '2 3', note: 'Ścieżki: PPD, PDP, DPP (P — w prawo, D — w dół). Razem 3.' }, { input: '3 3' }],
            hint: 'Niech sciezki(i, j) to liczba ścieżek z pola (1, 1) do pola (i, j). Pola w pierwszym wierszu i w pierwszej kolumnie mają dokładnie jedną ścieżkę: if (i == 1 || j == 1) return 1;. W przeciwnym razie sciezki(i, j) = sciezki(i − 1, j) + sciezki(i, j − 1) — z pamięcią w tablicy pamiec[18][18]. Bez pamięci dla 17 × 17 wywołań byłoby ponad miliard.',
            tests: () => ['1 1', '1 17', '17 1', '2 2', '4 5', '10 10', '16 17', '17 17', '12 15'],
            solve: (inp) => { const [a, b] = h.nums(inp); const n = a + b - 2, k = a - 1; let c = 1n; for (let i = 1; i <= k; i++) c = (c * BigInt(n - k + i)) / BigInt(i); return String(c); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long pamiec[18][18];
long long sciezki(int i, int j) {
    if (i == 1 || j == 1) return 1;
    if (pamiec[i][j] != -1) return pamiec[i][j];
    return pamiec[i][j] = sciezki(i - 1, j) + sciezki(i, j - 1);
}
int main() {
    for (int i = 0; i < 18; i++)
        for (int j = 0; j < 18; j++) pamiec[i][j] = -1;
    int a, b;
    cin >> a >> b;
    cout << sciezki(a, b) << "\n";
}`,
        },
        // ------------------------------------------------------------ 10
        {
            id: 'rek-sciezki-przeszkody',
            title: 'Ścieżki z przeszkodami',
            level: 'srednie',
            statement: [
                'Plansza ma n wierszy i m kolumn. Niektóre pola są zablokowane (#), na pozostałe (.) można wchodzić. Pionek stoi w lewym górnym polu i chce dojść do prawego dolnego, poruszając się tylko w prawo albo w dół i nigdy nie wchodząc na zablokowane pole. Ile jest różnych ścieżek?',
                'To samo co w „Ścieżkach na planszy”, ale na zablokowane pole prowadzi 0 ścieżek. Jeśli zablokowane jest pole startowe albo końcowe, odpowiedzią jest 0. ' + MEMO,
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i m.', 'W każdym z kolejnych n wierszy znajduje się m znaków . lub # — kolejne wiersze planszy.'],
            output_format: ['Wypisz jedną liczbę — liczbę ścieżek.'],
            constraints: ['1 ≤ n, m ≤ 20'],
            examples: [{ input: '3 3\n...\n.#.\n...', note: 'Środek jest zablokowany, więc zostają tylko dwie ścieżki: dookoła górą-prawą krawędzią albo lewą-dolną.' }],
            hint: 'Numeruj pola od 0. sciezki(i, j): jeśli i < 0 albo j < 0 albo pole (i, j) to # — return 0; jeśli (i, j) to start (0, 0) — return 1; w przeciwnym razie sciezki(i − 1, j) + sciezki(i, j − 1) z pamięcią. Odpowiedź to sciezki(n − 1, m − 1). Wynik może przekroczyć zakres int — użyj long long.',
            tests: (r) => {
                const G = (n, m, p) => { const g = Array.from({ length: n }, () => Array.from({ length: m }, () => (r() < p ? '#' : '.'))); if (r() < 0.85) { g[0][0] = '.'; g[n - 1][m - 1] = '.'; } return `${n} ${m}\n` + g.map((x) => x.join('')).join('\n'); };
                return ['1 1\n.', '1 1\n#', '2 2\n.#\n#.', '1 5\n.....', G(5, 5, 0.2), G(10, 12, 0.15), G(20, 20, 0), G(20, 20, 0.08), G(20, 20, 0.3), G(17, 20, 0.12)];
            },
            solve: (inp) => {
                const L = h.lines(inp.trim()); const [n, m] = L[0].split(' ').map(Number); const g = L.slice(1);
                const d = Array.from({ length: n }, () => Array(m).fill(0n));
                for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { if (g[i][j] === '#') continue; if (i === 0 && j === 0) { d[i][j] = 1n; continue; } d[i][j] = (i ? d[i - 1][j] : 0n) + (j ? d[i][j - 1] : 0n); }
                return String(d[n - 1][m - 1]);
            },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n, m;
vector<string> g;
long long pamiec[20][20];
long long sciezki(int i, int j) {
    if (i < 0 || j < 0 || g[i][j] == '#') return 0;
    if (i == 0 && j == 0) return 1;
    if (pamiec[i][j] != -1) return pamiec[i][j];
    return pamiec[i][j] = sciezki(i - 1, j) + sciezki(i, j - 1);
}
int main() {
    cin >> n >> m;
    g.assign(n, "");
    for (int i = 0; i < n; i++) cin >> g[i];
    for (int i = 0; i < 20; i++)
        for (int j = 0; j < 20; j++) pamiec[i][j] = -1;
    cout << sciezki(n - 1, m - 1) << "\n";
}`,
        },
        // ------------------------------------------------------------ 11
        {
            id: 'rek-zaba',
            title: 'Żaba na kamieniach',
            level: 'srednie',
            statement: [
                'W rzece leży w rzędzie n kamieni, ponumerowanych od 1 do n; kamień i wystaje na wysokość hᵢ. Żaba siedzi na kamieniu 1 i chce dostać się na kamień n. Z kamienia i może skoczyć na kamień i + 1 albo na kamień i + 2. Skok z kamienia i na kamień j kosztuje ją |hᵢ − hⱼ| sił.',
                'Ile najmniej sił musi zużyć żaba? Tym razem nie liczymy sposobów, tylko szukamy najlepszego — zamiast dodawać wyniki dwóch wywołań, wybieramy mniejszy z nich. ' + MEMO,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych h₁, h₂, …, hₙ.'],
            output_format: ['Wypisz jedną liczbę — najmniejszy łączny koszt dojścia z kamienia 1 na kamień n.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ hᵢ ≤ 10 000'],
            examples: [{ input: '4\n10 30 40 20', note: 'Najtaniej: 1 → 2 (koszt 20), 2 → 4 (koszt 10) — razem 30. Skoki 1 → 3 → 4 kosztowałyby 30 + 20 = 50.' }],
            hint: 'koszt(i) = najmniejszy koszt dojścia na kamień i. koszt(1) = 0. Na kamień i żaba przyskoczyła z i − 1 albo z i − 2, więc koszt(i) = min(koszt(i − 1) + |hᵢ − hᵢ₋₁|, koszt(i − 2) + |hᵢ − hᵢ₋₂|) — przy czym kamień i − 2 istnieje tylko dla i ≥ 3. Zapamiętuj wyniki w tablicy. Głębokość rekurencji sięga 10 000 — to jeszcze bezpieczne.',
            tests: (r) => {
                const T = (n, hi) => `${n}\n${r.arr(n, 1, hi).join(' ')}`;
                return ['1\n5', '2\n1 10000', '3\n10 20 10', '6\n30 10 60 10 60 50', T(20, 100), T(1000, 10000), T(10000, 10000), T(10000, 10), `10000\n${Array.from({ length: 10000 }, (_, i) => (i % 2 ? 10000 : 1)).join(' ')}`];
            },
            solve: (inp) => { const a = h.nums(inp); const n = a[0], hh = a.slice(1); const d = [0]; for (let i = 1; i < n; i++) { let v = d[i - 1] + Math.abs(hh[i] - hh[i - 1]); if (i >= 2) v = Math.min(v, d[i - 2] + Math.abs(hh[i] - hh[i - 2])); d.push(v); } return String(d[n - 1]); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
int hgt[10005];
long long pamiec[10005];
long long koszt(int i) {
    if (i == 1) return 0;
    if (pamiec[i] != -1) return pamiec[i];
    long long w = koszt(i - 1) + abs(hgt[i] - hgt[i - 1]);
    if (i >= 3) w = min(w, koszt(i - 2) + abs(hgt[i] - hgt[i - 2]));
    return pamiec[i] = w;
}
int main() {
    cin >> n;
    for (int i = 1; i <= n; i++) cin >> hgt[i];
    for (int i = 0; i <= n; i++) pamiec[i] = -1;
    cout << koszt(n) << "\n";
}`,
        },
        // ------------------------------------------------------------ 12
        {
            id: 'rek-podzialy-liczby',
            title: 'Na ile sposobów rozłożyć liczbę?',
            level: 'trudne',
            statement: [
                'Na ile sposobów można zapisać liczbę n jako sumę dodatnich liczb całkowitych, jeśli kolejność składników nie ma znaczenia? Na przykład 4 = 4 = 3 + 1 = 2 + 2 = 2 + 1 + 1 = 1 + 1 + 1 + 1 — to 5 sposobów (3 + 1 i 1 + 3 to ten sam sposób).',
                'Pomoże funkcja z dwoma parametrami: R(n, k) = liczba sposobów zapisania n jako sumy składników nie większych niż k. Dla każdego zapytania wypisz liczbę sposobów rozłożenia n. ' + MEMO,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu liczbę rozkładów liczby n.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 120'],
            examples: [{ input: '3\n4\n1\n10', note: 'Dla n = 10 jest 42 rozkłady.' }],
            hint: 'Rozkłady n na składniki ≤ k dzielą się na dwie grupy: te, w których NIE ma składnika k — jest ich R(n, k − 1) — i te, w których jest choć jeden składnik k — po zabraniu go zostaje rozkład n − k na składniki ≤ k, czyli R(n − k, k). Warunki stopu: R(0, k) = 1 (pusty rozkład), R(n, 0) = 0 dla n > 0, a gdy k > n, to R(n, k) = R(n, n). Odpowiedź: R(n, n), z pamięcią w tablicy [121][121] i w long long.',
            tests: (r) => ['5\n1\n2\n3\n5\n6', '3\n120\n119\n100', many(100, () => String(r.int(1, 120))), many(120, (_, i) => String(i + 1))],
            solve: (inp) => { const P = [1n]; for (let i = 1; i <= 120; i++) P.push(0n); for (let k = 1; k <= 120; k++) for (let s = k; s <= 120; s++) P[s] += P[s - k]; return h.nums(inp).slice(1).map((n) => String(P[n])).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long pamiec[121][121];
long long R(int n, int k) {
    if (n == 0) return 1;
    if (k == 0) return 0;
    if (k > n) return R(n, n);
    if (pamiec[n][k] != -1) return pamiec[n][k];
    return pamiec[n][k] = R(n, k - 1) + R(n - k, k);
}
int main() {
    for (int i = 0; i <= 120; i++)
        for (int j = 0; j <= 120; j++) pamiec[i][j] = -1;
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        cout << R(n, n) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 13
        {
            id: 'rek-monety-sposoby',
            title: 'Ile sposobów wydania reszty?',
            level: 'trudne',
            statement: [
                'W Bajtocji są monety o n różnych nominałach c₁, c₂, …, cₙ, a każdego nominału jest nieograniczenie wiele. Na ile sposobów można wypłacić kwotę S? Liczy się tylko to, ile monet każdego nominału użyjemy — kolejność monet nie ma znaczenia.',
                'Przyda się funkcja z dwoma parametrami: sposoby(i, s) = na ile sposobów można wypłacić kwotę s, używając tylko monet o nominałach c₁, …, cᵢ. ' + MEMO,
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i S.', 'W drugim wierszu znajduje się n różnych liczb całkowitych c₁, c₂, …, cₙ.'],
            output_format: ['Wypisz jedną liczbę — liczbę sposobów wypłacenia kwoty S.'],
            constraints: ['1 ≤ n ≤ 10', '0 ≤ S ≤ 1000', '1 ≤ cᵢ ≤ 100', 'wynik mieści się w typie long long'],
            examples: [{ input: '3 5\n1 2 5', note: 'Sposoby: 5; 2+2+1; 2+1+1+1; 1+1+1+1+1 — razem 4.' }, { input: '1 7\n2', note: 'Monetami po 2 nie da się wypłacić nieparzystej kwoty — 0 sposobów.' }],
            hint: 'Patrz na i-ty nominał: albo nie używamy go wcale — sposoby(i − 1, s) — albo używamy go co najmniej raz — wtedy po odłożeniu jednej takiej monety zostaje sposoby(i, s − cᵢ) (i-ty nominał wciąż wolno użyć). Warunki stopu: s == 0 → 1 sposób; s < 0 albo i == 0 (przy s > 0) → 0 sposobów. Pamięć: tablica long long [11][1001].',
            tests: (r) => {
                const T = (n, S, hi) => { const c = r.shuffle(Array.from({ length: hi }, (_, i) => i + 1)).slice(0, n); return `${n} ${S}\n${c.join(' ')}`; };
                return ['1 0\n7', '2 3\n2 4', '4 100\n1 5 10 25', '6 1000\n1 2 5 10 20 50', '10 1000\n1 2 3 4 5 6 7 8 9 10', T(5, 500, 30), T(8, 1000, 100), T(10, 999, 100), '3 1000\n97 98 99', '2 1000\n3 7'];
            },
            solve: (inp) => { const a = h.nums(inp); const n = a[0], S = a[1], c = a.slice(2, 2 + n); const d = Array(S + 1).fill(0n); d[0] = 1n; for (const x of c) for (let s = x; s <= S; s++) d[s] += d[s - x]; return String(d[S]); },
            check: (inp) => { const a = h.nums(inp); const n = a[0], S = a[1], c = a.slice(2, 2 + n); const d = Array(S + 1).fill(0n); d[0] = 1n; for (const x of c) for (let s = x; s <= S; s++) d[s] += d[s - x]; return d[S] >= 2n ** 63n ? 'wynik > long long' : null; },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
int c[11];
long long pamiec[11][1001];
long long sposoby(int i, int s) {
    if (s == 0) return 1;
    if (s < 0 || i == 0) return 0;
    if (pamiec[i][s] != -1) return pamiec[i][s];
    return pamiec[i][s] = sposoby(i - 1, s) + sposoby(i, s - c[i]);
}
int main() {
    int S;
    cin >> n >> S;
    for (int i = 1; i <= n; i++) cin >> c[i];
    for (int i = 0; i <= 10; i++)
        for (int s = 0; s <= 1000; s++) pamiec[i][s] = -1;
    cout << sposoby(n, S) << "\n";
}`,
        },
    ];
};
