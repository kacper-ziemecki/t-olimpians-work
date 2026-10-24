/**
 * Proxy do Szkopuła dla strony zadania-oi-oij.html (Cloudflare Worker).
 *
 * PO CO TO JEST
 * Szkopuł nie wysyła nagłówków CORS, więc przeglądarka na t-olimpians.com nie może
 * sama odpytać szkopul.edu.pl — każde fetch blokuje przeglądarka. Ten worker stoi
 * pośrodku: rozmawia ze Szkopułem po stronie serwera i oddaje odpowiedzi
 * z nagłówkami CORS.
 *
 * CO TRZYMA
 * Nic. Jest bezstanowy. Hasło przelatuje tylko przez /login i nigdzie nie jest
 * zapisywane ani logowane; do przeglądarki wraca samo ciasteczko sesji Szkopuła,
 * które siedzi potem w localStorage ucznia.
 *
 * ENDPOINTY
 *   GET  /ping                 -> sprawdzenie, czy proxy żyje i widzi Szkopuł
 *   POST /login                -> { login, password } => { session, csrf, username }
 *   GET  /scores               -> wyniki wszystkich zadań, które user ruszył
 *   GET  /submissions/<klucz>  -> lista zgłoszeń do jednego zadania
 *   POST /submit/<klucz>       -> wysłanie pliku z rozwiązaniem (multipart, pole "file")
 *   GET  /history               -> { solved: { klucz: "RRRR-MM-DD" } } — kiedy padło 100 pkt
 *   GET  /codechef/<login>     -> { user, solved, rating, stars } z profilu na CodeChefie
 *   GET  /codechef/<login>/submissions?from=&pages=  -> zaakceptowane zgłoszenia z datami
 *   POST /cses/login           -> { nick, password } => { session, user }
 *   GET  /cses/solved         -> { solved: [id...], count, total } z listy zadań CSES
 *
 * Sesja leci w nagłówku X-Szkopul-Session, token CSRF w X-Szkopul-Csrf.
 *
 * WDROŻENIE (darmowy plan Cloudflare wystarcza)
 *   1. dash.cloudflare.com -> Compute -> Workers -> Create -> szablon Hello World
 *   2. wklej ten plik jako cały kod workera i zrób Deploy
 *   3. w Settings -> Variables dodaj ALLOWED_ORIGINS z adresem swojej strony,
 *      np. "https://t-olimpians.com,https://www.t-olimpians.com"
 *   4. adres workera (https://cos.twoj-user.workers.dev) wklej na stronie
 *      w okienku "Połącz ze Szkopułem"
 */

const SZKOPUL = 'https://szkopul.edu.pl';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
    + '(KHTML, like Gecko) Chrome/124.0 Safari/537.36';

// Gdy nie ustawisz ALLOWED_ORIGINS, proxy przyjmuje tylko te adresy.
const DEFAULT_ORIGINS = [
    'https://t-olimpians.com',
    'https://www.t-olimpians.com',
    'http://localhost:8765',
    'http://127.0.0.1:8765'
];

// Ile stron listy zadań najwyżej przewijamy na jeden filtr (po 20 zadań na stronę).
// Bezpiecznik, żeby błąd w parsowaniu nie zrobił z workera pętli nieskończonej.
const MAX_PAGES = 30;

/* ─────────────────────────── CORS ─────────────────────────── */

function allowedOrigins(env) {
    const raw = (env && env.ALLOWED_ORIGINS) || '';
    const list = raw.split(',').map(s => s.trim()).filter(Boolean);
    return list.length ? list : DEFAULT_ORIGINS;
}

function corsHeaders(origin, env) {
    const list = allowedOrigins(env);
    const ok = origin && (list.includes('*') || list.includes(origin));
    return {
        'Access-Control-Allow-Origin': ok ? origin : list[0],
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, X-Szkopul-Session, X-Szkopul-Csrf, X-Cses-Session',
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin'
    };
}

