// ============================================================
//  TUTORIAL: ZLOZONOSC CZASOWA (notacja O())
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Zlozonosc czasowa mowi, JAK SZYBKO ROSNIE CZAS DZIALANIA
// programu wraz ze wzrostem rozmiaru danych wejsciowych (n).
// Nie mierzymy dokladnego czasu w sekundach (bo zalezy on od
// komputera), tylko jak liczba operacji zalezy od n - zapisujemy
// to w tzw. notacji O() (duze O), np. O(n), O(n^2), O(log n).
//
// To NIEZWYKLE WAZNY temat na olimpiadach - zle dobrany algorytm
// moze byc za wolny i program "nie zdazy" w limicie czasowym,
// nawet jesli daje poprawny wynik!

#include <iostream>
#include <chrono>
#include <vector>
using namespace std;
using namespace std::chrono;

int main() {

    // --------------------------------------------------------
    // 1) O(1) - zlozonosc stala
    // --------------------------------------------------------
    // Czas dzialania NIE ZALEZY od rozmiaru danych - zawsze tyle
    // samo operacji, niezaleznie czy n = 10 czy n = 10 000 000.
    // Przyklad: dostep do elementu tablicy po indeksie.

    vector<int> tablica = {5, 2, 8, 1, 9, 3};
    cout << "O(1): dostep do elementu tab[2] = " << tablica[2] << endl;
    cout << "(nie ma znaczenia, czy tablica ma 6 elementow, czy 6 milionow)" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) O(n) - zlozonosc liniowa
    // --------------------------------------------------------
    // Liczba operacji rosnie WPROST PROPORCJONALNIE do n. Przyklad:
    // przejscie przez wszystkie elementy tablicy jedna petla.
    // Jesli n zwiekszy sie 10-krotnie, czas dzialania tez wzrosnie
    // mniej wiecej 10-krotnie.

    int suma = 0;
    for (int i = 0; i < (int)tablica.size(); i++) {
        suma += tablica[i]; // jedna operacja na kazdy element -> n operacji
    }
    cout << "O(n): suma wszystkich elementow = " << suma << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) O(n^2) - zlozonosc kwadratowa
    // --------------------------------------------------------
    // Dwie zagniezdzone petle "po n" dają n*n = n^2 operacji.
    // Przyklad: porownanie kazdego elementu z kazdym (np. szukanie
    // pary o okreslonej sumie metoda "brute force").
    // Jesli n zwiekszy sie 10-krotnie, czas dzialania wzrosnie
    // okolo 100-krotnie - to juz moze byc za wolne dla duzych n!

    cout << "O(n^2): wszystkie pary elementow tablicy:" << endl;
    for (int i = 0; i < (int)tablica.size(); i++) {
        for (int j = i + 1; j < (int)tablica.size(); j++) {
            cout << "(" << tablica[i] << ", " << tablica[j] << ") ";
        }
    }
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) O(log n) - zlozonosc logarytmiczna
    // --------------------------------------------------------
    // Kazdy krok algorytmu ODRZUCA POLOWE pozostalych danych, wiec
    // liczba krokow rosnie BARDZO WOLNO wraz z n. Klasyczny
    // przyklad: wyszukiwanie binarne w posortowanej tablicy.
    // Nawet dla n = 1 000 000 potrzeba tylko okolo 20 krokow!

    vector<int> posortowana = {1, 3, 5, 7, 9, 11, 13, 15, 17, 19};
    int szukana = 13;
    int lewo = 0, prawo = (int)posortowana.size() - 1;
    int krokow = 0;

    while (lewo <= prawo) {
        krokow++;
        int srodek = (lewo + prawo) / 2;
        if (posortowana[srodek] == szukana) {
            cout << "O(log n): znaleziono " << szukana << " w " << krokow << " krokach." << endl;
            break;
        } else if (posortowana[srodek] < szukana) {
            lewo = srodek + 1;
        } else {
            prawo = srodek - 1;
        }
    }

    cout << endl;


    // --------------------------------------------------------
    // 5) O(n log n) - typowa zlozonosc dobrego sortowania
    // --------------------------------------------------------
    // To zlozonosc, jaka maja dobre algorytmy sortujace, np. sort()
    // z biblioteki standardowej C++ (ktora uzywa m.in. algorytmu
    // podobnego do quicksort/heapsort). Dla duzych n jest to
    // OGROMNIE szybsze niz sortowanie w O(n^2) (np. bubble sort).

    cout << "O(n log n): sort() z biblioteki standardowej sortuje szybko nawet duze dane." << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) porownanie w praktyce - pomiar czasu wykonania
    // --------------------------------------------------------
    // Mozemy sami zmierzyc, ile czasu zajmuje dany fragment kodu,
    // uzywajac biblioteki <chrono>. To dobry sposob, zeby na wlasne
    // oczy zobaczyc roznice miedzy algorytmem O(n) a O(n^2).

    cout << "Podaj rozmiar n do testu (np. 20000): ";
    int n;
    cin >> n;

    vector<int> dane(n, 1); // tablica n jedynek

    // pomiar algorytmu O(n)
    auto startLiniowy = high_resolution_clock::now();
    long long sumaLiniowa = 0;
    for (int i = 0; i < n; i++) {
        sumaLiniowa += dane[i];
    }
    auto koniecLiniowy = high_resolution_clock::now();
    auto czasLiniowy = duration_cast<microseconds>(koniecLiniowy - startLiniowy).count();

    // pomiar algorytmu O(n^2)
    auto startKwadratowy = high_resolution_clock::now();
    long long sumaKwadratowa = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            sumaKwadratowa += dane[i] * dane[j];
        }
    }
    auto koniecKwadratowy = high_resolution_clock::now();
    auto czasKwadratowy = duration_cast<microseconds>(koniecKwadratowy - startKwadratowy).count();

    cout << "Algorytm O(n) zajal:   " << czasLiniowy << " mikrosekund." << endl;
    cout << "Algorytm O(n^2) zajal: " << czasKwadratowy << " mikrosekund." << endl;
    cout << "Widac, ze O(n^2) jest znaczaco wolniejsze, mimo ze robi 'to samo' dane wejsciowe." << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "O(1)        -> stala liczba operacji, niezaleznie od n (np. tab[i])" << endl;
    cout << "O(log n)    -> kazdy krok odrzuca polowe danych (np. wyszukiwanie binarne)" << endl;
    cout << "O(n)        -> jedna petla po wszystkich elementach" << endl;
    cout << "O(n log n)  -> typowa zlozonosc dobrego sortowania (np. sort())" << endl;
    cout << "O(n^2)      -> dwie zagniezdzone petle po n (np. porownywanie kazdy z kazdym)" << endl;
    cout << "Im wiekszy limit n w zadaniu, tym mniejsza zlozonosc musi miec algorytm," << endl;
    cout << "zeby zdazyc w limicie czasowym (zwykle 1 sekunda = ok. 10^8 prostych operacji)." << endl;


    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: zlozonosc czasowa
    // --------------------------------------------------------
    // 1. Napisz algorytm O(n) znajdujacy maksimum w tablicy i porownaj go z podejsciem O(n^2) (porownywanie kazdy z kazdym).
    // 2. Zaimplementuj wyszukiwanie binarne (O(log n)) i porownaj liczbe krokow z wyszukiwaniem liniowym (O(n)) dla tych samych danych.
    // 3. Zmierz czasomierzem <chrono> czas dzialania sortowania babelkowego (O(n^2)) i sort() z STL (O(n log n)) dla n = 10000.
    // 4. Okresl zlozonosc czasowa algorytmu liczacego wszystkie trojki elementow sumujace sie do zadanej wartosci (brute force).
    // 5. Napisz algorytm O(n) zliczajacy wystapienia kazdej wartosci w tablicy przy uzyciu mapy.
    // 6. Zaimplementuj dwa sposoby sprawdzania, czy w tablicy sa duplikaty - O(n^2) oraz O(n log n) (po posortowaniu) - i porownaj czasy.
    // 7. Oszacuj, jak duze n zdazy przetworzyc algorytm O(n^2) w limicie czasowym 1 sekundy, a jak duze O(n log n).
    // 8. Napisz funkcje rekurencyjna Fibonacciego bez memoizacji i oszacuj jej zlozonosc (dlaczego jest ona wykladnicza?).
    // 9. Zoptymalizuj funkcje z zadania 8 do zlozonosci O(n) za pomoca memoizacji lub podejscia iteracyjnego.
    // 10. Zaimplementuj algorytm O(n) liczacy sume prefiksowa i wykorzystaj go do szybkiego liczenia sumy dowolnego podprzedzialu tablicy.
    // 11. Porownaj czas wstawiania n elementow do vector (push_back) z czasem wstawiania na poczatek vector (insert na indeks 0).
    // 12. Napisz algorytm O(n) sprawdzajacy, czy tablica jest posortowana, i porownaj go z pomyslem "posortuj i porownaj" O(n log n).
    // 13. Zbadaj zlozonosc operacji na map (wstawianie, wyszukiwanie) i porownaj ja teoretycznie z unordered_map.
    // 14. Zmierz, jak rosnie czas dzialania algorytmu O(n^3) w porownaniu do O(n^2) dla rosnacego n (np. n = 100, 200, 400).
    // 15. Napisz dwa algorytmy liczace liczbe par (i, j) takich, ze tab[i] + tab[j] = k - jeden O(n^2), drugi O(n) z uzyciem mapy.
    // 16. Okresl zlozonosc czasowa algorytmu sita Eratostenesa i zaimplementuj go, mierzac czas dla roznych zakresow n.
    // 17. Zaimplementuj sortowanie przez wstawianie (insertion sort) i wyjasnij, dlaczego jego zlozonosc to O(n^2).
    // 18. Porownaj zlozonosc pamieciowa (nie tylko czasowa) dwoch rozwiazan tego samego problemu, np. rekurencyjnego i iteracyjnego liczenia silni.
    // 19. Zaimplementuj mnozenie dwoch macierzy n x n i okresl zlozonosc czasowa tego algorytmu.
    // 20. Dla podanego przez uzytkownika limitu czasowego i rozmiaru danych n, oszacuj, jaka maksymalna zlozonosc czasowa (O(n), O(n log n), O(n^2) itd.) zdazy sie wykonac.

    return 0;
}