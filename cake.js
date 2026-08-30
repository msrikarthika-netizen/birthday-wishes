// ─── Custom Cursor ───
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
});

// ─── Stars ───
const starsWrap = document.getElementById('starsWrap');
for (let i = 0; i < 130; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const sz = Math.random() * 3 + 1;
    s.style.cssText = `
        width:${sz}px; height:${sz}px;
        left:${Math.random()*100}vw; top:${Math.random()*100}vh;
        --td:${(Math.random()*3+2).toFixed(1)}s;
        --delay:${(Math.random()*4).toFixed(1)}s;
    `;
    starsWrap.appendChild(s);
}

// ─── Build Candles ───
const candlesRow = document.getElementById('candlesRow');
const NUM_CANDLES = 5;
let blownOut = 0;

const candleEls = [];

for (let i = 0; i < NUM_CANDLES; i++) {
    const candle = document.createElement('div');
    candle.className = 'candle';
    candle.innerHTML = `
        <div class="candle-smoke" id="smoke${i}"></div>
        <div class="candle-flame" id="flame${i}"></div>
        <div class="candle-wick"></div>
        <div class="candle-body"></div>
    `;
    candle.addEventListener('click', () => blowCandle(i));
    candlesRow.appendChild(candle);
    candleEls.push(candle);
}

// ─── Blow Single Candle ───
function blowCandle(index) {
    const flame = document.getElementById(`flame${index}`);
    const smoke = document.getElementById(`smoke${index}`);

    if (flame.classList.contains('out')) return; // already blown

    // Animate flame out with GSAP
    gsap.to(flame, {
        scaleX: 1.5, scaleY: 0, opacity: 0,
        duration: 0.3, ease: "power2.in",
        onComplete: () => {
            flame.classList.add('out');
            flame.style.transform = '';
            flame.style.opacity = '';
        }
    });

    // Smoke puff
    smoke.classList.add('smoking');
    setTimeout(() => smoke.classList.remove('smoking'), 1600);

    blownOut++;
    checkAllBlown();
}

// ─── Blow All Button ───
const blowAllBtn = document.getElementById('blowAllBtn');
blowAllBtn.addEventListener('click', () => {
    gsap.to(blowAllBtn, { scale: 0.9, duration: 0.1, yoyo: true, repeat: 1 });
    for (let i = 0; i < NUM_CANDLES; i++) {
        setTimeout(() => blowCandle(i), i * 200);
    }
});

// ─── Check All Blown ───
function checkAllBlown() {
    if (blownOut >= NUM_CANDLES) {
        // Hide blow all button
        gsap.to(blowAllBtn, { opacity: 0, duration: 0.4, onComplete: () => blowAllBtn.style.display = 'none' });

        // Fire confetti
        launchConfetti();

        // Show wish card after short delay
        setTimeout(showWish, 800);
    }
}

// ─── Confetti ───
const confettiLayer = document.getElementById('confettiLayer');
const CONFETTI_COLORS = ['#ff69b4','#fbbf24','#34d399','#60a5fa','#f472b6','#a78bfa','#fb923c','#fff'];

function launchConfetti() {
    for (let i = 0; i < 120; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = (Math.random() * 100) + 'vw';
            piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
            piece.style.width  = (Math.random() * 10 + 6) + 'px';
            piece.style.height = (Math.random() * 10 + 6) + 'px';
            piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
            const dur = Math.random() * 2 + 2;
            piece.style.animationDuration = dur + 's';
            piece.style.setProperty('--cx', (Math.random() * 200 - 100) + 'px');
            confettiLayer.appendChild(piece);
            setTimeout(() => piece.remove(), (dur + 0.5) * 1000);
        }, i * 30);
    }
    // Re-fire confetti waves
    setTimeout(launchConfetti2, 1500);
}

function launchConfetti2() {
    for (let i = 0; i < 60; i++) {
        setTimeout(() => {
            const piece = document.createElement('div');
            piece.className = 'confetti-piece';
            piece.style.left = (Math.random() * 100) + 'vw';
            piece.style.background = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
            piece.style.width  = (Math.random() * 8 + 5) + 'px';
            piece.style.height = (Math.random() * 8 + 5) + 'px';
            const dur = Math.random() * 2 + 2;
            piece.style.animationDuration = dur + 's';
            piece.style.setProperty('--cx', (Math.random() * 200 - 100) + 'px');
            confettiLayer.appendChild(piece);
            setTimeout(() => piece.remove(), (dur + 0.5) * 1000);
        }, i * 40);
    }
}

// ─── Show Wish Reveal ───
function showWish() {
    const wishReveal = document.getElementById('wishReveal');
    wishReveal.classList.add('visible');

    // Animate cake scene shrinking a bit
    gsap.to('#cakeScene', { scale: 0.85, opacity: 0.5, duration: 0.8, ease: "power2.inOut" });

    // Scroll to wish
    setTimeout(() => wishReveal.scrollIntoView({ behavior: 'smooth', block: 'center' }), 400);

    // Floating hearts celebration
    for (let i = 0; i < 20; i++) {
        setTimeout(() => spawnHeart(), i * 150);
    }
}

function spawnHeart() {
    const el = document.createElement('div');
    el.textContent = ['💖','💗','💕','💝','✨','🎉'][Math.floor(Math.random() * 6)];
    el.style.cssText = `
        position:fixed; pointer-events:none; z-index:200;
        font-size: ${Math.random()*20+18}px;
        left: ${Math.random()*100}vw;
        bottom: -40px;
    `;
    document.body.appendChild(el);
    gsap.to(el, {
        y: -(Math.random() * 600 + 300),
        x: Math.random() * 100 - 50,
        opacity: 0, duration: Math.random() * 2 + 2,
        ease: "power1.out",
        onComplete: () => el.remove()
    });
}

// ─── Next Page Button ───
document.getElementById('wishNextBtn').addEventListener('click', () => {
    for (let i = 0; i < 10; i++) setTimeout(spawnHeart, i * 80);
    gsap.to('body', {
        opacity: 0, duration: 1, delay: 0.3,
        onComplete: () => { window.location.href = 'last.html'; }
    });
});

// ─── Entrance Animations ───
window.addEventListener('load', () => {
    gsap.from('#cakeScene', { y: 40, opacity: 0, duration: 1, delay: 1, ease: "power3.out" });
    gsap.from('.blow-btn',  { y: 20, opacity: 0, duration: 0.8, delay: 1.4, ease: "back.out" });
});
