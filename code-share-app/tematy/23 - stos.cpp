// ============================================================
//  TUTORIAL: STOS (stack) W C++
// ============================================================
//
// Ten plik mozna po prostu SKOMPILOWAC I URUCHOMIC.
// Program bedzie o cos pytal - trzeba wpisywac odpowiedzi
// w konsoli i wcisnac ENTER po kazdej z nich.
//
// stack to kontener dzialajacy na zasadzie LIFO (Last In, First
// Out) - "kto ostatni wszedl, ten pierwszy wyjdzie". Dziala jak
// stos talerzy: talerz odkladamy NA WIERZCH, a zdejmujemy TEZ
// zawsze ten, ktory jest NA WIERZCHU (ostatnio odlozony).
//
// Tak jak w queue, w stack NIE MOZNA zajrzec do srodka - mamy
// dostep tylko do elementu na samej gorze (na "wierzchu") stosu.
//
// Zeby uzywac stack, trzeba dolaczyc naglowek <stack>.

#include <iostream>
#include <string>
#include <stack>
using namespace std;

int main() {

    // --------------------------------------------------------
    // 1) tworzenie stosu i dodawanie elementow - push()
    // --------------------------------------------------------
    // push() dodaje nowy element NA WIERZCH stosu.

    stack<string> stosTalerzy;

    stosTalerzy.push("Talerz 1");
    stosTalerzy.push("Talerz 2");
    stosTalerzy.push("Talerz 3");

    cout << "Liczba talerzy na stosie: " << stosTalerzy.size() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 2) podglad elementu na wierzchu - top()
    // --------------------------------------------------------
    // top() pokazuje element, ktory jest teraz NA WIERZCHU stosu
    // (czyli ten, ktory zostanie zdjety jako pierwszy), ale
    // GO NIE USUWA.

    cout << "Co jest teraz na wierzchu stosu? " << stosTalerzy.top() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 3) usuwanie elementu z wierzchu - pop()
    // --------------------------------------------------------
    // pop() usuwa element z WIERZCHU stosu. Tak jak w queue,
    // pop() nic nie zwraca - jesli chcemy poznac usuwany element,
    // najpierw uzywamy top(), a dopiero potem pop().

    string zdjetyTalerz = stosTalerzy.top();
    stosTalerzy.pop();
    cout << "Zdjeto ze stosu: " << zdjetyTalerz << endl;
    cout << "Liczba talerzy po zdjeciu: " << stosTalerzy.size() << endl;
    cout << "Teraz na wierzchu jest: " << stosTalerzy.top() << endl;

    cout << endl;


    // --------------------------------------------------------
    // 4) sprawdzanie, czy stos jest pusty - empty()
    // --------------------------------------------------------
    // Podobnie jak przy queue - zanim uzyjemy top() albo pop(),
    // trzeba sprawdzic, czy stos nie jest pusty, bo inaczej
    // program moze sie wywalic.

    if (!stosTalerzy.empty()) {
        cout << "Stos nie jest pusty, zostalo: " << stosTalerzy.size() << " talerz(y)." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // 5) opróżnianie calego stosu w petli
    // --------------------------------------------------------
    // Tak jak przy queue - dopoki stos nie jest pusty, patrzymy
    // na top(), robimy z nim cos, po czym wywolujemy pop().
    // Zwroc uwage, ze kolejnosc zdejmowania jest ODWROTNA do
    // kolejnosci dodawania!

    cout << "Zdejmowanie reszty stosu:" << endl;
    while (!stosTalerzy.empty()) {
        cout << "Zdejmuje: " << stosTalerzy.top() << endl;
        stosTalerzy.pop();
    }
    cout << "Stos jest teraz pusty." << endl;

    cout << endl;


    // --------------------------------------------------------
    // 6) praktyczny przyklad: sprawdzanie poprawnosci nawiasow
    // --------------------------------------------------------
    // Stos swietnie nadaje sie do sprawdzania, czy nawiasy w
    // wyrazeniu sa poprawnie dopasowane. Pomysl: kazdy nawias
    // otwierajacy odkladamy na stos; kazdy zamykajacy powinien
    // pasowac do tego, co jest na wierzchu stosu.

    cout << "Podaj wyrazenie z nawiasami okraglymi, np. (()()) : ";
    string wyrazenie;
    cin >> wyrazenie;

    stack<char> stosNawiasow;
    bool poprawne = true;

    for (char znak : wyrazenie) {
        if (znak == '(') {
            stosNawiasow.push(znak); // otwierajacy - odkladamy na stos
        } else if (znak == ')') {
            if (stosNawiasow.empty()) {
                // zamykajacy nawias bez pasujacego otwierajacego
                poprawne = false;
                break;
            }
            stosNawiasow.pop(); // pasujacy otwierajacy - zdejmujemy go
        }
    }

    // jesli na koncu zostal jakis niesparowany otwierajacy nawias, tez jest blad
    if (!stosNawiasow.empty()) {
        poprawne = false;
    }

    if (poprawne) {
        cout << "Nawiasy sa poprawnie dopasowane!" << endl;
    } else {
        cout << "Nawiasy NIE sa poprawnie dopasowane." << endl;
    }

    cout << endl;


    // --------------------------------------------------------
    // PODSUMOWANIE
    // --------------------------------------------------------
    cout << "=== PODSUMOWANIE ===" << endl;
    cout << "stack<typ> s;         -> stos LIFO (ostatni wszedl, pierwszy wyjdzie)" << endl;
    cout << "s.push(x);            -> dodaje element na wierzch stosu" << endl;
    cout << "s.top()               -> podglad elementu na wierzchu (bez usuwania)" << endl;
    cout << "s.pop();              -> usuwa element z wierzchu (nic nie zwraca!)" << endl;
    cout << "s.empty() / s.size()  -> czy pusty / ile elementow" << endl;
    cout << "Typowe zastosowanie: sprawdzanie dopasowania nawiasow, cofanie akcji (undo)." << endl;


    // --------------------------------------------------------
    // ZADANIA - poćwicz temat: stos (stack)
    // --------------------------------------------------------
    // 1. Napisz program sprawdzajacy poprawnosc dopasowania nawiasow trzech typow: (), [], {}.
    // 2. Zaimplementuj funkcje odwracajaca kolejnosc znakow w napisie za pomoca stosu.
    // 3. Napisz program sprawdzajacy, czy podany napis jest palindromem, korzystajac ze stosu.
    // 4. Zaimplementuj konwerter zapisu dziesietnego liczby na zapis binarny za pomoca stosu.
    // 5. Napisz program symulujacy funkcje "cofnij" (undo) dla prostego edytora tekstu (stos wykonanych akcji).
    // 6. Zaimplementuj obliczanie wartosci wyrazenia w odwrotnej notacji polskiej (ONP / RPN) za pomoca stosu.
    // 7. Napisz funkcje sprawdzajaca, czy stos (przekazany jako kopia) zawiera dany element, bez uzycia dodatkowego kontenera innego niz stack.
    // 8. Zaimplementuj przegladanie labiryntu metoda DFS (przeszukiwanie w glab) korzystajac ze stosu.
    // 9. Napisz program konwertujacy wyrazenie z notacji infiksowej (np. "3+4*2") na notacje postfiksowa za pomoca stosu.
    // 10. Zaimplementuj sprawdzanie, czy sekwencja operacji push/pop na stosie jest mozliwa do uzyskania dla danej permutacji.
    // 11. Napisz funkcje kopiujaca caly stos do vectora, zachowujac oryginalny stos bez zmian.
    // 12. Zaimplementuj minStack - stos, ktory oprocz zwyklych operacji potrafi w O(1) zwrocic najmniejszy aktualnie znajdujacy sie na nim element.
    // 13. Napisz program symulujacy historie przegladarki internetowej (stos "wstecz" i stos "do przodu").
    // 14. Zaimplementuj sprawdzanie poprawnosci sekwencji tagow HTML/XML za pomoca stosu (np. <b><i>...</i></b>).
    // 15. Napisz funkcje liczaca, o ile trzeba zmniejszyc stos elementow, zeby usunac wszystkie elementy wieksze od zadanej wartosci (z gory stosu).
    // 16. Zaimplementuj algorytm zamiany rekurencji na iteracje z wlasnym stosem (np. dla liczenia silni albo Fibonacciego).
    // 17. Napisz program sprawdzajacy, czy dana sekwencja nawiasow moze zostac poprawiona przez dodanie jak najmniejszej liczby nawiasow.
    // 18. Zaimplementuj sortowanie elementow stosu przy uzyciu tylko jednego dodatkowego stosu (bez innych struktur danych).
    // 19. Napisz kalkulator dzialajacy na zapisie ONP (odwrotna notacja polska), wczytujacy wyrazenie od uzytkownika.
    // 20. Zaimplementuj wykrywanie cyklu w prostym grafie skierowanym za pomoca DFS opartego na stosie.

    return 0;
}