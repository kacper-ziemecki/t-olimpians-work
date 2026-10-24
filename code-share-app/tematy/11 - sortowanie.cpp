// ============================================================
//  TUTORIAL: SORTOWANIE W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Sortowanie to ustawianie elementow w kolejnosci - rosnaco
// (od najmniejszego do najwiekszego) albo malejaco (odwrotnie).
//
// W tym tutorialu pokazemy DWA podejscia:
//   1) sortowanie "recznie" - zeby zrozumiec, JAK to dziala,
//   2) gotowa funkcja sort() z <algorithm> - jak sie to robi
//      w praktyce, bez pisania wlasnego algorytmu za kazdym razem.

#include <iostream>
#include <vector>
#include <algorithm> // potrzebne do sort()
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) sortowanie babelkowe (bubble sort) - "na piechote"
    // --------------------------------------------------------
    // Pomysl: przechodzimy wielokrotnie przez tablice i za kazdym
    // razem porownujemy dwa sasiednie elementy. Jesli sa w zlej
    // kolejnosci (lewy wiekszy od prawego), ZAMIENIAMY je miejscami.
    // Powtarzamy to, az nic juz nie trzeba zamieniac - wtedy
    // tablica jest posortowana.
    //
    // Nazwa "babelkowe" bierze sie stad, ze najwieksze elementy
    // "wyplywaja" powoli na koniec, jak babelki w wodzie.

    int tablica[] = {5, 2, 8, 1, 9, 3};
    int rozmiar = 6;

    cout << "Przed sortowaniem: ";
    for (int i = 0; i < rozmiar; i++) cout << tablica[i] << " ";
    cout << endl;

    // zewnetrzna petla - ile razy przejdziemy przez tablice
    for (int i = 0; i < rozmiar - 1; i++) {
        // wewnetrzna petla - porownywanie sasiadow
        for (int j = 0; j < rozmiar - 1 - i; j++) {
            if (tablica[j] > tablica[j + 1]) {
                // zamiana miejscami (swap) - przez zmienna pomocnicza
                int pomoc = tablica[j];
                tablica[j] = tablica[j + 1];
                tablica[j + 1] = pomoc;
            }
        }
    }

    cout << "Po sortowaniu (recznie): ";
    for (int i = 0; i < rozmiar; i++) cout << tablica[i] << " ";
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) sortowanie przez wybieranie (selection sort) - inny sposob
    // --------------------------------------------------------
    // Pomysl: w kazdym przebiegu szukamy NAJMNIEJSZEGO elementu
    // w pozostalej czesci tablicy i przestawiamy go na poczatek
    // nieposortowanej czesci.

    int tablica2[] = {7, 3, 9, 0, 4};
    int rozmiar2 = 5;

    for (int i = 0; i < rozmiar2 - 1; i++) {
        int indeksNajmniejszego = i;
        for (int j = i + 1; j < rozmiar2; j++) {
            if (tablica2[j] < tablica2[indeksNajmniejszego]) {
                indeksNajmniejszego = j;
            }
        }
        // zamieniamy znaleziony najmniejszy element z elementem na pozycji i
        int pomoc = tablica2[i];
        tablica2[i] = tablica2[indeksNajmniejszego];
        tablica2[indeksNajmniejszego] = pomoc;
    }

    cout << "Po sortowaniu przez wybieranie: ";
    for (int i = 0; i < rozmiar2; i++) cout << tablica2[i] << " ";
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) gotowa funkcja sort() z <algorithm> - sposob "produkcyjny"
    // --------------------------------------------------------
    // W praktyce prawie nigdy nie pisze sie wlasnego sortowania -
    // uzywa sie gotowej, sprawdzonej i szybkiej funkcji sort().
    //
    // Skladnia dla zwyklej tablicy:
    //   sort(tablica, tablica + rozmiar);
    // (tablica + rozmiar to "adres tuz za ostatnim elementem" -
    // C++ wymaga podania poczatku i konca zakresu do posortowania)

    int tablica3[] = {6, 1, 8, 2, 9, 0, 4};
    int rozmiar3 = 7;

    sort(tablica3, tablica3 + rozmiar3);

    cout << "Posortowana tablica przez sort(): ";
    for (int i = 0; i < rozmiar3; i++) cout << tablica3[i] << " ";
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) sortowanie vectora funkcja sort()
    // --------------------------------------------------------
    // Dla vectora jest jeszcze prosciej - uzywamy .begin() i .end(),
    // ktore oznaczaja "poczatek" i "koniec" vectora.

    vector<int> liczby = {12, 4, 7, 1, 9, 3};

    sort(liczby.begin(), liczby.end());

    cout << "Posortowany vector rosnaco: ";
    for (int x : liczby) cout << x << " ";
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) sortowanie malejaco
    // --------------------------------------------------------
    // Domyslnie sort() sortuje rosnaco. Zeby posortowac malejaco,
    // dodajemy trzeci argument: greater<int>().

    vector<int> liczby2 = {12, 4, 7, 1, 9, 3};
    sort(liczby2.begin(), liczby2.end(), greater<int>());

    cout << "Posortowany vector malejaco: ";
    for (int x : liczby2) cout << x << " ";
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) sortowanie stringow - dziala tak samo!
    // --------------------------------------------------------
    // sort() dziala nie tylko na liczbach - stringi sortowane sa
    // alfabetycznie (dokladnie tak, jak w slowniku).

    vector<string> imiona = {"Zosia", "Bartek", "Ania", "Kacper"};
    sort(imiona.begin(), imiona.end());

    cout << "Imiona posortowane alfabetycznie: ";
    for (string imie : imiona) cout << imie << " ";
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 7) wczytywanie i sortowanie danych od uzytkownika
    // --------------------------------------------------------

    cout << "Ile liczb chcesz podac? ";
    int n;
    cin >> n;

    vector<int> podaneLiczby;
    for (int i = 0; i < n; i++) {
        cout << "Podaj liczbe nr " << (i + 1) << ": ";
        int x;
        cin >> x;
        podaneLiczby.push_back(x);
    }

    sort(podaneLiczby.begin(), podaneLiczby.end());

    cout << "Twoje liczby posortowane rosnaco: ";
    for (int x : podaneLiczby) cout << x << " ";
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "bubble sort / selection sort  -> reczne algorytmy sortowania (dobre do nauki)" << endl;
    cout << "sort(tab, tab + rozmiar);     -> sortowanie zwyklej tablicy rosnaco" << endl;
    cout << "sort(v.begin(), v.end());     -> sortowanie vectora rosnaco" << endl;
    cout << "sort(v.begin(), v.end(), greater<int>()); -> sortowanie malejaco" << endl;
    cout << "sort() dziala tez na stringach -> sortuje alfabetycznie" << endl;
    cout << "W praktyce prawie zawsze uzywa sie sort() z <algorithm>," << endl;
    cout << "a reczne sortowanie pisze sie glownie po to, zeby zrozumiec zasade dzialania." << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: sortowanie
    // --------------------------------------------------------
    // 1. Zaimplementuj sortowanie przez wstawianie (insertion sort) "ręcznie" dla tablicy liczb.
    // 2. Napisz program sortujący tablicę par (imię, wynik) po .second przy użyciu własnego komparatora w sort().
    // 3. Zaimplementuj sortowanie malejące dla vectora stringów.
    // 4. Napisz program sprawdzający, ile zamian wykonało bubble sort podczas sortowania danej tablicy (policz operacje).
    // 5. Zbuduj program sortujący liczby według wartości bezwzględnej (najbliższe zeru na początku) przy użyciu własnego komparatora.
    // 6. Napisz program sortujący vector par (x, y) najpierw po x, a przy remisie po y (sortowanie leksykograficzne, wbudowane w pair).
    // 7. Zaimplementuj sortowanie tablicy stringów według ich długości, a nie alfabetycznie.
    // 8. Napisz program sprawdzający, czy dana tablica jest już posortowana, zanim w ogóle ją posortujesz.
    // 9. Zbuduj ranking uczniów - posortuj tablicę par (imię, ocena) malejąco po ocenie i wypisz podium (1., 2., 3. miejsce).
    // 10. Napisz program scalający dwie już posortowane tablice w jedną posortowaną tablicę (merge, bez używania sort() na końcu).
    // 11. Zaimplementuj sortowanie kubełkowe (bucket sort) dla liczb z przedziału 0-9.
    // 12. Napisz program sortujący tablicę liczb tak, by wszystkie liczby parzyste znalazły się przed nieparzystymi (niekoniecznie posortowane wewnątrz grup).
    // 13. Zbuduj funkcję porównującą - napisz własny komparator sortujący liczby według reszty z dzielenia przez 3.
    // 14. Napisz program znajdujący medianę zbioru liczb, sortując go najpierw funkcją sort().
    // 15. Zaimplementuj sortowanie "częściowe" - posortuj tylko pierwsze k elementów tablicy, pozostawiając resztę bez zmian.
    // 16. Napisz program sortujący daty (jako pary/trójki: rok, miesiąc, dzień) chronologicznie.
    // 17. Zbuduj program porównujący liczbę porównań bubble sort i selection sort dla tej samej tablicy.
    // 18. Napisz program sortujący litery w każdym słowie zdania alfabetycznie, zachowując kolejność słów.
    // 19. Zaimplementuj sortowanie stabilne - sprawdź (i wyjaśnij w komentarzu), czy sort() zachowuje kolejność elementów o równych kluczach.
    // 20. Napisz program sortujący tablicę liczb według liczby ich dzielników (liczby z mniejszą liczbą dzielników na początku).

    return 0;
}