#!/usr/bin/env node
/*
 * Prezentacja „Rekurencja — część 5: backtracking” (T-Olimpians, kurs rekurencji, krok 5 z 6).
 *
 * Generuje pdf-src/prezentacja-rekurencja-5-backtracking.html i (z flagą --pdf)
 * prezentacja-rekurencja-5-backtracking-t-olimpians.pdf. Buduje na części 4 (drzewo decyzji, wybierz → zejdź → cofnij):
 * teraz większość gałęzi to ślepe zaułki, które trzeba jak najwcześniej rozpoznać i porzucić.
 *
 *     node pdf-src/build-prezentacja-rekurencja-5.js --pdf
 */
const L = require('./prezentacja_lib');
const { code, c, P, stack, cols, note, warn, good, big, steps, traps, table, card, cards, kv, term, stos, trace, arr, tree, T, board } = L;
const D = L.deck();
const { sec, slide } = D;

const SECS = [
    ['01', 'Czym jest backtracking?'],
    ['02', 'Hetmany: zasady'],
    ['03', 'Hetmany krok po kroku'],
    ['04', 'Hetmany: kod'],
    ['05', 'Labirynt'],
    ['06', 'Szczur w labiryncie'],
    ['07', 'Sudoku'],
    ['08', 'Kolorowanie mapy'],
    ['09', 'Podział na palindromy'],
    ['10', 'Wykreślanka'],
    ['11', 'Obcinanie gałęzi'],
    ['12', 'Sprawdź się'],
    ['13', 'Podsumowanie'],
];

// plansza hetmanów: kol[w] = kolumna hetmana w wierszu w (−1 = brak); cur = [w, k] — sprawdzane pole; hit — pola bite przez hetmany
function queens(n, kol, o = {}) {
    const attacked = (i, j) => kol.some((k, w) => k >= 0 && w !== i && (k === j || Math.abs(k - j) === Math.abs(w - i)));
    return board(Array.from({ length: n }, () => Array(n).fill('')), {
        cw: o.cw ?? 56,
        show: (i, j) => (kol[i] === j ? 'H' : o.mark && o.mark[`${i},${j}`] ? o.mark[`${i},${j}`] : ''),
        cls: (i, j) => {
            if (kol[i] === j) return 'q';
            if (o.cur && o.cur[0] === i && o.cur[1] === j) return 'cur' + (attacked(i, j) ? ' bad' : ' ok');
            if (o.hitRow != null && i === o.hitRow && attacked(i, j)) return 'hit';
            if (o.allHits && attacked(i, j)) return 'hit';
            return '';
        },
    });
}

// mały graf (SVG): pos — {v: [x, y]}, edges — [[u, v]], col — {v: kolor}
function graph(pos, edges, col = {}, o = {}) {
    const W = o.w ?? 360, H = o.h ?? 240, R = 24;
    const palette = { 1: '#00e5c7', 2: '#ffb454', 3: '#7c5cff', 4: '#d55181' };
    const e = edges.map(([u, v]) => `<line x1="${pos[u][0]}" y1="${pos[u][1]}" x2="${pos[v][0]}" y2="${pos[v][1]}" stroke="#4a4a60" stroke-width="3"/>`).join('');
    const n = Object.entries(pos).map(([v, [x, y]]) => {
        const cc = col[v] ? palette[col[v]] : null;
        return `<circle cx="${x}" cy="${y}" r="${R}" fill="${cc ? cc + '33' : '#11111a'}" stroke="${cc || '#5c5c74'}" stroke-width="3"/>`
            + `<text x="${x}" y="${y + 7}" text-anchor="middle" font-family="JetBrains Mono" font-weight="700" font-size="20" fill="${cc || '#e8e8f0'}">${v}</text>`;
    }).join('');
    return `<div class="treebox"><svg viewBox="0 0 ${W} ${H}" style="width:min(100%, ${W}px)" xmlns="http://www.w3.org/2000/svg">${e}${n}</svg></div>`;
}

