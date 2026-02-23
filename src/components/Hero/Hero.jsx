import { useRef, useEffect, useState } from 'react';
import './Hero.css';
import HeroContent from './HeroContent';
import { gsap, ScrollTrigger } from '../../gsap-config';


// ── Particle system ───────────────────────────────────────────────────────────
function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, particles, isRunning = true;
    // BUG FIX: Track rafId in an object so the IntersectionObserver closure
    // always reads the live value. After cancelAnimationFrame the old integer
    // is NOT null, so plain `rafId === null` never fires the restart branch.
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
            if (s.life < 10)             currentAlpha = s.alpha * (s.life / 10);
            if (s.life > s.maxLife - 10) currentAlpha = s.alpha * ((s.maxLife - s.life) / 10);

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
    const canvasElRef      = useRef(null);
    const streaksElRef     = useRef(null);
    const scanlinesRef     = useRef(null);
    const cornerRefs       = useRef([]);
    const ctxRef           = useRef(null);

    // FIX — Hero content ref strategy:
    // HeroContent renders its own .hero-content-wrapper and positions itself
    // absolutely. Wrapping it in an extra div (as a previous version did) creates
    // a 0-height flow container inside overflow:hidden — the absolute child gets
    // clipped and the GSAP y-transform has no visual effect on it.
    //
    // Solution: do a single querySelector ONCE after mount to cache the reference.
    // This avoids the performance problem (querySelector every frame) AND the
    // layout problem (extra wrapper div clipping the content).
    const contentWrapRef = useRef(null);

    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (startAnimation && !isLoaded) setIsLoaded(true);
    }, [startAnimation, isLoaded]);

    // Cache the HeroContent wrapper element once after mount
    useEffect(() => {
        if (!heroRef.current) return;
        contentWrapRef.current = heroRef.current.querySelector('.hero-content-wrapper');
    }, []);

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

        // Re-cache in case HeroContent rendered after initial mount
        contentWrapRef.current = heroRef.current.querySelector('.hero-content-wrapper');

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

                    // Gentler on mobile — section scrolls naturally so content
                    // would vanish before the user finishes reading at full speed.
                    const contentFadeMultiplier = isMobile ? 1.1  : isTablet ? 1.3 : 1.5;
                    const streaksFadeMultiplier = isMobile ? 1.2  : isTablet ? 1.5 : 1.8;
                    const contentYTravel        = isMobile ? 50   : isTablet ? 75  : 100;

                    ScrollTrigger.create({
                        trigger: heroRef.current,
                        start: 'top top',
                        end: 'bottom top',
                        scrub: 1,
                        onUpdate: (self) => {
                            const p = self.progress;
                            if (!heroRef.current) return;

                            // All targets are pre-cached refs — zero querySelector calls per frame
                            if (contentWrapRef.current) {
                                gsap.set(contentWrapRef.current, {
                                    opacity: Math.max(0, 1 - p * contentFadeMultiplier),
                                    y: -contentYTravel * p,
                                });
                            }
                            if (canvasElRef.current)
                                gsap.set(canvasElRef.current,  { opacity: Math.max(0, 0.6 * (1 - p)) });
                            if (streaksElRef.current)
                                gsap.set(streaksElRef.current, { opacity: Math.max(0, 1 - p * streaksFadeMultiplier) });
                            if (scanlinesRef.current)
                                gsap.set(scanlinesRef.current, { opacity: Math.max(0, 1 - p) });
                            cornerRefs.current.forEach(c => {
                                if (c) gsap.set(c, { opacity: Math.max(0, 0.5 * (1 - p)) });
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
            <canvas
                ref={el => { canvasRef.current = el; canvasElRef.current = el; }}
                className="hero__canvas"
                aria-hidden="true"
            />

            {/* Light Streaks canvas — hero__rings removed (stale rename remnant) */}
            <canvas
                ref={el => { streaksCanvasRef.current = el; streaksElRef.current = el; }}
                className="hero__streaks"
                aria-hidden="true"
            />

            {/* Scanline texture */}
            <div ref={scanlinesRef} className="hero__scanlines" aria-hidden="true" />

            {/* Corner brackets — stored in ref array, no querySelectorAll needed */}
            <div ref={el => cornerRefs.current[0] = el} className="hero__corner hero__corner--tl" aria-hidden="true" />
            <div ref={el => cornerRefs.current[1] = el} className="hero__corner hero__corner--tr" aria-hidden="true" />
            <div ref={el => cornerRefs.current[2] = el} className="hero__corner hero__corner--bl" aria-hidden="true" />
            <div ref={el => cornerRefs.current[3] = el} className="hero__corner hero__corner--br" aria-hidden="true" />

            {/* HeroContent renders its own absolute-positioned .hero-content-wrapper.
                DO NOT wrap in a div — see contentWrapRef comment above. */}
            <HeroContent isLoaded={isLoaded} />
        </section>
    );
};

export default Hero;