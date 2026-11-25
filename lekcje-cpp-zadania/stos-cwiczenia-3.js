// Stos — ćwiczenia w trakcie lekcji, części 7–8: stos zamiast rekurencji (DFS z własnym stosem na grafie i planszy,
// ta sama kolejność co w rekurencji, stos jako ścieżka, drzewa bez rekurencji) oraz sztuczki olimpijskie (zderzenia,
// katalogi, zagnieżdżone powtórzenia, zachłanne usuwanie cyfr, tory przetokowe, kolejka z dwóch stosów, kolejka
// z minimum i stos z dodawaniem do dolnych elementów).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./stos-pomoc');
    const { calk, D4, losPlansza, losLabirynt, wstaw, znajdz, losGraf, losDrzewoOjcow, SLOWA } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const planszaTxt = (g) => `${g.length} ${g[0].length}\n${g.join('\n')}`;
    const czytajPlansze = (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); return { n, m, g: L.slice(1, n + 1) }; };
    const dobraPlansza = (inp, maxN, znaki) => {
        const L = linie(inp); const [n, m] = L[0].split(' ').map(Number);
        return calk(n, 1, maxN) && calk(m, 1, maxN) && L.length === n + 1 && L.slice(1).every((s) => s.length === m && [...s].every((c) => znaki.includes(c)));
    };
    // Spójne kawałki pól spełniających warunek (4 kierunki) — iteracyjnie, zwraca rozmiary.
    function kawalki(g, czy) {
        const n = g.length, m = g[0].length, byl = new Uint8Array(n * m), out = [];
        for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
            if (byl[i * m + j] || !czy(g[i][j], i, j)) continue;
            let ile = 0; const st = [i * m + j]; byl[i * m + j] = 1;
            while (st.length) {
                const v = st.pop(); ile++;
                const w = Math.floor(v / m), k = v % m;
                for (const [dw, dk] of D4) { const a = w + dw, b = k + dk; if (a < 0 || a >= n || b < 0 || b >= m || byl[a * m + b] || !czy(g[a][b], a, b)) continue; byl[a * m + b] = 1; st.push(a * m + b); }
            }
            out.push(ile);
        }
        return out;
    }

    return [
        // ================================================================ KROK 7 · DFS z własnym stosem
        {
            id: 'sto-kolejnosc-dfs', krok: 7, level: 'srednie',
            title: 'Kolejność przeszukiwania w głąb',
            short: 'DFS bez rekurencji: zdejmij wierzchołek, oznacz go, połóż sąsiadów na stos od największego — wtedy najmniejszy będzie na wierzchu i wyjdzie jak w rekurencji.',
            tags: ['DFS na stosie', 'oznaczanie przy zdejmowaniu', 'sąsiedzi malejąco'],
            statement: ['W grafie jest n wierzchołków (od 1 do n) i m krawędzi bez kierunku. Przeszukaj go w głąb, zaczynając od wierzchołka 1, i wypisz wierzchołki w kolejności odwiedzania. Zasada jest taka jak w rekurencyjnym DFS: z bieżącego wierzchołka idziesz do najmniejszego jeszcze nieodwiedzonego sąsiada, a gdy takiego nie ma, wracasz tam, skąd przyszedłeś. Wierzchołków nieosiągalnych z 1 nie wypisujesz.',
                'Napisz to bez rekurencji, z własnym stosem stack<int>. Zdejmij wierzchołek z wierzchu; jeśli był już odwiedzony, pomiń go. W przeciwnym razie oznacz go, wypisz i połóż na stos wszystkich jego nieodwiedzonych sąsiadów — od największego do najmniejszego, żeby najmniejszy leżał na wierzchu i został odwiedzony pierwszy. Ten sam wierzchołek może trafić na stos kilka razy — dlatego oznaczamy przy zdejmowaniu, a nie przy wkładaniu.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z m kolejnych wierszy dwie liczby a i b — krawędź między a i b.'],
            output_format: ['Jeden wiersz: numery wierzchołków w kolejności odwiedzania.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ m ≤ 8000', 'Krawędzie się nie powtarzają i nie łączą wierzchołka z nim samym.'],
            examples: [{ input: '6 6\n1 2\n1 3\n2 4\n3 4\n4 5\n3 6', note: 'Z 1 idziemy do 2 (mniejszy sąsiad), z 2 do 4, z 4 do 3 (najmniejszy nieodwiedzony), z 3 do 6. Wracamy do 4 i idziemy do 5.' }],
            hint: R`for (v) sort(g[v].begin(), g[v].end(), greater<int>()); — sąsiedzi malejąco. stack<int> s; s.push(1); while (!s.empty()) { int v = s.top(); s.pop(); if (byl[v]) continue; byl[v] = true; cout << v << " "; for (int u : g[v]) if (!byl[u]) s.push(u); }.`,
            tests: (r) => {
                const txt = (n, kr) => `${n} ${kr.length}` + (kr.length ? '\n' + kr.map((e) => e.join(' ')).join('\n') : '');
                const sciezka = (n) => { const p = r.shuffle(Array.from({ length: n - 1 }, (_, i) => i + 2)); const o = [1, ...p]; return r.shuffle(o.slice(1).map((v, i) => [o[i], v])); };
                return [txt(1, []), txt(3, [[2, 3]]), txt(4, [[1, 4], [1, 2], [1, 3]]), txt(5, [[1, 2], [2, 3], [3, 1], [3, 4], [4, 5], [5, 1]]), txt(8, losGraf(r, 8, 10, true)), txt(5000, losGraf(r, 5000, 8000, true)), txt(5000, losGraf(r, 5000, 6000, false)), txt(5000, sciezka(5000)), txt(100, losGraf(r, 100, 2000, false)), txt(3000, losGraf(r, 3000, 2999, true))];
            },
            check: (inp) => {
                const t = nums(inp); const [n, m] = t;
                if (!calk(n, 1, 5000) || !calk(m, 0, 8000) || t.length !== 2 + 2 * m) return 'dane';
                const bylo = new Set();
                for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; if (!calk(a, 1, n) || !calk(b, 1, n) || a === b) return 'krawedz'; const k = Math.min(a, b) * 10000 + Math.max(a, b); if (bylo.has(k)) return 'powtorzona'; bylo.add(k); }
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const [n, m] = t;
                const g = Array.from({ length: n + 1 }, () => []);
                for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; g[a].push(b); g[b].push(a); }
                for (const x of g) x.sort((p, q) => q - p);
                const byl = new Uint8Array(n + 1), st = [1], o = [];
                while (st.length) { const v = st.pop(); if (byl[v]) continue; byl[v] = 1; o.push(v); for (const u of g[v]) if (!byl[u]) st.push(u); }
                return o.join(' ');
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
    for (int v = 1; v <= n; v++) sort(g[v].begin(), g[v].end(), greater<int>());
    vector<bool> byl(n + 1, false);
    stack<int> s;
    s.push(1);
    while (!s.empty()) {
        int v = s.top();
        s.pop();
        if (byl[v]) continue;
        byl[v] = true;
        cout << v << " ";
        for (int u : g[v]) {
            if (!byl[u]) s.push(u);
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-ile-wysp', krok: 7, level: 'latwe',
            title: 'Ile jest wysp?',
            short: 'Zalewanie planszy bez rekurencji: każde nowe pole lądu zaczyna wyspę, a stos pól do obejrzenia zalewa ją całą. Żadnego przepełnienia stosu wywołań.',
            tags: ['zalewanie stosem', 'oznaczanie przy wkładaniu', 'cztery kierunki'],
            statement: ['Mapa to plansza n × m: # to ląd, a kropka to woda. Wyspa to grupa pól lądu połączonych bokami (w górę, w dół, w lewo i w prawo — nie po skosie). Policz wyspy i podaj wielkość największej z nich (liczbę pól). Jeśli lądu nie ma, wypisz 0 0.',
                'Przejdź wszystkie pola. Gdy trafisz na ląd, którego jeszcze nie odwiedziłeś, znalazłeś nową wyspę: oznacz pole, połóż je na stos stack<pair<int, int>> i zalewaj — dopóki stos nie jest pusty, zdejmij pole, policz je i połóż na stos wszystkich nieodwiedzonych sąsiadów-ląd (od razu ich oznaczając). Tak działa zalewanie z lekcji o rekurencji, tylko stos jest Twój, a nie kompilatora — duża wyspa niczego nie wywróci.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków: # albo kropka.'],
            output_format: ['Jeden wiersz: liczba wysp i wielkość największej.'],
            constraints: ['1 ≤ n, m ≤ 250'],
            examples: [{ input: '4 6\n##..#.\n#...##\n..#...\n.##..#', note: 'Wyspy: trzy pola w lewym górnym rogu, trzy po prawej u góry, trzy na dole po lewej i jedno pole w prawym dolnym rogu.' }],
            hint: R`int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};. Dla nowej wyspy: stack<pair<int, int>> s; s.push({i, j}); byl[i][j] = true; while (!s.empty()) { auto [w, k] = s.top(); s.pop(); ile++; for (int d = 0; d < 4; d++) { … granice, ląd, nieodwiedzony → oznacz i push } }.`,
            tests: (r) => [planszaTxt(['.']), planszaTxt(['#']), planszaTxt(['#.#', '.#.', '#.#']), planszaTxt(losPlansza(r, 8, 10, 0.55)), planszaTxt(losPlansza(r, 250, 250, 0.55)), planszaTxt(losPlansza(r, 250, 250, 0.9)), planszaTxt(losPlansza(r, 250, 250, 0.3)), planszaTxt(Array.from({ length: 250 }, () => '#'.repeat(250))), planszaTxt(losPlansza(r, 1, 250, 0.5)), planszaTxt(Array.from({ length: 250 }, (_, i) => (i % 2 ? '#'.repeat(250) : '.'.repeat(249) + '#')))],
            check: (inp) => (dobraPlansza(inp, 250, '#.') ? null : 'dane'),
            solve: (inp) => { const { g } = czytajPlansze(inp); const w = kawalki(g, (c) => c === '#'); return `${w.length} ${w.length ? Math.max(...w) : 0}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    vector<vector<bool>> byl(n, vector<bool>(m, false));
    int wysp = 0, naj = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (g[i][j] != '#' || byl[i][j]) continue;
            wysp++;
            int ile = 0;
            stack<pair<int, int>> s;
            s.push({i, j});
            byl[i][j] = true;
            while (!s.empty()) {
                auto [w, k] = s.top();
                s.pop();
                ile++;
                for (int d = 0; d < 4; d++) {
                    int a = w + dw[d], b = k + dk[d];
                    if (a < 0 || a >= n || b < 0 || b >= m) continue;
                    if (g[a][b] != '#' || byl[a][b]) continue;
                    byl[a][b] = true;
                    s.push({a, b});
                }
            }
            naj = max(naj, ile);
        }
    }
    cout << wysp << " " << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-plamy-farby', krok: 7, level: 'srednie',
            title: 'Plamy farby',
            short: 'Plama to kawałek planszy w jednym kolorze. Zalewaj stosem po polach tej samej litery i zapamiętaj, ile plam ma każdy kolor.',
            tags: ['zalewanie po kolorze', 'stos par', 'licznik dla każdej litery'],
            statement: ['Obraz to plansza n × m, a każde pole jest pomalowane jednym z kolorów oznaczonych małymi literami. Plama to grupa pól tego samego koloru połączonych bokami. Policz wszystkie plamy, a potem dla każdego koloru, który występuje na obrazie (w kolejności alfabetycznej), wypisz, ile ma plam i jak duża jest jego największa plama.',
                'To samo zalewanie stosem co przy wyspach, tylko sąsiad należy do plamy, gdy ma ten sam kolor co pole, od którego zaczęliśmy.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m małych liter.'],
            output_format: ['W pierwszym wierszu: plam: K.', 'Potem dla każdego występującego koloru wiersz: litera, liczba jego plam i wielkość największej z nich.'],
            constraints: ['1 ≤ n, m ≤ 250', 'Kolory to litery od a do z.'],
            examples: [{ input: '3 4\naabb\nabba\nccba', note: 'Kolor a ma dwie plamy: trzy pola w lewym górnym rogu i dwa pola po prawej. Kolor b ma jedną plamę z pięciu pól, a c — jedną z dwóch.' }],
            hint: R`int ile[26] = {0}, naj[26] = {0};. Nowa plama zaczyna się od nieodwiedzonego pola o kolorze c = g[i][j]: zalewaj, wkładając na stos sąsiadów z g[a][b] == c. Po zalaniu: ile[c - 'a']++; naj[c - 'a'] = max(naj[c - 'a'], rozmiar);.`,
            tests: (r) => {
                const obraz = (n, m, alf, p) => { const g = []; for (let i = 0; i < n; i++) { let s = ''; for (let j = 0; j < m; j++) s += r() < p && (i || j) ? (j ? s[j - 1] : g[i - 1][0]) : r.pick(alf.split('')); g.push(s); } return g; };
                return [planszaTxt(['z']), planszaTxt(['ab', 'ba']), planszaTxt(['aaa', 'aba', 'aaa']), planszaTxt(obraz(8, 10, 'abc', 0.4)), planszaTxt(obraz(250, 250, 'ab', 0.3)), planszaTxt(obraz(250, 250, 'abcdefghijklmnopqrstuvwxyz', 0.6)), planszaTxt(obraz(250, 250, 'xy', 0.0)), planszaTxt(Array.from({ length: 250 }, () => 'q'.repeat(250))), planszaTxt(obraz(100, 200, 'kot', 0.5))];
            },
            check: (inp) => (dobraPlansza(inp, 250, 'abcdefghijklmnopqrstuvwxyz') ? null : 'dane'),
            solve: (inp) => {
                const { g } = czytajPlansze(inp);
                const ile = new Array(26).fill(0), naj = new Array(26).fill(0);
                const n = g.length, m = g[0].length, byl = new Uint8Array(n * m);
                let plam = 0;
                for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) {
                    if (byl[i * m + j]) continue;
                    const c = g[i][j]; let roz = 0; const st = [i * m + j]; byl[i * m + j] = 1;
                    while (st.length) { const v = st.pop(); roz++; const w = Math.floor(v / m), k = v % m; for (const [dw, dk] of D4) { const a = w + dw, b = k + dk; if (a < 0 || a >= n || b < 0 || b >= m || byl[a * m + b] || g[a][b] !== c) continue; byl[a * m + b] = 1; st.push(a * m + b); } }
                    plam++; const x = c.charCodeAt(0) - 97; ile[x]++; naj[x] = Math.max(naj[x], roz);
                }
                const o = [`plam: ${plam}`];
                for (let x = 0; x < 26; x++) if (ile[x]) o.push(`${String.fromCharCode(97 + x)} ${ile[x]} ${naj[x]}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    vector<vector<bool>> byl(n, vector<bool>(m, false));
    int ile[26] = {0}, naj[26] = {0}, plam = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (byl[i][j]) continue;
            char c = g[i][j];
            int rozmiar = 0;
            stack<pair<int, int>> s;
            s.push({i, j});
            byl[i][j] = true;
            while (!s.empty()) {
                auto [w, k] = s.top();
                s.pop();
                rozmiar++;
                for (int d = 0; d < 4; d++) {
                    int a = w + dw[d], b = k + dk[d];
                    if (a < 0 || a >= n || b < 0 || b >= m) continue;
                    if (g[a][b] != c || byl[a][b]) continue;
                    byl[a][b] = true;
                    s.push({a, b});
                }
            }
            plam++;
            ile[c - 'a']++;
            naj[c - 'a'] = max(naj[c - 'a'], rozmiar);
        }
    }
    cout << "plam: " << plam << "\n";
    for (int x = 0; x < 26; x++) {
        if (ile[x] > 0) cout << char('a' + x) << " " << ile[x] << " " << naj[x] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-czy-jest-droga', krok: 7, level: 'latwe',
            title: 'Czy da się dojść?',
            short: 'Z S rozlewasz się stosem po wolnych polach. Jeśli zalanie dotrze do K — droga istnieje. Odległość nie jest potrzebna, więc wystarczy DFS.',
            tags: ['DFS na planszy', 'TAK / NIE', 'kilka testów'],
            statement: ['Dostajesz t labiryntów. Każdy to plansza n × m: # to ściana, kropka to wolne pole, S to start, a K — koniec. Z pola można przejść na sąsiednie wolne pole (w górę, w dół, w lewo albo w prawo). Dla każdego labiryntu sprawdź, czy da się dojść z S do K.',
                'Nie pytamy o najkrótszą drogę, więc zamiast kolejki z BFS wystarczy stos: zalewaj labirynt od S i sprawdź, czy zalanie dotarło do K. Pamiętaj, żeby tablicę odwiedzonych pól i stos przygotować od nowa dla każdego labiryntu.'],
            input_format: ['W pierwszym wierszu liczba t.', 'Każdy labirynt to wiersz z liczbami n i m oraz n wierszy po m znaków (#, kropka, S, K).'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 10', '1 ≤ n, m ≤ 100', 'W każdym labiryncie jest dokładnie jedno S i jedno K.'],
            examples: [{ input: '2\n3 4\nS.#.\n##..\nK..#\n2 3\nS#K\n...', note: 'W pierwszym labiryncie S jest zamknięty w rogu — NIE. W drugim można obejść ścianę dolnym wierszem — TAK.' }],
            hint: R`Znajdź S, połóż je na stos i oznacz. while (!s.empty()) { zdejmij; for (4 kierunki) if (w planszy && g[a][b] != '#' && !byl[a][b]) { byl[a][b] = true; s.push({a, b}); } }. Na końcu odpowiedzią jest byl[wK][kK].`,
            tests: (r) => {
                const lab = (n, m, p) => { const g = losPlansza(r, n, m, p); wstaw(r, g, 'S'); wstaw(r, g, 'K'); return g; };
                const d = (gs) => `${gs.length}\n${gs.map((g) => planszaTxt(g)).join('\n')}`;
                const lab2 = () => { const g = losLabirynt(r, 49, 49, r.int(0, 30)); wstaw(r, g, 'S'); wstaw(r, g, 'K'); return g; };
                return [d([['SK']]), d([['S#K'], ['S', 'K'], ['S.', '#K']]), d(Array.from({ length: 10 }, () => lab(r.int(2, 12), r.int(2, 12), r() * 0.5))), d(Array.from({ length: 10 }, () => lab(100, 100, r.pick([0.2, 0.4, 0.45, 0.5])))), d([lab2(), lab2(), lab2()])];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]); if (!calk(t, 1, 10)) return 't';
                let i = 1;
                for (let k = 0; k < t; k++) {
                    const [n, m] = (L[i++] || '').split(' ').map(Number);
                    if (!calk(n, 1, 100) || !calk(m, 1, 100)) return 'n m';
                    const g = L.slice(i, i + n); i += n;
                    if (g.length !== n || !g.every((s) => s.length === m && /^[.#SK]+$/.test(s))) return 'plansza';
                    const all = g.join(''); if (all.split('S').length !== 2 || all.split('K').length !== 2) return 'S K';
                }
                return i === L.length ? null : 'dane';
            },
            solve: (inp) => {
                const L = linie(inp); const t = Number(L[0]); let i = 1; const o = [];
                for (let k = 0; k < t; k++) {
                    const [n] = L[i++].split(' ').map(Number); const g = L.slice(i, i + n); i += n;
                    const s = znajdz(g, 'S')[0], kk = znajdz(g, 'K')[0];
                    const d = P.bfsPlansza(g, [s]);
                    o.push(d[kk[0] * g[0].length + kk[1]] >= 0 ? 'TAK' : 'NIE');
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    while (t--) {
        int n, m;
        cin >> n >> m;
        vector<string> g(n);
        for (int i = 0; i < n; i++) cin >> g[i];
        int sw = 0, sk = 0, kw = 0, kk = 0;
        for (int i = 0; i < n; i++) {
            for (int j = 0; j < m; j++) {
                if (g[i][j] == 'S') { sw = i; sk = j; }
                if (g[i][j] == 'K') { kw = i; kk = j; }
            }
        }
        vector<vector<bool>> byl(n, vector<bool>(m, false));
        stack<pair<int, int>> s;
        s.push({sw, sk});
        byl[sw][sk] = true;
        while (!s.empty()) {
            auto [w, k] = s.top();
            s.pop();
            for (int d = 0; d < 4; d++) {
                int a = w + dw[d], b = k + dk[d];
                if (a < 0 || a >= n || b < 0 || b >= m) continue;
                if (g[a][b] == '#' || byl[a][b]) continue;
                byl[a][b] = true;
                s.push({a, b});
            }
        }
        cout << (byl[kw][kk] ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-glebokosc-w-drzewie', krok: 7, level: 'srednie',
            title: 'Głębokość w drzewie rodzinnym',
            short: 'Każdy zna tylko swojego rodzica, a numery są pomieszane. Zbuduj listy dzieci i zejdź od korzenia stosem par (osoba, głębokość).',
            tags: ['drzewo z listą dzieci', 'stos par', 'głębokość dziecka = rodzic + 1'],
            statement: ['Drzewo rodzinne ma n osób o numerach od 1 do n. Osoba 1 to przodek wszystkich (korzeń), a dla każdej z pozostałych osób znasz numer jej rodzica. Numery są pomieszane — rodzic może mieć większy numer niż dziecko. Głębokość korzenia to 0, a głębokość każdej innej osoby jest o 1 większa niż głębokość jej rodzica.',
                'Wypisz głębokość każdej osoby, a w drugim wierszu — największą głębokość w drzewie. Zbuduj listę dzieci każdej osoby (vector<vector<int>>), a potem przejdź drzewo od korzenia stosem par (osoba, głębokość): zdejmij parę, zapisz głębokość i połóż na stos wszystkie dzieci z głębokością o 1 większą. W drzewie nie ma cykli, więc nie trzeba oznaczać odwiedzonych.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n − 1 liczb: rodzice osób 2, 3, …, n (dla n = 1 ten wiersz jest pusty).'],
            output_format: ['Dwa wiersze: n głębokości (osoby od 1 do n) oraz największa głębokość.'],
            constraints: ['1 ≤ n ≤ 5000', 'Dane opisują drzewo z korzeniem 1.'],
            examples: [{ input: '6\n4 1 1 3 5', note: 'Rodzicem osoby 2 jest 4, osoby 3 — 1, osoby 4 — 1, osoby 5 — 3, a osoby 6 — 5. Najgłębiej jest osoba 6: 1 → 3 → 5 → 6.' }],
            hint: R`vector<vector<int>> dzieci(n + 1); for (int v = 2; v <= n; v++) { cin >> p; dzieci[p].push_back(v); }. stack<pair<int, int>> s; s.push({1, 0}); while (!s.empty()) { auto [v, d] = s.top(); s.pop(); gl[v] = d; for (int u : dzieci[v]) s.push({u, d + 1}); }.`,
            tests: (r) => {
                const txt = (o) => `${o.length - 1}\n${o.slice(2).join(' ')}`;
                return ['1\n', txt([0, 0, 1]), txt([0, 0, 3, 1]), '6\n4 1 1 3 5', txt(losDrzewoOjcow(r, 10, 0.5)), txt(losDrzewoOjcow(r, 5000, 0.2)), txt(losDrzewoOjcow(r, 5000, 0.97)), txt(losDrzewoOjcow(r, 5000, 0)), txt(losDrzewoOjcow(r, 300, 0.6))];
            },
            check: (inp) => {
                const t = nums(inp); const n = t[0];
                if (!calk(n, 1, 5000) || t.length !== n) return 'dane';
                const ojc = [0, 0, ...t.slice(1)];
                for (let v = 2; v <= n; v++) if (!calk(ojc[v], 1, n) || ojc[v] === v) return 'rodzic';
                for (let v = 2; v <= n; v++) { let x = v, k = 0; while (x !== 1 && k <= n) { x = ojc[x]; k++; } if (x !== 1) return 'cykl'; }
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const n = t[0];
                const dz = Array.from({ length: n + 1 }, () => []);
                for (let v = 2; v <= n; v++) dz[t[v - 1]].push(v);
                const gl = new Array(n + 1).fill(0), st = [[1, 0]];
                while (st.length) { const [v, d] = st.pop(); gl[v] = d; for (const u of dz[v]) st.push([u, d + 1]); }
                return `${gl.slice(1).join(' ')}\n${Math.max(...gl.slice(1))}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<vector<int>> dzieci(n + 1);
    for (int v = 2; v <= n; v++) {
        int p;
        cin >> p;
        dzieci[p].push_back(v);
    }
    vector<int> gl(n + 1, 0);
    stack<pair<int, int>> s;
    s.push({1, 0});
    while (!s.empty()) {
        auto [v, d] = s.top();
        s.pop();
        gl[v] = d;
        for (int u : dzieci[v]) s.push({u, d + 1});
    }
    int naj = 0;
    for (int v = 1; v <= n; v++) {
        cout << gl[v] << " ";
        naj = max(naj, gl[v]);
    }
    cout << "\n" << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-nic-ariadny', krok: 7, level: 'srednie',
            title: 'Nić Ariadny',
            short: 'Stos trzyma całą drogę od S do miejsca, w którym stoisz. Ślepy zaułek? Zdejmij pole — cofasz się. Na końcu stos to gotowa droga do K.',
            tags: ['stos jako ścieżka', 'cofanie z zaułka', 'odczyt drogi ze stosu'],
            statement: ['Tezeusz szuka drogi w labiryncie i rozwija za sobą nić Ariadny. Labirynt to plansza n × m (# to ściana, kropka to korytarz, S to start, K to cel), w której między każdymi dwoma polami korytarza jest dokładnie jedna droga bez cofania się. Wypisz tę drogę z S do K jako ciąg liter: G (w górę), D (w dół), L (w lewo) i P (w prawo).',
                'Niech stos stack<pair<int, int>> będzie nicią: leżą na nim po kolei wszystkie pola od S do pola, na którym stoisz (na wierzchu). W każdym kroku spójrz na wierzch: jeśli to K — koniec. Jeśli ma sąsiada-korytarz, na którym jeszcze nie byłeś, oznacz go i połóż na stos (idziesz dalej). Jeśli nie ma — to ślepy zaułek: zdejmij wierzch (cofasz się po nici). Gdy dojdziesz do K, na stosie leży cała droga — od K na wierzchu do S na dnie. Przełóż ją do vectora, odwróć i zamień kolejne pary pól na litery.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków: #, kropka, S albo K.'],
            output_format: ['Jeden wiersz: długość drogi, spacja i ciąg liter G, D, L, P (dla S obok K — jedna litera).'],
            constraints: ['3 ≤ n, m ≤ 201', 'Między S i K jest dokładnie jedna droga, a S i K to różne pola.'],
            examples: [{ input: '5 5\n#####\n#S..#\n###.#\n#K..#\n#####', note: 'Z S w prawo dwa razy, w dół dwa razy, w lewo dwa razy: PPDDLL — 6 kroków.' }],
            hint: R`Pętla: while (true) { auto [w, k] = s.top(); if (g[w][k] == 'K') break; bool dalej = false; for (int d = 0; d < 4; d++) { … if (wolne i nieodwiedzone) { byl[a][b] = true; s.push({a, b}); dalej = true; break; } } if (!dalej) s.pop(); }. Potem vector<pair<int, int>> droga; zdejmuj ze stosu do vectora i reverse(droga.begin(), droga.end());.`,
            tests: (r) => {
                const lab = (h, w) => { const g = losLabirynt(r, h, w, 0); wstaw(r, g, 'S'); wstaw(r, g, 'K'); return g; };
                return [planszaTxt(['#####', '#S.K#', '#####']), planszaTxt(['###', '#S#', '#K#', '###']), planszaTxt(lab(3, 4)), planszaTxt(lab(10, 10)), planszaTxt(lab(100, 100)), planszaTxt(lab(100, 100)), planszaTxt(lab(1, 100)), planszaTxt(lab(100, 1)), planszaTxt(lab(40, 70))];
            },
            check: (inp) => {
                if (!dobraPlansza(inp, 201, '.#SK')) return 'dane';
                const { n, m, g } = czytajPlansze(inp); if (n < 3 || m < 3) return 'rozmiar';
                const s = znajdz(g, 'S'), k = znajdz(g, 'K'); if (s.length !== 1 || k.length !== 1) return 'S K';
                const ile = P.ileNajkrotszych(g, s[0], k[0]); if (ile.odl < 0) return 'brak drogi';
                // dokładnie jedna droga prosta: pola korytarza tworzą drzewo (krawędzi = pól − 1 w spójnej części)
                const kraw = [], pola = new Set();
                const d = P.bfsPlansza(g, [s[0]]);
                for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (d[i * m + j] >= 0) { pola.add(i * m + j); if (i + 1 < n && d[(i + 1) * m + j] >= 0) kraw.push(1); if (j + 1 < m && d[i * m + j + 1] >= 0) kraw.push(1); }
                return kraw.length === pola.size - 1 ? null : 'cykl';
            },
            solve: (inp) => {
                const { g } = czytajPlansze(inp); const n = g.length, m = g[0].length;
                const s = znajdz(g, 'S')[0], k = znajdz(g, 'K')[0];
                const skad = new Int32Array(n * m).fill(-1), q = [s[0] * m + s[1]]; skad[q[0]] = q[0];
                for (let h2 = 0; h2 < q.length; h2++) { const v = q[h2], w = Math.floor(v / m), c = v % m; for (const [dw, dk] of D4) { const a = w + dw, b = c + dk; if (a < 0 || a >= n || b < 0 || b >= m || g[a][b] === '#' || skad[a * m + b] >= 0) continue; skad[a * m + b] = v; q.push(a * m + b); } }
                const droga = []; let v = k[0] * m + k[1];
                while (v !== s[0] * m + s[1]) { const u = skad[v]; const dw = Math.floor(v / m) - Math.floor(u / m), dk = (v % m) - (u % m); droga.push(dw === -1 ? 'G' : dw === 1 ? 'D' : dk === -1 ? 'L' : 'P'); v = u; }
                return `${droga.length} ${droga.reverse().join('')}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
    char litera[4] = {'G', 'D', 'L', 'P'};
    int sw = 0, sk = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (g[i][j] == 'S') { sw = i; sk = j; }
    vector<vector<bool>> byl(n, vector<bool>(m, false));
    stack<pair<int, int>> s; // nić: droga od S do bieżącego pola
    s.push({sw, sk});
    byl[sw][sk] = true;
    while (true) {
        auto [w, k] = s.top();
        if (g[w][k] == 'K') break;
        bool dalej = false;
        for (int d = 0; d < 4; d++) {
            int a = w + dw[d], b = k + dk[d];
            if (a < 0 || a >= n || b < 0 || b >= m) continue;
            if (g[a][b] == '#' || byl[a][b]) continue;
            byl[a][b] = true;
            s.push({a, b});
            dalej = true;
            break;
        }
        if (!dalej) s.pop(); // ślepy zaułek — cofamy się
    }
    vector<pair<int, int>> droga;
    while (!s.empty()) {
        droga.push_back(s.top());
        s.pop();
    }
    reverse(droga.begin(), droga.end());
    string ruchy;
    for (int i = 1; i < (int)droga.size(); i++) {
        for (int d = 0; d < 4; d++) {
            if (droga[i].first - droga[i - 1].first == dw[d] && droga[i].second - droga[i - 1].second == dk[d]) ruchy += litera[d];
        }
    }
    cout << ruchy.size() << " " << ruchy << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-podwladni', krok: 7, level: 'trudne',
            title: 'Ilu masz podwładnych?',
            short: 'Rozmiar poddrzewa liczy się od liści w górę. Zapisz kolejność, w jakiej stos zdejmował pracowników, i przejdź ją od końca — dzieci zawsze są przed rodzicem.',
            tags: ['kolejność zdejmowania', 'przejście od końca', 'rozmiar poddrzewa'],
            statement: ['Firma ma n pracowników o numerach od 1 do n. Pracownik 1 to prezes, a każdy inny ma dokładnie jednego bezpośredniego szefa. Podwładnymi pracownika są jego bezpośredni podwładni, ich podwładni i tak dalej. Dla każdego pracownika policz, ilu ma podwładnych.',
                'Rekurencyjnie: liczba podwładnych to suma (1 + liczba podwładnych) po wszystkich bezpośrednich podwładnych. Bez rekurencji: przejdź drzewo stosem od prezesa i zapisuj w vectorze kolejność, w jakiej zdejmujesz pracowników. Każdy pracownik zostaje zdjęty wcześniej niż wszyscy jego podwładni — więc w odwróconej kolejności każdy podwładny pojawia się przed swoim szefem. Przejdź tę listę od końca i dla każdego pracownika v dodaj ile[v] + 1 do ile[szef[v]].'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n − 1 liczb: szefowie pracowników 2, 3, …, n (dla n = 1 ten wiersz jest pusty).'],
            output_format: ['Jeden wiersz: n liczb — ilu podwładnych ma każdy pracownik (od 1 do n).'],
            constraints: ['1 ≤ n ≤ 5000', 'Dane opisują drzewo z korzeniem 1 (szef może mieć większy numer niż podwładny).'],
            examples: [{ input: '6\n4 1 1 3 5', note: 'Pracownik 3 ma podwładnego 5, a ten — 6, więc 3 ma dwóch podwładnych. Prezes ma wszystkich pozostałych pięciu.' }],
            hint: R`vector<int> kolejnosc; stack<int> s; s.push(1); while (!s.empty()) { int v = s.top(); s.pop(); kolejnosc.push_back(v); for (int u : dzieci[v]) s.push(u); }. Potem for (int i = n - 1; i >= 1; i--) { int v = kolejnosc[i]; ile[szef[v]] += ile[v] + 1; }.`,
            tests: (r) => {
                const txt = (o) => `${o.length - 1}\n${o.slice(2).join(' ')}`;
                return ['1\n', txt([0, 0, 1]), txt([0, 0, 3, 1]), txt(losDrzewoOjcow(r, 10, 0.5)), txt(losDrzewoOjcow(r, 5000, 0.2)), txt(losDrzewoOjcow(r, 5000, 0.98)), txt(losDrzewoOjcow(r, 5000, 0)), txt(losDrzewoOjcow(r, 200, 0.7))];
            },
            check: (inp) => {
                const t = nums(inp); const n = t[0];
                if (!calk(n, 1, 5000) || t.length !== n) return 'dane';
                const ojc = [0, 0, ...t.slice(1)];
                for (let v = 2; v <= n; v++) if (!calk(ojc[v], 1, n) || ojc[v] === v) return 'szef';
                for (let v = 2; v <= n; v++) { let x = v, k = 0; while (x !== 1 && k <= n) { x = ojc[x]; k++; } if (x !== 1) return 'cykl'; }
                return null;
            },
            solve: (inp) => {
                const t = nums(inp); const n = t[0];
                const ojc = [0, 0, ...t.slice(1)];
                const dz = Array.from({ length: n + 1 }, () => []);
                for (let v = 2; v <= n; v++) dz[ojc[v]].push(v);
                const kol = [], st = [1];
                while (st.length) { const v = st.pop(); kol.push(v); for (const u of dz[v]) st.push(u); }
                const ile = new Array(n + 1).fill(0);
                for (let i = n - 1; i >= 1; i--) { const v = kol[i]; ile[ojc[v]] += ile[v] + 1; }
                return ile.slice(1).join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> szef(n + 1, 0);
    vector<vector<int>> dzieci(n + 1);
    for (int v = 2; v <= n; v++) {
        cin >> szef[v];
        dzieci[szef[v]].push_back(v);
    }
    vector<int> kolejnosc;
    stack<int> s;
    s.push(1);
    while (!s.empty()) {
        int v = s.top();
        s.pop();
        kolejnosc.push_back(v);
        for (int u : dzieci[v]) s.push(u);
    }
    vector<int> ile(n + 1, 0);
    for (int i = n - 1; i >= 1; i--) {
        int v = kolejnosc[i];
        ile[szef[v]] += ile[v] + 1;
    }
    for (int v = 1; v <= n; v++) cout << ile[v] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-zamkniete-jeziora', krok: 7, level: 'srednie',
            title: 'Zamknięte jeziora',
            short: 'Najpierw zalej stosem całe morze — wodę połączoną z brzegiem mapy. Woda, która została, to jeziora: policz je drugim zalewaniem.',
            tags: ['zalewanie od brzegu', 'dwa etapy', 'wiele startów naraz'],
            statement: ['Mapa to plansza n × m: kropka to woda, a # to ląd. Woda połączona bokami z brzegiem mapy to morze. Pozostała woda tworzy jeziora — jezioro to grupa pól wody połączonych bokami, do której morze nie dociera. Policz jeziora i ich łączną powierzchnię.',
                'Etap 1: połóż na stos wszystkie pola wody leżące na brzegu mapy (od razu je oznaczając) i zalewaj — to całe morze. Etap 2: każde nieoznaczone pole wody zaczyna nowe jezioro; zalej je, licząc pola.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków: kropka albo #.'],
            output_format: ['Jeden wiersz: liczba jezior i ich łączna powierzchnia.'],
            constraints: ['1 ≤ n, m ≤ 250'],
            examples: [{ input: '5 6\n######\n#..#.#\n####.#\n#.##..\n######', note: 'Dwa pola wody w drugim wierszu to jezioro, pojedyncze pole w czwartym wierszu też. Woda po prawej dotyka brzegu mapy — to morze.' }],
            hint: R`for (i, j) if (brzeg i woda) { byl[i][j] = true; s.push({i, j}); } — i jedno zalewanie dla całego morza. Potem drugie przejście jak przy liczeniu wysp: nowe nieoznaczone pole wody to nowe jezioro.`,
            tests: (r) => [planszaTxt(['.']), planszaTxt(['###', '#.#', '###']), planszaTxt(['#.#', '#.#', '###']), planszaTxt(losPlansza(r, 8, 10, 0.6)), planszaTxt(losPlansza(r, 250, 250, 0.6)), planszaTxt(losPlansza(r, 250, 250, 0.45)), planszaTxt(losPlansza(r, 250, 250, 0.75)), planszaTxt(Array.from({ length: 250 }, (_, i) => (i === 0 || i === 249 ? '#'.repeat(250) : '#' + '.'.repeat(248) + '#'))), planszaTxt(Array.from({ length: 250 }, (_, i) => Array.from({ length: 250 }, (_, j) => (i % 2 && j % 2 ? '.' : '#')).join('')))],
            check: (inp) => (dobraPlansza(inp, 250, '.#') ? null : 'dane'),
            solve: (inp) => {
                const { g } = czytajPlansze(inp); const n = g.length, m = g[0].length;
                const morze = P.bfsPlansza(g, (() => { const s = []; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if ((i === 0 || j === 0 || i === n - 1 || j === m - 1) && g[i][j] === '.') s.push([i, j]); return s; })(), (c) => c === '.');
                const w = kawalki(g, (c, i, j) => c === '.' && morze[i * m + j] < 0);
                return `${w.length} ${w.reduce((a, b) => a + b, 0)}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, m;
vector<string> g;
vector<vector<bool>> byl;
int dw[4] = {-1, 1, 0, 0}, dk[4] = {0, 0, -1, 1};
int zalej(stack<pair<int, int>> &s) {
    int ile = 0;
    while (!s.empty()) {
        auto [w, k] = s.top();
        s.pop();
        ile++;
        for (int d = 0; d < 4; d++) {
            int a = w + dw[d], b = k + dk[d];
            if (a < 0 || a >= n || b < 0 || b >= m) continue;
            if (g[a][b] != '.' || byl[a][b]) continue;
            byl[a][b] = true;
            s.push({a, b});
        }
    }
    return ile;
}
int main() {
    cin >> n >> m;
    g.assign(n, "");
    for (int i = 0; i < n; i++) cin >> g[i];
    byl.assign(n, vector<bool>(m, false));
    stack<pair<int, int>> s;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            bool brzeg = (i == 0 || j == 0 || i == n - 1 || j == m - 1);
            if (brzeg && g[i][j] == '.') {
                byl[i][j] = true;
                s.push({i, j});
            }
        }
    }
    zalej(s); // morze
    int jezior = 0, pole = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (g[i][j] != '.' || byl[i][j]) continue;
            jezior++;
            byl[i][j] = true;
            s.push({i, j});
            pole += zalej(s);
        }
    }
    cout << jezior << " " << pole << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · sztuczki olimpijskie
        {
            id: 'sto-asteroidy', krok: 8, level: 'srednie',
            title: 'Zderzenia asteroid',
            short: 'Asteroidy lecą w prawo (+) albo w lewo (−). Lecąca w lewo zderza się z tymi z wierzchu stosu, które lecą w prawo — mniejsza wybucha.',
            tags: ['stos w vectorze', 'pętla zderzeń', 'wypisanie od dna'],
            statement: ['W rzędzie leci n asteroid. Liczba dodatnia oznacza asteroidę lecącą w prawo, ujemna — w lewo, a wartość bezwzględna to jej wielkość. Wszystkie lecą z tą samą prędkością. Gdy dwie się zderzają, mniejsza wybucha, a przy równych wielkościach wybuchają obie. Asteroidy lecące w tym samym kierunku nigdy się nie spotkają. Wypisz asteroidy, które przetrwają, w kolejności od lewej.',
                'Przechodź asteroidy od lewej i trzymaj na stosie te, które na razie przetrwały. Asteroida lecąca w prawo po prostu trafia na stos. Asteroida lecąca w lewo zderza się z asteroidami z wierzchu stosu, dopóki te lecą w prawo: mniejsza z wierzchu wybucha (pop) i lecimy dalej, równa — wybuchają obie, większa — wybucha nadlatująca. Jeśli przetrwa, trafia na stos. Na końcu trzeba wypisać stos od dna, więc wygodnie trzymać go w vectorze (push_back, back, pop_back).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych różnych od zera.'],
            output_format: ['Jeden wiersz: asteroidy, które przetrwały, od lewej (albo pusto).'],
            constraints: ['1 ≤ n ≤ 3000', 'Liczby są z przedziału od −10⁶ do 10⁶ i nie są zerami.'],
            examples: [{ input: '6\n5 10 -5 3 -12 8', note: '-5 zderza się z 10 i wybucha. -12 niszczy 3, potem 10, potem 5 i leci dalej w lewo. 8 leci w prawo za nią — nigdy jej nie dogoni.' }, { input: '2\n7 -7', note: 'Równe wielkości — wybuchają obie.' }],
            hint: R`vector<int> s; for (każde x) { bool zyje = true; while (zyje && x < 0 && !s.empty() && s.back() > 0) { if (s.back() < -x) s.pop_back(); else if (s.back() == -x) { s.pop_back(); zyje = false; } else zyje = false; } if (zyje) s.push_back(x); }.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const los = (n, hi) => Array.from({ length: n }, () => (r() < 0.5 ? 1 : -1) * r.int(1, hi));
                return [d([3]), d([-3]), d([1, -1]), d([-2, -1, 1, 2]), d([1, 2, 3, -10]), d(los(20, 9)), d(los(3000, 1000000)), d(los(3000, 5)), d([...Array.from({ length: 1500 }, (_, i) => i + 1), ...Array.from({ length: 1500 }, () => -1000)]), d(Array.from({ length: 3000 }, (_, i) => (i % 2 ? -7 : 7)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => x !== 0 && calk(x, -1e6, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const st = [];
                for (const x of nums(inp).slice(1)) {
                    let zyje = true;
                    while (zyje && x < 0 && st.length && st[st.length - 1] > 0) { const t = st[st.length - 1]; if (t < -x) st.pop(); else if (t === -x) { st.pop(); zyje = false; } else zyje = false; }
                    if (zyje) st.push(x);
                }
                return st.length ? st.join(' ') : 'pusto';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> s; // stos w vectorze — na końcu wypiszemy go od dna
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        bool zyje = true;
        while (zyje && x < 0 && !s.empty() && s.back() > 0) {
            if (s.back() < -x) {
                s.pop_back();
            } else if (s.back() == -x) {
                s.pop_back();
                zyje = false;
            } else {
                zyje = false;
            }
        }
        if (zyje) s.push_back(x);
    }
    if (s.empty()) {
        cout << "pusto\n";
    } else {
        for (int x : s) cout << x << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-cd-i-pwd', krok: 8, level: 'srednie',
            title: 'Polecenia cd i pwd',
            short: 'Bieżący katalog to stos nazw od korzenia. Nazwa wchodzi na stos, .. go zdejmuje, a ścieżka od / zaczyna od pustego stosu.',
            tags: ['stos katalogów', 'dzielenie ścieżki po /', 'vector jako stos'],
            statement: ['Symulujesz terminal. Na początku jesteś w katalogu głównym /. Dostajesz q poleceń. pwd wypisuje bieżący katalog. cd ścieżka zmienia katalog: ścieżka składa się z nazw oddzielonych znakiem /, a nazwa .. oznacza katalog wyżej (w katalogu głównym .. nic nie zmienia). Ścieżka zaczynająca się od / jest bezwzględna — liczy się od katalogu głównego. Inna ścieżka jest względna — liczy się od bieżącego katalogu.',
                'Bieżący katalog to stos nazw: od katalogu głównego na dnie do bieżącego na wierzchu. Nazwa kładzie się na stos, a .. zdejmuje z niego wierzch. pwd musi wypisać stos od dna, więc trzymaj go w vector<string> (push_back, pop_back). Katalog główny wypisuj jako /, a inny — jako / przed każdą nazwą, np. /dom/kasia.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy polecenie pwd albo cd ścieżka.'],
            output_format: ['Po jednym wierszu dla każdego pwd.'],
            constraints: ['1 ≤ q ≤ 500', 'Ścieżka w poleceniu cd ma od 1 do 100 znaków, a bieżący katalog nigdy nie jest dłuższy niż 50 znaków. Nazwy to od 1 do 10 małych liter albo .., oddzielone pojedynczymi /. Ścieżka nie kończy się znakiem / (poza samą ścieżką /).'],
            examples: [{ input: '7\npwd\ncd dom/kasia/zdjecia\npwd\ncd ../../ola\npwd\ncd /etc\npwd', note: 'Ścieżka ../../ola: dwa razy w górę (do /dom) i do ola. /etc zaczyna od katalogu głównego.' }],
            hint: R`vector<string> st; Dla cd: if (droga[0] == '/') st.clear(); droga += '/'; string nazwa; for (char c : droga) { if (c == '/') { if (nazwa == "..") { if (!st.empty()) st.pop_back(); } else if (!nazwa.empty()) st.push_back(nazwa); nazwa = ""; } else nazwa += c; }.`,
            tests: (r) => {
                const nazwy = ['dom', 'kasia', 'ola', 'etc', 'usr', 'bin', 'gry', 'muzyka', 'zdjecia', 'szkola', 'projekt', 'a', 'b'];
                const sciezka = () => { const k = r.int(1, 6); const czesci = Array.from({ length: k }, () => (r() < 0.3 ? '..' : r.pick(nazwy))); return (r() < 0.3 ? '/' : '') + czesci.join('/'); };
                const gen = (q) => { const o = []; let st = []; for (let i = 0; i < q; i++) { if (r() < 0.4) { o.push('pwd'); continue; } let p = r() < 0.05 ? '/' : sciezka(); let nowy = p[0] === '/' ? [] : st.slice(); for (const c of p.split('/')) { if (c === '..') nowy.pop(); else if (c) nowy.push(c); } if (nowy.join('/').length + 1 > 50) { p = '/'; nowy = []; } st = nowy; o.push(`cd ${p}`); } return `${q}\n${o.join('\n')}`; };
                return ['1\npwd', '3\ncd ..\ncd ..\npwd', '4\ncd a/b/c\npwd\ncd /\npwd', '5\ncd a\ncd b\ncd ../c\ncd /x/y/../z\npwd', gen(20), gen(500), gen(300)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 500) || L.length !== q + 1) return 'q';
                let st = [];
                for (const l of L.slice(1)) {
                    if (l === 'pwd') continue;
                    const m = l.match(/^cd (.+)$/); if (!m) return 'polecenie';
                    const p = m[1]; if (p.length > 100) return 'dlugosc';
                    if (p === '/') { st = []; continue; }
                    const cz = (p[0] === '/' ? p.slice(1) : p).split('/');
                    if (!cz.every((c) => c === '..' || /^[a-z]{1,10}$/.test(c))) return 'nazwy';
                    if (p[0] === '/') st = [];
                    for (const c of cz) { if (c === '..') st.pop(); else st.push(c); }
                    if (st.join('/').length + 1 > 50) return 'za dlugi katalog';
                }
                return null;
            },
            solve: (inp) => {
                const st = [], o = [];
                for (const l of linie(inp).slice(1)) {
                    if (l === 'pwd') { o.push(st.length ? '/' + st.join('/') : '/'); continue; }
                    const p = l.slice(3);
                    if (p[0] === '/') st.length = 0;
                    for (const c of p.split('/')) { if (c === '..') st.pop(); else if (c) st.push(c); }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    vector<string> st; // katalogi od głównego (dno) do bieżącego (wierzch)
    while (q--) {
        string p;
        cin >> p;
        if (p == "pwd") {
            if (st.empty()) cout << "/";
            for (string k : st) cout << "/" << k;
            cout << "\n";
            continue;
        }
        string droga;
        cin >> droga;
        if (droga[0] == '/') st.clear();
        droga += '/';
        string nazwa;
        for (char c : droga) {
            if (c == '/') {
                if (nazwa == "..") {
                    if (!st.empty()) st.pop_back();
                } else if (!nazwa.empty()) {
                    st.push_back(nazwa);
                }
                nazwa = "";
            } else {
                nazwa += c;
            }
        }
    }
    return 0;
}`,
        },
        {
            id: 'sto-rozpakuj', krok: 8, level: 'srednie',
            title: 'Rozpakuj napis',
            short: 'k[tekst] to tekst powtórzony k razy, a nawiasy mogą być w nawiasach. Przy [ odkładasz na stos to, co już masz, i liczbę k; przy ] zdejmujesz i doklejasz powtórzenia.',
            tags: ['stos par (napis, k)', 'liczby wielocyfrowe', 'zagnieżdżenia'],
            statement: ['Napis jest zapisany w skrócie: k[tekst] oznacza tekst powtórzony k razy, a w środku nawiasów mogą stać kolejne skróty. Na przykład 3[ab] to ababab, a 2[a2[c]]d to accaccd. Rozpakuj napis.',
                'Przechodź skrót od lewej, trzymając bieżący (jeszcze nie zamknięty) tekst w zmiennej. Cyfry składają się na liczbę k. Przy [ odłóż na stos parę: dotychczasowy tekst i liczbę k — i zacznij zbierać nowy, pusty tekst. Przy ] zdejmij parę ze stosu: nowy bieżący tekst to tamten odłożony tekst z doklejonym k razy tekstem zebranym w nawiasie. Litera po prostu dokleja się do bieżącego tekstu.'],
            input_format: ['Jeden wiersz: skrót złożony z małych liter, cyfr i nawiasów [ ].'],
            output_format: ['Jeden wiersz: rozpakowany napis.'],
            constraints: ['Skrót ma od 1 do 2000 znaków i jest poprawny: przed każdym [ stoi liczba od 1 do 99 (bez zer na początku), a nawiasy są sparowane i nie są puste.', 'Rozpakowany napis ma od 1 do 20 000 liter.'],
            examples: [{ input: '2[a2[c]]d', note: 'W środku 2[c] to cc, więc a2[c] to acc. Dwa razy acc i na końcu d: accaccd.' }, { input: 'x10[y]z', note: 'Liczba może mieć dwie cyfry: x, dziesięć razy y i z.' }],
            hint: R`stack<pair<string, int>> st; string teraz; int k = 0; for (char c : s) { if (isdigit(c)) k = k * 10 + (c - '0'); else if (c == '[') { st.push({teraz, k}); teraz = ""; k = 0; } else if (c == ']') { auto [przed, ile] = st.top(); st.pop(); string w = przed; for (int i = 0; i < ile; i++) w += teraz; teraz = w; } else teraz += c; }.`,
            tests: (r) => {
                // kawałek skrótu: [skrót, długość po rozpakowaniu]
                const kawalek = (gl, maxGl) => {
                    if (gl >= maxGl || r() < 0.45) { const w = r.word(r.int(1, 4), 'abcdefgh'); return [w, w.length]; }
                    const k = r.int(1, gl ? 9 : 30);
                    let e = '', d = 0;
                    const ile = r.int(1, 3);
                    for (let i = 0; i < ile; i++) { const [e2, d2] = kawalek(gl + 1, maxGl); e += e2; d += d2; }
                    return [`${k}[${e}]`, k * d];
                };
                // sklejone kawałki, dopóki skrót ≤ maxE znaków i rozpakowany napis ≤ maxD liter
                const duzy = (maxE, maxD, maxGl) => {
                    let e = '', d = 0;
                    for (let p = 0; p < 20000 && e.length < maxE * 0.9; p++) {
                        const [e2, d2] = kawalek(0, maxGl);
                        if (e.length + e2.length > maxE || d + d2 > maxD) continue;
                        e += e2; d += d2;
                    }
                    return e || 'a';
                };
                return ['a', '3[ab]', '2[a2[c]]d', '1[1[1[x]]]', 'x10[y]z', '99[99[a]]', '2[3[4[5[q]]]]', duzy(40, 200, 3), duzy(2000, 20000, 3), duzy(2000, 20000, 6), duzy(600, 20000, 8), '10[ab2[cd]]e3[f]', '4[' + 'abcdefghij'.repeat(50) + ']'];
            },
            check: (inp) => {
                if (inp.length > 2000 || !/^[a-z0-9[\]]+$/.test(inp)) return 'znaki';
                if (/(^|[^0-9])0/.test(inp) || /\d\d\d/.test(inp) || /\d(?!\d|\[)/.test(inp) || /[^0-9]\[|^\[/.test(inp) || /\[\]/.test(inp)) return 'liczby';
                let g = 0; for (const c of inp) { if (c === '[') g++; else if (c === ']') { g--; if (g < 0) return 'nawiasy'; } } if (g) return 'nawiasy';
                const st = []; let teraz = 0, k = 0;
                for (const c of inp) { if (c >= '0' && c <= '9') k = k * 10 + Number(c); else if (c === '[') { st.push([teraz, k]); teraz = 0; k = 0; } else if (c === ']') { const [p, ile] = st.pop(); teraz = p + ile * teraz; if (teraz > 20000) return 'za dlugi'; } else teraz++; }
                return teraz >= 1 && teraz <= 20000 ? null : 'dlugosc';
            },
            solve: (inp) => {
                const st = []; let teraz = '', k = 0;
                for (const c of inp) { if (c >= '0' && c <= '9') k = k * 10 + Number(c); else if (c === '[') { st.push([teraz, k]); teraz = ''; k = 0; } else if (c === ']') { const [p, ile] = st.pop(); teraz = p + teraz.repeat(ile); } else teraz += c; }
                return teraz;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    stack<pair<string, int>> st; // (tekst sprzed nawiasu, ile razy powtórzyć nawias)
    string teraz;
    int k = 0;
    for (char c : s) {
        if (isdigit(c)) {
            k = k * 10 + (c - '0');
        } else if (c == '[') {
            st.push({teraz, k});
            teraz = "";
            k = 0;
        } else if (c == ']') {
            auto [przed, ile] = st.top();
            st.pop();
            string w = przed;
            for (int i = 0; i < ile; i++) w += teraz;
            teraz = w;
        } else {
            teraz += c;
        }
    }
    cout << teraz << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-usun-k-cyfr', krok: 8, level: 'srednie',
            title: 'Usuń k cyfr',
            short: 'Żeby liczba była jak najmniejsza, większa cyfra przed mniejszą musi zniknąć. Stos cyfr rośnie od dna, a nadmiarowe cyfry zdejmujesz z wierzchu.',
            tags: ['stos monotoniczny', 'zachłanne usuwanie', 'zera na początku'],
            statement: ['Z liczby trzeba usunąć dokładnie k cyfr (pozostałe zostają w tej samej kolejności), żeby powstała jak najmniejsza liczba. Wypisz ją bez zer na początku (jeśli zostały same zera, wypisz 0).',
                'Zachłanna zasada: jeśli jakaś cyfra jest większa od cyfry stojącej tuż za nią, opłaca się ją usunąć — zmniejsza to liczbę na najwcześniejszej możliwej pozycji. Przechodź cyfry od lewej i trzymaj stos cyfr (wygodnie: string). Dopóki możesz jeszcze usuwać, a cyfra na wierzchu jest większa od bieżącej — zdejmij ją. Potem połóż bieżącą cyfrę. Jeśli na końcu zostały jeszcze usunięcia, zdejmij tyle cyfr z wierzchu (cyfry na stosie rosną, więc największe są na górze).'],
            input_format: ['Jeden wiersz: liczba (bez zer na początku) i liczba k.'],
            output_format: ['Jedna liczba — najmniejsza możliwa po usunięciu k cyfr.'],
            constraints: ['Liczba ma od 1 do 20 000 cyfr.', '0 ≤ k < liczba cyfr'],
            examples: [{ input: '1432219 3', note: 'Usuwamy 4, 3 i drugą 2: zostaje 1219.' }, { input: '10200 1', note: 'Po usunięciu jedynki zostaje 0200 — zera z przodu nie wypisujemy: 200.' }],
            hint: R`string st; for (char c : s) { while (k > 0 && !st.empty() && st.back() > c) { st.pop_back(); k--; } st.push_back(c); } while (k > 0) { st.pop_back(); k--; }. Zera z przodu: int i = 0; while (i + 1 < (int)st.size() && st[i] == '0') i++; cout << st.substr(i);.`,
            tests: (r) => {
                const liczba = (n, alf) => { let s = r.pick('123456789'.split('')); for (let i = 1; i < n; i++) s += r.pick(alf.split('')); return s; };
                return ['5 0', '10 1', '1432219 3', '10200 1', '9 0', '112 1', '123456789 4', '987654321 4', '100000 1', `${liczba(20000, '0123456789')} 10000`, `${liczba(20000, '0123456789')} 5`, `${liczba(20000, '09')} 19000`, `${'9'.repeat(10000) + '1'.repeat(10000)} 10000`, `${liczba(30, '0123')} 7`, `${'1' + '0'.repeat(19999)} 1`];
            },
            check: (inp) => { const [s, k] = toks(inp); return /^([1-9]\d{0,19999}|0)$/.test(s) && calk(Number(k), 0, s.length - 1) && toks(inp).length === 2 ? null : 'dane'; },
            solve: (inp) => {
                const [s, ks] = toks(inp); let k = Number(ks); const st = [];
                for (const c of s) { while (k > 0 && st.length && st[st.length - 1] > c) { st.pop(); k--; } st.push(c); }
                while (k > 0) { st.pop(); k--; }
                let i = 0; while (i + 1 < st.length && st[i] === '0') i++;
                return st.slice(i).join('');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int k;
    cin >> s >> k;
    string st; // stos cyfr
    for (char c : s) {
        while (k > 0 && !st.empty() && st.back() > c) {
            st.pop_back();
            k--;
        }
        st.push_back(c);
    }
    while (k > 0) {
        st.pop_back();
        k--;
    }
    int i = 0;
    while (i + 1 < (int)st.size() && st[i] == '0') i++;
    cout << st.substr(i) << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-tory-przetokowe', krok: 8, level: 'srednie',
            title: 'Tory przetokowe',
            short: 'Wagony 1, 2, …, n wjeżdżają na ślepy tor i wyjeżdżają z niego w odwrotnej kolejności. Czy da się dostać zamówioną kolejność? Symuluj: wpychaj, aż na wierzchu stanie potrzebny wagon.',
            tags: ['symulacja bocznicy', 'stos wagonów', 'TAK / NIE'],
            statement: ['Na stację wjeżdża pociąg z wagonami ponumerowanymi 1, 2, …, n (w tej kolejności). Przed wyjazdem wagony można przestawić tylko w jeden sposób: każdy wagon wjeżdża na ślepy tor (bocznicę), a z bocznicy zawsze może wyjechać wagon, który wjechał tam ostatnio. Wagony wyjeżdżające z bocznicy tworzą nowy pociąg. Dla t zamówionych kolejności sprawdź, czy da się je w ten sposób uzyskać.',
                'Bocznica to stos. Symuluj: dla każdego kolejnego wagonu x z zamówienia wpychaj na stos kolejne wagony z wejścia, dopóki na wierzchu nie stoi x (albo wagony się skończą). Jeśli na wierzchu jest x — wyjeżdża (pop). Jeśli nie, a wszystkie wagony już wjechały, to x jest zakopany pod innymi wagonami i zamówienia nie da się spełnić.'],
            input_format: ['W pierwszym wierszu liczba t.', 'Każde zamówienie to wiersz z liczbą n i wiersz z n różnymi liczbami od 1 do n — kolejność wagonów w nowym pociągu.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 50', '1 ≤ n ≤ 1000, a suma wszystkich n nie przekracza 15 000.'],
            examples: [{ input: '3\n5\n3 2 1 4 5\n5\n3 1 2 4 5\n3\n1 2 3', note: 'W drugim zamówieniu po wyjeździe trójki na wierzchu stoi 2, a 1 jest pod nią — nie da się wypuścić jedynki przed dwójką.' }],
            hint: R`int nastepny = 1; bool ok = true; for (int x : cel) { while (nastepny <= n && (boczny.empty() || boczny.top() != x)) { boczny.push(nastepny); nastepny++; } if (!boczny.empty() && boczny.top() == x) boczny.pop(); else { ok = false; break; } }.`,
            tests: (r) => {
                const dobra = (n) => { const o = []; const st = []; let nx = 1; while (o.length < n) { if (nx <= n && (!st.length || r() < 0.5)) st.push(nx++); else o.push(st.pop()); } return o; };
                const los = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
                const prawie = (n) => { const a = dobra(n); const i = r.int(0, n - 2); [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a; };
                const d = (ps) => `${ps.length}\n${ps.map((p) => `${p.length}\n${p.join(' ')}`).join('\n')}`;
                return [d([[1]]), d([[1, 2], [2, 1]]), d([[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]), d(Array.from({ length: 20 }, () => (r() < 0.5 ? dobra(r.int(2, 9)) : los(r.int(2, 9))))), d(Array.from({ length: 15 }, (_, i) => (i % 3 === 0 ? dobra(1000) : i % 3 === 1 ? prawie(1000) : los(1000)))), d([Array.from({ length: 1000 }, (_, i) => 1000 - i), Array.from({ length: 1000 }, (_, i) => i + 1)])];
            },
            check: (inp) => {
                const t = nums(inp); const T = t[0]; if (!calk(T, 1, 50)) return 't';
                let i = 1, suma = 0;
                for (let k = 0; k < T; k++) { const n = t[i++]; if (!calk(n, 1, 1000)) return 'n'; suma += n; const p = t.slice(i, i + n); i += n; if (p.length !== n || new Set(p).size !== n || !p.every((x) => calk(x, 1, n))) return 'permutacja'; }
                return i === t.length && suma <= 15000 ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp); let i = 1; const o = [];
                for (let k = 0; k < t[0]; k++) {
                    const n = t[i++], p = t.slice(i, i + n); i += n;
                    const st = []; let nx = 1, ok = true;
                    for (const x of p) { while (nx <= n && (!st.length || st[st.length - 1] !== x)) st.push(nx++); if (st.length && st[st.length - 1] === x) st.pop(); else { ok = false; break; } }
                    o.push(ok ? 'TAK' : 'NIE');
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        vector<int> cel(n);
        for (int i = 0; i < n; i++) cin >> cel[i];
        stack<int> boczny;
        int nastepny = 1;
        bool ok = true;
        for (int x : cel) {
            while (nastepny <= n && (boczny.empty() || boczny.top() != x)) {
                boczny.push(nastepny);
                nastepny++;
            }
            if (!boczny.empty() && boczny.top() == x) {
                boczny.pop();
            } else {
                ok = false;
                break;
            }
        }
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-kolejka-z-dwoch-stosow', krok: 8, level: 'srednie',
            title: 'Kolejka z dwóch stosów',
            short: 'Nowi wchodzą na stos „we”. Gdy trzeba kogoś obsłużyć, a stos „wy” jest pusty, przelej do niego cały „we” — kolejność się odwraca i najstarszy jest na wierzchu.',
            tags: ['dwa stosy = kolejka', 'przelewanie tylko gdy pusto', 'każdy przelany raz'],
            statement: ['Masz do dyspozycji tylko stosy, a potrzebujesz kolejki. Obsłuż q poleceń: DODAJ x stawia x na końcu kolejki, USUN wypisuje i usuwa pierwszy element kolejki, a PIERWSZY wypisuje pierwszy element bez usuwania. Gdy kolejka jest pusta, USUN i PIERWSZY wypisują pusta.',
                'Użyj dwóch stosów: we i wy. DODAJ kładzie x na we. Gdy trzeba sięgnąć do początku kolejki, a stos wy jest pusty, przelej do niego wszystko ze stosu we (zdejmuj z jednego, kładź na drugi). Przelanie odwraca kolejność, więc najstarszy element ląduje na wierzchu wy. Ważne: przelewaj tylko wtedy, gdy wy jest pusty — inaczej pomieszasz kolejność. Każdy element zostanie przelany co najwyżej raz, więc wszystko działa szybko.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy polecenie: DODAJ x, USUN albo PIERWSZY.'],
            output_format: ['Po jednym wierszu dla każdego USUN i PIERWSZY.'],
            constraints: ['1 ≤ q ≤ 3000', 'Liczby x są z przedziału od −10⁶ do 10⁶.'],
            examples: [{ input: '7\nDODAJ 1\nDODAJ 2\nPIERWSZY\nDODAJ 3\nUSUN\nUSUN\nUSUN', note: 'Przy PIERWSZY stos we (1, 2) przelewa się do wy — na wierzchu wy jest 1. Trójka czeka na stosie we, aż wy się opróżni.' }],
            hint: R`void przelej(stack<int> &we, stack<int> &wy) { if (wy.empty()) while (!we.empty()) { wy.push(we.top()); we.pop(); } }. USUN i PIERWSZY: przelej(we, wy); if (wy.empty()) cout << "pusta\n"; else { cout << wy.top() << "\n"; if (USUN) wy.pop(); }.`,
            tests: (r) => {
                const gen = (q, pd) => { const o = []; for (let i = 0; i < q; i++) { const p = r(); o.push(p < pd ? `DODAJ ${r.int(-1000000, 1000000)}` : p < pd + (1 - pd) * 0.6 ? 'USUN' : 'PIERWSZY'); } return `${q}\n${o.join('\n')}`; };
                return ['1\nUSUN', '2\nDODAJ 5\nPIERWSZY', '5\nDODAJ 1\nUSUN\nUSUN\nDODAJ 2\nPIERWSZY', gen(30, 0.5), gen(3000, 0.5), gen(3000, 0.7), gen(3000, 0.3)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => l === 'USUN' || l === 'PIERWSZY' || (/^DODAJ -?\d+$/.test(l) && calk(Number(l.slice(6)), -1e6, 1e6))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const q = new P.Kolejka(), o = [];
                for (const l of linie(inp).slice(1)) {
                    if (l.startsWith('DODAJ')) q.push(Number(l.slice(6)));
                    else if (q.empty()) o.push('pusta');
                    else o.push(String(l === 'USUN' ? q.pop() : q.front()));
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void przelej(stack<int> &we, stack<int> &wy) {
    if (!wy.empty()) return;
    while (!we.empty()) {
        wy.push(we.top());
        we.pop();
    }
}
int main() {
    int q;
    cin >> q;
    stack<int> we, wy;
    while (q--) {
        string p;
        cin >> p;
        if (p == "DODAJ") {
            int x;
            cin >> x;
            we.push(x);
            continue;
        }
        przelej(we, wy);
        if (wy.empty()) {
            cout << "pusta\n";
            continue;
        }
        cout << wy.top() << "\n";
        if (p == "USUN") wy.pop();
    }
    return 0;
}`,
        },
        {
            id: 'sto-kolejka-z-minimum', krok: 8, level: 'trudne',
            title: 'Kolejka z minimum',
            short: 'Połącz dwie sztuczki: kolejkę z dwóch stosów i stos z minimum. Najmniejszy element kolejki to mniejsze z minimów obu stosów.',
            tags: ['dwa stosy par', 'minimum na każdym stosie', 'przelewanie od nowa liczy minima'],
            statement: ['Obsłuż q poleceń na kolejce liczb: DODAJ x stawia x na końcu, USUN usuwa pierwszy element (i niczego nie wypisuje), a MIN wypisuje najmniejszą liczbę w kolejce. Gdy kolejka jest pusta, USUN i MIN wypisują pusta.',
                'Zbuduj kolejkę z dwóch stosów (jak w poprzednim zadaniu), ale na każdym stosie trzymaj pary: liczbę i minimum od dna stosu do niej (jak w zadaniu „Stos z minimum”). Najmniejsza liczba w kolejce to mniejsze z minimów zapisanych na wierzchach obu stosów (o ile stos nie jest pusty). Przy przelewaniu liczby trafiają na drugi stos na nowo — minima trzeba wtedy policzyć od początku. To jeden ze sposobów na minimum w przesuwanym oknie, który z lekcji o kolejce znasz w wersji z deque.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy polecenie: DODAJ x, USUN albo MIN.'],
            output_format: ['Po jednym wierszu dla każdego MIN i dla każdego USUN na pustej kolejce.'],
            constraints: ['1 ≤ q ≤ 3000', 'Liczby x są z przedziału od −10⁶ do 10⁶.'],
            examples: [{ input: '8\nDODAJ 4\nDODAJ 2\nDODAJ 7\nMIN\nUSUN\nUSUN\nMIN\nUSUN', note: 'Najpierw minimum to 2. Po usunięciu 4 i 2 w kolejce zostaje tylko 7.' }],
            hint: R`void wloz(stack<pair<int, int>> &s, int x) { int m = s.empty() ? x : min(x, s.top().second); s.push({x, m}); }. Przelewanie: while (!we.empty()) { wloz(wy, we.top().first); we.pop(); }. MIN: minimum z we.top().second i wy.top().second (tylko z niepustych).`,
            tests: (r) => {
                const gen = (q, pd, lo, hi) => { const o = []; for (let i = 0; i < q; i++) { const p = r(); o.push(p < pd ? `DODAJ ${r.int(lo, hi)}` : p < pd + (1 - pd) * 0.5 ? 'USUN' : 'MIN'); } return `${q}\n${o.join('\n')}`; };
                const rosnace = `3000\n${[...Array.from({ length: 1500 }, (_, i) => `DODAJ ${i}`), ...Array.from({ length: 1500 }, (_, i) => (i % 2 ? 'USUN' : 'MIN'))].join('\n')}`;
                return ['1\nMIN', '2\nUSUN\nMIN', '4\nDODAJ 3\nDODAJ 3\nUSUN\nMIN', gen(40, 0.5, -9, 9), gen(3000, 0.5, -1000000, 1000000), gen(3000, 0.6, 1, 50), rosnace];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => l === 'USUN' || l === 'MIN' || (/^DODAJ -?\d+$/.test(l) && calk(Number(l.slice(6)), -1e6, 1e6))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const q = new P.Kolejka(), o = [];
                for (const l of linie(inp).slice(1)) {
                    if (l.startsWith('DODAJ')) q.push(Number(l.slice(6)));
                    else if (q.empty()) o.push('pusta');
                    else if (l === 'USUN') q.pop();
                    else o.push(String(Math.min(...q.toArray())));
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wloz(stack<pair<int, int>> &s, int x) {
    int m = s.empty() ? x : min(x, s.top().second);
    s.push({x, m});
}
int main() {
    int q;
    cin >> q;
    stack<pair<int, int>> we, wy; // (liczba, minimum od dna stosu do niej)
    while (q--) {
        string p;
        cin >> p;
        if (p == "DODAJ") {
            int x;
            cin >> x;
            wloz(we, x);
            continue;
        }
        if (we.empty() && wy.empty()) {
            cout << "pusta\n";
            continue;
        }
        if (p == "USUN") {
            if (wy.empty()) {
                while (!we.empty()) {
                    wloz(wy, we.top().first);
                    we.pop();
                }
            }
            wy.pop();
        } else {
            int m;
            if (we.empty()) m = wy.top().second;
            else if (wy.empty()) m = we.top().second;
            else m = min(we.top().second, wy.top().second);
            cout << m << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'sto-stos-z-dodawaniem', krok: 8, level: 'trudne',
            title: 'Stos z dodawaniem do dna',
            short: 'INC k v dodaje v do k najniższych elementów. Zamiast dodawać po kolei, zapisz dodatek przy k-tym elemencie i przekazuj go w dół dopiero przy zdejmowaniu.',
            tags: ['leniwe dodawanie', 'vector jako stos', 'long long'],
            statement: ['Obsłuż q poleceń na stosie liczb: PUSH x kładzie x na wierzch, POP zdejmuje liczbę z wierzchu i ją wypisuje (na pustym stosie wypisuje pusty), a INC k v dodaje v do każdej z k najniższych liczb na stosie (jeśli liczb jest mniej niż k — do wszystkich).',
                'Dodawanie po kolei do k liczb byłoby wolne, a w stack<int> do dolnych liczb w ogóle się nie dostaniesz. Sztuczka: trzymaj stos w dwóch vectorach — wartosc[i] i dodatek[i] (i liczone od dna). INC k v dodaje v tylko do dodatek[min(k, rozmiar) − 1]: ten dodatek należy się temu elementowi i wszystkim pod nim. Przy POP element i ma wartość wartosc[i] + dodatek[i], a swój dodatek przekazuje w dół: dodatek[i − 1] += dodatek[i]. Każde polecenie to wtedy jeden krok.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy polecenie: PUSH x, POP albo INC k v.'],
            output_format: ['Po jednym wierszu dla każdego POP.'],
            constraints: ['1 ≤ q ≤ 2000', '−10⁶ ≤ x, v ≤ 10⁶', '1 ≤ k ≤ 10⁴'],
            examples: [{ input: '8\nPUSH 1\nPUSH 2\nPUSH 3\nINC 2 10\nPOP\nPOP\nINC 5 100\nPOP', note: 'INC 2 10 zmienia dwie najniższe liczby: 1 → 11 i 2 → 12, a 3 zostaje. Potem w stosie jest tylko 11, a INC 5 100 dodaje 100 do niej.' }],
            hint: R`vector<long long> wartosc, dodatek;. PUSH: wartosc.push_back(x); dodatek.push_back(0);. INC: int i = min(k, (int)wartosc.size()) - 1; if (i >= 0) dodatek[i] += v;. POP: int i = wartosc.size() - 1; cout << wartosc[i] + dodatek[i]; if (i > 0) dodatek[i - 1] += dodatek[i]; i dwa pop_back.`,
            tests: (r) => {
                const gen = (q, pp, kmax) => { const o = []; for (let i = 0; i < q; i++) { const p = r(); o.push(p < pp ? `PUSH ${r.int(-1000000, 1000000)}` : p < pp + (1 - pp) * 0.5 ? 'POP' : `INC ${r.int(1, kmax)} ${r.int(-1000000, 1000000)}`); } return `${q}\n${o.join('\n')}`; };
                return ['1\nPOP', '2\nINC 3 5\nPOP', '4\nPUSH 1\nINC 1 1\nINC 1 1\nPOP', gen(30, 0.5, 5), gen(2000, 0.5, 10000), gen(2000, 0.45, 50), gen(2000, 0.6, 1000)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 2000) || L.length !== q + 1) return 'q';
                return L.slice(1).every((l) => { if (l === 'POP') return true; let m = l.match(/^PUSH (-?\d+)$/); if (m) return calk(Number(m[1]), -1e6, 1e6); m = l.match(/^INC (\d+) (-?\d+)$/); return !!m && calk(Number(m[1]), 1, 1e4) && calk(Number(m[2]), -1e6, 1e6); }) ? null : 'polecenie';
            },
            solve: (inp) => {
                const st = [], o = [];
                for (const l of linie(inp).slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'PUSH') st.push(BigInt(t[1]));
                    else if (t[0] === 'POP') o.push(st.length ? String(st.pop()) : 'pusty');
                    else { const k = Math.min(Number(t[1]), st.length); for (let i = 0; i < k; i++) st[i] += BigInt(t[2]); }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    vector<long long> wartosc, dodatek; // indeks 0 to dno stosu
    while (q--) {
        string p;
        cin >> p;
        if (p == "PUSH") {
            long long x;
            cin >> x;
            wartosc.push_back(x);
            dodatek.push_back(0);
        } else if (p == "POP") {
            if (wartosc.empty()) {
                cout << "pusty\n";
                continue;
            }
            int i = wartosc.size() - 1;
            cout << wartosc[i] + dodatek[i] << "\n";
            if (i > 0) dodatek[i - 1] += dodatek[i];
            wartosc.pop_back();
            dodatek.pop_back();
        } else {
            int k;
            long long v;
            cin >> k >> v;
            int i = min(k, (int)wartosc.size()) - 1;
            if (i >= 0) dodatek[i] += v;
        }
    }
    return 0;
}`,
        },
    ];
};