function json(data, status, origin, env) {
    return new Response(JSON.stringify(data), {
        status: status || 200,
        headers: Object.assign(
            { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' },
            corsHeaders(origin, env)
        )
    });
}

/* ─────────────────────── ciasteczka i HTML ─────────────────────── */

// Workers zwraca wszystkie Set-Cookie przez getSetCookie(); starsze środowiska
// sklejają je w jeden nagłówek, więc obsługujemy oba warianty.
function readCookies(res) {
    let raw = [];
    if (typeof res.headers.getSetCookie === 'function') raw = res.headers.getSetCookie();
    else {
        const one = res.headers.get('set-cookie');
        if (one) raw = [one];
    }
    const out = {};
    for (const line of raw) {
        const m = /^([^=;]+)=([^;]*)/.exec(line.trim());
        if (m) out[m[1].trim()] = m[2].trim();
    }
    return out;
}

function cookieHeader(parts) {
    return Object.entries(parts)
        .filter(([, v]) => v)
        .map(([k, v]) => k + '=' + v)
        .join('; ');
}

function stripTags(s) {
    return s.replace(/<[^>]*>/g, ' ')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, String.fromCharCode(39))
        .replace(/\s+/g, ' ')
        .trim();
}

/* ─────────────────────── parsowanie stron Szkopuła ─────────────────────── */

// Wiersz listy zadań (/problemset/) wygląda tak:
//   <tr> <td>sur</td> <td><a href="/problemset/problem/KLUCZ/site/">Nazwa</a></td>
//        ... <td class="text-center result--OK result__margin"> 100 </td> </tr>
// result--OK = zaliczone, result--TRIED = częściowe, result--FAILED = 0 pkt.
function parseProblemRows(html) {
    const out = [];
    const rowRe = /<tr>([\s\S]*?)<\/tr>/g;
    let m;
    while ((m = rowRe.exec(html)) !== null) {
        const row = m[1];
        const key = /\/problemset\/problem\/([0-9a-zA-Z_=-]+)\/site\//.exec(row);
        if (!key) continue;
        const res = /result--(OK|TRIED|FAILED)[^>]*>\s*([0-9]+)\s*</.exec(row);
        if (!res) continue;
        out.push({ key: key[1], status: res[1], score: parseInt(res[2], 10) });
    }
    return out;
}

// Tabela zgłoszeń (zakładka "Zgłoszenia" na stronie zadania). Każda komórka ma
// id postaci submission<ID>-<pole>, więc zbieramy je po ID zgłoszenia.
function parseSubmissions(html) {
    const by = new Map();
    const get = id => {
        if (!by.has(id)) by.set(id, { id: id, date: null, status: null, score: null, message: null });
        return by.get(id);
    };

    let m;
    const dateRe = /id="submission(\d+)-link"[^>]*>([\s\S]*?)<\/td>/g;
    while ((m = dateRe.exec(html)) !== null) get(Number(m[1])).date = stripTags(m[2]);

    const statusRe = /id="submission(\d+)-status"[^>]*class="([^"]*)"[^>]*>([\s\S]*?)<\/td>/g;
    while ((m = statusRe.exec(html)) !== null) {
        const rec = get(Number(m[1]));
        const cls = /submission--([A-Za-z_?]+)/.exec(m[2]);
        rec.status = cls ? cls[1] : null;
        rec.message = stripTags(m[3]);
    }

    const scoreRe = /id="submission(\d+)-score"[^>]*>([\s\S]*?)<\/td>/g;
    while ((m = scoreRe.exec(html)) !== null) {
        const txt = stripTags(m[2]);
        const num = /^(\d+)/.exec(txt);
        get(Number(m[1])).score = num ? parseInt(num[1], 10) : null;
    }

    return Array.from(by.values()).sort((a, b) => b.id - a.id);
}

/* ─────────────────────────── endpointy ─────────────────────────── */

