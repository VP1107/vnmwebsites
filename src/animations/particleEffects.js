import gsap from 'gsap';

/**
 * Create particle explosion animation
 * @param {HTMLElement} container - Container element for particles
 * @param {number} count - Number of particles
 * @param {string[]} colors - Array of particle colors
 * @returns {HTMLElement[]} Array of particle elements
 */
export const createParticleExplosion = (container, count = 200, colors = ['#00ff88', '#00d4ff', '#ff0080']) => {
    const particles = [];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 6 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        particle.style.position = 'absolute';
        particle.style.left = '50%';
        particle.style.top = '50%';
        particle.style.borderRadius = '50%';
        particle.style.pointerEvents = 'none';

        container.appendChild(particle);
        particles.push(particle);
    }

    // Explosion animation
    gsap.to(particles, {
        x: () => gsap.utils.random(-500, 500),
        y: () => gsap.utils.random(-500, 500),
        scale: 0,
        opacity: 0,
        duration: 2,
        ease: "expo.out",
        stagger: {
            amount: 0.1,
            from: "center"
        },
        onComplete: () => {
            // Clean up particles
            particles.forEach(p => p.remove());
        }
    });

    return particles;
};

/**
 * Create particle burst from specific element
 * @param {HTMLElement} element - Element to burst from
 * @param {number} count - Number of particles
 */
export const createParticleBurst = (element, count = 30) => {
    const rect = element.getBoundingClientRect();
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = 0;
    container.style.left = 0;
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = 9999;
    document.body.appendChild(container);

    const particles = [];

    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.backgroundColor = '#00ff88';
        particle.style.position = 'absolute';
        particle.style.left = `${rect.left + rect.width / 2}px`;
        particle.style.top = `${rect.top + rect.height / 2}px`;
        particle.style.borderRadius = '50%';
        particle.style.boxShadow = '0 0 10px #00ff88';

        container.appendChild(particle);
        particles.push(particle);
    }

    gsap.to(particles, {
        x: () => gsap.utils.random(-150, 150),
        y: () => gsap.utils.random(-150, 150),
        scale: 0,
        opacity: 0,
        duration: 0.8,
        ease: "quad.out",
        stagger: {
            amount: 0.1,
            from: "center"
        },
        onComplete: () => {
            container.remove();
        }
    });
};

/**
 * Create particle system that follows mouse
 * @param {HTMLElement} container - Container element
 * @returns {object} Controller with update and destroy methods
 */
export const createMouseParticles = (container) => {
    const particles = [];
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Create particle at mouse position
        if (Math.random() > 0.7) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.width = '3px';
            particle.style.height = '3px';
            particle.style.backgroundColor = '#00ff88';
            particle.style.position = 'fixed';
            particle.style.left = `${mouseX}px`;
            particle.style.top = `${mouseY}px`;
            particle.style.borderRadius = '50%';
            particle.style.pointerEvents = 'none';
            particle.style.zIndex = 9998;

            container.appendChild(particle);
            particles.push(particle);

            gsap.to(particle, {
                opacity: 0,
                scale: 0,
                duration: 1,
                ease: "quad.out",
                onComplete: () => {
                    particle.remove();
                    const index = particles.indexOf(particle);
                    if (index > -1) particles.splice(index, 1);
                }
            });

            // Limit particle count
            if (particles.length > 50) {
                const oldParticle = particles.shift();
                oldParticle?.remove();
            }
        }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return {
        destroy: () => {
            window.removeEventListener('mousemove', handleMouseMove);
            particles.forEach(p => p.remove());
        }
    };
};
