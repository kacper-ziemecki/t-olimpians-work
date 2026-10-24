/* ── HERO 3D ──
   Film z finału OI na ekranie monitora 3D i medale, które przy przewijaniu
   wylatują zza monitora. Gdy WebGL nie działa, zostaje zwykły film w ramce. */

const media = document.querySelector('.hero-media');
const video = media && media.querySelector('video');
const hero  = media && media.closest('.hero');

if (media && video && hero && webglAvailable()) {
    const start = () => init().catch(err => {
        console.warn('hero-3d:', err);
        media.classList.remove('is-3d');
        media.querySelector('.hero-3d-canvas')?.remove();
    });
    if (document.readyState === 'complete') whenIdle(start);
    else window.addEventListener('load', () => whenIdle(start), { once: true });
}

function webglAvailable() {
    try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) {
        return false;
    }
}

function whenIdle(fn) {
    if ('requestIdleCallback' in window) requestIdleCallback(fn, { timeout: 1500 });
    else setTimeout(fn, 200);
}

const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const lerp  = (a, b, t) => a + (b - a) * t;
const ease  = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/* kolory T-Olimpians (jak w ramkach na stronie) */
const BRAND = ['#3b82f6', '#7c3aed', '#06b6d4', '#a78bfa', '#3b82f6'];

/* wymiary monitora w jednostkach sceny; środek ekranu jest w (0, 0, 0) */
const SCREEN_W = 1.6, SCREEN_H = 0.9;
const BEZEL = 0.03, CHIN = 0.1;

/* fragment sceny widoczny na płótnie (w płaszczyźnie ekranu) */
const VIEW = { left: -1.65, right: 1.65, top: 1.5, bottom: -1.1 };

/* medale lecą po krzywych Béziera w układzie monitora: zza monitora, wokół jego boku,
   na miejsce przed nóżką. Tory są policzone tak, żeby medale ani wstążki nie zahaczały
   o obudowę ani o siebie nawzajem. */
const MEDALS = [
    { color: 0xf5c451, label: '1', delay: 0.00, turns:  1, yaw: -0.20,
      path: [[ 0.60,  0.40, -0.38], [ 1.40,  0.62, -0.42], [ 1.25,  0.62, 0.80], [ 0.02, -0.40, 0.80]] },
    { color: 0xdfe3ea, label: '2', delay: 0.10, turns: -1, yaw:  0.40,
      path: [[-0.78,  0.10, -0.38], [-1.22,  0.30, -0.42], [-1.22,  0.10, 0.70], [-0.56, -0.50, 0.62]] },
    { color: 0xd08a52, label: '3', delay: 0.22, turns:  1, yaw: -0.45,
      path: [[ 0.80, -0.42, -0.38], [ 1.24, -0.42, -0.42], [ 1.24, -0.46, 0.66], [ 0.58, -0.54, 0.58]] },
];

function bezier(P, t, out) {
    const u = 1 - t, a = u * u * u, b = 3 * u * u * t, c = 3 * u * t * t, d = t * t * t;
    out.set(
        a * P[0][0] + b * P[1][0] + c * P[2][0] + d * P[3][0],
        a * P[0][1] + b * P[1][1] + c * P[2][1] + d * P[3][1],
        a * P[0][2] + b * P[1][2] + c * P[2][2] + d * P[3][2]
    );
}

let maxAnisotropy = 4;

