// Typy zmiennych — ćwiczenia w trakcie lekcji, części 1–6: cout, zmienne, cin, int, double, char.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki (zadania.html).
module.exports = (h) => {
    const { reader, nums, join, fx, safe, dec } = h;
    const R = String.raw;
    const BEZ_WEJSCIA = ['Program nie wczytuje żadnych danych — wejście jest puste.'];
    const MALE = 'abcdefghijklmnopqrstuvwxyz';

    return [
        // ================================================================ KROK 1 · cout
        {
            id: 'tz-witaj', krok: 1, level: 'latwe',
            title: 'Witaj, świecie!',
            short: 'Twój pierwszy program ze sprawdzarką: wypisz jedno zdanie, znak w znak.',
            tags: ['cout', 'szkielet programu'],
            statement: [
                'To Twoje pierwsze zadanie ze sprawdzarką. Napisz program, który wypisuje dokładnie jeden wiersz: Witaj, swiecie!',
                'Sprawdzarka porównuje Twój wynik z oczekiwanym znak po znaku: wielka litera W, przecinek, spacja i wykrzyknik na końcu — wszystko musi się zgadzać. Celowo piszemy bez polskich liter („swiecie”, a nie „świecie”), bo polskie znaki potrafią się rozsypać w konsoli Windows.',
            ],
            input_format: BEZ_WEJSCIA,
            output_format: ['Wypisz jeden wiersz: Witaj, swiecie!'],
            constraints: [],
            examples: [{ input: '', note: 'Wejście jest puste — program niczego nie wczytuje, tylko wypisuje tekst.' }],
            hint: R`Weź szkielet programu z lekcji (#include <iostream>, using namespace std;, int main() { … return 0; }) i w środku main wpisz jedną linijkę: cout << "Witaj, swiecie!"; Tekst musi być w cudzysłowie, a instrukcja kończy się średnikiem.`,
            tests: () => [''],
            solve: () => 'Witaj, swiecie!',
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    cout << "Witaj, swiecie!\n";
    return 0;
}`,
        },
        {
            id: 'tz-trzy-wiersze', krok: 1, level: 'latwe',
            title: 'Trzy wiersze',
            short: R`Wypisz wierszyk w trzech linijkach — poćwicz przechodzenie do nowej linii.`,
            tags: ['cout', R`"\n"`],
            statement: [
                'Wypisz poniższy wierszyk dokładnie w trzech wierszach, tak jak w przykładzie:',
                'Ucze sie C++ / krok po kroku / az do finalu!',
                R`Po każdym wierszu trzeba przejść do nowej linii — wypisując "\n" (backslash i literka n) albo endl. Bez tego wszystkie słowa skleją się w jeden długi wiersz i sprawdzarka zgłosi „Wrong answer”.`,
            ],
            input_format: BEZ_WEJSCIA,
            output_format: ['Wypisz trzy wiersze wierszyka — każdy w osobnej linii, bez ukośników.'],
            constraints: [],
            examples: [{ input: '' }],
            hint: R`Najprościej napisać trzy instrukcje cout, każdą zakończoną "\n": cout << "Ucze sie C++\n"; i tak samo dwie kolejne. Możesz też jedną instrukcją: cout << "Ucze sie C++" << "\n" << "krok po kroku" << "\n" << "az do finalu!" << "\n";`,
            tests: () => [''],
            solve: () => join('Ucze sie C++', 'krok po kroku', 'az do finalu!'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    cout << "Ucze sie C++\n";
    cout << "krok po kroku\n";
    cout << "az do finalu!\n";
    return 0;
}`,
        },
        {
            id: 'tz-komputer-liczy', krok: 1, level: 'latwe',
            title: 'Komputer liczy za Ciebie',
            short: 'Wypisz wyniki trzech działań — niech policzy je program, nie Ty.',
            tags: ['cout', 'działania'],
            statement: [
                'Komputer to świetny kalkulator. Napisz program, który wypisuje wyniki trzech działań — każdy w osobnym wierszu: 1234 + 5678, potem 2026 − 1410, a na końcu 125 · 8.',
                R`Nie licz niczego sam — niech zrobi to program. Gdy napiszesz cout << 2 + 3; (bez cudzysłowu), komputer policzy działanie i wypisze 5. Gdy napiszesz cout << "2 + 3"; (w cudzysłowie), wypisze po prostu napis 2 + 3.`,
            ],
            input_format: BEZ_WEJSCIA,
            output_format: ['Wypisz trzy wiersze — w każdym jedną liczbę, wynik kolejnego działania.'],
            constraints: [],
            examples: [{ input: '' }],
            hint: R`Działanie wpisz bez cudzysłowu: cout << 1234 + 5678 << "\n";. Mnożenie zapisuje się w C++ gwiazdką: 125 * 8.`,
            tests: () => [''],
            solve: () => join(1234 + 5678, 2026 - 1410, 125 * 8),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    cout << 1234 + 5678 << "\n";
    cout << 2026 - 1410 << "\n";
    cout << 125 * 8 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-buzka', krok: 1, level: 'srednie',
            title: 'Buźka z ramką',
            short: R`Narysuj buźkę ze znaków. W jednym wierszu jest backslash — jak go wypisać?`,
            tags: ['cout', 'znaki specjalne'],
            statement: [
                'Narysuj w konsoli buźkę z przykładu — pięć wierszy znaków. Spacje też się liczą: sprawdzarka porównuje każdy wiersz znak po znaku (pomija tylko spacje na samym końcu wiersza).',
                R`Uwaga na znak \ (backslash) w czwartym wierszu. Wewnątrz cudzysłowu backslash ma w C++ specjalne znaczenie — to z niego powstaje "\n". Żeby wypisać jeden backslash, w kodzie trzeba napisać dwa: "\\". Podobnie cudzysłów wypisujesz jako \".`,
            ],
            input_format: BEZ_WEJSCIA,
            output_format: ['Wypisz pięć wierszy rysunku dokładnie tak, jak w przykładzie.'],
            constraints: [],
            examples: [{ input: '' }],
            hint: R`Każdy wiersz rysunku to osobne cout << "…\n";. Czwarty wiersz w kodzie wygląda tak: cout << "| \\___/ |\n"; — dwa backslashe w kodzie dają jeden na ekranie.`,
            tests: () => [''],
            solve: () => join('+-------+', '| o   o |', '|   ^   |', R`| \___/ |`, '+-------+'),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    cout << "+-------+\n";
    cout << "| o   o |\n";
    cout << "|   ^   |\n";
    cout << "| \\___/ |\n";
    cout << "+-------+\n";
    return 0;
}`,
        },

        // ================================================================ KROK 2 · zmienne
        {
            id: 'tz-punkty', krok: 2, level: 'latwe',
            title: 'Punkty w grze',
            short: 'Jedna zmienna, trzy wartości — zmieniaj ją krok po kroku i wypisuj.',
            tags: ['zmienna', 'int', 'przypisanie ='],
            statement: [
                'Gracz zaczyna grę z 10 punktami. Napisz program, który: (1) tworzy zmienną int punkty z wartością 10 i ją wypisuje, (2) dodaje do niej 5 punktów — punkty = punkty + 5; — i znowu ją wypisuje, (3) podwaja wynik — punkty = punkty * 2; — i wypisuje ją po raz trzeci.',
                'Każdą wartość wypisz w osobnym wierszu. Nie wpisuj gotowych liczb 15 i 30 — niech program sam je policzy, zmieniając wartość jednej zmiennej. Właśnie do tego służą zmienne.',
            ],
            input_format: BEZ_WEJSCIA,
            output_format: ['Wypisz trzy wiersze: wartość zmiennej punkty po każdym z trzech kroków.'],
            constraints: [],
            examples: [{ input: '', note: 'Na początku 10, po dodaniu 5 punktów 15, po podwojeniu 30.' }],
            hint: R`Zapis punkty = punkty + 5 to nie równanie z matematyki. Komputer najpierw liczy prawą stronę (stara wartość + 5), a potem wkłada wynik z powrotem do pudełka punkty. Po każdej zmianie wypisz: cout << punkty << "\n";`,
            tests: () => [''],
            solve: () => { let p = 10; const o = [p]; p = p + 5; o.push(p); p = p * 2; o.push(p); return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int punkty = 10;
    cout << punkty << "\n";
    punkty = punkty + 5;
    cout << punkty << "\n";
    punkty = punkty * 2;
    cout << punkty << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-zmienne-zamiast-liczb', krok: 2, level: 'latwe',
            title: 'Zmienne zamiast liczb',
            short: 'Policz sumę, różnicę i iloczyn, używając w cout nazw zmiennych.',
            tags: ['zmienna', 'int', 'działania'],
            statement: [
                'Utwórz dwie zmienne: int a = 12; oraz int b = 5;. Następnie wypisz w trzech wierszach: a + b, a − b oraz a · b.',
                'W instrukcjach cout używaj nazw zmiennych, a nie liczb 12 i 5. Gdy potem zmienisz wartości w pierwszych dwóch linijkach, program sam policzy nowe wyniki — sprawdź to u siebie!',
            ],
            input_format: BEZ_WEJSCIA,
            output_format: ['Wypisz trzy wiersze: a + b, a − b i a · b.'],
            constraints: [],
            examples: [{ input: '' }],
            hint: R`cout << a + b << "\n"; — bez cudzysłowu wokół a + b, bo chcesz wynik działania, a nie napis „a + b”. Mnożenie to gwiazdka: a * b.`,
            tests: () => [''],
            solve: () => join(12 + 5, 12 - 5, 12 * 5),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a = 12;
    int b = 5;
    cout << a + b << "\n";
    cout << a - b << "\n";
    cout << a * b << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 3 · cin
        {
            id: 'tz-echo', krok: 3, level: 'latwe',
            title: 'Echo',
            short: 'Wczytaj liczbę i wypisz ją z powrotem. Najprostszy program z danymi.',
            tags: ['cin', 'cout', 'int'],
            statement: [
                'Wczytaj jedną liczbę całkowitą i wypisz ją z powrotem — dokładnie taką, jaką dostałeś.',
                'To najprostszy program, który coś wczytuje. Nie wypisuj żadnych zaproszeń w stylu „Podaj liczbę:” — dane podaje sprawdzarka, a na wyjściu oczekuje tylko samej liczby.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz liczbę n.'],
            constraints: ['−10⁹ ≤ n ≤ 10⁹'],
            examples: [
                { input: '42' },
                { input: '-7', note: 'Liczby ujemne wczytuje się dokładnie tak samo jak dodatnie.' },
            ],
            hint: R`Utwórz zmienną int n;, wczytaj ją instrukcją cin >> n; i wypisz: cout << n << "\n";. Strzałki >> pokazują, że wartość płynie z wejścia DO zmiennej.`,
            tests: (r) => ['0', '1', '-1', '2026', '1000000000', '-1000000000', r.int(-1e9, 1e9), r.int(-1e9, 1e9), r.int(1, 999)],
            solve: (inp) => String(reader(inp).int()),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-zamiana-miejscami', krok: 3, level: 'latwe',
            title: 'Zamiana miejscami',
            short: 'Zamień zawartość dwóch zmiennych. Przyda się trzecie, pomocnicze pudełko.',
            tags: ['cin', 'zmienna pomocnicza'],
            statement: [
                'Wczytaj dwie liczby całkowite do zmiennych a i b. Zamień zawartość tych zmiennych miejscami — tak, żeby w a znalazła się druga liczba, a w b pierwsza — a potem wypisz a i b w jednym wierszu, oddzielone spacją.',
                'Spróbuj zrobić to naprawdę, na zmiennych, a nie tylko wypisując je w odwrotnej kolejności. Pomyśl o dwóch szklankach z sokiem i z wodą: żeby zamienić ich zawartość, potrzebujesz trzeciej, pustej szklanki.',
            ],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Wypisz a i b po zamianie, oddzielone spacją.'],
            constraints: ['−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '3 8', note: 'Na początku a = 3 i b = 8. Po zamianie a = 8 i b = 3.' }],
            hint: R`Zapis a = b; b = a; nie zadziała: po pierwszej linijce stara wartość a przepada na zawsze. Najpierw odłóż ją na bok: int pom = a; a = b; b = pom; — dopiero teraz wypisz a i b.`,
            tests: (r) => ['1 2', '0 0', '-5 5', '7 7', '1000000000 -1000000000',
                ...Array.from({ length: 4 }, () => `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`)],
            solve: (inp) => { const [a, b] = nums(inp); return `${b} ${a}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int pom = a;
    a = b;
    b = pom;
    cout << a << " " << b << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-sasiedzi', krok: 3, level: 'latwe',
            title: 'Sąsiedzi liczby',
            short: 'Wypisz liczbę razem z jej poprzednikiem i następnikiem.',
            tags: ['cin', 'cout', 'działania'],
            statement: ['Wczytaj liczbę całkowitą n i wypisz w jednym wierszu trzy liczby: n − 1, n oraz n + 1, oddzielone spacjami.'],
            input_format: ['W jedynym wierszu jedna liczba całkowita n.'],
            output_format: ['Wypisz w jednym wierszu liczby n − 1, n, n + 1 oddzielone spacjami.'],
            constraints: ['−10⁹ ≤ n ≤ 10⁹'],
            examples: [{ input: '7' }, { input: '0', note: 'Poprzednikiem zera jest −1.' }],
            hint: R`cout umie liczyć w trakcie wypisywania: cout << n - 1 << " " << n << " " << n + 1 << "\n";. Spacje między liczbami trzeba wypisać samemu — to te " " w cudzysłowie.`,
            tests: (r) => ['1', '-1', '100', '1000000000', '-1000000000', r.int(-1e9, 1e9), r.int(-1e9, 1e9), r.int(-100, 100)],
            solve: (inp) => { const n = reader(inp).int(); return `${n - 1} ${n} ${n + 1}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n - 1 << " " << n << " " << n + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-za-rok', krok: 3, level: 'latwe',
            title: 'Za rok i za dziesięć lat',
            short: 'Połącz w jednym cout tekst i wynik działania na zmiennej.',
            tags: ['cin', 'tekst + liczba'],
            statement: [
                'Wczytaj wiek Bajtka (w latach) i wypisz dwa wiersze: „Za rok: X” oraz „Za 10 lat: Y”, gdzie X i Y to jego wiek za rok i za dziesięć lat.',
                'To ćwiczenie z łączenia tekstu i liczb w jednym cout: tekst piszesz w cudzysłowie, a zmienną albo działanie — bez cudzysłowu.',
            ],
            input_format: ['W jedynym wierszu jedna liczba całkowita — wiek Bajtka.'],
            output_format: ['Wypisz dwa wiersze: Za rok: X oraz Za 10 lat: Y.'],
            constraints: ['0 ≤ wiek ≤ 150'],
            examples: [{ input: '13' }],
            hint: R`cout << "Za rok: " << wiek + 1 << "\n"; — spacja po dwukropku jest w cudzysłowie, więc zostanie wypisana. Drugi wiersz zrób tak samo, z wiek + 10.`,
            tests: (r) => ['0', '1', '9', '17', '99', '150', r.int(2, 140), r.int(2, 140)],
            solve: (inp) => { const w = reader(inp).int(); return join(`Za rok: ${w + 1}`, `Za 10 lat: ${w + 10}`); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int wiek;
    cin >> wiek;
    cout << "Za rok: " << wiek + 1 << "\n";
    cout << "Za 10 lat: " << wiek + 10 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-trzy-pudelka', krok: 3, level: 'srednie',
            title: 'Trzy pudełka',
            short: 'Wykonaj cztery przypisania po kolei i wypisz, co zostało w pudełkach.',
            tags: ['zmienna', 'śledzenie programu'],
            statement: [
                'Wczytaj dwie liczby całkowite do zmiennych a i b, a potem wykonaj dokładnie te kroki, w tej kolejności: int c = a + b;   a = c * 2;   b = b - a;   c = c + b;',
                'Na koniec wypisz w jednym wierszu wartości a, b i c, oddzielone spacjami.',
                'Zanim wyślesz rozwiązanie, prześledź przykład na kartce: zapisz w tabelce, co jest w każdym pudełku po każdym kroku. Potem porównaj z tym, co wypisze komputer.',
            ],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Wypisz w jednym wierszu końcowe wartości a, b i c, oddzielone spacjami.'],
            constraints: ['−1000 ≤ a, b ≤ 1000'],
            examples: [{ input: '4 7', note: 'a = 4, b = 7 → c = 11 → a = 22 → b = 7 − 22 = −15 → c = 11 + (−15) = −4.' }],
            hint: 'Zmienna pamięta tylko swoją ostatnią wartość. W kroku b = b - a używasz już NOWEJ wartości a (tej z kroku a = c * 2), a nie tej wczytanej. Komputer robi dokładnie to samo co Ty na kartce — linijka po linijce, z góry na dół.',
            tests: (r) => ['0 0', '1 1', '-3 3', '1000 1000', '-1000 -1000', '5 -2',
                ...Array.from({ length: 4 }, () => `${r.int(-1000, 1000)} ${r.int(-1000, 1000)}`)],
            solve: (inp) => { let [a, b] = nums(inp); let c = a + b; a = c * 2; b = b - a; c = c + b; return `${a} ${b} ${c}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    int c = a + b;
    a = c * 2;
    b = b - a;
    c = c + b;
    cout << a << " " << b << " " << c << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 4 · int
        {
            id: 'tz-kalkulator', krok: 4, level: 'latwe',
            title: 'Kalkulator',
            short: 'Suma, różnica i iloczyn dwóch wczytanych liczb.',
            tags: ['int', '+ − *'],
            statement: ['Wczytaj dwie liczby całkowite a i b i wypisz — każdy wynik w osobnym wierszu — ich sumę, różnicę (a − b) i iloczyn.'],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b.'],
            output_format: ['Wypisz trzy wiersze: a + b, a − b oraz a · b.'],
            constraints: ['−10 000 ≤ a, b ≤ 10 000'],
            examples: [{ input: '7 3' }, { input: '-2 5' }],
            hint: R`Wynik działania możesz wypisać od razu, bez dodatkowej zmiennej: cout << a + b << "\n";. Mnożenie to gwiazdka *.`,
            tests: (r) => ['0 0', '1 -1', '10000 10000', '-10000 10000', '-10000 -10000',
                ...Array.from({ length: 5 }, () => `${r.int(-10000, 10000)} ${r.int(-10000, 10000)}`)],
            solve: (inp) => { const [a, b] = nums(inp); return join(a + b, a - b, a * b); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << a + b << "\n";
    cout << a - b << "\n";
    cout << a * b << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-cukierki', krok: 4, level: 'latwe',
            title: 'Cukierki dla klasy',
            short: 'Podziel cukierki po równo: ile dostaje każdy, a ile zostaje?',
            tags: ['int', '/', '%'],
            statement: ['Pani wychowawczyni ma n cukierków i chce rozdać je po równo k uczniom — każdy ma dostać tyle samo, a cukierków nie wolno dzielić na kawałki. Ile cukierków dostanie każdy uczeń i ile zostanie dla pani?'],
            input_format: ['W jedynym wierszu dwie liczby całkowite n i k.'],
            output_format: ['W pierwszym wierszu wypisz, ile cukierków dostanie każdy uczeń, a w drugim — ile cukierków zostanie.'],
            constraints: ['0 ≤ n ≤ 10⁹', '1 ≤ k ≤ 10⁹'],
            examples: [
                { input: '17 5', note: '17 = 5 · 3 + 2: każdy uczeń dostaje 3 cukierki, a 2 zostają.' },
                { input: '3 10', note: 'Cukierków jest mniej niż uczniów — nikt nic nie dostaje, wszystkie 3 zostają.' },
            ],
            hint: 'Dzielenie dwóch int-ów (n / k) od razu daje część całkowitą — dokładnie tyle, ile dostaje każdy uczeń. Resztę z dzielenia daje operator % (n % k).',
            tests: (r) => ['0 1', '10 10', '20 5', '1000000000 1', '1000000000 1000000000', '999999999 1000000000',
                ...Array.from({ length: 4 }, () => `${r.int(0, 1e9)} ${r.int(1, 1000)}`)],
            solve: (inp) => { const [n, k] = nums(inp); return join(Math.floor(n / k), n % k); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    cout << n / k << "\n";
    cout << n % k << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-ogrodek', krok: 4, level: 'latwe',
            title: 'Płot wokół ogródka',
            short: 'Obwód i pole prostokąta o wczytanych bokach.',
            tags: ['int', 'wzory'],
            statement: ['Ogródek Bajtka jest prostokątem o bokach a i b metrów. Ile metrów płotu trzeba, żeby go ogrodzić (obwód), i ile metrów kwadratowych ma ogródek (pole)?'],
            input_format: ['W jedynym wierszu dwie liczby całkowite a i b — długości boków.'],
            output_format: ['W pierwszym wierszu wypisz obwód, a w drugim pole.'],
            constraints: ['1 ≤ a, b ≤ 10 000'],
            examples: [{ input: '3 5' }],
            hint: 'Obwód prostokąta to 2 · a + 2 · b, a pole to a · b. W C++: 2 * a + 2 * b oraz a * b. Największe możliwe pole to 10 000 · 10 000 = 100 000 000 — mieści się w int.',
            tests: (r) => ['1 1', '1 10000', '10000 10000', '12 7', r.int(1, 10000) + ' ' + r.int(1, 10000), r.int(1, 10000) + ' ' + r.int(1, 10000), r.int(1, 100) + ' ' + r.int(1, 100)],
            solve: (inp) => { const [a, b] = nums(inp); return join(2 * a + 2 * b, a * b); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    cout << 2 * a + 2 * b << "\n";
    cout << a * b << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-kolejnosc-dzialan', krok: 4, level: 'latwe',
            title: 'Kolejność działań',
            short: 'a + b · c to nie to samo co (a + b) · c. Sprawdź, jak liczy komputer.',
            tags: ['int', 'kolejność działań', 'nawiasy'],
            statement: [
                'Wczytaj trzy liczby całkowite a, b, c i wypisz w dwóch wierszach wartości wyrażeń a + b · c oraz (a + b) · c.',
                'Komputer stosuje tę samą kolejność działań co matematyka: najpierw mnożenie i dzielenie, potem dodawanie i odejmowanie. Nawiasy zmieniają tę kolejność.',
            ],
            input_format: ['W jedynym wierszu trzy liczby całkowite a, b, c.'],
            output_format: ['W pierwszym wierszu wypisz a + b · c, a w drugim (a + b) · c.'],
            constraints: ['−1000 ≤ a, b, c ≤ 1000'],
            examples: [{ input: '2 3 4', note: '2 + 3 · 4 = 2 + 12 = 14, a (2 + 3) · 4 = 5 · 4 = 20.' }],
            hint: 'a + b * c zapisujesz w C++ tak samo jak w zeszycie — komputer sam najpierw policzy b * c. Żeby najpierw dodać, użyj nawiasów: (a + b) * c.',
            tests: (r) => ['0 0 0', '1 1 1', '-1 2 -3', '1000 1000 1000', '-1000 1000 -1000',
                ...Array.from({ length: 4 }, () => `${r.int(-1000, 1000)} ${r.int(-1000, 1000)} ${r.int(-1000, 1000)}`)],
            solve: (inp) => { const [a, b, c] = nums(inp); return join(a + b * c, (a + b) * c); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a, b, c;
    cin >> a >> b >> c;
    cout << a + b * c << "\n";
    cout << (a + b) * c << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-zegar', krok: 4, level: 'srednie',
            title: 'Sekundy na zegarze',
            short: 'Zamień liczbę sekund od północy na godziny, minuty i sekundy.',
            tags: ['int', '/', '%'],
            statement: [
                'Od północy minęło s sekund. Która jest godzina? Wypisz liczbę pełnych godzin, pełnych minut i sekund, które upłynęły od północy.',
                'Na przykład 3725 sekund to 1 godzina (3600 s), 2 minuty (120 s) i 5 sekund.',
            ],
            input_format: ['W jedynym wierszu jedna liczba całkowita s.'],
            output_format: ['Wypisz w jednym wierszu trzy liczby oddzielone spacjami: godziny, minuty (od 0 do 59) i sekundy (od 0 do 59).'],
            constraints: ['0 ≤ s < 86 400 (tyle sekund ma doba)'],
            examples: [{ input: '3725', note: '3725 / 3600 = 1 godzina. Zostaje 3725 % 3600 = 125 sekund, czyli 125 / 60 = 2 minuty i 125 % 60 = 5 sekund.' }],
            hint: 'Godziny to s / 3600. To, co zostaje po pełnych godzinach, to s % 3600 — z tego minuty to (s % 3600) / 60. Sekundy to po prostu s % 60.',
            tests: (r) => ['0', '59', '60', '61', '3599', '3600', '43200', '86399', r.int(0, 86399), r.int(0, 86399), r.int(0, 86399)],
            solve: (inp) => { const s = reader(inp).int(); return `${Math.floor(s / 3600)} ${Math.floor((s % 3600) / 60)} ${s % 60}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int s;
    cin >> s;
    cout << s / 3600 << " " << (s % 3600) / 60 << " " << s % 60 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-cyfry', krok: 4, level: 'srednie',
            title: 'Rozbieramy liczbę na cyfry',
            short: 'Ostatnia cyfra, cyfra dziesiątek i liczba bez ostatniej cyfry.',
            tags: ['int', '/ 10', '% 10'],
            statement: [
                'Wczytaj liczbę całkowitą n i wypisz trzy wiersze: ostatnią cyfrę liczby n, jej cyfrę dziesiątek (przedostatnią) oraz liczbę, która powstanie po skreśleniu ostatniej cyfry.',
                'Jeśli liczba jest jednocyfrowa, jej cyfra dziesiątek to 0, a po skreśleniu jedynej cyfry zostaje 0.',
            ],
            input_format: ['W jedynym wierszu jedna liczba całkowita n.'],
            output_format: ['Wypisz trzy wiersze: ostatnią cyfrę, cyfrę dziesiątek i liczbę bez ostatniej cyfry.'],
            constraints: ['0 ≤ n ≤ 10⁹'],
            examples: [{ input: '2026', note: 'Ostatnia cyfra: 2026 % 10 = 6. Po skreśleniu ostatniej cyfry: 2026 / 10 = 202. Cyfra dziesiątek to ostatnia cyfra liczby 202, czyli 2.' }],
            hint: 'Dzielenie przez 10 „obcina” ostatnią cyfrę, a reszta z dzielenia przez 10 to właśnie ta ostatnia cyfra. Cyfra dziesiątek: najpierw obetnij ostatnią cyfrę, potem weź ostatnią cyfrę tego, co zostało — n / 10 % 10.',
            tests: (r) => ['0', '7', '10', '99', '305', '1000000000', '123456789', r.int(0, 1e9), r.int(0, 1e9), r.int(10, 999)],
            solve: (inp) => { const n = reader(inp).int(); return join(n % 10, Math.floor(n / 10) % 10, Math.floor(n / 10)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << n % 10 << "\n";
    cout << n / 10 % 10 << "\n";
    cout << n / 10 << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 5 · double
        {
            id: 'tz-polowa', krok: 5, level: 'latwe',
            title: 'Połowa',
            short: 'Wypisz połowę liczby całkowitej z jedną cyfrą po kropce. Uwaga na 7 / 2!',
            tags: ['double', '/ 2.0', 'setprecision'],
            statement: [
                'Wczytaj liczbę całkowitą n i wypisz jej połowę z dokładnością do jednego miejsca po przecinku. W C++ zamiast przecinka piszemy kropkę, np. 3.5.',
                'Uważaj na pułapkę: dzielenie dwóch int-ów obcina ułamek — w C++ 7 / 2 to 3, a nie 3.5.',
            ],
            input_format: ['W jedynym wierszu jedna liczba całkowita n.'],
            output_format: ['Wypisz n / 2 z dokładnie jedną cyfrą po kropce.'],
            constraints: ['−10⁶ ≤ n ≤ 10⁶'],
            examples: [
                { input: '7' },
                { input: '8', note: 'Dokładnie jedna cyfra po kropce — także wtedy, gdy wynik jest całkowity.' },
            ],
            hint: R`Podziel przez 2.0 zamiast przez 2 — wtedy C++ liczy na liczbach z przecinkiem: n / 2.0. Jedną cyfrę po kropce ustawisz tak: cout << fixed << setprecision(1) << n / 2.0; (na górze programu dopisz #include <iomanip>).`,
            tests: (r) => ['0', '1', '-1', '-3', '2', '1000000', '-1000000', '999999', r.int(-1e6, 1e6), r.int(-1e6, 1e6)],
            solve: (inp) => fx(reader(inp).int() / 2, 1),
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    int n;
    cin >> n;
    cout << fixed << setprecision(1) << n / 2.0 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-srednia-dwoch', krok: 5, level: 'latwe',
            title: 'Średnia dwóch liczb',
            short: 'Wczytaj dwie liczby z przecinkiem i wypisz ich średnią.',
            tags: ['double', 'cin', 'nawiasy'],
            statement: ['Wczytaj dwie liczby rzeczywiste a i b (mogą mieć część ułamkową, np. 2.5) i wypisz ich średnią arytmetyczną z dokładnością do dwóch miejsc po przecinku.'],
            input_format: ['W jedynym wierszu dwie liczby rzeczywiste a i b.'],
            output_format: ['Wypisz (a + b) / 2 z dokładnie dwiema cyframi po kropce.'],
            constraints: ['−1000 ≤ a, b ≤ 1000', 'liczby mają co najwyżej jedną cyfrę po kropce'],
            examples: [{ input: '2.5 4' }, { input: '-1 0.5' }],
            hint: 'Wczytaj liczby do zmiennych typu double — wtedy cin przyjmie też 2.5. Średnia to (a + b) / 2. Nawias jest konieczny: bez niego komputer najpierw podzieli b przez 2, a dopiero potem doda a.',
            tests: (r) => ['0 0', '1 2', '-1000 1000', '1000 1000', '0.1 0.2', '-0.5 -0.4',
                ...Array.from({ length: 5 }, () => `${dec(r.int(-10000, 10000), 1)} ${dec(r.int(-10000, 10000), 1)}`)],
            solve: (inp) => { const [a, b] = nums(inp); return fx((a + b) / 2, 2); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double a, b;
    cin >> a >> b;
    cout << fixed << setprecision(2) << (a + b) / 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-termometr', krok: 5, level: 'latwe',
            title: 'Termometr',
            short: 'Zamień stopnie Celsjusza na stopnie Fahrenheita.',
            tags: ['double', 'wzór', 'setprecision'],
            statement: ['W Polsce temperaturę podajemy w stopniach Celsjusza, a w USA — w stopniach Fahrenheita. Wczytaj temperaturę C w stopniach Celsjusza i wypisz ją w stopniach Fahrenheita, z dokładnością do jednego miejsca po przecinku. Wzór: F = C · 9 / 5 + 32.'],
            input_format: ['W jedynym wierszu jedna liczba rzeczywista C.'],
            output_format: ['Wypisz F z dokładnie jedną cyfrą po kropce.'],
            constraints: ['−100 ≤ C ≤ 100', 'C ma co najwyżej jedną cyfrę po kropce'],
            examples: [{ input: '36.6' }, { input: '-40', note: 'Minus 40 stopni to jedyna temperatura, która w obu skalach wynosi tyle samo.' }],
            hint: 'Wczytaj C do zmiennej double. Wtedy C * 9 / 5 liczy się na liczbach z przecinkiem. Gdyby C było int-em, dzielenie przez 5 zgubiłoby ułamek.',
            tests: (r) => {
                const out = ['0', '100', '-100', '37', '21.5'];
                while (out.length < 11) {
                    const k = r.int(-1000, 1000);
                    if (safe(k / 10 * 9 / 5 + 32, 1)) out.push(dec(k, 1));
                }
                return out;
            },
            solve: (inp) => { const c = reader(inp).int(); return fx(c * 9 / 5 + 32, 1); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double c;
    cin >> c;
    cout << fixed << setprecision(1) << c * 9 / 5 + 32 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-zakupy', krok: 5, level: 'srednie',
            title: 'Zakupy na wagę',
            short: 'Cena za kilogram razy waga — wynik do pełnych groszy.',
            tags: ['double', 'setprecision(2)'],
            statement: ['Jabłka kosztują c złotych za kilogram, a Bajtek kupił w kilogramów. Ile zapłaci? Wynik wypisz z dokładnością do dwóch miejsc po przecinku (do pełnych groszy).'],
            input_format: ['W jedynym wierszu dwie liczby rzeczywiste: cena za kilogram c (z dwiema cyframi po kropce) i waga w (z trzema cyframi po kropce).'],
            output_format: ['Wypisz c · w z dokładnie dwiema cyframi po kropce.'],
            constraints: ['0.01 ≤ c ≤ 100.00', '0.001 ≤ w ≤ 50.000', 'testy dobrano tak, żeby zaokrąglenie do groszy było zawsze jednoznaczne'],
            examples: [{ input: '3.49 2.250', note: '3,49 · 2,25 = 7,8525 zł, czyli po zaokrągleniu do groszy 7,85 zł.' }, { input: '6.20 0.750' }],
            hint: R`Obie liczby wczytaj jako double i pomnóż: c * w. Do pełnych groszy, czyli z dwiema cyframi po kropce: cout << fixed << setprecision(2) << c * w;`,
            tests: (r) => {
                const out = ['1.00 1.000', '100.00 50.000', '0.01 0.001', '4.99 2.000'];
                while (out.length < 11) {
                    const c = r.int(1, 10000), w = r.int(1, 50000);
                    if (safe((c / 100) * (w / 1000), 2) && safe(Number(dec(c, 2)) * Number(dec(w, 3)), 2)) out.push(`${dec(c, 2)} ${dec(w, 3)}`);
                }
                return out;
            },
            solve: (inp) => { const [c, w] = nums(inp); return fx(c * w, 2); },
            cpp: R`
#include <iostream>
#include <iomanip>
using namespace std;
int main() {
    double c, w;
    cin >> c >> w;
    cout << fixed << setprecision(2) << c * w << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 6 · char
        {
            id: 'tz-kod-znaku', krok: 6, level: 'latwe',
            title: 'Kod znaku',
            short: 'Wczytaj znak i wypisz jego numer w tabeli ASCII.',
            tags: ['char', 'ASCII', '(int)'],
            statement: ['Każdy znak ma w komputerze swój numer — kod ASCII. Wczytaj jeden znak i wypisz jego kod.'],
            input_format: ['W jedynym wierszu jeden znak: litera, cyfra albo inny widoczny znak, np. ! albo ?. Nigdy spacja.'],
            output_format: ['Wypisz jedną liczbę — kod ASCII wczytanego znaku.'],
            constraints: ['kod znaku jest liczbą od 33 do 126'],
            examples: [{ input: 'A' }, { input: '7', note: 'Znak 7 to co innego niż liczba 7 — jego kod to 55.' }],
            hint: 'Wczytaj znak do zmiennej char c; (cin >> c;). Żeby wypisać jego numer, a nie sam znak, zamień go na int: cout << (int)c;',
            tests: (r) => ['a', 'z', 'Z', '0', '9', '!', '~', '?', '#', String.fromCharCode(r.int(33, 126)), String.fromCharCode(r.int(33, 126))],
            solve: (inp) => String(inp.trim().charCodeAt(0)),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char c;
    cin >> c;
    cout << (int)c << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-znak-o-kodzie', krok: 6, level: 'latwe',
            title: 'Znak o kodzie k',
            short: 'Odwrotnie: wczytaj numer ASCII i wypisz znak, który go ma.',
            tags: ['char', 'ASCII', '(char)'],
            statement: ['Odwrotnie niż w poprzednim zadaniu: wczytaj kod ASCII k i wypisz znak, który ma ten kod.'],
            input_format: ['W jedynym wierszu jedna liczba całkowita k.'],
            output_format: ['Wypisz jeden znak — ten, który ma kod k.'],
            constraints: ['33 ≤ k ≤ 126'],
            examples: [{ input: '66' }, { input: '97' }],
            hint: 'Wczytaj liczbę do int k;, a przy wypisywaniu zamień ją na znak: cout << (char)k;. Możesz też przypisać ją do zmiennej typu char: char c = k; cout << c;',
            tests: (r) => ['33', '48', '57', '65', '90', '122', '126', '64', r.int(33, 126), r.int(33, 126)],
            solve: (inp) => String.fromCharCode(reader(inp).int()),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int k;
    cin >> k;
    cout << (char)k << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-nastepna-litera', krok: 6, level: 'latwe',
            title: 'Następna litera',
            short: 'Wypisz literę, która stoi w alfabecie zaraz po wczytanej.',
            tags: ['char', 'c + 1', '(char)'],
            statement: ['Wczytaj małą literę alfabetu angielskiego (od a do y) i wypisz literę, która jest po niej w alfabecie.'],
            input_format: ['W jedynym wierszu jedna mała litera.'],
            output_format: ['Wypisz następną literę alfabetu.'],
            constraints: ['litera jest jedną z a, b, …, y (nigdy z)'],
            examples: [{ input: 'c' }],
            hint: 'Litery w ASCII leżą jedna za drugą, więc następna litera ma kod o 1 większy. Ale uwaga: c + 1 to już liczba (int), więc cout wypisałby 100 zamiast d. Zamień wynik z powrotem na znak: (char)(c + 1) — albo zwiększ samą zmienną: c++; cout << c;',
            tests: (r) => ['a', 'b', 'm', 'x', 'y', r.pick(MALE.slice(0, 25).split('')), r.pick(MALE.slice(0, 25).split(''))],
            solve: (inp) => String.fromCharCode(inp.trim().charCodeAt(0) + 1),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char c;
    cin >> c;
    cout << (char)(c + 1) << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-ktora-litera', krok: 6, level: 'latwe',
            title: 'Która to litera alfabetu?',
            short: 'Zamień literę na jej numer w alfabecie: a to 1, z to 26.',
            tags: ['char', "c - 'a'"],
            statement: ['Wczytaj małą literę alfabetu angielskiego i wypisz jej numer w alfabecie: a ma numer 1, b — 2, …, z — 26.'],
            input_format: ['W jedynym wierszu jedna mała litera.'],
            output_format: ['Wypisz jedną liczbę od 1 do 26.'],
            constraints: ['litera jest jedną z 26 małych liter alfabetu angielskiego'],
            examples: [{ input: 'a' }, { input: 'k' }],
            hint: "Odejmowanie znaków daje odległość między nimi: c - 'a' to 0 dla a, 1 dla b i tak dalej. Wystarczy dodać 1: cout << c - 'a' + 1;",
            tests: (r) => ['b', 'z', 'm', 'q', r.pick(MALE.split('')), r.pick(MALE.split(''))],
            solve: (inp) => String(inp.trim().charCodeAt(0) - 96),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char c;
    cin >> c;
    cout << c - 'a' + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-wielka-litera', krok: 6, level: 'srednie',
            title: 'Wielka litera',
            short: 'Zamień małą literę na wielką, licząc na kodach ASCII.',
            tags: ['char', 'ASCII', '(char)'],
            statement: [
                'Wczytaj małą literę alfabetu angielskiego i wypisz tę samą literę, ale wielką.',
                'W tabeli ASCII wielkie litery A–Z mają kody od 65 do 90, a małe a–z kody od 97 do 122. Odległość między małą a wielką wersją tej samej litery jest zawsze taka sama.',
            ],
            input_format: ['W jedynym wierszu jedna mała litera.'],
            output_format: ['Wypisz tę samą literę, ale wielką.'],
            constraints: ['litera jest jedną z 26 małych liter alfabetu angielskiego'],
            examples: [{ input: 'b' }, { input: 'z' }],
            hint: "Policz, która to litera od a: c - 'a'. Tyle samo kroków od A jest jej wielka wersja: (char)(c - 'a' + 'A'). Możesz też po prostu odjąć 32, bo 'a' - 'A' = 97 − 65 = 32 — ale pierwszy zapis nie wymaga pamiętania liczb.",
            tests: (r) => ['a', 'm', 'q', 'y', r.pick(MALE.split('')), r.pick(MALE.split(''))],
            solve: (inp) => inp.trim()[0].toUpperCase(),
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char c;
    cin >> c;
    cout << (char)(c - 'a' + 'A') << "\n";
    return 0;
}`,
        },
        {
            id: 'tz-cyfry-znaki', krok: 6, level: 'srednie',
            title: 'Cyfry zapisane jako znaki',
            short: "Zamień znaki cyfr na liczby (c - '0') i policz z nimi.",
            tags: ['char', "c - '0'"],
            statement: [
                'Wczytaj dwie cyfry jako znaki (typ char) — na wejściu są oddzielone spacją. Wypisz w pierwszym wierszu ich sumę, a w drugim liczbę dwucyfrową, którą tworzą, gdy zapiszesz je obok siebie (pierwsza cyfra to cyfra dziesiątek).',
                "Pułapka: znak '7' ma kod 55, a znak '5' — kod 53, więc dodanie dwóch znaków bez zastanowienia da 108, a nie 12.",
            ],
            input_format: ['W jedynym wierszu dwie cyfry oddzielone spacją.'],
            output_format: ['W pierwszym wierszu wypisz sumę cyfr, a w drugim liczbę dwucyfrową złożoną z tych cyfr.'],
            constraints: ['pierwsza cyfra jest od 1 do 9, druga od 0 do 9'],
            examples: [{ input: '7 5' }],
            hint: "Znak cyfry zamienisz na jej wartość, odejmując znak zera: '7' - '0' to 7 (bo 55 − 48 = 7). Potem już zwykła arytmetyka: suma to x + y, a liczba dwucyfrowa to x * 10 + y.",
            tests: (r) => ['1 0', '9 9', '5 0', '2 8', `${r.int(1, 9)} ${r.int(0, 9)}`, `${r.int(1, 9)} ${r.int(0, 9)}`, `${r.int(1, 9)} ${r.int(0, 9)}`],
            solve: (inp) => { const [x, y] = nums(inp); return join(x + y, 10 * x + y); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    char a, b;
    cin >> a >> b;
    int x = a - '0';
    int y = b - '0';
    cout << x + y << "\n";
    cout << x * 10 + y << "\n";
    return 0;
}`,
        },
    ];
};
