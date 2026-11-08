// Pair — ćwiczenia w trakcie lekcji, części 5–8: rozpakowywanie i pary w parach (auto [a, b], auto &[a, b],
// trójki i daty), pary na planszy (kierunki, robot, skoczek, obroty), sortowanie par (sort, klucz na pierwszym
// miejscu, minus, para (wartość, numer), ex aequo) i pary na olimpiadzie (scalanie przedziałów, zdarzenia,
// najbliższa para, zachłanny wybór, serie). Uczeń zna sort z części 7 tej lekcji, ale nie vector ani funkcje.
// Pola short i tags trafiają na kartę zadania w lekcji, reszta — do sprawdzarki.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Kacper', 'Wiktoria'];
    const DRUZYNY = ['Orly', 'Lwy', 'Rekiny', 'Wilki', 'Sokoly', 'Niedzwiedzie', 'Pumy', 'Tygrysy', 'Jastrzebie', 'Delfiny', 'Bizony',
        'Pantery', 'Kondory', 'Smoki', 'Gryfy', 'Feniksy', 'Komety', 'Meteory', 'Burze', 'Pioruny'];
    const KRAJE = ['Polska', 'Niemcy', 'Francja', 'Hiszpania', 'Wlochy', 'Norwegia', 'Szwecja', 'Finlandia', 'Czechy', 'Slowacja', 'Wegry',
        'Austria', 'Szwajcaria', 'Holandia', 'Belgia', 'Dania', 'Japonia', 'Kanada', 'Brazylia', 'Kenia', 'Chiny', 'Australia', 'Meksyk', 'Egipt'];
    const lines = (s) => s.split('\n');
    const p2 = (x) => String(x).padStart(2, '0');
    const cmp = (a, b) => { for (let i = 0; i < a.length; i++) { if (a[i] < b[i]) return -1; if (a[i] > b[i]) return 1; } return 0; };
    const data = (d, m, r) => `${p2(d)}.${p2(m)}.${r}`;
    const RUCH = [[-1, 0], [0, 1], [1, 0], [0, -1]];
    const KIER = 'GPDL';
    const znaki = (r, n, alfabet) => Array.from({ length: n }, () => alfabet[Math.floor(r() * alfabet.length)]).join('');

    return [
        // ================================================================ KROK 5 · rozpakowywanie i pary w parach
        {
            id: 'pair-daty-skrajne', krok: 5, level: 'latwe',
            title: 'Najwcześniejsza i najpóźniejsza data',
            short: 'Daty jako pary (rok, (miesiąc, dzień)) porównują się chronologicznie. Znajdź skrajne.',
            tags: ['pair<int, pair<int, int>>', 'min i max', 'DD.MM.RRRR'],
            statement: ['Wczytaj n dat. Wypisz najwcześniejszą z nich, a w drugim wierszu najpóźniejszą — obie w postaci DD.MM.RRRR (dzień i miesiąc zawsze dwucyfrowo).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach daty: dzień, miesiąc i rok.'],
            output_format: ['Dwa wiersze: najwcześniejsza i najpóźniejsza data.'],
            constraints: ['1 ≤ n ≤ 1000', 'Daty są poprawne, lata od 1900 do 2100.'],
            examples: [{ input: '4\n8 11 2026\n24 12 2025\n1 1 2026\n31 12 2026' }],
            hint: R`Zapisz datę jako pair<int, pair<int, int>> d = {rok, {miesiac, dzien}};. Takie pary porównują się chronologicznie: najpierw rok, potem miesiąc, potem dzień. Rekordy aktualizuj przez min i max. Przy wypisywaniu dzień to d.second.second.`,
            tests: (r) => {
                const d = () => `${r.int(1, 28)} ${r.int(1, 12)} ${r.int(1900, 2100)}`;
                return ['4\n8 11 2026\n24 12 2025\n1 1 2026\n31 12 2026', '1\n5 5 2005', `1000\n${Array.from({ length: 1000 }, d).join('\n')}`, `30\n${Array.from({ length: 30 }, () => `${r.int(1, 28)} ${r.int(1, 12)} 2026`).join('\n')}`, `20\n${Array.from({ length: 20 }, () => `${r.int(1, 28)} 5 2026`).join('\n')}`];
            },
            solve: (inp) => { const v = nums(inp); const t = []; for (let i = 0; i < v[0]; i++) { const [d, m, y] = v.slice(1 + 3 * i, 4 + 3 * i); t.push([y, m, d]); } let a = t[0], b = t[0]; for (const x of t) { if (cmp(x, a) < 0) a = x; if (cmp(x, b) > 0) b = x; } return `${data(a[2], a[1], a[0])}\n${data(b[2], b[1], b[0])}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, pair<int, int>> najw, najp;
    for (int i = 0; i < n; i++) {
        int d, m, r;
        cin >> d >> m >> r;
        pair<int, pair<int, int>> x = {r, {m, d}};
        if (i == 0) {
            najw = x;
            najp = x;
        }
        najw = min(najw, x);
        najp = max(najp, x);
    }
    for (int k = 0; k < 2; k++) {
        pair<int, pair<int, int>> x = (k == 0 ? najw : najp);
        if (x.second.second < 10) cout << "0";
        cout << x.second.second << ".";
        if (x.second.first < 10) cout << "0";
        cout << x.second.first << "." << x.first << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-tabela-ligowa', krok: 5, level: 'srednie',
            title: 'Tabela ligowa',
            short: 'Mistrz ligi: najwięcej punktów, potem lepszy bilans bramek, potem więcej strzelonych.',
            tags: ['para w parze', '{pkt, {bilans, gole}}', 'ostro większa'],
            statement: ['Wczytaj wyniki n drużyn: nazwę, liczbę punktów, liczbę bramek strzelonych i straconych. Mistrzem zostaje drużyna z największą liczbą punktów. Przy równej liczbie punktów decyduje bilans bramek (strzelone minus stracone), a przy równym bilansie — więcej strzelonych bramek. Jeśli i to jest równe, mistrzem zostaje drużyna wcześniejsza na liście. Wypisz nazwę mistrza.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach: nazwa, punkty, bramki strzelone, bramki stracone.'],
            output_format: ['Nazwa mistrza.'],
            constraints: ['1 ≤ n ≤ 100', '0 ≤ punkty ≤ 100', '0 ≤ bramki ≤ 200'],
            examples: [{ input: '3\nOrly 50 40 20\nLwy 50 45 25\nRekiny 48 70 10', note: 'Orły i Lwy mają po 50 punktów i bilans +20. Lwy strzeliły więcej bramek.' }],
            hint: R`Ułóż klucz drużyny jako pair<int, pair<int, int>> {punkty, {strzelone - stracone, strzelone}} — w kolejności kryteriów. Trzymaj rekord i zmieniaj go tylko przy ostro większym kluczu.`,
            tests: (r) => {
                const gen = (n, pk) => { const nz = r.shuffle(DRUZYNY).slice(0, Math.min(n, DRUZYNY.length)); const t = nz.map((x) => `${x} ${r.int(pk[0], pk[1])} ${r.int(30, 40)} ${r.int(20, 30)}`); return `${t.length}\n${t.join('\n')}`; };
                return ['3\nOrly 50 40 20\nLwy 50 45 25\nRekiny 48 70 10', '1\nOrly 0 0 0', gen(20, [40, 42]), gen(20, [0, 100]), '3\nOrly 10 5 5\nLwy 10 6 6\nPumy 10 6 6'];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); let best = null, nz = ''; for (let i = 0; i < n; i++) { const [a, p, s, st] = t.slice(1 + 4 * i, 5 + 4 * i); const k = [Number(p), Number(s) - Number(st), Number(s)]; if (!best || cmp(k, best) > 0) { best = k; nz = a; } } return nz; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, pair<int, int>> rekord;
    string mistrz;
    for (int i = 0; i < n; i++) {
        string nazwa;
        int p, s, st;
        cin >> nazwa >> p >> s >> st;
        pair<int, pair<int, int>> k = {p, {s - st, s}};
        if (i == 0 || k > rekord) {
            rekord = k;
            mistrz = nazwa;
        }
    }
    cout << mistrz << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-odwroc-wszystkie', krok: 5, level: 'latwe',
            title: 'Odwróć wszystkie pary',
            short: 'Zamień przegródki w każdej parze pętlą for (auto &[a, b] : …) i znajdź największą parę.',
            tags: ['auto &[a, b]', 'swap', 'max par'],
            statement: ['Wczytaj n par liczb. W każdej parze zamień miejscami przegródki, a potem wypisz wszystkie pary po zamianie, każdą w osobnym wierszu. W ostatnim wierszu wypisz największą z nich (według zasad porównywania par).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby.'],
            output_format: ['n wierszy z parami po zamianie i wiersz z największą parą.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ liczby ≤ 10⁹'],
            examples: [{ input: '3\n1 9\n5 2\n3 9', note: 'Po zamianie: (9, 1), (2, 5), (9, 3). Największa jest (9, 3).' }],
            hint: R`Zamiana w miejscu: for (int i = 0; i < n; i++) { auto &[a, b] = t[i]; swap(a, b); }. Z & zmieniasz prawdziwe przegródki — bez & zamieniłbyś tylko kopie.`,
            tests: (r) => ['3\n1 9\n5 2\n3 9', '1\n4 4', `1000\n${Array.from({ length: 1000 }, () => `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`).join('\n')}`, `30\n${Array.from({ length: 30 }, () => `${r.int(-3, 3)} ${r.int(-3, 3)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const t = []; for (let i = 0; i < v[0]; i++) t.push([v[2 + 2 * i], v[1 + 2 * i]]); let b = t[0]; for (const x of t) if (cmp(x, b) > 0) b = x; return [...t.map((x) => x.join(' ')), b.join(' ')].join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    for (int i = 0; i < n; i++) {
        auto &[a, b] = t[i];
        swap(a, b);
    }
    pair<int, int> najw = t[0];
    for (int i = 0; i < n; i++) {
        cout << t[i].first << " " << t[i].second << "\n";
        najw = max(najw, t[i]);
    }
    cout << najw.first << " " << najw.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-najwiekszy-prostokat', krok: 5, level: 'latwe',
            title: 'Największy prostokąt',
            short: 'Prostokąty jako pary (szerokość, wysokość). Który ma największe pole?',
            tags: ['auto [szer, wys]', 'long long', 'pierwszy przy remisie'],
            statement: ['Wczytaj n prostokątów — każdy jako szerokość i wysokość. Wypisz największe pole i numer prostokąta, który je ma (prostokąty numerujemy od 1). Jeśli kilka prostokątów ma to samo największe pole, wybierz ten o najmniejszym numerze.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach szerokość i wysokość.'],
            output_format: ['Dwie liczby: największe pole i numer prostokąta.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ szerokość, wysokość ≤ 10⁹'],
            examples: [{ input: '3\n3 4\n2 6\n5 2', note: 'Pola to 12, 12 i 10. Największe pole 12 ma najpierw prostokąt 1.' }],
            hint: R`Rozpakuj parę: auto [szer, wys] = t[i];. Pole może dojść do 10¹⁸ — licz je w long long: (long long)szer * wys. Rekord zmieniaj tylko przy ostro większym polu.`,
            tests: (r) => ['3\n3 4\n2 6\n5 2', '1\n1000000000 1000000000', `1000\n${Array.from({ length: 1000 }, () => `${r.int(1, 1e9)} ${r.int(1, 1e9)}`).join('\n')}`, `50\n${Array.from({ length: 50 }, () => `${r.int(1, 6)} ${r.int(1, 6)}`).join('\n')}`],
            solve: (inp) => { const t = toks(inp).map(BigInt); const n = Number(t[0]); let b = -1n, k = 0; for (let i = 0; i < n; i++) { const p = t[1 + 2 * i] * t[2 + 2 * i]; if (p > b) { b = p; k = i + 1; } } return `${b} ${k}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    long long najw = -1;
    int ktory = 0;
    for (int i = 0; i < n; i++) {
        auto [szer, wys] = t[i];
        long long pole = (long long)szer * wys;
        if (pole > najw) {
            najw = pole;
            ktory = i + 1;
        }
    }
    cout << najw << " " << ktory << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-najszybsze-okrazenie', krok: 5, level: 'latwe',
            title: 'Najszybsze okrążenie',
            short: 'Czasy okrążeń (minuty, sekundy, setne) jako para w parze. Które okrążenie było najszybsze?',
            tags: ['pair<int, pair<int, int>>', 'min', 'M:SS.CC'],
            statement: ['Kierowca przejechał n okrążeń toru. Czas każdego okrążenia to minuty, sekundy i setne części sekundy. Wypisz numer najszybszego okrążenia (numerujemy od 1) i jego czas w postaci M:SS.CC — minuty bez zer z przodu, sekundy i setne zawsze dwucyfrowo. Jeśli kilka okrążeń ma ten sam najlepszy czas, wybierz wcześniejsze.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach: minuty, sekundy i setne.'],
            output_format: ['Numer okrążenia i czas, oddzielone spacją.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ minuty ≤ 9', '0 ≤ sekundy ≤ 59', '0 ≤ setne ≤ 99'],
            examples: [{ input: '3\n1 32 45\n1 31 99\n1 32 5' }],
            hint: R`Zapisz czas jako pair<int, pair<int, int>> {minuty, {sekundy, setne}} — porównuje się dokładnie jak czasy. Szukaj najmniejszej pary; zmieniaj rekord tylko przy ostro mniejszej, wtedy przy remisie zostaje wcześniejsze okrążenie.`,
            tests: (r) => ['3\n1 32 45\n1 31 99\n1 32 5', '1\n0 0 0', `1000\n${Array.from({ length: 1000 }, () => `${r.int(0, 9)} ${r.int(0, 59)} ${r.int(0, 99)}`).join('\n')}`, `40\n${Array.from({ length: 40 }, () => `1 ${r.int(30, 31)} ${r.int(0, 3)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); let b = null, k = 0; for (let i = 0; i < v[0]; i++) { const x = v.slice(1 + 3 * i, 4 + 3 * i); if (!b || cmp(x, b) < 0) { b = x; k = i + 1; } } return `${k} ${b[0]}:${p2(b[1])}.${p2(b[2])}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, pair<int, int>> najl;
    int ktore = 0;
    for (int i = 1; i <= n; i++) {
        int m, s, c;
        cin >> m >> s >> c;
        pair<int, pair<int, int>> t = {m, {s, c}};
        if (i == 1 || t < najl) {
            najl = t;
            ktore = i;
        }
    }
    cout << ktore << " " << najl.first << ":";
    if (najl.second.first < 10) cout << "0";
    cout << najl.second.first << ".";
    if (najl.second.second < 10) cout << "0";
    cout << najl.second.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-najstarszy', krok: 5, level: 'srednie',
            title: 'Kto jest najstarszy?',
            short: 'Najstarszy to ten z najwcześniejszą datą urodzenia. Daty jako (rok, (miesiąc, dzień)).',
            tags: ['data jako para w parze', 'najwcześniejsza', 'imię osobno'],
            statement: ['Wczytaj n osób: imię i datę urodzenia (dzień, miesiąc, rok). Wypisz imię najstarszej osoby, czyli tej, która urodziła się najwcześniej. Jeśli kilka osób urodziło się tego samego dnia, wybierz tę, która była wcześniej na liście.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach: imię, dzień, miesiąc, rok.'],
            output_format: ['Imię najstarszej osoby.'],
            constraints: ['1 ≤ n ≤ 1000', 'Daty są poprawne, lata od 1900 do 2026.'],
            examples: [{ input: '4\nOla 14 3 2012\nJan 2 11 2011\nEwa 30 1 2012\nIgor 2 11 2011', note: 'Jan i Igor urodzili się 2 listopada 2011 — wybieramy Jana, bo był wcześniej na liście.' }],
            hint: R`Datę zapisz jako pair<int, pair<int, int>> {rok, {miesiac, dzien}} — porównuje się chronologicznie. Imię trzymaj w osobnej zmiennej, razem z rekordem. Zmieniaj rekord tylko przy ostro wcześniejszej dacie.`,
            tests: (r) => ['4\nOla 14 3 2012\nJan 2 11 2011\nEwa 30 1 2012\nIgor 2 11 2011', '1\nAl 1 1 1900', `1000\n${Array.from({ length: 1000 }, () => `${r.pick(IMIONA)} ${r.int(1, 28)} ${r.int(1, 12)} ${r.int(1900, 2026)}`).join('\n')}`, `30\n${Array.from({ length: 30 }, () => `${r.pick(IMIONA)} ${r.int(1, 3)} ${r.int(1, 2)} 2010`).join('\n')}`],
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); let b = null, im = ''; for (let i = 0; i < n; i++) { const [a, d, m, y] = t.slice(1 + 4 * i, 5 + 4 * i); const x = [Number(y), Number(m), Number(d)]; if (!b || cmp(x, b) < 0) { b = x; im = a; } } return im; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, pair<int, int>> najw;
    string kto;
    for (int i = 0; i < n; i++) {
        string imie;
        int d, m, r;
        cin >> imie >> d >> m >> r;
        pair<int, pair<int, int>> data = {r, {m, d}};
        if (i == 0 || data < najw) {
            najw = data;
            kto = imie;
        }
    }
    cout << kto << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-przesun-punkty', krok: 5, level: 'latwe',
            title: 'Przesuń wszystkie punkty',
            short: 'Przesuń każdy punkt z tablicy o ten sam wektor — rozpakowując go z &.',
            tags: ['auto &[x, y]', 'tablica punktów', 'zmiana w miejscu'],
            statement: ['Wczytaj n punktów, a potem wektor (dx, dy). Przesuń każdy punkt o ten wektor — do x dodaj dx, a do y dodaj dy — i wypisz wszystkie punkty po przesunięciu, każdy w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne punktów.', 'W ostatnim wierszu dx i dy.'],
            output_format: ['n wierszy z punktami po przesunięciu.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ współrzędne, dx, dy ≤ 10⁹', 'Po przesunięciu współrzędne mieszczą się w przedziale od −10⁹ do 10⁹.'],
            examples: [{ input: '3\n0 0\n1 5\n-2 3\n10 -1' }],
            hint: R`Najpierw wczytaj wszystkie punkty do tablicy, potem wektor. Przesuwanie: for (int i = 0; i < n; i++) { auto &[x, y] = t[i]; x += dx; y += dy; }. Bez & przesunąłbyś kopie, a tablica zostałaby bez zmian.`,
            check: (inp) => { const v = nums(inp); const n = v[0], dx = v[1 + 2 * n], dy = v[2 + 2 * n]; for (let i = 0; i < n; i++) { const x = v[1 + 2 * i] + dx, y = v[2 + 2 * i] + dy; if (Math.abs(x) > 1e9 || Math.abs(y) > 1e9) return 'poza zakresem'; } return null; },
            tests: (r) => ['3\n0 0\n1 5\n-2 3\n10 -1', '1\n5 5\n0 0', `1000\n${Array.from({ length: 1000 }, () => `${r.int(-5e8, 5e8)} ${r.int(-5e8, 5e8)}`).join('\n')}\n${r.int(-5e8, 5e8)} ${r.int(-5e8, 5e8)}`, `20\n${Array.from({ length: 20 }, () => `${r.int(-9, 9)} ${r.int(-9, 9)}`).join('\n')}\n${r.int(-9, 9)} ${r.int(-9, 9)}`],
            solve: (inp) => { const v = nums(inp); const n = v[0], dx = v[1 + 2 * n], dy = v[2 + 2 * n]; const out = []; for (let i = 0; i < n; i++) out.push(`${v[1 + 2 * i] + dx} ${v[2 + 2 * i] + dy}`); return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    int dx, dy;
    cin >> dx >> dy;
    for (int i = 0; i < n; i++) {
        auto &[x, y] = t[i];
        x += dx;
        y += dy;
    }
    for (int i = 0; i < n; i++) {
        cout << t[i].first << " " << t[i].second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-najdalej-od-srodka', krok: 5, level: 'srednie',
            title: 'Najdalej od środka',
            short: 'Najdalszy punkt od (0, 0), a przy remisie — mniejszy w porządku par. Klucz {odległość², {−x, −y}}.',
            tags: ['para w parze', 'long long', 'sztuczka z minusem'],
            statement: ['Wczytaj n punktów. Wypisz współrzędne punktu, który leży najdalej od początku układu (0, 0). Odległość porównuj przez x² + y² (to wystarczy, nie trzeba liczyć pierwiastka). Jeśli kilka punktów leży równie daleko, wybierz ten, który jest najmniejszy w porządku par — o najmniejszym x, a przy równym x — o najmniejszym y.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach współrzędne punktów.'],
            output_format: ['Dwie liczby: x i y wybranego punktu.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ x, y ≤ 10⁹'],
            examples: [{ input: '4\n3 4\n-5 0\n0 5\n1 1', note: 'Punkty (3, 4), (−5, 0) i (0, 5) leżą w odległości 5. Najmniejszy z nich w porządku par to (−5, 0).' }],
            hint: R`x² + y² dochodzi do 2 · 10¹⁸ — licz w long long. Klucz {x*x + y*y, {-x, -y}} szukany przez max daje największą odległość, a przy remisie — najmniejsze (x, y), bo minusy odwracają kolejność.`,
            tests: (r) => ['4\n3 4\n-5 0\n0 5\n1 1', '1\n0 0', '2\n-1000000000 -1000000000\n1000000000 1000000000', `1000\n${Array.from({ length: 1000 }, () => `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`).join('\n')}`, `60\n${Array.from({ length: 60 }, () => r.pick(['3 4', '-3 4', '4 -3', '5 0', '0 -5', '-4 -3', `${r.int(-4, 4)} ${r.int(-4, 4)}`])).join('\n')}`],
            solve: (inp) => { const v = nums(inp); let b = null; for (let i = 0; i < v[0]; i++) { const x = v[1 + 2 * i], y = v[2 + 2 * i]; const d = BigInt(x) * BigInt(x) + BigInt(y) * BigInt(y); if (!b || d > b.d || (d === b.d && cmp([x, y], [b.x, b.y]) < 0)) b = { d, x, y }; } return `${b.x} ${b.y}`; },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<long long, pair<int, int>> rekord;
    for (int i = 0; i < n; i++) {
        int x, y;
        cin >> x >> y;
        long long d = (long long)x * x + (long long)y * y;
        pair<long long, pair<int, int>> k = {d, {-x, -y}};
        if (i == 0) rekord = k;
        rekord = max(rekord, k);
    }
    cout << -rekord.second.first << " " << -rekord.second.second << "\n";
    return 0;
}`,
        },

        // ================================================================ KROK 6 · plansza
        {
            id: 'pair-robot', krok: 6, level: 'latwe',
            title: 'Robot',
            short: 'Polecenia G, P, D, L i tablica kroków. Gdzie skończy robot i jak daleko od startu?',
            tags: ['pair<int, int> ruch[4]', 'find w "GPDL"', 'abs'],
            statement: ['Robot stoi w kratce (0, 0) nieskończonej planszy i wykonuje polecenia: G — krok w górę (wiersz − 1), P — w prawo (kolumna + 1), D — w dół (wiersz + 1), L — w lewo (kolumna − 1). Wypisz końcową pozycję robota jako wiersz i kolumnę, a w drugim wierszu — jego odległość od startu liczoną jak taksówkarz: |wiersz| + |kolumna|.'],
            input_format: ['Jeden wiersz z poleceniami (litery G, P, D, L).'],
            output_format: ['W pierwszym wierszu wiersz i kolumna.', 'W drugim wierszu odległość od startu.'],
            constraints: ['Poleceń jest od 1 do 1000.'],
            examples: [{ input: 'PPGGLD' }],
            hint: R`pair<int, int> ruch[4] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}}; i string kierunki = "GPDL";. Dla litery c numer kierunku to kierunki.find(c), a ruch to dodanie ruch[k].first do wiersza i ruch[k].second do kolumny.`,
            tests: (r) => ['PPGGLD', 'G', 'GDLP', znaki(r, 1000, KIER), znaki(r, 1000, 'GGGP'), znaki(r, 50, KIER), 'D'.repeat(1000)],
            solve: (inp) => { let w = 0, k = 0; for (const c of inp.trim()) { const d = RUCH[KIER.indexOf(c)]; w += d[0]; k += d[1]; } return `${w} ${k}\n${Math.abs(w) + Math.abs(k)}`; },
            cpp: R`
#include <iostream>
#include <string>
#include <cstdlib>
using namespace std;
int main() {
    pair<int, int> ruch[4] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
    string kierunki = "GPDL";
    string s;
    cin >> s;
    pair<int, int> poz = {0, 0};
    for (char c : s) {
        int k = kierunki.find(c);
        poz.first += ruch[k].first;
        poz.second += ruch[k].second;
    }
    cout << poz.first << " " << poz.second << "\n";
    cout << abs(poz.first) + abs(poz.second) << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-robot-w-pokoju', krok: 6, level: 'srednie',
            title: 'Robot w pokoju',
            short: 'Robot omija ściany i nie wychodzi poza pokój. Gdzie skończy i ile poleceń się nie udało?',
            tags: ['brzegi planszy', 'ściany #', 'nowa pozycja'],
            statement: ['Pokój to plansza o n wierszach i m kolumnach: kropka to wolne pole, a znak # — ściana. Robot stoi w kratce (w, k) (numeracja od zera) i wykonuje polecenia G, P, D i L. Jeśli ruch prowadziłby na ścianę albo poza pokój, robot zostaje na miejscu, a polecenie uznajemy za nieudane. Wypisz końcową pozycję robota, a w drugim wierszu — liczbę nieudanych poleceń.'],
            input_format: ['W pierwszym wierszu n i m.', 'W kolejnych n wierszach plansza.', 'Potem pozycja startowa w i k.', 'W ostatnim wierszu polecenia.'],
            output_format: ['W pierwszym wierszu końcowa pozycja (wiersz i kolumna).', 'W drugim wierszu liczba nieudanych poleceń.'],
            constraints: ['1 ≤ n, m ≤ 50', 'Robot startuje na wolnym polu.', 'Poleceń jest od 1 do 1000.'],
            examples: [{ input: '3 4\n....\n.#..\n....\n0 0\nPDPPDDP', note: 'Nie udają się: D w drugim kroku (ściana w (1, 1)) i ostatnie P (wyjście poza pokój).' }],
            hint: R`Policz nową pozycję nw, nk. Jeśli nw >= 0 && nw < n && nk >= 0 && nk < m && p[nw][nk] != '#', przesuń robota, a w przeciwnym razie zwiększ licznik nieudanych. Warunek brzegów musi stać przed zajrzeniem do p[nw][nk].`,
            tests: (r) => {
                const gen = (n, m, gest, kk) => {
                    const p = Array.from({ length: n }, () => znaki(r, m, '.'.repeat(gest) + '#'));
                    let w = r.int(0, n - 1), k = r.int(0, m - 1);
                    p[w] = p[w].slice(0, k) + '.' + p[w].slice(k + 1);
                    return `${n} ${m}\n${p.join('\n')}\n${w} ${k}\n${znaki(r, kk, KIER)}`;
                };
                return ['3 4\n....\n.#..\n....\n0 0\nPDPPDDP', '1 1\n.\n0 0\nGPDL', gen(5, 5, 3, 30), gen(50, 50, 4, 1000), gen(10, 40, 1, 500), gen(20, 20, 9, 1000)];
            },
            solve: (inp) => { const L = lines(inp); const [n, m] = L[0].split(' ').map(Number); const p = L.slice(1, 1 + n); let [w, k] = L[1 + n].split(' ').map(Number); let zle = 0; for (const c of L[2 + n].trim()) { const d = RUCH[KIER.indexOf(c)]; const nw = w + d[0], nk = k + d[1]; if (nw >= 0 && nw < n && nk >= 0 && nk < m && p[nw][nk] !== '#') { w = nw; k = nk; } else zle++; } return `${w} ${k}\n${zle}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    string p[55];
    for (int i = 0; i < n; i++) cin >> p[i];
    pair<int, int> poz;
    cin >> poz.first >> poz.second;
    string s;
    cin >> s;
    pair<int, int> ruch[4] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
    string kierunki = "GPDL";
    int nieudane = 0;
    for (char c : s) {
        int k = kierunki.find(c);
        int nw = poz.first + ruch[k].first;
        int nk = poz.second + ruch[k].second;
        if (nw >= 0 && nw < n && nk >= 0 && nk < m && p[nw][nk] != '#') {
            poz = {nw, nk};
        } else {
            nieudane++;
        }
    }
    cout << poz.first << " " << poz.second << "\n" << nieudane << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-ile-kratek', krok: 6, level: 'srednie',
            title: 'Ile różnych kratek?',
            short: 'Robot chodzi po planszy i wraca w te same miejsca. Ile różnych kratek odwiedził?',
            tags: ['tablica odwiedzonych par', 'czy już było', 'pozycja jako para'],
            statement: ['Robot stoi w kratce (0, 0) nieskończonej planszy i wykonuje polecenia G, P, D i L (jak w zadaniu „Robot”). Policz, ile różnych kratek odwiedził — razem z kratką startową.'],
            input_format: ['Jeden wiersz z poleceniami.'],
            output_format: ['Liczba różnych odwiedzonych kratek.'],
            constraints: ['Poleceń jest od 1 do 1000.'],
            examples: [{ input: 'PDLG', note: 'Robot obchodzi kwadrat i wraca na start: odwiedził 4 różne kratki.' }, { input: 'PPLL' }],
            hint: R`Zapisuj każdą odwiedzoną pozycję w tablicy par: pair<int, int> byl[1005];. Po każdym kroku sprawdź pętlą, czy nowa pozycja już jest w tablicy — jeśli nie, dopisz ją. Na końcu liczba par w tablicy to odpowiedź. (Możesz też użyć tablicy bool z przesunięciem współrzędnych o 1001.)`,
            tests: (r) => ['PDLG', 'PPLL', 'G', znaki(r, 1000, KIER), znaki(r, 1000, 'GP'), znaki(r, 1000, 'PL'), 'PD'.repeat(500), znaki(r, 300, 'GPDLPP')],
            solve: (inp) => { let w = 0, k = 0; const s = new Set(['0,0']); for (const c of inp.trim()) { const d = RUCH[KIER.indexOf(c)]; w += d[0]; k += d[1]; s.add(`${w},${k}`); } return String(s.size); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    pair<int, int> ruch[4] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
    string kierunki = "GPDL";
    string s;
    cin >> s;
    pair<int, int> byl[1005];
    int ile = 0;
    pair<int, int> poz = {0, 0};
    byl[ile++] = poz;
    for (char c : s) {
        int k = kierunki.find(c);
        poz.first += ruch[k].first;
        poz.second += ruch[k].second;
        bool juz = false;
        for (int i = 0; i < ile; i++) {
            if (byl[i] == poz) {
                juz = true;
                break;
            }
        }
        if (!juz) byl[ile++] = poz;
    }
    cout << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-skoczek-szachowy', krok: 6, level: 'latwe',
            title: 'Ruchy skoczka',
            short: 'Pole w zapisie szachowym (e4). Na ile pól może skoczyć skoczek? Osiem skoków jako pary.',
            tags: ['pair<int, int> skok[8]', "c - 'a'", 'brzegi szachownicy'],
            statement: ['Skoczek szachowy skacze „w literę L”: o dwa pola w jednym kierunku i o jedno w bok. Dla każdego z n pól szachownicy podanych w zapisie szachowym (litera kolumny od a do h i cyfra wiersza od 1 do 8, na przykład e4) wypisz, na ile pól może skoczyć stojący tam skoczek, nie wychodząc poza szachownicę 8 × 8.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach pola w zapisie szachowym.'],
            output_format: ['n wierszy z liczbami możliwych skoków.'],
            constraints: ['1 ≤ n ≤ 64'],
            examples: [{ input: '3\na1\ne4\nb8' }],
            hint: R`Zamień pole na dwie liczby od 0 do 7: kolumna = s[0] - 'a', wiersz = s[1] - '1'. Potem pętla po ośmiu skokach z tablicy par i warunek, czy nowe pole mieści się w zakresie od 0 do 7.`,
            tests: (r) => { const all = []; for (const c of 'abcdefgh') for (const w of '12345678') all.push(c + w); return ['3\na1\ne4\nb8', `64\n${all.join('\n')}`, `10\n${Array.from({ length: 10 }, () => r.pick(all)).join('\n')}`]; },
            solve: (inp) => { const S = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]]; return toks(inp).slice(1).map((s) => { const k = s.charCodeAt(0) - 97, w = s.charCodeAt(1) - 49; return S.filter(([a, b]) => w + a >= 0 && w + a < 8 && k + b >= 0 && k + b < 8).length; }).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    pair<int, int> skok[8] = {{-2, -1}, {-2, 1}, {-1, -2}, {-1, 2}, {1, -2}, {1, 2}, {2, -1}, {2, 1}};
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        int k = s[0] - 'a', w = s[1] - '1';
        int ile = 0;
        for (auto [dw, dk] : skok) {
            int nw = w + dw, nk = k + dk;
            if (nw >= 0 && nw < 8 && nk >= 0 && nk < 8) ile++;
        }
        cout << ile << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-spacer-z-obrotami', krok: 6, level: 'srednie',
            title: 'Spacer z obrotami',
            short: 'Polecenia „F k”, R i L: idź k kroków przed siebie albo obróć się. Kierunek to numer od 0 do 3.',
            tags: ['kierunek jako numer', '(d + 1) % 4', '(d + 3) % 4'],
            statement: ['Robot stoi w kratce (0, 0) i patrzy w górę. Dostaje n poleceń: „F k” — idź k kratek przed siebie, „R” — obróć się w prawo, „L” — obróć się w lewo. Krok w górę zmniejsza numer wiersza, w prawo zwiększa numer kolumny. Wypisz końcową pozycję robota (wiersz i kolumna) i literę kierunku, w którym patrzy na końcu: G (góra), P (prawo), D (dół) albo L (lewo).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach polecenia: „F k”, „R” albo „L”.'],
            output_format: ['Wiersz, kolumna i litera kierunku, oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 10⁶'],
            examples: [{ input: '5\nF 2\nR\nF 3\nR\nF 1', note: 'Dwa w górę do (−2, 0), trzy w prawo do (−2, 3), jeden w dół do (−1, 3). Robot patrzy w dół.' }],
            hint: R`Kierunek trzymaj jako numer d: 0 — góra, 1 — prawo, 2 — dół, 3 — lewo, w kolejności tablicy ruch. R to d = (d + 1) % 4, L to d = (d + 3) % 4. Przy „F k” dodaj k · ruch[d] do pozycji. Na koniec literę wypiszesz jako "GPDL"[d].`,
            tests: (r) => {
                const gen = (n, kmax) => `${n}\n${Array.from({ length: n }, () => (r() < 0.5 ? `F ${r.int(1, kmax)}` : r.pick(['R', 'L']))).join('\n')}`;
                return ['5\nF 2\nR\nF 3\nR\nF 1', '1\nL', '3\nL\nL\nF 7', gen(20, 9), gen(1000, 1e6), gen(200, 3)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); let i = 1, d = 0, w = 0, k = 0; for (let c = 0; c < n; c++) { const x = t[i++]; if (x === 'R') d = (d + 1) % 4; else if (x === 'L') d = (d + 3) % 4; else { const s = Number(t[i++]); w += s * RUCH[d][0]; k += s * RUCH[d][1]; } } return `${w} ${k} ${KIER[d]}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    pair<int, int> ruch[4] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
    string litery = "GPDL";
    int n;
    cin >> n;
    pair<int, int> poz = {0, 0};
    int d = 0;
    for (int i = 0; i < n; i++) {
        string c;
        cin >> c;
        if (c == "R") {
            d = (d + 1) % 4;
        } else if (c == "L") {
            d = (d + 3) % 4;
        } else {
            int k;
            cin >> k;
            poz.first += k * ruch[d].first;
            poz.second += k * ruch[d].second;
        }
    }
    cout << poz.first << " " << poz.second << " " << litery[d] << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-najbardziej-otoczona', krok: 6, level: 'srednie',
            title: 'Najbardziej otoczona kratka',
            short: 'Która wolna kratka ma najwięcej ścian wśród ośmiu sąsiadów? Remis rozstrzyga para (wiersz, kolumna).',
            tags: ['osiem kierunków', 'pary kroków', 'najmniejsza (w, k)'],
            statement: ['Na planszy o n wierszach i m kolumnach kropka oznacza wolne pole, a # — ścianę. Dla każdego wolnego pola policz, ile ścian jest wśród jego ośmiu sąsiadów (także po skosie). Wypisz wiersz i kolumnę (numerowane od 1) wolnego pola z największą liczbą sąsiednich ścian oraz tę liczbę. Jeśli kilka pól ma tę samą największą liczbę, wybierz to w najwyższym wierszu, a w nim — najbardziej z lewej.'],
            input_format: ['W pierwszym wierszu n i m.', 'W kolejnych n wierszach plansza.'],
            output_format: ['Trzy liczby: wiersz, kolumna i liczba sąsiednich ścian.'],
            constraints: ['1 ≤ n, m ≤ 100', 'Na planszy jest co najmniej jedno wolne pole.'],
            examples: [{ input: '3 4\n#.#.\n.##.\n#..#', note: 'Pole (2, 1) ma 4 sąsiednie ściany; pole (3, 2) — też 4, ale leży niżej.' }],
            hint: R`Zrób tablicę ośmiu kroków: wszystkie (dw, dk) z {−1, 0, 1} oprócz (0, 0). Dla każdego wolnego pola policz ściany pętlą po krokach (z kontrolą brzegów). Przechodząc wiersz po wierszu i zmieniając rekord tylko przy ostro większej liczbie, sam dostaniesz pole najwyżej i najbardziej z lewej.`,
            check: (inp) => (lines(inp).slice(1).some((l) => l.includes('.')) ? null : 'brak wolnego pola'),
            tests: (r) => {
                const gen = (n, m, alf) => { const p = Array.from({ length: n }, () => znaki(r, m, alf)); if (!p.some((l) => l.includes('.'))) p[0] = '.' + p[0].slice(1); return `${n} ${m}\n${p.join('\n')}`; };
                return ['3 4\n#.#.\n.##.\n#..#', '1 1\n.', '2 2\n.#\n##', gen(5, 5, '.#'), gen(100, 100, '.##'), gen(100, 100, '...#'), gen(30, 70, '.#')];
            },
            solve: (inp) => { const L = lines(inp); const [n, m] = L[0].split(' ').map(Number); const p = L.slice(1, 1 + n); let best = -1, bw = 0, bk = 0; for (let w = 0; w < n; w++) for (let k = 0; k < m; k++) { if (p[w][k] !== '.') continue; let c = 0; for (let a = -1; a <= 1; a++) for (let b = -1; b <= 1; b++) { if (!a && !b) continue; const x = w + a, y = k + b; if (x >= 0 && x < n && y >= 0 && y < m && p[x][y] === '#') c++; } if (c > best) { best = c; bw = w + 1; bk = k + 1; } } return `${bw} ${bk} ${best}`; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    string p[105];
    for (int i = 0; i < n; i++) cin >> p[i];
    pair<int, int> krok[8] = {{-1, -1}, {-1, 0}, {-1, 1}, {0, -1}, {0, 1}, {1, -1}, {1, 0}, {1, 1}};
    int najw = -1;
    pair<int, int> gdzie = {0, 0};
    for (int w = 0; w < n; w++) {
        for (int k = 0; k < m; k++) {
            if (p[w][k] != '.') continue;
            int sciany = 0;
            for (auto [dw, dk] : krok) {
                int nw = w + dw, nk = k + dk;
                if (nw >= 0 && nw < n && nk >= 0 && nk < m && p[nw][nk] == '#') sciany++;
            }
            if (sciany > najw) {
                najw = sciany;
                gdzie = {w + 1, k + 1};
            }
        }
    }
    cout << gdzie.first << " " << gdzie.second << " " << najw << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-ruchy-krola', krok: 6, level: 'latwe',
            title: 'Ile ruchów króla?',
            short: 'Król idzie o jedno pole, także po skosie. Ile ruchów potrzebuje z (w₁, k₁) do (w₂, k₂)?',
            tags: ['max i abs', 'ruch po skosie', 'pozycje jako pary'],
            statement: ['Król szachowy w jednym ruchu przechodzi na dowolne z ośmiu sąsiednich pól. Na nieskończonej szachownicy dla każdego z n pytań — pola startowego (w₁, k₁) i docelowego (w₂, k₂) — wypisz najmniejszą liczbę ruchów, jakiej potrzebuje król.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po cztery liczby: w₁, k₁, w₂, k₂.'],
            output_format: ['n wierszy z liczbami ruchów.'],
            constraints: ['1 ≤ n ≤ 100', '−10⁹ ≤ współrzędne ≤ 10⁹'],
            examples: [{ input: '3\n0 0 3 5\n2 2 2 2\n-1 4 2 1' }],
            hint: R`Ruch po skosie zmienia naraz wiersz i kolumnę. Król idzie więc po skosie, dopóki może, a resztę prosto. Wynik to większa z dwóch różnic: max(abs(w1 - w2), abs(k1 - k2)). Różnica może przekroczyć zakres int — licz w long long.`,
            tests: (r) => ['3\n0 0 3 5\n2 2 2 2\n-1 4 2 1', '1\n-1000000000 -1000000000 1000000000 1000000000', `100\n${Array.from({ length: 100 }, () => Array.from({ length: 4 }, () => r.int(-1e9, 1e9)).join(' ')).join('\n')}`, `20\n${Array.from({ length: 20 }, () => Array.from({ length: 4 }, () => r.int(-5, 5)).join(' ')).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const out = []; for (let i = 0; i < v[0]; i++) { const [a, b, c, d] = v.slice(1 + 4 * i, 5 + 4 * i); out.push(Math.max(Math.abs(a - c), Math.abs(b - d))); } return out.join('\n'); },
            cpp: R`
#include <iostream>
#include <cstdlib>
using namespace std;
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        pair<long long, long long> a, b;
        cin >> a.first >> a.second >> b.first >> b.second;
        cout << max(llabs(a.first - b.first), llabs(a.second - b.second)) << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-powrot-do-domu', krok: 6, level: 'srednie',
            title: 'Powrót do domu',
            short: 'Po którym poleceniu robot pierwszy raz wróci do kratki startowej?',
            tags: ['pozycja jako para', 'p == start', 'break'],
            statement: ['Robot stoi w kratce (0, 0) i wykonuje polecenia G, P, D i L. Wypisz numer pierwszego polecenia (numerujemy od 1), po którym robot znowu stoi w kratce (0, 0). Jeśli to się nie zdarzy, wypisz NIE.'],
            input_format: ['Jeden wiersz z poleceniami.'],
            output_format: ['Numer polecenia albo NIE.'],
            constraints: ['Poleceń jest od 1 do 1000.'],
            examples: [{ input: 'PPGLLD', note: 'Po szóstym poleceniu robot wraca do (0, 0).' }, { input: 'PPG' }],
            hint: R`Trzymaj pozycję jako parę i porównuj ją ze startem: if (poz == start). Pary porównujesz zwykłym ==. Przy pierwszym trafieniu wypisz numer polecenia i przerwij pętlę.`,
            tests: (r) => ['PPGLLD', 'PPG', 'GD', 'PL', znaki(r, 1000, KIER), 'P'.repeat(500) + 'L'.repeat(500), znaki(r, 1000, 'GP'), 'GPDL'.repeat(250), znaki(r, 30, KIER)],
            solve: (inp) => { let w = 0, k = 0, i = 0; for (const c of inp.trim()) { i++; const d = RUCH[KIER.indexOf(c)]; w += d[0]; k += d[1]; if (w === 0 && k === 0) return String(i); } return 'NIE'; },
            cpp: R`
#include <iostream>
#include <string>
using namespace std;
int main() {
    pair<int, int> ruch[4] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
    string kierunki = "GPDL";
    string s;
    cin >> s;
    pair<int, int> start = {0, 0}, poz = {0, 0};
    int n = s.length();
    for (int i = 0; i < n; i++) {
        int k = kierunki.find(s[i]);
        poz.first += ruch[k].first;
        poz.second += ruch[k].second;
        if (poz == start) {
            cout << i + 1 << "\n";
            return 0;
        }
    }
    cout << "NIE\n";
    return 0;
}`,
        },

        // ================================================================ KROK 7 · sortowanie
        {
            id: 'pair-posortuj-pary', krok: 7, level: 'latwe',
            title: 'Posortuj pary',
            short: 'Wczytaj n par i posortuj je jedną linijką: sort(t, t + n).',
            tags: ['sort(t, t + n)', 'first, potem second', 'tablica par'],
            statement: ['Wczytaj n par liczb i wypisz je posortowane rosnąco według zasad porównywania par — najpierw według pierwszej liczby, a przy remisie według drugiej. Każdą parę wypisz w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby.'],
            output_format: ['n wierszy z posortowanymi parami.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ liczby ≤ 10⁹'],
            examples: [{ input: '5\n3 100\n1 50\n3 20\n2 70\n1 60' }],
            hint: R`Wczytaj pary do pair<int, int> t[1005], posortuj przez sort(t, t + n); i wypisz od początku. Sortujesz tylko n zajętych pudełek.`,
            tests: (r) => ['5\n3 100\n1 50\n3 20\n2 70\n1 60', '1\n0 0', `1000\n${Array.from({ length: 1000 }, () => `${r.int(-1e9, 1e9)} ${r.int(-1e9, 1e9)}`).join('\n')}`, `100\n${Array.from({ length: 100 }, () => `${r.int(-3, 3)} ${r.int(-3, 3)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const t = []; for (let i = 0; i < v[0]; i++) t.push([v[1 + 2 * i], v[2 + 2 * i]]); return t.sort(cmp).map((p) => p.join(' ')).join('\n'); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    sort(t, t + n);
    for (int i = 0; i < n; i++) {
        cout << t[i].first << " " << t[i].second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-ranking', krok: 7, level: 'latwe',
            title: 'Ranking zawodników',
            short: 'Od najwięcej punktów do najmniej, a przy remisie alfabetycznie. Sortuj pary {−punkty, imię}.',
            tags: ['{-punkty, imie}', 'sort', 'cofnij minus'],
            statement: ['Wczytaj wyniki n zawodników: imię i liczbę punktów. Wypisz ranking: zawodników od największej liczby punktów do najmniejszej, a przy równej liczbie punktów — w kolejności alfabetycznej imion. Każdy wiersz zawiera imię i punkty.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach imię i liczba punktów.'],
            output_format: ['n wierszy rankingu: imię i punkty.'],
            constraints: ['1 ≤ n ≤ 1000', 'Imiona mają od 2 do 20 liter: pierwsza wielka, pozostałe małe.', '0 ≤ punkty ≤ 10⁶'],
            examples: [{ input: '4\nOla 90\nJan 75\nEwa 90\nIgor 60' }],
            hint: R`Wczytuj do pair<int, string> t[1005] z minusem: t[i] = {-punkty, imie}. Po sort(t, t + n) najlepsi są na początku, a przy remisie imiona idą alfabetycznie. Przy wypisywaniu cofnij minus: -t[i].first.`,
            tests: (r) => ['4\nOla 90\nJan 75\nEwa 90\nIgor 60', '1\nAl 0', `1000\n${Array.from({ length: 1000 }, () => `${r.pick(IMIONA)} ${r.int(0, 1e6)}`).join('\n')}`, `50\n${Array.from({ length: 50 }, () => `${r.pick(IMIONA)} ${r.int(0, 3)}`).join('\n')}`],
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const a = []; for (let i = 0; i < n; i++) a.push([-Number(t[2 + 2 * i]), t[1 + 2 * i]]); return a.sort(cmp).map((x) => `${x[1]} ${-x[0]}`).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, string> t[1005];
    for (int i = 0; i < n; i++) {
        string imie;
        int p;
        cin >> imie >> p;
        t[i] = {-p, imie};
    }
    sort(t, t + n);
    for (int i = 0; i < n; i++) {
        cout << t[i].second << " " << -t[i].first << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-podium', krok: 7, level: 'latwe',
            title: 'Podium biegu',
            short: 'Najkrótszy czas wygrywa. Posortuj pary (czas, imię) i wypisz pierwszą trójkę.',
            tags: ['{czas, imie}', 'sort', 'pierwsze trzy'],
            statement: ['Wczytaj wyniki n biegaczy: imię i czas w sekundach. Wypisz podium — trzech najszybszych zawodników, w kolejności od najszybszego, w postaci „miejsce. imię czas”. Przy równych czasach wyżej stoi imię wcześniejsze w alfabecie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach imię i czas.'],
            output_format: ['Trzy wiersze podium.'],
            constraints: ['3 ≤ n ≤ 1000', '1 ≤ czas ≤ 10⁶'],
            examples: [{ input: '5\nOla 620\nJan 598\nEwa 598\nIgor 701\nZosia 615' }],
            hint: R`Tym razem lepszy jest MNIEJSZY czas, więc żadnego minusa nie trzeba: para {czas, imie} posortowana rosnąco ma najszybszych na początku. Wypisz tylko pudełka 0, 1 i 2.`,
            tests: (r) => ['5\nOla 620\nJan 598\nEwa 598\nIgor 701\nZosia 615', '3\nAl 1\nOla 1\nEwa 1', `1000\n${Array.from({ length: 1000 }, () => `${r.pick(IMIONA)} ${r.int(1, 1e6)}`).join('\n')}`, `40\n${Array.from({ length: 40 }, () => `${r.pick(IMIONA)} ${r.int(600, 603)}`).join('\n')}`],
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const a = []; for (let i = 0; i < n; i++) a.push([Number(t[2 + 2 * i]), t[1 + 2 * i]]); a.sort(cmp); return a.slice(0, 3).map((x, i) => `${i + 1}. ${x[1]} ${x[0]}`).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, string> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].second >> t[i].first;
    }
    sort(t, t + n);
    for (int i = 0; i < 3; i++) {
        cout << i + 1 << ". " << t[i].second << " " << t[i].first << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-najpierw-drugi', krok: 7, level: 'latwe',
            title: 'Najpierw według drugiej liczby',
            short: 'Posortuj pary według drugiej liczby, a przy remisie według pierwszej. Odwróć, posortuj, odwróć.',
            tags: ['swap przegródek', 'sort', 'klucz na pierwsze miejsce'],
            statement: ['Wczytaj n par liczb (a, b) i wypisz je posortowane według drugiej liczby rosnąco, a przy równych drugich liczbach — według pierwszej rosnąco. Pary wypisz w ich oryginalnej postaci „a b”.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach po dwie liczby.'],
            output_format: ['n wierszy z parami w nowej kolejności.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ liczby ≤ 10⁹'],
            examples: [{ input: '4\n1 9\n5 2\n3 9\n7 2' }],
            hint: R`sort porządkuje po first. Skoro chcesz po second — zamień przegródki w każdej parze (wczytaj od razu odwrotnie), posortuj, a przy wypisywaniu podaj najpierw second, potem first.`,
            tests: (r) => ['4\n1 9\n5 2\n3 9\n7 2', '1\n1 1', `1000\n${Array.from({ length: 1000 }, () => `${r.int(-1e9, 1e9)} ${r.int(-3, 3)}`).join('\n')}`, `100\n${Array.from({ length: 100 }, () => `${r.int(-5, 5)} ${r.int(-5, 5)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const t = []; for (let i = 0; i < v[0]; i++) t.push([v[2 + 2 * i], v[1 + 2 * i]]); return t.sort(cmp).map((p) => `${p[1]} ${p[0]}`).join('\n'); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].second >> t[i].first;   // od razu odwrotnie
    }
    sort(t, t + n);
    for (int i = 0; i < n; i++) {
        cout << t[i].second << " " << t[i].first << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-miejsce-po-sortowaniu', krok: 7, level: 'srednie',
            title: 'Miejsce po posortowaniu',
            short: 'Dla każdej liczby powiedz, na którym miejscu stanie po posortowaniu. Para (wartość, numer) i druga tablica.',
            tags: ['para (wartość, numer)', 'sort', 'miejsce[numer] = i'],
            statement: ['Wczytaj n liczb. Wyobraź sobie, że ustawiamy je rosnąco, a równe liczby — w kolejności, w jakiej były na wejściu. Dla każdej liczby, w kolejności z wejścia, wypisz miejsce (od 1), na którym stanie po takim ustawieniu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['n liczb w jednym wierszu: miejsca kolejnych liczb.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ liczby ≤ 10⁹'],
            examples: [{ input: '5\n40 10 30 10 20', note: 'Po ustawieniu: 10 (z pozycji 2), 10 (z pozycji 4), 20, 30, 40. Liczba 40 stanie na miejscu 5, pierwsza dziesiątka na 1, a druga na 2.' }],
            hint: R`Zrób pary (wartość, numer) i posortuj je. Para na pozycji i w posortowanej tablicy ma numer t[i].second — zapisz w osobnej tablicy miejsce[t[i].second] = i + 1. Potem wypisz miejsca w kolejności numerów.`,
            tests: (r) => ['5\n40 10 30 10 20', '1\n7', '4\n1 1 1 1', `1000\n${Array.from({ length: 1000 }, () => r.int(-1e9, 1e9)).join(' ')}`, `100\n${Array.from({ length: 100 }, () => r.int(1, 5)).join(' ')}`],
            solve: (inp) => { const v = nums(inp); const n = v[0]; const t = v.slice(1, 1 + n).map((x, i) => [x, i]); t.sort(cmp); const m = new Array(n); t.forEach((p, i) => { m[p[1]] = i + 1; }); return m.join(' '); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first;
        t[i].second = i;
    }
    sort(t, t + n);
    int miejsce[1005];
    for (int i = 0; i < n; i++) {
        miejsce[t[i].second] = i + 1;
    }
    for (int i = 0; i < n; i++) {
        cout << miejsce[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-tabela-medalowa', krok: 7, level: 'srednie',
            title: 'Tabela medalowa',
            short: 'Pełna klasyfikacja medalowa z miejscami ex aequo. Klucz {{−złote, {−srebrne, −brązowe}}, nazwa}.',
            tags: ['para w parze', 'sort', 'ex aequo'],
            statement: ['Wczytaj liczby medali n krajów: złotych, srebrnych i brązowych. Ułóż klasyfikację: najpierw kraje z większą liczbą złotych medali, przy remisie — srebrnych, a potem brązowych. Kraje z identyczną liczbą medali każdego rodzaju dzielą miejsce (ex aequo) i są wypisane alfabetycznie; następne miejsce jest wtedy odpowiednio dalej (1, 2, 2, 4…). Każdy wiersz: „miejsce. nazwa złote srebrne brązowe”.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach: nazwa kraju i trzy liczby medali.'],
            output_format: ['n wierszy klasyfikacji.'],
            constraints: ['1 ≤ n ≤ 24', 'Nazwy krajów są różne.', '0 ≤ liczby medali ≤ 50'],
            examples: [{ input: '4\nPolska 2 3 1\nNorwegia 5 0 0\nCzechy 2 3 1\nKenia 2 4 0' }],
            hint: R`Klucz kraju: pair<pair<int, pair<int, int>>, string> {{-z, {-s, -b}}, nazwa}. Minusy dają kolejność od najlepszego, a nazwa rozstrzyga remisy alfabetycznie. Po sortowaniu miejsce zmieniasz tylko wtedy, gdy medale (t[i].first) różnią się od poprzedniego kraju.`,
            tests: (r) => {
                const gen = (n, mx) => { const k = r.shuffle(KRAJE).slice(0, n); return `${n}\n${k.map((x) => `${x} ${r.int(0, mx)} ${r.int(0, mx)} ${r.int(0, mx)}`).join('\n')}`; };
                return ['4\nPolska 2 3 1\nNorwegia 5 0 0\nCzechy 2 3 1\nKenia 2 4 0', '1\nPolska 0 0 0', gen(24, 2), gen(24, 50), gen(10, 1)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const a = []; for (let i = 0; i < n; i++) { const [nz, z, s, b] = t.slice(1 + 4 * i, 5 + 4 * i); a.push([-Number(z), -Number(s), -Number(b), nz]); } a.sort(cmp); let m = 1; return a.map((x, i) => { if (i > 0 && cmp(x.slice(0, 3), a[i - 1].slice(0, 3)) !== 0) m = i + 1; return `${m}. ${x[3]} ${-x[0]} ${-x[1]} ${-x[2]}`; }).join('\n'); },
            cpp: R`
#include <iostream>
#include <string>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<pair<int, pair<int, int>>, string> t[30];
    for (int i = 0; i < n; i++) {
        string nazwa;
        int z, s, b;
        cin >> nazwa >> z >> s >> b;
        t[i] = {{-z, {-s, -b}}, nazwa};
    }
    sort(t, t + n);
    int miejsce = 1;
    for (int i = 0; i < n; i++) {
        if (i > 0 && t[i].first != t[i - 1].first) miejsce = i + 1;
        cout << miejsce << ". " << t[i].second << " " << -t[i].first.first << " "
             << -t[i].first.second.first << " " << -t[i].first.second.second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-daty-po-kolei', krok: 7, level: 'latwe',
            title: 'Daty po kolei',
            short: 'Posortuj daty chronologicznie — jako pary (rok, (miesiąc, dzień)).',
            tags: ['pair<int, pair<int, int>>', 'sort', 'DD.MM.RRRR'],
            statement: ['Wczytaj n dat i wypisz je w kolejności chronologicznej — od najwcześniejszej do najpóźniejszej — w postaci DD.MM.RRRR. Powtarzające się daty wypisz tyle razy, ile wystąpiły.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach daty: dzień, miesiąc, rok.'],
            output_format: ['n wierszy z datami w kolejności chronologicznej.'],
            constraints: ['1 ≤ n ≤ 1000', 'Daty są poprawne, lata od 1900 do 2100.'],
            examples: [{ input: '4\n8 11 2026\n24 12 2025\n1 1 2026\n8 11 2026' }],
            hint: R`Zapisz każdą datę jako {rok, {miesiac, dzien}} w tablicy pair<int, pair<int, int>> t[1005] i posortuj. Przy wypisywaniu pamiętaj o zerach z przodu dnia i miesiąca.`,
            tests: (r) => ['4\n8 11 2026\n24 12 2025\n1 1 2026\n8 11 2026', '1\n29 2 2024', `1000\n${Array.from({ length: 1000 }, () => `${r.int(1, 28)} ${r.int(1, 12)} ${r.int(1900, 2100)}`).join('\n')}`, `50\n${Array.from({ length: 50 }, () => `${r.int(1, 3)} ${r.int(1, 2)} ${r.int(2025, 2026)}`).join('\n')}`],
            solve: (inp) => { const v = nums(inp); const t = []; for (let i = 0; i < v[0]; i++) { const [d, m, y] = v.slice(1 + 3 * i, 4 + 3 * i); t.push([y, m, d]); } return t.sort(cmp).map((x) => data(x[2], x[1], x[0])).join('\n'); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, pair<int, int>> t[1005];
    for (int i = 0; i < n; i++) {
        int d, m, r;
        cin >> d >> m >> r;
        t[i] = {r, {m, d}};
    }
    sort(t, t + n);
    for (int i = 0; i < n; i++) {
        if (t[i].second.second < 10) cout << "0";
        cout << t[i].second.second << ".";
        if (t[i].second.first < 10) cout << "0";
        cout << t[i].second.first << "." << t[i].first << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-zadania-domowe', krok: 7, level: 'srednie',
            title: 'Zadania domowe na czas',
            short: 'Rób zadania od najbliższego terminu. Czy zdążysz ze wszystkimi? Sortuj (termin, czas, numer).',
            tags: ['para w parze', 'sort po terminach', 'suma czasu'],
            statement: ['Masz n zadań domowych ponumerowanych od 1. Każde ma termin (godzinę, do której musi być gotowe, licząc od teraz) i czas potrzebny na jego zrobienie. Robisz je jedno po drugim, bez przerw, zaczynając teraz (od chwili 0), w kolejności od najwcześniejszego terminu; przy równych terminach — najpierw krótsze, a przy równych czasach — o mniejszym numerze. Zadanie skończone dokładnie w terminie jest na czas. Jeśli wszystkie zadania będą na czas, wypisz TAK. W przeciwnym razie wypisz NIE i numer pierwszego (w kolejności robienia) zadania, które nie zdąży.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach termin i czas zadania.'],
            output_format: ['TAK albo NIE i numer zadania.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ termin ≤ 10⁶', '1 ≤ czas ≤ 1000'],
            examples: [{ input: '3\n5 2\n3 3\n10 4', note: 'Kolejność: zadanie 2 (koniec o 3), zadanie 1 (koniec o 5), zadanie 3 (koniec o 9) — wszystkie na czas.' }, { input: '3\n4 2\n4 3\n6 1', note: 'Najpierw zadanie 1 (koniec o 2), potem 2 (koniec o 5 — po terminie 4).' }],
            hint: R`Zbuduj klucz pair<pair<int, int>, int> {{termin, czas}, numer} i posortuj. Potem idź po kolei, dodając czas do zegara; jeśli zegar przekroczy termin bieżącego zadania, wypisz NIE i jego numer.`,
            tests: (r) => {
                const gen = (n, tmax, cmax) => `${n}\n${Array.from({ length: n }, () => `${r.int(1, tmax)} ${r.int(1, cmax)}`).join('\n')}`;
                const ok = (n) => { let t = 0; const a = Array.from({ length: n }, () => { const c = r.int(1, 1000); t += c; return [t + r.int(0, 50), c]; }); return `${n}\n${r.shuffle(a).map((x) => x.join(' ')).join('\n')}`; };
                return ['3\n5 2\n3 3\n10 4', '3\n4 2\n4 3\n6 1', '1\n1 1', '1\n1 2', ok(1000), ok(50), gen(1000, 1e6, 1000), gen(30, 60, 5)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const a = []; for (let i = 0; i < n; i++) a.push([v[1 + 2 * i], v[2 + 2 * i], i + 1]); a.sort(cmp); let t = 0; for (const [d, c, k] of a) { t += c; if (t > d) return `NIE ${k}`; } return 'TAK'; },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<pair<int, int>, int> z[1005];
    for (int i = 0; i < n; i++) {
        int termin, czas;
        cin >> termin >> czas;
        z[i] = {{termin, czas}, i + 1};
    }
    sort(z, z + n);
    long long zegar = 0;
    for (int i = 0; i < n; i++) {
        zegar += z[i].first.second;
        if (zegar > z[i].first.first) {
            cout << "NIE " << z[i].second << "\n";
            return 0;
        }
    }
    cout << "TAK\n";
    return 0;
}`,
        },

        // ================================================================ KROK 8 · olimpiada
        {
            id: 'pair-pomalowany-plot', krok: 8, level: 'srednie',
            title: 'Pomalowany płot',
            short: 'Malarze malowali kawałki płotu, czasem po sobie. Ile jest pomalowanych części i jaka ich łączna długość?',
            tags: ['scalanie przedziałów', 'sort po początkach', 'ostatni kawałek'],
            statement: ['Płot to odcinek osi liczbowej. Każdy z n malarzy pomalował kawałek od a do b (pomalowana jest część [a, b), czyli od a włącznie do b — długość b − a). Kawałki mogą na siebie nachodzić albo się stykać. Wypisz, z ilu rozłącznych, ciągłych pomalowanych części składa się płot (stykające się kawałki tworzą jedną część) i jaka jest łączna długość pomalowanego płotu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach początek a i koniec b kawałka.'],
            output_format: ['Dwie liczby: liczba części i łączna pomalowana długość.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ a < b ≤ 10⁹'],
            examples: [{ input: '4\n5 8\n1 3\n2 4\n4 5', note: 'Kawałki [1, 3), [2, 4), [4, 5) i [5, 8) łączą się w jedną część [1, 8) o długości 7.' }, { input: '3\n0 2\n10 12\n1 3' }],
            hint: R`Posortuj kawałki po początkach. Trzymaj bieżącą część akt. Jeśli kolejny kawałek zaczyna się nie dalej niż koniec bieżącego (t[i].first <= akt.second), rozszerz koniec przez max. W przeciwnym razie zamknij bieżącą część: policz ją i dodaj jej długość. Nie zapomnij o ostatniej części po pętli. Długość trzymaj w long long.`,
            check: (inp) => { const v = nums(inp); for (let i = 0; i < v[0]; i++) if (!(v[1 + 2 * i] < v[2 + 2 * i])) return 'a >= b'; return null; },
            tests: (r) => {
                const gen = (n, mx, dl) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(0, mx - 1); return `${a} ${Math.min(mx, a + r.int(1, dl))}`; }).join('\n')}`;
                return ['4\n5 8\n1 3\n2 4\n4 5', '3\n0 2\n10 12\n1 3', '1\n0 1000000000', gen(1000, 1e9, 1e6), gen(1000, 10000, 20), gen(50, 100, 5), gen(200, 1e9, 1e9)];
            },
            solve: (inp) => { const v = nums(inp); const t = []; for (let i = 0; i < v[0]; i++) t.push([v[1 + 2 * i], v[2 + 2 * i]]); t.sort(cmp); let [a, b] = t[0]; let c = 1, s = 0; for (let i = 1; i < t.length; i++) { if (t[i][0] <= b) b = Math.max(b, t[i][1]); else { s += b - a; c++; [a, b] = t[i]; } } s += b - a; return `${c} ${s}`; },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    sort(t, t + n);
    pair<int, int> akt = t[0];
    int czesci = 1;
    long long dlugosc = 0;
    for (int i = 1; i < n; i++) {
        if (t[i].first <= akt.second) {
            akt.second = max(akt.second, t[i].second);
        } else {
            dlugosc += akt.second - akt.first;
            czesci++;
            akt = t[i];
        }
    }
    dlugosc += akt.second - akt.first;
    cout << czesci << " " << dlugosc << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-najtloczniej', krok: 8, level: 'srednie',
            title: 'Najtłoczniejsza chwila',
            short: 'Ile osób było naraz w muzeum w najtłoczniejszej chwili — i kiedy pierwszy raz tyle się zebrało?',
            tags: ['zdarzenia (czas, ±1)', 'sort', 'pierwsza chwila rekordu'],
            statement: ['Muzeum odwiedziło n osób. Osoba weszła w chwili a i wyszła w chwili b (a < b). W chwili b już jej nie ma, więc jeśli ktoś wychodzi w tej samej chwili, w której ktoś inny wchodzi, te dwie osoby się nie spotkały. Wypisz największą liczbę osób, które były w muzeum jednocześnie, i najwcześniejszą chwilę, w której tyle osób było w środku.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach chwile wejścia a i wyjścia b.'],
            output_format: ['Dwie liczby: największa liczba osób naraz i najwcześniejsza chwila, w której tyle ich było.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ a < b ≤ 10⁹'],
            examples: [{ input: '3\n1 5\n2 6\n5 8', note: 'W chwili 2 w muzeum są dwie osoby. W chwili 5 jedna wychodzi, a jedna wchodzi — dalej są dwie, ale rekord padł już w chwili 2.' }],
            hint: R`Zrób 2n zdarzeń: {a, 1} i {b, -1} — i posortuj. W tej samej chwili (b, −1) stoi przed (a, +1), więc wyjścia liczą się przed wejściami, dokładnie jak chce treść. Idąc po zdarzeniach, dodawaj second do licznika; gdy licznik ostro przebije rekord, zapamiętaj rekord i chwilę zdarzenia.`,
            check: (inp) => { const v = nums(inp); for (let i = 0; i < v[0]; i++) if (!(v[1 + 2 * i] < v[2 + 2 * i])) return 'a >= b'; return null; },
            tests: (r) => {
                const gen = (n, mx, dl) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(0, mx - 1); return `${a} ${Math.min(mx, a + r.int(1, dl))}`; }).join('\n')}`;
                return ['3\n1 5\n2 6\n5 8', '1\n0 1', '2\n1 2\n2 3', '3\n0 10\n0 10\n0 10', gen(1000, 1e9, 1e8), gen(1000, 100, 10), gen(100, 50, 3)];
            },
            solve: (inp) => { const v = nums(inp); const z = []; for (let i = 0; i < v[0]; i++) { z.push([v[1 + 2 * i], 1]); z.push([v[2 + 2 * i], -1]); } z.sort(cmp); let c = 0, b = 0, t = 0; for (const [x, d] of z) { c += d; if (c > b) { b = c; t = x; } } return `${b} ${t}`; },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> z[2005];
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        z[2 * i] = {a, 1};
        z[2 * i + 1] = {b, -1};
    }
    sort(z, z + 2 * n);
    int teraz = 0, rekord = 0, kiedy = 0;
    for (int i = 0; i < 2 * n; i++) {
        teraz += z[i].second;
        if (teraz > rekord) {
            rekord = teraz;
            kiedy = z[i].first;
        }
    }
    cout << rekord << " " << kiedy << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-najblizsze-domy', krok: 8, level: 'srednie',
            title: 'Najbliższe domy',
            short: 'Które dwa domy przy drodze stoją najbliżej siebie? Sortuj pary (pozycja, numer) i patrz na sąsiadów.',
            tags: ['para (pozycja, numer)', 'sort', 'sąsiedzi po sortowaniu'],
            statement: ['Przy prostej drodze stoi n domów ponumerowanych od 1, każdy w punkcie o podanej pozycji (dwa domy mogą stać w tym samym punkcie). Znajdź dwa domy stojące najbliżej siebie. Wypisz odległość między nimi i numery obu domów — mniejszy numer pierwszy. Jeśli takich par jest kilka, ustaw domy według pozycji (przy równych pozycjach — według numerów) i wybierz parę sąsiadów, która stoi najbardziej na lewo.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n pozycji domów.'],
            output_format: ['Trzy liczby: odległość i numery dwóch domów.'],
            constraints: ['2 ≤ n ≤ 5000', '0 ≤ pozycja ≤ 10⁹'],
            examples: [{ input: '5\n30 4 17 21 9', note: 'Najbliżej siebie stoją domy w punktach 17 i 21 — to domy numer 3 i 4.' }],
            hint: R`Zrób pary {pozycja, numer}. Po sortowaniu najbliższa para to zawsze dwaj sąsiedzi w tablicy. Szukaj najmniejszej różnicy t[i + 1].first - t[i].first, zmieniając rekord tylko przy ostro mniejszej. Numery wypisz od mniejszego.`,
            tests: (r) => ['5\n30 4 17 21 9', '2\n5 5', '3\n10 0 5', `5000\n${Array.from({ length: 5000 }, () => r.int(0, 1e9)).join(' ')}`, `1000\n${Array.from({ length: 1000 }, () => r.int(0, 1e6)).join(' ')}`, `50\n${Array.from({ length: 50 }, () => r.int(0, 100) * 7).join(' ')}`],
            solve: (inp) => { const v = nums(inp); const n = v[0]; const t = v.slice(1, 1 + n).map((x, i) => [x, i + 1]); t.sort(cmp); let b = Infinity, x = 0, y = 0; for (let i = 0; i + 1 < n; i++) { const d = t[i + 1][0] - t[i][0]; if (d < b) { b = d; x = Math.min(t[i][1], t[i + 1][1]); y = Math.max(t[i][1], t[i + 1][1]); } } return `${b} ${x} ${y}`; },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
pair<int, int> t[100005];
int main() {
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        cin >> t[i].first;
        t[i].second = i + 1;
    }
    sort(t, t + n);
    int najm = 2000000000, a = 0, b = 0;
    for (int i = 0; i + 1 < n; i++) {
        int d = t[i + 1].first - t[i].first;
        if (d < najm) {
            najm = d;
            a = min(t[i].second, t[i + 1].second);
            b = max(t[i].second, t[i + 1].second);
        }
    }
    cout << najm << " " << a << " " << b << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-wyklady', krok: 8, level: 'srednie',
            title: 'Najwięcej wykładów',
            short: 'Zachłannie: zawsze wybieraj wykład, który najwcześniej się kończy. Ile ich wybierzesz i które?',
            tags: ['sort po końcach', 'zachłanny wybór', '{{koniec, początek}, numer}'],
            statement: ['W auli jest n wykładów ponumerowanych od 1; wykład trwa od chwili s do chwili e (s < e). Chcesz być na jak największej liczbie wykładów, ale na każdym od początku do końca, więc wybrane wykłady nie mogą się nakładać. Wykład kończący się w chwili 5 i wykład zaczynający się w chwili 5 można połączyć. Wybieraj zachłannie: przeglądaj wykłady od najwcześniej kończącego się (przy równych końcach — od wcześniej zaczynającego się, a potem o mniejszym numerze) i bierz każdy, który zaczyna się nie wcześniej niż koniec ostatnio wybranego. Wypisz liczbę wybranych wykładów, a w drugim wierszu ich numery w kolejności wybierania.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach początek s i koniec e wykładu.'],
            output_format: ['W pierwszym wierszu liczba wybranych wykładów.', 'W drugim wierszu ich numery.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ s < e ≤ 10⁹'],
            examples: [{ input: '4\n1 4\n3 5\n0 6\n5 7' }],
            hint: R`Klucz wykładu: pair<pair<int, int>, int> {{e, s}, numer}. Po sortowaniu idź po kolei i pamiętaj, od kiedy jesteś wolny (na start 0 albo −1). Wykład bierzesz, gdy jego początek jest ≥ tej chwili; wtedy wolny jesteś od jego końca.`,
            check: (inp) => { const v = nums(inp); for (let i = 0; i < v[0]; i++) if (!(v[1 + 2 * i] < v[2 + 2 * i])) return 's >= e'; return null; },
            tests: (r) => {
                const gen = (n, mx, dl) => `${n}\n${Array.from({ length: n }, () => { const a = r.int(0, mx - 1); return `${a} ${Math.min(mx, a + r.int(1, dl))}`; }).join('\n')}`;
                return ['4\n1 4\n3 5\n0 6\n5 7', '1\n0 1', '3\n0 5\n0 5\n5 6', gen(1000, 1e9, 1e7), gen(1000, 1000, 30), gen(100, 50, 10)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const w = []; for (let i = 0; i < n; i++) w.push([v[2 + 2 * i], v[1 + 2 * i], i + 1]); w.sort(cmp); let wolne = -1; const wyb = []; for (const [e, s, k] of w) { if (s >= wolne) { wyb.push(k); wolne = e; } } return `${wyb.length}\n${wyb.join(' ')}`; },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<pair<int, int>, int> w[1005];
    for (int i = 0; i < n; i++) {
        int s, e;
        cin >> s >> e;
        w[i] = {{e, s}, i + 1};
    }
    sort(w, w + n);
    int wybrane[1005];
    int ile = 0, wolneOd = -1;
    for (int i = 0; i < n; i++) {
        if (w[i].first.second >= wolneOd) {
            wybrane[ile++] = w[i].second;
            wolneOd = w[i].first.first;
        }
    }
    cout << ile << "\n";
    for (int i = 0; i < ile; i++) cout << wybrane[i] << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-litera-na-pozycji', krok: 8, level: 'srednie',
            title: 'Litera na pozycji',
            short: 'Napis zapisany jako pary (litera, ile razy) jest gigantyczny. Która litera stoi na pozycji p?',
            tags: ['pair<char, long long>', 'serie', 'odejmowanie długości'],
            statement: ['Bardzo długi napis zapisano w skrócie jako n par (litera, liczba powtórzeń): para (a, 3) oznacza aaa. Cały napis to kolejne serie sklejone ze sobą — może mieć bilion znaków, więc nie da się go zbudować. Odpowiedz na q pytań: jaka litera stoi na pozycji p (pozycje liczymy od 1)?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach litera i liczba powtórzeń.', 'Potem liczba q i q wierszy z pozycjami p.'],
            output_format: ['q wierszy z literami.'],
            constraints: ['1 ≤ n, q ≤ 1000', '1 ≤ liczba powtórzeń ≤ 10⁹', '1 ≤ p ≤ długość całego napisu'],
            examples: [{ input: '3\na 3\nb 1\nc 2\n4\n1\n4\n5\n6', note: 'Napis to aaabcc.' }],
            hint: R`Nie buduj napisu. Dla każdego pytania idź po seriach: dopóki p jest większe od długości bieżącej serii, odejmij jej długość od p i przejdź do następnej. Seria, na której się zatrzymasz, zawiera szukaną pozycję. p i długości trzymaj w long long.`,
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); let s = 0; for (let i = 0; i < n; i++) s += Number(t[2 + 2 * i]); const q = Number(t[1 + 2 * n]); for (let i = 0; i < q; i++) { const p = Number(t[2 + 2 * n + i]); if (p < 1 || p > s) return 'p poza napisem'; } return null; },
            tests: (r) => {
                const gen = (n, q, mx) => { const c = Array.from({ length: n }, () => [r.word(1), r.int(1, mx)]); const s = c.reduce((a, x) => a + x[1], 0); return `${n}\n${c.map((x) => x.join(' ')).join('\n')}\n${q}\n${Array.from({ length: q }, () => r.pick([1, s, r.int(1, s)])).join('\n')}`; };
                return ['3\na 3\nb 1\nc 2\n4\n1\n4\n5\n6', gen(1, 5, 1e9), gen(1000, 1000, 1e9), gen(50, 200, 3), gen(1000, 1000, 1)];
            },
            solve: (inp) => { const t = toks(inp); const n = Number(t[0]); const c = []; for (let i = 0; i < n; i++) c.push([t[1 + 2 * i], Number(t[2 + 2 * i])]); const q = Number(t[1 + 2 * n]); const out = []; for (let k = 0; k < q; k++) { let p = Number(t[2 + 2 * n + k]); let i = 0; while (p > c[i][1]) { p -= c[i][1]; i++; } out.push(c[i][0]); } return out.join('\n'); },
            cpp: R`
#include <iostream>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<char, long long> s[1005];
    for (int i = 0; i < n; i++) {
        cin >> s[i].first >> s[i].second;
    }
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        long long p;
        cin >> p;
        int i = 0;
        while (p > s[i].second) {
            p -= s[i].second;
            i++;
        }
        cout << s[i].first << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-kolejka-do-lekarza', krok: 8, level: 'srednie',
            title: 'Kolejka do lekarza',
            short: 'Pacjenci przychodzą o różnych porach. Kiedy każdy z nich wyjdzie z gabinetu?',
            tags: ['sort po przyjściu', '{przyjście, numer}', 'symulacja'],
            statement: ['Do lekarza przychodzi n pacjentów ponumerowanych od 1. Pacjent przychodzi w chwili a i jego wizyta trwa d minut. Lekarz przyjmuje pacjentów w kolejności przyjścia (przy równych chwilach — w kolejności numerów), jednego na raz. Wizyta zaczyna się, gdy pacjent jest już w przychodni i lekarz jest wolny. Dla każdego pacjenta, w kolejności numerów, wypisz chwilę, w której wyjdzie z gabinetu.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach chwila przyjścia a i czas wizyty d.'],
            output_format: ['n wierszy: chwile wyjścia pacjentów 1, 2, …, n.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ a ≤ 10⁶', '1 ≤ d ≤ 1000'],
            examples: [{ input: '3\n10 5\n0 20\n12 3', note: 'Pacjent 2 przychodzi pierwszy (0) i wychodzi o 20. Pacjent 1 czekał od 10 — wychodzi o 25. Pacjent 3 wychodzi o 28.' }],
            hint: R`Posortuj pary {przyjście, numer}, a czasy wizyt trzymaj w zwykłej tablicy według numerów. Zegar lekarza: początek wizyty to max(zegar, przyjście), koniec — początek + czas. Wynik zapisz w tablicy koniec[numer] i wypisz po kolei.`,
            tests: (r) => {
                const gen = (n, mx, dm) => `${n}\n${Array.from({ length: n }, () => `${r.int(0, mx)} ${r.int(1, dm)}`).join('\n')}`;
                return ['3\n10 5\n0 20\n12 3', '1\n5 5', '2\n0 1\n0 1', gen(1000, 1e6, 1000), gen(1000, 2000, 10), gen(30, 30, 5)];
            },
            solve: (inp) => { const v = nums(inp); const n = v[0]; const t = []; for (let i = 0; i < n; i++) t.push([v[1 + 2 * i], i, v[2 + 2 * i]]); t.sort(cmp); const k = new Array(n); let z = 0; for (const [a, i, d] of t) { z = Math.max(z, a) + d; k[i] = z; } return k.join('\n'); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> p[1005];
    int czas[1005], koniec[1005];
    for (int i = 0; i < n; i++) {
        cin >> p[i].first >> czas[i];
        p[i].second = i;
    }
    sort(p, p + n);
    int zegar = 0;
    for (int i = 0; i < n; i++) {
        int kto = p[i].second;
        zegar = max(zegar, p[i].first) + czas[kto];
        koniec[kto] = zegar;
    }
    for (int i = 0; i < n; i++) {
        cout << koniec[i] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'pair-najdluzsza-cisza', krok: 8, level: 'latwe',
            title: 'Najdłuższa cisza',
            short: 'Godziny dzwonków jako pary (h, m) — posortuj je i znajdź najdłuższą przerwę między kolejnymi.',
            tags: ['sort par (h, m)', 'różnica minut', 'HH:MM'],
            statement: ['W szkole w ciągu dnia dzwoni dzwonek o n różnych porach (podanych w dowolnej kolejności). Znajdź najdłuższą przerwę między dwoma kolejnymi dzwonkami tego samego dnia. Wypisz jej długość w minutach, a po spacji — godziny dzwonka rozpoczynającego i kończącego tę przerwę w postaci HH:MM. Jeśli kilka przerw ma tę samą największą długość, wybierz najwcześniejszą.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W kolejnych n wierszach godzina i minuta dzwonka.'],
            output_format: ['Długość przerwy i dwie godziny w postaci HH:MM.'],
            constraints: ['2 ≤ n ≤ 1000', 'Pory dzwonków są różne.'],
            examples: [{ input: '4\n9 45\n8 0\n10 30\n8 45', note: 'Po posortowaniu: 8:00, 8:45, 9:45, 10:30. Przerwy: 45, 60 i 45 minut.' }],
            hint: R`Posortuj pary (godzina, minuta) — ułożą się chronologicznie. Przerwa między t[i] i t[i + 1] to różnica ich minut od północy. Zmieniaj rekord tylko przy ostro dłuższej przerwie.`,
            tests: (r) => {
                const gen = (n) => { const s = new Set(); while (s.size < n) s.add(`${r.int(0, 23)} ${r.int(0, 59)}`); return `${n}\n${r.shuffle([...s]).join('\n')}`; };
                return ['4\n9 45\n8 0\n10 30\n8 45', '2\n23 59\n0 0', gen(1000), gen(10), gen(100)];
            },
            solve: (inp) => { const v = nums(inp); const t = []; for (let i = 0; i < v[0]; i++) t.push([v[1 + 2 * i], v[2 + 2 * i]]); t.sort(cmp); let b = -1, x = null, y = null; for (let i = 0; i + 1 < t.length; i++) { const d = t[i + 1][0] * 60 + t[i + 1][1] - t[i][0] * 60 - t[i][1]; if (d > b) { b = d; x = t[i]; y = t[i + 1]; } } return `${b} ${p2(x[0])}:${p2(x[1])} ${p2(y[0])}:${p2(y[1])}`; },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n;
    cin >> n;
    pair<int, int> t[1005];
    for (int i = 0; i < n; i++) {
        cin >> t[i].first >> t[i].second;
    }
    sort(t, t + n);
    int najd = -1;
    pair<int, int> od, doo;
    for (int i = 0; i + 1 < n; i++) {
        int d = (t[i + 1].first * 60 + t[i + 1].second) - (t[i].first * 60 + t[i].second);
        if (d > najd) {
            najd = d;
            od = t[i];
            doo = t[i + 1];
        }
    }
    cout << najd << " ";
    if (od.first < 10) cout << "0";
    cout << od.first << ":";
    if (od.second < 10) cout << "0";
    cout << od.second << " ";
    if (doo.first < 10) cout << "0";
    cout << doo.first << ":";
    if (doo.second < 10) cout << "0";
    cout << doo.second << "\n";
    return 0;
}`,
        },
        {
            id: 'pair-awans', krok: 8, level: 'srednie',
            title: 'Awans do finału',
            short: 'Do finału awansuje k najlepszych. Wypisz ich numery rosnąco — sortując dwa razy.',
            tags: ['{{-punkty, czas}, numer}', 'sort', 'drugie sortowanie'],
            statement: ['W eliminacjach startuje n zawodników ponumerowanych od 1. Każdy ma liczbę punktów i czas. Lepszy jest zawodnik z większą liczbą punktów; przy równych punktach — z krótszym czasem; a przy równych czasach — z mniejszym numerem. Do finału awansuje k najlepszych. Wypisz numery finalistów w kolejności rosnącej.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W kolejnych n wierszach punkty i czas zawodnika.'],
            output_format: ['k numerów finalistów w kolejności rosnącej, oddzielonych spacjami.'],
            constraints: ['1 ≤ k ≤ n ≤ 1000', '0 ≤ punkty ≤ 1000', '1 ≤ czas ≤ 10⁶'],
            examples: [{ input: '5 3\n50 300\n70 400\n50 250\n70 400\n10 100', note: 'Ranking: 2 (70 pkt, 400), 4 (70 pkt, 400 — numer większy), 3 (50 pkt, 250), 1, 5. Awansują 2, 4 i 3 — rosnąco: 2 3 4.' }],
            hint: R`Ranking: posortuj klucze pair<pair<int, int>, int> {{-punkty, czas}, numer}. Pierwsze k par to finaliści. Ich numery przepisz do zwykłej tablicy int i posortuj ją jeszcze raz — tym razem rosnąco po numerach.`,
            tests: (r) => {
                const gen = (n, k, pm, cm) => `${n} ${k}\n${Array.from({ length: n }, () => `${r.int(0, pm)} ${r.int(1, cm)}`).join('\n')}`;
                return ['5 3\n50 300\n70 400\n50 250\n70 400\n10 100', '1 1\n0 1', '3 3\n1 1\n1 1\n1 1', gen(1000, 100, 1000, 1e6), gen(1000, 500, 5, 5), gen(30, 10, 3, 3)];
            },
            solve: (inp) => { const v = nums(inp); const [n, k] = v; const t = []; for (let i = 0; i < n; i++) t.push([-v[2 + 2 * i], v[3 + 2 * i], i + 1]); t.sort(cmp); return t.slice(0, k).map((x) => x[2]).sort((a, b) => a - b).join(' '); },
            cpp: R`
#include <iostream>
#include <algorithm>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    pair<pair<int, int>, int> t[1005];
    for (int i = 0; i < n; i++) {
        int p, c;
        cin >> p >> c;
        t[i] = {{-p, c}, i + 1};
    }
    sort(t, t + n);
    int finalisci[1005];
    for (int i = 0; i < k; i++) {
        finalisci[i] = t[i].second;
    }
    sort(finalisci, finalisci + k);
    for (int i = 0; i < k; i++) {
        cout << finalisci[i] << " ";
    }
    cout << "\n";
    return 0;
}`,
        },
    ];
};
