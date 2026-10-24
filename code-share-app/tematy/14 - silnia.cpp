// ============================================================
//  TUTORIAL: SILNIA (n!) W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Silnia liczby n (zapisywana jako n!) to iloczyn wszystkich
// liczb calkowitych dodatnich od 1 do n:
//   n! = 1 * 2 * 3 * ... * (n-1) * n
// Dodatkowo z definicji przyjmuje sie, ze 0! = 1.
//
// Przyklady: 5! = 1*2*3*4*5 = 120, 3! = 1*2*3 = 6.
//
// Silnia rosnie BARDZO SZYBKO (to tzw. wzrost superwykladniczy) -
// juz 13! przekracza zakres typu int, a 21! przekracza zakres
// typu long long, wiec trzeba uwazac na przepelnienie (overflow).

#include <iostream>
using namespace std;

// --------------------------------------------------------
// 1) silnia liczona ITERACYJNIE (petla)
// --------------------------------------------------------
// Najprostszy sposob: zaczynamy od wyniku = 1 i mnozymy go po
// kolei przez kazda liczbe od 1 do n.

long long silniaIteracyjnie(int n) {
    long long wynik = 1;
    for (int i = 1; i <= n; i++) {
        wynik *= i;
    }
    return wynik;
}

// --------------------------------------------------------
// 2) silnia liczona REKURENCYJNIE (funkcja wywoluje sama siebie)
// --------------------------------------------------------
// Silnie mozna zdefiniowac tez "samą przez siebie":
//   n! = n * (n-1)!      dla n > 0
//   0! = 1                (przypadek bazowy - tu rekurencja sie zatrzymuje)
//
// Ta definicja wprost przeklada sie na kod rekurencyjny.

long long silniaRekurencyjnie(int n) {
    if (n <= 1) {
        return 1; // przypadek bazowy: 0! = 1! = 1
    }
    return n * silniaRekurencyjnie(n - 1);
}

