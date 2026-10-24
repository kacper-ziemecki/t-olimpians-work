// ============================================================
//  TUTORIAL: map W C++ - od zera
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// map to kontener przechowujacy PARY klucz -> wartosc. Zamiast
// szukac czegos po numerze (indeksie), jak w tablicy czy vectorze,
// szukamy po WLASNYM kluczu, np. imie -> wiek, slowo -> liczba
// wystapien, kod pocztowy -> nazwa miasta.
//
// Kazdy klucz w mapie moze wystapic TYLKO RAZ (tak jak w set),
// a elementy sa ZAWSZE automatycznie posortowane wedlug klucza.
//
// Zeby uzywac map, trzeba dolaczyc naglowek <map>.

#include <iostream>
#include <string>
#include <map>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) tworzenie mapy i dodawanie wartosci przez []
    // --------------------------------------------------------
    // Skladnia:
    //   map<typKlucza, typWartosci> nazwa;
    //   nazwa[klucz] = wartosc;
    //
    // Dziala to podobnie do tablicy, tylko zamiast liczbowego
    // indeksu (jak w int tab[5]) uzywamy DOWOLNEGO typu jako
    // "indeksu" - tutaj np. string.

    map<string, int> wiekOsoby;

    wiekOsoby["Kacper"] = 20;
    wiekOsoby["Ania"] = 17;
    wiekOsoby["Bartek"] = 22;

    cout << "Wiek Kacpra: " << wiekOsoby["Kacper"] << endl;
    cout << "Wiek Ani: " << wiekOsoby["Ania"] << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) nadpisywanie wartosci pod istniejacym kluczem
    // --------------------------------------------------------
    // Jesli przypiszemy wartosc do klucza, ktory juz istnieje,
    // po prostu ja NADPISZEMY (nie powstanie drugi taki sam klucz).

    wiekOsoby["Kacper"] = 21; // Kacper skonczyl urodziny
    cout << "Nowy wiek Kacpra: " << wiekOsoby["Kacper"] << endl;
    cout << "Rozmiar mapy: " << wiekOsoby.size() << endl; // wciaz 3, nie 4

    cout << endl;


    // --------------------------------------------------------
    // 3) tworzenie mapy od razu z wartosciami
    // --------------------------------------------------------

    map<string, string> stolice = {
        {"Polska", "Warszawa"},
        {"Niemcy", "Berlin"},
        {"Francja", "Paryz"}
    };

    cout << "Stolica Polski: " << stolice["Polska"] << endl;
    cout << "Stolica Niemiec: " << stolice["Niemcy"] << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) sprawdzanie, czy klucz istnieje - count()
    // --------------------------------------------------------
    // UWAGA: samo uzycie mapa[klucz] dla klucza, ktorego jeszcze
    // NIE MA, automatycznie go DODAJE (z domyslna wartoscia, np.
    // 0 dla int albo pusty string)! Dlatego zeby tylko SPRAWDZIC,
    // czy klucz istnieje (bez przypadkowego dodawania go), uzywamy
    // .count(), tak samo jak w set.

    if (wiekOsoby.count("Ania") > 0) {
        cout << "Ania jest w mapie." << endl;
    } else {
        cout << "Ani nie ma w mapie." << endl;
    }

    if (wiekOsoby.count("Celina") > 0) {
        cout << "Celina jest w mapie." << endl;
    } else {
        cout << "Celiny nie ma w mapie." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 5) przechodzenie po calej mapie (petla for)
    // --------------------------------------------------------
    // Kazdy element mapy to para (pair) klucz-wartosc, wiec
    // uzywamy .first (klucz) i .second (wartosc). Elementy
    // pojawiaja sie w kolejnosci POSORTOWANEJ wedlug klucza.

    cout << "Wszystkie osoby i ich wiek (posortowane wedlug imienia):" << endl;
    for (pair<string, int> osoba : wiekOsoby) {
        cout << osoba.first << " ma " << osoba.second << " lat" << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 6) usuwanie elementu - erase()
    // --------------------------------------------------------

    wiekOsoby.erase("Bartek");
    cout << "Po usunieciu Bartka, rozmiar mapy: " << wiekOsoby.size() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 7) praktyczny przyklad: zliczanie wystapien slow w tekscie
    // --------------------------------------------------------
    // To jedno z najczestszych zastosowan mapy - liczenie, ile
    // razy cos sie powtorzylo. Pomysl: dla kazdego slowa
    // zwiekszamy jego licznik w mapie o 1.

    cout << "Podaj kilka slow oddzielonych spacja, a na koncu wpisz 'koniec':" << endl;
    map<string, int> licznikSlow;
    string slowo;

    cin >> slowo;
    while (slowo != "koniec") {
        licznikSlow[slowo]++; // jesli slowa jeszcze nie bylo, zaczyna od 0 i dodaje 1
        cin >> slowo;
    }

    cout << "Liczba wystapien kazdego slowa:" << endl;
    for (pair<string, int> para : licznikSlow) {
        cout << para.first << " -> " << para.second << " raz(y)" << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 8) sprawdzanie, czy zbior jest pusty - empty()
    // --------------------------------------------------------

    map<string, int> pustaMapa;
    if (pustaMapa.empty()) {
        cout << "pustaMapa jest pusta." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 9) czyszczenie calej mapy - clear()
    // --------------------------------------------------------

    licznikSlow.clear();
    cout << "Po clear(), rozmiar licznikSlow: " << licznikSlow.size() << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "map<typKlucza, typWartosci> m;   -> mapa (klucz -> wartosc), posortowana wedlug klucza" << endl;
    cout << "m[klucz] = wartosc;              -> dodaje lub nadpisuje wartosc pod danym kluczem" << endl;
    cout << "m[klucz]                         -> odczyt wartosci (UWAGA: dodaje klucz, jesli go nie bylo!)" << endl;
    cout << "m.count(klucz)                   -> bezpieczne sprawdzenie, czy klucz istnieje" << endl;
    cout << "m.erase(klucz);                  -> usuwa dany klucz z mapy" << endl;
    cout << "m.size() / m.empty() / m.clear() -> rozmiar / czy pusta / czyszczenie" << endl;
    cout << "for (pair<K,V> p : m) { p.first; p.second; }  -> petla po parach klucz-wartosc" << endl;
    cout << "Typowe zastosowanie: zliczanie wystapien czegos (np. slow, liter, liczb)." << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: mapy (map)
    // --------------------------------------------------------
    // 1. Napisz program zliczajacy, ile razy kazda litera wystepuje w podanym slowie/zdaniu.
    // 2. Wczytaj liste zakupow (nazwa produktu + cena) i wypisz ja posortowana alfabetycznie wedlug nazwy.
    // 3. Napisz program tlumaczacy slowa polskie na angielskie za pomoca mapy slownikowej.
    // 4. Wczytaj oceny uczniow (imie -> ocena) i wypisz imie ucznia z najwyzsza ocena.
    // 5. Zaimplementuj prosty system glosowania: zliczaj glosy na kandydatow i wypisz zwyciezce.
    // 6. Napisz program sprawdzajacy, czy dwa podane slowa sa anagramami (uzyj mapy zliczajacej litery).
    // 7. Wczytaj liste transakcji (osoba -> kwota) i policz sume wydatkow kazdej osoby.
    // 8. Napisz program zliczajacy czestosc wystepowania kazdej liczby w podanym ciagu.
    // 9. Zaimplementuj prosty magazyn: dodawanie produktow, usuwanie, sprawdzanie stanu (nazwa -> ilosc).
    // 10. Wczytaj zdanie i wypisz kazde slowo dokladnie raz, w kolejnosci alfabetycznej, wraz z liczba wystapien.
    // 11. Napisz program mapujacy numery miesiecy (1-12) na ich nazwy i wypisujacy nazwe dla podanego numeru.
    // 12. Zaimplementuj system rezerwacji miejsc (numer miejsca -> imie rezerwujacego), z obsluga konfliktow.
    // 13. Wczytaj liste ocen z kilku przedmiotow (przedmiot -> lista ocen) i policz srednia dla kazdego przedmiotu.
    // 14. Napisz program znajdujacy najczesciej wystepujacy element w tablicy za pomoca mapy.
    // 15. Zaimplementuj prosty cache (pamiec podreczna) wynikow funkcji kosztownej obliczeniowo, uzywajac mapy.
    // 16. Wczytaj graf jako liste sasiedztwa przechowywana w map<int, vector<int>> i wypisz sasiadow wybranego wierzcholka.
    // 17. Napisz program zliczajacy wystapienia par znakow (bigramow) w podanym tekscie.
    // 18. Zaimplementuj system punktacji graczy w turnieju (nazwa gracza -> liczba punktow) z mozliwoscia aktualizacji wyniku.
    // 19. Wczytaj liste osob i ich numery telefonow, a nastepnie umozliwaj wyszukiwanie numeru po imieniu (ksiazka telefoniczna).
    // 20. Napisz program grupujacy liczby wedlug reszty z dzielenia przez podana wartosc, uzywajac map<int, vector<int>>.

    return 0;
}