const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const quote = document.getElementById("quote");

let startTime = performance.now();
let heartReady = false;

function resize() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
}
resize();
addEventListener("resize", resize);

const isMobile = innerWidth < 768;

/* ===== QUALITY CONTROL ===== */

const PARTICLES = isMobile ? 320 : 900;
const STARS = isMobile ? 70 : 140;

/* ===== HEART SETTINGS ===== */

const BASE_SIZE = isMobile ? 11 : 9;

/* ===== STATE ===== */

let pulse = 1;
let tGlobal = 0;

const particles = [];
const stars = [];

/* ===== COLORS ===== */

const palette = [
    "#ff2d55",
    "#ff4f88",
    "#ff6bb5",
    "#ff8ad6",
    "#ffb3ff"
];

/* ===== HEART FORMULA ===== */

function heart(t) {
    return {
        x: 16 * Math.pow(Math.sin(t), 3),
        y:
            13 * Math.cos(t) -
            5 * Math.cos(2 * t) -
            2 * Math.cos(3 * t) -
            Math.cos(4 * t)
    };
}

/* ===== PARTICLE ===== */

class Particle {
    constructor(layer = 1) {
        this.t = Math.random() * Math.PI * 2;
        this.layer = layer;

        this.x = innerWidth / 2;
        this.y = innerHeight / 2;

        this.color =
            palette[(Math.random() * palette.length) | 0];

        this.size = layer === 1 ? 1.4 : 2.0;
    }

    update() {
        const p = heart(this.t);

        const cx = innerWidth / 2;
        const cy = innerHeight / 2 - 15;

        const scale = BASE_SIZE * pulse * (this.layer === 1 ? 1 : 1.25);

        const tx = cx + p.x * scale;
        const ty = cy - p.y * scale;

        // smoother easing (дороже но красиво)
        this.x += (tx - this.x) * 0.08;
        this.y += (ty - this.y) * 0.08;

        this.t += 0.009;
    }

    draw() {
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* ===== STARS ===== */

class Star {
    constructor() {
        this.x = Math.random() * innerWidth;
        this.y = Math.random() * innerHeight;
        this.r = Math.random() * 1.4 + 0.2;
        this.t = Math.random() * Math.PI * 2;
        this.s = Math.random() * 0.015 + 0.005;
    }

    update() {
        this.t += this.s;
    }

    draw() {
        const a = 0.3 + Math.sin(this.t) * 0.4;

        ctx.fillStyle = `rgba(255,255,255,${a})`;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

/* ===== INIT ===== */

for (let i = 0; i < PARTICLES; i++) {
    particles.push(new Particle(i % 2));
}

for (let i = 0; i < STARS; i++) {
    stars.push(new Star());
}

/* ===== LOOP ===== */

function animate(now) {
    tGlobal = now * 0.001;

    pulse = 1 + Math.sin(tGlobal * 2.2) * 0.06;

    // мягкий fade вместо clearRect (красивее + плавнее)
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(0, 0, innerWidth, innerHeight);

    // stars
    for (let s of stars) {
        s.update();
        s.draw();
    }

    // heart
    for (let p of particles) {
        p.update();
        p.draw();
    }

    // show text
    if (!heartReady && now - startTime > 1200) {
        heartReady = true;
        quote.classList.add("visible");
    }

    requestAnimationFrame(animate);
}

requestAnimationFrame(animate);