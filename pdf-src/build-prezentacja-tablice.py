#!/usr/bin/env python3
"""Prezentacja „Tablice w C++ — krok po kroku” (T-Olimpians, lekcja 7).

Generuje pdf-src/prezentacja-tablice-cpp.html — poziome slajdy 16:9 w stylu
ściągi Python Turtle — i (z flagą --pdf) drukuje je do
prezentacja-tablice-cpp-t-olimpians.pdf przez Playwright (Chromium).

    python3 pdf-src/build-prezentacja-tablice.py --pdf
"""
import html
import re
import subprocess
import sys
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_HTML = ROOT / 'pdf-src' / 'prezentacja-tablice-cpp.html'
OUT_PDF = ROOT / 'prezentacja-tablice-cpp-t-olimpians.pdf'


def esc(s):
    return html.escape(str(s), quote=False)


# ---------------------------------------------------------------- kolorowanie C++

KW = {'int', 'for', 'return', 'using', 'namespace', 'if', 'else', 'while',
      'char', 'bool', 'void', 'long', 'double', 'const'}
BI = {'cout', 'cin', 'endl', 'main', 'std'}
TOK = re.compile(r"""(?P<c>//.*)|(?P<inc>\#include)|(?P<hdr><\w+>)|(?P<s>"[^"]*"|'[^']*')"""
                 r"""|(?P<n>(?<![\w)\]])-?\d+)|(?P<id>[A-Za-z_]\w*)|(?P<sp>\s+)|(?P<p>.)""")


def tok(s):
    out = []
    for m in TOK.finditer(s):
        kind, t = m.lastgroup, esc(m.group())
        if kind == 'sp':
            out.append(t)
            continue
        if kind == 'id':
            kind = 'k' if m.group() in KW else 'f' if m.group() in BI else 'v'
        elif kind == 'inc':
            kind = 'k'
        elif kind == 'hdr':
            kind = 'f'
        out.append(f'<span class="{kind}">{t}</span>')
    return ''.join(out)


def hl_line(line):
    """Koloruje jedną linijkę; fragment w ⟦…⟧ dostaje pomarańczową ramkę."""
    res = ''
    for part in re.split(r'(⟦.*?⟧)', line):
        if part.startswith('⟦'):
            res += f'<span class="mk">{tok(part[1:-1])}</span>'
        else:
            res += tok(part)
    return res


def code_lines(src, hl=(), dim=False):
    src = textwrap.dedent(src).strip('\n')
    out = []
    for k, line in enumerate(src.split('\n'), 1):
        cls = 'ln'
        if k in hl:
            cls += ' hl'
        elif dim and hl:
            cls += ' dim'
        out.append(f'<span class="{cls}">{hl_line(line) or " "}</span>')
    return ''.join(out)


def code(src, cap=None, hl=(), dim=False, size='', bad=False, good=False):
    cls = 'code ' + size + (' bad' if bad else '') + (' okc' if good else '')
    pre = f'<pre class="{cls}">{code_lines(src, hl, dim)}</pre>'
    capc = 'code-cap' + (' bad' if bad else '') + (' okc' if good else '')
    cap = f'<div class="{capc}">{cap}</div>' if cap else ''
    return f'<div class="code-wrap">{cap}{pre}</div>'


def bare(src):
    return f'<pre class="code bare">{code_lines(src)}</pre>'


def c(s):
    """Krótki kod w tekście."""
    return f'<code class="ic">{esc(s)}</code>'


# ---------------------------------------------------------------- klocki slajdów

def P(s, cls=''):
    return f'<p class="{cls}">{s}</p>'


def stack(*items, gap=16, cls=''):
    return f'<div class="stack {cls}" style="--sg:{gap}px">{"".join(items)}</div>'


def cols(*items, t=None, gap=34, align='start'):
    t = t or ' '.join(['1fr'] * len(items))
    return (f'<div class="cols" style="grid-template-columns:{t};gap:{gap}px;align-items:{align}">'
            + ''.join(f'<div class="col">{i}</div>' for i in items) + '</div>')


def center(*items):
    return f'<div class="center">{"".join(items)}</div>'


def box(kind, s, label=None):
    lab = f'<span class="{kind}-label">{label}</span> ' if label else ''
    return f'<div class="{kind}">{lab}{s}</div>'


def note(s, label=None):
    return box('note', s, label)


