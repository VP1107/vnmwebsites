import { useRef, useEffect, useState, lazy, Suspense } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import AnimatedBackground from './AnimatedBackground';
import ParticleCanvas from './ParticleCanvas';
import HeroContent from './HeroContent';
import ScrollPrompt from './ScrollPrompt';
import CustomCursor from './CustomCursor';
import './Hero.css';

const GlitchOverlay = lazy(() => import('./GlitchOverlay'));

gsap.registerPlugin(ScrollTrigger);

const Hero = () => {
    const heroRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsLoaded(true), 100);

        return () => {
            clearTimeout(timer);
            ScrollTrigger.getAll().forEach(st => {
                if (st.vars.trigger === heroRef.current) {
                    st.kill();
                }
            });
        };
    }, []);

    useEffect(() => {
        if (!heroRef.current || !isLoaded) return;

        // ✅ CRITICAL FIX: Wait for entrance animation to complete before enabling scroll destruction
        const scrollDestructionTimer = setTimeout(() => {
            const ctx = gsap.context(() => {
                ScrollTrigger.create({
                    trigger: heroRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;

                        // 1. ✅ FIX: Target whole text spans instead of individual chars
                        // Scope to heroRef to avoid searching entire document
                        const vmText = heroRef.current?.querySelector('.vm-text');
                        const websitesText = heroRef.current?.querySelector('.websites-text');

                        if (vmText) {
                            gsap.set(vmText, {
                                x: -300 * progress,
                                y: -200 * progress,
                                rotation: -180 * progress,
                                opacity: 1 - progress,
                                scale: 1 - progress * 0.3,
                                overwrite: 'auto' // Prevent conflict
                            });
                        }

                        if (websitesText) {
                            gsap.set(websitesText, {
                                x: 300 * progress,
                                y: -200 * progress,
                                rotation: 180 * progress,
                                opacity: 1 - progress,
                                scale: 1 - progress * 0.3,
                                overwrite: 'auto'
                            });
                        }

                        // 2. Subtitle fades and drops
                        const subtitle = heroRef.current?.querySelector('.hero-subtitle');
                        if (subtitle) {
                            gsap.set(subtitle, {
                                y: 200 * progress,
                                opacity: 1 - progress * 1.5,
                                overwrite: 'auto'
                            });
                        }

                        // 3. Buttons sink and separate
                        const primaryBtn = heroRef.current?.querySelector('.cta-primary');
                        const secondaryBtn = heroRef.current?.querySelector('.cta-secondary');

                        if (primaryBtn) {
                            gsap.set(primaryBtn, {
                                x: -100 * progress,
                                y: 200 * progress,
                                opacity: 1 - progress * 3,
                                rotation: -45 * progress,
                                overwrite: 'auto'
                            });
                        }

                        if (secondaryBtn) {
                            gsap.set(secondaryBtn, {
                                x: 100 * progress,
                                y: 200 * progress,
                                opacity: 1 - progress * 3,
                                rotation: 45 * progress,
                                overwrite: 'auto'
                            });
                        }
                    }
                });
            }, heroRef);

            return () => ctx.revert();
        }, 3500); // ✅ Wait 3.5 seconds for entrance animation to complete

        return () => clearTimeout(scrollDestructionTimer);
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

            {/* Layer 5: Custom Cursor */}
            <CustomCursor />

            {/* Layer 6: Scroll Prompt */}
            <ScrollPrompt />
        </section>
    );
};

export default Hero;