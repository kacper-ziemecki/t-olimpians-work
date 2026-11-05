#!/usr/bin/env node
/*
 * Zadania do lekcji „C++ od podstaw” (c++_logika/*.html) — generator.
 *
 *   node lekcje-cpp-zadania/build.js              liczy testy wzorcówkami w JS i zapisuje:
 *                                                  • zadania lekcji (np. tz-*) w zadania-tematowe-app/zadania.json
 *                                                    (testy w zadania-tematowe-app/testy/<id>.json),
 *                                                  • dział „C++ od podstaw” w zadania-tematowe-app/lekcje.json
 *                                                    (zadania.html buduje z niego listę działów, tematów i kroków),
 *                                                  • w pliku lekcji: karty ćwiczeń, bazę zadań, spis treści i liczniki
 *                                                    (między znacznikami <!-- cwiczenia:N -->, <!-- baza -->, <!-- spis -->, <!-- liczby -->)
 *   node lekcje-cpp-zadania/build.js --sprawdz    dodatkowo kompiluje wzorcówki C++ (pole cpp) i uruchamia je na wszystkich
 *                                                  testach (Compiler Explorer, a gdy odmawia — Wandbox); porównuje z wynikami
 *                                                  wzorcówek JS i nic nie zapisuje
 *   node lekcje-cpp-zadania/build.js --sprawdz tz-echo tz-kolo   to samo, tylko dla wybranych zadań
 *   node lekcje-cpp-zadania/build.js --bez-zapisu  tylko liczy testy i wypisuje ich rozmiary
 *
 * Treści zadań są w plikach wymienionych w lekcje.js (pole pliki). Skrypt za każdym razem podmienia
 * wszystkie zadania z prefiksem lekcji — zmiany rób w plikach źródłowych, nie ręcznie w JSON-ach ani w HTML-u.
 */
const fs = require('fs');
const path = require('path');
const h = require('./lib');
const { SITE, KATEGORIA, LEKCJE } = require('./lekcje');
const podzielTesty = require('../zadania-tematowe-app/podziel-testy');

const ROOT = path.resolve(__dirname, '..');
const ZADANIA_JSON = path.join(ROOT, 'zadania-tematowe-app', 'zadania.json');
const LEKCJE_JSON = path.join(ROOT, 'zadania-tematowe-app', 'lekcje.json');
const APP = '../zadania-tematowe-app/zadania.html';

const args = process.argv.slice(2);
const SPRAWDZ = args.includes('--sprawdz');
const WYBRANE = args.filter((a) => !a.startsWith('--'));
const LEVELS = { latwe: 'łatwe', srednie: 'średnie', trudne: 'trudne' };

// ------------------------------------------------------------------ wczytanie zadań

function loadTasks() {
    const all = [];
    for (const lekcja of LEKCJE) {
        for (const f of lekcja.pliki) {
            const list = require(path.join(__dirname, f))(h);
            for (const t of list) {
                const krok = lekcja.kroki.find((k) => k.nr === t.krok);
                if (!krok) throw new Error(`${t.id}: nieznany krok ${t.krok}`);
                if (!t.id.startsWith(lekcja.prefix)) throw new Error(`${t.id}: id musi zaczynać się od ${lekcja.prefix}`);
                t._lekcja = lekcja;
                t._krok = krok;
                all.push(t);
            }
        }
        // Zadania idą w kolejności kroków lekcji — tak samo w zadania.json, lekcje.json i w samej lekcji.
        const order = new Map(lekcja.kroki.map((k, i) => [k, i]));
        const own = all.filter((t) => t._lekcja === lekcja);
        own.forEach((t, i) => { t._ord = order.get(t._krok) * 1000 + i; });
    }
    return all.sort((a, b) => (LEKCJE.indexOf(a._lekcja) - LEKCJE.indexOf(b._lekcja)) || (a._ord - b._ord));
}