def warn(s, label='Uwaga:'):
    return box('warn', s, label)


def good(s, label=None):
    return box('good', s, label)


def big(s):
    return f'<div class="big">{s}</div>'


def steps(items, cls=''):
    return f'<ol class="steps {cls}">' + ''.join(f'<li>{i}</li>' for i in items) + '</ol>'


def traps(items):
    return '<ol class="traps">' + ''.join(f'<li>{i}</li>' for i in items) + '</ol>'


def table(head, rows, widths=None, cls=''):
    cg = ''
    if widths:
        cg = '<colgroup>' + ''.join(f'<col style="width:{w}">' for w in widths) + '</colgroup>'
    th = ''.join(f'<th>{h}</th>' for h in head)
    tb = ''.join('<tr>' + ''.join(f'<td>{x}</td>' for x in r) + '</tr>' for r in rows)
    return f'<table class="tbl {cls}">{cg}<thead><tr>{th}</tr></thead><tbody>{tb}</tbody></table>'


def card(title, desc, cls=''):
    return f'<div class="card {cls}"><div class="card-t">{title}</div><div class="card-d">{desc}</div></div>'


def cards(*items, n=2):
    return f'<div class="cards" style="grid-template-columns:repeat({n},1fr)">{"".join(items)}</div>'


def kv(rows):
    return '<div class="kv">' + ''.join(
        f'<div class="kv-k">{k}</div><div class="kv-v">{v}</div>' for k, v in rows) + '</div>'


def term(text, kind='out', cap=None, raw=False, cursor=False, size=''):
    if cap is None:
        cap = 'na ekranie' if kind == 'out' else 'wejście (wpisujemy z klawiatury)'
    body = text if raw else esc(text)
    if cursor:
        body += '<span class="cur"> </span>'
    return (f'<div class="term {kind} {size}"><div class="term-cap">{cap}</div>'
            f'<pre>{body}</pre></div>')


def inp_tokens(lines, used=0, cur=None, cap=None):
    """Wejście z zaznaczeniem: ile liczb już wczytano (szare) i która jest czytana teraz."""
    k = 0
    out = []
    for line in lines:
        parts = []
        for t in line:
            cls = 'used' if k < used else 'now' if k == cur else ''
            parts.append(f'<span class="{cls}">{esc(t)}</span>')
            k += 1
        out.append(' '.join(parts))
    return term('\n'.join(out), 'in', cap=cap, raw=True)


SIZES = {'lg': (76, 29, 8), '': (60, 23, 6), 'sm': (48, 19, 5), 'xs': (38, 15, 4)}


def arr(vals, name=None, hi=(), sel=(), size='', ptr=None, ptrname='', spans=None,
        idx=True, idxs=None, namew=None, cap=None):
    """Tablica jako rząd szufladek z indeksami.

    Element vals to wartość albo (wartość, rodzaj): g = śmieć, x = nieużywany zapas,
    ghost = szufladka, której nie ma, dots = „…”, empty = pusta.
    """
    cw, cf, gap = SIZES[size]
    lw = namew if namew is not None else max(len(name or ''), len(ptrname), 6 if idx else 0)
    if not name and not ptrname and namew is None:
        lw = 0

    def lab(t='', cls=''):
        return f'<div class="al {cls}" style="width:{lw + 1}ch">{t}</div>' if lw else ''

    cells, ids, pts = [], [], []
    for k, v in enumerate(vals):
        kind = ''
        if isinstance(v, tuple):
            v, kind = v
        cl = 'cell ' + kind + (' hi' if k in hi else '') + (' sel' if k in sel else '')
        cells.append(f'<div class="{cl}">{esc(v)}</div>')
        il = idxs[k] if idxs else ('…' if kind == 'dots' else str(k))
        ids.append(f'<div class="idx{" hi" if k in hi else ""}{" gh" if kind == "ghost" else ""}">{esc(il)}</div>')
        if ptr is not None:
            t = ptr.get(k, '')
            pts.append(f'<div class="pt"><b>{t}</b><span>↓</span></div>' if t else '<div class="pt"></div>')
    rows = []
    if ptr is not None:
        rows.append(f'<div class="arow">{lab(ptrname, "sm")}{"".join(pts)}</div>')
    rows.append(f'<div class="arow">{lab(esc(name or ""))}{"".join(cells)}</div>')
    if idx:
        rows.append(f'<div class="arow">{lab("indeks", "sm")}{"".join(ids)}</div>')
    if spans:
        segs, pos = [], 0
        for s, n, t, cl in spans:
            if s > pos:
                segs.append(f'<div style="width:calc(var(--cw)*{s - pos} + var(--gap)*{s - pos - 1})"></div>')
            segs.append(f'<div class="span {cl}" style="width:calc(var(--cw)*{n} + var(--gap)*{n - 1})">'
                        f'<div class="br"></div><div class="sl">{t}</div></div>')
            pos = s + n
        rows.append(f'<div class="arow">{lab()}{"".join(segs)}</div>')
    capd = f'<div class="arr-cap">{cap}</div>' if cap else ''
    return (f'<div class="arr" style="--cw:{cw}px;--cf:{cf}px;--gap:{gap}px">{capd}'
            + ''.join(rows) + '</div>')


