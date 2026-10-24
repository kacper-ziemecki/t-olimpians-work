// ============================================================
//  TUTORIAL: PETLA while W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Petla while powtarza kod W KOLKO, dopoki warunek jest
// prawdziwy (true). Gdy warunek stanie sie falszywy (false),
// petla sie konczy i program idzie dalej.
//
// Skladnia:
//   while (warunek) {
//       kod, ktory powtarza sie, dopoki warunek jest true
//   }

#include <iostream>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) najprostsza petla while - liczenie od 1 do 5
    // --------------------------------------------------------
    // Kazda petla while potrzebuje 3 rzeczy:
    //   a) zmienna startowa (przed petla)
    //   b) warunek (sprawdzany przed kazdym przebiegiem)
    //   c) zmiana zmiennej WEWNATRZ petli (inaczej petla nigdy
    //      sie nie skonczy - tzw. "nieskonczona petla")

    int i = 1;              // a) zmienna startowa
    while (i <= 5) {        // b) warunek: powtarzaj, dopoki i <= 5
        cout << "i = " << i << endl;
        i = i + 1;           // c) zmiana zmiennej - BARDZO WAZNE!
    }
    cout << "Petla sie skonczyla, i = " << i << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) UWAGA: petla nieskonczona (bledna, tylko do zrozumienia)
    // --------------------------------------------------------
    // Gdyby w powyzszej petli zabraklo linijki "i = i + 1;",
    // warunek i <= 5 bylby zawsze prawdziwy i program NIGDY by
    // sie nie zatrzymal. Ten fragment jest CELOWO zakomentowany -
    // nie odkomentowuj go, bo program sie "zawiesi":
    //
    //   int j = 1;
    //   while (j <= 5) {
    //       cout << j << endl;
    //       // brak zmiany j -> petla nieskonczona!
    //   }

    cout << endl;


    // --------------------------------------------------------
    // 3) odliczanie w dol
    // --------------------------------------------------------

    int start = 5;
    while (start >= 1) {
        cout << start << "...";
        start = start - 1;
    }
    cout << " START!" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) suma liczb od 1 do n (wczytanego od uzytkownika)
    // --------------------------------------------------------

    cout << "Podaj liczbe n: ";
    int n;
    cin >> n;

    int suma = 0;
    int licznik = 1;
    while (licznik <= n) {
        suma = suma + licznik;
        licznik = licznik + 1;
    }
    cout << "Suma liczb od 1 do " << n << " wynosi: " << suma << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) while sterowane danymi od uzytkownika (petla "dopoki")
    // --------------------------------------------------------
    // while jest bardzo przydatne, gdy NIE WIEMY z gory, ile razy
    // petla ma sie wykonac - np. dopoki uzytkownik nie wpisze 0.

    cout << "Podawaj liczby (wpisz 0, zeby zakonczyc):" << endl;
    int wpisanaLiczba;
    int sumaWpisanych = 0;
    int ileWpisanych = 0;

    cin >> wpisanaLiczba;
    while (wpisanaLiczba != 0) {
        sumaWpisanych = sumaWpisanych + wpisanaLiczba;
        ileWpisanych = ileWpisanych + 1;
        cin >> wpisanaLiczba; // wczytanie kolejnej liczby NA KONCU petli
    }

    cout << "Podales " << ileWpisanych << " liczb, ich suma to " << sumaWpisanych << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) do-while - jak while, ale sprawdza warunek NA KONCU
    // --------------------------------------------------------
    // Roznica: kod w do-while wykona sie ZAWSZE przynajmniej raz,
    // nawet jesli warunek od razu jest falszywy - bo warunek jest
    // sprawdzany dopiero PO wykonaniu tresci petli.
    //
    // Skladnia:
    //   do {
    //       kod
    //   } while (warunek);   <-- tu jest srednik na koncu!

    int liczbaOd1do10;
    do {
        cout << "Podaj liczbe od 1 do 10: ";
        cin >> liczbaOd1do10;
    } while (liczbaOd1do10 < 1 || liczbaOd1do10 > 10);

    cout << "Dziekuje, podales poprawna liczbe: " << liczbaOd1do10 << endl;

    cout << endl;


    // --------------------------------------------------------
    // 7) break - natychmiastowe wyjscie z petli
    // --------------------------------------------------------
    // break od razu przerywa petle, nawet jesli jej warunek
    // wciaz jest prawdziwy.

    int k = 1;
    while (k <= 100) {
        if (k == 4) {
            cout << "Napotkano 4 - przerywam petle przez break!" << endl;
            break; // natychmiast wychodzimy z petli
        }
        cout << "k = " << k << endl;
        k = k + 1;
    }

    cout << endl;


    // --------------------------------------------------------
    // 8) continue - pomija reszte tego przebiegu i idzie do nastepnego
    // --------------------------------------------------------
    // continue nie konczy calej petli - tylko przerywa BIEZACY
    // przebieg i wraca do sprawdzenia warunku petli.

    int m = 0;
    while (m < 10) {
        m = m + 1;
        if (m % 2 == 0) {
            continue; // pomijamy wypisywanie liczb parzystych
        }
        cout << "Liczba nieparzysta: " << m << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "while (warunek) { ... }      -> powtarza kod, dopoki warunek jest true" << endl;
    cout << "do { ... } while (warunek);  -> jak while, ale wykona sie zawsze co najmniej raz" << endl;
    cout << "break;                       -> natychmiast konczy cala petle" << endl;
    cout << "continue;                    -> pomija reszte biezacego przebiegu petli" << endl;
    cout << "PAMIETAJ: zmienna z warunku musi sie zmieniac wewnatrz petli," << endl;
    cout << "inaczej powstanie petla nieskonczona!" << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: pętla while
    // --------------------------------------------------------
    // 1. Napisz program obliczający silnię (n!) podanej liczby za pomocą pętli while.
    // 2. Zaimplementuj wyznaczanie sumy cyfr podanej liczby przy użyciu pętli while.
    // 3. Napisz program sprawdzający, czy podana liczba jest palindromem, wykorzystując while do odwracania liczby.
    // 4. Zbuduj prosty licznik odwrotny (countdown) od podanej liczby do zera z komunikatem "START!" na końcu.
    // 5. Napisz program wyliczający n-ty wyraz ciągu Fibonacciego przy użyciu pętli while.
    // 6. Zaimplementuj program sumujący liczby wpisywane przez użytkownika, dopóki nie wpisze liczby ujemnej.
    // 7. Napisz program sprawdzający, czy podana liczba jest liczbą pierwszą, wykorzystując while do iteracji po potencjalnych dzielnikach.
    // 8. Zbuduj prostą grę zgadywankę: komputer "myśli" o liczbie (stała w kodzie), a użytkownik zgaduje w pętli do-while, aż trafi.
    // 9. Napisz program obliczający NWD dwóch liczb algorytmem Euklidesa z wykorzystaniem pętli while.
    // 10. Zaimplementuj walidację danych wejściowych: pytaj o wiek w pętli do-while, dopóki użytkownik nie poda liczby z sensownego zakresu (0-120).
    // 11. Napisz program odwracający kolejność cyfr podanej liczby przy użyciu while.
    // 12. Zbuduj symulację prostego bankomatu - w pętli while pytaj o kwotę do wypłaty, dopóki użytkownik nie wpisze 0.
    // 13. Napisz program obliczający, ile cyfr ma podana liczba (przy użyciu while i dzielenia).
    // 14. Zaimplementuj prostą grę "Wisielec" (bez grafiki) - użytkownik ma ograniczoną liczbę prób odgadnięcia litery w pętli while.
    // 15. Napisz program konwertujący liczbę dziesiętną na binarną przy użyciu pętli while i modulo.
    // 16. Zbuduj menu tekstowe z opcjami (1. Dodaj, 2. Odejmij, 3. Wyjście), które działa w pętli, dopóki użytkownik nie wybierze wyjścia.
    // 17. Napisz program sumujący ciąg liczb wpisywanych przez użytkownika, aż suma przekroczy 100.
    // 18. Zaimplementuj algorytm szybkiego potęgowania (a^n) przy użyciu pętli while.
    // 19. Napisz program symulujący "kolejkę" zgłoszeń - użytkownik podaje liczbę zgłoszeń do obsłużenia, program odlicza je w pętli while.
    // 20. Zbuduj program sprawdzający siłę hasła w pętli do-while - pytaj o hasło, dopóki nie spełni wymagań (min. 8 znaków).

    return 0;
}