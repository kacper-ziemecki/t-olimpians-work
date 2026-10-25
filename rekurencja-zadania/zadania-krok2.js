// Krok 2 · Rekurencja, która zwraca wynik.
// Funkcje z return: liczby, cyfry, tablice i napisy (indeks jako parametr), akumulator, NWD.
module.exports = (h) => {
    const { reader } = h;
    const ZAUFAJ = 'Zadanie rozwiąż rekurencyjnie — funkcja liczy wynik przez return i nie ma w środku żadnej pętli. Pętla jest dozwolona tylko w main, do wczytania danych.';
    const many = (r, t, gen) => `${t}\n` + Array.from({ length: t }, gen).join('\n');
    const B18 = '1000000000000000000';

    return [
        // ------------------------------------------------------------ 1
        {
            id: 'rek-suma-do-n',
            title: 'Suma od 1 do n',
            level: 'latwe',
            statement: [
                'Policz sumę 1 + 2 + 3 + … + n.',
                'Napisz funkcję int suma(int n), która zwraca tę sumę. Pomysł: suma liczb od 1 do n to n + (suma liczb od 1 do n − 1), a z mniejszą sumą poradzi sobie wywołanie suma(n - 1). Nie używaj wzoru n·(n + 1) / 2 — chodzi o przećwiczenie rekurencji. ' + ZAUFAJ,
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz jedną liczbę — sumę 1 + 2 + … + n.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '5', note: 'suma(5) = 5 + suma(4) = 5 + 4 + suma(3) = … = 5 + 4 + 3 + 2 + 1 + suma(0) = 15, bo suma(0) = 0.' }],
            hint: 'Warunek stopu: suma(0) = 0 (suma zera liczb). Krok: return n + suma(n - 1);. Nie śledź w głowie wszystkich wywołań — wystarczy założyć, że suma(n - 1) zwraca poprawny wynik, i dodać do niego n.',
            tests: (r) => ['1', '2', '3', '10', '100', String(r.int(200, 900)), String(r.int(1000, 5000)), '9999', '10000'],
            solve: (inp) => { const n = Number(inp); return String((n * (n + 1)) / 2); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int suma(int n) {
    if (n == 0) return 0;
    return n + suma(n - 1);
}
int main() {
    int n;
    cin >> n;
    cout << suma(n) << "\n";
}`,
        },
        // ------------------------------------------------------------ 2
        {
            id: 'rek-silnia',
            title: 'Silnia',
            level: 'latwe',
            statement: [
                'Silnia liczby n to iloczyn n! = 1 · 2 · 3 · … · n. Umawiamy się, że 0! = 1. Na przykład 5! = 120.',
                'Dla każdej z t liczb wypisz jej silnię. Napisz funkcję long long silnia(int n) korzystającą z tego, że n! = n · (n − 1)!. ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu wartość n!.'],
            constraints: ['1 ≤ t ≤ 21', '0 ≤ n ≤ 20'],
            examples: [{ input: '4\n5\n0\n1\n10', note: '5! = 5 · 4! = 5 · 24 = 120. 0! = 1 z definicji — to jest warunek stopu.' }],
            hint: 'silnia(0) = 1, a dla n > 0: return n * silnia(n - 1);. Już 13! nie mieści się w int, a 20! = 2 432 902 008 176 640 000 ledwo mieści się w long long — dlatego funkcja zwraca long long.',
            tests: () => ['3\n2\n3\n4', '5\n6\n7\n8\n9\n11', '4\n12\n13\n14\n15', '3\n18\n19\n20',
                '21\n' + Array.from({ length: 21 }, (_, i) => i).join('\n'), '6\n20\n0\n20\n1\n16\n17'],
            solve: (inp) => h.toks(inp).slice(1).map((x) => { let f = 1n; for (let i = 2n; i <= BigInt(x); i++) f *= i; return String(f); }).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long silnia(int n) {
    if (n == 0) return 1;
    return n * silnia(n - 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        cout << silnia(n) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 3
        {
            id: 'rek-potega',
            title: 'Potęga',
            level: 'latwe',
            statement: [
                'Dla każdego zapytania policz aⁿ — iloczyn n liczb równych a. Przyjmujemy, że a⁰ = 1.',
                'Napisz funkcję long long potega(long long a, int n), która korzysta z tego, że aⁿ = a · aⁿ⁻¹. ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajdują się dwie liczby całkowite a i n.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu wartość aⁿ.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ a ≤ 10⁹', '0 ≤ n ≤ 60', 'aⁿ ≤ 10¹⁸'],
            examples: [{ input: '4\n2 10\n3 4\n7 0\n10 18', note: '2¹⁰ = 2 · 2⁹ = … = 1024. Dowolna liczba do potęgi 0 to 1 — to warunek stopu.' }],
            hint: 'potega(a, 0) = 1, a dla n > 0: return a * potega(a, n - 1);. Pamiętaj, żeby a i wynik były typu long long.',
            tests: (r) => {
                const q = () => {
                    const a = r.pick([1, 2, 3, 5, 10, r.int(2, 1000), r.int(1000, 1000000000)]);
                    let n = 0, p = 1n;
                    const lim = r.int(0, 60);
                    while (n < lim && p * BigInt(a) <= 10n ** 18n) { p *= BigInt(a); n++; }
                    return `${a} ${a === 1 ? r.int(0, 60) : n}`;
                };
                return ['3\n2 0\n2 1\n2 2', '5\n2 59\n2 58\n3 37\n1 60\n1000000000 2', '4\n10 0\n10 1\n10 9\n10 18',
                    many(r, 30, q), many(r, 100, q)];
            },
            solve: (inp) => { const t = h.toks(inp); const o = []; for (let i = 1; i < t.length; i += 2) o.push(String(BigInt(t[i]) ** BigInt(t[i + 1]))); return o.join('\n'); },
            check: (inp) => { const t = h.toks(inp); for (let i = 1; i < t.length; i += 2) if (BigInt(t[i]) ** BigInt(t[i + 1]) > 10n ** 18n) return 'a^n > 10^18'; return null; },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long potega(long long a, int n) {
    if (n == 0) return 1;
    return a * potega(a, n - 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a; int n;
        cin >> a >> n;
        cout << potega(a, n) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 4
        {
            id: 'rek-liczba-cyfr',
            title: 'Ile cyfr?',
            level: 'latwe',
            statement: [
                'Dla każdej z t liczb wypisz, ile ma cyfr w zapisie dziesiętnym.',
                'Napisz funkcję int ileCyfr(long long n). Liczba n ma o jedną cyfrę więcej niż n / 10 — chyba że jest jednocyfrowa. ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdej liczby wypisz w osobnym wierszu liczbę jej cyfr.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n4821\n7\n0\n1000000', note: 'Liczba 0 ma jedną cyfrę. 4821 ma o jedną cyfrę więcej niż 482.' }],
            hint: 'Warunek stopu: jeśli n < 10, liczba ma 1 cyfrę (to działa też dla n = 0). W przeciwnym razie: return 1 + ileCyfr(n / 10);. Uwaga: warunek „n == 0 → 0 cyfr” dawałby złą odpowiedź dla samego zera.',
            tests: (r) => ['5\n0\n9\n10\n99\n100', '4\n1000000000000000000\n999999999999999999\n123456789\n1',
                many(r, 50, () => String(r.big(0, '1' + '0'.repeat(r.int(1, 18))))), many(r, 100, () => String(r.big(0, B18)))],
            solve: (inp) => h.toks(inp).slice(1).map((x) => String(x.length)).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int ileCyfr(long long n) {
    if (n < 10) return 1;
    return 1 + ileCyfr(n / 10);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << ileCyfr(n) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 5
        {
            id: 'rek-suma-cyfr',
            title: 'Suma cyfr',
            level: 'latwe',
            statement: [
                'Dla każdej z t liczb wypisz sumę jej cyfr. Na przykład suma cyfr liczby 4821 to 4 + 8 + 2 + 1 = 15.',
                'Napisz funkcję int sumaCyfr(long long n): suma cyfr liczby n to jej ostatnia cyfra plus suma cyfr liczby n / 10. ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdej liczby wypisz w osobnym wierszu sumę jej cyfr.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n4821\n0\n999', note: 'sumaCyfr(4821) = 1 + sumaCyfr(482) = 1 + 2 + sumaCyfr(48) = … = 1 + 2 + 8 + 4 + sumaCyfr(0) = 15.' }],
            hint: 'sumaCyfr(0) = 0 — liczba bez cyfr. Dla n > 0: return n % 10 + sumaCyfr(n / 10);.',
            tests: (r) => ['5\n0\n9\n10\n19\n100', '3\n999999999999999999\n1000000000000000000\n123456789012345678',
                many(r, 50, () => String(r.big(0, '1' + '0'.repeat(r.int(1, 18))))), many(r, 100, () => String(r.big(0, B18)))],
            solve: (inp) => h.toks(inp).slice(1).map((x) => String(x.split('').reduce((a, c) => a + Number(c), 0))).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int sumaCyfr(long long n) {
    if (n == 0) return 0;
    return n % 10 + sumaCyfr(n / 10);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << sumaCyfr(n) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 6
        {
            id: 'rek-ile-razy-cyfra',
            title: 'Ile razy występuje cyfra?',
            level: 'latwe',
            statement: [
                'Dla każdego zapytania policz, ile razy cyfra d występuje w zapisie dziesiętnym liczby n. Na przykład w liczbie 1010 cyfra 0 występuje 2 razy.',
                'Napisz funkcję int ile(long long n, int d). ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajdują się dwie liczby całkowite n i d.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu, ile razy cyfra d występuje w liczbie n.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸', '0 ≤ d ≤ 9'],
            examples: [{ input: '4\n1010 0\n7777 7\n123 9\n0 0', note: 'Liczba 0 ma jedną cyfrę — zero — więc odpowiedź w ostatnim zapytaniu to 1.' }],
            hint: 'Uważaj na zero! Najprościej zatrzymać się na liczbie jednocyfrowej: jeśli n < 10, zwróć 1 gdy n == d, a 0 w przeciwnym razie. Dla dłuższej liczby: (n % 10 == d) + ile(n / 10, d) — w C++ wynik porównania to 1 albo 0.',
            tests: (r) => ['6\n0 0\n0 5\n5 5\n10 0\n10 1\n100 0', '4\n1000000000000000000 0\n999999999999999999 9\n111111 1\n123456789 0',
                many(r, 60, () => `${r.big(0, B18)} ${r.int(0, 9)}`), many(r, 100, () => `${r.int(0, 99999)} ${r.int(0, 9)}`)],
            solve: (inp) => { const t = h.toks(inp); const o = []; for (let i = 1; i < t.length; i += 2) o.push(String(t[i].split('').filter((c) => c === t[i + 1]).length)); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int ile(long long n, int d) {
    if (n < 10) return n == d ? 1 : 0;
    return (n % 10 == d) + ile(n / 10, d);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n; int d;
        cin >> n >> d;
        cout << ile(n, d) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 7
        {
            id: 'rek-pierwiastek-cyfrowy',
            title: 'Pierwiastek cyfrowy',
            level: 'srednie',
            statement: [
                'Pierwiastek cyfrowy liczby powstaje tak: liczymy sumę cyfr, potem sumę cyfr tej sumy, i tak dalej — aż zostanie liczba jednocyfrowa. Na przykład 9875 → 9 + 8 + 7 + 5 = 29 → 2 + 9 = 11 → 1 + 1 = 2.',
                'Dla każdej z t liczb wypisz jej pierwiastek cyfrowy. Użyj dwóch funkcji rekurencyjnych: sumaCyfr z poprzedniego zadania i pierwiastek(n), która woła samą siebie dla sumy cyfr liczby n. ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdej liczby wypisz w osobnym wierszu jej pierwiastek cyfrowy.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n9875\n7\n999999999999999999', note: 'Dla 999…9 (18 dziewiątek) suma cyfr to 162, potem 9.' }],
            hint: 'pierwiastek(n): jeśli n < 10, to już jest wynik — return n. W przeciwnym razie return pierwiastek(sumaCyfr(n));. Funkcja nie woła siebie z n − 1, tylko z mniejszą liczbą — sumą cyfr. To też jest krok w stronę warunku stopu.',
            tests: (r) => ['5\n0\n9\n10\n19\n99', '3\n1000000000000000000\n123456789012345678\n987654321987654321',
                many(r, 60, () => String(r.big(0, B18))), many(r, 100, () => String(r.int(0, 1000000)))],
            solve: (inp) => h.toks(inp).slice(1).map((x) => { let n = BigInt(x); while (n >= 10n) { let s = 0n; for (const c of String(n)) s += BigInt(c); n = s; } return String(n); }).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long sumaCyfr(long long n) {
    if (n == 0) return 0;
    return n % 10 + sumaCyfr(n / 10);
}
long long pierwiastek(long long n) {
    if (n < 10) return n;
    return pierwiastek(sumaCyfr(n));
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << pierwiastek(n) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 8
        {
            id: 'rek-odwroc-liczbe',
            title: 'Liczba od tyłu',
            level: 'srednie',
            statement: [
                'Dla każdej z t liczb wypisz liczbę, którą dostaniemy, czytając jej cyfry od końca. Zera, które znajdą się na początku, znikają: 1200 czytane od tyłu to 0021, czyli 21.',
                'Tym razem przyda się rekurencja z dodatkowym parametrem — akumulatorem, w którym budujemy wynik: long long odwroc(long long n, long long wynik). Z main wołamy odwroc(n, 0). ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdej liczby wypisz w osobnym wierszu liczbę czytaną od tyłu.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '3\n4821\n1200\n7', note: 'odwroc(4821, 0) → odwroc(482, 1) → odwroc(48, 12) → odwroc(4, 128) → odwroc(0, 1284) → wynik 1284.' }],
            hint: 'W każdym kroku przenieś ostatnią cyfrę n na koniec wyniku: return odwroc(n / 10, wynik * 10 + n % 10);. Gdy n == 0, wszystkie cyfry są już przeniesione — return wynik;. To rekurencja „z parametrem”: wynik rośnie w drodze w dół, a w drodze powrotnej tylko się go przekazuje.',
            tests: (r) => ['5\n1\n10\n100\n101\n120', '3\n1000000000000000000\n999999999999999999\n123456789012345678',
                many(r, 60, () => String(r.big(1, B18))), many(r, 100, () => String(r.int(1, 10)) + '0'.repeat(r.int(0, 5)))],
            solve: (inp) => h.toks(inp).slice(1).map((x) => String(BigInt(x.split('').reverse().join('')))).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long odwroc(long long n, long long wynik) {
    if (n == 0) return wynik;
    return odwroc(n / 10, wynik * 10 + n % 10);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << odwroc(n, 0) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 9
        {
            id: 'rek-suma-tablicy',
            title: 'Suma tablicy',
            level: 'latwe',
            statement: [
                'Wczytaj n liczb do tablicy i wypisz ich sumę.',
                'Napisz funkcję long long suma(int i), która zwraca sumę elementów a[i], a[i + 1], …, a[n − 1]. Z main wołamy suma(0). ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych a₀, a₁, …, aₙ₋₁.'],
            output_format: ['Wypisz jedną liczbę — sumę wszystkich elementów.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '5\n3 -1 4 1 5', note: 'suma(0) = 3 + suma(1) = 3 + (−1) + suma(2) = … , a suma(5) = 0, bo od indeksu 5 nie ma już żadnych elementów.' }],
            hint: 'Warunek stopu: suma(n) = 0 — za ostatnim elementem nie ma już nic do dodania. Krok: return a[i] + suma(i + 1);. Wynik może sięgnąć 10¹², więc long long.',
            tests: (r) => {
                const T = (n, lo, hi) => `${n}\n${r.arr(n, lo, hi).join(' ')}`;
                return ['1\n-7', '2\n1000000000 1000000000', T(10, 1, 9), T(100, -1000, 1000), T(1000, -1e9, 1e9), T(1000, 1e9, 1e9), T(1000, -1e9, -1e9 + 10)];
            },
            solve: (inp) => String(h.toks(inp).slice(1).reduce((a, x) => a + BigInt(x), 0n)),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
long long a[1005];
long long suma(int i) {
    if (i == n) return 0;
    return a[i] + suma(i + 1);
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << suma(0) << "\n";
}`,
        },
        // ------------------------------------------------------------ 10
        {
            id: 'rek-maks-tablicy',
            title: 'Największy element',
            level: 'latwe',
            statement: [
                'Wczytaj n liczb do tablicy i wypisz największą z nich.',
                'Napisz funkcję int maks(int i), która zwraca największy z elementów a[i], …, a[n − 1]. Największy element całej tablicy to większa z dwóch liczb: a[0] i największy element reszty tablicy. ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych a₀, a₁, …, aₙ₋₁.'],
            output_format: ['Wypisz jedną liczbę — największy element tablicy.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '6\n3 -1 4 1 5 2' }, { input: '3\n-5 -2 -9', note: 'Wszystkie liczby mogą być ujemne — wtedy wynik też jest ujemny. Dlatego nie zaczynaj od „maks = 0”.' }],
            hint: 'Warunek stopu: gdy i == n - 1, został jeden element — return a[i]. W przeciwnym razie return max(a[i], maks(i + 1));.',
            tests: (r) => {
                const T = (n, lo, hi) => `${n}\n${r.arr(n, lo, hi).join(' ')}`;
                return ['1\n-1000000000', '2\n5 5', T(10, -9, 9), T(100, -1e9, -1), T(1000, -1e9, 1e9), T(1000, 0, 3), '5\n1 2 3 4 1000000000'];
            },
            solve: (inp) => String(Math.max(...h.nums(inp).slice(1))),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
int a[1005];
int maks(int i) {
    if (i == n - 1) return a[i];
    return max(a[i], maks(i + 1));
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << maks(0) << "\n";
}`,
        },
        // ------------------------------------------------------------ 11
        {
            id: 'rek-ile-parzystych',
            title: 'Ile liczb parzystych?',
            level: 'latwe',
            statement: [
                'Wczytaj n liczb do tablicy i policz, ile z nich jest parzystych.',
                'Napisz funkcję int ileParzystych(int i), która liczy liczby parzyste wśród a[i], …, a[n − 1]. ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych a₀, a₁, …, aₙ₋₁.'],
            output_format: ['Wypisz jedną liczbę — ile elementów tablicy jest parzystych.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '6\n3 -4 0 7 8 5', note: 'Parzyste są −4, 0 i 8. Zero też jest liczbą parzystą.' }],
            hint: 'ileParzystych(n) = 0. Dla i < n: jeśli a[i] % 2 == 0, wynik to 1 + ileParzystych(i + 1), a w przeciwnym razie po prostu ileParzystych(i + 1). Uwaga: dla liczb ujemnych nieparzystych a[i] % 2 daje −1, więc porównuj z zerem, a nie z jedynką.',
            tests: (r) => {
                const T = (n, lo, hi) => `${n}\n${r.arr(n, lo, hi).join(' ')}`;
                return ['1\n0', '1\n-3', T(10, -9, 9), T(100, -1e9, 1e9), T(1000, -1e9, 1e9), T(1000, 1, 1), `1000\n${Array.from({ length: 1000 }, (_, i) => 2 * i - 1000).join(' ')}`];
            },
            solve: (inp) => String(h.nums(inp).slice(1).filter((x) => x % 2 === 0).length),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
int a[1005];
int ileParzystych(int i) {
    if (i == n) return 0;
    if (a[i] % 2 == 0) return 1 + ileParzystych(i + 1);
    return ileParzystych(i + 1);
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << ileParzystych(0) << "\n";
}`,
        },
        // ------------------------------------------------------------ 12
        {
            id: 'rek-czy-posortowana',
            title: 'Czy tablica jest posortowana?',
            level: 'latwe',
            statement: [
                'Dla każdej z t tablic sprawdź, czy jest posortowana niemalejąco, to znaczy czy a₀ ≤ a₁ ≤ … ≤ aₙ₋₁.',
                'Napisz funkcję bool posortowana(int i), która sprawdza fragment od indeksu i do końca. Funkcja rekurencyjna może zwracać nie tylko liczby, ale też prawdę albo fałsz. ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba tablic.', 'Każda tablica zajmuje dwa wiersze: w pierwszym jest jej długość n, a w drugim n liczb całkowitych.'],
            output_format: ['Dla każdej tablicy wypisz w osobnym wierszu TAK, jeśli jest posortowana niemalejąco, albo NIE w przeciwnym razie.'],
            constraints: ['1 ≤ t ≤ 20', '1 ≤ n ≤ 100', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '3\n5\n1 2 2 5 9\n4\n1 3 2 4\n1\n7', note: 'W drugiej tablicy 3 > 2, więc nie jest posortowana. Tablica z jednym elementem zawsze jest posortowana.' }],
            hint: 'Jeśli i >= n - 1, został co najwyżej jeden element — return true. Jeśli a[i] > a[i + 1], znaleźliśmy „zły” sąsiedni układ — return false. W przeciwnym razie odpowiedź zależy od reszty: return posortowana(i + 1);. Pamiętaj, żeby przed każdą tablicą ustawić globalne n.',
            tests: (r) => {
                const sorted = (n) => r.arr(n, -1e9, 1e9).sort((a, b) => a - b);
                const arrs = () => {
                    const t = 20; const o = [t];
                    for (let k = 0; k < t; k++) {
                        const n = r.int(1, 100);
                        let a = sorted(n);
                        const mode = r.int(0, 3);
                        if (mode === 1 && n > 1) { const i = r.int(0, n - 2); [a[i], a[i + 1]] = [a[i + 1], a[i]]; if (a[i] === a[i + 1]) a[i] += 1; }
                        if (mode === 2) a = r.arr(n, -5, 5);
                        o.push(n, a.join(' '));
                    }
                    return o.join('\n');
                };
                return ['2\n2\n1 1\n2\n2 1', '3\n3\n-3 -2 -1\n3\n-1 -2 -3\n5\n0 0 0 0 0', arrs(), arrs(), arrs(),
                    `1\n100\n${Array.from({ length: 100 }, (_, i) => i).join(' ')}`, `1\n100\n${Array.from({ length: 99 }, (_, i) => i).join(' ')} 0`];
            },
            solve: (inp) => {
                const rd = reader(inp); const t = rd.int(); const o = [];
                for (let k = 0; k < t; k++) { const n = rd.int(); const a = rd.ints(n); let ok = true; for (let i = 0; i + 1 < n; i++) if (a[i] > a[i + 1]) ok = false; o.push(ok ? 'TAK' : 'NIE'); }
                return o.join('\n');
            },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
int a[105];
bool posortowana(int i) {
    if (i >= n - 1) return true;
    if (a[i] > a[i + 1]) return false;
    return posortowana(i + 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        cin >> n;
        for (int i = 0; i < n; i++) cin >> a[i];
        cout << (posortowana(0) ? "TAK" : "NIE") << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 13
        {
            id: 'rek-palindrom',
            title: 'Palindrom',
            level: 'latwe',
            statement: [
                'Palindrom to słowo, które czytane od przodu i od tyłu brzmi tak samo, np. kajak albo radar. Dla każdego z t słów sprawdź, czy jest palindromem.',
                'Napisz funkcję bool palindrom(const string &s, int l, int r), która sprawdza fragment słowa od pozycji l do pozycji r. Z main wołamy palindrom(s, 0, s.size() - 1). ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba słów.', 'W każdym z kolejnych t wierszy znajduje się jedno słowo złożone z małych liter alfabetu angielskiego.'],
            output_format: ['Dla każdego słowa wypisz w osobnym wierszu TAK, jeśli jest palindromem, albo NIE w przeciwnym razie.'],
            constraints: ['1 ≤ t ≤ 50', 'każde słowo ma od 1 do 1000 liter'],
            examples: [{ input: '4\nkajak\nabba\nkotek\nx', note: 'kajak: k = k, a = a, został środek j — TAK. kotek: k = k, ale o ≠ e — NIE.' }],
            hint: 'Porównuj skrajne litery i idź do środka. Jeśli l >= r, został co najwyżej jeden znak — return true. Jeśli s[l] != s[r] — return false. W przeciwnym razie return palindrom(s, l + 1, r - 1);.',
            tests: (r) => {
                const pal = (n, alph) => { const half = r.word(Math.floor(n / 2), alph); const mid = n % 2 ? r.word(1, alph) : ''; return half + mid + half.split('').reverse().join(''); };
                const almost = (n, alph) => { const p = pal(n, alph).split(''); if (n > 1) { const i = r.int(0, Math.floor(n / 2) - 1); p[i] = p[i] === 'a' ? 'b' : 'a'; } return p.join(''); };
                const mix = (t, maxn, alph) => `${t}\n` + Array.from({ length: t }, () => { const n = r.int(1, maxn); return r.int(0, 1) ? pal(n, alph) : (r.int(0, 1) ? almost(n, alph) : r.word(n, alph)); }).join('\n');
                return ['3\naa\nab\naba', '4\nradar\nrotor\nolimpiada\nzakaz', mix(20, 10, 'ab'), mix(50, 100, 'abc'), mix(10, 1000, 'ab'), `2\n${pal(1000, 'abc')}\n${almost(1000, 'a')}`];
            },
            solve: (inp) => h.toks(inp).slice(1).map((w) => (w === w.split('').reverse().join('') ? 'TAK' : 'NIE')).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
bool palindrom(const string &s, int l, int r) {
    if (l >= r) return true;
    if (s[l] != s[r]) return false;
    return palindrom(s, l + 1, r - 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        cout << (palindrom(s, 0, (int)s.size() - 1) ? "TAK" : "NIE") << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 14
        {
            id: 'rek-odwroc-fragment',
            title: 'Odwróć fragment tablicy',
            level: 'srednie',
            statement: [
                'Dana jest tablica n liczb i dwie pozycje l oraz r (numerowane od 1). Odwróć kolejność elementów na pozycjach od l do r — reszta tablicy zostaje bez zmian — i wypisz całą tablicę.',
                'Napisz funkcję void odwroc(int l, int r), która zamienia miejscami skrajne elementy fragmentu (swap), a środek zleca samej sobie. To funkcja void, ale zmienia tablicę — po powrocie z niej tablica jest już odwrócona. ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się trzy liczby całkowite n, l i r.', 'W drugim wierszu znajduje się n liczb całkowitych a₁, a₂, …, aₙ.'],
            output_format: ['Wypisz w jednym wierszu całą tablicę po odwróceniu fragmentu, liczby oddzielone spacjami.'],
            constraints: ['1 ≤ l ≤ r ≤ n ≤ 1000', '−10⁹ ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '7 2 5\n1 2 3 4 5 6 7', note: 'swap(a[2], a[5]) daje 1 5 3 4 2 6 7, potem swap(a[3], a[4]) daje 1 5 4 3 2 6 7. Następne wywołanie ma l > r i kończy pracę.' }],
            hint: 'Warunek stopu: if (l >= r) return; — fragment jest pusty albo ma jeden element. W przeciwnym razie swap(a[l], a[r]); odwroc(l + 1, r - 1);. Najprościej trzymać liczby w tablicy od indeksu 1, wtedy l i r z wejścia pasują wprost.',
            tests: (r) => {
                const T = (n) => { const l = r.int(1, n), rr = r.int(l, n); return `${n} ${l} ${rr}\n${r.arr(n, -1e9, 1e9).join(' ')}`; };
                return ['1 1 1\n5', '2 1 2\n1 2', '5 3 3\n1 2 3 4 5', '6 1 6\n1 2 3 4 5 6', T(10), T(100), T(1000), `1000 1 1000\n${r.arr(1000, -100, 100).join(' ')}`];
            },
            solve: (inp) => { const rd = reader(inp); const n = rd.int(), l = rd.int(), rr = rd.int(); const a = rd.rest(); const mid = a.slice(l - 1, rr).reverse(); return [...a.slice(0, l - 1), ...mid, ...a.slice(rr)].join(' '); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int a[1005];
void odwroc(int l, int r) {
    if (l >= r) return;
    swap(a[l], a[r]);
    odwroc(l + 1, r - 1);
}
int main() {
    int n, l, r;
    cin >> n >> l >> r;
    for (int i = 1; i <= n; i++) cin >> a[i];
    odwroc(l, r);
    for (int i = 1; i <= n; i++) cout << a[i] << " ";
    cout << "\n";
}`,
        },
        // ------------------------------------------------------------ 15
        {
            id: 'rek-nwd',
            title: 'Największy wspólny dzielnik',
            level: 'srednie',
            statement: [
                'Największy wspólny dzielnik liczb a i b, w skrócie NWD(a, b), to największa liczba, która dzieli i a, i b. Na przykład NWD(12, 18) = 6.',
                'Algorytm Euklidesa liczy go błyskawicznie dzięki obserwacji: NWD(a, b) = NWD(b, a % b), a NWD(a, 0) = a. Dla każdej pary liczb wypisz ich NWD, używając rekurencyjnej funkcji long long nwd(long long a, long long b).',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajdują się dwie liczby całkowite a i b.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu NWD(a, b).'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '3\n12 18\n7 5\n100 25', note: 'NWD(12, 18) = NWD(18, 12) = NWD(12, 6) = NWD(6, 0) = 6.' }],
            hint: 'Dwie linijki: if (b == 0) return a; return nwd(b, a % b);. Nie musisz sprawdzać, która liczba jest większa — jeśli a < b, pierwsze wywołanie samo zamieni je miejscami, bo a % b == a.',
            tests: (r) => {
                const q = () => { const g = r.big(1, r.pick(['10', '1000', '1000000000'])); const lim = 10n ** 18n / g; return `${r.big(1, lim) * g} ${r.big(1, lim) * g}`; };
                return ['5\n1 1\n1 1000000000000000000\n1000000000000000000 1000000000000000000\n17 17\n6 4',
                    '4\n1134903170 701408733\n679891637638612258 420196140727489673\n1000000000000000000 999999999999999999\n987654321 123456789',
                    many(r, 100, q), many(r, 1000, () => `${r.big(1, B18)} ${r.big(1, B18)}`), many(r, 300, () => `${r.int(1, 1000)} ${r.int(1, 1000)}`)];
            },
            solve: (inp) => { const t = h.toks(inp); const g = (a, b) => { while (b) [a, b] = [b, a % b]; return a; }; const o = []; for (let i = 1; i < t.length; i += 2) o.push(String(g(BigInt(t[i]), BigInt(t[i + 1])))); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long nwd(long long a, long long b) {
    if (b == 0) return a;
    return nwd(b, a % b);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a, b;
        cin >> a >> b;
        cout << nwd(a, b) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 16
        {
            id: 'rek-mnozenie',
            title: 'Mnożenie bez mnożenia',
            level: 'latwe',
            statement: [
                'Komputer Bajtka zepsuł się i nie umie mnożyć — umie tylko dodawać i odejmować. Dla każdego zapytania policz a · b, używając wyłącznie dodawania.',
                'Napisz funkcję long long razy(long long a, int b), która korzysta z tego, że a · b = a + a · (b − 1). ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajdują się dwie liczby całkowite a i b.'],
            output_format: ['Dla każdego zapytania wypisz w osobnym wierszu iloczyn a · b.'],
            constraints: ['1 ≤ t ≤ 20', '0 ≤ a ≤ 10⁹', '0 ≤ b ≤ 10 000'],
            examples: [{ input: '3\n7 3\n5 0\n1000000000 10000', note: '7 · 3 = 7 + 7 · 2 = 7 + 7 + 7 · 1 = 7 + 7 + 7 + 7 · 0 = 21. Cokolwiek razy 0 daje 0 — to warunek stopu.' }],
            hint: 'razy(a, 0) = 0. Dla b > 0: return a + razy(a, b - 1);. Rekurencja schodzi tu b poziomów w głąb, więc b nie może być ogromne — 10 000 poziomów to jeszcze bezpiecznie.',
            tests: (r) => ['4\n0 0\n0 10000\n1 1\n2 2', '3\n1000000000 9999\n999999999 10000\n123456789 5000',
                many(r, 20, () => `${r.int(0, 1e9)} ${r.int(0, 10000)}`), many(r, 20, () => `${r.int(0, 100)} ${r.int(0, 100)}`)],
            solve: (inp) => { const t = h.toks(inp); const o = []; for (let i = 1; i < t.length; i += 2) o.push(String(BigInt(t[i]) * BigInt(t[i + 1]))); return o.join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
long long razy(long long a, int b) {
    if (b == 0) return 0;
    return a + razy(a, b - 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long a; int b;
        cin >> a >> b;
        cout << razy(a, b) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 17
        {
            id: 'rek-collatz',
            title: 'Problem Collatza',
            level: 'srednie',
            statement: [
                'Weź dowolną liczbę dodatnią n. Jeśli jest parzysta, podziel ją przez 2, a jeśli nieparzysta — zamień na 3n + 1. Powtarzaj to tak długo, aż dojdziesz do 1. Na przykład 6 → 3 → 10 → 5 → 16 → 8 → 4 → 2 → 1 to 8 kroków. Matematycy do dziś nie umieją udowodnić, że z każdej liczby dojdziemy w końcu do jedynki — ale dla liczb z tego zadania na pewno tak jest.',
                'Dla każdej z t liczb wypisz, ile kroków potrzeba, żeby dojść do 1. Napisz funkcję int kroki(long long n). ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdej liczby wypisz w osobnym wierszu liczbę kroków potrzebnych do dojścia do 1.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 10⁶'],
            examples: [{ input: '3\n6\n1\n27', note: 'Dla 1 nie trzeba robić żadnego kroku. Liczba 27 potrzebuje aż 111 kroków, a po drodze dochodzi do 9232.' }],
            hint: 'kroki(1) = 0. Dla n > 1: jeśli n jest parzyste, return 1 + kroki(n / 2);, w przeciwnym razie return 1 + kroki(3 * n + 1);. Liczby po drodze potrafią przekroczyć zakres int (dla n ≤ 10⁶ dochodzą do ok. 5,7 · 10¹⁰), więc n musi być long long.',
            tests: (r) => ['5\n1\n2\n3\n4\n5', '4\n837799\n704511\n999999\n1000000', many(r, 100, () => String(r.int(1, 1000000))), many(r, 100, () => String(r.int(1, 1000)))],
            solve: (inp) => h.nums(inp).slice(1).map((n) => { let k = 0; while (n !== 1) { n = n % 2 === 0 ? n / 2 : 3 * n + 1; k++; } return String(k); }).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int kroki(long long n) {
    if (n == 1) return 0;
    if (n % 2 == 0) return 1 + kroki(n / 2);
    return 1 + kroki(3 * n + 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << kroki(n) << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 18
        {
            id: 'rek-potega-dwojki',
            title: 'Czy to potęga dwójki?',
            level: 'latwe',
            statement: [
                'Potęgi dwójki to liczby 1, 2, 4, 8, 16, 32, … — każda kolejna jest dwa razy większa od poprzedniej. Dla każdej z t liczb sprawdź, czy jest potęgą dwójki.',
                'Napisz funkcję bool potegaDwojki(long long n). Zauważ: jeśli n > 1 jest potęgą dwójki, to musi być parzyste, a n / 2 też jest potęgą dwójki. ' + ZAUFAJ,
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba t — liczba zapytań.', 'W każdym z kolejnych t wierszy znajduje się jedna liczba całkowita n.'],
            output_format: ['Dla każdej liczby wypisz w osobnym wierszu TAK, jeśli jest potęgą dwójki, albo NIE w przeciwnym razie.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n64\n1\n12\n1024', note: '64 → 32 → 16 → 8 → 4 → 2 → 1, więc TAK. 12 → 6 → 3, a 3 jest nieparzyste i różne od 1 — NIE. 1 = 2⁰ też jest potęgą dwójki.' }],
            hint: 'Trzy przypadki: jeśli n == 1 — return true; jeśli n jest nieparzyste — return false; w przeciwnym razie return potegaDwojki(n / 2);.',
            tests: (r) => ['6\n1\n2\n3\n4\n5\n6', '4\n576460752303423488\n576460752303423487\n1000000000000000000\n288230376151711744',
                many(r, 100, () => (r.int(0, 1) ? String(2n ** BigInt(r.int(0, 59))) : String(r.big(1, B18)))),
                many(r, 100, () => String(r.int(0, 1) ? 2 ** r.int(0, 20) + r.pick([0, 0, 1, -1, 2]) : r.int(1, 1000))).replace(/\n0\b/g, '\n1')],
            solve: (inp) => h.toks(inp).slice(1).map((x) => { const n = BigInt(x); return (n & (n - 1n)) === 0n ? 'TAK' : 'NIE'; }).join('\n'),
            check: (inp) => (h.toks(inp).slice(1).some((x) => BigInt(x) < 1n) ? 'n < 1' : null),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
bool potegaDwojki(long long n) {
    if (n == 1) return true;
    if (n % 2 == 1) return false;
    return potegaDwojki(n / 2);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long n;
        cin >> n;
        cout << (potegaDwojki(n) ? "TAK" : "NIE") << "\n";
    }
}`,
        },
    ];
};
