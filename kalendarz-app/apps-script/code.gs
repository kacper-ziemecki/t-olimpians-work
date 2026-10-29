/**
 * ═══════════════════════════════════════════════════════════════════════
 *  T-Olimpians — Kalendarz lekcji · backend (Google Apps Script)
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  Źródłem prawdy jest Twój Kalendarz Google. Każda lekcja to zwykłe
 *  wydarzenie z ukrytymi metadanymi (extendedProperties.private: tol*),
 *  więc to, co przesuniesz / usuniesz w Kalendarzu Google, strona pokaże
 *  przy następnej synchronizacji (co ~20 s). Inne Twoje wydarzenia są
 *  pokazywane uczniom jako „Zajęte”, bez tytułu.
 *
 *  Wymaga usługi zaawansowanej „Google Calendar API” (identyfikator:
 *  Calendar). Instrukcja wdrożenia: INSTRUKCJA.md obok tego pliku.
 *
 *  W tym pliku NIE ma żadnych haseł — hasło panelu nauczyciela trzymasz
 *  we właściwości skryptu ADMIN_PASSWORD (Ustawienia projektu).
 * ═══════════════════════════════════════════════════════════════════════
 */

const CONFIG = {
  CALENDAR_ID: 'primary',              // 'primary' = główny kalendarz konta, z którego wdrożono skrypt
  TIMEZONE: 'Europe/Warsaw',
  APP_URL: 'https://t-olimpians.com/kalendarz-app/kalendarz.html',

  NOTIFY_EMAILS: ['t.olympians.poland@gmail.com'],   // gdzie idą powiadomienia o zmianach (puste = konto skryptu)
  NOTIFY_ON_ADMIN_ACTIONS: true,       // maile i powiadomienia na telefon także wtedy, gdy zmiany robisz sam w panelu
  SEND_STUDENT_EMAILS: true,           // potwierdzenia i powiadomienia dla uczniów

  DAY_START: '10:00',                  // domyślne godziny rezerwacji — dopóki nie ustawisz własnych
  DAY_END: '21:00',                    // w panelu nauczyciela („Godziny dostępności”)
  DURATIONS: [20, 45, 60],             // dostępne długości lekcji (minuty)
  SLOT_STEP_MIN: 5,                    // co ile minut może zaczynać się lekcja
  MIN_NOTICE_MIN: 30,                  // najpóźniej ile minut przed startem da się zarezerwować
  MAX_DAYS_AHEAD: 60,                  // jak daleko do przodu uczeń może zarezerwować (pierwszą) lekcję

  SERIES_WEEKS_OPTIONS: [4, 8, 12, 16, 0],   // opcje „co tydzień przez…”; 0 = do odwołania
  MAX_SERIES_WEEKS: 40,
  OPEN_SERIES_HORIZON_DAYS: 112,       // serie „do odwołania” są dopisywane na tyle dni do przodu (codziennie)

  PUBLIC_NAMES: 'short',               // jak inni widzą cudze lekcje: 'full' | 'short' (Jan K.) | 'hidden'
  ALL_DAY_BLOCKS: true,                // wydarzenia całodniowe blokują dzień (np. „Wyjazd”)
  EVENT_TITLE: 'Lekcja',
  BRAND: 'T-Olimpians',
  CACHE_SECONDS: 30,                   // tyle sekund backend pamięta gotowy tydzień (zmiany ze strony są widoczne od razu)

  PUSH_ENABLED: true,                  // powiadomienia na telefon (aplikacja zainstalowana z kalendarza)
  PUSH_SUBJECT: 'mailto:t.olympians.poland@gmail.com',

  // Płatności za lekcje. Przelew działa od razu; karta / BLIK / Google Pay — po dodaniu właściwości
  // skryptu STRIPE_SECRET_KEY (instrukcja w INSTRUKCJA.md). Cenę bierzemy z panelu nauczyciela.
  PAY_ACCOUNT: '36109016230000000151997290',
  PAY_RECIPIENT: 'T-Olimpians'         // nazwa odbiorcy przelewu (najlepiej imię i nazwisko właściciela konta)
};

const PALETTE = ['1', '2', '3', '4', '5', '6', '7', '9', '10', '11'];   // kolory wydarzeń Google (bez grafitowego)

/* ═══════════════════════════════════════════════════════════════════════
   WEJŚCIE
   ═══════════════════════════════════════════════════════════════════════ */

function doGet(e) {
  const p = (e && e.parameter) || {};
  try {
    if (p.action === 'busyWeek') return json_(legacyBusyWeek_(p.start));
    if (p.action === 'week') { maybeMaintenance_(); return json_(actionWeek_({ from: p.from || p.start, to: p.to })); }
    return json_({ ok: true, service: 'kalendarz-lekcji', api: 2 });
  } catch (err) {
    return json_(fail_(err));
  }
}

function doPost(e) {
  let body;
  try {
    body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
  } catch (err) {
    return json_({ ok: false, error: 'Nieprawidłowe dane zapytania.' });
  }
  try {
    const fn = ACTIONS[body.action];
    if (!fn) throw userError_('Nieznana akcja.');
    if (body.action === 'week') maybeMaintenance_();
    return json_(fn(body));
  } catch (err) {
    return json_(fail_(err));
  }
}

const ACTIONS = {
  week: actionWeek_,
  book: actionBook_,
  move: actionMove_,
  cancel: actionCancel_,
  sendLink: actionSendLink_,
  loginCode: actionLoginCode_,
  pushSubscribe: actionPushSubscribe_,
  pushUnsubscribe: actionPushUnsubscribe_,
  pushPull: actionPushPull_,
  pushTest: actionPushTest_,
  adminLogin: actionAdminLogin_,
  setAvailability: actionSetAvailability_,
  setPrice: actionSetPrice_,
  setDiscord: actionSetDiscord_,
  discordFeed: actionDiscordFeed_,
  payInfo: actionPayInfo_,
  payCard: actionPayCard_,
  payConfirm: actionPayConfirm_,
  setPaid: actionSetPaid_,
  busyWeek: (b) => legacyBusyWeek_(b.start)
};

/** Uruchom RAZ z edytora (▶ Uruchom → setup): nadaje uprawnienia, ustawia codzienne zadanie. */
function setup() {
  secret_();
  Logger.log('Konto skryptu (tu zapisują się lekcje): ' + Session.getEffectiveUser().getEmail());
  try {
    ScriptApp.getProjectTriggers()
      .filter((t) => t.getHandlerFunction() === 'dailyMaintenance')
      .forEach((t) => ScriptApp.deleteTrigger(t));
    ScriptApp.newTrigger('dailyMaintenance').timeBased().everyDays(1).atHour(3).create();
    Logger.log('Codzienne zadanie (3:00) ustawione.');
  } catch (e) {
    // bez wyzwalacza też działa: porządki robi pierwsze odświeżenie strony danego dnia
    Logger.log('UWAGA: nie udało się ustawić codziennego zadania (' + e.message + '). Uruchom setup ponownie po nadaniu uprawnień.');
  }
  Calendar.Events.list(CONFIG.CALENDAR_ID, { maxResults: 1 });
  Logger.log('Pozostały dzienny limit maili: ' + MailApp.getRemainingDailyQuota());
  Logger.log('Powiadomienia będą wysyłane na: ' + notifyTo_());
  Logger.log(props_().getProperty('ADMIN_PASSWORD')
    ? 'Hasło panelu nauczyciela jest ustawione.'
    : 'UWAGA: dodaj właściwość skryptu ADMIN_PASSWORD (Ustawienia projektu → Właściwości skryptu).');
  migrateOldBookings();
  Logger.log(stripeKey_()
    ? 'Płatności kartą / BLIK / Google Pay (Stripe) są włączone.'
    : 'Płatności kartą wyłączone — działa sam przelew (dodaj STRIPE_SECRET_KEY, żeby włączyć).');
  Logger.log(props_().getProperty('DISCORD_BOT_KEY')
    ? 'Bot Discord jest włączony (kolejka zmian działa).'
    : 'Bot Discord wyłączony — uruchom funkcję discordKey, żeby go włączyć.');
  if (CONFIG.PUSH_ENABLED) {
    Logger.log('Klucz powiadomień (VAPID): ' + vapidKeys_().pub.slice(0, 16) + '…');
    UrlFetchApp.getRequest('https://fcm.googleapis.com/');   // tylko po to, żeby Google poprosił o uprawnienie „połączenia zewnętrzne”
  }
}

/**
 * Zamienia rezerwacje ze starej wersji („Konsultacja indywidualna – Imię (T-Olimpians)”)
 * w lekcje nowego kalendarza: dostają imię, email, kolor i dają się przesuwać.
 * Uruchamia się w setup(); można ją też odpalić ręcznie — drugi raz niczego nie zdubluje.
 */
function migrateOldBookings() {
  const from = addDaysStr_(todayStr_(), -90);
  const to = addDaysStr_(todayStr_(), CONFIG.MAX_DAYS_AHEAD + 7);
  const items = listEvents_({
    timeMin: toDate_(from, '00:00').toISOString(),
    timeMax: toDate_(to, '00:00').toISOString(),
    q: 'Konsultacja indywidualna'
  });
  let done = 0;
  items.forEach((it) => {
    const p = (it.extendedProperties && it.extendedProperties.private) || {};
    if (p.tol || !it.start || !it.start.dateTime) return;
    const info = parseOldBooking_(it.summary, it.description);
    if (!info) return;
    const dur = Math.round((new Date(it.end.dateTime) - new Date(it.start.dateTime)) / 60000);
    info.seriesId = '';
    info.color = studentColor_(info.email, info.name);
    const priv = { tol: 'lesson', tolName: info.name };
    if (info.email) priv.tolEmail = info.email;
    if (info.phone) priv.tolPhone = info.phone;
    if (info.topic) priv.tolTopic = info.topic.slice(0, 600);
    journalUp_(Calendar.Events.patch({
      summary: title_(info.name, dur),
      description: calendarDescription_(info),
      colorId: info.color,
      extendedProperties: { private: priv }
    }, CONFIG.CALENDAR_ID, it.id, { sendUpdates: 'none' }));
    upsertStudent_(info.email, info.name, info.phone, info.color);
    done++;
  });
  if (done) bumpVersion_();
  Logger.log('Przeniesione stare rezerwacje: ' + done);
  return done;
}

function parseOldBooking_(summary, description) {
  const m = /^Konsultacja indywidualna\s*[–-]\s*(.+?)\s*\(T-Olimpians\)\s*$/.exec(String(summary || ''));
  if (!m) return null;
  const text = String(description || '')
    .replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&nbsp;/g, ' ');
  const line = (label) => { const r = new RegExp('^' + label + ':\\s*(.*)$', 'm').exec(text); return r ? r[1].trim() : ''; };
  const topic = /Temat \/ uwagi:\s*\n([\s\S]*)$/.exec(text);
  const email = line('Email').toLowerCase();
  return {
    name: clean_(line('Imię i nazwisko \\/ nick') || m[1], 80),
    email: isEmail_(email) ? email : '',
    phone: clean_(line('Telefon'), 30),
    topic: topic ? clean_(topic[1], 600, true) : ''
  };
}

/** Codziennie (wyzwalacz z setup): dopisuje kolejne tygodnie serii „do odwołania”, sprząta stare dane. */
function dailyMaintenance() {
  props_().setProperty('MAINT_DAY', todayStr_());
  extendOpenSeries_();
  dropOldSwaps_();
  cleanupCodes_();
  try { syncCardPayments_(); } catch (e) { console.error(e); }   // płatności, po których ktoś nie wrócił na stronę
}

/* ═══════════════════════════════════════════════════════════════════════
   AKCJE
   ═══════════════════════════════════════════════════════════════════════ */

function actionWeek_(body) {
  const ctx = auth_(body);
  let from = body.from;
  let to = body.to;
  if (!isDateStr_(from)) from = mondayOf_(todayStr_());
  if (!isDateStr_(to) || to <= from) to = addDaysStr_(from, 7);
  if (diffDays_(from, to) > 42) to = addDaysStr_(from, 42);

  // Goście (bez logowania) dostają tę samą odpowiedź — trzymamy ją gotową w pamięci podręcznej.
  const publicKey = ctx.role === 'public' && !ctx.tokenInvalid && !ctx.adminInvalid
    ? 'w3:' + version_() + ':' + from + ':' + to : null;
  const cache = CacheService.getScriptCache();
  if (publicKey) {
    const hit = cache.get(publicKey);
    if (hit) return JSON.parse(hit);
  }

  const out = {
    ok: true,
    role: ctx.role,
    version: version_(),
    from: from,
    to: to,
    now: localIso_(new Date()),
    config: publicConfig_(),
    events: rangeModels_(from, to).map((m) => viewOf_(m, ctx)).filter(Boolean)
  };
  if (ctx.tokenInvalid) out.tokenInvalid = true;
  if (ctx.adminInvalid) out.adminInvalid = true;
  if (ctx.email) out.me = meInfo_(ctx);
  if (ctx.role === 'admin') {
    out.students = listStudents_();
    out.notifyTo = notifyTo_();
  }
  if (publicKey) {
    try { cache.put(publicKey, JSON.stringify(out), CONFIG.CACHE_SECONDS); } catch (e) { /* za duże — trudno */ }
  }
  return out;
}

