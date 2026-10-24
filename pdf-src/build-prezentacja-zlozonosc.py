#!/usr/bin/env python3
"""Prezentacja „Złożoność czasowa — krok po kroku” (T-Olimpians, lekcja 17).

Generuje pdf-src/prezentacja-zlozonosc-czasowa.html — poziome slajdy 16:9 w stylu
ściągi Python Turtle — i (z flagą --pdf) drukuje je do
prezentacja-zlozonosc-czasowa-t-olimpians.pdf przez Playwright (Chromium).
Uczeń nie zna jeszcze żadnych algorytmów, więc przykłady to pętle i wzory
z poprzednich lekcji (tablice, vector, podtablice, podzbiory).

    python3 pdf-src/build-prezentacja-zlozonosc.py --pdf
"""
import math
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from prezentacja_lib import *  # noqa: E402,F401,F403

SECS = [
    ('01', 'Po co liczyć czas?'),
    ('02', 'Operacje i sekunda'),
    ('03', 'Liczymy operacje'),
    ('04', 'Notacja dużego O'),
    ('05', 'O(1) — czas stały'),
    ('06', 'O(n) — jedna pętla'),
    ('07', 'O(n²) i więcej pętli'),
    ('08', 'Logarytm'),
    ('09', 'O(log n)'),
    ('10', 'O(n log n)'),
    ('11', 'O(2ⁿ) i O(n!)'),
    ('12', 'Porównanie złożoności'),
    ('13', 'Jak liczyć złożoność?'),
    ('14', 'Limit czasu a n'),
    ('15', 'Brut i wzorcówka'),
    ('16', 'Sprawdź się i ściąga'),
]

# kolory złożoności — sprawdzone walidatorem palety (ciemne tło #11111a), stałe w całej prezentacji
C1, CLOG, CN, CNLOG, CN2 = '#3987e5', '#d95926', '#199e70', '#c98500', '#d55181'
log2 = lambda x: math.log2(x) if x > 0 else 0
OK = '<b class="st-ok">✓ zmieści się</b>'
BAD = '<b class="st-bad">✗ za wolno</b>'


def pw(k, a=None):
    """10 do potęgi k (z opcjonalnym mnożnikiem a)."""
    return (f'{a}·' if a else '') + f'10<sup>{k}</sup>'


def rows(*items):
    return '<div class="rows">' + ''.join(items) + '</div>'


def row(left, right, sub='', w=470):
    sub = f'<span class="rwn">{sub}</span>' if sub else ''
    return (f'<div class="rw" style="grid-template-columns:{w}px 1fr"><div>{left}{sub}</div>'
            f'<div>{right}</div></div>')


# ================================================================ 01
sec('01')
slide('Każde zadanie ma limit czasu', cols(
    card('Domino Fibonacciego',
         'XIX OIJ, zawody II stopnia · 1 marca 2025'
         + kv([('kod', 'fib'), ('limit czasu', '<b class="st-bad">1 s</b>'), ('limit pamięci', '<b>64 MB</b>')]),
         'orc'),
    stack(P('Na górze treści każdego zadania olimpijskiego są <b>limity</b>. Przykład z notatek: zadanie z Olimpiady '
            'Informatycznej Juniorów.'),
          steps(['<b>Limit czasu</b> — ile sekund może działać Twój program na jednym teście.',
                 '<b>Limit pamięci</b> — ile pamięci może zająć (tym zajmiemy się innym razem).',
                 'W <b>99% zadań</b> limit czasu to <b>1 sekunda</b> (z notatek).'], cls='tight')),
    t='1fr 1.15fr', align='center'))

slide('Jak sprawdzarka ocenia program?', stack(
    flow(('wejście (input)', 'n\na₀ a₁ … aₙ₋₁', 'in'), ('program', 'Twój kod', 'pr'), ('wyjście (output)', 'wynik', 'out')),
    steps(['Sprawdzarka uruchamia Twój program na wielu <b>testach</b> — małych i bardzo dużych.',
           'Do każdego testu podaje <b>wejście</b> i mierzy, <b>ile czasu</b> program liczy.',
           'Jeśli program liczy dłużej niż limit, test jest oblany: <b>„przekroczono limit czasu”</b> — '
           '0 punktów za ten test, nawet gdy wynik byłby dobry!']),
    note('Dlatego nie wystarczy, że program jest <b>poprawny</b>. Musi być też <b>wystarczająco szybki</b>.'), gap=18))

SUM_LOOP = '''
    long long n, suma = 0;
    cin >> n;
    for(long long i = 1; i <= n; i++){
        suma += i;
    }
    cout << suma << endl;'''
SUM_FORMULA = '''
    long long n;
    cin >> n;
    cout << n * (n + 1) / 2 << endl;'''
slide('Ten sam wynik, zupełnie inny czas', stack(
    P('Dwa programy liczą to samo: sumę <b>1 + 2 + 3 + … + n</b>.'),
    cols(code(SUM_LOOP, cap='program A — pętla', size='xs'),
         stack(code(SUM_FORMULA, cap='program B — wzór', size='xs'),
               P('Dla n = 100 oba wypisują <b>5050</b>.')), gap=24),
    table(['n', 'program A', 'program B'], [
        ['100', 'błyskawicznie', 'błyskawicznie'],
        [pw(9) + ' (miliard)', 'kilka sekund — ' + BAD, 'błyskawicznie — ' + OK]], cls='mid'),
    note('Oba dają ten sam wynik. Ale dla dużego n program A nie zmieści się w 1 sekundzie. Dziś nauczymy się '
         '<b>przewidywać</b> takie rzeczy — bez uruchamiania programu. To jest <b>złożoność czasowa</b>.'), gap=12))

# ================================================================ 02
sec('02')
slide('Co to jest operacja?', stack(
    P('Komputer wykonuje program krok po kroku. Jeden prosty krok to <b>operacja</b>. Przykłady:'),
    table(['Kod', 'Co robi', 'Ile operacji'], [
        [c('x = 5;'), 'przypisanie', '1'],
        [c('a + b'), 'dodawanie (też -, *, /, %)', '1'],
        [c('i < n'), 'porównanie', '1'],
        [c('i++'), 'zwiększenie o 1', '1'],
        [c('lista[i]'), 'odczyt z tablicy / vectora', '1'],
        [c('cin >> x;') + ' · ' + c('cout << x;'), 'wczytanie / wypisanie jednej liczby', 'ok. 1'],
    ], widths=['36%', '46%', '18%'], cls='mid'),
    note('Nie liczymy operacji <b>dokładnie</b> co do jednej — to niemożliwe i niepotrzebne. Wystarczy nam '
         '<b>przybliżenie</b>: czy to około tysiąc, milion, czy miliard operacji.')))

slide('Przypomnienie: potęgi dziesiątki', stack(
    P(f'Duże liczby zapisujemy jako potęgi dziesiątki. {pw("k")} to <b>jedynka i k zer</b>:'),
    table(['Zapis', 'Liczba', 'Słownie'], [
        [pw(1), '10', 'dziesięć'], [pw(3), '1 000', 'tysiąc'], [pw(5), '100 000', 'sto tysięcy'],
        [pw(6), '1 000 000', 'milion'], [pw(8), '100 000 000', 'sto milionów'], [pw(9), '1 000 000 000', 'miliard'],
        [pw(8, 5), '500 000 000', 'pięćset milionów'], [pw(18), '1 i 18 zer', 'trylion']],
          widths=['22%', '38%', '40%'], cls='mid'),
    note(f'Mnożenie potęg: dodajemy wykładniki. {pw(5)} · {pw(5)} = {pw(10)}, a {pw(3)} · {pw(3)} = {pw(6)}.')))

