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
    // ZADANIA - poćwicz temat: instrukcja warunkowa if/else
    // --------------------------------------------------------
    // 1. Napisz program, ktory wczytuje liczbe i sprawdza, czy jest dodatnia, ujemna, czy rowna zero.
    // 2. Napisz program sprawdzajacy, czy podana liczba jest parzysta, czy nieparzysta.
    // 3. Wczytaj trzy liczby i wypisz najwieksza z nich, korzystajac z if/else if.
    // 4. Napisz program klasyfikujacy ocene (1-6) na "niedostateczna", "zdana" lub "bardzo dobra".
    // 5. Wczytaj rok i sprawdz, czy jest przestepny (podzielny przez 4, ale nie przez 100, chyba ze jest tez podzielny przez 400).
    // 6. Napisz program sprawdzajacy, czy trzy podane liczby moga byc bokami trojkata (nierownosc trojkata).
    // 7. Wczytaj wiek i wypisz, do jakiej kategorii wiekowej nalezy osoba: dziecko, nastolatek, dorosly, senior.
    // 8. Napisz program obliczajacy najwieksza z czterech liczb bez uzycia funkcji max().
    // 9. Wczytaj liczbe godzin i minut i sprawdz, czy podany czas jest poprawny (0-23 godziny, 0-59 minut).
    // 10. Napisz program sprawdzajacy, czy podany znak jest samogloska, spolgloska, cyfra czy inny znak.
    // 11. Wczytaj trzy boki trojkata i sprawdz, czy jest on rownoboczny, rownoramienny czy roznoboczny.
    // 12. Napisz kalkulator wykonujacy dzialanie (+, -, *, /) na dwoch liczbach wybrane przez uzytkownika, z obsluga dzielenia przez zero.
    // 13. Wczytaj punkt (x, y) i sprawdz, w ktorej cwiartce ukladu wspolrzednych sie znajduje.
    // 14. Napisz program sprawdzajacy, czy podana liczba jest liczba pierwsza (dla malych liczb, bez optymalizacji).
    // 15. Wczytaj miesiac (1-12) i wypisz jego nazwe oraz liczbe dni w tym miesiacu (z uwzglednieniem roku przestepnego dla lutego).
    // 16. Napisz program porownujacy dwie liczby zmiennoprzecinkowe z uwzglednieniem malego marginesu bledu (epsilon).
    // 17. Wczytaj oceny z trzech przedmiotow i sprawdz, czy uczen zdal (srednia >= 3.0 i zadna ocena nie jest 1).
    // 18. Napisz program klasyfikujacy trojkat na podstawie dlugosci bokow jako ostrokatny, prostokatny lub rozwartokatny (twierdzenie Pitagorasa).
    // 19. Wczytaj dwie daty (dzien, miesiac) i sprawdz, ktora z nich jest wczesniejsza w roku.
    // 20. Napisz program symulujacy prosty system logowania: sprawdza login i haslo, a po 3 nieudanych probach blokuje dostep (uzyj petli i if).

    return 0;
}