// Tak samo jak normalizeOutput w zadania.html.
function normalizeOutput(s) {
    return String(s == null ? '' : s)
        .replace(/\r\n/g, '\n')
        .split('\n')
        .map((line) => line.replace(/[ \t]+$/, ''))
        .join('\n')
        .replace(/\n+$/, '')
        .trim();
}

function hashSeed(s) {
    let x = 2166136261;
    for (const ch of s) x = Math.imul(x ^ ch.charCodeAt(0), 16777619);
    return x >>> 0;
}

function buildTask(t) {
    const need = ['id', 'title', 'level', 'short', 'tags', 'statement', 'input_format', 'output_format', 'constraints',
        'examples', 'hint', 'tests', 'solve', 'cpp'];
    for (const f of need) if (t[f] == null) throw new Error(`${t.id || '?'}: brak pola ${f}`);
    if (!LEVELS[t.level]) throw new Error(`${t.id}: zły poziom ${t.level}`);

    const run = (inp) => {
        const out = normalizeOutput(t.solve(inp));
        if (!out) throw new Error(`${t.id}: puste wyjście dla wejścia ${JSON.stringify(inp.slice(0, 60))}`);
        return out;
    };

    const examples = t.examples.map((ex) => {
        const input = ex.input.replace(/\r/g, '').trim();
        const o = { input, output: run(input) };
        if (ex.note) o.note = ex.note;
        return o;
    });

    const seen = new Set();
    const tests = [];
    const add = (inp) => {
        inp = String(inp).replace(/\r/g, '').trim();
        if (seen.has(inp)) return;
        seen.add(inp);
        if (t.check) {
            const err = t.check(inp);
            if (err) throw new Error(`${t.id}: test łamie ograniczenia (${err}): ${JSON.stringify(inp.slice(0, 80))}`);
        }
        tests.push({ input: inp, output: run(inp) });
    };
    examples.forEach((ex) => add(ex.input));
    t.tests(h.rng(hashSeed(t.id))).forEach(add);

    return {
        id: t.id,
        title: t.title,
        category: t._krok.kategoria,
        time_limit: t.time_limit || '1 s',
        memory_limit: t.memory_limit || '256 MB',
        statement: t.statement,
        input_format: t.input_format,
        output_format: t.output_format,
        constraints: t.constraints,
        examples,
        hint: t.hint,
        tests,
        _level: t.level,
        _short: t.short,
        _tags: t.tags,
        _cpp: t.cpp,
        _krok: t._krok,
        _lekcja: t._lekcja,
    };
}

// ------------------------------------------------------------------ zapis JSON-ów

function readJson(file) {
    const raw = fs.readFileSync(file, 'utf8');
    return { data: JSON.parse(raw), crlf: raw.includes('\r\n'), trailing: /\n$/.test(raw) };
}

function writeJson(file, meta, data) {
    let s = JSON.stringify(data, null, 2);
    if (meta.trailing) s += '\n';
    if (meta.crlf) s = s.replace(/\n/g, '\r\n');
    fs.writeFileSync(file, s, 'utf8');
}

const taskUrl = (id) => `${SITE}/zadania-tematowe-app/zadania.html#${id}`;

function writeZadania(built) {
    const meta = readJson(ZADANIA_JSON);
    const prefixes = LEKCJE.map((l) => l.prefix);
    const rest = meta.data.tasks.filter((t) => !prefixes.some((p) => t.id.startsWith(p)));
    let num = rest.reduce((m, t) => Math.max(m, t.number || 0), 0);
    const fresh = built.map((b) => {
        const o = { id: b.id, number: ++num };
        for (const [k, v] of Object.entries(b)) if (!k.startsWith('_') && k !== 'id') o[k] = v;
        return o;
    });
    meta.data.tasks = rest.concat(fresh);
    writeJson(ZADANIA_JSON, meta, meta.data);
    // Testy idą do zadania-tematowe-app/testy/<id>.json — strona pobiera je dopiero przy „Wyślij”.
    podzielTesty();
    return fresh;
}

