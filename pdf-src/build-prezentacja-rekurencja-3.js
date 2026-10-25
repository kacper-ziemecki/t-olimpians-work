#!/usr/bin/env node
/*
 * Prezentacja „Rekurencja — część 3: drzewo rekurencji i memoizacja” (T-Olimpians, kurs rekurencji, krok 3 z 6).
 *
 * Generuje pdf-src/prezentacja-rekurencja-3-drzewo-i-memoizacja.html i (z flagą --pdf)
 * prezentacja-rekurencja-3-drzewo-i-memoizacja-t-olimpians.pdf. Buduje na częściach 1–2:
 * funkcja woła siebie kilka razy → drzewo wywołań → zapamiętywanie wyników (memoizacja).
 *
 *     node pdf-src/build-prezentacja-rekurencja-3.js --pdf
 */
const L = require('./prezentacja_lib');
const { code, c, P, stack, cols, note, warn, good, big, steps, traps, table, card, cards, kv, term, stos, trace, arr, anat, tree, T, board, chart } = L;
const D = L.deck();
const { sec, slide } = D;

const SECS = [
    ['01', 'Dwa wywołania naraz'],
    ['02', 'Ciąg Fibonacciego'],
    ['03', 'Drzewo wywołań'],
    ['04', 'Kolejność wywołań'],
    ['05', 'Ile jest wywołań?'],
    ['06', 'Memoizacja'],
    ['07', 'Schody'],
    ['08', 'Ścieżki na planszy'],
    ['09', 'Trójkąt Pascala'],
    ['10', 'Najlepszy wynik: żaba'],
    ['11', 'Wieże Hanoi'],
    ['12', 'Dwa parametry'],
    ['13', 'Sprawdź się'],
    ['14', 'Podsumowanie'],
];

const fr = (f, d, s = 'wait') => ({ f, d, s });
const fibv = (n) => { let a = 0, b = 1; for (let i = 0; i < n; i++) [a, b] = [b, a + b]; return a; };

// Pełne drzewo wywołań fib(n); label(n) — napis w węźle, st(n, ścieżka) — stan.
function fibTree(n, o = {}) {
    const lab = o.label || ((k) => `fib(${k})`);
    const go = (k) => T(lab(k), k <= 1 ? [] : [go(k - 1), go(k - 2)], { v: o.vals === false ? null : `= ${fibv(k)}`, s: o.st ? o.st(k) : '' });
    return go(n);
}

// Drzewo fib(n) w chwili k-tego zdarzenia przechodzenia (wejście / wyjście z wywołania).
function fibTreeAt(n, k, lab = (x) => `fib(${x})`) {
    const root = (function build(m) { return { m, ch: m <= 1 ? [] : [build(m - 1), build(m - 2)] }; })(n);
    const ev = [];
    (function dfs(x) { ev.push(['in', x]); x.ch.forEach(dfs); ev.push(['out', x]); })(root);
    const entered = new Set(), done = new Set();
    let last = root;
    ev.slice(0, k + 1).forEach(([t, x]) => { if (t === 'in') { entered.add(x); last = x; } else { done.add(x); } });
    const path = [];
    const conv = (x) => {
        const s = done.has(x) ? 'done' : entered.has(x) ? (x === last && !done.has(x) ? 'on' : '') : 'ghost';
        if (entered.has(x) && !done.has(x)) path.push(x);
        return T(lab(x.m), x.ch.map(conv), { s, v: done.has(x) ? `= ${fibv(x.m)}` : null });
    };
    const t = conv(root);
    // najgłębsze aktywne wywołanie = ostatnio wejście bez wyjścia
    let deepest = null;
    (function find(x, d) { if (entered.has(x) && !done.has(x)) { if (!deepest || d > deepest[1]) deepest = [x, d]; } x.ch.forEach((y) => find(y, d + 1)); })(root, 0);
    return { tree: t, path: path.map((x) => x.m), deepest: deepest && deepest[0].m, events: ev.length };
}

const FIB = `
    int fib(int n) {
        if (n <= 1) return n;
        return fib(n - 1) + fib(n - 2);
    }`;

// ================================================================ 01
sec('01');
slide('Przypomnienie: funkcja, która woła siebie dwa razy', cols([
    stack([
        code(`
            void linijka(int n) {
                if (n == 0) return;
                linijka(n - 1);
                cout << n << " ";
                linijka(n - 1);
            }`, { size: 'lg', hl: [3, 5] }),
        term('1 2 1 3 1 2 1', { cap: 'linijka(3) wypisuje' }),
    ]),
    stack([
        P('To pytanie 5 z części 1. Funkcja ma <b>dwa</b> wywołania samej siebie: jedno przed wypisaniem, drugie po nim.'),
        P(`${c('linijka(3)')} = całe ${c('linijka(2)')} → <b>3</b> → całe ${c('linijka(2)')}.`),
        note('Gdy funkcja woła siebie więcej niż raz, wywołania nie układają się już w <b>linię</b>, tylko rozgałęziają się jak <b>drzewo</b>.'),
    ]),
], { t: '1fr 1.05fr', align: 'center' }));

slide('Drzewo wywołań `linijka(3)`', stack([
    tree(T('l(3)', [T('l(2)', [T('l(1)', [T('l(0)'), T('l(0)')]), T('l(1)', [T('l(0)'), T('l(0)')])]), T('l(2)', [T('l(1)', [T('l(0)'), T('l(0)')]), T('l(1)', [T('l(0)'), T('l(0)')])])]), { fs: 16, dy: 70 }),
    P('Każdy prostokąt to <b>jedno wywołanie</b> (l = linijka). Strzałki w dół to wywołania: każde l(n) z n > 0 woła <b>dwa</b> razy l(n − 1). Na samym dole — warunki stopu l(0).'),
], { gap: 14 }));

