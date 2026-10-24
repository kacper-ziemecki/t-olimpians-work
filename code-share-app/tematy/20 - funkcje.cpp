// ============================================================
//  TUTORIAL: FUNKCJE W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Funkcja to KAWALEK KODU, ktory ma swoja nazwe i mozna go
// wywolac (uzyc) wielokrotnie z roznych miejsc programu, zamiast
// za kazdym razem pisac ten sam kod od nowa. Dzieki funkcjom
// program jest krotszy, czytelniejszy i latwiejszy do naprawiania.

#include <iostream>
#include <string>
using namespace std;

// --------------------------------------------------------
// 1) deklaracja funkcji, ktora nic nie zwraca (void)
// --------------------------------------------------------
// Skladnia:
//   typZwracany nazwaFunkcji(parametry) {
//       cialo funkcji
//   }
//
// "void" oznacza, ze funkcja NIE zwraca zadnej wartosci -
// po prostu cos robi (np. cos wypisuje) i konczy dzialanie.

void przywitajSie() {
    cout << "Czesc! To jest funkcja bez parametrow i bez zwracanej wartosci." << endl;
}

// --------------------------------------------------------
// 2) funkcja z parametrami
// --------------------------------------------------------
// Parametry to "dane wejsciowe" funkcji - wartosci, ktore
// przekazujemy jej podczas wywolania, zeby mogla ich uzyc.

void przywitajOsobe(string imie, int wiek) {
    cout << "Czesc " << imie << "! Masz " << wiek << " lat." << endl;
}

// --------------------------------------------------------
// 3) funkcja, ktora COS ZWRACA (return)
// --------------------------------------------------------
// Jesli funkcja ma zwracac wartosc, zamiast "void" piszemy
// typ tej wartosci (np. int, double, string, bool), a w ciele
// funkcji uzywamy slowa "return", zeby ja zwrocic.

int dodaj(int a, int b) {
    int wynik = a + b;
    return wynik; // funkcja konczy sie tutaj i "oddaje" wynik
}

bool czyParzysta(int liczba) {
    return liczba % 2 == 0; // mozna od razu zwrocic wynik warunku
}

// --------------------------------------------------------
// 4) wartosci domyslne parametrow
// --------------------------------------------------------
// Mozna ustawic domyslna wartosc parametru - jesli ktos wywola
// funkcje bez podania tego argumentu, uzyta zostanie wartosc
// domyslna.

int potega(int podstawa, int wykladnik = 2) {
    int wynik = 1;
    for (int i = 0; i < wykladnik; i++) {
        wynik *= podstawa;
    }
    return wynik;
}

// --------------------------------------------------------
// 5) przekazywanie przez referencje (&)
// --------------------------------------------------------
// Normalnie funkcja dostaje KOPIE zmiennej i zmiany w niej nie
// wplywaja na oryginal. Jesli chcemy, zeby funkcja mogla ZMIENIC
// oryginalna zmienna z zewnatrz, uzywamy referencji - znaku "&"
// przy parametrze.

void podwoj(int &liczba) {
    liczba = liczba * 2; // zmienia oryginalna zmienna, nie kopie
}

void zamien(int &a, int &b) {
    int tymczasowa = a;
    a = b;
    b = tymczasowa;
}

// --------------------------------------------------------
// 6) przeciazanie funkcji (overloading)
// --------------------------------------------------------
// Mozna miec kilka funkcji o TEJ SAMEJ nazwie, ale z roznymi
// parametrami (inna liczba lub inne typy). Kompilator sam
// wybierze wlasciwa wersje na podstawie tego, co jej przekazemy.

int maksimum(int a, int b) {
    if (a > b) return a;
    return b;
}

double maksimum(double a, double b) {
    if (a > b) return a;
    return b;
}

int maksimum(int a, int b, int c) {
    return maksimum(maksimum(a, b), c); // funkcje moga wywolywac inne funkcje
}

// --------------------------------------------------------
// 7) funkcja rekurencyjna - wywoluje sama siebie
// --------------------------------------------------------
// Rekurencja to sytuacja, w ktorej funkcja w swoim ciele wywoluje
// SAMA SIEBIE, zwykle z mniejszym/prostszym argumentem. Kazda
// funkcja rekurencyjna MUSI miec "warunek stopu" (przypadek
// bazowy), inaczej wywolywalaby sie w nieskonczonosc.

int silnia(int n) {
    if (n <= 1) {
        return 1; // przypadek bazowy - tu rekurencja sie zatrzymuje
    }
    return n * silnia(n - 1); // wywolanie samej siebie z mniejszym n
}

