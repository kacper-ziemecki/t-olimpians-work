#!/usr/bin/env node
/*
 * Prezentacja „Rekurencja — część 4: generowanie wszystkich możliwości” (T-Olimpians, kurs rekurencji, krok 4 z 6).
 *
 * Generuje pdf-src/prezentacja-rekurencja-4-generowanie.html i (z flagą --pdf)
 * prezentacja-rekurencja-4-generowanie-t-olimpians.pdf. Buduje na częściach 1–3: drzewo wywołań staje się
 * drzewem decyzji, a rekurencja — „pętlą w pętli w pętli…” o dowolnej głębokości.
 *
 *     node pdf-src/build-prezentacja-rekurencja-4.js --pdf
 */
const L = require('./prezentacja_lib');
const { code, c, P, stack, cols, note, warn, good, big, steps, traps, table, card, cards, kv, term, stos, trace, arr, tree, T } = L;
const D = L.deck();
const { sec, slide } = D;

const SECS = [
    ['01', 'Zadania „wypisz wszystko”'],
    ['02', 'Ciągi zero-jedynkowe'],
    ['03', 'Drzewo decyzji'],
    ['04', 'Więcej cyfr, mniej gałęzi'],
    ['05', 'Podzbiory: bierz / nie bierz'],
    ['06', 'Cofanie wyboru'],
    ['07', 'Wypisz, znajdź, policz'],
    ['08', 'Kombinacje: k z n'],
    ['09', 'Permutacje'],
    ['10', 'Nawiasy i rozkłady'],
    ['11', 'Powtórzenia w danych'],
    ['12', 'Ile tego jest?'],
    ['13', 'Sprawdź się'],
    ['14', 'Podsumowanie'],
];

// drzewo wszystkich ciągów nad alfabetem; label(prefix), edge(znak), leafCls(ciąg)
function seqTree(n, alph, o = {}) {
    const go = (pre) => {
        const ch = pre.length === n ? [] : alph.filter((x) => !o.allow || o.allow(pre, x)).map((x) => ({ ...go(pre + x), e: o.edge ? o.edge(pre, x) : x }));
        const cut = o.cut ? alph.filter((x) => pre.length < n && o.allow && !o.allow(pre, x)).map((x) => ({ t: pre + x, ch: [], e: x, s: 'cut' })) : [];
        return { t: pre === '' ? (o.root || 'start') : (o.label ? o.label(pre) : pre), ch: [...ch, ...cut].sort((a, b) => (a.e < b.e ? -1 : 1)), s: pre.length === n ? 'ok' : '' };
    };
    return go('');
}

// ================================================================ 01
sec('01');
slide('Nowy rodzaj zadań: wypisz wszystkie możliwości', stack([
    P('W wielu zadaniach trzeba przejrzeć <b>wszystkie</b> możliwości — i wypisać je, policzyć albo znaleźć najlepszą:'),
    cards([
        card('wszystkie kody PIN', 'z cyfr 1, 2, 3, długości 4 — jakie są?', 'tlc'),
        card('wszystkie drużyny', 'które 3 osoby z 6 można wysłać na zawody?', 'puc'),
        card('wszystkie kolejności', 'w jakiej kolejności odwiedzić 5 miast?', 'orc'),
        card('wszystkie podzbiory', 'które przedmioty spakować, żeby suma wag była równa 20?', 'tlc'),
    ], 2),
    note('Wszystkie te zadania rozwiązuje ten sam pomysł: <b>rekurencja, która podejmuje decyzje jedna po drugiej</b>.'),
], { gap: 18 }));