// Ten sam format co network-data.json (kompendium): dział → tematy → zagadnienia → zadania.
// Dodatkowe pole "lesson" to link do lekcji (względem zadania-tematowe-app/).
function writeLekcjeJson(built) {
    const data = [{
        cat: KATEGORIA,
        topics: LEKCJE.map((l) => ({
            name: l.temat,
            note: l.note,
            lesson: '../' + l.plik,
            sections: l.kroki.map((k) => ({
                name: k.nazwa,
                note: k.note,
                lesson: '../' + l.plik + '#' + k.kotwica,
                tasks: built.filter((b) => b._krok === k).map((b) => ({
                    name: b.title,
                    url: taskUrl(b.id),
                    level: b._level,
                })),
            })).filter((s) => s.tasks.length),
        })),
    }];
    const meta = fs.existsSync(LEKCJE_JSON) ? readJson(LEKCJE_JSON) : { crlf: false, trailing: true };
    writeJson(LEKCJE_JSON, meta, data);
}

// ------------------------------------------------------------------ wstawki do pliku lekcji

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function plural(n, one, few, many) {
    if (n === 1) return `${n} ${one}`;
    const d = n % 10, s = n % 100;
    return `${n} ${d >= 2 && d <= 4 && (s < 12 || s > 14) ? few : many}`;
}
const cwiczen = (n) => plural(n, 'ćwiczenie', 'ćwiczenia', 'ćwiczeń');
const zadan = (n) => plural(n, 'zadanie', 'zadania', 'zadań');

function cardHtml(b, nr, pad) {
    const tags = b._tags.map((t) => `<span>${esc(t)}</span>`).join('');
    return (
        `${pad}<a class="cw-karta" data-id="${b.id}" href="${APP}#${b.id}" target="_blank" rel="noopener">\n` +
        `${pad}    <span class="cw-nr">${nr}</span>\n` +
        `${pad}    <span class="cw-tresc">\n` +
        `${pad}        <span class="cw-gora"><span class="cw-tytul">${esc(b.title)}</span><span class="zadanie-poziom poz-${b._level}">${LEVELS[b._level]}</span><span class="cw-ok">✓ zaliczone</span></span>\n` +
        `${pad}        <span class="cw-opis">${esc(b._short)}</span>\n` +
        `${pad}        <span class="cw-tagi">${tags}</span>\n` +
        `${pad}    </span>\n` +
        `${pad}    <span class="cw-strzalka">Rozwiąż <span aria-hidden="true">→</span></span>\n` +
        `${pad}</a>`
    );
}

function cwiczeniaHtml(lekcja, krok, list, pad) {
    const sekcja = `${lekcja.plik.split('/').pop()}#${krok.kotwica}`;
    const temat = `${APP}?temat=${slug(KATEGORIA)}/${slug(lekcja.temat)}/${slug(krok.nazwa)}`;
    return [
        `${pad}<div class="cwiczenia reveal" data-cwiczenia="${esc(sekcja)}">`,
        `${pad}    <div class="cwiczenia-gora">`,
        `${pad}        <div>`,
        `${pad}            <span class="cwiczenia-etykieta">Ćwiczenia · teraz Ty</span>`,
        `${pad}            <h3>${cwiczen(list.length)} do tej części</h3>`,
        `${pad}        </div>`,
        `${pad}        <span class="cwiczenia-postep" data-postep>0 / ${list.length} zaliczonych</span>`,
        `${pad}    </div>`,
        `${pad}    <p class="cwiczenia-opis">Kliknij zadanie — otworzy się w sprawdzarce w nowej karcie. Napisz program u siebie, sprawdź go na przykładzie, wklej cały kod i kliknij <strong>Wyślij</strong>. Utknąłeś? Każde zadanie ma wskazówkę.</p>`,
        `${pad}    <div class="cw-lista">`,
        ...list.map((b, i) => cardHtml(b, `${krok.nr}.${i + 1}`, pad + '        ')),
        `${pad}    </div>`,
        `${pad}    <a class="cwiczenia-wszystkie" href="${temat}" target="_blank" rel="noopener">Wszystkie ćwiczenia z tej części w sprawdzarce →</a>`,
        `${pad}</div>`,
    ].join('\n');
}

