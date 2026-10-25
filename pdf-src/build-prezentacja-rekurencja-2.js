#!/usr/bin/env node
/*
 * Prezentacja „Rekurencja — część 2: rekurencja, która zwraca wynik” (T-Olimpians, kurs rekurencji, krok 2 z 6).
 *
 * Generuje pdf-src/prezentacja-rekurencja-2-zwracanie-wyniku.html i (z flagą --pdf)
 * prezentacja-rekurencja-2-zwracanie-wyniku-t-olimpians.pdf. Buduje na części 1 (warunek stopu,
 * stos, kod przed i po wywołaniu): teraz wynik wraca przez return i „płynie” w górę stosu.
 *
 *     node pdf-src/build-prezentacja-rekurencja-2.js --pdf
 */
const L = require('./prezentacja_lib');
const { code, c, P, stack, cols, note, warn, good, big, steps, traps, table, card, cards, kv, term, stos, trace, arr, anat, tree, T } = L;
const D = L.deck();
const { sec, slide } = D;

const SECS = [
    ['01', 'Przypomnienie z części 1'],
    ['02', 'return w rekurencji'],
    ['03', 'Suma od 1 do n'],
    ['04', 'Wynik płynie w górę'],
    ['05', 'Zaufaj rekurencji'],
    ['06', 'Silnia i potęga'],
    ['07', 'Cyfry liczby'],
    ['08', 'Rekurencja na tablicy'],
    ['09', 'Napisy i dwa indeksy'],
    ['10', 'Parametr-akumulator'],
    ['11', 'NWD i inne kroki'],
    ['12', 'Pułapki'],
    ['13', 'Sprawdź się'],
    ['14', 'Podsumowanie'],
];

const YES = '<b class="yes">TAK</b>';
const NO = '<b class="no">NIE</b>';
const fr = (f, d, s = 'wait') => ({ f, d, s });

// ================================================================ 01
sec('01');
slide('Co już umiemy', cols([
    code(`
        void odliczaj(int n) {
            if (n == 0) return;
            cout << n << " ";
            odliczaj(n - 1);
        }`, { size: 'lg' }),
    stack([
        steps(['<b>Warunek stopu</b> — najmniejszy przypadek, w którym funkcja nie woła siebie.',
            '<b>Mniejszy problem</b> — wywołanie z argumentem bliższym warunkowi stopu.',
            'Kod <b>przed</b> wywołaniem działa w drodze w dół, kod <b>po</b> — w drodze w górę.',
            'Każde wywołanie to osobna <b>kopia</b> funkcji na <b>stosie</b>, z własnymi zmiennymi.']),
    ]),
], { t: '1fr 1.2fr', align: 'center' }));

