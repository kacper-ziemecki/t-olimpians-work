// ============================================================
//  ŚCIĄGA C++ — OLIMPIADA INFORMATYCZNA (początkujący)
// ============================================================

// -------------------------------------------------------
// 0. SZABLON STARTOWY
// -------------------------------------------------------

#include <bits/stdc++.h>
using namespace std;

int main() {
    ios::sync_with_stdio(false);
    cin.tie(nullptr);

    // twój kod tutaj

    return 0;
}

// bits/stdc++.h  <- dołącza WSZYSTKIE biblioteki naraz
// ios::sync...   <- przyspiesza cin/cout (zawsze dawaj na początku main)


// -------------------------------------------------------
// 1. TYPY ZMIENNYCH
// -------------------------------------------------------

int    a = 5;               // liczba całkowita  (-2 mld  .. +2 mld)
long long b = 1e18;         // duża liczba całk. (-9*10^18 .. +9*10^18) <- używaj gdy n > 10^9
double c = 3.14;            // liczba zmiennoprzecinkowa (15 cyfr precyzji)
bool   d = true;            // true / false
char   e = 'A';             // jeden znak
string s = "hello";         // napis

// UWAGA: gdy wynik mnożenia/dodawania może przekroczyć ~2 mld -> użyj long long
// int * int może overflow! rzutuj: (long long)a * b


// -------------------------------------------------------
// 2. WCZYTYWANIE DANYCH (input)
// -------------------------------------------------------

int n;
cin >> n;                               // jedna liczba

long long x;
cin >> x;                               // long long

string line;
getline(cin, line);                     // cała linia jako string

int a, b, c;
cin >> a >> b >> c;                     // kilka liczb z jednej linii

int n; cin >> n;
vector<int> v(n);
for (int i = 0; i < n; i++) cin >> v[i]; // n liczb do wektora

// wczytaj n par
for (int i = 0; i < n; i++) {
    int a, b;
    cin >> a >> b;
}


// -------------------------------------------------------
// 3. WYPISYWANIE DANYCH (output)
// -------------------------------------------------------

cout << "Hello World" << "\n";          // "\n" szybsze niż endl
cout << a << " " << b << "\n";         // liczby oddzielone spacją
cout << fixed << setprecision(2) << 3.14159; // wypisz z 2 miejscami po przecinku -> 3.14

// wypisz wektor
for (int x : v) cout << x << " ";
cout << "\n";


// -------------------------------------------------------
// 4. PRZEPŁYW PROGRAMU (if / else / while / for)
// -------------------------------------------------------

// IF / ELSE
if (a > b) {
    cout << "a wieksze\n";
} else if (a == b) {
    cout << "rowne\n";
} else {
    cout << "b wieksze\n";
}

// FOR — po indeksach
for (int i = 0; i < n; i++) { /* ... */ }
for (int i = n-1; i >= 0; i--) { /* ... */ }   // od tyłu
for (int i = 0; i < n; i += 2) { /* ... */ }   // co dwa

// FOR — po elementach (range-based)
for (int x : v) { /* ... */ }
for (auto& x : v) { x *= 2; }  // modyfikowanie elementów

// WHILE
while (cin >> n) { /* wczytuj aż do końca wejścia */ }

// BREAK / CONTINUE
for (int i = 0; i < n; i++) {
    if (v[i] == 0) continue;   // pomiń zero
    if (v[i] < 0) break;       // zakończ przy ujemnym
}


// -------------------------------------------------------
// 5. FUNKCJE MATEMATYCZNE  (#include <cmath> lub bits/stdc++.h)
// -------------------------------------------------------

max(3, 7)           // -> 7
min(3, 7)           // -> 3
abs(-5)             // -> 5  (dla int)
fabs(-3.14)         // -> 3.14 (dla double)
sqrt(16.0)          // -> 4.0
pow(2.0, 10.0)      // -> 1024.0
floor(3.7)          // -> 3.0  (zaokrąglij w dół)
ceil(3.2)           // -> 4.0  (zaokrąglij w górę)
round(3.5)          // -> 4.0  (standardowe zaokrąglenie)
__gcd(12, 8)        // -> 4    (NWD — Największy Wspólny Dzielnik)
// NWW: a/gcd(a,b)*b


// -------------------------------------------------------
// 6. MODULO (%)
// -------------------------------------------------------

