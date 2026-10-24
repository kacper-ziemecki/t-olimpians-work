// ============================================================
//  TUTORIAL: PETLA for W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// Petla for to petla while "w wygodniejszej formie" - najlepiej
// uzywac jej, gdy z gory WIEMY, ile razy chcemy cos powtorzyc
// (np. "zrob to 10 razy", "przejdz przez liczby od 1 do n").
//
// Skladnia:
//   for (start; warunek; zmiana) {
//       kod, ktory sie powtarza
//   }
//
// Wszystkie 3 czesci sa w JEDNEJ linijce:
//   start   -> wykonuje sie RAZ, na samym poczatku
//   warunek -> sprawdzany PRZED kazdym przebiegiem
//   zmiana  -> wykonuje sie PO kazdym przebiegu

#include <iostream>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) najprostsza petla for - liczenie od 1 do 5
    // --------------------------------------------------------
    // To dokladnie to samo, co przyklad z while, ale krocej:
    //   int i = 1;        -> start
    //   i <= 5             -> warunek
    //   i = i + 1  (i++)   -> zmiana

    for (int i = 1; i <= 5; i++) {
        cout << "i = " << i << endl;
    }
    // UWAGA: zmienna "i" istnieje TYLKO wewnatrz petli for -
    // poza nawiasami klamrowymi juz jej nie ma.

    cout << endl;


    // --------------------------------------------------------
    // 2) i++ oraz i-- - skrocony zapis zwiekszania/zmniejszania
    // --------------------------------------------------------
    //   i++   to to samo co   i = i + 1
    //   i--   to to samo co   i = i - 1
    // Mozna tez pisac i += 2 (to samo co i = i + 2) itd.

    for (int i = 0; i < 5; i++) {
        cout << "i++ : i = " << i << endl;
    }

    for (int i = 5; i > 0; i--) {
        cout << "i-- : i = " << i << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 3) odliczanie od n do 1 (wczytanego od uzytkownika)
    // --------------------------------------------------------

    cout << "Podaj liczbe n: ";
    int n;
    cin >> n;

    for (int i = n; i >= 1; i--) {
        cout << i << " ";
    }
    cout << "START!" << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) petla z krokiem innym niz 1
    // --------------------------------------------------------
    // Zamiast i++ mozna uzyc dowolnej zmiany, np. i += 2, zeby
    // przechodzic co 2 liczby.

    cout << "Liczby parzyste od 0 do 10:" << endl;
    for (int i = 0; i <= 10; i += 2) {
        cout << i << " ";
    }
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) suma liczb od 1 do n
    // --------------------------------------------------------
    // Petla for jest idealna do takich zadan, bo od razu widac
    // "od-do" w jednej linijce.

    int suma = 0;
    for (int i = 1; i <= n; i++) {
        suma = suma + i;
    }
    cout << "Suma liczb od 1 do " << n << " wynosi: " << suma << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) tabliczka mnozenia - petla for W SRODKU innej petli for
    // --------------------------------------------------------
    // To nazywa sie "petla zagniezdzona". Petla wewnetrzna
    // wykonuje sie CALA dla kazdego przebiegu petli zewnetrznej.

    cout << "Podaj rozmiar tabliczki mnozenia: ";
    int rozmiar;
    cin >> rozmiar;

    for (int wiersz = 1; wiersz <= rozmiar; wiersz++) {
        for (int kolumna = 1; kolumna <= rozmiar; kolumna++) {
            cout << (wiersz * kolumna) << "\t"; // \t robi odstep tabulacji
        }
        cout << endl; // nowa linia po kazdym wierszu
    }

    cout << endl;


    // --------------------------------------------------------
    // 7) break i continue dzialaja tak samo jak w while
    // --------------------------------------------------------

    cout << "Liczby od 1 do 20, ale zatrzymujemy sie na pierwszej podzielnej przez 7:" << endl;
    for (int i = 1; i <= 20; i++) {
        if (i % 7 == 0) {
            cout << i << " - to jest podzielne przez 7, koniec!" << endl;
            break;
        }
        cout << i << " ";
    }

    cout << endl;

    cout << "Liczby od 1 do 10 z pominieciem wielokrotnosci 3:" << endl;
    for (int i = 1; i <= 10; i++) {
        if (i % 3 == 0) {
            continue; // pomijamy wielokrotnosci 3
        }
        cout << i << " ";
    }
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "for (start; warunek; zmiana) { ... }  -> gdy wiemy, ile razy powtorzyc" << endl;
    cout << "i++ / i--                             -> zwiekszenie / zmniejszenie o 1" << endl;
    cout << "i += krok                             -> zmiana o dowolny krok" << endl;
    cout << "petla for w petli for                 -> petla zagniezdzona (np. tabliczka mnozenia)" << endl;
    cout << "break;                                -> natychmiast konczy cala petle" << endl;
    cout << "continue;                              -> pomija reszte biezacego przebiegu petli" << endl;

    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: pętla for
    // --------------------------------------------------------
    // 1. Napisz program wypisujący tabliczkę mnożenia dla liczb od 1 do 10 (zagnieżdżona pętla for, bez wpisywania rozmiaru).
    // 2. Zaimplementuj wypisywanie trójkąta z gwiazdek o zadanej wysokości przy użyciu zagnieżdżonych pętli for.
    // 3. Napisz program obliczający sumę i iloczyn liczb od 1 do n za pomocą pętli for.
    // 4. Zbuduj program wypisujący wszystkie liczby pierwsze w zakresie od 2 do n.
    // 5. Napisz program wypisujący ciąg Fibonacciego dla pierwszych n wyrazów przy użyciu pętli for.
    // 6. Zaimplementuj program rysujący szachownicę (naprzemienne znaki) o zadanym rozmiarze przy użyciu zagnieżdżonej pętli for.
    // 7. Napisz program sumujący wyłącznie liczby parzyste w zakresie od 1 do n.
    // 8. Zbuduj kalkulator silni z wykorzystaniem pętli for zamiast while.
    // 9. Napisz program wypisujący piramidę liczb (1, 12, 123, 1234, ...) o zadanej wysokości.
    // 10. Zaimplementuj wyszukiwanie największej i najmniejszej liczby w ciągu wpisanym przez użytkownika (n liczb, pętla for).
    // 11. Napisz program wypisujący wszystkie dzielniki podanej liczby przy użyciu pętli for.
    // 12. Zbuduj generator tabeli konwersji stopni Celsjusza na Fahrenheity (np. od 0 do 100 co 10 stopni).
    // 13. Napisz program obliczający sumę cyfr wszystkich liczb od 1 do n.
    // 14. Zaimplementuj rysowanie rombu z gwiazdek o zadanej wysokości przy użyciu zagnieżdżonych pętli for.
    // 15. Napisz program sprawdzający, ile liczb w zakresie 1-n jest podzielnych zarówno przez 3, jak i przez 5.
    // 16. Zbuduj program wypisujący pierwsze n liczb ciągu arytmetycznego o zadanym pierwszym wyrazie i różnicy.
    // 17. Napisz program obliczający wartość wyrażenia potęgowego (a^n) przy użyciu pętli for (bez funkcji pow()).
    // 18. Zaimplementuj wypisywanie "odwróconej" tabliczki mnożenia (od największego iloczynu do najmniejszego).
    // 19. Napisz program zliczający wystąpienia każdej cyfry (0-9) w podanej liczbie przy użyciu pętli for.
    // 20. Zbuduj symulację prostego zegara - pętla for wypisująca godziny od 0 do 23 z minutami co 15 minut (zagnieżdżona pętla).

    return 0;
}