// Modulo — ćwiczenia w trakcie lekcji, części 1–4: dzielenie z resztą, podzielność, rozkładanie na jednostki
// (czas, pieniądze, miary) i cyfry liczby. Uczeń zna typy, wejście i wyjście, if / else, pętle while i for
// oraz napisy — ale jeszcze nie tablice. Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks, bigs } = h;
    const R = String.raw;
    const p2 = (x) => String(x).padStart(2, '0');
    const idiv = (a, b) => (a - (a % b)) / b; // dzielenie całkowite jak w C++ (dla liczb całkowitych w zakresie Number)
    const isLeap = (y) => (y % 4 === 0 && y % 100 !== 0) || y % 400 === 0;
    const gcd = (a, b) => { while (b) { const t = a % b; a = b; b = t; } return a; };
    const pary = (t, f) => { const ls = [String(t)]; for (let i = 0; i < t; i++) ls.push(f()); return ls.join('\n'); };
    const cyfry = (r, len, first = '123456789') => r.pick(first.split('')) + r.word(len - 1, '0123456789');

    return [
        // ================================================================ KROK 1 · dzielenie z resztą
        {
            id: 'mod-iloraz-reszta', krok: 1, level: 'latwe',
            title: 'Iloraz i reszta',
            short: 'Dla każdej pary liczb wypisz wynik dzielenia całkowitego i resztę.',
            tags: ['/', '%', 'pętla for'],
            statement: ['Wczytaj liczbę t, a potem t par liczb a i b. Dla każdej pary wypisz w osobnym wierszu dwie liczby: a / b — ile razy b mieści się w a — oraz a % b — ile zostaje.'],
            input_format: ['W pierwszym wierszu liczba t. W każdym z kolejnych t wierszy dwie liczby całkowite a i b.'],
            output_format: ['t wierszy, w każdym iloraz i reszta oddzielone spacją.'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ a ≤ 10⁹', '1 ≤ b ≤ 10⁹'],
            examples: [{ input: '3\n17 5\n20 5\n3 5', note: '17 = 5 · 3 + 2, 20 = 5 · 4 + 0, a 3 = 5 · 0 + 3 — piątka nie mieści się w trójce ani razu.' }],
            hint: R`W pętli for (int i = 0; i < t; i++) wczytaj a i b, a potem wypisz a / b << " " << a % b << "\n". Gdy a jest mniejsze od b, iloraz to 0, a reszta — całe a.`,
            tests: (r) => [
                '3\n17 5\n20 5\n3 5',
                '4\n0 7\n7 7\n6 7\n1000000000 1',
                pary(6, () => `${r.int(0, 100)} ${r.int(1, 12)}`),
                pary(100, () => `${r.int(0, 1e9)} ${r.int(1, 1e9)}`),
                pary(100, () => `${r.int(0, 1e6)} ${r.int(1, 1000)}`),
                '2\n999999999 1000000000\n1000000000 3',
            ],
            solve: (inp) => {
                const v = nums(inp);
                const o = [];
                for (let i = 0; i < v[0]; i++) { const a = v[1 + 2 * i], b = v[2 + 2 * i]; o.push(`${idiv(a, b)} ${a % b}`); }
                return o.join('\n');
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        int a, b;
        cin >> a >> b;
        cout << a / b << " " << a % b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'mod-zapis-dzielenia', krok: 1, level: 'latwe',
            title: 'Dzielenie z resztą na piśmie',
            short: 'Wypisz zapis a = b * q + r, na przykład 17 = 5 * 3 + 2.',
            tags: ['/', '%', 'a = b · q + r'],
            statement: ['Wczytaj liczby a i b i wypisz zapis dzielenia z resztą w postaci a = b * q + r, gdzie q to wynik dzielenia całkowitego a przez b, a r to reszta. Na przykład dla 17 i 5 wypisz 17 = 5 * 3 + 2.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Jeden wiersz: a = b * q + r — ze spacjami wokół znaków =, * i +.'],
            constraints: ['0 ≤ a ≤ 10⁹', '1 ≤ b ≤ 10⁹'],
            examples: [{ input: '17 5' }, { input: '3 7', note: 'Siódemka nie mieści się w trójce ani razu: iloraz 0, reszta 3.' }],
            hint: R`Policz q = a / b i r = a % b, a potem wypisz wszystko jednym cout: cout << a << " = " << b << " * " << q << " + " << r. Zawsze wyjdzie prawdziwa równość — możesz ją sprawdzić na kalkulatorze.`,
            tests: (r) => ['17 5', '3 7', '40 8', '0 1', '1000000000 1', '999999999 1000000000', '1000000000 7',
                `${r.int(0, 1e9)} ${r.int(1, 1e5)}`, `${r.int(0, 1e9)} ${r.int(1, 1e9)}`, `${r.int(0, 1000)} ${r.int(1, 30)}`],
            solve: (inp) => { const [a, b] = nums(inp); return `${a} = ${b} * ${idiv(a, b)} + ${a % b}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int q = a / b;
    int r = a % b;
    cout << a << " = " << b << " * " << q << " + " << r << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-reszty-po-kolei', krok: 1, level: 'latwe',
            title: 'Reszty po kolei',
            short: 'Wypisz 1 % k, 2 % k, …, n % k i zobacz, jak reszty chodzą w kółko.',
            tags: ['%', 'pętla for', 'reszty w kółko'],
            statement: ['Wczytaj n i k. Wypisz w jednym wierszu reszty z dzielenia przez k kolejnych liczb od 1 do n: 1 % k, 2 % k, 3 % k, …, n % k. Przyjrzyj się wynikowi — reszty powtarzają się w kółko.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jeden wiersz z n resztami oddzielonymi spacjami.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 1000'],
            examples: [{ input: '10 4', note: 'Po reszcie 3 (czyli k − 1) zawsze wraca 0.' }, { input: '5 1' }],
            hint: R`for (int i = 1; i <= n; i++) { cout << i % k << " "; }. Dla k = 4 reszty idą 1, 2, 3, 0, 1, 2, 3, 0, … Dla k = 1 każda reszta to 0, bo jedynka mieści się w każdej liczbie bez reszty.`,
            tests: (r) => ['10 4', '5 1', '1 1000', '1000 7', '1000 1000', '20 3', '999 2', `${r.int(50, 999)} ${r.int(2, 60)}`],
            solve: (inp) => { const [n, k] = nums(inp); return Array.from({ length: n }, (_, i) => (i + 1) % k).join(' '); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= n; i++) {
        cout << i % k << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-kolejnosc-dzialan', krok: 1, level: 'latwe',
            title: 'Kolejność działań z %',
            short: 'Policz cztery wyrażenia z % i nawiasami — najpierw w głowie, potem programem.',
            tags: ['%', 'kolejność działań', 'nawiasy'],
            statement: [
                'Operator % ma ten sam priorytet co * i /: wykonuje się przed dodawaniem i odejmowaniem, a razem z * i / — po kolei od lewej do prawej. Wczytaj liczby a, b i c i wypisz w czterech wierszach wartości wyrażeń (w tej kolejności):',
                'a + b % c',
                '(a + b) % c',
                'a * b % c',
                'a % b * c',
            ],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi a, b i c.'],
            output_format: ['Cztery wiersze — wartości kolejnych wyrażeń.'],
            constraints: ['1 ≤ a, b, c ≤ 1000'],
            examples: [{ input: '2 7 3', note: '2 + 7 % 3 = 2 + 1 = 3; (2 + 7) % 3 = 9 % 3 = 0; 2 * 7 % 3 = 14 % 3 = 2; 2 % 7 * 3 = 2 * 3 = 6.' }],
            hint: R`Przepisz wyrażenia do cout dokładnie tak, jak stoją w treści — C++ sam zastosuje kolejność działań: cout << a + b % c << "\n"; itd. Ale zanim uruchomisz program, policz przykład w głowie: 2 + 7 % 3 to 2 + 1, a nie 9 % 3.`,
            tests: (r) => ['2 7 3', '1 1 1', '1000 1000 1000', '10 4 7', '7 10 4', '999 1000 13', `${r.int(1, 1000)} ${r.int(1, 1000)} ${r.int(1, 50)}`, `${r.int(1, 100)} ${r.int(1, 9)} ${r.int(1, 9)}`],
            solve: (inp) => { const [a, b, c] = nums(inp); return [a + b % c, (a + b) % c, a * b % c, a % b * c].join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << a + b % c << "\n";
    cout << (a + b) % c << "\n";
    cout << a * b % c << "\n";
    cout << a % b * c << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-ostatni-wagon', krok: 1, level: 'latwe',
            title: 'Ostatni wagon',
            short: 'Ile wagonów zajmą pasażerowie i ilu z nich pojedzie w ostatnim?',
            tags: ['/', '%', 'if', 'zaokrąglanie w górę'],
            statement: ['Na peron przyszło n pasażerów. Do każdego wagonu wsiada dokładnie k osób i dopiero gdy wagon jest pełny, pasażerowie zajmują następny. Ile wagonów będzie potrzebnych i ile osób pojedzie w ostatnim z nich?'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi n i k.'],
            output_format: ['Jeden wiersz: liczba wagonów i liczba osób w ostatnim wagonie.'],
            constraints: ['1 ≤ n ≤ 10⁹', '1 ≤ k ≤ 10⁹'],
            examples: [
                { input: '23 10', note: 'Dwa pełne wagony po 10 osób i trzeci, w którym jadą 3 osoby.' },
                { input: '30 10', note: 'Wszystkie wagony są pełne — w ostatnim jedzie 10 osób, a nie 0.' },
            ],
            hint: R`Gdy n % k == 0, wszystkie wagony są pełne: jest ich n / k, a w ostatnim jedzie k osób. W przeciwnym razie potrzebny jest jeszcze jeden wagon — razem n / k + 1 — i jedzie w nim n % k osób. To jeden if … else.`,
            tests: (r) => ['23 10', '30 10', '1 1', '1 1000000000', '1000000000 1', '1000000000 1000000000', '999999999 1000000000', '1000000000 3',
                `${r.int(1, 1e9)} ${r.int(1, 1000)}`, `${r.int(1, 1e6)} ${r.int(1, 1e6)}`],
            solve: (inp) => { const [n, k] = nums(inp); return n % k === 0 ? `${n / k} ${k}` : `${idiv(n, k) + 1} ${n % k}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    if (n % k == 0) {
        cout << n / k << " " << k << "\n";
    } else {
        cout << n / k + 1 << " " << n % k << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'mod-ta-sama-reszta', krok: 1, level: 'latwe',
            title: 'Ta sama reszta',
            short: 'Czy dwie liczby dają tę samą resztę z dzielenia przez k?',
            tags: ['%', 'porównanie reszt', 'long long'],
            statement: ['Mówimy, że liczby a i b przystają modulo k, gdy dają tę samą resztę z dzielenia przez k. Na przykład 17 i 32 przy dzieleniu przez 5 dają resztę 2. Wczytaj a, b i k i wypisz TAK, jeśli a i b dają tę samą resztę z dzielenia przez k, albo NIE w przeciwnym razie.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi a, b i k.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['0 ≤ a, b ≤ 10¹⁸', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '17 32 5' }, { input: '17 30 5' }],
            hint: R`Porównaj reszty: a % k == b % k. Liczby mają do 19 cyfr, więc wczytaj je do long long. Ciekawostka: a i b dają tę samą resztę dokładnie wtedy, gdy ich różnica dzieli się przez k (32 − 17 = 15).`,
            tests: (r) => {
                const out = ['17 32 5', '17 30 5', '0 0 1', '5 5 1000000000000000000', '1000000000000000000 0 1000000000000000000', '999999999999999999 0 3', '1 2 1'];
                for (let i = 0; i < 3; i++) {
                    const k = r.big(2, i ? '1000000' : '1000000000000');
                    const a = r.big(0, '1000000000000000000');
                    const b = (a % k) + k * r.big(0, '1000000');
                    out.push(`${a} ${b} ${k}`);
                    out.push(`${a} ${b + 1n} ${k}`);
                }
                return out;
            },
            solve: (inp) => { const [a, b, k] = bigs(inp); return a % k === b % k ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b, k;
    cin >> a >> b >> k;
    if (a % k == b % k) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'mod-wytlaczanki', krok: 1, level: 'srednie',
            title: 'Ile jajek dokupić?',
            short: 'Ile jajek brakuje, żeby wszystkie wytłaczanki były pełne?',
            tags: ['%', '(k − r) % k'],
            statement: ['W wytłaczance mieści się k jajek. Pan Józef ma n jajek i chce zapakować je tak, żeby wszystkie użyte wytłaczanki były pełne. Ile jajek musi dokupić? Jeśli n dzieli się przez k, nie musi dokupować niczego.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi n i k.'],
            output_format: ['Jedna liczba — ile jajek trzeba dokupić.'],
            constraints: ['1 ≤ n ≤ 10⁹', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '23 10', note: 'W trzeciej wytłaczance są 3 jajka, brakuje 7.' }, { input: '30 6' }],
            hint: R`W ostatniej, niepełnej wytłaczance jest n % k jajek, więc brakuje k − n % k. Uwaga na przypadek, gdy n % k == 0: wtedy ten wzór daje k, a powinno być 0. Załatwi to if albo jeszcze jedno modulo: (k − n % k) % k.`,
            tests: (r) => ['23 10', '30 6', '1 1', '1 1000000000', '1000000000 1', '1000000000 999999999', '999999999 1000000000', '12 12',
                `${r.int(1, 1e9)} ${r.int(1, 100)}`, `${r.int(1, 1e9)} ${r.int(1, 1e9)}`],
            solve: (inp) => { const [n, k] = nums(inp); return String((k - n % k) % k); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    cout << (k - n % k) % k << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · podzielność
        {
            id: 'mod-po-k-w-wierszu', krok: 2, level: 'latwe',
            title: 'Po k w wierszu',
            short: 'Wypisz liczby od 1 do n, po k w każdym wierszu.',
            tags: ['i % k == 0', 'co k-ty', 'pętla for'],
            statement: ['Wypisz liczby od 1 do n, po k liczb w każdym wierszu (liczby w wierszu oddzielaj spacjami). Ostatni wiersz może być krótszy.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Liczby od 1 do n, po k w wierszu.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 1000'],
            examples: [{ input: '14 5' }, { input: '6 3' }],
            hint: R`Po wypisaniu liczby i sprawdź, czy i % k == 0. Jeśli tak, to była k-ta, 2k-ta, 3k-ta… liczba i trzeba przejść do nowego wiersza: cout << "\n". Spacja na końcu wiersza nie przeszkadza.`,
            tests: (r) => ['14 5', '6 3', '1 1', '5 1', '1000 1000', '1000 7', '10 20', '100 10', `${r.int(100, 999)} ${r.int(2, 30)}`],
            solve: (inp) => {
                const [n, k] = nums(inp);
                const ls = [];
                let cur = [];
                for (let i = 1; i <= n; i++) { cur.push(i); if (i % k === 0) { ls.push(cur.join(' ')); cur = []; } }
                if (cur.length) ls.push(cur.join(' '));
                return ls.join('\n');
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= n; i++) {
        cout << i << " ";
        if (i % k == 0) {
            cout << "\n";
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-ile-dzieli-sie', krok: 2, level: 'latwe',
            title: 'Ile dzieli się przez k?',
            short: 'Policz, ile wczytanych liczb (także ujemnych) dzieli się przez k.',
            tags: ['x % k == 0', 'licznik', 'liczby ujemne'],
            statement: ['Wczytaj n liczb całkowitych — także ujemnych — oraz liczbę k. Wypisz, ile spośród wczytanych liczb dzieli się przez k bez reszty.'],
            input_format: ['W pierwszym wierszu liczby n i k, w drugim n liczb całkowitych.'],
            output_format: ['Jedna liczba — ile liczb dzieli się przez k.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6 3\n9 -6 4 0 10 -7', note: 'Dzielą się 9, −6 i 0. Zero dzieli się przez każdą liczbę.' }],
            hint: R`Liczba x dzieli się przez k, gdy x % k == 0. Dla liczb ujemnych reszta może wyjść ujemna (−7 % 3 to −1), ale zero zostaje zerem — więc warunek == 0 działa poprawnie także dla nich.`,
            tests: (r) => {
                const mk = (n, k, lo, hi) => `${n} ${k}\n${r.arr(n, lo, hi).join(' ')}`;
                return ['6 3\n9 -6 4 0 10 -7', '1 1\n-1000000000', '3 1000\n1000 -1000 999', mk(20, 2, -50, 50), mk(1000, 7, -1e9, 1e9), mk(1000, 3, -1000, 1000),
                    mk(500, 1000, -1e6, 1e6), mk(50, 1, -100, 100), mk(200, 13, -1e9, 1e9)];
            },
            solve: (inp) => { const v = nums(inp); const [n, k] = v; return String(v.slice(2, 2 + n).filter((x) => x % k === 0).length); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    int ile = 0;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x % k == 0) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-dzielnik-czy-wielokrotnosc', krok: 2, level: 'latwe',
            title: 'Dzielnik czy wielokrotność?',
            short: 'Rozstrzygnij, czy a dzieli b, b dzieli a, czy żadne z nich.',
            tags: ['a % b == 0', 'b % a == 0', 'else if'],
            statement: [
                'Wczytaj dwie liczby dodatnie a i b i wypisz jedno słowo:',
                'ROWNE — jeśli a = b,',
                'DZIELNIK — jeśli a jest dzielnikiem b (czyli b dzieli się przez a),',
                'WIELOKROTNOSC — jeśli a jest wielokrotnością b (czyli a dzieli się przez b),',
                'NIC — w pozostałych przypadkach.',
            ],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Jedno słowo: ROWNE, DZIELNIK, WIELOKROTNOSC albo NIC.'],
            constraints: ['1 ≤ a, b ≤ 10⁹'],
            examples: [{ input: '3 12', note: '12 dzieli się przez 3, więc 3 jest dzielnikiem 12.' }, { input: '12 3' }, { input: '4 6' }],
            hint: R`„a jest dzielnikiem b” to b % a == 0 — liczba, którą dzielimy, stoi po lewej stronie %. Najpierw sprawdź a == b (wtedy oba warunki podzielności są prawdziwe), a potem pozostałe przypadki w łańcuchu else if.`,
            tests: (r) => ['3 12', '12 3', '4 6', '7 7', '1 1000000000', '1000000000 1', '6 4', '1 1', '999999937 1000000000',
                (() => { const a = r.int(1, 1000); return `${a} ${a * r.int(2, 1000)}`; })(),
                (() => { const b = r.int(1, 1000); return `${b * r.int(2, 1000)} ${b}`; })(),
                `${r.int(2, 1e9)} ${r.int(2, 1e9)}`],
            solve: (inp) => { const [a, b] = nums(inp); return a === b ? 'ROWNE' : b % a === 0 ? 'DZIELNIK' : a % b === 0 ? 'WIELOKROTNOSC' : 'NIC'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    if (a == b) {
        cout << "ROWNE\n";
    } else if (b % a == 0) {
        cout << "DZIELNIK\n";
    } else if (a % b == 0) {
        cout << "WIELOKROTNOSC\n";
    } else {
        cout << "NIC\n";
    }
    return 0;
}`,
        },
        {
            id: 'mod-lata-przestepne', krok: 2, level: 'latwe',
            title: 'Lata przestępne w przedziale',
            short: 'Wypisz wszystkie lata przestępne od a do b i policz je.',
            tags: ['% 4, % 100, % 400', '&& i ||', 'licznik'],
            statement: ['Rok jest przestępny, gdy dzieli się przez 4, ale nie dzieli się przez 100 — chyba że dzieli się przez 400, wtedy też jest przestępny. Wczytaj a i b i wypisz w pierwszym wierszu wszystkie lata przestępne od a do b (włącznie), a w drugim — ile ich jest. Jeśli w przedziale nie ma żadnego roku przestępnego, w pierwszym wierszu wypisz BRAK.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi a i b.'],
            output_format: ['Dwa wiersze: lata przestępne oddzielone spacjami (albo BRAK) i ich liczba.'],
            constraints: ['1 ≤ a ≤ b ≤ 10⁹', 'b − a ≤ 10 000'],
            examples: [{ input: '1896 1912', note: '1900 dzieli się przez 100, ale nie przez 400 — nie jest przestępny.' }, { input: '2097 2103' }],
            hint: R`Warunek: (r % 4 == 0 && r % 100 != 0) || r % 400 == 0. Licz lata w osobnej zmiennej, a słowo BRAK wypisz po pętli, jeśli licznik został zerem. Rok 1900 nie jest przestępny, a 2000 — jest.`,
            tests: (r) => {
                const out = ['1896 1912', '2097 2103', '2000 2000', '1900 1900', '1 10000', '999990000 1000000000', '2024 2024', '1 3'];
                const a = r.int(1, 999990000);
                out.push(`${a} ${a + r.int(0, 10000)}`);
                return out;
            },
            check: (inp) => { const [a, b] = nums(inp); return a <= b && b - a <= 10000 ? null : 'zakres'; },
            solve: (inp) => {
                const [a, b] = nums(inp);
                const ls = [];
                for (let y = a; y <= b; y++) if (isLeap(y)) ls.push(y);
                return `${ls.length ? ls.join(' ') : 'BRAK'}\n${ls.length}`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int ile = 0;
    for (int r = a; r <= b; r++) {
        if ((r % 4 == 0 && r % 100 != 0) || r % 400 == 0) {
            cout << r << " ";
            ile++;
        }
    }
    if (ile == 0) {
        cout << "BRAK";
    }
    cout << "\n" << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-wspolne-wielokrotnosci', krok: 2, level: 'latwe',
            title: 'Wspólne wielokrotności',
            short: 'Wypisz liczby od 1 do n, które dzielą się i przez a, i przez b.',
            tags: ['%', '&&', 'pętla for'],
            statement: ['Wczytaj n, a i b. Wypisz w jednym wierszu wszystkie liczby od 1 do n, które dzielą się zarówno przez a, jak i przez b. Jeśli nie ma ani jednej takiej liczby, wypisz BRAK.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi n, a i b.'],
            output_format: ['Jeden wiersz z liczbami oddzielonymi spacjami albo słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ a, b ≤ 10 000'],
            examples: [{ input: '50 4 6', note: 'Liczba podzielna przez 4 i przez 6 nie musi dzielić się przez 24 — wystarczy 12.' }, { input: '10 4 6' }],
            hint: R`Warunek i % a == 0 && i % b == 0. Zapamiętaj w zmiennej, czy coś zostało wypisane, żeby po pętli wiedzieć, czy trzeba wypisać BRAK.`,
            tests: (r) => ['50 4 6', '10 4 6', '100 3 5', '10000 1 1', '10000 7 7', '10000 9999 10000', '1 1 1', '10000 100 250',
                `${r.int(1000, 10000)} ${r.int(2, 60)} ${r.int(2, 60)}`],
            solve: (inp) => {
                const [n, a, b] = nums(inp);
                const ls = [];
                for (let i = 1; i <= n; i++) if (i % a === 0 && i % b === 0) ls.push(i);
                return ls.length ? ls.join(' ') : 'BRAK';
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, a, b;
    cin >> n >> a >> b;
    bool cos = false;
    for (int i = 1; i <= n; i++) {
        if (i % a == 0 && i % b == 0) {
            cout << i << " ";
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
            id: 'mod-wielokrotnosci-olbrzymie', krok: 2, level: 'srednie',
            title: 'Wielokrotności w ogromnym przedziale',
            short: 'Ile liczb od a do b dzieli się przez k — gdy przedział ma 10¹⁸ liczb?',
            tags: ['n / k', 'wzór zamiast pętli', 'long long'],
            statement: ['Wczytaj a, b i k i wypisz, ile liczb z przedziału od a do b (włącznie) dzieli się przez k. Liczby są tak duże, że pętla po całym przedziale nie zdąży się wykonać — potrzebny jest wzór.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi a, b i k.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ a ≤ b ≤ 10¹⁸', '1 ≤ k ≤ 10¹⁸'],
            examples: [{ input: '10 40 7', note: '14, 21, 28 i 35.' }, { input: '1 1000000000000000000 3' }],
            hint: R`Od 1 do n jest dokładnie n / k wielokrotności liczby k: k, 2k, 3k, … Wielokrotności z przedziału od a do b to te, które są nie większe od b, minus te nie większe od a − 1: b / k − (a − 1) / k. Wszystko w long long.`,
            tests: (r) => {
                const out = ['10 40 7', '1 1000000000000000000 3', '1 1 1', '5 5 10', '10 10 10', '1000000000000000000 1000000000000000000 1000000000000000000',
                    '1 999999999999999999 1000000000000000000', '7 13 7'];
                for (let i = 0; i < 3; i++) { const a = r.big(1, '1000000000000000000'); const b = a + r.big(0, '1000000000000000000') % (1000000000000000001n - a); out.push(`${a} ${b} ${r.big(1, i ? '1000' : '1000000000000')}`); }
                return out;
            },
            check: (inp) => { const [a, b] = bigs(inp); return a <= b && b <= 1000000000000000000n ? null : 'zakres'; },
            solve: (inp) => { const [a, b, k] = bigs(inp); return String(b / k - (a - 1n) / k); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long a, b, k;
    cin >> a >> b >> k;
    cout << b / k - (a - 1) / k << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-dokladnie-jedna', krok: 2, level: 'srednie',
            title: 'Przez jedną, ale nie przez obie',
            short: 'Ile liczb od 1 do n dzieli się przez a albo przez b, ale nie przez obie naraz?',
            tags: ['%', 'bool', 'p != q'],
            statement: ['Wczytaj n, a i b. Ile liczb od 1 do n dzieli się przez a albo przez b, ale nie przez obie naraz?'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi n, a i b.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 10⁷', '1 ≤ a, b ≤ 10⁷'],
            examples: [{ input: '20 2 3', note: '2, 3, 4, 8, 9, 10, 14, 15, 16 i 20. Liczby 6, 12 i 18 dzielą się przez obie, więc odpadają.' }],
            hint: R`Dla każdej liczby i policz dwa warunki: bool p = (i % a == 0); bool q = (i % b == 0);. „Jedna, ale nie obie” to p != q — dokładnie jeden z warunków jest prawdziwy. Pętla wykona do 10 milionów obrotów, to zdąży.`,
            tests: (r) => ['20 2 3', '10 5 5', '1 1 2', '10000000 2 3', '10000000 7 11', '10000000 1 10000000', '10000000 4 6', `${r.int(1, 1e7)} ${r.int(1, 1000)} ${r.int(1, 1000)}`],
            solve: (inp) => {
                const [n, a, b] = nums(inp);
                const l = (a / gcd(a, b)) * b;
                return String(Math.floor(n / a) + Math.floor(n / b) - 2 * Math.floor(n / l));
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, a, b;
    cin >> n >> a >> b;
    int ile = 0;
    for (int i = 1; i <= n; i++) {
        bool p = (i % a == 0);
        bool q = (i % b == 0);
        if (p != q) {
            ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-cecha-3-9', krok: 2, level: 'srednie',
            title: 'Olbrzym podzielny przez 3 i przez 9?',
            short: 'Liczba ma do 1000 cyfr. Sprawdź cechę podzielności przez 3 i przez 9.',
            tags: ['cecha podzielności', 'suma cyfr', 'string'],
            statement: ['Liczba dzieli się przez 3, gdy suma jej cyfr dzieli się przez 3 — i tak samo jest z dziewiątką. Wczytaj liczbę naturalną, która może mieć nawet 1000 cyfr (nie zmieści się w żadnym typie liczbowym), i sprawdź, czy dzieli się przez 3 i czy dzieli się przez 9.'],
            input_format: ['Jeden wiersz — liczba naturalna bez zer z przodu.'],
            output_format: ['Dwa wiersze: w pierwszym TAK albo NIE (podzielność przez 3), w drugim TAK albo NIE (podzielność przez 9).'],
            constraints: ['liczba ma od 1 do 1000 cyfr'],
            examples: [{ input: '123456789123456789', note: 'Suma cyfr to 90 — dzieli się i przez 3, i przez 9.' }, { input: '12' }],
            hint: R`Wczytaj liczbę do zmiennej typu string i zsumuj cyfry: for (char c : s) suma += c - '0';. Suma jest najwyżej 9 · 1000 = 9000, więc mieści się w int. Potem dwa warunki: suma % 3 == 0 i suma % 9 == 0.`,
            tests: (r) => {
                const out = ['123456789123456789', '12', '0', '9', '3', '1', '99999999999999999999'];
                for (const len of [1000, 1000, 500, 37]) out.push(cyfry(r, len));
                // liczba z sumą cyfr podzielną przez 9
                let s = cyfry(r, 999);
                const sum = [...s].reduce((a, c) => a + Number(c), 0);
                out.push(s + String((9 - sum % 9) % 9));
                s = cyfry(r, 800);
                const sum2 = [...s].reduce((a, c) => a + Number(c), 0);
                out.push(s + String((3 - sum2 % 3) % 3 + 3));
                return out;
            },
            check: (inp) => (/^(0|[1-9]\d{0,999})$/.test(inp.trim()) ? null : 'format'),
            solve: (inp) => { const s = inp.trim(); const sum = [...s].reduce((a, c) => a + Number(c), 0); return `${sum % 3 === 0 ? 'TAK' : 'NIE'}\n${sum % 9 === 0 ? 'TAK' : 'NIE'}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    int suma = 0;
    for (char c : s) {
        suma += c - '0';
    }
    cout << (suma % 3 == 0 ? "TAK" : "NIE") << "\n";
    cout << (suma % 9 == 0 ? "TAK" : "NIE") << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 3 · rozkładanie na jednostki
        {
            id: 'mod-godziny-minuty', krok: 3, level: 'latwe',
            title: 'Ile godzin i minut?',
            short: 'Zamień minuty na pełne godziny i minuty, które zostały.',
            tags: ['/ 60', '% 60'],
            statement: ['Film trwa t minut. Wypisz, ile to pełnych godzin i ile minut ponad nie, w postaci: G h M min.'],
            input_format: ['Jedna liczba całkowita t.'],
            output_format: ['Jeden wiersz w postaci G h M min.'],
            constraints: ['0 ≤ t ≤ 10⁹'],
            examples: [{ input: '135' }, { input: '59' }, { input: '120' }],
            hint: R`t / 60 to pełne godziny, a t % 60 — minuty, które zostały. cout << t / 60 << " h " << t % 60 << " min\n";`,
            tests: (r) => ['135', '59', '120', '0', '1', '60', '1000000000', String(r.int(61, 10000)), String(r.int(1e4, 1e9))],
            solve: (inp) => { const t = nums(inp)[0]; return `${idiv(t, 60)} h ${t % 60} min`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t;
    cin >> t;
    cout << t / 60 << " h " << t % 60 << " min\n";
    return 0;
}`,
        },
        {
            id: 'mod-stoper', krok: 3, level: 'latwe',
            title: 'Stoper',
            short: 'Zamień sekundy na zapis HH:MM:SS z zerami z przodu.',
            tags: ['/ 3600', '% 3600 / 60', '% 60', 'setw i setfill'],
            statement: ['Stoper pokazuje czas w formacie HH:MM:SS — godziny, minuty i sekundy, każde dwiema cyframi (z zerem z przodu, jeśli trzeba). Od włączenia stopera minęło s sekund. Co pokazuje stoper?'],
            input_format: ['Jedna liczba całkowita s.'],
            output_format: ['Jeden wiersz w formacie HH:MM:SS.'],
            constraints: ['0 ≤ s < 360 000 (mniej niż 100 godzin)'],
            examples: [{ input: '3725', note: '3725 = 1 · 3600 + 2 · 60 + 5.' }, { input: '90000', note: 'Stoper nie zawija się po dobie — pokazuje 25 godzin.' }],
            hint: R`Godziny to s / 3600, minuty s % 3600 / 60, a sekundy s % 60. Zera z przodu dopisze setw(2) z setfill('0') (#include <iomanip>) — setw trzeba powtórzyć przed każdą z trzech liczb.`,
            tests: (r) => ['3725', '90000', '0', '59', '60', '3599', '86399', '359999', String(r.int(1, 359999)), String(r.int(1, 3600))],
            solve: (inp) => { const s = nums(inp)[0]; return `${p2(idiv(s, 3600))}:${p2(idiv(s % 3600, 60))}:${p2(s % 60)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int s;
    cin >> s;
    cout << setfill('0');
    cout << setw(2) << s / 3600 << ":" << setw(2) << s % 3600 / 60 << ":" << setw(2) << s % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-rachunek-grosze', krok: 3, level: 'latwe',
            title: 'Rachunek w groszach',
            short: 'Zsumuj ceny w groszach i wypisz kwotę w formacie Z.GG.',
            tags: ['/ 100', '% 100', 'setw(2)', 'suma w pętli'],
            statement: ['Kasa w sklepie zapisuje ceny w groszach. Wczytaj n cen i wypisz łączną kwotę w złotych w formacie Z.GG — z kropką i zawsze dwiema cyframi groszy, na przykład 12.05.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb całkowitych — ceny w groszach.'],
            output_format: ['Jeden wiersz: kwota w formacie Z.GG.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ cena ≤ 10⁶'],
            examples: [{ input: '3\n499 1250 6', note: 'Razem 1755 groszy, czyli 17 zł i 55 gr.' }, { input: '2\n100 5' }],
            hint: R`Najpierw zsumuj grosze (long long na wszelki wypadek), a potem suma / 100 to złote, a suma % 100 — grosze. Grosze wypisz przez setw(2) i setfill('0'), bo inaczej 1.05 zamieni się w 1.5.`,
            tests: (r) => ['3\n499 1250 6', '2\n100 5', '1\n1', '1\n99', '1\n1000000', `1000\n${Array(1000).fill(1000000).join(' ')}`,
                `20\n${r.arr(20, 1, 999).join(' ')}`, `1000\n${r.arr(1000, 1, 1e6).join(' ')}`, `5\n${r.arr(5, 1, 200).join(' ')}`],
            solve: (inp) => { const v = nums(inp); const s = v.slice(1, 1 + v[0]).reduce((a, b) => a + b, 0); return `${idiv(s, 100)}.${p2(s % 100)}`; },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        long long c;
        cin >> c;
        suma += c;
    }
    cout << suma / 100 << "." << setw(2) << setfill('0') << suma % 100 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-tygodnie-dni-godziny', krok: 3, level: 'latwe',
            title: 'Tygodnie, dni i godziny',
            short: 'Zamień godziny na pełne tygodnie, dni i godziny.',
            tags: ['/ 168', '% 168 / 24', '% 24'],
            statement: ['Wycieczka trwała h godzin. Ile to pełnych tygodni, ile dni ponad nie i ile godzin ponad pełne dni? Tydzień ma 7 dni, a doba — 24 godziny.'],
            input_format: ['Jedna liczba całkowita h.'],
            output_format: ['Jeden wiersz z trzema liczbami: tygodnie, dni i godziny.'],
            constraints: ['0 ≤ h ≤ 10⁹'],
            examples: [{ input: '200', note: '200 = 168 + 24 + 8: tydzień, dzień i 8 godzin.' }, { input: '23' }],
            hint: R`Tydzień to 7 · 24 = 168 godzin. Tygodnie: h / 168. Dni: h % 168 / 24 — to, co zostało po pełnych tygodniach, dzielone na doby. Godziny: h % 24.`,
            tests: (r) => ['200', '23', '0', '24', '168', '167', '1000000000', String(r.int(169, 10000)), String(r.int(1e4, 1e9))],
            solve: (inp) => { const t = nums(inp)[0]; return `${idiv(t, 168)} ${idiv(t % 168, 24)} ${t % 24}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int h;
    cin >> h;
    cout << h / 168 << " " << h % 168 / 24 << " " << h % 24 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-ile-trwal-bieg', krok: 3, level: 'srednie',
            title: 'Ile trwał bieg?',
            short: 'Odejmij dwie godziny HH:MM:SS i wypisz różnicę w postaci G:MM:SS.',
            tags: ['składanie: h · 3600 + m · 60 + s', 'rozkładanie', 'separatory'],
            statement: ['Zawodnik wystartował o godzinie HH:MM:SS i dobiegł do mety o HH:MM:SS tego samego dnia. Ile trwał bieg? Wypisz czas w postaci G:MM:SS — godziny bez zera z przodu, a minuty i sekundy zawsze dwiema cyframi.'],
            input_format: ['Jeden wiersz: godzina startu i godzina dobiegnięcia w formacie HH:MM:SS, oddzielone spacją.'],
            output_format: ['Jeden wiersz w postaci G:MM:SS.'],
            constraints: ['00:00:00 ≤ start ≤ meta ≤ 23:59:59'],
            examples: [{ input: '08:47:30 10:15:10' }, { input: '09:00:00 09:00:59' }],
            hint: R`Zamień obie godziny na liczbę sekund od północy: h · 3600 + m · 60 + s. Odejmij je, a różnicę d rozłóż z powrotem: d / 3600, d % 3600 / 60 i d % 60. Dwukropki wczytasz do zmiennej typu char.`,
            tests: (r) => {
                const out = ['08:47:30 10:15:10', '09:00:00 09:00:59', '00:00:00 23:59:59', '12:00:00 12:00:00', '23:59:58 23:59:59'];
                const f = (t) => `${p2(idiv(t, 3600))}:${p2(idiv(t % 3600, 60))}:${p2(t % 60)}`;
                for (let i = 0; i < 4; i++) { const a = r.int(0, 86399), b = r.int(0, 86399); out.push(`${f(Math.min(a, b))} ${f(Math.max(a, b))}`); }
                return out;
            },
            solve: (inp) => {
                const v = inp.trim().split(/[\s:]+/).map(Number);
                const d = (v[3] * 3600 + v[4] * 60 + v[5]) - (v[0] * 3600 + v[1] * 60 + v[2]);
                return `${idiv(d, 3600)}:${p2(idiv(d % 3600, 60))}:${p2(d % 60)}`;
            },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int h1, m1, s1, h2, m2, s2;
    char z;
    cin >> h1 >> z >> m1 >> z >> s1 >> h2 >> z >> m2 >> z >> s2;
    int t1 = h1 * 3600 + m1 * 60 + s1;
    int t2 = h2 * 3600 + m2 * 60 + s2;
    int d = t2 - t1;
    cout << d / 3600 << ":" << setfill('0') << setw(2) << d % 3600 / 60 << ":" << setw(2) << d % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-reszta-monetami', krok: 3, level: 'srednie',
            title: 'Reszta w monetach',
            short: 'Wydaj resztę monetami od 5 zł do 1 gr — zawsze największą, jaka się mieści.',
            tags: ['/ i %=', 'kolejne nominały', 'grosze'],
            statement: ['W kasie są monety 5 zł, 2 zł, 1 zł, 50 gr, 20 gr, 10 gr, 5 gr, 2 gr i 1 gr — każdej dowolnie dużo. Zakupy kosztują c groszy, a klient płaci kwotą z groszy. Kasjer wydaje resztę zawsze największą monetą, która jeszcze się mieści. Wypisz, ile monet każdego rodzaju wyda — dziewięć liczb, od monety 5 zł do monety 1 gr.'],
            input_format: ['Jeden wiersz z dwiema liczbami całkowitymi c i z (w groszach).'],
            output_format: ['Jeden wiersz z dziewięcioma liczbami.'],
            constraints: ['1 ≤ c ≤ z ≤ 10⁹'],
            examples: [{ input: '1213 2000', note: 'Reszta to 787 gr = 500 + 200 + 50 + 20 + 10 + 5 + 2.' }],
            hint: R`Reszta to z − c. Dla każdej monety, od największej (500 gr) do najmniejszej (1 gr): ile = reszta / moneta; reszta %= moneta;. Ten sam schemat powtarzasz dziewięć razy — możesz go po prostu napisać dziewięć razy.`,
            tests: (r) => ['1213 2000', '100 100', '1 1000000000', '1 2', '50 939', '999 1000', '1 889', `${r.int(1, 5000)} ${r.int(5000, 20000)}`, `${r.int(1, 1e6)} ${r.int(1e6, 1e9)}`],
            solve: (inp) => {
                const [c, z] = nums(inp);
                let x = z - c;
                return [500, 200, 100, 50, 20, 10, 5, 2, 1].map((m) => { const k = idiv(x, m); x %= m; return k; }).join(' ');
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int c, z;
    cin >> c >> z;
    int r = z - c;
    cout << r / 500 << " "; r %= 500;
    cout << r / 200 << " "; r %= 200;
    cout << r / 100 << " "; r %= 100;
    cout << r / 50 << " ";  r %= 50;
    cout << r / 20 << " ";  r %= 20;
    cout << r / 10 << " ";  r %= 10;
    cout << r / 5 << " ";   r %= 5;
    cout << r / 2 << " ";   r %= 2;
    cout << r << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-jardy-stopy-cale', krok: 3, level: 'srednie',
            title: 'Jardy, stopy i cale',
            short: 'Zamień cale na jardy, stopy i cale — jednostki o różnych przelicznikach.',
            tags: ['/ 36', '% 36 / 12', '% 12', 'long long'],
            statement: ['W Anglii długość mierzy się w jardach, stopach i calach: 1 jard to 3 stopy, a 1 stopa to 12 cali. Wczytaj długość w calach i wypisz ją w jardach, stopach i calach — tak, żeby stóp było mniej niż 3, a cali mniej niż 12.'],
            input_format: ['Jedna liczba całkowita — długość w calach.'],
            output_format: ['Jeden wiersz w postaci J yd S ft C in.'],
            constraints: ['0 ≤ długość ≤ 10¹⁸'],
            examples: [{ input: '100', note: '100 = 2 · 36 + 2 · 12 + 4.' }, { input: '35' }],
            hint: R`Jard ma 3 · 12 = 36 cali. Jardy: c / 36, stopy: c % 36 / 12, cale: c % 12. Albo od najmniejszej jednostki: cale = c % 12; c /= 12; (teraz c to stopy) stopy = c % 3; c /= 3; (teraz jardy). Liczba ma do 19 cyfr — long long.`,
            tests: (r) => ['100', '35', '36', '0', '11', '12', '1000000000000000000', String(r.big(1, '1000000')), String(r.big(1, '1000000000000000000'))],
            solve: (inp) => { const c = bigs(inp)[0]; return `${c / 36n} yd ${c % 36n / 12n} ft ${c % 12n} in`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long c;
    cin >> c;
    cout << c / 36 << " yd " << c % 36 / 12 << " ft " << c % 12 << " in\n";
    return 0;
}`,
        },
        {
            id: 'mod-doba-na-planecie', krok: 3, level: 'srednie',
            title: 'Doba na innej planecie',
            short: 'Doba ma H godzin, godzina M minut. Rozłóż t minut na doby, godziny i minuty.',
            tags: ['t / (H · M)', '% M', 'nawiasy', 'long long'],
            statement: ['Na planecie Modulo doba ma H godzin, a godzina — M minut. Od lądowania sondy minęło t minut. Ile pełnych dób minęło i którą godzinę oraz minutę pokazuje teraz zegar sondy, jeśli w chwili lądowania wskazywał 0:00? Wypisz trzy liczby: doby, godziny i minuty.'],
            input_format: ['Jeden wiersz z trzema liczbami całkowitymi H, M i t.'],
            output_format: ['Jeden wiersz z trzema liczbami: pełne doby, godzina i minuta.'],
            constraints: ['1 ≤ H, M ≤ 10⁶', '0 ≤ t ≤ 10¹⁸'],
            examples: [{ input: '30 50 4321', note: 'Doba trwa 30 · 50 = 1500 minut. 4321 = 2 · 1500 + 26 · 50 + 21.' }, { input: '24 60 1500', note: 'Na Ziemi: 1500 minut to doba i godzina.' }],
            hint: R`Doba ma H · M minut — przez tę liczbę trzeba dzielić. Doby: t / (H * M), godziny: t % (H * M) / M, minuty: t % M. Nawias przy H * M jest konieczny — bez niego t / H * M znaczy coś zupełnie innego. Wszystko w long long.`,
            tests: (r) => ['30 50 4321', '24 60 1500', '1 1 0', '1 1 1000000000000000000', '1000000 1000000 1000000000000000000', '24 60 86399',
                `${r.int(1, 100)} ${r.int(1, 100)} ${r.big(0, '1000000')}`, `${r.int(1, 1e6)} ${r.int(1, 1e6)} ${r.big(0, '1000000000000000000')}`],
            solve: (inp) => { const [H, M, t] = bigs(inp); const d = H * M; return `${t / d} ${t % d / M} ${t % M}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long H, M, t;
    cin >> H >> M >> t;
    long long doba = H * M;
    cout << t / doba << " " << t % doba / M << " " << t % M << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 4 · cyfry liczby
        {
            id: 'mod-cyfra-setek', krok: 4, level: 'latwe',
            title: 'Cyfra setek',
            short: 'Wypisz cyfrę setek liczby: n / 100 % 10.',
            tags: ['n / 100 % 10', 'long long'],
            statement: ['Wczytaj liczbę naturalną n i wypisz jej cyfrę setek. Jeśli liczba jest mniejsza od 100, jej cyfra setek wynosi 0.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna cyfra.'],
            constraints: ['0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '52847' }, { input: '99' }],
            hint: R`n / 100 obcina dwie ostatnie cyfry, a % 10 bierze ostatnią z tych, które zostały: n / 100 % 10. Liczba może mieć 19 cyfr — użyj long long.`,
            tests: (r) => ['52847', '99', '100', '0', '1000000000000000000', '999999999999999999', '123', String(r.big(100, '1000000')), String(r.big(1, '1000000000000000000'))],
            solve: (inp) => String(bigs(inp)[0] / 100n % 10n),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    cout << n / 100 % 10 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-dwie-ostatnie', krok: 4, level: 'latwe',
            title: 'Dwie ostatnie cyfry',
            short: 'Wypisz dwie ostatnie cyfry liczby — zawsze dwie, np. 05.',
            tags: ['n % 100', 'setw(2)', 'setfill'],
            statement: ['Wczytaj liczbę naturalną n i wypisz jej dwie ostatnie cyfry — zawsze dwie, także gdy pierwsza z nich to zero: dla 1205 wypisz 05, a dla 7 — 07.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwie cyfry.'],
            constraints: ['0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '1205' }, { input: '7' }, { input: '123456' }],
            hint: R`Dwie ostatnie cyfry to n % 100. Żeby 5 wypisało się jako 05, użyj setw(2) i setfill('0') z biblioteki <iomanip>.`,
            tests: (r) => ['1205', '7', '123456', '0', '100', '99', '1000000000000000000', '999999999999999999', String(r.big(1, '1000000000000000000'))],
            solve: (inp) => p2(bigs(inp)[0] % 100n),
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    long long n;
    cin >> n;
    cout << setw(2) << setfill('0') << n % 100 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-cyfra-na-pozycji', krok: 4, level: 'latwe',
            title: 'Cyfra na pozycji k',
            short: 'Wypisz k-tą cyfrę liczby, licząc od końca.',
            tags: ['n /= 10 w pętli', 'n % 10'],
            statement: ['Wczytaj liczbę naturalną n i numer pozycji k. Wypisz k-tą cyfrę liczby n licząc od końca: k = 1 to cyfra jedności, k = 2 — dziesiątek, k = 3 — setek i tak dalej. Jeśli liczba ma mniej niż k cyfr, wypisz 0.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jedna cyfra.'],
            constraints: ['0 ≤ n ≤ 10¹⁸', '1 ≤ k ≤ 20'],
            examples: [{ input: '9876543210 4', note: 'Od końca: 0, 1, 2, 3 — czwarta cyfra to 3.' }, { input: '52 5' }],
            hint: R`Odetnij k − 1 cyfr z prawej (pętla, w której n /= 10), a potem wypisz n % 10. Jeśli cyfry się skończą, n zostanie zerem, a 0 % 10 to 0 — więc przypadek „za mało cyfr” załatwia się sam.`,
            tests: (r) => ['9876543210 4', '52 5', '0 1', '1000000000000000000 19', '1000000000000000000 20', '123 1', '123 3', `${r.big(1, '1000000000000000000')} ${r.int(1, 19)}`, `${r.big(1, '1000000000000000000')} ${r.int(1, 10)}`],
            solve: (inp) => { const [n, k] = bigs(inp); return String(n / 10n ** (k - 1n) % 10n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    int k;
    cin >> n >> k;
    for (int i = 1; i < k; i++) {
        n /= 10;
    }
    cout << n % 10 << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-pierwsza-ostatnia', krok: 4, level: 'latwe',
            title: 'Pierwsza i ostatnia cyfra',
            short: 'Wypisz pierwszą i ostatnią cyfrę liczby.',
            tags: ['n % 10', 'while (n >= 10)'],
            statement: ['Wczytaj liczbę naturalną n i wypisz jej pierwszą i ostatnią cyfrę, oddzielone spacją.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Dwie cyfry oddzielone spacją.'],
            constraints: ['0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '52847' }, { input: '9', note: 'Jedna cyfra jest jednocześnie pierwsza i ostatnia.' }],
            hint: R`Ostatnia cyfra to n % 10 — zapamiętaj ją od razu, zanim zaczniesz zmieniać n. Pierwszą znajdziesz, obcinając cyfry z prawej, dopóki liczba ma więcej niż jedną cyfrę: while (n >= 10) n /= 10;.`,
            tests: (r) => ['52847', '9', '0', '10', '1000000000000000000', '999999999999999999', '81', String(r.big(1, '1000000')), String(r.big(1, '1000000000000000000'))],
            solve: (inp) => { const s = String(bigs(inp)[0]); return `${s[0]} ${s[s.length - 1]}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    int ostatnia = n % 10;
    while (n >= 10) {
        n /= 10;
    }
    cout << n << " " << ostatnia << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-ile-razy-cyfra', krok: 4, level: 'srednie',
            title: 'Ile razy cyfra d?',
            short: 'Policz, ile razy cyfra d występuje w zapisie liczby — uwaga na zero.',
            tags: ['n % 10 i n /= 10', 'do … while', 'licznik'],
            statement: ['Wczytaj liczbę naturalną n i cyfrę d. Wypisz, ile razy cyfra d występuje w zapisie liczby n.'],
            input_format: ['Jeden wiersz z liczbami n i d.'],
            output_format: ['Jedna liczba.'],
            constraints: ['0 ≤ n ≤ 10¹⁸', '0 ≤ d ≤ 9'],
            examples: [{ input: '1001 0' }, { input: '0 0', note: 'Liczba 0 ma jedną cyfrę — zero.' }, { input: '777 7' }],
            hint: R`Przejdź po cyfrach parą n % 10 i n /= 10, licząc te równe d. Pułapka: dla n = 0 pętla while (n > 0) nie wykona się ani razu, a zero ma przecież jedną cyfrę. Pomaga do … while, które wykonuje się co najmniej raz.`,
            tests: (r) => ['1001 0', '0 0', '777 7', '0 5', '1000000000000000000 0', '1000000000000000000 1', '123456789 9',
                `${r.big(1, '1000000000000000000')} ${r.int(0, 9)}`, `${cyfry(r, 18, '1')} ${r.int(0, 9)}`, `${r.word(15, '12')}${r.word(3, '0')} 1`.replace(/^0+/, '')],
            solve: (inp) => { const [n, d] = toks(inp); return String([...n].filter((c) => c === d).length); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    int d;
    cin >> n >> d;
    int ile = 0;
    do {
        if (n % 10 == d) {
            ile++;
        }
        n /= 10;
    } while (n > 0);
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-tylko-parzyste-cyfry', krok: 4, level: 'srednie',
            title: 'Tylko parzyste cyfry',
            short: 'Zostaw w liczbie tylko parzyste cyfry, w tej samej kolejności.',
            tags: ['wynik += c * p', 'p *= 10', 'do … while'],
            statement: ['Wczytaj liczbę naturalną n i utwórz z niej nową liczbę, zostawiając tylko cyfry parzyste (0, 2, 4, 6, 8) w tej samej kolejności. Wypisz ją jako zwykłą liczbę — zera z przodu znikają: z 1023 zostaje 02, czyli 2. Jeśli n nie ma żadnej parzystej cyfry, wypisz BRAK.'],
            input_format: ['Jedna liczba całkowita n.'],
            output_format: ['Jedna liczba albo słowo BRAK.'],
            constraints: ['0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '52847' }, { input: '1023' }, { input: '1357' }, { input: '1030', note: 'Zostają dwa zera, czyli liczba 0.' }],
            hint: R`Idź po cyfrach od końca. Każdą parzystą cyfrę c doklejaj z przodu nowej liczby: wynik += c * p; p *= 10;, gdzie p zaczyna od 1 i mówi, ile wart jest kolejny „slot” (jedności, dziesiątki, …). To, czy była jakakolwiek parzysta cyfra, poznasz po tym, że p urosło ponad 1. Pamiętaj o n = 0 — to jedna parzysta cyfra.`,
            tests: (r) => ['52847', '1023', '1357', '1030', '0', '1000000000000000000', '864208642086420864', '999999999999999999', '20',
                String(r.big(1, '1000000000000000000')), cyfry(r, 18)],
            solve: (inp) => { const ev = [...toks(inp)[0]].filter((c) => '02468'.includes(c)).join(''); return ev ? String(BigInt(ev)) : 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    long long wynik = 0, p = 1;
    do {
        int c = n % 10;
        if (c % 2 == 0) {
            wynik += c * p;
            p *= 10;
        }
        n /= 10;
    } while (n > 0);
    if (p == 1) {
        cout << "BRAK\n";
    } else {
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'mod-wytnij-cyfre', krok: 4, level: 'srednie',
            title: 'Wytnij cyfrę',
            short: 'Usuń z liczby k-tą cyfrę od końca i zsuń pozostałe.',
            tags: ['n % p', 'n / p / 10', 'potęga 10'],
            statement: ['Wczytaj liczbę n i numer k. Usuń z liczby n k-tą cyfrę licząc od końca (k = 1 to cyfra jedności), a pozostałe cyfry zsuń do siebie. Wypisz wynik jako liczbę — jeśli na początku zostaną zera, znikają (z 105 po usunięciu jedynki zostaje 05, czyli 5). Jeśli nie zostanie żadna cyfra, wypisz 0.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jedna liczba.'],
            constraints: ['1 ≤ n ≤ 10¹⁸', 'n ma co najmniej k cyfr'],
            examples: [{ input: '52847 2' }, { input: '105 3' }, { input: '7 1' }],
            hint: R`Niech p = 10 do potęgi k − 1 (policz pętlą). Cyfry na prawo od wycinanej to n % p, a cyfry na lewo — n / p / 10. Sklej je: n / p / 10 * p + n % p. Sprawdź na 52847 i k = 2: p = 10, lewa część 528, prawa 7, wynik 528 · 10 + 7 = 5287.`,
            tests: (r) => {
                const out = ['52847 2', '105 3', '7 1', '1000000000000000000 19', '1000000000000000000 1', '1000000000000000000 18', '90 2', '987654321 9'];
                for (let i = 0; i < 3; i++) { const n = String(r.big(1, '1000000000000000000')); out.push(`${n} ${r.int(1, n.length)}`); }
                return out;
            },
            check: (inp) => { const [n, k] = toks(inp); return Number(k) <= n.length ? null : 'k'; },
            solve: (inp) => { const [n, k] = toks(inp); const i = n.length - Number(k); const t = n.slice(0, i) + n.slice(i + 1); return t ? String(BigInt(t)) : '0'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    int k;
    cin >> n >> k;
    long long p = 1;
    for (int i = 1; i < k; i++) {
        p *= 10;
    }
    cout << n / p / 10 * p + n % p << "\n";
    return 0;
}`,
        },
        {
            id: 'mod-system-b', krok: 4, level: 'srednie',
            title: 'Zapis w systemie o podstawie b',
            short: 'Zamień liczbę na system o podstawie b od 2 do 10.',
            tags: ['n % b', 'n /= b', 'doklejanie do napisu'],
            statement: ['W systemie dziesiątkowym kolejne cyfry liczby to reszty z dzielenia przez 10. W systemie o podstawie b — reszty z dzielenia przez b: n % b to ostatnia cyfra, a n / b to liczba bez niej. Wczytaj n i b i wypisz zapis liczby n w systemie o podstawie b (bez zer z przodu).'],
            input_format: ['Jeden wiersz z liczbami n i b.'],
            output_format: ['Zapis liczby n w systemie o podstawie b.'],
            constraints: ['0 ≤ n ≤ 10¹⁸', '2 ≤ b ≤ 10'],
            examples: [{ input: '100 8', note: '100 = 1 · 64 + 4 · 8 + 4.' }, { input: '13 2' }, { input: '0 5' }],
            hint: R`Cyfry wychodzą od końca, więc doklejaj każdą na początek napisu: s = char('0' + n % b) + s; n /= b;. Użyj do … while, żeby liczba 0 dała napis "0".`,
            tests: (r) => ['100 8', '13 2', '0 5', '1000000000000000000 2', '1000000000000000000 10', '1 2', '9 10', '2026 7', `${r.big(1, '1000000000000000000')} ${r.int(2, 9)}`, `${r.big(1, '100000')} ${r.int(2, 9)}`],
            solve: (inp) => { const [n, b] = bigs(inp); return n.toString(Number(b)); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    long long n;
    int b;
    cin >> n >> b;
    string s = "";
    do {
        s = char('0' + n % b) + s;
        n /= b;
    } while (n > 0);
    cout << s << "\n";
    return 0;
}`,
        },
    ];
};
