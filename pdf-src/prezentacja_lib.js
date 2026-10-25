/*
 * Wspólne klocki prezentacji T-Olimpians — wersja dla Node.js.
 *
 * Port pdf-src/prezentacja_lib.py (te same nazwy funkcji i ten sam HTML), żeby prezentacje dało się
 * generować na komputerze bez Pythona. CSS nie jest kopiowany: czytamy go wprost z prezentacja_lib.py,
 * więc wygląd wszystkich prezentacji zmienia się w jednym miejscu. Tutaj dochodzą tylko style nowych
 * klocków (stos wywołań, drzewo wywołań, śledzenie, plansza, poziomy) — w CSS_EXTRA.
 *
 * Skrypt prezentacji:  const L = require('./prezentacja_lib');  const D = L.deck();
 *                      D.sec('01'); D.slide('Tytuł', L.P('…'), …);  D.build({ … });
 * Z flagą --pdf powstaje też PDF (Chrome/Edge w trybie headless).
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

// ---------------------------------------------------------------- kolorowanie C++

const KW = new Set(['int', 'for', 'return', 'using', 'namespace', 'if', 'else', 'while', 'char', 'bool', 'void',
    'long', 'double', 'const', 'true', 'false', 'break', 'continue']);
const BI = new Set(['cout', 'cin', 'endl', 'main', 'std', 'pair', 'make_pair', 'string', 'vector', 'auto',
    'max', 'min', 'swap', 'abs', 'sort']);
const TOK = /(?<c>\/\/.*)|(?<inc>#include)|(?<hdr><\w+>)|(?<s>"[^"]*"|'[^']*')|(?<n>(?<![\w)\]])-?\d+)|(?<id>[A-Za-z_]\w*)|(?<sp>\s+)|(?<p>.)/g;

function tok(s) {
    const out = [];
    let prev = '';
    for (const m of s.matchAll(TOK)) {
        let kind = Object.keys(m.groups).find((k) => m.groups[k] !== undefined);
        const t = esc(m[0]);
        if (kind === 'sp') { out.push(t); continue; }
        if (kind === 'id') kind = prev === '.' ? 'm' : KW.has(m[0]) ? 'k' : BI.has(m[0]) ? 'f' : 'v';
        else if (kind === 'inc') kind = 'k';
        else if (kind === 'hdr') kind = 'f';
        out.push(`<span class="${kind}">${t}</span>`);
        prev = m[0];
    }
    return out.join('');
}

function hlLine(line) {
    // fragment w ⟦…⟧ dostaje pomarańczową ramkę
    return line.split(/(⟦.*?⟧)/).map((part) => (part.startsWith('⟦') ? `<span class="mk">${tok(part.slice(1, -1))}</span>` : tok(part))).join('');
}

function dedent(src) {
    const lines = src.replace(/^\n+|\s+$/g, '').split('\n');
    const ind = Math.min(...lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length));
    return lines.map((l) => l.slice(ind)).join('\n');
}

function codeLines(src, hl = [], dim = false) {
    return dedent(src).split('\n').map((line, i) => {
        const k = i + 1;
        let cls = 'ln';
        if (hl.includes(k)) cls += ' hl';
        else if (dim && hl.length) cls += ' dim';
        return `<span class="${cls}">${hlLine(line) || ' '}</span>`;
    }).join('');
}

function code(src, o = {}) {
    const { cap = null, hl = [], dim = false, size = '', bad = false, good = false } = o;
    const cls = 'code ' + size + (bad ? ' bad' : '') + (good ? ' okc' : '');
    const pre = `<pre class="${cls}">${codeLines(src, hl, dim)}</pre>`;
    const capc = 'code-cap' + (bad ? ' bad' : '') + (good ? ' okc' : '');
    return `<div class="code-wrap">${cap ? `<div class="${capc}">${cap}</div>` : ''}${pre}</div>`;
}

const bare = (src) => `<pre class="code bare">${codeLines(src)}</pre>`;
const c = (s) => `<code class="ic">${esc(s)}</code>`;

// ---------------------------------------------------------------- klocki slajdów

const P = (s, cls = '') => `<p class="${cls}">${s}</p>`;
const stack = (items, o = {}) => `<div class="stack ${o.cls || ''}" style="--sg:${o.gap ?? 16}px">${items.join('')}</div>`;

function cols(items, o = {}) {
    const t = o.t || items.map(() => '1fr').join(' ');
    return `<div class="cols" style="grid-template-columns:${t};gap:${o.gap ?? 34}px;align-items:${o.align || 'start'}">`
        + items.map((i) => `<div class="col">${i}</div>`).join('') + '</div>';
}

const center = (...items) => `<div class="center">${items.join('')}</div>`;
const box = (kind, s, label) => `<div class="${kind}">${label ? `<span class="${kind}-label">${label}</span> ` : ''}${s}</div>`;
const note = (s, label) => box('note', s, label);
const warn = (s, label = 'Uwaga:') => box('warn', s, label);
const good = (s, label) => box('good', s, label);
const big = (s) => `<div class="big">${s}</div>`;
const steps = (items, cls = '') => `<ol class="steps ${cls}">` + items.map((i) => `<li>${i}</li>`).join('') + '</ol>';
const traps = (items) => '<ol class="traps">' + items.map((i) => `<li>${i}</li>`).join('') + '</ol>';

function table(head, rows, o = {}) {
    const cg = o.widths ? '<colgroup>' + o.widths.map((w) => `<col style="width:${w}">`).join('') + '</colgroup>' : '';
    const th = head.map((x) => `<th>${x}</th>`).join('');
    const tb = rows.map((r) => '<tr>' + r.map((x) => `<td>${x}</td>`).join('') + '</tr>').join('');
    return `<table class="tbl ${o.cls || ''}">${cg}<thead><tr>${th}</tr></thead><tbody>${tb}</tbody></table>`;
}

const card = (title, desc, cls = '') => `<div class="card ${cls}"><div class="card-t">${title}</div><div class="card-d">${desc}</div></div>`;
const cards = (items, n = 2) => `<div class="cards" style="grid-template-columns:repeat(${n},1fr)">${items.join('')}</div>`;
const kv = (rows) => '<div class="kv">' + rows.map(([k, v]) => `<div class="kv-k">${k}</div><div class="kv-v">${v}</div>`).join('') + '</div>';

function term(text, o = {}) {
    const kind = o.kind || 'out';
    const cap = o.cap ?? (kind === 'out' ? 'na ekranie' : 'wejście (wpisujemy z klawiatury)');
    let body = o.raw ? text : esc(text);
    if (o.cursor) body += '<span class="cur"> </span>';
    return `<div class="term ${kind} ${o.size || ''}"><div class="term-cap">${cap}</div><pre>${body}</pre></div>`;
}

const SIZES = { wide: [104, 29, 8], smw: [66, 19, 5], lg: [76, 29, 8], '': [60, 23, 6], sm: [48, 19, 5], xs: [38, 15, 4] };

// Tablica jako rząd szufladek z indeksami (jak arr() w wersji Pythona).
function arr(vals, o = {}) {
    const { name = null, hi = [], sel = [], size = '', ptr = null, ptrname = '', spans = null, idx = true, idxs = null, namew = null, cap = null } = o;
    const [cw, cf, gap] = SIZES[size];
    let lw = namew ?? Math.max((name || '').length, ptrname.length, idx ? 6 : 0);
    if (!name && !ptrname && namew == null) lw = 0;
    const lab = (t = '', cls = '') => (lw ? `<div class="al ${cls}" style="width:${lw + 1}ch">${t}</div>` : '');
    const cells = [], ids = [], pts = [];
    vals.forEach((v0, k) => {
        let v = v0, kind = '';
        if (Array.isArray(v0)) [v, kind] = v0;
        const cl = 'cell ' + kind + (hi.includes(k) ? ' hi' : '') + (sel.includes(k) ? ' sel' : '');
        cells.push(`<div class="${cl}">${esc(v)}</div>`);
        const il = idxs ? idxs[k] : (kind === 'dots' ? '…' : String(k));
        ids.push(`<div class="idx${hi.includes(k) ? ' hi' : ''}${kind === 'ghost' ? ' gh' : ''}">${esc(il)}</div>`);
        if (ptr) {
            const t = ptr[k] || '';
            pts.push(t ? `<div class="pt"><b>${t}</b><span>↓</span></div>` : '<div class="pt"></div>');
        }
    });
    const rows = [];
    if (ptr) rows.push(`<div class="arow">${lab(ptrname, 'sm')}${pts.join('')}</div>`);
    rows.push(`<div class="arow">${lab(esc(name || ''))}${cells.join('')}</div>`);
    if (idx) rows.push(`<div class="arow">${lab('indeks', 'sm')}${ids.join('')}</div>`);
    if (spans) {
        const segs = [];
        let pos = 0;
        for (const [s, n, t, cl] of spans) {
            if (s > pos) segs.push(`<div style="width:calc(var(--cw)*${s - pos} + var(--gap)*${s - pos - 1})"></div>`);
            segs.push(`<div class="span ${cl || ''}" style="width:calc(var(--cw)*${n} + var(--gap)*${n - 1})"><div class="br"></div><div class="sl">${t}</div></div>`);
            pos = s + n;
        }
        rows.push(`<div class="arow">${lab()}${segs.join('')}</div>`);
    }
    return `<div class="arr" style="--cw:${cw}px;--cf:${cf}px;--gap:${gap}px">${cap ? `<div class="arr-cap">${cap}</div>` : ''}${rows.join('')}</div>`;
}

function flow(...boxes) {
    return '<div class="flow">' + boxes.map(([title, body, cls], k) =>
        (k ? '<div class="farrow">→</div>' : '') +
        `<div class="fbox ${cls}"><div class="ftitle">${title}</div><div class="fbody">${body}</div></div>`).join('') + '</div>';
}

function anat(parts, legend) {
    let line = '';
    for (const [text, col, num] of parts) {
        line += col ? `<span class="ap" style="--ac:var(--${col})">${tok(text)}<span class="ab">${num}</span></span>` : tok(text);
    }
    const leg = legend.map(([num, col, t, d]) => `<div class="lgd" style="--ac:var(--${col})"><span class="lb">${num}</span>`
        + `<span class="lc">${c(t)}</span><span class="ld">${d}</span></div>`).join('');
    return `<div class="anat"><div class="aline">${line}</div><div class="legend">${leg}</div></div>`;
}

// ---------------------------------------------------------------- nowe klocki: rekurencja

/*
 * Stos wywołań. frames — od dołu (main) do wierzchu; ramka: { f: 'odliczaj(3)', d: 'czeka…', s: 'on' | 'wait' | 'ret' | 'gone' | 'new' }.
 * Rysowany wierzchem do góry, z podpisem „wierzch” przy górnej ramce.
 */
