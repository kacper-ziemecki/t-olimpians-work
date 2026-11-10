// Zaokrąglanie — ćwiczenia w trakcie lekcji, części 1–3: oś liczbowa i zaokrąglanie „ręcznie” ((int), if,
// część całkowita i ułamkowa), floor i ceil (liczby ujemne, wynik jako long long, dzielenie przed ceil,
// liczby całkowite w przedziale) oraz round i llround (połówki dalej od zera, średnie, procenty).
// Uczeń zna pierwszy etap, tablice, napisy, pary, vector, sortowanie oraz max i min.
// Oczekiwane wyniki liczymy dokładnie (zaokraglanie-pomoc.js), a testy omijają dane, na których
// poprawne rozwiązanie na double mogłoby dać inny wynik.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks, fx, safe } = h;
    const { jedn, napis, stale, fdiv, cdiv, rdivUp, rdivAway, losowa } = require('./zaokraglanie-pomoc');
    const R = String.raw;
    const B = BigInt;
    const linie = (inp) => inp.replace(/\r/g, '').split('\n');
    const lista = (inp) => { const t = toks(inp); return { n: Number(t[0]), v: t.slice(1, 1 + Number(t[0])) }; };
    const zakres = (lo, hi) => (v) => v >= B(lo) && v <= B(hi);
    const pad2 = (x) => String(x).padStart(2, '0');
    // n liczb z d cyframi po kropce, k z przedziału [lo, hi] jednostek
    const losowe = (r, n, lo, hi, d) => Array.from({ length: n }, () => losowa(r, lo, hi, d).s);
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;

    return [
        // ================================================================ KROK 1 · oś liczbowa i sąsiedzi
        {
            id: 'zao-czesci', krok: 1, level: 'latwe',
            title: 'Część całkowita i ułamkowa',
            short: 'Rozbij liczbę na część całkowitą i część ułamkową.',
            tags: ['(int)x', 'x - (int)x', 'fixed i setprecision'],
            statement: ['Wczytaj liczbę x ≥ 0 zapisaną z co najwyżej dwiema cyframi po kropce. W pierwszym wierszu wypisz jej część całkowitą, a w drugim — część ułamkową z dokładnie dwiema cyframi po kropce.'],
            input_format: ['Jedna liczba x.'],
            output_format: ['Dwa wiersze: część całkowita (liczba całkowita, bez kropki) i część ułamkowa z dwiema cyframi po kropce.'],
            constraints: ['0 ≤ x ≤ 1 000 000', 'x ma co najwyżej dwie cyfry po kropce'],
            examples: [{ input: '2.75' }, { input: '7', note: 'Liczba całkowita ma część ułamkową 0.00.' }],
            hint: R`int calk = (int)x; to część całkowita, a x - calk — część ułamkowa. Część ułamkową wypisz po cout << fixed << setprecision(2);. Część całkowitą trzymaj w zmiennej int — wtedy wypisze się bez kropki, nawet po ustawieniu fixed.`,
            tests: (r) => ['0', '0.01', '0.99', '1000000', '999999.99', '12.5', '3.1', '0.5', ...losowe(r, 6, 0, 100000000, 2)],
            check: (inp) => (zakres(0, 100000000)(jedn(inp, 2)) ? null : 'zakres'),
            solve: (inp) => { const k = jedn(inp, 2); return `${k / 100n}\n${stale(k % 100n, 2)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    double x;
    cin >> x;
    int calk = (int)x;
    double ulamek = x - calk;
    cout << calk << "\n";
    cout << fixed << setprecision(2) << ulamek << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-sasiedzi', krok: 1, level: 'latwe',
            title: 'Między którymi liczbami?',
            short: 'Wypisz zaokrąglenie liczby w dół i w górę — bez żadnych nowych funkcji.',
            tags: ['(int)x', 'if', 'w dół i w górę'],
            statement: ['Wczytaj liczbę x ≥ 0. Wypisz dwie liczby całkowite: zaokrąglenie x w dół (sąsiada z lewej) i zaokrąglenie x w górę (sąsiada z prawej). Jeśli x jest liczbą całkowitą, leży na kresce — wtedy obie liczby są równe x.'],
            input_format: ['Jedna liczba x (może mieć cyfry po kropce).'],
            output_format: ['Jeden wiersz: dwie liczby całkowite oddzielone spacją.'],
            constraints: ['0 ≤ x ≤ 1 000 000', 'x ma co najwyżej trzy cyfry po kropce'],
            examples: [{ input: '2.3' }, { input: '5', note: '5 leży na kresce — oba zaokrąglenia to 5.' }, { input: '0.001' }],
            hint: R`W dół to (int)x. W górę: zacznij od tej samej liczby i dodaj 1 tylko wtedy, gdy x jest większe od swojej części całkowitej — czyli gdy coś zostało po kropce. Uważaj na liczby takie jak 7.000: to też liczba całkowita.`,
            tests: (r) => ['0', '1000000', '999999.999', '0.5', '7.000', '12.0', '0.999', ...losowe(r, 5, 0, 1000000000, 3), ...Array.from({ length: 2 }, () => String(r.int(1, 1000000)))],
            check: (inp) => (zakres(0, 1000000000)(jedn(inp, 3)) ? null : 'zakres'),
            solve: (inp) => { const k = jedn(inp, 3); const d = k / 1000n; return `${d} ${k % 1000n ? d + 1n : d}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    double x;
    cin >> x;
    int dol = (int)x;
    int gora = dol;
    if (x > dol) gora = dol + 1;
    cout << dol << " " << gora << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-czy-calkowita', krok: 1, level: 'latwe',
            title: 'Czy to liczba całkowita?',
            short: 'Dla każdej liczby sprawdź, czy jest całkowita — także gdy zapisano ją jako 4.000.',
            tags: ['x == (int)x', 'pętla', 'liczby ujemne'],
            statement: ['Wczytaj n liczb (mogą być ujemne i mogą mieć cyfry po kropce). Dla każdej wypisz w osobnym wierszu TAK, jeśli jest liczbą całkowitą, albo NIE w przeciwnym razie. Uwaga: liczba zapisana jako 4.000 też jest całkowita.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['n wierszy, w każdym TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 1000', '−1 000 000 ≤ każda liczba ≤ 1 000 000', 'każda liczba ma co najwyżej trzy cyfry po kropce'],
            examples: [{ input: '5\n4 4.5 -3.000 0.001 -7.25' }],
            hint: R`Liczba jest całkowita, gdy ucięcie części ułamkowej niczego nie zmienia: x == (int)x. To działa także dla liczb ujemnych — ucięcie liczby całkowitej zostawia ją bez zmian.`,
            tests: (r) => {
                const jedna = () => {
                    if (r() < 0.45) {
                        const k = r.int(-1000000, 1000000);
                        return r.pick([String(k), `${k}.0`, `${k}.000`, `${k}.00`]);
                    }
                    let k = B(r.int(-1000000000, 1000000000));
                    if (k % 1000n === 0n) k += 1n;
                    return napis(k, 3);
                };
                return ['1\n0', '1\n-0.000', '1\n-0.5', '3\n1000000 -1000000 999999.999', '4\n2.000 2.001 -2.999 -3',
                    fmt(Array.from({ length: 20 }, jedna)), fmt(Array.from({ length: 1000 }, jedna))];
            },
            check: (inp) => (lista(inp).v.every((s) => zakres(-1000000000, 1000000000)(jedn(s, 3))) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => (jedn(s, 3) % 1000n === 0n ? 'TAK' : 'NIE')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        if (x == (int)x) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-szkolne', krok: 1, level: 'latwe',
            title: 'Zaokrąglanie jak w szkole',
            short: 'Zaokrąglij liczby do najbliższej całkowitej — połówki w górę.',
            tags: ['część ułamkowa', 'if', '(int)(x + 0.5)'],
            statement: ['Wczytaj n liczb nieujemnych z co najwyżej dwiema cyframi po kropce. Każdą zaokrąglij do najbliższej liczby całkowitej; jeśli liczba leży dokładnie w połowie między dwiema liczbami całkowitymi, zaokrąglij ją w górę. Wypisz wyniki w jednym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: n liczb całkowitych.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 1 000 000', 'każda liczba ma co najwyżej dwie cyfry po kropce'],
            examples: [{ input: '6\n2.3 2.5 2.7 0.49 9.5 7', note: '2.5 i 9.5 leżą dokładnie w połowie, więc idą w górę.' }],
            hint: R`Porównaj część ułamkową x - (int)x z 0.5: jeśli jest mniejsza — w dół, w przeciwnym razie — w górę. Krócej: (int)(x + 0.5). Obie wersje działają, bo liczby są nieujemne.`,
            tests: (r) => {
                const pol = () => `${r.int(0, 999999)}.5`;
                return ['1\n0', '1\n0.5', '1\n0.49', '2\n1000000 999999.5', fmt([...losowe(r, 15, 0, 100000000, 2), pol(), pol()]),
                    fmt(Array.from({ length: 1000 }, () => (r() < 0.2 ? pol() : losowa(r, 0, 100000000, 2).s)))];
            },
            check: (inp) => (lista(inp).v.every((s) => zakres(0, 100000000)(jedn(s, 2))) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => { const k = jedn(s, 2); return k % 100n >= 50n ? k / 100n + 1n : k / 100n; }).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        cout << (int)(x + 0.5) << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-do-pelnego', krok: 1, level: 'latwe',
            title: 'Do pełnego litra',
            short: 'Ile paliwa brakuje do najbliższej pełnej liczby litrów?',
            tags: ['w górę', 'odejmowanie', 'fixed i setprecision'],
            statement: ['Na dystrybutorze widać, ile litrów paliwa już nalałeś — liczbę x z co najwyżej dwiema cyframi po kropce. Chcesz zatankować do pełnych litrów, czyli do najbliższej liczby całkowitej, która jest nie mniejsza niż x. Wypisz, ile litrów jeszcze brakuje, z dokładnie dwiema cyframi po kropce. Jeśli x jest już liczbą całkowitą, nic nie brakuje.'],
            input_format: ['Jedna liczba x.'],
            output_format: ['Jedna liczba z dwiema cyframi po kropce.'],
            constraints: ['0 ≤ x ≤ 10 000', 'x ma co najwyżej dwie cyfry po kropce'],
            examples: [{ input: '37.45', note: 'Do 38 litrów brakuje 0.55.' }, { input: '40', note: 'Pełne litry — nic nie brakuje.' }],
            hint: R`Najpierw znajdź zaokrąglenie w górę — tak jak w zadaniu „Między którymi liczbami?”. Potem odejmij: gora - x. Wynik wypisz z fixed i setprecision(2).`,
            tests: (r) => ['0', '0.01', '9999.99', '10000', '12.5', '0.99', '5.10', ...losowe(r, 6, 0, 1000000, 2)],
            check: (inp) => (zakres(0, 1000000)(jedn(inp, 2)) ? null : 'zakres'),
            solve: (inp) => { const k = jedn(inp, 2); const rr = k % 100n; return stale(rr ? 100n - rr : 0n, 2); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    double x;
    cin >> x;
    int gora = (int)x;
    if (x > gora) gora++;
    cout << fixed << setprecision(2) << gora - x << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-trzy-zaokraglenia', krok: 1, level: 'latwe',
            title: 'Trzy zaokrąglenia',
            short: 'Dla każdej liczby: w dół, w górę i do najbliższej.',
            tags: ['w dół', 'w górę', 'do najbliższej', 'pętla'],
            statement: ['Wczytaj n liczb nieujemnych. Dla każdej wypisz w osobnym wierszu trzy liczby całkowite: jej zaokrąglenie w dół, zaokrąglenie w górę i zaokrąglenie do najbliższej liczby całkowitej (połówki w górę).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['n wierszy, w każdym trzy liczby całkowite.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 1 000 000', 'każda liczba ma co najwyżej trzy cyfry po kropce'],
            examples: [{ input: '4\n2.3 2.5 5 0.999' }],
            hint: R`Połącz trzy schematy z lekcji: dol = (int)x; gora = dol, a jeśli x > dol, to gora = dol + 1; najbliższa to (int)(x + 0.5). Wszystko w jednej pętli.`,
            tests: (r) => ['1\n0', '1\n1000000', '3\n0.5 0.499 0.501', fmt(losowe(r, 30, 0, 1000000000, 3)),
                fmt(Array.from({ length: 1000 }, () => (r() < 0.15 ? String(r.int(0, 1000000)) : r() < 0.2 ? `${r.int(0, 999999)}.5` : losowa(r, 0, 1000000000, 3).s)))],
            check: (inp) => (lista(inp).v.every((s) => zakres(0, 1000000000)(jedn(s, 3))) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => {
                const k = jedn(s, 3), d = k / 1000n, rr = k % 1000n;
                return `${d} ${rr ? d + 1n : d} ${rr >= 500n ? d + 1n : d}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        int dol = (int)x;
        int gora = dol;
        if (x > dol) gora = dol + 1;
        int najblizsza = (int)(x + 0.5);
        cout << dol << " " << gora << " " << najblizsza << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-najblizej-calosci', krok: 1, level: 'srednie',
            title: 'Najbliżej całości',
            short: 'Która liczba z listy leży najbliżej jakiejś liczby całkowitej?',
            tags: ['część ułamkowa', 'min(u, 1 - u)', 'rekord z pozycją'],
            statement: ['Masz n liczb dodatnich z dwiema cyframi po kropce. Odległość liczby od najbliższej liczby całkowitej to mniejsza z dwóch wartości: jej część ułamkowa u oraz 1 − u. Znajdź liczbę, która leży najbliżej jakiejś liczby całkowitej. Wypisz jej numer (liczby numerujemy od 1) oraz tę odległość z dwiema cyframi po kropce. Gwarantujemy, że taka liczba jest dokładnie jedna.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb, każda z dokładnie dwiema cyframi po kropce.'],
            output_format: ['Jeden wiersz: numer liczby i odległość z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ n ≤ 1000', '0 < każda liczba < 10 000'],
            examples: [{ input: '4\n3.40 7.88 2.15 9.61', note: 'Odległości to 0.40, 0.12, 0.15 i 0.39 — najbliżej całości leży druga liczba.' }],
            hint: R`Dla każdej liczby policz u = x - (int)x i odległość d = min(u, 1 - u). Szukaj najmniejszego d i zapamiętuj numer — to rekord z pozycją z lekcji o max i min.`,
            tests: (r) => {
                const zestaw = (n) => {
                    for (;;) {
                        const ks = Array.from({ length: n }, () => B(r.int(1, 999999)));
                        const ds = ks.map((k) => { const rr = Number(k % 100n); return Math.min(rr, 100 - rr); });
                        const mn = Math.min(...ds);
                        if (ds.filter((d) => d === mn).length === 1) return fmt(ks.map((k) => stale(k, 2)));
                    }
                };
                return ['1\n0.01', '1\n9999.99', '2\n4.50 3.49', '3\n1.00 2.30 5.70', zestaw(5), zestaw(40), zestaw(80)];
            },
            check: (inp) => {
                const v = lista(inp).v;
                if (!v.every((s) => /\.\d\d$/.test(s) && zakres(1, 999999)(jedn(s, 2)))) return 'zakres';
                const ds = v.map((s) => { const rr = Number(jedn(s, 2) % 100n); return Math.min(rr, 100 - rr); });
                return ds.filter((d) => d === Math.min(...ds)).length === 1 ? null : 'remis';
            },
            solve: (inp) => {
                const ds = lista(inp).v.map((s) => { const rr = Number(jedn(s, 2) % 100n); return Math.min(rr, 100 - rr); });
                const mn = Math.min(...ds);
                return `${ds.indexOf(mn) + 1} ${stale(B(mn), 2)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int najlepszy = 0;
    double najmniej = 2;
    for (int i = 1; i <= n; i++) {
        double x;
        cin >> x;
        double u = x - (int)x;
        double d = min(u, 1 - u);
        if (d < najmniej) {
            najmniej = d;
            najlepszy = i;
        }
    }
    cout << najlepszy << " " << fixed << setprecision(2) << najmniej << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-sasiedzi-minus', krok: 1, level: 'srednie',
            title: 'Sąsiedzi na minusie',
            short: 'W dół i w górę bez floor i ceil — także dla liczb ujemnych.',
            tags: ['(int)x', 'if', 'liczby ujemne'],
            statement: ['Wczytaj liczbę x, która może być ujemna. Wypisz jej zaokrąglenie w dół (największą liczbę całkowitą nie większą niż x) i zaokrąglenie w górę (najmniejszą liczbę całkowitą nie mniejszą niż x). Spróbuj rozwiązać to zadanie tylko za pomocą (int) i instrukcji if — gotowe funkcje poznasz w następnej części.'],
            input_format: ['Jedna liczba x.'],
            output_format: ['Jeden wiersz: dwie liczby całkowite — w dół i w górę.'],
            constraints: ['−1 000 000 ≤ x ≤ 1 000 000', 'x ma co najwyżej trzy cyfry po kropce'],
            examples: [{ input: '-1.4', note: '−1.4 leży między −2 a −1.' }, { input: '2.3' }, { input: '-5' }],
            hint: R`Zacznij od t = (int)x — to ucięcie w stronę zera. Jeśli t > x (to się zdarza dla liczb ujemnych z częścią ułamkową), ucięcie poszło w górę, więc w dół jest t - 1. Podobnie, jeśli t < x, w górę jest t + 1. Gdy x jest całkowite, t == x i nic nie poprawiamy.`,
            tests: (r) => ['0', '-0.5', '-0.001', '0.001', '-1000000', '1000000', '-999999.999', '-7.000', ...losowe(r, 5, -1000000000, 1000000000, 3), String(r.int(-1000000, -1))],
            check: (inp) => (zakres(-1000000000, 1000000000)(jedn(inp, 3)) ? null : 'zakres'),
            solve: (inp) => { const k = jedn(inp, 3); return `${fdiv(k, 1000n)} ${cdiv(k, 1000n)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    double x;
    cin >> x;
    int t = (int)x;
    int dol = t, gora = t;
    if (t > x) dol = t - 1;
    if (t < x) gora = t + 1;
    cout << dol << " " << gora << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 2 · floor i ceil
        {
            id: 'zao-podloga-sufit', krok: 2, level: 'latwe',
            title: 'Podłoga i sufit',
            short: 'floor i ceil dowolnej liczby — wypisane jako porządne liczby całkowite.',
            tags: ['floor', 'ceil', 'long long', 'minus zero'],
            statement: ['Wczytaj liczbę x — może być ujemna i może być bardzo duża. W pierwszym wierszu wypisz jej zaokrąglenie w dół (floor), a w drugim — w górę (ceil). Oba wyniki wypisz jako zwykłe liczby całkowite: bez kropki, bez zapisu w rodzaju 1.23457e+06 i bez „-0”.'],
            input_format: ['Jedna liczba x.'],
            output_format: ['Dwa wiersze: floor(x) i ceil(x).'],
            constraints: ['−10¹² ≤ x ≤ 10¹²', 'x ma co najwyżej trzy cyfry po kropce'],
            examples: [{ input: '-2.7' }, { input: '1234567.8', note: 'Wypisane bezpośrednio jako double, wyniki pokazałyby się w zapisie naukowym.' }, { input: '-0.5', note: 'ceil(−0.5) to 0 — wypisz 0, a nie -0.' }],
            hint: R`floor(x) i ceil(x) oddają double: duże wyniki wypisałyby się jako 1.23457e+06, a ceil(-0.5) jako -0. Zamień wynik na long long, zanim go wypiszesz: cout << (long long)floor(x) << "\n";.`,
            tests: (r) => ['2.7', '5', '-5', '0', '-0.001', '0.001', '-1234567.8', '999999999999.999', '-999999999999.999', '1000000000000', '-1000000000000',
                ...losowe(r, 4, '-1000000000000000', '1000000000000000', 3), ...losowe(r, 3, -100000, 100000, 3)],
            check: (inp) => (zakres('-1000000000000000', '1000000000000000')(jedn(inp, 3)) ? null : 'zakres'),
            solve: (inp) => { const k = jedn(inp, 3); return `${fdiv(k, 1000n)}\n${cdiv(k, 1000n)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    double x;
    cin >> x;
    cout << (long long)floor(x) << "\n";
    cout << (long long)ceil(x) << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-puszki-farby', krok: 2, level: 'latwe',
            title: 'Puszki farby',
            short: 'Każdą ścianę malujesz z osobnych puszek. Ile puszek kupić?',
            tags: ['ceil', '(double) przed dzieleniem', 'suma w pętli'],
            statement: ['Malujesz n ścian, każdą na inny kolor — więc farby z puszki kupionej do jednej ściany nie użyjesz na innej. Jedna puszka wystarcza na p m². Dla każdej ściany znasz jej powierzchnię w m². W pierwszym wierszu wypisz, ile puszek trzeba kupić do każdej ściany, a w drugim — ile puszek razem.'],
            input_format: ['W pierwszym wierszu liczby n i p.', 'W drugim wierszu n liczb — powierzchnie ścian, każda z co najwyżej dwiema cyframi po kropce.'],
            output_format: ['Dwa wiersze: n liczb całkowitych, a potem jedna liczba — suma.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ p ≤ 100 (p jest liczbą całkowitą)', '0 < powierzchnia ściany ≤ 10 000'],
            examples: [{ input: '3 4\n12.5 12 0.75', note: '12.5 / 4 = 3.125, więc 4 puszki. 12 / 4 = 3 równo. Na 0.75 m² też trzeba kupić całą puszkę.' }],
            hint: R`Dla każdej ściany: (long long)ceil(s / p) — s jest typu double, więc dzielenie zachowa ułamek. Puszki z różnych ścian się nie łączą, więc sumujesz już zaokrąglone wyniki.`,
            tests: (r) => {
                const t = (n, p) => `${n} ${p}\n${Array.from({ length: n }, () => (r() < 0.2 ? String(p * r.int(1, Math.floor(10000 / p))) : losowa(r, 1, 1000000, 2).s)).join(' ')}`;
                return ['1 1\n0.01', '1 100\n10000', '2 7\n7 7.01', '3 3\n9 9.00 8.99', t(10, 4), t(200, 7), t(1000, 100), t(1000, 1)];
            },
            check: (inp) => { const t = toks(inp); return t.slice(2).every((s) => zakres(1, 1000000)(jedn(s, 2))) && +t[1] >= 1 && +t[1] <= 100 ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp), p = B(t[1]) * 100n;
                const w = t.slice(2, 2 + Number(t[0])).map((s) => cdiv(jedn(s, 2), p));
                return `${w.join(' ')}\n${w.reduce((a, b) => a + b, 0n)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, p;
    cin >> n >> p;
    long long razem = 0;
    for (int i = 0; i < n; i++) {
        double s;
        cin >> s;
        long long puszki = ceil(s / p);
        cout << puszki << " ";
        razem += puszki;
    }
    cout << "\n" << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-pietra', krok: 2, level: 'latwe',
            title: 'Które piętro?',
            short: 'Winda zna swoją wysokość. Na którym piętrze jest — także pod ziemią?',
            tags: ['floor', 'liczby ujemne', 'dzielenie double'],
            statement: ['Winda jeździ w wieżowcu z kilkoma piętrami pod ziemią. Każde piętro ma 3 metry wysokości. Piętro 0 obejmuje wysokości od 0 (włącznie) do 3 (bez 3), piętro 1 — od 3 do 6, piętro −1 — od −3 do 0, i tak dalej. Czujnik podaje wysokość windy h w metrach (ujemna oznacza, że winda jest pod ziemią). Dla każdego z n odczytów wypisz numer piętra, na którym jest winda.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — odczyty wysokości.'],
            output_format: ['Jeden wiersz: n numerów pięter.'],
            constraints: ['1 ≤ n ≤ 1000', '−300 ≤ h ≤ 3000', 'h ma co najwyżej dwie cyfry po kropce'],
            examples: [{ input: '6\n0 2.99 3 7.5 -0.5 -3', note: 'Na wysokości −0.5 m winda jest już na piętrze −1. Na wysokości −3 m zaczyna się piętro −1, więc to wciąż piętro −1.' }],
            hint: R`Numer piętra to h / 3 zaokrąglone w dół: (long long)floor(h / 3). Uwaga na windę pod ziemią: dla h = −0.5 rzutowanie (int) dałoby 0, a winda jest na piętrze −1.`,
            tests: (r) => ['1\n0', '1\n-0.01', '2\n-300 3000', '5\n-3.01 -3 -2.99 2.99 3', fmt(losowe(r, 30, -30000, 300000, 2)),
                fmt(Array.from({ length: 1000 }, () => (r() < 0.2 ? String(3 * r.int(-100, 1000)) : losowa(r, -30000, 300000, 2).s)))],
            check: (inp) => (lista(inp).v.every((s) => zakres(-30000, 300000)(jedn(s, 2))) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => fdiv(jedn(s, 2), 300n)).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        double h;
        cin >> h;
        cout << (long long)floor(h / 3) << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-godziny', krok: 2, level: 'latwe',
            title: 'Pełne i rozpoczęte godziny',
            short: 'Ile to pełnych godzin, a ile rozpoczętych?',
            tags: ['floor', 'ceil', 'm / 60.0'],
            statement: ['Dla każdego z n czasów podanych w minutach wypisz w osobnym wierszu dwie liczby: ile to pełnych godzin i ile rozpoczętych godzin (tak liczy się opłaty za parking: płacisz za każdą godzinę, która się zaczęła).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — czasy w minutach.'],
            output_format: ['n wierszy, w każdym dwie liczby.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każdy czas ≤ 10⁹'],
            examples: [{ input: '3\n200 180 0', note: '200 minut to 3 pełne godziny i 4 rozpoczęte. 180 minut to równo 3 godziny.' }],
            hint: R`Pełne godziny to m / 60 zaokrąglone w dół, a rozpoczęte — w górę. Z funkcjami: floor(m / 60.0) i ceil(m / 60.0). Pamiętaj o 60.0 — ceil(m / 60) zaokrąglałoby wynik już ucięty przez dzielenie int-ów. Wyniki zamień na long long.`,
            tests: (r) => ['1\n0', '1\n1', '1\n60', '1\n1000000000', '4\n59 61 119 120', fmt(Array.from({ length: 50 }, () => r.int(0, 1000))),
                fmt(Array.from({ length: 1000 }, () => (r() < 0.2 ? 60 * r.int(0, 16666666) : r.int(0, 1000000000))))],
            check: (inp) => (lista(inp).v.every((s) => +s >= 0 && +s <= 1e9) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => `${fdiv(B(s), 60n)} ${cdiv(B(s), 60n)}`).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int m;
        cin >> m;
        cout << (long long)floor(m / 60.0) << " " << (long long)ceil(m / 60.0) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-kafelki', krok: 2, level: 'latwe',
            title: 'Kafelki',
            short: 'Ile kwadratowych kafelków potrzeba na prostokątną podłogę?',
            tags: ['ceil', '(double) przed dzieleniem', 'long long'],
            statement: ['Podłoga ma kształt prostokąta o wymiarach W na H centymetrów. Układasz na niej kwadratowe kafelki o boku a centymetrów, równymi rzędami, zaczynając od jednego rogu. Kafelki przy krawędziach można przyciąć, ale odcięty kawałek się marnuje. Ile kafelków trzeba kupić?'],
            input_format: ['Jeden wiersz: trzy liczby całkowite W, H i a.'],
            output_format: ['Jedna liczba — liczba kafelków.'],
            constraints: ['1 ≤ W, H, a ≤ 10⁹'],
            examples: [{ input: '250 300 40', note: 'W rzędzie 250 / 40 = 6.25, czyli 7 kafelków, a rzędów 300 / 40 = 7.5, czyli 8. Razem 56.' }, { input: '100 100 50' }],
            hint: R`W jednym rzędzie potrzeba ceil(W / a) kafelków, a rzędów jest ceil(H / a). Pamiętaj o (double) przed dzieleniem. Iloczyn może sięgać 10¹⁸, więc oba czynniki zamień na long long, zanim je pomnożysz.`,
            tests: (r) => ['1 1 1', '1 1 1000000000', '1000000000 1000000000 1', '1000000000 999999999 2', '30 30 30', '31 29 30',
                ...Array.from({ length: 4 }, () => `${r.int(1, 1000)} ${r.int(1, 1000)} ${r.int(1, 100)}`), ...Array.from({ length: 3 }, () => `${r.int(1, 1e9)} ${r.int(1, 1e9)} ${r.int(1, 1000)}`)],
            check: (inp) => (toks(inp).every((s) => +s >= 1 && +s <= 1e9) ? null : 'zakres'),
            solve: (inp) => { const [W, H, a] = toks(inp).map(B); return String(cdiv(W, a) * cdiv(H, a)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long W, H, a;
    cin >> W >> H >> a;
    long long wRzedzie = ceil((double)W / a);
    long long rzedy = ceil((double)H / a);
    cout << wRzedzie * rzedy << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-ile-calkowitych', krok: 2, level: 'srednie',
            title: 'Liczby całkowite w przedziale',
            short: 'Ile liczb całkowitych leży między a i b? floor(b) − ceil(a) + 1.',
            tags: ['floor', 'ceil', 'liczby ujemne', 'przedziały'],
            statement: ['Dla każdego z t przedziałów [a, b] wypisz, ile liczb całkowitych do niego należy (końce przedziału też się liczą). Końce mogą być ujemne i mogą mieć cyfry po kropce.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy dwie liczby a i b (a ≤ b).'],
            output_format: ['t wierszy z odpowiedziami.'],
            constraints: ['1 ≤ t ≤ 1000', '−10⁹ ≤ a ≤ b ≤ 10⁹', 'końce mają co najwyżej dwie cyfry po kropce'],
            examples: [{ input: '3\n-1.5 2.3\n0.2 0.8\n3 7', note: 'Pierwszy przedział zawiera −1, 0, 1 i 2. Drugi nie zawiera żadnej liczby całkowitej.' }],
            hint: R`Pierwsza liczba całkowita w przedziale to ceil(a), ostatnia — floor(b). Liczb od ceil(a) do floor(b) jest floor(b) − ceil(a) + 1. Gdy w przedziale nie ma żadnej liczby całkowitej, wzór sam daje 0. Wyniki zamień na long long — przedziały bywają długie.`,
            tests: (r) => {
                const para = () => {
                    const a = losowa(r, '-100000000000', '100000000000', 2), b = losowa(r, '-100000000000', '100000000000', 2);
                    return a.k <= b.k ? `${a.s} ${b.s}` : `${b.s} ${a.s}`;
                };
                const blisko = () => { const k = r.int(-1000000, 1000000) * 100; const a = k + r.int(1, 49), b = a + r.int(0, 50); return `${napis(B(a), 2)} ${napis(B(b), 2)}`; };
                const t = (n, f) => `${n}\n${Array.from({ length: n }, f).join('\n')}`;
                return ['1\n0 0', '1\n-0.5 -0.5', '1\n-1000000000 1000000000', '1\n0.01 0.99', '2\n-0.99 -0.01\n-1 1', t(20, blisko), t(1000, () => (r() < 0.5 ? para() : blisko()))];
            },
            check: (inp) => {
                const l = linie(inp).slice(1, 1 + Number(toks(inp)[0]));
                return l.every((w) => { const [a, b] = toks(w).map((s) => jedn(s, 2)); return a <= b && zakres('-100000000000', '100000000000')(a) && zakres('-100000000000', '100000000000')(b); }) ? null : 'zakres';
            },
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [a, b] = toks(w).map((s) => jedn(s, 2));
                return String(fdiv(b, 100n) - cdiv(a, 100n) + 1n);
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        double a, b;
        cin >> a >> b;
        long long ile = (long long)floor(b) - (long long)ceil(a) + 1;
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-podzialka', krok: 2, level: 'srednie',
            title: 'Termometr z podziałką',
            short: 'Między którymi kreskami termometru leży temperatura — także na minusie?',
            tags: ['floor', 'ceil', 'wielokrotności', 'liczby ujemne'],
            statement: ['Kreski na termometrze są co k stopni: …, −2k, −k, 0, k, 2k, … Dla każdej z n temperatur t wypisz w osobnym wierszu dwie liczby: kreskę pod temperaturą (największą wielokrotność k nie większą niż t) i kreskę nad temperaturą (najmniejszą wielokrotność k nie mniejszą niż t). Jeśli t wypada dokładnie na kresce, obie liczby są równe t.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n temperatur, każda z co najwyżej jedną cyfrą po kropce.'],
            output_format: ['n wierszy, w każdym dwie liczby całkowite.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 50 (k jest liczbą całkowitą)', '−100 ≤ t ≤ 100'],
            examples: [{ input: '4 5\n12.3 -3.5 15 -10', note: '−3.5 leży między kreskami −5 i 0.' }],
            hint: R`Podziel t przez k, zaokrąglij w dół albo w górę i pomnóż z powrotem przez k: (long long)floor(t / k) * k. Najpierw zamień na long long, potem mnóż — inaczej dla −3.5 i k = 5 dostaniesz „-0”. Dla temperatur ujemnych floor działa poprawnie, a (int) by się mylił.`,
            tests: (r) => {
                const t = (n, k) => `${n} ${k}\n${Array.from({ length: n }, () => (r() < 0.25 ? String(k * r.int(Math.ceil(-100 / k), Math.floor(100 / k))) : losowa(r, -1000, 1000, 1).s)).join(' ')}`;
                return ['1 1\n0', '1 50\n-0.1', '1 50\n0.1', '3 7\n-100 100 -0.5', t(10, 5), t(50, 3), t(1000, 2), t(1000, 7)];
            },
            check: (inp) => { const t = toks(inp); return +t[1] >= 1 && +t[1] <= 50 && t.slice(2).every((s) => zakres(-1000, 1000)(jedn(s, 1))) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp), k = B(t[1]);
                return t.slice(2, 2 + Number(t[0])).map((s) => { const v = jedn(s, 1); return `${fdiv(v, 10n * k) * k} ${cdiv(v, 10n * k) * k}`; }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    for (int i = 0; i < n; i++) {
        double t;
        cin >> t;
        long long pod = (long long)floor(t / k) * k;
        long long nad = (long long)ceil(t / k) * k;
        cout << pod << " " << nad << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-schody', krok: 2, level: 'srednie',
            title: 'Schody',
            short: 'Ile najmniej równych stopni, żeby żaden nie był za wysoki?',
            tags: ['ceil', 'dzielenie double', 'fixed i setprecision'],
            statement: ['Trzeba zbudować schody na wysokość h centymetrów. Każdy stopień może mieć co najwyżej s centymetrów wysokości, a wszystkie stopnie muszą być jednakowo wysokie. Ile najmniej stopni trzeba zbudować? Wypisz tę liczbę, a w drugim wierszu — wysokość jednego stopnia w centymetrach, z dwiema cyframi po kropce.'],
            input_format: ['Jeden wiersz: liczby całkowite h i s.'],
            output_format: ['Dwa wiersze: liczba stopni i wysokość stopnia z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ h ≤ 10 000', '1 ≤ s ≤ 100'],
            examples: [{ input: '300 17', note: '300 / 17 ≈ 17.6, więc 17 stopni to za mało — każdy byłby wyższy niż 17 cm. Przy 18 stopniach każdy ma 300 / 18 ≈ 16.67 cm.' }, { input: '300 20' }],
            hint: R`Liczba stopni to h / s zaokrąglone w górę: long long n = ceil((double)h / s);. Wysokość stopnia to (double)h / n — wypisz ją z fixed i setprecision(2).`,
            tests: (r) => {
                const out = ['1 1', '1 100', '10000 1', '10000 100', '7 2', '100 30'];
                while (out.length < 14) {
                    const hh = r.int(1, 10000), s = r.int(1, 100), n = Number(cdiv(B(hh), B(s)));
                    if (safe(hh / n, 2)) out.push(`${hh} ${s}`);
                }
                return out.filter((t) => { const [hh, s] = t.split(' ').map(Number); return safe(hh / Number(cdiv(B(hh), B(s))), 2); });
            },
            check: (inp) => { const [hh, s] = toks(inp).map(Number); return hh >= 1 && hh <= 10000 && s >= 1 && s <= 100 ? null : 'zakres'; },
            solve: (inp) => { const [hh, s] = toks(inp).map(Number); const n = Number(cdiv(B(hh), B(s))); return `${n}\n${fx(hh / n, 2)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int h, s;
    cin >> h >> s;
    long long n = ceil((double)h / s);
    cout << n << "\n";
    cout << fixed << setprecision(2) << (double)h / n << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 3 · round i llround
        {
            id: 'zao-do-najblizszej', krok: 3, level: 'latwe',
            title: 'Do najbliższej',
            short: 'Zaokrąglij liczby tak jak round — połówki dalej od zera.',
            tags: ['llround', 'połówki', 'liczby ujemne'],
            statement: ['Wczytaj n liczb (mogą być ujemne). Każdą zaokrąglij do najbliższej liczby całkowitej tak, jak robi to funkcja round: liczby leżące dokładnie w połowie idą w stronę dalszą od zera (2.5 → 3, −2.5 → −3). Wypisz wyniki w jednym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: n liczb całkowitych.'],
            constraints: ['1 ≤ n ≤ 1000', '−10¹² ≤ każda liczba ≤ 10¹²', 'każda liczba ma co najwyżej dwie cyfry po kropce'],
            examples: [{ input: '6\n2.4 2.5 -2.5 -0.4 7 1234567.5', note: '−0.4 zaokrągla się do 0 — wypisz 0, nie -0.' }],
            hint: R`llround(x) zaokrągla dokładnie tak, jak trzeba, i od razu daje long long — bez -0 i bez zapisu naukowego.`,
            tests: (r) => {
                const pol = () => `${r() < 0.5 ? '-' : ''}${r.int(0, 999999999)}.5`;
                return ['1\n0', '1\n-0.5', '1\n0.5', '1\n-0.49', '2\n1000000000000 -1000000000000', '2\n999999999999.5 -999999999999.5',
                    fmt([...losowe(r, 10, -100000, 100000, 2), pol(), pol()]),
                    fmt(Array.from({ length: 1000 }, () => (r() < 0.3 ? pol() : losowa(r, '-100000000000000', '100000000000000', 2).s)))];
            },
            check: (inp) => (lista(inp).v.every((s) => zakres('-100000000000000', '100000000000000')(jedn(s, 2))) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => rdivAway(jedn(s, 2), 100n)).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        cout << llround(x) << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-ocena-koncowa', krok: 3, level: 'latwe',
            title: 'Ocena na koniec roku',
            short: 'Średnia ocen z dwoma miejscami po przecinku i ocena końcowa.',
            tags: ['(double)suma / n', 'llround', 'fixed i setprecision'],
            statement: ['Uczeń dostał w ciągu roku n ocen (liczby całkowite od 1 do 6). W pierwszym wierszu wypisz średnią jego ocen z dokładnie dwiema cyframi po kropce. W drugim wierszu wypisz ocenę na koniec roku: średnią zaokrągloną do najbliższej liczby całkowitej, przy czym średnia leżąca dokładnie w połowie (np. 4.5) zaokrągla się w górę.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n ocen.'],
            output_format: ['Dwa wiersze: średnia z dwiema cyframi po kropce i ocena końcowa (liczba całkowita).'],
            constraints: ['1 ≤ n ≤ 1000', 'każda ocena to liczba całkowita od 1 do 6'],
            examples: [{ input: '4\n5 4 4 5', note: 'Średnia 4.5 to połówka — ocena końcowa to 5.' }, { input: '3\n3 4 4' }],
            hint: R`Średnia to (double)suma / n — bez (double) dzielenie utnie ułamek. Ocena końcowa to llround(srednia). Uważaj: po cout << fixed << setprecision(2) także round(srednia) wypisałoby się z kropką (5.00) — llround daje liczbę całkowitą i tego kłopotu nie ma.`,
            tests: (r) => {
                const out = ['1\n6', '1\n1', '2\n1 2', '2\n5 6', '6\n4 5 4 5 4 5'];
                const los = (n) => fmt(Array.from({ length: n }, () => r.int(1, 6)));
                for (const n of [3, 7, 10, 25, 100, 999, 1000]) {
                    for (let p = 0; p < 50; p++) { const t = los(n); const v = lista(t).v.map(Number); if (safe(v.reduce((a, b) => a + b, 0) / n, 2)) { out.push(t); break; } }
                }
                return out;
            },
            check: (inp) => {
                const v = lista(inp).v.map(Number);
                if (!v.every((x) => Number.isInteger(x) && x >= 1 && x <= 6)) return 'zakres';
                return safe(v.reduce((a, b) => a + b, 0) / v.length, 2) ? null : 'połówka przy wypisywaniu';
            },
            solve: (inp) => {
                const v = lista(inp).v.map(Number), s = v.reduce((a, b) => a + b, 0);
                return `${fx(s / v.length, 2)}\n${rdivUp(B(s), B(v.length))}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int suma = 0;
    for (int i = 0; i < n; i++) {
        int ocena;
        cin >> ocena;
        suma += ocena;
    }
    double srednia = (double)suma / n;
    cout << fixed << setprecision(2) << srednia << "\n";
    cout << llround(srednia) << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-suma-zaokraglen', krok: 3, level: 'srednie',
            title: 'Zaokrąglić przed czy po?',
            short: 'Suma zaokrągleń i zaokrąglenie sumy — dwie różne liczby.',
            tags: ['llround', 'suma w pętli', 'kolejność zaokrągleń'],
            statement: ['Masz n liczb z co najwyżej dwiema cyframi po kropce (mogą być ujemne). W pierwszym wierszu wypisz sumę ich zaokrągleń: każdą liczbę zaokrąglij do najbliższej całkowitej i zsumuj wyniki. W drugim wierszu wypisz zaokrąglenie ich sumy: zsumuj liczby i dopiero sumę zaokrąglij. Zaokrąglaj tak jak round — połówki w stronę dalszą od zera. Gwarantujemy, że suma wszystkich liczb nie leży dokładnie w połowie między dwiema liczbami całkowitymi.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Dwa wiersze, w każdym jedna liczba całkowita.'],
            constraints: ['1 ≤ n ≤ 1000', '−1000 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '3\n1.4 1.4 1.4', note: 'Każde 1.4 zaokrągla się do 1, więc suma zaokrągleń to 3. Ale suma to 4.2, a jej zaokrąglenie — 4.' }, { input: '4\n2.5 -2.5 0.5 1.25' }],
            hint: R`Dwie zmienne w jednej pętli: do pierwszej (long long) dodawaj llround(x), do drugiej (double) — samo x. Na końcu wypisz pierwszą i llround(drugiej).`,
            tests: (r) => {
                const zestaw = (n, pol) => {
                    for (;;) {
                        const ks = Array.from({ length: n }, () => (r() < pol ? B(r.int(-1000, 999)) * 100n + 50n : B(r.int(-100000, 100000))));
                        const s = ks.reduce((a, b) => a + b, 0n);
                        if (((s % 100n) + 100n) % 100n !== 50n) return fmt(ks.map((k) => napis(k, 2)));
                    }
                };
                return ['2\n0.5 0.6', '2\n-0.5 -0.6', '2\n0.4 0.4', '2\n-0.4 -0.4', zestaw(5, 0.4), zestaw(30, 0.3), zestaw(1000, 0.2), zestaw(1000, 0)];
            },
            check: (inp) => {
                const ks = lista(inp).v.map((s) => jedn(s, 2));
                if (!ks.every(zakres(-100000, 100000))) return 'zakres';
                const s = ks.reduce((a, b) => a + b, 0n);
                return ((s % 100n) + 100n) % 100n === 50n ? 'suma w połowie' : null;
            },
            solve: (inp) => {
                const ks = lista(inp).v.map((s) => jedn(s, 2));
                return `${ks.reduce((a, k) => a + rdivAway(k, 100n), 0n)}\n${rdivAway(ks.reduce((a, b) => a + b, 0n), 100n)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long sumaZaokraglen = 0;
    double suma = 0;
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        sumaZaokraglen += llround(x);
        suma += x;
    }
    cout << sumaZaokraglen << "\n" << llround(suma) << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-pomiary', krok: 3, level: 'latwe',
            title: 'Pomiary linijką',
            short: 'Zaokrąglij pomiary do pełnych centymetrów i policz, ile poszło w górę.',
            tags: ['llround', 'porównanie', 'licznik'],
            statement: ['Zmierzyłeś n odcinków z dokładnością do milimetra, czyli długości w centymetrach z jedną cyfrą po kropce. Do zeszytu wpisujesz długości zaokrąglone do pełnych centymetrów (połówki w górę). W pierwszym wierszu wypisz zaokrąglone długości, a w drugim — ile z nich zostało zaokrąglonych w górę (czyli wynik jest większy niż pomiar).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n długości.'],
            output_format: ['Dwa wiersze: n liczb całkowitych oraz jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1000', '0 < każda długość ≤ 1000', 'każda długość ma co najwyżej jedną cyfrę po kropce'],
            examples: [{ input: '5\n12.3 4.5 7 0.8 9.9', note: 'W górę poszły: 4.5 → 5, 0.8 → 1 i 9.9 → 10.' }],
            hint: R`llround(x) zaokrągla do najbliższej. Zaokrąglenie poszło w górę, jeśli wynik jest większy od pomiaru: llround(x) > x.`,
            tests: (r) => ['1\n0.5', '1\n1000', '3\n0.1 0.4 0.6', fmt(losowe(r, 20, 1, 10000, 1)), fmt(Array.from({ length: 1000 }, () => (r() < 0.2 ? `${r.int(0, 999)}.5` : losowa(r, 1, 10000, 1).s)))],
            check: (inp) => (lista(inp).v.every((s) => zakres(1, 10000)(jedn(s, 1))) ? null : 'zakres'),
            solve: (inp) => {
                const w = lista(inp).v.map((s) => { const k = jedn(s, 1); return { k, z: rdivUp(k, 10n) }; });
                return `${w.map((x) => x.z).join(' ')}\n${w.filter((x) => x.z * 10n > x.k).length}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int wGore = 0;
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        long long z = llround(x);
        cout << z << " ";
        if (z > x) wGore++;
    }
    cout << "\n" << wGore << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-pelna-godzina', krok: 3, level: 'latwe',
            title: 'Do pełnej godziny',
            short: 'Zaokrąglij godzinę zegarową do najbliższej pełnej godziny.',
            tags: ['llround', 'hh:mm', 'setw i setfill', '% 24'],
            statement: ['Dla każdej z n godzin zapisanych w formacie hh:mm wypisz godzinę zaokrągloną do najbliższej pełnej godziny, w formacie hh:00. Od 30 minut zaokrąglamy w górę. Po 23:30 jest już północ, czyli 00:00.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy godzina w formacie hh:mm.'],
            output_format: ['n wierszy z godzinami w formacie hh:00.'],
            constraints: ['1 ≤ n ≤ 1000', '00 ≤ hh ≤ 23', '00 ≤ mm ≤ 59'],
            examples: [{ input: '4\n14:29\n14:30\n09:05\n23:45' }],
            hint: R`Wczytaj godzinę jak w lekcji o wejściu i wyjściu: int h, m; char c; cin >> h >> c >> m;. Zamień czas na minuty t = 60 * h + m, zaokrąglij t / 60.0 do najbliższej: llround(t / 60.0), weź wynik modulo 24 i wypisz z setw(2) i setfill('0').`,
            tests: (r) => {
                const g = () => `${pad2(r.int(0, 23))}:${pad2(r() < 0.2 ? 30 : r.int(0, 59))}`;
                return ['1\n00:00', '1\n23:29', '1\n23:30', '1\n23:59', '3\n11:30\n11:29\n12:00', `20\n${Array.from({ length: 20 }, g).join('\n')}`, `1000\n${Array.from({ length: 1000 }, g).join('\n')}`];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => /^([01]\d|2[0-3]):[0-5]\d$/.test(w.trim())) ? null : 'format'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [hh, mm] = w.trim().split(':').map(Number);
                return `${pad2(Number(rdivUp(B(60 * hh + mm), 60n) % 24n))}:00`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int h, m;
        char c;
        cin >> h >> c >> m;
        int t = 60 * h + m;
        long long godzina = llround(t / 60.0) % 24;
        cout << setw(2) << setfill('0') << godzina << ":00\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-blad-zaokraglenia', krok: 3, level: 'latwe',
            title: 'Jak daleko do całości?',
            short: 'Odległość każdej liczby od najbliższej liczby całkowitej.',
            tags: ['abs(x - round(x))', 'fixed i setprecision', 'liczby ujemne'],
            statement: ['Dla każdej z n liczb (mogą być ujemne) wypisz w osobnym wierszu jej odległość od najbliższej liczby całkowitej, z dokładnie dwiema cyframi po kropce.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['n wierszy, w każdym liczba z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ n ≤ 1000', '−1 000 000 ≤ każda liczba ≤ 1 000 000', 'każda liczba ma co najwyżej dwie cyfry po kropce'],
            examples: [{ input: '4\n3.8 7.25 -1.9 -2.5', note: 'Liczba −2.5 leży w połowie, więc jej odległość od obu sąsiadów to 0.50.' }],
            hint: R`Odległość od zaokrąglenia: abs(x - round(x)). Wypisz z fixed i setprecision(2). Odległość nigdy nie przekracza 0.5.`,
            tests: (r) => ['1\n0', '1\n-0.01', '1\n1000000', '2\n-1000000 0.5', fmt(losowe(r, 30, -100000000, 100000000, 2)), fmt(losowe(r, 1000, -100000000, 100000000, 2))],
            check: (inp) => (lista(inp).v.every((s) => zakres(-100000000, 100000000)(jedn(s, 2))) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => { const rr = ((jedn(s, 2) % 100n) + 100n) % 100n; return stale(rr < 100n - rr ? rr : 100n - rr, 2); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << fixed << setprecision(2);
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        cout << abs(x - round(x)) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-frekwencja', krok: 3, level: 'srednie',
            title: 'Frekwencja',
            short: 'Frekwencja każdego dnia w procentach i najlepszy dzień.',
            tags: ['100.0 * a / u', 'llround', 'rekord z pozycją'],
            statement: ['Klasa liczy u uczniów. W dzienniku zapisano, ilu uczniów było obecnych w każdym z n dni. W pierwszym wierszu wypisz frekwencję każdego dnia w procentach, zaokrągloną do najbliższej liczby całkowitej (połówki w górę). W drugim wierszu wypisz numer dnia z najwyższą zaokrągloną frekwencją (dni numerujemy od 1; przy remisie wybierz najwcześniejszy dzień).'],
            input_format: ['W pierwszym wierszu liczby n i u.', 'W drugim wierszu n liczb całkowitych — liczby obecnych uczniów.'],
            output_format: ['Dwa wiersze: n liczb całkowitych (procenty) i numer dnia.'],
            constraints: ['1 ≤ n ≤ 365', '1 ≤ u ≤ 40', '0 ≤ liczba obecnych ≤ u'],
            examples: [{ input: '5 23\n23 17 20 22 17', note: '17 z 23 to 73.9…%, czyli 74%. Najlepszy jest dzień 1 — 100%.' }],
            hint: R`Frekwencja to 100.0 * a / u — dzięki 100.0 na początku całe działanie liczy się na double. Zaokrąglij llround. Najlepszy dzień to rekord z pozycją: ostry znak > zostawia przy remisie najwcześniejszy dzień.`,
            tests: (r) => {
                const t = (n, u) => {
                    const a = Array.from({ length: n }, () => { for (;;) { const x = r.int(Math.floor(u / 2), u); if ((200 * x) % (2 * u) !== u) return x; } });
                    return `${n} ${u}\n${a.join(' ')}`;
                };
                return ['1 1\n0', '1 1\n1', '3 3\n1 2 3', '4 40\n38 40 40 0', t(10, 7), t(30, 25), t(365, 29), t(365, 40)];
            },
            check: (inp) => {
                const t = toks(inp).map(Number), u = t[1];
                const a = t.slice(2);
                if (!(u >= 1 && u <= 40 && a.every((x) => x >= 0 && x <= u))) return 'zakres';
                return a.every((x) => (200 * x) % (2 * u) !== u) ? null : 'procent w połowie';
            },
            solve: (inp) => {
                const t = toks(inp).map(Number), u = B(t[1]);
                const p = t.slice(2, 2 + t[0]).map((x) => rdivUp(100n * B(x), u));
                let best = 0;
                p.forEach((x, i) => { if (x > p[best]) best = i; });
                return `${p.join(' ')}\n${best + 1}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, u;
    cin >> n >> u;
    long long najlepsza = -1;
    int dzien = 0;
    for (int i = 1; i <= n; i++) {
        int a;
        cin >> a;
        long long proc = llround(100.0 * a / u);
        cout << proc << " ";
        if (proc > najlepsza) {
            najlepsza = proc;
            dzien = i;
        }
    }
    cout << "\n" << dzien << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-wlasny-round', krok: 3, level: 'srednie',
            title: 'Własny round',
            short: 'Zaokrąglanie do najbliższej bez round — za pomocą floor i symetrii.',
            tags: ['floor(x + 0.5)', 'liczby ujemne', 'połówki'],
            statement: ['Napisz zaokrąglanie do najbliższej liczby całkowitej bez funkcji round, lround ani llround — możesz używać floor, ceil, (int) i instrukcji if. Zasada ma być taka sama jak w round: liczby dokładnie w połowie zaokrąglamy w stronę dalszą od zera (2.5 → 3, −2.5 → −3). Wczytaj n liczb i wypisz ich zaokrąglenia w jednym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: n liczb całkowitych.'],
            constraints: ['1 ≤ n ≤ 1000', '−1 000 000 ≤ każda liczba ≤ 1 000 000', 'każda liczba ma co najwyżej dwie cyfry po kropce'],
            examples: [{ input: '6\n2.5 -2.5 -2.7 -2.2 0.4 -0.4' }],
            hint: R`Dla x ≥ 0 wystarczy floor(x + 0.5). Dla x < 0 skorzystaj z symetrii: zaokrąglij liczbę bez minusa i dopisz minus, czyli -floor(-x + 0.5). Wynik zapisz do long long — inaczej −0.4 wypisze się jako -0.`,
            tests: (r) => {
                const pol = () => `${r() < 0.5 ? '-' : ''}${r.int(0, 999999)}.5`;
                return ['1\n0', '1\n-0.5', '1\n0.49', '1\n-0.51', '2\n1000000 -1000000', fmt([...losowe(r, 10, -100000000, 100000000, 2), pol(), pol()]),
                    fmt(Array.from({ length: 1000 }, () => (r() < 0.3 ? pol() : losowa(r, -100000000, 100000000, 2).s)))];
            },
            check: (inp) => (lista(inp).v.every((s) => zakres(-100000000, 100000000)(jedn(s, 2))) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => rdivAway(jedn(s, 2), 100n)).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        long long w;
        if (x >= 0) w = floor(x + 0.5);
        else w = -floor(-x + 0.5);
        cout << w << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
    ];
};
