// Mapy — ćwiczenia w trakcie lekcji, części 1–3: pierwsza mapa (m[k] = v, odczyt, klucze-napisy i klucze-liczby, wartości
// będące parami, łańcuch wskazówek z wykrywaniem pętli), zliczanie (m[x]++, najczęstszy, liczby z całego zakresu, litery,
// hashtagi według liczby wystąpień, częstość częstości, większość w wielu testach, pary anagramów) oraz sprawdzanie klucza
// (count, find, pułapka nawiasów, insert bez nadpisania, erase).
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./input-output-plus-pomoc');
    const { IMIONA, SLOWA, MIASTA, rozrzuc, losy, calk, czyLiczba } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
    // n różnych losowych słów z małych liter
    const rozneSlowa = (r, n, dlMin, dlMax, al) => { const s = new Set(); while (s.size < n) s.add(r.word(r.int(dlMin, dlMax), al)); return [...s]; };
    const zImienia = (w) => w[0].toUpperCase() + w.slice(1);

    return [
        // ================================================================ KROK 1 · pierwsza mapa
        {
            id: 'map-slownik', krok: 1, level: 'latwe',
            title: 'Słowniczek do klasówki',
            short: 'Najpierw pary „słowo — tłumaczenie”, potem zdanie do przetłumaczenia. map<string, string> i odczyt m[slowo].',
            tags: ['map<string, string>', 'm[klucz] = wartość', 'odczyt m[klucz]'],
            statement: ['Ola przygotowuje się do klasówki z języka obcego. Ma słowniczek: n par „słowo w języku polskim — jego tłumaczenie”. Pomóż jej przetłumaczyć zdanie złożone z m polskich słów — każde z nich jest w słowniczku.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: słowo i jego tłumaczenie.', 'Dalej wiersz z m i wiersz z m słowami do przetłumaczenia.'],
            output_format: ['Jeden wiersz: tłumaczenia kolejnych słów, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 1000, 1 ≤ m ≤ 1000', 'Słowa mają od 1 do 12 małych liter; polskie słowa w słowniczku się nie powtarzają.', 'Każde słowo do przetłumaczenia jest w słowniczku.'],
            examples: [{ input: '3\nkot cat\npies dog\nma has\n3\nkot ma pies', note: 'Każde słowo podmieniamy na jego tłumaczenie ze słowniczka: kot → cat, ma → has, pies → dog.' }],
            hint: R`Utwórz map<string, string> slownik; i wczytaj n par: slownik[pl] = tlum;. Potem dla każdego słowa zdania wypisz slownik[slowo] i spację. Mapa znajduje tłumaczenie po samym słowie — bez przeszukiwania listy.`,
            tests: (r) => {
                const d = (P0, Z) => `${P0.length}\n${P0.map(([a, b]) => `${a} ${b}`).join('\n')}\n${Z.length}\n${Z.join(' ')}`;
                const los = (n, m) => { const pl = rozneSlowa(r, n, 1, 12); const P0 = pl.map((w) => [w, r.word(r.int(1, 12))]); return d(P0, Array.from({ length: m }, () => r.pick(pl))); };
                return [d([['a', 'b']], ['a']), d([['x', 'y'], ['y', 'x']], ['y', 'x', 'y']), los(10, 8), los(300, 1000), los(1000, 1000), los(2, 1000)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n';
                const kl = new Set(); for (const l of L.slice(1, n + 1)) { const m = l.match(/^([a-z]{1,12}) ([a-z]{1,12})$/); if (!m || kl.has(m[1])) return 'para'; kl.add(m[1]); }
                const m = Number(L[n + 1]); const Z = (L[n + 2] || '').split(' '); if (!calk(m, 1, 1000) || Z.length !== m || L.length !== n + 3) return 'zdanie';
                return Z.every((w) => kl.has(w)) ? null : 'brak w słowniku';
            },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const s = new Map(L.slice(1, n + 1).map((l) => l.split(' '))); return L[n + 2].split(' ').map((w) => s.get(w)).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, string> slownik;
    for (int i = 0; i < n; i++) {
        string pl, tlum;
        cin >> pl >> tlum;
        slownik[pl] = tlum;
    }
    int m;
    cin >> m;
    for (int i = 0; i < m; i++) {
        string w;
        cin >> w;
        cout << slownik[w] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'map-ostatnie-przypisanie', krok: 1, level: 'latwe',
            title: 'Ostatnie przypisanie wygrywa',
            short: 'Zmienne dostają wartości, czasem kilka razy. Wypisz końcowe wartości, alfabetycznie — mapa sama nadpisze i sama posortuje.',
            tags: ['nadpisywanie wartości', 'for (auto [k, v] : m)', 'klucze alfabetycznie'],
            statement: ['Program zapisuje kolejne przypisania „nazwa wartość”. Ta sama zmienna może dostać wartość wiele razy — liczy się ostatnie przypisanie.',
                'Wypisz końcową wartość każdej zmiennej, w kolejności alfabetycznej nazw, w formacie nazwa = wartosc.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: nazwa zmiennej i liczba całkowita.'],
            output_format: ['Po jednym wierszu na każdą zmienną: nazwa = wartosc — alfabetycznie.'],
            constraints: ['1 ≤ n ≤ 3000', 'Nazwy: od 1 do 8 małych liter; różnych nazw jest najwyżej 500.', '−10⁹ ≤ wartość ≤ 10⁹'],
            examples: [{ input: '5\nx 7\ny 2\nx -1\nsuma 10\ny 2', note: 'x dostało najpierw 7, potem −1 — zostaje −1. Alfabetycznie: suma, x, y.' }],
            hint: R`map<string, long long> m; i dla każdego przypisania m[nazwa] = wartosc; — gdy klucz już jest, wartość zostaje nadpisana, gdy go nie ma — powstaje. Na końcu for (auto [nazwa, w] : m) — mapa podaje klucze alfabetycznie.`,
            tests: (r) => {
                const d = (A) => `${A.length}\n${A.map(([a, b]) => `${a} ${b}`).join('\n')}`;
                const los = (n, k) => { const nz = rozneSlowa(r, k, 1, 8); return d(Array.from({ length: n }, () => [r.pick(nz), r.int(-1000000000, 1000000000)])); };
                return [d([['a', 0]]), d([['b', 1], ['a', 2], ['b', 3], ['a', 4]]), los(20, 5), los(3000, 500), los(3000, 3), d(Array.from({ length: 500 }, (_, i) => [String.fromCharCode(97 + (i % 26)) + 'x'.repeat(Math.floor(i / 26) % 7) + (i >= 182 ? 'z' : ''), i]).filter((p, i, a) => a.findIndex((q) => q[0] === p[0]) === i))];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 3000) || L.length !== n + 1) return 'n'; const s = new Set(); for (const l of L.slice(1)) { const m = l.match(/^([a-z]{1,8}) (-?\d+)$/); if (!m || !calk(Number(m[2]), -1e9, 1e9)) return 'wiersz'; s.add(m[1]); } return s.size <= 500 ? null : 'nazwy'; },
            solve: (inp) => { const m = new Map(); for (const l of linie(inp).slice(1)) { const [a, b] = l.split(' '); m.set(a, b); } return [...m].sort((p, q) => cmp(p[0], q[0])).map(([a, b]) => `${a} = ${b}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, long long> m;
    for (int i = 0; i < n; i++) {
        string nazwa;
        long long w;
        cin >> nazwa >> w;
        m[nazwa] = w;
    }
    for (auto [nazwa, w] : m) cout << nazwa << " = " << w << "\n";
    return 0;
}`,
        },
        {
            id: 'map-rejestr-pojazdow', krok: 1, level: 'latwe',
            title: 'Rejestr pojazdów',
            short: 'Tablica rejestracyjna → właściciel. Najpierw rejestr, potem pytania o tablice. Mapa odpowiada od razu, bez szukania w liście.',
            tags: ['map<string, string>', 'zapytania', 'klucz-napis'],
            statement: ['Wydział komunikacji ma rejestr n pojazdów: tablicę rejestracyjną i imię właściciela. Policjant pyta q razy, czyj jest samochód o danej tablicy. Każda tablica z pytań jest w rejestrze.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: tablica i imię właściciela.', 'Dalej wiersz z q i q wierszy z tablicami.'],
            output_format: ['q wierszy — imiona właścicieli.'],
            constraints: ['1 ≤ n, q ≤ 2000', 'Tablice: od 4 do 8 znaków (wielkie litery i cyfry), różne. Imiona: od 1 do 12 liter.'],
            examples: [{ input: '3\nKR12345 Ola\nWA777 Bartek\nGD9X1 Zuzia\n2\nWA777\nKR12345', note: 'WA777 należy do Bartka, KR12345 — do Oli.' }],
            hint: R`map<string, string> wlasciciel; — kluczem jest tablica, wartością imię. Po wczytaniu rejestru odpowiedź na pytanie to jedno wypisanie: wlasciciel[tablica]. Gdyby trzymać pary w vectorze, każde pytanie wymagałoby przejścia całej listy.`,
            tests: (r) => {
                const tab = () => r.word(r.int(1, 3), 'ABCDEFGHIJKLMNOPRSTUWZ') + r.word(r.int(3, 5), '0123456789ABCX');
                const d = (n, q) => { const T = []; const s = new Set(); while (T.length < n) { const t = tab(); if (t.length >= 4 && t.length <= 8 && !s.has(t)) { s.add(t); T.push(t); } } return `${n}\n${T.map((t) => `${t} ${r.pick(IMIONA)}`).join('\n')}\n${q}\n${Array.from({ length: q }, () => r.pick(T)).join('\n')}`; };
                return ['1\nAB12 Jan\n1\nAB12', d(5, 5), d(100, 300), d(2000, 2000), d(3, 2000)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000)) return 'n'; const s = new Set();
                for (const l of L.slice(1, n + 1)) { const m = l.match(/^([A-Z0-9]{4,8}) ([A-Za-z]{1,12})$/); if (!m || s.has(m[1])) return 'rejestr'; s.add(m[1]); }
                const q = Number(L[n + 1]); if (!calk(q, 1, 2000) || L.length !== n + 2 + q) return 'q'; return L.slice(n + 2).every((t) => s.has(t)) ? null : 'pytanie';
            },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const m = new Map(L.slice(1, n + 1).map((l) => l.split(' '))); return L.slice(n + 2).map((t) => m.get(t)).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, string> wlasciciel;
    for (int i = 0; i < n; i++) {
        string tablica, imie;
        cin >> tablica >> imie;
        wlasciciel[tablica] = imie;
    }
    int q;
    cin >> q;
    while (q--) {
        string tablica;
        cin >> tablica;
        cout << wlasciciel[tablica] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-tablica-z-dziurami', krok: 1, level: 'latwe',
            title: 'Tablica z dziurami',
            short: 'Przypisania t[i] = v z indeksami od −10⁹ do 10⁹. Takiej tablicy nie da się utworzyć — mapa z kluczem int tak.',
            tags: ['map<long long, long long>', 'klucze ujemne i ogromne', 'rosnąco po kluczu'],
            statement: ['Program wykonuje q przypisań t[i] = v na ogromnej tablicy: indeksy sięgają od −10⁹ do 10⁹, więc zwykłej tablicy nie da się utworzyć. Ten sam indeks może dostać wartość kilka razy — liczy się ostatnia.',
                'Wypisz wszystkie indeksy, którym coś przypisano, rosnąco, razem z ich końcowymi wartościami.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q wierszy dwie liczby: i oraz v.'],
            output_format: ['Po jednym wierszu na każdy użyty indeks, rosnąco: i v.'],
            constraints: ['1 ≤ q ≤ 1000', '−10⁹ ≤ i ≤ 10⁹', '−10⁶ ≤ v ≤ 10⁶'],
            examples: [{ input: '4\n1000000000 5\n-3 7\n0 1\n-3 8', note: 'Indeks −3 dostał najpierw 7, potem 8. Indeksy wypisujemy rosnąco: −3, 0, 10⁹.' }],
            hint: R`map<long long, long long> t; i t[i] = v; — kluczem mapy może być dowolna liczba, także ujemna i ogromna, a mapa trzyma tylko te indeksy, których naprawdę użyto. Na końcu for (auto [i, v] : t) przejdzie je rosnąco.`,
            tests: (r) => {
                const d = (A) => `${A.length}\n${A.map(([a, b]) => `${a} ${b}`).join('\n')}`;
                const los = (q, M) => d(Array.from({ length: q }, () => [r.int(-M, M), r.int(-1000000, 1000000)]));
                return [d([[0, 0]]), d([[-1000000000, -1000000], [1000000000, 1000000], [-1000000000, 5]]), los(20, 10), los(1000, 1000000000), los(1000, 50)];
            },
            check: (inp) => { const t = nums(inp); const q = t[0]; if (!calk(q, 1, 1000) || t.length !== 2 * q + 1) return 'q'; for (let i = 0; i < q; i++) if (!calk(t[1 + 2 * i], -1e9, 1e9) || !calk(t[2 + 2 * i], -1e6, 1e6)) return 'zakres'; return null; },
            solve: (inp) => { const t = nums(inp); const m = new Map(); for (let i = 0; i < t[0]; i++) m.set(t[1 + 2 * i], t[2 + 2 * i]); return [...m].sort((a, b) => a[0] - b[0]).map(([a, b]) => `${a} ${b}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    map<long long, long long> t;
    while (q--) {
        long long i, v;
        cin >> i >> v;
        t[i] = v;
    }
    for (auto [i, v] : t) cout << i << " " << v << "\n";
    return 0;
}`,
        },
        {
            id: 'map-kantor', krok: 1, level: 'srednie',
            title: 'Kantor',
            short: 'Tabela kursów: kod waluty → cena w groszach. Policz, ile złotych kosztują wszystkie zakupy walut — z groszami, bez double.',
            tags: ['map<string, long long>', 'grosze', 'Z.GG'],
            statement: ['Kantor ma tabelę kursów: dla każdej waluty — trzyliterowy kod i cenę jednej jednostki w groszach (np. EUR 432 znaczy, że 1 euro kosztuje 4.32 zł).',
                'Klient kupuje waluty n razy: za każdym razem ilość i kod waluty. Ile złotych zapłaci łącznie? Wypisz kwotę w formacie złote, kropka i dokładnie dwie cyfry groszy.'],
            input_format: ['W pierwszym wierszu k.', 'W każdym z k wierszy: kod i cena w groszach.', 'Dalej wiersz z n i n wierszy: ilość i kod.'],
            output_format: ['Jeden wiersz: łączna kwota w formacie Z.GG.'],
            constraints: ['1 ≤ k ≤ 30, 1 ≤ n ≤ 5000', 'Kody: trzy wielkie litery, różne. Ceny: od 1 do 100 000 groszy.', 'Ilości: od 1 do 10⁶; każdy kod z zakupów jest w tabeli.'],
            examples: [{ input: '2\nEUR 432\nUSD 398\n3\n10 EUR\n1 USD\n5 EUR', note: '15 euro po 4.32 zł to 64.80 zł, a 1 dolar to 3.98 zł. Razem 68.78 zł.' }],
            hint: R`map<string, long long> kurs; — kod waluty → cena w groszach. Każdy zakup dolicza ilosc * kurs[kod] groszy do sumy (long long: może wyjść nawet 5 · 10¹⁴). Na końcu wypisz suma / 100, kropkę i suma % 100 przez setw(2) z setfill('0').`,
            tests: (r) => {
                const kody = rozneSlowa(r, 30, 3, 3, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
                const d = (k, n, maxIl) => { const K = kody.slice(0, k).map((c) => [c, r.int(1, 100000)]); return `${k}\n${K.map(([a, b]) => `${a} ${b}`).join('\n')}\n${n}\n${Array.from({ length: n }, () => `${r.int(1, maxIl)} ${r.pick(K)[0]}`).join('\n')}`; };
                return ['1\nPLN 100\n1\n1 PLN', '1\nXYZ 1\n1\n7 XYZ', d(3, 5, 20), d(30, 5000, 1000000), d(10, 300, 999)];
            },
            check: (inp) => {
                const L = linie(inp); const k = Number(L[0]); if (!calk(k, 1, 30)) return 'k'; const s = new Set();
                for (const l of L.slice(1, k + 1)) { const m = l.match(/^([A-Z]{3}) (\d+)$/); if (!m || s.has(m[1]) || !calk(Number(m[2]), 1, 100000)) return 'kurs'; s.add(m[1]); }
                const n = Number(L[k + 1]); if (!calk(n, 1, 5000) || L.length !== k + 2 + n) return 'n';
                return L.slice(k + 2).every((l) => { const m = l.match(/^(\d+) ([A-Z]{3})$/); return m && calk(Number(m[1]), 1, 1e6) && s.has(m[2]); }) ? null : 'zakup';
            },
            solve: (inp) => { const L = linie(inp); const k = Number(L[0]); const m = new Map(L.slice(1, k + 1).map((l) => { const [a, b] = l.split(' '); return [a, Number(b)]; })); let s = 0; for (const l of L.slice(k + 2)) { const [a, b] = l.split(' '); s += Number(a) * m.get(b); } return P.zlote(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    map<string, long long> kurs;
    for (int i = 0; i < k; i++) {
        string kod;
        long long gr;
        cin >> kod >> gr;
        kurs[kod] = gr;
    }
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        long long ile;
        string kod;
        cin >> ile >> kod;
        suma += ile * kurs[kod];
    }
    cout << suma / 100 << "." << setfill('0') << setw(2) << suma % 100 << "\n";
    return 0;
}`,
        },
        {
            id: 'map-podmiana-liter', krok: 1, level: 'srednie',
            title: 'Podmiana liter',
            short: 'Tajny klucz mówi, na co zamienić niektóre litery. map<char, char> i tekst czytany znak po znaku — reszta znaków zostaje.',
            tags: ['map<char, char>', 'count przed odczytem', 'cin.get albo getline'],
            statement: ['Szyfrant ustalił tajny klucz: k par liter „litera → litera, na którą ją zamieniamy”. Zaszyfruj tekst: każdą małą literę, która jest w kluczu, zamień zgodnie z kluczem; wszystkie pozostałe znaki (inne litery, spacje, cyfry, interpunkcja, podział na wiersze) zostają bez zmian.'],
            input_format: ['W pierwszym wierszu k.', 'W każdym z k wierszy dwie litery: a i b (a zamieniamy na b). Litery a się nie powtarzają.', 'Dalej tekst — do końca danych.'],
            output_format: ['Zaszyfrowany tekst (z tym samym podziałem na wiersze).'],
            constraints: ['1 ≤ k ≤ 26', 'Tekst ma od 1 do 20 000 znaków; pierwszy wiersz tekstu nie jest pusty.'],
            examples: [{ input: '3\na o\no a\nk t\nala ma kota\nKot: 2 lata.', note: 'a ↔ o zamieniają się miejscami, k zmienia się w t. Wielkie K nie jest w kluczu, więc zostaje.' }],
            hint: R`map<char, char> klucz;. Tekst czytaj po wczytaniu par — najprościej wiersz po wierszu: cin.ignore(), a potem while (getline(cin, s)). Każdy znak c zamień, tylko jeśli klucz go zna: if (klucz.count(c)) c = klucz[c];. Odczyt klucz[c] bez sprawdzenia dla innych znaków wstawiałby do mapy puste znaki.`,
            tests: (r) => {
                const al = 'abcdefghijklmnopqrstuvwxyz';
                const klucz = (k) => { const a = r.shuffle([...al]).slice(0, k); return a.map((x) => [x, r.pick([...al])]); };
                const tekst = (n) => Array.from({ length: n }, (_, i) => (i && r() < 0.1 ? '' : P.zdanie(r, 1, 10) + (r() < 0.3 ? ` ${r.int(0, 2026)}!` : ''))).join('\n');
                const d = (K, t) => `${K.length}\n${K.map(([a, b]) => `${a} ${b}`).join('\n')}\n${t}`;
                return [d([['a', 'b']], 'a'), d(klucz(26), 'Zazolc gesla jazn.'), d(klucz(5), tekst(6)), d(klucz(26), tekst(300)), d(klucz(13), tekst(400).slice(0, 20000))];
            },
            check: (inp) => {
                const L = linie(inp); const k = Number(L[0]); if (!calk(k, 1, 26)) return 'k'; const s = new Set();
                for (const l of L.slice(1, k + 1)) { const m = l.match(/^([a-z]) ([a-z])$/); if (!m || s.has(m[1])) return 'para'; s.add(m[1]); }
                const T = L.slice(k + 1).join('\n'); return T.length >= 1 && T.length <= 20000 && L[k + 1] !== '' && /^[\x20-\x7e\n]*$/.test(T) ? null : 'tekst';
            },
            solve: (inp) => { const L = linie(inp); const k = Number(L[0]); const m = new Map(L.slice(1, k + 1).map((l) => l.split(' '))); return L.slice(k + 1).map((l) => [...l].map((c) => (m.has(c) ? m.get(c) : c)).join('')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    map<char, char> klucz;
    for (int i = 0; i < k; i++) {
        char a, b;
        cin >> a >> b;
        klucz[a] = b;
    }
    cin.ignore();
    string s;
    while (getline(cin, s)) {
        for (char &c : s)
            if (klucz.count(c)) c = klucz[c];
        cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-trasa-miast', krok: 1, level: 'srednie',
            title: 'Trasa przez miasta',
            short: 'Miasto → para współrzędnych (x, y). Policz długość trasy po ulicach: suma |dx| + |dy| między kolejnymi miastami.',
            tags: ['map<string, pair<int, int>>', 'wartość będąca parą', 'odległość miejska'],
            statement: ['Mapa kraju podaje dla n miast ich współrzędne (x, y). Kurier odwiedza k miast w podanej kolejności. Odległość między dwoma miastami liczymy po ulicach: |x₁ − x₂| + |y₁ − y₂|. Policz łączną długość trasy.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: nazwa miasta i dwie liczby x, y.', 'Dalej wiersz z k i wiersz z k nazwami miast (trasa).'],
            output_format: ['Jedna liczba — długość trasy.'],
            constraints: ['1 ≤ n ≤ 1000, 1 ≤ k ≤ 5000', 'Nazwy: od 1 do 12 liter, różne. −10⁶ ≤ x, y ≤ 10⁶', 'Każde miasto z trasy jest na mapie.'],
            examples: [{ input: '3\nKrakow 0 0\nTarnow 80 -5\nKielce -20 100\n4\nKrakow Tarnow Krakow Kielce', note: 'Krakow → Tarnow: 80 + 5 = 85, z powrotem znowu 85, Krakow → Kielce: 20 + 100 = 120. Razem 290.' }],
            hint: R`map<string, pair<int, int>> gdzie; i gdzie[nazwa] = {x, y};. Idąc po trasie, pamiętaj poprzednie miasto i dodawaj abs(a.first − b.first) + abs(a.second − b.second). Wynik w long long — trasa może mieć 2 · 10¹⁰.`,
            tests: (r) => {
                const d = (n, k, M) => { const nz = rozneSlowa(r, n, 1, 12).map(zImienia); return `${n}\n${nz.map((c) => `${c} ${r.int(-M, M)} ${r.int(-M, M)}`).join('\n')}\n${k}\n${Array.from({ length: k }, () => r.pick(nz)).join(' ')}`; };
                return ['1\nA 5 5\n1\nA', '2\nA -1000000 -1000000\nB 1000000 1000000\n3\nA B A', d(5, 8, 100), d(1000, 5000, 1000000), d(2, 5000, 1000000)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n'; const s = new Set();
                for (const l of L.slice(1, n + 1)) { const m = l.match(/^([A-Za-z]{1,12}) (-?\d+) (-?\d+)$/); if (!m || s.has(m[1]) || !calk(+m[2], -1e6, 1e6) || !calk(+m[3], -1e6, 1e6)) return 'miasto'; s.add(m[1]); }
                const k = Number(L[n + 1]); const T = (L[n + 2] || '').split(' '); return calk(k, 1, 5000) && T.length === k && L.length === n + 3 && T.every((c) => s.has(c)) ? null : 'trasa';
            },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const m = new Map(L.slice(1, n + 1).map((l) => { const [c, x, y] = l.split(' '); return [c, [+x, +y]]; })); const T = L[n + 2].split(' '); let s = 0; for (let i = 1; i < T.length; i++) { const a = m.get(T[i - 1]), b = m.get(T[i]); s += Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]); } return String(s); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, pair<int, int>> gdzie;
    for (int i = 0; i < n; i++) {
        string c;
        int x, y;
        cin >> c >> x >> y;
        gdzie[c] = {x, y};
    }
    int k;
    cin >> k;
    string poprz, c;
    long long dlugosc = 0;
    for (int i = 0; i < k; i++) {
        cin >> c;
        if (i > 0) {
            auto a = gdzie[poprz], b = gdzie[c];
            dlugosc += abs(a.first - b.first) + abs(a.second - b.second);
        }
        poprz = c;
    }
    cout << dlugosc << "\n";
    return 0;
}`,
        },
        {
            id: 'map-wskazowki-dojazdu', krok: 1, level: 'trudne',
            title: 'Wskazówki dojazdu',
            short: 'Każde miasto ma co najwyżej jedno „następne”. Idź od startu, aż drogi zabraknie — albo aż wrócisz do miasta, w którym już byłeś.',
            tags: ['map<string, string>', 'przechodzenie po łańcuchu', 'wykrywanie pętli'],
            statement: ['Nawigacja zna n wskazówek „z miasta A jedź do miasta B”; z każdego miasta wychodzi najwyżej jedna wskazówka. Kierowca startuje w podanym mieście i jedzie zgodnie ze wskazówkami.',
                'Wypisz trasę: kolejne miasta oddzielone napisem „ -> ”. Jeśli dotrze do miasta, z którego nie wychodzi żadna wskazówka, trasa się kończy — w drugim wierszu wypisz KONIEC. Jeśli wskazówka prowadzi do miasta, w którym już był, dopisz je na końcu trasy jeszcze raz i w drugim wierszu wypisz PETLA.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: miasto A i miasto B (A ≠ B).', 'W ostatnim wierszu miasto startowe.'],
            output_format: ['W pierwszym wierszu trasa, w drugim KONIEC albo PETLA.'],
            constraints: ['1 ≤ n ≤ 1000', 'Nazwy: od 1 do 10 liter. Z każdego miasta wychodzi najwyżej jedna wskazówka.'],
            examples: [
                { input: '3\nKrakow Tarnow\nTarnow Rzeszow\nLublin Krakow\nKrakow', note: 'Z Rzeszowa nie wychodzi żadna wskazówka — trasa się kończy.' },
                { input: '3\nA B\nB C\nC A\nB', note: 'Z C wracamy do B, w którym już byliśmy — pętla.' },
            ],
            hint: R`map<string, string> dalej; — z miasta do następnego. Trzymaj set<string> odwiedzone. W pętli: dopisz miasto do trasy i do odwiedzonych; jeśli dalej.count(miasto) == 0 — koniec; jeśli następne jest już odwiedzone — dopisz je i to pętla; inaczej przejdź do następnego.`,
            tests: (r) => {
                const lanc = (n, petla) => {
                    const nz = r.shuffle(rozneSlowa(r, n + 1, 1, 10).map(zImienia)); const E = [];
                    for (let i = 0; i < n; i++) E.push([nz[i], nz[i + 1]]);
                    if (petla) E[n - 1] = [nz[n - 1], nz[r.int(0, n - 2)]];
                    return { E: r.shuffle(E), start: nz[r.int(0, Math.max(0, n - 2))] };
                };
                const d = ({ E, start }) => `${E.length}\n${E.map(([a, b]) => `${a} ${b}`).join('\n')}\n${start}`;
                return ['1\nA B\nB', '1\nA B\nA', '2\nA B\nB A\nA', d(lanc(10, false)), d(lanc(10, true)), d(lanc(1000, false)), d(lanc(1000, true)), d({ E: [['X', 'Y']], start: 'Q' })];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000) || L.length !== n + 2) return 'n'; const s = new Set();
                for (const l of L.slice(1, n + 1)) { const m = l.match(/^([A-Za-z]{1,10}) ([A-Za-z]{1,10})$/); if (!m || m[1] === m[2] || s.has(m[1])) return 'wskazówka'; s.add(m[1]); }
                return /^[A-Za-z]{1,10}$/.test(L[n + 1]) ? null : 'start';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]); const m = new Map(L.slice(1, n + 1).map((l) => l.split(' ')));
                let c = L[n + 1]; const w = new Set(); const t = [];
                while (true) { t.push(c); w.add(c); if (!m.has(c)) return `${t.join(' -> ')}\nKONIEC`; const nx = m.get(c); if (w.has(nx)) return `${[...t, nx].join(' -> ')}\nPETLA`; c = nx; }
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, string> dalej;
    for (int i = 0; i < n; i++) {
        string a, b;
        cin >> a >> b;
        dalej[a] = b;
    }
    string c;
    cin >> c;
    set<string> odwiedzone;
    vector<string> trasa;
    string wynik;
    while (true) {
        trasa.push_back(c);
        odwiedzone.insert(c);
        if (dalej.count(c) == 0) {
            wynik = "KONIEC";
            break;
        }
        string nx = dalej[c];
        if (odwiedzone.count(nx)) {
            trasa.push_back(nx);
            wynik = "PETLA";
            break;
        }
        c = nx;
    }
    for (int i = 0; i < (int)trasa.size(); i++) cout << (i ? " -> " : "") << trasa[i];
    cout << "\n" << wynik << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 2 · zliczanie
        {
            id: 'map-licznik-slow', krok: 2, level: 'latwe',
            title: 'Ile razy każde słowo?',
            short: 'Słowa aż do końca danych. Dla każdego słowa — ile razy wystąpiło, alfabetycznie. Jedna linijka robi wszystko: licznik[s]++.',
            tags: ['licznik[s]++', 'zero na start', 'while (cin >> s)'],
            statement: ['Polonistka chce wiedzieć, których słów uczeń używa najczęściej. Dostajesz tekst wypracowania (same małe litery i białe znaki). Wypisz każde słowo, które w nim wystąpiło, i liczbę jego wystąpień — alfabetycznie.'],
            input_format: ['Słowa oddzielone spacjami i znakami końca wiersza — do końca danych.'],
            output_format: ['Po jednym wierszu na każde różne słowo: słowo i liczba wystąpień — alfabetycznie.'],
            constraints: ['Słów jest od 1 do 10 000, każde ma od 1 do 12 małych liter; różnych słów jest najwyżej 1000.'],
            examples: [{ input: 'ala ma kota\na kot ma ale', note: 'ma występuje dwa razy, pozostałe słowa po razie. „a” stoi przed „ala”, bo jest jego początkiem.' }],
            hint: R`map<string, int> licznik; i w pętli while (cin >> s) po prostu licznik[s]++;. Gdy słowa jeszcze nie ma, licznik[s] samo tworzy je z wartością 0 — a ++ zamienia ją na 1. Na koniec for (auto [s, k] : licznik) wypisze słowa alfabetycznie.`,
            tests: (r) => {
                const pula = SLOWA.filter((w) => /^[a-z]{1,12}$/.test(w));
                return ['kot', 'a a a a', 'ala ma kota\na kot ma ale', rozrzuc(r, Array.from({ length: 50 }, () => r.pick(pula))), rozrzuc(r, Array.from({ length: 6000 }, () => r.pick(pula))),
                    rozrzuc(r, Array.from({ length: 6000 }, () => r.word(r.int(1, 2), 'abcdefghijklmnopqrstuvwxyz')))];
            },
            check: (inp) => { const t = toks(inp); return t.length >= 1 && t.length <= 10000 && t.every((w) => /^[a-z]{1,12}$/.test(w)) && new Set(t).size <= 1000 ? null : 'słowa'; },
            solve: (inp) => { const m = new Map(); for (const w of toks(inp)) m.set(w, (m.get(w) || 0) + 1); return [...m].sort((a, b) => cmp(a[0], b[0])).map(([w, k]) => `${w} ${k}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<string, int> licznik;
    string s;
    while (cin >> s) licznik[s]++;
    for (auto [slowo, ile] : licznik) cout << slowo << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'map-wybory-klasowe', krok: 2, level: 'latwe',
            title: 'Wybory przewodniczącego',
            short: 'Każdy głos to imię kandydata. Kto wygrał i ile miał głosów? Przy remisie — wcześniejszy alfabetycznie.',
            tags: ['zliczanie głosów', 'rekord w mapie', 'remis: > a nie >='],
            statement: ['Klasa wybiera przewodniczącego. Każda kartka zawiera imię jednego kandydata. Wypisz imię zwycięzcy i liczbę jego głosów. Jeśli kilku kandydatów ma tyle samo głosów, wygrywa ten, którego imię jest wcześniej w kolejności alfabetycznej.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n imion.'],
            output_format: ['Jeden wiersz: imię zwycięzcy i liczba głosów.'],
            constraints: ['1 ≤ n ≤ 10 000', 'Imiona: od 1 do 12 liter (wielka pierwsza).'],
            examples: [{ input: '7\nOla Bartek Ola Zuzia Bartek Kuba Zuzia', note: 'Ola, Bartek i Zuzia mają po 2 głosy. Alfabetycznie pierwszy jest Bartek.' }],
            hint: R`Najpierw policz głosy: map<string, int> glosy; glosy[imie]++;. Potem przejdź mapę i szukaj rekordu z warunkiem ile > najlepszy (ostra nierówność). Mapa podaje imiona alfabetycznie, więc przy remisie zostanie wcześniejsze.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d(['Ola']), d(['Zenon', 'Adam']), d(Array.from({ length: 30 }, () => r.pick(IMIONA.slice(0, 5)))), d(Array.from({ length: 10000 }, () => r.pick(IMIONA))), d([...Array(5000).fill('Zuzia'), ...Array(5000).fill('Ala')])];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 10000) && t.length === n + 1 && t.slice(1).every((w) => /^[A-Z][a-z]{0,11}$/.test(w)) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const w of toks(inp).slice(1)) m.set(w, (m.get(w) || 0) + 1); let b = null; for (const [w, k] of [...m].sort((p, q) => cmp(p[0], q[0]))) if (!b || k > b[1]) b = [w, k]; return `${b[0]} ${b[1]}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, int> glosy;
    for (int i = 0; i < n; i++) {
        string imie;
        cin >> imie;
        glosy[imie]++;
    }
    string zwyciezca;
    int najlepszy = 0;
    for (auto [imie, ile] : glosy)
        if (ile > najlepszy) {
            najlepszy = ile;
            zwyciezca = imie;
        }
    cout << zwyciezca << " " << najlepszy << "\n";
    return 0;
}`,
        },
        {
            id: 'map-liczby-z-zakresu', krok: 2, level: 'latwe',
            title: 'Liczby z całego zakresu',
            short: 'Liczby od −10¹⁸ do 10¹⁸ — tablicy liczników nie da się zrobić. map<long long, int> zliczy je i ułoży rosnąco.',
            tags: ['map<long long, int>', 'zliczanie ogromnych liczb', 'rosnąco po kluczu'],
            statement: ['W lekcji o tablicach liczyłeś wystąpienia liczb w tablicy liczników ile[x]. To działa tylko dla małych liczb. Tutaj liczby sięgają od −10¹⁸ do 10¹⁸.',
                'Dla każdej różnej liczby wypisz ją i liczbę jej wystąpień — rosnąco.'],
            input_format: ['W pierwszym wierszu n.', 'W następnych wierszach n liczb całkowitych.'],
            output_format: ['Po jednym wierszu na każdą różną liczbę: liczba i ile razy wystąpiła — rosnąco.'],
            constraints: ['1 ≤ n ≤ 3000', '−10¹⁸ ≤ każda liczba ≤ 10¹⁸; różnych liczb jest najwyżej 1000.'],
            examples: [{ input: '5\n-1000000000000000000 5 1000000000000000000 5 1000000000000000000', note: 'Klucze mapy mogą być ujemne i ogromne — mapa trzyma tylko te, które naprawdę wystąpiły.' }],
            hint: R`map<long long, int> ile; i ile[x]++; dla każdej wczytanej liczby. Kluczem mapy może być dowolna liczba — także −10¹⁸ — a mapa zajmuje tyle pamięci, ile jest różnych liczb, a nie tyle, ile wynosi ich zakres.`,
            tests: (r) => {
                const big = () => r.big(-1000000000000000000n, 1000000000000000000n);
                const d = (a) => `${a.length}\n${rozrzuc(r, a)}`;
                const pula = (k) => Array.from({ length: k }, big);
                return [d(['0']), d(['-1000000000000000000', '5', '1000000000000000000', '5', '1000000000000000000']), d(Array.from({ length: 20 }, () => String(r.int(-5, 5)))),
                    (() => { const p = pula(1000); return d(Array.from({ length: 3000 }, () => String(r.pick(p)))); })(), (() => { const p = pula(3); return d(Array.from({ length: 3000 }, () => String(r.pick(p)))); })()];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 3000) || t.length !== n + 1) return 'n'; const a = t.slice(1); if (!a.every((x) => czyLiczba(x) && BigInt(x) >= -(10n ** 18n) && BigInt(x) <= 10n ** 18n)) return 'zakres'; return new Set(a.map((x) => String(BigInt(x)))).size <= 1000 ? null : 'różne'; },
            solve: (inp) => { const m = new Map(); for (const x of toks(inp).slice(1)) { const k = String(BigInt(x)); m.set(k, (m.get(k) || 0) + 1); } return [...m].sort((a, b) => (BigInt(a[0]) < BigInt(b[0]) ? -1 : 1)).map(([x, k]) => `${x} ${k}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<long long, int> ile;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        ile[x]++;
    }
    for (auto [x, k] : ile) cout << x << " " << k << "\n";
    return 0;
}`,
        },
        {
            id: 'map-litery-tekstu', krok: 2, level: 'srednie',
            title: 'Litery w tekście',
            short: 'Policz litery tekstu bez względu na wielkość. Wypisz tylko te, które wystąpiły, i najczęstszą — map<char, int>.',
            tags: ['map<char, int>', 'tolower', 'najczęstsza z remisem'],
            statement: ['Dostajesz tekst w kilku wierszach. Policz, ile razy występuje każda litera alfabetu angielskiego — wielkie i małe litery liczymy razem (A i a to ta sama litera). Inne znaki pomijamy.',
                'Wypisz litery, które wystąpiły, alfabetycznie (małymi literami) z liczbą wystąpień, a w ostatnim wierszu najczęstszą literę (przy remisie — wcześniejszą w alfabecie).'],
            input_format: ['Tekst — do końca danych. Zawiera co najmniej jedną literę.'],
            output_format: ['Po jednym wierszu na każdą występującą literę: litera i liczba — alfabetycznie.', 'W ostatnim wierszu: najczestsza: litera'],
            constraints: ['Tekst ma od 1 do 30 000 znaków ASCII.'],
            examples: [{ input: 'Ala ma kota.\nKot ma Ale!', note: 'a występuje 6 razy, k i t po 2 razy… Najczęstsza jest a.' }],
            hint: R`map<char, int> ile;. Czytaj znak po znaku (while (cin.get(c))) i dla liter: ile[tolower(c)]++;. Inne znaki pomijaj — nie sięgaj po nie do mapy, bo zrobiłbyś im liczniki. Najczęstszą znajdziesz drugim przejściem z warunkiem >.`,
            tests: (r) => {
                const t = (n) => Array.from({ length: n }, () => P.zdanie(r, 1, 9) + (r() < 0.3 ? ' ' + r.word(r.int(1, 6), 'ABCXYZqwerty') + '!' : '')).join('\n');
                return ['a', 'Zz yY', 'Ala ma kota.\nKot ma Ale!', t(5), t(300), t(800).slice(0, 30000), 'b'.repeat(500) + ' ' + 'A'.repeat(500)];
            },
            check: (inp) => (inp.length >= 1 && inp.length <= 30000 && /^[\x20-\x7e\n]*$/.test(inp) && /[A-Za-z]/.test(inp) ? null : 'tekst'),
            solve: (inp) => {
                const m = new Map(); for (const c of inp) if (/[A-Za-z]/.test(c)) { const l = c.toLowerCase(); m.set(l, (m.get(l) || 0) + 1); }
                const L = [...m].sort((a, b) => cmp(a[0], b[0])); let b = L[0]; for (const x of L) if (x[1] > b[1]) b = x;
                return [...L.map(([l, k]) => `${l} ${k}`), `najczestsza: ${b[0]}`].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<char, int> ile;
    char c;
    while (cin.get(c))
        if (isalpha(c)) ile[tolower(c)]++;
    char najlepsza = ' ';
    int rekord = 0;
    for (auto [l, k] : ile) {
        cout << l << " " << k << "\n";
        if (k > rekord) {
            rekord = k;
            najlepsza = l;
        }
    }
    cout << "najczestsza: " << najlepsza << "\n";
    return 0;
}`,
        },
        {
            id: 'map-hashtagi', krok: 2, level: 'srednie',
            title: 'Popularne hashtagi',
            short: 'Zlicz hashtagi z postów (bez względu na wielkość liter) i wypisz te użyte co najmniej dwa razy — od najpopularniejszego.',
            tags: ['zliczanie w mapie', 'vector par i sort', 'kolejność według liczby'],
            statement: ['Szkolny portal chce pokazać popularne hashtagi. Dostajesz posty — wiersze tekstu złożone ze słów oddzielonych spacjami. Hashtag to słowo zaczynające się od znaku #, a wielkość liter w nim nie ma znaczenia (#OIJ i #oij to ten sam hashtag).',
                'Wypisz hashtagi użyte co najmniej dwa razy, zapisane małymi literami, z liczbą użyć — od najczęstszego; przy równej liczbie użyć alfabetycznie. Jeśli żaden hashtag nie powtórzył się, wypisz BRAK.'],
            input_format: ['Posty — do końca danych.'],
            output_format: ['Wiersze: hashtag i liczba użyć — albo BRAK.'],
            constraints: ['Tekst ma najwyżej 30 000 znaków. Hashtag to # i od 1 do 15 liter lub cyfr.', 'Różnych hashtagów jest najwyżej 500.'],
            examples: [{ input: 'Jade na #OIJ jutro #matma\nkto jeszcze na #oij ?\n#Matma #matma #pilka', note: '#matma pojawia się 3 razy, #oij — 2 razy, #pilka — raz (nie wypisujemy).' }],
            hint: R`Najpierw zliczanie: dla każdego słowa zaczynającego się od # zamień litery na małe (pętla z tolower) i licznik[tag]++. Mapa ułoży hashtagi alfabetycznie, a my chcemy według liczby. Przepisz więc pary (−liczba, tag) do vectora i posortuj — minus da kolejność malejącą, a przy remisie zadecyduje tag.`,
            tests: (r) => {
                const tagi = rozneSlowa(r, 400, 1, 10, 'abcdefghijklmnopqrstuvwxyz0123').map((t) => '#' + t);
                const post = (pul) => Array.from({ length: r.int(2, 10) }, () => (r() < 0.35 ? [...r.pick(pul)].map((c) => (r() < 0.3 ? c.toUpperCase() : c)).join('') : r.pick(SLOWA))).join(' ');
                const d = (n, pul) => Array.from({ length: n }, () => post(pul)).join('\n');
                return ['#a #a', 'bez tagow', 'Jade na #OIJ jutro #matma\nkto jeszcze na #oij ?\n#Matma #matma #pilka', d(10, tagi.slice(0, 5)), d(600, tagi), d(800, tagi.slice(0, 40)).slice(0, 29000).replace(/\S*$/, 'x')];
            },
            check: (inp) => { if (inp.length > 30000 || !/^[\x20-\x7e\n]*$/.test(inp)) return 'tekst'; const t = toks(inp).filter((w) => w[0] === '#'); if (!t.every((w) => /^#[A-Za-z0-9]{1,15}$/.test(w))) return 'tag'; return new Set(t.map((w) => w.toLowerCase())).size <= 500 ? null : 'za dużo'; },
            solve: (inp) => {
                const m = new Map(); for (const w of toks(inp)) if (w[0] === '#') { const k = w.toLowerCase(); m.set(k, (m.get(k) || 0) + 1); }
                const L = [...m].filter(([, k]) => k >= 2).sort((a, b) => b[1] - a[1] || cmp(a[0], b[0]));
                return L.length ? L.map(([t, k]) => `${t} ${k}`).join('\n') : 'BRAK';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<string, int> licznik;
    string w;
    while (cin >> w) {
        if (w[0] != '#') continue;
        for (char &c : w) c = tolower(c);
        licznik[w]++;
    }
    vector<pair<int, string>> lista;
    for (auto [tag, ile] : licznik)
        if (ile >= 2) lista.push_back({-ile, tag});
    sort(lista.begin(), lista.end());
    if (lista.empty()) cout << "BRAK\n";
    for (auto [minus, tag] : lista) cout << tag << " " << -minus << "\n";
    return 0;
}`,
        },
        {
            id: 'map-czestosc-czestosci', krok: 2, level: 'srednie',
            title: 'Ile liczb występuje k razy?',
            short: 'Najpierw zlicz liczby, a potem zlicz same liczniki: ile liczb występuje raz, ile dwa razy… Mapa z mapy.',
            tags: ['dwie mapy', 'zliczanie liczników', 'rosnąco po k'],
            statement: ['Dostajesz n liczb. Dla każdej liczby k, która jest liczbą wystąpień jakiejś wartości, wypisz, ile różnych wartości występuje dokładnie k razy. Wiersze ułóż rosnąco według k.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Wiersze postaci k: m — m różnych wartości występuje dokładnie k razy; rosnąco według k.'],
            constraints: ['1 ≤ n ≤ 8000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '8\n5 7 5 9 7 5 1 2', note: 'Raz występują 9, 1 i 2 (trzy wartości), dwa razy — 7, trzy razy — 5.' }],
            hint: R`Pierwsza mapa: wartość → ile razy (ile[x]++). Druga mapa: liczba wystąpień → ile wartości ją ma — przejdź pierwszą mapę i dla każdej pary zrób czestosc[k]++. Druga mapa sama poda k rosnąco.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                return [d([4]), d([1, 1, 1, 1]), d([5, 7, 5, 9, 7, 5, 1, 2]), d(losy(r, 40, 0, 8)), d(losy(r, 8000, -1000000000, 1000000000)), d(losy(r, 8000, 1, 60)), d(Array.from({ length: 8000 }, (_, i) => Math.floor(Math.sqrt(i))))];
            },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 8000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const x of nums(inp).slice(1)) m.set(x, (m.get(x) || 0) + 1); const c = new Map(); for (const k of m.values()) c.set(k, (c.get(k) || 0) + 1); return [...c].sort((a, b) => a[0] - b[0]).map(([k, v]) => `${k}: ${v}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, int> ile;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        ile[x]++;
    }
    map<int, int> czestosc;
    for (auto [x, k] : ile) czestosc[k]++;
    for (auto [k, m] : czestosc) cout << k << ": " << m << "\n";
    return 0;
}`,
        },
        {
            id: 'map-wiekszosc', krok: 2, level: 'srednie',
            title: 'Większość głosów w każdym teście',
            short: 'W każdym teście sprawdź, czy któraś liczba występuje więcej niż n/2 razy. Nowa mapa w każdym teście.',
            tags: ['wiele testów', 'mapa w środku pętli', 'więcej niż połowa'],
            statement: ['W każdym z t testów dostajesz n liczb. Wypisz liczbę, która występuje w teście więcej niż n/2 razy (czyli ma większość), albo NIE, jeśli takiej nie ma.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test: n, a w następnym wierszu n liczb.'],
            output_format: ['t wierszy: liczba z większością albo NIE.'],
            constraints: ['1 ≤ t ≤ 1000', '1 ≤ n, suma wszystkich n ≤ 9000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n5\n3 1 3 3 2\n4\n7 7 1 1\n1\n-5', note: 'W pierwszym teście 3 występuje 3 razy na 5 — więcej niż połowa. W drugim 7 ma tylko połowę (2 z 4) — to za mało.' }],
            hint: R`Mapę liczników twórz w środku pętli po testach — inaczej liczby z poprzedniego testu przejdą do następnego. Większość ma liczba x, dla której 2 * ile[x] > n (bez dzielenia, więc bez kłopotu z nieparzystym n).`,
            tests: (r) => {
                const d = (T) => `${T.length}\n${T.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`;
                const test = (n) => { if (r() < 0.5) { const x = r.int(-1000000000, 1000000000); const k = Math.floor(n / 2) + 1 + r.int(0, Math.floor(n / 4)); return r.shuffle([...Array(Math.min(n, k)).fill(x), ...losy(r, n - Math.min(n, k), -1000000000, 1000000000)]); } return losy(r, n, -3, 3); };
                return [d([[5]]), d([[1, 2], [2, 2], [1, 2, 1]]), d(Array.from({ length: 30 }, () => test(r.int(1, 9)))), d(Array.from({ length: 1000 }, () => test(r.int(1, 9)))), d([test(8000), ...Array.from({ length: 100 }, () => test(10))]), d([[...Array(4000).fill(7), ...Array(4000).fill(8)]])];
            },
            check: (inp) => { const t = nums(inp); const T = t[0]; if (!calk(T, 1, 1000)) return 't'; let p = 1, s = 0; for (let i = 0; i < T; i++) { const n = t[p]; if (!calk(n, 1, 9000)) return 'n'; s += n; p += n + 1; } return p === t.length && s <= 9000 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const o = []; let p = 1; for (let i = 0; i < t[0]; i++) { const n = t[p]; const m = new Map(); for (const x of t.slice(p + 1, p + 1 + n)) m.set(x, (m.get(x) || 0) + 1); let w = 'NIE'; for (const [x, k] of m) if (2 * k > n) w = String(x); o.push(w); p += n + 1; } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        map<int, int> ile;
        for (int i = 0; i < n; i++) {
            int x;
            cin >> x;
            ile[x]++;
        }
        bool jest = false;
        for (auto [x, k] : ile)
            if (2 * k > n) {
                cout << x << "\n";
                jest = true;
            }
        if (!jest) cout << "NIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-pary-anagramow', krok: 2, level: 'trudne',
            title: 'Pary anagramów',
            short: 'Ile jest par słów, które są anagramami? Kluczem jest słowo z posortowanymi literami — a z k słów w grupie da się zrobić k(k−1)/2 par.',
            tags: ['klucz z posortowanych liter', 'zliczanie grup', 'k · (k − 1) / 2'],
            statement: ['Dwa słowa są anagramami, jeśli składają się z tych samych liter w tej samej liczbie, np. kot i tok albo ala i ala. Dostajesz n słów. Policz, ile jest par (i, j), i < j, takich że słowo i oraz słowo j są anagramami, oraz jak liczna jest największa grupa słów, które są nawzajem swoimi anagramami.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n słów.'],
            output_format: ['W pierwszym wierszu liczba par.', 'W drugim wierszu wielkość największej grupy.'],
            constraints: ['1 ≤ n ≤ 5000', 'Słowa mają od 1 do 10 małych liter.'],
            examples: [{ input: '6\nkot tok ala okt pies kot', note: 'Grupa kot, tok, okt, kot ma 4 słowa — to 4 · 3 / 2 = 6 par. ala i pies są same. Razem 6 par, największa grupa ma 4 słowa.' }],
            hint: R`Słowa są anagramami wtedy i tylko wtedy, gdy po posortowaniu liter dają ten sam napis (kot → kot, tok → kot). Zrób kopię słowa, posortuj jej litery (sort(w.begin(), w.end())) i licz grupy w map<string, long long>. Grupa z k słów daje k · (k − 1) / 2 par.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const pom = (w) => r.shuffle([...w]).join('');
                const baza = (k, dl, al) => rozneSlowa(r, k, dl, dl, al);
                return [d(['a']), d(['ab', 'ba', 'ab']), d(['kot', 'tok', 'ala', 'okt', 'pies', 'kot']), d(Array.from({ length: 50 }, () => r.word(3, 'abc'))),
                    (() => { const B = baza(200, 6, 'abcdefghijklmnop'); return d(Array.from({ length: 5000 }, () => pom(r.pick(B)))); })(), d(Array.from({ length: 5000 }, () => r.word(10))), d(Array(5000).fill('zz'))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 5000) && t.length === n + 1 && t.slice(1).every((w) => /^[a-z]{1,10}$/.test(w)) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const w of toks(inp).slice(1)) { const k = [...w].sort().join(''); m.set(k, (m.get(k) || 0) + 1); } let p = 0, mx = 0; for (const c of m.values()) { p += (c * (c - 1)) / 2; mx = Math.max(mx, c); } return `${p}\n${mx}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, long long> grupa;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        sort(w.begin(), w.end());
        grupa[w]++;
    }
    long long pary = 0, najwieksza = 0;
    for (auto [klucz, k] : grupa) {
        pary += k * (k - 1) / 2;
        najwieksza = max(najwieksza, k);
    }
    cout << pary << "\n" << najwieksza << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 3 · czy klucz jest w mapie
        {
            id: 'map-ksiazka-telefoniczna', krok: 3, level: 'latwe',
            title: 'Książka telefoniczna',
            short: 'Nazwisko → numer. Na pytanie wypisz numer albo BRAK. Do sprawdzania count — nie nawiasy, bo one dopisują brakujące nazwiska.',
            tags: ['count(klucz)', 'BRAK dla nieobecnych', 'pułapka m[klucz]'],
            statement: ['Sekretariat ma książkę telefoniczną: n par „nazwisko numer”. Przychodzi q pytań o nazwiska. Dla każdego wypisz numer telefonu albo BRAK, jeśli takiej osoby nie ma w książce.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: nazwisko i dziewięciocyfrowy numer.', 'Dalej wiersz z q i q wierszy z nazwiskami.'],
            output_format: ['q wierszy: numer albo BRAK.'],
            constraints: ['1 ≤ n, q ≤ 2000', 'Nazwiska: od 1 do 15 liter, różne. Numery: dokładnie 9 cyfr.'],
            examples: [{ input: '2\nNowak 600100200\nLis 512345678\n3\nLis\nKowalski\nNowak', note: 'Kowalskiego nie ma w książce.' }],
            hint: R`map<string, string> ksiazka; — numer trzymamy jako napis (może zaczynać się od zera). Przed odczytem sprawdź: if (ksiazka.count(nazwisko)) — count zwraca 1, gdy klucz jest, i 0, gdy go nie ma, i niczego nie dopisuje. Samo ksiazka[nazwisko] dla brakującej osoby utworzyłoby ją z pustym numerem.`,
            tests: (r) => {
                const nr = () => r.word(9, '0123456789');
                const d = (n, q, pBrak) => { const N = rozneSlowa(r, n + 50, 1, 15).map(zImienia); const W = N.slice(0, n); return `${n}\n${W.map((x) => `${x} ${nr()}`).join('\n')}\n${q}\n${Array.from({ length: q }, () => (r() < pBrak ? r.pick(N.slice(n)) : r.pick(W))).join('\n')}`; };
                return ['1\nA 000000000\n2\nA\nB', d(5, 6, 0.3), d(500, 2000, 0.3), d(2000, 2000, 0.5), d(10, 2000, 0.9)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000)) return 'n'; const s = new Set();
                for (const l of L.slice(1, n + 1)) { const m = l.match(/^([A-Za-z]{1,15}) (\d{9})$/); if (!m || s.has(m[1])) return 'wpis'; s.add(m[1]); }
                const q = Number(L[n + 1]); return calk(q, 1, 2000) && L.length === n + 2 + q && L.slice(n + 2).every((x) => /^[A-Za-z]{1,15}$/.test(x)) ? null : 'pytania';
            },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const m = new Map(L.slice(1, n + 1).map((l) => l.split(' '))); return L.slice(n + 2).map((x) => (m.has(x) ? m.get(x) : 'BRAK')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, string> ksiazka;
    for (int i = 0; i < n; i++) {
        string nazwisko, numer;
        cin >> nazwisko >> numer;
        ksiazka[nazwisko] = numer;
    }
    int q;
    cin >> q;
    while (q--) {
        string nazwisko;
        cin >> nazwisko;
        if (ksiazka.count(nazwisko)) cout << ksiazka[nazwisko] << "\n";
        else cout << "BRAK\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-pierwsze-wystapienie', krok: 3, level: 'latwe',
            title: 'Gdzie pojawiła się pierwszy raz?',
            short: 'Dla każdej liczby wypisz pozycję, na której ta wartość pojawiła się po raz pierwszy. Zapamiętuj pozycję tylko dla nowych wartości.',
            tags: ['insert nie nadpisuje', 'count przed zapisem', 'pozycje od 1'],
            statement: ['Dostajesz n liczb. Dla każdej z nich wypisz numer pozycji (licząc od 1), na której ta sama wartość wystąpiła po raz pierwszy. Dla liczby, która pojawia się pierwszy raz, to jej własna pozycja.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n7 3 7 7 -1 3', note: 'Siódemka pojawiła się pierwszy raz na pozycji 1, trójka na 2, −1 na 5.' }],
            hint: R`map<int, int> pierwsza; — wartość → pozycja pierwszego wystąpienia. Dla każdej liczby: jeśli pierwsza.count(x) == 0, zapisz pierwsza[x] = i. Potem wypisz pierwsza[x]. (To samo zrobi pierwsza.insert({x, i}) — insert nie zmienia wartości, gdy klucz już jest.)`,
            tests: (r) => { const d = (a) => `${a.length}\n${a.join(' ')}`; return [d([5]), d([1, 1, 1]), d([7, 3, 7, 7, -1, 3]), d(losy(r, 30, 0, 9)), d(losy(r, 5000, -1000000000, 1000000000)), d(losy(r, 5000, 1, 100))]; },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 5000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const m = new Map(); return a.map((x, i) => { if (!m.has(x)) m.set(x, i + 1); return m.get(x); }).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, int> pierwsza;
    for (int i = 1; i <= n; i++) {
        int x;
        cin >> x;
        if (pierwsza.count(x) == 0) pierwsza[x] = i;
        cout << pierwsza[x] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'map-karnety-basen', krok: 3, level: 'srednie',
            title: 'Karnety na basen',
            short: 'Numer karnetu → ile wejść zostało. Bramka wpuszcza, odejmuje wejście albo odmawia. find daje dostęp do wartości bez drugiego szukania.',
            tags: ['find i it->second', 'zmiana wartości w mapie', 'trzy odpowiedzi'],
            statement: ['Basen sprzedał n karnetów: każdy ma numer i liczbę wejść. Przy bramce q razy ktoś przykłada karnet. Dla każdego przyłożenia wypisz:',
                'NIEZNANY — gdy karnetu o tym numerze nie ma w systemie;',
                'BRAK WEJSC — gdy karnet istnieje, ale wejścia się skończyły;',
                'OK r — gdy wejście się udało; r to liczba wejść, które zostały po tym wejściu.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: numer karnetu i liczba wejść.', 'Dalej wiersz z q i q wierszy z numerami.'],
            output_format: ['q wierszy z odpowiedziami bramki.'],
            constraints: ['1 ≤ n, q ≤ 2000', 'Numery karnetów: od 1 do 10⁹, różne. Liczba wejść: od 0 do 50.'],
            examples: [{ input: '2\n1001 2\n555 0\n5\n1001\n777\n1001\n1001\n555', note: 'Karnet 1001 wpuszcza dwa razy, za trzecim — brak wejść. 777 nie istnieje, a 555 od początku jest pusty.' }],
            hint: R`map<int, int> wejscia;. Dla każdego przyłożenia: auto it = wejscia.find(numer);. Jeśli it == wejscia.end() — NIEZNANY. Inaczej it->second to liczba wejść: gdy jest 0 — BRAK WEJSC, a w przeciwnym razie it->second-- i wypisz OK z nową wartością. Zmiana przez it->second zmienia wartość w samej mapie.`,
            tests: (r) => {
                const d = (n, q, pObcy, maxW) => { const id = [...new Set(losy(r, n * 2, 1, 1000000000))].slice(0, n); const K = id.map((x) => [x, r.int(0, maxW)]); return `${K.length}\n${K.map(([a, b]) => `${a} ${b}`).join('\n')}\n${q}\n${Array.from({ length: q }, () => (r() < pObcy ? r.int(1, 1000000000) : r.pick(id))).join('\n')}`; };
                return ['1\n5 1\n3\n5\n5\n6', d(5, 12, 0.2, 3), d(300, 2000, 0.2, 10), d(2000, 2000, 0.1, 50), d(3, 2000, 0.05, 50)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000)) return 'n'; const s = new Set();
                for (const l of L.slice(1, n + 1)) { const [a, b] = l.split(' ').map(Number); if (!calk(a, 1, 1e9) || !calk(b, 0, 50) || s.has(a)) return 'karnet'; s.add(a); }
                const q = Number(L[n + 1]); return calk(q, 1, 2000) && L.length === n + 2 + q && L.slice(n + 2).every((x) => calk(Number(x), 1, 1e9)) ? null : 'pytania';
            },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const m = new Map(L.slice(1, n + 1).map((l) => l.split(' ').map(Number))); return L.slice(n + 2).map((x) => { const k = Number(x); if (!m.has(k)) return 'NIEZNANY'; if (m.get(k) === 0) return 'BRAK WEJSC'; m.set(k, m.get(k) - 1); return `OK ${m.get(k)}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, int> wejscia;
    for (int i = 0; i < n; i++) {
        int numer, ile;
        cin >> numer >> ile;
        wejscia[numer] = ile;
    }
    int q;
    cin >> q;
    while (q--) {
        int numer;
        cin >> numer;
        auto it = wejscia.find(numer);
        if (it == wejscia.end()) cout << "NIEZNANY\n";
        else if (it->second == 0) cout << "BRAK WEJSC\n";
        else {
            it->second--;
            cout << "OK " << it->second << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'map-wypozyczalnia-rowerow', krok: 3, level: 'srednie',
            title: 'Wypożyczalnia rowerów',
            short: 'Numer roweru → kto go ma. WYPOZYCZ, ZWROC i KTO, a na końcu lista rowerów, które nie wróciły. erase usuwa zwrócone.',
            tags: ['erase(klucz)', 'polecenia na mapie', 'count przed działaniem'],
            statement: ['Miejska wypożyczalnia zapisuje, kto ma który rower. Polecenia:',
                'WYPOZYCZ r osoba — osoba bierze rower numer r; jeśli rower jest już wypożyczony, wypisz ZAJETY i imię osoby, która go ma (nic się nie zmienia);',
                'ZWROC r — rower wraca; jeśli nie był wypożyczony, wypisz BLAD;',
                'KTO r — wypisz, kto ma rower r, albo WOLNY.',
                'Na końcu wypisz liczbę rowerów, które nie wróciły, a potem te rowery rosnąco z imionami osób, które je mają.'],
            input_format: ['Polecenia, każde w osobnym wierszu — do końca danych.'],
            output_format: ['Odpowiedzi na polecenia (ZAJETY imie, BLAD, imię albo WOLNY), a potem wiersz z liczbą niezwróconych rowerów i te rowery: numer i imię, rosnąco.'],
            constraints: ['Poleceń jest od 1 do 2000.', 'Numery rowerów: od 1 do 10⁶. Imiona: od 1 do 12 liter.'],
            examples: [{ input: 'WYPOZYCZ 7 Ola\nWYPOZYCZ 3 Bartek\nWYPOZYCZ 7 Kuba\nKTO 7\nZWROC 3\nZWROC 3\nKTO 3', note: 'Rower 7 jest zajęty przez Olę. Drugi zwrot roweru 3 to błąd — już wrócił. Na końcu nie wrócił tylko rower 7.' }],
            hint: R`map<int, string> ma; — numer roweru → kto go ma. Wypożyczenie: if (ma.count(r)) wypisz ZAJETY ma[r], inaczej ma[r] = osoba. Zwrot: jeśli ma.count(r) — ma.erase(r), inaczej BLAD. Na końcu ma.size() i pętla po mapie — rowery same będą rosnąco.`,
            tests: (r) => {
                const los = (q, R0) => { const L = []; for (let i = 0; i < q; i++) { const p = r(); const b = r.int(1, R0); L.push(p < 0.45 ? `WYPOZYCZ ${b} ${r.pick(IMIONA)}` : p < 0.75 ? `ZWROC ${b}` : `KTO ${b}`); } return L.join('\n'); };
                return ['KTO 1', 'ZWROC 5', 'WYPOZYCZ 7 Ola\nWYPOZYCZ 3 Bartek\nWYPOZYCZ 7 Kuba\nKTO 7\nZWROC 3\nZWROC 3\nKTO 3', los(30, 5), los(2000, 300), los(2000, 1000000)];
            },
            check: (inp) => { const L = linie(inp); return L.length <= 2000 && L.every((l) => { let m = l.match(/^WYPOZYCZ (\d+) [A-Za-z]{1,12}$/) || l.match(/^(?:ZWROC|KTO) (\d+)$/); return m && calk(Number(m[1]), 1, 1e6); }) ? null : 'polecenie'; },
            solve: (inp) => {
                const m = new Map(); const o = [];
                for (const l of linie(inp)) { const [p, b, k] = l.split(' '); const x = Number(b); if (p === 'WYPOZYCZ') { if (m.has(x)) o.push(`ZAJETY ${m.get(x)}`); else m.set(x, k); } else if (p === 'ZWROC') { if (m.has(x)) m.delete(x); else o.push('BLAD'); } else o.push(m.has(x) ? m.get(x) : 'WOLNY'); }
                o.push(String(m.size)); for (const [b, k] of [...m].sort((a, c) => a[0] - c[0])) o.push(`${b} ${k}`);
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<int, string> ma;
    string p;
    while (cin >> p) {
        int r;
        cin >> r;
        if (p == "WYPOZYCZ") {
            string osoba;
            cin >> osoba;
            if (ma.count(r)) cout << "ZAJETY " << ma[r] << "\n";
            else ma[r] = osoba;
        } else if (p == "ZWROC") {
            if (ma.count(r)) ma.erase(r);
            else cout << "BLAD\n";
        } else {
            if (ma.count(r)) cout << ma[r] << "\n";
            else cout << "WOLNY\n";
        }
    }
    cout << ma.size() << "\n";
    for (auto [r, osoba] : ma) cout << r << " " << osoba << "\n";
    return 0;
}`,
        },
        {
            id: 'map-najblizsze-powtorzenie', krok: 3, level: 'srednie',
            title: 'Najbliższe powtórzenie',
            short: 'Jak blisko siebie stoją dwie równe liczby? Pamiętaj w mapie ostatnią pozycję każdej wartości.',
            tags: ['wartość → ostatnia pozycja', 'count i nadpisywanie', 'najmniejsza odległość'],
            statement: ['Dostajesz n liczb. Znajdź dwie równe liczby, które stoją najbliżej siebie, i wypisz odległość między nimi — różnicę ich pozycji. Jeśli żadna wartość się nie powtarza, wypisz −1.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — najmniejsza odległość albo −1.'],
            constraints: ['1 ≤ n ≤ 8000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n5 1 3 5 3 1 5', note: 'Trójki stoją na pozycjach 3 i 5 — odległość 2. Inne pary równych liczb są dalej od siebie.' }],
            hint: R`map<int, int> ostatnia; — wartość → ostatnia pozycja, na której ją widziałeś. Dla liczby x na pozycji i: jeśli ostatnia.count(x), sprawdź odległość i − ostatnia[x]; potem zapisz ostatnia[x] = i (nadpisz — liczy się najbliższa poprzednia).`,
            tests: (r) => { const d = (a) => `${a.length}\n${a.join(' ')}`; return [d([1]), d([1, 2, 3]), d([5, 1, 3, 5, 3, 1, 5]), d([4, 4]), d(losy(r, 50, 0, 30)), d([...new Set(losy(r, 9000, -1000000000, 1000000000))].slice(0, 8000)), d(losy(r, 8000, 1, 3000)), d([...Array.from({ length: 7998 }, (_, i) => i), 5, 7997])]; },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 8000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const m = new Map(); let b = -1; a.forEach((x, i) => { if (m.has(x)) { const d = i - m.get(x); if (b < 0 || d < b) b = d; } m.set(x, i); }); return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, int> ostatnia;
    int najlepsza = -1;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (ostatnia.count(x)) {
            int d = i - ostatnia[x];
            if (najlepsza == -1 || d < najlepsza) najlepsza = d;
        }
        ostatnia[x] = i;
    }
    cout << najlepsza << "\n";
    return 0;
}`,
        },
        {
            id: 'map-kontrola-wejsc', krok: 3, level: 'srednie',
            title: 'Lista gości na balu',
            short: 'Organizator ma listę gości z numerami stolików. Bramkarz pyta o kolejne osoby. Na końcu: ile osób jest na liście — mapa nie może urosnąć od pytań.',
            tags: ['count kontra m[klucz]', 'mapa nie rośnie od pytań', 'size()'],
            statement: ['Na bal zaproszono gości — lista zawiera n wpisów „imię numer_stolika”; jeśli to samo imię pojawia się kilka razy, liczy się ostatni wpis. Bramkarz pyta q razy o imię osoby przy drzwiach. Dla każdego pytania wypisz numer stolika albo NIE, jeśli osoby nie ma na liście.',
                'Na końcu wypisz, ile różnych osób jest na liście gości. Uwaga: pytania o osoby spoza listy nie mogą zmienić tej liczby.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: imię i numer stolika.', 'Dalej wiersz z q i q wierszy z imionami.'],
            output_format: ['q wierszy: numer stolika albo NIE.', 'W ostatnim wierszu: gosci: liczba różnych osób na liście.'],
            constraints: ['1 ≤ n, q ≤ 2000', 'Imiona: od 1 do 12 liter. Stoliki: od 1 do 100.'],
            examples: [{ input: '3\nOla 4\nBartek 2\nOla 7\n3\nOla\nKuba\nIga', note: 'Ola ma stolik 7 (ostatni wpis). Kuby i Igi nie ma na liście — a mimo pytań o nich gości jest dalej dwoje.' }],
            hint: R`Zapisz listę: map<string, int> stolik; stolik[imie] = nr;. Pytania sprawdzaj przez stolik.count(imie). Gdybyś napisał if (stolik[imie] == 0), mapa dopisałaby każde nieznane imię z zerem — i na końcu stolik.size() byłoby za duże. Wynik końcowy to po prostu stolik.size().`,
            tests: (r) => {
                const d = (n, q) => { const N = rozneSlowa(r, 400, 1, 12).map(zImienia); const lista = Array.from({ length: n }, () => [r.pick(N.slice(0, 200)), r.int(1, 100)]); return `${n}\n${lista.map(([a, b]) => `${a} ${b}`).join('\n')}\n${q}\n${Array.from({ length: q }, () => r.pick(N)).join('\n')}`; };
                return ['1\nA 1\n1\nB', '3\nOla 4\nBartek 2\nOla 7\n3\nOla\nKuba\nIga', d(10, 10), d(2000, 2000), d(1, 2000)];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000)) return 'n'; for (const l of L.slice(1, n + 1)) { const m = l.match(/^[A-Za-z]{1,12} (\d+)$/); if (!m || !calk(Number(m[1]), 1, 100)) return 'wpis'; } const q = Number(L[n + 1]); return calk(q, 1, 2000) && L.length === n + 2 + q && L.slice(n + 2).every((x) => /^[A-Za-z]{1,12}$/.test(x)) ? null : 'pytania'; },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const m = new Map(L.slice(1, n + 1).map((l) => l.split(' '))); return [...L.slice(n + 2).map((x) => (m.has(x) ? m.get(x) : 'NIE')), `gosci: ${m.size}`].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, int> stolik;
    for (int i = 0; i < n; i++) {
        string imie;
        int nr;
        cin >> imie >> nr;
        stolik[imie] = nr;
    }
    int q;
    cin >> q;
    while (q--) {
        string imie;
        cin >> imie;
        if (stolik.count(imie)) cout << stolik[imie] << "\n";
        else cout << "NIE\n";
    }
    cout << "gosci: " << stolik.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'map-para-z-pozycjami', krok: 3, level: 'srednie',
            title: 'Para o sumie k — z pozycjami',
            short: 'Znajdź dwie liczby o sumie k i podaj ich pozycje. Mapa pamięta, gdzie pierwszy raz widziałeś każdą wartość.',
            tags: ['wartość → pozycja', 'szukanie k − x', 'pierwsza para od lewej'],
            statement: ['Dostajesz n liczb i liczbę k. Idąc od lewej, znajdź pierwszą pozycję j, dla której wcześniej (na pozycji i < j) stoi liczba a[i] taka, że a[i] + a[j] = k. Jeśli takich i jest kilka, wybierz najmniejsze. Wypisz i oraz j (licząc od 1) albo BRAK, jeśli takiej pary nie ma.'],
            input_format: ['W pierwszym wierszu n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwie liczby i j albo BRAK.'],
            constraints: ['2 ≤ n ≤ 8000', '−2 · 10⁹ ≤ k ≤ 2 · 10⁹', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6 10\n4 1 6 3 7 6', note: 'Na pozycji 3 stoi 6, a wcześniej, na pozycji 1, stoi 4 — suma 10. Para (4, 7) też ma sumę 10, ale znajdziemy ją dopiero później.' }],
            hint: R`map<long long, int> gdzie; — wartość → pozycja jej pierwszego wystąpienia. Dla każdej liczby x na pozycji j: najpierw zapytaj, czy gdzie.count(k - x) — jeśli tak, wypisz gdzie[k - x] i j i zakończ. Dopiero potem zapamiętaj x — tylko jeśli go jeszcze nie ma (pierwsze wystąpienie). Liczby i k do 10⁹, więc k − x w long long.`,
            tests: (r) => {
                const d = (k, a) => `${a.length} ${k}\n${a.join(' ')}`;
                return [d(2, [1, 1]), d(5, [1, 2]), d(10, [4, 1, 6, 3, 7, 6]), d(0, [5, -5, 5, -5]), d(50, losy(r, 30, 0, 40)), d(2000000000, losy(r, 8000, -1000000000, 999999999)), d(7, losy(r, 8000, -1000, 1000)), d(-2000000000, [...losy(r, 7999, 0, 1000), -1000000000]), d(-2000000000, [-1000000000, ...losy(r, 7998, 0, 1000), -1000000000])];
            },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 2, 8000) && calk(k, -2e9, 2e9) && Math.abs(k) <= 2e9 && t.length === n + 2 && t.slice(2).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const k = t[1], a = t.slice(2); const m = new Map(); for (let j = 0; j < a.length; j++) { if (m.has(k - a[j])) return `${m.get(k - a[j])} ${j + 1}`; if (!m.has(a[j])) m.set(a[j], j + 1); } return 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    map<long long, int> gdzie;
    for (int j = 1; j <= n; j++) {
        long long x;
        cin >> x;
        if (gdzie.count(k - x)) {
            cout << gdzie[k - x] << " " << j << "\n";
            return 0;
        }
        if (gdzie.count(x) == 0) gdzie[x] = j;
    }
    cout << "BRAK\n";
    return 0;
}`,
        },
        {
            id: 'map-rezerwacje-miejsc', krok: 3, level: 'trudne',
            title: 'Rezerwacje miejsc w hali',
            short: 'Miejsce → kto je zarezerwował. Rezerwacja zajętego miejsca, anulowanie cudzej rezerwacji, pytania o miejsca — find, erase i porządek w odpowiedziach.',
            tags: ['find i erase', 'kilka przypadków na polecenie', 'klucze do 10⁹'],
            statement: ['Hala sportowa ma miejsca o numerach od 1 do 10⁹. Polecenia:',
                'REZERWUJ m imie — jeśli miejsce jest wolne, zostaje zarezerwowane dla tej osoby (nic nie wypisujemy); jeśli jest zajęte, wypisz ZAJETE i imię osoby, która je ma;',
                'ANULUJ m imie — jeśli miejsce jest zarezerwowane przez tę osobę, rezerwacja znika (nic nie wypisujemy); w każdym innym przypadku wypisz BLAD;',
                'KTO m — wypisz imię osoby, która ma miejsce, albo WOLNE.'],
            input_format: ['W pierwszym wierszu q.', 'q poleceń, każde w osobnym wierszu.'],
            output_format: ['Wiersze odpowiedzi — tylko tam, gdzie polecenie każe coś wypisać.'],
            constraints: ['1 ≤ q ≤ 1500', 'Numery miejsc: od 1 do 10⁹. Imiona: od 1 do 10 liter.'],
            examples: [{ input: '6\nREZERWUJ 12 Ola\nREZERWUJ 12 Bartek\nANULUJ 12 Bartek\nKTO 12\nANULUJ 12 Ola\nKTO 12', note: 'Bartek nie może zarezerwować zajętego miejsca ani anulować cudzej rezerwacji. Po anulowaniu przez Olę miejsce jest wolne.' }],
            hint: R`map<int, string> miejsce;. Przy każdym poleceniu najpierw auto it = miejsce.find(m);. REZERWUJ: it == end() → miejsce[m] = imie, inaczej ZAJETE it->second. ANULUJ: jeśli it != end() i it->second == imie → miejsce.erase(it), inaczej BLAD. KTO: imię albo WOLNE.`,
            tests: (r) => {
                const d = (P0) => `${P0.length}\n${P0.join('\n')}`;
                const los = (q, M, imiona) => Array.from({ length: q }, () => { const p = r(); const m = r.int(1, M); return p < 0.45 ? `REZERWUJ ${m} ${r.pick(imiona)}` : p < 0.7 ? `ANULUJ ${m} ${r.pick(imiona)}` : `KTO ${m}`; });
                return [d(['KTO 1']), d(['ANULUJ 5 Ola', 'REZERWUJ 1000000000 Ola', 'KTO 1000000000']), d(los(20, 4, ['Ola', 'Ala'])), d(los(1500, 50, IMIONA.filter((x) => x.length <= 10).slice(0, 8))), d(los(1500, 1000000000, ['Ola']))];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 1500) || L.length !== q + 1) return 'q'; return L.slice(1).every((l) => { const m = l.match(/^(?:REZERWUJ|ANULUJ) (\d+) [A-Za-z]{1,10}$/) || l.match(/^KTO (\d+)$/); return m && calk(Number(m[1]), 1, 1e9); }) ? null : 'polecenie'; },
            solve: (inp) => {
                const m = new Map(); const o = [];
                for (const l of linie(inp).slice(1)) { const [p, a, b] = l.split(' '); const x = Number(a); if (p === 'REZERWUJ') { if (m.has(x)) o.push(`ZAJETE ${m.get(x)}`); else m.set(x, b); } else if (p === 'ANULUJ') { if (m.has(x) && m.get(x) === b) m.delete(x); else o.push('BLAD'); } else o.push(m.has(x) ? m.get(x) : 'WOLNE'); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    map<int, string> miejsce;
    while (q--) {
        string p;
        int m;
        cin >> p >> m;
        auto it = miejsce.find(m);
        if (p == "REZERWUJ") {
            string imie;
            cin >> imie;
            if (it == miejsce.end()) miejsce[m] = imie;
            else cout << "ZAJETE " << it->second << "\n";
        } else if (p == "ANULUJ") {
            string imie;
            cin >> imie;
            if (it != miejsce.end() && it->second == imie) miejsce.erase(it);
            else cout << "BLAD\n";
        } else {
            if (it == miejsce.end()) cout << "WOLNE\n";
            else cout << it->second << "\n";
        }
    }
    return 0;
}`,
        },
    ];
};