function stos(frames, o = {}) {
    const cap = o.cap ?? 'stos wywołań';
    const list = frames.slice().reverse().map((fr, k) => {
        const top = k === 0 && !o.noTop;
        return `<div class="frm ${fr.s || 'wait'}"><span class="fn">${fr.raw ? fr.f : esc(fr.f)}</span>`
            + `<span class="fd">${fr.d || ''}</span>${top ? '<span class="ftop">← wierzch</span>' : ''}</div>`;
    }).join('');
    return `<div class="stk${o.size ? ' ' + o.size : ''}"><div class="stk-cap">${cap}</div>${list}<div class="stk-bot">dno stosu</div></div>`;
}

/*
 * Drzewo wywołań (SVG). Węzeł: { t: 'fib(4)', v: '3' (wartość zwrócona — opcjonalnie), s: '' | 'on' | 'done' | 'memo' | 'cut' | 'ghost',
 * e: 'podpis krawędzi od rodzica', ch: [dzieci] }. Liście rozkładane równo, rodzic nad środkiem swoich dzieci.
 */
function tree(root, o = {}) {
    const fs = o.fs ?? 17, dy = o.dy ?? 74, slot = o.slot ?? 0, pad = 12;
    const cw = fs * 0.62;
    const nodes = [];
    const wOf = (n) => Math.max(o.minw ?? 44, Math.round(String(n.t).length * cw + 2 * pad));
    let maxW = 0;
    (function walk(n, d) { n._d = d; n._w = wOf(n); maxW = Math.max(maxW, n._w); (n.ch || []).forEach((x) => walk(x, d + 1)); })(root, 0);
    const gapX = o.gap ?? 14;
    const step = slot || maxW + gapX;
    let leaf = 0, depth = 0;
    (function place(n) {
        depth = Math.max(depth, n._d);
        if (!n.ch || !n.ch.length) { n._x = leaf * step + step / 2; leaf++; }
        else { n.ch.forEach(place); n._x = (n.ch[0]._x + n.ch[n.ch.length - 1]._x) / 2; }
        nodes.push(n);
    })(root);
    const nh = fs + 16;
    const W = leaf * step, H = depth * dy + nh + (o.vals === false ? 4 : 24);
    const Y = (n) => n._d * dy + 2;
    const out = [];
    for (const n of nodes) for (const ch of n.ch || []) {
        const x1 = n._x, y1 = Y(n) + nh, x2 = ch._x, y2 = Y(ch);
        out.push(`<line class="te ${ch.s || ''}" x1="${x1.toFixed(1)}" y1="${y1}" x2="${x2.toFixed(1)}" y2="${y2}"/>`);
        if (ch.e) {
            const mx = (x1 + x2) / 2 + (x2 < x1 ? -8 : x2 > x1 ? 8 : 8), my = (y1 + y2) / 2 + 4;
            out.push(`<text class="tel ${ch.s || ''}" x="${mx.toFixed(1)}" y="${my}" text-anchor="${x2 < x1 ? 'end' : x2 > x1 ? 'start' : 'start'}">${esc(ch.e)}</text>`);
        }
    }
    for (const n of nodes) {
        const x = n._x - n._w / 2, y = Y(n);
        out.push(`<g class="tn ${n.s || ''}"><rect x="${x.toFixed(1)}" y="${y}" width="${n._w}" height="${nh}" rx="7"/>`
            + `<text x="${n._x.toFixed(1)}" y="${y + nh / 2 + fs * 0.36}" text-anchor="middle" style="font-size:${fs}px">${esc(n.t)}</text>`
            + (n.v != null ? `<text class="tv" x="${n._x.toFixed(1)}" y="${y + nh + 16}" text-anchor="middle">${esc(n.v)}</text>` : '') + '</g>');
    }
    const maxPx = o.width ?? W;
    return `<div class="treebox"><svg class="tree" viewBox="0 0 ${W.toFixed(0)} ${H}" style="width:min(100%, ${maxPx}px)" xmlns="http://www.w3.org/2000/svg">${out.join('')}</svg></div>`;
}