slide('Ile razy wywoła się `linijka(n)`?', cols([
    table(['n', 'wywołań', 'wypisanych liczb'], [
        ['1', '3', '1'], ['2', '7', '3'], ['3', '15', '7'], ['10', '2 047', '1 023'], ['20', 'ok. 2 milionów', 'ok. miliona'], ['30', 'ok. 2 miliardów', 'ok. miliarda'],
    ], { cls: 'mid ctr' }),
    stack([
        P('Każdy poziom drzewa ma <b>dwa razy więcej</b> wywołań niż poprzedni: 1, 2, 4, 8, … Razem dla n jest ich <b>2ⁿ⁺¹ − 1</b>.'),
        warn('Drzewo rośnie <b>wykładniczo</b>. Dla linijki to nie problem — i tak trzeba wypisać 2ⁿ − 1 liczb. Ale za chwilę zobaczymy funkcję, w której takie drzewo to czysta strata czasu.'),
    ]),
], { t: '1fr 1.15fr', align: 'center' }));

// ================================================================ 02
sec('02');
slide('Ciąg Fibonacciego', stack([
    P('Każdy wyraz to <b>suma dwóch poprzednich</b>. Zaczynamy od 0 i 1:'),
    arr([0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55], { name: 'F', idxs: ['F(0)', 'F(1)', 'F(2)', 'F(3)', 'F(4)', 'F(5)', 'F(6)', 'F(7)', 'F(8)', 'F(9)', 'F(10)'], size: 'smw' }),
    big('F(0) = 0, F(1) = 1, <em>F(n) = F(n − 1) + F(n − 2)</em>'),
    note('Na przykład F(7) = F(6) + F(5) = 8 + 5 = 13. Ten ciąg pojawia się w zadaniach olimpijskich zaskakująco często — za chwilę zobaczysz go w schodach i ciągach bez sąsiednich jedynek.'),
], { gap: 18 }));

slide('Fibonacci rekurencyjnie — prosto z definicji', cols([
    stack([code(FIB), term('13', { cap: 'fib(7)' })]),
    table(['Pytanie', 'Odpowiedź'], [
        ['Kiedy kończę?', 'n ≤ 1: fib(0) = 0, fib(1) = 1 — czyli <b>return n</b>'],
        ['Jak zmniejszyć?', `<b>dwa</b> mniejsze problemy: ${c('fib(n - 1)')} i ${c('fib(n - 2)')}`],
        ['Co zwracam?', 'sumę obu wyników'],
    ], { widths: ['36%', '64%'] }),
], { t: '1.05fr 1fr', align: 'center' }));

slide('Linijka z dwoma wywołaniami', anat([
    ['return ', 'pu', '1'], ['fib(n - 1)', 'tl', '2'], [' + ', null, null], ['fib(n - 2)', 'or', '3'], [';', null, null],
], [
    ['1', 'pu', 'return', 'oddaj sumę temu, kto wywołał'],
    ['2', 'tl', 'fib(n - 1)', 'liczy się pierwsze — CAŁE, ze wszystkimi swoimi wywołaniami'],
    ['3', 'or', 'fib(n - 2)', 'liczy się drugie — dopiero gdy pierwsze się skończy'],
]), note('Kopia fib(n) czeka na stosie <b>dwa razy</b>: najpierw na wynik fib(n − 1), potem na wynik fib(n − 2). Dopiero wtedy dodaje i zwraca.'));

// ================================================================ 03
sec('03');
slide('Drzewo wywołań `fib(4)`', cols([
    tree(fibTree(4), { fs: 20, dy: 88 }),
    stack([
        P('Pod każdym wywołaniem — wartość, którą zwraca (pomarańczowa).'),
        steps(['fib(4) woła fib(3) i fib(2).', 'fib(3) woła fib(2) i fib(1).', 'Każde fib(2) woła fib(1) i fib(0).', 'fib(1) i fib(0) to <b>liście</b> — warunki stopu.'], 'tight'),
        note('Wartości liczy się <b>od liści w górę</b>: 1 + 0 = 1, potem 1 + 1 = 2, i tak dalej, aż na górze wyjdzie 3.'),
    ]),
], { t: '1.35fr 1fr', align: 'center' }));

slide('Drzewo wywołań `fib(5)`', stack([
    tree(fibTree(5, { st: (k) => (k === 3 ? 'memo' : '') }), { fs: 19, dy: 80 }),
    P('Zauważ: <b style="color:var(--or)">fib(3)</b> liczy się tu <b>dwa razy</b> — i za każdym razem schodzi przez całe swoje poddrzewo, choć wynik jest ten sam: 2.', 'cen'),
], { gap: 8 }));