const BAZA_GRUPY = [
    { level: 'latwe', name: 'Rozgrzewka', desc: 'Jedno, dwa zagadnienia naraz — sprawdź, czy pamiętasz podstawy.' },
    { level: 'srednie', name: 'Średnie', desc: 'Łączysz kilka zagadnień i musisz chwilę pomyśleć nad wzorem.' },
    { level: 'trudne', name: 'Trudne', desc: 'Pułapki z zakresem typów, sprytne sztuczki i wielki finał.' },
];

function bazaHtml(lekcja, krok, list, pad) {
    const out = [];
    let nr = 0;
    for (const g of BAZA_GRUPY) {
        const part = list.filter((b) => b._level === g.level);
        if (!part.length) continue;
        const from = nr + 1, to = nr + part.length;
        out.push(
            `${pad}<div class="baza-grupa reveal">`,
            `${pad}    <div class="baza-grupa-gora">`,
            `${pad}        <span class="zadanie-poziom poz-${g.level}">${LEVELS[g.level]}</span>`,
            `${pad}        <h3>${g.name} <span>· zadania ${from}–${to}</span></h3>`,
            `${pad}    </div>`,
            `${pad}    <p>${(lekcja.bazaOpisy && lekcja.bazaOpisy[g.level]) || g.desc}</p>`,
            `${pad}    <div class="cw-lista">`,
            ...part.map((b) => cardHtml(b, String(++nr), pad + '        ')),
            `${pad}    </div>`,
            `${pad}</div>`,
        );
    }
    const order = list.map((b) => b._level).join(',');
    const sorted = BAZA_GRUPY.flatMap((g) => list.filter((b) => b._level === g.level)).map((b) => b._level).join(',');
    if (order !== sorted) throw new Error(`${lekcja.temat}: zadania bazy muszą iść od łatwych przez średnie do trudnych`);
    return out.join('\n');
}

function spisHtml(lekcja, built, pad) {
    return lekcja.kroki.map((k) => {
        const n = built.filter((b) => b._krok === k).length;
        const nr = k.baza ? '★' : String(k.nr).padStart(2, '0');
        const ile = k.baza ? zadan(n) : (n ? cwiczen(n) : 'teoria');
        return `${pad}<a class="spis-pozycja${k.baza ? ' spis-baza' : ''}" href="#${k.kotwica}"><span class="spis-nr">${nr}</span><span class="spis-nazwa">${esc(k.spis)}</span><span class="spis-liczba">${ile}</span></a>`;
    }).join('\n');
}