// Pomocnik do drzew: węzeł.
const T = (t, ch = [], extra = {}) => ({ t, ch, ...extra });

/*
 * Śledzenie wywołań („drabinka”): wiersze { d: głębokość, k: 'call' | 'ret' | 'out' | 'note' | 'stop', t: tekst (HTML) }.
 */
function trace(rows, o = {}) {
    const icon = { call: '↓', ret: '↑', out: '▸', note: '·', stop: '■' };
    return `<div class="trc${o.size ? ' ' + o.size : ''}">${o.cap ? `<div class="trc-cap">${o.cap}</div>` : ''}` + rows.map((r) =>
        `<div class="tr ${r.k || 'note'}${r.hl ? ' hl' : ''}" style="padding-left:${14 + (r.d || 0) * (o.ind ?? 30)}px"><span class="ti">${icon[r.k || 'note']}</span><span class="tt">${r.t}</span></div>`).join('') + '</div>';
}

/*
 * Plansza 2D: m — tablica wierszy (napisy albo tablice wartości), cls(i, j, v) — klasa pola
 * (q: hetman, x: ściana, hit: bite pole, path: droga, cur: bieżące pole, dim, ok, bad).
 */
function board(m, o = {}) {
    const cw = o.cw ?? 44;
    const rows = m.map((r) => (typeof r === 'string' ? r.split('') : r));
    const ncol = Math.max(...rows.map((r) => r.length));
    const cells = rows.map((r, i) => r.map((v, j) => {
        const cl = o.cls ? o.cls(i, j, v) || '' : '';
        const shown = o.show ? o.show(i, j, v) : v;
        return `<div class="bc ${cl}">${esc(shown)}</div>`;
    }).join('')).join('');
    const sep = o.sudoku ? ' sdk' : '';
    return `<div class="brd${sep}" style="--cw:${cw}px;grid-template-columns:repeat(${ncol}, var(--cw))">${cells}</div>`;
}

