// ============================================================
//  TUTORIAL: ZAOKRAGLANIE LICZB W C++ - od zera
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// C++ daje kilka roznych funkcji do "obchodzenia sie" z czescia
// ulamkowa liczby - kazda robi to troche inaczej. Znajduja sie
// w naglowku <cmath>.

#include <iostream>
#include <cmath>       // potrzebne do round(), floor(), ceil(), trunc()
#include <iomanip>     // potrzebne do setprecision() (punkt 5)
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) round() - zaokraglanie do najblizszej liczby calkowitej
    // --------------------------------------------------------
    // round(x) zaokragla "normalnie", tak jak w szkole:
    //   - czesc ulamkowa >= 0.5  -> w gore
    //   - czesc ulamkowa < 0.5   -> w dol
    // Zwraca liczbe typu float/double, wiec czesto rzutujemy
    // wynik na int, jesli chcemy "czysta" liczbe calkowita.

    cout << "round(4.3) = " << round(4.3) << endl;   // 4
    cout << "round(4.5) = " << round(4.5) << endl;   // 5
    cout << "round(4.7) = " << round(4.7) << endl;   // 5
    cout << "round(-2.5) = " << round(-2.5) << endl; // -3 (od zera)

    // rzutowanie na int, zeby dostac "czysta" liczbe calkowita:
    int zaokraglona = (int) round(4.7);
    cout << "int zaokraglona = " << zaokraglona << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) floor() - zaokraglanie W DOL (podloga)
    // --------------------------------------------------------
    // floor(x) ZAWSZE zaokragla w dol, niezaleznie od czesci
    // ulamkowej - "obcina" ja i zostawia mniejsza liczbe calkowita.
    // Nazwa "floor" (podloga) oznacza: "najblizsza calkowita
    // liczba, ktora nie jest wieksza od x".

    cout << "floor(4.1) = " << floor(4.1) << endl;  // 4
    cout << "floor(4.9) = " << floor(4.9) << endl;  // 4
    cout << "floor(-4.1) = " << floor(-4.1) << endl; // -5 (UWAGA: w dol, czyli bardziej ujemnie!)

    cout << endl;


    // --------------------------------------------------------
    // 3) ceil() - zaokraglanie W GORE (sufit)
    // --------------------------------------------------------
    // ceil(x) ZAWSZE zaokragla w gore, niezaleznie od czesci
    // ulamkowej. Nazwa "ceil" (sufit, od "ceiling") oznacza:
    // "najblizsza calkowita liczba, ktora nie jest mniejsza od x".

    cout << "ceil(4.1) = " << ceil(4.1) << endl;   // 5
    cout << "ceil(4.9) = " << ceil(4.9) << endl;   // 5
    cout << "ceil(-4.1) = " << ceil(-4.1) << endl; // -4 (UWAGA: w gore, czyli bliziej zera!)

    cout << endl;


    // --------------------------------------------------------
    // 4) trunc() i rzutowanie (int) - obcinanie czesci ulamkowej
    // --------------------------------------------------------
    // trunc(x) po prostu "odcina" czesc ulamkowa i zostawia to,
    // co jest przed przecinkiem - BEZ zaokraglania w ktorakolwiek
    // strone. To samo robi rzutowanie (int)x na liczbach dodatnich
    // i ujemnych.

    cout << "trunc(4.9) = " << trunc(4.9) << endl;   // 4
    cout << "trunc(-4.9) = " << trunc(-4.9) << endl; // -4 (nie -5!)

    cout << "(int)4.9 = " << (int)4.9 << endl;    // 4
    cout << "(int)-4.9 = " << (int)-4.9 << endl;  // -4

    cout << endl;


    // --------------------------------------------------------
    // PORONYWANIE 4 FUNKCJI NA JEDNEJ LICZBIE - zeby zobaczyc roznice
    // --------------------------------------------------------

    double liczba = 3.7;
    cout << "Dla liczby " << liczba << ":" << endl;
    cout << "  round() -> " << round(liczba) << " (zaokraglenie normalne)" << endl;
    cout << "  floor() -> " << floor(liczba) << " (zawsze w dol)" << endl;
    cout << "  ceil()  -> " << ceil(liczba) << " (zawsze w gore)" << endl;
    cout << "  trunc() -> " << trunc(liczba) << " (obciecie czesci ulamkowej)" << endl;

    cout << endl;

    double liczbaUjemna = -3.7;
    cout << "Dla liczby " << liczbaUjemna << ":" << endl;
    cout << "  round() -> " << round(liczbaUjemna) << endl;
    cout << "  floor() -> " << floor(liczbaUjemna) << endl;
    cout << "  ceil()  -> " << ceil(liczbaUjemna) << endl;
    cout << "  trunc() -> " << trunc(liczbaUjemna) << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) zaokraglanie do konkretnej liczby miejsc po przecinku
    // --------------------------------------------------------
    // round(), floor() i ceil() zaokraglaja do liczby CALKOWITEJ.
    // Zeby zaokraglic np. do 2 miejsc po przecinku, mnozymy przez
    // 100, zaokraglamy, a potem dzielimy z powrotem przez 100.

    double cena = 19.6789;

    double cenaZaokraglona = round(cena * 100) / 100.0;
    cout << "19.6789 zaokraglone do 2 miejsc po przecinku: " << cenaZaokraglona << endl;

    // UWAGA: cout czasem "obcina" wyswietlane miejsca po przecinku
    // przy wypisywaniu. Zeby wymusic pokazanie dokladnie 2 miejsc
    // po przecinku na ekranie, uzywamy fixed i setprecision(2)
    // z naglowka <iomanip>:

    cout << fixed << setprecision(2);
    cout << "Ta sama cena, wypisana z setprecision(2): " << cenaZaokraglona << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) praktyczny przyklad - zaokraglanie oceny wpisanej przez uzytkownika
    // --------------------------------------------------------

    cout << "Podaj srednia ocen (np. 4.63): ";
    double srednia;
    cin >> srednia;

    cout << "Zaokraglona do calosci: " << round(srednia) << endl;
    cout << "Zaokraglona w dol: " << floor(srednia) << endl;
    cout << "Zaokraglona w gore: " << ceil(srednia) << endl;
    cout << "Zaokraglona do 1 miejsca po przecinku: " << round(srednia * 10) / 10.0 << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "round(x)   -> zaokragla normalnie, do najblizszej calkowitej" << endl;
    cout << "floor(x)   -> zawsze zaokragla W DOL (podloga)" << endl;
    cout << "ceil(x)    -> zawsze zaokragla W GORE (sufit)" << endl;
    cout << "trunc(x)   -> obcina czesc ulamkowa (jak rzutowanie (int)x)" << endl;
    cout << "round(x*100)/100.0  -> sposob na zaokraglenie do 2 miejsc po przecinku" << endl;
    cout << "setprecision(n) + fixed -> wymusza wyswietlenie n miejsc po przecinku w cout" << endl;
    cout << "Wszystkie funkcje sa w naglowku <cmath>." << endl;

    return 0;
}