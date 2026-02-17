import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ParticleCanvas = () => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: true });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        const isMobile = window.innerWidth < 768;

        const setupCanvas = () => {
            const w = window.innerWidth;
            const h = window.innerHeight;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            // ✅ FIX: Reset transform before scaling to prevent accumulation
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        };

        setupCanvas();
        window.addEventListener('resize', setupCanvas, { passive: true });

        const particleCount = isMobile ? 80 : 150;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

        // ✅ FIX: Plain objects instead of class instances (faster for GSAP)
        const particles = Array.from({ length: particleCount }, () => {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 600 + 200;
            return {
                x: centerX,
                y: centerY,
                targetX: centerX + Math.cos(angle) * distance,
                targetY: centerY + Math.sin(angle) * distance,
                size: Math.random() * 2 + 0.5,
                color: ['#38bdf8', '#00d4ff', '#0ea5e9', '#ffffff'][Math.floor(Math.random() * 4)],
                alpha: 0,
            };
        });

        // ✅ FIX: Single GSAP tween using targets array instead of 150 individual tweens
        const tl = gsap.timeline();
        tl.to(particles, {
            x: (i) => particles[i].targetX,
            y: (i) => particles[i].targetY,
            alpha: () => Math.random() * 0.4 + 0.2,
            duration: 2,
            ease: 'power3.out',
            stagger: {
                amount: 0.3, // Total stagger time spread
                from: 'random'
            }
        });

        // ✅ Throttled mouse
        let mouseX = -1000;
        let mouseY = -1000;
        let lastMouseUpdate = 0;

        const handleMouseMove = (e) => {
            const now = Date.now();
            if (now - lastMouseUpdate > 16) {
                mouseX = e.clientX;
                mouseY = e.clientY;
                lastMouseUpdate = now;
            }
        };
        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // ✅ Frame-skipping render loop
        let lastFrameTime = 0;
        const frameInterval = 1000 / (isMobile ? 30 : 60);

        const render = (currentTime) => {
            animationFrameRef.current = requestAnimationFrame(render);
            const delta = currentTime - lastFrameTime;
            if (delta < frameInterval) return;
            lastFrameTime = currentTime - (delta % frameInterval);

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            const interactionRadius = 150;

            particles.forEach(p => {
                // ✅ Mouse repulsion
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.abs(dx) + Math.abs(dy);

                if (dist < interactionRadius && dist > 0) {
                    const force = (interactionRadius - dist) / interactionRadius;
                    p.x += (dx / dist) * force * 3;
                    p.y += (dy / dist) * force * 3;
                }

                // ✅ Draw directly without class method overhead
                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            // ✅ Reset alpha after drawing all particles
            ctx.globalAlpha = 1;
        };

        render(0);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', setupCanvas);
            cancelAnimationFrame(animationFrameRef.current);
            tl.kill();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 2,
                pointerEvents: 'none',
                willChange: 'transform'
            }}
        />
    );
};

export default ParticleCanvas;