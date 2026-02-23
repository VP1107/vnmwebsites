import { useRef, useEffect, useState } from 'react';
import './Hero.css';
import HeroContent from './HeroContent';
import { gsap, ScrollTrigger } from '../../gsap-config';


// ── Particle system ───────────────────────────────────────────────────────────
function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, particles, isRunning = true;
    // BUG FIX: Track rafId with an object so the IntersectionObserver closure
    // always reads the latest value. A plain `let rafId` in a closure gets
    // stale after cancelAnimationFrame — the old integer is not null/undefined,
    // so the "restart if rafId === null" check never fires again.
    const raf = { id: null };

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function createParticles() {
        const count = window.innerWidth < 768 ? 60 : 120;
        particles = Array.from({ length: count }, () => ({
            x:     Math.random() * W,
            y:     Math.random() * H,
            vx:    (Math.random() - 0.5) * 0.4,
            vy:    (Math.random() - 0.5) * 0.4,
            size:  Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.6 ? '#38bdf8' : '#ffffff',
        }));
    }

    function draw() {
        if (!isRunning) { raf.id = null; return; }
        raf.id = requestAnimationFrame(draw);
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
            ctx.globalAlpha = p.alpha;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
        });
        ctx.globalAlpha = 1;
    }

    resize();
    createParticles();
    draw();

    const resizeHandler = () => { resize(); createParticles(); };
    window.addEventListener('resize', resizeHandler, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
        isRunning = entry.isIntersecting;
        // BUG FIX: Check raf.id instead of the old local rafId variable.
        // After cancelAnimationFrame the old integer is NOT null/undefined,
        // so raf.id is set to null explicitly in draw() when stopping.
        if (isRunning && raf.id === null) draw();
    }, { threshold: 0.1 });
    observer.observe(canvas);

    return () => {
        isRunning = false;
        cancelAnimationFrame(raf.id);
        raf.id = null;
        window.removeEventListener('resize', resizeHandler);
        observer.disconnect();
    };
}

// ── Horizontal Light Streaks ──────────────────────────────────────────────────
function initLightStreaks(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, streaks = [], isRunning = true;
    // BUG FIX: Same rafId tracking fix as initParticles above.
    const raf = { id: null };

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width  = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width  = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function spawnStreak() {
        const goRight = Math.random() < 0.5;
        streaks.push({
            x:       goRight ? -200 : W + 200,
            y:       Math.random() * H,
            length:  Math.random() * 300 + 100,
            speed:   (Math.random() * 15 + 10) * (goRight ? 1 : -1),
            width:   Math.random() * 2 + 1,
            alpha:   Math.random() * 0.4 + 0.1,
            color:   Math.random() > 0.7 ? '#38bdf8' : '#ffffff',
            life:    0,
            maxLife: Math.random() * 100 + 50,
        });
    }

    for (let i = 0; i < 5; i++) spawnStreak();
    const spawnInterval = setInterval(spawnStreak, 400);

    function draw() {
        if (!isRunning) { raf.id = null; return; }
        raf.id = requestAnimationFrame(draw);
        ctx.clearRect(0, 0, W, H);

        streaks = streaks.filter(s =>
            s.x > -500 && s.x < W + 500 && s.life < s.maxLife
        );

        streaks.forEach(s => {
            s.x += s.speed;
            s.life++;

            let currentAlpha = s.alpha;
            if (s.life < 10)                    currentAlpha = s.alpha * (s.life / 10);
            if (s.life > s.maxLife - 10)        currentAlpha = s.alpha * ((s.maxLife - s.life) / 10);

            const startX = s.speed > 0 ? s.x - s.length : s.x;
            const tailX  = s.x - s.length * (s.speed > 0 ? 1 : -1);

            if (!Number.isFinite(s.x) || !Number.isFinite(s.y) ||
                !Number.isFinite(tailX) || !Number.isFinite(s.length)) return;

            try {
                const grad = ctx.createLinearGradient(s.x, s.y, tailX, s.y);
                grad.addColorStop(0, s.color);
                grad.addColorStop(1, 'transparent');
                ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha));
                ctx.fillStyle = grad;
                ctx.fillRect(startX, s.y, s.length, s.width);
            } catch {
                // Ignore gradient errors
            }
        });

        ctx.globalAlpha = 1;
    }

    resize();
    draw();

    const resizeHandler = () => resize();
    window.addEventListener('resize', resizeHandler, { passive: true });

    const observer = new IntersectionObserver(([entry]) => {
        isRunning = entry.isIntersecting;
        // BUG FIX: Same fix — raf.id is explicitly nulled when the loop stops.
        if (isRunning && raf.id === null) draw();
    }, { threshold: 0.1 });
    observer.observe(canvas);

    return () => {
        isRunning = false;
        cancelAnimationFrame(raf.id);
        raf.id = null;
        clearInterval(spawnInterval);
        window.removeEventListener('resize', resizeHandler);
        observer.disconnect();
    };
}

// ─────────────────────────────────────────────────────────────────────────────

