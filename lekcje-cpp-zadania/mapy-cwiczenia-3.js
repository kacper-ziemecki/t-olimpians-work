// Mapy — ćwiczenia w trakcie lekcji, części 7–8: unordered_map i wybór struktury (kolejność pierwszego pojawienia,
// numer wizyty, tablica zamiast mapy, część wspólna z krotnościami, remisy rozstrzygane jawnie, pętla generatora,
// pary sąsiednich słów, anagramy wzorca w oknie) oraz mapa na olimpiadzie (zdarzenia +1/−1 na osi, pokrycie ≥ k,
// dwie mapy w zgodzie, symulacja banku, przekształcony klucz, mapa stanów z upper_bound, historia cen, lider na żywo).
module.exports = (h) => {
    const { toks } = h;
    const P = require('./input-output-plus-pomoc');
    const { IMIONA, SLOWA, MIASTA, PRODUKTY, rozrzuc, losy, calk, czyLiczba, mulmod, dobryGen } = P;
    const R = String.raw;
    const nums = (inp) => toks(inp).map(Number);
    const linie = (inp) => inp.split('\n');
    const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
    const rozneSlowa = (r, n, dlMin, dlMax, al) => { const s = new Set(); while (s.size < n) s.add(r.word(r.int(dlMin, dlMax), al)); return [...s]; };
    const losGen = (r, n, m) => `${n} ${r.int(0, m - 1)} ${r.int(1, Math.max(1, m - 1))} ${r.int(0, m - 1)} ${m}`;
    const IM = IMIONA.filter((x) => /^[A-Za-z]{1,10}$/.test(x));
    const MI = MIASTA.filter((x) => /^[A-Za-z]{1,12}$/.test(x));
    const PR = PRODUKTY.filter((x) => /^[a-z]{1,12}$/.test(x));
    const duzeImie = (w) => w[0].toUpperCase() + w.slice(1);
    // odcinki [a, b) z 0 ≤ a < b ≤ T, długość od 1 do dl
    const odcinki = (r, n, T, dl) => Array.from({ length: n }, () => { const a = r.int(0, T - 1); return [a, Math.min(T, a + r.int(1, dl))]; });
    const zOdcinkow = (P2) => P2.map(([a, b]) => `${a} ${b}`).join('\n');
    const czytajOdcinki = (t, od, n) => { const w = []; for (let i = 0; i < n; i++) w.push([t[od + 2 * i], t[od + 2 * i + 1]]); return w; };
    const dobreOdcinki = (w) => w.every(([a, b]) => calk(a, 0, 1e9) && calk(b, 0, 1e9) && a < b);
    // zdarzenia +1/−1 posortowane po chwili: [[t, zmiana], …]
    const zdarzenia = (w) => { const m = new Map(); for (const [a, b] of w) { m.set(a, (m.get(a) || 0) + 1); m.set(b, (m.get(b) || 0) - 1); } return [...m].sort((x, y) => x[0] - y[0]); };

    return [
        // ================================================================ KROK 7 · unordered_map i wybór struktury
        {
            id: 'map-kolejnosc-pojawienia', krok: 7, level: 'latwe',
            title: 'W kolejności pojawienia się',
            short: 'Zlicz słowa, ale wypisz je w kolejności, w jakiej pojawiły się pierwszy raz. Mapa tego nie pamięta — dołóż vector z kolejnością.',
            tags: ['unordered_map', 'vector z kolejnością', 'mapa nie pamięta wstawiania'],
            statement: ['Dostajesz tekst. Wypisz każde słowo i liczbę jego wystąpień — w kolejności, w jakiej słowa pojawiły się w tekście po raz pierwszy (a nie alfabetycznie).'],
            input_format: ['Słowa — do końca danych.'],
            output_format: ['Po jednym wierszu na każde różne słowo: słowo i liczba wystąpień — w kolejności pierwszego pojawienia się.'],
            constraints: ['Słów jest od 1 do 10 000, każde ma od 1 do 12 małych liter; różnych jest najwyżej 1000.'],
            examples: [{ input: 'ma ala kota\nala ma ma', note: 'Najpierw pojawiło się ma, potem ala, potem kota — i w tej kolejności je wypisujemy.' }],
            hint: R`Ani map (porządek alfabetyczny), ani unordered_map (porządek przypadkowy) nie pamiętają, w jakiej kolejności wstawiano klucze. Zliczaj w unordered_map<string, int> ile;, a nowe słowo (ile.count(s) == 0) dopisuj dodatkowo do vector<string> kolejnosc;. Wypisuj, idąc po vectorze.`,
            tests: (r) => { const pula = SLOWA.filter((w) => /^[a-z]{1,12}$/.test(w)); return ['kot', 'b a b', 'ma ala kota\nala ma ma', rozrzuc(r, Array.from({ length: 50 }, () => r.pick(pula))), rozrzuc(r, Array.from({ length: 8000 }, () => r.pick(pula))), rozrzuc(r, Array.from({ length: 6000 }, () => r.word(r.int(1, 2))))]; },
            check: (inp) => { const t = toks(inp); return t.length >= 1 && t.length <= 10000 && t.every((w) => /^[a-z]{1,12}$/.test(w)) && new Set(t).size <= 1000 ? null : 'słowa'; },
            solve: (inp) => { const m = new Map(); for (const w of toks(inp)) m.set(w, (m.get(w) || 0) + 1); return [...m].map(([w, k]) => `${w} ${k}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    unordered_map<string, int> ile;
    vector<string> kolejnosc;
    string s;
    while (cin >> s) {
        if (ile.count(s) == 0) kolejnosc.push_back(s);
        ile[s]++;
    }
    for (auto &w : kolejnosc) cout << w << " " << ile[w] << "\n";
    return 0;
}`,
        },
        {
            id: 'map-ktora-wizyta', krok: 7, level: 'latwe',
            title: 'Która to wizyta?',
            short: 'Karty klubowe mają numery do 10¹⁸. Przy każdym wejściu wypisz, który raz przychodzi ta karta. Kolejność kluczy nie gra roli — unordered_map i ++ile[x].',
            tags: ['unordered_map', '++ile[x]', 'kolejność nieważna'],
            statement: ['Do klubu wchodzi po kolei n osób, każda pokazuje kartę z numerem. Przy każdym wejściu wypisz, który raz ta karta pojawia się przy wejściu (1 — pierwszy raz, 2 — drugi raz…). Na koniec, w osobnym wierszu, wypisz liczbę różnych kart.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n numerów kart.'],
            output_format: ['W pierwszym wierszu n liczb oddzielonych spacjami — numer wizyty przy każdym wejściu.', 'W drugim wierszu liczba różnych kart.'],
            constraints: ['1 ≤ n ≤ 6000', '1 ≤ numer karty ≤ 10¹⁸'],
            examples: [{ input: '6\n555 12 555 555 12 999999999999999999', note: 'Karta 555 przychodzi po raz pierwszy, drugi i trzeci, karta 12 — pierwszy i drugi. Różne karty są trzy.' }],
            hint: R`Kolejność kluczy nie jest tu potrzebna, więc wystarczy unordered_map<long long, int> ile;. Wyrażenie ++ile[x] najpierw zwiększa licznik (dla nowej karty z 0 na 1), a potem oddaje nową wartość — możesz ją od razu wypisać. Liczba różnych kart to ile.size().`,
            tests: (r) => { const big = () => String(r.big(1n, 1000000000000000000n)); const d = (a) => `${a.length}\n${a.join(' ')}`; return [d(['5']), d(['1', '1', '1']), d(['555', '12', '555', '555', '12', '999999999999999999']), d(Array.from({ length: 40 }, () => String(r.int(1, 5)))), d(Array.from({ length: 4000 }, big)), (() => { const p = Array.from({ length: 300 }, big); return d(Array.from({ length: 4000 }, () => r.pick(p))); })(), d(Array.from({ length: 6000 }, () => String(r.int(1, 3000)))), d(Array.from({ length: 4000 }, () => '1000000000000000000'))]; },
            check: (inp) => { const t = toks(inp); const n = Number(t[0]); return calk(n, 1, 6000) && t.length === n + 1 && t.slice(1).every((x) => /^\d+$/.test(x) && BigInt(x) >= 1n && BigInt(x) <= 10n ** 18n) && inp.length < 95000 ? null : 'dane'; },
            solve: (inp) => { const m = new Map(); const o = toks(inp).slice(1).map((x) => { const k = String(BigInt(x)); const v = (m.get(k) || 0) + 1; m.set(k, v); return v; }); return `${o.join(' ')}\n${m.size}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    unordered_map<long long, int> ile;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        cout << ++ile[x] << (i + 1 < n ? " " : "\n");
    }
    cout << ile.size() << "\n";
    return 0;
}`,
        },
        {
            id: 'map-kontrola-biletow', krok: 7, level: 'srednie',
            title: 'Kontrola biletów',
            short: 'Bilety mają numery od 1 do 10⁶ — to małe liczby, więc wystarczy zwykła tablica stanów zamiast mapy. Najprostsze narzędzie bywa najlepsze.',
            tags: ['tablica zamiast mapy', 'małe klucze', 'trzy stany'],
            statement: ['Na koncert sprzedano n biletów o numerach od 1 do 10⁶. Przy wejściu skaner odczytuje q numerów. Dla każdego odczytu wypisz:',
                'OK — gdy bilet był sprzedany i wchodzi pierwszy raz;',
                'DUPLIKAT — gdy bilet był sprzedany, ale już raz go zeskanowano;',
                'FALSZYWY — gdy takiego biletu nie sprzedano.'],
            input_format: ['W pierwszym wierszu n.', 'W drugim wierszu n różnych numerów sprzedanych biletów.', 'W trzecim wierszu q, a w czwartym — q odczytanych numerów.'],
            output_format: ['q wierszy: OK, DUPLIKAT albo FALSZYWY.'],
            constraints: ['1 ≤ n ≤ 5000, 1 ≤ q ≤ 3000', 'Numery biletów: od 1 do 10⁶.'],
            examples: [{ input: '3\n15 7 900000\n4\n7 8 7 900000', note: 'Bilet 7 wchodzi raz, za drugim razem to duplikat. Biletu 8 nikt nie kupił.' }],
            hint: R`Numery są małe (do 10⁶), więc najprostsza jest globalna tablica int stan[1000001]: 0 — nie sprzedany, 1 — sprzedany, 2 — już użyty. To szybsze i prostsze niż mapa. Mapa (albo unordered_map) też zadziała — przydałaby się, gdyby numery sięgały 10¹⁸.`,
            tests: (r) => { const d = (n, q, pF) => { const S = [...new Set(losy(r, n * 2, 1, 1000000))].slice(0, n); return `${S.length}\n${S.join(' ')}\n${q}\n${Array.from({ length: q }, () => (r() < pF ? r.int(1, 1000000) : r.pick(S))).join(' ')}`; }; return ['1\n1\n1\n1', '1\n1000000\n3\n1000000 1000000 1', '3\n15 7 900000\n4\n7 8 7 900000', d(5, 10, 0.2), d(5000, 3000, 0.2), d(10, 3000, 0.05)]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; const S = t.slice(1, n + 1); if (!calk(n, 1, 5000) || new Set(S).size !== n || !S.every((x) => calk(x, 1, 1e6))) return 'bilety'; const q = t[n + 1]; return calk(q, 1, 3000) && t.length === n + 2 + q && t.slice(n + 2).every((x) => calk(x, 1, 1e6)) ? null : 'odczyty'; },
            solve: (inp) => { const t = nums(inp); const n = t[0]; const st = new Map(t.slice(1, n + 1).map((x) => [x, 1])); return t.slice(n + 2).map((x) => { const s = st.get(x) || 0; if (s === 0) return 'FALSZYWY'; if (s === 2) return 'DUPLIKAT'; st.set(x, 2); return 'OK'; }).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int stan[1000001];
int main() {
    for (int i = 0; i <= 1000000; i++) stan[i] = 0;
    int n;
    cin >> n;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        stan[x] = 1;
    }
    int q;
    cin >> q;
    while (q--) {
        int x;
        cin >> x;
        if (stan[x] == 0) cout << "FALSZYWY\n";
        else if (stan[x] == 2) cout << "DUPLIKAT\n";
        else {
            stan[x] = 2;
            cout << "OK\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'map-wspolne-z-krotnoscia', krok: 7, level: 'srednie',
            title: 'Wspólne naklejki',
            short: 'Dwa klasery z powtórkami. Ile razy każda naklejka jest u obu? min(licznik A, licznik B) — dwie mapy liczników.',
            tags: ['dwie mapy liczników', 'min z liczników', 'wynik rosnąco'],
            statement: ['Ola i Bartek mają klasery z naklejkami; naklejki mogą się powtarzać. Chcą wiedzieć, ile naklejek mają wspólnych — licząc z powtórzeniami: jeśli Ola ma trzy naklejki z numerem 5, a Bartek dwie, to wspólne są dwie piątki.',
                'Wypisz liczbę wspólnych naklejek, a w drugim wierszu ich numery rosnąco (z powtórzeniami) — albo BRAK, jeśli nie mają nic wspólnego.'],
            input_format: ['W pierwszym wierszu n i m.', 'W drugim wierszu n numerów Oli, w trzecim — m numerów Bartka.'],
            output_format: ['W pierwszym wierszu liczba wspólnych naklejek.', 'W drugim wierszu ich numery rosnąco albo BRAK.'],
            constraints: ['1 ≤ n, m ≤ 3000', 'Numery: od 1 do 10⁹.'],
            examples: [{ input: '5 4\n5 1 5 5 9\n5 7 5 1', note: 'Wspólne są dwie piątki i jedynka — razem 3 naklejki.' }],
            hint: R`Policz naklejki Oli w map<int, int> a, a Bartka w map<int, int> b. Potem przejdź mapę a (rosnąco!) i dla każdego numeru, który jest też w b, wypisz go min(a[x], b[x]) razy. Wygodnie jest najpierw zebrać wspólne numery do vectora — wtedy jego size() to liczba z pierwszego wiersza.`,
            tests: (r) => { const d = (A, B) => `${A.length} ${B.length}\n${A.join(' ')}\n${B.join(' ')}`; return [d([1], [2]), d([5, 1, 5, 5, 9], [5, 7, 5, 1]), d(losy(r, 20, 1, 6), losy(r, 15, 1, 6)), d(losy(r, 3000, 1, 1000000000), losy(r, 3000, 1, 1000000000)), d(losy(r, 3000, 1, 300), losy(r, 3000, 1, 300))]; },
            check: (inp) => { const t = nums(inp); const [n, m] = t; return calk(n, 1, 3000) && calk(m, 1, 3000) && t.length === n + m + 2 && t.slice(2).every((x) => calk(x, 1, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const [n] = t; const c = (arr) => { const m = new Map(); for (const x of arr) m.set(x, (m.get(x) || 0) + 1); return m; }; const a = c(t.slice(2, 2 + n)), b = c(t.slice(2 + n)); const w = []; for (const x of [...a.keys()].sort((p, q) => p - q)) if (b.has(x)) for (let i = 0; i < Math.min(a.get(x), b.get(x)); i++) w.push(x); return `${w.length}\n${w.length ? w.join(' ') : 'BRAK'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    map<int, int> a, b;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        a[x]++;
    }
    for (int i = 0; i < m; i++) {
        int x;
        cin >> x;
        b[x]++;
    }
    vector<int> wspolne;
    for (auto [x, ile] : a)
        if (b.count(x))
            for (int k = 0; k < min(ile, b[x]); k++) wspolne.push_back(x);
    cout << wspolne.size() << "\n";
    if (wspolne.empty()) cout << "BRAK\n";
    for (int i = 0; i < (int)wspolne.size(); i++) cout << wspolne[i] << (i + 1 < (int)wspolne.size() ? " " : "\n");
    return 0;
}`,
        },
        {
            id: 'map-najczestsze-w-testach', krok: 7, level: 'srednie',
            title: 'Najczęstsze słowo w każdym teście',
            short: 'Wiele testów, w każdym najczęstsze słowo, a remis wygrywa słowo wcześniejsze alfabetycznie. Z unordered_map remis trzeba rozstrzygnąć jawnie.',
            tags: ['unordered_map w teście', 'jawne rozstrzyganie remisu', 'nowa mapa co test'],
            statement: ['W każdym z t testów dostajesz n słów. Wypisz słowo, które występuje w teście najczęściej, i liczbę jego wystąpień. Przy remisie wybierz słowo wcześniejsze alfabetycznie.'],
            input_format: ['W pierwszym wierszu t.', 'Każdy test: n, a w następnym wierszu n słów.'],
            output_format: ['t wierszy: słowo i liczba wystąpień.'],
            constraints: ['1 ≤ t ≤ 500', '1 ≤ n, suma wszystkich n ≤ 10 000', 'Słowa: od 1 do 10 małych liter.'],
            examples: [{ input: '2\n5\nkot pies kot mysz pies\n3\nb a c', note: 'W pierwszym teście kot i pies mają po 2 — wygrywa kot. W drugim wszystkie mają po 1 — wygrywa a.' }],
            hint: R`unordered_map nie podaje kluczy alfabetycznie, więc „pierwszy z największą liczbą” nie musi być alfabetycznie pierwszy. Warunek rekordu musi więc sam pilnować remisu: ile > najlepsze || (ile == najlepsze && slowo < zwyciezca). (Ze zwykłą map wystarczyłoby samo >.) Mapę twórz w środku pętli po testach.`,
            tests: (r) => { const d = (T) => `${T.length}\n${T.map((a) => `${a.length}\n${a.join(' ')}`).join('\n')}`; const test = (n, k) => { const p = rozneSlowa(r, k, 1, 10); return Array.from({ length: n }, () => r.pick(p)); }; return [d([['a']]), d([['b', 'a'], ['c', 'c', 'a']]), d([['kot', 'pies', 'kot', 'mysz', 'pies'], ['b', 'a', 'c']]), d(Array.from({ length: 50 }, () => test(r.int(1, 10), 3))), d(Array.from({ length: 500 }, () => test(20, 4))), d([test(10000, 50)])]; },
            check: (inp) => { const t = toks(inp); const T = Number(t[0]); if (!calk(T, 1, 500)) return 't'; let p = 1, s = 0; for (let i = 0; i < T; i++) { const n = Number(t[p]); if (!calk(n, 1, 10000)) return 'n'; if (!t.slice(p + 1, p + 1 + n).every((w) => /^[a-z]{1,10}$/.test(w))) return 'słowa'; s += n; p += n + 1; } return p === t.length && s <= 10000 ? null : 'długość'; },
            solve: (inp) => { const t = toks(inp); const o = []; let p = 1; for (let i = 0; i < Number(t[0]); i++) { const n = Number(t[p]); const m = new Map(); for (const w of t.slice(p + 1, p + 1 + n)) m.set(w, (m.get(w) || 0) + 1); let b = null; for (const [w, k] of m) if (!b || k > b[1] || (k === b[1] && w < b[0])) b = [w, k]; o.push(`${b[0]} ${b[1]}`); p += n + 1; } return o.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        int n;
        cin >> n;
        unordered_map<string, int> ile;
        for (int i = 0; i < n; i++) {
            string w;
            cin >> w;
            ile[w]++;
        }
        string zwyciezca;
        int najlepsze = 0;
        for (auto &[w, k] : ile)
            if (k > najlepsze || (k == najlepsze && w < zwyciezca)) {
                najlepsze = k;
                zwyciezca = w;
            }
        cout << zwyciezca << " " << najlepsze << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-generator-w-petli', krok: 7, level: 'trudne',
            title: 'Generator w pętli',
            short: 'Ciąg z generatora prędzej czy później zaczyna się powtarzać. Kiedy pierwszy raz pojawia się wartość, która już była? Mapa wartość → pozycja, a dla szybkości unordered_map z reserve.',
            tags: ['unordered_map i reserve', 'wartość → pierwsza pozycja', 'dane z generatora'],
            statement: ['Ciąg tworzy generator z lekcji o złożoności: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m. Każdy wyraz zależy tylko od poprzedniego, więc gdy jakaś wartość pojawi się drugi raz, ciąg zaczyna krążyć w kółko.',
                'Znajdź najmniejsze j ≤ n, dla którego xⱼ jest równe któremuś wcześniejszemu wyrazowi xᵢ (i < j). Wypisz i, j oraz długość pętli j − i. Jeśli wśród pierwszych n wyrazów nic się nie powtarza, wypisz BRAK.'],
            input_format: ['Jeden wiersz: n s a b m.'],
            output_format: ['Trzy liczby: i, j oraz j − i — albo słowo BRAK.'],
            constraints: ['1 ≤ n ≤ 5 · 10⁵', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '10 3 7 5 10', note: 'Ciąg: 3, 6, 7, 4, 3, … Piąty wyraz jest równy pierwszemu, więc i = 1, j = 5, a pętla ma długość 4.' }],
            hint: R`Trzymaj unordered_map<long long, int> gdzie; — wartość → numer wyrazu, w którym pojawiła się pierwszy raz. Dla kolejnego wyrazu sprawdź gdzie.count(x): jeśli wartość już była, masz odpowiedź i możesz zakończyć program. Przed pętlą wywołaj gdzie.reserve(n); — mapa od razu przygotuje miejsce i nie będzie się przebudowywać w trakcie.`,
            tests: (r) => ['1 0 0 0 1', '2 0 0 0 1', '10 3 7 5 10', '5 4 0 7 10', losGen(r, 1000, 50), losGen(r, 500000, 1000000000), '500000 3 6 1 999983', '500000 2 4 3 1000000', '500000 5 12 1 777777', '500000 0 1 1 1000000000', '500000 0 1 1 400000', losGen(r, 500000, 1000)],
            check: (inp) => { const t = toks(inp); return t.length === 5 && dobryGen(t, 0, 5e5, 1e9) ? null : 'generator'; },
            solve: (inp) => { const [n, s, a, b, m] = nums(inp); const g = new Map(); let x = s; for (let j = 1; j <= n; j++) { if (j > 1) x = (mulmod(x, a, m) + b) % m; if (g.has(x)) { const i = g.get(x); return `${i} ${j} ${j - i}`; } g.set(x, j); } return 'BRAK'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    unordered_map<long long, int> gdzie;
    gdzie.reserve(n);
    long long x = s;
    for (int j = 1; j <= n; j++) {
        if (j > 1) x = (x * a + b) % m;
        if (gdzie.count(x)) {
            int i = gdzie[x];
            cout << i << " " << j << " " << j - i << "\n";
            return 0;
        }
        gdzie[x] = j;
    }
    cout << "BRAK\n";
    return 0;
}`,
        },
        {
            id: 'map-pary-slow', krok: 7, level: 'srednie',
            title: 'Najczęstsza para słów',
            short: 'Które dwa słowa najczęściej stoją obok siebie? Kluczem mapy jest para słów: map<pair<string, string>, int>.',
            tags: ['klucz-para napisów', 'poprzednie słowo', 'remis — pierwsza para alfabetycznie'],
            statement: ['Dostajesz tekst. Para sąsiednich słów to dwa słowa stojące w tekście bezpośrednio po sobie (także na granicy wierszy). Znajdź parę, która występuje najczęściej, i wypisz ją z liczbą wystąpień. Przy remisie wybierz parę wcześniejszą alfabetycznie (najpierw porównujemy pierwsze słowo, potem drugie).'],
            input_format: ['Słowa — do końca danych (co najmniej dwa).'],
            output_format: ['Jeden wiersz: dwa słowa i liczba wystąpień tej pary.'],
            constraints: ['Słów jest od 2 do 10 000, każde ma od 1 do 12 małych liter.'],
            examples: [{ input: 'ala ma kota i ala ma psa\nala ma', note: 'Para „ala ma” występuje trzy razy — także na granicy wierszy nic się nie przerywa.' }],
            hint: R`Trzymaj poprzednie słowo i dla każdego kolejnego zwiększ licznik pary: ile[{poprz, s}]++;. Mapa par porównuje najpierw first, potem second — dokładnie tak, jak wymaga remis — więc wystarczy rekord z warunkiem >.`,
            tests: (r) => { const pula = SLOWA.filter((w) => /^[a-z]{1,12}$/.test(w)).slice(0, 30); return ['a b', 'a a a', 'ala ma kota i ala ma psa\nala ma', rozrzuc(r, Array.from({ length: 40 }, () => r.pick(pula.slice(0, 5)))), rozrzuc(r, Array.from({ length: 10000 }, () => r.pick(pula))), rozrzuc(r, Array.from({ length: 10000 }, () => r.word(r.int(1, 3))))]; },
            check: (inp) => { const t = toks(inp); return t.length >= 2 && t.length <= 10000 && t.every((w) => /^[a-z]{1,12}$/.test(w)) ? null : 'słowa'; },
            solve: (inp) => { const t = toks(inp); const m = new Map(); for (let i = 1; i < t.length; i++) { const k = `${t[i - 1]} ${t[i]}`; m.set(k, (m.get(k) || 0) + 1); } let b = null; for (const [k, c] of m) { const [x, y] = k.split(' '); if (!b || c > b[2] || (c === b[2] && (x < b[0] || (x === b[0] && y < b[1])))) b = [x, y, c]; } return b.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    map<pair<string, string>, int> ile;
    string poprz, s;
    cin >> poprz;
    while (cin >> s) {
        ile[{poprz, s}]++;
        poprz = s;
    }
    pair<string, string> najlepsza;
    int rekord = 0;
    for (auto &[para, k] : ile)
        if (k > rekord) {
            rekord = k;
            najlepsza = para;
        }
    cout << najlepsza.first << " " << najlepsza.second << " " << rekord << "\n";
    return 0;
}`,
        },
        {
            id: 'map-anagramy-wzorca', krok: 7, level: 'trudne',
            title: 'Anagramy wzorca w tekście',
            short: 'Ile fragmentów tekstu jest anagramem wzorca? Okno o długości wzorca i liczniki liter — tu tablica 26 liczników bije mapę.',
            tags: ['okno o stałej długości', 'tablica 26 liczników', 'porównanie liczników'],
            statement: ['Dostajesz tekst i wzorzec — oba z małych liter. Policz, ile jest pozycji w tekście, od których zaczyna się fragment o długości wzorca będący jego anagramem (te same litery w tej samej liczbie, w dowolnej kolejności).'],
            input_format: ['W pierwszym wierszu tekst.', 'W drugim wierszu wzorzec.'],
            output_format: ['Jedna liczba — liczba takich pozycji.'],
            constraints: ['Tekst ma od 1 do 90 000 liter, wzorzec — od 1 do 1000 liter (małe litery a–z).'],
            examples: [{ input: 'abcbacab\nabc', note: 'Fragmenty o długości 3 to: abc, bcb, cba, bac, aca, cab. Anagramami abc są cztery z nich: abc, cba, bac i cab.' }],
            hint: R`Liter jest tylko 26, więc liczniki trzymaj w tablicy int t[26], a nie w mapie. Policz litery wzorca. Okno o długości wzorca przesuwaj po tekście: dodaj literę wchodzącą, odejmij wychodzącą i porównaj obie tablice (26 porównań). Mapa też by zadziałała, ale tablica jest prostsza i szybsza.`,
            tests: (r) => ['a\na', 'ab\nabc', 'abcbacab\nabc', `${r.word(50, 'ab')}\n${r.word(3, 'ab')}`, `${r.word(90000, 'abc')}\n${r.word(5, 'abc')}`, `${r.word(90000)}\n${r.word(1000)}`, `${'ab'.repeat(45000)}\n${'ba'.repeat(500)}`],
            check: (inp) => { const L = linie(inp); return L.length === 2 && /^[a-z]{1,90000}$/.test(L[0]) && /^[a-z]{1,1000}$/.test(L[1]) ? null : 'dane'; },
            solve: (inp) => {
                const [s, p] = linie(inp); if (p.length > s.length) return '0';
                const a = Array(26).fill(0), b = Array(26).fill(0); for (const c of p) a[c.charCodeAt(0) - 97]++;
                let w = 0; for (let i = 0; i < s.length; i++) { b[s.charCodeAt(i) - 97]++; if (i >= p.length) b[s.charCodeAt(i - p.length) - 97]--; if (i >= p.length - 1 && a.every((x, j) => x === b[j])) w++; }
                return String(w);
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    string s, p;
    cin >> s >> p;
    int wz[26] = {}, ok[26] = {};
    for (char c : p) wz[c - 'a']++;
    int k = p.size(), wynik = 0;
    for (int i = 0; i < (int)s.size(); i++) {
        ok[s[i] - 'a']++;
        if (i >= k) ok[s[i - k] - 'a']--;
        if (i >= k - 1) {
            bool rowne = true;
            for (int j = 0; j < 26; j++)
                if (wz[j] != ok[j]) rowne = false;
            if (rowne) wynik++;
        }
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        // ================================================================ KROK 8 · Mapa na olimpiadzie
        {
            id: 'map-lodowisko', krok: 8, level: 'latwe',
            title: 'Tłok na lodowisku',
            short: 'Każdy łyżwiarz jest na lodzie od chwili a do chwili b. Ilu najwięcej naraz? W mapie zapisz zdarzenia: +1 przy wejściu, −1 przy wyjściu — i przejdź je po kolei.',
            tags: ['zdarzenia +1 / −1', 'm[a]++, m[b]--', 'bieżąca suma'],
            statement: ['Na lodowisku jeździło n osób. Osoba i weszła na lód w chwili aᵢ i zeszła w chwili bᵢ — w chwili bᵢ już jej nie ma, więc ktoś, kto wchodzi dokładnie wtedy, z nią się nie mija.',
                'Ile najwięcej osób było jednocześnie na lodzie i od której chwili po raz pierwszy był taki tłok?'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy dwie liczby aᵢ i bᵢ.'],
            output_format: ['Dwie liczby: największa liczba osób naraz i najwcześniejsza chwila, od której tyle osób było na lodzie.'],
            constraints: ['1 ≤ n ≤ 4000', '0 ≤ aᵢ < bᵢ ≤ 10⁹'],
            examples: [{ input: '4\n1 5\n2 6\n5 8\n7 9', note: 'Od chwili 2 na lodzie są dwie osoby. W chwili 5 pierwsza schodzi, a trzecia wchodzi — nadal dwie. Trzech naraz nie było nigdy, więc wynik to 2 i chwila 2.' }],
            hint: R`Utwórz map<int, int> zmiana;. Dla każdej osoby: zmiana[a]++; i zmiana[b]--;. Mapa ułoży chwile rosnąco, a zmiany z tej samej chwili same się zsumują (wyjście i wejście w chwili 5 dają razem 0 — i dobrze, bo te osoby się nie mijają). Potem przejdź mapę z bieżącą sumą: teraz += d;. Rekord poprawiaj tylko przy >, żeby zapamiętać najwcześniejszą chwilę.`,
            tests: (r) => { const d = (P2) => `${P2.length}\n${zOdcinkow(P2)}`; return [d([[0, 1000000000]]), d([[1, 3], [3, 5]]), d([[1, 3], [2, 5]]), d([[1, 5], [2, 6], [5, 8], [7, 9]]), d(odcinki(r, 20, 30, 8)), d(odcinki(r, 4000, 1000000000, 300000000)), d(Array.from({ length: 4000 }, () => [r.int(0, 1000), r.int(999999000, 1000000000)])), d(Array.from({ length: 4000 }, (_, i) => [i, i + 1])), d(odcinki(r, 4000, 100, 5))]; },
            check: (inp) => { const t = nums(inp); const n = t[0]; return calk(n, 1, 4000) && t.length === 1 + 2 * n && dobreOdcinki(czytajOdcinki(t, 1, n)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); let teraz = 0, rek = 0, kiedy = 0; for (const [k, d] of zdarzenia(czytajOdcinki(t, 1, t[0]))) { teraz += d; if (teraz > rek) { rek = teraz; kiedy = k; } } return `${rek} ${kiedy}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<int, int> zmiana;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        zmiana[a]++;
        zmiana[b]--;
    }
    int teraz = 0, rekord = 0, kiedy = 0;
    for (auto [t, d] : zmiana) {
        teraz += d;
        if (teraz > rekord) {
            rekord = teraz;
            kiedy = t;
        }
    }
    cout << rekord << " " << kiedy << "\n";
    return 0;
}`,
        },
        {
            id: 'map-zasieg-nadajnikow', krok: 8, level: 'srednie',
            title: 'Zasięg na autostradzie',
            short: 'Nadajniki pokrywają odcinki drogi. Na ilu kilometrach łapiesz sygnał z co najmniej k nadajników? Zdarzenia w mapie i długości między kolejnymi kluczami.',
            tags: ['zdarzenia +1 / −1', 'długość między kluczami', 'warunek na bieżącą sumę'],
            statement: ['Wzdłuż autostrady stoi n nadajników. Nadajnik i daje zasięg od kilometra aᵢ do kilometra bᵢ. Telefon działa dobrze tam, gdzie łapie sygnał z co najmniej k nadajników naraz.',
                'Policz łączną długość autostrady (w kilometrach), na której telefon działa dobrze.'],
            input_format: ['W pierwszym wierszu n i k.', 'W każdym z n kolejnych wierszy aᵢ i bᵢ.'],
            output_format: ['Jedna liczba — łączna długość.'],
            constraints: ['1 ≤ k ≤ n ≤ 4000', '0 ≤ aᵢ < bᵢ ≤ 10⁹'],
            examples: [{ input: '3 2\n0 10\n5 15\n8 20', note: 'Od kilometra 5 do 15 sygnał dają co najmniej dwa nadajniki (od 8 do 10 nawet trzy) — to 10 km.' }],
            hint: R`Zapisz zdarzenia jak w poprzednim zadaniu: zmiana[a]++; zmiana[b]--;. Idąc po mapie, pamiętaj poprzedni klucz: bieżąca liczba nadajników obowiązuje od poprzedniego klucza aż do obecnego. Zanim dodasz zmianę z obecnego klucza, sprawdź: jeśli teraz >= k, dolicz t − poprzedni.`,
            tests: (r) => { const d = (k, P2) => `${P2.length} ${k}\n${zOdcinkow(P2)}`; return [d(1, [[0, 1000000000]]), d(2, [[0, 5], [5, 10]]), d(1, [[0, 5], [5, 10]]), d(2, [[0, 10], [5, 15], [8, 20]]), d(3, odcinki(r, 15, 40, 15)), d(1, odcinki(r, 4000, 1000000000, 1000000)), d(50, odcinki(r, 4000, 1000000000, 100000000)), d(4000, Array.from({ length: 4000 }, () => [r.int(0, 1000), r.int(999999000, 1000000000)])), d(2, odcinki(r, 4000, 100000, 100))]; },
            check: (inp) => { const t = nums(inp); const [n, k] = t; return calk(n, 1, 4000) && calk(k, 1, n) && t.length === 2 + 2 * n && dobreOdcinki(czytajOdcinki(t, 2, n)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const k = t[1]; let teraz = 0, pop = 0, w = 0; for (const [x, d] of zdarzenia(czytajOdcinki(t, 2, t[0]))) { if (teraz >= k) w += x - pop; teraz += d; pop = x; } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    map<int, int> zmiana;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        zmiana[a]++;
        zmiana[b]--;
    }
    long long dobrze = 0;
    int teraz = 0, poprzedni = 0;
    for (auto [t, d] : zmiana) {
        if (teraz >= k) dobrze += t - poprzedni;
        teraz += d;
        poprzedni = t;
    }
    cout << dobrze << "\n";
    return 0;
}`,
        },
        {
            id: 'map-sledzenie-paczek', krok: 8, level: 'srednie',
            title: 'Gdzie jest paczka?',
            short: 'Paczki jeżdżą między miastami. Jedna mapa pamięta, gdzie jest każda paczka, druga — ile paczek leży w każdym mieście. Każdy ruch poprawia obie.',
            tags: ['dwie mapy naraz', 'paczka → miasto', 'miasto → licznik'],
            statement: ['Firma kurierska wykonuje po kolei q poleceń:',
                'NADAJ p c — paczka o numerze p pojawia się w mieście c (paczki o tym numerze nie ma teraz w systemie);',
                'PRZEWIEZ p c — paczka p jedzie do miasta c (paczka jest w systemie i nie leży już w c);',
                'ODBIOR p — paczka p zostaje odebrana i znika z systemu (paczka jest w systemie);',
                'GDZIE p — wypisz miasto, w którym leży paczka p, albo BRAK, jeśli nie ma jej w systemie;',
                'ILE c — wypisz, ile paczek leży teraz w mieście c.'],
            input_format: ['W pierwszym wierszu q.', 'W każdym z q kolejnych wierszy jedno polecenie.'],
            output_format: ['Odpowiedzi na polecenia GDZIE i ILE, każda w osobnym wierszu.'],
            constraints: ['1 ≤ q ≤ 3000', '1 ≤ p ≤ 10⁹', 'Nazwy miast: od 1 do 12 liter, bez spacji.'],
            examples: [{ input: '7\nNADAJ 17 Krakow\nNADAJ 4 Gdansk\nPRZEWIEZ 17 Gdansk\nILE Gdansk\nGDZIE 17\nODBIOR 4\nILE Gdansk', note: 'Po przewiezieniu w Gdańsku leżą dwie paczki, a po odbiorze paczki 4 — już tylko jedna.' }],
            hint: R`map<int, string> gdzie; (paczka → miasto) i map<string, int> ile; (miasto → liczba paczek). Przy PRZEWIEZ najpierw zmniejsz licznik starego miasta: ile[gdzie[p]]--;, potem zmień miasto paczki i zwiększ licznik nowego. Przy ODBIOR zmniejsz licznik i usuń paczkę: gdzie.erase(p);. Przy GDZIE sprawdzaj przez count — nawiasy dopisałyby paczkę-widmo z pustym miastem.`,
            tests: (r) => {
                const gen = (q, maxP, pNowa) => {
                    const akt = new Map(); const o = [];
                    for (let i = 0; i < q; i++) {
                        const ps = [...akt.keys()]; let x = r();
                        if (ps.length === 0 && x < 0.65) x = 0;
                        if (x < 0.3 && akt.size >= maxP) x = 0.7;
                        if (x < 0.3) { let p; do { p = r.int(1, maxP); } while (akt.has(p)); const c = r.pick(MI); akt.set(p, c); o.push(`NADAJ ${p} ${c}`); }
                        else if (x < 0.55) { const p = r.pick(ps); let c; do { c = r.pick(MI); } while (c === akt.get(p)); akt.set(p, c); o.push(`PRZEWIEZ ${p} ${c}`); }
                        else if (x < 0.65) { const p = r.pick(ps); akt.delete(p); o.push(`ODBIOR ${p}`); }
                        else if (x < 0.85) o.push(`GDZIE ${ps.length && r() > pNowa ? r.pick(ps) : r.int(1, maxP)}`);
                        else o.push(`ILE ${r() < 0.85 ? r.pick(MI) : r.pick(['Radom', 'Sopot', 'Zakopane'])}`);
                    }
                    return `${q}\n${o.join('\n')}`;
                };
                return ['1\nGDZIE 5', '2\nNADAJ 1 Hel\nILE Hel', '7\nNADAJ 17 Krakow\nNADAJ 4 Gdansk\nPRZEWIEZ 17 Gdansk\nILE Gdansk\nGDZIE 17\nODBIOR 4\nILE Gdansk', '6\nNADAJ 3 Opole\nODBIOR 3\nGDZIE 3\nILE Opole\nNADAJ 3 Torun\nGDZIE 3', gen(30, 5, 0.3), gen(3000, 1000000000, 0.3), gen(3000, 40, 0.3), gen(3000, 3, 0.2)];
            },
            check: (inp) => {
                const L = linie(inp); const q = Number(L[0]); if (!calk(q, 1, 3000) || L.length !== q + 1) return 'q';
                const akt = new Map(); const miasto = (c) => /^[A-Za-z]{1,12}$/.test(c); const num = (s) => /^[1-9]\d*$/.test(s) && Number(s) <= 1e9;
                for (let i = 1; i <= q; i++) {
                    const w = L[i].trim().split(/\s+/); const p = Number(w[1]);
                    if (w[0] === 'NADAJ' && w.length === 3 && num(w[1]) && miasto(w[2]) && !akt.has(p)) akt.set(p, w[2]);
                    else if (w[0] === 'PRZEWIEZ' && w.length === 3 && num(w[1]) && miasto(w[2]) && akt.has(p) && akt.get(p) !== w[2]) akt.set(p, w[2]);
                    else if (w[0] === 'ODBIOR' && w.length === 2 && num(w[1]) && akt.has(p)) akt.delete(p);
                    else if (w[0] === 'GDZIE' && w.length === 2 && num(w[1])) { /* pytanie */ }
                    else if (w[0] === 'ILE' && w.length === 2 && miasto(w[1])) { /* pytanie */ }
                    else return `polecenie ${i}`;
                }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const gdzie = new Map(), ile = new Map(); const o = [];
                for (const s of L.slice(1)) {
                    const w = s.trim().split(/\s+/); const p = Number(w[1]);
                    if (w[0] === 'NADAJ') { gdzie.set(p, w[2]); ile.set(w[2], (ile.get(w[2]) || 0) + 1); }
                    else if (w[0] === 'PRZEWIEZ') { const c = gdzie.get(p); ile.set(c, ile.get(c) - 1); gdzie.set(p, w[2]); ile.set(w[2], (ile.get(w[2]) || 0) + 1); }
                    else if (w[0] === 'ODBIOR') { const c = gdzie.get(p); ile.set(c, ile.get(c) - 1); gdzie.delete(p); }
                    else if (w[0] === 'GDZIE') o.push(gdzie.has(p) ? gdzie.get(p) : 'BRAK');
                    else o.push(String(ile.get(w[1]) || 0));
                }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    map<int, string> gdzie;
    map<string, int> ile;
    while (q--) {
        string polecenie;
        cin >> polecenie;
        if (polecenie == "NADAJ") {
            int p;
            string c;
            cin >> p >> c;
            gdzie[p] = c;
            ile[c]++;
        } else if (polecenie == "PRZEWIEZ") {
            int p;
            string c;
            cin >> p >> c;
            ile[gdzie[p]]--;
            gdzie[p] = c;
            ile[c]++;
        } else if (polecenie == "ODBIOR") {
            int p;
            cin >> p;
            ile[gdzie[p]]--;
            gdzie.erase(p);
        } else if (polecenie == "GDZIE") {
            int p;
            cin >> p;
            if (gdzie.count(p)) cout << gdzie[p] << "\n";
            else cout << "BRAK\n";
        } else {
            string c;
            cin >> c;
            if (ile.count(c)) cout << ile[c] << "\n";
            else cout << 0 << "\n";
        }
    }
    return 0;
}`,
        },
        {
            id: 'map-bank-klasowy', krok: 8, level: 'srednie',
            title: 'Bank klasowy',
            short: 'Konta ze stanami i lista przelewów. Przelew bez pokrycia albo na nieistniejące konto trzeba odrzucić. Na koniec — ranking kont od najbogatszego.',
            tags: ['symulacja na mapie', 'count przed odczytem', 'ranking: vector par + sort'],
            statement: ['W klasowym banku każdy uczeń ma konto ze stanem w groszach. Bank wykonuje po kolei m przelewów „od do kwota”. Dla każdego przelewu wypisz:',
                'BLAD — gdy któregoś z kont nie ma w banku albo gdy ktoś przelewa sam do siebie;',
                'BRAK SRODKOW — gdy nadawca ma mniej, niż chce przelać;',
                'OK — gdy przelew się udał (nadawcy ubywa, odbiorcy przybywa).',
                'Na koniec wypisz wszystkie konta od największego stanu do najmniejszego, a przy równym stanie — alfabetycznie.'],
            input_format: ['W pierwszym wierszu n — liczba kont.', 'W każdym z n kolejnych wierszy imię właściciela i stan konta (imiona są różne).', 'Dalej wiersz z m, a po nim m wierszy „od do kwota”.'],
            output_format: ['m wierszy z odpowiedziami, a potem n wierszy „imię stan”.'],
            constraints: ['1 ≤ n ≤ 400, 1 ≤ m ≤ 1500', 'Stany początkowe i kwoty: od 1 do 10⁹ — stany mogą urosnąć ponad zakres int.', 'Imiona: od 1 do 12 liter.'],
            examples: [{ input: '3\nOla 500\nJan 100\nEwa 300\n4\nJan Ola 150\nOla Jan 250\nEwa Ewa 10\nEwa Kuba 50', note: 'Jan ma za mało na pierwszy przelew. Drugi się udaje. Ewa nie może przelać sama sobie, a konta Kuby w banku nie ma.' }],
            hint: R`Konta trzymaj w map<string, long long> konto;. Najpierw sprawdź, czy oba imiona są w mapie (count) i czy to nie ta sama osoba — inaczej BLAD. Nawiasy nie nadają się do sprawdzania: dopisałyby fałszywe konto ze stanem 0 i zepsuły ranking. Ranking: przepisz mapę do vector<pair<string, long long>> i posortuj lambdą — większy stan przodem, przy remisie mniejsze imię.`,
            tests: (r) => {
                const gen = (n, m, maxStan, maxKw, pZle) => {
                    const imiona = rozneSlowa(r, n, 3, 8).map(duzeImie); const jest = new Set(imiona);
                    const obce = rozneSlowa(r, 30, 3, 8).map(duzeImie).filter((x) => !jest.has(x));
                    const kto = () => (r() < pZle ? r.pick(obce) : r.pick(imiona));
                    const ops = Array.from({ length: m }, () => { const od = kto(); const dla = r() < 0.05 ? od : kto(); return `${od} ${dla} ${r.int(1, maxKw)}`; });
                    return `${n}\n${imiona.map((x) => `${x} ${r.int(1, maxStan)}`).join('\n')}\n${m}\n${ops.join('\n')}`;
                };
                const wszystko = (() => { const im = rozneSlowa(r, 400, 3, 8).map(duzeImie); const st = im.map(() => r.int(999000000, 1000000000)); return `400\n${im.map((x, i) => `${x} ${st[i]}`).join('\n')}\n399\n${im.slice(1).map((x, i) => `${x} ${im[0]} ${st[i + 1]}`).join('\n')}`; })();
                return ['1\nOla 5\n1\nOla Ola 1', '2\nAla 10\nBob 10\n2\nAla Bob 10\nAla Bob 1', '3\nOla 500\nJan 100\nEwa 300\n4\nJan Ola 150\nOla Jan 250\nEwa Ewa 10\nEwa Kuba 50', gen(5, 20, 100, 80, 0.1), gen(400, 1500, 1000000, 1500000, 0.05), gen(50, 1500, 1000000000, 1000000000, 0.02), gen(10, 1500, 1000, 300, 0.1), wszystko];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 400)) return 'n';
                const im = /^[A-Za-z]{1,12}$/; const kw = (s) => /^[1-9]\d*$/.test(s) && Number(s) <= 1e9; const jest = new Set();
                for (let i = 1; i <= n; i++) { const w = (L[i] || '').trim().split(/\s+/); if (w.length !== 2 || !im.test(w[0]) || !kw(w[1]) || jest.has(w[0])) return `konto ${i}`; jest.add(w[0]); }
                const m = Number(L[n + 1]); if (!calk(m, 1, 1500) || L.length !== n + 2 + m) return 'm';
                for (let i = n + 2; i < L.length; i++) { const w = L[i].trim().split(/\s+/); if (w.length !== 3 || !im.test(w[0]) || !im.test(w[1]) || !kw(w[2])) return `przelew ${i}`; }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]); const k = new Map(); const o = [];
                for (let i = 1; i <= n; i++) { const [a, b] = L[i].trim().split(/\s+/); k.set(a, Number(b)); }
                for (const s of L.slice(n + 2)) { const [od, dla, x] = s.trim().split(/\s+/); const kw = Number(x); if (!k.has(od) || !k.has(dla) || od === dla) o.push('BLAD'); else if (k.get(od) < kw) o.push('BRAK SRODKOW'); else { k.set(od, k.get(od) - kw); k.set(dla, k.get(dla) + kw); o.push('OK'); } }
                return [...o, ...[...k].sort((x, y) => y[1] - x[1] || cmp(x[0], y[0])).map(([a, b]) => `${a} ${b}`)].join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, long long> konto;
    for (int i = 0; i < n; i++) {
        string imie;
        long long stan;
        cin >> imie >> stan;
        konto[imie] = stan;
    }
    int m;
    cin >> m;
    while (m--) {
        string od, dla;
        long long kwota;
        cin >> od >> dla >> kwota;
        if (konto.count(od) == 0 || konto.count(dla) == 0 || od == dla) cout << "BLAD\n";
        else if (konto[od] < kwota) cout << "BRAK SRODKOW\n";
        else {
            konto[od] -= kwota;
            konto[dla] += kwota;
            cout << "OK\n";
        }
    }
    vector<pair<string, long long>> ranking;
    for (auto [imie, stan] : konto) ranking.push_back({imie, stan});
    sort(ranking.begin(), ranking.end(), [](auto a, auto b) {
        if (a.second != b.second) return a.second > b.second;
        return a.first < b.first;
    });
    for (auto [imie, stan] : ranking) cout << imie << " " << stan << "\n";
    return 0;
}`,
        },
        {
            id: 'map-rowne-tempo', krok: 8, level: 'srednie',
            title: 'Równe tempo',
            short: 'Ile jest par pozycji i < j, dla których xⱼ − xᵢ = j − i? Przekształć warunek: xᵢ − i = xⱼ − j. Wtedy wystarczy zliczać w mapie wartości xᵢ − i.',
            tags: ['przekształcony klucz', 'liczenie par w locie', 'dane z generatora'],
            statement: ['Ciąg tworzy generator z lekcji o złożoności: x₁ = s, xᵢ = (xᵢ₋₁ · a + b) mod m.',
                'Policz pary pozycji i < j, dla których xⱼ − xᵢ = j − i — czyli takie, że od wyrazu i do wyrazu j ciąg rośnie średnio o dokładnie 1 na krok.'],
            input_format: ['Jeden wiersz: n s a b m.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 3 · 10⁵', '1 ≤ m ≤ 10⁹', '0 ≤ s, a, b < m'],
            examples: [{ input: '6 2 1 1 5', note: 'Ciąg: 2, 3, 4, 0, 1, 2. Wartości xᵢ − i: 1, 1, 1, −4, −4, −4. Trzy jedynki dają 3 pary, trzy razy −4 — kolejne 3. Razem 6.' }],
            hint: R`Przenieś to, co dotyczy i, na jedną stronę, a to, co dotyczy j — na drugą: xⱼ − j = xᵢ − i. Szukane pary to więc pozycje z równą wartością x − pozycja. Idąc od lewej, dla każdej pozycji j dolicz do wyniku ile[x - j] (tyle razy widziałeś już tę wartość), a potem zwiększ ile[x - j]. Wynik może być ogromny — long long. Dwie pętle po wszystkich parach przy n = 3 · 10⁵ nie zdążą.`,
            tests: (r) => ['1 0 0 0 1', '6 2 1 1 5', '5 0 1 1 1000', losGen(r, 1000, 50), '300000 0 1 1 1000000000', '300000 5 1 1 1000', losGen(r, 300000, 1000000000), losGen(r, 300000, 100), '300000 3 1 1 7', '300000 7 1 3 1000000000'],
            check: (inp) => { const t = toks(inp); return t.length === 5 && dobryGen(t, 0, 3e5, 1e9) ? null : 'generator'; },
            solve: (inp) => { const [n, s, a, b, m] = nums(inp); const c = new Map(); let x = s, w = 0; for (let j = 1; j <= n; j++) { if (j > 1) x = (mulmod(x, a, m) + b) % m; const k = x - j; const v = c.get(k) || 0; w += v; c.set(k, v + 1); } return String(w); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    long long n, s, a, b, m;
    cin >> n >> s >> a >> b >> m;
    map<long long, long long> ile;
    long long x = s, pary = 0;
    for (long long j = 1; j <= n; j++) {
        if (j > 1) x = (x * a + b) % m;
        pary += ile[x - j];
        ile[x - j]++;
    }
    cout << pary << "\n";
    return 0;
}`,
        },
        {
            id: 'map-muzeum-w-chwili', krok: 8, level: 'trudne',
            title: 'Ilu jest w muzeum?',
            short: 'Znamy wejścia i wyjścia zwiedzających, a potem pada q pytań: ile osób było w muzeum w chwili t? Zamień zdarzenia na mapę „od chwili t jest v osób” i odpowiadaj przez upper_bound.',
            tags: ['zdarzenia +1 / −1', 'mapa stanów', 'prev(upper_bound(t))'],
            statement: ['Bramki muzeum zapisały n wizyt: zwiedzający i był w środku od chwili aᵢ do chwili bᵢ (w chwili bᵢ już go nie ma).',
                'Kierownik zadaje q pytań: ile osób było w muzeum w chwili t?'],
            input_format: ['W pierwszym wierszu n i q.', 'W każdym z n kolejnych wierszy aᵢ i bᵢ.', 'W ostatnim wierszu q chwil t.'],
            output_format: ['Jeden wiersz: q odpowiedzi oddzielonych spacjami, w kolejności pytań.'],
            constraints: ['1 ≤ n, q ≤ 2500', '0 ≤ aᵢ < bᵢ ≤ 10⁹, 0 ≤ t ≤ 10⁹'],
            examples: [{ input: '3 5\n2 6\n4 9\n6 7\n1 2 5 6 9', note: 'Przed chwilą 2 nikogo nie ma. Od 4 są dwie osoby. W chwili 6 pierwsza wychodzi, a trzecia wchodzi — nadal dwie. W chwili 9 wychodzi ostatnia.' }],
            hint: R`Najpierw zbierz zdarzenia: zmiana[a]++; zmiana[b]--;. Potem przejdź mapę z bieżącą sumą i zapisz w drugiej mapie stan[t] = teraz; — od chwili t aż do następnego klucza w środku jest tyle osób. Pytanie o chwilę t: auto it = stan.upper_bound(t); wskazuje pierwszą zmianę po t. Jeśli it == stan.begin(), przed t nic się jeszcze nie wydarzyło — odpowiedź 0. Inaczej odpowiedź to prev(it)->second.`,
            tests: (r) => { const d = (P2, Q) => `${P2.length} ${Q.length}\n${zOdcinkow(P2)}\n${Q.join(' ')}`; return [d([[2, 6], [4, 9], [6, 7]], [1, 2, 5, 6, 9]), d([[0, 1000000000]], [0, 999999999, 1000000000]), d(odcinki(r, 10, 20, 6), Array.from({ length: 23 }, (_, i) => i)), d(odcinki(r, 2500, 1000000000, 100000000), losy(r, 2500, 0, 1000000000)), d(Array.from({ length: 2500 }, () => [r.int(0, 1000), r.int(999999000, 1000000000)]), [0, 1, 500, 1000, 5000, 999999000, 999999500, 999999999, 1000000000]), d(odcinki(r, 2500, 3000, 30), losy(r, 2500, 0, 3100))]; },
            check: (inp) => { const t = nums(inp); const [n, q] = t; return calk(n, 1, 2500) && calk(q, 1, 2500) && t.length === 2 + 2 * n + q && dobreOdcinki(czytajOdcinki(t, 2, n)) && t.slice(2 + 2 * n).every((x) => calk(x, 0, 1e9)) ? null : 'dane'; },
            solve: (inp) => { const t = nums(inp); const [n] = t; const st = []; let teraz = 0; for (const [k, d] of zdarzenia(czytajOdcinki(t, 2, n))) { teraz += d; st.push([k, teraz]); } return t.slice(2 + 2 * n).map((x) => { let lo = 0, hi = st.length; while (lo < hi) { const mid = (lo + hi) >> 1; if (st[mid][0] <= x) lo = mid + 1; else hi = mid; } return lo === 0 ? 0 : st[lo - 1][1]; }).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, q;
    cin >> n >> q;
    map<int, int> zmiana;
    for (int i = 0; i < n; i++) {
        int a, b;
        cin >> a >> b;
        zmiana[a]++;
        zmiana[b]--;
    }
    map<int, int> stan;
    int teraz = 0;
    for (auto [t, d] : zmiana) {
        teraz += d;
        stan[t] = teraz;
    }
    for (int i = 0; i < q; i++) {
        int t;
        cin >> t;
        auto it = stan.upper_bound(t);
        int odp = 0;
        if (it != stan.begin()) odp = prev(it)->second;
        cout << odp << (i + 1 < q ? " " : "\n");
    }
    return 0;
}`,
        },
        {
            id: 'map-historia-cen', krok: 8, level: 'trudne',
            title: 'Historia cen',
            short: 'Sklep zapisał zmiany cen z datami — nie po kolei. Ile kosztował produkt w danym dniu? Mapa w mapie: produkt → (dzień → cena) i prev(upper_bound(dzień)).',
            tags: ['map<string, map<int, int>>', 'prev(upper_bound)', 'BRAK przed pierwszą zmianą'],
            statement: ['Sklep internetowy zapisał n zmian cen: „p d c” oznacza, że od dnia d produkt p kosztuje c groszy — aż do następnej zmiany ceny tego produktu. Zmiany są wypisane w przypadkowej kolejności; jeden produkt nie zmienia ceny dwa razy tego samego dnia.',
                'Odpowiedz na q pytań „p d”: ile kosztował produkt p w dniu d? Jeśli w dniu d produkt nie miał jeszcze ceny (albo nie ma go wcale w zapisach), wypisz BRAK.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy: produkt p, dzień d, cena c.', 'Dalej wiersz z q i q wierszy „p d”.'],
            output_format: ['q wierszy: cena albo BRAK.'],
            constraints: ['1 ≤ n, q ≤ 2000', '1 ≤ d ≤ 10⁹, 1 ≤ c ≤ 10⁹', 'Nazwy produktów: od 1 do 12 małych liter.'],
            examples: [{ input: '4\nmleko 10 350\nchleb 5 600\nmleko 3 320\nmleko 20 399\n5\nmleko 2\nmleko 3\nmleko 15\nchleb 100\nser 7', note: 'Mleko: od dnia 3 kosztuje 320, od 10 — 350, od 20 — 399. W dniu 2 nie miało jeszcze ceny, a sera nie ma w zapisach.' }],
            hint: R`map<string, map<int, int>> ceny; i ceny[p][d] = c; — wewnętrzna mapa sama ułoży dni rosnąco, nawet gdy zmiany przychodzą nie po kolei. Pytanie „p d”: najpierw ceny.count(p). Potem auto &h = ceny[p]; auto it = h.upper_bound(d); — to pierwsza zmiana po dniu d. Jeśli it == h.begin(), żadna cena jeszcze nie obowiązywała: BRAK. Inaczej odpowiedź to prev(it)->second.`,
            tests: (r) => {
                const gen = (n, q, k, D) => {
                    const pr = r.shuffle(PR).slice(0, k); const uz = new Set(); const z = [];
                    while (z.length < n) { const p = r.pick(pr); const d = r.int(1, D); if (uz.has(`${p} ${d}`)) continue; uz.add(`${p} ${d}`); z.push(`${p} ${d} ${r.int(1, 1000000)}`); }
                    const Q = Array.from({ length: q }, () => `${r() < 0.9 ? r.pick(pr) : r.pick(PR)} ${r() < 0.1 ? Number(r.pick(z).split(' ')[1]) : r.int(1, D)}`);
                    return `${n}\n${z.join('\n')}\n${q}\n${Q.join('\n')}`;
                };
                return ['1\nser 5 100\n3\nser 4\nser 5\nser 1000000000', '4\nmleko 10 350\nchleb 5 600\nmleko 3 320\nmleko 20 399\n5\nmleko 2\nmleko 3\nmleko 15\nchleb 100\nser 7', gen(10, 10, 2, 20), gen(2000, 2000, 10, 1000000000), gen(2000, 2000, 30, 3000), gen(2000, 2000, 1, 5000)];
            },
            check: (inp) => {
                const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 2000)) return 'n';
                const pr = /^[a-z]{1,12}$/; const lw = (s) => /^[1-9]\d*$/.test(s) && Number(s) <= 1e9; const uz = new Set();
                for (let i = 1; i <= n; i++) { const w = (L[i] || '').trim().split(/\s+/); if (w.length !== 3 || !pr.test(w[0]) || !lw(w[1]) || !lw(w[2]) || uz.has(`${w[0]} ${w[1]}`)) return `zmiana ${i}`; uz.add(`${w[0]} ${w[1]}`); }
                const q = Number(L[n + 1]); if (!calk(q, 1, 2000) || L.length !== n + 2 + q) return 'q';
                for (let i = n + 2; i < L.length; i++) { const w = L[i].trim().split(/\s+/); if (w.length !== 2 || !pr.test(w[0]) || !lw(w[1])) return `pytanie ${i}`; }
                return null;
            },
            solve: (inp) => {
                const L = linie(inp); const n = Number(L[0]); const h = new Map();
                for (let i = 1; i <= n; i++) { const [p, d, c] = L[i].trim().split(/\s+/); if (!h.has(p)) h.set(p, []); h.get(p).push([Number(d), c]); }
                for (const v of h.values()) v.sort((x, y) => x[0] - y[0]);
                return L.slice(n + 2).map((s) => { const [p, x] = s.trim().split(/\s+/); const d = Number(x); if (!h.has(p)) return 'BRAK'; let w = 'BRAK'; for (const [dz, c] of h.get(p)) if (dz <= d) w = c; return w; }).join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, map<int, int>> ceny;
    for (int i = 0; i < n; i++) {
        string p;
        int d, c;
        cin >> p >> d >> c;
        ceny[p][d] = c;
    }
    int q;
    cin >> q;
    while (q--) {
        string p;
        int d;
        cin >> p >> d;
        if (ceny.count(p) == 0) {
            cout << "BRAK\n";
            continue;
        }
        auto &h = ceny[p];
        auto it = h.upper_bound(d);
        if (it == h.begin()) cout << "BRAK\n";
        else cout << prev(it)->second << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'map-lider-na-zywo', krok: 8, level: 'trudne',
            title: 'Lider na żywo',
            short: 'Gracze zdobywają i tracą punkty. Po każdej zmianie: kto prowadzi? Mapa gracz → punkty i druga mapa punkty → zbiór graczy. Lider siedzi na końcu drugiej mapy.',
            tags: ['dwie mapy w zgodzie', 'map<long long, set<string>>', 'rbegin()'],
            statement: ['W grze biorą udział gracze, którzy zaczynają z 0 punktów; gracz pojawia się w rankingu przy swojej pierwszej zmianie. Przychodzi po kolei n zmian „imię x” — gracz dostaje x punktów (x może być ujemne albo równe 0).',
                'Po każdej zmianie wypisz lidera — gracza z największą liczbą punktów (przy remisie wcześniejszego alfabetycznie) — i jego punkty.'],
            input_format: ['W pierwszym wierszu n.', 'W każdym z n kolejnych wierszy imię i liczba x.'],
            output_format: ['n wierszy: imię lidera i jego punkty.'],
            constraints: ['1 ≤ n ≤ 1200', '−10⁴ ≤ x ≤ 10⁴', 'Imiona: od 1 do 10 liter.'],
            examples: [{ input: '5\nOla 10\nJan 15\nOla 5\nJan -20\nEwa -3', note: 'Po trzeciej zmianie Ola i Jan mają po 15 — prowadzi Jan, bo jest wcześniej alfabetycznie. Po czwartej Jan spada do −5. Ewa z −3 punktami nie zagraża Oli.' }],
            hint: R`map<string, long long> pkt; — ile ma każdy gracz. map<long long, set<string>> kto; — kto ma daną liczbę punktów. Przy zmianie: jeśli gracz już jest w pkt, usuń go z kto[stare], a gdy ten zbiór zrobi się pusty — usuń cały klucz (kto.erase(stare)), inaczej pusty zbiór udawałby lidera. Potem zmień punkty i dopisz gracza do kto[nowe]. Lider: kto.rbegin() to największy klucz, a *kto.rbegin()->second.begin() — pierwsze alfabetycznie imię w jego zbiorze.`,
            tests: (r) => {
                const gen = (n, k, lo, hi) => { const g = r.shuffle(IM).slice(0, k); return `${n}\n${Array.from({ length: n }, () => `${r.pick(g)} ${r.int(lo, hi)}`).join('\n')}`; };
                return ['1\nOla 0', '2\nOla -5\nJan -7', '3\nB 1\nA 1\nB -1', '5\nOla 10\nJan 15\nOla 5\nJan -20\nEwa -3', gen(50, 3, -2, 2), gen(1200, 20, -10000, 10000), gen(1200, 45, -100, 300), gen(1200, 5, -1, 1), gen(1200, 2, 0, 0)];
            },
            check: (inp) => { const L = linie(inp); const n = Number(L[0]); if (!calk(n, 1, 1200) || L.length !== n + 1) return 'n'; for (let i = 1; i <= n; i++) { const w = L[i].trim().split(/\s+/); if (w.length !== 2 || !/^[A-Za-z]{1,10}$/.test(w[0]) || !czyLiczba(w[1]) || !calk(Number(w[1]), -10000, 10000)) return `wiersz ${i}`; } return null; },
            solve: (inp) => {
                const L = linie(inp); const p = new Map(); const o = [];
                for (const s of L.slice(1)) { const [im, x] = s.trim().split(/\s+/); p.set(im, (p.get(im) || 0) + Number(x)); let b = null; for (const [a, v] of p) if (!b || v > b[1] || (v === b[1] && a < b[0])) b = [a, v]; o.push(`${b[0]} ${b[1]}`); }
                return o.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    map<string, long long> pkt;
    map<long long, set<string>> kto;
    while (n--) {
        string imie;
        long long x;
        cin >> imie >> x;
        if (pkt.count(imie)) {
            long long stare = pkt[imie];
            kto[stare].erase(imie);
            if (kto[stare].empty()) kto.erase(stare);
        }
        pkt[imie] += x;
        kto[pkt[imie]].insert(imie);
        auto lider = kto.rbegin();
        cout << *lider->second.begin() << " " << lider->first << "\n";
    }
    return 0;
}`,
        },
    ];
};
