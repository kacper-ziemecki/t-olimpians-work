// ============================================================
//  TUTORIAL: vector W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// vector to "tablica, ktora sama zmienia swoj rozmiar". Zwykla
// tablica (int t[5];) musi miec rozmiar znany od razu i nie da
// sie go pozniej powiekszyc ani zmniejszyc. vector rozwiazuje
// ten problem - mozna do niego dodawac i usuwac elementy w
// dowolnym momencie dzialania programu.
//
// Zeby uzywac vector, trzeba dolaczyc naglowek <vector>.

#include <iostream>
#include <string>
#include <vector>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) tworzenie vectora
    // --------------------------------------------------------
    // Skladnia:
    //   vector<typ> nazwa;              -> pusty vector
    //   vector<typ> nazwa = {w1, w2};   -> vector od razu z wartosciami
    //   vector<typ> nazwa(rozmiar);     -> vector o danym rozmiarze (zera/puste wartosci)
    //   vector<typ> nazwa(rozmiar, x);  -> vector o danym rozmiarze, wypelniony wartoscia x

    vector<int> pusty;                    // pusty vector, jeszcze bez elementow
    vector<int> liczby = {10, 20, 30};    // vector od razu z 3 elementami
    vector<int> zera(5);                  // vector 5 zer: {0, 0, 0, 0, 0}
    vector<int> piatki(4, 5);             // vector 4 piatek: {5, 5, 5, 5}

    cout << "liczby[1] = " << liczby[1] << endl; // dostep jak w zwyklej tablicy, indeksy od 0
    cout << "rozmiar zera: " << zera.size() << endl;
    cout << "piatki[0] = " << piatki[0] << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) dodawanie elementow - push_back()
    // --------------------------------------------------------
    // To najwazniejsza funkcja vectora - dokleja nowy element
    // NA KONIEC, a vector sam sie powieksza.

    vector<int> zakupy;
    zakupy.push_back(1);
    zakupy.push_back(2);
    zakupy.push_back(3);

    cout << "Vector po 3x push_back: ";
    for (int i = 0; i < zakupy.size(); i++) {
        cout << zakupy[i] << " ";
    }
    cout << "(rozmiar: " << zakupy.size() << ")" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) przechodzenie po vectorze petla for
    // --------------------------------------------------------
    // Uzywamy .size() zamiast liczby na sztywno wpisanej - dzieki
    // temu petla zawsze pasuje do AKTUALNEGO rozmiaru vectora.

    vector<string> imiona = {"Ania", "Bartek", "Celina"};

    cout << "Imiona:" << endl;
    for (int i = 0; i < imiona.size(); i++) {
        cout << i << ": " << imiona[i] << endl;
    }

    cout << endl;

    // Alternatywnie - petla "for kazdy element" (range-based for),
    // gdy nie potrzebujemy indeksu, tylko same wartosci:
    cout << "Imiona (bez indeksow):" << endl;
    for (string imie : imiona) {
        cout << imie << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 4) wczytywanie elementow od uzytkownika do vectora
    // --------------------------------------------------------
    // Skoro vector sam sie powieksza, mozemy najpierw zapytac,
    // ile elementow uzytkownik chce podac, a potem wczytac je
    // w petli - bez ustalania rozmiaru z gory jak w zwyklej tablicy.

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

    cout << "Podales: ";
    for (int liczba : podaneLiczby) {
        cout << liczba << " ";
    }
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) typowe operacje: suma, srednia, maksimum
    // --------------------------------------------------------

    int suma = 0;
    for (int liczba : podaneLiczby) {
        suma = suma + liczba;
    }
    cout << "Suma: " << suma << endl;

    if (podaneLiczby.size() > 0) {
        float srednia = (float) suma / podaneLiczby.size();
        cout << "Srednia: " << srednia << endl;

        int maksimum = podaneLiczby[0];
        for (int liczba : podaneLiczby) {
            if (liczba > maksimum) {
                maksimum = liczba;
            }
        }
        cout << "Najwieksza liczba: " << maksimum << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 6) usuwanie ostatniego elementu - pop_back()
    // --------------------------------------------------------

    vector<int> przyklad = {1, 2, 3, 4, 5};
    cout << "Przed pop_back, rozmiar: " << przyklad.size() << endl;
    przyklad.pop_back(); // usuwa OSTATNI element (5)
    cout << "Po pop_back, rozmiar: " << przyklad.size() << endl;

    cout << "Zawartosc po usunieciu: ";
    for (int x : przyklad) cout << x << " ";
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 7) sprawdzanie, czy vector jest pusty - empty()
    // --------------------------------------------------------

    vector<int> pustyVector;
    if (pustyVector.empty()) {
        cout << "pustyVector jest pusty." << endl;
    }

    if (!przyklad.empty()) {
        cout << "przyklad nie jest pusty, ma " << przyklad.size() << " elementow." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 8) czyszczenie calego vectora - clear()
    // --------------------------------------------------------

    przyklad.clear(); // usuwa WSZYSTKIE elementy
    cout << "Po clear(), rozmiar: " << przyklad.size() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 9) UWAGA: dostep poza zakres tez jest bledem (jak w tablicy)
    // --------------------------------------------------------
    // vector sam sie powieksza tylko przez push_back - odwolanie
    // sie do indeksu, ktorego jeszcze nie ma, jest BLEDEM.
    // Ponizsza linia (celowo zakomentowana) pokazuje taki blad -
    // NIE odkomentowuj jej:
    //
    //   vector<int> v = {1, 2, 3};
    //   cout << v[10]; // <-- BLAD! nie ma indeksu 10, tylko 0-2

    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "vector<typ> v;                 -> pusty vector, ktory moze rosnac" << endl;
    cout << "v.push_back(x);                -> dodaje x na koniec vectora" << endl;
    cout << "v.pop_back();                  -> usuwa ostatni element" << endl;
    cout << "v.size()                       -> aktualny rozmiar (liczba elementow)" << endl;
    cout << "v.empty()                      -> true, jesli vector jest pusty" << endl;
    cout << "v.clear();                     -> usuwa wszystkie elementy" << endl;
    cout << "v[i]                           -> dostep do elementu (indeksy od 0)" << endl;
    cout << "for (typ x : v) { ... }        -> petla po wszystkich elementach vectora" << endl;

    return 0;
}