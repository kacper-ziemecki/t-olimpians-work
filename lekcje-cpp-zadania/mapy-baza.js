// Mapy — baza zadań na cały temat (krok 9): 10 łatwych, 10 średnich, 8 trudnych, na końcu wielki finał.
// Łatwe: jeden-dwa pomysły (licznik, mapa wpisana w kodzie, rekord przy pierwszym wpisie, klucz-para jak w kalendarzu,
// dwie mapy z kluczem char, grupy w vectorach, własna kolejność kluczy, getline, ostatni wiersz, wielomiany).
// Średnie: dwie mapy w obie strony, postać kanoniczna, substr jako klucz, zdarzenia na dniach, liczniki z erase,
// mapa pól (x, y), interpreter, dwa wskaźniki, prefiksy ścieżek, pary z odejmowaniem.
// Trudne: mapa jako pamięć wyników, lower_bound na napisach, rozkład na czynniki, drzewo w mapie, spotkanie w połowie,
// pary wysokości, indeks odwrócony i finał: baza danych z transakcjami.
module.exports = (h) => {
    const { toks } = h;
    const P = require('./input-output-plus-pomoc');
    const { IMIONA, SLOWA, MIASTA, rozrzuc, losy, calk, czyLiczba, mulmod, dobryGen } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
    const rozneSlowa = (r, n, dlMin, dlMax, al) => { const s = new Set(); while (s.size < n) s.add(r.word(r.int(dlMin, dlMax), al)); return [...s]; };
    const duzeImie = (w) => w[0].toUpperCase() + w.slice(1);
    const losGen = (r, n, m) => `${n} ${r.int(0, m - 1)} ${r.int(1, Math.max(1, m - 1))} ${r.int(0, m - 1)} ${m}`;
    const ranking = (arr) => arr.sort((x, y) => y[1] - x[1] || cmp(x[0], y[0]));
    const IM = IMIONA.filter((x) => /^[A-Za-z]{1,10}$/.test(x));
    const MI = MIASTA.filter((x) => /^[A-Za-z]{1,12}$/.test(x));
    const SL = SLOWA.filter((w) => /^[a-z]{1,10}$/.test(w));
    const CYFRY = ['zero', 'jeden', 'dwa', 'trzy', 'cztery', 'piec', 'szesc', 'siedem', 'osiem', 'dziewiec'];
    const DNI = ['poniedzialek', 'wtorek', 'sroda', 'czwartek', 'piatek', 'sobota', 'niedziela'];
    const DNI_MIES = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    const dd = (x) => String(x).padStart(2, '0');
    const kanon = (s) => { let b = s; for (let k = 1; k < s.length; k++) { const o = s.slice(k) + s.slice(0, k); if (o < b) b = o; } return b; };
    const liczba = (s, lo, hi) => czyLiczba(s) && Number(s) >= lo && Number(s) <= hi;

    return [
        // ================================================================ ŁATWE
        {
            id: 'map-b-dlugosci-slow', krok: 9, level: 'latwe',
            title: 'Długości słów',
            short: 'Ile słów ma 1 znak, ile 2, ile 3…? Mapa długość → liczba słów, a na koniec najczęstsza długość.',
            tags: ['map<int, int>', 'ile[s.size()]++', 'remis — krótsza'],
            statement: ['Dostajesz tekst. Dla każdej długości słowa, która w tekście występuje, wypisz tę długość i liczbę słów o tej długości — od najkrótszych. Na koniec, w osobnym wierszu, wypisz najczęstszą długość (przy remisie — mniejszą).'],
            input_format: ['Słowa (ciągi znaków bez spacji) — do końca danych.'],
            output_format: ['Wiersze „długość liczba” rosnąco według długości, a na końcu wiersz z najczęstszą długością.'],
            constraints: ['Słów jest od 1 do 10 000, każde ma od 1 do 20 znaków; cały tekst ma mniej niż 90 000 znaków.'],
            examples: [{ input: 'Ala ma kota a kot ma Ale', note: 'Jedno słowo ma 1 znak, dwa — 2 znaki, trzy — 3 znaki, jedno — 4 znaki. Najczęstsza długość to 3.' }],
            hint: R`map<int, int> ile; i dla każdego słowa ile[s.size()]++;. Mapa sama ułoży długości rosnąco. Najczęstszą długość znajdziesz w tej samej pętli, która wypisuje mapę: rekord poprawiaj tylko przy >, a wtedy przy remisie zostanie pierwsza, czyli najmniejsza długość.`,
            tests: (r) => { const AL = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,!?-'; const sl = (n, a, b) => Array.from({ length: n }, () => r.word(r.int(a, b), AL)); return ['a', 'ab ab abc', 'Ala ma kota a kot ma Ale', rozrzuc(r, sl(30, 1, 6)), rozrzuc(r, sl(10000, 1, 12)), rozrzuc(r, sl(4000, 1, 20)), rozrzuc(r, Array.from({ length: 5000 }, () => r.pick(['ab', 'cd', 'xyz', 'abcd'])))]; },
            check: (inp) => { const t = toks(inp); return t.length >= 1 && t.length <= 10000 && t.every((w) => w.length <= 20 && /^[\x21-\x7e]+$/.test(w)) && inp.length < 90000 ? null : 'słowa'; },
            solve: (inp) => { const m = new Map(); for (const w of toks(inp)) m.set(w.length, (m.get(w.length) || 0) + 1); const k = [...m.keys()].sort((a, b) => a - b); let best = 0, bk = 0; for (const d of k) if (m.get(d) > bk) { bk = m.get(d); best = d; } return [...k.map((d) => `${d} ${m.get(d)}`), String(best)].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<int, int> ile;
    string s;
    while (cin >> s) ile[s.size()]++;
    int najczestsza = 0, rekord = 0;
    for (auto [d, k] : ile) {
        cout << d << " " << k << "\n";
        if (k > rekord) {
            rekord = k;
            najczestsza = d;
        }
    }
    cout << najczestsza << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-numer-slowami', krok: 9, level: 'latwe',
            title: 'Numer dyktowany słowami',
            short: 'Ktoś dyktuje numer telefonu: „piec zero podwojne siedem…”. Zamień słowa na cyfry — mapę słowo → cyfra wpisz od razu w kodzie.',
            tags: ['mapa wypełniona w kodzie', 'map<string, int> = {{…}, …}', 'podwojne i potrojne'],
            statement: ['Numer telefonu podyktowano słowami: zero, jeden, dwa, trzy, cztery, piec, szesc, siedem, osiem, dziewiec. Czasem dyktujący mówi „podwojne” albo „potrojne” — wtedy następna cyfra powtarza się odpowiednio dwa albo trzy razy.',
                'Wypisz podyktowany numer jako ciąg cyfr.'],
            input_format: ['Słowa w jednym wierszu — do końca danych.'],
            output_format: ['Jeden wiersz: cyfry numeru, bez spacji.'],
            constraints: ['Słów jest od 1 do 5000. Po „podwojne” i „potrojne” zawsze stoi słowo oznaczające cyfrę.'],
            examples: [{ input: 'piec zero podwojne siedem jeden potrojne dwa', note: '5, 0, dwie siódemki, 1 i trzy dwójki.' }],
            hint: R`Mapę możesz wypełnić od razu przy tworzeniu: map<string, int> cyfra = {{"zero", 0}, {"jeden", 1}, {"dwa", 2}, …};. Czytaj słowa po kolei i pamiętaj, ile razy trzeba wypisać następną cyfrę: zwykle 1, po „podwojne” 2, po „potrojne” 3. Po wypisaniu cyfry wróć do 1.`,
            tests: (r) => { const gen = (n, pp) => { const o = []; while (o.length < n) { if (r() < pp && o.length + 2 <= n) o.push(r() < 0.6 ? 'podwojne' : 'potrojne'); o.push(r.pick(CYFRY)); } return o.join(' '); }; return ['zero', 'podwojne zero', 'piec zero podwojne siedem jeden potrojne dwa', 'potrojne dziewiec potrojne dziewiec', gen(20, 0.3), gen(5000, 0.2), gen(5000, 0.5)]; },
            check: (inp) => { const t = toks(inp); if (t.length < 1 || t.length > 5000) return 'liczba słów'; for (let i = 0; i < t.length; i++) { if (t[i] === 'podwojne' || t[i] === 'potrojne') { if (!CYFRY.includes(t[i + 1])) return 'mnożnik'; } else if (!CYFRY.includes(t[i])) return 'słowo'; } return null; },
            solve: (inp) => { let o = '', razy = 1; for (const w of toks(inp)) { if (w === 'podwojne') razy = 2; else if (w === 'potrojne') razy = 3; else { o += String(CYFRY.indexOf(w)).repeat(razy); razy = 1; } } return o; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<string, int> cyfra = {{"zero", 0}, {"jeden", 1}, {"dwa", 2}, {"trzy", 3}, {"cztery", 4},
                              {"piec", 5}, {"szesc", 6}, {"siedem", 7}, {"osiem", 8}, {"dziewiec", 9}};
    string s;
    int razy = 1;
    while (cin >> s) {
        if (s == "podwojne") razy = 2;
        else if (s == "potrojne") razy = 3;
        else {
            for (int i = 0; i < razy; i++) cout << cyfra[s];
            razy = 1;
        }
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-rekordy-zyciowe', krok: 9, level: 'latwe',
            title: 'Rekordy życiowe',
            short: 'Biegacze startują po kilka razy. Dla każdego: liczba biegów i najlepszy (najmniejszy) czas. Zero z nawiasów tu nie pomoże — pierwszy bieg trzeba wpisać osobno.',
            tags: ['dwie mapy', 'count przy pierwszym wpisie', 'minimum w wartości'],
            statement: ['Na treningach zapisano n biegów na 100 m: imię biegacza i czas w setnych sekundy (1250 oznacza 12,50 s). Dla każdego biegacza (alfabetycznie) wypisz imię, liczbę jego biegów i najlepszy, czyli najmniejszy, czas.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię i czas.'],
            output_format: ['Wiersze „imię biegi najlepszy” — alfabetycznie.'],
            constraints: ['1 ≤ n ≤ 5000', 'Czasy: od 900 do 3000. Imiona: od 1 do 12 liter; biegaczy jest najwyżej 300.'],
            examples: [{ input: '5\nOla 1432\nJan 1298\nOla 1401\nOla 1455\nJan 1310', note: 'Ola biegła trzy razy, najlepiej w 14,01 s. Jan — dwa razy, najlepiej w 12,98 s.' }],
            hint: R`Trzymaj map<string, int> biegi; i map<string, int> najlepszy;. Najlepszy czas to najmniejszy, więc nie możesz liczyć na zero z nawiasów — zero byłoby „rekordem” lepszym od każdego biegu. Przy pierwszym biegu zawodnika (najlepszy.count(imie) == 0) wpisz czas od razu, a później — tylko wtedy, gdy jest mniejszy.`,
            tests: (r) => { const gen = (n, k) => { const g = k <= IM.length ? r.shuffle(IM).slice(0, k) : rozneSlowa(r, k, 3, 10).map(duzeImie); return `${n}\n${Array.from({ length: n }, () => `${r.pick(g)} ${r.int(900, 3000)}`).join('\n')}`; }; return ['1\nOla 1500', '3\nOla 1500\nOla 900\nOla 3000', '5\nOla 1432\nJan 1298\nOla 1401\nOla 1455\nJan 1310', gen(20, 4), gen(5000, 300), gen(5000, 30)]; },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 5000) || L.length !== n + 1) return 'n'; const im = new Set(); for (let i = 1; i <= n; i++) { const w = L[i].trim().split(/\s+/); if (w.length !== 2 || !/^[A-Za-z]{1,12}$/.test(w[0]) || !liczba(w[1], 900, 3000)) return `wiersz ${i}`; im.add(w[0]); } return im.size <= 300 ? null : 'biegacze'; },
            solve: (inp) => { const L = linie(inp); const m = new Map(); for (const s of L.slice(1)) { const [a, b] = s.trim().split(/\s+/); const c = Number(b); const v = m.get(a); if (!v) m.set(a, [1, c]); else { v[0]++; v[1] = Math.min(v[1], c); } } return [...m.keys()].sort(cmp).map((a) => `${a} ${m.get(a)[0]} ${m.get(a)[1]}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, int> biegi, najlepszy;
    for (int i = 0; i < n; i++) {
        string imie;
        int czas;
        cin >> imie >> czas;
        biegi[imie]++;
        if (najlepszy.count(imie) == 0 || czas < najlepszy[imie]) najlepszy[imie] = czas;
    }
    for (auto [imie, k] : biegi) cout << imie << " " << k << " " << najlepszy[imie] << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-urodziny', krok: 9, level: 'latwe',
            title: 'Urodziny w klasie',
            short: 'Daty urodzin „DD.MM”. W które dni urodziło się kilka osób? Klucz-para (miesiąc, dzień) ułoży daty jak w kalendarzu — napis „DD.MM” by tego nie zrobił.',
            tags: ['klucz-para (miesiąc, dzień)', 'kolejność jak w kalendarzu', 'odczyt z kropką'],
            statement: ['Zebrano daty urodzin n uczniów w postaci DD.MM. Wypisz wszystkie daty, w które urodziło się co najmniej dwoje uczniów — w kolejności kalendarzowej (od stycznia), każdą w postaci DD.MM z liczbą osób. Jeśli takich dat nie ma, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n dat DD.MM oddzielonych spacjami.'],
            output_format: ['Wiersze „DD.MM liczba” w kolejności kalendarzowej albo BRAK.'],
            constraints: ['1 ≤ n ≤ 5000', 'Daty są poprawne (może się zdarzyć 29.02).'],
            examples: [{ input: '6\n15.03 01.12 15.03 07.01 01.12 15.03', note: 'Gdyby kluczem był napis, 01.12 stanęłoby przed 15.03. W kalendarzu marzec jest przed grudniem.' }],
            hint: R`Datę wczytaj jako dwie liczby i kropkę: int d, m; char kropka; cin >> d >> kropka >> m;. Kluczem niech będzie para {m, d} — pary porównują się najpierw po miesiącu, potem po dniu, czyli dokładnie jak w kalendarzu. Przy wypisywaniu dopisz zero przed jednocyfrowym dniem i miesiącem: setw(2) << setfill('0').`,
            tests: (r) => { const data = () => { const m = r.int(1, 12); return `${dd(r.int(1, DNI_MIES[m - 1]))}.${dd(m)}`; }; const gen = (n) => `${n}\n${Array.from({ length: n }, data).join(' ')}`; return ['1\n29.02', '2\n01.01 01.01', '3\n31.12 01.01 15.06', '6\n15.03 01.12 15.03 07.01 01.12 15.03', gen(30), gen(400), gen(5000), `5000\n${Array.from({ length: 5000 }, () => r.pick(['29.02', '01.01', '31.12', '09.10'])).join(' ')}`]; },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); if (!calk(n, 1, 5000) || t.length !== n + 1) return 'n'; return t.slice(1).every((x) => { const g = /^(\d\d)\.(\d\d)$/.exec(x); if (!g) return false; const d = Number(g[1]), m = Number(g[2]); return m >= 1 && m <= 12 && d >= 1 && d <= DNI_MIES[m - 1]; }) ? null : 'data'; },
            solve: (inp) => { const c = new Map(); for (const x of toks(inp).slice(1)) { const [d, m] = x.split('.').map(Number); const k = m * 100 + d; c.set(k, (c.get(k) || 0) + 1); } const w = [...c.keys()].sort((a, b) => a - b).filter((k) => c.get(k) >= 2).map((k) => `${dd(k % 100)}.${dd(Math.floor(k / 100))} ${c.get(k)}`); return w.length ? w.join('\n') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<pair<int, int>, int> ile;
    for (int i = 0; i < n; i++) {
        int d, m;
        char kropka;
        cin >> d >> kropka >> m;
        ile[{m, d}]++;
    }
    bool byly = false;
    for (auto [data, k] : ile)
        if (k >= 2) {
            cout << setw(2) << setfill('0') << data.second << "." << setw(2) << setfill('0') << data.first << " " << k << "\n";
            byly = true;
        }
    if (!byly) cout << "BRAK\n";
    return 0;
}`,
        },
        {
            id: 'map-b-pierwsza-litera', krok: 9, level: 'latwe',
            title: 'Na tę samą literę',
            short: 'Dla każdej litery, od której zaczyna się jakieś słowo: ile jest takich słów i które z nich jest najdłuższe. Dwie mapy z kluczem char.',
            tags: ['map<char, …>', 'dwie mapy, ten sam klucz', 'remis — wcześniejsze alfabetycznie'],
            statement: ['Dostajesz tekst z małych liter. Dla każdej litery, od której zaczyna się co najmniej jedno słowo, wypisz (w kolejności alfabetu): tę literę, liczbę słów zaczynających się od niej (powtórzenia też się liczą) i najdłuższe z tych słów. Przy remisie długości wybierz słowo wcześniejsze alfabetycznie.'],
            input_format: ['Słowa — do końca danych.'],
            output_format: ['Wiersze „litera liczba najdłuższe”.'],
            constraints: ['Słów jest od 1 do 10 000, każde ma od 1 do 15 małych liter.'],
            examples: [{ input: 'kot ala kotlet as ananas arbuz kura', note: 'Na a zaczynają się cztery słowa, najdłuższe to ananas. Na k — trzy, najdłuższe to kotlet.' }],
            hint: R`map<char, int> ile; i map<char, string> najdluzsze;, a kluczem jest s[0]. Słowo zastępuje dotychczasowe najdłuższe, gdy jest dłuższe albo tak samo długie i wcześniejsze alfabetycznie. Przy pierwszym słowie na daną literę najdluzsze[c] to pusty napis — każde słowo jest od niego dłuższe, więc nie trzeba niczego sprawdzać osobno.`,
            tests: (r) => ['a', 'kot ala kotlet as ananas arbuz kura', 'bb aa ab ba', rozrzuc(r, Array.from({ length: 60 }, () => r.pick(SL))), rozrzuc(r, Array.from({ length: 10000 }, () => r.word(r.int(1, 7)))), rozrzuc(r, Array.from({ length: 8000 }, () => r.word(r.int(1, 15), 'abc')))],
            check: (inp) => { const t = toks(inp); return t.length >= 1 && t.length <= 10000 && t.every((w) => /^[a-z]{1,15}$/.test(w)) ? null : 'słowa'; },
            solve: (inp) => { const m = new Map(); for (const s of toks(inp)) { const v = m.get(s[0]) || [0, '']; v[0]++; if (s.length > v[1].length || (s.length === v[1].length && s < v[1])) v[1] = s; m.set(s[0], v); } return [...m.keys()].sort(cmp).map((c) => `${c} ${m.get(c)[0]} ${m.get(c)[1]}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<char, int> ile;
    map<char, string> najdluzsze;
    string s;
    while (cin >> s) {
        char c = s[0];
        ile[c]++;
        string &naj = najdluzsze[c];
        if (s.size() > naj.size() || (s.size() == naj.size() && s < naj)) naj = s;
    }
    for (auto [c, k] : ile) cout << c << " " << k << " " << najdluzsze[c] << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-suma-cyfr', krok: 9, level: 'latwe',
            title: 'Ta sama suma cyfr',
            short: 'Pogrupuj liczby według sumy cyfr. map<int, vector<int>> — klucz to suma cyfr, wartość to lista liczb w kolejności z wejścia.',
            tags: ['map<int, vector<int>>', 'suma cyfr jako klucz', 'grupy rosnąco'],
            statement: ['Dostajesz n liczb naturalnych. Pogrupuj je według sumy cyfr. Dla każdej sumy cyfr, która się pojawia (rosnąco), wypisz w jednym wierszu: sumę, dwukropek i liczby z tej grupy w kolejności z wejścia.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb.'],
            output_format: ['Wiersze „suma: liczby”.'],
            constraints: ['1 ≤ n ≤ 2000', '0 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n12 30 111 7 5 1000000', note: 'Liczby 12, 30 i 111 mają sumę cyfr 3, a milion — sumę 1.' }],
            hint: R`Sumę cyfr liczby x policzysz pętlą: while (y > 0) { s += y % 10; y /= 10; } — rób to na kopii y = x, bo samą liczbę trzeba potem dopisać do grupy: grupy[s].push_back(x);. Mapa ułoży sumy rosnąco, a każdy vector zachowa kolejność z wejścia.`,
            tests: (r) => { const d = (a) => `${a.length}\n${a.join(' ')}`; return [d([0]), d([12, 30, 111, 7, 5, 1000000]), d(losy(r, 30, 0, 100)), d(losy(r, 2000, 0, 1000000000)), d(losy(r, 2000, 0, 999)), d(Array.from({ length: 2000 }, () => 10 ** r.int(0, 9)))]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; return calk(n, 1, 2000) && t.length === n + 1 && t.slice(1).every((x) => calk(x, 0, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const g = new Map(); for (const x of nums(inp).slice(1)) { let s = 0, y = x; while (y > 0) { s += y % 10; y = Math.floor(y / 10); } if (!g.has(s)) g.set(s, []); g.get(s).push(x); } return [...g.keys()].sort((a, b) => a - b).map((s) => `${s}:${g.get(s).map((x) => ` ${x}`).join('')}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, vector<int>> grupy;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        int s = 0, y = x;
        while (y > 0) {
            s += y % 10;
            y /= 10;
        }
        grupy[s].push_back(x);
    }
    for (auto &[s, v] : grupy) {
        cout << s << ":";
        for (int x : v) cout << " " << x;
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-b-grafik-tygodnia', krok: 9, level: 'latwe',
            title: 'Grafik tygodnia',
            short: 'Wpisy „dzień godziny” z całego miesiąca. Ile godzin w każdy dzień tygodnia? Mapa zsumuje, ale kolejność dni trzeba podać samemu — alfabet tu nie pomoże.',
            tags: ['mapa + własna kolejność', 'vector z nazwami dni', 'suma po kluczu'],
            statement: ['Kasia zapisuje, ile godzin trenowała: każdy wpis to nazwa dnia tygodnia (bez polskich liter: poniedzialek, wtorek, sroda, czwartek, piatek, sobota, niedziela) i liczba godzin. Wpisy pochodzą z wielu tygodni.',
                'Wypisz sumę godzin dla każdego dnia tygodnia — w kolejności od poniedziałku do niedzieli, także dla dni bez treningów (wtedy 0). Na koniec wypisz dzień z największą sumą (przy remisie — wcześniejszy w tygodniu).'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nazwa dnia i liczba godzin.'],
            output_format: ['Siedem wierszy „dzień suma” od poniedziałku do niedzieli, a potem wiersz z nazwą dnia o największej sumie.'],
            constraints: ['1 ≤ n ≤ 5000', 'Godziny: od 1 do 12.'],
            examples: [{ input: '5\nsroda 2\npiatek 3\nsroda 2\nponiedzialek 1\nniedziela 4', note: 'Środa i niedziela mają po 4 godziny — wygrywa środa, bo jest wcześniej w tygodniu.' }],
            hint: R`Sumy zbieraj w map<string, int> godziny;. Gdybyś wypisał mapę pętlą, dni ułożyłyby się alfabetycznie (czwartek, niedziela, piatek…). Zrób więc vector<string> dni = {"poniedzialek", "wtorek", …}; i przejdź po nim — godziny[d] zwróci 0 dla dnia bez treningów.`,
            tests: (r) => { const gen = (n, dni) => `${n}\n${Array.from({ length: n }, () => `${r.pick(dni)} ${r.int(1, 12)}`).join('\n')}`; return ['1\nniedziela 5', '5\nsroda 2\npiatek 3\nsroda 2\nponiedzialek 1\nniedziela 4', '2\nsobota 3\nczwartek 3', gen(20, DNI), gen(5000, DNI), gen(5000, ['sobota', 'niedziela']), gen(3000, ['wtorek'])]; },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 5000) || L.length !== n + 1) return 'n'; for (let i = 1; i <= n; i++) { const w = L[i].trim().split(/\s+/); if (w.length !== 2 || !DNI.includes(w[0]) || !liczba(w[1], 1, 12)) return `wiersz ${i}`; } return null; },
            solve: (inp) => { const m = new Map(); for (const s of linie(inp).slice(1)) { const [d, g] = s.trim().split(/\s+/); m.set(d, (m.get(d) || 0) + Number(g)); } let best = DNI[0]; const o = []; for (const d of DNI) { o.push(`${d} ${m.get(d) || 0}`); if ((m.get(d) || 0) > (m.get(best) || 0)) best = d; } o.push(best); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, int> godziny;
    for (int i = 0; i < n; i++) {
        string dzien;
        int g;
        cin >> dzien >> g;
        godziny[dzien] += g;
    }
    vector<string> dni = {"poniedzialek", "wtorek", "sroda", "czwartek", "piatek", "sobota", "niedziela"};
    string najlepszy = dni[0];
    for (auto &d : dni) {
        cout << d << " " << godziny[d] << "\n";
        if (godziny[d] > godziny[najlepszy]) najlepszy = d;
    }
    cout << najlepszy << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-czat', krok: 9, level: 'latwe',
            title: 'Czat klasowy',
            short: 'Wiadomości „nick treść”. Dla każdego nicku: ile napisał wiadomości i jaka była jego ostatnia. Nick wczytasz przez >>, a resztę wiersza — przez getline.',
            tags: ['getline reszty wiersza', 'nadpisywanie wartości', 'dwie mapy'],
            statement: ['Z czatu klasowego zapisano n wiadomości. Każda zajmuje jeden wiersz: najpierw nick autora, potem spacja i treść (treść może zawierać spacje).',
                'Dla każdego nicku (alfabetycznie, tak jak porównuje napisy C++: cyfry przed wielkimi literami, wielkie przed małymi) wypisz nick, liczbę jego wiadomości, dwukropek i treść jego ostatniej wiadomości.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy nick, spacja i treść wiadomości.'],
            output_format: ['Wiersze „nick liczba: ostatnia treść”.'],
            constraints: ['1 ≤ n ≤ 2000', 'Nicki: od 1 do 12 liter i cyfr. Treść: od 1 do 40 znaków (litery, cyfry, spacje i znaki .,!?), nie zaczyna się ani nie kończy spacją.'],
            examples: [{ input: '4\nola Hej wszystkim!\nkuba2 Kto ma zadanie z matmy?\nola Ja mam.\nola Zaraz wysle.', note: 'Ola napisała trzy wiadomości, ostatnia to „Zaraz wysle.”.' }],
            hint: R`Po cin >> nick; w wierszu zostaje spacja i treść. getline(cin, tresc); wczyta resztę wiersza — razem z tą pierwszą spacją, więc ją usuń: tresc = tresc.substr(1);. Potem ile[nick]++; i ostatnia[nick] = tresc; — każda kolejna wiadomość nadpisze poprzednią.`,
            tests: (r) => {
                const nicki = (k) => rozneSlowa(r, k, 2, 8, 'abcdefghijklmnoprstuwyz').map((w, i) => (i % 3 === 0 ? w + r.int(1, 99) : i % 3 === 1 ? duzeImie(w) : w));
                const tresc = () => { const s = Array.from({ length: r.int(1, 6) }, () => r.pick(SL)).join(' '); return (duzeImie(s) + r.pick(['', '.', '!', '?', '...'])).slice(0, 40).trim(); };
                const gen = (n, k) => { const g = nicki(k); return `${n}\n${Array.from({ length: n }, () => `${r.pick(g)} ${tresc()}`).join('\n')}`; };
                return ['1\nola Hej', '4\nola Hej wszystkim!\nkuba2 Kto ma zadanie z matmy?\nola Ja mam.\nola Zaraz wysle.', '3\nB a\nA b\na c', gen(15, 3), gen(2000, 60), gen(2000, 5)];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000) || L.length !== n + 1) return 'n'; for (let i = 1; i <= n; i++) { const g = /^([A-Za-z0-9]{1,12}) (.+)$/.exec(L[i]); if (!g || g[2].length > 40 || !/^[A-Za-z0-9.,!?]([A-Za-z0-9 .,!?]*[A-Za-z0-9.,!?])?$/.test(g[2])) return `wiersz ${i}`; } return null; },
            solve: (inp) => { const m = new Map(); for (const s of linie(inp).slice(1)) { const i = s.indexOf(' '); const nick = s.slice(0, i), t = s.slice(i + 1); const v = m.get(nick) || [0, '']; v[0]++; v[1] = t; m.set(nick, v); } return [...m.keys()].sort(cmp).map((k) => `${k} ${m.get(k)[0]}: ${m.get(k)[1]}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, int> ile;
    map<string, string> ostatnia;
    for (int i = 0; i < n; i++) {
        string nick, tresc;
        cin >> nick;
        getline(cin, tresc);
        tresc = tresc.substr(1);
        ile[nick]++;
        ostatnia[nick] = tresc;
    }
    for (auto [nick, k] : ile) cout << nick << " " << k << ": " << ostatnia[nick] << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-slowa-w-wierszach', krok: 9, level: 'latwe',
            title: 'W ilu wierszach?',
            short: 'Dla każdego słowa: w ilu różnych wierszach tekstu się pojawia? Pamiętaj w mapie numer wiersza, w którym ostatnio policzyłeś to słowo.',
            tags: ['getline i stringstream', 'mapa ostatniego wiersza', 'liczenie bez powtórzeń'],
            statement: ['Dostajesz tekst złożony z wierszy. Dla każdego słowa (alfabetycznie) wypisz, w ilu różnych wierszach występuje. Słowo powtórzone w jednym wierszu liczy się dla tego wiersza tylko raz.'],
            input_format: ['Wiersze tekstu — do końca danych. Słowa są oddzielone spacjami; wiersz może być pusty.'],
            output_format: ['Wiersze „słowo liczba”.'],
            constraints: ['Wierszy jest od 1 do 3000, słów razem od 1 do 10 000; każde słowo ma od 1 do 10 małych liter.'],
            examples: [{ input: 'ala ma kota\nkot ma ale\nala ala ala', note: 'Słowo ala jest w wierszach 1 i 3 — w trzecim trzy razy, ale ten wiersz liczy się raz.' }],
            hint: R`Czytaj wiersze: while (getline(cin, w)), numeruj je od 1 i rozbieraj na słowa przez stringstream. Trzymaj map<string, int> ostatni; — numer wiersza, w którym słowo ostatnio policzyłeś. Licznik zwiększaj tylko wtedy, gdy ostatni[s] różni się od numeru bieżącego wiersza (nowe słowo ma w ostatni zero, a wiersze numerujesz od 1).`,
            tests: (r) => { const gen = (w, maxS, pula) => Array.from({ length: w }, () => (r() < 0.05 ? '' : Array.from({ length: r.int(1, maxS) }, () => r.pick(pula)).join(' '))).join('\n'); return ['kot', 'ala ma kota\nkot ma ale\nala ala ala', 'a a a\n\nb a', gen(10, 5, SL.slice(0, 8)), gen(2500, 6, SL), gen(1500, 12, SL.slice(0, 15))]; },
            check: (inp) => { const L = linie(inp); if (L.length > 3000) return 'wiersze'; let s = 0; for (const w of L) { if (w !== '' && !/^[a-z]{1,10}( [a-z]{1,10})*$/.test(w)) return 'wiersz'; s += w === '' ? 0 : w.split(' ').length; } return s >= 1 && s <= 10000 ? null : 'słowa'; },
            solve: (inp) => { const m = new Map(); linie(inp).forEach((w, i) => { if (w === '') return; for (const s of w.split(' ')) { const v = m.get(s) || [0, 0]; if (v[1] !== i + 1) { v[0]++; v[1] = i + 1; } m.set(s, v); } }); return [...m.keys()].sort(cmp).map((s) => `${s} ${m.get(s)[0]}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<string, int> ile, ostatni;
    string w;
    int nr = 0;
    while (getline(cin, w)) {
        nr++;
        stringstream ss(w);
        string s;
        while (ss >> s)
            if (ostatni[s] != nr) {
                ostatni[s] = nr;
                ile[s]++;
            }
    }
    for (auto [s, k] : ile) cout << s << " " << k << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-wielomiany', krok: 9, level: 'latwe',
            title: 'Dodawanie wielomianów',
            short: 'Wielomian z wykładnikami do 10⁹ to mapa wykładnik → współczynnik. Dodaj dwa wielomiany, usuń wyrazy, które się wyzerowały, i wypisz resztę od najwyższej potęgi.',
            tags: ['map<int, long long>', 'erase zerowych wyrazów', 'rbegin — od największego klucza'],
            statement: ['Wielomian zapisujemy jako listę wyrazów „współczynnik wykładnik”, np. 3x¹⁰⁰ − 2x + 7 to wyrazy (3, 100), (−2, 1) i (7, 0). Dostajesz dwa wielomiany; w każdym z nich wykładniki są różne, a współczynniki — różne od zera.',
                'Wypisz ich sumę: najpierw liczbę niezerowych wyrazów, a potem te wyrazy od najwyższego wykładnika do najniższego. Jeśli suma jest zerem, wypisz tylko 0.'],
            input_format: ['W pierwszym wierszu n, a w kolejnych n wierszach wyrazy pierwszego wielomianu (w dowolnej kolejności).', 'Potem m i m wierszy z wyrazami drugiego wielomianu.'],
            output_format: ['W pierwszym wierszu liczba wyrazów sumy k, a w kolejnych k wierszach wyrazy „współczynnik wykładnik”.'],
            constraints: ['1 ≤ n, m ≤ 500', '0 ≤ wykładnik ≤ 10⁹', '1 ≤ |współczynnik| ≤ 10⁹ (suma może sięgnąć 2 · 10⁹ — użyj long long)'],
            examples: [{ input: '3\n3 100\n-2 1\n7 0\n2\n2 1\n5 4', note: 'Wyrazy z x się znoszą: −2x + 2x = 0. Zostaje 3x¹⁰⁰ + 5x⁴ + 7.' }],
            hint: R`map<int, long long> w; i dla każdego wyrazu obu wielomianów w[wykladnik] += wspolczynnik;. Potem usuń wyrazy, które się wyzerowały — w pętli po iteratorach: if (it->second == 0) it = w.erase(it); else it++;. Na koniec wypisz w.size() i wyrazy od rbegin() do rend().`,
            tests: (r) => {
                const wiel = (n, E) => { const ex = new Set(); while (ex.size < n) ex.add(r.int(0, E)); return [...ex].map((e) => [r.pick([-1, 1]) * r.int(1, 1000000000), e]); };
                const d = (A, B) => `${A.length}\n${A.map(([a, e]) => `${a} ${e}`).join('\n')}\n${B.length}\n${B.map(([a, e]) => `${a} ${e}`).join('\n')}`;
                const A2 = wiel(400, 600); const B2 = r.shuffle(A2.map(([a, e]) => [r() < 0.5 ? -a : r.pick([-1, 1]) * r.int(1, 1000000000), e]));
                return [d([[5, 0]], [[-5, 0]]), d([[3, 100], [-2, 1], [7, 0]], [[2, 1], [5, 4]]), d([[1000000000, 1000000000]], [[1000000000, 1000000000]]), d(wiel(10, 15), wiel(10, 15)), d(wiel(500, 1000000000), wiel(500, 1000000000)), d(A2, B2), d(wiel(500, 700), wiel(500, 700))];
            },
            check: (inp) => { const t = nums(inp); let p = 0; for (let k = 0; k < 2; k++) { const n = t[p]; if (!calk(n, 1, 500)) return 'n'; const ex = new Set(); for (let i = 0; i < n; i++) { const a = t[p + 1 + 2 * i], e = t[p + 2 + 2 * i]; if (!calk(Math.abs(a), 1, 1e9) || !calk(e, 0, 1e9) || ex.has(e)) return 'wyraz'; ex.add(e); } p += 1 + 2 * n; } return p === t.length ? null : 'długość'; },
            solve: (inp) => { const t = nums(inp); const m = new Map(); let p = 0; for (let k = 0; k < 2; k++) { const n = t[p]; for (let i = 0; i < n; i++) { const a = t[p + 1 + 2 * i], e = t[p + 2 + 2 * i]; m.set(e, (m.get(e) || 0) + a); } p += 1 + 2 * n; } const w = [...m].filter(([, a]) => a !== 0).sort((x, y) => y[0] - x[0]); return [String(w.length), ...w.map(([e, a]) => `${a} ${e}`)].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<int, long long> w;
    for (int k = 0; k < 2; k++) {
        int n;
        cin >> n;
        for (int i = 0; i < n; i++) {
            long long a;
            int e;
            cin >> a >> e;
            w[e] += a;
        }
    }
    for (auto it = w.begin(); it != w.end();) {
        if (it->second == 0) it = w.erase(it);
        else it++;
    }
    cout << w.size() << "\n";
    for (auto it = w.rbegin(); it != w.rend(); it++) cout << it->second << " " << it->first << "\n";
    return 0;
}`,
        },
        // ================================================================ ŚREDNIE
        {
            id: 'map-b-ten-sam-wzor', krok: 9, level: 'srednie',
            title: 'Ten sam wzór',
            short: 'Czy zdanie pasuje do wzoru „abba”? Ta sama litera to zawsze to samo słowo, a różne litery — różne słowa. Dwie mapy pilnują obu kierunków.',
            tags: ['dwie mapy: w obie strony', 'map<char, string>', 'wiele testów'],
            statement: ['Wzór to napis z małych liter, np. abba. Zdanie pasuje do wzoru, gdy ma tyle słów, ile wzór ma liter, i da się każdej literze przypisać słowo tak, żeby ta sama litera oznaczała zawsze to samo słowo, a różne litery — różne słowa. Na przykład „pies kot kot pies” pasuje do abba, a „pies kot kot ryba” i „pies pies pies pies” — nie.',
                'Dla każdego z t testów odpowiedz TAK albo NIE.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test zajmuje dwa wiersze: wzór, a pod nim zdanie.'],
            output_format: ['t wierszy: TAK albo NIE.'],
            constraints: ['1 ≤ t ≤ 300', 'Wzór ma od 1 do 26 liter, zdanie — od 1 do 40 słów; słowa mają od 1 do 10 małych liter i są oddzielone pojedynczymi spacjami.'],
            examples: [{ input: '4\nabba\npies kot kot pies\nabba\npies kot kot ryba\nabba\npies pies pies pies\nab\nala', note: 'W czwartym teście wzór ma dwie litery, a zdanie tylko jedno słowo.' }],
            hint: R`Po cin >> t; zostaje koniec wiersza — zjedz go jednym getline. Potem wczytuj wzór i zdanie przez getline, a słowa zdania wyjmij stringstreamem do vectora. Jeśli liczba słów różni się od długości wzoru — od razu NIE. Inaczej trzymaj map<char, string> slowoDla; i map<string, char> literaDla; i przy każdej parze (litera, słowo) sprawdź, czy któraś z map nie pamięta już czegoś innego. Jedna mapa nie wystarczy: przy wzorze ab i zdaniu „pies pies” mapa litera → słowo niczego by nie zauważyła.`,
            tests: (r) => {
                const test = () => {
                    const k = r.int(1, 6); const lit = 'abcdefghijklmnopqrstuvwxyz'.slice(0, k);
                    const wz = Array.from({ length: r.int(1, 12) }, () => r.pick([...lit])).join('');
                    const sl = rozneSlowa(r, 26, 1, 6); const mapa = {}; [...lit].forEach((c, i) => { mapa[c] = sl[i]; });
                    let zd = [...wz].map((c) => mapa[c]); const x = r();
                    if (x < 0.15) zd[r.int(0, zd.length - 1)] = r.pick(sl);
                    else if (x < 0.3 && k >= 2) { mapa[lit[1]] = mapa[lit[0]]; zd = [...wz].map((c) => mapa[c]); }
                    else if (x < 0.4) { if (r() < 0.5) zd.push(r.pick(sl)); else if (zd.length > 1) zd.pop(); }
                    return `${wz}\n${zd.join(' ')}`;
                };
                return ['1\na\nkot', '4\nabba\npies kot kot pies\nabba\npies kot kot ryba\nabba\npies pies pies pies\nab\nala', '3\nab\npies pies\naa\npies kot\nabc\nx y z', `50\n${Array.from({ length: 50 }, test).join('\n')}`, `300\n${Array.from({ length: 300 }, test).join('\n')}`];
            },
            check: (inp) => { const L = linie(inp); const t = Number(L[0]); if (!calk(t, 1, 300) || L.length !== 1 + 2 * t) return 't'; for (let i = 0; i < t; i++) { if (!/^[a-z]{1,26}$/.test(L[1 + 2 * i]) || !/^[a-z]{1,10}( [a-z]{1,10}){0,39}$/.test(L[2 + 2 * i])) return `test ${i + 1}`; } return null; },
            solve: (inp) => { const L = linie(inp); const o = []; for (let i = 0; i < Number(L[0]); i++) { const wz = L[1 + 2 * i], zd = L[2 + 2 * i].split(' '); let ok = zd.length === wz.length; const a = new Map(), b = new Map(); for (let j = 0; ok && j < wz.length; j++) { const c = wz[j], s = zd[j]; if ((a.has(c) && a.get(c) !== s) || (b.has(s) && b.get(s) !== c)) ok = false; a.set(c, s); b.set(s, c); } o.push(ok ? 'TAK' : 'NIE'); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    string wzor, zdanie;
    getline(cin, zdanie);
    while (t--) {
        getline(cin, wzor);
        getline(cin, zdanie);
        stringstream ss(zdanie);
        vector<string> slowa;
        string s;
        while (ss >> s) slowa.push_back(s);
        bool pasuje = slowa.size() == wzor.size();
        map<char, string> slowoDla;
        map<string, char> literaDla;
        for (int i = 0; pasuje && i < (int)wzor.size(); i++) {
            char c = wzor[i];
            if (slowoDla.count(c) && slowoDla[c] != slowa[i]) pasuje = false;
            if (literaDla.count(slowa[i]) && literaDla[slowa[i]] != c) pasuje = false;
            slowoDla[c] = slowa[i];
            literaDla[slowa[i]] = c;
        }
        cout << (pasuje ? "TAK" : "NIE") << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-b-bransoletki', krok: 9, level: 'srednie',
            title: 'Bransoletki z koralików',
            short: 'Bransoletka to koraliki w kółku — obrócona jest tą samą bransoletką. Ile różnych bransoletek leży w pudełku? Kluczem jest najmniejszy alfabetycznie obrót zapisu.',
            tags: ['postać kanoniczna jako klucz', 'wszystkie obroty napisu', 'map<string, int>'],
            statement: ['Każdą bransoletkę opisuje napis: kolejne kolory koralików (małe litery), czytane od dowolnego koralika zgodnie z ruchem wskazówek zegara. Ta sama bransoletka może więc mieć kilka zapisów: abc, bca i cab to jedna bransoletka, ale acb — już inna (bransoletek nie odwracamy na drugą stronę).',
                'Dostajesz n zapisów. Ile jest wśród nich różnych bransoletek i ile zapisów ma najczęstsza z nich?'],
            input_format: ['W pierwszym wierszu n.', 'W kolejnych n wierszach zapisy bransoletek.'],
            output_format: ['Dwie liczby: liczba różnych bransoletek i liczba zapisów najczęstszej z nich.'],
            constraints: ['1 ≤ n ≤ 3000', 'Każdy zapis ma od 1 do 20 liter.'],
            examples: [{ input: '5\nabc\nbca\nacb\ncab\naab', note: 'abc, bca i cab to ta sama bransoletka. acb i aab są inne — razem 3 bransoletki, najczęstsza ma 3 zapisy.' }],
            hint: R`Dwa zapisy opisują tę samą bransoletkę, gdy jeden jest obrotem drugiego. Wybierz jednego „przedstawiciela”: najmniejszy alfabetycznie ze wszystkich obrotów (obrót o k to s.substr(k) + s.substr(0, k)). Wszystkie zapisy jednej bransoletki mają tego samego przedstawiciela, więc wystarczy zliczać przedstawicieli w mapie.`,
            tests: (r) => { const obroc = (s) => { const k = r.int(0, s.length - 1); return s.slice(k) + s.slice(0, k); }; const gen = (n, baz, al, dlMin, dlMax) => { const B = Array.from({ length: baz }, () => r.word(r.int(dlMin, dlMax), al)); return `${n}\n${Array.from({ length: n }, () => obroc(r.pick(B))).join('\n')}`; }; return ['1\na', '5\nabc\nbca\nacb\ncab\naab', '4\nabab\nbaba\nabab\naabb', gen(20, 4, 'ab', 1, 4), gen(3000, 100, 'abc', 5, 20), gen(3000, 3000, 'ab', 1, 10), gen(3000, 30, 'abcdefgh', 20, 20)]; },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 3000) && L.length === n + 1 && L.slice(1).every((s) => /^[a-z]{1,20}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const s of linie(inp).slice(1)) { const k = kanon(s); m.set(k, (m.get(k) || 0) + 1); } return `${m.size} ${Math.max(...m.values())}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, int> ile;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        string najmniejszy = s;
        for (int k = 1; k < (int)s.size(); k++) {
            string obrot = s.substr(k) + s.substr(0, k);
            if (obrot < najmniejszy) najmniejszy = obrot;
        }
        ile[najmniejszy]++;
    }
    int rekord = 0;
    for (auto [s, k] : ile) rekord = max(rekord, k);
    cout << ile.size() << " " << rekord << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-dna', krok: 9, level: 'srednie',
            title: 'Powtórki w DNA',
            short: 'Które fragmenty długości k powtarzają się w łańcuchu DNA najczęściej? Wszystkie fragmenty do mapy przez substr, a potem ranking: vector par i sort.',
            tags: ['s.substr(i, k) jako klucz', 'ranking według liczby', 'najwyżej 10 wyników'],
            statement: ['Łańcuch DNA to napis z liter A, C, G i T. Rozważ wszystkie fragmenty łańcucha o długości k — zaczynające się na każdej pozycji, także nachodzące na siebie.',
                'Wypisz co najwyżej 10 najczęstszych fragmentów spośród tych, które występują co najmniej dwa razy — od najczęstszego, a przy równej liczbie wystąpień alfabetycznie — każdy z liczbą wystąpień. Jeśli żaden fragment się nie powtarza, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu k.', 'W drugim wierszu łańcuch DNA.'],
            output_format: ['Co najwyżej 10 wierszy „fragment liczba” albo BRAK.'],
            constraints: ['1 ≤ k ≤ 12', 'Łańcuch ma od 1 do 50 000 liter.'],
            examples: [{ input: '3\nACGTACGTTACG', note: 'ACG występuje 3 razy, CGT i TAC — po 2 razy. Reszta fragmentów się nie powtarza.' }],
            hint: R`Fragment od pozycji i to s.substr(i, k); pętlę prowadź, dopóki i + k <= s.size() (łańcuch może być krótszy niż k!). Zlicz fragmenty w map<string, int>, potem przepisz do vector<pair<string, int>> tylko te z liczbą co najmniej 2 i posortuj lambdą: większa liczba przodem, przy remisie mniejszy napis. Wypisz najwyżej 10 pierwszych.`,
            tests: (r) => { const d = (k, s) => `${k}\n${s}`; const kaw = Array.from({ length: 5 }, () => r.word(8, 'ACGT')); const powt = (n) => { let s = ''; while (s.length < n) s += r() < 0.5 ? r.pick(kaw) : r.word(r.int(1, 5), 'ACGT'); return s.slice(0, n); }; return [d(5, 'ACG'), d(1, 'A'), d(3, 'ACGTACGTTACG'), d(2, 'AAAA'), d(1, r.word(50000, 'ACGT')), d(12, r.word(50000, 'ACGT')), d(6, r.word(50000, 'ACGT')), d(8, powt(50000)), d(4, 'ACGT'.repeat(12500))]; },
            check: (inp) => { const L = linie(inp); return L.length === 2 && liczba(L[0], 1, 12) && /^[ACGT]{1,50000}$/.test(L[1]) ? null : 'dane'; },
            solve: (inp) => { const [k0, s] = linie(inp); const k = Number(k0); const m = new Map(); for (let i = 0; i + k <= s.length; i++) { const f = s.substr(i, k); m.set(f, (m.get(f) || 0) + 1); } const w = ranking([...m].filter(([, c]) => c >= 2)).slice(0, 10); return w.length ? w.map(([f, c]) => `${f} ${c}`).join('\n') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    string s;
    cin >> k >> s;
    map<string, int> ile;
    for (int i = 0; i + k <= (int)s.size(); i++) ile[s.substr(i, k)]++;
    vector<pair<string, int>> top;
    for (auto [f, c] : ile)
        if (c >= 2) top.push_back({f, c});
    sort(top.begin(), top.end(), [](auto a, auto b) {
        if (a.second != b.second) return a.second > b.second;
        return a.first < b.first;
    });
    if (top.empty()) cout << "BRAK\n";
    for (int i = 0; i < (int)top.size() && i < 10; i++) cout << top[i].first << " " << top[i].second << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-urlopy', krok: 9, level: 'srednie',
            title: 'Wszyscy w pracy',
            short: 'Urlopy pracowników to przedziały dni. Ile dni wszyscy byli w pracy i jak długa była najdłuższa taka seria? Zdarzenia w mapie — koniec urlopu zapisz dzień później.',
            tags: ['zdarzenia na dniach', 'b + 1 przy przedziale zamkniętym', 'kawałki z zerową sumą'],
            statement: ['Firma pracuje przez D dni ponumerowanych od 1 do D. Każdy z n pracowników ma jeden urlop: od dnia aᵢ do dnia bᵢ włącznie.',
                'Policz, przez ile dni wszyscy pracownicy byli w pracy (nikt nie miał urlopu), i podaj długość najdłuższej serii kolejnych takich dni.'],
            input_format: ['W pierwszym wierszu D i n.', 'W każdym z n kolejnych wierszy aᵢ i bᵢ.'],
            output_format: ['Dwie liczby: liczba dni, w które wszyscy byli w pracy, i długość najdłuższej serii takich dni.'],
            constraints: ['1 ≤ D ≤ 10⁹, 1 ≤ n ≤ 4000', '1 ≤ aᵢ ≤ bᵢ ≤ D'],
            examples: [{ input: '20 3\n3 5\n4 8\n12 12', note: 'Wszyscy pracują w dniach 1–2, 9–11 i 13–20. To 2 + 3 + 8 = 13 dni, a najdłuższa seria ma 8 dni.' }],
            hint: R`Urlop od a do b włącznie zapisz jako zmiana[a]++; zmiana[b + 1]--; — w dniu b + 1 pracownik już wraca. Dołóż „strażników” zmiana[1] += 0; i zmiana[D + 1] += 0;, żeby mapa miała klucz na początku i tuż za końcem okresu. Potem idź po kluczach: od poprzedniego klucza do dnia przed obecnym liczba osób na urlopie jest stała — jeśli wynosi 0, cały ten kawałek to dni pracy wszystkich i przedłuża bieżącą serię; inaczej seria się urywa.`,
            tests: (r) => { const d = (D, P2) => `${D} ${P2.length}\n${P2.map(([a, b]) => `${a} ${b}`).join('\n')}`; const urlopy = (n, D, dl) => Array.from({ length: n }, () => { const a = r.int(1, D); return [a, Math.min(D, a + r.int(0, dl - 1))]; }); return [d(1, [[1, 1]]), d(5, [[2, 3]]), d(20, [[3, 5], [4, 8], [12, 12]]), d(1000000000, [[1, 1000000000]]), d(1000000000, [[500, 600]]), d(40, urlopy(6, 40, 6)), d(1000000000, urlopy(4000, 1000000000, 1000000)), d(100000, urlopy(4000, 100000, 20)), d(1000000000, urlopy(4000, 1000000000, 300000000))]; },
            check: (inp) => { const t = nums(inp); const [D, n] = t; if (!calk(D, 1, 1e9) || !calk(n, 1, 4000) || t.length !== 2 + 2 * n) return 'n'; for (let i = 0; i < n; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; if (!calk(a, 1, D) || !calk(b, a, D)) return 'urlop'; } return null; },
            solve: (inp) => { const t = nums(inp); const [D, n] = t; const m = new Map([[1, 0], [D + 1, 0]]); for (let i = 0; i < n; i++) { const a = t[2 + 2 * i], b = t[3 + 2 * i]; m.set(a, (m.get(a) || 0) + 1); m.set(b + 1, (m.get(b + 1) || 0) - 1); } let urlop = 0, pop = 1, wsz = 0, seria = 0, naj = 0; for (const [k, d] of [...m].sort((x, y) => x[0] - y[0])) { if (k > pop) { if (urlop === 0) { wsz += k - pop; seria += k - pop; naj = Math.max(naj, seria); } else seria = 0; } urlop += d; pop = k; } return `${wsz} ${naj}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long D;
    int n;
    cin >> D >> n;
    map<long long, int> zmiana;
    zmiana[1] += 0;
    zmiana[D + 1] += 0;
    for (int i = 0; i < n; i++) {
        long long a, b;
        cin >> a >> b;
        zmiana[a]++;
        zmiana[b + 1]--;
    }
    long long wszyscy = 0, seria = 0, najdluzsza = 0, poprzedni = 1;
    int urlop = 0;
    for (auto [dzien, d] : zmiana) {
        if (dzien > poprzedni) {
            if (urlop == 0) {
                wszyscy += dzien - poprzedni;
                seria += dzien - poprzedni;
                najdluzsza = max(najdluzsza, seria);
            } else seria = 0;
        }
        urlop += d;
        poprzedni = dzien;
    }
    cout << wszyscy << " " << najdluzsza << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-sprawiedliwy-podzial', krok: 9, level: 'srednie',
            title: 'Sprawiedliwy podział',
            short: 'Na ile sposobów można przeciąć ciąg na dwie niepuste części z tą samą liczbą różnych wartości? Dwie mapy liczników — a gdy licznik spada do zera, klucz trzeba usunąć.',
            tags: ['dwie mapy liczników', 'erase przy zerze', 'size = liczba różnych'],
            statement: ['Dostajesz ciąg n liczb. Cięcie po pozycji i (1 ≤ i < n) dzieli go na lewą część (pierwsze i liczb) i prawą (pozostałe). Cięcie jest sprawiedliwe, gdy w obu częściach jest tyle samo różnych wartości.',
                'Policz sprawiedliwe cięcia.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba sprawiedliwych cięć.'],
            constraints: ['2 ≤ n ≤ 8000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n1 2 2 1 2 1', note: 'Sprawiedliwe są cięcia po 2., 3. i 4. liczbie — po obu stronach są wtedy jedynki i dwójki.' }],
            hint: R`Najpierw policz wszystkie liczby w mapie prawa. Potem przesuwaj cięcie od lewej: liczbę x przenoś z prawej części do lewej — lewa[x]++; prawa[x]--; — a gdy prawa[x] spadnie do zera, usuń klucz: prawa.erase(x);. Dzięki temu lewa.size() i prawa.size() to dokładnie liczby różnych wartości po obu stronach cięcia.`,
            tests: (r) => { const d = (a) => `${a.length}\n${a.join(' ')}`; return [d([1, 1]), d([1, 2]), d([1, 2, 2, 1, 2, 1]), d([5, 5, 5]), d(losy(r, 30, 1, 4)), d(losy(r, 8000, 1, 50)), d(losy(r, 7000, -1000000000, 1000000000)), d([...losy(r, 4000, 1, 1000), ...losy(r, 4000, 1, 1000)]), d(Array.from({ length: 8000 }, (_, i) => (i < 4000 ? i : 7999 - i)))]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; return calk(n, 2, 8000) && t.length === n + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const L = new Map(), P2 = new Map(); for (const x of a) P2.set(x, (P2.get(x) || 0) + 1); let w = 0; for (let i = 0; i + 1 < a.length; i++) { const x = a[i]; L.set(x, (L.get(x) || 0) + 1); P2.set(x, P2.get(x) - 1); if (P2.get(x) === 0) P2.delete(x); if (L.size === P2.size) w++; } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    map<int, int> lewa, prawa;
    for (int i = 0; i < n; i++) {
        cin >> a[i];
        prawa[a[i]]++;
    }
    int wynik = 0;
    for (int i = 0; i + 1 < n; i++) {
        lewa[a[i]]++;
        prawa[a[i]]--;
        if (prawa[a[i]] == 0) prawa.erase(a[i]);
        if (lewa.size() == prawa.size()) wynik++;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-roboty', krok: 9, level: 'srednie',
            title: 'Roboty w magazynie',
            short: 'Roboty stoją na ogromnej kracie. Robot rusza się o jedno pole, chyba że pole jest zajęte — wtedy stoi. Mapa (x, y) → numer robota pilnuje zajętych pól.',
            tags: ['map<pair<int, int>, int>', 'przeniesienie: erase i nowy klucz', 'symulacja'],
            statement: ['W magazynie stoi n robotów ponumerowanych od 1 do n; robot i stoi na polu (xᵢ, yᵢ), każdy na innym polu. Przychodzi q poleceń „i kierunek”, gdzie kierunek to N (y + 1), S (y − 1), E (x + 1) albo W (x − 1).',
                'Robot wykonuje ruch, jeśli pole docelowe jest wolne; jeśli stoi tam inny robot, polecenie przepada. Dla każdego polecenia wypisz OK albo ZAJETE, a na końcu pozycje wszystkich robotów w kolejności numerów.'],
            input_format: ['W pierwszym wierszu n i q.', 'W n kolejnych wierszach xᵢ i yᵢ.', 'W q kolejnych wierszach polecenia.'],
            output_format: ['q wierszy OK albo ZAJETE, a potem n wierszy „x y”.'],
            constraints: ['1 ≤ n ≤ 500, 1 ≤ q ≤ 2000', '−10⁹ ≤ xᵢ, yᵢ ≤ 10⁹ — po wszystkich ruchach współrzędne nadal mieszczą się w int.'],
            examples: [{ input: '3 5\n0 0\n1 0\n5 5\n1 E\n2 W\n2 N\n1 E\n3 S', note: 'Roboty 1 i 2 najpierw się blokują. Gdy robot 2 odjedzie w górę, robot 1 może wjechać na jego dawne pole.' }],
            hint: R`Trzymaj pozycje w dwóch miejscach: vector<pair<int, int>> poz(n + 1) (robot → pole) i map<pair<int, int>, int> zajete (pole → robot). Ruch: policz nowe pole; jeśli zajete.count(nowe) — ZAJETE. Inaczej usuń stare pole z mapy (zajete.erase(poz[i])), popraw poz[i] i wpisz zajete[poz[i]] = i.`,
            tests: (r) => { const gen = (n, q, Rr) => { const zaj = new Set(); const poz = []; while (poz.length < n) { const x = r.int(-Rr, Rr), y = r.int(-Rr, Rr); const k = `${x} ${y}`; if (zaj.has(k)) continue; zaj.add(k); poz.push(k); } return `${n} ${q}\n${poz.join('\n')}\n${Array.from({ length: q }, () => `${r.int(1, n)} ${r.pick(['N', 'S', 'E', 'W'])}`).join('\n')}`; }; return ['1 1\n0 0\n1 N', '3 5\n0 0\n1 0\n5 5\n1 E\n2 W\n2 N\n1 E\n3 S', '2 4\n0 0\n0 1\n1 N\n2 S\n2 N\n1 N', gen(10, 30, 2), gen(500, 2000, 999990000), gen(300, 2000, 10), gen(500, 2000, 12)]; },
            check: (inp) => { const L = linie(inp); const [n, q] = L[0].split(' ').map(Number); if (!calk(n, 1, 500) || !calk(q, 1, 2000) || L.length !== 1 + n + q) return 'n'; const zaj = new Set(); for (let i = 1; i <= n; i++) { const w = L[i].split(' '); if (w.length !== 2 || !liczba(w[0], -1e9, 1e9) || !liczba(w[1], -1e9, 1e9) || zaj.has(L[i])) return `robot ${i}`; zaj.add(L[i]); } for (let i = n + 1; i <= n + q; i++) { const w = L[i].split(' '); if (w.length !== 2 || !liczba(w[0], 1, n) || !'NSEW'.includes(w[1]) || w[1].length !== 1) return `polecenie ${i}`; } return null; },
            solve: (inp) => { const L = linie(inp); const [n, q] = L[0].split(' ').map(Number); const poz = [null]; const zaj = new Map(); for (let i = 1; i <= n; i++) { const [x, y] = L[i].split(' ').map(Number); poz.push([x, y]); zaj.set(`${x} ${y}`, i); } const o = []; for (let j = n + 1; j <= n + q; j++) { const [a, k] = L[j].split(' '); const i = Number(a); let [x, y] = poz[i]; if (k === 'N') y++; else if (k === 'S') y--; else if (k === 'E') x++; else x--; if (zaj.has(`${x} ${y}`)) o.push('ZAJETE'); else { zaj.delete(`${poz[i][0]} ${poz[i][1]}`); poz[i] = [x, y]; zaj.set(`${x} ${y}`, i); o.push('OK'); } } for (let i = 1; i <= n; i++) o.push(`${poz[i][0]} ${poz[i][1]}`); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    vector<pair<int, int>> poz(n + 1);
    map<pair<int, int>, int> zajete;
    for (int i = 1; i <= n; i++) {
        cin >> poz[i].first >> poz[i].second;
        zajete[poz[i]] = i;
    }
    while (q--) {
        int i;
        char k;
        cin >> i >> k;
        int x = poz[i].first, y = poz[i].second;
        if (k == 'N') y++;
        else if (k == 'S') y--;
        else if (k == 'E') x++;
        else x--;
        if (zajete.count({x, y})) cout << "ZAJETE\n";
        else {
            zajete.erase(poz[i]);
            poz[i] = {x, y};
            zajete[poz[i]] = i;
            cout << "OK\n";
        }
    }
    for (int i = 1; i <= n; i++) cout << poz[i].first << " " << poz[i].second << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-interpreter', krok: 9, level: 'srednie',
            title: 'Mini interpreter',
            short: 'Program z poleceniami SET, ADD, MUL i PRINT na zmiennych o dowolnych nazwach. Zmienne to mapa nazwa → wartość, a argument bywa liczbą albo nazwą innej zmiennej.',
            tags: ['mapa zmiennych', 'liczba czy nazwa?', 'symulacja poleceń'],
            statement: ['Napisz interpreter prostego języka. Zmienne mają nazwy z małych liter i przechowują liczby całkowite. Polecenia:',
                'SET x a — zmienna x przyjmuje wartość a;',
                'ADD x a — do x dodaj a;',
                'MUL x a — x pomnóż przez a;',
                'PRINT x — wypisz wartość x.',
                'Argument a to liczba całkowita (może być ujemna) albo nazwa zmiennej — wtedy chodzi o jej obecną wartość. Zmienna, której nikt jeszcze nie ustawił, ma wartość 0.'],
            input_format: ['W pierwszym wierszu q.', 'W kolejnych q wierszach polecenia.'],
            output_format: ['Wyniki poleceń PRINT, każdy w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 3000', 'Liczby w poleceniach: od −1000 do 1000; nazwy: od 1 do 10 małych liter.', 'Wszystkie wartości przez cały czas mieszczą się w przedziale od −10¹⁸ do 10¹⁸.'],
            examples: [{ input: '8\nSET x 5\nADD x x\nMUL x -3\nSET y x\nADD y 100\nPRINT x\nPRINT y\nPRINT z', note: 'x: 5, potem 10, potem −30. y dostaje wartość x, czyli −30, i rośnie do 70. Zmiennej z nikt nie ustawił — ma 0.' }],
            hint: R`Zmienne trzymaj w map<string, long long> zm;. Argument wczytaj jako string a i sprawdź pierwszy znak: jeśli to cyfra albo minus, wartością jest stoll(a); inaczej to nazwa zmiennej i wartością jest zm[a] (nieznana zmienna da 0 — tak jak chce treść). Przy ADD x x najpierw policz wartość argumentu, a dopiero potem zmieniaj x.`,
            tests: (r) => {
                const LIM = 10n ** 18n;
                const gen = (q, nazwy, pPrint) => {
                    const zm = new Map(); const o = []; const val = (a) => (/^-?\d+$/.test(a) ? BigInt(a) : zm.get(a) || 0n);
                    while (o.length < q) {
                        if (r() < pPrint) { o.push(`PRINT ${r.pick(nazwy)}`); continue; }
                        const v = r.pick(nazwy); const arg = r() < 0.5 ? String(r.int(-1000, 1000)) : r.pick(nazwy); const op = r.pick(['SET', 'ADD', 'MUL', 'MUL']);
                        const cur = zm.get(v) || 0n; const a = val(arg); const nowa = op === 'SET' ? a : op === 'ADD' ? cur + a : cur * a;
                        if (nowa > LIM || nowa < -LIM) continue;
                        zm.set(v, nowa); o.push(`${op} ${v} ${arg}`);
                    }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nPRINT x', '8\nSET x 5\nADD x x\nMUL x -3\nSET y x\nADD y 100\nPRINT x\nPRINT y\nPRINT z', '4\nSET a -7\nMUL a a\nMUL a a\nPRINT a', gen(30, ['a', 'b', 'x'], 0.25), gen(3000, ['a', 'b', 'c', 'x', 'y', 'suma', 'wynik'], 0.2), gen(3000, ['licznik', 'mnoznik'], 0.15)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                const LIM = 10n ** 18n; const zm = new Map(); const nazwa = (s) => /^[a-z]{1,10}$/.test(s);
                for (let i = 1; i <= q; i++) {
                    const w = L[i].split(' ');
                    if (w[0] === 'PRINT') { if (w.length !== 2 || !nazwa(w[1])) return `wiersz ${i}`; continue; }
                    if (!['SET', 'ADD', 'MUL'].includes(w[0]) || w.length !== 3 || !nazwa(w[1])) return `wiersz ${i}`;
                    let a; if (nazwa(w[2])) a = zm.get(w[2]) || 0n; else if (liczba(w[2], -1000, 1000)) a = BigInt(w[2]); else return `argument ${i}`;
                    const cur = zm.get(w[1]) || 0n; const nowa = w[0] === 'SET' ? a : w[0] === 'ADD' ? cur + a : cur * a;
                    if (nowa > LIM || nowa < -LIM) return `zakres ${i}`; zm.set(w[1], nowa);
                }
                return null;
            },
            solve: (inp) => { const L = linie(inp); const zm = new Map(); const o = []; for (const s of L.slice(1)) { const w = s.split(' '); if (w[0] === 'PRINT') { o.push(String(zm.get(w[1]) || 0n)); continue; } const a = /^-?\d+$/.test(w[2]) ? BigInt(w[2]) : zm.get(w[2]) || 0n; const cur = zm.get(w[1]) || 0n; zm.set(w[1], w[0] === 'SET' ? a : w[0] === 'ADD' ? cur + a : cur * a); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    map<string, long long> zm;
    while (q--) {
        string polecenie, x;
        cin >> polecenie >> x;
        if (polecenie == "PRINT") {
            cout << zm[x] << "\n";
            continue;
        }
        string a;
        cin >> a;
        long long v;
        if (isdigit(a[0]) || a[0] == '-') v = stoll(a);
        else v = zm[a];
        if (polecenie == "SET") zm[x] = v;
        else if (polecenie == "ADD") zm[x] += v;
        else zm[x] *= v;
    }
    return 0;
}`,
        },
        {
            id: 'map-b-k-rodzajow', krok: 9, level: 'srednie',
            title: 'Co najwyżej k odmian',
            short: 'Najdłuższy fragment rzędu krzewów, w którym rośnie co najwyżej k różnych odmian. Dwa wskaźniki i mapa liczników — gdy odmian jest za dużo, przesuwaj lewy koniec.',
            tags: ['dwa wskaźniki', 'mapa liczników w oknie', 'erase przy zerze'],
            statement: ['Ogrodnik posadził w rzędzie n krzewów; krzew i ma odmianę aᵢ. Chce wybrać jak najdłuższy spójny fragment rzędu, w którym rosną krzewy co najwyżej k różnych odmian.',
                'Wypisz długość najdłuższego takiego fragmentu i pozycję, od której się zaczyna (jeśli jest kilka — najwcześniejszą).'],
            input_format: ['W pierwszym wierszu n i k.', 'W drugim wierszu n liczb aᵢ.'],
            output_format: ['Dwie liczby: długość i pozycja początku (pozycje liczymy od 1).'],
            constraints: ['1 ≤ k ≤ n ≤ 8000', '1 ≤ aᵢ ≤ 10⁹'],
            examples: [{ input: '8 2\n1 2 1 3 3 4 3 3', note: 'Od pozycji 4 rosną 3, 3, 4, 3, 3 — tylko dwie odmiany, 5 krzewów.' }],
            hint: R`Przesuwaj prawy koniec okna i dopisuj odmianę do map<int, int> ile;. Dopóki ile.size() > k, wyrzucaj z okna krzew z lewego końca: zmniejsz jego licznik, przy zerze usuń klucz (erase) i przesuń lewy koniec. Po tym okno [lewy, prawy] jest najdłuższym dobrym oknem kończącym się na prawym — porównaj jego długość z rekordem warunkiem >, żeby przy remisie zostać przy najwcześniejszym.`,
            tests: (r) => { const d = (k, a) => `${a.length} ${k}\n${a.join(' ')}`; return [d(1, [7]), d(1, [1, 2, 1, 1]), d(2, [1, 2, 1, 3, 3, 4, 3, 3]), d(3, [5, 5, 5]), d(2, losy(r, 30, 1, 4)), d(1, losy(r, 8000, 1, 3)), d(50, losy(r, 7000, 1, 1000000000).map((x, i) => (i % 7 === 0 ? x : 1 + (x % 200)))), d(5, losy(r, 8000, 1, 30)), d(8000, losy(r, 8000, 1, 1000000))]; },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 8000) && calk(k, 1, n) && t.length === n + 2 && t.slice(2).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const [n, k] = t; const a = t.slice(2); const m = new Map(); let l = 0, naj = 0, st = 0; for (let p = 0; p < n; p++) { m.set(a[p], (m.get(a[p]) || 0) + 1); while (m.size > k) { m.set(a[l], m.get(a[l]) - 1); if (m.get(a[l]) === 0) m.delete(a[l]); l++; } if (p - l + 1 > naj) { naj = p - l + 1; st = l; } } return `${naj} ${st + 1}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<int> a(n);
    for (int i = 0; i < n; i++) cin >> a[i];
    map<int, int> ile;
    int lewy = 0, najdl = 0, start = 0;
    for (int prawy = 0; prawy < n; prawy++) {
        ile[a[prawy]]++;
        while ((int)ile.size() > k) {
            ile[a[lewy]]--;
            if (ile[a[lewy]] == 0) ile.erase(a[lewy]);
            lewy++;
        }
        if (prawy - lewy + 1 > najdl) {
            najdl = prawy - lewy + 1;
            start = lewy;
        }
    }
    cout << najdl << " " << start + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-dysk', krok: 9, level: 'srednie',
            title: 'Zajęte miejsce na dysku',
            short: 'Pliki z pełnymi ścieżkami i rozmiarami. Ile zajmuje każdy katalog razem z podkatalogami? Każdy plik dolicz do wszystkich katalogów na swojej ścieżce.',
            tags: ['klucz — początek ścieżki', 'substr do każdego ukośnika', 'suma po kluczu'],
            statement: ['Na dysku jest n plików. Każdy opisuje pełna ścieżka, np. /dom/zdjecia/kot.jpg, i rozmiar w kilobajtach. Rozmiar katalogu to suma rozmiarów wszystkich plików w nim i w jego podkatalogach. Katalog główny to /.',
                'Wypisz wszystkie katalogi z ich rozmiarami — w kolejności, w jakiej porównuje je C++ (zwykłe porównanie napisów). Ścieżkę katalogu zapisuj z ukośnikiem na końcu, np. /dom/zdjecia/.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy ścieżka pliku i rozmiar.'],
            output_format: ['Wiersze „ścieżka_katalogu rozmiar”.'],
            constraints: ['1 ≤ n ≤ 2000; ścieżki plików są różne i mają do 60 znaków', 'Nazwy katalogów i plików składają się z małych liter, cyfr i kropek; katalogów jest najwyżej 400.', 'Rozmiary: od 1 do 10⁹ (sumy przekraczają zakres int).'],
            examples: [{ input: '4\n/dom/zdjecia/kot.jpg 300\n/dom/zdjecia/pies.jpg 200\n/dom/notatki.txt 5\n/szkola/matma/zad1.cpp 2', note: 'Katalog /dom/ zawiera notatki i oba zdjęcia: 505 KB. Katalog główny — wszystko: 507 KB.' }],
            hint: R`Każdy ukośnik w ścieżce kończy nazwę jakiegoś katalogu. Przejdź po znakach ścieżki: gdy s[i] == '/', fragment s.substr(0, i + 1) to pełna ścieżka katalogu — dolicz do niego rozmiar pliku: rozmiar[s.substr(0, i + 1)] += r;. Nazwa pliku na końcu nie kończy się ukośnikiem, więc nie trafi do mapy. Mapa sama ułoży ścieżki tak, jak porównuje je C++.`,
            tests: (r) => {
                const gen = (n, nk, gl) => {
                    const kat = ['/'];
                    while (kat.length < nk) { const p = r.pick(kat); if (p.split('/').length - 2 >= gl) continue; const nowy = `${p}${r.word(r.int(1, 6), 'abcdefghij')}${r() < 0.1 ? `.${r.word(2, 'xyz')}` : ''}/`; if (nowy.length > 45 || kat.includes(nowy)) continue; kat.push(nowy); }
                    const pl = new Set(); const o = [];
                    while (o.length < n) { const f = `${r.pick(kat)}${r.word(r.int(1, 8), 'abcdefgh0123')}.${r.pick(['txt', 'jpg', 'cpp'])}`; if (f.length > 60 || pl.has(f)) continue; pl.add(f); o.push(`${f} ${r.int(1, 1000000000)}`); }
                    return `${n}\n${o.join('\n')}`;
                };
                return ['1\n/a.txt 5', '4\n/dom/zdjecia/kot.jpg 300\n/dom/zdjecia/pies.jpg 200\n/dom/notatki.txt 5\n/szkola/matma/zad1.cpp 2', '3\n/a.b/x 1\n/a/y 2\n/a/b/z 4', gen(10, 5, 3), gen(2000, 300, 6), gen(2000, 40, 3)];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000) || L.length !== n + 1) return 'n'; const pl = new Set(), kat = new Set(); for (let i = 1; i <= n; i++) { const w = L[i].split(' '); if (w.length !== 2 || w[0].length > 60 || !/^\/([a-z0-9.]+\/)*[a-z0-9.]+$/.test(w[0]) || !liczba(w[1], 1, 1e9) || pl.has(w[0])) return `plik ${i}`; pl.add(w[0]); for (let j = 0; j < w[0].length; j++) if (w[0][j] === '/') kat.add(w[0].slice(0, j + 1)); } return kat.size <= 400 ? null : 'katalogi'; },
            solve: (inp) => { const m = new Map(); for (const s of linie(inp).slice(1)) { const [p, x] = s.split(' '); for (let j = 0; j < p.length; j++) if (p[j] === '/') { const k = p.slice(0, j + 1); m.set(k, (m.get(k) || 0) + Number(x)); } } return [...m.keys()].sort(cmp).map((k) => `${k} ${m.get(k)}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, long long> rozmiar;
    for (int i = 0; i < n; i++) {
        string s;
        long long r;
        cin >> s >> r;
        for (int j = 0; j < (int)s.size(); j++)
            if (s[j] == '/') rozmiar[s.substr(0, j + 1)] += r;
    }
    for (auto [k, r] : rozmiar) cout << k << " " << r << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-zjazd-absolwentow', krok: 9, level: 'srednie',
            title: 'Zjazd absolwentów',
            short: 'Ile jest par osób z tego samego miasta, ale z różnych szkół? Policz pary z każdego miasta i odejmij pary z tej samej szkoły — mapa z kluczem-parą (miasto, szkoła).',
            tags: ['klucz-para napisów', 'k · (k − 1) / 2 par', 'odejmowanie par'],
            statement: ['Na zjazd przyjechało n absolwentów. O każdym wiemy, z jakiego jest miasta i jaką szkołę skończył (szkoły o tej samej nazwie w różnych miastach to różne szkoły).',
                'Organizatorzy chcą poznawać ze sobą osoby z tego samego miasta, ale z różnych szkół. Ile jest takich par osób?'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy miasto i szkoła.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 5000', 'Nazwy: od 1 do 12 liter i cyfr.'],
            examples: [{ input: '5\nKrakow LO5\nKrakow LO5\nKrakow SP12\nGdansk LO5\nKrakow LO1', note: 'Z Krakowa są 4 osoby — to 6 par, ale jedna para skończyła tę samą szkołę LO5. Zostaje 5.' }],
            hint: R`Z k osób da się utworzyć k · (k − 1) / 2 par. Policz osoby w map<string, long long> miasto; i w map<pair<string, string>, long long> szkola; (kluczem jest para: miasto i szkoła). Wynik to suma par po miastach minus suma par po szkołach — bo każda para z jednej szkoły jest też parą z jednego miasta. Użyj long long.`,
            tests: (r) => { const SZ = ['LO1', 'LO2', 'LO5', 'SP12', 'SP3', 'TECH', 'ZSE', 'LO10']; const gen = (n, km, ks) => { const m = r.shuffle(MI).slice(0, km); const s = SZ.slice(0, ks); return `${n}\n${Array.from({ length: n }, () => `${r.pick(m)} ${r.pick(s)}`).join('\n')}`; }; return ['1\nKrakow LO1', '2\nKrakow LO1\nKrakow LO1', '2\nKrakow LO1\nGdansk LO2', '5\nKrakow LO5\nKrakow LO5\nKrakow SP12\nGdansk LO5\nKrakow LO1', gen(20, 2, 3), gen(5000, 14, 8), gen(5000, 1, 2), gen(5000, 3, 1)]; },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 5000) && L.length === n + 1 && L.slice(1).every((s) => /^[A-Za-z0-9]{1,12} [A-Za-z0-9]{1,12}$/.test(s)) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(), s = new Map(); for (const w of linie(inp).slice(1)) { const [a] = w.split(' '); m.set(a, (m.get(a) || 0) + 1); s.set(w, (s.get(w) || 0) + 1); } let x = 0; for (const k of m.values()) x += k * (k - 1) / 2; for (const k of s.values()) x -= k * (k - 1) / 2; return String(x); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, long long> miasto;
    map<pair<string, string>, long long> szkola;
    for (int i = 0; i < n; i++) {
        string m, s;
        cin >> m >> s;
        miasto[m]++;
        szkola[{m, s}]++;
    }
    long long pary = 0;
    for (auto [m, k] : miasto) pary += k * (k - 1) / 2;
    for (auto [ms, k] : szkola) pary -= k * (k - 1) / 2;
    cout << pary << "\n";
    return 0;
}`,
        },
        // ================================================================ TRUDNE
        {
            id: 'map-b-ciag-o-roznicy', krok: 9, level: 'trudne',
            title: 'Najdłuższy ciąg o różnicy d',
            short: 'Wybierz z ciągu (zachowując kolejność) jak najdłuższy podciąg, w którym każdy wyraz jest o d większy od poprzedniego. dl[x] = dl[x − d] + 1 — mapa pamięta najlepszy wynik dla każdej wartości.',
            tags: ['mapa jako pamięć wyników', 'dl[x] = dl[x − d] + 1', 'dane z generatora'],
            statement: ['Ciąg tworzy generator z lekcji o złożoności: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m. Dostajesz też liczbę d.',
                'Wybierz z ciągu kilka wyrazów (zachowując ich kolejność, niekoniecznie sąsiednich) tak, żeby każdy kolejny był o dokładnie d większy od poprzedniego. Jak długi może być najdłuższy taki wybór? Wypisz też jego pierwszy wyraz (jeśli jest kilka możliwości — najmniejszy).'],
            input_format: ['Jeden wiersz: n s a b m d.'],
            output_format: ['Dwie liczby: długość najdłuższego wyboru i jego pierwszy wyraz.'],
            constraints: ['1 ≤ n ≤ 3 · 10⁵', '1 ≤ m ≤ 10⁹, 0 ≤ s, a, b < m', '−10⁹ ≤ d ≤ 10⁹'],
            examples: [{ input: '8 2 1 3 10 3', note: 'Ciąg: 2, 5, 8, 1, 4, 7, 0, 3. Wybory 2, 5, 8 i 1, 4, 7 mają po 3 wyrazy — mniejszy pierwszy wyraz ma ten drugi.' }],
            hint: R`Idź po ciągu i trzymaj map<long long, int> dl; — dl[v] to długość najdłuższego wyboru kończącego się wartością v wśród wyrazów już przeczytanych. Nowy wyraz x może przedłużyć najlepszy wybór kończący się na x − d: nowe = dl[x - d] + 1 (gdy takiego wyboru nie ma — 1; sprawdź przez count). Zapisz dl[x] = nowe;. Pierwszy wyraz takiego wyboru to x − (nowe − 1) · d — porównuj go z rekordem przy remisie długości.`,
            tests: (r) => ['1 5 0 0 10 7', '8 2 1 3 10 3', '6 0 1 1 5 -1', '300000 0 0 0 1 0', '300000 3 1 1 1000 1', `${losGen(r, 1000, 50)} 7`, `${losGen(r, 300000, 1000000000)} ${r.int(-1000000000, 1000000000)}`, `${losGen(r, 300000, 100)} 3`, `${losGen(r, 300000, 1000)} -1`, '300000 1 1 7 1000000000 7'],
            check: (inp) => { const t = toks(inp); return t.length === 6 && dobryGen(t, 0, 3e5, 1e9) && liczba(t[5], -1e9, 1e9) ? null : 'dane'; },
            solve: (inp) => { const [n, s, a, b, m, d] = nums(inp); const dl = new Map(); let x = s, naj = 0, pocz = 0; for (let i = 1; i <= n; i++) { if (i > 1) x = (mulmod(x, a, m) + b) % m; const nowe = dl.has(x - d) ? dl.get(x - d) + 1 : 1; dl.set(x, nowe); const p = x - (nowe - 1) * d; if (nowe > naj || (nowe === naj && p < pocz)) { naj = nowe; pocz = p; } } return `${naj} ${pocz}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m, d;
    cin >> n >> s >> a >> b >> m >> d;
    map<long long, int> dl;
    long long x = s, poczatek = 0;
    int najdl = 0;
    for (long long i = 1; i <= n; i++) {
        if (i > 1) x = (x * a + b) % m;
        int nowe = 1;
        if (dl.count(x - d)) nowe = dl[x - d] + 1;
        dl[x] = nowe;
        long long p = x - (long long)(nowe - 1) * d;
        if (nowe > najdl || (nowe == najdl && p < poczatek)) {
            najdl = nowe;
            poczatek = p;
        }
    }
    cout << najdl << " " << poczatek << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-autouzupelnianie', krok: 9, level: 'trudne',
            title: 'Autouzupełnianie',
            short: 'Wpisujesz początek słowa, a wyszukiwarka podpowiada trzy najpopularniejsze słowa z tym początkiem. Słowa o wspólnym początku leżą w mapie obok siebie — zacznij od lower_bound(początek).',
            tags: ['lower_bound na napisach', 'kolejne klucze ze wspólnym początkiem', 'top 3 z remisem'],
            statement: ['Wyszukiwarka zna n słów, każde z liczbą wyszukań (to samo słowo może pojawić się na liście kilka razy — wtedy liczby się sumują).',
                'Dla każdego z q zapytań — początku słowa p — wypisz do trzech słów zaczynających się od p: najpierw najczęściej wyszukiwane, a przy równej liczbie wyszukań alfabetycznie. Jeśli żadne słowo nie zaczyna się od p, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy słowo i liczba wyszukań.', 'Dalej q i q wierszy z początkami słów.'],
            output_format: ['q wierszy: do trzech słów oddzielonych spacjami albo BRAK.'],
            constraints: ['1 ≤ n ≤ 3000, 1 ≤ q ≤ 700', 'Słowa i początki: od 1 do 12 małych liter; liczby wyszukań: od 1 do 10⁶.'],
            examples: [{ input: '6\nkot 50\nkotlet 20\nkoszula 50\nkino 7\nkot 5\nkotara 3\n4\nko\nkot\nki\nz', note: 'kot ma razem 55 wyszukań. Na ko zaczynają się: kot (55), koszula (50), kotlet (20) i kotara (3).' }],
            hint: R`Zsumuj wyszukania w map<string, int> ile;. Wszystkie słowa zaczynające się od p leżą w mapie jedno po drugim, a pierwsze z nich wskazuje ile.lower_bound(p). Idź od niego dalej, dopóki słowo zaczyna się od p (sprawdzisz to przez it->first.substr(0, p.size()) == p), i zbieraj pary (słowo, liczba) do vectora. Posortuj go jak ranking i wypisz najwyżej trzy pierwsze słowa.`,
            tests: (r) => {
                const gen = (n, q, al, dmax) => { const sl = Array.from({ length: n }, () => r.word(r.int(1, dmax), al)); const zap = Array.from({ length: q }, () => { if (r() < 0.8) { const s = r.pick(sl); return s.slice(0, r.int(1, s.length)); } return r.word(r.int(1, 3), `${al}z`); }); return `${n}\n${sl.map((s) => `${s} ${r.int(1, 1000000)}`).join('\n')}\n${q}\n${zap.join('\n')}`; };
                const trzy = `${SL.length * 3}\n${[...SL, ...SL, ...SL].map((s) => `${s} ${r.int(1, 5)}`).join('\n')}\n700\n${Array.from({ length: 700 }, () => r.pick(SL).slice(0, r.int(1, 2))).join('\n')}`;
                return ['1\na 1\n2\na\nb', '6\nkot 50\nkotlet 20\nkoszula 50\nkino 7\nkot 5\nkotara 3\n4\nko\nkot\nki\nz', '4\nab 5\nabc 5\nabd 5\nb 9\n3\na\nab\nabcd', gen(20, 20, 'ab', 4), gen(3000, 700, 'abc', 8), gen(3000, 700, 'abcdefghijkl', 12), trzy];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 3000)) return 'n'; for (let i = 1; i <= n; i++) { const w = (L[i] || '').split(' '); if (w.length !== 2 || !/^[a-z]{1,12}$/.test(w[0]) || !liczba(w[1], 1, 1e6)) return `słowo ${i}`; } const q = Number(L[n + 1]); return calk(q, 1, 700) && L.length === n + 2 + q && L.slice(n + 2).every((p) => /^[a-z]{1,12}$/.test(p)) ? null : 'zapytania'; },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const m = new Map(); for (let i = 1; i <= n; i++) { const [s, c] = L[i].split(' '); m.set(s, (m.get(s) || 0) + Number(c)); } const sl = [...m]; return L.slice(n + 2).map((p) => { const w = ranking(sl.filter(([s]) => s.startsWith(p))).slice(0, 3); return w.length ? w.map(([s]) => s).join(' ') : 'BRAK'; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, int> ile;
    for (int i = 0; i < n; i++) {
        string s;
        int k;
        cin >> s >> k;
        ile[s] += k;
    }
    int q;
    cin >> q;
    while (q--) {
        string p;
        cin >> p;
        vector<pair<string, int>> pasuja;
        for (auto it = ile.lower_bound(p); it != ile.end() && it->first.substr(0, p.size()) == p; it++)
            pasuja.push_back({it->first, it->second});
        sort(pasuja.begin(), pasuja.end(), [](auto a, auto b) {
            if (a.second != b.second) return a.second > b.second;
            return a.first < b.first;
        });
        if (pasuja.empty()) cout << "BRAK\n";
        else {
            for (int i = 0; i < (int)pasuja.size() && i < 3; i++) cout << (i > 0 ? " " : "") << pasuja[i].first;
            cout << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'map-b-nww-wielu', krok: 9, level: 'trudne',
            title: 'NWW wielu liczb',
            short: 'NWW tysiąca liczb jest gigantyczna — ale jej rozkład na czynniki pierwsze to po prostu największy wykładnik każdej liczby pierwszej. Mapa: liczba pierwsza → największy wykładnik.',
            tags: ['rozkład na czynniki pierwsze', 'mapa: pierwsza → max wykładnik', 'wynik modulo'],
            statement: ['Dostajesz n liczb naturalnych. Ich najmniejsza wspólna wielokrotność (NWW) może być ogromna, więc wypisz ją modulo 1 000 000 007. Wypisz też, ile różnych liczb pierwszych dzieli tę NWW.',
                'Uwaga: nie da się tu liczyć NWW krok po kroku wzorem a · b / NWD(a, b) — wynik szybko przestałby się mieścić w long long, a reszty z dzielenia nie wolno po prostu dzielić.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb.'],
            output_format: ['Dwie liczby: NWW modulo 1 000 000 007 i liczba różnych liczb pierwszych w jej rozkładzie.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n12 18 7', note: '12 = 2² · 3, 18 = 2 · 3², 7 = 7. NWW = 2² · 3² · 7 = 252 — trzy różne liczby pierwsze.' }],
            hint: R`Rozłóż każdą liczbę na czynniki pierwsze: dziel przez kolejne d, dopóki d · d ≤ x, a to, co na końcu zostanie większe od 1, też jest liczbą pierwszą. Dla czynnika p z wykładnikiem e zapamiętaj największy wykładnik: wyk[p] = max(wyk[p], e);. NWW to iloczyn p do potęgi wyk[p] po wszystkich kluczach — licz go modulo 1 000 000 007, mnożąc e razy przez p i za każdym razem biorąc resztę.`,
            tests: (r) => { const d = (a) => `${a.length}\n${a.join(' ')}`; return [d([1]), d([12, 18, 7]), d([1000000000]), d([999999937, 999999929, 999999937]), d(Array.from({ length: 30 }, (_, i) => i + 1)), d(losy(r, 1000, 1, 1000000000)), d(Array.from({ length: 1000 }, () => 2 ** r.int(0, 29))), d(losy(r, 1000, 1, 1000)), d(Array.from({ length: 1000 }, () => r.pick([999999937, 999999929, 999999893, 999999883, 1000000000, 536870912])))]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; return calk(n, 1, 1000) && t.length === n + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const w = new Map(); for (let x of nums(inp).slice(1)) { for (let d = 2; d * d <= x; d++) { let e = 0; while (x % d === 0) { x /= d; e++; } if (e > 0) w.set(d, Math.max(w.get(d) || 0, e)); } if (x > 1) w.set(x, Math.max(w.get(x) || 0, 1)); } const MOD = 1000000007n; let r2 = 1n; for (const [p, e] of w) for (let k = 0; k < e; k++) r2 = (r2 * BigInt(p)) % MOD; return `${r2} ${w.size}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    const long long MOD = 1000000007;
    int n;
    cin >> n;
    map<long long, int> wyk;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        for (long long d = 2; d * d <= x; d++) {
            int e = 0;
            while (x % d == 0) {
                x /= d;
                e++;
            }
            if (e > 0) wyk[d] = max(wyk[d], e);
        }
        if (x > 1) wyk[x] = max(wyk[x], 1);
    }
    long long nww = 1;
    for (auto [p, e] : wyk)
        for (int k = 0; k < e; k++) nww = nww * p % MOD;
    cout << nww << " " << wyk.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-wspolny-przodek', krok: 9, level: 'trudne',
            title: 'Wspólny przodek',
            short: 'Drzewo rodu zapisane jako pary „dziecko rodzic”. Kto jest najbliższym wspólnym przodkiem dwóch osób? Mapa dziecko → rodzic i wędrówka w górę.',
            tags: ['mapa dziecko → rodzic', 'wędrówka w górę drzewa', 'zbiór przodków'],
            statement: ['Drzewo rodu opisuje n − 1 par „dziecko rodzic”: każda osoba oprócz założyciela rodu ma dokładnie jednego zapisanego rodzica, a wszyscy pochodzą od założyciela. Imiona są różne.',
                'Odpowiedz na q pytań „a b”: kto jest najbliższym wspólnym przodkiem osób a i b — czyli osobą, od której pochodzą obie, położoną w drzewie jak najniżej? Każdy liczy się też jako swój własny przodek, więc gdy a pochodzi od b, odpowiedzią jest b.'],
            input_format: ['W pierwszym wierszu n i q.', 'W n − 1 kolejnych wierszach pary „dziecko rodzic”.', 'W q kolejnych wierszach pytania „a b”.'],
            output_format: ['q wierszy z imionami najbliższych wspólnych przodków.'],
            constraints: ['2 ≤ n ≤ 2000, 1 ≤ q ≤ 1000', 'Imiona: od 1 do 12 liter. Drzewo może być bardzo wysokie — nawet n pokoleń.'],
            examples: [{ input: '6 3\nBasia Ala\nCelina Ala\nDarek Basia\nEwa Basia\nFranek Celina\nDarek Ewa\nFranek Ewa\nBasia Darek', note: 'Darek i Ewa to dzieci Basi. Franek i Ewa spotykają się dopiero na Ali. Darek pochodzi od Basi, więc odpowiedzią jest sama Basia.' }],
            hint: R`Zapisz map<string, string> rodzic;. Dla pytania „a b” idź od a w górę aż do założyciela i każdą osobę po drodze (zaczynając od samego a) wrzuć do set<string> przodkowie;. Potem idź w górę od b — pierwsza osoba, która jest w zbiorze, to najbliższy wspólny przodek. Założyciela rozpoznasz po tym, że nie ma go wśród kluczy mapy rodzic.`,
            tests: (r) => {
                const gen = (n, q, tryb) => { const im = rozneSlowa(r, n, 2, 9).map(duzeImie); const par = []; for (let i = 1; i < n; i++) { const p = tryb === 'lancuch' ? i - 1 : tryb === 'gleboki' ? r.int(Math.max(0, i - 3), i - 1) : r.int(0, i - 1); par.push(`${im[i]} ${im[p]}`); } const pyt = Array.from({ length: q }, () => `${r.pick(im)} ${r() < 0.05 ? im[0] : r.pick(im)}`); return `${n} ${q}\n${r.shuffle(par).join('\n')}\n${pyt.join('\n')}`; };
                return ['2 2\nBob Ala\nBob Ala\nBob Bob', '6 3\nBasia Ala\nCelina Ala\nDarek Basia\nEwa Basia\nFranek Celina\nDarek Ewa\nFranek Ewa\nBasia Darek', gen(10, 10, 'losowy'), gen(2000, 1000, 'losowy'), gen(2000, 1000, 'lancuch'), gen(2000, 1000, 'gleboki')];
            },
            check: (inp) => {
                const L = linie(inp); const [n, q] = L[0].split(' ').map(Number); if (!calk(n, 2, 2000) || !calk(q, 1, 1000) || L.length !== n + q) return 'n';
                const rodzic = new Map(); const wszyscy = new Set(); const im = /^[A-Za-z]{1,12}$/;
                for (let i = 1; i < n; i++) { const w = L[i].split(' '); if (w.length !== 2 || !im.test(w[0]) || !im.test(w[1]) || rodzic.has(w[0])) return `para ${i}`; rodzic.set(w[0], w[1]); wszyscy.add(w[0]); wszyscy.add(w[1]); }
                if (wszyscy.size !== n) return 'liczba osób';
                for (const x of wszyscy) { let y = x, k = 0; while (rodzic.has(y)) { y = rodzic.get(y); if (++k > n) return 'cykl'; } }
                for (let i = n; i < n + q; i++) { const w = L[i].split(' '); if (w.length !== 2 || !wszyscy.has(w[0]) || !wszyscy.has(w[1])) return `pytanie ${i}`; }
                return null;
            },
            solve: (inp) => { const L = linie(inp); const [n] = L[0].split(' ').map(Number); const rodzic = new Map(); for (let i = 1; i < n; i++) { const [d, p] = L[i].split(' '); rodzic.set(d, p); } return L.slice(n).map((s) => { let [a, b] = s.split(' '); const pr = new Set(); for (;;) { pr.add(a); if (!rodzic.has(a)) break; a = rodzic.get(a); } while (!pr.has(b)) b = rodzic.get(b); return b; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    map<string, string> rodzic;
    for (int i = 0; i < n - 1; i++) {
        string d, r;
        cin >> d >> r;
        rodzic[d] = r;
    }
    while (q--) {
        string a, b;
        cin >> a >> b;
        set<string> przodkowie;
        while (true) {
            przodkowie.insert(a);
            if (rodzic.count(a) == 0) break;
            a = rodzic[a];
        }
        while (przodkowie.count(b) == 0) b = rodzic[b];
        cout << b << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-b-cztery-sakiewki', krok: 9, level: 'trudne',
            title: 'Cztery sakiewki',
            short: 'Z każdej z czterech sakiewek bierzesz jedną monetę. Na ile sposobów suma wynosi dokładnie S? Zapisz w mapie sumy par z dwóch pierwszych sakiewek i dopasuj do nich pary z dwóch pozostałych.',
            tags: ['spotkanie w połowie', 'mapa sum par', 'n² zamiast n⁴'],
            statement: ['Masz cztery sakiewki, w każdej po n monet o podanych wartościach (wartości mogą się powtarzać, ale monety są rozróżnialne; wartości mogą być ujemne — to długi). Wybierasz po jednej monecie z każdej sakiewki. Na ile sposobów suma czterech wybranych monet wynosi dokładnie S?'],
            input_format: ['W pierwszym wierszu n i S.', 'W czterech kolejnych wierszach — po n wartości monet z kolejnych sakiewek.'],
            output_format: ['Jedna liczba — liczba sposobów.'],
            constraints: ['1 ≤ n ≤ 400', '−10⁹ ≤ wartości ≤ 10⁹, −4 · 10⁹ ≤ S ≤ 4 · 10⁹'],
            examples: [{ input: '2 10\n1 2\n3 4\n2 5\n1 3', note: 'Pasują wybory 1 + 3 + 5 + 1, 1 + 4 + 2 + 3 i 2 + 3 + 2 + 3 — razem 3.' }],
            hint: R`Wszystkich czwórek jest n⁴ — za dużo. Rozdziel je na dwie połówki: zapisz w map<long long, long long> ile; wszystkie sumy a + b z dwóch pierwszych sakiewek (n² sum). Potem dla każdej pary c + d z dwóch pozostałych dolicz do wyniku liczbę par (a, b) z sumą S − c − d. Szukaj jej przez find albo count — nawiasy dopisywałyby do mapy n² nowych kluczy. Wynik może być ogromny: long long.`,
            tests: (r) => { const d = (S, W) => `${W[0].length} ${S}\n${W.map((w) => w.join(' ')).join('\n')}`; const los = (n, lo, hi) => Array.from({ length: 4 }, () => losy(r, n, lo, hi)); const W1 = los(400, -1000000000, 1000000000); return [d(0, [[0], [0], [0], [0]]), d(10, [[1, 2], [3, 4], [2, 5], [1, 3]]), d(5, [[1], [1], [1], [1]]), d(0, los(30, -3, 3)), d(0, los(400, -5, 5)), d(W1[0][7] + W1[1][3] + W1[2][100] + W1[3][399], W1), d(4000000000, Array.from({ length: 4 }, () => Array(400).fill(1000000000))), d(-17, los(400, -20, 20))]; },
            check: (inp) => { const t = nums(inp); const [n, S] = t; return calk(n, 1, 400) && calk(S, -4e9, 4e9) && t.length === 2 + 4 * n && t.slice(2).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const [n, S] = t; const w = [0, 1, 2, 3].map((k) => t.slice(2 + k * n, 2 + (k + 1) * n)); const m = new Map(); for (const a of w[0]) for (const b of w[1]) m.set(a + b, (m.get(a + b) || 0) + 1); let x = 0; for (const c of w[2]) for (const e of w[3]) x += m.get(S - c - e) || 0; return String(x); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long S;
    cin >> n >> S;
    vector<long long> A(n), B(n), C(n), D(n);
    for (auto &x : A) cin >> x;
    for (auto &x : B) cin >> x;
    for (auto &x : C) cin >> x;
    for (auto &x : D) cin >> x;
    map<long long, long long> ile;
    for (long long a : A)
        for (long long b : B) ile[a + b]++;
    long long sposoby = 0;
    for (long long c : C)
        for (long long d : D) {
            auto it = ile.find(S - c - d);
            if (it != ile.end()) sposoby += it->second;
        }
    cout << sposoby << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-prostokaty', krok: 9, level: 'trudne',
            title: 'Prostokąty z gwoździ',
            short: 'Na tablicy wbito n gwoździ. Ile prostokątów o bokach równoległych do krawędzi tablicy ma gwoździe we wszystkich czterech rogach? Dla każdej kolumny zapisz w mapie pary wysokości.',
            tags: ['klucz-para (y₁, y₂)', 'grupowanie po kolumnach', 'k · (k − 1) / 2'],
            statement: ['Na tablicy wbito n gwoździ w punktach o współrzędnych całkowitych (każdy w innym punkcie). Policz prostokąty o bokach poziomych i pionowych, które mają gwoździe we wszystkich czterech wierzchołkach.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy x i y.'],
            output_format: ['Jedna liczba — liczba prostokątów.'],
            constraints: ['1 ≤ n ≤ 800', '−10⁹ ≤ x, y ≤ 10⁹'],
            examples: [{ input: '6\n0 0\n0 2\n3 0\n3 2\n5 0\n5 2', note: 'Trzy kolumny mają gwoździe na wysokościach 0 i 2. Każde dwie z nich tworzą prostokąt: 3 prostokąty.' }],
            hint: R`Prostokąt wyznaczają dwie kolumny i dwie wysokości y₁ < y₂, na których w obu kolumnach są gwoździe. Zbierz gwoździe w map<int, vector<int>> kolumna; (x → lista wysokości) i posortuj każdą listę. W każdej kolumnie przejdź wszystkie pary wysokości y₁ < y₂ i zwiększ licznik ile[{y1, y2}]. Para wysokości obecna w k kolumnach daje k · (k − 1) / 2 prostokątów.`,
            tests: (r) => { const d = (P2) => `${P2.length}\n${P2.map(([x, y]) => `${x} ${y}`).join('\n')}`; const rozne = (n, Rr) => { const s = new Set(); const o = []; while (o.length < n) { const x = r.int(-Rr, Rr), y = r.int(-Rr, Rr); if (s.has(`${x},${y}`)) continue; s.add(`${x},${y}`); o.push([x, y]); } return o; }; const siatka = (k) => { const o = []; for (let i = 0; i < k; i++) for (let j = 0; j < k; j++) o.push([i * 1000 - 1000000000, j * 7]); return r.shuffle(o); }; return [d([[0, 0]]), d([[0, 0], [0, 2], [3, 0], [3, 2], [5, 0], [5, 2]]), d([[0, 0], [1, 1], [0, 1], [1, 0]]), d(rozne(20, 3)), d(siatka(28)), d(rozne(800, 15)), d(rozne(800, 1000000000)), d(r.shuffle([...Array.from({ length: 400 }, (_, i) => [5, i * 3]), ...Array.from({ length: 400 }, (_, i) => [-7, i * 3])])), d(Array.from({ length: 800 }, (_, i) => [0, i - 400]))]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 800) || t.length !== 1 + 2 * n) return 'n'; const s = new Set(); for (let i = 0; i < n; i++) { const x = t[1 + 2 * i], y = t[2 + 2 * i]; if (!calk(x, -1e9, 1e9) || !calk(y, -1e9, 1e9) || s.has(`${x},${y}`)) return 'punkt'; s.add(`${x},${y}`); } return null; },
            solve: (inp) => { const t = nums(inp); const k = new Map(); for (let i = 0; i < t[0]; i++) { const x = t[1 + 2 * i], y = t[2 + 2 * i]; if (!k.has(x)) k.set(x, []); k.get(x).push(y); } const m = new Map(); for (const v of k.values()) { v.sort((a, b) => a - b); for (let i = 0; i < v.length; i++) for (let j = i + 1; j < v.length; j++) { const key = `${v[i]},${v[j]}`; m.set(key, (m.get(key) || 0) + 1); } } let w = 0; for (const c of m.values()) w += c * (c - 1) / 2; return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, vector<int>> kolumna;
    for (int i = 0; i < n; i++) {
        int x, y;
        cin >> x >> y;
        kolumna[x].push_back(y);
    }
    map<pair<int, int>, long long> ile;
    for (auto &[x, v] : kolumna) {
        sort(v.begin(), v.end());
        for (int i = 0; i < (int)v.size(); i++)
            for (int j = i + 1; j < (int)v.size(); j++) ile[{v[i], v[j]}]++;
    }
    long long wynik = 0;
    for (auto [para, k] : ile) wynik += k * (k - 1) / 2;
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'map-b-wyszukiwarka', krok: 9, level: 'trudne',
            title: 'Wyszukiwarka dokumentów',
            short: 'Dla każdego słowa — zbiór numerów dokumentów, w których występuje. Zapytanie z kilkoma słowami to część wspólna zbiorów: przejdź najmniejszy i sprawdzaj pozostałe.',
            tags: ['map<string, set<int>>', 'indeks odwrócony', 'część wspólna zbiorów'],
            statement: ['Dostajesz n dokumentów — każdy to jeden wiersz tekstu; dokumenty numerujemy od 1. Potem przychodzi q zapytań; każde to kilka słów.',
                'Dla każdego zapytania policz dokumenty, które zawierają wszystkie słowa zapytania, i wypisz ich liczbę, a jeśli jest co najmniej jeden — także numer pierwszego i ostatniego z nich.'],
            input_format: ['W pierwszym wierszu n.', 'W n kolejnych wierszach dokumenty.', 'Dalej q i q wierszy z zapytaniami.'],
            output_format: ['q wierszy: liczba pasujących dokumentów, a po niej (gdy nie jest zerem) numer najmniejszego i największego z nich.'],
            constraints: ['1 ≤ n ≤ 1000, 1 ≤ q ≤ 1000', 'Dokument ma od 1 do 10 słów, zapytanie — od 1 do 4 słów; słowa mają od 1 do 10 małych liter i są oddzielone pojedynczymi spacjami.'],
            examples: [{ input: '4\nala ma kota\nkot ma ale\nala ma psa i kota\npies\n3\nala kota\nma\nkot pies', note: 'Słowa ala i kota są razem w dokumentach 1 i 3. Słowo ma jest w 1, 2 i 3. Kot i pies nigdy nie są w jednym dokumencie.' }],
            hint: R`Budując indeks, dla każdego słowa każdego dokumentu wykonaj gdzie[s].insert(nr); — zbiór sam usunie powtórzenia i ułoży numery rosnąco. Przy zapytaniu najpierw sprawdź, czy każde słowo jest w mapie (count); jeśli któregoś brakuje, wynik to 0. Potem wybierz słowo z najmniejszym zbiorem i przejdź jego numery: dokument pasuje, jeśli jest też w zbiorach pozostałych słów (count).`,
            tests: (r) => { const gen = (n, q, pula, maxS) => { const docs = Array.from({ length: n }, () => Array.from({ length: r.int(1, maxS) }, () => r.pick(pula)).join(' ')); const zap = Array.from({ length: q }, () => Array.from({ length: r.int(1, 4) }, () => (r() < 0.9 ? r.pick(pula) : r.word(r.int(3, 6)))).join(' ')); return `${n}\n${docs.join('\n')}\n${q}\n${zap.join('\n')}`; }; return ['1\nkot\n2\nkot\npies', '4\nala ma kota\nkot ma ale\nala ma psa i kota\npies\n3\nala kota\nma\nkot pies', '3\na a a\nb\na b\n3\na\na b\nb b', gen(10, 10, SL.slice(0, 6), 4), gen(1000, 1000, SL, 10), gen(1000, 1000, SL.slice(0, 10), 10), gen(1000, 1000, SL.slice(0, 3), 3)]; },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n'; for (let i = 1; i <= n; i++) if (!/^[a-z]{1,10}( [a-z]{1,10}){0,9}$/.test(L[i] || '')) return `dokument ${i}`; const q = Number(L[n + 1]); return calk(q, 1, 1000) && L.length === n + 2 + q && L.slice(n + 2).every((s) => /^[a-z]{1,10}( [a-z]{1,10}){0,3}$/.test(s)) ? null : 'zapytania'; },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const g = new Map(); for (let i = 1; i <= n; i++) for (const s of L[i].split(' ')) { if (!g.has(s)) g.set(s, new Set()); g.get(s).add(i); } return L.slice(n + 2).map((z) => { const sl = z.split(' '); if (!sl.every((s) => g.has(s))) return '0'; let naj = sl[0]; for (const s of sl) if (g.get(s).size < g.get(naj).size) naj = s; const w = [...g.get(naj)].filter((d) => sl.every((s) => g.get(s).has(d))); return w.length ? `${w.length} ${w[0]} ${w[w.length - 1]}` : '0'; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    string w;
    getline(cin, w);
    map<string, set<int>> gdzie;
    for (int nr = 1; nr <= n; nr++) {
        getline(cin, w);
        stringstream ss(w);
        string s;
        while (ss >> s) gdzie[s].insert(nr);
    }
    int q;
    cin >> q;
    getline(cin, w);
    while (q--) {
        getline(cin, w);
        stringstream ss(w);
        vector<string> slowa;
        string s;
        bool wszystkieZnane = true;
        while (ss >> s) {
            slowa.push_back(s);
            if (gdzie.count(s) == 0) wszystkieZnane = false;
        }
        vector<int> pasuja;
        if (wszystkieZnane) {
            string najmniejszy = slowa[0];
            for (auto &x : slowa)
                if (gdzie[x].size() < gdzie[najmniejszy].size()) najmniejszy = x;
            for (int d : gdzie[najmniejszy]) {
                bool wszedzie = true;
                for (auto &x : slowa)
                    if (gdzie[x].count(d) == 0) wszedzie = false;
                if (wszedzie) pasuja.push_back(d);
            }
        }
        cout << pasuja.size();
        if (!pasuja.empty()) cout << " " << pasuja.front() << " " << pasuja.back();
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-b-final-baza-danych', krok: 9, level: 'trudne',
            title: 'Wielki finał: baza danych z transakcjami',
            short: 'SET, GET, DELETE i COUNT — a do tego transakcje BEGIN, ROLLBACK i COMMIT, także zagnieżdżone. Dwie mapy w zgodzie i stos dzienników zmian.',
            tags: ['dwie mapy w zgodzie', 'dziennik zmian do cofania', 'zagnieżdżone transakcje'],
            statement: ['Napisz prostą bazę danych, która przechowuje pary klucz → wartość (klucze to słowa, wartości — liczby całkowite). Polecenia:',
                'SET k v — ustaw wartość klucza k na v;',
                'GET k — wypisz wartość klucza k albo NULL, jeśli klucza nie ma;',
                'DELETE k — usuń klucz k (jeśli go nie ma, nic się nie dzieje);',
                'COUNT v — wypisz, ile kluczy ma teraz wartość v;',
                'BEGIN — rozpocznij transakcję (transakcje mogą być zagnieżdżone: BEGIN w trakcie innej transakcji otwiera nową, wewnętrzną);',
                'ROLLBACK — cofnij wszystkie zmiany z ostatnio otwartej transakcji i ją zamknij; jeśli żadna nie jest otwarta, wypisz BRAK TRANSAKCJI;',
                'COMMIT — zatwierdź i zamknij wszystkie otwarte transakcje (zmiany zostają); jeśli żadna nie jest otwarta, wypisz BRAK TRANSAKCJI.'],
            input_format: ['W pierwszym wierszu q.', 'W q kolejnych wierszach polecenia.'],
            output_format: ['Odpowiedzi na GET i COUNT oraz komunikaty BRAK TRANSAKCJI — każde w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 4000', 'Klucze: od 1 do 10 małych liter; wartości: od −10⁹ do 10⁹.'],
            examples: [
                { input: '10\nSET a 10\nSET b 10\nCOUNT 10\nBEGIN\nSET a 20\nGET a\nROLLBACK\nGET a\nCOUNT 10\nROLLBACK', note: 'ROLLBACK przywraca a = 10, więc znów dwa klucze mają wartość 10. Drugi ROLLBACK nie ma już czego cofać.' },
                { input: '9\nBEGIN\nSET x 1\nBEGIN\nDELETE x\nGET x\nROLLBACK\nGET x\nCOMMIT\nGET x', note: 'Wewnętrzny ROLLBACK cofa tylko usunięcie x. COMMIT zatwierdza x = 1 na stałe.' },
            ],
            hint: R`Trzymaj map<string, long long> baza; i map<long long, int> ile; (wartość → ile kluczy ją ma). Każda zmiana klucza poprawia obie mapy: najpierw zdejmij starą wartość z licznika, potem dopisz nową. Transakcje to vector map: dziennik.back() pamięta dla każdego klucza zmienionego w ostatniej transakcji jego stan sprzed niej — czy był i z jaką wartością (pair<bool, long long>). Zapisuj go tylko przy pierwszej zmianie tego klucza w tej transakcji. ROLLBACK przywraca zapisane stany i usuwa ostatnią mapę z vectora, a COMMIT czyści cały vector.`,
            tests: (r) => {
                const gen = (q, klucze, wart, pTx) => { const o = []; for (let i = 0; i < q; i++) { const x = r(); const reszta = (x - pTx) / (1 - pTx); if (x < pTx) { const y = r(); o.push(y < 0.45 ? 'BEGIN' : y < 0.85 ? 'ROLLBACK' : 'COMMIT'); } else if (reszta < 0.4) o.push(`SET ${r.pick(klucze)} ${r.pick(wart)}`); else if (reszta < 0.55) o.push(`DELETE ${r.pick(klucze)}`); else if (reszta < 0.8) o.push(`GET ${r.pick(klucze)}`); else o.push(`COUNT ${r.pick(wart)}`); } return `${q}\n${o.join('\n')}`; };
                const K = rozneSlowa(r, 40, 1, 6); const V = [...losy(r, 10, -1000000000, 1000000000), 0, 1, 2, 3, -1];
                return ['1\nGET a', '10\nSET a 10\nSET b 10\nCOUNT 10\nBEGIN\nSET a 20\nGET a\nROLLBACK\nGET a\nCOUNT 10\nROLLBACK', '9\nBEGIN\nSET x 1\nBEGIN\nDELETE x\nGET x\nROLLBACK\nGET x\nCOMMIT\nGET x', '3\nCOMMIT\nROLLBACK\nCOUNT 0', gen(30, ['a', 'b', 'c'], [1, 2, 3], 0.25), gen(4000, K, V, 0.15), gen(4000, ['x', 'y'], [5, 7], 0.3), gen(4000, K.slice(0, 10), [1, 2], 0.05)];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 4000) || L.length !== q + 1) return 'q'; const k = (s) => /^[a-z]{1,10}$/.test(s); for (let i = 1; i <= q; i++) { const w = L[i].split(' '); const ok = (w[0] === 'SET' && w.length === 3 && k(w[1]) && liczba(w[2], -1e9, 1e9)) || ((w[0] === 'GET' || w[0] === 'DELETE') && w.length === 2 && k(w[1])) || (w[0] === 'COUNT' && w.length === 2 && liczba(w[1], -1e9, 1e9)) || (['BEGIN', 'ROLLBACK', 'COMMIT'].includes(w[0]) && w.length === 1); if (!ok) return `polecenie ${i}`; } return null; },
            solve: (inp) => {
                const baza = new Map(), ile = new Map(); const dz = []; const o = [];
                const zdejmij = (k) => { if (baza.has(k)) { const v = baza.get(k); ile.set(v, ile.get(v) - 1); baza.delete(k); } };
                const ustaw = (k, v) => { baza.set(k, v); ile.set(v, (ile.get(v) || 0) + 1); };
                for (const s of linie(inp).slice(1)) {
                    const w = s.split(' ');
                    if (w[0] === 'SET' || w[0] === 'DELETE') { const k = w[1]; const top = dz[dz.length - 1]; if (top && !top.has(k)) top.set(k, baza.has(k) ? [true, baza.get(k)] : [false, 0]); zdejmij(k); if (w[0] === 'SET') ustaw(k, Number(w[2])); }
                    else if (w[0] === 'GET') o.push(baza.has(w[1]) ? String(baza.get(w[1])) : 'NULL');
                    else if (w[0] === 'COUNT') o.push(String(ile.get(Number(w[1])) || 0));
                    else if (w[0] === 'BEGIN') dz.push(new Map());
                    else if (w[0] === 'ROLLBACK') { if (!dz.length) o.push('BRAK TRANSAKCJI'); else for (const [k, [byl, v]] of dz.pop()) { zdejmij(k); if (byl) ustaw(k, v); } }
                    else { if (!dz.length) o.push('BRAK TRANSAKCJI'); dz.length = 0; }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    map<string, long long> baza;
    map<long long, int> ile;
    // dla każdej otwartej transakcji: klucz → stan sprzed niej (czy był, jaka wartość)
    vector<map<string, pair<bool, long long>>> dziennik;
    while (q--) {
        string p;
        cin >> p;
        if (p == "SET" || p == "DELETE") {
            string k;
            cin >> k;
            long long v = 0;
            if (p == "SET") cin >> v;
            if (!dziennik.empty() && dziennik.back().count(k) == 0) {
                if (baza.count(k)) dziennik.back()[k] = {true, baza[k]};
                else dziennik.back()[k] = {false, 0};
            }
            if (baza.count(k)) {
                ile[baza[k]]--;
                baza.erase(k);
            }
            if (p == "SET") {
                baza[k] = v;
                ile[v]++;
            }
        } else if (p == "GET") {
            string k;
            cin >> k;
            if (baza.count(k)) cout << baza[k] << "\n";
            else cout << "NULL\n";
        } else if (p == "COUNT") {
            long long v;
            cin >> v;
            if (ile.count(v)) cout << ile[v] << "\n";
            else cout << 0 << "\n";
        } else if (p == "BEGIN") {
            dziennik.push_back({});
        } else if (p == "ROLLBACK") {
            if (dziennik.empty()) {
                cout << "BRAK TRANSAKCJI\n";
                continue;
            }
            for (auto &[k, stan] : dziennik.back()) {
                if (baza.count(k)) {
                    ile[baza[k]]--;
                    baza.erase(k);
                }
                if (stan.first) {
                    baza[k] = stan.second;
                    ile[stan.second]++;
                }
            }
            dziennik.pop_back();
        } else {
            if (dziennik.empty()) cout << "BRAK TRANSAKCJI\n";
            dziennik.clear();
        }
    }
    return 0;
}`,
        },
    ];
};