slide('Ile operacji w 1 sekundę?', stack(
    big(f'Komputer wykonuje około <em>{pw(8)}</em> prostych operacji na sekundę.'),
    P(f'Z notatek: maksymalnie ok. <b>{pw(8, 5)} = 500 000 000</b> operacji (procesor 2 GHz). Ale lepiej liczyć '
      'ostrożnie — operacje bywają wolniejsze, a sprawdzarka może być słabsza:'),
    table(['Liczba operacji', 'Czy zmieścimy się w 1 s?'], [
        [pw(6) + ' — milion', OK + ' — z ogromnym zapasem'],
        [pw(7) + ' — 10 milionów', OK + ' — na pewno (z notatek)'],
        [pw(8) + ' — 100 milionów', OK + ' — zwykle tak'],
        [pw(8, 5), '<b>granica</b> — ryzykownie'],
        [pw(9) + ' — miliard', BAD],
        [pw(10), BAD + ' — ok. 100 sekund']], widths=['40%', '60%'], cls='mid'), gap=14))

slide('Ile sekund zajmie program?', stack(
    P(f'Szybki szacunek: <b>liczba operacji ÷ {pw(8)}</b> ≈ liczba sekund.'),
    table(['Operacje', 'Czas', 'Werdykt'], [
        [pw(6), 'ok. 0,01 s', OK], [pw(8), 'ok. 1 s', OK + ' (na styk)'], [pw(9), 'ok. 10 s', BAD],
        [pw(10), 'ok. 100 s — prawie 2 minuty', BAD], [pw(12), 'ok. 3 godziny', BAD],
        [pw(18), 'ok. <b>300 lat</b>', BAD]], widths=['24%', '46%', '30%'], cls='big'),
    note('Różnica między „mieści się” a „liczyłby się latami” to często tylko <b>jedna pętla więcej</b>. '
         'Za chwilę zobaczymy dlaczego.')))

# ================================================================ 03
sec('03')
slide('Program bez pętli', cols(
    code('''
        int n;            // 1 operacja
        string napis;     // 1 operacja
        cin >> n;         // 1 operacja
        cout << n * 2;    // ok. 2 operacje''', cap='kod z notatek (z drobnym dopiskiem)', size='lg'),
    stack(table(['n', 'operacji'], [['10', 'ok. 5'], ['1 000', 'ok. 5'], [pw(9), 'ok. 5']], cls='mid'),
          note('Każda linijka wykona się <b>dokładnie raz</b>. Nieważne, czy n to 10, czy miliard — '
               'program robi zawsze <b>tyle samo</b> operacji.')),
    t='1.3fr 1fr', align='center'))

slide('Program z pętlą — schemat z notatek', stack(
    flow(('input', 'N', 'in'), ('program', 'for(int i = 0; i < n; i++){\n    cout << i << endl;\n}', 'pr'),
         ('output', '0\n1\n2\n⋮\nn-1', 'out')),
    steps(['Program wczytuje <b>n</b>.',
           f'Pętla wykonuje się <b>n razy</b> — dla i = 0, 1, 2, …, n-1.',
           f'W każdym obrocie jest jedno {c("cout")} — więc razem <b>n</b> wypisań.'], cls='tight'),
    note('Tutaj liczba operacji <b>zależy od n</b>. Im większe wejście, tym dłużej działa program.'), gap=16))

slide('Liczymy dla różnych n', stack(
    code('''
        for(int i = 0; i < n; i++){
            cout << i << endl;
        }''', size='sm'),
    table(['n', 'ile razy cout?', 'czas (÷ 10⁸)', 'werdykt'], [
        ['10', '10', 'nic', OK], ['1 000', '1 000', 'nic', OK], [pw(5), pw(5), '0,001 s', OK],
        [pw(8), pw(8), 'ok. 1 s', OK + ' (na styk)'], [pw(9), pw(9), 'ok. 10 s', BAD]],
          widths=['20%', '24%', '26%', '30%'], cls='mid'),
    good('n razy większe wejście → n razy więcej operacji. Liczba operacji rośnie <b>tak samo jak n</b>.',
         label='Wniosek:')))

slide('Dokładnie czy w przybliżeniu?', cols(
    stack(code('''
            for(int i = 0; i < n; i++){
                cout << i << endl;
            }''', size='lg'),
          table(['Część', 'Ile razy'], [
              [c('int i = 0'), '1'], [c('i < n'), 'n + 1'], [c('i++'), 'n'], [c('cout << i'), 'n']], cls='mid')),
    stack(P('Policzmy <b>dokładnie</b>: 1 + (n + 1) + n + n = <b>3n + 2</b> operacje.'),
          table(['n', '3n + 2', 'samo n'], [['10', '32', '10'], ['1 000', '3 002', '1 000'],
                                            [pw(6), 'ok. 3·10⁶', pw(6)]], cls='mid'),
          note('Obie kolumny rosną <b>tak samo</b>: gdy n rośnie 10 razy, obie rosną ok. 10 razy. Liczenie „3n + 2” '
               'zamiast „n” nic nie zmienia w ocenie, czy program zdąży. Dlatego upraszczamy.')),
    t='1fr 1.1fr'))

# ================================================================ 04
sec('04')
slide('Notacja dużego O', stack(
    big('<em>O( … )</em> mówi, <strong>jak szybko rośnie</strong> liczba operacji, gdy rośnie wejście.'),
    P('Z notatek: <b>notacja dużego O pozwala obliczyć, ile operacji maksymalnie wykona nasz program</b>, '
      'zależnie od danych wejściowych.'),
    cols(card('Jak czytać?', f'{c("O(n)")} czytamy „o od en”. W nawiasie piszemy przybliżoną liczbę operacji, '
                             'używając n — rozmiaru wejścia.', 'tlc'),
         card('Jak nazywać?', 'To, co jest w nawiasie, to <b>złożoność czasowa</b> programu. Np. „ten program ma '
                              'złożoność O(n)”.', 'puc'), gap=20), gap=18))

slide('Przykłady z notatek', stack(
    table(['Złożoność', 'n = 10', 'n = 1000'], [
        [c('O(1)'), 'ok. 1 operacja', 'ok. 1 operacja'],
        [c('O(n)'), 'ok. 10 operacji', 'ok. 1 000 operacji'],
        [c('O(n²)'), 'ok. 10² = 100 operacji', 'ok. 1000² = 1 000 000 operacji'],
    ], widths=['24%', '38%', '38%'], cls='big'),
    note('Wstawiamy n do wyrażenia w nawiasie i dostajemy przybliżoną liczbę operacji. Przy n = 1000 widać już ogromną '
         'różnicę: tysiąc kontra milion.')))

slide('Zasada 1: pomijamy stałe', stack(
    table(['Dokładnie', 'Zapisujemy', 'Dlaczego'], [
        ['3n + 2', c('O(n)'), 'mnożnik 3 i dodane 2 pomijamy'],
        ['5n', c('O(n)'), 'mnożnik 5 pomijamy'],
        ['n / 2', c('O(n)'), 'połowa n to wciąż „rzędu n”'],
        ['100', c('O(1)'), 'stała liczba — nie zależy od n'],
        ['2n² + 7', c('O(n²)'), 'mnożnik 2 i dodane 7 pomijamy']], widths=['24%', '22%', '54%'], cls='big'),
    note('Stałe nie zmieniają tego, <b>jak</b> rośnie liczba operacji. 3n i n tak samo rosną 10 razy, gdy n rośnie '
         '10 razy.')))

slide('Zasada 2: zostaje najszybciej rosnący składnik', stack(
    P('Gdy mamy sumę kilku części, np. <b>n² + n</b>, zostawiamy tylko tę, która rośnie najszybciej:'),
    table(['n', 'n²', 'n', 'n² + n', 'ile to n w sumie?'], [
        ['10', '100', '10', '110', 'ok. 9%'], ['1 000', '1 000 000', '1 000', '1 001 000', 'ok. 0,1%'],
        [pw(5), pw(10), pw(5), 'ok. ' + pw(10), 'prawie nic']], cls='mid'),
    good('n² + n → <b>O(n²)</b>. &nbsp; n² + 5n + 100 → <b>O(n²)</b>. &nbsp; n + 1000 → <b>O(n)</b>.', label='Czyli:')))

