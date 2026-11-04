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
];

module.exports = { SITE, KATEGORIA, LEKCJE };
