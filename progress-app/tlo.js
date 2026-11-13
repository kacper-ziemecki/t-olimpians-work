/* ═══════════════════════════════════════════════════════════════════════════
   T-Olimpians — tło listy postępów: graf, po którym chodzą algorytmy.

   • wierzchołki rozrzucone równomiernie (próbkowanie Poissona),
   • krawędzie = minimalne drzewo rozpinające (Prim) + po 2 najbliższych sąsiadów,
   • co kilka sekund z losowego wierzchołka rusza Dijkstra (fala po drzewie najkrótszych
     ścieżek) albo BFS (warstwa po warstwie); gdy fala dojdzie do celu, najkrótsza ścieżka
     zapala się na bursztynowo — jak odtworzenie odpowiedzi z tablicy rodziców.

   Przy „ogranicz ruch” (prefers-reduced-motion) rysuje jedną nieruchomą klatkę.
   Wpięcie: <script src="/progress-app/tlo.js" defer></script> + styl #bg-graph (position:fixed, z-index pod treścią).
   ═══════════════════════════════════════════════════════════════════════════ */
(function(){
  "use strict";
  const canvas = document.createElement("canvas");
  canvas.id = "bg-graph";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");
  if(!ctx) return;

  const mq = (q) => (window.matchMedia ? window.matchMedia(q) : { matches: false, addEventListener(){} });
  const reduce = mq("(prefers-reduced-motion: reduce)");
  const finePointer = mq("(pointer: fine)").matches;

  const BLUE = "96,165,250", BLUE2 = "59,130,246", AMBER = "245,185,77";
  const WAVE_S = 4.5;          // tyle sekund fala idzie od źródła do celu
  const PATH_S = 0.9;          // odtwarzanie ścieżki od celu do źródła
  const HOLD_S = 1.8;          // ścieżka świeci
  const FADE_S = 1.4;          // wygaszanie epizodu
  const PAUSE_S = 0.7;         // przerwa przed kolejnym
  const FRAME_MS = 24;         // ~40 klatek na sekundę wystarczy

  let W = 0, H = 0;
  let nodes = [];              // { bx, by, x, y, ph, amp, sp }
  let edges = [];              // [a, b, długość]
  let adj = [];                // adj[v] = [{ to, len, e }]
  let ep = null;               // bieżący epizod algorytmu
  let mouse = null;
  let clock = 0, lastTs = 0, raf = 0;

  /* ─ budowa grafu ─ */
  function build(){
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const want = Math.max(22, Math.min(90, Math.round(W * H / 15000)));
    const minD = Math.sqrt(W * H / want) * 0.72;
    nodes = [];
    for(let tries = 0; nodes.length < want && tries < want * 80; tries++){
      const x = 16 + Math.random() * (W - 32), y = 16 + Math.random() * (H - 32);
      if(nodes.every(p => (p.bx - x) ** 2 + (p.by - y) ** 2 >= minD * minD)){
        nodes.push({ bx: x, by: y, x, y, ph: Math.random() * 6.283, amp: 2 + Math.random() * 4, sp: 0.15 + Math.random() * 0.25 });
      }
    }
    const N = nodes.length;
    const d2 = (a, b) => (nodes[a].bx - nodes[b].bx) ** 2 + (nodes[a].by - nodes[b].by) ** 2;
    const key = (a, b) => (a < b ? a * 1000 + b : b * 1000 + a);
    const set = new Set();
    // minimalne drzewo rozpinające — Prim w O(n²)
    const inTree = new Array(N).fill(false), best = new Array(N).fill(Infinity), from = new Array(N).fill(-1);
    if(N) best[0] = 0;
    for(let it = 0; it < N; it++){
      let v = -1;
      for(let i = 0; i < N; i++) if(!inTree[i] && (v < 0 || best[i] < best[v])) v = i;
      inTree[v] = true;
      if(from[v] >= 0) set.add(key(v, from[v]));
      for(let i = 0; i < N; i++){
        if(inTree[i]) continue;
        const d = d2(v, i);
        if(d < best[i]){ best[i] = d; from[i] = v; }
      }
    }
    // + 2 najbliższych sąsiadów (cykle, żeby najkrótsze ścieżki miały z czego wybierać)
    const maxLen2 = (minD * 2.3) ** 2;
    for(let a = 0; a < N; a++){
      const near = [];
      for(let b = 0; b < N; b++) if(b !== a) near.push(b);
      near.sort((p, q) => d2(a, p) - d2(a, q));
      for(const b of near.slice(0, 2)) if(d2(a, b) <= maxLen2) set.add(key(a, b));
    }
    edges = [...set].map(k => { const a = Math.floor(k / 1000), b = k % 1000; return [a, b, Math.sqrt(d2(a, b))]; });
    adj = nodes.map(() => []);
    edges.forEach(([a, b, len], e) => { adj[a].push({ to: b, len, e }); adj[b].push({ to: a, len, e }); });
    ep = null;
  }

  /* ─ epizod: Dijkstra albo BFS z losowego źródła do jednego z najdalszych wierzchołków ─ */
  function newEpisode(){
    const N = nodes.length;
    if(N < 2) return null;
    const src = Math.floor(Math.random() * N);
    const bfs = Math.random() < 0.4;
    const dist = new Array(N).fill(Infinity), par = new Array(N).fill(-1), parE = new Array(N).fill(-1);
    dist[src] = 0;
    if(bfs){
      const q = [src];
      for(let h = 0; h < q.length; h++){
        const v = q[h];
        for(const { to, e } of adj[v]) if(dist[to] === Infinity){ dist[to] = dist[v] + 1; par[to] = v; parE[to] = e; q.push(to); }
      }
    }else{
      const done = new Array(N).fill(false);
      for(let it = 0; it < N; it++){
        let v = -1;
        for(let i = 0; i < N; i++) if(!done[i] && dist[i] < Infinity && (v < 0 || dist[i] < dist[v])) v = i;
        if(v < 0) break;
        done[v] = true;
        for(const { to, len, e } of adj[v]) if(dist[v] + len < dist[to]){ dist[to] = dist[v] + len; par[to] = v; parE[to] = e; }
      }
    }
    const reach = [...Array(N).keys()].filter(i => dist[i] < Infinity && i !== src).sort((a, b) => dist[b] - dist[a]);
    if(!reach.length) return null;
    const target = reach[Math.floor(Math.random() * Math.max(1, Math.ceil(reach.length * 0.25)))];
    const scale = WAVE_S / dist[target];             // odległość → czas dotarcia fali
    const time = dist.map(d => d * scale);
    const path = [];                                  // krawędzie ścieżki od celu do źródła
    for(let v = target; par[v] >= 0; v = par[v]) path.push({ e: parE[v], from: v, to: par[v] });
    const onPath = new Set(path.map(p => p.to).concat(target));
    const end = WAVE_S + PATH_S + HOLD_S + FADE_S;
    return { src, target, par, time, path, onPath, bfs, t: 0, end };
  }

  /* ─ rysowanie ─ */
  const clamp01 = (x) => (x < 0 ? 0 : x > 1 ? 1 : x);

  function drawBase(){
    ctx.lineWidth = 1;
    ctx.strokeStyle = `rgba(${BLUE2},0.11)`;
    ctx.beginPath();
    for(const [a, b] of edges){ ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); }
    ctx.stroke();
    ctx.fillStyle = `rgba(${BLUE},0.38)`;
    ctx.beginPath();
    for(const p of nodes){ ctx.moveTo(p.x + 1.6, p.y); ctx.arc(p.x, p.y, 1.6, 0, 6.283); }
    ctx.fill();
    // kursor rozświetla okolicę
    if(mouse){
      const R = 160;
      for(const [a, b] of edges){
        const mx = (nodes[a].x + nodes[b].x) / 2 - mouse.x, my = (nodes[a].y + nodes[b].y) / 2 - mouse.y;
        const d = Math.sqrt(mx * mx + my * my);
        if(d >= R) continue;
        ctx.strokeStyle = `rgba(${BLUE},${0.32 * (1 - d / R)})`;
        ctx.beginPath(); ctx.moveTo(nodes[a].x, nodes[a].y); ctx.lineTo(nodes[b].x, nodes[b].y); ctx.stroke();
      }
    }
  }

  function drawEpisode(e, alpha){
    const t = e.t;
    // drzewo przeszukiwania rośnie od rodzica do dziecka, gdy fala do niego dochodzi
    for(let v = 0; v < nodes.length; v++){
      const p = e.par[v];
      if(p < 0) continue;
      const t0 = e.time[p], t1 = e.time[v];
      const k = clamp01((t - t0) / Math.max(0.001, t1 - t0));
      if(k <= 0) continue;
      const a = nodes[p], b = nodes[v];
      const x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k;
      const fresh = k < 1 ? 1 : Math.max(0, 1 - (t - t1) / 1.6);
      ctx.strokeStyle = `rgba(${BLUE},${alpha * (0.22 + 0.5 * fresh)})`;
      ctx.lineWidth = 1 + fresh;
      ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(x, y); ctx.stroke();
      if(k < 1){                                       // czoło fali
        ctx.fillStyle = `rgba(220,235,255,${alpha * 0.9})`;
        ctx.beginPath(); ctx.arc(x, y, 1.8, 0, 6.283); ctx.fill();
      }
    }
    // odwiedzone wierzchołki: błysk przy odwiedzeniu, potem spokojne świecenie
    for(let v = 0; v < nodes.length; v++){
      const tv = e.time[v];
      if(!(t >= tv)) continue;
      const age = t - tv;
      const flash = Math.max(0, 1 - age / 0.6);
      const r = 2.2 + 3 * flash;
      ctx.fillStyle = `rgba(${BLUE},${alpha * (0.45 + 0.5 * flash)})`;
      ctx.beginPath(); ctx.arc(nodes[v].x, nodes[v].y, r, 0, 6.283); ctx.fill();
      if(flash > 0){
        ctx.strokeStyle = `rgba(${BLUE},${alpha * 0.5 * flash})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.arc(nodes[v].x, nodes[v].y, r + 6 * (1 - flash), 0, 6.283); ctx.stroke();
      }
    }
    // źródło
    const s = nodes[e.src];
    ctx.strokeStyle = `rgba(${BLUE},${alpha * 0.8})`;
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.arc(s.x, s.y, 6, 0, 6.283); ctx.stroke();
    // cel czeka na falę
    const g = nodes[e.target];
    const pulse = 0.5 + 0.5 * Math.sin(clock * 4);
    ctx.strokeStyle = `rgba(${AMBER},${alpha * (t >= WAVE_S ? 0.9 : 0.35 + 0.3 * pulse)})`;
    ctx.beginPath(); ctx.arc(g.x, g.y, 6 + (t >= WAVE_S ? 0 : 2 * pulse), 0, 6.283); ctx.stroke();
    // najkrótsza ścieżka: odtwarzanie od celu do źródła po tablicy rodziców
    if(t >= WAVE_S){
      const n = e.path.length;
      const shown = clamp01((t - WAVE_S) / PATH_S) * n;
      ctx.lineCap = "round";
      for(let i = 0; i < n && i < shown; i++){
        const { from, to } = e.path[i];
        const k = clamp01(shown - i);
        const a = nodes[from], b = nodes[to];
        const x = a.x + (b.x - a.x) * k, y = a.y + (b.y - a.y) * k;
        ctx.strokeStyle = `rgba(${AMBER},${alpha * 0.16})`;
        ctx.lineWidth = 7;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(x, y); ctx.stroke();
        ctx.strokeStyle = `rgba(${AMBER},${alpha * 0.85})`;
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(x, y); ctx.stroke();
      }
      ctx.lineCap = "butt";
      ctx.fillStyle = `rgba(${AMBER},${alpha * 0.95})`;
      for(const v of e.onPath){
        if(v !== e.target && e.path.findIndex(p => p.to === v) >= shown) continue;
        ctx.beginPath(); ctx.arc(nodes[v].x, nodes[v].y, 3, 0, 6.283); ctx.fill();
      }
    }
  }

  function moveNodes(){
    for(const p of nodes){
      p.x = p.bx + Math.sin(clock * p.sp + p.ph) * p.amp;
      p.y = p.by + Math.cos(clock * p.sp * 0.8 + p.ph) * p.amp;
    }
  }

  function frame(ts){
    raf = requestAnimationFrame(frame);
    if(ts - lastTs < FRAME_MS) return;
    const dt = Math.min(0.1, (ts - lastTs) / 1000 || 0);
    lastTs = ts;
    clock += dt;
    moveNodes();
    if(!ep) ep = newEpisode();
    ctx.clearRect(0, 0, W, H);
    drawBase();
    if(ep){
      ep.t += dt;
      const fadeStart = ep.end - FADE_S;
      const alpha = ep.t < fadeStart ? 1 : clamp01(1 - (ep.t - fadeStart) / FADE_S);
      drawEpisode(ep, alpha);
      if(ep.t >= ep.end + PAUSE_S) ep = null;
    }
  }

  /* jedna nieruchoma klatka: graf i jedno gotowe przeszukiwanie ze ścieżką */
  function drawStatic(){
    moveNodes();
    ctx.clearRect(0, 0, W, H);
    drawBase();
    const e = newEpisode();
    if(e){ e.t = WAVE_S + PATH_S + 3; drawEpisode(e, 0.8); }
  }

  function start(){
    cancelAnimationFrame(raf);
    build();
    if(reduce.matches){ drawStatic(); return; }
    lastTs = 0;
    raf = requestAnimationFrame(frame);
  }

  let resizeTimer = 0;
  window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(start, 200); });
  if(reduce.addEventListener) reduce.addEventListener("change", start);
  if(finePointer){
    window.addEventListener("pointermove", (e) => { mouse = { x: e.clientX, y: e.clientY }; }, { passive: true });
    document.addEventListener("pointerleave", () => { mouse = null; });
    window.addEventListener("blur", () => { mouse = null; });
  }
  start();
})();