async function init() {
    const THREE = await import('./vendor/three.module.min.js');
    await Promise.all([
        document.fonts.load('800 200px Syne'),
        document.fonts.load('500 40px "JetBrains Mono"'),
    ]).catch(() => {});

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const finePointer  = window.matchMedia('(pointer: fine)').matches;

    const canvas = document.createElement('canvas');
    canvas.className = 'hero-3d-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    media.appendChild(canvas);

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
    } catch (err) {
        canvas.remove();
        throw err;
    }
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.NeutralToneMapping;
    renderer.toneMappingExposure = 1.05;
    maxAnisotropy = renderer.capabilities.getMaxAnisotropy();

    const scene = new THREE.Scene();
    scene.environment = makeEnvironment(THREE, renderer, 'brand');
    const studioEnv = makeEnvironment(THREE, renderer, 'studio');   // neutralne odbicia, żeby złoto było złote

    const camera = new THREE.PerspectiveCamera(26, 1, 0.1, 50);

    const key = new THREE.DirectionalLight(0xffffff, 1.4);
    key.position.set(2, 3, 4);
    scene.add(key);
    const rimBlue = new THREE.PointLight(0x3b82f6, 2.5, 6);
    rimBlue.position.set(-2, 1, -1);
    scene.add(rimBlue);
    const rimPurple = new THREE.PointLight(0x7c3aed, 2.5, 6);
    rimPurple.position.set(2.2, -0.5, -1);
    scene.add(rimPurple);

    const stage = new THREE.Group();          // całość: reaguje na kursor
    scene.add(stage);
    const monitor = buildMonitor(THREE, video);
    stage.add(monitor.group);

    /* medale są częścią monitora, więc obracają się razem z nim i nigdy w niego nie wchodzą */
    const medals = MEDALS.map(cfg => {
        const m = buildMedal(THREE, cfg, studioEnv);
        monitor.group.add(m);
        return { cfg, obj: m };
    });

    const sparkles = buildSparkles(THREE);
    stage.add(sparkles.group);

    /* rozmiar: płótno jest większe niż ramka filmu, żeby medale mogły wylecieć poza monitor.
       Gdy z prawej jest mało miejsca, monitor lekko się zmniejsza, żeby medale nie wylatywały za okno. */
    function resize() {
        const box = media.getBoundingClientRect();
        const vid = video.getBoundingClientRect();
        const full = (vid.width || box.width) / SCREEN_W;
        const roomRight = document.documentElement.clientWidth - (box.left + box.width / 2);
        const ppu = clamp(roomRight / 1.45, full * 0.8, full);   // piksele na jednostkę sceny
        const w = Math.round((VIEW.right - VIEW.left) * ppu);
        const h = Math.round((VIEW.top - VIEW.bottom) * ppu);
        const dpr = window.devicePixelRatio || 1;
        renderer.setPixelRatio(Math.min(dpr, 2, Math.sqrt(4.2e6 / (w * h))));
        renderer.setSize(w, h, false);
        canvas.style.width  = w + 'px';
        canvas.style.height = h + 'px';
        canvas.style.transform = `translate(${VIEW.left / (VIEW.right - VIEW.left) * 100}%, ${-VIEW.top / (VIEW.top - VIEW.bottom) * 100}%)`;
        const cx = (VIEW.left + VIEW.right) / 2, cy = (VIEW.top + VIEW.bottom) / 2;
        camera.aspect = w / h;
        camera.position.set(cx, cy, (VIEW.top - VIEW.bottom) / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))));
        camera.lookAt(cx, cy, 0);
        camera.updateProjectionMatrix();
    }
    resize();
    new ResizeObserver(resize).observe(media);
    window.addEventListener('resize', resize, { passive: true });

    const pointer = { x: 0, y: 0, tx: 0, ty: 0 };
    if (finePointer && !reduceMotion) {
        window.addEventListener('pointermove', e => {
            pointer.tx = e.clientX / window.innerWidth - 0.5;
            pointer.ty = e.clientY / window.innerHeight - 0.5;
        }, { passive: true });
    }

    /* 0 → 1 w trakcie przewijania; startuje, gdy środek monitora jest na 60% wysokości okna
       (na komputerze od razu, na telefonie dopiero gdy monitor wjedzie na ekran) */
    function scrollProgress() {
        if (reduceMotion) return 0;
        const vh = window.innerHeight;
        const r = media.getBoundingClientRect();
        const start = Math.max(0, r.top + window.scrollY + r.height / 2 - vh * 0.6);
        return clamp((window.scrollY - start) / (vh * 0.7), 0, 1);
    }

    let progress = scrollProgress();
    let last = performance.now();
    let time = 0;

    function update(dt) {
        time += reduceMotion ? 0 : dt;
        progress = lerp(progress, scrollProgress(), Math.min(1, dt * 6));
        const p = progress;

        pointer.x = lerp(pointer.x, pointer.tx, Math.min(1, dt * 4));
        pointer.y = lerp(pointer.y, pointer.ty, Math.min(1, dt * 4));
        stage.rotation.y = pointer.x * 0.18;
        stage.rotation.x = pointer.y * 0.1;

        const mp = ease(clamp(p / 0.9, 0, 1));
        const mg = monitor.group;
        mg.rotation.y = lerp(-0.3, 0.16, mp);
        mg.rotation.x = lerp(0.04, 0.2, mp);
        mg.position.y = lerp(0, 0.06, mp) + Math.sin(time * 0.8) * 0.012;
        mg.position.z = lerp(0, -0.15, mp);

        medals.forEach(({ cfg, obj }, i) => {
            const t = ease(clamp((p - cfg.delay) / 0.62, 0, 1));
            bezier(cfg.path, t, obj.position);
            obj.position.y += Math.sin(time * 1.3 + i * 2) * 0.015;
            obj.rotation.y = cfg.yaw * t + cfg.turns * Math.PI * 2 * t + Math.sin(time * 0.7 + i) * 0.25;
            obj.rotation.x = lerp(-0.18, 0.08, t);
            obj.rotation.z = Math.sin(time * 0.9 + i) * 0.06;
            obj.scale.setScalar(lerp(0.82, 1, t));
        });

        sparkles.update(dt, time, p);
        monitor.update(time);
    }

    let running = false, rafId = 0, heroVisible = true, shown = false;
    function frame(now) {
        rafId = requestAnimationFrame(frame);
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        update(dt);
        renderer.render(scene, camera);
        if (!shown) {
            shown = true;
            media.classList.add('is-3d');
        }
    }
    function toggle() {
        const should = heroVisible && !document.hidden;
        if (should && !running) {
            running = true;
            last = performance.now();
            rafId = requestAnimationFrame(frame);
        } else if (!should && running) {
            running = false;
            cancelAnimationFrame(rafId);
        }
    }
    new IntersectionObserver(([entry]) => { heroVisible = entry.isIntersecting; toggle(); }).observe(hero);
    document.addEventListener('visibilitychange', toggle);

    canvas.addEventListener('webglcontextlost', () => {
        running = false;
        cancelAnimationFrame(rafId);
        media.classList.remove('is-3d');
        canvas.remove();
    });

    toggle();
}

