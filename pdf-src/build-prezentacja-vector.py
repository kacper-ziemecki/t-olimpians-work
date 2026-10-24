#!/usr/bin/env python3
"""Prezentacja „Vector w C++ — krok po kroku” (T-Olimpians, lekcja 10).

Generuje pdf-src/prezentacja-vector-cpp.html — poziome slajdy 16:9 w stylu
ściągi Python Turtle — i (z flagą --pdf) drukuje je do
prezentacja-vector-cpp-t-olimpians.pdf przez Playwright (Chromium).
Uczeń zna już tablice (lekcja 7), string (8) i pair (9). Definicje podtablicy,
podzbioru, prefiksu i sufiksu stoją przed zadaniami, a nie wśród nich.

    python3 pdf-src/build-prezentacja-vector.py --pdf
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from prezentacja_lib import *  # noqa: E402,F401,F403

SECS = [
    ('01', 'Czym jest vector?'),
    ('02', 'Tworzenie vectora'),
    ('03', 'Indeksowanie'),
    ('04', 'size, push_back, clear'),
    ('05', 'Więcej metod'),
    ('06', 'Wypisywanie vectora'),
    ('07', 'Pętla for-each i &'),
    ('08', 'Iteratory: begin i end'),
    ('09', 'Wczytywanie vectora'),
    ('10', 'Vector 2D'),
    ('11', 'Podtablica'),
    ('12', 'Podzbiór'),
    ('13', 'Prefiks i sufiks'),
    ('14', 'Zadania'),
    ('15', 'Najczęstsze błędy'),
    ('16', 'Podsumowanie'),
]

LAWKI = ['C', '.', 'L', '.', '.', '.', 'B', '.', '.', 'K', '.', '.']
A9 = [1, 5, 4, -6, 15, 9, 2, 1, 1]                 # tablica z notatek o podtablicach
PS = [5, 4, 9, 1, 3, -5, 2, 1, 1, 7]               # tablica z notatek o prefiksach
P5 = [1, 3, 0, -1, 2]                              # zadanie o sumach prefiksów



def rows(*items):
    return '<div class="rows">' + ''.join(items) + '</div>'


def empty(name):
    return arr([('{ }', 'ghost')], name=name, idx=False)


def before_after(a, b, la='przed', lb='po'):
    return cols(stack(P(la, 'muted'), a, gap=6), stack(P(lb, 'muted'), b, gap=6), gap=40, align='end')


def chain(*states, size='sm'):
    """Kolejne stany vectora jeden pod drugim: (podpis, wartości, podświetlone)."""
    out = []
    for lab, vals, hi in states:
        out.append('<div>' + (arr(vals, name=lab, size=size, idx=False, hi=hi) if vals else empty(lab)) + '</div>')
    return stack(*out, gap=8)


def pick(vals, chosen):
    """Podzbiór: wybrane szufladki podświetlone, reszta wyszarzona."""
    return [v if k in chosen else (v, 'q') for k, v in enumerate(vals)]


def span(vals, i, j, name='', size='sm', label=None, cls='tl', idx=True):
    """Podtablica od i do j z klamrą pod spodem."""
    return arr(vals, name=name, size=size, hi=tuple(range(i, j + 1)), idx=idx,
               spans=[(i, j - i + 1, label or f'od {i} do {j}', cls)])


VENN = '''<svg class="venn" viewBox="0 0 520 300" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="260" cy="150" rx="250" ry="140" fill="rgba(124,92,255,.07)" stroke="#7c5cff" stroke-width="2.5"/>
  <text x="260" y="40" fill="#c6b8ff" font-size="17" text-anchor="middle">PODZBIORY</text>
  <ellipse cx="260" cy="170" rx="175" ry="100" fill="rgba(0,229,199,.06)" stroke="#00e5c7" stroke-width="2.5"/>
  <text x="260" y="98" fill="#00e5c7" font-size="16" text-anchor="middle">PODTABLICE</text>
  <ellipse cx="205" cy="185" rx="80" ry="52" fill="rgba(255,180,84,.07)" stroke="#ffb454" stroke-width="2"/>
  <ellipse cx="315" cy="185" rx="80" ry="52" fill="rgba(255,207,135,.06)" stroke="#ffcf87" stroke-width="2"/>
  <text x="175" y="190" fill="#ffb454" font-size="14" text-anchor="middle">prefiksy</text>
  <text x="345" y="190" fill="#ffcf87" font-size="14" text-anchor="middle">sufiksy</text>
  <text x="260" y="182" fill="#e8e8f0" font-size="10" text-anchor="middle">cała</text>
  <text x="260" y="195" fill="#e8e8f0" font-size="10" text-anchor="middle">tablica</text>
</svg>'''

# ================================================================ 01
sec('01')
slide('Tablica ma pewien problem', cols(
    stack(code('''
            int tablica[100]; // 100 >= n
            int n;
            cin >> n;''', cap='lekcja 7 — tablica z zapasem'),
          arr([1, 3, -2, 7, 0, ('', 'x'), ('', 'x'), ('…', 'dots'), ('', 'x')], name='tablica', size='sm',
              idxs=['0', '1', '2', '3', '4', '5', '6', '…', '99'],
              spans=[(0, 5, 'n = 5 — używamy', 'tl'), (5, 4, 'zapas — marnujemy', 'gr')])),
    stack(P('Pamiętasz najważniejszą zasadę tablic? <b>Rozmiar ustalamy na początku i nie da się go zmienić.</b>'),
          steps(['Musimy z góry znać <b>największe n</b> i zrobić tablicę z zapasem.',
                 'Często <b>marnujemy</b> miejsce — używamy 5 szufladek ze 100.',
                 f'Musimy osobno pamiętać {c("n")} — tablica sama nie wie, ile liczb w niej naprawdę jest.',
                 'Nie da się <b>dopisać</b> nowej liczby na koniec.'], cls='tight')),
    t='1fr 1.1fr'),
    good('<b>vector</b> rozwiązuje wszystkie te problemy.', label='Na ratunek:'))

slide('Vector = tablica, która umie rosnąć', stack(
    P('<b>vector</b> to lista liczb (albo znaków, napisów…) — jak tablica, ale <b>jej rozmiar może się zmieniać</b> '
      'w trakcie programu. Sama też pamięta, ile ma elementów.'),
    table(['', 'Tablica (lekcja 7)', 'vector (dzisiaj)'], [
        ['<b>rozmiar</b>', 'stały — ustalony na początku', '<b>może rosnąć i maleć</b>'],
        ['<b>ile elementów?</b>', f'trzeba pamiętać osobno w {c("n")}', f'mówi sam: {c("lista.size()")}'],
        ['<b>dodanie na koniec</b>', 'nie da się', c('lista.push_back(5);')],
        ['<b>indeksy</b>', 'od 0 do n-1', 'tak samo: od 0 do n-1'],
        ['<b>odczyt / zmiana</b>', f'{c("t[2]")}, {c("t[2] = 7;")}', f'tak samo: {c("lista[2]")}, {c("lista[2] = 7;")}'],
        ['<b>wypisanie jednym cout</b>', 'nie', 'też nie — pętlą'],
    ], widths=['24%', '38%', '38%'], cls='mid')))

slide('Szablon programu z vectorem', cols(
    code('''
        #include <iostream>    // cin i cout
        #include <vector>      // tu mieszka vector
        using namespace std;   // vector zamiast std::vector

        int main(){
            // <- tu wpisujemy kod z vectorami
        }''', cap='szablon każdego programu', hl=(2, 6)),
    stack(P('vector jest w bibliotece <b>vector</b>. Dopisujemy ją na górze, obok iostream.'),
          note(f'Bez {c("#include <vector>")} program się nie skompiluje — kompilator nie będzie wiedział, '
               'co to jest vector.'),
          P('Na kolejnych slajdach często pokazujemy tylko <b>środek main</b> — reszta jest zawsze taka sama.')),
    t='1.25fr 1fr'))

# ================================================================ 02
sec('02')
slide('Budowa linijki, która tworzy vector', stack(
    P('Linijka z notatek, rozłożona na części:'),
    anat([('vector', 'pu', 1), ('<int>', 'tl', 2), (' ', None, None), ('lista', 'or', 3), (';', 'gr', 4)],
         [(1, 'pu', 'vector', '„to będzie <b>vector</b>” — lista, która może rosnąć'),
          (2, 'tl', '<int>', 'w nawiasach ostrych: <b>jakiego typu</b> są elementy (tu: liczby całkowite)'),
          (3, 'or', 'lista', '<b>nazwa zmiennej</b> — wymyślamy ją sami'),
          (4, 'gr', ';', '<b>średnik</b> na końcu')]),
    note(f'Tak jak przy parze: {c("vector<int>")} to razem <b>typ</b>. W nawiasach ostrych piszemy, '
         '<b>co przechowuje</b> nasza struktura.')))

slide('Sposób 1: pusty vector', cols(
    stack(code('vector<int> lista;', size='lg', cap='z notatek'),
          P('Nie podaliśmy ani rozmiaru, ani wartości. Taki vector jest <b>pusty</b> — ma <b>0 elementów</b>.'),
          center(empty('lista'))),
    stack(card('Globalnie (poza main)', 'lista = <b>{ }</b> — pusty', 'tlc'),
          card('Lokalnie (w main)', 'lista = <b>{ }</b> — też pusty', 'orc'),
          note('Inaczej niż w tablicy: tu <b>nie ma śmieci</b>, bo nie ma w ogóle żadnych szufladek. '
               'Elementy dodamy później (rozdział 04).')),
    t='1.1fr 1fr'))

slide('Sposób 2: od razu z wartościami', stack(
    code('vector<int> lista = {1, 2, 3, 7, 9, -3};', size='lg', cap='z notatek'),
    center(arr([1, 2, 3, 7, 9, -3], name='lista', size='lg')),
    P('Po znaku <b>=</b> w klamrach podajemy wszystkie elementy po kolei — dokładnie jak w liście '
      'inicjalizacyjnej tablicy. Rozmiaru <b>nie piszemy</b> — vector sam policzy, że ma 6 elementów.'), gap=20))

slide('Sposób 3: n razy ta sama liczba', stack(
    anat([('vector<int> lista(', None, None), ('5', 'or', 1), (', ', None, None), ('0', 'tl', 2), (');', None, None)],
         [(1, 'or', '5', '<b>ile razy</b> powtórzyć element'),
          (2, 'tl', '0', '<b>dokładny element</b>, który powtarzamy')]),
    center(arr([0] * 5, name='lista')),
    note('W nawiasach <b>okrągłych</b> podajemy dwie liczby: najpierw <b>ile</b>, potem <b>co</b>. '
         'Czyli: „pięć razy zero”.')))

slide('Sposób 3 — więcej przykładów', stack(
    '<div class="rows">'
    + ''.join(f'<div class="rw" style="grid-template-columns:420px 1fr"><div>{c(src)}'
              f'<span class="rwn">{note_}</span></div><div>{arr(vals, size="sm", idx=False)}</div></div>'
              for src, vals, note_ in [
                  ('vector<int> a(3, 7);', [7, 7, 7], 'trzy razy siódemka'),
                  ('vector<int> b(4, -1);', [-1] * 4, 'cztery razy minus jeden'),
                  ('vector<int> c(6, 2);', [2] * 6, 'sześć dwójek'),
                  ("vector<char> d(5, 'x');", ["'x'"] * 5, 'pięć razy znak x'),
                  ('vector<string> e(3, "C++");', ['C++'] * 3, 'trzy napisy C++')])
    + '</div>'))

slide('Sposób 4: n zer', cols(
    stack(code('vector<int> lista(5);', size='lg', cap='z notatek'),
          center(arr([0] * 5, name='lista', size='lg')),
          P('Podajemy tylko <b>ile</b> elementów. Drugą liczbę pomijamy — wtedy C++ wstawia '
            '<b>wartość domyślną</b>: dla int to <b>0</b>.')),
    stack(note('W notatkach to „default constructor” — konstruktor domyślny. Wynik: <b>{0, 0, 0, 0, 0}</b>.'),
          good(f'{c("vector<int> lista(5);")} daje to samo co {c("vector<int> lista(5, 0);")}', label='Czyli:'),
          note('Zera są <b>zawsze</b> — globalnie i lokalnie. Śmieci w vectorze nie ma.')),
    t='1.1fr 1fr'))

slide('Cztery sposoby — porównanie', stack(
    code('''
        vector<int> lista;                       // {}
        vector<int> lista1 = {1, 2, 3, 7, 9, -3};  // {1, 2, 3, 7, 9, -3}
        vector<int> lista2(5, 0);                // {0, 0, 0, 0, 0}
        vector<int> lista3(5);                   // {0, 0, 0, 0, 0}''', cap='kod z notatek'),
    table(['Zapis', 'Co robi', 'Rozmiar'], [
        [c('vector<int> lista;'), 'pusty vector', '0'],
        [c('= {1, 2, 3, 7, 9, -3}'), 'dokładnie te elementy', '6'],
        [c('(5, 0)'), 'pięć razy 0 — <b>ile, co</b>', '5'],
        [c('(5)'), 'pięć wartości domyślnych (0)', '5'],
    ], widths=['36%', '46%', '18%'], cls='mid')))

slide('Uwaga: nawiasy okrągłe a klamry', stack(
    cols(stack(code('vector<int> a(5, 0);', size='lg', cap='nawiasy okrągłe: ILE, CO'),
               center(arr([0] * 5, name='a'))),
         stack(code('vector<int> b = {5, 0};', size='lg', cap='klamry: DOKŁADNE WARTOŚCI'),
               center(arr([5, 0], name='b'))), gap=30),
    warn('te dwie linijki wyglądają podobnie, a robią coś <b>zupełnie innego</b>! '
         'a ma <b>pięć zer</b>, a b ma <b>dwa elementy</b>: 5 i 0.'), gap=22))

slide('Vector może trzymać dowolny typ', stack(
    rows(*[f'<div class="rw" style="grid-template-columns:560px 1fr"><div>{c(src)}<span class="rwn">{n}</span></div>'
           f'<div>{d}</div></div>' for src, n, d in [
        ("vector<char> znaki = {'a', 'b', 'c'};", 'znaki', arr(["'a'", "'b'", "'c'"], size='sm', idx=False)),
        ('vector<string> slowa = {"c++", "kod"};', 'napisy (lekcja 8)', arr(['c++', 'kod'], size='smw', idx=False)),
        ('vector<double> ulamki = {3.14, 2.78};', 'liczby z przecinkiem', arr([3.14, 2.78], size='smw', idx=False)),
        ('vector<pair<int, int>> pary = {{0, 0}, {1, 5}};', 'pary (lekcja 9)',
         parr([(0, 0), (1, 5)], idx=False)),
    ]]),
    note('Na lekcji o parach przykłady z notatek były z vectorem par — teraz możesz je już napisać tak, jak w notatkach: '
         + c('vector<pair<int, int>> lista;') + '.')))


# ================================================================ 03
sec('03')
slide('Indeksowanie = odczytywanie elementu na pewnej pozycji', stack(
    P('W parku stoi rząd <b>12 ławek</b>. Na niektórych ktoś siedzi: C, L, B i K. Kropka oznacza pustą ławkę. '
      'Każda ławka ma swój numer — <b>indeks</b> — od 0 do 11.'),
    center(arr(LAWKI, name='lawki', hi=(0, 2, 6, 9))),
    note('Indeksowanie w vectorze działa <b>dokładnie tak samo</b> jak w tablicy: indeksy od <b>0</b> do <b>n-1</b>, '
         'nazwa, a za nią indeks w nawiasach kwadratowych.'), gap=22))

slide('Ławki w kodzie', stack(
    code("vector<char> lawki = {'C', '.', 'L', '.', '.', '.', 'B', '.', '.', 'K', '.', '.'};", size='sm',
         cap='z notatek'),
    center(arr(LAWKI, name='lawki', hi=(0, 6), sel=(0, 6))),
    cols(code('''
            cout << lawki[0] << endl;   // wyświetla C
            cout << lawki[6] << endl;   // wyświetla B'''), term('C\nB'), t='1fr 200px'),
    note("vector&lt;char&gt; — każda szufladka trzyma <b>jeden znak</b>, zapisany w apostrofach: 'C', '.'. "
         'W nazwach zmiennych nie używamy polskich liter — dlatego lawki, a nie ławki.')))

slide('Sprawdzamy, kto siedzi na ławce 9', stack(
    center(arr(LAWKI, name='lawki', size='sm', hi=(9,), sel=(9,))),
    cols(stack(code('''
                if(lawki[9] == 'K'){
                    cout << "na indeksie 9 jest litera K" << endl;
                }''', cap='z notatek', size='sm'),
               term('na indeksie 9 jest litera K')),
         steps([f'{c("lawki[9]")} — bierzemy znak z ławki o indeksie 9: <b>K</b>.',
                f"Porównujemy go ze znakiem {c(chr(39) + 'K' + chr(39))} — dwoma znakami równości {c('==')}.",
                'Są równe → warunek jest prawdziwy → wypisujemy napis.'], cls='tight'),
         t='1.15fr 1fr')))

slide('Modyfikowanie: ktoś siada na ławce 4', stack(
    code("lawki[4] = 'Z';", size='lg', hl=(1,), cap='z notatek'),
    P('przed', 'muted'), center(arr(LAWKI, name='lawki', size='sm', sel=(4,))),
    P('po', 'muted'), center(arr(LAWKI[:4] + ['Z'] + LAWKI[5:], name='lawki', size='sm', hi=(4,))),
    note('Do elementu vectora wpisujemy nową wartość znakiem <b>=</b> — tak samo jak w tablicy. '
         'Na ławce 4 siedzi teraz Z, reszta ławek się nie zmienia.'), gap=10))

slide('Indeksowanie liczb — więcej przykładów', cols(
    code('''
        vector<int> lista = {1, 2, 3, 7, 9, -3};

        cout << lista[0] << endl;              // 1
        cout << lista[5] << endl;              // -3
        cout << lista[1] + lista[3] << endl;   // 2 + 7
        lista[2] = 100;
        cout << lista[2] << endl;              // 100''', size='sm'),
    stack(term('1\n-3\n9\n100'), arr([1, 2, 100, 7, 9, -3], name='lista', size='sm', hi=(2,))),
    t='1.35fr 1fr'))

slide('Uwaga: indeks poza vectorem', cols(
    stack(code('''
            vector<int> lista = {1, 2, 3, 7, 9, -3};
            cout << lista[6] << endl;   // BŁĄD''', bad=True, cap='źle', size='sm'),
          arr([1, 2, 3, 7, 9, -3, ('?', 'ghost')], name='lista', size='sm',
              spans=[(0, 6, 'indeksy 0…5', 'tl'), (6, 1, 'poza!', 'or')])),
    warn('tak jak w tablicy: vector o 6 elementach ma indeksy <b>0…5</b>. lista[6] to pamięć <b>za vectorem</b> — '
         'program wypisze śmieci albo się wysypie.'),
    t='1.25fr 1fr'))

# ================================================================ 04
sec('04')
slide('`lista.size()` — ile jest elementów', stack(
    code('''
        vector<int> lista = {1, 2, 5, 3, -5};
        cout << lista.size() << endl;''', size='lg', cap='z notatek: size() zwraca wielkość'),
    center(arr([1, 2, 5, 3, -5], name='lista', spans=[(0, 5, 'size() = 5', 'tl')])),
    cols(P('<b>size()</b> to <b>metoda</b> vectora — polecenie, które piszemy po kropce, z nawiasami na końcu. '
           'Zwraca liczbę elementów.'), term('5'), t='1.6fr 1fr', align='center'), gap=20))

slide('Ostatni element: `lista[lista.size() - 1]`', stack(
    code('''
        vector<int> lista = {1, 2, 5, 3, -5};
        cout << lista[lista.size() - 1] << endl;   // -5''', size='lg'),
    center(arr([1, 2, 5, 3, -5], name='lista', size='lg', hi=(4,), ptr={4: 'size() - 1'})),
    steps(['lista.size() = <b>5</b>.',
           '5 - 1 = <b>4</b> — to indeks ostatniego elementu (n-1, jak w tablicy).',
           'lista[4] = <b>-5</b>.'], cls='tight'), gap=18))

slide('`push_back` — dodaje element na koniec', cols(
    code('''
        vector<int> lista;
        // lista = {}
        lista.push_back(5);
        // lista = {5}
        lista.push_back(7);
        // lista = {5, 7}''', cap='z notatek', size='lg'),
    stack(P('push_back <b>dodaje nowy element z prawej strony</b> — na tył vectora. Vector wydłuża się o 1.'),
          chain(('start', [], ()), ('push 5', [5], (0,)), ('push 7', [5, 7], (1,)), size='lg')),
    t='1.1fr 1fr'))

slide('`push_back` krok po kroku — size rośnie', stack(
    table(['Linijka', 'lista po tej linijce', 'lista.size()'], [
        [c('vector<int> lista;'), '<b>{ }</b>', '0'],
        [c('lista.push_back(5);'), '<b>{5}</b>', '1'],
        [c('lista.push_back(7);'), '<b>{5, 7}</b>', '2'],
        [c('lista.push_back(-1);'), '<b>{5, 7, -1}</b>', '3'],
        [c('lista.push_back(5);'), '<b>{5, 7, -1, 5}</b>', '4'],
    ], widths=['40%', '40%', '20%'], cls='big'),
    note('Każdy push_back dokłada <b>jeden</b> element na sam koniec i zwiększa size() o 1. '
         'Stare elementy się nie ruszają.')))

slide('`push_back` w pętli', cols(
    stack(code('''
            vector<int> kwadraty;
            for(int i = 1; i <= 5; i++){
                kwadraty.push_back(i * i);
            }''', size='lg'),
          P('Startujemy od pustego vectora. W każdym obrocie pętli dokładamy na koniec kwadrat liczby i.')),
    chain(('i = 1', [1], (0,)), ('i = 2', [1, 4], (1,)), ('i = 3', [1, 4, 9], (2,)),
          ('i = 4', [1, 4, 9, 16], (3,)), ('i = 5', [1, 4, 9, 16, 25], (4,))),
    t='1.1fr 1fr'))

slide('Pusty vector nie ma szufladek', cols(
    stack(code('''
            vector<int> lista;
            lista[0] = 5;   // BŁĄD!''', bad=True, cap='źle', size='lg'),
          code('''
            vector<int> lista;
            lista.push_back(5);   // dobrze''', good=True, cap='dobrze', size='lg')),
    stack(center(empty('lista')),
          warn('w pustym vectorze <b>nie ma</b> szufladki o indeksie 0. Indeks <b>zmienia istniejący</b> element, '
               'a push_back <b>tworzy nowy</b>.'),
          note(f'Gdy chcesz od razu mieć n szufladek, stwórz {c("vector<int> lista(n);")} — wtedy lista[0] istnieje.')),
    t='1fr 1fr'))

slide('`clear` — usuwa wszystkie elementy', stack(
    code('''
        vector<int> lista = {1, 2, 5, 3, -5};
        lista.clear();''', size='lg', cap='z notatek: clear() usuwa wszystkie elementy', hl=(2,)),
    center(before_after(arr([1, 2, 5, 3, -5], name='lista', size='sm', idx=False), empty('lista'))),
    note('Po clear() vector jest pusty: size() = 0. Można go dalej używać — np. znowu robić push_back.'), gap=20))

# ================================================================ 05
sec('05')
slide('`pop_back` — usuwa ostatni element', stack(
    code('''
        vector<int> lista = {4, 8, 15};
        lista.pop_back();''', size='lg', hl=(2,)),
    center(before_after(arr([4, 8, 15], name='lista', size='lg', sel=(2,)), arr([4, 8], name='lista', size='lg'))),
    note('pop_back to przeciwieństwo push_back: zabiera <b>ostatni</b> element z prawej strony. size() maleje o 1.'),
    gap=20))

slide('`front` i `back` — pierwszy i ostatni', stack(
    code('''
        vector<int> lista = {4, 8, 15, 16};
        cout << lista.front() << endl;   // 4
        cout << lista.back() << endl;    // 16''', size='lg'),
    center(arr([4, 8, 15, 16], name='lista', size='lg', hi=(0, 3), ptr={0: 'front()', 3: 'back()'})),
    cols(table(['Metoda', 'To samo co'], [[c('lista.front()'), c('lista[0]')],
                                          [c('lista.back()'), c('lista[lista.size() - 1]')]], cls='mid'),
         term('4\n16'), t='1.6fr 1fr'), gap=18))

slide('`assign` — wypełnij od nowa', cols(
    code('''
        vector<int> lista;    // pusty: {}
        lista.assign(5, 1);   // {1,1,1,1,1}
        lista.assign(7, 0);   // {0,0,0,0,0,0,0}
        lista.assign(2, -2);  // {-2,-2}''', cap='z notatek'),
    chain(('start', [], ()), ('(5, 1)', [1] * 5, ()), ('(7, 0)', [0] * 7, ()), ('(2, -2)', [-2, -2], ())),
    t='1.15fr 1fr'),
    note('assign(ile, co) <b>wyrzuca całą starą zawartość</b> i wpisuje <b>ile</b> razy element <b>co</b>. '
         'Z notatek: „tak samo można zrobić z konstruktorem” — ' + c('vector<int> lista(5, 1);') + '.'))

slide('`resize` — wydłużanie', cols(
    code('''
        vector<int> lista;   // {}
        lista.resize(5);     // {0, 0, 0, 0, 0}
        lista[0] = 13;
        lista[1] = 8;        // {13, 8, 0, 0, 0}
        lista.resize(7);     // {13, 8, 0, 0, 0, 0, 0}''', size='sm'),
    chain(('resize(5)', [0] * 5, ()), ('wpisujemy', [13, 8, 0, 0, 0], (0, 1)),
          ('resize(7)', [13, 8, 0, 0, 0, 0, 0], (5, 6))),
    t='1.15fr 1fr'),
    note('resize(n) zmienia liczbę elementów na <b>n</b>. Gdy n jest <b>większe</b>, vector dokłada na końcu nowe '
         'elementy z wartością domyślną — dla int to <b>0</b>. Stare elementy zostają na swoich miejscach.'))

slide('`resize` — skracanie', stack(
    code('''
        // lista = {13, 8, 0, 0, 0, 0, 0}
        lista.resize(2);     // {13, 8}''', size='lg', hl=(2,)),
    center(before_after(arr([13, 8, 0, 0, 0, 0, 0], name='lista', size='sm', sel=tuple(range(2, 7))),
                        arr([13, 8], name='lista', size='sm'))),
    note('Gdy nowy rozmiar jest <b>mniejszy</b>, vector <b>obcina</b> elementy z końca. Zostają tylko pierwsze dwa.'),
    gap=20))

# ================================================================ 06
sec('06')
slide('Nie da się wypisać vectora jednym `cout`', cols(
    stack(code('''
            vector<int> lista = {1, 2, 5, 3, -5};
            cout << lista << endl;   // BŁĄD''', bad=True, cap='tak NIE robimy'),
          term("error: no match for 'operator<<'", cap='kompilator mówi'),
          P('Tak jak przy parze — program się nie skompiluje. Każdy element trzeba wypisać <b>osobno</b>, w pętli.')),
    stack(big('<strong>Nie da się</strong><br>wypisać vectora<br>jednym <em>cout</em>.'),
          good('dwa sposoby z notatek: pętla po indeksach i pętla for-each.', label='Są')),
    t='1.35fr 1fr'))

slide('Sposób 1: pętla po indeksach', cols(
    stack(code('''
            vector<int> lista = {1, 2, 5, 3, -5};
            for(int i = 0; i < lista.size(); i++){
                cout << lista[i] << ' ';
            }
            cout << endl;''', cap='z notatek'),
          term('1 2 5 3 -5')),
    stack(P(f'Dokładnie jak przy tablicy. Jedyna różnica: zamiast {c("n")} piszemy {c("lista.size()")} — '
            'vector sam wie, ile ma elementów.'),
          note(f'W notatkach w warunku jest {c("i < n")} — wtedy {c("n")} musi być równe liczbie elementów. '
               f'Najpewniej jest napisać {c("i < lista.size()")}.')),
    t='1.15fr 1fr'))

L5 = [1, 2, 5, 3, -5]
slide('Sposób 1 — krok po kroku', stack(
    center(arr(L5, name='lista')),
    table(['i', 'i < size() ?', 'wypisujemy', 'na ekranie po tym kroku'],
          [[str(k), 'tak', f'{c(f"lista[{k}]")} = {v}', c(' '.join(map(str, L5[:k + 1])))] for k, v in enumerate(L5)]
          + [['5', '<b class="no">nie</b>', 'koniec pętli', c('1 2 5 3 -5') + ' + endl']],
          widths=['8%', '20%', '34%', '38%'], cls='mid')))

slide('Sposób 2: pętla for-each', cols(
    stack(code('''
            vector<int> lista = {1, 2, 5, 3, -5};
            for(auto el : lista){
                cout << el << ' ';
            }
            cout << endl;''', cap='z notatek'),
          term('1 2 5 3 -5')),
    stack(P(f'{c("for(auto el : lista)")} czytamy: <b>„dla każdego elementu el z listy”</b>.'),
          steps(['Pętla sama bierze elementy po kolei: najpierw 1, potem 2, 5, 3 i -5.',
                 f'W każdym obrocie zmienna {c("el")} <b>to kolejny element</b> — wartość, a nie indeks!',
                 'Nie piszemy żadnego i, warunku ani i++.'], cls='tight')),
    t='1.1fr 1fr'))

slide('for-each — krok po kroku', stack(
    center(arr(L5, name='lista')),
    table(['Obrót', 'el', 'na ekranie po tym kroku'],
          [[str(k + 1), f'<b>{v}</b>', c(' '.join(map(str, L5[:k + 1])))] for k, v in enumerate(L5)],
          widths=['20%', '30%', '50%'], cls='mid'),
    note('el przyjmuje <b>kolejne wartości</b> elementów. Gdy elementy się skończą, pętla sama się kończy.')))

slide('`auto` — C++ sam zgaduje typ', stack(
    P(f'{c("auto")} znaczy: „C++, ustal typ sam”. W pętli for-each auto dostaje typ elementów vectora:'),
    table(['vector', 'pętla', 'el jest typu'], [
        [c('vector<int> lista'), c('for(auto el : lista)'), c('int')],
        [c('vector<char> lawki'), c('for(auto el : lawki)'), c('char')],
        [c('vector<string> slowa'), c('for(auto el : slowa)'), c('string')],
        [c('vector<pair<int, int>> pary'), c('for(auto el : pary)'), c('pair<int, int>')],
    ], widths=['38%', '36%', '26%'], cls='big'),
    note(f'Można też napisać typ samemu: {c("for(int el : lista)")} — działa tak samo. auto jest po prostu wygodniejsze.')))

slide('Który sposób wybrać?', stack(
    P('Dla ' + c('vector<int> lista = {1, 2, 5};') + ':'),
    cols(stack(code('''
                for(int i = 0; i < lista.size(); i++){
                    cout << i << ": " << lista[i] << endl;
                }''', cap='potrzebny indeks → pętla po indeksach', size='sm'),
               term('0: 1\n1: 2\n2: 5')),
         stack(code('''
                for(auto el : lista){
                    cout << el << ' ';
                }''', cap='same wartości → for-each', size='sm'),
               term('1 2 5')), gap=24),
    note('Gdy potrzebujesz <b>numeru</b> elementu (np. żeby wypisać indeks albo porównać sąsiadów) — pętla po indeksach. '
         'Gdy wystarczą <b>wartości</b> — for-each jest krótszy.')))

# ================================================================ 07
sec('07')
slide('Dwie wersje pętli for-each', cols(
    code('''
        // 1. zwykły for-each-loop
        for(int e : lista){
            ...
        }
        // 2. for-each-loop z referencją
        for(int &e : lista){
            ...
        }''', cap='z notatek', size='lg'),
    stack(P(f'Różnią się tylko <b>jednym znakiem</b>: {c("&")}.'),
          note('Ten znak to <b>referencja</b>. Wygląda niewinnie, ale zmienia bardzo dużo — '
               'zobaczmy krok po kroku, co dokładnie.')),
    t='1.2fr 1fr'))

slide('Wersja 1: `e` to kopia', cols(
    stack(code('for(int e : lista)', size='lg'),
          steps(['e przechowuje <b>taką samą wartość</b> jak element w liście…',
                 '…ale zmienna e <b>nie jest</b> przechowywana w tym samym miejscu pamięci.',
                 'e to <b>kopia</b> — osobna szufladka obok listy.'], cls='tight')),
    stack(mem(arr([5, 3, 8, 1], name='lista', sel=(1,)), arr([3], name='e', idx=False)),
          warn('jeżeli zmodyfikujemy e, to <b>nie zmodyfikuje się</b> lista.', label='Więc:')),
    t='1fr 1fr'))

slide('Przykład: podwajamy bez `&`', cols(
    stack(code('''
            vector<int> lista = {1, 2, 3};
            for(int e : lista){
                e = e * 2;      // zmienia tylko kopię
            }
            for(auto el : lista){
                cout << el << ' ';
            }''', size='sm'),
          term('1 2 3')),
    stack(table(['Obrót', 'kopia e', 'e po e * 2', 'lista'], [
        ['1', '1', '2', '{1, 2, 3}'], ['2', '2', '4', '{1, 2, 3}'], ['3', '3', '6', '{1, 2, 3}']], cls='mid'),
          note('Każda kopia e została podwojona — ale <b>lista się nie zmieniła</b>. Po każdym obrocie kopia znika.')),
    t='1.1fr 1fr'))

slide('Wersja 2: `e` to referencja', cols(
    stack(code('for(int &e : lista)', size='lg'),
          steps(['e jest <b>w tym samym miejscu pamięci</b>, w którym jest element listy.',
                 'e to po prostu <b>druga nazwa</b> tej samej szufladki.',
                 'Nie ma żadnej kopii.'], cls='tight')),
    stack(mem(arr([5, 3, 8, 1], name='lista', hi=(1,), ptr={1: 'e'})),
          good('jeżeli zmodyfikujemy e, to <b>zmodyfikuje się</b> lista.', label='Więc:')),
    t='1fr 1fr'))

slide('Przykład: podwajamy z `&`', cols(
    stack(code('''
            vector<int> lista = {1, 2, 3};
            for(int &e : lista){
                e = e * 2;      // zmienia element listy
            }
            for(auto el : lista){
                cout << el << ' ';
            }''', size='sm'),
          term('2 4 6')),
    stack(chain(('start', [1, 2, 3], ()), ('obrót 1', [2, 2, 3], (0,)), ('obrót 2', [2, 4, 3], (1,)),
                ('obrót 3', [2, 4, 6], (2,))),
          note('Tym razem e to sama szufladka listy — więc lista naprawdę się zmienia.')),
    t='1.1fr 1fr'))

slide('Bez `&` czy z `&`?', stack(
    table(['', 'for(int e : lista)', 'for(int &e : lista)'], [
        ['<b>czym jest e</b>', 'kopią elementu', 'tym samym elementem (referencją)'],
        ['<b>miejsce w pamięci</b>', 'osobne', 'to samo co element listy'],
        ['<b>zmiana e zmienia listę?</b>', '<b class="no">nie</b>', '<b class="yes">tak</b>'],
        ['<b>kiedy używać</b>', 'gdy tylko czytamy / wypisujemy', 'gdy zmieniamy albo wczytujemy elementy'],
    ], widths=['26%', '34%', '40%'], cls='big'),
    note(f'Z auto działa to tak samo: {c("for(auto e : lista)")} to kopia, {c("for(auto &e : lista)")} — referencja.')))

# ================================================================ 08
sec('08')
V = [4, 8, 15, 16, 23]
VE = V + [('', 'ghost')]
VE_I = ['0', '1', '2', '3', '4', '']

slide('Po co nowe pojęcie?', stack(
    P('Do tej pory miejsce w vectorze wskazywaliśmy <b>indeksem</b>: ' + c('lista[2]') + '. Ale niektóre polecenia '
      '<b>nie przyjmują indeksu</b>. Zamiast numeru chcą dostać coś innego:'),
    code('''
        lista.erase(⟦lista.begin()⟧ + 1);          // usuń element — za chwilę
        lista.insert(⟦lista.begin()⟧, 7);          // wstaw element — za chwilę
        sort(⟦lista.begin()⟧, ⟦lista.end()⟧);       // posortuj — następna lekcja''', size='lg'),
    P('Te zaznaczone kawałki to <b>iteratory</b>. Zanim użyjemy erase i insert, musimy dokładnie zrozumieć trzy rzeczy:'),
    steps(['<b>Co to jest</b> iterator?',
           f'Na co wskazuje {c("lista.begin()")}, a na co {c("lista.end()")}?',
           '<b>Dlaczego</b> w ogóle używamy iteratorów, skoro mamy indeksy?'], cls='tight')))

slide('Co to jest iterator?', stack(
    big('Iterator to <em>strzałka</em>, która <strong>pokazuje jeden element</strong> vectora.'),
    center(arr(V, name='lista', size='lg', hi=(2,), ptr={2: 'iterator'})),
    steps(['Pomyśl o ławkach z parku: iterator to <b>palec</b>, którym pokazujesz jedną ławkę. Palec to nie osoba na ławce '
           '— on tylko mówi, <b>gdzie</b> patrzymy.',
           'Iterator to <b>nie wartość</b> (15) i <b>nie numer</b> (2). To wskazanie miejsca w vectorze.',
           'Strzałkę można <b>przesuwać</b> — o jeden element albo o kilka, w prawo albo w lewo.'], cls='tight'),
    gap=18))

slide('Indeks, iterator, wartość — trzy różne rzeczy', stack(
    center(arr(V, name='lista', size='lg', hi=(2,), ptr={2: 'iterator'})),
    table(['Pojęcie', 'Przykład', 'Co to jest'], [
        ['<b>indeks</b>', c('2'), 'numer szufladki — zwykła liczba int'],
        ['<b>iterator</b>', c('lista.begin() + 2'), 'strzałka pokazująca szufladkę'],
        ['<b>wartość</b>', c('15'), 'to, co leży w szufladce'],
    ], widths=['18%', '34%', '48%'], cls='big'),
    note('Skojarzenie z książką: <b>indeks</b> to numer strony, <b>iterator</b> to zakładka włożona między kartki, '
         'a <b>wartość</b> to tekst wydrukowany na tej stronie.'), gap=18))

slide('`begin()` — strzałka na pierwszy element', stack(
    code('''
        vector<int> lista = {4, 8, 15, 16, 23};
        auto it = lista.begin();   // it pokazuje na 4''', size='lg', hl=(2,)),
    center(arr(V, name='lista', size='lg', hi=(0,), ptr={0: 'begin()'})),
    steps([f'{c("begin()")} to metoda vectora — tak jak {c("size()")} — więc piszemy ją po kropce, z nawiasami.',
           'Zwraca iterator, który pokazuje na <b>pierwszy</b> element — ten o indeksie 0.',
           f'Zapisujemy go do zmiennej {c("it")}. Typ iteratora ma długą nazwę ({c("vector<int>::iterator")}), '
           f'dlatego piszemy {c("auto")} — znamy je z pętli for-each.'], cls='tight'), gap=16))

slide('Gwiazdka `*` — co leży pod strzałką?', cols(
    stack(code('''
            vector<int> lista = {4, 8, 15, 16, 23};
            auto it = lista.begin();
            cout << *it << endl;   // 4'''),
          term('4'),
          code('''
            cout << it << endl;    // BŁĄD''', size='sm', bad=True, cap='bez gwiazdki — błąd kompilacji')),
    stack(center(arr(V, name='lista', hi=(0,), ptr={0: 'it'})),
          table(['Zapis', 'Co to jest'], [[c('it'), 'strzałka (iterator)'],
                                          [c('*it'), 'to, na co strzałka pokazuje — <b>4</b>']], cls='mid'),
          note('Gwiazdkę czytamy: „to, co jest pod strzałką”. Sam iterator to nie liczba — dlatego cout bez '
               'gwiazdki się nie skompiluje.')),
    t='1.05fr 1fr'))

slide('Przez `*it` można też zmienić element', stack(
    code('''
        vector<int> lista = {4, 8, 15, 16, 23};
        auto it = lista.begin();
        *it = 100;             // zmieniamy to, co jest pod strzałką''', size='lg', hl=(3,)),
    center(before_after(arr(V, name='lista', size='sm', sel=(0,), ptr={0: 'it'}),
                        arr([100] + V[1:], name='lista', size='sm', hi=(0,), ptr={0: 'it'}))),
    note('*it to <b>ta sama szufladka</b>, na którą pokazuje strzałka — tak jak referencja <b>&</b> z pętli for-each. '
         'Zmiana *it zmienia vector.'), gap=18))

slide('Przesuwanie strzałki: `it++` i `it + k`', cols(
    code('''
        vector<int> lista = {4, 8, 15, 16, 23};
        auto it = lista.begin();   // pokazuje na 4
        it++;                      // pokazuje na 8
        it = it + 2;               // pokazuje na 16
        cout << *it << endl;       // 16''', size='sm'),
    stack(*[f'<div>{arr(V, name=lab, size="sm", idx=False, hi=(k,), ptr={k: "it"})}</div>'
            for lab, k in [('start', 0), ('it++', 1), ('it + 2', 3)]], gap=6),
    t='1.25fr 1fr'),
    note(f'{c("it++")} przesuwa strzałkę o <b>jeden</b> element w prawo, a {c("it + k")} — o <b>k</b> elementów. '
         f'W lewo tak samo: {c("it--")} i {c("it - k")}.'))

slide('`lista.begin() + k` — strzałka na indeks k', stack(
    center(arr(V, name='lista', ptr={0: 'begin()', 1: '+ 1', 2: '+ 2', 3: '+ 3', 4: '+ 4'})),
    table(['Iterator', 'pokazuje na indeks', '* daje wartość'], [
        [c('lista.begin()'), '0', '4'], [c('lista.begin() + 1'), '1', '8'], [c('lista.begin() + 2'), '2', '15'],
        [c('lista.begin() + 3'), '3', '16'], [c('lista.begin() + 4'), '4', '23']], widths=['40%', '30%', '30%'], cls='mid'),
    good(f'{c("lista.begin() + k")} pokazuje na element o indeksie k. Czyli {c("*(lista.begin() + k)")} to to samo co '
         f'{c("lista[k]")}.', label='Zapamiętaj:')))

slide('`end()` — strzałka ZA ostatnim elementem', stack(
    code('auto koniec = lista.end();   // pokazuje ZA 23', size='lg'),
    center(arr(VE, name='lista', size='lg', idxs=VE_I, ptr={0: 'begin()', 5: 'end()'},
               spans=[(0, 5, '5 elementów', 'tl'), (5, 1, 'pusto', 'or')])),
    warn(f'{c("end()")} <b>nie</b> pokazuje na ostatni element (23)! Pokazuje na miejsce <b>tuż za nim</b>, w którym '
         'nie ma już żadnego elementu — jak meta za ostatnim zawodnikiem albo puste miejsce za ostatnią osobą w kolejce.'),
    gap=18))

slide('Nie wolno zaglądać pod `end()`', cols(
    stack(code('cout << *lista.end();         // BŁĄD', bad=True, cap='źle — pod end() nic nie ma', size='sm'),
          code('cout << *(lista.end() - 1);   // 23', good=True, cap='dobrze — ostatni element', size='sm'),
          table(['Iterator', 'pokazuje na'], [[c('lista.end()'), 'puste miejsce za vectorem'],
                                              [c('lista.end() - 1'), 'ostatni element — <b>23</b>'],
                                              [c('lista.end() - 2'), 'przedostatni — <b>16</b>']], cls='mid')),
    stack(center(arr(VE, name='lista', size='sm', idxs=VE_I, hi=(4,), ptr={3: '- 2', 4: '- 1', 5: 'end()'})),
          note(f'{c("*lista.end()")} to tak jak {c("lista[lista.size()]")} — czytanie spoza vectora. Program wypisze '
               'śmieci albo się wysypie.')),
    t='1.1fr 1fr'))

slide('Dlaczego `end()` jest ZA ostatnim? Powód 1', stack(
    P('Bo tak samo działa <b>n</b> w zwykłej pętli po indeksach. Porównaj dwie pętle, które wypisują ten sam vector:'),
    cols(stack(code('''
                for(int i = 0; i < 5; i++){
                    cout << lista[i] << ' ';
                }''', cap='pętla po indeksach', size='sm'),
               center(arr(VE, size='sm', idxs=['0', '1', '2', '3', '4', '5'], ptr={0: 'i = 0', 5: 'i = 5'}))),
         stack(code('''
                for(auto it = lista.begin(); it != lista.end(); it++){
                    cout << *it << ' ';
                }''', cap='pętla z iteratorem', size='xs'),
               center(arr(VE, size='sm', idxs=VE_I, ptr={0: 'begin()', 5: 'end()'}))), gap=24),
    note('Indeksu <b>5</b> też nie ma — to „pierwszy numer za vectorem”. Pętla kończy się, gdy i dojdzie do 5. Tak samo '
         'pętla z iteratorem kończy się, gdy strzałka dojdzie do <b>end()</b>. end() to dla iteratorów to, czym n jest dla '
         'indeksów.')))

slide('Dlaczego `end()` jest ZA ostatnim? Powody 2 i 3', cols(
    stack(card('Powód 2: łatwo policzyć elementy',
               f'Od begin() do end() jest dokładnie tyle kroków, ile elementów: {c("lista.end() - lista.begin()")} = <b>5</b> '
               f'= {c("lista.size()")}.', 'tlc'),
          center(arr(VE, size='sm', idxs=VE_I, ptr={0: 'begin()', 5: 'end()'}, spans=[(0, 5, '5 kroków', 'tl')]))),
    stack(card('Powód 3: pusty vector',
               f'W pustym vectorze {c("begin() == end()")} — obie strzałki stoją w tym samym miejscu, więc od razu widać, '
               'że nie ma elementów. Gdyby end() pokazywał ostatni element, w pustym vectorze nie miałby na co pokazywać!',
               'orc'),
          center(arr([('', 'ghost')], name='pusty', size='sm', idxs=[''], ptr={0: 'begin() = end()'}))),
    t='1fr 1fr'))

slide('Zakres `[begin, end)`', stack(
    big('Od <em>begin()</em> — <em>wliczamy</em> &nbsp;·&nbsp; do <strong>end()</strong> — <strong>nie wliczamy</strong>'),
    center(arr(VE, name='lista', size='lg', idxs=VE_I, hi=(0, 1, 2, 3, 4), ptr={0: 'begin()', 5: 'end()'},
               spans=[(0, 5, '[begin, end) — wszystkie elementy', 'tl')])),
    note('Taki zapis — nawias kwadratowy z lewej, okrągły z prawej — oznacza: „lewy koniec należy, prawy nie należy”. '
         'Zakres [begin, end) to dokładnie <b>wszystkie</b> elementy vectora. Ten sam pomysł co w pętli i &lt; n: '
         'od 0 włącznie do n wyłącznie.'), gap=18))

LOOP = '''
    vector<int> lista = {4, 8, 15, 16, 23};
    for(auto it = lista.begin(); it != lista.end(); it++){
        cout << *it << ' ';
    }'''
slide('Pętla z iteratorem — krok po kroku', stack(
    code(LOOP, size='sm'),
    table(['Obrót', 'it pokazuje na', 'it != end() ?', 'wypisujemy *it', 'na ekranie'],
          [[str(k + 1), f'indeks {k}', 'tak', f'<b>{v}</b>', c(' '.join(map(str, V[:k + 1])))] for k, v in enumerate(V)]
          + [['—', 'end()', '<b class="no">nie</b>', 'koniec pętli', c('4 8 15 16 23')]],
          widths=['10%', '22%', '18%', '20%', '30%'], cls='mid')))

slide('for-each to iteratory w przebraniu', cols(
    stack(code('''
            for(auto el : lista){
                cout << el << ' ';
            }''', cap='to, co piszemy', size='lg'),
          code('''
            for(auto it = lista.begin(); it != lista.end(); it++){
                auto el = *it;
                cout << el << ' ';
            }''', cap='to, co C++ robi „pod spodem”', size='xs')),
    stack(P('Pętla for-each z rozdziału 06 sama w środku używa <b>begin()</b> i <b>end()</b>.'),
          steps(['Startuje od strzałki <b>begin()</b>.',
                 'W każdym obrocie bierze do el to, co jest pod strzałką.',
                 'Przesuwa strzałkę o jeden i kończy, gdy dojdzie do <b>end()</b>.'], cls='tight'),
          note('Dlatego for-each sam wie, gdzie zacząć i gdzie skończyć — a my nie piszemy żadnego i.')),
    t='1.1fr 1fr'))

slide('Dlaczego używamy iteratorów?', stack(
    P('Skoro mamy indeksy, po co nam strzałki? Oto <b>cztery</b> powody:'),
    cards(card('1. Metody vectora', f'{c("erase")} i {c("insert")} dostają <b>iterator</b>, a nie indeks — zobaczysz je '
                                    'za chwilę.', 'tlc'),
          card('2. Algorytmy', f'Gotowe funkcje, np. {c("sort")} czy {c("reverse")}, dostają <b>dwie strzałki</b>: '
                               'od którego elementu zacząć i przed którym skończyć.', 'puc'),
          card('3. Struktury bez indeksów', 'Zbiór (set) i mapa (map), które poznasz później, <b>nie mają</b> [ ]. '
                                            'Ale mają begin() i end() — iteratory działają wszędzie tak samo.', 'orc'),
          card('4. Pętla for-each', 'Działa tylko dlatego, że struktura ma begin() i end().', 'tlc'), n=2)))

slide('Podgląd: iteratory w algorytmach', stack(
    code('''
        #include <algorithm>   // tu mieszkają sort i reverse

        vector<int> a = {5, 2, 9, 1, 7};
        sort(a.begin(), a.end());          // {1, 2, 5, 7, 9}   — cały vector
        vector<int> b = {5, 2, 9, 1, 7};
        sort(b.begin(), b.begin() + 3);    // {2, 5, 9, 1, 7}   — tylko pierwsze 3
        vector<int> r = {1, 2, 3, 4};
        reverse(r.begin(), r.end());       // {4, 3, 2, 1}      — odwróć''', size='sm'),
    center(arr([5, 2, 9, 1, 7], name='b', size='lg', ptr={0: 'begin()', 3: 'begin() + 3'},
               spans=[(0, 3, 'sortujemy', 'tl'), (3, 2, 'bez zmian', 'gr')])),
    note('Sortowanie poznasz dokładnie na następnej lekcji. Tu ważne jest tylko to, że funkcja dostaje <b>dwie strzałki</b> '
         'i działa na zakresie od pierwszej (wliczamy) do drugiej (nie wliczamy).')))

QV = '<div class="center">' + arr(VE, name='lista', idxs=VE_I) + '</div>'
QS = [('lista.begin() + 2', '15', 'indeks 2'), ('lista.end() - 1', '23', 'ostatni'),
      ('lista.begin() + 5', 'nic', 'to samo miejsce co end()'), ('lista.end() - 5', '4', 'to samo co begin()'),
      ('*(lista.begin() + 1)', '8', 'gwiazdka: wartość'), ('lista.end() - lista.begin()', '5', 'liczba elementów')]
slide('Sprawdź się: na co pokazuje strzałka?', stack(
    QV, P('Dla każdego zapisu powiedz, na który element pokazuje strzałka (albo ile wynosi wynik):'),
    cards(*[card(c(q), '?') for q, _, _ in QS], n=3),
    P('Zastanów się, <b>zanim</b> przejdziesz dalej.', 'muted cen')))

slide('Odpowiedzi', stack(
    center(arr(VE, name='lista', size='lg', idxs=VE_I, hi=(0, 1, 2, 4),
               ptr={0: 'begin()', 1: '+1', 2: '+2', 4: 'end()-1', 5: 'end()'})),
    cards(*[card(c(q), f'<b>{a}</b> — {d}') for q, a, d in QS], n=3)))

slide('`erase` — usuwa jeden element', stack(
    P('erase dostaje <b>iterator</b> — strzałkę na element, który ma zniknąć. Cztery <b>osobne</b> przykłady — za każdym '
      'razem startujemy od tej samej listy {1, 2, 3, 4, 5, 6}:'),
    rows(*[f'<div class="rw" style="grid-template-columns:470px 1fr"><div>{c(src)}'
           f'<span class="rwn">usunie {u}</span></div><div>{arr(res, size="sm", idx=False)}</div></div>'
           for src, u, res in [('lista.erase(lista.begin());', 1, [2, 3, 4, 5, 6]),
                               ('lista.erase(lista.begin() + 1);', 2, [1, 3, 4, 5, 6]),
                               ('lista.erase(lista.begin() + 2);', 3, [1, 2, 4, 5, 6]),
                               ('lista.erase(lista.end() - 1);', '6 (ostatni)', [1, 2, 3, 4, 5])]]),
    note('erase usuwa element z podanej pozycji, a wszystkie elementy za nim <b>przesuwają się w lewo</b>. '
         'size() maleje o 1.')))

slide('Uwaga: erase po kolei przesuwa indeksy', cols(
    code('''
        vector<int> lista = {1, 2, 3, 4, 5, 6};
        lista.erase(lista.begin());       // usuwa 1
        lista.erase(lista.begin() + 1);   // usuwa 3!
        lista.erase(lista.begin() + 2);   // usuwa 5!''', size='sm'),
    chain(('start', [1, 2, 3, 4, 5, 6], ()), ('krok 1', [2, 3, 4, 5, 6], ()), ('krok 2', [2, 4, 5, 6], ()),
          ('krok 3', [2, 4, 6], ())),
    t='1.3fr 1fr'),
    warn('gdy wykonamy te trzy linijki <b>jedna po drugiej</b>, wynik jest inny niż w trzech osobnych przykładach. '
         'Po usunięciu 1 na indeksie 1 stoi już <b>3</b>, a nie 2. Wynik: <b>{2, 4, 6}</b>.'))

slide('`erase` z dwiema strzałkami — zakres [od, do)', stack(
    code('''
        vector<int> lista = {1, 2, 3, 4, 5, 6};
        lista.erase(lista.begin() + 1, lista.begin() + 3);   // {1, 4, 5, 6}''', size='sm', hl=(2,)),
    center(arr([1, 2, 3, 4, 5, 6], name='lista', sel=(1, 2), ptr={1: 'begin() + 1', 3: 'begin() + 3'},
               spans=[(1, 2, 'usuwamy', 'or'), (3, 3, 'zostaje', 'tl')])),
    center(before_after(arr([1, 2, 3, 4, 5, 6], name='lista', size='sm', idx=False, sel=(1, 2)),
                        arr([1, 4, 5, 6], name='lista', size='sm', idx=False))),
    note('Gdy podamy <b>dwie</b> strzałki, erase usuwa cały kawałek: od pierwszej strzałki (<b>wliczamy</b>) do drugiej '
         '(<b>nie wliczamy</b>). Dokładnie tak jak begin() i end(): usuwamy indeksy 1 i 2, a 3 zostaje.'), gap=14))

slide('`insert` — wstawia element w środek', stack(
    code('''
        vector<int> lista = {1, 2, 3};
        lista.insert(lista.begin() + 1, 9);   // {1, 9, 2, 3}
        lista.insert(lista.begin(), 7);       // {7, 1, 9, 2, 3}
        lista.insert(lista.end(), 5);         // {7, 1, 9, 2, 3, 5}''', size='sm'),
    center(chain(('start', [1, 2, 3], ()), ('krok 1', [1, 9, 2, 3], (1,)), ('krok 2', [7, 1, 9, 2, 3], (0,)),
                 ('krok 3', [7, 1, 9, 2, 3, 5], (5,)))),
    note('insert(iterator, wartość) wstawia element <b>przed</b> miejscem, na które wskazuje strzałka. Elementy za nim '
         'przesuwają się w prawo, a size() rośnie o 1. Wstawienie przed <b>end()</b> to wstawienie na sam koniec — '
         'tak jak push_back.')))

slide('Metody vectora — ściąga', table(['Metoda', 'Co robi', 'Przykład'], [
    [c('push_back(x)'), 'dodaje x na koniec', c('{5} → {5, 7}')],
    [c('pop_back()'), 'usuwa ostatni element', c('{4, 8, 15} → {4, 8}')],
    [c('size()'), 'zwraca liczbę elementów', c('{1, 2, 5} → 3')],
    [c('clear()'), 'usuwa wszystkie elementy', c('{1, 2} → {}')],
    [c('front() / back()'), 'pierwszy / ostatni element', c('{4, 8, 15} → 4 / 15')],
    [c('assign(ile, co)'), 'wypełnia od nowa', c('assign(3, 1) → {1, 1, 1}')],
    [c('resize(n)'), 'zmienia rozmiar (dokłada zera)', c('{1} → resize(3) → {1, 0, 0}')],
    [c('begin() / end()'), 'strzałka na pierwszy / za ostatni', c('*begin() → 1, *(end() - 1) → 3')],
    [c('erase(begin() + k)'), 'usuwa element o indeksie k', c('{1, 2, 3}, k = 1 → {1, 3}')],
    [c('insert(begin() + k, x)'), 'wstawia x przed indeks k', c('{1, 3}, k = 1, x = 2 → {1, 2, 3}')],
], widths=['27%', '35%', '38%'], cls='mid'))

# ================================================================ 09
sec('09')
slide('Klasyczne wejście', cols(
    stack(term('n\na<sub>0</sub> a<sub>1</sub> a<sub>2</sub> a<sub>3</sub> … a<sub>n-1</sub>', 'in',
               cap='format (z notatek)', raw=True),
          P('W pierwszej linii <b>n</b> — ile liczb. W drugiej — <b>n liczb</b> oddzielonych spacjami.')),
    stack(term('5\n1 3 -2 7 0', 'in', cap='przykład (z notatek)'),
          center(arr([1, 3, -2, 7, 0], name='lista')))),
    note('Notatki pokazują <b>pięć sposobów</b> wczytania takiego wejścia do vectora. Przejdziemy przez każdy — '
         'wszystkie dają ten sam wynik.'))

slide('Sposób 1: `vector(n)` i pętla po indeksach', cols(
    code('''
        int n;
        cin >> n;
        vector<int> lista(n);
        for(int i = 0; i < n; i++){
            cin >> lista[i];
        }''', cap='z notatek', size='lg'),
    stack(steps([f'Wczytujemy {c("n")} = 5.',
                 f'{c("vector<int> lista(n);")} tworzy 5 zer — od razu są szufladki 0…4.',
                 f'Pętla nadpisuje każde zero wczytaną liczbą: {c("cin >> lista[i];")}'], cls='tight'),
          P('przed pętlą', 'muted'), arr([0] * 5, name='lista', size='sm', idx=False),
          P('po pętli', 'muted'), arr([1, 3, -2, 7, 0], name='lista', size='sm', idx=False, hi=tuple(range(5))), gap=8),
    t='1fr 1fr'))

slide('Sposób 2: `vector(n)` i for-each z `&`', cols(
    code('''
        int n;
        cin >> n;
        vector<int> lista(n);
        for(auto &e : lista){
            cin >> e;
        }''', cap='z notatek', size='lg', hl=(4, 5)),
    stack(steps(['Tak samo tworzymy n zer.',
                 f'{c("for(auto &e : lista)")} — e to <b>referencja</b> do kolejnej szufladki.',
                 f'{c("cin >> e;")} wpisuje liczbę <b>prosto do listy</b>.'], cls='tight'),
          warn(f'bez {c("&")} wczytywalibyśmy liczby do <b>kopii</b> — lista zostałaby pełna zer!', label='Pułapka:'),
          note('„99.9% olimpijczyków używa tych dwóch metod (ja używam tej drugiej)” — z notatek.')),
    t='1fr 1.1fr'))

slide('Sposób 3: pusty vector i `push_back`', cols(
    code('''
        int n, a;
        cin >> n;
        vector<int> lista;
        for(int i = 0; i < n; i++){
            cin >> a;
            lista.push_back(a);
        }''', cap='z notatek', size='lg'),
    stack(P(f'Startujemy od <b>pustego</b> vectora. Każdą liczbę wczytujemy najpierw do zmiennej {c("a")}, '
            'a potem dokładamy ją na koniec.'),
          chain(('start', [], ()), ('i = 0', [1], (0,)), ('i = 1', [1, 3], (1,)), ('i = 2', [1, 3, -2], (2,)),
                ('koniec', [1, 3, -2, 7, 0], (3, 4)))),
    t='1fr 1fr'))

slide('Sposób 4: `while(n--)` i `push_back`', cols(
    code('''
        int n, a;
        cin >> n;
        vector<int> lista;
        while(n--){
            cin >> a;
            lista.push_back(a);
        }''', cap='z notatek', size='lg', hl=(4,)),
    stack(P(f'{c("while(n--)")} to krótki sposób na „powtórz n razy”. Sprawdza n, a <b>potem</b> zmniejsza je o 1:'),
          table(['sprawdzamy n', 'różne od 0?', 'n potem', 'obrót'], [
              ['5', 'tak', '4', '1.'], ['4', 'tak', '3', '2.'], ['3', 'tak', '2', '3.'],
              ['2', 'tak', '1', '4.'], ['1', 'tak', '0', '5.'], ['0', '<b class="no">nie</b>', '-1', 'koniec']],
                cls='mid'),
          note('Pętla wykonała się dokładnie <b>5 razy</b>. Uwaga: po pętli n nie jest już równe 5!')),
    t='1fr 1.1fr'))

slide('Sposób 5: `while(n--)` i indeks z `size()`', cols(
    code('''
        int n;
        cin >> n;
        vector<int> lista(n);
        while(n--){
            cin >> lista[lista.size() - n - 1];
        }''', cap='z notatek', size='sm', hl=(5,)),
    stack(P('Tworzymy n zer, a indeks liczymy ze wzoru <b>size() - n - 1</b>. Dla n = 5 (size() = 5):'),
          table(['n w środku pętli', 'indeks = 5 - n - 1'], [
              ['4', '5 - 4 - 1 = <b>0</b>'], ['3', '5 - 3 - 1 = <b>1</b>'], ['2', '5 - 2 - 1 = <b>2</b>'],
              ['1', '5 - 1 - 1 = <b>3</b>'], ['0', '5 - 0 - 1 = <b>4</b>']], cls='mid'),
          note('Indeksy wychodzą po kolei: 0, 1, 2, 3, 4. Działa, ale łatwo się pomylić — na start wybierz sposób 1 albo 2.')),
    t='1fr 1.1fr'))

slide('Pięć sposobów — ten sam wynik', table(['Sposób', 'Tworzenie', 'Pętla', 'Wpisanie'], [
    ['1', c('vector<int> lista(n);'), c('for(int i = 0; i < n; i++)'), c('cin >> lista[i];')],
    ['2', c('vector<int> lista(n);'), c('for(auto &e : lista)'), c('cin >> e;')],
    ['3', c('vector<int> lista;'), c('for(int i = 0; i < n; i++)'), c('cin >> a;') + ' ' + c('lista.push_back(a);')],
    ['4', c('vector<int> lista;'), c('while(n--)'), c('cin >> a;') + ' ' + c('lista.push_back(a);')],
    ['5', c('vector<int> lista(n);'), c('while(n--)'), c('cin >> lista[lista.size()-n-1];')],
], widths=['9%', '25%', '28%', '38%'], cls='mid'),
    good('dla wejścia z notatek wszystkie dają {1, 3, -2, 7, 0}. Najczęściej używa się sposobu <b>1</b> i <b>2</b>.',
         label='Wynik:'))

slide('Wczytaj i wypisz — cały program', cols(
    code('''
        #include <iostream>
        #include <vector>
        using namespace std;

        int main(){
            int n;
            cin >> n;
            vector<int> lista(n);
            for(auto &e : lista){
                cin >> e;
            }
            for(auto el : lista){
                cout << el << ' ';
            }
            cout << endl;
        }''', size='sm'),
    stack(term('5\n1 3 -2 7 0', 'in'), term('1 3 -2 7 0'),
          note('Wczytujemy <b>z &</b> (bo zmieniamy listę), wypisujemy <b>bez &</b> (bo tylko czytamy).')),
    t='1.2fr 1fr'))

slide('Wczytywanie innych typów', stack(
    P('Zmienia się tylko <b>typ</b> w nawiasach ostrych. Reszta kodu zostaje taka sama:'),
    table(['Typ elementów', 'Tworzenie', 'Przykładowe wejście'], [
        ['liczby całkowite', c('vector<int> lista(n);'), c('5') + ' / ' + c('1 3 15 3 8')],
        ['ułamki', c('vector<double> lista(n);'), c('4') + ' / ' + c('1.14 5.33 8.12 7.29')],
        ['znaki', c('vector<char> lista(n);'), c('4') + ' / ' + c('a c b d')],
        ['napisy', c('vector<string> lista(n);'), c('5') + ' / ' + c('c++ programowanie kod oi oij')],
    ], widths=['22%', '36%', '42%'], cls='big'),
    note(f'Przy napisach dopisz na górze {c("#include <string>")}. cin czyta napis do najbliższej spacji — '
         'jedno słowo trafia do jednej szufladki.')))

# ================================================================ 10
sec('10')
slide('Vector 1D i vector 2D', cols(
    stack(P('<b>vector 1D</b> — jeden rząd szufladek:'),
          arr([3, 1, 4, 1, 5], name='1D', size='sm', idx=False),
          P(f'{c("vector<int>")}, {c("vector<char>")}, {c("vector<string>")}')),
    stack(P('<b>vector 2D</b> — tabela: wiersze i kolumny:'),
          grid([[1, 2, 3], [4, 5, 6], [7, 8, 9]]),
          P(f'{c("vector<vector<int>>")}, {c("vector<vector<char>>")}, {c("vector<vector<string>>")}'))),
    note('Vector 2D to <b>vector vectorów</b>: każdy element dużego vectora jest całym małym vectorem — jednym wierszem tabeli.'))

slide('Vector vectorów — każdy wiersz to vector', stack(
    code('vector<vector<int>> m = {{1, 2, 3}, {4, 5, 6}};', size='lg'),
    cols(center(grid([[1, 2, 3], [4, 5, 6]], name='m', size='')),
         steps([f'Duży vector ma <b>2 elementy</b> — {c("m.size()")} = 2 (liczba wierszy).',
                f'Każdy jego element to {c("vector<int>")}: {c("{1, 2, 3}")} oraz {c("{4, 5, 6}")}.',
                f'Długość wiersza: {c("m[0].size()")} = 3 (liczba kolumn).'], cls='tight'),
         t='1fr 1.25fr', align='center'), gap=22))

slide('Prostokąt 3 × 2 z zerami', stack(
    anat([('vector<vector<int>> prostokat(', None, None), ('3', 'or', 1), (', ', None, None),
          ('vector<int>(2, 0)', 'tl', 2), (');', None, None)],
         [(1, 'or', '3', '<b>ile wierszy</b>'),
          (2, 'tl', 'vector<int>(2, 0)', 'jak wygląda <b>jeden wiersz</b> — dwa zera')]),
    cols(center(grid([[0, 0]] * 3, name='prostokat')),
         note('To ten sam wzór co ' + c('vector<int> lista(5, 0);') + ' — „ile razy, co”. Tylko że teraz '
              'powtarzamy nie liczbę, ale <b>cały wiersz</b>.'), t='1fr 1.3fr', align='center')))

slide('Kwadrat 2 × 2 z piątkami', stack(
    code('vector<vector<int>> kwadrat(2, vector<int>(2, 5));', size='lg', cap='z notatek'),
    cols(center(grid([[5, 5], [5, 5]], name='kwadrat', size='')),
         table(['Zapis', 'Znaczenie'], [[c('2'), '2 wiersze'], [c('vector<int>(2, 5)'), 'każdy wiersz: dwie piątki']],
               cls='mid'), t='1fr 1.3fr', align='center'),
    note(f'Pusty vector 2D: {c("vector<vector<int>> lista;")} — nie ma w nim ani jednego wiersza.'), gap=20))

slide('Indeksowanie 2D: `[wiersz][kolumna]`', stack(
    code('vector<vector<int>> m = {{1, 2, 3}, {4, 5, 6}};', size='sm'),
    cols(center(grid([[1, 2, 3], [4, 5, 6]], name='m', size='', rowhi=(1,), hi={(1, 2)})),
         table(['Zapis', 'Typ', 'Co to jest'], [
             [c('m'), c('vector<vector<int>>'), 'cała tabela'],
             [c('m[1]'), c('vector<int>'), 'wiersz {4, 5, 6}'],
             [c('m[1][2]'), c('int'), 'liczba <b>6</b>']], widths=['22%', '46%', '32%'], cls='mid'),
         t='1fr 1.35fr', align='center'),
    note('Z notatek: <b>vector&lt;vector&lt;int&gt;&gt; → indeksowanie → vector&lt;int&gt; → indeksowanie → int</b>. '
         'Pierwszy nawias wybiera <b>wiersz</b>, drugi — <b>kolumnę</b> w tym wierszu.'), gap=20))

slide('Wypisywanie 2D — wiersz po wierszu', cols(
    code('''
        for(int i = 0; i < 3; i++){          // i = 0, 1, 2
            vector<int> tmp = prostokat[i];  // wiersz i
            for(int j = 0; j < 2; j++){
                cout << tmp[j] << ' ';       // kolumny
            }
            cout << endl;
        }''', cap='z notatek', size='sm'),
    stack(P(f'Pętla zewnętrzna przechodzi po <b>wierszach</b>. {c("tmp")} to kopia wiersza i — zwykły vector&lt;int&gt;. '
            'Pętla wewnętrzna wypisuje jego <b>kolumny</b>, a po wierszu — endl.'),
          term('0 0\n0 0\n0 0')),
    t='1.35fr 1fr'))

slide('To samo krócej: `prostokat[i][j]`', cols(
    code('''
        for(int i = 0; i < 3; i++){
            for(int j = 0; j < 2; j++){
                cout << prostokat[i][j] << ' ';
            }
            cout << endl;
        }''', cap='z notatek: to jest to samo co', size='lg'),
    stack(note(f'Zamiast robić kopię wiersza {c("tmp")}, od razu piszemy dwa nawiasy: {c("prostokat[i][j]")}.'),
          good(f'liczba wierszy to {c("prostokat.size()")}, a liczba kolumn — {c("prostokat[i].size()")}. '
               'Wtedy nie trzeba wpisywać 3 i 2 na sztywno.', label='Jeszcze lepiej:')),
    t='1.2fr 1fr'))

slide('Dwie pętle — w jakiej kolejności?', stack(
    center(grid([[f'{i},{j}' for j in range(2)] for i in range(3)], name='prostokat — pary (i, j)', size='')),
    steps(['Pętla zewnętrzna ustawia <b>wiersz i</b>.',
           'Pętla wewnętrzna przechodzi po <b>wszystkich kolumnach j</b> tego wiersza.',
           'Kolejność: (0,0) (0,1) → nowa linia → (1,0) (1,1) → nowa linia → (2,0) (2,1).'], cls='tight'), gap=20))

slide('Przykład z notatek: 5 × 5 zer i 3 × 3 jedynek', cols(
    code('''
        vector<vector<int>> lista(5, vector<int>(5, 0));
        cout << "lista: \\n";
        for(int i = 0; i < 5; i++){
            for(int j = 0; j < 5; j++){
                cout << lista[i][j] << ' ';
            }
            cout << endl;
        }
        vector<vector<int>> lista1(3, vector<int>(3, 1));
        cout << "lista1: \\n";
        for(int i = 0; i < 3; i++){
            for(int j = 0; j < 3; j++){
                cout << lista1[i][j] << ' ';
            }
            cout << endl;
        }''', size='xs'),
    term('lista:\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\n0 0 0 0 0\nlista1:\n1 1 1\n1 1 1\n1 1 1'),
    t='1.5fr 1fr'))

slide('`assign` w 2D — tak samo jak konstruktor', stack(
    code('''
        vector<vector<int>> lista;              // pusty 2D
        lista.assign(5, vector<int>(2, 0));    // 5 wierszy {0, 0}
        lista.assign(3, vector<int>(3, -1));   // 3 wiersze {-1, -1, -1}
        lista.assign(1, vector<int>(4, 3));    // 1 wiersz {3, 3, 3, 3}''', cap='z notatek', size='xs'),
    cols(center(grid([[0, 0]] * 5, name='assign(5, …(2, 0))', size='xs')),
         center(grid([[-1] * 3] * 3, name='assign(3, …(3, -1))', size='xs')),
         center(grid([[3] * 4], name='assign(1, …(4, 3))', size='xs')), align='center')))

slide('Dla ciekawych: vector 3D', stack(
    code('vector<vector<vector<int>>> lista2(2, vector<vector<int>>(2, vector<int>(2, 0)));', size='xs',
         cap='z notatek'),
    cols(center(grid([[0, 0], [0, 0]], name='lista2[0]', size='')), center(grid([[0, 0], [0, 0]], name='lista2[1]', size='')),
         gap=40),
    note(f'To vector, którego elementami są vectory 2D. Tutaj: 2 „warstwy”, w każdej 2 wiersze po 2 kolumny. '
         f'Dostęp: {c("lista2[i][j][k]")} — warstwa, wiersz, kolumna.')))

# ================================================================ 11
sec('11')
slide('Podtablica (subarray) — definicja', stack(
    big('Podtablica to <em>kawałek tablicy</em> z elementów<br><strong>stojących obok siebie, bez przerw</strong>.'),
    center(span(A9, 1, 3, name='tablica', size='', label='podtablica {5, 4, -6}')),
    note('Wybieramy jakiś początek i jakiś koniec — i bierzemy <b>wszystko pomiędzy</b>. Nie wolno niczego pominąć ani '
         'zmieniać kolejności. Po angielsku: <b>subarray</b>. W vectorze działa to dokładnie tak samo.'), gap=22))

slide('Przykłady z notatek', stack(
    P('Z tablicy {1, 5, 4, -6, 15, 9, 2, 1, 1} wycinamy cztery różne podtablice:'),
    *[f'<div>{span(A9, i, j, size="sm", label=lab, idx=(k == 0))}</div>'
      for k, (i, j, lab) in enumerate([(1, 3, '{5, 4, -6}'), (0, 4, '{1, 5, 4, -6, 15}'),
                                        (5, 8, '{9, 2, 1, 1}'), (0, 0, '{1}')])], gap=8))

slide('Czy to jest podtablica?', stack(
    center(arr(A9, name='tablica', size='sm')),
    cards(card('{5, 4, -6}', '<b class="yes">TAK</b> — indeksy 1, 2, 3 stoją obok siebie'),
          card('{4, 15}', '<b class="no">NIE</b> — pomija -6, jest przerwa'),
          card('{9}', '<b class="yes">TAK</b> — jeden element też jest podtablicą'),
          card('cała tablica', '<b class="yes">TAK</b> — od pierwszego do ostatniego'),
          card('{-6, 4}', '<b class="no">NIE</b> — zła kolejność'),
          card('{2, 1, 1}', '<b class="yes">TAK</b> — indeksy 6, 7, 8'), n=3), gap=20))

slide('Początek I i koniec J', stack(
    P('<b>Każda podtablica ma jakąś pozycję początkową</b> (nazwijmy ją <b>I</b>) <b>oraz jakąś pozycję końcową</b> '
      '(<b>J</b>). Załóżmy, że tablica ma rozmiar <b>N</b>.'),
    center(arr(A9, name='tablica', hi=(1, 2, 3), ptr={1: 'I = 1', 3: 'J = 3'})),
    big('WTEDY: &nbsp;<em>0 ≤ I, J &lt; N</em> &nbsp;oraz&nbsp; <em>I ≤ J</em>'),
    note('I i J to indeksy, więc są od 0 do N-1. Początek nie może być za końcem: I ≤ J. '
         'Gdy I = J, podtablica ma jeden element.'), gap=18))

slide('Podtablica = para (I, J)', stack(
    table(['Podtablica', 'I (początek)', 'J (koniec)', 'długość J - I + 1'], [
        ['{5, 4, -6}', '1', '3', '3'], ['{1, 5, 4, -6, 15}', '0', '4', '5'],
        ['{9, 2, 1, 1}', '5', '8', '4'], ['{1}', '0', '0', '1']], widths=['34%', '20%', '20%', '26%'], cls='big'),
    note('Żeby opisać podtablicę, wystarczą <b>dwie liczby</b>: początek i koniec. To idealne miejsce na <b>parę</b> '
         'z lekcji 9: ' + c('pair<int, int> p = {1, 3};') + ' — para &lt;początek; koniec&gt;.')))

slide('Wszystkie podtablice tablicy {1, 8, 9}', cols(
    stack(*[f'<div>{span([1, 8, 9], i, j, size="xs", label=f"({i}, {j})", idx=False)}</div>'
            for i, j in [(0, 0), (1, 1), (2, 2), (0, 1), (1, 2), (0, 2)]], gap=4),
    stack(table(['podtablica', 'para &lt;początek; koniec&gt;'], [
        ['1', '0 0'], ['8', '1 1'], ['9', '2 2'], ['1 8', '0 1'], ['8 9', '1 2'], ['1 8 9', '0 2']], cls='mid'),
          note('N = 3, więc 0 ≤ I, J &lt; 3. Aby wygenerować <b>wszystkie podtablice</b>, trzeba umieć wygenerować '
               '<b>wszystkie pary (I, J)</b> z I ≤ J.')),
    t='1fr 1.1fr'))

slide('Ile jest podtablic?', stack(
    P('Policzmy, ile podtablic zaczyna się na każdym indeksie — dla tablicy o długości <b>N = 4</b>:'),
    table(['początek I', 'możliwe końce J', 'ile'], [['0', '0, 1, 2, 3', '4'], ['1', '1, 2, 3', '3'],
                                                     ['2', '2, 3', '2'], ['3', '3', '1']],
          widths=['25%', '50%', '25%'], cls='mid'),
    good('razem 4 + 3 + 2 + 1 = <b>10</b>. Ogólnie: <b>N · (N + 1) / 2</b>. Dla N = 3: 3 · 4 / 2 = 6 — zgadza się!',
         label='Wzór:'),
    table(['N', '1', '2', '3', '4', '5', '10', '100'], [['podtablic', '1', '3', '6', '10', '15', '55', '5050']],
          cls='ctr')))

# ================================================================ 12
sec('12')
slide('Podzbiór (subset) — definicja', stack(
    big('Podzbiór to <em>dowolne elementy</em> tablicy —<br><strong>nie muszą stać obok siebie</strong>.'),
    center(arr(pick(A9, {1, 3, 5, 6, 7}), name='tablica', hi=(1, 3, 5, 6, 7))),
    note('Dla każdego elementu decydujemy: <b>bierzemy</b> albo <b>nie bierzemy</b>. Wybrane elementy zostają w tej samej '
         'kolejności co w tablicy. Po angielsku: <b>subset</b>. Powyżej: podzbiór {5, -6, 9, 2, 1}.'), gap=22))

slide('Przykłady z notatek', stack(
    P('Trzy podzbiory tej samej tablicy (podświetlone = wybrane, szare = pominięte):'),
    *[f'<div>{arr(pick(A9, ch), size="sm", hi=tuple(sorted(ch)), idx=False)}</div><p class="muted">{d}</p>'
      for ch, d in [({1, 3, 5, 6, 7}, '{5, -6, 9, 2, 1} — z przerwami'),
                    ({2, 3, 4}, '{4, -6, 15} — bez przerw (to jednocześnie podtablica!)'),
                    ({1, 2, 3, 6, 7}, '{5, 4, -6, 2, 1} — kawałek, przerwa, kawałek')]], gap=8))

slide('Czy to jest podzbiór?', stack(
    center(arr(A9, name='tablica', size='sm')),
    cards(card('{1, 15, 1}', '<b class="yes">TAK</b> — np. indeksy 0, 4, 7'),
          card('{5, 4}', '<b class="yes">TAK</b> — i to nawet podtablica'),
          card('{1, 1, 1}', '<b class="yes">TAK</b> — w tablicy są trzy jedynki (0, 7, 8)'),
          card('{7}', '<b class="no">NIE</b> — w tablicy nie ma liczby 7'),
          card('{9, 15}', '<b class="no">NIE</b> — 15 stoi przed 9, kolejność musi zostać'),
          card('cała tablica', '<b class="yes">TAK</b> — bierzemy wszystko'), n=3), gap=20))

SUB3 = [(a, b, cc) for a in (0, 1) for b in (0, 1) for cc in (0, 1)]
slide('Wybór: bierzemy albo nie', cols(
    stack(P('Tablica {1, 8, 9}. Przy każdym elemencie mówimy <b>TAK</b> albo <b>NIE</b>. Wszystkie możliwości:'),
          table(['1', '8', '9', 'podzbiór'],
                [['<b class="yes">tak</b>' if x else 'nie' for x in t3]
                 + ['{' + ', '.join(str(v) for v, x in zip((1, 8, 9), t3) if x) + '}' if any(t3) else '{ } — pusty']
                 for t3 in SUB3], cls='mid ctr')),
    stack(good('każdy z N elementów ma <b>2</b> możliwości → 2 · 2 · 2 = 2<sup>N</sup> = <b>8</b> '
               '(razem z pustym).', label='Liczymy:'),
          note('Niepustych podzbiorów jest 2<sup>N</sup> - 1 = <b>7</b>. Porównaj: podtablic tej tablicy było tylko <b>6</b> — '
               'brakuje {1, 9}.')),
    t='1.1fr 1fr'))

VENN2 = '''<svg class="venn" viewBox="0 0 460 260" xmlns="http://www.w3.org/2000/svg">
  <ellipse cx="230" cy="130" rx="220" ry="120" fill="rgba(124,92,255,.07)" stroke="#7c5cff" stroke-width="2.5"/>
  <text x="230" y="45" fill="#c6b8ff" font-size="18" text-anchor="middle">PODZBIÓR</text>
  <ellipse cx="230" cy="150" rx="120" ry="65" fill="rgba(0,229,199,.07)" stroke="#00e5c7" stroke-width="2.5"/>
  <text x="230" y="156" fill="#00e5c7" font-size="17" text-anchor="middle">PODTABLICA</text>
</svg>'''
slide('Podtablica a podzbiór', cols(
    stack(VENN2, P('rysunek z notatek', 'muted cen')),
    stack(steps(['Każda podtablica <b>jest</b> podzbiorem — to po prostu podzbiór bez przerw.',
                 'Ale <b>nie każdy</b> podzbiór jest podtablicą.',
                 'Przykład: {1, 9} z tablicy {1, 8, 9} — podzbiór, ale nie podtablica (pomija 8).']),
          center(arr(pick([1, 8, 9], {0, 2}), hi=(0, 2), idx=False))),
    t='1fr 1.1fr', align='center'))

slide('Podtablic jest mało, podzbiorów — bardzo dużo', stack(
    table(['N', 'podtablice: N · (N + 1) / 2', 'podzbiory niepuste: 2<sup>N</sup> - 1'], [
        ['3', '6', '7'], ['4', '10', '15'], ['5', '15', '31'], ['10', '55', '1 023'],
        ['20', '210', '1 048 575'], ['30', '465', 'ponad miliard']], widths=['16%', '42%', '42%'], cls='big'),
    note('Podzbiorów szybko robi się bardzo dużo — dla N = 30 nie da się ich wszystkich wypisać. Podtablic jest „tylko” '
         'około N² / 2.')))

# ================================================================ 13
sec('13')
slide('Prefiks — początek tablicy', stack(
    P('<b>Prefiks</b> to podtablica, która <b>zaczyna się na samym początku</b> — na indeksie 0. '
      'Przykłady z notatek dla ' + c('vector<int>') + ' {5, 4, 9, 1, 3, -5, 2, 1, 1, 7}:'),
    *[f'<div>{span(PS, 0, j, size="sm", label=f"(0, {j})", cls="or", idx=False)}</div>' for j in (0, 1, 2, 7, 9)],
    gap=6))

slide('Wszystkie prefiksy tablicy {1, 3, 0, -1, 2}', cols(
    stack(*[f'<div>{span(P5, 0, j, size="sm", label=f"(0, {j})", cls="or", idx=(j == 0))}</div>' for j in range(5)],
          gap=4),
    stack(table(['prefiks', 'I', 'J'], [['{' + ', '.join(map(str, P5[:j + 1])) + '}', '0', str(j)] for j in range(5)],
                cls='mid'),
          note('Tablica o długości n ma dokładnie <b>n prefiksów</b>. Początek zawsze I = 0, a koniec J = 0, 1, …, n-1.')),
    t='1fr 1fr'))

slide('Sufiks — koniec tablicy', stack(
    P('<b>Sufiks</b> to podtablica, która <b>kończy się na samym końcu</b> — na indeksie n-1. '
      'Przykłady z notatek dla tej samej tablicy:'),
    *[f'<div>{span(PS, i, 9, size="sm", label=f"({i}, 9)", cls="tl", idx=False)}</div>' for i in (9, 8, 7, 4, 0)],
    gap=6))

slide('Wszystkie sufiksy tablicy {1, 3, 0, -1, 2}', cols(
    stack(*[f'<div>{span(P5, i, 4, size="sm", label=f"({i}, 4)", idx=(i == 4))}</div>' for i in (4, 3, 2, 1, 0)],
          gap=4),
    stack(table(['sufiks', 'I', 'J'], [['{' + ', '.join(map(str, P5[i:])) + '}', str(i), '4'] for i in (4, 3, 2, 1, 0)],
                cls='mid'),
          note('Tablica o długości n ma dokładnie <b>n sufiksów</b>. Koniec zawsze J = n-1, a początek I = n-1, …, 1, 0.')),
    t='1fr 1fr'))

slide('Prefiks, sufiks, podtablica, podzbiór', cols(
    VENN,
    stack(table(['Pojęcie', 'Para (I, J)'], [
        ['podtablica', 'dowolne I ≤ J'], ['prefiks', '(0, J)'], ['sufiks', '(I, n-1)'],
        ['cała tablica', '(0, n-1) — prefiks i sufiks naraz']], widths=['40%', '60%'], cls='mid'),
          note('Każdy prefiks i każdy sufiks jest podtablicą, a każda podtablica — podzbiorem.')),
    t='1.1fr 1fr', align='center'))

slide('Prefiks czy sufiks?', stack(
    center(arr(PS, name='tablica', size='sm')),
    cards(card('{5, 4}', '<b>prefiks</b> — (0, 1)'),
          card('{1, 7}', '<b>sufiks</b> — (8, 9)'),
          card('{9, 1, 3}', '<b>ani to, ani to</b> — zwykła podtablica (2, 4)'),
          card('cała tablica', '<b>i prefiks, i sufiks</b> — (0, 9)'),
          card('{5}', '<b>prefiks</b> — (0, 0)'),
          card('{7}', '<b>sufiks</b> — (9, 9)'), n=3), gap=20))

# ================================================================ 14
sec('14')
slide('Zadania — od najłatwiejszych', stack(
    P('Wszystkie zadania z notatek, po kolei. Najpierw tworzenie i wczytywanie, potem logika, a na końcu zadania, '
      'w których przydadzą się podtablice i prefiksy.'),
    cards(card('Zadania 1–7', 'tworzenie vectora', 'tlc'), card('Zadania 8–11', 'wczytywanie do vectora', 'tlc'),
          card('Logika 1–4', 'parzyste, największa, najmniejsza', 'puc'),
          card('Zadanie 1', 'pierwszy i ostatni (CodeChef)', 'orc'), card('Zadanie 2', 'Codeforces', 'orc'),
          card('Podtablice i prefiksy', '3 zadania z rozwiązaniem krok po kroku', 'orc'), n=3)))

slide('Zadania 1–7: tworzenie vectora', cols(
    steps(['Stwórz wektor z wartościami <b>[1, 5, 7, 8]</b>.',
           'Stwórz wektor z wartościami <b>[c, d, e, f]</b>.',
           'Stwórz wektor z wartościami <b>[c++, program, olimpiada]</b>.',
           'Stwórz wektor z wartościami <b>[3.14, 2.78, 1.25]</b>.',
           'Stwórz wektor z <b>sześcioma zerami</b>.',
           'Stwórz wektor ze <b>stoma piątkami</b>.',
           'Stwórz wektor z <b>dwudziestoma napisami „C++”</b>.'], cls='tight'),
    stack(note('<b>Podpowiedź do 1–4:</b> jaki to typ? Liczby całkowite → int, pojedyncze litery → char, słowa → string, '
               'ułamki → double. Wartości wpisz w klamrach (sposób 2).'),
          note('<b>Podpowiedź do 5–7:</b> „n razy to samo” → nawiasy okrągłe (sposób 3): ' + c('vector<int> a(ile, co);'))),
    t='1.25fr 1fr'))

slide('Zadania 8–11: wczytaj input i zapisz listę do wektora', stack(
    table(['Nr', 'Format', 'Przykładowy input', 'Typ'], [
        ['8', 'n, potem a<sub>0</sub> … a<sub>n-1</sub>', c('5') + '<br>' + c('1 3 15 3 8'), 'liczby całkowite'],
        ['9', 'n, potem f<sub>0</sub> … f<sub>n-1</sub>', c('4') + '<br>' + c('1.14 5.33 8.12 7.29'), 'ułamki'],
        ['10', 'n, potem c<sub>0</sub> … c<sub>n-1</sub>', c('4') + '<br>' + c('a c b d'), 'znaki'],
        ['11', 'n, potem s<sub>0</sub> … s<sub>n-1</sub>', c('5') + '<br>' + c('c++ programowanie kod oi oij'), 'napisy'],
    ], widths=['7%', '33%', '38%', '22%'], cls='mid'),
    note('Wybierz typ vectora i jeden ze sposobów wczytywania z rozdziału 09. Na koniec wypisz vector, '
         'żeby sprawdzić, czy wszystko się wczytało.')))

slide('Zadania z logiką 1–4', cols(
    steps(['Ile jest liczb <b>parzystych</b>?',
           'Czego jest więcej: parzystych czy nieparzystych? Wypisz <b>„PARZYSTE”</b>, <b>„NIEPARZYSTE”</b> '
           'albo <b>„REMIS”</b>.',
           '<b>Największa</b> liczba w liście.',
           '<b>Najmniejsza</b> liczba w liście.'], cls='tight'),
    stack(term('5\n1 3 -2 7 0', 'in', cap='przykładowy input: n i lista'),
          table(['Zadanie', 'Wynik dla przykładu'], [['1', '2 (to -2 i 0)'], ['2', 'NIEPARZYSTE (3 &gt; 2)'],
                                                     ['3', '7'], ['4', '-2']], cls='mid'),
          note('Gdzie szuka się największej wartości? Z notatek: najwyższa góra, lepszy z dwóch skoczków, '
               'największy rozmiar telewizora.')),
    t='1.05fr 1fr'))

ROT = [[f'A{(k - s) % 6}' for k in range(6)] for s in range(6)]
slide('Zadanie 1: pierwszy i ostatni (CodeChef)', stack(
    P('Mamy tablicę A o długości N. Możemy ją dowolnie wiele razy <b>obracać</b> — przesuwać elementy w kółko, '
      'tak że ostatni wskakuje na początek. Jaka jest <b>największa</b> możliwa suma <b>pierwszego i ostatniego</b> elementu?'),
    note('Pełna treść i format wejścia: <b>vjudge.net/problem/CodeChef-FIRSTANDLAST</b>'),
    center(arr(['A0', 'A1', 'A2', 'A3', 'A4', 'A5'], name='A', hi=(0, 5),
               spans=[(0, 1, 'pierwszy', 'or'), (5, 1, 'ostatni', 'or')])),
    good('spróbuj sam: wypisz na kartce wszystkie obroty tablicy z 6 elementami i zaznacz pierwszy oraz ostatni '
         'element w każdym.', label='Zanim zajrzysz dalej:'), gap=18))

slide('Zadanie 1 — wskazówka z notatek', cols(
    stack(*[f'<div>{arr(r, name=f"obrót {s}", size="sm", idx=False, hi=(0, 5))}</div>' for s, r in enumerate(ROT)],
          gap=4),
    stack(table(['obrót', 'pierwszy + ostatni'], [[str(s), f'{r[0]} + {r[5]}'] for s, r in enumerate(ROT)], cls='mid'),
          good('pierwszy i ostatni to zawsze <b>dwaj sąsiedzi w kółku</b>: (A0, A5), (A5, A4), (A4, A3)… '
               'Wystarczy sprawdzić <b>każdą parę sąsiadów</b> — razem z parą A[N-1] i A[0].', label='Wniosek:')),
    t='1fr 1fr'))

slide('Zadanie 1 — rozwiązanie (zajrzyj po swojej próbie)', cols(
    code('''
        int n;
        cin >> n;
        vector<int> a(n);
        for(auto &e : a){
            cin >> e;
        }
        int best = a[n - 1] + a[0];       // para „przez koniec”
        for(int i = 0; i + 1 < n; i++){
            if(a[i] + a[i + 1] > best){   // para sąsiadów
                best = a[i] + a[i + 1];
            }
        }
        cout << best << endl;''', size='sm'),
    stack(steps(['Wczytujemy tablicę (sposób 2).',
                 f'Na start {c("best")} = suma pary „przez koniec”: ostatni + pierwszy.',
                 'Sprawdzamy wszystkie pary sąsiadów i zapamiętujemy największą sumę.'], cls='tight'),
          warn('sprawdź w treści dokładny format wejścia — np. czy w jednym pliku jest kilka testów.', label='Uwaga:')),
    t='1.3fr 1fr'))

slide('Zadanie 2 (Codeforces)', stack(
    P('Treść zadania znajdziesz pod linkiem z notatek (zadanie w grupie na Codeforces — może być potrzebne logowanie):'),
    note('<b>codeforces.com/group/MWSDmqGsZm/contest/219774/problem/L</b>'),
    good('upewnij się, że rozumiesz <b>podtablice</b> i <b>podzbiory</b> (rozdziały 11 i 12) — w notatkach '
         'definicje stoją zaraz przy tym zadaniu.', label='Zanim zaczniesz:')))

slide('Zadanie: wypisz wszystkie podtablice', cols(
    stack(term('n\na<sub>0</sub> a<sub>1</sub> a<sub>2</sub> … a<sub>n-1</sub>', 'in', cap='input', raw=True),
          term('3\n1 8 9', 'in', cap='przykładowy input')),
    stack(term('1\n8\n9\n1 8\n8 9\n1 8 9', cap='przykładowy output (z notatek)'),
          note('Każda linijka to jedna podtablica. Najważniejsze: wypisać <b>wszystkie</b> i każdą <b>raz</b>. '
               'Rozwiążemy to w trzech krokach.'))))

slide('Krok 1: wszystkie pary `(i, j)`', cols(
    code('''
        int n = 4;
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                cout << "{" << i << "," << j << "}" << endl;
            }
        }''', cap='z notatek', size='sm'),
    stack(term('{0,0}\n{0,1}\n{0,2}\n{0,3}\n{1,0}\n…\n{3,3}', cap='na ekranie: 16 par'),
          warn('pary takie jak {1,0} mają i &gt; j — koniec przed początkiem. To <b>nie są</b> podtablice!')),
    t='1.3fr 1fr'))

slide('Krok 2: elementy od `i` do `j`', cols(
    code('''
        vector<int> lista = {1, 2, 5, 21};
        int n = 4;
        for(int i = 0; i < n; i++){
            for(int j = 0; j < n; j++){
                // wyświetlamy elementy od startu (i) do końca (j)
                for(int k = i; k <= j; k++){
                    cout << lista[k] << ' ';
                }
                cout << endl;
            }
        }''', cap='z notatek', size='xs', hl=(6, 7, 8)),
    stack(P('Trzecia pętla (k) idzie od początku i do końca j i wypisuje te elementy — to jest jedna podtablica.'),
          warn('gdy i &gt; j, pętla po k nie wykona się ani razu — na ekranie pojawi się <b>pusta linijka</b>. '
               'Pary z i &gt; j trzeba pominąć.', label='Problem:')),
    t='1.35fr 1fr'))

slide('Krok 3: `j` zaczyna się od `i`', cols(
    code('''
        vector<int> lista = {1, 2, 5, 21};
        int n = 4;
        for(int i = 0; i < n; i++){
            for(int j = ⟦i⟧; j < n; j++){
                for(int k = i; k <= j; k++){
                    cout << lista[k] << ' ';
                }
                cout << endl;
            }
        }''', cap='z notatek — poprawione', size='sm', hl=(4,)),
    term('1\n1 2\n1 2 5\n1 2 5 21\n2\n2 5\n2 5 21\n5\n5 21\n21'),
    t='1.4fr 1fr'),
    note('j startuje od i, więc zawsze i ≤ j. Wypisaliśmy wszystkie <b>10</b> podtablic (4 · 5 / 2 = 10) — każdą raz.'))

slide('Kolejność wypisywania', stack(
    P('Dla przykładu {1, 8, 9} nasz program wypisze podtablice <b>w innej kolejności</b> niż w notatkach:'),
    cols(term('1\n1 8\n1 8 9\n8\n8 9\n9', cap='nasz program — według początku'),
         term('1\n8\n9\n1 8\n8 9\n1 8 9', cap='notatki — według długości'), gap=24),
    note('To <b>te same</b> 6 podtablic. Jeśli zadanie wymaga konkretnej kolejności, trzeba zmienić pętle — '
         'np. najpierw długość, potem początek.')))

DOTS5 = ['·'] * 5
slide('Zadanie: pary wszystkich prefiksów', cols(
    stack(P('<b>Wygeneruj i wyświetl wszystkie pary początków i końców wszystkich możliwych prefiksów</b> tablicy '
            'o długości n.'),
          term('5', 'in', cap='przykładowy input: n — rozmiar tablicy'),
          term('0 0\n0 1\n0 2\n0 3\n0 4', cap='przykładowy output')),
    stack(*[f'<div>{span(DOTS5, 0, j, size="xs", label=f"(0, {j})", cls="or", idx=(j == 0))}</div>'
            for j in range(5)], gap=4),
    t='1.1fr 1fr'))

slide('Pary prefiksów — rozwiązanie', cols(
    code('''
        int n;
        cin >> n;
        for(int j = 0; j < n; j++){
            cout << 0 << " " << j << endl;
        }''', size='lg'),
    stack(note('Prefiks <b>zawsze zaczyna się na 0</b>. Zmienia się tylko koniec J: 0, 1, …, n-1. '
               'Wystarczy więc <b>jedna</b> pętla.'),
          term('0 0\n0 1\n0 2\n0 3\n0 4')),
    t='1.2fr 1fr'))

slide('Zadanie: suma na każdym prefiksie', cols(
    stack(P('<b>Wyświetl sumę elementów na każdym prefiksie.</b>'),
          term('n\na<sub>0</sub> a<sub>1</sub> … a<sub>n-1</sub>', 'in', cap='input', raw=True),
          term('5\n1 3 0 -1 2', 'in', cap='przykładowy input'),
          term('1\n4\n4\n3\n5', cap='przykładowy output')),
    stack(*[f'<div>{span(P5, 0, j, size="xs", label=f"suma = {sum(P5[:j + 1])}", cls="or", idx=(j == 0))}</div>'
            for j in range(5)], gap=4),
    t='1fr 1fr'))

slide('Suma prefiksów — pomysł', stack(
    P('Nie trzeba liczyć każdej sumy od nowa! Każdy kolejny prefiks to <b>poprzedni prefiks + jeden nowy element</b>:'),
    table(['prefiks', 'liczymy', 'suma'], [
        ['{1}', '0 + 1', '<b>1</b>'], ['{1, 3}', '1 + 3', '<b>4</b>'], ['{1, 3, 0}', '4 + 0', '<b>4</b>'],
        ['{1, 3, 0, -1}', '4 + (-1)', '<b>3</b>'], ['{1, 3, 0, -1, 2}', '3 + 2', '<b>5</b>']],
          widths=['40%', '35%', '25%'], cls='mid'),
    note('Trzymamy w zmiennej <b>suma</b> wynik dla poprzedniego prefiksu i w każdym kroku dodajemy kolejny element.')))

slide('Suma prefiksów — rozwiązanie', cols(
    code('''
        int n;
        cin >> n;
        vector<int> lista(n);
        for(auto &e : lista){
            cin >> e;
        }
        int suma = 0;
        for(int i = 0; i < n; i++){
            suma += lista[i];       // dokładamy nowy element
            cout << suma << endl;   // suma prefiksu (0, i)
        }''', size='sm'),
    stack(term('5\n1 3 0 -1 2', 'in'), term('1\n4\n4\n3\n5')),
    t='1.35fr 1fr'))

# ================================================================ 15
sec('15')
slide('Najczęstsze błędy (1/2)', traps([
    f'<b>Indeks w pustym vectorze.</b> {c("vector<int> lista; lista[0] = 5;")} — szufladki 0 nie ma. '
    f'Użyj {c("push_back")} albo {c("vector<int> lista(n);")}.',
    f'<b>Nawiasy.</b> {c("vector<int> a(5, 0);")} to pięć zer, a {c("vector<int> a = {5, 0};")} — dwa elementy: 5 i 0.',
    f'<b>{c("cout << lista;")}</b> — błąd kompilacji. Wypisuj pętlą.',
    f'<b>Brak & przy wczytywaniu.</b> {c("for(auto e : lista) cin >> e;")} — liczby trafiają do kopii, '
    'lista zostaje pełna zer.',
]))

slide('Najczęstsze błędy (2/2)', traps([
    f'<b>Indeks poza zakresem.</b> {c("lista[lista.size()]")} nie istnieje — ostatni element to '
    f'{c("lista[lista.size() - 1]")} albo {c("lista.back()")}.',
    '<b>erase po kolei.</b> Po usunięciu elementy przesuwają się w lewo — indeksy pozostałych elementów się zmieniają.',
    f'<b>end() to nie ostatni element.</b> {c("*lista.end()")} czyta spoza vectora. Ostatni element to '
    f'{c("*(lista.end() - 1)")}. Iteratora nie wypisujemy bez gwiazdki: {c("cout << it;")} — błąd.',
    f'<b>Brak {c("#include <vector>")}.</b> Kompilator nie wie, co to vector.',
    f'<b>Kolejność w 2D.</b> {c("m[wiersz][kolumna]")}. {c("vector<vector<int>> m(3, vector<int>(2));")} '
    'to 3 wiersze po 2 kolumny — nie odwrotnie.',
]))

# ================================================================ 16
sec('16')
slide('Ściąga: tworzenie i metody', cards(
    card('Pusty', c('vector<int> lista;') + ' → { }'),
    card('Z wartościami', c('vector<int> lista = {1, 2, 3};')),
    card('n razy x / n zer', c('vector<int> lista(5, 0);') + ' · ' + c('lista(5)')),
    card('Odczyt / zmiana', c('lista[2]') + ' · ' + c('lista[2] = 7;')),
    card('Rozmiar', c('lista.size()')),
    card('Dodaj / usuń z końca', c('push_back(x)') + ' · ' + c('pop_back()')),
    card('Pierwszy / ostatni', c('front()') + ' · ' + c('back()')),
    card('Wyczyść / wypełnij / zmień rozmiar', c('clear()') + ' · ' + c('assign(n, x)') + ' · ' + c('resize(n)')),
    card('Iteratory', c('begin()') + ' → pierwszy · ' + c('end()') + ' → za ostatnim · ' + c('*it') + ' → wartość'),
    card('Usuń / wstaw', c('erase(begin() + k)') + ' · ' + c('insert(begin() + k, x)')), n=2))

slide('Ściąga: wczytywanie, wypisywanie, 2D', cols(
    stack(code('''
            int n;
            cin >> n;
            vector<int> lista(n);
            for(auto &e : lista){
                cin >> e;
            }''', cap='wczytaj n liczb', size='sm'),
          code('''
            for(auto el : lista){
                cout << el << ' ';
            }
            cout << endl;''', cap='wypisz', size='sm')),
    stack(code('vector<vector<int>> m(3, vector<int>(2, 0));', cap='2D: 3 wiersze po 2 zera', size='xs'),
          code('''
            for(int i = 0; i < m.size(); i++){
                for(int j = 0; j < m[i].size(); j++){
                    cout << m[i][j] << ' ';
                }
                cout << endl;
            }''', cap='wypisz 2D', size='xs')),
    t='1fr 1fr'))

slide('Ściąga: podtablica, podzbiór, prefiks, sufiks', table(['Pojęcie', 'Co to jest', 'Para (I, J)', 'Ile dla n'], [
    ['<b>podtablica</b>', 'elementy obok siebie, bez przerw', 'I ≤ J', 'n · (n + 1) / 2'],
    ['<b>podzbiór</b>', 'dowolne elementy, kolejność zostaje', '—', '2<sup>n</sup> - 1 niepustych'],
    ['<b>prefiks</b>', 'podtablica od początku', '(0, J)', 'n'],
    ['<b>sufiks</b>', 'podtablica do końca', '(I, n-1)', 'n'],
], widths=['18%', '40%', '18%', '24%'], cls='big'),
    note('Każdy prefiks i sufiks jest podtablicą, a każda podtablica — podzbiorem.'))

build(
    secs=SECS,
    html='pdf-src/prezentacja-vector-cpp.html',
    pdf='prezentacja-vector-cpp-t-olimpians.pdf',
    generator='pdf-src/build-prezentacja-vector.py',
    title='Vector w C++ — krok po kroku — T-Olimpians',
    brand='vector w C++',
    foot='Vector w C++ — krok po kroku',
    cover=dict(
        kicker='// T-OLIMPIANS — PREZENTACJA DO LEKCJI',
        h1='Vector w C++<br>— krok po kroku',
        sub='''Wszystko o vectorze, powoli i po kolei: tworzenie, indeksowanie, metody, wypisywanie, pętla
      for-each z referencją, iteratory begin() i end(), wczytywanie i vector 2D. Potem podtablice, podzbiory, prefiksy i sufiksy —
      a na końcu zadania z notatek, część z rozwiązaniem krok po kroku.''',
        meta='C++ · LEKCJA 10 · VECTOR · PO TABLICACH, STRINGACH I PARACH',
        deco=arr([5, 7, -1, 5], name='lista', size='sm')),
    end=dict(
        kicker='// KONIEC LEKCJI 10',
        h1='Umiesz już<br>korzystać z vectora!',
        sub='''Tworzenie, indeksowanie, metody, wypisywanie, for-each z referencją, iteratory begin() i end(),
      wczytywanie, vector 2D, podtablice, podzbiory, prefiksy i sufiksy. Teraz zadania! Na następnej lekcji:
      <b>sortowanie</b> — iteratory przydadzą się od razu: sort(lista.begin(), lista.end()).''',
        deco=arr([1, 4, 9, 16, 25], name='kwadraty', size='sm', hi=tuple(range(5)))),
)
