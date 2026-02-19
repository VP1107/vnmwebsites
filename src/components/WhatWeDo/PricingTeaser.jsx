import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../gsap-config';
import SplitType from 'split-type';


const perks = ['No Hidden Fees', 'Fast Delivery', '30 Days Support'];

const PricingTeaser = () => {
    const containerRef = useRef(null);
    const bgGlowRef = useRef(null);
    const gridRef = useRef(null);
    const labelRef = useRef(null);
    const lineRef = useRef(null);
    const headingRef = useRef(null);
    const priceRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);
    const perksRef = useRef(null);
    const splitHeading = useRef(null);

    useEffect(() => {
        // FIX #2: Removed unused `counter` object entirely.

        const ctx = gsap.context(() => {

            /* 1 ── PARALLAX: bg glow drifts upward as section enters
               FIX #4: Removed `transform: translateX(-50%)` from the inline style
               on bgGlowRef and use `xPercent: -50` here so GSAP owns the full
               transform and won't overwrite a competing CSS transform. */
            gsap.fromTo(bgGlowRef.current,
                { xPercent: -50, yPercent: 30, scale: 0.8 },
                {
                    xPercent: -50, yPercent: -20, scale: 1.15, ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top bottom', end: 'bottom top',
                        scrub: 2,
                    }
                }
            );

            /* 2 ── PARALLAX: grid layer drifts at medium speed */
            gsap.fromTo(gridRef.current,
                { yPercent: 20, opacity: 0 },
                {
                    yPercent: -15, opacity: 1, ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top bottom', end: 'bottom top',
                        scrub: 2.5,
                    }
                }
            );

            /* 3 ── LABEL + RULE entrance */
            gsap.from(labelRef.current, {
                opacity: 0, x: -22, duration: 0.8, ease: 'power3.out',
                scrollTrigger: { trigger: containerRef.current, start: 'top 84%' }
            });
            gsap.from(lineRef.current, {
                scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'power3.out', delay: 0.1,
                scrollTrigger: { trigger: containerRef.current, start: 'top 84%' }
            });

            /* 4 ── SPLITTYPE: "Starting At" heading — chars scrub reveal
               FIX #6: overflow:hidden moved off the <p> and onto each char wrapper
               so the y:'120%' clip actually works. Chars are wrapped below. */
            if (headingRef.current) {
                splitHeading.current = new SplitType(headingRef.current, { types: 'chars' });
                // Apply overflow:hidden per char so the clip reveal is visible
                splitHeading.current.chars.forEach(char => {
                    char.style.display = 'inline-block';
                    char.style.overflow = 'hidden';
                    char.style.verticalAlign = 'bottom';
                });
                gsap.from(splitHeading.current.chars, {
                    y: '120%', opacity: 0,
                    stagger: 0.03, ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 78%', end: 'top 30%',
                        scrub: 0.8,
                    }
                });
            }

            /* 5 ── PRICE COUNTER: scrub-linked from 0 → 8000
               FIX #1: self.progress is 0–1, not 0–100.
               Corrected formula: Math.round(self.progress * 80) * 100
               which correctly produces 0 → 8000 as progress goes 0 → 1. */
            /* 5 ── PRICE COUNTER: scrub-linked from 0 → 8000 using Proxy Object for robustness */
            const priceProxy = { val: 0 };
            gsap.to(priceProxy, {
                val: 8000,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    end: 'top 20%',
                    scrub: 1,
                },
                onUpdate: () => {
                    if (priceRef.current) {
                        priceRef.current.textContent = '₹0' + Math.round(priceProxy.val).toLocaleString('en-IN');
                    }
                }
            });

            /* 6 ── PRICE scale-in entrance (one-shot, before scrub kicks in) */
            gsap.fromTo(priceRef.current,
                { scale: 0.55, opacity: 0, y: 40 },
                {
                    scale: 1, opacity: 1, y: 0, duration: 3, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 72%',
                        toggleActions: 'play none none none',
                    }
                }
            );

            /* 7 ── SUBTITLE fade */
            gsap.to(priceProxy, {
                val: 8000,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 85%',
                    end: 'top 20%',  // keep this
                    scrub: 1,
                },
                onUpdate: () => {
                    if (priceRef.current) {
                        priceRef.current.textContent = '₹' + Math.round(priceProxy.val).toLocaleString('en-IN');
                    }
                }
            });

            // Move the entrance earlier so it's done before the counter is visible
            gsap.fromTo(priceRef.current,
                { scale: 0.55, opacity: 0, y: 40 },
                {
                    scale: 1, opacity: 1, y: 0, duration: 1, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 90%',  // ← was 72%, now fires earlier
                        toggleActions: 'play none none none',
                    }
                }
            );

            /* 9 ── PERKS stagger */
            const perkEls = perksRef.current?.querySelectorAll('.pt-perk');
            if (perkEls?.length) {
                gsap.from(perkEls, {
                    opacity: 0, y: 22, stagger: 0.12, duration: 0.7, ease: 'power3.out',
                    scrollTrigger: {
                        trigger: perksRef.current, start: 'top 88%',
                        toggleActions: 'play none none none',
                    }
                });
            }

            // gsap.to implies auto-cleanup via context
            // return priceST; // Removed

        }, containerRef);

        return () => {
            ctx.revert();
            splitHeading.current?.revert();
        };
    }, []);

    return (
        <div ref={containerRef} style={{
            position: 'relative',
            minHeight: '85vh',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '130px 5% 110px',
            background: '#000', textAlign: 'center',
            overflow: 'hidden',
        }}>

            {/* PARALLAX LAYER 1: ambient glow blob
                FIX #4: Removed `transform: translateX(-50%)` — GSAP now owns
                the full transform via xPercent in the fromTo above. */}
            <div ref={bgGlowRef} style={{
                position: 'absolute', top: '10%', left: '50%',
                // No `transform` here — GSAP controls it entirely
                width: 600, height: 600, borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)',
                filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0,
                willChange: 'transform',
            }} />

            {/* PARALLAX LAYER 2: subtle dot/grid */}
            <div ref={gridRef} style={{
                position: 'absolute', inset: 0, zIndex: 1,
                backgroundImage: `
          linear-gradient(rgba(56,189,248,0.055) 1px, transparent 1px),
          linear-gradient(90deg, rgba(56,189,248,0.055) 1px, transparent 1px)
        `,
                backgroundSize: '64px 64px',
                pointerEvents: 'none', willChange: 'transform',
            }} />

            {/* Top fade */}
            <div style={{
                position: 'absolute', top: 0, left: 0, width: '100%', height: 180,
                background: 'linear-gradient(to bottom, #000, transparent)',
                pointerEvents: 'none', zIndex: 2,
            }} />

            {/* CONTENT */}
            <div style={{ position: 'relative', zIndex: 3, width: '100%', maxWidth: 680 }}>

                {/* Label + rule */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 44 }}>
                    <span ref={labelRef} style={{
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 11, fontWeight: 500,
                        letterSpacing: '0.28em', color: '#38bdf8',
                        textTransform: 'uppercase', whiteSpace: 'nowrap',
                    }}>Pricing</span>
                    <div ref={lineRef} style={{
                        flex: 1, height: 1,
                        background: 'linear-gradient(to right, #38bdf8, transparent)',
                    }} />
                </div>

                {/* "Starting At" — SplitType scrub reveal
                    FIX #6: overflow:hidden removed from the <p>; it's now applied
                    per-char in the useEffect so the clip animation is visible. */}
                <p ref={headingRef} style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 'clamp(11px, 1.4vw, 13px)',
                    color: 'rgba(255,255,255,0.35)',
                    letterSpacing: '0.28em', textTransform: 'uppercase',
                    marginBottom: 14,
                    // overflow: 'hidden' intentionally removed — applied per char in JS
                }}>
                    Starting At
                </p>

                {/* Price — scrub counter */}
                <div ref={priceRef} style={{
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(72px, 15vw, 168px)',
                    fontWeight: 800, lineHeight: 1,
                    letterSpacing: '-0.045em',
                    color: '#38bdf8',
                    textShadow: '0 0 100px rgba(56,189,248,0.3)',
                    marginBottom: 28,
                    willChange: 'transform',
                }}>
                    ₹0
                </div>

                {/* Subtitle */}
                <p ref={subtitleRef} style={{
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 'clamp(14px, 1.7vw, 18px)',
                    color: 'rgba(255,255,255,0.42)',
                    maxWidth: 460, margin: '0 auto 56px',
                    lineHeight: 1.75,
                }}>
                    Professional websites without the agency markup.<br />
                    Simple pricing, transparent process.
                </p>

                {/* CTA
                    FIX #3: boxShadow pulse moved into the onEnter callback above
                    so it starts only after the entrance animation finishes. */}
                <button
                    ref={ctaRef}
                    style={{
                        padding: '18px 58px',
                        fontFamily: 'DM Sans, sans-serif',
                        fontSize: 12, fontWeight: 600,
                        letterSpacing: '0.16em', textTransform: 'uppercase',
                        background: 'linear-gradient(135deg, #38bdf8, #00d4ff)',
                        color: '#000', border: 'none', borderRadius: 0,
                        boxShadow: '0 8px 40px rgba(56,189,248,0.25)',
                        cursor: 'pointer',
                    }}
                    onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.07, duration: 0.26, ease: 'back.out(2)' })}
                    onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1, duration: 0.26, ease: 'power2.out' })}
                    onClick={() => document.querySelector('#contact-section')?.scrollIntoView({ behavior: 'smooth' })}
                >
                    Get Started
                    <svg style={{ marginLeft: 10, verticalAlign: 'middle' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>

                {/* Perks */}
                <div ref={perksRef} style={{
                    display: 'flex', flexWrap: 'wrap',
                    justifyContent: 'center', gap: '12px 44px',
                    marginTop: 60,
                }}>
                    {perks.map((item, i) => (
                        <div key={i} className="pt-perk" style={{
                            display: 'flex', alignItems: 'center', gap: 10,
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 11, fontWeight: 500,
                            letterSpacing: '0.18em', textTransform: 'uppercase',
                            color: 'rgba(255,255,255,0.38)',
                        }}>
                            <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                                <circle cx="7.5" cy="7.5" r="6.5" stroke="#38bdf8" strokeWidth="1" />
                                <path d="M4.5 7.5l2.5 2.5 4-4" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PricingTeaser;