slide('Dlaczego pętle nie wystarczą?', cols([
    stack([
        code(`
            for (int a = 0; a <= 1; a++)
                for (int b = 0; b <= 1; b++)
                    for (int c = 0; c <= 1; c++)
                        cout << a << b << c << endl;`, { cap: 'ciągi zero-jedynkowe długości 3' }),
        term('000\n001\n010\n011\n100\n101\n110\n111'),
    ]),
    stack([
        P('Dla długości 3 potrzebujemy <b>3 pętli</b> jedna w drugiej. Dla długości 4 — czterech. A jeśli długość <b>n</b> wczytujemy z wejścia?'),
        warn('Nie da się napisać „n pętli w sobie”, gdy n znamy dopiero w trakcie działania programu.'),
        good('Rekurencja to właśnie <b>pętla w pętli w pętli…</b> o dowolnej głębokości: każde wywołanie to jedna pętla, a głębokość rekurencji = liczba pętli.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 02
sec('02');
const BIN = `
    int n;
    string s;

    void generuj(int i) {
        if (i == n) {
            cout << s << endl;
            return;
        }
        s[i] = '0';
        generuj(i + 1);
        s[i] = '1';
        generuj(i + 1);
    }`;
slide('Pomysł: wypełniaj ciąg pozycja po pozycji', cols([
    stack([
        P(`Funkcja ${c('generuj(i)')} zajmuje się <b>pozycją i</b> ciągu. Pozycje 0, …, i − 1 są już ustalone przez wcześniejsze wywołania.`),
        steps(['wstaw na pozycję i <b>0</b> i każ wywołaniu generuj(i + 1) dokończyć ciąg na wszystkie sposoby,', 'potem wstaw <b>1</b> i znowu wywołaj generuj(i + 1),', 'gdy i == n — wszystkie pozycje są ustalone: <b>wypisz</b> ciąg.'], 'tight'),
    ]),
    arr(['0', '1', '?', '?'], { name: 's', hi: [0, 1], sel: [2], ptr: { 2: 'i = 2' }, cap: 'w trakcie: pozycje 0 i 1 ustalone' }),
], { t: '1.3fr 1fr', align: 'center' }));

slide('Ciągi zero-jedynkowe — kod', cols([
    code(BIN, { size: 'sm', hl: [9, 10, 11, 12] }),
    stack([
        term('000\n001\n010\n011\n100\n101\n110\n111', { cap: 'n = 3, w main: s = string(n, \'0\'); generuj(0);' }),
        note('Każde wywołanie ma <b>dwa</b> wywołania w głąb — jak fib w części 3. Ale tym razem nic się nie powtarza: każdy liść to <b>inny</b> ciąg.'),
    ]),
], { t: '1fr 1fr', align: 'center' }));

slide('Śledzimy `n = 2`', cols([
    trace([
        { d: 0, k: 'call', t: 'generuj(0): s[0] = 0' },
        { d: 1, k: 'call', t: 'generuj(1): s[1] = 0' },
        { d: 2, k: 'out', t: 'generuj(2): wypisuje <b>00</b>' },
        { d: 1, k: 'call', t: 'generuj(1): s[1] = 1' },
        { d: 2, k: 'out', t: 'generuj(2): wypisuje <b>01</b>' },
        { d: 0, k: 'call', t: 'generuj(0): s[0] = 1' },
        { d: 1, k: 'call', t: 'generuj(1): s[1] = 0' },
        { d: 2, k: 'out', t: 'generuj(2): wypisuje <b>10</b>' },
        { d: 1, k: 'call', t: 'generuj(1): s[1] = 1' },
        { d: 2, k: 'out', t: 'generuj(2): wypisuje <b>11</b>' },
    ]),
    stack([
        P('Zwróć uwagę: s[1] jest <b>nadpisywane</b> — najpierw 0, potem 1. Po powrocie do generuj(0) i wstawieniu s[0] = 1 stara wartość s[1] nie przeszkadza, bo generuj(1) i tak ją nadpisze.'),
        note('Dzięki temu, że 0 próbujemy <b>przed</b> 1, ciągi wychodzą w kolejności alfabetycznej.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

// ================================================================ 03
sec('03');
slide('Drzewo decyzji dla `n = 3`', stack([
    tree(seqTree(3, ['0', '1']), { fs: 17, dy: 82 }),
    P('Drzewo wywołań to tu <b>drzewo decyzji</b>: na każdym poziomie decydujemy o jednej pozycji (podpis krawędzi). Każda droga od korzenia do liścia to <b>jeden ciąg</b> — liści jest 2 · 2 · 2 = <b>8</b>.', 'cen'),
], { gap: 10 }));

slide('Ile jest liści, ile wywołań?', cols([
    table(['n', 'ciągów (liści)', 'wywołań'], [['1', '2', '3'], ['3', '8', '15'], ['10', '1 024', '2 047'], ['20', 'ok. miliona', 'ok. 2 milionów'], ['30', 'ok. miliarda', '<b class="no">za dużo</b>']], { cls: 'mid ctr' }),
    stack([
        P('Każdy poziom ma <b>2 razy</b> więcej węzłów. Ciągów długości n jest <b>2ⁿ</b>, a wywołań — niecałe dwa razy więcej.'),
        warn('Memoizacja tu nie pomoże: wszystkie liście są <b>różne</b> i każdy trzeba wypisać. Dlatego w zadaniach „wypisz wszystko” n jest zwykle małe — do ok. 20.'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

// ================================================================ 04
sec('04');
slide('Więcej możliwości na pozycji: cyfry od 1 do k', cols([
    code(`
        void generuj(int i) {
            if (i == n) {
                cout << s << endl;
                return;
            }
            for (char c = '1'; c < '1' + k; c++) {
                s[i] = c;
                generuj(i + 1);
            }
        }`, { size: 'sm', hl: [6, 7, 8, 9] }),
    stack([
        P('Na każdej pozycji jest teraz <b>k</b> możliwości — zamiast pisać k wywołań, piszemy <b>pętlę</b>, a w niej jedno wywołanie.'),
        term('11\n12\n13\n21\n22\n23\n31\n32\n33', { cap: 'n = 2, k = 3' }),
        note('Ciągów jest <b>kⁿ</b>: k możliwości na każdej z n pozycji.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Ograniczenie: bez dwóch jedynek obok siebie', cols([
    code(`
        void generuj(int i) {
            if (i == n) {
                cout << s << endl;
                return;
            }
            s[i] = '0';
            generuj(i + 1);
            if (i == 0 || s[i - 1] == '0') {
                s[i] = '1';
                generuj(i + 1);
            }
        }`, { size: 'sm', hl: [8] }),
    stack([
        P('Jedynkę wolno wstawić tylko wtedy, gdy przed nią <b>nie ma jedynki</b>. Sprawdzamy to od razu — zanim zejdziemy głębiej.'),
        term('000\n001\n010\n100\n101', { cap: 'n = 3' }),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Obcinanie gałęzi', stack([
    tree(seqTree(3, ['0', '1'], { allow: (pre, x) => !(x === '1' && pre.endsWith('1')), cut: true }), { fs: 17, dy: 80 }),
    P('Wyblakłe węzły to gałęzie, do których <b>w ogóle nie wchodzimy</b> — skoro „11” już jest złe, nie ma sensu dopisywać do niego czegokolwiek. Im wcześniej odetniemy złą gałąź, tym mniej pracy.', 'cen'),
], { gap: 10 }));

// ================================================================ 05
sec('05');
slide('Podzbiory = ciągi zero-jedynkowe', cols([
    table(['ciąg', 'podzbiór {1, 2, 3}'], [['000', '{ } (pusty)'], ['001', '{3}'], ['010', '{2}'], ['011', '{2, 3}'], ['100', '{1}'], ['101', '{1, 3}'], ['110', '{1, 2}'], ['111', '{1, 2, 3}']], { cls: 'mid ctr' }),
    stack([
        P('Podzbiór zbioru {1, …, n} to <b>n decyzji</b>: czy liczba 1 jest w podzbiorze? czy 2 jest? … Każda decyzja to 0 (<b>nie bierz</b>) albo 1 (<b>bierz</b>).'),
        P('Każdy podzbiór odpowiada więc dokładnie jednemu ciągowi zero-jedynkowemu — i podzbiorów jest <b>2ⁿ</b>.'),
        note('Ten pomysł nazywa się po angielsku <i>pick / not pick</i> — u Strivera zobaczysz go w filmie L6.'),
    ]),
], { t: '0.85fr 1.15fr', align: 'center' }));

const SUB = `
    int n;
    vector<int> wybrane;

    void podzbiory(int i) {
        if (i > n) {
            for (int x : wybrane) cout << x << " ";
            cout << endl;
            return;
        }
        podzbiory(i + 1);          // nie bierz i
        wybrane.push_back(i);
        podzbiory(i + 1);          // bierz i
        wybrane.pop_back();
    }`;
slide('Podzbiory — kod', cols([
    code(SUB, { size: 'sm', hl: [10, 11, 12, 13] }),
    stack([
        P('Wybrane liczby trzymamy w <b>vector</b>. Decyzja „bierz” = dopisz liczbę na koniec wektora, zejdź głębiej, a po powrocie <b>usuń ją</b>.'),
        term('\n3\n2\n2 3\n1\n1 3\n1 2\n1 2 3', { cap: 'podzbiory(1) dla n = 3' }),
        note('Pierwszy wiersz jest pusty — to podzbiór pusty.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

const subTree = (() => {
    const go = (i, set) => {
        if (i > 3) return T(`{${set.join(',')}}`, [], { s: 'ok' });
        return T(i === 1 ? 'start' : `{${set.join(',')}}`, [{ ...go(i + 1, set), e: `bez ${i}` }, { ...go(i + 1, [...set, i]), e: `z ${i}` }]);
    };
    return go(1, []);
})();
slide('Drzewo decyzji: bierz / nie bierz', stack([
    tree(subTree, { fs: 18, dy: 92, gap: 12 }),
    P('Na poziomie i decydujemy o liczbie i: lewa krawędź — <b>bez niej</b>, prawa — <b>z nią</b>. W liściach — gotowe podzbiory (od lewej: kolejność wypisywania).', 'cen'),
], { gap: 10 }));

// ================================================================ 06
sec('06');
slide('Po co `pop_back`?', cols([
    stack([
        code(`
            podzbiory(i + 1);
            wybrane.push_back(i);
            podzbiory(i + 1);
            wybrane.pop_back();   // <- usuń i`, { size: 'lg', hl: [4] }),
        P('Wektor <b>wybrane</b> jest <b>jeden</b> — wspólny dla wszystkich wywołań (to zmienna globalna). Gdy wracamy z gałęzi „bierz i”, liczba i musi z niego zniknąć, bo w innych gałęziach jej nie wybraliśmy.'),
    ]),
    stack([
        term('\n3\n2\n2 3\n1\n1 3\n1 2\n1 2 3', { cap: 'z pop_back — dobrze' }),
        term('\n3\n3 2\n3 2 3\n3 2 3 1\n…', { cap: 'bez pop_back — źle' }),
    ]),
], { t: '1.3fr 1fr', align: 'center' }));

slide('Wektor `wybrane` krok po kroku (n = 2)', cols([
    trace([
        { d: 0, k: 'call', t: `nie bierz 1 → ${c('{ }')}` },
        { d: 1, k: 'out', t: `nie bierz 2 → wypisz ${c('{ }')}` },
        { d: 1, k: 'call', t: `push 2 → ${c('{2}')}, wypisz <b>2</b>` },
        { d: 1, k: 'ret', t: `pop → ${c('{ }')}` },
        { d: 0, k: 'call', t: `push 1 → ${c('{1}')}` },
        { d: 1, k: 'out', t: `nie bierz 2 → wypisz <b>1</b>` },
        { d: 1, k: 'call', t: `push 2 → ${c('{1, 2}')}, wypisz <b>1 2</b>` },
        { d: 1, k: 'ret', t: `pop → ${c('{1}')}` },
        { d: 0, k: 'ret', t: `pop → ${c('{ }')}` },
    ]),
    stack([
        P('Po każdym <b>push_back</b> jest dokładnie jedno <b>pop_back</b>. Dzięki temu po powrocie z wywołania wektor wygląda <b>tak samo</b> jak przed nim.'),
        good('Na końcu całej rekurencji wektor jest znowu pusty — wszystko, co dopisaliśmy, zostało cofnięte.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Schemat: wybierz → zejdź → cofnij', stack([
    cards([
        card('1 · wybierz', `zmień stan: ${c('wybrane.push_back(x)')}, ${c('uzyta[x] = true')}, ${c('s[i] = c')}…`, 'tlc'),
        card('2 · zejdź', `wywołaj rekurencję dla następnej decyzji: ${c('generuj(i + 1)')}`, 'puc'),
        card('3 · cofnij', `przywróć stan sprzed wyboru: ${c('pop_back()')}, ${c('uzyta[x] = false')}`, 'orc'),
    ], 3),
    big('To jest serce <em>backtrackingu</em> (części 5). Każdą zmianę wspólnego stanu trzeba po powrocie <strong>odwrócić</strong>.'),
    note(`Wyjątek: gdy stan jest <b>parametrem</b> (np. suma s w ${c('f(i + 1, s + a[i])')}), każde wywołanie ma własną kopię i niczego nie trzeba cofać.`),
], { gap: 20 }));

// ================================================================ 07
sec('07');
slide('Trzy wzorce rekurencji generującej', cards([
    card('wypisz wszystkie', 'Funkcja <b>void</b>. W liściu (gdy decyzje są podjęte) — sprawdź i <b>wypisz</b>. Przejdzie całe drzewo.', 'tlc'),
    card('znajdź jedno', 'Funkcja <b>bool</b>. W liściu zwróć true, gdy pasuje. Jeśli wywołanie zwróciło true — <b>od razu</b> zwróć true dalej, bez sprawdzania reszty drzewa.', 'puc'),
    card('policz', 'Funkcja <b>int / long long</b>. Liść zwraca 1 (pasuje) albo 0. Węzeł zwraca <b>sumę</b> wyników swoich dzieci.', 'orc'),
], 3), P('Ten podział Striver omawia w filmie L7 („Print all / Print one / Count”). Zobaczmy wszystkie trzy na jednym zadaniu: <b>podzbiory tablicy o sumie k</b>.', 'cen'));

slide('Wzorzec 1: wypisz wszystkie podzbiory o sumie k', cols([
    code(`
        void wypisz(int i, int s) {
            if (i == n) {
                if (s == k) {
                    for (int x : wybrane) cout << x << " ";
                    cout << endl;
                }
                return;
            }
            wypisz(i + 1, s);
            wybrane.push_back(a[i]);
            wypisz(i + 1, s + a[i]);
            wybrane.pop_back();
        }`, { size: 'sm' }),
    stack([
        arr([1, 2, 3, 2], { name: 'a' }),
        term('3 2\n2 3\n1 2 2', { cap: 'k = 5' }),
        note('Suma <b>s</b> jest parametrem — każde wywołanie ma swoją. Wektor <b>wybrane</b> jest wspólny — trzeba go cofać.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Wzorzec 2: znajdź jeden (czy w ogóle się da?)', cols([
    code(`
        bool da(int i, int s) {
            if (i == n) return s == k;
            if (da(i + 1, s + a[i])) return true;
            if (da(i + 1, s)) return true;
            return false;
        }`, { hl: [3] }),
    stack([
        P('Gdy którakolwiek gałąź zwróci <b>true</b>, przekazujemy true w górę i <b>nie zaglądamy</b> do pozostałych gałęzi.'),
        note('W najgorszym razie (gdy odpowiedź to „nie”) i tak przejdziemy całe drzewo — ale gdy odpowiedź to „tak”, często kończymy bardzo wcześnie.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Wzorzec 3: policz', cols([
    code(`
        int ile(int i, int s) {
            if (i == n) return s == k ? 1 : 0;
            return ile(i + 1, s) + ile(i + 1, s + a[i]);
        }`),
    stack([
        P('Każdy liść zwraca <b>1</b> (podzbiór pasuje) albo <b>0</b>. Każdy węzeł dodaje wyniki swoich dwóch dzieci. W korzeniu wychodzi liczba wszystkich pasujących podzbiorów.'),
        term('3', { cap: 'a = 1 2 3 2, k = 5' }),
        good('Gdy liczby są dodatnie, dodaj obcinanie: <b>if (s > k) return 0;</b> — suma już nie zmaleje.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Sumy wszystkich podzbiorów — bez wektora', cols([
    code(`
        void sumy(int i, int s) {
            if (i == n) {
                wynik.push_back(s);
                return;
            }
            sumy(i + 1, s);
            sumy(i + 1, s + a[i]);
        }`),
    stack([
        P('Gdy interesuje nas tylko <b>suma</b> wybranych liczb, nie trzeba pamiętać, które to były — wystarczy nieść sumę w parametrze.'),
        term('0 2 3 5 5 7 8 10', { cap: 'a = 2 3 5, po sortowaniu wyników' }),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 08
sec('08');
const COMB = `
    void wybieraj(int od) {
        if (wybrane.size() == k) {
            for (int x : wybrane) cout << x << " ";
            cout << endl;
            return;
        }
        for (int x = od; x <= n; x++) {
            wybrane.push_back(x);
            wybieraj(x + 1);
            wybrane.pop_back();
        }
    }`;
slide('Kombinacje: wybierz k liczb z n', cols([
    code(COMB, { size: 'sm', hl: [7, 8, 9, 10, 11] }),
    stack([
        P('Tym razem nie decydujemy o każdej liczbie „tak/nie”, tylko <b>dobieramy kolejną liczbę</b> — w pętli, spośród liczb od <b>od</b> do n.'),
        term('1 2\n1 3\n1 4\n2 3\n2 4\n3 4', { cap: 'n = 4, k = 2: wybieraj(1)' }),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

const combTree = T('start', [1, 2, 3, 4].map((a) => ({ ...T(`${a}`, [a + 1, a + 2, a + 3].filter((b) => b <= 4).map((b) => ({ ...T(`${a} ${b}`, [], { s: 'ok' }), e: `+${b}` }))), e: `+${a}` })));
slide('Drzewo kombinacji `n = 4, k = 2`', stack([
    tree(combTree, { fs: 17, dy: 90 }),
    P(`Następna liczba jest zawsze <b>większa</b> od poprzedniej (wołamy ${c('wybieraj(x + 1)')}), więc „1 2” powstaje, a „2 1” — nigdy. Każdy zbiór pojawia się <b>dokładnie raz</b>, od razu z liczbami rosnąco.`, 'cen'),
], { gap: 10 }));

slide('Ile jest kombinacji?', cols([
    table(['n', 'k', 'C(n, k)'], [['4', '2', '6'], ['5', '3', '10'], ['10', '5', '252'], ['20', '10', '184 756'], ['30', '15', 'ok. 155 milionów']], { cls: 'mid ctr' }),
    stack([
        P('To ten sam symbol Newtona C(n, k), który w części 3 <b>liczyliśmy</b> trójkątem Pascala — tym razem każdą kombinację <b>wypisujemy</b>.'),
        note(`Obcinanie: jeśli liczb do końca (n − x + 1) jest za mało, żeby dobrać brakujące — można przerwać pętlę. Np. dla k = 2 i n = 4 nie ma sensu zaczynać od x = 4.`),
    ]),
], { t: '0.9fr 1.1fr', align: 'center' }));

// ================================================================ 09
sec('09');
slide('Permutacje — wszystkie kolejności', cols([
    stack([
        P('Permutacja liczb 1, …, n to ustawienie ich wszystkich w jakiejś kolejności. Dla n = 3: <b>123, 132, 213, 231, 312, 321</b>.'),
        table(['n', 'permutacji = n!'], [['3', '6'], ['5', '120'], ['8', '40 320'], ['10', '3 628 800'], ['12', 'ok. 479 milionów']], { cls: 'mid ctr' }),
    ]),
    stack([
        P('Pomysł: na pozycję i wstawiamy <b>każdą liczbę, która jeszcze nie została użyta</b>. Do zapamiętania, które są zajęte, służy tablica <b>uzyta[]</b>.'),
        note('Na pierwszą pozycję jest n możliwości, na drugą n − 1, … — razem n · (n − 1) · … · 1 = <b>n!</b>.'),
    ]),
], { t: '0.9fr 1.1fr', align: 'center' }));

const PERM = `
    int n, perm[10];
    bool uzyta[10];

    void permutuj(int i) {
        if (i == n) {
            for (int j = 0; j < n; j++) cout << perm[j] << " ";
            cout << endl;
            return;
        }
        for (int x = 1; x <= n; x++) {
            if (uzyta[x]) continue;
            uzyta[x] = true;
            perm[i] = x;
            permutuj(i + 1);
            uzyta[x] = false;
        }
    }`;
slide('Permutacje — kod', cols([
    code(PERM, { size: 'xs', hl: [11, 12, 13, 14, 15] }),
    stack([
        steps([`${c('if (uzyta[x]) continue;')} — liczba już stoi wcześniej, pomijamy ją,`, '<b>wybierz</b>: zaznacz x jako użytą i wstaw na pozycję i,', `<b>zejdź</b>: ${c('permutuj(i + 1)')},`, `<b>cofnij</b>: ${c('uzyta[x] = false')} — x znowu wolna dla innych gałęzi.`], 'tight'),
        term('1 2 3\n1 3 2\n2 1 3\n2 3 1\n3 1 2\n3 2 1', { cap: 'n = 3' }),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

const permTree = (() => {
    const go = (pre) => T(pre === '' ? 'start' : pre, ['1', '2', '3'].filter((x) => !pre.includes(x)).map((x) => ({ ...go(pre + x), e: x })), { s: pre.length === 3 ? 'ok' : '' });
    return go('');
})();
slide('Drzewo permutacji `n = 3`', stack([
    tree(permTree, { fs: 18, dy: 92 }),
    P('Na pierwszym poziomie 3 gałęzie, na drugim po 2, na trzecim po 1 — razem <b>3! = 6</b> liści, od razu w kolejności leksykograficznej (bo pętla idzie od x = 1 w górę).', 'cen'),
], { gap: 10 }));

slide('Druga metoda: zamiany (swap)', cols([
    code(`
        void permutuj(int i) {
            if (i == n) { wypisz(); return; }
            for (int j = i; j < n; j++) {
                swap(a[i], a[j]);
                permutuj(i + 1);
                swap(a[i], a[j]);
            }
        }`, { size: 'sm' }),
    stack([
        P('Na pozycję i wstawiamy po kolei każdy element z pozycji i, …, n − 1 — zamieniając go miejscami. Po powrocie <b>zamieniamy z powrotem</b> (cofnięcie wyboru).'),
        note('Tę metodę Striver pokazuje w filmie L13. Działa bez tablicy uzyta[], ale permutacje <b>nie wychodzą</b> w kolejności leksykograficznej — gdy zadanie jej wymaga, użyj pierwszej metody.'),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

// ================================================================ 10
sec('10');
slide('Poprawne nawiasowania', cols([
    stack([
        P('Napis z n nawiasów „(” i n nawiasów „)” jest poprawny, gdy każdy nawias ma swoją parę. Dla n = 3: <b>((())), (()()), (())(), ()(()), ()()()</b>.'),
        P('Dopisujemy po jednym nawiasie, ale <b>tylko taki, który ma sens</b>:'),
        steps([`„(” — gdy otworzyliśmy mniej niż n: ${c('otw < n')}`, `„)” — gdy jest co zamykać: ${c('zam < otw')}`], 'tight'),
    ]),
    code(`
        void generuj(int otw, int zam) {
            if (zam == n) { cout << s << endl; return; }
            if (otw < n) {
                s.push_back('(');
                generuj(otw + 1, zam);
                s.pop_back();
            }
            if (zam < otw) {
                s.push_back(')');
                generuj(otw, zam + 1);
                s.pop_back();
            }
        }`, { size: 'xs' }),
], { t: '1fr 1.05fr', align: 'center' }));

const parTree = (() => {
    const go = (s, o, z) => {
        const ch = [];
        if (o < 2) ch.push({ ...go(s + '(', o + 1, z), e: '(' });
        if (z < o) ch.push({ ...go(s + ')', o, z + 1), e: ')' });
        return T(s || 'start', ch, { s: z === 2 ? 'ok' : '' });
    };
    return go('', 0, 0);
})();
slide('Drzewo dla `n = 2`', cols([
    tree(parTree, { fs: 18, dy: 74 }),
    stack([
        P('Z „start” wolno tylko otworzyć. Z „((” wolno już tylko zamykać. Gałęzie prowadzące do złych napisów (jak „)(”) <b>w ogóle nie powstają</b>.'),
        note('Poprawnych nawiasowań z n par jest: 1, 2, 5, 14, 42, 132, 429, 1430… — to tak zwane <b>liczby Catalana</b>.'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Rozkłady liczby — wypisz wszystkie', cols([
    code(`
        void rozklad(int zostalo, int maks) {
            if (zostalo == 0) { wypisz(); return; }
            for (int x = min(zostalo, maks); x >= 1; x--) {
                skladniki.push_back(x);
                rozklad(zostalo - x, x);
                skladniki.pop_back();
            }
        }`, { size: 'sm' }),
    stack([
        P('W części 3 <b>liczyliśmy</b> rozkłady liczby n. Teraz każdy <b>wypisujemy</b>. Kolejny składnik nie może być większy od poprzedniego — dzięki temu 3+1 i 1+3 nie powstaną oba.'),
        term('4\n3+1\n2+2\n2+1+1\n1+1+1+1', { cap: 'rozklad(4, 4)' }),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 11
sec('11');
slide('Problem: powtórzenia w danych', cols([
    stack([
        arr([1, 2, 2], { name: 'a' }),
        P('Podzbiory tej tablicy, wybierane po pozycjach, to m.in. {1, 2} z pierwszą dwójką i {1, 2} z drugą dwójką. Na ekranie wyglądają <b>tak samo</b>!'),
        warn('Gdy zadanie każe wypisać <b>różne</b> podzbiory (albo różne kombinacje, permutacje), takie powtórki trzeba wyeliminować.'),
    ]),
    stack([
        P('Pomysł (Striver, film L11):'),
        steps(['<b>posortuj</b> tablicę — równe liczby staną obok siebie,', 'gdy w pętli wybierasz <b>kolejny element</b>, a ten jest równy poprzedniemu na tym samym poziomie — <b>pomiń go</b>.'], 'tight'),
        code(`
            for (int i = od; i < n; i++) {
                if (i > od && a[i] == a[i - 1]) continue;
                ...
            }`, { size: 'xs', hl: [2] }),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Dlaczego `i > od`?', cols([
    tree(T('start', [{ ...T('1', [{ ...T('1 2', [{ ...T('1 2 2', [], { s: 'ok' }), e: '2' }], { s: 'ok' }), e: '2' }, { ...T('1 2', [], { s: 'cut' }), e: '2' }], { s: 'ok' }), e: '1' }, { ...T('2', [{ ...T('2 2', [], { s: 'ok' }), e: '2' }], { s: 'ok' }), e: '2' }, { ...T('2', [], { s: 'cut' }), e: '2' }]), { fs: 17, dy: 80 }),
    stack([
        P('Na <b>jednym poziomie</b> (w jednej pętli) z kilku równych liczb próbujemy tylko <b>pierwszej</b> — wyblakłe gałęzie to pominięte powtórki.'),
        P('Ale <b>głębiej</b> druga dwójka wolno wziąć — stąd „2 2” i „1 2 2”. Warunek <b>i > od</b> pilnuje, żeby pomijać tylko powtórki w tej samej pętli, a nie pierwszy element pętli.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Permutacje słowa z powtórzonymi literami', cols([
    code(`
        int ile[26];       // ile zostało każdej litery

        void generuj(int i) {
            if (i == n) { cout << slowo << endl; return; }
            for (int c = 0; c < 26; c++) {
                if (ile[c] == 0) continue;
                ile[c]--;
                slowo[i] = 'a' + c;
                generuj(i + 1);
                ile[c]++;
            }
        }`, { size: 'xs' }),
    stack([
        P('Z „aab” przestawianiem liter dostaniemy tylko <b>3</b> różne słowa: aab, aba, baa. Zamiast wybierać <b>pozycję</b> litery, wybieramy <b>literę</b> — każdą różną literę raz.'),
        term('aab\naba\nbaa', { cap: 'słowo „aab”' }),
        note('Pętla po literach a…z daje od razu kolejność alfabetyczną.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 12
sec('12');
slide('Ile tego jest? — rozpoznaj złożoność', table(['Co generujemy', 'Ile wyników', 'Rozsądne n (ok. 1 s)'], [
    ['ciągi zero-jedynkowe, podzbiory', '2ⁿ', 'n ≤ 20–25'],
    ['ciągi z k znaków', 'kⁿ', 'zależy od k: 3ⁿ → n ≤ 15'],
    ['kombinacje k z n', 'C(n, k)', 'n ≤ 30 dla małych k'],
    ['permutacje', 'n!', 'n ≤ 10–11'],
    ['nawiasowania', 'liczby Catalana', 'n ≤ 15'],
], { widths: ['40%', '24%', '36%'] }), note('Rekurencja generująca działa tak długo, jak duże jest drzewo — a drzewo ma co najmniej tyle liści, ile wyników. Gdy w zadaniu n jest małe (≤ 20), to często znak, że <b>wolno sprawdzić wszystko</b>.'));

// ================================================================ 13
sec('13');
const quiz = (n, title, src, extra = '', size = 'lg') => slide(`Pytanie ${n}: ${title}`, cols([
    code(src, { size }),
    stack([term('?'), extra ? P(extra, 'muted') : '', P('Zastanów się i zapisz odpowiedź, <b>zanim</b> przejdziesz dalej.', 'muted')]),
], { t: '1.4fr 1fr', align: 'center' }));

quiz(1, 'co wypisze `generuj(0)` dla `n = 2`?', `
    void generuj(int i) {
        if (i == n) { cout << s << endl; return; }
        s[i] = 'b'; generuj(i + 1);
        s[i] = 'a'; generuj(i + 1);
    }`, '', '');
slide('Odpowiedź 1: `bb ba ab aa`', cols([
    term('bb\nba\nab\naa'),
    note('Najpierw próbujemy <b>b</b>, potem <b>a</b> — więc kolejność jest odwrotna niż alfabetyczna. Kolejność wywołań w funkcji decyduje o kolejności wyników!'),
], { t: '0.6fr 1.4fr', align: 'center' }));

quiz(2, 'ile wierszy wypisze `wybieraj(1)` dla `n = 5, k = 3`?', COMB, '', 'xs');
slide('Odpowiedź 2: `10`', cols([
    term('1 2 3\n1 2 4\n1 2 5\n1 3 4\n1 3 5\n1 4 5\n2 3 4\n2 3 5\n2 4 5\n3 4 5'),
    note('Tyle, ile jest 3-elementowych podzbiorów zbioru 5-elementowego: C(5, 3) = 10.'),
], { t: '0.6fr 1.4fr', align: 'center' }));

quiz(3, 'co tu jest źle?', `
    void permutuj(int i) {
        if (i == n) { wypisz(); return; }
        for (int x = 1; x <= n; x++) {
            if (uzyta[x]) continue;
            uzyta[x] = true;
            perm[i] = x;
            permutuj(i + 1);
        }
    }`, 'Program dla n = 3 wypisuje tylko jedną permutację.', 'sm');
slide('Odpowiedź 3: brak cofnięcia', cols([
    code(`
        uzyta[x] = true;
        perm[i] = x;
        permutuj(i + 1);
        ⟦uzyta[x] = false;⟧`, { size: 'lg', good: true, cap: 'poprawnie' }),
    warn('Bez <b>uzyta[x] = false</b> po pierwszej permutacji 1 2 3 wszystkie liczby są oznaczone jako zajęte już na zawsze — żadna inna gałąź nie znajdzie wolnej liczby. Zawsze cofaj zmiany wspólnego stanu.'),
], { t: '1.1fr 1fr', align: 'center' }));

quiz(4, 'ile razy wywoła się `podzbiory` dla `n = 3`?', SUB, 'Łącznie z pierwszym wywołaniem podzbiory(1).', 'xs');
slide('Odpowiedź 4: `15`', cols([
    tree(subTree, { fs: 12, dy: 64, gap: 6 }),
    note('Drzewo ma 1 + 2 + 4 + 8 = <b>15</b> węzłów: 8 liści (podzbiorów) i 7 węzłów, w których podejmujemy decyzje.'),
], { t: '1.4fr 1fr', align: 'center' }));

// ================================================================ 14
sec('14');
slide('Ściąga: generowanie wszystkich możliwości', table(['Co', 'Rdzeń kodu', 'Uwagi'], [
    ['ciągi', `${c('for (c : znaki) { s[i] = c; f(i + 1); }')}`, 'i == n → wypisz'],
    ['podzbiory', `${c('f(i + 1); push(i); f(i + 1); pop();')}`, 'bierz / nie bierz'],
    ['kombinacje', `${c('for (x = od..n) { push(x); f(x + 1); pop(); }')}`, 'następna liczba większa'],
    ['permutacje', `${c('if (!uzyta[x]) { uzyta = 1; f(i + 1); uzyta = 0; }')}`, 'tablica uzyta[]'],
    ['powtórzenia', `${c('if (i > od && a[i] == a[i - 1]) continue;')}`, 'najpierw sort'],
    ['wypisz / znajdź / policz', 'void / bool / int', 'policz: liść zwraca 1 lub 0'],
    ['cofanie', 'każda zmiana wspólnego stanu → odwróć po powrocie', 'parametry cofają się same'],
], { widths: ['20%', '52%', '28%'], cls: 'mid' }));

slide('Zadania na koniec — Twoja kolej', stack([
    P('Zadania są na <b>t-olimpians.com → Kompendium → Funkcje rekurencyjne → Krok 4</b>. Każde ma sprawdzarkę i wskazówkę:'),
    `<div class="cols" style="grid-template-columns:1fr 1fr;gap:20px">${[
        steps(['Wszystkie ciągi zero-jedynkowe', 'Ciągi z cyfr od 1 do k', 'Bez dwóch jedynek obok siebie', 'Wszystkie podzbiory', 'Sumy wszystkich podzbiorów', 'Ile podzbiorów ma sumę k?', 'Czy da się uzbierać k?', 'Wybierz k z n', 'Wszystkie permutacje'], 'tight'),
        `<ol class="steps tight" style="counter-reset:s 9">${['Permutacje napisu', 'Poprawne nawiasowania', 'Rozkłady liczby na składniki', 'Suma z powtórzeniami', 'Każda liczba co najwyżej raz', 'Podzbiory bez powtórzeń', 'Klawiatura telefonu', 'K-ta permutacja'].map((x) => `<li>${x}</li>`).join('')}</ol>`,
    ].join('')}</div>`,
], { gap: 14 }));

D.build({
    html: 'pdf-src/prezentacja-rekurencja-4-generowanie.html',
    pdf: 'prezentacja-rekurencja-4-generowanie-t-olimpians.pdf',
    generator: 'pdf-src/build-prezentacja-rekurencja-4.js',
    title: 'Generowanie wszystkich możliwości — T-Olimpians',
    brand: 'rekurencja · część 4',
    foot: 'Rekurencja, część 4 — generowanie wszystkich możliwości',
    secs: SECS,
    cover: {
        kicker: '// T-OLIMPIANS — PREZENTACJA DO LEKCJI',
        h1: 'Generowanie<br>wszystkich możliwości',
        sub: 'Rekurencja jako „pętla w pętli” o dowolnej głębokości: ciągi, podzbiory (bierz / nie bierz), kombinacje, permutacje i nawiasy. Drzewo decyzji, cofanie wyboru i trzy wzorce: wypisz wszystkie, znajdź jedno, policz.',
        meta: 'C++ · REKURENCJA · CZĘŚĆ 4 Z 6 · PO CZĘŚCIACH 1–3',
        deco: tree(seqTree(2, ['0', '1']), { fs: 14, dy: 54, vals: false }),
    },
    end: {
        kicker: '// KONIEC CZĘŚCI 4',
        h1: 'Umiesz już przejrzeć<br>wszystkie możliwości!',
        sub: 'Każda decyzja to poziom drzewa, każdy liść to jeden wynik. Wybierz, zejdź, cofnij — i pamiętaj, ile liści ma drzewo. Zrób zadania z kroku 4, a potem część 5: backtracking, czyli szukanie z wycofywaniem.',
        deco: arr(['1', '2', '3'], { name: 'perm', hi: [0, 1, 2], size: 'sm' }),
    },
});
