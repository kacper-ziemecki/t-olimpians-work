// ============================================================
//  TUTORIAL: INSTRUKCJA WARUNKOWA if / else W C++ 
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// if / else pozwala programowi PODEJMOWAC DECYZJE - wykonac
// rozny kod w zaleznosci od tego, czy jakis warunek jest
// prawdziwy (true), czy falszywy (false).

#include <iostream>
#include <string>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) samo if - "jesli warunek jest prawdziwy, zrob to"
    // --------------------------------------------------------
    // Skladnia:
    //   if (warunek) {
    //       kod, ktory wykona sie TYLKO gdy warunek jest true
    //   }

    int wiek = 17;

    if (wiek >= 18) {
        cout << "Jestes pelnoletni." << endl;
    }
    // jesli warunek jest falszywy, po prostu nic sie nie wypisze

    cout << endl;


    // --------------------------------------------------------
    // 2) if / else - "jesli tak, to to; a jesli nie, to tamto"
    // --------------------------------------------------------

    if (wiek >= 18) {
        cout << "Mozesz wejsc na koncert." << endl;
    } else {
        cout << "Musisz poczekac az bedziesz pelnoletni." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 3) operatory porownania - z czego skladaja sie warunki
    // --------------------------------------------------------
    //   ==   rowne              (UWAGA: to nie to samo co pojedyncze =)
    //   !=   rozne
    //   >    wieksze
    //   <    mniejsze
    //   >=   wieksze lub rowne
    //   <=   mniejsze lub rowne
    //
    // WAZNE: pojedyncze "=" to PRZYPISANIE wartosci (np. int x = 5;),
    // a podwojne "==" to PORONYWANIE dwoch wartosci. To bardzo czesty
    // blad poczatkujacych - trzeba na to uwazac!

    int a = 5, b = 3;

    cout << "a == b: " << (a == b) << endl; // wypisze 0 (false)
    cout << "a != b: " << (a != b) << endl; // wypisze 1 (true)
    cout << "a > b:  " << (a > b) << endl;  // wypisze 1 (true)
    // w C++ true wypisuje sie jako 1, a false jako 0

    cout << endl;


    // --------------------------------------------------------
    // 4) else if - kilka warunkow po kolei
    // --------------------------------------------------------
    // Program sprawdza warunki PO KOLEI od gory i wykonuje kod
    // TYLKO dla pierwszego, ktory jest prawdziwy. Reszta jest
    // pomijana, nawet jesli tez bylaby prawdziwa.

    cout << "Podaj swoja ocene z klasowki (1-6): ";
    int ocena;
    cin >> ocena;

    if (ocena == 6) {
        cout << "Celujaco! Super robota." << endl;
    } else if (ocena == 5) {
        cout << "Bardzo dobrze!" << endl;
    } else if (ocena == 4) {
        cout << "Dobrze." << endl;
    } else if (ocena == 3) {
        cout << "Dostatecznie, ale zaliczone." << endl;
    } else if (ocena >= 1) {
        cout << "Trzeba jeszcze poćwiczyć." << endl;
    } else {
        cout << "To nie jest poprawna ocena." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 5) operatory logiczne - laczenie kilku warunkow
    // --------------------------------------------------------
    //   &&   ORAZ (AND)  -> caly warunek jest true, gdy OBA sa true
    //   ||   LUB (OR)    -> caly warunek jest true, gdy CHOC JEDEN jest true
    //   !    NIE (NOT)   -> odwraca true na false i odwrotnie

    cout << "Podaj swoj wiek: ";
    int twojWiek;
    cin >> twojWiek;

    cout << "Czy masz karte rowerowa? (1 = tak, 0 = nie): ";
    int maKarte;
    cin >> maKarte;

    if (twojWiek >= 10 && maKarte == 1) {
        cout << "Mozesz jezdzic rowerem po drodze." << endl;
    } else {
        cout << "Nie mozesz jeszcze jezdzic rowerem po drodze." << endl;
    }

    // przyklad z ||
    if (twojWiek < 7 || twojWiek > 100) {
        cout << "To dosc nietypowy wiek do tego pytania." << endl;
    } else {
        cout << "To calkiem typowy wiek." << endl;
    }

    // przyklad z ! (negacja)
    bool jestSlonecznie = false;
    if (!jestSlonecznie) {
        cout << "Nie jest slonecznie - moze wziac parasol?" << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 6) if zagniezdzone (if w srodku if)
    // --------------------------------------------------------
    // Mozna wkladac if jeden w drugi, zeby sprawdzac kolejne
    // warunki dopiero, gdy pierwszy jest spelniony.

    cout << "Podaj liczbe: ";
    int liczba;
    cin >> liczba;

    if (liczba >= 0) {
        cout << liczba << " jest liczba nieujemna." << endl;
        if (liczba % 2 == 0) {
            cout << "Dodatkowo jest parzysta." << endl;
        } else {
            cout << "Dodatkowo jest nieparzysta." << endl;
        }
    } else {
        cout << liczba << " jest liczba ujemna." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "if (warunek) { ... }                 -> wykonaj, jesli warunek jest true" << endl;
    cout << "if (...) { ... } else { ... }        -> jedno z dwoch, w zaleznosci od warunku" << endl;
    cout << "else if (...)                        -> kolejny warunek do sprawdzenia" << endl;
    cout << "==, !=, >, <, >=, <=                 -> operatory porownania" << endl;
    cout << "&&, ||, !                            -> ORAZ, LUB, NIE (laczenie warunkow)" << endl;
    cout << "if wewnatrz if                       -> mozna zagniezdzac warunki" << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: if / else
    // --------------------------------------------------------
    // 1. Napisz program sprawdzający, czy podana liczba jest dodatnia, ujemna czy równa zeru.
    // 2. Zaimplementuj prosty kalkulator BMI wypisujący kategorię wagową (niedowaga/norma/nadwaga) na podstawie obliczonego wskaźnika.
    // 3. Napisz program sprawdzający, czy rok jest przestępny (używając && i ||).
    // 4. Zbuduj program klasyfikujący trójkąt na podstawie trzech boków (równoboczny, równoramienny, różnoboczny).
    // 5. Napisz program sprawdzający, czy podane trzy liczby mogą być bokami trójkąta (nierówność trójkąta).
    // 6. Zaimplementuj system oceniania: na podstawie punktów (0-100) wypisz odpowiednią ocenę (2-6).
    // 7. Napisz program sprawdzający, czy podany rok, miesiąc i dzień tworzą poprawną datę.
    // 8. Zbuduj prosty semafor: na podstawie wpisanego koloru (string) wypisz komunikat "stój", "uwaga" lub "jedź".
    // 9. Napisz program sprawdzający, czy liczba jest podzielna przez 3, 5, obie te liczby czy żadną (klasyczny FizzBuzz dla jednej liczby).
    // 10. Zaimplementuj kalkulator, który na podstawie wybranego znaku działania wykonuje odpowiednią operację, z obsługą dzielenia przez zero.
    // 11. Napisz program sprawdzający, czy podany znak jest samogłoską, spółgłoską czy cyfrą.
    // 12. Zbuduj system rekomendacji ubioru na podstawie temperatury i tego, czy pada deszcz (zagnieżdżone if).
    // 13. Napisz program sprawdzający, czy gracz wygrał w prostej grze (np. porównanie dwóch liczb - kto ma większą, wygrywa).
    // 14. Zaimplementuj walidator hasła: sprawdź, czy ma odpowiednią długość i czy zawiera przynajmniej jedną cyfrę.
    // 15. Napisz program klasyfikujący porę dnia (rano/południe/wieczór/noc) na podstawie podanej godziny.
    // 16. Zbuduj prosty system rabatowy: im więcej produktów kupionych, tym większy rabat procentowy.
    // 17. Napisz program sprawdzający, czy punkt (x, y) leży wewnątrz koła o danym promieniu i środku (0,0).
    // 18. Zaimplementuj sprawdzanie, czy liczba jest liczbą pierwszą (używając pętli i if wewnątrz).
    // 19. Napisz program symulujący prosty bramkarz do klubu: wpuszczaj tylko osoby pełnoletnie z ważnym biletem (dwa warunki).
    // 20. Zbuduj kalkulator przedziałów: sprawdź, w jakim przedziale liczbowym (np. 0-10, 11-20, 21-30) mieści się podana liczba, używając serii else if.

    return 0;
}