// Bitset — ćwiczenia w trakcie lekcji, części 1–3: pierwszy bitset (bitset<N>, numery od prawej, b[i] = 1, wypisywanie,
// stały rozmiar z zapasem, duże bitsety przed main), wbudowane polecenia (set, reset, flip, count, any, none, all, pułapka all()
// przy n < N) oraz bitset z liczby i z napisu (bitset<32>(x), bitset<64>(s), to_string, find('1'), to_ulong, to_ullong, kod U2).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./bitset-pomoc');
    const { calk, calkB, rozne, SLOWA_ANG } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const L = (inp) => inp.split('\n');
    const B = (x) => BigInt(x);
    const MAX18 = 10n ** 18n;
    const lista = (a) => `${a.length}\n${a.join(' ')}`;
    const wiersze = (a) => `${a.length}\n${a.join('\n')}`;
    const bity = (x, k) => B(x).toString(2).padStart(k, '0');
    const jedynkiB = (x) => { let c = 0; x = B(x); while (x > 0n) { c += Number(x & 1n); x >>= 1n; } return c; };

    return [
        // ================================================================ KROK 1 · pierwszy bitset
        {
            id: 'bs-zapal-pozycje', krok: 1, level: 'latwe',
            title: 'Zapal żarówki',
            short: 'Rząd 16 żarówek to bitset<16>. Zapal żarówki o podanych numerach (b[k] = 1) i wypisz cały rząd jednym cout << b.',
            tags: ['bitset<16>', 'b[k] = 1', 'cout << b'],
            statement: ['Rząd 16 żarówek ma numery od 0 do 15. Na początku wszystkie są zgaszone. Wczytaj n numerów i zapal żarówki o tych numerach. Ten sam numer może się powtórzyć — zapalona żarówka po prostu świeci dalej.',
                'Wypisz cały rząd tak, jak robi to cout << b dla bitset<16> b: od żarówki numer 15 po lewej do żarówki numer 0 po prawej, 1 — świeci, 0 — zgaszona.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n numerów żarówek.'],
            output_format: ['Jeden wiersz: 16 cyfr 0 i 1.'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ każdy numer ≤ 15'],
            examples: [{ input: '3\n0 3 4', note: 'Świecą żarówki 0, 3 i 4. Bit 0 stoi na samym końcu napisu, bit 3 — czwarty od końca, bit 4 — piąty od końca: 0000000000011001.' },
                { input: '4\n15 15 15 1', note: 'Żarówkę 15 zapalono trzy razy, ale świeci tak samo jak po pierwszym razie. Bit 15 jest pierwszy z lewej.' }],
            hint: R`bitset<16> b; potem w pętli cin >> k; b[k] = 1;, a na końcu cout << b;. Nie odwracaj niczego ręcznie — cout sam wypisze bity od numeru 15 do numeru 0.`,
            tests: (r) => [lista([0, 3, 4]), lista([15, 15, 15, 1]), lista(Array.from({ length: 16 }, (_, i) => i)), lista([0]), lista([15]), lista(r.arr(100, 0, 15)), lista(r.arr(7, 0, 15)), lista(r.arr(3, 8, 15))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 100) && t.length === t[0] + 1 && t.slice(1).every((k) => calk(k, 0, 15)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const b = new Array(16).fill(0); t.slice(1).forEach((k) => { b[k] = 1; }); return b.reverse().join(''); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    bitset<16> b;
    for (int i = 0; i < n; i++) {
        int k;
        cin >> k;
        b[k] = 1;
    }
    cout << b << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-dwa-kierunki', krok: 1, level: 'latwe',
            title: 'Dwa kierunki',
            short: 'cout << b wypisuje bity od najwyższego numeru, a pętla po b[i] — od numeru 0. Wypisz ten sam bitset na oba sposoby i porównaj.',
            tags: ['kolejność wypisywania', 'pętla po b[i]', 'b.size()'],
            statement: ['Wczytaj numery zapalonych bitów bitsetu bitset<20> (numery od 0 do 19) i wypisz go dwa razy.',
                'W pierwszym wierszu wypisz bity pętlą od b[0] do b[19] — tak, jak zwykle czyta się tablicę. W drugim wierszu wypisz cout << b — od bitu 19 do bitu 0. Zobaczysz, że drugi wiersz to pierwszy wiersz czytany od końca.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n numerów bitów.'],
            output_format: ['Dwa wiersze po 20 cyfr: najpierw b[0], b[1], …, b[19], potem cout << b.'],
            constraints: ['1 ≤ n ≤ 20', '0 ≤ każdy numer ≤ 19'],
            examples: [{ input: '4\n0 1 5 19', note: 'Pętla zaczyna od b[0] = 1 i b[1] = 1, potem b[5] = 1 na szóstym miejscu i b[19] = 1 na końcu. cout << b pisze od bitu 19, więc ta sama jedynka jest na początku.' }],
            hint: R`for (int i = 0; i < 20; i++) cout << b[i]; cout << "\n" << b << "\n";. Zamiast 20 możesz napisać b.size().`,
            tests: (r) => [lista([0, 1, 5, 19]), lista([0]), lista([19]), lista(Array.from({ length: 20 }, (_, i) => i)), lista(r.arr(20, 0, 19)), lista(r.arr(5, 0, 9)), lista([10, 9])],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 20) && t.length === t[0] + 1 && t.slice(1).every((k) => calk(k, 0, 19)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const b = new Array(20).fill(0); t.slice(1).forEach((k) => { b[k] = 1; }); return b.join('') + '\n' + b.slice().reverse().join(''); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    bitset<20> b;
    for (int i = 0; i < n; i++) {
        int k;
        cin >> k;
        b[k] = 1;
    }
    for (int i = 0; i < 20; i++) cout << b[i];
    cout << "\n";
    cout << b << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-rozne-rosnaco', krok: 1, level: 'latwe',
            title: 'Różne liczby rosnąco',
            short: 'Zaznacz w bitsecie każdą wczytaną liczbę, a potem przejdź pętlą od 0 do 999 — wypiszesz różne liczby rosnąco, bez sortowania.',
            tags: ['zaznaczanie b[x] = 1', 'pętla po numerach', 'powtórzenia znikają same'],
            statement: ['Wczytaj n liczb z zakresu od 0 do 999. Wypisz rosnąco wszystkie różne liczby, które wystąpiły — każdą jeden raz.',
                'Nie trzeba sortować: zapal bit numer x dla każdej wczytanej liczby x (powtórka zapala bit, który już świeci, więc niczego nie zmienia), a potem przejdź po numerach od 0 do 999 i wypisz te, których bit świeci.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: różne liczby rosnąco, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ każda liczba ≤ 999'],
            examples: [{ input: '8\n5 3 999 3 0 5 5 17', note: 'Liczba 5 wystąpiła trzy razy, a 3 — dwa razy, ale każda zapala ten sam bit. Świecą bity 0, 3, 5, 17 i 999.' }],
            hint: R`bitset<1000> b; for (…) { cin >> x; b[x] = 1; }, potem for (int x = 0; x < 1000; x++) if (b[x]) cout << x << " ";.`,
            tests: (r) => [lista([5, 3, 999, 3, 0, 5, 5, 17]), lista([7]), lista(r.shuffle(Array.from({ length: 1000 }, (_, i) => i))), lista(r.arr(10000, 0, 999)), lista(r.arr(10000, 100, 120)), lista(r.arr(50, 0, 999)), lista(new Array(300).fill(999))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10000) && t.length === t[0] + 1 && t.slice(1).every((k) => calk(k, 0, 999)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const b = new Uint8Array(1000); t.slice(1).forEach((k) => { b[k] = 1; }); const w = []; for (let x = 0; x < 1000; x++) if (b[x]) w.push(x); return w.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    bitset<1000> b;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        b[x] = 1;
    }
    for (int x = 0; x < 1000; x++) {
        if (b[x]) cout << x << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-brakujace', krok: 1, level: 'latwe',
            title: 'Brakujące bilety',
            short: 'Bilety mają numery od 1 do n. Zaznacz numery zeskanowanych biletów i wypisz te, których bit nie świeci. Bitset deklaruj z zapasem.',
            tags: ['bitset z zapasem', 'if (!b[x])', 'licznik brakujących'],
            statement: ['Na koncert sprzedano n biletów z numerami od 1 do n. Przy wejściu zeskanowano m biletów — ten sam bilet mógł zostać zeskanowany kilka razy.',
                'Wypisz, ile numerów od 1 do n nie zostało zeskanowanych ani razu, a w drugim wierszu te numery rosnąco. Rozmiar bitsetu musi być stałą, więc zadeklaruj go z zapasem: bitset<15001> — wtedy mieści się także numer 15 000.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu m numerów zeskanowanych biletów.'],
            output_format: ['W pierwszym wierszu liczba brakujących numerów.', 'W drugim wierszu brakujące numery rosnąco, oddzielone spacjami (gdy nic nie brakuje — pusty wiersz).'],
            constraints: ['1 ≤ n ≤ 15 000', '1 ≤ m ≤ 15 000', 'zeskanowane numery są od 1 do n', 'brakujących numerów jest najwyżej 3000'],
            examples: [{ input: '10 8\n3 1 10 4 3 7 2 4', note: 'Zeskanowano numery 1, 2, 3, 4, 7 i 10 (trójkę i czwórkę dwa razy). Brakuje czterech: 5, 6, 8 i 9.' },
                { input: '3 3\n3 1 2', note: 'Wszyscy weszli — brakujących jest 0, a drugi wiersz jest pusty.' }],
            hint: R`bitset<15001> b; zaznacz każdy zeskanowany numer, a potem for (int x = 1; x <= n; x++) if (!b[x]) …. Najpierw policz brakujące jedną pętlą, a drugą pętlą je wypisz.`,
            tests: (r) => {
                const t = ['10 8\n3 1 10 4 3 7 2 4', '3 3\n3 1 2', '1 1\n1', '5 1\n3'];
                const gen = (n, brak, m) => {
                    const brakuje = new Set(rozne(r, brak, 1, n));
                    const sa = []; for (let x = 1; x <= n; x++) if (!brakuje.has(x)) sa.push(x);
                    const w = r.shuffle(sa.slice());
                    while (w.length < m) w.push(r.pick(sa));
                    return `${n} ${w.length}\n${r.shuffle(w).join(' ')}`;
                };
                t.push(gen(15000, 3000, 12000), gen(15000, 1, 15000), gen(14000, 2500, 15000), gen(100, 30, 200), gen(15000, 0, 15000));
                return t;
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; if (!calk(n, 1, 15000) || !calk(m, 1, 15000) || t.length !== m + 2 || !t.slice(2).every((x) => calk(x, 1, n))) return 'dane'; return n - new Set(t.slice(2)).size <= 3000 ? null : 'za dużo brakujących'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const b = new Uint8Array(n + 1); t.slice(2).forEach((x) => { b[x] = 1; }); const w = []; for (let x = 1; x <= n; x++) if (!b[x]) w.push(x); return `${w.length}\n${w.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    bitset<15001> b;
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        b[x] = 1;
    }
    int ile = 0;
    for (int x = 1; x <= n; x++) {
        if (!b[x]) ile++;
    }
    cout << ile << "\n";
    for (int x = 1; x <= n; x++) {
        if (!b[x]) cout << x << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-czy-bylo', krok: 1, level: 'latwe',
            title: 'Czy już było?',
            short: 'Dla każdej liczby odpowiedz, czy pojawiła się wcześniej. Najpierw sprawdź bit, potem go zapal. Bitset na milion bitów deklaruj przed main.',
            tags: ['bitset<1000001> przed main', 'najpierw sprawdź, potem zapal', 'TAK / NIE'],
            statement: ['Wczytuj kolejne liczby z zakresu od 0 do 1 000 000. Dla każdej wypisz TAK, jeśli ta sama liczba pojawiła się już wcześniej, albo NIE, jeśli widzisz ją pierwszy raz.',
                'Kolejność ma znaczenie: najpierw sprawdź bit b[x], a dopiero potem go zapal — inaczej każda liczba „była” już w chwili sprawdzania. Bitset o milionie bitów zadeklaruj przed main, tak jak duże tablice.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['n wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ n ≤ 5000', '0 ≤ każda liczba ≤ 1 000 000'],
            examples: [{ input: '6\n7 1000000 7 0 1000000 7', note: 'Pierwsza siódemka jest nowa, druga i trzecia to powtórki. Milion pojawia się drugi raz na piątej pozycji.' }],
            hint: R`bitset<1000001> byla; przed main. W pętli: cin >> x; if (byla[x]) cout << "TAK\n"; else cout << "NIE\n"; byla[x] = 1;.`,
            tests: (r) => [lista([7, 1000000, 7, 0, 1000000, 7]), lista([0]), lista(r.arr(5000, 0, 1000000)), lista(r.arr(5000, 0, 3000)), lista(r.arr(5000, 999990, 1000000)), lista(rozne(r, 5000, 0, 1000000)), lista(r.arr(20, 0, 5))],
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 5000) && t.length === t[0] + 1 && t.slice(1).every((k) => calk(k, 0, 1000000)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const b = new Uint8Array(1000001); return t.slice(1).map((x) => { const w = b[x] ? 'TAK' : 'NIE'; b[x] = 1; return w; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1000001> byla;
int main() {
    byla.reset(); // zerowanie przed testem
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (byla[x]) cout << "TAK\n";
        else cout << "NIE\n";
        byla[x] = 1;
    }
    return 0;
}`,
        },
        {
            id: 'bs-pierwsza-powtorka', krok: 1, level: 'latwe',
            title: 'Pierwsza powtórka',
            short: 'Wczytuj liczby do 10⁷ i zatrzymaj się na pierwszej, która już była. Bitset na 10 milionów bitów zajmuje tylko 1,25 MB.',
            tags: ['bitset<10000001>', 'przerwanie pętli', 'brak powtórki'],
            statement: ['Dany jest ciąg n liczb z zakresu od 0 do 10 000 000. Znajdź pierwszą pozycję, na której stoi liczba już wcześniej widziana. Wypisz tę liczbę i numer pozycji (licząc od 1).',
                'Jeśli żadna liczba się nie powtarza, wypisz brak. Bitset o 10 000 001 bitach zajmuje około 1,25 MB — zwykła tablica bool o tylu pozycjach zajęłaby 10 MB.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Jeden wiersz: liczba i numer pozycji oddzielone spacją albo słowo brak.'],
            constraints: ['1 ≤ n ≤ 10 000', '0 ≤ każda liczba ≤ 10 000 000'],
            examples: [{ input: '7\n50 8 9000000 8 50 3 3', note: 'Na pozycji 4 stoi 8, która była już na pozycji 2 — to pierwsza powtórka. Pięćdziesiątka powtarza się dopiero na pozycji 5.' },
                { input: '3\n1 2 3', note: 'Wszystkie liczby są różne.' }],
            hint: R`Gdy trafisz na zapalony bit, wypisz wynik i zakończ program (return 0;). Jeśli pętla dojdzie do końca, nie było powtórki — wypisz brak.`,
            tests: (r) => {
                const t = ['7\n50 8 9000000 8 50 3 3', '3\n1 2 3', '1\n10000000', '2\n0 0'];
                const a = rozne(r, 10000, 0, 10000000); t.push(lista(a));
                const b = rozne(r, 9999, 0, 10000000); b.splice(9998, 0, b[r.int(0, 9000)]); t.push(lista(b));
                const c = rozne(r, 10000, 5000000, 10000000); c[6000] = c[1234]; c[8000] = c[10]; t.push(lista(c));
                t.push(lista(r.arr(10000, 0, 10000000)));
                return t;
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10000) && t.length === t[0] + 1 && t.slice(1).every((k) => calk(k, 0, 10000000)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const s = new Set(); for (let i = 1; i < t.length; i++) { if (s.has(t[i])) return `${t[i]} ${i}`; s.add(t[i]); } return 'brak'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<10000001> byla;
int main() {
    byla.reset(); // zerowanie przed testem
    int n;
    cin >> n;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        if (byla[x]) {
            cout << x << " " << i << "\n";
            return 0;
        }
        byla[x] = 1;
    }
    cout << "brak\n";
    return 0;
}`,
        },
        {
            id: 'bs-kolekcjoner', krok: 1, level: 'latwe',
            title: 'Kolekcjoner',
            short: 'Album ma n różnych naklejek. Licz naklejkę jako nową tylko wtedy, gdy jej bit był jeszcze zgaszony — powtórki się nie liczą.',
            tags: ['licznik nowych', 'if (!b[x])', 'ile brakuje'],
            statement: ['Album ma miejsca na n różnych naklejek z numerami od 1 do n. Kasia dostała m naklejek — niektóre numery powtarzają się wiele razy.',
                'Wypisz, ile różnych naklejek ma Kasia i ilu jeszcze brakuje do pełnego albumu. Licz tylko naklejki, których bit był jeszcze zgaszony: if (!b[x]) { b[x] = 1; ile++; }.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu m numerów naklejek.'],
            output_format: ['Jeden wiersz: liczba różnych naklejek Kasi i liczba brakujących.'],
            constraints: ['1 ≤ n ≤ 1 000 000', '1 ≤ m ≤ 10 000', '1 ≤ każdy numer ≤ n'],
            examples: [{ input: '10 7\n3 7 3 3 10 1 7', note: 'Różne naklejki to 1, 3, 7 i 10 — cztery. Do dziesięciu brakuje sześciu.' }],
            hint: R`bitset<1000001> b; przed main i licznik ile. Na końcu wypisz ile i n - ile.`,
            tests: (r) => [`10 7\n3 7 3 3 10 1 7`, `1 1\n1`, `1000000 10000\n${r.arr(10000, 1, 1000000).join(' ')}`, `5000 10000\n${r.arr(10000, 1, 5000).join(' ')}`, `100 10000\n${r.arr(10000, 1, 100).join(' ')}`, `1000000 3\n1000000 1 1000000`, `20 5\n${rozne(r, 5, 1, 20).join(' ')}`],
            check: (inp) => { const t = nums(inp); const [n, m] = t; return calk(n, 1, 1000000) && calk(m, 1, 10000) && t.length === m + 2 && t.slice(2).every((x) => calk(x, 1, n)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const ile = new Set(t.slice(2)).size; return `${ile} ${t[0] - ile}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1000001> b;
int main() {
    b.reset(); // zerowanie przed testem
    int n, m;
    cin >> n >> m;
    int ile = 0;
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        if (!b[x]) {
            b[x] = 1;
            ile++;
        }
    }
    cout << ile << " " << n - ile << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-wielokrotnosci', krok: 1, level: 'srednie',
            title: 'Skreślanie wielokrotności',
            short: 'Skreśl wielokrotności podanych liczb pętlą z krokiem d i policz liczby, których nikt nie skreślił. To rozgrzewka przed sitem Eratostenesa.',
            tags: ['pętla j += d', 'skreślanie', 'licz niezapalone'],
            statement: ['Wypisano liczby od 1 do n. Dla każdej z k podanych liczb d skreślamy wszystkie wielokrotności d z zakresu od 1 do n: d, 2d, 3d, … — także samą liczbę d. Liczba skreślona kilka razy to po prostu liczba skreślona.',
                'Ile liczb od 1 do n zostało nieskreślonych? Pętla for (int j = d; j <= n; j += d) zapala bity wszystkich wielokrotności d.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu k liczb d.'],
            output_format: ['Jedna liczba — ile liczb od 1 do n nie zostało skreślonych.'],
            constraints: ['2 ≤ n ≤ 1 000 000', '1 ≤ k ≤ 10', '2 ≤ każde d ≤ n'],
            examples: [{ input: '20 2\n4 6', note: 'Wielokrotności 4: 4, 8, 12, 16, 20. Wielokrotności 6: 6, 12, 18. Skreślono 7 różnych liczb (12 dwa razy), więc zostaje 20 − 7 = 13.' },
                { input: '30 3\n2 3 5', note: 'Nieskreślone zostają 1, 7, 11, 13, 17, 19, 23 i 29 — liczby, które nie dzielą się ani przez 2, ani przez 3, ani przez 5.' }],
            hint: R`bitset<1000001> skreslona; przed main. Dla każdego d: for (int j = d; j <= n; j += d) skreslona[j] = 1;. Na końcu policz pętlą od 1 do n liczby z bitem 0.`,
            tests: (r) => [`20 2\n4 6`, `30 3\n2 3 5`, `2 1\n2`, `1000000 10\n2 3 5 7 11 13 17 19 23 29`, `1000000 10\n${rozne(r, 10, 2, 1000000).join(' ')}`, `1000000 5\n4 4 6 9 1000000`, `999999 7\n${rozne(r, 7, 2, 60).join(' ')}`, `100 1\n100`],
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 2, 1000000) && calk(k, 1, 10) && t.length === k + 2 && t.slice(2).every((d) => calk(d, 2, n)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const s = new Uint8Array(n + 1); for (const d of t.slice(2)) for (let j = d; j <= n; j += d) s[j] = 1; let c = 0; for (let x = 1; x <= n; x++) if (!s[x]) c++; return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1000001> skreslona;
int main() {
    skreslona.reset(); // zerowanie przed testem
    int n, k;
    cin >> n >> k;
    for (int i = 0; i < k; i++) {
        int d;
        cin >> d;
        for (int j = d; j <= n; j += d) skreslona[j] = 1;
    }
    int ile = 0;
    for (int x = 1; x <= n; x++) {
        if (!skreslona[x]) ile++;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 2 · wbudowane polecenia
        {
            id: 'bs-zapal-zgas', krok: 2, level: 'latwe',
            title: 'Zapal, zgaś, przełącz',
            short: 'Tysiąc lampek i trzy polecenia: set(k) zapala, reset(k) gasi, flip(k) przełącza. Na końcu count() mówi, ile lampek świeci.',
            tags: ['set(k)', 'reset(k)', 'flip(k)', 'count()'],
            statement: ['W sali jest 1000 lampek z numerami od 0 do 999, na początku wszystkie zgaszone. Wykonaj q poleceń: zapal k (b.set(k)), zgas k (b.reset(k)) albo przelacz k (b.flip(k)). Zapalenie świecącej lampki i zgaszenie zgaszonej niczego nie zmienia.',
                'Na końcu wypisz, ile lampek świeci (b.count()), a w drugim wierszu numery świecących lampek rosnąco.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy polecenie: zapal k, zgas k albo przelacz k.'],
            output_format: ['W pierwszym wierszu liczba świecących lampek.', 'W drugim wierszu ich numery rosnąco, oddzielone spacjami (gdy nic nie świeci — pusty wiersz).'],
            constraints: ['1 ≤ q ≤ 5000', '0 ≤ k ≤ 999'],
            examples: [{ input: '5\nzapal 3\nzapal 500\nprzelacz 3\nprzelacz 7\nzgas 999', note: 'Lampka 3 zapala się i zaraz gaśnie (przełączenie). Lampka 7 zapala się przez przełączenie, a zgaszenie zgaszonej 999 niczego nie zmienia. Świecą 7 i 500.' }],
            hint: R`string p; int k; cin >> p >> k; if (p == "zapal") b.set(k); else if (p == "zgas") b.reset(k); else b.flip(k);. Na końcu cout << b.count() i pętla po numerach od 0 do 999.`,
            tests: (r) => {
                const t = ['5\nzapal 3\nzapal 500\nprzelacz 3\nprzelacz 7\nzgas 999', '1\nzgas 0', '2\nzapal 999\nprzelacz 0'];
                const gen = (q, lo, hi, pz) => wiersze(Array.from({ length: q }, () => `${r() < pz ? 'zapal' : r.pick(['zgas', 'przelacz', 'przelacz'])} ${r.int(lo, hi)}`));
                t.push(gen(5000, 0, 999, 0.5), gen(5000, 0, 999, 0.2), gen(5000, 0, 20, 0.4), gen(3000, 990, 999, 0.6), wiersze(Array.from({ length: 1000 }, (_, i) => `przelacz ${i}`)));
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 5000) && l.length === q + 1 && l.slice(1).every((w) => /^(zapal|zgas|przelacz) (\d{1,3})$/.test(w) && Number(w.split(' ')[1]) <= 999) ? null : 'dane'; },
            solve: (inp) => { const b = new Uint8Array(1000); for (const w of L(inp).slice(1)) { const [p, ks] = w.split(' '); const k = Number(ks); if (p === 'zapal') b[k] = 1; else if (p === 'zgas') b[k] = 0; else b[k] ^= 1; } const n = []; for (let i = 0; i < 1000; i++) if (b[i]) n.push(i); return `${n.length}\n${n.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    bitset<1000> b;
    for (int i = 0; i < q; i++) {
        string p;
        int k;
        cin >> p >> k;
        if (p == "zapal") b.set(k);
        else if (p == "zgas") b.reset(k);
        else b.flip(k);
    }
    cout << b.count() << "\n";
    for (int k = 0; k < 1000; k++) {
        if (b[k]) cout << k << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-sto-lampek', krok: 2, level: 'latwe',
            title: 'Sto lampek',
            short: 'Polecenia dla jednej lampki i dla wszystkich naraz: set(), reset() i flip() bez numeru działają na cały bitset. Na pytanie ile odpowiada count().',
            tags: ['set() / reset() / flip()', 'count()', 'dokładnie 100 bitów'],
            statement: ['Choinka ma dokładnie 100 lampek o numerach od 0 do 99, na początku zgaszonych. Polecenia: zapal k, zgas k, przelacz k — dla jednej lampki; wszystkie — zapal wszystkie (b.set()); zadna — zgaś wszystkie (b.reset()); odwroc — przełącz wszystkie (b.flip()); ile — wypisz, ile lampek świeci.',
                'Lampek jest dokładnie tyle, ile bitów ma bitset<100>, więc polecenia bez numeru możesz stosować wprost — nie ma żadnych dodatkowych bitów.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno polecenie.'],
            output_format: ['Dla każdego polecenia ile — jeden wiersz z liczbą świecących lampek.'],
            constraints: ['1 ≤ q ≤ 3000', '0 ≤ k ≤ 99', 'jest co najmniej jedno polecenie ile'],
            examples: [{ input: '7\nzapal 5\nzapal 6\nile\nodwroc\nile\nprzelacz 5\nile', note: 'Najpierw świecą 2 lampki. Po odwróceniu świeci pozostałe 98. Przełączenie lampki 5 (zgaszonej po odwróceniu) zapala ją: 99.' }],
            hint: R`Po wczytaniu słowa sprawdź, czy polecenie potrzebuje numeru — liczbę wczytuj tylko dla zapal, zgas i przelacz. Dla wszystkie, zadna i odwroc wywołaj b.set(), b.reset() i b.flip() bez argumentu.`,
            tests: (r) => {
                const t = ['7\nzapal 5\nzapal 6\nile\nodwroc\nile\nprzelacz 5\nile', '1\nile', '4\nwszystkie\nile\nodwroc\nile', '5\nzapal 99\nzadna\nzapal 0\nprzelacz 0\nile'];
                const pol = () => { const x = r(); if (x < 0.25) return `zapal ${r.int(0, 99)}`; if (x < 0.4) return `zgas ${r.int(0, 99)}`; if (x < 0.6) return `przelacz ${r.int(0, 99)}`; if (x < 0.64) return 'wszystkie'; if (x < 0.67) return 'zadna'; if (x < 0.75) return 'odwroc'; return 'ile'; };
                for (let i = 0; i < 3; i++) { const a = Array.from({ length: 3000 }, pol); a[2999] = 'ile'; t.push(wiersze(a)); }
                t.push(wiersze([...Array.from({ length: 100 }, (_, i) => `przelacz ${i}`), 'ile', 'odwroc', 'ile', 'zgas 50', 'zgas 50', 'ile']));
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 3000) && l.length === q + 1 && l.slice(1).includes('ile') && l.slice(1).every((w) => /^((zapal|zgas|przelacz) \d{1,2}|wszystkie|zadna|odwroc|ile)$/.test(w)) ? null : 'dane'; },
            solve: (inp) => { const b = new Uint8Array(100); const o = []; for (const w of L(inp).slice(1)) { const [p, ks] = w.split(' '); const k = Number(ks); if (p === 'zapal') b[k] = 1; else if (p === 'zgas') b[k] = 0; else if (p === 'przelacz') b[k] ^= 1; else if (p === 'wszystkie') b.fill(1); else if (p === 'zadna') b.fill(0); else if (p === 'odwroc') for (let i = 0; i < 100; i++) b[i] ^= 1; else o.push(b.reduce((a, x) => a + x, 0)); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    bitset<100> b;
    for (int i = 0; i < q; i++) {
        string p;
        cin >> p;
        if (p == "zapal" || p == "zgas" || p == "przelacz") {
            int k;
            cin >> k;
            if (p == "zapal") b.set(k);
            else if (p == "zgas") b.reset(k);
            else b.flip(k);
        }
        else if (p == "wszystkie") b.set();
        else if (p == "zadna") b.reset();
        else if (p == "odwroc") b.flip();
        else cout << b.count() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-parking', krok: 2, level: 'latwe',
            title: 'Parking',
            short: 'Parking ma dokładnie 1000 miejsc. Przyjazd na zajęte miejsce to kolizja, a pytanie ? sprawdza none(), all() albo liczy wolne miejsca: size() − count().',
            tags: ['none() / all()', 'size() - count()', 'b[k] albo test(k)'],
            statement: ['Parking ma dokładnie 1000 miejsc o numerach od 0 do 999, na początku pustych. Zdarzenia: + k — samochód chce stanąć na miejscu k (jeśli miejsce jest zajęte, wypisz zajete k i nic nie zmieniaj); - k — samochód odjeżdża z miejsca k (jeśli miejsce było wolne, nic się nie dzieje); ? — wypisz stan parkingu.',
                'Na pytanie ? odpowiedz pusty, gdy nie stoi tam żaden samochód (b.none()), pelny, gdy zajęte są wszystkie miejsca (b.all()), a w pozostałych przypadkach — liczbę wolnych miejsc: b.size() - b.count().'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy zdarzenie: + k, - k albo ?.'],
            output_format: ['Po jednym wierszu dla każdej kolizji i każdego pytania ?, w kolejności zdarzeń.'],
            constraints: ['1 ≤ q ≤ 5000', '0 ≤ k ≤ 999'],
            examples: [{ input: '6\n?\n+ 5\n+ 5\n?\n- 5\n?', note: 'Na początku parking jest pusty. Drugi samochód na miejscu 5 to kolizja. Potem wolnych jest 999 miejsc, a po odjeździe — znowu pusto.' }],
            hint: R`char z; cin >> z; if (z == '?') { … } else { int k; cin >> k; … }. Zajętość miejsca sprawdzisz przez b[k] albo b.test(k). Kolejność warunków przy ?: najpierw none(), potem all(), na końcu liczba wolnych.`,
            tests: (r) => {
                const t = ['6\n?\n+ 5\n+ 5\n?\n- 5\n?', '1\n?', '3\n- 7\n?\n+ 999'];
                const pelny = r.shuffle(Array.from({ length: 1000 }, (_, i) => `+ ${i}`));
                t.push(wiersze([...pelny, '?', '+ 17', '- 17', '?', '+ 17', '?']));
                const gen = (q, lo, hi, pp) => wiersze(Array.from({ length: q }, () => { const x = r(); return x < pp ? `+ ${r.int(lo, hi)}` : x < 0.85 ? `- ${r.int(lo, hi)}` : '?'; }));
                t.push(gen(5000, 0, 999, 0.6), gen(5000, 0, 30, 0.5), gen(3000, 0, 999, 0.75));
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 5000) && l.length === q + 1 && l.slice(1).every((w) => w === '?' || (/^[+-] \d{1,3}$/.test(w) && Number(w.slice(2)) <= 999)) ? null : 'dane'; },
            solve: (inp) => { const b = new Uint8Array(1000); let c = 0; const o = []; for (const w of L(inp).slice(1)) { if (w === '?') { o.push(c === 0 ? 'pusty' : c === 1000 ? 'pelny' : String(1000 - c)); continue; } const k = Number(w.slice(2)); if (w[0] === '+') { if (b[k]) o.push(`zajete ${k}`); else { b[k] = 1; c++; } } else if (b[k]) { b[k] = 0; c--; } } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    bitset<1000> b;
    for (int i = 0; i < q; i++) {
        char z;
        cin >> z;
        if (z == '?') {
            if (b.none()) cout << "pusty\n";
            else if (b.all()) cout << "pelny\n";
            else cout << b.size() - b.count() << "\n";
        } else {
            int k;
            cin >> k;
            if (z == '+') {
                if (b[k]) cout << "zajete " << k << "\n";
                else b.set(k);
            } else {
                b.reset(k);
            }
        }
    }
    return 0;
}`,
        },
        {
            id: 'bs-wszyscy-obecni', krok: 2, level: 'latwe',
            title: 'Wszyscy obecni',
            short: 'Uczniów jest n, a bitset ma stały, większy rozmiar — dlatego all() tu nie zadziała. Po każdym wejściu sprawdzaj count() == n.',
            tags: ['pułapka all()', 'count() == n', 'pierwszy taki moment'],
            statement: ['Do szkoły chodzi n uczniów o numerach od 1 do n. Rano bramka rejestruje m wejść: kolejne numery uczniów (ten sam uczeń mógł przejść kilka razy, bo wychodził na boisko).',
                'Po którym wejściu (licząc od 1) w szkole są już wszyscy uczniowie? Wypisz ten numer albo -1, jeśli do końca kogoś brakuje. Uwaga: bitset ma stały rozmiar, większy niż n, więc all() zawsze da fałsz — porównuj b.count() z n.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu m numerów uczniów.'],
            output_format: ['Jedna liczba: numer wejścia albo -1.'],
            constraints: ['1 ≤ n ≤ 10 000', '1 ≤ m ≤ 15 000', '1 ≤ każdy numer ≤ n'],
            examples: [{ input: '3 6\n2 2 1 2 3 1', note: 'Uczeń 3 przechodzi dopiero jako piąty — wtedy są już wszyscy.' },
                { input: '4 3\n1 2 3', note: 'Uczeń 4 nie przyszedł.' }],
            hint: R`bitset<10001> b; i po każdym wejściu if ((int)b.count() == n) { cout << i << "\n"; return 0; }. count() zwraca liczbę bez znaku, więc bez (int) kompilator ostrzega o porównaniu różnych typów.`,
            tests: (r) => {
                const t = ['3 6\n2 2 1 2 3 1', '4 3\n1 2 3', '1 1\n1', '1 3\n1 1 1'];
                const perm = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
                const p = perm(10000); const dopis = r.arr(5000, 1, 10000); t.push(`10000 15000\n${[...p.slice(0, 9000), ...dopis, ...p.slice(9000)].join(' ')}`);
                t.push(`10000 15000\n${r.arr(15000, 1, 10000).join(' ')}`);
                const q = perm(5000); t.push(`5000 15000\n${[...q, ...r.arr(10000, 1, 5000)].join(' ')}`);
                t.push(`9999 15000\n${r.arr(15000, 1, 9998).join(' ')}`);
                return t;
            },
            check: (inp) => { const t = nums(inp); const [n, m] = t; return calk(n, 1, 10000) && calk(m, 1, 15000) && t.length === m + 2 && t.slice(2).every((x) => calk(x, 1, n)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const s = new Set(); for (let i = 2; i < t.length; i++) { s.add(t[i]); if (s.size === n) return String(i - 1); } return '-1'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    bitset<10001> b;
    for (int i = 1; i <= m; i++) {
        int x;
        cin >> x;
        b[x] = 1;
        if ((int)b.count() == n) {
            cout << i << "\n";
            return 0;
        }
    }
    cout << -1 << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-przelaczniki-co-k', krok: 2, level: 'latwe',
            title: 'Przełączniki co k',
            short: 'Każda osoba przełącza co k-tą lampkę: flip(k), flip(2k), flip(3k)… Gdy przejdą wszyscy, count() powie, ile lampek świeci.',
            tags: ['flip(j) w pętli', 'j += k', 'count()'],
            statement: ['Na korytarzu stoi n lampek z numerami od 1 do n, na początku zgaszonych. Przechodzi m osób. Osoba z liczbą k przełącza lampki k, 2k, 3k, … aż do n — zgaszone zapala, a świecące gasi.',
                'Ile lampek świeci, gdy przejdą wszyscy? Ciekawostka: gdy osób jest n i mają liczby 1, 2, …, n, na końcu świecą dokładnie lampki o numerach 1, 4, 9, 16, … — kwadraty liczb. Sprawdź to na pierwszym przykładzie.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu m różnych liczb k.'],
            output_format: ['Jedna liczba — ile lampek świeci na końcu.'],
            constraints: ['1 ≤ n ≤ 1 000 000', '1 ≤ m ≤ 1000', 'liczby k są różne', '1 ≤ k ≤ n'],
            examples: [{ input: '10 10\n1 2 3 4 5 6 7 8 9 10', note: 'Świecą lampki 1, 4 i 9: tylko kwadraty mają nieparzystą liczbę dzielników, więc tylko one są przełączane nieparzyście wiele razy.' },
                { input: '20 2\n2 4', note: 'Lampki podzielne przez 4 przełączono dwa razy — zgasły. Świeci pięć lampek: 2, 6, 10, 14 i 18.' }],
            hint: R`bitset<1000001> b; przed main. Dla każdego k: for (int j = k; j <= n; j += k) b.flip(j);. Na koniec cout << b.count();.`,
            tests: (r) => [`10 10\n1 2 3 4 5 6 7 8 9 10`, `20 2\n2 4`, `1 1\n1`, `1000000 1000\n${Array.from({ length: 1000 }, (_, i) => i + 1).join(' ')}`, `1000000 1000\n${rozne(r, 1000, 1, 1000000).join(' ')}`, `999983 500\n${rozne(r, 500, 1, 2000).join(' ')}`, `1000 1000\n${r.shuffle(Array.from({ length: 1000 }, (_, i) => i + 1)).join(' ')}`, `100000 3\n7 1 49`],
            check: (inp) => { const t = nums(inp); const [n, m] = t; return calk(n, 1, 1000000) && calk(m, 1, 1000) && t.length === m + 2 && t.slice(2).every((k) => calk(k, 1, n)) && new Set(t.slice(2)).size === m ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const b = new Uint8Array(n + 1); for (const k of t.slice(2)) for (let j = k; j <= n; j += k) b[j] ^= 1; let c = 0; for (let i = 1; i <= n; i++) c += b[i]; return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
bitset<1000001> b;
int main() {
    b.reset(); // zerowanie przed testem
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int k;
        cin >> k;
        for (int j = k; j <= n; j += k) b.flip(j);
    }
    cout << b.count() << "\n";
    return 0;
}`,
        },
        {
            id: 'bs-wszystkie-cyfry', krok: 2, level: 'latwe',
            title: 'Wszystkie cyfry',
            short: 'Zapal bit każdej cyfry liczby w bitset<10>. count() powie, ile różnych cyfr ma liczba, a all() — czy jest wszystkie dziesięć.',
            tags: ['bitset<10>', "c - '0'", 'all() — gdy rozmiar pasuje'],
            statement: ['Dla każdej z q liczb policz, ile różnych cyfr występuje w jej zapisie, i sprawdź, czy występują wszystkie cyfry od 0 do 9.',
                'Liczby są bardzo długie, więc wczytuj je jako napisy. bitset<10> ma dokładnie 10 bitów — po jednym na cyfrę — więc tutaj all() działa dokładnie tak, jak trzeba.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba.'],
            output_format: ['q wierszy: liczba różnych cyfr, a po spacji TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 1000', 'każda liczba ma od 1 do 100 cyfr i nie zaczyna się od zera (chyba że to samo 0)'],
            examples: [{ input: '3\n1234567890\n112233\n9876543210123', note: 'Pierwsza i trzecia liczba mają wszystkie dziesięć cyfr. W drugiej są tylko trzy różne: 1, 2 i 3.' }],
            hint: R`string s; cin >> s; bitset<10> c; for (char z : s) c[z - '0'] = 1;. Potem cout << c.count() << " " << (c.all() ? "TAK" : "NIE") << "\n";.`,
            tests: (r) => {
                const liczba = (len, cyfry) => { let s = r.pick(cyfry.filter((d) => d !== '0')) || '0'; while (s.length < len) s += r.pick(cyfry); return s; };
                const t = ['3\n1234567890\n112233\n9876543210123', '1\n0', '2\n1023456789\n9999999999'];
                const a = []; for (let i = 0; i < 1000; i++) { const k = r.int(1, 10); const cyf = r.shuffle('0123456789'.split('')).slice(0, k); a.push(cyf.length === 1 && cyf[0] === '0' ? '0' : liczba(r.int(1, 100), cyf.includes('0') && cyf.length === 1 ? ['1'] : cyf)); }
                t.push(wiersze(a));
                t.push(wiersze(Array.from({ length: 1000 }, () => liczba(r.int(15, 100), '0123456789'.split('')))));
                t.push(wiersze(Array.from({ length: 500 }, () => liczba(r.int(9, 12), r.shuffle('0123456789'.split('')).slice(0, 9)))));
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((s) => /^(0|[1-9]\d{0,99})$/.test(s)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((s) => { const k = new Set(s).size; return `${k} ${k === 10 ? 'TAK' : 'NIE'}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string s;
        cin >> s;
        bitset<10> c;
        for (char z : s) c[z - '0'] = 1;
        cout << c.count() << " " << (c.all() ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-pangram', krok: 2, level: 'latwe',
            title: 'Pangram',
            short: 'Pangram to zdanie z każdą literą alfabetu. Zapalaj bity liter w bitset<26> i sprawdź all() — a jeśli nie, wypisz brakujące litery.',
            tags: ['bitset<26>', "tolower(c) - 'a'", 'getline'],
            statement: ['Pangram to zdanie, w którym każda z 26 liter alfabetu łacińskiego (od a do z) występuje co najmniej raz. Wielkość liter nie ma znaczenia, a spacje, cyfry i znaki interpunkcyjne pomijamy.',
                'Dla każdego z q zdań wypisz pangram, jeśli nim jest, a w przeciwnym razie brakuje: i brakujące litery w kolejności alfabetycznej, bez spacji między nimi.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno zdanie: litery łacińskie (bez polskich znaków), spacje, cyfry i znaki interpunkcyjne.'],
            output_format: ['q wierszy: pangram albo brakuje: i brakujące litery.'],
            constraints: ['1 ≤ q ≤ 200', 'każde zdanie ma od 1 do 300 znaków'],
            examples: [{ input: '2\nThe quick brown fox jumps over the lazy dog.\nAla ma kota, a kot ma Ale!', note: 'Pierwsze zdanie to słynny angielski pangram. W drugim są tylko litery a, e, k, l, m, o i t — brakuje dziewiętnastu.' }],
            hint: R`Po cin >> q wywołaj cin.ignore(), a potem dla każdego zdania getline(cin, s). Dla każdego znaku: if (isalpha(c)) b[tolower(c) - 'a'] = 1;. Brakujące litery to te k, dla których !b[k] — wypisz char('a' + k).`,
            tests: (r) => {
                const ZNAKI = ',.!?;: 0123456789';
                const zdanie = (slow) => { let s = Array.from({ length: slow }, () => { const w = r.pick(SLOWA_ANG); return r() < 0.2 ? w[0].toUpperCase() + w.slice(1) : w; }).join(' '); if (r() < 0.5) s += r.pick(['.', '!', '?']); return s; };
                const t = ['2\nThe quick brown fox jumps over the lazy dog.\nAla ma kota, a kot ma Ale!', '1\n1234 !!!', '1\nABCDEFGHIJKLMNOPQRSTUVWXYZ', '1\nPack my box with five dozen liquor jugs'];
                const a = []; for (let i = 0; i < 200; i++) { let s = zdanie(r.int(3, 40)); if (s.length > 300) s = s.slice(0, 300).trim(); if (r() < 0.2) s = s.replace(/[aeiou]/g, () => r.pick(ZNAKI.split('').filter((c) => c !== ' '))); a.push(s.trim() || 'x'); }
                t.push(wiersze(a));
                t.push(wiersze(Array.from({ length: 50 }, () => 'Sphinx of black quartz, judge my vow! ' + zdanie(5))));
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 200) && l.length === q + 1 && l.slice(1).every((s) => s.length >= 1 && s.length <= 300 && /^[A-Za-z0-9 ,.!?;:]+$/.test(s) && s === s.trim()) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((s) => { const b = new Set(s.toLowerCase().replace(/[^a-z]/g, '')); let w = ''; for (let k = 0; k < 26; k++) { const c = String.fromCharCode(97 + k); if (!b.has(c)) w += c; } return w ? 'brakuje: ' + w : 'pangram'; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    cin.ignore();
    for (int i = 0; i < q; i++) {
        string s;
        getline(cin, s);
        bitset<26> b;
        for (char c : s) {
            if (isalpha(c)) b[tolower(c) - 'a'] = 1;
        }
        if (b.all()) {
            cout << "pangram\n";
        } else {
            cout << "brakuje: ";
            for (int k = 0; k < 26; k++) {
                if (!b[k]) cout << char('a' + k);
            }
            cout << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'bs-szatnia', krok: 2, level: 'srednie',
            title: 'Szatnia',
            short: 'Każdy wchodzący dostaje wolny wieszak o najmniejszym numerze. Szukaj pierwszego zgaszonego bitu pętlą, a pełną szatnię rozpoznasz po count().',
            tags: ['pierwszy zgaszony bit', 'set / reset', 'pełna szatnia'],
            statement: ['Szatnia ma n wieszaków o numerach od 1 do n, na początku wolnych. Zdarzenia: przyjscie — nowa osoba dostaje wolny wieszak o najmniejszym numerze (wypisz ten numer albo brak, gdy wszystkie są zajęte); wyjscie k — osoba z wieszaka k odbiera kurtkę i wieszak się zwalnia.',
                'Wolnego wieszaka szukaj pętlą od 1 w górę. Pełną szatnię rozpoznasz od razu: count() == n.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W każdym z kolejnych q wierszy zdarzenie: przyjscie albo wyjscie k.'],
            output_format: ['Dla każdego zdarzenia przyjscie jeden wiersz: numer wieszaka albo brak.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ q ≤ 5000', 'wyjscie k dotyczy zawsze zajętego wieszaka', 'jest co najmniej jedno zdarzenie przyjscie'],
            examples: [{ input: '3 7\nprzyjscie\nprzyjscie\nwyjscie 1\nprzyjscie\nprzyjscie\nprzyjscie\nprzyjscie', note: 'Pierwsze dwie osoby dostają wieszaki 1 i 2. Po zwolnieniu jedynki trzecia osoba dostaje znowu 1, czwarta — 3, a dla dwóch ostatnich miejsca brak.' }],
            hint: R`bitset<1001> zajety; przy przyjsciu: if ((int)zajety.count() == n) cout << "brak\n"; inaczej for (int k = 1; k <= n; k++) if (!zajety[k]) { zajety[k] = 1; cout << k << "\n"; break; }.`,
            tests: (r) => {
                const gen = (n, q, pw) => {
                    const z = new Set(); const a = [];
                    for (let i = 0; i < q; i++) {
                        if (z.size && r() < pw) { const k = r.pick([...z]); z.delete(k); a.push(`wyjscie ${k}`); }
                        else { a.push('przyjscie'); for (let k = 1; k <= n; k++) if (!z.has(k)) { z.add(k); break; } }
                    }
                    return `${n} ${q}\n${a.join('\n')}`;
                };
                return ['3 7\nprzyjscie\nprzyjscie\nwyjscie 1\nprzyjscie\nprzyjscie\nprzyjscie\nprzyjscie', '1 3\nprzyjscie\nprzyjscie\nwyjscie 1', gen(1000, 5000, 0.3), gen(1000, 5000, 0.45), gen(50, 5000, 0.4), gen(1, 100, 0.5), gen(300, 2000, 0.1)];
            },
            check: (inp) => { const l = L(inp); const [n, q] = l[0].split(' ').map(Number); if (!calk(n, 1, 1000) || !calk(q, 1, 5000) || l.length !== q + 1 || !l.includes('przyjscie')) return 'dane'; const z = new Set(); for (const w of l.slice(1)) { if (w === 'przyjscie') { for (let k = 1; k <= n; k++) if (!z.has(k)) { z.add(k); break; } continue; } const m = w.match(/^wyjscie (\d+)$/); if (!m || !z.has(Number(m[1]))) return 'zly wieszak'; z.delete(Number(m[1])); } return null; },
            solve: (inp) => { const l = L(inp); const n = Number(l[0].split(' ')[0]); const z = new Uint8Array(n + 1); const o = []; for (const w of l.slice(1)) { if (w === 'przyjscie') { let k = 1; while (k <= n && z[k]) k++; if (k > n) o.push('brak'); else { z[k] = 1; o.push(String(k)); } } else z[Number(w.split(' ')[1])] = 0; } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    bitset<1001> zajety;
    for (int i = 0; i < q; i++) {
        string z;
        cin >> z;
        if (z == "przyjscie") {
            if ((int)zajety.count() == n) {
                cout << "brak\n";
                continue;
            }
            for (int k = 1; k <= n; k++) {
                if (!zajety[k]) {
                    zajety[k] = 1;
                    cout << k << "\n";
                    break;
                }
            }
        } else {
            int k;
            cin >> k;
            zajety.reset(k);
        }
    }
    return 0;
}`,
        },
        // ================================================================ KROK 3 · bitset z liczby i z napisu
        {
            id: 'bs-na-32-bity', krok: 3, level: 'latwe',
            title: 'Na 32 bitach',
            short: 'bitset<32>(x) zamienia liczbę na 32 bity z zerami z przodu — wystarczy ją wypisać. Liczby sięgają 4 294 967 295, więc wczytuj je do long long.',
            tags: ['bitset<32>(x)', 'zera z przodu', 'long long'],
            statement: ['Dla każdej z q liczb x wypisz jej zapis dwójkowy na dokładnie 32 bitach — z zerami z przodu.',
                'Nie trzeba dzielić przez 2: bitset<32>(x) zrobi to za Ciebie, a cout wypisze wszystkie 32 bity, od bitu 31 do bitu 0.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczba x.'],
            output_format: ['q wierszy po 32 cyfry 0 i 1.'],
            constraints: ['1 ≤ q ≤ 500', '0 ≤ x ≤ 4 294 967 295'],
            examples: [{ input: '3\n13\n0\n4294967295', note: '13 = 1101, z przodu 28 zer. Zero to same zera, a 4 294 967 295 = 2³² − 1 to 32 jedynki.' }],
            hint: R`long long x; cin >> x; cout << bitset<32>(x) << "\n";. Liczba 4 294 967 295 nie mieści się w int — dlatego long long.`,
            tests: (r) => [wiersze(['13', '0', '4294967295']), wiersze(['1', '2147483648', '2147483647', '65536']), wiersze(Array.from({ length: 500 }, () => String(r.big(0n, 4294967295n)))), wiersze(Array.from({ length: 300 }, () => String(r.int(0, 1000)))), wiersze(Array.from({ length: 32 }, (_, i) => String(2n ** B(i))))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 500) && l.length === q + 1 && l.slice(1).every((x) => calkB(x, 0n, 4294967295n)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((x) => bity(x, 32)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        cout << bitset<32>(x) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-bez-zer-z-przodu', krok: 3, level: 'latwe',
            title: 'Bez zer z przodu',
            short: "to_string() daje zawsze 64 znaki, a find('1') — pozycję pierwszej jedynki. Wytnij resztę przez substr, a zero obsłuż osobno.",
            tags: ['to_string()', "find('1')", 'substr', 'string::npos'],
            statement: ['Dla każdej z q liczb x wypisz jej zapis dwójkowy bez zer z przodu. Zero wypisz jako 0.',
                "Zrób to bitsetem: napis s = bitset<64>(x).to_string() ma zawsze 64 znaki. Pozycję pierwszej jedynki da s.find('1'), a s.substr(p) — napis od pozycji p do końca. Gdy w napisie nie ma jedynki (x = 0), find zwraca specjalną wartość string::npos."],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczba x.'],
            output_format: ['q wierszy: zapis dwójkowy bez zer z przodu.'],
            constraints: ['1 ≤ q ≤ 400', '0 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '4\n13\n1\n0\n1024', note: '13 = 1101, 1 = 1, zero to 0, a 1024 = 2¹⁰ to jedynka i dziesięć zer.' }],
            hint: R`string s = bitset<64>(x).to_string(); size_t p = s.find('1'); if (p == string::npos) cout << "0\n"; else cout << s.substr(p) << "\n";.`,
            tests: (r) => [wiersze(['13', '1', '0', '1024']), wiersze(['1000000000000000000', '999999999999999999', '2', '3']), wiersze(Array.from({ length: 400 }, () => String(r.big(0n, MAX18)))), wiersze(Array.from({ length: 400 }, () => String(r.int(0, 100)))), wiersze(Array.from({ length: 60 }, (_, i) => String(2n ** B(i) - 1n)))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 400) && l.length === q + 1 && l.slice(1).every((x) => calkB(x, 0n, MAX18)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((x) => B(x).toString(2)).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        string s = bitset<64>(x).to_string();
        size_t p = s.find('1');
        if (p == string::npos) cout << "0\n";
        else cout << s.substr(p) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-z-dwojkowego', krok: 3, level: 'latwe',
            title: 'Z dwójkowego na dziesiętny',
            short: 'bitset<64> b(s) zamienia napis zer i jedynek na bity, a b.to_ullong() — bity na liczbę. Dwie linijki zamiast pętli.',
            tags: ['bitset<64> b(s)', 'to_ullong()', 'unsigned long long'],
            statement: ['Dla każdego z q napisów złożonych z zer i jedynek wypisz liczbę, którą ten napis oznacza w systemie dwójkowym.',
                'Napis może mieć zera z przodu. Zbuduj z niego bitset<64> b(s) — krótszy napis zostanie uzupełniony zerami z lewej strony — i wypisz b.to_ullong().'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy napis z zer i jedynek.'],
            output_format: ['q wierszy: wartości napisów w systemie dziesiętnym.'],
            constraints: ['1 ≤ q ≤ 1000', 'każdy napis ma od 1 do 60 znaków 0 i 1'],
            examples: [{ input: '3\n1101\n0001\n111111111111111111111111111111', note: '1101 = 8 + 4 + 1 = 13. Zera z przodu nic nie zmieniają: 0001 = 1. Trzydzieści jedynek to 2³⁰ − 1 = 1 073 741 823.' }],
            hint: R`string s; cin >> s; bitset<64> b(s); cout << b.to_ullong() << "\n";.`,
            tests: (r) => [wiersze(['1101', '0001', '111111111111111111111111111111']), wiersze(['0', '1', '000000', '1'.repeat(60), '1' + '0'.repeat(59)]), wiersze(Array.from({ length: 1000 }, () => P.los01(r, r.int(1, 60)))), wiersze(Array.from({ length: 500 }, () => P.los01(r, 60, 0.9))), wiersze(Array.from({ length: 300 }, () => '0'.repeat(r.int(0, 20)) + P.los01(r, r.int(1, 40))))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((s) => /^[01]{1,60}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((s) => String(BigInt('0b' + s))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string s;
        cin >> s;
        bitset<64> b(s);
        cout << b.to_ullong() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-jedynki-i-zera', krok: 3, level: 'latwe',
            title: 'Jedynki i zera',
            short: "count() policzy jedynki, a długość zapisu bez zer z przodu wyznaczysz z find('1'). Zer jest tyle, ile wynosi długość minus jedynki.",
            tags: ['bitset<64>(x).count()', 'długość zapisu', '64 − pozycja jedynki'],
            statement: ['Dla każdej z q liczb x wypisz, ile jedynek i ile zer ma jej zapis dwójkowy bez zer z przodu. Zero zapisujemy jako 0 — ma jedno zero i żadnej jedynki.',
                "Jedynki policzy bitset<64>(x).count(). Długość zapisu to 64 minus pozycja pierwszej jedynki w napisie to_string() — bo wszystko przed nią to zera z przodu."],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczba x.'],
            output_format: ['q wierszy: liczba jedynek i liczba zer oddzielone spacją.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ x ≤ 10¹⁸'],
            examples: [{ input: '3\n13\n0\n1024', note: '13 = 1101: trzy jedynki i jedno zero. Zero: żadnej jedynki i jedno zero. 1024 = 10000000000: jedna jedynka i dziesięć zer.' }],
            hint: R`bitset<64> b(x); string s = b.to_string(); size_t p = s.find('1'); int dl = (p == string::npos) ? 1 : 64 - p;. Zer jest dl - b.count().`,
            tests: (r) => [wiersze(['13', '0', '1024']), wiersze(['1', '2', '3', '1000000000000000000', '576460752303423487']), wiersze(Array.from({ length: 1000 }, () => String(r.big(0n, MAX18)))), wiersze(Array.from({ length: 1000 }, () => String(r.int(0, 300)))), wiersze(Array.from({ length: 60 }, (_, i) => String(2n ** B(i))))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((x) => calkB(x, 0n, MAX18)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((x) => { const s = B(x).toString(2); const j = jedynkiB(x); return `${j} ${s.length - j}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        long long x;
        cin >> x;
        bitset<64> b(x);
        string s = b.to_string();
        size_t p = s.find('1');
        int dl = 1;
        if (p != string::npos) dl = 64 - p;
        int jedynki = b.count();
        cout << jedynki << " " << dl - jedynki << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-negacja-na-k', krok: 3, level: 'srednie',
            title: 'Negacja na k bitach',
            short: 'flip() odwraca wszystkie 32 bity, a potrzebujesz tylko k ostatnich. Weź koniec napisu: to_string().substr(32 - k) i odczytaj z niego liczbę.',
            tags: ['flip()', 'substr(32 - k)', 'stały rozmiar a zmienne k'],
            statement: ['Liczbę x zapisano na dokładnie k bitach (z zerami z przodu). Odwróć wszystkie te k bitów — zera na jedynki, jedynki na zera — i wypisz wynik jako napis k cyfr oraz jako liczbę.',
                'Rozmiar bitsetu musi być stały, a k zmienia się od zapytania do zapytania. Sposób: bitset<32> b(x); b.flip(); — teraz ostatnie k znaków napisu b.to_string() to szukana negacja, a wcześniejsze znaki (same jedynki) trzeba pominąć.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczby x i k.'],
            output_format: ['q wierszy: k cyfr negacji i po spacji jej wartość.'],
            constraints: ['1 ≤ q ≤ 500', '1 ≤ k ≤ 32', '0 ≤ x < 2ᵏ'],
            examples: [{ input: '3\n13 4\n13 8\n0 1', note: '13 na 4 bitach to 1101, po odwróceniu 0010 = 2. Na 8 bitach: 00001101 → 11110010 = 242. Zero na jednym bicie: 0 → 1.' }],
            hint: R`bitset<32> b(x); b.flip(); string t = b.to_string().substr(32 - k); cout << t << " " << bitset<32>(t).to_ulong() << "\n";.`,
            tests: (r) => {
                const t = [wiersze(['13 4', '13 8', '0 1']), wiersze(['4294967295 32', '0 32', '1 1', '5 3', '2147483648 32'])];
                t.push(wiersze(Array.from({ length: 500 }, () => { const k = r.int(1, 32); return `${r.big(0n, 2n ** B(k) - 1n)} ${k}`; })));
                t.push(wiersze(Array.from({ length: 32 }, (_, i) => `${i % 2 ? 0 : 2 ** (i + 1) - 1} ${i + 1}`)));
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 500) && l.length === q + 1 && l.slice(1).every((w) => { const [x, k] = w.split(' '); return calk(Number(k), 1, 32) && calkB(x, 0n, 2n ** B(k) - 1n); }) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const [x, ks] = w.split(' '); const k = Number(ks); const v = (2n ** B(k) - 1n) ^ B(x); return `${bity(v, k)} ${v}`; }).join('\n'),
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
        b.flip();
        string t = b.to_string().substr(32 - k);
        cout << t << " " << bitset<32>(t).to_ulong() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-kod-u2', krok: 3, level: 'srednie',
            title: 'Kod U2 bitsetem',
            short: 'bitset<8>(x) dla ujemnego x od razu daje kod U2. W drugą stronę: to_ulong() zwraca liczbę od 0 do 255, a od wyników od 128 w górę odejmij 256.',
            tags: ['bitset<8>(-6)', 'to_ulong()', 'wartość ze znakiem'],
            statement: ['Liczby ze znakiem od −128 do 127 komputer zapisuje na 8 bitach w kodzie U2 — pamiętasz go z lekcji Liczby dwójkowe. Odpowiedz na q zapytań dwóch rodzajów.',
                'do x — wypisz 8-bitowy kod U2 liczby x; bitset<8>(x) robi to sam, także dla liczb ujemnych. z s — dla napisu z 8 zer i jedynek wypisz liczbę ze znakiem, którą ten kod oznacza: v = bitset<8>(s).to_ulong() jest od 0 do 255, a gdy v ≥ 128, prawdziwa wartość to v − 256.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy zapytanie: do x albo z s.'],
            output_format: ['q wierszy: 8 cyfr kodu albo liczba ze znakiem.'],
            constraints: ['1 ≤ q ≤ 1000', '−128 ≤ x ≤ 127', 's ma dokładnie 8 znaków 0 i 1'],
            examples: [{ input: '4\ndo 13\ndo -6\nz 11111010\nz 01111111', note: '13 to 00001101. −6 w kodzie U2 to 256 − 6 = 250 = 11111010 — i trzecie zapytanie zamienia ten kod z powrotem na −6. 01111111 to największa dodatnia liczba: 127.' }],
            hint: R`string co; cin >> co; if (co == "do") { int x; cin >> x; cout << bitset<8>(x) << "\n"; } else { string s; cin >> s; int v = bitset<8>(s).to_ulong(); if (v >= 128) v -= 256; cout << v << "\n"; }.`,
            tests: (r) => {
                const t = [wiersze(['do 13', 'do -6', 'z 11111010', 'z 01111111']), wiersze(['do -128', 'do 127', 'do 0', 'do -1', 'z 10000000', 'z 11111111', 'z 00000000'])];
                t.push(wiersze(Array.from({ length: 1000 }, () => r() < 0.5 ? `do ${r.int(-128, 127)}` : `z ${P.los01(r, 8)}`)));
                t.push(wiersze(Array.from({ length: 256 }, (_, i) => `do ${i - 128}`)));
                return t;
            },
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((w) => { const m = w.match(/^do (-?\d+)$/); if (m) return calk(Number(m[1]), -128, 127); return /^z [01]{8}$/.test(w); }) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const [co, a] = w.split(' '); if (co === 'do') { const x = Number(a); return bity(x < 0 ? x + 256 : x, 8); } const v = parseInt(a, 2); return String(v >= 128 ? v - 256 : v); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string co;
        cin >> co;
        if (co == "do") {
            int x;
            cin >> x;
            cout << bitset<8>(x) << "\n";
        } else {
            string s;
            cin >> s;
            int v = bitset<8>(s).to_ulong();
            if (v >= 128) v -= 256;
            cout << v << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'bs-lustro-bitow', krok: 3, level: 'srednie',
            title: 'Lustro bitów',
            short: 'Odbij 16 bitów jak w lustrze: bit 0 zamienia się z bitem 15, bit 1 z bitem 14… Nowy bitset: r[15 - i] = b[i], a wynik to r.to_ulong().',
            tags: ['r[15 - i] = b[i]', 'to_ulong()', 'odwrócony napis'],
            statement: ['Dla każdej z q liczb x od 0 do 65 535 zapisz ją na 16 bitach i odwróć kolejność bitów: bit numer i trafia na miejsce 15 − i. Wypisz otrzymaną liczbę.',
                'Przykład: 1 = 0000000000000001 po odbiciu to 1000000000000000 = 32768.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy liczba x.'],
            output_format: ['q wierszy: liczby po odbiciu bitów.'],
            constraints: ['1 ≤ q ≤ 1000', '0 ≤ x ≤ 65 535'],
            examples: [{ input: '4\n1\n32768\n6\n65535', note: '1 i 32768 zamieniają się miejscami. 6 = 0000000000000110 po odbiciu to 0110000000000000 = 16384 + 8192 = 24576. Same jedynki zostają same jedynkami.' }],
            hint: R`bitset<16> b(x), r; for (int i = 0; i < 16; i++) r[15 - i] = b[i]; cout << r.to_ulong() << "\n";. Inny sposób: odwróć napis b.to_string() funkcją reverse i zbuduj z niego nowy bitset.`,
            tests: (r) => [wiersze(['1', '32768', '6', '65535']), wiersze(['0', '255', '65280', '43690', '21845', '4660']), wiersze(Array.from({ length: 1000 }, () => String(r.int(0, 65535)))), wiersze(Array.from({ length: 16 }, (_, i) => String(1 << i)))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 1000) && l.length === q + 1 && l.slice(1).every((x) => /^\d+$/.test(x) && calk(Number(x), 0, 65535)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((x) => String(parseInt(bity(Number(x), 16).split('').reverse().join(''), 2))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int t = 0; t < q; t++) {
        int x;
        cin >> x;
        bitset<16> b(x), r;
        for (int i = 0; i < 16; i++) r[15 - i] = b[i];
        cout << r.to_ulong() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'bs-dodaj-dwojkowo', krok: 3, level: 'srednie',
            title: 'Dodawanie dwójkowe',
            short: 'Zamień oba napisy na liczby przez to_ullong(), dodaj je, a sumę zamień z powrotem na napis bez zer z przodu. Suma zmieści się w 64 bitach.',
            tags: ['to_ullong()', 'unsigned long long', 'to_string() bez zer'],
            statement: ['Dla każdej pary liczb a i b zapisanych dwójkowo wypisz ich sumę — też dwójkowo, bez zer z przodu.',
                'Liczby mają najwyżej 60 cyfr, więc są mniejsze niż 2⁶⁰, a ich suma — mniejsza niż 2⁶¹ i zmieści się w unsigned long long. Zamień napisy na liczby bitsetem, dodaj zwykłym +, a wynik zamień z powrotem na napis.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwa napisy a i b.'],
            output_format: ['q wierszy: suma zapisana dwójkowo bez zer z przodu (zero jako 0).'],
            constraints: ['1 ≤ q ≤ 300', 'a i b mają od 1 do 60 cyfr 0 i 1 (mogą mieć zera z przodu)'],
            examples: [{ input: '3\n1011 111\n0 0\n1 1', note: '1011 = 11 i 111 = 7, a 11 + 7 = 18 = 10010. Zero plus zero to 0. 1 + 1 = 2 = 10.' }],
            hint: R`unsigned long long s = bitset<64>(a).to_ullong() + bitset<64>(b).to_ullong();, potem string w = bitset<64>(s).to_string(); i wycięcie od pierwszej jedynki — jak w zadaniu „Bez zer z przodu”.`,
            tests: (r) => [wiersze(['1011 111', '0 0', '1 1']), wiersze([`${'1'.repeat(60)} ${'1'.repeat(60)}`, `0001 0`, `${'1'.repeat(60)} 1`]), wiersze(Array.from({ length: 300 }, () => `${P.los01(r, r.int(1, 60))} ${P.los01(r, r.int(1, 60))}`)), wiersze(Array.from({ length: 300 }, () => `${'0'.repeat(r.int(0, 5))}${P.los01(r, r.int(1, 10))} ${P.los01(r, r.int(1, 10))}`))],
            check: (inp) => { const l = L(inp); const q = Number(l[0]); return calk(q, 1, 300) && l.length === q + 1 && l.slice(1).every((w) => /^[01]{1,60} [01]{1,60}$/.test(w)) ? null : 'dane'; },
            solve: (inp) => L(inp).slice(1).map((w) => { const [a, b] = w.split(' '); return (BigInt('0b' + a) + BigInt('0b' + b)).toString(2); }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        string a, b;
        cin >> a >> b;
        unsigned long long s = bitset<64>(a).to_ullong() + bitset<64>(b).to_ullong();
        string w = bitset<64>(s).to_string();
        size_t p = w.find('1');
        if (p == string::npos) cout << "0\n";
        else cout << w.substr(p) << "\n";
    }
    return 0;
}`,
        },
    ];
};
