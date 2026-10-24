// ============================================================
//  TUTORIAL: min() i max() W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// min() i max() to gotowe funkcje, ktore zwracaja MNIEJSZA
// (min) albo WIEKSZA (max) z podanych wartosci. Zamiast pisac
// wlasny if za kazdym razem, gdy chcemy porownac dwie liczby,
// mozemy uzyc tych gotowych funkcji.
//
// Znajduja sie w naglowku <algorithm>.

#include <iostream>
#include <vector>
#include <algorithm> // potrzebne do min() i max()
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) min() i max() dla dwoch liczb
    // --------------------------------------------------------
    // Skladnia:
    //   min(a, b)  -> zwraca mniejsza z a i b
    //   max(a, b)  -> zwraca wieksza z a i b

    int a = 7, b = 3;

    cout << "min(" << a << ", " << b << ") = " << min(a, b) << endl;
    cout << "max(" << a << ", " << b << ") = " << max(a, b) << endl;

    cout << endl;

    // To samo dziala dla float:
    float x = 2.5f, y = 8.1f;
    cout << "min(" << x << ", " << y << ") = " << min(x, y) << endl;
    cout << "max(" << x << ", " << y << ") = " << max(x, y) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) jak to wyglada "recznie" - dla porownania
    // --------------------------------------------------------
    // min(a, b) i max(a, b) to w praktyce skrot na dokladnie taki
    // kod - warto to zrozumiec, zeby wiedziec, co robia "pod spodem".

    int mniejszy;
    if (a < b) {
        mniejszy = a;
    } else {
        mniejszy = b;
    }
    cout << "'Recznie' policzone minimum: " << mniejszy << endl;
    cout << "To samo funkcja min(): " << min(a, b) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) min() i max() dla trzech lub wiecej wartosci
    // --------------------------------------------------------
    // Zwykle min()/max() przyjmuja tylko DWA argumenty, wiec dla
    // wiecej wartosci zagniezdzamy wywolania jedno w drugim.

    int p = 4, q = 9, r = 2;

    int najmniejsza = min(p, min(q, r));
    int najwieksza = max(p, max(q, r));

    cout << "Najmniejsza z " << p << ", " << q << ", " << r << " to: " << najmniejsza << endl;
    cout << "Najwieksza z " << p << ", " << q << ", " << r << " to: " << najwieksza << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) min() i max() z danymi od uzytkownika
    // --------------------------------------------------------

    cout << "Podaj dwie liczby: ";
    int liczba1, liczba2;
    cin >> liczba1 >> liczba2;

    cout << "Mniejsza z nich to: " << min(liczba1, liczba2) << endl;
    cout << "Wieksza z nich to: " << max(liczba1, liczba2) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) szukanie min/max w tablicy - "recznie" w petli
    // --------------------------------------------------------
    // min()/max() porownuja tylko pojedyncze wartosci, wiec zeby
    // znalezc minimum/maksimum CALEJ tablicy, i tak potrzebujemy
    // petli - ale kazde porownanie w niej mozemy uproscic funkcja min/max.

    int tablica[] = {5, 2, 9, 1, 7, 3};
    int rozmiar = 6;

    int minimum = tablica[0];
    int maksimum = tablica[0];

    for (int i = 1; i < rozmiar; i++) {
        minimum = min(minimum, tablica[i]);
        maksimum = max(maksimum, tablica[i]);
    }

    cout << "Minimum w tablicy: " << minimum << endl;
    cout << "Maksimum w tablicy: " << maksimum << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) min_element() i max_element() - gotowe funkcje dla calego zakresu
    // --------------------------------------------------------
    // Jeszcze wygodniejszy sposob niz reczna petla - min_element()
    // i max_element() od razu przeszukuja caly zakres (tablice lub
    // vector) i zwracaja... nie sama wartosc, tylko "wskaznik" na
    // znaleziony element (tzw. iterator). Zeby dostac SAMA WARTOSC,
    // trzeba dopisac przed nim gwiazdke *.

    int tablica2[] = {8, 3, 6, 1, 9, 4};
    int rozmiar2 = 6;

    int minTablica2 = *min_element(tablica2, tablica2 + rozmiar2);
    int maxTablica2 = *max_element(tablica2, tablica2 + rozmiar2);

    cout << "min_element w tablicy2: " << minTablica2 << endl;
    cout << "max_element w tablicy2: " << maxTablica2 << endl;

    cout << endl;

    // to samo dziala dla vectora, z .begin() i .end():
    vector<int> liczby = {12, 4, 77, 1, 9, 30};

    int minVec = *min_element(liczby.begin(), liczby.end());
    int maxVec = *max_element(liczby.begin(), liczby.end());

    cout << "min_element w vectorze: " << minVec << endl;
    cout << "max_element w vectorze: " << maxVec << endl;

    cout << endl;


    // --------------------------------------------------------
    // 7) przydatny przyklad: ograniczanie wartosci do zakresu (clamp)
    // --------------------------------------------------------
    // Czasem chcemy, zeby liczba nie wychodzila poza dany zakres,
    // np. ocena od 1 do 6, albo pasek zycia od 0 do 100. Mozna to
    // zrobic laczac min() i max():
    //
    //   ograniczona = max(minimalna, min(wartosc, maksymalna));

    int minimalnaOcena = 1;
    int maksymalnaOcena = 6;

    cout << "Podaj obliczona ocene (moze byc spoza 1-6): ";
    int obliczonaOcena;
    cin >> obliczonaOcena;

    int ograniczonaOcena = max(minimalnaOcena, min(obliczonaOcena, maksymalnaOcena));
    cout << "Ocena po ograniczeniu do zakresu 1-6: " << ograniczonaOcena << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "min(a, b) / max(a, b)              -> mniejsza / wieksza z dwoch wartosci" << endl;
    cout << "min(a, min(b, c))                  -> zagniezdzanie dla wiecej niz 2 wartosci" << endl;
    cout << "*min_element(tab, tab + rozmiar)   -> minimum calej tablicy" << endl;
    cout << "*max_element(v.begin(), v.end())   -> maksimum calego vectora" << endl;
    cout << "max(dol, min(x, gora))             -> ograniczenie wartosci do zakresu [dol, gora]" << endl;
    cout << "Wszystkie te funkcje sa w naglowku <algorithm>." << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: min() i max()
    // --------------------------------------------------------
    // 1. Napisz program znajdujący najmniejszą i największą liczbę spośród pięciu wpisanych przez użytkownika (bez tablicy, same zmienne).
    // 2. Zaimplementuj funkcję clamp() ręcznie (bez min/max) i porównaj wynik z wersją opartą na min/max.
    // 3. Napisz program znajdujący drugą co do wielkości liczbę w tablicy przy użyciu min_element/max_element w pętli.
    // 4. Zbuduj kalkulator zakresu temperatur - wczytaj n pomiarów i wypisz różnicę między najwyższą a najniższą wartością.
    // 5. Napisz program znajdujący indeks (nie wartość!) największego elementu w tablicy przy użyciu max_element.
    // 6. Zaimplementuj ograniczanie (clamp) każdego elementu vectora do podanego zakresu [min, max].
    // 7. Napisz program znajdujący najmniejszą i największą literę alfabetu w podanym stringu.
    // 8. Zbuduj system oceniania sportowego (jak w gimnastyce) - odrzuć najniższą i najwyższą ocenę sędziów, policz średnią z pozostałych.
    // 9. Napisz program porównujący trzy pary (x, y) i znajdujący tę o największej sumie współrzędnych, korzystając z max().
    // 10. Zaimplementuj funkcję znajdującą min i max osobno dla elementów parzystych i osobno dla nieparzystych w tablicy.
    // 11. Napisz program wyznaczający zakres (max - min) dla każdego wiersza macierzy dwuwymiarowej.
    // 12. Zbuduj prostą grę - dwóch graczy podaje po jednej liczbie, program ogłasza zwycięzcę (max) i przegranego.
    // 13. Napisz program znajdujący najkrótsze i najdłuższe słowo w zdaniu przy użyciu min_element/max_element z komparatorem po długości.
    // 14. Zaimplementuj wyszukiwanie trzech największych liczb w tablicy (bez pełnego sortowania).
    // 15. Napisz program obliczający, o ile największy element tablicy jest większy od średniej.
    // 16. Zbuduj kalkulator ocen końcowych - spośród kilku podejść do egzaminu wybierz najlepszy wynik (max) jako ocenę końcową.
    // 17. Napisz program sprawdzający, czy podana liczba jest zarówno lokalnym minimum, jak i elementem mniejszym od sąsiadów w tablicy.
    // 18. Zaimplementuj funkcję zwracającą parę (min, max) całej tablicy za jednym przejściem pętli (bez dwóch osobnych pętli).
    // 19. Napisz program znajdujący najcięższy i najlżejszy przedmiot w vectorze par (nazwa, waga).
    // 20. Zbuduj prosty system limitu prędkości - dla podanej prędkości wypisz "za wolno", "OK" albo "za szybko" na podstawie min i max dozwolonej prędkości (bez if/else, tylko z clamp i porównaniem wyniku).

    return 0;
}