slide('Liczymy najgorszy przypadek', cols(
    stack(code('''
            // czy w vectorze jest liczba 7?
            int i = 0;
            while(i < n && lista[i] != 7){
                i++;
            }''', size='sm'),
          table(['Przypadek', 'Ile obrotów'], [['7 na początku', '0 — od razu'], ['7 w środku', 'ok. n / 2'],
                                               ['7 na końcu albo brak 7', '<b>n</b>']], cls='mid')),
    stack(P('Czasem program kończy wcześniej — zależy, jakie dostanie dane. Którą liczbę wpisujemy w O(…)?'),
          good('zawsze <b>najgorszy przypadek</b> — największą liczbę operacji, jaką program może wykonać. Tutaj: '
               '<b>O(n)</b>.', label='Odpowiedź:'),
          note('Z notatek: „w najgorszym przypadku będziemy robić…”. Sprawdzarka na pewno da test, w którym będzie '
               'najgorzej.')),
    t='1fr 1fr'))

slide('Złożoności z notatek — od najszybszej', stack(
    table(['Złożoność', 'Nazwa', 'Typowy kod', 'Rozdział'], [
        [c('O(1)'), 'stała', 'brak pętli zależnej od n', '05'],
        [c('O(log n)'), 'logarytmiczna', 'dzielenie n na pół w pętli', '08–09'],
        [c('O(n)'), 'liniowa', 'jedna pętla do n', '06'],
        [c('O(n log n)'), 'liniowo-logarytmiczna', 'pętla do n, a w niej dzielenie na pół', '10'],
        [c('O(n²)'), 'kwadratowa', 'pętla w pętli', '07'],
        [c('O(n³)'), 'sześcienna', 'trzy pętle w sobie', '07'],
        [c('O(2ⁿ)'), 'wykładnicza', 'wszystkie podzbiory', '11'],
        [c('O(n!)'), 'silnia', 'wszystkie ustawienia (kolejności)', '11'],
    ], widths=['17%', '25%', '44%', '14%'], cls='mid'),
    note('Omówimy je po kolei — każdą z kodem, tabelą i wykresem.')))

# ================================================================ 05
sec('05')
slide('`O(1)` — czas stały', cols(
    stack(code('''
            int n;          // O(1) — tworzymy zwykłego int-a
            string napis;   // O(1) — tworzymy zwykłego stringa
            cin >> n;       // O(1)''', cap='z notatek', size='sm'),
          P('Z notatek: <b>stała złożoność czasowa</b> — robimy stałą liczbę operacji (np. 5), nieważne czy input jest '
            'duży, czy mały.')),
    stack(table(['n', 'operacji'], [['100', 'ok. 5'], ['10 000', 'ok. 5'], [pw(9), 'ok. 5']], cls='mid'),
          chart([('O(1)', lambda x: 5, C1)], 100, 20, xlabel='n')),
    t='1.15fr 1fr'))

slide('Przykłady `O(1)`', stack(
    table(['Kod', 'Dlaczego O(1)'], [
        [c('lista[i]') + ' · ' + c('lista[i] = 7;'), 'odczyt i zapis jednej szufladki — od razu, bez szukania'],
        [c('lista.size()'), 'vector pamięta swój rozmiar — nie musi liczyć'],
        [c('lista.push_back(x);'), 'dokłada jeden element na koniec (praktycznie zawsze O(1))'],
        [c('if(a > b) cout << a;'), 'jedno porównanie i jedno wypisanie'],
        [c('for(int i = 0; i < 100; i++)'), 'pętla zawsze 100 razy — <b>nie zależy od n</b>!'],
        [c('n * (n + 1) / 2'), 'wzór — kilka działań, niezależnie od n']], widths=['42%', '58%'], cls='mid'),
    warn('O(1) <b>nie</b> znaczy „dokładnie jedna operacja”. Może być 5 albo 100 operacji — ważne, że ich liczba '
         '<b>nie zależy od wejścia</b>.')))

slide('Wzór zamiast pętli — `O(n)` kontra `O(1)`', cols(
    stack(code(SUM_LOOP, cap='pętla — O(n)', size='sm'), code(SUM_FORMULA, cap='wzór — O(1)', size='sm')),
    stack(table(['n', 'pętla', 'wzór'], [['100', '100 obrotów', '3 działania'], [pw(6), pw(6) + ' obrotów', '3 działania'],
                                         [pw(9), pw(9) + ' — ' + BAD, '3 działania — ' + OK]], cls='mid'),
          note('Wzór na sumę 1 + 2 + … + n = <b>n · (n + 1) / 2</b> znasz z lekcji o vectorze (tak liczyliśmy podtablice). '
               'Dla n = 100: 100 · 101 / 2 = <b>5050</b>.'),
          good('zamiana pętli na wzór to częsty sposób na przyspieszenie programu.', label='Zapamiętaj:')),
    t='1fr 1.1fr'))

# ================================================================ 06
sec('06')
slide('`O(n)` — jedna pętla do n', cols(
    stack(code('''
            for(int i = 0; i < n; i++){   // n razy → O(n)
                cout << i << endl;        // O(1)
            }''', cap='z notatek', size='sm'),
          P('Z notatek: <b>ten for-loop wykona się n razy</b>, czyli liczba powtórzeń zależy od inputu (konkretnie '
            'od „n”) → O(n).'),
          note('Wnętrze pętli to O(1). Pętla powtarza je n razy: <b>n · O(1) = O(n)</b>.')),
    stack(chart([('O(n)', lambda x: x, CN)], 700, 700, xlabel='n'),
          P('Wykres to <b>prosta linia</b>: dwa razy większe n → dwa razy więcej operacji.', 'muted')),
    t='1fr 1.05fr'))

slide('`O(n)` — przykłady z poprzednich lekcji', stack(
    rows(row(c('for(auto &e : lista) cin >> e;'), 'wczytanie n liczb', 'wczytywanie vectora'),
         row(c('for(auto el : lista) suma += el;'), 'suma wszystkich elementów', 'suma'),
         row(c('if(el % 2 == 0) parzyste++;'), 'w pętli: liczenie parzystych', 'zadania z logiką'),
         row(c('if(el > maks) maks = el;'), 'w pętli: największa liczba', 'maksimum'),
         row(c('for(int i = 0; i < n; i++) cout << t[i];'), 'wypisanie tablicy', 'lekcja o tablicach')),
    note('Wszystko, co robi <b>jedno przejście</b> po tablicy albo vectorze, to O(n): każdy element odwiedzamy '
         '<b>raz</b>, robiąc przy nim stałą liczbę operacji → n · O(1) = O(n).')))

slide('Dwie pętle po kolei — wciąż `O(n)`', cols(
    code('''
        for(int i = 0; i < n; i++){   // O(n)
            cout << i << endl;
        }
        for(int j = 0; j < n; j++){   // O(n)
            cout << j << endl;
        }
        // razem: O(n) + O(n) = O(2n) = O(n)''', cap='z notatek', size='sm'),
    stack(table(['n', 'operacji'], [['10', '20'], ['1 000', '2 000'], [pw(6), '2·10⁶']], cls='mid'),
          note('Pętle stoją <b>jedna po drugiej</b>, więc ich czasy <b>dodajemy</b>: n + n = 2n. Stałą 2 pomijamy '
               '(zasada 1) → <b>O(n)</b>.')),
    t='1.25fr 1fr'))