slide('Te same obliczenia wiele razy', cols([
    table(['Wywołanie', 'ile razy w fib(5)', 'ile razy w fib(10)'], [
        [c('fib(5)'), '1', '—'], [c('fib(4)'), '1', '—'], [c('fib(3)'), '2', '21'], [c('fib(2)'), '3', '34'], [c('fib(1)'), '5', '55'], [c('fib(0)'), '3', '34'],
    ], { cls: 'mid ctr' }),
    stack([
        P('Przy większym n jest jeszcze gorzej. W drzewie fib(10) samo fib(1) pojawia się 55 razy, a fib(2) — 34 razy.'),
        big('Problem nie jest w rekurencji, tylko w <strong>liczeniu tego samego</strong> wiele razy.'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

// ================================================================ 04
sec('04');
const atSlide = (title, k, info) => {
    const s = fibTreeAt(4, k);
    const frames = [fr('main()', 'czeka', 'main'), ...s.path.map((m, i) => fr(`fib(${m})`, i === s.path.length - 1 ? 'działa' : 'czeka', i === s.path.length - 1 ? 'on' : 'wait'))];
    slide(title, cols([
        tree(s.tree, { fs: 18, dy: 80 }),
        stack([P(info), stos(frames, { size: 'sm' })]),
    ], { t: '1.45fr 1fr', align: 'center' }));
};
slide('W jakiej kolejności wykonują się wywołania?', stack([
    big('Komputer schodzi <em>najpierw w lewo, do samego dna</em>, a dopiero po powrocie idzie w prawo.'),
    P(`W ${c('return fib(n - 1) + fib(n - 2);')} najpierw liczy się całe <b>fib(n − 1)</b> — z całym jego poddrzewem. Dopiero gdy ono zwróci wynik, zaczyna się <b>fib(n − 2)</b>.`),
    note('Na kolejnych slajdach: <b style="color:var(--tl)">turkusowe</b> — wywołanie, które właśnie działa, białe — czekające na stosie, <b style="color:#c6b8ff">fioletowe</b> — już skończone (z wynikiem), wyblakłe — jeszcze się nie zaczęły.'),
], { gap: 20 }));
atSlide('Klatka 1: schodzimy w lewo do `fib(1)`', 3, 'fib(4) → fib(3) → fib(2) → fib(1). Na stosie leżą cztery kopie fib, każda czeka na swoje <b>lewe</b> dziecko.');
atSlide('Klatka 2: `fib(2)` gotowe, teraz prawe dziecko `fib(3)`', 8, 'fib(1) zwróciło 1, fib(0) zwróciło 0, więc fib(2) = 1 i zniknęło ze stosu. fib(3) dostało pierwszy wynik i woła <b>prawe</b> dziecko: fib(1).');
atSlide('Klatka 3: `fib(3)` = 2, zaczyna się prawa połowa', 11, 'fib(3) = 1 + 1 = 2. Teraz fib(4) ma wynik lewego dziecka i woła prawe: <b>fib(2)</b> — które znowu zejdzie do fib(1) i fib(0).');
atSlide('Klatka 4: wszystko policzone', 17, 'Prawe fib(2) = 1, więc fib(4) = 2 + 1 = 3 — i wynik wraca do main. Każde wywołanie zostało odwiedzone dokładnie raz, w kolejności: najpierw lewe poddrzewo, potem prawe.');

slide('Stos jest tak wysoki jak drzewo — nie większy', cols([
    stack([
        P('W każdej chwili na stosie leżą tylko wywołania na <b>drodze</b> od korzenia do wywołania, które właśnie działa.'),
        P('Drzewo fib(n) ma wysokość n, więc stos ma najwyżej <b>n</b> pięter — nawet gdy wszystkich wywołań są miliony.'),
        good('Pamięć to nie problem. Problemem jest <b>czas</b>: każde z milionów wywołań trzeba wykonać.'),
    ]),
    tree(fibTreeAt(5, 4).tree, { fs: 15, dy: 64 }),
], { t: '1fr 1.25fr', align: 'center' }));

// ================================================================ 05
sec('05');
slide('Ile wywołań wykona `fib(n)`?', cols([
    table(['n', 'F(n)', 'wywołań fib', 'czas'], [
        ['10', '55', '177', 'błyskawicznie'], ['20', '6 765', '21 891', 'błyskawicznie'], ['30', '832 040', 'ok. 2,7 mln', 'ok. 0,01 s'],
        ['40', '102 334 155', 'ok. 331 mln', '<b class="no">ok. 1 s</b>'], ['50', 'ok. 1,3 · 10¹⁰', 'ok. 4 · 10¹⁰', '<b class="no">ok. 2 minuty</b>'], ['90', 'ok. 2,9 · 10¹⁸', 'ok. 9 · 10¹⁸', '<b class="no">setki lat</b>'],
    ], { widths: ['11%', '27%', '30%', '32%'], cls: 'mid' }),
    stack([
        P('Liczbę wywołań W(n) łatwo policzyć — też rekurencyjnie: <b>W(n) = 1 + W(n − 1) + W(n − 2)</b>, W(0) = W(1) = 1.'),
        note('Wychodzi, że W(n) = 2 · F(n + 1) − 1. Wywołań jest mniej więcej <b>tyle, ile wynosi sam wynik</b> — a F(n) rośnie prawie 1,6 raza z każdym krokiem.'),
    ]),
], { t: '1.25fr 1fr', align: 'center' }));

slide('Wykres: wywołania rosną wykładniczo', cols([
    chart([['bez pamięci', (x) => 2 * fibv(Math.round(x) + 1) - 1, '#d95926'], ['z pamięcią', (x) => 2 * x, '#199e70']], 30, 3e6, { ylabel: 'liczba wywołań', points: [[25, 2 * fibv(26) - 1, 'n = 25: ok. 243 tys.'], [30, 2 * fibv(31) - 1, '']] }),
    stack([
        P('Pomarańczowa linia stoi „płasko”, a potem nagle wystrzela w górę — to znak funkcji <b>wykładniczej</b>.'),
        P('Zielona linia to ta sama funkcja z <b>pamięcią</b> (za chwilę): dla n = 30 tylko <b>59</b> wywołań — na wykresie nawet nie odrywa się od osi.'),
    ]),
], { t: '1.35fr 1fr', align: 'center' }));

// ================================================================ 06
sec('06');
slide('Pomysł: zapisuj wyniki w zeszycie', cols([
    stack([
        big('Zanim zaczniesz liczyć, <em>zajrzyj do zeszytu</em>. Gdy policzysz — <strong>zapisz wynik</strong>.'),
        P('Zeszyt to zwykła tablica <b>pamiec[]</b>: w komórce pamiec[n] trzymamy policzone już fib(n). Na start wpisujemy wszędzie <b>−1</b>, co znaczy „jeszcze nie liczone”.'),
    ]),
    arr(['-1', '-1', 1, 2, 3, '-1', '-1'], { name: 'pamiec', hi: [2, 3, 4], cap: 'zeszyt w trakcie liczenia fib(6)', size: 'sm' }),
], { t: '1.3fr 1fr', align: 'center' }), note('Ten sposób ma swoją nazwę: <b>memoizacja</b> (od angielskiego <i>memo</i> — notatka). To pierwszy krok do programowania dynamicznego.'));

const MEMO = `
    long long pamiec[91];

    long long fib(int n) {
        if (n <= 1) return n;
        if (pamiec[n] != -1) return pamiec[n];
        pamiec[n] = fib(n - 1) + fib(n - 2);
        return pamiec[n];
    }

    int main() {
        for (int i = 0; i <= 90; i++) pamiec[i] = -1;
        cout << fib(90);
    }`;
slide('Fibonacci z pamięcią', cols([
    code(MEMO, { size: 'sm', hl: [5, 6, 7] }),
    stack([
        steps([`linijka 5: <b>sprawdź zeszyt</b> — jeśli fib(n) już było liczone, zwróć zapisany wynik od razu,`,
            'linijka 6: w przeciwnym razie <b>policz</b> tak jak dawniej i <b>zapisz</b> w zeszycie,',
            'linijka 7: zwróć wynik.'], 'tight'),
        term('2880067194370816120', { cap: 'fib(90) — natychmiast' }),
        note('Zeszyt wypełniamy −1 w main. <b>−1</b> nadaje się na znacznik, bo prawdziwe fib(n) nigdy nie jest ujemne.'),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

const memoTree = T('fib(5)', [T('fib(4)', [T('fib(3)', [T('fib(2)', [T('fib(1)', [], { v: '= 1', s: 'done' }), T('fib(0)', [], { v: '= 0', s: 'done' })], { v: '= 1, zapisz', s: 'done' }), T('fib(1)', [], { v: '= 1', s: 'done' })], { v: '= 2, zapisz', s: 'done' }), T('fib(2)', [], { v: 'z zeszytu: 1', s: 'memo' })], { v: '= 3, zapisz', s: 'done' }), T('fib(3)', [], { v: 'z zeszytu: 2', s: 'memo' })], { v: '= 5', s: 'on' });
slide('Drzewo `fib(5)` z pamięcią', cols([
    tree(memoTree, { fs: 18, dy: 80, gap: 30 }),
    stack([
        P('Gdy drugi raz potrzebujemy fib(2) i fib(3), są już w zeszycie (<b style="color:var(--or)">pomarańczowe</b>). Całe ich poddrzewa <b>znikają</b>.'),
        table(['', 'bez pamięci', 'z pamięcią'], [['fib(5)', '15 wywołań', '<b>9</b>'], ['fib(30)', 'ok. 2,7 mln', '<b>59</b>'], ['fib(90)', 'ok. 9 · 10¹⁸', '<b>179</b>']], { cls: 'mid ctr' }),
    ]),
], { t: '1.3fr 1fr', align: 'center' }));

slide('Memoizacja — przepis na każdą funkcję', stack([
    code(`
        long long pamiec[MAX];          // MAX — większe niż największy argument

        long long f(int n) {
            if (warunek stopu) return wynik;
            if (pamiec[n] != -1) return pamiec[n];   // 1. zajrzyj do zeszytu
            pamiec[n] = ... f(mniejsze) ...;         // 2. policz i zapisz
            return pamiec[n];                        // 3. zwróć
        }`, { size: 'sm' }),
    cards([
        card('kiedy pomaga?', 'Gdy te same wywołania (z tymi samymi argumentami) powtarzają się w drzewie <b>wiele razy</b>.', 'tlc'),
        card('kiedy nie pomaga?', 'Gdy każde wywołanie jest inne — np. odliczanie albo wypisywanie wszystkich ciągów (część 4).', 'orc'),
        card('ile kosztuje?', 'Tyle wywołań, ile jest <b>różnych argumentów</b> — każdy liczony raz — i tablica na wyniki.', 'puc'),
    ], 3),
], { gap: 16 }));

// ================================================================ 07
sec('07');
slide('Schody', cols([
    stack([
        P('Bajtek wchodzi na schody o <b>n</b> stopniach. Jednym krokiem pokonuje <b>1</b> albo <b>2</b> stopnie. Na ile sposobów może wejść na szczyt?'),
        table(['n', 'sposoby', 'ile'], [['1', '1', '1'], ['2', '1+1, 2', '2'], ['3', '1+1+1, 1+2, 2+1', '3'], ['4', '1+1+1+1, 1+1+2, 1+2+1, 2+1+1, 2+2', '5']], { widths: ['10%', '72%', '18%'], cls: 'mid' }),
    ]),
    stack([
        P('Popatrz na <b>ostatni krok</b>. Na stopień n Bajtek wszedł:'),
        steps(['ze stopnia <b>n − 1</b> (krokiem o 1) — sposobów jest tyle, ile dojść do n − 1,', 'albo ze stopnia <b>n − 2</b> (krokiem o 2) — tyle, ile dojść do n − 2.'], 'tight'),
        big('sposoby(n) = sposoby(n − 1) + <em>sposoby(n − 2)</em>'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Schody — kod', cols([
    code(`
        long long pamiec[81];

        long long sposoby(int n) {
            if (n <= 1) return 1;
            if (pamiec[n] != -1) return pamiec[n];
            pamiec[n] = sposoby(n - 1) + sposoby(n - 2);
            return pamiec[n];
        }`, { size: 'sm' }),
    stack([
        P('Warunki stopu: <b>sposoby(1) = 1</b> (jeden krok o 1) i <b>sposoby(0) = 1</b> — gdy już stoimy na szczycie, jest dokładnie jeden sposób: nic nie robić.'),
        note('To dokładnie Fibonacci, tylko przesunięty o jeden: sposoby(n) = F(n + 1). Bez pamięci byłby tak samo wolny jak fib.'),
        warn('Wynik dla n = 80 to ok. 3,8 · 10¹⁶ — <b>long long</b>.'),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

slide('A gdyby kroki mogły mieć długość od 1 do k?', cols([
    code(`
        long long sposoby(int n) {
            if (n == 0) return 1;
            if (pamiec[n] != -1) return pamiec[n];
            long long wynik = 0;
            for (int d = 1; d <= k && d <= n; d++)
                wynik += sposoby(n - d);
            return pamiec[n] = wynik;
        }`, { size: 'sm', hl: [5, 6] }),
    stack([
        P('Ostatni krok mógł mieć długość 1, 2, …, k. Sumujemy więc <b>k</b> wywołań — w pętli. Pętla w funkcji rekurencyjnej to nic złego!'),
        note(`${c('return pamiec[n] = wynik;')} — przypisanie i zwrócenie w jednej linijce: najpierw zapisujemy, a potem zwracamy zapisaną wartość.`),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 08
sec('08');
const GRID = [[1, 1, 1, 1, 1], [1, 2, 3, 4, 5], [1, 3, 6, 10, 15], [1, 4, 10, 20, 35]];
slide('Ścieżki na planszy', cols([
    stack([
        P('Pionek idzie z lewego górnego rogu do prawego dolnego, tylko <b>w prawo</b> albo <b>w dół</b>. Ile jest ścieżek?'),
        P('Na pole (i, j) pionek mógł wejść tylko <b>z góry</b> albo <b>z lewej</b>. Więc liczba ścieżek do pola = ścieżki do pola nad nim + ścieżki do pola po lewej.'),
        big('ś(i, j) = ś(i − 1, j) + <em>ś(i, j − 1)</em>'),
    ]),
    stack([
        board(GRID, { cw: 56, cls: (i, j) => (i === 2 && j === 2 ? 'q' : (i === 1 && j === 2) || (i === 2 && j === 1) ? 'path' : '') }),
        P('6 = 3 (z góry) + 3 (z lewej). W pierwszym wierszu i pierwszej kolumnie jest tylko <b>1</b> ścieżka — prosto.', 'muted'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Ścieżki — kod z pamięcią 2D', cols([
    code(`
        long long pamiec[18][18];

        long long sciezki(int i, int j) {
            if (i == 1 || j == 1) return 1;
            if (pamiec[i][j] != -1) return pamiec[i][j];
            pamiec[i][j] = sciezki(i - 1, j) + sciezki(i, j - 1);
            return pamiec[i][j];
        }`, { size: 'xs' }),
    stack([
        P('Funkcja ma <b>dwa parametry</b>, więc zeszyt jest <b>dwuwymiarowy</b>: pamiec[i][j] to wynik dla pola (i, j).'),
        table(['plansza', 'bez pamięci', 'z pamięcią'], [['4 × 5', 'ok. 70 wywołań', '≤ 20 pól'], ['17 × 17', '<b class="no">ponad miliard</b>', '<b class="yes">≤ 289 pól</b>']], { cls: 'mid ctr' }),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Ścieżki z przeszkodami', cols([
    board([[1, 1, 1, 1], [1, '#', 1, 2], [1, 1, 2, 4]], { cw: 60, cls: (i, j, v) => (v === '#' ? 'x' : i === 2 && j === 3 ? 'q' : '') }),
    stack([
        P('Na zablokowane pole (#) prowadzi <b>0</b> ścieżek. Wystarczy jeden dodatkowy warunek stopu:'),
        code(`
            long long sciezki(int i, int j) {
                if (i < 0 || j < 0 || g[i][j] == '#') return 0;
                if (i == 0 && j == 0) return 1;
                ...
            }`, { size: 'sm' }),
        note('Tu pola numerujemy od 0, a start (0, 0) ma jedną ścieżkę. Wyjście poza planszę też daje 0 — dzięki temu pierwszy wiersz i kolumna liczą się same.'),
    ]),
], { t: '0.8fr 1.2fr', align: 'center' }));

// ================================================================ 09
sec('09');
slide('Symbol Newtona: na ile sposobów wybrać k z n?', cols([
    stack([
        P('C(n, k) — na ile sposobów można wybrać <b>k</b> osób z grupy <b>n</b> osób. Np. z 4 osób parę można wybrać na C(4, 2) = 6 sposobów.'),
        P('Spójrz na <b>jedną osobę</b> — Bajtka:'),
        steps(['wybieramy Bajtka — dobieramy jeszcze k − 1 osób z n − 1 pozostałych: <b>C(n − 1, k − 1)</b>,', 'nie wybieramy go — wszystkie k osób z n − 1 pozostałych: <b>C(n − 1, k)</b>.'], 'tight'),
    ]),
    stack([
        big('C(n, k) = C(n − 1, k − 1) + <em>C(n − 1, k)</em>'),
        note('Warunki stopu: C(n, 0) = 1 (nikogo nie wybieramy) i C(n, n) = 1 (wybieramy wszystkich).'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Trójkąt Pascala', cols([
    table(['n', 'C(n, 0) … C(n, n)'], [['0', '1'], ['1', '1 1'], ['2', '1 2 1'], ['3', '1 3 3 1'], ['4', '1 4 <b>6</b> 4 1'], ['5', '1 5 10 10 5 1'], ['6', '1 6 15 20 15 6 1']], { widths: ['12%', '88%'], cls: 'mid' }),
    stack([
        P('Każda liczba to suma <b>dwóch liczb nad nią</b>: 6 = 3 + 3. To jest właśnie nasz wzór rekurencyjny.'),
        code(`
            long long C(int n, int k) {
                if (k == 0 || k == n) return 1;
                if (pamiec[n][k] != -1) return pamiec[n][k];
                return pamiec[n][k] = C(n - 1, k - 1) + C(n - 1, k);
            }`, { size: 'xs' }),
    ]),
], { t: '0.9fr 1.1fr', align: 'center' }));

// ================================================================ 10
sec('10');
slide('Żaba na kamieniach', cols([
    stack([
        P('Żaba skacze z kamienia 1 na kamień n. Z kamienia i skacze na <b>i + 1</b> albo <b>i + 2</b>. Skok kosztuje <b>|różnica wysokości|</b>. Jaki jest najmniejszy łączny koszt?'),
        arr([10, 30, 40, 20], { name: 'h', idxs: ['1', '2', '3', '4'], size: 'lg' }),
    ]),
    stack([
        P('Tym razem <b>nie liczymy sposobów</b>, tylko szukamy <b>najlepszego</b>. Na kamień i żaba przyskoczyła z i − 1 albo z i − 2 — wybieramy tańszą możliwość:'),
        big('koszt(i) = <em>min</em>( koszt(i − 1) + |hᵢ − hᵢ₋₁|, koszt(i − 2) + |hᵢ − hᵢ₋₂| )'),
    ]),
], { t: '1fr 1.2fr', align: 'center' }));

slide('Żaba — liczymy po kolei', cols([
    table(['i', 'z i − 1', 'z i − 2', 'koszt(i)'], [
        ['1', '—', '—', '<b>0</b> (start)'], ['2', '0 + |30 − 10| = 20', '—', '<b>20</b>'], ['3', '20 + |40 − 30| = 30', '0 + |40 − 10| = 30', '<b>30</b>'], ['4', '30 + |20 − 40| = 50', '20 + |20 − 30| = 30', '<b>30</b>'],
    ], { widths: ['8%', '34%', '34%', '24%'], cls: 'mid' }),
    stack([
        code(`
            long long koszt(int i) {
                if (i == 1) return 0;
                if (pamiec[i] != -1) return pamiec[i];
                long long w = koszt(i - 1) + abs(h[i] - h[i - 1]);
                if (i >= 3)
                    w = min(w, koszt(i - 2) + abs(h[i] - h[i - 2]));
                return pamiec[i] = w;
            }`, { size: 'xs' }),
        note('<b>Liczba sposobów → dodajemy</b> wyniki wywołań. <b>Najlepszy wynik → min albo max</b> z wyników.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 11
sec('11');
slide('Wieże Hanoi', cols([
    stack([
        P('Trzy pręty, na pierwszym n krążków od największego do najmniejszego. Przenieś wszystko na pręt 3:'),
        steps(['w jednym ruchu przenosisz <b>jeden</b> krążek z wierzchu,', 'nigdy nie kładziesz <b>większego na mniejszym</b>.'], 'tight'),
        P('Jak przenieść n krążków z A na C? Rekurencyjnie!'),
    ]),
    stack([
        steps(['przenieś <b>n − 1</b> górnych krążków z A na B (używając C jako pomocniczego),', 'przełóż <b>największy</b> krążek z A na C,', 'przenieś <b>n − 1</b> krążków z B na C (używając A jako pomocniczego).'], 'big'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Hanoi — kod', cols([
    stack([
        code(`
            void hanoi(int n, int z, int na, int przez) {
                if (n == 0) return;
                hanoi(n - 1, z, przez, na);
                cout << z << " -> " << na << endl;
                hanoi(n - 1, przez, na, z);
            }`, { size: 'sm' }),
        P(`Z main: ${c('hanoi(3, 1, 3, 2)')} — 3 krążki z pręta 1 na pręt 3, przez pręt 2.`),
    ]),
    term('1 -> 3\n1 -> 2\n3 -> 2\n1 -> 3\n2 -> 1\n2 -> 3\n1 -> 3', { cap: 'hanoi(3, 1, 3, 2)' }),
], { t: '1.4fr 1fr', align: 'center' }));

slide('Ile ruchów?', cols([
    table(['n', 'ruchów'], [['1', '1'], ['2', '3'], ['3', '7'], ['10', '1 023'], ['20', 'ok. miliona'], ['64', 'ok. 1,8 · 10¹⁹']], { cls: 'mid ctr' }),
    stack([
        P('ruchy(n) = ruchy(n − 1) + 1 + ruchy(n − 1) = <b>2 · ruchy(n − 1) + 1</b>, a ruchy(0) = 0. Wychodzi <b>2ⁿ − 1</b>.'),
        note('Tu memoizacja <b>nic nie da</b>: hanoi(n − 1, …) za każdym razem przenosi krążki <b>między innymi prętami</b>, więc każdy ruch jest inny i trzeba go wypisać.'),
        P('Legenda mówi, że mnisi przenoszą 64 krążki od początku świata. Przy jednym ruchu na sekundę skończą za ok. 585 miliardów lat.', 'muted'),
    ]),
], { t: '0.8fr 1.2fr', align: 'center' }));

// ================================================================ 12
sec('12');
slide('Rozkłady liczby na składniki', cols([
    stack([
        P('Na ile sposobów można zapisać n jako sumę dodatnich liczb, jeśli kolejność nie ma znaczenia? Dla n = 4: <b>4, 3+1, 2+2, 2+1+1, 1+1+1+1</b> — 5 sposobów.'),
        P('<b>R(n, k)</b> = liczba rozkładów n na składniki <b>nie większe niż k</b>. Dzielimy rozkłady na dwie grupy:'),
        steps(['<b>bez</b> składnika k → R(n, k − 1),', '<b>z</b> co najmniej jednym składnikiem k → zabieramy go: R(n − k, k).'], 'tight'),
    ]),
    stack([
        code(`
            long long R(int n, int k) {
                if (n == 0) return 1;
                if (k == 0) return 0;
                if (k > n) return R(n, n);
                if (pamiec[n][k] != -1) return pamiec[n][k];
                return pamiec[n][k] = R(n, k - 1) + R(n - k, k);
            }`, { size: 'xs' }),
        note('Odpowiedź: R(n, n). Dla n = 100 to ponad 190 milionów rozkładów — policzonych w ułamku sekundy.'),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

slide('Monety: na ile sposobów wydać resztę?', cols([
    stack([
        P('Nominały c₁, …, cₙ, każdego nieograniczenie wiele. Na ile sposobów wypłacić kwotę S? Ten sam pomysł co w rozkładach — patrzymy na <b>ostatni nominał</b>:'),
        steps(['nie używamy go wcale → sposoby(i − 1, s),', 'używamy go choć raz → odkładamy jedną monetę: sposoby(i, s − cᵢ).'], 'tight'),
    ]),
    code(`
        long long sposoby(int i, int s) {
            if (s == 0) return 1;
            if (s < 0 || i == 0) return 0;
            if (pamiec[i][s] != -1) return pamiec[i][s];
            return pamiec[i][s] =
                sposoby(i - 1, s) + sposoby(i, s - c[i]);
        }`, { size: 'xs' }),
], { t: '1fr 1.05fr', align: 'center' }), note('Dla monet 1, 2, 5 i kwoty 5: 5 · 1+2+2 · 1+1+1+2 · 1+1+1+1+1 — 4 sposoby. Dwa parametry → zeszyt dwuwymiarowy.'));

// ================================================================ 13
sec('13');
const quiz = (n, title, src, extra = '', size = 'lg') => slide(`Pytanie ${n}: ${title}`, cols([
    code(src, { size }),
    stack([term('?'), extra ? P(extra, 'muted') : '', P('Zastanów się i zapisz odpowiedź, <b>zanim</b> przejdziesz dalej.', 'muted')]),
], { t: '1.4fr 1fr', align: 'center' }));

quiz(1, 'ile wywołań wykona `f(4)`?', `
    int f(int n) {
        if (n == 0) return 1;
        return f(n - 1) + f(n - 1);
    }`, 'A ile wynosi wynik?');
slide('Odpowiedź 1: 31 wywołań, wynik 16', cols([
    tree(T('f(2)', [T('f(1)', [T('f(0)'), T('f(0)')]), T('f(1)', [T('f(0)'), T('f(0)')])]), { fs: 16, dy: 70 }),
    stack([
        P('Obok drzewo f(2): 7 wywołań. Każde wywołanie woła dwa razy to samo, więc drzewo f(n) ma 1 + 2 + 4 + … + 2ⁿ = <b>2ⁿ⁺¹ − 1</b> wywołań: dla n = 4 to <b>31</b>. Wynik to 2ⁿ = <b>16</b>.'),
        good(`Wystarczy policzyć raz: ${c('int x = f(n - 1); return x + x;')} — tylko <b>n + 1</b> wywołań!`),
    ]),
], { t: '1fr 1.2fr', align: 'center' }));

quiz(2, 'ile wywołań wykona `fib(10)` z pamięcią?', MEMO.split('\n').slice(0, 9).join('\n'), '', 'sm');
slide('Odpowiedź 2: 19', cols([
    stack([
        P('fib(n) woła fib(n − 1) — pełne wywołanie — i fib(n − 2), które jest już w zeszycie (od razu zwraca). Wywołania idą więc po „lewej krawędzi” drzewa i każde ma jedno szybkie prawe dziecko.'),
        table(['', 'liczba wywołań'], [['fib(10) z pamięcią', '2 · 10 − 1 = <b>19</b>'], ['fib(10) bez pamięci', '<b>177</b>']], { cls: 'mid' }),
    ]),
    tree(memoTree, { fs: 14, dy: 64, gap: 24 }),
], { t: '1fr 1.15fr', align: 'center' }));

quiz(3, 'ile wynosi `sciezki(3, 3)`?', `
    long long sciezki(int i, int j) {
        if (i == 1 || j == 1) return 1;
        return sciezki(i - 1, j) + sciezki(i, j - 1);
    }`, '', '');
slide('Odpowiedź 3: 6', cols([
    board([[1, 1, 1], [1, 2, 3], [1, 3, 6]], { cw: 64, cls: (i, j) => (i === 2 && j === 2 ? 'q' : '') }),
    note('Każde pole = pole nad nim + pole po lewej. Na planszy 3 × 3 jest <b>6</b> ścieżek: PPDD, PDPD, PDDP, DPPD, DPDP, DDPP.'),
], { t: '0.7fr 1.3fr', align: 'center' }));

quiz(4, 'dlaczego to wciąż jest wolne?', `
    long long fib(int n) {
        if (n <= 1) return n;
        if (pamiec[n] != -1) return pamiec[n];
        return fib(n - 1) + fib(n - 2);
    }`, '', '');
slide('Odpowiedź 4: nic nie zapisujemy!', cols([
    code(`
        long long fib(int n) {
            if (n <= 1) return n;
            if (pamiec[n] != -1) return pamiec[n];
            return ⟦pamiec[n] =⟧ fib(n - 1) + fib(n - 2);
        }`, { good: true, cap: 'poprawnie' }),
    warn('Funkcja zagląda do zeszytu, ale <b>nigdy do niego nie pisze</b> — wszędzie zostaje −1, więc liczy wszystko od nowa. Zawsze sprawdź obie części: <b>czytanie i zapisywanie</b>.'),
], { t: '1.3fr 1fr', align: 'center' }));

// ================================================================ 14
sec('14');
slide('Ściąga: drzewo rekurencji i memoizacja', table(['Pojęcie', 'Co to znaczy', 'Pamiętaj'], [
    ['drzewo wywołań', 'każde wywołanie to węzeł, jego wywołania to dzieci', 'liście = warunki stopu'],
    ['kolejność', 'najpierw całe lewe poddrzewo, potem prawe', 'stos = droga od korzenia'],
    ['liczba wywołań', 'przy dwóch wywołaniach rośnie jak 2ⁿ', 'policz, zanim uruchomisz'],
    ['memoizacja', 'zeszyt pamiec[] z −1 na start: sprawdź, policz, zapisz', 'wywołań tyle, ile różnych argumentów'],
    ['liczba sposobów', 'dodajemy wyniki wywołań', 'schody, ścieżki, Pascal, monety'],
    ['najlepszy wynik', 'min / max z wyników wywołań', 'żaba'],
    ['dwa parametry', 'zeszyt dwuwymiarowy pamiec[i][j]', 'ścieżki, C(n, k), rozkłady'],
], { widths: ['22%', '46%', '32%'], cls: 'mid' }));

slide('Zadania na koniec — Twoja kolej', stack([
    P('Zadania są na <b>t-olimpians.com → Kompendium → Funkcje rekurencyjne → Krok 3</b>. Każde ma sprawdzarkę i wskazówkę:'),
    `<div class="cols" style="grid-template-columns:1fr 1fr;gap:20px">${[
        steps(['Liczby Fibonacciego', 'Linijka', 'Wieże Hanoi', 'Fibonacci z pamięcią', 'Ile wywołań?', 'Schody', 'Schody z dłuższymi krokami'], 'tight'),
        `<ol class="steps tight" style="counter-reset:s 7">${['Trójkąt Pascala', 'Ścieżki na planszy', 'Ścieżki z przeszkodami', 'Żaba na kamieniach', 'Na ile sposobów rozłożyć liczbę?', 'Ile sposobów wydania reszty?'].map((x) => `<li>${x}</li>`).join('')}</ol>`,
    ].join('')}</div>`,
    note('Memoizacja to wstęp do <b>programowania dynamicznego</b> — następny temat w kompendium to „Memoizacja i tabulacja”.'),
], { gap: 14 }));

D.build({
    html: 'pdf-src/prezentacja-rekurencja-3-drzewo-i-memoizacja.html',
    pdf: 'prezentacja-rekurencja-3-drzewo-i-memoizacja-t-olimpians.pdf',
    generator: 'pdf-src/build-prezentacja-rekurencja-3.js',
    title: 'Drzewo rekurencji i memoizacja — T-Olimpians',
    brand: 'rekurencja · część 3',
    foot: 'Rekurencja, część 3 — drzewo rekurencji i memoizacja',
    secs: SECS,
    cover: {
        kicker: '// T-OLIMPIANS — PREZENTACJA DO LEKCJI',
        h1: 'Drzewo rekurencji<br>i memoizacja',
        sub: 'Co się dzieje, gdy funkcja woła samą siebie dwa razy: drzewo wywołań, kolejność ich wykonywania i to, dlaczego potrafi być gigantyczne. Potem zeszyt z wynikami — memoizacja — i zadania „na ile sposobów?”.',
        meta: 'C++ · REKURENCJA · CZĘŚĆ 3 Z 6 · PO CZĘŚCIACH 1–2',
        deco: tree(fibTree(3, { vals: false }), { fs: 14, dy: 52, vals: false }),
    },
    end: {
        kicker: '// KONIEC CZĘŚCI 3',
        h1: 'Drzewo nie straszy,<br>gdy masz zeszyt!',
        sub: 'Dwa wywołania tworzą drzewo, a drzewo rośnie wykładniczo. Gdy te same wywołania się powtarzają, zapisuj wyniki — memoizacja zamienia miliardy wywołań w kilkadziesiąt. Zrób zadania z kroku 3, a potem część 4: generowanie wszystkich możliwości.',
        deco: arr(['0', '1', '1', '2', '3', '5', '8', '13'], { name: 'pamiec', hi: [0, 1, 2, 3, 4, 5, 6, 7], size: 'sm' }),
    },
});
