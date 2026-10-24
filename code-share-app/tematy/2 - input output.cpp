// ============================================================
//  TUTORIAL: WEJSCIE I WYJSCIE W C++ 
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Do wejscia/wyjscia potrzebujemy naglowka <iostream>.
//
//   cout  -> WYPISYWANIE czegos na ekran   (C-out = "wyjscie")
//   cin   -> WCZYTYWANIE czegos od uzytkownika (C-in = "wejscie")
//
// Operatory, ktorych uzywamy:
//   <<  -> "wypisz TO"        (przy cout)
//   >>  -> "wczytaj DO TEGO"  (przy cin)

#include <iostream>
#include <string>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) cout - wypisywanie na ekran
    // --------------------------------------------------------
    // Kazde << dokleja kolejna rzecz do wypisywanej linii.
    // endl (albo "\n") przechodzi do nowej linii.

    cout << "Witaj w programie!" << endl;
    cout << "Mozna wypisac tekst" << " i doleczyc do niego " << "kolejny tekst." << endl;

    int liczba = 5;
    cout << "Mozna tez wypisac liczbe: " << liczba << endl;

    // Kilka wartosci naraz w jednej linii cout:
    cout << "Wynik to: " << liczba << ", a jego kwadrat to: " << liczba * liczba << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) cin - wczytywanie JEDNEJ wartosci od uzytkownika
    // --------------------------------------------------------
    // Zeby wczytac cos od uzytkownika, trzeba miec juz gotowa
    // zmienna odpowiedniego typu, a potem uzyc cin >> zmienna.
    //
    // cin sam wie, jakiego typu wartosci sie spodziewac, patrzac
    // na typ zmiennej po prawej stronie >>.

    cout << "Podaj swoj wiek: ";
    int wiek;
    cin >> wiek; // program czeka, az wpiszesz liczbe i wcisniesz ENTER

    cout << "Masz " << wiek << " lat." << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) wczytywanie roznych typow
    // --------------------------------------------------------

    cout << "Podaj swoja srednia ocen (np. 4.75): ";
    float srednia;
    cin >> srednia;
    cout << "Twoja srednia to: " << srednia << endl;

    cout << "Podaj jedna litere (np. A): ";
    char litera;
    cin >> litera;
    cout << "Wpisales litere: " << litera << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) wczytywanie stringow - UWAGA na spacje!
    // --------------------------------------------------------
    // cin >> string_zmienna wczytuje TYLKO JEDNO SLOWO - zatrzymuje
    // sie na pierwszej napotkanej spacji.

    cout << "Podaj swoje imie (jedno slowo): ";
    string imie;
    cin >> imie;
    cout << "Czesc, " << imie << "!" << endl;

    cout << endl;

    // Jesli chcemy wczytac CALA LINIE tekstu (razem ze spacjami,
    // np. imie i nazwisko), uzywamy funkcji getline(cin, zmienna).
    //
    // WAZNE: po zwyklym cin >> zostaje w "kolejce wejscia" znak
    // konca linii (ENTER), ktory trzeba najpierw "wyczyscic" - stad
    // linijka cin.ignore() ponizej, przed uzyciem getline.

    cin.ignore(); // czysci pozostaly po poprzednim cin znak ENTER

    cout << "Podaj imie i nazwisko: ";
    string imieNazwisko;
    getline(cin, imieNazwisko);
    cout << "Podales: " << imieNazwisko << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) wczytywanie kilku wartosci w jednej linii
    // --------------------------------------------------------
    // Mozna wczytac kilka zmiennych jednym cin, oddzielajac je
    // spacja podczas wpisywania (np. "3 7").

    cout << "Podaj dwie liczby oddzielone spacja (np. 3 7): ";
    int x, y;
    cin >> x >> y;
    cout << "Podales " << x << " i " << y << ", ich suma to " << (x + y) << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "cout << cos;              -> wypisuje 'cos' na ekran" << endl;
    cout << "cin >> zmienna;           -> wczytuje jedno slowo/liczbe do zmiennej" << endl;
    cout << "cin >> a >> b;            -> wczytuje kilka wartosci naraz" << endl;
    cout << "getline(cin, zmienna);    -> wczytuje cala linie tekstu (ze spacjami)" << endl;
    cout << "cin.ignore();             -> czysci ENTER pozostawiony przez poprzedni cin" << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: wejście/wyjście
    // --------------------------------------------------------
    // 1. Napisz program pytający o imię i wiek, a następnie wypisujący spersonalizowane powitanie.
    // 2. Wczytaj trzy liczby w jednej linii (cin >> a >> b >> c) i wypisz ich sumę oraz iloczyn.
    // 3. Napisz program wczytujący pełne imię i nazwisko za pomocą getline() i wypisujący je odwrotnie (nazwisko, imię).
    // 4. Zbuduj prosty kalkulator: wczytaj dwie liczby i znak działania (+, -, *, /), a program wypisze wynik.
    // 5. Napisz program wczytujący zdanie (getline) i zliczający liczbę słów w nim.
    // 6. Zaimplementuj mini-ankietę: wczytaj kilka odpowiedzi (string, int, float) i wypisz podsumowanie.
    // 7. Napisz program, który wczytuje linię tekstu, a następnie wypisuje ją wielkimi literami.
    // 8. Wczytaj cenę produktu (float) i ilość sztuk (int), a program obliczy i wypisze łączny koszt.
    // 9. Napisz program symulujący prosty formularz rejestracyjny (imię, wiek, e-mail jako string).
    // 10. Zbadaj różnicę między cin >> zmienna a getline(cin, zmienna) na przykładzie wczytywania adresu zawierającego spacje.
    // 11. Napisz program, który wczytuje liczbę linii tekstu (podaną przez użytkownika) i wypisuje je ponumerowane.
    // 12. Stwórz program pytający użytkownika o hasło, a następnie potwierdzenie hasła, i sprawdzający, czy się zgadzają.
    // 13. Napisz program wczytujący datę urodzenia (dzień, miesiąc, rok jako trzy int) i wypisujący ją w formacie DD.MM.RRRR.
    // 14. Zaimplementuj prosty quiz z jednym pytaniem, wczytujący odpowiedź użytkownika i sprawdzający jej poprawność.
    // 15. Napisz program, który wczytuje tekst zakończony słowem "koniec" (linia po linii) i wypisuje wszystkie wczytane linie na końcu.
    // 16. Zbuduj konwerter jednostek: użytkownik podaje wartość i wybiera jednostkę (np. km/mile), program wypisuje wynik.
    // 17. Napisz program pytający o imiona trzech osób i wypisujący je w kolejności alfabetycznej (bez użycia sortowania - porównaj ręcznie).
    // 18. Stwórz prosty "czat" - program wczytuje wiadomość i odpowiada jednym z kilku szablonów w zależności od słów kluczowych.
    // 19. Napisz program wczytujący współrzędne punktu (x, y) i wypisujący, w której ćwiartce układu współrzędnych się znajduje.
    // 20. Zaimplementuj program do wczytywania danych o produkcie (nazwa - getline, cena - cin) i wypisujący paragon.

    return 0;
}