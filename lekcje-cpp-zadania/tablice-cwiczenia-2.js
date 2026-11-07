// Tablice — ćwiczenia w trakcie lekcji, części 5–8: kilka tablic naraz (równoległe, ściągi, scalanie),
// tablica liczników, tablice dwuwymiarowe i plansze oraz tablice na olimpiadzie (duże tablice globalne,
// sumy prefiksowe, sito Eratostenesa). Uczeń zna cały pierwszy etap i części 1–4 tej lekcji —
// ale jeszcze nie funkcje, vector, sort ani mapy.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const lin = (a) => a.join(' ');
    const arrIn = (a) => `${a.length}\n${lin(a)}`;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas', 'Julka', 'Tymon', 'Nina', 'Bartek', 'Iga', 'Leon'];
    const PKT = [1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3, 1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10];
    const ABC = 'abcdefghijklmnopqrstuvwxyz';
    const RZ_W = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1];
    const RZ_S = ['M', 'CM', 'D', 'CD', 'C', 'XC', 'L', 'XL', 'X', 'IX', 'V', 'IV', 'I'];
    const rzym = (n) => { let s = ''; for (let i = 0; i < 13; i++) while (n >= RZ_W[i]) { s += RZ_S[i]; n -= RZ_W[i]; } return s; };
    const RZ_V = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
    const sito = (n) => { const z = new Uint8Array(n + 1); z[0] = 1; if (n >= 1) z[1] = 1; for (let i = 2; i * i <= n; i++) if (!z[i]) for (let j = i * i; j <= n; j += i) z[j] = 1; return z; };
    const Z6 = sito(1000000);
    const rosnaca = (r, n, lo, maxKrok, scisle) => { let x = lo; return Array.from({ length: n }, () => (x += r.int(scisle ? 1 : 0, maxKrok))); };
    const tabelka = (t) => `${t.length} ${t[0].length}\n${t.map(lin).join('\n')}`;
    const losTab = (r, n, m, lo, hi) => Array.from({ length: n }, () => r.arr(m, lo, hi));
    const czytajTab = (inp) => { const v = nums(inp); const n = v[0], m = v[1]; const t = []; for (let w = 0; w < n; w++) t.push(v.slice(2 + w * m, 2 + (w + 1) * m)); return { n, m, t }; };

    return [
        // ================================================================ KROK 5 · kilka tablic naraz
        {
            id: 'tab-lepsi-od-sredniej', krok: 5, level: 'latwe',
            title: 'Powyżej średniej klasy',
            short: 'Imiona i punkty w dwóch tablicach. Wypisz uczniów, którzy przekroczyli średnią klasy.',
            tags: ['tablice równoległe', 'dwa przejścia', 'BRAK'],
            statement: ['W klasie jest n uczniów. Dla każdego znasz imię i liczbę punktów ze sprawdzianu. Wypisz imiona uczniów, którzy mają więcej punktów, niż wynosi średnia całej klasy — każde w osobnym wierszu, w kolejności z wejścia. Jeśli nikt nie przekroczył średniej, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy imię i liczba punktów.'],
            output_format: ['Imiona uczniów powyżej średniej, każde w osobnym wierszu, albo BRAK.'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ punkty ≤ 100', 'Imiona mają od 1 do 20 liter.'],
            examples: [
                { input: '4\nOla 17\nJan 23\nEwa 19\nIgor 23', note: 'Średnia to 20,5 — więcej mają Jan i Igor.' },
                { input: '2\nAla 5\nBob 5' },
            ],
            hint: R`Dwie tablice równoległe: string imie[100] i int pkt[100]. Pierwsza pętla wczytuje dane i liczy sumę. Druga sprawdza pkt[i] * n > suma (to samo co pkt[i] > średnia, ale bez ułamków) i wypisuje imie[i]. Licz po drodze wypisane imiona, żeby wiedzieć, czy na końcu wypisać BRAK.`,
            tests: (r) => {
                const kl = (n, lo, hi) => `${n}\n${Array.from({ length: n }, () => `${r.pick(IMIONA)} ${r.int(lo, hi)}`).join('\n')}`;
                return ['4\nOla 17\nJan 23\nEwa 19\nIgor 23', '2\nAla 5\nBob 5', '1\nSam 100', '3\nA 0\nB 0\nC 1', kl(100, 0, 100), kl(30, 40, 60), kl(10, 0, 3)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const im = [], p = []; for (let i = 0; i < n; i++) { im.push(t[1 + 2 * i]); p.push(Number(t[2 + 2 * i])); } const s = p.reduce((a, b) => a + b, 0); const o = im.filter((_, i) => p[i] * n > s); return o.length ? o.join('\n') : 'BRAK'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string imie[100];
    int pkt[100];
    int n;
    cin >> n;
    int suma = 0;
    for (int i = 0; i < n; i++) {
        cin >> imie[i] >> pkt[i];
        suma += pkt[i];
    }
    int ile = 0;
    for (int i = 0; i < n; i++) {
        if (pkt[i] * n > suma) {
            cout << imie[i] << "\n";
            ile++;
        }
    }
    if (ile == 0) {
        cout << "BRAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-najpierw-parzyste', krok: 5, level: 'latwe',
            title: 'Najpierw parzyste',
            short: 'Rozłóż liczby do dwóch nowych tablic i wypisz najpierw parzyste, potem nieparzyste.',
            tags: ['nowa tablica', 'licznik = pierwsze wolne', 'parzystość'],
            statement: ['Wczytaj n liczb całkowitych. Wypisz w jednym wierszu najpierw wszystkie liczby parzyste, a potem wszystkie nieparzyste — w obu grupach w takiej kolejności, w jakiej stały na wejściu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: liczby parzyste, a za nimi nieparzyste.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '8\n5 8 2 7 4 1 6 3' }, { input: '4\n-3 -2 0 7', note: 'Zero i −2 są parzyste.' }],
            hint: R`Rozłóż liczby do dwóch nowych tablic, każdej z własnym licznikiem: parz[ileP] = x; ileP++; albo niep[ileN] = x; ileN++;. Parzystość sprawdzaj przez x % 2 == 0 — z lekcji o if pamiętasz, że dla ujemnych nieparzystych reszta to −1, a nie 1. Na koniec wypisz całą tablicę parz, a za nią niep.`,
            tests: (r) => ['8\n5 8 2 7 4 1 6 3', '4\n-3 -2 0 7', '1\n1', '1\n0', '3\n1 3 5', '3\n2 4 6', arrIn(r.arr(1000, -1e9, 1e9)), arrIn(r.arr(30, -9, 9))],
            solve: (inp) => { const v = nums(inp); const t = v.slice(1, 1 + v[0]); return lin(t.filter((x) => x % 2 === 0).concat(t.filter((x) => x % 2 !== 0))); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int parz[1000], niep[1000];
    int ileP = 0, ileN = 0;
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (x % 2 == 0) {
            parz[ileP] = x;
            ileP++;
        } else {
            niep[ileN] = x;
            ileN++;
        }
    }
    for (int i = 0; i < ileP; i++) {
        cout << parz[i] << " ";
    }
    for (int i = 0; i < ileN; i++) {
        cout << niep[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-klucz-odpowiedzi', krok: 5, level: 'latwe',
            title: 'Sprawdzian z kluczem',
            short: 'Porównaj odpowiedzi każdego ucznia z kluczem, policz punkty i wskaż najlepszego.',
            tags: ['char klucz[100]', 'porównanie pozycja po pozycji', 'najlepszy'],
            statement: ['Test ma n pytań, a w każdym poprawna odpowiedź to jedna z liter A, B, C albo D. Na wejściu jest najpierw klucz — n liter oddzielonych spacjami. Potem jest liczba uczniów k, a dla każdego ucznia wiersz z imieniem i jego n odpowiedziami. Za każdą odpowiedź zgodną z kluczem uczeń dostaje 1 punkt. Wypisz dla każdego ucznia jego imię i liczbę punktów, a w ostatnim wierszu imię najlepszego ucznia (przy remisie — tego, który był wcześniej na liście).'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liter klucza.', 'W trzecim wierszu liczba k.', 'W każdym z kolejnych k wierszy imię i n liter.'],
            output_format: ['k wierszy z imieniem i punktami, a potem wiersz z imieniem najlepszego ucznia.'],
            constraints: ['1 ≤ n ≤ 100', '1 ≤ k ≤ 100'],
            examples: [{ input: '5\nA C B D A\n3\nOla A C B D B\nJan A A A A A\nEwa A C B D A', note: 'Ola ma 4 punkty, Jan 2 (pytania 1 i 5), a Ewa wszystkie 5.' }],
            hint: R`Klucz wczytaj do tablicy char klucz[100] — cin >> c przeskakuje spacje, więc litery wczytasz po kolei. Dla każdego ucznia wczytaj imię, a potem w pętli jego n odpowiedzi i każdą od razu porównaj z klucz[i]. Najlepszego szukaj na bieżąco: zapamiętaj jego imię i punkty i podmieniaj, gdy ktoś ma ściśle więcej.`,
            tests: (r) => {
                const lit = (n) => Array.from({ length: n }, () => r.pick(['A', 'B', 'C', 'D']));
                const mk = (n, k) => { const key = lit(n); const o = [`${n}`, lin(key), `${k}`]; for (let i = 0; i < k; i++) o.push(`${r.pick(IMIONA)}${i} ${lin(key.map((c) => (r() < 0.6 ? c : r.pick(['A', 'B', 'C', 'D']))))}`); return o.join('\n'); };
                return ['5\nA C B D A\n3\nOla A C B D B\nJan A A A A A\nEwa A C B D A', '1\nB\n2\nAla A\nOla C', mk(100, 100), mk(10, 20), mk(3, 5)];
            },
            solve: (inp) => {
                const t = toks(inp); let p = 0; const n = Number(t[p++]); const key = t.slice(p, p + n); p += n; const k = Number(t[p++]);
                const o = []; let best = -1, bi = '';
                for (let s = 0; s < k; s++) { const im = t[p++]; let c = 0; for (let i = 0; i < n; i++) if (t[p++] === key[i]) c++; o.push(`${im} ${c}`); if (c > best) { best = c; bi = im; } }
                o.push(bi); return o.join('\n');
            },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    char klucz[100];
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> klucz[i];
    }
    int k;
    cin >> k;
    string najlepszy;
    int najPkt = -1;
    for (int s = 0; s < k; s++) {
        string imie;
        cin >> imie;
        int pkt = 0;
        for (int i = 0; i < n; i++) {
            char c;
            cin >> c;
            if (c == klucz[i]) {
                pkt++;
            }
        }
        cout << imie << " " << pkt << "\n";
        if (pkt > najPkt) {
            najPkt = pkt;
            najlepszy = imie;
        }
    }
    cout << najlepszy << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-scrabble', krok: 5, level: 'latwe',
            title: 'Najlepsze słowo w Scrabble',
            short: 'Wartości liter są w tablicy-ściądze indeksowanej literą. Które słowo jest warte najwięcej?',
            tags: ['int pkt[26]', "c - 'a'", 'maksimum'],
            statement: ['W angielskiej wersji gry Scrabble litery mają takie wartości: a, e, i, l, n, o, r, s, t, u — po 1 punkcie; d, g — po 2; b, c, m, p — po 3; f, h, v, w, y — po 4; k — 5; j, x — po 8; q, z — po 10. Wartość słowa to suma wartości jego liter. Wczytaj n słów i wypisz słowo o największej wartości oraz tę wartość. Jeśli kilka słów ma tyle samo punktów, wypisz to, które było pierwsze.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy jedno słowo z małych liter angielskich.'],
            output_format: ['Najlepsze słowo i jego wartość oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każde słowo ma od 1 do 20 liter.'],
            examples: [{ input: '4\nkot\nquiz\npies\njazz', note: 'kot = 7, quiz = 22, pies = 6, a jazz = 8 + 1 + 10 + 10 = 29.' }],
            hint: R`Zapisz wartości w tablicy int pkt[26] w kolejności alfabetu, od a do z (jak w przykładzie z lekcji). Wartość litery c to pkt[c - 'a']. Dla każdego słowa zsumuj wartości liter i porównaj z najlepszym dotąd wynikiem — znakiem >, żeby przy remisie zostało pierwsze słowo.`,
            tests: (r) => {
                const slowa = (n, maxL) => `${n}\n${Array.from({ length: n }, () => r.word(r.int(1, maxL))).join('\n')}`;
                return ['4\nkot\nquiz\npies\njazz', '1\na', '3\nab\nba\nc', '2\nzzzzzzzzzzzzzzzzzzzz\nqqqqqqqqqqqqqqqqqqqq', slowa(1000, 20), slowa(50, 6), slowa(10, 3)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); let best = -1, bw = ''; for (const w of t.slice(1, 1 + n)) { let s = 0; for (const c of w) s += PKT[c.charCodeAt(0) - 97]; if (s > best) { best = s; bw = w; } } return `${bw} ${best}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int pkt[26] = {1, 3, 3, 2, 1, 4, 2, 4, 1, 8, 5, 1, 3,
                   1, 1, 3, 10, 1, 1, 1, 1, 4, 4, 8, 4, 10};
    int n;
    cin >> n;
    string najlepsze;
    int naj = -1;
    for (int j = 0; j < n; j++) {
        string s;
        cin >> s;
        int suma = 0;
        for (int i = 0; i < s.length(); i++) {
            suma += pkt[s[i] - 'a'];
        }
        if (suma > naj) {
            naj = suma;
            najlepsze = s;
        }
    }
    cout << najlepsze << " " << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-rzymskie-na-arabskie', krok: 5, level: 'srednie',
            title: 'Z rzymskich na arabskie',
            short: 'Zamień liczby rzymskie na zwykłe — z tablicą wartości indeksowaną literą.',
            tags: ['ściąga indeksowana literą', 'następna cyfra', 'string'],
            statement: ['Zamień liczby zapisane cyframi rzymskimi na zwykłe. Cyfry rzymskie to I = 1, V = 5, X = 10, L = 50, C = 100, D = 500 i M = 1000. Zwykle wartości cyfr się dodaje (XVI = 10 + 5 + 1 = 16), ale gdy mniejsza cyfra stoi przed większą, odejmuje się ją (IV = 5 − 1 = 4, XC = 100 − 10 = 90). Wszystkie liczby na wejściu są zapisane poprawnie.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedna liczba rzymska.'],
            output_format: ['q wierszy — wartości kolejnych liczb.'],
            constraints: ['1 ≤ q ≤ 100', 'Każda liczba jest od 1 do 3999.'],
            examples: [{ input: '4\nXVI\nIV\nMCMXCIV\nMMXXVI', note: 'MCMXCIV = 1000 + (1000 − 100) + (100 − 10) + (5 − 1) = 1994.' }],
            hint: R`Zrób ściągę indeksowaną literą: int w[26] = {};, a potem w['I' - 'A'] = 1; w['V' - 'A'] = 5; i tak dalej. Idź po napisie od lewej: jeśli wartość cyfry jest mniejsza od wartości następnej cyfry, odejmij ją od wyniku, a w przeciwnym razie dodaj. Ostatnią cyfrę zawsze dodajesz — nie ma za nią następnej, więc uważaj, żeby nie sięgnąć poza napis.`,
            tests: (r) => ['4\nXVI\nIV\nMCMXCIV\nMMXXVI', '1\nI', '1\nMMMCMXCIX', `13\n${RZ_S.join('\n')}`, `100\n${Array.from({ length: 100 }, () => rzym(r.int(1, 3999))).join('\n')}`,
                `20\n${Array.from({ length: 20 }, () => rzym(r.int(1, 50))).join('\n')}`],
            solve: (inp) => { const t = toks(inp); return t.slice(1, 1 + Number(t[0])).map((s) => { let x = 0; for (let i = 0; i < s.length; i++) { const a = RZ_V[s[i]]; if (i + 1 < s.length && a < RZ_V[s[i + 1]]) x -= a; else x += a; } return String(x); }).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int w[26] = {};
    w['I' - 'A'] = 1;
    w['V' - 'A'] = 5;
    w['X' - 'A'] = 10;
    w['L' - 'A'] = 50;
    w['C' - 'A'] = 100;
    w['D' - 'A'] = 500;
    w['M' - 'A'] = 1000;
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        string s;
        cin >> s;
        int wynik = 0;
        for (int i = 0; i < s.length(); i++) {
            int a = w[s[i] - 'A'];
            if (i + 1 < s.length() && a < w[s[i + 1] - 'A']) {
                wynik -= a;
            } else {
                wynik += a;
            }
        }
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-szyfr-podstawieniowy', krok: 5, level: 'srednie',
            title: 'Szyfr podstawieniowy',
            short: 'Klucz to 26 liter. Szyfruj ściągą, a odszyfrowuj ściągą odwrotną.',
            tags: ["klucz[c - 'a']", 'ściąga odwrotna', 'char'],
            statement: [
                'Klucz szyfru to napis z 26 różnych małych liter: pierwsza litera klucza zastępuje literę a, druga — literę b, i tak dalej aż do z. Na przykład dla klucza zebrascdfghijklmnopqtuvwxy słowo abc zaszyfrujesz jako zeb.',
                'Wczytaj klucz, a potem q poleceń. Każde polecenie to litera S i wyraz albo litera D i wyraz: S oznacza „zaszyfruj”, a D — „odszyfruj”. Dla każdego polecenia wypisz wynik w osobnym wierszu.',
            ],
            input_format: ['W pierwszym wierszu klucz.', 'W drugim wierszu liczba q.', 'W każdym z kolejnych q wierszy litera S albo D i wyraz z małych liter.'],
            output_format: ['q wierszy — zaszyfrowane albo odszyfrowane wyrazy.'],
            constraints: ['1 ≤ q ≤ 100', 'Wyrazy mają od 1 do 100 liter.'],
            examples: [{ input: 'zebrascdfghijklmnopqtuvwxy\n3\nS abc\nS tablica\nD qzeifbz' }],
            hint: R`Szyfrowanie to ściąga: litera c zamienia się w klucz[c - 'a']. Do odszyfrowania zbuduj odwrotną ściągę — tablicę char odw[26], w której dla każdego i od 0 do 25: odw[klucz[i] - 'a'] = 'a' + i. Wtedy zaszyfrowana litera c zamienia się z powrotem w odw[c - 'a'].`,
            tests: (r) => {
                const mk = (q, maxL) => { const key = r.shuffle(ABC.split('')).join(''); const o = [key, `${q}`]; for (let i = 0; i < q; i++) o.push(`${r.pick(['S', 'D'])} ${r.word(r.int(1, maxL))}`); return o.join('\n'); };
                return ['zebrascdfghijklmnopqtuvwxy\n3\nS abc\nS tablica\nD qzeifbz', `${ABC}\n2\nS kot\nD kot`, `zyxwvutsrqponmlkjihgfedcba\n2\nS abc\nD zyx`, mk(100, 100), mk(10, 8)];
            },
            solve: (inp) => {
                const t = toks(inp); const key = t[0], q = Number(t[1]); const odw = {}; for (let i = 0; i < 26; i++) odw[key[i]] = ABC[i];
                const o = []; for (let j = 0; j < q; j++) { const m = t[2 + 2 * j], w = t[3 + 2 * j]; o.push(w.split('').map((c) => (m === 'S' ? key[c.charCodeAt(0) - 97] : odw[c])).join('')); }
                return o.join('\n');
            },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string klucz;
    cin >> klucz;
    char odw[26];
    for (int i = 0; i < 26; i++) {
        odw[klucz[i] - 'a'] = 'a' + i;
    }
    int q;
    cin >> q;
    for (int j = 0; j < q; j++) {
        char tryb;
        string w;
        cin >> tryb >> w;
        for (int i = 0; i < w.length(); i++) {
            if (tryb == 'S') {
                cout << klucz[w[i] - 'a'];
            } else {
                cout << odw[w[i] - 'a'];
            }
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-scalanie', krok: 5, level: 'srednie',
            title: 'Scalanie dwóch list',
            short: 'Połącz dwie uporządkowane listy w jedną uporządkowaną — bez sortowania, trzema indeksami.',
            tags: ['scalanie', 'indeksy i, j', 'reszta listy'],
            statement: ['Dwie listy liczb są uporządkowane niemalejąco (każda liczba jest nie mniejsza od poprzedniej). Połącz je w jedną listę uporządkowaną niemalejąco i wypisz ją. Nie potrzebujesz żadnego sortowania — skorzystaj z tego, że obie listy już są uporządkowane.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb pierwszej listy.', 'W trzecim wierszu m, w czwartym m liczb drugiej listy.'],
            output_format: ['Jeden wiersz — n + m liczb w kolejności niemalejącej.'],
            constraints: ['1 ≤ n, m ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1 4 6 9 12\n4\n2 3 10 15' }, { input: '3\n1 1 2\n2\n1 3' }],
            hint: R`Indeks i chodzi po pierwszej liście, j po drugiej. Dopóki obie listy mają jeszcze elementy (i < n && j < m), wypisz mniejszy z a[i] i b[j] i przesuń jego indeks. Gdy jedna lista się skończy, dopisz resztę drugiej — dwiema pętlami while, z których zadziała tylko jedna.`,
            check: (inp) => { const v = nums(inp); const n = v[0], a = v.slice(1, 1 + n), m = v[1 + n], b = v.slice(2 + n, 2 + n + m); for (const t of [a, b]) for (let i = 1; i < t.length; i++) if (t[i] < t[i - 1]) return 'nieuporządkowana'; return null; },
            tests: (r) => {
                const mk = (a, b) => `${arrIn(a)}\n${arrIn(b)}`;
                return ['5\n1 4 6 9 12\n4\n2 3 10 15', '3\n1 1 2\n2\n1 3', mk([5], [5]), mk([1, 2, 3], [4, 5, 6]), mk([4, 5, 6], [1, 2, 3]),
                    mk(rosnaca(r, 1000, -1e9, 1e6), rosnaca(r, 1000, -1e9, 1e6)), mk(rosnaca(r, 1000, 0, 2), rosnaca(r, 300, 0, 5)), mk(rosnaca(r, 7, 0, 5), rosnaca(r, 12, 0, 3))];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], a = v.slice(1, 1 + n), m = v[1 + n], b = v.slice(2 + n, 2 + n + m); return lin(a.concat(b).sort((x, y) => x - y)); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a[1000], b[1000];
    int n, m;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    cin >> m;
    for (int j = 0; j < m; j++) {
        cin >> b[j];
    }
    int i = 0, j = 0;
    while (i < n && j < m) {
        if (a[i] <= b[j]) {
            cout << a[i] << " ";
            i++;
        } else {
            cout << b[j] << " ";
            j++;
        }
    }
    while (i < n) {
        cout << a[i] << " ";
        i++;
    }
    while (j < m) {
        cout << b[j] << " ";
        j++;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-wspolne', krok: 5, level: 'srednie',
            title: 'Wspólne elementy',
            short: 'Dwie listy rosnące — wypisz liczby, które są na obu. Jedno przejście dwoma indeksami.',
            tags: ['dwa indeksy', 'listy uporządkowane', 'BRAK'],
            statement: ['Dwie listy liczb są uporządkowane rosnąco, a w żadnej z nich liczby się nie powtarzają. Wypisz w jednym wierszu, rosnąco, liczby, które są na obu listach. Jeśli takich nie ma, wypisz BRAK. Spróbuj zrobić to jednym przejściem z dwoma indeksami, tak jak przy scalaniu.'],
            input_format: ['W pierwszym wierszu n, w drugim n liczb pierwszej listy.', 'W trzecim wierszu m, w czwartym m liczb drugiej listy.'],
            output_format: ['Wspólne liczby rosnąco albo BRAK.'],
            constraints: ['1 ≤ n, m ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1 3 4 7 9\n4\n2 3 9 10' }, { input: '2\n1 2\n2\n3 4' }],
            hint: R`Indeks i chodzi po pierwszej liście, j po drugiej. Jeśli a[i] == b[j], znalazłeś wspólną liczbę — wypisz ją i przesuń oba indeksy. Jeśli a[i] < b[j], liczby a[i] nie ma dalej w drugiej liście (tam są już tylko większe), więc przesuń i. W przeciwnym razie przesuń j.`,
            check: (inp) => { const v = nums(inp); const n = v[0], a = v.slice(1, 1 + n), m = v[1 + n], b = v.slice(2 + n, 2 + n + m); for (const t of [a, b]) for (let i = 1; i < t.length; i++) if (t[i] <= t[i - 1]) return 'nie rosnąca'; return null; },
            tests: (r) => {
                const mk = (a, b) => `${arrIn(a)}\n${arrIn(b)}`;
                return ['5\n1 3 4 7 9\n4\n2 3 9 10', '2\n1 2\n2\n3 4', mk([7], [7]), mk([1, 2, 3], [1, 2, 3]), mk([-5, 0, 5], [-4, 0, 4]),
                    mk(rosnaca(r, 1000, -3000, 3, true), rosnaca(r, 1000, -3000, 3, true)), mk(rosnaca(r, 1000, -1e9, 1e6, true), rosnaca(r, 1000, -1e9, 1e6, true)), mk(rosnaca(r, 10, 0, 2, true), rosnaca(r, 15, 0, 2, true))];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], a = v.slice(1, 1 + n), m = v[1 + n], b = new Set(v.slice(2 + n, 2 + n + m)); const o = a.filter((x) => b.has(x)); return o.length ? lin(o) : 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int a[1000], b[1000];
    int n, m;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
    }
    cin >> m;
    for (int j = 0; j < m; j++) {
        cin >> b[j];
    }
    int i = 0, j = 0, ile = 0;
    while (i < n && j < m) {
        if (a[i] == b[j]) {
            cout << a[i] << " ";
            ile++;
            i++;
            j++;
        } else if (a[i] < b[j]) {
            i++;
        } else {
            j++;
        }
    }
    if (ile == 0) {
        cout << "BRAK";
    }
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 6 · tablica liczników
        {
            id: 'tab-oceny-statystyka', krok: 6, level: 'latwe',
            title: 'Oceny w dzienniku',
            short: 'Policz, ile było jedynek, dwójek, …, szóstek, i wskaż najczęstszą ocenę.',
            tags: ['int ile[7] = {}', 'ile[ocena]++', 'najczęstsza'],
            statement: ['Wczytaj n ocen (liczby od 1 do 6). Wypisz sześć wierszy w postaci ocena: liczba — ile razy wystąpiła każda ocena, od 1 do 6. W siódmym wierszu wypisz najczęstszą ocenę (jeśli kilka ocen wystąpiło tyle samo razy, wybierz najwyższą z nich).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n ocen.'],
            output_format: ['Sześć wierszy „ocena: liczba” i siódmy z najczęstszą oceną.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda ocena ≤ 6'],
            examples: [{ input: '8\n5 3 6 5 2 5 3 4' }, { input: '4\n2 6 2 6', note: 'Dwójka i szóstka wystąpiły po dwa razy — wygrywa wyższa.' }],
            hint: R`Tablica liczników int ile[7] = {}; i dla każdej oceny ile[ocena]++. Szukając najczęstszej, idź od 1 do 6 i podmieniaj wynik, gdy ile[o] >= ile[naj] — znak równości sprawi, że przy remisie wygra wyższa ocena.`,
            tests: (r) => ['8\n5 3 6 5 2 5 3 4', '4\n2 6 2 6', '1\n1', arrIn(Array(1000).fill(6)), arrIn(r.arr(1000, 1, 6)), arrIn(r.arr(12, 1, 6)), arrIn([1, 2, 3, 4, 5, 6])],
            solve: (inp) => { const v = nums(inp); const ile = Array(7).fill(0); for (const x of v.slice(1, 1 + v[0])) ile[x]++; let naj = 1; for (let o = 2; o <= 6; o++) if (ile[o] >= ile[naj]) naj = o; const out = []; for (let o = 1; o <= 6; o++) out.push(`${o}: ${ile[o]}`); out.push(String(naj)); return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int ile[7] = {};
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int ocena;
        cin >> ocena;
        ile[ocena]++;
    }
    int naj = 1;
    for (int o = 1; o <= 6; o++) {
        cout << o << ": " << ile[o] << "\n";
        if (ile[o] >= ile[naj]) {
            naj = o;
        }
    }
    cout << naj << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-litery-w-tekscie', krok: 6, level: 'latwe',
            title: 'Ile razy każda litera',
            short: 'Policz litery w wierszu tekstu i wypisz je alfabetycznie z liczbą wystąpień.',
            tags: ["ile[c - 'a']++", 'getline', "(char)('a' + k)"],
            statement: ['Wczytaj wiersz tekstu złożony z małych liter angielskich i spacji. Dla każdej litery, która występuje w tekście, wypisz w osobnym wierszu tę literę, spację i liczbę jej wystąpień. Litery wypisuj w kolejności alfabetycznej. Spacji nie licz.'],
            input_format: ['Jeden wiersz tekstu — może zawierać spacje.'],
            output_format: ['Dla każdej występującej litery wiersz: litera i liczba wystąpień.'],
            constraints: ['Tekst ma od 1 do 10 000 znaków i co najmniej jedną literę.'],
            examples: [{ input: 'ala ma kota' }],
            hint: R`Wiersz ze spacjami wczytasz przez getline(cin, s). Dla każdego znaku, który nie jest spacją, zwiększ ile[s[i] - 'a']. Potem pętla po k od 0 do 25: jeśli ile[k] > 0, wypisz (char)('a' + k) i ile[k].`,
            tests: (r) => {
                const tekst = (len) => { let s = r.word(1); while (s.length < len) s += r() < 0.15 ? ' ' : r.word(1); return s; };
                return ['ala ma kota', 'z', 'abc cba', 'zzz yyy xxx aaa', tekst(10000), tekst(100), r.word(500, 'ab'), 'the quick brown fox jumps over the lazy dog'];
            },
            solve: (inp) => { const ile = Array(26).fill(0); for (const c of inp) if (c >= 'a' && c <= 'z') ile[c.charCodeAt(0) - 97]++; const o = []; for (let k = 0; k < 26; k++) if (ile[k]) o.push(`${ABC[k]} ${ile[k]}`); return o.join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string s;
    getline(cin, s);
    int ile[26] = {};
    for (int i = 0; i < s.length(); i++) {
        if (s[i] != ' ') {
            ile[s[i] - 'a']++;
        }
    }
    for (int k = 0; k < 26; k++) {
        if (ile[k] > 0) {
            cout << (char)('a' + k) << " " << ile[k] << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'tab-najczestsza', krok: 6, level: 'latwe',
            title: 'Najczęstsza liczba',
            short: 'Liczby od 0 do 1000 — która występuje najczęściej? Jedna pętla zliczająca i jedna po licznikach.',
            tags: ['int ile[1001]', 'indeks największego licznika', 'remis'],
            statement: ['Wczytaj n liczb całkowitych od 0 do 1000. Wypisz liczbę, która występuje najczęściej, i ile razy wystąpiła. Jeśli kilka liczb występuje tyle samo razy, wypisz najmniejszą z nich.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Dwie liczby: najczęstsza wartość i liczba jej wystąpień.'],
            constraints: ['1 ≤ n ≤ 100 000', '0 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '10\n7 3 7 100 3 0 7 3 50 2', note: 'Trójka i siódemka wystąpiły po trzy razy — wygrywa mniejsza.' }],
            hint: R`int ile[1001] = {}; — po jednym pudełku dla każdej możliwej liczby. Po zliczeniu szukaj indeksu największego licznika od 0 do 1000, znakiem >, żeby przy remisie została mniejsza liczba.`,
            tests: (r) => ['10\n7 3 7 100 3 0 7 3 50 2', '1\n1000', '3\n5 6 7', arrIn(r.arr(10000, 0, 1000)), arrIn(r.arr(10000, 990, 1000)), arrIn(r.arr(20, 0, 5)), arrIn(Array(500).fill(0).concat(Array(500).fill(1000)))],
            solve: (inp) => { const v = nums(inp); const ile = Array(1001).fill(0); for (const x of v.slice(1, 1 + v[0])) ile[x]++; let naj = 0; for (let k = 1; k <= 1000; k++) if (ile[k] > ile[naj]) naj = k; return `${naj} ${ile[naj]}`; },
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
    int naj = 0;
    for (int v = 1; v <= 1000; v++) {
        if (ile[v] > ile[naj]) {
            naj = v;
        }
    }
    cout << naj << " " << ile[naj] << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-brakujace', krok: 6, level: 'latwe',
            title: 'Brakujące numery',
            short: 'Lista obecności z numerami od 1 do n — których numerów brakuje?',
            tags: ['bool jest[]', 'zaznaczanie', 'KOMPLET'],
            statement: ['Na liście obecności powinny być wpisane numery od 1 do n, ale część uczniów się nie wpisała, a niektórzy wpisali się kilka razy. Wczytaj n oraz m wpisanych numerów i wypisz w jednym wierszu, rosnąco, numery, których brakuje. Jeśli nikogo nie brakuje, wypisz KOMPLET.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W drugim wierszu m numerów od 1 do n.'],
            output_format: ['Brakujące numery rosnąco albo KOMPLET.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ m ≤ 1000'],
            examples: [{ input: '6 5\n3 1 3 6 1', note: 'Brakuje uczniów 2, 4 i 5.' }, { input: '3 4\n3 2 1 2' }],
            hint: R`Tablica bool jest[1001] = {}; — dla każdego wpisanego numeru x ustaw jest[x] = true. Potem przejdź po numerach od 1 do n i wypisz te, dla których jest[x] zostało false. Licz je po drodze, żeby wiedzieć, czy wypisać KOMPLET.`,
            tests: (r) => {
                const mk = (n, m) => `${n} ${m}\n${lin(r.arr(m, 1, n))}`;
                return ['6 5\n3 1 3 6 1', '3 4\n3 2 1 2', '1 1\n1', '5 1\n3', `1000 1000\n${lin(r.shuffle(Array.from({ length: 1000 }, (_, i) => i + 1)))}`, mk(1000, 1000), mk(1000, 300), mk(20, 15)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], m = v[1]; const s = new Set(v.slice(2, 2 + m)); const o = []; for (let x = 1; x <= n; x++) if (!s.has(x)) o.push(x); return o.length ? lin(o) : 'KOMPLET'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    bool jest[1001] = {};
    int n, m;
    cin >> n >> m;
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        jest[x] = true;
    }
    int ile = 0;
    for (int x = 1; x <= n; x++) {
        if (!jest[x]) {
            cout << x << " ";
            ile++;
        }
    }
    if (ile == 0) {
        cout << "KOMPLET";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-pierwsza-powtorka', krok: 6, level: 'latwe',
            title: 'Pierwsza powtórka',
            short: 'Znajdź pierwszą liczbę, która już wcześniej się pojawiła — tablicą bool, jednym przejściem.',
            tags: ['bool bylo[]', 'break', 'BRAK'],
            statement: ['Wczytaj n liczb. Znajdź pierwszą liczbę (licząc od początku), która już wcześniej się pojawiła, i wypisz ją oraz jej pozycję (od 1). Jeśli żadna liczba się nie powtarza, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Liczba i jej pozycja oddzielone spacją albo BRAK.'],
            constraints: ['1 ≤ n ≤ 100 000', '0 ≤ każda liczba ≤ 100 000'],
            examples: [
                { input: '8\n4 9 1 9 4 2 4 1', note: 'Dziewiątka na pozycji 4 to pierwsza liczba, która już była (na pozycji 2). Czwórka powtarza się dopiero na pozycji 5.' },
                { input: '3\n1 2 3' },
            ],
            hint: R`Tablica bool bylo[100001] = {}; — ma 100 001 pudełek, bo liczby mogą być od 0 do 100 000. Idź po liczbach po kolei: jeśli bylo[x] jest już true, to jest odpowiedź (możesz przerwać). W przeciwnym razie ustaw bylo[x] = true. Wczytuj liczby w tej samej pętli, w której sprawdzasz.`,
            tests: (r) => {
                const rozne = (n) => r.shuffle(Array.from({ length: n }, (_, i) => i * 4)).slice(0, n);
                return ['8\n4 9 1 9 4 2 4 1', '3\n1 2 3', '1\n0', '2\n100000 100000', arrIn(rozne(6000)), arrIn(r.arr(6000, 0, 100000)), arrIn((() => { const a = rozne(5000); a[4500] = a[3]; return a; })()), arrIn(r.arr(20, 0, 30))];
            },
            solve: (inp) => { const v = nums(inp); const s = new Set(); const t = v.slice(1, 1 + v[0]); for (let i = 0; i < t.length; i++) { if (s.has(t[i])) return `${t[i]} ${i + 1}`; s.add(t[i]); } return 'BRAK'; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    bool bylo[100001] = {};
    int n;
    cin >> n;
    int liczba = -1, pozycja = -1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (bylo[x]) {
            liczba = x;
            pozycja = i + 1;
            break;
        }
        bylo[x] = true;
    }
    if (pozycja == -1) {
        cout << "BRAK\n";
    } else {
        cout << liczba << " " << pozycja << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-sortowanie-zliczanie', krok: 6, level: 'srednie',
            title: 'Uporządkuj wyniki',
            short: 'Wypisz wyniki od najmniejszego do największego — sortowaniem przez zliczanie.',
            tags: ['tablica liczników', 'sortowanie przez zliczanie', 'pętla w pętli'],
            statement: ['Wczytaj n wyników zawodników — liczby całkowite od 0 do 1000 — i wypisz je w jednym wierszu w kolejności od najmniejszego do największego. Użyj tablicy liczników: zadanie da się zrobić bez porównywania liczb między sobą.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n wyników.'],
            output_format: ['Jeden wiersz — wyniki w kolejności niemalejącej.'],
            constraints: ['1 ≤ n ≤ 100 000', '0 ≤ wynik ≤ 1000'],
            examples: [{ input: '8\n42 7 42 0 100 7 7 13' }],
            hint: R`Policz wystąpienia w int ile[1001] = {};. Potem przejdź po wartościach v od 0 do 1000 i każdą wypisz ile[v] razy — wewnętrzną pętlą for (int k = 0; k < ile[v]; k++).`,
            tests: (r) => ['8\n42 7 42 0 100 7 7 13', '1\n5', '3\n1000 0 500', arrIn(r.arr(7000, 0, 1000)), arrIn(r.arr(5000, 0, 3)), arrIn(r.arr(30, 0, 1000))],
            solve: (inp) => { const v = nums(inp); return lin(v.slice(1, 1 + v[0]).sort((a, b) => a - b)); },
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
    for (int v = 0; v <= 1000; v++) {
        for (int k = 0; k < ile[v]; k++) {
            cout << v << " ";
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-wycinanka', krok: 6, level: 'srednie',
            title: 'Wycinanka z gazety',
            short: 'Czy z liter wyciętych z gazety da się ułożyć list? Liczniki liter w górę i w dół.',
            tags: ['ile[26]', 'liczniki w dół', 'TAK / NIE'],
            statement: ['Bajtek chce ułożyć list z liter wyciętych z gazety. Każdą literę z gazety może wyciąć tylko raz — jeśli w gazecie są dwie litery a, to w liście może użyć co najwyżej dwóch. Wczytaj tekst z gazety i treść listu (oba to słowa z małych liter angielskich) i wypisz TAK, jeśli list da się ułożyć, albo NIE. Przy odpowiedzi NIE wypisz w drugim wierszu, ilu liter brakuje w sumie.'],
            input_format: ['W pierwszym wierszu słowo z gazety.', 'W drugim wierszu treść listu.'],
            output_format: ['TAK albo NIE, a przy NIE w drugim wierszu liczba brakujących liter.'],
            constraints: ['Każde słowo ma od 1 do 100 000 liter.'],
            examples: [
                { input: 'abrakadabra\nkabaret', note: 'W gazecie nie ma liter e i t — brakuje 2 liter.' },
                { input: 'programowanie\nmapa' },
            ],
            hint: R`Policz litery gazety w tablicy int ile[26] = {};. Potem idź po literach listu i każdą „wycinaj”: ile[c - 'a']--. Jeśli licznik spadł poniżej zera, tej litery zabrakło — zwiększ licznik braków. Zero braków to odpowiedź TAK.`,
            tests: (r) => ['abrakadabra\nkabaret', 'programowanie\nmapa', 'a\na', 'a\naa', 'abc\nxyz', `${r.word(20000)}\n${r.word(20000)}`, `${r.word(30000, 'abcde')}\n${r.word(5000, 'abcdef')}`, `${r.word(50)}\n${r.word(10)}`],
            solve: (inp) => { const [g, l] = toks(inp); const ile = Array(26).fill(0); for (const c of g) ile[c.charCodeAt(0) - 97]++; let b = 0; for (const c of l) { const k = c.charCodeAt(0) - 97; ile[k]--; if (ile[k] < 0) b++; } return b ? `NIE\n${b}` : 'TAK'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string gazeta, list;
    cin >> gazeta >> list;
    int ile[26] = {};
    for (int i = 0; i < gazeta.length(); i++) {
        ile[gazeta[i] - 'a']++;
    }
    int braki = 0;
    for (int i = 0; i < list.length(); i++) {
        ile[list[i] - 'a']--;
        if (ile[list[i] - 'a'] < 0) {
            braki++;
        }
    }
    if (braki == 0) {
        cout << "TAK\n";
    } else {
        cout << "NIE\n" << braki << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-temperatury', krok: 6, level: 'srednie',
            title: 'Pamiętnik pogody',
            short: 'Temperatury od −50 do 50: najczęstsza, ile różnych i które wystąpiły tylko raz. Liczniki z przesunięciem.',
            tags: ['ile[x + 50]', 'przesunięcie', 'trzy odpowiedzi'],
            statement: ['Wczytaj n dziennych temperatur — liczby całkowite od −50 do 50. Wypisz trzy wiersze: w pierwszym najczęstszą temperaturę (przy remisie najniższą z nich), w drugim liczbę różnych temperatur, a w trzecim, rosnąco, wszystkie temperatury, które wystąpiły dokładnie raz — albo BRAK, jeśli takich nie ma.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n temperatur.'],
            output_format: ['Trzy wiersze opisane w treści.'],
            constraints: ['1 ≤ n ≤ 10 000', '−50 ≤ każda temperatura ≤ 50'],
            examples: [{ input: '7\n-3 2 -3 -12 2 -3 5' }],
            hint: R`Temperatura x trafia do pudełka x + 50, więc wystarczy int ile[101] = {};. Wszystkie trzy odpowiedzi odczytasz z liczników w pętlach po k od 0 do 100 — a temperaturę odzyskasz jako k - 50.`,
            tests: (r) => ['7\n-3 2 -3 -12 2 -3 5', '1\n-50', '2\n50 50', '4\n1 2 3 4', arrIn(r.arr(10000, -50, 50)), arrIn(r.arr(60, -50, 50)), arrIn(r.arr(30, -5, 5))],
            solve: (inp) => {
                const v = nums(inp); const ile = Array(101).fill(0); for (const x of v.slice(1, 1 + v[0])) ile[x + 50]++;
                let naj = 0; for (let k = 1; k <= 100; k++) if (ile[k] > ile[naj]) naj = k;
                const rozne = ile.filter((c) => c > 0).length; const raz = []; for (let k = 0; k <= 100; k++) if (ile[k] === 1) raz.push(k - 50);
                return `${naj - 50}\n${rozne}\n${raz.length ? lin(raz) : 'BRAK'}`;
            },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int ile[101] = {};
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        ile[x + 50]++;
    }
    int naj = 0, rozne = 0, raz = 0;
    for (int k = 0; k <= 100; k++) {
        if (ile[k] > ile[naj]) {
            naj = k;
        }
        if (ile[k] > 0) {
            rozne++;
        }
        if (ile[k] == 1) {
            raz++;
        }
    }
    cout << naj - 50 << "\n" << rozne << "\n";
    for (int k = 0; k <= 100; k++) {
        if (ile[k] == 1) {
            cout << k - 50 << " ";
        }
    }
    if (raz == 0) {
        cout << "BRAK";
    }
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 7 · tablice dwuwymiarowe
        {
            id: 'tab-2d-sumy-wierszy', krok: 7, level: 'latwe',
            title: 'Sumy wierszy',
            short: 'Policz sumę każdego wiersza tabelki i wskaż wiersz z największą sumą.',
            tags: ['t[w][k]', 'dwie pętle', 'zerowanie sumy'],
            statement: ['Wczytaj tabelkę liczb o n wierszach i m kolumnach. Dla każdego wiersza wypisz w osobnym wierszu sumę liczb w tym wierszu. W ostatnim wierszu wypisz numer (od 1) wiersza o największej sumie — przy remisie pierwszego z nich.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m liczb.'],
            output_format: ['n wierszy z sumami i wiersz z numerem najlepszego wiersza.'],
            constraints: ['1 ≤ n, m ≤ 100', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '3 4\n3 1 4 1\n5 9 2 6\n5 3 5 8' }],
            hint: R`Tablica int t[100][100], wczytywanie dwiema pętlami. Dla sum: zewnętrzna pętla po wierszach, a w niej najpierw s = 0, potem wewnętrzna pętla po kolumnach. Suma wiersza zmieści się w int: 100 · 10⁶ = 10⁸.`,
            tests: (r) => ['3 4\n3 1 4 1\n5 9 2 6\n5 3 5 8', '1 1\n-5', tabelka(losTab(r, 100, 100, -1e6, 1e6)), tabelka(losTab(r, 5, 3, -2, 2)), tabelka(losTab(r, 1, 100, 0, 9)), tabelka(losTab(r, 100, 1, -9, 9))],
            solve: (inp) => { const { t } = czytajTab(inp); const s = t.map((w) => w.reduce((a, b) => a + b, 0)); let b = 0; for (let i = 1; i < s.length; i++) if (s[i] > s[b]) b = i; return `${s.join('\n')}\n${b + 1}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[100][100];
    int n, m;
    cin >> n >> m;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            cin >> t[w][k];
        }
    }
    int najW = 0, najS = 0;
    for (int w = 0; w < n; w++) {
        int s = 0;
        for (int k = 0; k < m; k++) {
            s += t[w][k];
        }
        cout << s << "\n";
        if (w == 0 || s > najS) {
            najS = s;
            najW = w;
        }
    }
    cout << najW + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-2d-sumy-kolumn', krok: 7, level: 'latwe',
            title: 'Sumy kolumn',
            short: 'Policz sumę każdej kolumny tabelki — pętle zamienione miejscami.',
            tags: ['pętla po kolumnach', 't[w][k]', 'zamiana pętli'],
            statement: ['Wczytaj tabelkę liczb o n wierszach i m kolumnach i wypisz w jednym wierszu sumy kolejnych kolumn — od pierwszej do ostatniej.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m liczb.'],
            output_format: ['Jeden wiersz z m sumami.'],
            constraints: ['1 ≤ n, m ≤ 100', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '3 4\n3 1 4 1\n5 9 2 6\n5 3 5 8' }],
            hint: R`Zamień pętle miejscami: zewnętrzna po kolumnach k, a w niej s = 0 i wewnętrzna po wierszach w: s += t[w][k];. Po każdej kolumnie wypisz s i spację.`,
            tests: (r) => ['3 4\n3 1 4 1\n5 9 2 6\n5 3 5 8', '1 1\n7', tabelka(losTab(r, 100, 100, -1e6, 1e6)), tabelka(losTab(r, 4, 6, -3, 3)), tabelka(losTab(r, 100, 1, 0, 9)), tabelka(losTab(r, 1, 50, -9, 9))],
            solve: (inp) => { const { n, m, t } = czytajTab(inp); const o = []; for (let k = 0; k < m; k++) { let s = 0; for (let w = 0; w < n; w++) s += t[w][k]; o.push(s); } return lin(o); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[100][100];
    int n, m;
    cin >> n >> m;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            cin >> t[w][k];
        }
    }
    for (int k = 0; k < m; k++) {
        int s = 0;
        for (int w = 0; w < n; w++) {
            s += t[w][k];
        }
        cout << s << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-2d-przekatne', krok: 7, level: 'latwe',
            title: 'Przekątne kwadratu',
            short: 'Zsumuj liczby na obu przekątnych kwadratowej tabelki.',
            tags: ['t[i][i]', 't[i][n - 1 - i]', 'jedna pętla'],
            statement: ['Wczytaj kwadratową tabelkę n × n. Wypisz sumę liczb na głównej przekątnej (od lewego górnego do prawego dolnego rogu) i sumę liczb na drugiej przekątnej (od prawego górnego do lewego dolnego rogu).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W każdym z kolejnych n wierszy n liczb.'],
            output_format: ['Dwie liczby: suma na głównej i na drugiej przekątnej.'],
            constraints: ['1 ≤ n ≤ 100', '−10⁶ ≤ każda liczba ≤ 10⁶'],
            examples: [{ input: '3\n1 2 3\n4 5 6\n7 8 9', note: 'Główna: 1 + 5 + 9 = 15, druga: 3 + 5 + 7 = 15. Środkowa piątka należy do obu przekątnych.' }],
            hint: R`Wczytaj tabelkę dwiema pętlami, a sumy policz jedną pętlą po i: główna przekątna to t[i][i], druga — t[i][n - 1 - i].`,
            tests: (r) => {
                const kw = (n, lo, hi) => { const t = losTab(r, n, n, lo, hi); return `${n}\n${t.map(lin).join('\n')}`; };
                return ['3\n1 2 3\n4 5 6\n7 8 9', '1\n-4', '2\n1 2\n3 4', kw(100, -1e6, 1e6), kw(4, 0, 9), kw(7, -9, 9)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const t = (w, k) => v[1 + w * n + k]; let a = 0, b = 0; for (let i = 0; i < n; i++) { a += t(i, i); b += t(i, n - 1 - i); } return `${a} ${b}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[100][100];
    int n;
    cin >> n;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < n; k++) {
            cin >> t[w][k];
        }
    }
    int glowna = 0, druga = 0;
    for (int i = 0; i < n; i++) {
        glowna += t[i][i];
        druga += t[i][n - 1 - i];
    }
    cout << glowna << " " << druga << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-2d-transpozycja', krok: 7, level: 'latwe',
            title: 'Transpozycja',
            short: 'Wypisz tabelkę „obróconą na bok”: kolumny stają się wierszami.',
            tags: ['zamiana pętli', 'm wierszy wyniku', 't[w][k]'],
            statement: ['Wczytaj tabelkę o n wierszach i m kolumnach i wypisz ją „obróconą na bok”: pierwsza kolumna staje się pierwszym wierszem, druga kolumna drugim wierszem i tak dalej. Wynik ma m wierszy i n kolumn.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m liczb.'],
            output_format: ['m wierszy po n liczb.'],
            constraints: ['1 ≤ n, m ≤ 100', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '2 3\n1 2 3\n4 5 6' }],
            hint: R`Wczytaj normalnie, a przy wypisywaniu zamień pętle: zewnętrzna po kolumnach k (od 0 do m - 1), wewnętrzna po wierszach w — wypisujesz t[w][k], a po każdej kolumnie przejście do nowej linii.`,
            tests: (r) => ['2 3\n1 2 3\n4 5 6', '1 1\n9', '1 4\n1 2 3 4', '4 1\n1\n2\n3\n4', tabelka(losTab(r, 100, 100, 0, 99)), tabelka(losTab(r, 3, 7, -1e9, 1e9))],
            solve: (inp) => { const { n, m, t } = czytajTab(inp); const o = []; for (let k = 0; k < m; k++) { const w = []; for (let i = 0; i < n; i++) w.push(t[i][k]); o.push(lin(w)); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[100][100];
    int n, m;
    cin >> n >> m;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            cin >> t[w][k];
        }
    }
    for (int k = 0; k < m; k++) {
        for (int w = 0; w < n; w++) {
            cout << t[w][k] << " ";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-2d-najwyzszy', krok: 7, level: 'latwe',
            title: 'Najwyższy szczyt na mapie',
            short: 'Znajdź najwyższy punkt mapy wysokości i wypisz jego wiersz i kolumnę.',
            tags: ['maksimum w 2D', 'dwa indeksy', 'kolejność czytania'],
            statement: ['Mapa wysokości to tabelka o n wierszach i m kolumnach. Znajdź najwyższy punkt i wypisz jego wysokość oraz numer wiersza i numer kolumny (od 1). Jeśli najwyższych punktów jest kilka, wybierz ten, który pojawia się pierwszy, gdy czytamy mapę wiersz po wierszu, od lewej do prawej.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m wysokości.'],
            output_format: ['Trzy liczby: wysokość, numer wiersza i numer kolumny.'],
            constraints: ['1 ≤ n, m ≤ 100', '0 ≤ wysokość ≤ 10⁶'],
            examples: [{ input: '3 4\n1 5 2 9\n9 3 0 4\n2 8 9 1', note: 'Wysokość 9 występuje trzy razy — pierwsza przy czytaniu jest w wierszu 1, kolumnie 4.' }],
            hint: R`Zapamiętuj dwa indeksy: bw i bk (na start 0 i 0). Przejdź po całej tabelce i podmieniaj je, gdy t[w][k] > t[bw][bk]. Znak > (a nie >=) zostawi pierwsze wystąpienie.`,
            tests: (r) => ['3 4\n1 5 2 9\n9 3 0 4\n2 8 9 1', '1 1\n0', '2 2\n5 5\n5 5', tabelka(losTab(r, 100, 100, 0, 1e6)), tabelka(losTab(r, 100, 100, 0, 3)), tabelka(losTab(r, 6, 9, 0, 20))],
            solve: (inp) => { const { n, m, t } = czytajTab(inp); let bw = 0, bk = 0; for (let w = 0; w < n; w++) for (let k = 0; k < m; k++) if (t[w][k] > t[bw][bk]) { bw = w; bk = k; } return `${t[bw][bk]} ${bw + 1} ${bk + 1}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[100][100];
    int n, m;
    cin >> n >> m;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            cin >> t[w][k];
        }
    }
    int bw = 0, bk = 0;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (t[w][k] > t[bw][bk]) {
                bw = w;
                bk = k;
            }
        }
    }
    cout << t[bw][bk] << " " << bw + 1 << " " << bk + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-2d-saper', krok: 7, level: 'srednie',
            title: 'Saper',
            short: 'Dla każdego pustego pola policz miny dookoła — z kontrolą brzegów planszy.',
            tags: ['string p[100]', 'ośmiu sąsiadów', 'najpierw brzeg'],
            statement: ['Plansza gry Saper ma n wierszy i m kolumn. Pole z miną oznaczono gwiazdką *, a puste pole kropką. Dla każdego pustego pola policz, ile min leży na sąsiednich polach — sąsiadów jest najwyżej ośmiu: przez bok i po skosie. Wypisz planszę, w której miny zostają gwiazdkami, puste pola z co najmniej jedną miną obok zamieniają się w cyfrę, a puste pola bez min dookoła zostają kropkami.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m znaków: * albo kropka.'],
            output_format: ['n wierszy planszy z cyframi.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '3 4\n*...\n..*.\n....' }],
            hint: R`Wczytaj planszę jako tablicę napisów string p[100]. Dla każdego pustego pola przejdź po przesunięciach dw i dk od −1 do 1 i licz miny — ale najpierw sprawdź, czy sąsiad jest na planszy: nw >= 0 && nw < n && nk >= 0 && nk < m. Liczbę min zamień na znak cyfry: (char)('0' + miny).`,
            tests: (r) => {
                const pl = (n, m, g) => `${n} ${m}\n${Array.from({ length: n }, () => Array.from({ length: m }, () => (r() < g ? '*' : '.')).join('')).join('\n')}`;
                return ['3 4\n*...\n..*.\n....', '1 1\n.', '1 1\n*', '3 3\n***\n*.*\n***', '2 5\n.....\n.....', pl(100, 100, 0.2), pl(20, 30, 0.5), pl(1, 50, 0.3), pl(50, 1, 0.3)];
            },
            solve: (inp) => {
                const t = toks(inp); const n = Number(t[0]), m = Number(t[1]); const p = t.slice(2, 2 + n); const o = [];
                for (let w = 0; w < n; w++) { let s = ''; for (let k = 0; k < m; k++) { if (p[w][k] === '*') { s += '*'; continue; } let c = 0; for (let dw = -1; dw <= 1; dw++) for (let dk = -1; dk <= 1; dk++) { const a = w + dw, b = k + dk; if (a >= 0 && a < n && b >= 0 && b < m && p[a][b] === '*') c++; } s += c ? String(c) : '.'; } o.push(s); }
                return o.join('\n');
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
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (p[w][k] == '*') {
                cout << '*';
                continue;
            }
            int miny = 0;
            for (int dw = -1; dw <= 1; dw++) {
                for (int dk = -1; dk <= 1; dk++) {
                    int nw = w + dw, nk = k + dk;
                    if (nw >= 0 && nw < n && nk >= 0 && nk < m && p[nw][nk] == '*') {
                        miny++;
                    }
                }
            }
            if (miny == 0) {
                cout << '.';
            } else {
                cout << (char)('0' + miny);
            }
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-2d-obrot', krok: 7, level: 'srednie',
            title: 'Obrót o 90 stopni',
            short: 'Wypisz tabelkę obróconą w prawo, zgodnie z ruchem wskazówek zegara.',
            tags: ['kolumna od dołu', 'zamiana pętli', 'm × n'],
            statement: ['Wczytaj tabelkę o n wierszach i m kolumnach i wypisz ją obróconą o 90 stopni w prawo (zgodnie z ruchem wskazówek zegara). Wynik ma m wierszy i n kolumn: pierwszy wiersz wyniku to pierwsza kolumna oryginału czytana od dołu do góry.'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m liczb.'],
            output_format: ['m wierszy po n liczb.'],
            constraints: ['1 ≤ n, m ≤ 100', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '2 3\n1 2 3\n4 5 6', note: 'Pierwsza kolumna (1, 4) czytana od dołu daje pierwszy wiersz: 4 1.' }],
            hint: R`Wiersz numer k wyniku (k od 0 do m - 1) to kolumna k oryginału czytana od ostatniego wiersza do pierwszego: for (int w = n - 1; w >= 0; w--) cout << t[w][k] << " ";.`,
            tests: (r) => ['2 3\n1 2 3\n4 5 6', '1 1\n5', '3 3\n1 2 3\n4 5 6\n7 8 9', '1 4\n1 2 3 4', tabelka(losTab(r, 100, 100, 0, 99)), tabelka(losTab(r, 5, 2, -1e9, 1e9))],
            solve: (inp) => { const { n, m, t } = czytajTab(inp); const o = []; for (let k = 0; k < m; k++) { const w = []; for (let i = n - 1; i >= 0; i--) w.push(t[i][k]); o.push(lin(w)); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int t[100][100];
    int n, m;
    cin >> n >> m;
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            cin >> t[w][k];
        }
    }
    for (int k = 0; k < m; k++) {
        for (int w = n - 1; w >= 0; w--) {
            cout << t[w][k] << " ";
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-2d-kolko-krzyzyk', krok: 7, level: 'srednie',
            title: 'Kółko i krzyżyk',
            short: 'Sprawdź wszystkie wiersze, kolumny i przekątne planszy 3 × 3. Kto wygrał?',
            tags: ['plansza 3 × 3', 'osiem linii', 'p[w][k]'],
            statement: ['Na planszy 3 × 3 rozegrano partię kółka i krzyżyka. Plansza to trzy wiersze po trzy znaki: X, O albo kropka (puste pole). Gracz wygrywa, gdy ma trzy swoje znaki w jednym wierszu, w jednej kolumnie albo na jednej z przekątnych. Wypisz X, jeśli wygrał krzyżyk, O — jeśli wygrało kółko, albo NIKT, jeśli nikt nie ma trzech znaków w linii. Gwarantujemy, że nie wygrali obaj gracze naraz.'],
            input_format: ['Trzy wiersze po trzy znaki.'],
            output_format: ['X, O albo NIKT.'],
            constraints: ['Na planszy są tylko znaki X, O i kropki.'],
            examples: [
                { input: 'XOX\nOXO\nO.X', note: 'Krzyżyk ma całą główną przekątną.' },
                { input: 'XO.\n.O.\nXOX', note: 'Kółko ma środkową kolumnę.' },
                { input: 'XOX\nXOO\nOXX' },
            ],
            hint: R`Wczytaj trzy napisy p[0], p[1], p[2]. Sprawdź osiem linii: trzy wiersze (p[i][0], p[i][1], p[i][2]), trzy kolumny (p[0][k], p[1][k], p[2][k]) i dwie przekątne. Linia jest wygrana, gdy jej trzy znaki są równe i nie są kropką — wtedy zwycięzcą jest ten znak.`,
            check: (inp) => { const p = toks(inp); const lines = []; for (let i = 0; i < 3; i++) { lines.push(p[i]); lines.push(p[0][i] + p[1][i] + p[2][i]); } lines.push(p[0][0] + p[1][1] + p[2][2], p[0][2] + p[1][1] + p[2][0]); const x = lines.includes('XXX'), o = lines.includes('OOO'); return x && o ? 'wygrali obaj' : null; },
            tests: (r) => {
                const plansze = [];
                while (plansze.length < 12) {
                    const p = Array.from({ length: 3 }, () => Array.from({ length: 3 }, () => r.pick(['X', 'O', '.'])).join(''));
                    const lines = []; for (let i = 0; i < 3; i++) { lines.push(p[i]); lines.push(p[0][i] + p[1][i] + p[2][i]); } lines.push(p[0][0] + p[1][1] + p[2][2], p[0][2] + p[1][1] + p[2][0]);
                    if (!(lines.includes('XXX') && lines.includes('OOO'))) plansze.push(p.join('\n'));
                }
                return ['XOX\nOXO\nO.X', 'XO.\n.O.\nXOX', 'XOX\nXOO\nOXX', '...\n...\n...', 'OOO\nX.X\nX..', '..X\n.X.\nXOO', 'X..\nX.O\nXO.', ...plansze];
            },
            solve: (inp) => { const p = toks(inp); const lines = []; for (let i = 0; i < 3; i++) { lines.push(p[i]); lines.push(p[0][i] + p[1][i] + p[2][i]); } lines.push(p[0][0] + p[1][1] + p[2][2], p[0][2] + p[1][1] + p[2][0]); return lines.includes('XXX') ? 'X' : lines.includes('OOO') ? 'O' : 'NIKT'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    string p[3];
    for (int i = 0; i < 3; i++) {
        cin >> p[i];
    }
    char wygral = '.';
    for (int i = 0; i < 3; i++) {
        if (p[i][0] != '.' && p[i][0] == p[i][1] && p[i][1] == p[i][2]) {
            wygral = p[i][0];
        }
        if (p[0][i] != '.' && p[0][i] == p[1][i] && p[1][i] == p[2][i]) {
            wygral = p[0][i];
        }
    }
    if (p[1][1] != '.' && p[0][0] == p[1][1] && p[1][1] == p[2][2]) {
        wygral = p[1][1];
    }
    if (p[1][1] != '.' && p[0][2] == p[1][1] && p[1][1] == p[2][0]) {
        wygral = p[1][1];
    }
    if (wygral == '.') {
        cout << "NIKT\n";
    } else {
        cout << wygral << "\n";
    }
    return 0;
}`,
        },

        // ================================================================ KROK 8 · tablice na olimpiadzie
        {
            id: 'tab-sumy-przedzialow', krok: 8, level: 'srednie',
            title: 'Sumy na przedziałach',
            short: 'Mnóstwo pytań o sumę od a-tej do b-tej liczby — sumy prefiksowe odpowiadają jednym odejmowaniem.',
            tags: ['sumy prefiksowe', 'p[b] − p[a − 1]', 'long long'],
            statement: ['Wczytaj n liczb i q pytań. Każde pytanie to dwie liczby a i b, a odpowiedzią jest suma liczb od a-tej do b-tej włącznie (liczby numerujemy od 1). Liczb i pytań może być bardzo dużo, więc nie licz każdej sumy pętlą — przygotuj sumy prefiksowe.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb.', 'W każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['q wierszy — sumy kolejnych przedziałów.'],
            constraints: ['1 ≤ n, q ≤ 200 000', '−10⁹ ≤ każda liczba ≤ 10⁹', '1 ≤ a ≤ b ≤ n'],
            examples: [{ input: '7 3\n3 1 4 1 5 9 2\n3 5\n1 7\n6 6' }],
            hint: R`Globalnie: int t[200005]; long long p[200005];. Numeruj od 1: p[0] = 0 i p[i] = p[i - 1] + t[i]. Odpowiedź na pytanie to p[b] - p[a - 1]. Sumy muszą być w long long — 200 000 liczb po miliard to 2 · 10¹⁴.`,
            check: (inp) => { const v = nums(inp); const n = v[0], q = v[1]; for (let j = 0; j < q; j++) { const a = v[2 + n + 2 * j], b = v[3 + n + 2 * j]; if (!(a >= 1 && a <= b && b <= n)) return 'złe pytanie'; } return null; },
            tests: (r) => {
                const mk = (n, q, lo, hi) => { const qs = Array.from({ length: q }, () => { const a = r.int(1, n), b = r.int(1, n); return `${Math.min(a, b)} ${Math.max(a, b)}`; }); return `${n} ${q}\n${lin(r.arr(n, lo, hi))}\n${qs.join('\n')}`; };
                return ['7 3\n3 1 4 1 5 9 2\n3 5\n1 7\n6 6', '1 1\n-5\n1 1', mk(3000, 2000, -1e9, 1e9), mk(3000, 3000, 0, 9), mk(10, 20, -10, 10), `5 1\n${lin(Array(5).fill(1e9))}\n1 5`];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], q = v[1]; const p = [0]; for (let i = 0; i < n; i++) p.push(p[i] + v[2 + i]); const o = []; for (let j = 0; j < q; j++) { const a = v[2 + n + 2 * j], b = v[3 + n + 2 * j]; o.push(p[b] - p[a - 1]); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
const int MAX = 200005;
int t[MAX];
long long p[MAX];
int main() {
    int n, q;
    cin >> n >> q;
    for (int i = 1; i <= n; i++) {
        cin >> t[i];
    }
    p[0] = 0;
    for (int i = 1; i <= n; i++) {
        p[i] = p[i - 1] + t[i];
    }
    for (int j = 0; j < q; j++) {
        int a, b;
        cin >> a >> b;
        cout << p[b] - p[a - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-parzyste-w-przedziale', krok: 8, level: 'latwe',
            title: 'Ile parzystych w przedziale',
            short: 'Sumy prefiksowe nie tylko dla sum: c[i] mówi, ile parzystych liczb jest wśród pierwszych i.',
            tags: ['liczniki prefiksowe', 'c[b] − c[a − 1]', 'operator ?:'],
            statement: ['Wczytaj n liczb i q pytań. W każdym pytaniu podane są dwie pozycje a i b, a odpowiedzią jest liczba parzystych liczb wśród liczb od a-tej do b-tej włącznie. Przygotuj tablicę c, w której c[i] mówi, ile parzystych liczb jest wśród pierwszych i liczb — to też suma prefiksowa, tylko za każdą parzystą liczbę dodajemy 1.'],
            input_format: ['W pierwszym wierszu liczby n i q.', 'W drugim wierszu n liczb.', 'W każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ n, q ≤ 200 000', '−10⁹ ≤ każda liczba ≤ 10⁹', '1 ≤ a ≤ b ≤ n'],
            examples: [{ input: '6 3\n5 8 2 7 4 1\n1 6\n2 3\n4 4' }],
            hint: R`c[0] = 0, a dla i od 1 do n: c[i] = c[i - 1] + (x % 2 == 0 ? 1 : 0), gdzie x to i-ta liczba. Odpowiedź to c[b] - c[a - 1]. Samych liczb nie musisz nawet trzymać w tablicy — wystarczy c. Tablicę zrób globalną.`,
            check: (inp) => { const v = nums(inp); const n = v[0], q = v[1]; for (let j = 0; j < q; j++) { const a = v[2 + n + 2 * j], b = v[3 + n + 2 * j]; if (!(a >= 1 && a <= b && b <= n)) return 'złe pytanie'; } return null; },
            tests: (r) => {
                const mk = (n, q, lo, hi) => { const qs = Array.from({ length: q }, () => { const a = r.int(1, n), b = r.int(1, n); return `${Math.min(a, b)} ${Math.max(a, b)}`; }); return `${n} ${q}\n${lin(r.arr(n, lo, hi))}\n${qs.join('\n')}`; };
                return ['6 3\n5 8 2 7 4 1\n1 6\n2 3\n4 4', '1 1\n-3\n1 1', '3 2\n-2 0 2\n1 3\n2 2', mk(3000, 3000, -1e9, 1e9), mk(3000, 3000, 0, 9), mk(15, 20, -5, 5)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0], q = v[1]; const c = [0]; for (let i = 0; i < n; i++) c.push(c[i] + (v[2 + i] % 2 === 0 ? 1 : 0)); const o = []; for (let j = 0; j < q; j++) { const a = v[2 + n + 2 * j], b = v[3 + n + 2 * j]; o.push(c[b] - c[a - 1]); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
const int MAX = 200005;
int c[MAX];
int main() {
    int n, q;
    cin >> n >> q;
    c[0] = 0;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        c[i] = c[i - 1] + (x % 2 == 0 ? 1 : 0);
    }
    for (int j = 0; j < q; j++) {
        int a, b;
        cin >> a >> b;
        cout << c[b] - c[a - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-najlepszy-tydzien', krok: 8, level: 'srednie',
            title: 'Najlepsze k dni sklepu',
            short: 'Znajdź k kolejnych dni z największym utargiem — sumy prefiksowe i maksimum.',
            tags: ['p[i] − p[i − k]', 'maksimum z pozycją', 'long long'],
            statement: ['Sklep zapisywał utarg z każdego z n dni. Znajdź k kolejnych dni, w których łączny utarg był największy. Wypisz ten największy łączny utarg i numer pierwszego z tych k dni (dni numerujemy od 1). Jeśli kilka odcinków daje tyle samo, wybierz najwcześniejszy.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n utargów.'],
            output_format: ['Dwie liczby: największy łączny utarg i numer pierwszego dnia.'],
            constraints: ['1 ≤ k ≤ n ≤ 200 000', '0 ≤ utarg ≤ 10⁹'],
            examples: [{ input: '10 3\n2 0 5 1 1 7 3 0 4 4', note: 'Najwięcej, 11, w dniach 5–7.' }, { input: '5 5\n1 2 3 4 5' }],
            hint: R`Sumy prefiksowe p[i] w long long (tablica globalna). Odcinek k dni kończący się w dniu i ma sumę p[i] - p[i - k]. Sprawdź wszystkie końce i od k do n i zapamiętaj najlepszy — znakiem >, żeby przy remisie został najwcześniejszy.`,
            check: (inp) => { const v = nums(inp); return v[1] >= 1 && v[1] <= v[0] ? null : 'zły k'; },
            tests: (r) => ['10 3\n2 0 5 1 1 7 3 0 4 4', '5 5\n1 2 3 4 5', '1 1\n0', '4 2\n5 5 5 5', `8000 ${r.int(1, 8000)}\n${lin(r.arr(8000, 0, 1e6))}`, `8000 500\n${lin(r.arr(8000, 0, 9))}`,
                `200 7\n${lin(r.arr(200, 0, 1e9))}`, `20 1\n${lin(r.arr(20, 0, 50))}`],
            solve: (inp) => { const v = nums(inp); const n = v[0], k = v[1]; const p = [0n]; for (let i = 0; i < n; i++) p.push(p[i] + BigInt(v[2 + i])); let best = p[k], st = 1; for (let i = k + 1; i <= n; i++) if (p[i] - p[i - k] > best) { best = p[i] - p[i - k]; st = i - k + 1; } return `${best} ${st}`; },
            cpp: R`
#include <iostream>
using namespace std;
const int MAX = 200005;
long long p[MAX];
int main() {
    int n, k;
    cin >> n >> k;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        p[i] = p[i - 1] + x;
    }
    long long naj = p[k];
    int start = 1;
    for (int i = k + 1; i <= n; i++) {
        if (p[i] - p[i - k] > naj) {
            naj = p[i] - p[i - k];
            start = i - k + 1;
        }
    }
    cout << naj << " " << start << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-sito-pierwsze', krok: 8, level: 'latwe',
            title: 'Liczby pierwsze do n',
            short: 'Przesiej liczby sitem Eratostenesa i wypisz wszystkie pierwsze nie większe od n.',
            tags: ['sito Eratostenesa', 'bool zlozona[]', 'wielokrotności'],
            statement: ['Wypisz w jednym wierszu wszystkie liczby pierwsze, które nie są większe od n, w kolejności rosnącej, a w drugim wierszu — ile ich jest. Użyj sita Eratostenesa.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['W pierwszym wierszu liczby pierwsze, w drugim ich liczba.'],
            constraints: ['1 ≤ n ≤ 30 000'],
            examples: [{ input: '30' }, { input: '1', note: 'Nie ma liczb pierwszych nie większych od 1 — pierwszy wiersz jest pusty, a w drugim jest 0.' }],
            hint: R`bool zlozona[30001] — najlepiej globalnie, wtedy na start jest wyzerowana. Dla każdego i od 2 do n: jeśli zlozona[i] jest false, i jest pierwsza — wykreśl jej wielokrotności 2i, 3i, … aż do n. Potem wypisz liczby od 2 do n, które nie zostały wykreślone.`,
            tests: () => ['30', '1', '2', '3', '100', '97', '30000', '29989', '20000', '1000'],
            solve: (inp) => { const n = nums(inp)[0]; const o = []; for (let x = 2; x <= n; x++) if (!Z6[x]) o.push(x); return `${lin(o)}\n${o.length}`; },
            cpp: R`
#include <iostream>
using namespace std;
bool zlozona[30001];
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
    int ile = 0;
    for (int x = 2; x <= n; x++) {
        if (!zlozona[x]) {
            cout << x << " ";
            ile++;
        }
    }
    cout << "\n" << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'tab-sito-zapytania', krok: 8, level: 'srednie',
            title: 'Czy to liczba pierwsza?',
            short: 'Przesiej raz do miliona, a potem na każde z wielu pytań odpowiadaj jednym odczytem.',
            tags: ['sito do 10⁶', 'tablica globalna', '0 i 1'],
            statement: ['Odpowiedz na q pytań: czy liczba x jest pierwsza? Dla każdego pytania wypisz w osobnym wierszu TAK albo NIE. Pytań może być bardzo dużo, więc przygotuj sito Eratostenesa raz, a potem odpowiadaj jednym odczytem z tablicy.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W drugim wierszu q liczb x.'],
            output_format: ['q wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ q ≤ 100 000', '1 ≤ x ≤ 10⁶'],
            examples: [{ input: '5\n1 2 9 97 1000000', note: 'Jedynka nie jest liczbą pierwszą.' }],
            hint: R`Sito do miliona: globalna tablica bool zlozona[1000001];. Pamiętaj, że 0 i 1 nie są pierwsze — sito ich nie wykreśla, więc oznacz je ręcznie (zlozona[0] = zlozona[1] = true) albo sprawdzaj osobno.`,
            tests: (r) => ['5\n1 2 9 97 1000000', '1\n1', '3\n999983 999981 2', arrIn(r.arr(6000, 1, 1e6)), arrIn(Array.from({ length: 100 }, (_, i) => i + 1)), arrIn(r.arr(5000, 1, 100))],
            solve: (inp) => { const v = nums(inp); return v.slice(1, 1 + v[0]).map((x) => (Z6[x] ? 'NIE' : 'TAK')).join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
const int MAX = 1000001;
bool zlozona[MAX];
int main() {
    zlozona[0] = true;
    zlozona[1] = true;
    for (int i = 2; i * i < MAX; i++) {
        if (!zlozona[i]) {
            for (int j = i * i; j < MAX; j += i) {
                zlozona[j] = true;
            }
        }
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int x;
        cin >> x;
        if (zlozona[x]) {
            cout << "NIE\n";
        } else {
            cout << "TAK\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'tab-pierwsze-w-przedziale', krok: 8, level: 'srednie',
            title: 'Liczby pierwsze w przedziałach',
            short: 'Ile liczb pierwszych jest między a i b? Sito plus sumy prefiksowe.',
            tags: ['sito', 'liczniki prefiksowe', 'c[b] − c[a − 1]'],
            statement: ['Odpowiedz na q pytań: ile liczb pierwszych jest w przedziale od a do b włącznie? Połącz dwie sztuczki z lekcji: sito Eratostenesa i sumy prefiksowe.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy dwie liczby a i b.'],
            output_format: ['q wierszy z odpowiedziami.'],
            constraints: ['1 ≤ q ≤ 100 000', '1 ≤ a ≤ b ≤ 10⁶'],
            examples: [{ input: '3\n1 10\n10 20\n14 16', note: 'Do 10: 2, 3, 5, 7. Między 10 a 20: 11, 13, 17, 19. Między 14 a 16 nie ma żadnej.' }],
            hint: R`Po przesianiu policz c[x] — ile liczb pierwszych jest nie większych od x: c[x] = c[x - 1] + (x jest pierwsza ? 1 : 0). Odpowiedź na pytanie to c[b] - c[a - 1]. Obie tablice, sito i c, zrób globalne.`,
            check: (inp) => { const v = nums(inp); for (let j = 0; j < v[0]; j++) { const a = v[1 + 2 * j], b = v[2 + 2 * j]; if (!(a >= 1 && a <= b && b <= 1e6)) return 'zły przedział'; } return null; },
            tests: (r) => {
                const pyt = (q, maxB, maxLen) => `${q}\n${Array.from({ length: q }, () => { const a = r.int(1, maxB); const b = Math.min(maxB, a + r.int(0, maxLen)); return `${a} ${b}`; }).join('\n')}`;
                return ['3\n1 10\n10 20\n14 16', '1\n1 1', '2\n1 1000000\n2 2', pyt(5000, 1e6, 1e6), pyt(2000, 1e6, 100), pyt(30, 100, 30)];
            },
            solve: (inp) => { const v = nums(inp); const c = new Int32Array(1000001); for (let x = 1; x <= 1e6; x++) c[x] = c[x - 1] + (Z6[x] ? 0 : 1); const o = []; for (let j = 0; j < v[0]; j++) { const a = v[1 + 2 * j], b = v[2 + 2 * j]; o.push(c[b] - c[a - 1]); } return o.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
const int MAX = 1000001;
bool zlozona[MAX];
int c[MAX];
int main() {
    zlozona[0] = true;
    zlozona[1] = true;
    for (int i = 2; i < MAX; i++) {
        if (!zlozona[i]) {
            for (int j = 2 * i; j < MAX; j += i) {
                zlozona[j] = true;
            }
        }
    }
    for (int x = 1; x < MAX; x++) {
        c[x] = c[x - 1] + (zlozona[x] ? 0 : 1);
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        int a, b;
        cin >> a >> b;
        cout << c[b] - c[a - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'tab-duze-liczniki', krok: 8, level: 'srednie',
            title: 'Najczęstsza liczba — wersja duża',
            short: 'Liczby do miliona i milion danych: tablica liczników musi być globalna.',
            tags: ['int ile[1000001]', 'tablica globalna', 'remis'],
            statement: ['Wczytaj n liczb całkowitych od 1 do 1 000 000. Wypisz liczbę, która występuje najczęściej, i ile razy wystąpiła — przy remisie najmniejszą z nich. Danych jest tak dużo, że podwójna pętla „każdy z każdym” byłaby za wolna, a tablica liczników na milion pudełek nie zmieści się wewnątrz main.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb.'],
            output_format: ['Dwie liczby: najczęstsza wartość i liczba jej wystąpień.'],
            constraints: ['1 ≤ n ≤ 1 000 000', '1 ≤ każda liczba ≤ 1 000 000'],
            examples: [{ input: '6\n1000000 5 1000000 7 5 1000000' }],
            hint: R`Zrób globalną tablicę int ile[1000001]; — przed main jest wyzerowana i spokojnie mieści się w pamięci (4 MB). Dalej tak samo jak w części 6: zliczanie, a potem szukanie największego licznika od najmniejszej wartości, znakiem >.`,
            tests: (r) => ['6\n1000000 5 1000000 7 5 1000000', '1\n1', '2\n999999 1000000', arrIn(r.arr(5000, 1, 1e6)), arrIn(r.arr(5000, 999000, 1e6)), arrIn(r.arr(5000, 1, 50)), arrIn(r.arr(30, 1, 10))],
            solve: (inp) => { const v = nums(inp); const ile = new Map(); for (const x of v.slice(1, 1 + v[0])) ile.set(x, (ile.get(x) || 0) + 1); let naj = 0, ilen = 0; for (const [x, c] of ile) if (c > ilen || (c === ilen && x < naj)) { naj = x; ilen = c; } return `${naj} ${ilen}`; },
            cpp: R`
#include <iostream>
using namespace std;
const int MAX = 1000001;
int ile[MAX];
int main() {
    for (int v = 0; v < MAX; v++) {   // tylko dla sprawdzarki wzorcówek: wszystkie testy idą w jednym procesie
        ile[v] = 0;
    }
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        ile[x]++;
    }
    int naj = 1;
    for (int v = 2; v < MAX; v++) {
        if (ile[v] > ile[naj]) {
            naj = v;
        }
    }
    cout << naj << " " << ile[naj] << "\n";
    return 0;
}`,
        },
    ];
};
