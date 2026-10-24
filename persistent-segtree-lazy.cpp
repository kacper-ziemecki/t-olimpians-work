// ============================================================================
//  Trwale (persistent) drzewo przedzialowe z lazy propagation - na wskaznikach
// ----------------------------------------------------------------------------
//  Operacje (wszystkie w O(log n) czasu i O(log n) NOWEJ pamieci):
//    build(a)                        -> wersja 0
//    rangeAdd(wersja, l, r, v)       -> NOWA wersja: a[i] += v dla i w [l, r]
//    query(wersja, l, r)             -> suma a[l..r] w danej wersji
//
//  Klucz: NIE MA push-down. Zepchniecie lazy w dol psuloby stare wersje,
//  bo dzieci sa wspoldzielone. Zamiast tego lazy zostaje w wezle, a zapytanie
//  zbiera lazy przodkow do akumulatora i dolicza je dopiero na dole.
//
//  INWARIANT:
//    v->sum  = prawdziwa suma calego przedzialu wezla v,
//              juz Z UWZGLEDNIENIEM wlasnego v->lazy,
//              ale BEZ lazy przodkow v.
//    v->lazy = "+lazy do kazdego elementu", ktore NIE jest widoczne w dzieciach.
//    Stad:  v->sum == v->l->sum + v->r->sum
//                     + v->lazy * (ilosc wierzcholkow w poddrzewie v)
//    "ilosc wierzcholkow w poddrzewie v" = ile pozycji tablicy obsluguje v,
//    czyli w kodzie po prostu (hi - lo + 1).
//
//  Kompilacja:  g++ -std=c++14 -O2 -o pst persistent-segtree-lazy.cpp
// ============================================================================

#include <iostream>
#include <vector>
#include <cstdlib>

using ll = long long;

// ---------------------------------------------------------------------------
// 1. WEZEL
// ---------------------------------------------------------------------------
struct Node {
    ll sum;         // suma przedzialu (z wlasnym lazy, bez lazy przodkow)
    ll lazy;        // zalegle +lazy dla kazdego elementu, niewidoczne w dzieciach
    Node *l, *r;    // dzieci - WSPOLDZIELONE miedzy wersjami!

    Node(ll s, ll lz, Node* L, Node* R) : sum(s), lazy(lz), l(L), r(R) {}
};

long long g_nodes = 0;                       // licznik zaalokowanych wezlow

Node* makeNode(ll s, ll lz, Node* L, Node* R) {
    ++g_nodes;
    return new Node(s, lz, L, R);
}

// Kopia wezla - plytka: dzieci sa WSPOLDZIELONE ze stara wersja.
// To jest cale serce trwalosci: kopiujemy tylko sciezke, reszta jest wspolna.
Node* cloneNode(const Node* v) {
    ++g_nodes;
    return new Node(v->sum, v->lazy, v->l, v->r);
}

// ---------------------------------------------------------------------------
// 2. BUDOWA wersji 0 - zwykle drzewo przedzialowe, wszystkie lazy = 0
// ---------------------------------------------------------------------------
Node* build(const std::vector<ll>& a, int lo, int hi) {
    if (lo == hi) return makeNode(a[lo], 0, nullptr, nullptr);
    int mid = lo + (hi - lo) / 2;
    Node* L = build(a, lo, mid);
    Node* R = build(a, mid + 1, hi);
    return makeNode(L->sum + R->sum, 0, L, R);
}

// ---------------------------------------------------------------------------
// 3. AKTUALIZACJA: a[i] += val dla i w [l, r]
//    Zwraca korzen NOWEJ wersji. Stara wersja pozostaje nietknieta.
// ---------------------------------------------------------------------------
Node* rangeAdd(Node* v, int lo, int hi, int l, int r, ll val) {
    // Brak przeciecia -> oddajemy STARY wskaznik. Zero nowych wezlow,
    // cale to poddrzewo jest wspoldzielone przez obie wersje.
    if (r < lo || hi < l) return v;

    Node* nv = cloneNode(v);                 // nigdy nie piszemy po starym wezle!

    // Pelne pokrycie -> odkladamy lazy i od razu poprawiamy sume.
    // Dzieci zostaja te same (wspoldzielone) - lazy ich "dotyczy",
    // ale fizycznie w nich nie siedzi.
    if (l <= lo && hi <= r) {
        nv->sum  += val * (ll)(hi - lo + 1);
        nv->lazy += val;
        return nv;
    }

    int mid = lo + (hi - lo) / 2;
    nv->l = rangeAdd(v->l, lo,      mid, l, r, val);
    nv->r = rangeAdd(v->r, mid + 1, hi,  l, r, val);
    // Przeliczenie wg inwariantu - wlasne lazy trzeba doliczyc recznie,
    // bo dzieci o nim nie wiedza.
    nv->sum = nv->l->sum + nv->r->sum + nv->lazy * (ll)(hi - lo + 1);
    return nv;
}