slide('Uwaga: liczy się, ile razy obróci się pętla', stack(
    table(['Pętla', 'Ile obrotów', 'Złożoność'], [
        [c('for(int i = 0; i < n; i++)'), 'n', c('O(n)')],
        [c('for(int i = 0; i < n; i += 2)'), 'n / 2', c('O(n)') + ' — stałą 1/2 pomijamy'],
        [c('for(int i = 0; i < 3 * n; i++)'), '3n', c('O(n)')],
        [c('for(int i = 0; i < 100; i++)'), '100 — zawsze', c('O(1)') + ' — nie zależy od n!'],
        [c('for(int i = 0; i < m; i++)'), 'm', c('O(m)') + ' — inna zmienna'],
    ], widths=['44%', '22%', '34%'], cls='mid'),
    good('nie patrz na samo słowo <b>for</b> — sprawdź, <b>ile razy</b> naprawdę się wykona.', label='Rada:')))

# ================================================================ 07
sec('07')
NEST = '''
    for(int i = 0; i < n; i++){          // O(n)
        for(int j = 0; j < n; j++){      // O(n)
            cout << i << ' ' << j << endl;   // O(1)
        }
    }
    // złożoność całego bloku: O(n²)'''
slide('Pętla w pętli', cols(
    stack(code(NEST, cap='z notatek', size='sm'), term('3', 'in', cap='wejście: n = 3')),
    stack(term('0 0\n0 1\n0 2\n1 0\n1 1\n1 2\n2 0\n2 1\n2 2', cap='na ekranie: 9 linijek'),
          note('Dla n = 3 program wypisał <b>9 = 3 · 3</b> par.')),
    t='1.4fr 1fr'))

slide('Dlaczego n · n?', cols(
    center(grid([[f'{i},{j}' for j in range(4)] for i in range(4)], name='pary (i, j) dla n = 4', size='')),
    stack(steps(['Pętla zewnętrzna ustawia <b>i</b> — n różnych wartości (wiersze).',
                 'Dla <b>każdego</b> i pętla wewnętrzna obraca się <b>n razy</b> (kolumny).',
                 'Razem: n + n + … + n (n razy) = <b>n · n = n²</b>.']),
          note('Pętle <b>w sobie</b> — czasy <b>mnożymy</b>: O(n) · O(n) = O(n²). Z notatek: '
               'O(n²) = O(n · n) = O(n) · O(n).')),
    t='1fr 1.15fr', align='center'))

slide('Wykres `O(n²)`', cols(
    chart([('O(n²)', lambda x: x * x, CN2)], 10, 100, xlabel='n',
          points=[(5, 25, '5² = 25'), (10, 100, '')]),
    stack(table(['n', 'n²', 'werdykt'], [['10', '100', OK], ['1 000', pw(6), OK], ['10 000', pw(8), OK + ' (na styk)'],
                                         [pw(5), pw(10), BAD]], cls='mid'),
          note('Wykres to <b>parabola</b> — wygina się w górę. 10 razy większe n → <b>100 razy</b> więcej operacji.')),
    t='1.1fr 1fr'))

slide('Pętla od `i` — wciąż `O(n²)`', cols(
    stack(code('''
            for(int i = 0; i < n; i++){
                for(int j = ⟦i⟧; j < n; j++){
                    // O(1)
                }
            }''', size='sm'),
          table(['i', 'obrotów j'], [['0', 'n'], ['1', 'n - 1'], ['…', '…'], ['n - 1', '1']], cls='mid')),
    stack(P('Teraz j zaczyna od i, więc pętla wewnętrzna robi się coraz krótsza. Razem:'),
          big('n + (n-1) + … + 1 = <em>n·(n+1)/2</em>'),
          note('To ten sam wzór co liczba podtablic z lekcji o vectorze! n·(n+1)/2 = n²/2 + n/2. Stałą 1/2 i mniejszy '
               'składnik pomijamy → <b>O(n²)</b>.')),
    t='1fr 1.1fr'))

slide('`O(n³)` — trzy pętle w sobie', cols(
    code('''
        // wypisz wszystkie podtablice (lekcja o vectorze)
        for(int i = 0; i < n; i++){           // początek
            for(int j = i; j < n; j++){       // koniec
                for(int k = i; k <= j; k++){  // elementy
                    cout << lista[k] << ' ';
                }
                cout << endl;
            }
        }''', size='sm'),
    stack(P('Trzy pętle w sobie, każda do (około) n: <b>O(n) · O(n) · O(n) = O(n³)</b>.'),
          table(['n', 'n³', 'werdykt'], [['10', '1 000', OK], ['100', pw(6), OK], ['500', pw(8, '1,25'), OK + ' (na styk)'],
                                         ['1 000', pw(9), BAD]], cls='mid')),
    t='1.3fr 1fr'))

slide('Dwie różne zmienne: n i m', stack(
    P('Wejście może mieć <b>dwie</b> wielkości, np. n wierszy i m kolumn. Wtedy złożoność zapisujemy z obiema '
      '(przykłady z notatek, przepisane na C++):'),
    table(['Kod', 'Złożoność'], [
        [c('for(i < n) cout << i;'), c('O(n)')],
        [c('for(i < m) cout << i;'), c('O(m)')],
        [c('for(i < n) for(j < n) cout << i << j;'), c('O(n²)')],
        [c('for(i < n) for(j < m) cout << i << j;'), c('O(n · m)')],
        [c('for(i < n) for(j < m) for(k < n) …'), c('O(n² · m)')],
    ], widths=['70%', '30%'], cls='mid'),
    note('Skrót ' + c('for(i < n)') + ' oznacza ' + c('for(int i = 0; i < n; i++)') + '. Nie wolno zamienić m na n — '
         'to mogą być zupełnie różne liczby (np. n = 1000, m = 3).')))

slide('Cały program — liczy się najwolniejsza część', cols(
    code('''
        cin >> n;                        // O(1)
        for(int i = 0; i < n; i++){      // O(n)
            cin >> lista[i];
        }
        for(int i = 0; i < n; i++){      // O(n²)
            for(int j = 0; j < n; j++){
                cout << lista[i] + lista[j] << ' ';
            }
        }
        cout << endl;                    // O(1)''', size='sm'),
    stack(P('Części stoją po kolei, więc dodajemy:'),
          big('O(1) + O(n) + O(n²) + O(1) = <em>O(n²)</em>'),
          note('Zostaje najwolniejsza część (zasada 2). Program zwalnia tam, gdzie jest najwięcej pracy.')),
    t='1.3fr 1fr'))

# ================================================================ 08
sec('08')
slide('Ile razy można podzielić przez 2?', stack(
    P('Weźmy liczbę n i dzielmy ją przez 2, aż dostaniemy liczbę <b>≤ 1</b>. Ile podzieleń trzeba?'),
    center(arr([16, 8, 4, 2, 1], name='n', size='lg', idx=False, ptr={1: '÷2', 2: '÷2', 3: '÷2', 4: '÷2'})),
    big('16 → 8 → 4 → 2 → 1 &nbsp; to <em>4 podzielenia</em>.'),
    note('Ta liczba podzieleń ma swoją nazwę: <b>logarytm o podstawie 2</b> z n. Piszemy <b>log₂ n</b>. '
         'Czyli log₂ 16 = 4.'), gap=18))

slide('Logarytm — dwie definicje z notatek', stack(
    cards(card('Definicja 1: dzielenie', 'log₂ n ≈ <b>ile razy trzeba podzielić n na dwa</b>, aby wyszła liczba ≤ 1.<br>'
                                         'log₂ 16: 16 → 8 → 4 → 2 → 1 → <b>4</b>', 'tlc'),
          card('Definicja 2: potęgowanie', 'log₂ n ≈ <b>najmniejszy x taki, że 2ˣ ≥ n</b>.<br>'
                                           'log₂ 16: 2⁴ = 16 ≥ 16 → <b>4</b>', 'puc')),
    P('Obie definicje mówią to samo z dwóch stron: <b>dzielenie przez 2</b> cofa <b>mnożenie przez 2</b>.'),
    table(['', '2¹', '2²', '2³', '2⁴', '2⁵', '2⁶', '2⁷', '2⁸', '2⁹', '2¹⁰'],
          [['wartość', '2', '4', '8', '16', '32', '64', '128', '256', '512', '1024']], cls='ctr mid')))