async function handleLogin(request, origin, env) {
    let body;
    try { body = await request.json(); } catch (e) { body = null; }
    const login = body && String(body.login || '').trim();
    const password = body && String(body.password || '');
    if (!login || !password) return json({ error: 'Podaj login i hasło.' }, 400, origin, env);

    // Django wymaga tokenu CSRF z ciasteczka, więc najpierw pobieramy stronę logowania.
    const page = await fetch(SZKOPUL + '/account/login/', { headers: { 'User-Agent': UA } });
    const csrf = readCookies(page).csrftoken;
    if (!csrf) return json({ error: 'Szkopuł nie oddał tokenu CSRF.' }, 502, origin, env);

    const form = new URLSearchParams({
        csrfmiddlewaretoken: csrf,
        'login_view-current_step': 'auth',
        'auth-username': login,
        'auth-password': password
    });

    const res = await fetch(SZKOPUL + '/account/login/', {
        method: 'POST',
        redirect: 'manual',
        headers: {
            'User-Agent': UA,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': cookieHeader({ csrftoken: csrf }),
            'Referer': SZKOPUL + '/account/login/',
            'Origin': SZKOPUL
        },
        body: form.toString()
    });

    const jar = readCookies(res);
    const session = jar.sessionid;
    if (!session) {
        // Logowanie nieudane: Szkopuł oddaje 200 z formularzem i komunikatem błędu.
        const html = await res.text();
        const twoFactor = /current_step"\s+value="(?!auth)/i.test(html);
        return json({
            error: twoFactor
                ? 'To konto ma włączone logowanie dwuskładnikowe — proxy tego nie obsługuje.'
                : 'Zły login lub hasło.'
        }, 401, origin, env);
    }

    // Po zalogowaniu Django podmienia token CSRF, więc bierzemy nowy, jeśli przyszedł.
    const newCsrf = jar.csrftoken || csrf;

    // Szkopuł dokleja do każdej odpowiedzi nagłówek X-Username — najtańszy sposób,
    // żeby potwierdzić, że sesja działa, i pokazać uczniowi, na kogo jest zalogowany.
    const who = await fetch(SZKOPUL + '/problemset/', {
        headers: { 'User-Agent': UA, 'Cookie': cookieHeader({ sessionid: session, csrftoken: newCsrf }) }
    });
    const username = who.headers.get('x-username');

    return json({
        session: session,
        csrf: newCsrf,
        username: username && username !== '-' ? username : login
    }, 200, origin, env);
}

async function fetchScores(session, csrf) {
    const found = new Map();
    // "solved" i "attempted" razem dają wszystkie zadania, które user w ogóle ruszył.
    // Reszty bazy (tysiące zadań) nie pobieramy w ogóle.
    for (const filter of ['solved', 'attempted']) {
        for (let page = 1; page <= MAX_PAGES; page++) {
            const url = SZKOPUL + '/problemset/?filter=' + filter + '&page=' + page;
            const res = await fetch(url, {
                headers: { 'User-Agent': UA, 'Cookie': cookieHeader({ sessionid: session, csrftoken: csrf }) }
            });
            if (res.status === 302 || res.status === 403) throw new Error('SESSION');
            if (!res.ok) throw new Error('HTTP ' + res.status);
            const html = await res.text();
            if (html.indexOf('id="navbar-login"') !== -1) throw new Error('SESSION');
            const rows = parseProblemRows(html);
            for (const r of rows) {
                const prev = found.get(r.key);
                if (!prev || r.score > prev.score) found.set(r.key, r);
            }
            // Ostatnia strona: mniej niż pełne 20 wierszy.
            if (rows.length < 20) break;
        }
    }
    return Array.from(found.values());
}

async function handleScores(request, origin, env) {
    const session = request.headers.get('x-szkopul-session');
    const csrf = request.headers.get('x-szkopul-csrf') || '';
    if (!session) return json({ error: 'Brak sesji.' }, 401, origin, env);
    try {
        const problems = await fetchScores(session, csrf);
        return json({ problems: problems, count: problems.length }, 200, origin, env);
    } catch (e) {
        if (String(e.message) === 'SESSION') {
            return json({ error: 'Sesja Szkopuła wygasła — zaloguj się ponownie.', expired: true }, 401, origin, env);
        }
        return json({ error: 'Szkopuł nie odpowiada: ' + e.message }, 502, origin, env);
    }
}

async function handleSubmissions(key, request, origin, env) {
    const session = request.headers.get('x-szkopul-session');
    const csrf = request.headers.get('x-szkopul-csrf') || '';
    if (!session) return json({ error: 'Brak sesji.' }, 401, origin, env);

    const url = SZKOPUL + '/problemset/problem/' + encodeURIComponent(key) + '/site/?key=submissions';
    const res = await fetch(url, {
        headers: { 'User-Agent': UA, 'Cookie': cookieHeader({ sessionid: session, csrftoken: csrf }) }
    });
    if (!res.ok) return json({ error: 'HTTP ' + res.status }, 502, origin, env);
    const html = await res.text();
    if (html.indexOf('id="navbar-login"') !== -1) {
        return json({ error: 'Sesja Szkopuła wygasła — zaloguj się ponownie.', expired: true }, 401, origin, env);
    }
    return json({ submissions: parseSubmissions(html) }, 200, origin, env);
}

