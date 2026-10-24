// ============================================================
//  TUTORIAL: WSKAZNIKI (pointers) W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Kazda zmienna w programie jest gdzies zapisana w pamieci
// komputera, pod jakims ADRESEM. Wskaznik (pointer) to zmienna,
// ktora NIE PRZECHOWUJE zwyklej wartosci (np. liczby), tylko
// ADRES innej zmiennej w pamieci. To pozwala m.in. modyfikowac
// zmienne "z zewnatrz", pracowac z dynamicznie tworzona pamiecia
// oraz jest podstawa dzialania struktur takich jak listy
// jednokierunkowe czy drzewa.

#include <iostream>
#include <string>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) adres zmiennej - operator &
    // --------------------------------------------------------
    // Operator & (przed nazwa zmiennej) zwraca ADRES tej zmiennej
    // w pamieci - miejsce, w ktorym jest ona przechowywana.

    int liczba = 42;
    cout << "Wartosc liczby: " << liczba << endl;
    cout << "Adres liczby w pamieci: " << &liczba << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) deklaracja wskaznika i przypisanie adresu
    // --------------------------------------------------------
    // Skladnia:
    //   typ *nazwaWskaznika = &zmienna;
    //
    // Gwiazdka "*" przy deklaracji oznacza "to jest wskaznik na
    // wartosc typu 'typ'". Wskaznik musi wskazywac na zmienna
    // TEGO SAMEGO TYPU, co on sam.

    int *wsk = &liczba;

    cout << "wsk przechowuje adres: " << wsk << endl;
    cout << "Ten adres jest taki sam jak &liczba: " << (wsk == &liczba) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) dereferencja - operator * przy uzyciu wskaznika
    // --------------------------------------------------------
    // Gwiazdka "*" uzyta przy JUZ ISTNIEJACYM wskazniku (nie przy
    // deklaracji) oznacza "wartosc pod adresem, na ktory wskazuje".
    // To sie nazywa DEREFERENCJA.

    cout << "Wartosc pod adresem wskazywanym przez wsk: " << *wsk << endl;

    // co wazne - mozemy przez wskaznik ZMIENIC oryginalna zmienna!
    *wsk = 100;
    cout << "Po '*wsk = 100', wartosc liczby to teraz: " << liczba << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) wskazniki a funkcje - modyfikacja "z zewnatrz"
    // --------------------------------------------------------
    // Zanim poznales referencje (&) w temacie o funkcjach, to
    // wlasnie wskazniki byly klasycznym sposobem, zeby funkcja
    // mogla zmienic zmienna z zewnatrz. Funkcja dostaje ADRES
    // zmiennej i modyfikuje wartosc pod tym adresem.

    // (funkcja zdefiniowana ponizej jako lambda dla wygody)
    auto podwojPrzezWskaznik = [](int *w) {
        *w = *w * 2;
    };

    int x = 7;
    cout << "x przed: " << x << endl;
    podwojPrzezWskaznik(&x); // przekazujemy ADRES zmiennej x
    cout << "x po podwojeniu przez wskaznik: " << x << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) wskaznik pusty - nullptr
    // --------------------------------------------------------
    // Wskaznik, ktory "na nic nie wskazuje", powinien miec
    // wartosc nullptr. Zawsze warto sprawdzic, czy wskaznik nie
    // jest pusty, zanim sprobujemy go dereferencjonowac (uzyc *) -
    // dereferencja nullptr to powazny blad, ktory wywala program!

    int *pustyWskaznik = nullptr;

    if (pustyWskaznik == nullptr) {
        cout << "pustyWskaznik nie wskazuje na nic." << endl;
    }

    // pustyWskaznik = &liczba; // dopiero teraz moglibysmy go bezpiecznie dereferencjonowac

    cout << endl;


    // --------------------------------------------------------
    // 6) dynamiczna alokacja pamieci - new i delete
    // --------------------------------------------------------
    // Czasem chcemy stworzyc zmienna, ktora NIE znika automatycznie
    // po wyjsciu z bloku kodu (np. z funkcji), tylko istnieje,
    // dopoki sami jej nie usuniemy. Do tego sluzy "new" - tworzy
    // nowa wartosc w pamieci i zwraca do niej wskaznik.
    //
    // WAZNE: kazde "new" MUSI miec odpowiadajace mu "delete",
    // inaczej pamiec zostanie "wyciekniete" (nigdy nie zwolniona)!

    int *dynamicznaLiczba = new int; // rezerwujemy miejsce na jedna liczbe
    *dynamicznaLiczba = 55;

    cout << "Dynamicznie utworzona liczba: " << *dynamicznaLiczba << endl;

    delete dynamicznaLiczba; // zwalniamy pamiec, gdy juz jej nie potrzebujemy
    dynamicznaLiczba = nullptr; // dobra praktyka: po delete ustawiamy na nullptr

    cout << endl;


    // --------------------------------------------------------
    // 7) dynamiczna tablica - new[] i delete[]
    // --------------------------------------------------------
    // Podobnie mozna dynamicznie stworzyc CALA TABLICE, ktorej
    // rozmiar poznamy dopiero w trakcie dzialania programu
    // (np. wpisany przez uzytkownika). Do usuwania takiej tablicy
    // uzywamy delete[] (z nawiasami kwadratowymi!), a nie zwyklego
    // delete.

    cout << "Podaj rozmiar tablicy, ktora chcesz stworzyc: ";
    int rozmiar;
    cin >> rozmiar;

    int *tablica = new int[rozmiar];

    cout << "Podaj " << rozmiar << " liczb:" << endl;
    for (int i = 0; i < rozmiar; i++) {
        cin >> tablica[i]; // do elementow dynamicznej tablicy dostajemy sie tak jak w zwyklej
    }

    int suma = 0;
    for (int i = 0; i < rozmiar; i++) {
        suma += tablica[i];
    }
    cout << "Suma podanych liczb: " << suma << endl;

    delete[] tablica; // WAZNE: delete[] dla tablicy, nie samo delete
    tablica = nullptr;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "&zmienna              -> zwraca adres zmiennej w pamieci" << endl;
    cout << "typ *wsk = &zmienna;  -> deklaracja wskaznika, przypisanie adresu" << endl;
    cout << "*wsk                  -> dereferencja - wartosc pod adresem (mozna tez zmieniac przez *wsk = ...)" << endl;
    cout << "nullptr                -> 'pusty' wskaznik, ktory na nic nie wskazuje" << endl;
    cout << "new typ                -> dynamicznie tworzy zmienna, zwraca do niej wskaznik" << endl;
    cout << "delete wsk;             -> zwalnia pamiec utworzona przez 'new'" << endl;
    cout << "new typ[n] / delete[] w -> to samo, ale dla dynamicznej tablicy o n elementach" << endl;

    return 0;
}