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
    {
        temat: 'Max / Min',
        prefix: 'mm-',
        plik: 'c++_logika/max-min.html',
        pliki: ['max-min-cwiczenia-1.js', 'max-min-cwiczenia-2.js', 'max-min-cwiczenia-3.js', 'max-min-baza.js'],
        note: 'Lekcja o max i min od podstaw: max(a, b) i min(a, b), zasada jednego typu (long long, double, size()), trzy liczby i lista w klamrach, ' +
            'liczba środkowa, rekord w pętli i jego start, pozycja rekordu i remisy, liczenie wystąpień, max_element, min_element i minmax_element, ' +
            'przycinanie (clamp) i wspólna część przedziałów, dwie i trzy największe liczby, rekordy na bieżąco od lewej i od prawej, najlepszy zysk, ' +
            'serie, okna i największa suma fragmentu. Wystarczy to, co znasz z poprzednich lekcji.',
        bazaOpisy: {
            latwe: 'Jeden, dwa pomysły naraz: pogoda w maju, najszybszy biegacz, promocja 3 za 2, strata do lidera, fotoradar, najlepszy skok, ' +
                'dobowe wahania temperatury, ramka wokół punktów, bankomat i najdłuższa przerwa między autobusami.',
            srednie: 'Kilka sztuczek naraz: najdziwniejszy wynik, dwie kasy w sklepie, najcieplejszy dzień każdego tygodnia, najlepszy moment na transakcję, ' +
                'iloczyn trzech liczb, puchar, wspólne pole prostokątów, spotkanie w połowie drogi, pogoda na wycieczkę oraz najlepszy wiersz i kolumna.',
            trudne: 'Deszczówka, dwie transakcje, naszyjnik z koralików, najdłuższa górka, największy iloczyn fragmentu, ścieżka po planszy, ławka w parku — ' +
                'a na koniec wielki finał: wyprawa w góry.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'dwie-liczby', spis: 'Dwie liczby — max i min',
                nazwa: 'Krok 1 · max i min — większa i mniejsza z dwóch liczb',
                kategoria: 'Max / Min / krok 1: dwie liczby',
                note: 'max(a, b) i min(a, b) dla liczb dodatnich, ujemnych i równych, max jako wartość w działaniach, wynik bez przypisania, ' +
                    'porównanie z if i ?:, zasada jednego typu (3.0, 7LL, (double)a), znaki, napisy i pary, słowa z treści zadania.',
            },
            {
                nr: 2, kotwica: 'trzy-liczby', spis: 'Trzy i więcej liczb',
                nazwa: 'Krok 2 · Trzy i więcej liczb — max w max i lista w klamrach',
                kategoria: 'Max / Min / krok 2: trzy i więcej liczb',
                note: 'max(a, max(b, c)) czytane od środka, max({a, b, c, d}), błąd bez klamer, noty sędziów (suma − max − min), ' +
                    'liczba środkowa i trzy liczby po kolei, trójkąt z najdłuższego boku, long long przy sumach.',
            },
            {
                nr: 3, kotwica: 'rekord', spis: 'Rekord w pętli',
                nazwa: 'Krok 3 · Rekord w pętli — maks = max(maks, x)',
                kategoria: 'Max / Min / krok 3: rekord w pętli',
                note: 'Rekord bez tablicy, start od pierwszej liczby, pułapka zera, INT_MIN i INT_MAX, max i min w jednej pętli, rozstęp, ' +
                    'rekord czegoś policzonego ((int)s.size(), sumy cyfr), rekord tylko z niektórych liczb (flaga bool).',
            },
            {
                nr: 4, kotwica: 'pozycja', spis: 'Gdzie, ile razy i kto',
                nazwa: 'Krok 4 · Gdzie był rekord, ile razy padł i kto go ustanowił',
                kategoria: 'Max / Min / krok 4: pozycja i remisy',
                note: 'Pozycja rekordu, > kontra >= (pierwsze i ostatnie wystąpienie), liczba wystąpień w jednej pętli, zwycięzca z imieniem, ' +
                    'rekord według własnej miary (najbliżej celu, pary), wszystkie miejsca rekordu.',
            },
            {
                nr: 5, kotwica: 'max-element', spis: 'max_element i min_element',
                nazwa: 'Krok 5 · max_element i min_element — rekord bez pętli',
                kategoria: 'Max / Min / krok 5: max_element i min_element',
                note: 'Strzałka na rekord: * daje wartość, − v.begin() numer, tablice i kawałki, napisy, count, minmax_element (ostatni największy!), ' +
                    'reguła porównania (lambda), pusty vector.',
            },
            {
                nr: 6, kotwica: 'granice', spis: 'Przycinanie i przedziały',
                nazwa: 'Krok 6 · Nie mniej niż, nie więcej niż — przycinanie i przedziały',
                kategoria: 'Max / Min / krok 6: przycinanie i przedziały',
                note: 'Podłoga max(0, x), sufit min(limit, x), przycinanie max(lo, min(hi, x)) i clamp, przelewanie wody, ' +
                    'wspólna część przedziałów i jej długość, część wspólna dwóch prostokątów.',
            },
            {
                nr: 7, kotwica: 'dwie-najwieksze', spis: 'Dwie największe',
                nazwa: 'Krok 7 · Podium — dwie i trzy największe w jednym przejściu',
                kategoria: 'Max / Min / krok 7: dwie największe',
                note: 'Złoto i srebro (m1, m2), kolejność przesunięć, druga największa z powtórzeniami i bez, najlepsza para: suma i iloczyn ' +
                    '(dwie najmniejsze ujemne), trzy największe.',
            },
            {
                nr: 8, kotwica: 'na-biezaco', spis: 'Rekordy na bieżąco',
                nazwa: 'Krok 8 · Rekordy na bieżąco, widok z prawej i najlepszy zysk',
                kategoria: 'Max / Min / krok 8: rekordy na bieżąco',
                note: 'Rekord do tej pory i liczba pobitych rekordów, tablice pm i sm (od lewej i od prawej), widok z prawej, ' +
                    'najlepszy zysk z kupna i sprzedaży, schemat „wcześniej — później” w jednej pętli.',
            },
            {
                nr: 9, kotwica: 'serie', spis: 'Serie i fragmenty',
                nazwa: 'Krok 9 · Najdłuższa seria, najlepsze okno i największa suma fragmentu',
                kategoria: 'Max / Min / krok 9: serie i fragmenty',
                note: 'Obecny i najlepszy, najdłuższa seria i rosnący fragment, okno k kolejnych liczb, największa suma fragmentu (Kadane), ' +
                    'maksima wierszy i kolumn, najmniejsze z maksimów.',
            },
            {
                nr: 10, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Max / Min / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: pogoda w maju, promocja 3 za 2, bankomat, dwie kasy, puchar, ' +
                    'spotkanie w połowie drogi, deszczówka, dwie transakcje, ścieżka po planszy — a na koniec wielki finał: wyprawa w góry.',
            },
        ],
    },
    {
        temat: 'Zaokrąglanie',
        prefix: 'zao-',
        plik: 'c++_logika/zaokraglanie.html',
        pliki: ['zaokraglanie-cwiczenia-1.js', 'zaokraglanie-cwiczenia-2.js', 'zaokraglanie-cwiczenia-3.js', 'zaokraglanie-baza.js'],
        note: 'Lekcja o zaokrąglaniu od podstaw: oś liczbowa, część całkowita i ułamkowa, floor i ceil, round i llround (połówki dalej od zera), ' +
            'ucinanie (int) i trunc, liczby ujemne i dzielenie w dół z minusem, dzielenie w górę i do najbliższej na liczbach całkowitych, ' +
            'zaokrąglanie do dziesiątek, kwadransów i wielokrotności, do miejsc po przecinku, wypisywanie a zaokrąglanie (setprecision) ' +
            'oraz pułapki liczb double: grosze bez błędów, epsilon, wielkie liczby i pierwiastek całkowity. Wystarczy to, co znasz z poprzednich lekcji.',
        bazaOpisy: {
            latwe: 'Jeden, dwa pomysły naraz: pizza dla klasy, spływ kajakowy, ocena ze sprawdzianu, cena po rabacie, wypożyczalnia rowerów, płot, ' +
                'tankowanie, średnia temperatura, czytanie książki i bankomat.',
            srednie: 'Kilka sztuczek naraz: średnia ważona, ocena w gwiazdkach, kratki na mapie, taksówka, licznik wyświetleń, cyfry znaczące, ' +
                'noty bez skrajnych, godziny pracy, dzień tygodnia za d dni i rozkład jazdy.',
            trudne: 'Histogram, średnia wielkich liczb, podział mandatów, kwadraty i sześciany, spłata kredytu, odcinki na osi, tempo biegu — ' +
                'a na koniec wielki finał: wycieczka klasowa.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'os-liczbowa', spis: 'Oś liczbowa i sąsiedzi',
                nazwa: 'Krok 1 · Co to znaczy zaokrąglić — oś liczbowa i sąsiedzi',
                kategoria: 'Zaokrąglanie / krok 1: oś liczbowa',
                note: 'Liczba między dwiema kreskami, w dół, w górę, do najbliższej i ucięcie, część całkowita i ułamkowa, zaokrąglanie ręczne ' +
                    'z (int) i if, sztuczka (int)(x + 0.5), liczby ujemne na osi.',
            },
            {
                nr: 2, kotwica: 'floor-ceil', spis: 'floor i ceil',
                nazwa: 'Krok 2 · floor i ceil — w dół i w górę',
                kategoria: 'Zaokrąglanie / krok 2: floor i ceil',
                note: 'floor i ceil dla liczb dodatnich i ujemnych, wynik jako double (zapis naukowy, -0) i zamiana na long long, ' +
                    'dzielenie int-ów przed ceil, pełne i rozpoczęte, liczby całkowite w przedziale.',
            },
            {
                nr: 3, kotwica: 'round', spis: 'round — do najbliższej',
                nazwa: 'Krok 3 · round i llround — do najbliższej całkowitej',
                kategoria: 'Zaokrąglanie / krok 3: round',
                note: 'Połówki dalej od zera, llround zamiast round, dlaczego nie (int)(x + 0.5), średnia i procent zaokrąglone, ' +
                    'odległość od najbliższej całkowitej.',
            },
            {
                nr: 4, kotwica: 'ucinanie', spis: 'Ucinanie i liczby ujemne',
                nazwa: 'Krok 4 · Ucinanie (int) i trunc — i dzielenie liczb ujemnych',
                kategoria: 'Zaokrąglanie / krok 4: ucinanie i liczby ujemne',
                note: 'W stronę zera i od zera, cztery sposoby obok siebie, dzielenie i reszta dla liczb ujemnych, dzielenie w dół z poprawką, ' +
                    'tygodnie, kratki i szachownica.',
            },
            {
                nr: 5, kotwica: 'dzielenie', spis: 'Dzielenie w górę na int',
                nazwa: 'Krok 5 · Dzielenie z zaokrągleniem na liczbach całkowitych',
                kategoria: 'Zaokrąglanie / krok 5: dzielenie w górę',
                note: '(n + k − 1) / k i n / k + (n % k != 0), dlaczego nie ceil dla wielkich liczb, do najbliższej bez ułamków, procenty, ' +
                    'autobusy, wytłaczanki, strony i podział po równo.',
            },
            {
                nr: 6, kotwica: 'wielokrotnosci', spis: 'Dziesiątki i wielokrotności',
                nazwa: 'Krok 6 · Do dziesiątek, setek i wielokrotności',
                kategoria: 'Zaokrąglanie / krok 6: wielokrotności',
                note: 'Podziel, zaokrąglij, pomnóż: dziesiątki, kwadranse, dowolne k, wielokrotności na double, następny odjazd autobusu, ' +
                    'liczba wielokrotności w przedziale, ceny i zakupy.',
            },
            {
                nr: 7, kotwica: 'miejsca', spis: 'Miejsca po przecinku',
                nazwa: 'Krok 7 · Do miejsc po przecinku — zaokrąglanie i wyświetlanie',
                kategoria: 'Zaokrąglanie / krok 7: miejsca po przecinku',
                note: 'round(x * 100) / 100, w dół i w górę do groszy, setprecision zmienia tylko wygląd, połówki przy wypisywaniu, ' +
                    'kolejność zaokrągleń.',
            },
            {
                nr: 8, kotwica: 'pulapki', spis: 'Pułapki double',
                nazwa: 'Krok 8 · Pułapki liczb z przecinkiem — grosze, epsilon i pierwiastki',
                kategoria: 'Zaokrąglanie / krok 8: pułapki double',
                note: '0.1 + 0.2, złote na grosze przez llround, epsilon przy floor, ceil i porównaniach, liczenie w groszach, ' +
                    'wielkie liczby w double, pierwiastek całkowity z poprawką.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Zaokrąglanie / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: pizza dla klasy, ocena ze sprawdzianu, bankomat, średnia ważona, ' +
                    'kratki na mapie, licznik wyświetleń, histogram, podział mandatów, spłata kredytu — a na koniec wielki finał: wycieczka klasowa.',
            },
        ],
    },
    {
        temat: 'Silnia',
        prefix: 'sil-',
        plik: 'c++_logika/silnia.html',
        pliki: ['silnia-cwiczenia-1.js', 'silnia-cwiczenia-2.js', 'silnia-cwiczenia-3.js', 'silnia-baza.js'],
        note: 'Lekcja o silni od podstaw: ustawienia w kolejce i drzewko wyborów, 0! = 1, silnia w pętli krok po kroku, iloczyn od a do b ' +
            'i co druga liczba, granice int i long long oraz sprawdzanie przed mnożeniem, tablica silni i dzielenie silni bez liczenia ich, ' +
            'silnia modulo, zera na końcu i czynniki pierwsze silni, silnie olbrzymy cyfra po cyfrze i liczba cyfr przez log10, ' +
            'a na koniec liczenie sposobów: podium, wybieranie (symbol Newtona), trójkąt Pascala i anagramy. Wystarczy to, co znasz z poprzednich lekcji.',
        bazaOpisy: {
            latwe: 'Jeden, dwa pomysły naraz: turniej każdy z każdym, pary na balu, matematyka przed fizyką, dyżurni, seria na półce, ' +
                'silnie w przedziale, ostatnia cyfra sumy, dzielenie silni, silnia z odstępami i 10! sekund.',
            srednie: 'Kilka pomysłów naraz: zera iloczynu silni, pary na wycieczkę, samorząd klasowy, lotto, droga do szkoły, mikołajki, ' +
                'rozkład silni na czynniki, numer ustawienia, iloczyn silni modulo i silnia z d cyframi.',
            trudne: 'Ostatnia niezerowa cyfra, zera w innym systemie, najmniejsza silnia podzielna przez k, dzielniki silni, numer anagramu, ' +
                'cukierki dla dzieci, pierwsze cyfry olbrzyma — a na koniec wielki finał: kalkulator silni.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'czym-jest', spis: 'Czym jest silnia',
                nazwa: 'Krok 1 · Czym jest silnia — ustawienia w kolejce',
                kategoria: 'Silnia / krok 1: czym jest silnia',
                note: 'Ustawianie osób w kolejce, drzewko wyborów, n! = 1 · 2 · … · n, dlaczego 0! = 1, każda silnia z poprzedniej, ' +
                    'jedna osoba na stałe, dwie półki, okrągły stół i osoby, które chcą stać obok siebie.',
            },
            {
                nr: 2, kotwica: 'petla', spis: 'Silnia w pętli',
                nazwa: 'Krok 2 · Silnia w pętli — krok po kroku',
                kategoria: 'Silnia / krok 2: silnia w pętli',
                note: 'Wynik startuje od 1, warunek i <= n, ślad pętli, pętla w dół, n = 0 i liczby ujemne, iloczyn od a do b, ' +
                    'co druga liczba (n!!), suma silni i silnie na przemian z minusem.',
            },
            {
                nr: 3, kotwica: 'granice', spis: 'Granice typów',
                nazwa: 'Krok 3 · Jak szybko rośnie silnia — granice int i long long',
                kategoria: 'Silnia / krok 3: granice typów',
                note: 'int do 12!, long long do 20!, przepełnienie bez ostrzeżenia, liczba cyfr, sprawdzanie przed mnożeniem (w > x / i), ' +
                    'największe n z n! ≤ x, czy liczba jest silnią, bezpieczny iloczyn.',
            },
            {
                nr: 4, kotwica: 'tablica', spis: 'Tablica silni',
                nazwa: 'Krok 4 · Tablica silni — policz raz, korzystaj wiele razy',
                kategoria: 'Silnia / krok 4: tablica silni',
                note: 'f[i] = f[i - 1] * i, wiele pytań naraz, dzielenie silni bez liczenia ich, najbliższa silnia, iloczyn silni, ' +
                    'silnie cyfr (145 = 1! + 4! + 5!), łańcuchy silni cyfr i system silniowy.',
            },
            {
                nr: 5, kotwica: 'modulo', spis: 'Silnia modulo',
                nazwa: 'Krok 5 · Silnia modulo — reszta bez liczenia całej silni',
                kategoria: 'Silnia / krok 5: silnia modulo',
                note: 'Ostatnia cyfra, w = w * i % m, 10⁹ + 7, n! mod m = 0 dla n ≥ m, suma silni modulo, iloczyn od a do b modulo, ' +
                    'tablica reszt na wiele pytań i test Wilsona.',
            },
            {
                nr: 6, kotwica: 'zera', spis: 'Zera na końcu',
                nazwa: 'Krok 6 · Zera na końcu i czynniki silni',
                kategoria: 'Silnia / krok 6: zera i czynniki',
                note: 'Skąd się biorą zera, liczenie piątek wolno i szybko (n/5 + n/25 + …), dwójki, wykładnik liczby pierwszej w silni, ' +
                    'zera na końcu iloczynu i silnia z dokładnie k zerami.',
            },
            {
                nr: 7, kotwica: 'olbrzymy', spis: 'Silnie olbrzymy',
                nazwa: 'Krok 7 · Silnie olbrzymy — cyfra po cyfrze i log10',
                kategoria: 'Silnia / krok 7: silnie olbrzymy',
                note: 'Liczba w vectorze cyfr od końca, mnożenie pisemne z przeniesieniem, dokładna silnia do 1000, suma i liczenie cyfr, ' +
                    'ostatnia niezerowa cyfra, suma silni olbrzymów, liczba cyfr i pierwsza cyfra przez log10.',
            },
            {
                nr: 8, kotwica: 'sposoby', spis: 'Liczenie sposobów',
                nazwa: 'Krok 8 · Liczenie sposobów — podium, wybieranie i trójkąt Pascala',
                kategoria: 'Silnia / krok 8: liczenie sposobów',
                note: 'Podium (n · (n − 1) · …), kody z różnych cyfr, uściski dłoni, symbol Newtona bez przepełnienia, trójkąt Pascala, ' +
                    'anagramy z powtórzonymi literami, ścieżki na kratce i dwumian modulo.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Silnia / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: turniej, pary na balu, 10! sekund, pary na wycieczkę, lotto, ' +
                    'mikołajki, numer ustawienia, ostatnia niezerowa cyfra, dzielniki silni, cukierki dla dzieci — a na koniec wielki finał: kalkulator silni.',
            },
        ],
    },
    {
        temat: 'Wartość bezwzględna',
        prefix: 'abs-',
        plik: 'c++_logika/wartosc-bezwzgledna.html',
        pliki: ['wartosc-bezwzgledna-cwiczenia-1.js', 'wartosc-bezwzgledna-cwiczenia-2.js', 'wartosc-bezwzgledna-cwiczenia-3.js', 'wartosc-bezwzgledna-baza.js'],
        note: 'Lekcja o wartości bezwzględnej od podstaw: oś liczbowa i odległość od zera, moduł przez if i funkcja abs, typy wyniku i pułapki ' +
            '(abs najmniejszej liczby int, reszta z liczby ujemnej, size() bez znaku), odległość dwóch liczb |a − b|, liczba najbliżej i najdalej od celu z remisami, ' +
            'skoki między sąsiadami, kroki po kratce (taksówkarz, król, figury szachowe) i rysunki z modułem, przedziały |x − c| ≤ r, tolerancja i odległość na tarczy, ' +
            'a na koniec suma odległości i mediana. Wystarczy to, co znasz z poprzednich lekcji.',
        bazaOpisy: {
            latwe: 'Jeden, dwa pomysły naraz: reszta czy dopłata, trzech przyjaciół, punktualność pociągów, ciepło-zimno, dwie windy, litera X, ' +
                'odległość od przedziału, spacer po osi, pomyłki synoptyka i fala na stawie.',
            srednie: 'Kilka pomysłów naraz: najbardziej podobny kolor, najbliższy kwadrat, podział taśmy, najbliższa stacja, spotkanie jak najszybciej, ' +
                'pole trójkąta, pary o różnicy k, wskazówki zegara, ranking rzutów i odległość od parku.',
            trudne: 'Dwie windy w akcji, najbliżsi na torze, stabilny fragment, pole działki, najbliższy palindrom, wszystkie odległości w mieście, ' +
                'kurier zachłanny — a na koniec wielki finał: teleturniej „Zgadnij liczbę”.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'od-zera', spis: 'Odległość od zera',
                nazwa: 'Krok 1 · Odległość od zera — moduł liczby',
                kategoria: 'Wartość bezwzględna / krok 1: odległość od zera',
                note: 'Oś liczbowa, |x| jako odległość od zera, liczba przeciwna −x, moduł przez if (x < 0) x = -x, równanie |x| = k, ' +
                    'liczby o module co najwyżej k (2k + 1), znak liczby oraz suma ze znakiem i suma modułów.',
            },
            {
                nr: 2, kotwica: 'funkcja-abs', spis: 'Funkcja abs',
                nazwa: 'Krok 2 · Funkcja abs — typy i pułapki',
                kategoria: 'Wartość bezwzględna / krok 2: funkcja abs',
                note: 'abs oddaje wynik (x = abs(x)), abs w wyrażeniach, |a| + |b| i |a + b|, abs dla long long i double, ' +
                    'najmniejsza liczba int, reszta z liczby ujemnej i cyfry liczby ujemnej.',
            },
            {
                nr: 3, kotwica: 'odleglosc', spis: 'Odległość dwóch liczb',
                nazwa: 'Krok 3 · Odległość dwóch liczb — |a − b|',
                kategoria: 'Wartość bezwzględna / krok 3: odległość dwóch liczb',
                note: '|a − b| na osi, kolejność bez znaczenia, piętra, minuty i litery, kilka odcinków po kolei, czy c leży pomiędzy, ' +
                    'różnica poza zakresem int i długości napisów bez minusa.',
            },
            {
                nr: 4, kotwica: 'najblizej', spis: 'Najbliżej i najdalej',
                nazwa: 'Krok 4 · Najbliżej i najdalej — rekord według odległości',
                kategoria: 'Wartość bezwzględna / krok 4: najbliżej i najdalej',
                note: 'Porównuj odległości, zapamiętuj liczby; najbliżej zera i celu, reguły remisów, pozycja, najdalej, liczby w zasięgu, ' +
                    'sąsiedzi celu z lewej i prawej oraz para o sumie najbliżej zera.',
            },
            {
                nr: 5, kotwica: 'sasiedzi', spis: 'Skoki między sąsiadami',
                nazwa: 'Krok 5 · Skoki między sąsiadami — winda i najmniejsza różnica',
                kategoria: 'Wartość bezwzględna / krok 5: skoki między sąsiadami',
                note: 'Suma skoków |a[i] − a[i − 1]| z tablicą i bez, największy skok, podejścia i zejścia, pisanie jednym palcem, ' +
                    'najmniejsza różnica po sortowaniu i liczenie wstrząsów.',
            },
            {
                nr: 6, kotwica: 'plansza', spis: 'Kroki po kratce',
                nazwa: 'Krok 6 · Kroki po kratce — taksówkarz, król i romb',
                kategoria: 'Wartość bezwzględna / krok 6: kroki po kratce',
                note: 'Odległość miejska |dx| + |dy|, ruchy króla max(|dx|, |dy|), wieża, goniec, hetman i skoczek, notacja szachowa, ' +
                    'romb, kontur i kwadraty z gwiazdek oraz spotkanie na skrzyżowaniu.',
            },
            {
                nr: 7, kotwica: 'przedzialy', spis: 'Przedziały i tarcza',
                nazwa: 'Krok 7 · Przedziały, tolerancja i tarcza zamka',
                kategoria: 'Wartość bezwzględna / krok 7: przedziały i tarcza',
                note: '|x − c| ≤ r jako przedział, 2r + 1 liczb, równania |x − a| = d i |x − a| = |x − b|, stykające się zasięgi, ' +
                    'tolerancja w procentach bez double i odległość na tarczy min(d, n − d).',
            },
            {
                nr: 8, kotwica: 'mediana', spis: 'Gdzie się spotkać?',
                nazwa: 'Krok 8 · Gdzie się spotkać? — suma odległości i mediana',
                kategoria: 'Wartość bezwzględna / krok 8: suma odległości i mediana',
                note: 'Suma odległości od punktu, sprawdzanie kandydatów, mediana jako najlepsze miejsce, parzysta liczba domów, ' +
                    'mediana a średnia, wyrównywanie wież, zbiórka na mapie miasta i mediana ważona.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Wartość bezwzględna / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: reszta czy dopłata, ciepło-zimno, litera X, najbardziej podobny kolor, ' +
                    'podział taśmy, wskazówki zegara, najbliżsi na torze, pole działki, kurier zachłanny — a na koniec wielki finał: teleturniej.',
            },
        ],
    },
    {
        temat: 'Złożoność czasowa',
        prefix: 'zc-',
        plik: 'c++_logika/zlozonosc-czasowa.html',
        pliki: ['zlozonosc-cwiczenia-1.js', 'zlozonosc-cwiczenia-2.js', 'zlozonosc-cwiczenia-3.js', 'zlozonosc-baza.js'],
        note: 'Lekcja o złożoności czasowej od podstaw: liczenie obrotów pętli (od a do b, co k, pętle po kolei i w środku), pętla w pętli i trójkąty, ' +
            'pętle, które dzielą (logarytm, zgadywanie liczby, szybkie potęgowanie), notacja O i ukryte koszty, reguła 10⁸ operacji na sekundę, ' +
            'ograniczenia z treści i dane z generatora, a potem przyspieszanie: wzory, pętla do pierwiastka, sumy prefiksowe, tablice zliczeń, sito, ' +
            'tablica różnic, okna, sortowanie z lower_bound, dwa wskaźniki i wyszukiwanie binarne po odpowiedzi. Sprawdzarka mierzy czas.',
        bazaOpisy: {
            latwe: 'Wzory i krótkie pętle: ramka z płytek, kasy w sklepie, kuranty, turniej pucharowy, domek z kart, liczby powyżej średniej, ' +
                'wynik wolnego programu, żarówki na korytarzu, numerowanie stron i wspólne wielokrotności.',
            srednie: 'Przygotuj raz i szukaj szybko: k-ta liczba niepodzielna, liczby bliźniacze, liczby z trzema dzielnikami, pary o różnicy k, ' +
                'który okres był cieplejszy, rozkład jazdy, dokładnie k warstw farby, pary z dwóch list, najlepszy fragment i różne czynniki pierwsze.',
            trudne: 'Liczby z dzielnikami 2, 3 i 5, najdłuższy fragment bez powtórzeń, fragmenty o sumie zero, maszyny w fabryce, ' +
                'k-ta liczba tabliczki mnożenia, trójkąty z patyków, dzielniki wszystkich liczb do n — a na koniec wielki finał: wyprzedaż.',
        },
        kroki: [
            {
                nr: 1, kotwica: 'ile-razy', spis: 'Ile razy wykona się pętla?',
                nazwa: 'Krok 1 · Ile razy wykona się pętla?',
                kategoria: 'Złożoność czasowa / krok 1: liczenie obrotów',
                note: 'Obrót jako jednostka pracy, od a do b (b − a + 1), co k, w dół, odejmowanie zamiast dzielenia, pętle po kolei (dodajemy), ' +
                    'if w pętli i liczenie wzorem zamiast licznikiem.',
            },
            {
                nr: 2, kotwica: 'zagniezdzone', spis: 'Pętla w pętli',
                nazwa: 'Krok 2 · Pętla w pętli — obroty się mnożą',
                kategoria: 'Złożoność czasowa / krok 2: pętla w pętli',
                note: 'n · m i n², pary i < j (n(n − 1)/2), schodki i suma Gaussa, trzy pętle i trójki, wewnętrzna pętla o stałej długości.',
            },
            {
                nr: 3, kotwica: 'logarytm', spis: 'Pętle, które dzielą',
                nazwa: 'Krok 3 · Pętle, które dzielą — logarytm',
                kategoria: 'Złożoność czasowa / krok 3: logarytm',
                note: 'Połowienie i podwajanie, log₂ n (2¹⁰ ≈ 10³), cyfry, zgadywanie liczby w ok. 20 pytaniach, szybkie potęgowanie.',
            },
            {
                nr: 4, kotwica: 'notacja-o', spis: 'Notacja O',
                nazwa: 'Krok 4 · Notacja O — jak rośnie praca',
                kategoria: 'Złożoność czasowa / krok 4: notacja O',
                note: 'Dominujący składnik i pomijanie stałych, klasy od O(1) do O(n!), dane × 10, stałe dla małych n, ' +
                    'ukryte koszty: sort, count, erase, s = s + c.',
            },
            {
                nr: 5, kotwica: 'czy-zdazy', spis: 'Czy zdąży?',
                nazwa: 'Krok 5 · Czy zdąży? Ograniczenia i limit czasu',
                kategoria: 'Złożoność czasowa / krok 5: czy zdąży',
                note: '10⁸ operacji na sekundę, tabela ograniczeń, TLE w sprawdzarce, dane z generatora xᵢ = (xᵢ₋₁ · a + b) mod m, ' +
                    'ten sam problem w O(n²) i w O(n).',
            },
            {
                nr: 6, kotwica: 'wzory', spis: 'Wzór i pierwiastek',
                nazwa: 'Krok 6 · Wzór zamiast pętli, pierwiastek zamiast n',
                kategoria: 'Złożoność czasowa / krok 6: wzory i pierwiastek',
                note: 'Suma od a do b, wielokrotności i ich suma, włączanie i wyłączanie, pary o sumie s w O(1), ' +
                    'dzielniki, rozkład i pierwiastek całkowity w O(√n).',
            },
            {
                nr: 7, kotwica: 'prefiksy', spis: 'Policz raz',
                nazwa: 'Krok 7 · Policz raz, korzystaj wiele razy',
                kategoria: 'Złożoność czasowa / krok 7: policz raz',
                note: 'Sumy prefiksowe, tablica zliczeń, sito Eratostenesa, tablica różnic i okno o stałej długości.',
            },
            {
                nr: 8, kotwica: 'binarne', spis: 'Sortuj i szukaj',
                nazwa: 'Krok 8 · Sortuj raz, szukaj szybko',
                kategoria: 'Złożoność czasowa / krok 8: sortuj i szukaj',
                note: 'lower_bound i upper_bound w O(log n), liczby w przedziale, dwa wskaźniki (para o sumie k, okno o sumie ≤ S) ' +
                    'i wyszukiwanie binarne po odpowiedzi.',
            },
            {
                nr: 9, kotwica: 'baza', spis: 'Baza zadań', baza: true,
                nazwa: 'Baza zadań — podsumowanie tematu',
                kategoria: 'Złożoność czasowa / baza zadań',
                note: 'Zadania na cały temat, od najłatwiejszego do najtrudniejszego: kuranty, turniej pucharowy, żarówki, który okres był cieplejszy, rozkład jazdy, ' +
                    'pary z dwóch list, maszyny w fabryce, fragmenty o sumie zero, trójkąty z patyków — a na koniec wielki finał: wyprzedaż.',
            },
        ],
    },
];

module.exports = { SITE, KATEGORIA, LEKCJE };