/*
 * Poziomy (np. sortowanie przez scalanie): levels — tablica poziomów, poziom — tablica grup,
 * grupa — { v: [wartości], s: '' | 'on' | 'done' | 'dim' }. Każdy poziom w osobnym rzędzie, grupy wyśrodkowane.
 */
function levels(lv, o = {}) {
    const [cw, cf, gap] = SIZES[o.size ?? 'sm'];
    return `<div class="lvls" style="--cw:${cw}px;--cf:${cf}px;--gap:${gap}px">` + lv.map((row, i) =>
        `<div class="lvl">${o.labels ? `<div class="lvl-l">${o.labels[i] || ''}</div>` : ''}<div class="lvl-g">` + row.map((g) =>
            `<div class="grp ${g.s || ''}">${g.v.map((v) => `<div class="cell">${esc(v)}</div>`).join('')}</div>`).join('') + '</div></div>').join('') + '</div>';
}

// ---------------------------------------------------------------- wykres liniowy (port chart())

let CHART_ID = 0;
function niceStep(span, target = 5) {
    const raw = span / target;
    const mag = raw > 0 ? 10 ** Math.floor(Math.log10(raw)) : 1;
    for (const m of [1, 2, 5, 10]) if (raw <= m * mag) return m * mag;
    return 10 * mag;
}
function fmtTick(v) {
    v = Math.round(v * 1e6) / 1e6;
    if (v >= 1000 && v % 1000 === 0) return v < 1e6 ? `${v / 1000}K` : `${v / 1e6}M`;
    return String(v);
}
function chart(series, xmax, ymax, o = {}) {
    const { xmin = 0, w = 620, h = 300, xlabel = 'n', ylabel = 'liczba wywołań', points = null } = o;
    const cid = `cr${++CHART_ID}`;
    const ml = 58, mr = 128, mt = 14, mb = 44;
    const pw = w - ml - mr, ph = h - mt - mb;
    const X = (x) => ml + (x - xmin) / (xmax - xmin) * pw;
    const Y = (y) => mt + ph - y / ymax * ph;
    const out = [`<svg class="chart" viewBox="0 0 ${w} ${h}" xmlns="http://www.w3.org/2000/svg">`,
        `<defs><clipPath id="${cid}"><rect x="${ml}" y="${mt - 2}" width="${pw + 2}" height="${ph + 4}"/></clipPath></defs>`];
    const xs = niceStep(xmax - xmin), ys = niceStep(ymax);
    for (let t = 0; t <= ymax + 1e-9; t += ys)
        out.push(`<line class="grid" x1="${ml}" x2="${ml + pw}" y1="${Y(t).toFixed(1)}" y2="${Y(t).toFixed(1)}"/><text class="tick" x="${ml - 8}" y="${(Y(t) + 4).toFixed(1)}" text-anchor="end">${fmtTick(t)}</text>`);
    for (let t = Math.ceil(xmin / xs) * xs; t <= xmax + 1e-9; t += xs)
        out.push(`<text class="tick" x="${X(t).toFixed(1)}" y="${mt + ph + 18}" text-anchor="middle">${fmtTick(t)}</text>`);
    out.push(`<line class="axis" x1="${ml}" x2="${ml + pw}" y1="${mt + ph}" y2="${mt + ph}"/><line class="axis" x1="${ml}" x2="${ml}" y1="${mt}" y2="${mt + ph}"/>`
        + `<text class="alab" x="${ml + pw}" y="${h - 6}" text-anchor="end">${xlabel} →</text>`
        + `<text class="alab" x="${ml - 50}" y="${mt + 8}" text-anchor="start" transform="rotate(-90 ${ml - 44} ${mt + 8})" dx="-${ph - 10}">${ylabel} →</text>`);
    const labels = [];
    for (const [name, f, col] of series) {
        const pts = [];
        let last = null;
        for (let k = 0; k <= 240; k++) {
            const x = xmin + (xmax - xmin) * k / 240, y = f(x);
            pts.push(`${X(x).toFixed(1)},${Y(Math.min(y, ymax * 1.05)).toFixed(1)}`);
            if (y <= ymax) last = [x, y];
        }
        out.push(`<polyline clip-path="url(#${cid})" fill="none" stroke="${col}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round" points="${pts.join(' ')}"/>`);
        if (last) labels.push([Y(last[1]), X(last[0]), name, col]);
    }
    labels.sort((a, b) => a[0] - b[0]);
    for (let it = 0; it < 60; it++) {
        for (let i = 0; i + 1 < labels.length; i++) {
            const a = labels[i], b = labels[i + 1];
            if (b[0] - a[0] < 19) { const d = (19 - (b[0] - a[0])) / 2; a[0] -= d; b[0] += d; }
        }
        labels.forEach((l) => { l[0] = Math.min(Math.max(l[0], mt + 6), mt + ph - 4); });
    }
    for (const [yy, xx, name, col] of labels) {
        const lx = Math.min(xx, ml + pw) + 8;
        out.push(`<circle cx="${lx + 4}" cy="${(yy - 4).toFixed(1)}" r="4.5" fill="${col}"/><text class="slab" x="${lx + 13}" y="${yy.toFixed(1)}">${name}</text>`);
    }
    for (const [x, y, txt] of points || [])
        out.push(`<circle cx="${X(x).toFixed(1)}" cy="${Y(y).toFixed(1)}" r="4" class="pt"/><text class="ptl" x="${(X(x) + 8).toFixed(1)}" y="${(Y(y) - 8).toFixed(1)}">${txt}</text>`);
    out.push('</svg>');
    return '<div class="chartbox">' + out.join('') + '</div>';
}

