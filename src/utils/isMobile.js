/**
 * Detect if the device is mobile/touch-enabled
 * @returns {boolean}
 */
export const isMobile = () => {
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent) ||
        window.matchMedia('(pointer: coarse)').matches ||
        window.innerWidth < 768;
};

/**
 * Check if user prefers reduced motion
 * @returns {boolean}
 */
export const prefersReducedMotion = () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};
