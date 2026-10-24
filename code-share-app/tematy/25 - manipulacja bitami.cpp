// ============================================================
//  TUTORIAL: MANIPULACJA BITAMI W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Kazda liczba calkowita w komputerze jest w rzeczywistosci
// ciagiem BITOW - zer i jedynek, np. liczba 5 to w zapisie
// binarnym 101. Operatory bitowe pozwalaja pracowac bezposrednio
// na tych pojedynczych bitach, co jest bardzo szybkie i przydaje
// sie np. do przechowywania zestawow "wlaczone/wylaczone" (flag),
// szybkiego mnozenia/dzielenia przez potegi 2, czy klasycznych
// problemow olimpijskich (np. reprezentowanie podzbiorow).

#include <iostream>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) operator AND (&) - bitowe "i"
    // --------------------------------------------------------
    // Wynikowy bit jest 1 TYLKO wtedy, gdy OBA bity sa 1.
    //   5  = 101
    //   3  = 011
    //   5&3= 001  -> 1

    int a = 5, b = 3;
    cout << "5 & 3 = " << (a & b) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) operator OR (|) - bitowe "lub"
    // --------------------------------------------------------
    // Wynikowy bit jest 1, gdy PRZYNAJMNIEJ JEDEN z bitow jest 1.
    //   5  = 101
    //   3  = 011
    //   5|3= 111  -> 7

    cout << "5 | 3 = " << (a | b) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) operator XOR (^) - "albo, albo" (rozne bity)
    // --------------------------------------------------------
    // Wynikowy bit jest 1, gdy bity SA ROZNE (jeden 0, drugi 1).
    //   5  = 101
    //   3  = 011
    //   5^3= 110  -> 6
    //
    // Ciekawostka: x ^ x zawsze daje 0, a x ^ 0 zawsze daje x.

    cout << "5 ^ 3 = " << (a ^ b) << endl;
    cout << "5 ^ 5 = " << (a ^ a) << endl; // zawsze 0

    cout << endl;


    // --------------------------------------------------------
    // 4) operator NOT (~) - negacja bitowa
    // --------------------------------------------------------
    // Odwraca KAZDY bit liczby (0 zamienia na 1, i odwrotnie).
    // Dla typu int daje to dosc "dziwny" wynik liczbowy, bo
    // odwracane sa wszystkie 32 bity, wlacznie z bitem znaku.

    cout << "~5 = " << (~a) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) przesuniecie bitowe w lewo (<<) i w prawo (>>)
    // --------------------------------------------------------
    // x << n  ->  przesuwa bity liczby x o n miejsc w lewo,
    //             co odpowiada POMNOZENIU przez 2^n
    // x >> n  ->  przesuwa bity liczby x o n miejsc w prawo,
    //             co odpowiada (calkowitoliczbowemu) PODZIELENIU
    //             przez 2^n

    int liczba = 3;
    cout << "3 << 1 = " << (liczba << 1) << endl; // 3 * 2 = 6
    cout << "3 << 2 = " << (liczba << 2) << endl; // 3 * 4 = 12
    cout << "20 >> 2 = " << (20 >> 2) << endl;      // 20 / 4 = 5

    cout << endl;


    // --------------------------------------------------------
    // 6) sprawdzanie konkretnego bitu
    // --------------------------------------------------------
    // Zeby sprawdzic, czy n-ty bit liczby jest ustawiony (rowny 1),
    // przesuwamy 1 o n miejsc w lewo, a nastepnie robimy AND
    // z nasza liczba. Jesli wynik jest rozny od 0, ten bit byl
    // ustawiony.

    cout << "Podaj liczbe calkowita: ";
    int x;
    cin >> x;

    cout << "Podaj numer bitu do sprawdzenia (0 = najmlodszy bit): ";
    int nrBitu;
    cin >> nrBitu;

    if (x & (1 << nrBitu)) {
        cout << "Bit numer " << nrBitu << " jest ustawiony (1)." << endl;
    } else {
        cout << "Bit numer " << nrBitu << " jest wyzerowany (0)." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 7) ustawianie i zerowanie konkretnego bitu
    // --------------------------------------------------------
    //   x | (1 << n)    -> USTAWIA n-ty bit na 1 (reszta bez zmian)
    //   x & ~(1 << n)   -> ZERUJE n-ty bit (reszta bez zmian)

    int wartosc = 0; // 0000 w zapisie binarnym
    wartosc = wartosc | (1 << 2); // ustawiamy bit nr 2 -> 0100 = 4
    cout << "Po ustawieniu bitu nr 2: " << wartosc << endl;

    wartosc = wartosc | (1 << 0); // ustawiamy bit nr 0 -> 0101 = 5
    cout << "Po ustawieniu bitu nr 0: " << wartosc << endl;

    wartosc = wartosc & ~(1 << 2); // zerujemy bit nr 2 -> 0001 = 1
    cout << "Po wyzerowaniu bitu nr 2: " << wartosc << endl;

    cout << endl;


    // --------------------------------------------------------
    // 8) zliczanie liczby jedynek w zapisie binarnym
    // --------------------------------------------------------
    // Prosty i klasyczny algorytm: dopoki liczba jest wieksza od
    // zera, sprawdzamy jej ostatni bit (x & 1), po czym przesuwamy
    // liczbe w prawo o 1, zeby przejsc do kolejnego bitu.

    cout << "Podaj liczbe, dla ktorej policzymy jedynki w zapisie binarnym: ";
    int y;
    cin >> y;

    int liczbaJedynek = 0;
    int kopiaY = y;
    while (kopiaY > 0) {
        if (kopiaY & 1) {
            liczbaJedynek++;
        }
        kopiaY = kopiaY >> 1;
    }

    cout << "Liczba " << y << " ma w zapisie binarnym " << liczbaJedynek << " jedynek." << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "&   -> AND (bitowe 'i')                    |   -> OR (bitowe 'lub')" << endl;
    cout << "^   -> XOR (bity rozne)                     ~   -> NOT (negacja wszystkich bitow)" << endl;
    cout << "<<  -> przesuniecie w lewo (mnozenie *2^n)   >>  -> przesuniecie w prawo (dzielenie /2^n)" << endl;
    cout << "x & (1 << n)   -> sprawdzenie n-tego bitu" << endl;
    cout << "x | (1 << n)   -> ustawienie n-tego bitu na 1" << endl;
    cout << "x & ~(1 << n)  -> wyzerowanie n-tego bitu" << endl;


    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: manipulacja bitami
    // --------------------------------------------------------
    // 1. Napisz funkcje sprawdzajaca, czy podana liczba jest potega dwojki, korzystajac z operacji bitowych.
    // 2. Napisz funkcje zliczajaca liczbe jedynek w zapisie binarnym liczby bez uzycia petli (przy uzyciu wbudowanej __builtin_popcount).
    // 3. Zaimplementuj zamiane dwoch liczb miejscami bez uzycia zmiennej pomocniczej, korzystajac z operatora XOR.
    // 4. Napisz funkcje sprawdzajaca, czy dwie liczby maja taka sama parzystosc (bez uzycia %).
    // 5. Zaimplementuj generowanie wszystkich podzbiorow zbioru n-elementowego za pomoca reprezentacji bitowej liczb od 0 do 2^n - 1.
    // 6. Napisz funkcje zwracajaca liczbe z odwroconymi wszystkimi bitami w zadanym zakresie (np. tylko 8 najmlodszych bitow).
    // 7. Zaimplementuj szybkie mnozenie i dzielenie przez potegi dwojki za pomoca przesuniec bitowych.
    // 8. Napisz funkcje znajdujaca najmlodszy ustawiony bit liczby (najmniej znaczacy bit rowny 1).
    // 9. Zaimplementuj algorytm zamiany liczby dziesietnej na binarna (w postaci stringa) za pomoca operacji bitowych.
    // 10. Napisz funkcje sprawdzajaca, czy dwie liczby roznia sie dokladnie na jednym bicie.
    // 11. Zaimplementuj funkcje liczaca, ile bitow trzeba zmienic, zeby przeksztalcic jedna liczbe w druga (odleglosc Hamminga).
    // 12. Napisz program wypisujacy wszystkie liczby z zakresu 1..n, ktore maja parzysta liczbe jedynek w zapisie binarnym.
    // 13. Zaimplementuj maske bitowa do przechowywania informacji o kilku flagach (np. czy uzytkownik jest adminem, zbanowany, zweryfikowany) w jednej liczbie int.
    // 14. Napisz funkcje sprawdzajaca, czy liczba jest palindromem w zapisie binarnym.
    // 15. Zaimplementuj mnozenie dwoch liczb metoda "rosyjskiego chlopa" wykorzystujac przesuniecia bitowe.
    // 16. Napisz funkcje zwracajaca najwiekszy ustawiony bit liczby (najbardziej znaczaca jedynke).
    // 17. Zaimplementuj funkcje zliczajaca, ile liczb w podanym zakresie ma dokladnie k jedynek w zapisie binarnym.
    // 18. Napisz program symulujacy proste "przelaczniki" (np. panel sterowania swiatlami) przy uzyciu operacji bitowych na jednej liczbie int.
    // 19. Zaimplementuj funkcje sprawdzajaca, czy w zapisie binarnym liczby wystepuja dwa sasiadujace bity rowne 1.
    // 20. Napisz program generujacy kod Graya dla podanej liczby bitow, korzystajac z operacji XOR.

    return 0;
}