slide('Tabela logarytmów z notatek', cols(
    table(['n', 'log₂ n'], [[str(2 ** k), str(k)] for k in range(1, 11)], cls='mid ctr'),
    stack(P('Gdy n jest potęgą dwójki, logarytm to <b>wykładnik</b>: 2¹⁰ = 1024, więc log₂ 1024 = 10.'),
          P('A gdy n <b>nie</b> jest potęgą dwójki? Wtedy logarytm wychodzi „pomiędzy”: log₂ 1000 ≈ 9,97 — trochę mniej '
            'niż 10, bo 1000 jest trochę mniejsze od 1024.'),
          note('W złożoności nie potrzebujemy dokładnych wartości — wystarczy przybliżenie. Do sprawdzenia dokładnej '
               'wartości możesz użyć kalkulatora logarytmów (link w notatkach: calc.pl).')),
    t='0.8fr 1.2fr'))

slide('Logarytmy dużych liczb', stack(
    table(['n', pw(3), pw(4), pw(5), pw(6), pw(7), pw(8), pw(9)],
          [['log₂ n ≈', '10', '13', '17', '20', '23', '27', '30']], cls='ctr big'),
    cols(note(f'Z notatek: log₂ {pw(6)} = 19,93… ≈ <b>20</b>. Milion trzeba podzielić przez 2 tylko <b>20</b> razy!'),
         good(f'dla liczb do miliarda (n ≤ {pw(9)}) zawsze <b>log₂ n ≤ 30</b>.', label='Zapamiętaj (z notatek):'),
         gap=20),
    note(f'Trik: 2¹⁰ = 1024 ≈ 1000 = {pw(3)}. Więc co <b>10 podwojeń</b> to <b>×1000</b>: log₂ tysiąca ≈ 10, '
         'miliona ≈ 20, miliarda ≈ 30.')))

# ================================================================ 09
sec('09')
HALF = '''
    int n;
    cin >> n;
    while(n > 1){
        n /= 2;
    }'''
slide('Pętla, która dzieli przez 2', cols(
    stack(code(HALF, cap='z notatek', size='lg'),
          P(f'{c("n /= 2")} to skrót od {c("n = n / 2")}. Dzielenie intów obcina część po przecinku: 25 / 2 = 12.')),
    stack(table(['obrót', 'n przed', 'n po'], [[str(k + 1), str(a), str(b)] for k, (a, b) in
                                                enumerate(zip([100, 50, 25, 12, 6, 3], [50, 25, 12, 6, 3, 1]))],
                cls='mid'),
          note('Dla n = 100 pętla obróciła się tylko <b>6 razy</b> (log₂ 100 ≈ 6,6).')),
    t='1fr 1fr'))

slide('Ile obrotów dla dużego n?', stack(
    code(HALF, size='sm'),
    table(['n', 'kolejne wartości n', 'obrotów'], [
        ['16', '16, 8, 4, 2, 1', '4'], ['100', '100, 50, 25, 12, 6, 3, 1', '6'],
        ['1 000', '1000, 500, 250, 125, 62, 31, 15, 7, 3, 1', '9'],
        [pw(6), '1000000, 500000, 250000, …, 3, 1', '19'],
        [pw(9), '1000000000, 500000000, …, 3, 1', '29']], widths=['16%', '66%', '18%'], cls='mid'),
    good('liczba obrotów ≈ log₂ n. Ta pętla ma złożoność <b>O(log n)</b>. Nawet dla miliarda — mniej niż 30 obrotów!',
         label='Wniosek:')))

slide('Wykres `O(log n)`', cols(
    chart([('O(log n)', log2, CLOG)], 1000, 12, xmin=1, xlabel='n',
          points=[(16, 4, 'n = 16 → 4'), (1000, log2(1000), '')]),
    stack(P('Wykres z notatek: rośnie <b>bardzo wolno</b> — prawie płasko.'),
          table(['n', 'log₂ n'], [['10', '3'], ['1 000', '10'], [pw(6), '20'], [pw(9), '30']], cls='mid'),
          note('Wejście <b>1000 razy</b> większe → tylko <b>+10</b> operacji. O(log n) to prawie tak dobrze jak O(1).')),
    t='1.15fr 1fr'))

slide('Zabawa: zgadnij liczbę', cols(
    stack(P('Myślę o liczbie od <b>1 do 1000</b>. Możesz pytać, a ja odpowiadam tylko: <b>„więcej”</b> albo '
            '<b>„mniej”</b>. Ile pytań potrzebujesz?'),
          steps(['Zawsze pytaj o <b>środek</b> zakresu, np. „czy to 500?”.',
                 'Po każdej odpowiedzi zostaje <b>połowa</b> liczb.',
                 'Zakres dzielisz na pół, aż zostanie jedna liczba.'], cls='tight')),
    stack(table(['pytanie', 'zostaje liczb'], [['start', '1000'], ['1', '500'], ['2', '250'], ['3', '125'], ['4', '63'],
                                               ['…', '…'], ['10', '1']], cls='mid'),
          good('najwyżej <b>10 pytań</b> — bo log₂ 1000 ≈ 10. Dla miliona liczb wystarczy 20 pytań!', label='Wynik:')),
    t='1.1fr 1fr'))

slide('Uwaga: dzielenie a odejmowanie', cols(
    stack(code('''
            while(n > 1){
                n /= 2;      // dzielimy
            }''', cap='O(log n)', good=True),
          term('dla n = 10⁹: 29 obrotów', cap='ile obrotów')),
    stack(code('''
            while(n > 0){
                n -= 2;      // odejmujemy
            }''', cap='O(n)', bad=True),
          term('dla n = 10⁹: 500 000 000 obrotów', cap='ile obrotów')),
    gap=24),
    warn('obie pętle wyglądają podobnie, ale ta z <b>odejmowaniem</b> robi n/2 obrotów — to <b>O(n)</b>, a nie O(log n). '
         'Logarytm pojawia się tylko, gdy n zmniejsza się <b>kilka razy</b> (dzielenie).'))

slide('Dzielenie przez 10 — liczba cyfr', cols(
    stack(code('''
            int cyfry = 0;
            while(n > 0){
                n /= 10;
                cyfry++;
            }
            cout << cyfry << endl;''', size='sm'),
          term('12345', 'in', cap='wejście'), term('5')),
    stack(table(['n przed', 'n po'], [['12345', '1234'], ['1234', '123'], ['123', '12'], ['12', '1'], ['1', '0']],
                cls='mid'),
          note('Dzielenie przez 10 też jest O(log n) — tylko logarytm ma podstawę 10 (dla miliarda: 10 obrotów). '
               '<b>Podstawa logarytmu to tylko stała</b>, więc piszemy po prostu O(log n).')),
    t='1fr 1fr'))

# ================================================================ 10
sec('10')
NLOG = '''
    for(int i = 0; i < n; i++){      // O(n)
        int x = n;
        while(x > 1){                // O(log n)
            x /= 2;
        }
    }
    // razem: O(n) · O(log n) = O(n log n)'''
slide('`O(n log n)` = `O(n)` · `O(log n)`', cols(
    code(NLOG, size='sm'),
    stack(P('Z notatek: <b>O(n · log n) = O(n) · O(log n)</b>.'),
          steps(['Pętla zewnętrzna obraca się <b>n</b> razy.',
                 'W każdym obrocie pętla z dzieleniem obraca się ok. <b>log₂ n</b> razy.',
                 'Pętle są w sobie, więc <b>mnożymy</b>: n · log n.'], cls='tight')),
    t='1.15fr 1fr'))

