/* Service worker kalendarza lekcji:
   - aplikacja otwiera się też bez internetu (ostatnio zapisana wersja strony),
   - pokazuje powiadomienia push: serwer tylko „budzi” telefon, a treść pobieramy stąd (akcja pushPull).
   Adres backendu przychodzi w parametrze ?api= przy rejestracji (kalendarz.html). */
const CACHE = 'kalendarz-v1';
const ASSETS = ['./kalendarz.html', './manifest.webmanifest', './icons/icon-192.png', './icons/icon-512.png', './icons/badge-96.png'];
const API = new URL(self.location.href).searchParams.get('api') || '';
const HOME = './kalendarz.html';

// Kopia odpowiedzi bez flagi „redirected” (Netlify może przekierować .html na ładny adres,
// a przekierowanej odpowiedzi nie wolno potem podać przy nawigacji).
async function cleanCopy(res) {
    return new Response(await res.blob(), { status: 200, statusText: 'OK', headers: res.headers });
}

self.addEventListener('install', (event) => {
    event.waitUntil((async () => {
        const cache = await caches.open(CACHE);
        await Promise.all(ASSETS.map(async (url) => {
            try {
                const res = await fetch(url, { cache: 'reload' });
                if (res.ok) await cache.put(url, await cleanCopy(res));
            } catch (e) { /* bez internetu — dociągniemy później */ }
        }));
    })());
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter((k) => k.startsWith('kalendarz-') && k !== CACHE).map((k) => caches.delete(k)));
        await self.clients.claim();
    })());
});

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);
    if (url.origin !== self.location.origin) return;           // serwer Google, czcionki itd. — bez zmian
    if (req.mode === 'navigate') {
        // Strona: zawsze najpierw sieć (najnowsza wersja), a bez internetu — ostatnia zapisana.
        event.respondWith((async () => {
            try {
                const res = await fetch(req);
                if (res.ok && !res.redirected) {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(HOME, copy));
                }
                return res;
            } catch (e) {
                return (await caches.match(HOME)) || Response.error();
            }
        })());
        return;
    }
    if (url.pathname.includes('/icons/') || url.pathname.endsWith('.webmanifest')) {
        event.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
    }
});

/* ─── powiadomienia ─── */

self.addEventListener('push', (event) => {
    event.waitUntil(onPush(event));
});

async function onPush(event) {
    let items = [];
    let again = null;                       // kolejka już pusta (inny push ją odebrał) — pokażemy ostatnie jeszcze raz, po cichu
    try { if (event.data) items = [event.data.json()]; } catch (e) { /* push bez treści */ }
    if (!items.length && API) {
        try {
            const sub = await self.registration.pushManager.getSubscription();
            const ctrl = new AbortController();
            const timer = setTimeout(() => ctrl.abort(), 20000);
            const res = await fetch(API, {
                method: 'POST',
                headers: { 'Content-Type': 'text/plain;charset=utf-8' },
                body: JSON.stringify({ action: 'pushPull', endpoint: sub ? sub.endpoint : '' }),
                signal: ctrl.signal
            });
            clearTimeout(timer);
            const json = await res.json();
            if (json && json.ok) {
                items = Array.isArray(json.items) ? json.items : json.n ? [json.n] : [];
                if (!items.length && json.last) again = json.last;
            }
        } catch (e) { /* serwer nie odpowiedział — pokażemy ogólne powiadomienie */ }
    }
    // otwarta aplikacja od razu się odświeża
    const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
    wins.forEach((w) => w.postMessage({ type: 'refresh' }));
    if (again) { await show(again, false); return; }
    if (!items.length) {
        items = [{ title: 'Kalendarz lekcji', body: 'Coś się zmieniło w lekcjach — stuknij, żeby zobaczyć.', url: HOME, tag: 'kal-ogolne' }];
    }
    await Promise.all(items.map((n) => show(n, true)));
}

function show(n, loud) {
    return self.registration.showNotification(n.title || 'Kalendarz lekcji', {
        body: n.body || '',
        tag: n.tag || 'kal-' + Date.now(),
        renotify: loud,
        silent: !loud,
        lang: 'pl',
        icon: 'icons/icon-192.png',
        badge: 'icons/badge-96.png',
        data: { url: n.url || HOME }
    });
}

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    const target = new URL((event.notification.data && event.notification.data.url) || HOME, self.registration.scope).href;
    event.waitUntil((async () => {
        const wins = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
        for (const w of wins) {
            if (w.url.startsWith(self.registration.scope)) {
                await w.focus();
                w.postMessage({ type: 'open', url: target });
                return;
            }
        }
        await self.clients.openWindow(target);
    })());
});
