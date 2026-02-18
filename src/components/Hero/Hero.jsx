import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Hero.css';
import HeroContent from './HeroContent';

gsap.registerPlugin(ScrollTrigger);

// ── Particle system ───────────────────────────────────────────────────────────
function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, particles, rafId, isRunning = true;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function createParticles() {
        const count = window.innerWidth < 768 ? 60 : 120;
        particles = Array.from({ length: count }, () => ({
            x: Math.random() * W,
            y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            size: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.5 + 0.1,
            color: Math.random() > 0.6 ? '#38bdf8' : '#ffffff',
        }));
    }

    function draw() {
        if (!isRunning) return;
        rafId = requestAnimationFrame(draw);
        ctx.clearRect(0, 0, W, H);
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0) p.x = W;
            if (p.x > W) p.x = 0;
            if (p.y < 0) p.y = H;
            if (p.y > H) p.y = 0;
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

    const observer = new IntersectionObserver(
        ([entry]) => {
            isRunning = entry.isIntersecting;
            if (isRunning && rafId === null) draw();
        },
        { threshold: 0.1 }
    );
    observer.observe(canvas);

    return () => {
        isRunning = false;
        cancelAnimationFrame(rafId);
        window.removeEventListener('resize', resizeHandler);
        observer.disconnect();
    };
}

// ── Horizontal Light Streaks ──────────────────────────────────────────────────
function initLightStreaks(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, streaks = [], rafId, isRunning = true;

    function resize() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W * dpr;
        canvas.height = H * dpr;
        canvas.style.width = W + 'px';
        canvas.style.height = H + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
    }

    function spawnStreak() {
        const y = Math.random() * H;
        streaks.push({
            x: Math.random() < 0.5 ? -200 : W + 200, // Spawn off-screen
            y: y,
            length: Math.random() * 300 + 100,
            speed: (Math.random() * 15 + 10) * (Math.random() < 0.5 ? 1 : -1), // Random direction
            width: Math.random() * 2 + 1,
            alpha: Math.random() * 0.4 + 0.1,
            color: Math.random() > 0.7 ? '#38bdf8' : '#ffffff',
            life: 0,
            maxLife: Math.random() * 100 + 50
        });
    }

    // Initial streaks
    for (let i = 0; i < 5; i++) spawnStreak();

    // Spawn loop
    const spawnInterval = setInterval(spawnStreak, 400);

    function draw() {
        if (!isRunning) return;
        rafId = requestAnimationFrame(draw);
        ctx.clearRect(0, 0, W, H);

        // Remove dead streaks
        streaks = streaks.filter(s =>
            s.x > -500 && s.x < W + 500 && s.life < s.maxLife
        );

        streaks.forEach(s => {
            s.x += s.speed;
            s.life++;

            // Fade in/out logic
            let currentAlpha = s.alpha;
            if (s.life < 10) currentAlpha = s.alpha * (s.life / 10);
            if (s.life > s.maxLife - 10) currentAlpha = s.alpha * ((s.maxLife - s.life) / 10);

            // Calculate gradient points
            const startX = s.speed > 0 ? s.x - s.length : s.x;
            const tailX = s.x - s.length * (s.speed > 0 ? 1 : -1);

            // Safety check for finite values
            if (!Number.isFinite(s.x) || !Number.isFinite(s.y) || !Number.isFinite(tailX) || !Number.isFinite(s.length)) {
                return;
            }

            // Draw streak with gradient tail
            try {
                const grad = ctx.createLinearGradient(s.x, s.y, tailX, s.y);
                grad.addColorStop(0, s.color);
                grad.addColorStop(1, 'transparent');

                ctx.globalAlpha = Math.max(0, Math.min(1, currentAlpha)); // Ensure alpha is 0-1
                ctx.fillStyle = grad;
                ctx.fillRect(startX, s.y, s.length, s.width);
            } catch (e) {
                // Ignore gradient errors to prevent crash
            }
        });

        ctx.globalAlpha = 1;
    }

    resize();
    draw();

    const resizeHandler = () => resize();
    window.addEventListener('resize', resizeHandler, { passive: true });

    const observer = new IntersectionObserver(
        ([entry]) => {
            isRunning = entry.isIntersecting;
            if (isRunning && rafId === null) draw();
        },
        { threshold: 0.1 }
    );
    observer.observe(canvas);

    return () => {
        isRunning = false;
        cancelAnimationFrame(rafId);
        clearInterval(spawnInterval);
        window.removeEventListener('resize', resizeHandler);
        observer.disconnect();
    };
}

// ─────────────────────────────────────────────────────────────────────────────

const Hero = ({ startAnimation = false }) => {
    const heroRef = useRef(null);
    const canvasRef = useRef(null);
    const streaksCanvasRef = useRef(null);
    const ctxRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (startAnimation) setIsLoaded(true);
    }, [startAnimation]);

    // Particle canvas
    useEffect(() => {
        if (!canvasRef.current) return;
        return initParticles(canvasRef.current);
    }, []);

    // Streaks canvas - Changed from Pulse Rings to Light Streaks
    useEffect(() => {
        if (!streaksCanvasRef.current) return;
        return initLightStreaks(streaksCanvasRef.current);
    }, []);

    // Scroll destruction
    useEffect(() => {
        if (!heroRef.current || !isLoaded) return;

        const timer = setTimeout(() => {
            ctxRef.current = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const el = heroRef.current;
                        if (!el) return;

                        const content = el.querySelector('.hero-content-wrapper');
                        const canvas = el.querySelector('.hero__canvas');
                        const streaks = el.querySelector('.hero__streaks'); // Changed selector
                        const scanlines = el.querySelector('.hero__scanlines');
                        const corners = el.querySelectorAll('.hero__corner');

                        if (content) gsap.set(content, { opacity: 1 - progress * 1.5, y: -100 * progress });
                        if (canvas) gsap.set(canvas, { opacity: 0.6 * (1 - progress) });
                        if (streaks) gsap.set(streaks, { opacity: 1 - progress * 1.8 });
                        if (scanlines) gsap.set(scanlines, { opacity: 1 - progress });
                        corners.forEach(c => gsap.set(c, { opacity: 0.5 * (1 - progress) }));
                    }
                });
            }, heroRef);
        }, 2000);

        return () => {
            clearTimeout(timer);
            if (ctxRef.current) ctxRef.current.revert();
        };
    }, [isLoaded]);

    return (
        <section
            ref={heroRef}
            className="hero-section"
            style={{
                height: '100vh',
                position: 'relative',
                overflow: 'hidden', // Ensure overflow is hidden for the section
                background: '#000',
                cursor: 'none',
            }}
        >
            {/* Particle canvas */}
            <canvas ref={canvasRef} className="hero__canvas" />

            {/* Light Streaks canvas - Changed class name */}
            <canvas ref={streaksCanvasRef} className="hero__streaks hero__rings" />

            {/* Scanline texture */}
            <div className="hero__scanlines" aria-hidden="true" />

            {/* Corner brackets */}
            <div className="hero__corner hero__corner--tl" aria-hidden="true" />
            <div className="hero__corner hero__corner--tr" aria-hidden="true" />
            <div className="hero__corner hero__corner--bl" aria-hidden="true" />
            <div className="hero__corner hero__corner--br" aria-hidden="true" />

            {/* Content */}
            <HeroContent isLoaded={isLoaded} />
        </section>
    );
};

export default Hero;