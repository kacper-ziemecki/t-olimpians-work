#!/usr/bin/env python3
"""Prezentacja „Tablice w C++ — krok po kroku” (T-Olimpians, lekcja 7).

Generuje pdf-src/prezentacja-tablice-cpp.html — poziome slajdy 16:9 w stylu
ściągi Python Turtle — i (z flagą --pdf) drukuje je do
prezentacja-tablice-cpp-t-olimpians.pdf przez Playwright (Chromium).
Wspólne klocki i styl są w pdf-src/prezentacja_lib.py.

    python3 pdf-src/build-prezentacja-tablice.py --pdf
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from prezentacja_lib import *  # noqa: E402,F401,F403

SECS = [
    ('01', 'Po co nam tablica?'),
    ('02', 'Tworzenie tablicy'),
    ('03', 'Rozmiar policzy C++'),
    ('04', 'Tablica bez listy'),
    ('05', 'Indeksowanie'),
    ('06', 'Odczyt jednego elementu'),
    ('07', 'Zmiana jednego elementu'),
    ('08', 'Wypisywanie całej tablicy'),
    ('09', 'Ustawianie wartości'),
    ('10', 'Wczytywanie tablicy'),
    ('11', 'Sprawdź się'),
    ('12', 'Najczęstsze błędy'),
    ('13', 'Podsumowanie'),
]

G5 = [(-5, 'g'), (123, 'g'), (15, 'g'), (3, 'g'), (-10, 'g')]
Q = ('?', 'g')
T10 = [1, 2, 3, 4, 4, 5, 8, 7, 9, 1]
T5 = [-2, 3, 5, 7, 9]

# ================================================================ 01
sec('01')
slide('Problem: dużo liczb naraz', cols(
    stack(
        P('Do tej pory każdą liczbę trzymaliśmy w <b>osobnej zmiennej</b>. '
          'Gdy liczby są trzy — da się wytrzymać:'),
        code('''
            int a = 4;
            int b = 7;
            int c = 1;''', cap='3 liczby — 3 zmienne'),
        P('A gdyby liczb było 5? 100? <b>1000</b>? Wymyślanie tysiąca nazw i pisanie '
          'tysiąca linijek nie ma sensu.')),
    stack(
        code('''
            int a1 = 4;
            int a2 = 7;
            int a3 = 1;
            int a4 = 9;
            int a5 = 2;
            // ... i tak dalej ...
            int a1000 = 6;   // 1000 linijek?!''', cap='1000 liczb — 1000 zmiennych?'),
        good('Potrzebujemy <b>jednej nazwy</b> na <b>wiele liczb</b>. '
             'Do tego służy <b>tablica</b>.', label='Wniosek:'))))

slide('Tablica = rząd ponumerowanych szufladek', stack(
    P('Tablica to <b>jedna zmienna</b>, która ma w środku <b>wiele miejsc</b> na liczby — '
      'jak rząd szufladek ustawionych jedna obok drugiej.'),
    center(arr([4, 7, 1, 9, 2], name='tablica', size='lg')),
    steps([
        f'Cała tablica ma <b>jedną nazwę</b> — tutaj {c("tablica")}.',
        'Każda szufladka trzyma <b>dokładnie jedną liczbę</b>.',
        f'Wszystkie szufladki mają <b>ten sam typ</b> — tutaj każda to {c("int")}, czyli liczba całkowita.',
        'Szufladki są <b>ponumerowane</b>. Numer szufladki to <b>indeks</b>. '
        'Zauważ, że numeracja zaczyna się od <b>0</b> — dokładnie omówimy to w rozdziale 05.',
    ])))

slide('Gdzie piszemy kod? — szablon programu', cols(
    code('''
        #include <iostream>    // 1. biblioteka z cin i cout
        using namespace std;   // 2. cout zamiast std::cout

        int main(){            // 3. tu zaczyna się program
            // <- tu wpisujemy kod z tablicami
        }                      // 4. tu program się kończy''', cap='szablon każdego programu', hl=(5,)),
    stack(
        P('Każdy przykład z tej prezentacji to kawałek <b>zwykłego programu</b> w C++.'),
        P('Żeby slajdy były czytelne, często pokazujemy <b>tylko ważne linijki</b> — '
          'resztę programu (szablon obok) dopisujesz sam.'),
        note(f'Jeśli na slajdzie widzisz sam fragment, np. {c("int tablica[5] = {-2, 3, 5, 7, 9};")}, '
             f'to w prawdziwym programie stoi on <b>w środku {c("main()")}</b> — w podświetlonej linijce. '
             'Wyjątek to tablice <b>globalne</b> (rozdział 04) — te piszemy <b>nad</b> main.')),
    t='1.25fr 1fr'))

# ================================================================ 02
sec('02')
slide('Najważniejsza zasada tablic', stack(
    big('Na początku <em>ustalamy wielkość tablicy</em><br>'
        'i <strong>później nie możemy tego zmienić</strong>.'),
    P('Wielkość tablicy (inaczej: <b>rozmiar</b>) to liczba szufladek. Wybieramy ją <b>raz</b> — '
      'w chwili tworzenia tablicy. Potem tablica już <b>nie urośnie i nie zmaleje</b>.'),
    code('int tablica[10];   // 10 szufladek — na zawsze', size='lg'),
    center(arr([('', 'empty')] * 10, name='tablica', idx=False, spans=[(0, 10, 'rozmiar = 10', 'tl')])),
    gap=22))

slide('Budowa linijki, która tworzy tablicę', stack(
    P('Rozłóżmy na części jedną linijkę. Każdy kawałek ma swoje zadanie:'),
    anat([('int', 'pu', 1), (' ', None, None), ('tablica', 'tl', 2), ('[10]', 'or', 3),
          (' = ', None, None), ('{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}', 'yl', 4), (';', 'gr', 5)],
         [(1, 'pu', 'int', '<b>typ</b> — co leży w szufladkach. int = liczby całkowite.'),
          (2, 'tl', 'tablica', '<b>nazwa</b> — wymyślamy ją sami (np. tablica, lista1, liczby).'),
          (3, 'or', '[10]', '<b>rozmiar</b> w nawiasach kwadratowych — ile jest szufladek.'),
          (4, 'yl', '= {1, 2, …, 10}', '<b>lista inicjalizacyjna</b> — co wpisać do szufladek: '
                                      'w klamrach, po przecinku, po kolei.'),
          (5, 'gr', ';', '<b>średnik</b> na końcu — jak po każdym poleceniu.')])))

slide('Przeczytajmy to po polsku', stack(
    code('int tablica[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};', size='lg'),
    steps([
        f'{c("int")} → „Zrób miejsce na <b>liczby całkowite</b>…”',
        f'{c("tablica")} → „…nazwij je <b>tablica</b>…”',
        f'{c("[10]")} → „…niech będzie w nim <b>10 szufladek</b>…”',
        f'{c("= {1, 2, …, 10}")} → „…i wpisz do nich <b>po kolei</b> liczby 1, 2, 3, …, 10.”',
    ]),
    center(arr(list(range(1, 11)), name='tablica'))))

slide('Przykład 1: tablica z 10 liczbami', stack(
    code('int tablica[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};', size='lg'),
    center(arr(list(range(1, 11)), name='tablica', size='lg')),
    note('W nawiasie <b>[10]</b> — 10 szufladek. W klamrach — <b>10 liczb</b>. '
         'Liczby trafiają do szufladek <b>w tej samej kolejności</b>, w jakiej je napisaliśmy: '
         'pierwsza liczba do pierwszej szufladki, druga do drugiej i tak dalej.'), gap=26))

slide('Przykład 2: liczby mogą być ujemne', stack(
    code('int tablica[5] = {-2, 3, 5, 7, 9};', size='lg'),
    center(arr(T5, name='tablica', size='lg')),
    P('Rozmiar <b>5</b> → 5 szufladek → w klamrach <b>5 liczb</b>.'),
    note(f'Typ {c("int")} mieści też liczby <b>ujemne</b>, więc <b>-2</b> to zwykły element. '
         'Liczby nie muszą też rosnąć ani iść po kolei — tablica zapamiętuje <b>dokładnie to</b>, co wpiszemy.'),
    gap=24))

slide('Przykład 3: mała tablica', stack(
    code('int tablica[3] = {2, 5, 7};', size='lg'),
    center(arr([2, 5, 7], name='tablica', size='lg')),
    P('Trzy szufladki, trzy liczby: <b>2</b>, <b>5</b> i <b>7</b>. Tablica może być dowolnie mała.'),
    good('<b>ile liczb w klamrach</b> = <b>rozmiar w nawiasie</b>. Tutaj: 3 liczby i [3]. Zgadza się.',
         label='Sprawdzaj zawsze:'), gap=24))

slide('Przykład 4: tablica z jednym elementem', stack(
    code('int tablica[1] = {-13};', size='lg'),
    center(arr([-13], name='tablica', size='lg')),
    P('Tablica może mieć nawet <b>jedną</b> szufladkę. To nadal tablica — po prostu z jednym miejscem. '
      'W klamrach jest jedna liczba: <b>-13</b>.'),
    note(f'Nawet przy jednej liczbie piszemy klamry: {c("{-13}")}.'), gap=24))

slide('Cztery przykłady obok siebie', stack(
    table(['Linijka', 'Rozmiar', 'Co jest w szufladkach'], [
        [c('int tablica[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};'), '10', arr(list(range(1, 11)), size='xs', idx=False)],
        [c('int tablica[5] = {-2, 3, 5, 7, 9};'), '5', arr(T5, size='xs', idx=False)],
        [c('int tablica[3] = {2, 5, 7};'), '3', arr([2, 5, 7], size='xs', idx=False)],
        [c('int tablica[1] = {-13};'), '1', arr([-13], size='xs', idx=False)],
    ], widths=['48%', '11%', '41%'], cls='mid'),
    note('To są <b>cztery osobne przykłady</b>. W jednym programie dwie tablice <b>nie mogą</b> mieć '
         'tej samej nazwy — gdy potrzebujesz kilku tablic naraz, nazwij je różnie, '
         f'np. {c("lista1")}, {c("lista2")}.')))

slide('Rozmiaru nie da się zmienić', cols(
    code('''
        int tablica[5] = {-2, 3, 5, 7, 9};

        // chcemy dopisać szóstą liczbę, np. 11...
        // ale tablica ma 5 szufladek
        // i ZAWSZE będzie miała 5.
        // Nie ma polecenia, które dorobi szóstą.'''),
    stack(
        arr(T5 + [('✕', 'ghost')], name='tablica', idxs=['0', '1', '2', '3', '4', ''],
            spans=[(0, 5, '5 szufladek', 'tl'), (5, 1, 'brak!', 'or')]),
        P('Szóstej szufladki <b>nie ma</b> i nie da się jej dorobić.')),
    t='1.2fr 1fr'),
    good('A co, gdy nie wiemy z góry, ile będzie liczb? Bierzemy tablicę <b>z zapasem</b> — większą, niż trzeba. '
         'Pokażemy to dokładnie w rozdziale 10 (wczytywanie).', label='Sposób:'))

# ================================================================ 03
sec('03')
slide('Lista podana? Rozmiar można pominąć', stack(
    P('Jak podczas tworzenia podajemy, na co ustawiamy szufladki — czyli podajemy <b>listę inicjalizacyjną</b> — '
      'to <b>nie musimy pisać rozmiaru</b>, ponieważ C++ sam się domyśli.'),
    cols(code('int tablica[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};', cap='z rozmiarem', size='sm'),
         code('int tablica⟦[]⟧ = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};', cap='bez rozmiaru — to samo!', size='sm'),
         gap=24),
    P(f'Puste nawiasy {c("[]")} znaczą: <b>„C++, policz sam”</b>. C++ liczy liczby w klamrach — '
      'jest ich 10 — więc tablica dostaje rozmiar 10. Obie linijki tworzą <b>identyczną</b> tablicę:'),
    center(arr(list(range(1, 11)), name='tablica'))))

slide('Jak C++ liczy rozmiar? Krok po kroku', stack(
    code('int tablica[] = {-2, 3, 5, 7, 9};', size='lg'),
    cols(
        steps([
            f'C++ widzi puste nawiasy {c("[]")} — rozmiaru nie podano.',
            'Zagląda do klamer i <b>liczy</b> liczby: -2 to 1., 3 to 2., 5 to 3., 7 to 4., 9 to 5.',
            'Wychodzi <b>5</b> — więc tworzy tablicę z <b>5 szufladkami</b>.',
            'Wpisuje do nich liczby po kolei — tak samo jak zawsze.',
        ]),
        stack(arr(T5, name='tablica', ptr={k: f'{k + 1}.' for k in range(5)}, ptrname='liczę'),
              good(f'Efekt jest taki sam, jak po napisaniu {c("int tablica[5] = {-2, 3, 5, 7, 9};")}',
                   label='Czyli:')),
        t='1.1fr 1fr')))

slide('Te same cztery przykłady — bez rozmiaru', stack(
    table(['Linijka bez rozmiaru', 'C++ liczy', 'Wychodzi to samo co'], [
        [c('int tablica[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};'), '10 liczb', c('int tablica[10] = …')],
        [c('int tablica[] = {-2, 3, 5, 7, 9};'), '5 liczb', c('int tablica[5] = …')],
        [c('int tablica[] = {2, 5, 7};'), '3 liczby', c('int tablica[3] = …')],
        [c('int tablica[] = {-13};'), '1 liczba', c('int tablica[1] = …')],
    ], widths=['52%', '18%', '30%'], cls='big'),
    note('Który zapis wybrać? <b>Oba są poprawne.</b> Bez rozmiaru jest wygodniej — nie trzeba liczyć samemu, '
         'więc nie da się pomylić.')))

slide('Uwaga: puste `[]` tylko razem z listą!', cols(
    stack(
        code('int tablica[];   // BŁĄD!', cap='źle — ani rozmiaru, ani listy', size='lg', bad=True),
        P('C++ nie ma <b>z czego policzyć</b> rozmiaru — klamer nie ma. '
          'Program się <b>nie skompiluje</b>.')),
    stack(
        code('int tablica[5];', cap='dobrze — rozmiar podany', size='lg', good=True),
        code('int tablica[] = {1, 2, 3};', cap='dobrze — C++ policzy z listy: 3', size='lg', good=True))),
    note(f'Tablica <b>bez listy</b> (jak {c("int tablica[5];")}) to temat następnego rozdziału — '
         'bo wtedy pojawia się ważne pytanie: <b>co jest w środku</b>?'))

# ================================================================ 04
sec('04')
slide('Możemy też nie podawać listy', stack(
    cols(stack(P('Listę inicjalizacyjną można pominąć. Wtedy piszemy tylko typ, nazwę i rozmiar:'),
               code('int lista1[5];', size='lg')),
         stack(center(arr([('?', 'q')] * 5, name='lista1')),
               P('Tablica ma 5 szufladek… ale <b>co w nich jest</b>? Nie wpisaliśmy żadnych liczb.', 'cen')),
         align='center'),
    P('Odpowiedź zależy od tego, <b>gdzie</b> stworzymy tablicę. Mamy <b>dwa przypadki</b>:'),
    cards(card('Przypadek nr 1 — tablica globalna', 'same zera: <b>{0, 0, 0, 0, 0}</b>', 'tlc'),
          card('Przypadek nr 2 — tablica lokalna', 'losowe śmieci, np. <b>{-5, 123, 15, 3, -10}</b>', 'orc'))))

slide('Gdzie jest „globalnie”, a gdzie „lokalnie”?', cols(
    '<div class="zones"><div class="zone glob"><div class="zl">strefa globalna — poza main</div>'
    + bare('''
        #include <iostream>
        using namespace std;

        int lista1[5];      // globalna

        int main(){''')
    + '<div class="zone loc"><div class="zl">strefa lokalna — w klamrach main</div>'
    + bare('int lista2[5];  // lokalna') + '</div>' + bare('}') + '</div></div>',
    stack(
        card('Globalna', f'stworzona <b>poza main</b>, poza innymi funkcjami, poza klamrami {c("{ }")}. '
                         'Zwykle na górze pliku, nad main.', 'tlc'),
        card('Lokalna', f'stworzona <b>wewnątrz main</b> albo innej funkcji — czyli <b>w środku klamer</b> {c("{ }")}.',
             'orc'),
        note('Patrz na klamry. Jeśli tablica stoi w środku klamer jakiejś funkcji — jest <b>lokalna</b>.',
             label='Podpowiedź:')),
    t='1.05fr 1fr'))

slide('Przypadek nr 1: tablica globalna', cols(
    code('''
        #include <iostream>
        using namespace std;

        int lista1[5];   // poza main → globalna

        int main(){

        }''', hl=(4,)),
    stack(
        P('Gdy tworzymy tablicę <b>globalną</b> (poza main, poza innymi funkcjami, poza klamrami), '
          'to ta tablica <b>domyślnie jest ustawiana na same zera</b>.'),
        center(arr([0] * 5, name='lista1')),
        good('globalna tablica bez listy = <b>{0, 0, 0, 0, 0}</b>. Zawsze — przy każdym uruchomieniu programu.',
             label='Zapamiętaj:')),
    t='1.1fr 1fr'))

slide('Przypadek nr 2: tablica lokalna', cols(
    code('''
        #include <iostream>
        using namespace std;

        int main(){
            int lista2[5];   // w main → lokalna
        }''', hl=(5,)),
    stack(
        P('Gdy tworzymy tablicę <b>lokalną</b> (wewnątrz main albo innej funkcji, w klamrach), '
          'to ta tablica <b>domyślnie jest ustawiana na losowe śmieci</b>, np.:'),
        center(arr(G5, name='lista2')),
        warn('te liczby to <b>przypadkowe resztki</b> w pamięci komputera. Przy następnym uruchomieniu mogą być '
             'zupełnie inne. <b>Nie wolno na nich polegać.</b>')),
    t='1.1fr 1fr'))

slide('Skąd się biorą śmieci?', cols(
    steps([
        f'Program tworzy lokalną tablicę {c("lista2[5]")} i dostaje na nią <b>5 miejsc w pamięci</b>.',
        'W tych miejscach <b>coś już wcześniej było</b> — liczby zostawione przez inne części programu.',
        'C++ — żeby działać szybciej — <b>nie czyści</b> tych miejsc przy tworzeniu lokalnej tablicy.',
        'W szufladkach zostaje to, co tam leżało. To właśnie <b>śmieci</b>.',
        'Tablice <b>globalne</b> C++ czyści zawsze — dlatego tam są zera.',
    ]),
    stack(
        P('Ten sam program, trzy uruchomienia:', 'muted'),
        arr(G5, name='uruch. 1', size='sm', idx=False),
        arr([(0, 'g'), (512, 'g'), (-1, 'g'), (8, 'g'), (0, 'g')], name='uruch. 2', size='sm', idx=False),
        arr([(912, 'g'), (0, 'g'), (-77, 'g'), (2, 'g'), (19, 'g')], name='uruch. 3', size='sm', idx=False),
        P('(przykład — u Ciebie liczby będą inne)', 'muted'), gap=12),
    t='1.25fr 1fr'))

slide('Oba przypadki obok siebie', cols(
    stack(code('''
        int lista1[5];       // przypadek nr 1

        int main(){
            int lista2[5];   // przypadek nr 2
        }''', cap='tak jak w notatkach'),
          note('Ta sama linijka — <b>int nazwa[5];</b> — a w środku coś zupełnie innego. '
               'Decyduje tylko <b>miejsce</b>, w którym ją napiszemy.')),
    stack(
        card('lista1 — globalna (poza main)', arr([0] * 5, size='sm') + '<div class="cap-t">same zera</div>', 'tlc'),
        card('lista2 — lokalna (w main)', arr(G5, size='sm') + '<div class="cap-o">losowe śmieci</div>', 'orc')),
    t='1fr 1fr'))

slide('Co z tego wynika?', stack(
    big('Zanim coś <em>odczytasz</em> z lokalnej tablicy bez listy,<br>'
        '<strong>najpierw coś do niej wpisz</strong>.'),
    cards(
        card('Chcę mieć same zera', 'zrób tablicę <b>globalną</b> albo wyzeruj ją pętlą (rozdział 09).', 'tlc'),
        card('Zaraz i tak wczytam liczby', 'tablica <b>lokalna</b> jest OK — wczytane liczby nadpiszą śmieci '
                                           '(rozdział 10).', 'puc'),
        card('Znam liczby od razu', 'podaj <b>listę inicjalizacyjną</b> — w środku będzie dokładnie to, co wpiszesz.',
             'orc'), n=3), gap=28))

# ================================================================ 05
sec('05')
slide('Każda szufladka ma numer — indeks', stack(
    code('int tablica[10] = {1, 2, 3, 4, 4, 5, 8, 7, 9, 1};', size='lg'),
    center(arr(T10, name='tablica', size='lg')),
    P('Numer szufladki nazywamy <b>indeksem</b>. Indeksy są napisane pod szufladkami: <b>0, 1, 2, …, 9</b>.'),
    cols(warn('w C++ numerowanie zaczyna się od <b>0</b>, a nie od 1! Pierwsza szufladka ma indeks 0.',
              label='Ważne:'),
         note('indeks mówi, <b>ile szufladek trzeba minąć</b> od początku. '
              'Do pierwszej nie mijamy żadnej → indeks 0.', label='Intuicja:'), gap=20), gap=18))

slide('Liczymy od zera — po kolei', stack(
    P('Nad szufladkami: która to szufladka <b>z kolei</b>. Pod szufladkami: jej <b>indeks</b>.'),
    center(arr(T10, name='tablica', size='lg', ptr={k: f'{k + 1}.' for k in range(10)}, ptrname='z kolei')),
    table(['Która z kolei', 'pierwsza', 'druga', 'trzecia', 'czwarta', '…', 'dziesiąta'],
          [['<b>Indeks</b>', '0', '1', '2', '3', '…', '9']], cls='big ctr'),
    warn('indeks jest zawsze <b>o 1 mniejszy</b> niż numer „z kolei”. '
         'Dziesiąta (ostatnia) szufladka ma indeks <b>9</b>. Szufladki o indeksie 10 <b>nie ma</b>.'), gap=20))

slide('Zakres indeksów: od `0` do `n-1`', stack(
    big('<em>n</em> → długość tablicy &nbsp;&nbsp;·&nbsp;&nbsp; zakres indeksów: <em>0 … n-1</em>'),
    P('Jeśli tablica ma <b>n</b> elementów, to pierwszy ma indeks <b>0</b>, a ostatni <b>n-1</b>. '
      'Indeksu <b>n</b> już <b>nie ma</b>.'),
    table(['Tablica', 'n (długość)', 'Indeksy', 'Ostatni indeks'], [
        [c('int tablica[10]'), '10', '0, 1, 2, …, 9', '<b>9</b>'],
        [c('int tablica[5]'), '5', '0, 1, 2, 3, 4', '<b>4</b>'],
        [c('int tablica[3]'), '3', '0, 1, 2', '<b>2</b>'],
        [c('int tablica[1]'), '1', 'tylko 0', '<b>0</b>'],
    ], widths=['30%', '20%', '30%', '20%'], cls='big'), gap=20))

slide('Dlaczego ostatni indeks to `n-1`?', cols(
    stack(
        center(arr(T5, name='tablica', size='lg', ptr={k: f'{k + 1}.' for k in range(5)}, ptrname='z kolei')),
        note('jak piętra w bloku: <b>parter</b> to poziom 0, potem 1. piętro, 2. piętro… '
             'W bloku z 5 poziomami najwyższe jest <b>4. piętro</b>.', label='Skojarzenie:')),
    steps([
        'Wypisujemy indeksy tablicy o długości 5: <b>0, 1, 2, 3, 4</b>.',
        'Liczymy, ile ich jest: <b>5</b> — tyle, ile szufladek. Zgadza się.',
        'Ale zaczęliśmy od <b>0</b>, a nie od 1 — więc każdy numer jest „przesunięty o jeden w dół”.',
        'Dlatego ostatni indeks to <b>5 - 1 = 4</b>. Ogólnie: <b>n - 1</b>.',
    ]), t='1fr 1.05fr'))

slide('Indeks to nie wartość!', stack(
    center(arr(T10, name='tablica', size='lg', sel=(6,), ptr={6: 'indeks 6'})),
    P('W szufladce o <b>indeksie 6</b> leży <b>wartość 8</b>. Indeks mówi, <b>gdzie</b> szukać. '
      'Wartość mówi, <b>co</b> tam leży.', 'cen'),
    cards(card('Co leży pod indeksem 3?', '<b>4</b>'),
          card('Co leży pod indeksem 4?', '<b>też 4</b> — wartości mogą się powtarzać'),
          card('Pod jakim indeksem leży 9?', 'pod indeksem <b>8</b>'),
          card('Pod jakim indeksem leży 1?', 'pod dwoma: <b>0</b> i <b>9</b>'), n=4), gap=22))

# ================================================================ 06
sec('06')
slide('Jak dostać się do jednej szufladki?', stack(
    center('<div class="syntax">nazwa<span>[</span>indeks<span>]</span></div>'),
    P(f'Piszemy nazwę tablicy, a zaraz za nią — w nawiasach kwadratowych — <b>indeks</b> szufladki. '
      f'Na przykład {c("tablica[6]")} czytamy: „tablica, szufladka o indeksie 6”.'),
    cols(code('int tablica[10] = {1, 2, 3, 4, 4, 5, 8, 7, 9, 1};', cap='tworzenie: w nawiasie ROZMIAR', size='sm'),
         code('cout << tablica[6];', cap='używanie: w nawiasie INDEKS', size='sm'), t='1.45fr 1fr', gap=24),
    warn(f'nie myl dwóch nawiasów! Przy <b>tworzeniu</b> ({c("int tablica[10]")}) w nawiasie stoi <b>rozmiar</b>. '
         f'Przy <b>używaniu</b> ({c("tablica[6]")}) w nawiasie stoi <b>indeks</b>.'), gap=20))

slide('Wypisujemy element o indeksie 6', stack(
    code('''
        int tablica[10] = {1, 2, 3, 4, 4, 5, 8, 7, 9, 1};
        cout << tablica[⟦6⟧] << endl;''', size='lg', hl=(2,)),
    center(arr(T10, name='tablica', sel=(6,), hi=(6,))),
    cols(steps([
        f'C++ bierze tablicę {c("tablica")}.',
        'Idzie do szufladki o indeksie <b>6</b> (mija 6 szufladek: 0, 1, 2, 3, 4, 5).',
        'Wyjmuje to, co tam leży: <b>8</b>.',
        f'{c("cout")} wypisuje 8, a {c("endl")} przechodzi do nowej linii.',
    ], cls='tight'), term('8'), t='1.7fr 1fr'), gap=18))

slide('Więcej przykładów odczytu', cols(
    code('''
        int tablica[10] = {1, 2, 3, 4, 4, 5, 8, 7, 9, 1};

        cout << tablica[0] << endl;   // pierwszy
        cout << tablica[3] << endl;
        cout << tablica[4] << endl;
        cout << tablica[9] << endl;   // ostatni: n-1 = 9'''),
    term('1\n4\n4\n1'), t='1fr 230px'),
    center(arr(T10, name='tablica', hi=(0, 3, 4, 9))),
    note('Każda linijka z cout wypisuje <b>jedną</b> szufladkę. Pod indeksem 3 i 4 leży ta sama wartość (4) — '
         'to nic dziwnego, to po prostu dwie różne szufladki z taką samą liczbą.'))

slide('Cały program — odczyt jednego elementu', cols(
    code('''
        #include <iostream>
        using namespace std;

        int main(){
            int tablica[10] = {1, 2, 3, 4, 4, 5, 8, 7, 9, 1};
            cout << tablica[6] << endl;
        }''', hl=(5, 6)),
    stack(term('8'),
          note('Tablica stoi w środku main, więc jest <b>lokalna</b>. Ale ma <b>listę inicjalizacyjną</b> — '
               'dlatego nie ma w niej śmieci, tylko dokładnie nasze liczby.')),
    t='1.45fr 1fr'))

slide('Element tablicy działa jak zwykła zmienna', stack(
    P(f'{c("tablica[2]")} to po prostu jedna liczba {c("int")}. Można jej użyć wszędzie tam, gdzie zwykłej '
      'zmiennej: przypisać, dodać, pomnożyć, wypisać.'),
    cols(code('''
        int tablica[5] = {-2, 3, 5, 7, 9};

        int x = tablica[2];                       // x = 5
        cout << x << endl;
        cout << tablica[0] + tablica[4] << endl;  // -2 + 9
        cout << tablica[1] * 10 << endl;          // 3 * 10'''),
         term('5\n7\n30'), t='1fr 200px'),
    center(arr(T5, name='tablica', hi=(0, 1, 2, 4)))))

slide('Indeks może być zmienną', stack(
    P('W nawiasach kwadratowych nie musi stać liczba. Może tam stać <b>zmienna</b> — '
      'C++ weźmie jej <b>aktualną wartość</b>.'),
    cols(code('''
        int tablica[10] = {1, 2, 3, 4, 4, 5, 8, 7, 9, 1};
        int i = 6;
        cout << tablica[⟦i⟧] << endl;   // i = 6, więc tablica[6]''', hl=(3,)),
         term('8'), t='1fr 180px'),
    center(arr(T10, name='tablica', hi=(6,), ptr={6: 'i = 6'})),
    good(f'to bardzo ważny krok! Dzięki niemu za chwilę <b>pętla for</b> przejdzie po całej tablicy — '
         f'sama zmieniając {c("i")}.', label='Ważne:'), gap=18))

slide('Zmieniamy `i` — zmienia się szufladka', cols(
    code('''
        int tablica[5] = {-2, 3, 5, 7, 9};
        int i = 0;
        cout << tablica[i] << ' ';   // i = 0 → -2
        i = 1;
        cout << tablica[i] << ' ';   // i = 1 → 3
        i = 2;
        cout << tablica[i] << ' ';   // i = 2 → 5''', hl=(3, 5, 7)),
    stack(term('-2 3 5 ', cursor=True),
          arr(T5, name='tablica', hi=(0, 1, 2), ptr={0: 'i=0', 1: 'i=1', 2: 'i=2'})),
    t='1.3fr 1fr'),
    note(f'Linijka {c("cout << tablica[i] << ' ';")} jest <b>za każdym razem taka sama</b> — a wypisuje coś innego, '
         f'bo zmienia się {c("i")}. Znak {c("' '")} to spacja: oddziela liczby od siebie.'))

# ================================================================ 07
sec('07')
slide('Wpisujemy nową wartość do szufladki', stack(
    P(f'Do elementu tablicy wpisujemy wartość <b>tak samo jak do zmiennej</b> — znakiem {c("=")}.'),
    code('''
        int tablica[5] = {-2, 3, 5, 7, 9};
        tablica[2] = 100;''', size='lg', hl=(2,)),
    cols(arr(T5, name='przed', size='lg', sel=(2,)),
         arr([-2, 3, 100, 7, 9], name='po', size='lg', hi=(2,)), gap=40),
    note('Stara wartość (<b>5</b>) znika — szufladka trzyma zawsze tylko jedną liczbę. '
         'Pozostałe szufladki się <b>nie zmieniają</b>.'), gap=20))

slide('Kilka zmian, jedna po drugiej', cols(
    code('''
        int tablica[5] = {-2, 3, 5, 7, 9};   // start

        tablica[0] = 10;                     // krok 1
        tablica[4] = 0;                      // krok 2
        tablica[1] = tablica[2];             // krok 3
        tablica[3] = tablica[3] + 1;         // krok 4''', size='sm'),
    stack(arr(T5, name='start', size='xs'),
          arr([10, 3, 5, 7, 9], name='krok 1', size='xs', hi=(0,)),
          arr([10, 3, 5, 7, 0], name='krok 2', size='xs', hi=(4,)),
          arr([10, 5, 5, 7, 0], name='krok 3', size='xs', hi=(1,)),
          arr([10, 5, 5, 8, 0], name='krok 4', size='xs', hi=(3,)), gap=8),
    t='1.55fr 1fr'),
    note('<b>Krok 3:</b> do szufladki 1 kopiujemy to, co leży w szufladce 2 (czyli 5). '
         '<b>Krok 4:</b> bierzemy starą wartość szufladki 3 (7), dodajemy 1 i wpisujemy z powrotem → 8.'))

slide('Indeks w zmiennej — także przy wpisywaniu', stack(
    code('''
        int tablica[5] = {-2, 3, 5, 7, 9};
        int i = 3;
        tablica[i] = 2;   // i = 3, więc tablica[3] = 2''', size='lg', hl=(3,)),
    center(arr([-2, 3, 5, 2, 9], name='tablica', size='lg', hi=(3,), ptr={3: 'i = 3'})),
    P(f'Tak samo jak przy odczycie — w nawiasie może stać zmienna. Ta linijka wpisuje 2 do szufladki, '
      f'której indeks akurat siedzi w {c("i")}.'),
    good('za chwilę pętla for zrobi to za nas dla <b>każdego</b> i po kolei — i tak wypełni całą tablicę '
         '(rozdział 09).', label='Zapowiedź:'), gap=20))

# ================================================================ 08
sec('08')
slide('Nie da się wyświetlić tablicy jednym `cout`!', cols(
    stack(
        code('''
            int tablica[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
            cout << tablica << endl;   // to NIE wypisze liczb''', size='sm', bad=True,
             cap='tak NIE robimy'),
        term('0x7ffd5c3a1b20', cap='na ekranie — coś dziwnego'),
        P(f'Zamiast liczb pojawia się dziwny napis. To <b>adres w pamięci</b> — numer miejsca, w którym leży tablica. '
          f'{c("cout")} nie potrafi sam przejść po wszystkich szufladkach.')),
    stack(big('<strong>Nie da się</strong><br>wyświetlić tablicy<br>jednym <em>cout</em>.'),
          warn('każdy element tablicy trzeba wypisać <b>osobno</b>.', label='Zasada:')),
    t='1.35fr 1fr'))

slide('Sposób „na piechotę”: każdy element osobno', cols(
    code('''
        int tablica[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};

        cout << tablica[⟦0⟧] << ' ';
        cout << tablica[⟦1⟧] << ' ';
        cout << tablica[⟦2⟧] << ' ';
        cout << tablica[⟦3⟧] << ' ';
        cout << tablica[⟦4⟧] << ' ';
        cout << tablica[⟦5⟧] << ' ';
        cout << tablica[⟦6⟧] << ' ';
        cout << tablica[⟦7⟧] << ' ';
        cout << tablica[⟦8⟧] << ' ';
        cout << tablica[⟦9⟧] << ' ';
        cout << endl;''', size='sm'),
    stack(
        P('Działa! Każda linijka wypisuje jedną szufladkę i spację:'),
        term('1 2 3 4 5 6 7 8 9 10'),
        warn('przy 1000 elementów trzeba by napisać <b>1000 linijek</b>…', label='Problem:'),
        good('<b>wszystkie linijki są takie same</b>. Zmienia się tylko liczba w nawiasie: '
             '0, 1, 2, …, 9 — po kolei, o jeden w górę.', label='Zauważ:')),
    t='1.15fr 1fr'))

slide('Pętla for daje po kolei `0, 1, 2, …, 9`', cols(
    stack(
        code('''
            for(int i = 0; i < 10; i++){
                cout << i << ' ';
            }''', size='lg'),
        term('0 1 2 3 4 5 6 7 8 9'),
        P(f'Przypomnienie: ta pętla wypisuje kolejne wartości {c("i")}. Spójrz — to dokładnie '
          '<b>wszystkie indeksy</b> tablicy o długości 10!')),
    stack(
        table(['Fragment', 'Co znaczy'], [
            [c('int i = 0'), 'zaczynamy od 0 — to pierwszy indeks'],
            [c('i < 10'), 'kręcimy, dopóki i &lt; 10; ostatnie i to <b>9 = n-1</b>'],
            [c('i++'), 'po każdym obrocie i rośnie o 1'],
        ], widths=['36%', '64%']),
        arr(list(range(10)), name='i', size='xs', idx=False, hi=tuple(range(10)),
            spans=[(0, 10, 'to wszystkie indeksy tablicy[10]', 'tl')]),
    ), t='1fr 1fr'))

slide('Łączymy: `tablica[i]` w pętli', cols(
    stack(
        code('''
            for(int i = 0; i < 10; i++){
                cout << tablica[⟦i⟧] << ' ';
            }
            cout << endl;''', size='lg', cap='kod z notatek'),
        P(f'Zamiast samego {c("i")} wypisujemy {c("tablica[i]")} — element pod indeksem i. W każdym obrocie '
          f'{c("i")} jest inne, więc za każdym razem wypisujemy <b>inną szufladkę</b>.')),
    table(['Fragment', 'Co robi'], [
        [c('int i = 0'), 'start od indeksu 0 — pierwszy element'],
        [c('i < 10'), 'koniec na i = 9 — ostatni element (n-1)'],
        [c('i++'), 'przejście do następnej szufladki'],
        [c("cout << tablica[i] << ' '"), 'wypisz element i spację'],
        [c('cout << endl;'), 'po pętli, <b>raz</b>: nowa linia'],
    ], widths=['48%', '52%']), t='1fr 1fr'))

PRINT5 = '''
    int tablica[5] = {-2, 3, 5, 7, 9};
    for(int i = 0; i < 5; i++){
        cout << tablica[i] << ' ';
    }
    cout << endl;'''

slide('Prześledźmy to powoli — na mniejszej tablicy', stack(
    P(f'Żeby dokładnie zobaczyć, co robi pętla, weźmy tablicę z <b>5</b> elementami. '
      f'Warunek to wtedy {c("i < 5")}.'),
    cols(code(PRINT5), center(arr(T5, name='tablica', size='lg')), t='1.2fr 1fr', align='center'),
    note(f'Na kolejnych slajdach: <b>jeden slajd = jeden obrót pętli</b>. Patrz na zmienną {c("i")}, '
         'podświetloną szufladkę i to, co pojawia się na ekranie.')))

for i in range(6):
    if i < 5:
        shown = ' '.join(str(v) for v in T5[:i + 1]) + ' '
        title = f'Obrót {i + 1} z 5: `i = {i}`'
        state = kv([
            ('i', f'<b>{i}</b>'),
            ('warunek', f'{c(f"{i} < 5")} → <b class="yes">TAK</b> — wchodzimy do środka pętli'),
            ('robimy', c(f"cout << tablica[{i}] << ' '")),
            ('efekt', f'na ekran trafia <b>{T5[i]}</b> i spacja'),
            ('potem', f'{c("i++")} → {c(f"i = {i + 1}")}'),
        ])
        pic = arr(T5, name='tablica', hi=(i,), ptr={i: f'i = {i}'})
        slide(title, cols(stack(code(PRINT5, hl=(2, 3), dim=True), term(shown, cursor=True)),
                          stack(state, center(pic)), t='1fr 1fr'))
    else:
        state = kv([
            ('i', '<b>5</b>'),
            ('warunek', c('5 < 5') + ' → <b class="no">NIE</b> — pętla się kończy'),
            ('robimy', 'linijkę po pętli: ' + c('cout << endl;')),
            ('efekt', 'przejście do nowej linii'),
        ])
        pic = arr(T5 + [('✕', 'ghost')], name='tablica', ptr={5: 'i = 5'},
                  idxs=['0', '1', '2', '3', '4', '5'])
        slide('`i = 5`: koniec pętli', cols(
            stack(code(PRINT5, hl=(2, 5), dim=True), term('-2 3 5 7 9 \n', cursor=True)),
            stack(state, center(pic),
                  note('Szufladki o indeksie 5 <b>nie ma</b> — i dobrze, że pętla tu staje.')), t='1fr 1fr'))

slide('Cała pętla w jednej tabeli', stack(
    table(['i', 'i < 5 ?', 'Co się dzieje', 'Na ekranie po tym kroku'], [
        ['0', 'tak', f'wypisz {c("tablica[0]")} → -2', c('-2')],
        ['1', 'tak', f'wypisz {c("tablica[1]")} → 3', c('-2 3')],
        ['2', 'tak', f'wypisz {c("tablica[2]")} → 5', c('-2 3 5')],
        ['3', 'tak', f'wypisz {c("tablica[3]")} → 7', c('-2 3 5 7')],
        ['4', 'tak', f'wypisz {c("tablica[4]")} → 9', c('-2 3 5 7 9')],
        ['5', '<b class="no">nie</b>', f'koniec pętli → {c("cout << endl;")}', c('-2 3 5 7 9') + ' + nowa linia'],
    ], widths=['8%', '14%', '42%', '36%'], cls='mid'),
    note('Pętla wykonała się <b>5 razy</b> — dla i = 0, 1, 2, 3, 4 — czyli dla <b>każdego indeksu</b> tablicy. '
         'Dla i = 5 warunek jest fałszywy i pętla się kończy.')))

slide('Cały program z notatek', cols(
    code('''
        #include <iostream>
        using namespace std;

        int main()
        {
            int tablica[] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
            for(int i = 0; i < 10; i++){
                cout << tablica[i] << ' ';
            }
            cout << endl;
        }''', size='sm'),
    stack(term('1 2 3 4 5 6 7 8 9 10'),
          note(f'Liczba <b>10</b> w warunku {c("i < 10")} to długość tablicy. C++ policzył ją z listy: '
               'w klamrach jest 10 liczb.'),
          good('ten program to wzór, który będziesz pisać <b>bardzo często</b>.', label='Zapamiętaj:')),
    t='1.35fr 1fr'))

slide('Po co ta spacja?', cols(
    stack(code('''
            for(int i = 0; i < 10; i++){
                cout << tablica[i];
            }''', cap='bez spacji', bad=True),
          term('12345678910')),
    stack(code('''
            for(int i = 0; i < 10; i++){
                cout << tablica[i] << ⟦' '⟧;
            }''', cap='ze spacją', good=True),
          term('1 2 3 4 5 6 7 8 9 10'))),
    P('Bez spacji liczby się <b>sklejają</b> — nie wiadomo, czy to 1, 2, 3, … czy jedna wielka liczba '
      '12345678910. Spacja oddziela kolejne elementy.'))

slide('`endl` w środku pętli czy po pętli?', cols(
    stack(code('''
            for(int i = 0; i < 5; i++){
                cout << tablica[i] << ⟦endl⟧;
            }''', cap='endl w środku — po każdej liczbie', size='sm'),
          term('-2\n3\n5\n7\n9')),
    stack(code('''
            for(int i = 0; i < 5; i++){
                cout << tablica[i] << ' ';
            }
            cout << ⟦endl⟧;''', cap='endl po pętli — raz, na końcu', size='sm'),
          term('-2 3 5 7 9'),
          note('Oba programy są poprawne — robią co innego. Najczęściej wypisujemy elementy <b>w jednej linii</b>, '
               f'oddzielone spacjami, a {c("endl")} dajemy <b>raz, po pętli</b>.')),
    t='1fr 1fr'))

slide('Uwaga na warunek: `i < 10`, a nie `i <= 10`', stack(
    code('''
        int tablica[10] = {1, 2, 3, 4, 5, 6, 7, 8, 9, 10};
        for(int i = 0; ⟦i <= 10⟧; i++){   // i dojdzie do 10!
            cout << tablica[i] << ' ';
        }''', bad=True, cap='źle'),
    cols(stack(arr(list(range(1, 11)) + [('?', 'ghost')], name='tablica', size='xs',
                   spans=[(0, 10, 'indeksy 0…9', 'tl'), (10, 1, 'poza!', 'or')]),
               term('1 2 3 4 5 6 7 8 9 10 32764', cap='na ekranie (przykład)')),
         warn(f'indeks <b>10 nie istnieje</b>. Program zagląda do pamięci <b>za tablicą</b> — wypisze śmieci '
              f'albo się wysypie. W pętli po tablicy zawsze {c("i < n")}.'),
         t='1.1fr 1fr')))

# ================================================================ 09
sec('09')
slide('Zadanie: wpisz 2 do każdej szufladki', cols(
    stack(P('Mamy tablicę na 10 liczb i chcemy, żeby <b>w każdej szufladce była liczba 2</b>.'),
          center(arr([2] * 10, name='chcemy', size='sm')),
          P('Można na piechotę — jak obok. Ale znowu: linijki są identyczne, zmienia się tylko '
            'indeks 0, 1, 2, …, 9.'),
          good('używamy pętli for — dokładnie jak przy wypisywaniu.', label='Więc:')),
    code('''
        int tablica[10];

        tablica[⟦0⟧] = 2;
        tablica[⟦1⟧] = 2;
        tablica[⟦2⟧] = 2;
        // ... i tak dalej ...
        tablica[⟦9⟧] = 2;''', cap='na piechotę'),
    t='1.15fr 1fr'))

GARB10 = [(v, 'g') for v in (-5, 123, 15, 3, -10, 7, 0, 88, -1, 4)]
slide('Pętla, która ustawia wartości', cols(
    code('''
        int tablica[10];
        for(int i = 0; i < 10; i++){
            tablica[⟦i⟧] = 2;
        }''', size='lg', cap='kod z notatek'),
    stack(arr(GARB10, name='przed', size='xs'),
          arr([2] * 10, name='po', size='xs', hi=tuple(range(10)))),
    t='1fr 1fr', align='center'),
    P(f'W każdym obrocie pętli do szufladki o indeksie {c("i")} wpisujemy 2. Pętla odwiedza <b>wszystkie</b> '
      'indeksy 0…9, więc <b>każda</b> szufladka dostaje 2 — stare śmieci znikają.'),
    note(f'Porównaj z wypisywaniem: pętla ta sama, zmienia się tylko środek — '
         f'zamiast {c("cout << tablica[i]")} jest {c("tablica[i] = 2")}.'))

SET5 = '''
    int tablica[5];
    for(int i = 0; i < 5; i++){
        tablica[i] = 2;
    }'''
slide('Krok po kroku: co się dzieje w tablicy', cols(
    stack(code(SET5, size='lg'),
          note('Pętla „przesuwa się” po tablicy od lewej do prawej. Po każdym obrocie '
               '<b>jedna szufladka więcej</b> ma wartość 2.'),
          P(f'Gdy {c("i")} dojdzie do 5, warunek {c("5 < 5")} jest fałszywy — koniec.')),
    stack(arr(G5, name='start', size='xs'),
          *[arr([2] * (k + 1) + G5[k + 1:], name=f'i = {k}', size='xs', hi=(k,)) for k in range(5)], gap=6),
    t='1fr 1fr'))

slide('Cały program: ustaw i wypisz', cols(
    code('''
        #include <iostream>
        using namespace std;

        int main(){
            int tablica[10];
            for(int i = 0; i < 10; i++){   // pętla 1: ustaw
                tablica[i] = 2;
            }
            for(int i = 0; i < 10; i++){   // pętla 2: wypisz
                cout << tablica[i] << ' ';
            }
            cout << endl;
        }''', size='sm', hl=(6, 7, 8, 9, 10, 11)),
    stack(term('2 2 2 2 2 2 2 2 2 2'),
          note('Dwie <b>osobne</b> pętle, jedna po drugiej: najpierw cała tablica dostaje wartości, '
               'potem całą wypisujemy.'),
          note(f'W obu pętlach możemy użyć nazwy {c("i")} — każda pętla ma swoje własne {c("i")}.')),
    t='1.3fr 1fr'))

slide('Zerowanie — sposób na śmieci', cols(
    code('''
        int main(){
            int lista2[5];                // lokalna → śmieci
            for(int i = 0; i < 5; i++){
                lista2[i] = 0;            // każda = 0
            }
            // teraz lista2 = {0, 0, 0, 0, 0}
        }''', size='sm', hl=(3, 4, 5)),
    stack(arr(G5, name='przed', size='sm'), arr([0] * 5, name='po', size='sm', hi=tuple(range(5))), gap=14),
    t='1.35fr 1fr'),
    good('pamiętasz przypadek nr 2 z rozdziału 04? Lokalna tablica bez listy ma śmieci. Ta pętla ją <b>czyści</b> — '
         'od teraz są w niej same zera, tak jak w tablicy globalnej.', label='Połączenie:'))

slide('Wartość może zależeć od `i`', cols(
    stack(P(f'Po prawej stronie znaku {c("=")} może stać nie tylko stała liczba, ale też coś z {c("i")}. '
            'Wtedy każda szufladka dostaje <b>inną</b> wartość.'),
          code('''
              int tablica[5];
              for(int i = 0; i < 5; i++){
                  tablica[i] = ⟦i⟧;
              }''')),
    table(['i', 'robimy', 'tablica po kroku'], [
        [str(k), c(f'tablica[{k}] = {k}'), arr(list(range(k + 1)) + [Q] * (4 - k), size='xs', idx=False, hi=(k,))]
        for k in range(5)
    ], widths=['10%', '40%', '50%'], cls='mid'),
    t='1fr 1.1fr'),
    note('Wynik: <b>{0, 1, 2, 3, 4}</b> — każda szufladka trzyma swój własny indeks.'))

FRAME = '''
    int tablica[10];
    for(int i = 0; i < 10; i++){
        tablica[i] = ⟦...⟧;   // co wpisać?
    }'''
slide('Więcej wzorów z `i`', stack(
    cols(code(FRAME, size='sm'),
         P('Ta sama pętla — zmieniamy tylko to, co stoi po znaku <b>=</b>. '
           'Pomarańczowa ramka pokazuje szufladkę <b>i = 3</b> — sprawdź ją w głowie!'),
         t='1.2fr 1fr', align='center'),
    '<div class="rows">'
    + ''.join(f'<div class="rw"><div>{c(f"tablica[i] = {e};")}<span class="rwn">dla i = 3: {n}</span></div>'
              f'{arr(v, size="sm", idx=False, sel=(3,))}</div>'
              for e, v, n in [('i + 1', list(range(1, 11)), '3 + 1 = 4'),
                              ('i * i', [k * k for k in range(10)], '3 * 3 = 9'),
                              ('10 - i', [10 - k for k in range(10)], '10 - 3 = 7')])
    + '</div>', gap=18))

# ================================================================ 10
sec('10')
slide('Jak wygląda wejście?', cols(
    stack(term('n\na<sub>0</sub> a<sub>1</sub> a<sub>2</sub> a<sub>3</sub> … a<sub>n-1</sub>', 'in',
               cap='format wejścia', raw=True),
          P('W pierwszej linii jest <b>n</b> — ile liczb będzie dalej. W drugiej linii jest '
            '<b>n liczb</b> oddzielonych spacjami.')),
    stack(term('7\n1 2 3 -5 8 -1 2', 'in', cap='przykład'),
          P('Tutaj n = 7, więc w drugiej linii jest 7 liczb.'))),
    center(arr([1, 2, 3, -5, 8, -1, 2], name='tablica', ptr={k: f'a<sub>{k}</sub>' for k in range(7)},
               ptrname='liczba')),
    note(f'Liczby nazywamy a<sub>0</sub>, a<sub>1</sub>, …, a<sub>n-1</sub> — mają numery <b>od 0 do n-1</b>, '
         f'dokładnie jak indeksy tablicy! Liczba a<sub>3</sub> trafi do {c("tablica[3]")}.'))

ZAPAS = [1, 2, 3, -5, 8, -1, 2, ('', 'x'), ('', 'x'), ('…', 'dots'), ('', 'x')]
ZAPAS_I = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '…', '99']
slide('Problem: ile miejsca zrobić?', stack(
    P('Program piszemy <b>zanim</b> zobaczymy wejście. Raz n = 7, innym razem n = 50. A rozmiar tablicy '
      'musimy ustalić <b>na początku</b> i nie można go zmienić (rozdział 02).'),
    good('bierzemy tablicę <b>z zapasem</b>. W treści zadania zawsze jest napisane, jakie może być '
         '<b>największe n</b>, np. „n ≤ 100”. Robimy tablicę co najmniej tak dużą:', label='Rozwiązanie:'),
    code('int tablica[100]; // 100 >= n', size='lg'),
    center(arr(ZAPAS, name='tablica', idxs=ZAPAS_I,
               spans=[(0, 7, 'n = 7 — używamy', 'tl'), (7, 4, 'zapas — nie używamy', 'gr')]))))

READ = '''
    int main()
    {
        int tablica[100]; // 100 >= n
        int n;
        cin >> n;
        for(int i = 0; i < n; i++){
            cin >> tablica[i];
        }
    }'''
READ_L = textwrap.dedent(READ).strip('\n').split('\n')


def read_upto(k):
    """Kod wczytywania do linijki k włącznie + zamykająca klamra main."""
    return '\n'.join(READ_L[:k] + ['}'])


Q10 = [Q] * 8 + [('…', 'dots'), Q]
Q10_I = ['0', '1', '2', '3', '4', '5', '6', '7', '…', '99']
slide('Budujemy program — krok 1: tablica z zapasem', cols(
    code(read_upto(3), hl=(3,)),
    stack(P('Tworzymy tablicę na <b>100</b> liczb.'),
          arr(Q10, name='tablica', size='sm', idxs=Q10_I),
          note('Tablica jest <b>lokalna</b> (w main), więc w środku są śmieci. Ale to nic — '
               'zaraz nadpiszemy je wczytanymi liczbami.')),
    t='0.75fr 1.25fr'))

slide('Krok 2: zmienna n', cols(
    code(read_upto(4), hl=(4,)),
    stack(P('Tworzymy zmienną <b>n</b>. Będzie pamiętać, <b>ile liczb</b> jest na wejściu.'),
          kv([('n', '? — na razie nic tam nie wpisaliśmy')]),
          note('n to <b>zwykła zmienna</b>, nie tablica — trzyma jedną liczbę.')),
    t='0.75fr 1.25fr'))

slide('Krok 3: wczytujemy n', cols(
    code(read_upto(5), hl=(5,)),
    stack(inp_tokens([['7'], ['1', '2', '3', '-5', '8', '-1', '2']], used=0, cur=0),
          P(f'{c("cin >> n;")} czyta <b>pierwszą</b> liczbę z wejścia — <b>7</b> — i wpisuje ją do n.'),
          kv([('n', '<b>7</b>')]),
          good('teraz program wie, że za chwilę przyjdzie <b>7 liczb</b>.', label='Efekt:')),
    t='0.75fr 1.25fr'))

slide('Krok 4: pętla wczytująca', cols(
    code(READ, hl=(6, 7, 8)),
    stack(P('Pętla przechodzi po indeksach <b>0, 1, …, n-1</b>. W każdym obrocie '
            f'{c("cin >> tablica[i];")} czyta <b>kolejną</b> liczbę z wejścia i wkłada ją do szufladki o indeksie i.'),
          warn(f'w warunku jest {c("i < n")}, a <b>nie</b> {c("i < 100")}. Wczytujemy tyle liczb, ile jest naprawdę '
               '(n), a nie tyle, ile mamy miejsca.')),
    t='0.75fr 1.25fr'))

slide('Gotowy kod wczytywania — z notatek', cols(
    code('''
        int main()
        {
            int tablica[100]; // 1. zapas: 100 >= n
            int n;            // 2. ile liczb
            cin >> n;         // 3. wczytaj n
            for(int i = 0; i < n; i++){
                cin >> tablica[i];   // 4. wczytaj n liczb
            }
        }'''),
    steps(['Tablica <b>z zapasem</b> — większa niż największe n.',
           f'Zmienna {c("n")} na liczbę elementów.',
           f'{c("cin >> n;")} — najpierw wczytujemy, ile ich będzie.',
           f'Pętla {c("i < n")} — wczytujemy n liczb, każdą do następnej szufladki.']),
    t='1.25fr 1fr'))

IN7 = [['7'], ['1', '2', '3', '-5', '8', '-1', '2']]
V7 = [1, 2, 3, -5, 8, -1, 2]


def read_arr(k, hi=()):
    vals = V7[:k] + [Q] * (8 - k) + [('…', 'dots'), Q]
    return arr(vals, name='tablica', size='sm', idxs=Q10_I, hi=hi,
               ptr={hi[0]: f'i = {hi[0]}'} if hi else None)


slide('Wczytujemy przykład — start: n = 7', cols(
    stack(code(READ, hl=(5,), dim=True, size='sm'),
          inp_tokens(IN7, used=0, cur=0)),
    stack(kv([('robimy', c('cin >> n;')), ('wczytane', '<b>7</b>'), ('n', '<b>7</b>')]),
          read_arr(0),
          note('Tablica nadal ma w środku śmieci (?). Za chwilę zacznie się pętla.')),
    t='0.75fr 1.25fr'))

for k in range(2):
    slide(f'Obrót {k + 1}: `i = {k}`', cols(
        stack(code(READ, hl=(6, 7), dim=True, size='sm'),
              inp_tokens(IN7, used=k + 1, cur=k + 1)),
        stack(kv([('i', f'<b>{k}</b>'),
                  ('warunek', f'{c(f"{k} < 7")} → <b class="yes">TAK</b>'),
                  ('robimy', c(f'cin >> tablica[{k}];')),
                  ('wczytane', f'<b>{V7[k]}</b> → trafia do szufladki {k}'),
                  ('potem', f'{c("i++")} → {c(f"i = {k + 1}")}')]),
              read_arr(k + 1, hi=(k,))),
        t='0.75fr 1.25fr'))

slide('Kolejne obroty — w tabeli', stack(
    table(['i', 'i < 7 ?', 'wczytujemy', 'tablica po kroku (pierwsze 8 szufladek)'], [
        [str(k), 'tak', c(f'tablica[{k}] = {V7[k]}'),
         arr(V7[:k + 1] + [Q] * (7 - k), size='xs', idx=False, hi=(k,))] for k in range(2, 7)
    ] + [['7', '<b class="no">nie</b>', 'koniec pętli', arr(V7 + [Q], size='xs', idx=False)]],
        widths=['7%', '12%', '28%', '53%'], cls='mid'),
    note('Szare <b>?</b> to śmieci — szufladki, do których jeszcze nic nie wczytaliśmy.')))

slide('Koniec wczytywania: `i = 7`', cols(
    stack(code(READ, hl=(6,), dim=True, size='sm'),
          inp_tokens(IN7, used=8, cur=None)),
    stack(kv([('i', '<b>7</b>'), ('warunek', c('7 < 7') + ' → <b class="no">NIE</b> — koniec pętli'),
              ('n', '7'), ('wczytano', 'wszystkie 7 liczb')]),
          arr(V7 + [Q, ('…', 'dots'), Q], name='tablica', size='sm',
              idxs=['0', '1', '2', '3', '4', '5', '6', '7', '…', '99'],
              spans=[(0, 7, 'n = 7 liczb', 'tl'), (7, 3, 'zapas', 'gr')])),
    t='0.75fr 1.25fr'),
    good('Liczby z wejścia są w szufladkach <b>0…6</b>, czyli <b>0…n-1</b>. Reszta tablicy to nieużywany zapas.',
         label='Gotowe:'))

slide('Dlaczego `i < n`, a nie `i < 100`?', cols(
    stack(code('''
            for(int i = 0; i < 100; i++){   // chce 100 liczb!
                cin >> tablica[i];
            }''', size='sm', bad=True, cap='źle'),
          term('7\n1 2 3 -5 8 -1 2', 'in')),
    stack(P('Na wejściu jest tylko <b>7</b> liczb. Po ich wczytaniu pętla chce ósmą, dziewiątą… aż do setnej — '
            'których <b>nie ma</b>.'),
          warn('program będzie <b>czekał</b> na liczby, które nigdy nie przyjdą (albo wczyta bzdury).',
               label='Skutek:'),
          good(f'wczytujemy dokładnie tyle liczb, ile podano: {c("i < n")}. Rozmiar tablicy (100) to tylko '
               '<b>miejsce</b>, a n to <b>ile naprawdę</b> używamy.', label='Dobrze:')),
    t='1.1fr 1fr'))

slide('Wczytaj i wypisz — cały program', cols(
    code('''
        #include <iostream>
        using namespace std;

        int main()
        {
            int tablica[100]; // 100 >= n
            int n;
            cin >> n;
            for(int i = 0; i < n; i++){
                cin >> tablica[i];
            }
            for(int i = 0; i < n; i++){
                cout << tablica[i] << ' ';
            }
            cout << endl;
        }''', size='sm'),
    stack(term('7\n1 2 3 -5 8 -1 2', 'in'),
          term('1 2 3 -5 8 -1 2'),
          note(f'W pętli wypisującej też jest {c("i < n")} — wypisujemy tylko te n liczb, które wczytaliśmy, '
               'a nie śmieci z zapasu.')),
    t='1.15fr 1fr'))

slide('Ten sam program — różne wejścia', stack(
    P('Nie zmieniamy <b>ani jednej linijki</b> kodu z poprzedniego slajdu — program sam dopasowuje się do n:'),
    cols(stack(term('3\n10 -4 6', 'in', cap='wejście'), term('10 -4 6')),
         stack(term('1\n-13', 'in', cap='wejście'), term('-13')),
         stack(term('10\n1 2 3 4 4 5 8 7 9 1', 'in', cap='wejście'), term('1 2 3 4 4 5 8 7 9 1')),
         t='1fr 1fr 1.5fr', gap=24),
    note('Działa dla każdego n od 1 do 100 — bo tyle mamy miejsca w tablicy.')))

slide('Wariant z notatek: najpierw n, potem tablica', cols(
    code('''
        int n;
        cin >> n;
        int tablica[1000];
        for(int i = 0; i < n; i++){
            cin >> tablica[i];
        }''', size='lg'),
    stack(P('Kolejność nie ma znaczenia — można najpierw wczytać n, a dopiero potem stworzyć tablicę. '
            'Ważne, żeby tablica była <b>co najmniej tak duża jak największe możliwe n</b>.'),
          P('Tu zapas to <b>1000</b> — wystarczy, gdy w zadaniu n ≤ 1000.'),
          warn(f'kusi, żeby napisać {c("int tablica[n];")}. Nie rób tak! W standardowym C++ rozmiar tablicy to '
               '<b>stała liczba</b> (np. 100, 1000) ustalona z góry — jak w najważniejszej zasadzie z rozdziału 02.',
               label='Pułapka:')),
    t='1fr 1.2fr'))

# ================================================================ 11
sec('11')


def quiz(n, title, body, answer_title, answer):
    slide(f'Pytanie {n}: {title}', body,
          P('Zastanów się i zapisz odpowiedź, <b>zanim</b> przejdziesz dalej.', 'muted cen'))
    slide(f'Odpowiedź {n}: {answer_title}', answer)


quiz(1, 'co wypisze program?', cols(
    code('''
        int t[] = {4, 8, 15, 16, 23, 42};
        cout << t[2] << ' ' << t[5] << endl;''', size='lg'),
    term('?'), t='1.6fr 1fr', align='center'),
    '`15 42`', stack(
        center(arr([4, 8, 15, 16, 23, 42], name='t', size='lg', hi=(2, 5))),
        cols(steps(['Lista ma 6 liczb → rozmiar 6, indeksy <b>0…5</b>.',
                    f'{c("t[2]")} — trzecia szufladka → <b>15</b>.',
                    f'{c("t[5]")} — szósta, ostatnia (n-1 = 5) → <b>42</b>.']),
             term('15 42'), t='1.6fr 1fr')))

quiz(2, 'globalna czy lokalna?', cols(
    code('''
        int a[3];

        int main(){
            int b[3];
            cout << a[1] << endl;
            cout << b[1] << endl;
        }''', size='lg'),
    stack(P('Co wypisze pierwsza linijka z cout? A co druga?'), term('?\n?')), t='1.4fr 1fr'),
    'zero i śmieć', cols(
        stack(card('a — globalna (poza main)', arr([0, 0, 0], size='sm', hi=(1,)) +
                   '<div class="cap-t">a[1] = 0 — zawsze</div>', 'tlc'),
              card('b — lokalna (w main)', arr([(-5, 'g'), (251, 'g'), (15, 'g')], size='sm', sel=(1,)) +
                   '<div class="cap-o">b[1] = śmieć — nie wiadomo, ile</div>', 'orc')),
        stack(term('0\n251', cap='na ekranie (druga liczba — przypadkowa)'),
              warn('druga liczba może być <b>dowolna</b> i zmieniać się przy każdym uruchomieniu.')),
        t='1.1fr 1fr'))

quiz(3, 'co wypisze program?', cols(
    code('''
        int t[5];
        for(int i = 0; i < 5; i++){
            t[i] = i * 2;
        }
        for(int i = 0; i < 5; i++){
            cout << t[i] << ' ';
        }''', size='lg'),
    term('?'), t='1.5fr 1fr', align='center'),
    '`0 2 4 6 8`', cols(
        table(['i', 'i * 2', 'wpisujemy'], [[str(k), f'{k} * 2 = {2 * k}', c(f't[{k}] = {2 * k}')] for k in range(5)],
              cls='mid'),
        stack(center(arr([0, 2, 4, 6, 8], name='t', size='sm')),
              term('0 2 4 6 8'),
              note('Pierwsza pętla <b>ustawia</b>, druga <b>wypisuje</b>.')),
        t='1fr 1fr'))

quiz(4, 'wczytywanie i indeks `n-1`', cols(
    code('''
        int tablica[100];
        int n;
        cin >> n;
        for(int i = 0; i < n; i++){
            cin >> tablica[i];
        }
        cout << tablica[0] + tablica[n-1] << endl;''', size='sm'),
    stack(term('4\n10 20 30 40', 'in'), term('?')), t='1.5fr 1fr'),
    '`50`', stack(
        center(arr([10, 20, 30, 40, Q, Q, ('…', 'dots')], name='tablica', hi=(0, 3),
                   idxs=['0', '1', '2', '3', '4', '5', '…'],
                   spans=[(0, 4, 'n = 4', 'tl'), (4, 3, 'zapas', 'gr')])),
        cols(steps(['n = 4, wczytane liczby leżą pod indeksami <b>0…3</b>.',
                    f'{c("tablica[0]")} = <b>10</b> — pierwsza liczba.',
                    f'n-1 = 4-1 = 3, więc {c("tablica[n-1]")} = {c("tablica[3]")} = <b>40</b> — ostatnia.',
                    '10 + 40 = <b>50</b>.'], cls='tight'),
             term('50'), t='1.7fr 1fr')))

quiz(5, 'znajdź dwa błędy', cols(
    code('''
        int t[5] = {1, 2, 3, 4, 5};
        for(int i = 1; i <= 5; i++){
            cout << t[i] << ' ';
        }''', size='lg'),
    stack(P('Program miał wypisać:'), term('1 2 3 4 5', cap='oczekiwany wynik'),
          P('Co jest nie tak?')), t='1.5fr 1fr'),
    'start od `0` i warunek `<`', stack(
        cols(stack(code('''
                for(int i = ⟦1⟧; i ⟦<=⟧ 5; i++){
                    cout << t[i] << ' ';
                }''', cap='źle', bad=True), term('2 3 4 5 32764')),
             stack(code('''
                for(int i = 0; i < 5; i++){
                    cout << t[i] << ' ';
                }''', cap='dobrze', good=True), term('1 2 3 4 5'))),
        traps([f'<b>Start od i = 1</b> — pomija {c("t[0]")}, czyli pierwszą liczbę (1).',
               f'<b>Warunek i &lt;= 5</b> — czyta {c("t[5]")}, którego nie ma (zakres to 0…4) → śmieć.'])))

# ================================================================ 12
sec('12')
slide('Najczęstsze błędy (1/2)', traps([
    f'<b>Liczenie od 1.</b> {c("tablica[1]")} to <b>drugi</b> element. Pierwszy to {c("tablica[0]")}.',
    f'<b>Indeks n.</b> W tablicy {c("int t[10]")} nie ma {c("t[10]")} — ostatni to {c("t[9]")}. '
    f'W pętli piszemy {c("i < n")}, a nie {c("i <= n")}.',
    f'<b>{c("cout << tablica;")}</b> wypisuje adres w pamięci, a nie liczby. Wypisuj pętlą — element po elemencie.',
    '<b>Czytanie śmieci.</b> Lokalna tablica bez listy ma losowe wartości. Najpierw ją ustaw (pętla) '
    'albo wczytaj, dopiero potem z niej czytaj.',
]))

slide('Najczęstsze błędy (2/2)', traps([
    f'<b>{c("int tablica[];")} bez listy.</b> Puste nawiasy działają tylko z listą inicjalizacyjną — '
    'inaczej C++ nie zna rozmiaru.',
    f'<b>Za mała tablica.</b> Jeśli n może być 1000, a tablica ma 100 miejsc — program pisze poza tablicą. '
    'Zapas: rozmiar ≥ największe n.',
    f'<b>Pętla do rozmiaru zamiast do n.</b> Przy wczytywaniu {c("i < n")}, a nie {c("i < 100")} — '
    'inaczej program czeka na liczby, których nie ma.',
    f'<b>Za dużo liczb w klamrach.</b> {c("int t[3] = {1, 2, 3, 4};")} — 4 liczby nie zmieszczą się '
    'w 3 szufladkach → błąd kompilacji.',
]))

# ================================================================ 13
sec('13')
slide('Ściąga: tworzenie i indeksy', cards(
    card('Tworzenie z rozmiarem', c('int t[5] = {-2, 3, 5, 7, 9};')),
    card('Rozmiar policzy C++', c('int t[] = {2, 5, 7};') + ' → 3 szufladki'),
    card('Globalna bez listy (poza main)', c('int t[5];') + ' → same zera'),
    card('Lokalna bez listy (w main)', c('int t[5];') + ' → losowe śmieci'),
    card('Rozmiar', 'ustalamy na początku — <b>nie da się go zmienić</b>'),
    card('Indeksy', 'od <b>0</b> do <b>n-1</b>'),
    card('Odczyt jednego elementu', c('cout << t[2] << endl;')),
    card('Zmiana jednego elementu', c('t[2] = 100;')),
    card('Indeks w zmiennej', c('t[i]') + ' — bierze aktualne i'),
    card('Cała tablica jednym cout?', '<b>NIE</b> — tylko pętlą'), n=2))

slide('Ściąga: trzy pętle po tablicy', cols(
    code('''
        for(int i = 0; i < n; i++){
            cout << t[i] << ' ';
        }
        cout << endl;''', cap='wypisz całą tablicę', size='sm'),
    code('''
        for(int i = 0; i < n; i++){
            t[i] = 2;
        }''', cap='ustaw wartość w każdej szufladce', size='sm'),
    code('''
        int t[100]; // 100 >= n
        int n;
        cin >> n;
        for(int i = 0; i < n; i++){
            cin >> t[i];
        }''', cap='wczytaj n liczb', size='sm'), gap=20),
    good(f'Wszystkie trzy wyglądają tak samo: {c("for(int i = 0; i < n; i++)")}. '
         'Zmienia się tylko to, co robimy w środku z <b>t[i]</b>.', label='Wspólny wzór:'))

slide('Zadania na koniec — Twoja kolej', steps([
    f'Stwórz tablicę {c("{5, 10, 15, 20}")} i wypisz jej <b>trzeci</b> element. (Uwaga na indeks!)',
    'Stwórz lokalną tablicę na 8 liczb, wpisz pętlą do każdej szufladki <b>7</b> i wypisz całą tablicę w jednej linii.',
    'Wczytaj n (n ≤ 100), a potem n liczb. Wypisz je w jednej linii, oddzielone spacjami.',
    'Wczytaj n i n liczb. Wypisz <b>pierwszą</b> i <b>ostatnią</b> z nich. Podpowiedź: indeksy 0 i n-1.',
    f'Wypełnij tablicę 10-elementową tak, żeby było w niej {c("{0, 3, 6, 9, …, 27}")}, i ją wypisz. '
    f'Podpowiedź: {c("tablica[i] = i * …")}',
], cls='big'))


build(
    secs=SECS,
    html='pdf-src/prezentacja-tablice-cpp.html',
    pdf='prezentacja-tablice-cpp-t-olimpians.pdf',
    generator='pdf-src/build-prezentacja-tablice.py',
    title='Tablice w C++ — krok po kroku — T-Olimpians',
    brand='tablice w C++',
    foot='Tablice w C++ — krok po kroku',
    cover=dict(
        kicker='// T-OLIMPIANS — PREZENTACJA DO LEKCJI',
        h1='Tablice w C++<br>— krok po kroku',
        sub='''Wszystko o zwykłych tablicach, powoli i po kolei: jak stworzyć tablicę, co w niej siedzi
      na starcie, jak numerujemy jej elementy, jak ją wypisać, wypełnić i wczytać. Każdy krok na osobnym
      slajdzie — z przykładem kodu i tym, co pojawi się na ekranie.''',
        meta='C++ · LEKCJA 7 · TABLICE · OD ZERA',
        deco=arr(T5, name='tablica', size='sm')),
    end=dict(
        kicker='// KONIEC LEKCJI 7',
        h1='Umiesz już<br>korzystać z tablic!',
        sub='''Tworzenie, lista inicjalizacyjna, tablice globalne i lokalne, indeksy od 0 do n-1,
      wypisywanie, ustawianie i wczytywanie — wszystko krok po kroku. Teraz zrób zadania z poprzedniego slajdu.''',
        deco=arr([2] * 7, name='tablica', size='sm', hi=tuple(range(7)))),
)
