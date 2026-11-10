// Zaokrąglanie — ćwiczenia w trakcie lekcji, części 7–8: zaokrąglanie do miejsc po przecinku (round(x * 100) / 100,
// w dół i w górę do groszy, setprecision a zaokrąglanie wartości, połówki, kolejność zaokrągleń) oraz pułapki liczb
// double (złote na grosze przez llround, epsilon, porównania, liczenie w groszach, pierwiastek całkowity, dokładny iloraz).
// W części 7 testy omijają dane, na których poprawne rozwiązanie na double mogłoby się pomylić; w części 8 takie dane
// są celowo — zadania uczą, jak się przed nimi bronić.
module.exports = (h) => {
    const { toks } = h;
    const { jedn, napis, stale, fdiv, cdiv, rdivUp, rdivAway, isqrt, cround, losowa } = require('./zaokraglanie-pomoc');
    const R = String.raw;
    const B = BigInt;
    const linie = (inp) => inp.replace(/\r/g, '').split('\n');
    const lista = (inp) => { const t = toks(inp); return { n: Number(t[0]), v: t.slice(1, 1 + Number(t[0])) }; };
    const zakres = (lo, hi) => (v) => B(v) >= B(lo) && B(v) <= B(hi);
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const wiersze = (a) => `${a.length}\n${a.join('\n')}`;
    const P10 = (k) => 10n ** B(k);
    // losowa liczba z dokładnie d cyframi po kropce (napis), jako k jednostek 10^-6
    const zCyframi = (r, lo, hi, d) => { const k = r.big(lo, hi); return { s: stale(k, d), k6: k * P10(6 - d) }; };

    return [
        // ================================================================ KROK 7 · do miejsc po przecinku
        {
            id: 'zao-do-groszy', krok: 7, level: 'latwe',
            title: 'Do pełnych groszy',
            short: 'Zaokrąglij kwoty z kalkulatora do dwóch miejsc po przecinku.',
            tags: ['round(x * 100) / 100', 'fixed i setprecision'],
            statement: ['Kalkulator wyliczył n kwot z wieloma cyframi po kropce. Zaokrąglij każdą do pełnych groszy (do dwóch miejsc po przecinku) i wypisz ją z dokładnie dwiema cyframi po kropce, każdą w osobnym wierszu. Gwarantujemy, że żadna kwota nie leży dokładnie w połowie między dwoma groszami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n kwot.'],
            output_format: ['n wierszy, w każdym kwota z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ kwota ≤ 1 000 000', 'każda kwota ma od 3 do 6 cyfr po kropce'],
            examples: [{ input: '3\n3.14159 2.71828 9.996', note: 'Przy 9.996 zaokrąglenie przenosi się aż do części całkowitej: 10.00.' }],
            hint: R`round(x * 100) / 100, a potem cout << fixed << setprecision(2). Sprawdź, co Twój program wypisze dla 9.996 i dla 0.004.`,
            tests: (r) => {
                const jedna = () => { for (;;) { const d = r.int(3, 6); const z = zCyframi(r, 0, 1000000n * P10(d), d); if (z.k6 % 10000n !== 5000n) return z.s; } };
                return ['1\n0.004', '1\n0.996', '1\n999999.999', '1\n1000000.000', '2\n0.0049 0.0051', fmt(Array.from({ length: 30 }, jedna)), fmt(Array.from({ length: 1000 }, jedna))];
            },
            check: (inp) => (lista(inp).v.every((s) => /\.\d{3,6}$/.test(s) && zakres(0, 1000000000000)(jedn(s, 6)) && jedn(s, 6) % 10000n !== 5000n) ? null : 'zakres albo połówka'),
            solve: (inp) => lista(inp).v.map((s) => stale(rdivUp(jedn(s, 6), 10000n), 2)).join('\n'),
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
        cout << round(x * 100) / 100 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-do-k-miejsc', krok: 7, level: 'latwe',
            title: 'Do k miejsc po przecinku',
            short: 'Zaokrąglij każdą liczbę do podanej liczby miejsc po przecinku.',
            tags: ['round(x * p) / p', 'potęga dziesiątki w pętli', 'setprecision(k)'],
            statement: ['Dla każdej z n par x, k zaokrąglij x do k miejsc po przecinku i wypisz wynik z dokładnie k cyframi po kropce (dla k = 0 — bez kropki). Gwarantujemy, że żadna liczba nie leży dokładnie w połowie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy liczba x i liczba całkowita k.'],
            output_format: ['n wierszy z wynikami.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ x ≤ 10 000, x ma co najwyżej 7 cyfr po kropce', '0 ≤ k ≤ 4'],
            examples: [{ input: '3\n3.14159 2\n2.5049 1\n7.77777 0' }],
            hint: R`Policz p = 10 do potęgi k pętlą: double p = 1; for (int j = 0; j < k; j++) p *= 10;. Zaokrąglenie to round(x * p) / p, a wypisujesz je z fixed i setprecision(k) — przy k = 0 setprecision(0) wypisze liczbę bez kropki.`,
            tests: (r) => {
                const jedna = () => { for (;;) { const k = r.int(0, 4); const X = r.big(0, 10000n * P10(7)); const sc = P10(7 - k); if (X % sc !== sc / 2n) return `${napis(X, 7)} ${k}`; } };
                return ['1\n0 0', '1\n10000 4', '1\n9999.99996 4', '2\n0.4 0\n0.6 0', '5\n1.2345678 0\n1.2345678 1\n1.2345678 2\n1.2345678 3\n1.2345678 4', wiersze(Array.from({ length: 30 }, jedna)), wiersze(Array.from({ length: 1000 }, jedna))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [x, k] = toks(w); const X = jedn(x, 7), sc = P10(7 - Number(k)); return zakres(0, 10000n * P10(7))(X) && +k >= 0 && +k <= 4 && X % sc !== sc / 2n; }) ? null : 'zakres albo połówka'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => { const [x, k] = toks(w); return stale(rdivUp(jedn(x, 7), P10(7 - Number(k))), Number(k)); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        double x;
        int k;
        cin >> x >> k;
        double p = 1;
        for (int j = 0; j < k; j++) p *= 10;
        cout << fixed << setprecision(k) << round(x * p) / p << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-obciecie', krok: 7, level: 'latwe',
            title: 'W dół i w górę do groszy',
            short: 'Bank obcina do grosza, sklep zaokrągla w górę. Wypisz obie kwoty.',
            tags: ['floor(x * 100) / 100', 'ceil(x * 100) / 100'],
            statement: ['Bank dopisuje odsetki obcięte do pełnych groszy (w dół), a sklep dolicza opłaty zaokrąglone do pełnych groszy w górę. Dla każdej z n kwot wypisz w osobnym wierszu dwie liczby z dwiema cyframi po kropce: kwotę zaokrągloną do groszy w dół i w górę. Każda kwota ma od 3 do 6 cyfr po kropce, a jej cyfry po drugim miejscu po przecinku nie są same zerami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n kwot.'],
            output_format: ['n wierszy, w każdym dwie kwoty z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ n ≤ 1000', '0 < kwota ≤ 100 000'],
            examples: [{ input: '3\n12.3456 0.001 7.999', note: '0.001 zł w dół to 0.00, a w górę — cały grosz, 0.01.' }],
            hint: R`floor(x * 100) / 100 i ceil(x * 100) / 100, a potem fixed i setprecision(2).`,
            tests: (r) => {
                const jedna = () => { for (;;) { const d = r.int(3, 6); const z = zCyframi(r, 1, 100000n * P10(d), d); if (z.k6 % 10000n !== 0n) return z.s; } };
                return ['1\n0.001', '1\n99999.999', '1\n0.009999', '2\n5.001 5.999', fmt(Array.from({ length: 30 }, jedna)), fmt(Array.from({ length: 1000 }, jedna))];
            },
            check: (inp) => (lista(inp).v.every((s) => /\.\d{3,6}$/.test(s) && zakres(1, 100000000000)(jedn(s, 6)) && jedn(s, 6) % 10000n !== 0n) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => { const k = jedn(s, 6); return `${stale(fdiv(k, 10000n), 2)} ${stale(cdiv(k, 10000n), 2)}`; }).join('\n'),
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
        cout << floor(x * 100) / 100 << " " << ceil(x * 100) / 100 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-srednia-dziesiate', krok: 7, level: 'srednie',
            title: 'Średnia do dziesiątych',
            short: 'Średnia z jednym miejscem po przecinku — połówki w górę, nie do parzystej.',
            tags: ['round(10.0 * suma / n) / 10', 'setprecision a połówki'],
            statement: ['Dla każdego z t uczniów znasz jego wyniki z n testów (liczby całkowite od 0 do 100). Wypisz średnią każdego ucznia zaokrągloną do jednego miejsca po przecinku, z dokładnie jedną cyfrą po kropce. Średnią leżącą dokładnie w połowie zaokrąglamy w górę (np. 4.25 → 4.3).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczba n, a po niej n wyników ucznia.'],
            output_format: ['t wierszy, w każdym średnia z jedną cyfrą po kropce.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 100', '0 ≤ każdy wynik ≤ 100'],
            examples: [{ input: '3\n4 4 5 4 4\n3 3 4 4\n2 5 5', note: 'Pierwsza średnia to dokładnie 4.25 — połówka, więc 4.3. Samo setprecision(1) wypisałoby 4.2!' }],
            hint: R`Zaokrąglij wartość, a nie tylko wypisywanie: round(10.0 * suma / n) / 10, a potem fixed i setprecision(1). Samo setprecision(1) zaokrągliłoby 4.25 do 4.2, bo przy idealnej połówce wybiera cyfrę parzystą. Licz 10.0 * suma / n w jednym działaniu.`,
            tests: (r) => {
                const ok = (s, n) => { const e = Number(rdivUp(10n * B(s), B(n))); return cround(10 * s / n) === e && cround(s / n * 10) === e; };
                const uczen = (pol) => {
                    for (;;) {
                        let n, s;
                        if (pol) { n = 4 * r.int(1, 25); const a = r.int(0, 99); s = n * a + (r() < 0.5 ? n / 4 : 3 * n / 4); }
                        else { n = r.int(1, 100); s = r.int(0, 100 * n); }
                        if (s > 100 * n || !ok(s, n)) continue;
                        const v = Array(n).fill(Math.floor(s / n));
                        for (let j = 0; j < s % n; j++) v[j]++;
                        return `${n} ${r.shuffle(v).join(' ')}`;
                    }
                };
                return ['1\n1 0', '1\n1 100', '1\n4 0 0 0 1', '1\n4 1 1 1 0', '2\n2 1 2\n2 2 3', wiersze(Array.from({ length: 20 }, () => uczen(r() < 0.5))), wiersze(Array.from({ length: 100 }, () => uczen(r() < 0.3)))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => {
                const v = toks(w).map(Number), n = v[0], s = v.slice(1).reduce((a, b) => a + b, 0);
                if (!(n >= 1 && n <= 100 && v.length === n + 1 && v.slice(1).every((x) => x >= 0 && x <= 100))) return false;
                const e = Number(rdivUp(10n * B(s), B(n)));
                return cround(10 * s / n) === e && cround(s / n * 10) === e;
            }) ? null : 'zakres albo zła połówka'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const v = toks(w).map(Number), s = v.slice(1).reduce((a, b) => a + b, 0);
                return stale(rdivUp(10n * B(s), B(v[0])), 1);
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    cout << fixed << setprecision(1);
    for (int i = 0; i < t; i++) {
        int n;
        cin >> n;
        int suma = 0;
        for (int j = 0; j < n; j++) {
            int w;
            cin >> w;
            suma += w;
        }
        cout << round(10.0 * suma / n) / 10 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-kantor', krok: 7, level: 'srednie',
            title: 'Kantor',
            short: 'Wymiana euro na złote po kursie z czterema miejscami po przecinku.',
            tags: ['round(x * 100) / 100', 'mnożenie double'],
            statement: ['Kantor wymienia euro na złote po kursie r (ile złotych za 1 euro). Wynik zaokrągla do najbliższego grosza. Dla każdej z n wymian wypisz, ile złotych dostanie klient, z dwiema cyframi po kropce. Gwarantujemy, że żaden wynik nie wypada dokładnie w połowie między dwoma groszami.'],
            input_format: ['W pierwszym wierszu liczba n i kurs r (z czterema cyframi po kropce).', 'W drugim wierszu n kwot w euro, każda z co najwyżej dwiema cyframi po kropce.'],
            output_format: ['n wierszy z kwotami w złotych.'],
            constraints: ['1 ≤ n ≤ 1000', '3 ≤ r ≤ 6', '0 < kwota ≤ 100 000'],
            examples: [{ input: '3 4.3217\n100 12.5 0.99', note: '12.5 · 4.3217 = 54.02125, czyli 54.02 zł.' }],
            hint: R`Złotówki to kwota * r, zaokrąglone do groszy: round(kwota * r * 100) / 100. Wypisz z fixed i setprecision(2).`,
            tests: (r) => {
                const t = (n) => {
                    const kurs = r.int(30000, 60000);
                    const kw = [];
                    while (kw.length < n) { const k = r.big(1, 10000000); if ((k * B(kurs)) % 10000n !== 5000n) kw.push(r() < 0.5 ? napis(k, 2) : stale(k, 2)); }
                    return `${n} ${stale(B(kurs), 4)}\n${kw.join(' ')}`;
                };
                return ['1 3.0000\n0.01', '1 6.0000\n100000', '2 4.4000\n0.01 0.03', t(10), t(100), t(1000)];
            },
            check: (inp) => { const t = toks(inp); const kurs = jedn(t[1], 4); return kurs >= 30000n && kurs <= 60000n && t.slice(2).every((s) => zakres(1, 10000000)(jedn(s, 2)) && (jedn(s, 2) * kurs) % 10000n !== 5000n) ? null : 'zakres albo połówka'; },
            solve: (inp) => { const t = toks(inp), kurs = jedn(t[1], 4); return t.slice(2, 2 + Number(t[0])).map((s) => stale(rdivUp(jedn(s, 2) * kurs, 10000n), 2)).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    double r;
    cin >> n >> r;
    cout << fixed << setprecision(2);
    for (int i = 0; i < n; i++) {
        double euro;
        cin >> euro;
        cout << round(euro * r * 100) / 100 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-fahrenheit', krok: 7, level: 'latwe',
            title: 'Stopnie Fahrenheita',
            short: 'Zamień stopnie Celsjusza na Fahrenheita i zaokrąglij do dziesiątych.',
            tags: ['wzór na double', 'round(x * 10) / 10', 'setprecision(1)'],
            statement: ['Temperaturę w stopniach Celsjusza C zamieniamy na stopnie Fahrenheita wzorem F = C · 9 / 5 + 32. Dla każdej z n temperatur wypisz temperaturę w stopniach Fahrenheita zaokrągloną do jednego miejsca po przecinku, z dokładnie jedną cyfrą po kropce. Gwarantujemy, że C ≠ −17.8 (wtedy F jest tak bliskie zera, że wypisałoby się jako -0.0).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n temperatur, każda z co najwyżej jedną cyfrą po kropce.'],
            output_format: ['n wierszy, w każdym temperatura z jedną cyfrą po kropce.'],
            constraints: ['1 ≤ n ≤ 1000', '−100 ≤ C ≤ 100'],
            examples: [{ input: '3\n36.6 -40 21.5', note: '36.6 · 9 / 5 + 32 = 97.88, czyli 97.9.' }],
            hint: R`Policz F = c * 9 / 5 + 32 — c jest typu double, więc dzielenie przez 5 nie utnie ułamka. Zaokrąglij round(F * 10) / 10 i wypisz z fixed i setprecision(1).`,
            tests: (r) => {
                const jedna = () => { for (;;) { const k = r.int(-1000, 1000); if (k !== -178) return napis(B(k), 1); } };
                return ['1\n0', '1\n-17.7', '1\n-17.9', '2\n-100 100', '3\n-40 37 0.1', fmt(Array.from({ length: 30 }, jedna)), fmt(Array.from({ length: 1000 }, jedna))];
            },
            check: (inp) => (lista(inp).v.every((s) => zakres(-1000, 1000)(jedn(s, 1)) && jedn(s, 1) !== -178n) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => stale(rdivAway(18n * jedn(s, 1) + 3200n, 10n), 1)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << fixed << setprecision(1);
    for (int i = 0; i < n; i++) {
        double c;
        cin >> c;
        double f = c * 9 / 5 + 32;
        cout << round(f * 10) / 10 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-najpierw-czy-potem', krok: 7, level: 'srednie',
            title: 'Najpierw zaokrąglić czy potem?',
            short: 'Dwie kasy liczą tę samą cenę na dwa sposoby. O ile się różnią?',
            tags: ['kolejność zaokrągleń', 'round(x * 100) / 100', 'llround'],
            statement: ['Sklep sprzedaje śrubki na sztuki. Cena jednej śrubki c ma więcej niż dwie cyfry po kropce. Kupujesz n śrubek. Kasa A najpierw zaokrągla cenę jednej śrubki do groszy, a potem mnoży ją przez n. Kasa B mnoży dokładną cenę przez n i dopiero wynik zaokrągla do groszy. Obie kasy zaokrąglają do najbliższego grosza. Dla każdego z t zakupów wypisz w jednym wierszu kwotę z kasy A, kwotę z kasy B (obie z dwiema cyframi po kropce) oraz różnicę B − A w groszach. Gwarantujemy, że żadne zaokrąglenie nie trafia dokładnie w połowę grosza.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy cena c (3 lub 4 cyfry po kropce) i liczba całkowita n.'],
            output_format: ['t wierszy, w każdym dwie kwoty i różnica w groszach.'],
            constraints: ['1 ≤ t ≤ 1000', '0 < c ≤ 100', '1 ≤ n ≤ 10 000'],
            examples: [{ input: '2\n0.334 3\n1.2345 7', note: 'Pierwszy zakup — kasa A: 0.33 · 3 = 0.99, kasa B: 1.002 → 1.00, różnica 1 grosz. Drugi — A: 1.23 · 7 = 8.61, B: 8.6415 → 8.64.' }],
            hint: R`A: round(c * 100) / 100 * n. B: round(c * n * 100) / 100. Różnicę w groszach najlepiej policzyć na liczbach całkowitych: llround(b * 100) - llround(a * 100).`,
            tests: (r) => {
                const jedna = () => {
                    for (;;) {
                        const d = r.int(3, 4), C = r.big(1, 100n * P10(d)) * P10(4 - d), n = B(r() < 0.5 ? r.int(1, 30) : r.int(1, 10000));
                        if (C % 100n === 50n || (C * n) % 100n === 50n || C % 100n === 0n) continue;
                        return `${stale(C / P10(4 - d), d)} ${n}`;
                    }
                };
                return ['1\n0.001 1', '1\n99.9999 10000', '1\n0.004 10000', '2\n0.336 3\n0.3349 3', wiersze(Array.from({ length: 30 }, jedna)), wiersze(Array.from({ length: 1000 }, jedna))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => {
                const [c, n] = toks(w); const C = jedn(c, 4), N = B(n);
                return /\.\d{3,4}$/.test(c) && C >= 1n && C <= 1000000n && N >= 1n && N <= 10000n && C % 100n !== 50n && (C * N) % 100n !== 50n;
            }) ? null : 'zakres albo połówka'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [c, n] = toks(w); const C = jedn(c, 4), N = B(n);
                const a = rdivUp(C, 100n) * N, b = rdivUp(C * N, 100n);
                return `${stale(a, 2)} ${stale(b, 2)} ${b - a}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    cout << fixed << setprecision(2);
    for (int i = 0; i < t; i++) {
        double c;
        int n;
        cin >> c >> n;
        double a = round(c * 100) / 100 * n;
        double b = round(c * n * 100) / 100;
        cout << a << " " << b << " " << llround(b * 100) - llround(a * 100) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-czas-biegu', krok: 7, level: 'srednie',
            title: 'Wyniki biegu',
            short: 'Czasy z fotokomórki obcinamy do setnych. Kto wygrał?',
            tags: ['floor(x * 100) / 100', 'rekord z remisami'],
            statement: ['Fotokomórka mierzy czasy biegaczy z dokładnością do tysięcznych części sekundy (ostatnia cyfra nigdy nie jest zerem), ale regulamin każe podawać wyniki z dokładnością do setnych — obcinając, czyli zaokrąglając w dół. Wypisz oficjalne wyniki n biegaczy (z dwiema cyframi po kropce) w kolejności z wejścia, każdy w osobnym wierszu, a w ostatnim wierszu — numer zwycięzcy. Wygrywa najmniejszy oficjalny wynik; przy remisie wygrywa biegacz z mniejszym czasem z fotokomórki. Czasy z fotokomórki są różne. Biegaczy numerujemy od 1.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n czasów w sekundach, każdy z dokładnie trzema cyframi po kropce.'],
            output_format: ['n wierszy z oficjalnymi wynikami i jeden wiersz z numerem zwycięzcy.'],
            constraints: ['1 ≤ n ≤ 1000', '9 < czas < 100'],
            examples: [{ input: '4\n10.347 10.341 10.359 9.999', note: 'Oficjalnie: 10.34, 10.34, 10.35 i 9.99 — wygrywa czwarty biegacz.' }, { input: '3\n10.347 10.341 10.359', note: 'Dwóch biegaczy ma oficjalnie 10.34, ale fotokomórka wskazuje drugiego.' }],
            hint: R`Oficjalny wynik to floor(czas * 100) / 100. Zwycięzcę szukasz jak rekord z lekcji o max i min: porównujesz oficjalne wyniki, a przy remisie — czasy z fotokomórki. Oficjalne wyniki wygodnie porównywać jako liczby całkowite setnych: (long long)floor(czas * 100).`,
            tests: (r) => {
                const zestaw = (n, lo, hi) => {
                    const s = new Set();
                    while (s.size < n) { const k = r.int(lo, hi); if (k % 10 !== 0) s.add(k); }
                    return fmt([...s].map((k) => stale(B(k), 3)));
                };
                return ['1\n9.001', '1\n99.999', '2\n10.001 10.009', '2\n10.009 10.001', zestaw(10, 10000, 10100), zestaw(100, 9001, 12000), zestaw(1000, 9001, 99999)];
            },
            check: (inp) => {
                const v = lista(inp).v;
                const ok = v.every((s) => /^\d+\.\d\d[1-9]$/.test(s) && zakres(9001, 99999)(jedn(s, 3)));
                return ok && new Set(v).size === v.length ? null : 'zakres';
            },
            solve: (inp) => {
                const v = lista(inp).v.map((s) => jedn(s, 3)), off = v.map((k) => k / 10n);
                let best = 0;
                v.forEach((k, i) => { if (off[i] < off[best] || (off[i] === off[best] && k < v[best])) best = i; });
                return `${off.map((x) => stale(x, 2)).join('\n')}\n${best + 1}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int zwyciezca = 0;
    long long najlepszy = 0;
    double najlepszyCzas = 0;
    cout << fixed << setprecision(2);
    for (int i = 1; i <= n; i++) {
        double czas;
        cin >> czas;
        long long setne = (long long)floor(czas * 100);
        cout << setne / 100.0 << "\n";
        if (i == 1 || setne < najlepszy || (setne == najlepszy && czas < najlepszyCzas)) {
            najlepszy = setne;
            najlepszyCzas = czas;
            zwyciezca = i;
        }
    }
    cout << zwyciezca << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · pułapki liczb z przecinkiem
        {
            id: 'zao-grosze', krok: 8, level: 'latwe',
            title: 'Złote na grosze',
            short: 'Suma cen z paragonu w groszach — tam, gdzie (int)(x * 100) się myli.',
            tags: ['llround(x * 100)', 'long long', '/ 100 i % 100'],
            statement: ['Na paragonie jest n cen w złotych, każda z co najwyżej dwiema cyframi po kropce. W pierwszym wierszu wypisz sumę wszystkich cen w groszach, a w drugim — tę samą sumę w postaci „X zl Y gr”.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n cen.'],
            output_format: ['Dwa wiersze: suma w groszach i suma w postaci X zl Y gr.'],
            constraints: ['1 ≤ n ≤ 1000', '0.01 ≤ każda cena ≤ 100 000'],
            examples: [{ input: '3\n0.29 0.57 1.15', note: 'Razem 29 + 57 + 115 = 201 groszy. Rzutowanie (int)(cena * 100) dałoby 28 + 56 + 114 = 198.' }],
            hint: R`Zamień każdą cenę na grosze przez llround(cena * 100) — nigdy (int)(cena * 100), bo dla 0.29 wyjdzie 28. Sumuj grosze w long long. Złote to suma / 100, a grosze — suma % 100.`,
            tests: (r) => {
                const zdradliwa = () => { for (;;) { const k = r.int(1, 10000000), s = napis(B(k), 2); if (Math.trunc(Number(s) * 100) !== k) return s; } };
                const cena = () => (r() < 0.5 ? zdradliwa() : losowa(r, 1, 10000000, 2).s);
                return ['1\n0.01', '1\n100000', '1\n4.35', '4\n0.1 0.2 0.3 0.4', fmt(Array.from({ length: 10 }, zdradliwa)), fmt(Array.from({ length: 100 }, cena)), fmt(Array.from({ length: 1000 }, cena))];
            },
            check: (inp) => (lista(inp).v.every((s) => zakres(1, 10000000)(jedn(s, 2))) ? null : 'zakres'),
            solve: (inp) => { const s = lista(inp).v.reduce((a, x) => a + jedn(x, 2), 0n); return `${s}\n${s / 100n} zl ${s % 100n} gr`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        double cena;
        cin >> cena;
        suma += llround(cena * 100);
    }
    cout << suma << "\n" << suma / 100 << " zl " << suma % 100 << " gr\n";
    return 0;
}`,
        },
        {
            id: 'zao-czy-rowne', krok: 8, level: 'latwe',
            title: 'Czy się zgadza?',
            short: 'Czy a + b = c? Znak == zawodzi już dla 0.1 + 0.2.',
            tags: ['epsilon', 'abs(a - b) < 1e-9', 'porównywanie double'],
            statement: ['Dla każdego z t zapytań dostajesz trzy liczby a, b i c, każdą z co najwyżej dwiema cyframi po kropce (mogą być ujemne). Wypisz TAK, jeśli a + b = c (w zwykłej matematyce, na kartce), albo NIE w przeciwnym razie.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy trzy liczby a, b i c.'],
            output_format: ['t wierszy, w każdym TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 1000', '−10 000 ≤ a, b, c ≤ 10 000'],
            examples: [{ input: '3\n0.1 0.2 0.3\n0.5 0.25 0.75\n1.1 2.2 3.4', note: 'W C++ 0.1 + 0.2 == 0.3 to fałsz, a przecież na kartce wszystko się zgadza.' }],
            hint: R`Porównanie a + b == c zawiedzie już dla 0.1, 0.2 i 0.3. Porównuj z epsilonem: abs(a + b - c) < 1e-9. Albo zamień wszystkie liczby na setne części przez llround(x * 100) i porównuj liczby całkowite.`,
            tests: (r) => {
                const q = () => {
                    for (;;) {
                        const a = losowa(r, -500000, 500000, 2), b = losowa(r, -500000, 500000, 2);
                        if (r() < 0.55) {
                            const c = a.k + b.k, cs = napis(c, 2);
                            if (Number(a.s) + Number(b.s) === Number(cs) && r() < 0.7) continue;   // wolimy zdradliwe przypadki
                            return `${a.s} ${b.s} ${cs}`;
                        }
                        const c = a.k + b.k + B((r() < 0.5 ? -1 : 1) * r.int(1, 5));
                        if (c >= -1000000n && c <= 1000000n) return `${a.s} ${b.s} ${napis(c, 2)}`;
                    }
                };
                return ['1\n0 0 0', '1\n0.1 0.2 0.3', '1\n0.1 0.2 0.31', '2\n-0.1 -0.2 -0.3\n10000 -10000 0', '3\n0.7 0.1 0.8\n0.3 0.6 0.9\n1.1 2.2 3.3', wiersze(Array.from({ length: 50 }, q)), wiersze(Array.from({ length: 1000 }, q))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => toks(w).every((s) => zakres(-1000000, 1000000)(jedn(s, 2)))) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => { const [a, b, c] = toks(w).map((s) => jedn(s, 2)); return a + b === c ? 'TAK' : 'NIE'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        double a, b, c;
        cin >> a >> b >> c;
        if (abs(a + b - c) < 1e-9) cout << "TAK\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-rachunek', krok: 8, level: 'srednie',
            title: 'Rachunek po równo',
            short: 'Każdy płaci tyle samo, w górę do grosza. Policz w groszach, nie w złotych.',
            tags: ['llround(x * 100)', '(g + n - 1) / n', 'setw i setfill'],
            statement: ['Rachunek w restauracji wynosi R złotych. Płaci n osób, każda tyle samo: kwotę zaokrągloną w górę do pełnego grosza, tak żeby razem zapłacić co najmniej R. Dla każdego z t rachunków wypisz w jednym wierszu, ile płaci każda osoba (w złotych, z dwiema cyframi po kropce), i ile groszy napiwku zostawią razem (ile zapłacą ponad rachunek).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy kwota R (z co najwyżej dwiema cyframi po kropce) i liczba osób n.'],
            output_format: ['t wierszy, w każdym kwota od osoby i napiwek w groszach.'],
            constraints: ['1 ≤ t ≤ 1000', '0.01 ≤ R ≤ 1 000 000', '1 ≤ n ≤ 1000'],
            examples: [{ input: '3\n100 3\n1.10 1\n0.07 2', note: 'Dla 1.10 zł i jednej osoby wersja ceil(R / n * 100) na double daje 1.11 — bo 1.10 · 100 to w pamięci 110.00000000000001.' }],
            hint: R`Zamień rachunek na grosze: long long g = llround(R * 100);. Każdy płaci (g + n - 1) / n groszy — dzielenie w górę na liczbach całkowitych. Wypisz to jako złote: kazdy / 100, kropka i kazdy % 100 z setw(2) i setfill('0'). Napiwek to kazdy * n - g.`,
            tests: (r) => {
                const q = () => {
                    for (;;) {
                        const n = r.int(1, r() < 0.5 ? 10 : 1000);
                        const g = r() < 0.6 ? B(n) * B(r.int(1, Math.floor(100000000 / n))) : B(r.int(1, 100000000));
                        const s = r() < 0.5 ? napis(g, 2) : stale(g, 2), each = cdiv(g, B(n));
                        const naiwnie = Math.ceil(Number(s) / n * 100);
                        if (naiwnie === Number(each) && r() < 0.6) continue;   // wolimy przypadki, na których double się myli
                        return `${s} ${n}`;
                    }
                };
                return ['1\n0.01 1', '1\n0.01 1000', '1\n1000000 1', '1\n1000000 1000', '2\n0.07 7\n0.29 1', wiersze(Array.from({ length: 50 }, q)), wiersze(Array.from({ length: 1000 }, q))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [R2, n] = toks(w); return zakres(1, 100000000)(jedn(R2, 2)) && +n >= 1 && +n <= 1000; }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [R2, n] = toks(w); const g = jedn(R2, 2), N = B(n), k = cdiv(g, N);
                return `${stale(k, 2)} ${k * N - g}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        double R;
        long long n;
        cin >> R >> n;
        long long g = llround(R * 100);
        long long kazdy = (g + n - 1) / n;
        cout << kazdy / 100 << "." << setw(2) << setfill('0') << kazdy % 100 << " " << kazdy * n - g << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-worki-maki', krok: 8, level: 'srednie',
            title: 'Worki mąki',
            short: 'Ile worków kupić? ceil(x / y) myli się dla 1.1 i 0.1 — policz w gramach.',
            tags: ['llround(x * 1000)', 'dzielenie w górę', 'epsilon'],
            statement: ['Piekarnia potrzebuje x kg mąki, a mąkę sprzedaje się w workach po y kg. Dla każdego z t zamówień wypisz, ile najmniej worków trzeba kupić. Obie liczby mają co najwyżej trzy cyfry po kropce.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczby x i y.'],
            output_format: ['t wierszy z liczbami worków.'],
            constraints: ['1 ≤ t ≤ 1000', '0 < x ≤ 10 000', '0.1 ≤ y ≤ 100'],
            examples: [{ input: '3\n1.1 0.1\n0.9 0.3\n12.5 4', note: '1.1 / 0.1 to w pamięci 11.000000000000002, więc ceil daje 12 zamiast 11.' }],
            hint: R`ceil(x / y) zawiedzie, gdy x dzieli się przez y bez reszty, ale komputer policzy iloraz odrobinę za duży. Zamień obie liczby na gramy: llround(x * 1000) i llround(y * 1000), a potem podziel w górę na liczbach całkowitych. (Działa też epsilon: ceil(x / y - 1e-9).)`,
            tests: (r) => {
                const q = () => {
                    for (;;) {
                        const Y = B(r.int(100, 100000));
                        const X = r() < 0.6 ? Y * B(r.int(1, Math.max(1, Math.floor(10000000 / Number(Y))))) : B(r.int(1, 10000000));
                        if (X > 10000000n) continue;
                        const xs = napis(X, 3), ys = napis(Y, 3), ok = cdiv(X, Y);
                        if (Math.ceil(Number(xs) / Number(ys)) === Number(ok) && r() < 0.6) continue;
                        return `${xs} ${ys}`;
                    }
                };
                return ['1\n0.001 0.1', '1\n10000 0.1', '1\n10000 100', '3\n0.3 0.1\n0.7 0.1\n0.6 0.2', wiersze(Array.from({ length: 50 }, q)), wiersze(Array.from({ length: 1000 }, q))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [x, y] = toks(w).map((s) => jedn(s, 3)); return x >= 1n && x <= 10000000n && y >= 100n && y <= 100000n; }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => { const [x, y] = toks(w).map((s) => jedn(s, 3)); return String(cdiv(x, y)); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        double x, y;
        cin >> x >> y;
        long long gx = llround(x * 1000), gy = llround(y * 1000);
        cout << (gx + gy - 1) / gy << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-pierwiastek', krok: 8, level: 'srednie',
            title: 'Pierwiastek całkowity',
            short: 'Największe k, dla którego k · k ≤ n — dla n aż do 10¹⁸.',
            tags: ['sqrt', 'poprawka pętlą', 'long long'],
            statement: ['Dla każdej z t liczb n wypisz jej pierwiastek całkowity — największą liczbę całkowitą k, dla której k · k ≤ n.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczba całkowita n.'],
            output_format: ['t wierszy z pierwiastkami całkowitymi.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n20\n16\n0\n999999999999999999', note: 'Dla ostatniej liczby (long long)sqrt(n) daje 1000000000, a 10⁹ · 10⁹ = 10¹⁸ jest już większe od n.' }],
            hint: R`Zacznij od long long k = sqrt(n); — to tylko przybliżenie. Popraw je dwiema pętlami: while (k * k > n) k--; i while ((k + 1) * (k + 1) <= n) k++;. Samo (long long)sqrt(n) myli się dla dużych n.`,
            tests: (r) => {
                const zdradliwa = () => { for (;;) { const k = r.big(10000000, 1000000000), d = B(r.int(-2, 2)), n = k * k + d; if (n < 0n || n > 10n ** 18n) continue; if (BigInt(Math.floor(Math.sqrt(Number(n)))) !== isqrt(n)) return String(n); } };
                const dowolna = () => String(r.big(0, '1000000000000000000'));
                return ['1\n0', '1\n1', '5\n2\n3\n4\n8\n9', '1\n1000000000000000000', '1\n999999999999999999', '2\n999999998000000001\n999999998000000000',
                    wiersze(Array.from({ length: 20 }, zdradliwa)), wiersze(Array.from({ length: 1000 }, () => (r() < 0.5 ? zdradliwa() : dowolna())))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => zakres(0, '1000000000000000000')(w.trim())) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => String(isqrt(B(w.trim())))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long n;
        cin >> n;
        long long k = sqrt(n);
        while (k * k > n) k--;
        while ((k + 1) * (k + 1) <= n) k++;
        cout << k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-kwadraty-w-przedziale', krok: 8, level: 'srednie',
            title: 'Ile kwadratów?',
            short: 'Ile kwadratów liczb całkowitych leży między a i b? Dwa pierwiastki całkowite.',
            tags: ['pierwiastek całkowity', 'od 1 do b minus od 1 do a − 1'],
            statement: ['Kwadraty liczb całkowitych to 0, 1, 4, 9, 16, 25, … Dla każdego z t zapytań a, b wypisz, ile takich kwadratów leży w przedziale od a do b (włącznie).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczby całkowite a i b.'],
            output_format: ['t wierszy z odpowiedziami.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a ≤ b ≤ 10¹⁸'],
            examples: [{ input: '3\n1 10\n10 20\n16 16', note: 'Od 1 do 10 są kwadraty 1, 4 i 9.' }],
            hint: R`Kwadratów od 1 do b jest dokładnie tyle, ile wynosi pierwiastek całkowity z b (to 1², 2², …, k²). Odejmij te od 1 do a − 1: isqrt(b) − isqrt(a − 1). Pierwiastek całkowity licz z poprawką pętlą, tak jak w poprzednim zadaniu — dwa razy, raz dla b i raz dla a − 1.`,
            tests: (r) => {
                const q = () => { let a = r.big(1, '1000000000000000000'), b = r.big(1, '1000000000000000000'); if (a > b) [a, b] = [b, a]; return `${a} ${b}`; };
                const kw = () => { const k = r.big(1, 1000000000); const a = k * k + B(r.int(-1, 1)), b = a + B(r.int(0, 3)) * k; return a >= 1n && b <= 10n ** 18n ? `${a} ${b}` : '1 1'; };
                const m = () => { const a = r.int(1, 300), b = r.int(a, 400); return `${a} ${b}`; };
                return ['1\n1 1', '1\n2 3', '1\n1 1000000000000000000', '1\n999999999999999999 1000000000000000000', '1\n999999998000000001 999999998000000001',
                    wiersze(Array.from({ length: 40 }, m)), wiersze(Array.from({ length: 1000 }, () => { const x = r(); return x < 0.4 ? q() : x < 0.8 ? kw() : m(); }))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [a, b] = toks(w).map(B); return a >= 1n && a <= b && b <= 10n ** 18n; }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => { const [a, b] = toks(w).map(B); return String(isqrt(b) - isqrt(a - 1n)); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, b;
        cin >> a >> b;
        long long kb = sqrt(b);
        while (kb * kb > b) kb--;
        while ((kb + 1) * (kb + 1) <= b) kb++;
        long long n = a - 1;
        long long ka = sqrt(n);
        while (ka * ka > n) ka--;
        while ((ka + 1) * (ka + 1) <= n) ka++;
        cout << kb - ka << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-vat', krok: 8, level: 'srednie',
            title: 'VAT w groszach',
            short: 'Podatek od każdej pozycji faktury, zaokrąglony do grosza — na liczbach całkowitych.',
            tags: ['(cena * stawka + 50) / 100', 'grosze', 'setw i setfill'],
            statement: ['Na fakturze jest n pozycji. Dla każdej znasz cenę netto w groszach i stawkę VAT w procentach. VAT od pozycji to cena · stawka / 100, zaokrąglone do najbliższego grosza (połówki w górę). Wypisz VAT każdej pozycji w groszach (każdy w osobnym wierszu), a w ostatnim wierszu — sumę VAT w złotych, z dwiema cyframi po kropce.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy cena w groszach i stawka.'],
            output_format: ['n wierszy z VAT w groszach i jeden wiersz z sumą w złotych.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ cena ≤ 10⁹', 'stawka to 0, 5, 8 albo 23'],
            examples: [{ input: '3\n1050 23\n999 8\n2 23', note: '1050 · 23 / 100 = 241.5 — połówka, więc 242 grosze. 999 · 8 / 100 = 79.92, czyli 80. 2 · 23 / 100 = 0.46, czyli 0. Razem 322 grosze, czyli 3.22 zł.' }],
            hint: R`Licz na liczbach całkowitych: (cena * stawka + 50) / 100 to zaokrąglenie do najbliższego grosza z połówkami w górę. Iloczyn może przekroczyć int — użyj long long. Sumę groszy wypisz jako złote: suma / 100, kropka i suma % 100 z setw(2) i setfill('0').`,
            tests: (r) => {
                const poz = (hi) => `${r.int(1, hi)} ${r.pick([0, 5, 8, 23])}`;
                return ['1\n1 0', '1\n1 23', '1\n1000000000 23', '2\n10 5\n50 5', '4\n100 23\n150 23\n250 8\n625 8', wiersze(Array.from({ length: 30 }, () => poz(5000))), wiersze(Array.from({ length: 1000 }, () => poz(r() < 0.5 ? 1000 : 1000000000)))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [c, s] = toks(w).map(Number); return c >= 1 && c <= 1e9 && [0, 5, 8, 23].includes(s); }) ? null : 'zakres'),
            solve: (inp) => {
                const v = linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => { const [c, s] = toks(w).map(B); return rdivUp(c * s, 100n); });
                return `${v.join('\n')}\n${stale(v.reduce((a, b) => a + b, 0n), 2)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        long long cena, stawka;
        cin >> cena >> stawka;
        long long vat = (cena * stawka + 50) / 100;
        cout << vat << "\n";
        suma += vat;
    }
    cout << suma / 100 << "." << setw(2) << setfill('0') << suma % 100 << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-dokladny-iloraz', krok: 8, level: 'trudne',
            title: 'Dokładny iloraz',
            short: 'a / b z dwoma miejscami po przecinku dla a do 10¹⁸ — bez double.',
            tags: ['iloraz i reszta', 'setne do najbliższej', 'przeniesienie'],
            statement: ['Dla każdej z t par liczb całkowitych a i b wypisz iloraz a / b z dokładnie dwiema cyframi po kropce, zaokrąglony do najbliższej setnej części (połówki w górę). Liczby a są ogromne — typ double nie pomieści ich dokładnie.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczby całkowite a i b.'],
            output_format: ['t wierszy z ilorazami.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ a ≤ 10¹⁸', '1 ≤ b ≤ 10⁹'],
            examples: [{ input: '4\n7 2\n1 8\n999999999999999999 3\n2 3', note: '1 / 8 = 0.125 — połówka setnej, więc 0.13. Wersja z double wypisałaby dla trzeciej pary 333333333333333312.00.' }],
            hint: R`Część całkowita to q = a / b, a reszta r = a % b. Setne części to r · 100 / b zaokrąglone do najbliższej: s = (r * 200 + b) / (2 * b). Jeśli s wyjdzie 100, przenieś jedynkę do części całkowitej (q++, s = 0). Wypisz q, kropkę i s z setw(2) i setfill('0'). r · 200 < 2 · 10¹¹ — mieści się w long long.`,
            tests: (r) => {
                const q = () => `${r.big(0, '1000000000000000000')} ${r.int(1, 1000000000)}`;
                const m = () => `${r.int(0, 1000)} ${r.int(1, 64)}`;
                return ['1\n0 1', '1\n1 1', '1\n1000000000000000000 1', '1\n1000000000000000000 1000000000', '1\n199 200', '1\n1999 2000', '3\n1 200\n1 201\n1 199',
                    wiersze(Array.from({ length: 40 }, m)), wiersze(Array.from({ length: 1000 }, () => (r() < 0.5 ? q() : m())))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [a, b] = toks(w); return zakres(0, '1000000000000000000')(a) && zakres(1, 1000000000)(b); }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => { const [a, b] = toks(w).map(B); return stale(rdivUp(a * 100n, b), 2); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, b;
        cin >> a >> b;
        long long q = a / b, r = a % b;
        long long s = (r * 200 + b) / (2 * b);
        if (s == 100) {
            q++;
            s = 0;
        }
        cout << q << "." << setw(2) << setfill('0') << s << "\n";
    }
    return 0;
}`,
        },
    ];
};