7 % 3       // -> 1  (reszta z dzielenia)
10 % 2      // -> 0  (parzysta)
11 % 2      // -> 1  (nieparzysta)

// Sprawdź parzystość:
if (n % 2 == 0) cout << "parzysta\n";

// Modulo w pętli (przydatne przy cyklicznych indeksach):
int next = (i + 1) % n;   // następny indeks cyklicznie


// -------------------------------------------------------
// 7. TABLICE (array) — stały rozmiar, szybkie
// -------------------------------------------------------

int t[100];                     // tablica 100 intów (niezainicjowana)
int t[100] = {};                // tablica 100 zer
int t[] = {1, 2, 3, 4, 5};     // od razu z wartościami

t[0] = 10;                      // dostęp przez indeks (od 0!)
int dlugosc = sizeof(t) / sizeof(t[0]);  // długość tablicy

// 2D
int mat[3][3] = {};             // macierz 3x3 zer
mat[0][1] = 5;
for (int i = 0; i < 3; i++)
    for (int j = 0; j < 3; j++)
        cout << mat[i][j] << " ";


// -------------------------------------------------------
// 8. VECTOR — tablica dynamiczna (najczęściej używana!)
// -------------------------------------------------------

vector<int> v;                  // pusty wektor
vector<int> v(n);               // wektor n zer
vector<int> v(n, -1);           // wektor n wartości -1
vector<int> v = {1, 2, 3};      // od razu z wartościami

v.push_back(5);     // dodaj na koniec         | O(1)
v.pop_back();       // usuń z końca            | O(1)
v[i]                // dostęp przez indeks     | O(1)
v.size()            // rozmiar                 | O(1)
v.empty()           // czy pusty?              | O(1)
v.clear()           // wyczyść                 | O(n)
v.resize(10)        // zmień rozmiar           | O(n)

// wstawianie/usuwanie w środku (wolne — O(n)):
v.insert(v.begin() + 2, 99);   // wstaw 99 na pozycję 2
v.erase(v.begin() + 2);        // usuń element na pozycji 2

// 2D vector (macierz n x m):
vector<vector<int>> mat(n, vector<int>(m, 0));
mat[i][j] = 5;


// -------------------------------------------------------
// 9. STRING — napis
// -------------------------------------------------------

string s = "hello";
s.size()            // długość                 | O(1)
s[i]                // i-ty znak               | O(1)
s += "world"        // sklejanie               | O(n)
s.substr(2, 3)      // podciąg od idx 2, dł 3  | O(n)
s.find("ll")        // pozycja lub string::npos| O(n)
s.push_back('!')    // dodaj znak na koniec    | O(1)
s.pop_back()        // usuń ostatni znak       | O(1)

// konwersje:
int n = stoi("123");        // string -> int
string s = to_string(123);  // int -> string

// przejście po znakach:
for (char c : s) cout << c << "\n";

// porównywanie:
if (s == "abc") { /* ... */ }
if (s < "bcd")  { /* leksykograficznie mniejszy */ }


// -------------------------------------------------------
// 10. PAIR — para dwóch wartości
// -------------------------------------------------------

pair<int, int> p = {3, 7};
p.first     // -> 3
p.second    // -> 7

// make_pair (starsza składnia):
pair<int, string> p2 = make_pair(1, "ola");

// sortowanie par (sortuje po first, potem po second):
vector<pair<int,int>> edges = {{3,1},{1,2},{2,5}};
sort(edges.begin(), edges.end());  // -> {1,2},{2,5},{3,1}


// -------------------------------------------------------
// 11. SET — zbiór (bez powtórzeń, posortowany)
// -------------------------------------------------------

set<int> st;
st.insert(5)        // dodaj 5                 | O(log n)
st.erase(5)         // usuń 5                  | O(log n)
st.count(5)         // 1 jeśli jest, 0 jeśli nie | O(log n)
st.size()           // rozmiar                 | O(1)
st.empty()          // czy pusty?              | O(1)
st.clear()          // wyczyść                 | O(n)

if (st.count(x)) { /* x jest w secie */ }

for (int x : st) cout << x << "\n";  // wypisuje POSORTOWANE

// unordered_set — szybszy (O(1) avg), ale bez porządku:
unordered_set<int> ust;
ust.insert(5);
ust.count(5);   // O(1) średnio