function actionBook_(body) {
  const ctx = auth_(body);
  const isAdmin = ctx.role === 'admin';
  const info = {
    name: clean_(body.name, 80),
    email: clean_(body.email, 120).toLowerCase(),
    phone: clean_(body.phone, 30),
    topic: clean_(body.topic, 600, true)
  };
  if (!info.name) throw userError_('Podaj imię i nazwisko lub nick.', 'NAME');
  if (!(isAdmin && !info.email) && !isEmail_(info.email)) throw userError_('Podaj prawidłowy adres email.', 'EMAIL');

  const dur = Number(body.duration) || 60;
  validateSlot_(body.date, body.time, dur, isAdmin);

  const rep = body.repeat || {};
  const weekly = !!rep.weekly;
  const weeks = weekly ? Math.floor(Number(rep.weeks) || 0) : 1;
  if (weekly && !(weeks === 0 || (weeks >= 2 && weeks <= CONFIG.MAX_SERIES_WEEKS))) {
    throw userError_('Nieprawidłowa liczba tygodni.', 'WEEKS');
  }
  const dates = seriesDates_(body.date, weeks);

  let after = null;
  const res = withLock_(() => {
    const slots = dates.map((d) => slot_(d, body.time, dur));
    const conflicts = findConflicts_(slots, []);
    const busyDates = conflicts.map((c) => c.slot.date);
    // limit godzin lekcji na dzień (ustawiany w panelu) — dni, które by go przekroczyły, traktujemy jak zajęte
    let limitMsg = '';
    if (!isAdmin && limitFor_(body.date) !== null) {
      const load = lessonLoad_(dates, []);
      slots.forEach((sl) => {
        if (busyDates.indexOf(sl.date) >= 0) return;
        if ((load[sl.date] || 0) + dur > limitFor_(sl.date)) {
          busyDates.push(sl.date);
          if (!limitMsg) limitMsg = limitMsg_(sl.date, load[sl.date] || 0);
        }
      });
      busyDates.sort();
    }
    if (busyDates.length && (!body.skipConflicts || busyDates.length === slots.length)) {
      if (slots.length === 1) {
        throw conflicts.length ? userError_('Ten termin jest już zajęty. Wybierz inny.', 'CONFLICT') : userError_(limitMsg, 'LIMIT');
      }
      throw userError_(
        busyDates.length === slots.length ? 'Wszystkie terminy z tej serii są zajęte albo przekraczają dzienny limit.' : 'Część terminów jest zajęta.',
        'CONFLICTS', { conflicts: busyDates, total: slots.length, limitNote: limitMsg });
    }
    const free = slots.filter((s) => busyDates.indexOf(s.date) < 0);

    info.color = studentColor_(info.email, info.name);
    info.seriesId = '';
    if (weekly) {
      info.seriesId = newId_('s');
      saveSeries_({
        id: info.seriesId, email: info.email, name: info.name, phone: info.phone, topic: info.topic, color: info.color,
        time: body.time, duration: dur, weekday: weekdayOf_(body.date), startDate: body.date,
        open: weeks === 0, endDate: weeks === 0 ? null : dates[dates.length - 1],
        generatedUntil: dates[dates.length - 1], created: new Date().toISOString()
      });
    }
    const created = free.map((s, i) => modelOf_(insertLesson_(s, info, i === 0)));
    const st = upsertStudent_(info.email, info.name, info.phone, info.color);
    discordQueue_(ctx, info.email, info.name, {
      type: 'booked', series: weekly, open: weekly && weeks === 0, count: created.length,
      lessons: created.slice(0, 8).map(discordLite_), skipped: busyDates
    });
    bumpVersion_();

    const out = {
      ok: true,
      created: created.map((m) => viewOf_(m, { role: 'student', email: info.email })),
      skipped: busyDates,
      seriesId: info.seriesId
    };
    if (info.email && !isAdmin && (st.isNew || ctx.email === info.email)) out.token = studentToken_(info.email);
    after = () => mailBooked_(info, created, busyDates, weekly ? weeks : 1, ctx);
    return out;
  });
  safeRun_(after);
  return res;
}

function actionMove_(body) {
  const ctx = auth_(body);
  const isAdmin = ctx.role === 'admin';
  const dur = Number(body.duration);
  validateSlot_(body.date, body.time, dur, isAdmin);

  let after = null;
  const res = withLock_(() => {
    const L = getLesson_(body.id);
    if (!L) throw goneError_();
    requireEdit_(ctx, L);
    const following = body.scope === 'following' && !!L.seriesId;
    const targets = following ? seriesEvents_(L.seriesId, dateOf_(L)) : [L];
    const delta = diffDays_(dateOf_(L), body.date);
    const plan = targets.map((t) => ({ m: t, slot: slot_(addDaysStr_(dateOf_(t), delta), body.time, dur) }));
    if (!following && L.s === body.date + 'T' + body.time && L.duration === dur) return { ok: true, moved: 0 };

    const conflicts = findConflicts_(plan.map((p) => p.slot), targets.map((t) => t.id));
    if (conflicts.length) {
      throw userError_(conflictMsg_(conflicts, plan.length), 'CONFLICT', { conflicts: conflicts.map((c) => c.slot.date) });
    }
    if (!isAdmin) {
      const over = overLimit_(plan.map((p) => ({ m: p.m, date: p.slot.date, dur: p.slot.dur })));
      if (over) throw userError_(limitMsg_(over.date, over.used), 'LIMIT', { conflicts: [over.date] });
    }
    plan.forEach((p) => patchLesson_(p.m, p.slot));
    if (following) {
      updateSeries_(L.seriesId, (s) => {
        s.time = body.time;
        s.duration = dur;
        s.weekday = weekdayOf_(body.date);
        if (s.generatedUntil) s.generatedUntil = addDaysStr_(s.generatedUntil, delta);
        if (s.endDate) s.endDate = addDaysStr_(s.endDate, delta);
      });
    }
    const to = plan[0].slot;
    discordQueue_(ctx, L.email, L.name, {
      type: 'moved', following: following, count: plan.length, from: discordLite_(L),
      to: { s: to.date + 'T' + to.time, e: localIso_(to.end), dur: to.dur }
    });
    bumpVersion_();
    after = () => mailMoved_(L, plan, ctx, following);
    return { ok: true, moved: plan.length };
  });
  safeRun_(after);
  return res;
}

function actionCancel_(body) {
  const ctx = auth_(body);
  let after = null;
  const res = withLock_(() => {
    const L = getLesson_(body.id);
    if (!L) throw goneError_();
    requireEdit_(ctx, L);
    const following = body.scope === 'following' && !!L.seriesId;
    const targets = following ? seriesEvents_(L.seriesId, dateOf_(L)) : [L];
    targets.forEach((t) => {
      Calendar.Events.remove(CONFIG.CALENDAR_ID, t.id, { sendUpdates: 'none' });
      journalDel_(t.id);
    });
    if (following) {
      updateSeries_(L.seriesId, (s) => { s.open = false; s.ended = true; s.endDate = addDaysStr_(dateOf_(L), -1); });
    }
    discordQueue_(ctx, L.email, L.name, { type: 'cancelled', following: following, count: targets.length, lesson: discordLite_(L) });
    bumpVersion_();
    after = () => mailCancelled_(L, targets, ctx, following);
    return { ok: true, cancelled: targets.length };
  });
  safeRun_(after);
  return res;
}

function actionSendLink_(body) {
  const email = clean_(body.email, 120).toLowerCase();
  if (!isEmail_(email)) throw userError_('Podaj prawidłowy adres email.', 'EMAIL');
  const cache = CacheService.getScriptCache();
  if (cache.get('sl:' + email)) return { ok: true };
  cache.put('sl:' + email, '1', 600);
  const st = getStudent_(email);
  if (st) {
    const code = String(parseInt(Utilities.getUuid().replace(/-/g, '').slice(0, 12), 16) % 900000 + 100000);
    props_().setProperties({
      ['tk_' + studentToken_(email)]: email,
      ['code_' + email]: JSON.stringify({ code: code, exp: Date.now() + 30 * 60000, tries: 0 })
    });
    const link = CONFIG.APP_URL + '?moje=' + studentToken_(email);
    sendMail_(email, '🔑 Kod ' + code + ' — Twój dostęp do kalendarza lekcji', 'Twój link i kod do kalendarza',
      'Cześć' + (st.name ? ' ' + firstName_(st.name) : '') + '! Otwórz kalendarz z linku poniżej — albo w aplikacji na telefonie wpisz kod.',
      [['Kod do aplikacji (ważny 30 min)', { html: '<span style="font-size:26px;letter-spacing:6px;font-weight:800;">' + code + '</span>' }]],
      [{ label: 'Otwórz moje lekcje', url: link }],
      'Link i kod dają dostęp do Twoich rezerwacji — nie przekazuj ich innym.');
  }
  return { ok: true };                                      // zawsze ta sama odpowiedź — nie zdradzamy, czy adres istnieje
}

function actionAdminLogin_(body) {
  const pw = props_().getProperty('ADMIN_PASSWORD');
  if (!pw) throw userError_('Hasło nauczyciela nie jest ustawione (właściwość skryptu ADMIN_PASSWORD).', 'SETUP');
  const cache = CacheService.getScriptCache();
  const fails = Number(cache.get('adm_fail') || 0);
  if (fails >= 8) throw userError_('Za dużo nieudanych prób. Spróbuj ponownie za 15 minut.', 'LOCKED');
  if (String(body.password || '') !== pw) {
    cache.put('adm_fail', String(fails + 1), 900);
    Utilities.sleep(700);
    throw userError_('Nieprawidłowe hasło.', 'BAD_PASSWORD');
  }
  return { ok: true, adminToken: adminToken_() };
}

/** Panel nauczyciela: godziny, w których uczniowie mogą rezerwować — osobno dla każdego dnia tygodnia. */
function actionSetAvailability_(body) {
  const ctx = auth_(body);
  if (ctx.role !== 'admin') throw userError_('Godziny dostępności może zmieniać tylko nauczyciel.', 'FORBIDDEN');
  const input = body.days && typeof body.days === 'object' ? body.days : null;
  if (!input) throw userError_('Brak godzin do zapisania.');
  const days = {};
  for (let d = 0; d < 7; d++) {
    const list = Array.isArray(input[d]) ? input[d] : [];
    if (list.length > 8) throw userError_('Za dużo przedziałów w jednym dniu (' + DAY_LONG[d] + ').');
    const ranges = list.map((r) => [String(r && r[0]), String(r && r[1])]);
    ranges.forEach((r) => {
      if (!isTimeStr_(r[0]) || !isTimeStr_(r[1])) throw userError_('Nieprawidłowa godzina (' + DAY_LONG[d] + ').');
      if (toMin_(r[0]) % CONFIG.SLOT_STEP_MIN || toMin_(r[1]) % CONFIG.SLOT_STEP_MIN) {
        throw userError_('Godziny muszą być wielokrotnością ' + CONFIG.SLOT_STEP_MIN + ' minut (' + DAY_LONG[d] + ').');
      }
      if (toMin_(r[0]) >= toMin_(r[1])) throw userError_('Początek musi być przed końcem (' + DAY_LONG[d] + ' ' + r[0] + '–' + r[1] + ').');
    });
    ranges.sort((x, y) => toMin_(x[0]) - toMin_(y[0]));
    for (let i = 1; i < ranges.length; i++) {
      if (toMin_(ranges[i][0]) < toMin_(ranges[i - 1][1])) throw userError_('Przedziały nachodzą na siebie (' + DAY_LONG[d] + ').');
    }
    days[d] = ranges;
  }
  // limity: minuty lekcji na dzień (null = bez limitu); starsza strona nie wysyła limitów — wtedy zostają dotychczasowe
  const limitsIn = body.limits && typeof body.limits === 'object' ? body.limits : (availability_().limits || {});
  const limits = {};
  for (let d = 0; d < 7; d++) {
    const v = limitsIn[d];
    if (v === null || v === undefined || v === '' || Number(v) === 0) { limits[d] = null; continue; }
    const n = Math.round(Number(v));
    if (!(n >= 5 && n <= 1440) || n % 5) throw userError_('Nieprawidłowy limit godzin (' + DAY_LONG[d] + ').');
    limits[d] = n;
  }
  props_().setProperty('AVAIL', JSON.stringify({ days: days, limits: limits, updated: new Date().toISOString() }));
  availMemo_ = null;
  bumpVersion_();
  return { ok: true, availability: days, limits: limits };
}

/** Panel nauczyciela: cena za lekcję dla ucznia (zł; null = nie ustawiona). Widzi ją tylko nauczyciel. */
function actionSetPrice_(body) {
  const ctx = auth_(body);
  if (ctx.role !== 'admin') throw userError_('Ceny może zmieniać tylko nauczyciel.', 'FORBIDDEN');
  const email = clean_(body.email, 120).toLowerCase();
  const v = body.price;
  let price = null;
  if (v !== null && v !== undefined && v !== '') {
    price = Math.round(Number(v) * 100) / 100;
    if (!(price >= 0 && price <= 100000)) throw userError_('Nieprawidłowa cena.', 'PRICE');
  }
  return withLock_(() => {
    const cur = getStudent_(email);
    if (!cur) throw userError_('Nie znaleziono ucznia.', 'NOT_FOUND');
    if (price === null) delete cur.price; else cur.price = price;
    props_().setProperty('stu_' + email, JSON.stringify(cur));
    return { ok: true, email: email, price: price };
  });
}