int main() {

    // --------------------------------------------------------
    // 3) obliczanie silni krok po kroku - podglad dzialania
    // --------------------------------------------------------

    int liczba = 5;
    long long wynik = 1;

    cout << "Obliczanie " << liczba << "! krok po kroku:" << endl;
    for (int i = 1; i <= liczba; i++) {
        wynik *= i;
        cout << "Po pomnozeniu przez " << i << ": wynik = " << wynik << endl;
    }
    cout << liczba << "! = " << wynik << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) porownanie wersji iteracyjnej i rekurencyjnej
    // --------------------------------------------------------

    cout << "silniaIteracyjnie(6)   = " << silniaIteracyjnie(6) << endl;
    cout << "silniaRekurencyjnie(6) = " << silniaRekurencyjnie(6) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) przypadek szczegolny: 0! = 1
    // --------------------------------------------------------
    // To czesty blad poczatkujacych - wydaje sie, ze silnia z zera
    // powinna wynosic 0, ale z definicji matematycznej 0! = 1
    // (jest to "iloczyn pusty", czyli iloczyn zera czynnikow).

    cout << "0! = " << silniaIteracyjnie(0) << endl;
    cout << "1! = " << silniaIteracyjnie(1) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) jak szybko rosnie silnia - i problem przepelnienia
    // --------------------------------------------------------
    // Silnia rosnie ekstremalnie szybko. Nawet uzywajac long long
    // (ktory pomiesci liczby do okolo 9.2 * 10^18), silnia
    // "wychodzi poza zakres" juz dla stosunkowo malych n.

    cout << "Jak szybko rosnie silnia:" << endl;
    for (int i = 1; i <= 20; i++) {
        cout << i << "! = " << silniaIteracyjnie(i) << endl;
    }
    cout << "Uwaga: 21! juz nie zmiesci sie poprawnie w long long (nastapi przepelnienie)!" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 7) praktyczny przyklad: liczba permutacji
    // --------------------------------------------------------
    // Jedno z najczestszych zastosowan silni: liczba mozliwych
    // sposobow ustawienia n roznych elementow w rzedzie (permutacji)
    // wynosi dokladnie n!.

    cout << "Podaj liczbe elementow do ustawienia w rzedzie: ";
    int n;
    cin >> n;

    if (n < 0) {
        cout << "Silnia nie jest zdefiniowana dla liczb ujemnych." << endl;
    } else if (n > 20) {
        cout << "Dla n > 20 wynik przekroczylby zakres long long - potrzebna byłaby specjalna" << endl;
        cout << "reprezentacja duzych liczb (np. tablica cyfr albo biblioteka do duzych liczb)." << endl;
    } else {
        cout << "Liczba mozliwych ustawien " << n << " elementow to " << n << "! = "
             << silniaIteracyjnie(n) << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "n! = 1 * 2 * 3 * ... * n,   przy czym z definicji 0! = 1" << endl;
    cout << "Wersja iteracyjna: petla mnozaca wynik przez kolejne liczby od 1 do n" << endl;
    cout << "Wersja rekurencyjna: n! = n * (n-1)!, z przypadkiem bazowym 0! = 1" << endl;
    cout << "Silnia rosnie bardzo szybko - dla n > 20 trzeba uwazac na przepelnienie typu" << endl;
    cout << "(nawet long long juz sobie nie poradzi, potrzebne sa duze liczby)" << endl;
    cout << "Typowe zastosowanie: liczba permutacji n roznych elementow, wzory kombinatoryczne" << endl;


    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: silnia
    // --------------------------------------------------------
    // 1. Napisz funkcje, ktora liczy silnie iteracyjnie bez uzycia zmiennej pomocniczej "wynik" spoza petli.
    // 2. Napisz funkcje rekurencyjna liczaca silnie z dodatkowym licznikiem wywolan rekurencyjnych.
    // 3. Policz, ile cyfr ma wynik n! dla podanego n (bez wypisywania calej liczby, jesli sie nie miesci w long long).
    // 4. Napisz program obliczajacy silnie dla kilku liczb podanych w jednej linii.
    // 5. Sprawdz i wypisz najmniejsze n, dla ktorego n! przekracza podana przez uzytkownika wartosc.
    // 6. Napisz funkcje liczaca "silnie podwojna" n!! (iloczyn co drugiej liczby, np. 7!! = 7*5*3*1).
    // 7. Oblicz wartosc symbolu Newtona (n nad k) korzystajac z funkcji silnia: n! / (k! * (n-k)!).
    // 8. Napisz program, ktory dla podanego n wypisuje wszystkie silnie od 1! do n! w jednej tabeli.
    // 9. Zmodyfikuj program tak, aby wykrywal probe obliczenia silni z liczby ujemnej i wypisywal komunikat o bledzie.
    // 10. Napisz funkcje liczaca sume cyfr wyniku n! (np. dla 5! = 120, suma cyfr = 1+2+0 = 3).
    // 11. Sprawdz, ile zer znajduje sie na koncu liczby n! (podpowiedz: policz, ile razy 5 wystepuje w rozkladzie 1..n).
    // 12. Zaimplementuj silnie z uzyciem petli while zamiast for.
    // 13. Napisz program obliczajacy liczbe permutacji k-elementowych z n-elementowego zbioru: n! / (n-k)!.
    // 14. Porownaj czas dzialania wersji iteracyjnej i rekurencyjnej dla duzego n (uzyj <chrono>).
    // 15. Napisz funkcje sprawdzajaca, czy podana liczba jest silnia jakiejs liczby calkowitej (np. 120 = 5!).
    // 16. Zaimplementuj silnie za pomoca petli "do-while".
    // 17. Napisz program, ktory dla n > 20 wypisuje ostrzezenie o mozliwym przepelnieniu zamiast liczyc wynik.
    // 18. Oblicz sume szeregu 1! + 2! + 3! + ... + n! dla podanego n.
    // 19. Napisz funkcje rekurencyjna z pamiecia podrecznych wynikow (memoizacja) dla silni.
    // 20. Zaimplementuj wlasna, prosta klase/reprezentacje "duzej liczby" (np. jako vector<int> cyfr) i policz na niej 25!.

    return 0;
}