const Hero = ({ startAnimation = false }) => {
    const heroRef          = useRef(null);
    const canvasRef        = useRef(null);
    const streaksCanvasRef = useRef(null);
    // Store direct refs to child elements so the scroll onUpdate
    // does not call querySelector() on every frame (expensive).
    const contentWrapRef   = useRef(null);
    const canvasElRef      = useRef(null);    // same as canvasRef but aliased for clarity
    const streaksElRef     = useRef(null);    // same as streaksCanvasRef
    const scanlinesRef     = useRef(null);
    const cornerRefs       = useRef([]);
    const ctxRef           = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (startAnimation && !isLoaded) setIsLoaded(true);
    }, [startAnimation, isLoaded]);

    // Particle canvas
    useEffect(() => {
        if (!canvasRef.current) return;
        return initParticles(canvasRef.current);
    }, []);

    // Streaks canvas
    useEffect(() => {
        if (!streaksCanvasRef.current) return;
        return initLightStreaks(streaksCanvasRef.current);
    }, []);

    // Scroll destruction
    useEffect(() => {
        if (!heroRef.current || !isLoaded) return;

        const timer = setTimeout(() => {
            const mm = gsap.matchMedia(heroRef);

            mm.add(
                {
                    isDesktop: '(min-width: 1024px)',
                    isTablet:  '(min-width: 768px) and (max-width: 1023px)',
                    isMobile:  '(max-width: 767px)',
                },
                (context) => {
                    const { isDesktop, isTablet, isMobile } = context.conditions;

                    // ── Responsive scroll destruction values ──────────────
                    // On mobile the section scrolls naturally (not pinned) so
                    // the content fade needs to be gentler or it disappears
                    // too fast before the user has read it.
                    const contentFadeMultiplier = isMobile ? 1.1 : 1.5;
                    const streaksFadeMultiplier = isMobile ? 1.2 : 1.8;
                    const contentYTravel        = isMobile ? 50  : isTablet ? 75 : 100;

                    ScrollTrigger.create({
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1,
                        onUpdate: (self) => {
                            const progress = self.progress;
                            if (!heroRef.current) return;

                            // BUG FIX: Use stored refs instead of querySelector()
                            // on every frame. querySelector causes style/layout
                            // recalculations each call which tanks scroll performance.
                            if (contentWrapRef.current) {
                                gsap.set(contentWrapRef.current, {
                                    opacity: 1 - progress * contentFadeMultiplier,
                                    y: -contentYTravel * progress,
                                });
                            }
                            if (canvasElRef.current) {
                                gsap.set(canvasElRef.current, {
                                    opacity: 0.6 * (1 - progress),
                                });
                            }
                            if (streaksElRef.current) {
                                gsap.set(streaksElRef.current, {
                                    opacity: 1 - progress * streaksFadeMultiplier,
                                });
                            }
                            if (scanlinesRef.current) {
                                gsap.set(scanlinesRef.current, { opacity: 1 - progress });
                            }
                            cornerRefs.current.forEach(c => {
                                if (c) gsap.set(c, { opacity: 0.5 * (1 - progress) });
                            });
                        },
                    });
                }
            );

            ctxRef.current = mm;
        }, 2000);

        return () => {
            clearTimeout(timer);
            ctxRef.current?.revert();
        };
    }, [isLoaded]);

    return (
        <section
            ref={heroRef}
            className="hero-section"
            style={{
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                background: '#000',
                cursor: 'none',
            }}
        >
            {/* Particle canvas */}
            {/* BUG FIX: ref forwarded to canvasElRef for use in scroll onUpdate */}
            <canvas
                ref={el => { canvasRef.current = el; canvasElRef.current = el; }}
                className="hero__canvas"
                aria-hidden="true"
            />

            {/* Light Streaks canvas */}
            {/* BUG FIX: Removed stale leftover class `hero__rings` — that class
                was from the old pulse-rings implementation and no longer applies.
                The selector used in onUpdate has been updated to use a ref so
                the class name doesn't matter for GSAP targeting. */}
            <canvas
                ref={el => { streaksCanvasRef.current = el; streaksElRef.current = el; }}
                className="hero__streaks"
                aria-hidden="true"
            />

            {/* Scanline texture */}
            <div ref={scanlinesRef} className="hero__scanlines" aria-hidden="true" />

            {/* Corner brackets */}
            {/* BUG FIX: Collect corners into a ref array instead of querySelectorAll */}
            <div ref={el => cornerRefs.current[0] = el} className="hero__corner hero__corner--tl" aria-hidden="true" />
            <div ref={el => cornerRefs.current[1] = el} className="hero__corner hero__corner--tr" aria-hidden="true" />
            <div ref={el => cornerRefs.current[2] = el} className="hero__corner hero__corner--bl" aria-hidden="true" />
            <div ref={el => cornerRefs.current[3] = el} className="hero__corner hero__corner--br" aria-hidden="true" />

            {/* Content — ref forwarded so scroll onUpdate can target it */}
            {/* BUG FIX: contentWrapRef targets the wrapper div directly instead
                of querying for '.hero-content-wrapper' on every scroll frame. */}
            <div ref={contentWrapRef} className="hero-content-wrapper">
                <HeroContent isLoaded={isLoaded} />
            </div>
        </section>
    );
};

export default Hero;