import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from './AnimatedBackground';
import ParticleCanvas from './ParticleCanvas';
import MorphingLogo from './MorphingLogo';
import HeroContent from './HeroContent';
import ScrollPrompt from './ScrollPrompt';
import CustomCursor from './CustomCursor';

import './Hero.css';

// Lazy load non-critical overlay
const GlitchOverlay = lazy(() => import('./GlitchOverlay'));

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const heroRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // ✅ FIX #4: Combined initialization and cleanup
        const timer = setTimeout(() => setIsLoaded(true), 100);

        return () => {
            clearTimeout(timer);
            // Kill all ScrollTriggers created by this component
            ScrollTrigger.getAll().forEach(st => {
                if (st.vars.trigger === heroRef.current) {
                    st.kill();
                }
            });
        };
    }, []);

    useEffect(() => {
        if (!heroRef.current || !isLoaded) return;

        // Scroll Destruction Logic
        const ctx = gsap.context(() => {
            ScrollTrigger.create({
                trigger: heroRef.current,
                start: 'top top',
                end: 'bottom top',
                scrub: 1,
                onUpdate: (self) => {
                    const progress = self.progress;

                    // ✅ FIX #1: Use gsap.set() instead of gsap.to() for performance
                    // gsap.set() is instant and doesn't create tweens on every scroll

                    // 1. Logo spins and shrinks rapidly
                    const logoEl = document.querySelector('.morphing-logo');
                    if (logoEl) {
                        gsap.set(logoEl, {
                            rotation: progress * 720,
                            scale: Math.max(0, 1 - progress * 2),
                            opacity: 1 - progress * 2
                        });
                    }

                    // ✅ FIX #3: Added null checks for SplitType elements
                    // 2. Text characters scatter
                    const chars = document.querySelectorAll('.hero-title .char');
                    if (chars.length > 0) {
                        chars.forEach((char, i) => {
                            const angle = (i * 137.5) * (Math.PI / 180); // Golden angle
                            const dist = 800 * progress;

                            gsap.set(char, {
                                x: Math.cos(angle) * dist,
                                y: Math.sin(angle) * dist,
                                rotation: 360 * progress * (i % 2 === 0 ? 1 : -1),
                                opacity: 1 - progress
                            });
                        });
                    }

                    // 3. Subtitle words scatter differently
                    const words = document.querySelectorAll('.hero-subtitle .word');
                    if (words.length > 0) {
                        words.forEach((word, i) => {
                            gsap.set(word, {
                                y: 500 * progress,
                                x: (i % 2 === 0 ? -200 : 200) * progress,
                                opacity: 1 - progress * 1.5
                            });
                        });
                    }

                    // 4. Buttons sink and separate
                    const primaryBtn = document.querySelector('.cta-primary');
                    const secondaryBtn = document.querySelector('.cta-secondary');

                    if (primaryBtn) {
                        gsap.set(primaryBtn, {
                            x: -100 * progress,
                            y: 200 * progress,
                            opacity: 1 - progress * 3,
                            rotation: -45 * progress
                        });
                    }

                    if (secondaryBtn) {
                        gsap.set(secondaryBtn, {
                            x: 100 * progress,
                            y: 200 * progress,
                            opacity: 1 - progress * 3,
                            rotation: 45 * progress
                        });
                    }
                }
            });
        }, heroRef);

        return () => ctx.revert();
    }, [isLoaded]);

    return ( // ✅ FIX #0: Fixed syntax error (removed orphaned return())
        <section
            ref={heroRef}
            className="hero-section"
            style={{
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                background: '#000000',
                cursor: 'none'
            }}
        >
            {/* Layer 1: Animated CSS Gradient Background */}
            <AnimatedBackground />

            {/* Layer 2: Canvas Particle System */}
            <ParticleCanvas />

            {/* Layer 3: SVG Morphing Logo */}
            <MorphingLogo isLoaded={isLoaded} />

            {/* Layer 4: Main Text Content */}
            {/* ✅ FIX #2: Removed unused contentRef */}
            <HeroContent isLoaded={isLoaded} />

            {/* Layer 5: Glitch Overlay */}
            <Suspense fallback={null}>
                <GlitchOverlay />
            </Suspense>

            {/* Layer 6: Custom Cursor */}
            <CustomCursor />

            {/* Scroll Prompt */}
            <ScrollPrompt />
        </section>
    );
};

export default Hero;