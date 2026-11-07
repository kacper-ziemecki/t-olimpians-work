// Tablice — baza zadań na koniec lekcji: od najłatwiejszych do najtrudniejszych (najpierw łatwe, potem średnie,
// na końcu trudne — build.js pilnuje tej kolejności). Każde zadanie łączy kilka zagadnień z lekcji, także
// z poprzednich lekcji (modulo, napisy, long long). Bez funkcji, vectora, sortowania i map.
//
// Uwaga do wzorcówek C++: build.js --sprawdz uruchamia wszystkie testy zadania w jednym procesie, więc tablice
// globalne, które się sumują (liczniki, różnice), wzorcówka zeruje na początku main.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const lin = (a) => a.join(' ');
    const arrIn = (a) => `${a.length}\n${lin(a)}`;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas', 'Julka', 'Tymon', 'Nina', 'Bartek', 'Iga', 'Leon'];
    const p2 = (x) => String(x).padStart(2, '0');
    const sito = (n) => { const z = new Uint8Array(n + 1); z[0] = 1; if (n >= 1) z[1] = 1; for (let i = 2; i * i <= n; i++) if (!z[i]) for (let j = i * i; j <= n; j += i) z[j] = 1; return z; };
    const Z6 = sito(1000000);
    const losTab = (r, n, m, lo, hi) => Array.from({ length: n }, () => r.arr(m, lo, hi));
    const plansza = (r, n, m, f) => Array.from({ length: n }, () => Array.from({ length: m }, f).join(''));
    // Sąsiedzi (8 kierunków)
    const D8 = []; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) if (a || b) D8.push([a, b]);
    // Sudoku: poprawna plansza z wzoru, potem tasowanie cyfr, wierszy w pasach i pasów.
    const sudoku = (r) => {
        const cyf = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
        const pasy = r.shuffle([0, 1, 2]);
        const wiersze = pasy.flatMap((p) => r.shuffle([0, 1, 2]).map((x) => p * 3 + x));
        const kolPasy = r.shuffle([0, 1, 2]);
        const kolumny = kolPasy.flatMap((p) => r.shuffle([0, 1, 2]).map((x) => p * 3 + x));
        return wiersze.map((w) => kolumny.map((k) => cyf[(w * 3 + Math.floor(w / 3) + k) % 9]));
    };
    const sudokuOk = (t) => {
        const ok = (cells) => new Set(cells).size === 9 && cells.every((x) => x >= 1 && x <= 9);
        for (let i = 0; i < 9; i++) { if (!ok(t[i])) return false; if (!ok(t.map((w) => w[i]))) return false; }
        for (let a = 0; a < 3; a++) for (let b = 0; b < 3; b++) { const c = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) c.push(t[3 * a + i][3 * b + j]); if (!ok(c)) return false; }
        return true;
    };
    // Kwadraty magiczne: nieparzyste (metoda syjamska) i podzielne przez 4.
    const magiczny = (n) => {
        const t = Array.from({ length: n }, () => Array(n).fill(0));
        if (n % 2 === 1) { let w = 0, k = Math.floor(n / 2); for (let x = 1; x <= n * n; x++) { t[w][k] = x; const nw = (w - 1 + n) % n, nk = (k + 1) % n; if (t[nw][nk]) w = (w + 1) % n; else { w = nw; k = nk; } } }
        else for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { const v = i * n + j + 1; t[i][j] = (i % 4 === j % 4 || (i % 4) + (j % 4) === 3) ? n * n + 1 - v : v; }
        return t;
    };
    const kwIn = (t) => `${t.length}\n${t.map(lin).join('\n')}`;
    const czyMagiczny = (t) => {
        const n = t.length; const uz = new Set(); for (const w of t) for (const x of w) { if (x < 1 || x > n * n || uz.has(x)) return false; uz.add(x); }
        const s = t[0].reduce((a, b) => a + b, 0);
        for (let i = 0; i < n; i++) { if (t[i].reduce((a, b) => a + b, 0) !== s) return false; let c = 0; for (let w = 0; w < n; w++) c += t[w][i]; if (c !== s) return false; }
        let d1 = 0, d2 = 0; for (let i = 0; i < n; i++) { d1 += t[i][i]; d2 += t[i][n - 1 - i]; }
        return d1 === s && d2 === s;
    };
    // Plansza ze statkami: proste odcinki, które się nie stykają (także rogami).
    const statki = (r, n, m, prob) => {
        const p = Array.from({ length: n }, () => Array(m).fill('.'));
        for (let t = 0; t < prob; t++) {
            const poziomy = r() < 0.5, dl = r.int(1, 4);
            const w = r.int(0, n - 1), k = r.int(0, m - 1);
            const pola = []; for (let i = 0; i < dl; i++) pola.push(poziomy ? [w, k + i] : [w + i, k]);
            if (pola.some(([a, b]) => a >= n || b >= m)) continue;
            let wolne = true;
            for (const [a, b] of pola) for (let da = -1; da <= 1; da++) for (let db = -1; db <= 1; db++) { const x = a + da, y = b + db; if (x >= 0 && x < n && y >= 0 && y < m && p[x][y] === '#') wolne = false; }
            if (wolne) for (const [a, b] of pola) p[a][b] = '#';
        }
        return p.map((w) => w.join(''));
    };
    const statkiPoprawne = (p) => {
        const n = p.length, m = p[0].length; const odw = p.map((w) => Array(m).fill(false));
        for (let w = 0; w < n; w++) for (let k = 0; k < m; k++) {
            if (p[w][k] !== '#' || odw[w][k]) continue;
            const st = [[w, k]], pola = []; odw[w][k] = true;
            while (st.length) { const [a, b] = st.pop(); pola.push([a, b]); for (const [da, db] of D8) { const x = a + da, y = b + db; if (x >= 0 && x < n && y >= 0 && y < m && p[x][y] === '#' && !odw[x][y]) { odw[x][y] = true; st.push([x, y]); } } }
            const ws = new Set(pola.map((q) => q[0])), ks = new Set(pola.map((q) => q[1]));
            if (ws.size > 1 && ks.size > 1) return false;
            if (Math.max(ws.size, ks.size) !== pola.length) return false;
        }
        return true;
    };
    const zycie = (p, k) => {
        let t = p.map((w) => w.split('')); const n = t.length, m = t[0].length;
        for (let g = 0; g < k; g++) {
            const nt = t.map((w) => w.slice());
            for (let w = 0; w < n; w++) for (let c = 0; c < m; c++) { let s = 0; for (const [a, b] of D8) { const x = w + a, y = c + b; if (x >= 0 && x < n && y >= 0 && y < m && t[x][y] === '#') s++; } nt[w][c] = t[w][c] === '#' ? (s === 2 || s === 3 ? '#' : '.') : (s === 3 ? '#' : '.'); }
            t = nt;
        }
        return t.map((w) => w.join('')).join('\n');
    };
    const unikalneImiona = (r, n) => {
        const out = new Set();
        while (out.size < n) { const l = r.int(2, 8); out.add(r.word(1, 'ABCDEFGHIJKLMNOPRSTUWZ') + r.word(l - 1, 'abcdefghijklmnoprstuwyz')); }
        return r.shuffle([...out]);
    };

    return [
        // ================================================================ ŁATWE
        {
            id: 'tab-b-zamiana-sasiadow', krok: 9, level: 'latwe',
            title: 'Zamień sąsiadów',
            short: 'Zamień miejscami pierwszą liczbę z drugą, trzecią z czwartą i tak dalej.',
            tags: ['swap', 'i += 2', 'nieparzyste n'],
            statement: ['Wczytaj n liczb i zamień miejscami pary sąsiadów: pierwszą liczbę z drugą, trzecią z czwartą, piątą z szóstą i tak dalej. Jeśli n jest nieparzyste, ostatnia liczba nie ma pary i zostaje na miejscu. Wypisz wynik.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Tablica po zamianach.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n1 2 3 4 5 6' }, { input: '5\n7 8 9 10 11', note: 'Jedenastka nie ma pary.' }],
            hint: R`Pętla co dwa: for (int i = 0; i + 1 < n; i += 2) swap(t[i], t[i + 1]);. Warunek i + 1 < n pilnuje, żeby przy nieparzystym n nie sięgnąć po pudełko t[n].`,
            tests: (r) => ['6\n1 2 3 4 5 6', '5\n7 8 9 10 11', '1\n42', '2\n-1 1', arrIn(r.arr(1000, -1e9, 1e9)), arrIn(r.arr(999, 0, 99)), arrIn(r.arr(r.int(3, 20), 0, 9))],
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); for (let i = 0; i + 1 < n; i += 2) [t[i], t[i + 1]] = [t[i + 1], t[i]]; return lin(t); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    for (int i = 0; i + 1 < n; i += 2) {
        swap(t[i], t[i + 1]);
    }
    for (int i = 0; i < n; i++) {
        cout << t[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-palindrom', krok: 9, level: 'latwe',
            title: 'Ciąg-palindrom',
            short: 'Czy ciąg czyta się tak samo od początku i od końca? Kilka ciągów w jednym teście.',
            tags: ['t[i] i t[n - 1 - i]', 'flaga bool', 'wiele zestawów'],
            statement: ['Ciąg liczb jest palindromem, gdy czytany od końca wygląda tak samo jak od początku — na przykład 1 2 3 2 1 albo 5 5. Wczytaj z zestawów danych i dla każdego wypisz w osobnym wierszu TAK, jeśli ciąg jest palindromem, albo NIE.'],
            input_format: ['W pierwszym wierszu liczba z.', 'Każdy zestaw to dwa wiersze: długość ciągu n i n liczb.'],
            output_format: ['z wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ z ≤ 100', '1 ≤ n ≤ 1000', 'Suma długości wszystkich ciągów ≤ 10 000', '−10⁹ ≤ liczby ≤ 10⁹'],
            examples: [{ input: '3\n5\n1 2 3 2 1\n4\n1 2 2 3\n1\n7' }],
            hint: R`Dla każdego zestawu wczytaj ciąg do tej samej tablicy — stare liczby zostaną nadpisane, a liczy się tylko pierwsze n pudełek. Porównuj pary od końców: t[i] z t[n - 1 - i] dla i < n / 2. Wystarczy jedna różna para, żeby odpowiedź brzmiała NIE.`,
            tests: (r) => {
                const pal = (n, lo, hi) => { const a = r.arr(Math.ceil(n / 2), lo, hi); return a.concat(a.slice(0, Math.floor(n / 2)).reverse()); };
                const zest = (ciagi) => `${ciagi.length}\n${ciagi.map(arrIn).join('\n')}`;
                const psuj = (a) => { const b = a.slice(); b[r.int(0, b.length - 1)] += 1; return b; };
                const duzo = Array.from({ length: 100 }, () => { const n = r.int(1, 100); return r() < 0.5 ? pal(n, 0, 3) : r.arr(n, 0, 3); });
                return ['3\n5\n1 2 3 2 1\n4\n1 2 2 3\n1\n7', zest([[5, 5], [5, 6], [1, 2, 1], [1, 2, 2, 1], [3, 1, 3, 1]]), zest([pal(1000, -1e9, 1e9), psuj(pal(1000, -1e9, 1e9)), pal(999, 0, 9)]), zest(duzo)];
            },
            solve: (inp) => { const v = nums(inp); let p = 1; const o = []; for (let s = 0; s < v[0]; s++) { const n = v[p++]; const t = v.slice(p, p + n); p += n; let ok = true; for (let i = 0; i < n / 2; i++) if (t[i] !== t[n - 1 - i]) ok = false; o.push(ok ? 'TAK' : 'NIE'); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int z;
    cin >> z;
    for (int s = 0; s < z; s++) {
        int n;
        cin >> n;
        for (int i = 0; i < n; i++) {
            cin >> t[i];
        }
        bool palindrom = true;
        for (int i = 0; i < n / 2; i++) {
            if (t[i] != t[n - 1 - i]) {
                palindrom = false;
            }
        }
        if (palindrom) {
            cout << "TAK\n";
        } else {
            cout << "NIE\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-podlewanie', krok: 9, level: 'latwe',
            title: 'Podlewanie ogrodu',
            short: 'Zraszacze podlewają grządki od a do b. Ile grządek jest mokrych i które zostały suche?',
            tags: ['bool mokra[]', 'zaznaczanie przedziału', 'BRAK'],
            statement: ['W ogrodzie jest n grządek ustawionych w rzędzie i ponumerowanych od 1 do n. Włączono q zraszaczy; każdy podlewa grządki od a-tej do b-tej włącznie. Zraszacze mogą się nakładać. W pierwszym wierszu wypisz, ile grządek zostało podlanych, a w drugim numery suchych grządek rosnąco — albo BRAK, jeśli wszystkie są mokre.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['W pierwszym wierszu liczba mokrych grządek, w drugim suche grządki albo BRAK.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ q ≤ 1000', '1 ≤ a ≤ b ≤ n'],
            examples: [{ input: '10 3\n2 4\n3 6\n9 9', note: 'Mokre są grządki 2–6 i 9, czyli 6 grządek. Suche: 1, 7, 8 i 10.' }],
            hint: R`Tablica bool mokra[1001] = {};. Dla każdego zraszacza zaznacz w pętli grządki od a do b: mokra[i] = true. Potem jedno przejście od 1 do n: policz zaznaczone grządki i wypisz niezaznaczone.`,
            check: (inp) => { const v = nums(inp); const n = v[0]; for (let j = 0; j < v[1]; j++) { const a = v[2 + 2 * j], b = v[3 + 2 * j]; if (!(a >= 1 && a <= b && b <= n)) return 'zły zraszacz'; } return null; },
            tests: (r) => {
                const mk = (n, q, maxL) => `${n} ${q}\n${Array.from({ length: q }, () => { const a = r.int(1, n); return `${a} ${Math.min(n, a + r.int(0, maxL))}`; }).join('\n')}`;
                return ['10 3\n2 4\n3 6\n9 9', '1 1\n1 1', '5 1\n2 3', '5 2\n1 3\n3 5', mk(1000, 1000, 5), mk(1000, 30, 20), mk(1000, 1000, 1000), mk(15, 4, 3)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], m = Array(n + 1).fill(false); for (let j = 0; j < v[1]; j++) for (let i = v[2 + 2 * j]; i <= v[3 + 2 * j]; i++) m[i] = true; const s = []; let c = 0; for (let i = 1; i <= n; i++) { if (m[i]) c++; else s.push(i); } return `${c}\n${s.length ? lin(s) : 'BRAK'}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    bool mokra[1001] = {};
    int n, q;
    cin >> n >> q;
    for (int j = 0; j < q; j++) {
        int a, b;
        cin >> a >> b;
        for (int i = a; i <= b; i++) {
            mokra[i] = true;
        }
    }
    int ile = 0;
    for (int i = 1; i <= n; i++) {
        if (mokra[i]) {
            ile++;
        }
    }
    cout << ile << "\n";
    if (ile == n) {
        cout << "BRAK\n";
    } else {
        for (int i = 1; i <= n; i++) {
            if (!mokra[i]) {
                cout << i << " ";
            }
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-sto-drzwi', krok: 9, level: 'latwe',
            title: 'Sto drzwi',
            short: 'Osoba numer i przełącza co i-te drzwi. Które drzwi zostaną otwarte?',
            tags: ['bool otwarte[]', 'co i-ty element', 'przełączanie'],
            statement: ['W długim korytarzu jest n zamkniętych drzwi ponumerowanych od 1 do n. Korytarzem przechodzi k osób. Osoba numer i przełącza drzwi numer i, 2i, 3i i tak dalej — zamknięte otwiera, a otwarte zamyka. Wypisz rosnąco numery drzwi, które po przejściu wszystkich osób są otwarte, albo BRAK, jeśli wszystkie są zamknięte.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Numery otwartych drzwi albo BRAK.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ k ≤ 10 000'],
            examples: [
                { input: '10 10', note: 'Otwarte zostają drzwi 1, 4 i 9 — każde z nich przełączono nieparzystą liczbę razy.' },
                { input: '10 3' },
            ],
            hint: R`Tablica bool otwarte[10001] = {};. Dla każdej osoby i od 1 do k przejdź po j = i, 2i, 3i, … aż do n i przełącz: otwarte[j] = !otwarte[j];. Obrotów jest około n / 1 + n / 2 + … + n / k — nawet dla 10 000 to chwila.`,
            tests: (r) => ['10 10', '10 3', '1 1', '5 20', '100 100', '10000 10000', `10000 ${r.int(1, 10000)}`, `${r.int(1, 10000)} ${r.int(1, 50)}`, '2 2'],
            solve: (inp) => { const [n, k] = nums(inp); const o = Array(n + 1).fill(false); for (let i = 1; i <= k; i++) for (let j = i; j <= n; j += i) o[j] = !o[j]; const w = []; for (let j = 1; j <= n; j++) if (o[j]) w.push(j); return w.length ? lin(w) : 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    bool otwarte[10001] = {};
    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= k; i++) {
        for (int j = i; j <= n; j += i) {
            otwarte[j] = !otwarte[j];
        }
    }
    int ile = 0;
    for (int j = 1; j <= n; j++) {
        if (otwarte[j]) {
            cout << j << " ";
            ile++;
        }
    }
    if (ile == 0) {
        cout << "BRAK";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-waga', krok: 9, level: 'latwe',
            title: 'Waga szalkowa',
            short: 'Znajdź odważnik, dla którego suma mas po lewej równa się sumie mas po prawej.',
            tags: ['suma całości', 'suma lewej strony', 'long long'],
            statement: ['Na listwie leży n odważników o masach podanych po kolei. Szukamy punktu podparcia: odważnika, dla którego suma mas wszystkich odważników na lewo od niego jest równa sumie mas wszystkich odważników na prawo od niego (sam odważnik w punkcie podparcia się nie liczy). Wypisz numer (od 1) pierwszego takiego odważnika albo BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n mas.'],
            output_format: ['Numer odważnika albo BRAK.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ masa ≤ 10⁶'],
            examples: [
                { input: '7\n1 7 3 6 5 6 0', note: 'Na lewo od czwartego odważnika: 1 + 7 + 3 = 11, na prawo: 5 + 6 + 0 = 11.' },
                { input: '3\n1 2 3' },
            ],
            hint: R`Najpierw policz sumę wszystkich mas (long long). Potem idź od lewej, trzymając sumę lewej strony: prawa strona to cała suma minus lewa strona minus bieżący odważnik. Po sprawdzeniu dodaj bieżący odważnik do lewej strony i idź dalej.`,
            tests: (r) => {
                const zRownowaga = (pol) => { const L = r.arr(pol, 0, 1e6); return L.concat([r.int(0, 1e6)], L.slice().reverse()); };
                return ['7\n1 7 3 6 5 6 0', '3\n1 2 3', '1\n5', '2\n0 0', '3\n4 9 4', arrIn(r.arr(5000, 0, 1e6)), arrIn(zRownowaga(2499)), arrIn(r.arr(5000, 0, 0)), arrIn(zRownowaga(15))];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); const s = t.reduce((a, b) => a + b, 0); let l = 0; for (let i = 0; i < n; i++) { if (l === s - l - t[i]) return String(i + 1); l += t[i]; } return 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[10000];
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
        suma += t[i];
    }
    long long lewa = 0;
    int gdzie = -1;
    for (int i = 0; i < n; i++) {
        long long prawa = suma - lewa - t[i];
        if (lewa == prawa) {
            gdzie = i;
            break;
        }
        lewa += t[i];
    }
    if (gdzie == -1) {
        cout << "BRAK\n";
    } else {
        cout << gdzie + 1 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-wybory', krok: 9, level: 'latwe',
            title: 'Wybory samorządu',
            short: 'Policz głosy na k kandydatów. Kto wygrał — a może potrzebna jest dogrywka?',
            tags: ['tablica liczników', 'maksimum', 'remis'],
            statement: ['W wyborach do samorządu startuje k kandydatów ponumerowanych od 1 do k. Każdy z n uczniów oddał jeden głos — numer kandydata. Jeśli jeden kandydat dostał więcej głosów niż każdy inny, wypisz jego numer i liczbę głosów. Jeśli kilku kandydatów ma tyle samo głosów i jest to najwięcej, wypisz DOGRYWKA, a w drugim wierszu rosnąco numery tych kandydatów.'],
            input_format: ['W pierwszym wierszu liczby k i n.', 'W drugim wierszu n głosów.'],
            output_format: ['Numer zwycięzcy i liczba głosów albo DOGRYWKA i numery kandydatów.'],
            constraints: ['1 ≤ k ≤ 100', '1 ≤ n ≤ 10 000', 'Każdy głos to liczba od 1 do k.'],
            examples: [{ input: '4 7\n2 1 2 4 2 1 4', note: 'Kandydat 2 dostał 3 głosy, a pozostali mniej.' }, { input: '3 4\n1 3 3 1' }],
            hint: R`Tablica liczników int glosy[101] = {}; i glosy[x]++ dla każdego głosu. Potem znajdź największą liczbę głosów i policz, ilu kandydatów ją ma: jeden — mamy zwycięzcę, więcej — dogrywka.`,
            tests: (r) => ['4 7\n2 1 2 4 2 1 4', '3 4\n1 3 3 1', '1 1\n1', '5 1\n4', '2 2\n1 2', `100 10000\n${lin(r.arr(10000, 1, 100))}`, `3 9999\n${lin(r.arr(9999, 1, 3))}`, `10 20\n${lin(r.arr(20, 1, 10))}`, `4 8\n1 2 3 4 4 3 2 1`],
            solve: (inp) => { const v = nums(inp); const k = v[0], n = v[1]; const g = Array(k + 1).fill(0); for (const x of v.slice(2, 2 + n)) g[x]++; const mx = Math.max(...g.slice(1)); const w = []; for (let i = 1; i <= k; i++) if (g[i] === mx) w.push(i); return w.length === 1 ? `${w[0]} ${mx}` : `DOGRYWKA\n${lin(w)}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int glosy[101] = {};
    int k, n;
    cin >> k >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        glosy[x]++;
    }
    int naj = 0;
    for (int i = 1; i <= k; i++) {
        if (glosy[i] > naj) {
            naj = glosy[i];
        }
    }
    int ilu = 0, kto = 0;
    for (int i = 1; i <= k; i++) {
        if (glosy[i] == naj) {
            ilu++;
            kto = i;
        }
    }
    if (ilu == 1) {
        cout << kto << " " << naj << "\n";
    } else {
        cout << "DOGRYWKA\n";
        for (int i = 1; i <= k; i++) {
            if (glosy[i] == naj) {
                cout << i << " ";
            }
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-wieze', krok: 9, level: 'latwe',
            title: 'Wieże na szachownicy',
            short: 'Ile par wież atakuje się na szachownicy? Liczniki dla wierszy i kolumn.',
            tags: ['plansza 8 × 8', 'liczniki wierszy i kolumn', 'c − 1 par'],
            statement: ['Na szachownicy 8 × 8 stoją same wieże (znak W), a puste pola to kropki. Wieża atakuje tę wieżę, która stoi najbliżej niej w tym samym wierszu albo w tej samej kolumnie — dalsze wieże są zasłonięte przez bliższe. Policz, ile par wież się atakuje. Zauważ, że jeśli w jednym wierszu stoi c wież (c ≥ 1), to tworzą one c − 1 atakujących się par sąsiadów — tak samo w kolumnie.'],
            input_format: ['Osiem wierszy po osiem znaków: W albo kropka.'],
            output_format: ['Jedna liczba — liczba atakujących się par.'],
            constraints: ['Na szachownicy jest od 0 do 64 wież.'],
            examples: [{ input: 'W..W....\n........\n...W....\n........\n........\n........\nW.......\n........', note: 'Para w pierwszym wierszu, para w pierwszej kolumnie (wiersze 1 i 7) i para w czwartej kolumnie (wiersze 1 i 3) — razem 3.' }],
            hint: R`Policz wieże w każdym wierszu (int wiersz[8] = {};) i w każdej kolumnie (int kolumna[8] = {};) — pole (w, k) z wieżą zwiększa wiersz[w] i kolumna[k]. Każdy wiersz z c > 0 wieżami daje c - 1 par; tak samo każda kolumna. Zsumuj wszystko.`,
            tests: (r) => {
                const sz = (g) => plansza(r, 8, 8, () => (r() < g ? 'W' : '.')).join('\n');
                return ['W..W....\n........\n...W....\n........\n........\n........\nW.......\n........', Array(8).fill('........').join('\n'), Array(8).fill('WWWWWWWW').join('\n'), sz(0.1), sz(0.3), sz(0.6), 'W.......\n.W......\n..W.....\n...W....\n....W...\n.....W..\n......W.\n.......W'];
            },
            solve: (inp) => { const p = toks(inp); const wr = Array(8).fill(0), kl = Array(8).fill(0); for (let w = 0; w < 8; w++) for (let k = 0; k < 8; k++) if (p[w][k] === 'W') { wr[w]++; kl[k]++; } let s = 0; for (let i = 0; i < 8; i++) { if (wr[i]) s += wr[i] - 1; if (kl[i]) s += kl[i] - 1; } return String(s); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string p[8];
    for (int w = 0; w < 8; w++) {
        cin >> p[w];
    }
    int wiersz[8] = {}, kolumna[8] = {};
    for (int w = 0; w < 8; w++) {
        for (int k = 0; k < 8; k++) {
            if (p[w][k] == 'W') {
                wiersz[w]++;
                kolumna[k]++;
            }
        }
    }
    int pary = 0;
    for (int i = 0; i < 8; i++) {
        if (wiersz[i] > 0) {
            pary += wiersz[i] - 1;
        }
        if (kolumna[i] > 0) {
            pary += kolumna[i] - 1;
        }
    }
    cout << pary << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-kino', krok: 9, level: 'latwe',
            title: 'Rezerwacje w kinie',
            short: 'Sala kinowa to tablica dwuwymiarowa. Przyjmuj rezerwacje miejsc i odrzucaj zajęte.',
            tags: ['bool zajete[][]', 'rząd i miejsce', 'licznik wolnych'],
            statement: ['Sala kinowa ma r rzędów po s miejsc; rzędy i miejsca numerujemy od 1. Na początku wszystkie miejsca są wolne. Przychodzi q próśb o rezerwację, każda z numerem rzędu i miejsca. Dla każdej prośby wypisz OK, jeśli miejsce było wolne (od teraz jest zajęte), albo ZAJETE, jeśli ktoś już je zarezerwował. Na końcu wypisz, ile miejsc zostało wolnych.'],
            input_format: ['W pierwszym wierszu liczby r, s i q.', 'W każdym z kolejnych q wierszy numer rzędu i numer miejsca.'],
            output_format: ['q wierszy OK albo ZAJETE, a na końcu liczba wolnych miejsc.'],
            constraints: ['1 ≤ r, s ≤ 100', '1 ≤ q ≤ 10 000'],
            examples: [{ input: '3 4 4\n1 1\n2 3\n1 1\n3 4' }],
            hint: R`bool zajete[101][101] = {}; — numeruj od 1, wtedy rząd i miejsce wskazują pudełko bez odejmowania. Przy każdej prośbie: jeśli zajete[rz][m], wypisz ZAJETE; w przeciwnym razie zaznacz miejsce, wypisz OK i zmniejsz licznik wolnych miejsc (na start r · s).`,
            tests: (r) => {
                const mk = (rr, s, q) => `${rr} ${s} ${q}\n${Array.from({ length: q }, () => `${r.int(1, rr)} ${r.int(1, s)}`).join('\n')}`;
                return ['3 4 4\n1 1\n2 3\n1 1\n3 4', '1 1 2\n1 1\n1 1', mk(100, 100, 5000), mk(5, 5, 60), mk(1, 30, 40), mk(10, 10, 100)];
            },
            solve: (inp) => { const v = nums(inp); const [rr, s, q] = v; const z = new Set(); const o = []; for (let j = 0; j < q; j++) { const key = `${v[3 + 2 * j]},${v[4 + 2 * j]}`; if (z.has(key)) o.push('ZAJETE'); else { z.add(key); o.push('OK'); } } o.push(String(rr * s - z.size)); return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    bool zajete[101][101] = {};
    int r, s, q;
    cin >> r >> s >> q;
    int wolne = r * s;
    for (int j = 0; j < q; j++) {
        int rz, m;
        cin >> rz >> m;
        if (zajete[rz][m]) {
            cout << "ZAJETE\n";
        } else {
            zajete[rz][m] = true;
            wolne--;
            cout << "OK\n";
        }
    }
    cout << wolne << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-lista-zakupow', krok: 9, level: 'latwe',
            title: 'Lista zakupów',
            short: 'Cennik w tablicach równoległych: nazwy i ceny. Policz koszt listy zakupów, szukając każdej nazwy.',
            tags: ['tablice równoległe', 'szukanie napisu', 'grosze'],
            statement: ['W sklepie jest n produktów — każdy ma nazwę i cenę w groszach. Na liście zakupów jest m nazw (każda pozycja listy to jedna sztuka, a ta sama nazwa może pojawić się na liście kilka razy). Policz łączny koszt zakupów i wypisz go w postaci ZŁ.GR, z dwiema cyframi groszy. Jeśli jakiegoś produktu z listy nie ma w sklepie, wypisz zamiast tego słowo BRAK i nazwę pierwszego takiego produktu z listy.'],
            input_format: ['W pierwszym wierszu liczba n, a w każdym z kolejnych n wierszy nazwa produktu i cena.', 'Potem liczba m i m nazw z listy, każda w osobnym wierszu.'],
            output_format: ['Kwota ZŁ.GR albo BRAK i nazwa brakującego produktu.'],
            constraints: ['1 ≤ n, m ≤ 100', '1 ≤ cena ≤ 100 000', 'Nazwy produktów w sklepie są różne i mają od 1 do 20 małych liter.'],
            examples: [
                { input: '3\nchleb 450\nmleko 329\nser 1299\n4\nmleko\nchleb\nmleko\nser', note: '329 + 450 + 329 + 1299 = 2407 groszy.' },
                { input: '2\njablko 99\ngruszka 120\n2\ngruszka\nkiwi' },
            ],
            hint: R`Dwie tablice równoległe: string nazwa[100] i int cena[100]. Dla każdej pozycji z listy szukaj jej nazwy w tablicy nazwa (napisy porównujesz znakiem ==). Gdy jej nie ma, zapamiętaj ją jako pierwszą brakującą — jeśli żadnej jeszcze nie zapamiętałeś. Kwotę wypisz jak w zadaniu z cennikiem: złote, kropka i dwie cyfry groszy.`,
            tests: (r) => {
                const PROD = ['chleb', 'mleko', 'ser', 'maslo', 'jajka', 'jablka', 'banany', 'kawa', 'herbata', 'cukier', 'maka', 'ryz', 'makaron', 'sok', 'woda', 'jogurt', 'szynka', 'pomidory', 'ogorki', 'cebula'];
                const mk = (n, m, brak) => { const sk = r.shuffle(PROD).slice(0, n); const ceny = sk.map(() => r.int(1, 100000)); const lista = Array.from({ length: m }, () => r.pick(sk)); if (brak) lista[r.int(0, m - 1)] = 'kiwi'; return `${n}\n${sk.map((x, i) => `${x} ${ceny[i]}`).join('\n')}\n${m}\n${lista.join('\n')}`; };
                return ['3\nchleb 450\nmleko 329\nser 1299\n4\nmleko\nchleb\nmleko\nser', '2\njablko 99\ngruszka 120\n2\ngruszka\nkiwi', '1\nwoda 5\n1\nwoda', mk(20, 100, false), mk(20, 100, true), mk(5, 10, false), '2\na 1\nb 2\n3\nc\na\nd'];
            },
            solve: (inp) => {
                const t = toks(inp); let p = 0; const n = Number(t[p++]); const c = new Map(); for (let i = 0; i < n; i++) { c.set(t[p], Number(t[p + 1])); p += 2; }
                const m = Number(t[p++]); let s = 0; for (let j = 0; j < m; j++) { const x = t[p++]; if (!c.has(x)) return `BRAK ${x}`; s += c.get(x); }
                return `${Math.floor(s / 100)}.${p2(s % 100)}`;
            },
            cpp: R`
#include <iostream>
#include <iomanip>
#include <string>
using namespace std;
int main() {
    string nazwa[100];
    int cena[100];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> nazwa[i] >> cena[i];
    }
    int m;
    cin >> m;
    long long suma = 0;
    string brakuje = "";
    for (int j = 0; j < m; j++) {
        string x;
        cin >> x;
        int gdzie = -1;
        for (int i = 0; i < n; i++) {
            if (nazwa[i] == x) {
                gdzie = i;
                break;
            }
        }
        if (gdzie == -1) {
            if (brakuje == "") {
                brakuje = x;
            }
        } else {
            suma += cena[gdzie];
        }
    }
    if (brakuje != "") {
        cout << "BRAK " << brakuje << "\n";
    } else {
        cout << suma / 100 << "." << setw(2) << setfill('0') << suma % 100 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-pionek', krok: 9, level: 'latwe',
            title: 'Pionek na planszy',
            short: 'Pionek chodzi po planszy według liter G, D, L, P i nie wchodzi na ściany ani poza planszę.',
            tags: ['plansza ze znaków', 'kierunki', 'sprawdzanie brzegu'],
            statement: ['Plansza ma n wierszy i m kolumn: kropka to wolne pole, # to ściana, a S to pole startowe pionka (też wolne). Pionek wykonuje po kolei ruchy zapisane w napisie z liter: G — w górę, D — w dół, L — w lewo, P — w prawo. Jeśli pole, na które pionek ma wejść, jest ścianą albo leży poza planszą, pionek stoi w miejscu i przechodzi do następnego ruchu. Wypisz numer wiersza i kolumny (od 1) pola, na którym pionek kończy, oraz ile ruchów udało się wykonać.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m znaków planszy (dokładnie jedno S).', 'W ostatnim wierszu napis z ruchami.'],
            output_format: ['Trzy liczby: wiersz, kolumna i liczba udanych ruchów.'],
            constraints: ['1 ≤ n, m ≤ 100', 'Napis z ruchami ma od 1 do 10 000 liter.'],
            examples: [{ input: '3 4\nS..#\n.#..\n....\nPPPDDLG', note: 'Trzeci ruch (P) i ostatni (G) trafiają na ściany. Pionek kończy w wierszu 3, kolumnie 2 po 5 udanych ruchach.' }],
            hint: R`Plansza jako string p[100]; najpierw znajdź pole S. Dla każdego ruchu policz nowe pole (nw, nk) — dla G to wiersz o jeden mniej, dla D o jeden więcej, dla L i P zmienia się kolumna. Przesuń pionek tylko wtedy, gdy nw >= 0 && nw < n && nk >= 0 && nk < m && p[nw][nk] != '#'.`,
            tests: (r) => {
                const mk = (n, m, g, len) => { const p = plansza(r, n, m, () => (r() < g ? '#' : '.')).map((w) => w.split('')); p[r.int(0, n - 1)][r.int(0, m - 1)] = 'S'; return `${n} ${m}\n${p.map((w) => w.join('')).join('\n')}\n${r.word(len, 'GDLP')}`; };
                return ['3 4\nS..#\n.#..\n....\nPPPDDLG', '1 1\nS\nGDLP', '2 2\nS.\n..\nPDLG', mk(100, 100, 0.2, 10000), mk(10, 10, 0.4, 200), mk(1, 30, 0.1, 50), mk(30, 1, 0.1, 50)];
            },
            solve: (inp) => {
                const t = toks(inp); const n = Number(t[0]), m = Number(t[1]); const p = t.slice(2, 2 + n); const ruchy = t[2 + n];
                let w = 0, k = 0; for (let a = 0; a < n; a++) for (let b = 0; b < m; b++) if (p[a][b] === 'S') { w = a; k = b; }
                const D = { G: [-1, 0], D: [1, 0], L: [0, -1], P: [0, 1] }; let ok = 0;
                for (const c of ruchy) { const nw = w + D[c][0], nk = k + D[c][1]; if (nw >= 0 && nw < n && nk >= 0 && nk < m && p[nw][nk] !== '#') { w = nw; k = nk; ok++; } }
                return `${w + 1} ${k + 1} ${ok}`;
            },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string p[100];
    int n, m;
    cin >> n >> m;
    for (int w = 0; w < n; w++) {
        cin >> p[w];
    }
    string ruchy;
    cin >> ruchy;
    int w = 0, k = 0;
    for (int a = 0; a < n; a++) {
        for (int b = 0; b < m; b++) {
            if (p[a][b] == 'S') {
                w = a;
                k = b;
            }
        }
    }
    int udane = 0;
    for (int i = 0; i < ruchy.length(); i++) {
        int nw = w, nk = k;
        if (ruchy[i] == 'G') nw--;
        if (ruchy[i] == 'D') nw++;
        if (ruchy[i] == 'L') nk--;
        if (ruchy[i] == 'P') nk++;
        if (nw >= 0 && nw < n && nk >= 0 && nk < m && p[nw][nk] != '#') {
            w = nw;
            k = nk;
            udane++;
        }
    }
    cout << w + 1 << " " << k + 1 << " " << udane << "\n";
    return 0;
}`,
        },

        // ================================================================ ŚREDNIE
        {
            id: 'tab-b-medalisci', krok: 9, level: 'srednie',
            title: 'Medaliści',
            short: 'Z n zawodników wybierz trzech z najlepszymi wynikami — trzy razy szukaj maksimum wśród niewybranych.',
            tags: ['tablice równoległe', 'bool wybrany[]', 'trzy maksima'],
            statement: ['W konkursie wzięło udział n zawodników; każdy ma imię i wynik w punktach, a wszystkie wyniki są różne. Wypisz podium: w pierwszym wierszu 1. i imię zwycięzcy, w drugim 2. i imię zawodnika z drugim wynikiem, a w trzecim 3. i imię trzeciego.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy imię i wynik.'],
            output_format: ['Trzy wiersze: 1. imię, 2. imię, 3. imię.'],
            constraints: ['3 ≤ n ≤ 1000', '0 ≤ wynik ≤ 10⁹', 'Wszystkie wyniki są różne.'],
            examples: [{ input: '5\nOla 17\nJan 23\nEwa 19\nIgor 5\nZosia 21' }],
            hint: R`Imiona i wyniki trzymaj w tablicach równoległych, a do tego tablica bool wybrany[1000] = {};. Trzy razy powtórz: znajdź indeks największego wyniku wśród niewybranych zawodników, wypisz go z numerem miejsca i zaznacz wybrany[naj] = true.`,
            tests: (r) => {
                const mk = (n, hi) => { const w = new Set(); while (w.size < n) w.add(r.int(0, hi)); const ws = r.shuffle([...w]); return `${n}\n${ws.map((x, i) => `${r.pick(IMIONA)}${i} ${x}`).join('\n')}`; };
                return ['5\nOla 17\nJan 23\nEwa 19\nIgor 5\nZosia 21', '3\nA 1\nB 2\nC 3', '3\nC 3\nB 2\nA 1', mk(1000, 1e9), mk(10, 20), mk(50, 1000)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const z = []; for (let i = 0; i < n; i++) z.push([t[1 + 2 * i], Number(t[2 + 2 * i])]); z.sort((a, b) => b[1] - a[1]); return z.slice(0, 3).map((x, i) => `${i + 1}. ${x[0]}`).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string imie[1000];
    int wynik[1000];
    bool wybrany[1000] = {};
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> imie[i] >> wynik[i];
    }
    for (int miejsce = 1; miejsce <= 3; miejsce++) {
        int naj = -1;
        for (int i = 0; i < n; i++) {
            if (!wybrany[i] && (naj == -1 || wynik[i] > wynik[naj])) {
                naj = i;
            }
        }
        wybrany[naj] = true;
        cout << miejsce << ". " << imie[naj] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-statki', krok: 9, level: 'srednie',
            title: 'Statki',
            short: 'Ile statków stoi na planszy? Licz tylko „dzioby” — górne lewe pola statków.',
            tags: ['plansza ze znaków', 'sąsiad z góry i z lewej', 'licznik'],
            statement: ['Na planszy n × m rozstawiono statki. Każdy statek to prosty odcinek pól oznaczonych # — poziomy albo pionowy, o długości co najmniej 1. Statki nie stykają się ze sobą ani bokami, ani rogami. Policz statki. Wskazówka: każdy statek ma dokładnie jedno pole, nad którym i na lewo od którego nie ma innego pola tego statku.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m znaków: # albo kropka.'],
            output_format: ['Jedna liczba — liczba statków.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '4 5\n##..#\n....#\n.#...\n...##', note: 'Statki: poziomy w wierszu 1 (dwa pola), pionowy w kolumnie 5 (dwa pola), jednomasztowiec w wierszu 3 i poziomy w wierszu 4.' }],
            hint: R`Pole (w, k) z # jest początkiem statku, gdy pole nad nim (jeśli w ogóle istnieje) i pole na lewo od niego (jeśli istnieje) nie są #. Policz takie pola. Pamiętaj, żeby przy w = 0 albo k = 0 nie zaglądać poza planszę — z lekcji wiesz, że najpierw sprawdzasz brzeg.`,
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return statkiPoprawne(t.slice(2, 2 + n)) ? null : 'statki się stykają albo są krzywe'; },
            tests: (r) => {
                const mk = (n, m, prob) => `${n} ${m}\n${statki(r, n, m, prob).join('\n')}`;
                return ['4 5\n##..#\n....#\n.#...\n...##', '1 1\n.', '1 1\n#', '1 7\n##.#.##', '5 1\n#\n#\n.\n#\n.', mk(100, 100, 3000), mk(20, 30, 200), mk(10, 10, 30)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]), m = Number(t[1]); const p = t.slice(2, 2 + n); let c = 0; for (let w = 0; w < n; w++) for (let k = 0; k < m; k++) if (p[w][k] === '#' && (w === 0 || p[w - 1][k] !== '#') && (k === 0 || p[w][k - 1] !== '#')) c++; return String(c); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string p[100];
    int n, m;
    cin >> n >> m;
    for (int w = 0; w < n; w++) {
        cin >> p[w];
    }
    int statki = 0;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (p[w][k] == '#') {
                bool gora = (w > 0 && p[w - 1][k] == '#');
                bool lewo = (k > 0 && p[w][k - 1] == '#');
                if (!gora && !lewo) {
                    statki++;
                }
            }
        }
    }
    cout << statki << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-kwadrat-magiczny', krok: 9, level: 'srednie',
            title: 'Kwadrat magiczny',
            short: 'Sprawdź sumy wierszy, kolumn i przekątnych — i czy liczby od 1 do n² są użyte po razie.',
            tags: ['sumy wierszy i kolumn', 'przekątne', 'bool uzyta[]'],
            statement: ['Kwadrat magiczny to tabelka n × n, w której stoją wszystkie liczby od 1 do n², każda dokładnie raz, a sumy w każdym wierszu, w każdej kolumnie i na obu przekątnych są równe. Wczytaj tabelkę i wypisz TAK, jeśli to kwadrat magiczny, albo NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy n liczb.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ każda liczba ≤ 10 000'],
            examples: [{ input: '3\n2 7 6\n9 5 1\n4 3 8', note: 'Każda suma to 15.' }, { input: '3\n5 5 5\n5 5 5\n5 5 5', note: 'Sumy są równe, ale liczby od 1 do 9 nie są użyte.' }],
            hint: R`Dwie rzeczy do sprawdzenia. Liczby: tablica bool uzyta[10001] = {}; — każda liczba musi być od 1 do n² i nie może się powtórzyć. Sumy: policz sumę pierwszego wiersza jako wzór i porównaj z nią każdy wiersz, każdą kolumnę i obie przekątne.`,
            tests: (r) => {
                const zmien = (t) => { const u = t.map((w) => w.slice()); const a = r.int(0, u.length - 1), b = r.int(0, u.length - 1), c = r.int(0, u.length - 1), d = r.int(0, u.length - 1); [u[a][b], u[c][d]] = [u[c][d], u[a][b]]; return u; };
                const odwroc = (t) => t.map((w) => w.slice().reverse());
                return ['3\n2 7 6\n9 5 1\n4 3 8', '3\n5 5 5\n5 5 5\n5 5 5', '1\n1', '1\n2', '2\n1 2\n3 4', kwIn(magiczny(4)), kwIn(odwroc(magiczny(5))), kwIn(magiczny(51)), kwIn(zmien(magiczny(51))), kwIn(magiczny(48)), kwIn(zmien(magiczny(8))), kwIn(magiczny(7).map((w) => w.map((x) => x + 1)))];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const t = []; for (let w = 0; w < n; w++) t.push(v.slice(1 + w * n, 1 + (w + 1) * n)); return czyMagiczny(t) ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int t[100][100];
int main() {
    int n;
    cin >> n;
    bool uzyta[10001] = {};
    bool ok = true;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < n; k++) {
            cin >> t[w][k];
            int x = t[w][k];
            if (x < 1 || x > n * n || uzyta[x]) {
                ok = false;
            } else {
                uzyta[x] = true;
            }
        }
    }
    int wzor = 0;
    for (int k = 0; k < n; k++) {
        wzor += t[0][k];
    }
    for (int i = 0; i < n; i++) {
        int sw = 0, sk = 0;
        for (int j = 0; j < n; j++) {
            sw += t[i][j];
            sk += t[j][i];
        }
        if (sw != wzor || sk != wzor) {
            ok = false;
        }
    }
    int d1 = 0, d2 = 0;
    for (int i = 0; i < n; i++) {
        d1 += t[i][i];
        d2 += t[i][n - 1 - i];
    }
    if (d1 != wzor || d2 != wzor) {
        ok = false;
    }
    if (ok) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-sudoku', krok: 9, level: 'srednie',
            title: 'Sprawdź sudoku',
            short: 'Czy wypełnione sudoku jest poprawne? Wiersze, kolumny i kwadraty 3 × 3 — każdy z cyframi od 1 do 9.',
            tags: ['tablica 9 × 9', 'bool bylo[10]', 'kwadraty 3 × 3'],
            statement: ['Wczytaj całkowicie wypełnioną planszę sudoku: 9 wierszy po 9 cyfr od 1 do 9. Plansza jest poprawna, gdy w każdym wierszu, w każdej kolumnie i w każdym z dziewięciu kwadratów 3 × 3 każda cyfra od 1 do 9 występuje dokładnie raz. Wypisz TAK albo NIE.'],
            input_format: ['9 wierszy po 9 cyfr oddzielonych spacjami.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['Każda liczba na planszy to cyfra od 1 do 9.'],
            examples: [
                { input: '5 3 4 6 7 8 9 1 2\n6 7 2 1 9 5 3 4 8\n1 9 8 3 4 2 5 6 7\n8 5 9 7 6 1 4 2 3\n4 2 6 8 5 3 7 9 1\n7 1 3 9 2 4 8 5 6\n9 6 1 5 3 7 2 8 4\n2 8 7 4 1 9 6 3 5\n3 4 5 2 8 6 1 7 9' },
                { input: '1 2 3 4 5 6 7 8 9\n2 3 4 5 6 7 8 9 1\n3 4 5 6 7 8 9 1 2\n4 5 6 7 8 9 1 2 3\n5 6 7 8 9 1 2 3 4\n6 7 8 9 1 2 3 4 5\n7 8 9 1 2 3 4 5 6\n8 9 1 2 3 4 5 6 7\n9 1 2 3 4 5 6 7 8', note: 'Wiersze i kolumny są dobre, ale w lewym górnym kwadracie 3 × 3 powtarzają się cyfry.' },
            ],
            hint: R`Dla każdego z 27 obszarów (9 wierszy, 9 kolumn i 9 kwadratów) wyzeruj tablicę bool bylo[10] i przejdź po jego polach: jeśli cyfra już była — plansza jest zła. Kwadrat numer (kw, kk), gdzie kw i kk są od 0 do 2, zaczyna się w wierszu 3 · kw i kolumnie 3 · kk.`,
            tests: (r) => {
                const sIn = (t) => t.map(lin).join('\n');
                const zamienWWierszu = (t) => { const u = t.map((w) => w.slice()); const w = r.int(0, 8), a = r.int(0, 8); let b = r.int(0, 8); while (b === a) b = r.int(0, 8); [u[w][a], u[w][b]] = [u[w][b], u[w][a]]; return u; };
                const jednaZmiana = (t) => { const u = t.map((w) => w.slice()); const w = r.int(0, 8), k = r.int(0, 8); u[w][k] = (u[w][k] % 9) + 1; return u; };
                const przesuniety = Array.from({ length: 9 }, (_, w) => Array.from({ length: 9 }, (_, k) => ((w + k) % 9) + 1));
                return [sIn(sudoku(r)), sIn(sudoku(r)), sIn(zamienWWierszu(sudoku(r))), sIn(jednaZmiana(sudoku(r))), sIn(przesuniety), sIn(Array(9).fill(Array(9).fill(5))), sIn(sudoku(r)), sIn(zamienWWierszu(sudoku(r)))];
            },
            solve: (inp) => { const v = nums(inp); const t = []; for (let w = 0; w < 9; w++) t.push(v.slice(w * 9, w * 9 + 9)); return sudokuOk(t) ? 'TAK' : 'NIE'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[9][9];
    for (int w = 0; w < 9; w++) {
        for (int k = 0; k < 9; k++) {
            cin >> t[w][k];
        }
    }
    bool ok = true;
    for (int i = 0; i < 9; i++) {
        bool wiersz[10] = {}, kolumna[10] = {};
        for (int j = 0; j < 9; j++) {
            if (wiersz[t[i][j]]) ok = false;
            wiersz[t[i][j]] = true;
            if (kolumna[t[j][i]]) ok = false;
            kolumna[t[j][i]] = true;
        }
    }
    for (int kw = 0; kw < 3; kw++) {
        for (int kk = 0; kk < 3; kk++) {
            bool bylo[10] = {};
            for (int w = 3 * kw; w < 3 * kw + 3; w++) {
                for (int k = 3 * kk; k < 3 * kk + 3; k++) {
                    if (bylo[t[w][k]]) ok = false;
                    bylo[t[w][k]] = true;
                }
            }
        }
    }
    if (ok) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-lider', krok: 9, level: 'srednie',
            title: 'Lider ciągu',
            short: 'Czy któraś wartość zajmuje ponad połowę ciągu? Liczby są duże, więc tablica liczników odpada.',
            tags: ['liczenie wystąpień', 'więcej niż połowa', 'BRAK'],
            statement: ['Liderem ciągu n liczb nazywamy wartość, która występuje w nim więcej niż n / 2 razy — ściśle więcej niż połowa wszystkich liczb. Ciąg może mieć co najwyżej jednego lidera. Wypisz lidera albo BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Lider albo BRAK.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [
                { input: '7\n3 9 3 3 5 3 9', note: 'Trójka występuje 4 razy, a 4 to więcej niż połowa z 7.' },
                { input: '4\n1 1 2 2', note: 'Jedynka występuje 2 razy — to dokładnie połowa, a nie więcej.' },
            ],
            hint: R`Liczby są za duże na tablicę liczników, ale n jest małe: dla każdej liczby t[i] policz pętlą, ile razy występuje w całym ciągu. Jeśli więcej niż połowa (sprawdzaj ile * 2 > n, żeby uniknąć dzielenia), to jest lider. Dla ciekawych: istnieje sprytny sposób jednym przejściem — algorytm Boyera i Moore’a.`,
            tests: (r) => {
                const zLiderem = (n, lider) => { const k = Math.floor(n / 2) + 1; const a = Array(k).fill(lider).concat(r.arr(n - k, -1e9, 1e9)); return r.shuffle(a); };
                const polowa = (n) => r.shuffle(Array(n / 2).fill(7).concat(r.arr(n / 2, 8, 100)));
                return ['7\n3 9 3 3 5 3 9', '4\n1 1 2 2', '1\n-5', '2\n4 4', '3\n1 2 3', arrIn(zLiderem(1000, 123456789)), arrIn(polowa(1000)), arrIn(r.arr(1000, 1, 3)), arrIn(zLiderem(999, -1e9))];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); const c = new Map(); for (const x of t) c.set(x, (c.get(x) || 0) + 1); for (const [x, k] of c) if (k * 2 > n) return String(x); return 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    for (int i = 0; i < n; i++) {
        int ile = 0;
        for (int j = 0; j < n; j++) {
            if (t[j] == t[i]) {
                ile++;
            }
        }
        if (ile * 2 > n) {
            cout << t[i] << "\n";
            return 0;
        }
    }
    cout << "BRAK\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-cieplejszy-dzien', krok: 9, level: 'srednie',
            title: 'Kiedy będzie cieplej?',
            short: 'Dla każdego dnia policz, ile dni trzeba czekać na wyższą temperaturę.',
            tags: ['pętla w pętli', 'szukanie w prawo', 'break'],
            statement: ['Wczytaj temperatury z n kolejnych dni. Dla każdego dnia wypisz, ile dni trzeba czekać na pierwszy dzień z temperaturą ściśle wyższą. Jeśli taki dzień już nie nastąpi, wypisz 0.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n temperatur.'],
            output_format: ['Jeden wiersz z n liczbami.'],
            constraints: ['1 ≤ n ≤ 1000', '−50 ≤ temperatura ≤ 50'],
            examples: [{ input: '8\n3 1 4 1 5 9 2 6', note: 'Po dniu 1 (3 stopnie) cieplej jest dopiero w dniu 3 — czekamy 2 dni. Po dniu 6 (9 stopni) cieplej już nie będzie.' }],
            hint: R`Dla każdego dnia i przejdź pętlą po dniach j = i + 1, i + 2, …, aż trafisz na t[j] > t[i] — wtedy odpowiedź to j - i i przerywasz pętlę przez break. Jeśli pętla dojdzie do końca bez trafienia, odpowiedź to 0. Przy n ≤ 1000 to najwyżej pół miliona obrotów.`,
            tests: (r) => ['8\n3 1 4 1 5 9 2 6', '1\n0', '3\n5 5 5', '4\n1 2 3 4', '4\n4 3 2 1', arrIn(r.arr(1000, -50, 50)), arrIn(Array.from({ length: 1000 }, (_, i) => 50 - Math.floor(i / 10))), arrIn(r.arr(25, -3, 3))],
            solve: (inp) => { const v = nums(inp); const n = v[0], t = v.slice(1, 1 + n); const o = []; for (let i = 0; i < n; i++) { let d = 0; for (let j = i + 1; j < n; j++) if (t[j] > t[i]) { d = j - i; break; } o.push(d); } return lin(o); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[1000];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i];
    }
    for (int i = 0; i < n; i++) {
        int czekaj = 0;
        for (int j = i + 1; j < n; j++) {
            if (t[j] > t[i]) {
                czekaj = j - i;
                break;
            }
        }
        cout << czekaj << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-blizniacze', krok: 9, level: 'srednie',
            title: 'Liczby bliźniacze',
            short: 'Pary liczb pierwszych różniących się o 2: ile ich jest do n i która para jest największa?',
            tags: ['sito', 'p i p + 2', 'tablica globalna'],
            statement: ['Liczby bliźniacze to dwie liczby pierwsze różniące się o 2, na przykład 3 i 5, 11 i 13 albo 17 i 19. Wczytaj n i wypisz, ile jest par liczb bliźniaczych p, p + 2, w których obie liczby są nie większe od n. W drugim wierszu wypisz największą taką parę albo BRAK, jeśli nie ma żadnej.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['W pierwszym wierszu liczba par, w drugim największa para albo BRAK.'],
            constraints: ['1 ≤ n ≤ 10⁶'],
            examples: [{ input: '20', note: 'Pary: (3, 5), (5, 7), (11, 13) i (17, 19).' }, { input: '4' }],
            hint: R`Przesiej liczby do n sitem Eratostenesa (globalna tablica bool). Potem dla każdego p od 2 do n - 2 sprawdź, czy p i p + 2 są pierwsze — licz takie pary i zapamiętuj ostatnią znalezioną.`,
            tests: (r) => ['20', '4', '1', '5', '7', '1000000', '999999', String(r.int(1, 1e6)), String(r.int(1, 1000)), '100'],
            solve: (inp) => { const n = nums(inp)[0]; let c = 0, last = -1; for (let p = 2; p + 2 <= n; p++) if (!Z6[p] && !Z6[p + 2]) { c++; last = p; } return `${c}\n${last < 0 ? 'BRAK' : `${last} ${last + 2}`}`; },
            cpp: R`
#include <iostream>
using namespace std;
const int MAX = 1000001;
bool zlozona[MAX];
int main() {
    int n;
    cin >> n;
    for (int i = 2; i <= n; i++) {
        if (!zlozona[i]) {
            for (int j = 2 * i; j <= n; j += i) {
                zlozona[j] = true;
            }
        }
    }
    int pary = 0, ostatnia = -1;
    for (int p = 2; p + 2 <= n; p++) {
        if (!zlozona[p] && !zlozona[p + 2]) {
            pary++;
            ostatnia = p;
        }
    }
    cout << pary << "\n";
    if (ostatnia == -1) {
        cout << "BRAK\n";
    } else {
        cout << ostatnia << " " << ostatnia + 2 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-mediana', krok: 9, level: 'srednie',
            title: 'Mediana z liczników',
            short: 'Znajdź środkową wartość po uporządkowaniu — bez sortowania, idąc po licznikach.',
            tags: ['tablica liczników', 'suma liczników', 'środkowy element'],
            statement: ['Mediana nieparzystej liczby wartości to wartość, która stanęłaby na środku, gdyby ustawić je od najmniejszej do największej. Wczytaj n wyników (n jest nieparzyste) — liczby od 0 do 1000 — i wypisz ich medianę.'],
            input_format: ['W pierwszym wierszu nieparzysta liczba n.', 'W drugim wierszu n wyników.'],
            output_format: ['Jedna liczba — mediana.'],
            constraints: ['1 ≤ n ≤ 100 000, n nieparzyste', '0 ≤ wynik ≤ 1000'],
            examples: [{ input: '7\n5 1 9 1 7 3 8', note: 'Po uporządkowaniu: 1 1 3 5 7 8 9 — na środku stoi 5.' }],
            hint: R`Policz wystąpienia w tablicy int ile[1001] = {};. Mediana to element numer (n + 1) / 2 w kolejności rosnącej. Idź po wartościach od 0 w górę, dodając ich liczniki do sumy — pierwsza wartość, przy której suma osiągnie (n + 1) / 2, jest medianą.`,
            check: (inp) => (nums(inp)[0] % 2 === 1 ? null : 'parzyste n'),
            tests: (r) => ['7\n5 1 9 1 7 3 8', '1\n1000', '3\n0 0 1', '5\n4 4 4 4 4', arrIn(r.arr(9999, 0, 1000)), arrIn(r.arr(9999, 0, 2)), arrIn(r.arr(21, 0, 30)), arrIn(Array(500).fill(0).concat(Array(501).fill(1000)))],
            solve: (inp) => { const v = nums(inp); const t = v.slice(1, 1 + v[0]).sort((a, b) => a - b); return String(t[(v[0] - 1) / 2]); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int ile[1001] = {};
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        ile[x]++;
    }
    int suma = 0;
    for (int v = 0; v <= 1000; v++) {
        suma += ile[v];
        if (suma >= (n + 1) / 2) {
            cout << v << "\n";
            break;
        }
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-wywiadowka', krok: 9, level: 'srednie',
            title: 'Wywiadówka',
            short: 'Tabelka ocen uczniów: najlepszy uczeń, najtrudniejszy przedmiot i lista zagrożonych.',
            tags: ['tablica 2D', 'sumy wierszy i kolumn', 'tablice równoległe'],
            statement: [
                'Wychowawca ma tabelkę ocen: n uczniów, a każdy ma po jednej ocenie (od 1 do 6) z każdego z m przedmiotów. Wypisz trzy wiersze:',
                '1) imię ucznia z największą sumą ocen (przy remisie — pierwszego z listy);',
                '2) numer przedmiotu (od 1) z najmniejszą sumą ocen, czyli najtrudniejszego (przy remisie — pierwszego);',
                '3) imiona uczniów, którzy mają co najmniej jedną jedynkę, w kolejności z listy — albo BRAK.',
            ],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy imię ucznia i m ocen.'],
            output_format: ['Trzy wiersze opisane w treści.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ m ≤ 20'],
            examples: [{ input: '3 4\nOla 5 4 6 5\nJan 3 1 4 2\nEwa 6 2 5 1', note: 'Sumy uczniów: 20, 10 i 14. Sumy przedmiotów: 14, 7, 15 i 8 — najtrudniejszy jest drugi.' }],
            hint: R`Imiona w string imie[100], oceny w int t[100][20]. Sumy wierszy dają najlepszego ucznia, sumy kolumn — najtrudniejszy przedmiot (pętle zamienione miejscami). Do jedynek wystarczy flaga bool ustawiana w pętli po przedmiotach jednego ucznia.`,
            tests: (r) => {
                const mk = (n, m, lo) => `${n} ${m}\n${Array.from({ length: n }, (_, i) => `${r.pick(IMIONA)}${i} ${lin(r.arr(m, lo, 6))}`).join('\n')}`;
                return ['3 4\nOla 5 4 6 5\nJan 3 1 4 2\nEwa 6 2 5 1', '1 1\nSam 1', '2 2\nA 6 6\nB 6 6', mk(100, 20, 1), mk(30, 5, 2), mk(10, 3, 1)];
            },
            solve: (inp) => {
                const t = toks(inp); const n = Number(t[0]), m = Number(t[1]); const im = [], o = []; let p = 2;
                for (let i = 0; i < n; i++) { im.push(t[p++]); o.push(t.slice(p, p + m).map(Number)); p += m; }
                const sw = o.map((w) => w.reduce((a, b) => a + b, 0)); let bu = 0; for (let i = 1; i < n; i++) if (sw[i] > sw[bu]) bu = i;
                const sk = []; for (let k = 0; k < m; k++) { let s = 0; for (let i = 0; i < n; i++) s += o[i][k]; sk.push(s); } let bk = 0; for (let k = 1; k < m; k++) if (sk[k] < sk[bk]) bk = k;
                const z = im.filter((_, i) => o[i].includes(1));
                return `${im[bu]}\n${bk + 1}\n${z.length ? lin(z) : 'BRAK'}`;
            },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string imie[100];
    int t[100][20];
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < n; i++) {
        cin >> imie[i];
        for (int k = 0; k < m; k++) {
            cin >> t[i][k];
        }
    }
    int najU = 0, najSuma = -1;
    for (int i = 0; i < n; i++) {
        int s = 0;
        for (int k = 0; k < m; k++) {
            s += t[i][k];
        }
        if (s > najSuma) {
            najSuma = s;
            najU = i;
        }
    }
    int najP = 0, minSuma = 1000000;
    for (int k = 0; k < m; k++) {
        int s = 0;
        for (int i = 0; i < n; i++) {
            s += t[i][k];
        }
        if (s < minSuma) {
            minSuma = s;
            najP = k;
        }
    }
    cout << imie[najU] << "\n" << najP + 1 << "\n";
    int zagrozeni = 0;
    for (int i = 0; i < n; i++) {
        bool jedynka = false;
        for (int k = 0; k < m; k++) {
            if (t[i][k] == 1) {
                jedynka = true;
            }
        }
        if (jedynka) {
            cout << imie[i] << " ";
            zagrozeni++;
        }
    }
    if (zagrozeni == 0) {
        cout << "BRAK";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-wykres', krok: 9, level: 'srednie',
            title: 'Wykres słupkowy',
            short: 'Narysuj pionowy wykres słupkowy rzutów kostką — wiersz po wierszu, od góry.',
            tags: ['tablica liczników', 'wiersze od góry', 'pętla w pętli'],
            statement: ['Wczytaj n rzutów kostką (liczby od 1 do 6) i narysuj pionowy wykres słupkowy: kolumna numer i (od lewej) to słupek dla oczka i, a jego wysokość to liczba rzutów z tym oczkiem. Wykres ma tyle wierszy, ile wynosi najwyższy słupek. W każdym wierszu jest 6 znaków: #, jeśli słupek sięga tej wysokości, albo kropka. Pod wykresem wypisz wiersz 123456.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n rzutów.'],
            output_format: ['Wiersze wykresu od góry i wiersz 123456.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '7\n3 6 3 1 3 6 4' }],
            hint: R`Najpierw policz liczniki ile[1] … ile[6] i największy z nich, H. Potem pętla po wysokościach od h = H w dół do 1, a w niej pętla po oczkach od 1 do 6: wypisz #, gdy ile[oczko] >= h, a w przeciwnym razie kropkę.`,
            tests: (r) => ['7\n3 6 3 1 3 6 4', '1\n6', '6\n1 2 3 4 5 6', arrIn(Array(20).fill(2)), arrIn(r.arr(1000, 1, 6)), arrIn(r.arr(30, 1, 6)), arrIn(r.arr(40, 2, 4))],
            solve: (inp) => { const v = nums(inp); const ile = Array(7).fill(0); for (const x of v.slice(1, 1 + v[0])) ile[x]++; const H = Math.max(...ile); const o = []; for (let h = H; h >= 1; h--) { let s = ''; for (let k = 1; k <= 6; k++) s += ile[k] >= h ? '#' : '.'; o.push(s); } o.push('123456'); return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int ile[7] = {};
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        ile[x]++;
    }
    int H = 0;
    for (int k = 1; k <= 6; k++) {
        if (ile[k] > H) {
            H = ile[k];
        }
    }
    for (int h = H; h >= 1; h--) {
        for (int k = 1; k <= 6; k++) {
            if (ile[k] >= h) {
                cout << '#';
            } else {
                cout << '.';
            }
        }
        cout << "\n";
    }
    cout << "123456\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-szyfr-kolumnowy', krok: 9, level: 'srednie',
            title: 'Szyfr kolumnowy',
            short: 'Zapisz tekst wierszami w tabelce o szerokości k, a odczytaj go kolumnami.',
            tags: ['wiersze i kolumny', 'i / k oraz i % k', 'co k-ta litera'],
            statement: ['Szyfr kolumnowy działa tak: tekst wpisujemy do tabelki o szerokości k, wiersz po wierszu, od lewej do prawej (ostatni wiersz może być niepełny). Szyfrogram powstaje przez odczytanie tabelki kolumnami: najpierw cała pierwsza kolumna z góry na dół, potem druga i tak dalej — puste pola ostatniego wiersza pomijamy. Na przykład słowo algorytmika przy k = 4 zapisujemy w trzech wierszach: algo, rytm i ika — a szyfrogram to arilykgtaom. Wczytaj k i słowo, i wypisz szyfrogram.'],
            input_format: ['W pierwszym wierszu liczba k.', 'W drugim wierszu słowo z małych liter.'],
            output_format: ['Jeden wiersz — szyfrogram.'],
            constraints: ['1 ≤ k ≤ 100', 'Słowo ma od 1 do 10 000 liter.'],
            examples: [{ input: '4\nalgorytmika' }, { input: '1\nkot', note: 'Przy szerokości 1 każda litera jest w osobnym wierszu, więc szyfrogram to samo słowo.' }],
            hint: R`Litera z pozycji i (od 0) trafia do wiersza i / k i kolumny i % k — znasz to z lekcji o modulo. Możesz zbudować tabelkę znaków, ale nie musisz: kolumna c to litery z pozycji c, c + k, c + 2k, … — wystarczy pętla po kolumnach, a w niej pętla co k po napisie.`,
            tests: (r) => ['4\nalgorytmika', '1\nkot', '3\nab', '100\nabc', `7\n${r.word(10000)}`, `100\n${r.word(10000)}`, `${r.int(2, 9)}\n${r.word(r.int(10, 60))}`, '5\nabcdefghij'],
            solve: (inp) => { const t = toks(inp); const k = Number(t[0]), s = t[1]; let o = ''; for (let c = 0; c < k; c++) for (let i = c; i < s.length; i += k) o += s[i]; return o; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int k;
    string s;
    cin >> k >> s;
    for (int c = 0; c < k; c++) {
        for (int i = c; i < s.length(); i += k) {
            cout << s[i];
        }
    }
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ TRUDNE
        {
            id: 'tab-b-spirala', krok: 9, level: 'trudne',
            title: 'Spirala',
            short: 'Wypełnij tabelkę liczbami od 1 do n · m po spirali, zgodnie z ruchem wskazówek zegara.',
            tags: ['tablica 2D', 'kierunki w tablicach', 'skręt przy przeszkodzie'],
            statement: ['Wypełnij tabelkę o n wierszach i m kolumnach kolejnymi liczbami od 1 do n · m, idąc po spirali: zaczynasz w lewym górnym rogu i idziesz w prawo, a gdy następne pole wychodzi poza tabelkę albo jest już wypełnione, skręcasz w prawo (w prawo → w dół → w lewo → w górę → w prawo…). Wypisz tabelkę — liczby w wierszu oddzielone spacjami.'],
            input_format: ['Jeden wiersz z liczbami n i m.'],
            output_format: ['n wierszy po m liczb.'],
            constraints: ['1 ≤ n, m ≤ 70'],
            examples: [{ input: '3 4' }, { input: '1 3' }],
            hint: R`Kierunki w tablicach: int dw[4] = {0, 1, 0, -1}, dk[4] = {1, 0, -1, 0}; — prawo, dół, lewo, góra. Trzymaj pozycję (w, k) i numer kierunku d. Dla każdej liczby: wpisz ją, a potem sprawdź następne pole w kierunku d — jeśli wychodzi poza tabelkę albo nie jest zerem (już wypełnione), skręć: d = (d + 1) % 4. Dopiero potem zrób krok.`,
            tests: (r) => ['3 4', '1 3', '1 1', '4 1', '2 2', '5 5', '70 70', `${r.int(2, 30)} ${r.int(2, 30)}`, '7 3'],
            solve: (inp) => {
                const [n, m] = nums(inp); const t = Array.from({ length: n }, () => Array(m).fill(0)); const dw = [0, 1, 0, -1], dk = [1, 0, -1, 0];
                let w = 0, k = 0, d = 0; for (let x = 1; x <= n * m; x++) { t[w][k] = x; const nw = w + dw[d], nk = k + dk[d]; if (nw < 0 || nw >= n || nk < 0 || nk >= m || t[nw][nk]) d = (d + 1) % 4; w += dw[d]; k += dk[d]; }
                return t.map(lin).join('\n');
            },
            cpp: R`
#include <iostream>
using namespace std;
int t[100][100];
int main() {
    int n, m;
    cin >> n >> m;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            t[w][k] = 0;
        }
    }
    int dw[4] = {0, 1, 0, -1};
    int dk[4] = {1, 0, -1, 0};
    int w = 0, k = 0, d = 0;
    for (int x = 1; x <= n * m; x++) {
        t[w][k] = x;
        int nw = w + dw[d], nk = k + dk[d];
        if (nw < 0 || nw >= n || nk < 0 || nk >= m || t[nw][nk] != 0) {
            d = (d + 1) % 4;
        }
        w += dw[d];
        k += dk[d];
    }
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            cout << t[i][j] << " ";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-gra-w-zycie', krok: 9, level: 'trudne',
            title: 'Gra w życie',
            short: 'Symuluj k pokoleń gry w życie Conwaya — z drugą tablicą na nowe pokolenie.',
            tags: ['ośmiu sąsiadów', 'dwie tablice', 'symulacja'],
            statement: [
                'Gra w życie toczy się na planszy n × m. Każda komórka jest żywa (#) albo martwa (kropka). W każdym pokoleniu wszystkie komórki zmieniają się jednocześnie, zależnie od liczby żywych sąsiadów — sąsiadów jest najwyżej ośmiu, przez bok i po skosie, a pola spoza planszy są martwe:',
                'żywa komórka z 2 albo 3 żywymi sąsiadami przeżywa, a z inną liczbą umiera;',
                'martwa komórka z dokładnie 3 żywymi sąsiadami ożywa, a w przeciwnym razie zostaje martwa.',
                'Wypisz planszę po k pokoleniach.',
            ],
            input_format: ['W pierwszym wierszu liczby n, m i k.', 'W każdym z kolejnych n wierszy m znaków: # albo kropka.'],
            output_format: ['Plansza po k pokoleniach.'],
            constraints: ['1 ≤ n, m ≤ 50', '0 ≤ k ≤ 100'],
            examples: [{ input: '5 5 1\n.....\n..#..\n..#..\n..#..\n.....', note: 'Pionowa kreska z trzech komórek po jednym pokoleniu staje się poziomą — i tak w kółko.' }],
            hint: R`Kluczowe słowo: jednocześnie. Nowe pokolenie zapisuj do drugiej tablicy, licząc sąsiadów w starej — a dopiero gdy cała nowa plansza jest gotowa, przepisz ją do starej. Gdybyś zmieniał komórki w miejscu, kolejne komórki liczyłyby sąsiadów z pomieszanych pokoleń.`,
            tests: (r) => {
                const mk = (n, m, k, g) => `${n} ${m} ${k}\n${plansza(r, n, m, () => (r() < g ? '#' : '.')).join('\n')}`;
                const szybowiec = ['..........', '..#.......', '...#......', '.###......', '..........', '..........', '..........', '..........'];
                return ['5 5 1\n.....\n..#..\n..#..\n..#..\n.....', '5 5 2\n.....\n..#..\n..#..\n..#..\n.....', '1 1 5\n#', '2 2 3\n##\n##', `8 10 12\n${szybowiec.join('\n')}`, mk(50, 50, 100, 0.35), mk(20, 30, 7, 0.5), mk(10, 10, 0, 0.5), mk(3, 40, 4, 0.4)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]), k = Number(t[2]); return zycie(t.slice(3, 3 + n), k); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string p[50], nowa[50];
    int n, m, k;
    cin >> n >> m >> k;
    for (int w = 0; w < n; w++) {
        cin >> p[w];
    }
    for (int g = 0; g < k; g++) {
        for (int w = 0; w < n; w++) {
            nowa[w] = p[w];
            for (int c = 0; c < m; c++) {
                int zywe = 0;
                for (int dw = -1; dw <= 1; dw++) {
                    for (int dk = -1; dk <= 1; dk++) {
                        if (dw == 0 && dk == 0) continue;
                        int nw = w + dw, nk = c + dk;
                        if (nw >= 0 && nw < n && nk >= 0 && nk < m && p[nw][nk] == '#') {
                            zywe++;
                        }
                    }
                }
                if (p[w][c] == '#') {
                    nowa[w][c] = (zywe == 2 || zywe == 3) ? '#' : '.';
                } else {
                    nowa[w][c] = (zywe == 3) ? '#' : '.';
                }
            }
        }
        for (int w = 0; w < n; w++) {
            p[w] = nowa[w];
        }
    }
    for (int w = 0; w < n; w++) {
        cout << p[w] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-skarbonki', krok: 9, level: 'trudne',
            title: 'Skarbonki',
            short: 'Wiele operacji „dodaj x do skarbonek od a do b” — tablica różnic i jedna suma prefiksowa na końcu.',
            tags: ['tablica różnic', 'd[a] += x, d[b + 1] -= x', 'sumy prefiksowe'],
            statement: [
                'Na półce stoi n skarbonek ponumerowanych od 1 do n, na początku wszystkie puste. Wykonano q operacji; każda operacja to trzy liczby a, b, x: do każdej skarbonki od a-tej do b-tej włącznie wrzucono x groszy (x może być ujemne — wtedy z każdej z nich tyle wyjęto). Wypisz, ile groszy jest w każdej skarbonce po wszystkich operacjach — liczby mogą wyjść ujemne, to taki „dług”.',
                'Operacji i skarbonek może być bardzo dużo, więc dopisywanie do każdej skarbonki osobno jest za wolne. Użyj tablicy różnic: dla operacji (a, b, x) zrób d[a] += x i d[b + 1] −= x, a na końcu policz sumy prefiksowe tablicy d — suma d[1] + d[2] + … + d[i] to właśnie zawartość skarbonki i.',
            ],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z kolejnych q wierszy trzy liczby a, b i x.'],
            output_format: ['Jeden wiersz z n liczbami — zawartość kolejnych skarbonek.'],
            constraints: ['1 ≤ n, q ≤ 200 000', '1 ≤ a ≤ b ≤ n', '−10⁹ ≤ x ≤ 10⁹'],
            examples: [{ input: '6 3\n1 4 2\n3 6 5\n2 2 -1', note: 'Skarbonki 1–4 dostają po 2 grosze, 3–6 po 5, a ze skarbonki 2 wyjęto grosz: 2 1 7 7 5 5.' }],
            hint: R`Globalna tablica long long d[200005] — o jedno pudełko większa niż n, bo piszesz do d[b + 1]. Po wczytaniu wszystkich operacji idź od 1 do n, trzymając bieżącą sumę: s += d[i], i wypisuj s. Wyniki nie zmieszczą się w int — już trzy wrzutki po miliard groszy dają 3 miliardy — dlatego long long.`,
            check: (inp) => { const v = nums(inp); const n = v[0]; for (let j = 0; j < v[1]; j++) { const a = v[2 + 3 * j], b = v[3 + 3 * j]; if (!(a >= 1 && a <= b && b <= n)) return 'zła operacja'; } return null; },
            tests: (r) => {
                const mk = (n, q, maxX) => `${n} ${q}\n${Array.from({ length: q }, () => { const a = r.int(1, n), b = r.int(1, n); return `${Math.min(a, b)} ${Math.max(a, b)} ${r.int(-maxX, maxX)}`; }).join('\n')}`;
                return ['6 3\n1 4 2\n3 6 5\n2 2 -1', '1 1\n1 1 -7', '5 4\n1 5 1000000000\n1 5 1000000000\n1 5 1000000000\n2 4 -1000000000', mk(2000, 3000, 1e9), mk(3000, 3000, 3), mk(10, 15, 9), `3 1000\n${Array(1000).fill('1 3 1000000000').join('\n')}`, `4 3\n1 4 -1000000000\n2 3 -1000000000\n3 3 -1000000000`];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], q = v[1]; const d = Array(n + 2).fill(0); for (let j = 0; j < q; j++) { const a = v[2 + 3 * j], b = v[3 + 3 * j], x = v[4 + 3 * j]; d[a] += x; d[b + 1] -= x; } const o = []; let s = 0; for (let i = 1; i <= n; i++) { s += d[i]; o.push(s); } return lin(o); },
            cpp: R`
#include <iostream>
using namespace std;
const int MAX = 200005;
long long d[MAX];
int main() {
    for (int i = 0; i < MAX; i++) {   // tylko dla sprawdzarki wzorcówek: wszystkie testy idą w jednym procesie
        d[i] = 0;
    }
    int n, q;
    cin >> n >> q;
    for (int j = 0; j < q; j++) {
        int a, b, x;
        cin >> a >> b >> x;
        d[a] += x;
        d[b + 1] -= x;
    }
    long long s = 0;
    for (int i = 1; i <= n; i++) {
        s += d[i];
        cout << s << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-sumy-prostokatow', krok: 9, level: 'trudne',
            title: 'Sumy prostokątów',
            short: 'Sumy prefiksowe w dwóch wymiarach: suma dowolnego prostokąta z czterech odczytów.',
            tags: ['sumy prefiksowe 2D', 'dodaj i odejmij kawałki', 'long long'],
            statement: [
                'Wczytaj tabelkę n × m i odpowiedz na q pytań. Każde pytanie to cztery liczby w1, k1, w2, k2: górny lewy róg (wiersz w1, kolumna k1) i dolny prawy róg (w2, k2) prostokąta, a odpowiedzią jest suma liczb w tym prostokącie. Wiersze i kolumny numerujemy od 1.',
                'Przygotuj sumy prefiksowe w dwóch wymiarach: P[w][k] to suma prostokąta od rogu (1, 1) do rogu (w, k). Liczysz je wzorem P[w][k] = t[w][k] + P[w − 1][k] + P[w][k − 1] − P[w − 1][k − 1] — odejmujemy, bo górny lewy kawałek został dodany dwa razy. Suma dowolnego prostokąta to P[w2][k2] − P[w1 − 1][k2] − P[w2][k1 − 1] + P[w1 − 1][k1 − 1].',
            ],
            input_format: ['W pierwszym wierszu liczby n, m i q.', 'W każdym z kolejnych n wierszy m liczb.', 'W każdym z kolejnych q wierszy cztery liczby w1, k1, w2, k2.'],
            output_format: ['q wierszy z sumami.'],
            constraints: ['1 ≤ n, m ≤ 1000', '1 ≤ q ≤ 100 000', '1 ≤ w1 ≤ w2 ≤ n, 1 ≤ k1 ≤ k2 ≤ m', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '3 4 2\n1 2 3 4\n5 6 7 8\n9 10 11 12\n2 2 3 3\n1 1 3 4', note: '6 + 7 + 10 + 11 = 34, a cała tabelka to 78.' }],
            hint: R`Tablica long long P[1001][1001] musi być globalna (8 MB). Numeruj od 1 — wtedy wiersz 0 i kolumna 0 tablicy P to same zera i wzory działają także przy brzegu. Narysuj sobie prostokąty na kartce, żeby zobaczyć, czemu odejmujemy i dodajemy właśnie te cztery kawałki.`,
            check: (inp) => { const v = nums(inp); const [n, m, q] = v; const off = 3 + n * m; for (let j = 0; j < q; j++) { const [a, b, c, d] = v.slice(off + 4 * j, off + 4 * j + 4); if (!(a >= 1 && a <= c && c <= n && b >= 1 && b <= d && d <= m)) return 'zły prostokąt'; } return null; },
            tests: (r) => {
                const mk = (n, m, q, lo, hi) => { const qs = Array.from({ length: q }, () => { const a = r.int(1, n), c = r.int(1, n), b = r.int(1, m), d = r.int(1, m); return `${Math.min(a, c)} ${Math.min(b, d)} ${Math.max(a, c)} ${Math.max(b, d)}`; }); return `${n} ${m} ${q}\n${losTab(r, n, m, lo, hi).map(lin).join('\n')}\n${qs.join('\n')}`; };
                return ['3 4 2\n1 2 3 4\n5 6 7 8\n9 10 11 12\n2 2 3 3\n1 1 3 4', '1 1 1\n-5\n1 1 1 1', mk(60, 60, 2000, -1e6, 1e6), mk(40, 70, 1500, 0, 9), mk(5, 5, 30, -9, 9), mk(1, 100, 50, -100, 100)];
            },
            solve: (inp) => {
                const v = nums(inp); const [n, m, q] = v; const P = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0));
                for (let w = 1; w <= n; w++) for (let k = 1; k <= m; k++) P[w][k] = v[3 + (w - 1) * m + (k - 1)] + P[w - 1][k] + P[w][k - 1] - P[w - 1][k - 1];
                const off = 3 + n * m; const o = []; for (let j = 0; j < q; j++) { const [a, b, c, d] = v.slice(off + 4 * j, off + 4 * j + 4); o.push(P[c][d] - P[a - 1][d] - P[c][b - 1] + P[a - 1][b - 1]); }
                return o.join('\n');
            },
            cpp: R`
#include <iostream>
using namespace std;
const int MAX = 1001;
long long P[MAX][MAX];
int main() {
    int n, m, q;
    cin >> n >> m >> q;
    for (int w = 1; w <= n; w++) {
        for (int k = 1; k <= m; k++) {
            int x;
            cin >> x;
            P[w][k] = x + P[w - 1][k] + P[w][k - 1] - P[w - 1][k - 1];
        }
    }
    for (int j = 0; j < q; j++) {
        int w1, k1, w2, k2;
        cin >> w1 >> k1 >> w2 >> k2;
        cout << P[w2][k2] - P[w1 - 1][k2] - P[w2][k1 - 1] + P[w1 - 1][k1 - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-b-dodawanie-olbrzymow', krok: 9, level: 'trudne',
            title: 'Dodawanie olbrzymów',
            short: 'Dodaj dwie liczby mające do 1000 cyfr — cyfra po cyfrze, z przeniesieniem, jak w słupku.',
            tags: ['cyfry w tablicy', 'przeniesienie', 'od cyfry jedności'],
            statement: ['Wczytaj dwie nieujemne liczby całkowite, z których każda może mieć nawet 1000 cyfr — takie liczby nie zmieszczą się w żadnym typie. Wypisz ich sumę. Licz tak, jak dodaje się pisemnie: od ostatnich cyfr, z przeniesieniem jedynki do następnej kolumny.'],
            input_format: ['Dwa wiersze, w każdym jedna liczba bez zer na początku (oprócz samego zera).'],
            output_format: ['Suma obu liczb.'],
            constraints: ['Każda liczba ma od 1 do 1000 cyfr.'],
            examples: [{ input: '999\n1' }, { input: '12345678901234567890\n98765432109876543210' }],
            hint: R`Wczytaj liczby jako napisy. Cyfry przepisz do tablic int od końca: a[0] to cyfra jedności, a[1] dziesiątek i tak dalej — a[i] = s[dl - 1 - i] - '0', a brakujące wyższe cyfry krótszej liczby to zera. Potem w pętli po kolumnach: suma = a[i] + b[i] + przeniesienie, cyfra wyniku to suma % 10, a nowe przeniesienie to suma / 10. Na koniec dopisz ostatnie przeniesienie i wypisz cyfry wyniku od najstarszej.`,
            tests: (r) => {
                const duza = (len) => (len === 1 ? String(r.int(0, 9)) : String(r.int(1, 9)) + r.word(len - 1, '0123456789'));
                return ['999\n1', '12345678901234567890\n98765432109876543210', '0\n0', '5\n5', '0\n123', `${'9'.repeat(1000)}\n1`, `${duza(1000)}\n${duza(1000)}`, `${duza(1000)}\n${duza(3)}`, `${duza(17)}\n${duza(500)}`];
            },
            solve: (inp) => { const [a, b] = toks(inp); return String(BigInt(a) + BigInt(b)); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s1, s2;
    cin >> s1 >> s2;
    int a[1001] = {}, b[1001] = {}, w[1002] = {};
    int d1 = s1.length(), d2 = s2.length();
    for (int i = 0; i < d1; i++) {
        a[i] = s1[d1 - 1 - i] - '0';
    }
    for (int i = 0; i < d2; i++) {
        b[i] = s2[d2 - 1 - i] - '0';
    }
    int dl = d1 > d2 ? d1 : d2;
    int przeniesienie = 0;
    for (int i = 0; i < dl; i++) {
        int suma = a[i] + b[i] + przeniesienie;
        w[i] = suma % 10;
        przeniesienie = suma / 10;
    }
    if (przeniesienie > 0) {
        w[dl] = przeniesienie;
        dl++;
    }
    for (int i = dl - 1; i >= 0; i--) {
        cout << w[i];
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-silnia-olbrzym', krok: 9, level: 'trudne',
            title: 'Silnia ze wszystkimi cyframi',
            short: 'Policz n! dla n do 500 dokładnie — liczba w tablicy cyfr mnożona przez kolejne liczby.',
            tags: ['cyfry w tablicy', 'mnożenie pisemne', 'przeniesienie'],
            statement: ['Silnia n! = 1 · 2 · 3 · … · n rośnie tak szybko, że już 21! nie mieści się w long long. Wczytaj n i wypisz n! ze wszystkimi cyframi. Trzymaj liczbę w tablicy cyfr (od cyfry jedności) i mnóż ją po kolei przez 2, 3, …, n — tak jak mnoży się pisemnie przez liczbę jednocyfrową, tylko tutaj mnożnik może mieć do trzech cyfr.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Wszystkie cyfry n!.'],
            constraints: ['0 ≤ n ≤ 500'],
            examples: [{ input: '5' }, { input: '25' }, { input: '0', note: 'Z umowy 0! = 1.' }],
            hint: R`Tablica int c[2000] z cyframi (c[0] to jedności) i jej długość dl; na start c[0] = 1 i dl = 1. Mnożenie przez x: dla każdej cyfry iloczyn = c[i] * x + przeniesienie, nowa cyfra to iloczyn % 10, a przeniesienie to iloczyn / 10. Na końcu, dopóki przeniesienie > 0, dopisuj jego ostatnią cyfrę na nowej pozycji. 500! ma 1135 cyfr.`,
            tests: () => ['5', '25', '0', '1', '20', '21', '100', '500', '333', '64'],
            solve: (inp) => { const n = nums(inp)[0]; let f = 1n; for (let i = 2n; i <= BigInt(n); i++) f *= i; return String(f); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    int c[2000] = {};
    c[0] = 1;
    int dl = 1;
    for (int x = 2; x <= n; x++) {
        int przeniesienie = 0;
        for (int i = 0; i < dl; i++) {
            int iloczyn = c[i] * x + przeniesienie;
            c[i] = iloczyn % 10;
            przeniesienie = iloczyn / 10;
        }
        while (przeniesienie > 0) {
            c[dl] = przeniesienie % 10;
            przeniesienie /= 10;
            dl++;
        }
    }
    for (int i = dl - 1; i >= 0; i--) {
        cout << c[i];
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-rekordzista-dzielnikow', krok: 9, level: 'trudne',
            title: 'Rekordzista dzielników',
            short: 'Która liczba do n ma najwięcej dzielników? Policz dzielniki wszystkich liczb naraz, jak w sicie.',
            tags: ['sito dzielników', 'd[j]++ dla wielokrotności', 'tablica globalna'],
            statement: [
                'Wczytaj n i znajdź liczbę od 1 do n, która ma najwięcej dzielników. Wypisz ją i liczbę jej dzielników; przy remisie wybierz najmniejszą taką liczbę.',
                'Sprawdzanie każdej liczby osobno pętlą do pierwiastka byłoby dla miliona liczb za wolne. Odwróć pytanie, jak w sicie Eratostenesa: zamiast szukać dzielników liczby j, dla każdego i od 1 do n przejdź po jego wielokrotnościach j = i, 2i, 3i, … i każdej z nich dolicz jeden dzielnik.',
            ],
            input_format: ['Jedna liczba n.'],
            output_format: ['Dwie liczby: rekordzista i liczba jego dzielników.'],
            constraints: ['1 ≤ n ≤ 10⁶'],
            examples: [{ input: '10', note: 'Najwięcej dzielników, po 4, mają 6, 8 i 10. Najmniejsza z nich to 6.' }, { input: '1000000' }],
            hint: R`Globalna tablica int d[1000001];. Dla każdego i od 1 do n: for (int j = i; j <= n; j += i) d[j]++;. Obrotów jest około n · (1 + 1/2 + 1/3 + …) — dla miliona to około 14 milionów, czyli chwila. Potem znajdź największe d[x] znakiem >.`,
            tests: (r) => ['10', '1000000', '1', '2', '12', '100', '720720', '720719', String(r.int(1000, 1e6)), String(r.int(1, 1000))],
            solve: (inp) => { const n = nums(inp)[0]; const d = new Int32Array(n + 1); for (let i = 1; i <= n; i++) for (let j = i; j <= n; j += i) d[j]++; let b = 1; for (let x = 2; x <= n; x++) if (d[x] > d[b]) b = x; return `${b} ${d[b]}`; },
            cpp: R`
#include <iostream>
using namespace std;
const int MAX = 1000001;
int d[MAX];
int main() {
    for (int i = 0; i < MAX; i++) {   // tylko dla sprawdzarki wzorcówek: wszystkie testy idą w jednym procesie
        d[i] = 0;
    }
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        for (int j = i; j <= n; j += i) {
            d[j]++;
        }
    }
    int naj = 1;
    for (int x = 2; x <= n; x++) {
        if (d[x] > d[naj]) {
            naj = x;
        }
    }
    cout << naj << " " << d[naj] << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-b-turniej', krok: 9, level: 'trudne',
            title: 'Wielki finał: tabela turnieju',
            short: 'Tabela „każdy z każdym”: policz punkty i ułóż ranking — wybierając najlepszego wśród niewybranych.',
            tags: ['tablica 2D znaków', 'tablice równoległe', 'bool wybrany[]', 'kilka kryteriów'],
            statement: [
                'Wielki finał! W turnieju szachowym n zawodników zagrało „każdy z każdym”. Wyniki zapisano w tabelce n × n: w wierszu i, kolumnie j stoi W, jeśli zawodnik i wygrał z zawodnikiem j, P — jeśli przegrał, R — jeśli był remis, a na przekątnej (zawodnik sam ze sobą) stoi kreska. Tabelka jest zgodna: gdy w polu (i, j) jest W, to w polu (j, i) jest P, i odwrotnie.',
                'Za zwycięstwo zawodnik dostaje 3 punkty, za remis 1, za porażkę 0. Ułóż ranking: wyżej stoi zawodnik z większą liczbą punktów; przy równych punktach — ten z większą liczbą zwycięstw; a gdy i to jest równe — ten, którego imię jest wcześniej w kolejności słownikowej (porównanie napisów znakiem <).',
                'Wypisz n wierszy: miejsce, kropkę, imię, liczbę punktów i liczbę zwycięstw — na przykład 1. Ola 7 2.',
            ],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych imion — zawodnicy w kolejności wierszy tabelki.', 'W każdym z kolejnych n wierszy n znaków tabelki (bez spacji).'],
            output_format: ['n wierszy rankingu.'],
            constraints: ['2 ≤ n ≤ 100', 'Imiona zaczynają się wielką literą, dalej są małe litery angielskie (od 2 do 8 liter).'],
            examples: [{ input: '4\nOla Jan Ewa Igor\n-WRW\nP-WR\nRP-W\nPRP-', note: 'Jan i Ewa mają po 4 punkty i po jednym zwycięstwie — wyżej jest Ewa, bo napis „Ewa” jest mniejszy od „Jan”.' }],
            hint: R`Najpierw policz dla każdego zawodnika punkty i zwycięstwa (tablice równoległe), przechodząc po jego wierszu tabelki. Potem n razy wybierz najlepszego wśród jeszcze niewybranych — jak przy medalistach — porównując trzy rzeczy po kolei: punkty, zwycięstwa, imię. Zawodnik i jest lepszy od j, gdy pkt[i] > pkt[j] || (pkt[i] == pkt[j] && (wyg[i] > wyg[j] || (wyg[i] == wyg[j] && imie[i] < imie[j]))).`,
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); const g = t.slice(1 + n, 1 + 2 * n); const odw = { W: 'P', P: 'W', R: 'R' }; for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) { if (i === j) { if (g[i][j] !== '-') return 'przekątna'; } else if (g[j][i] !== odw[g[i][j]]) return 'niezgodna tabelka'; } return null; },
            tests: (r) => {
                const mk = (n, pRemis) => {
                    const im = unikalneImiona(r, n); const g = Array.from({ length: n }, () => Array(n).fill('-'));
                    for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { const x = r(); const a = x < pRemis ? 'R' : x < (1 + pRemis) / 2 ? 'W' : 'P'; g[i][j] = a; g[j][i] = a === 'W' ? 'P' : a === 'P' ? 'W' : 'R'; }
                    return `${n}\n${lin(im)}\n${g.map((w) => w.join('')).join('\n')}`;
                };
                return ['4\nOla Jan Ewa Igor\n-WRW\nP-WR\nRP-W\nPRP-', '2\nAb Ba\n-R\nR-', '3\nCe Be Ae\n-RR\nR-R\nRR-', mk(100, 0.3), mk(30, 0.9), mk(12, 0.2), mk(6, 0.5), mk(50, 1)];
            },
            solve: (inp) => {
                const t = toks(inp); const n = Number(t[0]); const im = t.slice(1, 1 + n); const g = t.slice(1 + n, 1 + 2 * n);
                const z = im.map((x, i) => { let p = 0, w = 0; for (let j = 0; j < n; j++) { if (g[i][j] === 'W') { p += 3; w++; } else if (g[i][j] === 'R') p += 1; } return { x, p, w }; });
                z.sort((a, b) => (b.p - a.p) || (b.w - a.w) || (a.x < b.x ? -1 : a.x > b.x ? 1 : 0));
                return z.map((q, i) => `${i + 1}. ${q.x} ${q.p} ${q.w}`).join('\n');
            },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    string imie[100], wiersz[100];
    for (int i = 0; i < n; i++) {
        cin >> imie[i];
    }
    for (int i = 0; i < n; i++) {
        cin >> wiersz[i];
    }
    int pkt[100] = {}, wyg[100] = {};
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (wiersz[i][j] == 'W') {
                pkt[i] += 3;
                wyg[i]++;
            } else if (wiersz[i][j] == 'R') {
                pkt[i] += 1;
            }
        }
    }
    bool wybrany[100] = {};
    for (int miejsce = 1; miejsce <= n; miejsce++) {
        int naj = -1;
        for (int i = 0; i < n; i++) {
            if (wybrany[i]) continue;
            if (naj == -1 || pkt[i] > pkt[naj] ||
                (pkt[i] == pkt[naj] && (wyg[i] > wyg[naj] || (wyg[i] == wyg[naj] && imie[i] < imie[naj])))) {
                naj = i;
            }
        }
        wybrany[naj] = true;
        cout << miejsce << ". " << imie[naj] << " " << pkt[naj] << " " << wyg[naj] << "\n";
    }
    return 0;
}`,
        },
    ];
};
