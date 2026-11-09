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
    {
        temat: 'While loop',
        prefix: 'wh-',
        plik: 'c++_logika/while-loop.html',
        pliki: ['while-cwiczenia-1.js', 'while-cwiczenia-2.js', 'while-baza.js'],
        note: 'Czwarta lekcja C++: program powtarza instrukcje. Pętla while krok po kroku, licznik, suma i iloczyn, ' +
            'wczytywanie danych w pętli (n liczb, wartość kończąca, while (cin >> x)), cyfry liczby i znaki napisu, ' +
            'pętle „aż do skutku” (Collatz, algorytm Euklidesa), break, continue, do … while i pętla w pętli. ' +
            'Wystarczy to, co znasz z lekcji o typach zmiennych, o wejściu i wyjściu oraz o if / else.',
        bazaOpisy: {
            latwe: 'Jedna pętla i jeden pomysł naraz — FizzBuzz, sumy, cyfry i ramka z gwiazdek.',
            srednie: 'Symulacje, rekordy i serie, liczby pierwsze, system dwójkowy i szyfr Cezara.',
            trudne: 'Rozkład na czynniki, NWW, Collatz, trójkąt Pascala — a na końcu wielki finał: dziennik pogody.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'pierwsza', spis: 'Pierwsza pętla while',
                nazwa: 'Krok 1 · Pierwsza pętla — powtarzaj, dopóki…',
                kategoria: 'Pętla while / krok 1: pierwsza pętla',
                note: 'Po co pętla, składnia while, ślad wykonania obrót po obrocie, liczenie od 1 do n i w dół, ' +
                    'powtórzenie czegoś n razy, licznik pętli w obliczeniach, pętla w gałęzi if.',
            },
            {
                nr: 2, kotwica: 'budowa', spis: 'Start, warunek i zmiana',
                nazwa: 'Krok 2 · Start, warunek i zmiana — budowa pętli',
                kategoria: 'Pętla while / krok 2: budowa pętli',
                note: 'Trzy elementy każdej pętli, krok inny niż 1 (+= 2, -= k, *= 2), ile razy wykona się pętla i błąd o jeden, ' +
                    'pętla, która nie wykona się ani razu, pętla nieskończona i średnik po while, dwie zmienne w jednej pętli.',
            },
            {
                nr: 3, kotwica: 'suma', spis: 'Licznik, suma i iloczyn',
                nazwa: 'Krok 3 · Licznik, suma i iloczyn',
                kategoria: 'Pętla while / krok 3: licznik i suma',
                note: 'Zmienna, która zbiera wynik: suma od zera, iloczyn od jedynki, licznik warunkowy z if w pętli, ' +
                    'silnia i potęga w long long, dzielniki liczby i sprawdzanie, czy liczba jest pierwsza.',
            },
            {
                nr: 4, kotwica: 'wczytywanie', spis: 'Wczytywanie danych w pętli',
                nazwa: 'Krok 4 · Wczytywanie danych w pętli',
                kategoria: 'Pętla while / krok 4: wczytywanie w pętli',
                note: 'n liczb po kolei, średnia, największa i najmniejsza liczba, wartość kończąca (do zera), ' +
                    'while (cin >> x) do końca danych, zapamiętywanie poprzedniej liczby.',
            },
            {
                nr: 5, kotwica: 'cyfry', spis: 'Cyfry liczby i znaki napisu',
                nazwa: 'Krok 5 · Cyfry liczby i znaki napisu',
                kategoria: 'Pętla while / krok 5: cyfry i napisy',
                note: 'n % 10 i n /= 10: liczba cyfr, suma cyfr, odwracanie liczby i palindromy; ' +
                    'przechodzenie po napisie znak po znaku (s[i], s.length()) w przód i wstecz.',
            },
            {
                nr: 6, kotwica: 'do-skutku', spis: 'Pętla „aż do skutku”',
                nazwa: 'Krok 6 · Pętla „aż do skutku”',
                kategoria: 'Pętla while / krok 6: aż do skutku',
                note: 'Gdy nie wiadomo, ile będzie obrotów: dzielenie na pół, cel do osiągnięcia, lokata w groszach, ' +
                    'problem Collatza, algorytm Euklidesa (NWD), odejmowanie do skutku.',
            },
            {
                nr: 7, kotwica: 'break', spis: 'break, continue i do … while',
                nazwa: 'Krok 7 · break, continue, while (true) i do … while',
                kategoria: 'Pętla while / krok 7: break, continue, do-while',
                note: 'Przerwanie pętli w połowie, pomijanie obrotu i pułapka z i++, pętla while (true) z wyjściem w środku, ' +
                    'menu poleceń, do … while wykonujące się co najmniej raz, szukanie dzielnika do pierwiastka.',
            },
            {
                nr: 8, kotwica: 'zagniezdzone', spis: 'Pętla w pętli',
                nazwa: 'Krok 8 · Pętla w pętli',
                kategoria: 'Pętla while / krok 8: pętla w pętli',
                note: 'Wiersze i kolumny: prostokąty, trójkąty, choinka i szachownica z gwiazdek, tabliczka mnożenia, ' +
                    'zerowanie licznika wewnętrznej pętli, liczby pierwsze i doskonałe do n.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Pętla while / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: FizzBuzz, ślimak w studni, bankomat, ' +
                    'system dwójkowy, szyfr Cezara, rozkład na czynniki, trójkąt Pascala — a na koniec wielki finał: dziennik pogody.',
            },
        ],
    },
    {
        temat: 'For loop',
        prefix: 'for-',
        plik: 'c++_logika/for-loop.html',
        pliki: ['for-cwiczenia-1.js', 'for-cwiczenia-2.js', 'for-baza.js'],
        note: 'Piąta lekcja C++: pętla for, czyli start, warunek i zmiana w jednej linijce. Zakresy i liczba obrotów, ' +
            'wczytywanie danych, break i continue w for, napisy (także for (char c : s)), pętle zagnieżdżone, ' +
            'sprawdzanie wszystkich możliwości i szybkość pętli. Wystarczy to, co znasz z poprzednich lekcji — zwłaszcza z lekcji o while.',
        bazaOpisy: {
            latwe: 'Jedna pętla albo prosta pętla w pętli — sumy, alfabet, wykresy, tabela temperatur i silnie.',
            srednie: 'Serie, rysunki z warunkiem na wiersz i kolumnę, liczenie liter, kompresja napisu, hetman i zegar.',
            trudne: 'Trójki pitagorejskie, palindromy, Goldbach, liczby zaprzyjaźnione, kalendarz — a na końcu wielki finał: wyniki konkursu.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'pierwsza', spis: 'Pierwsza pętla for',
                nazwa: 'Krok 1 · Pierwsza pętla for — while w jednej linijce',
                kategoria: 'Pętla for / krok 1: pierwsza pętla for',
                note: 'Budowa for: start, warunek i zmiana w jednym nawiasie, kolejność wykonywania, ślad obrót po obrocie, ' +
                    'przepisywanie while na for, n razy, odliczanie, licznik w obliczeniach, suma z double.',
            },
            {
                nr: 2, kotwica: 'zakresy', spis: 'Zakresy, kroki i liczba obrotów',
                nazwa: 'Krok 2 · Zakresy, kroki i liczba obrotów',
                kategoria: 'Pętla for / krok 2: zakresy i kroki',
                note: 'Od a do b, w dół, co k, mnożenie licznika, dwa liczniki w jednym nawiasie, ile razy obróci się pętla, ' +
                    'pusty zakres, zasięg licznika (zmienna istnieje tylko w pętli), pierwsza wielokrotność i skoki co k.',
            },
            {
                nr: 3, kotwica: 'dane', spis: 'for i dane wejściowe',
                nazwa: 'Krok 3 · for i dane wejściowe',
                kategoria: 'Pętla for / krok 3: for i dane',
                note: 'n liczb w pętli for, suma i średnia, rekordy z pozycją (pierwsza i ostatnia), wiersze z kilkoma danymi, ' +
                    'imię przy rekordzie, poprzednia liczba, minimum na bieżąco.',
            },
            {
                nr: 4, kotwica: 'break', spis: 'for kontra while, break i continue',
                nazwa: 'Krok 4 · for kontra while — break, continue i for (;;)',
                kategoria: 'Pętla for / krok 4: for kontra while',
                note: 'Kiedy for, a kiedy while, break przy szukaniu, continue bez pułapki z licznikiem, ' +
                    'pętla bez warunku for (;;), następna liczba pierwsza.',
            },
            {
                nr: 5, kotwica: 'napisy', spis: 'for i napisy',
                nazwa: 'Krok 5 · for i napisy',
                kategoria: 'Pętla for / krok 5: for i napisy',
                note: 'for po indeksach napisu, for (char c : s), getline, separatory, zamiana liter na kodach, ' +
                    'palindromy, porównywanie dwóch napisów, budowanie nowego napisu, krok co 2.',
            },
            {
                nr: 6, kotwica: 'zagniezdzone', spis: 'Pętle zagnieżdżone',
                nazwa: 'Krok 6 · Pętle zagnieżdżone',
                kategoria: 'Pętla for / krok 6: pętle zagnieżdżone',
                note: 'Wiersze i kolumny z for, trójkąty w różne strony, pętla po literach, pary i < j, ' +
                    'tabliczka z nagłówkami i setw, piramida z cyfr, liczenie par.',
            },
            {
                nr: 7, kotwica: 'mozliwosci', spis: 'Sprawdź wszystkie możliwości',
                nazwa: 'Krok 7 · Sprawdź wszystkie możliwości',
                kategoria: 'Pętla for / krok 7: wszystkie możliwości',
                note: 'Przeszukiwanie zupełne: kury i krowy, cyfry liczb trzycyfrowych, zakupy co do grosza, sumy kwadratów, ' +
                    'trójkąty o danym obwodzie, kody PIN, trzecia wartość wyliczona z dwóch.',
            },
            {
                nr: 8, kotwica: 'szybkosc', spis: 'Jak szybka jest pętla',
                nazwa: 'Krok 8 · Jak szybka jest pętla',
                kategoria: 'Pętla for / krok 8: szybkość pętli',
                note: 'Ile obrotów zdąży komputer w sekundę, liczenie obrotów wzorem, pętla do pierwiastka, ' +
                    'dzielniki w parach, jedna pętla zamiast dwóch.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Pętla for / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: silnie, wykresy, romb, warstwy kwadratu, ' +
                    'anagramy, hetman, trójki pitagorejskie, Goldbach, kalendarz — a na koniec wielki finał: wyniki konkursu.',
            },
        ],
    },
    {
        temat: 'Modulo',
        prefix: 'mod-',
        plik: 'c++_logika/modulo.html',
        pliki: ['modulo-cwiczenia-1.js', 'modulo-cwiczenia-2.js', 'modulo-baza.js'],
        note: 'Szósta lekcja C++: reszta z dzielenia, czyli operator %. Dzielenie z resztą i kolejność działań, podzielność, ' +
            'rozkładanie czasu i pieniędzy na jednostki, cyfry na dowolnej pozycji i inne systemy liczbowe, zawijanie w kółko ' +
            '(zegar, dni tygodnia, numeracja od 1), liczby ujemne, działania modulo (wynik modulo 10⁹ + 7, reszta z ogromnej liczby) ' +
            'oraz NWD, dzielenie pisemne i szybkie potęgowanie. Wystarczy to, co znasz z poprzednich lekcji — zwłaszcza pętle.',
        bazaOpisy: {
            latwe: 'Jedno zastosowanie % naraz — reszty, ostatnie cyfry, numeracja od 1, grosze i zegar z kukułką.',
            srednie: 'Kilka sztuczek naraz: obroty liczb, systemy liczbowe, olbrzymy zapisane jako napisy, kod kreskowy, zera silni i zegar w lustrze.',
            trudne: 'Okresy reszt, IBAN, wyliczanka, ułamki okresowe i strefy czasowe — a na końcu wielki finał: dzień tygodnia dowolnej daty.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'reszta', spis: 'Dzielenie z resztą: / i %',
                nazwa: 'Krok 1 · Dzielenie z resztą — / i %',
                kategoria: 'Modulo / krok 1: dzielenie z resztą',
                note: 'Iloraz i reszta, sprawdzenie a = b · q + r, reszta zawsze mniejsza od dzielnika, reszty idące w kółko, ' +
                    'kolejność działań z % i operator %=.',
            },
            {
                nr: 2, kotwica: 'podzielnosc', spis: 'Podzielność',
                nazwa: 'Krok 2 · Podzielność — reszta równa zero',
                kategoria: 'Modulo / krok 2: podzielność',
                note: 'x % k == 0, parzystość, dzielnik czy wielokrotność, liczenie wielokrotności wzorem, co k-ty element, ' +
                    'lata przestępne, wspólne wielokrotności, cecha podzielności przez 3 i 9.',
            },
            {
                nr: 3, kotwica: 'jednostki', spis: 'Czas, pieniądze i miary',
                nazwa: 'Krok 3 · Rozkładanie na jednostki — czas, pieniądze, miary',
                kategoria: 'Modulo / krok 3: jednostki',
                note: 'Minuty na godziny, sekundy na HH:MM:SS, grosze na złote, składanie z powrotem i różnica czasu, ' +
                    'wydawanie reszty, mieszane jednostki: tygodnie, jardy, doba na innej planecie.',
            },
            {
                nr: 4, kotwica: 'cyfry', spis: 'Cyfry liczby',
                nazwa: 'Krok 4 · Cyfry liczby — każda pozycja na zawołanie',
                kategoria: 'Modulo / krok 4: cyfry liczby',
                note: 'n / 10ᵏ % 10, ostatnie cyfry przez % 100 i % 1000, pierwsza cyfra, liczenie cyfr z do … while, ' +
                    'budowanie liczby z wybranych cyfr, wycinanie cyfry, zapis w systemie o podstawie b.',
            },
            {
                nr: 5, kotwica: 'w-kolko', spis: 'Zawijanie w kółko',
                nazwa: 'Krok 5 · Zawijanie w kółko — zegar, kalendarz, kółeczko',
                kategoria: 'Modulo / krok 5: zawijanie w kółko',
                note: 'Zegar i dni tygodnia, numeracja od 1 ((x − 1 + k) % n + 1), rzędy i miejsca, chodzenie po kółku, ' +
                    'powtarzające się wzory, szachownica z dużych pól, cykl świateł.',
            },
            {
                nr: 6, kotwica: 'ujemne', spis: 'Liczby ujemne i pułapki',
                nazwa: 'Krok 6 · Liczby ujemne i pułapki',
                kategoria: 'Modulo / krok 6: liczby ujemne',
                note: 'Znak reszty w C++, poprawka ((a % n) + n) % n, cofanie zegara, czas przez północ, iloraz i reszta ' +
                    'po matematycznemu, nieparzystość liczb ujemnych, % na double i dzielenie przez zero.',
            },
            {
                nr: 7, kotwica: 'dzialania', spis: 'Działania modulo',
                nazwa: 'Krok 7 · Działania modulo — reszta z ogromnych liczb',
                kategoria: 'Modulo / krok 7: działania modulo',
                note: 'Reszta z sumy i z iloczynu, modulo po każdym kroku, ostatnie cyfry potęg, wynik modulo 10⁹ + 7, ' +
                    'silnia i Fibonacci modulo, reszta z liczby zapisanej jako napis.',
            },
            {
                nr: 8, kotwica: 'olimpiada', spis: 'Modulo na olimpiadzie',
                nazwa: 'Krok 8 · Modulo na olimpiadzie — NWD, dzielenie pisemne, szybkie potęgowanie',
                kategoria: 'Modulo / krok 8: modulo na olimpiadzie',
                note: 'Algorytm Euklidesa z resztą, NWW i skracanie ułamków, dzielenie pisemne z dowolną liczbą cyfr, ' +
                    'k-ta cyfra po przecinku, szybkie potęgowanie modulo.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Modulo / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: zegar z kukułką, batony w paczkach, kod kreskowy, ' +
                    'zera silni, zegar w lustrze, IBAN, wyliczanka, ułamki okresowe — a na koniec wielki finał: jaki to dzień tygodnia.',
            },
        ],
    },
    {
        temat: 'Tablice',
        prefix: 'tab-',
        plik: 'c++_logika/tablice.html',
        pliki: ['tablice-cwiczenia-1.js', 'tablice-cwiczenia-2.js', 'tablice-baza.js'],
        note: 'Siódma lekcja C++ i pierwsza z drugiego etapu: tablice. Pudełka z numerami i indeksy od zera, wczytywanie, ' +
            'wypisywanie i wypełnianie tablicy pętlą, suma, maksimum, szukanie i sąsiedzi, zamiana, odwracanie, przesuwanie, ' +
            'usuwanie i wstawianie, tablice równoległe i ściągi, tablica liczników, tablice dwuwymiarowe i plansze, a na koniec ' +
            'duże tablice globalne, sumy prefiksowe i sito Eratostenesa. Wystarczy to, co znasz z pierwszego etapu.',
        bazaOpisy: {
            latwe: 'Jeden pomysł naraz: zamiana sąsiadów, palindromy, podlewanie ogrodu, sto drzwi, waga szalkowa, wybory, wieże, kino, lista zakupów i pionek na planszy.',
            srednie: 'Kilka sztuczek naraz: medaliści, statki, kwadrat magiczny, sudoku, lider ciągu, cieplejszy dzień, liczby bliźniacze, mediana, wywiadówka, wykres i szyfr kolumnowy.',
            trudne: 'Spirala, gra w życie, skarbonki z tablicą różnic, sumy prostokątów, dodawanie i silnia olbrzymów, rekordzista dzielników — a na końcu wielki finał: tabela turnieju.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'pierwsza', spis: 'Pierwsza tablica',
                nazwa: 'Krok 1 · Pierwsza tablica — pudełka z numerami',
                kategoria: 'Tablice / krok 1: pierwsza tablica',
                note: 'Tworzenie tablicy, indeksy od zera, zapisywanie i odczytywanie pudełek, wartości w klamrach, indeks jako wyrażenie, ' +
                    'wyjście poza tablicę, tablice napisów i tablice-ściągi.',
            },
            {
                nr: 2, kotwica: 'petla', spis: 'Tablica i pętla',
                nazwa: 'Krok 2 · Tablica i pętla — wczytaj, wypisz, wypełnij',
                kategoria: 'Tablice / krok 2: tablica i pętla',
                note: 'n liczb w tablicy z zapasem, wypisywanie od tyłu, z numerami i co drugi element, fragment od a do b, ' +
                    'wypełnianie wzorem, element z poprzednich (potęgi, Fibonacci), separatory i for (int x : t).',
            },
            {
                nr: 3, kotwica: 'przegladanie', spis: 'Suma, maksimum, szukanie',
                nazwa: 'Krok 3 · Przeglądanie tablicy — suma, maksimum, szukanie',
                kategoria: 'Tablice / krok 3: przeglądanie',
                note: 'Suma i średnia, liczby większe od średniej, liczniki z warunkiem, maksimum i jego pozycja, szukanie z break, ' +
                    'pierwsze i ostatnie wystąpienie, sąsiedzi t[i] i t[i + 1], pary i < j.',
            },
            {
                nr: 4, kotwica: 'zmiany', spis: 'Zamiana, odwracanie, przesuwanie',
                nazwa: 'Krok 4 · Zmienianie tablicy — zamiana, odwracanie, przesuwanie',
                kategoria: 'Tablice / krok 4: zmiany',
                note: 'Zmiana każdego elementu, swap, odwracanie całości i fragmentu, przesuwanie w kółko o 1 i o k, ' +
                    'usuwanie i wstawianie, usuwanie wielu elementów dwoma indeksami, kopiowanie pętlą.',
            },
            {
                nr: 5, kotwica: 'kilka', spis: 'Kilka tablic naraz',
                nazwa: 'Krok 5 · Kilka tablic naraz — równoległe, ściągi, scalanie',
                kategoria: 'Tablice / krok 5: kilka tablic',
                note: 'Tablice równoległe (imię i punkty), dane z dwóch rund, nowa tablica z wybranych elementów, ściągi indeksowane literą, ' +
                    'liczby rzymskie, scalanie dwóch uporządkowanych list.',
            },
            {
                nr: 6, kotwica: 'zliczanie', spis: 'Tablica liczników',
                nazwa: 'Krok 6 · Tablica liczników — ile razy wystąpiło',
                kategoria: 'Tablice / krok 6: liczniki',
                note: 'ile[x]++, histogram, liczenie liter, najczęstsza wartość, tablica bool „czy już było”, brakujące i powtórzone liczby, ' +
                    'sortowanie przez zliczanie, przesunięcie dla liczb ujemnych.',
            },
            {
                nr: 7, kotwica: 'dwuwymiarowe', spis: 'Tablice dwuwymiarowe',
                nazwa: 'Krok 7 · Tablice dwuwymiarowe — wiersze i kolumny',
                kategoria: 'Tablice / krok 7: tablice 2D',
                note: 't[w][k], wczytywanie tabelki, sumy wierszy i kolumn, transpozycja, przekątne, plansze ze znaków, ' +
                    'sąsiedzi kratki z kontrolą brzegów, saper i kierunki w tablicach.',
            },
            {
                nr: 8, kotwica: 'olimpiada', spis: 'Tablice na olimpiadzie',
                nazwa: 'Krok 8 · Tablice na olimpiadzie — sumy prefiksowe i sito',
                kategoria: 'Tablice / krok 8: olimpiada',
                note: 'Duże tablice globalne i szacowanie pamięci, numeracja od 1, sumy prefiksowe i suma przedziału p[b] − p[a − 1], ' +
                    'najlepszy odcinek długości k, sito Eratostenesa.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Tablice / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: sto drzwi, wieże, kino, statki, sudoku, kwadrat magiczny, ' +
                    'gra w życie, spirala, olbrzymie liczby cyfra po cyfrze — a na koniec wielki finał: tabela turnieju.',
            },
        ],
    },
    {
        temat: 'String',
        prefix: 'str-',
        plik: 'c++_logika/string.html',
        pliki: ['string-cwiczenia-1.js', 'string-cwiczenia-2.js', 'string-baza.js'],
        note: 'Ósma lekcja C++: napisy (string) od środka. Znaki w pudełkach z numerami, długość i pusty napis, wczytywanie słów, ' +
            'wierszy i tekstu do końca danych, rodzaje znaków (isdigit, isalpha, toupper), budowanie i zmienianie napisów, porównywanie ' +
            'słownikowe, substr, find, erase, insert i replace, liczby zapisane jako napisy i olbrzymy cyfra po cyfrze, a na koniec ' +
            'olimpijskie sztuczki: liczniki liter, szyfry, okna i sumy prefiksowe na napisach. Wystarczy to, co znasz z poprzednich lekcji.',
        bazaOpisy: {
            latwe: 'Jeden pomysł naraz: akronimy, hashtagi, język P, rymy, łańcuch słów, wisielec, litery po kolei i SMS na starym telefonie.',
            srednie: 'Kilka sztuczek naraz: GA-DE-RY-PO-LU-KI, czas trwania filmu, nawiasy, liczby rzymskie, kalkulator, PESEL, alfabet Morse’a, krzyżówka, obroty napisu i numer konta IBAN.',
            trudne: 'Okres napisu, zawijanie wierszy, wzorce z pytajnikami, najdłuższy palindrom, odejmowanie i mnożenie olbrzymów, najdłuższy fragment bez powtórzeń, kwota słownie — a na koniec wielki finał: edytor tekstu.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'od-srodka', spis: 'Napis od środka',
                nazwa: 'Krok 1 · Napis od środka — znaki w pudełkach',
                kategoria: 'String / krok 1: napis od środka',
                note: 'Napis jako rząd znaków z numerami od zera, length i size, pusty napis i empty, pierwszy, ostatni i środkowy znak, ' +
                    'zmiana jednego znaku, tworzenie i kopiowanie napisów, wyjście poza napis i at, pułapka length() − 1, polskie litery.',
            },
            {
                nr: 2, kotwica: 'wczytywanie', spis: 'Wczytywanie tekstu',
                nazwa: 'Krok 2 · Wczytywanie tekstu — słowa, wiersze, do końca danych',
                kategoria: 'String / krok 2: wczytywanie',
                note: 'cin >> s i getline, słowa i wiersze aż do końca danych, liczba, a potem wiersz (cin.ignore i ws), puste wiersze, ' +
                    'tablica napisów i t[i][j], wiersz pocięty przecinkami.',
            },
            {
                nr: 3, kotwica: 'znaki', spis: 'Znak po znaku',
                nazwa: 'Krok 3 · Znak po znaku — rodzaje znaków i liczniki',
                kategoria: 'String / krok 3: znak po znaku',
                note: 'Warunki na przedziałach znaków, isdigit, isalpha, isupper, islower, isspace, toupper i tolower, kilka liczników naraz, ' +
                    'pierwsze i ostatnie wystąpienie, sąsiednie znaki, serie i flagi.',
            },
            {
                nr: 4, kotwica: 'budowanie', spis: 'Zmienianie i budowanie',
                nazwa: 'Krok 4 · Zmieniamy i budujemy napisy',
                kategoria: 'String / krok 4: budowanie napisów',
                note: 'Zmiana w miejscu i for (char &c : s), budowanie od pustego napisu, += i push_back, doklejanie z przodu, pop_back i clear, ' +
                    'filtrowanie i powtarzanie, pułapki sklejania, odwracanie.',
            },
            {
                nr: 5, kotwica: 'porownywanie', spis: 'Porównywanie napisów',
                nazwa: 'Krok 5 · Porównywanie napisów — kolejność słownikowa',
                kategoria: 'String / krok 5: porównywanie',
                note: '== i !=, kolejność słownikowa < i >, wielkie litery przed małymi, liczby zapisane jako napisy, najmniejszy i największy napis, ' +
                    'swap i porządkowanie, wspólny początek.',
            },
            {
                nr: 6, kotwica: 'fragmenty', spis: 'Fragmenty i szukanie',
                nazwa: 'Krok 6 · Fragmenty i szukanie — substr, find, erase, insert, replace',
                kategoria: 'String / krok 6: fragmenty i szukanie',
                note: 'substr, przedrostek i przyrostek, find i string::npos, szukanie od pozycji i wszystkie wystąpienia, rfind, rozcinanie napisu, ' +
                    'erase, insert i replace, zamiana wszystkich wystąpień.',
            },
            {
                nr: 7, kotwica: 'liczby', spis: 'Napisy i liczby',
                nazwa: 'Krok 7 · Napisy i liczby — cyfry, zamiany i olbrzymy',
                kategoria: 'String / krok 7: napisy i liczby',
                note: 'Cyfra jako znak i jako liczba, to_string, stoi i stoll, olbrzymy cyfra po cyfrze, reszta z dzielenia olbrzyma, ' +
                    'dodawanie pisemne, system dwójkowy na napisach, liczby ukryte w tekście.',
            },
            {
                nr: 8, kotwica: 'olimpiada', spis: 'Napisy na olimpiadzie',
                nazwa: 'Krok 8 · Napisy na olimpiadzie — liczniki, szyfry, okna',
                kategoria: 'String / krok 8: olimpiada',
                note: 'Tablica liczników liter, szyfry z modulo, okno o stałej długości, sumy prefiksowe na napisie, szybkość operacji na napisach, ' +
                    'tablica napisów i liczenie słów.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'String / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: akronimy, wisielec, GA-DE-RY-PO-LU-KI, PESEL, Morse, krzyżówka, ' +
                    'IBAN, palindromy, olbrzymy, kwota słownie — a na koniec wielki finał: edytor tekstu.',
            },
        ],
    },
    {
        temat: 'Pair',
        prefix: 'pair-',
        plik: 'c++_logika/pair.html',
        pliki: ['pair-cwiczenia-1.js', 'pair-cwiczenia-2.js', 'pair-baza.js'],
        note: 'Dziewiąta lekcja C++: pary (pair). Dwie wartości w jednym pudełku, first i second, klamry i make_pair, pary z życia ' +
            '(punkty, godziny, ułamki, przedziały), porównywanie par i sztuczka z minusem, tablica par zamiast dwóch tablic, rozpakowywanie ' +
            'i pary w parach, kierunki na planszy, sortowanie par jedną linijką, a na koniec olimpijskie zastosowania: scalanie przedziałów, ' +
            'zdarzenia i zachłanne wybieranie. Wystarczy to, co znasz z poprzednich lekcji.',
        bazaOpisy: {
            latwe: 'Jeden pomysł naraz: czwarty wierzchołek, aukcja, trasa kuriera, wspólna część przedziałów, dzwonki, pociągi, wieże, kino, szachownica Polibiusza i skok w dal.',
            srednie: 'Kilka sztuczek naraz: przecięcie prostokątów, punkty od najbliższego, punkty niezdominowane, symetria, najbliższe miasto, pole figury, balony, kolizje w planie i pole działki.',
            trudne: 'Mrówka Langtona, największy trójkąt, pokrycie odcinka, gdzie zbudować sklep, prostokąty z punktów, robot z przeszkodami — a na koniec wielki finał: klasyfikacja olimpiady.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'pierwsza-para', spis: 'Pierwsza para',
                nazwa: 'Krok 1 · Pierwsza para — first i second',
                kategoria: 'Pair / krok 1: pierwsza para',
                note: 'Dwie wartości w jednym pudełku, pair<A, B>, first i second, klamry i make_pair, różne typy w parze, nowa para ma zera, ' +
                    'wczytywanie i wypisywanie, kopiowanie, == i swap.',
            },
            {
                nr: 2, kotwica: 'pary-z-zycia', spis: 'Pary z życia',
                nazwa: 'Krok 2 · Pary z życia — punkty, godziny, ułamki, przedziały',
                kategoria: 'Pair / krok 2: pary z życia',
                note: 'Punkt (x, y) i odległość, abs, godzina (h, m) i dodawanie minut, ułamek i skracanie, przedział (od, do) i część wspólna, max i min.',
            },
            {
                nr: 3, kotwica: 'porownywanie', spis: 'Porównywanie par',
                nazwa: 'Krok 3 · Porównywanie par — najpierw first, potem second',
                kategoria: 'Pair / krok 3: porównywanie',
                note: 'Kolejność par jak w słowniku, godziny porównują się same, kolejność w parze ma znaczenie, sztuczka z minusem, max i min na parach, ' +
                    'porządkowanie trzech par.',
            },
            {
                nr: 4, kotwica: 'tablica-par', spis: 'Tablica par',
                nazwa: 'Krok 4 · Tablica par — rząd par zamiast dwóch tablic',
                kategoria: 'Pair / krok 4: tablica par',
                note: 'pair<int, int> t[1005], wczytywanie i wypisywanie, szukanie po first, najlepsza para, para (wartość, pozycja), tablica-ściąga par, ' +
                    'każda para z każdą.',
            },
            {
                nr: 5, kotwica: 'rozpakowywanie', spis: 'Rozpakowywanie i pary w parach',
                nazwa: 'Krok 5 · Rozpakowywanie i pary w parach',
                kategoria: 'Pair / krok 5: rozpakowywanie',
                note: 'auto [a, b] = p, auto &[a, b] do zmian, pętla po tablicy par, para w parze jako trójka, daty i czasy porównywane chronologicznie.',
            },
            {
                nr: 6, kotwica: 'plansza', spis: 'Pary na planszy',
                nazwa: 'Krok 6 · Pary na planszy — kierunki i ruchy',
                kategoria: 'Pair / krok 6: plansza',
                note: 'Kierunki jako pary (dw, dk), robot na planszy, sąsiedzi pętlą po kierunkach, osiem kierunków i skoczek, odwiedzone kratki, ' +
                    'skręt w prawo z modulo.',
            },
            {
                nr: 7, kotwica: 'sortowanie', spis: 'Sortowanie par',
                nazwa: 'Krok 7 · Sortowanie par — sort i klucz na pierwszym miejscu',
                kategoria: 'Pair / krok 7: sortowanie',
                note: 'sort(t, t + n), pary układają się po first, a przy remisie po second, klucz na pierwsze miejsce, malejąco z minusem, ' +
                    'para (wartość, numer), ranking i miejsca ex aequo.',
            },
            {
                nr: 8, kotwica: 'olimpiada', spis: 'Pary na olimpiadzie',
                nazwa: 'Krok 8 · Pary na olimpiadzie — przedziały i zdarzenia',
                kategoria: 'Pair / krok 8: olimpiada',
                note: 'Scalanie przedziałów, zdarzenia (czas, +1/−1), najbliższa para po sortowaniu, zachłanny wybór przedziałów, serie jako pary, ' +
                    'koszt sortowania.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Pair / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: czwarty wierzchołek, aukcja, dzwonki, wieże, przecięcie prostokątów, ' +
                    'punkty niezdominowane, balony, pole działki, mrówka Langtona — a na koniec wielki finał: klasyfikacja olimpiady.',
            },
        ],
    },
    {
        temat: 'Vector',
        prefix: 'vec-',
        plik: 'c++_logika/vector.html',
        pliki: ['vector-cwiczenia-1.js', 'vector-cwiczenia-2.js', 'vector-baza.js'],
        note: 'Dziesiąta lekcja C++: vector — tablica, która sama rośnie. Tworzenie, indeksowanie i size, push_back, pop_back i back, ' +
            'pętla for-each z referencją &, vector jako całość, iteratory begin i end, erase, insert, sort, reverse, count i find, ' +
            'vector 2D i grupy, a potem pojęcia olimpijskie: podtablica, prefiks, sufiks, podzbiór, permutacja i palindrom. ' +
            'Wystarczy to, co znasz z poprzednich lekcji.',
        bazaOpisy: {
            latwe: 'Jeden pomysł naraz: parzyste czy nieparzyste, pierwszy i ostatni po obrotach, szczyty i doliny, przesunięcie w kółko, zera na koniec, ' +
                'bez powtórzeń, lista zakupów, bilans konta, następne ustawienie i kolejka do lekarza.',
            srednie: 'Kilka sztuczek naraz: wyliczanka, scalanie list, wspólne elementy, wycieczka z budżetem, prawie palindrom, obrót w palindrom, ' +
                'drużyna marzeń, tasowanie kart, sumy prostokątów i najdłuższy palindromiczny podzbiór.',
            trudne: 'Sumy podzielne przez k, grupy anagramów, najmniej zamian, k-ta permutacja, najdłuższy rosnący podzbiór, wyspy, sklejane palindromy — ' +
                'a na koniec wielki finał: edytor ciągu.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'pierwszy-vector', spis: 'Pierwszy vector',
                nazwa: 'Krok 1 · Pierwszy vector — tablica, która zna swoją długość',
                kategoria: 'Vector / krok 1: pierwszy vector',
                note: 'vector<int>, cztery sposoby tworzenia (pusty, klamry, (n, x), (n)), nawiasy okrągłe a klamry, indeksowanie v[i], size() i ostatni element, ' +
                    'wczytywanie n liczb, wypisywanie pętlą, vector znaków, napisów i par.',
            },
            {
                nr: 2, kotwica: 'rosnie-i-maleje', spis: 'Vector rośnie i maleje',
                nazwa: 'Krok 2 · Vector rośnie i maleje — push_back, pop_back, back',
                kategoria: 'Vector / krok 2: push_back i pop_back',
                note: 'push_back w pętli, zbieranie wybranych elementów, wczytywanie do końca danych, back, front i pop_back, empty, pułapka size() - 1, ' +
                    'cyfry liczby w vectorze, clear, resize i assign.',
            },
            {
                nr: 3, kotwica: 'for-each', spis: 'Pętla for-each i &',
                nazwa: 'Krok 3 · Pętla for-each, referencja & i vector jako całość',
                kategoria: 'Vector / krok 3: for-each i &',
                note: 'for (auto x : v), kopia a referencja &, wczytywanie z &, napisy i pary w pętli for-each, kopiowanie, porównywanie (== i <) i swap całych vectorów, ' +
                    'nowa runda symulacji na kopii.',
            },
            {
                nr: 4, kotwica: 'iteratory', spis: 'Iteratory i gotowe polecenia',
                nazwa: 'Krok 4 · Iteratory — begin, end, erase, insert, sort, reverse',
                kategoria: 'Vector / krok 4: iteratory',
                note: 'begin() i *it, end() za ostatnim elementem, zakres [od, do), erase i insert, sort, reverse, count, find, max_element i min_element, ' +
                    'polecenia na kawałku vectora, usuwanie wszystkich wystąpień.',
            },
            {
                nr: 5, kotwica: 'vector-2d', spis: 'Vector 2D',
                nazwa: 'Krok 5 · Vector 2D — tabele, wiersze różnej długości i grupy',
                kategoria: 'Vector / krok 5: vector 2D',
                note: 'vector<vector<int>> m(n, vector<int>(k)), m[w][k], pętle for-each w dwóch wymiarach, wiersze różnej długości (trójkąt Pascala), ' +
                    'grupy i listy sąsiedztwa, vector<string> jako plansza.',
            },
            {
                nr: 6, kotwica: 'podtablice', spis: 'Podtablice, prefiksy i sufiksy',
                nazwa: 'Krok 6 · Podtablice, prefiksy i sufiksy',
                kategoria: 'Vector / krok 6: podtablice',
                note: 'Podtablica jako para (I, J), ile jest podtablic, wypisywanie wszystkich, sumy bez trzeciej pętli, prefiksy i sufiksy, sumy prefiksowe, ' +
                    'liderzy (maksimum sufiksu), okno o stałej długości.',
            },
            {
                nr: 7, kotwica: 'podzbiory-permutacje', spis: 'Podzbiory i permutacje',
                nazwa: 'Krok 7 · Podzbiory i permutacje',
                kategoria: 'Vector / krok 7: podzbiory i permutacje',
                note: 'Podzbiór (bierzemy albo nie), 2 do potęgi n, czy b jest podzbiorem a (dwa palce), wszystkie podzbiory przez maski dwójkowe, ' +
                    'permutacja i n!, czy to permutacja, sortuj i porównaj, next_permutation, permutacja odwrotna.',
            },
            {
                nr: 8, kotwica: 'palindromy', spis: 'Palindromy i dwa wskaźniki',
                nazwa: 'Krok 8 · Palindromy i dwa wskaźniki',
                kategoria: 'Vector / krok 8: palindromy',
                note: 'Lustrzane pary, ile zmian do palindromu, palindromiczne podtablice (rozszerzanie od środka), dopisywanie do palindromu, ' +
                    'permutacja, która jest palindromem, dwa wskaźniki na posortowanym vectorze.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Vector / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: obroty, szczyty i doliny, lista zakupów, kolejka, wyliczanka, scalanie list, ' +
                    'prawie palindrom, drużyna marzeń, tasowanie kart, grupy anagramów, k-ta permutacja, wyspy — a na koniec wielki finał: edytor ciągu.',
            },
        ],
    },
    {
        temat: 'Sortowanie',
        prefix: 'sort-',
        plik: 'c++_logika/sortowanie.html',
        pliki: ['sortowanie-cwiczenia-1.js', 'sortowanie-cwiczenia-2.js', 'sortowanie-baza.js'],
        note: 'Lekcja o sortowaniu od podstaw: sort rosnąco i malejąco na vectorze, tablicy i napisie, k-ty element i mediana, grupy równych wartości, ' +
            'unique i najbliżsi sąsiedzi, sortowanie ręczne (wybieranie, bąbelkowe, wstawianie, zliczanie), własna reguła porównania (lambda), ' +
            'kilka kryteriów i stable_sort, sortowanie numerów i miejsca w rankingu, lower_bound i upper_bound oraz pomysły zachłanne. ' +
            'Wystarczy to, co znasz z poprzednich lekcji.',
        bazaOpisy: {
            latwe: 'Jeden pomysł naraz: szereg na WF-ie, mały słownik, skarpetki do pary, ciąg arytmetyczny, najmniejszy wolny numer, brązowy medal, ' +
                'najcieplejsze dni, patyczki na trójkąt, liczba Kaprekara i pary butów.',
            srednie: 'Kilka sztuczek naraz: dwa rankingi, sortowanie według częstości, indeks h, wyrównywanie wież, największy obwód, mediana na bieżąco, ' +
                'pary o różnicy k, zgrana drużyna, wieże z klocków i śpiewne słowa.',
            trudne: 'Największa liczba ze sklejenia, kwota nie do zapłacenia, suma odległości, kary za czekanie, trójki o sumie zero, wyrównana grupa, ' +
                'książki na półce — a na koniec wielki finał: ranking olimpiady.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'pierwszy-sort', spis: 'Pierwsze sortowanie',
                nazwa: 'Krok 1 · Pierwsze sortowanie — sort na vectorze, tablicy i napisie',
                kategoria: 'Sortowanie / krok 1: pierwsze sortowanie',
                note: 'Rosnąco i niemalejąco, sort(v.begin(), v.end()), sort(t, t + n) i od 1 do n, porządek słownikowy napisów (wielkie przed małymi, „10” przed „9”), ' +
                    'sortowanie liter i anagramy, sortowanie kawałka, kopia przed sortowaniem, sprawdzanie, czy ciąg jest posortowany (is_sorted).',
            },
            {
                nr: 2, kotwica: 'malejaco', spis: 'Malejąco, k-ty i mediana',
                nazwa: 'Krok 2 · Malejąco, k-ty element i mediana',
                kategoria: 'Sortowanie / krok 2: malejąco i mediana',
                note: 'sort + reverse, rbegin i rend, greater<int>(), v[k - 1] i v[n - k], mediana dla n parzystego i nieparzystego, suma k największych, ' +
                    'próg z remisami, największa i najmniejsza liczba z cyfr.',
            },
            {
                nr: 3, kotwica: 'grupy', spis: 'Grupy i sąsiedzi',
                nazwa: 'Krok 3 · Po sortowaniu: grupy równych i najbliżsi sąsiedzi',
                kategoria: 'Sortowanie / krok 3: grupy i sąsiedzi',
                note: 'Liczba różnych wartości, grupa po grupie (dwa numery i, j), najczęstsza wartość, sort + unique + erase, ' +
                    'najmniejsza różnica i największa przerwa między sąsiadami, okno k elementów o najmniejszym rozrzucie.',
            },
            {
                nr: 4, kotwica: 'pod-maska', spis: 'Sortowanie ręcznie',
                nazwa: 'Krok 4 · Pod maską — sortowanie przez wybieranie, bąbelkowe, wstawianie i zliczanie',
                kategoria: 'Sortowanie / krok 4: sortowanie ręcznie',
                note: 'Cztery metody z animacjami: wybieranie (minimum na miejsce i), bąbelkowe (zamiany sąsiadów, rundy i flaga), wstawianie (jak karty w ręce), ' +
                    'zliczanie (liczniki); inwersje, liczba porównań, dwie pętle kontra sort.',
            },
            {
                nr: 5, kotwica: 'wlasna-regula', spis: 'Własna reguła (lambda)',
                nazwa: 'Krok 5 · Własna reguła porównania — lambda',
                kategoria: 'Sortowanie / krok 5: własna reguła',
                note: 'Reguła odpowiada na pytanie „czy a przed b?”, zapis [](int a, int b) { return …; }, remisy i drugie kryterium, reguła, która liczy (suma cyfr), ' +
                    'abs, [&] i zmienne z main, słowa według długości, parzyste przed nieparzystymi, żelazna zasada: nigdy <=.',
            },
            {
                nr: 6, kotwica: 'kryteria', spis: 'Kilka kryteriów i stable_sort',
                nazwa: 'Krok 6 · Kilka kryteriów naraz — pary, sztuczka z minusem i stable_sort',
                kategoria: 'Sortowanie / krok 6: kilka kryteriów',
                note: 'Pary sortują się same, główne kryterium na pierwsze miejsce, sztuczka z minusem, reguła dla par i auto, trzy kryteria, ' +
                    'stable_sort i remisy w kolejności z wejścia, punkty według odległości.',
            },
            {
                nr: 7, kotwica: 'numery', spis: 'Numery i rankingi',
                nazwa: 'Krok 7 · Sortujemy numery — rekordy, miejsca w rankingu i kompresja',
                kategoria: 'Sortowanie / krok 7: numery i rankingi',
                note: 'Vector numerów sortowany regułą [&], remis po numerze, rekordy w kilku vectorach, miejsca ex aequo, kompresja wartości.',
            },
            {
                nr: 8, kotwica: 'szukanie', spis: 'Szukanie w posortowanym',
                nazwa: 'Krok 8 · Szukanie w posortowanym — połowienie, lower_bound i upper_bound',
                kategoria: 'Sortowanie / krok 8: szukanie w posortowanym',
                note: 'Zgadywanie liczby, wyszukiwanie binarne pętlą while, binary_search, lower_bound i upper_bound, liczenie elementów mniejszych, ' +
                    'równych i z przedziału, najbliższa wartość.',
            },
            {
                nr: 9, kotwica: 'zachlanne', spis: 'Pomysły zachłanne',
                nazwa: 'Krok 9 · Najpierw posortuj, potem bierz po kolei — pomysły zachłanne',
                kategoria: 'Sortowanie / krok 9: pomysły zachłanne',
                note: 'Jak najwięcej za budżet, kolejka od najkrótszego, łódki i dwa wskaźniki, suma iloczynów, ciastka dla dzieci, argument zamiany ' +
                    'i przykład, w którym zachłanność zawodzi.',
            },
            {
                nr: 10, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Sortowanie / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: szereg na WF-ie, skarpetki, liczba Kaprekara, dwa rankingi, indeks h, ' +
                    'mediana na bieżąco, zgrana drużyna, największa liczba ze sklejenia, kary za czekanie, trójki o sumie zero — a na koniec wielki finał: ranking olimpiady.',
            },
        ],
    },
];

module.exports = { SITE, KATEGORIA, LEKCJE };
