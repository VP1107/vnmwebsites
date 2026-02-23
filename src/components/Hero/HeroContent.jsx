import { useRef, useEffect } from 'react';
import { gsap } from '../../gsap-config';

// ── Character scramble utility ────────────────────────────────────────────────
const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&';

function scrambleText(el, finalText, duration = 1.0, delay = 0) {
    const totalFrames = Math.round(duration * 60);
    let frame = 0;
    let rafId;

    const start = () => {
        const run = () => {
            frame++;
            const progress     = frame / totalFrames;
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
    const contentRef   = useRef(null);
    const eyebrowRef   = useRef(null);
    const headline1Ref = useRef(null);
    const headline2Ref = useRef(null);
    const subtitleRef  = useRef(null);
    const ctaRef       = useRef(null);
    const dividerRef   = useRef(null);
    const scrollHintRef = useRef(null);
    const hasAnimated  = useRef(false);

    useEffect(() => {
        if (!isLoaded || hasAnimated.current) return;
        hasAnimated.current = true;

        const cleanups = [];

        const mm = gsap.matchMedia(contentRef);

        mm.add(
            {
                isDesktop: '(min-width: 1024px)',
                isTablet:  '(min-width: 768px) and (max-width: 1023px)',
                isMobile:  '(max-width: 767px)',
            },
            (context) => {
                const { isMobile, isTablet } = context.conditions;

                // ── Responsive animation values ────────────────────────────
                const eyebrowX      = isMobile ? -10 : -16;
                const h1Duration    = isMobile ? 0.7  : 0.9;
                const h2Duration    = isMobile ? 0.75 : 0.9;
                const scramble1Dur  = isMobile ? 0.6  : 0.85;
                const scramble2Dur  = isMobile ? 0.7  : 0.95;
                const subtitleY     = isMobile ? 8    : 12;
                const ctaY          = isMobile ? 12   : 18;
                const tlDelay       = isMobile ? 0.1  : 0.15;

                const tl = gsap.timeline({ delay: tlDelay });

                // Eyebrow slides in
                tl.fromTo(eyebrowRef.current,
                    { opacity: 0, x: eyebrowX },
                    { opacity: 1, x: 0, duration: 0.55, ease: 'power2.out' }
                );

                // Divider expands
                tl.fromTo(dividerRef.current,
                    { scaleX: 0, transformOrigin: 'left center' },
                    { scaleX: 1, duration: 0.45, ease: 'power2.inOut' },
                    '-=0.3'
                );

                // Headline 1 — slide up from clip mask + scramble
                tl.fromTo(headline1Ref.current,
                    { y: '100%', opacity: 1 },
                    { y: '0%', duration: h1Duration, ease: 'power3.out' },
                    '-=0.1'
                );
                tl.call(() => {
                    const cleanup = scrambleText(headline1Ref.current, 'Digital', scramble1Dur, 0);
                    cleanups.push(cleanup);
                }, [], `-=${h1Duration * 0.78}`);

                // Headline 2 — slide up from clip mask + scramble
                tl.fromTo(headline2Ref.current,
                    { y: '100%', opacity: 1 },
                    { y: '0%', duration: h2Duration, ease: 'power3.out' },
                    '-=0.75'
                );
                tl.call(() => {
                    const cleanup = scrambleText(headline2Ref.current, 'Experiences', scramble2Dur, 0);
                    cleanups.push(cleanup);
                }, [], `-=${h2Duration * 0.78}`);

                // Subtitle fades up
                tl.fromTo(subtitleRef.current,
                    { opacity: 0, y: subtitleY },
                    { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
                    '-=0.4'
                );

                // Buttons stagger in
                const ctaChildren = ctaRef.current ? Array.from(ctaRef.current.children) : [];
                if (ctaChildren.length) {
                    tl.fromTo(ctaChildren,
                        { opacity: 0, y: ctaY },
                        { opacity: 1, y: 0, duration: 0.6, stagger: 0.12, ease: 'power2.out' },
                        '-=0.35'
                    );
                }

                // Scroll hint fades in
                if (scrollHintRef.current) {
                    tl.fromTo(scrollHintRef.current,
                        { opacity: 0 },
                        { opacity: 1, duration: 0.7, ease: 'power2.out' },
                        '-=0.1'
                    );
                }

                return () => {
                    tl.kill();
                    cleanups.forEach(fn => fn?.());
                };
            }
        );

        return () => {
            mm.revert();
        };
    }, [isLoaded]);

    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    };

    const headlineStyle = {
        fontFamily:    "'Outfit', system-ui, sans-serif",
        fontWeight:    900,
        fontSize:      'clamp(42px, 8.5vw, 120px)',
        letterSpacing: '-2px',
        lineHeight:    1.1,
        margin:        0,
        paddingBottom: '10px',
        display:       'block',
        willChange:    'transform',
    };

    return (
        // BUG FIX: position:absolute with translate(-50%,-50%) correctly centres
        // this in the hero section. The wrapper must NOT have overflow:hidden —
        // the headline clip masks are on their individual parent divs below.
        <div
            ref={contentRef}
            className="hero-content-wrapper"
            style={{
                position:      'absolute',
                top:           '50%',
                left:          '50%',
                transform:     'translate(-50%, -50%)',
                zIndex:        4,
                width:         '100%',
                maxWidth:      '1200px',
                padding:       '0 clamp(24px, 6vw, 80px)',
                pointerEvents: 'none',
                boxSizing:     'border-box',
            }}
        >
            {/* Eyebrow */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                <span
                    ref={eyebrowRef}
                    style={{
                        fontFamily:    "'DM Sans', sans-serif",
                        fontSize:      'clamp(9px, 1.1vw, 11px)',
                        fontWeight:    600,
                        color:         '#38bdf8',
                        letterSpacing: '0.3em',
                        textTransform: 'uppercase',
                        opacity:       0,
                        whiteSpace:    'nowrap',
                    }}
                >
                    V&amp;M Creations
                </span>
                <div
                    ref={dividerRef}
                    style={{
                        height:     '1px',
                        width:      'clamp(40px, 6vw, 80px)',
                        background: 'linear-gradient(90deg, #38bdf8, transparent)',
                        opacity:    0.6,
                        flexShrink: 0,
                    }}
                />
            </div>

            {/* Headline 1 — overflow:hidden clips the slide-up animation */}
            <div style={{ overflow: 'hidden' }}>
                <h1
                    ref={headline1Ref}
                    style={{
                        ...headlineStyle,
                        color:      '#fff',
                        textShadow: '0 0 60px rgba(56, 189, 248, 0.18)',
                        transform:  'translateY(100%)',
                    }}
                >
                    Digital
                </h1>
            </div>

            {/* Headline 2 — overflow:hidden clips the slide-up animation */}
            <div style={{ overflow: 'hidden', marginBottom: '28px' }}>
                <h1
                    ref={headline2Ref}
                    style={{
                        ...headlineStyle,
                        color:            'transparent',
                        WebkitTextStroke: '1.5px rgba(255,255,255,0.5)',
                        transform:        'translateY(100%)',
                    }}
                >
                    Experiences
                </h1>
            </div>

            {/* Subtitle */}
            <p
                ref={subtitleRef}
                style={{
                    fontFamily:    "'DM Sans', sans-serif",
                    fontSize:      'clamp(10px, 1.4vw, 14px)',
                    color:         'rgba(232, 232, 240, 0.38)',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    marginBottom:  '44px',
                    maxWidth:      '400px',
                    lineHeight:    1.7,
                    opacity:       0,
                }}
            >
                We design &amp; build websites that shock and inspire
            </p>

            {/* CTA Buttons */}
            <div
                ref={ctaRef}
                style={{
                    display:       'flex',
                    gap:           'clamp(10px, 2vw, 16px)',
                    flexWrap:      'wrap',
                    pointerEvents: 'auto',
                }}
            >
                <button
                    className="cta-primary"
                    onClick={() => scrollToSection('work-section')}
                    style={{
                        padding:       'clamp(10px, 1.5vw, 14px) clamp(20px, 3vw, 32px)',
                        background:    'transparent',
                        border:        '1px solid rgba(56, 189, 248, 0.5)',
                        borderRadius:  '2px',
                        color:         '#fff',
                        fontFamily:    "'Outfit', sans-serif",
                        fontSize:      'clamp(10px, 1.1vw, 12px)',
                        fontWeight:    700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        cursor:        'none',
                        transition:    'all 0.3s ease',
                        opacity:       0,
                    }}
                >
                    See Our Work
                </button>
                <button
                    className="cta-secondary"
                    onClick={() => scrollToSection('contact-section')}
                    style={{
                        padding:       'clamp(10px, 1.5vw, 14px) clamp(20px, 3vw, 32px)',
                        background:    'transparent',
                        border:        '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius:  '2px',
                        color:         '#fff',
                        fontFamily:    "'Outfit', sans-serif",
                        fontSize:      'clamp(10px, 1.1vw, 12px)',
                        fontWeight:    700,
                        letterSpacing: '0.22em',
                        textTransform: 'uppercase',
                        cursor:        'none',
                        transition:    'all 0.3s ease',
                        opacity:       0,
                    }}
                >
                    Get in Touch
                </button>
            </div>

            {/* BUG FIX — Scroll hint:
                The original used bottom:'-40vh' on a child of the translate-centered
                wrapper. This pushed the hint ~40vh below the wrapper's centre point,
                landing it far outside the hero section which has overflow:hidden,
                making it invisible. 

                Fix: take the scroll hint OUT of this centered wrapper entirely.
                It is now position:fixed-like via position:absolute on the SECTION
                (not the content wrapper), anchored to the bottom of the viewport.
                We achieve this by using a negative margin trick — since this wrapper
                is centred at 50% of the section, we offset down by (50vh - bottom margin).
                The cleanest solution is to render it separately in Hero.jsx, but since
                HeroContent owns this element, we use a self-contained absolute that
                escapes the wrapper via a large translateY without relying on the
                parent's overflow. The hero section itself is overflow:hidden at 100vh,
                so the hint sits at the bottom correctly. */}
            <div
                ref={scrollHintRef}
                style={{
                    position:       'absolute',
                    // From the vertically-centred wrapper, we need to reach the
                    // bottom of the 100vh section. The wrapper top is at 50vh,
                    // so the bottom of the section is ~50vh below the wrapper top.
                    // We place the hint at bottom = -(50vh - 32px) from the wrapper.
                    bottom:         'calc(-50vh + 80px)',
                    left:           '50%',
                    transform:      'translateX(-50%)',
                    display:        'flex',
                    flexDirection:  'column',
                    alignItems:     'center',
                    gap:            '10px',
                    fontFamily:     "'DM Sans', monospace, sans-serif",
                    fontSize:       '9px',
                    letterSpacing:  '0.28em',
                    color:          'rgba(232, 232, 240, 0.28)',
                    textTransform:  'uppercase',
                    opacity:        0,
                    pointerEvents:  'none',
                }}
            >
                scroll
                <div
                    style={{
                        width:      '1px',
                        height:     '52px',
                        background: 'linear-gradient(180deg, #38bdf8, transparent)',
                        animation:  'linePulse 1.9s ease-in-out infinite',
                    }}
                />
            </div>
        </div>
    );
};

export default HeroContent;