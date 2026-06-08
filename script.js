const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const quote = document.getElementById("quote");

let heartCompleted = false;
let startTime = Date.now();

function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resize();
window.addEventListener("resize", resize);

const mobile = window.innerWidth < 768;

const HEART_SIZE = mobile ? 13 : 10;
const PARTICLE_COUNT = mobile ? 700 : 1400;
const MERGE_SPEED = 0.018;

let pulse = 1;

let particles = [];
let sparks = [];
let stars = [];

// Создаем звездное небо
function createStars() {
    stars = [];

    const count = mobile ? 120 : 250;

    for (let i = 0; i < count; i++) {
        stars.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.3,
            phase: Math.random() * Math.PI * 2,
            speed: 0.01 + Math.random() * 0.02
        });
    }
}

createStars();

function heartPoint(angle) {
    const x = 16 * Math.pow(Math.sin(angle), 3);

    const y =
        13 * Math.cos(angle) -
        5 * Math.cos(2 * angle) -
        2 * Math.cos(3 * angle) -
        Math.cos(4 * angle);

    return { x, y };
}

const galaxyColors = [
    "#ff1e56",
    "#ff4f88",
    "#ff79c6",
    "#ff9de6",
    "#ffb3ff",
    "#ff66b2",
    "#ff3385",
];

class Particle {
    constructor(layer = 1) {
        this.layer = layer;

        this.angle = Math.random() * Math.PI * 2;

        this.baseX = 0;
        this.baseY = 0;

        this.reset();
    }

    reset() {
        this.x =
            canvas.width / 2 +
            (Math.random() - 0.5) * canvas.width;

        this.y =
            canvas.height / 2 +
            (Math.random() - 0.5) * canvas.height;

        this.color =
            galaxyColors[
                Math.floor(
                    Math.random() * galaxyColors.length
                )
            ];

        this.size =
            this.layer === 1
                ? Math.random() * 2 + 1
                : Math.random() * 2.5 + 1.5;
    }

    update() {
        const p = heartPoint(this.angle);

        const scale =
            this.layer === 1
                ? HEART_SIZE
                : HEART_SIZE + 4;

        this.baseX =
            canvas.width / 2 +
            p.x * scale * pulse;

        this.baseY =
            canvas.height / 2 -
            p.y * scale * pulse;

        this.x += (this.baseX - this.x) * MERGE_SPEED;
        this.y += (this.baseY - this.y) * MERGE_SPEED;

        const t = Date.now() * 0.001;

        this.x += Math.sin(t + this.angle) * 0.3;
        this.y += Math.cos(t + this.angle) * 0.3;

        if (Math.random() < 0.0015) {
            createSpark(this.x, this.y);
        }
    }

    draw() {
        ctx.beginPath();

        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;

        ctx.fillStyle = this.color;

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();
    }
}

class Spark {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.vx = (Math.random() - 0.5) * 5;
        this.vy = (Math.random() - 0.5) * 5;

        this.life = 40;

        this.size = Math.random() * 2 + 1;

        this.color =
            galaxyColors[
                Math.floor(
                    Math.random() * galaxyColors.length
                )
            ];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        this.life--;

        this.size *= 0.98;
    }

    draw() {
        ctx.beginPath();

        ctx.fillStyle = this.color;

        ctx.shadowBlur = 25;
        ctx.shadowColor = this.color;

        ctx.globalAlpha = this.life / 40;

        ctx.arc(
            this.x,
            this.y,
            this.size,
            0,
            Math.PI * 2
        );

        ctx.fill();

        ctx.globalAlpha = 1;
    }
}

function createSpark(x, y) {
    const amount = mobile ? 4 : 8;

    for (let i = 0; i < amount; i++) {
        sparks.push(new Spark(x, y));
    }
}

for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(
        new Particle(i % 2 === 0 ? 1 : 2)
    );
}

function drawStars() {
    stars.forEach(star => {
        star.phase += star.speed;

        const alpha =
            0.3 +
            (Math.sin(star.phase) + 1) * 0.35;

        ctx.beginPath();

        ctx.fillStyle = `rgba(255,255,255,${alpha})`;

        ctx.arc(
            star.x,
            star.y,
            star.r,
            0,
            Math.PI * 2
        );

        ctx.fill();
    });
}

function animate() {
    pulse =
        1 +
        Math.sin(Date.now() * 0.003) * 0.08;

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    drawStars();

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    for (let i = sparks.length - 1; i >= 0; i--) {
        sparks[i].update();
        sparks[i].draw();

        if (sparks[i].life <= 0) {
            sparks.splice(i, 1);
        }
    }

    const elapsed = Date.now() - startTime;

    if (elapsed > 5000 && !heartCompleted) {
        heartCompleted = true;

        quote.classList.add("visible");
    }

    requestAnimationFrame(animate);
}

animate();