/** Panel nauczyciela: nick ucznia na Discordzie (bot T-Olimpians wysyła mu przypomnienia na jego kanał). */
function actionSetDiscord_(body) {
  const ctx = auth_(body);
  if (ctx.role !== 'admin') throw userError_('Nick na Discordzie może zmieniać tylko nauczyciel.', 'FORBIDDEN');
  const email = clean_(body.email, 120).toLowerCase();
  const discord = clean_(body.discord, 64).replace(/^@+/, '').trim();
  return withLock_(() => {
    const cur = getStudent_(email);
    if (!cur) throw userError_('Nie znaleziono ucznia.', 'NOT_FOUND');
    if (discord) cur.discord = discord; else delete cur.discord;
    props_().setProperty('stu_' + email, JSON.stringify(cur));
    return { ok: true, email: email, discord: discord };
  });
}

/* ─── płatności za lekcje ───
   Zapłacić może każdy, kto kliknie lekcję w kalendarzu (np. rodzic). Kwota = cena ucznia z panelu.
   Przelew: numer konta + tytuł (uczeń, data, godzina) + kod QR dla aplikacji banku — nauczyciel
   oznacza lekcję jako opłaconą po zaksięgowaniu. Karta / BLIK / Google Pay: Stripe Checkout,
   lekcja oznacza się sama po powrocie ze Stripe (a gdyby ktoś nie wrócił — przy codziennych porządkach). */

function actionPayInfo_(body) {
  const ctx = auth_(body);
  const m = getLesson_(body.id);
  if (!m) throw goneError_();
  const price = priceFor_(m);
  const name = payerName_(m, ctx);
  return {
    ok: true, id: m.id, s: m.s, e: m.e, duration: m.duration, name: name,
    title: payTitle_(name, m), price: price, paid: !!m.paid,
    account: CONFIG.PAY_ACCOUNT, recipient: CONFIG.PAY_RECIPIENT,
    card: !!stripeKey_() && price !== null && price >= 2
  };
}

function actionPayCard_(body) {
  const ctx = auth_(body);
  if (!stripeKey_()) throw userError_('Płatność kartą nie jest jeszcze włączona — zapłać przelewem.', 'NO_CARD');
  const m = getLesson_(body.id);
  if (!m) throw goneError_();
  if (m.paid) throw userError_('Ta lekcja jest już opłacona.', 'PAID');
  const price = priceFor_(m);
  if (price === null || price < 2) throw userError_('Nauczyciel nie ustawił jeszcze ceny tej lekcji.', 'NO_PRICE');
  const back = CONFIG.APP_URL + '?data=' + dateOf_(m);
  const session = stripe_('post', 'checkout/sessions', {
    mode: 'payment',
    locale: 'pl',
    'line_items[0][quantity]': 1,
    'line_items[0][price_data][currency]': 'pln',
    'line_items[0][price_data][unit_amount]': Math.round(price * 100),
    'line_items[0][price_data][product_data][name]': 'Lekcja: ' + payTitle_(payerName_(m, ctx), m),
    'payment_intent_data[description]': payTitle_(m.name, m),          // pełne imię widzi tylko nauczyciel w panelu Stripe
    'metadata[lessonId]': m.id,
    client_reference_id: m.id,
    success_url: back + '&platnosc={CHECKOUT_SESSION_ID}',
    cancel_url: back
  });
  return { ok: true, url: session.url };
}

/** Powrót ze Stripe: sprawdzamy płatność u operatora (nie ufamy stronie) i oznaczamy lekcję. */
function actionPayConfirm_(body) {
  const sid = String(body.session || '');
  if (!/^cs_[A-Za-z0-9_]{8,200}$/.test(sid)) throw userError_('Nieprawidłowy identyfikator płatności.');
  const s = stripe_('get', 'checkout/sessions/' + sid);
  const paid = s.payment_status === 'paid';
  let m = null;
  if (paid) m = withLock_(() => recordCardPayment_(s));
  return {
    ok: true, paid: paid, status: s.status,
    lesson: m ? { id: m.id, s: m.s, e: m.e, duration: m.duration } : null,
    amount: typeof s.amount_total === 'number' ? s.amount_total / 100 : null
  };
}

/** Panel nauczyciela: ręczne oznaczenie lekcji jako opłaconej (przelew, gotówka) albo cofnięcie. */
function actionSetPaid_(body) {
  const ctx = auth_(body);
  if (ctx.role !== 'admin') throw userError_('Status płatności może zmieniać tylko nauczyciel.', 'FORBIDDEN');
  return withLock_(() => {
    const it = lessonEvent_(body.id);
    if (!it) throw goneError_();
    patchPaid_(it, body.paid ? 'manual' : '', '');
    return { ok: true, id: it.id, paid: !!body.paid };
  });
}

function priceFor_(m) {
  const st = getStudent_(m.email);
  return st && typeof st.price === 'number' ? st.price : null;
}

/** W tytule przelewu imię takie, jakie oglądający widzi w kalendarzu (inni widzą np. „Jan K.”). */
function payerName_(m, ctx) {
  if (ctx.role === 'admin' || (ctx.email && ctx.email === m.email)) return m.name;
  const n = publicName_(m.name);
  return n === 'Zajęte' ? '' : n;
}

/** „Jan Kowalski 24.10.2026 17:00” */
function payTitle_(name, m) {
  const p = ymd_(dateOf_(m));
  return (name ? name + ' ' : '') + pad_(p[2]) + '.' + pad_(p[1]) + '.' + p[0] + ' ' + m.s.slice(11, 16);
}

function lessonEvent_(id) {
  if (!id || typeof id !== 'string' || id.charAt(0) === 'x') return null;
  try {
    const it = Calendar.Events.get(CONFIG.CALENDAR_ID, id);
    const m = modelOf_(it);
    return m && m.kind === 'lesson' ? it : null;
  } catch (e) {
    return null;
  }
}

/** how: 'card' | 'manual' | '' (nieopłacona). Zapisujemy w ukrytych polach wydarzenia — przesunięcie lekcji ich nie gubi. */
function patchPaid_(it, how, ref) {
  const priv = Object.assign({}, it.extendedProperties.private, { tolPaid: how, tolPaidRef: ref || '' });
  const m = modelOf_(journalUp_(Calendar.Events.patch({ extendedProperties: { private: priv } }, CONFIG.CALENDAR_ID, it.id, { sendUpdates: 'none' })));
  bumpVersion_();
  return m;
}

function recordCardPayment_(s) {
  const it = lessonEvent_(s.metadata && s.metadata.lessonId);
  if (!it) return null;                                                // lekcję w międzyczasie odwołano — płatność zostaje w Stripe
  const p = it.extendedProperties.private;
  if (p.tolPaidRef === s.id) return modelOf_(it);                      // już zapisane wcześniej
  const m = patchPaid_(it, 'card', s.id);
  safeRun_(() => mailPaid_(m, s));
  return m;
}

/** Codziennie: płatności z ostatnich 3 dni, po których ktoś zamknął kartę zamiast wrócić na stronę. */
function syncCardPayments_() {
  if (!stripeKey_()) return;
  const list = stripe_('get', 'checkout/sessions', {
    limit: 100, status: 'complete', 'created[gte]': Math.floor(Date.now() / 1000) - 3 * 86400
  });
  (list.data || []).forEach((s) => {
    if (s.payment_status === 'paid' && s.metadata && s.metadata.lessonId) {
      try { recordCardPayment_(s); } catch (e) { console.error(e); }
    }
  });
}

function stripeKey_() { return props_().getProperty('STRIPE_SECRET_KEY') || ''; }

function stripe_(method, path, params) {
  const key = stripeKey_();
  if (!key) throw userError_('Płatność kartą nie jest jeszcze włączona — zapłać przelewem.', 'NO_CARD');
  const qs = Object.keys(params || {}).map((k) => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&');
  const opts = { method: method, headers: { Authorization: 'Bearer ' + key }, muteHttpExceptions: true };
  let url = 'https://api.stripe.com/v1/' + path;
  if (method === 'get') { if (qs) url += '?' + qs; } else { opts.contentType = 'application/x-www-form-urlencoded'; opts.payload = qs; }
  const res = UrlFetchApp.fetch(url, opts);
  let json = {};
  try { json = JSON.parse(res.getContentText() || '{}'); } catch (e) { /* zostaje pusty */ }
  if (res.getResponseCode() >= 300) {
    console.error('Stripe ' + path + ': ' + res.getContentText());
    throw userError_('Operator płatności odrzucił zapytanie' + (json.error && json.error.message ? ': ' + json.error.message : '.'), 'STRIPE');
  }
  return json;
}

function mailPaid_(m, s) {
  const amount = (s.amount_total / 100).toFixed(2).replace('.', ',') + ' zł';
  const when = whenOf_(m);
  const rows = [['Uczeń', m.name], ['Lekcja', when], ['Kwota', amount], ['Metoda', 'karta / BLIK / Google Pay (Stripe)']];
  if (s.customer_details && s.customer_details.email) rows.push(['Płacący', s.customer_details.email]);
  sendMail_(notifyTo_(), '💳 Opłacona lekcja: ' + m.name + ' — ' + when, 'Lekcja opłacona',
    'Ktoś zapłacił za lekcję przez stronę. Lekcja jest już oznaczona w kalendarzu jako opłacona.', rows, [weekCta_(dateOf_(m))]);
  pushTeacher_({ role: 'public' }, { title: '💳 Opłacona lekcja: ' + m.name, body: when + ' · ' + amount, url: weekUrl_(dateOf_(m)), tag: 'paid-' + m.id });
}

/** Zgodność ze starą wersją strony: zajęte pełne godziny w tygodniu. */
function legacyBusyWeek_(start) {
  if (!isDateStr_(start)) start = mondayOf_(todayStr_());
  const models = rangeModels_(start, addDaysStr_(start, 7));
  const h0 = Math.floor(toMin_(CONFIG.DAY_START) / 60);
  const h1 = Math.ceil(toMin_(CONFIG.DAY_END) / 60);
  const days = {};
  for (let i = 0; i < 7; i++) {
    const d = addDaysStr_(start, i);
    const busy = [];
    for (let h = h0; h < h1; h++) {
      const a = toDate_(d, pad_(h) + ':00');
      const b = new Date(a.getTime() + 3600000);
      const taken = models.some((m) => { const r = blockRange_(m); return r && r.start < b && a < r.end; });
      if (taken || !fitsAvailability_(d, pad_(h) + ':00', 60)) busy.push(pad_(h) + ':00');
    }
    days[d] = busy;
  }
  return { ok: true, days: days };
}

/* ═══════════════════════════════════════════════════════════════════════
   UPRAWNIENIA I TOKENY
   ═══════════════════════════════════════════════════════════════════════ */

function auth_(body) {
  // dev = urządzenie (subskrypcja push), z którego przyszła zmiana — ono nie dostaje powiadomienia o niej
  const ctx = { role: 'public', email: '', name: '', dev: typeof body.dev === 'string' ? body.dev.slice(0, 40) : '' };
  if (body.adminToken) {
    const at = adminToken_();
    if (at && body.adminToken === at) ctx.role = 'admin';
    else ctx.adminInvalid = true;
  }
  if (body.token) {
    const email = props_().getProperty('tk_' + body.token);
    if (email && studentToken_(email) === body.token) {
      if (ctx.role !== 'admin') ctx.role = 'student';
      ctx.email = email;
      const st = getStudent_(email);
      ctx.name = st ? st.name : '';
    } else {
      ctx.tokenInvalid = true;
    }
  }
  return ctx;
}

function requireEdit_(ctx, L) {
  if (ctx.role === 'admin') return;
  if (ctx.role !== 'student' || !L.email || L.email !== ctx.email) {
    throw userError_('Możesz zmieniać tylko swoje lekcje.', 'FORBIDDEN');
  }
  if (parseLocal_(L.s) < new Date()) throw userError_('Ta lekcja już się odbyła lub właśnie trwa.', 'PAST');
}

let secretMemo_ = null;
function secret_() {
  if (secretMemo_) return secretMemo_;
  const p = props_();
  let s = p.getProperty('SECRET');
  if (!s) {
    s = Utilities.getUuid() + Utilities.getUuid();
    p.setProperty('SECRET', s);
  }
  secretMemo_ = s;
  return s;
}

function hmac_(text, len) {
  const raw = Utilities.computeHmacSha256Signature(String(text), secret_());
  return Utilities.base64EncodeWebSafe(raw).replace(/=+$/, '').slice(0, len || 24);
}

function studentToken_(email) { return 'u' + hmac_('student|' + email, 26); }
function studentKey_(emailOrName) { return 'k' + hmac_('key|' + String(emailOrName || '').toLowerCase(), 10); }
function adminToken_() {
  const pw = props_().getProperty('ADMIN_PASSWORD');
  return pw ? 'a' + hmac_('admin|' + pw, 32) : null;
}

function colorFor_(emailOrName) {
  const s = String(emailOrName || '').toLowerCase();
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619) >>> 0; }
  return PALETTE[h % PALETTE.length];
}

