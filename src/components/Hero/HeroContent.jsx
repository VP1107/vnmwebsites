import { useRef, useEffect } from 'react';
import { gsap} from '../../gsap-config';

// ── Character scramble utility ────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

function scrambleText(el, finalText, duration = 1.0, delay = 0) {
    const totalFrames = Math.round(duration * 60);
    let frame = 0;
    let rafId;

    const start = () => {
        const run = () => {
            frame++;
            const progress = frame / totalFrames;
            const settledCount = Math.floor(progress * finalText.length);

            let display = '';
            for (let i = 0; i < finalText.length; i++) {
                if (finalText[i] === ' ') {
                    display += ' ';
                } else if (i < settledCount) {
                    display += finalText[i];
                } else {
                    display += CHARS[Math.floor(Math.random() * CHARS.length)];
                }
            }
            if (el) el.textContent = display;

            if (frame < totalFrames) {
                rafId = requestAnimationFrame(run);
            } else {
                if (el) el.textContent = finalText;
            }
        };
        rafId = requestAnimationFrame(run);
    };

    const timeoutId = setTimeout(start, delay * 1000);
    return () => {
        clearTimeout(timeoutId);
        cancelAnimationFrame(rafId);
    };
}

// ─────────────────────────────────────────────────────────────────────────────

