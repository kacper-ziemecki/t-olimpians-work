// Typy zmiennych — ćwiczenia w trakcie lekcji, części 7–11: string, bool, const i auto, zakresy, konwersje.
module.exports = (h) => {
    const { reader, nums, toks, join, fx, safe, dec, capital } = h;
    const R = String.raw;
    const INT_MAX = 2147483647n, INT_MIN = -2147483648n;
    const PI = 3.14159265358979;

    return [
        // ================================================================ KROK 7 · string
        {
            id: 'tz-powitanie', krok: 7, level: 'latwe',
            title: 'Powitanie',
            short: 'Wczytaj imię i przywitaj się: Czesc, Ola!',
            tags: ['string', 'cin'],
            statement: ['Wczytaj imię i wypisz powitanie w dokładnie takiej postaci: Czesc, IMIE! — czyli słowo Czesc, przecinek, spacja, wczytane imię i wykrzyknik.'],
            input_format: ['W jedynym wierszu jedno imię — słowo z liter alfabetu angielskiego, zaczynające się wielką literą.'],
            output_format: ['Wypisz jeden wiersz z powitaniem.'],
            constraints: ['imię ma od 1 do 20 liter'],
            examples: [{ input: 'Ola' }],
            hint: R`Tekst trzymasz w zmiennej typu string (na górze dopisz #include <string>). Instrukcja cin >> imie; wczyta całe słowo. Potem: cout << "Czesc, " << imie << "!\n";`,
            tests: (r) => ['Ola', 'X', 'Bajtek', 'Maksymilian', capital(r.word(r.int(2, 20))), capital(r.word(r.int(2, 20))), capital(r.word(20))],
            solve: (inp) => `Czesc, ${toks(inp)[0]}!`,
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string imie;
    cin >> imie;
    cout << "Czesc, " << imie << "!\n";
    return 0;
}`,
        },
        {
            id: 'tz-dlugosc-slowa', krok: 7, level: 'latwe',
            title: 'Długość słowa',
            short: 'Z ilu liter składa się wczytane słowo?',
            tags: ['string', '.length()'],
            statement: ['Wczytaj słowo i wypisz, z ilu liter się składa.'],
            input_format: ['W jedynym wierszu jedno słowo.'],
            output_format: ['Wypisz jedną liczbę — długość słowa.'],
            constraints: ['słowo ma od 1 do 100 małych liter alfabetu angielskiego'],
            examples: [{ input: 'olimpiada' }],
            hint: 'Każdy string umie podać swoją długość: s.length() albo s.size() — oba działają tak samo. Wypisz: cout << s.length();',
            tests: (r) => ['a', 'ab', 'informatyka', r.word(100), r.word(r.int(1, 100)), r.word(r.int(1, 100)), r.word(r.int(1, 10))],
            solve: (inp) => String(toks(inp)[0].length),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    cout << s.length() << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-pierwsza-i-ostatnia', krok: 7, level: 'srednie',
            title: 'Pierwsza i ostatnia litera',
            short: 'Wypisz pierwszą i ostatnią literę słowa. Litery liczymy od zera!',
            tags: ['string', 's[0]', 's[s.length() - 1]'],
            statement: [
                'Wczytaj słowo i wypisz w jednym wierszu jego pierwszą i ostatnią literę, oddzielone spacją.',
                'Litery w stringu są ponumerowane od zera: s[0] to pierwsza litera. Pomyśl, jaki numer ma ostatnia litera, jeśli słowo ma s.length() liter.',
            ],
            input_format: ['W jedynym wierszu jedno słowo.'],
            output_format: ['Wypisz pierwszą i ostatnią literę słowa, oddzielone spacją.'],
            constraints: ['słowo ma od 1 do 100 małych liter alfabetu angielskiego'],
            examples: [{ input: 'bajtek' }, { input: 'a', note: 'Słowo jednoliterowe: pierwsza i ostatnia litera to ta sama litera.' }],
            hint: 'Pierwsza litera to s[0]. Skoro numeracja zaczyna się od zera, ostatnia litera ma numer o 1 mniejszy niż długość słowa: s[s.length() - 1]. Zapis s[s.length()] wychodzi już poza słowo.',
            tests: (r) => ['ab', 'kajak', 'informatyka', r.word(100), r.word(r.int(2, 100)), r.word(r.int(2, 100)), r.word(r.int(2, 9))],
            solve: (inp) => { const s = toks(inp)[0]; return `${s[0]} ${s[s.length - 1]}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    cin >> s;
    cout << s[0] << " " << s[s.length() - 1] << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-sklejanie', krok: 7, level: 'latwe',
            title: 'Sklejanie słów',
            short: 'Sklej dwa słowa w jedno i podaj długość wyniku.',
            tags: ['string', '+', '.length()'],
            statement: ['Wczytaj dwa słowa i wypisz w pierwszym wierszu oba słowa sklejone ze sobą (bez spacji między nimi), a w drugim — długość powstałego napisu.'],
            input_format: ['W jedynym wierszu dwa słowa oddzielone spacją.'],
            output_format: ['W pierwszym wierszu wypisz sklejone słowa, a w drugim długość tego napisu.'],
            constraints: ['każde słowo ma od 1 do 50 małych liter alfabetu angielskiego'],
            examples: [{ input: 'kot let' }],
            hint: 'Napisy skleja się plusem: string razem = a + b;. Długość nowego napisu to razem.length() — tyle samo, co a.length() + b.length().',
            tests: (r) => ['a b', 'pod loga', 'olimp iada', `${r.word(50)} ${r.word(50)}`,
                ...Array.from({ length: 3 }, () => `${r.word(r.int(1, 50))} ${r.word(r.int(1, 50))}`)],
            solve: (inp) => { const [a, b] = toks(inp); return join(a + b, (a + b).length); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string a, b;
    cin >> a >> b;
    string razem = a + b;
    cout << razem << "\n";
    cout << razem.length() << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-linia', krok: 7, level: 'srednie',
            title: 'Linia ze znaków',
            short: 'Zbuduj napis z n powtórzeń jednego znaku — bez pętli, string(n, c).',
            tags: ['string', 'string(n, c)', 'char'],
            statement: ['Wczytaj liczbę n i znak c, a potem wypisz napis złożony z n znaków c. Pętli jeszcze nie znamy — i nie są potrzebne: zrób to jedną konstrukcją string(n, c) z lekcji.'],
            input_format: ['W jedynym wierszu liczba całkowita n i jeden znak c, oddzielone spacją.'],
            output_format: ['Wypisz jeden wiersz: n znaków c.'],
            constraints: ['1 ≤ n ≤ 100', 'c to widoczny znak (nie spacja)'],
            examples: [{ input: '5 *' }, { input: '3 7', note: 'Znak może być też cyfrą — wczytany do zmiennej char, to po prostu znak 7.' }],
            hint: R`string(n, c) tworzy napis z n powtórzeń znaku c, np. string(3, '#') to "###". Możesz go od razu wypisać: cout << string(n, c) << "\n";`,
            tests: (r) => ['1 x', '100 =', '10 -', '4 #', `${r.int(1, 100)} ${String.fromCharCode(r.int(33, 126))}`, `${r.int(1, 100)} ${String.fromCharCode(r.int(33, 126))}`],
            solve: (inp) => { const [n, c] = toks(inp); return c.repeat(Number(n)); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    char c;
    cin >> n >> c;
    cout << string(n, c) << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · bool
        {
            id: 'tz-pelnoletni', krok: 8, level: 'latwe',
            title: 'Czy pełnoletni?',
            short: 'Wypisz 1 albo 0 — wynik porównania wiek >= 18.',
            tags: ['bool', '>='],
            statement: [
                'Wczytaj wiek osoby i wypisz 1, jeśli jest pełnoletnia (ma co najmniej 18 lat), albo 0, jeśli nie jest.',
                'Zrób to bez instrukcji if — wystarczy wypisać wynik porównania. Porównanie samo jest wartością typu bool, a cout wypisuje true jako 1, a false jako 0.',
            ],
            input_format: ['W jedynym wierszu jedna liczba całkowita — wiek.'],
            output_format: ['Wypisz 1 albo 0.'],
            constraints: ['0 ≤ wiek ≤ 150'],
            examples: [
                { input: '18', note: 'Kto ma dokładnie 18 lat, jest już pełnoletni — dlatego porównujemy znakiem >=, a nie >.' },
                { input: '17' },
            ],
            hint: 'cout << (wiek >= 18); — nawias jest konieczny. Bez niego komputer próbowałby najpierw wypisać wiek, a dopiero potem porównać — i program by się nie skompilował.',
            tests: (r) => ['0', '1', '17', '18', '19', '150', r.int(0, 150), r.int(0, 150)],
            solve: (inp) => (reader(inp).int() >= 18 ? '1' : '0'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int wiek;
    cin >> wiek;
    cout << (wiek >= 18) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-parzysta', krok: 8, level: 'latwe',
            title: 'Czy parzysta?',
            short: 'Wypisz true albo false — słowami, dzięki boolalpha.',
            tags: ['bool', 'boolalpha', '%'],
            statement: [
                'Wczytaj liczbę całkowitą n i wypisz słowo true, jeśli jest parzysta, albo false, jeśli jest nieparzysta.',
                'Liczba jest parzysta, gdy reszta z jej dzielenia przez 2 wynosi 0.',
            ],
            input_format: ['W jedynym wierszu jedna liczba całkowita n.'],
            output_format: ['Wypisz słowo true albo false.'],
            constraints: ['−10⁹ ≤ n ≤ 10⁹'],
            examples: [
                { input: '10' },
                { input: '-7', note: 'Dla liczb ujemnych reszta w C++ też jest ujemna (−7 % 2 to −1), ale porównanie z zerem i tak działa.' },
            ],
            hint: 'Słowa true/false zamiast 1/0 włączysz, wypisując wcześniej boolalpha: cout << boolalpha << (n % 2 == 0);',
            tests: (r) => ['0', '1', '-1', '2', '-2', '1000000000', '-999999999', r.int(-1e9, 1e9), r.int(-1e9, 1e9)],
            solve: (inp) => (reader(inp).int() % 2 === 0 ? 'true' : 'false'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << boolalpha << (n % 2 == 0) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-w-przedziale', krok: 8, level: 'srednie',
            title: 'W przedziale',
            short: 'Czy a ≤ x ≤ b? Uwaga: w C++ trzeba to zapisać inaczej niż w matematyce.',
            tags: ['bool', '&&'],
            statement: [
                'Wczytaj trzy liczby całkowite a, b i x. Wypisz 1, jeśli x leży w przedziale od a do b (razem z końcami), czyli a ≤ x ≤ b, albo 0 w przeciwnym razie.',
                'Pułapka: w C++ nie da się zapisać a <= x <= b tak jak w matematyce — taki zapis się skompiluje, ale da zły wynik. Trzeba połączyć dwa osobne porównania.',
            ],
            input_format: ['W jedynym wierszu trzy liczby całkowite a, b, x.'],
            output_format: ['Wypisz 1 albo 0.'],
            constraints: ['−10⁹ ≤ a ≤ b ≤ 10⁹', '−10⁹ ≤ x ≤ 10⁹'],
            examples: [
                { input: '1 10 5' },
                { input: '1 10 11' },
                { input: '-5 5 -5', note: 'Końce przedziału też się liczą.' },
            ],
            hint: '„x jest między a i b” to „x jest co najmniej a ORAZ x jest co najwyżej b”: (a <= x && x <= b). Operator && daje true tylko wtedy, gdy oba warunki są prawdziwe.',
            tests: (r) => {
                const out = ['5 10 2', '-5 -1 -3', '0 0 0', '0 0 1', '-1000000000 1000000000 0', '7 7 7', '3 9 9', '3 9 10'];
                for (let i = 0; i < 4; i++) {
                    const a = r.int(-1e9, 1e9), b = r.int(a, 1e9);
                    out.push(`${a} ${b} ${r() < 0.5 ? r.int(a, b) : r.int(-1e9, 1e9)}`);
                }
                return out;
            },
            solve: (inp) => { const [a, b, x] = nums(inp); return a <= x && x <= b ? '1' : '0'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, x;
    cin >> a >> b >> x;
    cout << (a <= x && x <= b) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-mozna-pospac', krok: 8, level: 'srednie',
            title: 'Czy można pospać?',
            short: 'Weekend albo dzień wolny? Połącz warunki operatorem ||.',
            tags: ['bool', '||', '=='],
            statement: ['Bajtek może dłużej pospać, jeśli jest weekend (sobota albo niedziela) albo dzień wolny od szkoły (np. ferie). Dni tygodnia numerujemy od 1 (poniedziałek) do 7 (niedziela). Wczytaj numer dnia d i liczbę w (1 — dzień wolny od szkoły, 0 — zwykły dzień) i wypisz 1, jeśli Bajtek może pospać, albo 0, jeśli nie.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite d i w.'],
            output_format: ['Wypisz 1 albo 0.'],
            constraints: ['1 ≤ d ≤ 7', 'w jest równe 0 albo 1'],
            examples: [{ input: '6 0', note: 'Sobota.' }, { input: '3 1', note: 'Środa, ale ferie.' }, { input: '2 0' }],
            hint: 'Operator || (lub) daje true, gdy przynajmniej jeden warunek jest prawdziwy: (d == 6 || d == 7 || w == 1). Pamiętaj, że porównanie to podwójne ==.',
            tests: () => { const out = []; for (let d = 1; d <= 7; d++) for (let w = 0; w <= 1; w++) out.push(`${d} ${w}`); return out; },
            solve: (inp) => { const [d, w] = nums(inp); return d === 6 || d === 7 || w === 1 ? '1' : '0'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int d, w;
    cin >> d >> w;
    cout << (d == 6 || d == 7 || w == 1) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-ile-dodatnich', krok: 8, level: 'srednie',
            title: 'Ile liczb jest dodatnich?',
            short: 'Policz dodatnie liczby bez if — dodaj do siebie wyniki porównań.',
            tags: ['bool', 'bool jako liczba'],
            statement: [
                'Wczytaj trzy liczby całkowite i wypisz, ile z nich jest dodatnich (większych od zera).',
                'Spróbuj bez instrukcji if: w działaniach arytmetycznych true zamienia się na 1, a false na 0.',
            ],
            input_format: ['W jedynym wierszu trzy liczby całkowite a, b, c.'],
            output_format: ['Wypisz jedną liczbę od 0 do 3.'],
            constraints: ['−10⁹ ≤ a, b, c ≤ 10⁹'],
            examples: [{ input: '5 -2 7' }, { input: '0 0 0', note: 'Zero nie jest dodatnie.' }],
            hint: 'Każde porównanie (a > 0) to 1 albo 0. Wystarczy je dodać: cout << (a > 0) + (b > 0) + (c > 0);',
            tests: (r) => ['1 2 3', '-1 -2 -3', '0 1 -1', '1000000000 -1000000000 0', '1 0 1',
                ...Array.from({ length: 5 }, () => `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`)],
            solve: (inp) => String(nums(inp).filter((x) => x > 0).length),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << (a > 0) + (b > 0) + (c > 0) << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 9 · const i auto
        {
            id: 'tz-kolo', krok: 9, level: 'latwe',
            title: 'Pole i obwód koła',
            short: 'Liczba π jako stała const double PI — pole i obwód koła.',
            tags: ['const', 'double', 'setprecision'],
            statement: [
                'Wczytaj promień koła r i wypisz jego pole (π · r²) w pierwszym wierszu i obwód (2 · π · r) w drugim — oba wyniki z dokładnością do dwóch miejsc po przecinku.',
                'Liczbę π zapisz w programie jako stałą: const double PI = 3.14159265358979;',
            ],
            input_format: ['W jedynym wierszu jedna liczba całkowita r.'],
            output_format: ['W pierwszym wierszu wypisz pole, a w drugim obwód — oba z dwiema cyframi po kropce.'],
            constraints: ['1 ≤ r ≤ 1000'],
            examples: [{ input: '1' }, { input: '10' }],
            hint: 'Stała to zmienna z słowem const na początku — jej wartości nie da się już zmienić. Pole to PI * r * r, a obwód to 2 * PI * r. Wypisz je po cout << fixed << setprecision(2);',
            tests: (r) => {
                const out = ['2', '3', '7', '100', '1000'];
                while (out.length < 11) {
                    const x = r.int(1, 1000);
                    if (safe(PI * x * x, 2) && safe(2 * PI * x, 2)) out.push(String(x));
                }
                return out;
            },
            solve: (inp) => { const r = reader(inp).int(); return join(fx(PI * r * r, 2), fx(2 * PI * r, 2)); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    const double PI = 3.14159265358979;
    int r;
    cin >> r;
    cout << fixed << setprecision(2);
    cout << PI * r * r << "\n";
    cout << 2 * PI * r << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-bilety', krok: 9, level: 'latwe',
            title: 'Bilety do kina',
            short: 'Ceny biletów zapisz jako stałe i policz koszt zakupów.',
            tags: ['const', 'int'],
            statement: [
                'W kinie „Bajtokino” bilet normalny kosztuje 28 zł, a ulgowy 19 zł. Wczytaj liczbę biletów normalnych n i ulgowych u i wypisz, ile trzeba zapłacić za wszystkie.',
                'Ceny zapisz w programie jako stałe: const int NORMALNY = 28; i const int ULGOWY = 19;. Gdy kino zmieni cennik, poprawisz program w jednym miejscu.',
            ],
            input_format: ['W jedynym wierszu dwie liczby całkowite n i u.'],
            output_format: ['Wypisz jedną liczbę — łączny koszt biletów w złotych.'],
            constraints: ['0 ≤ n, u ≤ 10 000'],
            examples: [{ input: '2 3', note: '2 · 28 + 3 · 19 = 56 + 57 = 113.' }],
            hint: 'Koszt to n * NORMALNY + u * ULGOWY. Stałe piszemy zwyczajowo WIELKIMI literami, żeby od razu było widać, że to stałe, a nie zwykłe zmienne.',
            tests: (r) => ['0 0', '1 0', '0 1', '10000 10000', '4 0', `${r.int(0, 10000)} ${r.int(0, 10000)}`, `${r.int(0, 100)} ${r.int(0, 100)}`, `${r.int(0, 10000)} ${r.int(0, 10000)}`],
            solve: (inp) => { const [n, u] = nums(inp); return String(n * 28 + u * 19); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    const int NORMALNY = 28;
    const int ULGOWY = 19;
    int n, u;
    cin >> n >> u;
    cout << n * NORMALNY + u * ULGOWY << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 10 · zakresy i long long
        {
            id: 'tz-duzy-iloczyn', krok: 10, level: 'latwe',
            title: 'Duży iloczyn',
            short: 'Pomnóż dwie liczby do miliarda. Czy int to udźwignie?',
            tags: ['long long', 'przepełnienie'],
            statement: [
                'Wczytaj dwie liczby całkowite a i b i wypisz ich iloczyn.',
                'Liczby mogą sięgać miliarda, więc iloczyn może mieć nawet 19 cyfr. Czy int to udźwignie?',
            ],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Wypisz jedną liczbę — a · b.'],
            constraints: ['1 ≤ a, b ≤ 10⁹'],
            examples: [
                { input: '3 4' },
                { input: '100000 100000', note: 'Wynik 10 000 000 000 jest prawie pięć razy większy od największego int-a (2 147 483 647).' },
            ],
            hint: 'Wczytaj a i b od razu do zmiennych typu long long. Wtedy a * b liczy się na long long i nie przepełni się: 10⁹ · 10⁹ = 10¹⁸, a limit long long to około 9,2 · 10¹⁸.',
            tests: (r) => ['1 1', '1000000000 1000000000', '46341 46341', '65536 65536', '2147483 1000', `${r.int(1, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1, 1e9)} ${r.int(1, 1e9)}`, `${r.int(1, 1e5)} ${r.int(1, 1e5)}`],
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
        {
            id: 'tz-sekundy-zycia', krok: 10, level: 'latwe',
            title: 'Ile sekund żyjesz?',
            short: 'Zamień lata na sekundy. Już dla 100 lat int nie wystarcza.',
            tags: ['long long', '1LL'],
            statement: ['Wczytaj wiek w latach i wypisz, ile to sekund. Przyjmij, że każdy rok ma 365 dni, doba ma 24 godziny, godzina 60 minut, a minuta 60 sekund.'],
            input_format: ['W jedynym wierszu jedna liczba całkowita — wiek w latach.'],
            output_format: ['Wypisz jedną liczbę — liczbę sekund.'],
            constraints: ['0 ≤ lata ≤ 150'],
            examples: [{ input: '1' }, { input: '100', note: 'Już dla 100 lat wynik przekracza zakres int.' }],
            hint: 'Rok to 365 · 24 · 60 · 60 = 31 536 000 sekund, więc dla 150 lat wynik ma 10 cyfr. Wczytaj lata do zmiennej long long — albo, jeśli lata są int-em, napisz 1LL * lata * 365 * 24 * 60 * 60, żeby mnożenie od początku szło na long long.',
            tests: (r) => ['0', '13', '68', '69', '150', r.int(0, 150), r.int(0, 150)],
            solve: (inp) => String(reader(inp).int() * 31536000),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long lata;
    cin >> lata;
    cout << lata * 365 * 24 * 60 * 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-suma-gaussa', krok: 10, level: 'srednie',
            title: 'Suma od 1 do n',
            short: 'Wzór małego Gaussa: n · (n + 1) / 2 — dla n do miliarda.',
            tags: ['long long', 'wzór'],
            statement: [
                'Mały Gauss miał podobno w szkole dodać wszystkie liczby od 1 do 100 — i zrobił to w kilka sekund, bo zauważył wzór: 1 + 2 + … + n = n · (n + 1) / 2. Wczytaj n i wypisz sumę 1 + 2 + … + n.',
                'Pętle poznasz za kilka lekcji — tutaj nie są potrzebne. Wystarczy wzór, ale uważaj na zakres: n może sięgać miliarda.',
            ],
            input_format: ['W jedynym wierszu jedna liczba całkowita n.'],
            output_format: ['Wypisz sumę liczb od 1 do n.'],
            constraints: ['1 ≤ n ≤ 10⁹'],
            examples: [{ input: '100' }, { input: '1000000000' }],
            hint: 'Dla n = 10⁹ iloczyn n · (n + 1) to około 10¹⁸ — przepełni int, ale zmieści się w long long. Wczytaj n do long long i policz n * (n + 1) / 2. Kolejność jest ważna: najpierw mnożenie, potem dzielenie — iloczyn dwóch kolejnych liczb jest zawsze parzysty, więc dzielenie przez 2 wychodzi dokładnie.',
            tests: (r) => ['1', '2', '10', '65535', '65536', '999999999', `${r.int(1, 1e9)}`, `${r.int(1, 1e9)}`, `${r.int(1, 1e5)}`],
            solve: (inp) => { const n = BigInt(toks(inp)[0]); return String(n * (n + 1n) / 2n); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    long long n;
    cin >> n;
    cout << n * (n + 1) / 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-czy-sie-zmiesci', krok: 10, level: 'trudne',
            title: 'Czy suma zmieści się w int?',
            short: 'Sprawdź przepełnienie, zanim do niego dojdzie: policz na long long.',
            tags: ['long long', 'INT_MAX', 'bool'],
            statement: [
                'Wczytaj dwie liczby, z których każda mieści się w typie int. Wypisz 1, jeśli ich suma też mieści się w int (czyli leży między −2 147 483 648 a 2 147 483 647), albo 0, jeśli nie.',
                'Nie wolno dodać ich na int-ach i potem sprawdzać — po przepełnieniu wynik jest już zepsuty i nic z niego nie wyczytasz.',
            ],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Wypisz 1 albo 0.'],
            constraints: ['−2 147 483 648 ≤ a, b ≤ 2 147 483 647'],
            examples: [
                { input: '2000000000 147483647', note: 'Suma to dokładnie 2 147 483 647 — największy int. Jeszcze się mieści.' },
                { input: '2000000000 147483648' },
                { input: '-2147483648 -1' },
            ],
            hint: 'Policz sumę na szerszym typie: long long suma = (long long)a + b;. Potem porównaj ją z granicami int-a — są gotowe w nagłówku <climits> jako INT_MAX i INT_MIN: cout << (suma >= INT_MIN && suma <= INT_MAX);',
            tests: (r) => ['0 0', '2147483647 0', '2147483647 1', '-2147483648 0', '-2147483648 2147483647', '-2147483648 -2147483648', '2147483647 2147483647', '-1000000000 -1147483648', '-1000000000 -1147483649',
                ...Array.from({ length: 4 }, () => `${r.int(-2147483648, 2147483647)} ${r.int(-2147483648, 2147483647)}`)],
            solve: (inp) => { const [a, b] = toks(inp).map(BigInt); const s = a + b; return s >= INT_MIN && s <= INT_MAX ? '1' : '0'; },
            cpp: R`
#include <iostream>
#include <climits>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    long long suma = (long long)a + b;
    cout << (suma >= INT_MIN && suma <= INT_MAX) << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 11 · konwersje
        {
            id: 'tz-srednia-ocen', krok: 11, level: 'latwe',
            title: 'Średnia ocen',
            short: 'Trzy oceny to int-y, a średnia — nie. Nie zgub ułamka przy dzieleniu.',
            tags: ['(double)', 'setprecision'],
            statement: [
                'Wczytaj trzy oceny (liczby całkowite od 1 do 6) i wypisz ich średnią z dokładnością do dwóch miejsc po przecinku.',
                'Oceny są int-ami, a średnia zwykle nie jest liczbą całkowitą — trzeba zadbać o to, żeby dzielenie nie zgubiło ułamka.',
            ],
            input_format: ['W jedynym wierszu trzy liczby całkowite — oceny.'],
            output_format: ['Wypisz średnią z dokładnie dwiema cyframi po kropce.'],
            constraints: ['każda ocena jest liczbą od 1 do 6'],
            examples: [{ input: '5 4 4' }, { input: '6 6 6' }],
            hint: '(a + b + c) / 3 na samych int-ach daje 4 zamiast 4.33. Zamień sumę na double przed dzieleniem: (double)(a + b + c) / 3 — albo dziel przez 3.0.',
            tests: (r) => ['1 1 1', '1 1 2', '6 5 5', '2 3 5', '1 6 6', ...Array.from({ length: 5 }, () => `${r.int(1, 6)} ${r.int(1, 6)} ${r.int(1, 6)}`)],
            solve: (inp) => { const [a, b, c] = nums(inp); return fx((a + b + c) / 3, 2); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << fixed << setprecision(2) << (double)(a + b + c) / 3 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-czesci-liczby', krok: 11, level: 'srednie',
            title: 'Część całkowita i ułamkowa',
            short: 'Rozbij liczbę z przecinkiem na część całkowitą i ułamkową — rzutowanie (int).',
            tags: ['(int)', 'double'],
            statement: [
                'Wczytaj dodatnią liczbę rzeczywistą x (z dwiema cyframi po kropce) i wypisz w pierwszym wierszu jej część całkowitą, a w drugim część ułamkową z dokładnością do dwóch miejsc po przecinku.',
                'Na przykład dla 7.25 częścią całkowitą jest 7, a ułamkową 0.25.',
            ],
            input_format: ['W jedynym wierszu jedna liczba rzeczywista x.'],
            output_format: ['W pierwszym wierszu wypisz część całkowitą (liczbę całkowitą), a w drugim część ułamkową z dwiema cyframi po kropce.'],
            constraints: ['0 < x < 1 000 000', 'x ma dokładnie dwie cyfry po kropce'],
            examples: [{ input: '7.25' }, { input: '0.50' }],
            hint: 'Rzutowanie (int)x obcina wszystko po kropce — to właśnie część całkowita. Część ułamkowa to x - (int)x. Wypisz ją z setprecision(2): double potrafi trzymać 0.25 jako 0.2499999…, a zaokrąglenie to naprawi.',
            tests: (r) => ['1.00', '0.01', '0.99', '999999.99', '123.45', ...Array.from({ length: 5 }, () => dec(r.int(1, 99999999), 2))],
            solve: (inp) => { const x = Number(toks(inp)[0]); const c = Math.trunc(x); return join(c, fx(x - c, 2)); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double x;
    cin >> x;
    int calk = (int)x;
    cout << calk << "\n";
    cout << fixed << setprecision(2) << x - calk << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-procent', krok: 11, level: 'srednie',
            title: 'Wynik testu w procentach',
            short: 'a z b pytań — ile to procent? Pułapka: a / b na int-ach to zwykle 0.',
            tags: ['100.0 * a / b', 'setprecision'],
            statement: [
                'Na teście było b pytań, a Bajtek odpowiedział dobrze na a z nich. Jaki to procent? Wypisz wynik z dokładnością do jednego miejsca po przecinku.',
                'Wzór: a / b · 100. Pamiętaj, że a i b są liczbami całkowitymi.',
            ],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Wypisz wynik w procentach z dokładnie jedną cyfrą po kropce (bez znaku %).'],
            constraints: ['1 ≤ b ≤ 1000', '0 ≤ a ≤ b', 'testy dobrano tak, żeby zaokrąglenie było zawsze jednoznaczne'],
            examples: [{ input: '17 20' }, { input: '1 3' }],
            hint: 'a / b na int-ach daje 0 (dla a < b) — i cały wynik to 0. Zacznij od liczby z przecinkiem: 100.0 * a / b. Wtedy całe działanie liczy się na double.',
            tests: (r) => {
                const out = ['0 1', '1 1', '5 5', '0 1000', '999 1000', '2 3'];
                while (out.length < 12) {
                    const b = r.int(1, 1000), a = r.int(0, b);
                    if (safe(100 * a / b, 1) && safe(a / b * 100, 1)) out.push(`${a} ${b}`);
                }
                return out;
            },
            solve: (inp) => { const [a, b] = nums(inp); return fx(100 * a / b, 1); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << fixed << setprecision(1) << 100.0 * a / b << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-ile-cyfr', krok: 11, level: 'srednie',
            title: 'Ile cyfr ma liczba?',
            short: 'Zamień liczbę na napis (to_string) i zapytaj go o długość.',
            tags: ['to_string', 'long long', '.length()'],
            statement: [
                'Wczytaj nieujemną liczbę całkowitą n i wypisz, ile ma cyfr.',
                'Pętli jeszcze nie znamy, ale jest sprytny sposób: zamień liczbę na napis i zapytaj napis o jego długość.',
            ],
            input_format: ['W jedynym wierszu jedna liczba całkowita n.'],
            output_format: ['Wypisz liczbę cyfr liczby n.'],
            constraints: ['0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '2026' }, { input: '0', note: 'Zero ma jedną cyfrę.' }],
            hint: 'to_string(n) zamienia liczbę na napis, np. to_string(2026) to "2026". Długość tego napisu to właśnie liczba cyfr: cout << to_string(n).length();. Liczba może mieć aż 19 cyfr — wczytaj ją do long long.',
            tests: (r) => ['9', '10', '99', '100', '2147483647', '2147483648', '999999999999999999', '1000000000000000000', String(r.big(0, 10n ** 18n)), String(r.big(0, 10n ** 9n)), String(r.int(0, 1000))],
            solve: (inp) => String(BigInt(toks(inp)[0]).toString().length),
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    long long n;
    cin >> n;
    cout << to_string(n).length() << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-sklej-liczby', krok: 11, level: 'trudne',
            title: 'Sklej liczby',
            short: 'Z 12 i 345 zrób liczbę 12345 — i dodaj do niej 1.',
            tags: ['to_string', 'stoll', 'string'],
            statement: [
                'Wczytaj dwie dodatnie liczby całkowite a i b. Zapisz je obok siebie — najpierw a, potem b — tak, żeby powstała nowa liczba (na przykład z 12 i 345 powstaje 12345). Wypisz w pierwszym wierszu tę liczbę, a w drugim liczbę o 1 większą.',
                'Drugi wiersz pokazuje, że naprawdę masz liczbę, z którą można liczyć, a nie tylko napis.',
            ],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['W pierwszym wierszu wypisz sklejoną liczbę, a w drugim liczbę o 1 większą.'],
            constraints: ['1 ≤ a, b ≤ 10⁸'],
            examples: [{ input: '12 345' }, { input: '99 99', note: '9999 + 1 = 10 000 — pojawia się nowa cyfra.' }],
            hint: 'Zamień obie liczby na napisy i sklej je: string s = to_string(a) + to_string(b);. Napis z powrotem na liczbę zamienia funkcja stoll(s) (string → long long). Wynik może mieć 18 cyfr, więc nie używaj int-a ani stoi.',
            tests: (r) => ['1 1', '9 9', '100000000 100000000', '99999999 99999999', '10 1', `${r.int(1, 1e8)} ${r.int(1, 1e8)}`, `${r.int(1, 1e8)} ${r.int(1, 1e8)}`, `${r.int(1, 999)} ${r.int(1, 1e8)}`],
            solve: (inp) => { const [a, b] = toks(inp); const x = BigInt(a + b); return join(x, x + 1n); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    long long a, b;
    cin >> a >> b;
    long long x = stoll(to_string(a) + to_string(b));
    cout << x << "\n";
    cout << x + 1 << "\n";
    return 0;
}`,
        },
    ];
};
