import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const ParticleCanvas = () => {
    const canvasRef = useRef(null);
    const particlesRef = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        // Set canvas size
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Particle class
        class Particle {
            constructor(x, y, targetX, targetY) {
                this.x = x;
                this.y = y;
                this.startX = x; // Animation reset point
                this.startY = y;
                this.targetX = targetX;
                this.targetY = targetY;
                this.size = Math.random() * 2 + 0.5;
                this.color = this.getColor();
                this.alpha = 0;
            }

            getColor() {
                const colors = ['#00ff88', '#00d4ff', '#ff0080', '#ffffff'];
                return colors[Math.floor(Math.random() * colors.length)];
            }

            draw() {
                ctx.save();
                ctx.globalAlpha = this.alpha;
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            }
        }

        // Create particles
        const particles = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;

        // Background field
        for (let i = 0; i < 1000; i++) {
            const particle = new Particle(
                centerX,
                centerY,
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
            particle.alpha = 0;
            particle.isBackground = true;
            particles.push(particle);
        }

        particlesRef.current = particles;

        // GSAP Animation Timeline
        const tl = gsap.timeline();

        // Explode
        particles.forEach((particle, i) => {
            const angle = Math.random() * Math.PI * 2;
            const distance = Math.random() * 800 + 100;
            const explodeX = centerX + Math.cos(angle) * distance;
            const explodeY = centerY + Math.sin(angle) * distance;

            tl.to(particle, {
                x: particle.targetX || explodeX,
                y: particle.targetY || explodeY,
                alpha: Math.random() * 0.5 + 0.3,
                duration: 2,
                ease: 'power3.out',
                delay: Math.random() * 0.5
            }, 0);
        });

        // Render loop
        const render = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(particle => {
                particle.draw();
            });
            requestAnimationFrame(render);
        }
        render();

        // Mouse interaction - particles flee from cursor SUBTLY
        const handleMouseMove = (e) => {
            const mouseX = e.clientX;
            const mouseY = e.clientY;

            particles.forEach(particle => {
                // We use current 'aniamted' position GSAP put us in? 
                // No, we read current .x/.y

                const dx = particle.x - mouseX;
                const dy = particle.y - mouseY;
                const distance = Math.sqrt(dx * dx + dy * dy);

                // Very subtle repulsion
                // Increase radius but decrease force
                const radius = 250;

                if (distance < radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (radius - distance) / radius; // 0 to 1
                    const push = force * 15; // Max 15px push - VERY subtle

                    // Apply directly to position for responsiveness?
                    // Or tween? Tween is smoother.

                    gsap.to(particle, {
                        x: particle.x + Math.cos(angle) * push,
                        y: particle.y + Math.sin(angle) * push,
                        duration: 1,
                        ease: 'power1.out',
                        overwrite: 'auto'
                    });
                }
            });
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resizeCanvas);
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
                pointerEvents: 'none'
            }}
        />
    );
};

export default ParticleCanvas;