/* oświetlenie odbić: ciemny pokój z jasnymi panelami;
   'brand' w kolorach T-Olimpians (monitor), 'studio' prawie białe (medale) */
function makeEnvironment(THREE, renderer, kind) {
    const env = new THREE.Scene();
    env.add(new THREE.Mesh(
        new THREE.BoxGeometry(10, 10, 10),
        new THREE.MeshBasicMaterial({ color: 0x0b0c14, side: THREE.BackSide })
    ));
    const panel = (color, strength, w, h, x, y, z) => {
        const m = new THREE.Mesh(
            new THREE.PlaneGeometry(w, h),
            new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(strength), side: THREE.DoubleSide })
        );
        m.position.set(x, y, z);
        m.lookAt(0, 0, 0);
        env.add(m);
    };
    if (kind === 'studio') {
        panel(0xffffff, 7, 4, 2, 0, 4.5, 1);
        panel(0xfff4e0, 5, 2.4, 2.4, 2, 1.2, 4.2);
        panel(0xffffff, 3.5, 2, 3, -4.2, 0.6, 2);
        panel(0xdde6ff, 2.5, 2, 3, 4.2, 0, 1);
        panel(0x3b82f6, 1.5, 3, 0.8, 0, -1.4, 4.4);
    } else {
        panel(0xffffff, 6, 4, 2, 0, 4.5, 1);
        panel(0xffffff, 3, 2, 2, 1.6, 1.4, 4.5);
        panel(0x3b82f6, 5, 2, 4, -4.5, 0.5, 1);
        panel(0x7c3aed, 5, 2, 4, 4.5, 0.5, 0);
        panel(0x06b6d4, 3, 4, 1.2, 0, -1.2, 4.5);
    }
    const pmrem = new THREE.PMREMGenerator(renderer);
    const texture = pmrem.fromScene(env, 0.03).texture;
    pmrem.dispose();
    return texture;
}