async function handleSubmit(key, request, origin, env) {
    const session = request.headers.get('x-szkopul-session');
    const csrf = request.headers.get('x-szkopul-csrf') || '';
    if (!session) return json({ error: 'Brak sesji.' }, 401, origin, env);

    const ct = request.headers.get('content-type') || '';
    if (ct.indexOf('multipart/form-data') === -1) {
        return json({ error: 'Oczekiwano multipart/form-data z polem "file".' }, 400, origin, env);
    }

    // Ciało przekazujemy bajt w bajt — inaczej rozjechałyby się granice multiparta.
    const res = await fetch(SZKOPUL + '/api/problemset/submit/' + encodeURIComponent(key), {
        method: 'POST',
        headers: {
            'User-Agent': UA,
            'Content-Type': ct,
            'Cookie': cookieHeader({ sessionid: session, csrftoken: csrf }),
            'X-CSRFToken': csrf,
            'Referer': SZKOPUL + '/problemset/problem/' + key + '/site/',
            'Origin': SZKOPUL
        },
        body: await request.arrayBuffer()
    });

    const text = await res.text();
    if (res.status === 401 || res.status === 403) {
        return json({
            error: 'Szkopuł odrzucił sesję — zaloguj się ponownie.',
            expired: true,
            detail: text.slice(0, 400)
        }, 401, origin, env);
    }
    if (!res.ok) {
        let detail = text.slice(0, 600);
        try { detail = JSON.stringify(JSON.parse(text)); } catch (e) { /* zostaje surowy tekst */ }
        return json({ error: 'Szkopuł odrzucił zgłoszenie.', detail: detail }, 400, origin, env);
    }

    let id = null;
    try { id = JSON.parse(text); } catch (e) { id = null; }
    return json({ id: typeof id === 'number' ? id : null }, 200, origin, env);
}

/* ─────────────────────────── CSES ─────────────────────────── */
// CSES nie ma API ani CORS-ów, a stan zadań widać dopiero po zalogowaniu
// (wylogowanym pokazuje "Please login to see the statistics"). Działa to jak
// Szkopuł: hasło przelatuje raz przez /cses/login i nigdzie nie jest zapisywane,
// do przeglądarki wraca samo ciasteczko sesji.
// Lista /problemset/list/ pobrana z tą sesją ma już przy każdym zadaniu znacznik
// wyniku — zaliczone mają w klasie "full".
const CSES = 'https://cses.fi';

function csesCookie(res) {
    const raw = res.headers.get('set-cookie') || '';
    const m = /PHPSESSID=([^;]+)/.exec(raw);
    return m ? m[1] : null;
}

async function handleCsesLogin(request, origin, env) {
    let body;
    try { body = await request.json(); } catch (e) { body = null; }
    const nick = body && body.nick;
    const pass = body && body.password;
    if (!nick || !pass) return json({ error: 'Podaj login i hasło.' }, 400, origin, env);

    // 1. strona logowania: ciasteczko sesji + token CSRF
    const start = await fetch(CSES + '/login', { headers: { 'User-Agent': UA } });
    const startHtml = await start.text();
    let session = csesCookie(start);
    const csrf = /name="csrf_token"\s+value="([^"]+)"/.exec(startHtml);
    if (!csrf) return json({ error: 'CSES nie pokazał formularza logowania.' }, 502, origin, env);

    // 2. właściwe logowanie
    const form = 'csrf_token=' + encodeURIComponent(csrf[1])
        + '&nick=' + encodeURIComponent(nick)
        + '&pass=' + encodeURIComponent(pass);
    const res = await fetch(CSES + '/login', {
        method: 'POST',
        redirect: 'manual',
        headers: {
            'User-Agent': UA,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': 'PHPSESSID=' + session
        },
        body: form
    });
    const nowe = csesCookie(res);
    if (nowe) session = nowe;

    // 3. sprawdzenie, czy sesja faktycznie działa
    const kontrola = await fetch(CSES + '/problemset/list/', {
        headers: { 'User-Agent': UA, 'Cookie': 'PHPSESSID=' + session }
    });
    const html = await kontrola.text();
    const user = /href="\/user\/(\d+)"[^>]*>([^<]*)</.exec(html);
    if (!user) return json({ error: 'Zły login lub hasło.' }, 401, origin, env);

    return json({ session: session, user: (user[2] || '').trim() || nick, id: user[1] }, 200, origin, env);
}

