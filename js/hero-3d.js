/* ── HERO 3D ──
   Film z finału OI na ekranie monitora 3D i medale, które przy przewijaniu
   wylatują zza monitora. Gdy WebGL nie działa, zostaje zwykły film w ramce. */

const media = document.querySelector('.hero-media');
const video = media && media.querySelector('video');
const hero  = media && media.closest('.hero');

if (media && video && hero && webglAvailable()) {
    const start = () => init().catch(err => { console.warn('hero-3d:', err); });
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

/* wymiary monitora w jednostkach sceny; środek ekranu jest w (0, 0, 0) */
const SCREEN_W = 1.6, SCREEN_H = 0.9;
const BEZEL = 0.03, CHIN = 0.1;

/* medale: skąd wylatują (zza monitora) i gdzie lądują (przed monitorem, przy nóżce) */
const MEDALS = [
    { color: 0xf5c451, label: '1', from: [ 0.62,  0.40, -0.24], to: [ 0.02, -0.40, 0.78], bulge: [ 0.22, 0.38, 0], delay: 0.00, turns:  1, yaw: -0.20 },
    { color: 0xdfe3ea, label: '2', from: [-0.70,  0.10, -0.26], to: [-0.56, -0.50, 0.60], bulge: [-0.22, 0.32, 0], delay: 0.08, turns: -1, yaw:  0.40 },
    { color: 0xd08a52, label: '3', from: [ 0.74, -0.30, -0.26], to: [ 0.58, -0.54, 0.56], bulge: [ 0.20, 0.28, 0], delay: 0.16, turns:  1, yaw: -0.45 },
];

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

    const medals = MEDALS.map(cfg => {
        const m = buildMedal(THREE, cfg, studioEnv);
        stage.add(m);
        return { cfg, obj: m };
    });

    const sparkles = buildSparkles(THREE);
    stage.add(sparkles.points);

    /* rozmiar: płótno jest większe niż ramka filmu, żeby medale mogły wylecieć poza monitor */
    function resize() {
        const box  = media.getBoundingClientRect();
        const vid  = video.getBoundingClientRect();
        const w = Math.round(box.width * 1.75);
        const h = Math.round(box.width * 1.5);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
        renderer.setSize(w, h, false);
        canvas.style.width  = w + 'px';
        canvas.style.height = h + 'px';
        const ppu = (vid.width || box.width) / SCREEN_W;   // piksele na jednostkę sceny
        const visibleH = h / ppu;
        camera.aspect = w / h;
        camera.position.set(0, 0, visibleH / (2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))));
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
    }
    resize();
    new ResizeObserver(resize).observe(media);

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
            const arc = Math.sin(Math.PI * t);
            obj.position.set(
                lerp(cfg.from[0], cfg.to[0], t) + cfg.bulge[0] * arc,
                lerp(cfg.from[1], cfg.to[1], t) + cfg.bulge[1] * arc + Math.sin(time * 1.3 + i * 2) * 0.02,
                lerp(cfg.from[2], cfg.to[2], t) + cfg.bulge[2] * arc
            );
            obj.rotation.y = cfg.yaw * t + cfg.turns * Math.PI * 2 * t + Math.sin(time * 0.7 + i) * 0.25;
            obj.rotation.x = lerp(-0.18, 0.08, t);
            obj.rotation.z = Math.sin(time * 0.9 + i) * 0.06;
            obj.scale.setScalar(lerp(0.82, 1, t));
        });

        sparkles.update(dt, time, p);
        monitor.update();
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

function roundedRect(THREE, w, h, r) {
    const s = new THREE.Shape();
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
        depth: depth - 2 * bevel, bevelEnabled: true, bevelThickness: bevel, bevelSize: bevel, bevelSegments: 4, curveSegments: 12,
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
    t.anisotropy = 4;
    return t;
}

