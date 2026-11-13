// Zbiór — ćwiczenia w trakcie lekcji, części 1–3: pierwszy zbiór (insert, size, przechodzenie, zbiór napisów
// i liter), count i erase („czy to już było?”, polecenia, kilka testów, pętla w ciągu) oraz najmniejszy,
// największy i iteratory (begin, rbegin, erase skrajnych, sąsiedzi, k-ty element, zbiór jako kolejka).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks, rng } = h;
    const P = require('./zbior-pomoc');
    const { Zbior, rozne, unikalne, imie } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const losy = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const lista = (a) => `${a.length}\n${a.join(' ')}`;
    const calk = (x, lo, hi) => Number.isInteger(x) && x >= lo && x <= hi;

    return [
        // ================================================================ KROK 1 · pierwszy zbiór
        {
            id: 'zb-rozne-numery', krok: 1, level: 'latwe',
            title: 'Ile różnych numerów?',
            short: 'Bramka na mecie zapisuje numer przy każdym okrążeniu. Ilu różnych zawodników przebiegło?',
            tags: ['insert', 'size()', 'powtórki odpadają'],
            statement: ['Na mecie biegu bramka zapisuje numer zawodnika za każdym razem, gdy ten pod nią przebiegnie — także na kolejnych okrążeniach, więc numery się powtarzają.',
                'Dostajesz listę n zapisanych numerów. Ilu różnych zawodników przebiegło pod bramką?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n numerów zawodników.'],
            output_format: ['Jedna liczba — ilu było różnych zawodników.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ numer ≤ 1 000 000'],
            examples: [{ input: '7\n12 7 12 33 7 12 101', note: 'Różne numery to 7, 12, 33 i 101 — czterech zawodników.' }],
            hint: R`Wczytaj n, utwórz pusty set<int> i w pętli wczytuj kolejne numery do zwykłej zmiennej, a potem wstawiaj je do zbioru przez insert. Powtórzone numery zbiór zignoruje. Na końcu wypisz s.size().`,
            tests: (r) => [lista([5]), lista([3, 3, 3, 3]), lista([1, 2, 3, 4, 5, 6]), lista(losy(r, 30, 1, 10)), lista(losy(r, 2000, 1, 1000)),
                lista(losy(r, 10000, 1, 1000000)), lista(losy(r, 10000, 1, 50)), lista(losy(r, 10000, 999000, 1000000))],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 10000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, 1, 1000000)) ? null : 'zakres'; },
            solve: (inp) => String(new Set(nums(inp).slice(1)).size),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.insert(x);
    }
    cout << s.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-bez-powtorzen-rosnaco', krok: 1, level: 'latwe',
            title: 'Rosnąco i bez powtórzeń',
            short: 'Wypisz różne wartości z listy, od najmniejszej. Zbiór sam usunie powtórki i ułoży liczby.',
            tags: ['insert', 'for (int x : s)', 'liczby ujemne'],
            statement: ['Dostajesz n liczb całkowitych — mogą być ujemne i mogą się powtarzać. Wypisz wszystkie różne wartości w kolejności rosnącej, w jednym wierszu, oddzielone spacjami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz — różne wartości rosnąco, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '9\n3 -1 3 10 -1 0 7 10 3', note: 'Różne wartości to −1, 0, 3, 7 i 10.' }],
            hint: R`Wstaw wszystkie liczby do set<int>, a potem przejdź zbiór pętlą for (int x : s) i wypisuj x ze spacją. Zbiór przechodzi elementy rosnąco — nie potrzebujesz sort.`,
            tests: (r) => [lista([42]), lista([-5, -5, -5]), lista([5, 4, 3, 2, 1, 0, -1]), lista(losy(r, 40, -10, 10)), lista(losy(r, 500, -1000, 1000)),
                lista(losy(r, 2000, -1000000000, 1000000000)), lista([...losy(r, 1000, -1000000000, -999999000), ...losy(r, 1000, 999999000, 1000000000)])],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 2000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'zakres'; },
            solve: (inp) => rozne(nums(inp).slice(1)).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.insert(x);
    }
    for (int x : s) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-litery-slowa', krok: 1, level: 'latwe',
            title: 'Litery w słowie',
            short: 'Ile różnych liter ma słowo i jakie to litery — alfabetycznie? set<char>.',
            tags: ['set<char>', 'size()', 'litery alfabetycznie'],
            statement: ['Dostajesz słowo złożone z małych liter alfabetu angielskiego. Wypisz, ile różnych liter zawiera, a potem te litery w kolejności alfabetycznej.'],
            input_format: ['Jeden wiersz — słowo.'],
            output_format: ['W pierwszym wierszu liczba różnych liter.', 'W drugim wierszu te litery alfabetycznie, bez spacji.'],
            constraints: ['Słowo ma od 1 do 50 000 liter (tylko a–z).'],
            examples: [{ input: 'programowanie', note: 'Litery słowa to p, r, o, g, a, m, w, n, i, e — dziesięć różnych. Alfabetycznie: a, e, g, i, m, n, o, p, r, w.' }],
            hint: R`Wczytaj słowo do string, a potem wstaw każdą jego literę do set<char> (pętla for (char c : slowo)). Na końcu wypisz size() i przejdź zbiór pętlą, wypisując litery bez spacji. Litery w zbiorze same ułożą się alfabetycznie.`,
            tests: (r) => ['a', 'zzzzzz', 'abcdefghijklmnopqrstuvwxyz', 'zyxwvutsrqponmlkjihgfedcba', 'mississippi', r.word(20, 'abcde'), r.word(5000), r.word(50000, 'qwerty'), r.word(50000)],
            check: (inp) => (/^[a-z]{1,50000}$/.test(inp.trim()) ? null : 'słowo'),
            solve: (inp) => { const l = rozne([...inp.trim()]); return `${l.length}\n${l.join('')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string slowo;
    cin >> slowo;
    set<char> litery;
    for (char c : slowo) litery.insert(c);
    cout << litery.size() << "\n";
    for (char c : litery) cout << c;
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-slowa-alfabetycznie', krok: 1, level: 'latwe',
            title: 'Słowniczek z wypracowania',
            short: 'Z listy słów zrób słowniczek: każde słowo raz, alfabetycznie. set<string>.',
            tags: ['set<string>', 'porządek słownikowy', 'size()'],
            statement: ['Nauczyciel robi słowniczek z wypracowania ucznia. Dostajesz n słów z wypracowania (słowa się powtarzają). Wypisz, ile jest różnych słów, a potem każde różne słowo w osobnym wierszu, w porządku alfabetycznym.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów oddzielonych spacjami (tylko małe litery a–z).'],
            output_format: ['W pierwszym wierszu liczba różnych słów.', 'Potem różne słowa alfabetycznie, każde w osobnym wierszu.'],
            constraints: ['1 ≤ n ≤ 2000', 'Każde słowo ma od 1 do 10 liter.'],
            examples: [{ input: '8\nala ma kota a kot ma ale a', note: 'Różne słowa to a, ala, ale, kot, kota, ma. „a” jest przed „ala”, bo jest jego początkiem, a „kot” przed „kota” z tego samego powodu.' }],
            hint: R`Wczytuj słowa do string i wstawiaj do set<string>. Zbiór napisów układa je w porządku słownikowym — tym samym, którego używa sort. Wypisz size(), a potem przejdź zbiór pętlą for (string w : s).`,
            tests: (r) => {
                const slowa = (n, pula) => { const p = Array.from({ length: pula }, () => r.word(r.int(1, 10))); return `${n}\n${Array.from({ length: n }, () => r.pick(p)).join(' ')}`; };
                return ['1\nkot', '4\nb b b b', '6\nzebra yeti x w v u', '5\nab a abc ab abcd', slowa(30, 8), slowa(500, 100), slowa(2000, 2000), slowa(2000, 30),
                    `2000\n${Array.from({ length: 2000 }, () => r.word(r.int(1, 3), 'ab')).join(' ')}`];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 2000) || t.length !== n + 1) return 'n'; return t.slice(1).every((w) => /^[a-z]{1,10}$/.test(w)) ? null : 'słowo'; },
            solve: (inp) => { const w = rozne(toks(inp).slice(1)); return `${w.length}\n${w.join('\n')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<string> s;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        s.insert(w);
    }
    cout << s.size() << "\n";
    for (string w : s) cout << w << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-reszty', krok: 1, level: 'latwe',
            title: 'Różne reszty',
            short: 'Jakie różne reszty z dzielenia przez k dają liczby z listy? Wstaw do zbioru x % k.',
            tags: ['insert(x % k)', 'size()', 'rosnąco'],
            statement: ['Dostajesz n liczb naturalnych i liczbę k. Każdą liczbę dzielisz przez k i zapisujesz resztę. Ile różnych reszt otrzymasz? Wypisz ich liczbę, a potem same reszty rosnąco.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb naturalnych.'],
            output_format: ['W pierwszym wierszu liczba różnych reszt.', 'W drugim wierszu te reszty rosnąco, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 5000', '1 ≤ k ≤ 2000', '0 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6 4\n10 3 7 21 14 5', note: 'Reszty z dzielenia przez 4: 2, 3, 3, 1, 2, 1. Różne są trzy: 1, 2 i 3.' }],
            hint: R`Do zbioru wstawiaj nie samą liczbę, tylko jej resztę: s.insert(x % k). Potem wypisz size() i przejdź zbiór pętlą. Gdy k = 1, każda reszta to 0.`,
            tests: (r) => {
                const t = (n, k, lo, hi) => `${n} ${k}\n${losy(r, n, lo, hi).join(' ')}`;
                return ['1 1\n123456789', '3 10\n10 20 30', '5 2\n1 3 5 7 9', t(20, 7, 0, 100), t(1000, 13, 0, 1e9), t(5000, 2000, 0, 1e9), t(5000, 1999, 0, 5000),
                    `4 1000\n0 1000 2000 1000000000`, t(5000, 1, 0, 1e9)];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; if (!calk(n, 1, 5000) || !calk(k, 1, 2000) || t.length !== n + 2) return 'n, k'; return t.slice(2).every((x) => calk(x, 0, 1e9)) ? null : 'zakres'; },
            solve: (inp) => { const t = nums(inp); const k = t[1]; const s = rozne(t.slice(2).map((x) => x % k)); return `${s.length}\n${s.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    set<int> reszty;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        reszty.insert(x % k);
    }
    cout << reszty.size() << "\n";
    for (int r : reszty) cout << r << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-ile-cyfr', krok: 1, level: 'latwe',
            title: 'Ile różnych cyfr?',
            short: 'Dla każdej liczby: ile różnych cyfr ma jej zapis? Nowy zbiór dla każdej liczby.',
            tags: ['set<char>', 'kilka testów', 'liczba jako napis'],
            statement: ['Dla każdej z t liczb wypisz, ile różnych cyfr występuje w jej zapisie dziesiętnym.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy jedna liczba naturalna (bez zer na początku).'],
            output_format: ['t wierszy — w każdym liczba różnych cyfr.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '4\n1223334444\n0\n1000000000000000000\n9876543210', note: 'W 1223334444 są cyfry 1, 2, 3, 4. Zero ma jedną cyfrę. 10¹⁸ to jedynka i same zera — dwie różne cyfry. Ostatnia liczba ma wszystkie dziesięć cyfr.' }],
            hint: R`Najprościej wczytać liczbę jako string i wstawić każdy jej znak do set<char>. Dla każdej liczby potrzebny jest nowy, pusty zbiór — utwórz go wewnątrz pętli (albo wywołaj clear()). Możesz też wczytać long long i zbierać cyfry przez % 10 i / 10 — wtedy pamiętaj o liczbie 0.`,
            tests: (r) => {
                const b = (lo, hi) => String(r.big(lo, hi));
                return ['1\n0', '1\n7', '3\n10\n11\n100', '5\n1000000000000000000\n999999999999999999\n123456789\n5555\n90', `20\n${Array.from({ length: 20 }, () => b(0, 1000)).join('\n')}`,
                    `1000\n${Array.from({ length: 1000 }, () => b(0, 10n ** 18n)).join('\n')}`, `1000\n${Array.from({ length: 1000 }, () => String(r.pick([1, 2, 3, 7, 9])).repeat(r.int(1, 18))).join('\n')}`];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 1000) || t.length !== n + 1) return 't'; return t.slice(1).every((x) => /^(0|[1-9]\d*)$/.test(x) && BigInt(x) <= 10n ** 18n) ? null : 'liczba'; },
            solve: (inp) => toks(inp).slice(1).map((x) => String(new Set(x).size)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        string x;
        cin >> x;
        set<char> cyfry;
        for (char c : x) cyfry.insert(c);
        cout << cyfry.size() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-tabliczka', krok: 1, level: 'srednie',
            title: 'Różne wyniki tabliczki mnożenia',
            short: 'W tabliczce n × n wiele iloczynów się powtarza. Ile jest różnych liczb?',
            tags: ['pętla w pętli', 'insert(i * j)', 'size()'],
            statement: ['W tabliczce mnożenia n × n w wierszu i i kolumnie j stoi iloczyn i · j (dla 1 ≤ i, j ≤ n). Wiele liczb powtarza się w niej kilka razy — np. 12 = 3 · 4 = 2 · 6.',
                'Ile różnych liczb występuje w tabliczce n × n?'],
            input_format: ['Jedna liczba n.'],
            output_format: ['Jedna liczba — ile różnych iloczynów jest w tabliczce.'],
            constraints: ['1 ≤ n ≤ 600'],
            examples: [{ input: '4', note: 'Tabliczka 4 × 4 zawiera liczby 1, 2, 3, 4, 6, 8, 9, 12 i 16 — dziewięć różnych.' }],
            hint: R`Dwie pętle: i od 1 do n i j od 1 do n, a w środku s.insert(i * j). Wynik to s.size(). Ponieważ i · j = j · i, wystarczy brać j od i do n — wstawień będzie o połowę mniej. Dla n = 600 iloczyn to najwyżej 360 000, mieści się w int.`,
            tests: () => ['1', '2', '4', '10', '57', '100', '333', '599', '600'],
            check: (inp) => (calk(Number(inp.trim()), 1, 600) ? null : 'n'),
            solve: (inp) => { const n = Number(inp.trim()); const s = new Set(); for (let i = 1; i <= n; i++) for (let j = i; j <= n; j++) s.add(i * j); return String(s.size); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> s;
    for (int i = 1; i <= n; i++)
        for (int j = i; j <= n; j++)
            s.insert(i * j);
    cout << s.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-sumy-dwoch', krok: 1, level: 'srednie',
            title: 'Sumy dwóch kart',
            short: 'Dwie różne karty, jedna suma. Ile różnych sum da się dostać? Uwaga na zakres typu.',
            tags: ['pary i < j', 'set<long long>', 'najmniejsza i największa'],
            statement: ['Na stole leży n kart z liczbami. Wybierasz dwie różne karty (dwie różne pozycje — liczby na nich mogą być równe) i dodajesz ich liczby.',
                'Ile różnych sum można w ten sposób otrzymać? Wypisz liczbę różnych sum, a także najmniejszą i największą z nich.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb na kartach.'],
            output_format: ['Trzy liczby oddzielone spacjami: liczba różnych sum, najmniejsza suma, największa suma.'],
            constraints: ['2 ≤ n ≤ 400', '1 ≤ liczba na karcie ≤ 10⁹'],
            examples: [{ input: '4\n1 3 3 5', note: 'Pary dają sumy 4, 4, 6, 6, 8, 8 (3 + 3 = 6 to dwie różne karty z trójkami). Różne sumy: 4, 6, 8.' }],
            hint: R`Dwie pętle po parach (i od 0, j od i + 1) i wstawianie t[i] + t[j] do zbioru. Uwaga: suma dwóch liczb do 10⁹ może przekroczyć zakres int — trzymaj liczby i zbiór w long long. Najmniejsza suma to pierwszy element przechodzenia zbioru, największa — ostatni (albo poznasz *s.begin() i *s.rbegin() w części 3).`,
            tests: (r) => [lista([1, 1]), lista([5, 7]), lista([2, 2, 2, 2, 2]), lista([1, 2, 3, 4, 5, 6, 7, 8]), lista(losy(r, 50, 1, 20)), lista(losy(r, 400, 1, 1000)),
                lista(losy(r, 400, 1, 1e9)), lista(losy(r, 400, 999999000, 1e9)), lista([1e9, 1e9, 1e9])],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 2, 400) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'zakres'; },
            solve: (inp) => { const t = nums(inp).slice(1); const s = new Set(); for (let i = 0; i < t.length; i++) for (let j = i + 1; j < t.length; j++) s.add(t[i] + t[j]); const a = [...s]; return `${a.length} ${Math.min(...a)} ${Math.max(...a)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> t(n);
    for (long long &x : t) cin >> x;
    set<long long> sumy;
    for (int i = 0; i < n; i++)
        for (int j = i + 1; j < n; j++)
            sumy.insert(t[i] + t[j]);
    cout << sumy.size() << " " << *sumy.begin() << " " << *sumy.rbegin() << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 2 · count, erase, empty
        {
            id: 'zb-nowy-czy-znany', krok: 2, level: 'latwe',
            title: 'Nowy czy znany?',
            short: 'Czytelnicy pokazują karty biblioteczne. Kto przyszedł pierwszy raz, a kto już był?',
            tags: ['count', 'najpierw pytaj, potem wstaw'],
            statement: ['Do szkolnej biblioteki przychodzą po kolei czytelnicy i każdy pokazuje kartę z numerem. Dla każdego czytelnika wypisz NOWY, jeśli przyszedł pierwszy raz, albo ZNANY, jeśli był już wcześniej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n numerów kart, w kolejności przychodzenia.'],
            output_format: ['n wierszy — w każdym NOWY albo ZNANY.'],
            constraints: ['1 ≤ n ≤ 3000', '1 ≤ numer karty ≤ 10⁹'],
            examples: [{ input: '5\n100 20 100 100 3', note: 'Karta 100 pojawia się trzy razy: pierwszy raz jest nowa, potem znana.' }],
            hint: R`Zbiór widziane pamięta numery, które już były. Dla każdego numeru najpierw zapytaj widziane.count(x) i wypisz odpowiedź, a dopiero potem wstaw x do zbioru. W odwrotnej kolejności każdy numer wyjdzie ZNANY.`,
            tests: (r) => [lista([7]), lista([7, 7]), lista([1, 2, 3]), lista(losy(r, 20, 1, 6)), lista(losy(r, 1000, 1, 300)), lista(losy(r, 3000, 1, 1e9)), lista(losy(r, 3000, 1, 2000))],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 3000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'zakres'; },
            solve: (inp) => { const s = new Set(); return nums(inp).slice(1).map((x) => { const w = s.has(x) ? 'ZNANY' : 'NOWY'; s.add(x); return w; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> widziane;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (widziane.count(x)) cout << "ZNANY\n";
        else cout << "NOWY\n";
        widziane.insert(x);
    }
    return 0;
}`,
        },
        {
            id: 'zb-pierwsza-powtorka', krok: 2, level: 'latwe',
            title: 'Pierwsza powtórka w każdej grze',
            short: 'Kilka gier w pamięć. W każdej: która karta jako pierwsza pojawiła się drugi raz? Czytaj do końca!',
            tags: ['count', 'kilka testów', 'nowy zbiór w teście'],
            statement: ['W grze w pamięć gracz odkrywa po kolei karty z numerami. Dla każdej z t gier znajdź pierwszą odkrytą kartę, której numer już wcześniej się pojawił w tej grze, i wypisz ten numer. Jeśli w grze żaden numer się nie powtórzył, wypisz BRAK.',
                'Gry są od siebie niezależne — karty z poprzedniej gry się nie liczą.'],
            input_format: ['W pierwszym wierszu liczba gier t.', 'Każda gra to dwa wiersze: liczba kart n, a potem n numerów kart w kolejności odkrywania.'],
            output_format: ['t wierszy — dla każdej gry numer pierwszej powtórki albo BRAK.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 1000', 'Suma wszystkich n ≤ 10 000', '1 ≤ numer ≤ 10⁶'],
            examples: [{ input: '3\n5\n4 1 9 1 4\n3\n1 2 3\n4\n7 7 2 2', note: 'W pierwszej grze jako pierwsza powtarza się jedynka (pozycja 4), a czwórka dopiero na pozycji 5. W drugiej grze nic się nie powtarza. W trzeciej od razu siódemka.' }],
            hint: R`Dla każdej gry utwórz nowy, pusty zbiór. Gdy znajdziesz powtórkę, zapamiętaj ją (np. w zmiennej odp = -1 na starcie), ale NIE przerywaj wczytywania — pozostałe karty tej gry wciąż czekają na wejściu i trzeba je przeczytać, zanim zaczniesz następną grę. Zapamiętuj tylko pierwszą powtórkę: if (odp == -1 && s.count(x)) odp = x;`,
            tests: (r) => {
                const gry = (t, n, hi) => { const g = []; for (let i = 0; i < t; i++) { const k = r.int(1, n); g.push(`${k}\n${losy(r, k, 1, hi).join(' ')}`); } return `${t}\n${g.join('\n')}`; };
                return ['1\n1\n5', '1\n2\n5 5', '2\n3\n1 2 1\n3\n1 2 1', '2\n4\n1 2 3 4\n2\n4 4', gry(10, 10, 15), gry(50, 100, 200), gry(100, 100, 1e6), gry(10, 1000, 1000), gry(10, 1000, 1e6)];
            },
            check: (inp) => {
                const t = nums(inp); const g = t[0]; if (!calk(g, 1, 100)) return 't';
                let i = 1, suma = 0;
                for (let k = 0; k < g; k++) { const n = t[i++]; if (!calk(n, 1, 1000)) return 'n'; suma += n; for (let j = 0; j < n; j++) if (!calk(t[i++], 1, 1e6)) return 'numer'; }
                return i === t.length && suma <= 10000 ? null : 'długość';
            },
            solve: (inp) => {
                const t = nums(inp); let i = 1; const out = [];
                for (let k = 0; k < t[0]; k++) { const n = t[i++]; const s = new Set(); let odp = 'BRAK'; for (let j = 0; j < n; j++) { const x = t[i++]; if (odp === 'BRAK' && s.has(x)) odp = String(x); s.add(x); } out.push(odp); }
                return out.join('\n');
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
        set<int> s;
        int odp = -1;
        for (int i = 0; i < n; i++) {
            int x;
            cin >> x;
            if (odp == -1 && s.count(x)) odp = x;
            s.insert(x);
        }
        if (odp == -1) cout << "BRAK\n";
        else cout << odp << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-polecenia', krok: 2, level: 'latwe',
            title: 'Polecenia dla zbioru',
            short: 'DODAJ, USUN i CZY — wykonaj polecenia na zbiorze i odpowiadaj na pytania.',
            tags: ['insert', 'erase', 'count', 'polecenia'],
            statement: ['Na początku zbiór jest pusty. Wykonaj po kolei q poleceń:',
                'DODAJ x — wstaw x do zbioru (jeśli już jest, nic się nie zmienia),',
                'USUN x — usuń x ze zbioru (jeśli go nie ma, nic się nie dzieje),',
                'CZY x — wypisz TAK, jeśli x jest w zbiorze, albo NIE.',
                'Po wykonaniu wszystkich poleceń wypisz jeszcze, ile elementów zostało w zbiorze.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy polecenie i liczba x.'],
            output_format: ['Odpowiedzi na polecenia CZY, każda w osobnym wierszu, a w ostatnim wierszu — rozmiar zbioru na końcu.'],
            constraints: ['1 ≤ q ≤ 5000', '−10⁹ ≤ x ≤ 10⁹'],
            examples: [{ input: '7\nDODAJ 5\nDODAJ -3\nCZY 5\nUSUN 5\nCZY 5\nUSUN 8\nCZY -3', note: 'Po usunięciu piątki odpowiedź na CZY 5 zmienia się na NIE. USUN 8 nic nie robi. Na końcu w zbiorze zostaje tylko −3.' }],
            hint: R`Wczytuj polecenie do string i liczbę do int (albo long long). Porównuj polecenie przez == i wywołuj insert, erase albo count. Rozmiar wypisz po pętli: s.size(). Ani insert powtórki, ani erase nieistniejącej liczby nie powodują błędu.`,
            tests: (r) => {
                const pol = (q, hi) => { const w = []; for (let i = 0; i < q; i++) { const x = r.int(-hi, hi); w.push(`${r.pick(['DODAJ', 'DODAJ', 'USUN', 'CZY', 'CZY'])} ${x}`); } return `${q}\n${w.join('\n')}`; };
                return ['1\nCZY 0', '2\nDODAJ 1\nDODAJ 1', '4\nUSUN 7\nCZY 7\nDODAJ 7\nCZY 7', pol(20, 5), pol(500, 50), pol(5000, 1000), pol(5000, 1e9), pol(5000, 3)];
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 5000) || t.length !== 1 + 2 * q) return 'q'; for (let i = 0; i < q; i++) { if (!['DODAJ', 'USUN', 'CZY'].includes(t[1 + 2 * i])) return 'polecenie'; if (!calk(Number(t[2 + 2 * i]), -1e9, 1e9)) return 'x'; } return null; },
            solve: (inp) => { const t = toks(inp); const s = new Set(); const out = []; for (let i = 0; i < Number(t[0]); i++) { const p = t[1 + 2 * i], x = Number(t[2 + 2 * i]); if (p === 'DODAJ') s.add(x); else if (p === 'USUN') s.delete(x); else out.push(s.has(x) ? 'TAK' : 'NIE'); } out.push(String(s.size)); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    set<int> s;
    while (q--) {
        string p;
        int x;
        cin >> p >> x;
        if (p == "DODAJ") s.insert(x);
        else if (p == "USUN") s.erase(x);
        else cout << (s.count(x) ? "TAK" : "NIE") << "\n";
    }
    cout << s.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-nieobecni', krok: 2, level: 'latwe',
            title: 'Kto nie przyszedł?',
            short: 'Lista klasy i wpisy obecnych. Wypisz nieobecnych w kolejności z dziennika: vector + set.',
            tags: ['set<string>', 'count', 'kolejność z wejścia'],
            statement: ['Dziennik klasy zawiera n imion uczniów (imiona się nie powtarzają). Na zajęciach obecni wpisywali się na listę — było m wpisów, ktoś mógł wpisać się kilka razy, a czasem wpisywał się gość spoza klasy.',
                'Wypisz imiona nieobecnych uczniów w kolejności z dziennika, każde w osobnym wierszu. Jeśli byli wszyscy, wypisz WSZYSCY.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu n imion z dziennika.', 'W trzecim wierszu m imion z listy obecności.'],
            output_format: ['Imiona nieobecnych w kolejności z dziennika, każde w osobnym wierszu — albo jedno słowo WSZYSCY.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ m ≤ 3000', 'Imię to wielka litera i od 1 do 11 małych liter (bez polskich znaków).'],
            examples: [{ input: '4 5\nZosia Adam Bartek Ola\nOla Adam Ola Kuba Zosia', note: 'Nie wpisał się tylko Bartek. Kuba to gość spoza klasy — nie ma go w dzienniku, więc się nie liczy.' }],
            hint: R`Dziennik wczytaj do vector<string> — liczy się jego kolejność. Listę obecności wczytaj do set<string>. Potem przejdź dziennik i wypisz imiona, których zbiór nie zna (!obecni.count(imie)). Zapamiętaj w zmiennej, czy ktoś był nieobecny — jeśli nie, wypisz WSZYSCY.`,
            tests: (r) => {
                const t = (n, m, czesc) => { const kl = unikalne(r, n + 20, () => imie(r, 2, 12)); const klasa = kl.slice(0, n), goscie = kl.slice(n); const ob = Array.from({ length: m }, () => (r() < 0.05 ? r.pick(goscie) : r.pick(klasa.slice(0, Math.max(1, Math.floor(n * czesc)))))); return `${n} ${m}\n${klasa.join(' ')}\n${ob.join(' ')}`; };
                return ['1 1\nAla\nAla', '1 1\nAla\nOla', '3 3\nAla Ola Ela\nEla Ola Ala', '3 4\nAla Ola Ela\nOla Ola Ola Ola', t(10, 15, 0.6), t(30, 100, 1), t(500, 400, 0.5), t(2000, 3000, 0.9), t(2000, 100, 1)];
            },
            check: (inp) => { const t = toks(inp); const [n, m] = t.slice(0, 2).map(Number); if (!calk(n, 1, 2000) || !calk(m, 1, 3000) || t.length !== 2 + n + m) return 'n, m'; if (!t.slice(2).every((w) => /^[A-Z][a-z]{1,11}$/.test(w))) return 'imię'; return new Set(t.slice(2, 2 + n)).size === n ? null : 'powtórzone imię w dzienniku'; },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const ob = new Set(t.slice(2 + n)); const nie = t.slice(2, 2 + n).filter((w) => !ob.has(w)); return nie.length ? nie.join('\n') : 'WSZYSCY'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> dziennik(n);
    for (string &w : dziennik) cin >> w;
    set<string> obecni;
    for (int i = 0; i < m; i++) {
        string w;
        cin >> w;
        obecni.insert(w);
    }
    bool ktos = false;
    for (string w : dziennik)
        if (!obecni.count(w)) {
            cout << w << "\n";
            ktos = true;
        }
    if (!ktos) cout << "WSZYSCY\n";
    return 0;
}`,
        },
        {
            id: 'zb-impreza', krok: 2, level: 'srednie',
            title: 'Kto jest na imprezie?',
            short: 'WCHODZI i WYCHODZI. Po każdym wpisie: ile osób w środku? Na koniec — kto został.',
            tags: ['insert', 'erase', 'size()', 'set<string>'],
            statement: ['Bramkarz zapisuje, kto wchodzi na imprezę i kto z niej wychodzi. Wpisy mają postać WCHODZI imie albo WYCHODZI imie. Dane są poprawne: nikt nie wchodzi, gdy już jest w środku, i nikt nie wychodzi, gdy go nie ma.',
                'Po każdym wpisie wypisz, ile osób jest na imprezie. Na koniec wypisz w jednym wierszu imiona osób, które zostały — alfabetycznie, oddzielone spacjami — albo PUSTO, jeśli nikogo nie ma.'],
            input_format: ['W pierwszym wierszu liczba wpisów q.', 'W każdym z następnych q wierszy wpis: WCHODZI albo WYCHODZI i imię.'],
            output_format: ['q wierszy z liczbą osób po każdym wpisie, a potem jeden wiersz z imionami tych, którzy zostali (albo PUSTO).'],
            constraints: ['1 ≤ q ≤ 1500', 'Imię to od 1 do 10 małych liter a–z.'],
            examples: [{ input: '6\nWCHODZI ola\nWCHODZI adam\nWCHODZI kuba\nWYCHODZI ola\nWCHODZI ola\nWYCHODZI kuba', note: 'Ola wychodzi i wraca. Na końcu zostają adam i ola.' }],
            hint: R`Trzymaj set<string> osób w środku: WCHODZI to insert, WYCHODZI to erase, a po każdym wpisie wypisz size(). Na koniec sprawdź empty() — jeśli zbiór jest pusty, wypisz PUSTO, a jeśli nie, przejdź go pętlą (imiona wyjdą alfabetycznie).`,
            tests: (r) => {
                const t = (q, pula) => { const ludzie = unikalne(r, pula, () => r.word(r.int(1, 10))); const w = new Set(); const out = []; for (let i = 0; i < q; i++) { const kto = r.pick(ludzie); if (w.has(kto)) { w.delete(kto); out.push(`WYCHODZI ${kto}`); } else { w.add(kto); out.push(`WCHODZI ${kto}`); } } return `${q}\n${out.join('\n')}`; };
                return ['1\nWCHODZI ala', '2\nWCHODZI ala\nWYCHODZI ala', '4\nWCHODZI zz\nWCHODZI a\nWCHODZI m\nWYCHODZI a', t(20, 5), t(300, 40), t(1500, 1500), t(1500, 30), t(1500, 2)];
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 1500) || t.length !== 1 + 2 * q) return 'q'; const w = new Set(); for (let i = 0; i < q; i++) { const p = t[1 + 2 * i], kto = t[2 + 2 * i]; if (!/^[a-z]{1,10}$/.test(kto)) return 'imię'; if (p === 'WCHODZI') { if (w.has(kto)) return 'wchodzi drugi raz'; w.add(kto); } else if (p === 'WYCHODZI') { if (!w.has(kto)) return 'wychodzi, choć go nie ma'; w.delete(kto); } else return 'wpis'; } return null; },
            solve: (inp) => { const t = toks(inp); const w = new Set(); const out = []; for (let i = 0; i < Number(t[0]); i++) { if (t[1 + 2 * i] === 'WCHODZI') w.add(t[2 + 2 * i]); else w.delete(t[2 + 2 * i]); out.push(String(w.size)); } out.push(w.size ? rozne([...w]).join(' ') : 'PUSTO'); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    set<string> w;
    while (q--) {
        string p, kto;
        cin >> p >> kto;
        if (p == "WCHODZI") w.insert(kto);
        else w.erase(kto);
        cout << w.size() << "\n";
    }
    if (w.empty()) cout << "PUSTO\n";
    else {
        for (string kto : w) cout << kto << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-szczesliwe', krok: 2, level: 'srednie',
            title: 'Liczby szczęśliwe',
            short: 'Zamieniaj liczbę na sumę kwadratów cyfr. Dojdziesz do 1 czy wpadniesz w pętlę? Zbiór wykryje powtórkę.',
            tags: ['count', 'wykrywanie pętli', 'cyfry liczby'],
            statement: ['Weź liczbę n i zastąp ją sumą kwadratów jej cyfr, np. 49 → 4² + 9² = 97. Powtarzaj to samo z wynikiem. Liczba jest szczęśliwa, jeśli w końcu dojdziesz do 1. Jeśli nie, ciąg wpadnie w pętlę i liczby zaczną się powtarzać.',
                'Dla każdej z t liczb wypisz TAK, jeśli jest szczęśliwa, albo NIE — a obok, ile różnych liczb pojawiło się w jej ciągu (łącznie z samą liczbą n; dla liczby szczęśliwej łącznie z końcową jedynką).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy jedna liczba n.'],
            output_format: ['t wierszy — TAK albo NIE i liczba różnych liczb w ciągu.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 10⁹'],
            examples: [{ input: '3\n7\n4\n1', note: '7 → 49 → 97 → 130 → 10 → 1: sześć różnych liczb, szczęśliwa. 4 → 16 → 37 → 58 → 89 → 145 → 42 → 20 → 4: wróciliśmy do 4, więc różnych liczb było 8. Jedynka od razu jest szczęśliwa.' }],
            hint: R`Dla każdej liczby utwórz nowy zbiór widziane. W pętli: jeśli x == 1 — szczęśliwa; jeśli widziane.count(x) — pętla, nieszczęśliwa. W przeciwnym razie wstaw x i zamień go na sumę kwadratów cyfr (cyfry wyciągasz przez % 10 i / 10). Liczba różnych liczb to rozmiar zbioru — dla szczęśliwej pamiętaj o wstawieniu końcowej jedynki.`,
            tests: (r) => ['1\n1', '1\n2', '2\n7\n4', '5\n10\n13\n19\n20\n100', `30\n${Array.from({ length: 30 }, (_, i) => i + 1).join('\n')}`, `1000\n${losy(r, 1000, 1, 1e9).join('\n')}`, `1000\n${losy(r, 1000, 1, 1000).join('\n')}`],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 1000) || t.length !== n + 1) return 't'; return t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'zakres'; },
            solve: (inp) => nums(inp).slice(1).map((n) => {
                const s = new Set(); let x = n;
                for (;;) {
                    if (x === 1) { s.add(1); return `TAK ${s.size}`; }
                    if (s.has(x)) return `NIE ${s.size}`;
                    s.add(x);
                    let y = 0; for (let v = x; v > 0; v = Math.floor(v / 10)) y += (v % 10) ** 2;
                    x = y;
                }
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long x;
        cin >> x;
        set<long long> widziane;
        bool szczesliwa;
        while (true) {
            if (x == 1) {
                widziane.insert(1);
                szczesliwa = true;
                break;
            }
            if (widziane.count(x)) {
                szczesliwa = false;
                break;
            }
            widziane.insert(x);
            long long y = 0;
            while (x > 0) {
                y += (x % 10) * (x % 10);
                x /= 10;
            }
            x = y;
        }
        cout << (szczesliwa ? "TAK " : "NIE ") << widziane.size() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-pelna-kolekcja', krok: 2, level: 'latwe',
            title: 'Pełna kolekcja',
            short: 'Album ma k naklejek. Po której kupionej naklejce jest pełny? A jeśli nigdy — ilu brakuje?',
            tags: ['insert', 'size() == k', 'moment zapełnienia'],
            statement: ['Album ma k miejsc na naklejki o numerach od 1 do k. Kupujesz po kolei n naklejek (numery mogą się powtarzać — duplikaty odkładasz do pudełka).',
                'Po której kupionej naklejce album stał się pełny? Wypisz jej numer porządkowy (licząc od 1). Jeśli album nie zapełnił się nawet po wszystkich zakupach, wypisz NIE i liczbę brakujących naklejek.'],
            input_format: ['W pierwszym wierszu liczby k i n.', 'W drugim wierszu n numerów kupionych naklejek, w kolejności zakupu.'],
            output_format: ['Jedna liczba — numer zakupu, który zapełnił album — albo NIE i liczba brakujących naklejek.'],
            constraints: ['1 ≤ k ≤ 1000', '1 ≤ n ≤ 10 000', '1 ≤ numer naklejki ≤ k'],
            examples: [{ input: '3 7\n1 3 1 1 2 3 2', note: 'Po piątym zakupie (naklejka nr 2) album ma naklejki 1, 2, 3 — jest pełny.' }, { input: '4 3\n1 1 2', note: 'Brakuje naklejek 3 i 4.' }],
            hint: R`Wstawiaj kupione naklejki do zbioru i po każdym wstawieniu sprawdź, czy s.size() == k. Pierwszy taki moment to odpowiedź — zapamiętaj go (nie musisz już nic wypisywać w pętli). Jeśli taki moment nie nastąpił, brakuje k - s.size() naklejek.`,
            tests: (r) => {
                const t = (k, n) => `${k} ${n}\n${losy(r, n, 1, k).join(' ')}`;
                return ['1 1\n1', '2 3\n1 1 1', '3 3\n3 2 1', t(5, 20), t(10, 25), t(100, 600), t(1000, 10000), t(1000, 3000), t(1000, 10000).replace(/\n.*/, (s) => `\n${s.slice(1).split(' ').map((x) => (x === '777' ? '778' : x)).join(' ')}`)];
            },
            check: (inp) => { const t = nums(inp); const [k, n] = t; if (!calk(k, 1, 1000) || !calk(n, 1, 10000) || t.length !== n + 2) return 'k, n'; return t.slice(2).every((x) => calk(x, 1, k)) ? null : 'numer'; },
            solve: (inp) => { const t = nums(inp); const k = t[0]; const s = new Set(); for (let i = 2; i < t.length; i++) { s.add(t[i]); if (s.size === k) return String(i - 1); } return `NIE ${k - s.size}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k, n;
    cin >> k >> n;
    set<int> album;
    int kiedy = -1;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        album.insert(x);
        if (kiedy == -1 && (int)album.size() == k) kiedy = i;
    }
    if (kiedy != -1) cout << kiedy << "\n";
    else cout << "NIE " << k - (int)album.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-loginy', krok: 2, level: 'srednie',
            title: 'Rejestracja w grze',
            short: 'Login zajęty? Dopisz najmniejszą liczbę, która daje wolny login. Każdy przyznany login staje się zajęty.',
            tags: ['set<string>', 'count w pętli', 'to_string'],
            statement: ['Gracze rejestrują się po kolei w grze i każdy podaje login, który chciałby dostać. Jeśli ten login jest wolny, gracz go dostaje — wypisz OK. Jeśli jest zajęty, system dopisuje na końcu loginu najmniejszą liczbę k ≥ 1, dla której powstały login jest wolny, i przyznaje go — wypisz przyznany login.',
                'Każdy przyznany login (także ten z dopisaną liczbą) od razu staje się zajęty.'],
            input_format: ['W pierwszym wierszu liczba graczy n.', 'W każdym z następnych n wierszy login, o który prosi gracz.'],
            output_format: ['n wierszy — OK albo przyznany login.'],
            constraints: ['1 ≤ n ≤ 2000', 'Login ma od 1 do 8 znaków: małe litery a–z i cyfry.'],
            examples: [{ input: '5\nola\nadam\nola\nola\nola1', note: 'Trzeci gracz dostaje ola1, czwarty — ola2 (ola1 jest już zajęte). Piąty prosi o ola1, które jest zajęte, więc dostaje ola11.' }],
            hint: R`Trzymaj zbiór zajętych loginów. Jeśli login nie jest zajęty — wstaw go i wypisz OK. W przeciwnym razie próbuj po kolei k = 1, 2, 3, …: nowy login to login + to_string(k). Pierwszy, którego nie ma w zbiorze, wstaw i wypisz. to_string zamienia liczbę na napis.`,
            tests: (r) => {
                const t = (n, baza) => { const b = Array.from({ length: baza }, () => r.word(r.int(1, 6), 'abcxyz')); const out = []; for (let i = 0; i < n; i++) { let w = r.pick(b); if (r() < 0.15) w += String(r.int(1, 12)); out.push(w.slice(0, 8)); } return `${n}\n${out.join('\n')}`; };
                return ['1\na', '3\na\na\na', '4\nx1\nx\nx\nx', '5\nab\nab1\nab\nab\nab1', t(30, 3), t(500, 50), t(2000, 2000), t(2000, 5), `2000\n${Array(2000).fill('gracz').join('\n')}`];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 2000) || t.length !== n + 1) return 'n'; return t.slice(1).every((w) => /^[a-z0-9]{1,8}$/.test(w)) ? null : 'login'; },
            solve: (inp) => { const t = toks(inp); const s = new Set(); return t.slice(1).map((w) => { if (!s.has(w)) { s.add(w); return 'OK'; } let k = 1; while (s.has(w + k)) k++; s.add(w + k); return w + k; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<string> zajete;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        if (!zajete.count(w)) {
            zajete.insert(w);
            cout << "OK\n";
            continue;
        }
        int k = 1;
        while (zajete.count(w + to_string(k))) k++;
        string nowy = w + to_string(k);
        zajete.insert(nowy);
        cout << nowy << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 3 · begin, rbegin, iteratory
        {
            id: 'zb-od-najwiekszej', krok: 3, level: 'latwe',
            title: 'Różne, od największej',
            short: 'Wypisz różne wartości malejąco: rbegin i rend albo set z regułą greater.',
            tags: ['rbegin / rend', 'greater<int>', 'malejąco'],
            statement: ['Dostajesz n liczb całkowitych. Wypisz wszystkie różne wartości w kolejności malejącej, w jednym wierszu, oddzielone spacjami.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz — różne wartości od największej, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n4 -2 9 4 0 9 -2', note: 'Różne wartości to −2, 0, 4, 9 — od największej: 9, 4, 0, −2.' }],
            hint: R`Dwie drogi. Pierwsza: zwykły set<int> i pętla od tyłu: for (auto it = s.rbegin(); it != s.rend(); it++) cout << *it. Druga: set<int, greater<int>> — wtedy zwykła pętla for (int x : s) idzie od największej.`,
            tests: (r) => [lista([0]), lista([3, 3, 3]), lista([1, 2, 3, 4, 5]), lista(losy(r, 40, -9, 9)), lista(losy(r, 800, -1e6, 1e6)), lista(losy(r, 2000, -1e9, 1e9)), lista(losy(r, 2000, -3, 3))],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 2000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'zakres'; },
            solve: (inp) => rozne(nums(inp).slice(1)).reverse().join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.insert(x);
    }
    for (auto it = s.rbegin(); it != s.rend(); it++) cout << *it << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-srebrny-medal', krok: 3, level: 'latwe',
            title: 'Drugi najlepszy wynik',
            short: 'Srebro dostają wszyscy z drugim najlepszym różnym wynikiem. Jaki to wynik i ilu jest srebrnych?',
            tags: ['next(s.rbegin())', 'size() >= 2', 'vector + set'],
            statement: ['W konkursie skoków każdy z n zawodników ma wynik (liczba całkowita, im więcej, tym lepiej). Złoto dostają wszyscy z najlepszym wynikiem, a srebro — wszyscy z drugim najlepszym, czyli z największym wynikiem mniejszym od najlepszego.',
                'Wypisz wynik srebrnych medalistów i ich liczbę. Jeśli wszyscy mają ten sam wynik, srebra nie ma — wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wyników.'],
            output_format: ['Dwie liczby: wynik srebrnych medalistów i ich liczba — albo BRAK.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ wynik ≤ 10⁶'],
            examples: [{ input: '6\n120 95 120 110 110 80', note: 'Różne wyniki to 80, 95, 110, 120. Złoto: 120. Srebro: 110 — ma je dwóch zawodników.' }],
            hint: R`Wyniki wczytaj do vectora i jednocześnie wstaw do zbioru. Jeśli zbiór ma mniej niż 2 elementy — BRAK. W przeciwnym razie drugi największy to *next(s.rbegin()) (strzałka od tyłu, o jeden dalej) albo *prev(prev(s.end())). Na koniec policz w vectorze, ilu zawodników ma ten wynik.`,
            tests: (r) => [lista([50]), lista([7, 7, 7]), lista([1, 2]), lista([2, 1, 2, 1, 1]), lista(losy(r, 30, 0, 5)), lista(losy(r, 1000, 0, 100)), lista(losy(r, 10000, 0, 1e6)), lista(losy(r, 10000, 999998, 1e6))],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 10000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, 0, 1e6)) ? null : 'zakres'; },
            solve: (inp) => { const t = nums(inp).slice(1); const s = rozne(t); if (s.length < 2) return 'BRAK'; const w = s[s.length - 2]; return `${w} ${t.filter((x) => x === w).length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> t(n);
    set<int> s;
    for (int &x : t) {
        cin >> x;
        s.insert(x);
    }
    if (s.size() < 2) {
        cout << "BRAK\n";
        return 0;
    }
    int srebro = *next(s.rbegin());
    int ile = 0;
    for (int x : t)
        if (x == srebro) ile++;
    cout << srebro << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-k-ta-rozna', krok: 3, level: 'latwe',
            title: 'k-ta najmniejsza różna',
            short: 'Wiele pytań o k-tą najmniejszą różną wartość. Zbiór do vectora — i masz indeksy.',
            tags: ['vector(s.begin(), s.end())', 'k − 1', 'BRAK'],
            statement: ['Dostajesz n liczb i q pytań. Każde pytanie to liczba k: wypisz k-tą najmniejszą wartość spośród różnych wartości na liście (k = 1 to najmniejsza). Jeśli różnych wartości jest mniej niż k, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb.', 'W każdym z następnych q wierszy jedno pytanie k.'],
            output_format: ['q wierszy — odpowiedzi na pytania.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ q ≤ 1000', '1 ≤ każda liczba ≤ 10⁶', '1 ≤ k ≤ 10 000'],
            examples: [{ input: '7 3\n5 1 5 3 9 1 3\n1\n3\n5', note: 'Różne wartości to 1, 3, 5, 9. Pierwsza najmniejsza to 1, trzecia — 5, a piątej nie ma.' }],
            hint: R`Wstaw wszystkie liczby do zbioru, a potem przepisz go do vectora: vector<int> w(s.begin(), s.end()); — w jest posortowany i bez powtórzeń. Odpowiedź na pytanie k to w[k - 1], o ile k <= w.size(). Chodzenie strzałką k kroków przy każdym pytaniu też by zdążyło, ale vector jest prostszy.`,
            tests: (r) => {
                const t = (n, q, hi, kmax) => `${n} ${q}\n${losy(r, n, 1, hi).join(' ')}\n${losy(r, q, 1, kmax).join('\n')}`;
                return ['1 1\n5\n1', '1 2\n5\n1\n2', '5 5\n2 2 2 2 2\n1\n2\n3\n4\n5', t(20, 10, 10, 12), t(1000, 1000, 500, 600), t(10000, 1000, 1e6, 10000), t(10000, 1000, 50, 60)];
            },
            check: (inp) => { const t = nums(inp); const [n, q] = t; if (!calk(n, 1, 10000) || !calk(q, 1, 1000) || t.length !== 2 + n + q) return 'n, q'; if (!t.slice(2, 2 + n).every((x) => calk(x, 1, 1e6))) return 'liczba'; return t.slice(2 + n).every((k) => calk(k, 1, 10000)) ? null : 'k'; },
            solve: (inp) => { const t = nums(inp); const [n] = t; const w = rozne(t.slice(2, 2 + n)); return t.slice(2 + n).map((k) => (k <= w.length ? String(w[k - 1]) : 'BRAK')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.insert(x);
    }
    vector<int> w(s.begin(), s.end());
    while (q--) {
        int k;
        cin >> k;
        if (k <= (int)w.size()) cout << w[k - 1] << "\n";
        else cout << "BRAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-skrajne-polecenia', krok: 3, level: 'srednie',
            title: 'Najmniejszy i największy na żywo',
            short: 'DODAJ, USUN, MIN, MAX. Pamiętaj o pustym zbiorze przed *begin().',
            tags: ['*s.begin()', '*s.rbegin()', 'empty()'],
            statement: ['Na początku zbiór jest pusty. Wykonaj po kolei q poleceń:',
                'DODAJ x — wstaw x do zbioru,',
                'USUN x — usuń x ze zbioru (jeśli go nie ma, nic się nie dzieje),',
                'MIN — wypisz najmniejszy element zbioru,',
                'MAX — wypisz największy element zbioru.',
                'Jeśli przy MIN albo MAX zbiór jest pusty, wypisz PUSTY.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z następnych q wierszy polecenie (DODAJ i USUN z liczbą x, MIN i MAX bez liczby).'],
            output_format: ['Odpowiedzi na polecenia MIN i MAX, każda w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 2000', '−10⁹ ≤ x ≤ 10⁹', 'Jest co najmniej jedno polecenie MIN albo MAX.'],
            examples: [{ input: '8\nDODAJ 5\nDODAJ 2\nMIN\nMAX\nUSUN 2\nMIN\nUSUN 5\nMAX', note: 'Po usunięciu dwójki najmniejsza jest piątka. Po usunięciu piątki zbiór jest pusty.' }],
            hint: R`Wczytaj polecenie do string; liczbę wczytuj tylko przy DODAJ i USUN. Przy MIN i MAX najpierw sprawdź s.empty() — dopiero gdy zbiór nie jest pusty, wolno sięgnąć po *s.begin() albo *s.rbegin().`,
            tests: (r) => {
                const t = (q, hi) => { const w = []; for (let i = 0; i < q; i++) { const p = r.pick(['DODAJ', 'DODAJ', 'USUN', 'MIN', 'MAX']); w.push(p === 'MIN' || p === 'MAX' ? p : `${p} ${r.int(-hi, hi)}`); } if (!w.some((p) => p === 'MIN' || p === 'MAX')) w[q - 1] = 'MIN'; return `${q}\n${w.join('\n')}`; };
                return ['1\nMIN', '3\nDODAJ -7\nMIN\nMAX', '4\nDODAJ 1\nUSUN 1\nMAX\nMIN', t(20, 5), t(300, 100), t(2000, 1e9), t(2000, 2)];
            },
            check: (inp) => { const t = toks(inp); const q = Number(t[0]); if (!calk(q, 1, 2000)) return 'q'; let i = 1, ile = 0, pyt = 0; while (i < t.length) { const p = t[i++]; ile++; if (p === 'DODAJ' || p === 'USUN') { if (!calk(Number(t[i++]), -1e9, 1e9)) return 'x'; } else if (p === 'MIN' || p === 'MAX') pyt++; else return 'polecenie'; } return ile === q && pyt > 0 ? null : 'liczba poleceń'; },
            solve: (inp) => { const t = toks(inp); const s = new Zbior(); const out = []; let i = 1; while (i < t.length) { const p = t[i++]; if (p === 'DODAJ') s.add(Number(t[i++])); else if (p === 'USUN') s.del(Number(t[i++])); else out.push(s.size ? String(p === 'MIN' ? s.min() : s.max()) : 'PUSTY'); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    set<int> s;
    while (q--) {
        string p;
        cin >> p;
        if (p == "DODAJ" || p == "USUN") {
            int x;
            cin >> x;
            if (p == "DODAJ") s.insert(x);
            else s.erase(x);
        } else if (s.empty()) {
            cout << "PUSTY\n";
        } else if (p == "MIN") {
            cout << *s.begin() << "\n";
        } else {
            cout << *s.rbegin() << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'zb-odstepy', krok: 3, level: 'srednie',
            title: 'Odstępy między słupkami',
            short: 'Słupki na osi, niektóre wpisane kilka razy. Najmniejszy i największy odstęp między sąsiednimi.',
            tags: ['sąsiedzi w zbiorze', 'prev(it)', 'min i max'],
            statement: ['Wzdłuż drogi stoją słupki, a ich pozycje (liczby całkowite) zapisano na liście. Niektóre słupki zapisano kilka razy — ta sama pozycja to ten sam słupek.',
                'Wypisz najmniejszy i największy odstęp między sąsiednimi słupkami (słupkami, między którymi nie stoi żaden inny). Jeśli różnych słupków jest mniej niż dwa, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n pozycji słupków.'],
            output_format: ['Dwie liczby: najmniejszy i największy odstęp — albo BRAK.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ pozycja ≤ 10⁶'],
            examples: [{ input: '6\n10 3 25 10 4 18', note: 'Różne pozycje: 3, 4, 10, 18, 25. Odstępy: 1, 6, 8, 7. Najmniejszy 1, największy 8.' }],
            hint: R`Wstaw pozycje do zbioru — powtórki znikną, a słupki ułożą się po kolei. Sąsiedzi w zbiorze to sąsiednie słupki. Przejdź zbiór strzałką od drugiego elementu: for (auto it = next(s.begin()); it != s.end(); it++) i licz *it - *prev(it). Najpierw sprawdź, czy s.size() >= 2.`,
            tests: (r) => [lista([5]), lista([5, 5, 5]), lista([0, 1000000]), lista([7, 1, 7, 1, 4]), lista(losy(r, 30, 0, 100)), lista(losy(r, 3000, 0, 1e6)), lista(losy(r, 10000, 0, 1e6)), lista(Array.from({ length: 10000 }, (_, i) => i * 100))],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 10000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, 0, 1e6)) ? null : 'zakres'; },
            solve: (inp) => { const s = rozne(nums(inp).slice(1)); if (s.length < 2) return 'BRAK'; let mn = Infinity, mx = 0; for (let i = 1; i < s.length; i++) { mn = Math.min(mn, s[i] - s[i - 1]); mx = Math.max(mx, s[i] - s[i - 1]); } return `${mn} ${mx}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.insert(x);
    }
    if (s.size() < 2) {
        cout << "BRAK\n";
        return 0;
    }
    int najmn = INT_MAX, najw = 0;
    for (auto it = next(s.begin()); it != s.end(); it++) {
        int d = *it - *prev(it);
        najmn = min(najmn, d);
        najw = max(najw, d);
    }
    cout << najmn << " " << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-z-obu-koncow', krok: 3, level: 'srednie',
            title: 'Zabieranie z obu końców',
            short: 'Ala bierze największą kartkę, Bartek najmniejszą, na zmianę. Ile zbierze każde z nich?',
            tags: ['erase(s.begin())', 'erase(prev(s.end()))', 'long long'],
            statement: ['Na stole leżą kartki z liczbami. Najpierw organizator usuwa powtórki, tak że zostaje po jednej kartce z każdą różną liczbą. Potem Ala i Bartek grają na zmianę, zaczyna Ala. W swoim ruchu Ala zabiera kartkę z największą liczbą, a Bartek — z najmniejszą. Grają, aż kartki się skończą.',
                'Wypisz sumę liczb na kartkach Ali i sumę liczb na kartkach Bartka.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb z kartek (przed usunięciem powtórek).'],
            output_format: ['Dwie liczby: suma Ali i suma Bartka.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ liczba ≤ 10⁶'],
            examples: [{ input: '6\n5 1 9 5 3 7', note: 'Po usunięciu powtórek: 1, 3, 5, 7, 9. Ala bierze 9, Bartek 1, Ala 7, Bartek 3, Ala 5. Ala: 21, Bartek: 4.' }],
            hint: R`Wrzuć liczby do zbioru. Potem pętla while (!s.empty()): w ruchu Ali dodaj *s.rbegin() do jej sumy i usuń ten element przez s.erase(prev(s.end())); w ruchu Bartka dodaj *s.begin() i usuń przez s.erase(s.begin()). Po każdym ruchu sprawdź, czy zbiór nie jest już pusty. Sumy mogą przekroczyć zakres int — użyj long long.`,
            tests: (r) => [lista([4]), lista([2, 2]), lista([1, 2]), lista([3, 1, 2]), lista(losy(r, 25, 1, 30)), lista(losy(r, 2000, 1, 1e6)), lista(losy(r, 10000, 1, 1e6)), lista(losy(r, 10000, 999000, 1e6))],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 10000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, 1, 1e6)) ? null : 'zakres'; },
            solve: (inp) => { const s = rozne(nums(inp).slice(1)); let l = 0, p = s.length - 1, ala = 0, bartek = 0, ruch = 0; while (l <= p) { if (ruch % 2 === 0) ala += s[p--]; else bartek += s[l++]; ruch++; } return `${ala} ${bartek}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.insert(x);
    }
    long long ala = 0, bartek = 0;
    bool ruchAli = true;
    while (!s.empty()) {
        if (ruchAli) {
            ala += *s.rbegin();
            s.erase(prev(s.end()));
        } else {
            bartek += *s.begin();
            s.erase(s.begin());
        }
        ruchAli = !ruchAli;
    }
    cout << ala << " " << bartek << "\n";
    return 0;
}`,
        },
        {
            id: 'zb-rozrzut-na-zywo', krok: 3, level: 'latwe',
            title: 'Rozrzut po każdym dniu',
            short: 'Po każdym pomiarze: ile różnych temperatur było i ile wynosi różnica między skrajnymi.',
            tags: ['size()', '*rbegin() − *begin()', 'po każdym kroku'],
            statement: ['Przez n dni mierzysz temperaturę (liczba całkowita). Po każdym dniu wypisz dwie liczby: ile różnych temperatur zmierzono do tej pory i o ile najwyższa zmierzona dotąd temperatura jest większa od najniższej.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n temperatur, dzień po dniu.'],
            output_format: ['n wierszy — w każdym liczba różnych temperatur i rozrzut.'],
            constraints: ['1 ≤ n ≤ 2500', '−50 ≤ temperatura ≤ 50'],
            examples: [{ input: '5\n3 -2 3 7 0', note: 'Po trzecim dniu temperatury to 3, −2, 3 — różne są dwie, rozrzut 3 − (−2) = 5. Po czwartym dniu rozrzut rośnie do 7 − (−2) = 9.' }],
            hint: R`Wstawiaj temperatury do zbioru po kolei i po każdym wstawieniu wypisz s.size() oraz *s.rbegin() - *s.begin(). Zbiór nie jest pusty, bo przed chwilą coś do niego wstawiłeś.`,
            tests: (r) => [lista([0]), lista([5, 5, 5]), lista([-50, 50]), lista(losy(r, 20, -5, 5)), lista(losy(r, 500, -50, 50)), lista(losy(r, 2500, -50, 50)), lista(losy(r, 2500, 10, 12))],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 2500) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => calk(x, -50, 50)) ? null : 'zakres'; },
            solve: (inp) => { const s = new Set(); let mn = Infinity, mx = -Infinity; return nums(inp).slice(1).map((x) => { s.add(x); mn = Math.min(mn, x); mx = Math.max(mx, x); return `${s.size} ${mx - mn}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    set<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.insert(x);
        cout << s.size() << " " << *s.rbegin() - *s.begin() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'zb-ciag-dwoch-regul', krok: 3, level: 'trudne',
            title: 'Ciąg z dwóch reguł',
            short: 'Z x powstają 2x + 1 i 3x + 1. Jaka jest n-ta najmniejsza liczba? Zbiór jako kolejka „zawsze najmniejszy”.',
            tags: ['*s.begin() i erase', 'zbiór jako kolejka', 'long long'],
            statement: ['Zbiór Z zawiera liczbę 1. Jeśli liczba x należy do Z, to do Z należą też liczby 2x + 1 i 3x + 1. Innych liczb w Z nie ma. Ułożone rosnąco elementy Z to: 1, 3, 4, 7, 9, 10, 13, 15, 19, 21, 22, 27, …',
                'Dla każdego z t pytań n wypisz n-ty element tego ciągu (licząc od 1).'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z następnych t wierszy jedno pytanie n.'],
            output_format: ['t wierszy — n-te elementy ciągu.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n ≤ 100 000'],
            examples: [{ input: '4\n1\n2\n5\n12', note: 'Pierwszy element to 1, drugi 3, piąty 9, dwunasty 27 — zobacz ciąg w treści.' }],
            hint: R`Trzymaj zbiór „kandydatów”, na początku {1}. Najmniejszy kandydat jest zawsze kolejnym elementem ciągu: zdejmij go (x = *s.begin(); s.erase(s.begin());), dopisz do vectora wyników i wstaw do zbioru 2x + 1 oraz 3x + 1. Zbiór sam usunie powtórki (np. 31 = 2 · 15 + 1 = 3 · 10 + 1). Powtórz tyle razy, ile wynosi największe n z pytań, i odpowiadaj z vectora. Liczby rosną — użyj long long.`,
            tests: (r) => ['1\n1', '3\n2\n3\n4', `12\n${Array.from({ length: 12 }, (_, i) => i + 1).join('\n')}`, `50\n${losy(r, 50, 1, 1000).join('\n')}`, `1000\n${losy(r, 1000, 1, 100000).join('\n')}`, '2\n100000\n99999'],
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 1000) || t.length !== n + 1) return 't'; return t.slice(1).every((x) => calk(x, 1, 100000)) ? null : 'n'; },
            solve: (inp) => {
                const t = nums(inp).slice(1); const N = Math.max(...t);
                const kopiec = new P.Kopiec(); const w = new Set([1]); kopiec.push(1); const ciag = [];
                while (ciag.length < N) { const x = kopiec.pop(); ciag.push(x); for (const y of [2 * x + 1, 3 * x + 1]) if (!w.has(y)) { w.add(y); kopiec.push(y); } }
                if (ciag[N - 1] > 1e15) throw new Error('za duże liczby');
                return t.map((n) => String(ciag[n - 1])).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    vector<int> pytania(t);
    int najw = 0;
    for (int &n : pytania) {
        cin >> n;
        najw = max(najw, n);
    }
    vector<long long> ciag;
    set<long long> kandydaci = {1};
    while ((int)ciag.size() < najw) {
        long long x = *kandydaci.begin();
        kandydaci.erase(kandydaci.begin());
        ciag.push_back(x);
        kandydaci.insert(2 * x + 1);
        kandydaci.insert(3 * x + 1);
    }
    for (int n : pytania) cout << ciag[n - 1] << "\n";
    return 0;
}`,
        },
    ];
};