// Lista zadań z zaznaczonym wynikiem. Wyciągamy też nazwy działów, bo to jedyna
// informacja o poziomie, jaką CSES podaje — ratingów nie ma tam w ogóle.
function parseCsesList(html) {
    const zadania = [];
    const re = /<li class="task"><a href="\/problemset\/task\/(\d+)"[^>]*>([^<]*)<\/a>[\s\S]{0,300}?<span class="task-score icon ([^"]*)"/g;
    let m;
    while ((m = re.exec(html)) !== null) {
        zadania.push({ id: m[1], nazwa: m[2].trim(), ok: /full/.test(m[3]) });
    }
    return zadania;
}

async function handleCsesSolved(request, origin, env) {
    const session = request.headers.get('x-cses-session');
    if (!session) return json({ error: 'Brak sesji.' }, 401, origin, env);

    const res = await fetch(CSES + '/problemset/list/', {
        headers: { 'User-Agent': UA, 'Cookie': 'PHPSESSID=' + session }
    });
    if (!res.ok) return json({ error: 'CSES odpowiedział HTTP ' + res.status }, 502, origin, env);
    const html = await res.text();

    const zalogowany = /href="\/user\/\d+"/.test(html);
    if (!zalogowany) return json({ error: 'Sesja CSES wygasła — zaloguj się ponownie.', expired: true }, 401, origin, env);

    const zadania = parseCsesList(html);
    if (!zadania.length) return json({ error: 'Nie znalazłem listy zadań (CSES mógł zmienić stronę).' }, 502, origin, env);

    return json({
        solved: zadania.filter(z => z.ok).map(z => z.id),
        count: zadania.filter(z => z.ok).length,
        total: zadania.length
    }, 200, origin, env);
}

/* ──────────────── Historia: kiedy które zadanie padło na 100 pkt ──────────────── */
// Lista z /problemset/?filter=solved nie ma dat, a panel "Ile zadań masz zrobionych"
// rysuje zadania na osi czasu. Daty są za to na stronie ze wszystkimi zgłoszeniami
// użytkownika (ta sama, którą widzi zalogowany na Szkopule). Wyciągamy z niej jedną
// rzecz: datę pierwszego zgłoszenia na 100 punktów dla każdego zadania.
const MAX_HISTORY_PAGES = 60;

// Szkopuł renderuje datę w formacie zależnym od języka interfejsu, więc
// przyjmujemy trzy najczęstsze zapisy zamiast zakładać jeden.
const MIESIACE_PL = {
    sty: 1, lut: 2, mar: 3, kwi: 4, maj: 5, cze: 6,
    lip: 7, sie: 8, wrz: 9, paz: 10, 'paź': 10, lis: 11, gru: 12
};

function parseDate(txt) {
    const t = String(txt || '').trim();
    let m = /(\d{4})-(\d{1,2})-(\d{1,2})/.exec(t);                       // 2024-05-11
    if (m) return m[1] + '-' + pad2(m[2]) + '-' + pad2(m[3]);
    m = /(\d{1,2})[.\-\/](\d{1,2})[.\-\/](\d{4})/.exec(t);              // 11.05.2024
    if (m) return m[3] + '-' + pad2(m[2]) + '-' + pad2(m[1]);
    m = /(\d{1,2})\s+([^\s,]{3,})\.?,?\s+(\d{4})/.exec(t);               // 11 maja 2024
    if (m) {
        const mies = MIESIACE_PL[m[2].slice(0, 3).toLowerCase()];
        if (mies) return m[3] + '-' + pad2(mies) + '-' + pad2(m[1]);
    }
    return null;
}
function pad2(v) { return String(v).padStart(2, '0'); }

