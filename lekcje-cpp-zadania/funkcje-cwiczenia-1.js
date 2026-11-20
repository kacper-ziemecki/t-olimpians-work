// Funkcje — ćwiczenia w trakcie lekcji, części 1–3: pierwsza funkcja (void bez parametrów, wywołanie, funkcja w pętli,
// funkcja wołająca funkcję, funkcja, która sama wczytuje dane), parametry (kilka parametrów różnych typów, kolejność
// argumentów, argument-wyrażenie, parametr jako kopia) oraz return (typ zwracany, wynik w wyrażeniu, f(g(x)), napis jako wynik).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./funkcje-pomoc');
    const { IMIONA, SLOWA, calk, czyLiczba, sumaCyfr, odwroc, naRzymskie } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const imie = (r) => r.pick(IMIONA);
    const czyImie = (s, max) => new RegExp(`^[A-Z][a-z]{0,${max - 1}}$`).test(s);
    const ZNAKI = '#*=+-o@%xX&$';

    return [
        // ================================================================ KROK 1 · pierwsza funkcja
        {
            id: 'fun-szlaczek', krok: 1, level: 'latwe',
            title: 'Szlaczek między liczbami',
            short: 'Nad pierwszą liczbą, między liczbami i pod ostatnią — szlaczek z tyld. Jedna funkcja void, wywołana n + 1 razy.',
            tags: ['void bez parametrów', 'wywołanie funkcji', 'funkcja w pętli'],
            statement: ['Ola zapisuje w zeszycie wyniki pomiarów. Każdy wynik oddziela od sąsiednich szlaczkiem z dziesięciu tyld: ~~~~~~~~~~. Szlaczek stoi też nad pierwszym wynikiem i pod ostatnim.',
                'Napisz funkcję void szlaczek(), która wypisuje jeden taki szlaczek, i wywołuj ją za każdym razem, gdy trzeba go narysować.'],
            input_format: ['W pierwszym wierszu n — liczba wyników.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['2n + 1 wierszy: szlaczek, pierwsza liczba, szlaczek, druga liczba, …, ostatnia liczba, szlaczek.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n12 -5 7', note: 'Trzy liczby, więc szlaczków jest cztery: na górze, dwa między liczbami i na dole.' }],
            hint: R`Nad main napisz: void szlaczek() { cout << "~~~~~~~~~~\n"; }. W main najpierw wywołaj szlaczek(); raz, a potem w pętli: wczytaj liczbę, wypisz ją i znowu wywołaj szlaczek();. Treść szlaczka jest w jednym miejscu — gdyby trzeba go było zmienić, poprawiasz jedną linijkę.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([0]), d([1, -1]), d(r.arr(10, -100, 100)), d(r.arr(1000, -1000000000, 1000000000)), d(r.arr(500, 0, 9))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp).slice(1); const s = '~~~~~~~~~~'; return [s, ...t.flatMap((x) => [x, s])].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void szlaczek() {
    cout << "~~~~~~~~~~\n";
}
int main() {
    int n;
    cin >> n;
    szlaczek();
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        cout << x << "\n";
        szlaczek();
    }
    return 0;
}`,
        },
        {
            id: 'fun-refren', krok: 1, level: 'latwe',
            title: 'Refren po każdej zwrotce',
            short: 'Piosenka: zwrotka, refren, zwrotka, refren… Refren to zawsze te same dwa wiersze — idealne na funkcję void refren().',
            tags: ['void bez parametrów', 'getline', 'ten sam kawałek wiele razy'],
            statement: ['Klasa układa piosenkę o programowaniu. Każda zwrotka ma jeden wiersz, a po każdej zwrotce śpiewa się ten sam refren — dokładnie te dwa wiersze:',
                'Raz, dwa, trzy - funkcja to jest to!',
                'Napisz raz, wywolaj sto!',
                'Wypisz całą piosenkę. Refren wypisuj funkcją void refren().'],
            input_format: ['W pierwszym wierszu n — liczba zwrotek.', 'W każdym z n kolejnych wierszy jedna zwrotka (litery, spacje, przecinki i kropki).'],
            output_format: ['3n wierszy: zwrotka, dwa wiersze refrenu, następna zwrotka, refren i tak dalej.'],
            constraints: ['1 ≤ n ≤ 150', 'Każda zwrotka ma od 1 do 60 znaków i nie zaczyna się ani nie kończy spacją.'],
            examples: [{ input: '2\nMamy main i mamy plan\nKazdy kod jest w funkcji sam', note: 'Po każdej z dwóch zwrotek stoją te same dwa wiersze refrenu.' }],
            hint: R`void refren() { cout << "Raz, dwa, trzy - funkcja to jest to!\n"; cout << "Napisz raz, wywolaj sto!\n"; }. Zwrotki mają spacje, więc czytaj je przez getline. Po cin >> n w wejściu zostaje enter — przed pierwszym getline wywołaj cin.ignore(); (albo czytaj getline(cin >> ws, zwrotka)).`,
            tests: (r) => {
                const zwr = () => { for (;;) { const s = P.zdanie(r, 2, 8).replace(/\.$/, r.pick(['', '.', ','])); if (s.length <= 60) return s; } };
                const d = (n) => `${n}\n${Array.from({ length: n }, zwr).join('\n')}`;
                return ['1\nLa', d(3), d(20), d(150), '2\nRaz, dwa, trzy\nRaz, dwa, trzy'];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 150) && L.length === n + 1 && L.slice(1).every((l) => /^[A-Za-z0-9,.](?:[A-Za-z0-9 ,.]{0,58}[A-Za-z0-9,.])?$/.test(l)) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).flatMap((l) => [l, 'Raz, dwa, trzy - funkcja to jest to!', 'Napisz raz, wywolaj sto!']).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void refren() {
    cout << "Raz, dwa, trzy - funkcja to jest to!\n";
    cout << "Napisz raz, wywolaj sto!\n";
}
int main() {
    int n;
    cin >> n;
    cin.ignore();
    for (int i = 0; i < n; i++) {
        string zwrotka;
        getline(cin, zwrotka);
        cout << zwrotka << "\n";
        refren();
    }
    return 0;
}`,
        },
        {
            id: 'fun-powitania', krok: 1, level: 'latwe',
            title: 'Witaj, gościu!',
            short: 'Funkcja sama wczytuje imię i wita gościa. main tylko liczy, ile razy ją wywołać.',
            tags: ['funkcja z cin w środku', 'void bez parametrów', 'wywołanie w pętli'],
            statement: ['Na bal przychodzi n gości. Przy wejściu każdy podaje imię, a automat wita go zdaniem Witaj, IMIE!',
                'Napisz funkcję void przywitaj(), która sama wczytuje jedno imię i wypisuje powitanie. W main wczytaj n i wywołaj przywitaj() n razy.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię gościa.'],
            output_format: ['n wierszy w formacie Witaj, IMIE! — w kolejności przychodzenia gości.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imię ma od 1 do 15 liter: pierwsza wielka, reszta małe.'],
            examples: [{ input: '3\nOla\nBartek\nZuzia', note: 'Każde wywołanie przywitaj() czyta jedno imię i od razu wita tego gościa.' }],
            hint: R`void przywitaj() { string imie; cin >> imie; cout << "Witaj, " << imie << "!\n"; }. Zmienna imie powstaje w funkcji przy każdym wywołaniu od nowa. W main: cin >> n; i pętla, w której jest tylko przywitaj();.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join('\n')}`;
                return [d(['A']), d(['Ola', 'Ola']), d(Array.from({ length: 8 }, () => imie(r))), d(Array.from({ length: 1000 }, () => imie(r))), d(['Maksymilianowie', 'Bo'])];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 1000) && t.length === n + 1 && t.slice(1).every((s) => czyImie(s, 15)) ? null : 'dane'; },
            solve: (inp) => toks(inp).slice(1).map((s) => `Witaj, ${s}!`).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void przywitaj() {
    string imie;
    cin >> imie;
    cout << "Witaj, " << imie << "!\n";
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) przywitaj();
    return 0;
}`,
        },
        {
            id: 'fun-kazda-para', krok: 1, level: 'latwe',
            title: 'Każda para osobno',
            short: 'Wiele par liczb, dla każdej: suma, różnica i iloczyn. Jedna para = jedno wywołanie funkcji, która sama ją wczytuje.',
            tags: ['jedno wywołanie na test', 'long long', 'funkcja z cin w środku'],
            statement: ['Kalkulator dostaje t par liczb całkowitych a i b. Dla każdej pary wypisuje sumę, różnicę a − b i iloczyn.',
                'Obsługę jednej pary (wczytanie i wypisanie) zamknij w funkcji void obsluzPare(). main ma tylko wczytać t i t razy wywołać tę funkcję. Uważaj na zakres: liczby są duże.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby a i b.'],
            output_format: ['t wierszy w formacie: suma S, roznica R, iloczyn I'],
            constraints: ['1 ≤ t ≤ 300', '−10⁹ ≤ a, b ≤ 10⁹'],
            examples: [{ input: '2\n5 3\n-4 10', note: '5 + 3 = 8, 5 − 3 = 2, 5 · 3 = 15. Dla drugiej pary: 6, −14 i −40.' }],
            hint: R`W obsluzPare() utwórz long long a, b; — przy a = b = 10⁹ już suma (2 · 10⁹) nie mieści się w int, a iloczyn (10¹⁸) tym bardziej. Wypisz: cout << "suma " << a + b << ", roznica " << a - b << ", iloczyn " << a * b << "\n";.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const los = (n, m) => Array.from({ length: n }, () => [r.int(-m, m), r.int(-m, m)]);
                return [d([[0, 0]]), d([[1000000000, 1000000000], [-1000000000, 1000000000], [-1000000000, -1000000000]]), d(los(10, 100)), d(los(300, 1000000000)), d(los(50, 46341))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 300) && t.length === 2 * t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp).slice(1).map(BigInt); const o = []; for (let i = 0; i < t.length; i += 2) { const [a, b] = [t[i], t[i + 1]]; o.push(`suma ${a + b}, roznica ${a - b}, iloczyn ${a * b}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void obsluzPare() {
    long long a, b;
    cin >> a >> b;
    cout << "suma " << a + b << ", roznica " << a - b << ", iloczyn " << a * b << "\n";
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) obsluzPare();
    return 0;
}`,
        },
        {
            id: 'fun-piktogramy', krok: 1, level: 'latwe',
            title: 'Piktogramy',
            short: 'Każda litera słowa to jeden obrazek: K — kwadrat, T — trójkąt, L — linia. Trzy funkcje void i if, która z nich.',
            tags: ['kilka funkcji void', 'wybór funkcji przez if', 'znak po znaku'],
            statement: ['Słowo z liter K, T i L opisuje rysunek. Każdej literze odpowiada jeden obrazek:',
                'K — kwadrat (3 wiersze): +--+, |  |, +--+',
                'T — trójkąt (3 wiersze): dwie spacje i *, spacja i ***, *****',
                'L — linia (1 wiersz): =====',
                'Wypisz obrazki kolejnych liter, oddzielając sąsiednie obrazki jednym pustym wierszem. Każdy obrazek rysuj osobną funkcją: void kwadrat(), void trojkat(), void linia().'],
            input_format: ['Jeden wiersz: słowo z liter K, T i L.'],
            output_format: ['Obrazki kolejnych liter, między sąsiednimi obrazkami pusty wiersz.'],
            constraints: ['Słowo ma od 1 do 100 liter.'],
            examples: [{ input: 'TLK', note: 'Najpierw trójkąt, pusty wiersz, linia, pusty wiersz, kwadrat.' }],
            hint: R`Trzy funkcje, każda z kilkoma cout, np. void trojkat() { cout << "  *\n"; cout << " ***\n"; cout << "*****\n"; }. W main przejdź po literach słowa: if (s[i] == 'K') kwadrat(); else if (s[i] == 'T') trojkat(); else linia(); — a przed każdym obrazkiem oprócz pierwszego wypisz pusty wiersz.`,
            tests: (r) => ['K', 'T', 'L', 'TLK', 'KKTTLL', Array.from({ length: 30 }, () => r.pick('KTL')).join(''), Array.from({ length: 100 }, () => r.pick('KTL')).join('')],
            check: (inp) => (/^[KTL]{1,100}$/.test(inp) ? null : 'słowo'),
            solve: (inp) => {
                const O = { K: ['+--+', '|  |', '+--+'], T: ['  *', ' ***', '*****'], L: ['====='] };
                return inp.split('').map((c) => O[c].join('\n')).join('\n\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void kwadrat() {
    cout << "+--+\n";
    cout << "|  |\n";
    cout << "+--+\n";
}
void trojkat() {
    cout << "  *\n";
    cout << " ***\n";
    cout << "*****\n";
}
void linia() {
    cout << "=====\n";
}
int main() {
    string s;
    cin >> s;
    for (int i = 0; i < (int)s.size(); i++) {
        if (i > 0) cout << "\n";
        if (s[i] == 'K') kwadrat();
        else if (s[i] == 'T') trojkat();
        else linia();
    }
    return 0;
}`,
        },
        {
            id: 'fun-tabela', krok: 1, level: 'latwe',
            title: 'Tabela z nagłówkiem',
            short: 'Tabela wyników w ramce. Funkcja linia() rysuje poziomą kreskę, a naglowek() sam ją wywołuje — funkcja woła funkcję.',
            tags: ['funkcja wołająca funkcję', 'setw i left', 'kolejność funkcji w pliku'],
            statement: ['Wypisz tabelę wyników klasowego konkursu. Tabela wygląda tak (szerokość jest zawsze ta sama):',
                '+------------+--------+',
                '| imie       | punkty |',
                '+------------+--------+',
                'Potem po jednym wierszu na ucznia: | , imię dosunięte do lewej na 10 znakach, | , punkty dosunięte do prawej na 6 znakach i | — na końcu znowu pozioma kreska.',
                'Poziomą kreskę rysuj funkcją void linia(), a nagłówek (kreska, napis, kreska) funkcją void naglowek(), która wywołuje linia().'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię i liczba punktów.'],
            output_format: ['Tabela: nagłówek (3 wiersze), n wierszy uczniów w kolejności z wejścia i pozioma kreska.'],
            constraints: ['1 ≤ n ≤ 500', 'Imię ma od 1 do 10 liter.', '0 ≤ punkty ≤ 999999'],
            examples: [{ input: '2\nOla 12\nBartek 7', note: '"Ola" uzupełniamy spacjami do 10 znaków, a 12 poprzedzamy czterema spacjami, żeby miało 6 znaków.' }],
            hint: R`void linia() { cout << "+------------+--------+\n"; } i void naglowek() { linia(); cout << "| imie       | punkty |\n"; linia(); } — naglowek musi stać pod linia, bo jej używa. Wiersz ucznia: cout << "| " << left << setw(10) << imie << " | " << right << setw(6) << p << " |\n";.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const los = (n) => Array.from({ length: n }, () => [imie(r).slice(0, 10), r.int(0, r.pick([100, 999999]))]);
                return [d([['A', 0]]), d([['Aleksander', 999999], ['Jo', 5]]), d(los(10)), d(los(500))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 500) && L.length === n + 1 && L.slice(1).every((l) => { const m = l.match(/^([A-Za-z]{1,10}) (\d{1,6})$/); return !!m; }) ? null : 'dane'; },
            solve: (inp) => {
                const k = '+------------+--------+';
                const w = linie(inp).slice(1).map((l) => { const [a, b] = l.split(' '); return `| ${h.padR(a, 10)} | ${h.padL(b, 6)} |`; });
                return [k, '| imie       | punkty |', k, ...w, k].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void linia() {
    cout << "+------------+--------+\n";
}
void naglowek() {
    linia();
    cout << "| imie       | punkty |\n";
    linia();
}
int main() {
    int n;
    cin >> n;
    naglowek();
    for (int i = 0; i < n; i++) {
        string imie;
        int p;
        cin >> imie >> p;
        cout << "| " << left << setw(10) << imie << " | " << right << setw(6) << p << " |\n";
    }
    linia();
    return 0;
}`,
        },
        {
            id: 'fun-choinki', krok: 1, level: 'latwe',
            title: 'Choinki z pięter',
            short: 'Każda choinka to kilka takich samych pięter i pień. Funkcja pietro() wywołana w pętli tyle razy, ile pięter.',
            tags: ['funkcja w pętli', 'dwie funkcje void', 'wiele rysunków'],
            statement: ['Choinka składa się z pięter i pnia. Każde piętro to te same trzy wiersze: dwie spacje i *, spacja i ***, *****. Pień to jeden wiersz: dwie spacje i #.',
                'Narysuj t choinek. Choinka nr i ma nᵢ pięter (od góry) i pień na dole. Między sąsiednimi choinkami zostaw pusty wiersz. Napisz funkcje void pietro() i void pien().'],
            input_format: ['W pierwszym wierszu t.', 'W drugim wierszu t liczb — liczby pięter kolejnych choinek.'],
            output_format: ['Kolejne choinki, oddzielone pustymi wierszami.'],
            constraints: ['1 ≤ t ≤ 20', '1 ≤ nᵢ ≤ 50', 'Suma wszystkich nᵢ nie przekracza 500.'],
            examples: [{ input: '2\n1 2', note: 'Pierwsza choinka: jedno piętro i pień. Druga: dwa piętra (6 wierszy z gwiazdkami) i pień.' }],
            hint: R`void pietro() { cout << "  *\n"; cout << " ***\n"; cout << "*****\n"; } i void pien() { cout << "  #\n"; }. Dla każdej choinki: pusty wiersz (jeśli to nie pierwsza), pętla for (int j = 0; j < n; j++) pietro(); i na końcu pien();.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([1]), d([3, 1]), d(r.arr(5, 1, 10)), d(r.arr(20, 1, 25)), d([50, 50, 50, 50, 50, 50, 50, 50, 50, 50])];
            },
            check: (inp) => { const t = nums(inp); const a = t.slice(1); return calk(t[0], 1, 20) && a.length === t[0] && a.every((x) => calk(x, 1, 50)) && a.reduce((s, x) => s + x, 0) <= 500 ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).map((n) => [...Array.from({ length: n }, () => '  *\n ***\n*****'), '  #'].join('\n')).join('\n\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void pietro() {
    cout << "  *\n";
    cout << " ***\n";
    cout << "*****\n";
}
void pien() {
    cout << "  #\n";
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        int n;
        cin >> n;
        if (i > 0) cout << "\n";
        for (int j = 0; j < n; j++) pietro();
        pien();
    }
    return 0;
}`,
        },
        {
            id: 'fun-kartkowki', krok: 1, level: 'latwe',
            title: 'Kartkówki z jednym kluczem',
            short: 'Każdy uczeń oddał 5 odpowiedzi, klucz jest zawsze ACBDA. Funkcja sprawdzKartkowke() wczytuje jedną kartkówkę i wystawia wynik.',
            tags: ['funkcja z cin w środku', 'zmienne lokalne funkcji', 'porównywanie znaków'],
            statement: ['Pani od historii zrobiła kartkówkę z pięcioma pytaniami testowymi. Poprawne odpowiedzi to zawsze kolejno: A, C, B, D, A (klucz ACBDA).',
                'Każdy uczeń oddał pięć liter. Napisz funkcję void sprawdzKartkowke(), która wczytuje imię i odpowiedzi jednego ucznia, liczy trafienia i wypisuje wynik w formacie IMIE: k/5. main wywołuje ją dla każdego ucznia.'],
            input_format: ['W pierwszym wierszu n — liczba uczniów.', 'W każdym z n kolejnych wierszy imię i napis z 5 liter (każda to A, B, C albo D).'],
            output_format: ['n wierszy w formacie IMIE: k/5 — w kolejności z wejścia.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imię ma od 1 do 15 liter.'],
            examples: [{ input: '3\nOla ACBDA\nKuba ABCDA\nEla DDDDD', note: 'Ola ma wszystko dobrze. Kuba pomylił drugą i trzecią odpowiedź — 3 trafienia. Ela trafiła tylko czwartą odpowiedź (D).' }],
            hint: R`W funkcji: string imie, odp; cin >> imie >> odp; string klucz = "ACBDA"; int k = 0; for (int i = 0; i < 5; i++) if (odp[i] == klucz[i]) k++; i wypisanie. Zmienne imie, odp, klucz i k są lokalne — przy każdym wywołaniu powstają od nowa, więc k zawsze startuje od zera.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const odp = () => Array.from({ length: 5 }, () => r.pick('ABCD')).join('');
                return [d([['Ala', 'ACBDA']]), d([['Jan', 'BDACB'], ['Ewa', 'ACBDB']]), d(Array.from({ length: 12 }, () => [imie(r), odp()])), d(Array.from({ length: 1000 }, () => [imie(r), r() < 0.3 ? 'ACBDA' : odp()]))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 1000) && L.length === n + 1 && L.slice(1).every((l) => /^[A-Za-z]{1,15} [ABCD]{5}$/.test(l)) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [a, o] = l.split(' '); let k = 0; for (let i = 0; i < 5; i++) if (o[i] === 'ACBDA'[i]) k++; return `${a}: ${k}/5`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void sprawdzKartkowke() {
    string imie, odp;
    cin >> imie >> odp;
    string klucz = "ACBDA";
    int k = 0;
    for (int i = 0; i < 5; i++)
        if (odp[i] == klucz[i]) k++;
    cout << imie << ": " << k << "/5\n";
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) sprawdzKartkowke();
    return 0;
}`,
        },

        // ================================================================ KROK 2 · parametry
        {
            id: 'fun-flaga', krok: 2, level: 'latwe',
            title: 'Flaga z pasków',
            short: 'Flaga to poziome pasy różnej wysokości i z różnych znaków. linia(w, c) rysuje jeden wiersz, a pas(w, h, c) woła ją h razy.',
            tags: ['parametry int i char', 'funkcja woła funkcję', 'argumenty z wejścia'],
            statement: ['Projektant flag opisuje flagę jako k poziomych pasów. Każdy pas ma wysokość h (w wierszach) i jest zrobiony ze znaku c. Wszystkie pasy mają tę samą szerokość w.',
                'Narysuj flagę od górnego pasa. Napisz funkcję void linia(int w, char c), która wypisuje w znaków c i enter, oraz void pas(int w, int h, char c), która wywołuje linia(w, c) h razy.'],
            input_format: ['W pierwszym wierszu w i k.', 'W każdym z k kolejnych wierszy wysokość pasa h i znak c.'],
            output_format: ['Flaga: kolejne pasy, bez pustych wierszy między nimi.'],
            constraints: ['1 ≤ w ≤ 60, 1 ≤ k ≤ 20', '1 ≤ h ≤ 10, a suma wysokości wszystkich pasów nie przekracza 100.', 'c to jeden ze znaków # * = + - o @ % x X & $'],
            examples: [{ input: '6 3\n1 =\n2 #\n1 =', note: 'Trzy pasy: jeden wiersz ze znaków =, dwa wiersze ze znaków #, jeden wiersz ze znaków =. Każdy wiersz ma 6 znaków.' }],
            hint: R`void linia(int w, char c) { for (int i = 0; i < w; i++) cout << c; cout << "\n"; } i void pas(int w, int h, char c) { for (int i = 0; i < h; i++) linia(w, c); }. W main dla każdego pasa: cin >> h >> c; pas(w, h, c);. Kolejność argumentów musi się zgadzać z kolejnością parametrów.`,
            tests: (r) => {
                const d = (w, a) => `${w} ${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const los = (w, k) => Array.from({ length: k }, () => [r.int(1, 5), r.pick(ZNAKI)]);
                return [d(1, [[1, '#']]), d(60, [[10, '='], [10, '*']]), d(r.int(5, 20), los(0, 6)), d(60, Array.from({ length: 20 }, () => [5, r.pick(ZNAKI)])), d(13, los(0, 20))];
            },
            check: (inp) => {
                const L = linie(inp); const [w, k] = L[0].split(' ').map(Number); if (!calk(w, 1, 60) || !calk(k, 1, 20) || L.length !== k + 1) return 'w k';
                let s = 0; for (const l of L.slice(1)) { const m = l.match(/^(\d+) (\S)$/); if (!m || !calk(Number(m[1]), 1, 10) || !ZNAKI.includes(m[2])) return 'pas'; s += Number(m[1]); }
                return s <= 100 ? null : 'suma';
            },
            solve: (inp) => { const L = linie(inp); const w = Number(L[0].split(' ')[0]); return L.slice(1).flatMap((l) => { const [hh, c] = l.split(' '); return Array.from({ length: Number(hh) }, () => c.repeat(w)); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void linia(int w, char c) {
    for (int i = 0; i < w; i++) cout << c;
    cout << "\n";
}
void pas(int w, int h, char c) {
    for (int i = 0; i < h; i++) linia(w, c);
}
int main() {
    int w, k;
    cin >> w >> k;
    for (int i = 0; i < k; i++) {
        int h;
        char c;
        cin >> h >> c;
        pas(w, h, c);
    }
    return 0;
}`,
        },
        {
            id: 'fun-ramki', krok: 2, level: 'latwe',
            title: 'Ramki na zdjęcia',
            short: 'Puste w środku prostokąty o zadanych wymiarach i znaku. Jedna funkcja ramka(w, h, c), wywołana dla każdego zdjęcia.',
            tags: ['trzy parametry', 'pusty prostokąt', 'wiele wywołań'],
            statement: ['Fotograf zamawia ramki do t zdjęć. Ramka o szerokości w i wysokości h ze znaku c to prostokąt, w którym znak c stoi tylko na brzegach, a w środku są spacje.',
                'Narysuj wszystkie ramki, oddzielając je pustym wierszem. Napisz funkcję void ramka(int w, int h, char c).'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczby w, h i znak c.'],
            output_format: ['Kolejne ramki (każda ma h wierszy po w znaków), oddzielone pustym wierszem.'],
            constraints: ['1 ≤ t ≤ 20', '2 ≤ w ≤ 40, 2 ≤ h ≤ 20', 'c to jeden ze znaków # * = + - o @ % x X & $'],
            examples: [{ input: '2\n5 3 #\n2 2 *', note: 'Pierwsza ramka: wiersz #####, wiersz # (trzy spacje) # i znowu #####. Druga ramka 2 × 2 to same gwiazdki.' }],
            hint: R`Pierwszy i ostatni wiersz to w znaków c. Każdy środkowy wiersz (jest ich h − 2): znak c, w − 2 spacji i znowu c. W funkcji przydadzą się dwie pętle — jedna na wiersze, druga na znaki w wierszu. Parametry w, h i c są zwykłymi zmiennymi, których wartości przyszły z wywołania.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                return [d([[2, 2, '#']]), d([[40, 20, '*'], [2, 20, 'o'], [40, 2, '=']]), d(Array.from({ length: 6 }, () => [r.int(2, 12), r.int(2, 8), r.pick(ZNAKI)])), d(Array.from({ length: 20 }, () => [r.int(2, 40), r.int(2, 20), r.pick(ZNAKI)]))];
            },
            check: (inp) => { const L = linie(inp); const t = Number(L[0]); return calk(t, 1, 20) && L.length === t + 1 && L.slice(1).every((l) => { const m = l.match(/^(\d+) (\d+) (\S)$/); return m && calk(Number(m[1]), 2, 40) && calk(Number(m[2]), 2, 20) && ZNAKI.includes(m[3]); }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [w, hh, c] = l.split(' '); const W = Number(w), H = Number(hh); return Array.from({ length: H }, (_, i) => (i === 0 || i === H - 1 ? c.repeat(W) : c + ' '.repeat(W - 2) + c)).join('\n'); }).join('\n\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void ramka(int w, int h, char c) {
    for (int i = 0; i < h; i++) {
        for (int j = 0; j < w; j++) {
            if (i == 0 || i == h - 1 || j == 0 || j == w - 1) cout << c;
            else cout << ' ';
        }
        cout << "\n";
    }
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        int w, h;
        char c;
        cin >> w >> h >> c;
        if (i > 0) cout << "\n";
        ramka(w, h, c);
    }
    return 0;
}`,
        },
        {
            id: 'fun-dwa-znaki', krok: 2, level: 'latwe',
            title: 'Wzór z dwóch znaków',
            short: 'Wiersze z na zmianę dwóch znaków, a każdy następny wiersz zaczyna od drugiego. Ta sama funkcja, argumenty zamienione miejscami.',
            tags: ['kolejność argumentów', 'parametry char', 'wzór naprzemienny'],
            statement: ['Wzór ma n wierszy i m kolumn. W każdym wierszu znaki a i b stoją na zmianę. Wiersze o numerach 1, 3, 5, … (licząc od 1) zaczynają się od a, a wiersze 2, 4, 6, … — od b.',
                'Napisz funkcję void wiersz(int m, char x, char y), która wypisuje m znaków na zmianę: x, y, x, y, … W main wywołuj ją raz jako wiersz(m, a, b), a raz jako wiersz(m, b, a). Narysuj q takich wzorów, oddzielonych pustym wierszem.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy: n, m oraz dwa różne znaki a i b.'],
            output_format: ['Kolejne wzory (po n wierszy), oddzielone pustym wierszem.'],
            constraints: ['1 ≤ q ≤ 5', '1 ≤ n, m ≤ 50', 'a i b to różne znaki spośród # * = + - o @ % x X & $'],
            examples: [{ input: '1\n3 5 # o', note:'Wiersz 1 i 3 zaczynają się od #, wiersz 2 — od o.' }],
            hint: R`W funkcji: for (int i = 0; i < m; i++) { if (i % 2 == 0) cout << x; else cout << y; } i enter. W main dla wiersza i (od 0): if (i % 2 == 0) wiersz(m, a, b); else wiersz(m, b, a);. Funkcja się nie zmienia — zmieniasz tylko kolejność argumentów, a parametry x i y dostają je po kolei.`,
            tests: (r) => {
                const para = () => { const a = r.pick(ZNAKI); let b; do b = r.pick(ZNAKI); while (b === a); return [a, b]; };
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                return [d([[1, 1, '#', '*']]), d([[2, 1, 'x', 'o'], [1, 2, 'x', 'o']]), d(Array.from({ length: 3 }, () => [r.int(1, 10), r.int(1, 10), ...para()])), d(Array.from({ length: 5 }, () => [50, 50, ...para()]))];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); return calk(q, 1, 5) && L.length === q + 1 && L.slice(1).every((l) => { const m = l.match(/^(\d+) (\d+) (\S) (\S)$/); return m && calk(Number(m[1]), 1, 50) && calk(Number(m[2]), 1, 50) && ZNAKI.includes(m[3]) && ZNAKI.includes(m[4]) && m[3] !== m[4]; }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [n, m, a, b] = l.split(' '); const w = (x, y) => Array.from({ length: Number(m) }, (_, i) => (i % 2 ? y : x)).join(''); return Array.from({ length: Number(n) }, (_, i) => (i % 2 ? w(b, a) : w(a, b))).join('\n'); }).join('\n\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void wiersz(int m, char x, char y) {
    for (int i = 0; i < m; i++) {
        if (i % 2 == 0) cout << x;
        else cout << y;
    }
    cout << "\n";
}
int main() {
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int n, m;
        char a, b;
        cin >> n >> m >> a >> b;
        if (k > 0) cout << "\n";
        for (int i = 0; i < n; i++) {
            if (i % 2 == 0) wiersz(m, a, b);
            else wiersz(m, b, a);
        }
    }
    return 0;
}`,
        },
        {
            id: 'fun-starty', krok: 2, level: 'latwe',
            title: 'Starty rakiet',
            short: 'Każda rakieta ma nazwę i czas odliczania. start(nazwa, t) odlicza w dół — zmienia swój parametr, a w main nic się nie psuje.',
            tags: ['parametry string i int', 'parametr to kopia', 'pętla while w funkcji'],
            statement: ['Z kosmodromu startuje n rakiet. Przed startem każda odlicza: najpierw jej nazwa i dwukropek, potem liczby od t w dół do 1, a na końcu słowo START!',
                'Napisz funkcję void start(string nazwa, int t), która wypisuje jeden taki wiersz. Odliczaj w pętli while (t > 0), zmniejszając sam parametr t.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nazwa rakiety i liczba t.'],
            output_format: ['n wierszy w formacie: NAZWA: t t−1 … 1 START!'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ t ≤ 30', 'Nazwa ma od 1 do 12 znaków (wielkie litery i cyfry).'],
            examples: [{ input: '2\nAPOLLO 3\nX1 1', note: 'APOLLO odlicza 3 2 1, rakieta X1 tylko 1.' }],
            hint: R`void start(string nazwa, int t) { cout << nazwa << ":"; while (t > 0) { cout << " " << t; t--; } cout << " START!\n"; }. Parametr t to kopia liczby z main — możesz go spokojnie zmniejszać. Zmienna w main zostanie taka, jaka była.`,
            tests: (r) => {
                const nazwa = () => r.word(r.int(1, 8), 'ABCDEFGHIJKLMNOPRSTUWZ') + (r() < 0.5 ? r.word(r.int(1, 4), '0123456789') : '');
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                return [d([['A', 1]]), d([['SOJUZ', 30], ['B2', 2]]), d(Array.from({ length: 10 }, () => [nazwa(), r.int(1, 10)])), d(Array.from({ length: 100 }, () => [nazwa(), r.int(1, 30)]))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 100) && L.length === n + 1 && L.slice(1).every((l) => { const m = l.match(/^([A-Z0-9]{1,12}) (\d+)$/); return m && calk(Number(m[2]), 1, 30); }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [a, t] = l.split(' '); return `${a}: ${Array.from({ length: Number(t) }, (_, i) => Number(t) - i).join(' ')} START!`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void start(string nazwa, int t) {
    cout << nazwa << ":";
    while (t > 0) {
        cout << " " << t;
        t--;
    }
    cout << " START!\n";
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string nazwa;
        int t;
        cin >> nazwa >> t;
        start(nazwa, t);
    }
    return 0;
}`,
        },
        {
            id: 'fun-etykiety', krok: 2, level: 'latwe',
            title: 'Etykiety na słoikach',
            short: 'Babcia podpisuje słoiki: nazwa i rok w ramce z wybranego znaku. Trzy parametry trzech różnych typów.',
            tags: ['parametry string, int i char', 'szerokość z danych', 'setw i left'],
            statement: ['Babcia robi przetwory i na każdym słoiku nakleja etykietę: nazwę przetworu i rok, w ramce ze znaku c. Szerokość W wnętrza to długość nazwy, ale co najmniej 4 (rok ma 4 cyfry).',
                'Etykieta ma 4 wiersze: W + 4 znaków c; znak c, spacja, nazwa dopełniona spacjami do W znaków, spacja i c; tak samo dla roku; i znowu W + 4 znaków c.',
                'Napisz funkcję void etykieta(string nazwa, int rok, char c). Etykiety oddzielaj pustym wierszem.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy: nazwa, rok i znak c.'],
            output_format: ['n etykiet po 4 wiersze, oddzielonych pustym wierszem.'],
            constraints: ['1 ≤ n ≤ 50', 'Nazwa ma od 1 do 20 małych liter.', '1900 ≤ rok ≤ 2100', 'c to jeden ze znaków # * = + - o @ % x X & $'],
            examples: [{ input: '2\nmiod 2024 #\nag 2023 *', note: 'Obie nazwy mają co najwyżej 4 litery, więc W = 4 i ramka ma 8 znaków szerokości. "ag" dopełniamy dwiema spacjami.' }],
            hint: R`W funkcji: int W = max((int)nazwa.size(), 4);. Kreska: for z W + 4 obrotami. Wiersz z nazwą: cout << c << " " << left << setw(W) << nazwa << " " << c << "\n"; — tak samo z rokiem. setw działa też dla liczb.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = () => [r.word(r.int(1, 20)), r.int(1900, 2100), r.pick(ZNAKI)];
                return [d([['a', 1900, '#']]), d([['konfiturazwisniami', 2100, '@'], ['dzem', 2000, 'o'], ['ogorki', 1999, '=']]), d(Array.from({ length: 8 }, los)), d(Array.from({ length: 50 }, los))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 50) && L.length === n + 1 && L.slice(1).every((l) => { const m = l.match(/^([a-z]{1,20}) (\d{4}) (\S)$/); return m && calk(Number(m[2]), 1900, 2100) && ZNAKI.includes(m[3]); }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [a, rok, c] = l.split(' '); const W = Math.max(a.length, 4); const k = c.repeat(W + 4); return [k, `${c} ${h.padR(a, W)} ${c}`, `${c} ${h.padR(rok, W)} ${c}`, k].join('\n'); }).join('\n\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void etykieta(string nazwa, int rok, char c) {
    int W = max((int)nazwa.size(), 4);
    for (int i = 0; i < W + 4; i++) cout << c;
    cout << "\n";
    cout << c << " " << left << setw(W) << nazwa << " " << c << "\n";
    cout << c << " " << left << setw(W) << rok << " " << c << "\n";
    for (int i = 0; i < W + 4; i++) cout << c;
    cout << "\n";
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string nazwa;
        int rok;
        char c;
        cin >> nazwa >> rok >> c;
        if (i > 0) cout << "\n";
        etykieta(nazwa, rok, c);
    }
    return 0;
}`,
        },
        {
            id: 'fun-paski-postepu', krok: 2, level: 'latwe',
            title: 'Paski postępu',
            short: 'Zadanie i procent ukończenia, a funkcja rysuje pasek [####......]. Liczba krzyżyków liczona z parametru.',
            tags: ['parametry string i int', 'obliczenia w funkcji', 'formatowanie'],
            statement: ['Program do nauki pokazuje postęp w każdym dziale jako pasek z 10 pól. Pełnych pól (#) jest tyle, ile pełnych dziesiątek procent: przy 47% są 4 krzyżyki, a reszta pól to kropki.',
                'Napisz funkcję void pasek(string nazwa, int procent), która wypisuje wiersz: nazwa, spacja, [, krzyżyki, kropki, ], spacja i procent ze znakiem %.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nazwa działu i procent.'],
            output_format: ['n wierszy z paskami, w kolejności z wejścia.'],
            constraints: ['1 ≤ n ≤ 500', '0 ≤ procent ≤ 100', 'Nazwa ma od 1 do 15 małych liter.'],
            examples: [{ input: '3\npetle 47\nfunkcje 100\nmapy 9', note: '47 / 10 = 4 krzyżyki i 6 kropek; 100% to 10 krzyżyków; przy 9% nie ma jeszcze żadnego.' }],
            hint: R`W funkcji: int pelne = procent / 10; — dzielenie całkowite obcina resztę. Potem for (int i = 0; i < pelne; i++) cout << '#'; i for (int i = pelne; i < 10; i++) cout << '.';. Całość: cout << nazwa << " ["; … cout << "] " << procent << "%\n";.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                return [d([['a', 0]]), d([['x', 9], ['y', 10], ['z', 99], ['w', 100]]), d(Array.from({ length: 11 }, (_, i) => [r.word(r.int(3, 9)), i * 10])), d(Array.from({ length: 500 }, () => [r.word(r.int(1, 15)), r.int(0, 100)]))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 500) && L.length === n + 1 && L.slice(1).every((l) => { const m = l.match(/^([a-z]{1,15}) (\d{1,3})$/); return m && calk(Number(m[2]), 0, 100); }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => { const [a, p] = l.split(' '); const k = Math.floor(Number(p) / 10); return `${a} [${'#'.repeat(k)}${'.'.repeat(10 - k)}] ${p}%`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void pasek(string nazwa, int procent) {
    int pelne = procent / 10;
    cout << nazwa << " [";
    for (int i = 0; i < pelne; i++) cout << '#';
    for (int i = pelne; i < 10; i++) cout << '.';
    cout << "] " << procent << "%\n";
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string nazwa;
        int p;
        cin >> nazwa >> p;
        pasek(nazwa, p);
    }
    return 0;
}`,
        },
        {
            id: 'fun-mur', krok: 2, level: 'latwe',
            title: 'Mur z cegieł',
            short: 'Rzędy cegieł [__], co drugi przesunięty o dwie spacje. Funkcja rzad(k, przesuniety) z parametrem bool — argumentem jest wyrażenie i % 2 == 1.',
            tags: ['parametr bool', 'argument-wyrażenie', 'wiele rysunków'],
            statement: ['Murarz układa mur z n rzędów po k cegieł. Cegła to cztery znaki [__]. Rzędy liczymy od góry od 0: rzędy parzyste zaczynają się od razu od cegły, a nieparzyste są przesunięte o dwie spacje w prawo.',
                'Napisz funkcję void rzad(int k, bool przesuniety). W main wywołuj ją jako rzad(k, i % 2 == 1) — wartość warunku sama trafi do parametru. Narysuj t murów, oddzielonych pustym wierszem.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy n i k.'],
            output_format: ['Kolejne mury po n wierszy, oddzielone pustym wierszem.'],
            constraints: ['1 ≤ t ≤ 10', '1 ≤ n ≤ 30, 1 ≤ k ≤ 15'],
            examples: [{ input: '1\n3 2', note: 'Rząd 0: [__][__]. Rząd 1 (nieparzysty): dwie spacje i [__][__]. Rząd 2: znowu bez przesunięcia.' }],
            hint: R`void rzad(int k, bool przesuniety) { if (przesuniety) cout << "  "; for (int i = 0; i < k; i++) cout << "[__]"; cout << "\n"; }. Wyrażenie i % 2 == 1 ma wartość true albo false — dokładnie taką, jakiej oczekuje parametr bool.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                return [d([[1, 1]]), d([[2, 1], [1, 15]]), d(Array.from({ length: 4 }, () => [r.int(1, 8), r.int(1, 8)])), d(Array.from({ length: 10 }, () => [r.int(20, 30), r.int(10, 15)]))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 10) && t.length === 2 * t[0] + 1 && t.slice(1).every((x, i) => calk(x, 1, i % 2 ? 15 : 30)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const o = []; for (let i = 1; i < t.length; i += 2) o.push(Array.from({ length: t[i] }, (_, j) => (j % 2 ? '  ' : '') + '[__]'.repeat(t[i + 1])).join('\n')); return o.join('\n\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void rzad(int k, bool przesuniety) {
    if (przesuniety) cout << "  ";
    for (int i = 0; i < k; i++) cout << "[__]";
    cout << "\n";
}
int main() {
    int t;
    cin >> t;
    for (int j = 0; j < t; j++) {
        int n, k;
        cin >> n >> k;
        if (j > 0) cout << "\n";
        for (int i = 0; i < n; i++) rzad(k, i % 2 == 1);
    }
    return 0;
}`,
        },
        {
            id: 'fun-ramka-napisu', krok: 2, level: 'srednie',
            title: 'Napis w ramce z marginesem',
            short: 'Słowo w ramce ze znaku c, z marginesem m dookoła. Szerokość i wysokość ramki trzeba policzyć z parametrów.',
            tags: ['trzy parametry', 'wymiary z parametrów', 'wiersze z marginesem'],
            statement: ['Słowo s trzeba otoczyć ramką ze znaku c, zostawiając margines z m spacji z lewej i z prawej oraz m pustych (wypełnionych spacjami) wierszy nad słowem i pod nim.',
                'Ramka ma szerokość W = długość słowa + 2m + 2. Wiersze: W znaków c; m razy: c, W − 2 spacji, c; wiersz ze słowem: c, m spacji, słowo, m spacji, c; znowu m wierszy ze spacjami i W znaków c.',
                'Napisz funkcję void ramka(string s, char c, int m). Ramki oddzielaj pustym wierszem.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy: słowo s, znak c i margines m.'],
            output_format: ['t ramek (każda ma 2m + 3 wiersze), oddzielonych pustym wierszem.'],
            constraints: ['1 ≤ t ≤ 20', 'Słowo ma od 1 do 30 liter.', '0 ≤ m ≤ 5', 'c to jeden ze znaków # * = + - o @ % x X & $'],
            examples: [{ input: '2\nala * 1\nOK # 0', note: 'Dla ala i m = 1: W = 3 + 2 + 2 = 7, wiersz z pustym marginesem nad i pod słowem. Dla m = 0 ramka przylega do słowa.' }],
            hint: R`Najpierw policz int W = s.size() + 2 * m + 2;. Napisz sobie pomocniczą funkcję void znaki(int ile, char z) { for (…) cout << z; }, której użyjesz i do kresek (znaki(W, c)), i do spacji (znaki(m, ' ') albo znaki(W - 2, ' ')). Parametr może być też spacją.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map((x) => x.join(' ')).join('\n')}`;
                const los = () => [r.word(r.int(1, 12), 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPRSTUWZ'), r.pick(ZNAKI), r.int(0, 5)];
                return [d([['a', '#', 0]]), d([['abcdefghijklmnopqrstuvwxyzabcd', '@', 5], ['Q', 'x', 5]]), d(Array.from({ length: 6 }, los)), d(Array.from({ length: 20 }, los))];
            },
            check: (inp) => { const L = linie(inp); const t = Number(L[0]); return calk(t, 1, 20) && L.length === t + 1 && L.slice(1).every((l) => { const m = l.match(/^([A-Za-z]{1,30}) (\S) (\d)$/); return m && ZNAKI.includes(m[2]) && calk(Number(m[3]), 0, 5); }) ? null : 'dane'; },
            solve: (inp) => linie(inp).slice(1).map((l) => {
                const [s, c, mm] = l.split(' '); const m = Number(mm); const W = s.length + 2 * m + 2;
                const pusty = c + ' '.repeat(W - 2) + c;
                return [c.repeat(W), ...Array(m).fill(pusty), c + ' '.repeat(m) + s + ' '.repeat(m) + c, ...Array(m).fill(pusty), c.repeat(W)].join('\n');
            }).join('\n\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
void znaki(int ile, char z) {
    for (int i = 0; i < ile; i++) cout << z;
}
void ramka(string s, char c, int m) {
    int W = s.size() + 2 * m + 2;
    znaki(W, c);
    cout << "\n";
    for (int i = 0; i < m; i++) {
        cout << c;
        znaki(W - 2, ' ');
        cout << c << "\n";
    }
    cout << c;
    znaki(m, ' ');
    cout << s;
    znaki(m, ' ');
    cout << c << "\n";
    for (int i = 0; i < m; i++) {
        cout << c;
        znaki(W - 2, ' ');
        cout << c << "\n";
    }
    znaki(W, c);
    cout << "\n";
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        string s;
        char c;
        int m;
        cin >> s >> c >> m;
        if (i > 0) cout << "\n";
        ramka(s, c, m);
    }
    return 0;
}`,
        },

        // ================================================================ KROK 3 · return
        {
            id: 'fun-prad', krok: 3, level: 'latwe',
            title: 'Rachunek za prąd',
            short: 'Cena prądu rośnie progami: pierwsze 100 kWh po 1 zł, następne 200 po 2 zł, reszta po 3 zł. Funkcja koszt(kwh) oddaje kwotę przez return.',
            tags: ['return', 'funkcja z if-ami', 'suma w long long'],
            statement: ['Elektrownia liczy opłatę progowo. Za pierwsze 100 kWh płaci się 1 zł za każdą kWh, za kolejne 200 kWh (od 101. do 300.) — 2 zł za kWh, a za każdą kWh powyżej 300 — 3 zł.',
                'Napisz funkcję long long koszt(long long kwh), która zwraca opłatę w złotych. Wypisz opłatę każdego z n domów, a na końcu sumę wszystkich opłat.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb — zużycie prądu w kolejnych domach (w kWh).'],
            output_format: ['n wierszy z opłatami, a po nich wiersz Razem: S'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ zużycie ≤ 10⁶'],
            examples: [{ input: '3\n50 250 400', note: '50 kWh to 50 zł. 250 kWh: 100 · 1 + 150 · 2 = 400 zł. 400 kWh: 100 + 200 · 2 + 100 · 3 = 800 zł. Razem 1250 zł.' }],
            hint: R`long long koszt(long long kwh) { if (kwh <= 100) return kwh; if (kwh <= 300) return 100 + 2 * (kwh - 100); return 500 + 3 * (kwh - 300); } — 500 to koszt pierwszych 300 kWh. W main: long long razem = 0; i dla każdego domu razem += koszt(x);. Suma może przekroczyć 2 · 10⁹ — stąd long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([0]), d([100, 101, 300, 301]), d(r.arr(10, 0, 500)), d(r.arr(1000, 900000, 1000000)), d(r.arr(1000, 0, 1000))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e6)) ? null : 'dane'; },
            solve: (inp) => { const k = (x) => (x <= 100 ? x : x <= 300 ? 100 + 2 * (x - 100) : 500 + 3 * (x - 300)); const a = nums(inp).slice(1).map(k); return [...a, `Razem: ${a.reduce((s, x) => s + x, 0)}`].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long koszt(long long kwh) {
    if (kwh <= 100) return kwh;
    if (kwh <= 300) return 100 + 2 * (kwh - 100);
    return 500 + 3 * (kwh - 300);
}
int main() {
    int n;
    cin >> n;
    long long razem = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        cout << koszt(x) << "\n";
        razem += koszt(x);
    }
    cout << "Razem: " << razem << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-zlozenie', krok: 3, level: 'latwe',
            title: 'f(g(x)) czy g(f(x))?',
            short: 'Dwie funkcje: f(x) = 2x + 3 i g(x) = x² − 1. Dla każdego x policz f(g(x)) i g(f(x)) — wynik jednej funkcji jest argumentem drugiej.',
            tags: ['return', 'złożenie funkcji', 'wynik jako argument'],
            statement: ['Na matematyce poznaliście złożenie funkcji: f(g(x)) znaczy „najpierw policz g(x), a wynik wstaw do f”. Kolejność ma znaczenie!',
                'Napisz int f(int x), która zwraca 2x + 3, oraz int g(int x), która zwraca x² − 1. Dla każdego z q argumentów wypisz f(g(x)) i g(f(x)).'],
            input_format: ['W pierwszym wierszu q.', 'W drugim wierszu q liczb całkowitych x.'],
            output_format: ['q wierszy: f(g(x)) i g(f(x)), oddzielone spacją.'],
            constraints: ['1 ≤ q ≤ 1000', '−10⁴ ≤ x ≤ 10⁴'],
            examples: [{ input: '2\n2 -1', note: 'Dla x = 2: g(2) = 3, więc f(g(2)) = f(3) = 9; f(2) = 7, więc g(f(2)) = g(7) = 48. Dla x = −1: f(g(−1)) = f(0) = 3, g(f(−1)) = g(1) = 0.' }],
            hint: R`int f(int x) { return 2 * x + 3; } i int g(int x) { return x * x - 1; }. Złożenie zapisujesz dokładnie tak jak na matematyce: cout << f(g(x)) << " " << g(f(x)) << "\n";. Najpierw liczy się wywołanie w środku, jego wynik staje się argumentem zewnętrznego.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([0]), d([10000, -10000, 1, -1, -2]), d(r.arr(20, -50, 50)), d(r.arr(1000, -10000, 10000))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e4, 1e4)) ? null : 'dane'; },
            solve: (inp) => { const f = (x) => 2 * x + 3, g = (x) => x * x - 1; return nums(inp).slice(1).map((x) => `${f(g(x))} ${g(f(x))}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int f(int x) {
    return 2 * x + 3;
}
int g(int x) {
    return x * x - 1;
}
int main() {
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int x;
        cin >> x;
        cout << f(g(x)) << " " << g(f(x)) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-a-do-b', krok: 3, level: 'latwe',
            title: 'a do b czy b do a?',
            short: 'Co jest większe: 2³ czy 3²? Jedna funkcja potega(a, b), wywołana dwa razy z argumentami zamienionymi miejscami.',
            tags: ['return long long', 'ta sama funkcja dwa razy', 'porównanie wyników'],
            statement: ['Dla dwóch liczb a i b porównaj aᵇ (a do potęgi b) z bᵃ.',
                'Napisz funkcję long long potega(long long a, int b), która liczy aᵇ zwykłą pętlą (bez pow). Dla każdej pary wypisz obie potęgi i znak <, > albo = między nimi.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy liczby a i b.'],
            output_format: ['t wierszy w formacie: X < Y, X > Y albo X = Y, gdzie X = aᵇ, a Y = bᵃ.'],
            constraints: ['1 ≤ t ≤ 225', '1 ≤ a, b ≤ 15'],
            examples: [{ input: '3\n2 3\n2 4\n3 2', note: '2³ = 8 < 9 = 3². 2⁴ = 16 = 4². 3² = 9 > 8 = 2³.' }],
            hint: R`long long potega(long long a, int b) { long long w = 1; for (int i = 0; i < b; i++) w *= a; return w; }. W main: long long x = potega(a, b), y = potega(b, a); i trzy if-y. 15¹⁵ ≈ 4 · 10¹⁷ — mieści się tylko w long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const wszystkie = []; for (let a = 1; a <= 15; a++) for (let b = 1; b <= 15; b++) wszystkie.push([a, b]);
                return [d([[1, 1]]), d([[15, 15], [15, 14], [14, 15], [1, 15]]), d(Array.from({ length: 30 }, () => [r.int(1, 15), r.int(1, 15)])), d(r.shuffle(wszystkie))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 225) && t.length === 2 * t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 15)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp).slice(1); const o = []; for (let i = 0; i < t.length; i += 2) { const x = BigInt(t[i]) ** BigInt(t[i + 1]), y = BigInt(t[i + 1]) ** BigInt(t[i]); o.push(`${x} ${x < y ? '<' : x > y ? '>' : '='} ${y}`); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long potega(long long a, int b) {
    long long w = 1;
    for (int i = 0; i < b; i++) w *= a;
    return w;
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        int a, b;
        cin >> a >> b;
        long long x = potega(a, b), y = potega(b, a);
        if (x < y) cout << x << " < " << y << "\n";
        else if (x > y) cout << x << " > " << y << "\n";
        else cout << x << " = " << y << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-pojedynek-cyfr', krok: 3, level: 'latwe',
            title: 'Pojedynek na sumy cyfr',
            short: 'Dwie liczby stają do pojedynku — wygrywa ta z większą sumą cyfr. Funkcja sumaCyfr(x) i porównanie dwóch jej wyników.',
            tags: ['return int', 'cyfry liczby', 'long long jako parametr'],
            statement: ['W grze „pojedynek cyfr” każdy gracz podaje liczbę, a wygrywa ten, którego liczba ma większą sumę cyfr.',
                'Napisz funkcję int sumaCyfr(long long x). Dla każdego z t pojedynków wypisz liczbę zwycięzcy albo słowo REMIS, gdy sumy są równe.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t kolejnych wierszy dwie liczby a i b.'],
            output_format: ['t wierszy: liczba z większą sumą cyfr albo REMIS.'],
            constraints: ['1 ≤ t ≤ 1000', '0 ≤ a, b ≤ 10¹⁸'],
            examples: [{ input: '3\n123 99\n45 54\n909 1000', note: 'Sumy: 6 i 18 — wygrywa 99. 9 i 9 — remis. 18 i 1 — wygrywa 909.' }],
            hint: R`int sumaCyfr(long long x) { int s = 0; while (x > 0) { s += x % 10; x /= 10; } return s; } — x jest kopią, więc możesz go „zjadać”. W main: int sa = sumaCyfr(a), sb = sumaCyfr(b); — funkcję wywołujesz dla obu liczb.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const big = () => String(r.big(0, 1000000000000000000n));
                return [d([['0', '0']]), d([['1000000000000000000', '1'], ['999999999999999999', '1000000000000000000']]), d(Array.from({ length: 20 }, () => [String(r.int(0, 999)), String(r.int(0, 999))])), d(Array.from({ length: 1000 }, () => [big(), big()]))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 1000) && t.length === 2 * n + 1 && t.slice(1).every((x) => /^(0|[1-9]\d{0,18})$/.test(x) && BigInt(x) <= 10n ** 18n) ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp).slice(1); const o = []; for (let i = 0; i < t.length; i += 2) { const a = sumaCyfr(t[i]), b = sumaCyfr(t[i + 1]); o.push(a > b ? t[i] : a < b ? t[i + 1] : 'REMIS'); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int sumaCyfr(long long x) {
    int s = 0;
    while (x > 0) {
        s += x % 10;
        x /= 10;
    }
    return s;
}
int main() {
    int t;
    cin >> t;
    for (int i = 0; i < t; i++) {
        long long a, b;
        cin >> a >> b;
        int sa = sumaCyfr(a), sb = sumaCyfr(b);
        if (sa > sb) cout << a << "\n";
        else if (sa < sb) cout << b << "\n";
        else cout << "REMIS\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-lustro', krok: 3, level: 'latwe',
            title: 'Liczba plus jej lustro',
            short: 'Lustro liczby to jej cyfry czytane od tyłu (120 → 21). Funkcja odwroc(x) oddaje lustro, a main dodaje je do liczby.',
            tags: ['return long long', 'odwracanie cyfr', 'wynik w wyrażeniu'],
            statement: ['Lustrem liczby nazwiemy liczbę o tych samych cyfrach w odwrotnej kolejności. Zera z przodu lustra znikają: lustro 120 to 21, a lustro 7 to 7.',
                'Napisz funkcję long long odwroc(long long x). Dla każdej z n liczb wypisz sumę liczby i jej lustra.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb.'],
            output_format: ['n wierszy: x + odwroc(x).'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ x ≤ 10¹²'],
            examples: [{ input: '3\n12 120 7', note: '12 + 21 = 33, 120 + 21 = 141, 7 + 7 = 14.' }],
            hint: R`long long odwroc(long long x) { long long w = 0; while (x > 0) { w = w * 10 + x % 10; x /= 10; } return w; } — każda ostatnia cyfra x dopisuje się na koniec w. W main: cout << x + odwroc(x) << "\n";. Liczby sięgają 10¹², więc wszystko w long long.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([0]), d([1000000000000, 999999999999, 10, 100]), d(r.arr(20, 0, 1000)), d(Array.from({ length: 1000 }, () => r.int(0, 999999) * 1000000 + r.int(0, 999999)))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 0, 1e12)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).map((x) => String(x + odwroc(x))).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
long long odwroc(long long x) {
    long long w = 0;
    while (x > 0) {
        w = w * 10 + x % 10;
        x /= 10;
    }
    return w;
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        cout << x + odwroc(x) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'fun-czas-lekcji', krok: 3, level: 'srednie',
            title: 'Najdłuższe zajęcia',
            short: 'Godziny zapisane jako HH:MM. Funkcja naMinuty("08:15") oddaje 495 — potem długość zajęć to zwykłe odejmowanie.',
            tags: ['parametr string, wynik int', 'napis na liczbę', 'dwa wywołania na wiersz'],
            statement: ['Plan dnia ma n zajęć. Każde zajęcia mają godzinę początku i końca w formacie HH:MM (zawsze dwie cyfry godzin i dwie cyfry minut). Zajęcia kończą się tego samego dnia, później niż się zaczęły.',
                'Napisz funkcję int naMinuty(string hhmm), która zamienia godzinę na liczbę minut od północy. Wypisz długość każdych zajęć w minutach, a na końcu numer najdłuższych (przy remisie — wcześniejszych).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy dwie godziny: początek i koniec.'],
            output_format: ['n wierszy z długościami zajęć, a po nich wiersz Najdluzsze: k (numer liczony od 1).'],
            constraints: ['1 ≤ n ≤ 1000', 'Godziny od 00:00 do 23:59.'],
            examples: [{ input: '3\n08:00 08:45\n09:50 11:20\n12:00 12:30', note: 'Zajęcia trwają 45, 90 i 30 minut. Najdłuższe są drugie.' }],
            hint: R`int naMinuty(string s) { int h = (s[0] - '0') * 10 + (s[1] - '0'); int m = (s[3] - '0') * 10 + (s[4] - '0'); return h * 60 + m; } — s[2] to dwukropek. Długość: naMinuty(koniec) - naMinuty(poczatek). Najdłuższe zapamiętuj jak rekord: nowy rekord tylko przy >.`,
            tests: (r) => {
                const hm = (m) => `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
                const zaj = () => { const a = r.int(0, 1438); return [a, r.int(a + 1, 1439)]; };
                const d = (a) => `${a.length}\n${a.map(([x, y]) => `${hm(x)} ${hm(y)}`).join('\n')}`;
                return [d([[0, 1439]]), d([[600, 660], [700, 760], [0, 1]]), d(Array.from({ length: 10 }, zaj)), d(Array.from({ length: 1000 }, zaj)), d(Array.from({ length: 1000 }, () => { const a = r.int(0, 1300); return [a, a + r.int(1, 90)]; }))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 1) return 'n';
                for (const l of L.slice(1)) { const m = l.match(/^([01]\d|2[0-3]):([0-5]\d) ([01]\d|2[0-3]):([0-5]\d)$/); if (!m) return 'format'; if (Number(m[1]) * 60 + Number(m[2]) >= Number(m[3]) * 60 + Number(m[4])) return 'kolejność'; }
                return null;
            },
            solve: (inp) => {
                const mi = (s) => Number(s.slice(0, 2)) * 60 + Number(s.slice(3, 5));
                const d = linie(inp).slice(1).map((l) => { const [a, b] = l.split(' '); return mi(b) - mi(a); });
                let k = 0; d.forEach((x, i) => { if (x > d[k]) k = i; });
                return [...d, `Najdluzsze: ${k + 1}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int naMinuty(string s) {
    int h = (s[0] - '0') * 10 + (s[1] - '0');
    int m = (s[3] - '0') * 10 + (s[4] - '0');
    return h * 60 + m;
}
int main() {
    int n;
    cin >> n;
    int najdl = -1, ktore = 0;
    for (int i = 1; i <= n; i++) {
        string a, b;
        cin >> a >> b;
        int d = naMinuty(b) - naMinuty(a);
        cout << d << "\n";
        if (d > najdl) {
            najdl = d;
            ktore = i;
        }
    }
    cout << "Najdluzsze: " << ktore << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-obwod', krok: 3, level: 'srednie',
            title: 'Obwód ogrodzenia',
            short: 'Działka ma kształt wielokąta. Funkcja odleglosc(x1, y1, x2, y2) zwraca długość boku jako double — obwód to suma n jej wywołań.',
            tags: ['return double', 'sqrt', 'jedna funkcja n razy'],
            statement: ['Rolnik ogradza działkę. Słupki stoją w n punktach o współrzędnych całkowitych, a siatka biegnie prosto od każdego słupka do następnego, a od ostatniego — z powrotem do pierwszego.',
                'Napisz funkcję double odleglosc(int x1, int y1, int x2, int y2), która zwraca odległość dwóch punktów (z twierdzenia Pitagorasa). Wypisz długość całej siatki z dokładnością do dwóch miejsc po przecinku.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy współrzędne słupka x i y — w kolejności, w jakiej biegnie siatka.'],
            output_format: ['Jedna liczba — długość siatki, z dwiema cyframi po kropce.'],
            constraints: ['3 ≤ n ≤ 1000', '−10⁴ ≤ x, y ≤ 10⁴', 'Kolejne słupki (także ostatni i pierwszy) stoją w różnych punktach.'],
            examples: [{ input: '3\n0 0\n3 0\n0 4', note: 'Boki mają długości 3, 5 (od (3, 0) do (0, 4)) i 4 — razem 12.' }],
            hint: R`double odleglosc(int x1, int y1, int x2, int y2) { double dx = x2 - x1, dy = y2 - y1; return sqrt(dx * dx + dy * dy); }. Wczytaj punkty do tablic (albo vectorów) x i y, a potem dodawaj odleglosc(x[i], y[i], x[i + 1], y[i + 1]) — i na koniec bok od ostatniego do pierwszego. Wypisz: cout << fixed << setprecision(2) << obwod;.`,
            tests: (r) => {
                const d = (p) => `${p.length}\n${p.map(([x, y]) => `${x} ${y}`).join('\n')}`;
                const obw = (p) => { let s = 0; for (let i = 0; i < p.length; i++) { const [a, b] = p[i], [c, e] = p[(i + 1) % p.length]; const dx = c - a, dy = e - b; s += Math.sqrt(dx * dx + dy * dy); } return s; };
                const los = (n, m) => { for (;;) { const p = []; while (p.length < n) { const q = [r.int(-m, m), r.int(-m, m)]; if (!p.length || q[0] !== p[p.length - 1][0] || q[1] !== p[p.length - 1][1]) p.push(q); } const a = p[0], z = p[n - 1]; if ((a[0] !== z[0] || a[1] !== z[1]) && h.safe(obw(p), 2)) return d(p); } };
                return ['4\n0 0\n10 0\n10 10\n0 10', '3\n-10000 -10000\n10000 10000\n10000 -10000', los(5, 10), los(50, 1000), los(1000, 10000), los(1000, 3)];
            },
            check: (inp) => {
                const t = nums(inp); const n = t[0]; if (!calk(n, 3, 1000) || t.length !== 2 * n + 1 || !t.slice(1).every((x) => calk(x, -1e4, 1e4))) return 'dane';
                for (let i = 0; i < n; i++) { const j = (i + 1) % n; if (t[1 + 2 * i] === t[1 + 2 * j] && t[2 + 2 * i] === t[2 + 2 * j]) return 'te same punkty'; }
                return null;
            },
            solve: (inp) => { const t = nums(inp); const n = t[0]; let s = 0; for (let i = 0; i < n; i++) { const j = (i + 1) % n; const dx = t[1 + 2 * j] - t[1 + 2 * i], dy = t[2 + 2 * j] - t[2 + 2 * i]; s += Math.sqrt(dx * dx + dy * dy); } return h.fx(s, 2); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
double odleglosc(int x1, int y1, int x2, int y2) {
    double dx = x2 - x1, dy = y2 - y1;
    return sqrt(dx * dx + dy * dy);
}
int main() {
    int n;
    cin >> n;
    vector<int> x(n), y(n);
    for (int i = 0; i < n; i++) cin >> x[i] >> y[i];
    double obwod = 0;
    for (int i = 0; i + 1 < n; i++) obwod += odleglosc(x[i], y[i], x[i + 1], y[i + 1]);
    obwod += odleglosc(x[n - 1], y[n - 1], x[0], y[0]);
    cout << fixed << setprecision(2) << obwod << "\n";
    return 0;
}`,
        },
        {
            id: 'fun-na-rzymskie', krok: 3, level: 'srednie',
            title: 'Z arabskich na rzymskie',
            short: 'Funkcja, która zwraca napis: rzymska(1994) = "MCMXCIV". Tabela wartości od największej i odejmowanie, dopóki się da.',
            tags: ['return string', 'tablica wartości', 'sklejanie napisu'],
            statement: ['Liczby rzymskie zapisuje się znakami M = 1000, D = 500, C = 100, L = 50, X = 10, V = 5, I = 1, a także parami CM = 900, CD = 400, XC = 90, XL = 40, IX = 9, IV = 4. Liczbę zapisuje się od największych wartości: 1994 = M + CM + XC + IV = MCMXCIV.',
                'Napisz funkcję string rzymska(int x) i zamień nią n liczb.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb.'],
            output_format: ['n wierszy z zapisem rzymskim kolejnych liczb.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ x ≤ 3999'],
            examples: [{ input: '4\n4 9 14 1994', note: '4 = IV, 9 = IX, 14 = X + IV = XIV, 1994 = MCMXCIV.' }],
            hint: R`Dwie tablice po 13 elementów: int w[] = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1}; i string z[] = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};. W funkcji: string s = ""; for (int i = 0; i < 13; i++) while (x >= w[i]) { s += z[i]; x -= w[i]; } return s;.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([1]), d([3999, 3888, 2024, 444, 999, 40, 90, 400, 900]), d(Array.from({ length: 100 }, (_, i) => i + 1)), d(r.arr(1000, 1, 3999))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 1000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 3999)) ? null : 'dane'; },
            solve: (inp) => nums(inp).slice(1).map(naRzymskie).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string rzymska(int x) {
    int w[] = {1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1};
    string z[] = {"M", "CM", "D", "CD", "C", "XC", "L", "XL", "X", "IX", "V", "IV", "I"};
    string s = "";
    for (int i = 0; i < 13; i++) {
        while (x >= w[i]) {
            s += z[i];
            x -= w[i];
        }
    }
    return s;
}
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        cout << rzymska(x) << "\n";
    }
    return 0;
}`,
        },
    ];
};
