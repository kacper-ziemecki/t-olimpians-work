// Zaokrąglanie — ćwiczenia w trakcie lekcji, części 4–6: ucinanie (int) i trunc, cztery sposoby obok siebie,
// dzielenie w dół z minusem (tygodnie, kratki, szachownica, cofanie zegara), dzielenie w górę i do najbliższej
// na liczbach całkowitych (autobusy, wytłaczanki, strony, wielkie liczby, procenty) oraz zaokrąglanie do
// dziesiątek, kwadransów i dowolnych wielokrotności.
// Oczekiwane wyniki liczymy dokładnie (BigInt, zaokraglanie-pomoc.js).
module.exports = (h) => {
    const { toks } = h;
    const { jedn, napis, fdiv, cdiv, rdivUp, rdivAway, tdiv, losowa } = require('./zaokraglanie-pomoc');
    const R = String.raw;
    const B = BigInt;
    const linie = (inp) => inp.replace(/\r/g, '').split('\n');
    const lista = (inp) => { const t = toks(inp); return { n: Number(t[0]), v: t.slice(1, 1 + Number(t[0])) }; };
    const zakres = (lo, hi) => (v) => B(v) >= B(lo) && B(v) <= B(hi);
    const pad2 = (x) => String(x).padStart(2, '0');
    const losowe = (r, n, lo, hi, d) => Array.from({ length: n }, () => losowa(r, lo, hi, d).s);
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const wiersze = (a) => `${a.length}\n${a.join('\n')}`;
    const DNI = ['poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek', 'sobota', 'niedziela'];
    const zegar = (r) => `${pad2(r.int(0, 23))}:${pad2(r.int(0, 59))}`;

    return [
        // ================================================================ KROK 4 · ucinanie i liczby ujemne
        {
            id: 'zao-cztery-sposoby', krok: 4, level: 'latwe',
            title: 'Cztery sposoby',
            short: 'floor, ceil, round i (int) jednej liczby — każdy w osobnym wierszu.',
            tags: ['floor', 'ceil', 'llround', '(long long)x'],
            statement: ['Wczytaj liczbę x (może być ujemna). Wypisz w czterech wierszach: zaokrąglenie w dół (floor), w górę (ceil), do najbliższej (jak round — połówki dalej od zera) i ucięcie części ułamkowej (jak (int) — w stronę zera). Wszystkie wyniki wypisz jako liczby całkowite.'],
            input_format: ['Jedna liczba x.'],
            output_format: ['Cztery wiersze, w każdym jedna liczba całkowita.'],
            constraints: ['−10⁹ ≤ x ≤ 10⁹', 'x ma co najwyżej trzy cyfry po kropce'],
            examples: [{ input: '-2.5' }, { input: '2.7' }, { input: '-0.4', note: 'Trzy z czterech wyników to zero — wypisz 0, a nie -0.' }],
            hint: R`(long long)floor(x), (long long)ceil(x), llround(x) i (long long)x. Liczby takie jak −0.4 to pułapka: ceil, round i trunc dają tam „zero z minusem”, które po zamianie na long long staje się zwykłym 0.`,
            tests: (r) => ['0', '0.5', '-0.5', '-0.001', '1000000000', '-1000000000', '-999999999.999', '999999999.5', '-123.456', '7', ...losowe(r, 6, -1000000000000, 1000000000000, 3)],
            check: (inp) => (zakres(-1000000000000, 1000000000000)(jedn(inp, 3)) ? null : 'zakres'),
            solve: (inp) => { const k = jedn(inp, 3); return [fdiv(k, 1000n), cdiv(k, 1000n), rdivAway(k, 1000n), tdiv(k, 1000n)].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    double x;
    cin >> x;
    cout << (long long)floor(x) << "\n";
    cout << (long long)ceil(x) << "\n";
    cout << llround(x) << "\n";
    cout << (long long)x << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-kiedy-rozne', krok: 4, level: 'latwe',
            title: 'Kiedy (int) się myli?',
            short: 'Dla ilu liczb ucięcie (int) daje co innego niż floor?',
            tags: ['(int) a floor', 'liczby ujemne', 'licznik'],
            statement: ['Twój kolega zaokrągla „w dół” rzutowaniem (int). Dla podanych n liczb policz, dla ilu z nich jego wynik jest inny niż prawdziwe zaokrąglenie w dół (floor).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jedna liczba całkowita.'],
            constraints: ['1 ≤ n ≤ 1000', '−1 000 000 ≤ każda liczba ≤ 1 000 000', 'każda liczba ma co najwyżej trzy cyfry po kropce'],
            examples: [{ input: '6\n2.5 -2.5 -3 0.1 -0.1 -7.25', note: 'Różnią się dla −2.5 (−2 i −3), −0.1 (0 i −1) i −7.25 (−7 i −8).' }],
            hint: R`Porównaj (long long)x z (long long)floor(x) i licz różnice. Zastanów się też, dla jakich liczb to się zdarza — dla dodatnich nigdy, a dla ujemnych tylko wtedy, gdy mają coś po kropce.`,
            tests: (r) => ['1\n0', '1\n-0.001', '1\n-5', '3\n1 2 3', '3\n-1.5 -2.5 -3.5', fmt(losowe(r, 30, -1000000000, 1000000000, 3)),
                fmt(Array.from({ length: 1000 }, () => (r() < 0.2 ? String(r.int(-1000000, 1000000)) : losowa(r, -1000000000, 1000000000, 3).s)))],
            check: (inp) => (lista(inp).v.every((s) => zakres(-1000000000, 1000000000)(jedn(s, 3))) ? null : 'zakres'),
            solve: (inp) => String(lista(inp).v.filter((s) => { const k = jedn(s, 3); return k < 0n && k % 1000n !== 0n; }).length),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    int rozne = 0;
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        if ((long long)x != (long long)floor(x)) rozne++;
    }
    cout << rozne << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-dzielenie-w-dol', krok: 4, level: 'srednie',
            title: 'Dzielenie w dół z minusem',
            short: 'Iloraz zaokrąglony w dół i reszta od 0 do b − 1 — także dla ogromnych ujemnych a.',
            tags: ['a / b i a % b', 'poprawka dla ujemnych', 'long long'],
            statement: ['Dla każdej z t par liczb całkowitych a i b (b > 0, a może być ujemne) wypisz iloraz a / b zaokrąglony w dół oraz resztę r = a − b · iloraz. Taka reszta jest zawsze liczbą od 0 do b − 1.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy dwie liczby całkowite a i b.'],
            output_format: ['t wierszy, w każdym iloraz i reszta.'],
            constraints: ['1 ≤ t ≤ 500', '−10¹⁸ ≤ a ≤ 10¹⁸', '1 ≤ b ≤ 10⁹'],
            examples: [{ input: '4\n-7 2\n7 2\n-8 7\n-14 7', note: '−7 / 2 = −3.5, w dół to −4, a reszta −7 − 2 · (−4) = 1.' }],
            hint: R`Zacznij od q = a / b — to ucina w stronę zera. Jeśli reszta a % b jest ujemna, ucięcie poszło w górę, więc zmniejsz q o jeden. Resztę policz jako a - b * q. Liczby są ogromne: wszystko w long long, a double by tu zawiodło.`,
            tests: (r) => {
                const para = () => `${r.big('-1000000000000000000', '1000000000000000000')} ${r.int(1, 1000000000)}`;
                const mala = () => `${r.int(-1000, 1000)} ${r.int(1, 20)}`;
                return ['1\n0 1', '1\n-1 1000000000', '1\n-1000000000000000000 1', '1\n-1000000000000000000 999999999', '2\n1000000000000000000 7\n-1000000000000000000 7',
                    '3\n-6 3\n-5 3\n-4 3', wiersze(Array.from({ length: 30 }, mala)), wiersze(Array.from({ length: 500 }, () => (r() < 0.5 ? para() : mala())))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [a, b] = toks(w); return zakres('-1000000000000000000', '1000000000000000000')(a) && zakres(1, 1000000000)(b); }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [a, b] = toks(w).map(B);
                const q = fdiv(a, b);
                return `${q} ${a - b * q}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, b;
        cin >> a >> b;
        long long q = a / b;
        if (a % b < 0) q--;
        long long r = a - b * q;
        cout << q << " " << r << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-tydzien', krok: 4, level: 'srednie',
            title: 'Który tydzień?',
            short: 'Numer tygodnia i dzień tygodnia dla dni o ujemnych numerach.',
            tags: ['dzielenie w dół', 'reszta 0..6', 'tablica napisów'],
            statement: ['Dni numerujemy liczbami całkowitymi: dzień 0 to poniedziałek, dzień 1 — wtorek, …, dzień 6 — niedziela, dzień 7 — znowu poniedziałek, a dzień −1 to niedziela przed dniem 0. Tydzień 0 to dni od 0 do 6, tydzień 1 — dni od 7 do 13, a tydzień −1 — dni od −7 do −1. Dla każdego z n dni wypisz numer tygodnia i nazwę dnia tygodnia (bez polskich znaków: poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n numerów dni.'],
            output_format: ['n wierszy, w każdym numer tygodnia i nazwa dnia.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ numer dnia ≤ 10⁹'],
            examples: [{ input: '4\n-1 0 13 -8', note: 'Dzień −8 to niedziela z tygodnia −2: tydzień −2 to dni od −14 do −8.' }],
            hint: R`Numer tygodnia to d / 7 zaokrąglone w dół: tydzien = d / 7, a jeśli d % 7 < 0, to tydzien--. Numer dnia tygodnia to d - 7 * tydzien — zawsze od 0 do 6. Nazwy trzymaj w tablicy napisów: string dni[7] = {"poniedzialek", …};.`,
            tests: (r) => ['1\n0', '1\n-1', '1\n-7', '1\n1000000000', '1\n-1000000000', '7\n-1 -2 -3 -4 -5 -6 -7', fmt(Array.from({ length: 30 }, () => r.int(-30, 30))), fmt(Array.from({ length: 1000 }, () => r.int(-1000000000, 1000000000)))],
            check: (inp) => (lista(inp).v.every(zakres(-1000000000, 1000000000)) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => { const d = B(s), w = fdiv(d, 7n); return `${w} ${DNI[Number(d - 7n * w)]}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string dni[7] = {"poniedzialek", "wtorek", "sroda", "czwartek", "piatek", "sobota", "niedziela"};
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        long long d;
        cin >> d;
        long long tydzien = d / 7;
        if (d % 7 < 0) tydzien--;
        cout << tydzien << " " << dni[d - 7 * tydzien] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-kratka', krok: 4, level: 'latwe',
            title: 'W której kratce?',
            short: 'Numer kratki, w której leży punkt — także na minusach.',
            tags: ['floor', 'współrzędne', 'liczby ujemne'],
            statement: ['Plansza jest podzielona na kwadratowe kratki o boku 1. Kratka (i, j) to wszystkie punkty (x, y), dla których i ≤ x < i + 1 oraz j ≤ y < j + 1. Dla każdego z n punktów wypisz numer kratki, w której leży.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby x i y.'],
            output_format: ['n wierszy, w każdym dwie liczby całkowite — numer kratki.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁶ ≤ x, y ≤ 10⁶', 'współrzędne mają co najwyżej dwie cyfry po kropce'],
            examples: [{ input: '3\n-0.5 2.3\n3.7 -1.2\n2 -3', note: 'Punkt (2, −3) leży na rogu — należy do kratki (2, −3), bo i ≤ x i j ≤ y.' }],
            hint: R`Numer kratki to zaokrąglenie obu współrzędnych w dół: (long long)floor(x) i (long long)floor(y). Rzutowanie (int) pomyliłoby się dla współrzędnych ujemnych.`,
            tests: (r) => {
                const pkt = () => `${losowa(r, -100000000, 100000000, 2).s} ${losowa(r, -100000000, 100000000, 2).s}`;
                const blisko = () => `${losowa(r, -300, 300, 2).s} ${losowa(r, -300, 300, 2).s}`;
                return ['1\n0 0', '1\n-0.01 -0.01', '1\n-1000000 1000000', '2\n-1 -1\n-0.99 -0.99', wiersze(Array.from({ length: 30 }, blisko)), wiersze(Array.from({ length: 1000 }, () => (r() < 0.5 ? pkt() : blisko())))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => toks(w).every((s) => zakres(-100000000, 100000000)(jedn(s, 2)))) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => toks(w).map((s) => fdiv(jedn(s, 2), 100n)).join(' ')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        double x, y;
        cin >> x >> y;
        cout << (long long)floor(x) << " " << (long long)floor(y) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-szachownica', krok: 4, level: 'srednie',
            title: 'Kolor pola',
            short: 'Na nieskończonej szachownicy: białe czy czarne pole pod punktem?',
            tags: ['floor', 'parzystość', 'reszta z liczby ujemnej'],
            statement: ['Nieskończona szachownica składa się z kratek o boku 1, ponumerowanych tak jak w zadaniu „W której kratce?”: kratka (i, j) to punkty, dla których i ≤ x < i + 1 oraz j ≤ y < j + 1. Kratka (0, 0) jest biała, a kratki, które stykają się bokiem, mają różne kolory. Dla każdego z n punktów wypisz BIALE albo CZARNE — kolor kratki, w której leży punkt.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dwie liczby x i y.'],
            output_format: ['n wierszy, w każdym BIALE albo CZARNE.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁶ ≤ x, y ≤ 10⁶', 'współrzędne mają co najwyżej dwie cyfry po kropce'],
            examples: [{ input: '4\n0.5 0.5\n1.5 0.5\n-0.5 0.5\n-0.5 -0.5', note: 'Punkt (−0.5, 0.5) leży w kratce (−1, 0) — sąsiedniej dla kratki (0, 0), więc czarnej.' }],
            hint: R`Kratki (i, j) z parzystą sumą i + j są białe, a z nieparzystą — czarne. Numer kratki to (long long)floor(x) i (long long)floor(y). Uwaga: dla ujemnej sumy reszta s % 2 może wynosić −1, więc sprawdzaj s % 2 == 0, a nie s % 2 == 1.`,
            tests: (r) => {
                const pkt = () => `${losowa(r, -100000000, 100000000, 2).s} ${losowa(r, -100000000, 100000000, 2).s}`;
                const blisko = () => `${losowa(r, -500, 500, 2).s} ${losowa(r, -500, 500, 2).s}`;
                return ['1\n0 0', '1\n-1 0', '1\n-0.01 -0.01', '2\n-1000000 -999999.99\n999999.99 1000000', wiersze(Array.from({ length: 40 }, blisko)), wiersze(Array.from({ length: 1000 }, () => (r() < 0.5 ? pkt() : blisko())))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => toks(w).every((s) => zakres(-100000000, 100000000)(jedn(s, 2)))) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [x, y] = toks(w).map((s) => fdiv(jedn(s, 2), 100n));
                return (((x + y) % 2n) + 2n) % 2n === 0n ? 'BIALE' : 'CZARNE';
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        double x, y;
        cin >> x >> y;
        long long s = (long long)floor(x) + (long long)floor(y);
        if (s % 2 == 0) cout << "BIALE\n";
        else cout << "CZARNE\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-cofanie-zegara', krok: 4, level: 'srednie',
            title: 'Cofnij zegar',
            short: 'Cofamy czas o m minut. Który to dzień i która godzina?',
            tags: ['dzielenie w dół', 'hh:mm', 'setw i setfill'],
            statement: ['Jest dzień 0, godzina hh:mm. Cofamy czas o m minut. Dla każdego z t zapytań wypisz, który to będzie dzień (0 albo liczba ujemna: −1 to wczoraj, −2 to przedwczoraj) i jaka godzina, w formacie: dzień hh:mm.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy godzina w formacie hh:mm i liczba minut m.'],
            output_format: ['t wierszy, w każdym numer dnia i godzina w formacie hh:mm.'],
            constraints: ['1 ≤ t ≤ 1000', '00 ≤ hh ≤ 23, 00 ≤ mm ≤ 59', '0 ≤ m ≤ 10⁹'],
            examples: [{ input: '3\n00:10 20\n14:30 90\n05:00 2880', note: 'Cofając 00:10 o 20 minut, trafiamy na 23:50 poprzedniego dnia.' }],
            hint: R`Policz minuty od początku dnia 0: t = 60 * hh + mm - m (wynik może być ujemny). Dzień to t / 1440 zaokrąglone w dół — z poprawką, gdy reszta jest ujemna. Minuty w ciągu dnia to t - 1440 * dzien; z nich godzina (/ 60) i minuty (% 60). Wypisz je z setw(2) i setfill('0').`,
            tests: (r) => ['1\n00:00 0', '1\n00:00 1', '1\n23:59 0', '1\n00:00 1440', '1\n12:00 1000000000', '2\n00:01 1\n00:01 2',
                wiersze(Array.from({ length: 30 }, () => `${zegar(r)} ${r.int(0, 3000)}`)), wiersze(Array.from({ length: 1000 }, () => `${zegar(r)} ${r.int(0, 1000000000)}`))],
            check: (inp) => (linie(inp).slice(1).every((w) => /^([01]\d|2[0-3]):[0-5]\d \d+$/.test(w.trim()) && +w.trim().split(' ')[1] <= 1e9) ? null : 'format'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [g, m] = toks(w);
                const [hh, mm] = g.split(':').map(Number);
                const t = B(60 * hh + mm) - B(m), d = fdiv(t, 1440n), rr = Number(t - 1440n * d);
                return `${d} ${pad2(Math.floor(rr / 60))}:${pad2(rr % 60)}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        int hh, mm;
        char c;
        long long m;
        cin >> hh >> c >> mm >> m;
        long long czas = 60 * hh + mm - m;
        long long dzien = czas / 1440;
        if (czas % 1440 < 0) dzien--;
        long long reszta = czas - 1440 * dzien;
        cout << dzien << " " << setw(2) << setfill('0') << reszta / 60 << ":"
             << setw(2) << setfill('0') << reszta % 60 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-od-zera', krok: 4, level: 'srednie',
            title: 'W stronę zera i od zera',
            short: 'Dwa symetryczne zaokrąglenia: ucięcie i jego przeciwieństwo.',
            tags: ['(long long)x', 'ceil i floor', 'operator ?:'],
            statement: ['Dla każdej z n liczb wypisz w osobnym wierszu dwa zaokrąglenia: w stronę zera (ucięcie części ułamkowej) i od zera (dla liczb dodatnich w górę, dla ujemnych w dół). Liczby całkowite zostają bez zmian.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['n wierszy, w każdym dwie liczby całkowite.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹', 'każda liczba ma co najwyżej trzy cyfry po kropce'],
            examples: [{ input: '4\n2.3 -2.3 -0.5 7' }],
            hint: R`W stronę zera to (long long)x. Od zera: x >= 0 ? ceil(x) : floor(x) — wynik też zamień na long long. Sprawdź −0.5: w stronę zera daje 0, a od zera −1.`,
            tests: (r) => ['1\n0', '1\n-0.001', '1\n0.001', '2\n1000000000 -1000000000', '2\n-999999999.999 999999999.999', fmt(losowe(r, 30, -10000, 10000, 3)), fmt(losowe(r, 1000, -1000000000000, 1000000000000, 3))],
            check: (inp) => (lista(inp).v.every((s) => zakres(-1000000000000, 1000000000000)(jedn(s, 3))) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => { const k = jedn(s, 3); return `${tdiv(k, 1000n)} ${k >= 0n ? cdiv(k, 1000n) : fdiv(k, 1000n)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        double x;
        cin >> x;
        long long doZera = (long long)x;
        long long odZera = (x >= 0 ? ceil(x) : floor(x));
        cout << doZera << " " << odZera << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 5 · dzielenie w górę na liczbach całkowitych
        {
            id: 'zao-autobusy', krok: 5, level: 'latwe',
            title: 'Autobusy',
            short: 'Ile autobusów zamówić dla n osób? Dzielenie w górę bez ułamków.',
            tags: ['(n + k - 1) / k', 'long long'],
            statement: ['Na wycieczkę jedzie n osób, a jeden autobus ma k miejsc. Ile autobusów trzeba zamówić, żeby wszyscy pojechali? Jeśli nikt nie jedzie, nie zamawiamy żadnego autobusu.'],
            input_format: ['Jeden wiersz: liczby całkowite n i k.'],
            output_format: ['Jedna liczba — liczba autobusów.'],
            constraints: ['0 ≤ n ≤ 10⁹', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '50 12' }, { input: '48 12', note: '48 osób mieści się równo w 4 autobusach.' }, { input: '0 50' }],
            hint: R`Dzielenie w górę: (n + k - 1) / k. Uwaga: n + k - 1 może sięgać prawie 2 miliardów — więcej, niż mieści int. Wczytaj liczby do long long.`,
            tests: (r) => ['1 1', '1 1000000000', '1000000000 1', '1000000000 1000000000', '999999999 1000000000', '1000000000 999999999', '20 5', '21 5', '24 5', '25 5',
                ...Array.from({ length: 4 }, () => `${r.int(0, 1000)} ${r.int(1, 60)}`), ...Array.from({ length: 3 }, () => `${r.int(0, 1e9)} ${r.int(1, 1e9)}`)],
            check: (inp) => { const [n, k] = toks(inp).map(Number); return n >= 0 && n <= 1e9 && k >= 1 && k <= 1e9 ? null : 'zakres'; },
            solve: (inp) => { const [n, k] = toks(inp).map(B); return String(cdiv(n, k)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    cout << (n + k - 1) / k << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-wytlaczanki', krok: 5, level: 'latwe',
            title: 'Wytłaczanki na jajka',
            short: 'Pełne wytłaczanki, wszystkie wytłaczanki i puste miejsca w ostatniej.',
            tags: ['n / k', '(n + k - 1) / k', 'reszta'],
            statement: ['Pakujesz n jajek do wytłaczanek, po k sztuk w każdej. Wypisz trzy liczby: ile wytłaczanek będzie pełnych, ile wytłaczanek potrzeba na wszystkie jajka i ile miejsc zostanie pustych w ostatniej wytłaczance.'],
            input_format: ['Jeden wiersz: liczby całkowite n i k.'],
            output_format: ['Jeden wiersz: trzy liczby.'],
            constraints: ['0 ≤ n ≤ 10⁹', '1 ≤ k ≤ 100'],
            examples: [{ input: '47 10', note: '4 pełne wytłaczanki, piąta ma 7 jajek i 3 puste miejsca.' }, { input: '50 10' }, { input: '0 6' }],
            hint: R`Pełne: n / k. Wszystkie: (n + k - 1) / k. Puste miejsca: wszystkie * k - n. Sprawdź swój program na przykładzie, w którym n dzieli się przez k — wtedy pustych miejsc jest 0.`,
            tests: (r) => ['1 1', '1 100', '100 100', '1000000000 100', '999999999 100', '1000000000 7', '30 6', '31 6', ...Array.from({ length: 5 }, () => `${r.int(0, 10000)} ${r.int(1, 100)}`), ...Array.from({ length: 3 }, () => `${r.int(0, 1e9)} ${r.int(1, 100)}`)],
            check: (inp) => { const [n, k] = toks(inp).map(Number); return n >= 0 && n <= 1e9 && k >= 1 && k <= 100 ? null : 'zakres'; },
            solve: (inp) => { const [n, k] = toks(inp).map(B); const w = cdiv(n, k); return `${n / k} ${w} ${w * k - n}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    long long pelne = n / k;
    long long wszystkie = (n + k - 1) / k;
    long long puste = wszystkie * k - n;
    cout << pelne << " " << wszystkie << " " << puste << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-album', krok: 5, level: 'latwe',
            title: 'Album ze zdjęciami',
            short: 'Ile stron zajmą zdjęcia i ile ich będzie na ostatniej stronie?',
            tags: ['dzielenie w górę', 'ostatnia strona'],
            statement: ['Wklejasz n zdjęć do albumu, po k zdjęć na każdej stronie, strona po stronie. Ile stron zajmą zdjęcia i ile zdjęć znajdzie się na ostatniej zajętej stronie?'],
            input_format: ['Jeden wiersz: liczby całkowite n i k.'],
            output_format: ['Jeden wiersz: liczba stron i liczba zdjęć na ostatniej stronie.'],
            constraints: ['1 ≤ n ≤ 10⁹', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '23 6', note: 'Strony mieszczą 6, 6, 6 i 5 zdjęć.' }, { input: '24 6', note: 'Ostatnia strona jest pełna.' }],
            hint: R`Strony: (n + k - 1) / k. Na wszystkich stronach oprócz ostatniej jest po k zdjęć, więc na ostatniej: n - (strony - 1) * k. Licz w long long.`,
            tests: (r) => ['1 1', '1 1000000000', '1000000000 1', '1000000000 1000000000', '999999999 1000000000', '1000000000 3', '12 4', '13 4', ...Array.from({ length: 4 }, () => `${r.int(1, 1000)} ${r.int(1, 40)}`), ...Array.from({ length: 3 }, () => `${r.int(1, 1e9)} ${r.int(1, 1e9)}`)],
            check: (inp) => { const [n, k] = toks(inp).map(Number); return n >= 1 && n <= 1e9 && k >= 1 && k <= 1e9 ? null : 'zakres'; },
            solve: (inp) => { const [n, k] = toks(inp).map(B); const s = cdiv(n, k); return `${s} ${n - (s - 1n) * k}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    long long strony = (n + k - 1) / k;
    long long ostatnia = n - (strony - 1) * k;
    cout << strony << " " << ostatnia << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-druk', krok: 5, level: 'latwe',
            title: 'Drukowanie dwustronne',
            short: 'Ile kartek i ile minut? Dwa dzielenia w górę jedno po drugim.',
            tags: ['dzielenie w górę', 'dwa kroki'],
            statement: ['Drukujesz dokument o n stronach dwustronnie: na jednej kartce mieszczą się 2 strony. Drukarka drukuje k kartek na minutę. Ile kartek zużyjesz i ile minut potrwa drukowanie (liczymy każdą rozpoczętą minutę)?'],
            input_format: ['Jeden wiersz: liczby całkowite n i k.'],
            output_format: ['Jeden wiersz: liczba kartek i liczba minut.'],
            constraints: ['1 ≤ n ≤ 10⁹', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '13 4', note: '13 stron to 7 kartek (ostatnia zadrukowana z jednej strony). 7 kartek po 4 na minutę to 2 rozpoczęte minuty.' }, { input: '16 4' }],
            hint: R`Najpierw kartki: (n + 1) / 2 — to dzielenie w górę przez 2. Potem minuty: (kartki + k - 1) / k.`,
            tests: (r) => ['1 1', '1 1000000000', '2 1', '3 1', '1000000000 1', '999999999 1', '1000000000 1000000000', ...Array.from({ length: 5 }, () => `${r.int(1, 1000)} ${r.int(1, 20)}`), ...Array.from({ length: 3 }, () => `${r.int(1, 1e9)} ${r.int(1, 1e6)}`)],
            check: (inp) => { const [n, k] = toks(inp).map(Number); return n >= 1 && n <= 1e9 && k >= 1 && k <= 1e9 ? null : 'zakres'; },
            solve: (inp) => { const [n, k] = toks(inp).map(B); const s = cdiv(n, 2n); return `${s} ${cdiv(s, k)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    long long kartki = (n + 1) / 2;
    long long minuty = (kartki + k - 1) / k;
    cout << kartki << " " << minuty << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-cukierki', krok: 5, level: 'latwe',
            title: 'Cukierki po równo',
            short: 'Podział jak najbardziej po równo: w dół dla wszystkich, w górę dla niektórych.',
            tags: ['c / n', '(c + n - 1) / n', 'c % n'],
            statement: ['Masz c cukierków dla n dzieci. Rozdajesz je jak najbardziej po równo: każde dziecko dostaje tyle samo, a jeśli coś zostaje, kilkoro dzieci dostaje o jeden cukierek więcej. Rozdajesz wszystkie cukierki. Wypisz najmniejszą i największą liczbę cukierków u jednego dziecka oraz liczbę dzieci, które dostały najwięcej.'],
            input_format: ['Jeden wiersz: liczby całkowite c i n.'],
            output_format: ['Jeden wiersz: trzy liczby.'],
            constraints: ['0 ≤ c ≤ 10¹⁸', '1 ≤ n ≤ 10⁹'],
            examples: [{ input: '17 5', note: 'Każde dziecko dostaje 3, a 2 cukierki zostają — dwoje dzieci ma po 4.' }, { input: '15 5', note: 'Wszystkie dzieci mają po 3, więc najwięcej ma każde z 5 dzieci.' }],
            hint: R`Najmniej: c / n. Najwięcej: (c + n - 1) / n — dzielenie w górę. Ile dzieci ma najwięcej? Jeśli reszta c % n jest większa od zera — tyle, ile wynosi reszta. Jeśli reszta to 0, wszystkie dzieci mają po równo, więc najwięcej ma każde z n dzieci.`,
            tests: (r) => ['0 1', '0 7', '1 1', '1 1000000000', '1000000000000000000 1', '1000000000000000000 1000000000', '999999999999999999 1000000000', '1000000000000000000 7',
                ...Array.from({ length: 4 }, () => `${r.int(0, 100)} ${r.int(1, 12)}`), ...Array.from({ length: 3 }, () => `${r.big(0, '1000000000000000000')} ${r.int(1, 1e9)}`)],
            check: (inp) => { const [c, n] = toks(inp); return zakres(0, '1000000000000000000')(c) && zakres(1, 1000000000)(n) ? null : 'zakres'; },
            solve: (inp) => { const [c, n] = toks(inp).map(B); const rr = c % n; return `${c / n} ${cdiv(c, n)} ${rr > 0n ? rr : n}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long c, n;
    cin >> c >> n;
    long long malo = c / n;
    long long duzo = (c + n - 1) / n;
    long long ile = c % n;
    if (ile == 0) ile = n;
    cout << malo << " " << duzo << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-wielka-wycieczka', krok: 5, level: 'srednie',
            title: 'Gigantyczna wycieczka',
            short: 'Dzielenie w górę dla liczb rzędu 10¹⁸ — tu ceil na double zawodzi.',
            tags: ['(n + k - 1) / k', 'long long', 'double gubi cyfry'],
            statement: ['Na wielki zlot jedzie n osób, a jeden pociąg zabiera k osób. Ile pociągów potrzeba? Liczby są ogromne — sprawdź, czy Twoje rozwiązanie nie gubi cyfr.'],
            input_format: ['Jeden wiersz: liczby całkowite n i k.'],
            output_format: ['Jedna liczba — liczba pociągów.'],
            constraints: ['1 ≤ n ≤ 10¹⁸', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '999999999999999999 1', note: 'ceil((double)n / k) dałoby tu 10¹⁸ — o jeden za dużo.' }, { input: '1000000000000000000 3' }],
            hint: R`Przy tak dużych liczbach double pamięta tylko około 16 cyfr, więc ceil((double)n / k) potrafi się pomylić. Licz na long long: (n + k - 1) / k. Suma n + k − 1 sięga najwyżej 2 · 10¹⁸, a long long mieści ponad 9 · 10¹⁸ — zmieści się.`,
            tests: (r) => ['1 1', '1 1000000000000000000', '1000000000000000000 1', '1000000000000000000 1000000000000000000', '999999999999999999 3', '999999999999999999 999999999999999998',
                '1000000000000000000 999999999999999999', '123456789012345678 7', '987654321987654321 1000000007', '1000000000000000000 999999999', ...Array.from({ length: 5 }, () => `${r.big(1, '1000000000000000000')} ${r.big(1, '1000000000000')}`)],
            check: (inp) => (toks(inp).every(zakres(1, '1000000000000000000')) ? null : 'zakres'),
            solve: (inp) => { const [n, k] = toks(inp).map(B); return String(cdiv(n, k)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    cout << (n + k - 1) / k << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-procent-calkowity', krok: 5, level: 'srednie',
            title: 'Procenty bez przecinka',
            short: 'Procent zdających w dół i do najbliższej — samymi liczbami całkowitymi.',
            tags: ['100 * z / w', '(200 * z + w) / (2 * w)', 'long long'],
            statement: ['Na egzamin przyszło w uczniów, a zdało z nich z. W pierwszym wierszu wypisz procent zdających zaokrąglony w dół, a w drugim — zaokrąglony do najbliższej liczby całkowitej (połówki w górę, np. 12.5% → 13%).'],
            input_format: ['Jeden wiersz: liczby całkowite w i z.'],
            output_format: ['Dwa wiersze, w każdym jedna liczba całkowita.'],
            constraints: ['1 ≤ w ≤ 10⁹', '0 ≤ z ≤ w'],
            examples: [{ input: '23 17', note: '17 z 23 to 73.9…% — w dół 73, do najbliższej 74.' }, { input: '8 1', note: '1 z 8 to dokładnie 12.5% — połówka idzie w górę, do 13.' }],
            hint: R`Licz na liczbach całkowitych. W dół: 100 * z / w (mnożenie przed dzieleniem!). Do najbliższej: (200 * z + w) / (2 * w) albo (100 * z + w / 2) / w. Dla z bliskiego miliarda 100 * z nie mieści się w int — użyj long long.`,
            tests: (r) => ['1 0', '1 1', '2 1', '8 1', '8 3', '40 1', '200 29', '1000000000 1', '1000000000 999999999', '1000000000 5', '999999999 1',
                ...Array.from({ length: 5 }, () => { const w = r.int(1, 200); return `${w} ${r.int(0, w)}`; }), ...Array.from({ length: 3 }, () => { const w = r.int(1, 1e9); return `${w} ${r.int(0, w)}`; })],
            check: (inp) => { const [w, z] = toks(inp).map(Number); return w >= 1 && w <= 1e9 && z >= 0 && z <= w ? null : 'zakres'; },
            solve: (inp) => { const [w, z] = toks(inp).map(B); return `${100n * z / w}\n${rdivUp(100n * z, w)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long w, z;
    cin >> w >> z;
    cout << 100 * z / w << "\n";
    cout << (200 * z + w) / (2 * w) << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-stoliki', krok: 5, level: 'srednie',
            title: 'Stoliki w restauracji',
            short: 'Każda grupa przy swoich stolikach — a ile, gdyby wszyscy siedli razem?',
            tags: ['dzielenie w górę w pętli', 'suma', 'long long'],
            statement: ['Do restauracji przyszło n grup gości; i-ta grupa liczy gᵢ osób. Przy jednym stoliku siedzi k osób. Każda grupa chce siedzieć osobno — przy własnych stolikach. Ile stolików trzeba zestawić? A ile by wystarczyło, gdyby wszyscy goście mogli siadać razem, jak popadnie? Wypisz obie liczby w osobnych wierszach.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb — wielkości grup.'],
            output_format: ['Dwa wiersze: liczba stolików dla grup osobno i liczba stolików dla wszystkich razem.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ k ≤ 10⁹', '1 ≤ gᵢ ≤ 10⁹'],
            examples: [{ input: '3 4\n5 2 7', note: 'Osobno: 2 + 1 + 2 = 5 stolików. Razem 14 osób, czyli 4 stoliki.' }],
            hint: R`Osobno: suma (gᵢ + k − 1) / k po wszystkich grupach. Razem: najpierw zsumuj wszystkich gości, a potem jedno dzielenie w górę. Sumy mogą przekroczyć int — long long.`,
            tests: (r) => {
                const t = (n, k, hi) => `${n} ${k}\n${Array.from({ length: n }, () => r.int(1, hi)).join(' ')}`;
                return ['1 1\n1', '1 1000000000\n1', '2 3\n3 3', '3 10\n1 1 1', t(10, 6, 20), t(100, 4, 30), t(5000, 1000000000, 1000000000), t(5000, 7, 1000000000)];
            },
            check: (inp) => { const t = toks(inp).map(Number); return t[1] >= 1 && t[1] <= 1e9 && t.slice(2).every((x) => x >= 1 && x <= 1e9) ? null : 'zakres'; },
            solve: (inp) => {
                const t = toks(inp).map(B), k = t[1], g = t.slice(2, 2 + Number(t[0]));
                return `${g.reduce((a, x) => a + cdiv(x, k), 0n)}\n${cdiv(g.reduce((a, x) => a + x, 0n), k)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    long long osobno = 0, goscie = 0;
    for (int i = 0; i < n; i++) {
        long long g;
        cin >> g;
        osobno += (g + k - 1) / k;
        goscie += g;
    }
    cout << osobno << "\n" << (goscie + k - 1) / k << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 6 · do dziesiątek i wielokrotności
        {
            id: 'zao-do-dziesiatek', krok: 6, level: 'latwe',
            title: 'Do dziesiątek',
            short: 'W dół, w górę i do najbliższej dziesiątki.',
            tags: ['a / 10 * 10', '(a + 9) / 10 * 10', '(a + 5) / 10 * 10'],
            statement: ['Dla każdej z n liczb całkowitych nieujemnych wypisz w osobnym wierszu trzy liczby: jej zaokrąglenie do dziesiątek w dół, w górę i do najbliższej dziesiątki (piątki zaokrąglamy w górę, np. 45 → 50).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['n wierszy, w każdym trzy liczby.'],
            constraints: ['1 ≤ n ≤ 500', '0 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '4\n47 40 45 3' }],
            hint: R`Trzy wzory z lekcji: a / 10 * 10 (w dół), (a + 9) / 10 * 10 (w górę) i (a + 5) / 10 * 10 (do najbliższej). Kolejność działań ma znaczenie: najpierw dzielenie, potem mnożenie.`,
            tests: (r) => ['1\n0', '1\n5', '1\n1000000000', '1\n999999995', '3\n4 5 6', fmt(Array.from({ length: 30 }, () => r.int(0, 200))), fmt(Array.from({ length: 500 }, () => r.int(0, 1000000000)))],
            check: (inp) => (lista(inp).v.every(zakres(0, 1000000000)) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => { const a = B(s); return `${a / 10n * 10n} ${cdiv(a, 10n) * 10n} ${(a + 5n) / 10n * 10n}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        long long a;
        cin >> a;
        cout << a / 10 * 10 << " " << (a + 9) / 10 * 10 << " " << (a + 5) / 10 * 10 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-do-wielokrotnosci', krok: 6, level: 'latwe',
            title: 'Do wielokrotności k',
            short: 'Zaokrąglij a do wielokrotności dowolnego k: w dół, w górę i do najbliższej.',
            tags: ['a / k * k', '(a + k - 1) / k * k', '(a + k / 2) / k * k'],
            statement: ['Dla każdego z t zapytań a, k wypisz w osobnym wierszu trzy liczby: zaokrąglenie a do wielokrotności k w dół, w górę i do najbliższej. Gdy a leży dokładnie w połowie między dwiema wielokrotnościami k, zaokrąglij w górę.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczby całkowite a i k.'],
            output_format: ['t wierszy, w każdym trzy liczby.'],
            constraints: ['1 ≤ t ≤ 400', '0 ≤ a ≤ 10¹⁸', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '3\n52 15\n45 10\n53 15', note: '52 leży między 45 a 60 — bliżej 45. 53 jest już bliżej 60.' }],
            hint: R`Podziel, zaokrąglij, pomnóż: a / k * k, (a + k - 1) / k * k i (a + k / 2) / k * k. Liczby są duże — long long.`,
            tests: (r) => {
                const q = () => `${r.big(0, '1000000000000000000')} ${r.int(1, 1000000000)}`;
                const m = () => `${r.int(0, 1000)} ${r.int(1, 30)}`;
                return ['1\n0 1', '1\n0 1000000000', '1\n1000000000000000000 1000000000', '1\n1000000000000000000 999999999', '2\n5 10\n15 10', '3\n7 15\n8 15\n22 15',
                    wiersze(Array.from({ length: 40 }, m)), wiersze(Array.from({ length: 400 }, () => (r() < 0.5 ? q() : m())))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [a, k] = toks(w); return zakres(0, '1000000000000000000')(a) && zakres(1, 1000000000)(k); }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [a, k] = toks(w).map(B);
                return `${a / k * k} ${cdiv(a, k) * k} ${rdivUp(a, k) * k}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, k;
        cin >> a >> k;
        cout << a / k * k << " " << (a + k - 1) / k * k << " " << (a + k / 2) / k * k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-kwadranse', krok: 6, level: 'latwe',
            title: 'Do najbliższego kwadransa',
            short: 'Zaokrąglij godzinę do pełnej godziny, kwadransa lub wpół do.',
            tags: ['wielokrotności 15', 'hh:mm', 'setw i setfill'],
            statement: ['Dla każdej z n godzin w formacie hh:mm wypisz godzinę zaokrągloną do najbliższego kwadransa (pełnej godziny, kwadransa po, wpół do albo za kwadrans), także w formacie hh:mm. Gdy zaokrąglenie przechodzi przez północ, wypisz 00:00.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy godzina w formacie hh:mm.'],
            output_format: ['n wierszy z godzinami w formacie hh:mm.'],
            constraints: ['1 ≤ n ≤ 1000', '00 ≤ hh ≤ 23, 00 ≤ mm ≤ 59'],
            examples: [{ input: '4\n14:07\n14:08\n09:52\n23:53', note: '7 minut po pełnej godzinie to jeszcze bliżej pełnej, a 8 minut — już bliżej kwadransa.' }],
            hint: R`Zamień godzinę na minuty od północy, zaokrąglij do najbliższej wielokrotności 15 wzorem (t + 7) / 15 * 15 (dla liczb całkowitych nie ma remisów, bo połowa kwadransa to 7.5 minuty), weź wynik modulo 1440 i zamień z powrotem na godziny i minuty.`,
            tests: (r) => ['1\n00:00', '1\n23:52', '1\n23:53', '1\n00:07', '1\n00:08', '4\n12:22\n12:23\n12:37\n12:38', wiersze(Array.from({ length: 30 }, () => zegar(r))), wiersze(Array.from({ length: 1000 }, () => zegar(r)))],
            check: (inp) => (linie(inp).slice(1).every((w) => /^([01]\d|2[0-3]):[0-5]\d$/.test(w.trim())) ? null : 'format'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [hh, mm] = w.trim().split(':').map(Number);
                const t = ((Math.floor((60 * hh + mm + 7) / 15) * 15) % 1440);
                return `${pad2(Math.floor(t / 60))}:${pad2(t % 60)}`;
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
        t = (t + 7) / 15 * 15 % 1440;
        cout << setw(2) << setfill('0') << t / 60 << ":" << setw(2) << setfill('0') << t % 60 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-czekanie', krok: 6, level: 'latwe',
            title: 'Czekanie na autobus',
            short: 'Autobus co k minut. Kiedy odjedzie pasażer i ile poczeka?',
            tags: ['następna wielokrotność', '(t + k - 1) / k * k'],
            statement: ['Pierwszy autobus odjeżdża z przystanku w minucie 0, a kolejne co k minut. Dla każdego z n pasażerów znasz minutę t, w której przyszedł na przystanek. Wypisz w osobnym wierszu, w której minucie odjedzie jego autobus i ile minut będzie czekał. Pasażer, który przychodzi dokładnie w minucie odjazdu, zdąży.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych — minuty przyjścia pasażerów.'],
            output_format: ['n wierszy, w każdym minuta odjazdu i czas czekania.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 10⁹', '0 ≤ t ≤ 10⁹'],
            examples: [{ input: '3 15\n7 30 31' }],
            hint: R`Odjazd to t zaokrąglone w górę do wielokrotności k: (t + k - 1) / k * k. Czekanie to różnica: odjazd − t. Licz w long long — t + k − 1 może przekroczyć int.`,
            tests: (r) => {
                const t = (n, k, hi) => `${n} ${k}\n${Array.from({ length: n }, () => r.int(0, hi)).join(' ')}`;
                return ['1 1\n0', '1 1000000000\n1', '1 1000000000\n1000000000', '2 7\n0 7', t(20, 15, 100), t(100, 20, 1440), t(1000, 1000000000, 1000000000), t(1000, 37, 1000000000)];
            },
            check: (inp) => { const t = toks(inp).map(Number); return t[1] >= 1 && t[1] <= 1e9 && t.slice(2).every((x) => x >= 0 && x <= 1e9) ? null : 'zakres'; },
            solve: (inp) => { const t = toks(inp).map(B), k = t[1]; return t.slice(2, 2 + Number(t[0])).map((x) => { const o = cdiv(x, k) * k; return `${o} ${o - x}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    for (int i = 0; i < n; i++) {
        long long t;
        cin >> t;
        long long odjazd = (t + k - 1) / k * k;
        cout << odjazd << " " << odjazd - t << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-ile-wielokrotnosci', krok: 6, level: 'srednie',
            title: 'Ile wielokrotności w przedziale',
            short: 'Ile liczb od a do b dzieli się przez k? Bez pętli — wzorem.',
            tags: ['b / k - (a - 1) / k', 'long long'],
            statement: ['Dla każdego z t zapytań a, b, k wypisz, ile liczb z przedziału od a do b (włącznie) dzieli się przez k.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczby całkowite a, b i k.'],
            output_format: ['t wierszy z odpowiedziami.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ a ≤ b ≤ 10¹⁸', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '3\n10 20 3\n1 100 7\n15 15 5', note: 'Między 10 a 20 przez 3 dzielą się 12, 15 i 18.' }],
            hint: R`Od 1 do b jest b / k wielokrotności liczby k. Odejmij te, które leżą przed a, czyli od 1 do a − 1: b / k - (a - 1) / k. Pętla po wszystkich liczbach byłaby o wiele za wolna.`,
            tests: (r) => {
                const q = () => { let a = r.big(1, '1000000000000000000'), b = r.big(1, '1000000000000000000'); if (a > b) [a, b] = [b, a]; return `${a} ${b} ${r.big(1, r() < 0.5 ? '1000' : '1000000000000000000')}`; };
                const m = () => { const a = r.int(1, 200), b = r.int(a, 300); return `${a} ${b} ${r.int(1, 25)}`; };
                return ['1\n1 1 1', '1\n1 1000000000000000000 1', '1\n1 1000000000000000000 1000000000000000000', '1\n999999999999999999 999999999999999999 1000000000000000000', '2\n6 6 3\n7 8 3',
                    wiersze(Array.from({ length: 40 }, m)), wiersze(Array.from({ length: 1000 }, () => (r() < 0.6 ? q() : m())))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [a, b, k] = toks(w).map(B); return a >= 1n && a <= b && b <= 10n ** 18n && k >= 1n && k <= 10n ** 18n; }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => { const [a, b, k] = toks(w).map(B); return String(b / k - (a - 1n) / k); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, b, k;
        cin >> a >> b >> k;
        cout << b / k - (a - 1) / k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zao-cena-dziewiec', krok: 6, level: 'srednie',
            title: 'Cena kończąca się dziewiątką',
            short: 'Najmniejsza cena typu …9, która nie jest mniejsza niż p.',
            tags: ['w górę do dziesiątek', 'przesunięcie o 1'],
            statement: ['Sklep lubi ceny kończące się cyfrą 9: 9, 19, 29, …, 129, … Dla każdej z n cen p (w złotych) wypisz najmniejszą cenę kończącą się dziewiątką, która jest nie mniejsza niż p.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — ceny.'],
            output_format: ['Jeden wiersz: n cen.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ p ≤ 10⁹'],
            examples: [{ input: '5\n123 129 130 1 0' }],
            hint: R`Ceny kończące się dziewiątką są o jeden mniejsze od wielokrotności 10. Szukasz najmniejszej wielokrotności 10, która jest większa od p, czyli p + 1 zaokrąglone w górę do dziesiątek: (p + 1 + 9) / 10 * 10. Na koniec odejmij 1.`,
            tests: (r) => ['1\n0', '1\n9', '1\n10', '1\n1000000000', '1\n999999999', '10\n0 1 2 3 4 5 6 7 8 9', fmt(Array.from({ length: 30 }, () => r.int(0, 500))), fmt(Array.from({ length: 1000 }, () => r.int(0, 1000000000)))],
            check: (inp) => (lista(inp).v.every(zakres(0, 1000000000)) ? null : 'zakres'),
            solve: (inp) => lista(inp).v.map((s) => { const p = B(s); return String((p + 10n) / 10n * 10n - 1n); }).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        long long p;
        cin >> p;
        cout << (p + 1 + 9) / 10 * 10 - 1 << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-kasa', krok: 6, level: 'srednie',
            title: 'Zaokrąglanie w kasie',
            short: 'Płatność gotówką zaokrąglana do 5 groszy — kto zyskał, kto stracił?',
            tags: ['do najbliższej wielokrotności 5', 'suma różnic'],
            statement: ['W pewnym kraju nie ma monet 1 i 2 grosze, więc płacąc gotówką, kwotę zaokrągla się do najbliższej wielokrotności 5 groszy (np. 1231 gr → 1230 gr, 1233 gr → 1235 gr). Ponieważ 5 jest liczbą nieparzystą, kwota nigdy nie wypada dokładnie w połowie. Dla n zakupów (kwoty w groszach) wypisz w pierwszym wierszu kwoty do zapłaty gotówką, a w drugim — o ile groszy klienci zapłacili łącznie więcej niż suma kwot z paragonów (liczba ujemna oznacza, że zapłacili mniej).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n kwot w groszach.'],
            output_format: ['Dwa wiersze: n kwot do zapłaty i jedna liczba — łączna różnica.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ kwota ≤ 10⁷'],
            examples: [{ input: '3\n1231 1233 999', note: 'Klienci płacą 1230, 1235 i 1000 groszy — razem o 2 grosze więcej.' }],
            hint: R`Do najbliższej wielokrotności 5: (g + 2) / 5 * 5 — dodajesz połowę piątki (5 / 2 = 2 na liczbach całkowitych) i zaokrąglasz w dół. Różnicę licz jako sumę (zapłacone − kwota) po wszystkich zakupach.`,
            tests: (r) => ['1\n1', '1\n2', '1\n3', '5\n10 11 12 13 14', '1\n10000000', fmt(Array.from({ length: 30 }, () => r.int(1, 2000))), fmt(Array.from({ length: 1000 }, () => r.int(1, 10000000)))],
            check: (inp) => (lista(inp).v.every(zakres(1, 10000000)) ? null : 'zakres'),
            solve: (inp) => {
                const g = lista(inp).v.map(B), z = g.map((x) => (x + 2n) / 5n * 5n);
                return `${z.join(' ')}\n${z.reduce((a, x, i) => a + x - g[i], 0n)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long roznica = 0;
    for (int i = 0; i < n; i++) {
        long long g;
        cin >> g;
        long long zaplata = (g + 2) / 5 * 5;
        cout << zaplata << " ";
        roznica += zaplata - g;
    }
    cout << "\n" << roznica << "\n";
    return 0;
}`,
        },
        {
            id: 'zao-zgrzewki', krok: 6, level: 'srednie',
            title: 'Zgrzewki wody',
            short: 'Pojedyncze butelki czy zgrzewki po 6? Najtańszy sposób na n butelek.',
            tags: ['n / 6 i n % 6', 'dzielenie w górę', 'min'],
            statement: ['Potrzebujesz co najmniej n butelek wody. Sklep sprzedaje pojedyncze butelki po a groszy i zgrzewki po 6 butelek za b groszy. Możesz kupić więcej butelek, niż potrzebujesz. Dla każdego z t zapytań wypisz, ile najmniej groszy zapłacisz.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z kolejnych t wierszy liczby całkowite n, a i b.'],
            output_format: ['t wierszy z najmniejszymi kwotami.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10⁹', '1 ≤ a, b ≤ 10⁶'],
            examples: [{ input: '3\n23 250 1200\n20 250 1200\n7 100 700', note: 'Przy 23 butelkach najtaniej kupić 4 zgrzewki (24 butelki). Przy 20 — 3 zgrzewki i 2 butelki. Przy 7 i drogich zgrzewkach — same butelki.' }],
            hint: R`Sprawdź trzy możliwości i wybierz najtańszą: same pojedyncze butelki (n * a); tyle pełnych zgrzewek, ile się da (n / 6), a resztę (n % 6) pojedynczo; same zgrzewki, czyli (n + 5) / 6 zgrzewek. Wyniki mogą sięgać 10¹⁵ — long long.`,
            tests: (r) => {
                const q = () => `${r.int(1, 1000000000)} ${r.int(1, 1000000)} ${r.int(1, 1000000)}`;
                const m = () => `${r.int(1, 30)} ${r.int(50, 300)} ${r.int(300, 1800)}`;
                return ['1\n1 1 1', '1\n1 1000000 1', '1\n6 1 1000000', '1\n1000000000 1000000 1000000', '3\n5 100 499\n5 100 501\n6 100 600', wiersze(Array.from({ length: 60 }, m)), wiersze(Array.from({ length: 1000 }, () => (r() < 0.5 ? q() : m())))];
            },
            check: (inp) => (linie(inp).slice(1).every((w) => { const [n, a, b] = toks(w).map(Number); return n >= 1 && n <= 1e9 && a >= 1 && a <= 1e6 && b >= 1 && b <= 1e6; }) ? null : 'zakres'),
            solve: (inp) => linie(inp).slice(1, 1 + Number(toks(inp)[0])).map((w) => {
                const [n, a, b] = toks(w).map(B);
                const opcje = [n * a, n / 6n * b + n % 6n * a, cdiv(n, 6n) * b];
                return String(opcje.reduce((x, y) => (y < x ? y : x)));
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long n, a, b;
        cin >> n >> a >> b;
        long long butelki = n * a;
        long long mieszane = n / 6 * b + n % 6 * a;
        long long zgrzewki = (n + 5) / 6 * b;
        cout << min({butelki, mieszane, zgrzewki}) << "\n";
    }
    return 0;
}`,
        },
    ];
};
