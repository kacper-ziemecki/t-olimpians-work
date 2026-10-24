// ============================================================
//  TUTORIAL: pair W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// pair to "pudelko na DWIE wartosci naraz", ktore moga byc
// ROZNYCH typow. Przydaje sie, gdy dwie rzeczy zawsze "chodza
// razem", np. imie i wiek, wspolrzedne (x, y), nazwa i cena.
//
// Zeby uzywac pair, trzeba dolaczyc naglowek <utility>
// (czesto dziala tez bez niego, bo <iostream> go czasem
// dolacza posrednio, ale dobra praktyka to dolaczyc go samemu).

#include <iostream>
#include <string>
#include <utility>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) tworzenie pary i dostep do jej elementow
    // --------------------------------------------------------
    // Skladnia:
    //   pair<typ1, typ2> nazwa = {wartosc1, wartosc2};
    //
    // Dostep do elementow:
    //   nazwa.first   -> pierwsza wartosc (typu typ1)
    //   nazwa.second  -> druga wartosc (typu typ2)

    pair<string, int> osoba = {"Kacper", 17};

    cout << "Imie: " << osoba.first << endl;
    cout << "Wiek: " << osoba.second << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) para z dwoch wartosci TEGO SAMEGO typu
    // --------------------------------------------------------
    // Bardzo czesty przypadek: wspolrzedne punktu (x, y).

    pair<int, int> punkt = {3, 7};
    cout << "Punkt: (" << punkt.first << ", " << punkt.second << ")" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) zmiana wartosci w parze
    // --------------------------------------------------------
    // .first i .second mozna nadpisywac tak jak zwykle zmienne.

    punkt.first = 10;
    punkt.second = 20;
    cout << "Punkt po zmianie: (" << punkt.first << ", " << punkt.second << ")" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) tworzenie pary funkcja make_pair()
    // --------------------------------------------------------
    // Alternatywny, rownowazny sposob tworzenia pary - czasem
    // wygodniejszy, bo C++ sam odgadnie typy.

    pair<string, float> produkt = make_pair("Chleb", 4.50f);
    cout << produkt.first << " kosztuje " << produkt.second << " zl" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) wczytywanie pary od uzytkownika
    // --------------------------------------------------------

    pair<string, int> uczen;

    cout << "Podaj imie ucznia: ";
    cin >> uczen.first;

    cout << "Podaj jego wynik z testu: ";
    cin >> uczen.second;

    cout << uczen.first << " zdobyl(a) " << uczen.second << " punktow." << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) tablica par - wiele par naraz
    // --------------------------------------------------------
    // Tak jak zwykla tablica, tylko kazdy element jest para
    // dwoch wartosci - bardzo przydatne np. do przechowywania
    // listy "imie + wynik".

    pair<string, int> wyniki[3];
    wyniki[0] = {"Ania", 90};
    wyniki[1] = {"Bartek", 75};
    wyniki[2] = {"Celina", 82};

    cout << "Wszystkie wyniki:" << endl;
    for (int i = 0; i < 3; i++) {
        cout << wyniki[i].first << " -> " << wyniki[i].second << " punktow" << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 7) szukanie najlepszego wyniku w tablicy par
    // --------------------------------------------------------
    // Typowy wzorzec: przejdz po tablicy par i znajdz te z
    // najwieksza/najmniejsza wartoscia .second.

    int indeksNajlepszego = 0;
    for (int i = 1; i < 3; i++) {
        if (wyniki[i].second > wyniki[indeksNajlepszego].second) {
            indeksNajlepszego = i;
        }
    }

    cout << "Najlepszy wynik ma " << wyniki[indeksNajlepszego].first
         << " (" << wyniki[indeksNajlepszego].second << " punktow)" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 8) porownywanie par (==, <)
    // --------------------------------------------------------
    // Pary mozna porownywac bezposrednio - .first ma wiekszy
    // priorytet niz .second (dokladnie tak, jak porownuje sie
    // slowa w slowniku: najpierw pierwsza litera, a dopiero
    // przy remisie kolejna).

    pair<int, int> a = {1, 5};
    pair<int, int> b = {1, 8};
    pair<int, int> c = {2, 0};

    cout << "a < b: " << (a < b) << " (bo .first rowne, porownuje .second: 5 < 8)" << endl;
    cout << "a < c: " << (a < c) << " (bo .first: 1 < 2)" << endl;
    cout << "a == a: " << (a == a) << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "pair<typ1, typ2> p = {w1, w2};  -> tworzy pare dwoch wartosci" << endl;
    cout << "p.first / p.second              -> dostep do pierwszej / drugiej wartosci" << endl;
    cout << "make_pair(w1, w2)                -> alternatywny sposob tworzenia pary" << endl;
    cout << "pair<typ1, typ2> tablica[n];     -> tablica wielu par naraz" << endl;
    cout << "p1 < p2, p1 == p2                -> porownywanie par (najpierw .first, potem .second)" << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: pair
    // --------------------------------------------------------
    // 1. Napisz program przechowujący listę produktów jako pary (nazwa, cena) i wypisujący najdroższy produkt.
    // 2. Zaimplementuj sortowanie tablicy par (imię, wynik) według wyniku malejąco (ręcznie, bubble/selection sort).
    // 3. Napisz program wczytujący n par współrzędnych (x, y) i obliczający, która para punktów jest najbliżej początku układu współrzędnych.
    // 4. Zbuduj system rankingowy: wczytaj pary (zawodnik, punkty) i wypisz podium (trzy najlepsze wyniki).
    // 5. Napisz program zamieniający miejscami .first i .second w parze (swap wartości).
    // 6. Zaimplementuj wyszukiwanie w tablicy par elementu o podanym .first i wypisanie odpowiadającego mu .second.
    // 7. Napisz program obliczający odległość euklidesową między dwoma punktami reprezentowanymi jako pair<float, float>.
    // 8. Zbuduj tablicę par (dzień tygodnia, temperatura) i znajdź dzień z najwyższą temperaturą.
    // 9. Napisz program grupujący pary według wartości .first (np. zliczanie, ile osób ma dany wiek jako .first).
    // 10. Zaimplementuj porównywanie dwóch tablic par pod kątem tego, czy zawierają dokładnie te same pary (niezależnie od kolejności).
    // 11. Napisz program wczytujący pary (nazwa przedmiotu, waga) i obliczający sumaryczną wagę plecaka.
    // 12. Zbuduj system par (imię, ocena) i wypisz wszystkich uczniów z oceną powyżej średniej.
    // 13. Napisz program tworzący parę pair<int,int> reprezentującą minimum i maksimum z podanej tablicy liczb.
    // 14. Zaimplementuj zamianę dwóch osobnych tablic (imiona[], wieki[]) na jedną tablicę par.
    // 15. Napisz program sprawdzający kolizje punktów - czy w tablicy par (x, y) występują dwa identyczne punkty.
    // 16. Zbuduj kalendarz spotkań jako tablicę par (godzina, opis) i wypisz je posortowane po godzinie (ręcznie).
    // 17. Napisz program obliczający pole prostokąta na podstawie pary (szerokość, wysokość).
    // 18. Zaimplementuj strukturę mapującą litery na ich liczbę wystąpień jako tablicę par (char, int) budowaną ręcznie.
    // 19. Napisz program wczytujący n par (produkt, ilość) i wypisujący produkt zamówiony w największej ilości.
    // 20. Zbuduj prostą grę "memory" (2 karty) - reprezentuj parę odkrytych kart jako pair<int,int> i sprawdź, czy się zgadzają.

    return 0;
}