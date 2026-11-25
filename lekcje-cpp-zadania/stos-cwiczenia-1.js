// Stos — ćwiczenia w trakcie lekcji, części 1–3: pierwszy stos (push, top, pop, size, empty, opróżnianie i odwrócona
// kolejność, kopia stosu i przelewanie do drugiego stosu), polecenia, cofanie i historia (pusty stos, string jako stos,
// kilka testów, dwa stosy, stos par z minimum, przekładanie na drugi stos) oraz nawiasy (licznik i stos, stos indeksów,
// pierwszy błąd, pary liter, najdłuższy poprawny fragment).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./stos-pomoc');
    const { IMIONA, KOLORY, SLOWA, calk, rozrzuc, czyPoprawne, losPoprawne, popsuj, losNawiasy, paraDo, czyOtw, czyZam } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const czyImie = (s, max = 15) => new RegExp(`^[A-Z][a-z]{0,${max - 1}}$`).test(s);
    const czyMale = (s, max = 15) => new RegExp(`^[a-z]{1,${max}}$`).test(s);
    const czyLitery = (s, max = 20) => new RegExp(`^[A-Za-z]{1,${max}}$`).test(s);

    return [
        // ================================================================ KROK 1 · pierwszy stos
        {
            id: 'sto-stos-talerzy', krok: 1, level: 'latwe',
            title: 'Stos talerzy',
            short: 'Kolory talerzy trafiają na stack<string>. Który talerz leży na wierzchu, ile ich jest — i co zostanie na wierzchu, gdy goście zabiorą k talerzy.',
            tags: ['push', 'top i size', 'pop k razy'],
            statement: ['Po obiedzie myjesz n talerzy i odkładasz je jeden na drugi — każdy kolejny ląduje na samej górze. Wczytaj kolory talerzy w kolejności odkładania i połóż każdy na stosie stack<string> poleceniem push.',
                'Wypisz, jaki talerz leży na wierzchu (top) i ile talerzy jest na stosie (size). Potem przychodzą goście i zabierają k talerzy — zawsze ten z samej góry. Zdejmij k razy talerz z wierzchu poleceniem pop, ale tylko wtedy, gdy stos nie jest pusty. Na koniec wypisz kolor talerza, który leży teraz na wierzchu, albo słowo pusto.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n kolorów w kolejności odkładania — pierwszy talerz leży na samym dole, ostatni na samej górze.'],
            output_format: ['Trzy wiersze: na wierzchu: …, talerzy: … oraz po gosciach: … (kolor albo słowo pusto).'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ k ≤ 200', 'Kolory to słowa z 1–12 małych liter (bez polskich znaków).'],
            examples: [{ input: '5 2\nbialy zielony bialy niebieski czerwony', note: 'Ostatni odłożony był czerwony, więc leży na wierzchu. Goście zabierają czerwony i niebieski — na wierzchu zostaje biały.' }],
            hint: R`stack<string> s; i w pętli: cin >> kolor; s.push(kolor);. Potem s.top() i s.size(). Goście: for (int i = 0; i < k; i++) if (!s.empty()) s.pop();. Na końcu: if (s.empty()) cout << "pusto"; else cout << s.top();.`,
            tests: (r) => {
                const d = (a, k) => `${a.length} ${k}\n${a.join(' ')}`;
                const los = (n) => Array.from({ length: n }, () => r.pick(KOLORY));
                return [d(['zolty'], 0), d(['zolty'], 1), d(['szary', 'czarny', 'bialy'], 5), d(los(10), 3), d(los(100), 100), d(los(100), 99), d(los(50), 200), d(los(20), 0)];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]), k = Number(t[1]); return calk(n, 1, 100) && calk(k, 0, 200) && t.length === n + 2 && t.slice(2).every((s) => czyMale(s, 12)) ? null : 'dane'; },
            solve: (inp) => {
                const t = toks(inp);
                const k = Number(t[1]), a = t.slice(2);
                const zostalo = a.length - Math.min(a.length, k);
                return [`na wierzchu: ${a[a.length - 1]}`, `talerzy: ${a.length}`, `po gosciach: ${zostalo ? a[zostalo - 1] : 'pusto'}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    stack<string> s;
    for (int i = 0; i < n; i++) {
        string kolor;
        cin >> kolor;
        s.push(kolor);
    }
    cout << "na wierzchu: " << s.top() << "\n";
    cout << "talerzy: " << s.size() << "\n";
    for (int i = 0; i < k; i++) {
        if (!s.empty()) s.pop();
    }
    cout << "po gosciach: ";
    if (s.empty()) cout << "pusto\n";
    else cout << s.top() << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-liczby-od-konca', krok: 1, level: 'latwe',
            title: 'Liczby od końca',
            short: 'Wszystkie liczby na stos, a potem zdejmuj, dopóki coś zostało — wyjdą w odwrotnej kolejności. Najprostsza i najważniejsza własność stosu.',
            tags: ['while (!s.empty())', 'top i pop', 'odwracanie'],
            statement: ['Wczytaj n liczb całkowitych i połóż każdą na stosie stack<int>.',
                'Potem zdejmuj liczby ze stosu, dopóki nie jest pusty: wypisz liczbę z wierzchu (top) i usuń ją (pop). Liczby wyjdą w odwrotnej kolejności niż na wejściu — ostatnia wczytana zostanie wypisana jako pierwsza.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb w odwrotnej kolejności, oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 2000', 'Liczby są z przedziału od −10⁶ do 10⁶.'],
            examples: [{ input: '5\n3 8 1 9 4', note: 'Na wierzchu leży 4 (wczytana ostatnia), pod nią 9, i tak dalej aż do 3 na samym dole.' }],
            hint: R`stack<int> s; for (…) { cin >> x; s.push(x); }. Potem while (!s.empty()) { cout << s.top() << " "; s.pop(); }. Najpierw top (odczyt), dopiero potem pop (usunięcie) — pop niczego nie oddaje.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([7]), d([1, 2]), d([0, 0, 0]), d([-5, 3, -1, 2]), d(r.arr(10, -9, 9)), d(r.arr(2000, -1000000, 1000000)), d(r.arr(300, 1, 100)), d(Array.from({ length: 50 }, (_, i) => i + 1))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 2000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e6, 1e6)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).reverse().join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    stack<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.push(x);
    }
    while (!s.empty()) {
        cout << s.top() << " ";
        s.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-slowa-wspak', krok: 1, level: 'latwe',
            title: 'Każde słowo wspak',
            short: 'Litery słowa po kolei na stack<char>, a potem zdejmowanie — słowo wychodzi wspak. Osobny stos dla każdego słowa.',
            tags: ['stack<char>', 'stos w pętli', 'odwracanie słowa'],
            statement: ['Wczytaj n słów. Każde słowo zapisz wspak, czyli od ostatniej litery do pierwszej, ale słowa zostaw w tej samej kolejności co na wejściu.',
                'Odwróć każde słowo stosem: połóż wszystkie jego litery na stosie stack<char>, a potem zdejmuj je i wypisuj, dopóki stos nie jest pusty. Nie używaj gotowej funkcji reverse — ćwiczymy stos.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów oddzielonych spacjami.'],
            output_format: ['Jeden wiersz: n słów zapisanych wspak, oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 200', 'Słowa mają od 1 do 20 liter (małych albo wielkich, bez polskich znaków).'],
            examples: [{ input: '3\nAla ma kota', note: 'Ala → alA, ma → am, kota → atok. Wielkość liter się nie zmienia.' }],
            hint: R`for (int i = 0; i < n; i++) { string w; cin >> w; stack<char> s; for (char c : w) s.push(c); while (!s.empty()) { cout << s.top(); s.pop(); } cout << " "; }. Stos deklarowany w pętli jest za każdym razem nowy i pusty.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const slowo = () => { const w = r.pick([...SLOWA, ...IMIONA]); return r() < 0.2 ? w.toUpperCase() : w; };
                return [d(['a']), d(['ab', 'X']), d(['kajak', 'Anna', 'oko']), d(Array.from({ length: 12 }, slowo)), d(Array.from({ length: 200 }, slowo)), d([r.word(20, 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')])];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 200) && t.length === n + 1 && t.slice(1).every((s) => czyLitery(s, 20)) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((w) => w.split('').reverse().join('')).join(' '),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        stack<char> s;
        for (char c : w) s.push(c);
        while (!s.empty()) {
            cout << s.top();
            s.pop();
        }
        cout << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-zdanie-od-konca', krok: 1, level: 'latwe',
            title: 'Zdanie od końca',
            short: 'Słowa aż do KONIEC trafiają na stack<string>. Ile ich było i jak brzmi zdanie czytane od ostatniego słowa.',
            tags: ['stack<string>', 'wczytywanie do słowa KONIEC', 'size przed opróżnieniem'],
            statement: ['Wczytuj słowa, aż trafisz na słowo KONIEC (ono już do zdania nie należy). Każde słowo połóż na stosie stack<string>.',
                'Wypisz, ile słów wczytano, a w drugim wierszu — wszystkie słowa w odwrotnej kolejności, od ostatniego do pierwszego. Same słowa się nie zmieniają. Zwróć uwagę: liczbę słów odczytaj przez size(), zanim zaczniesz opróżniać stos.'],
            input_format: ['Słowa oddzielone spacjami albo znakami nowej linii (mogą zajmować kilka wierszy). Ostatnie słowo to KONIEC.'],
            output_format: ['Dwa wiersze: slow: k oraz słowa od ostatniego do pierwszego, oddzielone spacjami.'],
            constraints: ['Słów przed KONIEC jest od 1 do 1000.', 'Każde słowo ma od 1 do 15 liter (bez polskich znaków) i nie jest słowem KONIEC.'],
            examples: [{ input: 'Ola idzie do szkoly\nKONIEC', note: 'Cztery słowa. Na wierzchu stosu leży szkoly, więc ono wychodzi pierwsze.' },
                { input: 'raz dwa\ntrzy\n\ncztery KONIEC', note: 'Słowa mogą być rozrzucone po kilku wierszach — cin >> pomija spacje i entery.' }],
            hint: R`stack<string> s; string w; while (cin >> w && w != "KONIEC") s.push(w);. Potem cout << "slow: " << s.size(); — zanim opróżnisz stos! — i while (!s.empty()) { cout << s.top() << " "; s.pop(); }.`,
            tests: (r) => {
                const d = (a) => rozrzuc(r, [...a, 'KONIEC']);
                const slowo = () => r.pick([...SLOWA, ...IMIONA]);
                return ['jeden KONIEC', 'a\nb\nKONIEC', d(Array.from({ length: 7 }, slowo)), d(Array.from({ length: 1000 }, slowo)), d(Array.from({ length: 60 }, slowo)), rozrzuc(r, [...Array.from({ length: 30 }, slowo), 'KONIEC'], 'kolumna')];
            },
            check: (inp) => { const t = toks(inp); const k = t.indexOf('KONIEC'); return k >= 1 && k <= 1000 && k === t.length - 1 && t.slice(0, k).every((s) => czyLitery(s, 15)) ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp); const a = t.slice(0, t.indexOf('KONIEC')); return `slow: ${a.length}\n${a.reverse().join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    stack<string> s;
    string w;
    while (cin >> w && w != "KONIEC") s.push(w);
    cout << "slow: " << s.size() << "\n";
    while (!s.empty()) {
        cout << s.top() << " ";
        s.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-od-gory-i-od-dolu', krok: 1, level: 'latwe',
            title: 'Od góry i od dołu',
            short: 'Wypisz stos od wierzchu i od spodu, a na koniec pokaż, że wciąż jest cały. Funkcja dostaje kopię, a odwrócenie robi drugi stos.',
            tags: ['stos jako parametr (kopia)', 'przelewanie do drugiego stosu', 'odwracanie dwa razy'],
            statement: ['Wczytaj n liczb i połóż je po kolei na stosie stack<int> — pierwsza liczba leży na samym dole.',
                'Wypisz zawartość stosu dwa razy: najpierw od góry do dołu, a potem od dołu do góry. Na koniec wypisz, ile liczb wciąż jest na stosie w main — ma ich być n, bo stosu w main nie wolno zepsuć.',
                'Napisz dwie funkcje z parametrem stack<int> s (bez &, czyli dostają kopię). Pierwsza zdejmuje liczby z kopii i wypisuje je — wyjdą od góry. Druga najpierw przelewa kopię do drugiego, pomocniczego stosu (zdejmuje z jednego i kładzie na drugi), a potem opróżnia pomocniczy — przelanie odwraca kolejność, więc liczby wyjdą od dołu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych — w kolejności kładzenia na stos.'],
            output_format: ['Trzy wiersze: od gory: … , od dolu: … oraz na stosie: n.'],
            constraints: ['1 ≤ n ≤ 1000', 'Liczby są z przedziału od 1 do 10⁴.'],
            examples: [{ input: '4\n5 1 7 2', note: 'Na wierzchu leży 2, na samym dole 5. Po przelaniu do pomocniczego stosu na jego wierzchu ląduje 5 — dlatego druga funkcja wypisuje od dołu. Stos w main wciąż ma 4 liczby.' }],
            hint: R`void odGory(stack<int> s) { … while (!s.empty()) { cout << " " << s.top(); s.pop(); } }. void odDolu(stack<int> s) { stack<int> pom; while (!s.empty()) { pom.push(s.top()); s.pop(); } … i teraz opróżnij pom }. W main: odGory(s); odDolu(s); cout << "na stosie: " << s.size();.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([9]), d([1, 2]), d([3, 3, 1]), d(r.arr(15, 1, 99)), d(r.arr(1000, 1, 10000)), d(r.arr(200, 1, 10))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e4)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); return `od gory: ${a.slice().reverse().join(' ')}\nod dolu: ${a.join(' ')}\nna stosie: ${a.length}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void odGory(stack<int> s) {
    cout << "od gory:";
    while (!s.empty()) {
        cout << " " << s.top();
        s.pop();
    }
    cout << "\n";
}
void odDolu(stack<int> s) {
    stack<int> pom;
    while (!s.empty()) {
        pom.push(s.top());
        s.pop();
    }
    cout << "od dolu:";
    while (!pom.empty()) {
        cout << " " << pom.top();
        pom.pop();
    }
    cout << "\n";
}
int main() {
    int n;
    cin >> n;
    stack<int> s;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        s.push(x);
    }
    odGory(s);
    odDolu(s);
    cout << "na stosie: " << s.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-systemy-liczbowe', krok: 1, level: 'latwe',
            title: 'Systemy liczbowe stosem',
            short: 'Reszty z dzielenia przez b wychodzą od ostatniej cyfry — stos odwraca je we właściwą kolejność. Dwójkowy, ósemkowy, szesnastkowy.',
            tags: ['stos reszt', 'x % b i x / b', 'long long'],
            statement: ['Dla każdego zapytania zamień liczbę x z systemu dziesiątkowego na system o podstawie b.',
                'Klasyczny sposób: dopóki x > 0, reszta x % b to kolejna cyfra wyniku, a potem x /= b. Kłopot w tym, że cyfry wychodzą od końca — najpierw ostatnia. Kładź więc reszty na stos, a potem zdejmuj i wypisuj: stos odwróci je we właściwą kolejność. W systemach większych niż dziesiątkowy cyfry 10, 11, 12, 13, 14, 15 zapisuje się literami A, B, C, D, E, F. Liczba 0 w każdym systemie to 0.'],
            input_format: ['W pierwszym wierszu liczba zapytań t.', 'W każdym z t kolejnych wierszy dwie liczby: x i b.'],
            output_format: ['t wierszy — liczba x zapisana w systemie o podstawie b (wielkie litery A–F).'],
            constraints: ['1 ≤ t ≤ 100', '0 ≤ x ≤ 10¹⁸', '2 ≤ b ≤ 16'],
            examples: [{ input: '4\n13 2\n255 16\n0 7\n100 8', note: '13 = 1101 dwójkowo: reszty z dzielenia przez 2 to kolejno 1, 0, 1, 1 — stos odwraca je w 1101. 255 szesnastkowo to FF.' }],
            hint: R`string cyfry = "0123456789ABCDEF"; long long x; int b;. if (x == 0) wypisz 0. Inaczej: stack<int> s; while (x > 0) { s.push(x % b); x /= b; } i while (!s.empty()) { cout << cyfry[s.top()]; s.pop(); }. x do 10¹⁸ — tylko long long.`,
            tests: (r) => {
                const d = (q) => `${q.length}\n${q.map(([x, b]) => `${x} ${b}`).join('\n')}`;
                const q = [];
                for (let i = 0; i < 100; i++) q.push([r() < 0.3 ? String(r.int(0, 1000)) : String(r.big(0, 10n ** 18n)), r.int(2, 16)]);
                return [d([['0', 2]]), d([['1', 2], ['1', 16]]), d([['1000000000000000000', 2], ['1000000000000000000', 16], ['1000000000000000000', 3]]), d([['15', 16], ['16', 16], ['255', 2], ['7', 8], ['8', 8]]), d(q), d(Array.from({ length: 15 }, (_, i) => [String(i + 2), i + 2]))];
            },
            check: (inp) => {
                const t = toks(inp); const n = Number(t[0]);
                if (!calk(n, 1, 100) || t.length !== 2 * n + 1) return 'dane';
                for (let i = 0; i < n; i++) { const x = BigInt(t[1 + 2 * i]), b = Number(t[2 + 2 * i]); if (x < 0n || x > 10n ** 18n || !calk(b, 2, 16)) return 'zakres'; }
                return null;
            },
            solve: (inp) => { const t = toks(inp); const o = []; for (let i = 0; i < Number(t[0]); i++) o.push(BigInt(t[1 + 2 * i]).toString(Number(t[2 + 2 * i])).toUpperCase()); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    string cyfry = "0123456789ABCDEF";
    while (t--) {
        long long x;
        int b;
        cin >> x >> b;
        if (x == 0) {
            cout << 0 << "\n";
            continue;
        }
        stack<int> s;
        while (x > 0) {
            s.push(x % b);
            x /= b;
        }
        while (!s.empty()) {
            cout << cyfry[s.top()];
            s.pop();
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-wieza-po-kazdej-zmianie', krok: 1, level: 'latwe',
            title: 'Wieża po każdej zmianie',
            short: 'Polecenia + x i -, a po każdym cała wieża od dołu do góry. Funkcja dostaje kopię stosu i odwraca ją drugim stosem.',
            tags: ['kopia stosu', 'drugi stos odwraca', 'pusty stos'],
            statement: ['Budujesz wieżę z ponumerowanych klocków. Na początku wieży nie ma. Wykonaj q poleceń: + x kładzie klocek z numerem x na samą górę, a - zdejmuje klocek z samej góry. Polecenie - pojawia się tylko wtedy, gdy wieża nie jest pusta.',
                'Po każdym poleceniu wypisz całą wieżę od najniższego klocka do najwyższego (numery oddzielone spacjami) albo słowo pusto. Wieżę trzymaj na stosie stack<int>. Stosu nie da się przejść pętlą for — napisz funkcję void wypisz(stack<int> s), która dostaje kopię, przelewa ją do pomocniczego stosu (wtedy na wierzchu będzie najniższy klocek) i dopiero ten pomocniczy opróżnia, wypisując numery.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno polecenie: + x albo -.'],
            output_format: ['q wierszy — wieża po każdym poleceniu, od dołu do góry (albo pusto).'],
            constraints: ['1 ≤ q ≤ 60', '1 ≤ x ≤ 999', 'Polecenie - nigdy nie dotyczy pustej wieży.'],
            examples: [{ input: '5\n+ 4\n+ 7\n+ 1\n-\n+ 9', note: 'Po trzech poleceniach + wieża to 4 7 1 (4 na dole). Polecenie - zdejmuje 1 — ostatni położony klocek — a 9 ląduje na górze.' }],
            hint: R`void wypisz(stack<int> s) { if (s.empty()) { cout << "pusto\n"; return; } stack<int> pom; while (!s.empty()) { pom.push(s.top()); s.pop(); } while (!pom.empty()) { cout << pom.top() << " "; pom.pop(); } cout << "\n"; } — w main po każdym poleceniu wypisz(s);. Polecenie czytaj jako char: cin >> c; if (c == '+') { cin >> x; s.push(x); } else s.pop();.`,
            tests: (r) => {
                const gen = (q) => {
                    const o = []; let size = 0;
                    for (let i = 0; i < q; i++) {
                        if (size && r() < 0.4) { o.push('-'); size--; } else { o.push(`+ ${r.int(1, 999)}`); size++; }
                    }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\n+ 5', '2\n+ 5\n-', '6\n+ 1\n+ 2\n-\n-\n+ 3\n-', gen(20), gen(60), gen(60), gen(35)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 60) || L.length !== q + 1) return 'liczba poleceń';
                let s = 0;
                for (const l of L.slice(1)) {
                    if (l === '-') { if (!s) return 'pop z pustej'; s--; } else { const m = l.match(/^\+ (\d+)$/); if (!m || !calk(Number(m[1]), 1, 999)) return 'polecenie'; s++; }
                }
                return null;
            },
            solve: (inp) => {
                const st = [], o = [];
                for (const l of linie(inp).slice(1)) {
                    if (l === '-') st.pop(); else st.push(Number(l.slice(2)));
                    o.push(st.length ? st.join(' ') : 'pusto');
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wypisz(stack<int> s) {
    if (s.empty()) {
        cout << "pusto\n";
        return;
    }
    stack<int> pom;
    while (!s.empty()) {
        pom.push(s.top());
        s.pop();
    }
    while (!pom.empty()) {
        cout << pom.top() << " ";
        pom.pop();
    }
    cout << "\n";
}
int main() {
    int q;
    cin >> q;
    stack<int> s;
    for (int i = 0; i < q; i++) {
        char c;
        cin >> c;
        if (c == '+') {
            int x;
            cin >> x;
            s.push(x);
        } else {
            s.pop();
        }
        wypisz(s);
    }
    return 0;
}`,
        },
        {
            id: 'sto-palindromy', krok: 1, level: 'latwe',
            title: 'Palindromy stosem',
            short: 'Stos oddaje litery od końca. Porównaj je z literami od początku — jeśli wszystkie pasują, słowo jest palindromem.',
            tags: ['stos jako odwrócenie', 'porównywanie z top', 'TAK / NIE'],
            statement: ['Palindrom to słowo, które czytane od końca jest takie samo jak od początku, na przykład kajak albo oko. Dla każdego z t słów sprawdź, czy jest palindromem.',
                'Zrób to stosem: połóż na stosie stack<char> wszystkie litery słowa. Ze stosu litery wychodzą od ostatniej do pierwszej — przejdź więc słowo od początku i każdą literę porównaj z literą zdjętą ze stosu. Jeśli wszystkie pary są równe, słowo jest palindromem.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jedno słowo z małych liter.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 100', 'Każde słowo ma od 1 do 1000 małych liter.'],
            examples: [{ input: '4\nkajak\nkotek\noko\nab', note: 'kajak czytany od końca to kajak — TAK. kotek od końca to ketok — NIE. Jedna litera i para takich samych liter też są palindromami.' }],
            hint: R`stack<char> s; for (char c : w) s.push(c); bool ok = true; for (char c : w) { if (c != s.top()) ok = false; s.pop(); }. Stos trzeba założyć od nowa dla każdego słowa — najprościej deklarując go wewnątrz pętli po słowach.`,
            tests: (r) => {
                const pal = (n) => { const a = r.word(Math.ceil(n / 2), 'abcde'); return a + a.slice(0, Math.floor(n / 2)).split('').reverse().join(''); };
                const prawie = (n) => { const s = pal(n).split(''); const i = r.int(0, n - 1); s[i] = s[i] === 'a' ? 'b' : 'a'; return s.join(''); };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const duzo = [];
                for (let i = 0; i < 100; i++) { const n = r.int(1, 1000); duzo.push(r() < 0.5 ? pal(n) : r() < 0.6 ? prawie(n) : r.word(n, 'ab')); }
                return [d(['a']), d(['aa', 'ab', 'aba', 'abb']), d(['radar', 'kajak', 'kot', 'zakaz', 'oko', 'ola']), d(duzo), d([pal(1000), prawie(1000), pal(999)])];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 100) && t.length === n + 1 && t.slice(1).every((s) => /^[a-z]{1,1000}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((w) => (w === w.split('').reverse().join('') ? 'TAK' : 'NIE')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        string w;
        cin >> w;
        stack<char> s;
        for (char c : w) s.push(c);
        bool ok = true;
        for (char c : w) {
            if (c != s.top()) ok = false;
            s.pop();
        }
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 2 · polecenia, cofanie i historia
        {
            id: 'sto-polecenia', krok: 2, level: 'latwe',
            title: 'Polecenia dla stosu',
            short: 'PUSH, POP, TOP i SIZE z wejścia. Przed każdym top() i pop() sprawdź empty() — pusty stos dostaje komunikat zamiast awarii.',
            tags: ['polecenia z wejścia', 'pusty stos', 'POP wypisuje zdjęty'],
            statement: ['Stos liczb jest na początku pusty. Wykonaj q poleceń:',
                'PUSH x — połóż liczbę x na wierzch stosu; POP — zdejmij liczbę z wierzchu i wypisz ją; TOP — wypisz liczbę z wierzchu, nie zdejmując jej; SIZE — wypisz, ile liczb jest na stosie.',
                'Jeśli POP albo TOP trafi na pusty stos, wypisz słowo pusty — wywołanie top() albo pop() na pustym stosie wywraca program, więc zawsze najpierw sprawdź empty().'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno polecenie: PUSH x, POP, TOP albo SIZE.'],
            output_format: ['Po jednym wierszu dla każdego polecenia POP, TOP i SIZE (PUSH niczego nie wypisuje).'],
            constraints: ['1 ≤ q ≤ 1000', 'Liczby x są z przedziału od −10⁹ do 10⁹.'],
            examples: [{ input: '7\nPUSH 5\nPUSH 8\nTOP\nPOP\nSIZE\nPOP\nPOP', note: 'TOP pokazuje 8 i jej nie zdejmuje. Pierwsze POP zdejmuje 8, potem zostaje jedna liczba. Drugie POP zdejmuje 5, a trzecie trafia na pusty stos.' }],
            hint: R`string p; cin >> p; if (p == "PUSH") { cin >> x; s.push(x); } else if (p == "POP") { if (s.empty()) cout << "pusty\n"; else { cout << s.top() << "\n"; s.pop(); } } … — POP to najpierw top (żeby wypisać), dopiero potem pop.`,
            tests: (r) => {
                const gen = (q, pPush) => {
                    const o = [];
                    for (let i = 0; i < q; i++) {
                        const p = r();
                        if (p < pPush) o.push(`PUSH ${r.int(-1000000000, 1000000000)}`);
                        else if (p < pPush + (1 - pPush) * 0.45) o.push('POP');
                        else if (p < pPush + (1 - pPush) * 0.8) o.push('TOP');
                        else o.push('SIZE');
                    }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nPOP', '1\nSIZE', '3\nPUSH -7\nTOP\nSIZE', '4\nPUSH 1\nPOP\nPOP\nTOP', gen(30, 0.5), gen(1000, 0.55), gen(1000, 0.3), gen(200, 0.8)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 1000) || L.length !== q + 1) return 'liczba poleceń';
                return L.slice(1).every((l) => /^(POP|TOP|SIZE)$/.test(l) || (/^PUSH -?\d+$/.test(l) && calk(Number(l.slice(5)), -1e9, 1e9))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const st = [], o = [];
                for (const l of linie(inp).slice(1)) {
                    if (l.startsWith('PUSH')) st.push(Number(l.slice(5)));
                    else if (l === 'POP') o.push(st.length ? String(st.pop()) : 'pusty');
                    else if (l === 'TOP') o.push(st.length ? String(st[st.length - 1]) : 'pusty');
                    else o.push(String(st.length));
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    stack<int> s;
    while (q--) {
        string p;
        cin >> p;
        if (p == "PUSH") {
            int x;
            cin >> x;
            s.push(x);
        } else if (p == "POP") {
            if (s.empty()) cout << "pusty\n";
            else {
                cout << s.top() << "\n";
                s.pop();
            }
        } else if (p == "TOP") {
            if (s.empty()) cout << "pusty\n";
            else cout << s.top() << "\n";
        } else {
            cout << s.size() << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'sto-backspace', krok: 2, level: 'latwe',
            title: 'Klawisz Backspace',
            short: 'Litery dopisujesz na koniec, a # kasuje ostatnią. Napis to też stos znaków: push_back, back i pop_back.',
            tags: ['string jako stos', 'pop_back', 'kasowanie na pustym'],
            statement: ['Ktoś pisze na klawiaturze, a Ty dostajesz zapis wszystkich wciśniętych klawiszy. Mała litera dopisuje się na koniec tekstu, a znak # oznacza klawisz Backspace — kasuje ostatnią literę tekstu. Backspace przy pustym tekście nic nie robi.',
                'Wypisz tekst, który zostanie na ekranie. Tekst zachowuje się dokładnie jak stos: dopisujemy na koniec i kasujemy z końca. Możesz użyć stack<char> (wtedy na końcu trzeba odwrócić kolejność) albo zwykłego string, który ma polecenia push_back, back i pop_back — działa jak stos, a do tego da się go od razu wypisać.'],
            input_format: ['Jeden wiersz: ciąg małych liter i znaków #.'],
            output_format: ['Jeden wiersz: tekst na ekranie albo (pusto), jeśli nic nie zostało.'],
            constraints: ['Ciąg ma od 1 do 20 000 znaków.'],
            examples: [{ input: 'kott#ek', note: 'Po kott Backspace kasuje drugie t, a potem dopisuje się ek.' }, { input: 'ab###c#', note: 'Trzeci # trafia na pusty tekst i nic nie robi. Na końcu c też zostaje skasowane.' }],
            hint: R`string tekst; for (char c : s) { if (c == '#') { if (!tekst.empty()) tekst.pop_back(); } else tekst.push_back(c); }. Na koniec if (tekst.empty()) cout << "(pusto)"; else cout << tekst;. Bez sprawdzenia empty() pop_back na pustym napisie psuje program.`,
            tests: (r) => {
                const gen = (n, p) => Array.from({ length: n }, () => (r() < p ? '#' : r.pick('abcdefghijklmnopqrstuvwxyz'.split('')))).join('');
                return ['a', '#', 'abc', 'abc###', '##ab#c', gen(50, 0.3), gen(20000, 0.3), gen(20000, 0.5), gen(20000, 0.05), gen(1000, 0.48)];
            },
            check: (inp) => (/^[a-z#]{1,20000}$/.test(inp) ? null : 'dane'),
            solve: (inp) => { const st = []; for (const c of inp) { if (c === '#') st.pop(); else st.push(c); } return st.length ? st.join('') : '(pusto)'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    string tekst;
    for (char c : s) {
        if (c == '#') {
            if (!tekst.empty()) tekst.pop_back();
        } else {
            tekst.push_back(c);
        }
    }
    if (tekst.empty()) cout << "(pusto)\n";
    else cout << tekst << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-robot-z-cofaniem', krok: 2, level: 'latwe',
            title: 'Robot z przyciskiem Cofnij',
            short: 'Robot pamięta swoje ruchy na stosie. C cofa ostatni zapamiętany ruch — trzeba wykonać ruch odwrotny i zdjąć go ze stosu.',
            tags: ['stos ruchów', 'cofanie = ruch odwrotny', 'C na pustym stosie'],
            statement: ['Robot stoi w punkcie (0, 0) na kratce i dostaje ciąg poleceń. G przesuwa go o jedno pole w górę (y rośnie o 1), D w dół (y maleje o 1), L w lewo (x maleje o 1), a P w prawo (x rośnie o 1).',
                'Polecenie C oznacza „cofnij”: robot wykonuje ruch odwrotny do ostatniego zapamiętanego ruchu i zapomina o nim. Kolejne C cofa ruch wcześniejszy i tak dalej. Jeśli nie ma już żadnego zapamiętanego ruchu, C nic nie robi. Każdy zwykły ruch robot zapamiętuje — trzymaj ruchy na stosie stack<char>.',
                'Wypisz, gdzie robot stoi na końcu i ile ruchów ma jeszcze w pamięci.'],
            input_format: ['Jeden wiersz: ciąg liter G, D, L, P i C.'],
            output_format: ['Dwa wiersze: pozycja: x y oraz w pamieci: k.'],
            constraints: ['Ciąg ma od 1 do 100 000 liter.'],
            examples: [{ input: 'GGPCC', note: 'Po GGP robot stoi w (1, 2). Pierwsze C cofa P (ruch w lewo), drugie C cofa drugie G (ruch w dół). Zostaje (0, 1) i jeden ruch w pamięci.' },
                { input: 'CCLDC', note: 'Dwa pierwsze C nic nie robią — pamięć jest pusta. Ostatnie C cofa D.' }],
            hint: R`stack<char> ruchy; int x = 0, y = 0;. Zwykły ruch: ruchy.push(c) i zmiana x albo y. C: if (!ruchy.empty()) { char r = ruchy.top(); ruchy.pop(); i ruch odwrotny: dla G — y--, dla D — y++, dla L — x++, dla P — x--; }.`,
            tests: (r) => {
                const gen = (n, pc) => Array.from({ length: n }, () => (r() < pc ? 'C' : r.pick(['G', 'D', 'L', 'P']))).join('');
                return ['G', 'C', 'GC', 'PPPPLC', gen(40, 0.3), gen(100000, 0.3), gen(100000, 0.5), gen(100000, 0.02), 'C'.repeat(50) + 'P'.repeat(50)];
            },
            check: (inp) => (/^[GDLPC]{1,100000}$/.test(inp) ? null : 'dane'),
            solve: (inp) => {
                const st = []; let x = 0, y = 0;
                const ruch = (c, z) => { if (c === 'G') y += z; else if (c === 'D') y -= z; else if (c === 'L') x -= z; else x += z; };
                for (const c of inp) { if (c === 'C') { if (st.length) ruch(st.pop(), -1); } else { st.push(c); ruch(c, 1); } }
                return `pozycja: ${x} ${y}\nw pamieci: ${st.length}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    stack<char> ruchy;
    int x = 0, y = 0;
    for (char c : s) {
        if (c == 'C') {
            if (ruchy.empty()) continue;
            char r = ruchy.top();
            ruchy.pop();
            if (r == 'G') y--;
            else if (r == 'D') y++;
            else if (r == 'L') x++;
            else x--;
        } else {
            ruchy.push(c);
            if (c == 'G') y++;
            else if (c == 'D') y--;
            else if (c == 'L') x--;
            else x++;
        }
    }
    cout << "pozycja: " << x << " " << y << "\n";
    cout << "w pamieci: " << ruchy.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-kalkulator-z-cofaniem', krok: 2, level: 'latwe',
            title: 'Kalkulator z przyciskiem Cofnij',
            short: 'Przed każdym działaniem odłóż starą wartość na stos. COFNIJ zdejmuje ją i przywraca — tak działa Ctrl+Z.',
            tags: ['stos poprzednich wartości', 'COFNIJ', 'long long'],
            statement: ['Kalkulator pokazuje liczbę, na początku 0. Dostaje q poleceń: + x dodaje x, - x odejmuje x, * x mnoży przez x, a COFNIJ przywraca wartość sprzed ostatniego niecofniętego działania (jak Ctrl+Z). Kilka COFNIJ z rzędu cofa kilka działań. COFNIJ, gdy nie ma już czego cofać, nic nie robi.',
                'Po każdym poleceniu wypisz liczbę na ekranie kalkulatora. Sztuczka: przed wykonaniem działania połóż aktualną wartość na stosie stack<long long>. COFNIJ zdejmuje wtedy z wierzchu dokładnie tę wartość, do której trzeba wrócić.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy polecenie: + x, - x, * x albo COFNIJ.'],
            output_format: ['q wierszy — liczba na ekranie po każdym poleceniu.'],
            constraints: ['1 ≤ q ≤ 1000', 'Przy + i - jest 0 ≤ x ≤ 10⁶, przy * jest 0 ≤ x ≤ 10.', 'Wartość na ekranie zawsze mieści się w przedziale od −10¹⁸ do 10¹⁸.'],
            examples: [{ input: '6\n+ 5\n* 3\n- 4\nCOFNIJ\nCOFNIJ\n+ 1', note: 'Po trzech działaniach: 5, 15, 11. Pierwsze COFNIJ wraca do 15, drugie do 5. Potem + 1 daje 6.' }],
            hint: R`long long w = 0; stack<long long> historia;. Działanie: historia.push(w); i dopiero potem w += x (albo -=, *=). COFNIJ: if (!historia.empty()) { w = historia.top(); historia.pop(); }. Po każdym poleceniu cout << w << "\n";.`,
            tests: (r) => {
                const gen = (q, pc) => {
                    const o = []; const hist = []; let w = 0n;
                    for (let i = 0; i < q; i++) {
                        const p = r();
                        if (p < pc) { o.push('COFNIJ'); if (hist.length) w = hist.pop(); continue; }
                        let op = r.pick(['+', '-', '*', '+', '-']), x = op === '*' ? r.int(0, 10) : r.int(0, 1000000);
                        let nw = op === '+' ? w + BigInt(x) : op === '-' ? w - BigInt(x) : w * BigInt(x);
                        if (nw > 10n ** 18n || nw < -(10n ** 18n)) { op = w > 0n ? '-' : '+'; x = r.int(0, 1000000); nw = op === '+' ? w + BigInt(x) : w - BigInt(x); }
                        hist.push(w); w = nw; o.push(`${op} ${x}`);
                    }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nCOFNIJ', '2\n+ 7\nCOFNIJ', '4\n* 5\n+ 3\n* 10\nCOFNIJ', gen(20, 0.3), gen(1000, 0.3), gen(1000, 0.1), gen(1000, 0.55)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 1000) || L.length !== q + 1) return 'liczba poleceń';
                const hist = []; let w = 0n;
                for (const l of L.slice(1)) {
                    if (l === 'COFNIJ') { if (hist.length) w = hist.pop(); continue; }
                    const m = l.match(/^([+*-]) (\d+)$/);
                    if (!m) return 'polecenie';
                    const x = Number(m[2]);
                    if (m[1] === '*' ? !calk(x, 0, 10) : !calk(x, 0, 1e6)) return 'x';
                    hist.push(w);
                    w = m[1] === '+' ? w + BigInt(x) : m[1] === '-' ? w - BigInt(x) : w * BigInt(x);
                    if (w > 10n ** 18n || w < -(10n ** 18n)) return 'zakres';
                }
                return null;
            },
            solve: (inp) => {
                const hist = [], o = []; let w = 0n;
                for (const l of linie(inp).slice(1)) {
                    if (l === 'COFNIJ') { if (hist.length) w = hist.pop(); } else {
                        const x = BigInt(l.slice(2)); hist.push(w);
                        w = l[0] === '+' ? w + x : l[0] === '-' ? w - x : w * x;
                    }
                    o.push(String(w));
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    long long w = 0;
    stack<long long> historia;
    while (q--) {
        string p;
        cin >> p;
        if (p == "COFNIJ") {
            if (!historia.empty()) {
                w = historia.top();
                historia.pop();
            }
        } else {
            long long x;
            cin >> x;
            historia.push(w);
            if (p == "+") w += x;
            else if (p == "-") w -= x;
            else w *= x;
        }
        cout << w << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-wieze-kilka-testow', krok: 2, level: 'latwe',
            title: 'Kilka wież naraz',
            short: 'Kilka testów w jednym wejściu: każdy buduje własną wieżę od zera. Stos zadeklarowany w pętli jest za każdym razem pusty, a wysokość liczysz na bieżąco.',
            tags: ['kilka testów', 'nowy stos dla testu', 'suma na bieżąco'],
            statement: ['W jednym wejściu jest t niezależnych testów. W każdym teście ktoś buduje wieżę z klocków, a dostajesz n liczb: liczba dodatnia x oznacza, że na górę wieży kładziemy klocek o wysokości x, a liczba 0 — że zdejmujemy klocek z samej góry (jeśli wieża jest pusta, 0 nic nie robi).',
                'Dla każdego testu wypisz wysokość wieży na końcu (sumę wysokości jej klocków) i wysokość klocka na samej górze. Każdy test zaczyna się od pustej wieży — stos z poprzedniego testu nie może przejść na następny. Wysokość licz na bieżąco: przy kładzeniu dodaj x, a przy zdejmowaniu odejmij top(), zanim zrobisz pop().'],
            input_format: ['W pierwszym wierszu liczba t.', 'Każdy test to wiersz z liczbą n i wiersz z n liczbami.'],
            output_format: ['t wierszy w formacie wysokosc: H, na gorze: X — gdzie X to wysokość górnego klocka albo słowo nic.'],
            constraints: ['1 ≤ t ≤ 100', '1 ≤ n ≤ 1000, a suma wszystkich n nie przekracza 20 000.', 'Każda liczba jest z przedziału od 0 do 1000.'],
            examples: [{ input: '2\n5\n3 7 0 2 4\n3\n5 0 0', note: 'Pierwsza wieża: 3, 7, zdjęte 7, potem 2 i 4 — razem 9, na górze 4. Druga zaczyna się od zera: 5, zdjęte 5, a drugie 0 trafia na pustą wieżę.' }],
            hint: R`while (t--) { int n; cin >> n; stack<int> s; long long wys = 0; … } — stos zadeklarowany wewnątrz pętli po testach jest dla każdego testu nowy. Przy zdejmowaniu: if (!s.empty()) { wys -= s.top(); s.pop(); }.`,
            tests: (r) => {
                const test = (n, p0) => { const a = Array.from({ length: n }, () => (r() < p0 ? 0 : r.int(1, 1000))); return `${n}\n${a.join(' ')}`; };
                const d = (ts) => `${ts.length}\n${ts.join('\n')}`;
                return [d(['1\n0']), d(['1\n5', '2\n0 0']), d(['3\n1 2 3', '3\n1 2 3']), d(Array.from({ length: 10 }, () => test(r.int(1, 30), 0.35))), d(Array.from({ length: 100 }, () => test(200, 0.4))), d([test(1000, 0.2), test(1000, 0.6), test(1000, 0.5)])];
            },
            check: (inp) => {
                const t = nums(inp); const T = t[0];
                if (!calk(T, 1, 100)) return 't';
                let i = 1, suma = 0;
                for (let k = 0; k < T; k++) { const n = t[i++]; if (!calk(n, 1, 1000)) return 'n'; suma += n; for (let j = 0; j < n; j++) if (!calk(t[i++], 0, 1000)) return 'x'; }
                return i === t.length && suma <= 20000 ? null : 'dane';
            },
            solve: (inp) => {
                const t = nums(inp); let i = 1; const o = [];
                for (let k = 0; k < t[0]; k++) {
                    const n = t[i++], st = []; let w = 0;
                    for (let j = 0; j < n; j++) { const x = t[i++]; if (x > 0) { st.push(x); w += x; } else if (st.length) w -= st.pop(); }
                    o.push(`wysokosc: ${w}, na gorze: ${st.length ? st[st.length - 1] : 'nic'}`);
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
        stack<int> s;
        long long wys = 0;
        for (int i = 0; i < n; i++) {
            int x;
            cin >> x;
            if (x > 0) {
                s.push(x);
                wys += x;
            } else if (!s.empty()) {
                wys -= s.top();
                s.pop();
            }
        }
        cout << "wysokosc: " << wys << ", na gorze: ";
        if (s.empty()) cout << "nic\n";
        else cout << s.top() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-wstecz-i-dalej', krok: 2, level: 'srednie',
            title: 'Wstecz i Dalej',
            short: 'Przeglądarka na dwóch stosach: Wstecz przekłada bieżącą stronę na stos Dalej. Nowy adres czyści stos Dalej.',
            tags: ['dwa stosy', 'czyszczenie stosu', 'stack<string>'],
            statement: ['Przeglądarka zaczyna na stronie start. Dostaje q poleceń: IDZ adres otwiera nową stronę, WSTECZ wraca do poprzedniej, a DALEJ ponownie otwiera stronę, z której przed chwilą się cofnęliśmy.',
                'Użyj dwóch stosów stack<string>. IDZ adres: bieżąca strona trafia na stos wstecz, nowa staje się bieżącą, a stos dalej trzeba wyczyścić (po otwarciu nowej strony nie da się już iść „dalej” po starych). WSTECZ: bieżąca strona trafia na stos dalej, a bieżącą staje się strona zdjęta ze stosu wstecz. DALEJ działa odwrotnie.',
                'Po każdym poleceniu wypisz bieżącą stronę. Jeśli WSTECZ albo DALEJ jest niemożliwe (odpowiedni stos jest pusty), wypisz nie mozna — wtedy nic się nie zmienia.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno polecenie: IDZ adres, WSTECZ albo DALEJ.'],
            output_format: ['q wierszy — bieżąca strona po każdym poleceniu albo nie mozna.'],
            constraints: ['1 ≤ q ≤ 1000', 'Adresy składają się z małych liter i kropek, mają od 3 do 20 znaków.'],
            examples: [{ input: '7\nIDZ kot.pl\nIDZ pies.pl\nWSTECZ\nWSTECZ\nWSTECZ\nDALEJ\nIDZ mysz.pl', note: 'Dwa razy wstecz prowadzi do start, trzeci raz się nie da. DALEJ wraca na kot.pl. IDZ mysz.pl czyści stos dalej — pies.pl jest już niedostępny.' }],
            hint: R`stack<string> wstecz, dalej; string teraz = "start";. IDZ: wstecz.push(teraz); teraz = adres; dalej = stack<string>();. WSTECZ: if (wstecz.empty()) { cout << "nie mozna\n"; continue; } dalej.push(teraz); teraz = wstecz.top(); wstecz.pop();. DALEJ — lustrzanie.`,
            tests: (r) => {
                const adr = () => `${r.pick(SLOWA.filter((w) => w.length >= 2))}.${r.pick(['pl', 'com', 'org', 'edu.pl'])}`;
                const gen = (q, pi) => {
                    const o = [];
                    for (let i = 0; i < q; i++) { const p = r(); o.push(p < pi ? `IDZ ${adr()}` : p < pi + (1 - pi) * 0.55 ? 'WSTECZ' : 'DALEJ'); }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nWSTECZ', '1\nDALEJ', '3\nIDZ a.pl\nWSTECZ\nDALEJ', '5\nIDZ a.pl\nIDZ b.pl\nWSTECZ\nIDZ c.pl\nDALEJ', gen(30, 0.4), gen(1000, 0.35), gen(1000, 0.15), gen(1000, 0.6)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 1000) || L.length !== q + 1) return 'liczba poleceń';
                return L.slice(1).every((l) => l === 'WSTECZ' || l === 'DALEJ' || /^IDZ [a-z.]{3,20}$/.test(l)) ? null : 'polecenie';
            },
            solve: (inp) => {
                const w = [], d = [], o = []; let teraz = 'start';
                for (const l of linie(inp).slice(1)) {
                    if (l.startsWith('IDZ')) { w.push(teraz); teraz = l.slice(4); d.length = 0; o.push(teraz); }
                    else if (l === 'WSTECZ') { if (!w.length) o.push('nie mozna'); else { d.push(teraz); teraz = w.pop(); o.push(teraz); } }
                    else if (!d.length) o.push('nie mozna'); else { w.push(teraz); teraz = d.pop(); o.push(teraz); }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    stack<string> wstecz, dalej;
    string teraz = "start";
    while (q--) {
        string p;
        cin >> p;
        if (p == "IDZ") {
            string adres;
            cin >> adres;
            wstecz.push(teraz);
            teraz = adres;
            dalej = stack<string>();
        } else if (p == "WSTECZ") {
            if (wstecz.empty()) {
                cout << "nie mozna\n";
                continue;
            }
            dalej.push(teraz);
            teraz = wstecz.top();
            wstecz.pop();
        } else {
            if (dalej.empty()) {
                cout << "nie mozna\n";
                continue;
            }
            wstecz.push(teraz);
            teraz = dalej.top();
            dalej.pop();
        }
        cout << teraz << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-stos-z-minimum', krok: 2, level: 'srednie',
            title: 'Stos z minimum',
            short: 'Na stosie stoją pary: liczba i najmniejsza liczba od dna aż do niej. Wtedy MIN to po prostu top().second — nawet po wielu POP.',
            tags: ['stack<pair<int, int>>', 'minimum zapamiętane w parze', 'jeden krok na polecenie'],
            statement: ['Stos liczb jest na początku pusty. Wykonaj q poleceń: PUSH x kładzie liczbę x na wierzch, POP zdejmuje liczbę z wierzchu, a MIN wypisuje najmniejszą liczbę, jaka jest teraz na stosie. Gdy POP albo MIN trafi na pusty stos, wypisz pusty (POP na niepustym stosie niczego nie wypisuje).',
                'Do stosu nie da się zajrzeć, więc nie przejrzysz go w poszukiwaniu minimum. Jedna zmienna z minimum też nie wystarczy: po zdjęciu najmniejszej liczby trzeba by wiedzieć, jakie minimum było wcześniej. Sztuczka: kładź na stos pary stack<pair<int, int>> — liczbę i najmniejszą liczbę od dna stosu aż do niej włącznie. Przy PUSH x to minimum wynosi min(x, minimum zapisane na dotychczasowym wierzchu). Wtedy odpowiedź na MIN zawsze stoi na wierzchu, także po każdym POP.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy jedno polecenie: PUSH x, POP albo MIN.'],
            output_format: ['Po jednym wierszu dla każdego MIN i dla każdego POP na pustym stosie.'],
            constraints: ['1 ≤ q ≤ 2500', 'Liczby x są z przedziału od −10⁶ do 10⁶.'],
            examples: [{ input: '8\nPUSH 5\nPUSH 2\nPUSH 7\nMIN\nPOP\nPOP\nMIN\nPOP', note: 'Na stosie są pary (5, 5), (2, 2), (7, 2). MIN to 2. Po zdjęciu 7 i 2 na wierzchu jest (5, 5), więc MIN to 5. Ostatnie POP zdejmuje 5 i niczego nie wypisuje.' }],
            hint: R`stack<pair<int, int>> s;. PUSH: int m = s.empty() ? x : min(x, s.top().second); s.push({x, m});. MIN: if (s.empty()) cout << "pusty\n"; else cout << s.top().second << "\n";. POP: if (s.empty()) cout << "pusty\n"; else s.pop();.`,
            tests: (r) => {
                const gen = (q, pp, lo, hi) => {
                    const o = [];
                    for (let i = 0; i < q; i++) { const p = r(); o.push(p < pp ? `PUSH ${r.int(lo, hi)}` : p < pp + (1 - pp) / 2 ? 'POP' : 'MIN'); }
                    return `${q}\n${o.join('\n')}`;
                };
                const malejace = Array.from({ length: 1250 }, (_, i) => `PUSH ${1250 - i}`).concat(Array.from({ length: 1250 }, (_, i) => (i % 2 ? 'POP' : 'MIN')));
                return ['1\nMIN', '2\nPOP\nMIN', '4\nPUSH 3\nPUSH 3\nPOP\nMIN', gen(40, 0.5, -9, 9), gen(2500, 0.55, -1000000, 1000000), gen(2500, 0.4, 1, 100), `2500\n${malejace.join('\n')}`];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 2500) || L.length !== q + 1) return 'liczba poleceń';
                return L.slice(1).every((l) => l === 'POP' || l === 'MIN' || (/^PUSH -?\d+$/.test(l) && calk(Number(l.slice(5)), -1e6, 1e6))) ? null : 'polecenie';
            },
            solve: (inp) => {
                const st = [], o = [];
                for (const l of linie(inp).slice(1)) {
                    if (l.startsWith('PUSH')) { const x = Number(l.slice(5)); st.push(st.length ? Math.min(x, st[st.length - 1]) : x); }
                    else if (l === 'POP') { if (!st.length) o.push('pusty'); else st.pop(); }
                    else o.push(st.length ? String(st[st.length - 1]) : 'pusty');
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    stack<pair<int, int>> s; // (liczba, minimum od dna aż do niej)
    while (q--) {
        string p;
        cin >> p;
        if (p == "PUSH") {
            int x;
            cin >> x;
            int m = s.empty() ? x : min(x, s.top().second);
            s.push({x, m});
        } else if (p == "POP") {
            if (s.empty()) cout << "pusty\n";
            else s.pop();
        } else {
            if (s.empty()) cout << "pusty\n";
            else cout << s.top().second << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'sto-magazyn-skrzynek', krok: 2, level: 'srednie',
            title: 'Skrzynka ze środka stosu',
            short: 'Żeby wyjąć skrzynkę ze środka, zdejmij te nad nią na drugi stos, weź ją i odłóż resztę z powrotem. Ile skrzynek trzeba było przenieść?',
            tags: ['pomocniczy stos', 'przekładanie i z powrotem', 'szukanie na stosie'],
            statement: ['W magazynie skrzynki stoją jedna na drugiej. Wykonaj q poleceń. POLOZ nazwa stawia skrzynkę z tą nazwą na samej górze. WYJMIJ nazwa wyjmuje skrzynkę o tej nazwie: magazynier zdejmuje po kolei skrzynki leżące nad nią i odkłada je na bok w drugi stos, wyjmuje szukaną skrzynkę, a potem odkłada tamte z powrotem — w tej samej kolejności co przedtem. Jeśli skrzynek o tej nazwie jest kilka, wyjmuje najwyższą.',
                'Dla każdego WYJMIJ wypisz, ile skrzynek trzeba było odłożyć na bok. Jeśli skrzynki o tej nazwie w ogóle nie ma, wypisz brak — magazynier przełożył wtedy wszystkie skrzynki na bok i musi je odłożyć z powrotem, więc stos wygląda tak samo jak przedtem. Na koniec wypisz nazwy skrzynek od góry do dołu.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z q kolejnych wierszy polecenie: POLOZ nazwa albo WYJMIJ nazwa.'],
            output_format: ['Po jednym wierszu dla każdego WYJMIJ (liczba albo brak), a na końcu wiersz zostalo: … z nazwami od góry (albo zostalo: nic).'],
            constraints: ['1 ≤ q ≤ 300', 'Nazwy mają od 1 do 15 małych liter.'],
            examples: [{ input: '6\nPOLOZ mleko\nPOLOZ ser\nPOLOZ chleb\nWYJMIJ ser\nWYJMIJ maslo\nWYJMIJ chleb', note: 'Nad serem leży tylko chleb — odkładamy 1 skrzynkę. Masła nie ma. Chleb leży na samej górze — nie trzeba niczego odkładać. Zostaje mleko.' }],
            hint: R`stack<string> pom; while (!s.empty() && s.top() != nazwa) { pom.push(s.top()); s.pop(); }. Jeśli s.empty() — brak, inaczej cout << pom.size() i s.pop(). Na koniec ZAWSZE oddaj skrzynki: while (!pom.empty()) { s.push(pom.top()); pom.pop(); } — przełożenie dwa razy przywraca kolejność.`,
            tests: (r) => {
                const PR = ['mleko', 'chleb', 'maslo', 'ser', 'jajka', 'cukier', 'sol', 'kawa', 'herbata', 'ryz'];
                const gen = (q, pp, nazwy) => {
                    const o = [];
                    for (let i = 0; i < q; i++) o.push(`${r() < pp ? 'POLOZ' : 'WYJMIJ'} ${r.pick(nazwy)}`);
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nWYJMIJ kot', '2\nPOLOZ kot\nWYJMIJ kot', '4\nPOLOZ a\nPOLOZ b\nPOLOZ a\nWYJMIJ a', gen(20, 0.6, PR.slice(0, 4)), gen(300, 0.65, PR), gen(300, 0.5, PR.slice(0, 3)), gen(300, 0.8, PR)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]);
                if (!calk(q, 1, 300) || L.length !== q + 1) return 'liczba poleceń';
                return L.slice(1).every((l) => /^(POLOZ|WYJMIJ) [a-z]{1,15}$/.test(l)) ? null : 'polecenie';
            },
            solve: (inp) => {
                const st = [], o = [];
                for (const l of linie(inp).slice(1)) {
                    const [p, n] = l.split(' ');
                    if (p === 'POLOZ') { st.push(n); continue; }
                    const i = st.lastIndexOf(n);
                    if (i < 0) o.push('brak'); else { o.push(String(st.length - 1 - i)); st.splice(i, 1); }
                }
                o.push('zostalo: ' + (st.length ? st.slice().reverse().join(' ') : 'nic'));
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    stack<string> s;
    while (q--) {
        string p, nazwa;
        cin >> p >> nazwa;
        if (p == "POLOZ") {
            s.push(nazwa);
            continue;
        }
        stack<string> pom;
        while (!s.empty() && s.top() != nazwa) {
            pom.push(s.top());
            s.pop();
        }
        if (s.empty()) {
            cout << "brak\n";
        } else {
            cout << pom.size() << "\n";
            s.pop();
        }
        while (!pom.empty()) {
            s.push(pom.top());
            pom.pop();
        }
    }
    cout << "zostalo:";
    if (s.empty()) cout << " nic";
    while (!s.empty()) {
        cout << " " << s.top();
        s.pop();
    }
    cout << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 3 · nawiasy
        {
            id: 'sto-nawiasy-okragle', krok: 3, level: 'latwe',
            title: 'Nawiasy okrągłe',
            short: 'Otwierający na stos, zamykający zdejmuje. Dwa sposoby na błąd: zamykający bez pary i otwierające, które zostały na końcu.',
            tags: ['otwierający → push', 'zamykający → pop', 'dwa rodzaje błędów'],
            statement: ['Dla każdego z t napisów złożonych z nawiasów ( i ) sprawdź, czy nawiasy są poprawnie sparowane: każdy nawias otwierający ma swój zamykający, który stoi po nim, a pary się nie przeplatają.',
                'Przechodź napis od lewej. Nawias otwierający połóż na stos. Nawias zamykający zamyka ostatni jeszcze niezamknięty nawias otwierający — czyli ten z wierzchu stosu — więc go zdejmij. Coś poszło nie tak, jeśli zamykający trafi na pusty stos albo jeśli po przejściu całego napisu na stosie coś zostało.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jeden napis z nawiasów ( i ).'],
            output_format: ['t wierszy: TAK, jeśli nawiasy są poprawne, albo NIE.'],
            constraints: ['1 ≤ t ≤ 100', 'Każdy napis ma od 1 do 10 000 znaków, a wszystkie razem — najwyżej 50 000.'],
            examples: [{ input: '5\n(()())\n())(\n(((\n()\n)(', note: 'W ())( trzeci nawias zamyka, gdy stos jest już pusty. W ((( nic się nie zamyka i na końcu na stosie zostają trzy nawiasy. )( zaczyna się od zamykającego bez pary.' }],
            hint: R`stack<char> st; bool ok = true; for (char c : s) { if (c == '(') st.push(c); else if (st.empty()) ok = false; else st.pop(); } if (!st.empty()) ok = false;. Dla jednego rodzaju nawiasów wystarczyłby licznik otwartych — stos przyda się w następnym zadaniu.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const duzo = [];
                for (let i = 0; i < 100; i++) { const n = r.int(1, 250); const s = losPoprawne(r, n, '()'); duzo.push(r() < 0.45 ? s : r() < 0.7 ? popsuj(r, s, '()') : losNawiasy(r, 2 * n, '()')); }
                return [d(['(']), d([')', '()', ')(']), d(['(()', '())', '(())()', '((()))', '()()()', '(()))(']), d(duzo), d([losPoprawne(r, 5000, '()', 0.5), popsuj(r, losPoprawne(r, 5000, '()', 0.6), '()'), '('.repeat(5000) + ')'.repeat(5000), ')' + '()'.repeat(4999) + '(']), d(Array.from({ length: 40 }, () => losPoprawne(r, r.int(1, 20), '()')))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 100) && t.length === n + 1 && t.slice(1).every((s) => /^[()]{1,10000}$/.test(s)) && t.slice(1).join('').length <= 50000 ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => (czyPoprawne(s) ? 'TAK' : 'NIE')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        stack<char> st;
        bool ok = true;
        for (char c : s) {
            if (c == '(') st.push(c);
            else if (st.empty()) ok = false;
            else st.pop();
        }
        if (!st.empty()) ok = false;
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-trzy-rodzaje-nawiasow', krok: 3, level: 'latwe',
            title: 'Trzy rodzaje nawiasów',
            short: 'Teraz trzeba pamiętać, jaki nawias otwierano. Zamykający musi pasować do wierzchu stosu — ([)] jest błędne, choć liczby się zgadzają.',
            tags: ['stack<char>', 'para do wierzchu', 'licznik nie wystarczy'],
            statement: ['Napisy składają się z nawiasów trzech rodzajów: ( ), [ ] i { }. Dla każdego z t napisów sprawdź, czy nawiasy są poprawne: każdy otwierający ma zamykający tego samego rodzaju, a pary się nie przeplatają — na przykład ([)] jest błędne, chociaż każdego rodzaju jest tyle samo otwierających co zamykających.',
                'Liczniki już nie wystarczą — trzeba pamiętać, jaki nawias otworzono. Otwierający kładź na stos stack<char>. Przy zamykającym sprawdź, czy stos nie jest pusty i czy na wierzchu leży otwierający tego samego rodzaju — dopiero wtedy go zdejmij. Na końcu stos musi być pusty.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jeden napis z nawiasów ()[]{}.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 100', 'Każdy napis ma od 1 do 10 000 znaków, a wszystkie razem — najwyżej 50 000.'],
            examples: [{ input: '5\n([]{()})\n([)]\n{[]}[\n}\n[[]](){}', note: 'W ([)] nawias ) trafia na wierzch [ — rodzaje się nie zgadzają. W {[]}[ ostatni [ zostaje na stosie.' }],
            hint: R`char para(char c) { if (c == ')') return '('; if (c == ']') return '['; return '{'; }. Zamykający: if (st.empty() || st.top() != para(c)) ok = false; else st.pop();. Na końcu if (!st.empty()) ok = false;.`,
            tests: (r) => {
                const RD = '()[]{}';
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const duzo = [];
                for (let i = 0; i < 100; i++) { const n = r.int(1, 250); const s = losPoprawne(r, n, RD); duzo.push(r() < 0.45 ? s : r() < 0.75 ? popsuj(r, s, RD) : losNawiasy(r, 2 * n, RD)); }
                return [d(['[']), d(['()', '[]', '{}', '(]', '[)', '{)']), d(['([)]', '{[()]}', '[(])', '((]]', '}{', '{}{}[]']), d(duzo), d([losPoprawne(r, 5000, RD), popsuj(r, losPoprawne(r, 5000, RD, 0.7), RD), '{'.repeat(5000) + '}'.repeat(4999) + ')']), d(Array.from({ length: 50 }, () => losPoprawne(r, r.int(1, 12), RD)))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 100) && t.length === n + 1 && t.slice(1).every((s) => /^[()[\]{}]{1,10000}$/.test(s)) && t.slice(1).join('').length <= 50000 ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => (czyPoprawne(s) ? 'TAK' : 'NIE')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
char para(char c) {
    if (c == ')') return '(';
    if (c == ']') return '[';
    return '{';
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        stack<char> st;
        bool ok = true;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
            } else {
                if (st.empty() || st.top() != para(c)) ok = false;
                else st.pop();
            }
        }
        if (!st.empty()) ok = false;
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-glebokosc-nawiasow', krok: 3, level: 'latwe',
            title: 'Głębokość nawiasów',
            short: 'Ile par nawiasów ma napis i jak głęboko są zagnieżdżone? Głębokość to największa liczba naraz otwartych nawiasów — czyli największy rozmiar stosu.',
            tags: ['rozmiar stosu', 'max po drodze', 'zagnieżdżenie'],
            statement: ['Każdy z t napisów to poprawny ciąg nawiasów trzech rodzajów: ( ), [ ] i { }. Dla każdego wypisz, ile ma par nawiasów i jaka jest jego głębokość.',
                'Głębokość to największa liczba nawiasów otwartych jednocześnie, czyli tych, które już się zaczęły, a jeszcze się nie skończyły. Na przykład ([]) ma głębokość 2, a ()[]{} — głębokość 1. Gdy kładziesz otwierające nawiasy na stos, głębokość to największy rozmiar, jaki stos osiągnie po drodze.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jeden poprawny napis z nawiasów ()[]{}.'],
            output_format: ['t wierszy w formacie pary: P, glebokosc: G.'],
            constraints: ['1 ≤ t ≤ 100', 'Każdy napis ma od 2 do 10 000 znaków, a wszystkie razem — najwyżej 50 000.', 'Wszystkie napisy są poprawne.'],
            examples: [{ input: '3\n([]{()})\n()[]{}\n{{{}}}', note: 'W ([]{()}) najgłębiej jest wewnątrz { ( ) } — naraz otwarte są (, { i (, czyli trzy nawiasy.' }],
            hint: R`Przy każdym push: glebokosc = max(glebokosc, (int)st.size());. Liczba par to s.size() / 2 — w poprawnym napisie każdy nawias ma parę. (Przy jednym rodzaju wystarczyłby licznik, ale stos od razu sprawdziłby też poprawność.)`,
            tests: (r) => {
                const RD = '()[]{}';
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['()']), d(['([])', '()[]{}', '{{{}}}', '[]([]){}']), d(Array.from({ length: 100 }, () => losPoprawne(r, r.int(1, 250), RD, r() * 0.8 + 0.1))), d([losPoprawne(r, 5000, RD, 0.5), '('.repeat(5000) + ')'.repeat(5000), '()'.repeat(5000)]), d(Array.from({ length: 30 }, () => losPoprawne(r, r.int(1, 15), RD, 0.7)))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 100) && t.length === n + 1 && t.slice(1).every((s) => /^[()[\]{}]{2,10000}$/.test(s) && czyPoprawne(s)) && t.slice(1).join('').length <= 50000 ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => { let g = 0, m = 0; for (const c of s) { if (czyOtw(c)) { g++; m = Math.max(m, g); } else g--; } return `pary: ${s.length / 2}, glebokosc: ${m}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        stack<char> st;
        int glebokosc = 0;
        for (char c : s) {
            if (c == '(' || c == '[' || c == '{') {
                st.push(c);
                glebokosc = max(glebokosc, (int)st.size());
            } else {
                st.pop();
            }
        }
        cout << "pary: " << s.size() / 2 << ", glebokosc: " << glebokosc << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-para-nawiasu', krok: 3, level: 'srednie',
            title: 'Gdzie jest para?',
            short: 'Na stos idą numery pozycji, a nie znaki. Zamykający zdejmuje numer swojego otwierającego — i od razu wiemy, gdzie jest para.',
            tags: ['stos indeksów', 'vector wyników', 'numeracja od 1'],
            statement: ['Dany jest poprawny ciąg nawiasów trzech rodzajów: ( ), [ ] i { }. Pozycje numerujemy od 1. Dla każdego nawiasu wypisz pozycję jego pary — nawiasu, który go zamyka albo otwiera.',
                'Tym razem na stos kładź nie znak nawiasu, tylko jego pozycję (stack<int>). Gdy trafisz na nawias zamykający, na wierzchu leży pozycja nawiasu, który on zamyka: zdejmij ją i zapisz parę w obie strony w vectorze wyników. Na końcu wypisz cały vector.'],
            input_format: ['Jeden wiersz: poprawny ciąg nawiasów ()[]{}.'],
            output_format: ['Jeden wiersz: dla każdej pozycji od 1 do n — pozycja pary, oddzielone spacjami.'],
            constraints: ['Ciąg ma od 2 do 4000 znaków i jest poprawny.'],
            examples: [{ input: '([]{})', note: 'Nawias z pozycji 1 zamyka ostatni, z pozycji 6. Para [ ] to pozycje 2 i 3, a para { } — 4 i 5.' }],
            hint: R`vector<int> para(n); stack<int> st; for (int i = 0; i < n; i++) { if (s[i] jest otwierający) st.push(i); else { int j = st.top(); st.pop(); para[i] = j; para[j] = i; } }. Wypisuj para[i] + 1 — pozycje w treści liczymy od 1.`,
            tests: (r) => ['()', '[]{}', '(([]))', '{()[()]}', losPoprawne(r, 2000, '()[]{}', 0.5), losPoprawne(r, 2000, '()[]{}', 0.85), '('.repeat(2000) + ')'.repeat(2000), losPoprawne(r, 30, '()[]{}', 0.6), '()'.repeat(2000)],
            check: (inp) => (/^[()[\]{}]{2,4000}$/.test(inp) && czyPoprawne(inp) ? null : 'dane'),
            solve: (inp) => { const st = [], p = new Array(inp.length); for (let i = 0; i < inp.length; i++) { if (czyOtw(inp[i])) st.push(i); else { const j = st.pop(); p[i] = j; p[j] = i; } } return p.map((x) => x + 1).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.size();
    vector<int> para(n);
    stack<int> st;
    for (int i = 0; i < n; i++) {
        if (s[i] == '(' || s[i] == '[' || s[i] == '{') {
            st.push(i);
        } else {
            int j = st.top();
            st.pop();
            para[i] = j;
            para[j] = i;
        }
    }
    for (int i = 0; i < n; i++) cout << para[i] + 1 << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-pierwszy-blad', krok: 3, level: 'srednie',
            title: 'Gdzie jest pierwszy błąd?',
            short: 'Jak w edytorze kodu: wskaż pozycję pierwszego zamykającego nawiasu bez pary, a gdy takiego nie ma — pierwszego niezamkniętego otwierającego.',
            tags: ['stos pozycji', 'inne znaki pomijamy', 'spód stosu'],
            statement: ['Edytor kodu podkreśla na czerwono pierwszy źle postawiony nawias. Dostajesz t wierszy kodu (bez spacji): są w nich litery, cyfry, znaki + - * / = ; , . oraz nawiasy ( ), [ ] i { }. Wszystkie znaki poza nawiasami pomijasz.',
                'Pozycje liczymy od 1. Jeśli nawiasy są poprawne, wypisz OK. W przeciwnym razie wypisz pozycję pierwszego zamykającego nawiasu, który nie ma pary (trafia na pusty stos albo na otwierający innego rodzaju). Jeśli takiego nie ma, a po przejściu wiersza zostały niezamknięte nawiasy, wypisz pozycję pierwszego z nich — tego, który leży na samym dnie stosu. Do stosu nie da się zajrzeć, więc żeby dostać się do dna, trzeba zdjąć wszystkie nawiasy nad nim.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jeden wiersz kodu bez spacji.'],
            output_format: ['t wierszy: OK albo pozycja błędu.'],
            constraints: ['1 ≤ t ≤ 100', 'Każdy wiersz ma od 1 do 5000 znaków, a wszystkie razem — najwyżej 50 000.'],
            examples: [{ input: '4\nf(a[i])=b;\nf(a[i)];\nx=(1+2*(3;\n}{', note: 'W f(a[i)]; nawias ) na pozycji 6 trafia na [ — błąd. W x=(1+2*(3; nic nie jest źle zamknięte, ale dwa nawiasy zostały otwarte — pierwszy z nich stoi na pozycji 3.' }],
            hint: R`stack<int> st; z pozycjami otwartych nawiasów. Przy zamykającym: if (st.empty() || s[st.top()] != para(c)) { blad = i + 1; break; } else st.pop();. Po pętli, jeśli nie było błędu, a st nie jest pusty: while (st.size() > 1) st.pop(); blad = st.top() + 1;.`,
            tests: (r) => {
                const RD = '()[]{}', INNE = 'abcdefghijklmnopqrstuvwxyz0123456789+-*/=;,.';
                const kod = (n) => { const s = losPoprawne(r, n, RD, 0.55); let o = ''; for (const c of s) { o += c; const k = r.int(0, 3); for (let j = 0; j < k; j++) o += r.pick(INNE.split('')); } return o; };
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const duzo = [];
                for (let i = 0; i < 100; i++) { const s = kod(r.int(1, 60)); duzo.push(r() < 0.3 ? s : popsuj(r, s, RD)); }
                return [d(['a']), d(['(', ')', 'x)', '(x']), d(['f(a[i])=b;', 'a[b(c)d]e{f}', '((((', '))', '([{}])x]', '{[(])}']), d(duzo), d([kod(700), popsuj(r, kod(700), RD), '(' + 'a'.repeat(4998) + ']', '[' + '('.repeat(2000) + ')'.repeat(2000)])];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 100) && t.length === n + 1 && t.slice(1).every((s) => /^[a-z0-9+\-*/=;,.()[\]{}]{1,5000}$/.test(s)) && t.slice(1).join('').length <= 50000 ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => {
                const st = [];
                for (let i = 0; i < s.length; i++) {
                    const c = s[i];
                    if (czyOtw(c)) st.push(i);
                    else if (czyZam(c)) { if (!st.length || s[st[st.length - 1]] !== paraDo(c)) return String(i + 1); st.pop(); }
                }
                return st.length ? String(st[0] + 1) : 'OK';
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
char para(char c) {
    if (c == ')') return '(';
    if (c == ']') return '[';
    return '{';
}
int main() {
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        stack<int> st; // pozycje otwartych nawiasów
        int blad = 0;
        for (int i = 0; i < (int)s.size(); i++) {
            char c = s[i];
            if (c == '(' || c == '[' || c == '{') {
                st.push(i);
            } else if (c == ')' || c == ']' || c == '}') {
                if (st.empty() || s[st.top()] != para(c)) {
                    blad = i + 1;
                    break;
                }
                st.pop();
            }
        }
        if (blad == 0 && !st.empty()) {
            while (st.size() > 1) st.pop();
            blad = st.top() + 1;
        }
        if (blad == 0) cout << "OK\n";
        else cout << blad << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-znikajace-pary', krok: 3, level: 'latwe',
            title: 'Znikające pary liter',
            short: 'Dwie takie same litery obok siebie znikają, a sąsiedzi się zsuwają. Stos robi to w jednym przejściu: litera równa wierzchowi zdejmuje go.',
            tags: ['string jako stos', 'porównanie z wierzchem', 'reakcja łańcuchowa'],
            statement: ['W słowie dwie sąsiednie jednakowe litery znikają, a litery z ich obu stron stają obok siebie — i mogą zniknąć w następnym kroku. Znikanie trwa, dopóki gdzieś obok siebie stoją dwie jednakowe litery. Na przykład abbaca: znika bb i powstaje aaca, potem znika aa i zostaje ca.',
                'Wypisz, co zostanie ze słowa. Zamiast wielokrotnie przeszukiwać słowo, użyj stosu liter (wygodnie: zwykłego string z push_back, back i pop_back). Przechodź słowo od lewej: jeśli litera jest taka sama jak ta na wierzchu stosu, obie znikają — zdejmij wierzch; w przeciwnym razie połóż literę na stos. Na końcu na stosie zostaje wynik (kolejność znikania nie ma znaczenia — zawsze zostaje to samo).'],
            input_format: ['Jeden wiersz: słowo z małych liter.'],
            output_format: ['Jeden wiersz: to, co zostało ze słowa, albo pusto.'],
            constraints: ['Słowo ma od 1 do 20 000 liter.'],
            examples: [{ input: 'abbaca', note: 'bb znika, potem stykają się dwa a i też znikają. Zostaje ca.' }, { input: 'xyzzyx', note: 'Reakcja łańcuchowa: zz, potem yy, potem xx — nic nie zostaje.' }],
            hint: R`string st; for (char c : s) { if (!st.empty() && st.back() == c) st.pop_back(); else st.push_back(c); }. Na końcu: if (st.empty()) cout << "pusto"; else cout << st;. Wielokrotne szukanie par w słowie byłoby dla 20 000 liter bardzo wolne.`,
            tests: (r) => {
                const wstawiaj = (baza, k, alf) => { const a = baza.split(''); for (let i = 0; i < k; i++) { const c = r.pick(alf.split('')); a.splice(r.int(0, a.length), 0, c, c); } return a.join(''); };
                const bez = (n) => { let s = ''; while (s.length < n) { const c = r.pick('abcdefgh'.split('')); if (!s.length || s[s.length - 1] !== c) s += c; } return s; };
                return ['a', 'aa', 'ab', 'abba', 'abbaca', 'aaa', wstawiaj('', 9999, 'ab'), wstawiaj(bez(20), 9990, 'abc'), r.word(20000, 'ab'), wstawiaj(bez(500), 4000, 'xyz'), r.word(300, 'abcd')];
            },
            check: (inp) => (/^[a-z]{1,20000}$/.test(inp) ? null : 'dane'),
            solve: (inp) => { const st = []; for (const c of inp) { if (st.length && st[st.length - 1] === c) st.pop(); else st.push(c); } return st.length ? st.join('') : 'pusto'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    string st;
    for (char c : s) {
        if (!st.empty() && st.back() == c) st.pop_back();
        else st.push_back(c);
    }
    if (st.empty()) cout << "pusto\n";
    else cout << st << "\n";
    return 0;
}`,
        },
        {
            id: 'sto-ile-dopisac', krok: 3, level: 'srednie',
            title: 'Ile nawiasów dopisać?',
            short: 'Zamykający, który trafia na pusty stos, potrzebuje dopisanego otwierającego. Otwierające, które zostały na końcu, potrzebują zamykających.',
            tags: ['nieparzyste nawiasy', 'stos albo licznik', 'dwa wyniki'],
            statement: ['Dla każdego z t napisów z nawiasów ( i ) policz, ile najmniej nawiasów trzeba dopisać (w dowolnych miejscach), żeby napis stał się poprawny. Podaj osobno, ile trzeba dopisać nawiasów otwierających, a ile zamykających.',
                'Przejdź napis jak przy sprawdzaniu: otwierający na stos, zamykający zdejmuje. Każdy zamykający, który trafia na pusty stos, nie ma pary — przed nim trzeba dopisać otwierający. Każdy otwierający, który na końcu został na stosie, potrzebuje dopisanego zamykającego.'],
            input_format: ['W pierwszym wierszu liczba t.', 'W każdym z t kolejnych wierszy jeden napis z nawiasów ( i ).'],
            output_format: ['t wierszy: dwie liczby — ile dopisać nawiasów otwierających i ile zamykających.'],
            constraints: ['1 ≤ t ≤ 100', 'Każdy napis ma od 1 do 10 000 znaków, a wszystkie razem — najwyżej 50 000.'],
            examples: [{ input: '4\n())(\n(((\n()\n)))((', note: 'W ())( trzeci nawias trafia na pusty stos, a ostatni zostaje niezamknięty — wystarczy dopisać ( na początku i ) na końcu: (())(). W ))) (( trzy zamykające są bez pary i dwa otwierające zostają na stosie.' }],
            hint: R`int otw = 0; // ile trzeba dopisać '('. for (char c : s) { if (c == '(') st.push(c); else if (st.empty()) otw++; else st.pop(); } cout << otw << " " << st.size();. Dopisanych nawiasów nie da się zaoszczędzić — każdy z policzonych nawiasów naprawdę nie ma pary.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                const duzo = [];
                for (let i = 0; i < 100; i++) { const n = r.int(1, 250); duzo.push(r() < 0.3 ? losPoprawne(r, n, '()') : r() < 0.6 ? popsuj(r, losPoprawne(r, n, '()'), '()') : losNawiasy(r, 2 * n, '()')); }
                return [d(['(']), d([')', '()', ')(']), d(['())(', '(((', ')))((', '((()))', ')()(']), d(duzo), d([losNawiasy(r, 10000, '()'), ')'.repeat(5000) + '('.repeat(5000), losPoprawne(r, 5000, '()')])];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 100) && t.length === n + 1 && t.slice(1).every((s) => /^[()]{1,10000}$/.test(s)) && t.slice(1).join('').length <= 50000 ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => { let st = 0, otw = 0; for (const c of s) { if (c === '(') st++; else if (!st) otw++; else st--; } return `${otw} ${st}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        string s;
        cin >> s;
        stack<char> st;
        int otw = 0; // ile trzeba dopisać nawiasów otwierających
        for (char c : s) {
            if (c == '(') st.push(c);
            else if (st.empty()) otw++;
            else st.pop();
        }
        cout << otw << " " << st.size() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'sto-najdluzszy-poprawny', krok: 3, level: 'trudne',
            title: 'Najdłuższy poprawny fragment',
            short: 'Na stosie leżą pozycje, a na samym dnie — strażnik: pozycja tuż przed początkiem fragmentu. Długość fragmentu kończącego się w i to i − top().',
            tags: ['stos indeksów', 'strażnik -1', 'liczenie najlepszych'],
            statement: ['Dany jest napis z nawiasów ( i ). Znajdź najdłuższy fragment (spójny kawałek napisu), który sam jest poprawnym ciągiem nawiasów, i policz, ile jest takich fragmentów tej długości. Jeśli żaden fragment nie jest poprawny, wypisz 0 0.',
                'Sztuczka ze strażnikiem: na stosie trzymaj pozycje, a na sam spód połóż na początku liczbę -1. Otwierający kładzie swoją pozycję. Zamykający zdejmuje wierzch; jeśli stos zrobił się pusty, ten zamykający nie ma pary — połóż jego pozycję jako nowego strażnika. W przeciwnym razie poprawny fragment kończący się na pozycji i zaczyna się tuż za pozycją z wierzchu, więc ma długość i − top(). Najdłuższy taki fragment kończący się w danym miejscu jest tylko jeden, więc wystarczy policzyć, ile razy wypadła najlepsza długość.'],
            input_format: ['Jeden wiersz: napis z nawiasów ( i ).'],
            output_format: ['Jeden wiersz: długość najdłuższego poprawnego fragmentu i liczba takich fragmentów (albo 0 0).'],
            constraints: ['Napis ma od 1 do 100 000 znaków.'],
            examples: [{ input: ')((())))(()())', note: 'Najdłuższe poprawne fragmenty to ((())) na pozycjach 2–7 i (()()) na pozycjach 9–14 — oba mają długość 6.' }, { input: '))((', note: 'Żaden fragment nie jest poprawny.' }],
            hint: R`stack<int> st; st.push(-1); for (int i = 0; i < n; i++) { if (s[i] == '(') st.push(i); else { st.pop(); if (st.empty()) st.push(i); else { int d = i - st.top(); if (d > naj) { naj = d; ile = 1; } else if (d == naj) ile++; } } }. Na starcie naj = 0 i ile = 0 — wtedy brak fragmentów da 0 0.`,
            tests: (r) => {
                const kawalki = (n) => { let s = ''; while (s.length < n) { s += r() < 0.3 ? r.pick(['(', ')', '))', '((']) : losPoprawne(r, r.int(1, 40), '()'); } return s.slice(0, n); };
                return ['(', ')', '()', ')(', '(()', '())', '()()', ')()())', '()(())', '((((', ')((())))(()())', kawalki(100000), r.word(100000, '()'), losPoprawne(r, 50000, '()'), '()'.repeat(25000) + ')' + '()'.repeat(24999), kawalki(500), '(' + '()'.repeat(49999) + '(', ')'.repeat(100000)];
            },
            check: (inp) => (/^[()]{1,100000}$/.test(inp) ? null : 'dane'),
            solve: (inp) => {
                const st = [-1]; let naj = 0, ile = 0;
                for (let i = 0; i < inp.length; i++) {
                    if (inp[i] === '(') st.push(i);
                    else { st.pop(); if (!st.length) st.push(i); else { const d = i - st[st.length - 1]; if (d > naj) { naj = d; ile = 1; } else if (d === naj) ile++; } }
                }
                return `${naj} ${ile}`;
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    int n = s.size();
    stack<int> st;
    st.push(-1); // strażnik: pozycja tuż przed początkiem fragmentu
    int naj = 0, ile = 0;
    for (int i = 0; i < n; i++) {
        if (s[i] == '(') {
            st.push(i);
        } else {
            st.pop();
            if (st.empty()) {
                st.push(i); // ten nawias nie ma pary — nowy strażnik
            } else {
                int d = i - st.top();
                if (d > naj) {
                    naj = d;
                    ile = 1;
                } else if (d == naj) {
                    ile++;
                }
            }
        }
    }
    cout << naj << " " << ile << "\n";
    return 0;
}`,
        },
    ];
};
