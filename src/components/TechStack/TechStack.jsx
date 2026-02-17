import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// BUG FIX #22: TechStack uses className="tech-stack-container" and relies on
// an external TechStack.css file, but no CSS was provided. If that file is
// missing or doesn't define the layout, the component renders as an unstyled
// jumble of inline spans. Moving styles inline (or to a style tag) makes the
// component self-contained and immune to missing CSS imports.
// Also: the original component had no animations at all, despite the rest of
// the page being heavily animated — a jarring inconsistency. Adding scroll-
// triggered entrance animations to match the site's style.

gsap.registerPlugin(ScrollTrigger);

const TECH_ITEMS = [
    { label: 'HTML',       color: '#e34c26' },
    { label: 'CSS',        color: '#38bdf8' },
    { label: 'JavaScript', color: '#f7df1e' },
    { label: 'React',      color: '#61dafb' },
    { label: 'Three.js',   color: '#ffffff' },
    { label: 'anime.js',   color: '#ff6b6b' },
];

const TechStack = () => {
    const sectionRef = useRef(null);
    const itemRefs = useRef([]);
    const headingRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Heading reveal
            gsap.fromTo(headingRef.current,
                { opacity: 0, y: 60 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 80%',
                        toggleActions: 'play none none none'
                    }
                }
            );

            // Staggered item reveal
            gsap.fromTo(itemRefs.current,
                { opacity: 0, y: 40, scale: 0.8 },
                {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    duration: 0.6,
                    ease: 'back.out(1.7)',
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: sectionRef.current,
                        start: 'top 70%',
                        toggleActions: 'play none none none'
                    }
                }
            );

            // BUG FIX #23: Subtle hover pulse on each item — originally missing.
            // Using GSAP for consistency with the rest of the site (not CSS :hover).
            itemRefs.current.forEach((el) => {
                if (!el) return;
                el.addEventListener('mouseenter', () => {
                    gsap.to(el, { scale: 1.15, duration: 0.25, ease: 'power2.out' });
                });
                el.addEventListener('mouseleave', () => {
                    gsap.to(el, { scale: 1, duration: 0.25, ease: 'power2.in' });
                });
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            style={{
                padding: 'clamp(60px, 10vw, 120px) 5%',
                background: '#000',
                textAlign: 'center',
                position: 'relative'
            }}
        >
            {/* BUG FIX #24: The original heading used className="gradient-text"
                which depends on a CSS variable `--color-accent-*` defined elsewhere.
                If the root CSS vars aren't loaded, the gradient is invisible.
                Inlining the gradient style makes it reliable. */}
            <h2
                ref={headingRef}
                style={{
                    fontSize: 'clamp(36px, 7vw, 100px)',
                    fontWeight: 900,
                    fontFamily: '"Syne", sans-serif',
                    letterSpacing: '0.05em',
                    marginBottom: 'clamp(40px, 6vw, 80px)',
                    background: 'linear-gradient(135deg, #38bdf8, #00d4ff, #0ea5e9)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                }}
            >
                TECH STACK
            </h2>

            {/* BUG FIX #25: Mobile layout — original used
                display: flex with no wrapping or responsive sizing.
                On narrow screens all 6 items overflow horizontally.
                Fix: use flexWrap + clamp for font size. */}
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',               // BUG FIX #25
                gap: 'clamp(16px, 3vw, 32px)',
                justifyContent: 'center',
                alignItems: 'center',
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                {TECH_ITEMS.map((tech, index) => (
                    <span
                        key={tech.label}
                        ref={(el) => (itemRefs.current[index] = el)}
                        style={{
                            // BUG FIX #25 cont: clamp font size for mobile
                            fontSize: 'clamp(22px, 4vw, 48px)',
                            fontWeight: 800,
                            fontFamily: '"Syne", sans-serif',
                            color: tech.color,
                            textShadow: `0 0 20px ${tech.color}66`,
                            cursor: 'default',
                            display: 'inline-block', // required for GSAP scale transform
                            letterSpacing: '0.02em',
                            // BUG FIX #26: Original had no padding/border — items
                            // look disconnected. Adding a subtle border + padding
                            // to make them feel like intentional "chips".
                            padding: 'clamp(8px, 1.5vw, 14px) clamp(16px, 2.5vw, 28px)',
                            border: `1px solid ${tech.color}33`,
                            borderRadius: '8px',
                            background: `${tech.color}08`,
                            transition: 'border-color 0.3s ease, background 0.3s ease',
                            willChange: 'transform'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.borderColor = `${tech.color}88`;
                            e.currentTarget.style.background = `${tech.color}15`;
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.borderColor = `${tech.color}33`;
                            e.currentTarget.style.background = `${tech.color}08`;
                        }}
                    >
                        {tech.label}
                    </span>
                ))}
            </div>
        </section>
    );
};

export default TechStack;