def anat(parts, legend):
    """Linijka kodu rozłożona na kolorowe, ponumerowane części + legenda."""
    line = ''
    for text, col, num in parts:
        if col:
            line += (f'<span class="ap" style="--ac:var(--{col})">{tok(text)}'
                     f'<span class="ab">{num}</span></span>')
        else:
            line += tok(text)
    leg = ''.join(f'<div class="lgd" style="--ac:var(--{col})"><span class="lb">{num}</span>'
                  f'<span class="lc">{c(t)}</span><span class="ld">{d}</span></div>'
                  for num, col, t, d in legend)
    return f'<div class="anat"><div class="aline">{line}</div><div class="legend">{leg}</div></div>'


# ---------------------------------------------------------------- slajdy

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
SEC_NAME = dict(SECS)
SLIDES = []
CUR = ['01']


def sec(n):
    CUR[0] = n


def slide(title, *body):
    SLIDES.append((CUR[0], title, ''.join(body)))


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

# ---------------------------------------------------------------- HTML

CSS = r"""
@page { size: 1280px 720px; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
:root {
  --bg: #0a0a0f; --panel: #11111a; --panel2: #16161f; --chip: #1d1d2a; --line: #2a2a38;
  --tx: #e8e8f0; --mu: #8888a0; --tl: #00e5c7; --pu: #7c5cff; --or: #ffb454; --yl: #ffcf87; --gr: #a8a8c0;
}
html, body {
  background: var(--bg); color: var(--tx); font-family: 'DM Sans', sans-serif;
  -webkit-print-color-adjust: exact; print-color-adjust: exact;
}
html, body, code, pre, span, div, td, th, li {
  font-variant-ligatures: none; font-feature-settings: "liga" 0, "calt" 0, "dlig" 0;
}
.mono, code, pre { font-family: 'JetBrains Mono', monospace; }

/* ---------- slajd ---------- */
.slide {
  width: 1280px; height: 720px; position: relative; overflow: hidden;
  page-break-after: always; break-after: page; padding: 30px 64px 0;
  background:
    radial-gradient(640px 400px at 0% 0%, rgba(124,92,255,.10), transparent 70%),
    radial-gradient(640px 440px at 100% 100%, rgba(0,229,199,.06), transparent 70%),
    var(--bg);
}
.slide:last-child { page-break-after: auto; break-after: auto; }
.bar { position: absolute; top: 0; left: 0; right: 0; height: 4px; display: flex; gap: 3px; }
.bar i { flex: 1; background: #1a1a26; }
.bar i.done { background: rgba(124,92,255,.55); }
.bar i.on { background: var(--tl); }
.top {
  display: flex; justify-content: space-between; align-items: center;
  font-family: 'JetBrains Mono', monospace; font-size: 13px; letter-spacing: .18em;
  text-transform: uppercase; color: var(--mu);
}
.top b { color: var(--tl); font-weight: 700; }
.top .brand b { color: var(--pu); }
.head {
  display: flex; align-items: baseline; gap: 14px;
  border-left: 5px solid var(--pu); padding-left: 18px; margin: 14px 0 20px;
}
.head .num { font-family: 'JetBrains Mono', monospace; font-size: 20px; font-weight: 700; color: var(--tl); }
.head h2 { font-size: 34px; font-weight: 700; color: #fff; letter-spacing: -.01em; line-height: 1.15; }
.head h2 .tm { font-family: 'JetBrains Mono', monospace; font-size: .88em; color: var(--tl); letter-spacing: 0; }
.kv-v > b { font-family: 'JetBrains Mono', monospace; }
.foot {
  position: absolute; left: 64px; right: 64px; bottom: 16px; display: flex; justify-content: space-between;
  font-family: 'JetBrains Mono', monospace; font-size: 12px; color: #5c5c74; letter-spacing: .04em;
}
.slide:not(.cover) { display: flex; flex-direction: column; }
.content { flex: 1 1 auto; min-height: 0; display: flex; flex-direction: column; justify-content: safe center; padding-bottom: 50px; }
.content > * + * { margin-top: 16px; }

/* ---------- tekst ---------- */
p { font-size: 21px; line-height: 1.5; color: var(--tx); }
p b, li b, td b, .card-d b, .kv-v b { color: #fff; font-weight: 700; }
p.muted { color: var(--mu); font-size: 18px; }
p.cen { text-align: center; }
.big { font-size: 34px; font-weight: 700; line-height: 1.3; color: #fff; letter-spacing: -.01em; }
.big em { font-style: normal; color: var(--tl); }
.big strong { color: var(--or); }
code.ic {
  font-family: 'JetBrains Mono', monospace; font-size: .86em; background: var(--chip); color: var(--tl);
  padding: 1px 6px; border-radius: 4px; white-space: nowrap;
}
b.yes { color: var(--tl) !important; }
b.no { color: var(--or) !important; }
sub { font-size: .7em; }

/* ---------- układ ---------- */
.stack > * + * { margin-top: var(--sg, 16px); }
.cols { display: grid; }
.col { min-width: 0; }
.col > .stack, .col > * { min-width: 0; }
.center { display: flex; justify-content: center; }

/* ---------- boxy ---------- */
.note, .warn, .good {
  font-size: 18.5px; line-height: 1.5; padding: 13px 18px; border-radius: 6px; color: #b4b4c8;
}
.note { background: var(--panel); border: 1px solid var(--line); border-left: 4px solid var(--tl); }
.note b, .good b { color: #fff; }
.note-label, .good-label { font-family: 'JetBrains Mono', monospace; color: var(--tl); font-weight: 700; font-size: .92em; }
.warn { background: rgba(255,180,84,.07); border: 1px solid rgba(255,180,84,.25); border-left: 4px solid var(--or); }
.warn b { color: var(--yl); }
.warn-label { font-family: 'JetBrains Mono', monospace; color: var(--or); font-weight: 700; font-size: .92em; }
.good { background: rgba(0,229,199,.06); border: 1px solid rgba(0,229,199,.22); border-left: 4px solid var(--tl); }

/* ---------- kod ---------- */
.code-cap {
  font-family: 'JetBrains Mono', monospace; font-size: 12.5px; color: var(--mu);
  letter-spacing: .14em; text-transform: uppercase; margin-bottom: 7px;
}
.code-cap.bad { color: var(--or); }
.code-cap.okc { color: var(--tl); }
pre.code {
  font-family: 'JetBrains Mono', monospace; font-size: 19px; line-height: 1.6;
  background: var(--panel); border: 1px solid var(--line); border-radius: 8px;
  padding: 14px 0; white-space: pre; overflow: hidden; color: var(--tx);
}
pre.code.lg { font-size: 25px; padding: 16px 0; }
pre.code.sm { font-size: 17px; }
pre.code.xs { font-size: 15px; }
pre.code.bad { border-color: rgba(255,180,84,.45); }
pre.code.okc { border-color: rgba(0,229,199,.4); }
pre.code .ln { display: block; padding: 0 22px; }
pre.code .ln.hl { background: rgba(0,229,199,.09); box-shadow: inset 4px 0 0 var(--tl); }
pre.code .ln.dim { opacity: .38; }
pre.code.bare { background: none; border: none; padding: 2px 0; font-size: 17px; }
pre.code.bare .ln { padding: 0 14px; }
.k { color: #7c5cff; } .f { color: #00e5c7; } .n { color: #ffb454; } .s { color: #ffcf87; }
.c { color: #8888a0; } .p { color: #a8a8c0; } .v { color: #e8e8f0; }
.mk { outline: 2px dashed var(--or); outline-offset: 2px; border-radius: 3px; background: rgba(255,180,84,.13); }

.syntax {
  font-family: 'JetBrains Mono', monospace; font-size: 54px; font-weight: 700; color: #fff;
  background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 14px 40px;
}
.syntax span { color: var(--or); }

/* ---------- terminal ---------- */
.term { border: 1px solid var(--line); border-radius: 8px; overflow: hidden; background: #07070b; }
.term-cap {
  font-family: 'JetBrains Mono', monospace; font-size: 12px; letter-spacing: .14em; text-transform: uppercase;
  padding: 7px 14px; background: var(--panel2); border-bottom: 1px solid var(--line); color: var(--tl);
}
.term.in .term-cap { color: var(--or); }
.term pre { font-size: 21px; line-height: 1.5; padding: 10px 16px; color: #fff; white-space: pre; overflow: hidden; }
.term .cur { background: var(--tl); opacity: .75; }
.term .used { color: #4a4a60; }
.term .now { background: rgba(0,229,199,.2); color: var(--tl); outline: 2px solid var(--tl); border-radius: 3px; }

/* ---------- tablica ---------- */
.arr { display: inline-flex; flex-direction: column; gap: 6px; }
.arow { display: flex; align-items: center; gap: var(--gap); }
.al {
  font-family: 'JetBrains Mono', monospace; font-size: 17px; color: var(--tx); text-align: right;
  padding-right: 4px; flex: none; white-space: nowrap;
}
.al.sm { color: var(--mu); font-size: 17px; }
.cell {
  width: var(--cw); height: var(--cw); flex: none; border: 2px solid var(--line); background: var(--panel);
  border-radius: 6px; display: flex; align-items: center; justify-content: center;
  font-family: 'JetBrains Mono', monospace; font-size: var(--cf); font-weight: 700; color: var(--tx);
  white-space: nowrap;
}
.cell.hi { border-color: var(--tl); background: rgba(0,229,199,.13); color: var(--tl); }
.cell.sel { outline: 2.5px dashed var(--or); outline-offset: 4px; }
.cell.g { color: var(--or); background: rgba(255,180,84,.07); border-color: rgba(255,180,84,.38); border-style: dashed; }
.cell.q { color: var(--mu); border-style: dashed; }
.cell.x { color: #4a4a5c; background: repeating-linear-gradient(135deg, #0e0e15 0 6px, #15151f 6px 12px); }
.cell.dots { border-color: transparent; background: none; color: var(--mu); }
.cell.ghost { border: 2px dashed var(--or); background: transparent; color: var(--or); }
.cell.empty { color: transparent; }
.idx {
  width: var(--cw); flex: none; text-align: center; font-family: 'JetBrains Mono', monospace;
  font-size: calc(var(--cf) * .66); color: var(--mu);
}
.idx.hi { color: var(--tl); font-weight: 700; }
.idx.gh { color: var(--or); }
.pt {
  width: var(--cw); flex: none; display: flex; flex-direction: column; align-items: center;
  font-family: 'JetBrains Mono', monospace; font-size: calc(var(--cf) * .66); color: var(--tl);
  font-weight: 700; white-space: nowrap; line-height: 1.15;
}
.pt b { font-weight: 700; }
.pt span { font-size: 1.1em; }
.span { flex: none; display: flex; flex-direction: column; align-items: center; color: var(--tl); }
.span .br { width: 100%; height: 10px; border: 2px solid currentColor; border-top: none; border-radius: 0 0 6px 6px; }
.span .sl { font-family: 'JetBrains Mono', monospace; font-size: 14px; margin-top: 4px; white-space: nowrap; }
.span.or { color: var(--or); } .span.gr { color: var(--mu); }
.arr-cap { font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--mu); letter-spacing: .1em; }

/* ---------- budowa linijki ---------- */
.anat { background: var(--panel); border: 1px solid var(--line); border-radius: 10px; padding: 26px 30px 22px; }
.aline { font-family: 'JetBrains Mono', monospace; font-size: 31px; white-space: pre; text-align: center; padding-bottom: 30px; }
.ap { position: relative; border-bottom: 4px solid var(--ac); padding-bottom: 4px; }
.ab, .lb {
  display: inline-flex; align-items: center; justify-content: center; width: 26px; height: 26px; border-radius: 50%;
  background: var(--ac); color: #0a0a0f; font-family: 'JetBrains Mono', monospace; font-size: 15px; font-weight: 700;
}
.ab { position: absolute; left: 50%; bottom: -36px; transform: translateX(-50%); }
.legend { display: grid; grid-template-columns: 1fr; gap: 9px; border-top: 1px solid var(--line); padding-top: 16px; }
.lgd { display: grid; grid-template-columns: 34px 260px 1fr; align-items: center; font-size: 19px; color: #c8c8d8; }
.lgd .lc code.ic { color: var(--ac); font-size: 17px; }

/* ---------- listy, karty, tabele ---------- */
ol.steps { list-style: none; counter-reset: s; }
ol.steps li {
  counter-increment: s; position: relative; font-size: 19.5px; line-height: 1.45; color: var(--tx);
  padding: 10px 16px 10px 54px; background: var(--panel); border: 1px solid var(--line); border-radius: 6px;
}
ol.steps li + li { margin-top: 8px; }
ol.steps li::before {
  content: counter(s); position: absolute; left: 14px; top: 9px; width: 28px; height: 28px; border-radius: 50%;
  background: rgba(124,92,255,.18); border: 1.5px solid var(--pu); color: var(--tl);
  font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
}
ol.steps.tight li { padding-top: 7px; padding-bottom: 7px; font-size: 18px; }
ol.steps.tight li::before { top: 6px; }
ol.steps.big li { font-size: 21px; padding: 14px 18px 14px 58px; }
ol.steps.big li + li { margin-top: 12px; }
ol.steps.big li::before { top: 14px; }

ol.traps { list-style: none; counter-reset: t; }
ol.traps li {
  counter-increment: t; position: relative; background: var(--panel); border: 1px solid var(--line);
  border-left: 4px solid var(--or); border-radius: 6px; padding: 16px 20px 16px 62px;
  font-size: 20.5px; line-height: 1.5; color: #b4b4c8;
}
ol.traps li + li { margin-top: 12px; }
ol.traps li::before {
  content: counter(t, decimal-leading-zero); position: absolute; left: 18px; top: 17px;
  font-family: 'JetBrains Mono', monospace; font-size: 18px; font-weight: 700; color: var(--or);
}
ol.traps li b { color: #fff; }

.cards { display: grid; gap: 14px; }
.card { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 14px 18px; }
.card.tlc { border-top: 3px solid var(--tl); }
.card.orc { border-top: 3px solid var(--or); }
.card.puc { border-top: 3px solid var(--pu); }
.card-t { font-family: 'JetBrains Mono', monospace; font-size: 17px; font-weight: 700; color: #fff; margin-bottom: 8px; }
.card-d { font-size: 18px; line-height: 1.45; color: #b4b4c8; }
.card .arr { margin-top: 4px; }
.cap-t, .cap-o { font-family: 'JetBrains Mono', monospace; font-size: 14px; margin-top: 8px; color: var(--tl); }
.cap-o { color: var(--or); }

table.tbl { width: 100%; border-collapse: collapse; table-layout: fixed; border: 1px solid var(--line); font-size: 18px; }
table.tbl th {
  background: var(--chip); color: var(--tl); text-align: left; font-family: 'JetBrains Mono', monospace;
  font-size: 14px; font-weight: 700; padding: 10px 14px; border-bottom: 1px solid var(--line); letter-spacing: .04em;
}
table.tbl td { padding: 10px 14px; border-bottom: 1px solid var(--line); color: var(--tx); line-height: 1.4; vertical-align: middle; }
table.tbl tbody tr:nth-child(odd) td { background: var(--panel); }
table.tbl tbody tr:nth-child(even) td { background: var(--panel2); }
table.tbl.big { font-size: 20px; }
table.tbl.big td { padding: 14px 16px; }
table.tbl.mid td { padding: 8px 14px; }
table.tbl.ctr td, table.tbl.ctr th { text-align: center; }
table.tbl td code.ic { white-space: nowrap; }

.kv {
  display: grid; grid-template-columns: 120px 1fr; background: var(--panel); border: 1px solid var(--line);
  border-radius: 8px; overflow: hidden;
}
.kv-k, .kv-v { padding: 10px 16px; border-bottom: 1px solid var(--line); font-size: 19px; line-height: 1.4; }
.kv-k { font-family: 'JetBrains Mono', monospace; font-size: 16px; color: var(--mu);
        letter-spacing: .04em; background: var(--panel2); display: flex; align-items: center; }
.kv > :nth-last-child(-n+2) { border-bottom: none; }

.zones { font-size: 17px; }
.zone { border-radius: 10px; padding: 12px 10px 10px; position: relative; }
.zone.glob { border: 2px solid rgba(0,229,199,.55); background: rgba(0,229,199,.04); }
.zone.loc { border: 2px dashed var(--or); background: rgba(255,180,84,.06); margin: 6px 0 6px 38px; }
.zl { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; letter-spacing: .14em; text-transform: uppercase;
      color: var(--tl); margin: 0 0 6px 14px; }
.zone.loc .zl { color: var(--or); }

.rows { display: flex; flex-direction: column; gap: 14px; }
.rw { display: grid; grid-template-columns: 330px 1fr; align-items: center; gap: 20px;
      background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 12px 18px; }
.rw code.ic { font-size: 20px; }
.rwn { display: block; font-family: 'JetBrains Mono', monospace; font-size: 14px; color: var(--or); margin-top: 8px; }

/* ---------- okładka i koniec ---------- */
.cover {
  background:
    radial-gradient(900px 640px at 4% -14%, rgba(124,92,255,.32), transparent 62%),
    radial-gradient(820px 620px at 104% 92%, rgba(0,229,199,.22), transparent 60%),
    var(--bg);
  padding: 0;
}
.cover-l { position: absolute; left: 64px; top: 96px; width: 640px; }
.kicker { font-family: 'JetBrains Mono', monospace; font-size: 14px; font-weight: 500; color: var(--tl);
          letter-spacing: .22em; margin-bottom: 22px; }
.cover h1 { font-size: 70px; font-weight: 700; line-height: 1.05; color: var(--tl); letter-spacing: -.02em; }
.cover .sub { margin-top: 22px; font-size: 19px; line-height: 1.6; color: var(--mu); }
.cover .meta { margin-top: 20px; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--mu); letter-spacing: .08em; }
.cover .deco { margin-top: 34px; }
.cover-r {
  position: absolute; right: 64px; top: 96px; width: 420px; background: rgba(17,17,26,.72);
  border: 1px solid var(--line); border-radius: 12px; padding: 22px 26px;
}
.toc-t { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; letter-spacing: .18em; color: var(--mu);
         text-transform: uppercase; margin-bottom: 12px; }
.toc span { display: block; font-size: 17.5px; color: #c8c8d8; padding: 5.5px 0; border-bottom: 1px solid #1d1d2a; }
.toc span:last-child { border-bottom: none; }
.toc b { font-family: 'JetBrains Mono', monospace; color: var(--tl); margin-right: 12px; }
.cover-foot { position: absolute; left: 64px; bottom: 34px; font-family: 'JetBrains Mono', monospace;
              font-size: 13px; color: var(--mu); }
.cover-foot b { color: var(--pu); }
.end-c { position: absolute; left: 64px; right: 64px; top: 170px; }
.end-c h1 { font-size: 64px; }
.end-c .sub { max-width: 760px; }
"""