// -------------------------------------------------------
// 12. MAP — słownik klucz -> wartość (posortowany po kluczu)
// -------------------------------------------------------

map<string, int> mp;
mp["Ala"] = 5;              // ustaw wartość           | O(log n)
mp["Ola"] += 1;             // inkrementuj (domyślnie 0)| O(log n)
mp.count("Ala")             // 1 jeśli klucz istnieje  | O(log n)
mp.erase("Ala")             // usuń klucz              | O(log n)
mp.size()                   // rozmiar                 | O(1)

for (auto& [k, v] : mp)
    cout << k << " -> " << v << "\n";

// unordered_map — szybszy O(1) avg:
unordered_map<int, int> ump;
ump[7]++;


// -------------------------------------------------------
// 13. SORTOWANIE
// -------------------------------------------------------

sort(v.begin(), v.end());               // rosnąco          | O(n log n)
sort(v.begin(), v.end(), greater<int>()); // malejąco

// własny komparator:
sort(v.begin(), v.end(), [](int a, int b) {
    return a > b;  // malejąco
});

// sortowanie par malejąco po first:
sort(edges.begin(), edges.end(), [](auto& a, auto& b) {
    return a.first > b.first;
});

// sprawdź czy posortowane:
is_sorted(v.begin(), v.end());  // true/false

// odwróć wektor:
reverse(v.begin(), v.end());   // O(n)


// -------------------------------------------------------
// 14. ALGORYTMY STL (przydatne funkcje)
// -------------------------------------------------------

// min/max elementu w wektorze:
int mx = *max_element(v.begin(), v.end());
int mn = *min_element(v.begin(), v.end());

// suma elementów:
long long suma = accumulate(v.begin(), v.end(), 0LL);

// czy element istnieje w wektorze:
bool jest = count(v.begin(), v.end(), 5) > 0;
// lub (po sortowaniu, szybciej):
bool jest = binary_search(v.begin(), v.end(), 5);  // O(log n)

// wypełnij:
fill(v.begin(), v.end(), 0);    // wszystko na 0

// permutacje (do brute-force małych n):
sort(v.begin(), v.end());
do {
    // sprawdź permutację v
} while (next_permutation(v.begin(), v.end()));

// unikalne elementy (po sortowaniu):
v.erase(unique(v.begin(), v.end()), v.end());


// -------------------------------------------------------
// 15. KOLEJKA (queue) — FIFO: dodajesz na koniec, bierzesz z przodu
// -------------------------------------------------------

queue<int> q;
q.push(5)       // dodaj na koniec     | O(1)
q.pop()         // usuń z przodu (!)   | O(1)
q.front()       // podejrzyj przód     | O(1)
q.back()        // podejrzyj tył       | O(1)
q.size()        // rozmiar             | O(1)
q.empty()       // czy pusta?          | O(1)

// typowe użycie — BFS:
while (!q.empty()) {
    int x = q.front(); q.pop();
    // przetwórz x
}


// -------------------------------------------------------
// 16. STOS (stack) — LIFO: dodajesz i bierzesz z tego samego końca
// -------------------------------------------------------

stack<int> st;
st.push(5)      // dodaj na wierzchołek | O(1)
st.pop()        // usuń z wierzchołka   | O(1)
st.top()        // podejrzyj wierzchołek| O(1)
st.size()       // rozmiar              | O(1)
st.empty()      // czy pusty?           | O(1)

// typowe użycie — nawiasy/operacje:
while (!st.empty()) {
    int x = st.top(); st.pop();
    // przetwórz x
}


// -------------------------------------------------------
// 17. PRIORITY QUEUE (kopiec) — zawsze daje MAX element
// -------------------------------------------------------

priority_queue<int> pq;                             // max-heap (domyślnie)
priority_queue<int, vector<int>, greater<int>> pq2; // min-heap (mniejsze = ważniejsze)

pq.push(5)      // dodaj              | O(log n)
pq.pop()        // usuń max           | O(log n)
pq.top()        // podejrzyj max      | O(1)
pq.size()       // rozmiar            | O(1)
pq.empty()      // czy pusty?         | O(1)

// przydatne: K największych elementów, Dijkstra


// -------------------------------------------------------
// 18. STRINGSTREAM — parsowanie napisów
// -------------------------------------------------------

#include <sstream>

