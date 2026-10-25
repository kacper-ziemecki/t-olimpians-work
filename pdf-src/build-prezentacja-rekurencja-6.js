#!/usr/bin/env node
/*
 * Prezentacja „Rekurencja — część 6: dziel i zwyciężaj” (T-Olimpians, kurs rekurencji, krok 6 z 6).
 *
 * Generuje pdf-src/prezentacja-rekurencja-6-dziel-i-zwyciezaj.html i (z flagą --pdf)
 * prezentacja-rekurencja-6-dziel-i-zwyciezaj-t-olimpians.pdf. Buduje na częściach 1–5: zamiast zmniejszać
 * problem o 1, dzielimy go na połowy — rekurencja ma wtedy tylko ok. log n poziomów.
 *
 *     node pdf-src/build-prezentacja-rekurencja-6.js --pdf
 */
const L = require('./prezentacja_lib');
const { code, c, P, stack, cols, note, warn, good, big, steps, traps, table, card, cards, kv, term, trace, arr, tree, T, board, levels } = L;
const D = L.deck();
const { sec, slide } = D;

const SECS = [
    ['01', 'Idea: dziel i zwyciężaj'],
    ['02', 'Rozgrzewka: min i max'],
    ['03', 'Szybkie potęgowanie'],
    ['04', 'Wyszukiwanie binarne'],
    ['05', 'Scalanie dwóch ciągów'],
    ['06', 'Sortowanie przez scalanie'],
    ['07', 'Ile to kosztuje?'],
    ['08', 'Zliczanie inwersji'],
    ['09', 'Quicksort i quickselect'],
    ['10', 'Najlepszy spójny fragment'],
    ['11', 'Fraktale i napisy'],
    ['12', 'Sprawdź się'],
    ['13', 'Podsumowanie'],
];

const g = (v, s = '') => ({ v, s });

// ================================================================ 01
sec('01');
slide('Dziel i zwyciężaj', stack([
    big('Podziel problem na <em>dwie połowy</em>, rozwiąż każdą <em>rekurencyjnie</em>, a potem <strong>połącz</strong> wyniki.'),
    cards([
        card('1 · podziel', 'Tablicę, przedział albo liczbę dzielimy na dwie (mniej więcej) równe części.', 'tlc'),
        card('2 · rozwiąż', 'Każdą część rozwiązuje wywołanie rekurencyjne. Bardzo mała część to warunek stopu.', 'puc'),
        card('3 · połącz', 'Z wyników obu części budujemy wynik dla całości. Często to najciekawszy krok.', 'orc'),
    ], 3),
    note('Przykład z życia: posortować stos 1000 klasówek? Podziel na dwa stosy po 500, daj je dwóm osobom do posortowania, a potem <b>scal</b> dwa posortowane stosy w jeden.'),
], { gap: 20 }));