slide('Ile to operacji?', cols(
    table(['n', 'n · log₂ n', 'dla porównania n²'], [
        ['1 000', '1 000 · 10 = ' + pw(4), pw(6)],
        [pw(5), pw(5) + ' · 17 ≈ ' + pw(6, 2), pw(10) + ' ' + BAD],
        [pw(6), pw(6) + ' · 20 = ' + pw(7, 2), pw(12) + ' ' + BAD]], cls='mid'),
    stack(chart([('O(n²)', lambda x: x * x, CN2), ('O(n log n)', lambda x: x * log2(x), CNLOG),
                 ('O(n)', lambda x: x, CN)], 40, 400, xmin=1, xlabel='n'),
          note('O(n log n) jest tylko trochę wolniejsze niż O(n), a dużo szybsze niż O(n²).')),
    t='1fr 1.1fr'))

slide('Gdzie spotkasz `O(n log n)`?', stack(
    cards(card('Sortowanie', f'{c("sort(lista.begin(), lista.end());")} — funkcja z biblioteki algorithm sortuje vector '
                             'w czasie <b>O(n log n)</b>.', 'tlc'),
          card('Pętla + dzielenie', 'Dla każdego z n elementów liczymy coś pętlą z dzieleniem (np. liczbę cyfr) '
                                    '→ n · log n.', 'puc')),
    note(f'Dla n ≤ {pw(6)} złożoność O(n log n) daje ok. {pw(7, 2)} operacji — mieści się bez problemu. Dlatego to bardzo '
         'częsta złożoność rozwiązań na zawodach.')))

# ================================================================ 11
sec('11')
slide('`O(2ⁿ)` — każdy element podwaja pracę', cols(
    stack(P('Pamiętasz <b>podzbiory</b> z lekcji o vectorze? Przy każdym elemencie decydujemy: bierzemy albo nie. '
            'Każdy kolejny element <b>podwaja</b> liczbę możliwości.'),
          table(['n', '2ⁿ', 'werdykt'], [['10', '1 024', OK], ['20', 'ok. ' + pw(6), OK], ['25', 'ok. ' + pw(7, 3), OK],
                                         ['30', 'ok. ' + pw(9), BAD], ['60', 'ok. ' + pw(18), BAD]], cls='mid')),
    stack(chart([('O(2ⁿ)', lambda x: 2 ** x, CN2)], 10, 1100, xlabel='n'),
          note('Program, który sprawdza <b>wszystkie podzbiory</b>, działa w O(2ⁿ). Da się go użyć tylko dla '
               '<b>n ≤ ok. 25</b>.')),
    t='1fr 1fr'))

slide('`O(n!)` — silnia', stack(
    P('Z notatek: <b>n! = n · (n-1) · (n-2) · … · 3 · 2 · 1</b>. Czytamy: „en silnia”.'),
    cols(stack(P('Ile jest sposobów, żeby ustawić <b>3 osoby</b> (A, B, C) w kolejce?'),
               table(['', '', ''], [['ABC', 'ACB', 'BAC'], ['BCA', 'CAB', 'CBA']], cls='ctr mid'),
               P('3! = 3 · 2 · 1 = <b>6</b> — na pierwsze miejsce 3 osoby, na drugie 2, na ostatnie 1.')),
         table(['n', 'n!', 'werdykt'], [['3', '6', OK], ['5', '120', OK], ['10', '3 628 800', OK],
                                        ['12', 'ok. ' + pw(8, 5), '<b>granica</b>'], ['20', 'ok. ' + pw(18, '2,4'), BAD]],
               cls='mid'), gap=24),
    note('Program, który sprawdza <b>wszystkie ustawienia</b> (kolejności), działa w O(n!). Tylko dla <b>n ≤ ok. 11</b>.')))

slide('Te złożoności rosną gwałtownie', stack(
    table(['n', 'n²', '2ⁿ', 'n!'], [
        ['5', '25', '32', '120'], ['10', '100', '1 024', '3 628 800'],
        ['15', '225', '32 768', 'ok. ' + pw(12, '1,3')], ['20', '400', 'ok. ' + pw(6), 'ok. ' + pw(18, '2,4')]],
          cls='big ctr'),
    warn('dla n = 20 złożoność O(n²) to tylko 400 operacji, a O(n!) — ponad trylion (to <b>800 lat</b> liczenia). '
         'Złożoności O(2ⁿ) i O(n!) nadają się tylko dla <b>bardzo małych n</b>.')))

# ================================================================ 12
sec('12')
ALL = [('O(1)', lambda x: 1, C1), ('O(log n)', log2, CLOG), ('O(n)', lambda x: x, CN),
       ('O(n log n)', lambda x: x * log2(x), CNLOG), ('O(n²)', lambda x: x * x, CN2)]
slide('Wszystkie na jednym wykresie', cols(
    chart(ALL, 24, 120, xmin=1, xlabel='n'),
    stack(P('Każda linia to inna złożoność. Im <b>wyżej</b> linia, tym <b>więcej operacji</b> i wolniejszy program.'),
          steps(['O(1) — płasko, nie rośnie wcale.', 'O(log n) — rośnie bardzo powoli.', 'O(n) — prosta linia.',
                 'O(n log n) — trochę ponad O(n).', 'O(n²) — szybko ucieka w górę.'], cls='tight')),
    t='1.2fr 1fr'))


def fmt(v):
    if v < 10_000:
        return f'{round(v):,}'.replace(',', ' ')
    e = int(math.floor(math.log10(v)))
    a = v / 10 ** e
    return pw(e) if round(a, 1) == 1 else pw(e, f'{a:.1f}'.replace('.', ','))


def cell(v):
    if v is None:
        return '<span class="st-bad">kosmicznie dużo</span>'
    s = fmt(v)
    return f'<span class="st-bad">{s}</span>' if v > 5e8 else s


NS = [10, 100, 1000, 10 ** 5, 10 ** 6]
FUNCS = [('O(1)', lambda n: 1), ('O(log n)', lambda n: math.log2(n)), ('O(n)', lambda n: n),
         ('O(n log n)', lambda n: n * math.log2(n)), ('O(n²)', lambda n: n * n), ('O(n³)', lambda n: n ** 3),
         ('O(2ⁿ)', lambda n: 2 ** n if n <= 100 else None), ('O(n!)', lambda n: math.factorial(n) if n <= 20 else None)]
slide('Tabela: ile operacji?', stack(
    table(['złożoność'] + [f'n = {fmt(n)}' for n in NS],
          [[c(name)] + [cell(f(n)) for n in NS] for name, f in FUNCS], cls='mid'),
    note(f'<span class="st-bad">Pomarańczowe</span> liczby to ponad {pw(8, 5)} operacji — nie zmieszczą się w 1 sekundzie.')))

slide('Od najszybszej do najwolniejszej', stack(
    big('<em>O(1)</em> &lt; <em>O(log n)</em> &lt; <em>O(n)</em> &lt; <em>O(n log n)</em> &lt; '
        '<strong>O(n²)</strong> &lt; <strong>O(n³)</strong> &lt; <strong>O(2ⁿ)</strong> &lt; <strong>O(n!)</strong>'),
    note('Znak &lt; czytamy tu „szybsza niż”. Im bardziej na lewo, tym program wytrzyma <b>większe n</b>.'),
    good('na zawodach zwykle szukamy rozwiązania, które jest <b>wystarczająco</b> szybkie dla największego n '
         'z treści. Nie zawsze musi być najszybsze możliwe.', label='Ważne:'), gap=22))

# ================================================================ 13
sec('13')
slide('Reguły liczenia złożoności', steps([
    'Pojedyncze instrukcje (przypisanie, działanie, if, cin, cout jednej liczby) → <b>O(1)</b>.',
    'Pętla, która obraca się k razy → <b>k · (złożoność wnętrza)</b>.',
    'Części <b>po kolei</b> (jedna pod drugą) → <b>dodajemy</b> i zostawiamy największą.',
    'Pętle <b>w sobie</b> → <b>mnożymy</b>.',
    'Pomijamy <b>stałe</b> (3n → n) i <b>mniejsze składniki</b> (n² + n → n²).',
    'Pętla, w której n jest <b>dzielone</b> (przez 2, 10, …) → <b>O(log n)</b>.',
], cls='big'))

