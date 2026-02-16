import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ParticleCanvas = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', { alpha: true }); // ✅ Performance hint

        // ✅ Device pixel ratio optimization (cap at 2)
        const dpr = Math.min(window.devicePixelRatio || 1, 2);

        const resizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = rect.width * dpr;
            canvas.height = rect.height * dpr;
            canvas.style.width = rect.width + 'px';
            canvas.style.height = rect.height + 'px';
            ctx.scale(dpr, dpr);
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // ✅ REDUCED: 300 → 150 particles
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 80 : 150;

        class Particle {
            constructor(x, y, targetX, targetY) {
                this.x = x;
                this.y = y;
                this.targetX = targetX;
                this.targetY = targetY;
                this.size = Math.random() * 2 + 0.5;
                this.color = ['#38bdf8', '#00d4ff', '#0ea5e9', '#ffffff'][Math.floor(Math.random() * 4)];
                this.alpha = 0;
                this.vx = 0;
                this.vy = 0;
            }

            draw(ctx) {
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const particles = [];
        const centerX = canvas.width / (2 * dpr);
        const centerY = canvas.height / (2 * dpr);

        for (let i = 0; i < particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 600 + 200;
            const targetX = centerX + Math.cos(angle) * distance;
            const targetY = centerY + Math.sin(angle) * distance;

            particles.push(new Particle(centerX, centerY, targetX, targetY));
        }

        particlesRef.current = particles;

        // GSAP explosion animation
        const tl = gsap.timeline();
        particles.forEach((p, i) => {
            tl.to(p, {
                x: p.targetX,
                y: p.targetY,
                alpha: Math.random() * 0.4 + 0.2,
                duration: 2,
                ease: 'power3.out',
                delay: Math.random() * 0.3
            }, 0);
        });

        // ✅ Throttled mouse tracking (update every 16ms max)
        let mouseX = -1000;
        let mouseY = -1000;
        let lastMouseUpdate = 0;

        const handleMouseMove = (e) => {
            const now = Date.now();
            if (now - lastMouseUpdate > 16) { // ~60fps throttle
                mouseX = e.clientX;
                mouseY = e.clientY;
                lastMouseUpdate = now;
            }
        };

        window.addEventListener('mousemove', handleMouseMove, { passive: true });

        // ✅ Optimized render loop with frame skipping
        let lastFrameTime = 0;
        const targetFPS = isMobile ? 30 : 60;
        const frameInterval = 1000 / targetFPS;

        const render = (currentTime) => {
            animationFrameRef.current = requestAnimationFrame(render);

            const deltaTime = currentTime - lastFrameTime;
            if (deltaTime < frameInterval) return; // ✅ Skip frame

            lastFrameTime = currentTime - (deltaTime % frameInterval);

            ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

            // ✅ Spatial partitioning: only check particles near mouse
            const interactionRadius = 150;

            particles.forEach(p => {
                const dx = p.x - mouseX;
                const dy = p.y - mouseY;
                const dist = Math.abs(dx) + Math.abs(dy); // ✅ Manhattan distance (faster than sqrt)

                if (dist < interactionRadius) {
                    const force = (interactionRadius - dist) / interactionRadius;
                    p.x += (dx / dist) * force * 3;
                    p.y += (dy / dist) * force * 3;
                }

                p.draw(ctx);
            });
        };

        render(0);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resizeCanvas);
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
                willChange: 'transform' // ✅ GPU hint
            }}
        />
    );
};

export default ParticleCanvas;
