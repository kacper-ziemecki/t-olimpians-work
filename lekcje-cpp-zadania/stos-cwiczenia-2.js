// Stos — ćwiczenia w trakcie lekcji, części 4–6: wyrażenia (odwrotna notacja polska, poprawność, stos napisów,
// notacja polska od końca, zamiana zwykłego zapisu na ONP i kalkulator z nawiasami), stos monotoniczny (najbliższy
// większy i mniejszy z obu stron, indeksy na stosie, liczby w kółku, kogo widać, skoki) oraz prostokąty i słupki
// (zasięg słupka, największy prostokąt, deszczówka, plakaty, plac na planszy, wkład elementu w podtablice).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./stos-pomoc');
    const { calk, czyOp, liczOnp, dobreDrzewo, losDrzewo, drzewoOnp, drzewoPrefiks, drzewoInfix, drzewoWartosc, naOnp, tokenyInfix, najblizszy, generuj, losGen, dobryGen, KOD_GEN, LIMIT } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const czyLiczbaT = (t) => /^\d+$/.test(t);

    // Wartość wyrażenia w zwykłym zapisie (przez ONP) albo null (dzielenie przez zero, za duże liczby).
    const wartoscInfix = (s, maks = LIMIT) => { const w = liczOnp(naOnp(s), maks); return w.ok ? w.v : null; };
    // Losowe wyrażenie w zwykłym zapisie: k działań, liczby z [lo, hi], czasem nadmiarowe nawiasy.
    // Drzewo jest liczalne (dobreDrzewo), a nawiasy zachowują jego kształt: prawy argument o tym samym albo niższym
    // priorytecie zawsze dostaje nawias, więc po ponownym wczytaniu działania wykonują się w tej samej kolejności.
    function losInfix(r, k, lo, hi, nadmiar = 0.15) {
        const d = dobreDrzewo(r, k, lo, hi);
        const pr = (o) => (o === '*' || o === '/' ? 2 : 1);
        const dodaj = (x) => {
            if (!x.op) return r() < nadmiar / 3 ? '(' + x.v + ')' : x.v;
            let l = dodaj(x.l), p = dodaj(x.p);
            if (x.l.op && (pr(x.l.op) < pr(x.op) || r() < nadmiar)) l = '(' + l + ')';
            if (x.p.op && (pr(x.p.op) <= pr(x.op) || r() < nadmiar)) p = '(' + p + ')';
            return l + x.op + p;
        };
        let s = dodaj(d);
        if (r() < nadmiar) s = '(' + s + ')';
        if (wartoscInfix(s) !== d.w) throw new Error('losInfix: zły kształt wyrażenia ' + s.slice(0, 80));
        return s;
    }
    const onpTxt = (tok) => `${tok.length}\n${tok.join(' ')}`;

    return [
        // ================================================================ KROK 4 · ONP i kalkulator
        {
            id: 'sto-onp-plus-minus', krok: 4, level: 'latwe',
            title: 'ONP z plusem i minusem',
            short: 'W odwrotnej notacji polskiej znak działania stoi za liczbami. Liczby kładź na stos, a znak zdejmuje dwie i odkłada wynik.',
            tags: ['ONP', 'token jako string', 'kolejność przy odejmowaniu'],
            statement: ['W odwrotnej notacji polskiej (ONP) znak działania zapisuje się za liczbami, na których działa: 3 4 + to 3 + 4, a 10 2 3 + - to 10 − (2 + 3). Nawiasy nie są potrzebne, a wyrażenie liczy się jednym przejściem od lewej ze stosem.',
                'Wczytaj wyrażenie w ONP z dodawaniem i odejmowaniem i policz jego wartość. Liczba trafia na stos. Znak + albo - zdejmuje ze stosu dwie liczby, wykonuje działanie i kładzie wynik z powrotem. Uważaj na kolejność: pierwsza zdjęta liczba (b) jest tą drugą w działaniu, więc liczysz a − b, a nie b − a. Na końcu na stosie zostaje jedna liczba — wynik.'],
            input_format: ['W pierwszym wierszu liczba n — ile jest elementów (liczb i znaków).', 'W drugim wierszu n elementów oddzielonych spacjami.'],
            output_format: ['Jedna liczba — wartość wyrażenia.'],
            constraints: ['1 ≤ n ≤ 1999', 'Liczby są całkowite, od 0 do 10⁶. Wyrażenie jest poprawne.'],
            examples: [{ input: '5\n10 2 3 + -', note: 'Na stosie: 10, 2, 3. Plus zdejmuje 3 i 2 i kładzie 5. Minus zdejmuje 5 (b) i 10 (a) — wynik 10 − 5 = 5.' },
                { input: '7\n8 5 - 1 - 100 +', note: 'Najpierw 8 − 5 = 3, potem 3 − 1 = 2, potem 2 + 100 = 102.' }],
            hint: R`stack<long long> s; string t; for (…) { cin >> t; if (t == "+" || t == "-") { long long b = s.top(); s.pop(); long long a = s.top(); s.pop(); s.push(t == "+" ? a + b : a - b); } else s.push(stoll(t)); }. stoll zamienia napis na liczbę long long.`,
            tests: (r) => {
                const gen = (k) => drzewoOnp(dobreDrzewo(r, k, 0, 1000000, ['+', '-']));
                return [onpTxt(['7']), onpTxt(['3', '4', '+']), onpTxt(['3', '4', '-']), onpTxt(['1', '2', '3', '4', '-', '-', '-']), onpTxt(gen(10)), onpTxt(gen(999)), onpTxt(gen(300)), onpTxt(gen(50))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 1999) || t.length !== n + 1) return 'n'; const tok = t.slice(1); if (!tok.every((x) => x === '+' || x === '-' || (czyLiczbaT(x) && Number(x) <= 1e6))) return 'token'; return liczOnp(tok).ok ? null : 'niepoprawne'; },
            solve: (inp) => String(liczOnp(toks(inp).slice(1)).v),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    stack<long long> s;
    for (int i = 0; i < n; i++) {
        string t;
        cin >> t;
        if (t == "+" || t == "-") {
            long long b = s.top();
            s.pop();
            long long a = s.top();
            s.pop();
            if (t == "+") s.push(a + b);
            else s.push(a - b);
        } else {
            s.push(stoll(t));
        }
    }
    cout << s.top() << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-onp', krok: 4, level: 'latwe',
            title: 'Kalkulator ONP',
            short: 'Cztery działania w odwrotnej notacji polskiej. Dzielenie jak w C++ (ucina część ułamkową), a liczby rosną — long long.',
            tags: ['ONP', 'cztery działania', 'long long'],
            statement: ['Policz wartość wyrażenia zapisanego w odwrotnej notacji polskiej z działaniami +, -, * i /. Na przykład 3 4 + 2 * to (3 + 4) · 2 = 14, a 3 4 2 * + to 3 + 4 · 2 = 11 — kolejność działań wynika z kolejności zapisu, bez nawiasów i bez priorytetów.',
                'Liczba trafia na stos, a znak działania zdejmuje dwie liczby (najpierw b, potem a), liczy a op b i kładzie wynik na stos. Dzielenie jest całkowite, dokładnie jak w C++: 7 / 2 = 3, a -7 / 2 = -3. Wszystkie wyniki po drodze mieszczą się w long long.'],
            input_format: ['W pierwszym wierszu liczba n — ile jest elementów.', 'W drugim wierszu n elementów: liczby i znaki + - * /.'],
            output_format: ['Jedna liczba — wartość wyrażenia.'],
            constraints: ['1 ≤ n ≤ 1999', 'Liczby są całkowite, od 0 do 10⁴.', 'Wyrażenie jest poprawne, nigdzie nie dzieli się przez zero, a każdy wynik po drodze ma wartość bezwzględną najwyżej 10¹⁸.'],
            examples: [{ input: '5\n3 4 + 2 *', note: 'Najpierw 3 + 4 = 7, potem 7 · 2 = 14.' }, { input: '9\n100 7 / 3 5 - * 1 -', note: '100 / 7 = 14 (część ułamkowa odpada), 3 − 5 = −2, 14 · (−2) = −28, −28 − 1 = −29.' }],
            hint: R`long long b = s.top(); s.pop(); long long a = s.top(); s.pop(); if (t == "+") s.push(a + b); else if (t == "-") s.push(a - b); else if (t == "*") s.push(a * b); else s.push(a / b);. Liczbę rozpoznasz po tym, że nie jest żadnym z czterech znaków — wtedy s.push(stoll(t)).`,
            tests: (r) => {
                const gen = (k, hi) => drzewoOnp(dobreDrzewo(r, k, 0, hi));
                return [onpTxt(['0']), onpTxt(['7', '2', '/']), onpTxt(['2', '7', '-', '2', '/']), onpTxt(['10000', '10000', '*', '10000', '*', '10000', '*']), onpTxt(gen(5, 20)), onpTxt(gen(40, 100)), onpTxt(gen(999, 10000)), onpTxt(gen(999, 9)), onpTxt(gen(200, 1000))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 1999) || t.length !== n + 1) return 'n'; const tok = t.slice(1); if (!tok.every((x) => czyOp(x) || (czyLiczbaT(x) && Number(x) <= 1e4))) return 'token'; return liczOnp(tok).ok ? null : 'niepoprawne'; },
            solve: (inp) => String(liczOnp(toks(inp).slice(1)).v),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    stack<long long> s;
    for (int i = 0; i < n; i++) {
        string t;
        cin >> t;
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            long long b = s.top();
            s.pop();
            long long a = s.top();
            s.pop();
            if (t == "+") s.push(a + b);
            else if (t == "-") s.push(a - b);
            else if (t == "*") s.push(a * b);
            else s.push(a / b);
        } else {
            s.push(stoll(t));
        }
    }
    cout << s.top() << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-onp-poprawnosc', krok: 4, level: 'srednie',
            title: 'Czy to w ogóle jest ONP?',
            short: 'Za mało liczb pod znakiem, za dużo liczb na końcu albo dzielenie przez zero — wtedy BLAD. W przeciwnym razie wartość.',
            tags: ['wykrywanie błędów', 'size() < 2', 'dokładnie jedna liczba na końcu'],
            statement: ['Dostajesz t wyrażeń, które mają być zapisane w odwrotnej notacji polskiej z działaniami +, -, * i /. Niektóre są jednak zepsute. Dla każdego wypisz jego wartość albo słowo BLAD.',
                'Wyrażenie jest błędne, jeśli: znak działania trafia na stos, na którym są mniej niż dwie liczby; po przejściu wszystkich elementów na stosie nie została dokładnie jedna liczba; albo trzeba podzielić przez zero. Dzielenie jest całkowite jak w C++. Uwaga: gdy błąd wyjdzie w połowie, przerwij liczenie tego wyrażenia, ale i tak wczytaj wszystkie jego elementy — inaczej następne wyrażenie zacznie się w złym miejscu.'],
            input_format: ['W pierwszym wierszu liczba t.', 'Każde wyrażenie zajmuje jeden wiersz: najpierw liczba k jego elementów, potem k elementów.'],
            output_format: ['t wierszy: wartość wyrażenia albo BLAD.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ k ≤ 300', 'Liczby są całkowite, od 0 do 100.', 'W każdym wyrażeniu (także zepsutym) wszystkie wyniki policzone przed błędem mają wartość bezwzględną najwyżej 10¹⁸.'],
            examples: [{ input: '4\n3 2 3 *\n2 5 +\n5 1 2 3 4 +\n3 8 0 /', note: '2 · 3 = 6. W 5 + znak trafia na stos z jedną liczbą. W 1 2 3 4 + na końcu zostają trzy liczby. 8 / 0 — dzielenie przez zero.' }],
            hint: R`Wczytaj najpierw wszystkie k elementów do vector<string>. Potem: bool ok = true; for (…) { if (znak) { if (s.size() < 2) { ok = false; break; } … if (t == "/" && b == 0) { ok = false; break; } } else s.push(stoll(t)); } if (ok && s.size() != 1) ok = false;. Stos twórz od nowa dla każdego wyrażenia.`,
            tests: (r) => {
                const zepsuj = (tok) => {
                    const a = tok.slice();
                    const co = r.int(0, 4);
                    if (co === 0 && a.length > 1) a.splice(r.int(0, a.length - 1), 1);
                    else if (co === 1) a.splice(r.int(0, a.length), 0, r() < 0.5 ? String(r.int(0, 100)) : r.pick(['+', '-', '*', '/']));
                    else if (co === 2) { const i = r.int(0, a.length - 1), j = r.int(0, a.length - 1); [a[i], a[j]] = [a[j], a[i]]; }
                    else if (co === 3) { a.push('0'); a.push('/'); }
                    else a.push(String(r.int(0, 100)));
                    return a;
                };
                const test = () => {
                    for (let p = 0; p < 100; p++) {
                        let tok = drzewoOnp(dobreDrzewo(r, r.int(0, 40), 0, 100));
                        if (r() < 0.55) tok = zepsuj(tok);
                        const w = liczOnp(tok);
                        if (tok.length <= 300 && tok.length >= 1 && !w.zaDuzo) return tok;
                    }
                    return ['1'];
                };
                const d = (ws) => `${ws.length}\n${ws.map((w) => `${w.length} ${w.join(' ')}`).join('\n')}`;
                return [d([['5']]), d([['+'], ['1', '2'], ['1', '2', '+', '+']]), d([['4', '0', '-', '0', '/'], ['0', '7', '/'], ['7', '7', '-', '7', '*']]), d(Array.from({ length: 100 }, test)), d(Array.from({ length: 30 }, test))];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]);
                if (!calk(t, 1, 100) || L.length !== t + 1) return 't';
                for (const l of L.slice(1)) { const x = toks(l); const k = Number(x[0]); if (!calk(k, 1, 300) || x.length !== k + 1) return 'k'; if (!x.slice(1).every((y) => czyOp(y) || (czyLiczbaT(y) && Number(y) <= 100))) return 'token'; if (liczOnp(x.slice(1)).zaDuzo) return 'zakres'; }
                return null;
            },
            solve: (inp) => linie(inp).slice(1).map((l) => { const w = liczOnp(toks(l).slice(1)); return w.ok ? String(w.v) : 'BLAD'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        int k;
        cin >> k;
        vector<string> el(k);
        for (int i = 0; i < k; i++) cin >> el[i];
        stack<long long> s;
        bool ok = true;
        for (string x : el) {
            if (x == "+" || x == "-" || x == "*" || x == "/") {
                if (s.size() < 2) {
                    ok = false;
                    break;
                }
                long long b = s.top();
                s.pop();
                long long a = s.top();
                s.pop();
                if (x == "/" && b == 0) {
                    ok = false;
                    break;
                }
                if (x == "+") s.push(a + b);
                else if (x == "-") s.push(a - b);
                else if (x == "*") s.push(a * b);
                else s.push(a / b);
            } else {
                s.push(stoll(x));
            }
        }
        if (ok && s.size() != 1) ok = false;
        if (ok) cout << s.top() << "\n";
        else cout << "BLAD\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-onp-na-nawiasy', krok: 4, level: 'srednie',
            title: 'Z ONP na nawiasy',
            short: 'Stos napisów: zmienna to napis, a znak działania skleja dwa napisy w (a+b). Na końcu na stosie leży całe wyrażenie z nawiasami.',
            tags: ['stack<string>', 'sklejanie napisów', 'pełne nawiasy'],
            statement: ['Wyrażenie w odwrotnej notacji polskiej zawiera zmienne (pojedyncze małe litery) i działania +, -, * i /. Zapisz je w zwykłej postaci, ale z pełnymi nawiasami: każde działanie razem ze swoimi argumentami zamknij w jedną parę nawiasów. Na przykład a b + c * zapisuje się jako ((a+b)*c).',
                'Użyj stosu napisów stack<string>. Zmienna trafia na stos jako napis z jedną literą. Znak działania zdejmuje dwa napisy — najpierw b, potem a — i kładzie na stos nowy napis "(" + a + znak + b + ")". Na końcu na stosie leży jeden napis: całe wyrażenie. Spacji nie wypisuj.'],
            input_format: ['W pierwszym wierszu liczba n — ile jest elementów.', 'W drugim wierszu n elementów: małe litery i znaki + - * /.'],
            output_format: ['Jeden wiersz: wyrażenie z pełnymi nawiasami, bez spacji.'],
            constraints: ['1 ≤ n ≤ 1999', 'Wyrażenie jest poprawne.'],
            examples: [{ input: '5\na b + c *', note: 'Plus skleja a i b w (a+b), a gwiazdka skleja (a+b) i c w ((a+b)*c).' }, { input: '7\nx y z * - w /', note: 'Najpierw (y*z), potem (x-(y*z)), na końcu ((x-(y*z))/w).' }],
            hint: R`stack<string> s; if (t jest znakiem) { string b = s.top(); s.pop(); string a = s.top(); s.pop(); s.push("(" + a + t + b + ")"); } else s.push(t);. Jedna litera bez działań to po prostu ta litera — bez nawiasów.`,
            tests: (r) => {
                const zm = 'abcdefghijklmnopqrstuvwxyz';
                const gen = (k) => { const d = losDrzewo(r, k, 0, 25); const zmien = (x) => (x.op ? { op: x.op, l: zmien(x.l), p: zmien(x.p) } : { v: zm[Number(x.v)] }); return drzewoOnp(zmien(d)); };
                return [onpTxt(['q']), onpTxt(['a', 'b', '/']), onpTxt(['a', 'b', 'c', 'd', '+', '+', '+']), onpTxt(['a', 'b', '+', 'c', '+', 'd', '+']), onpTxt(gen(8)), onpTxt(gen(999)), onpTxt(gen(60)), onpTxt(gen(300))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 1999) || t.length !== n + 1) return 'n'; let st = 0; for (const x of t.slice(1)) { if (czyOp(x)) { if (st < 2) return 'niepoprawne'; st--; } else if (/^[a-z]$/.test(x)) st++; else return 'token'; } return st === 1 ? null : 'niepoprawne'; },
            solve: (inp) => { const st = []; for (const x of toks(inp).slice(1)) { if (czyOp(x)) { const b = st.pop(), a = st.pop(); st.push(`(${a}${x}${b})`); } else st.push(x); } return st[0]; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    stack<string> s;
    for (int i = 0; i < n; i++) {
        string t;
        cin >> t;
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            string b = s.top();
            s.pop();
            string a = s.top();
            s.pop();
            s.push("(" + a + t + b + ")");
        } else {
            s.push(t);
        }
    }
    cout << s.top() << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-notacja-polska', krok: 4, level: 'srednie',
            title: 'Notacja polska od końca',
            short: 'W notacji polskiej znak stoi przed liczbami: * + 3 4 2. Czytaj od końca — wtedy działa ten sam stos co w ONP, tylko pierwsza zdjęta liczba jest lewa.',
            tags: ['notacja polska (prefiksowa)', 'przejście od końca', 'vector<string>'],
            statement: ['Notację polską wymyślił w 1924 roku polski logik Jan Łukasiewicz. Znak działania stoi w niej przed swoimi argumentami: + 3 4 to 3 + 4, a * + 3 4 2 to (3 + 4) · 2. Odwrotna notacja polska, którą znasz, to jej lustrzane odbicie.',
                'Policz wartość wyrażenia w notacji polskiej z działaniami +, -, * i /. Wczytaj wszystkie elementy do vector<string> i przechodź je od końca. Liczba trafia na stos. Znak działania zdejmuje dwie liczby — tym razem pierwsza zdjęta (a) jest lewym argumentem, a druga (b) prawym — i kładzie wynik a op b. Dzielenie jest całkowite jak w C++.'],
            input_format: ['W pierwszym wierszu liczba n — ile jest elementów.', 'W drugim wierszu n elementów: liczby i znaki + - * /.'],
            output_format: ['Jedna liczba — wartość wyrażenia.'],
            constraints: ['1 ≤ n ≤ 1999', 'Liczby są całkowite, od 0 do 10⁴.', 'Wyrażenie jest poprawne, nigdzie nie dzieli się przez zero, a każdy wynik po drodze ma wartość bezwzględną najwyżej 10¹⁸.'],
            examples: [{ input: '5\n* + 3 4 2', note: 'Od końca: na stos idą 2, 4 i 3. Plus zdejmuje 3 (lewy) i 4 (prawy) — 7. Gwiazdka zdejmuje 7 i 2 — 14.' }, { input: '5\n- 20 / 9 2', note: 'Od końca: 2, 9, potem 9 / 2 = 4, potem 20 i 20 − 4 = 16.' }],
            hint: R`vector<string> el(n); for (…) cin >> el[i]; for (int i = n - 1; i >= 0; i--) { if (znak) { long long a = s.top(); s.pop(); long long b = s.top(); s.pop(); s.push(a op b); } else s.push(stoll(el[i])); }. Porównaj z ONP: tam pierwsza zdjęta liczba była prawym argumentem.`,
            tests: (r) => {
                const gen = (k, hi) => drzewoPrefiks(dobreDrzewo(r, k, 0, hi));
                return [onpTxt(['42']), onpTxt(['-', '3', '10']), onpTxt(['/', '-', '1', '8', '3']), onpTxt(gen(6, 20)), onpTxt(gen(50, 100)), onpTxt(gen(999, 10000)), onpTxt(gen(999, 9)), onpTxt(gen(300, 1000))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 1999) || t.length !== n + 1) return 'n'; const tok = t.slice(1); if (!tok.every((x) => czyOp(x) || (czyLiczbaT(x) && Number(x) <= 1e4))) return 'token'; const st = []; for (let i = tok.length - 1; i >= 0; i--) { if (czyOp(tok[i])) { if (st.length < 2) return 'niepoprawne'; const a = st.pop(), b = st.pop(); if (tok[i] === '/' && b === 0n) return 'zero'; const v = P.dzialanie(a, b, tok[i]); if ((v < 0n ? -v : v) > LIMIT) return 'zakres'; st.push(v); } else st.push(BigInt(tok[i])); } return st.length === 1 ? null : 'niepoprawne'; },
            solve: (inp) => { const tok = toks(inp).slice(1); const st = []; for (let i = tok.length - 1; i >= 0; i--) { if (czyOp(tok[i])) { const a = st.pop(), b = st.pop(); st.push(P.dzialanie(a, b, tok[i])); } else st.push(BigInt(tok[i])); } return String(st[0]); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> el(n);
    for (int i = 0; i < n; i++) cin >> el[i];
    stack<long long> s;
    for (int i = n - 1; i >= 0; i--) {
        string t = el[i];
        if (t == "+" || t == "-" || t == "*" || t == "/") {
            long long a = s.top(); // lewy argument
            s.pop();
            long long b = s.top(); // prawy argument
            s.pop();
            if (t == "+") s.push(a + b);
            else if (t == "-") s.push(a - b);
            else if (t == "*") s.push(a * b);
            else s.push(a / b);
        } else {
            s.push(stoll(t));
        }
    }
    cout << s.top() << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-na-onp-bez-nawiasow', krok: 4, level: 'srednie',
            title: 'Na ONP: priorytety działań',
            short: 'Liczby od razu na wyjście, znaki czekają na stosie. Nowy znak najpierw wypycha ze stosu wszystkie o priorytecie większym albo równym.',
            tags: ['stos znaków', 'priorytet * / przed + -', 'liczby wielocyfrowe'],
            statement: ['Zamień zwykłe wyrażenie (bez nawiasów i bez spacji) z działaniami +, -, * i / na odwrotną notację polską. Mnożenie i dzielenie mają wyższy priorytet niż dodawanie i odejmowanie, a działania o równym priorytecie wykonuje się od lewej: 8-3-2 to (8 − 3) − 2.',
                'Algorytm: przechodź wyrażenie od lewej. Liczbę (może mieć kilka cyfr) od razu wypisz. Znak działania najpierw zdejmuje ze stosu znaków i wypisuje wszystkie znaki o priorytecie większym albo równym jego własnemu — one muszą wykonać się wcześniej — a dopiero potem sam trafia na stos. Na końcu wypisz wszystko, co zostało na stosie.'],
            input_format: ['Jeden wiersz: wyrażenie z cyfr i znaków + - * /, bez spacji i bez nawiasów.'],
            output_format: ['Jeden wiersz: to samo wyrażenie w ONP, elementy oddzielone spacjami.'],
            constraints: ['Wyrażenie ma od 1 do 10 000 znaków.', 'Liczby są całkowite, od 0 do 10⁴, bez zer na początku. Wyrażenie jest poprawne: zaczyna się i kończy liczbą, a znaki działań nie stoją obok siebie.'],
            examples: [{ input: '3+4*2', note: 'Gwiazdka ma wyższy priorytet niż plus, więc nie wypycha go ze stosu. Na końcu stos oddaje najpierw *, potem +.' }, { input: '8-3-2*5/10', note: 'Drugi minus wypycha pierwszy (równy priorytet — od lewej). Dzielenie wypycha mnożenie.' }],
            hint: R`int prio(char c) { return (c == '*' || c == '/') ? 2 : 1; }. Liczbę zbieraj cyfra po cyfrze: while (i < n && isdigit(s[i])) { liczba += s[i]; i++; }. Znak c: while (!st.empty() && prio(st.top()) >= prio(c)) { cout << st.top() << " "; st.pop(); } st.push(c);.`,
            tests: (r) => {
                const plaskie = (k, hi) => { let s = String(r.int(0, hi)); for (let i = 0; i < k; i++) s += r.pick(['+', '-', '*', '/']) + r.int(0, hi); return s; };
                const dlugie = (dl, hi) => { let s = String(r.int(0, hi)); while (true) { const t = r.pick(['+', '-', '*', '/']) + r.int(0, hi); if (s.length + t.length > dl) return s; s += t; } };
                return ['7', '1+2', '1*2', '8-3-2', '2*3+4*5', '1+2*3-4/2*7+1', plaskie(10, 99), dlugie(10000, 10000), dlugie(10000, 9), dlugie(3000, 100), plaskie(30, 10000)];
            },
            check: (inp) => (/^(0|[1-9]\d{0,4})([+\-*/](0|[1-9]\d{0,4}))*$/.test(inp) && inp.length <= 10000 && tokenyInfix(inp).filter((t) => /^\d/.test(t)).every((t) => Number(t) <= 1e4) ? null : 'dane'),
            solve: (inp) => naOnp(inp).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int prio(char c) {
    if (c == '*' || c == '/') return 2;
    return 1;
}
int main() {
    string s;
    cin >> s;
    int n = s.size();
    stack<char> st;
    int i = 0;
    while (i < n) {
        if (isdigit(s[i])) {
            string liczba;
            while (i < n && isdigit(s[i])) {
                liczba += s[i];
                i++;
            }
            cout << liczba << " ";
        } else {
            char c = s[i];
            while (!st.empty() && prio(st.top()) >= prio(c)) {
                cout << st.top() << " ";
                st.pop();
            }
            st.push(c);
            i++;
        }
    }
    while (!st.empty()) {
        cout << st.top() << " ";
        st.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-na-onp', krok: 4, level: 'srednie',
            title: 'Na ONP: nawiasy',
            short: 'Nawias otwierający idzie na stos i działa jak ściana: znaki zdejmujesz tylko do niego. Zamykający wypycha wszystko do swojego otwierającego.',
            tags: ['algorytm stacji rozrządowej', 'nawias jako ściana', 'stos znaków'],
            statement: ['Zamień zwykłe wyrażenie z nawiasami i działaniami +, -, * i / na odwrotną notację polską. W ONP nawiasów nie ma — kolejność działań wynika z kolejności zapisu.',
                'Rozszerz algorytm z poprzedniego zadania. Nawias ( połóż na stos — dla znaków działań jest ścianą: zdejmując znaki o wyższym albo równym priorytecie, zatrzymuj się na nim. Nawias ) zdejmuje i wypisuje wszystkie znaki aż do najbliższego (, a potem zdejmuje sam ( (nawiasów nie wypisujesz). Ten sposób wymyślił Edsger Dijkstra i nazwał go algorytmem stacji rozrządowej — znaki czekają na stosie jak wagony na bocznicy.'],
            input_format: ['Jeden wiersz: wyrażenie z cyfr, znaków + - * / i nawiasów, bez spacji.'],
            output_format: ['Jeden wiersz: to samo wyrażenie w ONP, elementy oddzielone spacjami.'],
            constraints: ['Wyrażenie ma od 1 do 10 000 znaków.', 'Liczby są całkowite, od 0 do 10⁴, bez zer na początku. Wyrażenie jest poprawne (nie ma minusa przed liczbą ani pustych nawiasów).'],
            examples: [{ input: '(3+4)*2', note: 'Plus czeka na stosie nad nawiasem. Zamykający nawias go wypycha. Dopiero potem przychodzi gwiazdka.' }, { input: '10-(2+3)*(8/(1+1))', note: 'Nawiasy w nawiasach działają tak samo — każdy ) sięga tylko do swojego (.' }],
            hint: R`Przy znaku działania: while (!st.empty() && st.top() != '(' && prio(st.top()) >= prio(c)) { wypisz st.top(); st.pop(); } st.push(c);. Przy ')': while (st.top() != '(') { wypisz; st.pop(); } st.pop();. Przy '(': st.push('(');.`,
            tests: (r) => ['5', '(5)', '((5))', '(1+2)', '1-(2-3)', '(3+4)*2', '2*(3+4)*5', '10-(2+3)*(8/(1+1))', losInfix(r, 6, 0, 99, 0.2), losInfix(r, 2500, 0, 9, 0.1), losInfix(r, 1300, 0, 10000, 0.05), losInfix(r, 300, 0, 100, 0.4), '('.repeat(2000) + '1' + ')'.repeat(2000)],
            check: (inp) => { if (inp.length > 10000 || !/^[0-9+\-*/()]+$/.test(inp)) return 'znaki'; const t = tokenyInfix(inp); if (t.some((x) => /^\d/.test(x) && (Number(x) > 1e4 || (x.length > 1 && x[0] === '0')))) return 'liczby'; try { return liczOnp(naOnp(inp), 10n ** 40n).ok || liczOnp(naOnp(inp), 10n ** 40n).blad === 'dzielenie przez zero' ? null : 'niepoprawne'; } catch (e) { return 'niepoprawne'; } },
            solve: (inp) => naOnp(inp).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int prio(char c) {
    if (c == '*' || c == '/') return 2;
    return 1;
}
int main() {
    string s;
    cin >> s;
    int n = s.size();
    stack<char> st;
    int i = 0;
    while (i < n) {
        char c = s[i];
        if (isdigit(c)) {
            string liczba;
            while (i < n && isdigit(s[i])) {
                liczba += s[i];
                i++;
            }
            cout << liczba << " ";
            continue;
        }
        if (c == '(') {
            st.push(c);
        } else if (c == ')') {
            while (st.top() != '(') {
                cout << st.top() << " ";
                st.pop();
            }
            st.pop();
        } else {
            while (!st.empty() && st.top() != '(' && prio(st.top()) >= prio(c)) {
                cout << st.top() << " ";
                st.pop();
            }
            st.push(c);
        }
        i++;
    }
    while (!st.empty()) {
        cout << st.top() << " ";
        st.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-kalkulator', krok: 4, level: 'trudne',
            title: 'Kalkulator z nawiasami',
            short: 'Dwa stosy naraz: liczby i znaki. Zamiast wypisywać znak jak w zamianie na ONP — od razu wykonaj go na dwóch liczbach z wierzchu.',
            tags: ['dwa stosy', 'funkcja wykonująca działanie', 'long long'],
            statement: ['Policz wartość t wyrażeń w zwykłym zapisie z nawiasami i działaniami +, -, * i /. Mnożenie i dzielenie mają wyższy priorytet, działania o równym priorytecie wykonuje się od lewej, a dzielenie jest całkowite jak w C++.',
                'Połącz dwa poznane algorytmy: zamianę na ONP i liczenie ONP. Trzymaj dwa stosy — stack<long long> na liczby i stack<char> na znaki. Robisz wszystko tak jak przy zamianie na ONP, tylko zamiast wypisywać zdjęty znak, od razu go wykonaj: zdejmij dwie liczby (najpierw b, potem a) i połóż wynik a op b na stos liczb. Na końcu na stosie liczb zostaje wynik.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jedno wyrażenie bez spacji.'],
            output_format: ['t wierszy — wartości wyrażeń.'],
            constraints: ['1 ≤ t ≤ 100', 'Każde wyrażenie ma od 1 do 2000 znaków, a wszystkie razem — najwyżej 50 000.', 'Liczby są całkowite, od 0 do 10⁴, bez zer na początku. Wyrażenia są poprawne, nigdzie nie dzieli się przez zero, a każdy wynik po drodze ma wartość bezwzględną najwyżej 10¹⁸.'],
            examples: [{ input: '4\n(3+4)*2\n3+4*2\n100/(7-2*2)/2\n2*(3-10)', note: '100 / (7 − 4) = 33 (całkowicie), a 33 / 2 = 16. W ostatnim wynik jest ujemny: 2 · (−7) = −14.' }],
            hint: R`void zwin(stack<long long> &liczby, stack<char> &znaki) { long long b = liczby.top(); liczby.pop(); long long a = liczby.top(); liczby.pop(); char op = znaki.top(); znaki.pop(); liczby.push(…); }. Wszędzie tam, gdzie przy zamianie na ONP wypisywałeś znak ze stosu, wywołaj zwin(liczby, znaki);.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['9']), d(['(9)', '1-2-3', '2*3/4', '7/2*2', '7/(2*2)']), d(['(3+4)*2', '3+4*2', '100/(7-2*2)/2', '2*(3-10)', '0*(5-7)/3']), d(Array.from({ length: 100 }, () => losInfix(r, r.int(1, 60), 0, 100, 0.2))), d([losInfix(r, 250, 0, 10000, 0.05), losInfix(r, 500, 0, 9, 0.1), losInfix(r, 300, 1, 50, 0.3)]), d(Array.from({ length: 20 }, () => losInfix(r, r.int(1, 8), 0, 20, 0.3)))];
            },
            check: (inp) => {
                const L = linie(inp); const t = Number(L[0]);
                if (!calk(t, 1, 100) || L.length !== t + 1 || L.slice(1).join('').length > 50000) return 't';
                for (const s of L.slice(1)) { if (s.length < 1 || s.length > 2000 || !/^[0-9+\-*/()]+$/.test(s)) return 'znaki'; if (tokenyInfix(s).some((x) => /^\d/.test(x) && (Number(x) > 1e4 || (x.length > 1 && x[0] === '0')))) return 'liczby'; if (wartoscInfix(s) === null) return 'wartosc'; }
                return null;
            },
            solve: (inp) => linie(inp).slice(1).map((s) => String(wartoscInfix(s))).join('\n'),
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
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        int n = s.size();
        stack<long long> liczby;
        stack<char> znaki;
        int i = 0;
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
        cout << liczby.top() << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 5 · stos monotoniczny
        {
            id: 'sto-nastepny-wiekszy', krok: 5, level: 'latwe',
            title: 'Następny większy',
            short: 'Idź od końca i trzymaj na stosie tylko kandydatów. Mniejsi albo równi bieżącej liczbie nikomu już nie pomogą — zdejmij ich, a na wierzchu zostaje odpowiedź.',
            tags: ['przejście od końca', 'wyrzucanie słabszych', 'O(n)'],
            statement: ['Dla każdej liczby w ciągu znajdź pierwszą liczbę stojącą na prawo od niej, która jest od niej większa. Jeśli takiej nie ma, odpowiedzią jest -1.',
                'Przechodź ciąg od końca i trzymaj na stosie kandydatów na odpowiedź. Gdy dochodzisz do liczby x, najpierw zdejmij ze stosu wszystkie liczby mniejsze albo równe x — nie są większe od x, a dla liczb stojących dalej na lewo x będzie zawsze lepsza (bliżej i nie mniejsza). Teraz na wierzchu leży odpowiedź dla x (albo stos jest pusty — wtedy -1). Na koniec połóż x na stos jako nowego kandydata.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n odpowiedzi oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 3000', 'Liczby są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '7\n4 2 7 3 3 9 1', note: 'Dla 4 pierwsza większa na prawo to 7. Dla obu trójek to 9 (równa trójka nie jest większa). Dla 9 i 1 nie ma niczego większego.' }],
            hint: R`for (int i = n - 1; i >= 0; i--) { while (!s.empty() && s.top() <= a[i]) s.pop(); w[i] = s.empty() ? -1 : s.top(); s.push(a[i]); }. Odpowiedzi zapisuj w vector<int> w(n) — wypisujesz je od lewej, a liczysz od prawej.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([5]), d([1, 2]), d([2, 1]), d([3, 3, 3]), d([1, 5, 2, 4, 3]), d(r.arr(20, 1, 10)), d(Array.from({ length: 3000 }, (_, i) => 3000 - i)), d(Array.from({ length: 3000 }, (_, i) => i + 1)), d(r.arr(3000, 1, 1000000)), d(r.arr(3000, 1, 5))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const j = najblizszy(a, +1, (x, y) => x > y); return Array.from(j, (k) => (k < 0 ? -1 : a[k])).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n), w(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    stack<int> s; // kandydaci na odpowiedź
    for (int i = n - 1; i >= 0; i--) {
        while (!s.empty() && s.top() <= a[i]) s.pop();
        w[i] = s.empty() ? -1 : s.top();
        s.push(a[i]);
    }
    for (int i = 0; i < n; i++) cout << w[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-cieplejszy-dzien', krok: 5, level: 'latwe',
            title: 'Ile dni do cieplejszego dnia?',
            short: 'Tym razem odpowiedzią jest odległość, więc na stosie leżą numery dni, a nie temperatury. Temperaturę odczytasz z t[s.top()].',
            tags: ['stos indeksów', 'odległość j − i', 'ostro większy'],
            statement: ['Dostajesz prognozę temperatur na n kolejnych dni. Dla każdego dnia policz, ile dni trzeba czekać na dzień ostro cieplejszy. Jeśli cieplejszy dzień już nie nadejdzie, wypisz 0.',
                'To ten sam schemat co w następnym większym elemencie, ale odpowiedzią jest odległość, a nie wartość. Dlatego na stos kładź numery dni (indeksy). Temperaturę dnia z wierzchu odczytasz jako t[s.top()], a odległość to s.top() − i.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n temperatur (liczby całkowite).'],
            output_format: ['Jeden wiersz: n liczb — ile dni czekać na cieplejszy dzień (albo 0).'],
            constraints: ['1 ≤ n ≤ 3000', 'Temperatury są z przedziału od −30 do 40.'],
            examples: [{ input: '8\n13 14 15 11 9 12 16 13', note: 'Po dniu z 15° cieplej jest dopiero za 4 dni (16°). Po ostatnim dniu nic już nie ma.' }],
            hint: R`stack<int> s; // numery dni. for (int i = n - 1; i >= 0; i--) { while (!s.empty() && t[s.top()] <= t[i]) s.pop(); w[i] = s.empty() ? 0 : s.top() - i; s.push(i); }.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([10]), d([-3, -2]), d([5, 5, 5, 5]), d([40, 30, 20, 10]), d(r.arr(15, -5, 5)), d(r.arr(3000, -30, 40)), d(Array.from({ length: 3000 }, (_, i) => 40 - Math.floor(i / 43))), d(Array.from({ length: 3000 }, (_, i) => (i % 70) - 30))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -30, 40)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const j = najblizszy(a, +1, (x, y) => x > y); return Array.from(j, (k, i) => (k < 0 ? 0 : k - i)).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> t(n), w(n);
    for (int i = 0; i < n; i++) cin >> t[i];
    stack<int> s; // numery dni
    for (int i = n - 1; i >= 0; i--) {
        while (!s.empty() && t[s.top()] <= t[i]) s.pop();
        w[i] = s.empty() ? 0 : s.top() - i;
        s.push(i);
    }
    for (int i = 0; i < n; i++) cout << w[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-poprzedni-mniejszy', krok: 5, level: 'latwe',
            title: 'Poprzedni mniejszy',
            short: 'Lustrzane odbicie: idziesz od lewej i szukasz mniejszego. Zdejmujesz więc tych, którzy są większi albo równi bieżącej liczbie.',
            tags: ['przejście od lewej', 'mniejszy zamiast większego', 'warunek w while'],
            statement: ['Dla każdej liczby w ciągu znajdź najbliższą liczbę stojącą na lewo od niej, która jest od niej ostro mniejsza. Jeśli takiej nie ma, odpowiedzią jest -1.',
                'Schemat jest ten sam co w następnym większym, tylko w lustrze: przechodź ciąg od lewej do prawej, a ze stosu zdejmuj liczby większe albo równe bieżącej — nie są mniejsze, a dla liczb dalej na prawo bieżąca będzie lepsza. Zmieniają się tylko dwie rzeczy: kierunek pętli i znak w warunku while.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n odpowiedzi oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 3000', 'Liczby są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '7\n5 2 8 6 6 9 1', note: 'Dla 8 najbliższa mniejsza na lewo to 2. Dla drugiej szóstki też 2 — pierwsza szóstka nie jest od niej mniejsza. Dla 1 nie ma niczego mniejszego.' }],
            hint: R`for (int i = 0; i < n; i++) { while (!s.empty() && s.top() >= a[i]) s.pop(); w[i] = s.empty() ? -1 : s.top(); s.push(a[i]); }. Stos ma teraz wartości rosnące od dna do wierzchu.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([5]), d([1, 2]), d([2, 1]), d([4, 4, 4]), d([3, 1, 4, 1, 5, 9, 2, 6]), d(r.arr(20, 1, 10)), d(Array.from({ length: 3000 }, (_, i) => 3000 - i)), d(Array.from({ length: 3000 }, (_, i) => i + 1)), d(r.arr(3000, 1, 1000000)), d(r.arr(3000, 1, 4))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const j = najblizszy(a, -1, (x, y) => x < y); return Array.from(j, (k) => (k < 0 ? -1 : a[k])).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n), w(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    stack<int> s;
    for (int i = 0; i < n; i++) {
        while (!s.empty() && s.top() >= a[i]) s.pop();
        w[i] = s.empty() ? -1 : s.top();
        s.push(a[i]);
    }
    for (int i = 0; i < n; i++) cout << w[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-rozpietosc-kursu', krok: 5, level: 'srednie',
            title: 'Rozpiętość kursu akcji',
            short: 'Ile dni z rzędu, kończąc na dzisiejszym, kurs był nie wyższy niż dziś? To odległość do poprzedniego dnia z wyższym kursem.',
            tags: ['poprzedni ostro większy', 'stos indeksów', 'gdy nie ma — od początku'],
            statement: ['Dostajesz kursy akcji z n kolejnych dni. Rozpiętość kursu w danym dniu to liczba kolejnych dni, kończąc na tym dniu i idąc wstecz, w których kurs był mniejszy albo równy kursowi z tego dnia. Sam dzień też się liczy, więc rozpiętość wynosi co najmniej 1.',
                'Wskazówka: rozpiętość kończy się tuż za najbliższym wcześniejszym dniem z kursem ostro wyższym. Jeśli ten dzień ma numer j, rozpiętość dnia i to i − j. Jeśli takiego dnia nie ma, rozpiętość sięga aż do pierwszego dnia i wynosi i + 1 (dni liczymy od 0). Szukaj więc poprzedniego ostro większego stosem z numerami dni.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n kursów (liczby całkowite).'],
            output_format: ['Jeden wiersz: n rozpiętości oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 3000', 'Kursy są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '7\n100 80 60 70 60 75 85', note: 'W dniu z kursem 75 wstecz idą 60, 70 i 60 — wszystkie nie wyższe — a 80 już jest wyższe: rozpiętość 4. Kurs 85 jest najwyższy od 100: rozpiętość 6.' }],
            hint: R`for (int i = 0; i < n; i++) { while (!s.empty() && c[s.top()] <= c[i]) s.pop(); w[i] = s.empty() ? i + 1 : i - s.top(); s.push(i); }. Zdejmujemy dni z kursem mniejszym albo równym — rozpiętość je obejmuje.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([7]), d([5, 5]), d([1, 2, 3]), d([3, 2, 1]), d(r.arr(20, 1, 10)), d(r.arr(3000, 1, 1000000)), d(Array.from({ length: 3000 }, (_, i) => i + 1)), d(r.arr(3000, 1, 3))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const j = najblizszy(a, -1, (x, y) => x > y); return Array.from(j, (k, i) => (k < 0 ? i + 1 : i - k)).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> c(n), w(n);
    for (int i = 0; i < n; i++) cin >> c[i];
    stack<int> s; // numery dni
    for (int i = 0; i < n; i++) {
        while (!s.empty() && c[s.top()] <= c[i]) s.pop();
        w[i] = s.empty() ? i + 1 : i - s.top();
        s.push(i);
    }
    for (int i = 0; i < n; i++) cout << w[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-najblizszy-wyzszy', krok: 5, level: 'srednie',
            title: 'Najbliższy wyższy budynek',
            short: 'Dwa przejścia stosem: najbliższy wyższy z lewej i z prawej. Odpowiedzią jest bliższy z nich.',
            tags: ['dwa przejścia', 'stos indeksów', 'min z dwóch odległości'],
            statement: ['Wzdłuż ulicy stoi n budynków o podanych wysokościach. Dla każdego budynku znajdź odległość do najbliższego budynku, który jest od niego ostro wyższy — może stać po lewej albo po prawej stronie. Odległość między budynkami o numerach i i j to |i − j|. Jeśli wyższego budynku nie ma, wypisz -1.',
                'Zrób dwa przejścia stosem z numerami budynków: od lewej (najbliższy wyższy z lewej) i od prawej (najbliższy wyższy z prawej). Dla każdego budynku wybierz bliższy z nich.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wysokości.'],
            output_format: ['Jeden wiersz: n odległości (albo -1) oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 3000', 'Wysokości są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '6\n3 7 2 4 7 1', note: 'Dla 4 wyższy z lewej (7) stoi o 2 dalej, a z prawej (7) — o 1: odpowiedź 1. Obie siódemki nie mają wyższego sąsiada.' }],
            hint: R`vector<int> lewy(n, -1), prawy(n, -1); — dwa razy ten sam schemat z warunkiem h[s.top()] <= h[i]. Potem dla każdego i: odległości i − lewy[i] i prawy[i] − i (tylko te, które istnieją), mniejsza z nich albo -1. Stos przed drugim przejściem trzeba opróżnić.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([4]), d([1, 2]), d([5, 5, 5]), d([1, 3, 2, 5, 4]), d(r.arr(20, 1, 10)), d(r.arr(3000, 1, 1000000)), d(Array.from({ length: 3000 }, (_, i) => Math.min(i + 1, 3000 - i))), d(r.arr(3000, 1, 3))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp).slice(1);
                const L = najblizszy(a, -1, (x, y) => x > y), Rr = najblizszy(a, +1, (x, y) => x > y);
                return a.map((_, i) => { const o = []; if (L[i] >= 0) o.push(i - L[i]); if (Rr[i] >= 0) o.push(Rr[i] - i); return o.length ? Math.min(...o) : -1; }).join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> h(n), lewy(n, -1), prawy(n, -1);
    for (int i = 0; i < n; i++) cin >> h[i];
    stack<int> s;
    for (int i = 0; i < n; i++) {
        while (!s.empty() && h[s.top()] <= h[i]) s.pop();
        if (!s.empty()) lewy[i] = s.top();
        s.push(i);
    }
    s = stack<int>();
    for (int i = n - 1; i >= 0; i--) {
        while (!s.empty() && h[s.top()] <= h[i]) s.pop();
        if (!s.empty()) prawy[i] = s.top();
        s.push(i);
    }
    for (int i = 0; i < n; i++) {
        int w = -1;
        if (lewy[i] != -1) w = i - lewy[i];
        if (prawy[i] != -1 && (w == -1 || prawy[i] - i < w)) w = prawy[i] - i;
        cout << w << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-nastepny-wiekszy-w-kolku', krok: 5, level: 'srednie',
            title: 'Następny większy w kółku',
            short: 'Liczby stoją w kółku, więc po ostatniej wraca pierwsza. Przejdź ciąg dwa razy (indeks i % n) — stos sam zapamięta kandydatów z „drugiego okrążenia”.',
            tags: ['tablica w kółku', 'dwa okrążenia', 'i % n'],
            statement: ['Liczby stoją w kółku: za ostatnią znowu jest pierwsza. Dla każdej liczby znajdź pierwszą liczbę większą od niej, idąc od niej w prawo (i dalej przez koniec na początek). Jeśli takiej nie ma — co zdarza się tylko największym liczbom — wypisz -1.',
                'Sztuczka: wyobraź sobie ciąg napisany dwa razy pod rząd i przejdź go od końca stosem, jak w zwykłym następnym większym — indeks i biegnie od 2n − 1 do 0, a liczbę bierzesz z a[i % n]. Odpowiedzi zapisuj tylko dla i < n. Pierwsze okrążenie (od końca) tylko napełnia stos kandydatami, które dla liczb z początku są „za końcem ciągu”.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n odpowiedzi oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 3000', 'Liczby są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '6\n5 3 9 2 4 1', note: 'Dla 4 następna większa to dopiero 5 — po przejściu przez koniec kółka (1, a potem 5 z początku). Dla 1 też 5. Dla 9 nie ma niczego większego.' }],
            hint: R`for (int i = 2 * n - 1; i >= 0; i--) { int x = a[i % n]; while (!s.empty() && s.top() <= x) s.pop(); if (i < n) w[i] = s.empty() ? -1 : s.top(); s.push(x); }.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([5]), d([1, 2]), d([2, 1]), d([7, 7, 7]), d([1, 2, 3, 4, 3, 2, 1]), d(r.arr(20, 1, 10)), d(Array.from({ length: 3000 }, (_, i) => i + 1)), d(Array.from({ length: 3000 }, (_, i) => 3000 - i)), d(r.arr(3000, 1, 1000000)), d(r.arr(3000, 1, 4))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const n = a.length; const j = najblizszy(a.concat(a), +1, (x, y) => x > y); return a.map((_, i) => (j[i] < 0 ? -1 : a[j[i] % n])).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n), w(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    stack<int> s;
    for (int i = 2 * n - 1; i >= 0; i--) {
        int x = a[i % n];
        while (!s.empty() && s.top() <= x) s.pop();
        if (i < n) w[i] = s.empty() ? -1 : s.top();
        s.push(x);
    }
    for (int i = 0; i < n; i++) cout << w[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-kogo-widac', krok: 5, level: 'srednie',
            title: 'Kogo widać w szeregu?',
            short: 'Osoba widzi każdego niższego, kogo zdejmuje ze stosu, i jeszcze pierwszego wyższego, który został na wierzchu. Wynik to liczba zdjętych plus jeden.',
            tags: ['liczenie zdejmowań', 'przejście od końca', 'różne wzrosty'],
            statement: ['W szeregu stoi n osób o różnych wzrostach i wszystkie patrzą w prawo. Osoba i widzi osobę j stojącą na prawo od niej, jeśli wszyscy, którzy stoją między nimi, są niżsi od obu tych osób. W szczególności każdy widzi swojego prawego sąsiada.',
                'Dla każdej osoby policz, ile osób widzi. Przejdź szereg od końca stosem: osoba i widzi każdego, kogo zdejmie ze stosu (niższych od siebie — nikt między nimi ich nie zasłaniał), a jeśli po zdejmowaniu stos nie jest pusty — jeszcze osobę z wierzchu, pierwszą wyższą od siebie. Dalej już nikogo nie zobaczy, bo zasłania ją ta wyższa osoba.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n różnych wzrostów.'],
            output_format: ['Jeden wiersz: n liczb — ile osób widzi każda osoba.'],
            constraints: ['1 ≤ n ≤ 3000', 'Wzrosty są różne, od 1 do 10⁶.'],
            examples: [{ input: '6\n10 6 8 5 11 9', note: 'Osoba 10 widzi 6, 8 (6 jest niższe od obu) i 11 — ale 5 zasłania jej 8, a 9 — osoba 11. Osoba 8 widzi 5 i 11.' }],
            hint: R`for (int i = n - 1; i >= 0; i--) { int ile = 0; while (!s.empty() && s.top() < h[i]) { s.pop(); ile++; } if (!s.empty()) ile++; w[i] = ile; s.push(h[i]); }.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const perm = (n, hi) => { const s = new Set(); while (s.size < n) s.add(r.int(1, hi)); return r.shuffle([...s]); };
                return [d([5]), d([1, 2]), d([2, 1]), d([1, 2, 3, 4]), d([4, 3, 2, 1]), d(perm(20, 50)), d(perm(3000, 1000000)), d(Array.from({ length: 3000 }, (_, i) => (i % 2 ? i + 1 : 6001 - i))), d(Array.from({ length: 3000 }, (_, i) => 3000 - i))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) && new Set(t.slice(1)).size === t[0] ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp).slice(1), n = a.length, w = new Array(n), st = [];
                for (let i = n - 1; i >= 0; i--) { let k = 0; while (st.length && st[st.length - 1] < a[i]) { st.pop(); k++; } if (st.length) k++; w[i] = k; st.push(a[i]); }
                return w.join(' ');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> h(n), w(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    stack<int> s;
    for (int i = n - 1; i >= 0; i--) {
        int ile = 0;
        while (!s.empty() && s.top() < h[i]) {
            s.pop();
            ile++;
        }
        if (!s.empty()) ile++;
        w[i] = ile;
        s.push(h[i]);
    }
    for (int i = 0; i < n; i++) cout << w[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-skoki-do-wiekszego', krok: 5, level: 'trudne',
            title: 'Skoki na wyższy kamień',
            short: 'Milion kamieni: żaba z każdego skacze na następny wyższy. Stos daje cel skoku, a liczbę skoków liczysz od końca: skoki[i] = skoki[cel] + 1.',
            tags: ['następny większy dla 10⁶', 'skoki od końca', 'long long'],
            statement: ['W rzece leży n kamieni o wysokościach x₀, x₁, …, xₙ₋₁. Żaba na kamieniu i zawsze skacze na najbliższy kamień na prawo, który jest od niego ostro wyższy. Gdy takiego nie ma, zatrzymuje się. Dla każdego kamienia startowego policz, ile skoków wykona żaba, i wypisz sumę tych liczb oraz największą z nich.',
                'Kamieni jest do miliona, więc wysokości nie są podane wprost — generujesz je wzorem z lekcji o złożoności: x₀ = s, xᵢ = (xᵢ₋₁ · a + b) mod m. Naiwne szukanie wyższego kamienia pętlą w pętli przy malejących wysokościach wykonałoby 5 · 10¹¹ kroków. Najpierw policz stosem, gdzie skacze żaba z każdego kamienia (cel[i] albo -1), a potem idź od końca: jeśli cel[i] = -1, to skoki[i] = 0, a w przeciwnym razie skoki[i] = skoki[cel[i]] + 1.'],
            input_format: ['Jeden wiersz: pięć liczb n s a b m.'],
            output_format: ['Dwa wiersze: suma: S oraz najwiecej: M.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁹, 0 ≤ s, a, b < m'],
            examples: [{ input: '6 3 7 2 10', note: 'Wysokości: 3, 3, 3, 3, 3, 3 — bo (3 · 7 + 2) mod 10 = 3. Żaden kamień nie jest wyższy, więc nikt nie skacze.' }, { input: '7 2 3 1 10', note: 'Wysokości: 2, 7, 2, 7, 2, 7, 2. Z każdej dwójki (oprócz ostatniej) żaba skacze raz na siódemkę. Suma 3, najwięcej 1.' }],
            hint: R`${KOD_GEN} Potem stos indeksów od końca: while (!s.empty() && x[s.top()] <= x[i]) s.pop(); cel[i] = s.empty() ? -1 : s.top(); s.push(i);. Skoki w tej samej pętli: skoki[i] = cel[i] == -1 ? 0 : skoki[cel[i]] + 1; — cel[i] > i, więc skoki[cel[i]] jest już policzone. Suma do 5 · 10¹¹ — long long.`,
            tests: (r) => ['1 5 0 0 10', '7 2 3 1 10', '10 1 1 1 1000', '10 9 1 9 10', '1000000 999999 1 999999 1000000', '1000000 0 1 1 1000000', '1000000 12345 21 7 1000000', `1000000 ${r.int(0, 999999936)} 48271 11 999999937`, `1000000 ${r.int(0, 99)} 1 17 100`, `${losGen(r, 3000, 1000)}`, `${losGen(r, 50, 10)}`],
            check: (inp) => (dobryGen(nums(inp), 0, 1e6, 1e9) && nums(inp).length === 5 ? null : 'dane'),
            solve: (inp) => {
                const [n, s, a, b, m] = nums(inp);
                const x = generuj(n, s, a, b, m);
                const cel = najblizszy(x, +1, (p, q) => p > q);
                const sk = new Int32Array(n);
                let suma = 0, maks = 0;
                for (let i = n - 1; i >= 0; i--) { sk[i] = cel[i] < 0 ? 0 : sk[cel[i]] + 1; suma += sk[i]; if (sk[i] > maks) maks = sk[i]; }
                return `suma: ${suma}\nnajwiecej: ${maks}`;
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
    vector<int> cel(n), skoki(n);
    stack<int> st;
    long long suma = 0;
    int najwiecej = 0;
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && x[st.top()] <= x[i]) st.pop();
        cel[i] = st.empty() ? -1 : st.top();
        st.push(i);
        skoki[i] = cel[i] == -1 ? 0 : skoki[cel[i]] + 1;
        suma += skoki[i];
        najwiecej = max(najwiecej, skoki[i]);
    }
    cout << "suma: " << suma << "\n";
    cout << "najwiecej: " << najwiecej << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 6 · prostokąty i słupki
        {
            id: 'sto-szerokosc-slupka', krok: 6, level: 'srednie',
            title: 'Jak szeroko sięga słupek?',
            short: 'Prostokąt o wysokości słupka sięga w lewo i w prawo do pierwszego niższego słupka. Dwa stosy: poprzedni mniejszy i następny mniejszy.',
            tags: ['poprzedni i następny mniejszy', 'szerokość R − L − 1', 'strażnicy -1 i n'],
            statement: ['Histogram to n słupków o szerokości 1, stojących obok siebie. Dla każdego słupka i policz, jak szeroki może być prostokąt o wysokości dokładnie takiej jak ten słupek, który zawiera słupek i i mieści się w histogramie. Taki prostokąt rozciąga się w lewo i w prawo, dopóki słupki nie są niższe od słupka i.',
                'Niech L to numer najbliższego słupka na lewo, który jest ostro niższy (albo -1, gdy takiego nie ma), a R — najbliższego ostro niższego na prawo (albo n). Szerokość prostokąta to R − L − 1. Policz L i R dwoma przejściami stosem z numerami słupków.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wysokości słupków.'],
            output_format: ['Jeden wiersz: n szerokości oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 3000', 'Wysokości są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '6\n2 1 5 6 2 3', note: 'Słupek 5 (numer 2) sięga od numeru 2 do 3 — z lewej stoi niższe 1, a z prawej niższe 2: szerokość 2. Słupek 1 sięga przez cały histogram: szerokość 6.' }],
            hint: R`vector<int> L(n), R(n);. Od lewej: while (!s.empty() && h[s.top()] >= h[i]) s.pop(); L[i] = s.empty() ? -1 : s.top(); s.push(i);. Od prawej to samo z R[i] = s.empty() ? n : s.top();. Wynik: R[i] - L[i] - 1.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([5]), d([1, 2]), d([2, 2]), d([3, 1, 3]), d(r.arr(20, 1, 10)), d(r.arr(3000, 1, 1000000)), d(Array.from({ length: 3000 }, (_, i) => i + 1)), d(r.arr(3000, 1, 3))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1), n = a.length; const L = najblizszy(a, -1, (x, y) => x < y), Rr = najblizszy(a, +1, (x, y) => x < y); return a.map((_, i) => (Rr[i] < 0 ? n : Rr[i]) - L[i] - 1).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> h(n), L(n), R(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    stack<int> s;
    for (int i = 0; i < n; i++) {
        while (!s.empty() && h[s.top()] >= h[i]) s.pop();
        L[i] = s.empty() ? -1 : s.top();
        s.push(i);
    }
    s = stack<int>();
    for (int i = n - 1; i >= 0; i--) {
        while (!s.empty() && h[s.top()] >= h[i]) s.pop();
        R[i] = s.empty() ? n : s.top();
        s.push(i);
    }
    for (int i = 0; i < n; i++) cout << R[i] - L[i] - 1 << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-najwiekszy-prostokat', krok: 6, level: 'srednie',
            title: 'Największy prostokąt w histogramie',
            short: 'Największy prostokąt ma wysokość któregoś słupka. Gdy słupek schodzi ze stosu, znamy już obie jego granice — liczymy pole od razu.',
            tags: ['pole przy zdejmowaniu', 'strażnik o wysokości 0', 'long long'],
            statement: ['Histogram to n słupków o szerokości 1 i podanych wysokościach. Znajdź pole największego prostokąta, który mieści się w histogramie (prostokąt ma boki poziome i pionowe i nie wystaje ponad słupki).',
                'Najwyższy taki prostokąt ma zawsze wysokość jakiegoś słupka i rozciąga się do pierwszych niższych słupków z obu stron. Można to policzyć jednym przejściem: trzymaj na stosie numery słupków o rosnących wysokościach. Gdy przychodzi słupek niższy albo równy temu z wierzchu, zdejmij wierzch — jego prawą granicą jest bieżący słupek, a lewą — nowy wierzch stosu. Pole to wysokość zdjętego słupka razy szerokość między granicami. Na końcu dołóż sztuczny słupek o wysokości 0, który zdejmie ze stosu wszystko.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wysokości słupków.'],
            output_format: ['Jedna liczba — pole największego prostokąta.'],
            constraints: ['1 ≤ n ≤ 8000', 'Wysokości są z przedziału od 0 do 10⁹.'],
            examples: [{ input: '6\n2 1 5 6 2 3', note: 'Słupki 5 i 6 mieszczą prostokąt 5 · 2 = 10. Niski słupek 1 daje tylko 1 · 6 = 6.' }, { input: '4\n4 4 4 4', note: 'Cały histogram: 4 · 4 = 16.' }],
            hint: R`vector<long long> h(n + 1, 0); — h[n] = 0 to strażnik. for (int i = 0; i <= n; i++) { while (!s.empty() && h[s.top()] >= h[i]) { long long wys = h[s.top()]; s.pop(); int lewy = s.empty() ? -1 : s.top(); naj = max(naj, wys * (i - lewy - 1)); } s.push(i); }. Pole do 8 · 10¹² — long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([0]), d([7]), d([2, 3]), d([3, 2]), d([4, 4, 4, 4]), d([1, 0, 1]), d(r.arr(20, 0, 10)), d(r.arr(8000, 0, 1000000000)), d(Array.from({ length: 8000 }, (_, i) => i + 1)), d(Array.from({ length: 8000 }, () => 1000000000)), d(r.arr(8000, 1, 5)), d(Array.from({ length: 8000 }, (_, i) => (i % 2 ? 1 : 1000000000)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 8000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e9)) ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp).slice(1), n = a.length;
                const L = najblizszy(a, -1, (x, y) => x < y), Rr = najblizszy(a, +1, (x, y) => x < y);
                let naj = 0;
                for (let i = 0; i < n; i++) naj = Math.max(naj, a[i] * ((Rr[i] < 0 ? n : Rr[i]) - L[i] - 1));
                return String(naj);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> h(n + 1, 0); // h[n] = 0 — strażnik
    for (int i = 0; i < n; i++) cin >> h[i];
    stack<int> s;
    long long naj = 0;
    for (int i = 0; i <= n; i++) {
        while (!s.empty() && h[s.top()] >= h[i]) {
            long long wys = h[s.top()];
            s.pop();
            int lewy = s.empty() ? -1 : s.top();
            naj = max(naj, wys * (i - lewy - 1));
        }
        s.push(i);
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-deszczowka', krok: 6, level: 'srednie',
            title: 'Deszczówka między słupkami',
            short: 'Woda zbiera się w dołkach. Stos trzyma lewe ścianki; gdy przychodzi wyższa ścianka, zdejmujesz dno i dolewasz warstwę wody o szerokości między ściankami.',
            tags: ['warstwy wody', 'dno i dwie ścianki', 'long long'],
            statement: ['Na płaskim terenie stoi n słupków o szerokości 1 i podanych wysokościach, ciasno jeden przy drugim. Pada deszcz. Woda zatrzymuje się nad słupkiem, jeśli zarówno po jego lewej, jak i po prawej stronie stoi coś wyższego — wtedy sięga do wysokości niższej z tych dwóch ścian. Woda spływa poza pierwszy i ostatni słupek. Policz, ile kratek wody się zbierze.',
                'Rozwiązanie stosem: trzymaj na stosie numery słupków o malejących wysokościach — to lewe ścianki dołków. Gdy przychodzi słupek wyższy od wierzchu, zdejmij wierzch: to dno dołka. Jeśli pod nim na stosie leży jeszcze coś, to jest lewa ścianka, a bieżący słupek — prawa. Między nimi zbiera się warstwa wody o wysokości min(lewa, prawa) − dno i szerokości prawa − lewa − 1. Powtarzaj, dopóki wierzch jest niższy od bieżącego słupka.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wysokości słupków.'],
            output_format: ['Jedna liczba — ile kratek wody się zbierze.'],
            constraints: ['1 ≤ n ≤ 10 000', 'Wysokości są z przedziału od 0 do 10⁶.'],
            examples: [{ input: '12\n0 1 0 2 1 0 1 3 2 1 2 1', note: 'Woda zbiera się w czterech miejscach: 1 kratka nad trzecim słupkiem, 4 kratki w dołku między słupkami 2 i 3 i 1 kratka między dwiema dwójkami po prawej — razem 6.' }],
            hint: R`while (!s.empty() && h[s.top()] < h[i]) { int dno = s.top(); s.pop(); if (s.empty()) break; int lewy = s.top(); woda += (min(h[lewy], h[i]) - h[dno]) * (long long)(i - lewy - 1); } s.push(i);. Wody może być nawet 10¹⁰ kratek — long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([5]), d([2, 0, 2]), d([3, 0, 0, 2, 0, 4]), d([1, 2, 3, 4]), d([4, 3, 2, 1]), d([5, 5, 1, 5, 5]), d(r.arr(20, 0, 9)), d(r.arr(10000, 0, 1000000)), d(Array.from({ length: 10000 }, (_, i) => (i === 0 || i === 9999 ? 1000000 : 0))), d(Array.from({ length: 10000 }, (_, i) => Math.abs(5000 - i) * 200)), d(r.arr(10000, 0, 3))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => {
                const a = nums(inp).slice(1), n = a.length;
                const lm = new Array(n), pm = new Array(n);
                for (let i = 0; i < n; i++) lm[i] = Math.max(a[i], i ? lm[i - 1] : 0);
                for (let i = n - 1; i >= 0; i--) pm[i] = Math.max(a[i], i < n - 1 ? pm[i + 1] : 0);
                let w = 0;
                for (let i = 0; i < n; i++) w += Math.min(lm[i], pm[i]) - a[i];
                return String(w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> h(n);
    for (int i = 0; i < n; i++) cin >> h[i];
    stack<int> s;
    long long woda = 0;
    for (int i = 0; i < n; i++) {
        while (!s.empty() && h[s.top()] < h[i]) {
            int dno = s.top();
            s.pop();
            if (s.empty()) break;
            int lewy = s.top();
            woda += (min(h[lewy], h[i]) - h[dno]) * (i - lewy - 1);
        }
        s.push(i);
    }
    cout << woda << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-plakatowanie', krok: 6, level: 'srednie',
            title: 'Plakaty na ścianie budynków',
            short: 'Szerokości nic nie zmieniają! Nowy plakat potrzebny jest wtedy, gdy po zdjęciu wyższych budynków na stosie nie ma budynku tej samej wysokości.',
            tags: ['stos rosnący', 'równe wysokości łączą się', 'pułapka z szerokościami'],
            statement: ['Wzdłuż ulicy stoi n budynków, ciasno jeden przy drugim. Każdy budynek to prostokąt o szerokości w i wysokości h, a ich fronty tworzą jedną ścianę. Chcemy zakleić całą ścianę plakatami. Plakat to prostokąt dowolnej wielkości, który nie może wystawać poza ścianę, a plakaty nie mogą na siebie zachodzić. Ile najmniej plakatów potrzeba?',
                'Wskazówka: przechodź budynki od lewej, trzymając na stosie wysokości o rosnących wartościach. Nowy budynek o wysokości h najpierw zdejmuje ze stosu wszystkie wyższe budynki (ich plakaty kończą się przed nim). Jeśli teraz na wierzchu leży budynek o wysokości dokładnie h, nowy budynek może dokończyć jego plakat — nic nie dokładamy. W przeciwnym razie potrzebny jest nowy plakat, a h trafia na stos. Zauważ, że szerokości w ogóle nie są potrzebne.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z n kolejnych wierszy dwie liczby: szerokość i wysokość budynku (od lewej).'],
            output_format: ['Jedna liczba — najmniejsza liczba plakatów.'],
            constraints: ['1 ≤ n ≤ 5000', 'Szerokości są z przedziału od 1 do 10⁶, a wysokości — od 1 do 10⁹.'],
            examples: [{ input: '5\n1 2\n1 3\n2 2\n2 5\n1 4', note: 'Plakat o wysokości 2 przez całą ulicę, mały plakat na czubek budynku o wysokości 3, plakat od 2 do 4 przez dwa ostatnie budynki i jeszcze jeden na czubek budynku o wysokości 5 — razem 4.' }],
            hint: R`stack<long long> s; int plakaty = 0; for (…) { cin >> w >> h; while (!s.empty() && s.top() > h) s.pop(); if (s.empty() || s.top() < h) { s.push(h); plakaty++; } }. Równa wysokość na wierzchu oznacza, że plakat z lewej da się przedłużyć — pod spodem są tylko wyższe budynki.`,
            tests: (r) => {
                const d = (hs) => `${hs.length}\n${hs.map((x) => `${r.int(1, 1000000)} ${x}`).join('\n')}`;
                return [d([7]), d([1, 1]), d([1, 2, 1]), d([2, 1, 2]), d([3, 1, 2, 1, 3]), d(r.arr(20, 1, 5)), d(r.arr(5000, 1, 1000000000)), d(r.arr(5000, 1, 10)), d(Array.from({ length: 5000 }, (_, i) => Math.min(i, 4999 - i) + 1)), d(Array.from({ length: 5000 }, (_, i) => (i % 2 ? 1 : 2)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 5000) && t.length === 2 * t[0] + 1 && t.slice(1).every((x, i) => calk(x, 1, i % 2 ? 1e9 : 1e6)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const st = []; let k = 0; for (let i = 0; i < t[0]; i++) { const hh = t[2 + 2 * i]; while (st.length && st[st.length - 1] > hh) st.pop(); if (!st.length || st[st.length - 1] < hh) { st.push(hh); k++; } } return String(k); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    stack<long long> s;
    int plakaty = 0;
    for (int i = 0; i < n; i++) {
        long long w, h;
        cin >> w >> h;
        while (!s.empty() && s.top() > h) s.pop();
        if (s.empty() || s.top() < h) {
            s.push(h);
            plakaty++;
        }
    }
    cout << plakaty << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-najwiekszy-plac', krok: 6, level: 'trudne',
            title: 'Największy wolny plac',
            short: 'Na planszy z drzewami szukasz największego prostokąta wolnych pól. Każdy wiersz to podstawa histogramu: słupek w kolumnie to liczba wolnych pól nad nim.',
            tags: ['plansza jako histogramy', 'wysokości kolumn', 'O(n · m)'],
            statement: ['Działka to plansza n × m: kropka oznacza wolne pole, a # — drzewo. Znajdź największy prostokąt złożony wyłącznie z wolnych pól (boki wzdłuż linii planszy) i wypisz jego pole. Jeśli wolnych pól nie ma, wypisz 0.',
                'Sztuczka: dla każdego wiersza wyobraź sobie histogram stojący na tym wierszu — słupek w kolumnie j ma wysokość równą liczbie wolnych pól, które ciągną się od tego wiersza w górę bez przerwy. Wysokości łatwo aktualizować wiersz po wierszu: przy wolnym polu słupek rośnie o 1, a przy drzewie spada do 0. Największy wolny prostokąt, którego dolny bok leży w tym wierszu, to największy prostokąt w tym histogramie — a ten liczysz stosem jak w poprzednim zadaniu.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z n kolejnych wierszy m znaków: . albo #.'],
            output_format: ['Jedna liczba — pole największego wolnego prostokąta.'],
            constraints: ['1 ≤ n, m ≤ 200'],
            examples: [{ input: '4 5\n.#...\n.....\n##...\n.#.#.', note: 'Trzy prawe kolumny w trzech pierwszych wierszach są wolne: 3 · 3 = 9. Cały drugi wiersz jest wolny, ale to tylko 5 pól.' }],
            hint: R`vector<int> wys(m + 1, 0); — wys[m] zostaje 0 jako strażnik. W każdym wierszu: for (j) wys[j] = (g[i][j] == '.') ? wys[j] + 1 : 0;, a potem największy prostokąt w histogramie wys stosem (ten sam kod co w „Największym prostokącie w histogramie”).`,
            tests: (r) => {
                const plansza = (n, m, p) => { const g = []; for (let i = 0; i < n; i++) { let s = ''; for (let j = 0; j < m; j++) s += r() < p ? '#' : '.'; g.push(s); } return `${n} ${m}\n${g.join('\n')}`; };
                return ['1 1\n.', '1 1\n#', '2 3\n...\n...', '3 3\n#.#\n...\n#.#', plansza(6, 8, 0.3), plansza(200, 200, 0.05), plansza(200, 200, 0.3), plansza(200, 200, 0.0), plansza(200, 200, 0.6), plansza(1, 200, 0.1), plansza(200, 1, 0.1), plansza(50, 120, 0.15)];
            },
            check: (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); return calk(n, 1, 200) && calk(m, 1, 200) && L.length === n + 1 && L.slice(1).every((s) => s.length === m && /^[.#]+$/.test(s)) ? null : 'dane'; },
            solve: (inp) => {
                const L = linie(inp); const [n, m] = L[0].split(' ').map(Number);
                const wys = new Array(m).fill(0); let naj = 0;
                for (let i = 1; i <= n; i++) {
                    for (let j = 0; j < m; j++) wys[j] = L[i][j] === '.' ? wys[j] + 1 : 0;
                    const Lr = najblizszy(wys, -1, (x, y) => x < y), Rr = najblizszy(wys, +1, (x, y) => x < y);
                    for (let j = 0; j < m; j++) naj = Math.max(naj, wys[j] * ((Rr[j] < 0 ? m : Rr[j]) - Lr[j] - 1));
                }
                return String(naj);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (int i = 0; i < n; i++) cin >> g[i];
    vector<int> wys(m + 1, 0); // wys[m] = 0 — strażnik
    int naj = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) wys[j] = (g[i][j] == '.') ? wys[j] + 1 : 0;
        stack<int> s;
        for (int j = 0; j <= m; j++) {
            while (!s.empty() && wys[s.top()] >= wys[j]) {
                int h = wys[s.top()];
                s.pop();
                int lewy = s.empty() ? -1 : s.top();
                naj = max(naj, h * (j - lewy - 1));
            }
            s.push(j);
        }
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-ile-razy-maksimum', krok: 6, level: 'srednie',
            title: 'W ilu fragmentach jestem maksimum?',
            short: 'Fragment, w którym a[i] jest maksimum, zaczyna się za poprzednim większym-lub-równym i kończy przed następnym większym. Takich fragmentów jest (i − L) · (R − i).',
            tags: ['wkład elementu', 'remisy: >= z lewej, > z prawej', 'iloczyn możliwości'],
            statement: ['Fragment ciągu to kilka kolejnych liczb (co najmniej jedna). Każdy fragment ma swoje maksimum, a jeśli największa liczba występuje w nim kilka razy, za maksimum uznajemy jej pierwsze (najbardziej lewe) wystąpienie. Dla każdej pozycji i policz, w ilu fragmentach liczba a[i] jest maksimum.',
                'Niech L to najbliższa pozycja na lewo od i z liczbą większą albo równą a[i] (albo -1), a R — najbliższa pozycja na prawo z liczbą ostro większą (albo n). Fragment, w którym a[i] jest maksimum, może zaczynać się na dowolnej pozycji od L + 1 do i i kończyć na dowolnej od i do R − 1, więc takich fragmentów jest (i − L) · (R − i). Zwróć uwagę na remisy: z lewej równa liczba przerywa (bo to ona byłaby pierwszym maksimum), a z prawej — nie. Sprawdzian: suma wszystkich odpowiedzi to liczba wszystkich fragmentów, n · (n + 1) / 2.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb — w ilu fragmentach a[i] jest maksimum.'],
            constraints: ['1 ≤ n ≤ 3000', 'Liczby są z przedziału od 1 do 10⁶.'],
            examples: [{ input: '4\n3 1 3 2', note: 'Pierwsza trójka jest maksimum w 4 fragmentach: [3], [3 1], [3 1 3], [3 1 3 2] — w dwóch ostatnich druga trójka przegrywa, bo stoi dalej. Druga trójka: [1 3], [3], [1 3 2], [3 2]. Razem z jedynką i dwójką: 4 + 1 + 4 + 1 = 10 = 4 · 5 / 2.' }],
            hint: R`L: while (!s.empty() && a[s.top()] < a[i]) s.pop(); — zostaje pierwszy większy-lub-równy. R (od prawej): while (!s.empty() && a[s.top()] <= a[i]) s.pop(); — zostaje pierwszy ostro większy. Wynik (long long)(i - L[i]) * (R[i] - i).`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([5]), d([2, 2]), d([1, 2, 3]), d([3, 2, 1]), d([2, 2, 2, 2]), d(r.arr(20, 1, 5)), d(r.arr(3000, 1, 1000000)), d(r.arr(3000, 1, 3)), d(Array.from({ length: 3000 }, (_, i) => i + 1)), d(Array.from({ length: 3000 }, () => 7))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1), n = a.length; const L = najblizszy(a, -1, (x, y) => x >= y), Rr = najblizszy(a, +1, (x, y) => x > y); return a.map((_, i) => (i - L[i]) * ((Rr[i] < 0 ? n : Rr[i]) - i)).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n), L(n), R(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    stack<int> s;
    for (int i = 0; i < n; i++) {
        while (!s.empty() && a[s.top()] < a[i]) s.pop();
        L[i] = s.empty() ? -1 : s.top(); // pierwszy większy albo równy z lewej
        s.push(i);
    }
    s = stack<int>();
    for (int i = n - 1; i >= 0; i--) {
        while (!s.empty() && a[s.top()] <= a[i]) s.pop();
        R[i] = s.empty() ? n : s.top(); // pierwszy ostro większy z prawej
        s.push(i);
    }
    for (int i = 0; i < n; i++) cout << (long long)(i - L[i]) * (R[i] - i) << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-suma-minimow', krok: 6, level: 'trudne',
            title: 'Suma minimów wszystkich fragmentów',
            short: 'Fragmentów jest pół biliona, ale każda liczba jest minimum w (i − L) · (R − i) z nich. Dodaj jej wkład: liczba razy liczba fragmentów.',
            tags: ['wkład elementu', 'remisy bez podwójnego liczenia', 'generator i 10⁶ liczb'],
            statement: ['Dla ciągu n liczb policz sumę minimów wszystkich jego fragmentów (kawałków z kolejnych liczb). Fragmentów jest n · (n + 1) / 2 — przy milionie liczb to pół biliona, więc przeglądanie ich odpada.',
                'Odwróć pytanie: w ilu fragmentach liczba x[i] jest minimum? Jak w poprzednim zadaniu: niech L to najbliższa pozycja na lewo z liczbą ostro mniejszą, a R — najbliższa na prawo z liczbą mniejszą albo równą. Wtedy x[i] jest minimum (jego najbardziej lewym wystąpieniem) w (i − L) · (R − i) fragmentach i do sumy dokłada x[i] · (i − L) · (R − i). Liczby generujesz wzorem z lekcji o złożoności: x₀ = s, xᵢ = (xᵢ₋₁ · a + b) mod m.'],
            input_format: ['Jeden wiersz: pięć liczb n s a b m.'],
            output_format: ['Jedna liczba — suma minimów wszystkich fragmentów.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁶, 0 ≤ s, a, b < m', 'Wynik mieści się w long long.'],
            examples: [{ input: '4 3 1 1 5', note: 'Liczby: 3, 4, 0, 1. Minima fragmentów zaczynających się od 3: 3, 3, 0, 0; od 4: 4, 0, 0; od 0: 0, 0; od 1: 1. Suma 11.' }],
            hint: R`${KOD_GEN} L: zdejmuj, dopóki x[s.top()] >= x[i]; R (od prawej): zdejmuj, dopóki x[s.top()] > x[i]. Wkład: x[i] * (i - L[i]) * (R[i] - i) — wszystko w long long (to nawet 2,5 · 10¹⁷).`,
            tests: (r) => ['1 5 0 0 10', '4 3 1 1 5', '6 2 3 1 10', '10 4 0 4 10', '1000000 999999 1 999999 1000000', '1000000 0 1 1 1000000', '1000000 12345 21 7 1000000', `1000000 ${r.int(0, 999982)} 48271 11 999983`, `1000000 ${r.int(0, 9)} 1 3 10`, `${losGen(r, 3000, 1000)}`, '1000000 999999 0 999999 1000000'],
            check: (inp) => (nums(inp).length === 5 && dobryGen(nums(inp), 0, 1e6, 1e6) ? null : 'dane'),
            solve: (inp) => {
                const [n, s, a, b, m] = nums(inp);
                const x = generuj(n, s, a, b, m);
                const L = najblizszy(x, -1, (p, q) => p < q), Rr = najblizszy(x, +1, (p, q) => p <= q);
                let suma = 0n;
                for (let i = 0; i < n; i++) suma += BigInt(x[i]) * BigInt((i - L[i]) * ((Rr[i] < 0 ? n : Rr[i]) - i));
                return String(suma);
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
        L[i] = st.empty() ? -1 : st.top(); // ostro mniejszy z lewej
        st.push(i);
    }
    st = stack<int>();
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && x[st.top()] > x[i]) st.pop();
        R[i] = st.empty() ? n : st.top(); // mniejszy albo równy z prawej
        st.push(i);
    }
    long long suma = 0;
    for (int i = 0; i < n; i++) suma += x[i] * (i - L[i]) * (R[i] - i);
    cout << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-suma-rozpietosci', krok: 6, level: 'trudne',
            title: 'Suma rozpiętości fragmentów',
            short: 'Rozpiętość fragmentu to maksimum minus minimum. Suma rozpiętości to suma maksimów minus suma minimów — dwa razy ta sama sztuczka.',
            tags: ['suma maksimów − suma minimów', 'cztery przejścia stosem', 'long long'],
            statement: ['Rozpiętość fragmentu ciągu to różnica między jego największą a najmniejszą liczbą. Policz sumę rozpiętości wszystkich fragmentów ciągu n liczb.',
                'Suma rozpiętości to suma maksimów wszystkich fragmentów minus suma ich minimów. Sumę minimów już umiesz policzyć (poprzednie zadanie), a sumę maksimów liczysz tak samo, odwracając znaki w warunkach — tak jak w zadaniu „W ilu fragmentach jestem maksimum?”. Liczby generujesz wzorem x₀ = s, xᵢ = (xᵢ₋₁ · a + b) mod m.'],
            input_format: ['Jeden wiersz: pięć liczb n s a b m.'],
            output_format: ['Jedna liczba — suma rozpiętości wszystkich fragmentów.'],
            constraints: ['1 ≤ n ≤ 10⁶', '1 ≤ m ≤ 10⁶, 0 ≤ s, a, b < m', 'Wynik mieści się w long long.'],
            examples: [{ input: '4 3 1 1 5', note: 'Liczby: 3, 4, 0, 1. Na przykład fragment 3 4 0 ma rozpiętość 4 − 0 = 4, a pojedyncze liczby — 0. Suma maksimów wynosi 29, a suma minimów 11, więc wynik to 18.' }],
            hint: R`${KOD_GEN} Napisz funkcję, która liczy sumę maksimów (warunki < i <=), i drugą — sumę minimów (warunki >= i >). Wynik: sumaMaks - sumaMin. Każda suma do 5 · 10¹⁷ — long long.`,
            tests: (r) => ['1 5 0 0 10', '4 3 1 1 5', '6 2 3 1 10', '10 4 0 4 10', '1000000 999999 1 999999 1000000', '1000000 0 1 1 1000000', '1000000 12345 21 7 1000000', `1000000 ${r.int(0, 999982)} 48271 11 999983`, `1000000 ${r.int(0, 9)} 1 3 10`, `${losGen(r, 3000, 1000)}`],
            check: (inp) => (nums(inp).length === 5 && dobryGen(nums(inp), 0, 1e6, 1e6) ? null : 'dane'),
            solve: (inp) => {
                const [n, s, a, b, m] = nums(inp);
                const x = generuj(n, s, a, b, m);
                const suma = (lewy, prawy) => {
                    const L = najblizszy(x, -1, lewy), Rr = najblizszy(x, +1, prawy);
                    let w = 0n;
                    for (let i = 0; i < n; i++) w += BigInt(x[i]) * BigInt((i - L[i]) * ((Rr[i] < 0 ? n : Rr[i]) - i));
                    return w;
                };
                return String(suma((p, q) => p >= q, (p, q) => p > q) - suma((p, q) => p < q, (p, q) => p <= q));
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
vector<long long> x;
long long sumaMaks(int n) {
    vector<int> L(n), R(n);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && x[st.top()] < x[i]) st.pop();
        L[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }
    st = stack<int>();
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && x[st.top()] <= x[i]) st.pop();
        R[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    long long w = 0;
    for (int i = 0; i < n; i++) w += x[i] * (i - L[i]) * (R[i] - i);
    return w;
}
long long sumaMin(int n) {
    vector<int> L(n), R(n);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        while (!st.empty() && x[st.top()] >= x[i]) st.pop();
        L[i] = st.empty() ? -1 : st.top();
        st.push(i);
    }
    st = stack<int>();
    for (int i = n - 1; i >= 0; i--) {
        while (!st.empty() && x[st.top()] > x[i]) st.pop();
        R[i] = st.empty() ? n : st.top();
        st.push(i);
    }
    long long w = 0;
    for (int i = 0; i < n; i++) w += x[i] * (i - L[i]) * (R[i] - i);
    return w;
}
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    x.assign(n, 0);
    x[0] = s;
    for (int i = 1; i < n; i++) x[i] = (x[i - 1] * a + b) % m;
    cout << sumaMaks(n) - sumaMin(n) << "\n";
    return 0;
}`,
        },
    ];
};