function roundedRect(THREE, w, h, r, ShapeType = THREE.Shape) {
    const s = new ShapeType();
    const x = -w / 2, y = -h / 2;
    s.moveTo(x + r, y);
    s.lineTo(x + w - r, y);
    s.quadraticCurveTo(x + w, y, x + w, y + r);
    s.lineTo(x + w, y + h - r);
    s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    s.lineTo(x + r, y + h);
    s.quadraticCurveTo(x, y + h, x, y + h - r);
    s.lineTo(x, y + r);
    s.quadraticCurveTo(x, y, x + r, y);
    return s;
}

/* zaokrąglona płyta o grubości `depth`, wyśrodkowana w (0, 0, 0) */
function slab(THREE, w, h, r, depth, bevel) {
    const g = new THREE.ExtrudeGeometry(roundedRect(THREE, w - 2 * bevel, h - 2 * bevel, Math.max(r - bevel, 0.002)), {
        depth: depth - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 8, curveSegments: 32,
    });
    g.center();
    return g;
}

function canvasTexture(THREE, w, h, draw, srgb = true) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    draw(c.getContext('2d'), w, h);
    const t = new THREE.CanvasTexture(c);
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = maxAnisotropy;
    return t;
}

function conicTexture(THREE, size) {
    return canvasTexture(THREE, size, size, (ctx, w) => {
        const g = ctx.createConicGradient(0, w / 2, w / 2);
        BRAND.forEach((c, i) => g.addColorStop(i / (BRAND.length - 1), c));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, w);
    });
}

/* czteroramienna gwiazdka jak w logo T-Olimpians */
function drawSparkle(ctx, x, y, r) {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
        const a = -Math.PI / 2 + i * Math.PI / 4;
        const rr = i % 2 === 0 ? r : r * 0.22;
        ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath();
    ctx.fill();
}

