const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let particles = [];
let sparks = [];

const HEART_SIZE = 9;
const PARTICLE_COUNT = 1200;
const MERGE_SPEED = 0.018;

// ❤️ Perfect heart coordinates
function heartPoint(angle) {
    const x = 16 * Math.pow(Math.sin(angle), 3);
    const y =
        13 * Math.cos(angle) -
        5 * Math.cos(2 * angle) -
        2 * Math.cos(3 * angle) -
        Math.cos(4 * angle);
    return { x, y };
}

// 🌟 Magical colors
const galaxyColors = [
    "#ff2049",
    "#ff3f73",
    "#ff5c97",
    "#ff79bb",
    "#ff97da",
    "#ffb7f7",
    "#ff57a3",
];

// ✨ Heart Particle class
class Particle {
    constructor(layer = 1) {
        this.layer = layer; // inner or outer heart
        this.reset();
    }

    reset() {
        this.x = canvas.width / 2 + (Math.random() - 0.5) * 200;
        this.y = canvas.height / 2 + (Math.random() - 0.5) * 200;

        const angle = Math.random() * Math.PI * 2;
        const p = heartPoint(angle);

        const sizeBoost = this.layer === 1 ? HEART_SIZE : HEART_SIZE + 4;

        this.tx = canvas.width / 2 + p.x * sizeBoost;
        this.ty = canvas.height / 2 - p.y * sizeBoost;

        this.vx = (Math.random() - 0.5) * 3;
        this.vy = (Math.random() - 0.5) * 3;

        this.color =
            galaxyColors[Math.floor(Math.random() * galaxyColors.length)];

        this.size = this.layer === 1
            ? Math.random() * 2 + 1.2
            : Math.random() * 2 + 1.8;
    }

    update() {
        this.x += (this.tx - this.x) * MERGE_SPEED;
        this.y += (this.ty - this.y) * MERGE_SPEED;

        // floating
        this.x += Math.sin(Date.now() * 0.002 + this.tx) * 0.15;
        this.y += Math.cos(Date.now() * 0.002 + this.ty) * 0.15;

        // Light heartbeat pulse
        const pulse = Math.sin(Date.now() * 0.003) * 3;
        this.tx += pulse * 0.03;
        this.ty += pulse * 0.03;

        // Random spark chance
        if (Math.random() < 0.003) createSpark(this.x, this.y);
    }

    draw() {
        ctx.beginPath();
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// ⭐ Spark particle (burst effects)
class Spark {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 2 + 1;
        this.life = 30;
        this.color = "#ff5ea7";
        this.vx = (Math.random() - 0.5) * 6;
        this.vy = (Math.random() - 0.5) * 6;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Spark creator
function createSpark(x, y) {
    for (let i = 0; i < 8; i++) sparks.push(new Spark(x, y));
}

// Create particles (inner + outer heart)
for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push(new Particle(i % 2 === 0 ? 1 : 2));
}

// Smooth animation
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach((p) => {
        p.update();
        p.draw();
    });

    // Sparks
    sparks.forEach((s, i) => {
        s.update();
        s.draw();
        if (s.life <= 0) sparks.splice(i, 1);
    });

    requestAnimationFrame(animate);
}

animate();
