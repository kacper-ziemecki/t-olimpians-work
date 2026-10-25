#!/usr/bin/env node
/*
 * Zadania T-Olimpians z rekurencji — generator.
 *
 *   node rekurencja-zadania/build.js              liczy testy wzorcówkami w JS i zapisuje:
 *                                                  • zadania rek-* w zadania-tematowe-app/zadania.json,
 *                                                  • zagadnienia „Krok N · …” tematu „Funkcje rekurencyjne”
 *                                                    (Programowanie Dynamiczne) w network-data.json
 *   node rekurencja-zadania/build.js --sprawdz     dodatkowo uruchamia wzorcówki C++ (pole cpp) na wszystkich
 *                                                  testach przez Compiler Explorer (godbolt.org) i porównuje
 *                                                  z wynikami wzorcówek JS; nic nie zapisuje
 *   node rekurencja-zadania/build.js --sprawdz rek-silnia rek-nwd   to samo, tylko dla wybranych zadań
 *   node rekurencja-zadania/build.js --bez-zapisu  tylko liczy testy i wypisuje ich rozmiary
 *
 * Treści zadań są w zadania-krok1.js … zadania-krok6.js, opis kroków (filmy, prezentacje) w kroki.js.
 * Przy każdym uruchomieniu skrypt podmienia wszystkie zadania rek-* i wszystkie zagadnienia tematu —
 * zmiany rób w plikach źródłowych, nie ręcznie w JSON-ach.
 */
const fs = require('fs');
const path = require('path');
const h = require('./lib');
const { SITE, KROKI, TEMAT_NOTE } = require('./kroki');

const ROOT = path.resolve(__dirname, '..');
const ZADANIA_JSON = path.join(ROOT, 'zadania-tematowe-app', 'zadania.json');
const NETWORK_JSON = path.join(ROOT, 'network-data.json');
const KATEGORIA = 'Programowanie Dynamiczne';
const TEMAT = 'Funkcje rekurencyjne';
const PREFIX = 'rek-';

const args = process.argv.slice(2);
const SPRAWDZ = args.includes('--sprawdz');
const WYBRANE = args.filter((a) => a.startsWith(PREFIX));

// ------------------------------------------------------------------ wczytanie zadań

