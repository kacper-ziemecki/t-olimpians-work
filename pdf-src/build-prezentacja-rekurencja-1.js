#!/usr/bin/env node
/*
 * Prezentacja „Rekurencja — część 1: pierwsze kroki” (T-Olimpians, kurs rekurencji, krok 1 z 6).
 *
 * Generuje pdf-src/prezentacja-rekurencja-1-pierwsze-kroki.html — poziome slajdy 16:9 w stylu poprzednich
 * prezentacji — i (z flagą --pdf) drukuje je do prezentacja-rekurencja-1-pierwsze-kroki-t-olimpians.pdf.
 * Uczeń zna funkcje, ale jeszcze nigdy nie napisał rekurencji: wszystko powoli, każde wywołanie osobno.
 *
 *     node pdf-src/build-prezentacja-rekurencja-1.js --pdf
 */
const L = require('./prezentacja_lib');
const { code, c, P, stack, cols, center, note, warn, good, big, steps, traps, table, card, cards, kv, term, stos, trace, arr } = L;
const D = L.deck();
const { sec, slide } = D;

const SECS = [
    ['01', 'Przypomnienie: funkcje'],
    ['02', 'Funkcja woła funkcję'],
    ['03', 'Funkcja woła samą siebie'],
    ['04', 'Warunek stopu'],
    ['05', 'Śledzimy krok po kroku'],
    ['06', 'Stos wywołań'],
    ['07', 'Kod przed i po wywołaniu'],
    ['08', 'Jak pisać rekurencję?'],
    ['09', 'Więcej przykładów'],
    ['10', 'Typowe błędy'],
    ['11', 'Sprawdź się'],
    ['12', 'Podsumowanie'],
];

const YES = '<b class="yes">TAK</b>';
const NO = '<b class="no">NIE</b>';
const fr = (f, d, s = 'wait') => ({ f, d, s });

