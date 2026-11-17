// Input i Output (+) — baza zadań na koniec lekcji: 10 łatwych, 10 średnich i 8 trudnych, od najłatwiejszego do najtrudniejszego.
// Każde zadanie łączy kilka części lekcji: formaty danych, wiele testów, wypisywanie w kolumnach, znak po znaku, getline,
// rozbieranie wiersza, polecenia i duże dane. Na koniec wielki finał: tabela wyników zawodów z dziennika zgłoszeń.
module.exports = (h) => {
    const { toks, safe, fx } = h;
    const P = require('./input-output-plus-pomoc');
    const { IMIONA, NAZWISKA, MIASTA, SLOWA, rozrzuc, losy, calk, czyLiczba, zdanie, imieNazwisko } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const ascii = (s) => /^[\x20-\x7e\n]*$/.test(s);
    const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
    const pad2 = (x) => String(x).padStart(2, '0');

    return [
        // ================================================================ ŁATWE
        {
            id: 'iop-b-lista-obecnosci', krok: 9, level: 'latwe',
            title: 'Lista obecności',
            short: 'Imiona do słowa KONIEC, niektóre zeskanowane dwa razy. Ilu różnych uczniów przyszło — i kto, alfabetycznie, po przecinku?',
            tags: ['słowo kończące', 'set<string>', 'separator „, ”'],
            statement: ['Uczniowie wchodzący na wycieczkę przykładają legitymację do czytnika, a czytnik zapisuje imię. Niektórzy przyłożyli legitymację dwa razy. Na końcu zapisu stoi słowo KONIEC, a za nim — śmieci z poprzedniej wycieczki.',
                'Wypisz, ilu różnych uczniów przyszło, a w drugim wierszu ich imiona alfabetycznie, oddzielone przecinkiem i spacją.'],
            input_format: ['Imiona oddzielone białymi znakami, aż do słowa KONIEC; za nim mogą stać jeszcze inne słowa.'],
            output_format: ['W pierwszym wierszu liczba różnych imion.', 'W drugim wierszu te imiona alfabetycznie, oddzielone przecinkiem i spacją.'],
            constraints: ['Przed słowem KONIEC jest od 1 do 2000 imion, różnych — najwyżej 500.', 'Imię ma od 1 do 15 liter alfabetu angielskiego.'],
            examples: [{ input: 'Ola Bartek Ola\nZuzia Adam Bartek KONIEC Iga', note: 'Różnych uczniów jest czworo: Adam, Bartek, Ola, Zuzia. Iga stoi za słowem KONIEC.' }],
            hint: R`while (cin >> s && s != "KONIEC") wstawiaj imiona do set<string> — powtórki znikną, a kolejność będzie alfabetyczna. Potem size() i pętla po zbiorze z ", " przed każdym imieniem oprócz pierwszego.`,
            tests: (r) => {
                const pula = [...IMIONA, ...Array.from({ length: 450 }, () => { const w = r.word(r.int(3, 12)); return w[0].toUpperCase() + w.slice(1); })];
                const d = (n, po, p = pula) => rozrzuc(r, [...Array.from({ length: n }, () => r.pick(p)), 'KONIEC', ...po]);
                return ['Ala KONIEC', 'Ala Ala Ala KONIEC Ola', d(10, ['Kuba'], IMIONA.slice(0, 6)), d(300, ['KONIEC', 'Zosia'], IMIONA), d(2000, Array.from({ length: 30 }, () => r.pick(IMIONA))), d(2000, [])];
            },
            check: (inp) => {
                const t = toks(inp); const k = t.indexOf('KONIEC'); if (k < 1 || k > 2000) return 'KONIEC';
                if (!t.every((w) => /^[A-Za-z]{1,15}$/.test(w))) return 'słowa'; return new Set(t.slice(0, k)).size <= 500 ? null : 'różne';
            },
            solve: (inp) => { const t = toks(inp); const s = [...new Set(t.slice(0, t.indexOf('KONIEC')))].sort(cmp); return `${s.length}\n${s.join(', ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    set<string> obecni;
    string s;
    while (cin >> s && s != "KONIEC") obecni.insert(s);
    cout << obecni.size() << "\n";
    bool pierwszy = true;
    for (auto &x : obecni) {
        if (!pierwszy) cout << ", ";
        cout << x;
        pierwszy = false;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-rachunek', krok: 9, level: 'latwe',
            title: 'Rachunek w restauracji',
            short: 'Nazwa dania, kropki i cena — każdy wiersz rachunku ma dokładnie 30 znaków. Na dole linia z = i SUMA.',
            tags: ['string(k, \'.\')', 'grosze jako Z.GG', 'stała szerokość'],
            statement: ['Drukarka w restauracji drukuje rachunki o szerokości dokładnie 30 znaków. W każdym wierszu nazwa dania stoi przy lewej krawędzi, cena (złote, kropka, dwie cyfry groszy) przy prawej, a całe miejsce pomiędzy wypełniają kropki.',
                'Pod daniami jest wiersz złożony z 30 znaków =, a pod nim wiersz z napisem SUMA, kropkami i łączną kwotą — w tym samym formacie.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy nazwa dania (jedno słowo) i cena w groszach.'],
            output_format: ['n + 2 wiersze po dokładnie 30 znaków.'],
            constraints: ['1 ≤ n ≤ 100', 'Nazwa dania: od 1 do 18 znaków (litery i _).', '1 ≤ cena ≤ 100 000 groszy'],
            examples: [{ input: '3\nPierogi 2450\nKompot 600\nSernik_z_wisniami 1299', note: 'Cena 600 groszy to 6.00. Suma: 2450 + 600 + 1299 = 4349 groszy, czyli 43.49.' }],
            hint: R`Cenę zamień na napis: to_string(g / 100) + "." + (g % 100 < 10 ? "0" : "") + to_string(g % 100). Kropek jest 30 − długość nazwy − długość ceny: cout << nazwa << string(kropki, '.') << cena << "\n";. Linia ze znakami = to string(30, '=').`,
            tests: (r) => {
                const DANIA = ['Pierogi', 'Kompot', 'Rosol', 'Schabowy', 'Frytki', 'Sernik', 'Nalesniki', 'Zurek', 'Bigos', 'Kawa', 'Herbata', 'Lody', 'Salatka_grecka', 'Placki_z_jablkami', 'Kotlet_mielony', 'Golabki'];
                const d = (a) => `${a.length}\n${a.map(([n, c]) => `${n} ${c}`).join('\n')}`;
                return [d([['A', 1]]), d([['Sernik_z_rodzynkam', 100000], ['Kawa', 5]]), d([['Pierogi', 2450], ['Kompot', 600], ['Sernik_z_wisniami', 1299]]),
                    d(Array.from({ length: 10 }, () => [r.pick(DANIA), r.int(100, 9999)])), d(Array.from({ length: 100 }, () => [r.pick(DANIA), r.int(1, 100000)])), d(Array.from({ length: 100 }, () => ['x', 100000]))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 100) || L.length !== n + 1) return 'n';
                return L.slice(1).every((l) => { const [a, b] = l.split(' '); return /^[A-Za-z_]{1,18}$/.test(a) && calk(Number(b), 1, 100000); }) ? null : 'danie';
            },
            solve: (inp) => {
                const L = linie(inp).slice(1).map((l) => l.split(' ')); let s = 0;
                const w = (a, c) => a + '.'.repeat(30 - a.length - c.length) + c;
                const o = L.map(([a, c]) => { s += Number(c); return w(a, P.zlote(Number(c))); });
                return [...o, '='.repeat(30), w('SUMA', P.zlote(s))].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
string kwota(long long g) {
    string s = to_string(g / 100) + ".";
    if (g % 100 < 10) s += "0";
    return s + to_string(g % 100);
}
int main() {
    int n;
    cin >> n;
    long long suma = 0;
    for (int i = 0; i < n; i++) {
        string danie;
        long long cena;
        cin >> danie >> cena;
        suma += cena;
        string c = kwota(cena);
        cout << danie << string(30 - danie.size() - c.size(), '.') << c << "\n";
    }
    cout << string(30, '=') << "\n";
    string c = kwota(suma);
    cout << "SUMA" << string(30 - 4 - c.size(), '.') << c << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-tekst-w-lustrze', krok: 9, level: 'latwe',
            title: 'Tekst w lustrze',
            short: 'Każdy wiersz tekstu odwróć znak po znaku — razem ze spacjami. Puste wiersze zostają puste.',
            tags: ['while (getline(cin, s))', 'reverse', 'puste wiersze'],
            statement: ['Leonardo da Vinci pisał notatki pismem lustrzanym. Zamień zwykły tekst na lustrzany: każdy wiersz odwróć znak po znaku (spacje też), zostawiając wiersze w tej samej kolejności. Puste wiersze zostają puste.'],
            input_format: ['Tekst — do końca danych.'],
            output_format: ['Ten sam tekst, w którym każdy wiersz jest odwrócony.'],
            constraints: ['Tekst ma od 1 do 1000 wierszy i najwyżej 30 000 znaków.'],
            examples: [{ input: 'Ala ma kota\n\nKajak', note: 'Pusty wiersz zostaje pusty, a Kajak czytany od tyłu to kajaK.' }],
            hint: R`while (getline(cin, s)) { reverse(s.begin(), s.end()); cout << s << "\n"; }. Gdybyś czytał przez cin >> s, zgubiłbyś spacje i puste wiersze.`,
            tests: (r) => {
                const t = (n) => { const L = []; for (let i = 0; i < n; i++) L.push(i && i < n - 1 && r() < 0.15 ? '' : zdanie(r, 1, 9)); return L.join('\n'); };
                return ['a', 'ab cd', 'Ala ma kota\n\nKajak', t(10), t(400), t(1000).slice(0, 30000)];
            },
            check: (inp) => (linie(inp).length <= 1000 && inp.length <= 30000 && ascii(inp) ? null : 'tekst'),
            solve: (inp) => linie(inp).map((l) => [...l].reverse().join('')).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    while (getline(cin, s)) {
        reverse(s.begin(), s.end());
        cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-jak-wc', krok: 9, level: 'latwe',
            title: 'Jak polecenie wc',
            short: 'Policz wiersze, słowa i znaki tekstu — tak jak robi to linuksowe polecenie wc.',
            tags: ['getline', 'stringstream albo liczenie słów', 'znaki bez entera'],
            statement: ['W systemie Linux polecenie wc liczy wiersze, słowa i znaki pliku. Zrób to samo dla tekstu z wejścia. Słowo to ciąg znaków bez spacji (spacji między słowami może być kilka). Znaki to wszystkie znaki tekstu oprócz znaków końca wiersza — spacje się liczą.'],
            input_format: ['Tekst — do końca danych. Wiersze mogą być puste.'],
            output_format: ['Trzy wiersze: wiersze: a, slowa: b, znaki: c.'],
            constraints: ['Tekst ma od 1 do 2000 wierszy i najwyżej 50 000 znaków.'],
            examples: [{ input: 'Ala  ma kota\n\nI psa.', note: 'Trzy wiersze (drugi pusty), pięć słów i 12 + 0 + 6 = 18 znaków.' }],
            hint: R`Czytaj while (getline(cin, s)): wiersze++, znaki += s.size(), a słowa policz strumieniem z napisu: stringstream ss(s); while (ss >> w) slowa++;.`,
            tests: (r) => {
                const t = (n) => { const L = []; for (let i = 0; i < n; i++) L.push(i && r() < 0.15 ? '' : (i && r() < 0.2 ? '  ' : '') + Array.from({ length: r.int(1, 10) }, () => r.pick(SLOWA)).join(' '.repeat(r.int(1, 3)))); return L.join('\n'); };
                return ['x', 'a b\nc', 'Ala  ma kota\n\nI psa.', t(20), t(800), t(2000).slice(0, 50000)];
            },
            check: (inp) => (linie(inp).length <= 2000 && inp.length <= 50000 && ascii(inp) ? null : 'tekst'),
            solve: (inp) => { const L = linie(inp); return `wiersze: ${L.length}\nslowa: ${L.reduce((a, l) => a + l.split(' ').filter(Boolean).length, 0)}\nznaki: ${L.reduce((a, l) => a + l.length, 0)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, w;
    long long wiersze = 0, slowa = 0, znaki = 0;
    while (getline(cin, s)) {
        wiersze++;
        znaki += s.size();
        stringstream ss(s);
        while (ss >> w) slowa++;
    }
    cout << "wiersze: " << wiersze << "\n";
    cout << "slowa: " << slowa << "\n";
    cout << "znaki: " << znaki << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-histogram', krok: 9, level: 'latwe',
            title: 'Histogram z gwiazdek',
            short: 'Liczby aż do zera, każda jako pasek z gwiazdek. Liczby przed paskami dosunięte do prawej, żeby paski zaczynały się równo.',
            tags: ['wartość kończąca 0', 'setw z najdłuższej', 'string(k, \'*\')'],
            statement: ['Dostajesz liczby dodatnie zakończone zerem. Dla każdej liczby x (w kolejności z wejścia) wypisz wiersz: liczbę x dosuniętą do prawej w polu o szerokości najdłuższej liczby, potem spację, kreskę |, spację i x gwiazdek.'],
            input_format: ['Liczby całkowite dodatnie oddzielone białymi znakami, zakończone zerem.'],
            output_format: ['Po jednym wierszu histogramu na każdą liczbę przed zerem.'],
            constraints: ['Liczb przed zerem jest od 1 do 300.', '1 ≤ każda liczba ≤ 60'],
            examples: [{ input: '7 12 3 0', note: 'Najdłuższa liczba, 12, ma dwie cyfry — dlatego przed 7 i 3 stoi spacja i wszystkie kreski są w jednej kolumnie.' }],
            hint: R`Najpierw wczytaj liczby do vectora: while (cin >> x && x != 0). Szerokość to długość najdłuższej z nich (to_string). Potem dla każdej: cout << setw(w) << x << " | " << string(x, '*') << "\n";.`,
            tests: (r) => {
                const d = (a) => rozrzuc(r, [...a, 0]);
                return ['1 0', '60 0', d([7, 12, 3]), d(losy(r, 20, 1, 9)), d(losy(r, 300, 1, 60)), d([...losy(r, 299, 1, 9), 10])];
            },
            check: (inp) => { const t = nums(inp); return t[t.length - 1] === 0 && t.length >= 2 && t.length <= 301 && t.slice(0, -1).every((x) => calk(x, 1, 60)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(0, -1); const w = Math.max(...a.map((x) => String(x).length)); return a.map((x) => `${String(x).padStart(w)} | ${'*'.repeat(x)}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<int> v;
    int x, w = 0;
    while (cin >> x && x != 0) {
        v.push_back(x);
        w = max(w, (int)to_string(x).size());
    }
    for (int y : v) cout << setw(w) << y << " | " << string(y, '*') << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-pogoda-dni', krok: 9, level: 'latwe',
            title: 'Pogoda dzień po dniu',
            short: 'Każdy dzień to osobny test z pomiarami. Wypisz minimum, maksimum i średnią z jedną cyfrą po kropce — w formacie Dzien k: …',
            tags: ['wiele testów', 'fixed i setprecision(1)', 'reset co test'],
            statement: ['Stacja pogodowa mierzy temperaturę kilka razy dziennie. Dla każdego z t dni dostajesz liczbę pomiarów n i same pomiary (liczby całkowite, także ujemne).',
                'Dla każdego dnia wypisz wiersz: Dzien k: najniższa najwyższa średnia — średnią z dokładnie jedną cyfrą po kropce.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy dzień: liczba n, a w następnym wierszu n pomiarów.'],
            output_format: ['t wierszy w formacie Dzien k: min max srednia.'],
            constraints: ['1 ≤ t ≤ 365', '1 ≤ n ≤ 24', '−30 ≤ każdy pomiar ≤ 40', 'Średnie nie wypadają dokładnie w połowie między dwoma wynikami (np. 2.25).'],
            examples: [{ input: '2\n4\n3 7 -2 6\n3\n-5 -6 -4', note: 'Pierwszego dnia: najniżej −2, najwyżej 7, średnia 14 / 4 = 3.5. Drugiego dnia wszystkie pomiary są ujemne, a średnia to −15 / 3 = −5.0 — z jedną cyfrą po kropce, mimo że jest zerem.' }],
            hint: R`Numer dnia daje pętla for (int k = 1; k <= t; k++). Minimum, maksimum i sumę twórz w środku pętli — w każdym teście od nowa. Średnia: (double)suma / n, wypisana po cout << fixed << setprecision(1).`,
            tests: (r) => {
                const dzien = (n) => { let a; do { a = losy(r, n, -30, 40); } while (!safe(a.reduce((p, q) => p + q, 0) / n, 1)); return a; };
                const d = (dni) => `${dni.length}\n${dni.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`;
                return [d([[0]]), d([[40], [-30]]), d([[3, 7, -2, 6], [-5, -6, -4]]), d(Array.from({ length: 30 }, () => dzien(r.int(1, 24)))), d(Array.from({ length: 365 }, () => dzien(r.int(1, 24))))];
            },
            check: (inp) => {
                const t = nums(inp); const T = t[0]; if (!calk(T, 1, 365)) return 't';
                let p = 1; for (let i = 0; i < T; i++) { const n = t[p]; if (!calk(n, 1, 24)) return 'n'; const a = t.slice(p + 1, p + 1 + n); if (a.length !== n || !a.every((x) => calk(x, -30, 40)) || !safe(a.reduce((x, y) => x + y, 0) / n, 1)) return 'dzień'; p += n + 1; }
                return p === t.length ? null : 'długość';
            },
            solve: (inp) => {
                const t = nums(inp); const o = []; let p = 1;
                for (let k = 1; k <= t[0]; k++) { const n = t[p]; const a = t.slice(p + 1, p + 1 + n); o.push(`Dzien ${k}: ${Math.min(...a)} ${Math.max(...a)} ${fx(a.reduce((x, y) => x + y, 0) / n, 1)}`); p += n + 1; }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    cout << fixed << setprecision(1);
    for (int k = 1; k <= t; k++) {
        int n;
        cin >> n;
        int mn = 1000, mx = -1000, suma = 0;
        for (int i = 0; i < n; i++) {
            int x;
            cin >> x;
            mn = min(mn, x);
            mx = max(mx, x);
            suma += x;
        }
        cout << "Dzien " << k << ": " << mn << " " << mx << " " << (double)suma / n << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-kody-pocztowe', krok: 9, level: 'latwe',
            title: 'Poprawne kody pocztowe',
            short: 'Kod pocztowy to dwie cyfry, minus i trzy cyfry. Sprawdź każdy wiersz znak po znaku — spacja albo litera to już błąd.',
            tags: ['getline', 'isdigit', 'sprawdzanie formatu'],
            statement: ['Polski kod pocztowy ma postać CC-CCC: dwie cyfry, minus i trzy cyfry — razem dokładnie 6 znaków, bez spacji. Na przykład 30-059 jest poprawny, a 30059, 30 059, 3-0059 i 30-05a — nie.',
                'Dla każdego wiersza wejścia wypisz TAK albo NIE, a na końcu wiersz Poprawnych: k.'],
            input_format: ['Wiersze do sprawdzenia — do końca danych. Wiersz może zawierać dowolne znaki ASCII (także spacje) albo być pusty.'],
            output_format: ['Po jednym wierszu TAK albo NIE na każdy wiersz wejścia, a potem Poprawnych: k.'],
            constraints: ['Wierszy jest od 1 do 1000, każdy ma najwyżej 20 znaków.'],
            examples: [{ input: '30-059\n30059\n30 059\n00-000\n3a-123', note: 'Poprawne są tylko 30-059 i 00-000.' }],
            hint: R`Czytaj wiersze przez getline — tylko tak zobaczysz spacje w środku. Wiersz jest poprawny, gdy s.size() == 6, s[2] == '-', a wszystkie pozostałe znaki to cyfry (isdigit).`,
            tests: (r) => {
                const dobry = () => `${r.word(2, '0123456789')}-${r.word(3, '0123456789')}`;
                const zly = () => { const s = dobry(); const p = r(); if (p < 0.2) return s.replace('-', ''); if (p < 0.35) return s.replace('-', ' '); if (p < 0.5) return s + r.pick(['0', ' x', '-']); if (p < 0.65) return s.slice(1); if (p < 0.8) { const i = r.pick([0, 1, 3, 4, 5]); return s.slice(0, i) + r.pick(['a', ' ', '-', 'O']) + s.slice(i + 1); } return r.pick(['', 'kod', '--', '12-3456', '12--345']); };
                const t = (n) => { const L = Array.from({ length: n }, () => (r() < 0.5 ? dobry() : zly())); L[0] = dobry(); L[n - 1] = dobry(); return L.join('\n'); };
                return ['30-059', '30059', '30-059\n30059\n30 059\n00-000\n3a-123', t(30), t(1000)];
            },
            check: (inp) => { const L = linie(inp); return L.length <= 1000 && L.every((l) => l.length <= 20) && ascii(inp) ? null : 'wiersze'; },
            solve: (inp) => { const o = linie(inp).map((l) => (/^\d\d-\d\d\d$/.test(l) ? 'TAK' : 'NIE')); return [...o, `Poprawnych: ${o.filter((x) => x === 'TAK').length}`].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int poprawnych = 0;
    while (getline(cin, s)) {
        bool ok = s.size() == 6 && s[2] == '-';
        for (int i = 0; i < (int)s.size() && ok; i++)
            if (i != 2 && !isdigit(s[i])) ok = false;
        if (ok) poprawnych++;
        cout << (ok ? "TAK" : "NIE") << "\n";
    }
    cout << "Poprawnych: " << poprawnych << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-obrot-planszy', krok: 9, level: 'latwe',
            title: 'Obrót planszy',
            short: 'Obróć planszę o 90° w prawo: z n wierszy po m znaków robi się m wierszy po n znaków.',
            tags: ['plansza jako napisy', 'nowy[i][j] = stary[n − 1 − j][i]', 'wiersz w napisie'],
            statement: ['Dostajesz prostokątną planszę n × m złożoną ze znaków. Obróć ją o 90 stopni zgodnie z ruchem wskazówek zegara i wypisz wynik. Pierwsza kolumna starej planszy, czytana od dołu do góry, staje się pierwszym wierszem nowej.'],
            input_format: ['W pierwszym wierszu n i m.', 'n wierszy po m znaków (litery, cyfry, kropki i krzyżyki — bez spacji).'],
            output_format: ['m wierszy po n znaków — obrócona plansza.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '2 3\nabc\ndef', note: 'Kolumna a, d czytana od dołu to „da” — pierwszy wiersz wyniku. Potem „eb” i „fc”.' }],
            hint: R`Wczytaj planszę jako vector<string> g(n). Wiersz i wyniku (i od 0 do m − 1) składa się ze znaków g[n − 1][i], g[n − 2][i], …, g[0][i]. Zbuduj go w napisie i wypisz.`,
            tests: (r) => {
                const pl = (n, m) => `${n} ${m}\n${Array.from({ length: n }, () => r.word(m, '.#abcXYZ019')).join('\n')}`;
                return ['1 1\nx', '1 5\nabcde', '5 1\na\nb\nc\nd\ne', '2 3\nabc\ndef', pl(4, 7), pl(100, 100), pl(37, 100)];
            },
            check: (inp) => { const L = linie(inp); const [n, m] = L[0].split(' ').map(Number); if (!calk(n, 1, 100) || !calk(m, 1, 100) || L.length !== n + 1) return 'n m'; return L.slice(1).every((w) => w.length === m && /^[A-Za-z0-9.#]+$/.test(w)) ? null : 'plansza'; },
            solve: (inp) => { const g = linie(inp).slice(1); const n = g.length, m = g[0].length; const o = []; for (let i = 0; i < m; i++) { let s = ''; for (let j = n - 1; j >= 0; j--) s += g[j][i]; o.push(s); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (auto &w : g) cin >> w;
    for (int i = 0; i < m; i++) {
        string s;
        for (int j = n - 1; j >= 0; j--) s += g[j][i];
        cout << s << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-szachownica-ramka', krok: 9, level: 'latwe',
            title: 'Szachownica w ramce',
            short: 'Szachownica n × n z pól k × k, w ramce z +, - i |. Same pętle i warunek (i + j) % 2.',
            tags: ['pętla w pętli', '(i + j) % 2', 'ramka'],
            statement: ['Narysuj szachownicę n × n, w której każde pole to kwadrat k × k znaków: pola jasne rysujemy kropkami, ciemne — krzyżykami #. Lewe górne pole jest jasne, a kolory pól na przemian, jak na prawdziwej szachownicy.',
                'Całość otacza ramka: rogi to +, górny i dolny bok to myślniki, boczne — pionowe kreski |.'],
            input_format: ['Jeden wiersz: n i k.'],
            output_format: ['n · k + 2 wiersze po n · k + 2 znaki.'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ k ≤ 5'],
            examples: [{ input: '2 2', note: 'Pole w wierszu w i kolumnie k planszy (licząc znaki, od zera) należy do pola szachownicy (w / k, kol / k) — jest ciemne, gdy suma tych numerów jest nieparzysta.' }],
            hint: R`Najpierw linia "+" + string(n * k, '-') + "+". Potem n · k wierszy: "|", znaki dla kolumn c od 0 do n · k − 1 — '#' gdy (w / k + c / k) % 2 == 1, inaczej '.' — i "|". Na koniec znowu linia z plusami.`,
            tests: () => ['1 1', '1 5', '2 2', '3 1', '8 1', '8 3', '20 5', '7 4'],
            check: (inp) => { const [n, k] = nums(inp); return calk(n, 1, 20) && calk(k, 1, 5) && toks(inp).length === 2 ? null : 'n k'; },
            solve: (inp) => { const [n, k] = nums(inp); const N = n * k; const ram = '+' + '-'.repeat(N) + '+'; const o = [ram]; for (let w = 0; w < N; w++) { let s = '|'; for (let c = 0; c < N; c++) s += (Math.floor(w / k) + Math.floor(c / k)) % 2 ? '#' : '.'; o.push(s + '|'); } o.push(ram); return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    int N = n * k;
    string ramka = "+" + string(N, '-') + "+";
    cout << ramka << "\n";
    for (int w = 0; w < N; w++) {
        cout << "|";
        for (int c = 0; c < N; c++) cout << ((w / k + c / k) % 2 ? '#' : '.');
        cout << "|\n";
    }
    cout << ramka << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-srednie-ocen', krok: 9, level: 'latwe',
            title: 'Średnie ocen',
            short: 'Wiersze „Anna Maria Lis: 5 4 6”. Imiona przed dwukropkiem, oceny po nim — nie wiadomo ile. getline, find i stringstream.',
            tags: ['getline', 'find(\':\')', 'stringstream'],
            statement: ['Wychowawca ma oceny uczniów w wierszach postaci Imiona Nazwisko: oceny — imion może być kilka, a ocen w wierszu jest różna liczba (co najmniej jedna).',
                'Dla każdego ucznia wypisz wiersz Imiona Nazwisko: średnia — średnią z dokładnie dwiema cyframi po kropce.'],
            input_format: ['Wiersze w formacie Imiona Nazwisko: o1 o2 … — do końca danych. Oceny to liczby od 1 do 6 oddzielone spacjami.'],
            output_format: ['Po jednym wierszu na ucznia: Imiona Nazwisko: srednia (dwie cyfry po kropce).'],
            constraints: ['Uczniów jest od 1 do 500, ocen w wierszu od 1 do 20.', 'Imiona i nazwisko: litery i pojedyncze spacje, bez dwukropka.', 'Średnie nie wypadają dokładnie w połowie między dwoma wynikami (np. 4.125).'],
            examples: [{ input: 'Anna Maria Lis: 5 4 6\nJan Nowak: 3', note: 'Średnia Anny to 15 / 3 = 5.00, a Jana — 3.00.' }],
            hint: R`Wczytaj wiersz przez getline i znajdź dwukropek: size_t p = s.find(':');. Imiona to s.substr(0, p), a oceny stoją w s.substr(p + 1) — włóż je do stringstream i czytaj while (ss >> x). Średnią wypisz po fixed << setprecision(2).`,
            tests: (r) => {
                const uczen = (k) => { let o; do { o = losy(r, k, 1, 6); } while (!safe(o.reduce((a, b) => a + b, 0) / k, 2)); const im = Array.from({ length: r.int(1, 2) }, () => r.pick(IMIONA)); return `${[...im, r.pick(NAZWISKA)].join(' ')}: ${o.join(' ')}`; };
                return ['A: 6', 'Anna Maria Lis: 5 4 6\nJan Nowak: 3', Array.from({ length: 10 }, () => uczen(r.int(1, 20))).join('\n'), Array.from({ length: 500 }, () => uczen(r.int(1, 20))).join('\n')];
            },
            check: (inp) => linie(inp).length <= 500 && linie(inp).every((l) => { const m = l.match(/^([A-Za-z]+(?: [A-Za-z]+)*): ([1-6](?: [1-6]){0,19})$/); if (!m) return false; const o = m[2].split(' ').map(Number); return safe(o.reduce((a, b) => a + b, 0) / o.length, 2); }) ? null : 'wiersz',
            solve: (inp) => linie(inp).map((l) => { const p = l.indexOf(':'); const o = l.slice(p + 1).split(' ').filter(Boolean).map(Number); return `${l.slice(0, p)}: ${fx(o.reduce((a, b) => a + b, 0) / o.length, 2)}`; }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cout << fixed << setprecision(2);
    while (getline(cin, s)) {
        size_t p = s.find(':');
        stringstream ss(s.substr(p + 1));
        int x, suma = 0, ile = 0;
        while (ss >> x) {
            suma += x;
            ile++;
        }
        cout << s.substr(0, p) << ": " << (double)suma / ile << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ ŚREDNIE
        {
            id: 'iop-b-kolko-i-krzyzyk', krok: 9, level: 'srednie',
            title: 'Kółko i krzyżyk',
            short: 'Wiele plansz 3 × 3 oddzielonych pustymi wierszami. Kto wygrał — X, O, remis, a może gra jeszcze trwa?',
            tags: ['wiele testów', 'plansza jako napisy', 'wiersze, kolumny, przekątne'],
            statement: ['Dostajesz t plansz gry w kółko i krzyżyk. Każda plansza to 3 wiersze po 3 znaki: X, O albo kropka (puste pole); plansze są oddzielone pustymi wierszami.',
                'Dla każdej planszy wypisz: X albo O — jeśli ten gracz ma trzy swoje znaki w wierszu, kolumnie lub na przekątnej; REMIS — jeśli nikt nie wygrał, a pustych pól nie ma; TRWA — jeśli nikt nie wygrał i są jeszcze puste pola. Na żadnej planszy nie wygrywają obaj gracze naraz.'],
            input_format: ['W pierwszym wierszu t.', 'Dalej t plansz po 3 wiersze, oddzielonych pustymi wierszami.'],
            output_format: ['t wierszy: X, O, REMIS albo TRWA.'],
            constraints: ['1 ≤ t ≤ 1000'],
            examples: [{ input: '3\n\nXOX\nOXO\nOOX\n\nXOX\nXOO\nOXX\n\nX..\n.O.\n...', note: 'Na pierwszej planszy X ma przekątną. Druga jest pełna i nikt nie ma trzech w linii. Na trzeciej są jeszcze wolne pola.' }],
            hint: R`Plansze czytaj przez cin >> wiersz — puste wiersze między planszami cin przeskoczy sam. Sprawdź 8 linii: 3 wiersze, 3 kolumny i 2 przekątne; linia wygrywa, gdy jej trzy pola są równe i nie są kropką. Wynik jest zawsze jeden, bo obaj gracze naraz nie wygrywają.`,
            tests: (r) => {
                const LINIE = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
                const wyg = (b) => { const w = new Set(); for (const [a, c, e] of LINIE) if (b[a] !== '.' && b[a] === b[c] && b[c] === b[e]) w.add(b[a]); return w; };
                const plansza = () => { let b; do { b = Array.from({ length: 9 }, () => r.pick('XO.')); } while (wyg(b).size > 1); return b.join(''); };
                const d = (P0) => `${P0.length}\n\n${P0.map((b) => `${b.slice(0, 3)}\n${b.slice(3, 6)}\n${b.slice(6)}`).join('\n\n')}`;
                return [d(['.........']), d(['XXXOO....', 'OOOXX.X..', 'XOXOXOOXO', 'XOXXOOOXX']), d(Array.from({ length: 40 }, plansza)), d(Array.from({ length: 1000 }, plansza))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 1000) && t.length === 3 * n + 1 && t.slice(1).every((w) => /^[XO.]{3}$/.test(w)) ? null : 'plansze'; },
            solve: (inp) => {
                const t = toks(inp).slice(1); const o = [];
                const LINIE = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
                for (let i = 0; i < t.length; i += 3) {
                    const b = t[i] + t[i + 1] + t[i + 2]; let w = '';
                    for (const [a, c, e] of LINIE) if (b[a] !== '.' && b[a] === b[c] && b[c] === b[e]) w = b[a];
                    o.push(w || (b.includes('.') ? 'TRWA' : 'REMIS'));
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    int L[8][3] = {{0, 1, 2}, {3, 4, 5}, {6, 7, 8}, {0, 3, 6}, {1, 4, 7}, {2, 5, 8}, {0, 4, 8}, {2, 4, 6}};
    while (t--) {
        string a, b, c;
        cin >> a >> b >> c;
        string p = a + b + c;
        char wygrany = 0;
        for (auto &l : L)
            if (p[l[0]] != '.' && p[l[0]] == p[l[1]] && p[l[1]] == p[l[2]]) wygrany = p[l[0]];
        if (wygrany) cout << wygrany << "\n";
        else if (p.find('.') == string::npos) cout << "REMIS\n";
        else cout << "TRWA\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-kalendarz-miesiaca', krok: 9, level: 'srednie',
            title: 'Kartka z kalendarza',
            short: 'Wydrukuj miesiąc jak w kalendarzu: nagłówek Pn Wt Sr Cz Pt So Nd i dni w kolumnach o szerokości 2. Kilka miesięcy, pusty wiersz pomiędzy.',
            tags: ['setw(2)', 'puste pola na początku', 'pusty wiersz między testami'],
            statement: ['Wydrukuj kartki z kalendarza. Każda kartka zaczyna się wierszem Pn Wt Sr Cz Pt So Nd. Pod spodem są tygodnie: każdy dzień zajmuje pole o szerokości 2 (liczba dosunięta do prawej), a pola w wierszu oddziela jedna spacja. Tydzień zaczyna się w poniedziałek; w pierwszym tygodniu dni przed pierwszym dniem miesiąca to puste pola (dwie spacje). Ostatni tydzień kończy się na ostatnim dniu miesiąca.',
                'Dostajesz t miesięcy. Kartki oddziel jednym pustym wierszem.'],
            input_format: ['W pierwszym wierszu t.', 'W każdym z t wierszy: liczba dni miesiąca d i numer dnia tygodnia, w którym wypada pierwszy dzień (1 = poniedziałek, …, 7 = niedziela).'],
            output_format: ['t kartek kalendarza oddzielonych pustymi wierszami.'],
            constraints: ['1 ≤ t ≤ 100', '28 ≤ d ≤ 31', '1 ≤ dzień tygodnia ≤ 7'],
            examples: [{ input: '1\n30 6', note: 'Pierwszy dzień wypada w sobotę, więc przed jedynką stoi pięć pustych pól (po dwie spacje i odstęp). Wiersze kończą się na niedzieli albo na ostatnim dniu miesiąca.' }],
            hint: R`Pozycja dnia w tygodniu: kol = (start − 1 + dzien − 1) % 7. Najpierw wypisz start − 1 pustych pól. Potem dla każdego dnia: jeśli kol > 0 — spacja odstępu, potem setw(2) << dzien; gdy kol == 6 albo to ostatni dzień — "\n". Pusty wiersz przed każdą kartką oprócz pierwszej.`,
            tests: (r) => {
                const d = (M) => `${M.length}\n${M.map(([a, b]) => `${a} ${b}`).join('\n')}`;
                return ['1\n31 1', '1\n28 1', d([[30, 6], [31, 7], [29, 3]]), d(Array.from({ length: 12 }, () => [r.int(28, 31), r.int(1, 7)])), d(Array.from({ length: 100 }, () => [r.int(28, 31), r.int(1, 7)]))];
            },
            check: (inp) => { const t = nums(inp); const n = t[0]; if (!calk(n, 1, 100) || t.length !== 2 * n + 1) return 't'; for (let i = 0; i < n; i++) if (!calk(t[1 + 2 * i], 28, 31) || !calk(t[2 + 2 * i], 1, 7)) return 'miesiąc'; return null; },
            solve: (inp) => {
                const t = nums(inp); const o = [];
                for (let i = 0; i < t[0]; i++) {
                    const d = t[1 + 2 * i], s = t[2 + 2 * i]; if (i) o.push('');
                    o.push('Pn Wt Sr Cz Pt So Nd'); let w = Array(s - 1).fill('  ');
                    for (let k = 1; k <= d; k++) { w.push(String(k).padStart(2)); if (w.length === 7 || k === d) { o.push(w.join(' ')); w = []; } }
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    for (int m = 0; m < t; m++) {
        int d, start;
        cin >> d >> start;
        if (m > 0) cout << "\n";
        cout << "Pn Wt Sr Cz Pt So Nd\n";
        for (int i = 1; i < start; i++) cout << (i > 1 ? " " : "") << "  ";
        for (int dzien = 1; dzien <= d; dzien++) {
            int kol = (start - 1 + dzien - 1) % 7;
            if (kol > 0) cout << " ";
            cout << setw(2) << dzien;
            if (kol == 6 || dzien == d) cout << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-tabela-ligi', krok: 9, level: 'srednie',
            title: 'Tabela ligi',
            short: 'Wyniki meczów „Polska 2:1 Niemcy” aż do końca danych. Policz punkty i bramki każdej drużyny i wypisz tabelę według zasad ligi.',
            tags: ['separator : między liczbami', 'zbieranie po nazwie', 'sortowanie z kilkoma kryteriami'],
            statement: ['Dostajesz wyniki meczów ligi szkolnej, każdy w osobnym wierszu: drużyna gospodarzy, wynik w formacie bramki:bramki i drużyna gości. Za zwycięstwo drużyna dostaje 3 punkty, za remis 1, za porażkę 0.',
                'Wypisz tabelę: miejsce z kropką, nazwę drużyny, punkty oraz bramki zdobyte i stracone w formacie z:s. Kolejność: więcej punktów; przy remisie — lepsza różnica bramek (zdobyte minus stracone); potem więcej zdobytych bramek; na końcu nazwa alfabetycznie.'],
            input_format: ['Wiersze w formacie Druzyna1 a:b Druzyna2 — do końca danych. Nazwy drużyn to pojedyncze słowa.'],
            output_format: ['Po jednym wierszu na drużynę: miejsce. nazwa punkty z:s'],
            constraints: ['Meczów jest od 1 do 2000, drużyn najwyżej 20.', 'Nazwy: od 1 do 12 liter.', '0 ≤ bramki w meczu ≤ 15'],
            examples: [{ input: 'Orly 2:1 Sokoly\nSokoly 0:0 Wilki\nWilki 3:1 Orly', note: 'Orły i Wilki mają po 4 punkty — Wilki są wyżej, bo mają lepszą różnicę bramek (+2 wobec 0).' }],
            hint: R`Czytaj while (cin >> a >> x >> c >> y >> b) — c zjada dwukropek. Drużyny trzymaj w vectorze nazw z równoległymi vectorami punktów i bramek; indeks znajdziesz pętlą (drużyn jest najwyżej 20). Sortuj vector indeksów lambdą z czterema kryteriami po kolei.`,
            tests: (r) => {
                const DR = ['Orly', 'Sokoly', 'Wilki', 'Lisy', 'Rysie', 'Jastrzebie', 'Niedzwiedzie', 'Bobry', 'Zubry', 'Kruki', 'Dziki', 'Losie', 'Borsuki', 'Kuny', 'Sarny', 'Zurawie', 'Bociany', 'Czaple', 'Kawki', 'Szpaki'];
                const mecze = (k, n, gMax) => { const d0 = DR.slice(0, n); return Array.from({ length: k }, () => { const a = r.pick(d0); let b; do { b = r.pick(d0); } while (b === a); return `${a} ${r.int(0, gMax)}:${r.int(0, gMax)} ${b}`; }).join('\n'); };
                return ['A 0:0 B', 'Orly 2:1 Sokoly\nSokoly 0:0 Wilki\nWilki 3:1 Orly', 'B 1:0 A\nA 1:0 B', mecze(12, 4, 3), mecze(300, 10, 5), mecze(2000, 20, 15), mecze(2000, 20, 1)];
            },
            check: (inp) => linie(inp).length <= 2000 && linie(inp).every((l) => { const m = l.match(/^([A-Za-z]{1,12}) (\d+):(\d+) ([A-Za-z]{1,12})$/); return m && +m[2] <= 15 && +m[3] <= 15 && m[1] !== m[4]; }) && new Set(linie(inp).flatMap((l) => [l.split(' ')[0], l.split(' ')[2]])).size <= 20 ? null : 'mecz',
            solve: (inp) => {
                const T = new Map(); const get = (n) => { if (!T.has(n)) T.set(n, { n, p: 0, z: 0, s: 0 }); return T.get(n); };
                for (const l of linie(inp)) { const [a, w, b] = l.split(' '); const [x, y] = w.split(':').map(Number); const A = get(a), B = get(b); A.z += x; A.s += y; B.z += y; B.s += x; if (x > y) A.p += 3; else if (x < y) B.p += 3; else { A.p++; B.p++; } }
                const L = [...T.values()].sort((u, v) => v.p - u.p || (v.z - v.s) - (u.z - u.s) || v.z - u.z || cmp(u.n, v.n));
                return L.map((t, i) => `${i + 1}. ${t.n} ${t.p} ${t.z}:${t.s}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<string> nazwa;
    vector<int> pkt, zd, st;
    auto indeks = [&](const string &n) {
        for (int i = 0; i < (int)nazwa.size(); i++)
            if (nazwa[i] == n) return i;
        nazwa.push_back(n);
        pkt.push_back(0);
        zd.push_back(0);
        st.push_back(0);
        return (int)nazwa.size() - 1;
    };
    string a, b;
    int x, y;
    char c;
    while (cin >> a >> x >> c >> y >> b) {
        int i = indeks(a), j = indeks(b);
        zd[i] += x; st[i] += y;
        zd[j] += y; st[j] += x;
        if (x > y) pkt[i] += 3;
        else if (x < y) pkt[j] += 3;
        else { pkt[i]++; pkt[j]++; }
    }
    vector<int> kol(nazwa.size());
    for (int i = 0; i < (int)kol.size(); i++) kol[i] = i;
    sort(kol.begin(), kol.end(), [&](int u, int v) {
        if (pkt[u] != pkt[v]) return pkt[u] > pkt[v];
        if (zd[u] - st[u] != zd[v] - st[v]) return zd[u] - st[u] > zd[v] - st[v];
        if (zd[u] != zd[v]) return zd[u] > zd[v];
        return nazwa[u] < nazwa[v];
    });
    for (int k = 0; k < (int)kol.size(); k++) {
        int i = kol[k];
        cout << k + 1 << ". " << nazwa[i] << " " << pkt[i] << " " << zd[i] << ":" << st[i] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-kalkulator-kolejnosc', krok: 9, level: 'srednie',
            title: 'Kalkulator z kolejnością działań',
            short: 'Działania typu 2+3*4-10/3 w każdym wierszu. Mnożenie i dzielenie przed dodawaniem — trzymaj bieżący składnik osobno.',
            tags: ['stringstream', 'ss >> op >> x', 'kolejność działań'],
            statement: ['Każdy wiersz zawiera działanie złożone z liczb całkowitych nieujemnych i znaków + − * /, bez spacji i bez nawiasów, np. 2+3*4-10/3. Mnożenie i dzielenie wykonujemy przed dodawaniem i odejmowaniem, a działania tej samej wagi — od lewej. Dzielenie jest całkowite (jak w C++: 10/3 = 3).',
                'Policz wynik każdego działania.'],
            input_format: ['Działania, każde w osobnym wierszu — do końca danych.'],
            output_format: ['Wynik każdego działania w osobnym wierszu.'],
            constraints: ['Wierszy jest od 1 do 1000, każdy ma najwyżej 80 znaków.', 'Liczby: od 0 do 1000. Nigdy nie dzielimy przez 0.', 'W jednym składniku (ciągu mnożeń i dzieleń) są najwyżej 3 liczby.'],
            examples: [{ input: '2+3*4-10/3\n7\n8/3*3', note: '2 + 12 − 3 = 11. W trzecim wierszu dzielenie idzie pierwsze, bo stoi z lewej: 8 / 3 = 2, potem 2 · 3 = 6.' }],
            hint: R`Trzymaj dwie zmienne: wynik (suma gotowych składników) i skladnik (bieżący iloczyn), oraz znak, z jakim ten składnik wejdzie do wyniku. Po ss >> skladnik czytaj pary while (ss >> op >> x): * i / zmieniają skladnik, a + i − najpierw dodają skladnik (ze znakiem) do wyniku, potem zaczynają nowy od x. Na końcu dolicz ostatni składnik.`,
            tests: (r) => {
                const wyr = (k) => { let s = String(r.int(0, 1000)), w = 1; for (let i = 0; i < k; i++) { let op = r.pick('+-*/'); if ((op === '*' || op === '/') && w >= 3) op = r.pick('+-'); const x = op === '/' ? r.int(1, 1000) : r.int(0, 1000); s += op + x; w = op === '+' || op === '-' ? 1 : w + 1; } return s; };
                const ogr = (s) => { while (s.length > 80) s = s.replace(/[-+*/]\d+$/, ''); return s; };
                return ['0', '1000*1000*1000', '7/2/3+1-1000', '2+3*4-10/3\n7\n8/3*3', Array.from({ length: 20 }, () => wyr(r.int(0, 5))).join('\n'), Array.from({ length: 1000 }, () => ogr(wyr(r.int(1, 25)))).join('\n')];
            },
            check: (inp) => linie(inp).length <= 1000 && linie(inp).every((l) => {
                if (l.length > 80 || !/^\d+([-+*/]\d+)*$/.test(l)) return false;
                const nm = l.split(/[-+*/]/).map(Number), op = l.replace(/\d/g, '').split('');
                if (nm.some((x) => x > 1000)) return false; let w = 1;
                for (let i = 0; i < op.length; i++) { if (op[i] === '/' && nm[i + 1] === 0) return false; w = op[i] === '+' || op[i] === '-' ? 1 : w + 1; if (w > 3) return false; }
                return true;
            }) ? null : 'działanie',
            solve: (inp) => linie(inp).map((l) => {
                const nm = l.split(/[-+*/]/).map(Number), op = l.replace(/\d/g, '').split('');
                let wynik = 0, zn = 1, sk = nm[0];
                op.forEach((o, i) => { const x = nm[i + 1]; if (o === '*') sk *= x; else if (o === '/') sk = Math.trunc(sk / x); else { wynik += zn * sk; zn = o === '+' ? 1 : -1; sk = x; } });
                return wynik + zn * sk;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    while (getline(cin, s)) {
        stringstream ss(s);
        long long wynik = 0, skladnik, x;
        int znak = 1;
        char op;
        ss >> skladnik;
        while (ss >> op >> x) {
            if (op == '*') skladnik *= x;
            else if (op == '/') skladnik /= x;
            else {
                wynik += znak * skladnik;
                znak = (op == '+' ? 1 : -1);
                skladnik = x;
            }
        }
        wynik += znak * skladnik;
        cout << wynik << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-dziennik-serwera', krok: 9, level: 'srednie',
            title: 'Dziennik serwera',
            short: 'Wiersze „2026-11-15 12:30:45 ERROR Brak polaczenia”. Policz komunikaty każdego poziomu i podaj czas pierwszego i ostatniego błędu.',
            tags: ['cin >> data >> czas >> poziom', 'getline reszty wiersza', 'formaty z separatorami'],
            statement: ['Serwer szkolnej sprawdzarki zapisuje dziennik. Każdy wiersz to data (RRRR-MM-DD), godzina (GG:MM:SS), poziom (INFO, WARN albo ERROR) i treść komunikatu — treść może mieć spacje. Wiersze są w kolejności czasu.',
                'Wypisz, ile było komunikatów każdego poziomu, a potem datę i godzinę pierwszego i ostatniego komunikatu ERROR — albo zdanie Brak bledow, gdy żadnego nie było.'],
            input_format: ['Wiersze dziennika — do końca danych.'],
            output_format: ['Trzy wiersze: INFO: a, WARN: b, ERROR: c.', 'Potem dwa wiersze: Pierwszy ERROR: data godzina i Ostatni ERROR: data godzina — albo jeden wiersz Brak bledow.'],
            constraints: ['Wierszy jest od 1 do 1000, każdy ma najwyżej 80 znaków.'],
            examples: [{ input: '2026-11-15 08:00:01 INFO Start serwera\n2026-11-15 08:02:13 ERROR Brak polaczenia z baza\n2026-11-15 08:02:14 WARN Ponawiam probe\n2026-11-15 08:03:00 ERROR Znowu nic', note: 'Dwa błędy — pierwszy o 08:02:13, ostatni o 08:03:00.' }],
            hint: R`Pierwsze trzy kawałki wiersza to zwykłe słowa: cin >> data >> czas >> poziom. Resztę wiersza (treść) trzeba zjeść, choć jej nie używamy: getline(cin, tresc). Pętla: while (cin >> data >> czas >> poziom). Datę i godzinę pierwszego błędu zapamiętaj tylko raz, a ostatniego — za każdym razem.`,
            tests: (r) => {
                const dziennik = (n, pE) => { let t = Date.UTC(2026, r.int(0, 11), r.int(1, 28), 8) / 1000; const L = []; for (let i = 0; i < n; i++) { t += r.int(0, 600); const d = new Date(t * 1000).toISOString(); const p = r(); const poz = p < pE ? 'ERROR' : p < pE + 0.25 ? 'WARN' : 'INFO'; L.push(`${d.slice(0, 10)} ${d.slice(11, 19)} ${poz} ${zdanie(r, 1, 6).slice(0, 45)}`); } return L.join('\n'); };
                return ['2026-01-01 00:00:00 INFO a', '2026-01-01 00:00:00 ERROR a\n2026-12-31 23:59:59 ERROR b', dziennik(10, 0.3), dziennik(50, 0), dziennik(1000, 0.1), dziennik(1000, 0.9)];
            },
            check: (inp) => linie(inp).length <= 1000 && linie(inp).every((l) => l.length <= 80 && /^\d{4}-\d\d-\d\d \d\d:\d\d:\d\d (INFO|WARN|ERROR) \S/.test(l)) ? null : 'wiersz',
            solve: (inp) => {
                const c = { INFO: 0, WARN: 0, ERROR: 0 }; let p = null, q = null;
                for (const l of linie(inp)) { const [d, g, poz] = l.split(' '); c[poz]++; if (poz === 'ERROR') { if (!p) p = `${d} ${g}`; q = `${d} ${g}`; } }
                return [`INFO: ${c.INFO}`, `WARN: ${c.WARN}`, `ERROR: ${c.ERROR}`, ...(p ? [`Pierwszy ERROR: ${p}`, `Ostatni ERROR: ${q}`] : ['Brak bledow'])].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string data, czas, poziom, tresc, pierwszy, ostatni;
    int info = 0, warn = 0, error = 0;
    while (cin >> data >> czas >> poziom) {
        getline(cin, tresc);
        if (poziom == "INFO") info++;
        else if (poziom == "WARN") warn++;
        else {
            error++;
            if (pierwszy.empty()) pierwszy = data + " " + czas;
            ostatni = data + " " + czas;
        }
    }
    cout << "INFO: " << info << "\nWARN: " << warn << "\nERROR: " << error << "\n";
    if (error == 0) cout << "Brak bledow\n";
    else cout << "Pierwszy ERROR: " << pierwszy << "\nOstatni ERROR: " << ostatni << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-tekst-w-ramce', krok: 9, level: 'srednie',
            title: 'Wyśrodkowany tekst w ramce',
            short: 'Każdy wiersz wyśrodkuj w ramce z gwiazdek. Szerokość ramki zależy od najdłuższego wiersza — najpierw wczytaj wszystko.',
            tags: ['getline do vectora', 'wyśrodkowanie', 'string(k, \' \')'],
            statement: ['Na zaproszenie trzeba wydrukować tekst w ramce z gwiazdek. Niech d będzie długością najdłuższego wiersza. Ramka ma szerokość d + 4: górny i dolny bok to d + 4 gwiazdek, a każdy wiersz tekstu wypisujemy jako gwiazdka, spacja, wyśrodkowany tekst w polu o szerokości d, spacja, gwiazdka.',
                'Wyśrodkowanie: jeśli w polu zostaje k wolnych miejsc, z lewej stawiamy k / 2 spacji (zaokrąglone w dół), a z prawej resztę. Pusty wiersz tekstu to po prostu pole z samych spacji.'],
            input_format: ['Tekst — od 1 do 100 wierszy, do końca danych. Wiersze nie zaczynają się ani nie kończą spacją.'],
            output_format: ['Tekst w ramce: liczba wierszy tekstu + 2 wiersze, każdy o długości d + 4.'],
            constraints: ['Każdy wiersz ma najwyżej 60 znaków; najdłuższy ma co najmniej 1 znak.'],
            examples: [{ input: 'Zaproszenie\n\nna urodziny Oli', note: 'Najdłuższy wiersz ma 15 znaków, ramka — 19. Zaproszenie (11 znaków) dostaje 2 spacje z lewej i 2 z prawej.' }],
            hint: R`Wiersze wczytaj do vector<string> (while (getline(cin, s))), policz d. Każdy wiersz: k = d − s.size(); cout << "* " << string(k / 2, ' ') << s << string(k − k / 2, ' ') << " *\n";. Ramka górna i dolna: string(d + 4, '*').`,
            tests: (r) => {
                const t = (n) => { const L = []; for (let i = 0; i < n; i++) L.push(i && i < n - 1 && r() < 0.15 ? '' : zdanie(r, 1, 8).slice(0, 60).trim()); return L.join('\n'); };
                return ['x', 'ab\nabc\na', 'Zaproszenie\n\nna urodziny Oli', t(8), t(100), 'a'.repeat(60) + '\nb'];
            },
            check: (inp) => { const L = linie(inp); return L.length <= 100 && L.every((l) => l.length <= 60 && l === l.trim()) && ascii(inp) ? null : 'tekst'; },
            solve: (inp) => { const L = linie(inp); const d = Math.max(...L.map((l) => l.length)); const g = '*'.repeat(d + 4); return [g, ...L.map((l) => { const k = d - l.length; return `* ${' '.repeat(Math.floor(k / 2))}${l}${' '.repeat(k - Math.floor(k / 2))} *`; }), g].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<string> w;
    string s;
    int d = 0;
    while (getline(cin, s)) {
        w.push_back(s);
        d = max(d, (int)s.size());
    }
    cout << string(d + 4, '*') << "\n";
    for (auto &x : w) {
        int k = d - x.size();
        cout << "* " << string(k / 2, ' ') << x << string(k - k / 2, ' ') << " *\n";
    }
    cout << string(d + 4, '*') << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-slownik-zamian', krok: 9, level: 'srednie',
            title: 'Słownik zamian',
            short: 'Najpierw pary „stare nowe”, potem tekst. Podmień całe słowa według słownika — wiersze i puste wiersze zostają na swoich miejscach.',
            tags: ['cin, a potem getline', 'stringstream na słowa', 'vector par'],
            statement: ['Redaktor gazety ma słownik zamian: każde słowo stare w tekście trzeba zastąpić słowem nowym. Zamieniamy tylko całe słowa (kot nie zamienia się w kotlecie), a zamienione słowo nie podlega już kolejnym zamianom.',
                'Najpierw dostajesz k par słów, a potem tekst. Słowa w tekście są oddzielone pojedynczymi spacjami; wypisz tekst po zamianach, zachowując podział na wiersze (także puste).'],
            input_format: ['W pierwszym wierszu k.', 'W każdym z k wierszy dwa słowa: stare i nowe (stare słowa się nie powtarzają).', 'Dalej tekst — do końca danych. Jego pierwszy wiersz nie jest pusty.'],
            output_format: ['Tekst po zamianach.'],
            constraints: ['1 ≤ k ≤ 100', 'Słowa: od 1 do 12 małych liter.', 'Tekst ma najwyżej 500 wierszy i 20 000 znaków.'],
            examples: [{ input: '2\nkot pies\npies kot\nala ma kota i psa\nkot goni psa a pies kota\n\nkot', note: 'kota i psa to inne słowa niż kot i pies — zostają. Zamiany nie łańcuchują się: kot zamienia się na pies i na tym koniec.' }],
            hint: R`Pary wczytaj przez cin >> stare >> nowe do vector<pair<string, string>>. Potem cin.ignore() (albo cin >> ws), żeby zjeść enter, i while (getline(cin, s)). Każdy wiersz rozbij na słowa stringstreamem, każde słowo podmień (pętla po parach) i wypisz z jedną spacją między słowami.`,
            tests: (r) => {
                const pula = SLOWA.filter((w) => /^[a-z]{1,12}$/.test(w));
                const d = (P0, txt) => `${P0.length}\n${P0.map(([a, b]) => `${a} ${b}`).join('\n')}\n${txt}`;
                const pary = (k) => { const st = r.shuffle(pula).slice(0, k); return st.map((a) => [a, r() < 0.3 ? r.pick(st) : r.word(r.int(1, 12))]); };
                const tekst = (n) => { const L = []; for (let i = 0; i < n; i++) L.push(i && r() < 0.1 ? '' : Array.from({ length: r.int(1, 12) }, () => r.pick(pula)).join(' ')); return L.join('\n'); };
                return [d([['a', 'b']], 'a'), d([['kot', 'pies'], ['pies', 'kot']], 'ala ma kota i psa\nkot goni psa a pies kota\n\nkot'), d(pary(5), tekst(10)), d(pary(40), tekst(300)), d(pary(60), tekst(500).slice(0, 19000))];
            },
            check: (inp) => {
                const L = linie(inp); const k = Number(L[0]); if (!calk(k, 1, 100)) return 'k';
                const st = new Set(); for (const l of L.slice(1, k + 1)) { const m = l.match(/^([a-z]{1,12}) ([a-z]{1,12})$/); if (!m || st.has(m[1])) return 'para'; st.add(m[1]); }
                const T = L.slice(k + 1); if (!T.length || T[0] === '' || T.length > 500) return 'tekst';
                return T.every((l) => l === '' || /^[a-z]{1,12}( [a-z]{1,12})*$/.test(l)) ? null : 'wiersz';
            },
            solve: (inp) => { const L = linie(inp); const k = Number(L[0]); const m = new Map(L.slice(1, k + 1).map((l) => l.split(' '))); return L.slice(k + 1).map((l) => l.split(' ').filter(Boolean).map((w) => (m.has(w) ? m.get(w) : w)).join(' ')).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    vector<pair<string, string>> slownik(k);
    for (auto &[a, b] : slownik) cin >> a >> b;
    cin.ignore();
    string s;
    while (getline(cin, s)) {
        stringstream ss(s);
        string w;
        bool pierwsze = true;
        while (ss >> w) {
            for (auto &[a, b] : slownik)
                if (w == a) {
                    w = b;
                    break;
                }
            if (!pierwsze) cout << " ";
            cout << w;
            pierwsze = false;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-rozklad-jazdy', krok: 9, level: 'srednie',
            title: 'Rozkład jazdy',
            short: 'Każdy wiersz to numer linii i jej odjazdy — różnie dużo. Potem pytania „linia godzina”: kiedy najbliższy odjazd?',
            tags: ['getline i stringstream', 'godziny na minuty', 'lower_bound'],
            statement: ['Rozkład jazdy ma n wierszy. Każdy wiersz to numer linii autobusowej, a po nim godziny odjazdów z przystanku w formacie GG:MM, rosnąco — w każdym wierszu może być ich inna liczba.',
                'Potem przychodzi q pytań: numer linii i godzina, o której przychodzimy na przystanek. Dla każdego pytania wypisz godzinę najbliższego odjazdu tej linii (o tej samej godzinie albo później) albo BRAK, jeśli tego dnia już nic nie odjedzie.'],
            input_format: ['W pierwszym wierszu n.', 'W następnych n wierszach: numer linii i godziny odjazdów.', 'Dalej wiersz z q i q wierszy z pytaniami: numer linii i godzina GG:MM.'],
            output_format: ['q wierszy: godzina najbliższego odjazdu (GG:MM) albo BRAK.'],
            constraints: ['1 ≤ n ≤ 100, numery linii są różne (od 1 do 999), każda linia ma od 1 do 50 odjazdów.', '1 ≤ q ≤ 2000; pytania dotyczą linii z rozkładu.'],
            examples: [{ input: '2\n15 06:10 06:40 07:10\n175 05:55 23:30\n3\n15 06:40\n15 07:11\n175 06:00', note: 'O 06:40 linia 15 akurat odjeżdża. Po 07:10 linia 15 już nie jedzie. Na 175 trzeba czekać do 23:30.' }],
            hint: R`Wiersz rozkładu wczytaj przez getline(cin >> ws, s) i włóż do stringstream: najpierw numer, potem while (ss >> h >> c >> m) — godziny zamieniaj na minuty (h * 60 + m) i zbieraj do vectora tej linii. W pytaniu znajdź linię i użyj lower_bound na jej vectorze; wynik wypisz z setw(2) i setfill('0').`,
            tests: (r) => {
                const hm = (x) => `${pad2(Math.floor(x / 60))}:${pad2(x % 60)}`;
                const d = (lin, Q) => `${lin.length}\n${lin.map(([n, o]) => `${n} ${o.map(hm).join(' ')}`).join('\n')}\n${Q.length}\n${Q.map(([n, t]) => `${n} ${hm(t)}`).join('\n')}`;
                const losLin = (n) => { const nr = r.shuffle(Array.from({ length: 999 }, (_, i) => i + 1)).slice(0, n); return nr.map((x) => [x, [...new Set(losy(r, r.int(1, 50), 240, 1439))].sort((a, b) => a - b)]); };
                const pyt = (lin, q) => Array.from({ length: q }, () => { const [n, o] = r.pick(lin); return [n, r() < 0.3 ? r.pick(o) : r.int(0, 1439)]; });
                const l1 = losLin(5), l2 = losLin(100);
                return [d([[1, [0]]], [[1, 0], [1, 1]]), d([[15, [370, 400, 430]], [175, [355, 1410]]], [[15, 400], [15, 431], [175, 360], [175, 1439]]), d(l1, pyt(l1, 20)), d(l2, pyt(l2, 2000))];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 100)) return 'n';
                const nr = new Set(); for (const l of L.slice(1, n + 1)) { const t = l.split(' '); if (!calk(Number(t[0]), 1, 999) || nr.has(t[0]) || t.length < 2 || t.length > 51) return 'linia'; nr.add(t[0]); const mm = t.slice(1).map((x) => { const m = x.match(/^(\d\d):(\d\d)$/); return m && +m[1] < 24 && +m[2] < 60 ? +m[1] * 60 + +m[2] : NaN; }); if (mm.some((x, i) => Number.isNaN(x) || (i && x <= mm[i - 1]))) return 'odjazdy'; }
                const q = Number(L[n + 1]); if (!calk(q, 1, 2000) || L.length !== n + 2 + q) return 'q';
                return L.slice(n + 2).every((l) => { const m = l.match(/^(\d+) (\d\d):(\d\d)$/); return m && nr.has(m[1]) && +m[2] < 24 && +m[3] < 60; }) ? null : 'pytanie';
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]); const R0 = new Map();
                const mi = (x) => +x.slice(0, 2) * 60 + +x.slice(3); const hm = (x) => `${pad2(Math.floor(x / 60))}:${pad2(x % 60)}`;
                for (const l of L.slice(1, n + 1)) { const t = l.split(' '); R0.set(t[0], t.slice(1).map(mi)); }
                return L.slice(n + 2).map((l) => { const [nr, g] = l.split(' '); const x = R0.get(nr).find((v) => v >= mi(g)); return x === undefined ? 'BRAK' : hm(x); }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> numer(n);
    vector<vector<int>> odjazdy(n);
    for (int i = 0; i < n; i++) {
        string s;
        getline(cin >> ws, s);
        stringstream ss(s);
        ss >> numer[i];
        int h, m;
        char c;
        while (ss >> h >> c >> m) odjazdy[i].push_back(h * 60 + m);
    }
    int q;
    cin >> q;
    cout << setfill('0');
    while (q--) {
        int nr, h, m;
        char c;
        cin >> nr >> h >> c >> m;
        int i = 0;
        while (numer[i] != nr) i++;
        auto it = lower_bound(odjazdy[i].begin(), odjazdy[i].end(), h * 60 + m);
        if (it == odjazdy[i].end()) cout << "BRAK\n";
        else cout << setw(2) << *it / 60 << ":" << setw(2) << *it % 60 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-kalendarz-wydarzen', krok: 9, level: 'srednie',
            title: 'Kalendarz wydarzeń',
            short: 'Wydarzenia „DD.MM GG:MM opis” w przypadkowej kolejności. Ułóż je chronologicznie — opis ze spacjami jedzie razem z datą.',
            tags: ['separatory . i :', 'getline reszty wiersza', 'stable_sort'],
            statement: ['Samorząd szkolny zapisuje wydarzenia w wierszach: data DD.MM, godzina GG:MM i opis (opis może mieć spacje). Wydarzenia są wpisane w przypadkowej kolejności, wszystkie z jednego roku.',
                'Wypisz je chronologicznie — w tym samym formacie co na wejściu. Wydarzenia o tej samej dacie i godzinie zostają w kolejności z wejścia.'],
            input_format: ['Wiersze DD.MM GG:MM opis — do końca danych.'],
            output_format: ['Te same wiersze, posortowane chronologicznie.'],
            constraints: ['Wydarzeń jest od 1 do 500; opis ma od 1 do 40 znaków i nie zaczyna się spacją.', 'Daty są poprawne, godziny od 00:00 do 23:59.'],
            examples: [{ input: '24.12 18:00 Wigilia klasowa\n01.09 08:00 Rozpoczecie roku\n24.12 09:30 Jaselka', note: 'Najpierw wrzesień, potem grudzień; w grudniu 09:30 przed 18:00.' }],
            hint: R`Czytaj while (cin >> d >> c >> m >> h >> c >> mi) i getline(cin >> ws, opis) — reszta wiersza to opis. Z daty i godziny zrób jeden klucz, np. ((m * 31 + d) * 24 + h) * 60 + mi, i sortuj pary (klucz, numer wiersza) — albo stable_sort po samym kluczu. Przy wypisywaniu pamiętaj o zerach z przodu.`,
            tests: (r) => {
                const OP = ['Wycieczka', 'Klasowka z matmy', 'Dzien sportu', 'Zebranie z rodzicami', 'Olimpiada informatyczna', 'Koncert', 'Jaselka', 'Bal', 'Wigilia klasowa', 'Dyskoteka'];
                const DNI = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
                const wyd = () => { const m = r.int(1, 12); return `${pad2(r.int(1, DNI[m - 1]))}.${pad2(m)} ${pad2(r.int(0, 23))}:${pad2(r() < 0.5 ? 0 : r.int(0, 59))} ${r.pick(OP)}${r() < 0.3 ? ' ' + r.int(1, 9) : ''}`; };
                return ['01.01 00:00 x', '24.12 18:00 Wigilia klasowa\n01.09 08:00 Rozpoczecie roku\n24.12 09:30 Jaselka', '05.05 10:00 b\n05.05 10:00 a\n05.05 09:59 c', Array.from({ length: 20 }, wyd).join('\n'), Array.from({ length: 500 }, wyd).join('\n')];
            },
            check: (inp) => linie(inp).length <= 500 && linie(inp).every((l) => { const m = l.match(/^(\d\d)\.(\d\d) (\d\d):(\d\d) (\S.{0,39})$/); return m && +m[2] >= 1 && +m[2] <= 12 && +m[1] >= 1 && +m[1] <= 31 && +m[3] < 24 && +m[4] < 60; }) ? null : 'wydarzenie',
            solve: (inp) => linie(inp).map((l, i) => [l.slice(3, 5) + l.slice(0, 2) + l.slice(6, 8) + l.slice(9, 11), i, l]).sort((a, b) => cmp(a[0], b[0]) || a[1] - b[1]).map((x) => x[2]).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<pair<long long, int>> klucze;
    vector<string> wiersze;
    int d, m, h, mi;
    char c;
    while (cin >> d >> c >> m >> h >> c >> mi) {
        string opis;
        getline(cin >> ws, opis);
        ostringstream os;
        os << setfill('0') << setw(2) << d << "." << setw(2) << m << " " << setw(2) << h << ":" << setw(2) << mi << " " << opis;
        klucze.push_back({((m * 31LL + d) * 24 + h) * 60 + mi, (int)wiersze.size()});
        wiersze.push_back(os.str());
    }
    sort(klucze.begin(), klucze.end());
    for (auto &[k, i] : klucze) cout << wiersze[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-biblioteka', krok: 9, level: 'srednie',
            title: 'Biblioteka szkolna',
            short: 'WYPOZYCZ, ZWROC, CZY i LISTA — a tytuły książek mają spacje. Słowo polecenia przez cin, tytuł przez getline.',
            tags: ['cin >> polecenie, getline tytułu', 'set<string>', 'polecenia z tekstem'],
            statement: ['Program biblioteki przyjmuje polecenia: WYPOZYCZ tytul — wypożycz książkę (jeśli jest już wypożyczona, wypisz ZAJETE); ZWROC tytul — zwróć książkę (jeśli nie była wypożyczona, wypisz BLAD); CZY tytul — wypisz TAK, gdy książka jest wypożyczona, inaczej NIE; LISTA — wypisz w jednym wierszu wszystkie wypożyczone tytuły alfabetycznie, oddzielone znakami „ | ” (spacja, kreska, spacja), albo (nic), gdy nic nie jest wypożyczone.',
                'Tytuły mogą mieć spacje i ciągną się do końca wiersza.'],
            input_format: ['Polecenia, każde w osobnym wierszu — do końca danych.'],
            output_format: ['Wiersze dla poleceń CZY i LISTA oraz komunikaty ZAJETE i BLAD — w kolejności poleceń.'],
            constraints: ['Poleceń jest od 1 do 1500, w tym najwyżej 20 poleceń LISTA.', 'Tytuł ma od 1 do 30 znaków (litery, cyfry i pojedyncze spacje).', 'Naraz wypożyczonych jest najwyżej 20 książek.'],
            examples: [{ input: 'WYPOZYCZ Pan Tadeusz\nWYPOZYCZ Lalka\nCZY Lalka\nWYPOZYCZ Lalka\nZWROC Krzyzacy\nLISTA', note: 'Druga próba wypożyczenia Lalki kończy się komunikatem ZAJETE, a zwrot Krzyżaków — BLAD, bo nikt ich nie wypożyczył.' }],
            hint: R`while (cin >> p) — to słowo polecenia. Przy WYPOZYCZ, ZWROC i CZY doczytaj tytuł: getline(cin >> ws, tytul). Wypożyczone tytuły trzymaj w set<string>: count mówi, czy tytuł jest, a przejście pętlą daje porządek alfabetyczny do LISTA.`,
            tests: (r) => {
                const TY = ['Pan Tadeusz', 'Lalka', 'Krzyzacy', 'W pustyni i w puszczy', 'Hobbit', 'Maly Ksiaze', 'Akademia pana Kleksa', 'Dzieci z Bullerbyn', 'Kubus Puchatek', 'Harry Potter 1', 'Harry Potter 2', 'Chlopcy z Placu Broni', 'Ania z Zielonego Wzgorza', 'Pinokio', 'Robinson Crusoe', 'Tajemniczy ogrod', 'Opowiesci z Narnii', 'Muminki', 'Basnie', 'Quo vadis', 'Potop', 'Ogniem i mieczem', 'Balladyna', 'Zemsta', 'Dziady'];
                const los = (q) => { const w = new Set(); let z = 0; const a = []; for (let i = 0; i < q; i++) { const p = r(); const t = r.pick(TY); if (p < 0.35 && (w.size < 20 || w.has(t))) { a.push(`WYPOZYCZ ${t}`); w.add(t); } else if (p < 0.6) { a.push(`ZWROC ${t}`); w.delete(t); } else if (p < 0.95 || z >= 20) a.push(`CZY ${t}`); else { a.push('LISTA'); z++; } } return a.join('\n'); };
                return ['LISTA', 'WYPOZYCZ Pan Tadeusz\nWYPOZYCZ Lalka\nCZY Lalka\nWYPOZYCZ Lalka\nZWROC Krzyzacy\nLISTA', los(40), los(1500)];
            },
            check: (inp) => {
                const L = linie(inp); if (L.length > 1500) return 'ile'; const w = new Set(); let z = 0;
                for (const l of L) { if (l === 'LISTA') { z++; continue; } const m = l.match(/^(WYPOZYCZ|ZWROC|CZY) ([A-Za-z0-9]+(?: [A-Za-z0-9]+)*)$/); if (!m || m[2].length > 30) return 'polecenie'; if (m[1] === 'WYPOZYCZ') w.add(m[2]); if (m[1] === 'ZWROC') w.delete(m[2]); if (w.size > 20) return '20'; }
                return z <= 20 ? null : 'LISTA';
            },
            solve: (inp) => {
                const w = new Set(); const o = [];
                for (const l of linie(inp)) { if (l === 'LISTA') { o.push(w.size ? [...w].sort(cmp).join(' | ') : '(nic)'); continue; } const k = l.indexOf(' '); const p = l.slice(0, k), t = l.slice(k + 1); if (p === 'WYPOZYCZ') { if (w.has(t)) o.push('ZAJETE'); else w.add(t); } else if (p === 'ZWROC') { if (w.has(t)) w.delete(t); else o.push('BLAD'); } else o.push(w.has(t) ? 'TAK' : 'NIE'); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    set<string> wypozyczone;
    string p;
    while (cin >> p) {
        if (p == "LISTA") {
            if (wypozyczone.empty()) cout << "(nic)";
            bool pierwszy = true;
            for (auto &t : wypozyczone) {
                if (!pierwszy) cout << " | ";
                cout << t;
                pierwszy = false;
            }
            cout << "\n";
            continue;
        }
        string tytul;
        getline(cin >> ws, tytul);
        if (p == "WYPOZYCZ") {
            if (wypozyczone.count(tytul)) cout << "ZAJETE\n";
            else wypozyczone.insert(tytul);
        } else if (p == "ZWROC") {
            if (wypozyczone.count(tytul)) wypozyczone.erase(tytul);
            else cout << "BLAD\n";
        } else {
            cout << (wypozyczone.count(tytul) ? "TAK" : "NIE") << "\n";
        }
    }
    return 0;
}`,
        },
        // ================================================================ TRUDNE
        {
            id: 'iop-b-macierz-w-nawiasach', krok: 9, level: 'trudne',
            title: 'Macierz w nawiasach',
            short: 'Macierz zapisana jak [[1, 2, 3], [4, 5, 6]] — ze spacjami i enterami gdziekolwiek. Wczytaj ją znak po znaku i wypisz transpozycję.',
            tags: ['cin >> ws i cin.peek()', 'głębokość nawiasów', 'wypisywanie w formacie'],
            statement: ['Macierz zapisano w nawiasach kwadratowych, wiersz po wierszu: [[1, 2, 3], [4, 5, 6]] to macierz o 2 wierszach i 3 kolumnach. Między nawiasami, przecinkami i liczbami mogą stać spacje i entery (ale nie w środku liczby).',
                'Wypisz macierz transponowaną — jej wiersze to kolumny oryginału — w tym samym zapisie, ale zwięźle: bez żadnych spacji i w jednym wierszu.'],
            input_format: ['Macierz w nawiasach — do końca danych.'],
            output_format: ['Jeden wiersz: macierz transponowana, bez spacji.'],
            constraints: ['Macierz ma od 1 do 50 wierszy i od 1 do 50 kolumn; wszystkie wiersze mają tyle samo liczb.', 'Liczby: od −1000 do 1000.'],
            examples: [{ input: '[[1, 2, 3],\n [4, 5, -6]]', note: 'Kolumna 1, 4 staje się pierwszym wierszem wyniku, kolumna 3, −6 — ostatnim.' }],
            hint: R`Czytaj w pętli while (cin >> ws && cin.peek() != EOF): zajrzyj na następny znak. „[” zwiększa głębokość (na głębokości 2 zaczyna się nowy wiersz — push_back pustego vectora), „]” ją zmniejsza, przecinek po prostu zjedz (cin.get()), a w każdym innym przypadku stoi liczba — wczytaj ją przez cin >> x i dopisz do ostatniego wiersza.`,
            tests: (r) => {
                const sp = () => r.pick(['', '', ' ', '  ', '\n', '\n ', ' \n  ']);
                const mac = (w, k, M) => { const m = Array.from({ length: w }, () => losy(r, k, -M, M)); return sp() + '[' + m.map((row) => sp() + '[' + row.map((x) => sp() + x + sp()).join(',') + ']' + sp()).join(',') + ']'; };
                return ['[[7]]', '[[1,2,3]]', '[[1],[2],[3]]', '[[1, 2, 3],\n [4, 5, -6]]', mac(3, 4, 9), mac(20, 7, 1000), mac(50, 50, 1000), mac(50, 1, 1000)];
            },
            check: (inp) => {
                const s = inp.replace(/\s+/g, ''); const m = s.match(/^\[(\[-?\d+(,-?\d+)*\](,\[-?\d+(,-?\d+)*\])*)\]$/); if (!m) return 'format';
                if (/\d\s+\d/.test(inp)) return 'spacja w liczbie';
                const rows = s.slice(1, -1).match(/\[[^\]]*\]/g).map((x) => x.slice(1, -1).split(',').map(Number));
                return rows.length <= 50 && rows.every((row) => row.length === rows[0].length && row.length <= 50 && row.every((x) => calk(x, -1000, 1000))) ? null : 'wymiary';
            },
            solve: (inp) => { const rows = inp.replace(/\s+/g, '').slice(1, -1).match(/\[[^\]]*\]/g).map((x) => x.slice(1, -1).split(',')); return '[' + rows[0].map((_, j) => '[' + rows.map((row) => Number(row[j])).join(',') + ']').join(',') + ']'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<vector<int>> m;
    int glebokosc = 0;
    while (cin >> ws && cin.peek() != EOF) {
        char c = cin.peek();
        if (c == '[') {
            cin.get();
            glebokosc++;
            if (glebokosc == 2) m.push_back({});
        } else if (c == ']') {
            cin.get();
            glebokosc--;
        } else if (c == ',') {
            cin.get();
        } else {
            int x;
            cin >> x;
            m.back().push_back(x);
        }
    }
    cout << "[";
    for (int j = 0; j < (int)m[0].size(); j++) {
        if (j > 0) cout << ",";
        cout << "[";
        for (int i = 0; i < (int)m.size(); i++) cout << (i ? "," : "") << m[i][j];
        cout << "]";
    }
    cout << "]\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-lista-zagniezdzona', krok: 9, level: 'trudne',
            title: 'Lista w liście w liście',
            short: 'Zapis [1,[2,-3],[[4]],5,[]]. Jak głęboko sięgają nawiasy i ile wynosi suma liczb pomnożonych przez ich głębokość?',
            tags: ['znak po znaku', 'licznik głębokości', 'liczby ujemne w tekście'],
            statement: ['Lista może zawierać liczby i inne listy, np. [1,[2,-3],[[4]],5,[]]. Głębokość liczby to liczba nawiasów, w których stoi: 1 i 5 mają głębokość 1, 2 i −3 — 2, a 4 — 3. Między elementami mogą stać spacje i entery.',
                'Wypisz największą głębokość nawiasów (zewnętrzna lista ma głębokość 1, pusta lista też się liczy) oraz sumę wszystkich liczb pomnożonych przez ich głębokości.'],
            input_format: ['Lista — do końca danych.'],
            output_format: ['Dwie liczby: największa głębokość i ważona suma.'],
            constraints: ['Zapis ma od 2 do 50 000 znaków.', 'Liczby: od −10⁶ do 10⁶ (nie mają zer na początku).'],
            examples: [{ input: '[1,[2,-3],[[4]],5,[]]', note: 'Największa głębokość to 3. Suma ważona: 1 · 1 + 2 · 2 − 3 · 2 + 4 · 3 + 5 · 1 = 16.' }],
            hint: R`Licznik głębokości: „[” — plus jeden (i aktualizacja maksimum), „]” — minus jeden. Liczbę rozpoznasz po pierwszym znaku (cyfra albo minus) — zajrzyj przez cin.peek() i wczytaj ją przez cin >> x, a potem dodaj x · głębokość do sumy (long long). Białe znaki przeskakuj przez cin >> ws.`,
            tests: (r) => {
                const lista = (budzet, glMax) => { let s = '', d = 0; const sp = () => (r() < 0.15 ? r.pick([' ', '\n', '  ']) : ''); s += '['; d = 1; let pierwszy = true;
                    while (s.length < budzet) { const p = r(); if (p < 0.25 && d < glMax) { s += (pierwszy ? '' : ',') + sp() + '['; d++; pierwszy = true; } else if (p < 0.45 && d > 1) { s += sp() + ']'; d--; pierwszy = false; } else { s += (pierwszy ? '' : ',') + sp() + r.int(-1000000, 1000000) + sp(); pierwszy = false; } }
                    while (d > 0) { s += ']'; d--; } return s; };
                return ['[]', '[5]', '[[[[]]]]', '[1,[2,-3],[[4]],5,[]]', '[ -7 ,\n [ 0 ] ]', lista(200, 6), lista(5000, 40), lista(45000, 15), '['.repeat(20000) + '1000000' + ']'.repeat(20000)];
            },
            check: (inp) => {
                if (inp.length > 50000) return 'długość';
                const s = inp.replace(/\s+/g, ''); let d = 0; if (!/^\[[\[\],\d-]*\]$/.test(s)) return 'znaki';
                for (const c of s) { if (c === '[') d++; else if (c === ']') { d--; if (d < 0) return 'nawiasy'; } } if (d) return 'nawiasy';
                return (s.match(/-?\d+/g) || []).every((x) => calk(Number(x), -1e6, 1e6) && !/^-?0\d/.test(x)) ? null : 'liczby';
            },
            solve: (inp) => { const s = inp.replace(/\s+/g, ''); let d = 0, mx = 0, sum = 0; for (const m of s.matchAll(/\[|\]|-?\d+/g)) { if (m[0] === '[') { d++; mx = Math.max(mx, d); } else if (m[0] === ']') d--; else sum += Number(m[0]) * d; } return `${mx} ${sum}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long d = 0, mx = 0, suma = 0;
    while (cin >> ws && cin.peek() != EOF) {
        char c = cin.peek();
        if (c == '[') {
            cin.get();
            d++;
            mx = max(mx, d);
        } else if (c == ']') {
            cin.get();
            d--;
        } else if (c == ',') {
            cin.get();
        } else {
            long long x;
            cin >> x;
            suma += x * d;
        }
    }
    cout << mx << " " << suma << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-tabela-markdown', krok: 9, level: 'trudne',
            title: 'Tabela w Markdownie',
            short: 'Tabela z kreskami | i krzywymi odstępami. Rozbij każdy wiersz na komórki, przytnij spacje, policz szerokości i wypisz równą tabelę.',
            tags: ['getline(ss, kom, \'|\')', 'przycinanie spacji', 'szerokości kolumn'],
            statement: ['W plikach Markdown tabelę zapisuje się kreskami: | Imie | Wiek |. Drugi wiersz tabeli to linia oddzielająca nagłówek, złożona z kresek i myślników, np. |---|---|. Ktoś wpisał tabelę niedbale — z różną liczbą spacji wokół komórek.',
                'Wypisz tabelę równo: każda kolumna ma szerokość najdłuższej komórki w tej kolumnie (nagłówek się liczy, linia oddzielająca — nie). Wiersz z komórkami to kreska, a potem dla każdej komórki: spacja, tekst dosunięty do lewej w polu szerokości kolumny, spacja i kreska. Linia oddzielająca to kreska, a potem dla każdej kolumny: myślniki (szerokość kolumny + 2) i kreska.'],
            input_format: ['Tabela — do końca danych. Każdy wiersz zaczyna się i kończy znakiem |. Drugi wiersz to linia oddzielająca.'],
            output_format: ['Ta sama tabela, wyrównana.'],
            constraints: ['Tabela ma od 2 do 100 wierszy i od 1 do 10 kolumn; każdy wiersz ma tyle samo komórek.', 'Tekst komórki (po przycięciu spacji) ma od 1 do 20 znaków: litery, cyfry i pojedyncze spacje.'],
            examples: [{ input: '| Imie |Wiek| Miasto |\n|---|---|---|\n|Ola| 12|Krakow|\n|  Bartek  |9| Nowy Sacz|', note: 'Kolumna Miasto ma szerokość 9 (Nowy Sacz), więc jej linia oddzielająca ma 11 myślników. Spacja w środku „Nowy Sacz” zostaje.' }],
            hint: R`Wiersz wczytaj przez getline i rozbij: stringstream ss(s); getline(ss, kom, '|') — pierwszy kawałek (przed pierwszą kreską) jest pusty, pomiń go. Każdą komórkę przytnij: usuń spacje z początku i z końca (find_first_not_of i find_last_not_of albo pętle). Drugi wiersz pomiń przy liczeniu szerokości i wypisz na nowo.`,
            tests: (r) => {
                const sp = () => ' '.repeat(r.pick([0, 0, 1, 1, 2, 4]));
                const kom = () => (r() < 0.6 ? r.pick([...IMIONA, ...MIASTA, ...SLOWA]) : String(r.int(0, 99999))).slice(0, 20).trim();
                const tab = (w, k) => { const rows = Array.from({ length: w }, () => Array.from({ length: k }, kom)); const ln = (row) => '|' + row.map((c) => sp() + c + sp()).join('|') + '|'; return [ln(rows[0]), '|' + Array.from({ length: k }, () => sp() + '-'.repeat(r.int(1, 5)) + sp()).join('|') + '|', ...rows.slice(1).map(ln)].join('\n'); };
                return ['|a|\n|-|', '| x | y |\n|---|---|\n| 1 | 22 |', '| Imie |Wiek| Miasto |\n|---|---|---|\n|Ola| 12|Krakow|\n|  Bartek  |9| Nowy Sacz|', tab(6, 4), tab(99, 10), tab(50, 1)];
            },
            check: (inp) => {
                const L = linie(inp); if (L.length < 2 || L.length > 100) return 'wiersze';
                const kom = (l) => (/^\|.*\|$/.test(l) ? l.slice(1, -1).split('|').map((x) => x.trim()) : null);
                const k = kom(L[0]); if (!k || k.length > 10) return 'nagłówek';
                const sep = kom(L[1]); if (!sep || sep.length !== k.length || !sep.every((x) => /^-+$/.test(x))) return 'linia';
                return L.filter((_, i) => i !== 1).every((l) => { const c = kom(l); return c && c.length === k.length && c.every((x) => /^[A-Za-z0-9]+( [A-Za-z0-9]+)*$/.test(x) && x.length <= 20); }) ? null : 'komórki';
            },
            solve: (inp) => {
                const L = linie(inp); const rows = L.filter((_, i) => i !== 1).map((l) => l.slice(1, -1).split('|').map((x) => x.trim()));
                const w = rows[0].map((_, j) => Math.max(...rows.map((row) => row[j].length)));
                const ln = (row) => '|' + row.map((c, j) => ' ' + c.padEnd(w[j]) + ' |').join('');
                return [ln(rows[0]), '|' + w.map((x) => '-'.repeat(x + 2) + '|').join(''), ...rows.slice(1).map(ln)].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<vector<string>> t;
    string s;
    int nr = 0;
    while (getline(cin, s)) {
        nr++;
        if (nr == 2) continue;
        stringstream ss(s);
        string kom;
        vector<string> w;
        getline(ss, kom, '|');
        while (getline(ss, kom, '|')) {
            size_t a = kom.find_first_not_of(' '), b = kom.find_last_not_of(' ');
            w.push_back(a == string::npos ? "" : kom.substr(a, b - a + 1));
        }
        t.push_back(w);
    }
    int k = t[0].size();
    vector<int> szer(k, 0);
    for (auto &w : t)
        for (int j = 0; j < k; j++) szer[j] = max(szer[j], (int)w[j].size());
    for (int i = 0; i < (int)t.size(); i++) {
        cout << "|";
        for (int j = 0; j < k; j++) cout << " " << left << setw(szer[j]) << t[i][j] << " |";
        cout << "\n";
        if (i == 0) {
            cout << "|";
            for (int j = 0; j < k; j++) cout << string(szer[j] + 2, '-') << "|";
            cout << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-wlasna-sprawdzarka', krok: 9, level: 'trudne',
            title: 'Własna sprawdzarka',
            short: 'Napisz to, co robi sprawdzarka: porównaj wynik programu z oczekiwanym, wybaczając spacje na końcach wierszy i puste wiersze na końcu.',
            tags: ['getline do separatora ===', 'przycinanie końców', 'porównanie wiersz po wierszu'],
            statement: ['Sprawdzarka w zadaniach tej lekcji porównuje wynik Twojego programu z oczekiwanym tak: z każdego wiersza usuwa spacje na końcu, a z końca całego wyniku — puste wiersze. Dopiero potem porównuje wiersz po wierszu. Napisz taki porównywacz.',
                'Na wejściu jest wynik programu, potem wiersz ===, a potem oczekiwany wynik. Wypisz OK, jeśli po poprawkach są identyczne. W przeciwnym razie wypisz ROZNICA w wierszu k — numer pierwszego wiersza (licząc od 1), w którym się różnią; jeśli jeden wynik jest krótszy, różnica jest w pierwszym wierszu, którego mu brakuje.'],
            input_format: ['Wiersze wyniku programu, wiersz ===, wiersze oczekiwanego wyniku — do końca danych. Wiersz === pojawia się dokładnie raz. Pierwszy wiersz wejścia nie jest pusty i nie zaczyna się spacją.'],
            output_format: ['OK albo ROZNICA w wierszu k.'],
            constraints: ['Razem najwyżej 2000 wierszy i 50 000 znaków (litery, cyfry, spacje, interpunkcja).'],
            examples: [
                { input: '15\nAla ma kota   \n\n===\n15\nAla ma kota', note: 'Spacje na końcu drugiego wiersza i pusty wiersz na końcu wyniku programu są wybaczane — OK.' },
                { input: '1 2 3\n4 5 6\n===\n1 2 3\n4  5 6', note: 'W drugim wierszu oczekiwanego wyniku między 4 a 5 są dwie spacje. Spacje w środku wiersza się liczą.' },
            ],
            hint: R`Czytaj while (getline(cin, s)): dopóki nie trafisz na "===", dokładaj wiersze do pierwszego vectora, potem — do drugiego. Każdy wiersz przytnij z prawej (while (!s.empty() && s.back() == ' ') s.pop_back();), a z końca obu vectorów zdejmij puste wiersze. Potem porównaj wiersz po wierszu do długości dłuższego vectora.`,
            tests: (r) => {
                const wiersz = () => (r() < 0.7 ? Array.from({ length: r.int(1, 6) }, () => r.pick([...SLOWA, String(r.int(0, 999))])).join(' ') : String(r.int(-1000, 1000)));
                const para = (n, zmiana) => {
                    const B = Array.from({ length: n }, wiersz); let A = B.map((l) => l + (r() < 0.3 ? ' '.repeat(r.int(1, 3)) : ''));
                    if (zmiana === 'pusteKoniec') A.push('', '');
                    if (zmiana === 'zmien') { const i = r.int(1, n - 1); A[i] = A[i] + 'x'; }
                    if (zmiana === 'spacjaPrzod') { const i = r.int(1, n - 1); A[i] = ' ' + A[i]; }
                    if (zmiana === 'brak') A.pop();
                    if (zmiana === 'nadmiar') A.push('koniec');
                    if (zmiana === 'srodek') { const i = r.int(1, n - 1); A.splice(i, 0, ''); }
                    return `${A.join('\n')}\n===\n${B.join('\n')}`;
                };
                return ['a\n===\na', 'a\n===\nb', 'a\n===\na\n\n\n', 'a\nb\n===\na', 'a\n===\na\nb', '15\nAla ma kota   \n\n===\n15\nAla ma kota', para(20, 'pusteKoniec'), para(30, 'zmien'), para(30, 'spacjaPrzod'),
                    para(500, 'brak'), para(500, 'nadmiar'), para(800, 'srodek'), para(900, '')];
            },
            check: (inp) => { const L = linie(inp); if (L.length > 2000 || inp.length > 50000 || !ascii(inp)) return 'rozmiar'; if (L.filter((l) => l === '===').length !== 1 || L[0] === '' || L[0][0] === ' ' || L[0] === '===') return 'separator'; return null; },
            solve: (inp) => {
                const L = linie(inp); const k = L.indexOf('===');
                const pop = (A) => { A = A.map((l) => l.replace(/ +$/, '')); while (A.length && A[A.length - 1] === '') A.pop(); return A; };
                const A = pop(L.slice(0, k)), B = pop(L.slice(k + 1));
                for (let i = 0; i < Math.max(A.length, B.length); i++) if (A[i] !== B[i]) return `ROZNICA w wierszu ${i + 1}`;
                return 'OK';
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<string> a, b;
    string s;
    bool druga = false;
    while (getline(cin, s)) {
        if (!druga && s == "===") {
            druga = true;
            continue;
        }
        while (!s.empty() && s.back() == ' ') s.pop_back();
        if (druga) b.push_back(s);
        else a.push_back(s);
    }
    while (!a.empty() && a.back().empty()) a.pop_back();
    while (!b.empty() && b.back().empty()) b.pop_back();
    int n = max(a.size(), b.size());
    for (int i = 0; i < n; i++) {
        if (i >= (int)a.size() || i >= (int)b.size() || a[i] != b[i]) {
            cout << "ROZNICA w wierszu " << i + 1 << "\n";
            return 0;
        }
    }
    cout << "OK\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-arkusz', krok: 9, level: 'trudne',
            title: 'Arkusz kalkulacyjny',
            short: 'Wiersze „b = a + 7 - c”: zmienne definiowane po kolei, także nadpisywane. Rozbij każdy wiersz na kawałki i policz wszystkie wartości.',
            tags: ['stringstream na kawałki', 'liczba czy nazwa?', 'vector<pair<string, long long>>'],
            statement: ['Prosty arkusz kalkulacyjny przyjmuje wiersze postaci nazwa = wyrażenie. Wyrażenie to składniki oddzielone znakami + albo − (wszystko oddzielone pojedynczymi spacjami), a składnik to liczba całkowita nieujemna albo nazwa zmiennej zdefiniowanej wcześniej. Zmienną można zdefiniować ponownie — od tej chwili ma nową wartość.',
                'Wypisz końcowe wartości wszystkich zmiennych w kolejności, w jakiej pojawiły się po raz pierwszy, w formacie nazwa = wartość.'],
            input_format: ['Wiersze nazwa = wyrażenie — do końca danych.'],
            output_format: ['Po jednym wierszu na każdą zmienną: nazwa = wartość.'],
            constraints: ['Wierszy jest od 1 do 500, każdy ma najwyżej 30 składników.', 'Nazwy: od 1 do 8 małych liter. Liczby: od 0 do 10⁹.', 'Wszystkie wartości mieszczą się między −10¹⁵ a 10¹⁵.'],
            examples: [{ input: 'a = 5\nb = a + 7\na = b - a - 2\nc = 100 - a - b', note: 'Najpierw a = 5 i b = 12. Potem a zmienia się na 12 − 5 − 2 = 5, a c = 100 − 5 − 12 = 83.' }],
            hint: R`Każdy wiersz włóż do stringstream i czytaj kawałki: ss >> nazwa >> rowna >> t, potem while (ss >> op >> t). Kawałek t to liczba, gdy zaczyna się od cyfry (isdigit(t[0]) — wtedy stoll), inaczej nazwa — jej wartość znajdziesz w vector<pair<string, long long>>. Przypisanie: jeśli nazwa już jest — zmień wartość, jeśli nie — push_back.`,
            tests: (r) => {
                const arkusz = (n, maxSkl, pNowa) => {
                    const V = new Map(); const L = [];
                    for (let i = 0; i < n; i++) {
                        let linia, w;
                        do {
                            const nazwy = [...V.keys()]; const sk = []; const k = r.int(1, maxSkl); w = 0;
                            for (let j = 0; j < k; j++) { const t = nazwy.length && r() < 0.5 ? r.pick(nazwy) : String(r.int(0, 1000000000)); const zn = j === 0 || r() < 0.5 ? 1 : -1; w += zn * (/^\d/.test(t) ? Number(t) : V.get(t)); sk.push((j ? (zn > 0 ? '+ ' : '- ') : '') + t); }
                            const cel = !nazwy.length || r() < pNowa ? r.word(r.int(1, 8)) : r.pick(nazwy);
                            linia = `${cel} = ${sk.join(' ')}`; if (Math.abs(w) <= 1e15) { V.set(cel, w); break; }
                        } while (true);
                        L.push(linia);
                    }
                    return L.join('\n');
                };
                return ['x = 7', 'a = 5\nb = a + 7\na = b - a - 2\nc = 100 - a - b', 'a = 1000000000\na = a + a\na = a + a + a\nb = 0 - a', arkusz(15, 4, 0.4), arkusz(500, 30, 0.2), arkusz(500, 3, 0.05)];
            },
            check: (inp) => {
                const V = new Map(); const L = linie(inp); if (L.length > 500) return 'wiersze';
                for (const l of L) {
                    const t = l.split(' '); if (t.length < 3 || t[1] !== '=' || !/^[a-z]{1,8}$/.test(t[0]) || t.length % 2 === 0 || (t.length - 1) / 2 > 30) return 'wiersz';
                    let w = 0; for (let j = 2; j < t.length; j += 2) { const zn = j === 2 ? 1 : t[j - 1] === '+' ? 1 : t[j - 1] === '-' ? -1 : 0; if (!zn) return 'znak'; let v; if (/^\d+$/.test(t[j])) { v = Number(t[j]); if (v > 1e9) return 'liczba'; } else if (V.has(t[j])) v = V.get(t[j]); else return 'nazwa'; w += zn * v; }
                    if (Math.abs(w) > 1e15) return 'zakres'; V.set(t[0], w);
                }
                return null;
            },
            solve: (inp) => {
                const V = new Map();
                for (const l of linie(inp)) { const t = l.split(' '); let w = 0; for (let j = 2; j < t.length; j += 2) { const zn = j === 2 || t[j - 1] === '+' ? 1 : -1; w += zn * (/^\d/.test(t[j]) ? Number(t[j]) : V.get(t[j])); } V.set(t[0], w); }
                return [...V].map(([k, v]) => `${k} = ${v}`).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    vector<pair<string, long long>> zm;
    auto wartosc = [&](const string &t) -> long long {
        if (isdigit(t[0])) return stoll(t);
        for (auto &[n, v] : zm)
            if (n == t) return v;
        return 0LL;
    };
    string s;
    while (getline(cin, s)) {
        stringstream ss(s);
        string nazwa, rowna, t, op;
        ss >> nazwa >> rowna >> t;
        long long w = wartosc(t);
        while (ss >> op >> t) {
            if (op == "+") w += wartosc(t);
            else w -= wartosc(t);
        }
        bool jest = false;
        for (auto &[n, v] : zm)
            if (n == nazwa) {
                v = w;
                jest = true;
            }
        if (!jest) zm.push_back({nazwa, w});
    }
    for (auto &[n, v] : zm) cout << n << " = " << v << "\n";
    return 0;
}`,
        },
        {
            id: 'iop-b-formatowanie-klamer', krok: 9, level: 'trudne',
            title: 'Formatowanie kodu',
            short: 'Kod z rozjechanymi wcięciami. Ustaw każdemu wierszowi wcięcie 4 · głębokość klamer — wiersz zaczynający się od } cofa się o poziom.',
            tags: ['getline', 'liczenie { i } znak po znaku', 'przycinanie spacji'],
            statement: ['Ktoś wkleił program i wszystkie wcięcia się rozjechały. Popraw je. Dla każdego wiersza: usuń spacje z początku i z końca; jeśli wiersz jest teraz pusty — wypisz pusty wiersz. W przeciwnym razie wcięcie to 4 spacje razy głębokość, gdzie głębokość to liczba klamer { minus liczba klamer } we wszystkich wcześniejszych wierszach — pomniejszona o jeden, jeśli sam wiersz zaczyna się od }.'],
            input_format: ['Program — do końca danych.'],
            output_format: ['Ten sam program z poprawionymi wcięciami.'],
            constraints: ['Program ma od 1 do 400 wierszy; każdy wiersz bez spacji na brzegach ma najwyżej 40 znaków (bez tabulatorów i bez polskich liter).', 'Klamry są poprawnie sparowane, wcięcie nigdy nie wychodzi ujemne, a głębokość nie przekracza 8.'],
            examples: [{ input: 'int main() {\nint x;\n        if (x > 0) {\n   cout << x;\n      } else {\n cout << 0;\n}\n  }', note: 'Wiersz } else { zaczyna się od klamry zamykającej, więc stoi o poziom płycej niż wnętrze ifa — na tej samej głębokości co if.' }],
            hint: R`Trzymaj głębokość d (na start 0). Dla wiersza: przytnij spacje (find_first_not_of i find_last_not_of). Wcięcie to d, a jeśli wiersz zaczyna się od '}' — d − 1. Wypisz string(4 * wciecie, ' ') i przycięty wiersz. Dopiero potem przejdź jego znaki: '{' zwiększa d, '}' zmniejsza.`,
            tests: (r) => {
                const kod = (n) => {
                    const L = ['int main() {']; let p = 1;
                    while (L.length < n) {
                        const q = r();
                        if (q < 0.18 && p < 8) { L.push(r.pick(['if (x > 0) {', 'for (int i = 0; i < n; i++) {', 'while (cin >> x) {', 'do {', 'auto f = [&](int a) {'])); p++; }
                        else if (q < 0.3 && p > 1) { L.push(r.pick(['}', '}', '} else {', '};'])); if (L[L.length - 1] !== '} else {') p--; }
                        else if (q < 0.35) L.push('');
                        else L.push(r.pick(['x++;', 'cout << x << "\\n";', 'suma += x;', 'int t[3] = {1, 2, 3};', 'return 0;', 'break;', 's = s + "a";']));
                    }
                    while (p > 0) { L.push('}'); p--; }
                    return L.map((l) => ' '.repeat(r.pick([0, 0, 1, 3, 4, 8, 12])) + l + ' '.repeat(r.pick([0, 0, 0, 2]))).join('\n');
                };
                return ['x', '{\n}', '{\n{\n}\n}', 'int main() {\nint x;\n        if (x > 0) {\n   cout << x;\n      } else {\n cout << 0;\n}\n  }', kod(25), kod(150), kod(380)];
            },
            check: (inp) => {
                if (!ascii(inp) || linie(inp).length > 400 || linie(inp).some((l) => l.trim().length > 40)) return 'kod';
                let d = 0; for (const l of linie(inp)) { const t = l.trim(); if (t && d - (t[0] === '}' ? 1 : 0) < 0) return 'wcięcie'; for (const c of l) { if (c === '{') d++; if (c === '}') d--; } if (d < 0 || d > 8) return 'klamry'; }
                return null;
            },
            solve: (inp) => { let d = 0; return linie(inp).map((l) => { const t = l.trim(); const w = t ? ' '.repeat(4 * (d - (t[0] === '}' ? 1 : 0))) + t : ''; for (const c of l) { if (c === '{') d++; if (c === '}') d--; } return w; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    int d = 0;
    while (getline(cin, s)) {
        size_t a = s.find_first_not_of(' '), b = s.find_last_not_of(' ');
        if (a == string::npos) {
            cout << "\n";
            continue;
        }
        string t = s.substr(a, b - a + 1);
        int wciecie = d - (t[0] == '}' ? 1 : 0);
        cout << string(4 * wciecie, ' ') << t << "\n";
        for (char c : t) {
            if (c == '{') d++;
            if (c == '}') d--;
        }
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-csv-cudzyslowy', krok: 9, level: 'trudne',
            title: 'CSV z cudzysłowami',
            short: 'Pola rozdzielone przecinkami — ale "Kowalski, Jan" w cudzysłowie to jedno pole, a "" w środku to jeden cudzysłów. Rozbierz każdy wiersz znak po znaku.',
            tags: ['znak po znaku', 'stan „w cudzysłowie”', 'podwojony cudzysłów'],
            statement: ['Format CSV zapisuje tabelę: w każdym wierszu pola rozdzielone przecinkami. Pole może być ujęte w cudzysłowy — wtedy przecinki w środku są zwykłymi znakami, a dwa cudzysłowy pod rząd oznaczają jeden znak cudzysłowu w treści. Cudzysłowy otaczające pole nie należą do jego treści. Pola bez cudzysłowów nie zawierają ani przecinków, ani cudzysłowów; pole może być puste.',
                'Dla każdego wiersza wypisz liczbę pól, a po spacji — wszystkie pola w nawiasach kwadratowych, jedno za drugim.'],
            input_format: ['Wiersze CSV — do końca danych.'],
            output_format: ['Po jednym wierszu na każdy wiersz wejścia: liczba pól, spacja i pola w nawiasach kwadratowych.'],
            constraints: ['Wierszy jest od 1 do 300, każdy ma od 1 do 100 znaków; żaden nie zaczyna się ani nie kończy spacją.', 'Cudzysłowy są zawsze poprawnie domknięte.'],
            examples: [{ input: 'Jan,"Kowalski, Jan",15\na,,b\n"Mowil ""hej"" i poszedl",x', note: 'W pierwszym wierszu przecinek w cudzysłowie nie dzieli pola. W drugim środkowe pole jest puste. W trzecim podwójne cudzysłowy zamieniają się w pojedyncze.' }],
            hint: R`Wczytaj wiersz przez getline i idź po znakach z flagą wCudzyslowie. Cudzysłów: jeśli jesteś w cudzysłowie i następny znak też jest cudzysłowem — to jeden cudzysłów w treści (przeskocz o dwa); inaczej przełącz flagę. Przecinek poza cudzysłowem kończy pole (push_back i nowe puste pole); każdy inny znak dopisz do bieżącego pola. Na końcu wiersza dołóż ostatnie pole.`,
            tests: (r) => {
                const pole = () => { const p = r(); if (p < 0.1) return ''; if (p < 0.55) return r.pick([...IMIONA, ...SLOWA, String(r.int(0, 999))]); const tresc = Array.from({ length: r.int(1, 4) }, () => r.pick([...SLOWA, ',', ' ,', '""', 'x"" y', String(r.int(0, 99))])).join(r.pick([' ', '', ', '])); return '"' + tresc + '"'; };
                const wiersz = () => { let s; do { s = Array.from({ length: r.int(1, 8) }, pole).join(','); } while (!s.length || s.length > 100 || s[0] === ' ' || s[s.length - 1] === ' '); return s; };
                return ['a', '""', '"a,b"', ',', 'Jan,"Kowalski, Jan",15\na,,b\n"Mowil ""hej"" i poszedl",x', Array.from({ length: 20 }, wiersz).join('\n'), Array.from({ length: 300 }, wiersz).join('\n')];
            },
            check: (inp) => {
                const L = linie(inp); if (L.length > 300 || !ascii(inp)) return 'wiersze';
                const okPola = /^(?:"(?:[^"]|"")*"|[^",]*)(?:,(?:"(?:[^"]|"")*"|[^",]*))*$/;
                return L.every((l) => l.length >= 1 && l.length <= 100 && l[0] !== ' ' && l[l.length - 1] !== ' ' && okPola.test(l)) ? null : 'wiersz';
            },
            solve: (inp) => linie(inp).map((l) => {
                const P0 = []; let cur = '', w = false;
                for (let i = 0; i < l.length; i++) { const c = l[i]; if (c === '"') { if (w && l[i + 1] === '"') { cur += '"'; i++; } else w = !w; } else if (c === ',' && !w) { P0.push(cur); cur = ''; } else cur += c; }
                P0.push(cur); return `${P0.length} ${P0.map((x) => `[${x}]`).join('')}`;
            }).join('\n'),
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    while (getline(cin, s)) {
        vector<string> pola;
        string cur;
        bool w = false;
        for (int i = 0; i < (int)s.size(); i++) {
            char c = s[i];
            if (c == '"') {
                if (w && i + 1 < (int)s.size() && s[i + 1] == '"') {
                    cur += '"';
                    i++;
                } else {
                    w = !w;
                }
            } else if (c == ',' && !w) {
                pola.push_back(cur);
                cur = "";
            } else {
                cur += c;
            }
        }
        pola.push_back(cur);
        cout << pola.size() << " ";
        for (auto &p : pola) cout << "[" << p << "]";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'iop-b-wyniki-zawodow', krok: 9, level: 'trudne',
            title: 'Wielki finał: tabela wyników zawodów',
            short: 'Dziennik zgłoszeń „00:12:30 ala B OK” aż do KONIEC. Policz rozwiązane zadania i karę, ułóż ranking z miejscami ex aequo i wydrukuj równą tabelę.',
            tags: ['separatory i słowo kończące', 'zbieranie po loginie', 'sortowanie i tabela z kolumnami'],
            statement: ['Na zawodach drużynowych zadania nazywają się A, B, C, … (k pierwszych liter alfabetu). Dziennik sprawdzarki zapisuje każde zgłoszenie w wierszu: czas od startu (GG:MM:SS), login, litera zadania i werdykt — OK, WA, TLE, RE albo CE. Zgłoszenia są w kolejności czasu, a na końcu stoi słowo KONIEC.',
                'Zadanie jest rozwiązane w chwili pierwszego zgłoszenia OK; późniejsze zgłoszenia tego zadania przez tego samego zawodnika się nie liczą. Zgłoszenia CE (błąd kompilacji) nie liczą się wcale. Każde inne zgłoszenie bez OK to próba nieudana. Kara za rozwiązane zadanie to liczba pełnych minut od startu do jego pierwszego OK plus 20 za każdą wcześniejszą nieudaną próbę tego zadania; zadania nierozwiązane nie dają kary.',
                'Ranking: więcej rozwiązanych zadań; przy remisie mniejsza łączna kara; przy dalszym remisie login alfabetycznie. Zawodnicy z tą samą liczbą zadań i tą samą karą zajmują to samo miejsce (np. 1, 2, 2, 4). W tabeli są wszyscy, którzy pojawili się w dzienniku.',
                'Tabela ma kolumny Miejsce, Login, Zad, Kara i po jednej kolumnie na każde zadanie (nagłówek to jego litera). Komórka zadania to + (rozwiązane bez nieudanych prób), +x (rozwiązane po x nieudanych próbach), -x (nierozwiązane, x nieudanych prób; zwykły minus) albo . (żadnej próby). Szerokość kolumny to długość najdłuższego wpisu z nagłówkiem włącznie. Kolumny Miejsce, Zad i Kara są dosunięte do prawej, pozostałe — do lewej (nagłówki też). Kolumny oddziela napis „ | ”. Pod nagłówkiem stoi linia z myślników o szerokości kolumn, oddzielonych napisem „-+-”.'],
            input_format: ['W pierwszym wierszu k.', 'Dalej zgłoszenia GG:MM:SS login zadanie werdykt, każde w osobnym wierszu, a na końcu wiersz KONIEC.'],
            output_format: ['Tabela: wiersz nagłówka, linia z myślników i po jednym wierszu na zawodnika, w kolejności rankingu.'],
            constraints: ['1 ≤ k ≤ 8', 'Zgłoszeń jest od 1 do 2000, zawodników najwyżej 50.', 'Login: od 1 do 10 małych liter i cyfr. Czas: od 00:00:00 do 05:00:00.'],
            examples: [{ input: '3\n00:05:10 ala A OK\n00:07:00 bartek A WA\n00:12:59 bartek A OK\n00:20:00 ala B CE\n00:25:30 ala B WA\n00:40:01 ala B OK\n01:10:00 cela C WA\n01:20:00 bartek B OK\n02:00:00 ala B WA\nKONIEC', note: 'Ala: A w 5. minucie, B w 40. minucie po jednej nieudanej próbie (CE się nie liczy) — kara 5 + 40 + 20 = 65. Bartek: A w 12. minucie po jednej nieudanej próbie i B w 80. minucie — kara 12 + 20 + 80 = 112. Cela ma jedną nieudaną próbę C i zero zadań. Zgłoszenie Ali o 02:00:00 przyszło po rozwiązaniu B — nie liczy się.' }],
            hint: R`Pierwsze słowo wiersza wczytaj jako string: while (cin >> czas && czas != "KONIEC") { cin >> login >> zad >> werdykt; … }. Minuty od startu to stoi(czas.substr(0, 2)) * 60 + stoi(czas.substr(3, 2)). Zawodników trzymaj w vectorze loginów i równoległych tablicach: rozwiązane[z][k], proby[z][k], minuta[z][k]. Po wczytaniu policz liczbę zadań i karę, posortuj indeksy lambdą, wyznacz miejsca (to samo co poprzednik przy remisie wyniku) i dopiero wtedy szerokości kolumn — wszystkie wpisy zamień najpierw na napisy.`,
            tests: (r) => {
                const czas = (t) => `${pad2(Math.floor(t / 3600))}:${pad2(Math.floor(t / 60) % 60)}:${pad2(t % 60)}`;
                const dziennik = (k, nZ, nS, pOK) => {
                    const logi = Array.from({ length: nZ }, (_, i) => (r() < 0.7 ? r.pick(IMIONA).toLowerCase().slice(0, 8) + (r() < 0.5 ? r.int(1, 99) : '') : r.word(r.int(1, 10), 'abcdefghijklmnopqrstuvwxyz0123456789')));
                    const uni = [...new Set(logi)];
                    let t = 0; const L = [String(k)];
                    for (let i = 0; i < nS; i++) { t = Math.min(18000, t + r.int(0, Math.floor(36000 / nS))); const p = r(); const w = p < pOK ? 'OK' : p < pOK + 0.1 ? 'CE' : r.pick(['WA', 'WA', 'TLE', 'RE']); L.push(`${czas(t)} ${r.pick(uni)} ${String.fromCharCode(65 + r.int(0, k - 1))} ${w}`); }
                    return [...L, 'KONIEC'].join('\n');
                };
                return ['1\n00:00:00 a A OK\nKONIEC', '2\n00:00:59 x B CE\n05:00:00 y A WA\nKONIEC', '2\n00:10:00 b A OK\n00:10:30 a A OK\n00:20:00 c A WA\n00:30:00 c A OK\nKONIEC',
                    dziennik(3, 4, 15, 0.4), dziennik(5, 12, 120, 0.3), dziennik(8, 50, 2000, 0.25), dziennik(1, 50, 2000, 0.05), dziennik(8, 3, 2000, 0.6)];
            },
            check: (inp) => {
                const L = linie(inp); const k = Number(L[0]); if (!calk(k, 1, 8) || L[L.length - 1] !== 'KONIEC' || L.length < 3 || L.length > 2002) return 'k / KONIEC';
                const loginy = new Set(); let pop = -1;
                for (const l of L.slice(1, -1)) {
                    const m = l.match(/^(\d\d):(\d\d):(\d\d) ([a-z0-9]{1,10}) ([A-H]) (OK|WA|TLE|RE|CE)$/); if (!m) return 'zgłoszenie';
                    const t = +m[1] * 3600 + +m[2] * 60 + +m[3]; if (+m[2] > 59 || +m[3] > 59 || t > 18000 || t < pop) return 'czas'; pop = t;
                    if (m[5].charCodeAt(0) - 65 >= k) return 'zadanie'; loginy.add(m[4]);
                }
                return loginy.size <= 50 ? null : 'zawodnicy';
            },
            solve: (inp) => {
                const L = linie(inp); const k = Number(L[0]); const Z = new Map();
                for (const l of L.slice(1, -1)) {
                    const [cz, lg, zd, w] = l.split(' '); if (!Z.has(lg)) Z.set(lg, Array.from({ length: k }, () => ({ ok: false, pr: 0, min: 0 })));
                    const z = Z.get(lg)[zd.charCodeAt(0) - 65]; if (z.ok || w === 'CE') continue;
                    if (w === 'OK') { z.ok = true; const [h, m] = cz.split(':').map(Number); z.min = h * 60 + m; } else z.pr++;
                }
                const W = [...Z].map(([lg, zs]) => ({ lg, zs, roz: zs.filter((z) => z.ok).length, kara: zs.reduce((a, z) => a + (z.ok ? z.min + 20 * z.pr : 0), 0) }));
                W.sort((a, b) => b.roz - a.roz || a.kara - b.kara || cmp(a.lg, b.lg));
                const wiersze = W.map((w, i) => w);
                let miejsce = 0; const kom = wiersze.map((w, i) => { if (i === 0 || w.roz !== W[i - 1].roz || w.kara !== W[i - 1].kara) miejsce = i + 1; return [String(miejsce), w.lg, String(w.roz), String(w.kara), ...w.zs.map((z) => (z.ok ? (z.pr ? `+${z.pr}` : '+') : z.pr ? `-${z.pr}` : '.'))]; });
                const nag = ['Miejsce', 'Login', 'Zad', 'Kara', ...Array.from({ length: k }, (_, i) => String.fromCharCode(65 + i))];
                const szer = nag.map((x, j) => Math.max(x.length, ...kom.map((row) => row[j].length)));
                const prawo = (j) => j === 0 || j === 2 || j === 3;
                const wiersz = (row) => row.map((c, j) => (prawo(j) ? c.padStart(szer[j]) : c.padEnd(szer[j]))).join(' | ');
                return [wiersz(nag), szer.map((x) => '-'.repeat(x)).join('-+-'), ...kom.map(wiersz)].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    vector<string> login;
    vector<vector<int>> ok, proby, minuta;
    string czas;
    while (cin >> czas && czas != "KONIEC") {
        string lg, zad, werdykt;
        cin >> lg >> zad >> werdykt;
        int z = -1;
        for (int i = 0; i < (int)login.size(); i++)
            if (login[i] == lg) z = i;
        if (z == -1) {
            z = login.size();
            login.push_back(lg);
            ok.push_back(vector<int>(k, 0));
            proby.push_back(vector<int>(k, 0));
            minuta.push_back(vector<int>(k, 0));
        }
        int j = zad[0] - 'A';
        if (ok[z][j] || werdykt == "CE") continue;
        if (werdykt == "OK") {
            ok[z][j] = 1;
            minuta[z][j] = stoi(czas.substr(0, 2)) * 60 + stoi(czas.substr(3, 2));
        } else {
            proby[z][j]++;
        }
    }
    int n = login.size();
    vector<int> roz(n, 0), kara(n, 0), kol(n);
    for (int z = 0; z < n; z++) {
        kol[z] = z;
        for (int j = 0; j < k; j++)
            if (ok[z][j]) {
                roz[z]++;
                kara[z] += minuta[z][j] + 20 * proby[z][j];
            }
    }
    sort(kol.begin(), kol.end(), [&](int a, int b) {
        if (roz[a] != roz[b]) return roz[a] > roz[b];
        if (kara[a] != kara[b]) return kara[a] < kara[b];
        return login[a] < login[b];
    });
    vector<vector<string>> tab;
    vector<string> nag = {"Miejsce", "Login", "Zad", "Kara"};
    for (int j = 0; j < k; j++) nag.push_back(string(1, 'A' + j));
    tab.push_back(nag);
    int miejsce = 0;
    for (int i = 0; i < n; i++) {
        int z = kol[i];
        if (i == 0 || roz[z] != roz[kol[i - 1]] || kara[z] != kara[kol[i - 1]]) miejsce = i + 1;
        vector<string> w = {to_string(miejsce), login[z], to_string(roz[z]), to_string(kara[z])};
        for (int j = 0; j < k; j++) {
            if (ok[z][j]) w.push_back(proby[z][j] ? "+" + to_string(proby[z][j]) : "+");
            else w.push_back(proby[z][j] ? "-" + to_string(proby[z][j]) : ".");
        }
        tab.push_back(w);
    }
    int kolumn = 4 + k;
    vector<int> szer(kolumn, 0);
    for (auto &w : tab)
        for (int j = 0; j < kolumn; j++) szer[j] = max(szer[j], (int)w[j].size());
    for (int i = 0; i < (int)tab.size(); i++) {
        for (int j = 0; j < kolumn; j++) {
            if (j > 0) cout << " | ";
            bool prawo = (j == 0 || j == 2 || j == 3);
            if (prawo) cout << right;
            else cout << left;
            cout << setw(szer[j]) << tab[i][j];
        }
        cout << "\n";
        if (i == 0) {
            for (int j = 0; j < kolumn; j++) cout << (j ? "-+-" : "") << string(szer[j], '-');
            cout << "\n";
        }
    }
    return 0;
}`,
        },
    ];
};
