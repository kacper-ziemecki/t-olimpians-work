// Input / Output — ćwiczenia w trakcie lekcji, części 1–6: jak działa cin, separatory, getline,
// fixed i setprecision, setw i setfill, printf i scanf. Bez pętli i bez if — uczeń zna tylko lekcję o typach.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki (zadania.html).
module.exports = (h) => {
    const { reader, nums, toks, lines, join, fx, safe, dec, capital, padL, padR } = h;
    const R = String.raw;
    const SLOWA = ['ala', 'ma', 'kota', 'bajtek', 'lubi', 'programowac', 'w', 'cpp', 'olimpiada', 'zadanie', 'jest',
        'proste', 'dzisiaj', 'pada', 'deszcz', 'szkola', 'kolo', 'informatyki', 'bity', 'bajty', 'komputer', 'liczy', 'szybko'];
    const zdanie = (r, n) => Array.from({ length: n }, () => r.pick(SLOWA)).join(' ');
    const Zdanie = (r, n) => capital(zdanie(r, n));
    const z2 = (n) => padL(n, 2, '0');
    const hhmm = (r) => `${z2(r.int(0, 23))}:${z2(r.int(0, 59))}`;
    const czas = (s) => { const m = s.match(/^(\d+):(\d+)$/); return Number(m[1]) * 60 + Number(m[2]); };

    return [
        // ================================================================ KROK 1 · jak działa cin
        {
            id: 'io-z-kolumny-w-wiersz', krok: 1, level: 'latwe',
            title: 'Z kolumny w wiersz',
            short: 'Trzy liczby w trzech wierszach — wypisz je obok siebie, w jednym wierszu.',
            tags: ['cin', 'wiele wierszy'],
            statement: [
                'Na wejściu są trzy liczby całkowite, każda w osobnym wierszu. Wypisz je w jednym wierszu, w tej samej kolejności, oddzielone pojedynczymi spacjami.',
                'Dla cin nie ma znaczenia, czy liczby stoją w jednym wierszu, czy w kilku: zanim zacznie czytać kolejną liczbę, przeskakuje wszystkie spacje i entery.',
            ],
            input_format: ['Trzy wiersze, w każdym jedna liczba całkowita.'],
            output_format: ['Jeden wiersz: trzy liczby oddzielone spacjami.'],
            constraints: ['każda liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '7\n-2\n15' }],
            hint: R`cin >> a >> b >> c; wczyta wszystkie trzy liczby, niezależnie od tego, w ilu wierszach stoją. Potem: cout << a << " " << b << " " << c << "\n";`,
            tests: (r) => ['1\n2\n3', '0\n0\n0', '-1000000000\n1000000000\n5', '7\n\n-2\n\n15',
                ...Array.from({ length: 5 }, () => `${r.int(-1e9, 1e9)}\n${r.int(-1e9, 1e9)}\n${r.int(-1e9, 1e9)}`)],
            solve: (inp) => nums(inp).join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << a << " " << b << " " << c << "\n";
    return 0;
}`,
        },
        {
            id: 'io-z-wiersza-w-kolumne', krok: 1, level: 'latwe',
            title: 'Z wiersza w kolumnę',
            short: 'Cztery liczby w jednym wierszu — wypisz każdą w osobnym wierszu.',
            tags: ['cin', R`"\n"`],
            statement: ['W jedynym wierszu wejścia są cztery liczby całkowite oddzielone spacjami. Wypisz je jedna pod drugą — każdą w osobnym wierszu.'],
            input_format: ['Jeden wiersz z czterema liczbami całkowitymi.'],
            output_format: ['Cztery wiersze, w każdym jedna liczba.'],
            constraints: ['każda liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '10 20 30 40' }],
            hint: R`Wczytujesz tak samo jak zawsze: cin >> a >> b >> c >> d;. Zmienia się tylko wypisywanie: po każdej liczbie wypisz "\n".`,
            tests: (r) => ['1 2 3 4', '0 0 0 0', '-5 5 -5 5', ...Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => r.int(-1e9, 1e9)).join(' '))],
            solve: (inp) => nums(inp).join('\n'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    cout << a << "\n" << b << "\n" << c << "\n" << d << "\n";
    return 0;
}`,
        },
        {
            id: 'io-od-konca', krok: 1, level: 'latwe',
            title: 'Od końca',
            short: 'Wczytaj cztery liczby i wypisz je w odwrotnej kolejności.',
            tags: ['cin', 'zmienne'],
            statement: ['Wczytaj cztery liczby całkowite i wypisz je w jednym wierszu w odwrotnej kolejności: najpierw ostatnią, a na końcu pierwszą.'],
            input_format: ['Jeden wiersz z czterema liczbami całkowitymi.'],
            output_format: ['Jeden wiersz: te same liczby w odwrotnej kolejności, oddzielone spacjami.'],
            constraints: ['każda liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '1 2 3 4' }],
            hint: 'Najpierw wczytaj wszystkie cztery liczby do osobnych zmiennych — program musi je zapamiętać, zanim zacznie wypisywać. Dopiero potem wypisz d, c, b i a.',
            tests: (r) => ['5 6 7 8', '0 -1 0 -1', ...Array.from({ length: 6 }, () => Array.from({ length: 4 }, () => r.int(-1e9, 1e9)).join(' '))],
            solve: (inp) => nums(inp).reverse().join(' '),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c, d;
    cin >> a >> b >> c >> d;
    cout << d << " " << c << " " << b << " " << a << "\n";
    return 0;
}`,
        },
        {
            id: 'io-tylko-srodkowa', krok: 1, level: 'latwe',
            title: 'Tylko środkowa',
            short: 'Na wejściu są trzy liczby, a wypisać trzeba tylko drugą.',
            tags: ['cin', 'kolejność czytania'],
            statement: [
                'Na wejściu są trzy liczby całkowite. Wypisz tylko drugą z nich — tę, która stoi w środku.',
                'Pierwszej liczby nie potrzebujesz, ale i tak musisz ją wczytać: cin czyta wejście po kolei i nie umie przeskoczyć liczby, nie czytając jej. Trzeciej możesz w ogóle nie czytać.',
            ],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi.'],
            output_format: ['Jedna liczba — druga z wczytanych.'],
            constraints: ['każda liczba jest między −10⁹ a 10⁹'],
            examples: [{ input: '5 17 9' }],
            hint: 'cin >> a >> b; wystarczy — a dostaje pierwszą liczbę, b drugą. Wypisz b.',
            tests: (r) => ['1 2 3', '-7 0 7', ...Array.from({ length: 6 }, () => Array.from({ length: 3 }, () => r.int(-1e9, 1e9)).join(' '))],
            solve: (inp) => String(nums(inp)[1]),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << b << "\n";
    return 0;
}`,
        },
        {
            id: 'io-wizytowka', krok: 1, level: 'latwe',
            title: 'Wizytówka',
            short: 'Imię, wiek i wzrost w trzech wierszach — wypisz je z opisami.',
            tags: ['cin', 'string', 'int'],
            statement: ['W pierwszym wierszu wejścia jest imię, w drugim wiek (w latach), a w trzecim wzrost (w centymetrach). Wypisz wizytówkę w trzech wierszach, dokładnie jak w przykładzie: Imie: …, Wiek: … lat, Wzrost: … cm.'],
            input_format: ['Trzy wiersze: imię (jedno słowo), wiek i wzrost (liczby całkowite).'],
            output_format: ['Trzy wiersze wizytówki, jak w przykładzie.'],
            constraints: ['imię ma od 1 do 20 liter alfabetu angielskiego', '1 ≤ wiek ≤ 120', '50 ≤ wzrost ≤ 250'],
            examples: [{ input: 'Ola\n13\n158' }],
            hint: R`Każdą daną wczytaj do zmiennej odpowiedniego typu: string imie; int wiek, wzrost;. Uważaj na spacje w wypisywanym tekście, np. cout << "Wiek: " << wiek << " lat\n";`,
            tests: (r) => ['Bajtek\n12\n150', 'X\n1\n50', ...Array.from({ length: 5 }, () => `${capital(r.word(r.int(2, 20)))}\n${r.int(1, 120)}\n${r.int(50, 250)}`)],
            solve: (inp) => { const [i, w, z] = toks(inp); return join(`Imie: ${i}`, `Wiek: ${w} lat`, `Wzrost: ${z} cm`); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string imie;
    int wiek, wzrost;
    cin >> imie >> wiek >> wzrost;
    cout << "Imie: " << imie << "\n";
    cout << "Wiek: " << wiek << " lat\n";
    cout << "Wzrost: " << wzrost << " cm\n";
    return 0;
}`,
        },
        {
            id: 'io-opis-wejscia', krok: 1, level: 'srednie',
            title: 'Jak czytać opis wejścia',
            short: 'Dane w dwóch wierszach o różnym układzie — przeczytaj opis i policz wynik.',
            tags: ['cin', 'format wejścia', 'double'],
            statement: [
                'W pierwszym wierszu wejścia jest nazwa drużyny (jedno słowo) i liczba zawodników n. W drugim wierszu są trzy liczby całkowite — punkty zdobyte w trzech meczach. Wypisz w pierwszym wierszu nazwę drużyny, dwukropek, spację i sumę punktów, a w drugim — średnią liczbę punktów na jednego zawodnika (suma podzielona przez n), z dokładnością do dwóch miejsc po przecinku.',
                'To ćwiczenie z czytania opisu wejścia: zanim napiszesz cin, ustal, ile danych stoi w każdym wierszu i jakiego są typu.',
            ],
            input_format: ['Pierwszy wiersz: słowo (nazwa drużyny) i liczba całkowita n. Drugi wiersz: trzy liczby całkowite.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['nazwa ma od 1 do 20 liter alfabetu angielskiego', '1 ≤ n ≤ 100', '0 ≤ punkty w meczu ≤ 1000', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: 'Orly 4\n12 7 9', note: 'Suma to 12 + 7 + 9 = 28, a 28 / 4 = 7.' }],
            hint: 'Dane wczytujesz w takiej kolejności, w jakiej stoją na wejściu: cin >> nazwa >> n >> a >> b >> c;. Średnia na zawodnika to suma podzielona przez n — pamiętaj o dzieleniu na double: (double)suma / n.',
            tests: (r) => {
                const out = ['Lwy 1\n0 0 0', 'Bity 3\n10 20 30', 'Zespol 100\n1000 1000 1000'];
                while (out.length < 10) {
                    const n = r.int(1, 100), p = [r.int(0, 1000), r.int(0, 1000), r.int(0, 1000)];
                    if (safe((p[0] + p[1] + p[2]) / n, 2)) out.push(`${capital(r.word(r.int(1, 20)))} ${n}\n${p.join(' ')}`);
                }
                return out;
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[1]); const s = Number(t[2]) + Number(t[3]) + Number(t[4]); return join(`${t[0]}: ${s}`, fx(s / n, 2)); },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string nazwa;
    int n, a, b, c;
    cin >> nazwa >> n >> a >> b >> c;
    int suma = a + b + c;
    cout << nazwa << ": " << suma << "\n";
    cout << fixed << setprecision(2) << (double)suma / n << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · separatory
        {
            id: 'io-godzina-na-minuty', krok: 2, level: 'latwe',
            title: 'Godzina na minuty',
            short: 'Wczytaj godzinę w formacie 14:35 i policz minuty od północy.',
            tags: ['char jako separator', 'cin'],
            statement: [
                'Wczytaj godzinę zapisaną w formacie HH:MM (na przykład 14:35) i wypisz, ile minut minęło od północy.',
                'Dwukropek to zwykły znak — wczytaj go do zmiennej typu char, której potem po prostu nie używasz.',
            ],
            input_format: ['W jedynym wierszu godzina w formacie HH:MM (godziny i minuty zawsze dwucyfrowe).'],
            output_format: ['Jedna liczba — minuty od północy.'],
            constraints: ['00 ≤ HH ≤ 23', '00 ≤ MM ≤ 59'],
            examples: [{ input: '14:35' }, { input: '00:07', note: 'Zera na początku nie przeszkadzają: cin wczyta 07 jako liczbę 7.' }],
            hint: 'int h, m; char dwukropek; cin >> h >> dwukropek >> m; — cin wczyta 14, potem znak :, potem 35. Wynik to h * 60 + m.',
            tests: (r) => ['00:00', '23:59', '12:00', '09:09', '08:30', hhmm(r), hhmm(r), hhmm(r)],
            solve: (inp) => String(czas(inp.trim())),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int h, m;
    char dwukropek;
    cin >> h >> dwukropek >> m;
    cout << h * 60 + m << "\n";
    return 0;
}`,
        },
        {
            id: 'io-rozbierz-date', krok: 2, level: 'latwe',
            title: 'Rozbierz datę',
            short: 'Data 04.11.2026 — wypisz osobno dzień, miesiąc i rok.',
            tags: ['char jako separator'],
            statement: ['Wczytaj datę zapisaną w formacie DD.MM.RRRR i wypisz w trzech wierszach: dzień, miesiąc i rok — jako zwykłe liczby, bez zer na początku.'],
            input_format: ['W jedynym wierszu data w formacie DD.MM.RRRR.'],
            output_format: ['Trzy wiersze: dzień, miesiąc i rok.'],
            constraints: ['01 ≤ DD ≤ 31', '01 ≤ MM ≤ 12', '1000 ≤ RRRR ≤ 9999'],
            examples: [{ input: '04.11.2026' }],
            hint: 'Kropki wczytaj do zmiennej typu char: cin >> d >> kropka >> m >> kropka >> r;. Jedna zmienna char może posłużyć dwa razy — jej wartość i tak nie jest potrzebna.',
            tests: (r) => ['01.01.1000', '31.12.9999', '09.08.2007', ...Array.from({ length: 5 }, () => `${z2(r.int(1, 31))}.${z2(r.int(1, 12))}.${r.int(1000, 9999)}`)],
            solve: (inp) => inp.trim().split('.').map(Number).join('\n'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int d, m, r;
    char kropka;
    cin >> d >> kropka >> m >> kropka >> r;
    cout << d << "\n" << m << "\n" << r << "\n";
    return 0;
}`,
        },
        {
            id: 'io-wynik-meczu', krok: 2, level: 'latwe',
            title: 'Wynik meczu',
            short: 'Wynik 3:1 — ile padło goli i jaka była różnica?',
            tags: ['char jako separator', 'działania'],
            statement: ['Wczytaj wynik meczu w formacie a:b (gole gospodarzy, dwukropek, gole gości) i wypisz w dwóch wierszach: ile goli padło łącznie oraz różnicę a − b (może być ujemna).'],
            input_format: ['W jedynym wierszu wynik w formacie a:b.'],
            output_format: ['Dwa wiersze: suma goli i różnica a − b.'],
            constraints: ['0 ≤ a, b ≤ 99'],
            examples: [{ input: '3:1' }, { input: '0:2' }],
            hint: 'Tak samo jak z godziną: int a, b; char c; cin >> a >> c >> b;. Potem dwa działania: a + b oraz a - b.',
            tests: (r) => ['0:0', '99:0', '0:99', '5:5', `${r.int(0, 99)}:${r.int(0, 99)}`, `${r.int(0, 9)}:${r.int(0, 9)}`, `${r.int(0, 9)}:${r.int(0, 99)}`],
            solve: (inp) => { const [a, b] = inp.trim().split(':').map(Number); return join(a + b, a - b); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    char c;
    cin >> a >> c >> b;
    cout << a + b << "\n" << a - b << "\n";
    return 0;
}`,
        },
        {
            id: 'io-ile-trwala-lekcja', krok: 2, level: 'srednie',
            title: 'Ile trwały zajęcia?',
            short: 'Dwie godziny HH:MM — ile minut minęło od pierwszej do drugiej?',
            tags: ['char jako separator', 'minuty'],
            statement: ['Wczytaj godzinę rozpoczęcia i godzinę zakończenia zajęć (tego samego dnia), obie w formacie HH:MM, i wypisz, ile minut trwały zajęcia.'],
            input_format: ['W jedynym wierszu dwie godziny w formacie HH:MM oddzielone spacją. Druga nie jest wcześniejsza niż pierwsza.'],
            output_format: ['Jedna liczba — czas trwania zajęć w minutach.'],
            constraints: ['00:00 ≤ godziny ≤ 23:59'],
            examples: [{ input: '08:00 08:45' }, { input: '13:50 15:25' }],
            hint: 'Zamień każdą godzinę na minuty od północy (h * 60 + m), a potem odejmij. Do wczytania wystarczy jedna zmienna char na oba dwukropki: cin >> h1 >> c >> m1 >> h2 >> c >> m2;',
            tests: (r) => {
                const out = ['00:00 23:59', '12:00 12:00', '09:59 10:01'];
                while (out.length < 9) {
                    const a = r.int(0, 1439), b = r.int(a, 1439);
                    out.push(`${z2(Math.floor(a / 60))}:${z2(a % 60)} ${z2(Math.floor(b / 60))}:${z2(b % 60)}`);
                }
                return out;
            },
            solve: (inp) => { const [a, b] = toks(inp).map(czas); return String(b - a); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int h1, m1, h2, m2;
    char c;
    cin >> h1 >> c >> m1 >> h2 >> c >> m2;
    cout << (h2 * 60 + m2) - (h1 * 60 + m1) << "\n";
    return 0;
}`,
        },
        {
            id: 'io-ulamek', krok: 2, level: 'srednie',
            title: 'Ułamek na liczbę',
            short: 'Ułamek a/b zamień na liczbę dziesiętną z trzema miejscami po przecinku.',
            tags: ['char jako separator', 'double', 'setprecision'],
            statement: ['Wczytaj ułamek zapisany w postaci a/b (na przykład 3/8) i wypisz jego wartość jako liczbę dziesiętną z dokładnością do trzech miejsc po przecinku.'],
            input_format: ['W jedynym wierszu ułamek w postaci a/b, bez spacji.'],
            output_format: ['Wartość ułamka z dokładnie trzema cyframi po kropce.'],
            constraints: ['1 ≤ a, b ≤ 1000', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '3/4' }, { input: '2/3' }],
            hint: 'Wczytaj a, ukośnik (char) i b. Uważaj na dzielenie int-ów: dla 3 i 4 a / b daje 0! Licz (double)a / b i wypisz z fixed i setprecision(3).',
            tests: (r) => {
                const out = ['1/1', '1000/1', '1/1000', '7/2'];
                while (out.length < 11) {
                    const a = r.int(1, 1000), b = r.int(1, 1000);
                    if (safe(a / b, 3)) out.push(`${a}/${b}`);
                }
                return out;
            },
            solve: (inp) => { const [a, b] = inp.trim().split('/').map(Number); return fx(a / b, 3); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int a, b;
    char ukosnik;
    cin >> a >> ukosnik >> b;
    cout << fixed << setprecision(3) << (double)a / b << "\n";
    return 0;
}`,
        },
        {
            id: 'io-punkt', krok: 2, level: 'srednie',
            title: 'Punkt na płaszczyźnie',
            short: 'Wczytaj punkt (x,y) i wypisz go z zamienionymi współrzędnymi.',
            tags: ['char jako separator', 'wypisywanie znaków'],
            statement: ['Punkt na płaszczyźnie zapisuje się jako (x,y), na przykład (3,-5). Wczytaj punkt w takim zapisie i wypisz w pierwszym wierszu jego współrzędne oddzielone spacją, a w drugim — punkt odbity względem prostej y = x, czyli z zamienionymi współrzędnymi: (y,x).'],
            input_format: ['W jedynym wierszu punkt w postaci (x,y), bez spacji.'],
            output_format: ['Dwa wiersze, jak w przykładzie.'],
            constraints: ['−1000 ≤ x, y ≤ 1000'],
            examples: [{ input: '(3,-5)' }],
            hint: R`Nawiasy i przecinek to trzy znaki do wczytania jako char: cin >> nawias >> x >> przecinek >> y >> nawias;. Przy wypisywaniu nawiasy i przecinek dopisz sam, jako tekst: cout << "(" << y << "," << x << ")\n";`,
            tests: (r) => ['(0,0)', '(-1000,1000)', '(7,7)', `(${r.int(-1000, 1000)},${r.int(-1000, 1000)})`, `(${r.int(-1000, 1000)},${r.int(-1000, 1000)})`, `(${r.int(-9, 9)},${r.int(-9, 9)})`],
            solve: (inp) => { const [x, y] = inp.trim().slice(1, -1).split(',').map(Number); return join(`${x} ${y}`, `(${y},${x})`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int x, y;
    char nawias, przecinek;
    cin >> nawias >> x >> przecinek >> y >> nawias;
    cout << x << " " << y << "\n";
    cout << "(" << y << "," << x << ")\n";
    return 0;
}`,
        },

        // ================================================================ KROK 3 · getline
        {
            id: 'io-linia-w-nawiasach', krok: 3, level: 'latwe',
            title: 'Cała linia w nawiasach',
            short: 'Wczytaj zdanie ze spacjami i wypisz je w nawiasach kwadratowych.',
            tags: ['getline', 'string'],
            statement: [
                'Wczytaj jeden wiersz tekstu — może zawierać spacje — i wypisz go w nawiasach kwadratowych, np. [Ala ma kota].',
                'Zwykłe cin >> s wczytałoby tylko pierwsze słowo. Cały wiersz wczytuje getline(cin, s).',
            ],
            input_format: ['Jeden wiersz tekstu: słowa z liter alfabetu angielskiego oddzielone pojedynczymi spacjami.'],
            output_format: ['Ten sam wiersz w nawiasach kwadratowych.'],
            constraints: ['wiersz ma od 1 do 100 znaków', 'wiersz nie zaczyna się ani nie kończy spacją'],
            examples: [{ input: 'Ala ma kota' }],
            hint: R`string zdanie; getline(cin, zdanie); cout << "[" << zdanie << "]\n";`,
            tests: (r) => ['x', 'Bajtek', 'Ala ma kota i psa', Zdanie(r, 5), Zdanie(r, 9), Zdanie(r, 14), zdanie(r, 2)],
            solve: (inp) => `[${lines(inp.trim())[0]}]`,
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string zdanie;
    getline(cin, zdanie);
    cout << "[" << zdanie << "]\n";
    return 0;
}`,
        },
        {
            id: 'io-dlugosc-zdania', krok: 3, level: 'latwe',
            title: 'Ile znaków ma zdanie?',
            short: 'Wczytaj całą linię i podaj jej długość — spacje też się liczą.',
            tags: ['getline', '.length()'],
            statement: ['Wczytaj jeden wiersz tekstu i wypisz, z ilu znaków się składa. Spacje też są znakami i też się liczą.'],
            input_format: ['Jeden wiersz tekstu: słowa oddzielone pojedynczymi spacjami.'],
            output_format: ['Jedna liczba — długość wiersza.'],
            constraints: ['wiersz ma od 1 do 100 znaków', 'wiersz nie zaczyna się ani nie kończy spacją'],
            examples: [{ input: 'Ala ma kota', note: '3 + 1 + 2 + 1 + 4 = 11 — dwie spacje też się liczą.' }],
            hint: 'Po getline(cin, s) długość całego wiersza to s.length() — razem ze spacjami. Gdybyś wczytał zdanie przez cin >> s, dostałbyś długość tylko pierwszego słowa.',
            tests: (r) => ['a', 'Bajtek', 'a b c d', Zdanie(r, 6), Zdanie(r, 12), zdanie(r, 3)],
            solve: (inp) => String(lines(inp.trim())[0].length),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    cout << s.length() << "\n";
    return 0;
}`,
        },
        {
            id: 'io-tytul-i-rok', krok: 3, level: 'latwe',
            title: 'Tytuł i rok',
            short: 'Najpierw wiersz z tytułem, potem liczba: getline, a po nim cin.',
            tags: ['getline', 'cin'],
            statement: [
                'W pierwszym wierszu wejścia jest tytuł książki (może mieć spacje), a w drugim — rok wydania. Wypisz je w jednym wierszu w postaci: Tytul (rok), np. Pan Tadeusz (1834).',
                'Taka kolejność jest bezpieczna: getline zabiera cały pierwszy wiersz razem z enterem, więc cin >> rok spokojnie wczyta liczbę z drugiego.',
            ],
            input_format: ['Pierwszy wiersz: tytuł (słowa oddzielone spacjami). Drugi wiersz: rok (liczba całkowita).'],
            output_format: ['Jeden wiersz: tytuł, spacja i rok w nawiasach okrągłych.'],
            constraints: ['tytuł ma od 1 do 60 znaków i nie zaczyna się ani nie kończy spacją', '1000 ≤ rok ≤ 2100'],
            examples: [{ input: 'Pan Tadeusz\n1834' }],
            hint: R`getline(cin, tytul); cin >> rok; cout << tytul << " (" << rok << ")\n";`,
            tests: (r) => ['Lalka\n1890', 'W pustyni i w puszczy\n1911', `${Zdanie(r, 3)}\n${r.int(1000, 2100)}`, `${Zdanie(r, 6)}\n${r.int(1000, 2100)}`, `${Zdanie(r, 1)}\n${r.int(1000, 2100)}`],
            solve: (inp) => { const l = lines(inp.trim()); return `${l[0]} (${Number(l[1])})`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string tytul;
    int rok;
    getline(cin, tytul);
    cin >> rok;
    cout << tytul << " (" << rok << ")\n";
    return 0;
}`,
        },
        {
            id: 'io-numer-i-tytul', krok: 3, level: 'srednie',
            title: 'Numer i tytuł rozdziału',
            short: 'Najpierw liczba, potem cały wiersz — tu bez cin.ignore() się nie obejdzie.',
            tags: ['getline', 'cin.ignore()'],
            statement: [
                'W pierwszym wierszu wejścia jest numer rozdziału, a w drugim — jego tytuł (może mieć spacje). Wypisz: Rozdzial N: TYTUL, np. Rozdzial 3: W krainie bitow.',
                'Uwaga na pułapkę z lekcji: cin >> numer zostawia na wejściu enter. Jeśli zaraz potem wywołasz getline, wczyta on pusty wiersz.',
            ],
            input_format: ['Pierwszy wiersz: numer (liczba całkowita). Drugi wiersz: tytuł.'],
            output_format: ['Jeden wiersz w postaci Rozdzial N: TYTUL.'],
            constraints: ['1 ≤ numer ≤ 1000', 'tytuł ma od 1 do 60 znaków i nie zaczyna się ani nie kończy spacją'],
            examples: [{ input: '3\nW krainie bitow' }],
            hint: 'Między cin >> numer a getline wstaw cin.ignore(); — wyrzuca ten jeden zostawiony enter. Możesz też napisać getline(cin >> ws, tytul); — ws przeskakuje wszystkie białe znaki przed tekstem.',
            tests: (r) => ['1\nWstep', '1000\nKoniec i bomba', `${r.int(1, 1000)}\n${Zdanie(r, 4)}`, `${r.int(1, 1000)}\n${Zdanie(r, 8)}`, `${r.int(1, 99)}\n${Zdanie(r, 2)}`],
            solve: (inp) => { const l = lines(inp.trim()); return `Rozdzial ${Number(l[0])}: ${l[1]}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int numer;
    string tytul;
    cin >> numer;
    cin.ignore();
    getline(cin, tytul);
    cout << "Rozdzial " << numer << ": " << tytul << "\n";
    return 0;
}`,
        },
        {
            id: 'io-pierwsze-slowo', krok: 3, level: 'trudne',
            title: 'Pierwsze słowo i reszta',
            short: 'Rozdziel zdanie na pierwsze słowo i resztę — bez spacji na początku reszty.',
            tags: ['cin >>', 'getline', 'ws'],
            statement: [
                'Wczytaj wiersz tekstu złożony z co najmniej dwóch słów. Wypisz w pierwszym wierszu samo pierwsze słowo, a w drugim — całą resztę zdania, bez spacji na początku.',
                'Pomysł: pierwsze słowo wczytaj zwykłym cin >>, a resztę wiersza — przez getline. Zastanów się tylko, co stanie się ze spacją, która stoi zaraz po pierwszym słowie.',
            ],
            input_format: ['Jeden wiersz: co najmniej dwa słowa oddzielone pojedynczymi spacjami.'],
            output_format: ['Dwa wiersze: pierwsze słowo i reszta zdania.'],
            constraints: ['wiersz ma od 3 do 100 znaków i nie zaczyna się ani nie kończy spacją'],
            examples: [{ input: 'Bajtek lubi programowac w C++' }],
            hint: 'Po cin >> slowo na wejściu zostaje spacja przed resztą zdania i getline by ją wczytał. Pomiń ją: cin >> slowo >> ws; getline(cin, reszta); — ws przeskakuje wszystkie spacje.',
            tests: (r) => ['a b', 'Ala ma kota', Zdanie(r, 2), Zdanie(r, 5), Zdanie(r, 11)],
            solve: (inp) => { const l = lines(inp.trim())[0]; const w = l.split(' ')[0]; return join(w, l.slice(w.length).replace(/^\s+/, '')); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string slowo, reszta;
    cin >> slowo >> ws;
    getline(cin, reszta);
    cout << slowo << "\n" << reszta << "\n";
    return 0;
}`,
        },
        {
            id: 'io-po-przecinku', krok: 3, level: 'trudne',
            title: 'Dane rozdzielone przecinkami',
            short: 'Jan,Kowalski,17 — getline czytający aż do przecinka.',
            tags: ["getline(cin, s, ',')", 'cin'],
            statement: [
                'Dane ucznia zapisano w jednym wierszu, oddzielając je przecinkami: imię, nazwisko i wiek, np. Jan,Kowalski,17. Imię może składać się z dwóch słów (np. Anna Maria). Wypisz dane w postaci: Kowalski Jan, 17 lat.',
                "getline umie czytać nie tylko do końca wiersza, ale do dowolnego znaku: getline(cin, s, ',') wczyta wszystko aż do najbliższego przecinka, a sam przecinek zabierze i wyrzuci.",
            ],
            input_format: ['Jeden wiersz w postaci imie,nazwisko,wiek.'],
            output_format: ['Jeden wiersz w postaci: nazwisko imie, wiek lat.'],
            constraints: ['imię i nazwisko mają od 1 do 30 znaków i nie zawierają przecinków', '1 ≤ wiek ≤ 120'],
            examples: [{ input: 'Jan,Kowalski,17' }, { input: 'Anna Maria,Nowak,15', note: 'getline do przecinka wczyta imię razem ze spacją.' }],
            hint: "getline(cin, imie, ','); getline(cin, nazwisko, ','); cin >> wiek; — dwa razy getline do przecinka, a liczbę na końcu wczytuje zwykły cin. Wypisz: cout << nazwisko << \" \" << imie << \", \" << wiek << \" lat\\n\";",
            tests: (r) => ['A,B,1', 'Bajtazar,Bitowski,120', `${capital(r.word(r.int(2, 10)))},${capital(r.word(r.int(2, 12)))},${r.int(1, 120)}`, `${capital(r.word(5))} ${capital(r.word(6))},${capital(r.word(8))},${r.int(1, 120)}`, `${capital(r.word(r.int(2, 10)))},${capital(r.word(r.int(2, 12)))},${r.int(1, 120)}`],
            solve: (inp) => { const [i, n, w] = inp.trim().split(','); return `${n} ${i}, ${Number(w)} lat`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string imie, nazwisko;
    int wiek;
    getline(cin, imie, ',');
    getline(cin, nazwisko, ',');
    cin >> wiek;
    cout << nazwisko << " " << imie << ", " << wiek << " lat\n";
    return 0;
}`,
        },

        // ================================================================ KROK 4 · fixed i setprecision
        {
            id: 'io-cztery-dokladnosci', krok: 4, level: 'latwe',
            title: 'Cztery dokładności',
            short: 'Wypisz tę samą liczbę z 0, 1, 2 i 3 cyframi po kropce.',
            tags: ['fixed', 'setprecision'],
            statement: [
                'Wczytaj liczbę rzeczywistą x i wypisz ją cztery razy, w czterech wierszach: z dokładnością do 0, 1, 2 i 3 miejsc po przecinku.',
                'Przy zero miejscach liczba jest zaokrąglana do całości i wypisuje się bez kropki.',
            ],
            input_format: ['Jedna liczba rzeczywista x.'],
            output_format: ['Cztery wiersze: x z 0, 1, 2 i 3 cyframi po kropce.'],
            constraints: ['0 < x < 10 000', 'x ma od 1 do 4 cyfr po kropce', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '2.7182' }],
            hint: R`Raz ustaw fixed, a potem przed każdą liczbą zmieniaj tylko setprecision: cout << fixed << setprecision(0) << x << "\n"; cout << setprecision(1) << x << "\n"; i tak dalej.`,
            tests: (r) => {
                const out = ['1.2', '9999.9876', '0.0001'].filter((s) => [0, 1, 2, 3].every((d) => safe(Number(s), d)));
                while (out.length < 10) {
                    const dd = r.int(1, 4), x = dec(r.int(1, 10000 * 10 ** dd - 1), dd);
                    if ([0, 1, 2, 3].every((d) => safe(Number(x), d))) out.push(x);
                }
                return out;
            },
            solve: (inp) => { const x = Number(toks(inp)[0]); return [0, 1, 2, 3].map((d) => fx(x, d)).join('\n'); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double x;
    cin >> x;
    cout << fixed;
    cout << setprecision(0) << x << "\n";
    cout << setprecision(1) << x << "\n";
    cout << setprecision(2) << x << "\n";
    cout << setprecision(3) << x << "\n";
    return 0;
}`,
        },
        {
            id: 'io-iloraz', krok: 4, level: 'latwe',
            title: 'Dokładny iloraz',
            short: 'Podziel dwie liczby całkowite i wypisz wynik z trzema cyframi po kropce.',
            tags: ['(double)', 'setprecision'],
            statement: ['Wczytaj dwie liczby całkowite a i b i wypisz iloraz a / b z dokładnością do trzech miejsc po przecinku.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Iloraz z dokładnie trzema cyframi po kropce.'],
            constraints: ['−10⁶ ≤ a ≤ 10⁶', '1 ≤ b ≤ 10⁶', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '22 7' }, { input: '-1 4' }],
            hint: 'Pamiętasz z lekcji o typach? a / b na int-ach obetnie ułamek. Zamień jedną z liczb na double: (double)a / b.',
            tests: (r) => {
                const out = ['0 1', '1000000 1', '1 1000000', '10 4'].filter((s) => { const [a, b] = s.split(' ').map(Number); return safe(a / b, 3); });
                while (out.length < 11) {
                    const a = r.int(-1e6, 1e6), b = r.int(1, r() < 0.5 ? 100 : 1e6);
                    if (safe(a / b, 3)) out.push(`${a} ${b}`);
                }
                return out;
            },
            solve: (inp) => { const [a, b] = nums(inp); return fx(a / b, 3); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << fixed << setprecision(3) << (double)a / b << "\n";
    return 0;
}`,
        },
        {
            id: 'io-km-na-mile', krok: 4, level: 'latwe',
            title: 'Kilometry na mile',
            short: 'Ta sama odległość w milach (z kropką) i w metrach (bez kropki).',
            tags: ['fixed', 'int a double'],
            statement: [
                'Wczytaj odległość w kilometrach (liczba całkowita) i wypisz w pierwszym wierszu, ile to mil, z dokładnością do trzech miejsc po przecinku (1 mila = 1.609344 km), a w drugim — ile to metrów.',
                'Zwróć uwagę, że fixed i setprecision działają tylko na liczby z przecinkiem — int wypisuje się jak zawsze, bez kropki.',
            ],
            input_format: ['Jedna liczba całkowita — odległość w kilometrach.'],
            output_format: ['Dwa wiersze: mile (trzy cyfry po kropce) i metry (liczba całkowita).'],
            constraints: ['1 ≤ km ≤ 100 000', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '10' }],
            hint: 'Mile to km / 1.609344 — liczba double, więc wypisze się z trzema cyframi po kropce. Metry to km * 1000 — to int, więc wypisze się bez kropki, nawet po ustawieniu fixed.',
            tests: (r) => {
                const out = ['1', '100000', '42'].filter((s) => safe(Number(s) / 1.609344, 3));
                while (out.length < 9) { const k = r.int(1, 100000); if (safe(k / 1.609344, 3)) out.push(String(k)); }
                return out;
            },
            solve: (inp) => { const k = reader(inp).int(); return join(fx(k / 1.609344, 3), k * 1000); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int km;
    cin >> km;
    cout << fixed << setprecision(3);
    cout << km / 1.609344 << "\n";
    cout << km * 1000 << "\n";
    return 0;
}`,
        },
        {
            id: 'io-cena-z-vat', krok: 4, level: 'srednie',
            title: 'Cena z VAT-em',
            short: 'Cena netto plus 23% podatku — wynik do pełnych groszy.',
            tags: ['double', 'setprecision(2)'],
            statement: ['Sklep podaje ceny bez podatku (netto). Wczytaj cenę netto i wypisz cenę brutto, czyli powiększoną o 23% podatku VAT, z dokładnością do dwóch miejsc po przecinku. Cena brutto to netto · 1.23.'],
            input_format: ['Jedna liczba rzeczywista z dwiema cyframi po kropce — cena netto.'],
            output_format: ['Cena brutto z dokładnie dwiema cyframi po kropce.'],
            constraints: ['0.01 ≤ netto ≤ 100 000.00', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '100.00' }, { input: '4.99', note: '4,99 · 1,23 = 6,1377 — po zaokrągleniu do groszy 6,14.' }],
            hint: R`double netto; cin >> netto; cout << fixed << setprecision(2) << netto * 1.23 << "\n";`,
            tests: (r) => {
                const out = ['1.00', '0.01', '100000.00'].filter((s) => safe(Number(s) * 1.23, 2));
                while (out.length < 10) { const c = dec(r.int(1, 10000000), 2); if (safe(Number(c) * 1.23, 2)) out.push(c); }
                return out;
            },
            solve: (inp) => fx(Number(toks(inp)[0]) * 1.23, 2),
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double netto;
    cin >> netto;
    cout << fixed << setprecision(2) << netto * 1.23 << "\n";
    return 0;
}`,
        },
        {
            id: 'io-srednia-pomiarow', krok: 4, level: 'srednie',
            title: 'Średnia z pomiarów',
            short: 'Cztery pomiary z przecinkiem — ich średnia z dwiema cyframi po kropce.',
            tags: ['double', 'setprecision', 'nawiasy'],
            statement: ['Termometr zmierzył temperaturę cztery razy. Wczytaj cztery pomiary (liczby rzeczywiste, każdy w osobnym wierszu) i wypisz ich średnią z dokładnością do dwóch miejsc po przecinku.'],
            input_format: ['Cztery wiersze, w każdym jedna liczba rzeczywista.'],
            output_format: ['Średnia z dokładnie dwiema cyframi po kropce.'],
            constraints: ['−50 ≤ pomiar ≤ 50', 'pomiary mają co najwyżej jedną cyfrę po kropce', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '21.5\n22\n23.5\n20.4' }],
            hint: 'Wczytaj cztery liczby do zmiennych double i podziel ich sumę przez 4. Nawias jest konieczny: (a + b + c + d) / 4.',
            tests: (r) => {
                const out = [];
                while (out.length < 10) {
                    const v = Array.from({ length: 4 }, () => dec(r.int(-500, 500), 1));
                    const [a, b, c, d] = v.map(Number);
                    if (safe((a + b + c + d) / 4, 2)) out.push(v.join('\n'));
                }
                return out;
            },
            solve: (inp) => { const [a, b, c, d] = nums(inp); return fx((a + b + c + d) / 4, 2); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double a, b, c, d;
    cin >> a >> b >> c >> d;
    cout << fixed << setprecision(2) << (a + b + c + d) / 4 << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 5 · setw i setfill
        {
            id: 'io-numer-z-zerami', krok: 5, level: 'latwe',
            title: 'Numer z zerami',
            short: 'Wypisz numer zawsze na pięciu cyfrach: 42 → 00042.',
            tags: ['setw', 'setfill'],
            statement: ['Numery biletów mają zawsze pięć cyfr. Wczytaj numer (liczbę całkowitą) i wypisz go na pięciu pozycjach, uzupełniając zerami z przodu — np. 42 to 00042.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Liczba n na pięciu pozycjach, z zerami z przodu.'],
            constraints: ['0 ≤ n ≤ 99 999'],
            examples: [{ input: '42' }, { input: '12345' }],
            hint: R`cout << setfill('0') << setw(5) << n << "\n"; — setw(5) rezerwuje pięć miejsc, a setfill('0') mówi, że puste miejsca mają być zerami. Oba mieszkają w <iomanip>.`,
            tests: (r) => ['0', '7', '99999', '100', '1000', String(r.int(0, 99999)), String(r.int(0, 999))],
            solve: (inp) => padL(reader(inp).int(), 5, '0'),
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << setfill('0') << setw(5) << n << "\n";
    return 0;
}`,
        },
        {
            id: 'io-zegar-hh-mm', krok: 5, level: 'latwe',
            title: 'Zegar cyfrowy',
            short: 'Godzina i minuta jako liczby → wypisz HH:MM, np. 09:05.',
            tags: ['setw(2)', "setfill('0')"],
            statement: ['Wczytaj godzinę i minutę (dwie liczby całkowite) i wypisz je tak, jak pokazuje zegar cyfrowy: HH:MM, zawsze po dwie cyfry — np. dla 9 5 wynik to 09:05.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite: godzina i minuta.'],
            output_format: ['Godzina w formacie HH:MM.'],
            constraints: ['0 ≤ godzina ≤ 23', '0 ≤ minuta ≤ 59'],
            examples: [{ input: '9 5' }, { input: '23 59' }],
            hint: R`setw działa tylko na najbliższą wypisywaną rzecz, więc powtórz go przed minutami: cout << setfill('0') << setw(2) << h << ":" << setw(2) << m << "\n";. setfill zostaje ustawiony na stałe.`,
            tests: (r) => ['0 0', '12 0', '0 59', '10 10', `${r.int(0, 23)} ${r.int(0, 59)}`, `${r.int(0, 9)} ${r.int(0, 9)}`, `${r.int(0, 23)} ${r.int(0, 59)}`],
            solve: (inp) => { const [g, m] = nums(inp); return `${z2(g)}:${z2(m)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int h, m;
    cin >> h >> m;
    cout << setfill('0') << setw(2) << h << ":" << setw(2) << m << "\n";
    return 0;
}`,
        },
        {
            id: 'io-data-z-zerami', krok: 5, level: 'srednie',
            title: 'Data w formacie DD.MM.RRRR',
            short: 'Rok, miesiąc i dzień jako liczby → wypisz datę z zerami: 04.11.2026.',
            tags: ['setw', 'setfill'],
            statement: ['Wczytaj rok, miesiąc i dzień (w tej kolejności) i wypisz datę w formacie DD.MM.RRRR — dzień i miesiąc zawsze dwucyfrowe, a rok czterocyfrowy.'],
            input_format: ['W jedynym wierszu trzy liczby całkowite: rok, miesiąc i dzień.'],
            output_format: ['Data w formacie DD.MM.RRRR.'],
            constraints: ['1000 ≤ rok ≤ 9999', '1 ≤ miesiąc ≤ 12', '1 ≤ dzień ≤ 31'],
            examples: [{ input: '2026 11 4' }],
            hint: R`Ustaw raz setfill('0'), a potem przed dniem i przed miesiącem wpisz setw(2): cout << setfill('0') << setw(2) << d << "." << setw(2) << m << "." << r << "\n";. Kolejność wypisywania jest inna niż wczytywania — to nic, zmienne pamiętają wartości.`,
            tests: (r) => ['1000 1 1', '9999 12 31', '2000 2 29', `${r.int(1000, 9999)} ${r.int(1, 12)} ${r.int(1, 31)}`, `${r.int(1000, 9999)} ${r.int(1, 9)} ${r.int(1, 9)}`, `${r.int(1000, 9999)} ${r.int(10, 12)} ${r.int(10, 31)}`],
            solve: (inp) => { const [y, m, d] = nums(inp); return `${z2(d)}.${z2(m)}.${y}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int r, m, d;
    cin >> r >> m >> d;
    cout << setfill('0') << setw(2) << d << "." << setw(2) << m << "." << r << "\n";
    return 0;
}`,
        },
        {
            id: 'io-rowna-kolumna', krok: 5, level: 'srednie',
            title: 'Równa kolumna liczb',
            short: 'Trzy liczby wyrównane do prawej w polu szerokości 8, w ramce | … |.',
            tags: ['setw', 'wyrównanie do prawej'],
            statement: [
                'Wczytaj trzy liczby całkowite i wypisz każdą w osobnym wierszu, wyrównaną do prawej w polu o szerokości 8 znaków, z pionową kreską | na początku i na końcu wiersza — tak jak w przykładzie.',
                'Dzięki temu cyfry jedności wszystkich liczb stoją jedna pod drugą, jak w tabelce.',
            ],
            input_format: ['Trzy wiersze, w każdym jedna liczba całkowita.'],
            output_format: ['Trzy wiersze, jak w przykładzie.'],
            constraints: ['−1 000 000 ≤ każda liczba ≤ 1 000 000'],
            examples: [{ input: '42\n-7\n12345' }],
            hint: R`cout << "|" << setw(8) << a << "|\n"; — setw(8) dosuwa liczbę do prawej i dopełnia spacjami z lewej. Powtórz to dla każdej z trzech liczb.`,
            tests: (r) => ['0\n0\n0', '-1000000\n1000000\n1', ...Array.from({ length: 4 }, () => `${r.int(-1e6, 1e6)}\n${r.int(-999, 999)}\n${r.int(0, 99)}`)],
            solve: (inp) => nums(inp).map((x) => `|${padL(x, 8)}|`).join('\n'),
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << "|" << setw(8) << a << "|\n";
    cout << "|" << setw(8) << b << "|\n";
    cout << "|" << setw(8) << c << "|\n";
    return 0;
}`,
        },
        {
            id: 'io-paragon', krok: 5, level: 'trudne',
            title: 'Paragon',
            short: 'Nazwy do lewej, ceny do prawej, kropki pomiędzy — jak na prawdziwym paragonie.',
            tags: ['left/right', 'setw', 'setfill', 'setprecision'],
            statement: [
                'Na wejściu są trzy wiersze, w każdym nazwa produktu (jedno słowo) i jego cena. Wypisz paragon: dla każdego produktu wiersz, w którym nazwa jest dosunięta do lewej w polu o szerokości 12 i dopełniona kropkami, a cena — dosunięta do prawej w polu o szerokości 8, dopełniona spacjami, z dwiema cyframi po kropce.',
                'Na końcu wypisz w ten sam sposób wiersz SUMA z sumą cen.',
            ],
            input_format: ['Trzy wiersze; w każdym nazwa (jedno słowo) i cena (liczba z dwiema cyframi po kropce).'],
            output_format: ['Cztery wiersze paragonu, jak w przykładzie.'],
            constraints: ['nazwa ma od 1 do 11 małych liter alfabetu angielskiego', '0.01 ≤ cena ≤ 9999.99'],
            examples: [{ input: 'chleb 4.50\nmleko 3.29\nser 12.99' }],
            hint: R`Najpierw raz: cout << fixed << setprecision(2);. Potem dla każdego wiersza: cout << left << setfill('.') << setw(12) << nazwa << right << setfill(' ') << setw(8) << cena << "\n";. Dosunięcie i wypełnienie trzeba przełączać, bo oba pola mają inne ustawienia.`,
            tests: (r) => ['a 0.01\nb 0.01\nc 0.01', 'abcdefghijk 9999.99\nmleko 1.00\nx 9999.99',
                ...Array.from({ length: 5 }, () => Array.from({ length: 3 }, () => `${r.word(r.int(1, 11))} ${dec(r.int(1, 999999), 2)}`).join('\n'))],
            solve: (inp) => {
                const t = toks(inp);
                const wiersz = (n, c) => padR(n, 12, '.') + padL(fx(c, 2), 8);
                const ceny = [Number(t[1]), Number(t[3]), Number(t[5])];
                return join(wiersz(t[0], ceny[0]), wiersz(t[2], ceny[1]), wiersz(t[4], ceny[2]), wiersz('SUMA', ceny[0] + ceny[1] + ceny[2]));
            },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string n1, n2, n3;
    double c1, c2, c3;
    cin >> n1 >> c1 >> n2 >> c2 >> n3 >> c3;
    cout << fixed << setprecision(2);
    cout << left << setfill('.') << setw(12) << n1 << right << setfill(' ') << setw(8) << c1 << "\n";
    cout << left << setfill('.') << setw(12) << n2 << right << setfill(' ') << setw(8) << c2 << "\n";
    cout << left << setfill('.') << setw(12) << n3 << right << setfill(' ') << setw(8) << c3 << "\n";
    cout << left << setfill('.') << setw(12) << "SUMA" << right << setfill(' ') << setw(8) << c1 + c2 + c3 << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 6 · printf i scanf
        {
            id: 'io-pierwsze-printf', krok: 6, level: 'latwe',
            title: 'Pierwsze printf',
            short: 'Wczytaj dwie liczby scanf-em i wypisz printf-em: a + b = suma.',
            tags: ['scanf', 'printf', '%d'],
            statement: ['Wczytaj dwie liczby całkowite i wypisz jeden wiersz w postaci a + b = suma, np. 2 + 3 = 5. Spróbuj użyć scanf do wczytania i printf do wypisania — sprawdzarka zaakceptuje też rozwiązanie z cin i cout, bo patrzy tylko na wynik.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Jeden wiersz w postaci a + b = suma.'],
            constraints: ['−10⁶ ≤ a, b ≤ 10⁶'],
            examples: [{ input: '2 3' }, { input: '-4 10' }],
            hint: R`scanf("%d %d", &a, &b); — nie zapomnij o & przed nazwami zmiennych! Potem printf("%d + %d = %d\n", a, b, a + b); — każde %d zostaje zastąpione kolejną wartością z listy po przecinku.`,
            tests: (r) => ['0 0', '1000000 1000000', '-1000000 5', `${r.int(-1e6, 1e6)} ${r.int(-1e6, 1e6)}`, `${r.int(-1e6, 1e6)} ${r.int(-1e6, 1e6)}`, `${r.int(0, 99)} ${r.int(0, 99)}`],
            solve: (inp) => { const [a, b] = nums(inp); return `${a} + ${b} = ${a + b}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a << " + " << b << " = " << a + b << "\n";
    return 0;
}`,
        },
        {
            id: 'io-printf-dwie-cyfry', krok: 6, level: 'latwe',
            title: 'Liczba i jej kwadrat w printf',
            short: 'printf("%.2f") — to samo co fixed i setprecision(2), w jednym kawałku.',
            tags: ['printf', '%.2f', 'scanf %lf'],
            statement: ['Wczytaj liczbę rzeczywistą x i wypisz w pierwszym wierszu x z dokładnością do dwóch miejsc po przecinku, a w drugim — jej kwadrat (x · x) z dokładnością do jednego miejsca po przecinku. Spróbuj zrobić to printf-em.'],
            input_format: ['Jedna liczba rzeczywista x.'],
            output_format: ['Dwa wiersze: x z dwiema cyframi po kropce i x · x z jedną.'],
            constraints: ['−1000 < x < 1000', 'x ma co najwyżej trzy cyfry po kropce', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '2.718' }],
            hint: R`Do wczytania double scanf potrzebuje %lf: scanf("%lf", &x);. Wypisujesz: printf("%.2f\n", x); oraz printf("%.1f\n", x * x);.`,
            tests: (r) => {
                const out = [];
                for (const s of ['1', '-3.141', '999.999']) if (safe(Number(s), 2) && safe(Number(s) * Number(s), 1)) out.push(s);
                while (out.length < 10) {
                    const x = dec(r.int(-999999, 999999), 3), v = Number(x);
                    if (safe(v, 2) && safe(v * v, 1)) out.push(x);
                }
                return out;
            },
            solve: (inp) => { const x = Number(toks(inp)[0]); return join(fx(x, 2), fx(x * x, 1)); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double x;
    cin >> x;
    cout << fixed << setprecision(2) << x << "\n";
    cout << setprecision(1) << x * x << "\n";
    return 0;
}`,
        },
        {
            id: 'io-scanf-czas', krok: 6, level: 'srednie',
            title: 'Czas w sekundach',
            short: 'scanf("%d:%d:%d") wczyta czas 01:02:03 w jednej linijce.',
            tags: ['scanf', 'wzorzec z separatorami'],
            statement: [
                'Wczytaj czas trwania w formacie GG:MM:SS (godziny, minuty, sekundy) i wypisz, ile to sekund.',
                'scanf potrafi wczytać dane razem z separatorami: wzorzec "%d:%d:%d" sam przeskoczy dwukropki.',
            ],
            input_format: ['W jedynym wierszu czas w formacie GG:MM:SS.'],
            output_format: ['Jedna liczba — czas w sekundach.'],
            constraints: ['00 ≤ GG ≤ 99', '00 ≤ MM ≤ 59', '00 ≤ SS ≤ 59'],
            examples: [{ input: '01:02:03' }],
            hint: R`scanf("%d:%d:%d", &g, &m, &s); printf("%d\n", g * 3600 + m * 60 + s); — dwukropki we wzorcu muszą pasować do dwukropków na wejściu. Z cin też się da: cin >> g >> c >> m >> c >> s;`,
            tests: (r) => ['00:00:00', '99:59:59', '00:00:59', '00:59:00', `${z2(r.int(0, 99))}:${z2(r.int(0, 59))}:${z2(r.int(0, 59))}`, `${z2(r.int(0, 9))}:${z2(r.int(0, 59))}:${z2(r.int(0, 59))}`],
            solve: (inp) => { const [g, m, s] = inp.trim().split(':').map(Number); return String(g * 3600 + m * 60 + s); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int g, m, s;
    char c;
    cin >> g >> c >> m >> c >> s;
    cout << g * 3600 + m * 60 + s << "\n";
    return 0;
}`,
        },
        {
            id: 'io-trzy-szerokosci', krok: 6, level: 'srednie',
            title: 'Trzy szerokości',
            short: 'Ta sama liczba jako [%6d], [%-6d] i [%06d].',
            tags: ['printf', '%6d', '%-6d', '%06d'],
            statement: ['Wczytaj liczbę całkowitą n i wypisz ją trzy razy, w trzech wierszach, w nawiasach kwadratowych: dosuniętą do prawej w polu o szerokości 6, dosuniętą do lewej w polu o szerokości 6 oraz uzupełnioną zerami do 6 cyfr.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Trzy wiersze, jak w przykładzie.'],
            constraints: ['0 ≤ n ≤ 999 999'],
            examples: [{ input: '42' }],
            hint: R`W printf szerokość wpisujesz między % a d: printf("[%6d]\n", n);. Minus oznacza dosunięcie do lewej: %-6d, a zero na początku — dopełnianie zerami: %06d. (W cout to odpowiednio setw(6), left << setw(6) i setfill('0') << setw(6).)`,
            tests: (r) => ['0', '7', '999999', '123456', String(r.int(0, 999999)), String(r.int(0, 999)), String(r.int(1000, 99999))],
            solve: (inp) => { const n = reader(inp).int(); return join(`[${padL(n, 6)}]`, `[${padR(n, 6)}]`, `[${padL(n, 6, '0')}]`); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << "[" << setw(6) << n << "]\n";
    cout << "[" << left << setw(6) << n << "]\n";
    cout << "[" << right << setfill('0') << setw(6) << n << "]\n";
    return 0;
}`,
        },
        {
            id: 'io-printf-lld', krok: 6, level: 'srednie',
            title: 'Duże liczby w printf',
            short: 'Iloczyn liczb do miliarda — %lld zamiast %d.',
            tags: ['printf', 'long long', '%lld'],
            statement: ['Wczytaj dwie liczby całkowite a i b i wypisz ich iloczyn. Liczby sięgają miliarda, więc wynik potrzebuje typu long long — a w printf i scanf long long ma własny znacznik: %lld.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Jedna liczba — a · b.'],
            constraints: ['1 ≤ a, b ≤ 10⁹'],
            examples: [{ input: '123456789 987654321' }],
            hint: R`long long a, b; scanf("%lld %lld", &a, &b); printf("%lld\n", a * b); — z %d printf wypisałby bzdurę, bo spodziewałby się zwykłego int-a.`,
            tests: (r) => ['1 1', '1000000000 1000000000', '65536 65536', `${r.int(1, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1, 1e5)} ${r.int(1, 1e5)}`],
            solve: (inp) => { const [a, b] = toks(inp).map(BigInt); return String(a * b); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    cout << a * b << "\n";
    return 0;
}`,
        },
    ];
};
