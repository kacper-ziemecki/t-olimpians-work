// Vector — baza zadań na koniec lekcji: od rozgrzewki z jednym pomysłem (parzyste czy nieparzyste, obroty, szczyty,
// przesunięcie w kółko, lista zakupów, kolejka) przez zadania średnie (wyliczanka, scalanie list, prawie palindrom,
// drużyna marzeń, tasowanie kart, sumy prostokątów) po trudne (sumy podzielne przez k, anagramy, najmniej zamian,
// k-ta permutacja, rosnący podzbiór, wyspy, sklejane palindromy) i wielki finał: edytor ciągu.
// Zadania idą od łatwych przez średnie do trudnych.
module.exports = (h) => {
    const { nums, toks } = h;
    const R = String.raw;
    const IMIONA = ['Ola', 'Jan', 'Ewa', 'Igor', 'Zosia', 'Adam', 'Basia', 'Kuba', 'Lena', 'Antek', 'Maja', 'Olek', 'Hania', 'Stas',
        'Julka', 'Tymon', 'Nina', 'Bartek', 'Anna', 'Piotr', 'Zofia', 'Tomasz', 'Ida', 'Ignacy', 'Ala', 'Ewelina', 'Kacper', 'Wiktoria'];
    const TOWARY = ['chleb', 'mleko', 'maslo', 'jajka', 'ser', 'jablka', 'banany', 'woda', 'sok', 'herbata', 'kawa', 'cukier', 'maka',
        'ryz', 'makaron', 'pomidory', 'ogorki', 'szynka', 'jogurt', 'czekolada', 'ciastka', 'dzem', 'miod', 'olej', 'sol', 'pieprz'];
    const arr = (r, n, lo, hi) => Array.from({ length: n }, () => r.int(lo, hi));
    const fmt = (a) => `${a.length}\n${a.join(' ')}`;
    const lista = (a, pusto = 'PUSTO') => (a.length ? a.join(' ') : pusto);
    const palindrom = (v) => v.every((x, i) => x === v[v.length - 1 - i]);
    const perm = (r, n) => r.shuffle(Array.from({ length: n }, (_, i) => i + 1));
    const nastepna = (a) => {
        let i = a.length - 2;
        while (i >= 0 && a[i] >= a[i + 1]) i--;
        if (i < 0) { a.reverse(); return false; }
        let j = a.length - 1;
        while (a[j] <= a[i]) j--;
        [a[i], a[j]] = [a[j], a[i]];
        for (let l = i + 1, r = a.length - 1; l < r; l++, r--) [a[l], a[r]] = [a[r], a[l]];
        return true;
    };
    const posortowane = (r, n, lo, hi) => arr(r, n, lo, hi).sort((a, b) => a - b);

    return [
        // ================================================================ ROZGRZEWKA
        {
            id: 'vec-b-parzyste-nieparzyste', krok: 9, level: 'latwe',
            title: 'Parzyste czy nieparzyste?',
            short: 'Policz liczby parzyste i nieparzyste. Których jest więcej?',
            tags: ['vector', 'x % 2', 'trzy możliwe odpowiedzi'],
            statement: ['Wczytaj n liczb całkowitych do vectora. Policz, ile z nich jest parzystych, a ile nieparzystych. W pierwszym wierszu wypisz te dwie liczby. W drugim wypisz PARZYSTE, jeśli parzystych jest więcej, NIEPARZYSTE, jeśli więcej jest nieparzystych, albo REMIS.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['W pierwszym wierszu dwie liczby: ile parzystych i ile nieparzystych.', 'W drugim wierszu PARZYSTE, NIEPARZYSTE albo REMIS.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1 3 -2 7 0', note: 'Parzyste: −2 i 0. Nieparzyste: 1, 3 i 7.' }, { input: '2\n4 -5' }],
            hint: R`Parzystość sprawdzaj warunkiem x % 2 == 0 — dla liczb ujemnych reszta z dzielenia przez 2 może wyjść −1, więc warunek x % 2 == 1 by je przeoczył.`,
            tests: (r) => ['1\n0', '1\n-1', '4\n-3 -5 2 2', fmt(arr(r, 20, -9, 9)), fmt(arr(r, 1000, -1e9, 1e9)), fmt(arr(r, 1000, 0, 1).map((x) => 2 * x - 1))],
            solve: (inp) => { const v = nums(inp).slice(1); const p = v.filter((x) => x % 2 === 0).length; const q = v.length - p; return `${p} ${q}\n${p > q ? 'PARZYSTE' : q > p ? 'NIEPARZYSTE' : 'REMIS'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int p = 0, q = 0;
    for (auto x : v) {
        if (x % 2 == 0) p++;
        else q++;
    }
    cout << p << " " << q << "\n";
    if (p > q) cout << "PARZYSTE\n";
    else if (q > p) cout << "NIEPARZYSTE\n";
    else cout << "REMIS\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-pierwszy-i-ostatni', krok: 9, level: 'latwe',
            title: 'Pierwszy i ostatni',
            short: 'Ciąg można obracać w kółko. Jaka jest największa możliwa suma pierwszego i ostatniego elementu?',
            tags: ['sąsiedzi w kółku', 'a[n - 1] + a[0]', 'long long'],
            statement: ['Masz ciąg n liczb. Możesz go obracać dowolnie wiele razy: w jednym obrocie ostatni element przeskakuje na sam początek. Jaka jest największa suma pierwszego i ostatniego elementu, jaką możesz w ten sposób uzyskać?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — największa suma pierwszego i ostatniego elementu.'],
            constraints: ['2 ≤ n ≤ 10⁴', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '6\n1 9 2 8 3 1', note: 'Kolejne obroty: 1 9 2 8 3 1 (suma 1 + 1 = 2), 1 1 9 2 8 3 (4), 3 1 1 9 2 8 (11), 8 3 1 1 9 2 (10), 2 8 3 1 1 9 (11) i 9 2 8 3 1 1 (10). Najwięcej to 11.' }],
            hint: R`Wypisz na kartce wszystkie obroty ciągu z 6 elementów i zaznacz pierwszy i ostatni element. Zobaczysz, że zawsze są to dwaj sąsiedzi w kółku: a[i] i a[i + 1] albo para „przez koniec”: a[n - 1] i a[0]. Wystarczy więc sprawdzić n par sąsiadów. Suma dwóch liczb do 10⁹ nie mieści się w int.`,
            tests: (r) => ['2\n1 2', '2\n-1000000000 -1000000000', '3\n5 -1 5', fmt(arr(r, 20, -9, 9)), fmt(arr(r, 9000, -1e9, 1e9)), fmt(arr(r, 9000, -1e9, -1e8)), fmt(arr(r, 5000, 1e9 - 3, 1e9))],
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; let b = -Infinity; for (let i = 0; i < n; i++) b = Math.max(b, v[i] + v[(i + 1) % n]); return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long best = a[n - 1] + a[0];
    for (int i = 0; i + 1 < n; i++) best = max(best, a[i] + a[i + 1]);
    cout << best << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-szczyty-doliny', krok: 9, level: 'latwe',
            title: 'Szczyty i doliny',
            short: 'Wysokości na szlaku: znajdź szczyty (wyżej od obu sąsiadów) i doliny (niżej od obu).',
            tags: ['a[i - 1], a[i], a[i + 1]', 'dwa vectory wyników', 'BRAK'],
            statement: ['Na szlaku zmierzono wysokość w n punktach. Punkt (poza pierwszym i ostatnim) jest szczytem, jeśli leży ostro wyżej od obu sąsiednich punktów, a doliną — jeśli leży ostro niżej od obu. W pierwszym wierszu wypisz liczbę szczytów i liczbę dolin. W drugim wierszu wypisz numery szczytów (punkty numerujemy od 1), a w trzecim — numery dolin. Jeśli szczytów albo dolin nie ma, w odpowiednim wierszu wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — wysokości.'],
            output_format: ['Trzy wiersze: dwie liczby, numery szczytów, numery dolin.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ wysokość ≤ 10⁴'],
            examples: [{ input: '7\n1 3 2 2 5 1 4', note: 'Szczyty: punkt 2 (3) i punkt 5 (5). Dolina: punkt 6 (1). Punkty 3 i 4 (dwie dwójki) nie są dolinami, bo nie są ostro niżej od obu sąsiadów.' }],
            hint: R`Pętla po i od 1 do n - 2 (pierwszy i ostatni punkt pomijasz). Numery szczytów i dolin zbieraj w dwóch vectorach przez push_back(i + 1) — na koniec ich size() to szukane liczby.`,
            tests: (r) => ['1\n5', '2\n1 2', '3\n1 2 1', '3\n2 1 2', '5\n7 7 7 7 7', fmt(arr(r, 30, 0, 5)), fmt(arr(r, 1000, 0, 1e4)), fmt(Array.from({ length: 1000 }, (_, i) => (i % 2 ? 9 : 1)))],
            solve: (inp) => { const v = nums(inp).slice(1); const s = [], d = []; for (let i = 1; i + 1 < v.length; i++) { if (v[i] > v[i - 1] && v[i] > v[i + 1]) s.push(i + 1); if (v[i] < v[i - 1] && v[i] < v[i + 1]) d.push(i + 1); } return `${s.length} ${d.length}\n${lista(s, 'BRAK')}\n${lista(d, 'BRAK')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    vector<int> szczyty, doliny;
    for (int i = 1; i + 1 < n; i++) {
        if (a[i] > a[i - 1] && a[i] > a[i + 1]) szczyty.push_back(i + 1);
        if (a[i] < a[i - 1] && a[i] < a[i + 1]) doliny.push_back(i + 1);
    }
    cout << szczyty.size() << " " << doliny.size() << "\n";
    if (szczyty.empty()) cout << "BRAK";
    for (auto x : szczyty) cout << x << " ";
    cout << "\n";
    if (doliny.empty()) cout << "BRAK";
    for (auto x : doliny) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-przesuniecie', krok: 9, level: 'latwe',
            title: 'Przesunięcie w kółko',
            short: 'Przesuń ciąg o k miejsc w prawo w kółko. k może być gigantyczne — modulo ratuje sprawę.',
            tags: ['k % n', 'nowy vector', 'w[(i + k) % n] = a[i]'],
            statement: ['W jednym kroku każdy element ciągu przesuwa się o jedno miejsce w prawo, a ostatni element przeskakuje na początek. Wykonaj k takich kroków i wypisz ciąg.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: ciąg po k krokach.'],
            constraints: ['1 ≤ n ≤ 1000', '0 ≤ k ≤ 10¹⁸', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5 2\n1 2 3 4 5' }, { input: '3 1000000000000\n7 8 9', note: 'Po każdych 3 krokach ciąg wraca do początku. 10¹² dzieli się przez 3 z resztą 1.' }],
            hint: R`Po n krokach ciąg wygląda tak jak na początku, więc wystarczy wykonać k % n kroków — k trzymaj w long long. Nie rób kroków po jednym: element z miejsca i trafia od razu na miejsce (i + k) % n. Zbuduj nowy vector w o rozmiarze n i wpisz w[(i + k) % n] = a[i];.`,
            tests: (r) => ['1 1000000000000000000\n5', '4 0\n1 2 3 4', '4 4\n1 2 3 4', '4 7\n1 2 3 4', `10 ${r.int(0, 100)}\n${arr(r, 10, -9, 9).join(' ')}`, `1000 ${r.big(0, 10n ** 18n)}\n${arr(r, 1000, -1e9, 1e9).join(' ')}`, `997 1000000000000000000\n${arr(r, 997, 0, 9).join(' ')}`],
            solve: (inp) => { const t = toks(inp); const n = +t[0]; const k = Number(BigInt(t[1]) % BigInt(n)); const v = t.slice(2).map(Number); const w = Array(n); v.forEach((x, i) => { w[(i + k) % n] = x; }); return w.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    k %= n;
    vector<int> w(n);
    for (int i = 0; i < n; i++) w[(i + k) % n] = a[i];
    for (auto x : w) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-zera-na-koniec', krok: 9, level: 'latwe',
            title: 'Zera na koniec',
            short: 'Przenieś wszystkie zera na koniec ciągu, nie zmieniając kolejności pozostałych liczb.',
            tags: ['push_back', 'resize albo pętla', 'kolejność zostaje'],
            statement: ['Przenieś wszystkie zera na koniec ciągu. Pozostałe liczby mają zostać w tej samej kolejności, w jakiej były. Wypisz ciąg po zmianie.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jeden wiersz: n liczb.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n0 1 0 3 12 0 -4' }],
            hint: R`Zbierz liczby niezerowe do nowego vectora przez push_back. Potem dołóż na koniec tyle zer, ile brakuje do rozmiaru n — na przykład w.resize(n); dokłada właśnie zera.`,
            tests: (r) => ['1\n0', '1\n5', '3\n0 0 0', '3\n1 2 3', fmt(arr(r, 20, -2, 2)), fmt(arr(r, 1000, -1e9, 1e9).map((x) => (x % 3 === 0 ? 0 : x))), fmt(arr(r, 1000, 0, 1))],
            solve: (inp) => { const v = nums(inp).slice(1); const w = v.filter((x) => x !== 0); while (w.length < v.length) w.push(0); return w.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    vector<int> w;
    for (auto x : a) if (x != 0) w.push_back(x);
    w.resize(n);
    for (auto x : w) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-unikalne', krok: 9, level: 'latwe',
            title: 'Bez powtórzeń',
            short: 'Wypisz każdą różną liczbę raz, w kolejności pierwszego wystąpienia, razem z liczbą jej wystąpień.',
            tags: ['find', 'dwa vectory: wartości i liczniki', 'kolejność pierwszego wystąpienia'],
            statement: ['Wczytaj n liczb. Dla każdej różnej liczby wypisz wiersz z tą liczbą i tym, ile razy wystąpiła. Wiersze wypisz w kolejności, w jakiej liczby pojawiły się w ciągu po raz pierwszy.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Po jednym wierszu „liczba ile” dla każdej różnej liczby.'],
            constraints: ['1 ≤ n ≤ 1000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '7\n5 3 5 -1 3 5 8' }],
            hint: R`Liczby mogą być ogromne, więc zwykła tablica liczników odpada. Trzymaj dwa vectory: wartosci i ile. Dla każdej liczby x poszukaj jej w wartosci przez find. Jeśli jej nie ma — push_back do obu vectorów (licznik 1). Jeśli jest — zwiększ ile w tym samym miejscu: ile[it - wartosci.begin()]++.`,
            tests: (r) => ['1\n7', '4\n2 2 2 2', '5\n1 2 3 4 5', fmt(arr(r, 30, 0, 5)), fmt(arr(r, 1000, -1e9, 1e9)), fmt(arr(r, 1000, -20, 20))],
            solve: (inp) => { const v = nums(inp).slice(1); const m = new Map(); v.forEach((x) => m.set(x, (m.get(x) || 0) + 1)); return [...m].map(([x, c]) => `${x} ${c}`).join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> wartosci, ile;
    for (int i = 0; i < n; i++) {
        int x;
        cin >> x;
        auto it = find(wartosci.begin(), wartosci.end(), x);
        if (it == wartosci.end()) {
            wartosci.push_back(x);
            ile.push_back(1);
        } else {
            ile[it - wartosci.begin()]++;
        }
    }
    for (int i = 0; i < wartosci.size(); i++) cout << wartosci[i] << " " << ile[i] << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-lista-zakupow', krok: 9, level: 'latwe',
            title: 'Lista zakupów',
            short: 'DODAJ i USUN na liście zakupów — bez powtórzeń. vector napisów, find i erase.',
            tags: ['vector<string>', 'find', 'erase'],
            statement: ['Lista zakupów jest na początku pusta. Wykonaj q poleceń:', '• DODAJ nazwa — dopisz towar na koniec listy, ale tylko jeśli jeszcze go na niej nie ma,', '• USUN nazwa — usuń towar z listy, jeśli na niej jest (jeśli nie ma — nic nie rób).', 'Na koniec wypisz listę w jednym wierszu, towary oddzielone spacjami, albo PUSTA, jeśli lista jest pusta.'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy polecenie i nazwa towaru (małe litery).'],
            output_format: ['Jeden wiersz: lista zakupów albo PUSTA.'],
            constraints: ['1 ≤ q ≤ 1000', 'Nazwy mają od 1 do 15 liter.'],
            examples: [{ input: '6\nDODAJ chleb\nDODAJ mleko\nDODAJ chleb\nUSUN ser\nDODAJ ser\nUSUN chleb', note: 'Drugie DODAJ chleb nic nie robi. USUN ser na początku też nie.' }],
            hint: R`auto it = find(lista.begin(), lista.end(), nazwa);. Przy DODAJ dopisujesz tylko, gdy it == lista.end(). Przy USUN usuwasz tylko, gdy it != lista.end() — wtedy lista.erase(it); (erase przyjmuje strzałkę, którą dał Ci find).`,
            tests: (r) => {
                const t = (q, pd, pool) => `${q}\n${Array.from({ length: q }, () => `${r() < pd ? 'DODAJ' : 'USUN'} ${r.pick(pool)}`).join('\n')}`;
                return ['1\nUSUN chleb', '2\nDODAJ a\nUSUN a', '3\nDODAJ z\nDODAJ y\nDODAJ x', t(20, 0.6, TOWARY.slice(0, 6)), t(1000, 0.6, TOWARY), t(1000, 0.9, TOWARY), t(1000, 0.3, TOWARY.slice(0, 4))];
            },
            solve: (inp) => { const t = toks(inp); const q = +t[0]; const L = []; for (let i = 0; i < q; i++) { const c = t[1 + 2 * i], x = t[2 + 2 * i]; const k = L.indexOf(x); if (c === 'DODAJ' && k < 0) L.push(x); if (c === 'USUN' && k >= 0) L.splice(k, 1); } return lista(L, 'PUSTA'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    vector<string> lista;
    for (int i = 0; i < q; i++) {
        string c, x;
        cin >> c >> x;
        auto it = find(lista.begin(), lista.end(), x);
        if (c == "DODAJ") {
            if (it == lista.end()) lista.push_back(x);
        } else {
            if (it != lista.end()) lista.erase(it);
        }
    }
    if (lista.empty()) cout << "PUSTA";
    for (auto s : lista) cout << s << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-bilans', krok: 9, level: 'latwe',
            title: 'Bilans konta',
            short: 'Wpłaty i wypłaty dzień po dniu. Saldo na koniec, najniższe saldo i pierwszy dzień na minusie.',
            tags: ['sumy prefiksów', 'long long', 'pierwszy raz < 0'],
            statement: ['Konto ma na początku saldo 0. Przez n dni wykonano po jednej operacji: liczba dodatnia to wpłata, ujemna — wypłata. Saldo po dniu i to suma operacji z dni od 1 do i, czyli suma prefiksu. Wypisz: saldo na koniec, najniższe saldo po którymś z dni oraz numer pierwszego dnia, po którym saldo było ujemne (albo NIGDY).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb — operacje z kolejnych dni.'],
            output_format: ['Trzy wiersze: saldo końcowe, najniższe saldo, numer dnia albo NIGDY.'],
            constraints: ['1 ≤ n ≤ 10⁴', '−10⁹ ≤ każda operacja ≤ 10⁹'],
            examples: [{ input: '5\n100 -50 -70 30 -5', note: 'Salda po kolejnych dniach: 100, 50, −20, 10, 5. Najniższe −20, pierwszy raz na minusie po dniu 3.' }],
            hint: R`Trzymaj saldo w long long i po każdej operacji sprawdzaj dwie rzeczy: czy saldo jest mniejsze od najmniejszego dotąd (najniższe zacznij od salda po pierwszym dniu) i czy jest ujemne, a dnia na minusie jeszcze nie zapisałeś.`,
            tests: (r) => ['1\n-1', '1\n0', '3\n5 5 5', fmt(arr(r, 20, -10, 10)), fmt(arr(r, 10000, -1e9, 1e9)), fmt(arr(r, 5000, -1e6, 1e6 + 500)), fmt(Array(5000).fill(-1e9))],
            solve: (inp) => { const v = nums(inp).slice(1); let s = 0, mn = Infinity, d = 0; v.forEach((x, i) => { s += x; if (s < mn) mn = s; if (s < 0 && !d) d = i + 1; }); return `${s}\n${mn}\n${d || 'NIGDY'}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<long long> a(n);
    for (auto &x : a) cin >> x;
    long long saldo = 0, najnizsze = 0;
    int dzien = 0;
    for (int i = 0; i < n; i++) {
        saldo += a[i];
        if (i == 0 || saldo < najnizsze) najnizsze = saldo;
        if (saldo < 0 && dzien == 0) dzien = i + 1;
    }
    cout << saldo << "\n" << najnizsze << "\n";
    if (dzien == 0) cout << "NIGDY\n";
    else cout << dzien << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-nastepne-ustawienie', krok: 9, level: 'latwe',
            title: 'Następne ustawienie',
            short: 'Wypisz następną permutację ciągu w kolejności słownikowej — albo OSTATNIE, jeśli to już koniec.',
            tags: ['next_permutation', 'wartość zwracana', 'kolejność słownikowa'],
            statement: ['Wszystkie ustawienia (permutacje) liczb z ciągu ułożono w kolejności słownikowej. Wypisz ustawienie, które następuje zaraz po ciągu z wejścia. Jeśli ciąg z wejścia jest ostatnim ustawieniem, wypisz OSTATNIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb (mogą się powtarzać).'],
            output_format: ['Następne ustawienie albo OSTATNIE.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '3\n1 3 2' }, { input: '3\n3 2 1' }, { input: '4\n1 2 2 1', note: 'Z powtórzeniami też działa: po 1 2 2 1 jest 2 1 1 2.' }],
            hint: R`next_permutation(v.begin(), v.end()) zamienia vector w następne ustawienie i zwraca true — albo zwraca false, gdy ustawienie było ostatnie. Wystarczy jedno wywołanie w warunku if.`,
            tests: (r) => ['1\n5', '2\n1 2', '2\n2 1', '5\n5 4 3 2 1', '5\n1 5 4 3 2', fmt(perm(r, 10)), fmt(arr(r, 1000, 1, 1e9)), fmt(arr(r, 1000, 1, 3)), fmt(Array.from({ length: 1000 }, (_, i) => 1000 - i))],
            solve: (inp) => { const v = nums(inp).slice(1); return nastepna(v) ? v.join(' ') : 'OSTATNIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    if (next_permutation(v.begin(), v.end())) {
        for (auto x : v) cout << x << " ";
        cout << "\n";
    } else {
        cout << "OSTATNIE\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-b-kolejka', krok: 9, level: 'latwe',
            title: 'Kolejka do lekarza',
            short: 'PRZYCHODZI dołącza na koniec, PILNY wchodzi na początek, WCHODZI zabiera pierwszego. insert i erase.',
            tags: ['push_back', 'insert(v.begin(), …)', 'erase(v.begin())'],
            statement: ['Do lekarza ustawia się kolejka, na początku pusta. Wykonaj q poleceń:', '• PRZYCHODZI imie — pacjent staje na końcu kolejki,', '• PILNY imie — pacjent w pilnej sprawie staje na samym początku kolejki,', '• WCHODZI — pierwszy pacjent z kolejki wchodzi do gabinetu: wypisz jego imię (albo NIKT, jeśli kolejka jest pusta).', 'Na koniec wypisz w jednym wierszu osoby, które wciąż czekają, od pierwszej do ostatniej (albo PUSTO).'],
            input_format: ['W pierwszym wierszu liczba q.', 'W każdym z kolejnych q wierszy jedno polecenie.'],
            output_format: ['Po jednym wierszu dla każdego WCHODZI, a na końcu wiersz z kolejką.'],
            constraints: ['1 ≤ q ≤ 1000', 'Imiona składają się z liter i mają do 10 znaków.'],
            examples: [{ input: '6\nPRZYCHODZI Ola\nPRZYCHODZI Jan\nPILNY Ewa\nWCHODZI\nWCHODZI\nPRZYCHODZI Igor' }],
            hint: R`Kolejka to vector<string> k. PRZYCHODZI: k.push_back(imie). PILNY: k.insert(k.begin(), imie). WCHODZI: jeśli !k.empty(), wypisz k[0] (albo k.front()) i zrób k.erase(k.begin()).`,
            tests: (r) => {
                const t = (q, pw) => `${q}\n${Array.from({ length: q }, () => { const u = r(); return u < pw ? 'WCHODZI' : u < pw + (1 - pw) * 0.25 ? `PILNY ${r.pick(IMIONA)}` : `PRZYCHODZI ${r.pick(IMIONA)}`; }).join('\n')}`;
                return ['1\nWCHODZI', '2\nPILNY Ala\nPILNY Ola', t(20, 0.3), t(1000, 0.3), t(1000, 0.6), t(1000, 0.05)];
            },
            solve: (inp) => { const t = toks(inp); const q = +t[0]; let i = 1; const k = []; const out = []; for (let j = 0; j < q; j++) { const c = t[i++]; if (c === 'WCHODZI') out.push(k.length ? k.shift() : 'NIKT'); else if (c === 'PILNY') k.unshift(t[i++]); else k.push(t[i++]); } out.push(lista(k)); return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int q;
    cin >> q;
    vector<string> k;
    for (int i = 0; i < q; i++) {
        string c;
        cin >> c;
        if (c == "WCHODZI") {
            if (k.empty()) cout << "NIKT\n";
            else {
                cout << k.front() << "\n";
                k.erase(k.begin());
            }
        } else {
            string imie;
            cin >> imie;
            if (c == "PILNY") k.insert(k.begin(), imie);
            else k.push_back(imie);
        }
    }
    if (k.empty()) cout << "PUSTO";
    for (auto s : k) cout << s << " ";
    cout << "\n";
    return 0;
}`,
        },

        // ================================================================ ŚREDNIE
        {
            id: 'vec-b-wyliczanka', krok: 9, level: 'srednie',
            title: 'Wyliczanka',
            short: 'Dzieci w kółku, co k-te odpada. W jakiej kolejności odpadają? vector i erase z modulo.',
            tags: ['erase', 'pozycja % size()', 'kółko'],
            statement: ['n dzieci o numerach od 1 do n stoi w kółku. Liczenie zaczyna dziecko numer 1, mówiąc „1”, a kolejne dzieci w kółku mówią kolejne liczby. Dziecko, które powie k, odpada z gry, a liczenie zaczyna się od nowa (od „1”) od następnego dziecka w kółku. Gra trwa, aż odpadną wszystkie dzieci. Wypisz numery dzieci w kolejności odpadania.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jeden wiersz: n numerów w kolejności odpadania.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ k ≤ 10⁹'],
            examples: [{ input: '5 2', note: 'Odpadają kolejno: 2, 4, 1, 5, 3.' }, { input: '4 1' }],
            hint: R`Trzymaj dzieci w vectorze {1, 2, …, n} i pamiętaj numer pudełka p, od którego zaczyna się liczenie (na początku 0). Odpada dziecko z pudełka (p + k - 1) % v.size() — wypisz je i usuń przez erase. Po usunięciu na tym samym numerze stoi już następne dziecko, więc p to właśnie ten numer. Przy k do 10⁹ licz w long long.`,
            tests: () => ['1 1', '1 1000000000', '7 3', '10 10', '1000 2', '1000 1000000000', '999 37', '1000 1'],
            solve: (inp) => { const [n, k] = nums(inp); const v = Array.from({ length: n }, (_, i) => i + 1); let p = 0; const out = []; while (v.length) { p = (p + k - 1) % v.length; out.push(v.splice(p, 1)[0]); } return out.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<int> v(n);
    for (int i = 0; i < n; i++) v[i] = i + 1;
    long long p = 0;
    while (!v.empty()) {
        p = (p + k - 1) % (long long)v.size();
        cout << v[p] << " ";
        v.erase(v.begin() + p);
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-scalanie', krok: 9, level: 'srednie',
            title: 'Scalanie dwóch list',
            short: 'Dwie posortowane listy złącz w jedną posortowaną — dwoma wskaźnikami, bez sortowania od nowa.',
            tags: ['dwa wskaźniki', 'posortowane', 'push_back'],
            statement: ['Dwie listy wyników są już posortowane niemalejąco. Złącz je w jedną listę posortowaną niemalejąco i wypisz ją.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb pierwszej listy.', 'W trzecim wierszu liczba m, w czwartym m liczb drugiej listy.'],
            output_format: ['Jeden wiersz: n + m liczb.'],
            constraints: ['1 ≤ n, m ≤ 1000', '−10⁶ ≤ każda liczba ≤ 10⁶', 'Każda lista jest posortowana niemalejąco.'],
            examples: [{ input: '3\n1 4 9\n4\n2 4 5 10' }],
            hint: R`Postaw palec i na początku pierwszej listy, a palec j na początku drugiej. Dopóki obie listy mają elementy, dołóż do wyniku mniejszy z a[i] i b[j] i przesuń jego palec. Na koniec dołóż resztę tej listy, która się jeszcze nie skończyła. (Złączenie i sort też da dobry wynik — ale spróbuj dwóch palców, to podstawa wielu algorytmów.)`,
            check: (inp) => { const x = nums(inp); const n = x[0]; const a = x.slice(1, n + 1); const b = x.slice(n + 2); const ok = (v) => v.every((y, i) => !i || v[i - 1] <= y); return ok(a) && ok(b) ? null : 'nieposortowane'; },
            tests: (r) => ['1\n5\n1\n5', '2\n1 2\n2\n3 4', '2\n3 4\n2\n1 2', `${fmt(posortowane(r, 10, 0, 20))}\n${fmt(posortowane(r, 7, 0, 20))}`, `${fmt(posortowane(r, 1000, -1e6, 1e6))}\n${fmt(posortowane(r, 1000, -1e6, 1e6))}`, `${fmt(posortowane(r, 1000, 0, 3))}\n${fmt(posortowane(r, 3, 0, 3))}`],
            solve: (inp) => { const x = nums(inp); const n = x[0]; return x.slice(1, n + 1).concat(x.slice(n + 2)).sort((a, b) => a - b).join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    cin >> m;
    vector<int> b(m);
    for (auto &x : b) cin >> x;
    vector<int> w;
    int i = 0, j = 0;
    while (i < n && j < m) {
        if (a[i] <= b[j]) w.push_back(a[i++]);
        else w.push_back(b[j++]);
    }
    while (i < n) w.push_back(a[i++]);
    while (j < m) w.push_back(b[j++]);
    for (auto x : w) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-wspolne', krok: 9, level: 'srednie',
            title: 'Wspólne elementy',
            short: 'Liczby, które są na obu posortowanych listach — z powtórzeniami. Znowu dwa palce.',
            tags: ['dwa wskaźniki', 'posortowane', 'BRAK'],
            statement: ['Dwie listy liczb są posortowane niemalejąco. Wypisz ich część wspólną z powtórzeniami: liczba x pojawia się w wyniku tyle razy, ile wynosi mniejsza z liczb jej wystąpień na obu listach. Wynik wypisz niemalejąco, a jeśli jest pusty — wypisz BRAK.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb pierwszej listy.', 'W trzecim wierszu liczba m, w czwartym m liczb drugiej listy.'],
            output_format: ['Jeden wiersz: część wspólna albo BRAK.'],
            constraints: ['1 ≤ n, m ≤ 1000', '−10⁶ ≤ każda liczba ≤ 10⁶', 'Każda lista jest posortowana niemalejąco.'],
            examples: [{ input: '6\n1 2 2 2 5 7\n5\n2 2 3 7 7', note: 'Dwójki: 3 na pierwszej liście i 2 na drugiej — w wyniku 2 razy. Siódemka: 1 i 2 razy — w wyniku raz.' }],
            hint: R`Palce i i j na początkach list. Jeśli a[i] < b[j], przesuń i. Jeśli a[i] > b[j], przesuń j. Jeśli są równe — to element wspólny: dołóż go do wyniku i przesuń oba palce.`,
            check: (inp) => { const x = nums(inp); const n = x[0]; const a = x.slice(1, n + 1); const b = x.slice(n + 2); const ok = (v) => v.every((y, i) => !i || v[i - 1] <= y); return ok(a) && ok(b) ? null : 'nieposortowane'; },
            tests: (r) => ['1\n5\n1\n5', '2\n1 2\n2\n3 4', '3\n1 1 1\n2\n1 1', `${fmt(posortowane(r, 15, 0, 6))}\n${fmt(posortowane(r, 12, 0, 6))}`, `${fmt(posortowane(r, 1000, -1e6, 1e6))}\n${fmt(posortowane(r, 1000, -1e6, 1e6))}`, `${fmt(posortowane(r, 1000, 0, 30))}\n${fmt(posortowane(r, 1000, 0, 30))}`],
            solve: (inp) => { const x = nums(inp); const n = x[0]; const a = x.slice(1, n + 1); const b = x.slice(n + 2); const w = []; let i = 0, j = 0; while (i < a.length && j < b.length) { if (a[i] < b[j]) i++; else if (a[i] > b[j]) j++; else { w.push(a[i]); i++; j++; } } return lista(w, 'BRAK'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    cin >> m;
    vector<int> b(m);
    for (auto &x : b) cin >> x;
    vector<int> w;
    int i = 0, j = 0;
    while (i < n && j < m) {
        if (a[i] < b[j]) i++;
        else if (a[i] > b[j]) j++;
        else {
            w.push_back(a[i]);
            i++;
            j++;
        }
    }
    if (w.empty()) cout << "BRAK";
    for (auto x : w) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-wycieczka', krok: 9, level: 'srednie',
            title: 'Wycieczka z budżetem',
            short: 'Najdłuższy ciąg kolejnych dni, na który wystarczy budżetu. Okno, które rośnie i kurczy się.',
            tags: ['podtablica', 'dwa wskaźniki', 'okno zmiennej długości'],
            statement: ['Wycieczka może trwać kilka kolejnych dni z n możliwych. Dzień numer i kosztuje c[i] złotych (dni numerujemy od 1). Masz B złotych. Znajdź najdłuższy ciąg kolejnych dni, którego łączny koszt nie przekracza B. Wypisz jego długość i numer pierwszego dnia; jeśli takich ciągów jest kilka, wybierz ten, który zaczyna się najwcześniej. Jeśli nie stać Cię nawet na jeden dzień, wypisz 0.'],
            input_format: ['W pierwszym wierszu liczby n i B.', 'W drugim wierszu n liczb — koszty dni.'],
            output_format: ['Dwie liczby: długość i pierwszy dzień — albo samo 0.'],
            constraints: ['1 ≤ n ≤ 10⁴', '1 ≤ c[i] ≤ 10⁶', '1 ≤ B ≤ 10¹⁰'],
            examples: [{ input: '7 10\n4 2 5 1 3 6 1', note: 'Żadne 4 kolejne dni nie mieszczą się w budżecie (na przykład dni 2–5 kosztują 11). Trzy dni już się mieszczą — pierwszy taki ciąg to dni 2–4: 2 + 5 + 1 = 8.' }, { input: '2 3\n5 4' }],
            hint: R`Koszty są dodatnie, więc działa okno z dwoma wskaźnikami: przesuwaj prawy koniec r i dodawaj c[r] do sumy; dopóki suma > B, odejmuj c[l] i przesuwaj lewy koniec l. Po tym okno (l, r) to najdłuższy dobry ciąg kończący się w dniu r. Aktualizuj wynik tylko przy ostro większej długości.`,
            tests: (r) => ['1 1\n1', '1 1\n2', '5 100\n1 2 3 4 5', `20 15\n${arr(r, 20, 1, 9).join(' ')}`, `10000 ${r.int(1e6, 1e8)}\n${arr(r, 10000, 1, 1e6).join(' ')}`, `10000 10000000000\n${arr(r, 10000, 1, 1e6).join(' ')}`, `10000 500\n${arr(r, 10000, 1, 1000).join(' ')}`],
            solve: (inp) => { const a = nums(inp); const [n, B] = a; const c = a.slice(2); let l = 0, s = 0, bd = 0, bs = 0; for (let r = 0; r < n; r++) { s += c[r]; while (s > B) s -= c[l++]; if (r - l + 1 > bd) { bd = r - l + 1; bs = l; } } return bd ? `${bd} ${bs + 1}` : '0'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long B;
    cin >> n >> B;
    vector<long long> c(n);
    for (auto &x : c) cin >> x;
    int l = 0, best = 0, start = 0;
    long long s = 0;
    for (int r = 0; r < n; r++) {
        s += c[r];
        while (s > B) s -= c[l++];
        if (r - l + 1 > best) {
            best = r - l + 1;
            start = l;
        }
    }
    if (best == 0) cout << "0\n";
    else cout << best << " " << start + 1 << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-prawie-palindrom', krok: 9, level: 'srednie',
            title: 'Prawie palindrom',
            short: 'Czy usuwając najwyżej jeden element, zrobisz z ciągu palindrom? Którego elementu się pozbyć?',
            tags: ['palindrom', 'erase albo pominięcie', 'najmniejszy numer'],
            statement: ['Jeśli ciąg już jest palindromem, wypisz PALINDROM. Jeśli nie, sprawdź, czy da się z niego usunąć dokładnie jeden element tak, by powstał palindrom. Jeśli się da, wypisz USUN i najmniejszy numer elementu (licząc od 1), którego usunięcie daje palindrom. Jeśli się nie da, wypisz NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['PALINDROM, USUN p albo NIE.'],
            constraints: ['1 ≤ n ≤ 2000', '1 ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5\n1 2 3 2 1' }, { input: '5\n1 2 3 1 2', note: 'Bez żadnego pojedynczego elementu nie powstaje palindrom.' }, { input: '4\n3 1 2 3', note: 'Usunięcie 1 (numer 2) daje 3 2 3, a usunięcie 2 (numer 3) daje 3 1 3. Wypisujemy mniejszy numer.' }],
            hint: R`Najprościej: dla każdego p od 1 do n zbuduj vector bez elementu p (kopia i erase albo pętla z pominięciem) i sprawdź, czy jest palindromem. To około n² = 4 miliony kroków — szybko. Pierwsze znalezione p jest najmniejsze.`,
            tests: (r) => { const h1 = arr(r, 999, 1, 5); const p = h1.concat([3], h1.slice().reverse()); const q = p.slice(); q.splice(400, 0, 9); return ['1\n5', '2\n1 2', '3\n1 2 2', fmt(p), fmt(q), fmt(arr(r, 2000, 1, 2)), fmt(arr(r, 50, 1, 2)), '2000\n' + Array(2000).fill(7).join(' ')]; },
            solve: (inp) => { const v = nums(inp).slice(1); if (palindrom(v)) return 'PALINDROM'; for (let p = 0; p < v.length; p++) { const w = v.slice(0, p).concat(v.slice(p + 1)); if (palindrom(w)) return `USUN ${p + 1}`; } return 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    vector<int> r = a;
    reverse(r.begin(), r.end());
    if (r == a) {
        cout << "PALINDROM\n";
        return 0;
    }
    for (int p = 0; p < n; p++) {
        vector<int> w;
        for (int i = 0; i < n; i++) if (i != p) w.push_back(a[i]);
        bool pal = true;
        int m = w.size();
        for (int i = 0; i < m / 2; i++) if (w[i] != w[m - 1 - i]) pal = false;
        if (pal) {
            cout << "USUN " << p + 1 << "\n";
            return 0;
        }
    }
    cout << "NIE\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-obrot-palindrom', krok: 9, level: 'srednie',
            title: 'Obrót w palindrom',
            short: 'Czy któryś obrót ciągu w kółko jest palindromem? Znajdź najmniejszy taki obrót.',
            tags: ['obrót przez modulo', 'palindrom', 'n obrotów'],
            statement: ['Obrót ciągu o k w lewo przenosi k pierwszych elementów — w tej samej kolejności — na koniec. Znajdź najmniejsze k (0 ≤ k ≤ n − 1), dla którego obrócony ciąg jest palindromem, i wypisz je. Jeśli żaden obrót nie jest palindromem, wypisz NIE.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Liczba k albo NIE.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ każda liczba ≤ 100'],
            examples: [{ input: '5\n2 1 1 2 3', note: 'Obrót o 2: 1 2 3 2 1 — palindrom.' }, { input: '3\n1 2 3' }],
            hint: R`Po obrocie o k element numer i to a[(i + k) % n]. Dla każdego k od 0 do n - 1 sprawdź lustrzane pary w obróconym ciągu — nie musisz go nawet budować, wystarczy porównywać a[(i + k) % n] z a[(n - 1 - i + k) % n].`,
            tests: (r) => { const h1 = arr(r, 499, 1, 9); const p = h1.concat([5], h1.slice().reverse()); const k = r.int(1, 998); const obr = p.slice(k).concat(p.slice(0, k)); return ['1\n4', '2\n1 2', '2\n3 3', '4\n1 2 2 3', fmt(obr), fmt(arr(r, 1000, 1, 2)), fmt(arr(r, 1000, 1, 100)), fmt(Array.from({ length: 1000 }, (_, i) => (i % 2) + 1))]; },
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; for (let k = 0; k < n; k++) { let ok = true; for (let i = 0; i < n >> 1 && ok; i++) if (v[(i + k) % n] !== v[(n - 1 - i + k) % n]) ok = false; if (ok) return String(k); } return 'NIE'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    for (int k = 0; k < n; k++) {
        bool pal = true;
        for (int i = 0; i < n / 2; i++) {
            if (a[(i + k) % n] != a[(n - 1 - i + k) % n]) pal = false;
        }
        if (pal) {
            cout << k << "\n";
            return 0;
        }
    }
    cout << "NIE\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-druzyna', krok: 9, level: 'srednie',
            title: 'Drużyna marzeń',
            short: 'Każdy zawodnik ma cenę i siłę. Kup najsilniejszą drużynę w budżecie — sprawdź wszystkie podzbiory.',
            tags: ['wszystkie podzbiory', 'maski', 'dwa kryteria'],
            statement: ['Na rynku jest n zawodników; każdy ma cenę i siłę. Masz budżet B. Wybierz dowolny zestaw zawodników (może być pusty), którego łączna cena nie przekracza B, tak by łączna siła była jak największa. Wypisz tę największą siłę i najmniejszą cenę, za jaką da się ją uzyskać.'],
            input_format: ['W pierwszym wierszu liczby n i B.', 'W każdym z kolejnych n wierszy dwie liczby: cena i siła zawodnika.'],
            output_format: ['Dwie liczby: największa siła i najmniejsza cena takiej drużyny.'],
            constraints: ['1 ≤ n ≤ 20', '1 ≤ cena ≤ 10⁶', '1 ≤ siła ≤ 10⁶', '0 ≤ B ≤ 2 · 10⁷'],
            examples: [{ input: '4 10\n5 7\n4 5\n6 8\n3 2', note: 'Zawodnicy 1 i 2 (cena 9) mają siłę 12. Zawodnicy 2 i 3 (cena 10) mają siłę 13. Lepiej się nie da.' }],
            hint: R`Dla każdej maski od 0 do 2ⁿ − 1 policz łączną cenę i siłę wybranych zawodników. Gdy cena ≤ B, porównaj: lepsza jest większa siła, a przy równej sile — mniejsza cena. Ceny i siły trzymaj w vector<pair<int, int>> albo w dwóch vectorach.`,
            tests: (r) => {
                const t = (n, B, cm, sm) => `${n} ${B}\n${Array.from({ length: n }, () => `${r.int(1, cm)} ${r.int(1, sm)}`).join('\n')}`;
                return ['1 0\n1 1', '1 5\n5 9', '3 3\n1 1\n1 1\n1 1', t(10, 30, 10, 20), t(20, 50, 10, 10), t(20, 5000000, 1e6, 1e6), t(20, 20000000, 1e6, 1e6), t(20, 7, 5, 1e6)];
            },
            solve: (inp) => { const a = nums(inp); const [n, B] = a; let bs = 0, bc = 0; for (let m = 0; m < 1 << n; m++) { let c = 0, s = 0; for (let i = 0; i < n; i++) if ((m >> i) & 1) { c += a[2 + 2 * i]; s += a[3 + 2 * i]; } if (c <= B && (s > bs || (s === bs && c < bc))) { bs = s; bc = c; } } return `${bs} ${bc}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long B;
    cin >> n >> B;
    vector<pair<int, int>> z(n);
    for (auto &[cena, sila] : z) cin >> cena >> sila;
    int ile = 1;
    for (int i = 0; i < n; i++) ile *= 2;
    long long bestS = 0, bestC = 0;
    for (int maska = 0; maska < ile; maska++) {
        long long c = 0, s = 0;
        int m = maska;
        for (int i = 0; i < n; i++) {
            if (m % 2 == 1) {
                c += z[i].first;
                s += z[i].second;
            }
            m /= 2;
        }
        if (c <= B && (s > bestS || (s == bestS && c < bestC))) {
            bestS = s;
            bestC = c;
        }
    }
    cout << bestS << " " << bestC << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-tasowanie', krok: 9, level: 'srednie',
            title: 'Tasowanie kart',
            short: 'Idealne tasowanie: połówki na przemian. Po ilu tasowaniach talia wróci do porządku?',
            tags: ['nowy vector w każdej rundzie', 'v == start', 'permutacja'],
            statement: ['Talia ma 2n kart, na początku ułożonych od góry: 1, 2, 3, …, 2n. Idealne tasowanie dzieli talię na górną połowę (pierwsze n kart) i dolną połowę (pozostałe n kart), a potem układa karty na przemian: pierwsza karta górnej połowy, pierwsza karta dolnej, druga górnej, druga dolnej, i tak dalej. Po ilu idealnych tasowaniach (co najmniej jednym) talia po raz pierwszy wróci do ułożenia 1, 2, …, 2n? W drugim wierszu wypisz talię po jednym tasowaniu.'],
            input_format: ['Jedna liczba n.'],
            output_format: ['W pierwszym wierszu liczba tasowań.', 'W drugim wierszu 2n liczb — talia po pierwszym tasowaniu.'],
            constraints: ['1 ≤ n ≤ 1000'],
            examples: [{ input: '3', note: 'Talia 1 2 3 4 5 6 po tasowaniu: 1 4 2 5 3 6. Po drugim: 1 5 4 3 2 6. Po trzecim: 1 3 5 2 4 6. Po czwartym wraca do porządku.' }],
            hint: R`Tasowanie to nowy vector w: w[2i] = v[i] i w[2i + 1] = v[n + i]. Zapamiętaj początkową talię w osobnym vectorze start, tasuj w pętli i po każdym tasowaniu sprawdzaj v == start. Tasowań nie będzie więcej niż 2n, a każde to 2n kroków — razem kilka milionów, szybko.`,
            tests: () => ['1', '2', '4', '26', '100', '512', '999', '1000'],
            solve: (inp) => { const n = nums(inp)[0]; const s = Array.from({ length: 2 * n }, (_, i) => i + 1); const tas = (v) => { const w = Array(2 * n); for (let i = 0; i < n; i++) { w[2 * i] = v[i]; w[2 * i + 1] = v[n + i]; } return w; }; const pierwsza = tas(s); let v = pierwsza, t = 1; while (!v.every((x, i) => x === i + 1)) { v = tas(v); t++; } return `${t}\n${pierwsza.join(' ')}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> start(2 * n);
    for (int i = 0; i < 2 * n; i++) start[i] = i + 1;
    vector<int> v = start, pierwsza;
    int ile = 0;
    do {
        vector<int> w(2 * n);
        for (int i = 0; i < n; i++) {
            w[2 * i] = v[i];
            w[2 * i + 1] = v[n + i];
        }
        v = w;
        ile++;
        if (ile == 1) pierwsza = v;
    } while (v != start);
    cout << ile << "\n";
    for (auto x : pierwsza) cout << x << " ";
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-sumy-prostokatow', krok: 9, level: 'srednie',
            title: 'Sumy prostokątów',
            short: 'Tabela liczb i pytania o sumy prostokątów. Sumy prefiksowe w dwóch wymiarach w vectorze 2D.',
            tags: ['vector 2D', 'sumy prefiksowe 2D', 'long long'],
            statement: ['Wczytaj tabelę liczb o n wierszach i m kolumnach, a potem q pytań. Każde pytanie to cztery liczby w1 k1 w2 k2 (wiersze i kolumny numerujemy od 1, w1 ≤ w2, k1 ≤ k2) i znaczy: ile wynosi suma liczb w prostokącie od wiersza w1 do w2 i od kolumny k1 do k2? Odpowiedz na każde pytanie w osobnym wierszu.'],
            input_format: ['W pierwszym wierszu liczby n i m, a potem n wierszy po m liczb.', 'Dalej liczba q i q wierszy z pytaniami.'],
            output_format: ['q wierszy — odpowiedzi.'],
            constraints: ['1 ≤ n, m ≤ 100', '1 ≤ q ≤ 1000', '−1000 ≤ każda liczba ≤ 1000'],
            examples: [{ input: '3 3\n1 2 3\n4 5 6\n7 8 9\n3\n1 1 3 3\n2 2 3 3\n1 3 3 3' }],
            hint: R`Niech p[w][k] to suma prostokąta od (1, 1) do (w, k): vector<vector<long long>> p(n + 1, vector<long long>(m + 1, 0)); i p[w][k] = t[w][k] + p[w - 1][k] + p[w][k - 1] - p[w - 1][k - 1]. Narysuj to: róg (w - 1, k - 1) policzyłbyś dwa razy. Odpowiedź to p[w2][k2] - p[w1 - 1][k2] - p[w2][k1 - 1] + p[w1 - 1][k1 - 1].`,
            check: (inp) => { const a = nums(inp); const [n, m] = a; const q = a[2 + n * m]; for (let i = 0; i < q; i++) { const [w1, k1, w2, k2] = a.slice(3 + n * m + 4 * i, 7 + n * m + 4 * i); if (!(1 <= w1 && w1 <= w2 && w2 <= n && 1 <= k1 && k1 <= k2 && k2 <= m)) return 'złe pytanie'; } return null; },
            tests: (r) => {
                const t = (n, m, q, lo, hi) => { const rows = Array.from({ length: n }, () => arr(r, m, lo, hi).join(' ')); const qs = Array.from({ length: q }, () => { const a = r.int(1, n), b = r.int(1, n), c = r.int(1, m), d = r.int(1, m); return `${Math.min(a, b)} ${Math.min(c, d)} ${Math.max(a, b)} ${Math.max(c, d)}`; }); return `${n} ${m}\n${rows.join('\n')}\n${q}\n${qs.join('\n')}`; };
                return ['1 1\n-5\n1\n1 1 1 1', t(4, 5, 10, -9, 9), t(100, 100, 1000, -1000, 1000), t(100, 100, 1000, 1000, 1000), t(1, 100, 50, -1000, 1000), t(100, 1, 50, -1000, 1000)];
            },
            solve: (inp) => { const a = nums(inp); const [n, m] = a; const p = Array.from({ length: n + 1 }, () => Array(m + 1).fill(0)); for (let w = 1; w <= n; w++) for (let k = 1; k <= m; k++) p[w][k] = a[2 + (w - 1) * m + (k - 1)] + p[w - 1][k] + p[w][k - 1] - p[w - 1][k - 1]; const q = a[2 + n * m]; const out = []; for (let i = 0; i < q; i++) { const [w1, k1, w2, k2] = a.slice(3 + n * m + 4 * i, 7 + n * m + 4 * i); out.push(p[w2][k2] - p[w1 - 1][k2] - p[w2][k1 - 1] + p[w1 - 1][k1 - 1]); } return out.join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<vector<long long>> p(n + 1, vector<long long>(m + 1, 0));
    for (int w = 1; w <= n; w++) {
        for (int k = 1; k <= m; k++) {
            long long x;
            cin >> x;
            p[w][k] = x + p[w - 1][k] + p[w][k - 1] - p[w - 1][k - 1];
        }
    }
    int q;
    cin >> q;
    for (int i = 0; i < q; i++) {
        int w1, k1, w2, k2;
        cin >> w1 >> k1 >> w2 >> k2;
        cout << p[w2][k2] - p[w1 - 1][k2] - p[w2][k1 - 1] + p[w1 - 1][k1 - 1] << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-b-palindromiczny-podzbior', krok: 9, level: 'srednie',
            title: 'Najdłuższy palindromiczny podzbiór',
            short: 'Wybierz elementy (kolejność zostaje) tak, by tworzyły jak najdłuższy palindrom. Podzbiory + palindromy.',
            tags: ['wszystkie podzbiory', 'palindrom', 'maski'],
            statement: ['Z ciągu n liczb wybieramy niektóre elementy, nie zmieniając ich kolejności (czyli podzbiór, jak w części 7 lekcji). Wybrane elementy mają tworzyć palindrom. Jaka jest największa możliwa długość takiego palindromu i na ile sposobów można go wybrać? Dwa sposoby są różne, jeśli wybierają inne miejsca w ciągu — nawet jeśli dają te same liczby.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Dwie liczby: największa długość i liczba sposobów.'],
            constraints: ['1 ≤ n ≤ 15', '1 ≤ każda liczba ≤ 9'],
            examples: [{ input: '5\n1 2 3 2 4', note: 'Najdłuższy jest 2 3 2 (miejsca 2, 3 i 4) — tylko jeden sposób.' }, { input: '3\n1 2 3', note: 'Każdy pojedynczy element to palindrom długości 1 — trzy sposoby.' }],
            hint: R`Przejrzyj wszystkie niepuste maski. Dla każdej zbierz wybrane elementy do vectora przez push_back i sprawdź, czy to palindrom. Jeśli tak — porównaj jego długość z najlepszą: dłuższy zeruje licznik sposobów, równy go zwiększa.`,
            tests: (r) => ['1\n5', '2\n7 7', '4\n1 2 1 2', fmt(arr(r, 8, 1, 3)), fmt(arr(r, 15, 1, 9)), fmt(arr(r, 15, 1, 2)), '15\n' + Array(15).fill(4).join(' ')],
            solve: (inp) => { const v = nums(inp).slice(1); const n = v.length; let bd = 0, c = 0; for (let m = 1; m < 1 << n; m++) { const w = v.filter((_, i) => (m >> i) & 1); if (!palindrom(w)) continue; if (w.length > bd) { bd = w.length; c = 1; } else if (w.length === bd) c++; } return `${bd} ${c}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    int ile = 1;
    for (int i = 0; i < n; i++) ile *= 2;
    int best = 0, sposoby = 0;
    for (int maska = 1; maska < ile; maska++) {
        vector<int> w;
        int m = maska;
        for (int i = 0; i < n; i++) {
            if (m % 2 == 1) w.push_back(a[i]);
            m /= 2;
        }
        vector<int> r = w;
        reverse(r.begin(), r.end());
        if (r != w) continue;
        if ((int)w.size() > best) {
            best = w.size();
            sposoby = 1;
        } else if ((int)w.size() == best) {
            sposoby++;
        }
    }
    cout << best << " " << sposoby << "\n";
    return 0;
}`,
        },

        // ================================================================ TRUDNE
        {
            id: 'vec-b-podzielne-sumy', krok: 9, level: 'trudne',
            title: 'Sumy podzielne przez k',
            short: 'Ile podtablic ma sumę podzielną przez k? Reszty z sum prefiksów i liczniki — uwaga na liczby ujemne!',
            tags: ['sumy prefiksów', 'modulo z ujemnymi', 'liczniki reszt'],
            statement: ['Policz, ile podtablic ciągu n liczb całkowitych (kawałków złożonych z elementów stojących obok siebie) ma sumę podzielną przez k.'],
            input_format: ['W pierwszym wierszu liczby n i k.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — liczba takich podtablic.'],
            constraints: ['1 ≤ n ≤ 10⁴', '1 ≤ k ≤ 10⁶', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '5 3\n1 2 3 4 5', note: 'Podzielne przez 3 sumy mają: 1 2, 3, 1 2 3, 4 5, 3 4 5, 2 3 4 i 1 2 3 4 5 — razem 7.' }, { input: '3 2\n-1 -1 2' }],
            hint: R`Suma podtablicy (I, J) to p[J + 1] - p[I]. Dzieli się przez k dokładnie wtedy, gdy p[J + 1] i p[I] dają tę samą resztę z dzielenia przez k. Policz więc, ile sum prefiksów (razem z p[0] = 0) daje każdą resztę — każda para prefiksów o tej samej reszcie to jedna podtablica. Uwaga: dla ujemnych sum % daje ujemną resztę; poprawną dostaniesz przez ((p % k) + k) % k.`,
            tests: (r) => ['1 1\n5', '1 7\n-7', '1 7\n-3', '4 2\n0 0 0 0', `30 4\n${arr(r, 30, -10, 10).join(' ')}`, `10000 7\n${arr(r, 10000, -1e9, 1e9).join(' ')}`, `10000 1000000\n${arr(r, 10000, -1e9, 1e9).join(' ')}`, `10000 1\n${arr(r, 10000, -9, 9).join(' ')}`, `5000 13\n${arr(r, 5000, -1e9, -1e8).join(' ')}`],
            solve: (inp) => { const t = toks(inp); const n = +t[0]; const k = BigInt(t[1]); const m = new Map(); let p = 0n; m.set(0n, 1); let c = 0; for (let i = 0; i < n; i++) { p += BigInt(t[2 + i]); const r0 = ((p % k) + k) % k; const x = m.get(r0) || 0; c += x; m.set(r0, x + 1); } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, k;
    cin >> n >> k;
    vector<long long> ile(k, 0);
    ile[0] = 1;
    long long p = 0, wynik = 0;
    for (int i = 0; i < n; i++) {
        long long x;
        cin >> x;
        p += x;
        long long r = ((p % k) + k) % k;
        wynik += ile[r];
        ile[r]++;
    }
    cout << wynik << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-anagramy', krok: 9, level: 'trudne',
            title: 'Grupy anagramów',
            short: 'Pogrupuj słowa, które są swoimi anagramami. Posortowane litery to klucz grupy.',
            tags: ['sort na napisie', 'vector<vector<string>>', 'grupy w kolejności pojawienia się'],
            statement: ['Dwa słowa są anagramami, jeśli składają się z tych samych liter w innej (albo tej samej) kolejności — jedno jest permutacją drugiego. Podziel n słów na grupy anagramów. W pierwszym wierszu wypisz liczbę grup. Potem wypisz każdą grupę w osobnym wierszu: grupy w kolejności, w jakiej pojawiło się ich pierwsze słowo, a słowa w grupie — w kolejności z wejścia (powtórzone słowo wypisz tyle razy, ile wystąpiło).'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów z małych liter.'],
            output_format: ['Liczba grup, a potem po jednym wierszu na grupę.'],
            constraints: ['1 ≤ n ≤ 1000', 'Każde słowo ma od 1 do 10 liter.'],
            examples: [{ input: '7\nkot tok lis kto sil pies kot' }],
            hint: R`Kluczem słowa jest słowo z posortowanymi literami: string klucz = s; sort(klucz.begin(), klucz.end());. Trzymaj vector<string> klucze i vector<vector<string>> grupy. Dla każdego słowa szukaj jego klucza przez find: jeśli go nie ma, dołóż nowy klucz i nową grupę; jeśli jest, dołóż słowo do grupy o tym samym numerze.`,
            tests: (r) => {
                const baza = Array.from({ length: 40 }, () => r.word(r.int(2, 6), 'abcdefgh'));
                const mieszaj = (w) => r.shuffle(w.split('')).join('');
                return ['1\nabc', '3\nab ba ab', '4\na b c d', `30\n${Array.from({ length: 30 }, () => mieszaj(r.pick(baza.slice(0, 6)))).join(' ')}`, `1000\n${Array.from({ length: 1000 }, () => mieszaj(r.pick(baza))).join(' ')}`, `1000\n${Array.from({ length: 1000 }, () => r.word(r.int(1, 10), 'abc')).join(' ')}`];
            },
            solve: (inp) => { const w = toks(inp).slice(1); const m = new Map(); for (const s of w) { const k = s.split('').sort().join(''); if (!m.has(k)) m.set(k, []); m.get(k).push(s); } return [String(m.size), ...[...m.values()].map((g) => g.join(' '))].join('\n'); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> klucze;
    vector<vector<string>> grupy;
    for (int i = 0; i < n; i++) {
        string s;
        cin >> s;
        string klucz = s;
        sort(klucz.begin(), klucz.end());
        auto it = find(klucze.begin(), klucze.end(), klucz);
        if (it == klucze.end()) {
            klucze.push_back(klucz);
            grupy.push_back({s});
        } else {
            grupy[it - klucze.begin()].push_back(s);
        }
    }
    cout << grupy.size() << "\n";
    for (auto g : grupy) {
        for (auto s : g) cout << s << " ";
        cout << "\n";
    }
    return 0;
}`,
        },
        {
            id: 'vec-b-najmniej-zamian', krok: 9, level: 'trudne',
            title: 'Najmniej zamian',
            short: 'Ile najmniej zamian dwóch elementów trzeba, by posortować permutację? Policz cykle.',
            tags: ['permutacja', 'cykle', 'vector odwiedzonych'],
            statement: ['Dostajesz permutację liczb od 1 do n. W jednym ruchu możesz zamienić miejscami dowolne dwa elementy. Ile najmniej ruchów potrzeba, żeby ułożyć ciąg rosnąco (1, 2, …, n)? W pierwszym wierszu wypisz liczbę cykli permutacji, a w drugim — najmniejszą liczbę ruchów.', 'Cykl tworzą miejsca, które „wskazują” na siebie po kolei: z miejsca i idziemy na miejsce p[i], stamtąd na p[p[i]] i tak dalej, aż wrócimy do i. Element stojący na swoim miejscu to cykl długości 1.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu permutacja liczb od 1 do n.'],
            output_format: ['Dwa wiersze: liczba cykli i najmniejsza liczba ruchów.'],
            constraints: ['1 ≤ n ≤ 10⁴'],
            examples: [{ input: '5\n2 3 1 5 4', note: 'Cykle: 1 → 2 → 3 → 1 oraz 4 → 5 → 4. Cykl długości d naprawia się d − 1 zamianami: 2 + 1 = 3.' }],
            hint: R`Zrób vector<bool> odw(n + 1, false);. Dla każdego nieodwiedzonego i idź po cyklu: j = i, potem j = p[j], zaznaczając odwiedzone, aż wrócisz do odwiedzonego. Każde takie wejście to nowy cykl. Cykl długości d potrzebuje d − 1 zamian, więc razem: n minus liczba cykli.`,
            tests: (r) => ['1\n1', '2\n2 1', '4\n1 2 3 4', '4\n4 3 2 1', fmt(perm(r, 10)), fmt(perm(r, 10000)), fmt(Array.from({ length: 10000 }, (_, i) => ((i + 1) % 10000) + 1)), fmt(Array.from({ length: 9999 }, (_, i) => (i % 3 === 2 ? i - 1 : i + 2)))],
            solve: (inp) => { const p = [0].concat(nums(inp).slice(1)); const n = p.length - 1; const o = Array(n + 1).fill(false); let c = 0; for (let i = 1; i <= n; i++) { if (o[i]) continue; c++; let j = i; while (!o[j]) { o[j] = true; j = p[j]; } } return `${c}\n${n - c}`; },
            check: (inp) => { const v = nums(inp).slice(1); const s = new Set(v); return s.size === v.length && v.every((x) => x >= 1 && x <= v.length) ? null : 'to nie permutacja'; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> p(n + 1);
    for (int i = 1; i <= n; i++) cin >> p[i];
    vector<bool> odw(n + 1, false);
    int cykle = 0;
    for (int i = 1; i <= n; i++) {
        if (odw[i]) continue;
        cykle++;
        int j = i;
        while (!odw[j]) {
            odw[j] = true;
            j = p[j];
        }
    }
    cout << cykle << "\n" << n - cykle << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-k-ta-permutacja', krok: 9, level: 'trudne',
            title: 'K-ta permutacja',
            short: 'Która permutacja jest k-ta w kolejności słownikowej? Dla n = 12 next_permutation nie zdąży — licz z silni.',
            tags: ['permutacje', 'silnia', 'erase z vectora dostępnych'],
            statement: ['Wszystkie permutacje liczb od 1 do n ułożono w kolejności słownikowej i ponumerowano od 1. Wypisz permutację o numerze k.'],
            input_format: ['Jeden wiersz z liczbami n i k.'],
            output_format: ['Jeden wiersz: n liczb — k-ta permutacja.'],
            constraints: ['1 ≤ n ≤ 12', '1 ≤ k ≤ n!'],
            examples: [{ input: '3 4', note: 'Kolejno: 123, 132, 213, 231, 312, 321 — czwarta to 2 3 1.' }],
            hint: R`Dla n = 12 permutacji jest prawie 480 milionów — przeglądanie ich po kolei nie zdąży. Zauważ, że permutacje zaczynające się od tej samej liczby tworzą bloki po (n − 1)! sztuk. Zmniejsz k o 1 (numeracja od 0); pierwsza liczba to wtedy element numer k / (n − 1)! z vectora dostępnych liczb {1, …, n}. Usuń go stamtąd (erase), zrób k %= (n − 1)! i powtórz dla kolejnych miejsc.`,
            tests: (r) => { const f = [1]; for (let i = 1; i <= 12; i++) f.push(f[i - 1] * i); return ['1 1', '2 2', '4 24', '5 1', '6 400', `10 ${r.int(1, f[10])}`, `12 ${f[12]}`, `12 ${r.int(1, f[12])}`, '12 1']; },
            check: (inp) => { const [n, k] = nums(inp); let f = 1; for (let i = 2; i <= n; i++) f *= i; return k >= 1 && k <= f ? null : 'k > n!'; },
            solve: (inp) => { const [n, k0] = nums(inp); const d = Array.from({ length: n }, (_, i) => i + 1); const f = [1]; for (let i = 1; i <= n; i++) f.push(f[i - 1] * i); let k = k0 - 1; const out = []; for (let i = n; i >= 1; i--) { const q = Math.floor(k / f[i - 1]); out.push(d.splice(q, 1)[0]); k %= f[i - 1]; } return out.join(' '); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    long long k;
    cin >> n >> k;
    vector<long long> silnia(n + 1, 1);
    for (int i = 1; i <= n; i++) silnia[i] = silnia[i - 1] * i;
    vector<int> dostepne;
    for (int i = 1; i <= n; i++) dostepne.push_back(i);
    k--;
    for (int i = n; i >= 1; i--) {
        long long blok = silnia[i - 1];
        int q = k / blok;
        cout << dostepne[q] << " ";
        dostepne.erase(dostepne.begin() + q);
        k %= blok;
    }
    cout << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-rosnacy-podzbior', krok: 9, level: 'trudne',
            title: 'Najdłuższy rosnący podzbiór',
            short: 'Wybierz jak najwięcej elementów, które (w kolejności z ciągu) rosną. Dla każdego elementu: najdłuższy kończący się na nim.',
            tags: ['podzbiór z zachowaniem kolejności', 'vector d', 'dwie pętle'],
            statement: ['Z ciągu n liczb wybieramy niektóre elementy, nie zmieniając ich kolejności. Wybrane elementy mają tworzyć ciąg ostro rosnący. Ile najwięcej elementów można tak wybrać?'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n liczb całkowitych.'],
            output_format: ['Jedna liczba — największa liczba wybranych elementów.'],
            constraints: ['1 ≤ n ≤ 2000', '−10⁹ ≤ każda liczba ≤ 10⁹'],
            examples: [{ input: '8\n5 2 8 6 3 6 9 7', note: 'Na przykład 2 3 6 9 albo 2 3 6 7 — po 4 elementy.' }, { input: '4\n4 4 4 4', note: 'Ciąg ma rosnąć ostro, więc z równych liczb weźmiemy tylko jedną.' }],
            hint: R`Podzbiorów jest za dużo, żeby sprawdzić wszystkie (n do 2000). Niech d[i] to długość najdłuższego rosnącego wyboru, który kończy się na elemencie i. Taki wybór to element i sam (d[i] = 1) albo dobry wybór kończący się na jakimś wcześniejszym j z a[j] < a[i], przedłużony o a[i]: d[i] = max(d[i], d[j] + 1). Odpowiedź to największe d[i].`,
            tests: (r) => ['1\n5', '3\n1 2 3', '3\n3 2 1', fmt(arr(r, 20, 0, 9)), fmt(arr(r, 2000, -1e9, 1e9)), fmt(Array.from({ length: 2000 }, (_, i) => i)), fmt(Array.from({ length: 2000 }, (_, i) => -i)), fmt(arr(r, 2000, 0, 50))],
            solve: (inp) => { const v = nums(inp).slice(1); const d = v.map(() => 1); let b = 0; for (let i = 0; i < v.length; i++) { for (let j = 0; j < i; j++) if (v[j] < v[i] && d[j] + 1 > d[i]) d[i] = d[j] + 1; b = Math.max(b, d[i]); } return String(b); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> a(n);
    for (auto &x : a) cin >> x;
    vector<int> d(n, 1);
    int best = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < i; j++) {
            if (a[j] < a[i]) d[i] = max(d[i], d[j] + 1);
        }
        best = max(best, d[i]);
    }
    cout << best << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-wyspy', krok: 9, level: 'trudne',
            title: 'Wyspy',
            short: 'Ile jest wysp na mapie i jak duża jest największa? vector par jako stos do zalewania wyspy.',
            tags: ['vector<string> jako mapa', 'stos: push_back i pop_back', 'kierunki jako pary'],
            statement: ['Mapa ma n wierszy i m kolumn. Znak # to ląd, a . to woda. Wyspa to grupa pól lądu, w której z każdego pola da się dojść do każdego innego, chodząc tylko po lądzie i tylko w górę, w dół, w lewo lub w prawo (nie po skosie). Wypisz liczbę wysp i liczbę pól największej z nich (albo 0 0, jeśli na mapie nie ma lądu).'],
            input_format: ['W pierwszym wierszu liczby n i m.', 'W każdym z kolejnych n wierszy m znaków: # albo .'],
            output_format: ['Dwie liczby: liczba wysp i wielkość największej.'],
            constraints: ['1 ≤ n, m ≤ 100'],
            examples: [{ input: '4 5\n##..#\n#...#\n..#..\n.....', note: 'Trzy wyspy: lewa (3 pola), prawa (2 pola) i jedno pole na środku.' }],
            hint: R`Przejdź po wszystkich polach. Gdy trafisz na ląd, którego jeszcze nie odwiedziłeś, to nowa wyspa — „zalej” ją: vector<pair<int, int>> stos; włóż na niego to pole i zaznacz je jako odwiedzone. Dopóki stos nie jest pusty: zdejmij pole (back i pop_back), policz je, a każdego nieodwiedzonego sąsiada-ląd (cztery kierunki jak w lekcji o parach) zaznacz i włóż na stos.`,
            tests: (r) => {
                const t = (n, m, pl) => `${n} ${m}\n${Array.from({ length: n }, () => Array.from({ length: m }, () => (r() < pl ? '#' : '.')).join('')).join('\n')}`;
                return ['1 1\n.', '1 1\n#', '2 2\n#.\n.#', '3 3\n###\n#.#\n###', t(10, 10, 0.4), t(100, 100, 0.45), t(100, 100, 0.6), t(100, 100, 0.1), `100 100\n${Array(100).fill('#'.repeat(100)).join('\n')}`];
            },
            solve: (inp) => { const t = toks(inp); const n = +t[0], m = +t[1]; const g = t.slice(2, 2 + n); const o = Array.from({ length: n }, () => Array(m).fill(false)); let c = 0, b = 0; for (let i = 0; i < n; i++) for (let j = 0; j < m; j++) { if (g[i][j] !== '#' || o[i][j]) continue; c++; let s = 0; const st = [[i, j]]; o[i][j] = true; while (st.length) { const [x, y] = st.pop(); s++; for (const [dx, dy] of [[-1, 0], [0, 1], [1, 0], [0, -1]]) { const a = x + dx, d = y + dy; if (a >= 0 && a < n && d >= 0 && d < m && g[a][d] === '#' && !o[a][d]) { o[a][d] = true; st.push([a, d]); } } } b = Math.max(b, s); } return `${c} ${b}`; },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n, m;
    cin >> n >> m;
    vector<string> g(n);
    for (auto &w : g) cin >> w;
    vector<vector<bool>> odw(n, vector<bool>(m, false));
    pair<int, int> ruch[4] = {{-1, 0}, {0, 1}, {1, 0}, {0, -1}};
    int wyspy = 0, najwieksza = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < m; j++) {
            if (g[i][j] != '#' || odw[i][j]) continue;
            wyspy++;
            int pola = 0;
            vector<pair<int, int>> stos;
            stos.push_back({i, j});
            odw[i][j] = true;
            while (!stos.empty()) {
                auto [w, k] = stos.back();
                stos.pop_back();
                pola++;
                for (auto [dw, dk] : ruch) {
                    int nw = w + dw, nk = k + dk;
                    if (nw >= 0 && nw < n && nk >= 0 && nk < m && g[nw][nk] == '#' && !odw[nw][nk]) {
                        odw[nw][nk] = true;
                        stos.push_back({nw, nk});
                    }
                }
            }
            najwieksza = max(najwieksza, pola);
        }
    }
    cout << wyspy << " " << najwieksza << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-sklejane-palindromy', krok: 9, level: 'trudne',
            title: 'Sklejane palindromy',
            short: 'Ile jest par słów, które sklejone tworzą palindrom? vector napisów, pętla w pętli i lustrzane pary.',
            tags: ['vector<string>', 'pary (i, j)', 'palindrom'],
            statement: ['Masz n słów. Policz uporządkowane pary (i, j) z i ≠ j, dla których sklejenie słowa numer i ze słowem numer j (najpierw słowo i, potem j) jest palindromem. Pary (i, j) i (j, i) liczymy osobno.'],
            input_format: ['W pierwszym wierszu liczba n.', 'W drugim wierszu n słów z małych liter.'],
            output_format: ['Jedna liczba — liczba par.'],
            constraints: ['1 ≤ n ≤ 300', 'Każde słowo ma od 1 do 20 liter.'],
            examples: [{ input: '4\nab ba aba a', note: 'Pasują: ab+ba = abba, ba+ab = baab, ab+a = aba, a+ba = aba, ab+aba = ababa i aba+ba = ababa — razem 6.' }],
            hint: R`Dla każdej pary i ≠ j sklej napisy (s[i] + s[j]) i sprawdź lustrzane pary liter. Par jest najwyżej 300 · 299, a każde sklejenie ma do 40 liter — razem kilka milionów kroków.`,
            tests: (r) => { const krotkie = () => r.word(r.int(1, 3), 'ab'); return ['1\naba', '2\na a', '3\nab ba abba', `20\n${Array.from({ length: 20 }, krotkie).join(' ')}`, `300\n${Array.from({ length: 300 }, krotkie).join(' ')}`, `300\n${Array.from({ length: 300 }, () => r.word(r.int(1, 20), 'abc')).join(' ')}`, `300\n${Array(300).fill('a'.repeat(20)).join(' ')}`]; },
            solve: (inp) => { const w = toks(inp).slice(1); let c = 0; for (let i = 0; i < w.length; i++) for (let j = 0; j < w.length; j++) { if (i === j) continue; const s = w[i] + w[j]; let ok = true; for (let k = 0; k < s.length >> 1 && ok; k++) if (s[k] !== s[s.length - 1 - k]) ok = false; if (ok) c++; } return String(c); },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<string> s(n);
    for (auto &w : s) cin >> w;
    long long par = 0;
    for (int i = 0; i < n; i++) {
        for (int j = 0; j < n; j++) {
            if (i == j) continue;
            string t = s[i] + s[j];
            int m = t.size();
            bool pal = true;
            for (int k = 0; k < m / 2; k++) if (t[k] != t[m - 1 - k]) pal = false;
            if (pal) par++;
        }
    }
    cout << par << "\n";
    return 0;
}`,
        },
        {
            id: 'vec-b-wielki-final', krok: 9, level: 'trudne',
            title: 'Wielki finał: edytor ciągu',
            short: 'Osiem poleceń na jednym vectorze: dopisywanie, wstawianie, usuwanie, odwracanie, sumy, palindromy i permutacje.',
            tags: ['insert i erase', 'reverse na kawałku', 'palindrom i permutacja'],
            statement: ['Edytor trzyma ciąg liczb (na początku n liczb z wejścia) i wykonuje q poleceń. Miejsca w ciągu liczymy od 1.', '• DOPISZ x — dopisz x na koniec ciągu,', '• WSTAW p x — wstaw x tak, by stała na miejscu p (1 ≤ p ≤ długość + 1),', '• USUN p — usuń element z miejsca p,', '• ODWROC a b — odwróć kolejność elementów na miejscach od a do b,', '• SUMA a b — wypisz sumę elementów na miejscach od a do b,', '• PALINDROM a b — wypisz TAK, jeśli kawałek od a do b jest palindromem, albo NIE,', '• PERMUTACJA — wypisz TAK, jeśli cały ciąg (o długości L) jest permutacją liczb od 1 do L, albo NIE,', '• WYPISZ — wypisz cały ciąg w jednym wierszu albo PUSTO.', 'We wszystkich poleceniach z a i b zachodzi 1 ≤ a ≤ b ≤ długość ciągu, a przy USUN i PERMUTACJA ciąg nie jest pusty.'],
            input_format: ['W pierwszym wierszu liczba n, w drugim n liczb.', 'W trzecim wierszu liczba q, a w kolejnych q wierszach polecenia.'],
            output_format: ['Po jednym wierszu dla każdego polecenia SUMA, PALINDROM, PERMUTACJA i WYPISZ.'],
            constraints: ['1 ≤ n ≤ 1000', '1 ≤ q ≤ 1000', '1 ≤ x i liczby w ciągu ≤ 2000', 'Polecenie WYPISZ pojawia się najwyżej 2 razy.'],
            examples: [{ input: '4\n3 1 2 3\n6\nPALINDROM 1 4\nUSUN 4\nPERMUTACJA\nODWROC 1 2\nSUMA 2 3\nWYPISZ', note: 'Po USUN 4 ciąg to 3 1 2 — permutacja liczb od 1 do 3. Po ODWROC 1 2: 1 3 2.' }],
            hint: R`Każde polecenie to coś, co już umiesz: push_back, insert(v.begin() + p - 1, x), erase(v.begin() + p - 1), reverse(v.begin() + a - 1, v.begin() + b), suma pętlą w long long, lustrzane pary od a - 1 do b - 1 i vector liczników o rozmiarze L + 1 dla permutacji (sprawdzaj zakres przed indeksem!). Ciąg ma najwyżej 2000 elementów, więc każde polecenie może przejrzeć cały ciąg.`,
            check: (inp) => {
                const t = toks(inp); const n = +t[0]; let L = n; const q = +t[n + 1]; let i = n + 2, wyp = 0;
                for (let k = 0; k < q; k++) {
                    const c = t[i++];
                    if (c === 'DOPISZ') { i++; L++; } else if (c === 'WSTAW') { const p = +t[i]; i += 2; if (p < 1 || p > L + 1) return 'zle p'; L++; } else if (c === 'USUN') { const p = +t[i++]; if (p < 1 || p > L) return 'zle p'; L--; } else if (c === 'ODWROC' || c === 'SUMA' || c === 'PALINDROM') { const a = +t[i], b = +t[i + 1]; i += 2; if (!(1 <= a && a <= b && b <= L)) return 'zle a b'; } else if (c === 'PERMUTACJA') { if (!L) return 'pusty'; } else if (c === 'WYPISZ') wyp++; else return 'nieznane ' + c;
                }
                return wyp <= 2 ? null : 'za dużo WYPISZ';
            },
            tests: (r) => {
                const t = (n, q, start, maxV) => {
                    const v = start || arr(r, n, 1, maxV); let L = v.length; const ops = []; let wyp = 0;
                    for (let k = 0; k < q; k++) {
                        const u = r();
                        if (L === 0 || u < 0.1) { ops.push(`DOPISZ ${r.int(1, maxV)}`); L++; } else if (u < 0.2) { ops.push(`WSTAW ${r.int(1, L + 1)} ${r.int(1, maxV)}`); L++; } else if (u < 0.3) { ops.push(`USUN ${r.int(1, L)}`); L--; } else if (u < 0.5) { const a = r.int(1, L), b = r.int(1, L); ops.push(`ODWROC ${Math.min(a, b)} ${Math.max(a, b)}`); } else if (u < 0.7) { const a = r.int(1, L), b = r.int(1, L); ops.push(`SUMA ${Math.min(a, b)} ${Math.max(a, b)}`); } else if (u < 0.85) { const a = r.int(1, L), d = r.int(0, 3); ops.push(`PALINDROM ${a} ${Math.min(L, a + d)}`); } else if (u < 0.995 || wyp >= 2) { ops.push('PERMUTACJA'); } else { ops.push('WYPISZ'); wyp++; }
                    }
                    return `${v.length}\n${v.join(' ')}\n${q}\n${ops.join('\n')}`;
                };
                const p20 = perm(r, 20);
                return ['1\n1\n3\nPERMUTACJA\nPALINDROM 1 1\nWYPISZ', '3\n2 1 2\n4\nPALINDROM 1 3\nDOPISZ 3\nPERMUTACJA\nSUMA 1 4', t(10, 30, null, 5), t(20, 200, p20, 25), t(1000, 1000, null, 2000), t(1000, 1000, perm(r, 1000), 1000), t(5, 1000, null, 3)];
            },
            solve: (inp) => {
                const t = toks(inp); const n = +t[0]; const v = t.slice(1, n + 1).map(Number); const q = +t[n + 1]; let i = n + 2; const out = [];
                for (let k = 0; k < q; k++) {
                    const c = t[i++];
                    if (c === 'DOPISZ') v.push(+t[i++]);
                    else if (c === 'WSTAW') { const p = +t[i++], x = +t[i++]; v.splice(p - 1, 0, x); } else if (c === 'USUN') v.splice(+t[i++] - 1, 1);
                    else if (c === 'ODWROC') { const a = +t[i++], b = +t[i++]; const w = v.slice(a - 1, b).reverse(); v.splice(a - 1, b - a + 1, ...w); } else if (c === 'SUMA') { const a = +t[i++], b = +t[i++]; let s = 0; for (let j = a - 1; j < b; j++) s += v[j]; out.push(s); } else if (c === 'PALINDROM') { const a = +t[i++], b = +t[i++]; out.push(palindrom(v.slice(a - 1, b)) ? 'TAK' : 'NIE'); } else if (c === 'PERMUTACJA') { const s = new Set(v); out.push(s.size === v.length && v.every((x) => x >= 1 && x <= v.length) ? 'TAK' : 'NIE'); } else out.push(lista(v));
                }
                return out.join('\n');
            },
            cpp: R`
#include <bits/stdc++.h>
using namespace std;
int main() {
    int n;
    cin >> n;
    vector<int> v(n);
    for (auto &x : v) cin >> x;
    int q;
    cin >> q;
    for (int k = 0; k < q; k++) {
        string c;
        cin >> c;
        if (c == "DOPISZ") {
            int x;
            cin >> x;
            v.push_back(x);
        } else if (c == "WSTAW") {
            int p, x;
            cin >> p >> x;
            v.insert(v.begin() + p - 1, x);
        } else if (c == "USUN") {
            int p;
            cin >> p;
            v.erase(v.begin() + p - 1);
        } else if (c == "ODWROC") {
            int a, b;
            cin >> a >> b;
            reverse(v.begin() + a - 1, v.begin() + b);
        } else if (c == "SUMA") {
            int a, b;
            cin >> a >> b;
            long long s = 0;
            for (int i = a - 1; i < b; i++) s += v[i];
            cout << s << "\n";
        } else if (c == "PALINDROM") {
            int a, b;
            cin >> a >> b;
            bool pal = true;
            for (int i = a - 1, j = b - 1; i < j; i++, j--) if (v[i] != v[j]) pal = false;
            cout << (pal ? "TAK" : "NIE") << "\n";
        } else if (c == "PERMUTACJA") {
            int L = v.size();
            vector<int> ile(L + 1, 0);
            bool ok = true;
            for (auto x : v) {
                if (x < 1 || x > L) ok = false;
                else if (++ile[x] > 1) ok = false;
            }
            cout << (ok ? "TAK" : "NIE") << "\n";
        } else {
            if (v.empty()) cout << "PUSTO";
            for (auto x : v) cout << x << " ";
            cout << "\n";
        }
    }
    return 0;
}`,
        },
    ];
};
