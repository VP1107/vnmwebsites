import { useEffect, useRef, useState } from 'react';
import './Preloader.css';

// ─── Particle system ──────────────────────────────────────────────────────────
function initParticles(canvas) {
    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W, H, particles, isRunning = true;
    // BUG FIX: Use an object ref for rafId so the IntersectionObserver closure
    // always reads the current value. After cancelAnimationFrame the old integer
    // is NOT null — so the plain `let rafId` pattern means `rafId === null`
    // never re-triggers the draw loop after the first visibility pause.
    const raf = { id: null };

    function resize() {
        W = canvas.width  = window.innerWidth  * dpr;
        H = canvas.height = window.innerHeight * dpr;
        canvas.style.width  = window.innerWidth  + 'px';
        canvas.style.height = window.innerHeight + 'px';
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);
        // Re-assign W/H to logical (CSS) pixels for particle math
        W = window.innerWidth;
        H = window.innerHeight;
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
        // BUG FIX: The original Preloader particle loop had NO isRunning guard
        // and no IntersectionObserver, so it ran forever even when the preloader
        // was not visible (e.g. during the exit fade). This wastes CPU the entire
        // time the rest of the page is loading below the fold.
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

    // BUG FIX: Add an IntersectionObserver so the loop pauses automatically
    // when the preloader is hidden/exiting, consistent with Hero's particle system.
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

// ─── Status messages ──────────────────────────────────────────────────────────
const STATUS_MESSAGES = [
    'INITIALIZING',
    'LOADING ASSETS',
    'BUILDING EXPERIENCE',
    'ALMOST READY',
];

// ─── Component ────────────────────────────────────────────────────────────────
const Preloader = ({ isLoading }) => {
    const [shouldRender, setShouldRender] = useState(true);
    const [progress, setProgress]         = useState(0);
    const [statusIndex, setStatusIndex]   = useState(0);

    const canvasRef            = useRef(null);
    const fillRef              = useRef(null);
    const progressRef          = useRef(0);   // live value without triggering re-renders
    const rafRef               = useRef(null);
    const cleanupParticles     = useRef(null);

    // ── Scroll lock ───────────────────────────────────────────────────────────
    useEffect(() => {
        if (isLoading) {
            document.documentElement.classList.add('is-loading');
        } else {
            document.documentElement.classList.remove('is-loading');
        }
        return () => document.documentElement.classList.remove('is-loading');
    }, [isLoading]);

    // ── Unmount after exit animation ─────────────────────────────────────────
    useEffect(() => {
        if (!isLoading) {
            const t = setTimeout(() => setShouldRender(false), 700);
            return () => clearTimeout(t);
        }
    }, [isLoading]);

    // ── Canvas particles ─────────────────────────────────────────────────────
    useEffect(() => {
        if (!canvasRef.current) return;
        cleanupParticles.current = initParticles(canvasRef.current);
        return () => cleanupParticles.current?.();
    }, []);

    // ── Smooth progress animation ─────────────────────────────────────────────
    useEffect(() => {
        let fakeTarget = 0;
        let statusTimer;

        const advanceTarget = () => {
            if (isLoading) {
                fakeTarget = Math.min(fakeTarget + (90 - fakeTarget) * 0.015, 89);
            } else {
                fakeTarget = 100;
            }
        };

        const tick = () => {
            advanceTarget();
            const diff = fakeTarget - progressRef.current;
            progressRef.current += diff * 0.08;

            const rounded = Math.min(Math.round(progressRef.current), 100);
            setProgress(rounded);

            if (fillRef.current) {
                fillRef.current.style.width = progressRef.current + '%';
            }

            if (progressRef.current < 99.9) {
                rafRef.current = requestAnimationFrame(tick);
            }
        };

        rafRef.current = requestAnimationFrame(tick);

        statusTimer = setInterval(() => {
            setStatusIndex(i => (i + 1) % STATUS_MESSAGES.length);
        }, 600);

        return () => {
            cancelAnimationFrame(rafRef.current);
            clearInterval(statusTimer);
        };
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        <div
            className={`preloader${!isLoading ? ' exit' : ''}`}
            role="status"
            aria-live="polite"
            aria-label="Loading V&M Creations"
            aria-busy={isLoading}
        >
            {/* Particle canvas */}
            <canvas ref={canvasRef} className="preloader__canvas" aria-hidden="true" />

            {/* Scan-line texture */}
            <div className="preloader__scanlines" aria-hidden="true" />

            {/* Corner brackets */}
            <div className="preloader__corner preloader__corner--tl" aria-hidden="true" />
            <div className="preloader__corner preloader__corner--tr" aria-hidden="true" />
            <div className="preloader__corner preloader__corner--bl" aria-hidden="true" />
            <div className="preloader__corner preloader__corner--br" aria-hidden="true" />

            {/* Main content */}
            <div className="preloader__content">
                {/* Logo */}
                <div className="preloader__logo" aria-hidden="true">
                    <span className="preloader__logo-main">V&amp;M</span>
                    <span className="preloader__logo-sub">CREATIONS</span>
                </div>

                {/* Progress */}
                <div className="preloader__progress-area">
                    <div
                        className="preloader__bar-track"
                        role="progressbar"
                        aria-valuenow={progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <div ref={fillRef} className="preloader__bar-fill" />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                        <span className="preloader__status">
                            {STATUS_MESSAGES[statusIndex]}
                        </span>
                        <span className="preloader__counter">{progress}%</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Preloader;