int main() {

    // wywolanie funkcji bez parametrow
    przywitajSie();
    cout << endl;

    // wywolanie funkcji z parametrami
    cout << "Podaj swoje imie: ";
    string imie;
    cin >> imie;
    cout << "Podaj swoj wiek: ";
    int wiek;
    cin >> wiek;
    przywitajOsobe(imie, wiek);

    cout << endl;

    // uzycie funkcji, ktora cos zwraca
    int suma = dodaj(4, 7);
    cout << "4 + 7 = " << suma << endl;

    if (czyParzysta(suma)) {
        cout << suma << " jest liczba parzysta." << endl;
    } else {
        cout << suma << " jest liczba nieparzysta." << endl;
    }

    cout << endl;

    // uzycie wartosci domyslnej
    cout << "potega(5) = " << potega(5) << endl;       // uzyje domyslnego wykladnika = 2
    cout << "potega(5, 3) = " << potega(5, 3) << endl;  // podajemy wlasny wykladnik

    cout << endl;

    // przekazywanie przez referencje - funkcja zmienia oryginal
    int x = 10;
    cout << "x przed podwojeniem: " << x << endl;
    podwoj(x);
    cout << "x po podwojeniu: " << x << endl;

    int p = 1, q = 2;
    cout << "przed zamiana: p = " << p << ", q = " << q << endl;
    zamien(p, q);
    cout << "po zamianie:   p = " << p << ", q = " << q << endl;

    cout << endl;

    // przeciazone funkcje - kompilator sam wybiera wersje
    cout << "maksimum(3, 9) = " << maksimum(3, 9) << endl;
    cout << "maksimum(2.5, 1.1) = " << maksimum(2.5, 1.1) << endl;
    cout << "maksimum(4, 8, 6) = " << maksimum(4, 8, 6) << endl;

    cout << endl;

    // funkcja rekurencyjna
    cout << "Podaj liczbe, z ktorej policzymy silnie: ";
    int n;
    cin >> n;
    cout << n << "! = " << silnia(n) << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "void nazwa(parametry) { ... }        -> funkcja, ktora nic nie zwraca" << endl;
    cout << "typ nazwa(parametry) { return x; }   -> funkcja, ktora zwraca wartosc typu 'typ'" << endl;
    cout << "parametr = wartosc                   -> wartosc domyslna parametru" << endl;
    cout << "typ &parametr                        -> przekazanie przez referencje (mozna zmienic oryginal)" << endl;
    cout << "kilka funkcji o tej samej nazwie      -> przeciazanie (overloading)" << endl;
    cout << "funkcja wywolujaca sama siebie        -> rekurencja (potrzebuje przypadku bazowego!)" << endl;


    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: funkcje
    // --------------------------------------------------------
    // 1. Napisz funkcje sprawdzajaca, czy podana liczba jest pierwsza.
    // 2. Napisz funkcje liczaca NWD (najwiekszy wspolny dzielnik) dwoch liczb algorytmem Euklidesa.
    // 3. Napisz funkcje liczaca NWW (najmniejsza wspolna wielokrotnosc) dwoch liczb, korzystajac z funkcji NWD.
    // 4. Napisz funkcje zamieniajaca stopnie Celsjusza na Fahrenheita i odwrotnie (dwie osobne funkcje).
    // 5. Napisz funkcje zwracajaca sume cyfr podanej liczby.
    // 6. Napisz funkcje odwracajaca podana liczbe (np. 123 -> 321).
    // 7. Napisz funkcje sprawdzajaca, czy podany tekst jest palindromem.
    // 8. Napisz funkcje rekurencyjna liczaca n-ty wyraz ciagu Fibonacciego.
    // 9. Napisz funkcje z parametrem domyslnym liczaca pole prostokata, gdzie domyslnie jest to kwadrat (bok = wysokosc).
    // 10. Napisz funkcje zamieniajaca miejscami dwie zmienne typu string, korzystajac z referencji.
    // 11. Napisz funkcje zwracajaca wiekszy z dwoch elementow, przeciazona dla int, double i string.
    // 12. Napisz funkcje liczaca srednia arytmetyczna elementow przekazanego vectora.
    // 13. Napisz funkcje sprawdzajaca, czy podany rok jest przestepny.
    // 14. Napisz funkcje rekurencyjna liczaca sume cyfr liczby (bez uzycia petli).
    // 15. Napisz funkcje zamieniajaca wszystkie male litery w napisie na wielkie (i odwrotnie).
    // 16. Napisz funkcje liczaca potege liczby (podstawa^wykladnik) rekurencyjnie.
    // 17. Napisz funkcje generujaca i wypisujaca tabliczke mnozenia do podanego n.
    // 18. Napisz funkcje zliczajaca, ile razy dany znak wystepuje w napisie.
    // 19. Napisz funkcje sprawdzajaca, czy podana tablica jest posortowana rosnaco.
    // 20. Napisz zestaw funkcji realizujacych prosty kalkulator (dodaj, odejmij, pomnoz, podziel) wywolywanych z main() na podstawie wyboru uzytkownika.

    return 0;
}