function buildMonitor(THREE, videoEl) {
    const group = new THREE.Group();
    const bodyW = SCREEN_W + 2 * BEZEL, bodyH = SCREEN_H + BEZEL + CHIN;
    const bodyY = (BEZEL - CHIN) / 2;

    const bodyMat  = new THREE.MeshPhysicalMaterial({ color: 0x15161e, metalness: 0.55, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.22 });
    const rearMat  = new THREE.MeshStandardMaterial({ color: 0x1c1e29, metalness: 0.7, roughness: 0.38 });
    const standMat = new THREE.MeshStandardMaterial({ color: 0x9aa3b5, metalness: 1, roughness: 0.26 });

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

    const base = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 0.028, 64), standMat);
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

    /* ekran: najpierw plakat filmu, po załadowaniu klatki sam film */
    const posterTex = new THREE.TextureLoader().load(videoEl.getAttribute('poster') || '');
    posterTex.colorSpace = THREE.SRGBColorSpace;
    const videoTex = new THREE.VideoTexture(videoEl);
    videoTex.colorSpace = THREE.SRGBColorSpace;
    const screenMat = new THREE.MeshBasicMaterial({ map: posterTex, toneMapped: false });
    const screenZ = 0.0255;
    const screen = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W, SCREEN_H), screenMat);
    screen.position.z = screenZ;
    group.add(screen);

    const glare = new THREE.Mesh(
        new THREE.PlaneGeometry(SCREEN_W, SCREEN_H),
        new THREE.MeshBasicMaterial({
            transparent: true, depthWrite: false, toneMapped: false, blending: THREE.AdditiveBlending,
            map: canvasTexture(THREE, 512, 288, (ctx, w, h) => {
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
            map: canvasTexture(THREE, 1024, 128, (ctx, w, h) => {
                const text = 'T-OLIMPIANS';
                ctx.font = '700 70px Syne, sans-serif';
                ctx.textBaseline = 'middle';
                const spacing = 18;
                const total = [...text].reduce((s, ch) => s + ctx.measureText(ch).width + spacing, -spacing);
                const g = ctx.createLinearGradient((w - total) / 2, 0, (w + total) / 2, 0);
                g.addColorStop(0, '#60a5fa');
                g.addColorStop(1, '#a78bfa');
                ctx.fillStyle = g;
                let x = (w - total) / 2;
                for (const ch of text) {
                    ctx.fillText(ch, x, h / 2 + 4);
                    x += ctx.measureText(ch).width + spacing;
                }
            }),
        })
    );
    logo.position.set(0, -SCREEN_H / 2 - CHIN / 2, screenZ);
    group.add(logo);

    const led = new THREE.Mesh(new THREE.CircleGeometry(0.007, 16), new THREE.MeshBasicMaterial({ color: 0x60a5fa, toneMapped: false }));
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
        update() {
            if (screenMat.map !== videoTex && videoEl.readyState >= 2) {
                screenMat.map = videoTex;
                screenMat.needsUpdate = true;
            }
        },
    };
}