// ================================================================ 01
sec('01');
slide('Funkcja — krótkie przypomnienie', cols([
    stack([
        P('Funkcja to <b>kawałek programu z nazwą</b>. Piszemy go raz, a potem możemy go uruchamiać — <b>wywoływać</b> — ile razy chcemy.'),
        code(`
            void powitaj() {
                cout << "Czesc!" << endl;
            }

            int main() {
                powitaj();
                powitaj();
            }`, { cap: 'definicja i dwa wywołania' }),
    ]),
    stack([
        term('Czesc!\nCzesc!'),
        steps(['Linijki 1–3 to <b>definicja</b> — przepis. Sama definicja niczego nie robi.',
            'Linijki 6 i 7 to <b>wywołania</b> — dopiero one uruchamiają przepis.',
            'Dwa wywołania → napis pojawia się <b>dwa razy</b>.'], 'tight'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Funkcja z parametrem', cols([
    stack([
        P('Funkcja może dostać <b>parametr</b> — wartość, którą podajemy przy wywołaniu w nawiasie.'),
        code(`
            void powitaj(string imie) {
                cout << "Czesc, " << imie << "!" << endl;
            }

            int main() {
                powitaj("Ola");
                powitaj("Bartek");
            }`),
        term('Czesc, Ola!\nCzesc, Bartek!'),
    ]),
    stack([
        table(['Wywołanie', 'Wartość imie'], [[c('powitaj("Ola")'), '<b>"Ola"</b>'], [c('powitaj("Bartek")'), '<b>"Bartek"</b>']], { widths: ['55%', '45%'] }),
        note('Każde wywołanie dostaje <b>własną</b> zmienną <b>imie</b> z własną wartością. Za chwilę to będzie bardzo ważne — zapamiętaj to zdanie.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Co dokładnie dzieje się przy wywołaniu?', stack([
    steps(['Program dochodzi do linijki z wywołaniem i <b>zatrzymuje się</b> w tym miejscu — zapamiętuje, gdzie skończył.',
        'Przechodzi do funkcji. Parametr dostaje wartość podaną w nawiasie.',
        'Wykonuje kolejne linijki funkcji — aż do jej końca albo do <b>return</b>.',
        'Wraca <b>dokładnie w to miejsce</b>, w którym się zatrzymał, i idzie dalej od następnej linijki.'], 'big'),
    good('Te cztery kroki działają zawsze — dla każdej funkcji, także dla funkcji rekurencyjnych. Cała rekurencja to tylko <b>wiele razy powtórzone te same cztery kroki</b>.'),
], { gap: 20 }));

slide('Śledzimy: w jakiej kolejności wykonują się linijki?', cols([
    stack([
        code(`
            void f() {
                cout << "B";
            }

            int main() {
                cout << "A";
                f();
                cout << "C";
            }`, { size: 'lg' }),
        term('ABC'),
    ]),
    table(['Krok', 'Linijka', 'Co się dzieje'], [
        ['1', '6', 'wypisujemy <b>A</b>'],
        ['2', '7', 'wywołanie: <b>main zatrzymuje się</b> i skacze do f'],
        ['3', '2', 'wypisujemy <b>B</b>'],
        ['4', '3', 'koniec f → <b>powrót</b> do main, za linijkę 7'],
        ['5', '8', 'wypisujemy <b>C</b>'],
    ], { widths: ['14%', '18%', '68%'] }),
], { t: '1fr 1.25fr', align: 'center' }));

slide('Funkcja, która zwraca wynik', cols([
    stack([
        code(`
            int kwadrat(int x) {
                return x * x;
            }

            int main() {
                int a = kwadrat(5);
                cout << a + kwadrat(3);
            }`),
        term('34'),
    ]),
    stack([
        P('Funkcja typu <b>int</b> oddaje wynik przez <b>return</b>. Wywołanie <b>zamienia się</b> w zwróconą liczbę:'),
        steps([`${c('kwadrat(5)')} zwraca <b>25</b>, więc ${c('a = 25')}.`,
            `${c('kwadrat(3)')} zwraca <b>9</b>.`,
            `Na ekran trafia ${c('25 + 9')} = <b>34</b>.`], 'tight'),
        note('W tej części będziemy pisać głównie funkcje <b>void</b>, które coś wypisują. Funkcjami zwracającymi wynik zajmie się część 2.'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

// ================================================================ 02
sec('02');
const ABC = `
    void c() {
        cout << "C ";
    }
    void b() {
        cout << "B ";
        c();
        cout << "b ";
    }
    void a() {
        cout << "A ";
        b();
        cout << "a ";
    }
    int main() {
        a();
    }`;
slide('Funkcja może wywołać inną funkcję', cols([
    code(ABC, { size: 'sm' }),
    stack([
        P('Funkcja <b>a</b> woła <b>b</b>, a <b>b</b> woła <b>c</b>. Co pojawi się na ekranie?'),
        P('Zastosuj cztery kroki z poprzedniej części: przy każdym wywołaniu funkcja <b>zatrzymuje się</b> i czeka, aż wywołana funkcja skończy.', 'muted'),
        term('A B C b a'),
        note('Małe litery <b>b</b> i <b>a</b> pojawiają się na końcu — bo b i a mogą dokończyć swoją pracę dopiero <b>po powrocie</b> z funkcji, którą wywołały.'),
    ]),
], { t: '0.9fr 1.1fr', align: 'center' }));

slide('Śledzimy: kto na kogo czeka?', cols([
    trace([
        { d: 0, k: 'call', t: `main woła ${c('a()')}` },
        { d: 1, k: 'out', t: 'a wypisuje <b>A</b>' },
        { d: 1, k: 'call', t: `a woła ${c('b()')} — a czeka` },
        { d: 2, k: 'out', t: 'b wypisuje <b>B</b>' },
        { d: 2, k: 'call', t: `b woła ${c('c()')} — b czeka` },
        { d: 3, k: 'out', t: 'c wypisuje <b>C</b>' },
        { d: 3, k: 'ret', t: 'c kończy → wracamy do b' },
        { d: 2, k: 'out', t: 'b dokańcza: wypisuje <b>b</b>' },
        { d: 2, k: 'ret', t: 'b kończy → wracamy do a' },
        { d: 1, k: 'out', t: 'a dokańcza: wypisuje <b>a</b>' },
        { d: 1, k: 'ret', t: 'a kończy → wracamy do main' },
    ], { cap: 'przebieg programu' }),
    stack([
        P('Wcięcie pokazuje, <b>jak głęboko</b> jesteśmy: im dalej w prawo, tym więcej funkcji czeka na swoją kolej.'),
        steps(['<b style="color:var(--tl)">↓</b> — wywołanie, schodzimy głębiej.', '<b>▸</b> — funkcja coś wypisuje.', '<b style="color:var(--or)">↑</b> — funkcja się kończy, wracamy wyżej.'], 'tight'),
        note('Funkcje kończą się w <b>odwrotnej kolejności</b>, niż się zaczynały: zaczęły a, b, c — skończyły c, b, a.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Zasada powrotu', stack([
    big('Gdy funkcja się kończy, wracamy <em>tam, skąd ją wywołano</em> — i stamtąd idziemy dalej.'),
    cards([
        card('Funkcja nie zapomina', 'Funkcja, która kogoś wywołała, <b>czeka</b>. Pamięta, w której linijce skończyła, i jakie miała wartości zmiennych.', 'tlc'),
        card('Ostatnia zaczęta — pierwsza skończona', 'Najpierw kończy się funkcja wywołana <b>najpóźniej</b>. Dopiero potem ta, która na nią czekała.', 'puc'),
    ], 2),
], { gap: 26 }));

slide('Stos wywołań — pierwsze spojrzenie', cols([
    stos([fr('main()', 'czeka, aż skończy się a()', 'main'), fr('a()', 'czeka, aż skończy się b()'), fr('b()', 'czeka, aż skończy się c()'), fr('c()', 'działa — wypisuje C', 'on')]),
    stack([
        P('Komputer zapisuje czekające funkcje jedna na drugiej — jak <b>stos talerzy</b>. To jest <b>stos wywołań</b>.'),
        steps(['Wywołanie funkcji = <b>kładziemy</b> nowy talerz na wierzch.', 'Koniec funkcji = <b>zdejmujemy</b> talerz z wierzchu.', 'Działa zawsze tylko funkcja <b>z wierzchu</b>. Reszta czeka.'], 'tight'),
        note('Obrazek pokazuje chwilę, gdy działa <b>c()</b> i wypisuje literę C.'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

// ================================================================ 03
sec('03');
slide('A gdyby funkcja wywołała samą siebie?', cols([
    stack([
        code(`
            void f() {
                cout << "Hej ";
                f();
            }

            int main() {
                f();
            }`, { size: 'lg', hl: [3] }),
    ]),
    stack([
        P('W linijce 3 funkcja <b>f</b> wywołuje… funkcję <b>f</b>. W C++ wolno tak napisać. Co się stanie?'),
        term('Hej Hej Hej Hej Hej Hej Hej Hej Hej Hej\nHej Hej Hej Hej Hej Hej Hej Hej Hej Hej\nHej Hej Hej Hej …\nSegmentation fault'),
        warn('Każde f() woła kolejne f(), które woła kolejne f()… Nic tego nie zatrzymuje. Po chwili brakuje pamięci na kolejne czekające funkcje i <b>program się wysypuje</b>.'),
    ]),
], { t: '1fr 1.15fr', align: 'center' }));

slide('Rekurencja', stack([
    big('<em>Rekurencja</em> to sytuacja, w której funkcja <strong>wywołuje samą siebie</strong>.'),
    P('Brzmi jak błąd z poprzedniego slajdu — i bez zabezpieczenia rzeczywiście nim jest. Ale dobrze napisana rekurencja to jedno z najpotężniejszych narzędzi w programowaniu olimpijskim. Na czym polega „dobrze napisana”? Za chwilę.'),
    cards([
        card('Matrioszka', 'W każdej lalce jest mniejsza lalka. Ale w najmniejszej <b>nie ma już nic</b> — tam się kończy.', 'tlc'),
        card('Lustro w lustrze', 'Dwa lustra naprzeciw siebie pokazują odbicie odbicia odbicia… To rekurencja <b>bez końca</b>.', 'orc'),
        card('Kolejka w sklepiku', 'Pytasz osobę przed sobą: „które jesteś?”. Ona pyta osobę przed nią… Zaraz to rozpiszemy.', 'puc'),
    ], 3),
], { gap: 22 }));

slide('Analogia: kolejka do sklepiku', cols([
    trace([
        { d: 0, k: 'call', t: 'Ty pytasz Kasię: „które jesteś w kolejce?”' },
        { d: 1, k: 'call', t: 'Kasia nie wie — pyta Olka' },
        { d: 2, k: 'call', t: 'Olek nie wie — pyta Zosię' },
        { d: 3, k: 'stop', t: 'Zosia stoi pierwsza: <b>„jestem 1.”</b>' },
        { d: 2, k: 'ret', t: 'Olek: „to ja jestem <b>2.</b>”' },
        { d: 1, k: 'ret', t: 'Kasia: „to ja jestem <b>3.</b>”' },
        { d: 0, k: 'ret', t: 'Ty: „czyli ja jestem <b>4.</b>”' },
    ], { cap: 'pytanie idzie w dół, odpowiedź wraca w górę' }),
    stack([
        P('Każda osoba robi <b>to samo</b>: jeśli nie zna odpowiedzi, zadaje <b>to samo pytanie</b> osobie przed sobą, czeka na odpowiedź i dodaje do niej 1.'),
        P('Tylko pierwsza osoba odpowiada <b>od razu</b>, bez pytania — to zatrzymuje całą lawinę pytań.'),
        good('To jest dokładnie rekurencja: <b>to samo pytanie, tylko mniejsze</b>, aż do przypadku, który znamy od ręki.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Każde wywołanie to osobna kopia funkcji', cols([
    code(`
        void f(int n) {
            cout << "zaczynam f(" << n << ")" << endl;
            if (n > 1) f(n - 1);
            cout << "koncze f(" << n << ")" << endl;
        }`, { size: 'sm' }),
    stack([
        P(`Wywołanie ${c('f(3)')} woła ${c('f(2)')}. Czy ${c('f(2)')} „psuje” zmienną <b>n</b> w ${c('f(3)')}? <b>Nie!</b>`),
        cards([card('kopia 1: f(3)', 'własne <b>n = 3</b>', 'puc'), card('kopia 2: f(2)', 'własne <b>n = 2</b>', 'puc'), card('kopia 3: f(1)', 'własne <b>n = 1</b>', 'tlc')], 3),
        term('zaczynam f(3)\nzaczynam f(2)\nzaczynam f(1)\nkoncze f(1)\nkoncze f(2)\nkoncze f(3)'),
    ]),
], { t: '1fr 1.15fr', align: 'center' }));

slide('Kopie funkcji — najważniejsze', stack([
    big('Każde wywołanie ma <em>własne</em> parametry i zmienne. Wywołania <strong>nie widzą</strong> nawzajem swoich zmiennych.'),
    P('Pamiętasz zdanie z początku? „Każde wywołanie dostaje własną zmienną.” Przy rekurencji jest tak samo: gdy <b>f(3)</b> wywołuje <b>f(2)</b>, to powstaje nowa kopia funkcji z nowym <b>n</b>. Gdy ta kopia się skończy, wracamy do <b>f(3)</b> — a tam <b>n</b> nadal wynosi <b>3</b>.'),
    note('Dlatego po wypisaniu „koncze f(1)” program wypisał „koncze f(2)”, a nie znowu „koncze f(1)”: każda kopia pamięta <b>swoje</b> n.'),
], { gap: 20 }));

// ================================================================ 04
sec('04');
slide('Problem: rekurencja bez końca', cols([
    code(`
        void odliczaj(int n) {
            cout << n << " ";
            odliczaj(n - 1);
        }

        int main() {
            odliczaj(3);
        }`, { size: 'lg' }),
    stack([
        P('Chcemy odliczać: <b>3 2 1</b>. Funkcja wypisuje n i woła siebie dla n − 1. Brzmi dobrze…'),
        term('3 2 1 0 -1 -2 -3 -4 -5 -6 -7 -8 …\nSegmentation fault'),
        warn('…ale nic nie mówi funkcji, <b>kiedy przestać</b>. Po 1 przychodzi 0, potem −1, −2, i tak bez końca — aż program się wysypie.'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

const ODL = `
    void odliczaj(int n) {
        if (n == 0) return;
        cout << n << " ";
        odliczaj(n - 1);
    }`;
slide('Warunek stopu', cols([
    code(ODL, { size: 'lg', hl: [2] }),
    stack([
        P(`Dodajemy jedną linijkę: ${c('if (n == 0) return;')}`),
        P(`Gdy n dojdzie do zera, funkcja <b>od razu kończy pracę</b> — nie wypisuje nic i nie woła siebie dalej. To jest <b>warunek stopu</b> (po angielsku: <i>base case</i>).`),
        term('3 2 1'),
        good('Teraz wywołania idą 3 → 2 → 1 → 0, a <b>odliczaj(0)</b> zatrzymuje lawinę.'),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Budowa funkcji rekurencyjnej', stack([
    code(ODL, { size: 'lg' }),
    cards([
        card('1 · warunek stopu', `${c('if (n == 0) return;')} — najmniejszy przypadek, w którym <b>nie trzeba</b> wołać siebie. Piszemy go <b>na samej górze</b>.`, 'orc'),
        card('2 · praca tego wywołania', `${c('cout << n << " ";')} — to, co robi <b>ta jedna kopia</b> funkcji: wypisuje swoje n.`, 'puc'),
        card('3 · mniejszy problem', `${c('odliczaj(n - 1);')} — resztę pracy zlecamy kolejnej kopii, z <b>mniejszym</b> n. Każde wywołanie zbliża nas do warunku stopu.`, 'tlc'),
    ], 3),
], { gap: 20 }));

slide('Odliczanie — cały program', cols([
    code(`
        #include <bits/stdc++.h>
        using namespace std;

        void odliczaj(int n) {
            if (n == 0) return;
            cout << n << " ";
            odliczaj(n - 1);
        }

        int main() {
            odliczaj(3);
            cout << "START" << endl;
        }`, { size: 'sm' }),
    stack([
        term('3 2 1 START'),
        P(`Napis START wypisuje <b>main</b> — dopiero wtedy, gdy ${c('odliczaj(3)')} całkowicie się skończy, razem ze wszystkimi kopiami, które wywołało.`),
        note('Na kolejnych slajdach prześledzimy ten program <b>wywołanie po wywołaniu</b> — razem ze stosem.'),
    ]),
], { t: '1.05fr 1fr', align: 'center' }));

// ================================================================ 05
sec('05');
const ODL_MAIN = `
    void odliczaj(int n) {
        if (n == 0) return;
        cout << n << " ";
        odliczaj(n - 1);
    }

    int main() {
        odliczaj(3);
        cout << "START";
    }`;
const odlSlide = (title, hl, info, frames, out) => slide(title, cols([
    stack([code(ODL_MAIN, { hl, dim: true }), term(out, { cursor: true })]),
    stack([kv(info), stos(frames)]),
], { t: '1fr 1fr', align: 'start' }));

odlSlide('Start: main woła `odliczaj(3)`', [8],
    [['linijka', '8'], ['robimy', `${c('odliczaj(3)')} — main <b>zatrzymuje się</b> i czeka`]],
    [fr('main()', 'czeka w linijce 8', 'main'), fr('odliczaj(3)', 'zaczyna, n = 3', 'on')], '');
odlSlide('Kopia `odliczaj(3)`: n = 3', [2, 3, 4],
    [['warunek', `${c('3 == 0')} → ${NO} — idziemy dalej`], ['wypisuje', '<b>3</b>'], ['woła', `${c('odliczaj(2)')} i czeka w linijce 4`]],
    [fr('main()', 'czeka w linijce 8', 'main'), fr('odliczaj(3)', 'n = 3, czeka w linijce 4'), fr('odliczaj(2)', 'zaczyna, n = 2', 'on')], '3 ');
odlSlide('Kopia `odliczaj(2)`: n = 2', [2, 3, 4],
    [['warunek', `${c('2 == 0')} → ${NO}`], ['wypisuje', '<b>2</b>'], ['woła', `${c('odliczaj(1)')} i czeka`]],
    [fr('main()', 'czeka w linijce 8', 'main'), fr('odliczaj(3)', 'n = 3, czeka'), fr('odliczaj(2)', 'n = 2, czeka w linijce 4'), fr('odliczaj(1)', 'zaczyna, n = 1', 'on')], '3 2 ');
odlSlide('Kopia `odliczaj(1)`: n = 1', [2, 3, 4],
    [['warunek', `${c('1 == 0')} → ${NO}`], ['wypisuje', '<b>1</b>'], ['woła', `${c('odliczaj(0)')} i czeka`]],
    [fr('main()', 'czeka', 'main'), fr('odliczaj(3)', 'n = 3, czeka'), fr('odliczaj(2)', 'n = 2, czeka'), fr('odliczaj(1)', 'n = 1, czeka w linijce 4'), fr('odliczaj(0)', 'zaczyna, n = 0', 'on')], '3 2 1 ');
odlSlide('Kopia `odliczaj(0)`: warunek stopu!', [2],
    [['warunek', `${c('0 == 0')} → ${YES}`], ['robimy', `${c('return')} — koniec tej kopii`], ['nie robi', 'nic nie wypisuje, <b>nikogo nie woła</b>']],
    [fr('main()', 'czeka', 'main'), fr('odliczaj(3)', 'n = 3, czeka'), fr('odliczaj(2)', 'n = 2, czeka'), fr('odliczaj(1)', 'n = 1, czeka'), fr('odliczaj(0)', 'return — znika ze stosu', 'ret')], '3 2 1 ');
odlSlide('Powrót do `odliczaj(1)`', [5],
    [['gdzie', 'w linijce 4, zaraz po wywołaniu'], ['co dalej', 'za wywołaniem nie ma już żadnych poleceń'], ['robimy', 'dochodzimy do końca funkcji → <b>powrót</b>']],
    [fr('main()', 'czeka', 'main'), fr('odliczaj(3)', 'n = 3, czeka'), fr('odliczaj(2)', 'n = 2, czeka'), fr('odliczaj(1)', 'n = 1, kończy pracę', 'ret')], '3 2 1 ');
odlSlide('Powrót do `odliczaj(2)` i `odliczaj(3)`', [5],
    [['odliczaj(2)', 'też nie ma nic po wywołaniu → kończy'], ['odliczaj(3)', 'tak samo → kończy'], ['stos', 'zdejmujemy kopie <b>od wierzchu</b>: 1, potem 2, potem 3']],
    [fr('main()', 'czeka', 'main'), fr('odliczaj(3)', 'kończy pracę', 'ret')], '3 2 1 ');
odlSlide('Powrót do main: START', [9],
    [['gdzie', 'main wraca za linijkę 8'], ['robimy', `${c('cout << "START"')}`], ['stos', 'został sam main — wszystkie kopie odliczaj zniknęły']],
    [fr('main()', 'działa dalej, linijka 9', 'on')], '3 2 1 START');

slide('Całe odliczanie w jednej tabeli', stack([
    table(['Kopia', 'n', 'n == 0?', 'Wypisuje', 'Co dalej'], [
        [c('odliczaj(3)'), '3', NO, '<b>3</b>', `woła ${c('odliczaj(2)')}`],
        [c('odliczaj(2)'), '2', NO, '<b>2</b>', `woła ${c('odliczaj(1)')}`],
        [c('odliczaj(1)'), '1', NO, '<b>1</b>', `woła ${c('odliczaj(0)')}`],
        [c('odliczaj(0)'), '0', YES, '—', '<b>return</b> — warunek stopu'],
    ], { widths: ['22%', '8%', '13%', '15%', '42%'], cls: 'mid' }),
    note('W drodze <b>w dół</b> (3 → 2 → 1 → 0) każda kopia wypisuje swoje n. W drodze <b>w górę</b> (0 → 1 → 2 → 3) kopie tylko się kończą, bo po wywołaniu nie mają już nic do zrobienia. Za chwilę to zmienimy!'),
], { gap: 18 }));

// ================================================================ 06
sec('06');
slide('Stos — jak stos talerzy', cols([
    stack([
        cards([
            card('wywołanie funkcji', 'kładziemy nowy talerz <b>na wierzch</b> stosu', 'tlc'),
            card('return / koniec funkcji', 'zdejmujemy talerz <b>z wierzchu</b> stosu', 'orc'),
            card('kto działa?', 'zawsze funkcja z <b>wierzchu</b> — pozostałe czekają', 'puc'),
            card('na dnie', 'zawsze leży <b>main</b> — program kończy się, gdy zdejmiemy i jego', 'puc'),
        ], 2),
    ]),
    stos([fr('main()', 'czeka w linijce 8', 'main'), fr('odliczaj(3)', 'n = 3, czeka'), fr('odliczaj(2)', 'n = 2, czeka'), fr('odliczaj(1)', 'n = 1 — działa', 'on')]),
], { t: '1.15fr 1fr', align: 'center' }));

const mini = (frames, cap) => stos(frames, { size: 'sm', cap, noTop: true });
slide('Stos podczas `odliczaj(3)` — klatka po klatce', stack([
    `<div class="stks">${[
        mini([fr('main', '', 'main'), fr('odl(3)', '', 'on')], '1. start'),
        mini([fr('main', '', 'main'), fr('odl(3)', ''), fr('odl(2)', '', 'on')], '2. woła'),
        mini([fr('main', '', 'main'), fr('odl(3)', ''), fr('odl(2)', ''), fr('odl(1)', '', 'on')], '3. woła'),
        mini([fr('main', '', 'main'), fr('odl(3)', ''), fr('odl(2)', ''), fr('odl(1)', ''), fr('odl(0)', 'stop', 'ret')], '4. stop'),
        mini([fr('main', '', 'main'), fr('odl(3)', ''), fr('odl(2)', ''), fr('odl(1)', '', 'ret')], '5. powrót'),
        mini([fr('main', '', 'main'), fr('odl(3)', ''), fr('odl(2)', '', 'ret')], '6. powrót'),
        mini([fr('main', '', 'main'), fr('odl(3)', '', 'ret')], '7. powrót'),
        mini([fr('main', 'START', 'on')], '8. koniec'),
    ].join('')}</div>`,
    note('Stos najpierw <b>rośnie</b> (każde wywołanie dokłada kopię), a od warunku stopu <b>maleje</b> (każdy powrót zdejmuje kopię). Najwyżej był na 5 piętrach: main + 4 kopie odliczaj.'),
], { gap: 22 }));

slide('Ile miejsca zajmuje stos?', cols([
    stack([
        P('Każda czekająca kopia funkcji zajmuje trochę pamięci: swoje parametry, zmienne i informację, dokąd wrócić.'),
        table(['Wywołanie', 'Pięter stosu', 'Czy się zmieści?'], [
            [c('odliczaj(10)'), '11', '<b class="yes">bez problemu</b>'],
            [c('odliczaj(10000)'), '10 001', '<b class="yes">tak</b>'],
            [c('odliczaj(1000000)'), 'milion', 'zależy od komputera — <b class="no">ryzykownie</b>'],
            ['rekurencja bez stopu', 'nieskończenie wiele', '<b class="no">nigdy</b>'],
        ], { widths: ['38%', '27%', '35%'], cls: 'mid' }),
    ]),
    stack([
        warn('Gdy pięter jest za dużo, kończy się pamięć przeznaczona na stos. To jest <b>przepełnienie stosu</b> (ang. <i>stack overflow</i>) — program kończy się błędem.'),
        note('Bezpieczna zasada na olimpiadzie: rekurencja o głębokości do <b>ok. 100 000</b> zwykle działa. Jeśli ma być głębsza — lepiej użyć pętli.'),
    ]),
], { t: '1.2fr 1fr', align: 'center' }));

// ================================================================ 07
sec('07');
slide('Przenieśmy jedną linijkę', cols([
    stack([
        code(`
            void A(int n) {
                if (n == 0) return;
                cout << n << " ";
                A(n - 1);
            }`, { cap: 'wersja A — wypisz, potem wywołaj', hl: [3] }),
        term('3 2 1', { cap: 'A(3) wypisuje' }),
    ]),
    stack([
        code(`
            void B(int n) {
                if (n == 0) return;
                B(n - 1);
                cout << n << " ";
            }`, { cap: 'wersja B — wywołaj, potem wypisz', hl: [4] }),
        term('1 2 3', { cap: 'B(3) wypisuje' }),
    ]),
], { gap: 40, align: 'start' }), P('Funkcje różnią się tylko <b>kolejnością dwóch linijek</b>, a wypisują liczby w odwrotnej kolejności. Dlaczego?', 'cen'));

const B_CODE = `
    void B(int n) {
        if (n == 0) return;
        B(n - 1);
        cout << n << " ";
    }`;
slide('Wersja B: droga w dół', cols([
    stack([code(B_CODE, { hl: [3], dim: true, size: 'lg' }), term('', { cursor: true })]),
    stack([
        trace([
            { d: 0, k: 'call', t: `${c('B(3)')}: 3 ≠ 0, woła ${c('B(2)')} — <b>jeszcze nic nie wypisuje</b>` },
            { d: 1, k: 'call', t: `${c('B(2)')}: woła ${c('B(1)')} — czeka` },
            { d: 2, k: 'call', t: `${c('B(1)')}: woła ${c('B(0)')} — czeka` },
            { d: 3, k: 'stop', t: `${c('B(0)')}: warunek stopu, <b>return</b>` },
        ]),
        note(`W drodze w dół każda kopia zatrzymuje się na linijce 3 — na wywołaniu. Do ${c('cout')} w linijce 4 jeszcze <b>nikt nie doszedł</b>, więc ekran jest pusty.`),
    ]),
], { t: '1fr 1.15fr', align: 'center' }));

slide('Wersja B: droga w górę', cols([
    stack([code(B_CODE, { hl: [4], dim: true, size: 'lg' }), term('1 2 3')]),
    stack([
        trace([
            { d: 3, k: 'ret', t: `${c('B(0)')} wraca do ${c('B(1)')}` },
            { d: 2, k: 'out', t: `${c('B(1)')} dochodzi do linijki 4: wypisuje <b>1</b>` },
            { d: 2, k: 'ret', t: `${c('B(1)')} wraca do ${c('B(2)')}` },
            { d: 1, k: 'out', t: `${c('B(2)')} wypisuje <b>2</b>` },
            { d: 1, k: 'ret', t: `${c('B(2)')} wraca do ${c('B(3)')}` },
            { d: 0, k: 'out', t: `${c('B(3)')} wypisuje <b>3</b>` },
        ]),
        note('Kopie wracają w odwrotnej kolejności (1, 2, 3) — i dopiero <b>po powrocie</b> każda wypisuje swoje n.'),
    ]),
], { t: '1fr 1.15fr', align: 'center' }));

slide('Najważniejsza zasada rekurencji', stack([
    big('Kod <em>PRZED</em> wywołaniem wykonuje się w drodze <em>w dół</em>. Kod <strong>PO</strong> wywołaniu — w drodze <strong>w górę</strong>, w odwrotnej kolejności.'),
    cols([
        trace([
            { d: 0, k: 'out', t: 'przed: n = 3' }, { d: 1, k: 'out', t: 'przed: n = 2' }, { d: 2, k: 'out', t: 'przed: n = 1' }, { d: 3, k: 'stop', t: 'stop' },
        ], { cap: 'w dół: 3, 2, 1' }),
        trace([
            { d: 3, k: 'stop', t: 'stop' }, { d: 2, k: 'ret', t: 'po: n = 1' }, { d: 1, k: 'ret', t: 'po: n = 2' }, { d: 0, k: 'ret', t: 'po: n = 3' },
        ], { cap: 'w górę: 1, 2, 3' }),
    ], { gap: 30 }),
], { gap: 22 }));

slide('Przed i po — naraz', cols([
    stack([
        code(`
            void f(int n) {
                if (n == 0) return;
                cout << n << " ";
                f(n - 1);
                cout << n << " ";
            }`, { size: 'lg', hl: [3, 5] }),
        term('3 2 1 1 2 3', { cap: 'f(3) wypisuje' }),
    ]),
    trace([
        { d: 0, k: 'out', t: 'f(3) przed: <b>3</b>' },
        { d: 1, k: 'out', t: 'f(2) przed: <b>2</b>' },
        { d: 2, k: 'out', t: 'f(1) przed: <b>1</b>' },
        { d: 3, k: 'stop', t: 'f(0): stop' },
        { d: 2, k: 'ret', t: 'f(1) po: <b>1</b>' },
        { d: 1, k: 'ret', t: 'f(2) po: <b>2</b>' },
        { d: 0, k: 'ret', t: 'f(3) po: <b>3</b>' },
    ], { cap: 'kolejność wypisywania' }),
], { t: '1.1fr 1fr', align: 'center' }));

const NAW = `
    void f(int n) {
        if (n == 0) return;
        cout << "(";
        f(n - 1);
        cout << ")";
    }`;
slide('Ćwiczenie: co wypisze `f(3)`?', cols([
    code(NAW, { size: 'lg' }),
    stack([term('?'), P('Zastanów się i zapisz odpowiedź, <b>zanim</b> przejdziesz dalej. Podpowiedź: co wypisuje się w drodze w dół, a co w drodze w górę?', 'muted')]),
], { t: '1.2fr 1fr', align: 'center' }));

slide('Odpowiedź: `((()))`', cols([
    trace([
        { d: 0, k: 'out', t: 'f(3) przed: <b>(</b>' },
        { d: 1, k: 'out', t: 'f(2) przed: <b>(</b>' },
        { d: 2, k: 'out', t: 'f(1) przed: <b>(</b>' },
        { d: 3, k: 'stop', t: 'f(0): stop' },
        { d: 2, k: 'ret', t: 'f(1) po: <b>)</b>' },
        { d: 1, k: 'ret', t: 'f(2) po: <b>)</b>' },
        { d: 0, k: 'ret', t: 'f(3) po: <b>)</b>' },
    ]),
    stack([
        term('((()))'),
        note('Trzy nawiasy otwierające w drodze w dół, trzy zamykające w drodze w górę. Każde wywołanie „otacza” nawiasami wszystko, co wypisało wywołanie głębiej.'),
    ]),
], { t: '1fr 1fr', align: 'center' }));

// ================================================================ 08
sec('08');
slide('Trzy pytania przed napisaniem rekurencji', stack([
    steps(['<b>Kiedy kończę?</b> Jaki jest najmniejszy przypadek, który umiem obsłużyć od ręki, bez wołania siebie? To będzie warunek stopu.',
        '<b>Jak zmniejszyć problem?</b> Z jakim argumentem wywołać siebie, żeby problem był mniejszy i zbliżał się do warunku stopu? (n − 1, n / 10, i + 1, …)',
        '<b>Co robi to jedno wywołanie — i kiedy?</b> Jaka jest „moja część” pracy i czy wykonać ją przed wywołaniem (w dół), czy po nim (w górę)?'], 'big'),
    note('Te trzy pytania zadawaj sobie przy <b>każdym</b> zadaniu z rekurencji — także w kolejnych częściach kursu.'),
], { gap: 20 }));

slide('Przykład: wypisz liczby od 1 do n', cols([
    table(['Pytanie', 'Odpowiedź'], [
        ['Kiedy kończę?', 'gdy <b>n == 0</b> — nie ma nic do wypisania'],
        ['Jak zmniejszyć?', `wywołuję ${c('wypisz(n - 1)')}`],
        ['Moja część?', 'wypisać <b>n</b>'],
        ['Kiedy?', 'n ma być <b>na końcu</b>, więc <b>po</b> wywołaniu'],
    ], { widths: ['36%', '64%'] }),
    stack([
        code(`
            void wypisz(int n) {
                if (n == 0) return;
                wypisz(n - 1);
                cout << n << " ";
            }`, { size: 'lg' }),
        term('1 2 3 4 5', { cap: 'wypisz(5) wypisuje' }),
    ]),
], { t: '1fr 1.05fr', align: 'center' }));

slide('Zaufaj rekurencji', cols([
    stack([
        big('Nie śledź w głowie wszystkich wywołań. <em>Załóż</em>, że mniejsze wywołanie działa — i dopisz tylko swoją część.'),
        note(`Myślimy tak: „${c('wypisz(n - 1)')} na pewno wypisze 1, 2, …, n − 1. Mnie zostaje dopisać <b>n</b>.” Koniec. Nie trzeba schodzić do zera.`),
    ]),
    stack([
        card('wypisz(5) =', `${c('wypisz(4)')} <b>[czyli 1 2 3 4]</b> + wypisanie <b>5</b>`, 'tlc'),
        card('wypisz(4) =', `${c('wypisz(3)')} <b>[czyli 1 2 3]</b> + wypisanie <b>4</b>`, 'puc'),
        card('wypisz(0) =', 'nic — warunek stopu', 'orc'),
    ]),
], { t: '1.2fr 1fr', align: 'center' }));

// ================================================================ 09
sec('09');
slide('Przykład: napis n razy', cols([
    stack([
        code(`
            void powtorz(int n, string s) {
                if (n == 0) return;
                cout << s << endl;
                powtorz(n - 1, s);
            }

            int main() {
                powtorz(3, "rekurencja");
            }`),
        term('rekurencja\nrekurencja\nrekurencja'),
    ]),
    stack([
        table(['Pytanie', 'Odpowiedź'], [['Kiedy kończę?', 'gdy n == 0'], ['Jak zmniejszyć?', c('powtorz(n - 1, s)')], ['Moja część?', 'wypisać s jeden raz']], { widths: ['42%', '58%'], cls: 'mid' }),
        note('Funkcja może mieć <b>kilka parametrów</b>. Parametr s przekazujemy dalej bez zmian — zmniejsza się tylko n.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Przykład: liczby od a do b', cols([
    stack([
        code(`
            void wypisz(int a, int b) {
                if (a > b) return;
                cout << a << " ";
                wypisz(a + 1, b);
            }`, { size: 'lg' }),
        term('3 4 5 6', { cap: 'wypisz(3, 6) wypisuje' }),
    ]),
    stack([
        trace([
            { d: 0, k: 'out', t: 'wypisz(3, 6): <b>3</b>' }, { d: 1, k: 'out', t: 'wypisz(4, 6): <b>4</b>' },
            { d: 2, k: 'out', t: 'wypisz(5, 6): <b>5</b>' }, { d: 3, k: 'out', t: 'wypisz(6, 6): <b>6</b>' },
            { d: 4, k: 'stop', t: 'wypisz(7, 6): 7 > 6, stop' },
        ], { size: 'sm' }),
        note('Tutaj problem <b>maleje</b>, choć liczba a <b>rośnie</b>: maleje odległość od a do b. Warunek stopu zależy od obu parametrów.'),
    ]),
], { t: '1fr 1.05fr', align: 'center' }));

slide('Przykład: co druga liczba', cols([
    stack([
        code(`
            void coDruga(int n) {
                if (n <= 0) return;
                cout << n << " ";
                coDruga(n - 2);
            }`, { size: 'lg', hl: [2] }),
        term('9 7 5 3 1', { cap: 'coDruga(9) wypisuje' }),
    ]),
    stack([
        warn(`Z warunkiem ${c('n == 0')} ta funkcja by się wysypała! Dla n = 9 wywołania idą 9, 7, 5, 3, 1, <b>−1</b>, −3, … i <b>nigdy</b> nie trafiają w zero.`),
        good(`Warunek ${c('n <= 0')} łapie i zero, i liczby ujemne. Pisz warunek stopu tak, żeby <b>nie dało się go przeskoczyć</b>.`),
    ]),
], { t: '1fr 1.05fr', align: 'center' }));

slide('Przykład: linia gwiazdek', cols([
    stack([
        code(`
            void linia(int k) {
                if (k == 0) return;
                cout << '*';
                linia(k - 1);
            }`, { size: 'lg' }),
        term('*****', { cap: 'linia(5) wypisuje' }),
    ]),
    stack([
        P(`To ta sama funkcja co ${c('powtorz')}, tylko zamiast słowa wypisuje gwiazdkę i <b>bez</b> przechodzenia do nowej linii.`),
        note('Za chwilę użyjemy jej jak klocka: z wielu linii zbudujemy trójkąt. Rekurencyjne funkcje mogą wołać <b>inne</b> rekurencyjne funkcje.'),
    ]),
], { t: '1fr 1.05fr', align: 'center' }));

slide('Przykład: trójkąt z gwiazdek', cols([
    code(`
        void linia(int k) {
            if (k == 0) return;
            cout << '*';
            linia(k - 1);
        }

        void trojkat(int n) {
            if (n == 0) return;
            trojkat(n - 1);
            linia(n);
            cout << endl;
        }`, { size: 'sm', hl: [9, 10, 11] }),
    stack([
        term('*\n**\n***\n****', { cap: 'trojkat(4) wypisuje' }),
        P(`Zaufaj rekurencji: ${c('trojkat(n - 1)')} narysuje trójkąt o wysokości n − 1. Nam zostaje dorysować <b>pod nim</b> wiersz z n gwiazdkami — czyli <b>po</b> wywołaniu.`),
    ]),
], { t: '1fr 1fr', align: 'center' }));

slide('Trójkąt krok po kroku', cols([
    trace([
        { d: 0, k: 'call', t: 'trojkat(3) woła trojkat(2)' },
        { d: 1, k: 'call', t: 'trojkat(2) woła trojkat(1)' },
        { d: 2, k: 'call', t: 'trojkat(1) woła trojkat(0)' },
        { d: 3, k: 'stop', t: 'trojkat(0): stop' },
        { d: 2, k: 'out', t: 'trojkat(1) po powrocie: linia(1) → <b>*</b>' },
        { d: 1, k: 'out', t: 'trojkat(2) po powrocie: linia(2) → <b>**</b>' },
        { d: 0, k: 'out', t: 'trojkat(3) po powrocie: linia(3) → <b>***</b>' },
    ]),
    stack([
        term('*\n**\n***'),
        note('A gdyby linię narysować <b>przed</b> wywołaniem? Wiersze pojawiłyby się w drodze w dół: <b>***</b>, <b>**</b>, <b>*</b> — trójkąt do góry nogami. Sprawdź to w zadaniu „Odwrócony trójkąt”.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Przykład: cyfry liczby od końca', cols([
    stack([
        code(`
            void cyfry(int n) {
                if (n < 10) {
                    cout << n;
                    return;
                }
                cout << n % 10 << " ";
                cyfry(n / 10);
            }`),
        term('1 2 8 4', { cap: 'cyfry(4821) wypisuje' }),
    ]),
    table(['Wywołanie', 'n % 10', 'n / 10'], [
        [c('cyfry(4821)'), 'wypisuje <b>1</b>', 'woła cyfry(482)'],
        [c('cyfry(482)'), 'wypisuje <b>2</b>', 'woła cyfry(48)'],
        [c('cyfry(48)'), 'wypisuje <b>8</b>', 'woła cyfry(4)'],
        [c('cyfry(4)'), '4 < 10 → wypisuje <b>4</b>', 'stop'],
    ], { widths: ['30%', '38%', '32%'], cls: 'mid' }),
], { t: '1fr 1.15fr', align: 'center' }), note(`${c('n % 10')} to ostatnia cyfra, a ${c('n / 10')} to liczba bez ostatniej cyfry. Problem maleje: liczba ma za każdym razem o jedną cyfrę mniej.`));

slide('Przykład: cyfry od początku', cols([
    stack([
        code(`
            void cyfry(int n) {
                if (n < 10) {
                    cout << n;
                    return;
                }
                cyfry(n / 10);
                cout << " " << n % 10;
            }`, { hl: [6, 7] }),
        term('4 8 2 1', { cap: 'cyfry(4821) wypisuje' }),
    ]),
    stack([
        P('Zamieniamy kolejność dwóch linijek — i cyfry wychodzą od <b>pierwszej</b>!'),
        trace([
            { d: 0, k: 'call', t: 'cyfry(4821) woła cyfry(482)' }, { d: 1, k: 'call', t: 'cyfry(482) woła cyfry(48)' },
            { d: 2, k: 'call', t: 'cyfry(48) woła cyfry(4)' }, { d: 3, k: 'out', t: 'cyfry(4): <b>4</b>' },
            { d: 2, k: 'ret', t: 'cyfry(48) po powrocie: <b>8</b>' }, { d: 1, k: 'ret', t: 'cyfry(482): <b>2</b>' }, { d: 0, k: 'ret', t: 'cyfry(4821): <b>1</b>' },
        ], { size: 'sm' }),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Przykład: napis od tyłu', cols([
    stack([
        code(`
            void odwroc(const string &s, int i) {
                if (i == s.size()) return;
                odwroc(s, i + 1);
                cout << s[i];
            }

            int main() {
                odwroc("kot", 0);
            }`, { size: 'sm' }),
        term('tok'),
    ]),
    stack([
        P(`Tym razem parametr <b>i</b> to pozycja w napisie. Zaczynamy od 0, a każde wywołanie przesuwa się o jedną literę w prawo — aż do końca napisu.`),
        trace([
            { d: 0, k: 'call', t: 'i = 0 (k) woła i = 1' }, { d: 1, k: 'call', t: 'i = 1 (o) woła i = 2' }, { d: 2, k: 'call', t: 'i = 2 (t) woła i = 3' },
            { d: 3, k: 'stop', t: 'i = 3: koniec napisu' }, { d: 2, k: 'out', t: 'wypisuje <b>t</b>' }, { d: 1, k: 'out', t: 'wypisuje <b>o</b>' }, { d: 0, k: 'out', t: 'wypisuje <b>k</b>' },
        ], { size: 'sm' }),
    ]),
], { t: '1fr 1.05fr', align: 'center' }));

slide('Przykład: zapis dwójkowy', cols([
    stack([
        code(`
            void dwojkowo(int n) {
                if (n < 2) {
                    cout << n;
                    return;
                }
                dwojkowo(n / 2);
                cout << n % 2;
            }`),
        term('1101', { cap: 'dwojkowo(13) wypisuje' }),
    ]),
    stack([
        P('Ostatnia cyfra zapisu dwójkowego to <b>n % 2</b>, a reszta to zapis liczby <b>n / 2</b>. Dokładnie jak cyfry od początku — tylko z 2 zamiast 10.'),
        table(['n', 'n / 2', 'n % 2'], [['13', '6', '1'], ['6', '3', '0'], ['3', '1', '1'], ['1', 'stop', 'wypisuje 1']], { cls: 'mid ctr' }),
        note('Reszty wypisują się w drodze w górę, od dołu tabeli: <b>1, 1, 0, 1</b>.'),
    ]),
], { t: '1fr 1.05fr', align: 'center' }));

// ================================================================ 10
sec('10');
slide('Najczęstsze błędy (1/2)', traps([
    `<b>Brak warunku stopu.</b> Funkcja woła siebie bez końca, aż skończy się stos. Pisz warunek stopu jako <b>pierwszą linijkę</b> funkcji — zanim napiszesz cokolwiek innego.`,
    `<b>Krok w złą stronę.</b> ${c('odliczaj(n + 1)')} zamiast ${c('odliczaj(n - 1)')}: n rośnie i nigdy nie dojdzie do zera. Sprawdź, czy argument naprawdę <b>zbliża się</b> do warunku stopu.`,
    `<b>Warunek, który da się przeskoczyć.</b> Przy kroku ${c('n - 2')} warunek ${c('n == 0')} nie zadziała dla nieparzystych n. Bezpieczniej: ${c('n <= 0')}.`,
]));

slide('Najczęstsze błędy (2/2)', traps([
    `<b>Zapomniany return.</b> ${c('if (n == 0) cout << "koniec";')} — bez <b>return</b> funkcja idzie dalej i woła siebie dla −1, −2, … Warunek stopu musi <b>kończyć</b> funkcję.`,
    `<b>Zła kolejność.</b> Kod przed wywołaniem działa w drodze w dół, kod po wywołaniu — w drodze w górę. Jeśli liczby wychodzą odwrotnie, niż chcesz, przestaw linijki.`,
    `<b>Za głęboka rekurencja.</b> ${c('odliczaj(10000000)')} to 10 milionów pięter stosu — program się wysypie. Rekurencja głęboka na miliony to zadanie dla pętli.`,
]));

// ================================================================ 11
sec('11');
const quiz = (n, title, src, extra = '') => slide(`Pytanie ${n}: ${title}`, cols([
    code(src, { size: 'lg' }),
    stack([term('?'), extra ? P(extra, 'muted') : '', P('Zastanów się i zapisz odpowiedź, <b>zanim</b> przejdziesz dalej.', 'muted')]),
], { t: '1.35fr 1fr', align: 'center' }));

quiz(1, 'co wypisze `f(4)`?', `
    void f(int n) {
        if (n == 0) return;
        cout << n;
        f(n - 1);
    }`);
slide('Odpowiedź 1: `4321`', cols([
    trace([{ d: 0, k: 'out', t: 'f(4): <b>4</b>' }, { d: 1, k: 'out', t: 'f(3): <b>3</b>' }, { d: 2, k: 'out', t: 'f(2): <b>2</b>' }, { d: 3, k: 'out', t: 'f(1): <b>1</b>' }, { d: 4, k: 'stop', t: 'f(0): stop' }]),
    stack([term('4321'), note('Wypisywanie jest <b>przed</b> wywołaniem, więc liczby idą w drodze w dół: 4, 3, 2, 1. Bez spacji — bo w kodzie nie ma " ".')]),
], { align: 'center' }));

quiz(2, 'co wypisze `g(4)`?', `
    void g(int n) {
        if (n == 0) return;
        g(n - 1);
        cout << n * n << " ";
    }`);
slide('Odpowiedź 2: `1 4 9 16`', cols([
    trace([{ d: 0, k: 'call', t: 'g(4) woła g(3)' }, { d: 1, k: 'call', t: 'g(3) woła g(2)' }, { d: 2, k: 'call', t: 'g(2) woła g(1)' }, { d: 3, k: 'call', t: 'g(1) woła g(0) — stop' },
        { d: 3, k: 'out', t: 'g(1): <b>1</b>' }, { d: 2, k: 'out', t: 'g(2): <b>4</b>' }, { d: 1, k: 'out', t: 'g(3): <b>9</b>' }, { d: 0, k: 'out', t: 'g(4): <b>16</b>' }], { size: 'sm' }),
    stack([term('1 4 9 16'), note('Wypisywanie jest <b>po</b> wywołaniu, więc kwadraty pojawiają się w drodze w górę — od najmniejszego n.')]),
], { align: 'center' }));

quiz(3, 'co wypisze `h(10)`?', `
    void h(int n) {
        if (n <= 0) return;
        cout << n << " ";
        h(n - 3);
    }`);
slide('Odpowiedź 3: `10 7 4 1`', cols([
    trace([{ d: 0, k: 'out', t: 'h(10): <b>10</b>' }, { d: 1, k: 'out', t: 'h(7): <b>7</b>' }, { d: 2, k: 'out', t: 'h(4): <b>4</b>' }, { d: 3, k: 'out', t: 'h(1): <b>1</b>' }, { d: 4, k: 'stop', t: 'h(−2): −2 ≤ 0, stop' }]),
    stack([term('10 7 4 1'), note(`Po 1 przychodzi −2 — nie zero! Dobrze, że warunek to ${c('n <= 0')}, a nie ${c('n == 0')}.`)]),
], { align: 'center' }));

quiz(4, 'znajdź błąd', `
    void odliczaj(int n) {
        cout << n << " ";
        if (n == 0) return;
        odliczaj(n + 1);
    }`, 'Program dla odliczaj(3) miał wypisać 3 2 1 0.');
slide('Odpowiedź 4: krok w złą stronę', cols([
    stack([
        code(`
            void odliczaj(int n) {
                cout << n << " ";
                if (n == 0) return;
                odliczaj(⟦n + 1⟧);
            }`, { size: 'lg', bad: true, cap: 'błąd' }),
        term('3 4 5 6 7 8 9 10 …\nSegmentation fault'),
    ]),
    stack([
        code(`
            void odliczaj(int n) {
                cout << n << " ";
                if (n == 0) return;
                odliczaj(n - 1);
            }`, { size: 'lg', good: true, cap: 'poprawnie' }),
        term('3 2 1 0'),
        note('Warunek stopu stoi tu <b>po</b> cout — dlatego wypisze się też 0. To nie błąd, tylko inna kolejność.'),
    ]),
], { gap: 30, align: 'start' }));

quiz(5, 'co wypisze `f(3)`?', `
    void f(int n) {
        if (n == 0) return;
        f(n - 1);
        cout << n << " ";
        f(n - 1);
    }`, 'Uwaga: tym razem funkcja woła siebie DWA razy.');
slide('Odpowiedź 5: `1 2 1 3 1 2 1`', cols([
    stack([
        P(`${c('f(n)')} = najpierw całe ${c('f(n - 1)')}, potem <b>n</b>, potem znowu całe ${c('f(n - 1)')}.`),
        table(['Wywołanie', 'Wypisuje'], [[c('f(1)'), '<b>1</b>'], [c('f(2)'), 'f(1), 2, f(1) = <b>1 2 1</b>'], [c('f(3)'), 'f(2), 3, f(2) = <b>1 2 1 3 1 2 1</b>']], { widths: ['30%', '70%'] }),
    ]),
    stack([term('1 2 1 3 1 2 1'), good('Funkcja, która woła siebie <b>więcej niż raz</b>, to temat części 3 — zobaczysz tam całe <b>drzewo</b> wywołań.')]),
], { t: '1.2fr 1fr', align: 'center' }));

// ================================================================ 12
sec('12');
slide('Ściąga: rekurencja w jednym miejscu', table(['Element', 'Co robi', 'Pamiętaj'], [
    [c('if (n == 0) return;'), 'warunek stopu — koniec schodzenia w dół', 'zawsze na górze funkcji'],
    [c('f(n - 1);'), 'wywołanie dla mniejszego problemu', 'argument musi zbliżać się do stopu'],
    ['kod <b>przed</b> f(…)', 'wykonuje się w drodze <b>w dół</b>', 'kolejność: 3, 2, 1'],
    ['kod <b>po</b> f(…)', 'wykonuje się w drodze <b>w górę</b>', 'kolejność odwrotna: 1, 2, 3'],
    ['stos wywołań', 'czekające kopie funkcji, każda z własnymi zmiennymi', 'za głęboko → przepełnienie'],
    [c('n % 10, n / 10'), 'ostatnia cyfra i liczba bez niej', 'krok po cyfrach liczby'],
    [c('f(s, i + 1)'), 'krok po pozycjach napisu / tablicy', 'stop, gdy i dojdzie do końca'],
], { widths: ['26%', '42%', '32%'], cls: 'mid' }));

slide('Zadania na koniec — Twoja kolej', stack([
    P('Wszystkie zadania są na <b>t-olimpians.com → Kompendium → Funkcje rekurencyjne → Krok 1</b>, z automatyczną sprawdzarką i wskazówką. Rób je po kolei:'),
    `<div class="cols" style="grid-template-columns:1fr 1fr;gap:20px">${[
        steps(['Powtórz napis', 'Odliczanie do startu', 'Od 1 do n', 'Tam i z powrotem', 'Od a do b', 'Co druga liczba', 'Linia gwiazdek', 'Trójkąt z gwiazdek', 'Odwrócony trójkąt'], 'tight'),
        `<ol class="steps tight" start="10" style="counter-reset:s 9">${['Klepsydra', 'Schodki z liczb', 'Cyfry od końca', 'Cyfry od początku', 'Napis od tyłu', 'Tablica od końca', 'Zapis dwójkowy rekurencyjnie', 'Zapis w systemie o podstawie k'].map((x) => `<li>${x}</li>`).join('')}</ol>`,
    ].join('')}</div>`,
], { gap: 14 }));

D.build({
    html: 'pdf-src/prezentacja-rekurencja-1-pierwsze-kroki.html',
    pdf: 'prezentacja-rekurencja-1-pierwsze-kroki-t-olimpians.pdf',
    generator: 'pdf-src/build-prezentacja-rekurencja-1.js',
    title: 'Rekurencja — pierwsze kroki — T-Olimpians',
    brand: 'rekurencja · część 1',
    foot: 'Rekurencja, część 1 — pierwsze kroki',
    secs: SECS,
    cover: {
        kicker: '// T-OLIMPIANS — PREZENTACJA DO LEKCJI',
        h1: 'Rekurencja<br>— pierwsze kroki',
        sub: 'Funkcja, która wywołuje samą siebie — od zera, powoli i po kolei: warunek stopu, osobne kopie funkcji, stos wywołań i kod wykonywany w drodze w dół i w górę. Każde wywołanie śledzimy na osobnym slajdzie.',
        meta: 'C++ · REKURENCJA · CZĘŚĆ 1 Z 6 · OD ZERA',
        deco: trace([{ d: 0, k: 'call', t: 'odliczaj(3)' }, { d: 1, k: 'call', t: 'odliczaj(2)' }, { d: 2, k: 'call', t: 'odliczaj(1)' }, { d: 3, k: 'stop', t: 'odliczaj(0) — stop' }], { size: 'sm' }),
    },
    end: {
        kicker: '// KONIEC CZĘŚCI 1',
        h1: 'Umiesz już<br>napisać rekurencję!',
        sub: 'Warunek stopu, mniejszy problem, kod przed i po wywołaniu, stos wywołań. Zrób zadania z kroku 1, a potem przejdź do części 2: funkcje rekurencyjne, które zwracają wynik.',
        deco: stos([fr('main()', 'program działa dalej', 'on')], { size: 'sm', noTop: true }),
    },
});