function buildMonitor(THREE, videoEl) {
    const group = new THREE.Group();
    const bodyW = SCREEN_W + 2 * BEZEL, bodyH = SCREEN_H + BEZEL + CHIN;
    const bodyY = (BEZEL - CHIN) / 2;
    const frontZ = 0.025;

    const bodyMat  = new THREE.MeshPhysicalMaterial({ color: 0x111420, metalness: 0.55, roughness: 0.3, clearcoat: 0.7, clearcoatRoughness: 0.18 });
    const rearMat  = new THREE.MeshStandardMaterial({ color: 0x161a29, metalness: 0.7, roughness: 0.36 });
    const standMat = new THREE.MeshStandardMaterial({ color: 0x2f3647, metalness: 1, roughness: 0.26 });

    const body = new THREE.Mesh(slab(THREE, bodyW, bodyH, 0.035, 0.05, 0.012), bodyMat);
    body.position.y = bodyY;
    group.add(body);

    const rear = new THREE.Mesh(slab(THREE, 1.36, 0.76, 0.1, 0.09, 0.03), rearMat);
    rear.position.set(0, -0.06, -0.07);
    group.add(rear);

    const neck = new THREE.Mesh(slab(THREE, 0.18, 0.64, 0.04, 0.045, 0.012), standMat);
    neck.position.set(0, -0.42, -0.15);
    neck.rotation.x = 0.12;
    group.add(neck);

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.028, 128), standMat);
    base.scale.set(0.34, 1, 0.2);
    base.position.set(0, -0.745, -0.19);
    group.add(base);

    const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(1.3, 0.7),
        new THREE.MeshBasicMaterial({
            transparent: true, depthWrite: false,
            map: canvasTexture(THREE, 256, 128, (ctx, w, h) => {
                const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
                g.addColorStop(0, 'rgba(0,0,0,0.6)');
                g.addColorStop(1, 'rgba(0,0,0,0)');
                ctx.fillStyle = g;
                ctx.scale(1, h / w);
                ctx.fillRect(0, 0, w, w);
            }),
        })
    );
    shadow.rotation.x = -Math.PI / 2;
    shadow.position.set(0, -0.76, -0.19);
    group.add(shadow);

    /* poświata za monitorem */
    const glow = new THREE.Mesh(
        new THREE.PlaneGeometry(3.6, 2.6),
        new THREE.MeshBasicMaterial({
            transparent: true, depthWrite: false, toneMapped: false,
            map: canvasTexture(THREE, 512, 384, (ctx, w, h) => {
                const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
                g.addColorStop(0, 'rgba(59,130,246,0.55)');
                g.addColorStop(0.45, 'rgba(124,58,237,0.22)');
                g.addColorStop(1, 'rgba(6,182,212,0)');
                ctx.fillStyle = g;
                ctx.scale(1, h / w);
                ctx.fillRect(0, 0, w, w);
            }),
        })
    );
    glow.position.set(0, 0, -0.45);
    group.add(glow);

    /* obracająca się gradientowa obwódka na krawędzi ramki, jak ramki zdjęć na stronie */
    const edgeShape = roundedRect(THREE, bodyW - 0.026, bodyH - 0.026, 0.024);
    edgeShape.holes.push(roundedRect(THREE, bodyW - 0.038, bodyH - 0.038, 0.018, THREE.Path));
    const edgeGeo = new THREE.ShapeGeometry(edgeShape, 32);
    const pos = edgeGeo.attributes.position, uv = edgeGeo.attributes.uv;
    for (let i = 0; i < pos.count; i++) uv.setXY(i, pos.getX(i) / bodyW + 0.5, pos.getY(i) / bodyH + 0.5);
    const edgeTex = conicTexture(THREE, 512);
    edgeTex.center.set(0.5, 0.5);
    const edge = new THREE.Mesh(edgeGeo, new THREE.MeshBasicMaterial({ map: edgeTex, toneMapped: false }));
    edge.position.set(0, bodyY, frontZ + 0.0006);
    group.add(edge);

    /* ekran: najpierw plakat filmu, po załadowaniu klatki sam film */
    const posterTex = new THREE.TextureLoader().load(videoEl.getAttribute('poster') || '');
    posterTex.colorSpace = THREE.SRGBColorSpace;
    posterTex.anisotropy = maxAnisotropy;
    const videoTex = new THREE.VideoTexture(videoEl);
    videoTex.colorSpace = THREE.SRGBColorSpace;
    const screenMat = new THREE.MeshBasicMaterial({ map: posterTex, toneMapped: false });
    const screenZ = frontZ + 0.0005;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W, SCREEN_H), screenMat);
    screen.position.z = screenZ;
    group.add(screen);

    const glare = new THREE.Mesh(
        new THREE.PlaneGeometry(SCREEN_W, SCREEN_H),
        new THREE.MeshBasicMaterial({
            transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending,
            map: canvasTexture(THREE, 1024, 576, (ctx, w, h) => {
                const g = ctx.createLinearGradient(0, 0, w, h);
                g.addColorStop(0, 'rgba(255,255,255,0.10)');
                g.addColorStop(0.35, 'rgba(255,255,255,0.03)');
                g.addColorStop(0.36, 'rgba(255,255,255,0)');
                g.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
            }),
        })
    );
    glare.position.z = screenZ + 0.001;
    group.add(glare);

    /* logo na dolnej ramce i dioda */
    const logo = new THREE.Mesh(
        new THREE.PlaneGeometry(0.44, 0.055),
        new THREE.MeshBasicMaterial({
            transparent: true, depthWrite: false, toneMapped: false,
            map: canvasTexture(THREE, 2048, 256, (ctx, w, h) => {
                const text = 'T-OLIMPIANS';
                ctx.font = '700 140px Syne, sans-serif';
                ctx.textBaseline = 'middle';
                const spacing = 36;
                const total = [...text].reduce((s, ch) => s + ctx.measureText(ch).width + spacing, -spacing);
                const g = ctx.createLinearGradient((w - total) / 2, 0, (w + total) / 2, 0);
                g.addColorStop(0, '#60a5fa');
                g.addColorStop(1, '#a78bfa');
                ctx.fillStyle = g;
                let x = (w - total) / 2;
                for (const ch of text) {
                    ctx.fillText(ch, x, h / 2 + 8);
                    x += ctx.measureText(ch).width + spacing;
                }
            }),
        })
    );
    logo.position.set(0, -SCREEN_H / 2 - CHIN / 2, screenZ);
    group.add(logo);

    const led = new THREE.Mesh(new THREE.CircleGeometry(0.007, 32), new THREE.MeshBasicMaterial({ color: 0x60a5fa, toneMapped: false }));
    led.position.set(SCREEN_W / 2 - 0.04, -SCREEN_H / 2 - CHIN / 2, screenZ);
    group.add(led);

    /* świecący pasek z tyłu obudowy */
    const strip = new THREE.Mesh(
        new THREE.BoxGeometry(1.1, 0.012, 0.012),
        new THREE.MeshBasicMaterial({
            toneMapped: false,
            map: canvasTexture(THREE, 256, 4, (ctx, w, h) => {
                const g = ctx.createLinearGradient(0, 0, w, 0);
                g.addColorStop(0, '#3b82f6');
                g.addColorStop(0.5, '#7c3aed');
                g.addColorStop(1, '#06b6d4');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
            }),
        })
    );
    strip.position.set(0, -0.44, -0.1);
    group.add(strip);

    return {
        group,
        update(time) {
            edgeTex.rotation = -time * 0.785;   // pełny obrót w 8 s, jak na stronie
            if (screenMat.map !== videoTex && videoEl.readyState >= 2) {
                screenMat.map = videoTex;
                screenMat.needsUpdate = true;
            }
        },
    };
}