function loadTasks() {
    const all = [];
    for (const k of KROKI) {
        const file = path.join(__dirname, `zadania-krok${k.nr}.js`);
        if (!fs.existsSync(file)) continue;
        const list = require(file)(h);
        list.forEach((t) => { t.krok = k; });
        all.push(...list);
    }
    return all;
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

function buildTask(t) {
    const need = ['id', 'title', 'level', 'statement', 'input_format', 'output_format', 'constraints',
        'examples', 'hint', 'tests', 'solve', 'cpp'];
    for (const f of need) if (t[f] == null) throw new Error(`${t.id || '?'}: brak pola ${f}`);
    if (!t.id.startsWith(PREFIX)) throw new Error(`${t.id}: id musi zaczynać się od ${PREFIX}`);

    const run = (inp) => {
        const t0 = Date.now();
        const out = normalizeOutput(t.solve(inp));
        const ms = Date.now() - t0;
        if (ms > 3000) console.warn(`  ! ${t.id}: wzorcówka JS liczyła ${ms} ms`);
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
        inp = inp.replace(/\r/g, '').trim();
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
        category: t.krok.category,
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
        _cpp: t.cpp,
        _krok: t.krok,
    };
}

function hashSeed(s) {
    let x = 2166136261;
    for (const ch of s) x = Math.imul(x ^ ch.charCodeAt(0), 16777619);
    return x >>> 0;
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
const dzialUrl = (cat) => `${SITE}/zadania-tematowe-app/zadania.html?dzial=${encodeURIComponent(cat)}`;

function writeZadania(built) {
    const meta = readJson(ZADANIA_JSON);
    const rest = meta.data.tasks.filter((t) => !t.id.startsWith(PREFIX));
    let num = rest.reduce((m, t) => Math.max(m, t.number || 0), 0);
    const fresh = built.map((b) => {
        const o = { id: b.id, number: ++num };
        for (const [k, v] of Object.entries(b)) if (!k.startsWith('_') && k !== 'id') o[k] = v;
        return o;
    });
    meta.data.tasks = rest.concat(fresh);
    writeJson(ZADANIA_JSON, meta, meta.data);
    return fresh;
}

function writeKompendium(built) {
    const meta = readJson(NETWORK_JSON);
    const cat = meta.data.find((c) => c.cat === KATEGORIA);
    if (!cat) throw new Error(`brak kategorii ${KATEGORIA} w network-data.json`);
    const topic = cat.topics.find((t) => t.name === TEMAT);
    if (!topic) throw new Error(`brak tematu ${TEMAT} w kategorii ${KATEGORIA}`);

    topic.note = TEMAT_NOTE;
    topic.sections = KROKI.map((k) => {
        const tasks = built.filter((b) => b._krok === k);
        const links = [
            { label: `slajdy: ${k.slides.label}`, url: `${SITE}/pdf-src/${k.slides.file}.html` },
            { label: 'slajdy w PDF', url: `${SITE}/${k.slides.file}-t-olimpians.pdf` },
            { label: `zadania z kroku ${k.nr} (${tasks.length})`, url: dzialUrl(k.category) },
            ...(k.extraLinks || []),
        ];
        return {
            name: k.name,
            note: k.note + ' Każde zadanie ma automatyczną sprawdzarkę C++ i wskazówkę.',
            videos: k.videos,
            links,
            tasks: tasks.map((b) => ({
                name: b.title,
                url: taskUrl(b.id),
                platform: 'T-Olimpians',
                level: b._level,
                hint: b.hint,
            })),
        };
    });
    writeJson(NETWORK_JSON, meta, meta.data);
}

// ------------------------------------------------------------------ sprawdzanie wzorcówek C++ (godbolt)

const RAW = (s) => {
    let d = 'T';
    while (s.includes(`)${d}"`)) d += 'T';
    return `R"${d}(${s})${d}"`;
};

function harness(cpp, tests) {
    // main wzorcówki staje się zwykłą funkcją void (w int-funkcji brak return to UB),
    // a cin/cout — strumieniami w pamięci, więc jeden program przechodzi przez wszystkie testy.
    const body = cpp.replace(/int\s+main\s*\(\s*\)/, 'void __ref_main()');
    if (body === cpp) throw new Error('wzorcówka C++ bez int main()');
    return `#include <bits/stdc++.h>
using namespace std;
static istringstream __in;
static ostringstream __out;
#define cin __in
#define cout __out
${body}
#undef cin
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
static const char *__IN[] = {${tests.map((t) => RAW(t.input)).join(',\n')}};
static const char *__OUT[] = {${tests.map((t) => RAW(t.output)).join(',\n')}};
int main() {
    for (int i = 0; i < ${tests.length}; i++) {
        __in.clear(); __in.str(__IN[i]); __out.clear(); __out.str("");
        auto t0 = chrono::steady_clock::now();
        __ref_main();
        double ms = chrono::duration<double, milli>(chrono::steady_clock::now() - t0).count();
        string got = __norm(__out.str()), exp = __norm(__OUT[i]);
        if (got == exp) { cout << "OK " << i << " " << (long long)ms << "\\n"; continue; }
        size_t p = 0; while (p < got.size() && p < exp.size() && got[p] == exp[p]) p++;
        cout << "ZLE " << i << " na znaku " << p << ": oczekiwano [" << exp.substr(p, 40) << "] jest [" << got.substr(p, 40) << "]\\n";
    }
}
`;
}

async function godbolt(source) {
    const ids = ['g142', 'g132'];
    let lastErr;
    for (const id of ids) {
        for (let attempt = 0; attempt < 3; attempt++) {
            try {
                const res = await fetch(`https://godbolt.org/api/compiler/${id}/compile`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
                    body: JSON.stringify({
                        source,
                        options: {
                            userArguments: '-O2 -std=gnu++17',
                            executeParameters: { args: [], stdin: '' },
                            compilerOptions: { executorRequest: true, skipAsm: true },
                            filters: { execute: true },
                        },
                        lang: 'c++',
                        allowStoreCodeDebug: false,
                    }),
                });
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                return await res.json();
            } catch (e) {
                lastErr = e;
                await new Promise((r) => setTimeout(r, 3000 * (attempt + 1)));
            }
        }
    }
    throw lastErr;
}

const stripAnsi = (s) => String(s || '').replace(/\u001b\[[0-9;]*[A-Za-z]/g, '');

async function checkCpp(b) {
    // paczki do ~150 KB źródła, żeby nie przekroczyć limitów Compiler Explorera
    const chunks = [];
    let cur = [], size = 0;
    b.tests.forEach((t, i) => {
        const s = t.input.length + t.output.length;
        if (cur.length && size + s > 150000) { chunks.push(cur); cur = []; size = 0; }
        cur.push({ ...t, i });
        size += s;
    });
    if (cur.length) chunks.push(cur);

    const problems = [];
    let slowest = 0;
    for (const ch of chunks) {
        const j = await godbolt(harness(b._cpp, ch));
        const build = j.buildResult || {};
        if (build.code !== 0 && build.code != null) {
            problems.push('błąd kompilacji:\n' + (build.stderr || []).map((x) => stripAnsi(x.text)).join('\n').slice(0, 3000));
            break;
        }
        if (j.timedOut) problems.push('przekroczony czas na godbolcie');
        const outLines = (j.stdout || []).map((x) => x.text);
        const okCount = outLines.filter((l) => l.startsWith('OK ')).length;
        outLines.filter((l) => l.startsWith('OK ')).forEach((l) => { slowest = Math.max(slowest, Number(l.split(' ')[2])); });
        outLines.filter((l) => l.startsWith('ZLE')).forEach((l) => {
            const k = Number(l.split(' ')[1]);
            problems.push(`test ${ch[k].i + 1}: ${l}`);
        });
        if (okCount + outLines.filter((l) => l.startsWith('ZLE')).length !== ch.length) {
            problems.push(`wykonano ${okCount} z ${ch.length} testów (kod ${j.code}) ` +
                stripAnsi((j.stderr || []).map((x) => x.text).join(' ')).slice(0, 300) +
                (outLines.length ? '\n      stdout: ' + outLines.slice(0, 8).join(' | ').slice(0, 400) : ''));
        }
        await new Promise((r) => setTimeout(r, 800));
    }
    return { problems, slowest };
}

// ------------------------------------------------------------------ main

module.exports = { loadTasks, buildTask, harness, godbolt, normalizeOutput };
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

    for (const k of KROKI) {
        const list = built.filter((b) => b._krok === k);
        if (!list.length) continue;
        console.log(`\nKrok ${k.nr}: ${list.length} zadań`);
        for (const b of list) {
            const inSz = b.tests.reduce((a, t) => a + t.input.length, 0);
            const outSz = b.tests.reduce((a, t) => a + t.output.length, 0);
            console.log(`  ${b.id.padEnd(30)} ${String(b.tests.length).padStart(2)} testów  wej. ${(inSz / 1024).toFixed(1).padStart(6)} KB  wyj. ${(outSz / 1024).toFixed(1).padStart(6)} KB`);
        }
    }

    if (SPRAWDZ) {
        console.log('\nSprawdzam wzorcówki C++ na Compiler Explorerze…');
        let bad = 0;
        for (const b of built) {
            const { problems, slowest } = await checkCpp(b);
            if (problems.length) {
                bad++;
                console.log(`✗ ${b.id}`);
                problems.forEach((p) => console.log('    ' + p));
            } else {
                console.log(`✓ ${b.id.padEnd(30)} najwolniejszy test ${slowest} ms${slowest > 300 ? '  ← wolno!' : ''}`);
            }
        }
        console.log(bad ? `\n${bad} zadań z problemami` : '\nWszystkie wzorcówki C++ zgodne z testami.');
        process.exit(bad ? 1 : 0);
    }

    if (WYBRANE.length || args.includes('--bez-zapisu')) {
        console.log('\n(bez zapisu — uruchom bez listy id i bez --bez-zapisu, żeby zapisać JSON-y)');
        return;
    }
    const fresh = writeZadania(built);
    writeKompendium(built);
    console.log(`\nZapisano ${fresh.length} zadań (numery ${fresh[0].number}–${fresh[fresh.length - 1].number}) ` +
        `i ${KROKI.length} zagadnień tematu „${TEMAT}”.`);
})().catch((e) => {
    console.error(e);
    process.exit(1);
});
