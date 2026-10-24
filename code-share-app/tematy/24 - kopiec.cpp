// ============================================================
//  TUTORIAL: KOPIEC (priority_queue) W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// priority_queue ("kolejka priorytetowa") to kontener, ktory
// zawsze trzyma na wierzchu NAJWIEKSZY (domyslnie) element,
// niezaleznie od kolejnosci dodawania. To bardzo przydatne, gdy
// zamiast "kto pierwszy" liczy sie "kto najwazniejszy" -
// np. pacjent na ostrym dyzurze w najgorszym stanie, albo
// zadanie o najwyzszym priorytecie.
//
// W srodku priority_queue dziala jak specjalnie zorganizowane
// drzewo binarne (kopiec/heap), ale nie musimy znac szczegolow
// implementacji, zeby z niego korzystac.
//
// Zeby uzywac priority_queue, trzeba dolaczyc naglowek <queue>
// (tak, ten sam co dla zwyklej kolejki!).

#include <iostream>
#include <string>
#include <queue>
#include <vector>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) tworzenie kopca (max-heap) i dodawanie - push()
    // --------------------------------------------------------
    // Domyslnie priority_queue to MAX-HEAP - na wierzchu zawsze
    // jest NAJWIEKSZY dotychczas dodany element.

    priority_queue<int> kopiec;

    kopiec.push(5);
    kopiec.push(1);
    kopiec.push(9);
    kopiec.push(3);

    cout << "Liczba elementow w kopcu: " << kopiec.size() << endl;
    cout << "Najwiekszy element (na wierzchu): " << kopiec.top() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) usuwanie elementu z wierzchu - pop()
    // --------------------------------------------------------
    // Podobnie jak w stack/queue - top() pokazuje element bez
    // usuwania, a pop() go usuwa (i nic nie zwraca).

    cout << "Usuwam najwiekszy element: " << kopiec.top() << endl;
    kopiec.pop();
    cout << "Nowy najwiekszy element: " << kopiec.top() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) wyciaganie WSZYSTKICH elementow w kolejnosci malejacej
    // --------------------------------------------------------
    // Jesli w petli bedziemy caly czas brac top() i robic pop(),
    // elementy pojawia sie w kolejnosci OD NAJWIEKSZEGO DO
    // NAJMNIEJSZEGO - to swietny sposob na sortowanie malejace!

    priority_queue<int> kopiec2;
    kopiec2.push(4);
    kopiec2.push(8);
    kopiec2.push(2);
    kopiec2.push(15);
    kopiec2.push(7);

    cout << "Elementy w kolejnosci od najwiekszego do najmniejszego:" << endl;
    while (!kopiec2.empty()) {
        cout << kopiec2.top() << " ";
        kopiec2.pop();
    }
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) min-heap - kopiec, gdzie na wierzchu jest NAJMNIEJSZY
    // --------------------------------------------------------
    // Zeby na wierzchu byl najmniejszy element zamiast
    // najwiekszego, podajemy dodatkowe parametry szablonu:
    //   priority_queue<typ, vector<typ>, greater<typ>>
    // "greater<typ>" odwraca domyslna kolejnosc porownywania.

    priority_queue<int, vector<int>, greater<int>> minKopiec;
    minKopiec.push(4);
    minKopiec.push(8);
    minKopiec.push(2);
    minKopiec.push(15);

    cout << "Elementy z min-kopca od najmniejszego do najwiekszego:" << endl;
    while (!minKopiec.empty()) {
        cout << minKopiec.top() << " ";
        minKopiec.pop();
    }
    cout << endl;

    cout << endl;


    // --------------------------------------------------------
    // 5) sprawdzanie, czy kopiec jest pusty - empty()
    // --------------------------------------------------------
    // Tak jak przy stack/queue, przed uzyciem top()/pop() warto
    // sprawdzic, czy kopiec nie jest pusty.

    if (minKopiec.empty()) {
        cout << "minKopiec jest juz pusty." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 6) praktyczny przyklad: obsluga pacjentow wg priorytetu
    // --------------------------------------------------------
    // Uzytkownik podaje numer priorytetu pacjenta (im wiekszy,
    // tym pilniejszy przypadek). Program zawsze obsluguje
    // najpierw pacjenta o najwyzszym priorytecie, niezaleznie od
    // kolejnosci, w jakiej zostali zgloszeni.

    cout << "Podaj priorytety kolejnych pacjentow (liczby calkowite, -1 aby zakonczyc):" << endl;
    priority_queue<int> pacjenci;
    int priorytet;
    cin >> priorytet;
    while (priorytet != -1) {
        pacjenci.push(priorytet);
        cin >> priorytet;
    }

    cout << "Kolejnosc obslugi pacjentow (od najpilniejszego):" << endl;
    while (!pacjenci.empty()) {
        cout << "Obsluguje pacjenta o priorytecie " << pacjenci.top() << endl;
        pacjenci.pop();
    }

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "priority_queue<typ> pq;                          -> max-heap: na wierzchu najwiekszy element" << endl;
    cout << "priority_queue<typ, vector<typ>, greater<typ>> pq -> min-heap: na wierzchu najmniejszy element" << endl;
    cout << "pq.push(x);                                       -> dodaje element" << endl;
    cout << "pq.top()                                          -> podglad elementu o najwyzszym priorytecie" << endl;
    cout << "pq.pop();                                         -> usuwa element o najwyzszym priorytecie" << endl;
    cout << "pq.empty() / pq.size()                            -> czy pusty / ile elementow" << endl;
    cout << "Typowe zastosowanie: kolejki priorytetowe, algorytm Dijkstry, sortowanie przez kopcowanie." << endl;


    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: kopiec (priority_queue)
    // --------------------------------------------------------
    // 1. Napisz program znajdujacy k najwiekszych elementow w tablicy za pomoca priority_queue.
    // 2. Napisz program znajdujacy k najmniejszych elementow w tablicy za pomoca min-kopca.
    // 3. Zaimplementuj sortowanie przez kopcowanie (heap sort) korzystajac z priority_queue.
    // 4. Zaimplementuj algorytm Dijkstry znajdujacy najkrotsza sciezke w grafie wazonym, korzystajac z priority_queue jako kolejki priorytetowej.
    // 5. Napisz program obliczajacy mediane "na biezaco" z naplywajacego strumienia liczb, korzystajac z dwoch kopcow (min i max).
    // 6. Zaimplementuj system obslugi zgloszen o priorytetach, gdzie kazde zgloszenie ma priorytet i czas dodania (sortuj wedlug priorytetu, a przy remisie wedlug czasu).
    // 7. Napisz funkcje laczaca k posortowanych list w jedna posortowana liste, korzystajac z priority_queue.
    // 8. Zaimplementuj kopiec przechowujacy struktury (np. Zadanie: nazwa + priorytet) zamiast zwyklych liczb.
    // 9. Napisz program symulujacy planowanie zadan procesora (scheduler) wybierajacy zawsze zadanie o najwyzszym priorytecie.
    // 10. Zaimplementuj algorytm Prima do znajdowania minimalnego drzewa rozpinajacego, korzystajac z priority_queue.
    // 11. Napisz program znajdujacy k-ty najwiekszy element w tablicy bez pelnego sortowania, korzystajac z kopca o rozmiarze k.
    // 12. Zaimplementuj system kolejki VIP: klienci VIP maja zawsze wyzszy priorytet niz zwykli, niezaleznie od kolejnosci zgloszenia.
    // 13. Napisz funkcje sprawdzajaca, czy dany zestaw liczb moze zostac polaczony w jedna liczbe minimalnym kosztem (klasyczny problem laczenia lin/plikow za pomoca kopca).
    // 14. Zaimplementuj symulacje szpitalnego SOR-u: pacjenci maja priorytety zalezne od stanu zdrowia, obsluz ich w wlasciwej kolejnosci.
    // 15. Napisz program generujacy k najmniejszych sum par elementow z dwoch posortowanych tablic, korzystajac z kopca.
    // 16. Zaimplementuj wlasny prosty kopiec (bez uzycia priority_queue) na tablicy, z operacjami wstaw i usunMaksimum.
    // 17. Napisz program obliczajacy top-k najczesciej wystepujacych elementow w tablicy, korzystajac z mapy i kopca razem.
    // 18. Zaimplementuj system rezerwacji lotow: pasazerowie z wyzsza klasa biletu maja pierwszenstwo przy wsiadaniu.
    // 19. Napisz funkcje laczaca kopiec z priorytetami zadan tak, aby zadania o tym samym priorytecie byly obslugiwane w kolejnosci FIFO (uzyj pary priorytet+czas).
    // 20. Zaimplementuj algorytm A* (lub uproszczona jego wersje) korzystajac z priority_queue do wyboru najbardziej obiecujacego wierzcholka.

    return 0;
}