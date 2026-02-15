import gsap from 'gsap';

/**
 * Scramble text effect - morphs random characters into final text
 * @param {HTMLElement} element - Target element
 * @param {string} finalText - Final text to reveal
 * @param {number} duration - Animation duration in ms
 */
export const scrambleText = (element, finalText, duration = 1500) => {
    if (!element) return;

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*';
    const length = finalText.length;
    let frame = 0;
    const totalFrames = duration / 50; // Update every 50ms

    const interval = setInterval(() => {
        let scrambled = '';

        for (let i = 0; i < length; i++) {
            if (frame / totalFrames > i / length) {
                // Reveal actual character
                scrambled += finalText[i];
            } else {
                // Show random character
                scrambled += chars[Math.floor(Math.random() * chars.length)];
            }
        }

        element.textContent = scrambled;
        frame++;

        if (frame >= totalFrames) {
            clearInterval(interval);
            element.textContent = finalText;
        }
    }, 50);
};

/**
 * Split text into individual character spans for animation
 * @param {HTMLElement} element - Target element
 * @returns {HTMLElement[]} Array of span elements
 */
export const splitTextToChars = (element) => {
    if (!element) return [];

    const text = element.textContent;
    element.innerHTML = '';

    const chars = [];
    for (let char of text) {
        const span = document.createElement('span');
        span.textContent = char;
        span.className = 'letter';
        span.style.display = 'inline-block';
        element.appendChild(span);
        chars.push(span);
    }

    return chars;
};

/**
 * Typewriter effect
 * @param {HTMLElement} element - Target element
 * @param {string} text - Text to type
 * @param {number} speed - Speed in ms per character
 */
export const typeWriter = (element, text, speed = 50) => {
    if (!element) return;

    let i = 0;
    element.textContent = '';

    const interval = setInterval(() => {
        if (i < text.length) {
            element.textContent += text[i];
            i++;
        } else {
            clearInterval(interval);
        }
    }, speed);
};

/**
 * 3D character reveal animation
 * @param {HTMLElement} element - Target element containing text
 * @param {number} delay - Stagger delay between characters
 */
export const animate3DCharReveal = (element, delay = 0.05) => {
    const chars = splitTextToChars(element);

    gsap.fromTo(chars,
        {
            scale: 0,
            opacity: 0,
            z: 200,
            rotationY: 90
        },
        {
            scale: 1,
            opacity: 1,
            z: 0,
            rotationY: 0,
            duration: 1.2,
            stagger: {
                amount: 0.5,
                from: "start"
            },
            ease: "expo.out"
        }
    );
};

/**
 * Glitch effect for elements
 * @param {HTMLElement} element - Target element
 * @param {number} duration - Duration of single glitch (ms)
 * @param {boolean} loop - Whether to loop
 */
export const glitchEffect = (element, duration = 100, loop = true) => {
    const tl = gsap.timeline({
        repeat: loop ? -1 : 0,
        repeatDelay: 2 + Math.random() * 3, // Random delay between 2-5s
        defaults: { ease: "power2.inOut" }
    });

    // Create a glitch sequence
    tl.to(element, {
        x: () => gsap.utils.random(-10, 10),
        y: () => gsap.utils.random(-5, 5),
        duration: duration / 1000
    })
        .to(element, {
            x: 0,
            y: 0,
            duration: duration / 1000
        });
};
