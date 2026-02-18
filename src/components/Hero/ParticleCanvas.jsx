import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';

const ParticleCanvas = () => {
    const canvasRef = useRef(null);
    const animationFrameRef = useRef(null);
    const [isVisible, setIsVisible] = useState(true); // ✅ Track visibility

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
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(dpr, dpr);
        };

        setupCanvas();
        window.addEventListener('resize', setupCanvas, { passive: true });

        const particleCount = isMobile ? 80 : 150;
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;

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

        const tl = gsap.timeline();
        tl.to(particles, {
            x: (i) => particles[i].targetX,
            y: (i) => particles[i].targetY,
            alpha: () => Math.random() * 0.4 + 0.2,
            duration: 2,
            ease: 'power3.out',
            stagger: {
                amount: 0.3,
                from: 'random'
            }
        });

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

        // ✅ FIX: Pause/resume based on visibility
        let lastFrameTime = 0;
        const frameInterval = 1000 / (isMobile ? 30 : 60);
        let isRunning = true;

        const render = (currentTime) => {
            if (!isRunning) return; // ✅ Exit if paused

            animationFrameRef.current = requestAnimationFrame(render);
            const delta = currentTime - lastFrameTime;
            if (delta < frameInterval) return;
            lastFrameTime = currentTime - (delta % frameInterval);

            ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

            const interactionRadius = 150;

            particles.forEach(p => {
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.abs(dx) + Math.abs(dy);

                if (dist < interactionRadius && dist > 0) {
                    const force = (interactionRadius - dist) / interactionRadius;
                    p.x += (dx / dist) * force * 3;
                    p.y += (dy / dist) * force * 3;
                }

                ctx.globalAlpha = p.alpha;
                ctx.fillStyle = p.color;
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1;
        };

        // ✅ Intersection Observer to pause when off-screen
        const observer = new IntersectionObserver(
            ([entry]) => {
                isRunning = entry.isIntersecting;
                setIsVisible(entry.isIntersecting);
                
                if (isRunning && !animationFrameRef.current) {
                    render(performance.now()); // Resume
                }
            },
            { threshold: 0.1 } // Pause when <10% visible
        );

        observer.observe(canvas);

        render(0);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', setupCanvas);
            observer.disconnect();
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
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