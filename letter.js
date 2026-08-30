// ─── Custom Cursor ───
const cursor = document.querySelector('.cursor');
document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top  = e.clientY + 'px';
});

// ─── Stars Background ───
const starsBg = document.getElementById('starsBg');
for (let i = 0; i < 120; i++) {
    const s = document.createElement('div');
    s.className = 'star-dot';
    const size = Math.random() * 3 + 1;
    s.style.cssText = `
        width: ${size}px; height: ${size}px;
        left: ${Math.random() * 100}vw;
        top:  ${Math.random() * 100}vh;
        --td: ${(Math.random() * 3 + 2).toFixed(1)}s;
        --delay: ${(Math.random() * 4).toFixed(1)}s;
    `;
    starsBg.appendChild(s);
}

// ─── Falling Rose Petals ───
const petalsBg = document.getElementById('petalsBg');
const PETALS = ['🌹', '🌸', '🌺', '🌷', '✿'];
function createPetal() {
    const el = document.createElement('span');
    el.className   = 'petal';
    el.textContent = PETALS[Math.floor(Math.random() * PETALS.length)];
    el.style.left  = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 12 + 8) + 'px';
    const dur = Math.random() * 7 + 6;
    el.style.animationDuration = dur + 's';
    el.style.animationDelay    = Math.random() * 4 + 's';
    petalsBg.appendChild(el);
    setTimeout(() => el.remove(), (dur + 5) * 1000);
}
for (let i = 0; i < 18; i++) createPetal();
setInterval(createPetal, 1500);

// ─── Element References ───
const envStage    = document.getElementById('envStage');
const envelope    = document.getElementById('envelope');
const envFlap     = document.getElementById('envFlap');
const envSeal     = document.getElementById('envSeal');
const letterPaper = document.getElementById('letterPaper');
const clickHint   = document.getElementById('clickHint');
const letterNextBtn = document.getElementById('letterNextBtn');

let opened = false;

// ─── Envelope Open Sequence ───
function openEnvelope() {
    if (opened) return;
    opened = true;

    // Hide hint
    clickHint.style.opacity = '0';
    clickHint.style.transition = 'opacity 0.4s';

    // Step 1: Shake
    gsap.to(envelope, {
        rotation: -5, duration: 0.08, yoyo: true, repeat: 7, ease: 'none',
        onComplete: () => {
            // Step 2: Lift the envelope slightly
            gsap.to(envelope, { y: -10, duration: 0.35, ease: 'power2.out' });

            // Step 3: Open flap after a beat
            setTimeout(() => {
                envFlap.classList.add('open');

                // Step 4: Hide seal
                setTimeout(() => envSeal.classList.add('hidden'), 400);

                // Step 5: Fade out the entire envelope stage, then show letter
                setTimeout(() => {
                    gsap.to(envStage, {
                        opacity: 0,
                        y: -30,
                        duration: 0.7,
                        ease: 'power2.in',
                        onComplete: () => {
                            envStage.style.display = 'none';
                            revealLetter();
                        }
                    });
                }, 900);
            }, 350);
        }
    });
}

// ─── Reveal Letter ───
function revealLetter() {
    // Make letter paper visible (block) and animate in
    letterPaper.style.display = 'block';

    // Slide in from below + fade
    gsap.to(letterPaper, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out'
    });

    // Animate text lines with stagger
    setTimeout(() => {
        // Salutation
        gsap.to('.letter-salutation', {
            opacity: 1, x: 0,
            duration: 0.5, ease: 'power2.out'
        });

        // Lines one-by-one
        const lines = document.querySelectorAll('.letter-line');
        lines.forEach((line, i) => {
            gsap.to(line, {
                opacity: 1, x: 0,
                duration: 0.45,
                delay: 0.3 + i * 0.16,
                ease: 'power2.out'
            });
        });

        const totalLineDelay = 0.3 + lines.length * 0.16;

        // Signature
        gsap.to('.letter-sign', {
            opacity: 1, y: 0,
            duration: 0.5,
            delay: totalLineDelay + 0.3,
            ease: 'power2.out'
        });

        // Button wrap
        gsap.to('.letter-btn-wrap', {
            opacity: 1, y: 0,
            duration: 0.6,
            delay: totalLineDelay + 0.7,
            ease: 'back.out(1.4)'
        });
    }, 400);
}

// Click envelope to open
envelope.addEventListener('click', openEnvelope);

// ─── Next Page Button ───
letterNextBtn.addEventListener('click', () => {
    // Spawn hearts
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const h = document.createElement('div');
            h.textContent = ['💖', '💗', '💕', '✨', '🌸'][Math.floor(Math.random() * 5)];
            h.style.cssText = `
                position: fixed; pointer-events: none; z-index: 9998;
                font-size: ${Math.random() * 22 + 18}px;
                left: ${30 + Math.random() * 40}vw;
                top: ${30 + Math.random() * 40}vh;
            `;
            document.body.appendChild(h);
            gsap.to(h, {
                y: -300, opacity: 0,
                duration: 1.5, ease: 'power2.out',
                onComplete: () => h.remove()
            });
        }, i * 80);
    }

    gsap.to('body', {
        opacity: 0, duration: 0.9, delay: 0.3,
        onComplete: () => { window.location.href = 'cake.html'; }
    });
});
