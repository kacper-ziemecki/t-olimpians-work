// ============================================================
//  TUTORIAL: MODULO (%) W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Operator % (modulo) daje RESZTE z dzielenia calkowitego.
// Dziala TYLKO na liczbach calkowitych (int), nie na float!

#include <iostream>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) co to jest modulo - podstawa
    // --------------------------------------------------------
    // a % b to reszta, jaka zostaje, gdy dzielimy a przez b.
    //
    // Przyklad: 7 / 2 = 3 reszty 1   ->   7 % 2 = 1
    //           7 / 2 = 3 (bo 2*3=6, a 7-6=1 zostaje w reszcie)

    cout << "7 / 2 = " << (7 / 2) << " (dzielenie calkowite - obcina reszte)" << endl;
    cout << "7 % 2 = " << (7 % 2) << " (sama reszta z tego dzielenia)" << endl;

    cout << endl;

    cout << "10 % 3 = " << (10 % 3) << "  (bo 3*3=9, zostaje 1)" << endl;
    cout << "9 % 3  = " << (9 % 3) << "   (bo 3*3=9, zostaje 0 - dzieli sie bez reszty)" << endl;
    cout << "4 % 10 = " << (4 % 10) << "  (4 jest mniejsze niz 10, wiec cala liczba to reszta)" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) najczestsze zastosowanie: sprawdzanie parzystosci
    // --------------------------------------------------------
    // Liczba jest PARZYSTA, gdy dzieli sie przez 2 bez reszty,
    // czyli gdy liczba % 2 == 0.
    // Liczba jest NIEPARZYSTA, gdy liczba % 2 == 1.

    cout << "Podaj liczbe calkowita: ";
    int liczba;
    cin >> liczba;

    if (liczba % 2 == 0) {
        cout << liczba << " jest liczba PARZYSTA." << endl;
    } else {
        cout << liczba << " jest liczba NIEPARZYSTA." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 3) sprawdzanie, czy jedna liczba dzieli sie przez druga
    // --------------------------------------------------------
    // a % b == 0  oznacza, ze a dzieli sie przez b bez reszty
    // (czyli b jest dzielnikiem a).

    cout << "Podaj liczbe: ";
    int x;
    cin >> x;

    cout << "Podaj dzielnik do sprawdzenia: ";
    int dzielnik;
    cin >> dzielnik;

    if (x % dzielnik == 0) {
        cout << x << " dzieli sie przez " << dzielnik << " bez reszty." << endl;
    } else {
        cout << x << " NIE dzieli sie przez " << dzielnik << " bez reszty (reszta to " << (x % dzielnik) << ")." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 4) "zawijanie" wartosci - modulo trzyma liczbe w zakresie
    // --------------------------------------------------------
    // Bardzo przydatne np. przy dniach tygodnia, godzinach na
    // zegarze, indeksach w tablicy "kolowej" itp. - modulo
    // sprawia, ze liczba "zawija sie" i nigdy nie wychodzi poza
    // dany zakres.

    // Przyklad: dzien tygodnia (0 = poniedzialek, ..., 6 = niedziela)
    int dzienStartowy = 5; // sobota
    int zaIleDni = 10;

    int dzienKoncowy = (dzienStartowy + zaIleDni) % 7;
    cout << "Jesli dzis jest dzien nr " << dzienStartowy
         << " i minie " << zaIleDni << " dni, to bedzie dzien nr "
         << dzienKoncowy << " (numeracja 0-6)." << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) UWAGA na liczby ujemne
    // --------------------------------------------------------
    // W C++ znak wyniku % jest taki sam jak znak lewego argumentu
    // (tego przed %). Warto o tym pamietac, bo to zaskakuje wielu
    // poczatkujacych.

    cout << "-7 % 3 = " << (-7 % 3) << "  (wynik ujemny, bo -7 jest ujemne)" << endl;
    cout << "7 % -3 = " << (7 % -3) << "  (wynik dodatni, bo 7 jest dodatnie)" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) UWAGA: modulo dziala tylko na int, nie na float!
    // --------------------------------------------------------
    // Ponizsza linia gdyby byla odkomentowana, DA BLAD KOMPILACJI:
    //
    //   float f = 5.5f % 2.0f; // <-- BLAD! % nie dziala na float
    //
    // Jesli potrzebujemy "reszty" z liczb zmiennoprzecinkowych,
    // trzeba uzyc funkcji fmod() z naglowka <cmath> - ale to juz
    // temat na inny tutorial.

    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "a % b               -> reszta z dzielenia a przez b (tylko na int)" << endl;
    cout << "liczba % 2 == 0     -> sprawdzenie, czy liczba jest parzysta" << endl;
    cout << "a % b == 0          -> sprawdzenie, czy a dzieli sie przez b bez reszty" << endl;
    cout << "(x + n) % zakres    -> 'zawijanie' liczby w danym zakresie (np. dni tygodnia)" << endl;
    cout << "modulo z liczb ujemnych -> znak wyniku taki jak znak lewego argumentu" << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: modulo
    // --------------------------------------------------------
    // 1. Napisz program sprawdzający, czy podana liczba jest podzielna przez 3, 5 i 15 jednocześnie.
    // 2. Zaimplementuj klasyczny FizzBuzz od 1 do 100 z wykorzystaniem modulo.
    // 3. Napisz program wypisujący ostatnią cyfrę podanej liczby (używając % 10).
    // 4. Zbuduj konwerter sekund na format godziny:minuty:sekundy (wykorzystaj % i /).
    // 5. Napisz program sprawdzający, czy dana liczba jest liczbą pierwszą, wykorzystując modulo do sprawdzania podzielności.
    // 6. Zaimplementuj generator wzoru "zegara" - dla podanej godziny w formacie 24h wypisz odpowiadającą godzinę w formacie 12h (użyj % 12).
    // 7. Napisz program obliczający sumę cyfr podanej liczby, wykorzystując modulo i dzielenie całkowite w pętli.
    // 8. Zbuduj program symulujący "kołowy" ruch po planszy - gracz porusza się o n pól po planszy 0-9 i wraca na początek (modulo).
    // 9. Napisz program sprawdzający, czy podana liczba jest palindromem (czyta się tak samo od przodu i od tyłu), wykorzystując modulo do wyodrębniania cyfr.
    // 10. Zaimplementuj kalkulator reszty do wydania - podaj kwotę do zapłaty i podaną kwotę, oblicz resztę w banknotach/monetach (100, 50, 20, 10, 5, 1) za pomocą modulo i dzielenia.
    // 11. Napisz program wyliczający, który dzień tygodnia wypadnie za n dni, znając dzisiejszy dzień tygodnia (modulo 7).
    // 12. Zbuduj konwerter liczby na system rzymski dla liczb 1-10 (można wykorzystać modulo do rozbicia na cyfry dziesiętne).
    // 13. Napisz program sprawdzający, czy liczba jest liczbą doskonałą (suma jej dzielników właściwych równa się jej samej).
    // 14. Zaimplementuj sprawdzanie podzielności przez 4 dla dat (do wstępnego sprawdzenia lat przestępnych).
    // 15. Napisz program obracający elementy w "kole" - dla podanego indeksu i rozmiaru tablicy oblicz indeks następnego elementu w cyklu (modulo).
    // 16. Zbuduj generator wzorów szachownicy - używając (wiersz + kolumna) % 2 określ kolor pola.
    // 17. Napisz program sprawdzający, ile pełnych tygodni i dodatkowych dni zawiera podana liczba dni.
    // 18. Zaimplementuj prostą funkcję haszującą - dla podanego stringa zsumuj kody ASCII znaków i weź modulo z rozmiaru tablicy haszującej.
    // 19. Napisz program wyznaczający NWD (największy wspólny dzielnik) dwóch liczb algorytmem Euklidesa z wykorzystaniem modulo.
    // 20. Zbuduj kalkulator "co która" - wypisz co n-tą liczbę z zakresu 1-100 (np. co 7), wykorzystując modulo w pętli.

    return 0;
}