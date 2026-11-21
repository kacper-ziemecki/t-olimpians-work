// Rekurencja — ćwiczenia w trakcie lekcji, części 7–8: generowanie wszystkich możliwości (drzewo wyborów, podzbiory,
// permutacje z tablicą użytych, obcinanie gałęzi, kod Graya) oraz zalewanie planszy (flood fill: plamy, pożary, wyspy,
// jeziora, przejścia) i dziel i zwyciężaj (turniej, wyszukiwanie binarne, fraktal).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./rekurencja-pomoc');
    const { calk, B, losDlugi, isqrtB, plansza, D4, D8, zalej, pusta, waz } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const bigOk = (s, lo, hi) => /^\d+$/.test(s) && B(s) >= B(lo) && B(s) <= B(hi);
    const E18 = '1000000000000000000';
    const listaT = (a) => `${a.length}\n${a.join('\n')}`;
    const checkT = (inp, tMax, lo, hi) => {
        const t = toks(inp); const n = Number(t[0]);
        return calk(n, 1, tMax) && t.length === n + 1 && t.slice(1).every((x) => bigOk(x, lo, hi)) ? null : 'dane';
    };
    // Plansza z wejścia: pierwszy wiersz z liczbami (ile — ile liczb), potem n wierszy po m znaków ze zbioru znaki.
    const czytajPl = (inp) => { const L = linie(inp); const g = L[0].trim().split(/\s+/).map(Number); return { g, pl: L.slice(1) }; };
    const checkPl = (inp, ile, znaki, maxN = 100) => {
        const { g, pl } = czytajPl(inp); const [n, m] = g;
        if (g.length !== ile || !calk(n, 1, maxN) || !calk(m, 1, maxN) || pl.length !== n) return 'dane';
        const re = new RegExp(`^[${znaki}]{${m}}$`);
        return pl.every((w) => re.test(w)) ? null : 'dane';
    };
    // Plansza z „plamami”: kilka losowych spacerów zamiast niezależnych pól — wychodzą kształty jak prawdziwe wyspy.
    const plamy = (r, n, m, ile, dl, a = '#', b = '.') => {
        const g = Array.from({ length: n }, () => new Array(m).fill(b));
        for (let k = 0; k < ile; k++) {
            let x = r.int(0, n - 1), y = r.int(0, m - 1);
            for (let s = 0; s < dl; s++) { g[x][y] = a; const [dx, dy] = r.pick(D4); x = Math.min(n - 1, Math.max(0, x + dx)); y = Math.min(m - 1, Math.max(0, y + dy)); }
        }
        return g.map((w) => w.join(''));
    };

    return [
        // ================================================================ KROK 7 · generowanie wszystkich możliwości
        {
            id: 'rk-zestawy-obiadowe', krok: 7, level: 'latwe',
            title: 'Zestawy obiadowe',
            short: 'Z każdej kategorii (zupa, drugie danie, deser…) wybierz jedną potrawę i wypisz wszystkie zestawy. Rekurencja idzie po kategoriach, a pętla — po potrawach jednej kategorii.',
            tags: ['drzewo wyborów', 'pętla w rekurencji', 'push_back i pop_back'],
            statement: ['Stołówka ma menu z k kategorii (na przykład zupa, drugie danie, deser). Zestaw obiadowy to jedna potrawa z każdej kategorii. Wypisz wszystkie zestawy: najpierw wszystkie z pierwszą potrawą pierwszej kategorii, potem z drugą i tak dalej — a w ramach tej samej potrawy z pierwszej kategorii tak samo dla drugiej kategorii (zawsze w kolejności z menu).',
                'Napisz funkcję rekurencyjną void zestaw(int i), która dla kategorii i po kolei bierze każdą potrawę, dopisuje ją do vectora wybranych, wywołuje zestaw(i + 1) i usuwa ją z vectora. Gdy i == k, wypisuje cały zestaw.'],
            input_format: ['W pierwszym wierszu k — liczba kategorii.', 'W każdym z k kolejnych wierszy liczba m, a po niej m nazw potraw tej kategorii.'],
            output_format: ['Wszystkie zestawy, każdy w osobnym wierszu: nazwy potraw oddzielone napisem " + " (spacja, plus, spacja).'],
            constraints: ['1 ≤ k ≤ 4', '1 ≤ m ≤ 4', 'Nazwy mają od 1 do 10 małych liter.'],
            examples: [{ input: '2\n2 rosol pomidorowa\n3 kotlet ryba pierogi', note: '2 · 3 = 6 zestawów. Pierwsza kategoria zmienia się najwolniej.' }],
            hint: R`vector<vector<string>> menu; vector<string> wybrane; void zestaw(int i) { if (i == k) { for (int j = 0; j < k; j++) { if (j > 0) cout << " + "; cout << wybrane[j]; } cout << "\n"; return; } for (string p : menu[i]) { wybrane.push_back(p); zestaw(i + 1); wybrane.pop_back(); } }. push_back przed wywołaniem i pop_back po nim to „wybierz” i „cofnij wybór”.`,
            tests: (r) => {
                const POT = ['rosol', 'zurek', 'barszcz', 'kotlet', 'ryba', 'pierogi', 'nalesniki', 'sernik', 'lody', 'kompot', 'sok', 'herbata', 'salatka', 'frytki', 'ryz', 'kasza'];
                const menu = (k, mx) => `${k}\n${Array.from({ length: k }, () => { const m = r.int(1, mx); const a = r.shuffle(POT).slice(0, m); return `${m} ${a.join(' ')}`; }).join('\n')}`;
                return ['2\n2 rosol pomidorowa\n3 kotlet ryba pierogi', '1\n1 woda', '4\n4 a b c d\n4 e f g h\n4 i j k l\n4 m n o p', menu(3, 4), menu(4, 3), '3\n1 zupa\n4 kotlet ryba pierogi placki\n1 lody'];
            },
            check: (inp) => { const L = linie(inp); const k = Number(L[0]); if (!calk(k, 1, 4) || L.length !== k + 1) return 'dane'; for (const w of L.slice(1)) { const t = w.split(' '); const m = Number(t[0]); if (!calk(m, 1, 4) || t.length !== m + 1 || !t.slice(1).every((x) => /^[a-z]{1,10}$/.test(x))) return 'dane'; } return null; },
            solve: (inp) => { const L = linie(inp); let wyn = [[]]; for (const w of L.slice(1)) { const opc = w.split(' ').slice(1); wyn = wyn.flatMap((z) => opc.map((o) => [...z, o])); } return wyn.map((z) => z.join(' + ')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int k;
vector<vector<string>> menu;
vector<string> wybrane;
void zestaw(int i) {
    if (i == k) {
        for (int j = 0; j < k; j++) {
            if (j > 0) cout << " + ";
            cout << wybrane[j];
        }
        cout << "\n";
        return;
    }
    for (string p : menu[i]) {
        wybrane.push_back(p);
        zestaw(i + 1);
        wybrane.pop_back();
    }
}
int main() {
    cin >> k;
    menu.resize(k);
    for (int i = 0; i < k; i++) {
        int m;
        cin >> m;
        menu[i].resize(m);
        for (int j = 0; j < m; j++) cin >> menu[i][j];
    }
    zestaw(0);
    return 0;
}`,
        },
        {
            id: 'rk-plot-kolory', krok: 7, level: 'latwe',
            title: 'Malowanie płotu',
            short: 'n sztachet, k kolorów, sąsiednie sztachety w różnych kolorach. Wypisz wszystkie sposoby alfabetycznie — przy każdej sztachecie pomijasz kolor poprzedniej.',
            tags: ['generowanie z warunkiem', 'napis w parametrze', 'kolejność alfabetyczna'],
            statement: ['Płot ma n sztachet stojących w rzędzie. Każdą malujemy jednym z k kolorów oznaczonych literami a, b, c, … Dwie sąsiednie sztachety nie mogą mieć tego samego koloru. Wypisz wszystkie sposoby pomalowania płotu w kolejności alfabetycznej (każdy sposób to napis z n liter). Jeśli nie ma żadnego sposobu, wypisz BRAK.',
                'Napisz funkcję rekurencyjną void maluj(string plot), która dopisuje do napisu kolejno litery od a do k-tej litery alfabetu — pomijając literę równą ostatniej literze napisu — i wywołuje samą siebie. Gdy napis ma n liter, wypisuje go.'],
            input_format: ['W jedynym wierszu dwie liczby n i k.'],
            output_format: ['Wszystkie sposoby pomalowania płotu, każdy w osobnym wierszu, albo BRAK.'],
            constraints: ['1 ≤ n ≤ 6', '1 ≤ k ≤ 4'],
            examples: [{ input: '3 2', note: 'Przy dwóch kolorach kolory muszą się przeplatać: aba albo bab.' }, { input: '2 3' }],
            hint: R`void maluj(string plot) { if ((int)plot.size() == n) { cout << plot << "\n"; ile++; return; } for (char c = 'a'; c < 'a' + k; c++) { if (!plot.empty() && plot.back() == c) continue; maluj(plot + c); } }. W main: maluj(""); a jeśli ile == 0 — BRAK. Napisy są krótkie, więc przekazywanie ich przez wartość nic nie kosztuje.`,
            tests: () => ['3 2', '2 3', '1 1', '2 1', '6 4', '5 3', '4 2', '1 4', '6 1'],
            check: (inp) => { const t = nums(inp); return t.length === 2 && calk(t[0], 1, 6) && calk(t[1], 1, 4) ? null : 'dane'; },
            solve: (inp) => { const [n, k] = nums(inp); let w = ['']; for (let i = 0; i < n; i++) w = w.flatMap((s) => 'abcd'.slice(0, k).split('').filter((c) => !s.endsWith(c)).map((c) => s + c)); return w.length ? w.join('\n') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, k, ile = 0;
void maluj(string plot) {
    if ((int)plot.size() == n) {
        cout << plot << "\n";
        ile++;
        return;
    }
    for (char c = 'a'; c < 'a' + k; c++) {
        if (!plot.empty() && plot.back() == c) continue;
        maluj(plot + c);
    }
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    ile = 0;
    cin >> n >> k;
    maluj("");
    if (ile == 0) cout << "BRAK\n";
    return 0;
}`,
        },
        {
            id: 'rk-cyfry-rosnace', krok: 7, level: 'latwe',
            title: 'Liczby o rosnących cyfrach',
            short: 'Wypisz rosnąco wszystkie n-cyfrowe liczby, w których każda cyfra jest większa od poprzedniej. Następna cyfra zaczyna się od poprzedniej + 1 — to jedyny parametr, którego trzeba pilnować.',
            tags: ['generowanie rosnąco', 'parametr: od jakiej cyfry', 'liczba w parametrze'],
            statement: ['Liczba ma cyfry rosnące, jeśli każda jej cyfra jest większa od poprzedniej, na przykład 1358 albo 279. Wczytaj n i wypisz rosnąco wszystkie dodatnie n-cyfrowe liczby o rosnących cyfrach. Jeśli takich liczb nie ma, wypisz BRAK.',
                'Napisz funkcję rekurencyjną void buduj(int ile, int od, long long liczba): ile — ile cyfr jeszcze brakuje, od — najmniejsza cyfra, którą można teraz dopisać, liczba — to, co już zbudowane. Dopisanie cyfry c to liczba · 10 + c.'],
            input_format: ['W jedynym wierszu n.'],
            output_format: ['Liczby o rosnących cyfrach, każda w osobnym wierszu (rosnąco), albo BRAK.'],
            constraints: ['1 ≤ n ≤ 10'],
            examples: [{ input: '8' }, { input: '10', note: 'Cyfr różnych od zera jest tylko 9, a zero nie może stać na początku.' }],
            hint: R`void buduj(int ile, int od, long long liczba) { if (ile == 0) { cout << liczba << "\n"; znalezione++; return; } for (int c = od; c <= 9; c++) buduj(ile - 1, c + 1, liczba * 10 + c); }, a w main buduj(n, 1, 0);. Zaczynamy od cyfry 1, bo liczba nie może zaczynać się zerem — a po pierwszej cyfrze zero i tak już nie może się pojawić.`,
            tests: () => ['8', '10', '1', '2', '4', '5', '9', '3'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 10) ? null : 'dane'; },
            solve: (inp) => { const n = nums(inp)[0]; const w = []; const gen = (ile, od, s) => { if (ile === 0) { w.push(s); return; } for (let c = od; c <= 9; c++) gen(ile - 1, c + 1, s + c); }; gen(n, 1, ''); return w.length ? w.join('\n') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int znalezione = 0;
void buduj(int ile, int od, long long liczba) {
    if (ile == 0) {
        cout << liczba << "\n";
        znalezione++;
        return;
    }
    for (int c = od; c <= 9; c++) buduj(ile - 1, c + 1, liczba * 10 + c);
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    znalezione = 0;
    int n;
    cin >> n;
    buduj(n, 1, 0);
    if (znalezione == 0) cout << "BRAK\n";
    return 0;
}`,
        },
        {
            id: 'rk-klodka', krok: 7, level: 'srednie',
            title: 'Kłódka z sumą',
            short: 'Kod ma n cyfr od 1 do k, a ich suma to s. Wypisz wszystkie takie kody rosnąco — i nie wchodź w gałęzie, które na pewno nie dadzą sumy s.',
            tags: ['obcinanie gałęzi', 'generowanie', 'BRAK gdy nic'],
            statement: ['Bajtek zapomniał kodu do kłódki rowerowej. Pamięta tylko, że kod ma n cyfr, każda cyfra jest od 1 do k, a suma cyfr wynosi s. Wypisz wszystkie pasujące kody w kolejności rosnącej (jak liczby), każdy w osobnym wierszu. Jeśli nie ma żadnego, wypisz BRAK.',
                'Buduj kod cyfra po cyfrze. Zanim dopiszesz cyfrę c, sprawdź, czy da się jeszcze dojść do sumy s: pozostałe cyfry dadzą co najmniej 1 · (ile ich zostało) i co najwyżej k · (ile ich zostało). Jeśli nie da się — nie wchodź w tę gałąź.'],
            input_format: ['W jedynym wierszu trzy liczby n, k i s.'],
            output_format: ['Pasujące kody, każdy w osobnym wierszu (rosnąco), albo BRAK.'],
            constraints: ['1 ≤ n ≤ 5', '1 ≤ k ≤ 9', '1 ≤ s ≤ 50'],
            examples: [{ input: '3 3 7', note: 'Trzy cyfry od 1 do 3 o sumie 7: 133, 223, 232, 313, 322, 331.' }, { input: '2 4 9' }],
            hint: R`void kod(int i, int suma, string s) { if (i == n) { if (suma == S) { cout << s << "\n"; ile++; } return; } int zostanie = n - i - 1; for (int c = 1; c <= k; c++) { int nowa = suma + c; if (nowa + zostanie > S || nowa + k * zostanie < S) continue; kod(i + 1, nowa, s + char('0' + c)); } }. Bez obcinania program też by zdążył, ale sprawdzałby wszystkie kᵒ kodów — z obcinaniem idzie tylko tam, gdzie jest szansa na wynik.`,
            tests: () => ['3 3 7', '2 4 9', '5 9 25', '5 9 45', '5 9 46', '1 1 1', '4 6 12', '5 2 7', '3 9 2', '5 7 20'],
            check: (inp) => { const t = nums(inp); return t.length === 3 && calk(t[0], 1, 5) && calk(t[1], 1, 9) && calk(t[2], 1, 50) ? null : 'dane'; },
            solve: (inp) => { const [n, k, s] = nums(inp); const w = []; const gen = (i, su, txt) => { if (i === n) { if (su === s) w.push(txt); return; } for (let c = 1; c <= k; c++) gen(i + 1, su + c, txt + c); }; gen(0, 0, ''); return w.length ? w.join('\n') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, k, S, ile = 0;
void kod(int i, int suma, string s) {
    if (i == n) {
        if (suma == S) {
            cout << s << "\n";
            ile++;
        }
        return;
    }
    int zostanie = n - i - 1;
    for (int c = 1; c <= k; c++) {
        int nowa = suma + c;
        if (nowa + zostanie > S || nowa + k * zostanie < S) continue;
        kod(i + 1, nowa, s + char('0' + c));
    }
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    ile = 0;
    cin >> n >> k >> S;
    kod(0, 0, "");
    if (ile == 0) cout << "BRAK\n";
    return 0;
}`,
        },
        {
            id: 'rk-plus-minus', krok: 7, level: 'srednie',
            title: 'Plus czy minus?',
            short: 'Przed każdą z n liczb postaw + albo −, żeby wynik był równy S. Na ile sposobów? Dwa wywołania na każdym poziomie — razem 2ⁿ możliwości.',
            tags: ['dwa wybory', 'suma w parametrze', 'liczenie zamiast wypisywania'],
            statement: ['Na tablicy zapisano n liczb. Przed każdą z nich trzeba postawić znak + albo − tak, żeby wartość całego wyrażenia była równa S. Na ile sposobów można to zrobić? Znak przed pierwszą liczbą też wybierasz.',
                'Napisz funkcję rekurencyjną long long ile(int i, long long suma): gdy i == n, oddaje 1, jeśli suma == S, a 0 w przeciwnym razie; inaczej oddaje sumę wyników dwóch wywołań — z liczbą i dodaną do sumy i z liczbą i odjętą.'],
            input_format: ['W pierwszym wierszu n i S.', 'W drugim wierszu n liczb całkowitych dodatnich.'],
            output_format: ['Jedna liczba — liczba sposobów.'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ każda liczba ≤ 1000', '−20 000 ≤ S ≤ 20 000'],
            examples: [{ input: '4 2\n1 1 1 1', note: 'Trzy plusy i jeden minus — minus może stać przed dowolną z czterech jedynek.' }, { input: '3 2\n1 2 3', note: 'Tylko +1 − 2 + 3 = 2.' }],
            hint: R`long long ile(int i, long long suma) { if (i == n) return suma == S ? 1 : 0; return ile(i + 1, suma + a[i]) + ile(i + 1, suma - a[i]); }, a w main ile(0, 0). Dla n = 20 to około 2 miliony wywołań — sprawdzarka zrobi to w ułamku sekundy. Każde dodatkowe n podwaja pracę, więc dla n = 40 ten sposób by już nie zdążył.`,
            tests: (r) => {
                const z = (a, s) => `${a.length} ${s}\n${a.join(' ')}`;
                const a20 = r.arr(20, 1, 20);
                return [z([1, 1, 1, 1], 2), z([1, 2, 3], 2), z([5], 5), z([5], 4), z(a20, 0), z(a20, a20.reduce((x, y) => x + y, 0)), z(r.arr(20, 1, 1000), r.int(-500, 500)), z(new Array(20).fill(1), 0), z(r.arr(15, 1, 9), 3)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; return calk(n, 1, 20) && calk(t[1], -20000, 20000) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1000)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const n = t[0], S = t[1]; let mp = new Map([[0, 1]]); for (const x of t.slice(2)) { const nm = new Map(); for (const [s, c] of mp) { nm.set(s + x, (nm.get(s + x) || 0) + c); nm.set(s - x, (nm.get(s - x) || 0) + c); } mp = nm; } return String(mp.get(S) || 0); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n;
long long S;
int a[25];
long long ile(int i, long long suma) {
    if (i == n) return suma == S ? 1 : 0;
    return ile(i + 1, suma + a[i]) + ile(i + 1, suma - a[i]);
}
int main() {
    cin >> n >> S;
    for (int i = 0; i < n; i++) cin >> a[i];
    cout << ile(0, 0) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-waga-szalkowa', krok: 7, level: 'srednie',
            title: 'Waga szalkowa',
            short: 'Każdy odważnik kładziesz na szalkę z towarem, na drugą szalkę albo zostawiasz. Ile różnych mas da się zważyć? Trzy wywołania na każdym poziomie i set na wyniki.',
            tags: ['trzy wybory', 'set', '3ⁿ możliwości'],
            statement: ['Sprzedawca ma wagę szalkową i n odważników. Towar kładzie na lewą szalkę. Każdy odważnik może położyć na prawą szalkę (wtedy dodaje się do zważonej masy), na lewą — obok towaru (wtedy się odejmuje) albo nie użyć go wcale. Ile różnych dodatnich mas towaru da się w ten sposób dokładnie zważyć?',
                'Napisz funkcję rekurencyjną void wazy(int i, int roznica), która dla odważnika i wywołuje samą siebie trzy razy: z roznica + w[i], z roznica − w[i] i bez zmiany. Gdy i == n i roznica > 0, wstawia ją do set<int>. Wynik to rozmiar zbioru.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n mas odważników.'],
            output_format: ['Jedna liczba — ile różnych dodatnich mas da się zważyć.'],
            constraints: ['1 ≤ n ≤ 10', '1 ≤ masa odważnika ≤ 1000'],
            examples: [{ input: '2\n1 3', note: 'Da się zważyć 1, 3, 1 + 3 = 4 i 3 − 1 = 2 (odważnik 1 leży obok towaru).' }],
            hint: R`set<int> masy; void wazy(int i, int roznica) { if (i == n) { if (roznica > 0) masy.insert(roznica); return; } wazy(i + 1, roznica + w[i]); wazy(i + 1, roznica - w[i]); wazy(i + 1, roznica); }. Dla n = 10 to 3¹⁰ = 59 049 zakończeń — set sam usunie powtórzenia.`,
            tests: (r) => [`2\n1 3`, `1\n7`, `4\n1 3 9 27`, `10\n${r.arr(10, 1, 1000).join(' ')}`, `10\n${new Array(10).fill(5).join(' ')}`, `6\n${r.arr(6, 1, 30).join(' ')}`, `10\n1 2 4 8 16 32 64 128 256 512`],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1000)) ? null : 'dane'; },
            solve: (inp) => { const w = nums(inp).slice(1); let s = new Set([0]); for (const x of w) { const n = new Set(); for (const v of s) { n.add(v + x); n.add(v - x); n.add(v); } s = n; } return String([...s].filter((v) => v > 0).length); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, w[10];
set<int> masy;
void wazy(int i, int roznica) {
    if (i == n) {
        if (roznica > 0) masy.insert(roznica);
        return;
    }
    wazy(i + 1, roznica + w[i]);
    wazy(i + 1, roznica - w[i]);
    wazy(i + 1, roznica);
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    masy.clear();
    cin >> n;
    for (int i = 0; i < n; i++) cin >> w[i];
    wazy(0, 0);
    cout << masy.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-zdjecie-klasowe', krok: 7, level: 'srednie',
            title: 'Zdjęcie klasowe',
            short: 'Ustaw n osób w rzędzie tak, żeby skłócone pary nie stały obok siebie. Ile jest takich ustawień i które jest pierwsze alfabetycznie? Permutacje z tablicą użytych i obcinanie gałęzi.',
            tags: ['permutacje', 'tablica użytych', 'obcinanie gałęzi'],
            statement: ['Do zdjęcia klasowego n osób staje w jednym rzędzie. Niektóre pary osób są skłócone i nie mogą stać obok siebie. Policz, na ile sposobów można ustawić rząd, i wypisz ustawienie pierwsze w kolejności alfabetycznej (porównujemy najpierw pierwszą osobę w rzędzie, przy remisie drugą i tak dalej). Jeśli żadne ustawienie nie jest dobre, w drugim wierszu wypisz BRAK.',
                'Posortuj imiona i generuj ustawienia rekurencyjnie: na kolejne miejsce próbuj każdej osoby, która jeszcze nie stoi w rzędzie (tablica bool uzyty[]), ale tylko wtedy, gdy nie jest skłócona z osobą stojącą przed nią. Pierwsze znalezione ustawienie jest wtedy pierwsze alfabetycznie.'],
            input_format: ['W pierwszym wierszu n i m — liczba osób i liczba skłóconych par.', 'W drugim wierszu n różnych imion.', 'W każdym z m kolejnych wierszy dwa imiona skłóconej pary.'],
            output_format: ['W pierwszym wierszu liczba dobrych ustawień.', 'W drugim wierszu pierwsze alfabetycznie dobre ustawienie (imiona oddzielone spacjami) albo BRAK.'],
            constraints: ['1 ≤ n ≤ 8', '0 ≤ m ≤ n · (n − 1) / 2, pary się nie powtarzają', 'Imiona mają od 1 do 10 liter: pierwsza wielka, reszta małe.'],
            examples: [{ input: '3 1\nCelina Ala Bartek\nAla Bartek', note: 'Ala i Bartek muszą stać na końcach, a Celina w środku: Ala Celina Bartek albo Bartek Celina Ala.' }],
            hint: R`sort(imiona.begin(), imiona.end()); — potem bool zle[8][8] dla skłóconych par (po indeksach). void ustaw() { if ((int)rzad.size() == n) { ile++; if (ile == 1) pierwsze = rzad; return; } for (int i = 0; i < n; i++) { if (uzyty[i]) continue; if (!rzad.empty() && zle[rzad.back()][i]) continue; uzyty[i] = true; rzad.push_back(i); ustaw(); rzad.pop_back(); uzyty[i] = false; } }.`,
            tests: (r) => {
                const z = (im, pary) => `${im.length} ${pary.length}\n${im.join(' ')}${pary.map((p) => `\n${p[0]} ${p[1]}`).join('')}`;
                const los = (n, m) => { const im = r.shuffle(P.IMIONA.filter((x) => x.length <= 10)).slice(0, n); const all = []; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) all.push([im[i], im[j]]); return z(im, r.shuffle(all).slice(0, m).map((p) => (r() < 0.5 ? p : [p[1], p[0]]))); };
                return [z(['Celina', 'Ala', 'Bartek'], [['Ala', 'Bartek']]), z(['Ola'], []), los(8, 0), los(8, 6), los(8, 14), los(5, 10), los(6, 9), los(4, 3), los(7, 12)];
            },
            check: (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); if (!calk(n, 1, 8) || !calk(m, 0, n * (n - 1) / 2) || L.length !== m + 2) return 'dane'; const im = L[1].split(' '); if (im.length !== n || new Set(im).size !== n || !im.every((x) => /^[A-Z][a-z]{0,9}$/.test(x))) return 'dane'; const s = new Set(); for (const w of L.slice(2)) { const [a, b] = w.split(' '); if (a === b || !im.includes(a) || !im.includes(b)) return 'dane'; const k = [a, b].sort().join(' '); if (s.has(k)) return 'dane'; s.add(k); } return null; },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0].split(' ')[0]); const im = L[1].split(' ').slice().sort();
                const zle = new Set(L.slice(2).map((w) => w.split(' ').sort().join(' ')));
                let ile = 0, pierwsze = null; const rzad = [], uz = new Array(n).fill(false);
                const gen = () => { if (rzad.length === n) { ile++; if (!pierwsze) pierwsze = rzad.map((i) => im[i]).join(' '); return; } for (let i = 0; i < n; i++) { if (uz[i]) continue; if (rzad.length && zle.has([im[rzad[rzad.length - 1]], im[i]].sort().join(' '))) continue; uz[i] = true; rzad.push(i); gen(); rzad.pop(); uz[i] = false; } };
                gen();
                return `${ile}\n${pierwsze || 'BRAK'}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, m;
vector<string> imiona;
bool zle[8][8], uzyty[8];
vector<int> rzad, pierwsze;
long long ile = 0;
int numer(const string &s) {
    for (int i = 0; i < n; i++)
        if (imiona[i] == s) return i;
    return -1;
}
void ustaw() {
    if ((int)rzad.size() == n) {
        ile++;
        if (ile == 1) pierwsze = rzad;
        return;
    }
    for (int i = 0; i < n; i++) {
        if (uzyty[i]) continue;
        if (!rzad.empty() && zle[rzad.back()][i]) continue;
        uzyty[i] = true;
        rzad.push_back(i);
        ustaw();
        rzad.pop_back();
        uzyty[i] = false;
    }
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(zle, 0, sizeof zle);
    ile = 0;
    rzad.clear();
    pierwsze.clear();
    cin >> n >> m;
    imiona.resize(n);
    for (int i = 0; i < n; i++) cin >> imiona[i];
    sort(imiona.begin(), imiona.end());
    for (int i = 0; i < m; i++) {
        string a, b;
        cin >> a >> b;
        int x = numer(a), y = numer(b);
        zle[x][y] = zle[y][x] = true;
    }
    ustaw();
    cout << ile << "\n";
    if (ile == 0) cout << "BRAK\n";
    else {
        for (int i = 0; i < n; i++) cout << imiona[pierwsze[i]] << (i + 1 < n ? " " : "\n");
    }
    return 0;
}`,
        },
        {
            id: 'rk-kod-graya', krok: 7, level: 'srednie',
            title: 'Kod Graya',
            short: 'Wypisz wszystkie 2ⁿ napisy zero-jedynkowe tak, żeby kolejne różniły się jedną cyfrą. Kod dla n powstaje z kodu dla n − 1: raz z 0 z przodu, a raz z 1 z przodu i w odwrotnej kolejności.',
            tags: ['funkcja zwraca vector', 'odbicie lustrzane', 'rekurencja na wyniku'],
            statement: ['Licznik w starej maszynie może na raz przestawić tylko jeden przełącznik. Dlatego zamiast zwykłego liczenia dwójkowego używa się kodu Graya: ciągu wszystkich 2ⁿ napisów zero-jedynkowych długości n, w którym każde dwa kolejne napisy różnią się dokładnie jedną cyfrą. Kod Graya dla n = 1 to 0, 1. Kod dla n powstaje z kodu dla n − 1 tak: najpierw wszystkie napisy kodu n − 1 z dopisanym z przodu 0, a potem wszystkie napisy kodu n − 1 w odwrotnej kolejności z dopisanym z przodu 1.',
                'Wypisz kod Graya dla podanego n, każdy napis w osobnym wierszu. Napisz funkcję rekurencyjną vector<string> gray(int n).'],
            input_format: ['W jedynym wierszu n.'],
            output_format: ['2ⁿ wierszy — kolejne napisy kodu Graya.'],
            constraints: ['1 ≤ n ≤ 10'],
            examples: [{ input: '2', note: 'Kod dla n = 1 to 0, 1. Z zerem z przodu: 00, 01. Odwrócony z jedynką z przodu: 11, 10.' }, { input: '3' }],
            hint: R`vector<string> gray(int n) { if (n == 1) return {"0", "1"}; vector<string> mniejszy = gray(n - 1), w; for (string s : mniejszy) w.push_back("0" + s); for (int i = mniejszy.size() - 1; i >= 0; i--) w.push_back("1" + mniejszy[i]); return w; }. Na łączeniu dwóch połówek różnica jest tylko w pierwszej cyfrze, bo ostatni napis pierwszej połówki i pierwszy napis drugiej mają ten sam koniec.`,
            tests: () => ['2', '3', '1', '10', '7', '5'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 1, 10) ? null : 'dane'; },
            solve: (inp) => { const n = nums(inp)[0]; let g = ['0', '1']; for (let k = 2; k <= n; k++) g = [...g.map((s) => '0' + s), ...g.slice().reverse().map((s) => '1' + s)]; return g.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<string> gray(int n) {
    if (n == 1) return {"0", "1"};
    vector<string> mniejszy = gray(n - 1);
    vector<string> w;
    for (string s : mniejszy) w.push_back("0" + s);
    for (int i = (int)mniejszy.size() - 1; i >= 0; i--) w.push_back("1" + mniejszy[i]);
    return w;
}
int main() {
    int n;
    cin >> n;
    for (string s : gray(n)) cout << s << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · zalewanie planszy oraz dziel i zwyciężaj
        {
            id: 'rk-plama', krok: 8, level: 'latwe',
            title: 'Plama atramentu',
            short: 'Kleks rozlał się po kratkach. Policz, ile kratek ma plama, na którą wskazuje Bajtek — zalewanie rekurencyjne w czterech kierunkach z tablicą odwiedzonych.',
            tags: ['zalewanie (flood fill)', 'tablica odwiedzonych', '4 kierunki'],
            statement: ['Kartka w kratkę ma n wierszy i m kolumn. Kratki zamalowane atramentem oznaczono znakiem #, a czyste — kropką. Dwie zamalowane kratki należą do tej samej plamy, jeśli od jednej do drugiej można przejść po zamalowanych kratkach sąsiadujących bokiem. Bajtek wskazuje kratkę w wierszu r i kolumnie c (numerowane od 1). Ile kratek ma plama, do której ona należy? Jeśli wskazana kratka jest czysta, odpowiedź to 0.',
                'Napisz funkcję rekurencyjną int zalej(int x, int y): jeśli (x, y) leży poza kartką, jest czysta albo już policzona — oddaje 0; inaczej zaznacza kratkę jako policzoną i oddaje 1 plus wyniki dla czterech sąsiadów.'],
            input_format: ['W pierwszym wierszu cztery liczby n, m, r i c.', 'W każdym z n kolejnych wierszy m znaków: # albo kropka.'],
            output_format: ['Jedna liczba — wielkość plamy.'],
            constraints: ['1 ≤ n, m ≤ 100', '1 ≤ r ≤ n', '1 ≤ c ≤ m'],
            examples: [{ input: '4 5 1 2\n##..#\n.#..#\n.###.\n....#', note: 'Plama z kratką (1, 2) to 6 kratek. Kratki # w prawej kolumnie to osobne plamy.' }],
            hint: R`int zalej(int x, int y) { if (x < 0 || y < 0 || x >= n || y >= m) return 0; if (g[x][y] != '#' || odw[x][y]) return 0; odw[x][y] = true; return 1 + zalej(x + 1, y) + zalej(x - 1, y) + zalej(x, y + 1) + zalej(x, y - 1); }. Najpierw sprawdzaj granice, potem pole — inaczej g[−1][…] wyjdzie poza tablicę. Bez tablicy odw dwie sąsiednie kratki wołałyby się nawzajem bez końca. W main pamiętaj o r − 1 i c − 1.`,
            tests: (r) => {
                const z = (pl, x, y) => `${pl.length} ${pl[0].length} ${x} ${y}\n${pl.join('\n')}`;
                const naPlamie = (pl) => { for (;;) { const x = r.int(0, pl.length - 1), y = r.int(0, pl[0].length - 1); if (pl[x][y] === '#') return [x + 1, y + 1]; } };
                const a = plamy(r, 100, 100, 12, 900), b = plansza(r, 100, 100, 0.55), c = waz(100, 100);
                return ['4 5 1 2\n##..#\n.#..#\n.###.\n....#', '1 1 1 1\n#', '1 1 1 1\n.', z(a, ...naPlamie(a)), z(b, ...naPlamie(b)), z(c, 1, 1), z(plansza(r, 30, 70, 0.4), 15, 35), z(Array.from({ length: 100 }, () => '#'.repeat(100)), 100, 100)];
            },
            check: (inp) => { if (checkPl(inp, 4, '#.')) return 'dane'; const { g } = czytajPl(inp); return calk(g[2], 1, g[0]) && calk(g[3], 1, g[1]) ? null : 'dane'; },
            solve: (inp) => { const { g, pl } = czytajPl(inp); const [n, m, x, y] = g; return String(zalej(n, m, x - 1, y - 1, (a, b) => pl[a][b] === '#', pusta(n, m))); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, m;
string g[105];
bool odw[105][105];
int zalej(int x, int y) {
    if (x < 0 || y < 0 || x >= n || y >= m) return 0;
    if (g[x][y] != '#' || odw[x][y]) return 0;
    odw[x][y] = true;
    return 1 + zalej(x + 1, y) + zalej(x - 1, y) + zalej(x, y + 1) + zalej(x, y - 1);
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(odw, 0, sizeof odw);
    int r, c;
    cin >> n >> m >> r >> c;
    for (int i = 0; i < n; i++) cin >> g[i];
    cout << zalej(r - 1, c - 1) << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-pozar-lasu', krok: 8, level: 'latwe',
            title: 'Pożar lasu',
            short: 'Ogień przeskakuje na drzewa sąsiadujące bokiem albo rogiem. Policz spalone drzewa i narysuj mapę po pożarze — zalewanie w ośmiu kierunkach, a spalone pole samo staje się „odwiedzone”.',
            tags: ['zalewanie', '8 kierunków', 'zmiana planszy'],
            statement: ['Mapa lasu ma n wierszy i m kolumn: T to drzewo, kropka — puste pole. Piorun trafił w drzewo w wierszu r i kolumnie c (numerowane od 1). Ogień przenosi się z płonącego drzewa na każde drzewo sąsiadujące z nim bokiem albo rogiem (każde pole ma do 8 sąsiadów). Policz, ile drzew spłonie, i wypisz mapę po pożarze ze spalonymi drzewami oznaczonymi gwiazdką *.',
                'Napisz funkcję rekurencyjną void pal(int x, int y), która zamienia T na * i wywołuje samą siebie dla 8 sąsiadów. Spalone pole nie jest już drzewem — dlatego osobna tablica odwiedzonych nie jest potrzebna.'],
            input_format: ['W pierwszym wierszu cztery liczby n, m, r i c.', 'W każdym z n kolejnych wierszy m znaków: T albo kropka. W polu (r, c) rośnie drzewo.'],
            output_format: ['W pierwszym wierszu liczba spalonych drzew.', 'Potem n wierszy — mapa po pożarze.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '3 4 1 1\nT.T.\n.T..\n...T', note: 'Ogień idzie po skosie: (1, 1) → (2, 2) → (1, 3). Drzewo w rogu (3, 4) nie sąsiaduje z żadnym płonącym.' }],
            hint: R`void pal(int x, int y) { if (x < 0 || y < 0 || x >= n || y >= m || g[x][y] != 'T') return; g[x][y] = '*'; spalone++; for (int dx = -1; dx <= 1; dx++) for (int dy = -1; dy <= 1; dy++) if (dx != 0 || dy != 0) pal(x + dx, y + dy); }. Dwie pętle po dx i dy dają wszystkich 8 sąsiadów bez wypisywania ich ręcznie.`,
            tests: (r) => {
                const z = (pl) => { for (;;) { const x = r.int(0, pl.length - 1), y = r.int(0, pl[0].length - 1); if (pl[x][y] === 'T') return `${pl.length} ${pl[0].length} ${x + 1} ${y + 1}\n${pl.join('\n')}`; } };
                return ['3 4 1 1\nT.T.\n.T..\n...T', '1 1 1 1\nT', z(plansza(r, 100, 100, 0.45, 'T', '.')), z(plansza(r, 100, 100, 0.3, 'T', '.')), z(plamy(r, 60, 90, 8, 400, 'T', '.')), z(waz(100, 100, 'T', '.')), z(plansza(r, 10, 10, 0.5, 'T', '.'))];
            },
            check: (inp) => { if (checkPl(inp, 4, 'T.')) return 'dane'; const { g, pl } = czytajPl(inp); return calk(g[2], 1, g[0]) && calk(g[3], 1, g[1]) && pl[g[2] - 1][g[3] - 1] === 'T' ? null : 'dane'; },
            solve: (inp) => { const { g, pl } = czytajPl(inp); const [n, m, x, y] = g; const odw = pusta(n, m); const ile = zalej(n, m, x - 1, y - 1, (a, b) => pl[a][b] === 'T', odw, D8); const mapa = pl.map((w, a) => w.split('').map((ch, b) => (odw[a][b] ? '*' : ch)).join('')); return `${ile}\n${mapa.join('\n')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, m, spalone = 0;
string g[105];
void pal(int x, int y) {
    if (x < 0 || y < 0 || x >= n || y >= m) return;
    if (g[x][y] != 'T') return;
    g[x][y] = '*';
    spalone++;
    for (int dx = -1; dx <= 1; dx++)
        for (int dy = -1; dy <= 1; dy++)
            if (dx != 0 || dy != 0) pal(x + dx, y + dy);
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    spalone = 0;
    int r, c;
    cin >> n >> m >> r >> c;
    for (int i = 0; i < n; i++) cin >> g[i];
    pal(r - 1, c - 1);
    cout << spalone << "\n";
    for (int i = 0; i < n; i++) cout << g[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-wyspy', krok: 8, level: 'srednie',
            title: 'Wyspy',
            short: 'Policz wyspy na mapie i podaj powierzchnię największej. Pętla po wszystkich polach, a z każdego nowego pola lądu — zalewanie, które zaznacza całą wyspę naraz.',
            tags: ['zalewanie', 'liczenie spójnych obszarów', 'pętla + rekurencja'],
            statement: ['Mapa ma n wierszy i m kolumn: # to ląd, kropka — woda. Wyspa to największy obszar lądu, po którym można chodzić między polami sąsiadującymi bokiem. Policz wyspy i podaj powierzchnię największej (w polach). Jeśli na mapie nie ma lądu, wypisz 0 0.',
                'Przejdź pętlą po wszystkich polach. Gdy trafisz na ląd, którego jeszcze nie odwiedziłeś, to początek nowej wyspy: zwiększ licznik wysp i wywołaj zalewanie, które odwiedzi całą tę wyspę i odda jej powierzchnię.'],
            input_format: ['W pierwszym wierszu n i m.', 'W każdym z n kolejnych wierszy m znaków: # albo kropka.'],
            output_format: ['Dwie liczby: liczba wysp i powierzchnia największej wyspy.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '4 5\n##..#\n.#..#\n.###.\n....#', note: 'Wyspy mają powierzchnie 6, 2 i 1. Pola stykające się tylko rogiem nie tworzą jednej wyspy.' }],
            hint: R`for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) if (g[i][j] == '#' && !odw[i][j]) { wyspy++; najwieksza = max(najwieksza, zalej(i, j)); }. Funkcja zalej jest taka sama jak w zadaniu „Plama atramentu”. Każde pole odwiedzisz tylko raz, więc całość działa szybko nawet dla planszy 100 × 100.`,
            tests: (r) => {
                const z = (pl) => `${pl.length} ${pl[0].length}\n${pl.join('\n')}`;
                return ['4 5\n##..#\n.#..#\n.###.\n....#', '1 1\n.', '1 1\n#', z(plansza(r, 100, 100, 0.4)), z(plamy(r, 100, 100, 30, 300)), z(waz(100, 100)), z(Array.from({ length: 100 }, (_, i) => (i % 2 ? '.#'.repeat(50) : '#.'.repeat(50)))), z(plansza(r, 3, 100, 0.6))];
            },
            check: (inp) => checkPl(inp, 2, '#.'),
            solve: (inp) => { const { g, pl } = czytajPl(inp); const [n, m] = g; const odw = pusta(n, m); let ile = 0, mx = 0; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (pl[i][j] === '#' && !odw[i][j]) { ile++; mx = Math.max(mx, zalej(n, m, i, j, (a, b) => pl[a][b] === '#', odw)); } return `${ile} ${mx}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, m;
string g[105];
bool odw[105][105];
int zalej(int x, int y) {
    if (x < 0 || y < 0 || x >= n || y >= m) return 0;
    if (g[x][y] != '#' || odw[x][y]) return 0;
    odw[x][y] = true;
    return 1 + zalej(x + 1, y) + zalej(x - 1, y) + zalej(x, y + 1) + zalej(x, y - 1);
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(odw, 0, sizeof odw);
    cin >> n >> m;
    for (int i = 0; i < n; i++) cin >> g[i];
    int wyspy = 0, najwieksza = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (g[i][j] == '#' && !odw[i][j]) {
                wyspy++;
                najwieksza = max(najwieksza, zalej(i, j));
            }
    cout << wyspy << " " << najwieksza << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-przejscie', krok: 8, level: 'srednie',
            title: 'Po kamieniach na drugi brzeg',
            short: 'Rzeka płynie przez planszę, a Ty skaczesz po kamieniach sąsiadujących bokiem. Czy da się przejść z górnego brzegu na dolny? Zalewanie z każdego kamienia w pierwszym wierszu.',
            tags: ['zalewanie z wielu startów', 'TAK albo NIE', 'plansza'],
            statement: ['Rzeka ma n wierszy i m kolumn: o to kamień, ~ to woda. Górny brzeg leży nad pierwszym wierszem, a dolny — pod ostatnim. Bajtek może wejść na dowolny kamień w pierwszym wierszu i przechodzić z kamienia na kamień sąsiadujący bokiem. Czy dojdzie do jakiegoś kamienia w ostatnim wierszu, a stamtąd na dolny brzeg?',
                'Uruchom zalewanie z każdego kamienia w pierwszym wierszu (tablica odwiedzonych jest wspólna dla wszystkich startów — pole odwiedzone raz nie musi być odwiedzane drugi raz). Na końcu sprawdź, czy któryś kamień w ostatnim wierszu został odwiedzony.'],
            input_format: ['W pierwszym wierszu n i m.', 'W każdym z n kolejnych wierszy m znaków: o albo ~.'],
            output_format: ['TAK albo NIE.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '4 5\no~~o~\noo~oo\n~o~~o\n~ooo~', note: 'Z kamienia (1, 1) idziemy w dół na (2, 1), w prawo na (2, 2), a potem w dół na (3, 2) i (4, 2) — to już ostatni wiersz.' }, { input: '3 3\nooo\n~~~\nooo' }],
            hint: R`for (int j = 0; j < m; j++) zalej(0, j); — zalej od razu wraca z pola, które nie jest kamieniem albo było już odwiedzone. Potem: bool da = false; for (int j = 0; j < m; j++) if (odw[n - 1][j]) da = true;. Wspólna tablica odw sprawia, że każde pole odwiedzisz najwyżej raz, nawet przy 100 startach.`,
            tests: (r) => {
                const z = (pl) => `${pl.length} ${pl[0].length}\n${pl.join('\n')}`;
                const pl = (n, m, p) => plansza(r, n, m, p, 'o', '~');
                const sciezka = (n, m) => { const g = pl(n, m, 0.35).map((w) => w.split('')); let y = r.int(0, m - 1); for (let x = 0; x < n; x++) { g[x][y] = 'o'; const y2 = Math.max(0, Math.min(m - 1, y + r.int(-3, 3))); for (let k = Math.min(y, y2); k <= Math.max(y, y2); k++) g[x][k] = 'o'; y = y2; } return g.map((w) => w.join('')); };
                const odcieta = (n, m) => { const g = pl(n, m, 0.6).map((w) => w.split('')); const x = r.int(1, n - 2); g[x] = new Array(m).fill('~'); return g.map((w) => w.join('')); };
                return ['4 5\no~~o~\noo~oo\n~o~~o\n~ooo~', '3 3\nooo\n~~~\nooo', '1 1\no', '1 1\n~', z(sciezka(100, 100)), z(odcieta(100, 100)), z(pl(100, 100, 0.55)), z(pl(100, 100, 0.62)), z(waz(100, 100, 'o', '~')), z(pl(40, 7, 0.5))];
            },
            check: (inp) => checkPl(inp, 2, 'o~'),
            solve: (inp) => { const { g, pl } = czytajPl(inp); const [n, m] = g; const odw = pusta(n, m); for (let j = 0; j < m; j++) zalej(n, m, 0, j, (a, b) => pl[a][b] === 'o', odw); return odw[n - 1].some((x) => x) ? 'TAK' : 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, m;
string g[105];
bool odw[105][105];
void zalej(int x, int y) {
    if (x < 0 || y < 0 || x >= n || y >= m) return;
    if (g[x][y] != 'o' || odw[x][y]) return;
    odw[x][y] = true;
    zalej(x + 1, y);
    zalej(x - 1, y);
    zalej(x, y + 1);
    zalej(x, y - 1);
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(odw, 0, sizeof odw);
    cin >> n >> m;
    for (int i = 0; i < n; i++) cin >> g[i];
    for (int j = 0; j < m; j++) zalej(0, j);
    bool da = false;
    for (int j = 0; j < m; j++)
        if (odw[n - 1][j]) da = true;
    cout << (da ? "TAK" : "NIE") << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-jeziora', krok: 8, level: 'srednie',
            title: 'Jeziora na wyspie',
            short: 'Woda połączona z brzegiem mapy to morze, a reszta wody to jeziora. Najpierw zalej morze od brzegów, a potem policz jeziora i ich łączną powierzchnię.',
            tags: ['zalewanie od brzegów', 'dwa etapy', 'liczenie obszarów'],
            statement: ['Mapa wyspy ma n wierszy i m kolumn: # to ląd, kropka — woda. Woda, z której da się dopłynąć (przez pola wody sąsiadujące bokiem) do brzegu mapy, należy do morza. Każdy inny spójny obszar wody to jezioro. Policz jeziora i ich łączną powierzchnię.',
                'Najpierw uruchom zalewanie wody z każdego pola wody leżącego na brzegu mapy — oznaczy całe morze. Potem przejdź po wszystkich polach: każde nieodwiedzone pole wody to początek nowego jeziora — zalej je i dolicz jego powierzchnię.'],
            input_format: ['W pierwszym wierszu n i m.', 'W każdym z n kolejnych wierszy m znaków: # albo kropka.'],
            output_format: ['Dwie liczby: liczba jezior i ich łączna powierzchnia.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '5 6\n######\n#..#.#\n####.#\n#.####\n######', note: 'Jeziora: dwa pola w drugim wierszu, dwa pola w prawej kolumnie i jedno pole w czwartym wierszu — 3 jeziora o łącznej powierzchni 5.' }],
            hint: R`for (int i = 0; i < n; i++) for (int j = 0; j < m; j++) if (i == 0 || j == 0 || i == n - 1 || j == m - 1) zalej(i, j); — to oznacza morze. Potem jeziora: if (g[i][j] == '.' && !odw[i][j]) { jeziora++; pow += zalej(i, j); }. Ta sama funkcja zalej (oddająca liczbę pól) służy do obu etapów.`,
            tests: (r) => {
                const z = (pl) => `${pl.length} ${pl[0].length}\n${pl.join('\n')}`;
                const wyspa = (n, m, p) => { const g = plansza(r, n, m, p, '.', '#').map((w) => w.split('')); for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (Math.min(i, j, n - 1 - i, m - 1 - j) < 2 && r() < 0.7) g[i][j] = '.'; return g.map((w) => w.join('')); };
                return ['5 6\n######\n#..#.#\n####.#\n#.####\n######', '1 1\n.', '3 3\n###\n#.#\n###', z(wyspa(100, 100, 0.3)), z(wyspa(100, 100, 0.45)), z(plansza(r, 100, 100, 0.25, '.', '#')), z(waz(100, 100, '.', '#')), z(wyspa(20, 60, 0.35))];
            },
            check: (inp) => checkPl(inp, 2, '#.'),
            solve: (inp) => { const { g, pl } = czytajPl(inp); const [n, m] = g; const odw = pusta(n, m); const woda = (a, b) => pl[a][b] === '.'; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (i === 0 || j === 0 || i === n - 1 || j === m - 1) zalej(n, m, i, j, woda, odw); let ile = 0, pow = 0; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) if (woda(i, j) && !odw[i][j]) { ile++; pow += zalej(n, m, i, j, woda, odw); } return `${ile} ${pow}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, m;
string g[105];
bool odw[105][105];
int zalej(int x, int y) {
    if (x < 0 || y < 0 || x >= n || y >= m) return 0;
    if (g[x][y] != '.' || odw[x][y]) return 0;
    odw[x][y] = true;
    return 1 + zalej(x + 1, y) + zalej(x - 1, y) + zalej(x, y + 1) + zalej(x, y - 1);
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(odw, 0, sizeof odw);
    cin >> n >> m;
    for (int i = 0; i < n; i++) cin >> g[i];
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (i == 0 || j == 0 || i == n - 1 || j == m - 1) zalej(i, j);
    int jeziora = 0, pow = 0;
    for (int i = 0; i < n; i++)
        for (int j = 0; j < m; j++)
            if (g[i][j] == '.' && !odw[i][j]) {
                jeziora++;
                pow += zalej(i, j);
            }
    cout << jeziora << " " << pow << "\n";
    return 0;
}`,
        },
        {
            id: 'rk-turniej', krok: 8, level: 'srednie',
            title: 'Turniej pucharowy',
            short: '2ᵏ zawodników, w każdym meczu wygrywa silniejszy. Ile meczów wygrał każdy? Zwycięzca fragmentu drabinki to silniejszy ze zwycięzców obu połówek — dziel i zwyciężaj.',
            tags: ['dziel i zwyciężaj', 'połówki przedziału', 'zwracanie indeksu'],
            statement: ['W turnieju pucharowym gra n = 2ᵏ zawodników ustawionych w drabince w kolejności z wejścia. W pierwszej rundzie grają pary (1, 2), (3, 4), …; zwycięzcy kolejnych par grają ze sobą w następnej rundzie w tej samej kolejności i tak dalej, aż do finału. W każdym meczu wygrywa zawodnik o większej sile (siły są różne). Wypisz, ile meczów wygrał każdy zawodnik.',
                'Napisz funkcję rekurencyjną int turniej(int l, int r), która rozgrywa turniej na fragmencie drabinki od l do r − 1 (jego długość jest potęgą dwójki): dzieli go na dwie połowy, rozgrywa każdą rekurencyjnie, a zwycięzcy połówek grają ze sobą. Zwycięzca tego meczu dostaje +1 do licznika wygranych i jest zwycięzcą całego fragmentu.'],
            input_format: ['W pierwszym wierszu k.', 'W drugim wierszu 2ᵏ różnych liczb — siły zawodników.'],
            output_format: ['W jednym wierszu 2ᵏ liczb — ile meczów wygrał każdy zawodnik.'],
            constraints: ['0 ≤ k ≤ 12', '1 ≤ siła ≤ 10⁹, siły są różne'],
            examples: [{ input: '2\n5 8 3 1', note: '8 pokonuje 5, a 3 pokonuje 1. W finale 8 pokonuje 3 — razem 2 wygrane.' }],
            hint: R`int turniej(int l, int r) { if (r - l == 1) return l; int s = (l + r) / 2; int a = turniej(l, s), b = turniej(s, r); int w = sila[a] > sila[b] ? a : b; wygrane[w]++; return w; }. Każdy poziom rekurencji to jedna runda. Przy k = 0 jest jeden zawodnik — wygrał 0 meczów.`,
            tests: (r) => {
                const z = (k) => { const n = 2 ** k; const s = new Set(); while (s.size < n) s.add(r.int(1, 1000000000)); return `${k}\n${r.shuffle([...s]).join(' ')}`; };
                return ['2\n5 8 3 1', '0\n42', '1\n1 2', z(12), z(3), z(10), `4\n${Array.from({ length: 16 }, (_, i) => i + 1).join(' ')}`];
            },
            check: (inp) => { const t = nums(inp); const k = t[0]; if (!calk(k, 0, 12) || t.length !== 2 ** k + 1) return 'dane'; const s = t.slice(1); return s.every((x) => calk(x, 1, 1e9)) && new Set(s).size === s.length ? null : 'dane'; },
            solve: (inp) => { const s = nums(inp).slice(1); const w = new Array(s.length).fill(0); let gr = s.map((_, i) => i); while (gr.length > 1) { const nx = []; for (let i = 0; i < gr.length; i += 2) { const a = gr[i], b = gr[i + 1]; const z = s[a] > s[b] ? a : b; w[z]++; nx.push(z); } gr = nx; } return w.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int sila[5000], wygrane[5000];
int turniej(int l, int r) {
    if (r - l == 1) return l;
    int s = (l + r) / 2;
    int a = turniej(l, s), b = turniej(s, r);
    int w = sila[a] > sila[b] ? a : b;
    wygrane[w]++;
    return w;
}
int main() {
    // zerowanie przed testem (sprawdzanie wzorcówek puszcza wszystkie testy w jednym procesie)
    memset(wygrane, 0, sizeof wygrane);
    int k;
    cin >> k;
    int n = 1 << k;
    for (int i = 0; i < n; i++) cin >> sila[i];
    turniej(0, n);
    for (int i = 0; i < n; i++) cout << wygrane[i] << (i + 1 < n ? " " : "\n");
    return 0;
}`,
        },
        {
            id: 'rk-pierwiastek', krok: 8, level: 'srednie',
            title: 'Pierwiastek bez sqrt',
            short: 'Największe x, że x · x ≤ n — dla n do 10¹⁸. Wyszukiwanie binarne rekurencyjnie: sprawdź środek przedziału i szukaj dalej w tej połowie, w której jest odpowiedź.',
            tags: ['wyszukiwanie binarne', 'dziel na pół', 'long long'],
            statement: ['Dla każdej z t liczb n wypisz część całkowitą pierwiastka kwadratowego, czyli największe x, dla którego x · x ≤ n. Funkcja sqrt na liczbach rzędu 10¹⁸ potrafi się pomylić o 1 — pamiętasz z lekcji o zaokrąglaniu, że (long long)sqrt(10¹⁸ − 1) daje 10⁹, choć powinno wyjść 999 999 999.',
                'Napisz funkcję rekurencyjną long long szukaj(long long lo, long long hi), która szuka odpowiedzi w przedziale [lo, hi]: gdy lo == hi, to jest odpowiedź; inaczej bierze środek mid = (lo + hi + 1) / 2 i jeśli mid · mid ≤ n, szuka w [mid, hi], a jeśli nie — w [lo, mid − 1]. Zacznij od szukaj(0, 1000000000).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczba całkowita n.'],
            output_format: ['t wierszy — części całkowite pierwiastków.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ n ≤ 10¹⁸'],
            examples: [{ input: '4\n10\n16\n0\n999999999999999999' }],
            hint: R`long long n; long long szukaj(long long lo, long long hi) { if (lo == hi) return lo; long long mid = (lo + hi + 1) / 2; if (mid * mid <= n) return szukaj(mid, hi); return szukaj(lo, mid - 1); }. „+ 1” w środku jest ważne: bez niego przy lo + 1 == hi środek byłby równy lo i przy warunku prawdziwym przedział by się nie zmniejszył — nieskończona rekurencja. Przedział połowi się za każdym razem, więc wywołań jest około 30.`,
            tests: (r) => {
                const kw = () => { const x = losDlugi(r, 0n, 1000000000n); let v = x * x + B(r.int(-1, 1)); if (v < 0n) v = 0n; if (v > B(E18)) v = B(E18); return String(v); };
                return [listaT(['10', '16', '0', '999999999999999999']), listaT([E18, '1', '2', '3', '4', '999999998000000001', '999999998000000000', '999999999999999998']), listaT(Array.from({ length: 1000 }, () => (r() < 0.5 ? kw() : String(losDlugi(r, 0n, B(E18))))))];
            },
            check: (inp) => checkT(inp, 1000, '0', E18),
            solve: (inp) => toks(inp).slice(1).map((x) => String(isqrtB(B(x)))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long n;
long long szukaj(long long lo, long long hi) {
    if (lo == hi) return lo;
    long long mid = (lo + hi + 1) / 2;
    if (mid * mid <= n) return szukaj(mid, hi);
    return szukaj(lo, mid - 1);
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        cin >> n;
        cout << szukaj(0, 1000000000) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'rk-trojkat-sierpinskiego', krok: 8, level: 'srednie',
            title: 'Trójkąt Sierpińskiego',
            short: 'Trójkąt rzędu k to trzy trójkąty rzędu k − 1: jeden na górze i dwa obok siebie na dole. Narysuj go z gwiazdek — rekurencja zamalowuje pola tablicy znaków.',
            tags: ['fraktal', 'rysowanie w tablicy', 'dziel i zwyciężaj'],
            statement: ['Trójkąt Sierpińskiego rzędu 0 to jedna gwiazdka *. Trójkąt rzędu k ma 2ᵏ wierszy i 2ᵏ⁺¹ − 1 kolumn: w górnej połowie, pośrodku, stoi trójkąt rzędu k − 1, a w dolnej połowie dwa trójkąty rzędu k − 1 obok siebie, oddzielone jedną kolumną spacji. Narysuj trójkąt rzędu k.',
                'Przygotuj tablicę wierszy wypełnionych spacjami i napisz funkcję rekurencyjną void rysuj(int k, int x, int y), która rysuje trójkąt rzędu k tak, że jego lewy górny róg (prostokąta, w którym się mieści) jest w wierszu x i kolumnie y: dla k = 0 stawia gwiazdkę, a dla większego k wywołuje samą siebie trzy razy z k − 1. Spacji na końcach wierszy nie musisz usuwać.'],
            input_format: ['W jedynym wierszu k.'],
            output_format: ['2ᵏ wierszy rysunku.'],
            constraints: ['0 ≤ k ≤ 6'],
            examples: [{ input: '2' }],
            hint: R`Niech h = 2ᵏ⁻¹ (wysokość mniejszego trójkąta). Górny trójkąt zaczyna się w (x, y + h), lewy dolny w (x + h, y), a prawy dolny w (x + h, y + 2h). void rysuj(int k, int x, int y) { if (k == 0) { obraz[x][y] = '*'; return; } int h = 1 << (k - 1); rysuj(k - 1, x, y + h); rysuj(k - 1, x + h, y); rysuj(k - 1, x + h, y + 2 * h); }. Tablica: vector<string> obraz(1 << k, string((2 << k) - 1, ' '));.`,
            tests: () => ['2', '0', '1', '3', '4', '5', '6'],
            check: (inp) => { const t = nums(inp); return t.length === 1 && calk(t[0], 0, 6) ? null : 'dane'; },
            solve: (inp) => { const k = nums(inp)[0]; const g = Array.from({ length: 2 ** k }, () => new Array(2 ** (k + 1) - 1).fill(' ')); const rys = (kk, x, y) => { if (kk === 0) { g[x][y] = '*'; return; } const hh = 2 ** (kk - 1); rys(kk - 1, x, y + hh); rys(kk - 1, x + hh, y); rys(kk - 1, x + hh, y + 2 * hh); }; rys(k, 0, 0); return g.map((w) => w.join('').replace(/\s+$/, '')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<string> obraz;
void rysuj(int k, int x, int y) {
    if (k == 0) {
        obraz[x][y] = '*';
        return;
    }
    int h = 1 << (k - 1);
    rysuj(k - 1, x, y + h);
    rysuj(k - 1, x + h, y);
    rysuj(k - 1, x + h, y + 2 * h);
}
int main() {
    int k;
    cin >> k;
    obraz.assign(1 << k, string((2 << k) - 1, ' '));
    rysuj(k, 0, 0);
    for (string w : obraz) cout << w << "\n";
    return 0;
}`,
        },
    ];
};