function parseHistoryRows(html) {
    const out = [];
    const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
    let m;
    while ((m = rowRe.exec(html)) !== null) {
        const row = m[1];
        // Kotwicą wiersza jest komórka z datą — ma w id numer zgłoszenia.
        const date = /id="submission(\d+)-link"[^>]*>([\s\S]*?)<\/td>/.exec(row);
        if (!date) continue;
        const score = /id="submission\d+-score"[^>]*>([\s\S]*?)<\/td>/.exec(row);
        const status = /id="submission\d+-status"[^>]*class="([^"]*)"/.exec(row);
        // Zadanie bywa tu linkiem (wtedy mamy klucz wprost), ale w widoku
        // "Moje zgłoszenia" jest zwykłym tekstem w formacie "Nazwa (kod)" —
        // tym samym, którym strona podpisuje zadania.
        const zadanie = /id="submission\d+-problem-instance"[^>]*>([\s\S]*?)<\/td>/.exec(row);
        const key = /\/problemset\/problem\/([0-9a-zA-Z_=-]+)\/site\//.exec(row);
        const pkt = score ? /(\d+)/.exec(stripTags(score[1])) : null;
        const cls = status ? /submission--([A-Za-z_?]+)/.exec(status[1]) : null;
        out.push({
            id: Number(date[1]),
            key: key ? key[1] : null,
            nazwa: zadanie ? stripTags(zadanie[1]).replace(/\s+/g, ' ').trim() : null,
            score: pkt ? parseInt(pkt[1], 10) : null,
            status: cls ? cls[1] : null,
            date: parseDate(stripTags(date[2]))
        });
    }
    return out;
}

// Zwracamy dwie mapy: po kluczu zadania (gdy strona go podaje) i po podpisie
// "Nazwa (kod)" — strona dopasuje sobie jedno albo drugie.
async function fetchHistory(session, csrf) {
    const poKluczu = {};
    const poNazwie = {};
    const widziane = new Set();
    let wierszy = 0;

    for (let page = 1; page <= MAX_HISTORY_PAGES; page++) {
        const res = await fetch(SZKOPUL + '/submissions/?page=' + page, {
            headers: { 'User-Agent': UA, 'Cookie': cookieHeader({ sessionid: session, csrftoken: csrf }) }
        });
        if (res.status === 302 || res.status === 403) throw new Error('SESSION');
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const html = await res.text();
        if (html.indexOf('id="navbar-login"') !== -1) throw new Error('SESSION');

        const rows = parseHistoryRows(html);
        let nowych = 0;
        rows.forEach(r => {
            if (widziane.has(r.id)) return;      // paginacja potrafi oddać tę samą stronę
            widziane.add(r.id);
            nowych++;
            wierszy++;
            const zaliczone = r.score === 100 || (r.score === null && r.status === 'OK');
            if (!zaliczone || !r.date) return;
            if (r.key && (!poKluczu[r.key] || r.date < poKluczu[r.key])) poKluczu[r.key] = r.date;
            if (r.nazwa && (!poNazwie[r.nazwa] || r.date < poNazwie[r.nazwa])) poNazwie[r.nazwa] = r.date;
        });
        if (!nowych) break;                       // nic nowego = koniec listy
    }
    return { solved: poKluczu, nazwy: poNazwie, rows: wierszy };
}

async function handleHistory(request, origin, env) {
    const session = request.headers.get('x-szkopul-session');
    const csrf = request.headers.get('x-szkopul-csrf') || '';
    if (!session) return json({ error: 'Brak sesji.' }, 401, origin, env);
    try {
        const wynik = await fetchHistory(session, csrf);
        return json({
            solved: wynik.solved,
            nazwy: wynik.nazwy,
            count: Object.keys(wynik.solved).length + Object.keys(wynik.nazwy).length,
            rows: wynik.rows
        }, 200, origin, env);
    } catch (e) {
        if (String(e.message) === 'SESSION') {
            return json({ error: 'Sesja Szkopuła wygasła — zaloguj się ponownie.', expired: true }, 401, origin, env);
        }
        return json({ error: 'Szkopuł nie odpowiada: ' + e.message }, 502, origin, env);
    }
}

/* ─────────────────────── CodeChef ─────────────────────── */
// CodeChef nie ma publicznego API i nie wysyła nagłówków CORS, a liczba
// rozwiązanych zadań siedzi w HTML-u profilu ("Total Problems Solved: N").
// Z tej samej strony bierzemy rating i gwiazdki. Listy kodów zadań już tam nie
// ma, więc rozkładu trudności nie da się stąd odczytać — stąd na stronie
// CodeChef ma sam licznik, bez krzywej.
const CODECHEF = 'https://www.codechef.com';

