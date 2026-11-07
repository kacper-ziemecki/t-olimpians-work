// Modulo — baza zadań na koniec lekcji: od najłatwiejszych do najtrudniejszych (najpierw łatwe, potem średnie,
// na końcu trudne — build.js pilnuje tej kolejności). Każde zadanie łączy kilka zagadnień z lekcji,
// także z poprzednich lekcji (setw, pętle, napisy, long long). Bez tablic i bez funkcji.
module.exports = (h) => {
    const { nums, toks, bigs } = h;
    const R = String.raw;
    const p2 = (x) => String(x).padStart(2, '0');
    const idiv = (a, b) => (a - (a % b)) / b;
    const DNI = ['poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek', 'sobota', 'niedziela'];
    const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
    const mpow = (a, n, m) => { let w = 1n % m, p = a % m; while (n > 0n) { if (n % 2n === 1n) w = w * p % m; p = p * p % m; n /= 2n; } return w; };
    // a · x mod m bez BigInta (a, x < m ≤ 10⁹): każdy iloczyn częściowy jest mniejszy niż 2⁵³
    const mulmod = (a, x, m) => ((Math.floor(a / 32768) * x % m) * 32768 + (a % 32768) * x) % m;
    const E18 = '1000000000000000000';
    const hm = (t) => `${p2(idiv(t, 60))}:${p2(t % 60)}`;
    const cyfry = (r, len, first = '123456789', rest = '0123456789') => r.pick(first.split('')) + r.word(len - 1, rest);
    const mod97 = (s) => { let x = 0; for (const c of s) x = /[A-Z]/.test(c) ? (x * 100 + c.charCodeAt(0) - 55) % 97 : (x * 10 + Number(c)) % 97; return x; };
    const iban = (bban) => `PL${p2(98 - mod97(`${bban}PL00`))}${bban}`;
    const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const DL = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    return [
        // ================================================================ ŁATWE
        {
            id: 'mod-b-liczby-z-reszta', krok: 9, level: 'latwe',
            title: 'Liczby z resztą r',
            short: 'Wypisz liczby z przedziału, które przy dzieleniu przez k dają resztę r.',
            tags: ['x % k == r', 'pętla for', 'BRAK'],
            statement: ['Wypisz w jednym wierszu wszystkie liczby z przedziału od a do b (włącznie), które przy dzieleniu przez k dają resztę r. Jeśli nie ma ani jednej takiej liczby, wypisz BRAK.'],
            input_format: ['Jeden wiersz z liczbami a, b, k i r.'],
            output_format: ['Liczby oddzielone spacjami albo słowo BRAK.'],
            constraints: ['0 ≤ a ≤ b ≤ 10⁹', 'b − a ≤ 10 000', '1 ≤ k ≤ 10⁹', '0 ≤ r < k'],
            examples: [{ input: '10 30 7 3', note: '10 = 7 + 3, 17 = 14 + 3, 24 = 21 + 3.' }, { input: '1 5 10 7' }],
            hint: R`Najprościej: pętla od a do b i warunek x % k == r. Zapamiętaj w zmiennej bool, czy cokolwiek zostało wypisane — jeśli nie, po pętli wypisz BRAK.`,
            tests: (r) => ['10 30 7 3', '1 5 10 7', '0 10000 1 0', '0 0 5 0', '999990000 1000000000 3 2', '5 5 1000000000 5', '0 10000 999 998',
                (() => { const a = r.int(0, 1e9 - 10000); return `${a} ${a + r.int(0, 10000)} ${r.int(1, 50)} 0`; })(),
                (() => { const a = r.int(0, 1e6); const k = r.int(2, 2000); return `${a} ${a + r.int(0, 10000)} ${k} ${r.int(0, k - 1)}`; })()],
            check: (inp) => { const [a, b, k, rr] = nums(inp); return a <= b && b - a <= 10000 && rr < k ? null : 'zakres'; },
            solve: (inp) => { const [a, b, k, rr] = nums(inp); const o = []; for (let x = a; x <= b; x++) if (x % k === rr) o.push(x); return o.length ? o.join(' ') : 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, k, r;
    cin >> a >> b >> k >> r;
    bool cos = false;
    for (int x = a; x <= b; x++) {
        if (x % k == r) {
            cout << x << " ";
            cos = true;
        }
    }
    if (!cos) {
        cout << "BRAK";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-suma-ostatnich-cyfr', krok: 9, level: 'latwe',
            title: 'Suma ostatnich cyfr',
            short: 'Zsumuj ostatnie cyfry n ogromnych liczb.',
            tags: ['x % 10', 'long long', 'suma'],
            statement: ['Wczytaj n liczb całkowitych nieujemnych i wypisz sumę ich ostatnich cyfr.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '4\n15 27 100 9', note: '5 + 7 + 0 + 9 = 21.' }],
            hint: R`Ostatnia cyfra liczby x to x % 10. Liczby mogą mieć 19 cyfr, więc wczytuj je do long long. Suma to najwyżej 9 · 1000 — zmieści się w int.`,
            tests: (r) => {
                const mk = (n, f) => `${n}\n${Array.from({ length: n }, f).join(' ')}`;
                return ['4\n15 27 100 9', '1\n0', `1\n${E18}`, mk(1000, () => `${r.big(0, '100000000000000000')}9`), mk(1000, () => String(r.big(0, E18))), mk(30, () => String(r.int(0, 1000)))];
            },
            solve: (inp) => { const t = toks(inp); let s = 0; for (let i = 1; i <= Number(t[0]); i++) s += Number(t[i][t[i].length - 1]); return String(s); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int suma = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        suma += x % 10;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-co-k-ty-gratis', krok: 9, level: 'latwe',
            title: 'Co k-ty gratis',
            short: 'Co k-ty produkt za darmo. Ile zapłacisz? Wynik w formacie Z.GG.',
            tags: ['n / k', '/ 100 i % 100', 'setw(2)', 'long long'],
            statement: ['W sklepie trwa promocja: co k-ty kupiony produkt jest gratis. Ala kupuje n jednakowych produktów po c groszy za sztukę. Ile zapłaci? Wypisz kwotę w złotych w formacie Z.GG — zawsze z dwiema cyframi groszy.'],
            input_format: ['Jeden wiersz z liczbami n, k i c.'],
            output_format: ['Kwota w formacie Z.GG.'],
            constraints: ['1 ≤ n, k ≤ 10⁹', '1 ≤ c ≤ 10⁶'],
            examples: [{ input: '10 3 250', note: 'Gratis są 3., 6. i 9. produkt — płaci za 7 · 250 = 1750 groszy.' }, { input: '5 1 100', note: 'Co pierwszy produkt gratis, czyli wszystkie.' }],
            hint: R`Darmowych produktów jest n / k (k-ty, 2k-ty, 3k-ty, …), więc płaci się za n − n / k produktów. Kwota w groszach może sięgać 10^15 — long long. Wypisz ją jako kwota / 100, kropka i kwota % 100 przez setw(2) z setfill('0').`,
            tests: (r) => ['10 3 250', '5 1 100', '2 3 99', '1 1000000000 1', '1000000000 1000000000 1000000', '1000000000 2 999999', '7 7 5', `${r.int(1, 1e9)} ${r.int(1, 100)} ${r.int(1, 1e6)}`, `${r.int(1, 1000)} ${r.int(1, 10)} ${r.int(1, 999)}`],
            solve: (inp) => { const [n, k, c] = bigs(inp); const x = (n - n / k) * c; return `${x / 100n}.${p2(x % 100n)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    long long n, k, c;
    cin >> n >> k >> c;
    long long kwota = (n - n / k) * c;
    cout << kwota / 100 << "." << setw(2) << setfill('0') << kwota % 100 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-numer-mieszkania', krok: 9, level: 'latwe',
            title: 'Numer mieszkania',
            short: 'Piętra od parteru, mieszkania od 1. Na którym piętrze jest mieszkanie x?',
            tags: ['(x − 1) / k', '(x − 1) % k + 1', 'numeracja od 1'],
            statement: ['W bloku na każdym piętrze jest k mieszkań. Numeracja zaczyna się na parterze, czyli na piętrze 0: mieszkania od 1 do k są na parterze, od k + 1 do 2k — na pierwszym piętrze i tak dalej. Na każdym piętrze mieszkania mają też numer „na korytarzu” od 1 do k, licząc od windy. Wypisz piętro i numer na korytarzu mieszkania numer x.'],
            input_format: ['Jeden wiersz z liczbami k i x.'],
            output_format: ['Dwie liczby: piętro i numer na korytarzu.'],
            constraints: ['1 ≤ k ≤ 10⁹', '1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '4 13' }, { input: '4 4', note: 'Mieszkanie 4 to ostatnie na parterze.' }],
            hint: R`Przejdź na numerację od zera: x − 1. Piętro to (x − 1) / k — parter ma numer 0, więc tu już nie dodajesz jedynki. Numer na korytarzu to (x − 1) % k + 1.`,
            tests: (r) => ['4 13', '4 4', '1 7', '1000000000 1', `1000000000 ${E18}`, `1 ${E18}`, '6 7', `${r.int(1, 20)} ${r.int(1, 1000)}`, `${r.int(1, 1e9)} ${r.big(1, E18)}`],
            solve: (inp) => { const [k, x] = bigs(inp); return `${(x - 1n) / k} ${(x - 1n) % k + 1n}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long k, x;
    cin >> k >> x;
    cout << (x - 1) / k << " " << (x - 1) % k + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-kukulka', krok: 9, level: 'latwe',
            title: 'Zegar z kukułką',
            short: 'Kukułka kuka tyle razy, ile wskazuje tarcza 1–12. Ile razy od a:00 do b:00?',
            tags: ['h % 12', 'zero → 12', 'suma w pętli'],
            statement: ['Zegar z kukułką ma tarczę z liczbami od 1 do 12. O każdej pełnej godzinie kukułka kuka tyle razy, ile wskazuje mała wskazówka: o 13:00 — raz, a o 0:00 i o 12:00 — dwanaście razy. Ile razy kukułka zakuka od godziny a:00 do godziny b:00 tego samego dnia, licząc obie te godziny?'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ a ≤ b ≤ 23'],
            examples: [{ input: '11 13', note: '11 + 12 + 1 = 24.' }, { input: '0 23' }],
            hint: R`Dla godziny h kukułka kuka h % 12 razy — z wyjątkiem sytuacji, gdy wyjdzie 0: wtedy 12. Ten sam efekt daje jeden wzór: (h + 11) % 12 + 1. Sprawdź go dla h = 0, 12 i 13, a potem zsumuj w pętli od a do b.`,
            tests: (r) => ['11 13', '0 23', '5 5', '0 0', '12 12', '23 23', '0 12', '13 23', (() => { const a = r.int(0, 23); return `${a} ${r.int(a, 23)}`; })()],
            solve: (inp) => { const [a, b] = nums(inp); let s = 0; for (let x = a; x <= b; x++) s += x % 12 === 0 ? 12 : x % 12; return String(s); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int suma = 0;
    for (int h = a; h <= b; h++) {
        suma += (h + 11) % 12 + 1;
    }
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-dzien-w-roku', krok: 9, level: 'latwe',
            title: 'Który dzień tygodnia?',
            short: '1 stycznia to dany dzień tygodnia. Jakim dniem jest d-ty dzień roku?',
            tags: ['(numer + d − 1) % 7', 'nazwa ↔ numer'],
            statement: ['1 stycznia pewnego roku wypadł w dzień tygodnia podany słowem (poniedzialek, wtorek, sroda, czwartek, piatek, sobota albo niedziela). Jakim dniem tygodnia jest d-ty dzień tego roku? 1 stycznia to dzień numer 1. Wypisz nazwę bez polskich znaków.'],
            input_format: ['Jeden wiersz: nazwa dnia tygodnia i liczba d.'],
            output_format: ['Nazwa dnia tygodnia.'],
            constraints: ['1 ≤ d ≤ 366'],
            examples: [{ input: 'czwartek 32', note: 'W 2026 roku 1 stycznia był czwartkiem, a 1 lutego (dzień 32.) — niedzielą.' }, { input: 'czwartek 365' }],
            hint: R`Między dniem 1 a dniem d mija d − 1 dni. Zamień nazwę na numer od 0 do 6, dodaj d − 1, weź % 7 i zamień numer z powrotem na nazwę.`,
            tests: (r) => ['czwartek 32', 'czwartek 365', 'czwartek 1', 'niedziela 366', 'poniedzialek 8', ...DNI.map((d) => `${d} ${r.int(1, 366)}`)],
            solve: (inp) => { const [d, n] = toks(inp); return DNI[(DNI.indexOf(d) + Number(n) - 1) % 7]; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string dzien;
    int d;
    cin >> dzien >> d;
    int nr = 0;
    if (dzien == "poniedzialek") nr = 0;
    else if (dzien == "wtorek") nr = 1;
    else if (dzien == "sroda") nr = 2;
    else if (dzien == "czwartek") nr = 3;
    else if (dzien == "piatek") nr = 4;
    else if (dzien == "sobota") nr = 5;
    else nr = 6;
    switch ((nr + d - 1) % 7) {
        case 0: cout << "poniedzialek"; break;
        case 1: cout << "wtorek"; break;
        case 2: cout << "sroda"; break;
        case 3: cout << "czwartek"; break;
        case 4: cout << "piatek"; break;
        case 5: cout << "sobota"; break;
        default: cout << "niedziela";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-czas-slownie', krok: 9, level: 'latwe',
            title: 'Czas w słowach',
            short: 'Rozłóż sekundy na dni, godziny, minuty i sekundy — pomijając zera.',
            tags: ['/ 86400', '% 3600 / 60', 'if', 'long long'],
            statement: ['Wczytaj liczbę sekund t i zapisz ją jako dni, godziny, minuty i sekundy w postaci D d H h M min S s — ale pomiń te części, które wynoszą zero. Jeśli t = 0, wypisz 0 s.'],
            input_format: ['Jedna liczba całkowita t.'],
            output_format: ['Jeden wiersz — części oddzielone pojedynczymi spacjami.'],
            constraints: ['0 ≤ t ≤ 10¹⁸'],
            examples: [{ input: '90061', note: '86 400 + 3600 + 60 + 1.' }, { input: '3600' }, { input: '86460' }, { input: '0' }],
            hint: R`Rozłóż t: dni = t / 86400, godziny = t % 86400 / 3600, minuty = t % 3600 / 60, sekundy = t % 60. Każdą część wypisz w if-ie tylko wtedy, gdy nie jest zerem. Spacje: zmienna bool pierwsza mówi, czy przed kolejną częścią trzeba wstawić spację.`,
            tests: (r) => ['90061', '3600', '86460', '0', '59', '60', '86400', `${E18}`, '3661', String(r.int(1, 1e6)), String(r.big(1, E18))],
            solve: (inp) => {
                const t = bigs(inp)[0];
                if (t === 0n) return '0 s';
                const parts = [[t / 86400n, 'd'], [t % 86400n / 3600n, 'h'], [t % 3600n / 60n, 'min'], [t % 60n, 's']];
                return parts.filter(([v]) => v > 0n).map(([v, u]) => `${v} ${u}`).join(' ');
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long t;
    cin >> t;
    if (t == 0) {
        cout << "0 s\n";
        return 0;
    }
    long long d = t / 86400, g = t % 86400 / 3600, m = t % 3600 / 60, s = t % 60;
    bool pierwsza = true;
    if (d > 0) {
        cout << d << " d";
        pierwsza = false;
    }
    if (g > 0) {
        if (!pierwsza) cout << " ";
        cout << g << " h";
        pierwsza = false;
    }
    if (m > 0) {
        if (!pierwsza) cout << " ";
        cout << m << " min";
        pierwsza = false;
    }
    if (s > 0) {
        if (!pierwsza) cout << " ";
        cout << s << " s";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-zamiana-cyfr', krok: 9, level: 'latwe',
            title: 'Zamiana dwóch ostatnich cyfr',
            short: 'Zamień miejscami cyfrę jedności i cyfrę dziesiątek.',
            tags: ['n / 100', 'n / 10 % 10', 'n % 10'],
            statement: ['Wczytaj liczbę n, która ma co najmniej dwie cyfry, i zamień miejscami jej cyfrę jedności z cyfrą dziesiątek. Wypisz wynik jako liczbę — zera z przodu znikają: z 10 powstaje 01, czyli 1.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['10 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '1234' }, { input: '10' }, { input: '5550' }],
            hint: R`Rozbierz liczbę na trzy części: reszta = n / 100 (wszystko przed dwiema ostatnimi cyframi), d = n / 10 % 10 i j = n % 10. Złóż z powrotem z zamienionymi cyframi: reszta * 100 + j * 10 + d.`,
            tests: (r) => ['1234', '10', '5550', '99', '11', `${E18}`, '999999999999999999', String(r.big(10, '1000000')), String(r.big(10, E18))],
            solve: (inp) => { const s = String(bigs(inp)[0]); const t = s.slice(0, -2) + s[s.length - 1] + s[s.length - 2]; return String(BigInt(t)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long reszta = n / 100;
    long long d = n / 10 % 10, j = n % 10;
    cout << reszta * 100 + j * 10 + d << "\n";
    return 0;
}`,
        },

        // ================================================================ ŚREDNIE
        {
            id: 'mod-b-batony', krok: 9, level: 'srednie',
            title: 'Batony w paczkach',
            short: 'Batony pojedynczo albo w paczkach po k. Jak najtaniej kupić co najmniej n?',
            tags: ['n / k i n % k', 'trzy możliwości', 'min', 'long long'],
            statement: ['Batonik kosztuje s groszy, a paczka k batoników — p groszy. Chcesz mieć co najmniej n batoników i wydać jak najmniej. Ile najmniej zapłacisz? Możesz kupić dowolnie wiele paczek i pojedynczych batoników — nadmiar batoników Ci nie przeszkadza.'],
            input_format: ['Jeden wiersz z liczbami n, k, s i p.'],
            output_format: ['Jedna liczba — najmniejsza kwota w groszach.'],
            constraints: ['1 ≤ n, k ≤ 10⁹', '1 ≤ s, p ≤ 10⁹'],
            examples: [
                { input: '10 3 100 350', note: 'Paczka jest droższa niż 3 batoniki osobno — najtaniej kupić 10 pojedynczych.' },
                { input: '11 3 150 220', note: '4 paczki (12 batoników) za 880 są tańsze niż 3 paczki i 2 batoniki (960).' },
            ],
            hint: R`Opłaca się tylko jedna z trzech możliwości: same pojedyncze batoniki (n · s), n / k paczek i n % k batoników osobno albo n / k + 1 paczek. Policz wszystkie trzy i wybierz najmniejszą. Iloczyny mogą sięgać 10^18 — long long.`,
            tests: (r) => ['10 3 100 350', '11 3 150 220', '11 3 100 220', '1 1 1 1', '1000000000 1 1000000000 1000000000', '1000000000 1000000000 1000000000 1', '5 10 100 50', '12 3 10 20',
                `${r.int(1, 1e9)} ${r.int(1, 1000)} ${r.int(1, 1e6)} ${r.int(1, 1e9)}`, `${r.int(1, 100)} ${r.int(1, 10)} ${r.int(1, 100)} ${r.int(1, 1000)}`, `${r.int(1, 1e9)} ${r.int(1, 1e9)} ${r.int(1, 1e9)} ${r.int(1, 1e9)}`],
            solve: (inp) => {
                const [n, k, s, p] = bigs(inp);
                const c = [n * s, n / k * p + n % k * s, (n / k + 1n) * p];
                return String(c.reduce((a, b) => (b < a ? b : a)));
            },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    long long n, k, s, p;
    cin >> n >> k >> s >> p;
    long long a = n * s;
    long long b = n / k * p + n % k * s;
    long long c = (n / k + 1) * p;
    cout << min(a, min(b, c)) << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-obracanie-liczby', krok: 9, level: 'srednie',
            title: 'Obracanie liczby',
            short: 'Ostatnia cyfra wędruje na początek — k razy, a k może mieć 18 cyfr.',
            tags: ['n % 10 * p + n / 10', 'k % liczba cyfr', 'cykl'],
            statement: ['Obrót liczby to przeniesienie jej ostatniej cyfry na początek: 1234 → 4123 → 3412 → 2341 → 1234 → … Wczytaj liczbę n (w jej zapisie nie ma zer) i liczbę k i wypisz, jak będzie wyglądać n po k obrotach.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n < 10¹⁸, w zapisie n nie ma zer', '0 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '1234 1' }, { input: '1234 6', note: 'Po 4 obrotach liczba wraca do siebie, więc 6 obrotów to tyle samo co 2.' }],
            hint: R`Po tylu obrotach, ile liczba ma cyfr (d), wraca do siebie — wystarczy więc wykonać k % d obrotów. Jeden obrót to n = n % 10 * p + n / 10, gdzie p to 10 do potęgi d − 1. Najpierw policz pętlą d i p.`,
            tests: (r) => ['1234 1', '1234 6', '7 1000', '12 0', `987654321987654321 ${E18}`, '111111111111111111 999', `${cyfry(r, 18, '123456789', '123456789')} ${r.big(0, E18)}`, `${cyfry(r, 9, '123456789', '123456789')} ${r.int(0, 100)}`, `${cyfry(r, 13, '123456789', '123456789')} ${r.big(0, E18)}`],
            check: (inp) => (/^[1-9]+$/.test(toks(inp)[0]) && toks(inp)[0].length <= 18 ? null : 'n'),
            solve: (inp) => { const [s, k] = toks(inp); const d = s.length; const kk = Number(BigInt(k) % BigInt(d)); return s.slice(d - kk) + s.slice(0, d - kk); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    int d = 0;
    long long kopia = n;
    while (kopia > 0) {
        d++;
        kopia /= 10;
    }
    long long p = 1;
    for (int i = 1; i < d; i++) {
        p *= 10;
    }
    k %= d;
    for (long long i = 0; i < k; i++) {
        n = n % 10 * p + n / 10;
    }
    cout << n << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-system-na-system', krok: 9, level: 'srednie',
            title: 'Z systemu b na system c',
            short: 'Przelicz zapis liczby z systemu o podstawie b na system o podstawie c.',
            tags: ['x = x * b + cyfra', '% c i / c', 'string'],
            statement: ['Wczytaj liczbę zapisaną w systemie o podstawie b oraz podstawę c i wypisz tę samą liczbę zapisaną w systemie o podstawie c (bez zer z przodu).'],
            input_format: ['Jeden wiersz: podstawa b, zapis liczby w tym systemie i podstawa c.'],
            output_format: ['Zapis liczby w systemie o podstawie c.'],
            constraints: ['2 ≤ b, c ≤ 10', 'wartość liczby ≤ 10¹⁸', 'zapis nie ma zer z przodu (chyba że to po prostu 0)'],
            examples: [{ input: '2 1101 10' }, { input: '10 100 8' }, { input: '8 777 2' }],
            hint: R`Najpierw zamień zapis na zwykłą liczbę, idąc po znakach od lewej: x = x * b + (znak - '0'). Potem rozłóż x na cyfry w systemie c przez x % c i x /= c, doklejając je na początek napisu — w do … while, żeby zero dało "0".`,
            tests: (r) => {
                const out = ['2 1101 10', '10 100 8', '8 777 2', '5 0 3', '10 1000000000000000000 2', '2 1 2', '9 88888888 10'];
                for (let i = 0; i < 4; i++) { const v = r.big(0, i < 2 ? E18 : '100000'); const b = r.int(2, 10); out.push(`${b} ${v.toString(b)} ${r.int(2, 10)}`); }
                return out;
            },
            solve: (inp) => {
                const [b, s, c] = toks(inp);
                let x = 0n;
                for (const ch of s) x = x * BigInt(b) + BigInt(ch);
                return x.toString(Number(c));
            },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int b, c;
    string s;
    cin >> b >> s >> c;
    long long x = 0;
    for (char ch : s) {
        x = x * b + (ch - '0');
    }
    string w = "";
    do {
        w = char('0' + x % c) + w;
        x /= c;
    } while (x > 0);
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-przez-7-11-13', krok: 9, level: 'srednie',
            title: 'Przez 7, 11 i 13',
            short: 'Liczba ma do 10 000 cyfr. Przez które z liczb 7, 11, 13 się dzieli?',
            tags: ['r = (r * 10 + cyfra) % m', 'trzy reszty naraz', 'string'],
            statement: ['Wczytaj liczbę naturalną, która może mieć do 10 000 cyfr, i sprawdź, czy dzieli się przez 7, przez 11 i przez 13. Wypisz te z liczb 7, 11 i 13, przez które się dzieli — w kolejności rosnącej, oddzielone spacjami — albo BRAK, jeśli nie dzieli się przez żadną z nich.'],
            input_format: ['Jedna liczba naturalna bez zer z przodu.'],
            output_format: ['Liczby oddzielone spacjami albo słowo BRAK.'],
            constraints: ['liczba ma od 1 do 10 000 cyfr'],
            examples: [{ input: '1001', note: '1001 = 7 · 11 · 13.' }, { input: '77' }, { input: '10' }],
            hint: R`Dla każdego dzielnika licz resztę metodą z lekcji: r = (r * 10 + cyfra) % m, idąc po cyfrach od lewej. Trzy reszty (dla 7, 11 i 13) możesz liczyć naraz, w jednej pętli po napisie.`,
            tests: (r) => {
                const out = ['1001', '77', '10', '0', '143', '91', '1'];
                out.push(String(BigInt(cyfry(r, 9990)) * 1001n));
                out.push(String(BigInt(cyfry(r, 5000)) * 77n));
                out.push(cyfry(r, 10000));
                out.push(String(BigInt(cyfry(r, 3000)) * 13n));
                return out;
            },
            solve: (inp) => { const x = BigInt(inp.trim()); const o = [7n, 11n, 13n].filter((m) => x % m === 0n); return o.length ? o.join(' ') : 'BRAK'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int r7 = 0, r11 = 0, r13 = 0;
    for (char c : s) {
        int d = c - '0';
        r7 = (r7 * 10 + d) % 7;
        r11 = (r11 * 10 + d) % 11;
        r13 = (r13 * 10 + d) % 13;
    }
    if (r7 != 0 && r11 != 0 && r13 != 0) {
        cout << "BRAK";
    } else {
        if (r7 == 0) cout << "7 ";
        if (r11 == 0) cout << "11 ";
        if (r13 == 0) cout << "13 ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-ean13', krok: 9, level: 'srednie',
            title: 'Kod kreskowy EAN-13',
            short: 'Dopisz cyfrę kontrolną do 12 cyfr kodu kreskowego.',
            tags: ['wagi 1 i 3', 'i % 2', '(10 − suma % 10) % 10', 'string'],
            statement: [
                'Kod kreskowy EAN-13 (ten z opakowań w sklepie) ma 13 cyfr, a ostatnia z nich to cyfra kontrolna — dzięki niej kasa wykrywa pomyłkę przy odczycie. Liczy się ją tak: cyfry na pozycjach 1., 3., 5., …, 11. mnożymy przez 1, cyfry na pozycjach 2., 4., …, 12. — przez 3, i wszystko sumujemy. Cyfra kontrolna to liczba, którą trzeba dodać do tej sumy, żeby dostać najbliższą wielokrotność 10 (0, jeśli suma już jest wielokrotnością 10).',
                'Wczytaj 12 pierwszych cyfr kodu i wypisz cały, 13-cyfrowy kod.',
            ],
            input_format: ['Jeden wiersz — 12 cyfr (pierwsza może być zerem).'],
            output_format: ['13 cyfr.'],
            constraints: ['dokładnie 12 cyfr'],
            examples: [{ input: '590123412345', note: 'Suma: 5 + 0 + 2 + 4 + 2 + 4 = 17 oraz 3 · (9 + 1 + 3 + 1 + 3 + 5) = 66, razem 83. Do 90 brakuje 7.' }, { input: '400638133393' }],
            hint: R`Wczytaj kod do zmiennej string. Znak s[i] (i liczone od 0) stoi na pozycji i + 1, więc waga to 1, gdy i % 2 == 0, a 3 w przeciwnym razie. Cyfra kontrolna to (10 − suma % 10) % 10 — drugie modulo zamienia 10 na 0. Wypisz s, a za nim tę cyfrę.`,
            tests: (r) => ['590123412345', '400638133393', '000000000000', '999999999999', '000000000001', ...Array.from({ length: 5 }, () => r.word(12, '0123456789'))],
            check: (inp) => (/^\d{12}$/.test(inp.trim()) ? null : 'format'),
            solve: (inp) => { const s = inp.trim(); let sum = 0; for (let i = 0; i < 12; i++) sum += Number(s[i]) * (i % 2 === 0 ? 1 : 3); return s + String((10 - sum % 10) % 10); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int suma = 0;
    for (int i = 0; i < 12; i++) {
        int d = s[i] - '0';
        if (i % 2 == 0) {
            suma += d;
        } else {
            suma += 3 * d;
        }
    }
    cout << s << (10 - suma % 10) % 10 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-zera-silni', krok: 9, level: 'srednie',
            title: 'Zera na końcu silni',
            short: 'Ile zer kończy liczbę n! dla n do 10¹⁸? Licz piątki, nie silnię.',
            tags: ['n / 5 + n / 25 + …', 'while', 'long long'],
            statement: ['Ile zer jest na końcu liczby n! = 1 · 2 · 3 · … · n? Na przykład 10! = 3 628 800 kończy się dwoma zerami. Liczba n jest tak duża, że silni nie da się policzyć — trzeba sprytniej.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '10' }, { input: '25', note: '25 = 5 · 5 daje od razu dwie piątki — dlatego wynik to 6, a nie 5.' }],
            hint: R`Każde zero na końcu to czynnik 10 = 2 · 5, a dwójek w silni jest zawsze więcej niż piątek — wystarczy policzyć piątki. Liczb podzielnych przez 5 jest n / 5, przez 25 (dają drugą piątkę) — n / 25, przez 125 — n / 125 … Najprościej: while (n > 0) { n /= 5; wynik += n; }.`,
            tests: (r) => ['10', '25', '4', '0', '5', '124', '125', E18, String(r.big(1, '1000000')), String(r.big(1, E18))],
            solve: (inp) => { let n = bigs(inp)[0]; let w = 0n; while (n > 0n) { n /= 5n; w += n; } return String(w); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long wynik = 0;
    while (n > 0) {
        n /= 5;
        wynik += n;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-lata-szybko', krok: 9, level: 'srednie',
            title: 'Lata przestępne — szybko',
            short: 'Ile lat przestępnych jest od a do b, gdy przedział ma 10¹⁸ lat?',
            tags: ['y / 4 − y / 100 + y / 400', 'f(b) − f(a − 1)', 'long long'],
            statement: ['Rok jest przestępny, gdy dzieli się przez 4, ale nie przez 100 — albo gdy dzieli się przez 400. Wczytaj a i b i wypisz, ile lat od a do b (włącznie) jest przestępnych. Tym razem przedział jest ogromny i pętla nie zdąży.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ a ≤ b ≤ 10¹⁸'],
            examples: [{ input: '1896 1912' }, { input: '1 2026' }],
            hint: R`Lat przestępnych od 1 do y jest y / 4 − y / 100 + y / 400: wszystkie podzielne przez 4, minus podzielne przez 100, plus z powrotem podzielne przez 400. Odpowiedź to ta liczba dla b minus ta liczba dla a − 1.`,
            tests: (r) => ['1896 1912', '1 2026', '1 1', '2000 2000', '1900 1900', `1 ${E18}`, `${E18} ${E18}`, (() => { const a = r.big(1, E18); return `${a} ${a + r.big(0, E18) % (BigInt(E18) - a + 1n)}`; })(), (() => { const a = r.int(1, 1e6); return `${a} ${a + r.int(0, 1e6)}`; })()],
            check: (inp) => { const [a, b] = bigs(inp); return a <= b ? null : 'a > b'; },
            solve: (inp) => { const [a, b] = bigs(inp); const f = (y) => y / 4n - y / 100n + y / 400n; return String(f(b) - f(a - 1n)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long y = b;
    long long doB = y / 4 - y / 100 + y / 400;
    y = a - 1;
    long long przedA = y / 4 - y / 100 + y / 400;
    cout << doB - przedA << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-szczesliwe', krok: 9, level: 'srednie',
            title: 'Liczby szczęśliwe',
            short: 'Zastępuj liczbę sumą kwadratów cyfr. Dojdziesz do 1 czy do 4?',
            tags: ['cyfry: % 10 i / 10', 'pętla w pętli', 'long long'],
            statement: ['Weź liczbę i zastąp ją sumą kwadratów jej cyfr. Powtarzaj. Jeśli w końcu dojdziesz do 1, liczba jest szczęśliwa — na przykład 19 → 82 → 68 → 100 → 1. Jeśli nie, wpadniesz w cykl, który zawsze przechodzi przez 4: 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4. Wczytaj n i wypisz TAK, jeśli jest szczęśliwa, albo NIE — a po spacji liczbę kroków, po których liczba stała się równa 1 albo 4.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jeden wiersz: TAK albo NIE i liczba kroków.'],
            constraints: ['1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '19' }, { input: '2', note: '2 → 4 — po jednym kroku jesteśmy w cyklu.' }, { input: '1' }],
            hint: R`Pętla while (n != 1 && n != 4): policz sumę kwadratów cyfr n (para n % 10 i n /= 10 na kopii albo w pętli wewnętrznej), podstaw ją pod n i zwiększ licznik kroków. Po pętli sprawdź, czy n == 1. Już po pierwszym kroku liczba jest mniejsza niż 19 · 81, więc kroków będzie niewiele.`,
            tests: (r) => ['19', '2', '1', '4', '7', '89', E18, '999999999999999999', String(r.int(1, 1000)), String(r.big(1, E18)), String(r.big(1, E18))],
            solve: (inp) => {
                let n = bigs(inp)[0];
                let k = 0;
                while (n !== 1n && n !== 4n) { let s = 0n; while (n > 0n) { const d = n % 10n; s += d * d; n /= 10n; } n = s; k++; }
                return `${n === 1n ? 'TAK' : 'NIE'} ${k}`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    int kroki = 0;
    while (n != 1 && n != 4) {
        long long s = 0;
        while (n > 0) {
            long long d = n % 10;
            s += d * d;
            n /= 10;
        }
        n = s;
        kroki++;
    }
    if (n == 1) {
        cout << "TAK " << kroki << "\n";
    } else {
        cout << "NIE " << kroki << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'mod-b-zegar-w-lustrze', krok: 9, level: 'srednie',
            title: 'Zegar w lustrze',
            short: 'Godzina odczytana z lustra — która jest naprawdę?',
            tags: ['(720 − t) % 720', 'zero → 12', 'setw i setfill'],
            statement: ['Tomek patrzy na zegar ze wskazówkami (tarcza od 1 do 12) odbity w lustrze. W lustrze wskazówki są odbite względem pionowej osi tarczy — wskazówka, która naprawdę wskazuje 3, w lustrze wskazuje 9. Tomek odczytuje z lustra godzinę HH:MM (HH od 01 do 12). Która godzina jest naprawdę? Wypisz ją tak samo — HH od 01 do 12.'],
            input_format: ['Jeden wiersz: godzina w formacie HH:MM.'],
            output_format: ['Godzina w formacie HH:MM.'],
            constraints: ['01 ≤ HH ≤ 12', '00 ≤ MM ≤ 59'],
            examples: [{ input: '03:00' }, { input: '02:40', note: 'Naprawdę jest 9:20: mała wskazówka między 9 a 10 odbija się między 2 a 3, a duża na 4 — na 8.' }, { input: '12:00' }],
            hint: R`Zamień godzinę na minuty od dwunastej: t = (HH % 12) · 60 + MM (dwunasta to 0). Odbicie zamienia czas t na (720 − t) % 720, bo tarcza ma 12 · 60 = 720 minut. Wynik zamień z powrotem na HH:MM — z tym, że godzinę 0 wypisz jako 12.`,
            tests: (r) => {
                const f = () => `${p2(r.int(1, 12))}:${p2(r.int(0, 59))}`;
                return ['03:00', '02:40', '12:00', '06:00', '12:30', '11:59', '12:01', '06:30', f(), f(), f()];
            },
            solve: (inp) => {
                const [hh, mm] = inp.trim().split(':').map(Number);
                const t = (720 - ((hh % 12) * 60 + mm)) % 720;
                const g = idiv(t, 60);
                return `${p2(g === 0 ? 12 : g)}:${p2(t % 60)}`;
            },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int h, m;
    char z;
    cin >> h >> z >> m;
    int t = (720 - (h % 12 * 60 + m)) % 720;
    int g = t / 60;
    if (g == 0) {
        g = 12;
    }
    cout << setfill('0') << setw(2) << g << ":" << setw(2) << t % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-grafik', krok: 9, level: 'srednie',
            title: 'Grafik dyżurów',
            short: 'Zsumuj czas dyżurów, z których część przechodzi przez północ.',
            tags: ['(koniec − start + 1440) % 1440', 'suma', '/ 60 i % 60'],
            statement: ['Pielęgniarka zapisuje w grafiku swoje dyżury: każdy jako godzinę rozpoczęcia i zakończenia HH:MM HH:MM. Dyżur może kończyć się następnego dnia (np. 22:00 06:00); każdy trwa co najmniej minutę i krócej niż dobę. Ile godzin i minut przepracowała łącznie? Wypisz wynik w postaci G h M min.'],
            input_format: ['W pierwszym wierszu n, w każdym z kolejnych n wierszy dwie godziny w formacie HH:MM.'],
            output_format: ['Jeden wiersz w postaci G h M min.'],
            constraints: ['1 ≤ n ≤ 1000', 'godzina rozpoczęcia i zakończenia dyżuru są różne'],
            examples: [{ input: '3\n22:00 06:00\n07:30 15:30\n23:45 00:15', note: '8 h + 8 h + 30 min.' }],
            hint: R`Dla każdego dyżuru policz minuty: (koniec − początek + 1440) % 1440. Zsumuj je, a na końcu rozłóż sumę: suma / 60 godzin i suma % 60 minut. Godziny mogą przekroczyć 24 — tu nic nie zawijamy.`,
            tests: (r) => {
                const sh = () => { const a = r.int(0, 1439); let b = r.int(0, 1439); if (a === b) b = (b + 7) % 1440; return `${hm(a)} ${hm(b)}`; };
                const mk = (n) => [String(n), ...Array.from({ length: n }, sh)].join('\n');
                return ['3\n22:00 06:00\n07:30 15:30\n23:45 00:15', '1\n00:00 23:59', '1\n23:59 00:00', '2\n12:00 11:59\n12:01 12:00', mk(10), mk(1000), mk(50)];
            },
            solve: (inp) => {
                const ls = inp.trim().split('\n');
                let s = 0;
                for (let i = 1; i <= Number(ls[0]); i++) { const v = ls[i].trim().split(/[\s:]+/).map(Number); s += (v[2] * 60 + v[3] - v[0] * 60 - v[1] + 1440) % 1440; }
                return `${idiv(s, 60)} h ${s % 60} min`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        int h1, m1, h2, m2;
        char z;
        cin >> h1 >> z >> m1 >> h2 >> z >> m2;
        suma += (h2 * 60 + m2 - (h1 * 60 + m1) + 1440) % 1440;
    }
    cout << suma / 60 << " h " << suma % 60 << " min\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-generator', krok: 9, level: 'srednie',
            title: 'Generator liczb pseudolosowych',
            short: 'x → (a · x + c) mod m. Policz n-tą liczbę i ile było parzystych.',
            tags: ['(a * x + c) % m', 'long long', 'licznik'],
            statement: ['Komputery często „losują” liczby wzorem xᵢ₊₁ = (a · xᵢ + c) mod m: każda kolejna liczba powstaje z poprzedniej. Wczytaj ziarno x₀ oraz a, c, m i n. Wypisz xₙ oraz to, ile spośród liczb x₁, x₂, …, xₙ jest parzystych.'],
            input_format: ['Jeden wiersz z liczbami x₀, a, c, m i n.'],
            output_format: ['Dwie liczby: xₙ i liczba parzystych wśród x₁, …, xₙ.'],
            constraints: ['1 ≤ m ≤ 10⁹', '0 ≤ x₀, a, c < m', '1 ≤ n ≤ 10⁷'],
            examples: [{ input: '1 5 3 16 5', note: 'x₁, …, x₅ to 8, 11, 10, 5, 12 — trzy parzyste.' }],
            hint: R`Pętla n razy: x = (a * x + c) % m, a po każdym kroku sprawdź, czy x % 2 == 0. Iloczyn a · x może sięgać 10^18 — wszystkie zmienne long long.`,
            tests: (r) => ['1 5 3 16 5', '0 0 0 1 10', '7 1 1 10 25', '123 110351524 12345 999999937 10',
                `${r.int(0, 999999936)} ${r.int(0, 999999936)} ${r.int(0, 999999936)} 999999937 10000000`, (() => { const m = r.int(2, 1e9); return `${r.int(0, m - 1)} ${r.int(0, m - 1)} ${r.int(0, m - 1)} ${m} ${r.int(1, 1e7)}`; })(), (() => { const m = r.int(2, 100); return `${r.int(0, m - 1)} ${r.int(0, m - 1)} ${r.int(0, m - 1)} ${m} ${r.int(1, 100)}`; })()],
            check: (inp) => { const [x, a, c, m] = nums(inp); return x < m && a < m && c < m ? null : 'zakres'; },
            solve: (inp) => {
                const [x0, a, c, m, n] = nums(inp);
                let x = x0, k = 0;
                for (let i = 0; i < n; i++) { x = (mulmod(a, x, m) + c) % m; if (x % 2 === 0) k++; }
                return `${x} ${k}`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long x, a, c, m;
    int n;
    cin >> x >> a >> c >> m >> n;
    int parzyste = 0;
    for (int i = 0; i < n; i++) {
        x = (a * x + c) % m;
        if (x % 2 == 0) {
            parzyste++;
        }
    }
    cout << x << " " << parzyste << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-malowanie-plotu', krok: 9, level: 'srednie',
            title: 'Malowanie płotu',
            short: 'Co a-ta sztacheta czerwona, co b-ta niebieska. Ile jakich — dla n do 10¹⁸?',
            tags: ['n / a', 'NWW', 'włączanie i wyłączanie', 'long long'],
            statement: ['Płot ma n sztachet ponumerowanych od 1 do n. Ala maluje na czerwono co a-tą sztachetę (a, 2a, 3a, …), a Bartek na niebiesko co b-tą. Sztachety, które pomalowali oboje, są fioletowe. Ile sztachet jest czerwonych, ile niebieskich, ile fioletowych i ile niepomalowanych?'],
            input_format: ['Jeden wiersz z liczbami n, a i b.'],
            output_format: ['Cztery liczby: czerwone, niebieskie, fioletowe i niepomalowane.'],
            constraints: ['1 ≤ n ≤ 10¹⁸', '1 ≤ a, b ≤ 10⁹'],
            examples: [{ input: '20 2 3', note: 'Fioletowe są 6, 12 i 18; czerwone 2, 4, 8, 10, 14, 16, 20; niebieskie 3, 9, 15.' }],
            hint: R`Ala pomalowała n / a sztachet, Bartek n / b, a oboje — te o numerach podzielnych przez NWW(a, b). Fioletowych jest n / nww, czerwonych n / a − n / nww, niebieskich n / b − n / nww, a resztę dopełnia n. NWW = a / NWD(a, b) * b — może przekroczyć n, wtedy fioletowych jest po prostu 0.`,
            tests: (r) => ['20 2 3', '1 1 1', '10 4 6', `${E18} 1 1`, `${E18} 1000000000 999999999`, '100 7 7', '5 10 20', `${r.big(1, E18)} ${r.int(1, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1, 1e6)} ${r.int(1, 100)} ${r.int(1, 100)}`],
            solve: (inp) => {
                const [n, a, b] = bigs(inp);
                const l = a / gcd(a, b) * b;
                const f = n / l, c = n / a - f, nb = n / b - f;
                return `${c} ${nb} ${f} ${n - c - nb - f}`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n, a, b;
    cin >> n >> a >> b;
    long long x = a, y = b;
    while (y != 0) {
        long long r = x % y;
        x = y;
        y = r;
    }
    long long nww = a / x * b;
    long long fiolet = n / nww;
    long long czerw = n / a - fiolet;
    long long nieb = n / b - fiolet;
    cout << czerw << " " << nieb << " " << fiolet << " " << n - czerw - nieb - fiolet << "\n";
    return 0;
}`,
        },

        // ================================================================ TRUDNE
        {
            id: 'mod-b-dwie-linie', krok: 9, level: 'trudne',
            title: 'Dwie linie autobusowe',
            short: 'Rozkłady z przesunięciem. Kiedy oba autobusy odjadą razem — albo NIGDY?',
            tags: ['(t − s) % p == 0', 'cykl reszt', 'zaokrąglanie w górę'],
            statement: ['Autobus linii A odjeżdża z przystanku w minutach s₁, s₁ + p₁, s₁ + 2p₁, …, a autobus linii B — w minutach s₂, s₂ + p₂, s₂ + 2p₂, … W której minucie po raz pierwszy oba autobusy odjadą jednocześnie? Jeśli to się nigdy nie zdarzy, wypisz NIGDY.'],
            input_format: ['Jeden wiersz z liczbami s₁, p₁, s₂ i p₂.'],
            output_format: ['Jedna liczba albo słowo NIGDY.'],
            constraints: ['0 ≤ s₁, s₂ ≤ 10⁶', '1 ≤ p₁, p₂ ≤ 1000'],
            examples: [{ input: '0 4 2 6' }, { input: '1 4 2 6', note: 'A odjeżdża w minutach nieparzystych, a B — w parzystych.' }, { input: '10 7 3 5' }],
            hint: R`Minuta t jest dobra, gdy t ≥ s₁, t ≥ s₂, (t − s₁) % p₁ == 0 i (t − s₂) % p₂ == 0. Sprawdzaj kolejne odjazdy A, zaczynając od pierwszego, który nie jest wcześniejszy niż s₂. Jak daleko? Reszta (t − s₂) % p₂ przy kolejnych odjazdach A powtarza się w kółko co najwyżej co p₂ odjazdów — jeśli w p₂ kolejnych odjazdach nic nie znalazłeś, odpowiedź to NIGDY.`,
            tests: (r) => ['0 4 2 6', '1 4 2 6', '10 7 3 5', '0 1 0 1', '1000000 1000 0 999', '0 1000 1000000 1000', '5 6 5 4', '3 999 1000000 997',
                `${r.int(0, 1e6)} ${r.int(1, 1000)} ${r.int(0, 1e6)} ${r.int(1, 1000)}`, `${r.int(0, 100)} ${r.int(1, 30)} ${r.int(0, 100)} ${r.int(1, 30)}`, `${r.int(0, 1e6)} ${2 * r.int(1, 500)} ${r.int(0, 1e6)} ${2 * r.int(1, 500)}`],
            solve: (inp) => {
                const [s1, p1, s2, p2] = nums(inp);
                let t = s1;
                if (t < s2) t = s1 + Math.ceil((s2 - s1) / p1) * p1;
                for (let j = 0; j < p2; j++, t += p1) if ((t - s2) % p2 === 0) return String(t);
                return 'NIGDY';
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long s1, p1, s2, p2;
    cin >> s1 >> p1 >> s2 >> p2;
    long long t = s1;
    if (t < s2) {
        t = s1 + (s2 - s1 + p1 - 1) / p1 * p1;
    }
    for (int j = 0; j < p2; j++) {
        if ((t - s2) % p2 == 0) {
            cout << t << "\n";
            return 0;
        }
        t += p1;
    }
    cout << "NIGDY\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-ostatnia-cyfra-giganta', krok: 9, level: 'trudne',
            title: 'Ostatnia cyfra giganta',
            short: 'a i n mają po 1000 cyfr. Jaka jest ostatnia cyfra aⁿ?',
            tags: ['cykl co 4', 'n % 4 z napisu', 'a % 10'],
            statement: ['Wczytaj dwie ogromne liczby a i n — każda może mieć do 1000 cyfr — i wypisz ostatnią cyfrę liczby aⁿ.'],
            input_format: ['Jeden wiersz: liczby a i n (bez zer z przodu).'],
            output_format: ['Jedna cyfra.'],
            constraints: ['0 ≤ a, 1 ≤ n', 'każda z liczb ma od 1 do 1000 cyfr'],
            examples: [{ input: '2 10' }, { input: '7 1000000000000000000000', note: 'Ostatnie cyfry potęg siódemki: 7, 9, 3, 1, 7, 9, 3, 1, … — a n dzieli się przez 4.' }],
            hint: R`Ostatnia cyfra aⁿ zależy tylko od ostatniej cyfry a i od reszty z dzielenia n przez 4, bo ostatnie cyfry potęg każdej cyfry powtarzają się co 4 (np. 2, 4, 8, 6, 2, …). Resztę n % 4 policz metodą „reszta z olbrzyma”. Jeśli wyszło 0, weź 4. Potem pomnóż ostatnią cyfrę a przez siebie tyle razy (modulo 10).`,
            tests: (r) => ['2 10', '7 1000000000000000000000', '12345678901234567890 3', '0 5', '1 99999', '5 1', '9 2', `${cyfry(r, 1000)} ${cyfry(r, 1000)}`, `${cyfry(r, 999)}3 ${cyfry(r, 999)}`, `${cyfry(r, 500)}8 ${cyfry(r, 700)}`, `${cyfry(r, 3)} ${cyfry(r, 1)}`],
            check: (inp) => { const [a, n] = toks(inp); return a.length <= 1000 && n.length <= 1000 && n !== '0' ? null : 'zakres'; },
            solve: (inp) => { const [a, n] = toks(inp); let e = BigInt(n) % 4n; if (e === 0n) e = 4n; return String(BigInt(a[a.length - 1]) ** e % 10n); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, n;
    cin >> a >> n;
    int ostatnia = a[a.length() - 1] - '0';
    int r = 0;
    for (char c : n) {
        r = (r * 10 + (c - '0')) % 4;
    }
    if (r == 0) {
        r = 4;
    }
    int w = 1;
    for (int i = 0; i < r; i++) {
        w = w * ostatnia % 10;
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-iban', krok: 9, level: 'trudne',
            title: 'Numer konta IBAN',
            short: 'Sprawdź sumę kontrolną numeru konta: litery na liczby i modulo 97.',
            tags: ['modulo 97', 'litery na liczby', 'reszta z olbrzyma', 'string'],
            statement: [
                'Polski numer konta w formacie IBAN ma postać PL i 26 cyfr, na przykład PL04123456789012345678901234. Dwie cyfry tuż po PL to suma kontrolna. Numer sprawdza się tak:',
                '1. Cztery pierwsze znaki (PL i dwie cyfry kontrolne) przenieś na koniec napisu.',
                '2. Każdą literę zamień na liczbę: A = 10, B = 11, …, Z = 35 (P to 25, a L to 21).',
                '3. Powstaje ogromna, 30-cyfrowa liczba. Numer jest poprawny, gdy jej reszta z dzielenia przez 97 wynosi 1.',
                'Wczytaj numer i wypisz POPRAWNY albo BLEDNY.',
            ],
            input_format: ['Jeden wiersz: PL i 26 cyfr, bez spacji.'],
            output_format: ['POPRAWNY albo BLEDNY.'],
            constraints: ['napis ma dokładnie 28 znaków: PL i 26 cyfr'],
            examples: [{ input: 'PL04123456789012345678901234' }, { input: 'PL04123456789012345678901235', note: 'Wystarczy zmienić jedną cyfrę, a suma kontrolna przestaje się zgadzać.' }],
            hint: R`Nie musisz budować ogromnej liczby. Licz resztę na bieżąco, jak w lekcji: najpierw znaki od indeksu 4 do końca, potem znaki 0–3. Cyfrę dokładasz przez r = (r * 10 + cyfra) % 97, a literę — jako dwie cyfry naraz: r = (r * 100 + (litera - 'A' + 10)) % 97.`,
            tests: (r) => {
                const out = ['PL04123456789012345678901234', 'PL04123456789012345678901235', iban('000000000000000000000000'), iban('111122223333444455556666')];
                for (let i = 0; i < 4; i++) out.push(iban(r.word(24, '0123456789')));
                const zly = iban(r.word(24, '0123456789'));
                out.push(zly.slice(0, 2) + zly[3] + zly[2] + zly.slice(4)); // zamienione cyfry kontrolne
                out.push(`PL${r.word(26, '0123456789')}`);
                const z2 = iban(r.word(24, '0123456789'));
                out.push(`${z2.slice(0, 10)}${z2[11]}${z2[10]}${z2.slice(12)}`); // zamienione sąsiednie cyfry
                return out;
            },
            check: (inp) => (/^PL\d{26}$/.test(inp.trim()) ? null : 'format'),
            solve: (inp) => { const s = inp.trim(); return mod97(s.slice(4) + s.slice(0, 4)) === 1 ? 'POPRAWNY' : 'BLEDNY'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    long long r = 0;
    for (int i = 4; i < s.length(); i++) {
        r = (r * 10 + (s[i] - '0')) % 97;
    }
    for (int i = 0; i < 4; i++) {
        if (s[i] >= 'A' && s[i] <= 'Z') {
            r = (r * 100 + (s[i] - 'A' + 10)) % 97;
        } else {
            r = (r * 10 + (s[i] - '0')) % 97;
        }
    }
    if (r == 1) {
        cout << "POPRAWNY\n";
    } else {
        cout << "BLEDNY\n";
    }
    return 0;
}`,
        },
        {
            id: 'mod-b-wyliczanka', krok: 9, level: 'trudne',
            title: 'Wyliczanka',
            short: 'Co k-te dziecko w kółku odpada. Kto zostanie ostatni?',
            tags: ['w = (w + k) % i', 'numeracja od 0', 'Józef Flawiusz'],
            statement: ['n dzieci stoi w kółku, ponumerowanych od 1 do n zgodnie z ruchem wskazówek zegara. Wyliczanka zaczyna się od dziecka nr 1 i odlicza k dzieci — k-te dziecko odpada z kółka, a liczenie zaczyna się od następnego. Dzieci odpadają, aż zostanie jedno. Które?'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Numer dziecka, które zostanie.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '5 2', note: 'Odpadają kolejno 2, 4, 1 i 5 — zostaje 3.' }, { input: '7 3' }],
            hint: R`Symulacja jest za wolna, ale jest piękny wzór. Ponumeruj dzieci od 0 i niech w to numer zwycięzcy, gdy w kółku jest i dzieci. Dla jednego dziecka w = 0. Gdy dzieci jest i, pierwsze odpada dziecko (k − 1) % i, a dalej gra toczy się jak w kółku z i − 1 dzieci — tylko z numerami przesuniętymi o k. Stąd w = (w + k) % i dla i = 2, 3, …, n. Odpowiedź to w + 1.`,
            tests: (r) => ['5 2', '7 3', '1 100', '2 1', '10 1', '1000000 1000000000', '1000000 2', '41 3', `${r.int(1, 1e6)} ${r.int(1, 1e9)}`, `${r.int(1, 100)} ${r.int(1, 20)}`],
            solve: (inp) => { const [n, k] = nums(inp); let w = 0; for (let i = 2; i <= n; i++) w = (w + k) % i; return String(w + 1); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n, k;
    cin >> n >> k;
    long long w = 0;
    for (long long i = 2; i <= n; i++) {
        w = (w + k) % i;
    }
    cout << w + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-ulamek-okresowy', krok: 9, level: 'trudne',
            title: 'Ułamek okresowy',
            short: 'Zapisz a/b z okresem w nawiasie: 1/6 = 0.1(6), 1/7 = 0.(142857).',
            tags: ['dzielenie pisemne', 'NWD', 'czynniki 2 i 5', 'powtórzona reszta'],
            statement: ['Każdy ułamek a/b ma rozwinięcie dziesiętne skończone albo okresowe, np. 1/4 = 0.25, 1/3 = 0.(3), 1/6 = 0.1(6), 1/7 = 0.(142857). Wczytaj a i b i wypisz rozwinięcie ułamka a/b: część całkowitą, a po kropce kolejne cyfry, przy czym okres — powtarzający się bez końca fragment — zapisz w nawiasie. Jeśli rozwinięcie jest skończone, nawiasu nie ma, a jeśli ułamek jest liczbą całkowitą — nie ma też kropki.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Rozwinięcie dziesiętne ułamka a/b.'],
            constraints: ['0 ≤ a ≤ 10⁹', '1 ≤ b ≤ 10 000'],
            examples: [{ input: '1 6' }, { input: '22 7' }, { input: '1 4' }, { input: '6 3' }],
            hint: R`Dzielenie pisemne daje kolejne reszty: r *= 10, cyfra r / b, r %= b. Okres zaczyna się, gdy reszta powtórzy się po raz pierwszy. Bez tablic wykryjesz to tak: skróć ułamek (a % b)/b przez NWD i policz, ile razy skrócony mianownik dzieli się przez 2, a ile przez 5 — większa z tych liczb to liczba cyfr przed okresem. Wypisz tyle cyfr. Jeśli reszta jest wtedy zerem — koniec. W przeciwnym razie zapamiętaj ją i wypisuj kolejne cyfry w nawiasie, aż ta sama reszta wróci.`,
            tests: (r) => ['1 6', '22 7', '1 4', '6 3', '1 3', '0 7', '1 9999', '1 9998', '7 12', '1000000000 9973', '123456 10000', '1 8192', '49 9800',
                `${r.int(0, 1e9)} ${r.int(1, 10000)}`, `${r.int(0, 100)} ${r.int(1, 100)}`],
            solve: (inp) => {
                const [a, b] = nums(inp);
                let s = String(idiv(a, b));
                let rr = a % b;
                if (rr === 0) return s;
                s += '.';
                const seen = new Map();
                let digits = '';
                while (rr !== 0 && !seen.has(rr)) { seen.set(rr, digits.length); rr *= 10; digits += idiv(rr, b); rr %= b; }
                if (rr === 0) return s + digits;
                const i = seen.get(rr);
                return `${s}${digits.slice(0, i)}(${digits.slice(i)})`;
            },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    cout << a / b;
    long long r = a % b;
    if (r == 0) {
        cout << "\n";
        return 0;
    }
    cout << ".";
    long long x = r, y = b;
    while (y != 0) {
        long long t = x % y;
        x = y;
        y = t;
    }
    r /= x;
    b /= x;
    long long m = b;
    int dwojki = 0, piatki = 0;
    while (m % 2 == 0) {
        m /= 2;
        dwojki++;
    }
    while (m % 5 == 0) {
        m /= 5;
        piatki++;
    }
    int przed = max(dwojki, piatki);
    for (int i = 0; i < przed; i++) {
        r *= 10;
        cout << r / b;
        r %= b;
    }
    if (r != 0) {
        cout << "(";
        long long start = r;
        do {
            r *= 10;
            cout << r / b;
            r %= b;
        } while (r != start);
        cout << ")";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-cyfra-daleko', krok: 9, level: 'trudne',
            title: 'Cyfra daleko po przecinku',
            short: 'k-ta cyfra po przecinku a / b, gdy k sięga 10¹⁸.',
            tags: ['szybkie potęgowanie', '10ᵏ⁻¹ mod b', 'dzielenie pisemne'],
            statement: ['Wczytaj a, b i k i wypisz k-tą cyfrę po przecinku w rozwinięciu dziesiętnym ułamka a / b. Tym razem k może sięgać 10¹⁸ — dzielenia pisemnego nie da się przeprowadzić krok po kroku.'],
            input_format: ['Jeden wiersz z liczbami a, b i k.'],
            output_format: ['Jedna cyfra.'],
            constraints: ['0 ≤ a ≤ 10⁹', '1 ≤ b ≤ 10⁹', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '1 7 3' }, { input: `1 7 ${E18}` }],
            hint: R`Każdy krok dzielenia pisemnego mnoży resztę przez 10 i bierze modulo b. Po k − 1 krokach reszta wynosi więc (a % b) · 10^(k−1) mod b. Potęgę 10^(k−1) mod b policz szybkim potęgowaniem, pomnóż przez a % b i weź % b. Wtedy k-ta cyfra to r · 10 / b.`,
            tests: (r) => ['1 7 3', `1 7 ${E18}`, '1 3 999', '0 5 1', '1 4 2', '1 4 3', `999999999 1000000000 ${E18}`, `${r.int(0, 1e9)} ${r.int(1, 1e9)} ${r.big(1, E18)}`, `${r.int(0, 1e9)} 999999937 ${r.big(1, E18)}`, `${r.int(0, 100)} ${r.int(1, 100)} ${r.int(1, 1000)}`],
            solve: (inp) => { const [a, b, k] = bigs(inp); const rr = (a % b) * mpow(10n, k - 1n, b) % b; return String(rr * 10n / b); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b, k;
    cin >> a >> b >> k;
    long long n = k - 1;
    long long pot = 10 % b, wynik = 1 % b;
    while (n > 0) {
        if (n % 2 == 1) {
            wynik = wynik * pot % b;
        }
        pot = pot * pot % b;
        n /= 2;
    }
    long long r = a % b * wynik % b;
    cout << r * 10 / b << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-lot', krok: 9, level: 'trudne',
            title: 'Lot przez strefy czasowe',
            short: 'Start, czas lotu i różnica stref. Jaki dzień i godzina przy lądowaniu?',
            tags: ['minuty od początku tygodnia', '% 10080', 'liczby ujemne', 'nazwy dni'],
            statement: ['Samolot startuje w dzień tygodnia D o godzinie HH:MM czasu lokalnego. Lot trwa t minut, a w mieście docelowym zegary pokazują o z godzin więcej niż w mieście startu (z może być ujemne). Jaki dzień tygodnia i która godzina będą w mieście docelowym w chwili lądowania? Dni tygodnia podawaj bez polskich znaków: poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela.'],
            input_format: ['Jeden wiersz: dzień tygodnia, godzina HH:MM oraz liczby całkowite t i z.'],
            output_format: ['Jeden wiersz: dzień tygodnia i godzina w formacie HH:MM.'],
            constraints: ['1 ≤ t ≤ 10⁵', '−12 ≤ z ≤ 14'],
            examples: [{ input: 'piatek 22:30 600 -6', note: 'Po 10 godzinach lotu w mieście startu jest sobota 8:30, a tam — 6 godzin wcześniej.' }, { input: 'poniedzialek 01:00 30 -3', note: 'Lądujemy „przed” startem: jeszcze w niedzielę.' }],
            hint: R`Licz wszystko w minutach od początku tygodnia (poniedziałek 0:00 to 0): numer dnia · 1440 + HH · 60 + MM + t + z · 60. Wynik może wyjść ujemny albo przekroczyć tydzień, więc zawiń go do tygodnia: ((x % 10080) + 10080) % 10080 — tydzień ma 7 · 1440 = 10 080 minut. Potem dzień to x / 1440, a x % 1440 to godzina i minuta.`,
            tests: (r) => ['piatek 22:30 600 -6', 'poniedzialek 01:00 30 -3', 'niedziela 23:00 120 0', 'poniedzialek 00:00 1 -12', 'niedziela 23:59 100000 14', 'sroda 12:00 1440 0',
                ...Array.from({ length: 5 }, () => `${r.pick(DNI)} ${hm(r.int(0, 1439))} ${r.int(1, 1e5)} ${r.int(-12, 14)}`)],
            solve: (inp) => {
                const [d, t, lot, z] = toks(inp);
                const [hh, mm] = t.split(':').map(Number);
                let x = DNI.indexOf(d) * 1440 + hh * 60 + mm + Number(lot) + Number(z) * 60;
                x = ((x % 10080) + 10080) % 10080;
                return `${DNI[idiv(x, 1440)]} ${hm(x % 1440)}`;
            },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string dzien;
    int h, m, t, z;
    char c;
    cin >> dzien >> h >> c >> m >> t >> z;
    int d = 0;
    if (dzien == "poniedzialek") d = 0;
    else if (dzien == "wtorek") d = 1;
    else if (dzien == "sroda") d = 2;
    else if (dzien == "czwartek") d = 3;
    else if (dzien == "piatek") d = 4;
    else if (dzien == "sobota") d = 5;
    else d = 6;
    int x = d * 1440 + h * 60 + m + t + z * 60;
    x = (x % 10080 + 10080) % 10080;
    switch (x / 1440) {
        case 0: cout << "poniedzialek"; break;
        case 1: cout << "wtorek"; break;
        case 2: cout << "sroda"; break;
        case 3: cout << "czwartek"; break;
        case 4: cout << "piatek"; break;
        case 5: cout << "sobota"; break;
        default: cout << "niedziela";
    }
    x %= 1440;
    cout << " " << setfill('0') << setw(2) << x / 60 << ":" << setw(2) << x % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-kwadraty-reszty', krok: 9, level: 'trudne',
            title: 'Kwadraty i reszty',
            short: 'Ile x od 1 do n (n do 10¹⁸) ma x² dające resztę r z dzielenia przez m?',
            tags: ['okresowość reszt', 'n / m pełnych okresów', 'ogon n % m'],
            statement: ['Wczytaj n, m i r. Ile jest liczb x od 1 do n, dla których x² daje przy dzieleniu przez m resztę r? Liczba n jest ogromna.'],
            input_format: ['Jeden wiersz z liczbami n, m i r.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 10¹⁸', '1 ≤ m ≤ 10⁶', '0 ≤ r < m'],
            examples: [{ input: '10 5 4', note: 'Pasują 2, 3, 7 i 8: ich kwadraty 4, 9, 49, 64 dają resztę 4 z dzielenia przez 5.' }, { input: `${E18} 10 6`, note: 'Kwadrat kończy się szóstką dokładnie wtedy, gdy liczba kończy się 4 albo 6.' }],
            hint: R`Reszta x² % m zależy tylko od reszty x % m: liczby x i x + m dają tę samą resztę z kwadratu. Wystarczy więc sprawdzić x = 1, 2, …, m — jeden pełny „okres” — i policzyć, ile z nich pasuje. Pełnych okresów w przedziale od 1 do n jest n / m, a na końcu zostaje „ogon” n % m liczb, które sprawdzasz osobno (to te same x = 1, …, n % m). x · x dla x ≤ 10^6 mieści się w long long.`,
            tests: (r) => ['10 5 4', `${E18} 10 6`, '7 7 3', '1 1 0', `${E18} 1000000 0`, `${E18} 999983 1`, '1000000 1000000 1', `${r.big(1, E18)} ${r.int(1, 1e6)} 0`, (() => { const m = r.int(1, 1e6); const x = r.int(1, m); return `${r.big(1, E18)} ${m} ${(x * x) % m}`; })(), (() => { const m = r.int(2, 50); return `${r.int(1, 1000)} ${m} ${r.int(0, m - 1)}`; })()],
            check: (inp) => { const [, m, rr] = nums(inp); return rr < m ? null : 'r'; },
            solve: (inp) => {
                const [n, mB, rB] = bigs(inp);
                const m = Number(mB), rr = Number(rB), ogon = Number(n % mB);
                let okres = 0, wOgonie = 0;
                for (let x = 1; x <= m; x++) if ((x * x) % m === rr) { okres++; if (x <= ogon) wOgonie++; }
                return String(n / mB * BigInt(okres) + BigInt(wOgonie));
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n, m, r;
    cin >> n >> m >> r;
    long long ogon = n % m;
    long long wOkresie = 0, wOgonie = 0;
    for (long long x = 1; x <= m; x++) {
        if (x * x % m == r) {
            wOkresie++;
            if (x <= ogon) {
                wOgonie++;
            }
        }
    }
    cout << n / m * wOkresie + wOgonie << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-b-dzien-tygodnia-daty', krok: 9, level: 'trudne',
            title: 'Wielki finał: jaki to dzień tygodnia?',
            short: 'Dowolna data od 1583 do 9999 — jaki to dzień tygodnia?',
            tags: ['lata przestępne', 'dni miesięcy', '% 7', 'wszystko naraz'],
            statement: [
                'W ostatnim zadaniu lekcji przyda się prawie wszystko: podzielność, lata przestępne, liczenie dni, długie liczby i zawijanie w kółko. Wczytaj datę w formacie DD.MM.RRRR i wypisz, jakim dniem tygodnia jest.',
                'Korzystamy z kalendarza gregoriańskiego, którego używamy dziś: rok jest przestępny, gdy dzieli się przez 4, ale nie przez 100 — albo gdy dzieli się przez 400. Gdyby ten kalendarz obowiązywał od zawsze, 1 stycznia roku 1 byłby poniedziałkiem. Dni tygodnia wypisuj bez polskich znaków: poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela.',
            ],
            input_format: ['Jeden wiersz: data w formacie DD.MM.RRRR.'],
            output_format: ['Nazwa dnia tygodnia.'],
            constraints: ['1583 ≤ RRRR ≤ 9999', 'data jest poprawna'],
            examples: [{ input: '07.11.2026' }, { input: '01.01.2000' }, { input: '29.02.2024' }],
            hint: R`Policz, ile dni minęło od 1 stycznia roku 1 do podanej daty. Pełne lata przed rokiem R to (R − 1) · 365 dni plus jeden dzień za każdy rok przestępny — tych jest (R − 1) / 4 − (R − 1) / 100 + (R − 1) / 400. Do tego dni pełnych miesięcy roku R (luty ma 29 dni w roku przestępnym) i jeszcze DD − 1. Reszta z dzielenia tej liczby przez 7 to numer dnia tygodnia: 0 — poniedziałek, 1 — wtorek, …, 6 — niedziela.`,
            tests: (r) => {
                const out = ['07.11.2026', '01.01.2000', '29.02.2024', '01.01.1583', '31.12.9999', '28.02.1900', '01.03.1900', '29.02.2000', '15.10.1583', '24.12.2026'];
                for (let i = 0; i < 5; i++) {
                    const y = r.int(1583, 9999), m = r.int(1, 12);
                    const dl = m === 2 && isLeap(y) ? 29 : DL[m - 1];
                    out.push(`${p2(r.int(1, dl))}.${p2(m)}.${y}`);
                }
                return out;
            },
            check: (inp) => {
                const [d, m, y] = inp.trim().split('.').map(Number);
                if (y < 1583 || y > 9999 || m < 1 || m > 12) return 'rok/miesiąc';
                return d >= 1 && d <= (m === 2 && isLeap(y) ? 29 : DL[m - 1]) ? null : 'dzień';
            },
            solve: (inp) => {
                // wzór Zellera — inna metoda niż w podpowiedzi, żeby dwie wzorcówki sprawdzały się nawzajem
                let [q, m, y] = inp.trim().split('.').map(Number);
                if (m < 3) { m += 12; y -= 1; }
                const K = y % 100, J = Math.floor(y / 100);
                const hz = (q + Math.floor((13 * (m + 1)) / 5) + K + Math.floor(K / 4) + Math.floor(J / 4) + 5 * J) % 7; // 0 = sobota
                return DNI[(hz + 5) % 7];
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int d, m, r;
    char z;
    cin >> d >> z >> m >> z >> r;
    long long dni = (long long)(r - 1) * 365 + (r - 1) / 4 - (r - 1) / 100 + (r - 1) / 400;
    bool przestepny = (r % 4 == 0 && r % 100 != 0) || r % 400 == 0;
    for (int i = 1; i < m; i++) {
        if (i == 2) {
            if (przestepny) dni += 29;
            else dni += 28;
        } else if (i == 4 || i == 6 || i == 9 || i == 11) {
            dni += 30;
        } else {
            dni += 31;
        }
    }
    dni += d - 1;
    switch (dni % 7) {
        case 0: cout << "poniedzialek"; break;
        case 1: cout << "wtorek"; break;
        case 2: cout << "sroda"; break;
        case 3: cout << "czwartek"; break;
        case 4: cout << "piatek"; break;
        case 5: cout << "sobota"; break;
        default: cout << "niedziela";
    }
    cout << "\n";
    return 0;
}`,
        },
    ];
};