// ---------------------------------------------------------------- CSS

function baseCss() {
    const py = fs.readFileSync(path.join(__dirname, 'prezentacja_lib.py'), 'utf8');
    const m = py.match(/CSS = r"""([\s\S]*?)"""/);
    if (!m) throw new Error('nie znalazłem CSS w prezentacja_lib.py');
    return m[1];
}

const CSS_EXTRA = String.raw`
/* ---------- stos wywołań ---------- */
.stk { display: flex; flex-direction: column; gap: 6px; min-width: 0; }
.stk-cap { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; letter-spacing: .14em; text-transform: uppercase;
           color: #c6b8ff; margin-bottom: 2px; }
.frm { display: grid; grid-template-columns: auto 1fr auto; align-items: center; gap: 12px; border: 2px solid var(--line);
       border-radius: 8px; background: var(--panel); padding: 7px 14px; font-family: 'JetBrains Mono', monospace; }
.frm .fn { font-size: 19px; font-weight: 700; color: #e8e8f0; white-space: nowrap; }
.frm .fd { font-family: 'DM Sans', sans-serif; font-size: 16px; color: var(--mu); line-height: 1.3; }
.frm .ftop { font-size: 12.5px; color: var(--tl); letter-spacing: .06em; white-space: nowrap; }
.frm.on { border-color: var(--tl); background: rgba(0,229,199,.09); }
.frm.on .fn { color: var(--tl); }
.frm.on .fd { color: #c8c8d8; }
.frm.wait { border-color: rgba(124,92,255,.5); background: rgba(124,92,255,.06); }
.frm.ret { border-color: var(--or); background: rgba(255,180,84,.08); }
.frm.ret .fn { color: var(--or); }
.frm.ret .fd { color: var(--yl); }
.frm.gone { border-style: dashed; opacity: .38; }
.frm.new { border-style: dashed; border-color: var(--tl); }
.frm.main { border-color: #3a3a4c; }
.stk-bot { border-top: 3px solid #3a3a4c; margin-top: 2px; padding-top: 4px; font-family: 'JetBrains Mono', monospace;
           font-size: 11.5px; letter-spacing: .14em; text-transform: uppercase; color: #5c5c74; text-align: center; }
.stk.sm .frm { padding: 4px 10px; gap: 8px; }
.stk.sm .frm .fn { font-size: 15px; }
.stk.sm .frm .fd { font-size: 13px; }
.stk.sm .stk-cap { font-size: 11px; }
.stk.sm .ftop { display: none; }
.stks { display: flex; align-items: flex-end; gap: 14px; justify-content: center; }
.stks > .stk { flex: 1 1 0; }
.stks .stk-cap { color: var(--mu); }

/* ---------- drzewo wywołań ---------- */
.treebox { display: flex; justify-content: center; }
.tree { display: block; height: auto; overflow: visible; }
.tree text { font-family: 'JetBrains Mono', monospace; }
.tree .te { stroke: #3a3a4c; stroke-width: 2; }
.tree .te.on, .tree .te.done { stroke: rgba(124,92,255,.7); }
.tree .te.cut, .tree .te.ghost { stroke-dasharray: 5 5; opacity: .45; }
.tree .te.memo { stroke: var(--or); stroke-dasharray: 5 4; }
.tree .tel { fill: var(--mu); font-size: 13px; }
.tree .tel.on { fill: var(--tl); }
.tree .tn rect { fill: var(--panel); stroke: var(--line); stroke-width: 2; }
.tree .tn text { fill: #e8e8f0; font-weight: 700; }
.tree .tn .tv { fill: var(--or); font-size: 14px; }
.tree .tn.on rect { stroke: var(--tl); fill: #0d2421; }
.tree .tn.on text { fill: var(--tl); }
.tree .tn.done rect { stroke: rgba(124,92,255,.75); fill: #15122a; }
.tree .tn.done text { fill: #c6b8ff; }
.tree .tn.memo rect { stroke: var(--or); stroke-dasharray: 5 4; fill: #1e170d; }
.tree .tn.memo text { fill: var(--or); }
.tree .tn.ok rect { stroke: var(--tl); fill: #0d2421; }
.tree .tn.ok text { fill: var(--tl); }
.tree .tn.cut { opacity: .38; }
.tree .tn.cut rect { stroke-dasharray: 5 5; }
.tree .tn.ghost { opacity: .3; }
.tree .tn.ghost rect { stroke-dasharray: 5 5; }
.tree .tn.ghost .tv, .tree .tn.cut .tv { display: none; }

/* ---------- śledzenie wywołań ---------- */
.trc { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; padding: 10px 0; }
.trc-cap { font-family: 'JetBrains Mono', monospace; font-size: 12.5px; letter-spacing: .14em; text-transform: uppercase;
           color: var(--mu); padding: 0 16px 8px; }
.tr { display: flex; gap: 10px; align-items: baseline; padding-top: 3px; padding-bottom: 3px; padding-right: 14px;
      font-size: 19.5px; line-height: 1.35; color: #c8c8d8; }
.tr .ti { font-family: 'JetBrains Mono', monospace; font-weight: 700; width: 16px; flex: none; text-align: center; }
.tr .tt code.ic { font-size: 16.5px; }
.tr.call .ti { color: var(--tl); }
.tr.ret .ti { color: var(--or); }
.tr.out .ti { color: #fff; }
.tr.out .tt { color: #fff; }
.tr.stop .ti { color: var(--or); }
.tr.note .ti { color: var(--mu); }
.tr.note .tt { color: var(--mu); }
.tr.hl { background: rgba(0,229,199,.09); box-shadow: inset 4px 0 0 var(--tl); }
.trc.sm .tr { font-size: 17.5px; padding-top: 1px; padding-bottom: 1px; }
.trc.sm .tr .tt code.ic { font-size: 15px; }

/* ---------- plansza ---------- */
.brd { display: inline-grid; gap: 3px; }
.bc { width: var(--cw); height: var(--cw); border: 2px solid var(--line); background: var(--panel); border-radius: 5px;
      display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace;
      font-size: calc(var(--cw) * .48); font-weight: 700; color: var(--tx); }
.bc.q { border-color: var(--tl); background: rgba(0,229,199,.16); color: var(--tl); }
.bc.hit { background: rgba(255,180,84,.10); color: var(--or); border-color: rgba(255,180,84,.3); }
.bc.x { background: repeating-linear-gradient(135deg, #0e0e15 0 6px, #1b1b27 6px 12px); color: #4a4a5c; }
.bc.path { border-color: rgba(124,92,255,.75); background: rgba(124,92,255,.16); color: #c6b8ff; }
.bc.cur { outline: 2.5px dashed var(--or); outline-offset: 2px; }
.bc.ok { border-color: var(--tl); color: var(--tl); }
.bc.bad { border-color: var(--or); color: var(--or); background: rgba(255,180,84,.10); }
.bc.dim { color: #5c5c74; }
.bc.new { color: var(--tl); }
.brd.sdk { gap: 0; border: 3px solid #5c5c74; border-radius: 6px; overflow: hidden; }
.brd.sdk .bc { border-radius: 0; border: 1px solid #2a2a38; }
.brd.sdk .bc.alt { background: #1c1c2a; }

/* ---------- poziomy (dziel i zwyciężaj) ---------- */
.lvls { display: flex; flex-direction: column; gap: 12px; align-items: center; }
.lvl { display: flex; align-items: center; gap: 14px; }
.lvl-l { width: 150px; text-align: right; font-family: 'JetBrains Mono', monospace; font-size: 13px; color: var(--mu); letter-spacing: .06em; }
.lvl-g { display: flex; gap: 18px; justify-content: center; }
.grp { display: flex; gap: var(--gap); padding: 4px; border: 2px solid var(--line); border-radius: 9px; background: var(--panel2); }
.grp .cell { width: var(--cw); height: var(--cw); }
.grp.on { border-color: var(--tl); background: rgba(0,229,199,.07); }
.grp.on .cell { color: var(--tl); border-color: rgba(0,229,199,.45); }
.grp.done { border-color: rgba(124,92,255,.6); background: rgba(124,92,255,.07); }
.grp.dim { opacity: .35; }
.grp.or { border-color: var(--or); background: rgba(255,180,84,.07); }

/* ---------- drobne ---------- */
.arrow-down { text-align: center; font-size: 30px; color: var(--mu); line-height: 1; }
.pill { display: inline-block; font-family: 'JetBrains Mono', monospace; font-size: 15px; padding: 2px 10px; border-radius: 99px;
        background: var(--chip); color: var(--tl); border: 1px solid rgba(0,229,199,.3); }
.pill.or { color: var(--or); border-color: rgba(255,180,84,.35); }
.qa { font-family: 'JetBrains Mono', monospace; font-size: 64px; font-weight: 700; color: var(--tl); text-align: center; }
`;