/* tłoczenie środka medalu: kula z siatką i orbitą jak w logo, gwiazdka i numer miejsca.
   Zwraca mapę kolorów, wysokości (wypukłości) i chropowatości (wypukłe = polerowane). */
function medalFace(THREE, label) {
    const S = 1024, c = S / 2;
    const draw = (ctx, base, line, orbit, star, digit, moat) => {
        ctx.fillStyle = base;
        ctx.fillRect(0, 0, S, S);
        /* kula z siatką */
        const gr = c * 0.36, gx = c, gy = c * 0.94;
        ctx.strokeStyle = line;
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(gx, gy, gr, 0, Math.PI * 2);
        ctx.stroke();
        for (const k of [0.35, 0.72]) {
            ctx.beginPath();
            ctx.ellipse(gx, gy, gr * k, gr, 0, 0, Math.PI * 2);
            ctx.stroke();
        }
        for (const k of [-0.5, 0, 0.5]) {
            const yy = gy + gr * k, half = Math.sqrt(1 - k * k) * gr;
            ctx.beginPath();
            ctx.moveTo(gx - half, yy);
            ctx.lineTo(gx + half, yy);
            ctx.stroke();
        }
        /* orbita */
        ctx.strokeStyle = orbit;
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.ellipse(gx, gy, gr * 1.55, gr * 0.42, -0.32, 0, Math.PI * 2);
        ctx.stroke();
        /* gwiazdki */
        ctx.fillStyle = star;
        drawSparkle(ctx, c + c * 0.42, c - c * 0.36, 46);
        drawSparkle(ctx, c + c * 0.55, c - c * 0.17, 22);
        /* numer miejsca z wgłębieniem dookoła, żeby odcinał się od kuli */
        ctx.font = '800 360px Syne, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = moat;
        ctx.lineWidth = 20;
        ctx.strokeText(label, c, c + 34);
        ctx.fillStyle = digit;
        ctx.fillText(label, c, c + 34);
    };

    const map = canvasTexture(THREE, S, S, ctx => {
        const g = ctx.createRadialGradient(c * 0.8, c * 0.7, 10, c, c, c);
        g.addColorStop(0, '#ffffff');
        g.addColorStop(1, '#c2c2c2');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, S, S);
        ctx.globalAlpha = 0.6;
        draw(ctx, 'rgba(0,0,0,0)', '#ffffff', '#ffffff', '#ffffff', '#ffffff', '#c8c8c8');
    });
    const heightCanvas = (ctx) => {
        const tmp = document.createElement('canvas');
        tmp.width = tmp.height = S;
        draw(tmp.getContext('2d'), '#505050', '#7a7a7a', '#8a8a8a', '#b4b4b4', '#ffffff', '#383838');
        ctx.filter = 'blur(4px)';
        ctx.drawImage(tmp, 0, 0);
    };
    const bump = canvasTexture(THREE, S, S, heightCanvas, false);
    const rough = canvasTexture(THREE, S, S, ctx => {
        draw(ctx, '#7a7a7a', '#5c5c5c', '#545454', '#4a4a4a', '#525252', '#8c8c8c');
    }, false);
    return { map, bump, rough };
}

