#!/usr/bin/env node
/*
 * Katalog kursów „C++ od podstaw” — c++_logika/kursy.json
 *
 *   node lekcje-cpp-zadania/kursy.js      zapisuje katalog (build.js robi to sam na końcu każdego zapisu)
 *
 * Z katalogu korzystają lista postępów (progress-app: index.html, admin.html, postep.js) i Planer olimpijczyka
 * (planer-app/planer.html): rozpoznają link do lekcji, dają ją wybrać z listy i pokazują ją jako kurs, w którym
 * każdą część lekcji odhacza się jako przeczytaną, a każde zadanie jako zrobione.
 *
 * Skąd co jest:
 *   • lekcje, ich kolejność, etapy, numery, tytuły i opisy — karty c++_logika/*.html w materialy.html,
 *   • części lekcji — spis treści lekcji (a.spis-pozycja; lekcja bez spisu: sekcje z id i nagłówkiem h2),
 *   • zadania części i bazy zadań — zadania-tematowe-app/lekcje.json (pisze go build.js z lekcje.js),
 *   • liczba filmów z OKI — karty .wideo-karta w lekcji.
 * Nowa lekcja trafia więc do katalogu sama: wystarczy karta w materialy.html (a zadania — przebieg build.js).
 *
 * Postęp ucznia trzyma klucze z tych id (postep.js): c|<lekcja>|<część> — część przeczytana,
 * cz|<zadanie> — zadanie zrobione. Nazwa pliku lekcji, kotwice części i id zadań nie powinny się więc zmieniać.
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MATERIALY = path.join(ROOT, 'materialy.html');
const LEKCJE_JSON = path.join(ROOT, 'zadania-tematowe-app', 'lekcje.json');
const KURSY_JSON = path.join(ROOT, 'c++_logika', 'kursy.json');
const ZADANIA_URL = '/zadania-tematowe-app/zadania.html#';
// sekcje, które nie są częściami do przeczytania (lekcje bez spisu treści)
const POMIN = new Set(['filmy', 'jak-sie-uczyc', 'hero']);

const ENCJE = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', middot: '·', ndash: '–', mdash: '—', hellip: '…', rarr: '→', larr: '←' };
/** tekst z kawałka HTML: bez znaczników, z odkodowanymi encjami i pojedynczymi spacjami */
function tekst(html) {
    return String(html || '')
        .replace(/<(?:br|\/?(?:p|div|li|ul|ol|h\d|section|tr|td))\b[^>]*>/gi, ' ')   // blokowe → odstęp
        .replace(/<[^>]*>/g, '')                                                     // span, b, code… → nic
        .replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (m, e) => {
            if (e[0] === '#') return String.fromCodePoint(e[1] === 'x' || e[1] === 'X' ? parseInt(e.slice(2), 16) : parseInt(e.slice(1), 10));
            return ENCJE[e.toLowerCase()] ?? m;
        })
        .replace(/\s+/g, ' ')
        .trim();
}
const czytaj = (p) => fs.readFileSync(p, 'utf8');

/* ─ materialy.html: etapy i karty lekcji w kolejności strony ─ */
function lekcjeZMaterialow() {
    const html = czytaj(MATERIALY);
    const re = /<span class="phase-badge">\s*Etap\s+(\d+)\s*<\/span>\s*<span class="phase-title">([\s\S]*?)<\/span>|<div class="material-card[^"]*"\s+data-link="c\+\+_logika\/([\w-]+)\.html">([\s\S]*?)<div class="material-arrow">/g;
    const etapy = [];
    const lekcje = [];
    let etap = 0;
    for (const m of html.matchAll(re)) {
        if (m[1]) {
            etap = Number(m[1]);
            etapy.push({ nr: etap, nazwa: tekst(m[2]) });
            continue;
        }
        const karta = m[4];
        const pole = (klasa) => {
            const x = karta.match(new RegExp(`<div class="${klasa}">([\\s\\S]*?)</div>`));
            return x ? tekst(x[1]) : '';
        };
        if (!etap) throw new Error(`materialy.html: karta ${m[3]} przed pierwszym etapem`);
        lekcje.push({ id: m[3], nr: pole('material-number'), etap, tytul: pole('material-title'), opis: pole('material-desc') });
    }
    if (!lekcje.length) throw new Error('materialy.html: nie znalazłem kart lekcji c++_logika/*.html');
    return { etapy, lekcje };
}

/* ─ lekcja: części ze spisu treści (albo z sekcji) i liczba filmów z OKI ─ */
function czesciLekcji(id) {
    const plik = path.join(ROOT, 'c++_logika', id + '.html');
    if (!fs.existsSync(plik)) throw new Error(`brak pliku lekcji ${path.relative(ROOT, plik)}`);
    const html = czytaj(plik);
    const filmy = (html.match(/<a class="wideo-karta"/g) || []).length;
    const czesci = [];
    const spis = /<a class="spis-pozycja( spis-baza)?" href="#([\w-]+)">\s*<span class="spis-nr">([\s\S]*?)<\/span>\s*<span class="spis-nazwa">([\s\S]*?)<\/span>/g;
    for (const m of html.matchAll(spis)) {
        czesci.push({ id: m[2], nr: tekst(m[3]), nazwa: tekst(m[4]), baza: !!m[1] || m[2] === 'baza' });
    }
    if (!czesci.length) {
        // lekcja jeszcze bez spisu treści (stary układ): każda sekcja z id i nagłówkiem h2 to część
        const sekcje = /<section\b[^>]*\bid="([\w-]+)"[^>]*>([\s\S]*?)(?=<section\b|<\/main>|<footer\b|$)/g;
        for (const m of html.matchAll(sekcje)) {
            if (POMIN.has(m[1])) continue;
            const h2 = m[2].match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/);
            if (!h2) continue;
            const etykieta = m[2].match(/<span class="section-label[^"]*">\s*(\d+)\s*[—–-]/);
            czesci.push({ id: m[1], nr: etykieta ? etykieta[1].padStart(2, '0') : String(czesci.length + 1).padStart(2, '0'), nazwa: tekst(h2[1]), baza: false });
        }
    }
    return { filmy, czesci };
}