const HeroContent = ({ isLoaded }) => {
    const contentRef = useRef(null);
    const eyebrowRef = useRef(null);
    const headline1Ref = useRef(null);
    const headline2Ref = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);
    const dividerRef = useRef(null);
    const hasAnimated = useRef(false);

    useEffect(() => {
        if (!isLoaded || hasAnimated.current) return;
        hasAnimated.current = true;

        const cleanups = [];
        const tl = gsap.timeline({ delay: 0.15 });

        // Eyebrow slides in
        tl.fromTo(eyebrowRef.current,
            { opacity: 0, x: -16 },
            { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' }
        );

        // Divider expands
        tl.fromTo(dividerRef.current,
            { scaleX: 0, transformOrigin: 'left center' },
            { scaleX: 1, duration: 0.45, ease: 'power2.inOut' },
            '-=0.3'
        );

        // Headline 1 - Slide up from mask + scramble
        tl.fromTo(headline1Ref.current,
            { y: '100%', opacity: 1 },
            { y: '0%', duration: 0.9, ease: 'power3.out' },
            '-=0.1'
        );
        tl.call(() => {
            const cleanup = scrambleText(headline1Ref.current, 'Digital', 0.85, 0);
            cleanups.push(cleanup);
        }, [], '-=0.7');


        // Headline 2 - Slide up from mask + scramble
        tl.fromTo(headline2Ref.current,
            { y: '100%', opacity: 1 },
            { y: '0%', duration: 0.9, ease: 'power3.out' },
            '-=0.75'
        );
        tl.call(() => {
            const cleanup = scrambleText(headline2Ref.current, 'Experiences', 0.95, 0);
            cleanups.push(cleanup);
        }, [], '-=0.7');

        // Subtitle fades up
        tl.fromTo(subtitleRef.current,
            { opacity: 0, y: 12 },
            { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
            '-=0.4'
        );

        // Buttons stagger in
        if (ctaRef.current?.children) {
            tl.fromTo(Array.from(ctaRef.current.children),
                { opacity: 0, y: 18 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.6,
                    stagger: 0.12,
                    ease: 'power2.out'
                },
                '-=0.35'
            );
        }

        return () => {
            tl.kill();
            cleanups.forEach(fn => fn && fn());
        };
    }, [isLoaded]);

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    // Style for headline text to prevent cutoff
    const headlineStyle = {
        fontFamily: "'Outfit', system-ui, sans-serif",
        fontWeight: 900,
        fontSize: 'clamp(48px, 8.5vw, 120px)',
        letterSpacing: '-2px',
        lineHeight: 1.1, // Increased line height to prevent cutoff
        margin: 0,
        paddingBottom: '10px', // Extra padding for descenders
        display: 'block',
        willChange: 'transform'
    };

    return (
        <div
            ref={contentRef}
            className="hero-content-wrapper"
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 4,
                width: '100%',
                maxWidth: '1200px',
                padding: '0 clamp(24px, 6vw, 80px)',
                pointerEvents: 'none', // Allow clicks to pass through wrapper
                boxSizing: 'border-box',
            }}
        >
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <span
                    ref={eyebrowRef}
                    style={{
                        fontFamily: "'DM Sans', sans-serif",
                        fontSize: 'clamp(9px, 1.1vw, 11px)',
                        fontWeight: 600,
                        color: '#38bdf8',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        opacity: 0,
                        whiteSpace: 'nowrap',
                    }}
                >
                    V&amp;M Creations
                </span>
                <div
                    ref={dividerRef}
                    style={{
                        height: '1px',
                        width: 'clamp(40px, 6vw, 80px)',
                        background: 'linear-gradient(90deg, #38bdf8, transparent)',
                        opacity: 0.6,
                        flexShrink: 0,
                    }}
                />
            </div>

            {/* Headline line 1 - Mask Wrapper */}
            <div style={{ overflow: 'hidden', paddingBottom: '0px' }}>
                <h1
                    ref={headline1Ref}
                    style={{
                        ...headlineStyle,
                        color: '#fff',
                        textShadow: '0 0 60px rgba(56, 189, 248, 0.18)',
                        transform: 'translateY(100%)' // Start hidden
                    }}
                >
                    Digital
                </h1>
            </div>

            {/* Headline line 2 - Mask Wrapper */}
            <div style={{ overflow: 'hidden', marginBottom: '28px' }}>
                <h1
                    ref={headline2Ref}
                    style={{
                        ...headlineStyle,
                        color: 'transparent',
                        WebkitTextStroke: '1.5px rgba(255,255,255,0.5)',
                        transform: 'translateY(100%)' // Start hidden
                    }}
                >
                    Experiences
                </h1>
            </div>

            {/* Subtitle */}
            <p
                ref={subtitleRef}
                style={{
                    fontFamily: "'DM Sans', sans-serif",
                    fontSize: 'clamp(11px, 1.4vw, 14px)',
                    color: 'rgba(232, 232, 240, 0.38)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom: '44px',
                    maxWidth: '400px',
                    lineHeight: 1.7,
                    opacity: 0,
                }}
            >
                We design &amp; build websites that shock and inspire
            </p>

            {/* CTA Buttons */}
            <div
                ref={ctaRef}
                style={{
                    display: 'flex',
                    gap: '16px',
                    flexWrap: 'wrap',
                    pointerEvents: 'auto',
                }}
            >
                <button
                    className="cta-primary"
                    onClick={() => scrollToSection('work-section')}
                    style={{
                        padding: '14px 32px',
                        background: 'transparent',
                        border: '1px solid rgba(56, 189, 248, 0.5)',
                        borderRadius: '2px',
                        color: '#fff',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        cursor: 'none',
                        transition: 'all 0.3s ease',
                        opacity: 0,
                    }}
                >
                    See Our Work
                </button>
                <button
                    className="cta-secondary"
                    onClick={() => scrollToSection('contact-section')}
                    style={{
                        padding: '14px 32px',
                        background: 'transparent',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '2px',
                        color: '#fff',
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: '12px',
                        fontWeight: 700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        cursor: 'none',
                        transition: 'all 0.3s ease',
                        opacity: 0,
                    }}
                >
                    Get in Touch
                </button>
            </div>

            {/* Scroll hint */}
            <div
                style={{
                    position: 'absolute',
                    bottom: '-40vh', // Pushed down further to avoid overlapping with variable height content
                    left: '50%',
                    transform: 'translateX(-50%)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '10px',
                    fontFamily: "'DM Sans', monospace, sans-serif",
                    fontSize: '9px',
                    letterSpacing: '0.28em',
                    color: 'rgba(232, 232, 240, 0.28)',
                    textTransform: 'uppercase',
                    animation: 'fadeIn 0.7s ease forwards 2.2s',
                    opacity: 0,
                }}
            >
                scroll
                <div
                    style={{
                        width: '1px',
                        height: '52px',
                        background: 'linear-gradient(180deg, #38bdf8, transparent)',
                        animation: 'linePulse 1.9s ease-in-out infinite',
                    }}
                />
            </div>
        </div>
    );
};

export default HeroContent;