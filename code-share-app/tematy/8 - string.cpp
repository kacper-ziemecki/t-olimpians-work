// ============================================================
//  TUTORIAL: string W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// string to typ przechowujacy TEKST (ciag znakow). Zeby go
// uzywac, trzeba dolaczyc naglowek <string>.

#include <iostream>
#include <string>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) tworzenie stringow
    // --------------------------------------------------------
    // string zawsze piszemy w cudzyslowach: "tekst".

    string imie = "Kacper";
    string zdanie = "Ala ma kota";
    string pusty = ""; // string moze byc pusty

    cout << "imie = " << imie << endl;
    cout << "zdanie = " << zdanie << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) sklejanie stringow (+ i +=)
    // --------------------------------------------------------

    string powitanie = "Czesc, " + imie + "!";
    cout << powitanie << endl;

    string napis = "Ala";
    napis += " ma"; // += dokleja na koniec
    napis += " kota";
    cout << napis << endl;

    // mozna tez sklejac string z pojedynczym znakiem
    string litera = "A";
    litera += 'B';
    cout << "litera + 'B' = " << litera << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) dlugosc stringa - .length() albo .size()
    // --------------------------------------------------------
    // Obie funkcje robia dokladnie to samo - zwracaja liczbe
    // znakow w stringu.

    cout << "\"" << zdanie << "\" ma " << zdanie.length() << " znakow." << endl;
    cout << "\"" << zdanie << "\" ma " << zdanie.size() << " znakow (to samo co length())." << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) dostep do pojedynczych znakow - [] i .at()
    // --------------------------------------------------------
    // String to w srodku "tablica znakow" - mozemy odwolac sie
    // do konkretnego znaku po jego indeksie. Indeksy zaczynaja
    // sie od 0!

    cout << "Pierwsza litera imienia: " << imie[0] << endl;
    cout << "Ostatnia litera imienia: " << imie[imie.length() - 1] << endl;

    // mozna tez zmienic pojedynczy znak:
    string slowo = "Kot";
    slowo[0] = 'B';
    cout << "Po zmianie: " << slowo << endl; // wypisze "Bot"

    cout << endl;


    // --------------------------------------------------------
    // 5) porownywanie stringow (==, !=)
    // --------------------------------------------------------
    // Stringi mozna porownywac tak samo jak liczby - sprawdza
    // to, czy tekst jest DOKLADNIE taki sam (wielkosc liter tez
    // ma znaczenie! "Tak" i "tak" to co innego).

    cout << "Podaj haslo: ";
    string haslo;
    cin >> haslo;

    if (haslo == "start123") {
        cout << "Poprawne haslo!" << endl;
    } else {
        cout << "Bledne haslo." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 6) szukanie fragmentu tekstu - .find()
    // --------------------------------------------------------
    // .find(fragment) zwraca INDEKS, na ktorym fragment sie
    // zaczyna, albo specjalna wartosc string::npos, jesli nie
    // znaleziono go w ogole.

    string tekst = "Programowanie jest super";

    if (tekst.find("super") != string::npos) {
        cout << "Znaleziono slowo 'super' w tekscie!" << endl;
    } else {
        cout << "Nie znaleziono slowa 'super'." << endl;
    }

    if (tekst.find("Python") != string::npos) {
        cout << "Znaleziono slowo 'Python'." << endl;
    } else {
        cout << "Nie znaleziono slowa 'Python' w tekscie." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 7) wycinanie fragmentu tekstu - .substr()
    // --------------------------------------------------------
    // .substr(od, ile_znakow) wycina kawalek stringa.
    //   od          -> indeks, od ktorego zaczynamy wycinac
    //   ile_znakow  -> ile znakow wziac (mozna pominac -> "do konca")

    string napisDoWyciecia = "Wspolne Kodowanie";

    cout << napisDoWyciecia.substr(0, 7) << endl;   // "Wspolne"
    cout << napisDoWyciecia.substr(8) << endl;       // "Kodowanie" (od indeksu 8 do konca)

    cout << endl;


    // --------------------------------------------------------
    // 8) przechodzenie po kazdym znaku stringa (petla for)
    // --------------------------------------------------------
    // Skoro string jest jak tablica znakow, mozna przejsc po
    // nim petla for, tak samo jak po tablicy.

    string slowo2 = "Kodowanie";
    cout << "Znaki slowa \"" << slowo2 << "\" jeden pod drugim:" << endl;
    for (int i = 0; i < slowo2.length(); i++) {
        cout << slowo2[i] << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 9) liczenie konkretnych znakow w stringu - przyklad
    // --------------------------------------------------------
    // Przydatny wzorzec: przejdz po stringu i policz, ile razy
    // wystapil dany znak.

    cout << "Podaj slowo: ";
    string sprawdzaneSlowo;
    cin >> sprawdzaneSlowo;

    cout << "Podaj litere do policzenia: ";
    char szukanaLitera;
    cin >> szukanaLitera;

    int licznik = 0;
    for (int i = 0; i < sprawdzaneSlowo.length(); i++) {
        if (sprawdzaneSlowo[i] == szukanaLitera) {
            licznik++;
        }
    }
    cout << "Litera '" << szukanaLitera << "' wystepuje " << licznik << " razy." << endl;

    cout << endl;


    // --------------------------------------------------------
    // 10) zamiana string <-> liczba
    // --------------------------------------------------------
    // to_string(liczba)  -> zamienia liczbe na string
    // stoi(string)       -> zamienia string na int ("string to int")
    // stof(string)       -> zamienia string na float ("string to float")

    int wiek = 17;
    string wiekJakoTekst = "Mam " + to_string(wiek) + " lat.";
    cout << wiekJakoTekst << endl;

    string tekstowaLiczba = "42";
    int liczbaZTekstu = stoi(tekstowaLiczba);
    cout << "Liczba z tekstu + 8 = " << (liczbaZTekstu + 8) << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "string s = \"tekst\";        -> tworzenie stringa" << endl;
    cout << "s1 + s2, s += s2            -> sklejanie stringow" << endl;
    cout << "s.length() / s.size()       -> dlugosc stringa" << endl;
    cout << "s[i]                        -> pojedynczy znak (indeksy od 0)" << endl;
    cout << "s1 == s2                    -> porownanie stringow" << endl;
    cout << "s.find(fragment)            -> szuka fragmentu, zwraca string::npos jesli brak" << endl;
    cout << "s.substr(od, ile)           -> wycina fragment tekstu" << endl;
    cout << "to_string(liczba)           -> liczba -> string" << endl;
    cout << "stoi(s) / stof(s)           -> string -> int / float" << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: string
    // --------------------------------------------------------
    // 1. Napisz program sprawdzający, czy podany napis jest palindromem (czyta się tak samo od przodu i od tyłu).
    // 2. Zaimplementuj funkcję zliczającą samogłoski i spółgłoski w podanym tekście.
    // 3. Napisz program odwracający kolejność słów w zdaniu (nie liter!).
    // 4. Zbuduj program zamieniający wszystkie małe litery na wielkie i odwrotnie (swap case) w podanym tekście.
    // 5. Napisz program sprawdzający, czy dwa podane stringi są anagramami (zawierają te same litery w innej kolejności).
    // 6. Zaimplementuj usuwanie wszystkich spacji z podanego tekstu.
    // 7. Napisz program zliczający wystąpienia każdego słowa w zdaniu.
    // 8. Zbuduj prosty walidator adresu e-mail - sprawdź, czy zawiera dokładnie jeden znak '@' i przynajmniej jedną kropkę po nim.
    // 9. Napisz program zamieniający pierwszą literę każdego słowa w zdaniu na wielką (tytułowanie/capitalize).
    // 10. Zaimplementuj funkcję usuwającą z tekstu wszystkie wystąpienia podanego słowa.
    // 11. Napisz program sprawdzający, czy jeden string jest "rotacją" drugiego (np. "abcd" i "cdab").
    // 12. Zbuduj koder Cezara - przesuń każdą literę tekstu o zadaną liczbę pozycji w alfabecie.
    // 13. Napisz program znajdujący najdłuższe słowo w zdaniu.
    // 14. Zaimplementuj funkcję sprawdzającą, czy nawiasy w podanym stringu są poprawnie zbalansowane (tylko okrągłe).
    // 15. Napisz program zamieniający liczby zapisane słownie (np. "jeden dwa trzy") na cyfry i z powrotem (dla 0-9).
    // 16. Zbuduj program wyodrębniający z tekstu wszystkie liczby (ciągi cyfr) i sumujący je.
    // 17. Napisz program sprawdzający podobieństwo dwóch stringów (ile znaków na tych samych pozycjach się zgadza).
    // 18. Zaimplementuj proste kompresowanie tekstu - zamień powtarzające się znaki na znak + liczbę powtórzeń (np. "aaabb" -> "a3b2").
    // 19. Napisz program dzielący zdanie na słowa bez użycia funkcji bibliotecznych do dzielenia (ręcznie, po spacjach) i zapisujący je do vectora.
    // 20. Zbuduj prosty walidator numeru telefonu - sprawdź, czy string składa się wyłącznie z cyfr i ma dokładnie 9 znaków.

    return 0;
}