/* emaliowany pierścień w kolorach T-Olimpians z napisem dookoła */
function enamelRing(THREE, inner) {
    return canvasTexture(THREE, 1024, 1024, (ctx, w) => {
        const c = w / 2;
        const g = ctx.createConicGradient(-Math.PI / 2, c, c);
        BRAND.forEach((col, i) => g.addColorStop(i / (BRAND.length - 1), col));
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, w);
        /* ciemniejsze brzegi pierścienia dla głębi emalii */
        const shade = ctx.createRadialGradient(c, c, c * inner, c, c, c);
        shade.addColorStop(0, 'rgba(10,10,30,0.45)');
        shade.addColorStop(0.5, 'rgba(10,10,30,0)');
        shade.addColorStop(1, 'rgba(10,10,30,0.45)');
        ctx.fillStyle = shade;
        ctx.fillRect(0, 0, w, w);

        const text = 'T-OLIMPIANS ✦ TEAM POLAND ✦ ';
        const chars = [...text];
        const r = c * (inner + 1) / 2;
        ctx.fillStyle = '#ffffff';
        ctx.font = '600 58px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        chars.forEach((ch, i) => {
            const a = -Math.PI / 2 + (i / chars.length) * Math.PI * 2;
            ctx.save();
            ctx.translate(c + Math.cos(a) * r, c + Math.sin(a) * r);
            ctx.rotate(a + Math.PI / 2);
            if (ch === '✦') drawSparkle(ctx, 0, 0, 20);
            else ctx.fillText(ch, 0, 2);
            ctx.restore();
        });
    });
}

function buildMedal(THREE, cfg, envMap) {
    const group = new THREE.Group();
    const R = 0.2, T = 0.035;
    const RING_IN = R * 0.62, RING_OUT = R * 0.86;
    const metal = new THREE.MeshStandardMaterial({ color: cfg.color, metalness: 1, roughness: 0.2, envMap });
    const face = medalFace(THREE, cfg.label);
    const faceMat = new THREE.MeshStandardMaterial({
        color: cfg.color, metalness: 1, roughness: 1, envMap,
        map: face.map, bumpMap: face.bump, bumpScale: 3.5, roughnessMap: face.rough,
    });
    const enamelTex = enamelRing(THREE, RING_IN / RING_OUT);
    const enamelMat = new THREE.MeshPhysicalMaterial({
        map: enamelTex, emissive: 0xffffff, emissiveMap: enamelTex, emissiveIntensity: 0.28,
        roughness: 0.14, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.04, envMap,
    });

    const side = new THREE.Mesh(new THREE.CylinderGeometry(R, R, T, 192, 1, true), metal);
    side.rotation.x = Math.PI / 2;
    group.add(side);
    for (const dir of [1, -1]) {
        const layer = new THREE.Group();
        if (dir < 0) layer.rotation.y = Math.PI;
        layer.position.z = dir * T / 2;
        group.add(layer);

        layer.add(new THREE.Mesh(new THREE.CircleGeometry(R, 192), faceMat));
        const ring = new THREE.Mesh(new THREE.RingGeometry(RING_IN, RING_OUT, 192, 1), enamelMat);
        ring.position.z = 0.0012;
        layer.add(ring);
        /* wypukłe obwódki: krawędź medalu i oprawa emalii */
        for (const [radius, tube] of [[R - 0.006, 0.0105], [RING_OUT, 0.0045], [RING_IN, 0.0045]]) {
            layer.add(new THREE.Mesh(new THREE.TorusGeometry(radius, tube, 24, 192), metal));
        }
    }

    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.009, 24, 64), metal);
    loop.position.y = R + 0.025;
    loop.rotation.y = Math.PI / 2;
    group.add(loop);

    /* wstążka w kolorach T-Olimpians z biało-czerwonym paskiem, lekko wygięta, satynowa */
    const ribbonTex = canvasTexture(THREE, 256, 16, (ctx, w, h) => {
        const g = ctx.createLinearGradient(0, 0, w, 0);
        g.addColorStop(0, '#3b82f6');
        g.addColorStop(1, '#7c3aed');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = '#c7d2fe';
        ctx.fillRect(0, 0, w * 0.04, h);
        ctx.fillRect(w * 0.96, 0, w * 0.04, h);
        ctx.fillStyle = '#f4f4f6';
        ctx.fillRect(w * 0.42, 0, w * 0.08, h);
        ctx.fillStyle = '#d4213d';
        ctx.fillRect(w * 0.5, 0, w * 0.08, h);
    });
    const ribbonMat = new THREE.MeshPhysicalMaterial({
        map: ribbonTex, roughness: 0.42, metalness: 0, side: THREE.DoubleSide, envMap,
        sheen: 1, sheenRoughness: 0.35, sheenColor: new THREE.Color(0xc7d2fe),
    });
    const len = 0.46, spread = 0.12;
    const tilt = Math.atan2(spread, len - 0.04);
    for (const dir of [-1, 1]) {
        const geo = new THREE.PlaneGeometry(0.1, len, 1, 32);
        const pp = geo.attributes.position;
        for (let i = 0; i < pp.count; i++) {
            const v = (pp.getY(i) + len / 2) / len;
            pp.setZ(i, -0.05 * v * v);
        }
        geo.computeVertexNormals();
        const strip = new THREE.Mesh(geo, ribbonMat);
        strip.position.set(dir * spread / 2, R + 0.03 + len / 2, dir * 0.004);
        strip.rotation.z = -dir * tilt;
        group.add(strip);
    }
    return group;
}