/** Kolor ucznia: zapamiętany przy pierwszej rezerwacji; nowy uczeń dostaje najrzadziej używany kolor. */
function studentColor_(email, name) {
  if (!email) return colorFor_(name);
  const st = getStudent_(email);
  if (st && st.color) return st.color;
  const all = props_().getProperties();
  const used = {};
  PALETTE.forEach((c) => { used[c] = 0; });
  Object.keys(all).forEach((k) => {
    if (k.indexOf('stu_') !== 0 || k === 'stu_' + email) return;
    try { const c = JSON.parse(all[k]).color; if (c in used) used[c]++; } catch (e) { /* pomiń */ }
  });
  const start = PALETTE.indexOf(colorFor_(email));
  let best = null;
  for (let i = 0; i < PALETTE.length; i++) {
    const c = PALETTE[(start + i) % PALETTE.length];
    if (best === null || used[c] < used[best]) best = c;
  }
  return best;
}
function knownColor_(email, name) {
  const st = email ? getStudent_(email) : null;
  return (st && st.color) || colorFor_(email || name);
}

/* ═══════════════════════════════════════════════════════════════════════
   KALENDARZ
   ═══════════════════════════════════════════════════════════════════════ */

function listEvents_(params) {
  const out = [];
  let pageToken = null;
  let guard = 0;
  do {
    const args = { singleEvents: true, orderBy: 'startTime', maxResults: 2500, timeZone: CONFIG.TIMEZONE };
    Object.keys(params).forEach((k) => { args[k] = params[k]; });
    if (pageToken) args.pageToken = pageToken;
    const res = Calendar.Events.list(CONFIG.CALENDAR_ID, args);
    (res.items || []).forEach((it) => out.push(it));
    pageToken = res.nextPageToken;
  } while (pageToken && ++guard < 20);
  return out;
}

/** Wydarzenie z API → wewnętrzny model (albo null, jeśli nie blokuje czasu). */
function modelOf_(it) {
  if (!it || it.status === 'cancelled' || !it.start) return null;
  const p = (it.extendedProperties && it.extendedProperties.private) || {};
  const isLesson = p.tol === 'lesson';
  if (!isLesson) {
    const type = it.eventType || 'default';
    if (type === 'workingLocation' || type === 'birthday') return null;
    if (it.transparency === 'transparent') return null;               // „Dostępny” w Kalendarzu Google
    if ((it.attendees || []).some((a) => a.self && a.responseStatus === 'declined')) return null;
  }
  const m = { id: it.id, color: it.colorId || null };
  if (it.start.date) {
    m.allDay = true;
    m.s = it.start.date;
    m.e = it.end && it.end.date > it.start.date ? it.end.date : addDaysStr_(it.start.date, 1);
  } else {
    const s = new Date(it.start.dateTime);
    const e = new Date(it.end.dateTime);
    m.allDay = false;
    m.s = localIso_(s);
    m.e = localIso_(e);
    m.duration = Math.round((e.getTime() - s.getTime()) / 60000);
  }
  if (isLesson) {
    m.kind = 'lesson';
    m.name = p.tolName || it.summary || '';
    m.email = (p.tolEmail || '').toLowerCase();
    m.phone = p.tolPhone || '';
    m.topic = p.tolTopic || '';
    m.seriesId = p.tolSeries || '';
    m.paid = p.tolPaid || '';                                            // '' | 'card' | 'manual'
  } else {
    m.kind = 'busy';
    m.title = it.summary || '(bez tytułu)';
  }
  return m;
}

function rangeModels_(from, to) {
  const key = 'r2:' + version_() + ':' + from + ':' + to;
  const cache = CacheService.getScriptCache();
  const got = cache.getAll([key, JOURNAL_KEY]);
  journalMemo_ = parseJournal_(got[JOURNAL_KEY]);
  if (got[key]) return applyJournal_(JSON.parse(got[key]), from, to);
  const models = applyJournal_(listEvents_({
    timeMin: toDate_(from, '00:00').toISOString(),
    timeMax: toDate_(to, '00:00').toISOString()
  }).map(modelOf_).filter(Boolean), from, to);
  try { cache.put(key, JSON.stringify(models), CONFIG.CACHE_SECONDS); } catch (e) { /* za duże do cache — trudno */ }
  return models;
}

/* ─── dziennik ostatnich zmian ───
   Kalendarz Google tuż po zapisie potrafi jeszcze przez chwilę zwracać starą listę wydarzeń.
   Dlatego każdą zmianę zrobioną przez stronę zapisujemy na kilka minut w pamięci podręcznej
   i nakładamy na wyniki odczytu — nowa lekcja jest widoczna od razu (i od razu blokuje termin). */
const JOURNAL_KEY = 'journal2';
const JOURNAL_TTL = 300;
let journalMemo_ = null;
let journalBuf_ = [];
function parseJournal_(raw) {
  try { return raw ? JSON.parse(raw) : []; } catch (e) { return []; }
}
function journal_() {
  if (journalMemo_ === null) journalMemo_ = parseJournal_(CacheService.getScriptCache().get(JOURNAL_KEY));
  const now = Date.now();
  return journalMemo_.concat(journalBuf_).filter((j) => now - j.at < JOURNAL_TTL * 1000);
}
function journalUp_(ev) {
  const m = modelOf_(ev);
  if (m) journalBuf_.push({ op: 'up', id: m.id, model: m, at: Date.now() });
  return ev;
}
function journalDel_(id) { journalBuf_.push({ op: 'del', id: id, at: Date.now() }); }
function journalFlush_() {
  if (!journalBuf_.length) return;
  const cache = CacheService.getScriptCache();
  const now = Date.now();
  const list = parseJournal_(cache.get(JOURNAL_KEY)).concat(journalBuf_).filter((j) => now - j.at < JOURNAL_TTL * 1000);
  while (list.length > 150) list.shift();
  try { cache.put(JOURNAL_KEY, JSON.stringify(list), JOURNAL_TTL); } catch (e) { /* trudno */ }
  journalMemo_ = list;
  journalBuf_ = [];
}
/** Nakłada ostatnie zmiany na listę wydarzeń z zakresu [from, to) (daty 'YYYY-MM-DD' albo pełne ISO). */
function applyJournal_(models, from, to, keep) {
  const list = journal_();
  if (!list.length) return models;
  const byId = {};
  models.forEach((m) => { byId[m.id] = m; });
  list.forEach((j) => {
    if (j.op === 'del' || !j.model) { delete byId[j.id]; return; }
    const m = j.model;
    const inRange = m.s < to && m.e > from;
    if (inRange && (!keep || keep(m))) byId[j.id] = m; else delete byId[j.id];
  });
  return Object.keys(byId).map((k) => byId[k]).sort((a, b) => (a.s < b.s ? -1 : a.s > b.s ? 1 : 0));
}

function getLesson_(id) {
  if (!id || typeof id !== 'string' || id.charAt(0) === 'x') return null;
  try {
    const m = modelOf_(Calendar.Events.get(CONFIG.CALENDAR_ID, id));
    return m && m.kind === 'lesson' ? m : null;
  } catch (e) {
    return null;
  }
}

function seriesEvents_(seriesId, fromDate) {
  const until = addDaysStr_(fromDate, 400);
  const keep = (m) => m && m.kind === 'lesson' && m.seriesId === seriesId && dateOf_(m) >= fromDate;
  return applyJournal_(listEvents_({
    timeMin: toDate_(fromDate, '00:00').toISOString(),
    timeMax: toDate_(until, '00:00').toISOString(),
    privateExtendedProperty: 'tolSeries=' + seriesId
  }).map(modelOf_).filter(keep), fromDate, until, keep);
}

function insertLesson_(slot, info, invite) {
  const priv = { tol: 'lesson', tolName: info.name };
  if (info.email) priv.tolEmail = info.email;
  if (info.phone) priv.tolPhone = info.phone;
  if (info.topic) priv.tolTopic = info.topic;
  if (info.seriesId) priv.tolSeries = info.seriesId;
  const ev = {
    summary: title_(info.name, slot.dur),
    description: calendarDescription_(info),
    start: { dateTime: rfcLocal_(slot.start), timeZone: CONFIG.TIMEZONE },
    end: { dateTime: rfcLocal_(slot.end), timeZone: CONFIG.TIMEZONE },
    colorId: info.color || knownColor_(info.email, info.name),
    extendedProperties: { private: priv }
  };
  if (info.email) ev.attendees = [{ email: info.email, displayName: info.name }];
  return journalUp_(Calendar.Events.insert(ev, CONFIG.CALENDAR_ID, { sendUpdates: invite && info.email ? 'all' : 'none' }));
}

function patchLesson_(m, slot) {
  const patch = {
    start: { dateTime: rfcLocal_(slot.start), timeZone: CONFIG.TIMEZONE },
    end: { dateTime: rfcLocal_(slot.end), timeZone: CONFIG.TIMEZONE }
  };
  if (slot.dur !== m.duration) patch.summary = title_(m.name, slot.dur);
  journalUp_(Calendar.Events.patch(patch, CONFIG.CALENDAR_ID, m.id, { sendUpdates: 'none' }));
}

function title_(name, dur) { return CONFIG.EVENT_TITLE + ': ' + name + ' (' + dur + ' min)'; }

function calendarDescription_(info) {
  const lines = ['Uczeń: ' + info.name];
  if (info.email) lines.push('Email: ' + info.email);
  if (info.phone) lines.push('Telefon: ' + info.phone);
  if (info.topic) lines.push('Temat: ' + info.topic);
  if (info.seriesId) lines.push('Lekcja cykliczna (co tydzień)');
  lines.push('', 'Zarządzanie lekcjami: ' + CONFIG.APP_URL);
  return lines.join('\n');
}

function slot_(date, time, dur) {
  const start = toDate_(date, time);
  return { date: date, time: time, dur: dur, start: start, end: new Date(start.getTime() + dur * 60000) };
}

function blockRange_(m) {
  if (m.allDay) return CONFIG.ALL_DAY_BLOCKS ? { start: toDate_(m.s, '00:00'), end: toDate_(m.e, '00:00') } : null;
  return { start: parseLocal_(m.s), end: parseLocal_(m.e) };
}

/** Które z proponowanych terminów kolidują z czymś w kalendarzu (poza excludeIds)? */
function findConflicts_(slots, excludeIds) {
  if (!slots.length) return [];
  const min = new Date(Math.min.apply(null, slots.map((s) => s.start.getTime())));
  const max = new Date(Math.max.apply(null, slots.map((s) => s.end.getTime())));
  const blockers = applyJournal_(listEvents_({ timeMin: min.toISOString(), timeMax: max.toISOString() })
    .map(modelOf_).filter(Boolean), localIso_(min), localIso_(max))
    .filter((m) => excludeIds.indexOf(m.id) < 0)
    .map((m) => { const r = blockRange_(m); return r ? { m: m, start: r.start, end: r.end } : null; })
    .filter(Boolean);
  const out = [];
  slots.forEach((s) => {
    const hit = blockers.filter((b) => b.start < s.end && s.start < b.end)[0];
    if (hit) out.push({ slot: s, with: hit.m });
  });
  return out;
}

function conflictMsg_(conflicts, total) {
  const list = conflicts.slice(0, 4).map((c) => plShort_(c.slot.date) + ' ' + c.slot.time).join(', ');
  const more = conflicts.length > 4 ? ' i ' + (conflicts.length - 4) + ' innych' : '';
  return total === 1 ? 'Ten termin jest już zajęty.' : 'Zajęte terminy: ' + list + more + '.';
}

function validateSlot_(date, time, dur, isAdmin) {
  if (!isDateStr_(date) || !isTimeStr_(time)) throw userError_('Nieprawidłowa data lub godzina.', 'INVALID');
  if (CONFIG.DURATIONS.indexOf(dur) < 0) throw userError_('Lekcja może trwać ' + CONFIG.DURATIONS.join(', ') + ' minut.', 'DURATION');
  if (isAdmin) return;
  const st = toMin_(time);
  if (st % CONFIG.SLOT_STEP_MIN) throw userError_('Godzina rozpoczęcia musi być wielokrotnością ' + CONFIG.SLOT_STEP_MIN + ' minut.', 'INVALID');
  if (!fitsAvailability_(date, time, dur)) {
    const ranges = rangesFor_(date);
    const when = cap_(DAY_PLURAL_W[weekdayOf_(date)]);
    throw userError_(ranges.length
      ? when + ' lekcje są dostępne w godz. ' + ranges.map((r) => r[0] + '–' + r[1]).join(', ') + '.'
      : when + ' nie ma terminów na lekcje.', 'HOURS');
  }
  if (toDate_(date, time).getTime() < Date.now() + CONFIG.MIN_NOTICE_MIN * 60000) {
    throw userError_('Ten termin już minął albo jest zbyt blisko (min. ' + CONFIG.MIN_NOTICE_MIN + ' min wcześniej).', 'PAST');
  }
  if (diffDays_(todayStr_(), date) > CONFIG.MAX_DAYS_AHEAD) {
    throw userError_('Można rezerwować najwyżej ' + CONFIG.MAX_DAYS_AHEAD + ' dni do przodu.', 'TOO_FAR');
  }
}

function seriesDates_(date, weeks) {
  const out = [date];
  if (weeks === 1) return out;
  const horizon = addDaysStr_(todayStr_(), CONFIG.OPEN_SERIES_HORIZON_DAYS);
  const n = weeks > 0 ? Math.min(weeks, CONFIG.MAX_SERIES_WEEKS) : CONFIG.MAX_SERIES_WEEKS;
  for (let k = 1; k < n; k++) {
    const d = addDaysStr_(date, 7 * k);
    if (weeks === 0 && d > horizon && out.length >= 4) break;
    out.push(d);
  }
  return out;
}