// ---------------------------------------------------------------- talia slajdów i HTML

function fmtTitle(t) {
    // tekst w `…` pisany czcionką kodu (żeby 0 nie wyglądało jak O)
    return t.split('`').map((x, k) => (k % 2 ? `<span class="tm">${esc(x)}</span>` : esc(x))).join('');
}

function deck() {
    const SLIDES = [];
    let cur = '01';
    const D = {
        sec(n) { cur = n; },
        slide(title, ...body) { SLIDES.push([cur, title, body.join('')]); },
        count: () => SLIDES.length + 2,
        render(d) {
            const secs = d.secs;
            const secName = Object.fromEntries(secs);
            const order = secs.map(([n]) => n);
            const total = SLIDES.length + 2;
            const cov = d.cover, end = d.end;
            const toc = secs.map(([n, t]) => `<span><b>${n}</b>${esc(t)}</span>`).join('');
            const out = [];
            out.push(`<section class="slide cover">
  <div class="cover-l">
    <div class="kicker">${cov.kicker}</div>
    <h1>${cov.h1}</h1>
    <div class="sub">${cov.sub}</div>
    <div class="meta">${cov.meta}</div>
    <div class="deco">${cov.deco || ''}</div>
  </div>
  <div class="cover-r"><div class="toc-t">Plan prezentacji</div><div class="toc${secs.length > 15 ? ' long' : ''}${secs.length > 16 ? ' xlong' : ''}">${toc}</div></div>
  <div class="cover-foot"><b>T-Olimpians</b> Team Poland · t-olimpians.com</div>
</section>`);
            SLIDES.forEach(([s, title, body], i) => {
                const pos = order.indexOf(s);
                if (pos < 0) throw new Error(`nieznana sekcja ${s}`);
                const bar = secs.map((_, j) => `<i class="${j === pos ? 'on' : j < pos ? 'done' : ''}"></i>`).join('');
                out.push(`<section class="slide">
  <div class="bar">${bar}</div>
  <div class="top"><span><b>${s}</b> · ${esc(secName[s])}</span><span class="brand"><b>T-Olimpians</b> · ${d.brand}</span></div>
  <div class="head"><span class="num">${s}</span><h2>${fmtTitle(title)}</h2></div>
  <div class="content">${body}</div>
  <div class="foot"><span>t-olimpians.com — ${d.foot}</span><span>${i + 2} / ${total}</span></div>
</section>`);
            });
            out.push(`<section class="slide cover">
  <div class="end-c">
    <div class="kicker">${end.kicker}</div>
    <h1>${end.h1}</h1>
    <div class="sub">${end.sub}</div>
    <div class="deco" style="margin-top:34px">${end.deco || ''}</div>
  </div>
  <div class="cover-foot"><b>T-Olimpians</b> Team Poland · t-olimpians.com</div>
</section>`);
            return `<!doctype html>
<html lang="pl">
<head>
<meta charset="utf-8">
<title>${d.title}</title>
<meta name="robots" content="noindex">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,wght@0,400;0,500;0,700;1,400&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">
<!-- plik wygenerowany przez ${d.generator} — edytuj generator, nie ten plik -->
<style>${baseCss()}${CSS_EXTRA}</style>
</head>
<body>
${out.join('\n')}
</body>
</html>
`;
        },
        async build(d) {
            const outHtml = path.join(ROOT, d.html);
            fs.writeFileSync(outHtml, D.render(d), 'utf8');
            console.log(`${d.html}: ${SLIDES.length + 2} slajdów`);
            if (process.argv.includes('--pdf')) {
                await printPdf(outHtml, path.join(ROOT, d.pdf));
                console.log(`${d.pdf} gotowy`);
            }
        },
    };
    return D;
}

