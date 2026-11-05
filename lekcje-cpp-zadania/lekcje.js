// Lekcje „C++ od podstaw” (c++_logika/*.html), które mają własne zadania w zadania-tematowe-app.
//
// Każda lekcja to jeden temat działu „C++ od podstaw” w zadania-tematowe-app/zadania.html,
// a jej kroki (części lekcji) to zagadnienia tego tematu. Te same kroki wyznaczają bloki
// ćwiczeń w samej lekcji — build.js wstawia tam karty zadań między znaczniki <!-- … -->.

const SITE = 'https://t-olimpians.com';
const KATEGORIA = 'C++ od podstaw';

const LEKCJE = [
    {
        temat: 'Typy zmiennych',
        prefix: 'tz-',
        plik: 'c++_logika/typy-zmiennych.html',
        pliki: ['typy-zmiennych-cwiczenia-1.js', 'typy-zmiennych-cwiczenia-2.js', 'typy-zmiennych-baza.js'],
        note: 'Pierwsza lekcja C++ dla zupełnie początkujących: pierwszy program, zmienne, wczytywanie danych ' +
            'i typy int, double, char, string, bool i long long. Po każdej części lekcji są ćwiczenia, ' +
            'a na końcu baza zadań od najłatwiejszego do najtrudniejszego.',
        kroki: [
            {
                nr: 1, kotwica: 'cout', spis: 'Pierwszy program i cout',
                nazwa: 'Krok 1 · Pierwszy program — cout',
                kategoria: 'Typy zmiennych / krok 1: pierwszy program',
                note: 'Szkielet programu, wypisywanie tekstu i liczb instrukcją cout, przejście do nowej linii i znaki specjalne. ' +
                    'Zadania niczego nie wczytują — tylko wypisują.',
            },
            {
                nr: 2, kotwica: 'zmienna', spis: 'Zmienna — pudełko z nazwą',
                nazwa: 'Krok 2 · Zmienna — pudełko z nazwą',
                kategoria: 'Typy zmiennych / krok 2: zmienne',
                note: 'Tworzenie zmiennej, przypisanie =, odczytywanie i zmiana wartości, śledzenie programu linijka po linijce.',
            },
            {
                nr: 3, kotwica: 'cin', spis: 'Wczytywanie danych — cin',
                nazwa: 'Krok 3 · Wczytywanie danych — cin',
                kategoria: 'Typy zmiennych / krok 3: wczytywanie (cin)',
                note: 'cin >> wczytuje dane do zmiennych. Pierwsze zadania z prawdziwymi testami: program dostaje dane i wypisuje wynik — bez żadnych „Podaj liczbę:”.',
            },
            {
                nr: 4, kotwica: 'int', spis: 'int — liczby całkowite',
                nazwa: 'Krok 4 · int — liczby całkowite i działania',
                kategoria: 'Typy zmiennych / krok 4: int i działania',
                note: 'Dodawanie, odejmowanie, mnożenie, dzielenie całkowite i reszta z dzielenia %, kolejność działań, wyciąganie cyfr liczby.',
            },
            {
                nr: 5, kotwica: 'double', spis: 'double — liczby z przecinkiem',
                nazwa: 'Krok 5 · double — liczby z przecinkiem',
                kategoria: 'Typy zmiennych / krok 5: double',
                note: 'Liczby z kropką, pułapka 7 / 2, wypisywanie z ustaloną liczbą miejsc po przecinku (fixed i setprecision).',
            },
            {
                nr: 6, kotwica: 'char', spis: 'char — pojedyncze znaki',
                nazwa: 'Krok 6 · char — pojedyncze znaki',
                kategoria: 'Typy zmiennych / krok 6: char',
                note: 'Znaki w apostrofach, kody ASCII, liczenie na literach i cyfrach zapisanych jako znaki.',
            },
            {
                nr: 7, kotwica: 'string', spis: 'string — tekst',
                nazwa: 'Krok 7 · string — tekst',
                kategoria: 'Typy zmiennych / krok 7: string',
                note: 'Wczytywanie słów, sklejanie napisów, długość napisu, pierwsza i ostatnia litera, string(n, znak).',
            },
            {
                nr: 8, kotwica: 'bool', spis: 'bool — prawda i fałsz',
                nazwa: 'Krok 8 · bool — prawda i fałsz',
                kategoria: 'Typy zmiennych / krok 8: bool',
                note: 'Porównania, operatory && || !, wypisywanie 1/0 i true/false, bool jako liczba — bez instrukcji if.',
            },
            {
                nr: 9, kotwica: 'const-auto', spis: 'const i auto',
                nazwa: 'Krok 9 · const i auto',
                kategoria: 'Typy zmiennych / krok 9: const i auto',
                note: 'Stałe, których nie da się zmienić, i typ odgadywany przez kompilator.',
            },
            {
                nr: 10, kotwica: 'zakresy', spis: 'Zakresy typów i long long',
                nazwa: 'Krok 10 · Zakresy typów i long long',
                kategoria: 'Typy zmiennych / krok 10: zakresy i long long',
                note: 'Ile mieści int, przepełnienie, long long, INT_MAX — i jak szacować, czy wynik się zmieści.',
            },
            {
                nr: 11, kotwica: 'konwersje', spis: 'Konwersje i rzutowanie',
                nazwa: 'Krok 11 · Konwersje i rzutowanie',
                kategoria: 'Typy zmiennych / krok 11: konwersje',
                note: 'Mieszanie typów w działaniach, rzutowanie (double) i (int), zamiana liczby na napis i napisu na liczbę.',
            },
            {
                nr: 12, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Typy zmiennych / baza zadań',
                note: 'Zadania na cały temat, ułożone od najłatwiejszego do najtrudniejszego. Każde łączy kilka poznanych zagadnień — ' +
                    'na końcu czeka wielki finał, w którym przydają się wszystkie typy naraz.',
            },
        ],
    },
    {
        temat: 'Input / Output',
        prefix: 'io-',
        plik: 'c++_logika/input-output.html',
        pliki: ['input-output-cwiczenia.js', 'input-output-baza.js'],
        note: 'Druga lekcja C++: jak naprawdę działa wczytywanie, dane z separatorami (12:30, 04.11.2026), całe wiersze tekstu ' +
            '(getline), formatowanie wyników (setprecision, setw, setfill) oraz printf i scanf. Bez pętli i bez if — ' +
            'wystarczy to, co znasz z lekcji o typach zmiennych.',
        kroki: [
            {
                nr: 1, kotwica: 'wejscie', spis: 'Jak naprawdę działa cin',
                nazwa: 'Krok 1 · Jak naprawdę działa wejście',
                kategoria: 'Wejście i wyjście / krok 1: jak działa cin',
                note: 'Wejście jako taśma znaków: cin >> przeskakuje spacje i entery, czyta kolejne wartości po kolei. Dane w wielu wierszach i czytanie opisu wejścia z treści zadania.',
            },
            {
                nr: 2, kotwica: 'separatory', spis: 'Znaki pomiędzy liczbami: 12:30',
                nazwa: 'Krok 2 · Dane ze znakami pomiędzy — 12:30, 3/4',
                kategoria: 'Wejście i wyjście / krok 2: separatory',
                note: 'Godziny, daty, ułamki i punkty: separatory wczytywane do zmiennej typu char.',
            },
            {
                nr: 3, kotwica: 'getline', spis: 'getline — całe wiersze',
                nazwa: 'Krok 3 · getline — całe wiersze tekstu',
                kategoria: 'Wejście i wyjście / krok 3: getline',
                note: 'Wiersze ze spacjami, pułapka cin >> przed getline (cin.ignore() i ws), getline do wybranego znaku.',
            },
            {
                nr: 4, kotwica: 'precyzja', spis: 'fixed i setprecision',
                nazwa: 'Krok 4 · Liczby z przecinkiem — fixed i setprecision',
                kategoria: 'Wejście i wyjście / krok 4: fixed i setprecision',
                note: 'Zaokrąglanie do wybranej liczby miejsc po przecinku, setprecision(0), liczby całkowite obok double.',
            },
            {
                nr: 5, kotwica: 'setw', spis: 'setw, setfill i wyrównanie',
                nazwa: 'Krok 5 · Szerokość i wyrównanie — setw, setfill, left',
                kategoria: 'Wejście i wyjście / krok 5: setw i setfill',
                note: 'Zera z przodu (09:05, 00042), równe kolumny, wyrównanie do lewej i do prawej, tabelki i paragony.',
            },
            {
                nr: 6, kotwica: 'printf', spis: 'printf i scanf',
                nazwa: 'Krok 6 · printf i scanf',
                kategoria: 'Wejście i wyjście / krok 6: printf i scanf',
                note: 'Wypisywanie i wczytywanie w stylu języka C: %d, %lld, %.2f, %lf, szerokość pola, zera z przodu, wzorce z separatorami.',
            },
            {
                nr: 7, kotwica: 'szybkie-io', spis: 'Szybkie wejście i wyjście',
                nazwa: 'Krok 7 · Szybkie wejście i wyjście',
                kategoria: 'Wejście i wyjście / krok 7: szybkie I/O',
                note: 'sync_with_stdio(false), cin.tie(nullptr) i "\\n" zamiast endl — szablon programu na olimpiadę.',
            },
            {
                nr: 8, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Wejście i wyjście / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: bilety, daty, paragony, rozkłady jazdy, faktury — ' +
                    'a na koniec legitymacja szkolna, w której przydaje się wszystko naraz.',
            },
        ],
    },
    {
        temat: 'If / Else',
        prefix: 'ie-',
        plik: 'c++_logika/if-else.html',
        pliki: ['if-else-cwiczenia-1.js', 'if-else-cwiczenia-2.js', 'if-else-baza.js'],
        note: 'Trzecia lekcja C++: program podejmuje decyzje. if, else, else if, warunki z porównaniami i operatorami && || !, ' +
            'zagnieżdżanie, typowe schematy (największa z trzech liczb, zamiana miejscami, sortowanie trzech liczb, licznik) ' +
            'oraz switch i operator ?:. Bez pętli — wystarczy to, co znasz z lekcji o typach zmiennych i o wejściu i wyjściu.',
        // Opisy grup w bazie zadań (zamiast domyślnych z build.js).
        bazaOpisy: {
            latwe: 'Jeden albo dwa warunki naraz — sprawdź, czy pewnie czujesz if, else i else if.',
            srednie: 'Kilka przypadków, łączenie warunków i schematy z lekcji: zamiany, licznik, przedziały.',
            trudne: 'Szachownica, trójkąty, kalendarz i long long — a na końcu wielki finał, w którym przydaje się wszystko naraz.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'if', spis: 'Pierwszy if',
                nazwa: 'Krok 1 · Pierwszy if — zrób to tylko wtedy, gdy…',
                kategoria: 'Instrukcja if / krok 1: pierwszy if',
                note: 'Instrukcja if z warunkiem i klamrami, kod wykonywany tylko czasem i zawsze, if zmieniający zmienną, ' +
                    'zaokrąglanie dzielenia w górę, kilka niezależnych if-ów, pułapki: średnik po if i if bez klamer.',
            },
            {
                nr: 2, kotwica: 'else', spis: 'if … else — dwie drogi',
                nazwa: 'Krok 2 · if … else — jedna z dwóch dróg',
                kategoria: 'Instrukcja if / krok 2: if … else',
                note: 'Dokładnie jedna z dwóch gałęzi, odpowiedzi TAK/NIE, parzystość także dla liczb ujemnych, zmienna tworzona przed if, ' +
                    'różnica między if … else a dwoma osobnymi if-ami.',
            },
            {
                nr: 3, kotwica: 'warunki', spis: 'Z czego zbudować warunek',
                nazwa: 'Krok 3 · Warunki — porównania liczb, znaków i napisów',
                kategoria: 'Instrukcja if / krok 3: warunki',
                note: '= kontra ==, działania w warunkach, liczba jako warunek, porównywanie znaków (kody ASCII) i napisów (kolejność słownikowa), ' +
                    'ostrożnie z double, mnożenie zamiast dzielenia, warunek w zmiennej bool.',
            },
            {
                nr: 4, kotwica: 'else-if', spis: 'else if — wiele możliwości',
                nazwa: 'Krok 4 · else if — więcej niż dwie możliwości',
                kategoria: 'Instrukcja if / krok 4: else if',
                note: 'Łańcuch else if sprawdzany z góry na dół, kolejność progów, przedziały i ich granice, osobne if-y kontra łańcuch, końcowe else.',
            },
            {
                nr: 5, kotwica: 'logiczne', spis: '&&, || i ! w warunkach',
                nazwa: 'Krok 5 · Łączenie warunków — &&, || i !',
                kategoria: 'Instrukcja if / krok 5: && || !',
                note: 'Liczba w przedziale (i pułapka a <= x <= b), jedna z kilku wartości, przedziały znaków, nawiasy przy && i ||, ' +
                    'zaprzeczenie i prawa De Morgana, skrócone obliczanie jako ochrona przed dzieleniem przez zero.',
            },
            {
                nr: 6, kotwica: 'zagniezdzone', spis: 'if w środku if',
                nazwa: 'Krok 6 · if w środku if — zagnieżdżanie',
                kategoria: 'Instrukcja if / krok 6: zagnieżdżanie',
                note: 'if w klamrach innego if, drzewo decyzji, zagnieżdżanie kontra && i else if, else należący do najbliższego if.',
            },
            {
                nr: 7, kotwica: 'schematy', spis: 'Typowe schematy z if',
                nazwa: 'Krok 7 · Typowe schematy — maksimum, zamiana, licznik',
                kategoria: 'Instrukcja if / krok 7: typowe schematy',
                note: 'Największa i najmniejsza z kilku liczb, max i min, zamiana miejscami (swap), dwie i trzy liczby w kolejności rosnącej, ' +
                    'licznik i suma warunkowa, flaga typu bool.',
            },
            {
                nr: 8, kotwica: 'switch', spis: 'switch i operator ?:',
                nazwa: 'Krok 8 · switch i operator ?:',
                kategoria: 'Instrukcja if / krok 8: switch i ?:',
                note: 'switch z case, break i default, kilka case z jednym kodem, zapomniany break, switch na znakach (kalkulator) ' +
                    'i operator warunkowy ?: do wyboru jednej z dwóch wartości.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Instrukcja if / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: termometr, boisko, szachownica, trójkąty, odcinki, ' +
                    'parking i kalendarz — a na koniec wielki finał: jaka data będzie jutro.',
            },
        ],
    },
];

module.exports = { SITE, KATEGORIA, LEKCJE };
