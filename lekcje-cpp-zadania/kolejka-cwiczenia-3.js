// Kolejka — ćwiczenia w trakcie lekcji, części 7–8: przeszukiwanie wszerz (BFS) na liczbach i grafach (warstwy, tablica odległości
// z -1, oznaczanie przy wkładaniu, lista sąsiadów, odtwarzanie drogi, spójne grupy, stany jako liczby i pary) oraz BFS na planszy
// (tablice kierunków, wiele startów naraz, odtwarzanie drogi, ruch skoczka i duże plansze bez rekurencji).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./kolejka-pomoc');
    const { Kolejka, calk, D4, SKOCZEK, losPlansza, losLabirynt, wstaw, znajdz, bfsPlansza, ileNajkrotszych, losGraf, listy, bfsGraf, ileNajkrotszychGraf, grafTxt, generuj } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const planszaTxt = (g) => `${g.length} ${g[0].length}\n${g.join('\n')}`;
    // Plansza z wejścia: pierwszy wiersz n m, potem n wierszy po m znaków ze zbioru dozwolone.
    const czytajPlansze = (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); return { n, m, g: L.slice(1) }; };
    const dobraPlansza = (inp, maxN, maxM, dozwolone) => {
        const L = linie(inp); const t = L[0].split(' ').map(Number);
        if (t.length !== 2 || !calk(t[0], 1, maxN) || !calk(t[1], 1, maxM) || L.length !== t[0] + 1) return false;
        const re = new RegExp(`^[${dozwolone}]{${t[1]}}$`);
        return L.slice(1).every((w) => re.test(w));
    };
    const ile = (g, ch) => g.reduce((a, w) => a + w.split(ch).length - 1, 0);
    // Graf z wejścia: n m (i dalsze liczby z pierwszego wiersza), potem m krawędzi.
    const czytajGraf = (inp) => { const L = linie(inp); const g0 = L[0].split(' ').map(Number); const kraw = L.slice(1, 1 + g0[1]).map((l) => l.split(' ').map(Number)); return { g0, kraw, g: listy(g0[0], kraw) }; };
    const dobryGraf = (inp, maxN, maxM, extra) => {
        const L = linie(inp); const g0 = L[0].split(' ').map(Number);
        const [n, m] = g0;
        if (!calk(n, 1, maxN) || !calk(m, 0, maxM) || L.length !== m + 1) return false;
        const byl = new Set();
        for (const l of L.slice(1)) {
            const [a, b, ...reszta] = l.split(' ').map(Number);
            if (reszta.length || !calk(a, 1, n) || !calk(b, 1, n) || a === b) return false;
            const k = Math.min(a, b) * 100003 + Math.max(a, b);
            if (byl.has(k)) return false;
            byl.add(k);
        }
        return extra ? extra(g0) : true;
    };
    const zGrafem = (n, kraw, extra) => {
        const t = grafTxt(n, kraw).split('\n');
        t[0] += extra ? ' ' + extra : '';
        return t.join('\n');
    };

    return [
        // ================================================================ KROK 7 · BFS na liczbach i grafach
        {
            id: 'kol-przyciski', krok: 7, level: 'latwe',
            title: 'Przyciski kalkulatora',
            short: 'Kalkulator ma tylko przyciski +1, −1 i ×2. Ile naciśnięć dzieli a od b? Najpierw wszystkie liczby po jednym naciśnięciu, potem po dwóch — fala BFS.',
            tags: ['BFS na liczbach', 'odl = -1', 'granice stanów'],
            statement: ['Zepsuty kalkulator pokazuje liczbę a i ma tylko trzy działające przyciski: +1 (dodaje 1), −1 (odejmuje 1) i ×2 (podwaja liczbę). Ile najmniej razy trzeba nacisnąć przyciski, żeby kalkulator pokazał liczbę b? Wyświetlacz nie pokaże liczby ujemnej ani większej niż 200 000 — takich naciśnięć nie wolno robić.',
                'Przeszukaj liczby wszerz (BFS), jak w lekcji: kolejka liczb, a w vectorze odl[x] najmniejsza liczba naciśnięć, po której kalkulator pokazuje x (−1 = jeszcze nie wiadomo). Liczbę oznaczaj w chwili wkładania do kolejki.'],
            input_format: ['Jeden wiersz: liczby a i b.'],
            output_format: ['Jedna liczba — najmniejsza liczba naciśnięć.'],
            constraints: ['0 ≤ a, b ≤ 100 000'],
            examples: [{ input: '5 17', note: '5 → 4 → 8 → 16 → 17: cztery naciśnięcia (−1, ×2, ×2, +1). Po trzech naciśnięciach 17 jeszcze nie da się dostać.' }],
            hint: R`vector<int> odl(200001, -1); queue<int> q; odl[a] = 0; q.push(a);. Zdejmij x i dla każdego y z {x + 1, x - 1, 2 * x}: if (y >= 0 && y <= 200000 && odl[y] == -1) { odl[y] = odl[x] + 1; q.push(y); }. Wynik to odl[b].`,
            tests: (r) => ['7 7', '10 3', '0 100000', '100000 0', '5 17', '1 99999', `${r.int(0, 100000)} ${r.int(0, 100000)}`, `${r.int(0, 100)} ${r.int(50000, 100000)}`, '3 65537'],
            check: (inp) => { const t = nums(inp); return t.length === 2 && t.every((x) => calk(x, 0, 100000)) ? null : 'dane'; },
            solve: (inp) => {
                const [a, b] = nums(inp);
                const odl = new Int32Array(200001).fill(-1); const q = new Int32Array(200001); let hh = 0, tt = 0;
                odl[a] = 0; q[tt++] = a;
                while (hh < tt) { const x = q[hh++]; for (const y of [x + 1, x - 1, 2 * x]) if (y >= 0 && y <= 200000 && odl[y] === -1) { odl[y] = odl[x] + 1; q[tt++] = y; } }
                return String(odl[b]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int a, b;
    cin >> a >> b;
    vector<int> odl(200001, -1);
    queue<int> q;
    odl[a] = 0;
    q.push(a);
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int y : {x + 1, x - 1, 2 * x}) {
            if (y >= 0 && y <= 200000 && odl[y] == -1) {
                odl[y] = odl[x] + 1;
                q.push(y);
            }
        }
    }
    cout << odl[b] << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-winda', krok: 7, level: 'latwe',
            title: 'Winda z dwoma przyciskami',
            short: 'Winda jeździ tylko o u pięter w górę albo o d w dół. Czy da się dojechać na piętro g — i ilu naciśnięć potrzeba? Piętra to stany, a przyciski — krawędzie.',
            tags: ['BFS na piętrach', 'brak drogi', 'odl = -1'],
            statement: ['Budynek ma f pięter, ponumerowanych od 1 do f. Jesteś na piętrze s i chcesz dojechać na piętro g. Winda ma tylko dwa przyciski: GÓRA przenosi dokładnie o u pięter w górę, a DÓŁ — dokładnie o d pięter w dół. Jeśli takiego piętra nie ma (byłoby wyżej niż f albo niżej niż 1), przycisk nic nie robi.',
                'Ile najmniej razy trzeba nacisnąć przyciski, żeby dojechać na piętro g? Jeśli się nie da, wypisz uzyj schodow.'],
            input_format: ['Jeden wiersz: liczby f, s, g, u i d.'],
            output_format: ['Jedna liczba albo napis uzyj schodow.'],
            constraints: ['1 ≤ s, g ≤ f ≤ 10⁶', '0 ≤ u, d ≤ 10⁶'],
            examples: [{ input: '10 1 10 2 1', note: '1 → 3 → 5 → 7 → 9 → 8 → 10: sześć naciśnięć. Z piętra 9 nie da się pojechać o 2 w górę (11 > 10), więc trzeba się cofnąć na 8.' },
                { input: '100 2 1 1 0', note: 'Przycisk DÓŁ przenosi o 0 pięter, więc na piętro 1 nie da się zjechać.' }],
            hint: R`vector<int> odl(f + 1, -1); odl[s] = 0;. Z piętra x sąsiedzi to x + u i x − d — o ile mieszczą się między 1 a f. Na końcu: if (odl[g] == -1) cout << "uzyj schodow"; else cout << odl[g];.`,
            tests: (r) => ['1 1 1 0 0', '10 1 10 2 1', '100 2 1 1 0', '1000000 1 1000000 999999 0', '1000000 1 1000000 2 4', '1000000 500000 1 7 3', `1000000 ${r.int(1, 1000000)} ${r.int(1, 1000000)} ${r.int(1, 1000)} ${r.int(1, 1000)}`, '999999 3 999998 6 4', '50 25 26 0 0'],
            check: (inp) => { const t = nums(inp); const [f, s, g, u, d] = t; return t.length === 5 && calk(f, 1, 1e6) && calk(s, 1, f) && calk(g, 1, f) && calk(u, 0, 1e6) && calk(d, 0, 1e6) ? null : 'dane'; },
            solve: (inp) => {
                const [f, s, g, u, d] = nums(inp);
                const odl = new Int32Array(f + 1).fill(-1); const q = new Int32Array(f + 1); let hh = 0, tt = 0;
                odl[s] = 0; q[tt++] = s;
                while (hh < tt) { const x = q[hh++]; for (const y of [x + u, x - d]) if (y >= 1 && y <= f && odl[y] === -1) { odl[y] = odl[x] + 1; q[tt++] = y; } }
                return odl[g] === -1 ? 'uzyj schodow' : String(odl[g]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int f, s, g, u, d;
    cin >> f >> s >> g >> u >> d;
    vector<int> odl(f + 1, -1);
    queue<int> q;
    odl[s] = 0;
    q.push(s);
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int y : {x + u, x - d}) {
            if (y >= 1 && y <= f && odl[y] == -1) {
                odl[y] = odl[x] + 1;
                q.push(y);
            }
        }
    }
    if (odl[g] == -1) cout << "uzyj schodow\n";
    else cout << odl[g] << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-znajomi', krok: 7, level: 'srednie',
            title: 'Stopnie znajomości',
            short: 'Kto zna kogo — to graf. BFS od osoby 1 mówi, przez ilu pośredników dociera się do każdej osoby. Lista sąsiadów to vector<vector<int>>.',
            tags: ['graf z listą sąsiadów', 'BFS od jednej osoby', 'odległość -1'],
            statement: ['W klasie jest n osób, ponumerowanych od 1 do n, i m par znajomych (znajomość działa w obie strony). Stopień znajomości osoby x z osobą 1 to najmniejsza liczba kroków „od znajomego do znajomego”, którymi da się przejść od osoby 1 do x: znajomi osoby 1 mają stopień 1, znajomi znajomych (którzy nie znają osoby 1) — stopień 2, a sama osoba 1 — stopień 0.',
                'Wypisz stopień znajomości każdej osoby z osobą 1 albo −1, jeśli nie da się do niej dojść. Zapisz graf jako listy sąsiadów: vector<vector<int>> g(n + 1); i dla pary a b: g[a].push_back(b); g[b].push_back(a);.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z m kolejnych wierszy para znajomych a b.'],
            output_format: ['Jeden wiersz: n liczb — stopnie znajomości osób 1, 2, …, n.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', 'Pary są różne, a ≠ b.'],
            examples: [{ input: '6 5\n1 2\n2 3\n1 4\n4 3\n5 6', note: 'Osoby 2 i 4 znają osobę 1. Osoba 3 zna 2 i 4 — stopień 2. Do osób 5 i 6 nie da się dojść.' }],
            hint: R`vector<int> odl(n + 1, -1); odl[1] = 0; q.push(1);. Zdejmij v i przejdź po jego znajomych: for (int u : g[v]) if (odl[u] == -1) { odl[u] = odl[v] + 1; q.push(u); }.`,
            tests: (r) => ['1 0', '2 0', '2 1\n2 1', '6 5\n1 2\n2 3\n1 4\n4 3\n5 6', grafTxt(2000, losGraf(r, 2000, 5000)), grafTxt(2000, losGraf(r, 2000, 1999, true)), grafTxt(2000, losGraf(r, 2000, 1500)), grafTxt(30, losGraf(r, 30, 40))],
            check: (inp) => (dobryGraf(inp, 2000, 5000) ? null : 'graf'),
            solve: (inp) => { const { g } = czytajGraf(inp); return Array.from(bfsGraf(g, [1])).slice(1).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        g[b].push_back(a);
    }
    vector<int> odl(n + 1, -1);
    queue<int> q;
    odl[1] = 0;
    q.push(1);
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        for (int u : g[v]) {
            if (odl[u] == -1) {
                odl[u] = odl[v] + 1;
                q.push(u);
            }
        }
    }
    for (int i = 1; i <= n; i++) cout << odl[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-najdalej', krok: 7, level: 'srednie',
            title: 'Najdalej od startu',
            short: 'Kto mieszka najdalej od stacji s — licząc w przesiadkach? Po BFS wystarczy przejść po tablicy odległości: największa wartość i wszyscy, którzy ją mają.',
            tags: ['BFS z dowolnego startu', 'maksimum po odl', 'kilka odpowiedzi'],
            statement: ['Sieć kolejki ma n stacji, ponumerowanych od 1 do n, i m dwukierunkowych połączeń między nimi. Przejazd jednym połączeniem to jeden przystanek. Odległość stacji x od stacji s to najmniejsza liczba przystanków na trasie z s do x.',
                'Znajdź największą odległość od stacji s spośród stacji, do których da się dojechać, i wypisz wszystkie stacje, które są tak daleko — w kolejności rosnących numerów. Stacji, do których nie da się dojechać, nie bierz pod uwagę.'],
            input_format: ['W pierwszym wierszu liczby n, m i s.', 'W każdym z m kolejnych wierszy połączenie a b.'],
            output_format: ['Dwa wiersze: odleglosc D oraz stacje: … (numery rosnąco).'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', '1 ≤ s ≤ n', 'Połączenia są różne, a ≠ b.'],
            examples: [{ input: '8 6 1\n1 2\n2 3\n3 4\n1 5\n5 6\n6 7', note: 'Stacje 4 i 7 są 3 przystanki od stacji 1. Do stacji 8 nie da się dojechać, więc się nie liczy.' }],
            hint: R`Zwykły BFS od s. Potem int D = 0; for (int i = 1; i <= n; i++) D = max(D, odl[i]); i druga pętla wypisuje każde i, dla którego odl[i] == D. Nieosiągalne mają −1, więc nie przeszkadzają w maksimum.`,
            tests: (r) => ['1 0 1', '3 0 2', '3 2 1\n1 2\n1 3', '8 6 1\n1 2\n2 3\n3 4\n1 5\n5 6\n6 7', zGrafem(2000, losGraf(r, 2000, 2400), r.int(1, 2000)), zGrafem(2000, losGraf(r, 2000, 1999, true), r.int(1, 2000)), zGrafem(2000, losGraf(r, 2000, 5000, true), 1), zGrafem(50, losGraf(r, 50, 45), 7)],
            check: (inp) => (dobryGraf(inp, 2000, 5000, (g0) => g0.length === 3 && calk(g0[2], 1, g0[0])) ? null : 'graf'),
            solve: (inp) => {
                const { g0, g } = czytajGraf(inp);
                const d = Array.from(bfsGraf(g, [g0[2]]));
                const D = Math.max(...d.slice(1));
                const st = []; for (let i = 1; i <= g0[0]; i++) if (d[i] === D) st.push(i);
                return `odleglosc ${D}\nstacje: ${st.join(' ')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m, s;
    cin >> n >> m >> s;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        g[b].push_back(a);
    }
    vector<int> odl(n + 1, -1);
    queue<int> q;
    odl[s] = 0;
    q.push(s);
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        for (int u : g[v]) {
            if (odl[u] == -1) {
                odl[u] = odl[v] + 1;
                q.push(u);
            }
        }
    }
    int D = 0;
    for (int i = 1; i <= n; i++) D = max(D, odl[i]);
    cout << "odleglosc " << D << "\n";
    cout << "stacje:";
    for (int i = 1; i <= n; i++) {
        if (odl[i] == D) cout << " " << i;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-trasa', krok: 7, level: 'srednie',
            title: 'Trasa z przesiadkami',
            short: 'Nie tylko ile przystanków, ale którędy. Przy wkładaniu do kolejki zapisz, skąd przyszedłeś (skad[u] = v), a potem cofaj się od celu do startu.',
            tags: ['tablica skad', 'odtwarzanie drogi', 'reverse'],
            statement: ['Sieć kolejki ma n stacji i m dwukierunkowych połączeń. Znajdź najkrótszą trasę ze stacji a do stacji b (najmniej przystanków) i wypisz ją. Gwarantujemy, że jeśli trasa istnieje, to najkrótsza jest dokładnie jedna.',
                'W BFS zapamiętuj w tablicy skad, z której stacji pierwszy raz dotarłeś do każdej stacji: skad[u] = v w chwili, gdy wkładasz u do kolejki. Potem idź od b po skad aż do a — dostaniesz trasę od końca, więc ją odwróć.'],
            input_format: ['W pierwszym wierszu liczby n, m, a i b.', 'W każdym z m kolejnych wierszy połączenie x y.'],
            output_format: ['Dwa wiersze: przystankow: L oraz trasa: a … b — albo jeden wiersz brak polaczenia.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ m ≤ 5000', '1 ≤ a, b ≤ n', 'Połączenia są różne, x ≠ y. Najkrótsza trasa, jeśli istnieje, jest jedna.'],
            examples: [{ input: '6 7 1 6\n1 2\n2 3\n3 6\n1 4\n4 5\n5 3\n2 5', note: 'Najkrótsza trasa to 1 → 2 → 3 → 6 (3 przystanki). Trasy przez stację 5 są dłuższe.' }],
            hint: R`vector<int> skad(n + 1, 0);. W BFS: if (odl[u] == -1) { odl[u] = odl[v] + 1; skad[u] = v; q.push(u); }. Odtwarzanie: vector<int> t; for (int x = b; x != a; x = skad[x]) t.push_back(x); t.push_back(a); reverse(t.begin(), t.end());.`,
            tests: (r) => {
                const proba = (n, m, spojny, bezDrogi) => {
                    for (let k = 0; k < 300; k++) {
                        const kraw = losGraf(r, n, m, spojny); const g = listy(n, kraw);
                        const a = r.int(1, n), b = r.int(1, n);
                        const w = ileNajkrotszychGraf(g, a, b);
                        if (bezDrogi ? w.odl === -1 : (w.odl >= Math.min(5, n - 1) && w.ile === 1)) return zGrafem(n, kraw, `${a} ${b}`);
                    }
                    throw new Error('kol-trasa: brak grafu');
                };
                return ['1 0 1 1', '2 0 1 2', '2 1 2 1\n1 2', '6 7 1 6\n1 2\n2 3\n3 6\n1 4\n4 5\n5 3\n2 5', proba(2000, 2100, true, false), proba(2000, 2000, true, false), proba(2000, 1500, false, true), proba(200, 230, true, false), proba(2000, 2300, false, false)];
            },
            check: (inp) => {
                if (!dobryGraf(inp, 2000, 5000, (g0) => g0.length === 4 && calk(g0[2], 1, g0[0]) && calk(g0[3], 1, g0[0]))) return 'graf';
                const { g0, g } = czytajGraf(inp); const w = ileNajkrotszychGraf(g, g0[2], g0[3]);
                return w.odl === -1 || w.ile === 1 ? null : 'kilka tras';
            },
            solve: (inp) => {
                const { g0, g } = czytajGraf(inp); const [n, , a, b] = g0;
                const odl = new Int32Array(n + 1).fill(-1); const skad = new Int32Array(n + 1); const q = new Kolejka();
                odl[a] = 0; q.push(a);
                while (!q.empty()) { const v = q.pop(); for (const u of g[v]) if (odl[u] === -1) { odl[u] = odl[v] + 1; skad[u] = v; q.push(u); } }
                if (odl[b] === -1) return 'brak polaczenia';
                const t = []; for (let x = b; x !== a; x = skad[x]) t.push(x); t.push(a);
                return `przystankow: ${odl[b]}\ntrasa: ${t.reverse().join(' ')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m, a, b;
    cin >> n >> m >> a >> b;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int x, y;
        cin >> x >> y;
        g[x].push_back(y);
        g[y].push_back(x);
    }
    vector<int> odl(n + 1, -1), skad(n + 1, 0);
    queue<int> q;
    odl[a] = 0;
    q.push(a);
    while (!q.empty()) {
        int v = q.front();
        q.pop();
        for (int u : g[v]) {
            if (odl[u] == -1) {
                odl[u] = odl[v] + 1;
                skad[u] = v;
                q.push(u);
            }
        }
    }
    if (odl[b] == -1) {
        cout << "brak polaczenia\n";
        return 0;
    }
    vector<int> t;
    for (int x = b; x != a; x = skad[x]) t.push_back(x);
    t.push_back(a);
    reverse(t.begin(), t.end());
    cout << "przystankow: " << odl[b] << "\n";
    cout << "trasa:";
    for (int x : t) cout << " " << x;
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-grupy-znajomych', krok: 7, level: 'srednie',
            title: 'Grupy znajomych',
            short: 'Ile jest osobnych grup znajomych i jak duże są? Pętla po osobach: każda nieodwiedzona zaczyna nową grupę, a BFS od niej zaznacza całą grupę naraz.',
            tags: ['spójne składowe', 'BFS z wielu startów po kolei', 'sortowanie malejąco'],
            statement: ['W szkole jest n uczniów, ponumerowanych od 1 do n, i m par znajomych. Grupa to uczniowie, którzy są ze sobą połączeni łańcuchem znajomości (znajomy znajomego znajomego… też należy do grupy). Uczeń bez znajomych tworzy grupę jednoosobową.',
                'Policz grupy i wypisz ich rozmiary od największej do najmniejszej. Przejdź pętlą po uczniach: gdy trafisz na ucznia, którego żaden BFS jeszcze nie odwiedził, zaczyna on nową grupę — uruchom z niego BFS i policz, ile osób odwiedził.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z m kolejnych wierszy para znajomych a b.'],
            output_format: ['Dwa wiersze: grup: G oraz rozmiary: … (malejąco).'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ m ≤ 8000', 'Pary są różne, a ≠ b.'],
            examples: [{ input: '8 4\n1 2\n3 2\n4 5\n7 8', note: 'Grupy: {1, 2, 3}, {4, 5}, {7, 8} i jednoosobowa {6}.' }],
            hint: R`vector<bool> byl(n + 1, false);. for (int s = 1; s <= n; s++) if (!byl[s]) { int rozmiar = 0; byl[s] = true; q.push(s); while (!q.empty()) { int v = q.front(); q.pop(); rozmiar++; for (int u : g[v]) if (!byl[u]) { byl[u] = true; q.push(u); } } rozmiary.push_back(rozmiar); }. Potem sort malejąco.`,
            tests: (r) => ['1 0', '3 0', '3 3\n1 2\n2 3\n3 1', '8 4\n1 2\n3 2\n4 5\n7 8', grafTxt(5000, losGraf(r, 5000, 4000)), grafTxt(5000, losGraf(r, 5000, 2500)), grafTxt(5000, losGraf(r, 5000, 8000)), grafTxt(5000, losGraf(r, 5000, 4999, true)), grafTxt(40, losGraf(r, 40, 25))],
            check: (inp) => (dobryGraf(inp, 5000, 8000) ? null : 'graf'),
            solve: (inp) => {
                const { g0, g } = czytajGraf(inp); const n = g0[0];
                const byl = new Uint8Array(n + 1); const roz = [];
                for (let s = 1; s <= n; s++) if (!byl[s]) { let c = 0; const q = new Kolejka([s]); byl[s] = 1; while (!q.empty()) { const v = q.pop(); c++; for (const u of g[v]) if (!byl[u]) { byl[u] = 1; q.push(u); } } roz.push(c); }
                roz.sort((x, y) => y - x);
                return `grup: ${roz.length}\nrozmiary: ${roz.join(' ')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        g[a].push_back(b);
        g[b].push_back(a);
    }
    vector<bool> byl(n + 1, false);
    vector<int> rozmiary;
    for (int s = 1; s <= n; s++) {
        if (byl[s]) continue;
        int rozmiar = 0;
        queue<int> q;
        byl[s] = true;
        q.push(s);
        while (!q.empty()) {
            int v = q.front();
            q.pop();
            rozmiar++;
            for (int u : g[v]) {
                if (!byl[u]) {
                    byl[u] = true;
                    q.push(u);
                }
            }
        }
        rozmiary.push_back(rozmiar);
    }
    sort(rozmiary.begin(), rozmiary.end(), greater<int>());
    cout << "grup: " << rozmiary.size() << "\n";
    cout << "rozmiary:";
    for (int x : rozmiary) cout << " " << x;
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-zamek', krok: 7, level: 'srednie',
            title: 'Zamek szyfrowy',
            short: 'Cztery kółka z cyframi, ruch obraca jedno kółko o jeden ząbek, a niektóre kody blokują zamek. Stanów jest 10 000 — BFS po kodach od 0000.',
            tags: ['stany jako liczby', 'sąsiedzi przez cyfry', 'zakazane stany'],
            statement: ['Zamek ma cztery kółka z cyframi 0–9; na początku pokazuje kod 0000. Jeden ruch to obrót jednego kółka o jeden ząbek w górę albo w dół (po 9 jest 0, a przed 0 jest 9). Niektóre kody są pułapką: gdy zamek je pokaże, blokuje się na zawsze — nie wolno na nie wchodzić. Ile najmniej ruchów potrzeba, żeby zamek pokazał kod docelowy?',
                'Jeśli się nie da (albo już 0000 jest pułapką), wypisz −1. Każdy kod to liczba od 0 do 9999 — użyj vector<int> odl(10000, -1). Sąsiadów kodu wylicz cyfra po cyfrze.'],
            input_format: ['W pierwszym wierszu kod docelowy (4 cyfry) i liczba pułapek d.', 'W drugim wierszu d kodów-pułapek (gdy d = 0, wiersz jest pusty).'],
            output_format: ['Jedna liczba — najmniejsza liczba ruchów albo −1.'],
            constraints: ['0 ≤ d ≤ 5000', 'Kody mają dokładnie 4 cyfry; pułapki są różne i żadna nie jest kodem docelowym.'],
            examples: [{ input: '0202 5\n0201 0101 0102 1212 2002', note: 'Najkrótsza droga: 0000 → 1000 → 1100 → 1200 → 1201 → 1202 → 0202 — sześć ruchów. Krótsze drogi przechodzą przez pułapki.' },
                { input: '8888 1\n0000', note: 'Zamek od początku pokazuje pułapkę.' }],
            hint: R`Każdy kod to liczba x od 0 do 9999 — wczytaj go jako napis i zamień: x = stoi(s). Cyfra na pozycji p (p = 1, 10, 100, 1000) to c = (x / p) % 10. Obrót w górę daje x - c * p + ((c + 1) % 10) * p, a w dół x - c * p + ((c + 9) % 10) * p. Pułapki zaznacz w vector<bool> zakaz(10000).`,
            tests: (r) => {
                const kod = (x) => String(x).padStart(4, '0');
                const gen = (d, cel) => { const z = new Set(); while (z.size < d) { const x = r.int(0, 9999); if (x !== cel) z.add(x); } return `${kod(cel)} ${d}\n${[...z].map(kod).join(' ')}`; };
                const pierscien = () => { const z = []; for (let j = 0; j < 4; j++) for (const c of [1, 9]) { const p = 10 ** j; z.push(kod(c * p)); } return `5555 8\n${z.join(' ')}`; };
                return ['0000 0', '0001 0', '5555 0', '0202 5\n0201 0101 0102 1212 2002', '8888 1\n0000', pierscien(), gen(5000, r.int(0, 9999)), gen(2000, 9999), gen(300, r.int(0, 9999)), gen(4000, 1234)];
            },
            check: (inp) => {
                const L = linie(inp); const [cel, d] = L[0].split(' ');
                if (!/^\d{4}$/.test(cel) || !calk(Number(d), 0, 5000)) return 'cel';
                const z = Number(d) ? (L[1] || '').split(' ') : [];
                if (L.length > 2 || z.length !== Number(d) || z.some((x) => !/^\d{4}$/.test(x) || x === cel) || new Set(z).size !== z.length) return 'pułapki';
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const [celS, d] = L[0].split(' '); const cel = Number(celS);
                const zakaz = new Uint8Array(10000); if (Number(d)) L[1].split(' ').forEach((x) => { zakaz[Number(x)] = 1; });
                if (zakaz[0]) return '-1';
                const odl = new Int32Array(10000).fill(-1); const q = new Int32Array(10000); let hh = 0, tt = 0;
                odl[0] = 0; q[tt++] = 0;
                while (hh < tt) {
                    const x = q[hh++];
                    for (let p = 1; p <= 1000; p *= 10) { const c = Math.floor(x / p) % 10; for (const nc of [(c + 1) % 10, (c + 9) % 10]) { const y = x - c * p + nc * p; if (!zakaz[y] && odl[y] === -1) { odl[y] = odl[x] + 1; q[tt++] = y; } } }
                }
                return String(odl[cel]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string celS;
    int d;
    cin >> celS >> d;
    int cel = stoi(celS);
    vector<bool> zakaz(10000, false);
    for (int i = 0; i < d; i++) {
        string s;
        cin >> s;
        zakaz[stoi(s)] = true;
    }
    if (zakaz[0]) {
        cout << -1 << "\n";
        return 0;
    }
    vector<int> odl(10000, -1);
    queue<int> q;
    odl[0] = 0;
    q.push(0);
    while (!q.empty()) {
        int x = q.front();
        q.pop();
        for (int p = 1; p <= 1000; p *= 10) {
            int c = (x / p) % 10;
            for (int nc : {(c + 1) % 10, (c + 9) % 10}) {
                int y = x - c * p + nc * p;
                if (!zakaz[y] && odl[y] == -1) {
                    odl[y] = odl[x] + 1;
                    q.push(y);
                }
            }
        }
    }
    cout << odl[cel] << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-dzbanki', krok: 7, level: 'trudne',
            title: 'Dzbanki z wodą',
            short: 'Dwa dzbanki bez podziałki i kran. Stan to para (ile w pierwszym, ile w drugim), a ruchy to nalej, wylej i przelej. Najkrótsza seria ruchów do C litrów — BFS po parach.',
            tags: ['stan jako para', 'odl jako tablica 2D', 'sześć ruchów'],
            statement: ['Masz dwa puste dzbanki o pojemności A i B litrów (bez żadnej podziałki) i kran z nieograniczoną ilością wody. Jeden ruch to: napełnienie jednego dzbanka do pełna z kranu, wylanie całej wody z jednego dzbanka albo przelewanie z jednego dzbanka do drugiego — tak długo, aż pierwszy się opróżni albo drugi napełni.',
                'Ile najmniej ruchów trzeba, żeby w którymkolwiek dzbanku było dokładnie C litrów? Jeśli się nie da, wypisz −1. Stan to para (x, y) — ile wody jest w pierwszym i w drugim dzbanku; odległości trzymaj w vector<vector<int>> odl(A + 1, vector<int>(B + 1, -1)).'],
            input_format: ['Jeden wiersz: liczby A, B i C.'],
            output_format: ['Jedna liczba — najmniejsza liczba ruchów albo −1.'],
            constraints: ['1 ≤ A, B ≤ 1000', '0 ≤ C ≤ 1000'],
            examples: [{ input: '3 5 4', note: 'Napełnij 5-litrowy, przelej do 3-litrowego (w dużym zostają 2), wylej mały, przelej 2 litry do małego, napełnij duży i dolej z niego mały do pełna — w dużym zostają 4 litry. Sześć ruchów.' },
                { input: '4 6 3', note: 'Oba dzbanki mają parzystą pojemność, więc w każdym zawsze jest parzysta liczba litrów.' }],
            hint: R`queue<pair<int, int>> q; odl[0][0] = 0;. Z (x, y) sąsiedzi to (A, y), (x, B), (0, y), (x, 0) oraz przelewanie: int p = min(x, B - y); → (x - p, y + p), a w drugą stronę int p2 = min(y, A - x); → (x + p2, y - p2). Gdy zdejmiesz stan z x == C albo y == C — to wynik.`,
            tests: (r) => ['1 1 0', '1 1 1', '3 5 4', '4 6 3', '1000 999 500', '1000 1000 1000', '997 1000 1', `${r.int(1, 1000)} ${r.int(1, 1000)} ${r.int(0, 1000)}`, '7 11 6', '1000 1 999', '6 9 1000'],
            check: (inp) => { const t = nums(inp); return t.length === 3 && calk(t[0], 1, 1000) && calk(t[1], 1, 1000) && calk(t[2], 0, 1000) ? null : 'dane'; },
            solve: (inp) => {
                const [A, B, C] = nums(inp);
                const W = B + 1; const odl = new Int32Array((A + 1) * W).fill(-1); const q = new Int32Array((A + 1) * W); let hh = 0, tt = 0;
                odl[0] = 0; q[tt++] = 0;
                while (hh < tt) {
                    const v = q[hh++]; const x = Math.floor(v / W), y = v % W;
                    if (x === C || y === C) return String(odl[v]);
                    const p = Math.min(x, B - y), p2 = Math.min(y, A - x);
                    for (const [nx, ny] of [[A, y], [x, B], [0, y], [x, 0], [x - p, y + p], [x + p2, y - p2]]) { const u = nx * W + ny; if (odl[u] === -1) { odl[u] = odl[v] + 1; q[tt++] = u; } }
                }
                return '-1';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int A, B, C;
    cin >> A >> B >> C;
    vector<vector<int>> odl(A + 1, vector<int>(B + 1, -1));
    queue<pair<int, int>> q;
    odl[0][0] = 0;
    q.push({0, 0});
    while (!q.empty()) {
        auto [x, y] = q.front();
        q.pop();
        if (x == C || y == C) {
            cout << odl[x][y] << "\n";
            return 0;
        }
        int p = min(x, B - y);
        int p2 = min(y, A - x);
        vector<pair<int, int>> ruchy = {{A, y}, {x, B}, {0, y}, {x, 0}, {x - p, y + p}, {x + p2, y - p2}};
        for (auto [nx, ny] : ruchy) {
            if (odl[nx][ny] == -1) {
                odl[nx][ny] = odl[x][y] + 1;
                q.push({nx, ny});
            }
        }
    }
    cout << -1 << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · BFS na planszy
        {
            id: 'kol-labirynt', krok: 8, level: 'latwe',
            title: 'Najkrótsza droga w labiryncie',
            short: 'Ile kroków dzieli start S od skarbu K? BFS na kratkach: kolejka par {wiersz, kolumna}, tablica odległości z -1 i cztery kierunki z tablic dw i dk.',
            tags: ['BFS na planszy', 'queue<pair<int, int>>', 'tablice kierunków'],
            statement: ['Labirynt to plansza n × m: . oznacza wolne pole, # ścianę, S start, a K skarb (S i K to też wolne pola, każde występuje dokładnie raz). Jednym krokiem przechodzisz na sąsiednie wolne pole — w górę, w dół, w lewo albo w prawo; nie wolno wejść na ścianę ani wyjść poza planszę.',
                'Wypisz najmniejszą liczbę kroków z S do K albo −1, jeśli do skarbu nie da się dojść.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków — wiersz planszy.'],
            output_format: ['Jedna liczba — najmniejsza liczba kroków albo −1.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '4 5\nS..#.\n.#...\n...#K\n#....', note: 'Najkrótsza droga: dwa kroki w prawo, krok w dół, dwa w prawo i krok w dół do K — 6 kroków.' },
                { input: '2 3\nS#K\n.#.', note: 'Ściana dzieli planszę na dwie części.' }],
            hint: R`vector<string> g(n); vector<vector<int>> odl(n, vector<int>(m, -1)); int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};. Znajdź S, ustaw odl = 0 i wstaw do kolejki. Dla sąsiada (nw, nk) sprawdź po kolei: czy jest na planszy, czy to nie ściana, czy odl == -1.`,
            tests: (r) => {
                const gen = (n, m, p) => { const g = losPlansza(r, n, m, p); wstaw(r, g, 'S'); wstaw(r, g, 'K'); return planszaTxt(g); };
                const lab = (h, w) => { const g = losLabirynt(r, h, w); wstaw(r, g, 'S'); wstaw(r, g, 'K'); return planszaTxt(g); };
                return ['1 2\nSK', '1 3\nS#K', '4 5\nS..#.\n.#...\n...#K\n#....', '2 3\nS#K\n.#.', gen(100, 100, 0.3), gen(100, 100, 0.42), gen(100, 100, 0), lab(49, 49), gen(10, 20, 0.25), lab(10, 30)];
            },
            check: (inp) => (dobraPlansza(inp, 100, 100, '.#SK') && ile(linie(inp).slice(1), 'S') === 1 && ile(linie(inp).slice(1), 'K') === 1 ? null : 'plansza'),
            solve: (inp) => {
                const { m, g } = czytajPlansze(inp);
                const s = znajdz(g, 'S')[0], k = znajdz(g, 'K')[0];
                return String(bfsPlansza(g, [s])[k[0] * m + k[1]]);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<vector<int>> odl(n, vector<int>(m, -1));
    queue<pair<int, int>> q;
    int kw = 0, kk = 0;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == 'S') {
                odl[w][k] = 0;
                q.push({w, k});
            }
            if (g[w][k] == 'K') {
                kw = w;
                kk = k;
            }
        }
    }
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            if (g[nw][nk] == '#') continue;
            if (odl[nw][nk] != -1) continue;
            odl[nw][nk] = odl[w][k] + 1;
            q.push({nw, nk});
        }
    }
    cout << odl[kw][kk] << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-fala', krok: 8, level: 'latwe',
            title: 'Fala w liczbach',
            short: 'Narysuj falę BFS: na każdym wolnym polu ostatnia cyfra jego odległości od startu. Widać, jak fala obchodzi ściany — i które pola są dla niej nieosiągalne.',
            tags: ['cała tablica odległości', 'odl % 10', 'wypisywanie planszy'],
            statement: ['Plansza n × m składa się z wolnych pól ., ścian # i jednego pola startowego S. Z S rozchodzi się fala: w każdym kroku przechodzi na sąsiednie (w czterech kierunkach) wolne pola.',
                'Wypisz planszę, w której każde pole osiągalne z S (także samo S) zamieniasz na ostatnią cyfrę jego odległości od S (odległość % 10). Ściany zostają #, a wolne pola, do których fala nie dociera, zostają kropkami.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków.'],
            output_format: ['n wierszy po m znaków — plansza z falą.'],
            constraints: ['1 ≤ n, m ≤ 100', 'S występuje dokładnie raz.'],
            examples: [{ input: '4 6\n......\n.##...\n.S#.#.\n..#.#.', note: 'Fala obchodzi ściany górą: pole dwa miejsca na prawo od S ma odległość 8, choć dzieli je od S tylko jedna ściana. W prawej kolumnie odległości przekraczają 9, więc widać tam ostatnie cyfry: 10 → 0 i 11 → 1.' }],
            hint: R`Po zwykłym BFS przejdź po polach: if (odl[w][k] != -1) g[w][k] = '0' + odl[w][k] % 10;. Potem wypisz g[w] wiersz po wierszu. Ściany i nieosiągnięte kropki zostają bez zmian.`,
            tests: (r) => {
                const gen = (n, m, p) => { const g = losPlansza(r, n, m, p); wstaw(r, g, 'S'); return planszaTxt(g); };
                const lab = (h, w) => { const g = losLabirynt(r, h, w, 30); wstaw(r, g, 'S'); return planszaTxt(g); };
                return ['1 1\nS', '1 5\n..S.#', '4 6\n......\n.##...\n.S#.#.\n..#.#.', gen(100, 100, 0.25), gen(100, 100, 0.45), gen(30, 70, 0.1), lab(49, 49), gen(12, 12, 0.3)];
            },
            check: (inp) => (dobraPlansza(inp, 100, 100, '.#S') && ile(linie(inp).slice(1), 'S') === 1 ? null : 'plansza'),
            solve: (inp) => {
                const { m, g } = czytajPlansze(inp);
                const d = bfsPlansza(g, znajdz(g, 'S'));
                return g.map((w, i) => w.split('').map((c, j) => (d[i * m + j] >= 0 ? String(d[i * m + j] % 10) : c)).join('')).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<vector<int>> odl(n, vector<int>(m, -1));
    queue<pair<int, int>> q;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == 'S') {
                odl[w][k] = 0;
                q.push({w, k});
            }
        }
    }
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            if (g[nw][nk] == '#' || odl[nw][nk] != -1) continue;
            odl[nw][nk] = odl[w][k] + 1;
            q.push({nw, nk});
        }
    }
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (odl[w][k] != -1) g[w][k] = '0' + odl[w][k] % 10;
        }
        cout << g[w] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-najblizsze-wyjscie', krok: 8, level: 'srednie',
            title: 'Najbliższe wyjście',
            short: 'Z budynku prowadzi kilka wyjść E. Jedno BFS od S mówi, jak daleko jest każde z nich — wybierz najbliższe i policz, do ilu w ogóle da się dojść.',
            tags: ['BFS od startu', 'kilka celów', 'minimum po celach'],
            statement: ['Plan piętra to plansza n × m: . to wolne pole, # ściana, S miejsce, w którym stoisz, a E — wyjście (wyjść może być kilka). Chodzisz w czterech kierunkach po polach, które nie są ścianami (wyjścia też są wolnymi polami).',
                'Wypisz, ile kroków dzieli Cię od najbliższego wyjścia i do ilu wyjść w ogóle da się dojść. Jeśli do żadnego wyjścia nie da się dojść, wypisz brak wyjscia.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków.'],
            output_format: ['Dwa wiersze: najblizsze wyjscie: D oraz osiagalne wyjscia: X — albo jeden wiersz brak wyjscia.'],
            constraints: ['1 ≤ n, m ≤ 100', 'S występuje dokładnie raz, E co najmniej raz.'],
            examples: [{ input: '4 7\nE..#..E\n.#.#.#.\n...S...\n####..E', note: 'Do wyjść w górnych rogach jest po 5 kroków, a do wyjścia w prawym dolnym rogu — tylko 4. Wszystkie trzy są osiągalne.' }],
            hint: R`Jedno BFS od S. Potem przejdź po wszystkich polach E: jeśli odl != -1, to wyjście jest osiągalne — licz je i szukaj najmniejszego odl.`,
            tests: (r) => {
                const gen = (n, m, p, ileE) => { const g = losPlansza(r, n, m, p); wstaw(r, g, 'S'); for (let i = 0; i < ileE; i++) wstaw(r, g, 'E'); return planszaTxt(g); };
                const zamkniety = () => { const g = losPlansza(r, 40, 40, 0.2); for (let i = 0; i < 40; i++) { g[i] = g[i].slice(0, 20) + '#' + g[i].slice(21); } for (let i = 0; i < 40; i++) if (g[i][5] === '.') { g[i] = g[i].slice(0, 5) + 'S' + g[i].slice(6); break; } for (let i = 39; i >= 0; i--) if (g[i][30] === '.') { g[i] = g[i].slice(0, 30) + 'E' + g[i].slice(31); break; } return planszaTxt(g); };
                return ['1 2\nSE', '1 3\nE#S', '4 7\nE..#..E\n.#.#.#.\n...S...\n####..E', gen(100, 100, 0.3, 5), gen(100, 100, 0.4, 40), gen(100, 100, 0.1, 1), zamkniety(), gen(20, 30, 0.35, 3)];
            },
            check: (inp) => { const g = linie(inp).slice(1); return dobraPlansza(inp, 100, 100, '.#SE') && ile(g, 'S') === 1 && ile(g, 'E') >= 1 ? null : 'plansza'; },
            solve: (inp) => {
                const { m, g } = czytajPlansze(inp);
                const d = bfsPlansza(g, znajdz(g, 'S'));
                const odl = znajdz(g, 'E').map(([w, k]) => d[w * m + k]).filter((x) => x >= 0);
                return odl.length ? `najblizsze wyjscie: ${Math.min(...odl)}\nosiagalne wyjscia: ${odl.length}` : 'brak wyjscia';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<vector<int>> odl(n, vector<int>(m, -1));
    queue<pair<int, int>> q;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == 'S') {
                odl[w][k] = 0;
                q.push({w, k});
            }
        }
    }
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            if (g[nw][nk] == '#' || odl[nw][nk] != -1) continue;
            odl[nw][nk] = odl[w][k] + 1;
            q.push({nw, nk});
        }
    }
    int najblizsze = -1, osiagalne = 0;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == 'E' && odl[w][k] != -1) {
                osiagalne++;
                if (najblizsze == -1 || odl[w][k] < najblizsze) najblizsze = odl[w][k];
            }
        }
    }
    if (osiagalne == 0) cout << "brak wyjscia\n";
    else {
        cout << "najblizsze wyjscie: " << najblizsze << "\n";
        cout << "osiagalne wyjscia: " << osiagalne << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-pozar-lasu', krok: 8, level: 'srednie',
            title: 'Pożar lasu',
            short: 'Ogień zaczyna się w kilku miejscach naraz. Wszystkie płonące pola trafiają do kolejki na samym początku — BFS z wielu startów liczy minutę zapłonu każdego drzewa.',
            tags: ['BFS z wielu startów', 'tylko po drzewach', 'ostatnia minuta'],
            statement: ['Las to plansza n × m: T to drzewo, * to drzewo, które właśnie płonie, . to polana, a # skała. W każdej minucie ogień przeskakuje z każdego płonącego drzewa na sąsiednie (w czterech kierunkach) drzewa. Przez polany i skały ogień nie przechodzi.',
                'Wypisz, w której minucie zapali się ostatnie drzewo, do którego dotrze ogień (0, jeśli żadne nowe drzewo się nie zapali), i ile drzew ocaleje. Wstaw wszystkie pola * do kolejki od razu, z odległością 0 — wtedy BFS rozchodzi się ze wszystkich ognisk jednocześnie.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków.'],
            output_format: ['Dwa wiersze: minut: X oraz ocalalo: Y.'],
            constraints: ['1 ≤ n, m ≤ 100', 'Pole * występuje co najmniej raz.'],
            examples: [{ input: '3 6\nTT.TTT\n*T.T*T\nTTTT.T', note: 'Prawe ognisko w minucie 1 podpala trzy sąsiednie drzewa, a w minucie 2 dociera do dolnego wiersza. W minucie 3 zapala się ostatnie drzewo — w dolnym wierszu, w kolumnie 3, gdzie spotykają się oba pożary. Nic nie ocalało.' }],
            hint: R`Na początku: for po wszystkich polach — if (g[w][k] == '*') { odl[w][k] = 0; q.push({w, k}); }. W BFS wchodzisz tylko na pola 'T'. Na końcu: najwięcej odl to wynik, a drzewa T z odl == -1 ocalały.`,
            tests: (r) => {
                const las = (n, m, pT, ogniska) => {
                    const g = []; for (let i = 0; i < n; i++) { let s = ''; for (let j = 0; j < m; j++) { const x = r(); s += x < pT ? 'T' : x < pT + (1 - pT) / 2 ? '.' : '#'; } g.push(s); }
                    for (let i = 0; i < ogniska; i++) { const w = r.int(0, n - 1), k = r.int(0, m - 1); g[w] = g[w].slice(0, k) + '*' + g[w].slice(k + 1); }
                    return planszaTxt(g);
                };
                return ['1 1\n*', '1 3\n*.T', '1 4\n*TT*', '3 6\nTT.TTT\n*T.T*T\nTTTT.T', las(100, 100, 0.7, 3), las(100, 100, 0.6, 1), las(100, 100, 0.9, 10), las(100, 100, 0.5, 30), las(15, 25, 0.75, 2)];
            },
            check: (inp) => (dobraPlansza(inp, 100, 100, 'T*.#') && ile(linie(inp).slice(1), '*') >= 1 ? null : 'plansza'),
            solve: (inp) => {
                const { m, g } = czytajPlansze(inp);
                const d = bfsPlansza(g, znajdz(g, '*'), (c) => c === 'T');
                let mx = 0, oc = 0;
                g.forEach((w, i) => w.split('').forEach((c, j) => { if (c === 'T') { if (d[i * m + j] < 0) oc++; else mx = Math.max(mx, d[i * m + j]); } }));
                return `minut: ${mx}\nocalalo: ${oc}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<vector<int>> odl(n, vector<int>(m, -1));
    queue<pair<int, int>> q;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == '*') {
                odl[w][k] = 0;
                q.push({w, k});
            }
        }
    }
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            if (g[nw][nk] != 'T' || odl[nw][nk] != -1) continue;
            odl[nw][nk] = odl[w][k] + 1;
            q.push({nw, nk});
        }
    }
    int minut = 0, ocalalo = 0;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] != 'T') continue;
            if (odl[w][k] == -1) ocalalo++;
            else minut = max(minut, odl[w][k]);
        }
    }
    cout << "minut: " << minut << "\n";
    cout << "ocalalo: " << ocalalo << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-skoczek', krok: 8, level: 'srednie',
            title: 'Skoczek szachowy',
            short: 'Skoczek skacze „literą L”, więc z każdego pola ma do ośmiu sąsiadów. Zmieniasz tylko tablice kierunków — reszta BFS zostaje taka sama.',
            tags: ['8 ruchów skoczka', 'BFS bez ścian', 'kilka pytań'],
            statement: ['Szachownica ma n × n pól; wiersze i kolumny numerujemy od 1 do n. Skoczek skacze o dwa pola w jednym kierunku i o jedno w kierunku prostopadłym (jak litera L) — z pola w środku planszy ma osiem możliwych skoków. Nie może wyskoczyć poza szachownicę.',
                'Odpowiedz na t pytań: ile najmniej skoków potrzebuje skoczek, żeby przejść z pola (w₁, k₁) na pole (w₂, k₂)? Jeśli się nie da, wypisz −1. Dla każdego pytania uruchom osobny BFS.'],
            input_format: ['W pierwszym wierszu liczby n i t.', 'W każdym z t kolejnych wierszy cztery liczby w₁, k₁, w₂, k₂.'],
            output_format: ['t wierszy — odpowiedzi na pytania.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ t ≤ 5', '1 ≤ w₁, k₁, w₂, k₂ ≤ n'],
            examples: [{ input: '8 3\n1 1 8 8\n1 1 1 2\n4 4 4 4', note: 'Z rogu do przeciwnego rogu zwykłej szachownicy trzeba 6 skoków, a na sąsiednie pole — 3. Gdy start i cel to to samo pole, odpowiedź to 0.' },
                { input: '3 1\n1 1 2 2', note: 'Na planszy 3 × 3 środkowe pole jest dla skoczka niedostępne.' }],
            hint: R`int dw[8] = {-2, -2, -1, -1, 1, 1, 2, 2}, dk[8] = {-1, 1, -2, 2, -2, 2, -1, 1};. Dla każdego pytania nowa tablica odl(n + 1, vector<int>(n + 1, -1)) i nowa kolejka. Pętla po kierunkach idzie do 8, nie do 4.`,
            tests: (r) => {
                const gen = (n, t) => `${n} ${t}\n${Array.from({ length: t }, () => `${r.int(1, n)} ${r.int(1, n)} ${r.int(1, n)} ${r.int(1, n)}`).join('\n')}`;
                return ['1 1\n1 1 1 1', '2 2\n1 1 2 2\n1 1 1 1', '3 1\n1 1 2 2', '8 3\n1 1 8 8\n1 1 1 2\n4 4 4 4', '1000 5\n1 1 1000 1000\n1 1 1 2\n500 500 1 1000\n1000 1000 999 999\n1 1000 1000 1', gen(1000, 5), gen(4, 5), gen(100, 5)];
            },
            check: (inp) => { const L = linie(inp); const [n, t] = L[0].split(' ').map(Number); if (!calk(n, 1, 1000) || !calk(t, 1, 5) || L.length !== t + 1) return 'n'; return L.slice(1).every((l) => { const x = l.split(' ').map(Number); return x.length === 4 && x.every((v) => calk(v, 1, n)); }) ? null : 'pytania'; },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0].split(' ')[0]);
                const g = Array.from({ length: n }, () => '.'.repeat(n));
                return L.slice(1).map((l) => { const [a, b, c, d] = l.split(' ').map(Number); return String(bfsPlansza(g, [[a - 1, b - 1]], () => true, SKOCZEK)[(c - 1) * n + d - 1]); }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, t;
    cin >> n >> t;
    int dw[8] = {-2, -2, -1, -1, 1, 1, 2, 2};
    int dk[8] = {-1, 1, -2, 2, -2, 2, -1, 1};
    for (int z = 0; z < t; z++) {
        int w1, k1, w2, k2;
        cin >> w1 >> k1 >> w2 >> k2;
        vector<vector<int>> odl(n + 1, vector<int>(n + 1, -1));
        queue<pair<int, int>> q;
        odl[w1][k1] = 0;
        q.push({w1, k1});
        while (!q.empty()) {
            auto [w, k] = q.front();
            q.pop();
            for (int i = 0; i < 8; i++) {
                int nw = w + dw[i], nk = k + dk[i];
                if (nw < 1 || nw > n || nk < 1 || nk > n) continue;
                if (odl[nw][nk] != -1) continue;
                odl[nw][nk] = odl[w][k] + 1;
                q.push({nw, nk});
            }
        }
        cout << odl[w2][k2] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'kol-droga-z-gwiazdek', krok: 8, level: 'srednie',
            title: 'Droga z gwiazdek',
            short: 'Zaznacz na mapie najkrótszą drogę z S do K. Każde pole pamięta, z którego sąsiada przyszła do niego fala — od K cofasz się po tych strzałkach aż do S.',
            tags: ['skąd przyszła fala', 'odtwarzanie drogi', 'zmiana planszy'],
            statement: ['Mapa to plansza n × m z wolnymi polami ., ścianami #, startem S i celem K. Chodzisz w czterech kierunkach. Gwarantujemy, że z S do K da się dojść i że najkrótsza droga jest dokładnie jedna.',
                'Wypisz długość tej drogi, a potem mapę, na której każde pole drogi — oprócz S i K — jest zamienione na *. W BFS zapamiętuj dla każdego pola, z którego pola do niego weszłaś (skad), a potem od K cofaj się po skad, aż dojdziesz do S.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków.'],
            output_format: ['Wiersz dlugosc: L, a potem n wierszy mapy z zaznaczoną drogą.'],
            constraints: ['1 ≤ n, m ≤ 60', 'S i K występują dokładnie raz; droga z S do K istnieje, a najkrótsza jest jedna.'],
            examples: [{ input: '5 7\n#######\n#S..#.#\n##.##.#\n#...K.#\n#######', note: 'Droga: w prawo, w dół, w dół, w prawo, w prawo — 5 kroków. Cztery pola pośrodku drogi dostają gwiazdki, a ślepa uliczka obok S i korytarz po prawej zostają kropkami.' }],
            hint: R`vector<vector<pair<int, int>>> skad(n, vector<pair<int, int>>(m));. Przy wkładaniu sąsiada: skad[nw][nk] = {w, k};. Potem: auto [w, k] = skad[kw][kk]; while (g[w][k] != 'S') { g[w][k] = '*'; tie(w, k) = skad[w][k]; } — albo zwykła pętla z dwiema zmiennymi pomocniczymi.`,
            tests: (r) => {
                const jedna = (fn) => {
                    for (let k = 0; k < 500; k++) {
                        const g = fn(); const s = wstaw(r, g, 'S'); const c = wstaw(r, g, 'K');
                        const w = ileNajkrotszych(g, s, c);
                        if (w.odl >= 2 && w.ile === 1) return planszaTxt(g);
                    }
                    throw new Error('kol-droga-z-gwiazdek: brak planszy');
                };
                return ['1 2\nSK', '1 4\nS..K', '5 7\n#######\n#S..#.#\n##.##.#\n#...K.#\n#######', jedna(() => losLabirynt(r, 29, 29)), jedna(() => losLabirynt(r, 20, 29, 40)), jedna(() => losPlansza(r, 30, 40, 0.38)), jedna(() => losLabirynt(r, 5, 12)), jedna(() => losPlansza(r, 60, 60, 0.4))];
            },
            check: (inp) => {
                const g = linie(inp).slice(1);
                if (!dobraPlansza(inp, 60, 60, '.#SK') || ile(g, 'S') !== 1 || ile(g, 'K') !== 1) return 'plansza';
                const w = ileNajkrotszych(g, znajdz(g, 'S')[0], znajdz(g, 'K')[0]);
                return w.odl >= 0 && w.ile === 1 ? null : 'droga';
            },
            solve: (inp) => {
                const { m, g } = czytajPlansze(inp);
                const s = znajdz(g, 'S')[0], c = znajdz(g, 'K')[0];
                const d = bfsPlansza(g, [s]);
                const t = g.map((w) => w.split(''));
                let [w, k] = c;
                while (d[w * m + k] > 1) {
                    const v = d[w * m + k];
                    const nxt = D4.map(([a, b]) => [w + a, k + b]).find(([a, b]) => a >= 0 && a < g.length && b >= 0 && b < m && d[a * m + b] === v - 1);
                    [w, k] = nxt; t[w][k] = '*';
                }
                return `dlugosc: ${d[c[0] * m + c[1]]}\n${t.map((x) => x.join('')).join('\n')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<vector<int>> odl(n, vector<int>(m, -1));
    vector<vector<pair<int, int>>> skad(n, vector<pair<int, int>>(m));
    queue<pair<int, int>> q;
    int kw = 0, kk = 0;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == 'S') {
                odl[w][k] = 0;
                q.push({w, k});
            }
            if (g[w][k] == 'K') {
                kw = w;
                kk = k;
            }
        }
    }
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            if (g[nw][nk] == '#' || odl[nw][nk] != -1) continue;
            odl[nw][nk] = odl[w][k] + 1;
            skad[nw][nk] = {w, k};
            q.push({nw, nk});
        }
    }
    int w = skad[kw][kk].first, k = skad[kw][kk].second;
    while (g[w][k] != 'S') {
        g[w][k] = '*';
        int pw = skad[w][k].first, pk = skad[w][k].second;
        w = pw;
        k = pk;
    }
    cout << "dlugosc: " << odl[kw][kk] << "\n";
    for (int i = 0; i < n; i++) cout << g[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-najblizszy-sklep', krok: 8, level: 'srednie',
            title: 'Najbliższy sklep',
            short: 'Dla każdego domu odległość do najbliższego sklepu. Zamiast BFS z każdego domu — jeden BFS ze wszystkich sklepów naraz. Najdalszy dom to maksimum.',
            tags: ['BFS z wielu startów', 'odwrócenie kierunku', 'maksimum z minimów'],
            statement: ['Mapa osiedla to plansza n × m: D to dom, S sklep, . chodnik, a # płot. Chodzi się w czterech kierunkach po wszystkich polach oprócz płotów (także przez domy i sklepy). Dla każdego domu liczy się odległość do najbliższego sklepu.',
                'Wypisz, jak daleko do najbliższego sklepu ma dom, który ma najdalej (spośród domów, z których do jakiegokolwiek sklepu da się dojść), i ile domów nie ma dojścia do żadnego sklepu. Jeśli żaden dom nie ma dojścia do sklepu, w pierwszym wierszu wypisz −1. Wskazówka: odległość domu od najbliższego sklepu to odległość od niego „fali” wypuszczonej jednocześnie ze wszystkich sklepów.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków.'],
            output_format: ['Dwa wiersze: najdalej: X oraz bez sklepu: Y.'],
            constraints: ['1 ≤ n, m ≤ 100', 'Na mapie jest co najmniej jeden dom i co najmniej jeden sklep.'],
            examples: [{ input: '3 7\nD..S..D\n.#####.\nD..#..D', note: 'Domy w górnym wierszu mają do sklepu po 3 kroki, lewy dolny 5 (przez lewy górny róg), prawy dolny też 5. Najdalej: 5.' }],
            hint: R`Na start do kolejki wstaw wszystkie sklepy z odl = 0. Po BFS: dla każdego domu albo odl == -1 (bez sklepu), albo bierzesz go pod uwagę w maksimum.`,
            tests: (r) => {
                const gen = (n, m, p, d, s) => { const g = losPlansza(r, n, m, p); for (let i = 0; i < d; i++) wstaw(r, g, 'D'); for (let i = 0; i < s; i++) wstaw(r, g, 'S'); return planszaTxt(g); };
                return ['1 2\nDS', '1 3\nD#S', '3 7\nD..S..D\n.#####.\nD..#..D', gen(100, 100, 0.3, 300, 5), gen(100, 100, 0.45, 500, 20), gen(100, 100, 0.05, 2000, 1), gen(100, 100, 0.5, 100, 2), gen(20, 30, 0.3, 30, 3)];
            },
            check: (inp) => { const g = linie(inp).slice(1); return dobraPlansza(inp, 100, 100, 'DS.#') && ile(g, 'D') >= 1 && ile(g, 'S') >= 1 ? null : 'plansza'; },
            solve: (inp) => {
                const { m, g } = czytajPlansze(inp);
                const d = bfsPlansza(g, znajdz(g, 'S'));
                let mx = -1, bez = 0;
                for (const [w, k] of znajdz(g, 'D')) { const x = d[w * m + k]; if (x < 0) bez++; else mx = Math.max(mx, x); }
                return `najdalej: ${mx}\nbez sklepu: ${bez}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<vector<int>> odl(n, vector<int>(m, -1));
    queue<pair<int, int>> q;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] == 'S') {
                odl[w][k] = 0;
                q.push({w, k});
            }
        }
    }
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (!q.empty()) {
        auto [w, k] = q.front();
        q.pop();
        for (int i = 0; i < 4; i++) {
            int nw = w + dw[i], nk = k + dk[i];
            if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
            if (g[nw][nk] == '#' || odl[nw][nk] != -1) continue;
            odl[nw][nk] = odl[w][k] + 1;
            q.push({nw, nk});
        }
    }
    int najdalej = -1, bez = 0;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (g[w][k] != 'D') continue;
            if (odl[w][k] == -1) bez++;
            else najdalej = max(najdalej, odl[w][k]);
        }
    }
    cout << "najdalej: " << najdalej << "\n";
    cout << "bez sklepu: " << bez << "\n";
    return 0;
}`,
        },
        {
            id: 'kol-wielka-mapa', krok: 8, level: 'trudne',
            time_limit: '2 s',
            title: 'Wielka mapa wysp',
            short: 'Mapa 2000 × 2000 z generatora, a na niej wyspy po milion pól. Rekurencyjne zalewanie wywróci stos — BFS z kolejką policzy wyspy bez kłopotu.',
            tags: ['BFS zamiast rekurencji', 'liczenie wysp', 'plansza z generatora'],
            statement: ['Mapa ma n wierszy i m kolumn. Liczby dla pól powstają z generatora: x₁ = s, x_{k+1} = (x_k · a + b) mod M. Pola wypełniamy wiersz po wierszu, od lewej do prawej: pole w wierszu i i kolumnie j (liczonych od 0) dostaje liczbę x_{i·m + j + 1}. Pole jest lądem, jeśli ta liczba modulo 100 jest mniejsza niż p, a w przeciwnym razie — wodą.',
                'Wyspa to spójny kawałek lądu (pola łączą się bokami, w czterech kierunkach). Policz wyspy i podaj powierzchnię największej (w polach; 0, jeśli nie ma lądu). Uwaga: wyspy mają tu nawet miliony pól — zalewanie rekurencyjne z lekcji o rekurencji zeszłoby tak głęboko, że program by się wywrócił. Przeszukuj wyspy BFS-em.'],
            input_format: ['W pierwszym wierszu liczby n, m i p.', 'W drugim wierszu liczby s, a, b i M (parametry generatora).'],
            output_format: ['Dwa wiersze: wysp: X oraz najwieksza: Y.'],
            constraints: ['1 ≤ n, m ≤ 2000', '0 ≤ p ≤ 100', '1 ≤ M ≤ 10⁹', '0 ≤ s, a, b < M'],
            examples: [{ input: '3 4 50\n7 3 2 100', note: 'Liczby: 7, 23, 71, 15 (wiersz 0), 47, 43, 31, 95 (wiersz 1) i 87, 63, 91, 75 (wiersz 2). Ląd to liczby mniejsze niż 50: w wierszu 0 kolumny 0, 1 i 3, w wierszu 1 kolumny 0, 1 i 2. Pięć pól po lewej tworzy jedną wyspę, a pole w prawym górnym rogu — drugą.' }],
            hint: R`vector<string> g(n, string(m, '.')); long long x = s; for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) { if (x % 100 < p) g[i][j] = '#'; x = (x * a + b) % M; }. Potem pętla po polach: każde nieodwiedzone pole lądu to nowa wyspa — BFS od niego liczy jej pola. Tablica odwiedzin: vector<vector<char>> albo vector<string>.`,
            tests: (r) => ['1 1 100\n0 0 0 1', '1 1 0\n5 1 1 10', '3 4 50\n7 3 2 100', '2000 2000 100\n1 1 1 1000000000', '2000 2000 60\n123456 48271 11 999999937', '2000 2000 70\n987654 16807 3 999999937', '2000 2000 45\n42 69621 1 999999937', '1000 1500 59\n7 40692 5 999999937', `500 700 ${r.int(30, 80)}\n${r.int(1, 999999936)} ${r.int(2, 999999936)} ${r.int(0, 999999936)} 999999937`],
            check: (inp) => { const t = nums(inp); const [n, m, p, s, a, b, M] = t; return t.length === 7 && calk(n, 1, 2000) && calk(m, 1, 2000) && calk(p, 0, 100) && calk(M, 1, 1e9) && [s, a, b].every((v) => calk(v, 0, M - 1)) ? null : 'dane'; },
            solve: (inp) => {
                const [n, m, p, s, a, b, M] = nums(inp);
                const x = generuj(n * m, s, a, b, M);
                const lad = new Uint8Array(n * m);
                for (let i = 0; i < n * m; i++) lad[i] = x[i] % 100 < p ? 1 : 0;
                const q = new Int32Array(n * m); let wysp = 0, naj = 0;
                for (let v0 = 0; v0 < n * m; v0++) {
                    if (lad[v0] !== 1) continue;
                    wysp++; let hh = 0, tt = 0; q[tt++] = v0; lad[v0] = 2;
                    while (hh < tt) {
                        const v = q[hh++]; const w = Math.floor(v / m), k = v % m;
                        if (w > 0 && lad[v - m] === 1) { lad[v - m] = 2; q[tt++] = v - m; }
                        if (w < n - 1 && lad[v + m] === 1) { lad[v + m] = 2; q[tt++] = v + m; }
                        if (k > 0 && lad[v - 1] === 1) { lad[v - 1] = 2; q[tt++] = v - 1; }
                        if (k < m - 1 && lad[v + 1] === 1) { lad[v + 1] = 2; q[tt++] = v + 1; }
                    }
                    naj = Math.max(naj, tt);
                }
                return `wysp: ${wysp}\nnajwieksza: ${naj}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m, p;
    long long s, a, b, M;
    cin >> n >> m >> p >> s >> a >> b >> M;
    vector<string> g(n, string(m, '.'));
    long long x = s;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (x % 100 < p) g[i][j] = '#';
            x = (x * a + b) % M;
        }
    }
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    int wysp = 0, najwieksza = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (g[i][j] != '#') continue;
            wysp++;
            int pola = 0;
            queue<pair<int, int>> q;
            g[i][j] = 'o';
            q.push({i, j});
            while (!q.empty()) {
                auto [w, k] = q.front();
                q.pop();
                pola++;
                for (int d = 0; d < 4; d++) {
                    int nw = w + dw[d], nk = k + dk[d];
                    if (nw < 0 || nw >= n || nk < 0 || nk >= m) continue;
                    if (g[nw][nk] != '#') continue;
                    g[nw][nk] = 'o';
                    q.push({nw, nk});
                }
            }
            najwieksza = max(najwieksza, pola);
        }
    }
    cout << "wysp: " << wysp << "\n";
    cout << "najwieksza: " << najwieksza << "\n";
    return 0;
}`,
        },
    ];
};
