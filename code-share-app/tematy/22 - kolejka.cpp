// ============================================================
//  TUTORIAL: KOLEJKA (queue) W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// queue to kontener dzialajacy na zasadzie FIFO (First In, First
// Out) - "kto pierwszy wszedl, ten pierwszy wyjdzie". Dziala
// dokladnie tak jak zwykla kolejka w sklepie: osoba, ktora
// ustawila sie pierwsza, jest tez pierwsza obslugiwana.
//
// W przeciwienstwie do vector, w queue NIE MOZNA zajrzec do
// srodka ani wyciagnac dowolnego elementu - mozna dodawac tylko
// NA KONIEC, a wyciagac/podgladac tylko OD PRZODU.
//
// Zeby uzywac queue, trzeba dolaczyc naglowek <queue>.

#include <iostream>
#include <string>
#include <queue>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) tworzenie kolejki i dodawanie elementow - push()
    // --------------------------------------------------------
    // push() dodaje nowy element NA KONIEC kolejki.

    queue<string> kolejkaDoKasy;

    kolejkaDoKasy.push("Kacper");
    kolejkaDoKasy.push("Ania");
    kolejkaDoKasy.push("Bartek");

    cout << "Liczba osob w kolejce: " << kolejkaDoKasy.size() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) podglad pierwszego elementu - front()
    // --------------------------------------------------------
    // front() pokazuje element, ktory jest NA POCZATKU kolejki
    // (czyli ten, ktory bedzie obsluzony jako nastepny), ale
    // GO NIE USUWA.

    cout << "Kto jest teraz na poczatku kolejki? " << kolejkaDoKasy.front() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) usuwanie elementu z przodu - pop()
    // --------------------------------------------------------
    // pop() usuwa element z POCZATKU kolejki. UWAGA: pop() nie
    // zwraca usunietego elementu - jesli chcemy go poznac,
    // najpierw uzywamy front(), a dopiero potem pop().

    string obslugiwanaOsoba = kolejkaDoKasy.front();
    kolejkaDoKasy.pop();
    cout << "Obsluzono: " << obslugiwanaOsoba << endl;
    cout << "Liczba osob w kolejce po obsluzeniu: " << kolejkaDoKasy.size() << endl;
    cout << "Teraz na poczatku kolejki jest: " << kolejkaDoKasy.front() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) sprawdzanie, czy kolejka jest pusta - empty()
    // --------------------------------------------------------
    // Zanim uzyjemy front() albo pop(), warto sprawdzic, czy
    // kolejka w ogole nie jest pusta - front()/pop() na pustej
    // kolejce to blad, ktory moze wywalic caly program!

    if (!kolejkaDoKasy.empty()) {
        cout << "Kolejka nie jest pusta, wciaz czeka: " << kolejkaDoKasy.size() << " osob(a)." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 5) opróżnianie calej kolejki w petli
    // --------------------------------------------------------
    // Typowy schemat: dopoki kolejka nie jest pusta, patrzymy
    // na front(), robimy z nim cos, po czym wywolujemy pop().

    cout << "Obsluga reszty kolejki po kolei:" << endl;
    while (!kolejkaDoKasy.empty()) {
        cout << "Obsluguje: " << kolejkaDoKasy.front() << endl;
        kolejkaDoKasy.pop();
    }
    cout << "Kolejka jest teraz pusta." << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) praktyczny przyklad: symulacja kolejki do kasy
    // --------------------------------------------------------
    // Uzytkownik podaje imiona, wpisujac 'koniec', gdy skonczy.
    // Program dodaje je do kolejki, a potem obsluguje w kolejnosci
    // wejscia (FIFO).

    cout << "Podaj imiona osob ustawiajacych sie w kolejce (wpisz 'koniec', aby zakonczyc):" << endl;
    queue<string> nowaKolejka;
    string imie;
    cin >> imie;
    while (imie != "koniec") {
        nowaKolejka.push(imie);
        cin >> imie;
    }

    cout << "Kolejnosc obslugi:" << endl;
    int numer = 1;
    while (!nowaKolejka.empty()) {
        cout << numer << ". " << nowaKolejka.front() << endl;
        nowaKolejka.pop();
        numer++;
    }

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "queue<typ> q;         -> kolejka FIFO (pierwszy wszedl, pierwszy wyjdzie)" << endl;
    cout << "q.push(x);            -> dodaje element na koniec kolejki" << endl;
    cout << "q.front()             -> podglad pierwszego elementu (bez usuwania)" << endl;
    cout << "q.pop();               -> usuwa pierwszy element (nic nie zwraca!)" << endl;
    cout << "q.empty() / q.size()  -> czy pusta / ile elementow" << endl;
    cout << "Kolejki NIE MOZNA indeksowac ani przegladac w petli for jak vectora." << endl;


    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: kolejka (queue)
    // --------------------------------------------------------
    // 1. Zaimplementuj symulacje kolejki w sklepie - dodawaj klientow i obsluguj ich po kolei, wypisujac komunikaty.
    // 2. Napisz program, ktory za pomoca queue wypisuje elementy tablicy w takiej samej kolejnosci, w jakiej zostaly dodane.
    // 3. Zaimplementuj przeszukiwanie grafu wszerz (BFS) korzystajac z queue.
    // 4. Napisz funkcje sprawdzajaca, czy kolejka (przekazana jako kopia) zawiera dany element.
    // 5. Zaimplementuj symulacje drukarki: zadania drukowania trafiaja do kolejki i sa realizowane po kolei.
    // 6. Napisz program generujacy pierwsze n liczb w kolejnosci "poziomow" drzewa binarnego z uzyciem queue (BFS na drzewie).
    // 7. Zaimplementuj kolejke o ograniczonym rozmiarze - jesli jest pelna, najpierw usun najstarszy element (jak bufor cykliczny).
    // 8. Napisz program symulujacy obsluge klientow w kilku kasach jednoczesnie (kilka obiektow queue).
    // 9. Zaimplementuj algorytm "gorącego ziemniaka" (Josephus problem) korzystajac z queue.
    // 10. Napisz funkcje kopiujaca zawartosc kolejki do vectora bez niszczenia oryginalnej kolejki.
    // 11. Zaimplementuj kolejke priorytetowa "recznie" na podstawie zwyklej queue (zawsze wstawiaj we wlasciwe miejsce - trudniejsze zadanie).
    // 12. Napisz program symulujacy ruch pojazdow na jednym pasie (kazdy pojazd wjezdza i wyjezdza w kolejnosci FIFO).
    // 13. Zaimplementuj sprawdzanie, czy ciag nawiasow roznych typow (np. () [] {}) jest poprawny, korzystajac z queue i stack razem.
    // 14. Napisz program zliczajacy, ile osob zostalo obsluzonych w kolejce w ciagu symulowanych "rund" (np. co runda obsluzone jest maks. 3 osoby).
    // 15. Zaimplementuj kolejke okragla (round-robin) do przydzielania czasu procesora miedzy procesy o rownym priorytecie.
    // 16. Napisz funkcje odwracajaca kolejnosc elementow w queue (bez uzycia dodatkowego kontenera innego niz stack).
    // 17. Zaimplementuj symulacje poczekalni u lekarza - pacjenci przychodza, czekaja w kolejce, sa wzywani po kolei.
    // 18. Napisz program sprawdzajacy, czy dwie kolejki maja dokladnie takie same elementy w takiej samej kolejnosci.
    // 19. Zaimplementuj system kolejkowy do obslugi zgloszen (ticketow) z numerkami, gdzie kazdy klient dostaje kolejny numer.
    // 20. Napisz program symulujacy prosty automat do sprzedazy biletow, gdzie klienci czekaja w kolejce, a kasjer obsluguje ich po kolei az do zamkniecia kasy.

    return 0;
}