/** Zamiana lekcji między uczniami została wyłączona — usuwamy prośby, które zostały ze starszej wersji. */
function dropOldSwaps_() {
  const all = props_().getProperties();
  Object.keys(all).filter((k) => k.indexOf('swap_') === 0).forEach((k) => props_().deleteProperty(k));
}

/* ─── serie ─── */

function saveSeries_(s) { props_().setProperty('series_' + s.id, JSON.stringify(s)); }
function getSeries_(id) {
  if (!id) return null;
  const raw = props_().getProperty('series_' + id);
  return raw ? JSON.parse(raw) : null;
}
function updateSeries_(id, fn) {
  const s = getSeries_(id);
  if (!s) return;
  fn(s);
  saveSeries_(s);
}

function extendOpenSeries_() {
  const all = props_().getProperties();
  const horizon = addDaysStr_(todayStr_(), CONFIG.OPEN_SERIES_HORIZON_DAYS);
  const report = [];
  let created = 0;
  Object.keys(all).filter((k) => k.indexOf('series_') === 0).forEach((k) => {
    const s = JSON.parse(all[k]);
    if (!s.open || s.ended || !s.generatedUntil) return;
    const dates = [];
    for (let d = addDaysStr_(s.generatedUntil, 7); d <= horizon; d = addDaysStr_(d, 7)) dates.push(d);
    if (!dates.length) return;
    const slots = dates.map((d) => slot_(d, s.time, s.duration));
    const busy = findConflicts_(slots, []).map((c) => c.slot.date);
    slots.filter((x) => busy.indexOf(x.date) < 0).forEach((x) => {
      insertLesson_(x, { name: s.name, email: s.email, phone: s.phone, topic: s.topic, seriesId: s.id, color: s.color }, false);
      created++;
    });
    s.generatedUntil = dates[dates.length - 1];
    saveSeries_(s);
    if (busy.length) report.push(s.name + ' (' + DAY_LONG[s.weekday] + ' ' + s.time + '): ' + busy.map(plShort_).join(', '));
  });
  if (created) bumpVersion_();
  if (report.length) {
    sendMail_(notifyTo_(), '⚠️ Serie lekcji: pominięte zajęte terminy', 'Pominięte terminy w seriach',
      'Przy dopisywaniu kolejnych tygodni lekcji cyklicznych te terminy były już zajęte, więc je pominąłem:',
      report.map((r) => ['Seria', r]), [{ label: 'Otwórz kalendarz', url: CONFIG.APP_URL }]);
  }
}

function maybeMaintenance_() {
  const today = todayStr_();
  const cache = CacheService.getScriptCache();
  if (cache.get('maint') === today) return;
  const p = props_();
  if (p.getProperty('MAINT_DAY') !== today) {
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(100)) return;
    try {
      if (p.getProperty('MAINT_DAY') !== today) dailyMaintenance();
    } catch (e) {
      console.error(e);
    } finally {
      lock.releaseLock();
    }
  }
  cache.put('maint', today, 21600);
}

/* ─── uczniowie ─── */

function getStudent_(email) {
  if (!email) return null;
  const raw = props_().getProperty('stu_' + email);
  return raw ? JSON.parse(raw) : null;
}

function upsertStudent_(email, name, phone, color) {
  if (!email) return { isNew: false };
  const cur = getStudent_(email);
  const now = new Date().toISOString();
  const rec = {
    name: name || (cur && cur.name) || '',
    phone: phone || (cur && cur.phone) || '',
    color: (cur && cur.color) || color || '',
    first: (cur && cur.first) || now,
    last: now
  };
  if (cur && typeof cur.price === 'number') rec.price = cur.price;
  if (cur && cur.discord) rec.discord = cur.discord;
  props_().setProperties({
    ['stu_' + email]: JSON.stringify(rec),
    ['tk_' + studentToken_(email)]: email
  });
  return { isNew: !cur };
}

function listStudents_() {
  const all = props_().getProperties();
  return Object.keys(all).filter((k) => k.indexOf('stu_') === 0).map((k) => {
    const email = k.slice(4);
    const r = JSON.parse(all[k]);
    return { email: email, name: r.name, phone: r.phone, key: studentKey_(email), color: r.color || colorFor_(email),
      price: typeof r.price === 'number' ? r.price : null, discord: r.discord || '' };
  }).sort((a, b) => a.name.localeCompare(b.name, 'pl'));
}

function meInfo_(ctx) {
  const cache = CacheService.getScriptCache();
  const key = 'me2:' + version_() + ':' + ctx.email;
  const hit = cache.get(key);
  if (hit) return JSON.parse(hit);
  const now = new Date();
  const until = new Date(now.getTime() + 180 * 864e5);
  const keep = (m) => m && m.kind === 'lesson' && m.email === ctx.email;
  const upcoming = applyJournal_(listEvents_({
    timeMin: now.toISOString(),
    timeMax: until.toISOString(),
    privateExtendedProperty: 'tolEmail=' + ctx.email
  }).map(modelOf_).filter(keep), localIso_(now), localIso_(until), keep)
    .slice(0, 60).map((m) => viewOf_(m, ctx));
  const me = { email: ctx.email, name: ctx.name, upcoming: upcoming };
  try { cache.put(key, JSON.stringify(me), CONFIG.CACHE_SECONDS); } catch (e) { /* trudno */ }
  return me;
}

/* ─── co kto widzi ─── */

function viewOf_(m, ctx) {
  if (m.kind === 'lesson') {
    const who = m.email || m.name;
    const v = {
      id: m.id, kind: 'lesson', s: m.s, e: m.e, duration: m.duration,
      color: m.color || colorFor_(who), key: studentKey_(who), recurring: !!m.seriesId
    };
    if (m.paid) v.paid = true;
    const mine = !!(ctx.email && m.email && m.email === ctx.email);
    if (ctx.role === 'admin' || mine) {
      v.name = m.name;
      v.email = m.email;
      v.phone = m.phone;
      v.topic = m.topic;
      v.mine = mine;
      v.canEdit = true;
      if (ctx.role === 'admin' && m.paid) v.paidVia = m.paid;
    } else {
      v.name = publicName_(m.name);
    }
    return v;
  }
  if (ctx.role === 'admin') {
    return { id: m.id, kind: 'busy', allDay: !!m.allDay, s: m.s, e: m.e, duration: m.duration, title: m.title, color: m.color };
  }
  if (m.allDay) {
    return CONFIG.ALL_DAY_BLOCKS ? { id: 'x' + hmac_(m.id + m.s, 8), kind: 'busy', allDay: true, s: m.s, e: m.e, title: 'Niedostępny' } : null;
  }
  const c = clipToHours_(m);
  return c ? { id: 'x' + hmac_(m.id + m.s, 8), kind: 'busy', s: c.s, e: c.e, duration: c.duration, title: 'Zajęte' } : null;
}

/** Uczniowie widzą cudze wydarzenia tylko w godzinach, w których danego dnia są lekcje. */
function clipToHours_(m) {
  const d = m.s.slice(0, 10);
  if (m.e.slice(0, 10) !== d) return { s: m.s, e: m.e, duration: m.duration };
  const ranges = rangesFor_(d);
  if (!ranges.length) return null;
  const lo = Math.min.apply(null, ranges.map((r) => toMin_(r[0])));
  const hi = Math.max.apply(null, ranges.map((r) => toMin_(r[1])));
  const a = Math.max(toMin_(m.s.slice(11, 16)), lo);
  const b = Math.min(toMin_(m.e.slice(11, 16)), hi);
  if (b <= a) return null;
  return { s: d + 'T' + fromMin_(a), e: d + 'T' + fromMin_(b), duration: b - a };
}

function publicName_(name) {
  const n = String(name || '').trim();
  if (CONFIG.PUBLIC_NAMES === 'full') return n;
  if (CONFIG.PUBLIC_NAMES === 'hidden' || !n) return 'Zajęte';
  const parts = n.split(/\s+/);
  return parts.length > 1 ? parts[0] + ' ' + parts[parts.length - 1].charAt(0).toUpperCase() + '.' : parts[0];
}

function firstName_(name) { return String(name || '').trim().split(/\s+/)[0]; }

function publicConfig_() {
  return {
    dayStart: CONFIG.DAY_START,
    dayEnd: CONFIG.DAY_END,
    durations: CONFIG.DURATIONS,
    slotStep: CONFIG.SLOT_STEP_MIN,
    minNoticeMin: CONFIG.MIN_NOTICE_MIN,
    maxDaysAhead: CONFIG.MAX_DAYS_AHEAD,
    seriesWeeks: CONFIG.SERIES_WEEKS_OPTIONS,
    maxSeriesWeeks: CONFIG.MAX_SERIES_WEEKS,
    publicNames: CONFIG.PUBLIC_NAMES,
    allDayBlocks: CONFIG.ALL_DAY_BLOCKS,
    vapidPublicKey: CONFIG.PUSH_ENABLED ? vapidPublicSafe_() : null,
    availability: availability_().days,
    limits: availability_().limits || {},
    pay: { account: CONFIG.PAY_ACCOUNT, recipient: CONFIG.PAY_RECIPIENT, card: !!stripeKey_() }
  };
}

/* ─── godziny dostępności ─── */

let availMemo_ = null;
function availability_() {
  if (availMemo_) return availMemo_;
  let a = null;
  try { a = JSON.parse(props_().getProperty('AVAIL') || 'null'); } catch (e) { a = null; }
  if (!a || !a.days) {
    a = { days: {} };
    for (let d = 0; d < 7; d++) a.days[d] = [[CONFIG.DAY_START, CONFIG.DAY_END]];
  }
  availMemo_ = a;
  return a;
}
function rangesFor_(date) { return availability_().days[weekdayOf_(date)] || []; }
/** Limit minut lekcji w danym dniu (z panelu) albo null, gdy bez limitu. */
function limitFor_(date) {
  const v = (availability_().limits || {})[weekdayOf_(date)];
  return v ? Number(v) : null;
}
/** Suma minut lekcji w podanych dniach (bez lekcji o excludeIds). */
function lessonLoad_(dates, excludeIds) {
  const load = {};
  if (!dates.length) return load;
  const sorted = dates.slice().sort();
  rangeModels_(sorted[0], addDaysStr_(sorted[sorted.length - 1], 1)).forEach((m) => {
    if (m.kind !== 'lesson' || excludeIds.indexOf(m.id) >= 0) return;
    const d = dateOf_(m);
    load[d] = (load[d] || 0) + (m.duration || 0);
  });
  return load;
}
/** Czy przeniesienie lekcji (moves: {m, date, dur}) przekroczy limit któregoś dnia?
    Blokujemy tylko dni, w których suma rośnie ponad limit (dzień już przepełniony przez nauczyciela nie blokuje przesunięcia w obrębie dnia). */
function overLimit_(moves) {
  const after = {};
  const before = {};
  moves.forEach((x) => {
    after[x.date] = (after[x.date] || 0) + x.dur;
    const od = dateOf_(x.m);
    before[od] = (before[od] || 0) + x.m.duration;
  });
  const ds = Object.keys(after).filter((d) => limitFor_(d) !== null);
  if (!ds.length) return null;
  const load = lessonLoad_(ds, moves.map((x) => x.m.id));
  for (let i = 0; i < ds.length; i++) {
    const d = ds[i];
    const total = (load[d] || 0) + after[d];
    if (total > limitFor_(d) && total > (load[d] || 0) + (before[d] || 0)) return { date: d, used: load[d] || 0 };
  }
  return null;
}
function limitMsg_(date, used) {
  const lim = limitFor_(date);
  const left = Math.max(0, lim - used);
  return cap_(DAY_PLURAL_W[weekdayOf_(date)]) + ' można mieć najwyżej ' + hoursLabel_(lim) + ' lekcji dziennie — ' +
    (left ? 'w ' + plShort_(date) + ' zostało tylko ' + hoursLabel_(left) + '.' : plShort_(date) + ' jest już pełny.');
}
function hoursLabel_(min) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return h && m ? h + ' h ' + m + ' min' : h ? h + ' h' : m + ' min';
}
function fitsAvailability_(date, time, dur) {
  const a = toMin_(time);
  return rangesFor_(date).some((r) => toMin_(r[0]) <= a && a + dur <= toMin_(r[1]));
}

/* ═══════════════════════════════════════════════════════════════════════
   MAILE
   ═══════════════════════════════════════════════════════════════════════ */

function notifyTo_() {
  return CONFIG.NOTIFY_EMAILS && CONFIG.NOTIFY_EMAILS.length
    ? CONFIG.NOTIFY_EMAILS.join(',')
    : Session.getEffectiveUser().getEmail();
}

function actorLabel_(ctx) {
  if (ctx.role === 'admin') return 'nauczyciel (panel)';
  return 'uczeń przez stronę';
}

function teacherMail_(ctx, subject, title, intro, rows, ctas) {
  if (ctx.role === 'admin' && !CONFIG.NOTIFY_ON_ADMIN_ACTIONS) return;
  sendMail_(notifyTo_(), subject, title, intro, rows.concat([['Zmianę zrobił(a)', actorLabel_(ctx)]]), ctas);
}

