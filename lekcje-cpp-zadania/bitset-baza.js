// Bitset — baza zadań na koniec lekcji: 10 łatwych (bitset w prostych przebraniach: skarpetki, litery, sudoku, bingo, urlopy,
// album, wieże, liczby bez kwadratów, pierwsze palindromy, kod kreskowy), 10 średnich (ankieta, alergie, słowa z tymi samymi
// literami, linijka, wspólni znajomi, wybór kursów maskami, odcinki i plakaty bez pętli po polach, Goldbach na odwróconym
// bitsecie, sito na przedziale) i 8 trudnych (dokładnie k monet, monety w ograniczonej liczbie, krzyżówka, wzorzec z dżokerami,
// automat komórkowy, skoczek, drogi jednokierunkowe) — a na koniec wielki finał: wyszukiwarka dokumentów.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./bitset-pomoc');
    const { calk, rozne, los01, sito, pierwszeDo, pierwszaDzielenie, sumy, losGraf, losGrafGrupy, grafTxt, macierz, SLOWA_ANG } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const L = (inp) => inp.split('\n');
    const lista = (a) => `${a.length}\n${a.join(' ')}`;
    const listaW = (a) => `${a.length}${a.length ? ' ' + a.join(' ') : ''}`;
    const wiersze = (a) => `${a.length}\n${a.join('\n')}`;
    const suma = (a) => a.reduce((s, x) => s + x, 0);
    const slowo = (r, a, b, alf = 'abcdefghijklmnopqrstuvwxyz') => r.word(r.int(a, b), alf);

    return [
        // ================================================================ BAZA · łatwe
        {
            id: 'bs-b-skarpetki', krok: 9, level: 'latwe',
            title: 'Skarpetki bez pary',
            short: 'Skarpetki łączą się w pary po kolorze. Przełączaj bit koloru przy każdej skarpetce — na końcu świecą kolory, w których została skarpetka bez pary.',
            tags: ['flip(c)', 'parzyście znika', 'count()'],
            statement: ['W szufladzie leży n skarpetek, każda w jednym z 1000 kolorów (numery od 0 do 999). Mama łączy skarpetki w pary tego samego koloru. W których kolorach zostanie skarpetka bez pary?',
                'Nie trzeba liczyć skarpetek każdego koloru: wystarczy przełączać bit koloru przy każdej skarpetce (flip). Para przełącza bit dwa razy — wraca do zera. Na końcu świecą dokładnie kolory, w których skarpetek jest nieparzyście wiele.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n kolorów.'],
            output_format: ['W pierwszym wierszu liczba kolorów ze skarpetką bez pary.', 'W drugim wierszu te kolory rosnąco (gdy ich nie ma — pusty wiersz).'],
            constraints: ['1 ≤ n ≤ 20 000', '0 ≤ każdy kolor ≤ 999'],
            examples: [{ input: '7\n5 3 5 5 900 3 7', note: 'Piątki są trzy (jedna para i jedna samotna), trójki dwie (para), dziewięćsetka i siódemka po jednej. Bez pary: 5, 7 i 900.' }],
            hint: R`bitset<1000> b; for (…) { cin >> c; b.flip(c); }. Potem b.count() i pętla po kolorach od 0 do 999.`,
            tests: (r) => [lista([5, 3, 5, 5, 900, 3, 7]), lista([0]), lista([1, 1]), lista(r.arr(20000, 0, 999)), lista(r.arr(20000, 0, 30)), lista(r.shuffle([...Array.from({ length: 1000 }, (_, i) => i), ...Array.from({ length: 1000 }, (_, i) => i)])), lista(r.arr(999, 0, 999))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 20000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 999)) ? null : 'dane'; },
            solve: (inp) => { const b = new Uint8Array(1000); nums(inp).slice(1).forEach((c) => { b[c] ^= 1; }); const w = []; for (let i = 0; i < 1000; i++) if (b[i]) w.push(i); return `${w.length}\n${w.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    bitset<1000> b;
    for (int i = 0; i < n; i++) {
        int c;
        cin >> c;
        b.flip(c);
    }
    cout << b.count() << "\n";
    for (int c = 0; c < 1000; c++) {
        if (b[c]) cout << c << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-wspolne-litery', krok: 9, level: 'latwe',
            title: 'Wspólne litery',
            short: 'Litery słowa to bitset<26>. Wspólne litery dwóch słów to AND ich bitsetów — wypisz je od a do z albo brak.',
            tags: ['bitset<26>', "c - 'a'", 'a & b'],
            statement: ['Dla każdej z q par słów wypisz litery, które występują w obu słowach — każdą raz, w kolejności alfabetycznej, bez spacji. Jeśli słowa nie mają wspólnej litery, wypisz brak.',
                "Zapisz litery każdego słowa w bitset<26>: litera c zapala bit c - 'a'. Wspólne litery to bity zapalone w obu."],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwa słowa z małych liter alfabetu łacińskiego.'],
            output_format: ['q wierszy: wspólne litery albo brak.'],
            constraints: ['1 ≤ q ≤ 1000', 'każde słowo ma od 1 do 100 liter'],
            examples: [{ input: '3\nbitset kolejka\nalgorytm program\nkot pies', note: 'bitset i kolejka mają wspólną tylko literę e. algorytm i program dzielą a, g, m, o i r. kot i pies nie mają ani jednej wspólnej litery.' }],
            hint: R`bitset<26> a, b; for (char c : s) a[c - 'a'] = 1; (tak samo dla drugiego słowa), potem bitset<26> w = a & b;. Jeśli w.none(), wypisz brak, inaczej for (int k = 0; k < 26; k++) if (w[k]) cout << char('a' + k);.`,
            tests: (r) => [wiersze(['bitset kolejka', 'algorytm program', 'kot pies']), wiersze(['a a', 'a b', 'abcdefghijklmnopqrstuvwxyz zyxwvutsrqponmlkjihgfedcba']), wiersze(Array.from({ length: 1000 }, () => `${slowo(r, 1, 12)} ${slowo(r, 1, 12)}`)), wiersze(Array.from({ length: 1000 }, () => `${slowo(r, 1, 100, 'abcdefgh')} ${slowo(r, 1, 8, 'efghijkl')}`)), wiersze(Array.from({ length: 300 }, () => `${r.pick(SLOWA_ANG)} ${r.pick(SLOWA_ANG)}`))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((w) => /^[a-z]{1,100} [a-z]{1,100}$/.test(w)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const [s, t] = w.split(' '); const B = new Set(t); const o = [...new Set(s)].filter((c) => B.has(c)).sort().join(''); return o || 'brak'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string s, t;
        cin >> s >> t;
        bitset<26> a, b;
        for (char c : s) a[c - 'a'] = 1;
        for (char c : t) b[c - 'a'] = 1;
        bitset<26> w = a & b;
        if (w.none()) {
            cout << "brak\n";
            continue;
        }
        for (int k = 0; k < 26; k++) {
            if (w[k]) cout << char('a' + k);
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-b-sudoku', krok: 9, level: 'latwe',
            title: 'Sprawdź sudoku',
            short: 'Każdy wiersz, kolumna i kwadrat 3 × 3 musi zawierać cyfry od 1 do 9. Zapalaj bity cyfr w bitset<10> — dobra grupa ma count() == 9.',
            tags: ['bitset<10> na grupę', 'count() == 9', '27 grup'],
            statement: ['Dla każdej z q wypełnionych plansz sudoku 9 × 9 sprawdź, czy jest poprawna: w każdym wierszu, w każdej kolumnie i w każdym z dziewięciu kwadratów 3 × 3 każda cyfra od 1 do 9 występuje dokładnie raz.',
                'Grupa dziewięciu pól jest dobra, gdy po zapaleniu bitów jej cyfr w bitset<10> świeci dokładnie 9 bitów — powtórzona cyfra zapala ten sam bit, więc jakiegoś zabraknie.'],
            input_format: ['W pierwszym wierszu liczba q.', 'Każda plansza to 9 wierszy po 9 cyfr od 1 do 9 (bez spacji).'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 100'],
            examples: [{ input: '2\n534678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179\n534678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286197', note: 'Pierwsza plansza jest poprawna. W drugiej zamieniono dwie ostatnie cyfry ostatniego wiersza — wiersz dalej ma wszystkie cyfry, ale dwie kolumny już nie.' }],
            hint: R`Wczytaj planszę do string t[9]. Dla wiersza w: bitset<10> b; for (int k = 0; k < 9; k++) b[t[w][k] - '0'] = 1; if (b.count() != 9) zle = true;. Tak samo kolumny i kwadraty: pole (3 * (i / 3) + k / 3, 3 * (i % 3) + k % 3) to k-te pole i-tego kwadratu.`,
            tests: (r) => {
                const dobra = () => {
                    const perm = r.shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9]);
                    const pasy = r.shuffle([0, 1, 2]), sto = r.shuffle([0, 1, 2]);
                    const rows = pasy.flatMap((p) => r.shuffle([0, 1, 2]).map((x) => 3 * p + x));
                    const cols = sto.flatMap((p) => r.shuffle([0, 1, 2]).map((x) => 3 * p + x));
                    return rows.map((rr) => cols.map((cc) => perm[(rr * 3 + Math.floor(rr / 3) + cc) % 9]).join(''));
                };
                const zepsuj = (g) => {
                    const a = g.map((w) => w.split(''));
                    const typ = r.int(0, 2);
                    if (typ === 0) { const w = r.int(0, 8); const x = r.int(0, 8); let y = r.int(0, 7); if (y >= x) y++; [a[w][x], a[w][y]] = [a[w][y], a[w][x]]; }
                    else if (typ === 1) { const w = r.int(0, 8), k = r.int(0, 8); const stara = a[w][k]; let nowa; do nowa = String(r.int(1, 9)); while (nowa === stara); a[w][k] = nowa; }
                    else { const k = r.int(0, 8); let k2 = r.int(0, 7); if (k2 >= k) k2++; for (let w = 0; w < 9; w++) [a[w][k], a[w][k2]] = [a[w][k2], a[w][k]]; const w1 = r.int(0, 8); [a[w1][0], a[w1][8]] = [a[w1][8], a[w1][0]]; }
                    return a.map((w) => w.join(''));
                };
                const ex = '534678912\n672195348\n198342567\n859761423\n426853791\n713924856\n961537284\n287419635\n345286179';
                const t = [`2\n${ex}\n${ex.slice(0, -2)}97`];
                const plansze = Array.from({ length: 100 }, () => { const g = dobra(); return r() < 0.5 ? g : zepsuj(g); });
                t.push(`100\n${plansze.map((g) => g.join('\n')).join('\n')}`);
                const rzedy = Array.from({ length: 9 }, () => '123456789');
                t.push(`2\n${rzedy.join('\n')}\n${dobra().join('\n')}`);
                t.push(`3\n${Array.from({ length: 3 }, () => zepsuj(dobra()).join('\n')).join('\n')}`);
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 100) && l.length === 9 * q + 1 && l.slice(1).every((w) => /^[1-9]{9}$/.test(w)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const q = Number(l[0]); const o = []; for (let p = 0; p < q; p++) { const g = l.slice(1 + 9 * p, 10 + 9 * p); let ok = true; for (let i = 0; i < 9 && ok; i++) { const w = new Set(), k = new Set(), kw = new Set(); for (let j = 0; j < 9; j++) { w.add(g[i][j]); k.add(g[j][i]); kw.add(g[3 * Math.floor(i / 3) + Math.floor(j / 3)][3 * (i % 3) + (j % 3)]); } if (w.size < 9 || k.size < 9 || kw.size < 9) ok = false; } o.push(ok ? 'TAK' : 'NIE'); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int p = 0; p < q; p++) {
        string t[9];
        for (int i = 0; i < 9; i++) cin >> t[i];
        bool dobra = true;
        for (int i = 0; i < 9; i++) {
            bitset<10> w, k, kw;
            for (int j = 0; j < 9; j++) {
                w[t[i][j] - '0'] = 1;
                k[t[j][i] - '0'] = 1;
                kw[t[3 * (i / 3) + j / 3][3 * (i % 3) + j % 3] - '0'] = 1;
            }
            if (w.count() != 9 || k.count() != 9 || kw.count() != 9) dobra = false;
        }
        cout << (dobra ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-b-bingo', krok: 9, level: 'latwe',
            title: 'Bingo',
            short: 'Karta jest pełna, gdy nie zostało na niej nic niewylosowanego: (karta & ~wylosowane).none(). Sprawdzaj każdą kartę po każdym losowaniu.',
            tags: ['karta & ~wylosowane', 'none()', 'tablica bitsetów'],
            statement: ['W bingo każdy gracz ma kartę z 15 różnymi liczbami od 1 do 75. Prowadzący losuje liczby po kolei (bez powtórzeń). Karta wygrywa w chwili, gdy wylosowano już wszystkie jej liczby.',
                'Dla każdej karty wypisz, w którym losowaniu (licząc od 1) się zapełniła, albo -1, jeśli nie zapełniła się do końca. Karta jest pełna, gdy (karta & ~wylosowane).none() — nie ma na niej liczby, która nie padła.'],
            input_format: ['W pierwszym wierszu liczba kart n.', 'W każdym z kolejnych n wierszy 15 liczb karty.', 'Potem liczba losowań k, a w następnym wierszu k wylosowanych liczb.'],
            output_format: ['n wierszy: numer losowania, w którym zapełniła się karta, albo -1.'],
            constraints: ['1 ≤ n ≤ 500', '1 ≤ k ≤ 75', 'liczby na karcie są różne, wylosowane liczby też'],
            examples: [{ input: '2\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15\n61 62 63 64 65 66 67 68 69 70 71 72 73 74 75\n16\n15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 75', note: 'Pierwsza karta zapełnia się w 15. losowaniu. Na drugiej padła tylko 75.' }],
            hint: R`bitset<76> karta[500], wylosowane; int wynik[500]; (na start -1). Po każdym losowaniu t: for (int i = 0; i < n; i++) if (wynik[i] == -1 && (karta[i] & ~wylosowane).none()) wynik[i] = t;.`,
            tests: (r) => {
                const karta = () => rozne(r, 15, 1, 75).join(' ');
                const gen = (n, k) => `${n}\n${Array.from({ length: n }, karta).join('\n')}\n${k}\n${rozne(r, k, 1, 75).join(' ')}`;
                return ['2\n1 2 3 4 5 6 7 8 9 10 11 12 13 14 15\n61 62 63 64 65 66 67 68 69 70 71 72 73 74 75\n16\n15 14 13 12 11 10 9 8 7 6 5 4 3 2 1 75', gen(500, 75), gen(500, 60), gen(1, 15), gen(200, 40), gen(500, 70)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 500)) return 'dane'; const k = t[1 + 15 * n]; if (!calk(k, 1, 75) || t.length !== 2 + 15 * n + k) return 'dane'; for (let i = 0; i < n; i++) { const c = t.slice(1 + 15 * i, 16 + 15 * i); if (new Set(c).size !== 15 || !c.every((x) => calk(x, 1, 75))) return 'karta'; } const w = t.slice(2 + 15 * n); return new Set(w).size === k && w.every((x) => calk(x, 1, 75)) ? null : 'losowanie'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const k = t[1 + 15 * n]; const kiedy = new Array(76).fill(Infinity); t.slice(2 + 15 * n).forEach((x, i) => { kiedy[x] = i + 1; }); const o = []; for (let i = 0; i < n; i++) { const m = Math.max(...t.slice(1 + 15 * i, 16 + 15 * i).map((x) => kiedy[x])); o.push(m === Infinity ? -1 : m); } void k; return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<76> karta[500];
int wynik[500];
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        karta[i].reset();
        wynik[i] = -1;
        for (int j = 0; j < 15; j++) {
            int x;
            cin >> x;
            karta[i][x] = 1;
        }
    }
    int k;
    cin >> k;
    bitset<76> wylosowane;
    for (int t = 1; t <= k; t++) {
        int x;
        cin >> x;
        wylosowane[x] = 1;
        for (int i = 0; i < n; i++) {
            if (wynik[i] == -1 && (karta[i] & ~wylosowane).none()) wynik[i] = t;
        }
    }
    for (int i = 0; i < n; i++) cout << wynik[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-urlopy', krok: 9, level: 'latwe',
            title: 'Kalendarz urlopów',
            short: 'Zapal w bitsecie roku każdy dzień czyjegoś urlopu. count() da liczbę dni z kimś na urlopie, a najdłuższą serię zgaszonych bitów znajdziesz jedną pętlą.',
            tags: ['bitset<366>', 'zapalanie przedziałów', 'najdłuższa seria zer'],
            statement: ['W firmie pracuje n osób. Każda podała swoje urlopy jako przedziały dni od a do b (dni roku numerujemy od 1 do 365). Szef chce wiedzieć dwie rzeczy: przez ile dni roku ktoś jest na urlopie oraz jak długa jest najdłuższa seria kolejnych dni, w których nikt nie ma urlopu.',
                'Zapal w bitset<366> wszystkie dni urlopów (pętla od a do b). Dni z kimś na urlopie to count(), a najdłuższą serię dni bez urlopów znajdziesz pętlą od 1 do 365 z licznikiem bieżącej serii.'],
            input_format: ['W pierwszym wierszu liczba n.', 'Dla każdej osoby wiersz z liczbą urlopów k, a po niej k par liczb a b.'],
            output_format: ['Jeden wiersz: liczba dni z kimś na urlopie i długość najdłuższej serii dni bez urlopów.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ k ≤ 20', 'w całych danych jest najwyżej 5000 urlopów', '1 ≤ a ≤ b ≤ 365'],
            examples: [{ input: '3\n2 10 20 100 105\n1 15 30\n0', note: 'Urlopy pokrywają dni 10–30 (21 dni) i 100–105 (6 dni) — razem 27. Najdłuższa seria bez urlopów to dni 106–365: 260 dni.' }],
            hint: R`bitset<366> urlop; for (int d = a; d <= b; d++) urlop[d] = 1;. Seria: int seria = 0, naj = 0; for (int d = 1; d <= 365; d++) { if (urlop[d]) seria = 0; else seria++; naj = max(naj, seria); }.`,
            tests: (r) => {
                const gen = (n, kmax, dl) => { let ile = 0; const o = []; for (let i = 0; i < n; i++) { const k = Math.min(r.int(0, kmax), 5000 - ile); ile += k; o.push(`${k}${Array.from({ length: k }, () => { const a = r.int(1, 365); return ` ${a} ${Math.min(365, a + r.int(0, dl))}`; }).join('')}`); } return `${n}\n${o.join('\n')}`; };
                return ['3\n2 10 20 100 105\n1 15 30\n0', '1\n0', '1\n1 1 365', '2\n1 1 1\n1 365 365', gen(1000, 5, 3), gen(1000, 20, 0), gen(50, 3, 14), gen(10, 2, 20), gen(300, 1, 1)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 1000)) return 'dane'; let i = 1, ile = 0; for (let p = 0; p < n; p++) { const k = t[i++]; if (!calk(k, 0, 20)) return 'dane'; ile += k; for (let j = 0; j < k; j++) { const a = t[i++], b = t[i++]; if (!calk(a, 1, 365) || !calk(b, a, 365)) return 'dane'; } } return i === t.length && ile <= 5000 ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const u = new Uint8Array(366); let i = 1; for (let p = 0; p < n; p++) { const k = t[i++]; for (let j = 0; j < k; j++) { const a = t[i++], b = t[i++]; for (let d = a; d <= b; d++) u[d] = 1; } } let c = 0, s = 0, naj = 0; for (let d = 1; d <= 365; d++) { if (u[d]) { c++; s = 0; } else { s++; naj = Math.max(naj, s); } } return `${c} ${naj}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    bitset<366> urlop;
    for (int i = 0; i < n; i++) {
        int k;
        cin >> k;
        for (int j = 0; j < k; j++) {
            int a, b;
            cin >> a >> b;
            for (int d = a; d <= b; d++) urlop[d] = 1;
        }
    }
    int seria = 0, naj = 0;
    for (int d = 1; d <= 365; d++) {
        if (urlop[d]) seria = 0;
        else seria++;
        naj = max(naj, seria);
    }
    cout << urlop.count() << " " << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-album', krok: 9, level: 'latwe',
            title: 'Album z naklejkami',
            short: 'Paczki po 5 naklejek trafiają do albumu. Zanim zapalisz bit naklejki, sprawdź, czy już świeci — to dubel. Album jest pełny, gdy count() == n.',
            tags: ['sprawdź, potem zapal', 'licznik dubli', 'count() == n'],
            statement: ['Album ma n miejsc na naklejki o numerach od 1 do n. Kasia kupuje kolejno q paczek, w każdej jest 5 naklejek (numery w paczce mogą się powtarzać). Naklejka, którą Kasia już ma w chwili otwarcia, to dubel.',
                'Wypisz numer paczki, po której otwarciu album jest pełny (albo -1, jeśli się nie zapełni), oraz liczbę wszystkich dubli we wszystkich paczkach.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z kolejnych q wierszy 5 numerów naklejek z jednej paczki.'],
            output_format: ['Jeden wiersz: numer paczki albo -1 i liczba dubli.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ q ≤ 3000', '1 ≤ każdy numer ≤ n'],
            examples: [{ input: '6 3\n1 2 2 3 4\n4 5 1 1 1\n6 2 3 5 6', note: 'W pierwszej paczce dubel to druga dwójka. W drugiej — czwórka i trzy jedynki. Po trzeciej paczce album jest pełny; dubli razem 1 + 4 + 4 = 9.' }],
            hint: R`bitset<1001> mam; dla każdej naklejki x: if (mam[x]) duble++; else mam[x] = 1;. Po każdej paczce: if (pelny == -1 && (int)mam.count() == n) pelny = numer paczki;.`,
            tests: (r) => {
                const gen = (n, q) => `${n} ${q}\n${Array.from({ length: q }, () => r.arr(5, 1, n).join(' ')).join('\n')}`;
                return ['6 3\n1 2 2 3 4\n4 5 1 1 1\n6 2 3 5 6', '1 1\n1 1 1 1 1', '6 1\n1 2 3 4 5', gen(1000, 3000), gen(1000, 1000), gen(50, 3000), gen(1000, 200), gen(5, 1)];
            },
            check: (inp) => { const l = L(inp); const [n, q] = l[0].split(' ').map(Number); return calk(n, 1, 1000) && calk(q, 1, 3000) && l.length === q + 1 && l.slice(1).every((w) => { const a = w.split(' ').map(Number); return a.length === 5 && a.every((x) => calk(x, 1, n)); }) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const n = Number(l[0].split(' ')[0]); const mam = new Uint8Array(n + 1); let ile = 0, dub = 0, pel = -1; l.slice(1).forEach((w, i) => { for (const x of w.split(' ').map(Number)) { if (mam[x]) dub++; else { mam[x] = 1; ile++; } } if (pel === -1 && ile === n) pel = i + 1; }); return `${pel} ${dub}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    bitset<1001> mam;
    int duble = 0, pelny = -1;
    for (int p = 1; p <= q; p++) {
        for (int j = 0; j < 5; j++) {
            int x;
            cin >> x;
            if (mam[x]) duble++;
            else mam[x] = 1;
        }
        if (pelny == -1 && (int)mam.count() == n) pelny = p;
    }
    cout << pelny << " " << duble << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-wieze', krok: 9, level: 'latwe',
            title: 'Wieże na szachownicy',
            short: 'Wieża bije cały swój wiersz i całą kolumnę. Zaznacz zajęte wiersze i kolumny w dwóch bitsetach — bezpiecznych pól jest (n − wiersze) · (n − kolumny).',
            tags: ['dwa bitsety', 'count()', 'long long'],
            statement: ['Na szachownicy n × n stoi k wież. Wieża bije wszystkie pola w swoim wierszu i w swojej kolumnie (inne figury jej nie zasłaniają). Ile pól nie jest bitych przez żadną wieżę i nie stoi na nich wieża?',
                'Pole jest bezpieczne, gdy jego wiersz i jego kolumna są wolne od wież. Zaznacz wiersze i kolumny z wieżami w dwóch bitsetach — wynik to (n − liczba zajętych wierszy) · (n − liczba zajętych kolumn). Może przekroczyć zakres int.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W każdym z kolejnych k wierszy pozycja wieży: wiersz i kolumna (od 1 do n).'],
            output_format: ['Jedna liczba — liczba bezpiecznych pól.'],
            constraints: ['1 ≤ n ≤ 100 000', '1 ≤ k ≤ 7000', 'na jednym polu stoi najwyżej jedna wieża'],
            examples: [{ input: '8 3\n1 1\n1 5\n4 5', note: 'Zajęte wiersze: 1 i 4, zajęte kolumny: 1 i 5. Bezpiecznych pól jest (8 − 2) · (8 − 2) = 36.' }],
            hint: R`bitset<100001> w, k; przed main. Dla każdej wieży: w[r] = 1; k[c] = 1;. Wynik: (long long)(n - w.count()) * (n - k.count()).`,
            tests: (r) => {
                const gen = (n, k) => { const s = new Set(); const o = []; while (o.length < k) { const a = r.int(1, n), b = r.int(1, n); const key = a * (n + 1) + b; if (s.has(key)) continue; s.add(key); o.push(`${a} ${b}`); } return `${n} ${k}\n${o.join('\n')}`; };
                return ['8 3\n1 1\n1 5\n4 5', '1 1\n1 1', gen(100000, 7000), gen(100, 7000), gen(100000, 1), gen(1000, 500), `100000 2\n1 1\n100000 100000`];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; if (!calk(n, 1, 100000) || !calk(k, 1, 7000) || t.length !== 2 + 2 * k) return 'dane'; const s = new Set(); for (let i = 0; i < k; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; if (!calk(a, 1, n) || !calk(b, 1, n)) return 'dane'; const key = a * (n + 1) + b; if (s.has(key)) return 'dwie wieże'; s.add(key); } return null; },
            solve: (inp) => { const t = nums(inp); const [n, k] = t; const w = new Set(), c = new Set(); for (let i = 0; i < k; i++) { w.add(t[2 + 2 * i]); c.add(t[3 + 2 * i]); } return String(BigInt(n - w.size) * BigInt(n - c.size)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<100001> w, k;
int main() {
    w.reset(); // zerowanie przed testem
    k.reset();
    int n, ile;
    cin >> n >> ile;
    for (int i = 0; i < ile; i++) {
        int a, b;
        cin >> a >> b;
        w[a] = 1;
        k[b] = 1;
    }
    long long wynik = (long long)(n - w.count()) * (n - k.count());
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-bezkwadratowe', krok: 9, level: 'latwe',
            title: 'Liczby bez kwadratów',
            short: 'Sito w nowym przebraniu: skreślaj wielokrotności kwadratów 4, 9, 16, 25… Nieskreślone liczby nie dzielą się przez żaden kwadrat większy od 1.',
            tags: ['sito wielokrotności i · i', 'krok j += i * i', 'bitset<10000001>'],
            statement: ['Liczba jest bezkwadratowa, jeśli nie dzieli się przez żaden kwadrat liczby większej od 1 — czyli przez 4, 9, 16, 25, … Na przykład 30 = 2 · 3 · 5 jest bezkwadratowa, a 12 = 4 · 3 — nie. Ile jest liczb bezkwadratowych od 1 do n?',
                'Zrób sito: dla każdego i od 2, dopóki i · i ≤ n, skreśl wszystkie wielokrotności i · i. Liczby nieskreślone są bezkwadratowe.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Jedna liczba — ile jest liczb bezkwadratowych od 1 do n.'],
            constraints: ['1 ≤ n ≤ 10 000 000'],
            examples: [{ input: '12', note: 'Skreślone: 4, 8, 12 (wielokrotności 4) i 9. Zostaje 12 − 4 = 8 liczb: 1, 2, 3, 5, 6, 7, 10, 11.' }],
            hint: R`bitset<10000001> skreslona; przed main. for (long long i = 2; i * i <= n; i++) for (long long j = i * i; j <= n; j += i * i) skreslona[j] = 1;. Potem policz nieskreślone od 1 do n.`,
            tests: () => ['12', '1', '4', '100', '1000000', '10000000', '9999991', '123456'],
            check: (inp) => (/^\d+$/.test(inp) && calk(Number(inp), 1, 10000000) ? null : 'dane'),
            solve: (inp) => { const n = Number(inp); const s = new Uint8Array(n + 1); for (let i = 2; i * i <= n; i++) for (let j = i * i; j <= n; j += i * i) s[j] = 1; let c = 0; for (let x = 1; x <= n; x++) if (!s[x]) c++; return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<10000001> skreslona;
int main() {
    skreslona.reset(); // zerowanie przed testem
    int n;
    cin >> n;
    for (long long i = 2; i * i <= n; i++) {
        for (long long j = i * i; j <= n; j += i * i) skreslona[j] = 1;
    }
    int ile = 0;
    for (int x = 1; x <= n; x++) {
        if (!skreslona[x]) ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-pierwsze-palindromy', krok: 9, level: 'latwe',
            title: 'Pierwsze palindromy',
            short: 'Sito do n, a potem dla każdej liczby pierwszej sprawdź, czy czytana od tyłu jest taka sama. Takich liczb jest zaskakująco mało.',
            tags: ['sito', 'odwracanie liczby', 'to_string i reverse'],
            statement: ['Wypisz wszystkie liczby pierwsze nie większe od n, które są palindromami — czytane od tyłu dają tę samą liczbę, jak 11, 101 czy 313.',
                'W pierwszym wierszu wypisz, ile ich jest, a w drugim — je same rosnąco. Ciekawostka: poza liczbą 11 żaden palindrom o parzystej liczbie cyfr nie jest pierwszy, bo dzieli się przez 11.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['W pierwszym wierszu liczba pierwszych palindromów.', 'W drugim wierszu te liczby rosnąco.'],
            constraints: ['2 ≤ n ≤ 10 000 000'],
            examples: [{ input: '200', note: 'Jednocyfrowe 2, 3, 5, 7, potem 11 i trzycyfrowe 101, 131, 151, 181, 191 — razem 10.' }],
            hint: R`Po sicie: for (int p = 2; p <= n; p++) if (!zlozona[p]) { string s = to_string(p), t = s; reverse(t.begin(), t.end()); if (s == t) … }.`,
            tests: () => ['200', '2', '10', '11', '1000', '100000', '10000000', '9999999'],
            check: (inp) => (/^\d+$/.test(inp) && calk(Number(inp), 2, 10000000) ? null : 'dane'),
            solve: (inp) => { const n = Number(inp); const z = sito(10000000); const w = []; for (let p = 2; p <= n; p++) if (!z[p]) { const s = String(p); if (s === s.split('').reverse().join('')) w.push(p); } return `${w.length}\n${w.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int N = 10000000;
bitset<N + 1> zlozona;
int main() {
    int n;
    cin >> n;
    zlozona[0] = zlozona[1] = 1;
    for (int i = 2; i * i <= N; i++) {
        if (!zlozona[i]) {
            for (int j = i * i; j <= N; j += i) zlozona[j] = 1;
        }
    }
    vector<int> wynik;
    for (int p = 2; p <= n; p++) {
        if (!zlozona[p]) {
            string s = to_string(p), t = s;
            reverse(t.begin(), t.end());
            if (s == t) wynik.push_back(p);
        }
    }
    cout << wynik.size() << "\n";
    for (int x : wynik) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-kod-kreskowy', krok: 9, level: 'latwe',
            title: 'Kod kreskowy',
            short: 'Kreska zaczyna się tam, gdzie po zerze stoi jedynka: b & ~(b << 1). Najszerszą kreskę zmierzysz, „ścierając” po jednej kolumnie: c &= c >> 1, aż nic nie zostanie.',
            tags: ['b & ~(b << 1)', 'c &= c >> 1', 'liczba kroków = szerokość'],
            statement: ['Kod kreskowy zapisano jako napis z zer i jedynek: 1 to czarny pasek o szerokości jednej kolumny. Kilka jedynek obok siebie tworzy jedną grubą kreskę. Dla każdego kodu wypisz, ile ma kresek i jak szeroka jest najszersza z nich.',
                'Dwa sposoby bez pętli po kolumnach: początek kreski to jedynka, przed którą stoi zero — wszystkie początki naraz to b & ~(b << 1). A c &= c >> 1 skraca każdą kreskę o jedną kolumnę — ile razy da się to zrobić, zanim c zgaśnie, tak szeroka jest najszersza kreska.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy napis z zer i jedynek.'],
            output_format: ['q wierszy: liczba kresek i szerokość najszerszej (dla kodu bez kresek: 0 0).'],
            constraints: ['1 ≤ q ≤ 100', 'każdy napis ma od 1 do 20 000 znaków', 'wszystkie napisy mają razem najwyżej 60 000 znaków'],
            examples: [{ input: '3\n0110111001\n0000\n1', note: 'Pierwszy kod ma trzy kreski: o szerokości 2, 3 i 1. Drugi nie ma żadnej. Trzeci to jedna wąska kreska.' }],
            hint: R`bitset<20000> b(s); int kreski = (b & ~(b << 1)).count();. Szerokość: bitset<20000> c = b; int szer = 0; while (c.any()) { c &= c >> 1; szer++; }.`,
            tests: (r) => {
                const kod = (len, p1, p0) => { let s = ''; let st = r() < 0.5; while (s.length < len) { s += st ? '1' : '0'; if (r() < (st ? p0 : p1)) st = !st; } return s; };
                return [wiersze(['0110111001', '0000', '1']), wiersze([kod(20000, 0.3, 0.3), kod(20000, 0.01, 0.001), kod(20000, 0.5, 0.5)]), wiersze(Array.from({ length: 100 }, () => kod(r.int(1, 500), r(), r()))), wiersze(['1'.repeat(20000), '0'.repeat(20000), '10'.repeat(10000)])];
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 100) && l.length === q + 1 && l.slice(1).every((s) => /^[01]{1,20000}$/.test(s)) && suma(l.slice(1).map((s) => s.length)) <= 60000 ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((s) => { let k = 0, seria = 0, naj = 0; for (let i = 0; i < s.length; i++) { if (s[i] === '1') { seria++; if (seria === 1) k++; naj = Math.max(naj, seria); } else seria = 0; } return `${k} ${naj}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string s;
        cin >> s;
        bitset<20000> b(s);
        int kreski = (b & ~(b << 1)).count();
        bitset<20000> c = b;
        int szer = 0;
        while (c.any()) {
            c &= c >> 1;
            szer++;
        }
        cout << kreski << " " << szer << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ BAZA · średnie
        {
            id: 'bs-b-ankieta', krok: 9, level: 'srednie',
            title: 'Wyniki ankiety',
            short: 'Odwróć tabelę: zamiast bitsetu dla każdej osoby zrób bitset dla każdego pytania — kto odpowiedział TAK. Pytanie o dwa pytania naraz to jedno & i count().',
            tags: ['bitset na pytanie', 'pyt[j][osoba]', '(pyt[i] & pyt[j]).count()'],
            statement: ['W ankiecie wzięło udział n osób, a każda odpowiedziała na m pytań TAK (1) albo NIE (0). Teraz trzeba szybko odpowiadać na pytania typu: ile osób odpowiedziało TAK zarówno na pytanie i, jak i na pytanie j? (Gdy i = j — po prostu ile osób odpowiedziało TAK na pytanie i.)',
                'Zbuduj osobny bitset dla każdego pytania: bit numer p świeci, gdy osoba p odpowiedziała na to pytanie TAK. Wtedy każde zapytanie to (pyt[i] & pyt[j]).count().'],
            input_format: ['W pierwszym wierszu liczby n, m i q.', 'W każdym z kolejnych n wierszy napis z m zer i jedynek — odpowiedzi jednej osoby (pierwszy znak to pytanie 1).', 'W każdym z kolejnych q wierszy dwa numery pytań i oraz j.'],
            output_format: ['q wierszy: liczba osób, które odpowiedziały TAK na oba pytania.'],
            constraints: ['1 ≤ n ≤ 1500', '1 ≤ m ≤ 40', '1 ≤ q ≤ 3000', '1 ≤ i, j ≤ m'],
            examples: [{ input: '4 3 3\n110\n111\n010\n101\n1 2\n3 3\n1 3', note: 'Na pytania 1 i 2 TAK powiedziały osoby 1 i 2. Na pytanie 3 — osoby 2 i 4. Na pytania 1 i 3 — tylko osoby 2 i 4.' }],
            hint: R`bitset<1500> pyt[41]; dla osoby p i pytania j: if (s[j - 1] == '1') pyt[j][p] = 1;. Zapytanie: cout << (pyt[i] & pyt[j]).count() << "\n";.`,
            tests: (r) => {
                const gen = (n, m, q, pp) => { const p = Array.from({ length: m }, () => r()); return `${n} ${m} ${q}\n${Array.from({ length: n }, () => p.map((x) => (r() < (pp ? x : 0.5) ? '1' : '0')).join('')).join('\n')}\n${Array.from({ length: q }, () => `${r.int(1, m)} ${r.int(1, m)}`).join('\n')}`; };
                return ['4 3 3\n110\n111\n010\n101\n1 2\n3 3\n1 3', '1 1 1\n0\n1 1', gen(1500, 40, 3000, true), gen(1500, 40, 3000, false), gen(100, 5, 3000, true), gen(1500, 1, 10, true)];
            },
            check: (inp) => { const l = L(inp); const [n, m, q] = l[0].split(' ').map(Number); if (!calk(n, 1, 1500) || !calk(m, 1, 40) || !calk(q, 1, 3000) || l.length !== 1 + n + q) return 'dane'; return l.slice(1, 1 + n).every((s) => s.length === m && /^[01]+$/.test(s)) && l.slice(1 + n).every((w) => { const [i, j] = w.split(' ').map(Number); return calk(i, 1, m) && calk(j, 1, m); }) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const [n, , q] = l[0].split(' ').map(Number); const s = l.slice(1, 1 + n); return l.slice(1 + n, 1 + n + q).map((w) => { const [i, j] = w.split(' ').map(Number); let c = 0; for (const x of s) if (x[i - 1] === '1' && x[j - 1] === '1') c++; return String(c); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1500> pyt[41];
int main() {
    int n, m, q;
    cin >> n >> m >> q;
    for (int j = 0; j <= m; j++) pyt[j].reset(); // zerowanie przed testem
    for (int p = 0; p < n; p++) {
        string s;
        cin >> s;
        for (int j = 1; j <= m; j++) {
            if (s[j - 1] == '1') pyt[j][p] = 1;
        }
    }
    for (int k = 0; k < q; k++) {
        int i, j;
        cin >> i >> j;
        cout << (pyt[i] & pyt[j]).count() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-b-alergie', krok: 9, level: 'srednie',
            title: 'Alergie w stołówce',
            short: 'Dziecko może zjeść danie, gdy w daniu nie ma niczego, na co jest uczulone: (alergie[d] & danie).none(). Dla każdego dania policz takie dzieci.',
            tags: ['(a & b).none()', 'tablica bitsetów', 'dania × dzieci'],
            statement: ['W stołówce je n dzieci, a każde jest uczulone na kilka składników (numery od 1 do 300). Kucharz przygotował m dań, każde ze swoich składników. Dla każdego dania policz, ile dzieci może je zjeść — czyli ile dzieci nie jest uczulonych na żaden składnik tego dania.',
                'Zapisz alergie każdego dziecka i składniki każdego dania w bitsetach. Dziecko d może zjeść danie, gdy (alergie[d] & danie).none().'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy liczba k, a po niej k składników, na które dziecko jest uczulone.', 'W każdym z kolejnych m wierszy liczba k, a po niej k składników dania.'],
            output_format: ['m wierszy: liczba dzieci, które mogą zjeść danie.'],
            constraints: ['1 ≤ n, m ≤ 1000', '0 ≤ k ≤ 300', 'w całych danych jest najwyżej 20 000 numerów składników', '1 ≤ każdy składnik ≤ 300'],
            examples: [{ input: '3 2\n1 5\n2 5 7\n0\n2 1 2\n3 7 8 9', note: 'Pierwsze danie (składniki 1 i 2) mogą zjeść wszyscy. W drugim jest składnik 7 — zje je tylko pierwsze i trzecie dziecko.' }],
            hint: R`bitset<301> alergie[1000]; dla dania: bitset<301> d; wczytaj składniki, a potem int ile = 0; for (int i = 0; i < n; i++) if ((alergie[i] & d).none()) ile++;.`,
            tests: (r) => {
                const gen = (n, m, ka, kd, hi) => { let ile = 0; const lin = (kmax) => { const k = Math.min(r.int(0, kmax), 20000 - ile); ile += k; return listaW(r.arr(k, 1, hi)); }; return `${n} ${m}\n${Array.from({ length: n }, () => lin(ka)).join('\n')}\n${Array.from({ length: m }, () => lin(kd)).join('\n')}`; };
                return ['3 2\n1 5\n2 5 7\n0\n2 1 2\n3 7 8 9', '1 1\n0\n0', gen(1000, 1000, 3, 15, 300), gen(1000, 1000, 2, 8, 100), gen(500, 1000, 10, 10, 300), gen(1000, 100, 1, 100, 300)];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; if (!calk(n, 1, 1000) || !calk(m, 1, 1000)) return 'dane'; let i = 2; for (let w = 0; w < n + m; w++) { const k = t[i++]; if (!calk(k, 0, 300)) return 'dane'; for (let j = 0; j < k; j++) if (!calk(t[i++], 1, 300)) return 'dane'; } return i === t.length && t.length - 2 - n - m <= 20000 ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const [n, m] = t; let i = 2; const czyt = () => { const k = t[i++]; const s = new Set(t.slice(i, i + k)); i += k; return s; }; const a = Array.from({ length: n }, czyt); const o = []; for (let d = 0; d < m; d++) { const s = czyt(); o.push(a.filter((x) => ![...x].some((v) => s.has(v))).length); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<301> alergie[1000];
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < n; i++) {
        alergie[i].reset();
        int k;
        cin >> k;
        for (int j = 0; j < k; j++) {
            int x;
            cin >> x;
            alergie[i][x] = 1;
        }
    }
    for (int d = 0; d < m; d++) {
        bitset<301> danie;
        int k;
        cin >> k;
        for (int j = 0; j < k; j++) {
            int x;
            cin >> x;
            danie[x] = 1;
        }
        int ile = 0;
        for (int i = 0; i < n; i++) {
            if ((alergie[i] & danie).none()) ile++;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-b-anagramy-zbiorow', krok: 9, level: 'srednie',
            title: 'Słowa z tymi samymi literami',
            short: 'Zbiór liter słowa to bitset<26>, a jego to_ulong() — zwykła liczba, która może być kluczem w mapie. map<bitset<26>, int> się nie skompiluje.',
            tags: ['bitset<26>', 'to_ulong() jako klucz', 'map<unsigned long, int>'],
            statement: ['Dwa słowa są „kuzynami”, jeśli są zbudowane z dokładnie tych samych liter — nie liczy się, ile razy litera występuje ani w jakiej kolejności. Na przykład kot, tok i kotto są kuzynami (litery k, o, t), a kota — już nie.',
                'Podziel n słów na grupy kuzynów. Wypisz liczbę grup i liczbę słów w największej grupie. Kluczem grupy jest bitset<26> liter słowa — ale mapa wymaga porównania <, którego bitset nie ma. Użyj więc liczby to_ulong() jako klucza.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy słowo z małych liter.'],
            output_format: ['Jeden wiersz: liczba grup i rozmiar największej grupy.'],
            constraints: ['1 ≤ n ≤ 8000', 'każde słowo ma od 1 do 10 liter'],
            examples: [{ input: '6\nkot\ntok\nkotto\nkota\nala\nla', note: 'Grupy: {kot, tok, kotto}, {kota}, {ala, la}. Trzy grupy, największa ma 3 słowa.' }],
            hint: R`map<unsigned long, int> grupy; dla słowa: bitset<26> b; for (char c : s) b[c - 'a'] = 1; grupy[b.to_ulong()]++;. Liczba grup to grupy.size().`,
            tests: (r) => [wiersze(['kot', 'tok', 'kotto', 'kota', 'ala', 'la']), wiersze(['a']), wiersze(Array.from({ length: 8000 }, () => slowo(r, 1, 10, 'abcde'))), wiersze(Array.from({ length: 8000 }, () => slowo(r, 1, 10))), wiersze(Array.from({ length: 8000 }, () => slowo(r, 3, 10, 'abcdefgh'))), wiersze(Array.from({ length: 2000 }, () => slowo(r, 1, 3, 'xyz')))],
            check: (inp) => { const l = L(inp); const n = Number(l[0]); return calk(n, 1, 8000) && l.length === n + 1 && l.slice(1).every((w) => /^[a-z]{1,10}$/.test(w)) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const w of L(inp).slice(1)) { const k = [...new Set(w)].sort().join(''); m.set(k, (m.get(k) || 0) + 1); } return `${m.size} ${Math.max(...m.values())}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<unsigned long, int> grupy;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        bitset<26> b;
        for (char c : s) b[c - 'a'] = 1;
        grupy[b.to_ulong()]++;
    }
    int naj = 0;
    for (auto [klucz, ile] : grupy) naj = max(naj, ile);
    cout << grupy.size() << " " << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-linijka', krok: 9, level: 'srednie',
            title: 'Linijka z kreskami',
            short: 'Kreski to bitset K. Odległości od kreski p do kresek dalej to K >> p — wystarczy zrobić OR takich przesunięć dla wszystkich kresek.',
            tags: ['D |= K >> p', 'różnice zamiast sum', 'najmniejsza brakująca'],
            statement: ['Na linijce długości L narysowano n kresek w różnych miejscach (pozycje od 0 do L). Linijką można zmierzyć odcinek długości d, jeśli dwie kreski są odległe dokładnie o d. Ile długości od 1 do L da się zmierzyć i jaka jest najmniejsza długość, której zmierzyć się nie da?',
                'Zapisz kreski w bitsecie K. Dla kreski na pozycji p zbiór K >> p zawiera odległości od p do wszystkich kresek leżących dalej — OR tych przesunięć po wszystkich kreskach daje wszystkie możliwe odległości (bit 0 to odległość kreski od samej siebie — pomiń go). Jeśli da się zmierzyć wszystko, zamiast najmniejszej brakującej wypisz wszystkie.'],
            input_format: ['W pierwszym wierszu liczby L i n.', 'W drugim wierszu n różnych pozycji kresek.'],
            output_format: ['Jeden wiersz: liczba długości, które da się zmierzyć, i najmniejsza długość, której się nie da (albo słowo wszystkie).'],
            constraints: ['1 ≤ L ≤ 100 000', '1 ≤ n ≤ 10 000', '0 ≤ każda pozycja ≤ L'],
            examples: [{ input: '6 4\n0 1 4 6', note: 'Odległości: 1, 4, 6, 3, 5, 2 — każda długość od 1 do 6, dokładnie raz. To słynna linijka Golomba.' },
                { input: '10 3\n0 3 10', note: 'Da się zmierzyć 3, 7 i 10. Najmniejsza brakująca długość to 1.' }],
            hint: R`bitset<100001> K, D; dla każdej kreski K[p] = 1; zapamiętaj też pozycje w vectorze. Potem for (int p : kreski) D |= K >> p; D[0] = 0;. Szukaj pierwszego zgaszonego bitu od 1 do L.`,
            tests: (r) => [`6 4\n0 1 4 6`, `10 3\n0 3 10`, `1 1\n0`, `100000 10000\n${rozne(r, 10000, 0, 100000).join(' ')}`, `100000 500\n${rozne(r, 500, 0, 100000).join(' ')}`, `100000 2000\n${rozne(r, 2000, 0, 100000).join(' ')}`, `1000 1001\n${r.shuffle(Array.from({ length: 1001 }, (_, i) => i)).join(' ')}`, `100000 7\n0 1 2 3 99997 99998 100000`],
            check: (inp) => { const t = nums(inp); const [Ld, n] = t; return calk(Ld, 1, 100000) && calk(n, 1, 10000) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 0, Ld)) && new Set(t.slice(2)).size === n ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const Ld = t[0]; const k = t.slice(2).sort((a, b) => a - b); const K = new Uint8Array(Ld + 1); k.forEach((p) => { K[p] = 1; }); const D = new Uint8Array(Ld + 1); for (const p of k) for (let q = p + 1; q <= Ld; q++) if (K[q]) D[q - p] = 1; let c = 0, brak = 0; for (let d = 1; d <= Ld; d++) { if (D[d]) c++; else if (!brak) brak = d; } return `${c} ${brak || 'wszystkie'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<100001> K, D;
int main() {
    K.reset(); // zerowanie przed testem
    D.reset();
    int L, n;
    cin >> L >> n;
    vector<int> kreski(n);
    for (int i = 0; i < n; i++) {
        cin >> kreski[i];
        K[kreski[i]] = 1;
    }
    for (int p : kreski) D |= K >> p;
    D[0] = 0;
    int brak = 0;
    for (int d = 1; d <= L; d++) {
        if (!D[d]) {
            brak = d;
            break;
        }
    }
    cout << D.count() << " ";
    if (brak == 0) cout << "wszystkie\n";
    else cout << brak << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-najwiecej-wspolnych', krok: 9, level: 'srednie',
            title: 'Najwięcej wspólnych znajomych',
            short: 'Sprawdź wszystkie pary osób: (z[u] & z[v]).count(). Par jest pół miliona, a każda to tylko 16 słów po 64 bity — pętla po osobach dla każdej pary byłaby za wolna.',
            tags: ['wszystkie pary', '(z[u] & z[v]).count()', 'remisy'],
            statement: ['W sieci jest n osób i m par znajomych. Znajdź dwie osoby (nie muszą się znać), które mają najwięcej wspólnych znajomych. Przy remisie wybierz parę z najmniejszym pierwszym numerem, a potem z najmniejszym drugim. Wypisz numery osób (mniejszy pierwszy) i liczbę wspólnych znajomych.',
                'Par jest około pół miliona. Sprawdzanie każdej pętlą po wszystkich osobach to n³ = miliard kroków. Na bitsetach każda para kosztuje kilkanaście kroków.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy para znajomych.'],
            output_format: ['Jeden wiersz: dwie osoby i liczba ich wspólnych znajomych.'],
            constraints: ['2 ≤ n ≤ 1000', '1 ≤ m ≤ 10 000', 'każda para znajomych występuje najwyżej raz'],
            examples: [{ input: '5 5\n1 3\n2 3\n1 4\n2 4\n4 5', note: 'Osoby 1 i 2 mają dwóch wspólnych znajomych: 3 i 4. Żadna inna para nie ma więcej.' }],
            hint: R`bitset<1001> z[1001]; potem dwie pętle u < v: int c = (z[u] & z[v]).count(); if (c > naj) { naj = c; a = u; b = v; }. Na start naj = -1, żeby para 1 2 wygrała, gdy wszędzie jest 0.`,
            tests: (r) => {
                const gen = (n, m, grupa) => grafTxt(n, grupa ? losGrafGrupy(r, n, m, grupa) : losGraf(r, n, m));
                return ['5 5\n1 3\n2 3\n1 4\n2 4\n4 5', '2 1\n1 2', '3 1\n2 3', gen(1000, 10000, 0), gen(1000, 10000, 40), gen(200, 10000, 0), gen(1000, 2000, 0), gen(1000, 10000, 10)];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; if (!calk(n, 2, 1000) || !calk(m, 1, 10000) || t.length !== 2 + 2 * m) return 'dane'; const s = new Set(); for (let i = 0; i < m; i++) { let a = t[2 + 2 * i], b = t[3 + 2 * i]; if (!calk(a, 1, n) || !calk(b, 1, n) || a === b) return 'dane'; if (a > b) [a, b] = [b, a]; if (s.has(a * 2000 + b)) return 'dane'; s.add(a * 2000 + b); } return null; },
            solve: (inp) => { const t = nums(inp); const [n, m] = t; const adj = Array.from({ length: n + 1 }, () => []); for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; adj[a].push(b); adj[b].push(a); } const c = Array.from({ length: n + 1 }, () => new Int32Array(n + 1)); for (let w = 1; w <= n; w++) { const s = adj[w]; for (let i = 0; i < s.length; i++) for (let j = 0; j < s.length; j++) if (i !== j) c[s[i]][s[j]]++; } let best = -1, a = 0, b = 0; for (let u = 1; u <= n; u++) for (let v = u + 1; v <= n; v++) if (c[u][v] > best) { best = c[u][v]; a = u; b = v; } return `${a} ${b} ${best}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1001> z[1001];
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i <= n; i++) z[i].reset(); // zerowanie przed testem
    for (int i = 0; i < m; i++) {
        int a, b;
        cin >> a >> b;
        z[a][b] = 1;
        z[b][a] = 1;
    }
    int naj = -1, a = 0, b = 0;
    for (int u = 1; u <= n; u++) {
        for (int v = u + 1; v <= n; v++) {
            int c = (z[u] & z[v]).count();
            if (c > naj) {
                naj = c;
                a = u;
                b = v;
            }
        }
    }
    cout << a << " " << b << " " << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-kursy', krok: 9, level: 'srednie',
            title: 'Kursy na wakacje',
            short: 'Kursów jest najwyżej 16, więc przejrzyj wszystkie wybory maską od 1 do 2ⁿ − 1. Tematy wybranych kursów łączy OR bitsetów, a pełne pokrycie to count() == m.',
            tags: ['maski z lekcji 27', 'OR wybranych bitsetów', 'najmniej kursów'],
            statement: ['Na wakacje oferowanych jest n kursów, a każdy obejmuje kilka z m tematów (numery od 1 do m). Jaka jest najmniejsza liczba kursów, na które trzeba się zapisać, żeby poznać wszystkie m tematów? Jeśli się nie da, wypisz -1.',
                'Kursów jest mało, więc sprawdź wszystkie możliwe wybory — każdy wybór to maska od 1 do 2ⁿ − 1, jak w lekcji Liczby dwójkowe. Tematy z wybranych kursów to OR ich bitsetów. Wybór jest dobry, gdy (int)razem.count() == m.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy liczba k, a po niej k różnych tematów kursu.'],
            output_format: ['Jedna liczba — najmniejsza liczba kursów albo -1.'],
            constraints: ['1 ≤ n ≤ 16', '1 ≤ m ≤ 500', '0 ≤ k ≤ m', '1 ≤ każdy temat ≤ m'],
            examples: [{ input: '4 5\n2 1 2\n3 2 3 4\n2 4 5\n1 5', note: 'Kursy 1 i 3 dają tematy 1, 2, 4, 5 — brakuje 3. Kursy 1, 2 i 3 (albo 1, 2 i 4) pokrywają wszystko. Dwóch kursów nie wystarczy, więc odpowiedź to 3.' },
                { input: '2 3\n1 1\n1 2', note: 'Tematu 3 nie ma w żadnym kursie.' }],
            hint: R`bitset<501> kurs[16]; for (int maska = 1; maska < (1 << n); maska++) { bitset<501> razem; for (int i = 0; i < n; i++) if ((maska >> i) & 1) razem |= kurs[i]; if ((int)razem.count() == m) naj = min(naj, __builtin_popcount(maska)); }.`,
            tests: (r) => {
                const gen = (n, m, p) => `${n} ${m}\n${Array.from({ length: n }, () => listaW(r.shuffle(Array.from({ length: m }, (_, i) => i + 1)).filter(() => r() < p))).join('\n')}`;
                const pokrycie = (n, m, ile) => { const tem = r.shuffle(Array.from({ length: m }, (_, i) => i + 1)); const grupy = Array.from({ length: n }, () => []); tem.forEach((x, i) => grupy[i % ile].push(x)); for (let i = ile; i < n; i++) grupy[i] = r.shuffle(tem).slice(0, Math.floor(m / (ile + 1))); for (let i = 0; i < ile; i++) grupy[i].push(...r.shuffle(tem).slice(0, r.int(0, 3)).filter((x) => !grupy[i].includes(x))); return `${n} ${m}\n${r.shuffle(grupy).map((g) => listaW(g)).join('\n')}`; };
                return ['4 5\n2 1 2\n3 2 3 4\n2 4 5\n1 5', '2 3\n1 1\n1 2', '1 1\n1 1', gen(16, 500, 0.2), gen(16, 500, 0.4), gen(16, 30, 0.3), pokrycie(16, 500, 5), pokrycie(16, 400, 8), pokrycie(12, 100, 3), gen(16, 500, 0.1)];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; if (!calk(n, 1, 16) || !calk(m, 1, 500)) return 'dane'; let i = 2; for (let c = 0; c < n; c++) { const k = t[i++]; if (!calk(k, 0, m)) return 'dane'; const s = t.slice(i, i + k); i += k; if (new Set(s).size !== k || !s.every((x) => calk(x, 1, m))) return 'dane'; } return i === t.length ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const [n, m] = t; let i = 2; const W = 16;
                const kursy = []; for (let c = 0; c < n; c++) { const k = t[i++]; const w = new Uint32Array(W); for (const x of t.slice(i, i + k)) w[x >> 5] |= 1 << (x & 31); kursy.push(w); i += k; }
                const pelny = new Uint32Array(W); for (let x = 1; x <= m; x++) pelny[x >> 5] |= 1 << (x & 31);
                let naj = Infinity; const u = new Uint32Array(W);
                for (let mask = 1; mask < (1 << n); mask++) {
                    let pc = 0; for (let j = 0; j < n; j++) if ((mask >> j) & 1) pc++;
                    if (pc >= naj) continue;
                    u.fill(0); for (let j = 0; j < n; j++) if ((mask >> j) & 1) for (let k = 0; k < W; k++) u[k] |= kursy[j][k];
                    let ok = true; for (let k = 0; k < W && ok; k++) if (((u[k] & pelny[k]) >>> 0) !== pelny[k]) ok = false;
                    if (ok) naj = pc;
                }
                return String(naj === Infinity ? -1 : naj);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<bitset<501>> kurs(n);
    for (int i = 0; i < n; i++) {
        int k;
        cin >> k;
        for (int j = 0; j < k; j++) {
            int x;
            cin >> x;
            kurs[i][x] = 1;
        }
    }
    int naj = 100;
    for (int maska = 1; maska < (1 << n); maska++) {
        bitset<501> razem;
        for (int i = 0; i < n; i++) {
            if ((maska >> i) & 1) razem |= kurs[i];
        }
        if ((int)razem.count() == m) naj = min(naj, __builtin_popcount(maska));
    }
    if (naj == 100) naj = -1;
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-pokrycie-odcinkami', krok: 9, level: 'srednie',
            title: 'Odcinki bez pętli po punktach',
            short: 'Odcinek [a, b] to maska jedynek: same jedynki przesunięte w prawo, żeby zostało ich b − a + 1, i potem w lewo o a — jedno działanie zamiast pętli po punktach.',
            tags: ['~bitset<N>() >> (N - dl) << a', 'pokrycie |= maska', 'kawałki: b & ~(b << 1)'],
            statement: ['Na osi narysowano n odcinków o końcach w punktach całkowitych od 0 do 999 999. Ile punktów całkowitych należy do co najmniej jednego odcinka i na ile osobnych kawałków rozpada się pokryta część osi? Odcinek [a, b] zawiera punkty a, a + 1, …, b.',
                'Odcinki mogą być bardzo długie — razem nawet 3 miliardy punktów. W tym zadaniu ćwiczysz budowanie całego odcinka jednym działaniem, bez pętli po punktach. Zbuduj odcinek jako maskę: ~bitset<N>() to same jedynki; po przesunięciu w prawo o N − dl zostaje dl jedynek na samym dole, a przesunięcie w lewo o a stawia je na pozycjach od a do b. Kawałki policzysz jak kreski w kodzie kreskowym.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy końce odcinka a i b.'],
            output_format: ['Jeden wiersz: liczba pokrytych punktów i liczba kawałków.'],
            constraints: ['1 ≤ n ≤ 3000', '0 ≤ a ≤ b ≤ 999 999'],
            examples: [{ input: '3\n1 5\n4 9\n20 20', note: 'Odcinki [1, 5] i [4, 9] zlewają się w [1, 9] — 9 punktów. Do tego punkt 20. Razem 10 punktów w 2 kawałkach.' }],
            hint: R`const int N = 1000000; bitset<N> pokrycie; przed main. Dla odcinka: int dl = b - a + 1; pokrycie |= (~bitset<N>() >> (N - dl)) << a;. Kawałki: (pokrycie & ~(pokrycie << 1)).count().`,
            tests: (r) => {
                const gen = (n, dl) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(0, 999999); return `${a} ${Math.min(999999, a + r.int(0, dl))}`; }).join('\n')}`;
                return ['3\n1 5\n4 9\n20 20', '1\n0 999999', '2\n0 0\n999999 999999', gen(3000, 999999), gen(3000, 300), gen(3000, 30000), gen(3000, 2000), `3000\n${Array.from({ length: 3000 }, (_, i) => `${i * 333} ${i * 333 + 332}`).join('\n')}`];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 3000) || t.length !== 1 + 2 * n) return 'dane'; for (let i = 0; i < n; i++) { const a = t[1 + 2 * i], b = t[2 + 2 * i]; if (!calk(a, 0, 999999) || !calk(b, a, 999999)) return 'dane'; } return null; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const o = []; for (let i = 0; i < n; i++) o.push([t[1 + 2 * i], t[2 + 2 * i]]); o.sort((x, y) => x[0] - y[0]); let pts = 0, kaw = 0, ca = -2, cb = -2; for (const [a, b] of o) { if (a > cb + 1) { if (cb >= 0 || ca >= 0) { pts += cb - ca + 1; kaw++; } ca = a; cb = b; } else cb = Math.max(cb, b); } pts += cb - ca + 1; kaw++; return `${pts} ${kaw}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int N = 1000000;
bitset<N> pokrycie;
int main() {
    pokrycie.reset(); // zerowanie przed testem
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        int dl = b - a + 1;
        pokrycie |= (~bitset<N>() >> (N - dl)) << a;
    }
    cout << pokrycie.count() << " " << (pokrycie & ~(pokrycie << 1)).count() << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-plakaty', krok: 9, level: 'srednie',
            title: 'Plakaty na ścianie',
            short: 'Każdy wiersz ściany to bitset. Plakat to ta sama maska kolumn od x1 do x2, dołożona OR-em do wierszy od y1 do y2 — bez pętli po pojedynczych polach.',
            tags: ['wiersze jako bitsety', 'maska kolumn', 'sciana[y] |= maska'],
            statement: ['Ściana to kratka W kolumn na H wierszy. Uczniowie przykleili n prostokątnych plakatów: plakat zajmuje kolumny od x1 do x2 i wiersze od y1 do y2 (włącznie). Plakaty mogą na siebie zachodzić. Ile pól ściany jest przykrytych przynajmniej jednym plakatem?',
                'Plakatów jest dużo, a każdy może zajmować prawie całą ścianę — razem nawet dwa miliardy pól. Ćwiczysz tu sposób bez pętli po pojedynczych polach: trzymaj każdy wiersz ściany jako bitset kolumn. Dla plakatu zbuduj raz maskę kolumn x1…x2 (jak odcinek w poprzednim zadaniu) i zrób sciana[y] |= maska dla każdego wiersza y od y1 do y2.'],
            input_format: ['W pierwszym wierszu liczby W, H i n.', 'W każdym z kolejnych n wierszy liczby x1, y1, x2, y2.'],
            output_format: ['Jedna liczba — liczba przykrytych pól.'],
            constraints: ['1 ≤ W, H ≤ 1000', '1 ≤ n ≤ 2000', '1 ≤ x1 ≤ x2 ≤ W', '1 ≤ y1 ≤ y2 ≤ H'],
            examples: [{ input: '10 5 2\n1 1 4 2\n3 2 6 5', note: 'Pierwszy plakat zajmuje 4 · 2 = 8 pól, drugi 4 · 4 = 16. Wspólne są pola w kolumnach 3–4 wiersza 2 — dwa. Razem 8 + 16 − 2 = 22.' }],
            hint: R`bitset<1001> sciana[1001]; przed main. Plakat: int dl = x2 - x1 + 1; bitset<1001> maska = (~bitset<1001>() >> (1001 - dl)) << x1; for (int y = y1; y <= y2; y++) sciana[y] |= maska;. Wynik to suma sciana[y].count().`,
            tests: (r) => {
                const gen = (W, H, n, mx) => `${W} ${H} ${n}\n${Array.from({ length: n }, () => { const x1 = r.int(1, W), y1 = r.int(1, H); return `${x1} ${y1} ${Math.min(W, x1 + r.int(0, mx))} ${Math.min(H, y1 + r.int(0, mx))}`; }).join('\n')}`;
                return ['10 5 2\n1 1 4 2\n3 2 6 5', '1 1 1\n1 1 1 1', '1000 1000 1\n1 1 1000 1000', gen(1000, 1000, 2000, 1000), gen(1000, 1000, 2000, 100), gen(1000, 1000, 2000, 30), gen(1000, 1, 2000, 50), gen(1, 1000, 2000, 50), gen(1000, 1000, 2000, 500)];
            },
            check: (inp) => { const t = nums(inp); const [W, H, n] = t; if (!calk(W, 1, 1000) || !calk(H, 1, 1000) || !calk(n, 1, 2000) || t.length !== 3 + 4 * n) return 'dane'; for (let i = 0; i < n; i++) { const [x1, y1, x2, y2] = t.slice(3 + 4 * i, 7 + 4 * i); if (!calk(x1, 1, W) || !calk(x2, x1, W) || !calk(y1, 1, H) || !calk(y2, y1, H)) return 'dane'; } return null; },
            solve: (inp) => { const t = nums(inp); const [W, H, n] = t; const d = Array.from({ length: H + 2 }, () => new Int32Array(W + 2)); for (let i = 0; i < n; i++) { const [x1, y1, x2, y2] = t.slice(3 + 4 * i, 7 + 4 * i); d[y1][x1]++; d[y1][x2 + 1]--; d[y2 + 1][x1]--; d[y2 + 1][x2 + 1]++; } let c = 0; for (let y = 1; y <= H; y++) for (let x = 1; x <= W; x++) { d[y][x] += d[y - 1][x] + d[y][x - 1] - d[y - 1][x - 1]; if (d[y][x] > 0) c++; } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1001> sciana[1001];
int main() {
    int W, H, n;
    cin >> W >> H >> n;
    for (int y = 0; y <= H; y++) sciana[y].reset(); // zerowanie przed testem
    for (int i = 0; i < n; i++) {
        int x1, y1, x2, y2;
        cin >> x1 >> y1 >> x2 >> y2;
        int dl = x2 - x1 + 1;
        bitset<1001> maska = (~bitset<1001>() >> (1001 - dl)) << x1;
        for (int y = y1; y <= y2; y++) sciana[y] |= maska;
    }
    long long razem = 0;
    for (int y = 1; y <= H; y++) razem += sciana[y].count();
    cout << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-goldbach-sposoby', krok: 9, level: 'srednie',
            title: 'Na ile sposobów Goldbach?',
            short: 'Sztuczka z odwróconym bitsetem: R[i] = P[MAX − i]. Wtedy P & (R >> (MAX − n)) świeci przy każdym p, dla którego p i n − p są pierwsze — jedno count() na pytanie.',
            tags: ['odwrócony bitset', 'P & (R >> (MAX - n))', 'pary bez powtórzeń'],
            statement: ['Na ile sposobów można zapisać parzystą liczbę n jako sumę dwóch liczb pierwszych p + q, gdzie p ≤ q? Na przykład 10 = 3 + 7 = 5 + 5 — dwa sposoby. Odpowiedz na q pytań.',
                'Pętla po wszystkich p dla każdego pytania to nawet pół miliarda kroków. Sztuczka: zbuduj bitset P liczb pierwszych i jego odbicie R, w którym R[i] = P[MAX − i]. Bit p w R >> (MAX − n) to R[p + MAX − n] = P[n − p], więc (P & (R >> (MAX − n))).count() liczy wszystkie p, dla których p i n − p są pierwsze. Każdy rozkład policzysz wtedy dwa razy (p + q i q + p) — oprócz rozkładu n/2 + n/2.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q parzystych liczb n.'],
            output_format: ['q wierszy: liczba sposobów.'],
            constraints: ['1 ≤ q ≤ 1000', '4 ≤ n ≤ 1 000 000, n parzyste'],
            examples: [{ input: '3\n4 10 100', note: '4 = 2 + 2. 10 = 3 + 7 = 5 + 5. 100 = 3 + 97 = 11 + 89 = 17 + 83 = 29 + 71 = 41 + 59 = 47 + 53 — sześć sposobów.' }],
            hint: R`const int MAX = 1000000; bitset<MAX + 1> P, R; po sicie: for (int i = 0; i <= MAX; i++) R[i] = P[MAX - i];. Dla n: int c = (P & (R >> (MAX - n))).count(); if (P[n / 2]) c++; cout << c / 2 << "\n";.`,
            tests: (r) => [`3\n4 10 100`, `1\n1000000`, lista(Array.from({ length: 1000 }, () => 2 * r.int(400000, 500000))), lista(Array.from({ length: 1000 }, () => 2 * r.int(2, 500000))), lista([4, 6, 8, 12, 14, 16, 18, 20, 22, 998, 999998, 1000000]), lista(Array.from({ length: 1000 }, (_, i) => 1000000 - 2 * i))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 4, 1000000) && x % 2 === 0) ? null : 'dane'; },
            solve: (inp) => { const z = sito(1000000); const p = pierwszeDo(1000000); return nums(inp).slice(1).map((n) => { let c = 0; for (const x of p) { if (2 * x > n) break; if (!z[n - x]) c++; } return String(c); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int MAX = 1000000;
bitset<MAX + 1> P, R;
int main() {
    P.set();
    P[0] = P[1] = 0;
    for (int i = 2; i * i <= MAX; i++) {
        if (P[i]) {
            for (int j = i * i; j <= MAX; j += i) P[j] = 0;
        }
    }
    for (int i = 0; i <= MAX; i++) R[i] = P[MAX - i];
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int n;
        cin >> n;
        int c = (P & (R >> (MAX - n))).count();
        if (P[n / 2]) c++;
        cout << c / 2 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-b-sito-przedzialowe', krok: 9, level: 'srednie',
            title: 'Sito na dalekim przedziale',
            short: 'Liczby sięgają 10¹², ale przedział ma najwyżej milion liczb. Liczby pierwsze do 10⁶ (pierwiastka z 10¹²) skreślają złożone w przedziale — bit j − L to liczba j.',
            tags: ['sito do pierwiastka', 'bit j − L', 'long long'],
            statement: ['Policz liczby pierwsze w przedziale od L do R oraz wypisz najmniejszą i największą z nich. Liczby są ogromne (do 10¹²), ale przedział jest krótki: R − L ≤ 1 000 000.',
                'Każda liczba złożona j ≤ 10¹² ma dzielnik pierwszy nie większy niż √j ≤ 10⁶. Zrób więc zwykłe sito do 10⁶, a potem każdą małą liczbą pierwszą p skreśl jej wielokrotności w przedziale: od max(p · p, pierwszej wielokrotności p nie mniejszej niż L). Liczbę j trzymaj w bicie j − L. Pamiętaj, że 1 nie jest pierwsza.'],
            input_format: ['Jeden wiersz: liczby L i R.'],
            output_format: ['W pierwszym wierszu liczba liczb pierwszych w przedziale.', 'W drugim wierszu najmniejsza i największa z nich albo brak.'],
            constraints: ['1 ≤ L ≤ R ≤ 10¹²', 'R − L ≤ 1 000 000'],
            examples: [{ input: '10 30', note: 'W przedziale są 11, 13, 17, 19, 23 i 29 — sześć liczb pierwszych.' }, { input: '999999999900 1000000000000', note: 'Wśród stu jeden liczb tuż pod bilionem są tylko cztery liczby pierwsze: 999 999 999 937, …959, …961 i 999 999 999 989 — największa liczba pierwsza nie większa od biliona.' }, { input: '24 28', note: 'Między 24 a 28 nie ma liczb pierwszych.' }],
            hint: R`bitset<1000001> male, przedzial;. Dla każdej małej pierwszej p, dopóki p * p <= R: long long start = max(p * p, (L + p - 1) / p * p); for (long long j = start; j <= R; j += p) przedzial[j - L] = 1;. Jeśli L == 1, zapal przedzial[0].`,
            tests: (r) => {
                const T = 10n ** 12n;
                const losP = (dl) => { const Lb = r.big(1n, T - BigInt(dl)); return `${Lb} ${Lb + BigInt(dl)}`; };
                return ['10 30', '999999999900 1000000000000', '24 28', '1 1', '1 1000001', '2 2', `${T - 1000000n} ${T}`, losP(1000000), losP(1000), '999999000000 999999999999', '4 4', '1000000007 1000000009'];
            },
            check: (inp) => { const t = toks(inp); if (t.length !== 2 || !P.calkB(t[0], 1n, 10n ** 12n) || !P.calkB(t[1], 1n, 10n ** 12n)) return 'dane'; const a = BigInt(t[0]), b = BigInt(t[1]); return a <= b && b - a <= 1000000n ? null : 'dane'; },
            solve: (inp) => { const [Ls, Rs] = toks(inp); const Lv = Number(Ls), Rv = Number(Rs); const n = Rv - Lv + 1; const s = new Uint8Array(n); const p = pierwszeDo(1000000); for (const x of p) { if (x * x > Rv) break; const pierwszaW = Lv % x === 0 ? Lv : Lv + (x - (Lv % x)); const st = Math.max(x * x, pierwszaW); for (let j = st; j <= Rv; j += x) s[j - Lv] = 1; } if (Lv === 1) s[0] = 1; let c = 0, a = -1, b = -1; for (let i = 0; i < n; i++) if (!s[i]) { c++; if (a < 0) a = Lv + i; b = Lv + i; } return `${c}\n${c ? `${a} ${b}` : 'brak'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1000001> male, przedzial;
int main() {
    long long L, R;
    cin >> L >> R;
    male.reset(); // zerowanie przed testem
    przedzial.reset();
    vector<long long> pierwsze;
    for (long long i = 2; i <= 1000000; i++) {
        if (!male[i]) {
            pierwsze.push_back(i);
            for (long long j = i * i; j <= 1000000; j += i) male[j] = 1;
        }
    }
    for (long long p : pierwsze) {
        if (p * p > R) break;
        long long start = max(p * p, (L + p - 1) / p * p);
        for (long long j = start; j <= R; j += p) przedzial[j - L] = 1;
    }
    if (L == 1) przedzial[0] = 1;
    int ile = 0;
    long long pierwsza = -1, ostatnia = -1;
    for (long long j = L; j <= R; j++) {
        if (!przedzial[j - L]) {
            ile++;
            if (pierwsza < 0) pierwsza = j;
            ostatnia = j;
        }
    }
    cout << ile << "\n";
    if (ile == 0) cout << "brak\n";
    else cout << pierwsza << " " << ostatnia << "\n";
    return 0;
}`,
        },
        // ================================================================ BAZA · trudne
        {
            id: 'bs-b-dokladnie-k', krok: 9, level: 'trudne',
            title: 'Dokładnie k monet',
            short: 'Trzymaj osobny zbiór sum dla każdej liczby użytych monet: dp[j] |= dp[j − 1] << x. Pętla po j od góry, żeby moneta nie liczyła się dwa razy.',
            tags: ['tablica bitsetów dp[j]', 'dp[j] |= dp[j - 1] << x', 'j od góry'],
            statement: ['Masz n monet o podanych nominałach. Interesują nas tylko kwoty, które da się zapłacić dokładnie k monetami (każdą monetę można dać najwyżej raz). Ile jest różnych takich kwot? Potem odpowiedz na q pytań: czy kwotę s da się zapłacić dokładnie k monetami?',
                'Jeden bitset nie wystarczy, bo nie pamięta, ile monet użyto. Zrób tablicę: dp[j] to zbiór kwot z dokładnie j monet. Na start dp[0] = {0}. Moneta x dokłada do dp[j] kwoty z dp[j − 1] powiększone o x — dp[j] |= dp[j − 1] << x — a j przechodzisz od góry do dołu, żeby ta sama moneta nie trafiła do sumy drugi raz.'],
            input_format: ['W pierwszym wierszu liczby n, k i q.', 'W drugim wierszu n nominałów.', 'W trzecim wierszu q kwot s.'],
            output_format: ['W pierwszym wierszu liczba różnych kwot z dokładnie k monet.', 'Potem q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ k ≤ n ≤ 100', '1 ≤ każdy nominał ≤ 1000', '1 ≤ q ≤ 3000', '0 ≤ s ≤ 100 000'],
            examples: [{ input: '4 2 4\n1 2 5 5\n3 6 10 8', note: 'Dwie monety dają kwoty 1 + 2 = 3, 1 + 5 = 6, 2 + 5 = 7 i 5 + 5 = 10 — cztery różne. Ośmiu z dwóch monet nie ułożysz.' }],
            hint: R`bitset<100001> dp[101]; przed main, dp[0][0] = 1;. Dla i-tej monety x: for (int j = min(k, i + 1); j >= 1; j--) dp[j] |= dp[j - 1] << x;. Wynik: dp[k].count() i dp[k][s].`,
            tests: (r) => {
                const gen = (n, k, lo, hi, q) => `${n} ${k} ${q}\n${r.arr(n, lo, hi).join(' ')}\n${r.arr(q, 0, Math.min(100000, k * hi)).join(' ')}`;
                return ['4 2 4\n1 2 5 5\n3 6 10 8', '1 1 2\n7\n7 0', gen(100, 50, 1, 1000, 3000), gen(100, 1, 1, 1000, 3000), gen(100, 100, 1, 1000, 10), gen(100, 3, 1, 1000, 3000), gen(60, 30, 900, 1000, 3000), gen(100, 50, 1, 20, 3000)];
            },
            check: (inp) => { const l = L(inp); const [n, k, q] = l[0].split(' ').map(Number); const a = (l[1] || '').split(' ').map(Number), s = (l[2] || '').split(' ').map(Number); return l.length === 3 && calk(n, 1, 100) && calk(k, 1, n) && calk(q, 1, 3000) && a.length === n && s.length === q && a.every((x) => calk(x, 1, 1000)) && s.every((x) => calk(x, 0, 100000)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const [, k] = l[0].split(' ').map(Number); const a = l[1].split(' ').map(Number); const dp = new Array(k + 1).fill(0n); dp[0] = 1n; a.forEach((x, i) => { for (let j = Math.min(k, i + 1); j >= 1; j--) dp[j] |= dp[j - 1] << BigInt(x); }); const bits = dp[k].toString(2); const ile = [...bits].filter((c) => c === '1').length; return `${dp[k] === 0n ? 0 : ile}\n${l[2].split(' ').map((s) => ((dp[k] >> BigInt(s)) & 1n ? 'TAK' : 'NIE')).join('\n')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<100001> dp[101];
int main() {
    int n, k, q;
    cin >> n >> k >> q;
    for (int j = 0; j <= k; j++) dp[j].reset(); // zerowanie przed testem
    dp[0][0] = 1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        for (int j = min(k, i + 1); j >= 1; j--) {
            dp[j] |= dp[j - 1] << x;
        }
    }
    cout << dp[k].count() << "\n";
    for (int i = 0; i < q; i++) {
        int s;
        cin >> s;
        cout << (dp[k][s] ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-b-ograniczone-monety', krok: 9, level: 'trudne',
            title: 'Monety w ograniczonej liczbie',
            short: 'Tysiąc jednakowych monet to tysiąc przesunięć — za dużo. Podziel je na paczki 1, 2, 4, 8, … i resztę: z paczek ułożysz każdą liczbę monet, a przesunięć jest tylko kilkanaście.',
            tags: ['paczki 1, 2, 4, 8…', 'S |= S << (v * paczka)', 'bitset<1000001>'],
            statement: ['W kasie jest n rodzajów monet: c sztuk monet o nominale v dla każdego rodzaju. Ile różnych dodatnich kwot da się wypłacić bez reszty? Wypisz też najmniejszą dodatnią kwotę, której wypłacić się nie da.',
                'Każdą monetę osobno: S |= S << v powtórzone c razy — to nawet sto tysięcy przesunięć bitsetu o milionie bitów, za wolno. Sztuczka: c monet podziel na paczki po 1, 2, 4, 8, … monet i jedną paczkę z resztą (13 = 1 + 2 + 4 + 6). Z takich paczek złożysz każdą liczbę monet od 0 do c, więc wystarczy przesunąć S raz na paczkę: S |= S << (v · wielkość paczki).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy nominał v i liczba monet c.'],
            output_format: ['Jeden wiersz: liczba dodatnich kwot, które da się wypłacić, i najmniejsza dodatnia kwota, której się nie da.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ v ≤ 1000', '1 ≤ c ≤ 1000', 'suma wszystkich v · c ≤ 1 000 000'],
            examples: [{ input: '2\n2 3\n5 1', note: 'Z trzech dwójek i piątki da się wypłacić 2, 4, 6, 5, 7, 9 i 11 — siedem kwot. Najmniejsza niemożliwa to 1.' },
                { input: '1\n1 1000', note: 'Tysiąc złotówek: wszystkie kwoty od 1 do 1000. Pierwsza niemożliwa to 1001.' }],
            hint: R`bitset<1000001> S; przed main, S[0] = 1;. Dla rodzaju (v, c): for (int p = 1; c > 0; p *= 2) { int t = min(p, c); S |= S << (v * t); c -= t; }. Potem S.count() - 1 i pierwszy zgaszony bit od 1.`,
            tests: (r) => {
                const gen = (n, vmax, cmax) => { let reszta = 1000000; const o = []; for (let i = 0; i < n; i++) { const v = r.int(1, vmax); const c = Math.max(1, Math.min(r.int(1, cmax), Math.floor(reszta / v / (n - i)))); reszta -= v * c; o.push(`${v} ${c}`); } return `${n}\n${o.join('\n')}`; };
                return ['2\n2 3\n5 1', '1\n1 1000', '1\n1000 1', gen(100, 10, 1000), gen(100, 1000, 10), gen(50, 200, 100), gen(100, 3, 1000), `3\n6 1000\n10 1000\n15 1000`, gen(100, 1000, 1000)];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 100) || t.length !== 1 + 2 * n) return 'dane'; let s = 0; for (let i = 0; i < n; i++) { const v = t[1 + 2 * i], c = t[2 + 2 * i]; if (!calk(v, 1, 1000) || !calk(c, 1, 1000)) return 'dane'; s += v * c; } return s <= 1000000 ? null : 'za duża suma'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; let S = 1n; let tot = 0; for (let i = 0; i < n; i++) { const v = t[1 + 2 * i]; let c = t[2 + 2 * i]; tot += v * c; for (let p = 1; c > 0; p *= 2) { const k = Math.min(p, c); S |= S << BigInt(v * k); c -= k; } } const s = S.toString(2); let ile = 0, brak = 0; for (let x = 1; x <= tot + 1; x++) { const bit = x < s.length ? s[s.length - 1 - x] : '0'; if (bit === '1') ile++; else if (!brak) brak = x; } return `${ile} ${brak}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1000001> S;
int main() {
    S.reset(); // zerowanie przed testem
    int n;
    cin >> n;
    S[0] = 1;
    for (int i = 0; i < n; i++) {
        int v, c;
        cin >> v >> c;
        for (int p = 1; c > 0; p *= 2) {
            int t = min(p, c);
            S |= S << (v * t);
            c -= t;
        }
    }
    int brak = 1;
    while (brak <= 1000000 && S[brak]) brak++;
    cout << S.count() - 1 << " " << brak << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-krzyzowka', krok: 9, level: 'trudne',
            title: 'Krzyżówka ze słownikiem',
            short: 'Dla każdej pozycji i litery zbuduj bitset słów, które mają tę literę w tym miejscu. Wzorzec k?t to AND trzech bitsetów: długość 3, k na pozycji 0 i t na pozycji 2.',
            tags: ['bitset słów', 'poz[p][litera]', '_Find_first()'],
            statement: ['Rozwiązujesz krzyżówkę i masz słownik n różnych słów. Dla każdego z q wzorców (litery i znaki ? — znak zapytania pasuje do dowolnej litery) policz, ile słów ze słownika pasuje do wzorca: ma tę samą długość i te same litery na pozycjach bez znaku zapytania. Wypisz też pierwsze takie słowo w kolejności ze słownika (albo -, gdy nic nie pasuje).',
                'Przygotuj bitsety słów: dl[L] — słowa długości L, poz[p][c] — słowa z literą c na pozycji p (bit i to słowo numer i). Wtedy wzorzec to AND kilku bitsetów, count() mówi, ile słów pasuje, a _Find_first() — które jest pierwsze.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy słowo ze słownika.', 'Potem liczba q, a w każdym z kolejnych q wierszy wzorzec.'],
            output_format: ['q wierszy: liczba pasujących słów i pierwsze z nich (albo -).'],
            constraints: ['1 ≤ n ≤ 6000', '1 ≤ q ≤ 1500', 'słowa i wzorce mają od 1 do 10 znaków', 'słowa z małych liter, różne; wzorce z małych liter i ?'],
            examples: [{ input: '5\nkot\nkit\nlot\nkoto\ntok\n3\nk?t\n?o?\n????', note: 'Do k?t pasują kot i kit — pierwszy jest kot. Do ?o? pasują kot, lot i tok. Czteroliterowe jest tylko koto.' }],
            hint: R`bitset<6000> dl[11], poz[10][26];. Wzorzec w: bitset<6000> r = dl[w.size()]; for (int p = 0; p < w.size(); p++) if (w[p] != '?') r &= poz[p][w[p] - 'a'];. Potem r.count() i int i = r._Find_first(); — gdy i == 6000, nic nie pasuje.`,
            tests: (r) => {
                const gen = (n, q, alf, lmin, lmax, pq) => {
                    const s = new Set(); let proby = 0;
                    while (s.size < n && proby < 50 * n) { proby++; s.add(slowo(r, lmin, lmax, alf)); }
                    const sl = [...s];
                    const wz = Array.from({ length: q }, () => { if (r() < 0.8) { const w = r.pick(sl); return w.split('').map((c) => (r() < pq ? '?' : c)).join(''); } return slowo(r, lmin, lmax, alf + '?'); });
                    return `${sl.length}\n${sl.join('\n')}\n${q}\n${wz.join('\n')}`;
                };
                return ['5\nkot\nkit\nlot\nkoto\ntok\n3\nk?t\n?o?\n????', '1\na\n2\n?\nb', gen(6000, 1500, 'abcdefgh', 3, 7, 0.5), gen(6000, 1500, 'abcdefghijklmnopqrstuvwxyz', 4, 10, 0.4), gen(6000, 1500, 'abc', 1, 10, 0.6), gen(3000, 1500, 'aeiklmnoprst', 5, 5, 0.7)];
            },
            check: (inp) => { const l = L(inp); const n = Number(l[0]); if (!calk(n, 1, 6000)) return 'dane'; const sl = l.slice(1, 1 + n); const q = Number(l[1 + n]); const wz = l.slice(2 + n); return sl.every((w) => /^[a-z]{1,10}$/.test(w)) && new Set(sl).size === n && calk(q, 1, 1500) && wz.length === q && wz.every((w) => /^[a-z?]{1,10}$/.test(w)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const n = Number(l[0]); const sl = l.slice(1, 1 + n); return l.slice(2 + n).map((w) => { let c = 0, pierwsze = '-'; for (const s of sl) { if (s.length !== w.length) continue; let ok = true; for (let p = 0; p < w.length && ok; p++) if (w[p] !== '?' && w[p] !== s[p]) ok = false; if (ok) { if (!c) pierwsze = s; c++; } } return `${c} ${pierwsze}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<6000> dl[11], poz[10][26];
int main() {
    for (int L = 0; L <= 10; L++) dl[L].reset(); // zerowanie przed testem
    for (int p = 0; p < 10; p++)
        for (int c = 0; c < 26; c++) poz[p][c].reset();
    int n;
    cin >> n;
    vector<string> slowa(n);
    for (int i = 0; i < n; i++) {
        cin >> slowa[i];
        dl[slowa[i].size()][i] = 1;
        for (int p = 0; p < (int)slowa[i].size(); p++) poz[p][slowa[i][p] - 'a'][i] = 1;
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string w;
        cin >> w;
        bitset<6000> r = dl[w.size()];
        for (int p = 0; p < (int)w.size(); p++) {
            if (w[p] != '?') r &= poz[p][w[p] - 'a'];
        }
        int i = r._Find_first();
        if (i == 6000) cout << "0 -\n";
        else cout << r.count() << " " << slowa[i] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-b-wzorzec', krok: 9, level: 'trudne',
            title: 'Wzorzec z dżokerami',
            short: 'Bitset M[c] mówi, gdzie w tekście stoi litera c. Wzorzec pasuje od pozycji j, gdy dla każdej litery wzorca P[i] bit j świeci w M[P[i]] >> i — czyli AND tych przesunięć.',
            tags: ['M[c] >> i', 'r &= …', 'maska dobrych początków'],
            statement: ['Dany jest długi tekst i q wzorców. Wzorzec składa się z liter i dżokerów ? — dżoker pasuje do dowolnej litery. Dla każdego wzorca policz, na ilu pozycjach tekstu może się zaczynać jego wystąpienie (wystąpienia mogą na siebie zachodzić).',
                'Porównywanie wzorca z każdym miejscem tekstu to nawet miliard porównań. Zamiast tego zbuduj 26 bitsetów: M[c][j] = 1, gdy w tekście na pozycji j stoi litera c. Bit j w M[c] >> i mówi, czy na pozycji j + i stoi c. Wzorzec pasuje od pozycji j, gdy ten bit świeci dla każdej litery wzorca — więc zacznij od maski wszystkich możliwych początków (od 0 do |T| − |P|) i zrób r &= M[P[i]] >> i dla każdej litery.'],
            input_format: ['W pierwszym wierszu tekst T (małe litery).', 'W drugim wierszu liczba q.', 'W każdym z kolejnych q wierszy wzorzec (małe litery i znaki ?).'],
            output_format: ['q wierszy: liczba miejsc, od których zaczyna się wystąpienie wzorca.'],
            constraints: ['1 ≤ |T| ≤ 50 000', '1 ≤ q ≤ 1000', 'każdy wzorzec ma od 1 do 50 000 znaków', 'wszystkie wzorce mają razem najwyżej 20 000 znaków'],
            examples: [{ input: 'abracadabra\n4\nabra\na?a\n??\nz', note: 'abra zaczyna się na pozycjach 0 i 7. a?a pasuje do aca i ada. Dwa dżokery pasują od każdej z 10 pozycji. Litery z nie ma w tekście.' }],
            hint: R`bitset<50000> M[26]; M[T[j] - 'a'][j] = 1;. Dla wzorca P: if (P.size() > T.size()) { cout << 0; … } bitset<50000> r; r.set(); r >>= 50000 - (T.size() - P.size() + 1); — to maska dobrych początków. Potem for (int i = 0; i < P.size(); i++) if (P[i] != '?') r &= M[P[i] - 'a'] >> i;.`,
            tests: (r) => {
                const gen = (n, alf, q, dlmax, pq) => { const T = r.word(n, alf); let zost = 20000; const w = []; for (let i = 0; i < q && zost > 0; i++) { const d = Math.min(zost, r.int(1, dlmax)); zost -= d; if (r() < 0.6 && d <= n) { const s = r.int(0, n - d); w.push(T.slice(s, s + d).split('').map((c) => (r() < pq ? '?' : c)).join('')); } else w.push(r.word(d, alf + '?')); } return `${T}\n${w.length}\n${w.join('\n')}`; };
                return ['abracadabra\n4\nabra\na?a\n??\nz', 'a\n2\na\naa', gen(50000, 'ab', 1000, 40, 0.3), gen(50000, 'abcdefghijklmnopqrstuvwxyz', 1000, 40, 0.5), gen(50000, 'abc', 50, 1000, 0.8), gen(50000, 'aaaaaaaaab', 20, 1000, 0.1), gen(1000, 'ab', 1000, 50, 0.5), `${'a'.repeat(50000)}\n3\n${'a'.repeat(9999)}\n${'?'.repeat(10000)}\nb`];
            },
            check: (inp) => { const l = L(inp); const T = l[0]; const q = Number(l[1]); const w = l.slice(2); return /^[a-z]{1,50000}$/.test(T) && calk(q, 1, 1000) && w.length === q && w.every((s) => /^[a-z?]+$/.test(s) && s.length <= 50000) && suma(w.map((s) => s.length)) <= 20000 ? null : 'dane'; },
            solve: (inp) => {
                const l = L(inp); const T = l[0]; const n = T.length;
                const M = {}; for (const c of 'abcdefghijklmnopqrstuvwxyz') M[c] = 0n;
                // budujemy bitsety liter jako BigInt (bit j = pozycja j)
                const pos = {}; for (let j = 0; j < n; j++) (pos[T[j]] = pos[T[j]] || []).push(j);
                for (const c in pos) { const s = new Array(n).fill('0'); for (const j of pos[c]) s[n - 1 - j] = '1'; M[c] = BigInt('0b' + s.join('')); }
                const pc = (x) => { let c = 0; for (const ch of x.toString(2)) if (ch === '1') c++; return c; };
                return l.slice(2).map((P) => { if (P.length > n) return '0'; let rr = (1n << BigInt(n - P.length + 1)) - 1n; for (let i = 0; i < P.length && rr; i++) if (P[i] !== '?') rr &= M[P[i]] >> BigInt(i); return String(rr ? pc(rr) : 0); }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<50000> M[26];
int main() {
    for (int c = 0; c < 26; c++) M[c].reset(); // zerowanie przed testem
    string T;
    int q;
    cin >> T >> q;
    int n = T.size();
    for (int j = 0; j < n; j++) M[T[j] - 'a'][j] = 1;
    for (int k = 0; k < q; k++) {
        string P;
        cin >> P;
        int m = P.size();
        if (m > n) {
            cout << 0 << "\n";
            continue;
        }
        bitset<50000> r;
        r.set();
        r >>= 50000 - (n - m + 1);
        for (int i = 0; i < m; i++) {
            if (P[i] != '?') r &= M[P[i] - 'a'] >> i;
        }
        cout << r.count() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-b-automat', krok: 9, level: 'trudne',
            title: 'Automat komórkowy',
            short: 'Reguła o numerze R mówi, jaki będzie nowy stan dla każdego z 8 układów (lewy, środek, prawy). Każdy układ to AND trzech bitsetów: L albo ~L, C albo ~C, P albo ~P — dla całego rzędu naraz.',
            tags: ['b << 1 i b >> 1', '8 układów sąsiadów', 'reguła jako liczba'],
            statement: ['Rząd n komórek, każda w stanie 0 albo 1. W każdym kroku wszystkie komórki zmieniają się jednocześnie: nowy stan zależy od lewego sąsiada l, samej komórki c i prawego sąsiada p (poza rzędem są same zera). Regułę opisuje liczba R od 0 do 255: nowy stan to bit numer 4l + 2c + p liczby R. Reguła 90 z części o przesunięciach to właśnie R = 90.',
                'Wypisz stan rzędu po t krokach i liczbę jedynek. Na bitsetach: L = b << 1 (stan lewego sąsiada każdej komórki), P = b >> 1 (prawego). Dla każdego układu (l, c, p), w którym R ma jedynkę, dołóż do nowego stanu (l ? L : ~L) & (c ? b : ~b) & (p ? P : ~P), a na koniec przytnij maską n komórek.'],
            input_format: ['W pierwszym wierszu liczby n, t i R.', 'W drugim wierszu n cyfr 0 i 1 — stan początkowy (pierwsza cyfra to komórka 0).'],
            output_format: ['W pierwszym wierszu stan po t krokach (n cyfr).', 'W drugim wierszu liczba jedynek.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ t ≤ 10 000', '0 ≤ R ≤ 255'],
            examples: [{ input: '7 2 90\n0001000', note: 'Reguła 90 to XOR sąsiadów: po kroku 0010100, po drugim 0100010.' },
                { input: '5 1 255\n00000', note: 'Reguła 255 zawsze daje 1 — nawet z samych zer.' }],
            hint: R`Komórkę i trzymaj w bicie i (wczytaj pętlą). W kroku: bitset<10000> L = b << 1, P = b >> 1, nowy; for (int u = 0; u < 8; u++) if ((R >> u) & 1) nowy |= (((u >> 2) & 1) ? L : ~L) & (((u >> 1) & 1) ? b : ~b) & ((u & 1) ? P : ~P); b = nowy & maska;.`,
            tests: (r) => ['7 2 90\n0001000', '5 1 255\n00000', '1 5 4\n1', `10000 10000 30\n${'0'.repeat(5000)}1${'0'.repeat(4999)}`, `10000 10000 110\n${los01(r, 10000, 0.5)}`, `1000 5000 105\n${los01(r, 1000, 0.3)}`, `10000 3000 184\n${los01(r, 10000, 0.5)}`, `5000 10000 150\n${los01(r, 5000, 0.1)}`, `10000 1 0\n${los01(r, 10000)}`],
            check: (inp) => { const l = L(inp); const [n, t, Rr] = l[0].split(' ').map(Number); return l.length === 2 && calk(n, 1, 10000) && calk(t, 1, 10000) && calk(Rr, 0, 255) && l[1].length === n && /^[01]+$/.test(l[1]) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const [n, t, Rr] = l[0].split(' ').map(Number); let a = new Uint8Array(n); for (let i = 0; i < n; i++) a[i] = l[1][i] === '1' ? 1 : 0; let b = new Uint8Array(n); for (let k = 0; k < t; k++) { for (let i = 0; i < n; i++) { const u = ((i > 0 ? a[i - 1] : 0) << 2) | (a[i] << 1) | (i + 1 < n ? a[i + 1] : 0); b[i] = (Rr >> u) & 1; } [a, b] = [b, a]; } let c = 0; let s = ''; for (let i = 0; i < n; i++) { c += a[i]; s += a[i]; } return `${s}\n${c}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, t, R;
    string s;
    cin >> n >> t >> R >> s;
    bitset<10000> b, maska;
    for (int i = 0; i < n; i++) {
        b[i] = (s[i] == '1');
        maska[i] = 1;
    }
    for (int k = 0; k < t; k++) {
        bitset<10000> L = b << 1, P = b >> 1, nowy;
        for (int u = 0; u < 8; u++) {
            if ((R >> u) & 1) {
                bitset<10000> l = ((u >> 2) & 1) ? L : ~L;
                bitset<10000> c = ((u >> 1) & 1) ? b : ~b;
                bitset<10000> p = (u & 1) ? P : ~P;
                nowy |= l & c & p;
            }
        }
        b = nowy & maska;
    }
    for (int i = 0; i < n; i++) cout << b[i];
    cout << "\n" << b.count() << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-skoczek', krok: 9, level: 'trudne',
            title: 'Skoczek na wielkiej szachownicy',
            short: 'Każdy wiersz szachownicy to bitset pól, na których może stać skoczek. Ruch o dx kolumn to przesunięcie wiersza o dx — osiem ruchów to osiem przesunięć na wiersz zamiast ośmiu ruchów na każde pole.',
            tags: ['tablica bitsetów = plansza', 'S[y - dy] << dx', '& wolne[y]'],
            statement: ['Na szachownicy n × n niektóre pola są zajęte — na nie skoczek stanąć nie może. Skoczek stoi na polu (w, k) i wykonuje dokładnie t ruchów (każdy ruch jak w szachach: o 2 w jednym kierunku i o 1 w drugim; nie wolno wyjść poza planszę). Na ilu różnych polach może stać po t ruchach?',
                'Pętla po wszystkich polach w każdym ruchu to przy największych danych pół miliarda pól i cztery miliardy prób skoku — na sprawdzarce około dwóch i pół sekundy. Trzymaj więc zbiór możliwych pól jako tablicę bitsetów S — po jednym na wiersz, bit x to kolumna x. Ruch (dy, dx) przenosi wiersz y − dy do wiersza y przesunięty o dx kolumn: N[y] |= S[y - dy] << dx (albo >> −dx). Na końcu kroku N[y] &= wolne[y] usuwa pola zajęte i wychodzące poza planszę.'],
            input_format: ['W pierwszym wierszu liczby n i t.', 'W drugim wierszu pole startowe: wiersz w i kolumna k (od 1 do n).', 'W trzecim wierszu liczba zajętych pól z, a w każdym z kolejnych z wierszy jedno zajęte pole.'],
            output_format: ['Jedna liczba — na ilu polach może stać skoczek po t ruchach.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ t ≤ 500', '0 ≤ z ≤ 5000', 'pole startowe jest wolne'],
            examples: [{ input: '3 1\n2 2\n0', note: 'Ze środka planszy 3 × 3 skoczek nie ma żadnego ruchu — po jednym ruchu nie stoi nigdzie.' },
                { input: '8 1\n1 1\n1\n2 3', note: 'Z rogu są dwa ruchy: na (2, 3) i na (3, 2). Pierwsze pole jest zajęte, więc zostaje jedno.' }],
            hint: R`bitset<1000> S[1000], N[1000], wolne[1000]; (wiersze i kolumny od 0). Ruchy: int dy[8] = {1, 2, 2, 1, -1, -2, -2, -1}, dx[8] = {2, 1, -1, -2, -2, -1, 1, 2};. W kroku dla każdego y i ruchu: int z = y - dy[m]; if (z < 0 || z >= n) continue; N[y] |= dx[m] > 0 ? S[z] << dx[m] : S[z] >> (-dx[m]);.`,
            tests: (r) => {
                const gen = (n, t, z) => { const s = new Set(); const sw = r.int(1, n), sk = r.int(1, n); const o = []; while (o.length < z) { const a = r.int(1, n), b = r.int(1, n); if ((a === sw && b === sk) || s.has(a * 2000 + b)) continue; s.add(a * 2000 + b); o.push(`${a} ${b}`); } return `${n} ${t}\n${sw} ${sk}\n${z}${z ? '\n' + o.join('\n') : ''}`; };
                return ['3 1\n2 2\n0', '8 1\n1 1\n1\n2 3', '1 3\n1 1\n0', '8 2\n1 1\n0', gen(1000, 500, 5000), gen(1000, 500, 0), gen(300, 500, 5000), gen(50, 200, 500), gen(1000, 350, 2000), gen(8, 7, 10)];
            },
            check: (inp) => { const t = nums(inp); const [n, tt, w, k, z] = t; if (!calk(n, 1, 1000) || !calk(tt, 1, 500) || !calk(w, 1, n) || !calk(k, 1, n) || !calk(z, 0, 5000) || t.length !== 5 + 2 * z) return 'dane'; const s = new Set(); for (let i = 0; i < z; i++) { const a = t[5 + 2 * i], b = t[6 + 2 * i]; if (!calk(a, 1, n) || !calk(b, 1, n) || (a === w && b === k) || s.has(a * 2000 + b)) return 'dane'; s.add(a * 2000 + b); } return null; },
            solve: (inp) => {
                const t = nums(inp); const [n, tt, w, k, z] = t;
                const pelny = (1n << BigInt(n)) - 1n;
                const wolne = new Array(n).fill(pelny);
                for (let i = 0; i < z; i++) { const a = t[5 + 2 * i] - 1, b = t[6 + 2 * i] - 1; wolne[a] &= ~(1n << BigInt(b)); }
                let S = new Array(n).fill(0n); S[w - 1] = 1n << BigInt(k - 1);
                const DY = [1, 2, 2, 1, -1, -2, -2, -1], DX = [2, 1, -1, -2, -2, -1, 1, 2];
                for (let s = 0; s < tt; s++) {
                    const N = new Array(n).fill(0n);
                    for (let y = 0; y < n; y++) { let v = 0n; for (let m = 0; m < 8; m++) { const zz = y - DY[m]; if (zz < 0 || zz >= n || !S[zz]) continue; v |= DX[m] > 0 ? S[zz] << BigInt(DX[m]) : S[zz] >> BigInt(-DX[m]); } N[y] = v & wolne[y]; }
                    S = N;
                }
                let c = 0; for (const v of S) if (v) for (const ch of v.toString(2)) if (ch === '1') c++;
                return String(c);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1000> S[1000], N[1000], wolne[1000];
int main() {
    int n, t, w, k, z;
    cin >> n >> t >> w >> k >> z;
    for (int y = 0; y < n; y++) {
        S[y].reset();
        wolne[y].reset();
        for (int x = 0; x < n; x++) wolne[y][x] = 1;
    }
    for (int i = 0; i < z; i++) {
        int a, b;
        cin >> a >> b;
        wolne[a - 1][b - 1] = 0;
    }
    S[w - 1][k - 1] = 1;
    int dy[8] = {1, 2, 2, 1, -1, -2, -2, -1};
    int dx[8] = {2, 1, -1, -2, -2, -1, 1, 2};
    for (int s = 0; s < t; s++) {
        for (int y = 0; y < n; y++) {
            N[y].reset();
            for (int m = 0; m < 8; m++) {
                int zr = y - dy[m];
                if (zr < 0 || zr >= n) continue;
                if (dx[m] > 0) N[y] |= S[zr] << dx[m];
                else N[y] |= S[zr] >> (-dx[m]);
            }
            N[y] &= wolne[y];
        }
        for (int y = 0; y < n; y++) S[y] = N[y];
    }
    long long ile = 0;
    for (int y = 0; y < n; y++) ile += S[y].count();
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-b-drogi-jednokierunkowe', krok: 9, level: 'trudne',
            title: 'Nowe drogi jednokierunkowe',
            short: 'Nowa droga u → v daje nowe połączenia tylko miastom, z których da się dojechać do u: każdemu takiemu w dokładasz zasięg v — r[w] |= r[v]. Wynik poprawiasz o zmianę count().',
            tags: ['r[w][u] — kolumna u', 'r[w] |= r[v]', 'licznik aktualizowany o różnicę'],
            statement: ['W kraju jest n miast i na początku nie ma żadnych dróg. Kolejno buduje się m dróg jednokierunkowych: droga u v pozwala jechać z u do v. Po każdej nowej drodze wypisz, ile jest uporządkowanych par różnych miast (x, y), takich że z x da się dojechać do y.',
                'Liczenie wszystkiego od nowa po każdej drodze jest za wolne. Trzymaj bitsety r[x] — dokąd da się dojechać z x (razem z samym x). Gdy pojawia się droga u → v, nowe cele zyskują tylko miasta w, z których da się dojechać do u (r[w][u] = 1), i dostają wszystko, dokąd się da z v: r[w] |= r[v]. Jeśli z u dało się już dojechać do v, nic się nie zmienia. Wynik poprawiaj o to, o ile wzrosło r[w].count().'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych m wierszy nowa droga: u i v (u ≠ v).'],
            output_format: ['m wierszy: liczba par po każdej nowej drodze.'],
            constraints: ['2 ≤ n ≤ 500', '1 ≤ m ≤ 3000', 'ta sama droga może zostać zbudowana drugi raz'],
            examples: [{ input: '4 4\n1 2\n2 3\n3 1\n4 1', note: 'Po drodze 1 → 2 jest jedna para. Po 2 → 3 dochodzą (2, 3) i (1, 3). Droga 3 → 1 zamyka koło: z każdego z trzech miast dojedziesz do dwóch pozostałych — 6 par. Droga 4 → 1 dokłada trzy pary z miasta 4.' }],
            hint: R`bitset<500> r[500]; r[i][i] = 1;. Droga u → v: if (!r[u][v]) for (int w = 0; w < n; w++) if (r[w][u]) { int przed = r[w].count(); r[w] |= r[v]; razem += r[w].count() - przed; }.`,
            tests: (r) => {
                const gen = (n, m, grupy) => `${n} ${m}\n${Array.from({ length: m }, () => { let a = r.int(1, n), b; if (grupy) { const g = Math.floor((a - 1) / grupy); b = r() < 0.9 ? Math.min(n, g * grupy + r.int(1, grupy)) : r.int(1, n); } else b = r.int(1, n - 1); if (b >= a && !grupy) b++; if (b === a) b = a === n ? 1 : a + 1; return `${a} ${b}`; }).join('\n')}`;
                return ['4 4\n1 2\n2 3\n3 1\n4 1', '2 3\n1 2\n1 2\n2 1', gen(500, 3000, 0), gen(500, 600, 0), gen(500, 3000, 50), gen(100, 3000, 0), `500 499\n${Array.from({ length: 499 }, (_, i) => `${500 - i} ${501 - i > 500 ? 1 : 501 - i}`).join('\n')}`, `500 499\n${Array.from({ length: 499 }, (_, i) => `${i + 1} ${i + 2}`).join('\n')}`];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; if (!calk(n, 2, 500) || !calk(m, 1, 3000) || t.length !== 2 + 2 * m) return 'dane'; for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; if (!calk(a, 1, n) || !calk(b, 1, n) || a === b) return 'dane'; } return null; },
            solve: (inp) => {
                const t = nums(inp); const [n, m] = t; const W = Math.ceil(n / 32);
                const pc32 = (x) => { x -= (x >>> 1) & 0x55555555; x = (x & 0x33333333) + ((x >>> 2) & 0x33333333); return (((x + (x >>> 4)) & 0x0F0F0F0F) * 0x01010101) >>> 24; };
                const rr = Array.from({ length: n }, (_, i) => { const a = new Uint32Array(W); a[i >> 5] |= 1 << (i & 31); return a; });
                const ma = (w, x) => (rr[w][x >> 5] >>> (x & 31)) & 1;
                let razem = 0; const o = [];
                for (let e = 0; e < m; e++) {
                    const u = t[2 + 2 * e] - 1, v = t[3 + 2 * e] - 1;
                    if (!ma(u, v)) {
                        const rv = rr[v].slice();
                        for (let w = 0; w < n; w++) if (ma(w, u)) { const a = rr[w]; for (let k = 0; k < W; k++) { const nowe = (rv[k] & ~a[k]) >>> 0; if (nowe) { razem += pc32(nowe); a[k] = (a[k] | nowe) >>> 0; } } }
                    }
                    o.push(razem);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<500> r[500];
int main() {
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < n; i++) { // zerowanie przed testem
        r[i].reset();
        r[i][i] = 1;
    }
    long long razem = 0;
    for (int e = 0; e < m; e++) {
        int u, v;
        cin >> u >> v;
        u--;
        v--;
        if (!r[u][v]) {
            for (int w = 0; w < n; w++) {
                if (r[w][u]) {
                    int przed = r[w].count();
                    r[w] |= r[v];
                    razem += (int)r[w].count() - przed;
                }
            }
        }
        cout << razem << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-b-final-wyszukiwarka', krok: 9, level: 'trudne',
            title: 'Wielki finał: wyszukiwarka dokumentów',
            short: 'Dla każdego słowa bitset dokumentów, w których występuje. Zapytanie z AND, OR, NOT i nawiasami policz rekurencyjnie jak kalkulator — tylko zamiast liczb są bitsety. Tak działają prawdziwe wyszukiwarki.',
            tags: ['map<string, bitset<1000>>', 'rekurencyjny kalkulator', 'NOT = ~x & wszystkie', '_Find_next'],
            statement: ['Budujesz wyszukiwarkę. Masz n dokumentów (dokument to wiersz słów z małych liter) i q zapytań. Zapytanie to wyrażenie ze słów oraz operatorów AND, OR, NOT i nawiasów, oddzielonych spacjami. Słowo oznacza „dokument zawiera to słowo”. NOT ma najwyższy priorytet, potem AND, a najniższy OR — tak jak !, && i || w C++. Operatory tego samego rodzaju liczymy od lewej.',
                'Dla każdego zapytania wypisz, ile dokumentów do niego pasuje, a po spacji numery (od 1) najwyżej dziesięciu pierwszych z nich, rosnąco. Zbuduj indeks: dla każdego słowa bitset dokumentów, w których występuje. Zapytanie policz rekurencyjnie, jak kalkulator z nawiasami z lekcji Rekurencja: wyrazenie = skladnik OR skladnik OR …, skladnik = czynnik AND czynnik AND …, czynnik = NOT czynnik albo ( wyrazenie ) albo słowo. OR to |, AND to &, a NOT to ~x — ale przycięte do n dokumentów: ~x & wszystkie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy dokument: słowa z małych liter oddzielone pojedynczymi spacjami.', 'Potem liczba q, a w każdym z kolejnych q wierszy zapytanie (elementy oddzielone pojedynczymi spacjami).'],
            output_format: ['q wierszy: liczba pasujących dokumentów i numery najwyżej dziesięciu pierwszych.'],
            constraints: ['1 ≤ n ≤ 1000', 'w dokumentach jest razem najwyżej 12 000 słów, każde ma od 1 do 15 liter', '1 ≤ q ≤ 300', 'każde zapytanie jest poprawne i ma najwyżej 60 elementów'],
            examples: [{ input: '4\nkot ma ale\npies i kot\nala ma psa\nkot kot kot\n4\nkot\nkot AND NOT pies\nala OR pies AND kot\n( ala OR pies ) AND kot', note: 'kot jest w dokumentach 1, 2 i 4. Bez psa zostają 1 i 4. W trzecim zapytaniu AND wiąże mocniej: ala OR (pies AND kot) — dokumenty 2 i 3. Nawiasy zmieniają wynik: (ala OR pies) AND kot to tylko dokument 2.' }],
            hint: R`vector<string> t; int poz; bitset<1000> wyrazenie(); czynnik() { if (t[poz] == "NOT") { poz++; return ~czynnik() & wszystkie; } if (t[poz] == "(") { poz++; auto w = wyrazenie(); poz++; return w; } return indeks[t[poz++]]; }. Wypisywanie: for (int d = w._Find_first(); d < n && ile < 10; d = w._Find_next(d)).`,
            tests: (r) => {
                const SL = [...new Set([...SLOWA_ANG, ...Array.from({ length: 150 }, () => slowo(r, 2, 8, 'abcdefghijklmnoprstuwyz'))])].filter((w) => w.length <= 15);
                const wagi = SL.map((_, i) => 1 / (i + 1));
                const sumW = suma(wagi);
                const losSlowo = () => { let x = r() * sumW; for (let i = 0; i < SL.length; i++) { x -= wagi[i]; if (x <= 0) return SL[i]; } return SL[0]; };
                const gen = (n, maxSlow, q, gl) => {
                    let ile = 0; const docs = [];
                    for (let i = 0; i < n; i++) { const k = Math.max(1, Math.min(r.int(1, maxSlow), 12000 - ile - (n - i - 1))); ile += k; docs.push(Array.from({ length: k }, losSlowo).join(' ')); }
                    const slowoZap = () => (r() < 0.08 ? slowo(r, 3, 6, 'qvxz') : losSlowo());
                    const W = (d) => { const k = d > 0 && r() < 0.5 ? r.int(2, 3) : 1; return Array.from({ length: k }, () => S(d)).join(' OR '); };
                    const S = (d) => { const k = d > 0 && r() < 0.5 ? r.int(2, 3) : 1; return Array.from({ length: k }, () => C(d)).join(' AND '); };
                    const C = (d) => { const x = r(); if (x < 0.2) return 'NOT ' + C(d); if (x < 0.45 && d > 0) return '( ' + W(d - 1) + ' )'; return slowoZap(); };
                    const zap = []; while (zap.length < q) { const z = W(gl); if (z.split(' ').length <= 60) zap.push(z); }
                    return `${n}\n${docs.join('\n')}\n${q}\n${zap.join('\n')}`;
                };
                return ['4\nkot ma ale\npies i kot\nala ma psa\nkot kot kot\n4\nkot\nkot AND NOT pies\nala OR pies AND kot\n( ala OR pies ) AND kot', '1\na\n3\na\nNOT a\nb OR NOT NOT a', gen(1000, 20, 300, 3), gen(1000, 5, 300, 2), gen(300, 40, 300, 4), gen(50, 10, 300, 3), gen(1000, 12, 300, 1)];
            },
            check: (inp) => {
                const l = L(inp); const n = Number(l[0]); if (!calk(n, 1, 1000)) return 'dane';
                const docs = l.slice(1, 1 + n); if (docs.length !== n || !docs.every((d) => /^[a-z]{1,15}( [a-z]{1,15})*$/.test(d))) return 'dokumenty';
                if (suma(docs.map((d) => d.split(' ').length)) > 12000) return 'za dużo słów';
                const q = Number(l[1 + n]); const zap = l.slice(2 + n); if (!calk(q, 1, 300) || zap.length !== q) return 'dane';
                for (const z of zap) { const t = z.split(' '); if (t.length > 60) return 'za długie'; let p = 0; const W = () => { if (!S()) return false; while (t[p] === 'OR') { p++; if (!S()) return false; } return true; }; const S = () => { if (!C()) return false; while (t[p] === 'AND') { p++; if (!C()) return false; } return true; }; const C = () => { if (t[p] === 'NOT') { p++; return C(); } if (t[p] === '(') { p++; if (!W()) return false; if (t[p] !== ')') return false; p++; return true; } if (/^[a-z]{1,15}$/.test(t[p] || '')) { p++; return true; } return false; }; if (!W() || p !== t.length) return 'złe zapytanie: ' + z; }
                return null;
            },
            solve: (inp) => {
                const l = L(inp); const n = Number(l[0]); const docs = l.slice(1, 1 + n).map((d) => new Set(d.split(' ')));
                const ind = new Map(); docs.forEach((s, i) => { for (const w of s) { if (!ind.has(w)) ind.set(w, new Uint8Array(n)); ind.get(w)[i] = 1; } });
                return l.slice(2 + n).map((z) => {
                    const t = z.split(' '); let p = 0;
                    const W = () => { let a = S(); while (t[p] === 'OR') { p++; const b = S(); a = a.map((x, i) => x | b[i]); } return a; };
                    const S = () => { let a = C(); while (t[p] === 'AND') { p++; const b = C(); a = a.map((x, i) => x & b[i]); } return a; };
                    const C = () => { if (t[p] === 'NOT') { p++; return C().map((x) => x ^ 1); } if (t[p] === '(') { p++; const a = W(); p++; return a; } const w = t[p++]; return ind.has(w) ? ind.get(w).slice() : new Uint8Array(n); };
                    const a = W(); const nr = []; let c = 0; for (let i = 0; i < n; i++) if (a[i]) { c++; if (nr.length < 10) nr.push(i + 1); }
                    return [c, ...nr].join(' ');
                }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int n, poz;
vector<string> t;
map<string, bitset<1000>> indeks;
bitset<1000> wszystkie;
bitset<1000> wyrazenie();
bitset<1000> czynnik() {
    if (t[poz] == "NOT") {
        poz++;
        return ~czynnik() & wszystkie;
    }
    if (t[poz] == "(") {
        poz++;
        bitset<1000> w = wyrazenie();
        poz++; // nawias zamykający
        return w;
    }
    string s = t[poz++];
    if (indeks.count(s)) return indeks[s];
    return bitset<1000>();
}
bitset<1000> skladnik() {
    bitset<1000> w = czynnik();
    while (poz < (int)t.size() && t[poz] == "AND") {
        poz++;
        w &= czynnik();
    }
    return w;
}
bitset<1000> wyrazenie() {
    bitset<1000> w = skladnik();
    while (poz < (int)t.size() && t[poz] == "OR") {
        poz++;
        w |= skladnik();
    }
    return w;
}
int main() {
    indeks.clear(); // zerowanie przed testem
    wszystkie.reset();
    cin >> n;
    cin.ignore();
    for (int d = 0; d < n; d++) {
        wszystkie[d] = 1;
        string linia, s;
        getline(cin, linia);
        stringstream ss(linia);
        while (ss >> s) indeks[s][d] = 1;
    }
    int q;
    cin >> q;
    cin.ignore();
    for (int k = 0; k < q; k++) {
        string linia, s;
        getline(cin, linia);
        stringstream ss(linia);
        t.clear();
        while (ss >> s) t.push_back(s);
        poz = 0;
        bitset<1000> w = wyrazenie();
        cout << w.count();
        int ile = 0;
        for (int d = w._Find_first(); d < n && ile < 10; d = w._Find_next(d)) {
            cout << " " << d + 1;
            ile++;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
    ];
};
