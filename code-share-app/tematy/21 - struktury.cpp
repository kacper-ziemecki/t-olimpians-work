// ============================================================
//  TUTORIAL: STRUKTURY (struct) W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// struct pozwala stworzyc WLASNY TYP DANYCH, ktory laczy w sobie
// kilka roznych zmiennych (nazywanych POLAMI) pod jedna nazwa.
// Przydaje sie, gdy chcemy przechowywac razem powiazane ze soba
// informacje, np. imie i wiek osoby, albo wspolrzedne punktu.

#include <iostream>
#include <string>
#include <vector>
#include <algorithm>
using namespace std;

// --------------------------------------------------------
// 1) definicja struktury
// --------------------------------------------------------
// Skladnia:
//   struct NazwaStruktury {
//       typ pole1;
//       typ pole2;
//       ...
//   };
//
// UWAGA na srednik ";" na koncu definicji struktury - latwo
// o nim zapomniec!

struct Osoba {
    string imie;
    int wiek;
};

// struktura moze zawierac pola roznych typow, a nawet inne
// struktury
struct Punkt {
    double x;
    double y;
};

struct Prostokat {
    Punkt lewyGorny;
    double szerokosc;
    double wysokosc;
};

int main() {

    // --------------------------------------------------------
    // 2) tworzenie zmiennej danego typu struktury
    // --------------------------------------------------------
    // Do poszczegolnych pol dostajemy sie przez KROPKE.

    Osoba kacper;
    kacper.imie = "Kacper";
    kacper.wiek = 20;

    cout << kacper.imie << " ma " << kacper.wiek << " lat." << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) tworzenie struktury od razu z wartosciami
    // --------------------------------------------------------
    // Mozna nadac wartosci polom juz w momencie tworzenia zmiennej,
    // w kolejnosci, w jakiej pola zostaly zadeklarowane w strukturze.

    Osoba ania = {"Ania", 17};
    cout << ania.imie << " ma " << ania.wiek << " lat." << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) struktura wewnatrz struktury
    // --------------------------------------------------------
    // Do pol zagniezdzonej struktury dostajemy sie przez kilka
    // kropek pod rzad.

    Prostokat prost;
    prost.lewyGorny.x = 0;
    prost.lewyGorny.y = 5;
    prost.szerokosc = 10;
    prost.wysokosc = 4;

    cout << "Lewy gorny rog prostokata: (" << prost.lewyGorny.x << ", " << prost.lewyGorny.y << ")" << endl;
    cout << "Pole prostokata: " << prost.szerokosc * prost.wysokosc << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) wektor struktur - przechowywanie wielu "rekordow"
    // --------------------------------------------------------
    // Struktury bardzo czesto laczy sie z vector, zeby trzymac
    // liste podobnych do siebie obiektow - np. liste osob,
    // liste produktow, liste zawodnikow.

    vector<Osoba> ludzie;
    ludzie.push_back({"Bartek", 22});
    ludzie.push_back({"Celina", 19});
    ludzie.push_back(kacper);

    cout << "Podaj imie i wiek nowej osoby:" << endl;
    string noweImie;
    int nowyWiek;
    cin >> noweImie >> nowyWiek;
    ludzie.push_back({noweImie, nowyWiek});

    cout << "Lista wszystkich osob:" << endl;
    for (Osoba o : ludzie) {
        cout << "- " << o.imie << " (" << o.wiek << " lat)" << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 6) funkcje operujace na strukturach
    // --------------------------------------------------------
    // Struktury mozna przekazywac do funkcji jak kazdy inny typ -
    // przez wartosc (kopia) albo przez referencje (&), zeby
    // funkcja mogla zmienic oryginal.

    // funkcja pomocnicza zdefiniowana lokalnie ponizej jako lambda
    auto opiszOsobe = [](const Osoba &o) {
        cout << o.imie << " ma " << o.wiek << " lat." << endl;
    };

    cout << "Opis pierwszej osoby z listy: ";
    opiszOsobe(ludzie[0]);

    cout << endl;


    // --------------------------------------------------------
    // 7) sortowanie wektora struktur wedlug wybranego pola
    // --------------------------------------------------------
    // Funkcja sort() z <algorithm> potrafi posortowac wektor
    // struktur, jesli powiemy jej, WEDLUG CZEGO ma sortowac -
    // robimy to za pomoca funkcji porownujacej (tutaj: lambdy).

    sort(ludzie.begin(), ludzie.end(), [](Osoba a, Osoba b) {
        return a.wiek < b.wiek; // sortuj rosnaco wedlug wieku
    });

    cout << "Osoby posortowane wedlug wieku (od najmlodszej):" << endl;
    for (Osoba o : ludzie) {
        cout << "- " << o.imie << " (" << o.wiek << " lat)" << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "struct Nazwa { typ pole1; typ pole2; };  -> definicja wlasnego typu danych" << endl;
    cout << "Nazwa zmienna; zmienna.pole = wartosc;   -> tworzenie i dostep do pol przez kropke" << endl;
    cout << "Nazwa zmienna = {wartosc1, wartosc2};    -> tworzenie struktury od razu z wartosciami" << endl;
    cout << "struktura moze zawierac inna strukture   -> pola zagniezdzone (dostep przez kilka kropek)" << endl;
    cout << "vector<Nazwa>                            -> lista wielu obiektow tego samego typu struktury" << endl;
    cout << "sort(begin, end, funkcjaPorownujaca)     -> sortowanie wektora struktur wedlug wybranego pola" << endl;


    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: struktury (struct)
    // --------------------------------------------------------
    // 1. Zdefiniuj strukture Ksiazka (tytul, autor, rok wydania) i wypisz liste kilku ksiazek.
    // 2. Zdefiniuj strukture Produkt (nazwa, cena, ilosc) i policz laczna wartosc calego magazynu.
    // 3. Zdefiniuj strukture Punkt (x, y) i napisz funkcje liczaca odleglosc miedzy dwoma punktami.
    // 4. Zdefiniuj strukture Prostokat i napisz funkcje sprawdzajaca, czy dwa prostokaty sie nakladaja.
    // 5. Zdefiniuj strukture Uczen (imie, oceny jako vector<int>) i policz srednia ocen kazdego ucznia.
    // 6. Zdefiniuj strukture Data (dzien, miesiac, rok) i napisz funkcje porownujaca dwie daty.
    // 7. Zdefiniuj strukture Zawodnik (imie, wynik) i posortuj liste zawodnikow malejaco wedlug wyniku (ranking).
    // 8. Zdefiniuj strukture Wektor2D (x, y) i zaimplementuj dodawanie dwoch wektorow jako funkcje.
    // 9. Zdefiniuj strukture Pracownik (imie, pensja, dzial) i policz srednia pensje w kazdym dziale (mapa dzial -> lista pracownikow).
    // 10. Zdefiniuj strukture Samochod (marka, model, rocznik) i wyszukaj wszystkie samochody z danego rocznika.
    // 11. Zdefiniuj strukture Kolo (x, y, promien) i sprawdz, czy podany punkt lezy wewnatrz kola.
    // 12. Zdefiniuj strukture Studenci zawierajaca liste (vector) innej struktury Ocena (przedmiot, ocena) i wypisz najlepszy przedmiot studenta.
    // 13. Zdefiniuj strukture Zadanie (nazwa, priorytet, wykonane) i wypisz tylko niewykonane zadania posortowane wedlug priorytetu.
    // 14. Napisz funkcje przyjmujaca strukture przez referencje i modyfikujaca jej pola (np. podwyzka pensji pracownika).
    // 15. Zdefiniuj strukture Trojkat (trzy boki) i napisz funkcje liczaca jego obwod i pole (wzor Herona).
    // 16. Zdefiniuj strukture Zwierze (nazwa, gatunek, wiek) i policz, ile zwierzat kazdego gatunku jest na liscie.
    // 17. Zdefiniuj strukture Zamowienie (numer, lista produktow jako vector<string>, laczna kwota) i wypisz szczegoly zamowienia.
    // 18. Zaimplementuj prosta liste kontaktow jako vector<struct Kontakt> (imie, telefon, email) z wyszukiwaniem po imieniu.
    // 19. Zdefiniuj strukture Macierz2x2 (cztery liczby) i napisz funkcje mnozaca dwie takie macierze.
    // 20. Zdefiniuj strukture Bilet (miejsce, cena, czy_sprzedany) i zaimplementuj prosty system sprzedazy biletow na sale kinowa.

    return 0;
}