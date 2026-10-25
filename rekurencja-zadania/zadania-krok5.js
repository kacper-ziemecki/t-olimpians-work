// Krok 5 · Backtracking — szukanie z wycofywaniem.
module.exports = (h) => {
    const { reader } = h;

    // ---- hetmany
    const queens = (n, firstOnly) => {
        const col = Array(n).fill(-1);
        let count = 0, first = null;
        const ok = (r, c) => { for (let i = 0; i < r; i++) if (col[i] === c || Math.abs(col[i] - c) === r - i) return false; return true; };
        const go = (r) => {
            if (firstOnly && first) return;
            if (r === n) { count++; if (!first) first = col.slice(); return; }
            for (let c = 0; c < n; c++) if (ok(r, c)) { col[r] = c; go(r + 1); col[r] = -1; }
        };
        go(0);
        return { count, first };
    };

    // ---- labirynt: liczba ścieżek prostych i liczba wywołań
    const mazeCount = (g) => {
        const n = g.length, m = g[0].length;
        const vis = g.map((r) => r.split('').map(() => false));
        let cnt = 0, calls = 0;
        const go = (i, j) => {
            calls++;
            if (i < 0 || j < 0 || i >= n || j >= m || g[i][j] === '#' || vis[i][j]) return;
            if (i === n - 1 && j === m - 1) { cnt++; return; }
            vis[i][j] = true;
            go(i + 1, j); go(i - 1, j); go(i, j + 1); go(i, j - 1);
            vis[i][j] = false;
        };
        go(0, 0);
        return { cnt, calls };
    };

    // ---- szczur: wszystkie ścieżki D L R U
    const ratPaths = (g) => {
        const n = g.length;
        const vis = g.map((r) => r.map(() => false));
        const out = [];
        const dirs = [['D', 1, 0], ['L', 0, -1], ['R', 0, 1], ['U', -1, 0]];
        const go = (i, j, path) => {
            if (i === n - 1 && j === n - 1) { out.push(path); return; }
            vis[i][j] = true;
            for (const [c, di, dj] of dirs) {
                const a = i + di, b = j + dj;
                if (a >= 0 && b >= 0 && a < n && b < n && g[a][b] === 1 && !vis[a][b]) go(a, b, path + c);
            }
            vis[i][j] = false;
        };
        if (g[0][0] === 1 && g[n - 1][n - 1] === 1) go(0, 0, '');
        return out;
    };

    // ---- sudoku
    const sudokuSolve = (grid, limit = 2) => {
        // grid: tablica 81 liczb (0 = puste); zwraca { solutions, first } — solver z heurystyką MRV
        const g = grid.slice();
        let sols = 0, first = null;
        const cand = (p) => { const r = Math.floor(p / 9), c = p % 9, used = new Set(); for (let k = 0; k < 9; k++) { used.add(g[r * 9 + k]); used.add(g[k * 9 + c]); } const br = r - (r % 3), bc = c - (c % 3); for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) used.add(g[(br + a) * 9 + bc + b]); const o = []; for (let d = 1; d <= 9; d++) if (!used.has(d)) o.push(d); return o; };
        const go = () => {
            if (sols >= limit) return;
            let best = -1, bc = null;
            for (let p = 0; p < 81; p++) if (!g[p]) { const c = cand(p); if (!bc || c.length < bc.length) { best = p; bc = c; if (!c.length) break; } }
            if (best === -1) { sols++; if (!first) first = g.slice(); return; }
            for (const d of bc) { g[best] = d; go(); g[best] = 0; }
        };
        go();
        return { solutions: sols, first };
    };
    const sudokuNaiveCalls = (grid) => {
        const g = grid.slice();
        let calls = 0;
        const ok = (p, d) => { const r = Math.floor(p / 9), c = p % 9; for (let k = 0; k < 9; k++) if (g[r * 9 + k] === d || g[k * 9 + c] === d) return false; const br = r - (r % 3), bc = c - (c % 3); for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) if (g[(br + a) * 9 + bc + b] === d) return false; return true; };
        const go = (p) => { calls++; if (calls > 5e6) return true; if (p === 81) return true; if (g[p]) return go(p + 1); for (let d = 1; d <= 9; d++) if (ok(p, d)) { g[p] = d; if (go(p + 1)) return true; g[p] = 0; } return false; };
        go(0);
        return calls;
    };
    const makeSudoku = (r, givens) => {
        for (;;) {
            const g = Array(81).fill(0);
            // losowa pełna plansza
            const fill = (p) => { if (p === 81) return true; const r0 = Math.floor(p / 9), c0 = p % 9; for (const d of r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9])) { let ok = true; for (let k = 0; k < 9 && ok; k++) if (g[r0 * 9 + k] === d || g[k * 9 + c0] === d) ok = false; const br = r0 - (r0 % 3), bc = c0 - (c0 % 3); for (let a = 0; a < 3 && ok; a++) for (let b = 0; b < 3 && ok; b++) if (g[(br + a) * 9 + bc + b] === d) ok = false; if (ok) { g[p] = d; if (fill(p + 1)) return true; g[p] = 0; } } return false; };
            fill(0);
            const puzzle = g.slice();
            let filled = 81;
            for (const p of r.shuffle(Array.from({ length: 81 }, (_, i) => i))) {
                if (filled <= givens) break;
                const keep = puzzle[p];
                puzzle[p] = 0;
                if (sudokuSolve(puzzle, 2).solutions !== 1) puzzle[p] = keep; else filled--;
            }
            if (filled === givens && sudokuNaiveCalls(puzzle) < 2e6) return puzzle;
        }
    };
    const sudokuStr = (g) => Array.from({ length: 9 }, (_, i) => g.slice(i * 9, i * 9 + 9).map((d) => (d ? String(d) : '.')).join('')).join('\n');

    // ---- kolorowanie
    const colorings = (n, edges, k) => {
        const adj = Array.from({ length: n + 1 }, () => []);
        for (const [u, v] of edges) { adj[u].push(v); adj[v].push(u); }
        const col = Array(n + 1).fill(0);
        let cnt = 0;
        const go = (v) => { if (v > n) { cnt++; return; } for (let c = 1; c <= k; c++) { if (adj[v].some((u) => col[u] === c)) continue; col[v] = c; go(v + 1); col[v] = 0; } };
        go(1);
        return cnt;
    };

    // ---- palindromy
    const palParts = (s) => {
        const out = [];
        const cur = [];
        const isPal = (a, b) => { while (a < b) if (s[a++] !== s[b--]) return false; return true; };
        const go = (i) => { if (i === s.length) { out.push(cur.join(' ')); return; } for (let j = i; j < s.length; j++) if (isPal(i, j)) { cur.push(s.slice(i, j + 1)); go(j + 1); cur.pop(); } };
        go(0);
        return out;
    };

    // ---- liczby o sumie cyfr
    const digitNums = (n, s) => {
        const out = [];
        const go = (i, sum, cur) => { if (sum > s) return; if (i === n) { if (sum === s) out.push(cur); return; } for (let d = i === 0 ? 1 : 0; d <= 9; d++) go(i + 1, sum + d, cur + d); };
        go(0, 0, '');
        return out;
    };

    // ---- wykreślanka
    const wordIn = (g, w) => {
        const R = g.length, C = g[0].length;
        const vis = g.map((r) => r.split('').map(() => false));
        const go = (i, j, k) => {
            if (i < 0 || j < 0 || i >= R || j >= C || vis[i][j] || g[i][j] !== w[k]) return false;
            if (k === w.length - 1) return true;
            vis[i][j] = true;
            const ok = go(i + 1, j, k + 1) || go(i - 1, j, k + 1) || go(i, j + 1, k + 1) || go(i, j - 1, k + 1);
            vis[i][j] = false;
            return ok;
        };
        for (let i = 0; i < R; i++) for (let j = 0; j < C; j++) if (go(i, j, 0)) return true;
        return false;
    };

    return [
        // ------------------------------------------------------------ 1
        {
            id: 'rek-hetmany',
            title: 'Hetmany — ile ustawień?',
            level: 'srednie',
            statement: [
                'Hetman (królowa) w szachach bije każde pole w swoim wierszu, w swojej kolumnie i na obu swoich przekątnych. Na ile sposobów można ustawić n hetmanów na szachownicy n × n tak, żeby żadne dwa się nie biły?',
                'Backtracking: w każdym wierszu musi stać dokładnie jeden hetman. Funkcja ustaw(w) próbuje postawić hetmana w wierszu w w każdej kolumnie, w której nie jest bity przez hetmanów z wcześniejszych wierszy — i dla każdej takiej kolumny schodzi do wiersza w + 1. Gdy w żadnej kolumnie się nie da, wraca (wycofuje się) do poprzedniego wiersza.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz jedną liczbę — liczbę ustawień.'],
            constraints: ['1 ≤ n ≤ 10'],
            examples: [{ input: '4', note: 'Są dwa ustawienia: hetmany w kolumnach 2, 4, 1, 3 albo 3, 1, 4, 2 (kolejne wiersze).' }, { input: '3', note: 'Na planszy 3 × 3 się nie da.' }],
            hint: 'Trzymaj kol[w] — kolumnę hetmana w wierszu w. Hetman (w, k) jest bezpieczny, jeśli dla każdego wcześniejszego wiersza i: kol[i] != k i abs(kol[i] - k) != w - i (ta druga równość oznacza wspólną przekątną). ustaw(w): if (w == n) { licznik++; return; } for (int k = 0; k < n; k++) if (bezpieczny(w, k)) { kol[w] = k; ustaw(w + 1); }. Dla n = 10 jest 724 ustawień.',
            tests: () => ['1', '2', '3', '5', '6', '7', '8', '9', '10'],
            solve: (inp) => String(queens(Number(inp), false).count),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n, licznik;
int kol[10];
bool bezpieczny(int w, int k) {
    for (int i = 0; i < w; i++)
        if (kol[i] == k || abs(kol[i] - k) == w - i) return false;
    return true;
}
void ustaw(int w) {
    if (w == n) { licznik++; return; }
    for (int k = 0; k < n; k++) {
        if (!bezpieczny(w, k)) continue;
        kol[w] = k;
        ustaw(w + 1);
    }
}
int main() {
    cin >> n;
    licznik = 0;
    ustaw(0);
    cout << licznik << "\n";
}`,
        },
        // ------------------------------------------------------------ 2
        {
            id: 'rek-hetmany-plansza',
            title: 'Hetmany — pierwsze ustawienie',
            level: 'srednie',
            statement: [
                'Ustaw n niebijących się hetmanów na szachownicy n × n i narysuj szachownicę. Jeśli ustawień jest wiele, wybierz pierwsze, na które natrafi backtracking, który idzie wiersz po wierszu i w każdym wierszu próbuje kolumn od lewej do prawej.',
                'To wzorzec „znajdź jedno”: gdy tylko ustawisz hetmana w ostatnim wierszu, zakończ szukanie — funkcja może zwracać true, a wywołujący ją, widząc true, od razu też wraca.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się jedna liczba całkowita n.'],
            output_format: ['Wypisz n wierszy po n znaków: H oznacza hetmana, a kropka — puste pole. Jeśli ustawienia nie ma, wypisz jedno słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 10'],
            examples: [{ input: '4' }, { input: '2' }],
            hint: 'bool ustaw(int w): if (w == n) return true; for (int k = 0; k < n; k++) if (bezpieczny(w, k)) { kol[w] = k; if (ustaw(w + 1)) return true; } return false;. Kolumny sprawdzamy od lewej, więc pierwsze znalezione ustawienie jest tym, o które chodzi w zadaniu.',
            tests: () => ['1', '3', '5', '6', '7', '8', '9', '10'],
            solve: (inp) => { const n = Number(inp); const f = queens(n, true).first; if (!f) return 'BRAK'; return f.map((c) => Array.from({ length: n }, (_, j) => (j === c ? 'H' : '.')).join('')).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
int kol[10];
bool bezpieczny(int w, int k) {
    for (int i = 0; i < w; i++)
        if (kol[i] == k || abs(kol[i] - k) == w - i) return false;
    return true;
}
bool ustaw(int w) {
    if (w == n) return true;
    for (int k = 0; k < n; k++) {
        if (!bezpieczny(w, k)) continue;
        kol[w] = k;
        if (ustaw(w + 1)) return true;
    }
    return false;
}
int main() {
    cin >> n;
    if (!ustaw(0)) cout << "BRAK\n";
    else
        for (int w = 0; w < n; w++) {
            for (int k = 0; k < n; k++) cout << (kol[w] == k ? 'H' : '.');
            cout << "\n";
        }
}`,
        },
        // ------------------------------------------------------------ 3
        {
            id: 'rek-labirynt',
            title: 'Ile dróg przez labirynt?',
            level: 'srednie',
            statement: [
                'Labirynt to plansza n × m: pola . są wolne, a pola # to ściany. Bajtek stoi w lewym górnym rogu i chce dojść do prawego dolnego. Może iść w górę, w dół, w lewo i w prawo, ale nie może wejść na ścianę ani wyjść poza planszę — i nie chce dwa razy odwiedzić tego samego pola. Ile jest różnych takich dróg?',
                'Tym razem ruchy w górę i w lewo też są dozwolone, więc pamięć z kroku 3 nie pomoże — trzeba naprawdę przejść wszystkie drogi. Zaznaczaj pola, na których już jesteś, a wycofując się — odznaczaj je.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i m.', 'W każdym z kolejnych n wierszy znajduje się m znaków . lub #. Lewe górne i prawe dolne pole są zawsze wolne.'],
            output_format: ['Wypisz jedną liczbę — liczbę dróg.'],
            constraints: ['1 ≤ n, m ≤ 6'],
            examples: [{ input: '3 3\n...\n.#.\n...', note: 'Ze środkiem zablokowanym są tylko dwie drogi: górą i prawą krawędzią albo lewą i dolną.' }, { input: '2 2\n..\n..' }],
            hint: 'void idz(int i, int j): if (poza planszą || sciana || odwiedzone[i][j]) return; if (i == n - 1 && j == m - 1) { licznik++; return; } odwiedzone[i][j] = true; idz(i + 1, j); idz(i - 1, j); idz(i, j + 1); idz(i, j - 1); odwiedzone[i][j] = false;. Ostatnia linijka to wycofanie — bez niej pole zostałoby zablokowane dla wszystkich innych dróg.',
            tests: (r) => {
                const G = (n, m, p) => { const g = Array.from({ length: n }, () => Array.from({ length: m }, () => (r() < p ? '#' : '.'))); g[0][0] = '.'; g[n - 1][m - 1] = '.'; return `${n} ${m}\n` + g.map((x) => x.join('')).join('\n'); };
                return ['1 1\n.', '1 6\n......', '2 3\n.#.\n...', '3 3\n.#.\n#..\n...', '4 4\n....\n....\n....\n....', '5 5\n.....\n.....\n.....\n.....\n.....', G(6, 6, 0.25), G(6, 6, 0.35), G(5, 6, 0.15), '6 6\n......\n.####.\n.#....\n.#.###\n.#....\n.####.'];
            },
            solve: (inp) => { const L = h.lines(inp.trim()); return String(mazeCount(L.slice(1)).cnt); },
            check: (inp) => { const L = h.lines(inp.trim()); const g = L.slice(1); if (g[0][0] !== '.' || g[g.length - 1].slice(-1) !== '.') return 'zablokowany start/meta'; return mazeCount(g).calls > 2e7 ? 'za dużo wywołań' : null; },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n, m;
long long licznik;
vector<string> g;
bool odw[6][6];
void idz(int i, int j) {
    if (i < 0 || j < 0 || i >= n || j >= m || g[i][j] == '#' || odw[i][j]) return;
    if (i == n - 1 && j == m - 1) { licznik++; return; }
    odw[i][j] = true;
    idz(i + 1, j); idz(i - 1, j); idz(i, j + 1); idz(i, j - 1);
    odw[i][j] = false;
}
int main() {
    cin >> n >> m;
    g.assign(n, "");
    for (int i = 0; i < n; i++) cin >> g[i];
    memset(odw, 0, sizeof odw);
    licznik = 0;
    idz(0, 0);
    cout << licznik << "\n";
}`,
        },
        // ------------------------------------------------------------ 4
        {
            id: 'rek-szczur',
            title: 'Szczur w labiryncie',
            level: 'srednie',
            statement: [
                'Labirynt to kwadrat n × n zapisany liczbami: 1 to pole wolne, 0 — ściana. Szczur stoi w lewym górnym rogu, a ser leży w prawym dolnym. Szczur porusza się o jedno pole: w dół (D), w lewo (L), w prawo (R) albo w górę (U), nie wchodzi na ściany i nie odwiedza dwa razy tego samego pola.',
                'Wypisz wszystkie drogi szczura jako napisy z liter D, L, R, U — w kolejności alfabetycznej. Wystarczy w każdym polu próbować kierunków właśnie w kolejności D, L, R, U, a drogi same wyjdą posortowane.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W każdym z kolejnych n wierszy znajduje się n liczb 0 lub 1 oddzielonych spacjami.'],
            output_format: ['Wypisz wszystkie drogi, każdą w osobnym wierszu, w kolejności alfabetycznej. Jeśli nie ma żadnej drogi (także wtedy, gdy start albo ser stoi na ścianie), wypisz BRAK.'],
            constraints: ['2 ≤ n ≤ 5', 'dróg jest co najwyżej 1000'],
            examples: [{ input: '4\n1 0 0 0\n1 1 0 1\n1 1 0 0\n0 1 1 1', note: 'DDRDRR: dół, dół, prawo, dół, prawo, prawo. Druga droga skręca w prawo o jedno pole wcześniej.' }],
            hint: 'void szukaj(int i, int j, string droga): if (i == n - 1 && j == n - 1) { wypisz drogę; return; } odw[i][j] = true; i dla każdego kierunku w kolejności D, L, R, U: jeśli sąsiednie pole jest w planszy, wolne i nieodwiedzone — szukaj(nowe i, nowe j, droga + litera); na końcu odw[i][j] = false;. Najwygodniej zapisać kierunki w tablicach: di = {1, 0, 0, -1}, dj = {0, -1, 1, 0}, litera = "DLRU".',
            tests: (r) => {
                const G = (n, p) => { const g = Array.from({ length: n }, () => Array.from({ length: n }, () => (r() < p ? 0 : 1))); g[0][0] = 1; g[n - 1][n - 1] = 1; return g; };
                const S = (g) => `${g.length}\n` + g.map((x) => x.join(' ')).join('\n');
                const out = ['2\n1 1\n1 1', '2\n0 1\n1 1', '3\n1 1 1\n0 0 1\n1 1 1', '3\n1 0 1\n0 1 0\n1 0 1', '4\n1 1 1 1\n1 1 1 1\n1 1 1 1\n1 1 1 1'];
                let tries = 0;
                while (out.length < 11 && tries < 500) { tries++; const g = G(r.int(4, 5), r.pick([0.2, 0.3, 0.4])); const c = ratPaths(g).length; if (c >= 1 && c <= 1000) out.push(S(g)); }
                return out;
            },
            solve: (inp) => { const a = h.nums(inp); const n = a[0]; const g = Array.from({ length: n }, (_, i) => a.slice(1 + i * n, 1 + (i + 1) * n)); const p = ratPaths(g); return p.length ? p.join('\n') : 'BRAK'; },
            check: (inp) => { const a = h.nums(inp); const n = a[0]; const g = Array.from({ length: n }, (_, i) => a.slice(1 + i * n, 1 + (i + 1) * n)); return ratPaths(g).length > 1000 ? 'za dużo dróg' : null; },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n, g[5][5];
bool odw[5][5];
int ile;
const int di[4] = {1, 0, 0, -1}, dj[4] = {0, -1, 1, 0};
const string litera = "DLRU";
void szukaj(int i, int j, string droga) {
    if (i == n - 1 && j == n - 1) { cout << droga << "\n"; ile++; return; }
    odw[i][j] = true;
    for (int d = 0; d < 4; d++) {
        int a = i + di[d], b = j + dj[d];
        if (a < 0 || b < 0 || a >= n || b >= n || g[a][b] == 0 || odw[a][b]) continue;
        szukaj(a, b, droga + litera[d]);
    }
    odw[i][j] = false;
}
int main() {
    cin >> n;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < n; j++) cin >> g[i][j];
    memset(odw, 0, sizeof odw);
    ile = 0;
    if (g[0][0] == 1 && g[n - 1][n - 1] == 1) szukaj(0, 0, "");
    if (ile == 0) cout << "BRAK\n";
}`,
        },
        // ------------------------------------------------------------ 5
        {
            id: 'rek-sudoku',
            title: 'Sudoku',
            level: 'trudne',
            statement: [
                'Rozwiąż sudoku. Plansza 9 × 9 jest podzielona na dziewięć kwadratów 3 × 3. Puste pola trzeba wypełnić cyframi od 1 do 9 tak, żeby w każdym wierszu, w każdej kolumnie i w każdym kwadracie 3 × 3 każda cyfra wystąpiła dokładnie raz.',
                'Backtracking: idź po polach wiersz po wierszu. Na puste pole próbuj wstawić kolejno cyfry 1, 2, …, 9 — tylko takie, które nie występują jeszcze w tym wierszu, kolumnie i kwadracie — i dla każdej schodź do następnego pola. Gdy żadna cyfra nie pasuje, wycofaj się i zmień cyfrę na wcześniejszym polu.',
            ],
            input_format: ['Wejście składa się z 9 wierszy po 9 znaków: cyfra oznacza wypełnione pole, a kropka — puste.'],
            output_format: ['Wypisz 9 wierszy po 9 cyfr — rozwiązaną planszę. Każde sudoku z testów ma dokładnie jedno rozwiązanie.'],
            constraints: ['plansza ma dokładnie jedno rozwiązanie'],
            examples: [{ input: '53..7....\n6..195...\n.98....6.\n8...6...3\n4..8.3..1\n7...2...6\n.6....28.\n...419..5\n....8..79' }],
            hint: 'bool rozwiaz(int p) — p to numer pola od 0 do 80 (wiersz p / 9, kolumna p % 9). if (p == 81) return true; jeśli pole jest wypełnione — return rozwiaz(p + 1); w przeciwnym razie for (d = 1..9) if (pasuje(p, d)) { plansza = d; if (rozwiaz(p + 1)) return true; plansza = 0; } return false;. Lewy górny róg kwadratu, w którym leży pole (w, k), to (w - w % 3, k - k % 3).',
            tests: (r) => [26, 28, 30, 32, 34, 36, 40, 45].map((gv) => sudokuStr(makeSudoku(r, gv))),
            solve: (inp) => { const s = inp.replace(/\s+/g, ''); const g = s.split('').map((c) => (c === '.' ? 0 : Number(c))); const res = sudokuSolve(g, 2); if (res.solutions !== 1) throw new Error('sudoku nie ma jednoznacznego rozwiązania'); return sudokuStr(res.first); },
            check: (inp) => { const s = inp.replace(/\s+/g, ''); const g = s.split('').map((c) => (c === '.' ? 0 : Number(c))); return sudokuNaiveCalls(g) > 2e6 ? 'naiwny backtracking za wolny' : null; },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int g[81];
bool pasuje(int p, int d) {
    int w = p / 9, k = p % 9;
    for (int i = 0; i < 9; i++)
        if (g[w * 9 + i] == d || g[i * 9 + k] == d) return false;
    int bw = w - w % 3, bk = k - k % 3;
    for (int a = 0; a < 3; a++)
        for (int b = 0; b < 3; b++)
            if (g[(bw + a) * 9 + bk + b] == d) return false;
    return true;
}
bool rozwiaz(int p) {
    if (p == 81) return true;
    if (g[p] != 0) return rozwiaz(p + 1);
    for (int d = 1; d <= 9; d++) {
        if (!pasuje(p, d)) continue;
        g[p] = d;
        if (rozwiaz(p + 1)) return true;
        g[p] = 0;
    }
    return false;
}
int main() {
    for (int w = 0; w < 9; w++) {
        string s;
        cin >> s;
        for (int k = 0; k < 9; k++) g[w * 9 + k] = s[k] == '.' ? 0 : s[k] - '0';
    }
    rozwiaz(0);
    for (int w = 0; w < 9; w++) {
        for (int k = 0; k < 9; k++) cout << g[w * 9 + k];
        cout << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 6
        {
            id: 'rek-kolorowanie-grafu',
            title: 'Kolorowanie mapy',
            level: 'srednie',
            statement: [
                'Mapa ma n państw, ponumerowanych od 1 do n, a niektóre pary państw sąsiadują ze sobą. Każde państwo trzeba pomalować jednym z k kolorów tak, żeby sąsiednie państwa miały różne kolory. Na ile sposobów można to zrobić?',
                'Koloruj państwa po kolei: państwu v próbuj nadać każdy kolor, którego nie ma żaden jego już pokolorowany sąsiad, i schodź do państwa v + 1. Złe gałęzie odpadają od razu, a nie dopiero po pokolorowaniu wszystkich państw.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się trzy liczby całkowite n, m i k — liczba państw, liczba par sąsiadów i liczba kolorów.', 'W każdym z kolejnych m wierszy znajdują się dwie liczby u i v — numery dwóch sąsiadujących państw.'],
            output_format: ['Wypisz jedną liczbę — liczbę poprawnych pokolorowań.'],
            constraints: ['1 ≤ n ≤ 10', '0 ≤ m ≤ 45', '1 ≤ k ≤ 4', 'u ≠ v, każda para sąsiadów występuje co najwyżej raz'],
            examples: [{ input: '3 3 3\n1 2\n2 3\n1 3', note: 'Trzy państwa sąsiadują każde z każdym, więc muszą mieć trzy różne kolory: 3 · 2 · 1 = 6 sposobów.' }, { input: '4 3 2\n1 2\n2 3\n3 4' }],
            hint: 'Zrób listy sąsiadów vector<int> sas[11] i tablicę kolor[11] (0 = jeszcze bez koloru). void koloruj(int v): if (v > n) { licznik++; return; } for (int c = 1; c <= k; c++) { sprawdź, czy któryś sąsiad u ma kolor[u] == c; jeśli nie — kolor[v] = c; koloruj(v + 1); kolor[v] = 0; }.',
            tests: (r) => {
                const G = (n, p, k) => { const e = []; for (let u = 1; u <= n; u++) for (let v = u + 1; v <= n; v++) if (r() < p) e.push(`${u} ${v}`); return `${n} ${e.length} ${k}\n${e.join('\n')}`.trim(); };
                return ['1 0 1', '1 0 4', '2 1 1\n1 2', '10 0 4', '5 5 3\n1 2\n2 3\n3 4\n4 5\n5 1', G(6, 0.5, 3), G(8, 0.3, 4), G(10, 0.4, 4), G(10, 0.2, 3), G(10, 0.9, 4), G(9, 0.5, 2)];
            },
            solve: (inp) => { const rd = reader(inp); const n = rd.int(), m = rd.int(), k = rd.int(); const e = []; for (let i = 0; i < m; i++) e.push([rd.int(), rd.int()]); return String(colorings(n, e, k)); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n, m, k;
long long licznik;
vector<int> sas[11];
int kolor[11];
void koloruj(int v) {
    if (v > n) { licznik++; return; }
    for (int c = 1; c <= k; c++) {
        bool wolny = true;
        for (int u : sas[v]) if (kolor[u] == c) wolny = false;
        if (!wolny) continue;
        kolor[v] = c;
        koloruj(v + 1);
        kolor[v] = 0;
    }
}
int main() {
    cin >> n >> m >> k;
    for (int i = 0; i <= 10; i++) { sas[i].clear(); kolor[i] = 0; }
    for (int i = 0; i < m; i++) {
        int u, v;
        cin >> u >> v;
        sas[u].push_back(v);
        sas[v].push_back(u);
    }
    licznik = 0;
    koloruj(1);
    cout << licznik << "\n";
}`,
        },
        // ------------------------------------------------------------ 7
        {
            id: 'rek-podzial-palindromy',
            title: 'Podział na palindromy',
            level: 'srednie',
            statement: [
                'Podziel słowo s na kawałki tak, żeby każdy kawałek był palindromem (czytał się tak samo od przodu i od tyłu). Wypisz wszystkie możliwe podziały.',
                'Kolejność: funkcja tnij(i) wybiera pierwszy kawałek zaczynający się na pozycji i — najpierw najkrótszy (jedną literę), potem coraz dłuższe — i tylko jeśli jest palindromem, tnie dalej resztę słowa. Wypisuj podziały w takiej kolejności, w jakiej powstają.',
            ],
            input_format: ['W jedynym wierszu wejścia znajduje się słowo s złożone z małych liter alfabetu angielskiego.'],
            output_format: ['Wypisz wszystkie podziały, każdy w osobnym wierszu, z kawałkami oddzielonymi spacjami.'],
            constraints: ['1 ≤ długość s ≤ 10'],
            examples: [{ input: 'aab', note: 'Najpierw kawałek „a”, potem z reszty „ab”: „a” i „b”. Potem pierwszy kawałek „aa” i reszta „b”. Kawałek „aab” nie jest palindromem.' }, { input: 'kajak' }],
            hint: 'void tnij(int i): if (i == n) { wypisz kawałki; return; } for (int j = i; j < n; j++) if (palindrom(i, j)) { kawalki.push_back(s.substr(i, j - i + 1)); tnij(j + 1); kawalki.pop_back(); }. Palindrom możesz sprawdzać rekurencyjnie, tak jak w kroku 2.',
            tests: (r) => ['a', 'ab', 'aaa', 'abba', 'racecar', 'aaaaaaaaaa', 'abacabadab', r.word(10, 'ab'), r.word(8, 'abc'), 'abcdefghij'],
            solve: (inp) => palParts(inp.trim()).join('\n'),
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
string s;
int n;
vector<string> kawalki;
bool palindrom(int l, int r) {
    if (l >= r) return true;
    if (s[l] != s[r]) return false;
    return palindrom(l + 1, r - 1);
}
void tnij(int i) {
    if (i == n) {
        for (size_t k = 0; k < kawalki.size(); k++) cout << (k ? " " : "") << kawalki[k];
        cout << "\n";
        return;
    }
    for (int j = i; j < n; j++) {
        if (!palindrom(i, j)) continue;
        kawalki.push_back(s.substr(i, j - i + 1));
        tnij(j + 1);
        kawalki.pop_back();
    }
}
int main() {
    cin >> s;
    n = s.size();
    kawalki.clear();
    tnij(0);
}`,
        },
        // ------------------------------------------------------------ 8
        {
            id: 'rek-liczby-suma-cyfr',
            title: 'Liczby o danej sumie cyfr',
            level: 'srednie',
            statement: [
                'Wypisz rosnąco wszystkie liczby n-cyfrowe (bez zera na początku), których suma cyfr wynosi dokładnie s. Jeśli takich liczb nie ma, wypisz BRAK.',
                'Buduj liczbę cyfra po cyfrze i obcinaj gałęzie, które na pewno nic nie dadzą: jeśli suma dotychczasowych cyfr przekroczyła s, dalej nie ma po co iść. A jeśli nawet same dziewiątki na pozostałych pozycjach nie dobiją do s — też nie.',
            ],
            input_format: ['W jedynym wierszu wejścia znajdują się dwie liczby całkowite n i s.'],
            output_format: ['Wypisz wszystkie takie liczby, każdą w osobnym wierszu, w kolejności rosnącej — albo jedno słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 6', '1 ≤ s ≤ 60', 'takich liczb jest co najwyżej 3000'],
            examples: [{ input: '3 2', note: 'Liczby trzycyfrowe o sumie cyfr 2: 101, 110 i 200.' }, { input: '2 19', note: 'Największa suma cyfr liczby dwucyfrowej to 9 + 9 = 18.' }],
            hint: 'void buduj(int i, int suma, string liczba): if (suma > s) return; if (suma + 9 * (n - i) < s) return; if (i == n) { if (suma == s) wypisz; return; } for (int d = (i == 0 ? 1 : 0); d <= 9; d++) buduj(i + 1, suma + d, liczba + char(\'0\' + d));. Cyfry próbujemy od najmniejszej, więc liczby wychodzą rosnąco.',
            tests: () => ['1 5', '1 10', '2 1', '6 1', '6 54', '6 55', '4 30', '5 40', '3 13', '6 50', '4 7'],
            solve: (inp) => { const [n, s] = h.nums(inp); const o = digitNums(n, s); return o.length ? o.join('\n') : 'BRAK'; },
            check: (inp) => { const [n, s] = h.nums(inp); return digitNums(n, s).length > 3000 ? 'za dużo liczb' : null; },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n, s, ile;
void buduj(int i, int suma, string liczba) {
    if (suma > s) return;
    if (suma + 9 * (n - i) < s) return;
    if (i == n) { cout << liczba << "\n"; ile++; return; }
    for (int d = (i == 0 ? 1 : 0); d <= 9; d++)
        buduj(i + 1, suma + d, liczba + char('0' + d));
}
int main() {
    cin >> n >> s;
    ile = 0;
    buduj(0, 0, "");
    if (ile == 0) cout << "BRAK\n";
}`,
        },
        // ------------------------------------------------------------ 9
        {
            id: 'rek-wykreslanka',
            title: 'Wykreślanka',
            level: 'srednie',
            statement: [
                'W wykreślance litery stoją w prostokącie r × c. Słowo jest ukryte w wykreślance, jeśli da się je przeczytać, idąc od litery do litery po polach sąsiadujących bokiem (w górę, w dół, w lewo albo w prawo — droga może skręcać), przy czym każde pole wolno użyć co najwyżej raz.',
                'Dla każdego z q słów sprawdź, czy jest ukryte w wykreślance. Spróbuj zacząć z każdego pola, a z każdego pola idź rekurencyjnie do sąsiadów, dopóki kolejne litery się zgadzają.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite r i c.', 'W każdym z kolejnych r wierszy znajduje się c małych liter — wiersze wykreślanki.', 'W następnym wierszu znajduje się liczba q, a w każdym z kolejnych q wierszy — jedno słowo.'],
            output_format: ['Dla każdego słowa wypisz w osobnym wierszu TAK albo NIE.'],
            constraints: ['1 ≤ r, c ≤ 6', '1 ≤ q ≤ 10', 'każde słowo ma od 1 do 10 liter'],
            examples: [{ input: '3 4\nabce\nsfcs\nadee\n3\nabcced\nsee\nabcb', note: 'abcb wymagałoby użycia litery b dwa razy — tego samego pola nie wolno wykorzystać ponownie.' }],
            hint: 'bool szukaj(int i, int j, int k) — czy od pola (i, j) da się przeczytać słowo od litery nr k. Jeśli pole jest poza planszą, już użyte albo litera się nie zgadza — return false. Jeśli k to ostatnia litera — return true. W przeciwnym razie zaznacz pole, sprawdź czterech sąsiadów z k + 1, odznacz pole i zwróć, czy któryś sąsiad się udał.',
            tests: (r) => {
                const T = (R, C, alph, q) => { const g = Array.from({ length: R }, () => r.word(C, alph)); const words = []; for (let z = 0; z < q; z++) { if (r() < 0.5) { let i = r.int(0, R - 1), j = r.int(0, C - 1); const used = new Set([i * C + j]); let w = g[i][j]; const len = r.int(1, 10); for (let s = 1; s < len; s++) { const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]].map(([a, b]) => [i + a, j + b]).filter(([a, b]) => a >= 0 && b >= 0 && a < R && b < C && !used.has(a * C + b)); if (!nb.length) break; [i, j] = r.pick(nb); used.add(i * C + j); w += g[i][j]; } words.push(w); } else words.push(r.word(r.int(1, 10), alph)); } return `${R} ${C}\n${g.join('\n')}\n${q}\n${words.join('\n')}`; };
                return ['1 1\na\n2\na\nb', '2 2\nab\ncd\n4\nabdc\nacdb\nad\nabcd', T(4, 4, 'abc', 10), T(6, 6, 'ab', 10), T(5, 6, 'olimpiada', 10), T(6, 6, 'abcdefghijklmnopqrstuvwxyz', 10), `6 6\n${Array(6).fill('aaaaaa').join('\n')}\n4\naaaaaaaaab\naaaaaaaaaa\nb\naaaa`];
            },
            solve: (inp) => { const L = h.toks(inp); const R = Number(L[0]); const g = L.slice(2, 2 + R); const q = Number(L[2 + R]); return L.slice(3 + R, 3 + R + q).map((w) => (wordIn(g, w) ? 'TAK' : 'NIE')).join('\n'); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int R, C;
vector<string> g;
string w;
bool uzyte[6][6];
bool szukaj(int i, int j, int k) {
    if (i < 0 || j < 0 || i >= R || j >= C || uzyte[i][j] || g[i][j] != w[k]) return false;
    if (k == (int)w.size() - 1) return true;
    uzyte[i][j] = true;
    bool ok = szukaj(i + 1, j, k + 1) || szukaj(i - 1, j, k + 1) || szukaj(i, j + 1, k + 1) || szukaj(i, j - 1, k + 1);
    uzyte[i][j] = false;
    return ok;
}
int main() {
    cin >> R >> C;
    g.assign(R, "");
    for (int i = 0; i < R; i++) cin >> g[i];
    memset(uzyte, 0, sizeof uzyte);
    int q;
    cin >> q;
    while (q--) {
        cin >> w;
        bool jest = false;
        for (int i = 0; i < R && !jest; i++)
            for (int j = 0; j < C && !jest; j++)
                if (szukaj(i, j, 0)) jest = true;
        cout << (jest ? "TAK" : "NIE") << "\n";
    }
}`,
        },
        // ------------------------------------------------------------ 10
        {
            id: 'rek-plecak-brut',
            title: 'Plecak — sprawdź wszystko',
            level: 'srednie',
            statement: [
                'Bajtek pakuje plecak, który udźwignie co najwyżej W kilogramów. Ma n przedmiotów; i-ty waży wᵢ kilogramów i jest wart vᵢ bajtalarów. Jaka jest największa łączna wartość przedmiotów, które zmieszczą się w plecaku?',
                'Przedmiotów jest mało, więc można sprawdzić wszystkie możliwości: każdy przedmiot albo bierzemy, albo nie. Obcinaj gałęzie, w których plecak jest już za ciężki. (Wagi są ogromne, więc znany z programowania dynamicznego sposób „tablica po wadze” tu nie zadziała — ale 2²⁰ ≈ milion możliwości to dla komputera nic.)',
            ],
            input_format: ['W pierwszym wierszu wejścia znajdują się dwie liczby całkowite n i W.', 'W każdym z kolejnych n wierszy znajdują się dwie liczby całkowite wᵢ i vᵢ.'],
            output_format: ['Wypisz jedną liczbę — największą możliwą łączną wartość.'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ W ≤ 10⁹', '1 ≤ wᵢ, vᵢ ≤ 10⁹'],
            examples: [{ input: '4 10\n5 10\n4 40\n6 30\n3 50', note: 'Najlepiej wziąć przedmioty 2 i 4: waga 4 + 3 = 7 ≤ 10, wartość 40 + 50 = 90.' }],
            hint: 'void pakuj(int i, long long waga, long long wartosc): if (waga > W) return; if (i == n) { najlepsza = max(najlepsza, wartosc); return; } pakuj(i + 1, waga, wartosc); pakuj(i + 1, waga + w[i], wartosc + v[i]);. Sumy przekraczają zakres int — long long. Odpowiedzią może być 0, jeśli nic się nie mieści.',
            tests: (r) => {
                const T = (n, W, hi) => `${n} ${W}\n` + Array.from({ length: n }, () => `${r.int(1, hi)} ${r.int(1, 1e9)}`).join('\n');
                return ['1 5\n6 100', '1 5\n5 100', '3 50\n10 60\n20 100\n30 120', T(10, 1000, 300), T(15, 1e9, 2e8), T(20, 1e9, 1e9), T(20, 1e9, 1e8), T(20, 300, 100), T(18, 777777777, 1e9)];
            },
            solve: (inp) => { const rd = reader(inp); const n = rd.int(), W = rd.int(); const it = Array.from({ length: n }, () => [rd.int(), rd.int()]); let best = 0; for (let mask = 0; mask < 1 << n; mask++) { let w = 0, v = 0; for (let i = 0; i < n; i++) if (mask >> i & 1) { w += it[i][0]; v += it[i][1]; } if (w <= W && v > best) best = v; } return String(best); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
long long W, najlepsza;
long long w[20], v[20];
void pakuj(int i, long long waga, long long wartosc) {
    if (waga > W) return;
    if (i == n) { najlepsza = max(najlepsza, wartosc); return; }
    pakuj(i + 1, waga, wartosc);
    pakuj(i + 1, waga + w[i], wartosc + v[i]);
}
int main() {
    cin >> n >> W;
    for (int i = 0; i < n; i++) cin >> w[i] >> v[i];
    najlepsza = 0;
    pakuj(0, 0, 0);
    cout << najlepsza << "\n";
}`,
        },
        // ------------------------------------------------------------ 11
        {
            id: 'rek-dwie-druzyny',
            title: 'Sprawiedliwy podział',
            level: 'srednie',
            statement: [
                'Bajtek i Bitek dzielą między siebie n prezentów; i-ty prezent jest wart aᵢ. Każdy prezent musi trafić do dokładnie jednego z nich (ktoś może dostać nic). Podziel prezenty tak, żeby różnica wartości ich części była jak najmniejsza, i wypisz tę różnicę.',
                'Sprawdź wszystkie możliwości: każdy prezent trafia albo do Bajtka, albo do Bitka. Rekurencja może nieść w parametrze sumę Bajtka — suma Bitka to po prostu suma wszystkich prezentów minus suma Bajtka.',
            ],
            input_format: ['W pierwszym wierszu wejścia znajduje się liczba n.', 'W drugim wierszu znajduje się n liczb całkowitych a₁, …, aₙ.'],
            output_format: ['Wypisz jedną liczbę — najmniejszą możliwą różnicę wartości.'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ aᵢ ≤ 10⁶'],
            examples: [{ input: '5\n3 1 4 2 2', note: 'Na przykład 3 + 2 = 5 i 1 + 4 + 2 = 7 dają różnicę 2, ale 3 + 2 + 1 = 6 i 4 + 2 = 6 dają różnicę 0.' }],
            hint: 'void dziel(int i, long long bajtek): if (i == n) { najmniejsza = min(najmniejsza, abs(suma - 2 * bajtek)); return; } dziel(i + 1, bajtek + a[i]); dziel(i + 1, bajtek);. Różnica to |bajtek − (suma − bajtek)| = |suma − 2 · bajtek|.',
            tests: (r) => { const T = (n, hi) => `${n}\n${r.arr(n, 1, hi).join(' ')}`; return ['1\n7', '2\n5 5', '3\n1 2 3', '4\n1 1 1 10', T(10, 100), T(15, 1000), T(20, 1e6), T(20, 10), T(19, 1e6)]; },
            solve: (inp) => { const a = h.nums(inp).slice(1); const S = a.reduce((x, y) => x + y, 0); let best = Infinity; const go = (i, s) => { if (i === a.length) { best = Math.min(best, Math.abs(S - 2 * s)); return; } go(i + 1, s + a[i]); go(i + 1, s); }; go(0, 0); return String(best); },
            cpp: String.raw`
#include <bits/stdc++.h>
using namespace std;
int n;
long long a[20], suma, najmniejsza;
void dziel(int i, long long bajtek) {
    if (i == n) { najmniejsza = min(najmniejsza, llabs(suma - 2 * bajtek)); return; }
    dziel(i + 1, bajtek + a[i]);
    dziel(i + 1, bajtek);
}
int main() {
    cin >> n;
    suma = 0;
    for (int i = 0; i < n; i++) { cin >> a[i]; suma += a[i]; }
    najmniejsza = LLONG_MAX;
    dziel(0, 0);
    cout << najmniejsza << "\n";
}`,
        },
    ];
};
