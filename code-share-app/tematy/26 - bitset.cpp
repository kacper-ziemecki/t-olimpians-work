// ============================================================
//  TUTORIAL: bitset W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// bitset to kontener przechowujacy CIAG BITOW O USTALONYM,
// STALYM ROZMIARZE (podanym w nawiasach ostrych <>). Dziala jak
// tablica zer i jedynek, ale ma wygodne, gotowe operacje bitowe
// i latwo go wypisac w postaci binarnej - bardzo przydatny przy
// zadaniach zwiazanych z manipulacja bitami.
//
// Zeby uzywac bitset, trzeba dolaczyc naglowek <bitset>.

#include <iostream>
#include <bitset>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) tworzenie bitseta z liczby
    // --------------------------------------------------------
    // bitset<N> zawsze ma dokladnie N bitow (rozmiar podajemy
    // w nawiasach ostrych - musi byc znany podczas kompilacji).
    // Mozna go od razu utworzyc z liczby calkowitej - wtedy
    // automatycznie zamienia ja na zapis binarny.

    bitset<8> b1(13); // 13 w zapisie binarnym na 8 bitach to 00001101

    cout << "Liczba 13 jako bitset<8>: " << b1 << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) tworzenie bitseta z napisu (stringa)
    // --------------------------------------------------------
    // Mozna tez utworzyc bitset bezposrednio z napisu zlozonego
    // z '0' i '1'.

    bitset<8> b2("00101010");
    cout << "Bitset utworzony z napisu: " << b2 << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) dostep do pojedynczego bitu przez []
    // --------------------------------------------------------
    // Podobnie jak w tablicy, mozna sprawdzic i ustawic pojedynczy
    // bit przez nawiasy kwadratowe. Indeksowanie zaczyna sie od
    // NAJMLODSZEGO bitu (czyli od prawej strony), indeks 0 to
    // ostatnia cyfra w zapisie binarnym.

    cout << "Bit numer 0 (najmlodszy) w b1: " << b1[0] << endl;
    cout << "Bit numer 2 w b1: " << b1[2] << endl;
    cout << "Bit numer 3 w b1: " << b1[3] << endl;

    b1[1] = 1; // ustawiamy bit numer 1 na 1
    cout << "b1 po ustawieniu bitu nr 1: " << b1 << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) przydatne funkcje: count(), any(), none(), all()
    // --------------------------------------------------------
    //   count() -> zwraca liczbe bitow ustawionych na 1
    //   any()   -> true, jesli JEST przynajmniej jeden bit = 1
    //   none()  -> true, jesli WSZYSTKIE bity sa = 0
    //   all()   -> true, jesli WSZYSTKIE bity sa = 1

    cout << "Liczba jedynek w b1: " << b1.count() << endl;
    cout << "Czy b1 ma jakas jedynke (any)? " << b1.any() << endl;
    cout << "Czy b1 jest cale zerowe (none)? " << b1.none() << endl;
    cout << "Czy b1 ma wszystkie bity ustawione (all)? " << b1.all() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) ustawianie i zerowanie bitow - set(), reset(), flip()
    // --------------------------------------------------------
    //   set()       -> ustawia WSZYSTKIE bity na 1
    //   set(n)      -> ustawia bit numer n na 1
    //   reset()     -> zeruje WSZYSTKIE bity
    //   reset(n)    -> zeruje bit numer n
    //   flip()      -> odwraca WSZYSTKIE bity (0<->1)
    //   flip(n)     -> odwraca bit numer n

    bitset<8> b3;
    cout << "Nowy, pusty bitset<8>: " << b3 << endl;

    b3.set(0);
    b3.set(3);
    b3.set(7);
    cout << "Po ustawieniu bitow 0, 3 i 7: " << b3 << endl;

    b3.reset(3);
    cout << "Po wyzerowaniu bitu 3: " << b3 << endl;

    b3.flip();
    cout << "Po odwroceniu wszystkich bitow: " << b3 << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) operatory bitowe na calych bitsetach
    // --------------------------------------------------------
    // Na bitsetach mozna uzywac tych samych operatorow bitowych,
    // co na liczbach (&, |, ^, ~), ale dzialaja one od razu na
    // WSZYSTKICH bitach naraz.

    bitset<8> x("11001100");
    bitset<8> y("10101010");

    cout << "x        = " << x << endl;
    cout << "y        = " << y << endl;
    cout << "x & y    = " << (x & y) << endl;
    cout << "x | y    = " << (x | y) << endl;
    cout << "x ^ y    = " << (x ^ y) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 7) zamiana bitseta z powrotem na liczbe - to_ulong()
    // --------------------------------------------------------
    // Jesli potrzebujemy z powrotem zwyklej liczby calkowitej,
    // uzywamy to_ulong() (unsigned long) albo to_ullong()
    // (unsigned long long dla wiekszych bitsetow).

    unsigned long liczba = x.to_ulong();
    cout << "x jako zwykla liczba: " << liczba << endl;

    cout << endl;


    // --------------------------------------------------------
    // 8) praktyczny przyklad: zapis binarny liczby od uzytkownika
    // --------------------------------------------------------

    cout << "Podaj liczbe calkowita (0-255): ";
    int wejscie;
    cin >> wejscie;

    bitset<8> zapisBinarny(wejscie);
    cout << wejscie << " w zapisie binarnym na 8 bitach to: " << zapisBinarny << endl;
    cout << "Ta liczba ma " << zapisBinarny.count() << " jedynek." << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "bitset<N> b;              -> N bitow, wszystkie ustawione domyslnie na 0" << endl;
    cout << "bitset<N> b(liczba);      -> tworzy bitset z liczby calkowitej" << endl;
    cout << "bitset<N> b(\"1010\");      -> tworzy bitset z napisu zlozonego z 0 i 1" << endl;
    cout << "b[i]                      -> dostep do bitu numer i (0 = najmlodszy)" << endl;
    cout << "b.count() / any() / none() / all()  -> liczba jedynek / czy sa jedynki / same zera / same jedynki" << endl;
    cout << "b.set(i) / reset(i) / flip(i)        -> ustaw / wyzeruj / odwroc bit numer i" << endl;
    cout << "b.to_ulong()              -> zamiana bitseta z powrotem na liczbe" << endl;

    return 0;
}