def fmt_title(t):
    """Tytuł slajdu: tekst w `…` pisany czcionką kodu (żeby 0 nie wyglądało jak O)."""
    parts = t.split('`')
    return ''.join(f'<span class="tm">{esc(x)}</span>' if k % 2 else esc(x) for k, x in enumerate(parts))


def render():
    total = len(SLIDES) + 2
    sec_order = [n for n, _ in SECS]
    out = []
    toc = ''.join(f'<span><b>{n}</b>{esc(t)}</span>' for n, t in SECS)
    out.append(f'''<section class="slide cover">
  <div class="cover-l">
    <div class="kicker">// T-OLIMPIANS — PREZENTACJA DO LEKCJI</div>
    <h1>Tablice w C++<br>— krok po kroku</h1>
    <div class="sub">Wszystko o zwykłych tablicach, powoli i po kolei: jak stworzyć tablicę, co w niej siedzi
      na starcie, jak numerujemy jej elementy, jak ją wypisać, wypełnić i wczytać. Każdy krok na osobnym
      slajdzie — z przykładem kodu i tym, co pojawi się na ekranie.</div>
    <div class="meta">C++ · LEKCJA 7 · TABLICE · OD ZERA</div>
    <div class="deco">{arr(T5, name='tablica', size='sm')}</div>
  </div>
  <div class="cover-r"><div class="toc-t">Plan prezentacji</div><div class="toc">{toc}</div></div>
  <div class="cover-foot"><b>T-Olimpians</b> Team Poland · t-olimpians.com</div>
</section>''')
    for k, (s, title, body) in enumerate(SLIDES, 2):
        pos = sec_order.index(s)
        bar = ''.join(f'<i class="{"on" if j == pos else "done" if j < pos else ""}"></i>'
                      for j in range(len(SECS)))
        out.append(f'''<section class="slide">
  <div class="bar">{bar}</div>
  <div class="top"><span><b>{s}</b> · {esc(SEC_NAME[s])}</span><span class="brand"><b>T-Olimpians</b> · tablice w C++</span></div>
  <div class="head"><span class="num">{s}</span><h2>{fmt_title(title)}</h2></div>
  <div class="content">{body}</div>
  <div class="foot"><span>t-olimpians.com — Tablice w C++ — krok po kroku</span><span>{k} / {total}</span></div>
</section>''')
    out.append(f'''<section class="slide cover">
  <div class="end-c">
    <div class="kicker">// KONIEC LEKCJI 7</div>
    <h1>Umiesz już<br>korzystać z tablic!</h1>
    <div class="sub">Tworzenie, lista inicjalizacyjna, tablice globalne i lokalne, indeksy od 0 do n-1,
      wypisywanie, ustawianie i wczytywanie — wszystko krok po kroku. Teraz zrób zadania z poprzedniego slajdu.</div>
    <div class="deco" style="margin-top:34px">{arr([2] * 7, name='tablica', size='sm', hi=tuple(range(7)))}</div>
  </div>
  <div class="cover-foot"><b>T-Olimpians</b> Team Poland · t-olimpians.com</div>
</section>''')
    return f'''<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>Tablice w C++ — krok po kroku — T-Olimpians</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<!-- plik wygenerowany przez pdf-src/build-prezentacja-tablice.py — edytuj generator, nie ten plik -->
<style>{CSS}</style>
</head>
<body>
{chr(10).join(out)}
</body>
</html>
'''