// Lista zgłoszeń użytkownika (ta sama, co zakładka "Recent activity" na profilu)
// jest jawna i stronicowana po ~13 wierszy. Oddajemy z niej same zaakceptowane
// zgłoszenia: kod zadania + dzień. Pierwsze rozwiązanie każdego zadania wyliczy
// już strona, bo tylko ona widzi wszystkie pobrane strony naraz.
// Jedno wywołanie bierze najwyżej 40 stron — Cloudflare pozwala na 50 zapytań
// podrzędnych na jedno wejście do workera.
const CC_MAX_STRON = 40;
const CC_ROWNOLEGLE = 5;

function parseCodechefRows(html) {
    const out = [];
    const rowRe = /<tr[^>]*>([\s\S]*?)<\/tr>/g;
    let m;
    while ((m = rowRe.exec(html)) !== null) {
        const row = m[1];
        const kod = /href='\/problems\/([A-Za-z0-9_]+)'/.exec(row);
        if (!kod) continue;
        const ok = /title='accepted'/i.test(row);
        // Data siedzi w title pierwszej komórki, w formacie "10:39 PM 12/09/26".
        const czas = /<td[^>]*title='(\d{1,2}:\d{2}\s*[AP]M\s+\d{1,2}\/\d{1,2}\/\d{2,4})'/i.exec(row);
        let data = null, sek = null;
        if (czas) {
            const c = /(\d{1,2}):(\d{2})\s*([AP])M\s+(\d{1,2})\/(\d{1,2})\/(\d{2,4})/i.exec(czas[1]);
            if (c) {
                const rok = c[6].length === 2 ? 2000 + Number(c[6]) : Number(c[6]);
                let godz = Number(c[1]) % 12;
                if (c[3].toUpperCase() === 'P') godz += 12;
                data = rok + '-' + pad2(c[5]) + '-' + pad2(c[4]);
                sek = Math.floor(Date.UTC(rok, Number(c[5]) - 1, Number(c[4]), godz, Number(c[2])) / 1000);
            }
        }
        if (!data) continue;
        out.push({ p: kod[1], d: data, t: sek, ok: ok });
    }
    return out;
}

