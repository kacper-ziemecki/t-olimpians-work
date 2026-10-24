"""Wspólne klocki prezentacji T-Olimpians (poziome slajdy 16:9 w stylu ściągi Python Turtle).

Skrypt prezentacji importuje wszystko stąd, układa slajdy przez sec()/slide()
i na końcu woła build(...). Z flagą --pdf powstaje też PDF (Playwright/Chromium).
"""
import html
import re
import subprocess
import sys
import textwrap
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def esc(s):
    return html.escape(str(s), quote=False)


# ---------------------------------------------------------------- kolorowanie C++

KW = {'int', 'for', 'return', 'using', 'namespace', 'if', 'else', 'while',
      'char', 'bool', 'void', 'long', 'double', 'const'}
BI = {'cout', 'cin', 'endl', 'main', 'std', 'pair', 'make_pair', 'string'}
TOK = re.compile(r"""(?P<c>//.*)|(?P<inc>\#include)|(?P<hdr><\w+>)|(?P<s>"[^"]*"|'[^']*')"""
                 r"""|(?P<n>(?<![\w)\]])-?\d+)|(?P<id>[A-Za-z_]\w*)|(?P<sp>\s+)|(?P<p>.)""")


def tok(s):
    out = []
    prev = ''
    for m in TOK.finditer(s):
        kind, t = m.lastgroup, esc(m.group())
        if kind == 'sp':
            out.append(t)
            continue
        if kind == 'id':
            kind = 'm' if prev == '.' else 'k' if m.group() in KW else 'f' if m.group() in BI else 'v'
        elif kind == 'inc':
            kind = 'k'
        elif kind == 'hdr':
            kind = 'f'
        out.append(f'<span class="{kind}">{t}</span>')
        prev = m.group()
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
            now = k in cur if isinstance(cur, (tuple, list, set, range)) else k == cur
            cls = 'used' if k < used else 'now' if now else ''
            parts.append(f'<span class="{cls}">{esc(t)}</span>')
            k += 1
        out.append(' '.join(parts))
    return term('\n'.join(out), 'in', cap=cap, raw=True)


SIZES = {'wide': (104, 29, 8), 'lg': (76, 29, 8), '': (60, 23, 6), 'sm': (48, 19, 5), 'xs': (38, 15, 4)}


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


def _pcell(v, cls=''):
    kind = ''
    if isinstance(v, tuple):
        v, kind = v
    return f'<div class="cell {kind} {cls}">{esc(v)}</div>'


def _lab(lw):
    def lab(t='', cls=''):
        return f'<div class="al {cls}" style="width:{lw + 1}ch">{t}</div>' if lw else ''
    return lab


def pr(a, b, name=None, types=None, hi=(), sel=(), size='', labels=('first', 'second'), on=False):
    """Para jako jedno pudełko z dwiema przegródkami; pod spodem nazwy first / second."""
    cw, cf, gap = SIZES[size]
    lab = _lab(len(name or ''))
    cells = ''.join(_pcell(v, ('hi' if k in hi else '') + (' sel' if k in sel else ''))
                    for k, v in enumerate((a, b)))
    rows = []
    if types:
        rows.append(f'<div class="arow">{lab()}<div class="prow">'
                    + ''.join(f'<div class="ptype">{esc(t)}</div>' for t in types) + '</div></div>')
    rows.append(f'<div class="arow">{lab(esc(name or ""))}<div class="pbox{" on" if on else ""}">{cells}</div></div>')
    if labels:
        rows.append(f'<div class="arow">{lab()}<div class="prow">'
                    + ''.join(f'<div class="pm{" hi" if k in hi else ""}">{esc(t)}</div>'
                              for k, t in enumerate(labels)) + '</div></div>')
    return f'<div class="arr pair" style="--cw:{cw}px;--cf:{cf}px;--gap:{gap}px">{"".join(rows)}</div>'


def parr(pairs, name=None, hi=(), hm=(), size='sm', idx=True, idxs=None, ptr=None, members=False):
    """Tablica par: w każdej szufladce pudełko-para. hi = całe pary, hm = pojedyncze (indeks, 0/1)."""
    cw, cf, gap = SIZES[size]
    lw = max(len(name or ''), 6 if idx else 0)
    lab = _lab(lw)
    n = len(pairs)
    items = []
    if ptr is not None:
        items.append(lab())
        items += [f'<div class="pt"><b>{ptr[k]}</b><span>↓</span></div>' if k in ptr else '<div></div>'
                  for k in range(n)]
    items.append(lab(esc(name or '')))
    for k, pv in enumerate(pairs):
        if pv == 'dots':
            items.append('<div class="pdots">…</div>')
            continue
        cells = ''.join(_pcell(v, 'hi' if (k, j) in hm else '') for j, v in enumerate(pv))
        items.append(f'<div class="pbox{" on" if k in hi else ""}{" ghost" if pv == ("", "") else ""}">{cells}</div>')
    if members:
        items.append(lab())
        items += ['<div></div>' if pv == 'dots' else
                  '<div class="prow"><div class="pm">first</div><div class="pm">second</div></div>' for pv in pairs]
    if idx:
        items.append(lab('indeks', 'sm'))
        for k, pv in enumerate(pairs):
            il = idxs[k] if idxs else ('…' if pv == 'dots' else str(k))
            items.append(f'<div class="idx pidx{" hi" if k in hi else ""}">{esc(il)}</div>')
    ncol = n + (1 if lw else 0)
    return (f'<div class="parr" style="--cw:{cw}px;--cf:{cf}px;--gap:{gap}px;'
            f'grid-template-columns:repeat({ncol}, auto)">{"".join(items)}</div>')