slide('Po co dzielić na pół, a nie zmniejszać o 1?', cols([
    stack([
        P('Do tej pory problem malał <b>o jeden</b>: n → n − 1 → n − 2 → … Rekurencja miała <b>n poziomów</b>.'),
        P('Gdy dzielimy na pół, problem maleje <b>dwa razy</b> na każdym poziomie: n → n / 2 → n / 4 → … → 1.'),
        good('Liczba poziomów to tyle, ile razy da się podzielić n przez 2 — czyli <b>log₂ n</b>. Nawet dla miliarda to tylko <b>30</b> poziomów.'),
    ]),
    table(['n', 'zmniejszanie o 1', 'dzielenie na pół'], [['8', '8 poziomów', '3 poziomy'], ['1 000', '1 000', '10'], ['1 000 000', 'milion', '20'], ['10⁹', 'miliard', '30'], ['10¹⁸', '—', '60']], { cls: 'mid ctr' }),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 02
sec('02');
const A8 = [5, 2, 9, 1, 7, 3, 8, 6];
slide('Minimum i maksimum — dzielimy tablicę', cols([
    code(`
        pair<int, int> minmaks(int l, int r) {
            if (l == r) return {a[l], a[l]};
            int s = (l + r) / 2;
            auto L = minmaks(l, s);
            auto R = minmaks(s + 1, r);
            return {min(L.first, R.first),
                    max(L.second, R.second)};
        }`, { size: 'sm' }),
    stack([
        steps(['<b>stop</b>: jeden element jest swoim minimum i maksimum,', `<b>podziel</b>: środek ${c('s = (l + r) / 2')} — lewa połowa l…s, prawa s + 1…r,`, '<b>połącz</b>: mniejsze z dwóch minimów, większe z dwóch maksimów.'], 'tight'),
        note(`Funkcja zwraca <b>parę</b> (pair) — dwie liczby naraz. ${c('L.first')} to minimum lewej połowy, ${c('L.second')} — maksimum.`),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

slide('Podział tablicy na kawałki', stack([
    levels([
        [g(A8)],
        [g(A8.slice(0, 4)), g(A8.slice(4))],
        [g(A8.slice(0, 2)), g(A8.slice(2, 4)), g(A8.slice(4, 6)), g(A8.slice(6))],
        A8.map((x) => g([x], 'done')),
    ], { size: 'sm', labels: ['minmaks(0, 7)', 'połowy', 'ćwiartki', 'pojedyncze: stop'] }),
    P('Każdy kawałek dzieli się na dwa, aż zostaną pojedyncze elementy. Potem wyniki <b>łączą się w górę</b>: (5,5) i (2,2) → (2,5); (2,5) i (1,9) → (1,9); … aż do całej tablicy: <b>(1, 9)</b>.', 'cen'),
], { gap: 18 }));

slide('Drzewo wywołań `minmaks`', stack([
    tree(T('0..7', [T('0..3', [T('0..1', [T('0', [], { v: '5,5' }), T('1', [], { v: '2,2' })], { v: '2,5' }), T('2..3', [T('2', [], { v: '9,9' }), T('3', [], { v: '1,1' })], { v: '1,9' })], { v: '1,9' }), T('4..7', [T('4..5', [T('4', [], { v: '7,7' }), T('5', [], { v: '3,3' })], { v: '3,7' }), T('6..7', [T('6', [], { v: '8,8' }), T('7', [], { v: '6,6' })], { v: '6,8' })], { v: '3,8' })], { v: '1,9', s: 'on' }), { fs: 17, dy: 84 }),
    P('W węzłach — przedziały indeksów, pod nimi — zwrócona para (min, max). Drzewo ma tylko <b>log₂ 8 = 3</b> poziomy podziałów.', 'cen'),
], { gap: 8 }));

// ================================================================ 03
sec('03');
slide('Potęgowanie: zwykłe jest za wolne', cols([
    stack([
        code(`
            long long potega(long long a, long long n) {
                if (n == 0) return 1;
                return a * potega(a, n - 1);
            }`, { cap: 'z części 2 — n wywołań', size: 'sm' }),
        warn('Dla n = 10¹⁸ to 10¹⁸ wywołań — nie skończy się do końca świata (i dużo wcześniej zabraknie stosu).'),
    ]),
    stack([
        P('Pomysł: <b>a¹⁰⁰ = (a⁵⁰)²</b>. Wystarczy policzyć a⁵⁰ <b>raz</b> i podnieść do kwadratu. A a⁵⁰ = (a²⁵)², a a²⁵ = a · (a¹²)²…'),
        table(['n', 'wzór'], [['parzyste', 'aⁿ = (a<sup>n/2</sup>)²'], ['nieparzyste', 'aⁿ = a · (a<sup>(n−1)/2</sup>)²'], ['0', 'a⁰ = 1']], { cls: 'mid' }),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

slide('Przykład: 3¹³', cols([
    table(['wywołanie', 'policz', 'wynik'], [
        [c('potega(3, 13)'), '3 · (3⁶)²', '3 · 729² = <b>1 594 323</b>'],
        [c('potega(3, 6)'), '(3³)²', '27² = 729'],
        [c('potega(3, 3)'), '3 · (3¹)²', '3 · 9 = 27'],
        [c('potega(3, 1)'), '3 · (3⁰)²', '3 · 1 = 3'],
        [c('potega(3, 0)'), 'stop', '1'],
    ], { widths: ['30%', '30%', '40%'], cls: 'mid' }),
    stack([
        P('Wykładnik maleje <b>o połowę</b>: 13 → 6 → 3 → 1 → 0. Zamiast 13 mnożeń — <b>5 wywołań</b>.'),
        good('Dla n = 10¹⁸ wystarczy ok. <b>60 wywołań</b>.'),
    ]),
], { t: '1.3fr 1fr', align: 'center' }));

slide('Szybkie potęgowanie modulo m', cols([
    code(`
        long long m;

        long long potega(long long a, long long n) {
            if (n == 0) return 1 % m;
            long long p = potega(a, n / 2);
            p = p * p % m;
            if (n % 2 == 1) p = p * (a % m) % m;
            return p;
        }`, { size: 'sm', hl: [5] }),
    stack([
        P('Wyniki potęg są gigantyczne, więc w zadaniach liczy się je <b>modulo m</b> — resztę z dzielenia przez m. Bierzemy resztę po każdym mnożeniu, żeby liczby nie urosły.'),
        warn(`Linijka 5: ${c('potega(a, n / 2)')} wywołujemy <b>jeden raz</b> i zapisujemy w zmiennej. Napisanie ${c('potega(a, n/2) * potega(a, n/2)')} zrobiłoby z powrotem n wywołań!`),
        note('Gdy m ≤ 10⁹, iloczyn dwóch reszt jest mniejszy niż 10¹⁸ — mieści się w long long.'),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

// ================================================================ 04
sec('04');
const BS = [1, 3, 5, 7, 9, 11, 13, 15];
slide('Wyszukiwanie binarne — zgadnij liczbę', cols([
    stack([
        P('Gra: myślę o liczbie od 1 do 100, a Ty zgadujesz. Na każdą próbę mówię „więcej” albo „mniej”. Najlepiej pytać o <b>środek</b> — każda odpowiedź wyrzuca <b>połowę</b> możliwości.'),
        P('Wystarczy <b>7 pytań</b>: 100 → 50 → 25 → 13 → 7 → 4 → 2 → 1.'),
    ]),
    stack([
        P('Tak samo szukamy liczby x w <b>posortowanej</b> tablicy: patrzymy na środkowy element.'),
        steps(['środek == x — <b>znalezione</b>,', 'środek > x — x może być tylko w <b>lewej</b> połowie,', 'środek < x — tylko w <b>prawej</b>.'], 'tight'),
    ]),
], { t: '1fr 1fr', align: 'center' }));

const bsStep = (l, r, s, info) => stack([arr(BS, { name: 'a', ptr: Object.assign({}, { [l]: 'l' }, { [r]: (r === l ? 'l=r' : 'r') }, s != null ? { [s]: s === l ? 'l,s' : s === r ? 's,r' : 's' } : {}), hi: s != null ? [s] : [], spans: [[l, r - l + 1, 'szukamy tu', '']] }), P(info)], { gap: 8 });
slide('Szukamy x = 11', stack([
    bsStep(0, 7, 3, 'l = 0, r = 7, środek s = 3: a[3] = 7 < 11 → szukamy w prawej połowie (4…7).'),
    bsStep(4, 7, 5, 'l = 4, r = 7, s = 5: a[5] = 11 == 11 → <b>znalezione</b> na indeksie 5.'),
], { gap: 14 }));

slide('Wyszukiwanie binarne — kod', cols([
    code(`
        int szukaj(int l, int r, int x) {
            if (l > r) return -1;          // pusto: nie ma
            int s = (l + r) / 2;
            if (a[s] == x) return s;
            if (a[s] > x) return szukaj(l, s - 1, x);
            return szukaj(s + 1, r, x);
        }`, { size: 'sm' }),
    stack([
        P('Tylko <b>jedno</b> wywołanie rekurencyjne — do tej połowy, w której x może być. Druga połowa jest odrzucana w całości.'),
        table(['n', 'najwyżej kroków'], [['1 000', '10'], ['1 000 000', '20'], ['10⁹', '30']], { cls: 'mid ctr' }),
        warn('Działa <b>tylko na posortowanej tablicy</b>! W kompendium o wyszukiwaniu binarnym są osobne tematy — to dopiero wstęp.'),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

// ================================================================ 05
sec('05');
slide('Scalanie dwóch posortowanych ciągów', cols([
    stack([
        arr([1, 4, 9], { name: 'a', ptr: { 0: 'i' }, hi: [0], size: 'sm' }),
        arr([2, 3, 4, 10], { name: 'b', ptr: { 0: 'j' }, size: 'sm' }),
        arr(['1'], { name: 'wynik', size: 'sm', idx: false }),
    ]),
    stack([
        P('Najmniejszy element wyniku to <b>mniejszy z pierwszych</b> elementów obu ciągów: min(1, 2) = 1. Przepisujemy go i przesuwamy wskaźnik w tym ciągu, z którego wzięliśmy.'),
        note('Potem znowu porównujemy pierwsze nieprzepisane elementy: 4 i 2 → bierzemy 2. I tak dalej, aż oba ciągi się skończą.'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Scalanie krok po kroku', table(['krok', 'porównujemy', 'bierzemy', 'wynik'], [
    ['1', 'a: 1, b: 2', '1 z a', '1'],
    ['2', 'a: 4, b: 2', '2 z b', '1 2'],
    ['3', 'a: 4, b: 3', '3 z b', '1 2 3'],
    ['4', 'a: 4, b: 4', '4 z a (przy remisie — z a)', '1 2 3 4'],
    ['5', 'a: 9, b: 4', '4 z b', '1 2 3 4 4'],
    ['6', 'a: 9, b: 10', '9 z a', '1 2 3 4 4 9'],
    ['7', 'a skończone', '10 z b', '1 2 3 4 4 9 <b>10</b>'],
], { widths: ['10%', '28%', '32%', '30%'], cls: 'mid' }), note('Każdy element przepisujemy raz, więc scalanie ciągów o długościach n i m to tylko <b>n + m</b> kroków.'));

slide('Scalanie — kod', cols([
    code(`
        void scal(int i, int j) {
            if (i == n && j == m) return;
            if (j == m || (i < n && a[i] <= b[j])) {
                cout << a[i] << " ";
                scal(i + 1, j);
            } else {
                cout << b[j] << " ";
                scal(i, j + 1);
            }
        }`, { cap: 'rekurencyjnie', size: 'sm' }),
    code(`
        int i = l, j = s + 1, k = l;
        while (i <= s || j <= r) {
            if (j > r || (i <= s && a[i] <= a[j]))
                pom[k++] = a[i++];
            else
                pom[k++] = a[j++];
        }`, { cap: 'pętlą — w sortowaniu przez scalanie', size: 'sm' }),
], { gap: 30, align: 'start' }), note('W sortowaniu scalamy dwie <b>połowy tej samej tablicy</b> (l…s i s + 1…r) do tablicy pomocniczej pom, a potem kopiujemy wynik z powrotem.'));

// ================================================================ 06
sec('06');
const MS = [5, 2, 4, 6, 1, 3, 2, 6];
slide('Sortowanie przez scalanie (merge sort)', cols([
    stack([
        steps(['jeden element jest już <b>posortowany</b> — stop,', 'podziel tablicę na <b>dwie połowy</b>,', 'posortuj każdą połowę <b>rekurencyjnie</b>,', '<b>scal</b> dwie posortowane połowy.'], 'big'),
    ]),
    stack([
        note('Zaufaj rekurencji: zakładamy, że wywołania dla połówek <b>już umieją sortować</b>. Nam zostaje tylko scalić ich wyniki — a to umiemy.'),
        P('Ten algorytm pokazuje Striver w filmie „Merge Sort” z playlisty — zobacz go po tej prezentacji.', 'muted'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Dzielenie — w dół', levels([
    [g(MS)],
    [g(MS.slice(0, 4)), g(MS.slice(4))],
    [g(MS.slice(0, 2)), g(MS.slice(2, 4)), g(MS.slice(4, 6)), g(MS.slice(6))],
    MS.map((x) => g([x], 'done')),
], { size: 'sm', labels: ['cała tablica', 'połowy', 'ćwiartki', 'pojedyncze'] }), P('W drodze w dół tylko dzielimy — nic jeszcze nie jest posortowane. Pojedyncze elementy (fioletowe) są posortowane „same z siebie”.', 'cen'));

slide('Scalanie — w górę', levels([
    MS.map((x) => g([x], 'done')),
    [g([2, 5], 'on'), g([4, 6], 'on'), g([1, 3], 'on'), g([2, 6], 'on')],
    [g([2, 4, 5, 6], 'on'), g([1, 2, 3, 6], 'on')],
    [g([1, 2, 2, 3, 4, 5, 6, 6], 'on')],
], { size: 'sm', labels: ['pojedyncze', 'scalone pary', 'scalone czwórki', 'posortowane!'] }), P('W drodze w górę każde wywołanie <b>scala</b> dwie posortowane połówki. Kod scalania jest <b>po</b> wywołaniach rekurencyjnych — wykonuje się w drodze powrotnej.', 'cen'));

slide('Sortowanie przez scalanie — kod', cols([
    code(`
        int a[100000], pom[100000];

        void sortuj(int l, int r) {
            if (l >= r) return;
            int s = (l + r) / 2;
            sortuj(l, s);
            sortuj(s + 1, r);
            int i = l, j = s + 1, k = l;
            while (i <= s || j <= r) {
                if (j > r || (i <= s && a[i] <= a[j]))
                    pom[k++] = a[i++];
                else
                    pom[k++] = a[j++];
            }
            for (int x = l; x <= r; x++) a[x] = pom[x];
        }`, { size: 'xs', hl: [6, 7] }),
    stack([
        P(`Wywołanie z main: ${c('sortuj(0, n - 1)')}.`),
        steps(['linijka 4: fragment z 0 lub 1 elementem jest posortowany,', 'linijki 6–7: posortuj połówki (zaufaj rekurencji!),', 'linijki 8–14: scal połówki do pom,', 'linijka 15: przepisz z powrotem do a.'], 'tight'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 07
sec('07');
slide('Ile pracy wykonuje merge sort?', cols([
    stack([
        P('Spójrz na schemat scalania „w górę”: na <b>każdym poziomie</b> scalamy kawałki, które razem mają <b>n</b> elementów. To ok. n operacji na poziom.'),
        P('Poziomów jest <b>log₂ n</b>. Razem: <b>n · log₂ n</b> operacji.'),
        good('Dla n = 100 000 to ok. <b>1,7 miliona</b> operacji — ułamek sekundy.'),
    ]),
    table(['n', 'n² (sortowanie „bąbelkowe”)', 'n · log₂ n (merge sort)'], [
        ['1 000', '1 000 000', 'ok. 10 000'], ['100 000', '10¹⁰ — <b class="no">za wolno</b>', 'ok. 1,7 · 10⁶'], ['1 000 000', '10¹² — <b class="no">za wolno</b>', 'ok. 2 · 10⁷'],
    ], { widths: ['20%', '42%', '38%'], cls: 'mid' }),
], { t: '1fr 1.15fr', align: 'center' }));

slide('Dlaczego dzielenie na pół jest tak dobre?', stack([
    big('Głębokość <em>log n</em> zamiast n — to różnica między <em>30</em> a <strong>miliardem</strong>.'),
    table(['algorytm', 'jak maleje problem', 'złożoność'], [
        ['suma tablicy (część 2)', 'n → n − 1, jedno wywołanie', 'O(n)'],
        ['Fibonacci bez pamięci (część 3)', 'n → n − 1 i n − 2', 'O(2ⁿ)'],
        ['wyszukiwanie binarne', 'n → n / 2, jedno wywołanie', '<b>O(log n)</b>'],
        ['szybkie potęgowanie', 'n → n / 2, jedno wywołanie', '<b>O(log n)</b>'],
        ['merge sort', 'n → dwa razy n / 2 + scalanie O(n)', '<b>O(n log n)</b>'],
    ], { widths: ['38%', '40%', '22%'], cls: 'mid' }),
], { gap: 18 }));

// ================================================================ 08
sec('08');
slide('Inwersje', cols([
    stack([
        P('<b>Inwersja</b> to para elementów stojących „w złej kolejności”: większy przed mniejszym, czyli i < j i aᵢ > aⱼ.'),
        arr([2, 4, 1, 3, 5], { name: 'a', sel: [1, 3], hi: [2] }),
        P('Inwersje: (2, 1), (4, 1), (4, 3) — razem <b>3</b>.'),
    ]),
    stack([
        P('Liczba inwersji mówi, jak bardzo tablica jest „nieposortowana”: posortowana ma 0 inwersji, odwrócona — najwięcej, n(n − 1) / 2.'),
        note('Sprawdzanie każdej pary to n² / 2 porównań — dla n = 10⁵ za dużo. Da się szybciej: <b>podczas sortowania przez scalanie</b>. (Film Strivera „Count Inversions”.)'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Inwersje policzymy przy scalaniu', cols([
    stack([
        arr([2, 4], { name: 'lewa', size: 'sm', ptr: { 0: 'i' } }),
        arr([1, 3], { name: 'prawa', size: 'sm', ptr: { 0: 'j' }, hi: [0] }),
        P('Bierzemy <b>1</b> z prawej połowy. Jest mniejsze od <b>wszystkich</b> elementów, które zostały w lewej: 2 i 4. To <b>2 inwersje</b> naraz!'),
    ]),
    stack([
        P('Każda inwersja jest albo w lewej połowie, albo w prawej (te policzą wywołania rekurencyjne), albo <b>„pomiędzy”</b>: większy element w lewej, mniejszy w prawej.'),
        good(`Te „pomiędzy” liczymy przy scalaniu: gdy bierzemy element z prawej, dodajemy liczbę elementów <b>pozostałych w lewej</b> połowie: ${c('s - i + 1')}.`),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Zliczanie inwersji — kod', cols([
    code(`
        long long sortuj(int l, int r) {
            if (l >= r) return 0;
            int s = (l + r) / 2;
            long long w = sortuj(l, s) + sortuj(s + 1, r);
            int i = l, j = s + 1, k = l;
            while (i <= s || j <= r) {
                if (j > r || (i <= s && a[i] <= a[j]))
                    pom[k++] = a[i++];
                else {
                    w += s - i + 1;
                    pom[k++] = a[j++];
                }
            }
            for (int x = l; x <= r; x++) a[x] = pom[x];
            return w;
        }`, { size: 'xs', hl: [4, 10] }),
    stack([
        P('To <b>merge sort</b> z jedną dodatkową linijką (10) i wynikiem zwracanym przez return.'),
        steps(['inwersje w lewej połowie + inwersje w prawej (linijka 4),', 'plus inwersje „pomiędzy”, liczone przy scalaniu (linijka 10).'], 'tight'),
        warn(`Przy remisie (a[i] == a[j]) bierz z <b>lewej</b> — równe liczby nie tworzą inwersji. Wynik może przekroczyć int.`),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

// ================================================================ 09
sec('09');
slide('Quicksort — inny sposób dzielenia', cols([
    stack([
        P('Merge sort dzieli „na ślepo” na pół, a cała praca jest przy <b>łączeniu</b>. Quicksort robi odwrotnie: cała praca jest przy <b>dzieleniu</b>.'),
        steps(['wybierz element osiowy — <b>pivot</b>,', 'rozdziel elementy na <b>mniejsze</b>, <b>równe</b> i <b>większe</b> od pivota,', 'posortuj rekurencyjnie mniejsze i większe,', 'połącz: mniejsze, równe, większe — i gotowe.'], 'tight'),
    ]),
    levels([
        [g([5, 2, 9, 1, 5, 7, 3])],
        [g([2, 1, 3]), g([5, 5], 'or'), g([9, 7])],
        [g([1, 2, 3], 'on'), g([5, 5], 'or'), g([7, 9], 'on')],
    ], { size: 'sm', labels: ['pivot = 5', 'podział', 'po sortowaniu części'] }),
], { t: '1fr 1.1fr', align: 'center' }), note('Quicksort pokazuje Striver w filmie „Quick Sort For Beginners”. Zwykle jest bardzo szybki, ale przy pechowym pivocie (np. zawsze najmniejszy element) zwalnia do n² — dlatego pivot losuje się albo bierze ze środka.'));

slide('Quickselect: k-ty najmniejszy element', cols([
    code(`
        int kty(vector<int> v, int k) {
            int pivot = v[v.size() / 2];
            vector<int> mniejsze, wieksze;
            int rowne = 0;
            for (int x : v) {
                if (x < pivot) mniejsze.push_back(x);
                else if (x > pivot) wieksze.push_back(x);
                else rowne++;
            }
            if (k <= mniejsze.size()) return kty(mniejsze, k);
            if (k <= mniejsze.size() + rowne) return pivot;
            return kty(wieksze, k - mniejsze.size() - rowne);
        }`, { size: 'xs' }),
    stack([
        P('Nie musimy sortować wszystkiego, żeby znaleźć k-ty najmniejszy element. Po podziale wiemy, <b>w której części</b> on jest — i tylko tam szukamy dalej.'),
        table(['k', 'gdzie jest k-ty?'], [['k ≤ |mniejsze|', 'w mniejszych'], ['dalej, do |m| + |r|', 'to sam pivot'], ['jeszcze dalej', 'w większych (k przesuwamy)']], { cls: 'mid' }),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

// ================================================================ 10
sec('10');
const MX = [-2, 1, -3, 4, -1, 2, 1, -5];
slide('Najlepszy spójny fragment', cols([
    stack([
        P('Wybierz <b>spójny</b> fragment tablicy (kilka liczb obok siebie) o <b>największej sumie</b>.'),
        arr(MX, { name: 'a', hi: [3, 4, 5, 6], spans: [[3, 4, 'suma 6', '']] }),
    ]),
    stack([
        P('Podziel tablicę na pół. Najlepszy fragment leży:'),
        steps(['cały w <b>lewej</b> połowie — znajdzie go wywołanie dla lewej,', 'cały w <b>prawej</b> — wywołanie dla prawej,', '<b>przez środek</b> — kawałek kończący się na końcu lewej połowy + kawałek zaczynający się na początku prawej.'], 'tight'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Fragment przez środek', cols([
    stack([
        arr(MX, { name: 'a', sel: [3], hi: [4, 5, 6], spans: [[0, 4, 'lewa połowa', 'gr'], [4, 4, 'prawa połowa', 'gr']] }),
        table(['kierunek', 'sumy kolejnych kawałków', 'najlepsza'], [
            ['od środka w lewo', 'a[3] = 4, 4 − 3 = 1, 1 + 1 = 2, 2 − 2 = 0', '<b>4</b>'],
            ['od środka w prawo', 'a[4] = −1, −1 + 2 = 1, 1 + 1 = 2, 2 − 5 = −3', '<b>2</b>'],
        ], { widths: ['24%', '58%', '18%'], cls: 'mid' }),
    ]),
    stack([
        P('Najlepszy fragment przez środek = najlepsza suma w lewo + najlepsza suma w prawo = 4 + 2 = <b>6</b>.'),
        P('Porównujemy go z najlepszymi fragmentami wewnątrz połówek (te znajdzie rekurencja) i bierzemy największy z trzech.'),
    ]),
], { t: '1.35fr 1fr', align: 'center' }));

slide('Najlepszy fragment — kod', code(`
    long long najlepszy(int l, int r) {
        if (l == r) return a[l];
        int s = (l + r) / 2;
        long long w = max(najlepszy(l, s), najlepszy(s + 1, r));
        long long suma = 0, lewa = LLONG_MIN, prawa = LLONG_MIN;
        for (int i = s; i >= l; i--) { suma += a[i]; lewa = max(lewa, suma); }
        suma = 0;
        for (int i = s + 1; i <= r; i++) { suma += a[i]; prawa = max(prawa, suma); }
        return max(w, lewa + prawa);
    }`, { size: 'sm' }), note('Na każdym poziomie rekurencji pętle przechodzą łącznie przez całą tablicę, a poziomów jest log n — razem <b>O(n log n)</b>. (Istnieje też sprytniejszy sposób O(n) — algorytm Kadane; w kompendium: „Maksymalna suma na przedziale 1D”.)'));

// ================================================================ 11
sec('11');
const carpet = (k) => { const n = 3 ** k; return Array.from({ length: n }, (_, i) => Array.from({ length: n }, (_, j) => { let a = i, b = j; while (a || b) { if (a % 3 === 1 && b % 3 === 1) return '.'; a = Math.floor(a / 3); b = Math.floor(b / 3); } return '#'; })); };
slide('Fraktal: dywan Sierpińskiego', cols([
    stack([
        P('Dywan rzędu 0 to jedno pole. Dywan rzędu k to <b>3 × 3 dywany rzędu k − 1</b>, ze środkowym wyciętym. Rekurencja rysuje się tu sama!'),
        code(`
            void rysuj(int k, int w, int x) {
                if (k == 0) { t[w][x] = '#'; return; }
                int b = pot3[k - 1];          // bok mniejszego dywanu
                for (int i = 0; i < 3; i++)
                    for (int j = 0; j < 3; j++)
                        if (!(i == 1 && j == 1))
                            rysuj(k - 1, w + i * b, x + j * b);
            }`, { size: 'xs' }),
    ]),
    board(carpet(2), { cw: 30, show: () => '', cls: (i, j, v) => (v === '#' ? 'q' : '') }),
], { t: '1.2fr 1fr', align: 'center' }));

slide('Napis Fibonacciego: k-ta litera bez budowania napisu', cols([
    stack([
        P('S(1) = <b>a</b>, S(2) = <b>b</b>, S(n) = S(n − 1) + S(n − 2): b, ba, bab, babba, babbabab, … S(80) ma ponad 10¹⁶ liter — nie da się go zbudować.'),
        P('Ale k-ta litera S(n) leży <b>albo w części S(n − 1)</b> (gdy k ≤ długość S(n − 1)), <b>albo w części S(n − 2)</b> — na pozycji k − długość S(n − 1). Schodzimy tylko w jedną część!'),
    ]),
    code(`
        char litera(int n, long long k) {
            if (n == 1) return 'a';
            if (n == 2) return 'b';
            if (k <= dl[n - 1]) return litera(n - 1, k);
            return litera(n - 2, k - dl[n - 1]);
        }`, { size: 'sm' }),
], { t: '1.1fr 1fr', align: 'center' }), note('dl[n] — długości napisów, policzone wcześniej pętlą: dl[n] = dl[n − 1] + dl[n − 2]. To znowu liczby Fibonacciego!'));

slide('Ciąg Thuego–Morse’a', cols([
    stack([
        P('0 → 01 → 0110 → 01101001 → … Każdy krok dokleja kopię z zamienionymi cyframi.'),
        arr(['0', '1', '1', '0', '1', '0', '0', '1'], { name: 'T', idxs: ['1', '2', '3', '4', '5', '6', '7', '8'], spans: [[0, 4, 'pierwsza połowa', 'gr'], [4, 4, 'odwrócona kopia', 'or']], size: 'sm' }),
        P('k-ta cyfra w drugiej połowie (długości 2p) to <b>odwrócona</b> cyfra z pozycji k − p.'),
    ]),
    code(`
        int cyfra(long long k) {
            if (k == 1) return 0;
            long long p = 1;
            while (2 * p < k) p *= 2;
            return 1 - cyfra(k - p);
        }`, { size: 'sm' }),
], { t: '1.15fr 1fr', align: 'center' }), note('Na przykład 6. cyfra: p = 4, więc to odwrócona 2. cyfra; 2. cyfra to odwrócona 1., czyli 1 − 0 = 1; zatem 6. cyfra = 1 − 1 = <b>0</b>.'));

// ================================================================ 12
sec('12');
const quiz = (n, title, body) => slide(`Pytanie ${n}: ${title}`, body, P('Zastanów się i zapisz odpowiedź, <b>zanim</b> przejdziesz dalej.', 'muted cen'));
quiz(1, 'ile wywołań zrobi `potega(2, 1000)`?', cols([code(`
    long long potega(long long a, long long n) {
        if (n == 0) return 1 % m;
        long long p = potega(a, n / 2);
        p = p * p % m;
        if (n % 2 == 1) p = p * (a % m) % m;
        return p;
    }`, { size: 'sm' }), term('?')], { t: '1.5fr 1fr', align: 'center' }));
slide('Odpowiedź 1: 11', cols([
    P('n idzie: 1000 → 500 → 250 → 125 → 62 → 31 → 15 → 7 → 3 → 1 → 0. To <b>11</b> wywołań (log₂ 1000 ≈ 10, plus warunek stopu).'),
    note('Zwykłe potęgowanie z części 2 potrzebowałoby 1001 wywołań.'),
], { t: '1.3fr 1fr', align: 'center' }));

quiz(2, 'co wyjdzie ze scalenia?', cols([stack([arr([1, 4, 7], { name: 'a', size: 'sm' }), arr([2, 3, 9], { name: 'b', size: 'sm' })]), term('?')], { t: '1fr 1fr', align: 'center' }));
slide('Odpowiedź 2: `1 2 3 4 7 9`', cols([
    term('1 2 3 4 7 9'),
    note('1 (a) · 2 (b) · 3 (b) · 4 (a) · 7 (a) · 9 (b). Sześć kroków — każdy element przepisany raz.'),
], { t: '0.8fr 1.2fr', align: 'center' }));

quiz(3, 'ile inwersji ma tablica `3 1 2`?', cols([arr([3, 1, 2], { name: 'a', size: 'lg' }), term('?')], { t: '1fr 1fr', align: 'center' }));
slide('Odpowiedź 3: 2', cols([
    arr([3, 1, 2], { name: 'a', hi: [0], sel: [1, 2], size: 'lg' }),
    note('(3, 1) i (3, 2). Para (1, 2) jest w dobrej kolejności. Merge sort dzieli na [3, 1] i [2]: scalając [3] z [1] bierze 1, gdy w lewej czeka 3 → +1; scalając [1, 3] z [2] bierze 2, gdy w lewej czeka 3 → +1. Razem 2.'),
], { t: '1fr 1.2fr', align: 'center' }));

quiz(4, 'dlaczego to jest wolne?', cols([code(`
    long long potega(long long a, long long n) {
        if (n == 0) return 1 % m;
        long long p = potega(a, n / 2) * potega(a, n / 2) % m;
        if (n % 2 == 1) p = p * (a % m) % m;
        return p;
    }`, { size: 'xs' }), term('?')], { t: '1.6fr 1fr', align: 'center' }));
slide('Odpowiedź 4: dwa wywołania zamiast jednego', cols([
    stack([
        warn('Każde wywołanie woła <b>dwa</b> mniejsze, a każde z nich znowu dwa… Drzewo ma log n poziomów, ale na każdym <b>dwa razy więcej</b> węzłów: razem ok. <b>2n</b> wywołań. Zysk z dzielenia na pół zniknął!'),
        good(`Policz ${c('potega(a, n / 2)')} raz, zapisz w zmiennej i pomnóż przez siebie. Ta sama lekcja co przy Fibonaccim: <b>nie licz dwa razy tego samego</b>.`),
    ]),
    tree(T('n', [T('n/2', [T('n/4'), T('n/4')]), T('n/2', [T('n/4'), T('n/4')])]), { fs: 17, dy: 72 }),
], { t: '1.3fr 1fr', align: 'center' }));

// ================================================================ 13
sec('13');
slide('Ściąga: dziel i zwyciężaj', table(['Algorytm', 'Podział', 'Łączenie', 'Złożoność'], [
    ['min / max', 'dwie połowy', 'min z min, max z max', 'O(n)'],
    ['szybkie potęgowanie', 'aⁿ → a<sup>n/2</sup>', 'p · p (· a)', 'O(log n)'],
    ['wyszukiwanie binarne', 'jedna połowa', '— (odrzucamy drugą)', 'O(log n)'],
    ['merge sort', 'dwie połowy', 'scalanie dwóch ciągów', 'O(n log n)'],
    ['inwersje', 'jak merge sort', 'scalanie + s − i + 1', 'O(n log n)'],
    ['quickselect', 'podział wg pivota', '— (jedna część)', 'zwykle O(n)'],
    ['najlepszy fragment', 'dwie połowy', 'max z połówek i przez środek', 'O(n log n)'],
], { widths: ['26%', '24%', '32%', '18%'], cls: 'mid' }));

slide('Zadania na koniec — Twoja kolej', stack([
    P('Zadania są na <b>t-olimpians.com → Kompendium → Funkcje rekurencyjne → Krok 6</b>. Każde ma sprawdzarkę i wskazówkę:'),
    `<div class="cols" style="grid-template-columns:1fr 1fr;gap:20px">${[
        steps(['Minimum i maksimum przez połowienie', 'Szybkie potęgowanie', 'Wyszukiwanie binarne', 'Scalanie dwóch ciągów', 'Sortowanie przez scalanie', 'Zliczanie inwersji'], 'tight'),
        `<ol class="steps tight" style="counter-reset:s 6">${['K-ty najmniejszy element', 'Najlepszy spójny fragment', 'Dywan Sierpińskiego', 'Napis Fibonacciego', 'Ciąg Thuego–Morse’a'].map((x) => `<li>${x}</li>`).join('')}</ol>`,
    ].join('')}</div>`,
    note('To koniec kursu rekurencji. Dalej w kompendium: <b>Memoizacja i tabulacja</b> (programowanie dynamiczne), <b>Dziel i zwyciężaj</b> oraz <b>Wyszukiwanie binarne po wyniku</b>.'),
], { gap: 14 }));

D.build({
    html: 'pdf-src/prezentacja-rekurencja-6-dziel-i-zwyciezaj.html',
    pdf: 'prezentacja-rekurencja-6-dziel-i-zwyciezaj-t-olimpians.pdf',
    generator: 'pdf-src/build-prezentacja-rekurencja-6.js',
    title: 'Dziel i zwyciężaj — T-Olimpians',
    brand: 'rekurencja · część 6',
    foot: 'Rekurencja, część 6 — dziel i zwyciężaj',
    secs: SECS,
    cover: {
        kicker: '// T-OLIMPIANS — PREZENTACJA DO LEKCJI',
        h1: 'Dziel<br>i zwyciężaj',
        sub: 'Zamiast zmniejszać problem o jeden — dzielimy go na połowy. Szybkie potęgowanie, wyszukiwanie binarne, scalanie i sortowanie przez scalanie, zliczanie inwersji, quickselect, najlepszy fragment i fraktale.',
        meta: 'C++ · REKURENCJA · CZĘŚĆ 6 Z 6 · PO CZĘŚCIACH 1–5',
        deco: levels([[g([5, 2, 4, 6])], [g([2, 5], 'on'), g([4, 6], 'on')], [g([2, 4, 5, 6], 'on')]], { size: 'xs' }),
    },
    end: {
        kicker: '// KONIEC KURSU REKURENCJI',
        h1: 'Rekurencja<br>nie ma przed Tobą tajemnic!',
        sub: 'Od odliczania przez memoizację, generowanie i backtracking aż po dziel i zwyciężaj — sześć kroków za Tobą. Zrób zadania z kroku 6 i ruszaj dalej: programowanie dynamiczne czeka.',
        deco: board(carpet(1), { cw: 30, show: () => '', cls: (i, j, v) => (v === '#' ? 'q' : '') }),
    },
});
