import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from './AnimatedBackground';
import ParticleCanvas from './ParticleCanvas';
import HeroContent from './HeroContent';
import ScrollPrompt from './ScrollPrompt';
import './Hero.css';

// ✅ Lazy load non-critical overlay
const GlitchOverlay = lazy(() => import('./GlitchOverlay'));

gsap.registerPlugin(ScrollTrigger);

const Hero = ({ startAnimation = false }) => {
    const heroRef = useRef(null);
    const ctxRef = useRef(null); // ✅ Store ctx reference for cleanup
    const timerRef = useRef(null); // ✅ Store timer reference for cleanup
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        if (startAnimation) {
            setIsLoaded(true);
        }
    }, [startAnimation]);

    useEffect(() => {
        if (!heroRef.current || !isLoaded) return;

        // ✅ FIX: Store timer ref for cleanup
        timerRef.current = setTimeout(() => {
            // ✅ FIX: Store ctx ref so cleanup can access it
            ctxRef.current = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const el = heroRef.current;
                        if (!el) return;

                        const vmText = el.querySelector('.vm-text');
                        const websitesText = el.querySelector('.websites-text');
                        const subtitle = el.querySelector('.hero-subtitle');
                        const primaryBtn = el.querySelector('.cta-primary');
                        const secondaryBtn = el.querySelector('.cta-secondary');

                        if (vmText) {
                            gsap.set(vmText, {
                                x: -300 * progress,
                                y: -200 * progress,
                                rotation: -180 * progress,
                                opacity: 1 - progress,
                                scale: 1 - progress * 0.3
                                // ✅ Removed overwrite - not valid on gsap.set()
                            });
                        }

                        if (websitesText) {
                            gsap.set(websitesText, {
                                x: 300 * progress,
                                y: -200 * progress,
                                rotation: 180 * progress,
                                opacity: 1 - progress,
                                scale: 1 - progress * 0.3
                            });
                        }

                        if (subtitle) {
                            gsap.set(subtitle, {
                                y: 200 * progress,
                                opacity: 1 - progress * 1.5
                            });
                        }

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

        }, 3500);

        // ✅ FIX: Proper cleanup - clears both timer AND ctx
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
            if (ctxRef.current) {
                ctxRef.current.revert();
            }
        };
    }, [isLoaded]);

    return (
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

            {/* Layer 3: Main Text Content */}
            <HeroContent isLoaded={isLoaded} />

            {/* Layer 4: Glitch Overlay */}
            <Suspense fallback={null}>
                <GlitchOverlay />
            </Suspense>

            {/* ✅ REMOVED: CustomCursor - it belongs in App.jsx only */}

            {/* Layer 5: Scroll Prompt */}
            <ScrollPrompt />
        </section>
    );
};

export default Hero;