string line = "1 23 456 7";
stringstream ss(line);
int x;
while (ss >> x) {
    cout << x << "\n";   // -> 1, 23, 456, 7
}

// budowanie stringa z liczb:
stringstream out;
out << "Wynik: " << 42 << " punkty";
string result = out.str();


// -------------------------------------------------------
// 19. FUNKCJE
// -------------------------------------------------------

// deklaracja przed main lub definiowanie przed użyciem:
int dodaj(int a, int b) {
    return a + b;
}

// referencja — modyfikuj oryginał:
void podwoj(int& x) { x *= 2; }

// referencja do wektora (bez kopiowania!):
void wypiszVector(const vector<int>& v) {
    for (int x : v) cout << x << " ";
}

// rekurencja — silnia:
long long silnia(int n) {
    if (n <= 1) return 1;
    return n * silnia(n - 1);
}

// rekurencja — fibonacci (wolna! O(2^n), użyj memoizacji):
int fib(int n) {
    if (n <= 1) return n;
    return fib(n-1) + fib(n-2);
}


// -------------------------------------------------------
// 20. ZŁOŻONOŚĆ CZASOWA — szybki przewodnik
// -------------------------------------------------------

// Zasada kciuka dla olimpiad (limit ~10^8 operacji/s):
//
// n <= 10        -> O(n!) lub O(2^n)  — brute force, permutacje
// n <= 20        -> O(2^n)             — bitmasking, brute force
// n <= 500       -> O(n^3)             — 3 zagnieżdżone pętle
// n <= 5000      -> O(n^2)             — 2 zagnieżdżone pętle
// n <= 10^6      -> O(n log n)         — sort, set, map
// n <= 10^7      -> O(n)               — jedna pętla
// n <= 10^18     -> O(log n)           — binary search, potęgowanie

// O(1)      — stały czas          — dostęp do tablicy, push_back
// O(log n)  — logarytmiczny       — binary_search, set/map operacje
// O(n)      — liniowy             — jedna pętla po n elementach
// O(n log n)— prawie liniowy      — sort()
// O(n^2)    — kwadratowy          — dwie zagnieżdżone pętle
// O(2^n)    — wykładniczy         — wszystkie podzbiory


// -------------------------------------------------------
// 21. BITSET — szybkie operacje na zbiorach 0/1
// -------------------------------------------------------

bitset<100> bs;         // 100 bitów, wszystkie 0
bs.set(3)               // ustaw bit 3 na 1       | O(1)
bs.reset(3)             // ustaw bit 3 na 0       | O(1)
bs.flip(3)              // odwróć bit 3           | O(1)
bs[3]                   // odczyt bitu 3          | O(1)
bs.count()              // ile jedynek?           | O(n/64) — bardzo szybkie!
bs.any()                // czy jest choć jedna 1? | O(n/64)
bs.none()               // czy same zera?         | O(n/64)

// operacje jak na zbiorach:
bitset<100> a, b;
auto c = a & b;    // przecięcie
auto d = a | b;    // suma
auto e = a ^ b;    // różnica symetryczna

// przydatne np. do sita Eratostenesa, DP na podzbiorach


// -------------------------------------------------------
// 22. WSKAŹNIKI I DYNAMICZNA PAMIĘĆ (podstawy)
// -------------------------------------------------------

int x = 5;
int* ptr = &x;      // ptr przechowuje adres x
*ptr = 10;          // zmiana wartości przez wskaźnik -> x == 10
cout << *ptr;       // wyłuskanie -> 10
cout << ptr;        // adres w pamięci

// dynamiczna alokacja:
int* arr = new int[10];     // alokuj tablicę 10 intów
arr[0] = 5;
delete[] arr;               // ZAWSZE zwalniaj! (w olimpiadzie możesz pominąć)

// wskaźnik null:
int* p = nullptr;
if (p != nullptr) { /* bezpieczny dostęp */ }


// -------------------------------------------------------
// 23. STRUCT — własna struktura danych
// -------------------------------------------------------

struct Punkt {
    int x, y;
};

struct Krawedz {
    int u, v, waga;
    bool operator<(const Krawedz& o) const {
        return waga < o.waga;   // porównanie dla sort()
    }
};

Punkt p = {3, 5};
cout << p.x << " " << p.y << "\n";

vector<Krawedz> edges;
edges.push_back({1, 2, 10});
sort(edges.begin(), edges.end());   // sortuje po wadze