// ---------------------------------------------------------------------------
// 4. ZAPYTANIE: suma a[l..r]
//    acc = suma lazy WSZYSTKICH przodkow - dokladamy ja dopiero na dole,
//    przemnozona przez ilosc wierzcholkow w poddrzewie, na ktorym stanelismy.
// ---------------------------------------------------------------------------
ll query(Node* v, int lo, int hi, int l, int r, ll acc) {
    if (r < lo || hi < l) return 0;
    if (l <= lo && hi <= r) return v->sum + acc * (ll)(hi - lo + 1);

    int mid = lo + (hi - lo) / 2;
    acc += v->lazy;                          // schodzac, zbieramy lazy do akumulatora
    return query(v->l, lo,      mid, l, r, acc)
         + query(v->r, mid + 1, hi,  l, r, acc);
}

// ---------------------------------------------------------------------------
// 5. Opakowanie: kolekcja wersji
// ---------------------------------------------------------------------------
struct PersistentSegTree {
    int n;
    std::vector<Node*> root;                 // root[k] = korzen wersji k

    explicit PersistentSegTree(const std::vector<ll>& a) : n((int)a.size()) {
        root.push_back(build(a, 0, n - 1));
    }
    // Tworzy nowa wersje na bazie wersji `ver`; zwraca jej numer.
    int add(int ver, int l, int r, ll val) {
        root.push_back(rangeAdd(root[ver], 0, n - 1, l, r, val));
        return (int)root.size() - 1;
    }
    ll sum(int ver, int l, int r) const {
        return query(root[ver], 0, n - 1, l, r, 0);
    }
    ll at(int ver, int i) const { return sum(ver, i, i); }

    void print(int ver, const char* label) const {
        std::cout << label << " [";
        for (int i = 0; i < n; ++i) std::cout << (i ? ", " : "") << at(ver, i);
        std::cout << "]\n";
    }
};

// ---------------------------------------------------------------------------
// 6. DEMO + test losowy vs. brute force
// ---------------------------------------------------------------------------
int main() {
    std::cout << "=== DEMO ===\n";
    std::vector<ll> a = {1, 2, 3, 4, 5, 6, 7, 8};
    PersistentSegTree st(a);
    std::cout << "wezlow po budowie: " << g_nodes << "\n";

    st.print(0, "wersja 0:");

    int v1 = st.add(0,  1, 4, +10);   // a[1..4] += 10
    int v2 = st.add(v1, 0, 7, -1);    // a[0..7] -= 1
    int v3 = st.add(v1, 5, 6, +100);  // GALAZ z wersji 1, nie z 2!

    st.print(v1, "wersja 1:");
    st.print(v2, "wersja 2:");
    st.print(v3, "wersja 3:");
    st.print(0,  "wersja 0 (nadal nietknieta):");

    std::cout << "\nsuma [0..7] w wersji 0 = " << st.sum(0,  0, 7) << "  (oczek. 36)\n";
    std::cout << "suma [0..7] w wersji 1 = " << st.sum(v1, 0, 7) << "  (oczek. 76)\n";
    std::cout << "suma [0..7] w wersji 2 = " << st.sum(v2, 0, 7) << "  (oczek. 68)\n";
    std::cout << "suma [2..5] w wersji 3 = " << st.sum(v3, 2, 5) << "  (oczek. 148)\n";
    std::cout << "wezlow po 3 aktualizacjach: " << g_nodes << "\n";

    // ---------------- test losowy -----------------
    std::cout << "\n=== TEST LOSOWY (kazda wersja porownana z brute force) ===\n";
    std::srand(12345);
    const int N = 40, OPS = 300;
    std::vector<ll> base(N);
    for (int i = 0; i < N; ++i) base[i] = std::rand() % 21 - 10;

    PersistentSegTree t(base);
    std::vector<std::vector<ll> > ref;       // ref[k] = tablica wersji k
    ref.push_back(base);

    bool ok = true;
    for (int op = 0; op < OPS && ok; ++op) {
        int ver = std::rand() % (int)ref.size();      // celowo wracamy do STARYCH wersji
        int l = std::rand() % N, r = std::rand() % N;
        if (l > r) std::swap(l, r);

        if (std::rand() % 2) {                         // nowa wersja
            ll val = std::rand() % 41 - 20;
            int nv = t.add(ver, l, r, val);
            std::vector<ll> cur = ref[ver];
            for (int i = l; i <= r; ++i) cur[i] += val;
            ref.push_back(cur);
            if ((int)ref.size() - 1 != nv) { ok = false; break; }
        } else {                                       // zapytanie
            ll got = t.sum(ver, l, r), want = 0;
            for (int i = l; i <= r; ++i) want += ref[ver][i];
            if (got != want) {
                std::cout << "BLAD: wersja " << ver << " [" << l << ".." << r
                          << "] = " << got << ", oczekiwano " << want << "\n";
                ok = false;
            }
        }
    }
    // na koniec: pelne porownanie kazdej wersji element po elemencie
    for (size_t k = 0; k < ref.size() && ok; ++k)
        for (int i = 0; i < N; ++i)
            if (t.at((int)k, i) != ref[k][i]) {
                std::cout << "BLAD: wersja " << k << ", a[" << i << "] = "
                          << t.at((int)k, i) << ", oczekiwano " << ref[k][i] << "\n";
                ok = false;
                break;
            }

    std::cout << (ok ? "OK - wszystkie wersje sie zgadzaja\n" : "SA BLEDY\n");
    std::cout << "wersji: " << t.root.size() << ", wezlow lacznie: " << g_nodes
              << " (drzewo jednowersyjne mialoby " << 2 * N - 1 << ")\n";
    return ok ? 0 : 1;
}