/* drobne iskierki i czteroramienne gwiazdki w kolorach strony, wyraźniejsze w trakcie animacji */
function buildSparkles(THREE) {
    const group = new THREE.Group();
    const palette = [0x60a5fa, 0xa78bfa, 0x06b6d4, 0xf3c34f].map(c => new THREE.Color(c));
    const layers = [
        { count: 50, size: 0.03, opacity: [0.3, 0.55], sprite: (ctx, w) => {
            const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
            g.addColorStop(0, 'rgba(255,255,255,1)');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, w);
        } },
        { count: 18, size: 0.085, opacity: [0.35, 0.6], sprite: (ctx, w) => {
            const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w * 0.12);
            g.addColorStop(0, 'rgba(255,255,255,0.9)');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, w);
            ctx.fillStyle = '#ffffff';
            drawSparkle(ctx, w / 2, w / 2, w * 0.46);
        } },
    ];
    const sets = layers.map(L => {
        const pos = new Float32Array(L.count * 3);
        const col = new Float32Array(L.count * 3);
        const speed = new Float32Array(L.count);
        for (let i = 0; i < L.count; i++) {
            pos[i * 3]     = lerp(-1.4, 1.5, Math.random());
            pos[i * 3 + 1] = lerp(-0.8, 1.0, Math.random());
            pos[i * 3 + 2] = lerp(-0.5, 0.9, Math.random());
            palette[i % palette.length].toArray(col, i * 3);
            speed[i] = lerp(0.03, 0.09, Math.random());
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
        const mat = new THREE.PointsMaterial({
            size: L.size, vertexColors: true, transparent: true, depthWrite: false, toneMapped: false,
            blending: THREE.AdditiveBlending, opacity: L.opacity[0],
            map: canvasTexture(THREE, 128, 128, L.sprite),
        });
        group.add(new THREE.Points(geo, mat));
        return { L, pos, speed, geo, mat };
    });
    return {
        group,
        update(dt, time, p) {
            sets.forEach(({ L, pos, speed, geo, mat }, k) => {
                for (let i = 0; i < L.count; i++) {
                    pos[i * 3 + 1] += speed[i] * dt;
                    if (pos[i * 3 + 1] > 1.0) pos[i * 3 + 1] = -0.8;
                }
                geo.attributes.position.needsUpdate = true;
                mat.opacity = (L.opacity[0] + L.opacity[1] * p) * (k ? 0.75 + 0.25 * Math.sin(time * 2.2) : 1);
            });
        },
    };
}
