#!/usr/bin/env node
/*
 * Przenosi testy z zadania-tematowe-app/zadania.json do osobnych plików testy/<id>.json.
 *
 *   node zadania-tematowe-app/podziel-testy.js
 *
 * Testy to ~96% wagi zadań (kilka MB), a potrzebne są dopiero po kliknięciu „Wyślij”
 * albo „Tryb ręczny”. Strona wczytuje więc tylko lekki zadania.json, a testy jednego
 * zadania pobiera na żądanie. W zadania.json zostaje pole "tests_count" (liczba testów).
 *
 * Skrypt jest idempotentny: rusza tylko zadania, które mają jeszcze pole "tests"
 * (np. po ręcznym dopisaniu zadania albo po generatorze, który wpisuje testy do JSON-a).
 * rekurencja-zadania/build.js wywołuje go sam po zapisaniu zadań.
 */
const fs = require('fs');
const path = require('path');

const DIR = __dirname;
const ZADANIA_JSON = path.join(DIR, 'zadania.json');
const TESTY_DIR = path.join(DIR, 'testy');

function testsFile(id) {
    if (!/^[a-z0-9-]+$/i.test(id)) throw new Error(`niedozwolone id zadania: ${id}`);
    return path.join(TESTY_DIR, id + '.json');
}

function podziel() {
    const raw = fs.readFileSync(ZADANIA_JSON, 'utf8');
    const crlf = raw.includes('\r\n');
    const data = JSON.parse(raw);
    let moved = 0;

    fs.mkdirSync(TESTY_DIR, { recursive: true });
    for (const t of data.tasks) {
        if (!Array.isArray(t.tests)) continue;
        fs.writeFileSync(testsFile(t.id), JSON.stringify(t.tests), 'utf8');
        t.tests_count = t.tests.length;
        delete t.tests;
        moved++;
    }

    // Pliki testów zadań, których już nie ma w zadania.json.
    const ids = new Set(data.tasks.map((t) => t.id));
    const orphans = fs.readdirSync(TESTY_DIR)
        .filter((f) => f.endsWith('.json') && !ids.has(f.slice(0, -5)));
    orphans.forEach((f) => fs.unlinkSync(path.join(TESTY_DIR, f)));

    if (data.meta && data.meta.schema_hint) {
        delete data.meta.schema_hint.tests;
        data.meta.schema_hint.tests_count =
            'liczba testów zadania; same testy (tablica {input, output}) są w testy/<id>.json — ' +
            'strona pobiera je dopiero po kliknięciu „Wyślij”. Możesz też wpisać tu pole "tests" ' +
            'i uruchomić node zadania-tematowe-app/podziel-testy.js, który przeniesie je do testy/.';
    }

    if (moved || orphans.length) {
        let s = JSON.stringify(data, null, 2) + (raw.endsWith('\n') ? '\n' : '');
        if (crlf) s = s.replace(/\n/g, '\r\n');
        fs.writeFileSync(ZADANIA_JSON, s, 'utf8');
    }
    return { moved, removed: orphans.length };
}

module.exports = podziel;

if (require.main === module) {
    const { moved, removed } = podziel();
    console.log(`Przeniesiono testy ${moved} zadań do testy/` +
        (removed ? `, usunięto ${removed} plików po nieistniejących zadaniach` : '') + '.');
}