def npr(a, b, c3, name, size=''):
    """Para w parze: {{a, b}, c3}."""
    cw, cf, gap = SIZES[size]
    lab = _lab(len(name))
    inner = (f'<div class="ncol"><div class="pbox in">{_pcell(a)}{_pcell(b)}</div>'
             f'<div class="prow"><div class="pm">.first</div><div class="pm">.second</div></div></div>')
    outer = f'<div class="pbox nest">{inner}<div class="ncol">{_pcell(c3)}<div class="pm">&nbsp;</div></div></div>'
    labels = ('<div class="prow"><div class="pm wide">first</div><div class="pm">second</div></div>')
    return (f'<div class="arr pair" style="--cw:{cw}px;--cf:{cf}px;--gap:{gap}px">'
            f'<div class="arow">{lab(esc(name))}{outer}</div><div class="arow">{lab()}{labels}</div></div>')


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




# ---------------------------------------------------------------- talia slajdów

SLIDES = []
CUR = ['01']


def sec(n):
    CUR[0] = n


def slide(title, *body):
    SLIDES.append((CUR[0], title, ''.join(body)))


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
.k { color: #7c5cff; } .f { color: #00e5c7; } .n { color: #ffb454; } .s { color: #ffcf87; } .m { color: #c6b8ff; }
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

/* ---------- para ---------- */
.pbox { display: flex; gap: var(--gap); padding: 5px; border: 2px solid rgba(124,92,255,.6); border-radius: 10px;
        background: rgba(124,92,255,.07); flex: none; }
.pbox.on { border-color: var(--tl); background: rgba(0,229,199,.07); }
.pbox.in { border-color: rgba(255,207,135,.6); background: rgba(255,207,135,.05); }
.pbox.nest { align-items: flex-start; }
.pbox.nest > .ncol:last-child { padding-top: 7px; }
.ncol { display: flex; flex-direction: column; align-items: center; gap: 4px; }
.ncol .prow { padding: 0 7px; }
.prow { display: flex; gap: var(--gap); padding: 0 7px; }
.ptype, .pm {
  width: var(--cw); flex: none; text-align: center; font-family: 'JetBrains Mono', monospace;
  font-size: max(13px, calc(var(--cf) * .6)); white-space: nowrap;
}
.ptype { color: var(--mu); }
.pm { color: #c6b8ff; }
.pm.hi { color: var(--tl); font-weight: 700; }
.pm.wide { width: calc(var(--cw) * 2 + var(--gap) + 14px); }
.parr { display: inline-grid; column-gap: 12px; row-gap: 6px; align-items: center; justify-items: center; }
.parr .al { justify-self: end; }
.parr .idx { width: auto; }
.pdots { font-family: 'JetBrains Mono', monospace; font-size: var(--cf); color: var(--mu); }

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


def render(d):
    secs = d['secs']
    sec_name = dict(secs)
    sec_order = [n for n, _ in secs]
    total = len(SLIDES) + 2
    cov, end = d['cover'], d['end']
    out = []
    toc = ''.join(f'<span><b>{n}</b>{esc(t)}</span>' for n, t in secs)
    out.append(f'''<section class="slide cover">
  <div class="cover-l">
    <div class="kicker">{cov['kicker']}</div>
    <h1>{cov['h1']}</h1>
    <div class="sub">{cov['sub']}</div>
    <div class="meta">{cov['meta']}</div>
    <div class="deco">{cov['deco']}</div>
  </div>
  <div class="cover-r"><div class="toc-t">Plan prezentacji</div><div class="toc">{toc}</div></div>
  <div class="cover-foot"><b>T-Olimpians</b> Team Poland · t-olimpians.com</div>
</section>''')
    for k, (s, title, body) in enumerate(SLIDES, 2):
        pos = sec_order.index(s)
        bar = ''.join(f'<i class="{"on" if j == pos else "done" if j < pos else ""}"></i>'
                      for j in range(len(secs)))
        out.append(f'''<section class="slide">
  <div class="bar">{bar}</div>
  <div class="top"><span><b>{s}</b> · {esc(sec_name[s])}</span><span class="brand"><b>T-Olimpians</b> · {d['brand']}</span></div>
  <div class="head"><span class="num">{s}</span><h2>{fmt_title(title)}</h2></div>
  <div class="content">{body}</div>
  <div class="foot"><span>t-olimpians.com — {d['foot']}</span><span>{k} / {total}</span></div>
</section>''')
    out.append(f'''<section class="slide cover">
  <div class="end-c">
    <div class="kicker">{end['kicker']}</div>
    <h1>{end['h1']}</h1>
    <div class="sub">{end['sub']}</div>
    <div class="deco" style="margin-top:34px">{end['deco']}</div>
  </div>
  <div class="cover-foot"><b>T-Olimpians</b> Team Poland · t-olimpians.com</div>
</section>''')
    return f'''<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>{d['title']}</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<!-- plik wygenerowany przez {d['generator']} — edytuj generator, nie ten plik -->
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



def build(**d):
    out_html, out_pdf = ROOT / d['html'], ROOT / d['pdf']
    out_html.write_text(render(d), encoding='utf-8')
    print(f'{d["html"]}: {len(SLIDES) + 2} slajdów')
    if '--pdf' in sys.argv:
        subprocess.run(['node', '-e', RENDER_JS, str(out_html), str(out_pdf)], check=True)
        print(f'{d["pdf"]} gotowy')
