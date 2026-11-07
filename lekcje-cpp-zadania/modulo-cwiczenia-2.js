// Modulo — ćwiczenia w trakcie lekcji, części 5–8: zawijanie w kółko, liczby ujemne i pułapki, działania modulo
// (reszta z ogromnych liczb) oraz modulo na olimpiadzie (NWD, dzielenie pisemne, szybkie potęgowanie).
// Uczeń zna typy, wejście i wyjście, if / else, pętle while i for oraz napisy — ale jeszcze nie tablice ani funkcje.
module.exports = (h) => {
    const { nums, toks, bigs } = h;
    const R = String.raw;
    const p2 = (x) => String(x).padStart(2, '0');
    const idiv = (a, b) => (a - (a % b)) / b;
    const DNI = ['poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek', 'sobota', 'niedziela'];
    const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
    const mpow = (a, n, m) => { let w = 1n % m, p = a % m; while (n > 0n) { if (n % 2n === 1n) w = w * p % m; p = p * p % m; n /= 2n; } return w; };
    const MOD = 1000000007n;
    const E18 = '1000000000000000000';
    const hm = (t) => `${p2(idiv(t, 60))}:${p2(t % 60)}`;
    const cyfry = (r, len) => r.pick('123456789'.split('')) + r.word(len - 1, '0123456789');

    return [
        // ================================================================ KROK 5 · zawijanie w kółko
        {
            id: 'mod-za-k-godzin', krok: 5, level: 'latwe',
            title: 'Za k godzin',
            short: 'Jest h:00. Która pełna godzina będzie za k godzin?',
            tags: ['(h + k) % 24', 'long long'],
            statement: ['Jest pełna godzina h:00 (h od 0 do 23). Która pełna godzina będzie za k godzin? Po godzinie 23:00 przychodzi 0:00.'],
            input_format: ['Jeden wiersz z liczbami całkowitymi h i k.'],
            output_format: ['Jedna liczba od 0 do 23 — godzina.'],
            constraints: ['0 ≤ h ≤ 23', '0 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '20 50', note: '20 + 50 = 70, a 70 = 2 · 24 + 22.' }, { input: '23 1' }],
            hint: R`Godziny chodzą w kółko co 24, więc wynik to (h + k) % 24. k może mieć 19 cyfr — wczytaj je do long long (suma h + k nadal się zmieści).`,
            tests: (r) => ['20 50', '23 1', '5 240', '0 0', '23 0', `0 ${E18}`, `23 ${E18}`, `${r.int(0, 23)} ${r.int(0, 100)}`, `${r.int(0, 23)} ${r.big(0, E18)}`],
            solve: (inp) => { const [hh, k] = bigs(inp); return String((hh + k) % 24n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long h, k;
    cin >> h >> k;
    cout << (h + k) % 24 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-wzor-liter', krok: 5, level: 'latwe',
            title: 'Powtarzający się wzór',
            short: 'Napis z n liter, w którym w kółko powtarza się k pierwszych liter alfabetu.',
            tags: ["char('A' + i % k)", 'pętla for'],
            statement: ['Wypisz napis złożony z n liter, w którym w kółko powtarza się k pierwszych wielkich liter alfabetu angielskiego: dla k = 3 jest to ABCABCABC…'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jeden wiersz z n literami.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ k ≤ 26'],
            examples: [{ input: '8 3' }, { input: '5 1' }],
            hint: R`Litera na pozycji i (licząc od zera) to char('A' + i % k). Pętla for (int i = 0; i < n; i++) i w środku cout tej litery.`,
            tests: (r) => ['8 3', '5 1', '26 26', '1 26', '10000 26', '10000 7', `${r.int(30, 500)} ${r.int(2, 25)}`],
            solve: (inp) => { const [n, k] = nums(inp); return Array.from({ length: n }, (_, i) => String.fromCharCode(65 + i % k)).join(''); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    for (int i = 0; i < n; i++) {
        cout << char('A' + i % k);
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-miejsce-w-kinie', krok: 5, level: 'latwe',
            title: 'Miejsce w kinie',
            short: 'Bilet numer x — który rząd i które miejsce? Numeracja od 1.',
            tags: ['(x − 1) / k + 1', '(x − 1) % k + 1', 'numeracja od 1'],
            statement: ['W kinie w każdym rzędzie jest k miejsc. Bilety sprzedaje się po kolei: bilet nr 1 to rząd 1, miejsce 1; bilet nr k to rząd 1, miejsce k; bilet nr k + 1 to rząd 2, miejsce 1; i tak dalej. Wypisz rząd i miejsce dla biletu numer x.'],
            input_format: ['Jeden wiersz z liczbami k i x.'],
            output_format: ['Dwie liczby: numer rzędu i numer miejsca.'],
            constraints: ['1 ≤ k ≤ 10⁹', '1 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '10 37' }, { input: '10 40', note: 'Zwykłe 40 / 10 i 40 % 10 dałyby rząd 4 i miejsce 0 — a miejsca 0 nie ma.' }],
            hint: R`Przejdź na numerację od zera: bilet x ma numer x − 1. Wtedy rząd liczony od zera to (x − 1) / k, a miejsce liczone od zera to (x − 1) % k. Na koniec dodaj 1 do obu. Wszystko w long long.`,
            tests: (r) => ['10 37', '10 40', '1 5', '1000000000 1', `1000000000 ${E18}`, '7 7', '7 8', `${r.int(1, 100)} ${r.int(1, 10000)}`, `${r.int(1, 1e9)} ${r.big(1, E18)}`],
            solve: (inp) => { const [k, x] = bigs(inp); return `${(x - 1n) / k + 1n} ${(x - 1n) % k + 1n}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long k, x;
    cin >> k >> x;
    cout << (x - 1) / k + 1 << " " << (x - 1) % k + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-podawanie-pilki', krok: 5, level: 'latwe',
            title: 'Podawanie piłki',
            short: 'Dzieci w kółku od 1 do n, piłka przesuwa się o k. Kto ją dostaje?',
            tags: ['(s − 1 + k) % n + 1', 'pętla', 'numeracja od 1'],
            statement: ['n dzieci stoi w kółku, ponumerowanych od 1 do n zgodnie z ruchem wskazówek zegara. Piłkę ma dziecko numer s. Przy każdym podaniu piłka przesuwa się o k dzieci zgodnie z ruchem wskazówek zegara (po dziecku n jest znowu dziecko 1). Wypisz numery dzieci, które dostają piłkę w kolejnych t podaniach.'],
            input_format: ['Jeden wiersz z liczbami n, s, k i t.'],
            output_format: ['Jeden wiersz z t numerami dzieci.'],
            constraints: ['1 ≤ n ≤ 10⁹', '1 ≤ s ≤ n', '0 ≤ k ≤ 10⁹', '1 ≤ t ≤ 1000'],
            examples: [{ input: '5 1 2 6', note: '1 → 3 → 5 → 2 → 4 → 1 → 3.' }],
            hint: R`Numeracja jest od 1, więc użyj triku z lekcji: s = (s − 1 + k) % n + 1;. Wykonaj to t razy w pętli i za każdym razem wypisz s. Użyj long long — s − 1 + k może przekroczyć 2 miliardy.`,
            tests: (r) => ['5 1 2 6', '1 1 5 3', '10 10 1 5', '1000000000 1000000000 1000000000 1000', '7 3 0 4', '12 5 7 20',
                `${r.int(2, 50)} 1 ${r.int(1, 100)} ${r.int(10, 50)}`, (() => { const n = r.int(1, 1e9); return `${n} ${r.int(1, n)} ${r.int(0, 1e9)} 1000`; })()],
            check: (inp) => { const [n, s] = nums(inp); return s >= 1 && s <= n ? null : 's'; },
            solve: (inp) => {
                let [n, s, k, t] = nums(inp);
                const o = [];
                for (let i = 0; i < t; i++) { s = (s - 1 + k) % n + 1; o.push(s); }
                return o.join(' ');
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n, s, k;
    int t;
    cin >> n >> s >> k >> t;
    for (int i = 0; i < t; i++) {
        s = (s - 1 + k) % n + 1;
        cout << s << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-zegar-za-k-sekund', krok: 5, level: 'srednie',
            title: 'Zegar za k sekund',
            short: 'Zegar pokazuje HH:MM:SS. Co pokaże za k sekund (k do 10¹⁸)?',
            tags: ['% 86400', 'rozkładanie czasu', 'setw i setfill'],
            statement: ['Zegar pokazuje godzinę HH:MM:SS — od 00:00:00 do 23:59:59, a po 23:59:59 znowu 00:00:00. Wypisz, co pokaże za k sekund.'],
            input_format: ['Jeden wiersz: godzina w formacie HH:MM:SS i liczba całkowita k.'],
            output_format: ['Godzina w formacie HH:MM:SS.'],
            constraints: ['0 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '23:59:30 45' }, { input: '12:00:00 86400', note: 'Doba ma 86 400 sekund — zegar wraca do tej samej godziny.' }],
            hint: R`Zamień godzinę na sekundy od północy, dodaj k i weź resztę z dzielenia przez 86 400. Potem rozłóż wynik na godziny, minuty i sekundy, z zerami z przodu (setw i setfill). k jest ogromne — long long.`,
            tests: (r) => {
                const f = (t) => `${p2(idiv(t, 3600))}:${p2(idiv(t % 3600, 60))}:${p2(t % 60)}`;
                return ['23:59:30 45', '12:00:00 86400', '00:00:00 0', '23:59:59 1', `08:15:00 ${E18}`, `23:59:59 ${E18}`,
                    `${f(r.int(0, 86399))} ${r.int(0, 100000)}`, `${f(r.int(0, 86399))} ${r.big(0, E18)}`, `${f(r.int(0, 86399))} ${r.int(0, 1e9)}`];
            },
            solve: (inp) => {
                const v = inp.trim().split(/[\s:]+/).map((x) => BigInt(x));
                const t = Number((v[0] * 3600n + v[1] * 60n + v[2] + v[3]) % 86400n);
                return `${p2(idiv(t, 3600))}:${p2(idiv(t % 3600, 60))}:${p2(t % 60)}`;
            },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    long long h, m, s, k;
    char z;
    cin >> h >> z >> m >> z >> s >> k;
    long long t = (h * 3600 + m * 60 + s + k) % 86400;
    cout << setfill('0') << setw(2) << t / 3600 << ":" << setw(2) << t % 3600 / 60 << ":" << setw(2) << t % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-dzien-po-nazwie', krok: 5, level: 'srednie',
            title: 'Dzień tygodnia za k dni',
            short: 'Dziś jest dzień podany słowem. Jaki będzie za k dni (k do 10¹⁸)?',
            tags: ['% 7', 'nazwa ↔ numer', 'switch'],
            statement: ['Dziś jest dzień tygodnia podany słowem: poniedzialek, wtorek, sroda, czwartek, piatek, sobota albo niedziela. Jaki dzień tygodnia będzie za k dni? Wypisz jego nazwę w ten sam sposób — bez polskich znaków.'],
            input_format: ['Jeden wiersz: nazwa dnia tygodnia i liczba całkowita k.'],
            output_format: ['Nazwa dnia tygodnia.'],
            constraints: ['0 ≤ k ≤ 10¹⁸'],
            examples: [{ input: 'piatek 10', note: 'Za 7 dni znowu piątek, za kolejne 3 — poniedziałek.' }, { input: 'niedziela 1' }],
            hint: R`Zamień nazwę na numer od 0 (poniedziałek) do 6 (niedziela) łańcuchem if … else if, policz (numer + k) % 7 i zamień numer z powrotem na nazwę, na przykład instrukcją switch. k wczytaj do long long.`,
            tests: (r) => ['piatek 10', 'niedziela 1', 'sroda 700', 'poniedzialek 0', `sobota ${E18}`, `wtorek ${E18}`, `czwartek ${r.int(1, 100)}`,
                ...DNI.slice(0, 5).map((d) => `${d} ${r.big(0, E18)}`)],
            solve: (inp) => { const [d, k] = toks(inp); return DNI[Number((BigInt(DNI.indexOf(d)) + BigInt(k)) % 7n)]; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string dzien;
    long long k;
    cin >> dzien >> k;
    int d = 0;
    if (dzien == "poniedzialek") d = 0;
    else if (dzien == "wtorek") d = 1;
    else if (dzien == "sroda") d = 2;
    else if (dzien == "czwartek") d = 3;
    else if (dzien == "piatek") d = 4;
    else if (dzien == "sobota") d = 5;
    else d = 6;
    switch ((d + k) % 7) {
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
            id: 'mod-za-k-miesiecy', krok: 5, level: 'srednie',
            title: 'Za k miesięcy',
            short: 'Jest miesiąc m roku r. Jaki miesiąc i który rok będzie za k miesięcy?',
            tags: ['numeracja od 1', '/ 12 i % 12', 'long long'],
            statement: ['Jest miesiąc m roku r (miesiące numerujemy od 1 — styczeń — do 12 — grudzień). Jaki miesiąc i który rok będzie za k miesięcy?'],
            input_format: ['Jeden wiersz z liczbami r, m i k.'],
            output_format: ['Dwie liczby: rok i numer miesiąca.'],
            constraints: ['1 ≤ r ≤ 10⁹', '1 ≤ m ≤ 12', '0 ≤ k ≤ 10⁹'],
            examples: [{ input: '2026 11 2', note: 'Listopad 2026 → grudzień 2026 → styczeń 2027.' }, { input: '2026 1 11' }],
            hint: R`Policz miesiące od początku naszej ery w numeracji od zera: t = r * 12 + (m − 1) + k. Wtedy rok to t / 12, a miesiąc to t % 12 + 1. To ten sam trik co w lekcji: przejście na numerację od zera, modulo i powrót do numeracji od 1. Użyj long long — r · 12 nie zmieści się w int.`,
            tests: (r) => ['2026 11 2', '2026 1 11', '2026 12 0', '2026 12 1', '1 1 0', '1000000000 12 1000000000', '5 6 7', `${r.int(1, 3000)} ${r.int(1, 12)} ${r.int(0, 100)}`, `${r.int(1, 1e9)} ${r.int(1, 12)} ${r.int(0, 1e9)}`],
            solve: (inp) => { const [y, m, k] = nums(inp); const t = y * 12 + (m - 1) + k; return `${idiv(t, 12)} ${t % 12 + 1}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long r, m, k;
    cin >> r >> m >> k;
    long long t = r * 12 + (m - 1) + k;
    cout << t / 12 << " " << t % 12 + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-szachownica-pola', krok: 5, level: 'srednie',
            title: 'Szachownica z dużych pól',
            short: 'Narysuj szachownicę n × n, w której każde pole ma rozmiar s × s.',
            tags: ['(w / s + k / s) % 2', 'pętla w pętli'],
            statement: ['Narysuj kwadrat n × n ze znaków # i ., który wygląda jak szachownica, ale każde jej pole ma rozmiar s × s znaków. W lewym górnym rogu jest pole ze znakami #. Pola przy prawej i dolnej krawędzi mogą być ucięte.'],
            input_format: ['Jeden wiersz z liczbami n i s.'],
            output_format: ['n wierszy po n znaków.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ s ≤ 100'],
            examples: [{ input: '8 2' }, { input: '5 3' }],
            hint: R`Dla znaku w wierszu w i kolumnie k (oba liczone od zera) numer pola to w / s i k / s. Zwykła szachownica ma # tam, gdzie (w + k) % 2 == 0 — tutaj sprawdzasz (w / s + k / s) % 2 == 0.`,
            tests: (r) => ['8 2', '5 3', '1 1', '100 1', '100 100', '100 7', '10 3', `${r.int(10, 60)} ${r.int(2, 9)}`],
            solve: (inp) => {
                const [n, s] = nums(inp);
                const ls = [];
                for (let w = 0; w < n; w++) { let l = ''; for (let k = 0; k < n; k++) l += (Math.floor(w / s) + Math.floor(k / s)) % 2 === 0 ? '#' : '.'; ls.push(l); }
                return ls.join('\n');
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, s;
    cin >> n >> s;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < n; k++) {
            if ((w / s + k / s) % 2 == 0) {
                cout << '#';
            } else {
                cout << '.';
            }
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'mod-sygnalizacja', krok: 5, level: 'srednie',
            title: 'Sygnalizacja świetlna',
            short: 'Zielone, żółte, czerwone w kółko. Co świeci w sekundzie t?',
            tags: ['t % cykl', 'else if', 'long long'],
            statement: ['Sygnalizator w kółko pokazuje: światło zielone przez g sekund, potem żółte przez y sekund, potem czerwone przez r sekund — i znowu zielone. W sekundzie 0 właśnie zapaliło się zielone. Jakie światło świeci w sekundzie t? Przy g = 30 sekundy od 0 do 29 są zielone, a sekunda 30 jest już żółta.'],
            input_format: ['Jeden wiersz z liczbami g, y, r i t.'],
            output_format: ['Jedno słowo: zielone, zolte albo czerwone.'],
            constraints: ['1 ≤ g, y, r ≤ 10⁹', '0 ≤ t ≤ 10¹⁸'],
            examples: [{ input: '30 3 27 1000000', note: 'Cykl trwa 60 s, a 1 000 000 % 60 = 40 — to już czerwone.' }, { input: '30 3 27 30' }],
            hint: R`Cały cykl trwa g + y + r sekund i powtarza się w kółko, więc liczy się tylko reszta x = t % (g + y + r). Potem łańcuch: x < g — zielone; x < g + y — żółte; w pozostałych przypadkach — czerwone.`,
            tests: (r) => ['30 3 27 1000000', '30 3 27 30', '30 3 27 60', '30 3 27 59', '30 3 27 0', '1 1 1 2', `1000000000 1000000000 1000000000 ${E18}`,
                `${r.int(1, 100)} ${r.int(1, 10)} ${r.int(1, 100)} ${r.int(0, 1e6)}`, `${r.int(1, 1e9)} ${r.int(1, 1e9)} ${r.int(1, 1e9)} ${r.big(0, E18)}`, `5 2 7 ${r.big(0, E18)}`],
            solve: (inp) => { const [g, y, rr, t] = bigs(inp); const x = t % (g + y + rr); return x < g ? 'zielone' : x < g + y ? 'zolte' : 'czerwone'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long g, y, r, t;
    cin >> g >> y >> r >> t;
    long long x = t % (g + y + r);
    if (x < g) {
        cout << "zielone\n";
    } else if (x < g + y) {
        cout << "zolte\n";
    } else {
        cout << "czerwone\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 6 · liczby ujemne i pułapki
        {
            id: 'mod-reszta-nieujemna', krok: 6, level: 'latwe',
            title: 'Reszta jak w matematyce',
            short: 'Wypisz resztę od 0 do n − 1 także dla ujemnego a.',
            tags: ['((a % n) + n) % n', 'liczby ujemne', 'long long'],
            statement: ['W matematyce reszta z dzielenia przez n jest zawsze liczbą od 0 do n − 1, także dla liczb ujemnych: −7 przy dzieleniu przez 3 daje resztę 2, bo −7 = 3 · (−3) + 2. W C++ wyrażenie −7 % 3 daje −1. Wczytaj a i n i wypisz resztę „matematyczną”.'],
            input_format: ['Jeden wiersz z liczbami całkowitymi a i n.'],
            output_format: ['Jedna liczba od 0 do n − 1.'],
            constraints: ['−10¹⁸ ≤ a ≤ 10¹⁸', '1 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '-7 3' }, { input: '7 3' }, { input: '-6 3' }],
            hint: R`Gotowy wzór z lekcji: ((a % n) + n) % n. Pierwsze % daje liczbę od −(n − 1) do n − 1, dodanie n przenosi ją na plus, a drugie % poprawia przypadek, gdy a było dodatnie. Użyj long long.`,
            tests: (r) => ['-7 3', '7 3', '-6 3', '0 1', '-5 1', `-${E18} ${E18}`, `-1 ${E18}`, `${E18} 7`, `-${E18} 7`,
                `-${r.big(1, E18)} ${r.big(1, '1000000000')}`, `${r.big(0, E18)} ${r.big(1, E18)}`, `-${r.big(1, '1000')} ${r.int(2, 30)}`],
            solve: (inp) => { const [a, n] = bigs(inp); return String(((a % n) + n) % n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, n;
    cin >> a >> n;
    cout << ((a % n) + n) % n << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-nieparzyste-ujemne', krok: 6, level: 'latwe',
            title: 'Ile nieparzystych?',
            short: 'Policz liczby nieparzyste — także ujemne. Uwaga na x % 2 == 1.',
            tags: ['x % 2 != 0', 'liczby ujemne', 'licznik'],
            statement: ['Wczytaj n liczb całkowitych — dodatnich, ujemnych albo zer — i wypisz, ile z nich jest nieparzystych.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n3 -3 4 -8 -1', note: 'Nieparzyste są 3, −3 i −1.' }],
            hint: R`Pułapka z lekcji: dla liczb ujemnych x % 2 daje −1, a nie 1, więc warunek x % 2 == 1 nie wykryje −3. Pisz x % 2 != 0.`,
            tests: (r) => ['5\n3 -3 4 -8 -1', '1\n-1', '1\n0', '4\n-7 -5 -3 -1', `1000\n${r.arr(1000, -1e9, 1e9).join(' ')}`, `100\n${r.arr(100, -50, 0).join(' ')}`, `30\n${r.arr(30, -9, 9).join(' ')}`],
            solve: (inp) => { const v = nums(inp); return String(v.slice(1, 1 + v[0]).filter((x) => x % 2 !== 0).length); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ile = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x % 2 != 0) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-bezpieczne-modulo', krok: 6, level: 'latwe',
            title: 'Bezpieczne modulo',
            short: 'Wypisz a % b tak, jak liczy C++ — albo BLAD, gdy b = 0.',
            tags: ['if (b == 0)', 'znak reszty', 'long long'],
            statement: ['Wczytaj q par liczb a i b. Dla każdej pary wypisz w osobnym wierszu wynik wyrażenia a % b obliczony przez C++ — albo słowo BLAD, jeśli b = 0 (dzielenie przez zero wysypałoby program).'],
            input_format: ['W pierwszym wierszu q, w każdym z kolejnych q wierszy dwie liczby całkowite a i b.'],
            output_format: ['q wierszy: reszta albo słowo BLAD.'],
            constraints: ['1 ≤ q ≤ 100', '−10¹⁸ ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '4\n17 5\n-17 5\n17 -5\n10 0', note: 'Reszta ma w C++ znak liczby dzielonej: −17 % 5 to −2, a 17 % −5 to 2.' }],
            hint: R`Najpierw if (b == 0) — dopiero w else wolno policzyć a % b. Liczby mają do 19 cyfr, więc long long.`,
            tests: (r) => {
                const sgn = () => (r.int(0, 1) ? '-' : '');
                const gen = (q, f) => [String(q), ...Array.from({ length: q }, f)].join('\n');
                return ['4\n17 5\n-17 5\n17 -5\n10 0', '3\n0 0\n0 7\n-7 -3',
                    gen(30, () => `${sgn()}${r.int(0, 100)} ${r.int(0, 3) ? sgn() + r.int(1, 12) : 0}`),
                    gen(100, () => `${sgn()}${r.big(0, E18)} ${r.int(0, 9) ? sgn() + r.big(1, E18) : 0}`),
                    `2\n${E18} -${E18}\n-${E18} 1`];
            },
            solve: (inp) => {
                const v = bigs(inp);
                const o = [];
                for (let i = 0; i < Number(v[0]); i++) { const a = v[1 + 2 * i], b = v[2 + 2 * i]; o.push(b === 0n ? 'BLAD' : String(a % b)); }
                return o.join('\n');
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long a, b;
        cin >> a >> b;
        if (b == 0) {
            cout << "BLAD\n";
        } else {
            cout << a % b << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'mod-cofnij-zegarek', krok: 6, level: 'srednie',
            title: 'Cofamy zegarek',
            short: 'Zegarek pokazuje HH:MM. Jaką godzinę pokaże po cofnięciu o k minut?',
            tags: ['((t − k) % 1440 + 1440) % 1440', 'liczby ujemne'],
            statement: ['Zegarek pokazuje godzinę HH:MM. Cofamy go o k minut. Jaką godzinę pokaże? Przy cofaniu po 00:00 jest 23:59.'],
            input_format: ['Jeden wiersz: godzina w formacie HH:MM i liczba całkowita k.'],
            output_format: ['Godzina w formacie HH:MM.'],
            constraints: ['0 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '00:10 15' }, { input: '12:00 1440', note: 'Cofnięcie o pełną dobę nie zmienia godziny.' }],
            hint: R`Zamień godzinę na minuty od północy: t = h · 60 + m. Odejmij k i zawiń do doby z poprawką na liczby ujemne: ((t − k) % 1440 + 1440) % 1440. Wynik rozłóż na godziny i minuty z zerami z przodu.`,
            tests: (r) => ['00:10 15', '12:00 1440', '00:00 1', '23:59 0', `01:00 ${E18}`, `00:00 ${E18}`, `${hm(r.int(0, 1439))} ${r.int(0, 3000)}`, `${hm(r.int(0, 1439))} ${r.big(0, E18)}`, `${hm(r.int(0, 1439))} ${r.int(0, 1e9)}`],
            solve: (inp) => {
                const v = inp.trim().split(/[\s:]+/).map((x) => BigInt(x));
                const t = Number((((v[0] * 60n + v[1] - v[2]) % 1440n) + 1440n) % 1440n);
                return hm(t);
            },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    long long h, m, k;
    char z;
    cin >> h >> z >> m >> k;
    long long t = h * 60 + m;
    t = ((t - k) % 1440 + 1440) % 1440;
    cout << setfill('0') << setw(2) << t / 60 << ":" << setw(2) << t % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-seans-przez-polnoc', krok: 6, level: 'srednie',
            title: 'Seans przez północ',
            short: 'Ile trwa seans, który może skończyć się następnego dnia?',
            tags: ['(koniec − start + 1440) % 1440', 'minuty od północy'],
            statement: ['Seans zaczyna się o godzinie HH:MM i kończy o HH:MM — być może już następnego dnia. Wiadomo, że trwa co najmniej minutę i krócej niż dobę. Ile trwa? Wypisz w postaci G h M min.'],
            input_format: ['Jeden wiersz: godzina rozpoczęcia i godzina zakończenia w formacie HH:MM.'],
            output_format: ['Jeden wiersz w postaci G h M min.'],
            constraints: ['godziny rozpoczęcia i zakończenia są różne'],
            examples: [{ input: '22:30 01:15' }, { input: '10:00 12:05' }, { input: '23:59 23:58', note: 'Koniec jest „wcześniej” niż początek — czyli następnego dnia.' }],
            hint: R`Odejmij minuty od północy: koniec − początek. Jeśli seans przechodzi przez północ, różnica wychodzi ujemna — wtedy trzeba dodać pełną dobę. Jednym wzorem: (koniec − początek + 1440) % 1440.`,
            tests: (r) => {
                const out = ['22:30 01:15', '10:00 12:05', '23:59 23:58', '00:00 23:59', '23:59 00:00', '12:00 12:01'];
                for (let i = 0; i < 4; i++) { const a = r.int(0, 1439); let b = r.int(0, 1439); if (a === b) b = (b + 1) % 1440; out.push(`${hm(a)} ${hm(b)}`); }
                return out;
            },
            check: (inp) => { const [a, b] = toks(inp); return a !== b ? null : 'równe'; },
            solve: (inp) => {
                const v = inp.trim().split(/[\s:]+/).map(Number);
                const d = (v[2] * 60 + v[3] - (v[0] * 60 + v[1]) + 1440) % 1440;
                return `${idiv(d, 60)} h ${d % 60} min`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int h1, m1, h2, m2;
    char z;
    cin >> h1 >> z >> m1 >> h2 >> z >> m2;
    int d = (h2 * 60 + m2 - (h1 * 60 + m1) + 1440) % 1440;
    cout << d / 60 << " h " << d % 60 << " min\n";
    return 0;
}`,
        },
        {
            id: 'mod-dni-temu', krok: 6, level: 'srednie',
            title: 'Jaki dzień był k dni temu?',
            short: 'Numeracja dni od 1 i cofanie w czasie — dwa triki naraz.',
            tags: ['numeracja od 1', 'liczby ujemne', 'long long'],
            statement: ['Dziś jest dzień tygodnia numer d (1 — poniedziałek, 2 — wtorek, …, 7 — niedziela). Jaki dzień tygodnia był k dni temu? Wypisz jego numer.'],
            input_format: ['Jeden wiersz z liczbami d i k.'],
            output_format: ['Jedna liczba od 1 do 7.'],
            constraints: ['1 ≤ d ≤ 7', '0 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '1 1', note: 'Dzień przed poniedziałkiem była niedziela.' }, { input: '3 10' }],
            hint: R`Dwa triki naraz: numeracja od 1 (przejdź na 0…6, odejmując 1) i liczby ujemne (poprawka + 7). Wzór: ((d − 1 − k) % 7 + 7) % 7 + 1. k sięga 10^18 — long long.`,
            tests: (r) => ['1 1', '3 10', '5 14', '7 0', '1 0', `1 ${E18}`, `7 ${E18}`, `${r.int(1, 7)} ${r.int(0, 100)}`, `${r.int(1, 7)} ${r.big(0, E18)}`, `${r.int(1, 7)} ${r.big(0, E18)}`],
            solve: (inp) => { const [d, k] = bigs(inp); return String((((d - 1n - k) % 7n) + 7n) % 7n + 1n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long d, k;
    cin >> d >> k;
    cout << ((d - 1 - k) % 7 + 7) % 7 + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-kolo-w-obie-strony', krok: 6, level: 'srednie',
            title: 'Koło w obie strony',
            short: 'Pionek na okrągłej planszy chodzi do przodu i do tyłu. Gdzie stoi?',
            tags: ['((p + x) % n + n) % n', 'liczby ujemne', 'long long'],
            statement: ['Pionek stoi na polu 0 okrągłej planszy z polami od 0 do n − 1 (po polu n − 1 jest znowu pole 0). Wykonuje q ruchów: ruch x > 0 to x pól do przodu, a ruch x < 0 — |x| pól do tyłu. Wypisz numer pola po każdym ruchu.'],
            input_format: ['W pierwszym wierszu n i q, w drugim q liczb całkowitych — ruchy.'],
            output_format: ['Jeden wiersz z q numerami pól.'],
            constraints: ['1 ≤ n ≤ 10⁹', '1 ≤ q ≤ 1000', '−10¹⁸ ≤ x ≤ 10¹⁸'],
            examples: [{ input: '10 5\n3 -5 12 -100 7', note: '0 → 3 → 8 → 0 → 0 → 7.' }],
            hint: R`Po każdym ruchu: p = ((p + x) % n + n) % n;. Pole p jest mniejsze od n, więc p + x mieści się w long long. Bez poprawki na liczby ujemne pionek „wylądowałby” na polu −2.`,
            tests: (r) => {
                const sgn = () => (r.int(0, 1) ? '-' : '');
                const mk = (n, q, f) => `${n} ${q}\n${Array.from({ length: q }, f).join(' ')}`;
                return ['10 5\n3 -5 12 -100 7', '1 3\n5 -5 0', mk(12, 20, () => `${sgn()}${r.int(0, 30)}`), mk(r.int(1, 1e9), 1000, () => `${sgn()}${r.big(0, E18)}`),
                    mk(1000000000, 4, () => `-${E18}`), mk(7, 50, () => `${sgn()}${r.int(0, 1e9)}`)];
            },
            solve: (inp) => {
                const v = bigs(inp);
                const n = v[0];
                let p = 0n;
                const o = [];
                for (let i = 0; i < Number(v[1]); i++) { p = (((p + v[2 + i]) % n) + n) % n; o.push(p); }
                return o.join(' ');
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    int q;
    cin >> n >> q;
    long long p = 0;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        p = ((p + x) % n + n) % n;
        cout << p << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-iloraz-matematyczny', krok: 6, level: 'srednie',
            title: 'Iloraz i reszta po matematycznemu',
            short: 'Znajdź q i r takie, że a = b · q + r oraz 0 ≤ r < b — także dla ujemnego a.',
            tags: ['poprawka: r += b, q--', 'liczby ujemne', 'long long'],
            statement: ['Dla liczb całkowitych a i b > 0 istnieje dokładnie jedna para liczb q i r, dla której a = b · q + r oraz 0 ≤ r < b. Dla a ≥ 0 to zwykłe a / b i a % b, ale dla ujemnego a C++ liczy inaczej: −7 / 2 daje −3, a −7 % 2 daje −1. Matematycznie q = −4 i r = 1, bo −7 = 2 · (−4) + 1. Wczytaj a i b i wypisz matematyczne q i r.'],
            input_format: ['Jeden wiersz z liczbami całkowitymi a i b.'],
            output_format: ['Dwie liczby: q i r.'],
            constraints: ['−10¹⁸ ≤ a ≤ 10¹⁸', '1 ≤ b ≤ 10¹⁸'],
            examples: [{ input: '-7 2' }, { input: '7 2' }, { input: '-6 3', note: 'Dzieli się bez reszty — nic nie trzeba poprawiać.' }],
            hint: R`Zacznij od q = a / b i r = a % b policzonych przez C++. Jeśli r wyszło ujemne, popraw oba naraz: r += b; q--;. Równość a = b · q + r nadal się zgadza, a reszta wskoczyła do przedziału od 0 do b − 1.`,
            tests: (r) => ['-7 2', '7 2', '-6 3', '0 5', `-1 ${E18}`, `-${E18} 1`, `-${E18} 7`, `${E18} 3`, `-${r.big(1, E18)} ${r.big(1, '1000000000')}`, `-${r.big(1, '1000')} ${r.int(1, 30)}`, `${r.big(0, E18)} ${r.big(1, E18)}`],
            solve: (inp) => { const [a, b] = bigs(inp); let q = a / b, rr = a % b; if (rr < 0n) { rr += b; q -= 1n; } return `${q} ${rr}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long q = a / b, r = a % b;
    if (r < 0) {
        r += b;
        q--;
    }
    cout << q << " " << r << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 7 · działania modulo
        {
            id: 'mod-ostatnia-cyfra-iloczynu', krok: 7, level: 'latwe',
            title: 'Ostatnia cyfra iloczynu',
            short: 'Ostatnia cyfra iloczynu n ogromnych liczb — bez liczenia iloczynu.',
            tags: ['w = w * (x % 10) % 10', 'long long'],
            statement: ['Wczytaj n liczb naturalnych i wypisz ostatnią cyfrę ich iloczynu. Sam iloczyn może mieć tysiące cyfr — nie da się go policzyć wprost.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb całkowitych.'],
            output_format: ['Jedna cyfra.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '3\n47 85 13', note: '7 · 5 = 35 → 5, potem 5 · 3 = 15 → 5.' }, { input: '2\n123456789 987654321' }],
            hint: R`Ostatnia cyfra iloczynu zależy tylko od ostatnich cyfr czynników. Trzymaj w zmiennej w tylko ostatnią cyfrę wyniku: zacznij od 1 i po każdej liczbie x rób w = w * (x % 10) % 10.`,
            tests: (r) => {
                const mk = (n, f) => `${n}\n${Array.from({ length: n }, f).join(' ')}`;
                return ['3\n47 85 13', '2\n123456789 987654321', '1\n0', '1\n7', mk(1000, () => String(r.big(0, E18))), mk(1000, () => `${r.big(0, '100000000000000000')}${r.pick(['1', '3', '7', '9'])}`),
                    mk(20, () => String(r.int(1, 100))), mk(50, () => `${r.big(1, '1000000000000')}${r.pick(['1', '9'])}`)];
            },
            solve: (inp) => { const v = bigs(inp); let w = 1n; for (let i = 1; i <= Number(v[0]); i++) w = w * (v[i] % 10n) % 10n; return String(w); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long w = 1;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        w = w * (x % 10) % 10;
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-suma-modulo', krok: 7, level: 'latwe',
            title: 'Suma modulo m',
            short: 'Reszta z sumy liczb, których suma nie mieści się nawet w long long.',
            tags: ['s = (s + x % m) % m', 'long long'],
            statement: ['Wczytaj n liczb i liczbę m. Wypisz resztę z dzielenia ich sumy przez m. Liczby są tak duże, że ich suma nie zmieściłaby się nawet w long long.'],
            input_format: ['W pierwszym wierszu n i m, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 10¹⁸', '1 ≤ m ≤ 10¹⁸'],
            examples: [{ input: '3 10\n15 27 9' }, { input: `2 ${E18}\n999999999999999999 999999999999999999` }],
            hint: R`Reszta z sumy to reszta z sumy reszt. Po każdej liczbie: s = (s + x % m) % m;. Obie reszty są mniejsze od m ≤ 10^18, więc ich suma (mniej niż 2 · 10^18) mieści się w long long.`,
            tests: (r) => {
                const mk = (n, m, f) => `${n} ${m}\n${Array.from({ length: n }, f).join(' ')}`;
                return ['3 10\n15 27 9', `2 ${E18}\n999999999999999999 999999999999999999`, '1 1\n123', mk(1000, '999999999999999999', () => E18), mk(1000, r.big(1, E18), () => String(r.big(0, E18))),
                    mk(1000, '1000000007', () => String(r.big(0, E18))), mk(10, r.int(2, 100), () => String(r.int(0, 1000)))];
            },
            solve: (inp) => { const v = bigs(inp); const m = v[1]; let s = 0n; for (let i = 0; i < Number(v[0]); i++) s = (s + v[2 + i]) % m; return String(s); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    long long m;
    cin >> n >> m;
    long long s = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        s = (s + x % m) % m;
    }
    cout << s << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-silnia-modulo', krok: 7, level: 'latwe',
            title: 'Silnia modulo 10⁹ + 7',
            short: 'n! modulo 1 000 000 007 dla n do 10 milionów.',
            tags: ['MOD = 1000000007', 'w = w * i % MOD', 'long long'],
            statement: ['Silnia n! to iloczyn 1 · 2 · 3 · … · n (a 0! = 1). Już 21! nie mieści się w long long. Wypisz resztę z dzielenia n! przez 1 000 000 007.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ n ≤ 10⁷'],
            examples: [{ input: '10', note: '10! = 3 628 800 — mniej niż modulo, więc reszta to sama silnia.' }, { input: '20' }, { input: '0' }],
            hint: R`const long long MOD = 1000000007; long long w = 1; i w pętli od 1 do n: w = w * i % MOD;. Zmienna w musi być typu long long — iloczyn w · i sięga 10^16, a w int by się nie zmieścił.`,
            tests: (r) => ['10', '20', '0', '1', '12', '13', '1000000', '10000000', String(r.int(100, 1e5))],
            solve: (inp) => { const n = nums(inp)[0]; let w = 1n; for (let i = 1n; i <= BigInt(n); i++) w = w * i % MOD; return String(w); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    const long long MOD = 1000000007;
    int n;
    cin >> n;
    long long w = 1;
    for (int i = 1; i <= n; i++) {
        w = w * i % MOD;
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-potega-modulo', krok: 7, level: 'srednie',
            title: 'Potęga modulo',
            short: 'aⁿ modulo m — pętlą, z resztą po każdym mnożeniu.',
            tags: ['a %= m', 'w = w * a % m', '1 % m'],
            statement: ['Wczytaj a, n i m i wypisz resztę z dzielenia aⁿ przez m. Przyjmujemy, że a⁰ = 1 (także dla a = 0).'],
            input_format: ['Jeden wiersz z liczbami a, n i m.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ a ≤ 10¹⁸', '0 ≤ n ≤ 10⁷', '1 ≤ m ≤ 10⁹'],
            examples: [{ input: '2 10 1000', note: '2¹⁰ = 1024.' }, { input: '3 0 5' }, { input: '7 5 1', note: 'Każda liczba dzieli się przez 1 bez reszty.' }],
            hint: R`Najpierw zmniejsz a: a %= m — inaczej już pierwszy iloczyn się przepełni. Potem pętla n razy: w = w * a % m. Zacznij od w = 1 % m, a nie od 1: dla m = 1 każda reszta to 0, nawet a⁰.`,
            tests: (r) => ['2 10 1000', '3 0 5', '7 5 1', '0 0 7', '0 5 7', `${E18} 10000000 1000000000`, `${E18} 0 1`, '999999999 10000000 1000000000',
                `${r.big(0, E18)} ${r.int(0, 1e7)} ${r.int(1, 1e9)}`, `${r.int(2, 9)} ${r.int(1, 60)} ${r.int(2, 1e9)}`],
            solve: (inp) => { const [a, n, m] = bigs(inp); return String(mpow(a, n, m)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, m;
    int n;
    cin >> a >> n >> m;
    a %= m;
    long long w = 1 % m;
    for (int i = 0; i < n; i++) {
        w = w * a % m;
    }
    cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-trzy-ostatnie-cyfry', krok: 7, level: 'srednie',
            title: 'Trzy ostatnie cyfry potęgi',
            short: 'Wypisz trzy ostatnie cyfry aⁿ — zawsze trzy, z zerami z przodu.',
            tags: ['% 1000', 'setw(3)', 'setfill'],
            statement: ['Wczytaj a i n i wypisz trzy ostatnie cyfry liczby aⁿ — zawsze trzy, z zerami z przodu, jeśli trzeba: dla 2¹⁰ = 1024 wypisz 024, a dla 2³ = 8 wypisz 008.'],
            input_format: ['Jeden wiersz z liczbami a i n.'],
            output_format: ['Trzy cyfry.'],
            constraints: ['0 ≤ a ≤ 10⁹', '1 ≤ n ≤ 10⁷'],
            examples: [{ input: '2 10' }, { input: '2 3' }, { input: '5 4' }],
            hint: R`Trzy ostatnie cyfry to reszta z dzielenia przez 1000. Mnóż n razy, biorąc % 1000 po każdym kroku (zacznij od a % 1000), a wynik wypisz przez setw(3) i setfill('0').`,
            tests: (r) => ['2 10', '2 3', '5 4', '10 3', '0 1', '1 10000000', '999999999 10000000', '7 100', `${r.int(2, 1e9)} ${r.int(1, 1e7)}`, `${r.int(2, 99)} ${r.int(1, 30)}`],
            solve: (inp) => { const [a, n] = bigs(inp); return String(mpow(a, n, 1000n)).padStart(3, '0'); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    long long a;
    int n;
    cin >> a >> n;
    a %= 1000;
    long long w = 1;
    for (int i = 0; i < n; i++) {
        w = w * a % 1000;
    }
    cout << setw(3) << setfill('0') << w << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-reszta-z-olbrzyma', krok: 7, level: 'srednie',
            title: 'Reszta z olbrzyma',
            short: 'Liczba ma do 100 000 cyfr. Policz jej resztę z dzielenia przez m.',
            tags: ['string', 'r = (r * 10 + cyfra) % m'],
            statement: ['Wczytaj liczbę naturalną, która może mieć nawet 100 000 cyfr, oraz liczbę m. Wypisz resztę z dzielenia tej ogromnej liczby przez m.'],
            input_format: ['Jeden wiersz: ogromna liczba (bez zer z przodu) i liczba m.'],
            output_format: ['Jedna liczba.'],
            constraints: ['ogromna liczba ma od 1 do 100 000 cyfr', '1 ≤ m ≤ 10⁹'],
            examples: [{ input: '1234 7', note: '1 → 12 % 7 = 5 → 53 % 7 = 4 → 44 % 7 = 2.' }, { input: '123456789123456789123456789 1000000007' }],
            hint: R`Wczytaj liczbę do zmiennej string i idź po cyfrach od lewej, tak jak w lekcji: r = (r * 10 + (c - '0')) % m;. r jest mniejsze od m ≤ 10^9, więc r · 10 + 9 mieści się w long long.`,
            tests: (r) => ['1234 7', '123456789123456789123456789 1000000007', '0 5', '7 1', '999999999999 1000000000', `${cyfry(r, 100000)} ${r.int(1, 1e9)}`, `${cyfry(r, 20000)} 1000000007`, `${cyfry(r, 5000)} ${r.int(2, 100)}`, `${'9'.repeat(1000)} 999999937`],
            solve: (inp) => { const [s, m] = toks(inp); const M = Number(m); let rr = 0; for (const c of s) rr = (rr * 10 + Number(c)) % M; return String(rr); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    long long m;
    cin >> s >> m;
    long long r = 0;
    for (char c : s) {
        r = (r * 10 + (c - '0')) % m;
    }
    cout << r << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-fibonacci-modulo', krok: 7, level: 'srednie',
            title: 'Fibonacci modulo 10⁹ + 7',
            short: 'n-ty wyraz ciągu Fibonacciego modulo 1 000 000 007, dla n do 10⁷.',
            tags: ['(a + b) % MOD', 'trzy zmienne', 'pętla'],
            statement: ['Ciąg Fibonacciego: F₀ = 0, F₁ = 1, a każdy kolejny wyraz to suma dwóch poprzednich: 1, 2, 3, 5, 8, 13, … Wyrazy rosną bardzo szybko — F₁₀₀ ma 21 cyfr. Wczytaj n i wypisz resztę z dzielenia Fₙ przez 1 000 000 007.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ n ≤ 10⁷'],
            examples: [{ input: '10' }, { input: '100' }, { input: '0' }],
            hint: R`Trzymaj dwa ostatnie wyrazy a i b (już jako reszty) i w pętli licz c = (a + b) % MOD; a = b; b = c;. Reszta z sumy to reszta z sumy reszt, więc wynik się zgadza, choć prawdziwe liczby są gigantyczne.`,
            tests: (r) => ['10', '100', '0', '1', '2', '90', '10000000', String(r.int(1000, 1e6))],
            solve: (inp) => { const n = nums(inp)[0]; let a = 0, b = 1; for (let i = 0; i < n; i++) { const c = (a + b) % 1000000007; a = b; b = c; } return String(a); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    const long long MOD = 1000000007;
    int n;
    cin >> n;
    long long a = 0, b = 1;
    for (int i = 0; i < n; i++) {
        long long c = (a + b) % MOD;
        a = b;
        b = c;
    }
    cout << a << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-suma-poteg', krok: 7, level: 'srednie',
            title: 'Suma potęg modulo',
            short: 'Reszta z sumy 1 + a + a² + … + aⁿ przez m.',
            tags: ['dwie zmienne: potęga i suma', '% m po każdym kroku'],
            statement: ['Wczytaj a, n i m i wypisz resztę z dzielenia sumy 1 + a + a² + … + aⁿ przez m.'],
            input_format: ['Jeden wiersz z liczbami a, n i m.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ a ≤ 10⁹', '0 ≤ n ≤ 10⁷', '1 ≤ m ≤ 10⁹'],
            examples: [{ input: '2 3 100', note: '1 + 2 + 4 + 8 = 15.' }, { input: '10 5 7', note: '111 111 = 7 · 15 873.' }],
            hint: R`Dwie zmienne: p — bieżąca potęga (zaczyna od 1 % m) i s — suma (zaczyna od 0). W każdym obrocie dodaj p do sumy, a potem pomnóż p przez a — za każdym razem biorąc % m. Pierwszy składnik to a⁰ = 1, ostatni to aⁿ, więc obrotów jest n + 1.`,
            tests: (r) => ['2 3 100', '10 5 7', '3 4 1000', '0 0 5', '0 7 5', '5 0 1', '1 10000000 1000000000', '1000000000 10000000 999999999', `${r.int(0, 1e9)} ${r.int(0, 1e7)} ${r.int(1, 1e9)}`, `${r.int(2, 9)} ${r.int(1, 40)} ${r.int(2, 1e9)}`],
            solve: (inp) => {
                const [a, n, m] = bigs(inp);
                // suma geometryczna metodą „dziel na pół” — pętla do 10⁷ na BigIntach byłaby wolna
                const geo = (k) => {
                    if (k === 0n) return 1n % m;
                    if (k % 2n === 1n) return (1n + mpow(a, (k + 1n) / 2n, m)) * geo((k - 1n) / 2n) % m;
                    return (geo(k - 1n) + mpow(a, k, m)) % m;
                };
                return String(geo(n));
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, m;
    int n;
    cin >> a >> n >> m;
    a %= m;
    long long p = 1 % m, s = 0;
    for (int i = 0; i <= n; i++) {
        s = (s + p) % m;
        p = p * a % m;
    }
    cout << s << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · modulo na olimpiadzie
        {
            id: 'mod-nwd-olbrzymow', krok: 8, level: 'latwe',
            title: 'NWD olbrzymów',
            short: 'NWD dwóch liczb do 10¹⁸ — algorytmem Euklidesa z resztą.',
            tags: ['algorytm Euklidesa', 'a % b', 'long long'],
            statement: ['Wczytaj dwie liczby a i b i wypisz ich największy wspólny dzielnik. Liczby mają do 19 cyfr — wersja algorytmu Euklidesa z odejmowaniem mogłaby tu wykonać biliony kroków, a wersja z resztą wykona najwyżej kilkadziesiąt.'],
            input_format: ['Jeden wiersz z liczbami a i b.'],
            output_format: ['Jedna liczba — NWD(a, b).'],
            constraints: ['1 ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '48 18' }, { input: '1071 462' }, { input: `${E18} 1` }],
            hint: R`while (b != 0) { long long r = a % b; a = b; b = r; } — po pętli wynik jest w a. Każdy obrót zastępuje parę (a, b) parą (b, a % b), która ma ten sam NWD, ale mniejsze liczby.`,
            tests: (r) => {
                const out = ['48 18', '1071 462', `${E18} 1`, `1 ${E18}`, `${E18} ${E18}`, '7 13'];
                let a = 0n, b = 1n;
                for (let i = 0; i < 87; i++) { const c = a + b; a = b; b = c; }
                out.push(`${b} ${a}`); // dwa kolejne wyrazy Fibonacciego — najwięcej kroków
                const g = r.big(1, '1000000000');
                out.push(`${g * r.big(1, '1000000000')} ${g * r.big(1, '1000000000')}`);
                out.push(`${r.big(1, E18)} ${r.big(1, E18)}`);
                return out;
            },
            solve: (inp) => { const [a, b] = bigs(inp); return String(gcd(a, b)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    while (b != 0) {
        long long r = a % b;
        a = b;
        b = r;
    }
    cout << a << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-skracanie-ulamka', krok: 8, level: 'latwe',
            title: 'Skracanie ułamka',
            short: 'Skróć ułamek a/b, dzieląc licznik i mianownik przez NWD.',
            tags: ['NWD', 'kopie zmiennych', 'separator /'],
            statement: ['Wczytaj ułamek a/b i wypisz go w postaci nieskracalnej, czyli po podzieleniu licznika i mianownika przez ich największy wspólny dzielnik.'],
            input_format: ['Jeden wiersz: a/b — dwie liczby oddzielone ukośnikiem, bez spacji.'],
            output_format: ['Ułamek w postaci p/q.'],
            constraints: ['1 ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '12/18' }, { input: '100/25', note: 'Wynik to liczba całkowita, ale wypisujemy ją jako ułamek z mianownikiem 1.' }],
            hint: R`Ukośnik wczytasz do zmiennej typu char: cin >> a >> z >> b;. Policz g = NWD(a, b) algorytmem Euklidesa — na kopiach a i b, bo pętla je zmienia — i wypisz a / g, ukośnik i b / g.`,
            tests: (r) => {
                const out = ['12/18', '100/25', '7/1', '1/1', `${E18}/${E18}`, `1/${E18}`, `${E18}/2`];
                const g = r.big(1, '1000000');
                out.push(`${g * r.big(1, '1000000000')}/${g * r.big(1, '1000000000')}`);
                out.push(`${r.big(1, E18)}/${r.big(1, E18)}`);
                out.push(`${r.int(1, 100)}/${r.int(1, 100)}`);
                return out;
            },
            solve: (inp) => { const [a, b] = inp.trim().split('/').map((x) => BigInt(x)); const g = gcd(a, b); return `${a / g}/${b / g}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    char z;
    cin >> a >> z >> b;
    long long x = a, y = b;
    while (y != 0) {
        long long r = x % y;
        x = y;
        y = r;
    }
    cout << a / x << "/" << b / x << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-autobusy-nww', krok: 8, level: 'srednie',
            title: 'Kiedy autobusy znów się spotkają?',
            short: 'Pierwsze ponowne spotkanie po NWW minut i liczba spotkań do chwili T.',
            tags: ['NWW = a / NWD · b', 'T / nww + 1', 'long long'],
            statement: ['Dwa autobusy odjechały z pętli jednocześnie w minucie 0. Pierwszy wraca na pętlę co a minut, drugi co b minut. Po ilu minutach znowu będą na pętli razem? Ile razy (licząc chwilę 0) będą na pętli razem w chwilach od 0 do T?'],
            input_format: ['Jeden wiersz z liczbami a, b i T.'],
            output_format: ['Dwie liczby: czas pierwszego ponownego spotkania i liczba spotkań w chwilach od 0 do T.'],
            constraints: ['1 ≤ a, b ≤ 10⁹', '0 ≤ T ≤ 10¹⁸'],
            examples: [{ input: '4 6 30', note: 'Spotykają się w minutach 0, 12 i 24.' }, { input: `1000000000 999999999 ${E18}` }],
            hint: R`Spotykają się w chwilach, które są wielokrotnościami a i b jednocześnie — czyli co NWW(a, b) minut. Licz NWW jako a / NWD(a, b) * b: najpierw dzielenie, żeby nie przepełnić long long. Spotkań w chwilach 0, nww, 2 · nww, … nie większych niż T jest T / nww + 1.`,
            tests: (r) => ['4 6 30', `1000000000 999999999 ${E18}`, '1 1 0', '5 5 4', `1 1 ${E18}`, '6 4 11', '6 4 12', `${r.int(1, 1000)} ${r.int(1, 1000)} ${r.int(0, 1e6)}`, `${r.int(1, 1e9)} ${r.int(1, 1e9)} ${r.big(0, E18)}`],
            solve: (inp) => { const [a, b, T] = bigs(inp); const l = a / gcd(a, b) * b; return `${l} ${T / l + 1n}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b, T;
    cin >> a >> b >> T;
    long long x = a, y = b;
    while (y != 0) {
        long long r = x % y;
        x = y;
        y = r;
    }
    long long nww = a / x * b;
    cout << nww << " " << T / nww + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-dzielenie-pisemne', krok: 8, level: 'srednie',
            title: 'Dzielenie pisemne',
            short: 'Wypisz a / b z dokładnie k cyframi po kropce — nawet 10 000 cyfr.',
            tags: ['r *= 10', 'r / b', 'r %= b'],
            statement: ['Wczytaj a, b i k i wypisz wynik dzielenia a / b z dokładnie k cyframi po kropce — bez zaokrąglania, po prostu obcinając dalsze cyfry. Typ double daje tylko kilkanaście dokładnych cyfr, a tu k może sięgać 10 000, więc licz tak jak przy dzieleniu pisemnym.'],
            input_format: ['Jeden wiersz z liczbami a, b i k.'],
            output_format: ['Część całkowita, kropka i dokładnie k cyfr.'],
            constraints: ['0 ≤ a ≤ 10⁹', '1 ≤ b ≤ 10⁹', '1 ≤ k ≤ 10 000'],
            examples: [{ input: '1 7 20' }, { input: '22 7 10' }, { input: '5 2 3' }],
            hint: R`Część całkowita to a / b. Potem r = a % b i k razy: r *= 10; cout << r / b; r %= b;. r jest mniejsze od b ≤ 10^9, więc r · 10 mieści się w long long.`,
            tests: (r) => ['1 7 20', '22 7 10', '5 2 3', '0 1 5', '1000000000 1 1', '1 1000000000 12', '355 113 10000', '999999999 1000000000 50', `${r.int(0, 1e9)} ${r.int(1, 1e9)} ${r.int(1, 10000)}`, `${r.int(0, 100)} ${r.int(1, 100)} ${r.int(1, 60)}`],
            solve: (inp) => {
                const [a, b, k] = nums(inp);
                let s = `${idiv(a, b)}.`;
                let rr = a % b;
                for (let i = 0; i < k; i++) { rr *= 10; s += idiv(rr, b); rr %= b; }
                return s;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    int k;
    cin >> a >> b >> k;
    cout << a / b << ".";
    long long r = a % b;
    for (int i = 0; i < k; i++) {
        r *= 10;
        cout << r / b;
        r %= b;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-k-ta-cyfra-ulamka', krok: 8, level: 'srednie',
            title: 'k-ta cyfra po przecinku',
            short: 'Która cyfra stoi na k-tym miejscu po przecinku ułamka a / b?',
            tags: ['dzielenie pisemne', 'r = r * 10 % b', 'pętla do 10⁷'],
            statement: ['Wczytaj a, b i k i wypisz k-tą cyfrę po przecinku w rozwinięciu dziesiętnym ułamka a / b (cyfry po przecinku numerujemy od 1). Na przykład 1/7 = 0,142857142857…, więc trzecia cyfra to 2.'],
            input_format: ['Jeden wiersz z liczbami a, b i k.'],
            output_format: ['Jedna cyfra.'],
            constraints: ['0 ≤ a ≤ 10⁹', '1 ≤ b ≤ 10⁹', '1 ≤ k ≤ 10⁷'],
            examples: [{ input: '1 7 3' }, { input: '1 4 5', note: '1/4 = 0,25000… — dalej same zera.' }],
            hint: R`Dzielenie pisemne bez wypisywania: r = a % b, potem k − 1 razy r = r * 10 % b. W k-tym kroku zamiast reszty potrzebujesz cyfry: r * 10 / b. Pętla wykona do 10 milionów obrotów — zdąży.`,
            tests: (r) => ['1 7 3', '1 4 5', '22 7 1', '1 3 10000000', '1 7 10000000', '0 5 3', '999999999 1000000000 9', `${r.int(0, 1e9)} ${r.int(1, 1e9)} ${r.int(1, 1e7)}`, `${r.int(0, 1e9)} 999999937 ${r.int(1, 1e7)}`],
            solve: (inp) => { const [a, b, k] = bigs(inp); const rr = (a % b) * mpow(10n, k - 1n, b) % b; return String(rr * 10n / b); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b;
    int k;
    cin >> a >> b >> k;
    long long r = a % b;
    for (int i = 1; i < k; i++) {
        r = r * 10 % b;
    }
    cout << r * 10 / b << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-wzglednie-pierwsze', krok: 8, level: 'srednie',
            title: 'Ile liczb względnie pierwszych?',
            short: 'Ile liczb od 1 do n ma z n NWD równe 1?',
            tags: ['NWD w pętli', 'kopie zmiennych', 'licznik'],
            statement: ['Dwie liczby są względnie pierwsze, gdy ich NWD wynosi 1 — nie mają wspólnego dzielnika większego od 1. Wczytaj n i wypisz, ile liczb od 1 do n jest względnie pierwszych z n.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 10⁶'],
            examples: [{ input: '12', note: '1, 5, 7 i 11.' }, { input: '1', note: 'NWD(1, 1) = 1.' }, { input: '7' }],
            hint: R`Dla każdego k od 1 do n policz NWD(k, n) algorytmem Euklidesa — na kopiach, bo pętla zmienia liczby — i zlicz te k, dla których wyszło 1. Euklides potrzebuje kilkunastu kroków, więc całość to kilkanaście milionów operacji.`,
            tests: (r) => ['12', '1', '7', '2', '1000000', '999983', '720720', '65536', String(r.int(1, 1e6)), String(r.int(1, 1000))],
            solve: (inp) => {
                let n = nums(inp)[0];
                let phi = n;
                for (let p = 2; p * p <= n; p++) if (n % p === 0) { while (n % p === 0) n /= p; phi -= phi / p; }
                if (n > 1) phi -= phi / n;
                return String(phi);
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int ile = 0;
    for (int k = 1; k <= n; k++) {
        int a = k, b = n;
        while (b != 0) {
            int r = a % b;
            a = b;
            b = r;
        }
        if (a == 1) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-szybka-potega', krok: 8, level: 'srednie',
            title: 'Szybkie potęgowanie',
            short: 'aⁿ modulo m dla n do 10¹⁸ — w około 60 obrotach pętli.',
            tags: ['n % 2 i n /= 2', 'pot = pot * pot % m', 'long long'],
            statement: ['Wczytaj a, n i m i wypisz resztę z dzielenia aⁿ przez m. Tym razem n może sięgać 10¹⁸ — zwykła pętla wykonywałaby się setki lat. Użyj szybkiego potęgowania z lekcji. Przyjmujemy, że a⁰ = 1.'],
            input_format: ['Jeden wiersz z liczbami a, n i m.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ a ≤ 10¹⁸', '0 ≤ n ≤ 10¹⁸', '1 ≤ m ≤ 10⁹'],
            examples: [{ input: '3 13 1000', note: '3¹³ = 1 594 323.' }, { input: `2 ${E18} 1000000007` }, { input: '5 0 3' }],
            hint: R`wynik = 1 % m, pot = a % m. Dopóki n > 0: jeśli n % 2 == 1, to wynik = wynik * pot % m; potem pot = pot * pot % m; i n /= 2;. Pętla obróci się najwyżej około 60 razy — tyle, ile cyfr ma n w systemie dwójkowym.`,
            tests: (r) => ['3 13 1000', `2 ${E18} 1000000007`, '5 0 3', '0 0 1', `${E18} ${E18} 1000000000`, `${E18} ${E18} 1`, '7 1 1000000000',
                `${r.big(0, E18)} ${r.big(0, E18)} ${r.int(1, 1e9)}`, `${r.big(0, E18)} ${r.big(0, E18)} 999999937`, `${r.int(2, 9)} ${r.int(0, 60)} ${r.int(1, 1e9)}`],
            solve: (inp) => { const [a, n, m] = bigs(inp); return String(mpow(a, n, m)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, n, m;
    cin >> a >> n >> m;
    long long wynik = 1 % m, pot = a % m;
    while (n > 0) {
        if (n % 2 == 1) {
            wynik = wynik * pot % m;
        }
        pot = pot * pot % m;
        n /= 2;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
    ];
};
