// Bitset — ćwiczenia w trakcie lekcji, części 4–6: działania na dwóch bitsetach (& | ^ ~ jako część wspólna, suma, różnica
// symetryczna i dopełnienie, podzbiory, &= |= ^= na wielu zbiorach, odległość Hamminga, pary osób), przesunięcia całego bitsetu
// (<< i >>, sąsiedzi, odstęp k, rozlewanie się z maską n jedynek, obrót, reguła 90, skoki, sumy par) oraz sito Eratostenesa
// (pytania o pierwszość, liczenie do 10⁸, sumy prefiksowe, bliźniacze, Goldbach, najbliższa i k-ta liczba pierwsza).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./bitset-pomoc');
    const { calk, rozne, los01, sito, pierwszeDo } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const L = (inp) => inp.split('\n');
    const lista = (a) => `${a.length}\n${a.join(' ')}`;
    const listaW = (a) => `${a.length}${a.length ? ' ' + a.join(' ') : ''}`;
    const wiersze = (a) => `${a.length}\n${a.join('\n')}`;
    const zbior = (a) => new Set(a);
    // Czyta kolejne listy „k a1 … ak” z tablicy liczb od pozycji i.
    const czytajListy = (t, i, ile) => { const w = []; for (let j = 0; j < ile; j++) { const k = t[i++]; w.push(t.slice(i, i + k)); i += k; } return { w, i }; };

    return [
        // ================================================================ KROK 4 · dwa bitsety
        {
            id: 'bs-wspolne-elementy', krok: 4, level: 'latwe',
            title: 'Wspólne elementy',
            short: 'Zaznacz liczby z obu list w dwóch bitsetach. a & b to część wspólna: jej count() i jej zapalone bity odpowiadają na całe pytanie.',
            tags: ['a & b', 'część wspólna', '(a & b).count()'],
            statement: ['Dwie listy liczb z zakresu od 0 do 999 (liczby mogą się powtarzać). Wypisz, ile różnych liczb występuje na obu listach, a w drugim wierszu te liczby rosnąco.',
                'Zaznacz pierwszą listę w bitsecie a, drugą — w bitsecie b. Bitset c = a & b ma zapalone dokładnie te bity, które świecą w obu — to część wspólna.'],
            input_format: ['W pierwszym wierszu liczba n, a w drugim n liczb pierwszej listy.', 'W trzecim wierszu liczba m, a w czwartym m liczb drugiej listy.'],
            output_format: ['W pierwszym wierszu liczba wspólnych liczb.', 'W drugim wierszu wspólne liczby rosnąco (gdy ich nie ma — pusty wiersz).'],
            constraints: ['1 ≤ n, m ≤ 1000', '0 ≤ każda liczba ≤ 999'],
            examples: [{ input: '5\n3 7 3 500 12\n4\n12 999 3 4', note: 'Na obu listach są 3 i 12. Trójka występuje na pierwszej liście dwa razy, ale liczymy różne liczby.' },
                { input: '2\n1 2\n2\n3 4', note: 'Listy nie mają nic wspólnego.' }],
            hint: R`bitset<1000> a, b; zaznacz obie listy, potem bitset<1000> c = a & b; cout << c.count() << "\n"; i pętla for (int x = 0; x < 1000; x++) if (c[x]) cout << x << " ";.`,
            tests: (r) => [`5\n3 7 3 500 12\n4\n12 999 3 4`, `2\n1 2\n2\n3 4`, `1\n0\n1\n0`, `1000\n${r.arr(1000, 0, 999).join(' ')}\n1000\n${r.arr(1000, 0, 999).join(' ')}`, `1000\n${r.arr(1000, 0, 99).join(' ')}\n500\n${r.arr(500, 50, 150).join(' ')}`, `300\n${r.arr(300, 0, 999).join(' ')}\n300\n${r.arr(300, 0, 999).join(' ')}`, `${lista(Array.from({ length: 1000 }, (_, i) => i))}\n${lista(r.shuffle(Array.from({ length: 1000 }, (_, i) => i)))}`],
            check: (inp) => { const t = nums(inp); const n = t[0], m = t[n + 1]; return calk(n, 1, 1000) && calk(m, 1, 1000) && t.length === n + m + 2 && t.every((x, i) => i === 0 || i === n + 1 || calk(x, 0, 999)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const A = zbior(t.slice(1, n + 1)), Bz = zbior(t.slice(n + 2)); const w = [...A].filter((x) => Bz.has(x)).sort((x, y) => x - y); return `${w.length}\n${w.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    bitset<1000> a, b;
    int n, m, x;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> x;
        a[x] = 1;
    }
    cin >> m;
    for (int i = 0; i < m; i++) {
        cin >> x;
        b[x] = 1;
    }
    bitset<1000> c = a & b;
    cout << c.count() << "\n";
    for (int y = 0; y < 1000; y++) {
        if (c[y]) cout << y << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-suma-i-roznica', krok: 4, level: 'latwe',
            title: 'Suma, różnice i XOR',
            short: 'Cztery pytania o dwa zbiory, cztery wyrażenia: (a | b), (a & ~b), (b & ~a) i (a ^ b) — a od każdego count().',
            tags: ['a | b', 'a & ~b', 'a ^ b'],
            statement: ['Dwie listy liczb z zakresu od 0 do 999 to dwa zbiory A i B (powtórzenia się nie liczą). Wypisz cztery liczby:',
                'ile liczb jest choć w jednym zbiorze (suma: a | b), ile jest w A, ale nie w B (różnica: a & ~b), ile jest w B, ale nie w A (b & ~a), ile jest w dokładnie jednym ze zbiorów (różnica symetryczna: a ^ b).'],
            input_format: ['W pierwszym wierszu liczba n, a w drugim n liczb zbioru A.', 'W trzecim wierszu liczba m, a w czwartym m liczb zbioru B.'],
            output_format: ['Jeden wiersz: cztery liczby oddzielone spacjami.'],
            constraints: ['1 ≤ n, m ≤ 1000', '0 ≤ każda liczba ≤ 999'],
            examples: [{ input: '4\n1 2 3 4\n3\n3 4 5', note: 'Suma: 1, 2, 3, 4, 5 — pięć liczb. Tylko w A: 1 i 2. Tylko w B: 5. W dokładnie jednym: 1, 2 i 5 — trzy.' }],
            hint: R`cout << (a | b).count() << " " << (a & ~b).count() << " " << (b & ~a).count() << " " << (a ^ b).count() << "\n";. Nawiasy wokół (a | b) są potrzebne, zanim wywołasz .count().`,
            tests: (r) => [`4\n1 2 3 4\n3\n3 4 5`, `1\n5\n1\n5`, `3\n0 999 0\n2\n999 999`, `1000\n${r.arr(1000, 0, 999).join(' ')}\n1000\n${r.arr(1000, 0, 999).join(' ')}`, `700\n${r.arr(700, 0, 500).join(' ')}\n900\n${r.arr(900, 400, 999).join(' ')}`, `${lista(Array.from({ length: 500 }, (_, i) => 2 * i))}\n${lista(Array.from({ length: 500 }, (_, i) => 2 * i + 1))}`],
            check: (inp) => { const t = nums(inp); const n = t[0], m = t[n + 1]; return calk(n, 1, 1000) && calk(m, 1, 1000) && t.length === n + m + 2 && t.every((x, i) => i === 0 || i === n + 1 || calk(x, 0, 999)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const A = zbior(t.slice(1, n + 1)), Bz = zbior(t.slice(n + 2)); const ab = [...A].filter((x) => !Bz.has(x)).length, ba = [...Bz].filter((x) => !A.has(x)).length; const wsp = A.size - ab; return `${A.size + Bz.size - wsp} ${ab} ${ba} ${ab + ba}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    bitset<1000> a, b;
    int n, m, x;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> x;
        a[x] = 1;
    }
    cin >> m;
    for (int i = 0; i < m; i++) {
        cin >> x;
        b[x] = 1;
    }
    cout << (a | b).count() << " " << (a & ~b).count() << " " << (b & ~a).count() << " " << (a ^ b).count() << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-odleglosc-hamminga', krok: 4, level: 'latwe',
            title: 'Odległość Hamminga',
            short: 'Na ilu pozycjach różnią się dwa długie napisy zer i jedynek? XOR zapala bity tam, gdzie są różne, a count() je liczy — bez żadnej pętli.',
            tags: ['bitset<1000>(s)', 'a ^ b', 'count()'],
            statement: ['Odległość Hamminga dwóch napisów tej samej długości to liczba pozycji, na których mają różne znaki. Dla każdej z q par napisów z zer i jedynek wypisz ich odległość Hamminga.',
                'Zamień oba napisy na bitset<1000> — krótsze napisy dostaną zera z przodu, ale oba tyle samo, więc niczego to nie psuje. Bity a ^ b świecą dokładnie tam, gdzie napisy się różnią.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwa napisy tej samej długości oddzielone spacją.'],
            output_format: ['q wierszy: odległości Hamminga.'],
            constraints: ['1 ≤ q ≤ 40', 'napisy w parze mają tę samą długość, od 1 do 1000 znaków 0 i 1'],
            examples: [{ input: '3\n10110 11100\n0 0\n1111 0000', note: '10110 i 11100 różnią się na drugiej i czwartej pozycji — odległość 2. Takie same napisy mają odległość 0, a 1111 i 0000 różnią się wszędzie.' }],
            hint: R`string s, t; cin >> s >> t; bitset<1000> a(s), b(t); cout << (a ^ b).count() << "\n";.`,
            tests: (r) => {
                const para = (len, p) => { const s = los01(r, len); const t = s.split('').map((c) => (r() < p ? (c === '1' ? '0' : '1') : c)).join(''); return `${s} ${t}`; };
                return [wiersze(['10110 11100', '0 0', '1111 0000']), wiersze(Array.from({ length: 40 }, () => para(1000, r()))), wiersze(Array.from({ length: 40 }, () => para(r.int(1, 1000), 0.05))), wiersze([para(1000, 0), para(1000, 1), `${'1'.repeat(1000)} ${'0'.repeat(1000)}`])];
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 40) && l.length === q + 1 && l.slice(1).every((w) => { const [s, t] = w.split(' '); return /^[01]{1,1000}$/.test(s) && /^[01]+$/.test(t || '') && s.length === t.length; }) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const [s, t] = w.split(' '); let c = 0; for (let i = 0; i < s.length; i++) if (s[i] !== t[i]) c++; return String(c); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string s, t;
        cin >> s >> t;
        bitset<1000> a(s), b(t);
        cout << (a ^ b).count() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-czy-podzbior', krok: 4, level: 'srednie',
            title: 'Czy to podzbiór?',
            short: 'A jest podzbiorem B, gdy a & b == a. Zbiory są rozłączne, gdy (a & b).none(). Sprawdzaj warunki w podanej kolejności.',
            tags: ['(a & b) == a', '(a & b).none()', 'a == b'],
            statement: ['Dla każdej z q par zbiorów A i B (liczby od 0 do 999) wypisz jedno słowo. Sprawdzaj warunki w tej kolejności i wypisz pierwszy pasujący:',
                'rowne — gdy zbiory są takie same (a == b); A w B — gdy każdy element A jest w B ((a & b) == a); B w A — gdy każdy element B jest w A; rozlaczne — gdy nie mają wspólnego elementu ((a & b).none()); inne — w pozostałych przypadkach. Zbiór może być pusty — wtedy jest podzbiorem każdego zbioru.'],
            input_format: ['W pierwszym wierszu liczba q.', 'Dla każdej pary dwa wiersze: liczba elementów zbioru A i jego elementy, potem liczba elementów zbioru B i jego elementy (liczby mogą się powtarzać).'],
            output_format: ['q wierszy: rowne, A w B, B w A, rozlaczne albo inne.'],
            constraints: ['1 ≤ q ≤ 100', '0 ≤ liczba elementów ≤ 1000', 'w całych danych jest najwyżej 20 000 elementów', '0 ≤ każdy element ≤ 999'],
            examples: [{ input: '5\n3 1 2 3\n3 3 2 1\n2 5 6\n4 5 6 7 8\n3 1 2 3\n1 2\n2 1 2\n2 3 4\n3 1 2 3\n3 3 4 5', note: 'Pierwsza para to te same zbiory. {5, 6} leży w {5, 6, 7, 8}. {2} leży w {1, 2, 3}, więc to B w A. {1, 2} i {3, 4} nie mają nic wspólnego, a ostatnia para ma wspólną trójkę, ale żaden zbiór nie leży w drugim.' }],
            hint: R`Dla każdej pary nowe bitset<1000> a, b;. Potem: if (a == b) … else if ((a & b) == a) … else if ((a & b) == b) … else if ((a & b).none()) … else …. Nawiasy wokół a & b są konieczne.`,
            tests: (r) => {
                const para = () => {
                    const typ = r.int(0, 4);
                    const baza = rozne(r, r.int(1, 60), 0, 999);
                    let A, Bz;
                    if (typ === 0) { A = baza; Bz = r.shuffle(baza.slice()); }
                    else if (typ === 1) { A = baza.slice(0, r.int(0, baza.length - 1)); Bz = baza; }
                    else if (typ === 2) { A = baza; Bz = baza.slice(0, r.int(0, baza.length - 1)); }
                    else if (typ === 3) { const k = Math.floor(baza.length / 2); A = baza.slice(0, k); Bz = baza.slice(k); }
                    else { A = baza.slice(0, r.int(1, baza.length)); Bz = [...baza.slice(r.int(0, A.length - 1)), ...rozne(r, 3, 0, 999)]; }
                    const pow = (a) => (a.length && r() < 0.3 ? [...a, r.pick(a)] : a);
                    return `${listaW(pow(A))}\n${listaW(pow(Bz))}`;
                };
                const t = ['5\n3 1 2 3\n3 3 2 1\n2 5 6\n4 5 6 7 8\n3 1 2 3\n1 2\n2 1 2\n2 3 4\n3 1 2 3\n3 3 4 5', '2\n0\n0\n0\n2 4 4'];
                t.push(`100\n${Array.from({ length: 100 }, para).join('\n')}`);
                t.push(`5\n${Array.from({ length: 5 }, () => { const a = r.arr(1000, 0, 999); const b = r.arr(1000, 0, 999); return `${listaW(a)}\n${listaW(b)}`; }).join('\n')}`);
                t.push(`3\n${listaW(Array.from({ length: 1000 }, (_, i) => i))}\n${listaW(Array.from({ length: 999 }, (_, i) => i))}\n1 999\n${listaW(Array.from({ length: 1000 }, (_, i) => i))}\n1 0\n1 0`);
                return t;
            },
            check: (inp) => { const t = nums(inp); const q = t[0]; if (!calk(q, 1, 100)) return 'dane'; const { w, i } = czytajListy(t, 1, 2 * q); return i === t.length && w.every((a) => a.length <= 1000 && a.every((x) => calk(x, 0, 999))) && t.length - 1 - 2 * q <= 20000 ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const q = t[0]; const { w } = czytajListy(t, 1, 2 * q); const o = []; for (let j = 0; j < q; j++) { const A = zbior(w[2 * j]), Bz = zbior(w[2 * j + 1]); const AwB = [...A].every((x) => Bz.has(x)), BwA = [...Bz].every((x) => A.has(x)); const wsp = [...A].some((x) => Bz.has(x)); o.push(AwB && BwA ? 'rowne' : AwB ? 'A w B' : BwA ? 'B w A' : !wsp ? 'rozlaczne' : 'inne'); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        bitset<1000> a, b;
        int n, m, x;
        cin >> n;
        for (int j = 0; j < n; j++) {
            cin >> x;
            a[x] = 1;
        }
        cin >> m;
        for (int j = 0; j < m; j++) {
            cin >> x;
            b[x] = 1;
        }
        if (a == b) cout << "rowne\n";
        else if ((a & b) == a) cout << "A w B\n";
        else if ((a & b) == b) cout << "B w A\n";
        else if ((a & b).none()) cout << "rozlaczne\n";
        else cout << "inne\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-obecnosc', krok: 4, level: 'latwe',
            title: 'Lista obecności',
            short: 'Obecni codziennie to AND wszystkich dni, obecni choć raz — OR wszystkich dni. Zbieraj je przez &= i |=, a nieobecnych policz jako n − count().',
            tags: ['zawsze &= dzien', 'choc_raz |= dzien', 'n − count()'],
            statement: ['W klasie jest n uczniów o numerach od 1 do n. Przez d dni nauczyciel zapisywał, kto był obecny. Wypisz trzy liczby: ilu uczniów było obecnych każdego dnia, ilu przyszło choć raz i ilu nie było ani razu.',
                'Zrób to na bitsetach: zawsze zaczyna jako same jedynki (zawsze.set()), choc_raz — jako same zera, a dla każdego dnia: zawsze &= dzien; choc_raz |= dzien;. Bity powyżej n zgasną już po pierwszym &=, bo w dzien ich nie ma.'],
            input_format: ['W pierwszym wierszu liczby n i d.', 'W każdym z kolejnych d wierszy liczba k, a po niej k różnych numerów obecnych uczniów.'],
            output_format: ['Jeden wiersz: trzy liczby — obecni codziennie, obecni choć raz, ani razu.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ d ≤ 100', '0 ≤ k ≤ n', 'w całych danych jest najwyżej 20 000 numerów'],
            examples: [{ input: '5 3\n3 1 2 3\n2 2 3\n4 2 3 4 1', note: 'Uczniowie 2 i 3 byli zawsze. Choć raz przyszli 1, 2, 3 i 4. Uczeń 5 nie przyszedł ani razu.' }],
            hint: R`bitset<1001> zawsze, choc_raz; zawsze.set();. Dla każdego dnia zbuduj bitset<1001> dzien;, a po wczytaniu: zawsze &= dzien; choc_raz |= dzien;. Na koniec: zawsze.count(), choc_raz.count() i n - choc_raz.count().`,
            tests: (r) => {
                const gen = (n, d, p) => `${n} ${d}\n${Array.from({ length: d }, () => listaW(r.shuffle(Array.from({ length: n }, (_, i) => i + 1).filter(() => r() < p)))).join('\n')}`;
                return ['5 3\n3 1 2 3\n2 2 3\n4 2 3 4 1', '1 1\n0', '1 2\n1 1\n1 1', gen(1000, 20, 0.95), gen(1000, 100, 0.2), gen(200, 100, 0.97), gen(1000, 25, 0.8), gen(30, 5, 0.5)];
            },
            check: (inp) => { const t = nums(inp); const [n, d] = t; if (!calk(n, 1, 1000) || !calk(d, 1, 100)) return 'dane'; const { w, i } = czytajListy(t, 2, d); return i === t.length && t.length - 2 - d <= 20000 && w.every((a) => new Set(a).size === a.length && a.every((x) => calk(x, 1, n))) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const [n, d] = t; const { w } = czytajListy(t, 2, d); const c = new Uint16Array(n + 1); for (const a of w) for (const x of a) c[x]++; let z = 0, raz = 0; for (let x = 1; x <= n; x++) { if (c[x] === d) z++; if (c[x] > 0) raz++; } return `${z} ${raz} ${n - raz}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, d;
    cin >> n >> d;
    bitset<1001> zawsze, choc_raz;
    zawsze.set();
    for (int i = 0; i < d; i++) {
        int k;
        cin >> k;
        bitset<1001> dzien;
        for (int j = 0; j < k; j++) {
            int x;
            cin >> x;
            dzien[x] = 1;
        }
        zawsze &= dzien;
        choc_raz |= dzien;
    }
    cout << zawsze.count() << " " << choc_raz.count() << " " << n - choc_raz.count() << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-nieparzyscie', krok: 4, level: 'latwe',
            title: 'Reflektory na scenie',
            short: 'Każdy technik przełącza swój zestaw reflektorów. Dwa przełączenia się znoszą, więc stan końcowy to XOR wszystkich zestawów: stan ^= zestaw.',
            tags: ['stan ^= zestaw', 'XOR znosi pary', 'count()'],
            statement: ['Nad sceną wisi 1000 reflektorów o numerach od 0 do 999, na początku zgaszonych. Kolejno m techników przełącza swój zestaw reflektorów — każdy reflektor z zestawu zmienia stan na przeciwny.',
                'Reflektor świeci na końcu, jeśli przełączono go nieparzyście wiele razy. Zbuduj bitset każdego zestawu i zrób stan ^= zestaw; — XOR dwa razy z tym samym bitem przywraca stan sprzed. Wypisz, ile reflektorów świeci, a w drugim wierszu ich numery rosnąco.'],
            input_format: ['W pierwszym wierszu liczba m.', 'W każdym z kolejnych m wierszy liczba k, a po niej k różnych numerów reflektorów z zestawu.'],
            output_format: ['W pierwszym wierszu liczba świecących reflektorów.', 'W drugim wierszu ich numery rosnąco (gdy żaden nie świeci — pusty wiersz).'],
            constraints: ['1 ≤ m ≤ 100', '0 ≤ k ≤ 1000', 'w całych danych jest najwyżej 20 000 numerów', '0 ≤ każdy numer ≤ 999'],
            examples: [{ input: '3\n3 1 2 3\n2 2 3\n2 3 900', note: 'Reflektor 1 przełączono raz, 2 — dwa razy (zgasł), 3 — trzy razy (świeci), 900 — raz. Świecą 1, 3 i 900.' }],
            hint: R`bitset<1000> stan; dla każdego technika: bitset<1000> z; wczytaj numery do z, potem stan ^= z;. Na końcu stan.count() i pętla po numerach.`,
            tests: (r) => {
                const gen = (m, kmax, lo, hi) => `${m}\n${Array.from({ length: m }, () => listaW(rozne(r, r.int(0, Math.min(kmax, hi - lo + 1)), lo, hi))).join('\n')}`;
                return ['3\n3 1 2 3\n2 2 3\n2 3 900', '1\n0', '2\n2 5 6\n2 6 5', gen(100, 200, 0, 999), gen(20, 1000, 0, 999), gen(100, 50, 0, 60), gen(7, 10, 990, 999)];
            },
            check: (inp) => { const t = nums(inp); const m = t[0]; if (!calk(m, 1, 100)) return 'dane'; const { w, i } = czytajListy(t, 1, m); return i === t.length && t.length - 1 - m <= 20000 && w.every((a) => new Set(a).size === a.length && a.every((x) => calk(x, 0, 999))) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const { w } = czytajListy(t, 1, t[0]); const s = new Uint8Array(1000); for (const a of w) for (const x of a) s[x] ^= 1; const o = []; for (let i = 0; i < 1000; i++) if (s[i]) o.push(i); return `${o.length}\n${o.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int m;
    cin >> m;
    bitset<1000> stan;
    for (int i = 0; i < m; i++) {
        int k;
        cin >> k;
        bitset<1000> z;
        for (int j = 0; j < k; j++) {
            int x;
            cin >> x;
            z[x] = 1;
        }
        stan ^= z;
    }
    cout << stan.count() << "\n";
    for (int x = 0; x < 1000; x++) {
        if (stan[x]) cout << x << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-najpodobniejsza-para', krok: 4, level: 'srednie',
            title: 'Najpodobniejsza para',
            short: 'Zainteresowania każdej osoby to napis zer i jedynek. Liczba wspólnych zainteresowań to (a & b).count() — sprawdź wszystkie pary i zapamiętaj najlepszą.',
            tags: ['vector<bitset<300>>', '(a & b).count()', 'wszystkie pary'],
            statement: ['Każda z n osób wypełniła ankietę o m tematach: napis z m znaków, w którym 1 na pozycji j znaczy „interesuje mnie temat j”. Znajdź parę osób, które mają najwięcej wspólnych zainteresowań.',
                'Wypisz numery tych osób (od 1, mniejszy pierwszy) i liczbę wspólnych tematów. Przy remisie wybierz parę z najmniejszym pierwszym numerem, a potem — z najmniejszym drugim.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy napis z m zer i jedynek.'],
            output_format: ['Jeden wiersz: numery dwóch osób i liczba wspólnych zainteresowań.'],
            constraints: ['2 ≤ n ≤ 300', '1 ≤ m ≤ 300'],
            examples: [{ input: '4 6\n110010\n011011\n110011\n000100', note: 'Osoby 1 i 3 mają wspólne trzy tematy (pozycje 1, 2 i 5), a osoby 2 i 3 — też trzy (2, 5 i 6). Remis rozstrzyga mniejszy pierwszy numer: 1 3 3.' }],
            hint: R`vector<bitset<300>> o(n); i dla każdej osoby o[i] = bitset<300>(s);. Potem dwie pętle i < j: int w = (o[i] & o[j]).count(); if (w > najlepsze) { … }. Ostre > zostawia pierwszą znalezioną parę przy remisie.`,
            tests: (r) => {
                const gen = (n, m, p) => `${n} ${m}\n${Array.from({ length: n }, () => los01(r, m, p)).join('\n')}`;
                return ['4 6\n110010\n011011\n110011\n000100', '2 1\n0\n0', '3 3\n111\n111\n111', gen(300, 300, 0.5), gen(300, 300, 0.1), gen(300, 17, 0.3), gen(50, 300, 0.7), gen(300, 300, 0.97)];
            },
            check: (inp) => { const l = L(inp); const [n, m] = l[0].split(' ').map(Number); return calk(n, 2, 300) && calk(m, 1, 300) && l.length === n + 1 && l.slice(1).every((s) => s.length === m && /^[01]+$/.test(s)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const n = Number(l[0].split(' ')[0]); const s = l.slice(1); let best = -1, a = 0, b = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let w = 0; for (let k = 0; k < s[i].length; k++) if (s[i][k] === '1' && s[j][k] === '1') w++; if (w > best) { best = w; a = i; b = j; } } return `${a + 1} ${b + 1} ${best}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<bitset<300>> o(n);
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        o[i] = bitset<300>(s);
    }
    int najlepsze = -1, a = 0, b = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            int w = (o[i] & o[j]).count();
            if (w > najlepsze) {
                najlepsze = w;
                a = i;
                b = j;
            }
        }
    }
    cout << a + 1 << " " << b + 1 << " " << najlepsze << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-pary-uzupelniajace', krok: 4, level: 'srednie',
            title: 'Pary, które umieją wszystko',
            short: 'Para osób pokrywa wszystkie m tematów, gdy (a | b).count() == m. Nie używaj all() — bitset ma więcej bitów niż m.',
            tags: ['(a | b).count() == m', 'pułapka all()', 'liczenie par'],
            statement: ['Na zawody drużynowe trzeba wysłać dwie osoby, które razem znają wszystkie m tematów. Każda z n osób opisała swoją wiedzę napisem z m znaków: 1 na pozycji j znaczy „znam temat j”.',
                'Ile jest par osób (bez kolejności), które razem znają każdy temat — czyli dla każdego tematu przynajmniej jedna z dwóch osób go zna? Bitset ma stały rozmiar 300, a tematów może być mniej, więc porównuj (a | b).count() z m, a nie używaj all().'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy napis z m zer i jedynek.'],
            output_format: ['Jedna liczba — liczba takich par.'],
            constraints: ['2 ≤ n ≤ 300', '1 ≤ m ≤ 300'],
            examples: [{ input: '4 4\n1100\n0011\n1011\n0110', note: 'Pasują pary (1, 2): 1100 | 0011 = 1111, (1, 3): 1100 | 1011 = 1111 i (3, 4): 1011 | 0110 = 1111. Pozostałe trzy pary mają dziurę — razem 3.' }],
            hint: R`Dla każdej pary i < j: if ((int)(o[i] | o[j]).count() == m) ile++;. Wynik zmieści się w int — par jest najwyżej 44 850.`,
            tests: (r) => {
                const gen = (n, m, p) => `${n} ${m}\n${Array.from({ length: n }, () => los01(r, m, p)).join('\n')}`;
                return ['4 4\n1100\n0011\n1011\n0110', '2 1\n1\n0', '2 3\n000\n000', gen(300, 300, 0.95), gen(300, 300, 0.99), gen(300, 10, 0.5), gen(300, 30, 0.7), gen(100, 300, 0.5), gen(300, 300, 1)];
            },
            check: (inp) => { const l = L(inp); const [n, m] = l[0].split(' ').map(Number); return calk(n, 2, 300) && calk(m, 1, 300) && l.length === n + 1 && l.slice(1).every((s) => s.length === m && /^[01]+$/.test(s)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const n = Number(l[0].split(' ')[0]); const s = l.slice(1); let c = 0; for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) { let ok = true; for (let k = 0; k < s[i].length && ok; k++) if (s[i][k] === '0' && s[j][k] === '0') ok = false; if (ok) c++; } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<bitset<300>> o(n);
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        o[i] = bitset<300>(s);
    }
    int ile = 0;
    for (int i = 0; i < n; i++) {
        for (int j = i + 1; j < n; j++) {
            if ((int)(o[i] | o[j]).count() == m) ile++;
        }
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 5 · przesunięcia
        {
            id: 'bs-przesuwanie', krok: 5, level: 'latwe',
            title: 'Przesuwanie w lewo i w prawo',
            short: 'b <<= k przesuwa wszystkie bity o k w stronę wyższych numerów, b >>= k — w stronę niższych. Bity, które wyjdą poza bitset, przepadają na zawsze.',
            tags: ['b <<= k', 'b >>= k', 'bity wypadają'],
            statement: ['Wczytaj 16 cyfr zer i jedynek — to bitset<16> b (pierwsza cyfra to bit 15, ostatnia — bit 0). Potem wykonaj po kolei q przesunięć i po każdym wypisz cały bitset.',
                '<< k przesuwa bity o k pozycji w lewo (w stronę wyższych numerów), a >> k — o k pozycji w prawo. Z drugiej strony wchodzą zera, a bity, które wypadną poza 16 pozycji, przepadają — kolejne przesunięcie ich nie przywróci. Przesunięcie o 16 albo więcej daje same zera.'],
            input_format: ['W pierwszym wierszu 16 cyfr 0 i 1.', 'W drugim wierszu liczba q.', 'W każdym z kolejnych q wierszy przesunięcie: << k albo >> k.'],
            output_format: ['q wierszy po 16 cyfr — stan bitsetu po każdym przesunięciu.'],
            constraints: ['1 ≤ q ≤ 500', '0 ≤ k ≤ 20'],
            examples: [{ input: '0000000000101101\n3\n<< 3\n>> 5\n<< 13', note: 'W lewo o 3: z prawej wchodzą trzy zera. W prawo o 5: pięć ostatnich cyfr (01000) wypada z prawej strony, a z lewej wchodzą zera. W lewo o 13: najstarsza jedynka wypada z lewej strony i zostają tylko dwie.' }],
            hint: R`bitset<16> b(s); potem dla każdego przesunięcia: string op; int k; cin >> op >> k; if (op == "<<") b <<= k; else b >>= k; cout << b << "\n";.`,
            tests: (r) => {
                const t = ['0000000000101101\n3\n<< 3\n>> 5\n<< 13', '1111111111111111\n2\n<< 16\n>> 0', '1000000000000001\n3\n>> 15\n<< 15\n<< 1'];
                // Przesunięcia tylko gubią bity, więc w długim teście co kilka ruchów zaczynamy od nowa z innym napisem — osobnym testem.
                for (let i = 0; i < 6; i++) t.push(`${los01(r, 16, 0.6)}\n${wiersze(Array.from({ length: r.int(5, 25) }, () => `${r.pick(['<<', '>>'])} ${r() < 0.9 ? r.int(0, 3) : r.int(4, 20)}`))}`);
                t.push(`${'1'.repeat(16)}\n${wiersze(Array.from({ length: 500 }, (_, i) => (i < 16 ? `>> 1` : `${r.pick(['<<', '>>'])} ${r.int(0, 20)}`)))}`);
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[1]); return /^[01]{16}$/.test(l[0]) && calk(q, 1, 500) && l.length === q + 2 && l.slice(2).every((w) => /^(<<|>>) \d+$/.test(w) && calk(Number(w.slice(3)), 0, 20)) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); let b = parseInt(l[0], 2); return l.slice(2).map((w) => { const k = Number(w.slice(3)); b = w[0] === '<' ? (k >= 16 ? 0 : (b << k) & 0xFFFF) : (k >= 16 ? 0 : b >> k); return b.toString(2).padStart(16, '0'); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int q;
    cin >> s >> q;
    bitset<16> b(s);
    for (int i = 0; i < q; i++) {
        string op;
        int k;
        cin >> op >> k;
        if (op == "<<") b <<= k;
        else b >>= k;
        cout << b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-sasiedzi', krok: 5, level: 'latwe',
            title: 'Sąsiedzi w rzędzie',
            short: 'b & (b >> 1) zapala bit tam, gdzie zajęte jest miejsce i jego sąsiad — to pary sąsiadów. b & ~(b << 1) & ~(b >> 1) zostawia osoby bez sąsiada.',
            tags: ['b & (b >> 1)', 'b & ~(b << 1) & ~(b >> 1)', 'bez pętli'],
            statement: ['Rząd w kinie opisuje napis z zer i jedynek: 1 to zajęte miejsce, 0 — wolne. Wypisz dwie liczby: ile jest par sąsiednich miejsc zajętych obok siebie oraz ile osób siedzi samotnie (oba sąsiednie miejsca wolne albo ich brak, bo to brzeg rzędu).',
                'Zrób to bez pętli po miejscach. W b >> 1 bit i ma wartość bitu i + 1, więc b & (b >> 1) świeci tam, gdzie zajęte jest miejsce i oraz jego sąsiad. Samotne osoby to b & ~(b << 1) & ~(b >> 1).'],
            input_format: ['Jeden wiersz: napis z zer i jedynek.'],
            output_format: ['Jeden wiersz: liczba par sąsiadów i liczba samotnych osób.'],
            constraints: ['napis ma od 1 do 100 000 znaków'],
            examples: [{ input: '0110111001', note: 'Pary sąsiadów: miejsca 2–3, 5–6 i 6–7 — trzy pary (pięć osób w dwóch grupach). Samotnie siedzi tylko osoba na samym końcu rzędu.' }],
            hint: R`string s; cin >> s; bitset<100000> b(s);. Potem (b & (b >> 1)).count() i (b & ~(b << 1) & ~(b >> 1)).count(). Bity spoza napisu są zerami, więc niczego nie psują.`,
            tests: (r) => ['0110111001', '1', '0', '11', '101', los01(r, 100000, 0.5), los01(r, 100000, 0.1), los01(r, 100000, 0.9), '1'.repeat(100000), `1${'0'.repeat(99998)}1`, los01(r, 777, 0.3)],
            check: (inp) => (/^[01]{1,100000}$/.test(inp) ? null : 'dane'),
            solve: (inp) => { const s = inp; let p = 0, sam = 0; for (let i = 0; i < s.length; i++) { if (s[i] !== '1') continue; if (s[i + 1] === '1') p++; if (s[i - 1] !== '1' && s[i + 1] !== '1') sam++; } return `${p} ${sam}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<100000> b;
int main() {
    string s;
    cin >> s;
    b = bitset<100000>(s);
    cout << (b & (b >> 1)).count() << " " << (b & ~(b << 1) & ~(b >> 1)).count() << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-odstep-k', krok: 5, level: 'srednie',
            title: 'Pary w odstępie k',
            short: 'Ile jest par jedynek w odległości dokładnie k? b & (b >> k) świeci w każdym takim miejscu, więc jedno count() odpowiada na pytanie.',
            tags: ['b & (b >> k)', 'wiele pytań', 'count()'],
            statement: ['Dany jest napis z zer i jedynek długości n. Para pozycji (i, i + k) jest dobra, jeśli na obu stoją jedynki. Odpowiedz na q pytań: ile jest dobrych par dla danego k?',
                'Wyrażenie b & (b >> k) ma zapalone bity dokładnie tam, gdzie zaczyna się dobra para — więc wystarczy jedno count() na pytanie.'],
            input_format: ['W pierwszym wierszu napis z zer i jedynek.', 'W drugim wierszu liczba q.', 'W trzecim wierszu q liczb k.'],
            output_format: ['q wierszy: liczba dobrych par dla każdego k.'],
            constraints: ['2 ≤ n ≤ 20 000', '1 ≤ q ≤ 2000', '1 ≤ k < n'],
            examples: [{ input: '1011001\n3\n1 2 3', note: 'Odstęp 1: tylko para na pozycjach 2–3 (licząc od 0 od lewej). Odstęp 2: pozycje 0–2. Odstęp 3: pary 0–3 i 3–6.' }],
            hint: R`bitset<20000> b(s); i dla każdego k: cout << (b & (b >> k)).count() << "\n";. Kierunek napisu nie ma znaczenia — para w odstępie k pozostaje parą w odstępie k.`,
            tests: (r) => {
                const t = ['1011001\n3\n1 2 3', '11\n1\n1', '10\n1\n1'];
                const gen = (n, p, q) => `${los01(r, n, p)}\n${q}\n${r.arr(q, 1, n - 1).join(' ')}`;
                t.push(gen(20000, 0.5, 2000), gen(20000, 0.05, 2000), gen(500, 0.9, 499), gen(20000, 0.999, 1000));
                return t;
            },
            check: (inp) => { const l = L(inp); const n = l[0].length; const q = Number(l[1]); const k = (l[2] || '').split(' ').map(Number); return /^[01]+$/.test(l[0]) && calk(n, 2, 20000) && calk(q, 1, 2000) && k.length === q && k.every((x) => calk(x, 1, n - 1)) && l.length === 3 ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const s = l[0]; return l[2].split(' ').map(Number).map((k) => { let c = 0; for (let i = 0; i + k < s.length; i++) if (s[i] === '1' && s[i + k] === '1') c++; return String(c); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int q;
    cin >> s >> q;
    bitset<20000> b(s);
    for (int i = 0; i < q; i++) {
        int k;
        cin >> k;
        cout << (b & (b >> k)).count() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-plotka', krok: 5, level: 'srednie',
            title: 'Plotka w rzędzie',
            short: 'Co minutę każdy, kto zna plotkę, mówi ją sąsiadom: b |= (b << 1) | (b >> 1). Bit, który wyjdzie poza n osób, wytnij maską — inaczej count() kłamie.',
            tags: ['b |= (b << 1) | (b >> 1)', 'maska n jedynek', 'count() == n'],
            statement: ['W rzędzie stoi n osób. Napis z zer i jedynek mówi, kto na początku zna plotkę (1). Co minutę każdy, kto ją zna, przekazuje ją obu sąsiadom. Po ilu minutach plotkę znają wszyscy? Jeśli na początku nie zna jej nikt, wypisz -1.',
                'Jedna minuta to b |= (b << 1) | (b >> 1);. Uwaga: przesunięcie w lewo przenosi plotkę także na pozycję n, której nie ma — a stamtąd dalej. Po każdej minucie zostaw tylko pierwsze n bitów: b &= maska, gdzie maska ma jedynki na pozycjach od 0 do n − 1.'],
            input_format: ['Jeden wiersz: napis z zer i jedynek długości n.'],
            output_format: ['Jedna liczba: liczba minut albo -1.'],
            constraints: ['1 ≤ n ≤ 10 000'],
            examples: [{ input: '0010000', note: 'Po minucie plotkę znają osoby 1, 2 i 3 (licząc od 0 od lewej), po dwóch — 0–4, po trzech — 0–5, po czterech — wszyscy.' },
                { input: '1000001', note: 'Plotka idzie z obu końców i spotyka się w środku po trzech minutach.' }, { input: '000', note: 'Nikt nie zna plotki — nigdy się nie rozejdzie.' }],
            hint: R`bitset<10000> b(s), maska; maska.set(); maska >>= 10000 - n; — teraz maska ma n jedynek. Pętla: while ((int)b.count() < n) { b |= (b << 1) | (b >> 1); b &= maska; minuty++; }. Najpierw sprawdź, czy b.none().`,
            tests: (r) => {
                const jedna = (n, poz) => { const a = new Array(n).fill('0'); for (const p of poz) a[p] = '1'; return a.join(''); };
                return ['0010000', '1000001', '000', '1', '0', jedna(10000, [0]), jedna(10000, [9999]), jedna(10000, [5000]), jedna(10000, [17, 9000]), los01(r, 10000, 0.001), jedna(9999, rozne(r, 3, 0, 9998)), '1'.repeat(10000), jedna(10000, [])];
            },
            check: (inp) => (/^[01]{1,10000}$/.test(inp) ? null : 'dane'),
            solve: (inp) => { const s = inp; const n = s.length; const poz = []; for (let i = 0; i < n; i++) if (s[i] === '1') poz.push(i); if (!poz.length) return '-1'; let w = Math.max(poz[0], n - 1 - poz[poz.length - 1]); for (let i = 1; i < poz.length; i++) w = Math.max(w, Math.floor((poz[i] - poz[i - 1]) / 2)); return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.size();
    bitset<10000> b(s), maska;
    maska.set();
    maska >>= 10000 - n;
    if (b.none()) {
        cout << -1 << "\n";
        return 0;
    }
    int minuty = 0;
    while ((int)b.count() < n) {
        b |= (b << 1) | (b >> 1);
        b &= maska;
        minuty++;
    }
    cout << minuty << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-obrot', krok: 5, level: 'srednie',
            title: 'Obrót bitów',
            short: 'Obrót w lewo o k to przesunięcie, w którym bity wypadające z lewej wracają z prawej: (b << k) | (b >> (32 - k)).',
            tags: ['(b << k) | (b >> (32 - k))', 'bitset<32>', 'to_ulong()'],
            statement: ['Dla każdej z q liczb x zapisanych na 32 bitach wykonaj obrót w lewo o k pozycji: każdy bit przesuwa się o k miejsc w lewo, a bity, które wypadłyby z lewej strony, wracają z prawej — jak na karuzeli. Wypisz otrzymaną liczbę.',
                'Zwykłe przesunięcie b << k gubi k najstarszych bitów. Odzyskasz je przesunięciem w drugą stronę: b >> (32 - k) przenosi właśnie te bity na najmłodsze pozycje. OR obu części to obrót.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczby x i k.'],
            output_format: ['q wierszy: liczby po obrocie.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ x ≤ 4 294 967 295', '0 ≤ k ≤ 31'],
            examples: [{ input: '3\n1 3\n2147483648 1\n13 0', note: '1 po obrocie o 3 to 8. Najstarszy bit 2³¹ po obrocie o 1 wraca na pozycję 0 — wynik 1. Obrót o 0 niczego nie zmienia.' }],
            hint: R`long long x; int k; cin >> x >> k; bitset<32> b(x); b = (b << k) | (b >> (32 - k)); cout << b.to_ulong() << "\n";. Dla k = 0 drugie przesunięcie jest o 32 — bitset daje wtedy same zera, więc wynik się zgadza.`,
            tests: (r) => [wiersze(['1 3', '2147483648 1', '13 0']), wiersze(['4294967295 17', '0 5', '305419896 4', '305419896 28', '2863311530 1']), wiersze(Array.from({ length: 1000 }, () => `${r.big(0n, 4294967295n)} ${r.int(0, 31)}`)), wiersze(Array.from({ length: 32 }, (_, k) => `1 ${k}`))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((w) => { const [x, k] = w.split(' '); return P.calkB(x, 0n, 4294967295n) && calk(Number(k), 0, 31); }) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const [xs, ks] = w.split(' '); const x = BigInt(xs), k = BigInt(ks); const M = (1n << 32n) - 1n; return String(((x << k) | (x >> (32n - k))) & M); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        int k;
        cin >> x >> k;
        bitset<32> b(x);
        b = (b << k) | (b >> (32 - k));
        cout << b.to_ulong() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-regula-90', krok: 5, level: 'srednie',
            title: 'Reguła 90',
            short: 'Nowy stan komórki to XOR jej dwóch sąsiadów — dla całego rzędu naraz: b = (b << 1) ^ (b >> 1), przycięte maską. Z jednej komórki wyrasta trójkąt Sierpińskiego.',
            tags: ['(b << 1) ^ (b >> 1)', 'maska', "wypisywanie '#' i '.'"],
            statement: ['Rząd n komórek, każda żywa (#) albo martwa (.). W każdym kroku wszystkie komórki zmieniają się jednocześnie: komórka staje się żywa, gdy dokładnie jeden z jej dwóch sąsiadów był żywy (XOR sąsiadów). Poza rzędem komórek nie ma — traktujemy je jak martwe.',
                'Wypisz stan początkowy i stan po każdym z t kroków. Trzymaj komórkę i w bicie i (wczytaj pętlą: b[i] = s[i] == \'#\'). Krok to b = ((b << 1) ^ (b >> 1)) & maska; — przesunięcie w lewo daje każdej komórce stan lewego sąsiada, w prawo — prawego. Z jednej żywej komórki wyrasta trójkąt Sierpińskiego.'],
            input_format: ['W pierwszym wierszu liczby n i t.', 'W drugim wierszu n znaków # i .'],
            output_format: ['t + 1 wierszy po n znaków: stan początkowy i stan po każdym kroku.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ t ≤ 200'],
            examples: [{ input: '15 7\n.......#.......', note: 'Z jednej żywej komórki po siedmiu krokach wyrasta trójkąt złożony z mniejszych trójkątów — trójkąt Sierpińskiego.' }],
            hint: R`bitset<100> b, maska; for (int i = 0; i < n; i++) { b[i] = (s[i] == '#'); maska[i] = 1; }. Wypisywanie: for (int i = 0; i < n; i++) cout << (b[i] ? '#' : '.');.`,
            tests: (r) => {
                const rzad = (n, p) => Array.from({ length: n }, () => (r() < p ? '#' : '.')).join('');
                const srodek = (n) => '.'.repeat(Math.floor(n / 2)) + '#' + '.'.repeat(n - Math.floor(n / 2) - 1);
                return ['15 7\n.......#.......', '1 3\n#', '2 4\n#.', `31 15\n${srodek(31)}`, `100 200\n${rzad(100, 0.3)}`, `100 200\n${srodek(100)}`, `64 100\n#${'.'.repeat(63)}`, `50 120\n${rzad(50, 0.05)}`];
            },
            check: (inp) => { const l = L(inp); const [n, t] = l[0].split(' ').map(Number); return calk(n, 1, 100) && calk(t, 1, 200) && l.length === 2 && l[1].length === n && /^[#.]+$/.test(l[1]) ? null : 'dane'; },
            solve: (inp) => { const l = L(inp); const [n, t] = l[0].split(' ').map(Number); let c = l[1].split('').map((x) => (x === '#' ? 1 : 0)); const o = [l[1]]; for (let k = 0; k < t; k++) { c = c.map((_, i) => (c[i - 1] || 0) ^ (c[i + 1] || 0)); o.push(c.map((x) => (x ? '#' : '.')).join('')); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, t;
    string s;
    cin >> n >> t >> s;
    bitset<100> b, maska;
    for (int i = 0; i < n; i++) {
        b[i] = (s[i] == '#');
        maska[i] = 1;
    }
    for (int krok = 0; krok <= t; krok++) {
        if (krok > 0) b = ((b << 1) ^ (b >> 1)) & maska;
        for (int i = 0; i < n; i++) cout << (b[i] ? '#' : '.');
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-skoki-zaby', krok: 5, level: 'srednie',
            title: 'Skoki żaby',
            short: 'Zbiór pozycji, w których żaba może być, to bitset. Jeden skok o a albo o b to (S << a) | (S << b), przycięte do planszy maską.',
            tags: ['S = (S << a) | (S << b)', 'zbiór pozycji', 'maska'],
            statement: ['Żaba stoi na polu 0 planszy z polami od 0 do n − 1. W każdym ruchu skacze w prawo dokładnie o a albo dokładnie o b pól. Skok poza ostatnie pole jest zabroniony. Ile różnych pól może zajmować żaba po dokładnie t ruchach i które z nich jest najdalej?',
                'Trzymaj zbiór możliwych pól jako bitset S: na początku tylko bit 0. Po jednym ruchu nowy zbiór to (S << a) | (S << b), a pola poza planszą wytnij maską. Jeśli w pewnym momencie zbiór się wyczerpie, żaba nie może wykonać t ruchów — wypisz wtedy 0 -1.'],
            input_format: ['Jeden wiersz: liczby n, a, b i t.'],
            output_format: ['Jeden wiersz: liczba możliwych pól po t ruchach i numer najdalszego z nich (albo 0 -1).'],
            constraints: ['1 ≤ n ≤ 100 000', '1 ≤ a, b ≤ n', '1 ≤ t ≤ 1000'],
            examples: [{ input: '20 2 5 3', note: 'Po trzech ruchach żaba może stać na polach 6 (2 + 2 + 2), 9, 12 i 15 (5 + 5 + 5) — cztery pola, najdalsze 15.' },
                { input: '10 4 6 3', note: 'Najkrótsza droga to 4 + 4 + 4 = 12 — za daleko jak na planszę z polami od 0 do 9.' }],
            hint: R`bitset<100000> S, maska; S[0] = 1; for (int i = 0; i < n; i++) maska[i] = 1;. Ruch: S = ((S << a) | (S << b)) & maska;. Najdalsze pole znajdziesz pętlą od n - 1 w dół.`,
            tests: (r) => ['20 2 5 3', '10 4 6 3', '1 1 1 1', '100000 1 2 1000', '100000 3 7 1000', '100000 100 99 1000', '100000 30000 1 5', `100000 ${r.int(1, 200)} ${r.int(1, 200)} ${r.int(500, 1000)}`, '50000 6 10 777', '7 7 7 1'],
            check: (inp) => { const [n, a, b, t] = nums(inp); return calk(n, 1, 100000) && calk(a, 1, n) && calk(b, 1, n) && calk(t, 1, 1000) && nums(inp).length === 4 ? null : 'dane'; },
            solve: (inp) => { const [n, a, b, t] = nums(inp); let S = new Uint8Array(n); S[0] = 1; for (let k = 0; k < t; k++) { const N = new Uint8Array(n); for (let i = 0; i < n; i++) if (S[i]) { if (i + a < n) N[i + a] = 1; if (i + b < n) N[i + b] = 1; } S = N; } let c = 0, mx = -1; for (let i = 0; i < n; i++) if (S[i]) { c++; mx = i; } return `${c} ${mx}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<100000> S, maska;
int main() {
    int n, a, b, t;
    cin >> n >> a >> b >> t;
    S.reset();
    maska.reset();
    S[0] = 1;
    for (int i = 0; i < n; i++) maska[i] = 1;
    for (int k = 0; k < t; k++) {
        S = ((S << a) | (S << b)) & maska;
    }
    int najdalej = -1;
    for (int i = n - 1; i >= 0; i--) {
        if (S[i]) {
            najdalej = i;
            break;
        }
    }
    cout << S.count() << " " << najdalej << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-sumy-par', krok: 5, level: 'srednie',
            title: 'Sumy par',
            short: 'Wszystkie sumy x + y to zbiór A przesunięty o każdy element x: S |= A << x. Liczba różnych sum to S.count().',
            tags: ['S |= A << x', 'bitset<2001>', 'jeden rozmiar dla obu'],
            statement: ['Dany jest zbiór A liczb od 0 do 1000 (liczby na liście mogą się powtarzać). Ile różnych wartości może mieć suma x + y, gdzie x i y należą do A? Można wziąć dwa razy tę samą liczbę.',
                'A << x to zbiór wszystkich sum x + y dla ustalonego x — każdy element A przesunięty o x. OR takich przesunięć dla wszystkich x z A daje wszystkie sumy. Sumy sięgają 2000, więc oba bitsety muszą mieć rozmiar 2001 — bitsetów różnych rozmiarów nie da się łączyć.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jedna liczba — liczba różnych sum.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '3\n1 4 6', note: 'Sumy: 1 + 1 = 2, 1 + 4 = 5, 1 + 6 = 7, 4 + 4 = 8, 4 + 6 = 10, 6 + 6 = 12 — sześć różnych.' },
                { input: '4\n0 1 2 2', note: 'Sumy od 0 + 0 = 0 do 2 + 2 = 4 — pięć różnych.' }],
            hint: R`bitset<2001> A, S; zaznacz liczby w A, potem for (int x = 0; x <= 1000; x++) if (A[x]) S |= A << x;. Na końcu S.count().`,
            tests: (r) => [lista([1, 4, 6]), lista([0, 1, 2, 2]), lista([1000]), lista(r.arr(1000, 0, 1000)), lista(r.arr(30, 0, 1000)), lista(Array.from({ length: 11 }, (_, i) => i * 100)), lista(rozne(r, 100, 0, 1000)), lista([0, 1000, 3, 997])],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1000)) ? null : 'dane'; },
            solve: (inp) => { const a = [...new Set(nums(inp).slice(1))]; const S = new Uint8Array(2001); for (const x of a) for (const y of a) S[x + y] = 1; return String(S.reduce((s, v) => s + v, 0)); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    bitset<2001> A, S;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        A[x] = 1;
    }
    for (int x = 0; x <= 1000; x++) {
        if (A[x]) S |= A << x;
    }
    cout << S.count() << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 6 · sito Eratostenesa
        {
            id: 'bs-czy-pierwsza', krok: 6, level: 'latwe',
            title: 'Czy pierwsza?',
            short: 'Zrób sito do 10⁷ raz na początku programu, a potem odpowiadaj na pytania jednym odczytem bitu. Bitset o 10⁷ bitach deklaruj przed main.',
            tags: ['sito raz, pytania potem', 'bitset<10000001>', 'zlozona[x]'],
            statement: ['Dla każdej z q liczb x wypisz TAK, jeśli x jest liczbą pierwszą, albo NIE w przeciwnym razie. Pamiętaj: 1 nie jest liczbą pierwszą.',
                'Zamiast sprawdzać każdą liczbę osobno, zrób na początku sito Eratostenesa aż do 10⁷ w bitsecie zlozona. Potem każde pytanie to tylko odczyt jednego bitu.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q liczb x.'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 5000', '1 ≤ x ≤ 10 000 000'],
            examples: [{ input: '6\n1 2 9 97 10000000 9999991', note: '1 nie jest pierwsza, 2 jest. 9 = 3 · 3. 97 jest pierwsza. 10⁷ jest parzysta, a 9 999 991 to największa liczba pierwsza poniżej 10⁷.' }],
            hint: R`const int N = 10000000; bitset<N + 1> zlozona; przed main. W main: zlozona[0] = zlozona[1] = 1; for (int i = 2; i * i <= N; i++) if (!zlozona[i]) for (int j = i * i; j <= N; j += i) zlozona[j] = 1;. Potem pytania: cout << (zlozona[x] ? "NIE" : "TAK") << "\n";.`,
            tests: (r) => [lista([1, 2, 9, 97, 10000000, 9999991]), lista([1]), lista(r.arr(5000, 1, 10000000)), lista(r.arr(5000, 1, 100)), lista(pierwszeDo(10000000).slice(-5000)), lista(Array.from({ length: 5000 }, () => { const p = r.pick([2, 3, 5, 7, 11, 13]); return p * r.int(1, Math.floor(10000000 / p)); }))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 5000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 10000000)) ? null : 'dane'; },
            solve: (inp) => { const z = sito(10000000); return nums(inp).slice(1).map((x) => (z[x] ? 'NIE' : 'TAK')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int N = 10000000;
bitset<N + 1> zlozona;
int main() {
    zlozona[0] = zlozona[1] = 1;
    for (int i = 2; i * i <= N; i++) {
        if (!zlozona[i]) {
            for (int j = i * i; j <= N; j += i) zlozona[j] = 1;
        }
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int x;
        cin >> x;
        if (zlozona[x]) cout << "NIE\n";
        else cout << "TAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-pierwsze-do-n', krok: 6, level: 'latwe',
            title: 'Wszystkie pierwsze do n',
            short: 'Sito skreśla wielokrotności każdej kolejnej liczby pierwszej. Co zostanie nieskreślone od 2 do n — to liczby pierwsze, od razu rosnąco.',
            tags: ['sito Eratostenesa', 'i * i <= n', 'start od i * i'],
            statement: ['Wypisz rosnąco wszystkie liczby pierwsze nie większe od n.',
                'Użyj sita Eratostenesa: zaczynasz od 2, skreślasz jej wielokrotności, bierzesz następną nieskreśloną liczbę — 3 — i skreślasz jej wielokrotności, i tak dalej. Wielokrotności liczby i wystarczy skreślać od i · i, a zewnętrzna pętla może się skończyć, gdy i · i > n.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Jeden wiersz: liczby pierwsze od 2 do n oddzielone spacjami.'],
            constraints: ['2 ≤ n ≤ 30 000'],
            examples: [{ input: '30', note: 'Skreślamy wielokrotności 2 (od 4), 3 (od 9) i 5 (od 25). Przy i = 6 mamy 6 · 6 = 36 > 30 — koniec. Zostaje 10 liczb pierwszych.' }],
            hint: R`bitset<30001> zlozona; zlozona[0] = zlozona[1] = 1; i dwie pętle sita z limitem n. Potem for (int i = 2; i <= n; i++) if (!zlozona[i]) cout << i << " ";.`,
            tests: () => ['30', '2', '3', '4', '100', '30000', '29989', '1000'],
            check: (inp) => (/^\d+$/.test(inp) && calk(Number(inp), 2, 30000) ? null : 'dane'),
            solve: (inp) => pierwszeDo(Number(inp)).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    bitset<30001> zlozona;
    zlozona[0] = zlozona[1] = 1;
    for (int i = 2; i * i <= n; i++) {
        if (!zlozona[i]) {
            for (int j = i * i; j <= n; j += i) zlozona[j] = 1;
        }
    }
    for (int i = 2; i <= n; i++) {
        if (!zlozona[i]) cout << i << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-ile-pierwszych', krok: 6, level: 'srednie',
            title: 'Ile pierwszych do stu milionów',
            short: 'Sito do 10⁸ w bitsecie zajmuje 12,5 MB i trwa mniej niż pół sekundy. Tablica bool potrzebuje 100 MB i jest trzy do pięciu razy wolniejsza.',
            tags: ['bitset<100000001>', 'long long i * i', 'pamięć i czas'],
            statement: ['Policz, ile jest liczb pierwszych nie większych od n. Liczba n może sięgać stu milionów.',
                'Bitset o 100 000 001 bitach zajmuje około 12,5 MB i musi stać przed main. Sito w bitsecie trwa na sprawdzarce od 0,3 do 0,5 sekundy, a z tablicą bool — 100 MB pamięci i od jednej do dwóch i pół sekundy, bo procesor dużo dłużej czyta tak wielką tablicę. Limit czasu to 2 sekundy.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Jedna liczba — ile jest liczb pierwszych nie większych od n.'],
            constraints: ['1 ≤ n ≤ 100 000 000'],
            examples: [{ input: '100', note: 'Do stu jest 25 liczb pierwszych: 2, 3, 5, 7, 11, …, 89, 97.' },
                { input: '1', note: 'Jedynka nie jest liczbą pierwszą.' }],
            hint: R`const int MAX = 100000000; bitset<MAX + 1> zlozona; przed main. W sicie licz do n: for (long long i = 2; i * i <= n; i++) if (!zlozona[i]) for (long long j = i * i; j <= n; j += i) zlozona[j] = 1;. Na koniec pętla od 2 do n liczy niezapalone bity.`,
            time_limit: '2 s',
            tests: () => ['100', '1', '2', '10', '1000000', '10000000', '99999989', '100000000'],
            check: (inp) => (/^\d+$/.test(inp) && calk(Number(inp), 1, 100000000) ? null : 'dane'),
            solve: (inp) => { const n = Number(inp); const z = sito(Math.max(n, 2)); let c = 0; for (let i = 2; i <= n; i++) if (!z[i]) c++; return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int MAX = 100000000;
bitset<MAX + 1> zlozona;
int main() {
    int n;
    cin >> n;
    zlozona[0] = zlozona[1] = 1;
    for (long long i = 2; i * i <= n; i++) {
        if (!zlozona[i]) {
            for (long long j = i * i; j <= n; j += i) zlozona[j] = 1;
        }
    }
    int ile = 0;
    for (int i = 2; i <= n; i++) {
        if (!zlozona[i]) ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-pierwsze-w-przedziale', krok: 6, level: 'srednie',
            title: 'Pierwsze w przedziale',
            short: 'Sito raz, a potem tablica ile[x] — ile jest pierwszych do x. Każde pytanie o przedział [a, b] to jedno odejmowanie: ile[b] − ile[a − 1].',
            tags: ['sito + sumy prefiksowe', 'ile[b] - ile[a - 1]', 'wiele pytań'],
            statement: ['Odpowiedz na q pytań: ile liczb pierwszych leży w przedziale od a do b (włącznie)?',
                'Pytań jest dużo, więc nie licz każdego przedziału pętlą. Po sicie zbuduj tablicę ile[x] = liczba liczb pierwszych od 1 do x (sumy prefiksowe z lekcji Złożoność czasowa). Wtedy odpowiedź to ile[b] - ile[a - 1].'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczby a i b.'],
            output_format: ['q wierszy: liczba liczb pierwszych w każdym przedziale.'],
            constraints: ['1 ≤ q ≤ 4000', '1 ≤ a ≤ b ≤ 1 000 000'],
            examples: [{ input: '3\n1 10\n10 20\n24 28', note: 'Od 1 do 10: 2, 3, 5, 7. Od 10 do 20: 11, 13, 17, 19. Między 24 a 28 nie ma żadnej liczby pierwszej.' }],
            hint: R`int ile[1000001]; przed main. Po sicie: ile[0] = 0; for (int x = 1; x <= N; x++) ile[x] = ile[x - 1] + (zlozona[x] ? 0 : 1);. Dla pytania wypisz ile[b] - ile[a - 1].`,
            tests: (r) => [wiersze(['1 10', '10 20', '24 28']), wiersze(['1 1', '2 2', '1 1000000', '999983 1000000']), wiersze(Array.from({ length: 4000 }, () => { const a = r.int(1, 1000000), b = r.int(1, 1000000); return `${Math.min(a, b)} ${Math.max(a, b)}`; })), wiersze(Array.from({ length: 4000 }, () => { const a = r.int(1, 999000); return `${a} ${a + r.int(0, 1000)}`; }))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 4000) && l.length === q + 1 && l.slice(1).every((w) => { const [a, b] = w.split(' ').map(Number); return calk(a, 1, 1000000) && calk(b, a, 1000000); }) ? null : 'dane'; },
            solve: (inp) => { const z = sito(1000000); const ile = new Int32Array(1000001); for (let x = 1; x <= 1000000; x++) ile[x] = ile[x - 1] + (z[x] ? 0 : 1); return L(inp).slice(1).map((w) => { const [a, b] = w.split(' ').map(Number); return String(ile[b] - ile[a - 1]); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int N = 1000000;
bitset<N + 1> zlozona;
int ile[N + 1];
int main() {
    zlozona[0] = zlozona[1] = 1;
    for (int i = 2; i * i <= N; i++) {
        if (!zlozona[i]) {
            for (int j = i * i; j <= N; j += i) zlozona[j] = 1;
        }
    }
    ile[0] = 0;
    for (int x = 1; x <= N; x++) {
        ile[x] = ile[x - 1] + (zlozona[x] ? 0 : 1);
    }
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int a, b;
        cin >> a >> b;
        cout << ile[b] - ile[a - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-blizniacze', krok: 6, level: 'srednie',
            title: 'Liczby bliźniacze',
            short: 'Liczby bliźniacze to dwie liczby pierwsze różniące się o 2, jak 11 i 13. Po sicie wystarczy sprawdzić !zlozona[p] && !zlozona[p + 2].',
            tags: ['sito do 10⁷', 'para p i p + 2', 'ostatnia znaleziona'],
            statement: ['Para liczb bliźniaczych to dwie liczby pierwsze p i p + 2, na przykład 3 i 5, 5 i 7, 11 i 13. Policz, ile jest par bliźniaczych, w których obie liczby są nie większe od n, i wypisz największą taką parę.',
                'Jeśli nie ma żadnej pary, w drugim wierszu wypisz brak.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['W pierwszym wierszu liczba par.', 'W drugim wierszu największa para (dwie liczby) albo brak.'],
            constraints: ['1 ≤ n ≤ 10 000 000'],
            examples: [{ input: '20', note: 'Pary: 3 i 5, 5 i 7, 11 i 13, 17 i 19 — cztery. Liczba 5 należy do dwóch par.' }, { input: '4', note: 'Para 3 i 5 nie mieści się, bo 5 > 4.' }],
            hint: R`Sito do n, a potem for (int p = 2; p + 2 <= n; p++) if (!zlozona[p] && !zlozona[p + 2]) { ile++; ostatnia = p; }.`,
            tests: () => ['20', '4', '5', '1', '1000', '10000000', '9999973', '1000000', '6'],
            check: (inp) => (/^\d+$/.test(inp) && calk(Number(inp), 1, 10000000) ? null : 'dane'),
            solve: (inp) => { const n = Number(inp); const z = sito(10000000); let c = 0, o = -1; for (let p = 2; p + 2 <= n; p++) if (!z[p] && !z[p + 2]) { c++; o = p; } return `${c}\n${o < 0 ? 'brak' : `${o} ${o + 2}`}`; },
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
    int ile = 0, ostatnia = -1;
    for (int p = 2; p + 2 <= n; p++) {
        if (!zlozona[p] && !zlozona[p + 2]) {
            ile++;
            ostatnia = p;
        }
    }
    cout << ile << "\n";
    if (ostatnia < 0) cout << "brak\n";
    else cout << ostatnia << " " << ostatnia + 2 << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-goldbach', krok: 6, level: 'srednie',
            title: 'Hipoteza Goldbacha',
            short: 'Każdą parzystą liczbę od 4 w górę da się podobno zapisać jako sumę dwóch liczb pierwszych. Po sicie szukaj najmniejszego p, dla którego n − p też jest pierwsze.',
            tags: ['sito do 10⁶', 'p i n − p', 'najmniejsze p'],
            statement: ['Hipoteza Goldbacha mówi, że każda liczba parzysta większa od 2 jest sumą dwóch liczb pierwszych. Nikt jej nie udowodnił, ale sprawdzono ją dla ogromnych liczb. Sprawdź ją i Ty.',
                'Dla każdej z q parzystych liczb n wypisz rozkład n = p + q, w którym p jest najmniejsze możliwe (oczywiście p ≤ q). Zrób sito raz, a potem dla każdego n sprawdzaj kolejne p.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q parzystych liczb n.'],
            output_format: ['q wierszy w postaci n = p + q.'],
            constraints: ['1 ≤ q ≤ 1000', '4 ≤ n ≤ 1 000 000, n parzyste'],
            examples: [{ input: '3\n4 28 100', note: '4 = 2 + 2. 28 = 5 + 23 (28 − 2 = 26 i 28 − 3 = 25 nie są pierwsze). 100 = 3 + 97.' }],
            hint: R`Po sicie do 10⁶: for (int p = 2; ; p++) if (!zlozona[p] && !zlozona[n - p]) { cout << n << " = " << p << " + " << n - p << "\n"; break; }. Najmniejsze p jest zawsze małe, więc ta pętla jest szybka.`,
            tests: (r) => [`3\n4 28 100`, `1\n1000000`, lista(Array.from({ length: 1000 }, () => 2 * r.int(2, 500000))), lista(Array.from({ length: 1000 }, (_, i) => 2 * (i + 2))), lista([4, 6, 8, 10, 12, 98, 128, 1000000, 999998, 4])],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 4, 1000000) && x % 2 === 0) ? null : 'dane'; },
            solve: (inp) => { const z = sito(1000000); return nums(inp).slice(1).map((n) => { for (let p = 2; ; p++) if (!z[p] && !z[n - p]) return `${n} = ${p} + ${n - p}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int N = 1000000;
bitset<N + 1> zlozona;
int main() {
    zlozona[0] = zlozona[1] = 1;
    for (int i = 2; i * i <= N; i++) {
        if (!zlozona[i]) {
            for (int j = i * i; j <= N; j += i) zlozona[j] = 1;
        }
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int n;
        cin >> n;
        for (int p = 2; ; p++) {
            if (!zlozona[p] && !zlozona[n - p]) {
                cout << n << " = " << p << " + " << n - p << "\n";
                break;
            }
        }
    }
    return 0;
}`,
        },
        {
            id: 'bs-najblizsza-pierwsza', krok: 6, level: 'srednie',
            title: 'Najbliższa liczba pierwsza',
            short: 'Szukaj w obie strony naraz: x − d i x + d dla d = 0, 1, 2… Sito musi sięgać trochę za milion — następna pierwsza po 10⁶ to 1 000 003.',
            tags: ['sito z zapasem', 'x − d i x + d', 'remis: mniejsza'],
            statement: ['Dla każdej z q liczb x wypisz liczbę pierwszą najbliższą x. Jeśli dwie liczby pierwsze są tak samo daleko (jedna mniejsza, druga większa od x), wypisz mniejszą. Gdy x samo jest pierwsze, odpowiedzią jest x.',
                'Sprawdzaj odległości d = 0, 1, 2, …: najpierw x − d, potem x + d. Uwaga na zakres: najbliższa liczba pierwsza dla 10⁶ to 1 000 003, więc sito zrób trochę dalej niż do miliona.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczba x.'],
            output_format: ['q wierszy: najbliższe liczby pierwsze.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ x ≤ 1 000 000'],
            examples: [{ input: '5\n1\n10\n12\n97\n1000000', note: 'Dla 1 najbliższa jest 2. 10 leży między 7 a 11 — bliżej 11. 12 jest tak samo daleko od 11 i od 13 — wybieramy 11. 97 jest pierwsza. Milion: 999 983 jest o 17 niżej, a 1 000 003 tylko o 3 wyżej.' }],
            hint: R`bitset<1000101> zlozona; i sito do 1 000 100. Dla x: for (int d = 0; ; d++) { if (x - d >= 2 && !zlozona[x - d]) { … x - d …; break; } if (!zlozona[x + d]) { … x + d …; break; } }.`,
            tests: (r) => [wiersze([1, 10, 12, 97, 1000000]), wiersze([2, 3, 4, 5, 6, 9, 15, 24, 120, 999999]), lista(r.arr(3000, 1, 1000000)).replace(/ /g, '\n'), lista(Array.from({ length: 3000 }, () => r.int(999000, 1000000))).replace(/ /g, '\n')],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1000000)) ? null : 'dane'; },
            solve: (inp) => { const z = sito(1000100); return nums(inp).slice(1).map((x) => { for (let d = 0; ; d++) { if (x - d >= 2 && !z[x - d]) return String(x - d); if (!z[x + d]) return String(x + d); } }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int N = 1000100;
bitset<N + 1> zlozona;
int main() {
    zlozona[0] = zlozona[1] = 1;
    for (int i = 2; i * i <= N; i++) {
        if (!zlozona[i]) {
            for (int j = i * i; j <= N; j += i) zlozona[j] = 1;
        }
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int x;
        cin >> x;
        for (int d = 0; ; d++) {
            if (x - d >= 2 && !zlozona[x - d]) {
                cout << x - d << "\n";
                break;
            }
            if (!zlozona[x + d]) {
                cout << x + d << "\n";
                break;
            }
        }
    }
    return 0;
}`,
        },
        {
            id: 'bs-k-ta-pierwsza', krok: 6, level: 'srednie',
            title: 'k-ta liczba pierwsza',
            short: 'Po sicie do 10⁷ przepisz liczby pierwsze do vectora — jest ich 664 579. Wtedy k-ta liczba pierwsza to po prostu pierwsze[k − 1].',
            tags: ['sito do 10⁷', 'vector<int> pierwsze', 'pierwsze[k - 1]'],
            statement: ['Liczby pierwsze ustawione rosnąco: pierwsza to 2, druga — 3, trzecia — 5, czwarta — 7 i tak dalej. Odpowiedz na q pytań: jaka jest k-ta liczba pierwsza?',
                'Wszystkie odpowiedzi są mniejsze niż 10⁷ — do dziesięciu milionów jest dokładnie 664 579 liczb pierwszych. Zrób sito, przepisz liczby pierwsze do vectora i odpowiadaj odczytem z vectora.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q liczb k.'],
            output_format: ['q wierszy: k-te liczby pierwsze.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ k ≤ 664 579'],
            examples: [{ input: '4\n1 4 10 664579', note: 'Pierwsza to 2, czwarta — 7, dziesiąta — 29, a ostatnia przed dziesięcioma milionami to 9 999 991.' }],
            hint: R`vector<int> pierwsze; for (int i = 2; i <= N; i++) if (!zlozona[i]) pierwsze.push_back(i);. Odpowiedź: pierwsze[k - 1] — vector numeruje od zera.`,
            tests: (r) => [`4\n1 4 10 664579`, lista([1, 2, 3, 100, 1000, 78498, 78499]), lista(r.arr(3000, 1, 664579)), lista(r.arr(3000, 1, 50))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 3000) && t.length === t[0] + 1 && t.slice(1).every((k) => calk(k, 1, 664579)) ? null : 'dane'; },
            solve: (inp) => { const p = pierwszeDo(10000000); return nums(inp).slice(1).map((k) => String(p[k - 1])).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
const int N = 10000000;
bitset<N + 1> zlozona;
int main() {
    zlozona[0] = zlozona[1] = 1;
    for (int i = 2; i * i <= N; i++) {
        if (!zlozona[i]) {
            for (int j = i * i; j <= N; j += i) zlozona[j] = 1;
        }
    }
    vector<int> pierwsze;
    for (int i = 2; i <= N; i++) {
        if (!zlozona[i]) pierwsze.push_back(i);
    }
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int k;
        cin >> k;
        cout << pierwsze[k - 1] << "\n";
    }
    return 0;
}`,
        },
    ];
};
