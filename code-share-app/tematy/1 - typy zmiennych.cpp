// ============================================================
//  TUTORIAL: TYPY ZMIENNYCH W C++ 
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC - wykonuje sie
// jak normalny program i wypisuje wyniki na ekran, zeby od razu
// widziec efekt kazdej linijki.
//
// Zmienna to "pudelko" w pamieci komputera, ktore ma:
//   1) TYP    - jakiego rodzaju dane moze przechowywac,
//   2) NAZWE  - jak sie do niego odwolujemy,
//   3) WARTOSC - co aktualnie w nim jest.
//
// Skladnia tworzenia zmiennej:
//   typ nazwa = wartosc;

#include <iostream>
#include <string>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) int - liczby calkowite (bez czesci ulamkowej)
    // --------------------------------------------------------
    // Uzywamy go do liczenia rzeczy: wiek, liczba punktow,
    // liczba probek, indeks w petli itd.
    // Typowy zakres: od okolo -2 miliardow do +2 miliardow.

    int wiek = 17;
    int liczbaUczniow = 32;
    int wynikUjemny = -5; // int moze byc tez ujemny

    cout << "int wiek = " << wiek << endl;
    cout << "int liczbaUczniow = " << liczbaUczniow << endl;
    cout << "int wynikUjemny = " << wynikUjemny << endl;

    // Na intach mozna liczyc normalnie:
    int suma = wiek + liczbaUczniow;
    cout << "wiek + liczbaUczniow = " << suma << endl;

    // UWAGA: dzielenie dwoch intow "obcina" czesc ulamkowa!
    int a = 7, b = 2;
    cout << "7 / 2 jako int = " << (a / b) << " (nie 3.5, tylko 3!)" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) float - liczby zmiennoprzecinkowe (z czescia ulamkowa)
    // --------------------------------------------------------
    // Uzywamy go, gdy potrzebujemy ulamkow: srednia, cena,
    // wzrost, waga, wyniki pomiarow itd.
    // float ma ograniczona dokladnosc (ok. 6-7 cyfr znaczacych).

    float srednia = 4.75f;      // literal float konczymy litera 'f'
    float pi = 3.14f;
    float temperatura = -3.5f;

    cout << "float srednia = " << srednia << endl;
    cout << "float pi = " << pi << endl;
    cout << "float temperatura = " << temperatura << endl;

    // Dzielenie floatow juz DZIALA normalnie, z ulamkiem:
    float wynikA = 7.0f, wynikB = 2.0f;
    cout << "7.0 / 2.0 jako float = " << (wynikA / wynikB) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) char - pojedynczy znak
    // --------------------------------------------------------
    // Przechowuje DOKLADNIE JEDEN znak, zawsze w pojedynczych
    // apostrofach: 'a', 'Z', '5', '!', ' ' (spacja) itd.

    char litera = 'A';
    char cyfra = '7';        // to jest ZNAK '7', a nie liczba 7!
    char znakSpecjalny = '?';

    cout << "char litera = " << litera << endl;
    cout << "char cyfra = " << cyfra << endl;
    cout << "char znakSpecjalny = " << znakSpecjalny << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) string - tekst (ciag znakow)
    // --------------------------------------------------------
    // Przechowuje CALY NAPIS, zawsze w cudzyslowach: "tekst".
    // Wymaga naglowka <string> (dolaczonego na gorze pliku).

    string imie = "Kacper";
    string powitanie = "Czesc, jak sie masz?";
    string pusteZdanie = "";   // string moze byc tez pusty

    cout << "string imie = " << imie << endl;
    cout << "string powitanie = " << powitanie << endl;

    // Stringi mozna sklejac znakiem +:
    string pelnyNapis = "Czesc, " + imie + "!";
    cout << "Sklejony napis: " << pelnyNapis << endl;

    // Mozna sprawdzic ich dlugosc:
    cout << "Dlugosc imienia: " << imie.length() << " znakow" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) const - zmienna, ktorej wartosci NIE MOZNA zmienic
    // --------------------------------------------------------
    // Uzywamy const, gdy wiemy, ze wartosc ma zostac taka sama
    // przez caly czas dzialania programu (np. stale matematyczne,
    // ustawienia programu, limity).
    //
    // const mozna dopisac PRZED kazdym typem: const int, const
    // float, const string, const char.

    const int maksLiczbaGraczy = 4;
    const float PI = 3.14159f;
    const string nazwaProgramu = "Moj Pierwszy Program";

    cout << "const int maksLiczbaGraczy = " << maksLiczbaGraczy << endl;
    cout << "const float PI = " << PI << endl;
    cout << "const string nazwaProgramu = " << nazwaProgramu << endl;

    // Ponizsza linia gdyby byla odkomentowana, DA BLAD KOMPILACJI,
    // bo probujemy zmienic wartosc const:
    // maksLiczbaGraczy = 5; // <-- BLAD! nie mozna tego zrobic

    cout << endl;


    // --------------------------------------------------------
    // 6) auto - kompilator sam odgadnie typ zmiennej
    // --------------------------------------------------------
    // auto NIE jest osobnym typem - to tylko "skrot", ktory
    // mowi kompilatorowi: "sam sie domysl, jaki tu ma byc typ,
    // patrzac na wartosc po prawej stronie znaku =".
    //
    // Kompilator zamienia auto na prawdziwy typ juz podczas
    // kompilacji - dzieki temu program dziala dokladnie tak samo,
    // jakbysmy sami napisali int / float / string.

    auto liczbaCalkowita = 10;         // auto stanie sie int
    auto liczbaZmiennoprzecinkowa = 2.5f; // auto stanie sie float
    auto tekst = string("Ala ma kota"); // auto stanie sie string
    auto znak = 'x';                    // auto stanie sie char

    cout << "auto liczbaCalkowita (tak naprawde int) = " << liczbaCalkowita << endl;
    cout << "auto liczbaZmiennoprzecinkowa (tak naprawde float) = " << liczbaZmiennoprzecinkowa << endl;
    cout << "auto tekst (tak naprawde string) = " << tekst << endl;
    cout << "auto znak (tak naprawde char) = " << znak << endl;

    // auto jest wygodne, gdy typ jest oczywisty albo dlugi do
    // napisania, ale na poczatek warto pisac typy wprost (int,
    // float, string, char) - tak latwiej sie uczyc i widac,
    // z czym pracujemy.

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "int    -> liczby calkowite, np. 5, -3, 1000" << endl;
    cout << "float  -> liczby z ulamkiem, np. 3.14, -0.5" << endl;
    cout << "char   -> pojedynczy znak, np. 'a', '7', '!'" << endl;
    cout << "string -> tekst, np. \"Ala ma kota\"" << endl;
    cout << "const  -> wartosci, ktorych nie mozna zmienic" << endl;
    cout << "auto   -> kompilator sam odgadnie typ" << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: typy zmiennych
    // --------------------------------------------------------
    // 1. Napisz program, który wczyta wiek użytkownika jako int i wypisze, ile lat zostało mu do 100 urodzin.
    // 2. Zadeklaruj zmienne różnych typów (int, float, char, string) opisujące osobę i wypisz je w jednym zdaniu.
    // 3. Wczytaj dwie liczby całkowite i sprawdź, jaki będzie wynik dzielenia int/int a jaki po rzutowaniu na float.
    // 4. Napisz program obliczający pole i obwód prostokąta z użyciem zmiennych typu float.
    // 5. Zadeklaruj stałą (const) przechowującą liczbę dni w tygodniu i użyj jej w obliczeniach.
    // 6. Sprawdź za pomocą sizeof(), ile bajtów zajmują różne typy zmiennych (int, float, char, double).
    // 7. Napisz program zamieniający temperaturę ze stopni Celsjusza na Fahrenheita, używając float.
    // 8. Zbadaj, co się stanie, gdy do zmiennej int przypiszesz zbyt dużą liczbę (przepełnienie/overflow) - poeksperymentuj z int i long long.
    // 9. Użyj auto do zadeklarowania kilku zmiennych różnych typów i wypisz ich wartości.
    // 10. Napisz program obliczający średnią z trzech ocen typu float i wypisujący wynik z dokładnością do dwóch miejsc po przecinku.
    // 11. Zamień znak (char) na jego kod ASCII i odwrotnie (int <-> char).
    // 12. Zadeklaruj const string z nazwą programu i wypisz ją na początku i końcu programu.
    // 13. Napisz program sprawdzający, czy podana liczba float jest liczbą całkowitą (czy część ułamkowa wynosi 0).
    // 14. Porównaj wynik dzielenia dwóch intów z wynikiem dzielenia dwóch floatów dla tych samych wartości.
    // 15. Zadeklaruj zmienną char i sprawdź, czy jest wielką czy małą literą alfabetu.
    // 16. Napisz kalkulator BMI wykorzystujący zmienne typu float (waga, wzrost).
    // 17. Zbadaj różnicę w precyzji między float a double na przykładzie liczby pi.
    // 18. Napisz program zamieniający liczbę sekund na godziny, minuty i sekundy, używając wyłącznie int.
    // 19. Zadeklaruj kilka stałych (const) reprezentujących ceny produktów i policz sumaryczny koszt zakupów.
    // 20. Napisz program demonstrujący jawne rzutowanie typów (int na float, float na int) i wyjaśniający różnicę w komentarzu.

    return 0;
}