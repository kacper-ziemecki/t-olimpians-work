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
];

module.exports = { SITE, KATEGORIA, LEKCJE };