/*
 * PDF przez Chrome/Edge w trybie headless, sterowany przez DevTools Protocol (wbudowany WebSocket z Node ≥ 22),
 * żeby przed drukiem poczekać na czcionki z Google Fonts. Rozmiar strony bierze z @page: 1280 × 720.
 */
async function printPdf(src, dst) {
    const candidates = [
        process.env.CHROME,
        'C:/Program Files/Google/Chrome/Application/chrome.exe',
        'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
        '/usr/bin/google-chrome', '/usr/bin/chromium', '/usr/bin/chromium-browser',
        '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    ].filter(Boolean);
    const exe = candidates.find((p) => fs.existsSync(p));
    if (!exe) throw new Error('Nie znalazłem Chrome ani Edge — ustaw zmienną CHROME na ścieżkę do przeglądarki.');
    const os = require('os');
    const { spawn } = require('child_process');
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'prezentacja-pdf-'));
    const chrome = spawn(exe, ['--headless=new', '--disable-gpu', '--no-first-run', '--no-default-browser-check',
        '--remote-debugging-port=0', `--user-data-dir=${profile}`, 'about:blank'], { stdio: 'ignore' });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    try {
        const portFile = path.join(profile, 'DevToolsActivePort');
        for (let i = 0; i < 100 && !fs.existsSync(portFile); i++) await sleep(100);
        const port = fs.readFileSync(portFile, 'utf8').split('\n')[0].trim();
        const targets = await (await fetch(`http://127.0.0.1:${port}/json/list`)).json();
        const page = targets.find((t) => t.type === 'page');
        const ws = new WebSocket(page.webSocketDebuggerUrl);
        await new Promise((r, j) => { ws.onopen = r; ws.onerror = j; });
        let id = 0;
        const waiting = new Map();
        const events = [];
        ws.onmessage = (m) => {
            const msg = JSON.parse(m.data);
            if (msg.id && waiting.has(msg.id)) { waiting.get(msg.id)(msg); waiting.delete(msg.id); } else if (msg.method) events.push(msg.method);
        };
        const send = (method, params = {}) => new Promise((resolve, reject) => {
            const k = ++id;
            waiting.set(k, (msg) => (msg.error ? reject(new Error(`${method}: ${msg.error.message}`)) : resolve(msg.result)));
            ws.send(JSON.stringify({ id: k, method, params }));
        });
        await send('Page.enable');
        const url = 'file:///' + src.replace(/\\/g, '/').replace(/^\//, '');
        await send('Page.navigate', { url });
        for (let i = 0; i < 300 && !events.includes('Page.loadEventFired'); i++) await sleep(100);
        // Czcionki pobierają się dopiero po pierwszym układzie strony — wymuszamy je (z polskimi znakami) i czekamy.
        const fonts = await send('Runtime.evaluate', {
            expression: `(async () => {
                const wait = (ms) => new Promise((r) => setTimeout(r, ms));
                await wait(300);
                const faces = ['400 20px "DM Sans"', '500 20px "DM Sans"', '700 20px "DM Sans"', 'italic 400 20px "DM Sans"',
                    '400 20px "JetBrains Mono"', '500 20px "JetBrains Mono"', '700 20px "JetBrains Mono"'];
                await Promise.all(faces.map((f) => document.fonts.load(f, 'AaZz09 ąćęłńóśźż ĄĆĘŁŃÓŚŹŻ')));
                await document.fonts.ready;
                await wait(300);
                await document.fonts.ready;
                return [...new Set([...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, '')))].join(',');
            })()`,
            awaitPromise: true, returnByValue: true,
        });
        const loaded = String(fonts.result.value || '');
        if (!loaded.includes('DM Sans') || !loaded.includes('JetBrains Mono'))
            console.warn(`  ! czcionki nie wczytały się (${loaded || 'brak'}) — PDF będzie miał zastępcze czcionki`);
        await sleep(300);
        const pdf = await send('Page.printToPDF', { preferCSSPageSize: true, printBackground: true });
        fs.writeFileSync(dst, Buffer.from(pdf.data, 'base64'));
        ws.close();
    } finally {
        chrome.kill();
        await sleep(300);
        try { fs.rmSync(profile, { recursive: true, force: true }); } catch (e) { /* Chrome czasem trzyma jeszcze pliki */ }
    }
}

module.exports = {
    esc, tok, code, bare, c, P, stack, cols, center, box, note, warn, good, big, steps, traps, table, card, cards, kv, term,
    arr, flow, anat, stos, tree, T, trace, board, levels, chart, deck,
};