function studentMail_(email, subject, title, intro, rows, ctas, note) {
  if (!CONFIG.SEND_STUDENT_EMAILS || !email) return;
  if (notifyTo_().split(',').indexOf(email) >= 0) return;          // nauczyciel dostaje już swoją wersję
  sendMail_(email, subject, title, intro, rows, ctas, note);
}

function manageCta_(email) {
  return { label: 'Moje lekcje — zarządzaj', url: CONFIG.APP_URL + '?moje=' + studentToken_(email) };
}
function weekCta_(date) {
  return { label: 'Otwórz kalendarz', url: CONFIG.APP_URL + '?data=' + date };
}

function mailBooked_(info, created, skipped, weeks, ctx) {
  if (!created.length) return;
  const first = created[0];
  const d = dateOf_(first);
  const t = first.s.slice(11, 16);
  const dur = first.duration;
  const series = weeks !== 1;
  const when = series
    ? 'co tydzień: ' + DAY_ACC[weekdayOf_(d)] + ', ' + t + ' (' + dur + ' min)'
    : plLong_(d) + ', ' + t + '–' + first.e.slice(11, 16) + ' (' + dur + ' min)';
  // same daty w jednej zawijanej linii (godzina jest w „Termin”) — na telefonie zamiast długiej kolumny
  const listHtml = { html: created.map((m) => '<span style="white-space:nowrap;">' + esc_(plShort_(dateOf_(m))) + '</span>').join(' · ') };
  const rows = [['Uczeń', info.name], ['Termin', when]];
  if (series) {
    rows.push(['Liczba lekcji', created.length + (weeks === 0 ? ' (do odwołania — kolejne dopisują się same)' : '')]);
    rows.push(['Daty', listHtml]);
  }
  if (skipped.length) rows.push(['Pominięte (zajęte)', skipped.map(plShort_).join(', ')]);
  const contact = [];
  if (info.email) contact.push(['Email', info.email]);
  if (info.phone) contact.push(['Telefon', info.phone]);
  if (info.topic) contact.push(['Temat', info.topic]);

  teacherMail_(ctx,
    (series ? '🔁 Nowa seria lekcji: ' : '🆕 Nowa lekcja: ') + info.name + ' — ' + (series ? DAY_SHORT[weekdayOf_(d)] + ' ' + t : plShort_(d) + ' ' + t) + ' (' + dur + ' min)',
    series ? 'Nowa seria lekcji' : 'Nowa lekcja',
    info.name + (series ? ' zarezerwował(a) lekcje cykliczne.' : ' zarezerwował(a) lekcję.'),
    rows.concat(contact), [weekCta_(d)]);

  if (info.email) {
    studentMail_(info.email,
      '✅ ' + (series ? 'Seria lekcji zarezerwowana — ' + DAY_SHORT[weekdayOf_(d)] + ' ' + t : 'Lekcja zarezerwowana — ' + plShort_(d) + ' ' + t),
      series ? 'Lekcje zarezerwowane!' : 'Lekcja zarezerwowana!',
      'Cześć ' + firstName_(info.name) + '! ' + (series ? 'Twoje lekcje cykliczne są zapisane.' : 'Twoja lekcja jest zapisana.') +
      ' Zaproszenie znajdziesz też w Kalendarzu Google.',
      rows.slice(1), [manageCta_(info.email)],
      'Z linku „Moje lekcje” możesz zmienić termin lekcji albo ją odwołać. Nie przekazuj go innym osobom.');
  }
  const pushWhen = (series ? DAY_SHORT[weekdayOf_(d)] + ' ' + t + ', co tydzień' : plShort_(d) + ' ' + t) + ' (' + dur + ' min)';
  pushTeacher_(ctx, { title: (series ? '🔁 Nowa seria: ' : '🆕 Nowa lekcja: ') + info.name, body: pushWhen, url: weekUrl_(d), tag: 'book-' + first.id });
  if (ctx.role === 'admin') pushStudent_(info.email, { title: '📅 Nowa lekcja w Twoim kalendarzu', body: pushWhen, url: weekUrl_(d), tag: 'book-' + first.id });
}

function mailMoved_(L, plan, ctx, following) {
  const first = plan[0];
  const oldWhen = plShort_(dateOf_(L)) + ' ' + L.s.slice(11, 16) + ' (' + L.duration + ' min)';
  const newWhen = plShort_(first.slot.date) + ' ' + first.slot.time + ' (' + first.slot.dur + ' min)';
  const more = following && plan.length > 1 ? ' + ' + (plan.length - 1) + ' kolejnych' : '';
  const rows = [['Uczeń', L.name], ['Było', oldWhen], ['Jest', newWhen + more]];
  if (following) rows.push(['Zakres', 'ta i wszystkie następne lekcje z serii']);
  teacherMail_(ctx, '✏️ Zmiana terminu: ' + L.name + ' — ' + oldWhen + ' → ' + newWhen + more,
    'Zmiana terminu lekcji', L.name + ' — lekcja ma nowy termin.', rows, [weekCta_(first.slot.date)]);
  studentMail_(L.email, '✏️ Nowy termin lekcji: ' + newWhen, 'Nowy termin lekcji',
    'Cześć ' + firstName_(L.name) + '! Termin Twojej lekcji został zmieniony.', rows.slice(1), [manageCta_(L.email)]);
  const n = { body: oldWhen + ' → ' + newWhen + more, url: weekUrl_(first.slot.date), tag: 'move-' + L.id };
  if (ctx.email !== L.email) pushStudent_(L.email, Object.assign({ title: '✏️ Zmiana terminu Twojej lekcji' }, n));
  pushTeacher_(ctx, Object.assign({ title: '✏️ ' + L.name + ' — zmiana terminu' }, n));
}

function mailCancelled_(L, targets, ctx, following) {
  const when = plShort_(dateOf_(L)) + ' ' + L.s.slice(11, 16) + ' (' + L.duration + ' min)';
  const rows = [['Uczeń', L.name], ['Termin', when]];
  if (following) rows.push(['Zakres', 'ta i wszystkie następne (' + targets.length + ' lekcji)']);
  teacherMail_(ctx, '❌ Odwołana lekcja: ' + L.name + ' — ' + when + (following ? ' i następne' : ''),
    following ? 'Odwołana seria lekcji' : 'Odwołana lekcja', L.name + ' — lekcja została odwołana.', rows, [weekCta_(dateOf_(L))]);
  studentMail_(L.email, '❌ Lekcja odwołana: ' + when, 'Lekcja odwołana',
    'Cześć ' + firstName_(L.name) + '! ' + (following ? 'Twoje lekcje (od tej daty) zostały odwołane.' : 'Twoja lekcja została odwołana.'),
    rows.slice(1), [manageCta_(L.email)]);
  const n = { body: when + (following ? ' i wszystkie następne' : ''), url: weekUrl_(dateOf_(L)), tag: 'cancel-' + L.id };
  if (ctx.email !== L.email) pushStudent_(L.email, Object.assign({ title: '❌ Twoja lekcja została odwołana' }, n));
  pushTeacher_(ctx, Object.assign({ title: '❌ ' + L.name + ' — odwołana lekcja' }, n));
}

function whenOf_(m) { return plShort_(dateOf_(m)) + ' ' + m.s.slice(11, 16) + ' (' + m.duration + ' min)'; }

function sendMail_(to, subject, title, intro, rows, ctas, note) {
  if (!to) return;
  try {
    MailApp.sendEmail({
      to: to,
      subject: subject,
      name: CONFIG.BRAND + ' · Kalendarz',
      htmlBody: emailHtml_(title, intro, rows || [], ctas || [], note),
      body: [title, '', intro, ''].concat((rows || []).map((r) => r[0] + ': ' + (r[1] && r[1].html ? r[1].html.replace(/<br>/g, ', ').replace(/<[^>]+>/g, '') : r[1])))
        .concat((ctas || []).map((c) => c.label + ': ' + c.url)).join('\n')
    });
  } catch (e) {
    console.error('Nie wysłano maila do ' + to + ': ' + e);
  }
}

// Ciemny styl strony, ale zbudowany pod telefony: płynna szerokość (bez stałych 560 px, które telefon
// pomniejszał), większy tekst, przyciski na całą szerokość, jednolite kolory zamiast gradientów
// (Gmail w trybie ciemnym ich nie odwraca i napisy stawały się nieczytelne), zawijanie długich adresów.
function emailHtml_(title, intro, rows, ctas, note) {
  const FONT = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;";
  const C = { page: '#0a0a0f', card: '#111118', head: '#16161f', box: '#1a1a25', line: '#262634', text: '#f0f0f8', soft: '#b4b4c8', muted: '#80809a', accent: '#60a5fa', btn: '#3b82f6' };
  const rowHtml = rows.map((r, i) => {
    const val = r[1] && r[1].html ? r[1].html : esc_(r[1]).replace(/\n/g, '<br>');
    return '<tr><td style="' + FONT + 'padding:' + (i ? '12px' : '0') + ' 0 12px;' + (i ? 'border-top:1px solid ' + C.line + ';' : '') + '">' +
      '<div style="' + FONT + 'font-size:11px;line-height:16px;letter-spacing:0.06em;text-transform:uppercase;color:' + C.muted + ';">' + esc_(r[0]) + '</div>' +
      '<div style="' + FONT + 'font-size:15px;line-height:22px;font-weight:600;color:' + C.text + ';padding-top:3px;word-break:break-word;overflow-wrap:anywhere;">' + val + '</div>' +
      '</td></tr>';
  }).join('');
  const ctaHtml = ctas.map((c) =>
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin-top:12px;"><tr>' +
    '<td align="center" bgcolor="' + C.btn + '" style="border-radius:12px;background-color:' + C.btn + ';">' +
    '<a href="' + esc_(c.url) + '" target="_blank" style="' + FONT + 'display:block;padding:15px 18px;font-size:16px;line-height:20px;font-weight:700;color:#ffffff;text-decoration:none;text-align:center;border-radius:12px;">' +
    esc_(c.label) + '</a></td></tr></table>').join('');
  return '<!DOCTYPE html><html lang="pl"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta name="color-scheme" content="dark light"><meta name="supported-color-schemes" content="dark light">' +
    '<title>' + esc_(title) + '</title>' +
    '<style>@media only screen and (max-width:600px){.pad{padding-left:18px!important;padding-right:18px!important}.outer{padding:10px 6px!important}.ttl{font-size:20px!important;line-height:26px!important}}</style>' +
    '</head><body style="margin:0;padding:0;background-color:' + C.page + ';-webkit-text-size-adjust:100%;" bgcolor="' + C.page + '">' +
    // podgląd w skrzynce (pierwsza linijka pod tematem)
    '<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">' + esc_(intro) + '</div>' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' + C.page + '" style="background-color:' + C.page + ';"><tr>' +
    '<td align="center" class="outer" style="padding:24px 12px;">' +
    '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' + C.card + '" style="width:100%;max-width:560px;background-color:' + C.card + ';border:1px solid ' + C.line + ';border-radius:16px;">' +
    // nagłówek
    '<tr><td class="pad" bgcolor="' + C.head + '" style="padding:22px 26px 18px;background-color:' + C.head + ';border-bottom:1px solid ' + C.line + ';border-radius:16px 16px 0 0;">' +
    '<div style="' + FONT + 'font-size:11px;line-height:16px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:' + C.accent + ';">' + esc_(CONFIG.BRAND) + ' · Kalendarz lekcji</div>' +
    '<div class="ttl" style="' + FONT + 'font-size:22px;line-height:28px;font-weight:800;color:' + C.text + ';padding-top:8px;">' + esc_(title) + '</div>' +
    '</td></tr>' +
    // treść
    '<tr><td class="pad" style="padding:20px 26px 6px;">' +
    '<div style="' + FONT + 'font-size:15px;line-height:23px;color:' + C.soft + ';padding-bottom:18px;">' + esc_(intro) + '</div>' +
    (rowHtml
      ? '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="' + C.box + '" style="background-color:' + C.box + ';border:1px solid ' + C.line + ';border-radius:12px;">' +
        '<tr><td style="padding:14px 16px 2px;"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">' + rowHtml + '</table></td></tr></table>'
      : '') +
    (ctaHtml ? '<div style="height:6px;line-height:6px;font-size:6px;">&nbsp;</div>' + ctaHtml : '') +
    (note ? '<div style="' + FONT + 'font-size:13px;line-height:19px;color:' + C.muted + ';text-align:center;padding-top:16px;">' + esc_(note) + '</div>' : '') +
    '</td></tr>' +
    // stopka
    '<tr><td class="pad" style="padding:16px 26px 22px;">' +
    '<div style="' + FONT + 'font-size:12px;line-height:18px;color:' + C.muted + ';text-align:center;border-top:1px solid ' + C.line + ';padding-top:16px;">T-Olimpians Team Poland 🇵🇱 — do zobaczenia na lekcji!</div>' +
    '</td></tr>' +
    '</table></td></tr></table></body></html>';
}

/* ═══════════════════════════════════════════════════════════════════════
   POWIADOMIENIA NA TELEFON (Web Push)
   ═══════════════════════════════════════════════════════════════════════
   Aplikacja (PWA) zapisuje „adres” swojego telefonu (subskrypcję). Gdy ktoś zmieni lekcje ucznia,
   dopisujemy powiadomienie do jego kolejki i budzimy telefon pustym pushem podpisanym kluczem VAPID.
   Service worker w telefonie pobiera wtedy treść (akcja pushPull) i pokazuje powiadomienie.
   Apps Script nie ma wbudowanego podpisu ECDSA P-256, więc liczymy go niżej (BigInt).        */

