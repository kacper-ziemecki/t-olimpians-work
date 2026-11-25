// Stos — baza zadań na koniec lekcji: 28 zadań od łatwych do trudnych (10 / 10 / 8), które łączą wszystkie części lekcji:
// pierwszy stos, polecenia i cofanie, nawiasy, wyrażenia, stos monotoniczny, prostokąty, DFS z własnym stosem
// i sztuczki olimpijskie — a na koniec wielki finał: maszyna stosowa ze stosem danych i stosem wywołań.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./stos-pomoc');
    const { calk, IMIONA, KOLORY, SLOWA, czyPoprawne, losPoprawne, popsuj, losNawiasy, czyOtw, czyZam, paraDo, najblizszy, generuj, losGen, dobryGen, KOD_GEN, losGraf, losDrzewoOjcow, dobreDrzewo, liczOnp, drzewoOnp, naOnp, tokenyInfix, dzialanie, LIMIT, D4 } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const d1 = (a) => `${a.length}\n${a.join(' ')}`;

    // Maszyna stosowa z finału: wykonuje program (tablica linii) dokładnie tak jak wzorcówka C++.
    // dobry = program mieści się w limitach z treści (kroki, zakres liczb, liczba PRINT, rozmiar stosu na końcu).
    const POTRZEBA = { POP: 1, DUP: 1, PRINT: 1, JZ: 1, SWAP: 2, OVER: 2, ADD: 2, SUB: 2, MUL: 2, DIV: 2, MOD: 2, ROT: 3 };
    function maszyna(L, limitKrokow = 100000) {
        const p = L.length, op = [null], arg = [0n];
        for (const l of L) { const [o, a] = l.split(' '); op.push(o); arg.push(a === undefined ? 0n : BigInt(a)); }
        const s = [], wyw = [], wyjscie = [];
        let pc = 1, blad = 0, kroki = 0, dobry = true, powod = '';
        while (pc >= 1 && pc <= p) {
            if (++kroki > limitKrokow) { dobry = false; powod = 'kroki'; break; }
            const o = op[pc];
            if (s.length < (POTRZEBA[o] || 0) || ((o === 'DIV' || o === 'MOD') && s[s.length - 1] === 0n) || (o === 'RET' && !wyw.length)) { blad = pc; break; }
            if (o === 'HALT') break;
            let nast = pc + 1;
            if (o === 'PUSH') s.push(arg[pc]);
            else if (o === 'POP') s.pop();
            else if (o === 'DUP') s.push(s[s.length - 1]);
            else if (o === 'SWAP') { const n = s.length; [s[n - 1], s[n - 2]] = [s[n - 2], s[n - 1]]; }
            else if (o === 'OVER') s.push(s[s.length - 2]);
            else if (o === 'ROT') s.push(s.splice(s.length - 3, 1)[0]);
            else if (o === 'PRINT') { wyjscie.push(String(s.pop())); if (wyjscie.length > 1000) { dobry = false; powod = 'print'; break; } }
            else if (o === 'JMP') nast = Number(arg[pc]);
            else if (o === 'JZ') { if (s.pop() === 0n) nast = Number(arg[pc]); }
            else if (o === 'CALL') { wyw.push(pc + 1); nast = Number(arg[pc]); }
            else if (o === 'RET') nast = wyw.pop();
            else {
                const b = s.pop(), a = s.pop();
                const v = o === 'ADD' ? a + b : o === 'SUB' ? a - b : o === 'MUL' ? a * b : o === 'DIV' ? a / b : a % b;
                if (v > LIMIT || v < -LIMIT) { dobry = false; powod = 'zakres'; break; }
                s.push(v);
            }
            pc = nast;
        }
        if (s.length > 100) { dobry = false; powod = 'stos'; }
        return { wyjscie, blad, stos: s, kroki, dobry, powod };
    }

    // Pełny kalkulator: minus na początku albo po '(' liczymy jak 0 − …; wykładniki muszą być od 0 do 62.
    function wartPelna(s) {
        const st = [];
        for (const t of naOnp(s.replace(/(^|\()-/g, '$10-'))) {
            if (t === '+' || t === '-' || t === '*' || t === '/' || t === '^') {
                if (st.length < 2) return null;
                const b = st.pop(), a = st.pop();
                if (t === '/' && b === 0n) return null;
                if (t === '^' && (b < 0n || b > 62n)) return null;
                const v = dzialanie(a, b, t);
                if (v > LIMIT || v < -LIMIT) return null;
                st.push(v);
            } else st.push(BigInt(t));
        }
        return st.length === 1 ? st[0] : null;
    }

    // Wzór chemiczny: null, gdy poprawny (symbole, liczby 1–999 bez zer na początku, niepuste nawiasy, zagnieżdżenie ≤ 4).
    function zlyWzor(s) {
        if (s.length < 1 || s.length > 1000) return 'dlugosc';
        let i = 0, g = 0, poprzedni = '';
        const liczba = () => { if (!/\d/.test(s[i] || '')) return true; if (s[i] === '0') return false; let j = i; while (j < s.length && /\d/.test(s[j])) j++; if (j - i > 3) return false; i = j; return true; };
        while (i < s.length) {
            const c = s[i];
            if (c === '(') { g++; if (g > 4) return 'glebokosc'; poprzedni = '('; i++; }
            else if (c === ')') { if (!g || poprzedni === '(') return 'nawiasy'; g--; i++; if (!liczba()) return 'liczba'; poprzedni = ')'; }
            else if (/[A-Z]/.test(c)) { i++; while (i < s.length && /[a-z]/.test(s[i])) i++; if (!liczba()) return 'liczba'; poprzedni = 'A'; }
            else return 'znak ' + c;
        }
        return g ? 'nawiasy' : null;
    }

    return [
        // ================================================================ BAZA · łatwe
        {
            id: 'sto-b-ostatni-cieplejszy', krok: 9, level: 'latwe',
            title: 'Od ostatniego cieplejszego dnia',
            short: 'Ile dni minęło od ostatniego dnia, który był cieplejszy niż dziś? I ile było dni rekordowych, przed którymi nie było nic cieplejszego?',
            tags: ['poprzedni większy', 'stos numerów dni', 'dni rekordowe'],
            statement: ['Dostajesz temperatury z n kolejnych dni (dni numerujemy od 1). Dla każdego dnia wypisz, ile dni minęło od ostatniego wcześniejszego dnia, który był ostro cieplejszy. Jeśli żaden wcześniejszy dzień nie był cieplejszy, ten dzień jest rekordowy — wypisz dla niego 0.',
                'W drugim wierszu wypisz, ile było dni rekordowych. Szukaj poprzedniego większego elementu stosem z numerami dni.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n temperatur.'],
            output_format: ['Dwa wiersze: n liczb (odległości albo 0) oraz rekordow: R.'],
            constraints: ['1 ≤ n ≤ 3000', 'Temperatury są z przedziału od −30 do 40.'],
            examples: [{ input: '7\n10 14 12 12 15 9 13', note: 'Dla 12 ostatni cieplejszy dzień to 14 sprzed 1 i 2 dni. Dla 13 ostatni cieplejszy to 15 sprzed dwóch dni. Rekordowe są dni z 10, 14 i 15.' }],
            hint: R`for (int i = 0; i < n; i++) { while (!s.empty() && t[s.top()] <= t[i]) s.pop(); if (s.empty()) { w[i] = 0; rekordy++; } else w[i] = i - s.top(); s.push(i); }.`,
            tests: (r) => [d1([5]), d1([1, 2, 3]), d1([3, 2, 1]), d1([4, 4, 4]), d1(r.arr(20, -5, 5)), d1(r.arr(3000, -30, 40)), d1(Array.from({ length: 3000 }, (_, i) => -30 + Math.floor(i / 43))), d1(Array.from({ length: 3000 }, (_, i) => (i % 2 ? 40 : -30)))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -30, 40)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const j = najblizszy(a, -1, (x, y) => x > y); let rek = 0; const w = Array.from(j, (k, i) => { if (k < 0) { rek++; return 0; } return i - k; }); return `${w.join(' ')}\nrekordow: ${rek}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> t(n), w(n);
    for (int i = 0; i < n; i++) cin >> t[i];
    stack<int> s;
    int rekordy = 0;
    for (int i = 0; i < n; i++) {
        while (!s.empty() && t[s.top()] <= t[i]) s.pop();
        if (s.empty()) {
            w[i] = 0;
            rekordy++;
        } else {
            w[i] = i - s.top();
        }
        s.push(i);
    }
    for (int i = 0; i < n; i++) cout << w[i] << " ";
    cout << "\nrekordow: " << rekordy << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-skarpetki', krok: 9, level: 'latwe',
            title: 'Skarpetki z suszarki',
            short: 'Wyjmujesz skarpetki jedną po drugiej i kładziesz na kupkę. Jeśli wierzchnia ma ten sam kolor — masz parę i zabierasz obie.',
            tags: ['porównanie z wierzchem', 'pary zdejmowane', 'stack<string>'],
            statement: ['Wyjmujesz z suszarki n skarpetek, jedną po drugiej. Każdą kładziesz na kupkę, ale jeśli skarpetka na wierzchu kupki ma ten sam kolor co wyjęta, to masz parę — zabierasz obie skarpetki i odkładasz parę do szuflady.',
                'Policz, ile par trafiło do szuflady i ile skarpetek zostało na kupce, oraz wypisz kolor skarpetki na wierzchu kupki (albo słowo nic).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n kolorów skarpetek w kolejności wyjmowania.'],
            output_format: ['Trzy wiersze: par: P, na kupce: K oraz na wierzchu: kolor (albo nic).'],
            constraints: ['1 ≤ n ≤ 10 000', 'Kolory to słowa z 1–12 małych liter.'],
            examples: [{ input: '7\nbialy czarny czarny bialy szary bialy bialy', note: 'Druga czarna tworzy parę z pierwszą, potem biała z białą, a na końcu dwie białe. Zostaje szara.' }],
            hint: R`if (!s.empty() && s.top() == kolor) { s.pop(); par++; } else s.push(kolor);. Na kupce zostaje s.size() skarpetek.`,
            tests: (r) => { const los = (n, k) => Array.from({ length: n }, () => r.pick(KOLORY.slice(0, k))); return [d1(['zolty']), d1(['a', 'a']), d1(['a', 'b', 'a']), d1(los(20, 3)), d1(los(10000, 2)), d1(los(10000, 12)), d1(los(5000, 1))]; },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 10000) && t.length === n + 1 && t.slice(1).every((s) => /^[a-z]{1,12}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => { const st = []; let par = 0; for (const k of toks(inp).slice(1)) { if (st.length && st[st.length - 1] === k) { st.pop(); par++; } else st.push(k); } return `par: ${par}\nna kupce: ${st.length}\nna wierzchu: ${st.length ? st[st.length - 1] : 'nic'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    stack<string> s;
    int par = 0;
    for (int i = 0; i < n; i++) {
        string kolor;
        cin >> kolor;
        if (!s.empty() && s.top() == kolor) {
            s.pop();
            par++;
        } else {
            s.push(kolor);
        }
    }
    cout << "par: " << par << "\n";
    cout << "na kupce: " << s.size() << "\n";
    cout << "na wierzchu: " << (s.empty() ? "nic" : s.top()) << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-ksiazki-na-biurku', krok: 9, level: 'latwe',
            title: 'Książki na biurku',
            short: 'Dwa stosy książek i przekładanie po jednej. Przełożenie k książek odwraca ich kolejność — zobacz, gdzie co wyląduje.',
            tags: ['dwa stosy', 'przekładanie k razy', 'pusty stos'],
            statement: ['Na biurku leżą dwa stosy książek: A i B. Na początku wszystkie książki o numerach od 1 do n leżą w stosie A — książka 1 na samym dole, n na samej górze — a stos B jest pusty. Wykonaj q poleceń. AB k przekłada po jednej k książek z wierzchu A na wierzch B (jeśli w A jest mniej książek, przekłada wszystkie). BA k działa w drugą stronę. ? wypisuje numery książek leżących na wierzchu A i B (dla pustego stosu wypisz -).',
                'Na koniec wypisz oba stosy od góry do dołu.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z q kolejnych wierszy polecenie: AB k, BA k albo ?.'],
            output_format: ['Po jednym wierszu dla każdego ? (dwie wartości), a na końcu dwa wiersze: A: … oraz B: … (numery od góry albo -).'],
            constraints: ['1 ≤ n ≤ 500', '1 ≤ q ≤ 500', '1 ≤ k ≤ 1000'],
            examples: [{ input: '5 4\nAB 2\n?\nBA 1\n?', note: 'Z A schodzą 5 i 4 — na wierzchu B leży 4. Potem 4 wraca na A.' }],
            hint: R`void przeloz(stack<int> &z, stack<int> &na, int k) { while (k > 0 && !z.empty()) { na.push(z.top()); z.pop(); k--; } }. Stosy przekazuj przez &, inaczej funkcja przełoży tylko kopie.`,
            tests: (r) => {
                const gen = (n, q) => { const o = []; for (let i = 0; i < q; i++) { const p = r(); o.push(p < 0.4 ? `AB ${r.int(1, Math.min(1000, n))}` : p < 0.75 ? `BA ${r.int(1, Math.min(1000, n))}` : '?'); } return `${n} ${q}\n${o.join('\n')}`; };
                return ['1 1\n?', '3 2\nBA 5\n?', '4 3\nAB 1000\n?\nBA 2', gen(10, 15), gen(500, 500), gen(300, 500), gen(500, 100)];
            },
            check: (inp) => { const L = linie(inp); const [n, q] = L[0].split(' ').map(Number); return calk(n, 1, 500) && calk(q, 1, 500) && L.length === q + 1 && L.slice(1).every((l) => l === '?' || (/^(AB|BA) \d+$/.test(l) && calk(Number(l.slice(3)), 1, 1000))) ? null : 'dane'; },
            solve: (inp) => {
                const L = linie(inp); const [n] = L[0].split(' ').map(Number);
                const A = Array.from({ length: n }, (_, i) => i + 1), B = [], o = [];
                const top = (s) => (s.length ? s[s.length - 1] : '-');
                for (const l of L.slice(1)) {
                    if (l === '?') { o.push(`${top(A)} ${top(B)}`); continue; }
                    let k = Number(l.slice(3)); const [z, na] = l.startsWith('AB') ? [A, B] : [B, A];
                    while (k > 0 && z.length) { na.push(z.pop()); k--; }
                }
                o.push('A: ' + (A.length ? A.slice().reverse().join(' ') : '-'), 'B: ' + (B.length ? B.slice().reverse().join(' ') : '-'));
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void przeloz(stack<int> &z, stack<int> &na, int k) {
    while (k > 0 && !z.empty()) {
        na.push(z.top());
        z.pop();
        k--;
    }
}
void wypisz(string nazwa, stack<int> s) {
    cout << nazwa << ":";
    if (s.empty()) cout << " -";
    while (!s.empty()) {
        cout << " " << s.top();
        s.pop();
    }
    cout << "\n";
}
int main() {
    int n, q;
    cin >> n >> q;
    stack<int> a, b;
    for (int i = 1; i <= n; i++) a.push(i);
    while (q--) {
        string p;
        cin >> p;
        if (p == "?") {
            if (a.empty()) cout << "-";
            else cout << a.top();
            cout << " ";
            if (b.empty()) cout << "-";
            else cout << b.top();
            cout << "\n";
            continue;
        }
        int k;
        cin >> k;
        if (p == "AB") przeloz(a, b, k);
        else przeloz(b, a, k);
    }
    wypisz("A", a);
    wypisz("B", b);
    return 0;
}`,
        },
        {
            id: 'sto-b-wieze-hanoi', krok: 9, level: 'latwe',
            title: 'Sędzia wież Hanoi',
            short: 'Trzy pręty to trzy stosy krążków. Sprawdź każdy ruch: nie wolno brać z pustego pręta ani kłaść większego krążka na mniejszy.',
            tags: ['trzy stosy', 'sprawdzanie ruchu', 'pierwszy błąd'],
            statement: ['W łamigłówce wieże Hanoi są trzy pręty. Na początku na pręcie 1 leży n krążków o rozmiarach od n (na dole) do 1 (na górze), a pręty 2 i 3 są puste. Ruch a b przenosi górny krążek z pręta a na pręt b. Ruch jest niedozwolony, jeśli pręt a jest pusty albo jeśli na pręcie b leży na górze krążek mniejszy od przenoszonego.',
                'Sprawdź po kolei m ruchów gracza. Jeśli któryś ruch jest niedozwolony, wypisz BLAD w ruchu k, gdzie k to numer pierwszego takiego ruchu (od 1), i nie sprawdzaj dalej. Jeśli wszystkie ruchy są dozwolone, wypisz OK. W obu przypadkach wypisz potem zawartość trzech prętów od dołu do góry — po ostatnim dozwolonym ruchu.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z m kolejnych wierszy ruch: dwie różne liczby a i b od 1 do 3.'],
            output_format: ['Wiersz OK albo BLAD w ruchu k, a potem trzy wiersze: 1: …, 2: …, 3: … (rozmiary krążków od dołu albo -).'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ m ≤ 2000'],
            examples: [{ input: '2 4\n1 2\n1 3\n2 3\n3 1', note: 'Trzy pierwsze ruchy przenoszą wieżę na pręt 3. Czwarty bierze krążek 1 z pręta 3 i kładzie na pusty pręt 1 — też dozwolone.' }, { input: '3 2\n1 2\n1 2', note: 'Drugi ruch kładzie krążek 2 na krążek 1 — błąd.' }],
            hint: R`stack<int> pret[4];, for (int i = n; i >= 1; i--) pret[1].push(i);. Ruch: if (pret[a].empty() || (!pret[b].empty() && pret[b].top() < pret[a].top())) — błąd. Wypisanie od dołu: kopię stosu przelej do pomocniczego (albo trzymaj pręty w vectorach).`,
            tests: (r) => {
                const gen = (n, m, pBlad) => {
                    const p = [null, Array.from({ length: n }, (_, i) => n - i), [], []], o = [];
                    for (let i = 0; i < m; i++) {
                        const dozw = [];
                        for (let a = 1; a <= 3; a++) for (let b = 1; b <= 3; b++) if (a !== b && p[a].length && (!p[b].length || p[b][p[b].length - 1] > p[a][p[a].length - 1])) dozw.push([a, b]);
                        if (r() < pBlad || !dozw.length) { const a = r.int(1, 3); let b = r.int(1, 3); while (b === a) b = r.int(1, 3); o.push(`${a} ${b}`); continue; }
                        const [a, b] = r.pick(dozw); p[b].push(p[a].pop()); o.push(`${a} ${b}`);
                    }
                    return `${n} ${m}\n${o.join('\n')}`;
                };
                const opt = (n) => { const o = []; const han = (k, a, b, c) => { if (!k) return; han(k - 1, a, c, b); o.push(`${a} ${c}`); han(k - 1, b, a, c); }; han(n, 1, 2, 3); return `${n} ${o.length}\n${o.join('\n')}`; };
                return ['1 1\n1 3', '1 2\n2 3\n1 3', '2 1\n1 3', opt(3), opt(10), gen(5, 30, 0), gen(20, 2000, 0), gen(20, 2000, 0.002), gen(8, 200, 0.02), gen(3, 50, 0.1)];
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; if (!calk(n, 1, 20) || !calk(m, 1, 2000) || t.length !== 2 + 2 * m) return 'dane'; for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; if (!calk(a, 1, 3) || !calk(b, 1, 3) || a === b) return 'ruch'; } return null; },
            solve: (inp) => {
                const t = nums(inp); const [n, m] = t;
                const p = [null, Array.from({ length: n }, (_, i) => n - i), [], []];
                let wynik = 'OK';
                for (let i = 0; i < m; i++) {
                    const a = t[2 + 2 * i], b = t[3 + 2 * i];
                    if (!p[a].length || (p[b].length && p[b][p[b].length - 1] < p[a][p[a].length - 1])) { wynik = `BLAD w ruchu ${i + 1}`; break; }
                    p[b].push(p[a].pop());
                }
                return [wynik, ...[1, 2, 3].map((k) => `${k}: ${p[k].length ? p[k].join(' ') : '-'}`)].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    stack<int> pret[4];
    for (int i = n; i >= 1; i--) pret[1].push(i);
    int blad = 0;
    for (int i = 1; i <= m; i++) {
        int a, b;
        cin >> a >> b;
        if (blad) continue;
        if (pret[a].empty() || (!pret[b].empty() && pret[b].top() < pret[a].top())) {
            blad = i;
            continue;
        }
        pret[b].push(pret[a].top());
        pret[a].pop();
    }
    if (blad) cout << "BLAD w ruchu " << blad << "\n";
    else cout << "OK\n";
    for (int k = 1; k <= 3; k++) {
        stack<int> pom;
        while (!pret[k].empty()) {
            pom.push(pret[k].top());
            pret[k].pop();
        }
        cout << k << ":";
        if (pom.empty()) cout << " -";
        while (!pom.empty()) {
            cout << " " << pom.top();
            pom.pop();
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-kulki', krok: 9, level: 'latwe',
            title: 'Znikające kulki',
            short: 'Kulki wpadają do rury jedna po drugiej. Gdy na górze uzbiera się k kulek jednego koloru, znikają. Stos par (kolor, ile z rzędu) robi to w jednym kroku na kulkę.',
            tags: ['stack<pair<char, int>>', 'liczenie serii', 'znikanie przy k'],
            statement: ['Do pionowej rury wpadają kulki — każda kolejna ląduje na samej górze. Kulki mają kolory oznaczone małymi literami. Gdy na górze rury leży k kulek tego samego koloru jedna na drugiej, wszystkie znikają, a na górze zostaje to, co było pod nimi.',
                'Wypisz, ile kulek zniknęło, a potem kulki, które zostały w rurze, od dołu do góry (albo pusto). Trzymaj na stosie pary: kolor i liczbę kulek tego koloru leżących kolejno na górze. Nowa kulka zwiększa licznik na wierzchu (jeśli kolor się zgadza) albo kładzie nową parę. Gdy licznik dojdzie do k — zdejmij parę.'],
            input_format: ['W pierwszym wierszu liczba k.', 'W drugim wierszu kolory kulek w kolejności wpadania (napis z małych liter).'],
            output_format: ['Dwa wiersze: zniknelo: Z oraz kulki od dołu jako napis (albo pusto).'],
            constraints: ['2 ≤ k ≤ 10', 'Kulek jest od 1 do 20 000.'],
            examples: [{ input: '3\naabbbac', note: 'Trzy b znikają. Wtedy na górze leżą dwa a, a trzecie a dopełnia trójkę — też znikają. Zostaje samo c.' }],
            hint: R`stack<pair<char, int>> s; for (char c : kulki) { if (!s.empty() && s.top().first == c) s.top().second++; else s.push({c, 1}); if (s.top().second == k) { zniknelo += k; s.pop(); } }. Na koniec przełóż stos do vectora, żeby wypisać od dołu.`,
            tests: (r) => [`2\na`, `2\naa`, `3\naabbbac`, `2\nabba`, `3\n${r.word(30, 'ab')}`, `2\n${r.word(20000, 'ab')}`, `3\n${r.word(20000, 'abc')}`, `5\n${r.word(20000, 'ab')}`, `10\n${'a'.repeat(19999)}b`, `4\n${r.word(20000, 'abcdef')}`],
            check: (inp) => { const [k, s] = linie(inp); return calk(Number(k), 2, 10) && /^[a-z]{1,20000}$/.test(s || '') && linie(inp).length === 2 ? null : 'dane'; },
            solve: (inp) => {
                const [ks, s] = linie(inp); const k = Number(ks); const st = []; let z = 0;
                for (const c of s) { if (st.length && st[st.length - 1][0] === c) st[st.length - 1][1]++; else st.push([c, 1]); if (st[st.length - 1][1] === k) { z += k; st.pop(); } }
                const w = st.map(([c, n]) => c.repeat(n)).join('');
                return `zniknelo: ${z}\n${w || 'pusto'}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    string kulki;
    cin >> k >> kulki;
    stack<pair<char, int>> s; // (kolor, ile takich kulek leży kolejno na górze)
    int zniknelo = 0;
    for (char c : kulki) {
        if (!s.empty() && s.top().first == c) s.top().second++;
        else s.push({c, 1});
        if (s.top().second == k) {
            zniknelo += k;
            s.pop();
        }
    }
    vector<pair<char, int>> v;
    while (!s.empty()) {
        v.push_back(s.top());
        s.pop();
    }
    reverse(v.begin(), v.end());
    string w;
    for (auto [c, ile] : v) w += string(ile, c);
    cout << "zniknelo: " << zniknelo << "\n";
    cout << (w.empty() ? "pusto" : w) << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-licytacja', krok: 9, level: 'latwe',
            title: 'Licytacja z wycofaniem',
            short: 'Każda przyjęta oferta jest wyższa od poprzedniej, więc na wierzchu stosu zawsze leży zwycięzca. Wycofanie zdejmuje wierzch i znowu wygrywa poprzednia oferta.',
            tags: ['stos par', 'odrzucanie za niskich', 'wycofanie = pop'],
            statement: ['Na aukcji padają oferty. OFERTA imie kwota zostaje przyjęta tylko wtedy, gdy kwota jest ostro wyższa od najwyższej przyjętej oferty, która jeszcze obowiązuje — w przeciwnym razie wypisz odrzucona. WYCOFAJ unieważnia ostatnią obowiązującą ofertę (jeśli nie ma żadnej, nic się nie dzieje). KTO wypisuje, kto prowadzi i z jaką kwotą, albo słowo brak.',
                'Zauważ, że przyjęte oferty rosną, więc najwyższa obowiązująca jest zawsze ostatnią przyjętą. Trzymaj je na stosie par stack<pair<string, int>>: zwycięzca leży na wierzchu, a po wycofaniu na wierzch wraca poprzednia oferta.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy polecenie: OFERTA imie kwota, WYCOFAJ albo KTO.'],
            output_format: ['Po jednym wierszu dla każdego KTO (imie kwota albo brak) i dla każdej odrzuconej oferty (odrzucona).'],
            constraints: ['1 ≤ q ≤ 1000', 'Kwoty są z przedziału od 1 do 10⁹, imiona mają od 1 do 15 liter.'],
            examples: [{ input: '7\nOFERTA Ala 100\nOFERTA Ola 90\nOFERTA Kuba 150\nKTO\nWYCOFAJ\nKTO\nWYCOFAJ', note: 'Ola proponuje mniej niż Ala — odrzucona. Po wycofaniu oferty Kuby znowu prowadzi Ala.' }],
            hint: R`OFERTA: if (!s.empty() && kwota <= s.top().second) cout << "odrzucona\n"; else s.push({imie, kwota});. KTO: if (s.empty()) cout << "brak\n"; else cout << s.top().first << " " << s.top().second << "\n";.`,
            tests: (r) => {
                const gen = (q, po) => { const o = []; let teraz = 0; for (let i = 0; i < q; i++) { const p = r(); if (p < po) { const kw = Math.max(1, Math.min(1000000000, teraz + r.int(-50, 100))); o.push(`OFERTA ${r.pick(IMIONA)} ${kw}`); teraz = Math.max(teraz, kw); } else o.push(p < po + (1 - po) / 2 ? 'WYCOFAJ' : 'KTO'); } return `${q}\n${o.join('\n')}`; };
                return ['1\nKTO', '2\nWYCOFAJ\nKTO', '4\nOFERTA Ala 5\nOFERTA Ola 5\nKTO\nOFERTA Ola 6', gen(20, 0.5), gen(1000, 0.5), gen(1000, 0.7), gen(1000, 0.3)];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); return calk(q, 1, 1000) && L.length === q + 1 && L.slice(1).every((l) => l === 'WYCOFAJ' || l === 'KTO' || (/^OFERTA [A-Za-z]{1,15} \d+$/.test(l) && calk(Number(l.split(' ')[2]), 1, 1e9))) ? null : 'dane'; },
            solve: (inp) => {
                const st = [], o = [];
                for (const l of linie(inp).slice(1)) {
                    const t = l.split(' ');
                    if (t[0] === 'OFERTA') { const k = Number(t[2]); if (st.length && k <= st[st.length - 1][1]) o.push('odrzucona'); else st.push([t[1], k]); }
                    else if (t[0] === 'WYCOFAJ') st.pop();
                    else o.push(st.length ? `${st[st.length - 1][0]} ${st[st.length - 1][1]}` : 'brak');
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    stack<pair<string, int>> s;
    while (q--) {
        string p;
        cin >> p;
        if (p == "OFERTA") {
            string imie;
            int kwota;
            cin >> imie >> kwota;
            if (!s.empty() && kwota <= s.top().second) cout << "odrzucona\n";
            else s.push({imie, kwota});
        } else if (p == "WYCOFAJ") {
            if (!s.empty()) s.pop();
        } else {
            if (s.empty()) cout << "brak\n";
            else cout << s.top().first << " " << s.top().second << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-porownaj-z-cofaniem', krok: 9, level: 'latwe',
            title: 'Czy wyszło to samo?',
            short: 'Dwie osoby pisały z Backspace’em (#). Przepuść oba zapisy przez stos znaków i porównaj, co zostało na ekranach.',
            tags: ['string jako stos', 'funkcja zwracająca napis', 'kilka testów'],
            statement: ['Dwie osoby pisały na klawiaturze, a Ty masz zapisy ich klawiszy: mała litera dopisuje się na koniec tekstu, a # to Backspace, który kasuje ostatnią literę (na pustym tekście nic nie robi). Dla każdej z t par zapisów sprawdź, czy na obu ekranach został ten sam tekst.',
                'Napisz funkcję string ekran(string zapis), która zwraca tekst na ekranie — używając napisu jako stosu (push_back i pop_back) — i porównaj wyniki dla obu zapisów.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy dwa zapisy oddzielone spacją.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 100', 'Każdy zapis ma od 1 do 1000 znaków: małe litery i #.'],
            examples: [{ input: '3\nab#c ad#c\nab## c#d#\na#c b', note: 'Pierwsza para daje ac i ac. W drugiej oba ekrany są puste. W trzeciej zostaje c i b.' }],
            hint: R`string ekran(string zapis) { string t; for (char c : zapis) { if (c == '#') { if (!t.empty()) t.pop_back(); } else t.push_back(c); } return t; }. Potem cout << (ekran(a) == ekran(b) ? "TAK" : "NIE");.`,
            tests: (r) => {
                const zapis = (n, p) => Array.from({ length: n }, () => (r() < p ? '#' : r.pick('abc'.split('')))).join('');
                const para = () => { const a = zapis(r.int(1, 600), 0.3); if (r() < 0.5) return `${a} ${zapis(r.int(1, 1000), 0.3)}`; const ek = ((s) => { const t = []; for (const c of s) { if (c === '#') t.pop(); else t.push(c); } return t.join(''); })(a); let b = ''; for (const c of ek) { b += c; if (r() < 0.2) b += 'x#'; } return `${a} ${b || '#'}`; };
                const d = (ps) => `${ps.length}\n${ps.join('\n')}`;
                return [d(['a a']), d(['a# #', 'a b', '## #']), d(Array.from({ length: 100 }, para)), d(Array.from({ length: 30 }, () => `${zapis(8, 0.4)} ${zapis(8, 0.4)}`))];
            },
            check: (inp) => { const L = linie(inp); const t = Number(L[0]); return calk(t, 1, 100) && L.length === t + 1 && L.slice(1).every((l) => /^[a-z#]{1,1000} [a-z#]{1,1000}$/.test(l)) ? null : 'dane'; },
            solve: (inp) => { const ek = (s) => { const t = []; for (const c of s) { if (c === '#') t.pop(); else t.push(c); } return t.join(''); }; return linie(inp).slice(1).map((l) => { const [a, b] = l.split(' '); return ek(a) === ek(b) ? 'TAK' : 'NIE'; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string ekran(string zapis) {
    string t;
    for (char c : zapis) {
        if (c == '#') {
            if (!t.empty()) t.pop_back();
        } else {
            t.push_back(c);
        }
    }
    return t;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        string a, b;
        cin >> a >> b;
        cout << (ekran(a) == ekran(b) ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-znaczniki', krok: 9, level: 'latwe',
            title: 'Znaczniki jak w HTML',
            short: 'Znacznik <nazwa> otwiera, a </nazwa> zamyka. To nawiasy, tylko z nazwami — na stos idą nazwy otwartych znaczników.',
            tags: ['stack<string>', 'nawiasy z nazwami', 'rozpoznawanie słowa'],
            statement: ['Strony internetowe zapisuje się w HTML, gdzie tekst otaczają znaczniki: <b> otwiera pogrubienie, a </b> je zamyka. Znaczniki muszą być poprawnie zagnieżdżone, jak nawiasy: <b><i>tekst</i></b> jest dobrze, a <b><i>tekst</b></i> — źle.',
                'Dla każdego z t dokumentów sprawdź, czy znaczniki są poprawne. Dokument to ciąg słów oddzielonych spacjami: słowo <nazwa> to znacznik otwierający, </nazwa> — zamykający, a każde inne słowo to zwykły tekst, który pomijasz. Na stos kładź nazwy otwartych znaczników; zamykający musi pasować do nazwy na wierzchu, a na końcu stos musi być pusty.'],
            input_format: ['W pierwszym wierszu liczba t.', 'Każdy dokument zajmuje dwa wiersze: liczba słów k i k słów oddzielonych spacjami.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 50', '1 ≤ k ≤ 1000, a wszystkich słów jest najwyżej 20 000.', 'Nazwy znaczników to od 1 do 10 małych liter.'],
            examples: [{ input: '3\n5\n<b> <i> tekst </i> </b>\n5\n<b> <i> tekst </b> </i>\n3\n<p> akapit </p>', note: 'W drugim dokumencie </b> trafia na wierzch <i> — nazwy się nie zgadzają.' }],
            hint: R`Słowo zaczynające się od "</" to znacznik zamykający: nazwa = w.substr(2, w.size() - 3). Zaczynające się od '<' — otwierający: nazwa = w.substr(1, w.size() - 2). Dalej jak przy nawiasach trzech rodzajów.`,
            tests: (r) => {
                const NAZWY = ['b', 'i', 'p', 'div', 'span', 'a', 'ul', 'li', 'h', 'table'];
                const dok = (k, ok) => {
                    const o = [], st = [];
                    while (o.length < k - st.length) { const p = r(); if (p < 0.35) { const n = r.pick(NAZWY); st.push(n); o.push(`<${n}>`); } else if (p < 0.6 && st.length) o.push(`</${st.pop()}>`); else o.push(r.pick(SLOWA)); }
                    while (st.length) o.push(`</${st.pop()}>`);
                    if (!ok && o.length) { const i = r.int(0, o.length - 1); const co = r.int(0, 2); if (co === 0) o.splice(i, 1); else if (co === 1) o.splice(i, 0, `</${r.pick(NAZWY)}>`); else o.splice(i, 0, `<${r.pick(NAZWY)}>`); }
                    return o.length ? o : ['tekst'];
                };
                const d = (ds) => `${ds.length}\n${ds.map((x) => `${x.length}\n${x.join(' ')}`).join('\n')}`;
                return [d([['ala']]), d([['<b>'], ['</b>'], ['<b>', '</i>']]), d(Array.from({ length: 50 }, () => dok(r.int(1, 400), r() < 0.5))), d([dok(1000, true), dok(999, false)])];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]); if (!calk(t, 1, 50) || L.length !== 2 * t + 1) return 'dane';
                let suma = 0;
                for (let i = 0; i < t; i++) { const k = Number(L[1 + 2 * i]); const w = toks(L[2 + 2 * i]); if (!calk(k, 1, 1000) || w.length !== k) return 'k'; suma += k; if (!w.every((x) => /^(<\/?[a-z]{1,10}>|[a-z]{1,15})$/.test(x))) return 'slowo'; }
                return suma <= 20000 ? null : 'suma';
            },
            solve: (inp) => {
                const L = linie(inp); const t = Number(L[0]); const o = [];
                for (let i = 0; i < t; i++) {
                    const st = []; let ok = true;
                    for (const w of toks(L[2 + 2 * i])) { if (w.startsWith('</')) { if (!st.length || st[st.length - 1] !== w.slice(2, -1)) { ok = false; break; } st.pop(); } else if (w.startsWith('<')) st.push(w.slice(1, -1)); }
                    o.push(ok && !st.length ? 'TAK' : 'NIE');
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
        int k;
        cin >> k;
        stack<string> s;
        bool ok = true;
        for (int i = 0; i < k; i++) {
            string w;
            cin >> w;
            if (w.size() >= 3 && w[0] == '<' && w[1] == '/') {
                string nazwa = w.substr(2, w.size() - 3);
                if (s.empty() || s.top() != nazwa) ok = false;
                else s.pop();
            } else if (w[0] == '<') {
                s.push(w.substr(1, w.size() - 2));
            }
        }
        if (!s.empty()) ok = false;
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-matrioszki', krok: 9, level: 'latwe',
            title: 'Matrioszki',
            short: 'Liczba dodatnia otwiera lalkę, ujemna ją zamyka. Na stosie trzymaj otwarte lalki razem z sumą rozmiarów lalek, które już w nich leżą.',
            tags: ['stos par (rozmiar, suma)', 'nawiasy z liczbami', 'warunek przy zamykaniu'],
            statement: ['Zabawkę z matrioszek opisuje ciąg liczb: x oznacza otwarcie lalki o rozmiarze x, a −x — jej zamknięcie. Opis jest poprawny, gdy lalki są poprawnie zagnieżdżone (zamykana jest zawsze ostatnio otwarta, jeszcze niezamknięta lalka, i to tego samego rozmiaru) oraz gdy każda lalka jest większa niż suma rozmiarów lalek leżących bezpośrednio w niej.',
                'Dla każdego z t opisów wypisz TAK albo NIE. Trzymaj na stosie pary: rozmiar otwartej lalki i sumę rozmiarów lalek, które już w niej zamknęliśmy. Przy zamykaniu lalki sprawdź rozmiar i sumę, zdejmij parę i dodaj rozmiar tej lalki do sumy lalki pod nią.'],
            input_format: ['W pierwszym wierszu liczba t.', 'Każdy opis zajmuje dwa wiersze: liczba n i n liczb różnych od zera.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 50', '1 ≤ n ≤ 2000, a wszystkich liczb jest najwyżej 20 000.', 'Rozmiary są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '3\n6\n10 3 -3 4 -4 -10\n6\n5 3 -3 4 -4 -5\n4\n7 2 -7 -2', note: 'W pierwszej zabawce w lalce 10 leżą 3 i 4: 7 < 10. W drugiej 3 + 4 = 7 nie jest mniejsze od 5. W trzeciej lalki się przeplatają.' }],
            hint: R`stack<pair<int, long long>> s; // (rozmiar, suma w środku). Zamknięcie −x: if (s.empty() || s.top().first != x || s.top().second >= x) — źle; inaczej s.pop(); if (!s.empty()) s.top().second += x;. Na końcu stos musi być pusty.`,
            tests: (r) => {
                const lalka = (maxR, gl) => { const x = r.int(Math.max(2, maxR >> 1), maxR); const o = [x]; let s = 0; if (gl < 3) { const k = r.int(0, 3); for (let i = 0; i < k; i++) { const zap = x - 1 - s; if (zap < 1) break; const [sub, roz] = lalka(Math.min(zap, Math.floor(x / 2)), gl + 1); if (roz + s >= x) break; o.push(...sub); s += roz; } } o.push(-x); return [o, x]; };
                const zab = (ok) => { const o = []; const k = r.int(1, 4); for (let i = 0; i < k; i++) o.push(...lalka(r.int(2, 1000000), 0)[0]); if (!ok) { const i = r.int(0, o.length - 1); const co = r.int(0, 2); if (co === 0) o[i] = -o[i]; else if (co === 1 && o.length > 1) o.splice(i, 1); else { const j = r.int(0, o.length - 1); [o[i], o[j]] = [o[j], o[i]]; } } return o.slice(0, 2000); };
                const d = (zs) => `${zs.length}\n${zs.map((z) => `${z.length}\n${z.join(' ')}`).join('\n')}`;
                return [d([[1, -1]]), d([[-1], [2, 1, -1, -2], [2, 2, -2, -2]]), d(Array.from({ length: 50 }, () => zab(r() < 0.5))), d([[3, 1, -1, 1, -1, -3], [3, 2, -2, 1, -1, -3]])];
            },
            check: (inp) => { const t = nums(inp); const T = t[0]; if (!calk(T, 1, 50)) return 't'; let i = 1, suma = 0; for (let k = 0; k < T; k++) { const n = t[i++]; if (!calk(n, 1, 2000)) return 'n'; suma += n; for (let j = 0; j < n; j++) { const x = t[i++]; if (!x || !calk(Math.abs(x), 1, 1e6)) return 'x'; } } return i === t.length && suma <= 20000 ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); let i = 1; const o = [];
                for (let k = 0; k < t[0]; k++) {
                    const n = t[i++], a = t.slice(i, i + n); i += n;
                    const st = []; let ok = true;
                    for (const x of a) { if (x > 0) st.push([x, 0]); else { const y = -x; if (!st.length || st[st.length - 1][0] !== y || st[st.length - 1][1] >= y) { ok = false; break; } st.pop(); if (st.length) st[st.length - 1][1] += y; } }
                    o.push(ok && !st.length ? 'TAK' : 'NIE');
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
        stack<pair<int, long long>> s; // (rozmiar otwartej lalki, suma rozmiarów lalek w środku)
        bool ok = true;
        for (int i = 0; i < n; i++) {
            int x;
            cin >> x;
            if (!ok) continue;
            if (x > 0) {
                s.push({x, 0});
            } else {
                int y = -x;
                if (s.empty() || s.top().first != y || s.top().second >= y) {
                    ok = false;
                    continue;
                }
                s.pop();
                if (!s.empty()) s.top().second += y;
            }
        }
        if (!s.empty()) ok = false;
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-onp-na-ekranie', krok: 9, level: 'latwe',
            title: 'Stos ONP na ekranie',
            short: 'Policz wyrażenie w ONP i po każdym elemencie pokaż cały stos od dna. Stos w vectorze da się wypisać zwykłą pętlą.',
            tags: ['vector jako stos', 'ślad działania', 'ONP'],
            statement: ['Policz wartość wyrażenia w odwrotnej notacji polskiej z działaniami +, - i *, ale tak, żeby było widać, co się dzieje: po przetworzeniu każdego elementu wypisz cały stos — od dna do wierzchu, liczby oddzielone spacjami.',
                'stack nie pozwala zajrzeć do środka, więc trzymaj stos w vector<long long>: push_back kładzie na wierzch, back() to wierzch, a pop_back() zdejmuje. Do wypisania wystarczy zwykła pętla po vectorze.'],
            input_format: ['W pierwszym wierszu liczba n — ile jest elementów.', 'W drugim wierszu n elementów: liczby i znaki + - *.'],
            output_format: ['n wierszy — zawartość stosu po każdym elemencie, od dna do wierzchu.'],
            constraints: ['1 ≤ n ≤ 59', 'Liczby są całkowite, od 0 do 999. Wyrażenie jest poprawne, a każdy wynik po drodze ma wartość bezwzględną najwyżej 10⁹.'],
            examples: [{ input: '7\n2 3 4 * + 5 -', note: 'Po 2, 3, 4 stos to 2 3 4. Gwiazdka zamienia 3 4 na 12, plus — 2 12 na 14, a minus — 14 5 na 9.' }],
            hint: R`vector<long long> s; dla znaku: long long b = s.back(); s.pop_back(); long long a = s.back(); s.pop_back(); s.push_back(…);. Po każdym elemencie: for (long long x : s) cout << x << " "; cout << "\n";.`,
            tests: (r) => { const gen = (k) => drzewoOnp(dobreDrzewo(r, k, 0, 999, ['+', '-', '*'], 10n ** 9n)); return [d1(['5']), d1(['1', '2', '+']), d1(['2', '3', '4', '*', '+', '5', '-']), d1(gen(10)), d1(gen(29)), d1(gen(29)), d1([...Array.from({ length: 30 }, (_, i) => String(i)), ...Array.from({ length: 29 }, () => '+')])]; },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 59) || t.length !== n + 1) return 'n'; const tok = t.slice(1); if (!tok.every((x) => ['+', '-', '*'].includes(x) || (/^\d+$/.test(x) && Number(x) <= 999))) return 'token'; return liczOnp(tok, 10n ** 9n).ok ? null : 'niepoprawne'; },
            solve: (inp) => { const st = [], o = []; for (const x of toks(inp).slice(1)) { if (['+', '-', '*'].includes(x)) { const b = st.pop(), a = st.pop(); st.push(dzialanie(a, b, x)); } else st.push(BigInt(x)); o.push(st.join(' ')); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> s; // stos w vectorze: back() to wierzch
    for (int i = 0; i < n; i++) {
        string t;
        cin >> t;
        if (t == "+" || t == "-" || t == "*") {
            long long b = s.back();
            s.pop_back();
            long long a = s.back();
            s.pop_back();
            if (t == "+") s.push_back(a + b);
            else if (t == "-") s.push_back(a - b);
            else s.push_back(a * b);
        } else {
            s.push_back(stoll(t));
        }
        for (long long x : s) cout << x << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ BAZA · średnie
        {
            id: 'sto-b-wynik-nawiasow', krok: 9, level: 'srednie',
            title: 'Wynik ciągu nawiasów',
            short: '() jest warte 1, sklejone ciągi się dodają, a nawias wokół ciągu podwaja jego wynik. Stos trzyma sumy dla każdego otwartego poziomu.',
            tags: ['stos sum', 'poziom = otwarty nawias', 'long long'],
            statement: ['Poprawny ciąg nawiasów okrągłych ma swój wynik: para () jest warta 1, dwa ciągi sklejone obok siebie (AB) są warte tyle, ile suma ich wyników, a ciąg w nawiasie (A) jest wart dwa razy tyle co A. Na przykład (()) jest warte 2, ()() — 2, a (()(())) — 2 · (1 + 2) = 6.',
                'Policz wyniki t ciągów. Na stosie trzymaj sumy: na dnie suma całego ciągu (na początku 0), a każdy otwarty nawias kładzie nowy poziom z sumą 0. Nawias zamykający zdejmuje sumę w swojego poziomu i dodaje do poziomu niżej 1, jeśli w = 0 (to była pusta para), albo 2 · w.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jeden poprawny ciąg nawiasów ( i ).'],
            output_format: ['t wierszy — wyniki ciągów.'],
            constraints: ['1 ≤ t ≤ 10', 'Każdy ciąg ma od 2 do 10 000 znaków, wszystkie razem — najwyżej 50 000.', 'Zagnieżdżenie nawiasów nie przekracza 40, więc wyniki mieszczą się w long long.'],
            examples: [{ input: '4\n()\n(())\n()()\n(()(()))', note: 'W ostatnim: w środku jest () za 1 i (()) za 2, razem 3, a zewnętrzny nawias podwaja: 6.' }],
            hint: R`stack<long long> s; s.push(0); for (char c : t) { if (c == '(') s.push(0); else { long long w = s.top(); s.pop(); s.top() += (w == 0 ? 1 : 2 * w); } }. Wynik: s.top() — na dnie została suma całego ciągu.`,
            tests: (r) => {
                const gen = (n, maxG, p) => { let s = '', g = 0, otw = 0; while (s.length < 2 * n) { if (otw < n && g < maxG && (g === 0 || r() < p)) { s += '('; g++; otw++; } else { s += ')'; g--; } } return s; };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['()']), d(['(())', '()()', '((()))', '(()())']), d(Array.from({ length: 10 }, () => gen(r.int(1, 30), 10, 0.6))), d([gen(5000, 40, 0.5), gen(5000, 40, 0.9), gen(5000, 40, 0.3), '('.repeat(40) + ')'.repeat(40)]), d(Array.from({ length: 10 }, () => gen(2500, 40, 0.8)))];
            },
            check: (inp) => { const L = linie(inp); const t = Number(L[0]); if (!calk(t, 1, 10) || L.length !== t + 1 || L.slice(1).join('').length > 50000) return 'dane'; for (const s of L.slice(1)) { if (!/^[()]{2,10000}$/.test(s) || !czyPoprawne(s)) return 'ciag'; let g = 0, m = 0; for (const c of s) { g += c === '(' ? 1 : -1; m = Math.max(m, g); } if (m > 40) return 'glebokosc'; } return null; },
            solve: (inp) => linie(inp).slice(1).map((s) => { const st = [0n]; for (const c of s) { if (c === '(') st.push(0n); else { const w = st.pop(); st[st.length - 1] += w === 0n ? 1n : 2n * w; } } return String(st[0]); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        string c;
        cin >> c;
        stack<long long> s;
        s.push(0); // suma całego ciągu
        for (char z : c) {
            if (z == '(') {
                s.push(0);
            } else {
                long long w = s.top();
                s.pop();
                s.top() += (w == 0 ? 1 : 2 * w);
            }
        }
        cout << s.top() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-odwroc-w-nawiasach', krok: 9, level: 'srednie',
            title: 'Odwracanie w nawiasach',
            short: 'Każdy nawias odwraca to, co jest w środku — od najgłębszego. Stos napisów: przy ( odkładasz tekst, przy ) odwracasz bieżący i doklejasz do odłożonego.',
            tags: ['stack<string>', 'reverse', 'od najgłębszego nawiasu'],
            statement: ['Napis składa się z małych liter i poprawnie sparowanych nawiasów okrągłych. Każda para nawiasów odwraca kolejność wszystkiego, co jest między nimi — zaczynając od najgłębszych nawiasów. Na przykład a(bc(de)f)g: najpierw (de) daje ed, potem (bcedf) daje fdecb, więc wynik to afdecbg. Wypisz wynik bez nawiasów.',
                'Trzymaj bieżący tekst w zmiennej i stos stack<string> tekstów sprzed otwartych nawiasów. Nawias ( odkłada bieżący tekst na stos i zaczyna nowy. Nawias ) odwraca bieżący tekst i dokleja go na koniec tekstu zdjętego ze stosu.'],
            input_format: ['Jeden wiersz: napis z małych liter i nawiasów ( ).'],
            output_format: ['Jeden wiersz: wynik bez nawiasów.'],
            constraints: ['Napis ma od 1 do 2000 znaków, nawiasy są poprawnie sparowane i jest w nim co najmniej jedna litera.'],
            examples: [{ input: 'a(bc(de)f)g', note: 'Najpierw de → ed, potem bcedf → fdecb.' }, { input: '(ab)(cd)', note: 'Każdy nawias odwraca osobno: ba i dc.' }],
            hint: R`stack<string> st; string teraz; for (char c : s) { if (c == '(') { st.push(teraz); teraz = ""; } else if (c == ')') { reverse(teraz.begin(), teraz.end()); teraz = st.top() + teraz; st.pop(); } else teraz += c; }.`,
            tests: (r) => {
                const gen = (n, p) => { const sz = losPoprawne(r, n, '()', p); let o = ''; for (const c of sz) { o += c; const k = r.int(0, 2); o += r.word(k, 'abcdefgh'); } return o.length > 2000 ? o.slice(0, 0) : o; };
                const dobry = (n, p) => { for (let i = 0; i < 50; i++) { const s = gen(n, p); if (s && s.length <= 2000 && /[a-z]/.test(s)) return s; } return 'a(b)'; };
                return ['a', '(a)', 'a(bc(de)f)g', '(ab)(cd)', '((ab))', 'x(y(z(w)))', dobry(10, 0.5), dobry(600, 0.5), dobry(600, 0.85), '(' .repeat(900) + 'abc' + ')'.repeat(900), dobry(300, 0.3)];
            },
            check: (inp) => (/^[a-z()]{1,2000}$/.test(inp) && czyPoprawne(inp) && /[a-z]/.test(inp) ? null : 'dane'),
            solve: (inp) => { const st = []; let t = ''; for (const c of inp) { if (c === '(') { st.push(t); t = ''; } else if (c === ')') t = st.pop() + t.split('').reverse().join(''); else t += c; } return t; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    stack<string> st;
    string teraz;
    for (char c : s) {
        if (c == '(') {
            st.push(teraz);
            teraz = "";
        } else if (c == ')') {
            reverse(teraz.begin(), teraz.end());
            teraz = st.top() + teraz;
            st.pop();
        } else {
            teraz += c;
        }
    }
    cout << teraz << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-najmniej-odwrocen', krok: 9, level: 'srednie',
            title: 'Najmniej odwróceń',
            short: 'Najpierw stos usuwa wszystkie pary, które już pasują. Zostaje }}}…{{{ — a to naprawiasz, odwracając co drugi nawias z każdej grupy.',
            tags: ['redukcja stosem', 'co zostaje: }…{', 'wzór z sufitem'],
            statement: ['Napis składa się z nawiasów klamrowych { i }. Jednym ruchem możesz odwrócić jeden nawias: { na } albo } na {. Dla każdego z t napisów policz, ile najmniej odwróceń trzeba, żeby nawiasy były poprawnie sparowane. Jeśli to niemożliwe, wypisz -1.',
                'Najpierw usuń stosem wszystkie pary, które już są poprawne (jak przy sprawdzaniu nawiasów). Zostanie ciąg postaci }}}…{{{: a zamykających, a po nich b otwierających. Przy nieparzystej długości napisu nie da się nic zrobić. W przeciwnym razie z każdej grupy odwracasz co drugi nawias: }} naprawia jedno odwrócenie ({}), a pojedynczy } z pojedynczym { — dwa (}{ → {}). Wynik to ⌈a/2⌉ + ⌈b/2⌉.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jeden napis z nawiasów { i }.'],
            output_format: ['t wierszy — najmniejsza liczba odwróceń albo -1.'],
            constraints: ['1 ≤ t ≤ 100', 'Każdy napis ma od 1 do 10 000 znaków, wszystkie razem — najwyżej 50 000.'],
            examples: [{ input: '4\n}{\n{{{{\n{}}}{{\n{{{', note: '}{ wymaga odwrócenia obu. {{{{ — odwracamy dwa ostatnie. W {}}}{{ zostaje }}{{ po usunięciu pary: 1 + 1 = 2. Trzy nawiasy nie dadzą się sparować.' }],
            hint: R`int zam = 0; stack<char> st; for (char c : s) { if (c == '{') st.push(c); else if (!st.empty()) st.pop(); else zam++; } int otw = st.size();. Jeśli s.size() jest nieparzysty: -1, inaczej (zam + 1) / 2 + (otw + 1) / 2.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const duzo = [];
                for (let i = 0; i < 100; i++) { const n = r.int(1, 250); duzo.push(r() < 0.3 ? losPoprawne(r, n, '{}') : r() < 0.5 ? popsuj(r, losPoprawne(r, n, '{}'), '{}') : losNawiasy(r, r.int(1, 500), '{}')); }
                return [d(['{']), d(['{}', '}{', '}}', '{{']), d(['{{{{', '{}}}{{', '{{{', '}}}{{{', '}{}{']), d(duzo), d([losNawiasy(r, 10000, '{}'), '}'.repeat(4999) + '{'.repeat(5001), losNawiasy(r, 9999, '{}')])];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 100) && t.length === n + 1 && t.slice(1).every((s) => /^[{}]{1,10000}$/.test(s)) && t.slice(1).join('').length <= 50000 ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => { if (s.length % 2) return '-1'; let st = 0, z = 0; for (const c of s) { if (c === '{') st++; else if (st) st--; else z++; } return String(Math.ceil(z / 2) + Math.ceil(st / 2)); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        if (s.size() % 2 == 1) {
            cout << -1 << "\n";
            continue;
        }
        stack<char> st;
        int zam = 0; // zamykające bez pary
        for (char c : s) {
            if (c == '{') st.push(c);
            else if (!st.empty()) st.pop();
            else zam++;
        }
        int otw = st.size(); // otwierające bez pary
        cout << (zam + 1) / 2 + (otw + 1) / 2 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-drzewo-z-nawiasow', krok: 9, level: 'srednie',
            title: 'Drzewo zapisane nawiasami',
            short: 'Każdy wierzchołek to para nawiasów, a jego dzieci stoją w środku. Stos otwartych wierzchołków zna głębokość, a przy zamknięciu oddajesz rozmiar rodzicowi.',
            tags: ['stos wierzchołków', 'głębokość = rozmiar stosu', 'rozmiar poddrzewa przy zamknięciu'],
            statement: ['Drzewo zapisano nawiasami: każdy wierzchołek to para ( ), a między jego nawiasami stoją po kolei jego dzieci. Na przykład (()(()())) to korzeń z dwójką dzieci, z których drugie ma dwoje własnych dzieci. Wierzchołki numerujemy od 1 w kolejności ich nawiasów otwierających.',
                'Dla każdego wierzchołka wypisz jego głębokość (korzeń ma 0) i liczbę jego potomków (dzieci, wnuków i tak dalej). Trzymaj na stosie numery otwartych wierzchołków: przy ( nowy wierzchołek ma głębokość równą liczbie wierzchołków na stosie. Przy ) zdejmij wierzchołek ze stosu — znasz już wszystkich jego potomków, więc dodaj ich liczbę plus 1 do licznika jego rodzica, który teraz leży na wierzchu.'],
            input_format: ['Jeden wiersz: zapis drzewa nawiasami.'],
            output_format: ['Dwa wiersze: głębokości wierzchołków od 1 do n oraz liczby ich potomków.'],
            constraints: ['Drzewo ma od 1 do 2500 wierzchołków, a zapis jest poprawny (cały napis to nawiasy korzenia).'],
            examples: [{ input: '(()(()()))', note: 'Korzeń (1) ma dzieci 2 i 3, a 3 ma dzieci 4 i 5. Głębokości: 0 1 1 2 2. Potomkowie: korzeń 4, wierzchołek 3 — 2.' }],
            hint: R`int nr = 0; stack<int> st; for (char c : s) { if (c == '(') { nr++; gl[nr] = st.size(); st.push(nr); } else { int v = st.top(); st.pop(); if (!st.empty()) pot[st.top()] += pot[v] + 1; } }.`,
            tests: (r) => ['()', '(())', '(()())', '(()(()()))', `(${losPoprawne(r, 9, '()')})`, `(${losPoprawne(r, 2499, '()', 0.5)})`, `(${losPoprawne(r, 2499, '()', 0.85)})`, `(${'()'.repeat(2499)})`, `${'('.repeat(2500)}${')'.repeat(2500)}`, `(${losPoprawne(r, 400, '()', 0.3)})`],
            check: (inp) => { if (!/^[()]{2,5000}$/.test(inp) || !czyPoprawne(inp)) return 'dane'; let g = 0; for (let i = 0; i < inp.length; i++) { g += inp[i] === '(' ? 1 : -1; if (g === 0 && i < inp.length - 1) return 'las'; } return null; },
            solve: (inp) => { const gl = [], pot = [], st = []; for (const c of inp) { if (c === '(') { gl.push(st.length); pot.push(0); st.push(gl.length - 1); } else { const v = st.pop(); if (st.length) pot[st[st.length - 1]] += pot[v] + 1; } } return `${gl.join(' ')}\n${pot.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.size() / 2;
    vector<int> gl(n + 1), pot(n + 1, 0);
    stack<int> st; // otwarte wierzchołki
    int nr = 0;
    for (char c : s) {
        if (c == '(') {
            nr++;
            gl[nr] = st.size();
            st.push(nr);
        } else {
            int v = st.top();
            st.pop();
            if (!st.empty()) pot[st.top()] += pot[v] + 1;
        }
    }
    for (int v = 1; v <= n; v++) cout << gl[v] << " ";
    cout << "\n";
    for (int v = 1; v <= n; v++) cout << pot[v] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-najdluzszy-poprawny-3', krok: 9, level: 'srednie',
            title: 'Najdłuższy fragment z trzema rodzajami nawiasów',
            short: 'Jak „Najdłuższy poprawny fragment”, ale zamykający musi pasować rodzajem. Gdy nie pasuje, jego pozycja zostaje na stosie jako bariera.',
            tags: ['stos pozycji', 'bariery', 'trzy rodzaje'],
            statement: ['Dany jest napis z nawiasów ( ), [ ] i { }. Znajdź długość najdłuższego fragmentu, który sam jest poprawnym ciągiem nawiasów, i policz, ile jest takich fragmentów. Jeśli żaden fragment nie jest poprawny, wypisz 0 0.',
                'Trzymaj na stosie pozycje znaków, które jeszcze nie mają pary, a na samym dnie — strażnika -1. Nawias otwierający kładzie swoją pozycję. Zamykający: jeśli na wierzchu leży pozycja pasującego nawiasu otwierającego, zdejmij ją — poprawny fragment kończący się w i zaczyna się tuż za nowym wierzchem i ma długość i − top(). W przeciwnym razie (pusty stos, strażnik, inny nawias zamykający albo otwierający innego rodzaju) zamykający nie ma pary i staje się barierą — połóż jego pozycję na stos.'],
            input_format: ['Jeden wiersz: napis z nawiasów ()[]{}.'],
            output_format: ['Jeden wiersz: długość najdłuższego poprawnego fragmentu i liczba takich fragmentów (albo 0 0).'],
            constraints: ['Napis ma od 1 do 100 000 znaków.'],
            examples: [{ input: '([)]{}[()]', note: 'Na początku ([)] nic nie pasuje. Fragment {}[()] na pozycjach 5–10 ma długość 6.' }, { input: '()(]()', note: 'Dwa fragmenty długości 2: () na początku i () na końcu. Środkowe (] niczego nie łączy.' }],
            hint: R`stack<int> st; st.push(-1); for (int i = 0; i < n; i++) { char c = s[i]; if (otwierający) st.push(i); else { int t = st.top(); if (t >= 0 && s[t] == para(c)) { st.pop(); int d = i - st.top(); … } else st.push(i); } }. Pod zdjętym otwierającym zawsze coś leży — przynajmniej strażnik -1.`,
            tests: (r) => {
                const RD = '()[]{}';
                const kawalki = (n) => { let s = ''; while (s.length < n) s += r() < 0.3 ? r.pick([')', ']', '}', '(', '[', '{', '(]', '[}']) : losPoprawne(r, r.int(1, 30), RD); return s.slice(0, n); };
                return ['(', ')', '()', '(]', '([)]{}[()]', '()(]()', '{[()]}', '[(])', kawalki(100000), losNawiasy(r, 100000, RD), losPoprawne(r, 50000, RD), kawalki(300), '(' + '[]'.repeat(49999) + ')', '{'.repeat(50000) + '}'.repeat(50000)];
            },
            check: (inp) => (/^[()[\]{}]{1,100000}$/.test(inp) ? null : 'dane'),
            solve: (inp) => {
                const st = [-1]; let naj = 0, ile = 0;
                for (let i = 0; i < inp.length; i++) {
                    const c = inp[i];
                    if (czyOtw(c)) { st.push(i); continue; }
                    const t = st[st.length - 1];
                    if (t >= 0 && inp[t] === paraDo(c)) { st.pop(); const d = i - st[st.length - 1]; if (d > naj) { naj = d; ile = 1; } else if (d === naj) ile++; }
                    else st.push(i);
                }
                return `${naj} ${ile}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
char para(char c) {
    if (c == ')') return '(';
    if (c == ']') return '[';
    return '{';
}
int main() {
    string s;
    cin >> s;
    int n = s.size();
    stack<int> st;
    st.push(-1);
    int naj = 0, ile = 0;
    for (int i = 0; i < n; i++) {
        char c = s[i];
        if (c == '(' || c == '[' || c == '{') {
            st.push(i);
            continue;
        }
        int t = st.top();
        if (t >= 0 && s[t] == para(c)) {
            st.pop();
            int d = i - st.top();
            if (d > naj) {
                naj = d;
                ile = 1;
            } else if (d == naj) {
                ile++;
            }
        } else {
            st.push(i); // bariera
        }
    }
    cout << naj << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-sortowanie-stosem', krok: 9, level: 'srednie',
            title: 'Sortowanie jednym stosem',
            short: 'Liczby wjeżdżają na stos w podanej kolejności, a zjeżdżać mają rosnąco. Zdejmuj, gdy na wierzchu stoi następna potrzebna liczba — inaczej się nie da.',
            tags: ['symulacja', 'jedyna możliwa kolejność ruchów', 'napis z ruchów'],
            statement: ['Liczby od 1 do n (pomieszane) przyjeżdżają po kolei. Masz jeden stos i dwa ruchy: W — następna liczba z wejścia wjeżdża na stos, Z — liczba z wierzchu stosu zjeżdża na wyjście. Chcesz, żeby na wyjściu liczby pojawiły się w kolejności 1, 2, …, n. Dla każdego z t ciągów wypisz TAK i napis z ruchów, jeśli to możliwe, albo NIE.',
                'Wskazówka: zdejmuj liczbę z wierzchu zawsze wtedy, gdy jest to dokładnie następna liczba potrzebna na wyjściu (tak długo, jak się da), a w przeciwnym razie wpuszczaj kolejną liczbę na stos. Innego wyjścia nie ma: zdjęcie innej liczby psuje kolejność, a przykrycie potrzebnej liczby większą zablokowałoby ją na zawsze. Jeśli po wpuszczeniu wszystkiego stos nie jest pusty — odpowiedź to NIE.'],
            input_format: ['W pierwszym wierszu liczba t.', 'Każdy ciąg to wiersz z liczbą n i wiersz z n różnymi liczbami od 1 do n.'],
            output_format: ['Dla każdego ciągu: wiersz TAK i wiersz z 2n literami W i Z — albo jeden wiersz NIE.'],
            constraints: ['1 ≤ t ≤ 30', '1 ≤ n ≤ 1000, a suma wszystkich n nie przekracza 10 000.'],
            examples: [{ input: '2\n4\n3 1 2 4\n3\n2 3 1', note: 'W pierwszym: 3 wjeżdża, 1 wjeżdża i od razu zjeżdża, potem 2 i 3 zjeżdżają, a na końcu 4. W drugim 2 trafia pod 3, zanim przyjedzie 1 — po 1 musi zjechać 2, ale leży pod trójką.' }],
            hint: R`int potrzebna = 1; string ruchy; for (int x : a) { s.push(x); ruchy += 'W'; while (!s.empty() && s.top() == potrzebna) { s.pop(); ruchy += 'Z'; potrzebna++; } }. Jeśli na końcu s.empty() — TAK i ruchy, inaczej NIE.`,
            tests: (r) => {
                const sortowalna = (lo, hi) => { if (lo > hi) return []; const k = r.int(0, hi - lo); return [...sortowalna(lo, lo + k - 1), hi, ...sortowalna(lo + k, hi - 1)]; };
                const los = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
                const prawie = (n) => { const a = sortowalna(1, n); const i = r.int(0, n - 2); [a[i], a[i + 1]] = [a[i + 1], a[i]]; return a; };
                const d = (ps) => `${ps.length}\n${ps.map((p) => `${p.length}\n${p.join(' ')}`).join('\n')}`;
                return [d([[1]]), d([[1, 2], [2, 1]]), d([[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]]), d(Array.from({ length: 20 }, () => (r() < 0.6 ? sortowalna(1, r.int(2, 9)) : los(r.int(2, 9))))), d(Array.from({ length: 9 }, (_, i) => (i % 3 === 0 ? sortowalna(1, 1000) : i % 3 === 1 ? prawie(1000) : los(1000)))), d([Array.from({ length: 1000 }, (_, i) => 1000 - i)])];
            },
            check: (inp) => {
                const t = nums(inp); const T = t[0]; if (!calk(T, 1, 30)) return 't';
                let i = 1, suma = 0;
                for (let k = 0; k < T; k++) { const n = t[i++]; if (!calk(n, 1, 1000)) return 'n'; suma += n; const p = t.slice(i, i + n); i += n; if (p.length !== n || new Set(p).size !== n || !p.every((x) => calk(x, 1, n))) return 'permutacja'; }
                return i === t.length && suma <= 10000 ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp); let i = 1; const o = [];
                for (let k = 0; k < t[0]; k++) {
                    const n = t[i++], p = t.slice(i, i + n); i += n;
                    const st = []; let pot = 1, ruchy = '';
                    for (const x of p) { st.push(x); ruchy += 'W'; while (st.length && st[st.length - 1] === pot) { st.pop(); ruchy += 'Z'; pot++; } }
                    o.push(st.length ? 'NIE' : `TAK\n${ruchy}`);
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
        vector<int> a(n);
        for (int i = 0; i < n; i++) cin >> a[i];
        stack<int> s;
        int potrzebna = 1;
        string ruchy;
        for (int x : a) {
            s.push(x);
            ruchy += 'W';
            while (!s.empty() && s.top() == potrzebna) {
                s.pop();
                ruchy += 'Z';
                potrzebna++;
            }
        }
        if (s.empty()) cout << "TAK\n" << ruchy << "\n";
        else cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-histogram-z-szerokosciami', krok: 9, level: 'srednie',
            title: 'Histogram z szerokościami',
            short: 'Słupki mają różne szerokości, więc szerokość prostokąta to suma szerokości słupków między granicami. Sumy prefiksowe zamieniają ją w jedno odejmowanie.',
            tags: ['największy prostokąt', 'sumy prefiksowe szerokości', 'long long'],
            statement: ['Histogram składa się z n słupków stojących obok siebie, ale tym razem każdy słupek ma swoją szerokość w i wysokość h. Znajdź pole największego prostokąta, który mieści się w histogramie.',
                'Algorytm jest ten sam co w „Największym prostokącie w histogramie”, zmienia się tylko liczenie szerokości. Policz sumy prefiksowe szerokości: x[i] to łączna szerokość słupków przed słupkiem i. Prostokąt, który rozciąga się od słupka L + 1 do słupka R − 1, ma szerokość x[R] − x[L + 1].'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z n kolejnych wierszy szerokość i wysokość słupka (od lewej).'],
            output_format: ['Jedna liczba — pole największego prostokąta.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ w ≤ 10⁴', '0 ≤ h ≤ 10⁹'],
            examples: [{ input: '4\n2 3\n1 5\n3 2\n1 4', note: 'Prostokąt o wysokości 2 przez całą szerokość 7 ma pole 14. Słupek 5 sam daje tylko 5, a wysokość 3 przez dwa pierwsze słupki — 9.' }],
            hint: R`vector<long long> x(n + 1, 0); for (i) x[i + 1] = x[i] + w[i];. Przy zdejmowaniu słupka j ze stosu (przy bieżącym i): int lewy = s.empty() ? -1 : s.top(); pole = h[j] * (x[i] - x[lewy + 1]);. Strażnik na końcu: słupek o wysokości 0.`,
            tests: (r) => { const d = (p) => `${p.length}\n${p.map(([w, hh]) => `${w} ${hh}`).join('\n')}`; const los = (n, wh, hh) => Array.from({ length: n }, () => [r.int(1, wh), r.int(0, hh)]); return [d([[1, 0]]), d([[3, 4]]), d([[2, 3], [1, 5], [3, 2], [1, 4]]), d(los(10, 5, 10)), d(los(5000, 10000, 1000000000)), d(los(5000, 1, 1000000000)), d(Array.from({ length: 5000 }, (_, i) => [10000, i + 1])), d(los(5000, 100, 5))]; },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 5000) && t.length === 2 * t[0] + 1 && t.slice(1).every((x, i) => (i % 2 ? calk(x, 0, 1e9) : calk(x, 1, 1e4))) ? null : 'dane'; },
            solve: (inp) => {
                const t = nums(inp); const n = t[0]; const w = [], hh = [];
                for (let i = 0; i < n; i++) { w.push(t[1 + 2 * i]); hh.push(t[2 + 2 * i]); }
                const x = [0]; for (let i = 0; i < n; i++) x.push(x[i] + w[i]);
                const L = najblizszy(hh, -1, (a, b) => a < b), Rr = najblizszy(hh, +1, (a, b) => a < b);
                let naj = 0n;
                for (let i = 0; i < n; i++) { const p = BigInt(hh[i]) * BigInt(x[Rr[i] < 0 ? n : Rr[i]] - x[L[i] + 1]); if (p > naj) naj = p; }
                return String(naj);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> w(n), h(n + 1, 0), x(n + 1, 0);
    for (int i = 0; i < n; i++) cin >> w[i] >> h[i];
    for (int i = 0; i < n; i++) x[i + 1] = x[i] + w[i];
    stack<int> s;
    long long naj = 0;
    for (int i = 0; i <= n; i++) { // h[n] = 0 — strażnik
        while (!s.empty() && h[s.top()] >= h[i]) {
            int j = s.top();
            s.pop();
            int lewy = s.empty() ? -1 : s.top();
            naj = max(naj, h[j] * (x[i] - x[lewy + 1]));
        }
        s.push(i);
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-kalkulator-ze-zmiennymi', krok: 9, level: 'srednie',
            title: 'Kalkulator ze zmiennymi',
            short: 'Program to przypisania x=(a+3)*b. Kalkulator na dwóch stosach plus mapa wartości zmiennych — nazwa w wyrażeniu to po prostu liczba z mapy.',
            tags: ['dwa stosy', 'map<string, long long>', 'nazwy wieloliterowe'],
            statement: ['Wykonaj program złożony z q przypisań. Każde ma postać nazwa=wyrażenie (bez spacji). Wyrażenie zawiera liczby, nazwy zmiennych, którym wcześniej coś przypisano, działania +, -, * i / oraz nawiasy. Mnożenie i dzielenie mają pierwszeństwo, działania o równym priorytecie wykonuje się od lewej, a dzielenie jest całkowite jak w C++. Zmienną można przypisać ponownie — wtedy obowiązuje nowa wartość.',
                'Po każdym przypisaniu wypisz nazwa = wartość. Wartości zmiennych trzymaj w map<string, long long>, a wyrażenie licz dwoma stosami jak w „Kalkulatorze z nawiasami” — nazwę (ciąg małych liter) czytasz tak jak liczbę, a na stos liczb kładziesz jej wartość z mapy.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno przypisanie.'],
            output_format: ['q wierszy w formacie nazwa = wartość.'],
            constraints: ['1 ≤ q ≤ 100', 'Każde przypisanie ma najwyżej 200 znaków. Nazwy to od 1 do 5 małych liter, liczby są od 0 do 10⁴.', 'Nigdzie nie dzieli się przez zero, a każdy wynik po drodze ma wartość bezwzględną najwyżej 10¹⁸.'],
            examples: [{ input: '4\na=7\nb=a*3-1\nc=(a+b)/2\na=c-a*a', note: 'a = 7, b = 20, c = 27 / 2 = 13, a potem a dostaje nową wartość: 13 − 49 = −36.' }],
            hint: R`Przy zbieraniu tokenów: if (isdigit(c)) — liczba; else if (islower(c)) { string nazwa; while (i < n && islower(s[i])) nazwa += s[i++]; liczby.push(wart[nazwa]); }. Linię dziel na nazwę i wyrażenie: size_t p = linia.find('='); nazwa = linia.substr(0, p); wyr = linia.substr(p + 1);.`,
            tests: (r) => {
                const NAZWY = ['a', 'b', 'c', 'x', 'y', 'suma', 'ile', 'wynik', 'tmp', 'k', 'n', 'pole'];
                const pr = (o) => (o === '*' || o === '/' ? 2 : 1);
                const gen = (q, k) => {
                    const env = new Map(), o = [];
                    for (let i = 0; i < q; i++) {
                        const lisc = () => { if (env.size && r() < 0.5) { const nz = r.pick([...env.keys()]); return { v: nz, w: env.get(nz) }; } const v = r.int(0, 10000); return { v: String(v), w: BigInt(v) }; };
                        const bud = (kk) => {
                            if (kk === 0) return lisc();
                            const kl = r.int(0, kk - 1); const l = bud(kl), p = bud(kk - 1 - kl);
                            for (const op of r.shuffle(['+', '-', '*', '/'])) { if (op === '/' && p.w === 0n) continue; const w = dzialanie(l.w, p.w, op); if ((w < 0n ? -w : w) <= LIMIT) return { op, l, p, w }; }
                            const op = (l.w >= 0n) === (p.w >= 0n) ? '-' : '+'; return { op, l, p, w: dzialanie(l.w, p.w, op) };
                        };
                        const napis = (x) => { if (!x.op) return x.v; let l = napis(x.l), p = napis(x.p); if (x.l.op && pr(x.l.op) < pr(x.op)) l = `(${l})`; if (x.p.op && pr(x.p.op) <= pr(x.op)) p = `(${p})`; return l + x.op + p; };
                        let d = bud(r.int(0, k)), s = napis(d);
                        while (s.length > 190) { d = bud(r.int(0, 3)); s = napis(d); }
                        const nz = r.pick(NAZWY); env.set(nz, d.w); o.push(`${nz}=${s}`);
                    }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nx=5', '3\na=1\na=a+a\na=a*a', '4\na=7\nb=a*3-1\nc=(a+b)/2\na=c-a*a', gen(10, 4), gen(100, 12), gen(100, 25), gen(50, 6)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 100) || L.length !== q + 1) return 'q';
                const env = new Map();
                for (const l of L.slice(1)) {
                    const m = l.match(/^([a-z]{1,5})=([a-z0-9+\-*/()]+)$/); if (!m || l.length > 200) return 'linia';
                    const tok = tokenyInfix(m[2]);
                    if (tok.some((t) => /^[a-z]/.test(t) && (!env.has(t) || t.length > 5))) return 'nieznana zmienna';
                    if (tok.some((t) => /^\d/.test(t) && Number(t) > 1e4)) return 'liczba';
                    const w = liczOnp(P.naOnpTok(tok.map((t) => (/^[a-z]/.test(t) ? env.get(t) : t))));
                    if (!w.ok) return 'wartosc ' + w.blad;
                    env.set(m[1], w.v);
                }
                return null;
            },
            solve: (inp) => {
                const env = new Map(), o = [];
                for (const l of linie(inp).slice(1)) {
                    const p = l.indexOf('='), nz = l.slice(0, p);
                    const tok = tokenyInfix(l.slice(p + 1)).map((t) => (/^[a-z]/.test(t) ? env.get(t) : t));
                    const w = liczOnp(P.naOnpTok(tok)).v;
                    env.set(nz, w); o.push(`${nz} = ${w}`);
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int prio(char c) {
    if (c == '*' || c == '/') return 2;
    return 1;
}
void zwin(stack<long long> &liczby, stack<char> &znaki) {
    long long b = liczby.top();
    liczby.pop();
    long long a = liczby.top();
    liczby.pop();
    char op = znaki.top();
    znaki.pop();
    if (op == '+') liczby.push(a + b);
    else if (op == '-') liczby.push(a - b);
    else if (op == '*') liczby.push(a * b);
    else liczby.push(a / b);
}
int main() {
    int q;
    cin >> q;
    map<string, long long> wart;
    while (q--) {
        string linia;
        cin >> linia;
        size_t p = linia.find('=');
        string nazwa = linia.substr(0, p), s = linia.substr(p + 1);
        int n = s.size(), i = 0;
        stack<long long> liczby;
        stack<char> znaki;
        while (i < n) {
            char c = s[i];
            if (isdigit(c)) {
                long long x = 0;
                while (i < n && isdigit(s[i])) {
                    x = x * 10 + (s[i] - '0');
                    i++;
                }
                liczby.push(x);
                continue;
            }
            if (islower(c)) {
                string z;
                while (i < n && islower(s[i])) {
                    z += s[i];
                    i++;
                }
                liczby.push(wart[z]);
                continue;
            }
            if (c == '(') {
                znaki.push(c);
            } else if (c == ')') {
                while (znaki.top() != '(') zwin(liczby, znaki);
                znaki.pop();
            } else {
                while (!znaki.empty() && znaki.top() != '(' && prio(znaki.top()) >= prio(c)) zwin(liczby, znaki);
                znaki.push(c);
            }
            i++;
        }
        while (!znaki.empty()) zwin(liczby, znaki);
        wart[nazwa] = liczby.top();
        cout << nazwa << " = " << liczby.top() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-grupy-znajomych', krok: 9, level: 'srednie',
            title: 'Grupy znajomych',
            short: 'Każda grupa to spójny kawałek grafu. DFS z własnym stosem z każdej jeszcze nieodwiedzonej osoby zalewa całą jej grupę.',
            tags: ['spójne składowe', 'DFS na stosie', 'sortowanie wyników'],
            statement: ['W klasie jest n osób (numery od 1 do n) i m par znajomych. Grupa to zbiór osób, w którym każde dwie osoby łączy łańcuch znajomości, i do którego nikt spoza nie jest podłączony. Policz grupy i wypisz ich wielkości od największej do najmniejszej.',
                'Przejdź osoby od 1 do n. Gdy trafisz na osobę, której jeszcze nie odwiedziłeś, zaczyna się nowa grupa: przeszukaj ją w głąb własnym stosem, licząc odwiedzone osoby. Osoba bez znajomych też jest grupą — jednoosobową.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z m kolejnych wierszy dwie liczby — para znajomych.'],
            output_format: ['Dwa wiersze: grup: K oraz wielkości grup od największej, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ m ≤ 8000', 'Pary się nie powtarzają i nikt nie zna sam siebie.'],
            examples: [{ input: '7 4\n1 2\n2 3\n4 5\n6 4', note: 'Grupy: {1, 2, 3}, {4, 5, 6} i {7}.' }],
            hint: R`for (int s = 1; s <= n; s++) if (!byl[s]) { int ile = 0; stack<int> st; st.push(s); byl[s] = true; while (!st.empty()) { int v = st.top(); st.pop(); ile++; for (int u : g[v]) if (!byl[u]) { byl[u] = true; st.push(u); } } grupy.push_back(ile); }. Na koniec sort malejąco.`,
            tests: (r) => { const txt = (n, kr) => `${n} ${kr.length}` + (kr.length ? '\n' + kr.map((e) => e.join(' ')).join('\n') : ''); return [txt(1, []), txt(3, []), txt(2, [[1, 2]]), txt(8, losGraf(r, 8, 5)), txt(5000, losGraf(r, 5000, 8000)), txt(5000, losGraf(r, 5000, 2500)), txt(5000, losGraf(r, 5000, 4999, true)), txt(300, losGraf(r, 300, 150))]; },
            check: (inp) => { const t = nums(inp); const [n, m] = t; if (!calk(n, 1, 5000) || !calk(m, 0, 8000) || t.length !== 2 + 2 * m) return 'dane'; const s = new Set(); for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; if (!calk(a, 1, n) || !calk(b, 1, n) || a === b) return 'para'; const k = Math.min(a, b) * 10000 + Math.max(a, b); if (s.has(k)) return 'powtorzona'; s.add(k); } return null; },
            solve: (inp) => {
                const t = nums(inp); const [n, m] = t;
                const g = Array.from({ length: n + 1 }, () => []);
                for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; g[a].push(b); g[b].push(a); }
                const byl = new Uint8Array(n + 1), gr = [];
                for (let s = 1; s <= n; s++) { if (byl[s]) continue; let ile = 0; const st = [s]; byl[s] = 1; while (st.length) { const v = st.pop(); ile++; for (const u of g[v]) if (!byl[u]) { byl[u] = 1; st.push(u); } } gr.push(ile); }
                gr.sort((a, b) => b - a);
                return `grup: ${gr.length}\n${gr.join(' ')}`;
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
    vector<int> grupy;
    for (int s = 1; s <= n; s++) {
        if (byl[s]) continue;
        int ile = 0;
        stack<int> st;
        st.push(s);
        byl[s] = true;
        while (!st.empty()) {
            int v = st.top();
            st.pop();
            ile++;
            for (int u : g[v]) {
                if (!byl[u]) {
                    byl[u] = true;
                    st.push(u);
                }
            }
        }
        grupy.push_back(ile);
    }
    sort(grupy.begin(), grupy.end(), greater<int>());
    cout << "grup: " << grupy.size() << "\n";
    for (int x : grupy) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-sciezka-w-drzewie', krok: 9, level: 'srednie',
            title: 'Ścieżka w drzewie',
            short: 'W drzewie między dwoma wierzchołkami jest dokładnie jedna ścieżka. DFS stosem od a zapamiętuje, skąd przyszliśmy — potem idziesz od b wstecz do a.',
            tags: ['DFS z tablicą skąd', 'odtwarzanie drogi', 'odwracanie ścieżki'],
            statement: ['Sieć dróg między n wioskami (numery od 1 do n) tworzy drzewo: n − 1 dróg i z każdej wioski da się dojechać do każdej innej dokładnie jedną trasą bez zawracania. Wypisz tę trasę z wioski a do wioski b — numery wszystkich wiosek po kolei, łącznie z a i b.',
                'Przeszukaj drzewo w głąb od a własnym stosem i dla każdej wioski zapamiętaj w tablicy skad, z której wioski do niej weszliśmy. Potem idź od b po tablicy skad aż do a — dostaniesz trasę od końca. Odwróć ją (stos albo reverse) i wypisz.'],
            input_format: ['W pierwszym wierszu liczby n, a i b.', 'W każdym z n − 1 kolejnych wierszy dwie liczby — wioski połączone drogą.'],
            output_format: ['Jeden wiersz: numery wiosek na trasie z a do b.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ a, b ≤ n (a może być równe b).'],
            examples: [{ input: '6 4 6\n1 2\n1 3\n2 4\n3 5\n3 6', note: 'Z 4 trzeba przejść przez 2, 1 i 3, żeby dojść do 6.' }],
            hint: R`vector<int> skad(n + 1, 0); skad[a] = a; stack<int> st; st.push(a); while (!st.empty()) { int v = st.top(); st.pop(); for (int u : g[v]) if (skad[u] == 0) { skad[u] = v; st.push(u); } }. Potem: vector<int> droga; for (int v = b; v != a; v = skad[v]) droga.push_back(v); droga.push_back(a); reverse(…);.`,
            tests: (r) => {
                const drzewo = (n, gl) => { const o = losDrzewoOjcow(r, n, gl); const kr = []; for (let v = 2; v <= n; v++) kr.push(r() < 0.5 ? [v, o[v]] : [o[v], v]); return r.shuffle(kr); };
                const txt = (n, a, b, kr) => `${n} ${a} ${b}` + (kr.length ? '\n' + kr.map((e) => e.join(' ')).join('\n') : '');
                return [txt(1, 1, 1, []), txt(2, 2, 1, [[1, 2]]), txt(4, 3, 3, [[1, 2], [2, 3], [3, 4]]), txt(10, r.int(1, 10), r.int(1, 10), drzewo(10, 0.5)), txt(5000, r.int(1, 5000), r.int(1, 5000), drzewo(5000, 0.3)), txt(5000, r.int(1, 5000), r.int(1, 5000), drzewo(5000, 0.99)), txt(5000, r.int(1, 5000), r.int(1, 5000), drzewo(5000, 0))];
            },
            check: (inp) => {
                const t = nums(inp); const [n, a, b] = t;
                if (!calk(n, 1, 5000) || !calk(a, 1, n) || !calk(b, 1, n) || t.length !== 3 + 2 * (n - 1)) return 'dane';
                const g = Array.from({ length: n + 1 }, () => []);
                for (let i = 0; i < n - 1; i++) { const x = t[3 + 2 * i], y = t[4 + 2 * i]; if (!calk(x, 1, n) || !calk(y, 1, n) || x === y) return 'droga'; g[x].push(y); g[y].push(x); }
                const byl = new Uint8Array(n + 1), st = [1]; byl[1] = 1; let ile = 0;
                while (st.length) { const v = st.pop(); ile++; for (const u of g[v]) if (!byl[u]) { byl[u] = 1; st.push(u); } }
                return ile === n ? null : 'niespojne';
            },
            solve: (inp) => {
                const t = nums(inp); const [n, a, b] = t;
                const g = Array.from({ length: n + 1 }, () => []);
                for (let i = 0; i < n - 1; i++) { const x = t[3 + 2 * i], y = t[4 + 2 * i]; g[x].push(y); g[y].push(x); }
                const skad = new Int32Array(n + 1); skad[a] = a; const st = [a];
                while (st.length) { const v = st.pop(); for (const u of g[v]) if (!skad[u]) { skad[u] = v; st.push(u); } }
                const dr = []; for (let v = b; v !== a; v = skad[v]) dr.push(v); dr.push(a);
                return dr.reverse().join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, a, b;
    cin >> n >> a >> b;
    vector<vector<int>> g(n + 1);
    for (int i = 0; i < n - 1; i++) {
        int x, y;
        cin >> x >> y;
        g[x].push_back(y);
        g[y].push_back(x);
    }
    vector<int> skad(n + 1, 0);
    skad[a] = a;
    stack<int> st;
    st.push(a);
    while (!st.empty()) {
        int v = st.top();
        st.pop();
        for (int u : g[v]) {
            if (skad[u] == 0) {
                skad[u] = v;
                st.push(u);
            }
        }
    }
    vector<int> droga;
    for (int v = b; v != a; v = skad[v]) droga.push_back(v);
    droga.push_back(a);
    reverse(droga.begin(), droga.end());
    for (int v : droga) cout << v << " ";
    cout << "\n";
    return 0;
}`,
        },
        // ================================================================ BAZA · trudne
        {
            id: 'sto-b-widoczne-pary', krok: 9, level: 'trudne',
            title: 'Ile par się widzi?',
            short: 'Dwie osoby się widzą, gdy nikt między nimi nie jest wyższy od żadnej z nich. Przy milionie osób i równych wzrostach stos trzyma pary (wzrost, ile osób tego wzrostu).',
            tags: ['stos par (wzrost, liczba)', 'remisy', 'generator i 10⁶ osób'],
            statement: ['W szeregu stoi n osób. Dwie osoby A i B widzą się nawzajem, jeśli nikt, kto stoi między nimi, nie jest wyższy od A ani od B — czyli wszyscy pomiędzy mają wzrost najwyżej taki jak niższa z nich dwóch. Sąsiedzi zawsze się widzą. Policz wszystkie pary osób, które się widzą.',
                'Przechodź szereg od lewej, trzymając na stosie osoby, które mogą jeszcze zobaczyć kogoś z prawej. Na stosie wzrosty nie rosną od dna do wierzchu, a osoby o tym samym wzroście stojące obok siebie na stosie łączysz w jedną parę (wzrost, liczba osób). Nowa osoba o wzroście h widzi wszystkich niższych z wierzchu (zdejmujesz ich — dalej i tak nikogo już nie zobaczą), wszystkie osoby o wzroście h z wierzchu i jeszcze pierwszą wyższą osobę pod nimi, jeśli taka jest. Wzrosty generujesz wzorem x₀ = s, xᵢ = (xᵢ₋₁ · a + b) mod m.'],
            input_format: ['Jeden wiersz: pięć liczb n s a b m.'],
            output_format: ['Jedna liczba — liczba par osób, które się widzą.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹, 0 ≤ s, a, b < m'],
            examples: [{ input: '6 2 3 1 10', note: 'Wzrosty: 2, 7, 2, 7, 2, 7. Sąsiedzi to 5 par, a każde dwie siódemki widzą się ponad dwójkami — to 3 kolejne pary. Razem 8.' }, { input: '4 5 0 5 10', note: 'Wszyscy mają wzrost 5 — każdy widzi każdego: 6 par.' }],
            hint: R`${KOD_GEN} stack<pair<long long, int>> st; dla każdego h: while (!st.empty() && st.top().first < h) { wynik += st.top().second; st.pop(); } if (!st.empty() && st.top().first == h) { int c = st.top().second; st.pop(); wynik += c; if (!st.empty()) wynik++; st.push({h, c + 1}); } else { if (!st.empty()) wynik++; st.push({h, 1}); }.`,
            tests: (r) => ['1 5 0 0 10', '2 3 0 3 10', '6 2 3 1 10', '4 5 0 5 10', '8 1 1 1 3', '1000000 999999 1 999999 1000000', '1000000 0 1 1 1000000', '1000000 7 0 7 10', `1000000 ${r.int(0, 999999936)} 48271 11 999999937`, `1000000 ${r.int(0, 9)} 1 3 10`, `1000000 ${r.int(0, 2)} 1 1 3`, `${losGen(r, 3000, 20)}`, `${losGen(r, 30, 4)}`],
            check: (inp) => (nums(inp).length === 5 && dobryGen(nums(inp), 0, 1e6, 1e9) ? null : 'dane'),
            solve: (inp) => {
                const [n, s, a, b, m] = nums(inp);
                const x = generuj(n, s, a, b, m);
                const hs = new Float64Array(n), cs = new Int32Array(n); let top = 0, w = 0;
                for (let i = 0; i < n; i++) {
                    const hh = x[i];
                    while (top && hs[top - 1] < hh) { w += cs[top - 1]; top--; }
                    if (top && hs[top - 1] === hh) { const c = cs[top - 1]; top--; w += c; if (top) w++; hs[top] = hh; cs[top] = c + 1; top++; }
                    else { if (top) w++; hs[top] = hh; cs[top] = 1; top++; }
                }
                return String(w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    vector<long long> x(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    stack<pair<long long, int>> st; // (wzrost, ile osób tego wzrostu)
    long long wynik = 0;
    for (int i = 0; i < n; i++) {
        long long h = x[i];
        while (!st.empty() && st.top().first < h) {
            wynik += st.top().second;
            st.pop();
        }
        if (!st.empty() && st.top().first == h) {
            int c = st.top().second;
            st.pop();
            wynik += c;
            if (!st.empty()) wynik++;
            st.push({h, c + 1});
        } else {
            if (!st.empty()) wynik++;
            st.push({h, 1});
        }
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-maksimum-z-minimow', krok: 9, level: 'trudne',
            title: 'Najmocniejsze najsłabsze ogniwo',
            short: 'Dla każdej długości okna: największe minimum spośród wszystkich okien tej długości. Każda liczba jest minimum okna długości R − L − 1 — a reszta wynika z tego, że dłuższe okno nie ma lepszego minimum.',
            tags: ['poprzedni i następny mniejszy', 'najlepszy dla każdej długości', 'propagacja od końca'],
            statement: ['Łańcuch ma n ogniw o wytrzymałościach x₀, …, xₙ₋₁. Kawałek łańcucha z k kolejnych ogniw jest tak mocny, jak jego najsłabsze ogniwo. Dla każdej długości k od 1 do n wyznacz f(k) — wytrzymałość najmocniejszego kawałka długości k. Wypisz f(1), f(2), …, f(min(n, 20)), a w drugim wierszu sumę wszystkich f(k).',
                'Liczba xᵢ jest minimum kawałka, który rozciąga się do najbliższych ostro mniejszych liczb z obu stron — ma on długość d = R − L − 1. Zapisz najlepszy[d] = max(najlepszy[d], xᵢ). Krótszy kawałek wycięty z tamtego też ma minimum co najmniej xᵢ, więc na koniec przejdź długości od n − 1 w dół: najlepszy[k] = max(najlepszy[k], najlepszy[k + 1]). Liczby generujesz wzorem x₀ = s, xᵢ = (xᵢ₋₁ · a + b) mod m.'],
            input_format: ['Jeden wiersz: pięć liczb n s a b m.'],
            output_format: ['Dwa wiersze: f(1) … f(min(n, 20)) oraz suma: S.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹, 0 ≤ s, a, b < m'],
            examples: [{ input: '6 2 3 1 10', note: 'Liczby: 2, 7, 2, 7, 2, 7. Kawałek długości 1 może mieć siódemkę, ale każdy dłuższy zawiera dwójkę.' }, { input: '5 1 2 1 100', note: 'Liczby: 1, 3, 7, 15, 31 — rosnące, więc najmocniejszy kawałek długości k to k ostatnich ogniw.' }],
            hint: R`${KOD_GEN} L i R: stos jak w „Jak szeroko sięga słupek?” (zdejmuj, dopóki x[s.top()] >= x[i]). vector<long long> naj(n + 2, 0); for (i) naj[R[i] - L[i] - 1] = max(…, x[i]); for (int k = n - 1; k >= 1; k--) naj[k] = max(naj[k], naj[k + 1]);. Suma do 10¹⁵ — long long.`,
            tests: (r) => ['1 5 0 0 10', '6 2 3 1 10', '5 1 2 1 100', '7 3 0 3 10', '1000000 999999 1 999999 1000000', '1000000 0 1 1 1000000', `1000000 ${r.int(0, 999999936)} 48271 11 999999937`, `1000000 ${r.int(0, 9)} 1 3 10`, `${losGen(r, 3000, 1000)}`, `${losGen(r, 25, 50)}`],
            check: (inp) => (nums(inp).length === 5 && dobryGen(nums(inp), 0, 1e6, 1e9) ? null : 'dane'),
            solve: (inp) => {
                const [n, s, a, b, m] = nums(inp);
                const x = generuj(n, s, a, b, m);
                const L = najblizszy(x, -1, (p, q) => p < q), Rr = najblizszy(x, +1, (p, q) => p < q);
                const naj = new Float64Array(n + 2);
                for (let i = 0; i < n; i++) { const d = (Rr[i] < 0 ? n : Rr[i]) - L[i] - 1; if (x[i] > naj[d]) naj[d] = x[i]; }
                for (let k = n - 1; k >= 1; k--) if (naj[k + 1] > naj[k]) naj[k] = naj[k + 1];
                let suma = 0; const pierwsze = [];
                for (let k = 1; k <= n; k++) { suma += naj[k]; if (k <= 20) pierwsze.push(naj[k]); }
                return `${pierwsze.join(' ')}\nsuma: ${suma}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    vector<long long> x(n);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    vector<int> L(n), R(n);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && x[st.top()] >= x[i]) st.pop();
        L[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }
    st = stack<int>();
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && x[st.top()] >= x[i]) st.pop();
        R[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    vector<long long> naj(n + 2, 0);
    for (int i = 0; i < n; i++) {
        int d = R[i] - L[i] - 1;
        naj[d] = max(naj[d], x[i]);
    }
    for (int k = n - 1; k >= 1; k--) naj[k] = max(naj[k], naj[k + 1]);
    long long suma = 0;
    for (int k = 1; k <= n; k++) {
        suma += naj[k];
        if (k <= 20) cout << naj[k] << " ";
    }
    cout << "\nsuma: " << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-licznik-atomow', krok: 9, level: 'trudne',
            title: 'Licznik atomów',
            short: 'Mg(OH)2 to jeden magnez, dwa tleny i dwa wodory. Stos map: nawias otwiera nową mapę, a zamknięcie mnoży ją przez liczbę za nawiasem i dosypuje do mapy pod spodem.',
            tags: ['stack<map<string, long long>>', 'nawiasy z mnożnikiem', 'czytanie nazw i liczb'],
            statement: ['Wzór chemiczny składa się z symboli pierwiastków, liczb i nawiasów. Symbol to wielka litera, po której mogą stać małe litery (np. H, Mg, Cl). Liczba za symbolem mówi, ile jest atomów (brak liczby oznacza 1). Fragment w nawiasie z liczbą za nawiasem powtarza się tyle razy: Mg(OH)2 to Mg, 2 × O i 2 × H, a K4(ON(SO3)2)2 to 4 × K, 2 × O, 2 × N, 4 × S i 12 × O więcej.',
                'Dla każdego wzoru wypisz, ile jest atomów każdego pierwiastka — w kolejności alfabetycznej symboli (tak, jak sortuje je map), w formacie Symbol:liczba. Trzymaj stos map map<string, long long>: na dnie mapa całego wzoru. Nawias ( kładzie nową, pustą mapę. Nawias ) zdejmuje mapę z wierzchu, mnoży wszystkie jej liczby przez liczbę za nawiasem i dodaje je do mapy, która teraz jest na wierzchu. Symbol z liczbą po prostu dodaje się do mapy z wierzchu.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jeden wzór (bez spacji).'],
            output_format: ['t wierszy: pary Symbol:liczba w kolejności alfabetycznej, oddzielone spacjami.'],
            constraints: ['1 ≤ t ≤ 20', 'Każdy wzór ma od 1 do 1000 znaków i jest poprawny: liczby są od 1 do 999 bez zer na początku, nawiasy są sparowane i nie są puste, zagnieżdżenie nie przekracza 4.', 'Liczby atomów mieszczą się w long long.'],
            examples: [{ input: '3\nH2O\nMg(OH)2\nK4(ON(SO3)2)2', note: 'W ostatnim: (SO3)2 to S2O6, z ON robi się O7NS2, a całość razy 2 daje O14N2S4 — plus 4 atomy K.' }],
            hint: R`long long czytajLiczbe(const string &s, int &i) — czyta cyfry od pozycji i (przesuwając i), a gdy cyfr nie ma, zwraca 1. Zamknięcie: map<string, long long> w = st.top(); st.pop(); long long k = czytajLiczbe(s, i); for (auto [el, ile] : w) st.top()[el] += ile * k;.`,
            tests: (r) => {
                const EL = ['H', 'He', 'Li', 'C', 'N', 'O', 'F', 'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'K', 'Ca', 'Fe', 'Cu', 'Zn', 'Ag', 'Au', 'Pb', 'U', 'Xe'];
                const grupa = (gl, budzet) => {
                    let s = ''; const ile = r.int(1, 4);
                    for (let i = 0; i < ile && s.length < budzet; i++) {
                        if (gl < 4 && r() < 0.3) { const w = grupa(gl + 1, Math.max(4, budzet / 3)); s += `(${w})${r() < 0.85 ? r.int(2, 9) : ''}`; }
                        else s += r.pick(EL) + (r() < 0.5 ? r.int(2, gl ? 9 : 99) : '');
                    }
                    return s || 'H';
                };
                // utnij do najwyżej 1000 znaków, ale tylko na granicy całych kawałków najwyższego poziomu
                const popraw = (s) => {
                    let g = 0, cut = 0;
                    for (let i = 0; i < s.length && i < 1000; i++) { if (s[i] === '(') g++; else if (s[i] === ')') g--; if (g === 0 && (i + 1 === s.length || /[A-Z(]/.test(s[i + 1]))) cut = i + 1; }
                    return s.slice(0, cut) || 'H';
                };
                const dlugi = () => { let s = ''; while (s.length < 1100) s += grupa(0, 60); return popraw(s); };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['H']), d(['H2O', 'Mg(OH)2', 'K4(ON(SO3)2)2']), d(['C6H12O6', 'NaCl', 'Fe2(SO4)3', 'Ca(OH)2', '(H2O)99']), d(Array.from({ length: 20 }, () => popraw(grupa(0, 200)))), d(Array.from({ length: 20 }, () => popraw(dlugi()))), d(['((((H2)3)5)7)999', 'U999U999U999'])];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]); if (!calk(t, 1, 20) || L.length !== t + 1) return 't';
                for (const s of L.slice(1)) { const z = zlyWzor(s); if (z) return z + ': ' + s.slice(0, 40); }
                return null;
            },
            solve: (inp) => linie(inp).slice(1).map((s) => {
                const st = [new Map()]; let i = 0;
                const liczba = () => { let j = i; while (j < s.length && /\d/.test(s[j])) j++; const k = j > i ? BigInt(s.slice(i, j)) : 1n; i = j; return k; };
                const dodaj = (m, el, k) => m.set(el, (m.get(el) || 0n) + k);
                while (i < s.length) {
                    if (s[i] === '(') { st.push(new Map()); i++; }
                    else if (s[i] === ')') { i++; const k = liczba(); const w = st.pop(); for (const [el, ile] of w) dodaj(st[st.length - 1], el, ile * k); }
                    else { let j = i + 1; while (j < s.length && /[a-z]/.test(s[j])) j++; const el = s.slice(i, j); i = j; dodaj(st[st.length - 1], el, liczba()); }
                }
                return [...st[0].keys()].sort().map((el) => `${el}:${st[0].get(el)}`).join(' ');
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long czytajLiczbe(const string &s, int &i) {
    long long k = 0;
    bool sa = false;
    while (i < (int)s.size() && isdigit(s[i])) {
        k = k * 10 + (s[i] - '0');
        i++;
        sa = true;
    }
    return sa ? k : 1;
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        stack<map<string, long long>> st;
        st.push(map<string, long long>());
        int i = 0, n = s.size();
        while (i < n) {
            if (s[i] == '(') {
                st.push(map<string, long long>());
                i++;
            } else if (s[i] == ')') {
                i++;
                long long k = czytajLiczbe(s, i);
                map<string, long long> w = st.top();
                st.pop();
                for (auto [el, ile] : w) st.top()[el] += ile * k;
            } else {
                string el(1, s[i]);
                i++;
                while (i < n && islower(s[i])) {
                    el += s[i];
                    i++;
                }
                st.top()[el] += czytajLiczbe(s, i);
            }
        }
        bool pierwszy = true;
        for (auto [el, ile] : st.top()) {
            if (!pierwszy) cout << " ";
            cout << el << ":" << ile;
            pierwszy = false;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-prostokaty-z-kropek', krok: 9, level: 'trudne',
            title: 'Ile jest wolnych prostokątów?',
            short: 'Policz wszystkie prostokąty z samych kropek. Dla każdego pola: ile prostokątów ma w nim prawy dolny róg — stos monotoniczny daje to w jednym kroku na pole.',
            tags: ['histogram w każdym wierszu', 'liczenie zamiast maksimum', 'cnt[j] = cnt[L] + h·(j − L)'],
            statement: ['Plansza n × m składa się z kropek (wolne pola) i znaków #. Policz, ile jest prostokątów (o bokach wzdłuż linii planszy) złożonych wyłącznie z kropek. Prostokąty liczymy wszystkie, także takie, które leżą w środku innych — na przykład dwie kropki obok siebie to 3 prostokąty: dwa jednopolowe i jeden dwupolowy.',
                'Policz osobno prostokąty, których prawy dolny róg jest na polu (i, j). Jak w „Największym wolnym placu”, dla wiersza i weź wysokości h[j] — liczbę kropek ciągnących się w górę od tego pola. Niech L to najbliższa kolumna na lewo z h[L] < h[j]. Prostokąty z lewym bokiem w kolumnach od L + 1 do j mogą mieć dowolną wysokość od 1 do h[j] — to h[j] · (j − L) prostokątów. Te z lewym bokiem w kolumnie L lub dalej na lewo są dokładnie takie jak prostokąty z prawym dolnym rogiem w (i, L) — jest ich cnt[L]. Zatem cnt[j] = cnt[L] + h[j] · (j − L), a L znajdziesz stosem.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków: kropka albo #.'],
            output_format: ['Jedna liczba — liczba wolnych prostokątów.'],
            constraints: ['1 ≤ n, m ≤ 200'],
            examples: [{ input: '2 3\n..#\n...', note: 'W pierwszym wierszu dwie kropki dają 3 prostokąty, w drugim trzy kropki — 6, a prostokąty przez oba wiersze (w dwóch pierwszych kolumnach) — jeszcze 3. Razem 12.' }],
            hint: R`vector<long long> cnt(m); for (int j = 0; j < m; j++) { while (!s.empty() && h[s.top()] >= h[j]) s.pop(); int L = s.empty() ? -1 : s.top(); cnt[j] = (L >= 0 ? cnt[L] : 0) + (long long)h[j] * (j - L); wynik += cnt[j]; s.push(j); }. Stos zakładasz od nowa w każdym wierszu.`,
            tests: (r) => {
                const plansza = (n, m, p) => { const g = []; for (let i = 0; i < n; i++) { let s = ''; for (let j = 0; j < m; j++) s += r() < p ? '#' : '.'; g.push(s); } return `${n} ${m}\n${g.join('\n')}`; };
                return ['1 1\n.', '1 1\n#', '1 2\n..', '2 3\n..#\n...', plansza(5, 6, 0.3), plansza(200, 200, 0), plansza(200, 200, 0.1), plansza(200, 200, 0.4), plansza(200, 200, 0.02), plansza(1, 200, 0.2), plansza(120, 80, 0.25)];
            },
            check: (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); return calk(n, 1, 200) && calk(m, 1, 200) && L.length === n + 1 && L.slice(1).every((s) => s.length === m && /^[.#]+$/.test(s)) ? null : 'dane'; },
            solve: (inp) => {
                const L = linie(inp); const [n, m] = L[0].split(' ').map(Number);
                const h2 = new Array(m).fill(0); let w = 0;
                for (let i = 1; i <= n; i++) {
                    for (let j = 0; j < m; j++) h2[j] = L[i][j] === '.' ? h2[j] + 1 : 0;
                    const lewy = najblizszy(h2, -1, (x, y) => x < y); const cnt = new Array(m);
                    for (let j = 0; j < m; j++) { cnt[j] = (lewy[j] >= 0 ? cnt[lewy[j]] : 0) + h2[j] * (j - lewy[j]); w += cnt[j]; }
                }
                return String(w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<int> h(m, 0);
    vector<long long> cnt(m);
    long long wynik = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) h[j] = (g[i][j] == '.') ? h[j] + 1 : 0;
        stack<int> s;
        for (int j = 0; j < m; j++) {
            while (!s.empty() && h[s.top()] >= h[j]) s.pop();
            int L = s.empty() ? -1 : s.top();
            cnt[j] = (L >= 0 ? cnt[L] : 0) + (long long)h[j] * (j - L);
            wynik += cnt[j];
            s.push(j);
        }
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-drzewo-kartezjanskie', krok: 9, level: 'trudne',
            title: 'Drzewo z najmniejszym w korzeniu',
            short: 'Korzeniem jest najmniejsza liczba, lewa część ciągu to lewe poddrzewo, prawa — prawe. Stos trzyma prawą krawędź drzewa i buduje je w jednym przejściu.',
            tags: ['drzewo kartezjańskie', 'prawa krawędź na stosie', 'ostatni zdjęty → lewe dziecko'],
            statement: ['Z ciągu n różnych liczb budujemy drzewo: korzeniem jest najmniejsza liczba ciągu, jej lewym poddrzewem — drzewo zbudowane tak samo z liczb stojących przed nią, a prawym — z liczb stojących za nią. Dla każdej pozycji ciągu (od 1 do n) wypisz pozycję jej rodzica w tym drzewie, a dla korzenia — 0.',
                'Rekurencja z szukaniem minimum byłaby wolna dla ciągów rosnących. Szybciej: dokładaj liczby po kolei i trzymaj na stosie prawą krawędź drzewa (od korzenia na dnie do ostatnio dołożonej liczby na wierzchu). Nowa liczba x zdejmuje ze stosu wszystkie większe od siebie — ostatnia zdjęta liczba zostaje jej lewym dzieckiem, a x staje się prawym dzieckiem liczby, która została na wierzchu stosu (jeśli jakaś została). Potem x trafia na stos.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych liczb.'],
            output_format: ['Jeden wiersz: n liczb — pozycja rodzica każdej pozycji (0 dla korzenia).'],
            constraints: ['1 ≤ n ≤ 5000', 'Liczby są różne, od 1 do 10⁹.'],
            examples: [{ input: '6\n5 2 8 1 7 9', note: 'Korzeń to 1 (pozycja 4). Na lewo od niego najmniejsza jest 2 (pozycja 2) — jej dzieci to 5 i 8. Na prawo najmniejsza jest 7 — jej prawe dziecko to 9.' }],
            hint: R`vector<int> ojciec(n, -1); for (int i = 0; i < n; i++) { int ostatni = -1; while (!s.empty() && a[s.top()] > a[i]) { ostatni = s.top(); s.pop(); } if (!s.empty()) ojciec[i] = s.top(); if (ostatni != -1) ojciec[ostatni] = i; s.push(i); }. Wypisuj ojciec[i] + 1 — dla korzenia wyjdzie 0.`,
            tests: (r) => { const perm = (n, hi) => { const s = new Set(); while (s.size < n) s.add(r.int(1, hi)); return r.shuffle([...s]); }; return [d1([7]), d1([1, 2]), d1([2, 1]), d1([3, 1, 2]), d1(perm(15, 100)), d1(perm(5000, 1000000000)), d1(Array.from({ length: 5000 }, (_, i) => i + 1)), d1(Array.from({ length: 5000 }, (_, i) => 5000 - i)), d1(Array.from({ length: 5000 }, (_, i) => (i % 2 ? i + 1 : 10000 - i)))]; },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 5000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) && new Set(t.slice(1)).size === t[0] ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp).slice(1), n = a.length, oj = new Array(n).fill(0);
                // rekurencja przez jawny stos przedziałów: (lewy, prawy, rodzic)
                const st = [[0, n - 1, -1]];
                while (st.length) { const [l, p, o] = st.pop(); if (l > p) continue; let k = l; for (let i = l; i <= p; i++) if (a[i] < a[k]) k = i; oj[k] = o + 1; st.push([l, k - 1, k], [k + 1, p, k]); }
                return oj.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    vector<int> ojciec(n, -1);
    stack<int> s; // prawa krawędź drzewa
    for (int i = 0; i < n; i++) {
        int ostatni = -1;
        while (!s.empty() && a[s.top()] > a[i]) {
            ostatni = s.top();
            s.pop();
        }
        if (!s.empty()) ojciec[i] = s.top();
        if (ostatni != -1) ojciec[ostatni] = i;
        s.push(i);
    }
    for (int i = 0; i < n; i++) cout << ojciec[i] + 1 << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-kalkulator-pelny', krok: 9, level: 'trudne',
            title: 'Pełny kalkulator',
            short: 'Do kalkulatora dochodzi potęgowanie ^ (łączne w prawo, najwyższy priorytet) i minus przed liczbą na początku albo po nawiasie — liczony jak 0 − … .',
            tags: ['priorytety 1, 2, 3', '^ łączne w prawo', 'minus jednoargumentowy'],
            statement: ['Policz wartości t wyrażeń z liczbami, nawiasami i działaniami +, -, *, / oraz ^ (potęgowanie). Potęgowanie ma najwyższy priorytet i jest łączne w prawo: 2^3^2 to 2^(3^2) = 512. Mnożenie i dzielenie mają średni priorytet, dodawanie i odejmowanie — najniższy; działania o średnim i niskim priorytecie wykonuje się od lewej. Dzielenie jest całkowite jak w C++.',
                'Minus może też stać na samym początku wyrażenia albo zaraz po nawiasie otwierającym, np. -3+5 albo 2*(-4). Taki minus działa tak, jakby przed nim stało 0: -2^2 to 0 − 2^2 = −4, a (-2)^2 to 4. Rozszerz kalkulator na dwóch stosach: ^ ma priorytet 3, a przy porównaniu priorytetów zdejmuj ze stosu znaków działanie o równym priorytecie tylko wtedy, gdy nowe działanie nie jest ^. Gdy minus stoi na początku albo po (, najpierw połóż na stos liczb 0.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jedno wyrażenie bez spacji.'],
            output_format: ['t wierszy — wartości wyrażeń.'],
            constraints: ['1 ≤ t ≤ 100', 'Każde wyrażenie ma od 1 do 1000 znaków, wszystkie razem — najwyżej 50 000. Liczby są od 0 do 10⁴, bez zer na początku.', 'Wyrażenia są poprawne: nie dzielą przez zero, wykładniki są od 0 do 62, a każdy wynik po drodze ma wartość bezwzględną najwyżej 10¹⁸.'],
            examples: [{ input: '5\n2^3^2\n-2^2\n(-2)^2\n2*(-3+10)/4\n10-2^3*2', note: '2^3^2 = 2^9. Minus na początku to 0 − 2^2. W ostatnim najpierw 2^3 = 8, potem 8 · 2 = 16, a 10 − 16 = −6.' }],
            hint: R`int prio(char c) { if (c == '^') return 3; if (c == '*' || c == '/') return 2; return 1; }. Zdejmowanie: while (!z.empty() && z.top() != '(' && (prio(z.top()) > prio(c) || (prio(z.top()) == prio(c) && c != '^'))) zwin(…);. Zmienna bool poczatek = true na starcie i po '(', false po liczbie, ')' i działaniu — jeśli c == '-' && poczatek, to liczby.push(0).`,
            tests: (r) => {
                const OPS5 = ['+', '-', '*', '/', '^'];
                const pr = (o) => (o === '^' ? 3 : o === '*' || o === '/' ? 2 : 1);
                const napis = (x) => {
                    if (!x.op) return x.v;
                    let l = napis(x.l), p = napis(x.p);
                    if (x.op === '^') { if (x.l.op) l = `(${l})`; if (x.p.op && pr(x.p.op) < 3) p = `(${p})`; }
                    else { if (x.l.op && pr(x.l.op) < pr(x.op)) l = `(${l})`; if (x.p.op && pr(x.p.op) <= pr(x.op)) p = `(${p})`; }
                    return l + x.op + p;
                };
                const wart = wartPelna;
                const minusy = (s, p) => { // wstawia jednoargumentowe minusy na początku i po '(' — tylko gdy wartość dalej jest poprawna
                    const poz = [0, ...[...s].map((c, i) => (c === '(' ? i + 1 : -1)).filter((i) => i > 0)];
                    let t = s;
                    for (const i of poz.reverse()) { if (r() < p && t[i] !== '-') { const n2 = t.slice(0, i) + '-' + t.slice(i); if (wart(n2) !== null && n2.length <= 1000) t = n2; } }
                    return t;
                };
                const gen = (k, lo, hi, p) => { for (let proba = 0; proba < 50; proba++) { const s = minusy(napis(dobreDrzewo(r, k, lo, hi, OPS5)), p); if (s.length <= 1000 && wart(s) !== null) return s; } return '1+1'; };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['7']), d(['-7', '(-7)', '2^0', '0^0', '(-1)^61']), d(['2^3^2', '-2^2', '(-2)^2', '2*(-3+10)/4', '10-2^3*2', '2^59', '-(2^59)', '(2^3)^2', '-8/3', '7-(-2)^3']), d(Array.from({ length: 60 }, () => gen(r.int(1, 12), 0, 9, 0.3))), d(Array.from({ length: 30 }, () => gen(r.int(10, 120), 0, 30, 0.2))), d([gen(250, 0, 10000, 0.1), gen(300, 0, 5, 0.3), gen(200, 1, 3, 0.4)])];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]);
                if (!calk(t, 1, 100) || L.length !== t + 1 || L.slice(1).join('').length > 50000) return 't';
                for (const s of L.slice(1)) {
                    if (s.length < 1 || s.length > 1000 || !/^[0-9+\-*/^()]+$/.test(s)) return 'znaki';
                    if (tokenyInfix(s).some((x) => /^\d/.test(x) && (Number(x) > 1e4 || (x.length > 1 && x[0] === '0')))) return 'liczby';
                    if (/[+\-*/^(]-/.test(s.replace(/\(-/g, '(#')) || /^--/.test(s)) return 'minus';
                    if (wartPelna(s) === null) return 'wartosc: ' + s.slice(0, 40);
                }
                return null;
            },
            solve: (inp) => linie(inp).slice(1).map((s) => String(wartPelna(s))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int prio(char c) {
    if (c == '^') return 3;
    if (c == '*' || c == '/') return 2;
    return 1;
}
long long potega(long long a, long long b) {
    long long w = 1;
    for (long long i = 0; i < b; i++) w *= a;
    return w;
}
void zwin(stack<long long> &liczby, stack<char> &znaki) {
    long long b = liczby.top();
    liczby.pop();
    long long a = liczby.top();
    liczby.pop();
    char op = znaki.top();
    znaki.pop();
    if (op == '+') liczby.push(a + b);
    else if (op == '-') liczby.push(a - b);
    else if (op == '*') liczby.push(a * b);
    else if (op == '/') liczby.push(a / b);
    else liczby.push(potega(a, b));
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        int n = s.size(), i = 0;
        stack<long long> liczby;
        stack<char> znaki;
        bool poczatek = true; // na początku i zaraz po '(' minus jest jednoargumentowy
        while (i < n) {
            char c = s[i];
            if (isdigit(c)) {
                long long x = 0;
                while (i < n && isdigit(s[i])) {
                    x = x * 10 + (s[i] - '0');
                    i++;
                }
                liczby.push(x);
                poczatek = false;
                continue;
            }
            if (c == '(') {
                znaki.push(c);
                poczatek = true;
            } else if (c == ')') {
                while (znaki.top() != '(') zwin(liczby, znaki);
                znaki.pop();
                poczatek = false;
            } else {
                if (c == '-' && poczatek) liczby.push(0); // -x liczymy jak 0 - x
                while (!znaki.empty() && znaki.top() != '(' &&
                       (prio(znaki.top()) > prio(c) || (prio(znaki.top()) == prio(c) && c != '^')))
                    zwin(liczby, znaki);
                znaki.push(c);
                poczatek = false;
            }
            i++;
        }
        while (!znaki.empty()) zwin(liczby, znaki);
        cout << liczby.top() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-b-cykl-skierowany', krok: 9, level: 'trudne',
            title: 'Czy zadania da się wykonać?',
            short: 'Zależności „a przed b” to graf skierowany. Jeśli ma cykl, nie da się ich spełnić. DFS z kolorami na własnym stosie: krawędź do szarego wierzchołka to cykl.',
            tags: ['DFS ze stosem par', 'trzy kolory', 'cykl w grafie skierowanym'],
            statement: ['Jest n zadań i m zależności: zależność a b oznacza, że zadanie a trzeba wykonać przed zadaniem b. Sprawdź, czy da się wykonać wszystkie zadania — czyli czy zależności nie tworzą cyklu (na przykład a przed b, b przed c i c przed a). Wypisz NIE, jeśli istnieje cykl (wtedy się nie da), albo TAK.',
                'Przeszukaj graf w głąb własnym stosem, który — jak stos wywołań w rekurencji — trzyma bieżącą ścieżkę: pary (zadanie, ile jego następników już obejrzałeś). Każde zadanie ma kolor: białe (nieodwiedzone), szare (leży na stosie, czyli na bieżącej ścieżce) albo czarne (wszyscy następnicy obejrzani i zdjęte ze stosu). Spójrz na wierzch stosu: jeśli zadanie ma jeszcze nieobejrzanego następnika u, to gdy u jest szare — znalazłeś cykl, gdy białe — pomaluj je na szaro i połóż na stos. Jeśli następników już nie ma, pomaluj zadanie na czarno i zdejmij je. Zacznij taki DFS z każdego białego zadania.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z m kolejnych wierszy dwie liczby a i b — zależność „a przed b”.'],
            output_format: ['Jedno słowo: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ m ≤ 8000', 'a ≠ b, a każda zależność występuje najwyżej raz.'],
            examples: [{ input: '4 4\n1 2\n2 3\n1 3\n3 4', note: 'Kolejność 1, 2, 3, 4 spełnia wszystkie zależności.' }, { input: '3 3\n1 2\n2 3\n3 1', note: 'Cykl 1 → 2 → 3 → 1 — nie da się zacząć od żadnego zadania.' }],
            hint: R`vector<int> kolor(n + 1, 0); stack<pair<int, int>> st; st.push({s, 0}); kolor[s] = 1; while (!st.empty() && !cykl) { int v = st.top().first; int &i = st.top().second; if (i < (int)g[v].size()) { int u = g[v][i]; i++; if (kolor[u] == 1) cykl = true; else if (kolor[u] == 0) { kolor[u] = 1; st.push({u, 0}); } } else { kolor[v] = 2; st.pop(); } }.`,
            tests: (r) => {
                const txt = (n, kr) => `${n} ${kr.length}` + (kr.length ? '\n' + kr.map((e) => e.join(' ')).join('\n') : '');
                const dag = (n, m) => { const p = r.shuffle(Array.from({ length: n }, (_, i) => i + 1)); const poz = new Array(n + 1); p.forEach((v, i) => { poz[v] = i; }); return losGraf(r, n, m).map(([a, b]) => (poz[a] < poz[b] ? [a, b] : [b, a])); };
                const zCyklem = (n, m) => { const kr = dag(n, m - 1); const p = r.int(0, kr.length - 1); const [a, b] = kr[p]; let x = b, droga = [a, b]; const g = Array.from({ length: n + 1 }, () => []); kr.forEach(([u, v]) => g[u].push(v)); while (g[x].length && droga.length < 50) { x = r.pick(g[x]); droga.push(x); } const ostatni = droga[droga.length - 1]; return ostatni !== a ? [...kr, [ostatni, a]] : kr; };
                const sciezka = (n) => { const kr = []; for (let i = 1; i < n; i++) kr.push([i, i + 1]); return kr; };
                return [txt(1, []), txt(2, [[1, 2], [2, 1]]), txt(3, [[1, 2], [2, 3], [1, 3]]), txt(6, dag(6, 8)), txt(6, zCyklem(6, 8)), txt(5000, dag(5000, 8000)), txt(5000, zCyklem(5000, 8000)), txt(5000, sciezka(5000)), txt(5000, [...sciezka(5000), [5000, 1]]), txt(5000, r.shuffle([...sciezka(4999).slice(1), [4999, 2]])), txt(300, losGraf(r, 300, 2000))];
            },
            check: (inp) => {
                const t = nums(inp); const [n, m] = t;
                if (!calk(n, 1, 5000) || !calk(m, 0, 8000) || t.length !== 2 + 2 * m) return 'dane';
                const s = new Set();
                for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; if (!calk(a, 1, n) || !calk(b, 1, n) || a === b) return 'krawedz'; const k = a * 10000 + b; if (s.has(k)) return 'powtorzona'; s.add(k); }
                return null;
            },
            solve: (inp) => {
                // algorytm Kahna (inny sposób niż we wzorcówce C++): zadania bez poprzedników po kolei
                const t = nums(inp); const [n, m] = t;
                const g = Array.from({ length: n + 1 }, () => []), we = new Int32Array(n + 1);
                for (let i = 0; i < m; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; g[a].push(b); we[b]++; }
                const q = []; for (let v = 1; v <= n; v++) if (!we[v]) q.push(v);
                let zrobione = 0;
                for (let h2 = 0; h2 < q.length; h2++) { zrobione++; for (const u of g[q[h2]]) if (--we[u] === 0) q.push(u); }
                return zrobione === n ? 'TAK' : 'NIE';
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
    }
    vector<int> kolor(n + 1, 0); // 0 białe, 1 szare (na stosie), 2 czarne (skończone)
    bool cykl = false;
    for (int s = 1; s <= n && !cykl; s++) {
        if (kolor[s] != 0) continue;
        stack<pair<int, int>> st; // (zadanie, ilu następników już obejrzano)
        st.push({s, 0});
        kolor[s] = 1;
        while (!st.empty() && !cykl) {
            int v = st.top().first;
            int &i = st.top().second;
            if (i < (int)g[v].size()) {
                int u = g[v][i];
                i++;
                if (kolor[u] == 1) {
                    cykl = true;
                } else if (kolor[u] == 0) {
                    kolor[u] = 1;
                    st.push({u, 0});
                }
            } else {
                kolor[v] = 2;
                st.pop();
            }
        }
    }
    cout << (cykl ? "NIE" : "TAK") << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-b-maszyna-stosowa', krok: 9, level: 'trudne',
            title: 'Wielki finał: maszyna stosowa',
            short: 'Napisz interpreter języka, w którym wszystko dzieje się na stosie: liczby, działania, skoki, a nawet wywołania funkcji (CALL i RET na drugim stosie). Tak naprawdę działają procesory i maszyna wirtualna Javy.',
            tags: ['stos danych + stos wywołań', 'interpreter', 'błędy wykonania'],
            statement: ['Maszyna ma stos liczb (stos danych) i osobny stos wywołań. Program to p linii ponumerowanych od 1, w każdej jedno polecenie. Maszyna zaczyna od linii 1 i wykonuje polecenia po kolei — chyba że polecenie skoku każe przejść gdzie indziej. Kończy pracę po poleceniu HALT, po wyjściu za ostatnią linię albo przy błędzie.',
                'Polecenia na stosie danych: PUSH x kładzie x; POP zdejmuje wierzch; DUP kładzie kopię wierzchu; SWAP zamienia dwie górne liczby; OVER kładzie kopię drugiej liczby od góry; ROT przenosi trzecią liczbę od góry na wierzch (a b c → b c a, c było na wierzchu); ADD, SUB, MUL, DIV, MOD zdejmują b (wierzch), potem a, i kładą a + b, a − b, a · b, a / b albo a % b (dzielenie jak w C++); PRINT wypisuje wierzch w osobnym wierszu i go zdejmuje.',
                'Skoki i funkcje: JMP k przechodzi do linii k; JZ k zdejmuje wierzch i przechodzi do linii k, jeśli był zerem (w przeciwnym razie do następnej linii); CALL k kładzie na stos wywołań numer następnej linii i przechodzi do linii k; RET zdejmuje ze stosu wywołań numer linii i tam przechodzi; HALT kończy program.',
                'Błąd wykonania pojawia się, gdy polecenie potrzebuje więcej liczb, niż jest na stosie danych (POP, DUP, PRINT, JZ — jednej; SWAP, OVER i działania — dwóch; ROT — trzech), gdy DIV albo MOD dzieli przez zero i gdy RET trafia na pusty stos wywołań. Wtedy polecenie niczego nie zmienia, maszyna wypisuje BLAD w linii k (k to numer tej linii) i kończy pracę. Na sam koniec — zawsze — wypisz wiersz stos: i zawartość stosu danych od dna do wierzchu albo stos: pusty.'],
            input_format: ['W pierwszym wierszu liczba p.', 'W każdym z p kolejnych wierszy jedno polecenie (PUSH, JMP, JZ i CALL mają liczbę po spacji).'],
            output_format: ['Liczby wypisane przez PRINT (każda w osobnym wierszu), potem ewentualnie wiersz BLAD w linii k, a na końcu wiersz stos: … .'],
            constraints: ['1 ≤ p ≤ 1000', 'Przy PUSH jest |x| ≤ 10⁹, a przy JMP, JZ i CALL — 1 ≤ k ≤ p.', 'Każdy program kończy pracę po wykonaniu najwyżej 100 000 poleceń, wszystkie liczby na stosie mają wartość bezwzględną najwyżej 10¹⁸, PRINT wykona się najwyżej 1000 razy, a na końcu na stosie danych jest najwyżej 100 liczb.'],
            examples: [
                { input: '9\nPUSH 3\nDUP\nJZ 9\nDUP\nPRINT\nPUSH 1\nSUB\nJMP 2\nHALT', note: 'Odliczanie: wypisuje 3, 2, 1. Gdy licznik dojdzie do zera, JZ zdejmuje jego kopię i skacze do HALT — na stosie zostaje 0.' },
                { input: '15\nPUSH 5\nCALL 5\nPRINT\nHALT\nDUP\nJZ 13\nDUP\nPUSH 1\nSUB\nCALL 5\nMUL\nRET\nPOP\nPUSH 1\nRET', note: 'Rekurencyjna silnia: linie 5–15 to funkcja, która zamienia n na wierzchu w n!. CALL 5 w linii 10 woła ją dla n − 1, a stos wywołań pamięta, dokąd wrócić. Wynik 120.' },
                { input: '4\nPUSH 7\nPUSH 0\nDIV\nPRINT', note: 'Dzielenie przez zero w linii 3: polecenie niczego nie zmienia, więc na stosie zostają 7 i 0.' },
            ],
            hint: R`Program wczytaj do vector<string> op(p + 1) i vector<long long> arg(p + 1). Stos danych trzymaj w vector<long long> (OVER, ROT i wypisanie na końcu potrzebują środka), a stos wywołań w stack<int>. Pętla: while (pc >= 1 && pc <= p) { sprawdź błędy (rozmiar stosu, dzielenie przez zero, pusty stos wywołań) → wykonaj → pc = nastepna; }. ROT: long long a = s[s.size() - 3]; s.erase(s.end() - 3); s.push_back(a);.`,
            tests: (r) => {
                const prog = (lines) => `${lines.length}\n${lines.join('\n')}`;
                const odliczanie = (n) => [`PUSH ${n}`, 'DUP', 'JZ 9', 'DUP', 'PRINT', 'PUSH 1', 'SUB', 'JMP 2', 'HALT'];
                const silnia = (n) => ['PUSH 1', `PUSH ${n}`, 'DUP', 'JZ 12', 'SWAP', 'OVER', 'MUL', 'SWAP', 'PUSH 1', 'SUB', 'JMP 3', 'POP', 'PRINT', 'HALT'];
                const fib = (k) => [`PUSH ${k}`, 'PUSH 0', 'PUSH 1', 'ROT', 'DUP', 'JZ 17', 'PUSH 1', 'SUB', 'ROT', 'DUP', 'PRINT', 'ROT', 'DUP', 'ROT', 'ADD', 'JMP 4', 'HALT'];
                const nwd = (a, b) => [`PUSH ${a}`, `PUSH ${b}`, 'DUP', 'JZ 9', 'SWAP', 'OVER', 'MOD', 'JMP 3', 'POP', 'PRINT', 'HALT'];
                const silniaRek = (n) => [`PUSH ${n}`, 'CALL 5', 'PRINT', 'HALT', 'DUP', 'JZ 13', 'DUP', 'PUSH 1', 'SUB', 'CALL 5', 'MUL', 'RET', 'POP', 'PUSH 1', 'RET'];
                const sumaCyfr = (x) => [`PUSH ${x}`, 'PUSH 0', 'SWAP', 'DUP', 'JZ 15', 'DUP', 'PUSH 10', 'MOD', 'ROT', 'ADD', 'SWAP', 'PUSH 10', 'DIV', 'JMP 4', 'POP', 'PRINT'];
                // losowe programy: prowadzimy je przez interpreter i bierzemy tylko te, które kończą się w limitach
                const OPS = ['PUSH', 'PUSH', 'PUSH', 'POP', 'DUP', 'SWAP', 'OVER', 'ROT', 'ADD', 'SUB', 'MUL', 'DIV', 'MOD', 'PRINT', 'PRINT', 'JMP', 'JZ', 'JZ', 'CALL', 'RET', 'HALT'];
                const losowy = (p, skoki) => {
                    for (let proba = 0; proba < 2000; proba++) {
                        const L = [];
                        for (let i = 0; i < p; i++) {
                            let o = r.pick(OPS);
                            if (!skoki && ['JMP', 'JZ', 'CALL', 'RET'].includes(o)) o = 'PUSH';
                            if (o === 'PUSH') L.push(`PUSH ${r() < 0.8 ? r.int(-20, 20) : r.int(-1000000000, 1000000000)}`);
                            else if (['JMP', 'JZ', 'CALL'].includes(o)) L.push(`${o} ${r.int(1, p)}`);
                            else L.push(o);
                        }
                        const w = maszyna(L, 3000);
                        if (w.dobry && w.kroki >= Math.min(20, p)) return L;
                    }
                    return ['PUSH 1', 'PRINT'];
                };
                return [prog(['HALT']), prog(['PRINT']), prog(['PUSH 5', 'PUSH -3', 'SWAP', 'OVER', 'ROT']), prog(['RET']), prog(['PUSH 7', 'PUSH 0', 'MOD', 'PRINT']), prog(['PUSH 1', 'PUSH 2', 'ADD', 'ADD']),
                    prog(odliczanie(5)), prog(odliczanie(999)), prog(silnia(19)), prog(silnia(0)), prog(fib(85)), prog(nwd(1071, 462)), prog(nwd(832040, 514229)), prog(silniaRek(19)), prog(silniaRek(1)), prog(sumaCyfr(987654321)),
                    prog(['PUSH -7', 'PUSH 2', 'DIV', 'PUSH -7', 'PUSH 2', 'MOD', 'PUSH 7', 'PUSH -2', 'MOD']),
                    ...Array.from({ length: 6 }, () => prog(losowy(r.int(3, 15), false))), ...Array.from({ length: 10 }, () => prog(losowy(r.int(5, 40), true))), prog(losowy(200, true)), prog(losowy(1000, true))];
            },
            check: (inp) => {
                const L = linie(inp); const p = Number(L[0]);
                if (!calk(p, 1, 1000) || L.length !== p + 1) return 'p';
                for (const l of L.slice(1)) {
                    let m = l.match(/^PUSH (-?\d+)$/); if (m) { if (!calk(Number(m[1]), -1e9, 1e9)) return 'x'; continue; }
                    m = l.match(/^(JMP|JZ|CALL) (\d+)$/); if (m) { if (!calk(Number(m[2]), 1, p)) return 'k'; continue; }
                    if (!/^(POP|DUP|SWAP|OVER|ROT|ADD|SUB|MUL|DIV|MOD|PRINT|RET|HALT)$/.test(l)) return 'polecenie ' + l;
                }
                const w = maszyna(L.slice(1));
                return w.dobry ? null : 'limity: ' + w.powod;
            },
            solve: (inp) => { const w = maszyna(linie(inp).slice(1)); return [...w.wyjscie, ...(w.blad ? [`BLAD w linii ${w.blad}`] : []), 'stos:' + (w.stos.length ? ' ' + w.stos.join(' ') : ' pusty')].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int p;
    cin >> p;
    vector<string> op(p + 1);
    vector<long long> arg(p + 1, 0);
    for (int i = 1; i <= p; i++) {
        cin >> op[i];
        if (op[i] == "PUSH" || op[i] == "JMP" || op[i] == "JZ" || op[i] == "CALL") cin >> arg[i];
    }
    vector<long long> s;   // stos danych: back() to wierzch
    stack<int> wywolania;  // dokąd wrócić po RET
    int pc = 1, blad = 0;
    while (pc >= 1 && pc <= p) {
        string o = op[pc];
        int potrzeba = 0;
        if (o == "POP" || o == "DUP" || o == "PRINT" || o == "JZ") potrzeba = 1;
        else if (o == "SWAP" || o == "OVER" || o == "ADD" || o == "SUB" || o == "MUL" || o == "DIV" || o == "MOD") potrzeba = 2;
        else if (o == "ROT") potrzeba = 3;
        if ((int)s.size() < potrzeba || ((o == "DIV" || o == "MOD") && s.back() == 0) || (o == "RET" && wywolania.empty())) {
            blad = pc;
            break;
        }
        if (o == "HALT") break;
        int nastepna = pc + 1;
        if (o == "PUSH") {
            s.push_back(arg[pc]);
        } else if (o == "POP") {
            s.pop_back();
        } else if (o == "DUP") {
            s.push_back(s.back());
        } else if (o == "SWAP") {
            swap(s[s.size() - 1], s[s.size() - 2]);
        } else if (o == "OVER") {
            s.push_back(s[s.size() - 2]);
        } else if (o == "ROT") {
            long long a = s[s.size() - 3];
            s.erase(s.end() - 3);
            s.push_back(a);
        } else if (o == "PRINT") {
            cout << s.back() << "\n";
            s.pop_back();
        } else if (o == "JMP") {
            nastepna = arg[pc];
        } else if (o == "JZ") {
            long long v = s.back();
            s.pop_back();
            if (v == 0) nastepna = arg[pc];
        } else if (o == "CALL") {
            wywolania.push(pc + 1);
            nastepna = arg[pc];
        } else if (o == "RET") {
            nastepna = wywolania.top();
            wywolania.pop();
        } else {
            long long b = s.back();
            s.pop_back();
            long long a = s.back();
            s.pop_back();
            if (o == "ADD") s.push_back(a + b);
            else if (o == "SUB") s.push_back(a - b);
            else if (o == "MUL") s.push_back(a * b);
            else if (o == "DIV") s.push_back(a / b);
            else s.push_back(a % b);
        }
        pc = nastepna;
    }
    if (blad) cout << "BLAD w linii " << blad << "\n";
    cout << "stos:";
    if (s.empty()) cout << " pusty";
    for (long long x : s) cout << " " << x;
    cout << "\n";
    return 0;
}`,
        },
    ];
};