slide('Przykład 1 — kod z notatek', cols(
    code('''
        int n;                         // O(1)
        string napis;                  // O(1)
        cin >> n;                      // O(1)
        for(int i = 0; i < n; i++){    // n obrotów → O(n)
            cout << i << endl;         // O(1)
        }''', size='sm'),
    stack(steps(['Trzy pierwsze linijki: O(1) + O(1) + O(1) = O(1).',
                 'Pętla: n obrotów · O(1) = O(n).',
                 'Po kolei: O(1) + O(n) = <b>O(n)</b>.'], cls='tight'),
          good('<b>O(n)</b>', label='Wynik:')),
    t='1.3fr 1fr'))

slide('Przykład 2 — dwie pętle po kolei i w sobie', cols(
    code('''
        for(int i = 0; i < n; i++){        // O(n)
            cout << i << endl;
        }
        for(int i = 0; i < n; i++){        // O(n)
            for(int j = 0; j < n; j++){    //   · O(n)
                cout << i * j << endl;
            }
        }''', size='sm'),
    stack(steps(['Pierwsza pętla: <b>O(n)</b>.',
                 'Druga część to pętla w pętli: O(n) · O(n) = <b>O(n²)</b>.',
                 'Po kolei: O(n) + O(n²) → zostaje <b>O(n²)</b>.'], cls='tight'),
          good('<b>O(n²)</b>', label='Wynik:')),
    t='1.3fr 1fr'))

slide('Przykład 3 — n, m i dzielenie', cols(
    code('''
        for(int i = 0; i < n; i++){        // O(n)
            for(int j = 0; j < m; j++){    //   · O(m)
                cout << i + j << ' ';
            }
        }
        while(m > 1){                      // O(log m)
            m /= 2;
        }''', size='sm'),
    stack(steps(['Pętla w pętli: O(n) · O(m) = <b>O(n · m)</b>.',
                 'Pętla z dzieleniem m: <b>O(log m)</b>.',
                 'Po kolei: O(n · m) + O(log m) → zostaje <b>O(n · m)</b>.'], cls='tight'),
          good('<b>O(n · m)</b>', label='Wynik:')),
    t='1.3fr 1fr'))

# ================================================================ 14
sec('14')
slide('Czytamy ograniczenia z treści', stack(
    P('W treści zadania jest napisane, jak <b>duże</b> może być wejście. Przykład z notatek:'),
    cols(card('Ograniczenia', f'1 ≤ n ≤ {pw(5)}', 'orc'), card('Limit czasu', f'1 s → ok. {pw(8)} operacji', 'tlc'),
         gap=20),
    steps(['Bierzemy <b>największe</b> możliwe n — tu ' + pw(5) + ' (najgorszy przypadek!).',
           'Wstawiamy je do złożoności naszego pomysłu.',
           f'Porównujemy wynik z {pw(8)}: mniej → zmieści się, dużo więcej → za wolno.']), gap=18))

slide(f'Przykład z notatek: n ≤ 10⁵', stack(
    table(['Mamy algorytm', 'W najgorszym przypadku (n = 10⁵)', 'Werdykt'], [
        [c('O(n)'), 'ok. ' + pw(5) + ' operacji', OK],
        [c('O(n²)'), 'ok. ' + pw(10) + ' operacji', BAD],
        [c('O(1)'), 'ok. 1 operacja', OK],
        [c('O(log n)'), 'ok. 17 operacji', OK],
        [c('O(n log n)'), f'ok. {pw(5)} · 17 ≈ {pw(6, 2)} operacji', OK]], widths=['24%', '50%', '26%'], cls='big'),
    note('W notatkach dla O(log n) jest „ok. 15” — dokładniej log₂ 10⁵ ≈ 16,6, czyli ok. 17. Dla werdyktu to bez znaczenia.')))

slide('Jaka złożoność wystarczy?', stack(
    P(f'Ta tabela odpowiada na pytanie: „<b>jak szybkiego</b> rozwiązania potrzebuję przy takim n?” (limit 1 s, '
      f'ok. {pw(8)} operacji):'),
    table(['Największe n', 'Wystarczy złożoność', 'Przykład'], [
        ['n ≤ 10', c('O(n!)'), 'wszystkie ustawienia'],
        ['n ≤ 20–25', c('O(2ⁿ)'), 'wszystkie podzbiory'],
        ['n ≤ 500', c('O(n³)'), 'trzy pętle w sobie'],
        ['n ≤ 5 000 (do 10 000)', c('O(n²)'), 'pętla w pętli'],
        [f'n ≤ {pw(6)}', c('O(n log n)'), 'sortowanie'],
        [f'n ≤ {pw(7)}–{pw(8)}', c('O(n)'), 'jedna pętla'],
        [f'n ≤ {pw(18)}', c('O(log n)') + ' albo ' + c('O(1)'), 'dzielenie na pół, wzór']],
          widths=['30%', '34%', '36%'], cls='mid')))

QA = [(f'n ≤ 1 000, pomysł O(n²)', pw(6), True), (f'n ≤ {pw(6)}, pomysł O(n²)', pw(12), False),
      ('n ≤ 20, pomysł O(2ⁿ)', 'ok. ' + pw(6), True), (f'n ≤ {pw(9)}, pomysł O(n)', pw(9), False),
      (f'n ≤ {pw(9)}, pomysł O(log n)', 'ok. 30', True), ('n ≤ 300, pomysł O(n³)', pw(7, '2,7'), True)]
slide('Ćwiczenie: czy się zmieści?', stack(
    P(f'Limit czasu 1 s (ok. {pw(8)} operacji). Dla każdego pomysłu powiedz: zmieści się czy nie?'),
    cards(*[card(q, '?') for q, _, _ in QA], n=3),
    P('Policz, <b>zanim</b> przejdziesz dalej.', 'muted cen')))

slide('Odpowiedzi', cards(*[card(q, f'ok. {v} operacji → ' + (OK if ok else BAD)) if not v.startswith('ok.') else
                            card(q, f'{v} operacji → ' + (OK if ok else BAD)) for q, v, ok in QA], n=3))

# ================================================================ 15
sec('15')
slide('Schemat działania na zawodach', stack(
    P('Z notatek — jak podchodzić do zadania krok po kroku:'),
    steps(['<b>Czytanie.</b> Dokładnie przeczytaj treść, ograniczenia (n!) i limit czasu.',
           '<b>BRUT</b> — wymyśl coś <b>w miarę prostego, ale wolnego</b>. Ważne, żeby było poprawne.',
           '<b>WZORCÓWKA</b> — wymyśl coś <b>trudniejszego, ale szybkiego</b>, na 100 punktów.'], cls='big'),
    note('<b>Brut</b> (od „brute force” — siłowo) sprawdza wszystko po kolei. <b>Wzorcówka</b> (rozwiązanie wzorcowe) '
         'ma złożoność dopasowaną do ograniczeń z treści.')))

slide('Po co pisać bruta?', cards(
    card('1. Część punktów', 'Testy często są podzielone na grupy: np. n ≤ 1000 za 30 pkt i n ≤ 10⁶ za resztę. Wolny '
                             'brut zdobywa punkty za małe testy.', 'tlc'),
    card('2. Sprawdzanie wzorcówki', 'Na małych testach brut i wzorcówka muszą dać <b>ten sam</b> wynik. Jeśli się '
                                     'różnią — szukasz błędu.', 'puc'),
    card('3. Zrozumienie zadania', 'Pisząc bruta lepiej rozumiesz zadanie i łatwiej wpadasz na szybszy pomysł.', 'orc'),
    card('4. Spokój', 'Masz już jakieś punkty, zanim zaczniesz walczyć o 100.', 'tlc'), n=2))

