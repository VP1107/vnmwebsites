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
                this.originX = x; // Original position for returning
                this.originY = y;
                this.targetX = targetX;
                this.targetY = targetY;
                this.size = Math.random() * 2 + 0.5;
                this.color = this.getColor();
                this.alpha = 0;
                this.vx = 0;
                this.vy = 0;
                this.friction = 0.95;
                this.ease = 0.1;
            }

            getColor() {
                const colors = ['#38bdf8', '#00d4ff', '#0ea5e9', '#ffffff'];
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

            update(mouseX, mouseY) {
                // Mouse interaction
                const dx = mouseX - this.x;
                const dy = mouseY - this.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                const radius = 200; // Interaction radius

                if (distance < radius) {
                    const angle = Math.atan2(dy, dx);
                    const force = (radius - distance) / radius;
                    const push = force * 2; // Push force

                    this.vx -= Math.cos(angle) * push;
                    this.vy -= Math.sin(angle) * push;
                }

                // Return to origin (target)
                // If the opening animation hasn't finished, we might want to wait?
                // For now, let's assume targetX/Y are the "home" positions after explosion
                // But in the original code, they were just exploding out. 
                // Let's keep the explosion logic separate and just use simple physics here.

                // Physics update
                this.x += this.vx;
                this.y += this.vy;

                this.vx *= this.friction;
                this.vy *= this.friction;

                // Soft return to position (if we had a fixed target)
                // For now, just drift slowly or keep position from GSAP
            }
        }

        // Create particles
        const particles = [];
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const particleCount = 300; // Reduced from 1000 for performance

        // Background field
        for (let i = 0; i < particleCount; i++) {
            const particle = new Particle(
                centerX,
                centerY,
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );
            particle.alpha = 0;
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

            // Set final target for the particle to return to or stay atm
            particle.targetX = explodeX;
            particle.targetY = explodeY;

            tl.to(particle, {
                x: explodeX,
                y: explodeY,
                alpha: Math.random() * 0.5 + 0.3,
                duration: 2,
                ease: 'power3.out',
                delay: Math.random() * 0.5
            }, 0);
        });

        // Mouse State
        let mouseX = -1000;
        let mouseY = -1000;

        const handleMouseMove = (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        // Render loop
        const render = () => {
            // Clear with a slight fade effect if desired, or full clear
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(particle => {
                // Calculate distance from mouse
                const dx = particle.x - mouseX;
                const dy = particle.y - mouseY;
                const dist = Math.sqrt(dx * dx + dy * dy);

                // Simple repulsion without persistent physics for better performance with GSAP
                // If we mix GSAP and physics loop it gets messy. 
                // Let's stick to the subtle repulsion on top of GSAP's position

                if (dist < 200) {
                    const angle = Math.atan2(dy, dx);
                    const force = (200 - dist) / 200;
                    const pushX = Math.cos(angle) * force * 20;
                    const pushY = Math.sin(angle) * force * 20;

                    // We subtly offset drawing position, but don't change actual .x/.y 
                    // so GSAP doesn't fight us. 
                    // Or, we can just allow the visual drift.

                    // Optimized approach: directly modify x/y for the repulsion, 
                    // but we need them to spring back.
                    // The original code used gsap.to() inside mousemove, which triggers THOUSANDS of tweens. 
                    // That was the bottleneck.

                    // New approach: 
                    // We use a spring target.

                    particle.x += pushX * 0.05;
                    particle.y += pushY * 0.05;
                }

                particle.draw();
            });

            requestAnimationFrame(render);
        }
        render();

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', resizeCanvas);
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
                pointerEvents: 'none'
            }}
        />
    );
};

export default ParticleCanvas;