// ================================================================ 01
sec('01');
slide('Backtracking — próbuj i wycofuj się', cols([
    stack([
        P('Idziesz przez labirynt z kredą. Na każdym skrzyżowaniu wybierasz jedną drogę i zaznaczasz ją kredą. Gdy trafisz na <b>ślepy zaułek</b>, wracasz do ostatniego skrzyżowania i próbujesz <b>innej</b> drogi.'),
        big('Tak działa <em>backtracking</em>: próbuj, a gdy się nie da — <strong>wycofaj się</strong> i spróbuj inaczej.'),
    ]),
    cards([
        card('wybierz', 'jeden z możliwych ruchów', 'tlc'),
        card('sprawdź', 'czy ruch w ogóle jest dozwolony', 'puc'),
        card('zejdź', 'rekurencyjnie szukaj dalej', 'puc'),
        card('cofnij', 'po powrocie przywróć stan sprzed ruchu', 'orc'),
    ], 2),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Schemat backtrackingu', cols([
    code(`
        void szukaj(stan) {
            if (stan jest rozwiązaniem) {
                zapisz / wypisz / policz;
                return;
            }
            for (każdy możliwy ruch) {
                if (ruch jest niedozwolony) continue;
                wykonaj ruch;
                szukaj(nowy stan);
                cofnij ruch;
            }
        }`, { size: 'sm', hl: [7, 8, 9, 10] }),
    stack([
        P('To ten sam schemat <b>wybierz → zejdź → cofnij</b> co w części 4. Różnica: w części 4 prawie każda gałąź dawała wynik (każdy ciąg, każdy podzbiór). Tutaj <b>większość gałęzi to ślepe zaułki</b>.'),
        good('Klucz do szybkiego backtrackingu: sprawdzać „czy ruch jest dozwolony” <b>jak najwcześniej</b> — zanim zejdziemy głębiej.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 02
sec('02');
slide('Kogo bije hetman?', cols([
    queens(6, [-1, -1, 2, -1, -1, -1], { allHits: true, cw: 54 }),
    stack([
        P('Hetman (królowa) w szachach bije wszystkie pola w swoim <b>wierszu</b>, w swojej <b>kolumnie</b> i na obu swoich <b>przekątnych</b> — na dowolną odległość.'),
        note('Na planszy obok hetman stoi w wierszu 2, kolumnie 2 (liczymy od 0). Pomarańczowe pola są przez niego bite.'),
    ]),
], { t: '0.95fr 1.05fr', align: 'center' }));

slide('Problem n hetmanów', cols([
    stack([
        P('Ustaw <b>n</b> hetmanów na szachownicy <b>n × n</b> tak, żeby żadne dwa się nie biły. Ile jest takich ustawień? Jak wygląda pierwsze z nich?'),
        steps(['W każdym wierszu musi stać <b>dokładnie jeden</b> hetman (dwa w jednym wierszu by się biły).', 'Więc decyzja dla wiersza w to: <b>w której kolumnie</b> postawić hetmana?', 'Zapamiętamy to w tablicy <b>kol[w]</b>.'], 'tight'),
    ]),
    stack([
        queens(4, [1, 3, 0, 2], { cw: 60 }),
        P('Jedno z dwóch ustawień dla n = 4: <b>kol = {1, 3, 0, 2}</b>.', 'muted'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

// ================================================================ 03
sec('03');
const qSlide = (title, kol, cur, info, hitRow) => slide(title, cols([
    queens(4, kol, { cur, hitRow: hitRow ?? (cur ? cur[0] : null), cw: 84 }),
    stack([P(info), kv([['kol', `{${kol.map((k) => (k < 0 ? '·' : k)).join(', ')}}`]])]),
], { t: '0.85fr 1.15fr', align: 'center' }));

qSlide('Wiersz 0: hetman w kolumnie 0', [0, -1, -1, -1], null, 'Zaczynamy od pierwszej możliwości: wiersz 0, kolumna 0. Nic jeszcze nie stoi na planszy, więc to pole jest bezpieczne.');
qSlide('Wiersz 1: kolumny 0 i 1 są bite, 2 jest wolna', [0, 2, -1, -1], [1, 2], 'W wierszu 1 próbujemy kolumn od lewej: kolumnę 0 bije hetman z góry (ta sama kolumna), kolumnę 1 — po przekątnej. Kolumna 2 jest wolna — <b>stawiamy</b>.', 1);
qSlide('Wiersz 2: wszystko bite — ślepy zaułek!', [0, 2, -1, -1], null, 'W wierszu 2 <b>każda</b> kolumna jest bita: 0 i 2 — przez kolumny, 1 i 3 — przez przekątne hetmana z wiersza 1. Nie ma gdzie postawić hetmana. <b>Wycofujemy się</b> do wiersza 1.', 2);
qSlide('Powrót do wiersza 1: próbujemy kolumny 3', [0, 3, -1, -1], [1, 3], 'Cofamy hetmana z kolumny 2 (kol[1] znów pusta) i próbujemy następnej kolumny: 3. Jest wolna — stawiamy i schodzimy do wiersza 2.', 1);
qSlide('Wiersz 2: kolumna 1', [0, 3, 1, -1], [2, 1], 'W wierszu 2 kolumna 0 jest bita, ale kolumna 1 — wolna. Stawiamy i schodzimy do wiersza 3.', 2);
qSlide('Wiersz 3: znowu ślepy zaułek', [0, 3, 1, -1], null, 'W wierszu 3 wszystkie kolumny są bite. Wycofujemy się do wiersza 2 — ale tam kolumny 2 i 3 też są bite. Wracamy do wiersza 1 — nie ma już kolumn do sprawdzenia. Wracamy aż do <b>wiersza 0</b>.', 3);
qSlide('Wiersz 0: kolumna 1', [1, -1, -1, -1], null, 'Hetman w rogu (kolumna 0) nie prowadzi do żadnego rozwiązania — sprawdziliśmy całe jego poddrzewo. Przesuwamy go na kolumnę 1 i zaczynamy od nowa niżej.');
qSlide('Wiersze 1, 2, 3: wszystko pasuje!', [1, 3, 0, 2], null, 'Wiersz 1 → kolumna 3, wiersz 2 → kolumna 0, wiersz 3 → kolumna 2. Wszystkie cztery hetmany stoją i żaden nikogo nie bije — <b>rozwiązanie</b>!');

const qTree = T('start', [
    { ...T('0', [{ ...T('0,2', [], { s: 'cut' }), e: 'k=2' }, { ...T('0,3', [{ ...T('0,3,1', [], { s: 'cut' }), e: 'k=1' }]), e: 'k=3' }]), e: 'k=0' },
    { ...T('1', [{ ...T('1,3', [{ ...T('1,3,0', [{ ...T('1,3,0,2', [], { s: 'ok' }), e: 'k=2' }]), e: 'k=0' }]), e: 'k=3' }]), e: 'k=1' },
    { ...T('2', [], { s: 'ghost' }), e: 'k=2' }, { ...T('3', [], { s: 'ghost' }), e: 'k=3' },
]);
slide('Całe szukanie jako drzewo', cols([
    tree(qTree, { fs: 17, dy: 80, gap: 10 }),
    stack([
        P('Węzeł to ustawienie kilku pierwszych wierszy (kol). Wyblakłe węzły z przerywaną ramką to <b>ślepe zaułki</b> — tam w kolejnym wierszu nie było wolnej kolumny.'),
        note('Gałęzie zaczynające się od 2 i 3 dają drugie rozwiązanie {2, 0, 3, 1} — lustrzane odbicie pierwszego.'),
    ]),
], { t: '1.35fr 1fr', align: 'center' }));

// ================================================================ 04
sec('04');
slide('Czy pole jest bezpieczne?', cols([
    code(`
        int n, kol[20];

        bool bezpieczny(int w, int k) {
            for (int i = 0; i < w; i++) {
                if (kol[i] == k) return false;
                if (abs(kol[i] - k) == w - i) return false;
            }
            return true;
        }`, { size: 'sm', hl: [5, 6] }),
    stack([
        P('Hetman w polu (w, k) jest bezpieczny, jeśli żaden hetman z wcześniejszych wierszy i = 0, …, w − 1 go nie bije:'),
        steps([`ta sama kolumna: ${c('kol[i] == k')},`, `ta sama przekątna: odległość w poziomie równa odległości w pionie — ${c('abs(kol[i] - k) == w - i')}.`], 'tight'),
        note('Wierszy sprawdzać nie trzeba — z budowy rozwiązania każdy hetman stoi w innym wierszu.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Hetmany — liczymy wszystkie ustawienia', cols([
    code(`
        int licznik = 0;

        void ustaw(int w) {
            if (w == n) {
                licznik++;
                return;
            }
            for (int k = 0; k < n; k++) {
                if (!bezpieczny(w, k)) continue;
                kol[w] = k;
                ustaw(w + 1);
            }
        }`, { size: 'sm' }),
    stack([
        P(`Gdy ${c('w == n')}, hetmany stoją we wszystkich wierszach — mamy rozwiązanie.`),
        P(`Cofanie jest tu „ukryte”: ${c('kol[w]')} zostanie po prostu <b>nadpisane</b> przy następnej kolumnie, a wiersze poniżej w i tak sprawdzamy tylko do w − 1. Dlatego nie trzeba nic czyścić.`),
        table(['n', '4', '5', '6', '7', '8', '9', '10'], [['ustawień', '2', '10', '4', '40', '92', '352', '724']], { cls: 'mid ctr' }),
    ]),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Pierwsze ustawienie — i koniec szukania', cols([
    code(`
        bool ustaw(int w) {
            if (w == n) return true;
            for (int k = 0; k < n; k++) {
                if (!bezpieczny(w, k)) continue;
                kol[w] = k;
                if (ustaw(w + 1)) return true;
            }
            return false;
        }`, { size: 'sm', hl: [6] }),
    stack([
        P('Wzorzec „znajdź jedno” z części 4: gdy głębsze wywołanie zwróci <b>true</b>, przekazujemy true w górę i <b>nie próbujemy</b> już kolejnych kolumn.'),
        queens(6, [1, 3, 5, 0, 2, 4], { cw: 40 }),
        P('Pierwsze znalezione ustawienie dla n = 6.', 'muted'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Ile pracy oszczędza backtracking?', cols([
    table(['sposób', 'ile ustawień sprawdzamy (n = 8)'], [
        ['dowolne 8 pól z 64', 'ok. 4,4 miliarda'],
        ['po jednym hetmanie w wierszu, bez sprawdzania', '8⁸ ≈ 16,7 miliona'],
        ['backtracking (sprawdzamy od razu)', '<b class="yes">ok. 2 tysiące węzłów</b>'],
    ], { widths: ['55%', '45%'] }),
    good('Każdy ślepy zaułek odcina <b>całe poddrzewo</b>. Gdy hetman w wierszu 2 jest bity, nie ustawiamy już wierszy 3, 4, …, 7 — ani razu.'),
], { t: '1.3fr 1fr', align: 'center' }));

// ================================================================ 05
sec('05');
const MAZE = ['....', '.##.', '...#', '#...'];
slide('Ile dróg przez labirynt?', cols([
    board(MAZE, { cw: 62, show: () => '', cls: (i, j, v) => (v === '#' ? 'x' : i === 0 && j === 0 ? 'q' : i === 3 && j === 3 ? 'ok' : '') }),
    stack([
        P('Idziemy z lewego górnego rogu do prawego dolnego: w górę, w dół, w lewo, w prawo, <b>bez ścian</b> i <b>bez odwiedzania pola dwa razy</b>. Ile jest dróg?'),
        warn('Tym razem wolno chodzić we wszystkie strony, więc memoizacja z części 3 nie zadziała: liczba dróg z pola zależy od tego, <b>które pola są już zajęte</b>.'),
    ]),
], { t: '0.8fr 1.2fr', align: 'center' }));

slide('Labirynt — kod', cols([
    code(`
        bool odw[6][6];
        long long licznik = 0;

        void idz(int i, int j) {
            if (i < 0 || j < 0 || i >= n || j >= m) return;
            if (g[i][j] == '#' || odw[i][j]) return;
            if (i == n - 1 && j == m - 1) {
                licznik++;
                return;
            }
            odw[i][j] = true;
            idz(i + 1, j); idz(i - 1, j);
            idz(i, j + 1); idz(i, j - 1);
            odw[i][j] = false;
        }`, { size: 'xs', hl: [11, 14] }),
    stack([
        steps(['poza planszą, ściana albo pole już na drodze — <b>ślepy zaułek</b>,', 'meta — <b>jeszcze jedna droga</b>,', '<b>zaznacz</b> pole, idź w cztery strony, <b>odznacz</b> pole.'], 'tight'),
        note('Odznaczenie to cofnięcie wyboru: inne drogi mogą to pole odwiedzić — po swojemu.'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

slide('Droga w trakcie szukania', cols([
    board(MAZE, { cw: 62, show: () => '', cls: (i, j, v) => (v === '#' ? 'x' : i === 1 && j === 3 ? 'path cur' : ['0,0', '0,1', '0,2', '0,3'].includes(`${i},${j}`) ? 'path' : '') }),
    stack([
        P('Fioletowe pola są <b>zaznaczone</b> (odw = true) — leżą na obecnej drodze i na stosie. Z pola (1, 3) w dół jest ściana (2, 3), w lewo — ściana (1, 2). W górę — pole już odwiedzone.'),
        P('Ślepy zaułek: funkcja dla (1, 3) kończy się, <b>odznacza</b> pole i wraca do (0, 3), które próbuje kolejnych kierunków.'),
    ]),
], { t: '0.8fr 1.2fr', align: 'center' }));

// ================================================================ 06
sec('06');
slide('Szczur w labiryncie — wypisz drogi', cols([
    stack([
        board([[1, 0, 0, 0], [1, 1, 0, 1], [1, 1, 0, 0], [0, 1, 1, 1]], { cw: 56, show: () => '', cls: (i, j, v) => (v === 0 ? 'x' : ['0,0', '1,0', '2,0', '2,1', '3,1', '3,2', '3,3'].includes(`${i},${j}`) ? 'path' : '') }),
        term('DDRDRR\nDRDDRR', { cap: 'wszystkie drogi (alfabetycznie)' }),
    ]),
    stack([
        P('Zadanie Strivera (L19): 1 — wolne, 0 — ściana. Drogi zapisujemy literami <b>D</b> (dół), <b>L</b> (lewo), <b>R</b> (prawo), <b>U</b> (góra) i wypisujemy <b>alfabetycznie</b>.'),
        code(`
            const int di[4] = {1, 0, 0, -1};
            const int dj[4] = {0, -1, 1, 0};
            const string lit = "DLRU";`, { size: 'xs' }),
        note('Jeśli w każdym polu próbujemy kierunków w kolejności <b>D, L, R, U</b>, drogi wychodzą od razu posortowane — bez sortowania na końcu.'),
    ]),
], { t: '0.9fr 1.1fr', align: 'center' }));

slide('Szczur — kod', code(`
    void szukaj(int i, int j, string droga) {
        if (i == n - 1 && j == n - 1) { cout << droga << endl; return; }
        odw[i][j] = true;
        for (int d = 0; d < 4; d++) {
            int a = i + di[d], b = j + dj[d];
            if (a < 0 || b < 0 || a >= n || b >= n) continue;
            if (g[a][b] == 0 || odw[a][b]) continue;
            szukaj(a, b, droga + lit[d]);
        }
        odw[i][j] = false;
    }`, { size: 'sm' }), note(`Droga jest <b>parametrem</b> (${c('droga + lit[d]')} tworzy nowy napis), więc jej nie trzeba cofać. Tablicę <b>odw</b> — wspólną — trzeba.`));

// ================================================================ 07
sec('07');
const SUD = ['53..7....', '6..195...', '.98....6.', '8...6...3', '4..8.3..1', '7...2...6', '.6....28.', '...419..5', '....8..79'];
const SUDS = ['534678912', '672195348', '198342567', '859761423', '426853791', '713924856', '961537284', '287419635', '345286179'];
slide('Sudoku', cols([
    board(SUD.map((r) => r.replace(/\./g, ' ')), { cw: 42, sudoku: true, cls: (i, j) => ((Math.floor(i / 3) + Math.floor(j / 3)) % 2 ? 'alt' : '') }),
    stack([
        P('Wypełnij puste pola cyframi 1–9 tak, żeby w każdym <b>wierszu</b>, każdej <b>kolumnie</b> i każdym <b>kwadracie 3 × 3</b> każda cyfra była dokładnie raz.'),
        steps(['idź po polach od lewej do prawej, wiersz po wierszu,', 'na puste pole próbuj cyfr 1, 2, …, 9 — tylko takich, które <b>pasują</b>,', 'dla każdej pasującej schodź do następnego pola,', 'gdy nic nie pasuje — <b>wycofaj się</b> i zmień cyfrę wcześniej.'], 'tight'),
    ]),
], { t: '0.9fr 1.1fr', align: 'center' }));

slide('Czy cyfra pasuje?', cols([
    code(`
        int g[9][9];

        bool pasuje(int w, int k, int d) {
            for (int i = 0; i < 9; i++) {
                if (g[w][i] == d) return false;   // wiersz
                if (g[i][k] == d) return false;   // kolumna
            }
            int bw = w - w % 3, bk = k - k % 3;   // róg kwadratu
            for (int a = 0; a < 3; a++)
                for (int b = 0; b < 3; b++)
                    if (g[bw + a][bk + b] == d) return false;
            return true;
        }`, { size: 'xs' }),
    stack([
        P(`Lewy górny róg kwadratu 3 × 3, w którym leży pole (w, k), to (${c('w - w % 3')}, ${c('k - k % 3')}).`),
        table(['pole', 'róg kwadratu'], [['(4, 7)', '(3, 6)'], ['(0, 2)', '(0, 0)'], ['(8, 5)', '(6, 3)']], { cls: 'mid ctr' }),
    ]),
], { t: '1.2fr 1fr', align: 'center' }));

slide('Sudoku — rozwiązywanie', cols([
    code(`
        bool rozwiaz(int p) {          // p = 0 … 80
            if (p == 81) return true;
            int w = p / 9, k = p % 9;
            if (g[w][k] != 0) return rozwiaz(p + 1);
            for (int d = 1; d <= 9; d++) {
                if (!pasuje(w, k, d)) continue;
                g[w][k] = d;
                if (rozwiaz(p + 1)) return true;
                g[w][k] = 0;
            }
            return false;
        }`, { size: 'xs', hl: [8, 9] }),
    stack([
        P('Pola numerujemy od 0 do 80: wiersz to p / 9, kolumna p % 9. Pole już wypełnione przeskakujemy.'),
        note(`Gdy rozwiązanie się znajdzie, ${c('true')} wraca w górę przez wszystkie wywołania i plansza zostaje <b>wypełniona</b>. Gdy cyfra prowadzi w ślepy zaułek — ${c('g[w][k] = 0')} czyści pole przed następną próbą.`),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

slide('Rozwiązane sudoku', cols([
    board(SUDS, { cw: 42, sudoku: true, cls: (i, j) => (SUD[i][j] === '.' ? 'new' : '') + ((Math.floor(i / 3) + Math.floor(j / 3)) % 2 ? ' alt' : '') }),
    stack([
        P('Turkusowe cyfry wstawił backtracking. Dla typowego sudoku z gazety wystarczy kilka tysięcy wywołań — bo prawie każda zła cyfra „wysypuje się” po kilku polach.'),
        note('Ten sam schemat rozwiązuje wiele łamigłówek: krzyżówki liczbowe, kakuro, ułożenie klocków…'),
    ]),
], { t: '0.9fr 1.1fr', align: 'center' }));

// ================================================================ 08
sec('08');
const GP = { 1: [60, 60], 2: [200, 40], 3: [320, 120], 4: [200, 200], 5: [70, 190] };
const GE = [[1, 2], [2, 3], [3, 4], [4, 5], [5, 1], [2, 4]];
slide('Kolorowanie mapy', cols([
    graph(GP, GE, { 1: 1, 2: 2, 3: 1, 4: 3, 5: 2 }),
    stack([
        P('Państwa to kółka, kreska oznacza, że dwa państwa <b>sąsiadują</b>. Pomaluj każde państwo jednym z k kolorów tak, żeby sąsiedzi mieli <b>różne</b> kolory. Na ile sposobów?'),
        P('Koloruj państwa po kolei: państwu v nadaj kolor, którego nie ma <b>żaden już pokolorowany sąsiad</b>, i przejdź do v + 1.'),
        note('U Strivera: L16 — <i>M-Coloring Problem</i>.'),
    ]),
], { t: '0.9fr 1.1fr', align: 'center' }));

slide('Kolorowanie — kod', cols([
    code(`
        vector<int> sas[11];
        int kolor[11];          // 0 = jeszcze bez koloru
        long long licznik = 0;

        void koloruj(int v) {
            if (v > n) { licznik++; return; }
            for (int c = 1; c <= k; c++) {
                bool wolny = true;
                for (int u : sas[v])
                    if (kolor[u] == c) wolny = false;
                if (!wolny) continue;
                kolor[v] = c;
                koloruj(v + 1);
                kolor[v] = 0;
            }
        }`, { size: 'xs' }),
    stack([
        graph(GP, GE, { 1: 1, 2: 2, 3: 1 }, { w: 360, h: 240 }),
        P('W trakcie: państwa 1, 2, 3 pokolorowane. Państwo 4 sąsiaduje z 2 i 3, więc może dostać tylko kolor, którego nie mają one.', 'muted'),
    ]),
], { t: '1.15fr 1fr', align: 'center' }));

// ================================================================ 09
sec('09');
const palTree = T('aab', [
    { ...T('a | ab', [{ ...T('a a | b', [{ ...T('a a b', [], { s: 'ok' }), e: 'b' }]), e: 'a' }, { ...T('a ab?', [], { s: 'cut' }), e: 'ab' }]), e: 'a' },
    { ...T('aa | b', [{ ...T('aa b', [], { s: 'ok' }), e: 'b' }]), e: 'aa' },
    { ...T('aab?', [], { s: 'cut' }), e: 'aab' },
]);
slide('Podział na palindromy', cols([
    stack([
        P('Potnij słowo na kawałki tak, żeby <b>każdy kawałek był palindromem</b>. Wypisz wszystkie sposoby. Dla „aab”: <b>a a b</b> oraz <b>aa b</b>.'),
        P('Funkcja tnij(i) wybiera <b>pierwszy kawałek</b> zaczynający się na pozycji i: najpierw najkrótszy, potem coraz dłuższe. Kawałek, który nie jest palindromem, to ślepy zaułek.'),
    ]),
    tree(palTree, { fs: 16, dy: 80 }),
], { t: '1fr 1.1fr', align: 'center' }));

slide('Podział na palindromy — kod', cols([
    code(`
        void tnij(int i) {
            if (i == n) { wypisz(kawalki); return; }
            for (int j = i; j < n; j++) {
                if (!palindrom(i, j)) continue;
                kawalki.push_back(s.substr(i, j - i + 1));
                tnij(j + 1);
                kawalki.pop_back();
            }
        }`, { size: 'sm' }),
    stack([
        P(`${c('palindrom(i, j)')} sprawdza kawałek od i do j — możesz użyć rekurencyjnej funkcji z części 2.`),
        term('k a j a k\nk aja k\nkajak', { cap: 'słowo „kajak”' }),
        note('U Strivera: L17 — <i>Palindrome Partitioning</i>.'),
    ]),
], { t: '1.1fr 1fr', align: 'center' }));

// ================================================================ 10
sec('10');
const WS = ['abce', 'sfcs', 'adee'];
slide('Wykreślanka', cols([
    board(WS, { cw: 58, cls: (i, j) => (['0,0', '0,1', '0,2', '1,2', '2,2', '2,1'].includes(`${i},${j}`) ? 'path' : '') }),
    stack([
        P('Słowo jest ukryte, jeśli da się je przeczytać, idąc po <b>sąsiednich polach</b> (góra, dół, lewo, prawo), każde pole najwyżej raz. „abcced” jest ukryte (fioletowa droga).'),
        code(`
            bool szukaj(int i, int j, int k) {
                if (poza planszą || uzyte[i][j]) return false;
                if (g[i][j] != w[k]) return false;
                if (k == w.size() - 1) return true;
                uzyte[i][j] = true;
                bool ok = szukaj(i + 1, j, k + 1) || szukaj(i - 1, j, k + 1)
                       || szukaj(i, j + 1, k + 1) || szukaj(i, j - 1, k + 1);
                uzyte[i][j] = false;
                return ok;
            }`, { size: 'xs' }),
    ]),
], { t: '0.75fr 1.25fr', align: 'center' }), note(`Operator ${c('||')} sam przerywa sprawdzanie przy pierwszym <b>true</b> — kolejne kierunki nie są już próbowane.`));

// ================================================================ 11
sec('11');
slide('Obcinanie gałęzi — im wcześniej, tym lepiej', stack([
    big('Gdy wiesz, że z danego miejsca <em>nie da się</em> dojść do rozwiązania — <strong>nie schodź</strong> głębiej.'),
    table(['Zadanie', 'Obcinamy, gdy…'], [
        ['hetmany', 'nowy hetman jest bity — nie ustawiamy dalszych wierszy'],
        ['plecak', 'waga przekroczyła pojemność — dokładanie nic nie pomoże'],
        ['liczby o sumie cyfr s', 'suma już większa od s albo nawet same dziewiątki nie dobiją do s'],
        ['suma podzbioru (liczby dodatnie)', 'uzbierana suma przekroczyła cel'],
    ], { widths: ['34%', '66%'] }),
], { gap: 20 }));

slide('Przykład: liczby o danej sumie cyfr', cols([
    code(`
        void buduj(int i, int suma, string liczba) {
            if (suma > s) return;                  // za dużo
            if (suma + 9 * (n - i) < s) return;    // za mało
            if (i == n) { cout << liczba << endl; return; }
            for (int d = (i == 0 ? 1 : 0); d <= 9; d++)
                buduj(i + 1, suma + d, liczba + char('0' + d));
        }`, { size: 'xs', hl: [2, 3] }),
    stack([
        P('Wszystkie n-cyfrowe liczby o sumie cyfr s. Dwa warunki obcinają gałęzie, które na pewno nie dadzą wyniku:'),
        steps(['suma już <b>przekroczyła</b> s,', 'nawet same <b>dziewiątki</b> na pozostałych n − i pozycjach nie wystarczą.'], 'tight'),
        term('101\n110\n200', { cap: 'n = 3, s = 2' }),
    ]),
], { t: '1.2fr 1fr', align: 'center' }));

slide('Przykład: plecak — sprawdź wszystko, ale mądrze', cols([
    code(`
        void pakuj(int i, long long waga, long long wartosc) {
            if (waga > W) return;           // obcinanie
            if (i == n) {
                najlepsza = max(najlepsza, wartosc);
                return;
            }
            pakuj(i + 1, waga, wartosc);
            pakuj(i + 1, waga + w[i], wartosc + v[i]);
        }`, { size: 'xs' }),
    stack([
        P('Bierz / nie bierz z części 4 + zapamiętywanie <b>najlepszego</b> wyniku. Dla n ≤ 20 to najwyżej ok. 2 miliony wywołań.'),
        note('Gdy wag jest dużo i są małe, plecak rozwiązuje się <b>programowaniem dynamicznym</b> — w kompendium temat „Plecak 0-1”. Backtracking wygrywa, gdy przedmiotów jest mało, a wagi są ogromne.'),
    ]),
], { t: '1.2fr 1fr', align: 'center' }));

// ================================================================ 12
sec('12');
const quiz = (n, title, body) => slide(`Pytanie ${n}: ${title}`, body, P('Zastanów się i zapisz odpowiedź, <b>zanim</b> przejdziesz dalej.', 'muted cen'));
quiz(1, 'ile ustawień ma 4 hetmanów?', cols([queens(4, [-1, -1, -1, -1], { cw: 60 }), term('?')], { t: '0.6fr 1fr', align: 'center' }));
slide('Odpowiedź 1: dwa ustawienia', cols([queens(4, [1, 3, 0, 2], { cw: 60 }), queens(4, [2, 0, 3, 1], { cw: 60 })], { gap: 40 }), note('{1, 3, 0, 2} i {2, 0, 3, 1} — jedno jest lustrzanym odbiciem drugiego.'));

quiz(2, 'co się stanie bez odznaczania?', cols([code(`
    void idz(int i, int j) {
        if (poza || g[i][j] == '#' || odw[i][j]) return;
        if (meta) { licznik++; return; }
        odw[i][j] = true;
        idz(i + 1, j); idz(i - 1, j);
        idz(i, j + 1); idz(i, j - 1);
        // brak: odw[i][j] = false;
    }`, { size: 'sm' }), term('?')], { t: '1.4fr 1fr', align: 'center' }));
slide('Odpowiedź 2: znajdzie za mało dróg', cols([
    warn('Pole odwiedzone przez <b>jedną</b> drogę zostaje zablokowane dla <b>wszystkich następnych</b>. Program policzy tylko część dróg — zwykle jedną albo dwie — choć nie zgłosi żadnego błędu.'),
    good('Każde zaznaczenie wspólnego stanu musi mieć swoje <b>odznaczenie</b> po powrocie — tak samo jak push_back i pop_back w części 4.'),
], { gap: 30, align: 'center' }));

quiz(3, 'czy hetman (3, 1) jest bezpieczny?', cols([queens(4, [0, 3, -1, -1], { cw: 60, cur: [3, 1] }), stack([P('Hetmany stoją w (0, 0) i (1, 3). Sprawdzamy pole (3, 1).'), term('?')])], { t: '0.7fr 1fr', align: 'center' }));
slide('Odpowiedź 3: nie — przekątna z (1, 3)', cols([
    table(['hetman', 'ta sama kolumna?', '|Δ kolumn| == Δ wierszy?'], [['(0, 0)', '0 ≠ 1', '|0 − 1| = 1, 3 − 0 = 3 → nie'], ['(1, 3)', '3 ≠ 1', '|3 − 1| = <b>2</b>, 3 − 1 = <b>2</b> → <b class="no">tak!</b>']], { widths: ['18%', '30%', '52%'], cls: 'mid' }),
    queens(4, [0, 3, -1, -1], { cw: 52, cur: [3, 1], allHits: true }),
], { t: '1.4fr 1fr', align: 'center' }));

// ================================================================ 13
sec('13');
slide('Ściąga: backtracking', table(['Element', 'W kodzie', 'Pamiętaj'], [
    ['stan', 'tablice kol[], odw[][], g[][], kolor[], wektor wybranych', 'wspólny dla wszystkich wywołań'],
    ['ruch dozwolony?', `${c('if (!bezpieczny(...)) continue;')}`, 'sprawdzaj przed zejściem'],
    ['wybierz → zejdź → cofnij', `${c('odw = true; idz(...); odw = false;')}`, 'każda zmiana stanu → odwróć'],
    ['znajdź jedno', `${c('if (szukaj(...)) return true;')}`, 'true kończy całe szukanie'],
    ['policz / wypisz wszystkie', 'licznik++ albo cout w liściu', 'przejdzie całe (obcięte) drzewo'],
    ['obcinanie', 'return, gdy rozwiązania już się nie da dokończyć', 'im wcześniej, tym szybciej'],
], { widths: ['24%', '46%', '30%'], cls: 'mid' }));

slide('Zadania na koniec — Twoja kolej', stack([
    P('Zadania są na <b>t-olimpians.com → Kompendium → Funkcje rekurencyjne → Krok 5</b>. Każde ma sprawdzarkę i wskazówkę:'),
    `<div class="cols" style="grid-template-columns:1fr 1fr;gap:20px">${[
        steps(['Hetmany — ile ustawień?', 'Hetmany — pierwsze ustawienie', 'Ile dróg przez labirynt?', 'Szczur w labiryncie', 'Sudoku', 'Kolorowanie mapy'], 'tight'),
        `<ol class="steps tight" style="counter-reset:s 6">${['Podział na palindromy', 'Liczby o danej sumie cyfr', 'Wykreślanka', 'Plecak — sprawdź wszystko', 'Sprawiedliwy podział'].map((x) => `<li>${x}</li>`).join('')}</ol>`,
    ].join('')}</div>`,
], { gap: 14 }));

D.build({
    html: 'pdf-src/prezentacja-rekurencja-5-backtracking.html',
    pdf: 'prezentacja-rekurencja-5-backtracking-t-olimpians.pdf',
    generator: 'pdf-src/build-prezentacja-rekurencja-5.js',
    title: 'Backtracking — T-Olimpians',
    brand: 'rekurencja · część 5',
    foot: 'Rekurencja, część 5 — backtracking',
    secs: SECS,
    cover: {
        kicker: '// T-OLIMPIANS — PREZENTACJA DO LEKCJI',
        h1: 'Backtracking<br>— szukanie z wycofywaniem',
        sub: 'Próbuj, sprawdzaj, wycofuj się: n hetmanów krok po kroku na planszy, labirynty, sudoku, kolorowanie mapy, podział na palindromy i wykreślanka. Ślepe zaułki rozpoznajemy jak najwcześniej i obcinamy całe gałęzie.',
        meta: 'C++ · REKURENCJA · CZĘŚĆ 5 Z 6 · PO CZĘŚCIACH 1–4',
        deco: queens(4, [1, 3, 0, 2], { cw: 28 }),
    },
    end: {
        kicker: '// KONIEC CZĘŚCI 5',
        h1: 'Ślepe zaułki<br>już Cię nie zatrzymają!',
        sub: 'Wybierz, sprawdź, zejdź, cofnij — i obcinaj gałęzie, które nie mogą dać rozwiązania. Zrób zadania z kroku 5, a potem część 6: dziel i zwyciężaj.',
        deco: queens(5, [0, 2, 4, 1, 3], { cw: 34 }),
    },
});
