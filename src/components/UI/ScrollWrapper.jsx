// ScrollWrapper.jsx (FIXED)
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ScrollWrapper = ({ children }) => {
    const lenisRef = useRef(null);

    useEffect(() => {
        // ✅ FIX: Updated to current Lenis 1.x API (removed deprecated options)
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            // ✅ Removed deprecated: smooth, mouseMultiplier, touchMultiplier
            // ✅ Removed deprecated: orientation, gestureOrientation
            // These are now handled automatically by Lenis 1.x
        });

        lenisRef.current = lenis;

        // Connect Lenis to GSAP ScrollTrigger
        lenis.on('scroll', ScrollTrigger.update);

        // Store RAF callback reference for cleanup
        const rafCallback = (time) => {
            lenis.raf(time * 1000);
        };

        gsap.ticker.add(rafCallback);
        gsap.ticker.lagSmoothing(0);

        // ✅ FIX: Refresh ScrollTrigger after Lenis initializes
        // Ensures ScrollTrigger calculates positions with Lenis active
        ScrollTrigger.refresh();

        return () => {
            gsap.ticker.remove(rafCallback);
            lenis.off('scroll', ScrollTrigger.update);
            lenis.destroy();
        };
    }, []);

    return (
        <div className="scroll-wrapper">
            {children}
        </div>
    );
};

export default ScrollWrapper;