slide('Dziś: funkcja, która coś oblicza', cols([
    stack([
        P('W części 1 funkcje tylko <b>wypisywały</b>. Teraz napiszemy funkcje, które <b>liczą wynik</b> i oddają go przez <b>return</b> — bez ani jednej pętli.'),
        code(`
            int suma(int n) {
                if (n == 0) return 0;
                return n + suma(n - 1);
            }

            int main() {
                cout << suma(5);
            }`),
    ]),
    stack([
        term('15'),
        note('Dwie linijki, a funkcja liczy 1 + 2 + 3 + 4 + 5. Na kolejnych slajdach zobaczysz, <b>skąd</b> się bierze ta liczba — wywołanie po wywołaniu.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 02
sec('02');
slide('return — przypomnienie', cols([
    stack([
        code(`
            int podwoj(int x) {
                return 2 * x;
            }

            int main() {
                int a = podwoj(3);
                cout << a + podwoj(10);
            }`),
        term('26'),
    ]),
    stack([
        P('<b>return</b> robi dwie rzeczy naraz:'),
        steps(['<b>kończy</b> funkcję — dalsze linijki już się nie wykonają,', '<b>oddaje wynik</b> tam, skąd funkcję wywołano.'], 'tight'),
        P(`Wywołanie ${c('podwoj(3)')} w programie „zamienia się” w liczbę <b>6</b>, a ${c('podwoj(10)')} — w <b>20</b>. Dlatego na ekranie jest 6 + 20 = 26.`),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Wywołanie w środku wyrażenia', cols([
    stack([
        code(`
            int podwoj(int x) {
                return 2 * x;
            }

            int main() {
                cout << podwoj(podwoj(podwoj(1)));
            }`),
        term('8'),
    ]),
    stack([
        P('Gdy wywołanie stoi w środku innego wyrażenia, komputer musi <b>najpierw</b> policzyć to wywołanie, a dopiero potem resztę:'),
        steps([`${c('podwoj(1)')} = <b>2</b>`, `${c('podwoj(2)')} = <b>4</b>`, `${c('podwoj(4)')} = <b>8</b>`], 'tight'),
        note(`W rekurencji będzie dokładnie tak samo: w ${c('return n + suma(n - 1);')} funkcja musi <b>poczekać</b> na wynik ${c('suma(n - 1)')}, zanim doda do niego n.`),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

// ================================================================ 03
sec('03');
slide('Problem: suma 1 + 2 + … + n', stack([
    P('Chcemy policzyć sumę liczb od 1 do n — <b>bez pętli</b>. Popatrz na dwie sumy obok siebie:'),
    table(['n', 'suma(n)', 'Zauważ'], [
        ['4', '1 + 2 + 3 + 4 = <b>10</b>', ''],
        ['5', '1 + 2 + 3 + 4 + 5 = <b>15</b>', 'to jest <b>suma(4) + 5</b>!'],
        ['6', '1 + 2 + 3 + 4 + 5 + 6 = <b>21</b>', 'to jest <b>suma(5) + 6</b>'],
    ], { widths: ['10%', '50%', '40%'] }),
    big('suma(n) = <em>n</em> + <strong>suma(n − 1)</strong>'),
    note('Każdą sumę da się zapisać przy pomocy <b>mniejszej sumy</b>. To jest dokładnie to, czego potrzebuje rekurencja.'),
], { gap: 18 }));

slide('Trzy pytania dla sumy', cols([
    table(['Pytanie', 'Odpowiedź'], [
        ['Kiedy kończę?', 'gdy n == 0: suma zera liczb to <b>0</b> — wiem to od ręki'],
        ['Jak zmniejszyć problem?', `wywołuję ${c('suma(n - 1)')}`],
        ['Moja część?', 'dodać <b>n</b> do wyniku mniejszej sumy'],
        ['Co zwracam?', `${c('n + suma(n - 1)')}`],
    ], { widths: ['38%', '62%'] }),
    stack([
        code(`
            int suma(int n) {
                if (n == 0) return 0;
                return n + suma(n - 1);
            }`, { size: 'lg' }),
        note('Te same trzy pytania co w części 1 — dochodzi tylko czwarte: <b>co zwracam?</b>'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Budowa linijki z return', anat([
    ['return ', 'pu', '1'], ['n', 'tl', '2'], [' + ', null, null], ['suma(n - 1)', 'or', '3'], [';', null, null],
], [
    ['1', 'pu', 'return', 'oddaj wynik temu, kto mnie wywołał'],
    ['2', 'tl', 'n', 'moja część pracy — liczba, którą dokładam'],
    ['3', 'or', 'suma(n - 1)', 'wynik mniejszego problemu — na niego trzeba poczekać'],
]), note('Kolejność wykonywania: najpierw liczy się <b>suma(n − 1)</b> (cała, ze wszystkimi swoimi wywołaniami), potem dodawanie, a na końcu return.'));

slide('Warunek stopu też coś zwraca', cols([
    stack([
        code(`
            int suma(int n) {
                ⟦if (n == 0) return 0;⟧
                return n + suma(n - 1);
            }`, { size: 'lg' }),
    ]),
    stack([
        P('W funkcji <b>void</b> warunek stopu tylko kończył pracę. W funkcji <b>int</b> musi też <b>oddać wynik</b> — wynik dla najmniejszego przypadku.'),
        steps(['suma zera liczb to <b>0</b>,', 'iloczyn zera liczb (np. 0!) to <b>1</b>,', 'liczba jednocyfrowa ma <b>1</b> cyfrę.'], 'tight'),
        warn('Zły wynik w warunku stopu psuje <b>wszystkie</b> wyniki — bo każdy wynik jest z niego zbudowany.'),
    ]),
], { t: '1fr 1.15fr', align: 'center' }));

// ================================================================ 04
sec('04');
const SUMA_MAIN = `
    int suma(int n) {
        if (n == 0) return 0;
        return n + suma(n - 1);
    }

    int main() {
        cout << suma(4);
    }`;
const sumSlide = (title, hl, info, frames) => slide(title, cols([
    stack([code(SUMA_MAIN, { hl, dim: true }), kv(info)]),
    stos(frames),
], { t: '1.05fr 1fr', align: 'start' }));

sumSlide('W dół: `suma(4)` czeka na `suma(3)`', [3],
    [['n', '4'], ['warunek', `${c('4 == 0')} → ${NO}`], ['liczy', `${c('4 + suma(3)')} — ale ile to suma(3)? <b>Czeka.</b>`]],
    [fr('main()', 'czeka na suma(4)', 'main'), fr('suma(4)', 'zaczyna, n = 4', 'on')]);
sumSlide('W dół: każda kopia czeka', [3],
    [['suma(4)', `liczy ${c('4 + ?')}`], ['suma(3)', `liczy ${c('3 + ?')}`], ['suma(2)', `liczy ${c('2 + ?')}`], ['suma(1)', `liczy ${c('1 + ?')}`]],
    [fr('main()', 'czeka', 'main'), fr('suma(4)', '4 + ?'), fr('suma(3)', '3 + ?'), fr('suma(2)', '2 + ?'), fr('suma(1)', '1 + ?'), fr('suma(0)', 'zaczyna, n = 0', 'on')]);
sumSlide('Dno: `suma(0)` zwraca 0', [2],
    [['warunek', `${c('0 == 0')} → ${YES}`], ['zwraca', '<b>0</b> — od ręki, bez wołania siebie']],
    [fr('main()', 'czeka', 'main'), fr('suma(4)', '4 + ?'), fr('suma(3)', '3 + ?'), fr('suma(2)', '2 + ?'), fr('suma(1)', '1 + ?'), fr('suma(0)', 'return 0', 'ret')]);
sumSlide('W górę: `suma(1)` = 1 + 0 = 1', [3],
    [['dostaje', 'suma(0) = <b>0</b>'], ['liczy', `${c('1 + 0')} = <b>1</b>`], ['zwraca', '<b>1</b> do suma(2)']],
    [fr('main()', 'czeka', 'main'), fr('suma(4)', '4 + ?'), fr('suma(3)', '3 + ?'), fr('suma(2)', '2 + ?'), fr('suma(1)', '1 + 0 = 1 → return 1', 'ret')]);
sumSlide('W górę: `suma(2)` = 2 + 1 = 3', [3],
    [['dostaje', 'suma(1) = <b>1</b>'], ['liczy', `${c('2 + 1')} = <b>3</b>`], ['zwraca', '<b>3</b> do suma(3)']],
    [fr('main()', 'czeka', 'main'), fr('suma(4)', '4 + ?'), fr('suma(3)', '3 + ?'), fr('suma(2)', '2 + 1 = 3 → return 3', 'ret')]);
sumSlide('W górę: `suma(3)` = 3 + 3 = 6', [3],
    [['dostaje', 'suma(2) = <b>3</b>'], ['liczy', `${c('3 + 3')} = <b>6</b>`], ['zwraca', '<b>6</b> do suma(4)']],
    [fr('main()', 'czeka', 'main'), fr('suma(4)', '4 + ?'), fr('suma(3)', '3 + 3 = 6 → return 6', 'ret')]);
sumSlide('W górę: `suma(4)` = 4 + 6 = 10', [3, 7],
    [['dostaje', 'suma(3) = <b>6</b>'], ['liczy', `${c('4 + 6')} = <b>10</b>`], ['zwraca', '<b>10</b> do main, które wypisuje 10']],
    [fr('main()', 'wypisuje 10', 'on')]);

slide('Wartości płyną w górę', cols([
    tree(T('suma(4) = 4 + 6 = 10', [T('suma(3) = 3 + 3 = 6', [T('suma(2) = 2 + 1 = 3', [T('suma(1) = 1 + 0 = 1', [T('suma(0) = 0', [], { s: 'done' })], { s: 'done' })], { s: 'done' })], { s: 'done' })], { s: 'on' }), { dy: 62, vals: false }),
    stack([
        P('Pytania idą <b>w dół</b> (suma(4) pyta suma(3), ta pyta suma(2)…), a <b>odpowiedzi wracają w górę</b> — każda kopia dokłada do odpowiedzi swoje n.'),
        table(['Kopia', 'Dostaje', 'Zwraca'], [[c('suma(0)'), '—', '<b>0</b>'], [c('suma(1)'), '0', '1 + 0 = <b>1</b>'], [c('suma(2)'), '1', '2 + 1 = <b>3</b>'], [c('suma(3)'), '3', '3 + 3 = <b>6</b>'], [c('suma(4)'), '6', '4 + 6 = <b>10</b>']], { cls: 'mid' }),
    ]),
], { t: '0.8fr 1.2fr', align: 'center' }));

// ================================================================ 05
sec('05');
slide('Zaufaj rekurencji', stack([
    big('Pisząc <em>suma(n)</em>, załóż, że <strong>suma(n − 1)</strong> już działa i zwraca dobry wynik.'),
    cols([
        stack([
            P('Nie trzeba w głowie schodzić do zera. Wystarczą dwie rzeczy:'),
            steps(['<b>warunek stopu</b> zwraca dobry wynik dla najmniejszego przypadku,', '<b>krok</b> robi dobry wynik dla n z dobrego wyniku dla n − 1.'], 'tight'),
        ]),
        good('Wtedy działa <b>dla każdego n</b>: suma(0) jest dobra, więc suma(1) jest dobra, więc suma(2) jest dobra, więc suma(3)… — jak domino, w którym każdy klocek przewraca następny.'),
    ], { gap: 30, align: 'center' }),
], { gap: 24 }));

slide('Jak myśleć o funkcji rekurencyjnej?', cols([
    cards([
        card('1 · Co ma zwracać funkcja?', 'Opisz słowami, np. „suma(n) zwraca 1 + 2 + … + n”. To zdanie jest najważniejsze.', 'puc'),
        card('2 · Najmniejszy przypadek', 'Dla jakiego argumentu znam wynik od ręki? Ten wynik zwróć w warunku stopu.', 'orc'),
        card('3 · Załóż, że mniejsze działa', 'Wolno Ci użyć wyniku dla mniejszego argumentu, tak jakby ktoś już go policzył.', 'tlc'),
        card('4 · Zbuduj wynik', 'Jak z wyniku dla mniejszego argumentu zrobić wynik dla n? To jest linijka z return.', 'tlc'),
    ], 2),
], { t: '1fr' }));

// ================================================================ 06
sec('06');
slide('Silnia', cols([
    stack([
        P('Silnia: <b>n! = 1 · 2 · 3 · … · n</b>, a 0! = 1. Na przykład 5! = 120.'),
        table(['n', 'n!', 'z poprzedniej'], [['0', '1', 'z definicji'], ['1', '1', '1 · 0!'], ['2', '2', '2 · 1!'], ['3', '6', '3 · 2!'], ['4', '24', '4 · 3!'], ['5', '120', '5 · 4!']], { cls: 'mid ctr' }),
    ]),
    stack([
        code(`
            long long silnia(int n) {
                if (n == 0) return 1;
                return n * silnia(n - 1);
            }`, { size: 'lg' }),
        note('Ten sam schemat co suma, tylko zamiast <b>+</b> jest <b>·</b>, a warunek stopu zwraca <b>1</b>, a nie 0 (pomnożenie przez 0 wyzerowałoby wszystko!).'),
    ]),
], { t: '0.9fr 1.1fr', align: 'center' }));

slide('Silnia rośnie bardzo szybko', cols([
    table(['n', 'n!', 'mieści się w'], [
        ['10', '3 628 800', 'int'],
        ['12', '479 001 600', 'int (ostatnia!)'],
        ['13', '6 227 020 800', '<b class="no">już nie w int</b>'],
        ['20', '2 432 902 008 176 640 000', 'long long (ostatnia!)'],
        ['21', '≈ 5,1 · 10¹⁹', '<b class="no">nawet long long za mały</b>'],
    ], { widths: ['10%', '55%', '35%'], cls: 'mid' }),
    stack([
        warn(`Dlatego ${c('silnia')} zwraca <b>long long</b>. Z int dla n = 13 dostalibyśmy bzdurę — liczba „przekręciłaby się” jak licznik.`),
        note('Zawsze sprawdzaj w treści zadania, jak duży może być wynik, i dobierz typ funkcji.'),
    ]),
], { t: '1.25fr 1fr', align: 'center' }));

slide('Potęga: aⁿ = a · aⁿ⁻¹', cols([
    stack([
        code(`
            long long potega(long long a, int n) {
                if (n == 0) return 1;
                return a * potega(a, n - 1);
            }`),
        term('32', { cap: 'potega(2, 5)' }),
    ]),
    trace([
        { d: 0, k: 'call', t: 'potega(2, 5) = 2 · potega(2, 4)' },
        { d: 1, k: 'call', t: 'potega(2, 4) = 2 · potega(2, 3)' },
        { d: 2, k: 'call', t: 'potega(2, 3) = 2 · potega(2, 2)' },
        { d: 3, k: 'call', t: 'potega(2, 2) = 2 · potega(2, 1)' },
        { d: 4, k: 'call', t: 'potega(2, 1) = 2 · potega(2, 0)' },
        { d: 5, k: 'stop', t: 'potega(2, 0) = <b>1</b>' },
        { d: 4, k: 'ret', t: '= 2 · 1 = <b>2</b>' }, { d: 3, k: 'ret', t: '= 2 · 2 = <b>4</b>' }, { d: 2, k: 'ret', t: '= <b>8</b>' }, { d: 1, k: 'ret', t: '= <b>16</b>' }, { d: 0, k: 'ret', t: '= <b>32</b>' },
    ], { size: 'sm' }),
], { t: '1.05fr 1fr', align: 'center' }), note('Dwa parametry: <b>a</b> przekazujemy dalej bez zmian, maleje tylko <b>n</b>. (W części 6 policzymy potęgę dużo szybciej — dzieląc n na pół.)'));

slide('Mnożenie bez mnożenia', cols([
    stack([
        P('a · b to <b>a + a + … + a</b> (b razy), czyli <b>a · b = a + a · (b − 1)</b>.'),
        code(`
            long long razy(long long a, int b) {
                if (b == 0) return 0;
                return a + razy(a, b - 1);
            }`),
    ]),
    stack([
        table(['Wywołanie', 'Zwraca'], [[c('razy(7, 0)'), '0'], [c('razy(7, 1)'), '7 + 0 = 7'], [c('razy(7, 2)'), '7 + 7 = 14'], [c('razy(7, 3)'), '7 + 14 = <b>21</b>']], { cls: 'mid' }),
        note('Ten sam wzór co silnia i potęga: <b>wynik(n) = coś ∘ wynik(n − 1)</b>. Rozpoznawaj go w zadaniach!'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 07
sec('07');
slide('Ile cyfr ma liczba?', cols([
    stack([
        code(`
            int ileCyfr(long long n) {
                if (n < 10) return 1;
                return 1 + ileCyfr(n / 10);
            }`),
        P(`Liczba ma <b>o jedną cyfrę więcej</b> niż ta sama liczba bez ostatniej cyfry (${c('n / 10')}). A liczba jednocyfrowa ma 1 cyfrę.`),
    ]),
    table(['Wywołanie', 'Zwraca'], [
        [c('ileCyfr(4821)'), '1 + ileCyfr(482) = 1 + 3 = <b>4</b>'],
        [c('ileCyfr(482)'), '1 + ileCyfr(48) = 1 + 2 = <b>3</b>'],
        [c('ileCyfr(48)'), '1 + ileCyfr(4) = 1 + 1 = <b>2</b>'],
        [c('ileCyfr(4)'), '4 < 10 → <b>1</b>'],
    ], { widths: ['35%', '65%'], cls: 'mid' }),
], { t: '1fr 1.15fr', align: 'center' }), warn(`Warunek ${c('n < 10')}, a nie ${c('n == 0')}! Z ${c('n == 0 → 0')} liczba 0 miałaby zero cyfr, a ma jedną.`));

slide('Suma cyfr', cols([
    stack([
        code(`
            int sumaCyfr(long long n) {
                if (n == 0) return 0;
                return n % 10 + sumaCyfr(n / 10);
            }`),
        term('15', { cap: 'sumaCyfr(4821)' }),
    ]),
    trace([
        { d: 0, k: 'call', t: '4821 → 1 + sumaCyfr(482)' }, { d: 1, k: 'call', t: '482 → 2 + sumaCyfr(48)' },
        { d: 2, k: 'call', t: '48 → 8 + sumaCyfr(4)' }, { d: 3, k: 'call', t: '4 → 4 + sumaCyfr(0)' }, { d: 4, k: 'stop', t: 'sumaCyfr(0) = <b>0</b>' },
        { d: 3, k: 'ret', t: '4 + 0 = <b>4</b>' }, { d: 2, k: 'ret', t: '8 + 4 = <b>12</b>' }, { d: 1, k: 'ret', t: '2 + 12 = <b>14</b>' }, { d: 0, k: 'ret', t: '1 + 14 = <b>15</b>' },
    ], { size: 'sm' }),
], { t: '1.05fr 1fr', align: 'center' }));

slide('Ile razy występuje cyfra d?', cols([
    stack([
        code(`
            int ile(long long n, int d) {
                if (n < 10) return n == d;
                return (n % 10 == d) + ile(n / 10, d);
            }`, { size: 'sm' }),
        note(`W C++ porównanie ${c('n % 10 == d')} daje <b>1</b>, gdy jest prawdziwe, i <b>0</b>, gdy fałszywe. Można je dodawać jak liczby!`),
    ]),
    table(['Wywołanie', 'ostatnia cyfra = 0?', 'Zwraca'], [
        [c('ile(1010, 0)'), '0 → <b>1</b>', '1 + 1 = <b>2</b>'],
        [c('ile(101, 0)'), '1 → <b>0</b>', '0 + 1 = 1'],
        [c('ile(10, 0)'), '0 → <b>1</b>', '1 + 0 = 1'],
        [c('ile(1, 0)'), 'jednocyfrowa: 1 == 0?', '<b>0</b>'],
    ], { widths: ['30%', '38%', '32%'], cls: 'mid' }),
], { t: '1.05fr 1fr', align: 'center' }));

slide('Funkcja rekurencyjna woła inną rekurencyjną', cols([
    code(`
        int sumaCyfr(long long n) {
            if (n == 0) return 0;
            return n % 10 + sumaCyfr(n / 10);
        }

        int pierwiastek(long long n) {
            if (n < 10) return n;
            return pierwiastek(sumaCyfr(n));
        }`, { size: 'sm', hl: [8] }),
    stack([
        P('<b>Pierwiastek cyfrowy</b>: sumuj cyfry, aż zostanie jedna cyfra. 9875 → 29 → 11 → <b>2</b>.'),
        trace([{ d: 0, k: 'call', t: 'pierwiastek(9875) → sumaCyfr = 29' }, { d: 1, k: 'call', t: 'pierwiastek(29) → sumaCyfr = 11' }, { d: 2, k: 'call', t: 'pierwiastek(11) → sumaCyfr = 2' }, { d: 3, k: 'stop', t: 'pierwiastek(2): 2 < 10 → <b>2</b>' }], { size: 'sm' }),
        note('Problem nie musi maleć o 1. Wystarczy, że <b>na pewno</b> dojdziemy do warunku stopu — suma cyfr jest mniejsza od liczby (dla n ≥ 10).'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

// ================================================================ 08
sec('08');
const A5 = [3, -1, 4, 1, 5];
slide('Indeks jako parametr', cols([
    stack([
        P('Na tablicy też można robić rekurencję. Parametrem jest <b>indeks</b>: funkcja zajmuje się kawałkiem tablicy <b>od indeksu i do końca</b>.'),
        arr(A5, { name: 'a', hi: [2, 3, 4], spans: [[2, 3, 'suma(2) = 4 + 1 + 5', '']] }),
        P(`${c('suma(i)')} = suma elementów od a[i] do końca. Wtedy <b>suma(i) = a[i] + suma(i + 1)</b>.`),
    ]),
    stack([
        code(`
            int n;
            int a[1000];

            long long suma(int i) {
                if (i == n) return 0;
                return a[i] + suma(i + 1);
            }`),
        note(`Z main wołamy ${c('suma(0)')} — kawałek od indeksu 0 to cała tablica. Warunek stopu: od indeksu n nie ma już żadnych elementów.`),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Suma tablicy krok po kroku', cols([
    stack([
        arr(A5, { name: 'a' }),
        trace([
            { d: 0, k: 'call', t: 'suma(0) = 3 + suma(1)' }, { d: 1, k: 'call', t: 'suma(1) = −1 + suma(2)' }, { d: 2, k: 'call', t: 'suma(2) = 4 + suma(3)' },
            { d: 3, k: 'call', t: 'suma(3) = 1 + suma(4)' }, { d: 4, k: 'call', t: 'suma(4) = 5 + suma(5)' }, { d: 5, k: 'stop', t: 'suma(5) = <b>0</b> (i == n)' },
        ], { size: 'sm' }),
    ]),
    trace([
        { d: 4, k: 'ret', t: 'suma(4) = 5 + 0 = <b>5</b>' }, { d: 3, k: 'ret', t: 'suma(3) = 1 + 5 = <b>6</b>' }, { d: 2, k: 'ret', t: 'suma(2) = 4 + 6 = <b>10</b>' },
        { d: 1, k: 'ret', t: 'suma(1) = −1 + 10 = <b>9</b>' }, { d: 0, k: 'ret', t: 'suma(0) = 3 + 9 = <b>12</b>' },
    ], { cap: 'droga w górę' }),
], { t: '1.05fr 1fr', align: 'center' }));

slide('Największy element', cols([
    stack([
        code(`
            int maks(int i) {
                if (i == n - 1) return a[i];
                return max(a[i], maks(i + 1));
            }`),
        P(`Największy z kawałka od i = <b>większy z dwóch</b>: a[i] i największy z reszty. Warunek stopu: kawałek z <b>jednym</b> elementem — on jest największy.`),
    ]),
    stack([
        arr(A5, { name: 'a', hi: [4] }),
        table(['Wywołanie', 'Zwraca'], [[c('maks(4)'), 'jeden element → <b>5</b>'], [c('maks(3)'), 'max(1, 5) = <b>5</b>'], [c('maks(2)'), 'max(4, 5) = <b>5</b>'], [c('maks(1)'), 'max(−1, 5) = <b>5</b>'], [c('maks(0)'), 'max(3, 5) = <b>5</b>']], { cls: 'mid' }),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

slide('Liczenie elementów spełniających warunek', cols([
    code(`
        int ileParzystych(int i) {
            if (i == n) return 0;
            if (a[i] % 2 == 0)
                return 1 + ileParzystych(i + 1);
            return ileParzystych(i + 1);
        }`),
    stack([
        arr([3, -4, 0, 7, 8], { name: 'a', hi: [1, 2, 4] }),
        P('Jeśli a[i] pasuje — dokładamy <b>1</b> do wyniku z reszty tablicy. Jeśli nie — wynik to po prostu wynik z reszty.'),
        term('3', { cap: 'ileParzystych(0)' }),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Funkcja zwracająca prawdę albo fałsz', cols([
    stack([
        code(`
            bool posortowana(int i) {
                if (i >= n - 1) return true;
                if (a[i] > a[i + 1]) return false;
                return posortowana(i + 1);
            }`, { size: 'sm' }),
        note('Funkcja rekurencyjna może zwracać <b>bool</b>. Gdy znajdzie zły układ, od razu zwraca <b>false</b> — dalszych wywołań już nie ma.'),
    ]),
    stack([
        arr([1, 3, 2, 4], { name: 'a', sel: [1, 2] }),
        trace([{ d: 0, k: 'call', t: 'i = 0: 1 ≤ 3, sprawdzam dalej' }, { d: 1, k: 'stop', t: 'i = 1: 3 > 2 → <b>false</b>' }, { d: 0, k: 'ret', t: 'posortowana(0) zwraca <b>false</b>' }], { size: 'sm' }),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

// ================================================================ 09
sec('09');
const pal = (w, l, r, extra = {}) => arr(w.split(''), { name: 's', ptr: Object.assign({}, l === r ? { [l]: 'l=r' } : { [l]: 'l', [r]: 'r' }), hi: l <= r ? [l, r] : [], ...extra });
slide('Palindrom — dwa indeksy', cols([
    stack([
        P('Słowo jest palindromem, gdy czytane od tyłu brzmi tak samo: <b>kajak</b>, <b>radar</b>. Sprawdzamy <b>skrajne litery</b> i idziemy do środka.'),
        code(`
            bool palindrom(const string &s, int l, int r) {
                if (l >= r) return true;
                if (s[l] != s[r]) return false;
                return palindrom(s, l + 1, r - 1);
            }`, { size: 'sm' }),
    ]),
    stack([
        pal('kajak', 0, 4),
        note('Parametry <b>l</b> i <b>r</b> wyznaczają kawałek słowa, który jeszcze trzeba sprawdzić. Każde wywołanie zwęża go z obu stron.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Palindrom: `kajak`', stack([
    cols([pal('kajak', 0, 4, { size: 'sm' }), pal('kajak', 1, 3, { size: 'sm' }), pal('kajak', 2, 2, { size: 'sm' })], { gap: 20 }),
    table(['Wywołanie', 'Porównanie', 'Wynik'], [[c('palindrom(s, 0, 4)'), 'k == k', 'sprawdzam środek'], [c('palindrom(s, 1, 3)'), 'a == a', 'sprawdzam środek'], [c('palindrom(s, 2, 2)'), 'l ≥ r — została jedna litera', `${YES} → true`]], { cls: 'mid' }),
    note('Wynik <b>true</b> wraca w górę przez wszystkie kopie bez zmian — każda zwraca to, co dostała.'),
], { gap: 16 }));

slide('Palindrom: `kotek`', stack([
    cols([pal('kotek', 0, 4), pal('kotek', 1, 3, { hi: [], sel: [1, 3] })], { gap: 30 }),
    table(['Wywołanie', 'Porównanie', 'Wynik'], [[c('palindrom(s, 0, 4)'), 'k == k', 'sprawdzam środek'], [c('palindrom(s, 1, 3)'), 'o ≠ e', `${NO} → false`]], { cls: 'mid' }),
    note('Przy pierwszej różnicy funkcja od razu zwraca <b>false</b> — środka „t” nikt już nie ogląda.'),
], { gap: 16 }));

slide('Odwracanie fragmentu tablicy (swap)', cols([
    stack([
        code(`
            void odwroc(int l, int r) {
                if (l >= r) return;
                swap(a[l], a[r]);
                odwroc(l + 1, r - 1);
            }`),
        note('Funkcja <b>void</b>, ale coś zmienia: tablicę globalną. Po powrocie z <b>odwroc(1, 5)</b> fragment jest odwrócony.'),
    ]),
    stack([
        arr([1, 2, 3, 4, 5, 6, 7], { name: 'start', sel: [1, 5], size: 'sm' }),
        arr([1, 6, 3, 4, 5, 2, 7], { name: 'swap 1', hi: [1, 5], sel: [2, 4], size: 'sm' }),
        arr([1, 6, 5, 4, 3, 2, 7], { name: 'swap 2', hi: [2, 4], size: 'sm' }),
        P('odwroc(3, 3): l ≥ r — środek zostaje, koniec.', 'muted'),
    ]),
], { t: '1fr 1.05fr', align: 'center' }));

// ================================================================ 10
sec('10');
slide('Dwa sposoby liczenia sumy', cols([
    stack([
        code(`
            int suma(int n) {
                if (n == 0) return 0;
                return n + suma(n - 1);
            }`, { cap: 'sposób 1 — zwracamy wynik' }),
        note('Wynik <b>buduje się w drodze w górę</b>: każda kopia dodaje swoje n do tego, co dostała.'),
    ]),
    stack([
        code(`
            void suma(int n, int wynik) {
                if (n == 0) {
                    cout << wynik;
                    return;
                }
                suma(n - 1, wynik + n);
            }`, { cap: 'sposób 2 — wynik w parametrze' }),
        note(`Wynik <b>buduje się w drodze w dół</b> — w parametrze (akumulatorze). Start: ${c('suma(5, 0)')}.`),
    ]),
], { gap: 30, align: 'start' }));

slide('Akumulator krok po kroku', cols([
    trace([
        { d: 0, k: 'call', t: 'suma(5, 0) → suma(4, 0 + 5)' }, { d: 1, k: 'call', t: 'suma(4, 5) → suma(3, 5 + 4)' }, { d: 2, k: 'call', t: 'suma(3, 9) → suma(2, 9 + 3)' },
        { d: 3, k: 'call', t: 'suma(2, 12) → suma(1, 12 + 2)' }, { d: 4, k: 'call', t: 'suma(1, 14) → suma(0, 14 + 1)' }, { d: 5, k: 'stop', t: 'suma(0, 15): wypisuje <b>15</b>' },
    ]),
    stack([
        P('Parametr <b>wynik</b> to „dotychczas uzbierana suma”. Każde wywołanie przekazuje dalej <b>większą</b> sumę, a warunek stopu ma już gotowy wynik.'),
        note('Oba sposoby są dobre. W zadaniach z kolejnych części (generowanie, backtracking) parametry-akumulatory będą bardzo częste.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Liczba od tyłu z akumulatorem', cols([
    stack([
        code(`
            long long odwroc(long long n, long long w) {
                if (n == 0) return w;
                return odwroc(n / 10, w * 10 + n % 10);
            }`, { size: 'sm' }),
        P(`W każdym kroku przenosimy <b>ostatnią cyfrę</b> n na <b>koniec</b> w. Start: ${c('odwroc(4821, 0)')}.`),
    ]),
    table(['n', 'w', 'następne wywołanie'], [
        ['4821', '0', 'odwroc(482, 0·10 + 1)'], ['482', '1', 'odwroc(48, 1·10 + 2)'], ['48', '12', 'odwroc(4, 12·10 + 8)'], ['4', '128', 'odwroc(0, 128·10 + 4)'], ['0', '<b>1284</b>', 'stop: zwraca 1284'],
    ], { widths: ['18%', '20%', '62%'], cls: 'mid' }),
], { t: '1fr 1.1fr', align: 'center' }));

// ================================================================ 11
sec('11');
slide('NWD — algorytm Euklidesa', cols([
    stack([
        P('NWD(a, b) — największa liczba dzieląca i a, i b. Starożytny pomysł Euklidesa: <b>NWD(a, b) = NWD(b, a % b)</b>, a <b>NWD(a, 0) = a</b>.'),
        code(`
            long long nwd(long long a, long long b) {
                if (b == 0) return a;
                return nwd(b, a % b);
            }`, { size: 'sm' }),
    ]),
    table(['a', 'b', 'a % b', 'wywołanie'], [
        ['48', '18', '12', 'nwd(18, 12)'], ['18', '12', '6', 'nwd(12, 6)'], ['12', '6', '0', 'nwd(6, 0)'], ['6', '0', '—', 'stop: <b>6</b>'],
    ], { cls: 'mid ctr' }),
], { t: '1.15fr 1fr', align: 'center' }), note('Krok nie jest „n − 1”: liczby maleją dużo szybciej. Nawet dla liczb rzędu 10¹⁸ wystarczy niecałe 100 wywołań.'));

slide('Krok w dół nie musi być o 1', cols([
    stack([
        code(`
            int kroki(long long n) {
                if (n == 1) return 0;
                if (n % 2 == 0) return 1 + kroki(n / 2);
                return 1 + kroki(3 * n + 1);
            }`, { size: 'sm' }),
        P('<b>Problem Collatza</b>: parzystą liczbę dziel na 2, nieparzystą zamień na 3n + 1. Ile kroków do 1?'),
    ]),
    stack([
        trace([{ d: 0, k: 'call', t: '6 → 3' }, { d: 1, k: 'call', t: '3 → 10' }, { d: 2, k: 'call', t: '10 → 5' }, { d: 3, k: 'call', t: '5 → 16' }, { d: 4, k: 'call', t: '16 → 8 → 4 → 2 → 1' }, { d: 5, k: 'stop', t: 'kroki(1) = 0' }], { size: 'sm' }),
        note('Kroki(6) = <b>8</b>. Funkcja ma <b>dwa</b> różne wywołania rekurencyjne, ale za każdym razem wykonuje się tylko <b>jedno</b> z nich.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Czy to potęga dwójki?', cols([
    code(`
        bool potegaDwojki(long long n) {
            if (n == 1) return true;
            if (n % 2 == 1) return false;
            return potegaDwojki(n / 2);
        }`),
    stack([
        table(['n', 'co się dzieje'], [['64', '64 → 32 → 16 → 8 → 4 → 2 → 1 → <b>true</b>'], ['12', '12 → 6 → 3: nieparzyste ≠ 1 → <b>false</b>'], ['1', 'od razu <b>true</b> (1 = 2⁰)']], { widths: ['15%', '85%'], cls: 'mid' }),
        note('Dwa warunki stopu: jeden zwraca <b>true</b>, drugi <b>false</b>. Funkcja może mieć ich tyle, ile potrzeba.'),
    ]),
], { t: '1fr 1.15fr', align: 'center' }));

// ================================================================ 12
sec('12');
slide('Pułapki (1/2)', traps([
    `<b>Brak return przed wywołaniem.</b> ${c('n + suma(n - 1);')} bez słowa return liczy wynik i… wyrzuca go. Funkcja int bez return zwraca śmieci. Kompilator zwykle ostrzega — czytaj ostrzeżenia!`,
    `<b>Wywołanie, którego wynik się marnuje.</b> ${c('suma(n - 1); return n;')} — wywołanie się wykona, ale jego wynik nigdzie nie trafia. Wynik trzeba <b>użyć</b> w wyrażeniu.`,
    `<b>Zły wynik w warunku stopu.</b> Silnia z ${c('if (n == 0) return 0;')} zwraca zawsze 0 — bo każdy wynik to iloczyn z tym zerem.`,
]));

slide('Pułapki (2/2)', traps([
    `<b>Za mały typ.</b> Suma, silnia, potęga szybko przekraczają int (ok. 2 · 10⁹). Gdy wynik może być duży — <b>long long</b> i w funkcji, i w parametrach.`,
    `<b>To samo wywołanie dwa razy.</b> ${c('if (maks(i + 1) > a[i]) return maks(i + 1);')} liczy maks(i + 1) dwa razy, a każde z nich znowu dwa razy… Dla 30 elementów to już ponad miliard wywołań! Zapisz wynik w zmiennej: ${c('int m = maks(i + 1);')}.`,
    `<b>Warunek stopu tylko dla „ładnych” danych.</b> Sprawdź najmniejsze przypadki: n = 0, n = 1, tablica z jednym elementem, słowo z jednej litery.`,
]));

// ================================================================ 13
sec('13');
const quiz = (n, title, src, extra = '') => slide(`Pytanie ${n}: ${title}`, cols([
    code(src, { size: 'lg' }),
    stack([term('?'), extra ? P(extra, 'muted') : '', P('Zastanów się i zapisz odpowiedź, <b>zanim</b> przejdziesz dalej.', 'muted')]),
], { t: '1.4fr 1fr', align: 'center' }));

quiz(1, 'ile wynosi `f(5)`?', `
    int f(int n) {
        if (n == 0) return 0;
        return 2 + f(n - 1);
    }`);
slide('Odpowiedź 1: `10`', cols([
    trace([{ d: 0, k: 'call', t: 'f(5) = 2 + f(4)' }, { d: 1, k: 'call', t: 'f(4) = 2 + f(3)' }, { d: 2, k: 'call', t: '…' }, { d: 3, k: 'stop', t: 'f(0) = 0' }, { d: 0, k: 'ret', t: 'f(5) = 2 + 2 + 2 + 2 + 2 + 0 = <b>10</b>' }]),
    note('Każda z pięciu kopii dokłada 2. Funkcja liczy po prostu <b>2 · n</b>.'),
], { align: 'center' }));

quiz(2, 'ile wynosi `g(4821)`?', `
    int g(int n) {
        if (n < 10) return n;
        return g(n / 10);
    }`);
slide('Odpowiedź 2: `4` — pierwsza cyfra', cols([
    trace([{ d: 0, k: 'call', t: 'g(4821) = g(482)' }, { d: 1, k: 'call', t: 'g(482) = g(48)' }, { d: 2, k: 'call', t: 'g(48) = g(4)' }, { d: 3, k: 'stop', t: 'g(4) = <b>4</b>' }]),
    note('Funkcja odcina ostatnie cyfry, aż zostanie jedna — <b>pierwsza</b> cyfra liczby. Wynik przechodzi w górę bez zmian.'),
], { align: 'center' }));

quiz(3, 'ile wynosi `h(84, 36)`?', `
    long long h(long long a, long long b) {
        if (b == 0) return a;
        return h(b, a % b);
    }`);
slide('Odpowiedź 3: `12`', cols([
    table(['a', 'b', 'a % b'], [['84', '36', '12'], ['36', '12', '0'], ['12', '0', 'stop → <b>12</b>']], { cls: 'ctr' }),
    note('To algorytm Euklidesa: NWD(84, 36) = <b>12</b>. Rzeczywiście 84 = 7 · 12 i 36 = 3 · 12.'),
], { align: 'center' }));

quiz(4, 'znajdź błąd', `
    int suma(int n) {
        if (n == 0) return 0;
        suma(n - 1) + n;
    }`, 'Funkcja miała liczyć 1 + 2 + … + n.');
slide('Odpowiedź 4: brakuje return', cols([
    code(`
        int suma(int n) {
            if (n == 0) return 0;
            ⟦return⟧ suma(n - 1) + n;
        }`, { size: 'lg', good: true, cap: 'poprawnie' }),
    stack([
        warn('Bez <b>return</b> wynik dodawania nigdzie nie trafia, a funkcja int kończy się, nie oddając wyniku. To <b>błąd</b> — program może wypisać cokolwiek.'),
        note(`Kompilator ostrzega: <i>control reaches end of non-void function</i>. Warto kompilować z ${c('-Wall')}, żeby takie ostrzeżenia widzieć.`),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

quiz(5, 'ile wynosi `f(5)`?', `
    int f(int n) {
        if (n <= 1) return 1;
        return f(n - 1) + f(n - 2);
    }`, 'Uwaga: dwa wywołania w jednej linijce.');
slide('Odpowiedź 5: `8`', cols([
    table(['n', 'f(n)'], [['0', '1'], ['1', '1'], ['2', 'f(1) + f(0) = 2'], ['3', 'f(2) + f(1) = 3'], ['4', 'f(3) + f(2) = 5'], ['5', 'f(4) + f(3) = <b>8</b>']], { cls: 'mid ctr' }),
    good('Najłatwiej liczyć <b>od dołu</b>: znając f(0) i f(1), po kolei dostajemy f(2), f(3)… To ciąg prawie jak Fibonacci — funkcjom wołającym siebie <b>dwa razy</b> poświęcona jest część 3.'),
], { t: '1fr 1.2fr', align: 'center' }));

// ================================================================ 14
sec('14');
slide('Ściąga: rekurencja z wynikiem', table(['Wzór', 'Przykład', 'Warunek stopu'], [
    [c('return n + f(n - 1);'), 'suma 1 + … + n', c('f(0) = 0')],
    [c('return n * f(n - 1);'), 'silnia', c('f(0) = 1')],
    [c('return a * f(a, n - 1);'), 'potęga aⁿ', c('f(a, 0) = 1')],
    [c('return n % 10 + f(n / 10);'), 'suma cyfr', c('f(0) = 0')],
    [c('return a[i] + f(i + 1);'), 'suma tablicy', c('f(n) = 0')],
    [c('return max(a[i], f(i + 1));'), 'maksimum tablicy', c('f(n - 1) = a[n - 1]')],
    [c('return f(s, l + 1, r - 1);'), 'palindrom', c('l >= r → true')],
    [c('return f(n / 10, w * 10 + n % 10);'), 'akumulator', c('f(0, w) = w')],
    [c('return f(b, a % b);'), 'NWD', c('f(a, 0) = a')],
], { widths: ['44%', '26%', '30%'], cls: 'mid' }));

slide('Zadania na koniec — Twoja kolej', stack([
    P('Zadania są na <b>t-olimpians.com → Kompendium → Funkcje rekurencyjne → Krok 2</b>. Każde ma sprawdzarkę i wskazówkę:'),
    `<div class="cols" style="grid-template-columns:1fr 1fr;gap:20px">${[
        steps(['Suma od 1 do n', 'Silnia', 'Potęga', 'Ile cyfr?', 'Suma cyfr', 'Ile razy występuje cyfra?', 'Pierwiastek cyfrowy', 'Liczba od tyłu', 'Suma tablicy'], 'tight'),
        `<ol class="steps tight" style="counter-reset:s 9">${['Największy element', 'Ile liczb parzystych?', 'Czy tablica jest posortowana?', 'Palindrom', 'Odwróć fragment tablicy', 'Największy wspólny dzielnik', 'Mnożenie bez mnożenia', 'Problem Collatza', 'Czy to potęga dwójki?'].map((x) => `<li>${x}</li>`).join('')}</ol>`,
    ].join('')}</div>`,
], { gap: 14 }));

D.build({
    html: 'pdf-src/prezentacja-rekurencja-2-zwracanie-wyniku.html',
    pdf: 'prezentacja-rekurencja-2-zwracanie-wyniku-t-olimpians.pdf',
    generator: 'pdf-src/build-prezentacja-rekurencja-2.js',
    title: 'Rekurencja, która zwraca wynik — T-Olimpians',
    brand: 'rekurencja · część 2',
    foot: 'Rekurencja, część 2 — rekurencja, która zwraca wynik',
    secs: SECS,
    cover: {
        kicker: '// T-OLIMPIANS — PREZENTACJA DO LEKCJI',
        h1: 'Rekurencja,<br>która zwraca wynik',
        sub: 'Funkcje rekurencyjne z return: suma, silnia, potęga, cyfry liczby, tablice, palindromy, akumulator i NWD. Zobaczysz, jak pytania schodzą w dół stosu, a wyniki wracają w górę — kopia po kopii.',
        meta: 'C++ · REKURENCJA · CZĘŚĆ 2 Z 6 · PO CZĘŚCI 1',
        deco: trace([{ d: 0, k: 'call', t: 'suma(3) = 3 + suma(2)' }, { d: 1, k: 'call', t: 'suma(2) = 2 + suma(1)' }, { d: 2, k: 'ret', t: 'suma(1) = <b>1</b>' }, { d: 1, k: 'ret', t: '= <b>3</b>' }, { d: 0, k: 'ret', t: '= <b>6</b>' }], { size: 'sm' }),
    },
    end: {
        kicker: '// KONIEC CZĘŚCI 2',
        h1: 'Umiesz już liczyć<br>rekurencją!',
        sub: 'Warunek stopu zwraca wynik dla najmniejszego przypadku, a krok buduje wynik z wyniku mniejszego problemu. Zrób zadania z kroku 2, a potem część 3: funkcje, które wołają siebie wiele razy.',
        deco: arr([3, -1, 4, 1, 5], { name: 'a', hi: [0, 1, 2, 3, 4], spans: [[0, 5, 'suma(0) = 12', '']], size: 'sm' }),
    },
});