RENDER_JS = r"""
const { chromium } = require('playwright');
const [src, dst] = process.argv.slice(1);
(async () => {
  const proxy = process.env.HTTPS_PROXY ? { server: process.env.HTTPS_PROXY } : undefined;
  const browser = await chromium.launch({ proxy });
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.goto('file://' + src, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const problems = await page.evaluate(() => {
    const out = [];
    document.querySelectorAll('.slide').forEach((s, i) => {
      const box = s.getBoundingClientRect();
      const foot = s.querySelector('.foot');
      const limit = foot ? foot.getBoundingClientRect().top - 6 : box.bottom;
      const content = s.querySelector('.content');
      const ctop = content ? content.getBoundingClientRect().top : box.top;
      s.querySelectorAll('.content *, .cover-l *, .cover-r *, .end-c *').forEach(el => {
        const r = el.getBoundingClientRect();
        if (r.height && r.top < ctop - 0.5) out.push(`slajd ${i + 1}: wchodzi na tytuł ${el.className || el.tagName}`);
        if (r.height && r.bottom > limit + 0.5) out.push(`slajd ${i + 1}: za nisko (${Math.round(r.bottom - limit)}px) ${el.className || el.tagName}`);
        if (r.width && r.right > box.right - 40) out.push(`slajd ${i + 1}: za szeroko ${el.className || el.tagName}`);
        if ((el.tagName === 'PRE') && el.scrollWidth > el.clientWidth + 1) out.push(`slajd ${i + 1}: kod nie mieści się w ramce`);
      });
    });
    return [...new Set(out)];
  });
  problems.forEach(p => console.log('UWAGA', p));
  await page.pdf({ path: dst, preferCSSPageSize: true, printBackground: true });
  await browser.close();
})();
"""


def main():
    OUT_HTML.write_text(render(), encoding='utf-8')
    print(f'{OUT_HTML.relative_to(ROOT)}: {len(SLIDES) + 2} slajdów')
    if '--pdf' in sys.argv:
        subprocess.run(['node', '-e', RENDER_JS, str(OUT_HTML), str(OUT_PDF)], check=True)
        print(f'{OUT_PDF.relative_to(ROOT)} gotowy')


if __name__ == '__main__':
    main()