function medalFace(THREE, label) {
    return canvasTexture(THREE, 512, 512, (ctx, w) => {
        const c = w / 2;
        const bg = ctx.createRadialGradient(c * 0.8, c * 0.7, 10, c, c, c);
        bg.addColorStop(0, '#ffffff');
        bg.addColorStop(1, '#b4b4b4');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, w);

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 10;
        ctx.beginPath();
        ctx.arc(c, c, c * 0.86, 0, Math.PI * 2);
        ctx.stroke();

        /* wieniec laurowy */
        ctx.fillStyle = '#e6e6e6';
        for (const side of [-1, 1]) {
            for (let i = 0; i < 9; i++) {
                const a = Math.PI / 2 + side * (0.35 + i * 0.22);
                const r = c * 0.68;
                ctx.save();
                ctx.translate(c + Math.cos(a) * r, c + Math.sin(a) * r);
                ctx.rotate(a + side * 0.9);
                ctx.beginPath();
                ctx.ellipse(0, 0, 26, 10, 0, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        /* napis T-OLIMPIANS po łuku u góry */
        ctx.fillStyle = '#ffffff';
        ctx.font = '500 34px "JetBrains Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        const text = 'T-OLIMPIANS';
        const step = 0.16;
        [...text].forEach((ch, i) => {
            const a = -Math.PI / 2 + (i - (text.length - 1) / 2) * step;
            ctx.save();
            ctx.translate(c + Math.cos(a) * c * 0.7, c + Math.sin(a) * c * 0.7);
            ctx.rotate(a + Math.PI / 2);
            ctx.fillText(ch, 0, 0);
            ctx.restore();
        });

        ctx.font = '800 230px Syne, sans-serif';
        ctx.fillStyle = 'rgba(0,0,0,0.25)';
        ctx.fillText(label, c + 6, c + 26);
        ctx.fillStyle = '#ffffff';
        ctx.fillText(label, c, c + 20);
    });
}

function buildMedal(THREE, cfg, envMap) {
    const group = new THREE.Group();
    const R = 0.2, T = 0.035;
    const metal = new THREE.MeshStandardMaterial({ color: cfg.color, metalness: 1, roughness: 0.24, envMap });
    const face  = medalFace(THREE, cfg.label);
    const faceMat = new THREE.MeshStandardMaterial({ color: cfg.color, metalness: 1, roughness: 0.3, map: face, bumpMap: face, bumpScale: 4, envMap });

    const side = new THREE.Mesh(new THREE.CylinderGeometry(R, R, T, 64, 1, true), metal);
    side.rotation.x = Math.PI / 2;
    group.add(side);
    for (const dir of [1, -1]) {
        const disc = new THREE.Mesh(new THREE.CircleGeometry(R, 64), faceMat);
        disc.position.z = dir * T / 2;
        if (dir < 0) disc.rotation.y = Math.PI;
        group.add(disc);
        const rim = new THREE.Mesh(new THREE.TorusGeometry(R - 0.006, 0.01, 12, 64), metal);
        rim.position.z = dir * T / 2;
        group.add(rim);
    }

    const loop = new THREE.Mesh(new THREE.TorusGeometry(0.03, 0.009, 10, 24), metal);
    loop.position.y = R + 0.025;
    loop.rotation.y = Math.PI / 2;
    group.add(loop);

    /* biało-czerwona wstążka w kształcie litery V */
    const ribbonMat = new THREE.MeshStandardMaterial({
        roughness: 0.55, metalness: 0, side: THREE.DoubleSide, envMap,
        map: canvasTexture(THREE, 64, 8, (ctx, w, h) => {
            ctx.fillStyle = '#f4f4f6';
            ctx.fillRect(0, 0, w / 2, h);
            ctx.fillStyle = '#d4213d';
            ctx.fillRect(w / 2, 0, w / 2, h);
        }),
    });
    const len = 0.46, spread = 0.12;
    const tilt = Math.atan2(spread, len - 0.04);
    for (const dir of [-1, 1]) {
        const strip = new THREE.Mesh(new THREE.PlaneGeometry(0.1, len), ribbonMat);
        strip.position.set(dir * spread / 2, R + 0.03 + len / 2, dir * 0.004);
        strip.rotation.z = -dir * tilt;
        group.add(strip);
    }
    return group;
}

/* drobne iskierki w kolorach strony, wyraźniejsze w trakcie animacji */
function buildSparkles(THREE) {
    const count = 70;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const speed = new Float32Array(count);
    const palette = [0x60a5fa, 0xa78bfa, 0x06b6d4, 0xf3c34f].map(c => new THREE.Color(c));
    for (let i = 0; i < count; i++) {
        pos[i * 3]     = lerp(-1.3, 1.4, Math.random());
        pos[i * 3 + 1] = lerp(-0.8, 0.95, Math.random());
        pos[i * 3 + 2] = lerp(-0.5, 0.9, Math.random());
        palette[i % palette.length].toArray(col, i * 3);
        speed[i] = lerp(0.03, 0.09, Math.random());
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(col, 3));
    const mat = new THREE.PointsMaterial({
        size: 0.03, vertexColors: true, transparent: true, depthWrite: false, toneMapped: false,
        blending: THREE.AdditiveBlending, opacity: 0.35,
        map: canvasTexture(THREE, 64, 64, (ctx, w) => {
            const g = ctx.createRadialGradient(w / 2, w / 2, 0, w / 2, w / 2, w / 2);
            g.addColorStop(0, 'rgba(255,255,255,1)');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, w);
        }),
    });
    const points = new THREE.Points(geo, mat);
    return {
        points,
        update(dt, time, p) {
            for (let i = 0; i < count; i++) {
                pos[i * 3 + 1] += speed[i] * dt;
                if (pos[i * 3 + 1] > 0.95) pos[i * 3 + 1] = -0.8;
            }
            geo.attributes.position.needsUpdate = true;
            mat.opacity = 0.3 + 0.55 * p;
        },
    };
}