slide(f'Przykład: suma 1 + 2 + … + n, gdy n ≤ 10⁹', cols(
    stack(code(SUM_LOOP, cap='brut — O(n)', size='sm'),
          P(f'Dla n = {pw(9)}: miliard obrotów → ok. 10 s → ' + BAD + '. Ale dla małych testów (np. n ≤ ' + pw(6)
            + ') działa i daje punkty.')),
    stack(code(SUM_FORMULA, cap='wzorcówka — O(1)', size='sm'),
          P('Dla każdego n: kilka działań → ' + OK + '.'),
          note('Na małych n oba programy dają ten sam wynik — tak sprawdzamy, czy wzór jest dobry. Używamy '
               '<b>long long</b>, bo wynik jest większy niż mieści int.')),
    t='1fr 1fr'))

slide('Przykład: ile jest par (i, j), gdzie i < j?', cols(
    stack(code('''
            long long ile = 0;
            for(int i = 0; i < n; i++){
                for(int j = i + 1; j < n; j++){
                    ile++;
                }
            }
            cout << ile << endl;''', cap='brut — O(n²)', size='sm'),
          code('cout << n * (n - 1) / 2 << endl;', cap='wzorcówka — O(1)', size='sm')),
    stack(table(['n', 'brut', 'wzorcówka'], [['4', '6', '4 · 3 / 2 = 6'], ['1 000', '499 500', '499 500'],
                                             [pw(6), BAD, OK]], cls='mid'),
          note('Dla i = 0 jest n-1 par, dla i = 1 — n-2, …, razem (n-1) + (n-2) + … + 1 = n·(n-1)/2. Brut pomaga '
               'sprawdzić, czy wzór jest dobry.')),
    t='1.1fr 1fr'))

# ================================================================ 16
sec('16')
QZ = [('''
    for(int i = 0; i < n; i++){
        for(int k = 0; k < 5; k++){
            cout << i + k;
        }
    }''', 'O(n)', 'wewnętrzna pętla zawsze 5 razy → stała'),
      ('''
    for(int i = 1; i < n; i *= 2){
        cout << i << ' ';
    }''', 'O(log n)', 'i podwaja się: 1, 2, 4, 8, … — ok. log₂ n kroków'),
      ('''
    for(int i = 0; i < n; i++){
        cout << i;
    }
    for(int i = 0; i < n; i++){
        for(int j = 0; j < n; j++){
            cout << j;
        }
    }''', 'O(n²)', 'O(n) + O(n²) → zostaje O(n²)'),
      ('''
    while(n > 0){
        n -= 3;
    }''', 'O(n)', 'odejmowanie, nie dzielenie: n / 3 obrotów'),
      ('''
    for(int i = 0; i < n; i++){
        for(int j = 0; j < n; j++){
            for(int k = 0; k < m; k++){
                cout << k;
            }
        }
    }''', 'O(n² · m)', 'trzy pętle w sobie: n · n · m'),
      ('''
    cin >> n;
    cout << n * n * n << endl;''', 'O(1)', 'n³ jest w wyniku, ale liczymy go jednym działaniem')]

for half in (0, 1):
    part = QZ[half * 3:half * 3 + 3]
    nr = f'{half * 3 + 1}–{half * 3 + 3}'
    tt = '1fr 1fr 1fr' if half == 0 else '0.75fr 1.5fr 0.95fr'
    slide(f'Jaka to złożoność? ({nr})', cols(*[stack(code(src, cap=f'kod {half * 3 + k + 1}', size='sm'))
                                              for k, (src, _, _) in enumerate(part)], gap=16, t=tt),
          P('Zapisz odpowiedzi, <b>zanim</b> przejdziesz dalej.', 'muted cen'))
    slide(f'Odpowiedzi ({nr})', cols(*[stack(code(src, cap=f'kod {half * 3 + k + 1}', size='sm'),
                                             good(f'<b>{ans}</b> — {why}'))
                                       for k, (src, ans, why) in enumerate(part)], gap=16, t=tt))

slide('Najczęstsze błędy', traps([
    '<b>Dodawanie zamiast mnożenia.</b> Pętle <b>w sobie</b> się mnoży (n · n), a dodaje tylko te <b>po kolei</b>.',
    '<b>„O(1) to jedna operacja”.</b> Nie — to <b>stała</b> liczba operacji, niezależna od n (może być 100).',
    f'<b>Każdy for to O(n).</b> {c("for(int i = 0; i < 100; i++)")} to O(1), a pętla z {c("i *= 2")} to O(log n).',
    f'<b>Odejmowanie jak dzielenie.</b> {c("n -= 2")} w pętli daje O(n), a {c("n /= 2")} — O(log n).',
    '<b>Zgubiona druga zmienna.</b> Pętla do m to O(m), nie O(n). O(n · m) to nie to samo co O(n²).',
    '<b>Liczenie dla małego n.</b> Złożoność sprawdzamy dla <b>największego</b> n z ograniczeń.',
]))

slide('Ściąga: złożoność czasowa', stack(
    table(['Złożoność', 'Typowy kod', 'Wystarczy dla n ≤', 'n = 10⁵ → operacji'], [
        [c('O(1)'), 'brak pętli zależnej od n, wzór', 'dowolnego', '1'],
        [c('O(log n)'), 'pętla z n /= 2', pw(18), '17'],
        [c('O(n)'), 'jedna pętla', pw(8), pw(5)],
        [c('O(n log n)'), 'pętla + dzielenie, sort', pw(6), pw(6, 2)],
        [c('O(n²)'), 'pętla w pętli', '5 000', '<span class="st-bad">' + pw(10) + '</span>'],
        [c('O(n³)'), 'trzy pętle w sobie', '500', '<span class="st-bad">' + pw(15) + '</span>'],
        [c('O(2ⁿ)'), 'wszystkie podzbiory', '20–25', '<span class="st-bad">kosmicznie dużo</span>'],
        [c('O(n!)'), 'wszystkie ustawienia', '10', '<span class="st-bad">kosmicznie dużo</span>']],
          widths=['18%', '34%', '22%', '26%'], cls='mid'),
    note(f'1 sekunda ≈ {pw(8)} operacji. &nbsp;Po kolei → dodajemy. &nbsp;W sobie → mnożymy. &nbsp;Stałe pomijamy.')))

build(
    secs=SECS,
    html='pdf-src/prezentacja-zlozonosc-czasowa.html',
    pdf='prezentacja-zlozonosc-czasowa-t-olimpians.pdf',
    generator='pdf-src/build-prezentacja-zlozonosc.py',
    title='Złożoność czasowa — krok po kroku — T-Olimpians',
    brand='złożoność czasowa',
    foot='Złożoność czasowa — krok po kroku',
    cover=dict(
        kicker='// T-OLIMPIANS — PREZENTACJA DO LEKCJI',
        h1='Złożoność czasowa<br>— krok po kroku',
        sub='''Jak przewidzieć, czy program zmieści się w limicie czasu — bez uruchamiania go. Operacje i sekunda,
      notacja dużego O, po kolei O(1), O(n), O(n²), logarytm i O(log n), O(n log n), O(2ⁿ) i O(n!), reguły liczenia,
      dopasowanie złożoności do ograniczeń z treści oraz brut i wzorcówka.''',
        meta='C++ · LEKCJA 17 · ZŁOŻONOŚĆ CZASOWA · BEZ ZNAJOMOŚCI ALGORYTMÓW',
        deco=chart(ALL, 24, 120, xmin=1, w=640, h=160, xlabel='n', ylabel='operacje')),
    end=dict(
        kicker='// KONIEC LEKCJI 17',
        h1='Umiesz już liczyć<br>złożoność czasową!',
        sub='''Wiesz, ile operacji mieści się w sekundzie, umiesz zapisać złożoność w notacji dużego O, policzyć ją
      z pętli i sprawdzić, czy pomysł zmieści się w limicie dla największego n z treści. Od teraz przy każdym
      zadaniu: najpierw czytanie, potem brut, a na końcu wzorcówka.''',
        deco=''),
)