/* ─ zadania z lekcje.json (dział „C++ od podstaw” w zadania-tematowe-app): plik lekcji → kotwica → zadania ─ */
function zadaniaLekcji() {
    const out = new Map();
    const dane = JSON.parse(czytaj(LEKCJE_JSON));
    for (const kat of dane) {
        for (const temat of kat.topics || []) {
            const m = String(temat.lesson || '').match(/c\+\+_logika\/([\w-]+)\.html/);
            if (!m) continue;
            const sekcje = new Map();
            for (const s of temat.sections || []) {
                const kotwica = String(s.lesson || '').split('#')[1];
                if (!kotwica) throw new Error(`lekcje.json: „${temat.name} / ${s.name}” nie ma kotwicy w polu lesson`);
                const zadania = (s.tasks || []).map((t) => {
                    const zid = String(t.url || '').split('#')[1];
                    if (!zid) throw new Error(`lekcje.json: zadanie „${t.name}” bez id w adresie`);
                    return { id: zid, nazwa: t.name, poziom: t.level || '' };
                });
                sekcje.set(kotwica, { nazwa: s.name, opis: s.note || '', zadania });
            }
            out.set(m[1], { temat: temat.name, sekcje });
        }
    }
    return out;
}

function zbudujKatalog() {
    const { etapy, lekcje } = lekcjeZMaterialow();
    const zadania = fs.existsSync(LEKCJE_JSON) ? zadaniaLekcji() : new Map();
    const ids = new Set();
    const kursy = lekcje.map((l) => {
        if (ids.has(l.id)) throw new Error(`materialy.html: lekcja ${l.id} jest dwa razy`);
        ids.add(l.id);
        const { filmy, czesci } = czesciLekcji(l.id);
        const zl = zadania.get(l.id);
        const uzyte = new Set();
        const out = czesci.map((c) => {
            const s = zl && zl.sekcje.get(c.id);
            if (s) uzyte.add(c.id);
            const cz = { id: c.id, nr: c.nr, nazwa: c.nazwa };
            if (s && s.opis) cz.opis = s.opis;
            if (c.baza) cz.baza = true;
            if (s && s.zadania.length) cz.zadania = s.zadania;
            return cz;
        });
        if (zl) {
            const zgubione = [...zl.sekcje.keys()].filter((k) => !uzyte.has(k));
            if (zgubione.length) throw new Error(`${l.id}: kroki z lekcje.json bez pozycji w spisie treści lekcji: ${zgubione.join(', ')}`);
        }
        const kurs = { id: l.id, nr: l.nr, etap: l.etap, tytul: l.tytul, opis: l.opis, url: `/c++_logika/${l.id}.html` };
        if (filmy) kurs.filmy = filmy;
        kurs.czesci = out;
        return kurs;
    });
    const zid = new Set();
    for (const k of kursy) {
        if (!k.czesci.length) throw new Error(`${k.id}: lekcja nie ma żadnej części (brak spisu treści i sekcji z id)`);
        for (const c of k.czesci) for (const z of c.zadania || []) {
            if (zid.has(z.id)) throw new Error(`zadanie ${z.id} jest w katalogu dwa razy`);
            zid.add(z.id);
        }
    }
    return { format: 't-olimpians-kursy-cpp', wersja: 1, nazwa: 'C++ od podstaw', strona: '/materialy.html', zadania: ZADANIA_URL, etapy, kursy };
}

/* JSON czytelny w diffie, ale bez rozpychania: jedno zadanie = jeden wiersz */
function doJson(kat) {
    const zadania = [];
    const s = JSON.stringify(kat, (k, v) => {
        if (k === 'zadania' && Array.isArray(v)) return v.map((z) => `@@Z${zadania.push(z) - 1}@@`);
        return v;
    }, 1);
    return s.replace(/"@@Z(\d+)@@"/g, (m, i) => JSON.stringify(zadania[Number(i)])) + '\n';
}

function zapiszKursy({ cicho = false } = {}) {
    const kat = zbudujKatalog();
    const stary = fs.existsSync(KURSY_JSON) ? czytaj(KURSY_JSON) : '';
    let json = doJson(kat);
    if (stary.includes('\r\n')) json = json.replace(/\n/g, '\r\n');   // jak build.js: końce linii takie, jakie ma plik w repo
    if (stary !== json) fs.writeFileSync(KURSY_JSON, json, 'utf8');
    if (!cicho) {
        const cz = kat.kursy.reduce((a, k) => a + k.czesci.length, 0);
        const zad = kat.kursy.reduce((a, k) => a + k.czesci.reduce((b, c) => b + (c.zadania || []).length, 0), 0);
        console.log(`${path.relative(ROOT, KURSY_JSON)}: ${kat.kursy.length} lekcji, ${cz} części, ${zad} zadań` +
            ` (${(Buffer.byteLength(json) / 1024).toFixed(0)} KB)${stary === json ? ' — bez zmian' : ''}`);
    }
    return kat;
}

module.exports = { zapiszKursy, zbudujKatalog };
if (require.main === module) {
    try {
        zapiszKursy();
    } catch (e) {
        console.error(e.message || e);
        process.exit(1);
    }
}
