// ============================================================
//  TUTORIAL: stringstream W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// stringstream pozwala TRAKTOWAC NAPIS (string) TAK, JAKBY BYL
// STRUMIENIEM WEJSCIA/WYJSCIA - podobnie jak cin i cout, tylko
// zamiast konsoli, dzialamy na napisie w pamieci. Bardzo
// przydaje sie do:
//   - zamiany napisu na liczby (i odwrotnie)
//   - dzielenia napisu na pojedyncze slowa/liczby oddzielone spacjami
//   - sklejania wielu wartosci w jeden napis
//
// Zeby uzywac stringstream, trzeba dolaczyc naglowek <sstream>.

#include <iostream>
#include <string>
#include <sstream>
#include <vector>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) zamiana napisu na liczbe - wczytywanie z stringstream
    // --------------------------------------------------------
    // Tworzymy stringstream z napisu, a potem wczytujemy z niego
    // dane operatorem >>, dokladnie tak jak z cin.

    string napis = "42";
    stringstream ss1(napis);

    int liczba;
    ss1 >> liczba;

    cout << "Napis \"" << napis << "\" zamieniony na liczbe: " << liczba << endl;
    cout << "liczba + 8 = " << (liczba + 8) << endl; // teraz to prawdziwa liczba, mozna dodawac

    cout << endl;


    // --------------------------------------------------------
    // 2) zamiana liczby (lub czegokolwiek) na napis
    // --------------------------------------------------------
    // Dziala to tez w druga strone - mozemy "wypisywac" do
    // stringstreama operatorem <<, a potem odczytac cala
    // zawartosc jako string metoda .str().

    stringstream ss2;
    int wiek = 20;
    double srednia = 4.75;

    ss2 << "Kacper ma " << wiek << " lat, srednia: " << srednia;

    string wynikowyNapis = ss2.str();
    cout << "Zbudowany napis: " << wynikowyNapis << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) dzielenie napisu na slowa (tokenizacja)
    // --------------------------------------------------------
    // Jesli w petli bedziemy wielokrotnie uzywac operatora >>
    // na tym samym stringstreamie, kazde wywolanie wczyta
    // KOLEJNE SLOWO (fragment az do najblizszej spacji) - dokladnie
    // tak, jak dziala cin >> dla wielu slow.

    string zdanie = "Ala ma kota i psa";
    stringstream ss3(zdanie);

    string slowo;
    cout << "Slowa w zdaniu \"" << zdanie << "\":" << endl;
    while (ss3 >> slowo) {
        cout << "- " << slowo << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 4) wczytywanie wielu liczb oddzielonych spacjami z napisu
    // --------------------------------------------------------
    // To samo dziala dla liczb - stringstream sam pomija spacje
    // i konwertuje kazdy fragment na odpowiedni typ.

    string napisLiczb = "3 7 2 9 4";
    stringstream ss4(napisLiczb);

    vector<int> liczby;
    int x;
    while (ss4 >> x) {
        liczby.push_back(x);
    }

    cout << "Liczby wczytane z napisu \"" << napisLiczb << "\":" << endl;
    int suma = 0;
    for (int l : liczby) {
        cout << l << " ";
        suma += l;
    }
    cout << endl;
    cout << "Suma tych liczb: " << suma << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) dzielenie napisu wedlug WLASNEGO separatora - getline()
    // --------------------------------------------------------
    // Zwykle >> dzieli tylko po spacjach/bialych znakach. Zeby
    // podzielic np. po przecinkach, uzywamy getline(stream, zmienna,
    // znakSeparatora) - dziala to podobnie jak getline(cin, ...),
    // ale z dodatkowym trzecim argumentem okreslajacym separator.

    string csv = "Kacper,20,Gorzow";
    stringstream ss5(csv);

    string fragment;
    cout << "Fragmenty napisu \"" << csv << "\" podzielone po przecinku:" << endl;
    while (getline(ss5, fragment, ',')) {
        cout << "- " << fragment << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 6) praktyczny przyklad: wczytanie calej linii liczb od uzytkownika
    // --------------------------------------------------------
    // Klasyczny schemat w zadaniach olimpijskich: uzytkownik podaje
    // caly wiersz liczb naraz, a program nie wie z gory, ile ich
    // bedzie. Wczytujemy cala linie przez getline(cin, ...), a
    // potem "rozbieramy" ja na pojedyncze liczby stringstreamem.

    cout << "Podaj kilka liczb w jednej linii, oddzielonych spacjami:" << endl;
    cin.ignore(); // czyscimy pozostawiony znak nowej linii po poprzednich wczytaniach
    string linia;
    getline(cin, linia);

    stringstream ss6(linia);
    vector<int> wprowadzoneLiczby;
    int wartosc;
    while (ss6 >> wartosc) {
        wprowadzoneLiczby.push_back(wartosc);
    }

    cout << "Wczytano " << wprowadzoneLiczby.size() << " liczb(y): ";
    for (int l : wprowadzoneLiczby) {
        cout << l << " ";
    }
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "stringstream ss(napis);   -> tworzy strumien z gotowego napisu (do odczytu)" << endl;
    cout << "stringstream ss;          -> tworzy pusty strumien (do budowania napisu operatorem <<)" << endl;
    cout << "ss >> zmienna;            -> wczytuje kolejne 'slowo' i konwertuje na typ zmiennej" << endl;
    cout << "ss << wartosc;            -> dopisuje wartosc do strumienia (tak jak cout)" << endl;
    cout << "ss.str()                  -> zwraca cala zawartosc strumienia jako string" << endl;
    cout << "getline(ss, zm, ',')      -> wczytuje fragment az do wlasnego separatora" << endl;
    cout << "Typowe zastosowanie: parsowanie napisow, wczytywanie nieznanej liczby danych z linii." << endl;

    return 0;
}