const PUSH_HOSTS = /^https:\/\/([a-z0-9-]+\.)*(fcm\.googleapis\.com|push\.services\.mozilla\.com|push\.apple\.com|notify\.windows\.com)\//i;
const PUSH_MAX_DEVICES = 5;

function vapidPublicSafe_() {
  try { return vapidKeys_().pub; } catch (e) { console.error('VAPID: ' + e); return null; }
}
function pushId_(endpoint) { return 'p' + hmac_('push|' + endpoint, 20); }
function weekUrl_(date) { return CONFIG.APP_URL + '?data=' + date; }

function actionPushSubscribe_(body) {
  const ctx = auth_(body);
  if (ctx.role === 'public') throw userError_('Powiadomienia włączysz po zalogowaniu (kod lub link „Moje lekcje” z maila).', 'AUTH');
  const endpoint = String((body.subscription && body.subscription.endpoint) || '');
  if (!PUSH_HOSTS.test(endpoint)) throw userError_('Ta przeglądarka używa nieobsługiwanej usługi powiadomień.', 'PUSH');
  const admin = ctx.role === 'admin';
  const vapidPublicKey = vapidKeys_().pub;          // poza blokadą (vapidKeys_ sam ją bierze przy pierwszym użyciu)
  return withLock_(() => {
    const id = pushId_(endpoint);
    const all = props_().getProperties();
    const mine = Object.keys(all).filter((k) => k.indexOf('push_') === 0).map((k) => JSON.parse(all[k]))
      .filter((x) => x.id !== id && (admin ? x.admin : !x.admin && x.email === ctx.email))
      .sort((a, b) => (a.created < b.created ? -1 : 1));
    while (mine.length >= PUSH_MAX_DEVICES) props_().deleteProperty('push_' + mine.shift().id);
    const prev = all['push_' + id] ? JSON.parse(all['push_' + id]) : null;
    const same = prev && prev.admin === admin && prev.email === (admin ? '' : ctx.email);
    props_().setProperty('push_' + id, JSON.stringify({
      id: id, endpoint: endpoint, email: admin ? '' : ctx.email, admin: admin,
      created: (prev && prev.created) || new Date().toISOString(),
      pending: same ? prev.pending || [] : [], last: same ? prev.last || null : null    // codzienne odświeżenie nie gubi kolejki
    }));
    return { ok: true, vapidPublicKey: vapidPublicKey, id: id };
  });
}

function actionPushUnsubscribe_(body) {
  const endpoint = String((body.subscription && body.subscription.endpoint) || body.endpoint || '');
  if (endpoint) props_().deleteProperty('push_' + pushId_(endpoint));
  return { ok: true };
}

/** Wywołuje service worker po przebudzeniu: oddaje WSZYSTKIE czekające powiadomienia tego urządzenia
    (a nie po jednym na push — inaczej jeden zgubiony push przesuwał kolejkę i telefon pokazywał stare zmiany).
    last = ostatnie pokazane — gdy kolejka jest już pusta, telefon pokazuje je ponownie, zamiast pustego komunikatu. */
function actionPushPull_(body) {
  const endpoint = String(body.endpoint || '');
  if (!endpoint) return { ok: true, n: null, items: [] };
  const key = 'push_' + pushId_(endpoint);
  return withLock_(() => {
    const raw = props_().getProperty(key);
    if (!raw) return { ok: true, n: null, items: [], gone: true };
    const sub = JSON.parse(raw);
    const fresh = Date.now() - 3 * 864e5;
    const items = (sub.pending || []).filter((x) => !x.at || x.at > fresh);
    if (items.length || (sub.pending || []).length) {
      sub.pending = [];
      if (items.length) sub.last = items[items.length - 1];
      props_().setProperty(key, JSON.stringify(sub));
    }
    return { ok: true, n: items[0] || null, items: items, last: sub.last || null };
  });
}

function actionPushTest_(body) {
  const ctx = auth_(body);
  if (ctx.role === 'public') throw userError_('Najpierw się zaloguj.', 'AUTH');
  const endpoint = String(body.endpoint || '');
  const id = pushId_(endpoint);
  pushTo_((x) => x.id === id, {
    title: '🔔 Powiadomienia działają',
    body: ctx.role === 'admin'
      ? 'Tak dostaniesz info o każdej rezerwacji, zmianie terminu, odwołaniu i płatności.'
      : 'Tak dostaniesz info, gdy ktoś zmieni termin Twojej lekcji albo ją odwoła.',
    url: CONFIG.APP_URL, tag: 'test'
  });
  return { ok: true };
}

/** Dopisuje powiadomienie do kolejek pasujących urządzeń i budzi je. Nigdy nie przerywa głównej akcji. */
function pushTo_(match, n) {
  if (!CONFIG.PUSH_ENABLED) return;
  try {
    let subs = [];
    const lock = LockService.getScriptLock();
    if (!lock.tryLock(15000)) return;
    try {
      props_().reload();
      const all = props_().getProperties();
      subs = Object.keys(all).filter((k) => k.indexOf('push_') === 0).map((k) => JSON.parse(all[k])).filter(match);
      const item = { title: n.title, body: n.body, url: n.url || CONFIG.APP_URL, tag: n.tag || 'kal-' + Date.now(), at: Date.now() };
      subs.forEach((x) => {
        x.pending = (x.pending || []).concat([item]).slice(-10);
        props_().setProperty('push_' + x.id, JSON.stringify(x));
      });
    } finally {
      lock.releaseLock();
    }
    if (subs.length) sendTickles_(subs);
  } catch (e) {
    console.error('Powiadomienie push nie wyszło: ' + e);
  }
}
function pushStudent_(email, n) { if (email) pushTo_((x) => !x.admin && x.email === email, n); }
/** Nauczyciel dostaje powiadomienie o każdej zmianie — także zrobionej przez siebie w panelu (gdy włączone
    NOTIFY_ON_ADMIN_ACTIONS), ale nie na to urządzenie, z którego właśnie ją zrobił. */
function pushTeacher_(ctx, n) {
  if (ctx && ctx.role === 'admin' && !CONFIG.NOTIFY_ON_ADMIN_ACTIONS) return;
  const dev = (ctx && ctx.dev) || '';
  pushTo_((x) => x.admin && x.id !== dev, n);
}

function sendTickles_(subs) {
  const pub = vapidKeys_().pub;
  const reqs = subs.map((x) => ({
    url: x.endpoint,
    method: 'post',
    muteHttpExceptions: true,
    headers: { TTL: '86400', Urgency: 'high', Authorization: 'vapid t=' + vapidJwt_(originOf_(x.endpoint)) + ', k=' + pub }
  }));
  const res = UrlFetchApp.fetchAll(reqs);
  res.forEach((r, i) => {
    const code = r.getResponseCode();
    if (code === 404 || code === 410) props_().deleteProperty('push_' + subs[i].id);   // telefon wyrejestrowany
    else if (code >= 400) console.error('Push ' + code + ': ' + String(r.getContentText()).slice(0, 300));
  });
}
function originOf_(url) { return (String(url).match(/^https:\/\/[^/]+/) || [''])[0]; }

/* ─── klucze VAPID i podpis ES256 ─── */

function vapidKeys_() {
  const p = props_();
  let d = p.getProperty('VAPID_D');
  let pub = p.getProperty('VAPID_PUB');
  if (d && pub) return { d: d, pub: pub };
  // pierwsze użycie: generujemy parę kluczy pod blokadą (dwa równoległe zapytania nie mogą zrobić dwóch różnych)
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(20000)) throw new Error('VAPID: brak blokady');
  try {
    p.reload();
    d = p.getProperty('VAPID_D');
    pub = p.getProperty('VAPID_PUB');
    if (d && pub) return { d: d, pub: pub };
    const E = ec_();
    const seed = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256,
      Utilities.getUuid() + Utilities.getUuid() + Date.now() + secret_(), Utilities.Charset.UTF_8);
    const k = bytesToBig_(seed) % (E.n - E.ONE) + E.ONE;
    const Q = ecAffine_(ecMul_(k, [E.gx, E.gy, E.ONE]));
    d = k.toString(16).padStart(64, '0');
    pub = b64urlBytes_([4].concat(bigToBytes_(Q[0]), bigToBytes_(Q[1])));
    p.setProperty('VAPID_D', d);
    p.setProperty('VAPID_PUB', pub);
    return { d: d, pub: pub };
  } finally {
    lock.releaseLock();
  }
}

function vapidJwt_(aud) {
  const cache = CacheService.getScriptCache();
  const ck = 'vjwt2:' + aud;
  const hit = cache.get(ck);
  if (hit) return hit;
  const enc = (o) => Utilities.base64EncodeWebSafe(JSON.stringify(o), Utilities.Charset.UTF_8).replace(/=+$/, '');
  const input = enc({ typ: 'JWT', alg: 'ES256' }) + '.' +
    enc({ aud: aud, exp: Math.floor(Date.now() / 1000) + 12 * 3600, sub: CONFIG.PUSH_SUBJECT });
  const jwt = input + '.' + b64urlBytes_(ecdsaSign_(input, BigInt('0x' + vapidKeys_().d)));
  try { cache.put(ck, jwt, 6 * 3600); } catch (e) { /* trudno */ }
  return jwt;
}

// Krzywa P-256 (secp256r1). BigInt tworzony przez BigInt('…'), bez literałów 123n.
let ecMemo_ = null;
function ec_() {
  if (ecMemo_) return ecMemo_;
  const B = (x) => BigInt(x);
  ecMemo_ = {
    p: B('0xffffffff00000001000000000000000000000000ffffffffffffffffffffffff'),
    n: B('0xffffffff00000000ffffffffffffffffbce6faada7179e84f3b9cac2fc632551'),
    gx: B('0x6b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296'),
    gy: B('0x4fe342e2fe1a7f9b8ee7eb4a7c0f9e162bce33576b315ececbb6406837bf51f5'),
    ZERO: B(0), ONE: B(1), TWO: B(2), THREE: B(3), FOUR: B(4), EIGHT: B(8)
  };
  return ecMemo_;
}
function modp_(a, m) { const r = a % m; return r < ec_().ZERO ? r + m : r; }
function powmod_(b, e, m) {
  const E = ec_();
  let r = E.ONE;
  b = modp_(b, m);
  while (e > E.ZERO) {
    if (e & E.ONE) r = (r * b) % m;
    b = (b * b) % m;
    e = e >> E.ONE;
  }
  return r;
}
function invmod_(a, m) { return powmod_(a, m - ec_().TWO, m); }
// punkty w współrzędnych Jacobiego [X, Y, Z]; null = punkt w nieskończoności
function ecDbl_(P) {
  const E = ec_();
  const p = E.p;
  if (!P || P[1] === E.ZERO) return null;
  const X = P[0], Y = P[1], Z = P[2];
  const delta = Z * Z % p;
  const gamma = Y * Y % p;
  const beta = X * gamma % p;
  const alpha = E.THREE * modp_(X - delta, p) % p * ((X + delta) % p) % p;
  const X3 = modp_(alpha * alpha - E.EIGHT * beta, p);
  const Z3 = modp_((Y + Z) * (Y + Z) - gamma - delta, p);
  const Y3 = modp_(alpha * modp_(E.FOUR * beta - X3, p) - E.EIGHT * (gamma * gamma % p), p);
  return [X3, Y3, Z3];
}
function ecAdd_(P, Q) {
  if (!P) return Q;
  if (!Q) return P;
  const E = ec_();
  const p = E.p;
  const Z1Z1 = P[2] * P[2] % p;
  const Z2Z2 = Q[2] * Q[2] % p;
  const U1 = P[0] * Z2Z2 % p;
  const U2 = Q[0] * Z1Z1 % p;
  const S1 = P[1] * Q[2] % p * Z2Z2 % p;
  const S2 = Q[1] * P[2] % p * Z1Z1 % p;
  const H = modp_(U2 - U1, p);
  const r = modp_(E.TWO * (S2 - S1), p);
  if (H === E.ZERO) return r === E.ZERO ? ecDbl_(P) : null;
  const I = E.FOUR * H % p * H % p;
  const J = H * I % p;
  const V = U1 * I % p;
  const X3 = modp_(r * r - J - E.TWO * V, p);
  const Y3 = modp_(r * modp_(V - X3, p) - E.TWO * (S1 * J % p), p);
  const Z3 = modp_(((P[2] + Q[2]) * (P[2] + Q[2]) - Z1Z1 - Z2Z2) % p * H, p);
  return [X3, Y3, Z3];
}
function ecMul_(k, P) {
  let R = null;
  const bits = k.toString(2);
  for (let i = 0; i < bits.length; i++) {
    R = ecDbl_(R);
    if (bits.charAt(i) === '1') R = ecAdd_(R, P);
  }
  return R;
}
function ecAffine_(P) {
  const p = ec_().p;
  const zi = invmod_(P[2], p);
  const zi2 = zi * zi % p;
  return [P[0] * zi2 % p, P[1] * zi2 % p * zi % p];
}
/** Podpis ECDSA P-256 / SHA-256 → 64 bajty (r ‖ s), tak jak wymaga JWT ES256. */
function ecdsaSign_(message, d) {
  const E = ec_();
  const n = E.n;
  const z = bytesToBig_(Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_256, message, Utilities.Charset.UTF_8));
  for (let attempt = 0; attempt < 16; attempt++) {
    const kb = Utilities.computeHmacSha256Signature(Utilities.getUuid() + '|' + attempt + '|' + z.toString(16), d.toString(16));
    const k = bytesToBig_(kb) % (n - E.ONE) + E.ONE;
    const R = ecAffine_(ecMul_(k, [E.gx, E.gy, E.ONE]));
    const r = R[0] % n;
    if (r === E.ZERO) continue;
    const sig = invmod_(k, n) * ((z + r * d) % n) % n;
    if (sig === E.ZERO) continue;
    return bigToBytes_(r).concat(bigToBytes_(sig));
  }
  throw new Error('ECDSA: nie udało się podpisać');
}
function bytesToBig_(bytes) {
  let hex = '';
  for (let i = 0; i < bytes.length; i++) hex += ((bytes[i] + 256) % 256).toString(16).padStart(2, '0');
  return BigInt('0x' + (hex || '0'));
}
function bigToBytes_(x) {
  const hex = x.toString(16).padStart(64, '0');
  const out = [];
  for (let i = 0; i < 64; i += 2) out.push(parseInt(hex.substr(i, 2), 16));
  return out;
}
function b64urlBytes_(arr) {
  return Utilities.base64EncodeWebSafe(arr.map((b) => (b > 127 ? b - 256 : b))).replace(/=+$/, '');
}

