// ============================================================
//  TUTORIAL: TABLICE W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Tablica to "wiele pudelek pod jedna nazwa", ustawionych jedno
// za drugim w pamieci. Zamiast tworzyc 5 osobnych zmiennych
// (ocena1, ocena2, ocena3...), robimy JEDNA tablice, ktora
// przechowuje wiele wartosci TEGO SAMEGO TYPU.
//
// Skladnia tworzenia tablicy o stalym rozmiarze:
//   typ nazwa[rozmiar];

#include <iostream>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) tworzenie tablicy i dostep do jej elementow
    // --------------------------------------------------------
    // Tablica 5 liczb typu int - rozmiar musi byc znany od razu
    // (tutaj: 5 elementow).

    int oceny[5];

    // Elementy numerujemy od 0! Pierwszy element to oceny[0],
    // a NIE oceny[1]. Ostatni element to oceny[4] (bo mamy 5
    // elementow: indeksy 0, 1, 2, 3, 4).

    oceny[0] = 5;
    oceny[1] = 4;
    oceny[2] = 6;
    oceny[3] = 3;
    oceny[4] = 5;

    cout << "Pierwsza ocena: " << oceny[0] << endl;
    cout << "Ostatnia ocena: " << oceny[4] << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) tworzenie tablicy od razu z wartosciami
    // --------------------------------------------------------
    // Mozna nadac wartosci od razu przy tworzeniu tablicy -
    // wtedy C++ sam policzy rozmiar, jesli go pominiemy.

    int liczby[] = {10, 20, 30, 40, 50};
    // powyzsza tablica ma rozmiar 5, automatycznie wyliczony

    cout << "liczby[2] = " << liczby[2] << endl; // wypisze 30

    cout << endl;


    // --------------------------------------------------------
    // 3) przechodzenie po calej tablicy petla for
    // --------------------------------------------------------
    // To najczestszy sposob uzycia tablic - petla for od 0 do
    // (rozmiar - 1).

    cout << "Wszystkie oceny: ";
    for (int i = 0; i < 5; i++) {
        cout << oceny[i] << " ";
    }
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) wczytywanie tablicy od uzytkownika
    // --------------------------------------------------------

    const int ROZMIAR = 5; // const, zeby wszedzie uzywac tej samej liczby
    int wpisaneLiczby[ROZMIAR];

    cout << "Podaj " << ROZMIAR << " liczb:" << endl;
    for (int i = 0; i < ROZMIAR; i++) {
        cin >> wpisaneLiczby[i];
    }

    cout << "Wpisales: ";
    for (int i = 0; i < ROZMIAR; i++) {
        cout << wpisaneLiczby[i] << " ";
    }
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) typowe operacje na tablicach: suma, srednia, maksimum
    // --------------------------------------------------------

    int suma = 0;
    for (int i = 0; i < ROZMIAR; i++) {
        suma = suma + wpisaneLiczby[i];
    }
    cout << "Suma: " << suma << endl;

    float srednia = (float) suma / ROZMIAR; // rzutowanie na float, zeby byl ulamek
    cout << "Srednia: " << srednia << endl;

    int maksimum = wpisaneLiczby[0]; // zaczynamy od pierwszego elementu
    for (int i = 1; i < ROZMIAR; i++) {
        if (wpisaneLiczby[i] > maksimum) {
            maksimum = wpisaneLiczby[i];
        }
    }
    cout << "Najwieksza liczba: " << maksimum << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) szukanie konkretnej wartosci w tablicy
    // --------------------------------------------------------

    cout << "Podaj liczbe, ktorej szukamy: ";
    int szukana;
    cin >> szukana;

    bool znaleziono = false;
    int indeksZnaleziony = -1;

    for (int i = 0; i < ROZMIAR; i++) {
        if (wpisaneLiczby[i] == szukana) {
            znaleziono = true;
            indeksZnaleziony = i;
            break; // znalezlismy, nie ma sensu szukac dalej
        }
    }

    if (znaleziono) {
        cout << "Znaleziono " << szukana << " na pozycji (indeksie) " << indeksZnaleziony << endl;
    } else {
        cout << "Nie znaleziono liczby " << szukana << " w tablicy." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 7) tablica dwuwymiarowa (siatka, np. plansza)
    // --------------------------------------------------------
    // Tablica dwuwymiarowa to "tablica tablic" - przydatna np. do
    // plansz gier, ukladow rzedy/kolumny.

    int plansza[2][3]; // 2 wiersze, 3 kolumny

    int wartosc = 1;
    for (int wiersz = 0; wiersz < 2; wiersz++) {
        for (int kolumna = 0; kolumna < 3; kolumna++) {
            plansza[wiersz][kolumna] = wartosc;
            wartosc++;
        }
    }

    cout << "Plansza 2x3:" << endl;
    for (int wiersz = 0; wiersz < 2; wiersz++) {
        for (int kolumna = 0; kolumna < 3; kolumna++) {
            cout << plansza[wiersz][kolumna] << " ";
        }
        cout << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 8) UWAGA: wyjscie poza tablice (bardzo czesty blad!)
    // --------------------------------------------------------
    // Tablica o rozmiarze 5 ma indeksy TYLKO 0, 1, 2, 3, 4.
    // Odwolanie sie do liczby[5] albo liczby[-1] jest BLEDEM -
    // C++ NIE sprawdza tego automatycznie, wiec program moze
    // dzialac dziwnie albo sie wywalic. Ponizsza linia (celowo
    // zakomentowana) pokazuje taki blad - NIE odkomentowuj jej:
    //
    //   cout << liczby[10]; // <-- BLAD! poza zakresem tablicy

    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "typ nazwa[rozmiar];        -> tworzy tablice o stalym rozmiarze" << endl;
    cout << "tablica[0]                 -> PIERWSZY element (indeksy zaczynaja sie od 0!)" << endl;
    cout << "tablica[rozmiar - 1]       -> OSTATNI element" << endl;
    cout << "for (int i = 0; i < rozmiar; i++) -> standardowy sposob przejscia po tablicy" << endl;
    cout << "typ nazwa[wiersze][kolumny]-> tablica dwuwymiarowa (np. plansza)" << endl;
    cout << "UWAGA: C++ nie pilnuje granic tablicy - trzeba samemu uwazac!" << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: tablice
    // --------------------------------------------------------
    // 1. Napisz program wczytujący n liczb do tablicy i wypisujący je w odwrotnej kolejności.
    // 2. Zaimplementuj wyszukiwanie drugiej największej liczby w tablicy (bez sortowania).
    // 3. Napisz program zliczający, ile razy każda liczba występuje w tablicy.
    // 4. Zbuduj program sprawdzający, czy tablica jest posortowana rosnąco.
    // 5. Napisz program usuwający duplikaty z tablicy (przepisując unikalne elementy do nowej tablicy).
    // 6. Zaimplementuj odwracanie tablicy "w miejscu" (bez tworzenia nowej tablicy, zamieniając elementy miejscami).
    // 7. Napisz program sumujący osobno elementy parzyste i nieparzyste tablicy.
    // 8. Zbuduj program obliczający sumę głównej przekątnej tablicy dwuwymiarowej (macierzy kwadratowej).
    // 9. Napisz program sprawdzający, czy dwie tablice są identyczne (te same elementy w tej samej kolejności).
    // 10. Zaimplementuj mnożenie każdego elementu tablicy przez jego indeks i wypisanie wyniku.
    // 11. Napisz program znajdujący najdłuższy ciąg kolejnych jednakowych elementów w tablicy.
    // 12. Zbuduj program transponujący macierz (tablicę dwuwymiarową) - zamień wiersze z kolumnami.
    // 13. Napisz program przesuwający wszystkie elementy tablicy o jedno miejsce w prawo (cyklicznie).
    // 14. Zaimplementuj wyszukiwanie pary liczb w tablicy, których suma równa się podanej wartości docelowej.
    // 15. Napisz program obliczający sumę każdego wiersza i każdej kolumny macierzy dwuwymiarowej.
    // 16. Zbuduj program scalający dwie posortowane tablice w jedną posortowaną tablicę (bez użycia sort()).
    // 17. Napisz program sprawdzający, czy tablica jest "górą" (rośnie, a potem maleje - tablica bitoniczna).
    // 18. Zaimplementuj obliczanie średniej ruchomej (moving average) dla okna o zadanym rozmiarze w tablicy liczb.
    // 19. Napisz program znajdujący indeks, w którym suma elementów po lewej stronie równa się sumie elementów po prawej stronie tablicy.
    // 20. Zbuduj grę "kółko i krzyżyk" na planszy 3x3 reprezentowanej jako tablica dwuwymiarowa - wypisuj planszę i sprawdzaj zwycięzcę.

    return 0;
}