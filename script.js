// ─── Custom Heart Cursor ───
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
});
document.addEventListener('click', () => {
    cursor.classList.add('clicked');
    setTimeout(() => cursor.classList.remove('clicked'), 300);
});

// ─── Particle Canvas Background ───
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
});

const particles = [];
const PARTICLE_COLORS = ['#ff69b4','#da70d6','#f9a8d4','#c084fc','#fbbf24'];
class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x     = Math.random() * canvas.width;
        this.y     = Math.random() * canvas.height;
        this.r     = Math.random() * 3 + 1;
        this.color = PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)];
        this.alpha = Math.random() * 0.5 + 0.2;
        this.vx    = (Math.random() - 0.5) * 0.4;
        this.vy    = (Math.random() - 0.5) * 0.4;
        this.life  = Math.random() * 200 + 100;
    }
    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle   = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life--;
        if (this.life <= 0) this.reset();
    }
}
for (let i = 0; i < 120; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.draw(); p.update(); });
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ─── Falling Petals ───
const petalContainer = document.getElementById('petals');
const PETALS = ['🌸', '🌺', '💮', '🌷', '✿'];
function createPetal() {
    const el = document.createElement('span');
    el.className  = 'petal';
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    el.style.left     = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 14 + 10) + 'px';
    const dur = Math.random() * 6 + 6;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay    = Math.random() * 5 + 's';
    petalContainer.appendChild(el);
    setTimeout(() => el.remove(), (dur + 5) * 1000);
}
for (let i = 0; i < 20; i++) createPetal();
setInterval(createPetal, 1200);

// ─── Typing Effect ───
const greetingText = "Hey You Know What! You're the most adorable human I ever met! 💖";
const greetingEl   = document.getElementById('greeting');
let charIndex = 0;

function typeGreeting() {
    if (charIndex < greetingText.length) {
        greetingEl.textContent += greetingText.charAt(charIndex);
        charIndex++;
        setTimeout(typeGreeting, 80);
    }
}

// ─── GSAP Floating Emoji Burst ───
const floatingEmojis = ['💖', '✨', '🌸', '💫', '💕', '🦋', '⭐', '🎀', '🌷', '💝'];
function createFloating() {
    const el = document.createElement('div');
    el.className    = 'floating';
    el.textContent  = floatingEmojis[Math.floor(Math.random() * floatingEmojis.length)];
    el.style.left   = Math.random() * 100 + 'vw';
    el.style.top    = (Math.random() * 60 + 20) + 'vh';
    el.style.fontSize = (Math.random() * 22 + 16) + 'px';
    document.body.appendChild(el);
    gsap.to(el, {
        y: -500,
        x: Math.random() * 120 - 60,
        rotation: Math.random() * 360,
        duration: Math.random() * 5 + 5,
        opacity: 1,
        ease: "none",
        onComplete: () => el.remove()
    });
}

// ─── Page Load Animations ───
window.addEventListener('load', () => {
    // Animate titles
    gsap.to('#mainTitle', { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
    gsap.to('#nameTitle', { opacity: 1, y: 0, duration: 1, delay: 0.3, ease: "power3.out" });

    // Start typing after titles appear
    setTimeout(typeGreeting, 1600);

    // Animate button in
    gsap.to('#ctaBtn', { opacity: 1, y: 0, duration: 0.8, delay: 2.2, ease: "back.out(1.7)" });

    // Periodic floating emojis
    setInterval(createFloating, 1000);
});

// ─── Button Hover & Click ───
const ctaBtn = document.getElementById('ctaBtn');

ctaBtn.addEventListener('mouseenter', () => gsap.to(ctaBtn, { scale: 1.08, duration: 0.3 }));
ctaBtn.addEventListener('mouseleave', () => gsap.to(ctaBtn, { scale: 1, duration: 0.3 }));

ctaBtn.addEventListener('click', () => {
    // Burst of emojis on click
    for (let i = 0; i < 12; i++) setTimeout(createFloating, i * 80);

    // Fade out and navigate
    gsap.to('body', {
        opacity: 0,
        duration: 1,
        delay: 0.3,
        onComplete: () => { window.location.href = 'cause.html'; }
    });
});