/* ═══════════════════════════════════════════════════════════════════════
   DISCORD (bot T-Olimpians)
   ═══════════════════════════════════════════════════════════════════════
   Bot działa osobno (folder t-olimpians-discord-bot) i co minutę pyta akcję discordFeed o lekcje
   z najbliższych godzin, nicki uczniów i nowe zmiany (rezerwacje, przesunięcia, odwołania).
   Zmiany zapisujemy w krótkiej kolejce we właściwości DISCORD_Q — bot pamięta, które już wysłał.
   Wszystko jest wyłączone, dopóki nie ma właściwości skryptu DISCORD_BOT_KEY (funkcja discordKey). */

const DISCORD_Q_KEY = 'DISCORD_Q';
const DISCORD_Q_DAYS = 7;

/** Uruchom RAZ z edytora: tworzy klucz bota (właściwość DISCORD_BOT_KEY) i wypisuje go w logu. */
function discordKey() {
  let key = props_().getProperty('DISCORD_BOT_KEY');
  if (!key) {
    key = 'tol_' + Utilities.getUuid().replace(/-/g, '') + Utilities.getUuid().replace(/-/g, '').slice(0, 16);
    props_().setProperty('DISCORD_BOT_KEY', key);
  }
  Logger.log('Klucz bota Discord (w pliku .env bota: CALENDAR_BOT_KEY): ' + key);
  Logger.log('Adres backendu (w pliku .env bota: CALENDAR_API_URL): ' + ScriptApp.getService().getUrl());
}

function discordLite_(m) { return { s: m.s, e: m.e, dur: m.duration }; }

function discordQueueRead_() {
  try {
    const q = JSON.parse(props_().getProperty(DISCORD_Q_KEY) || 'null');
    if (q && Array.isArray(q.items)) return q;
  } catch (e) { /* zepsuta kolejka — zaczynamy od nowa */ }
  return { seq: 0, items: [] };
}

/** Dopisuje zmianę do kolejki dla bota (wołane pod blokadą, razem z samą zmianą). */
function discordQueue_(ctx, email, name, evt) {
  if (!email || !props_().getProperty('DISCORD_BOT_KEY')) return;
  try {
    const q = discordQueueRead_();
    const cutoff = Date.now() - DISCORD_Q_DAYS * 864e5;
    evt.seq = ++q.seq;
    evt.at = Date.now();
    evt.email = email;
    evt.name = name;
    evt.by = ctx.role === 'admin' ? 'teacher' : 'student';
    q.items = q.items.filter((x) => x.at > cutoff).concat([evt]);
    while (q.items.length > 1 && JSON.stringify(q).length > 8000) q.items.shift();   // limit właściwości: 9 kB
    props_().setProperty(DISCORD_Q_KEY, JSON.stringify(q));
  } catch (e) {
    console.error(e);                                         // Discord nie może zepsuć rezerwacji
  }
}

/** Dla bota: lekcje z najbliższych godzin, nicki uczniów i zmiany od numeru after. */
function actionDiscordFeed_(body) {
  const key = props_().getProperty('DISCORD_BOT_KEY');
  if (!key || String(body.botKey || '') !== key) {
    Utilities.sleep(500);
    throw userError_('Nieprawidłowy klucz bota (właściwość skryptu DISCORD_BOT_KEY).', 'FORBIDDEN');
  }
  const q = discordQueueRead_();
  const after = typeof body.after === 'number' ? body.after : null;
  // pierwsze połączenie (after = null) albo wyczyszczona kolejka — nie wysyłamy starych zmian, tylko numer
  const events = after !== null && after <= q.seq ? q.items.filter((x) => x.seq > after) : [];

  const hours = Math.min(168, Math.max(1, Number(body.hours) || 36));
  const now = Date.now();
  const until = now + hours * 3600000;
  const lessons = rangeModels_(todayStr_(), addDaysStr_(localIso_(new Date(until)).slice(0, 10), 1))
    .filter((m) => m.kind === 'lesson' && !m.allDay)
    .map((m) => ({ id: m.id, s: m.s, e: m.e, dur: m.duration, start: parseLocal_(m.s).getTime(), end: parseLocal_(m.e).getTime(),
      name: m.name, email: m.email, series: !!m.seriesId }))
    .filter((m) => m.end > now && m.start < until);

  const students = listStudents_().filter((s) => s.discord).map((s) => ({ email: s.email, name: s.name, discord: s.discord }));
  return { ok: true, now: now, seq: q.seq, events: events, lessons: lessons, students: students };
}

/* ─── logowanie kodem (w zainstalowanej aplikacji na iPhonie link z maila otwiera się w Safari) ─── */

function actionLoginCode_(body) {
  const email = clean_(body.email, 120).toLowerCase();
  const code = String(body.code || '').replace(/\D/g, '');
  if (!isEmail_(email) || code.length !== 6) throw userError_('Podaj adres email i 6-cyfrowy kod z maila.', 'CODE');
  return withLock_(() => {
    const key = 'code_' + email;
    const raw = props_().getProperty(key);
    if (!raw) throw userError_('Kod wygasł albo nie istnieje — wyślij nowy.', 'CODE');
    const c = JSON.parse(raw);
    if (Date.now() > c.exp || c.tries >= 5) {
      props_().deleteProperty(key);
      throw userError_('Kod wygasł — wyślij nowy.', 'CODE');
    }
    if (c.code !== code) {
      c.tries++;
      props_().setProperty(key, JSON.stringify(c));
      throw userError_('Nieprawidłowy kod.', 'CODE');
    }
    props_().deleteProperty(key);
    props_().setProperty('tk_' + studentToken_(email), email);
    return { ok: true, token: studentToken_(email) };
  });
}
function cleanupCodes_() {
  const all = props_().getProperties();
  Object.keys(all).filter((k) => k.indexOf('code_') === 0).forEach((k) => {
    try { if (Date.now() > JSON.parse(all[k]).exp) props_().deleteProperty(k); } catch (e) { props_().deleteProperty(k); }
  });
}

/* ═══════════════════════════════════════════════════════════════════════
   POMOCNICZE
   ═══════════════════════════════════════════════════════════════════════ */

const DAY_LONG = ['niedziela', 'poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota'];
const DAY_ACC = ['w niedzielę', 'w poniedziałek', 'we wtorek', 'w środę', 'w czwartek', 'w piątek', 'w sobotę'];
const DAY_SHORT = ['nd', 'pn', 'wt', 'śr', 'cz', 'pt', 'sb'];
const DAY_PLURAL_W = ['w niedziele', 'w poniedziałki', 'we wtorki', 'w środy', 'w czwartki', 'w piątki', 'w soboty'];
const MONTH_GEN = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];

// Właściwości skryptu czytamy RAZ na wykonanie (getProperties), zamiast osobnego zapytania na każdy klucz.
let propsMemo_ = null;
function props_() {
  if (propsMemo_) return propsMemo_;
  const real = PropertiesService.getScriptProperties();
  let all = null;
  const load = () => { if (!all) all = real.getProperties(); return all; };
  propsMemo_ = {
    getProperty: (k) => { const v = load()[k]; return v === undefined ? null : v; },
    getProperties: () => Object.assign({}, load()),
    setProperty: (k, v) => { real.setProperty(k, v); load()[k] = String(v); return propsMemo_; },
    setProperties: (o) => {
      real.setProperties(o);
      const a = load();
      Object.keys(o).forEach((k) => { a[k] = String(o[k]); });
      return propsMemo_;
    },
    deleteProperty: (k) => { real.deleteProperty(k); delete load()[k]; return propsMemo_; },
    reload: () => { all = null; }
  };
  return propsMemo_;
}
function version_() { return props_().getProperty('VER') || '1'; }
function bumpVersion_() {
  journalFlush_();
  props_().setProperty('VER', String(Date.now()));
}

function withLock_(fn) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(25000)) throw userError_('Serwer jest teraz zajęty. Spróbuj ponownie za chwilę.', 'BUSY');
  try {
    props_().reload();          // pod blokadą czytamy świeże dane (mogły się zmienić w innym wykonaniu)
    journalMemo_ = null;
    availMemo_ = null;
    return fn();
  } finally {
    lock.releaseLock();
  }
}

function safeRun_(fn) {
  if (!fn) return;
  try { fn(); } catch (e) { console.error(e); }
}

function userError_(message, code, extra) {
  const e = new Error(message);
  e.isUser = true;
  e.code = code || 'ERROR';
  e.extra = extra || null;
  return e;
}
function goneError_() {
  return userError_('Nie znaleziono tej lekcji — mogła zostać zmieniona. Odśwież kalendarz.', 'GONE');
}

function fail_(err) {
  if (err && err.isUser) {
    const out = { ok: false, error: err.message, code: err.code };
    if (err.extra) Object.keys(err.extra).forEach((k) => { out[k] = err.extra[k]; });
    return out;
  }
  const msg = String((err && err.message) || err);
  console.error((err && err.stack) || msg);
  if (/Calendar is not defined/.test(msg)) {
    return { ok: false, code: 'SETUP', error: 'Backend: włącz usługę „Google Calendar API” (Edytor → Usługi → +).' };
  }
  return { ok: false, code: 'SERVER', error: 'Błąd serwera: ' + msg };
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(v, max, multiline) {
  let s = String(v == null ? '' : v);
  s = multiline ? s.replace(/[\u0000-\u0009\u000b-\u001f]/g, ' ') : s.replace(/[\u0000-\u001f]/g, ' ');
  return s.trim().slice(0, max);
}
function isEmail_(s) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s); }
function isDateStr_(s) { return typeof s === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(s); }
function isTimeStr_(s) { return typeof s === 'string' && /^([01]\d|2[0-3]):[0-5]\d$/.test(s); }
function newId_(prefix) { return prefix + Utilities.getUuid().replace(/-/g, '').slice(0, 12); }
function esc_(s) {
  return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function pad_(n) { return (n < 10 ? '0' : '') + n; }
function cap_(s) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function toDate_(dateStr, timeStr) { return Utilities.parseDate(dateStr + ' ' + timeStr, CONFIG.TIMEZONE, 'yyyy-MM-dd HH:mm'); }
function parseLocal_(iso) { return toDate_(iso.slice(0, 10), iso.slice(11, 16) || '00:00'); }
function localIso_(d) { return Utilities.formatDate(d, CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm"); }
function rfcLocal_(d) { return Utilities.formatDate(d, CONFIG.TIMEZONE, "yyyy-MM-dd'T'HH:mm:ss"); }
function todayStr_() { return Utilities.formatDate(new Date(), CONFIG.TIMEZONE, 'yyyy-MM-dd'); }
function dateOf_(m) { return m.s.slice(0, 10); }

function ymd_(s) { return s.split('-').map(Number); }
function addDaysStr_(s, n) {
  const p = ymd_(s);
  return new Date(Date.UTC(p[0], p[1] - 1, p[2] + n)).toISOString().slice(0, 10);
}
function weekdayOf_(s) { const p = ymd_(s); return new Date(Date.UTC(p[0], p[1] - 1, p[2])).getUTCDay(); }
function diffDays_(a, b) {
  const x = ymd_(a);
  const y = ymd_(b);
  return Math.round((Date.UTC(y[0], y[1] - 1, y[2]) - Date.UTC(x[0], x[1] - 1, x[2])) / 864e5);
}
function mondayOf_(s) { return addDaysStr_(s, -((weekdayOf_(s) + 6) % 7)); }
function toMin_(t) { const p = t.split(':').map(Number); return p[0] * 60 + p[1]; }
function fromMin_(m) { return pad_(Math.floor(m / 60)) + ':' + pad_(m % 60); }

function plShort_(s) { const p = ymd_(s); return DAY_SHORT[weekdayOf_(s)] + ' ' + p[2] + '.' + pad_(p[1]); }
function plLong_(s) { const p = ymd_(s); return DAY_LONG[weekdayOf_(s)] + ', ' + p[2] + ' ' + MONTH_GEN[p[1] - 1]; }