// Ten sam slug co w zadania.html (linki ?temat=dział/temat/krok).
function slug(str) {
    const from = 'ąćęłńóśźżĄĆĘŁŃÓŚŹŻ', to = 'acelnoszzACELNOSZZ';
    const s = String(str || '').replace(/[ąćęłńóśźżĄĆĘŁŃÓŚŹŻ]/g, (c) => to[from.indexOf(c)]);
    return s.normalize('NFD').replace(/[̀-ͯ]/g, '')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

function replaceBlock(html, name, make, file) {
    const re = new RegExp(`([ \\t]*)<!-- ${name} -->[\\s\\S]*?<!-- /${name} -->`);
    const m = html.match(re);
    if (!m) throw new Error(`${file}: brak znaczników <!-- ${name} --> … <!-- /${name} -->`);
    const pad = m[1];
    return html.replace(re, () => `${pad}<!-- ${name} -->\n${make(pad)}\n${pad}<!-- /${name} -->`);
}

function writeLessons(built) {
    for (const lekcja of LEKCJE) {
        const file = path.join(ROOT, lekcja.plik);
        const raw = fs.readFileSync(file, 'utf8');
        const crlf = raw.includes('\r\n');
        let html = raw.replace(/\r\n/g, '\n');
        const own = built.filter((b) => b._lekcja === lekcja);

        for (const k of lekcja.kroki) {
            const list = own.filter((b) => b._krok === k);
            if (!list.length) continue;
            if (k.baza) html = replaceBlock(html, 'baza', (pad) => bazaHtml(lekcja, k, list, pad), lekcja.plik);
            else html = replaceBlock(html, `cwiczenia:${k.nr}`, (pad) => cwiczeniaHtml(lekcja, k, list, pad), lekcja.plik);
        }
        html = replaceBlock(html, 'spis', (pad) => spisHtml(lekcja, own, pad), lekcja.plik);

        const nCw = own.filter((b) => !b._krok.baza).length;
        const nBaza = own.length - nCw;
        html = replaceBlock(html, 'liczby', (pad) =>
            `${pad}<span class="liczby-poz"><b>${nCw}</b> ${cwiczen(nCw).replace(/^\d+ /, '')} w trakcie lekcji</span>` +
            `<span class="liczby-poz"><b>${nBaza}</b> ${zadan(nBaza).replace(/^\d+ /, '')} w bazie na koniec</span>` +
            `<span class="liczby-poz"><b>${own.length}</b> ze sprawdzarką C++</span>`, lekcja.plik);

        if (crlf) html = html.replace(/\n/g, '\r\n');
        fs.writeFileSync(file, html, 'utf8');
    }
}

// ------------------------------------------------------------------ sprawdzanie wzorcówek C++

const RAW = (s) => {
    let d = 'T';
    while (s.includes(`)${d}"`)) d += 'T';
    return `R"${d}(${s})${d}"`;
};

// Jeden program z wieloma wzorcówkami naraz (każda w swojej przestrzeni nazw), żeby nie zasypywać
// Compiler Explorera zapytaniami. main wzorcówki staje się funkcją void, a cin/cout — strumieniami
// w pamięci, którym przed każdym testem przywracamy domyślne ustawienia (jak w świeżym programie).
function bundle(tasks) {
    let src = `#include <bits/stdc++.h>
using namespace std;
static istringstream __in;
static ostringstream __out;
#define cin __in
#define cout __out
`;
    tasks.forEach((b, k) => {
        let body = b._cpp
            .replace(/^[ \t]*#include.*$/gm, '')
            .replace(/^[ \t]*using\s+namespace\s+std\s*;[ \t]*$/gm, '')
            .replace(/return\s+0\s*;/g, 'return;');
        const withMain = body.replace(/int\s+main\s*\(\s*\)/, 'void __ref_main()');
        if (withMain === body) throw new Error(`${b.id}: wzorcówka C++ bez int main()`);
        src += `namespace __t${k} {\n${withMain}\n}\n`;
    });
    src += `#undef cin
#undef cout
static string __norm(const string &s0) {
    vector<string> ls; string cur;
    for (char ch : s0) { if (ch == '\\r') continue; if (ch == '\\n') { ls.push_back(cur); cur.clear(); } else cur += ch; }
    ls.push_back(cur);
    string s;
    for (size_t i = 0; i < ls.size(); i++) {
        string l = ls[i];
        while (!l.empty() && (l.back() == ' ' || l.back() == '\\t')) l.pop_back();
        if (i) s += '\\n';
        s += l;
    }
    size_t a = s.find_first_not_of(" \\t\\n"), b = s.find_last_not_of(" \\t\\n");
    return a == string::npos ? string() : s.substr(a, b - a + 1);
}
static void __check(int k, void (*f)(), int n, const char **in, const char **out) {
    for (int i = 0; i < n; i++) {
        __in.clear(); __in.str(in[i]); __in.flags(ios_base::skipws | ios_base::dec);
        __out.clear(); __out.str(""); __out.flags(ios_base::skipws | ios_base::dec); __out.precision(6); __out.fill(' ');
        f();
        string got = __norm(__out.str()), exp = __norm(out[i]);
        if (got == exp) { cout << "OK " << k << " " << i << "\\n"; continue; }
        size_t p = 0; while (p < got.size() && p < exp.size() && got[p] == exp[p]) p++;
        cout << "ZLE " << k << " " << i << " na znaku " << p << ": oczekiwano [" << exp.substr(p, 40) << "] jest [" << got.substr(p, 40) << "]\\n";
    }
}
`;
    tasks.forEach((b, k) => {
        src += `static const char *__in${k}[] = {${b.tests.map((t) => RAW(t.input)).join(',\n')}};\n`;
        src += `static const char *__out${k}[] = {${b.tests.map((t) => RAW(t.output)).join(',\n')}};\n`;
    });
    src += 'int main() {\n';
    tasks.forEach((b, k) => { src += `    __check(${k}, __t${k}::__ref_main, ${b.tests.length}, __in${k}, __out${k});\n`; });
    src += '}\n';
    return src;
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stripAnsi = (s) => String(s || '').replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');

async function postJson(url, payload) {
    const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(payload),
    });
    const text = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status}: ${text.slice(0, 160)}`);
    try { return JSON.parse(text); } catch (e) { throw new Error(`nie-JSON: ${text.slice(0, 160)}`); }
}

async function runGodbolt(source) {
    const j = await postJson('https://godbolt.org/api/compiler/g142/compile', {
        source,
        lang: 'c++',
        allowStoreCodeDebug: false,
        options: {
            userArguments: '-O2 -std=gnu++17',
            executeParameters: { args: [], stdin: '' },
            compilerOptions: { executorRequest: true, skipAsm: true },
            filters: { execute: true },
        },
    });
    const build = j.buildResult || {};
    if (build.code != null && build.code !== 0) {
        return { compileError: (build.stderr || []).map((x) => stripAnsi(x.text)).join('\n') };
    }
    if (j.code == null || (!j.stdout && !j.didExecute)) throw new Error('Compiler Explorer nie uruchomił programu: ' + JSON.stringify(j).slice(0, 300));
    return { stdout: (j.stdout || []).map((x) => x.text).join('\n'), stderr: (j.stderr || []).map((x) => x.text).join('\n'), code: j.code };
}

async function runWandbox(source) {
    const j = await postJson('https://wandbox.org/api/compile.json', {
        code: source,
        compiler: 'gcc-13.2.0',
        options: 'gnu++17',
        'compiler-option-raw': '-O2',
        stdin: '',
        save: false,
    });
    if (j.status === undefined && j.program_output === undefined) return { compileError: stripAnsi(j.compiler_error || j.compiler_message || JSON.stringify(j)) };
    return { stdout: String(j.program_output || ''), stderr: String(j.program_error || ''), code: parseInt(j.status, 10) || 0 };
}

async function runSomewhere(source) {
    let lastErr;
    for (let attempt = 0; attempt < 4; attempt++) {
        for (const [name, fn] of [['Compiler Explorer', runGodbolt], ['Wandbox', runWandbox]]) {
            try {
                const r = await fn(source);
                r.provider = name;
                return r;
            } catch (e) {
                lastErr = e;
                console.log(`    (${name}: ${String(e.message || e).slice(0, 120)})`);
            }
        }
        await sleep(15000 * (attempt + 1));
    }
    throw lastErr;
}

async function checkCpp(built) {
    // paczki do ~120 KB źródła
    const chunks = [];
    let cur = [], size = 0;
    for (const b of built) {
        const s = b.tests.reduce((a, t) => a + t.input.length + t.output.length, 0) + b._cpp.length;
        if (cur.length && size + s > 120000) { chunks.push(cur); cur = []; size = 0; }
        cur.push(b);
        size += s;
    }
    if (cur.length) chunks.push(cur);

    const problems = new Map(built.map((b) => [b.id, []]));
    const okCount = new Map(built.map((b) => [b.id, 0]));
    for (const ch of chunks) {
        console.log(`  paczka: ${ch.length} zadań (${ch[0].id} … ${ch[ch.length - 1].id})`);
        const r = await runSomewhere(bundle(ch));
        if (r.compileError) {
            ch.forEach((b) => problems.get(b.id).push('błąd kompilacji paczki'));
            console.log(r.compileError.slice(0, 4000));
            continue;
        }
        console.log(`    uruchomione na: ${r.provider}, kod wyjścia ${r.code}`);
        for (const line of r.stdout.split('\n')) {
            const m = line.match(/^(OK|ZLE) (\d+) (\d+)(.*)$/);
            if (!m) continue;
            const b = ch[Number(m[2])];
            if (m[1] === 'OK') okCount.set(b.id, okCount.get(b.id) + 1);
            else problems.get(b.id).push(`test ${Number(m[3]) + 1}${m[4]}`);
        }
        for (const b of ch) {
            const done = okCount.get(b.id) + problems.get(b.id).length;
            if (done !== b.tests.length) problems.get(b.id).push(`wykonano ${done} z ${b.tests.length} testów (kod ${r.code}) ${stripAnsi(r.stderr).slice(0, 300)}`);
        }
        await sleep(3000);
    }
    return problems;
}

// ------------------------------------------------------------------ main

module.exports = { loadTasks, buildTask, bundle, normalizeOutput, slug };
if (require.main === module) (async () => {
    const tasks = loadTasks();
    const ids = new Set();
    for (const t of tasks) {
        if (ids.has(t.id)) throw new Error(`powtórzone id ${t.id}`);
        ids.add(t.id);
    }
    const built = [];
    for (const t of tasks) {
        if (WYBRANE.length && !WYBRANE.includes(t.id)) continue;
        built.push(buildTask(t));
    }

    for (const lekcja of LEKCJE) {
        console.log(`\n${lekcja.temat}`);
        for (const k of lekcja.kroki) {
            const list = built.filter((b) => b._krok === k);
            if (!list.length) continue;
            console.log(`  ${k.nazwa}: ${list.length}`);
            for (const b of list) {
                const inSz = b.tests.reduce((a, t) => a + t.input.length, 0);
                const outSz = b.tests.reduce((a, t) => a + t.output.length, 0);
                console.log(`    ${b.id.padEnd(26)} ${LEVELS[b._level].padEnd(8)} ${String(b.tests.length).padStart(2)} testów  wej. ${(inSz / 1024).toFixed(1).padStart(5)} KB  wyj. ${(outSz / 1024).toFixed(1).padStart(5)} KB`);
            }
        }
    }

    if (SPRAWDZ) {
        console.log('\nSprawdzam wzorcówki C++…');
        const problems = await checkCpp(built);
        let bad = 0;
        for (const b of built) {
            const p = problems.get(b.id);
            if (p.length) {
                bad++;
                console.log(`✗ ${b.id}`);
                p.slice(0, 6).forEach((x) => console.log('    ' + x));
            }
        }
        console.log(bad ? `\n${bad} zadań z problemami` : `\nWszystkie wzorcówki C++ (${built.length}) zgodne z testami.`);
        process.exit(bad ? 1 : 0);
    }

    if (WYBRANE.length || args.includes('--bez-zapisu')) {
        console.log('\n(bez zapisu — uruchom bez listy id i bez --bez-zapisu, żeby zapisać JSON-y i lekcje)');
        return;
    }
    const fresh = writeZadania(built);
    writeLekcjeJson(built);
    writeLessons(built);
    console.log(`\nZapisano ${fresh.length} zadań (numery ${fresh[0].number}–${fresh[fresh.length - 1].number}), ` +
        `lekcje.json i ${LEKCJE.length} ${LEKCJE.length === 1 ? 'lekcję' : 'lekcje'}.`);
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
