#!/usr/bin/env python3
"""Prezentacja „Pary (pair) w C++ — krok po kroku” (T-Olimpians, lekcja 9).

Generuje pdf-src/prezentacja-pair-cpp.html — poziome slajdy 16:9 w stylu
ściągi Python Turtle — i (z flagą --pdf) drukuje je do
prezentacja-pair-cpp-t-olimpians.pdf przez Playwright (Chromium).
Uczeń zna już tablice (lekcja 7) i string (lekcja 8), ale jeszcze nie vector
(lekcja 10) — dlatego zamiast vector<pair<…>> z notatek używamy tablicy par.

    python3 pdf-src/build-prezentacja-pair.py --pdf
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from prezentacja_lib import *  # noqa: E402,F401,F403

SECS = [
    ('01', 'Po co nam para?'),
    ('02', 'Tworzenie pary'),
    ('03', 'Para bez wartości'),
    ('04', 'first i second'),
    ('05', 'Wypisywanie pary'),
    ('06', 'Zmiana jednego elementu'),
    ('07', 'Zmiana obu naraz'),
    ('08', 'Różne typy w parze'),
    ('09', 'Tablica par'),
    ('10', 'Tymczasowa para'),
    ('11', 'Wczytywanie par'),
    ('12', 'Para w parze'),
    ('13', 'Sprawdź się'),
    ('14', 'Najczęstsze błędy'),
    ('15', 'Podsumowanie'),
]

Z = (0, 'q')          # zero w parze, do której jeszcze nic nie wpisaliśmy
L2 = [(0, 0), (1, 5), (-1, 7)]


def rowcd(src, diagram, sub='', w=470):
    """Wiersz: kod po lewej, rysunek po prawej."""
    sub = f'<span class="rwn">{sub}</span>' if sub else ''
    return (f'<div class="rw" style="grid-template-columns:{w}px 1fr"><div>{c(src)}{sub}</div>'
            f'<div>{diagram}</div></div>')


def rows(*items):
    return '<div class="rows">' + ''.join(items) + '</div>'


def before_after(a, b, la='przed', lb='po'):
    return cols(stack(P(la, 'muted'), a, gap=6), stack(P(lb, 'muted'), b, gap=6), gap=40, align='end')


# ================================================================ 01
sec('01')
slide('Dwie wartości, które są razem', stack(
    P('Często dwie liczby <b>należą do siebie</b> i nie ma sensu trzymać ich osobno:'),
    cards(card('Punkt na kratce', '(x, y) — np. <b>(3, 5)</b>', 'tlc'),
          card('Data', '(dzień, miesiąc) — np. <b>(24, 10)</b>', 'puc'),
          card('Wynik zawodnika', '(numer, punkty) — np. <b>(7, 95)</b>', 'orc'), n=3),
    cols(code('''
        int x = 3;    // te dwie zmienne
        int y = 5;    // opisują JEDEN punkt''', cap='do tej pory'),
         stack(P('Działa, ale przy 10 punktach mamy już <b>20</b> osobnych zmiennych: x1, y1, x2, y2, … '
                 'Łatwo pomylić, które x pasuje do którego y.')), t='1fr 1.1fr', align='center'),
    good('potrzebujemy <b>jednej zmiennej</b>, która trzyma <b>dwie wartości naraz</b>. '
         'To jest <b>para</b> — po angielsku <b>pair</b>.', label='Wniosek:')))

slide('Para = pudełko z dwiema przegródkami', stack(
    P('Para to <b>jedna zmienna</b> z <b>dwiema przegródkami</b>. Pierwsza przegródka nazywa się '
      '<b>first</b> (pierwszy), druga — <b>second</b> (drugi).'),
    center(pr(3, 5, name='punkt', size='lg')),
    steps([
        f'Cała para ma <b>jedną nazwę</b> — tutaj {c("punkt")}.',
        'W środku są <b>dokładnie dwie</b> wartości — nie mniej i nie więcej.',
        'Przegródki <b>nie mają numerów</b> jak szufladki w tablicy — mają <b>nazwy</b>: first i second.',
        'Każda przegródka może mieć <b>inny typ</b>, np. litera i liczba — o tym w rozdziale 08.',
    ]), gap=20))

slide('Szablon programu z parą', cols(
    code('''
        #include <iostream>    // cin i cout
        #include <utility>     // tu mieszka pair
        using namespace std;   // pair zamiast std::pair

        int main(){
            // <- tu wpisujemy kod z parami
        }''', cap='szablon każdego programu', hl=(2, 6)),
    stack(P('Para jest w bibliotece <b>utility</b>. Dopisujemy ją na górze, obok iostream.'),
          note(f'W praktyce para często działa już z samym iostream, ale pewniej jest dopisać '
               f'{c("#include <utility>")}.'),
          P('Na kolejnych slajdach często pokazujemy tylko <b>środek main</b> — reszta programu jest '
            'zawsze taka sama jak tutaj.')),
    t='1.25fr 1fr'))

# ================================================================ 02
sec('02')
slide('Budowa linijki, która tworzy parę', stack(
    P('Rozłóżmy na części linijkę z notatek. Każdy kawałek ma swoje zadanie:'),
    anat([('pair', 'pu', 1), ('<int, int>', 'tl', 2), (' ', None, None), ('zmienna', 'or', 3), (';', 'gr', 4)],
         [(1, 'pu', 'pair', '„to będzie <b>para</b>”'),
          (2, 'tl', '<int, int>', 'w nawiasach ostrych: <b>jakie typy</b> przechowuje para — '
                                  'pierwszy typ dla first, drugi dla second'),
          (3, 'or', 'zmienna', '<b>nazwa</b> — wymyślamy ją sami (np. para1, punkt, wynik)'),
          (4, 'gr', ';', '<b>średnik</b> na końcu — jak po każdym poleceniu')]),
    note(f'Razem {c("pair<int, int>")} to <b>typ</b> — tak jak {c("int")}. Dalej jest jak przy zwykłej '
         'zmiennej: typ, nazwa, średnik.')))

slide('Przeczytajmy to po polsku', stack(
    code('pair<int, int> zmienna;', size='lg'),
    cols(steps([
        f'{c("pair")} → „Zrób <b>parę</b>…”',
        f'{c("<int, int>")} → „…w której pierwsza wartość to <b>int</b> i druga wartość to <b>int</b>…”',
        f'{c("zmienna")} → „…i nazwij ją <b>zmienna</b>.”',
    ]), center(pr(('?', 'q'), ('?', 'q'), name='zmienna', types=('int', 'int'), size='lg')),
        t='1.3fr 1fr', align='center'),
    note('Nie podaliśmy żadnych wartości. Co jest wtedy w środku? To temat rozdziału 03.'), gap=20))

slide('Tworzymy parę od razu z wartościami', stack(
    code('pair<int, int> para1 = {0, 3};', size='lg', cap='z notatek'),
    center(pr(0, 3, name='para1', types=('int', 'int'), size='lg')),
    P('Po znaku <b>=</b> w klamrach podajemy <b>dwie wartości</b>, oddzielone przecinkiem. Pierwsza trafia '
      'do <b>first</b>, druga do <b>second</b> — po kolei.'),
    note('Wygląda znajomo? To jak lista inicjalizacyjna z tablic — tylko że w parze zawsze są '
         '<b>dokładnie dwie</b> wartości.'), gap=20))

slide('Więcej przykładów tworzenia', stack(
    P('Każda linijka tworzy jedną parę. Po prawej — co jest w środku:'),
    rows(rowcd('pair<int, int> punkt = {3, 5};', pr(3, 5, name='punkt', size='sm'), 'punkt (x, y)'),
         rowcd('pair<int, int> data = {24, 10};', pr(24, 10, name='data', size='sm'), 'dzień i miesiąc'),
         rowcd('pair<int, int> zawodnik = {7, 95};', pr(7, 95, name='zawodnik', size='sm'), 'numer i punkty'),
         rowcd('pair<int, int> minus = {-4, 0};', pr(-4, 0, name='minus', size='sm'),
               'liczby ujemne i zero też są OK'))))

slide('Kolejność ma znaczenie', stack(
    code('''
        pair<int, int> a = {3, 5};
        pair<int, int> b = {5, 3};''', size='lg'),
    cols(center(pr(3, 5, name='a', size='lg')), center(pr(5, 3, name='b', size='lg'))),
    P('To są <b>dwie różne pary</b>. Pierwsza liczba w klamrach zawsze trafia do <b>first</b>, '
      'druga — do <b>second</b>.'),
    warn('punkt (3, 5) to nie to samo co punkt (5, 3)!'), gap=20))

slide('Para a tablica z dwoma elementami', stack(
    cols(stack(code('int t[2] = {0, 3};', cap='tablica — lekcja 7'), center(arr([0, 3], name='t'))),
         stack(code('pair<int, int> p = {0, 3};', cap='para — dzisiaj'), center(pr(0, 3, name='p'))), gap=30),
    table(['', 'Tablica int t[2]', 'Para pair&lt;int, int&gt; p'], [
        ['<b>dostęp</b>', f'{c("t[0]")}, {c("t[1]")} — numery', f'{c("p.first")}, {c("p.second")} — nazwy'],
        ['<b>ile elementów</b>', 'tyle, ile rozmiar', 'zawsze <b>2</b>'],
        ['<b>typy</b>', 'wszystkie takie same', 'mogą być <b>różne</b> (rozdział 08)'],
    ], widths=['20%', '40%', '40%'], cls='mid')))

# ================================================================ 03
sec('03')
slide('Para bez wartości — co jest w środku?', cols(
    '<div class="zones"><div class="zone glob"><div class="zl">strefa globalna — poza main</div>'
    + bare('''
        #include <iostream>
        #include <utility>
        using namespace std;

        pair<int, int> para1;     // globalna

        int main(){''')
    + '<div class="zone loc"><div class="zl">strefa lokalna — w klamrach main</div>'
    + bare('pair<int, int> para2;  // lokalna') + '</div>' + bare('}') + '</div></div>',
    stack(P('Tak jak przy tablicach, parę można stworzyć <b>globalnie</b> (poza main) albo '
            '<b>lokalnie</b> (w main). Nie podajemy żadnych wartości.'),
          P('Pamiętasz tablice? Tablica bez listy miała <b>zera</b> globalnie, a <b>śmieci</b> lokalnie.'),
          big('A <em>para</em>?')),
    t='1.15fr 1fr'))

slide('Przypadek nr 1: para globalna', cols(
    code('''
        #include <iostream>
        #include <utility>
        using namespace std;

        pair<int, int> para1;   // globalna

        int main(){

        }''', hl=(5,)),
    stack(P('Para stworzona <b>poza main</b> (poza funkcjami i klamrami) ma w środku same zera:'),
          center(pr(0, 0, name='para1', size='lg')),
          good('globalna para bez wartości = <b>{0, 0}</b>. Zupełnie jak globalna tablica.', label='Zapamiętaj:')),
    t='1.1fr 1fr'))

slide('Przypadek nr 2: para lokalna', cols(
    code('''
        #include <iostream>
        #include <utility>
        using namespace std;

        int main(){
            pair<int, int> para2;   // lokalna
        }''', hl=(6,)),
    stack(P('Para stworzona <b>w main</b> też ma w środku… <b>zera</b>!'),
          center(pr(0, 0, name='para2', size='lg')),
          good('para ma wbudowany mechanizm, który przy tworzeniu <b>zawsze zeruje</b> first i second. '
               'Dlatego nawet lokalnie nie ma w niej śmieci.', label='Dlaczego?')),
    t='1.1fr 1fr'))

slide('Para a tablica int — porównanie', stack(
    code('''
        int main(){
            int t[2];               // lokalna tablica int → śmieci
            pair<int, int> p;       // lokalna para        → zera
        }''', size='lg'),
    cols(card('t — lokalna tablica int', arr([(163, 'g'), (35680, 'g')], size='wide') +
              '<div class="cap-o">losowe śmieci — np. 163 i 35680</div>', 'orc'),
         card('p — lokalna para', pr(0, 0, size='lg') + '<div class="cap-t">zawsze {0, 0}</div>', 'tlc'), gap=24),
    note(f'Dobry nawyk i tak: nadawaj parze wartości od razu, np. {c("pair<int, int> p = {0, 0};")} — '
         'od razu widać, co w niej jest.'), gap=18))

# ================================================================ 04
sec('04')
slide('Jak dostać się do jednej przegródki?', stack(
    center('<div class="syntax">nazwa<span>.</span>first &nbsp; nazwa<span>.</span>second</div>'),
    P(f'Piszemy nazwę pary, potem <b>kropkę</b>, a potem {c("first")} albo {c("second")}. '
      f'Kropkę czytamy jak „w środku”: {c("para1.first")} = „first w środku para1”.'),
    cols(code('para1.first    // pierwszy element pary', size='sm'),
         code('para1.second   // drugi element pary', size='sm'), gap=24), gap=22))

slide('`para1.first` i `para1.second`', stack(
    code('pair<int, int> para1 = {0, 3};', size='lg'),
    center(pr(0, 3, name='para1', size='lg', hi=(0, 1))),
    table(['Zapis', 'Co oznacza', 'Wartość'], [
        [c('para1.first'), 'przechowuje <b>pierwszy</b> element pary', '<b>0</b>'],
        [c('para1.second'), 'przechowuje <b>drugi</b> element pary', '<b>3</b>'],
    ], widths=['30%', '50%', '20%'], cls='big'), gap=20))

slide('Wypisujemy first', stack(
    code('''
        pair<int, int> para1 = {0, 3};
        cout << para1.⟦first⟧ << endl;''', size='lg', hl=(2,)),
    center(pr(0, 3, name='para1', size='lg', hi=(0,), sel=(0,))),
    cols(steps([f'C++ bierze parę {c("para1")}.',
                'Zagląda do przegródki <b>first</b>.',
                'Wyjmuje to, co tam leży: <b>0</b>.',
                f'{c("cout")} wypisuje 0, a {c("endl")} przechodzi do nowej linii.'], cls='tight'),
         term('0'), t='1.7fr 1fr'), gap=18))

slide('Wypisujemy second', stack(
    code('''
        pair<int, int> para1 = {0, 3};
        cout << para1.⟦second⟧ << endl;''', size='lg', hl=(2,)),
    center(pr(0, 3, name='para1', size='lg', hi=(1,), sel=(1,))),
    cols(steps([f'C++ bierze parę {c("para1")}.',
                'Zagląda do przegródki <b>second</b>.',
                'Wyjmuje to, co tam leży: <b>3</b>.',
                f'{c("cout")} wypisuje 3.'], cls='tight'),
         term('3'), t='1.7fr 1fr'), gap=18))

slide('first i second działają jak zwykłe zmienne', stack(
    P(f'{c("punkt.first")} to po prostu liczba int. Można jej użyć wszędzie tam, gdzie zwykłej zmiennej: '
      'przypisać, dodać, pomnożyć, wypisać.'),
    cols(code('''
        pair<int, int> punkt = {3, 5};

        int x = punkt.first;                         // x = 3
        cout << x << endl;
        cout << punkt.first + punkt.second << endl;  // 3 + 5
        cout << punkt.second * 10 << endl;           // 5 * 10'''),
         term('3\n8\n50'), t='1fr 180px'),
    center(pr(3, 5, name='punkt', hi=(0, 1)))))

slide('Para nie ma indeksów', cols(
    stack(code('cout << para1[0];   // BŁĄD', cap='źle — para to nie tablica', size='lg', bad=True),
          code('cout << para1.first;', cap='dobrze', size='lg', good=True),
          P('W tablicy szufladki mają <b>numery</b>: t[0], t[1]. W parze przegródki mają <b>nazwy</b>: '
            'first i second. Nawiasów kwadratowych przy parze <b>nie używamy</b>.')),
    stack(center(pr(0, 3, name='para1', size='lg')),
          warn(f'nie ma też {c(".third")} — para ma <b>tylko dwa</b> elementy: first i second.')),
    t='1.15fr 1fr'))

# ================================================================ 05
sec('05')
slide('Wypisujemy całą parę — kod z notatek', stack(
    code('cout << para1.first << " " << para1.second;', size='lg'),
    center(pr(0, 3, name='para1', size='lg', hi=(0, 1))),
    cols(steps([f'{c("cout << para1.first")} — wypisuje <b>0</b>.',
                f'{c("<< \" \"")} — wypisuje <b>spację</b>, żeby liczby się nie skleiły.',
                f'{c("<< para1.second")} — wypisuje <b>3</b>.'], cls='tight'),
         term('0 3'), t='1.7fr 1fr'), gap=18))

slide('Nie da się wypisać pary jednym `cout`', cols(
    stack(code('''
            pair<int, int> para1 = {0, 3};
            cout << para1 << endl;   // BŁĄD''', bad=True, cap='tak NIE robimy'),
          term("error: no match for 'operator<<'", cap='kompilator mówi'),
          P('Przy tablicy pojawiał się dziwny adres. Przy parze jest jeszcze prościej: program '
            '<b>w ogóle się nie skompiluje</b>. cout nie wie, jak wypisać całą parę.')),
    stack(big('<strong>Nie da się</strong><br>wypisać pary<br>jednym <em>cout</em>.'),
          good('wypisujemy <b>first</b> i <b>second</b> osobno, a pomiędzy nimi spację.', label='Zasada:')),
    t='1.35fr 1fr'))

slide('Różne sposoby wypisania tej samej pary', stack(
    code('pair<int, int> p = {3, 5};', cap='para, którą wypisujemy'),
    table(['Kod', 'Na ekranie'], [
        [c('cout << p.first << " " << p.second << endl;'), c('3 5')],
        [c('cout << "(" << p.first << ", " << p.second << ")" << endl;'), c('(3, 5)')],
        [c('cout << p.second << " " << p.first << endl;'), c('5 3') + ' — odwrotnie'],
        [c('cout << p.first << endl << p.second << endl;'), '3 i 5 w dwóch liniach'],
    ], widths=['68%', '32%'], cls='big'),
    note(f'Spację można zapisać w cudzysłowie {c(chr(34) + " " + chr(34))} albo w apostrofach {c(chr(39) + " " + chr(39))} '
         '— oba działają tak samo.')))

slide('Cały program', cols(
    code('''
        #include <iostream>
        #include <utility>
        using namespace std;

        int main(){
            pair<int, int> para1 = {0, 3};
            cout << para1.first << " " << para1.second << endl;
        }''', size='sm', hl=(6, 7)),
    stack(term('0 3'),
          note('Para stoi w main, więc jest <b>lokalna</b> — ale ma wartości od razu, więc w środku jest '
               'dokładnie {0, 3}.')),
    t='1.45fr 1fr'))

# ================================================================ 06
sec('06')
slide('Wpisujemy nową wartość do first', stack(
    code('''
        pair<int, int> para1 = {0, 3};
        para1.first = 5;''', size='lg', hl=(2,)),
    center(before_after(pr(0, 3, name='para1', size='lg', sel=(0,)), pr(5, 3, name='para1', size='lg', hi=(0,)))),
    note('Zmieniamy <b>tylko first</b>: stare 0 znika, w jego miejscu jest 5. '
         'second zostaje bez zmian (3).'), gap=20))

slide('Tak samo z second', stack(
    code('''
        // para1 = {5, 3}
        para1.second = 10;''', size='lg', hl=(2,)),
    center(before_after(pr(5, 3, name='para1', size='lg', sel=(1,)), pr(5, 10, name='para1', size='lg', hi=(1,)))),
    note('Teraz zmieniamy <b>tylko second</b>: 3 → 10. first zostaje bez zmian (5).'), gap=20))

slide('Przypomnienie: skróty `++`, `*=`, `%=`', stack(
    table(['Skrót', 'To samo co', 'Co robi'], [
        [c('x++'), c('x = x + 1'), 'zwiększa o 1'],
        [c('x += 4'), c('x = x + 4'), 'dodaje 4'],
        [c('x -= 4'), c('x = x - 4'), 'odejmuje 4'],
        [c('x *= 20'), c('x = x * 20'), 'mnoży przez 20'],
        [c('x %= 10'), c('x = x % 10'), 'zostawia resztę z dzielenia przez 10'],
    ], widths=['22%', '32%', '46%'], cls='big'),
    good(f'te skróty działają z {c("para1.first")} i {c("para1.second")} dokładnie tak samo jak ze zwykłą zmienną.',
         label='Ważne:')))

slide('`para1.first++`', stack(
    code('''
        // para1 = {5, 10}
        para1.first++;''', size='lg', hl=(2,)),
    center(before_after(pr(5, 10, name='para1', size='lg', sel=(0,)), pr(6, 10, name='para1', size='lg', hi=(0,)))),
    note('first było <b>5</b>. Dodajemy 1 → <b>6</b>. second się nie zmienia.'), gap=20))

slide('`para1.second *= 20`', stack(
    code('''
        // para1 = {6, 10}
        para1.second *= 20;''', size='lg', hl=(2,)),
    center(before_after(pr(6, 10, name='para1', size='lg', sel=(1,)), pr(6, 200, name='para1', size='lg', hi=(1,)))),
    note('second było <b>10</b>. Mnożymy przez 20 → 10 · 20 = <b>200</b>.'), gap=20))

slide('`para1.first %= 10`', stack(
    code('''
        // para1 = {6, 200}
        para1.first %= 10;''', size='lg', hl=(2,)),
    center(before_after(pr(6, 200, name='para1', size='lg', sel=(0,)), pr(6, 200, name='para1', size='lg', hi=(0,)))),
    note('first było <b>6</b>. Reszta z dzielenia 6 przez 10 to <b>6</b> — więc wartość się nie zmienia. '
         'Gdyby first było 26, zostałoby 6.'), gap=20))

slide('Wszystkie zmiany z notatek po kolei', cols(
    stack(code('''
            pair<int, int> para1 = {0, 3};   // start
            para1.first = 5;                 // krok 1
            para1.second = 10;               // krok 2
            para1.first++;                   // krok 3
            para1.second *= 20;              // krok 4
            para1.first %= 10;               // krok 5
            cout << para1.first << " " << para1.second;''', size='sm'),
          term('6 200')),
    stack(*[f'<div>{pr(a, b, name=n, size="sm", labels=None, hi=h)}</div>' for n, a, b, h in [
        ('start', 0, 3, ()), ('krok 1', 5, 3, (0,)), ('krok 2', 5, 10, (1,)), ('krok 3', 6, 10, (0,)),
        ('krok 4', 6, 200, (1,)), ('krok 5', 6, 200, (0,))]], gap=6),
    t='1.6fr 1fr'))

# ================================================================ 07
sec('07')
slide('Nowe wartości dla obu naraz', stack(
    code('''
        // para1 = {6, 200}
        para1 = {3, 7};''', size='lg', hl=(2,), cap='z notatek'),
    center(before_after(pr(6, 200, name='para1', size='lg'), pr(3, 7, name='para1', size='lg', hi=(0, 1)))),
    cols(code('''
            para1.first = 3;
            para1.second = 7;''', cap='dwie linijki…'),
         code('para1 = {3, 7};', cap='…albo jedna — to samo'), gap=24),
    P('Gdy zmieniamy <b>oba</b> elementy, przypisujemy całą parę naraz — w klamrach, jak przy tworzeniu.'),
    gap=16))

slide('Nowa para zbudowana ze starej', stack(
    code('''
        // para1 = {3, 7}
        para1 = {para1.first + 1, para1.second * 2};''', size='lg', hl=(2,), cap='z notatek'),
    cols(steps([
        'C++ najpierw liczy to, co w klamrach — używając <b>starych</b> wartości: '
        '3 + 1 = <b>4</b> oraz 7 · 2 = <b>14</b>.',
        'Dopiero potem wkłada obie nowe liczby do pary: first = 4, second = 14.',
    ]), center(before_after(pr(3, 7, name='para1', size='sm'), pr(4, 14, name='para1', size='sm', hi=(0, 1)))),
        t='1.1fr 1fr', align='center'),
    term('4 14', cap='na ekranie po cout << para1.first << " " << para1.second'), gap=18))

slide('Jeden element czy dwa naraz?', cols(
    stack(P('<b>Modyfikowanie jednego</b>', 'cen'),
          code('''
              para1.first = 5;
              para1.second = 10;
              para1.first++;
              para1.second *= 20;
              para1.first %= 10;'''),
          note('Zmienia się <b>tylko</b> ta przegródka, którą wskazujemy po kropce.')),
    stack(P('<b>Modyfikowanie dwóch</b>', 'cen'),
          code('''
              para1 = {3, 7};
              para1 = {para1.first + 1, para1.second * 2};''', size='sm'),
          note('Nowe wartości dla <b>first i second</b> naraz — w klamrach, po kolei.')),
    t='1fr 1.25fr'))

# ================================================================ 08
sec('08')
slide('W nawiasach ostrych wybieramy typy', stack(
    P('Typy w parze nie muszą być takie same. Przykład z notatek:'),
    anat([('pair<', None, None), ('char', 'tl', 1), (', ', None, None), ('int', 'or', 2), ('> para2 = {', None, None),
          ("'c'", 'tl', 3), (', ', None, None), ('123', 'or', 4), ('};', None, None)],
         [(1, 'tl', 'char', 'typ <b>first</b> — jeden znak'),
          (2, 'or', 'int', 'typ <b>second</b> — liczba całkowita'),
          (3, 'tl', "'c'", 'wartość first — znak w apostrofach'),
          (4, 'or', '123', 'wartość second')]),
    note('W nawiasach ostrych &lt; &gt; piszemy, <b>jakie typy przechowuje nasza para</b>. '
         'Pierwszy typ jest dla first, drugi — dla second.')))

slide('`para2` krok po kroku', cols(
    stack(code('''
            pair<char, int> para2 = {'c', 123};
            cout << para2.first << endl;    // c
            cout << para2.second << endl;   // 123'''),
          term('c\n123')),
    stack(center(pr("'c'", 123, name='para2', types=('char', 'int'), size='lg')),
          note('first jest typu <b>char</b>, więc trzyma literę. second jest typu <b>int</b>, '
               'więc trzyma liczbę.')),
    t='1.2fr 1fr'))

slide('Więcej par z różnymi typami', stack(
    rows(rowcd('pair<string, int> uczen = {"Ala", 95};', pr('Ala', 95, name='uczen', types=('string', 'int'), size='sm'),
               'imię i punkty', w=520),
         rowcd('pair<int, double> pomiar = {3, 36.6};', pr(3, 36.6, name='pomiar', types=('int', 'double'), size='sm'),
               'dzień i temperatura', w=520),
         rowcd("pair<char, char> znaki = {'x', 'y'};", pr("'x'", "'y'", name='znaki', types=('char', 'char'), size='sm'),
               'dwa znaki', w=520)),
    note(f'string znasz z poprzedniej lekcji. Gdy używasz go w parze, dopisz na górze {c("#include <string>")}.')))

slide('Kolejność typów = kolejność wartości', cols(
    stack(code('''
            pair<char, int> p = {123, 'c'};   // odwrotnie!
            cout << p.first << " " << p.second;''', bad=True, cap='źle'),
          term('{ 99'),
          P("Program się skompiluje, ale wynik jest dziwny: liczba 123 wpadła do <b>char</b> — "
            "C++ zamienił ją na znak o numerze 123, czyli <b>{</b>. A znak 'c' wpadł do <b>int</b> — "
            "jako swój numer, czyli <b>99</b>.")),
    stack(center(pr('{', 99, name='p', types=('char', 'int'), size='lg')),
          good('pierwsza wartość pasuje do pierwszego typu, druga — do drugiego: '
               f"{c(chr(123) + chr(39) + 'c' + chr(39) + ', 123' + chr(125))}.", label='Zawsze:')),
    t='1.25fr 1fr'))

# ================================================================ 09
sec('09')
slide('W tablicy mogą leżeć pary', stack(
    P('Na lekcji o tablicach w szufladkach leżały liczby. Ale w szufladce może leżeć też <b>para</b>!'),
    anat([('pair<int, int>', 'pu', 1), (' ', None, None), ('lista1', 'tl', 2), ('[3]', 'or', 3), (';', 'gr', 4)],
         [(1, 'pu', 'pair<int, int>', 'typ <b>każdej szufladki</b> — para dwóch intów'),
          (2, 'tl', 'lista1', '<b>nazwa</b> tablicy'),
          (3, 'or', '[3]', '<b>rozmiar</b> — 3 szufladki, w każdej jedna para'),
          (4, 'gr', ';', '<b>średnik</b>')]),
    center(parr([(0, 0)] * 3, name='lista1'))))

slide('Tablica par od razu z wartościami', stack(
    code('pair<int, int> lista2[3] = {⟦{0, 0}⟧, ⟦{1, 5}⟧, ⟦{-1, 7}⟧};', size='lg', cap='wartości z notatek'),
    center(parr(L2, name='lista2', size='', members=True)),
    P('<b>Klamry w klamrach</b>: zewnętrzne klamry to cała tablica, wewnętrzne (w ramkach) — kolejne pary. '
      'Każda para trafia do następnej szufladki.'),
    note(f'Rozmiar można pominąć, tak jak w tablicy int: {c("pair<int, int> lista2[] = {{0, 0}, {1, 5}, {-1, 7}};")} '
         '— C++ policzy 3 pary.'), gap=18))

slide('Tablica par bez wartości', stack(
    code('pair<int, int> lista3[4];', size='lg', cap='z notatek (tam z vectorem — zobaczysz go na następnej lekcji)'),
    center(parr([(0, 0)] * 4, name='lista3', size='')),
    P('Każda szufladka to para, a każda para przy tworzeniu <b>sama się zeruje</b>. Dlatego w tablicy par '
      'bez wartości są same <b>{0, 0}</b> — i globalnie, <b>i lokalnie</b>.'),
    note('Inaczej niż w lokalnej tablicy int, gdzie były śmieci!'), gap=18))

slide('Najpierw indeks, potem kropka', stack(
    center('<div class="syntax">lista2<span>[1]</span>.first</div>'),
    cols(steps([f'{c("lista2")} — bierzemy tablicę.',
                f'{c("[1]")} — idziemy do szufladki o indeksie 1. Leży tam <b>para {{1, 5}}</b>.',
                f'{c(".first")} — z tej pary bierzemy first → <b>1</b>.']),
         center(parr(L2, name='lista2', hi=(1,), hm={(1, 0)}, ptr={1: '[1]'})), t='1fr 1fr', align='center'),
    warn(f'kolejność jest ważna: {c("lista2[1].first")}, a nie {c("lista2.first[1]")}. '
         'Najpierw wybieramy szufladkę, potem przegródkę.'), gap=20))

slide('Odczyt z tablicy par — przykłady', cols(
    code('''
        pair<int, int> lista2[3] = {{0, 0}, {1, 5}, {-1, 7}};

        cout << lista2[1].first << endl;    // 1
        cout << lista2[1].second << endl;   // 5
        cout << lista2[2].first << endl;    // -1
        cout << lista2[2].second << endl;   // 7''', size='sm'),
    term('1\n5\n-1\n7'), t='1fr 200px'),
    center(parr(L2, name='lista2', size='', hm={(1, 0), (1, 1), (2, 0), (2, 1)}, members=True)),
    note(f'{c("lista2[1]")} to cała para {{1, 5}}. Dopiero {c(".first")} albo {c(".second")} wybiera z niej jedną liczbę.'))

slide('Zmiana w tablicy par', stack(
    code('''
        pair<int, int> lista2[3] = {{0, 0}, {1, 5}, {-1, 7}};
        lista2[0].first = 9;    // zmienia JEDNĄ liczbę w parze
        lista2[2] = {4, 4};     // zmienia CAŁĄ parę''', size='lg', hl=(2, 3)),
    center(before_after(parr(L2, name='lista2', size='sm'),
                        parr([(9, 0), (1, 5), (4, 4)], name='lista2', size='sm', hm={(0, 0), (2, 0), (2, 1)}))),
    note('To te same dwa sposoby co przy pojedynczej parze: przez kropkę zmieniamy <b>jeden</b> element, '
         'przez klamry — <b>oba</b>.'), gap=20))

slide('Wypełnianie tablicy par pętlą', cols(
    stack(code('''
            pair<int, int> lista4[2];
            for(int i = 0; i < 2; i++){
                lista4[i] = {1, 1};
            }''', size='lg'),
          P('Tak jak na lekcji o tablicach: pętla przechodzi po indeksach i do <b>każdej</b> szufladki '
            'wpisuje parę {1, 1}.')),
    stack(P('przed', 'muted'), parr([(0, 0)] * 2, name='lista4', size=''),
          P('po', 'muted'), parr([(1, 1)] * 2, name='lista4', size='', hi=(0, 1)),
          note('W notatkach ten przykład był z vectorem: lista4(2, {1, 1}) — dwie pary {1, 1}.')),
    t='1.1fr 1fr'))

slide('Pary zależne od `i`', stack(
    cols(code('''
            pair<int, int> lista[5];
            for(int i = 0; i < 5; i++){
                lista[i] = {i, i * i};
            }''', size='lg'),
         P('W każdym obrocie robimy parę z dwóch liczb: <b>i</b> oraz <b>i · i</b>. '
           'Dla i = 3 to para {3, 9}.'), t='1.2fr 1fr', align='center'),
    center(parr([(k, k * k) for k in range(5)], name='lista', hi=(3,), members=True)), gap=24))

PRINT3 = '''
    pair<int, int> lista2[3] =
        {{0, 0}, {1, 5}, {-1, 7}};
    for(int i = 0; i < 3; i++){
        cout << lista2[i].first << " "
             << lista2[i].second << endl;
    }'''
slide('Wypisywanie całej tablicy par', cols(
    stack(code(PRINT3, size='sm'),
          P('Jedna linijka wyjścia = jedna para. Dla czytelności polecenie cout jest rozbite na <b>dwie linijki</b> '
            '— to wciąż jedno polecenie, kończy się dopiero na średniku.')),
    stack(term('0 0\n1 5\n-1 7'), note('Pętla idzie po indeksach 0, 1, 2 — jak przy tablicy int. '
                                       'W środku wypisujemy first, spację, second i endl.')),
    t='1.35fr 1fr'))

for i in range(4):
    out = '\n'.join(f'{a} {b}' for a, b in L2[:i]) + '\n'
    if i < 3:
        a, b = L2[i]
        state = kv([('i', f'<b>{i}</b>'),
                    ('warunek', f'{c(f"{i} < 3")} → <b class="yes">TAK</b>'),
                    ('wypisujemy', f'{c(f"lista2[{i}].first")} = <b>{a}</b>, spację, '
                                   f'{c(f"lista2[{i}].second")} = <b>{b}</b>, nową linię')])
        slide(f'Obrót {i + 1} z 3: `i = {i}`', cols(
            stack(code(PRINT3, size='sm', hl=(3, 4, 5), dim=True), term(out.lstrip('\n'), cursor=True)),
            stack(state, center(parr(L2, name='lista2', hi=(i,), ptr={i: f'i = {i}'}))), t='1fr 1fr'))
    else:
        slide('`i = 3`: koniec pętli', cols(
            stack(code(PRINT3, size='sm', hl=(3,), dim=True), term(out, cursor=True)),
            stack(kv([('i', '<b>3</b>'), ('warunek', c('3 < 3') + ' → <b class="no">NIE</b> — koniec pętli')]),
                  center(parr(L2, name='lista2')),
                  good('wypisaliśmy wszystkie 3 pary, każdą w osobnej linii.', label='Gotowe:')), t='1fr 1fr'))

# ================================================================ 10
sec('10')
slide('Para pomocnicza `tmp`', cols(
    stack(code('''
            pair<int, int> lista[10];
            pair<int, int> tmp = {3, 5};
            lista[0] = tmp;''', size='lg'),
          steps([f'Tablica na 10 par — na razie same {{0, 0}}.',
                 f'Robimy parę pomocniczą {c("tmp")} = {{3, 5}}.',
                 f'{c("lista[0] = tmp;")} — <b>kopia</b> tmp ląduje w szufladce 0.'], cls='tight')),
    stack(P('Czasem najpierw robimy parę <b>pomocniczą</b> (tymczasową), a dopiero potem wkładamy ją do tablicy. '
            'Taką parę często nazywa się <b>tmp</b> — od angielskiego „temporary”, czyli tymczasowy.'),
          center(pr(3, 5, name='tmp', size='sm')),
          parr([(3, 5), (0, 0), (0, 0), 'dots'], name='lista', idxs=['0', '1', '2', '…'], hi=(0,))),
    t='1.05fr 1fr'))

slide('`make_pair` — para bez nazwy', stack(
    cols(code('''
            pair<int, int> tmp = {3, 5};
            lista[0] = tmp;''', cap='z parą tmp', size='lg'),
         big('<em>=</em>'),
         code('lista[0] = make_pair(3, 5);', cap='z make_pair', size='lg'),
         t='1fr 60px 1fr', align='center'),
    P('To jest <b>to samo</b>! Zamiast robić osobną parę tmp, piszemy od razu ' + c('make_pair(3, 5)') + '.'),
    note('make_pair tworzy parę „w locie” — <b>bez nazwy</b> i bez osobnej linijki. Taka para żyje tylko chwilę: '
         'dokładnie tyle, żeby ją gdzieś wpisać. Dlatego nazywamy ją <b>tymczasową</b>.'),
    center(parr([(3, 5), (0, 0), (0, 0), 'dots'], name='lista', idxs=['0', '1', '2', '…'], hi=(0,))), gap=18))

slide('Budowa `make_pair`', stack(
    anat([('make_pair', 'pu', 1), ('(', None, None), ('3', 'tl', 2), (', ', None, None), ('5', 'or', 3), (')', None, None)],
         [(1, 'pu', 'make_pair', '„zrób parę”'),
          (2, 'tl', '3', 'pierwsza wartość — trafi do <b>first</b>'),
          (3, 'or', '5', 'druga wartość — trafi do <b>second</b>')]),
    note(f'Typy C++ <b>zgaduje sam</b> z podanych wartości: {c("make_pair(3, 5)")} to para dwóch intów, '
         f'a {c("make_pair(" + chr(39) + "c" + chr(39) + ", 123)")} to para char i int.')))

slide('Trzy sposoby — ten sam efekt', stack(
    table(['Sposób', 'Kod', 'Wynik'], [
        ['z parą <b>tmp</b>', c('pair<int, int> tmp = {3, 5};') + '<br>' + c('lista[0] = tmp;'), c('lista[0] = {3, 5}')],
        ['<b>make_pair</b>', c('lista[0] = make_pair(3, 5);'), c('lista[0] = {3, 5}')],
        ['<b>klamry</b>', c('lista[0] = {3, 5};'), c('lista[0] = {3, 5}')],
    ], widths=['18%', '52%', '30%'], cls='big'),
    note('Wszystkie trzy dają dokładnie to samo. make_pair przydaje się szczególnie, gdy wartości mamy '
         'w zmiennych — np. zaraz po wczytaniu z klawiatury (następny rozdział).')))

slide('`make_pair` ze zmiennymi', cols(
    code('''
        int a = 3;
        int b = 5;
        pair<int, int> lista[10];
        lista[0] = make_pair(a, b);           // {3, 5}
        lista[1] = make_pair(b, a);           // {5, 3}
        lista[2] = make_pair(a + b, a * b);   // {8, 15}''', size='sm'),
    stack(parr([(3, 5), (5, 3), (8, 15), 'dots'], name='lista', idxs=['0', '1', '2', '…'], hi=(0, 1, 2)),
          note('Do make_pair można wstawić zmienne, a nawet całe działania — C++ najpierw je policzy.')),
    t='1.3fr 1fr'))

# ================================================================ 11
sec('11')
IN3 = [['3'], ['1', '5'], ['-2', '4'], ['0', '7']]
P3 = [(1, 5), (-2, 4), (0, 7)]
slide('Jak wygląda wejście?', cols(
    stack(term('n\nx<sub>0</sub> y<sub>0</sub>\nx<sub>1</sub> y<sub>1</sub>\n…\nx<sub>n-1</sub> y<sub>n-1</sub>',
               'in', cap='format wejścia', raw=True),
          P('W pierwszej linii <b>n</b> — ile par. Potem <b>n linijek</b>, w każdej <b>dwie liczby</b>, '
            'czyli jedna para.')),
    stack(term('3\n1 5\n-2 4\n0 7', 'in', cap='przykład'),
          P('Tutaj n = 3, więc są 3 linijki z parami.'),
          parr(P3, name='lista', members=True))))

READP = '''
    pair<int, int> lista[100]; // 100 >= n
    int n;
    cin >> n;
    for(int i = 0; i < n; i++){
        cin >> lista[i].first >> lista[i].second;
    }'''
slide('Sposób 1: wczytujemy prosto do first i second', cols(
    code(READP, hl=(5,), size='sm'),
    stack(P(f'W każdym obrocie pętli {c("cin")} czyta <b>dwie</b> liczby: pierwszą wkłada do '
            f'{c("lista[i].first")}, drugą do {c("lista[i].second")}.'),
          note('Tablica jest z zapasem — dokładnie jak na lekcji o tablicach. Pętla idzie do <b>n</b>, a nie do 100.')),
    t='1.15fr 1fr'))


def read_parr(k, hi=None):
    vals = [P3[j] if j < k else (Z, Z) for j in range(3)] + ['dots']
    return parr(vals, name='lista', idxs=['0', '1', '2', '…'], hi=(hi,) if hi is not None else (),
                ptr={hi: f'i = {hi}'} if hi is not None else None)


slide('Wczytujemy przykład — start: `n = 3`', stack(
    cols(code(READP, hl=(3,), dim=True, size='sm'),
         stack(inp_tokens(IN3, used=0, cur=0), kv([('robimy', c('cin >> n;')), ('n', '<b>3</b>')])),
         t='1.15fr 1fr'),
    center(read_parr(0)),
    note('Szare zera to pary, do których jeszcze nic nie wczytaliśmy (para sama się zeruje).')))

for k in range(3):
    a, b = P3[k]
    slide(f'Obrót {k + 1} z 3: `i = {k}`', stack(
        cols(code(READP, hl=(4, 5), dim=True, size='sm'),
             stack(inp_tokens(IN3, used=1 + 2 * k, cur=(1 + 2 * k, 2 + 2 * k)),
                   kv([('i', f'<b>{k}</b>'), ('warunek', f'{c(f"{k} < 3")} → <b class="yes">TAK</b>'),
                       ('wczytane', f'<b>{a}</b> → {c(f"lista[{k}].first")}, <b>{b}</b> → {c(f"lista[{k}].second")}')])),
             t='1.15fr 1fr'),
        center(read_parr(k + 1, hi=k))))

slide('Koniec wczytywania: `i = 3`', stack(
    cols(code(READP, hl=(4,), dim=True, size='sm'),
         stack(inp_tokens(IN3, used=7), kv([('i', '<b>3</b>'), ('warunek', c('3 < 3') + ' → <b class="no">NIE</b>')])),
         t='1.15fr 1fr'),
    center(read_parr(3)),
    good('wszystkie 3 pary leżą w szufladkach 0, 1, 2 — czyli <b>0…n-1</b>.', label='Gotowe:')))

slide('Sposób 2: zmienne pomocnicze i `make_pair`', cols(
    code('''
        for(int i = 0; i < n; i++){
            int a, b;
            cin >> a >> b;
            lista[i] = make_pair(a, b);
        }''', size='lg', hl=(2, 3, 4)),
    stack(steps(['Tworzymy dwie zwykłe zmienne <b>a</b> i <b>b</b>.',
                 'Wczytujemy do nich dwie liczby z linijki.',
                 f'Robimy z nich tymczasową parę {c("make_pair(a, b)")} i wkładamy ją do szufladki i.']),
          note(f'Efekt jest taki sam jak w sposobie 1. Zamiast make_pair można też napisać {c("{a, b}")}.')),
    t='1.1fr 1fr'))

slide('Wczytaj i wypisz — cały program', cols(
    code('''
        #include <iostream>
        #include <utility>
        using namespace std;

        int main(){
            pair<int, int> lista[100]; // 100 >= n
            int n;
            cin >> n;
            for(int i = 0; i < n; i++){
                cin >> lista[i].first >> lista[i].second;
            }
            for(int i = 0; i < n; i++){
                cout << lista[i].first << " "
                     << lista[i].second << endl;
            }
        }''', size='sm'),
    stack(term('3\n1 5\n-2 4\n0 7', 'in'), term('1 5\n-2 4\n0 7')),
    t='1.45fr 1fr'))

slide('Ten sam program — inne wejścia', stack(
    P('Nie zmieniamy <b>ani jednej linijki</b> kodu — program sam dopasowuje się do n:'),
    cols(stack(term('1\n10 20', 'in', cap='wejście'), term('10 20')),
         stack(term('2\n4 4\n-1 0', 'in', cap='wejście'), term('4 4\n-1 0')),
         stack(term('4\n1 2\n3 4\n5 6\n7 8', 'in', cap='wejście'), term('1 2\n3 4\n5 6\n7 8')), gap=24),
    note('Działa dla każdego n od 1 do 100 — bo tyle par mieści tablica.')))

# ================================================================ 12
sec('12')
slide('W parze może leżeć… para', stack(
    P('W nawiasach ostrych może stać <b>dowolny typ</b> — także inna para! Wtedy first jest całą parą.'),
    code('pair<pair<int, int>, int> p = {{1, 2}, 3};', size='lg'),
    center(npr(1, 2, 3, 'p', size='lg')),
    note('Przykład z życia: punkt (x, y) i jego numer → {{x, y}, numer}. W notatkach w parze leżały '
         'jeszcze inne struktury — poznasz je na kolejnych lekcjach.'), gap=20))

slide('Jak dostać się do środka?', stack(
    table(['Zapis', 'Co to jest', 'Wartość'], [
        [c('p.first'), 'cała wewnętrzna para', '<b>{1, 2}</b>'],
        [c('p.first.first'), 'first wewnętrznej pary', '<b>1</b>'],
        [c('p.first.second'), 'second wewnętrznej pary', '<b>2</b>'],
        [c('p.second'), 'drugi element zewnętrznej pary', '<b>3</b>'],
    ], widths=['32%', '48%', '20%'], cls='big'),
    cols(code('cout << p.first.first << " " << p.first.second << " " << p.second;', size='sm'),
         term('1 2 3'), t='1fr 200px'),
    note('Czytamy od lewej: p → .first (wchodzimy do wewnętrznej pary) → .first (bierzemy jej pierwszy element).')))

# ================================================================ 13
sec('13')


def quiz(n, title, body, answer_title, answer):
    slide(f'Pytanie {n}: {title}', body,
          P('Zastanów się i zapisz odpowiedź, <b>zanim</b> przejdziesz dalej.', 'muted cen'))
    slide(f'Odpowiedź {n}: {answer_title}', answer)


quiz(1, 'co wypisze program?', cols(
    code('''
        pair<int, int> p = {4, 9};
        cout << p.second << " " << p.first << endl;''', size='lg'),
    term('?'), t='1.6fr 1fr', align='center'),
    '`9 4`', stack(
        center(pr(4, 9, name='p', size='lg', hi=(0, 1))),
        cols(steps([f'Najpierw wypisujemy {c("p.second")} → <b>9</b>.',
                    'Potem spację.',
                    f'Na końcu {c("p.first")} → <b>4</b>. Kolejność w cout decyduje o kolejności na ekranie.']),
             term('9 4'), t='1.6fr 1fr')))

quiz(2, 'para bez wartości', cols(
    code('''
        int main(){
            pair<int, int> p;
            cout << p.first << " " << p.second;
        }''', size='lg'),
    term('?'), t='1.6fr 1fr', align='center'),
    '`0 0`', stack(
        center(pr(0, 0, name='p', size='lg')),
        cols(note('Para jest lokalna (w main), ale para <b>zawsze sama się zeruje</b> — '
                  'nie ma w niej śmieci, inaczej niż w lokalnej tablicy int.'),
             term('0 0'), t='1.6fr 1fr')))

quiz(3, 'zmiany po kolei', cols(
    code('''
        pair<int, int> p = {2, 5};
        p.first++;
        p.second *= 3;
        p.first %= 2;
        cout << p.first << " " << p.second;''', size='lg'),
    term('?'), t='1.6fr 1fr', align='center'),
    '`1 15`', cols(
        table(['Linijka', 'first', 'second'], [
            [c('p = {2, 5}'), '2', '5'],
            [c('p.first++'), '<b>3</b>', '5'],
            [c('p.second *= 3'), '3', '<b>15</b>'],
            [c('p.first %= 2'), '<b>1</b>', '15'],
        ], widths=['50%', '25%', '25%'], cls='big'),
        stack(center(pr(1, 15, name='p', size='lg', hi=(0, 1))), term('1 15'),
              note('3 % 2 = 1 — reszta z dzielenia 3 przez 2.')),
        t='1.1fr 1fr'))

quiz(4, 'zamiana miejscami', cols(
    code('''
        pair<int, int> p = {3, 7};
        p = {p.second, p.first};
        cout << p.first << " " << p.second;''', size='lg'),
    term('?'), t='1.6fr 1fr', align='center'),
    '`7 3`', stack(
        center(before_after(pr(3, 7, name='p', size='lg'), pr(7, 3, name='p', size='lg', hi=(0, 1)))),
        cols(steps(['C++ najpierw liczy klamry ze <b>starymi</b> wartościami: {p.second, p.first} = {7, 3}.',
                    'Potem wkłada tę nową parę do p. Elementy zamieniły się miejscami!']),
             term('7 3'), t='1.6fr 1fr')))

quiz(5, 'tablica par', cols(
    code('''
        pair<int, int> t[3] = {{1, 2}, {3, 4}, {5, 6}};
        cout << t[1].first + t[2].second << endl;''', size='sm'),
    term('?'), t='1.6fr 1fr', align='center'),
    '`9`', stack(
        center(parr([(1, 2), (3, 4), (5, 6)], name='t', size='', hm={(1, 0), (2, 1)}, members=True)),
        cols(steps([f'{c("t[1]")} to para {{3, 4}}, więc {c("t[1].first")} = <b>3</b>.',
                    f'{c("t[2]")} to para {{5, 6}}, więc {c("t[2].second")} = <b>6</b>.',
                    '3 + 6 = <b>9</b>.'], cls='tight'),
             term('9'), t='1.6fr 1fr')))

quiz(6, 'znajdź dwa błędy', cols(
    code('''
        pair<int, int> p = {1, 2};
        cout << p << endl;
        cout << p[0] << endl;''', size='lg'),
    stack(P('Program miał wypisać obie liczby z pary. Co jest nie tak?')), t='1.5fr 1fr', align='center'),
    'cout i nawiasy', stack(
        cols(code('''
                cout << ⟦p⟧ << endl;
                cout << p⟦[0]⟧ << endl;''', cap='źle', bad=True),
             code('''
                cout << p.first << " " << p.second << endl;''', cap='dobrze', good=True, size='sm'),
             t='1fr 1.3fr'),
        traps([f'<b>{c("cout << p")}</b> — nie da się wypisać pary jednym cout (błąd kompilacji).',
               f'<b>{c("p[0]")}</b> — para nie ma indeksów. Pierwszy element to {c("p.first")}.'])))

# ================================================================ 14
sec('14')
slide('Najczęstsze błędy (1/2)', traps([
    f'<b>{c("cout << para;")}</b> — nie da się wypisać pary jednym cout (błąd kompilacji). '
    'Wypisz first i second osobno.',
    f'<b>{c("para[0]")}, {c("para[1]")}</b> — para to nie tablica, nie ma indeksów. '
    f'Używamy {c(".first")} i {c(".second")}.',
    f'<b>Trzy wartości.</b> {c("pair<int, int> p = {1, 2, 3};")} — błąd. Para ma zawsze dokładnie dwa elementy; '
    f'nie ma też {c(".third")}.',
    f'<b>Zła kolejność wartości.</b> {c("pair<char, int> p = {123, " + chr(39) + "c" + chr(39) + "};")} — '
    'first to „{”, second to 99. Kolejność wartości = kolejność typów.',
]))

slide('Najczęstsze błędy (2/2)', traps([
    f'<b>Brak kropki albo wielka litera.</b> {c("para1first")}, {c("para1.First")} — C++ rozróżnia wielkość liter. '
    f'Poprawnie: {c("para1.first")}.',
    f'<b>Kolejność w tablicy par.</b> {c("lista.first[1]")} zamiast {c("lista[1].first")} — '
    'najpierw indeks w nawiasach, potem kropka.',
    f'<b>Złe nawiasy przy typach.</b> {c("pair(int, int)")} albo {c("pair[int, int]")} — typy pary piszemy '
    f'w nawiasach ostrych: {c("pair<int, int>")}.',
    f'<b>Zmiana obu bez klamer.</b> {c("para1 = 3, 7;")} — błąd. Poprawnie: {c("para1 = {3, 7};")} '
    f'albo {c("para1 = make_pair(3, 7);")}.',
]))

# ================================================================ 15
sec('15')
slide('Ściąga: para', cards(
    card('Tworzenie z wartościami', c('pair<int, int> p = {0, 3};')),
    card('Bez wartości', c('pair<int, int> p;') + ' → {0, 0} globalnie i lokalnie'),
    card('Pierwszy / drugi element', c('p.first') + ' · ' + c('p.second')),
    card('Wypisanie', c('cout << p.first << " " << p.second;')),
    card('Zmiana jednego', c('p.first = 5;') + ' · ' + c('p.second *= 20;')),
    card('Zmiana obu', c('p = {3, 7};')),
    card('Różne typy', c("pair<char, int> p = {'c', 123};")),
    card('Para tymczasowa', c('make_pair(3, 5)')),
    card('Tablica par', c('pair<int, int> t[3];') + ' → ' + c('t[1].first')),
    card('Cała para jednym cout?', '<b>NIE</b> — first i second osobno'), n=2))

slide('Ściąga: tablica par', cols(
    code('''
        pair<int, int> t[3] = {{0, 0}, {1, 5}, {-1, 7}};''', cap='tablica par z wartościami', size='xs'),
    code('''
        for(int i = 0; i < n; i++){
            t[i] = make_pair(i, i * i);
        }''', cap='wypełnij pętlą', size='sm'),
    t='1fr 1fr', gap=20),
    cols(code('''
            pair<int, int> t[100]; // 100 >= n
            int n;
            cin >> n;
            for(int i = 0; i < n; i++){
                cin >> t[i].first >> t[i].second;
            }''', cap='wczytaj n par', size='sm'),
         code('''
            for(int i = 0; i < n; i++){
                cout << t[i].first << " "
                     << t[i].second << endl;
            }''', cap='wypisz n par', size='sm'), gap=20))

slide('Zadania na koniec — Twoja kolej', steps([
    'Stwórz parę {12, 30} (godzina i minuta) i wypisz ją w formacie <b>12:30</b>.',
    'Stwórz parę {4, 9}, zamień jej elementy miejscami <b>jedną linijką</b> i wypisz ją.',
    'Wczytaj dwie liczby, zrób z nich parę przez <b>make_pair</b> i wypisz najpierw second, potem first.',
    'Wczytaj n (n ≤ 100) i n par liczb. Dla każdej pary wypisz sumę <b>first + second</b> — każdą w osobnej linii.',
    'Wczytaj n par (x, y) i wypisz tylko te, w których <b>x jest większe od y</b>.',
], cls='big'))

build(
    secs=SECS,
    html='pdf-src/prezentacja-pair-cpp.html',
    pdf='prezentacja-pair-cpp-t-olimpians.pdf',
    generator='pdf-src/build-prezentacja-pair.py',
    title='Pary (pair) w C++ — krok po kroku — T-Olimpians',
    brand='pary w C++',
    foot='Pary (pair) w C++ — krok po kroku',
    cover=dict(
        kicker='// T-OLIMPIANS — PREZENTACJA DO LEKCJI',
        h1='Pary w C++<br>— krok po kroku',
        sub='''Wszystko o pair, powoli i po kolei: jak stworzyć parę, co jest w niej na starcie, jak dostać się
      do first i second, jak je wypisać i zmienić, jak zrobić tablicę par, tymczasową parę z make_pair
      i jak wczytać wiele par. Każdy krok na osobnym slajdzie — z kodem i tym, co pojawi się na ekranie.''',
        meta='C++ · LEKCJA 9 · PAIR · PO TABLICACH I STRINGACH',
        deco=pr(0, 3, name='para1', size='sm')),
    end=dict(
        kicker='// KONIEC LEKCJI 9',
        h1='Umiesz już<br>korzystać z par!',
        sub='''Tworzenie, first i second, wypisywanie, zmiana jednego i obu elementów, różne typy, tablica par,
      make_pair i wczytywanie. Teraz zrób zadania z poprzedniego slajdu. Na następnej lekcji: <b>vector</b> —
      tam pary przydadzą się jeszcze bardziej.''',
        deco=parr([(0, 0), (1, 5), (-1, 7)], name='lista', size='sm', idx=False)),
)
