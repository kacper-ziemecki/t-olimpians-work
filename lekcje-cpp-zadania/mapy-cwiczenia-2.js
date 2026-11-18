// Mapy — ćwiczenia w trakcie lekcji, części 4–6: wartości złożone (map<string, vector>, map<int, set>, klucz-para,
// mapa par, mapa map, grupy anagramów, lista sąsiedztwa), przechodzenie i iteratory (begin, rbegin, odwrotna kolejność,
// zmiana wartości przez referencję, usuwanie w pętli, lower_bound i upper_bound po kluczu) oraz mapa jako pamięć
// (numeracja, kompresja, liczenie par, sumy prefiksowe, równowaga liter, poprzednie wystąpienie, najkrótsze okno, zmiany nicków).
module.exports = (h) => {
    const { toks, safe, fx } = h;
    const P = require('./input-output-plus-pomoc');
    const { IMIONA, SLOWA, PRODUKTY, rozrzuc, losy, calk, czyLiczba } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
    const rozneSlowa = (r, n, dlMin, dlMax, al) => { const s = new Set(); while (s.size < n) s.add(r.word(r.int(dlMin, dlMax), al)); return [...s]; };
    const zImienia = (w) => w[0].toUpperCase() + w.slice(1);
    const kr = IMIONA.filter((x) => x.length <= 10);

    return [
        // ================================================================ KROK 4 · wartości złożone
        {
            id: 'map-klasy-i-uczniowie', krok: 4, level: 'latwe',
            title: 'Uczniowie według klas',
            short: 'Klasa → lista uczniów. map<string, vector<string>> i push_back do listy wybranej po kluczu.',
            tags: ['map<string, vector<string>>', 'm[k].push_back(x)', 'grupowanie'],
            statement: ['Sekretariat ma listę n uczniów: imię i klasę. Wypisz każdą klasę (w kolejności alfabetycznej nazw klas), a po dwukropku imiona jej uczniów w kolejności z listy.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: imię i klasa.'],
            output_format: ['Po jednym wierszu na klasę: klasa, dwukropek i imiona oddzielone spacjami.'],
            constraints: ['1 ≤ n ≤ 1500', 'Imiona: od 1 do 10 liter. Klasy: cyfra i mała litera, np. 7c.'],
            examples: [{ input: '5\nOla 7c\nBartek 4a\nZuzia 7c\nKuba 7a\nIga 4a', note: 'Klasy alfabetycznie: 4a, 7a, 7c. W 7c najpierw Ola, potem Zuzia — tak jak na liście.' }],
            hint: R`map<string, vector<string>> klasa; — kluczem jest nazwa klasy, wartością lista imion. klasa[k].push_back(imie); dopisuje ucznia do listy tej klasy (gdy klasy jeszcze nie ma, [] tworzy pustą listę). Na koniec dwie pętle: po mapie i po liście w każdej klasie.`,
            tests: (r) => {
                const K = ['1a', '1b', '2a', '3c', '4a', '4b', '5a', '6d', '7a', '7c', '8b'];
                const d = (n, kl) => `${n}\n${Array.from({ length: n }, () => `${r.pick(kr)} ${r.pick(kl)}`).join('\n')}`;
                return ['1\nOla 1a', d(5, ['7c', '4a']), d(20, K), d(1500, K), d(1500, ['8b'])];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 1500) && L.length === n + 1 && L.slice(1).every((l) => /^[A-Za-z]{1,10} \d[a-z]$/.test(l)) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const l of linie(inp).slice(1)) { const [i, k] = l.split(' '); if (!m.has(k)) m.set(k, []); m.get(k).push(i); } return [...m].sort((a, b) => cmp(a[0], b[0])).map(([k, v]) => `${k}: ${v.join(' ')}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, vector<string>> klasa;
    for (int i = 0; i < n; i++) {
        string imie, k;
        cin >> imie >> k;
        klasa[k].push_back(imie);
    }
    for (auto &[k, lista] : klasa) {
        cout << k << ":";
        for (auto &imie : lista) cout << " " << imie;
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-oceny-ucznia', krok: 4, level: 'srednie',
            title: 'Dzienniczek ocen',
            short: 'Imię → lista ocen. Dla każdego ucznia wypisz oceny w kolejności wpisywania i średnią z dwiema cyframi po kropce.',
            tags: ['map<string, vector<int>>', 'średnia z listy', 'fixed i setprecision'],
            statement: ['Nauczyciel wpisuje oceny w dowolnej kolejności: każdy wiersz to imię ucznia i ocena. Dla każdego ucznia (alfabetycznie) wypisz jego oceny w kolejności wpisywania, a po strzałce średnią z dokładnie dwiema cyframi po kropce.'],
            input_format: ['Wiersze imie ocena — do końca danych.'],
            output_format: ['Po jednym wierszu na ucznia: imię, oceny oddzielone spacjami, -> i średnia.'],
            constraints: ['Wierszy jest od 1 do 3000. Imiona: od 1 do 10 liter. Oceny: od 1 do 6.', 'Średnie nie wypadają dokładnie w połowie między dwoma wynikami.'],
            examples: [{ input: 'Ola 5\nBartek 3\nOla 4\nOla 6\nBartek 4', note: 'Ola ma 5, 4 i 6 — średnia 5.00. Bartek ma 3 i 4 — średnia 3.50.' }],
            hint: R`map<string, vector<int>> oceny; i oceny[imie].push_back(o); dla każdego wiersza. Potem dla każdego ucznia wypisz jego listę i średnią: suma listy podzielona przez jej size(), jako double, po cout << fixed << setprecision(2).`,
            tests: (r) => {
                const gen = (uczn, maxO) => { const W = []; for (const u of uczn) { let o; do { o = losy(r, r.int(1, maxO), 1, 6); } while (!safe(o.reduce((a, b) => a + b, 0) / o.length, 2)); for (const x of o) W.push(`${u} ${x}`); } return r.shuffle(W).join('\n'); };
                return ['Ola 5', 'Ola 5\nBartek 3\nOla 4\nOla 6\nBartek 4', gen(kr.slice(0, 5), 6), gen(kr, 60), gen(['Jan'], 2000)];
            },
            check: (inp) => {
                const L = linie(inp); if (L.length > 3000) return 'ile'; const m = new Map();
                for (const l of L) { const x = l.match(/^([A-Za-z]{1,10}) ([1-6])$/); if (!x) return 'wiersz'; if (!m.has(x[1])) m.set(x[1], []); m.get(x[1]).push(+x[2]); }
                return [...m.values()].every((o) => safe(o.reduce((a, b) => a + b, 0) / o.length, 2)) ? null : 'remis';
            },
            solve: (inp) => { const m = new Map(); for (const l of linie(inp)) { const [i, o] = l.split(' '); if (!m.has(i)) m.set(i, []); m.get(i).push(+o); } return [...m].sort((a, b) => cmp(a[0], b[0])).map(([i, o]) => `${i} ${o.join(' ')} -> ${fx(o.reduce((a, b) => a + b, 0) / o.length, 2)}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<string, vector<int>> oceny;
    string imie;
    int o;
    while (cin >> imie >> o) oceny[imie].push_back(o);
    cout << fixed << setprecision(2);
    for (auto &[u, lista] : oceny) {
        cout << u;
        int suma = 0;
        for (int x : lista) {
            cout << " " << x;
            suma += x;
        }
        cout << " -> " << (double)suma / lista.size() << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-goscie-dzienni', krok: 4, level: 'srednie',
            title: 'Goście w kawiarni',
            short: 'Dzień → zbiór gości. Ilu różnych gości było każdego dnia? map<int, set<string>> — powtórne wizyty tego samego dnia się nie liczą.',
            tags: ['map<int, set<string>>', 'm[k].insert(x)', 'size wartości'],
            statement: ['Kawiarnia zapisuje każdą wizytę: numer dnia i imię gościa. Ten sam gość może przyjść kilka razy jednego dnia. Dla każdego dnia, w którym ktoś przyszedł (rosnąco), wypisz numer dnia i liczbę różnych gości tego dnia.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: numer dnia i imię.'],
            output_format: ['Po jednym wierszu na dzień: numer dnia i liczba różnych gości — rosnąco po dniach.'],
            constraints: ['1 ≤ n ≤ 5000', 'Dni: od 1 do 10⁹. Imiona: od 1 do 10 liter.'],
            examples: [{ input: '6\n3 Ola\n1 Bartek\n3 Ola\n3 Kuba\n1 Ola\n100 Bartek', note: 'Dnia 3 Ola była dwa razy — liczy się raz, więc gości było dwoje.' }],
            hint: R`map<int, set<string>> goscie; i goscie[dzien].insert(imie);. Zbiór sam pominie powtórne wizyty. Na koniec dla każdej pary (dzień, zbiór) wypisz dzień i rozmiar zbioru: zbior.size().`,
            tests: (r) => { const d = (n, D) => `${n}\n${Array.from({ length: n }, () => `${r.pick(D)} ${r.pick(kr.slice(0, 20))}`).join('\n')}`; return ['1\n1 A', d(6, [1, 3, 100]), d(30, [1, 2, 3, 4]), d(5000, losy(r, 300, 1, 1000000000)), d(5000, [7])]; },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 5000) && L.length === n + 1 && L.slice(1).every((l) => { const m = l.match(/^(\d+) [A-Za-z]{1,10}$/); return m && calk(+m[1], 1, 1e9); }) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const l of linie(inp).slice(1)) { const [d, i] = l.split(' '); const k = +d; if (!m.has(k)) m.set(k, new Set()); m.get(k).add(i); } return [...m].sort((a, b) => a[0] - b[0]).map(([d, s]) => `${d} ${s.size}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, set<string>> goscie;
    for (int i = 0; i < n; i++) {
        int dzien;
        string imie;
        cin >> dzien >> imie;
        goscie[dzien].insert(imie);
    }
    for (auto &[dzien, zbior] : goscie) cout << dzien << " " << zbior.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'map-plansza-rzadka', krok: 4, level: 'srednie',
            title: 'Ogromna plansza',
            short: 'Plansza od −10⁹ do 10⁹ w obu kierunkach. Zapisuj tylko zajęte pola: map<pair<int, int>, int> — kluczem jest para (x, y).',
            tags: ['map<pair<int, int>, int>', 'klucz-para', 'pola domyślnie 0'],
            statement: ['Gra toczy się na ogromnej planszy: współrzędne x i y sięgają od −10⁹ do 10⁹. Na początku na każdym polu leży 0. Polecenia: USTAW x y v — połóż na polu (x, y) liczbę v (zastępuje poprzednią); POKAZ x y — wypisz liczbę leżącą na polu (x, y).'],
            input_format: ['W pierwszym wierszu q.', 'q poleceń, każde w osobnym wierszu.'],
            output_format: ['Wiersz dla każdego polecenia POKAZ.'],
            constraints: ['1 ≤ q ≤ 2500', '−10⁹ ≤ x, y ≤ 10⁹, −10⁹ ≤ v ≤ 10⁹', 'Poleceń POKAZ jest od 1 do 2000.'],
            examples: [{ input: '5\nUSTAW 1000000000 -5 7\nPOKAZ 1000000000 -5\nPOKAZ -5 1000000000\nUSTAW 1000000000 -5 0\nPOKAZ 1000000000 -5', note: 'Pole (−5, 10⁹) to inne pole niż (10⁹, −5) — kolejność w parze ma znaczenie.' }],
            hint: R`Tablicy 2 · 10⁹ × 2 · 10⁹ nie da się utworzyć. map<pair<int, int>, int> pole; trzyma tylko pola, na których coś położono. USTAW: pole[{x, y}] = v;. POKAZ: jeśli pole.count({x, y}) — wypisz wartość, inaczej 0. (Odczyt pole[{x, y}] też by dał 0, ale dopisywałby puste pola do mapy.)`,
            tests: (r) => {
                const d = (P0) => `${P0.length}\n${P0.join('\n')}`;
                const los = (q, M) => { const pkt = Array.from({ length: 50 }, () => [r.int(-M, M), r.int(-M, M)]); let z = 0; const a = Array.from({ length: q }, (_, i) => { const [x, y] = r() < 0.7 ? r.pick(pkt) : [r.int(-M, M), r.int(-M, M)]; if ((r() < 0.5 && z < 2000) || (i === q - 1 && !z)) { z++; return `POKAZ ${x} ${y}`; } return `USTAW ${x} ${y} ${r.int(-1000000000, 1000000000)}`; }); return d(a); };
                return [d(['POKAZ 0 0']), d(['USTAW 3 4 5', 'POKAZ 4 3', 'POKAZ 3 4']), los(20, 3), los(2500, 1000000000), los(2500, 2)];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 2500) || L.length !== q + 1) return 'q'; let z = 0; for (const l of L.slice(1)) { const m = l.match(/^USTAW (-?\d+) (-?\d+) (-?\d+)$/) || l.match(/^POKAZ (-?\d+) (-?\d+)$/); if (!m || !m.slice(1).filter(Boolean).every((x) => calk(+x, -1e9, 1e9))) return 'polecenie'; if (l[0] === 'P') z++; } return z >= 1 && z <= 2000 ? null : 'POKAZ'; },
            solve: (inp) => { const m = new Map(); const o = []; for (const l of linie(inp).slice(1)) { const t = l.split(' '); const k = `${t[1]} ${t[2]}`; if (t[0] === 'USTAW') m.set(k, t[3]); else o.push(m.has(k) ? m.get(k) : '0'); } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    map<pair<int, int>, int> pole;
    while (q--) {
        string p;
        int x, y;
        cin >> p >> x >> y;
        if (p == "USTAW") {
            int v;
            cin >> v;
            pole[{x, y}] = v;
        } else {
            if (pole.count({x, y})) cout << pole[{x, y}] << "\n";
            else cout << 0 << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'map-grupy-anagramow', krok: 4, level: 'srednie',
            title: 'Grupy anagramów',
            short: 'Klucz: słowo z posortowanymi literami. Wartość: lista słów. Wypisz grupy, w których jest co najmniej dwoje słów.',
            tags: ['map<string, vector<string>>', 'klucz z posortowanych liter', 'sortowanie listy'],
            statement: ['Dostajesz n różnych słów. Słowa są anagramami, jeśli mają te same litery w tej samej liczbie (np. kot, tok, okt). Wypisz wszystkie grupy anagramów, w których są co najmniej dwa słowa: każdą grupę w osobnym wierszu, ze słowami w kolejności alfabetycznej. Grupy ułóż według ich pierwszego słowa. Jeśli żadnej takiej grupy nie ma, wypisz BRAK.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n różnych słów.'],
            output_format: ['Grupy anagramów, każda w osobnym wierszu, albo BRAK.'],
            constraints: ['1 ≤ n ≤ 2000', 'Słowa: od 1 do 10 małych liter, różne.'],
            examples: [{ input: '7\nkot pies tok sep ala okt lis', note: 'kot, tok i okt to anagramy — wypisujemy je alfabetycznie. pies i sep nimi nie są (sep nie ma litery i), a pozostałe słowa nie mają pary.' }],
            hint: R`map<string, vector<string>> grupy; — kluczem jest słowo z posortowanymi literami (kopia słowa po sort), wartością lista słów. Po wczytaniu posortuj każdą listę i zbierz te z co najmniej dwoma słowami do vectora list. Posortuj ten vector — listy porównują się słowo po słowie, więc ułożą się według pierwszego słowa.`,
            tests: (r) => {
                const d = (a) => `${a.length}\n${a.join(' ')}`;
                const zGrup = (k, dl, al) => { const S = new Set(); const baza = rozneSlowa(r, k, dl, dl, al); for (const b of baza) { const c = r.int(1, 4); for (let i = 0; i < c; i++) S.add(r.shuffle([...b]).join('')); } return r.shuffle([...S]); };
                return [d(['a']), d(['ab', 'ba']), d(['kot', 'pies', 'tok', 'sep', 'ala', 'okt', 'lis']), d(zGrup(10, 3, 'abcde')), d(zGrup(600, 5, 'abcdefghij').slice(0, 2000)), d(rozneSlowa(r, 2000, 1, 10))];
            },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 2000) && t.length === n + 1 && t.slice(1).every((w) => /^[a-z]{1,10}$/.test(w)) && new Set(t.slice(1)).size === n ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const w of toks(inp).slice(1)) { const k = [...w].sort().join(''); if (!m.has(k)) m.set(k, []); m.get(k).push(w); } const G = [...m.values()].filter((g) => g.length >= 2).map((g) => g.sort(cmp)).sort((a, b) => cmp(a[0], b[0])); return G.length ? G.map((g) => g.join(' ')).join('\n') : 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, vector<string>> grupy;
    for (int i = 0; i < n; i++) {
        string w;
        cin >> w;
        string klucz = w;
        sort(klucz.begin(), klucz.end());
        grupy[klucz].push_back(w);
    }
    vector<vector<string>> wynik;
    for (auto &[klucz, lista] : grupy)
        if (lista.size() >= 2) {
            sort(lista.begin(), lista.end());
            wynik.push_back(lista);
        }
    sort(wynik.begin(), wynik.end());
    if (wynik.empty()) cout << "BRAK\n";
    for (auto &g : wynik) {
        for (int i = 0; i < (int)g.size(); i++) cout << (i ? " " : "") << g[i];
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-ceny-ofert', krok: 4, level: 'srednie',
            title: 'Porównywarka cen',
            short: 'Produkt → (najniższa cena, najwyższa cena). Wartością mapy jest para, którą poprawiasz przy każdej nowej ofercie.',
            tags: ['map<string, pair<int, int>>', 'min i max w parze', 'count przy pierwszej ofercie'],
            statement: ['Porównywarka zebrała n ofert: nazwa produktu i cena w groszach. Dla każdego produktu (alfabetycznie) wypisz najniższą cenę, najwyższą cenę i liczbę ofert.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: produkt i cena.'],
            output_format: ['Po jednym wierszu na produkt: nazwa, najniższa cena, najwyższa cena, liczba ofert.'],
            constraints: ['1 ≤ n ≤ 5000', 'Nazwy: od 1 do 10 małych liter. Ceny: od 1 do 10⁶.'],
            examples: [{ input: '5\nmleko 349\nchleb 500\nmleko 299\nmleko 410\nchleb 500', note: 'Mleko ma trzy oferty: od 299 do 410. Chleb — dwie, obie po 500.' }],
            hint: R`map<string, pair<int, int>> zakres; i osobno map<string, int> ile;. Przy pierwszej ofercie produktu (zakres.count(p) == 0) zapisz {cena, cena}. Przy kolejnych popraw: zakres[p].first = min(zakres[p].first, cena), a second — przez max.`,
            tests: (r) => { const d = (n, pul) => `${n}\n${Array.from({ length: n }, () => `${r.pick(pul)} ${r.int(1, 1000000)}`).join('\n')}`; return ['1\nsok 5', d(5, ['mleko', 'chleb']), d(30, PRODUKTY.slice(0, 6)), d(5000, PRODUKTY.filter((p) => p.length <= 10)), d(5000, ['ryz'])]; },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 5000) && L.length === n + 1 && L.slice(1).every((l) => { const m = l.match(/^[a-z]{1,10} (\d+)$/); return m && calk(+m[1], 1, 1e6); }) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const l of linie(inp).slice(1)) { const [p, c0] = l.split(' '); const c = +c0; if (!m.has(p)) m.set(p, [c, c, 0]); const z = m.get(p); z[0] = Math.min(z[0], c); z[1] = Math.max(z[1], c); z[2]++; } return [...m].sort((a, b) => cmp(a[0], b[0])).map(([p, z]) => `${p} ${z.join(' ')}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, pair<int, int>> zakres;
    map<string, int> ile;
    for (int i = 0; i < n; i++) {
        string p;
        int c;
        cin >> p >> c;
        if (zakres.count(p) == 0) zakres[p] = {c, c};
        zakres[p].first = min(zakres[p].first, c);
        zakres[p].second = max(zakres[p].second, c);
        ile[p]++;
    }
    for (auto [p, z] : zakres) cout << p << " " << z.first << " " << z.second << " " << ile[p] << "\n";
    return 0;
}`,
        },
        {
            id: 'map-lista-sasiedztwa', krok: 4, level: 'trudne',
            title: 'Kto kogo zna?',
            short: 'Znajomości „a b” działają w obie strony. Dla każdej osoby zbiór znajomych: map<string, set<string>> — to tak zwana lista sąsiedztwa.',
            tags: ['map<string, set<string>>', 'krawędź w obie strony', 'stopień = size()'],
            statement: ['Dostajesz n znajomości: każda to dwa różne imiona i oznacza, że te osoby się znają (w obie strony). Ta sama znajomość może być zapisana kilka razy, także w odwrotnej kolejności.',
                'Dla każdej osoby, która pojawia się w danych (alfabetycznie), wypisz jej imię, liczbę znajomych, dwukropek i imiona znajomych alfabetycznie.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy dwa różne imiona.'],
            output_format: ['Po jednym wierszu na osobę: imię liczba: znajomi.'],
            constraints: ['1 ≤ n ≤ 3000', 'Imiona: od 1 do 10 liter; różnych osób jest najwyżej 30.'],
            examples: [{ input: '4\nOla Bartek\nBartek Kuba\nOla Bartek\nBartek Ola', note: 'Znajomość Ola–Bartek zapisano trzy razy — liczy się raz. Bartek zna Kubę i Olę.' }],
            hint: R`map<string, set<string>> zna;. Znajomość a–b to dwa wpisy: zna[a].insert(b); i zna[b].insert(a);. Zbiór pominie powtórki i ułoży imiona alfabetycznie, a liczba znajomych to zna[osoba].size().`,
            tests: (r) => { const d = (n, k) => { const os = kr.slice(0, k); return `${n}\n${Array.from({ length: n }, () => { const a = r.pick(os); let b; do { b = r.pick(os); } while (b === a); return `${a} ${b}`; }).join('\n')}`; }; return ['1\nA B', d(4, 3), d(20, 6), d(3000, 30), d(3000, 2)]; },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 3000) || L.length !== n + 1) return 'n'; const s = new Set(); for (const l of L.slice(1)) { const m = l.match(/^([A-Za-z]{1,10}) ([A-Za-z]{1,10})$/); if (!m || m[1] === m[2]) return 'para'; s.add(m[1]); s.add(m[2]); } return s.size <= 30 ? null : 'osoby'; },
            solve: (inp) => { const m = new Map(); const add = (a, b) => { if (!m.has(a)) m.set(a, new Set()); m.get(a).add(b); }; for (const l of linie(inp).slice(1)) { const [a, b] = l.split(' '); add(a, b); add(b, a); } return [...m].sort((a, b) => cmp(a[0], b[0])).map(([o, s]) => `${o} ${s.size}: ${[...s].sort(cmp).join(' ')}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, set<string>> zna;
    for (int i = 0; i < n; i++) {
        string a, b;
        cin >> a >> b;
        zna[a].insert(b);
        zna[b].insert(a);
    }
    for (auto &[osoba, znajomi] : zna) {
        cout << osoba << " " << znajomi.size() << ":";
        for (auto &z : znajomi) cout << " " << z;
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-najlepszy-w-przedmiocie', krok: 4, level: 'trudne',
            title: 'Najlepszy z każdego przedmiotu',
            short: 'Przedmiot → (uczeń → suma punktów): mapa w mapie. Dla każdego przedmiotu znajdź ucznia z największą sumą.',
            tags: ['map<string, map<string, int>>', 'm[a][b] += x', 'rekord w każdej mapie'],
            statement: ['Szkolny konkurs ma kilka przedmiotów, a uczniowie zbierają punkty w wielu rundach. Każdy wpis to: przedmiot, uczeń i punkty z jednej rundy. Dla każdego przedmiotu (alfabetycznie) wypisz ucznia z największą sumą punktów w tym przedmiocie i tę sumę. Przy remisie wygrywa uczeń wcześniejszy alfabetycznie.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: przedmiot, uczeń i liczba punktów.'],
            output_format: ['Po jednym wierszu na przedmiot: przedmiot, uczeń i jego suma.'],
            constraints: ['1 ≤ n ≤ 4000', 'Nazwy przedmiotów: od 1 do 12 małych liter; imiona: od 1 do 10 liter.', '0 ≤ punkty ≤ 100'],
            examples: [{ input: '5\nmatma Ola 40\nfizyka Ola 10\nmatma Bartek 30\nmatma Bartek 15\nfizyka Kuba 10', note: 'Z matematyki Bartek ma 45, Ola 40. Z fizyki Ola i Kuba mają po 10 — wygrywa Kuba, bo jest wcześniej alfabetycznie.' }],
            hint: R`map<string, map<string, int>> punkty; — dla każdego przedmiotu osobna mapa „uczeń → suma”. Wpis to punkty[przedmiot][uczen] += p;. Potem dla każdego przedmiotu przejdź jego wewnętrzną mapę i znajdź rekord z warunkiem > (uczniowie idą alfabetycznie, więc przy remisie zostaje wcześniejszy).`,
            tests: (r) => { const PR = ['matma', 'fizyka', 'chemia', 'polski', 'historia', 'biologia', 'informatyka', 'angielski']; const d = (n, kp, ku) => `${n}\n${Array.from({ length: n }, () => `${r.pick(PR.slice(0, kp))} ${r.pick(kr.slice(0, ku))} ${r.int(0, 100)}`).join('\n')}`; return ['1\nmatma Ola 0', d(5, 2, 3), d(40, 3, 4), d(4000, 8, 40), d(4000, 1, 2)]; },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 4000) && L.length === n + 1 && L.slice(1).every((l) => { const m = l.match(/^[a-z]{1,12} [A-Za-z]{1,10} (\d+)$/); return m && calk(+m[1], 0, 100); }) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const l of linie(inp).slice(1)) { const [p, u, x] = l.split(' '); if (!m.has(p)) m.set(p, new Map()); const w = m.get(p); w.set(u, (w.get(u) || 0) + Number(x)); } return [...m].sort((a, b) => cmp(a[0], b[0])).map(([p, w]) => { let b = null; for (const [u, s] of [...w].sort((x, y) => cmp(x[0], y[0]))) if (!b || s > b[1]) b = [u, s]; return `${p} ${b[0]} ${b[1]}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, map<string, int>> punkty;
    for (int i = 0; i < n; i++) {
        string przedmiot, uczen;
        int p;
        cin >> przedmiot >> uczen >> p;
        punkty[przedmiot][uczen] += p;
    }
    for (auto &[przedmiot, uczniowie] : punkty) {
        string najlepszy;
        int rekord = -1;
        for (auto &[uczen, suma] : uczniowie)
            if (suma > rekord) {
                rekord = suma;
                najlepszy = uczen;
            }
        cout << przedmiot << " " << najlepszy << " " << rekord << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 5 · przechodzenie i iteratory
        {
            id: 'map-skrajne-klucze', krok: 5, level: 'latwe',
            title: 'Najmniejszy i największy klucz',
            short: 'Po wszystkich przypisaniach wypisz parę z najmniejszym kluczem i parę z największym. begin() i rbegin() — bez pętli.',
            tags: ['m.begin()', 'm.rbegin()', 'it->first i it->second'],
            statement: ['Program zapisuje n przypisań „klucz wartość” do mapy (klucze to liczby całkowite, wartości — słowa; późniejsze przypisanie do tego samego klucza zastępuje wcześniejsze). Wypisz parę z najmniejszym kluczem i parę z największym kluczem.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: klucz i słowo.'],
            output_format: ['Dwa wiersze: min: klucz słowo oraz max: klucz słowo.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ klucz ≤ 10⁹; słowa: od 1 do 10 małych liter.'],
            examples: [{ input: '4\n10 kot\n-3 pies\n42 mysz\n-3 sowa', note: 'Klucz −3 dostał najpierw psa, potem sowę. Najmniejszy klucz to −3, największy — 42.' }],
            hint: R`m.begin() to strzałka na pierwszą parę mapy — z najmniejszym kluczem, a m.rbegin() — na ostatnią, z największym. Klucz i wartość odczytasz przez strzałkę: m.begin()->first i m.begin()->second. Nie potrzeba żadnej pętli.`,
            tests: (r) => { const d = (A) => `${A.length}\n${A.map(([a, b]) => `${a} ${b}`).join('\n')}`; const los = (n, M) => d(Array.from({ length: n }, () => [r.int(-M, M), r.word(r.int(1, 10))])); return [d([[0, 'a']]), d([[5, 'x'], [5, 'y']]), los(10, 20), los(5000, 1000000000), los(5000, 3)]; },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); return calk(n, 1, 5000) && L.length === n + 1 && L.slice(1).every((l) => { const m = l.match(/^(-?\d+) [a-z]{1,10}$/); return m && calk(+m[1], -1e9, 1e9); }) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); for (const l of linie(inp).slice(1)) { const [k, w] = l.split(' '); m.set(+k, w); } const K = [...m.keys()].sort((a, b) => a - b); const a = K[0], b = K[K.length - 1]; return `min: ${a} ${m.get(a)}\nmax: ${b} ${m.get(b)}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, string> m;
    for (int i = 0; i < n; i++) {
        int k;
        string w;
        cin >> k >> w;
        m[k] = w;
    }
    cout << "min: " << m.begin()->first << " " << m.begin()->second << "\n";
    cout << "max: " << m.rbegin()->first << " " << m.rbegin()->second << "\n";
    return 0;
}`,
        },
        {
            id: 'map-od-konca-alfabetu', krok: 5, level: 'latwe',
            title: 'Od końca alfabetu',
            short: 'Zlicz słowa i wypisz je w odwrotnej kolejności alfabetycznej. Pętla od rbegin() do rend().',
            tags: ['rbegin() i rend()', 'przechodzenie od końca', 'zliczanie'],
            statement: ['Dostajesz tekst (małe litery i białe znaki). Wypisz każde słowo i liczbę jego wystąpień — w odwrotnej kolejności alfabetycznej, od z do a.'],
            input_format: ['Słowa — do końca danych.'],
            output_format: ['Po jednym wierszu na słowo: słowo i liczba wystąpień — od końca alfabetu.'],
            constraints: ['Słów jest od 1 do 10 000, każde ma od 1 do 12 liter; różnych jest najwyżej 1000.'],
            examples: [{ input: 'ala ma kota a kot ma ale', note: 'Od końca: ma (2), kota, kot, ale, ala, a.' }],
            hint: R`Najpierw zliczanie: licznik[s]++. Potem pętla ze strzałką idącą od końca: for (auto it = licznik.rbegin(); it != licznik.rend(); it++) — rbegin wskazuje ostatnią parę, a rend to miejsce „przed pierwszą”. Klucz to it->first, liczba — it->second.`,
            tests: (r) => { const pula = SLOWA.filter((w) => /^[a-z]{1,12}$/.test(w)); return ['kot', 'b a b a', 'ala ma kota a kot ma ale', rozrzuc(r, Array.from({ length: 60 }, () => r.pick(pula))), rozrzuc(r, Array.from({ length: 6000 }, () => r.pick(pula))), rozrzuc(r, Array.from({ length: 6000 }, () => r.word(r.int(1, 2))))]; },
            check: (inp) => { const t = toks(inp); return t.length >= 1 && t.length <= 10000 && t.every((w) => /^[a-z]{1,12}$/.test(w)) && new Set(t).size <= 1000 ? null : 'słowa'; },
            solve: (inp) => { const m = new Map(); for (const w of toks(inp)) m.set(w, (m.get(w) || 0) + 1); return [...m].sort((a, b) => cmp(b[0], a[0])).map(([w, k]) => `${w} ${k}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<string, int> licznik;
    string s;
    while (cin >> s) licznik[s]++;
    for (auto it = licznik.rbegin(); it != licznik.rend(); it++) cout << it->first << " " << it->second << "\n";
    return 0;
}`,
        },
        {
            id: 'map-cennik-progowy', krok: 5, level: 'srednie',
            title: 'Cennik z progami',
            short: 'Im więcej sztuk, tym niższa cena za sztukę. Dla zamówionej ilości znajdź największy próg nie większy od niej: prev(upper_bound).',
            tags: ['upper_bound po kluczu', 'prev', 'ostatni klucz ≤ x'],
            statement: ['Hurtownia ma cennik z progami: „od a sztuk — c groszy za sztukę”. Dla zamówienia na x sztuk obowiązuje cena z największego progu a, który nie przekracza x. Jeśli x jest mniejsze od najmniejszego progu, hurtownia takiego zamówienia nie przyjmuje.',
                'Dla każdego zamówienia wypisz łączną cenę (x razy cena za sztukę) w formacie złote, kropka i dwie cyfry groszy — albo BRAK.'],
            input_format: ['W pierwszym wierszu k.', 'W każdym z k wierszy: próg a i cena c.', 'Dalej wiersz z q i q wierszy z ilościami x.'],
            output_format: ['q wierszy: cena w formacie Z.GG albo BRAK.'],
            constraints: ['1 ≤ k ≤ 50, 1 ≤ q ≤ 2000', 'Progi: od 1 do 10⁶, różne. Ceny: od 1 do 10⁵ groszy.', '1 ≤ x ≤ 10⁶'],
            examples: [{ input: '3\n10 500\n1 700\n100 350\n4\n5\n10\n250\n99', note: '5 sztuk — próg 1 (7.00 zł za sztukę): 35.00. 10 sztuk — próg 10: 50.00. 250 — próg 100: 875.00. 99 — próg 10: 495.00.' }],
            hint: R`map<int, long long> cena; — próg → cena. cena.upper_bound(x) to pierwszy próg WIĘKSZY od x. Jeśli to begin(), żaden próg nie jest ≤ x — BRAK. Inaczej cofnij się o jeden: auto it = prev(cena.upper_bound(x)); — to największy próg ≤ x, a it->second to cena za sztukę.`,
            tests: (r) => {
                const d = (P0, Q) => `${P0.length}\n${P0.map(([a, b]) => `${a} ${b}`).join('\n')}\n${Q.length}\n${Q.join('\n')}`;
                const los = (k, q, minP) => { const pr = [...new Set([minP, ...losy(r, k * 2, minP, 1000000)])].slice(0, k); const P0 = pr.map((a) => [a, r.int(1, 100000)]); return d(P0, Array.from({ length: q }, () => (r() < 0.3 ? r.pick(pr) + r.int(-1, 1) || 1 : r.int(1, 1000000)))); };
                return [d([[1, 100]], [1]), d([[5, 100]], [4, 5, 6]), d([[10, 500], [1, 700], [100, 350]], [5, 10, 250, 99]), los(5, 20, 3), los(50, 2000, 1), los(50, 2000, 500000)];
            },
            check: (inp) => {
                const L = linie(inp); const k = Number(L[0]); if (!calk(k, 1, 50)) return 'k'; const s = new Set();
                for (const l of L.slice(1, k + 1)) { const [a, c] = l.split(' ').map(Number); if (!calk(a, 1, 1e6) || !calk(c, 1, 1e5) || s.has(a)) return 'próg'; s.add(a); }
                const q = Number(L[k + 1]); return calk(q, 1, 2000) && L.length === k + 2 + q && L.slice(k + 2).every((x) => calk(Number(x), 1, 1e6)) ? null : 'zamówienia';
            },
            solve: (inp) => { const L = linie(inp); const k = Number(L[0]); const P0 = L.slice(1, k + 1).map((l) => l.split(' ').map(Number)).sort((a, b) => a[0] - b[0]); return L.slice(k + 2).map((x0) => { const x = Number(x0); let c = null; for (const [a, cc] of P0) if (a <= x) c = cc; return c === null ? 'BRAK' : P.zlote(x * c); }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    map<int, long long> cena;
    for (int i = 0; i < k; i++) {
        int a;
        long long c;
        cin >> a >> c;
        cena[a] = c;
    }
    int q;
    cin >> q;
    while (q--) {
        long long x;
        cin >> x;
        auto it = cena.upper_bound(x);
        if (it == cena.begin()) {
            cout << "BRAK\n";
            continue;
        }
        it = prev(it);
        long long gr = x * it->second;
        cout << gr / 100 << "." << setfill('0') << setw(2) << gr % 100 << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-podwyzka', krok: 5, level: 'srednie',
            title: 'Podwyżki i premie',
            short: 'Pensje w mapie. Podwyżka dla wszystkich zmienia każdą wartość w pętli — przez referencję: for (auto &[imie, p] : m).',
            tags: ['for (auto &[k, v] : m)', 'zmiana wartości w pętli', 'klucz się nie zmienia'],
            statement: ['Firma ma n pracowników z pensjami (w złotych). Przychodzą polecenia:',
                'WSZYSCY p — każdy dostaje podwyżkę o p procent: nowa pensja = pensja · (100 + p) / 100, zaokrąglona w dół;',
                'PREMIA imie x — ta jedna osoba dostaje x złotych więcej (na stałe).',
                'Wypisz końcowe pensje wszystkich pracowników, alfabetycznie.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: imię i pensja.', 'Dalej wiersz z q i q poleceń.'],
            output_format: ['Po jednym wierszu na pracownika: imię i pensja — alfabetycznie.'],
            constraints: ['1 ≤ n ≤ 300, 1 ≤ q ≤ 200', 'Imiona: od 1 do 10 liter, różne. Pensje na start: od 1000 do 10⁶.', 'Poleceń WSZYSCY jest najwyżej 20, każde z p od 0 do 20; premie: od 1 do 10⁶; premie dostają tylko osoby z listy.'],
            examples: [{ input: '2\nOla 4000\nBartek 3500\n3\nWSZYSCY 10\nPREMIA Ola 100\nWSZYSCY 5', note: 'Po 10%: Ola 4400, Bartek 3850. Ola dostaje 100 — 4500. Po 5%: Ola 4725, Bartek 4042 (4042.5 zaokrąglone w dół).' }],
            hint: R`Pętla for (auto &[imie, p] : pensje) p = p * (100 + proc) / 100; zmienia wartości w samej mapie — dzięki znakowi &. Bez & pętla zmieniałaby tylko kopie. Kluczy w ten sposób zmieniać nie można (i nie trzeba). Pensje w long long.`,
            tests: (r) => {
                const d = (n, q, maxW) => { const im = rozneSlowa(r, n, 1, 10).map(zImienia); let w = 0; const Q = Array.from({ length: q }, () => { if (w < maxW && r() < 0.3) { w++; return `WSZYSCY ${r.int(0, 20)}`; } return `PREMIA ${r.pick(im)} ${r.int(1, 1000000)}`; }); return `${n}\n${im.map((x) => `${x} ${r.int(1000, 1000000)}`).join('\n')}\n${q}\n${Q.join('\n')}`; };
                return ['1\nA 1000\n1\nWSZYSCY 0', '2\nOla 4000\nBartek 3500\n3\nWSZYSCY 10\nPREMIA Ola 100\nWSZYSCY 5', d(5, 10, 3), d(300, 200, 20), d(3, 200, 0)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 300)) return 'n'; const s = new Set();
                for (const l of L.slice(1, n + 1)) { const m = l.match(/^([A-Za-z]{1,10}) (\d+)$/); if (!m || s.has(m[1]) || !calk(+m[2], 1000, 1e6)) return 'pracownik'; s.add(m[1]); }
                const q = Number(L[n + 1]); if (!calk(q, 1, 200) || L.length !== n + 2 + q) return 'q'; let w = 0;
                for (const l of L.slice(n + 2)) { let m = l.match(/^WSZYSCY (\d+)$/); if (m) { w++; if (!calk(+m[1], 0, 20)) return 'p'; continue; } m = l.match(/^PREMIA ([A-Za-z]{1,10}) (\d+)$/); if (!m || !s.has(m[1]) || !calk(+m[2], 1, 1e6)) return 'premia'; }
                return w <= 20 ? null : 'WSZYSCY';
            },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const m = new Map(L.slice(1, n + 1).map((l) => { const [a, b] = l.split(' '); return [a, BigInt(b)]; })); for (const l of L.slice(n + 2)) { const t = l.split(' '); if (t[0] === 'WSZYSCY') { const p = BigInt(t[1]); for (const [k, v] of m) m.set(k, (v * (100n + p)) / 100n); } else m.set(t[1], m.get(t[1]) + BigInt(t[2])); } return [...m].sort((a, b) => cmp(a[0], b[0])).map(([k, v]) => `${k} ${v}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, long long> pensje;
    for (int i = 0; i < n; i++) {
        string imie;
        long long p;
        cin >> imie >> p;
        pensje[imie] = p;
    }
    int q;
    cin >> q;
    while (q--) {
        string polecenie;
        cin >> polecenie;
        if (polecenie == "WSZYSCY") {
            long long proc;
            cin >> proc;
            for (auto &[imie, p] : pensje) p = p * (100 + proc) / 100;
        } else {
            string imie;
            long long x;
            cin >> imie >> x;
            pensje[imie] += x;
        }
    }
    for (auto [imie, p] : pensje) cout << imie << " " << p << "\n";
    return 0;
}`,
        },
        {
            id: 'map-czystka', krok: 5, level: 'srednie',
            title: 'Czystka w słowniku',
            short: 'Zlicz słowa, a potem usuń z mapy te, które wystąpiły mniej niż k razy — w trakcie przechodzenia: it = m.erase(it).',
            tags: ['usuwanie w pętli', 'it = m.erase(it)', 'pętla ze strzałką'],
            statement: ['Dostajesz liczbę k, a potem tekst. Zlicz słowa, a następnie usuń ze słownika wszystkie słowa, które wystąpiły mniej niż k razy. Wypisz słowa, które zostały, alfabetycznie, z liczbą wystąpień — albo PUSTO, jeśli nie zostało żadne.'],
            input_format: ['W pierwszym wierszu k.', 'Dalej słowa — do końca danych.'],
            output_format: ['Wiersze: słowo i liczba wystąpień — alfabetycznie — albo PUSTO.'],
            constraints: ['1 ≤ k ≤ 100', 'Słów jest od 1 do 10 000, każde ma od 1 do 12 małych liter; różnych jest najwyżej 1000.'],
            examples: [{ input: '2\nala ma kota a kot ma ale ala', note: 'Co najmniej dwa razy wystąpiły tylko ala i ma.' }],
            hint: R`Usuwanie podczas przechodzenia wymaga ostrożności: po erase strzałka na usunięty element jest nieważna. Dlatego: for (auto it = m.begin(); it != m.end(); ) { if (it->second < k) it = m.erase(it); else it++; } — erase zwraca strzałkę na następny element. (Możesz też zebrać słowa do usunięcia w vectorze i usunąć je po pętli.)`,
            tests: (r) => { const pula = SLOWA.filter((w) => /^[a-z]{1,12}$/.test(w)); const d = (k, n) => `${k}\n${rozrzuc(r, Array.from({ length: n }, () => r.pick(pula)))}`; return ['1\nkot', '5\nkot kot', '2\nala ma kota a kot ma ale ala', d(3, 60), d(100, 10000), d(1, 500)]; },
            check: (inp) => { const t = toks(inp); const k = Number(t[0]); const w = t.slice(1); return calk(k, 1, 100) && w.length >= 1 && w.length <= 10000 && w.every((x) => /^[a-z]{1,12}$/.test(x)) && new Set(w).size <= 1000 ? null : 'dane'; },
            solve: (inp) => { const t = toks(inp); const k = Number(t[0]); const m = new Map(); for (const w of t.slice(1)) m.set(w, (m.get(w) || 0) + 1); const L = [...m].filter(([, c]) => c >= k).sort((a, b) => cmp(a[0], b[0])); return L.length ? L.map(([w, c]) => `${w} ${c}`).join('\n') : 'PUSTO'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    map<string, int> m;
    string s;
    while (cin >> s) m[s]++;
    for (auto it = m.begin(); it != m.end();) {
        if (it->second < k) it = m.erase(it);
        else it++;
    }
    if (m.empty()) cout << "PUSTO\n";
    for (auto [slowo, ile] : m) cout << slowo << " " << ile << "\n";
    return 0;
}`,
        },
        {
            id: 'map-najblizsza-stacja', krok: 5, level: 'srednie',
            title: 'Najbliższa stacja',
            short: 'Kilometr → nazwa stacji. Dla kilometra z pytania sprawdź dwóch kandydatów: lower_bound i element tuż przed nim.',
            tags: ['lower_bound po kluczu', 'prev', 'najbliższy klucz'],
            statement: ['Wzdłuż autostrady stoi n stacji benzynowych, każda na innym kilometrze. Kierowca pyta q razy: która stacja jest najbliżej kilometra x? Wypisz jej nazwę i odległość. Gdy dwie stacje są równie blisko, wybierz tę na mniejszym kilometrze.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: kilometr i nazwa stacji.', 'Dalej wiersz z q i q wierszy z kilometrami.'],
            output_format: ['q wierszy: nazwa najbliższej stacji i odległość.'],
            constraints: ['1 ≤ n ≤ 1000, 1 ≤ q ≤ 1200', 'Kilometry: od 0 do 10⁹ (stacji — różne). Nazwy: od 1 do 12 liter.'],
            examples: [{ input: '3\n10 Orlik\n50 Bocian\n30 Jastrzab\n3\n12\n40\n100', note: 'Kilometr 40 jest w połowie między stacjami na 30 i 50 — wygrywa ta na mniejszym kilometrze, Jastrzab.' }],
            hint: R`auto it = stacje.lower_bound(x); to pierwsza stacja na kilometrze ≥ x. Kandydaci są dwaj: it (jeśli nie jest end()) i prev(it) (jeśli it nie jest begin()). Policz obie odległości i wybierz mniejszą; przy remisie — tę z prev, bo stoi na mniejszym kilometrze.`,
            tests: (r) => {
                const d = (n, q, M) => { const km = [...new Set(losy(r, n * 2, 0, M))].slice(0, n); return `${km.length}\n${km.map((k) => `${k} ${zImienia(r.word(r.int(1, 12)))}`).join('\n')}\n${q}\n${Array.from({ length: q }, () => (r() < 0.2 ? r.pick(km) : r.int(0, M))).join('\n')}`; };
                return ['1\n5 A\n2\n0\n1000000000', '3\n10 Orlik\n50 Bocian\n30 Jastrzab\n3\n12\n40\n100', d(5, 20, 100), d(1000, 1200, 1000000000), d(2, 1200, 10)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1000)) return 'n'; const s = new Set();
                for (const l of L.slice(1, n + 1)) { const m = l.match(/^(\d+) [A-Za-z]{1,12}$/); if (!m || !calk(+m[1], 0, 1e9) || s.has(+m[1])) return 'stacja'; s.add(+m[1]); }
                const q = Number(L[n + 1]); return calk(q, 1, 1200) && L.length === n + 2 + q && L.slice(n + 2).every((x) => calk(Number(x), 0, 1e9)) ? null : 'pytania';
            },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const S = L.slice(1, n + 1).map((l) => { const [k, nz] = l.split(' '); return [+k, nz]; }).sort((a, b) => a[0] - b[0]); return L.slice(n + 2).map((x0) => { const x = +x0; let b = null; for (const [k, nz] of S) { const d = Math.abs(k - x); if (!b || d < b[1]) b = [nz, d]; } return `${b[0]} ${b[1]}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<long long, string> stacje;
    for (int i = 0; i < n; i++) {
        long long km;
        string nazwa;
        cin >> km >> nazwa;
        stacje[km] = nazwa;
    }
    int q;
    cin >> q;
    while (q--) {
        long long x;
        cin >> x;
        auto it = stacje.lower_bound(x);
        string nazwa;
        long long d = -1;
        if (it != stacje.begin()) {
            auto p = prev(it);
            nazwa = p->second;
            d = x - p->first;
        }
        if (it != stacje.end() && (d == -1 || it->first - x < d)) {
            nazwa = it->second;
            d = it->first - x;
        }
        cout << nazwa << " " << d << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-kolejne-od-x', krok: 5, level: 'srednie',
            title: 'Kolejka po numerkach',
            short: 'Numerek → imię. Na pytanie „x k” wypisz k osób z najmniejszymi numerkami nie mniejszymi od x: lower_bound i kilka kroków strzałką.',
            tags: ['lower_bound', 'it++ po mapie', 'najwyżej k elementów'],
            statement: ['W urzędzie każdy klient ma numerek; numerki nie muszą być kolejne. Urzędnik pyta q razy: kto czeka z numerkami od x w górę? Wypisz imiona co najwyżej k klientów z najmniejszymi numerkami ≥ x, w kolejności numerków, oddzielone spacjami — albo BRAK, jeśli takich klientów nie ma.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n wierszy: numerek i imię.', 'Dalej wiersz z q i q wierszy z liczbami x i k.'],
            output_format: ['q wierszy z imionami albo BRAK.'],
            constraints: ['1 ≤ n ≤ 3000, 1 ≤ q ≤ 400', 'Numerki: od 1 do 10⁶, różne. Imiona: od 1 do 10 liter.', '1 ≤ x ≤ 10⁶, 1 ≤ k ≤ 5'],
            examples: [{ input: '4\n17 Ola\n3 Bartek\n25 Kuba\n18 Iga\n3\n10 2\n18 5\n26 1', note: 'Od numerka 10: 17 (Ola) i 18 (Iga). Od 18: Iga i Kuba — więcej nie ma. Od 26 — nikt.' }],
            hint: R`auto it = kolejka.lower_bound(x); wskazuje pierwszego klienta z numerkiem ≥ x. Potem zwykła pętla: dopóki it != kolejka.end() i wypisałeś mniej niż k osób — wypisz it->second i przesuń strzałkę: it++.`,
            tests: (r) => {
                const d = (n, q) => { const nr = [...new Set(losy(r, n * 2, 1, 1000000))].slice(0, n); return `${nr.length}\n${nr.map((x) => `${x} ${r.pick(kr)}`).join('\n')}\n${q}\n${Array.from({ length: q }, () => `${r() < 0.3 ? r.pick(nr) : r.int(1, 1000000)} ${r.int(1, 5)}`).join('\n')}`; };
                return ['1\n5 A\n2\n5 1\n6 1', '4\n17 Ola\n3 Bartek\n25 Kuba\n18 Iga\n3\n10 2\n18 5\n26 1', d(10, 20), d(3000, 400), d(3, 400)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 3000)) return 'n'; const s = new Set();
                for (const l of L.slice(1, n + 1)) { const m = l.match(/^(\d+) [A-Za-z]{1,10}$/); if (!m || !calk(+m[1], 1, 1e6) || s.has(+m[1])) return 'klient'; s.add(+m[1]); }
                const q = Number(L[n + 1]); return calk(q, 1, 400) && L.length === n + 2 + q && L.slice(n + 2).every((l) => { const [x, k] = l.split(' ').map(Number); return calk(x, 1, 1e6) && calk(k, 1, 5); }) ? null : 'pytania';
            },
            solve: (inp) => { const L = linie(inp); const n = Number(L[0]); const S = L.slice(1, n + 1).map((l) => { const [k, i] = l.split(' '); return [+k, i]; }).sort((a, b) => a[0] - b[0]); return L.slice(n + 2).map((l) => { const [x, k] = l.split(' ').map(Number); const w = S.filter((p) => p[0] >= x).slice(0, k).map((p) => p[1]); return w.length ? w.join(' ') : 'BRAK'; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, string> kolejka;
    for (int i = 0; i < n; i++) {
        int nr;
        string imie;
        cin >> nr >> imie;
        kolejka[nr] = imie;
    }
    int q;
    cin >> q;
    while (q--) {
        int x, k;
        cin >> x >> k;
        auto it = kolejka.lower_bound(x);
        if (it == kolejka.end()) {
            cout << "BRAK\n";
            continue;
        }
        int wypisane = 0;
        while (it != kolejka.end() && wypisane < k) {
            cout << (wypisane ? " " : "") << it->second;
            wypisane++;
            it++;
        }
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-progi-ocen', krok: 5, level: 'trudne',
            title: 'Progi ocen',
            short: 'Próg punktowy → ocena. Dla każdego ucznia: jaka ocena i ile punktów brakuje do następnej. upper_bound robi obie rzeczy naraz.',
            tags: ['upper_bound', 'prev(it) i it', 'następny próg'],
            statement: ['Nauczyciel ustalił progi: „od a punktów — ocena o”. Najniższy próg to zawsze 0. Uczeń dostaje ocenę z największego progu, który nie przekracza jego punktów.',
                'Dla każdego ucznia (w kolejności z wejścia) wypisz imię, ocenę i liczbę punktów brakujących do następnego progu — albo słowo max, jeśli uczeń jest już w najwyższym progu.'],
            input_format: ['W pierwszym wierszu k.', 'W każdym z k wierszy: próg a i ocena o.', 'Dalej wiersz z n i n wierszy: imię i liczba punktów.'],
            output_format: ['n wierszy: imię, ocena i brakujące punkty albo max.'],
            constraints: ['1 ≤ k ≤ 10, 1 ≤ n ≤ 1000', 'Progi: od 0 do 100, różne, jeden z nich to 0. Oceny: od 1 do 6.', 'Imiona: od 1 do 10 liter. Punkty: od 0 do 100.'],
            examples: [{ input: '4\n0 1\n50 3\n70 4\n90 6\n3\nOla 69\nBartek 90\nKuba 12', note: 'Ola ma 69 punktów — próg 50, ocena 3, do progu 70 brakuje 1. Bartek jest w najwyższym progu. Kubie do progu 50 brakuje 38.' }],
            hint: R`map<int, int> prog; — próg → ocena. auto it = prog.upper_bound(p); to pierwszy próg WIĘKSZY od p. Ocena to prev(it)->second (próg 0 gwarantuje, że prev istnieje). Jeśli it == prog.end() — uczeń ma max, inaczej brakuje mu it->first − p punktów.`,
            tests: (r) => {
                const d = (P0, U) => `${P0.length}\n${P0.map(([a, b]) => `${a} ${b}`).join('\n')}\n${U.length}\n${U.map(([a, b]) => `${a} ${b}`).join('\n')}`;
                const los = (k, n) => { const pr = [0, ...[...new Set(losy(r, k * 3, 1, 100))].slice(0, k - 1)]; return d(r.shuffle(pr).map((a) => [a, r.int(1, 6)]), Array.from({ length: n }, () => [r.pick(kr), r() < 0.3 ? r.pick(pr) : r.int(0, 100)])); };
                return [d([[0, 1]], [['Ola', 0]]), d([[0, 1], [50, 3], [70, 4], [90, 6]], [['Ola', 69], ['Bartek', 90], ['Kuba', 12]]), los(4, 20), los(10, 1000), los(2, 1000)];
            },
            check: (inp) => {
                const L = linie(inp); const k = Number(L[0]); if (!calk(k, 1, 10)) return 'k'; const s = new Set();
                for (const l of L.slice(1, k + 1)) { const [a, o] = l.split(' ').map(Number); if (!calk(a, 0, 100) || !calk(o, 1, 6) || s.has(a)) return 'próg'; s.add(a); }
                if (!s.has(0)) return 'zero'; const n = Number(L[k + 1]); return calk(n, 1, 1000) && L.length === k + 2 + n && L.slice(k + 2).every((l) => { const m = l.match(/^[A-Za-z]{1,10} (\d+)$/); return m && calk(+m[1], 0, 100); }) ? null : 'uczniowie';
            },
            solve: (inp) => { const L = linie(inp); const k = Number(L[0]); const P0 = L.slice(1, k + 1).map((l) => l.split(' ').map(Number)).sort((a, b) => a[0] - b[0]); return L.slice(k + 2).map((l) => { const [i, p0] = l.split(' '); const p = +p0; let o = null, nast = null; for (const [a, oc] of P0) { if (a <= p) o = oc; else if (nast === null) nast = a; } return `${i} ${o} ${nast === null ? 'max' : nast - p}`; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int k;
    cin >> k;
    map<int, int> prog;
    for (int i = 0; i < k; i++) {
        int a, o;
        cin >> a >> o;
        prog[a] = o;
    }
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        string imie;
        int p;
        cin >> imie >> p;
        auto it = prog.upper_bound(p);
        cout << imie << " " << prev(it)->second << " ";
        if (it == prog.end()) cout << "max\n";
        else cout << it->first - p << "\n";
    }
    return 0;
}`,
        },
        // ================================================================ KROK 6 · mapa jako pamięć
        {
            id: 'map-numeracja-imion', krok: 6, level: 'latwe',
            title: 'Numery dla imion',
            short: 'Każde nowe imię dostaje kolejny numer: 1, 2, 3… Powtórzone imię — ten sam numer co wcześniej. Mapa imię → numer.',
            tags: ['numeracja nowych kluczy', 'id = m.size() + 1', 'count przed nadaniem'],
            statement: ['Szatnia wydaje numerki: każda osoba, która przychodzi pierwszy raz, dostaje kolejny wolny numer (1, 2, 3…), a osoba, która już była, dostaje ten sam numer co poprzednio. Dostajesz listę n imion w kolejności przychodzenia. Wypisz numer każdej osoby, a w drugim wierszu — ile różnych osób przyszło.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n imion.'],
            output_format: ['W pierwszym wierszu n numerów oddzielonych spacjami.', 'W drugim wierszu liczba różnych osób.'],
            constraints: ['1 ≤ n ≤ 5000', 'Imiona: od 1 do 12 liter.'],
            examples: [{ input: '6\nOla Bartek Ola Kuba Bartek Iga', note: 'Ola dostaje 1, Bartek 2, Kuba 3, Iga 4. Powtórzone osoby dostają swoje stare numery.' }],
            hint: R`map<string, int> numer;. Dla imienia, którego jeszcze nie ma (numer.count(imie) == 0), nadaj numer[imie] = numer.size() + 1; — rozmiar mapy to liczba osób, które już mają numery. Potem wypisz numer[imie].`,
            tests: (r) => { const d = (a) => `${a.length}\n${a.join(' ')}`; return [d(['Ola']), d(['A', 'A', 'B', 'A']), d(Array.from({ length: 30 }, () => r.pick(kr.slice(0, 8)))), d(Array.from({ length: 5000 }, () => r.pick(IMIONA))), d(rozneSlowa(r, 5000, 5, 12).map(zImienia))]; },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 5000) && t.length === n + 1 && t.slice(1).every((w) => /^[A-Za-z]{1,12}$/.test(w)) ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); const o = toks(inp).slice(1).map((w) => { if (!m.has(w)) m.set(w, m.size + 1); return m.get(w); }); return `${o.join(' ')}\n${m.size}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, int> numer;
    for (int i = 0; i < n; i++) {
        string imie;
        cin >> imie;
        if (numer.count(imie) == 0) {
            int nowy = numer.size() + 1;
            numer[imie] = nowy;
        }
        cout << numer[imie] << " ";
    }
    cout << "\n" << numer.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'map-kompresja', krok: 6, level: 'srednie',
            title: 'Miejsca zamiast wartości',
            short: 'Zamień każdą liczbę na jej miejsce wśród różnych wartości: najmniejsza → 1, następna → 2… Mapa zbiera wartości i sama je sortuje.',
            tags: ['kompresja wartości', 'numerowanie kluczy po kolei', 'mapa wartość → miejsce'],
            statement: ['Dostajesz n liczb (mogą być ogromne i się powtarzać). Zamień każdą liczbę na jej miejsce wśród różnych wartości: najmniejsza różna wartość dostaje 1, następna 2 i tak dalej; równe liczby dostają to samo miejsce. Taka zamiana to kompresja wartości — przydaje się, gdy liczby są za duże na indeksy tablicy.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n miejsc oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 4000', '−10¹⁸ ≤ każda liczba ≤ 10¹⁸'],
            examples: [{ input: '6\n1000000000000 -5 7 -5 7 0', note: 'Różne wartości rosnąco: −5, 0, 7, 10¹². Dostają miejsca 1, 2, 3, 4.' }],
            hint: R`Najpierw wstaw wszystkie liczby jako klucze: miejsce[x] = 0;. Potem przejdź mapę — klucze idą rosnąco — i nadawaj kolejne numery: int nr = 0; for (auto &[x, m] : miejsce) m = ++nr;. Na koniec dla każdej liczby wejścia wypisz miejsce[x] (liczby trzeba więc zapamiętać w vectorze).`,
            tests: (r) => { const big = () => String(r.big(-1000000000000000000n, 1000000000000000000n)); const d = (a) => `${a.length}\n${a.join(' ')}`; return [d(['5']), d(['3', '3', '3']), d(['1000000000000', '-5', '7', '-5', '7', '0']), d(losy(r, 30, -5, 5)), d(Array.from({ length: 4000 }, big)), (() => { const p = Array.from({ length: 50 }, big); return d(Array.from({ length: 4000 }, () => r.pick(p))); })()]; },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 4000) && t.length === n + 1 && t.slice(1).every((x) => czyLiczba(x) && BigInt(x) >= -(10n ** 18n) && BigInt(x) <= 10n ** 18n) ? null : 'dane'; },
            solve: (inp) => { const a = toks(inp).slice(1).map(BigInt); const u = [...new Set(a.map(String))].map(BigInt).sort((x, y) => (x < y ? -1 : x > y ? 1 : 0)); const m = new Map(u.map((x, i) => [String(x), i + 1])); return a.map((x) => m.get(String(x))).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    map<long long, int> miejsce;
    for (auto &x : a) {
        cin >> x;
        miejsce[x] = 0;
    }
    int nr = 0;
    for (auto &[x, m] : miejsce) m = ++nr;
    for (int i = 0; i < n; i++) cout << miejsce[a[i]] << (i + 1 < n ? " " : "\n");
    return 0;
}`,
        },
        {
            id: 'map-ile-par-o-sumie', krok: 6, level: 'srednie',
            title: 'Ile par ma sumę k?',
            short: 'Policz pary i < j z sumą k. Idąc od lewej, dla każdej liczby x dolicz, ile razy widziałeś już k − x. Jedno przejście zamiast dwóch pętli.',
            tags: ['zliczanie w locie', 'ile[k − x]', 'long long'],
            statement: ['Dostajesz n liczb i liczbę k. Policz, ile jest par pozycji (i, j), i < j, takich że a[i] + a[j] = k.'],
            input_format: ['W pierwszym wierszu n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 8000', '−2 · 10⁹ ≤ k ≤ 2 · 10⁹', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6 6\n1 5 3 3 5 3', note: 'Pary (1, 5): pozycje 1–2 i 1–5. Pary (3, 3): trzy trójki dają 3 pary. Razem 5.' }],
            hint: R`Przechodź liczby od lewej i trzymaj map<long long, long long> ile; — ile razy każda wartość wystąpiła wcześniej. Dla liczby x wszystkie pasujące do niej wcześniejsze liczby to k − x, więc wynik += ile[k − x], a dopiero potem ile[x]++. Kolejność ma znaczenie: inaczej x sparowałby się sam ze sobą. Wynik może mieć 3 · 10⁷ — long long.`,
            tests: (r) => { const d = (k, a) => `${a.length} ${k}\n${a.join(' ')}`; return [d(5, [5]), d(2, [1, 1, 1, 1]), d(6, [1, 5, 3, 3, 5, 3]), d(10, losy(r, 40, 0, 10)), d(0, losy(r, 8000, -5, 5)), d(2000000000, Array(8000).fill(1000000000)), d(123, losy(r, 8000, -1000000000, 1000000000))]; },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 8000) && calk(k, -2e9, 2e9) && t.length === n + 2 && t.slice(2).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const k = t[1]; const m = new Map(); let w = 0; for (const x of t.slice(2)) { w += m.get(k - x) || 0; m.set(x, (m.get(x) || 0) + 1); } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    map<long long, long long> ile;
    long long pary = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        if (ile.count(k - x)) pary += ile[k - x];
        ile[x]++;
    }
    cout << pary << "\n";
    return 0;
}`,
        },
        {
            id: 'map-najdluzszy-o-sumie', krok: 6, level: 'trudne',
            title: 'Najdłuższy fragment o sumie k',
            short: 'Suma fragmentu to różnica dwóch sum prefiksowych. Zapamiętaj w mapie, gdzie pierwszy raz pojawiła się każda suma prefiksowa.',
            tags: ['sumy prefiksowe', 'pierwsze wystąpienie sumy', 'p − k w mapie'],
            statement: ['Dostajesz n liczb (także ujemnych) i liczbę k. Znajdź najdłuższy spójny fragment, którego suma wynosi dokładnie k, i wypisz jego długość — albo 0, jeśli takiego fragmentu nie ma.'],
            input_format: ['W pierwszym wierszu n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — długość najdłuższego fragmentu o sumie k (albo 0).'],
            constraints: ['1 ≤ n ≤ 8000', '−10⁹ ≤ k ≤ 10⁹', '−10⁴ ≤ każda liczba ≤ 10⁴'],
            examples: [{ input: '7 5\n2 3 -4 4 1 0 -3', note: 'Sumę 5 mają fragmenty 2 3, 4 1, 4 1 0 oraz 2 3 −4 4. Najdłuższy z nich, 2 3 −4 4, ma długość 4.' }],
            hint: R`Niech p to suma prefiksowa do pozycji i. Fragment kończący się na i ma sumę k, gdy wcześniej wystąpiła suma prefiksowa p − k. Żeby fragment był najdłuższy, zapamiętuj w mapie PIERWSZĄ pozycję każdej sumy prefiksowej (pierwsza[0] = 0 przed startem!). Dla każdej pozycji: jeśli pierwsza.count(p − k), długość to i − pierwsza[p − k].`,
            tests: (r) => { const d = (k, a) => `${a.length} ${k}\n${a.join(' ')}`; return [d(5, [5]), d(5, [4]), d(0, [1, -1, 1, -1]), d(5, [2, 3, -4, 4, 1, 0, -3]), d(7, losy(r, 40, -5, 5)), d(100, losy(r, 8000, -50, 50)), d(-30000, losy(r, 8000, -10000, 10000)), d(1000000000, losy(r, 8000, 0, 10000))]; },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 8000) && calk(k, -1e9, 1e9) && t.length === n + 2 && t.slice(2).every((x) => calk(x, -1e4, 1e4)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const k = t[1]; const m = new Map([[0, 0]]); let p = 0, b = 0; t.slice(2).forEach((x, i) => { p += x; if (m.has(p - k)) b = Math.max(b, i + 1 - m.get(p - k)); if (!m.has(p)) m.set(p, i + 1); }); return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    map<long long, int> pierwsza;
    pierwsza[0] = 0;
    long long p = 0;
    int najlepsza = 0;
    for (int i = 1; i <= n; i++) {
        long long x;
        cin >> x;
        p += x;
        if (pierwsza.count(p - k)) najlepsza = max(najlepsza, i - pierwsza[p - k]);
        if (pierwsza.count(p) == 0) pierwsza[p] = i;
    }
    cout << najlepsza << "\n";
    return 0;
}`,
        },
        {
            id: 'map-rownowaga-liter', krok: 6, level: 'srednie',
            title: 'Tyle samo a i b',
            short: 'Najdłuższy fragment napisu, w którym jest tyle samo liter a co b. Licznik równowagi +1 / −1 i pierwsze wystąpienie każdej wartości.',
            tags: ['równowaga +1 / −1', 'pierwsze wystąpienie w mapie', 'długość fragmentu'],
            statement: ['Dostajesz napis z liter a i b. Znajdź najdłuższy spójny fragment, w którym liter a jest dokładnie tyle samo co liter b, i wypisz jego długość (0, jeśli takiego fragmentu nie ma).'],
            input_format: ['Jeden wiersz — napis.'],
            output_format: ['Jedna liczba — długość najdłuższego zrównoważonego fragmentu.'],
            constraints: ['Napis ma od 1 do 90 000 liter a i b.'],
            examples: [{ input: 'aabbbaab', note: 'Cały napis ma 4 litery a i 4 litery b — długość 8.' }],
            hint: R`Idź po napisie i trzymaj równowagę: +1 za a, −1 za b. Fragment od pozycji i + 1 do j jest zrównoważony, gdy równowaga po i i po j jest taka sama. Zapamiętuj w mapie pierwszą pozycję każdej wartości równowagi (z wartością 0 na pozycji 0) — to dokładnie ta sama sztuczka co z sumami prefiksowymi.`,
            tests: (r) => ['a', 'ab', 'aaaa', 'aabbbaab', r.word(40, 'ab'), r.word(90000, 'ab'), 'a'.repeat(45000) + 'b'.repeat(45000), r.word(90000, 'aaab')],
            check: (inp) => (/^[ab]{1,90000}$/.test(inp) ? null : 'napis'),
            solve: (inp) => { const m = new Map([[0, 0]]); let b = 0, best = 0; [...inp].forEach((c, i) => { b += c === 'a' ? 1 : -1; if (m.has(b)) best = Math.max(best, i + 1 - m.get(b)); else m.set(b, i + 1); }); return String(best); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s;
    cin >> s;
    map<int, int> pierwsza;
    pierwsza[0] = 0;
    int r = 0, najlepsza = 0;
    for (int i = 1; i <= (int)s.size(); i++) {
        r += (s[i - 1] == 'a' ? 1 : -1);
        if (pierwsza.count(r)) najlepsza = max(najlepsza, i - pierwsza[r]);
        else pierwsza[r] = i;
    }
    cout << najlepsza << "\n";
    return 0;
}`,
        },
        {
            id: 'map-poprzednie-wystapienie', krok: 6, level: 'srednie',
            title: 'Jak dawno to było?',
            short: 'Dla każdej liczby wypisz, ile pozycji temu wystąpiła poprzednio (albo 0). Mapa trzyma ostatnią pozycję każdej wartości.',
            tags: ['wartość → ostatnia pozycja', 'najpierw odczyt, potem zapis', 'wynik dla każdego elementu'],
            statement: ['Dostajesz n liczb. Dla każdej liczby wypisz, ile pozycji wcześniej wystąpiła poprzednio ta sama wartość (różnicę pozycji), albo 0, jeśli wcześniej jej nie było.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb oddzielonych spacjami.'],
            constraints: ['1 ≤ n ≤ 5000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n4 9 4 4 1 9 1', note: 'Trzecia liczba (4) wystąpiła poprzednio 2 pozycje wcześniej, czwarta (4) — 1 pozycję wcześniej, szósta (9) — 4 pozycje wcześniej.' }],
            hint: R`map<int, int> ostatnia;. Dla liczby x na pozycji i: najpierw odpowiedź — i − ostatnia[x], jeśli ostatnia.count(x), inaczej 0 — a dopiero potem ostatnia[x] = i. W odwrotnej kolejności każda liczba widziałaby samą siebie.`,
            tests: (r) => { const d = (a) => `${a.length}\n${a.join(' ')}`; return [d([1]), d([2, 2, 2]), d([4, 9, 4, 4, 1, 9, 1]), d(losy(r, 30, 0, 5)), d(losy(r, 5000, -1000000000, 1000000000)), d(losy(r, 5000, 1, 40))]; },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 5000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, -1e9, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const m = new Map(); return a.map((x, i) => { const w = m.has(x) ? i - m.get(x) : 0; m.set(x, i); return w; }).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, int> ostatnia;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        if (ostatnia.count(x)) cout << i - ostatnia[x];
        else cout << 0;
        cout << (i + 1 < n ? " " : "\n");
        ostatnia[x] = i;
    }
    return 0;
}`,
        },
        {
            id: 'map-najkrotsze-okno', krok: 6, level: 'trudne',
            title: 'Najkrótszy fragment ze wszystkim',
            short: 'Znajdź najkrótszy fragment, w którym występuje każda wartość z całego ciągu. Dwa wskaźniki i mapa liczników z usuwaniem zer.',
            tags: ['dwa wskaźniki', 'mapa liczników w oknie', 'erase, gdy licznik spada do 0'],
            statement: ['Kolekcjoner ma n naklejek w rzędzie; na każdej jest numer wzoru. Chce wyciąć jeden spójny kawałek rzędu, w którym znajdzie się co najmniej jedna naklejka każdego wzoru, jaki występuje w całym rzędzie. Jaka jest najmniejsza długość takiego kawałka?'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n numerów wzorów.'],
            output_format: ['Jedna liczba — najmniejsza długość kawałka.'],
            constraints: ['1 ≤ n ≤ 8000', 'Numery wzorów: od 1 do 10⁹; różnych wzorów jest najwyżej 200.'],
            examples: [{ input: '8\n5 1 5 7 5 1 7 7', note: 'Wzory to 1, 5 i 7. Kawałek 1 5 7 (pozycje 2–4) zawiera wszystkie trzy i ma długość 3.' }],
            hint: R`Najpierw policz różne wzory: set albo mapa. Potem dwa wskaźniki: prawy koniec idzie po kolei i dokłada naklejkę do map<int, int> w_oknie. Dopóki okno ma wszystkie wzory (w_oknie.size() == ile_wzorow), zapisz długość i przesuń lewy koniec: zmniejsz licznik, a gdy spadnie do 0 — erase, żeby size() mówił prawdę.`,
            tests: (r) => { const d = (a) => `${a.length}\n${a.join(' ')}`; const zP = (n, k) => { const p = [...new Set(losy(r, k * 3, 1, 1000000000))].slice(0, k); return d(Array.from({ length: n }, () => r.pick(p))); }; return [d([7]), d([1, 2, 1]), d([5, 1, 5, 7, 5, 1, 7, 7]), zP(30, 4), zP(8000, 200), zP(8000, 3), d([...Array(4000).fill(1), 2, ...Array(3999).fill(1)])]; },
            check: (inp) => { const t = nums(inp); return calk(t[0], 1, 8000) && t.length === t[0] + 1 && t.slice(1).every((x) => calk(x, 1, 1e9)) && new Set(t.slice(1)).size <= 200 ? null : 'dane'; },
            solve: (inp) => { const a = nums(inp).slice(1); const K = new Set(a).size; const m = new Map(); let l = 0, b = a.length; for (let r0 = 0; r0 < a.length; r0++) { m.set(a[r0], (m.get(a[r0]) || 0) + 1); while (m.size === K) { b = Math.min(b, r0 - l + 1); const c = m.get(a[l]) - 1; if (c === 0) m.delete(a[l]); else m.set(a[l], c); l++; } } return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    set<int> wzory;
    for (int &x : a) {
        cin >> x;
        wzory.insert(x);
    }
    int k = wzory.size(), lewy = 0, najkrotszy = n;
    map<int, int> w_oknie;
    for (int prawy = 0; prawy < n; prawy++) {
        w_oknie[a[prawy]]++;
        while ((int)w_oknie.size() == k) {
            najkrotszy = min(najkrotszy, prawy - lewy + 1);
            w_oknie[a[lewy]]--;
            if (w_oknie[a[lewy]] == 0) w_oknie.erase(a[lewy]);
            lewy++;
        }
    }
    cout << najkrotszy << "\n";
    return 0;
}`,
        },
        {
            id: 'map-zmiany-nickow', krok: 6, level: 'trudne',
            title: 'Zmiany nicków',
            short: 'Gracze zmieniają nicki, czasem wiele razy. Kto był kim na początku? Mapa „obecny nick → pierwszy nick” poprawiana przy każdej zmianie.',
            tags: ['mapa obecny → pierwotny', 'erase starego klucza', 'sortowanie wyniku'],
            statement: ['Na serwerze gry gracze zmieniają nicki. Każda zmiana to para „stary nowy”: gracz, który teraz nazywa się stary, od tej chwili nazywa się nowy. Nowy nick nigdy wcześniej nie był używany przez nikogo.',
                'Po wszystkich zmianach wypisz, ilu graczy zmieniło nick choć raz, a potem dla każdego z nich jego pierwszy nick i ostatni nick — w kolejności alfabetycznej pierwszych nicków.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q wierszy dwa nicki: stary i nowy.'],
            output_format: ['W pierwszym wierszu liczba graczy.', 'Potem po jednym wierszu: pierwszy nick i ostatni nick.'],
            constraints: ['1 ≤ q ≤ 800', 'Nicki: od 1 do 15 znaków (małe litery i cyfry).'],
            examples: [{ input: '4\nola ola2008\nbartek bmx\nola2008 sowa\nkuba kuba2', note: 'Ola zmieniła nick dwa razy: ola → ola2008 → sowa. W sumie trzech graczy zmieniło nick.' }],
            hint: R`Trzymaj map<string, string> pierwszy; — obecny nick → pierwszy nick tego gracza. Przy zmianie a → b: pierwotny = pierwszy.count(a) ? pierwszy[a] : a; potem pierwszy.erase(a); i pierwszy[b] = pierwotny;. Na końcu przepisz pary (pierwszy, obecny) do vectora i posortuj.`,
            tests: (r) => {
                const gen = (q, pDalej) => { const uzyte = new Set(); const obecne = []; const L = []; const nowy = () => { let w; do { w = r.word(r.int(1, 15), 'abcdefghijklmnopqrstuvwxyz0123456789'); } while (uzyte.has(w)); uzyte.add(w); return w; }; for (let i = 0; i < q; i++) { let a; if (obecne.length && r() < pDalej) { const j = r.int(0, obecne.length - 1); a = obecne[j]; const b = nowy(); obecne[j] = b; L.push(`${a} ${b}`); } else { a = nowy(); const b = nowy(); obecne.push(b); L.push(`${a} ${b}`); } } return `${q}\n${L.join('\n')}`; };
                return ['1\na b', '2\na b\nb c', '4\nola ola2008\nbartek bmx\nola2008 sowa\nkuba kuba2', gen(10, 0.5), gen(800, 0.6), gen(800, 0.98), gen(800, 0)];
            },
            check: (inp) => { const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 800) || L.length !== q + 1) return 'q'; const uzyte = new Set(); const obecne = new Set(); for (const l of L.slice(1)) { const m = l.match(/^([a-z0-9]{1,15}) ([a-z0-9]{1,15})$/); if (!m) return 'wiersz'; const [, a, b] = m; if (uzyte.has(b) || a === b) return 'nowy używany'; if (uzyte.has(a) && !obecne.has(a)) return 'stary nieaktualny'; uzyte.add(a); uzyte.add(b); obecne.delete(a); obecne.add(b); } return null; },
            solve: (inp) => { const m = new Map(); for (const l of linie(inp).slice(1)) { const [a, b] = l.split(' '); const o = m.has(a) ? m.get(a) : a; m.delete(a); m.set(b, o); } const L = [...m].map(([cur, o]) => [o, cur]).sort((x, y) => cmp(x[0], y[0])); return [L.length, ...L.map((p) => p.join(' '))].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    map<string, string> pierwszy;
    for (int i = 0; i < q; i++) {
        string a, b;
        cin >> a >> b;
        string pierwotny = pierwszy.count(a) ? pierwszy[a] : a;
        pierwszy.erase(a);
        pierwszy[b] = pierwotny;
    }
    vector<pair<string, string>> wynik;
    for (auto [obecny, pierw] : pierwszy) wynik.push_back({pierw, obecny});
    sort(wynik.begin(), wynik.end());
    cout << wynik.size() << "\n";
    for (auto [pierw, obecny] : wynik) cout << pierw << " " << obecny << "\n";
    return 0;
}`,
        },
    ];
};