async function handleCodechefSubmissions(user, url, origin, env) {
    if (!/^[A-Za-z0-9_.\-]{1,64}$/.test(user)) {
        return json({ error: 'Nieprawidłowy login.' }, 400, origin, env);
    }
    const od = Math.max(0, parseInt(url.searchParams.get('from') || '0', 10) || 0);
    const ile = Math.min(CC_MAX_STRON, Math.max(1, parseInt(url.searchParams.get('pages') || '20', 10) || 20));

    const strona = async nr => {
        const res = await fetch(CODECHEF + '/recent/user?user_handle=' + encodeURIComponent(user) + '&page=' + nr, {
            headers: { 'User-Agent': UA, 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
        });
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const d = await res.json();
        return { max: typeof d.max_page === 'number' ? d.max_page : null, rows: parseCodechefRows(d.content || '') };
    };

    let maxPage = null;
    const wiersze = [];
    try {
        for (let i = 0; i < ile; i += CC_ROWNOLEGLE) {
            const paczka = [];
            for (let k = 0; k < CC_ROWNOLEGLE && i + k < ile; k++) paczka.push(strona(od + i + k));
            const wyniki = await Promise.all(paczka);
            wyniki.forEach(w => {
                if (w.max !== null) maxPage = w.max;
                w.rows.forEach(r => wiersze.push(r));
            });
        }
    } catch (e) {
        // Oddajemy to, co już mamy — strona i tak dolicza resztę przy kolejnym wywołaniu.
        if (!wiersze.length) return json({ error: 'CodeChef nie odpowiada: ' + e.message }, 502, origin, env);
    }

    return json({ rows: wiersze, maxPage: maxPage, next: od + ile }, 200, origin, env);
}

async function handleCodechef(user, origin, env) {
    if (!/^[A-Za-z0-9_.\-]{1,64}$/.test(user)) {
        return json({ error: 'Nieprawidłowy login.' }, 400, origin, env);
    }
    const res = await fetch(CODECHEF + '/users/' + encodeURIComponent(user), {
        headers: { 'User-Agent': UA, 'Accept': 'text/html' }
    });
    if (res.status === 404) return json({ brakKonta: true, error: 'Nie ma takiego konta.' }, 404, origin, env);
    if (!res.ok) return json({ error: 'CodeChef odpowiedział HTTP ' + res.status }, 502, origin, env);

    const html = await res.text();
    // Nieistniejacy login nie daje 404 — CodeChef oddaje 200 i stronę bez profilu.
    // Rozpoznajemy to po braku bloku z profilem, inaczej brak licznika wygladalby
    // jak zmiana ukladu strony.
    const maProfil = html.indexOf('user-profile-container') !== -1 || html.indexOf('rating-number') !== -1;
    if (!maProfil) {
        return json({ brakKonta: true, error: 'Nie ma takiego konta na CodeChefie.' }, 404, origin, env);
    }
    const solved = /Total\s+Problems\s+Solved:\s*(\d+)/i.exec(html);
    if (!solved) {
        return json({ error: 'Profil istnieje, ale nie ma na nim licznika rozwiązanych zadań.' }, 502, origin, env);
    }
    const rating = /class="rating-number"[^>]*>\s*(\d+)/i.exec(html);
    // Gwiazdki to tyle powtorzen encji &#9733; w bloku .rating-star
    const blokGwiazd = /class="rating-star"[\s\S]{0,600}?<\/div>/i.exec(html);
    const ileGwiazd = blokGwiazd ? (blokGwiazd[0].match(/&#9733;/g) || []).length : 0;
    return json({
        user: user,
        solved: Number(solved[1]),
        rating: rating ? Number(rating[1]) : null,
        stars: ileGwiazd ? '★'.repeat(ileGwiazd) : ''
    }, 200, origin, env);
}

/* ─────────────────────────── router ─────────────────────────── */

export default {
    async fetch(request, env) {
        const origin = request.headers.get('origin') || '';
        if (request.method === 'OPTIONS') {
            return new Response(null, { status: 204, headers: corsHeaders(origin, env) });
        }

        const url = new URL(request.url);
        const path = url.pathname.replace(/\/+$/, '') || '/';

        try {
            if (path === '/' || path === '/ping') {
                const res = await fetch(SZKOPUL + '/api/ping', { headers: { 'User-Agent': UA } });
                return json({ ok: res.ok, szkopul: res.ok ? 'pong' : 'HTTP ' + res.status }, 200, origin, env);
            }
            if (path === '/login' && request.method === 'POST') {
                return await handleLogin(request, origin, env);
            }
            if (path === '/scores' && request.method === 'GET') {
                return await handleScores(request, origin, env);
            }
            if (path === '/history' && request.method === 'GET') {
                return await handleHistory(request, origin, env);
            }
            if (path === '/cses/login' && request.method === 'POST') {
                return await handleCsesLogin(request, origin, env);
            }
            if (path === '/cses/solved' && request.method === 'GET') {
                return await handleCsesSolved(request, origin, env);
            }
            const sub = /^\/submissions\/([0-9a-zA-Z_=-]+)$/.exec(path);
            if (sub && request.method === 'GET') {
                return await handleSubmissions(sub[1], request, origin, env);
            }
            const snd = /^\/submit\/([0-9a-zA-Z_=-]+)$/.exec(path);
            if (snd && request.method === 'POST') {
                return await handleSubmit(snd[1], request, origin, env);
            }
            const ccSub = /^\/codechef\/([^\/]+)\/submissions$/.exec(path);
            if (ccSub && request.method === 'GET') {
                return await handleCodechefSubmissions(decodeURIComponent(ccSub[1]), url, origin, env);
            }
            const cc = /^\/codechef\/([^\/]+)$/.exec(path);
            if (cc && request.method === 'GET') {
                return await handleCodechef(decodeURIComponent(cc[1]), origin, env);
            }
            return json({ error: 'Nieznany endpoint: ' + path }, 404, origin, env);
        } catch (e) {
            return json({ error: 'Błąd proxy: ' + (e && e.message ? e.message : String(e)) }, 500, origin, env);
        }
    }
};
