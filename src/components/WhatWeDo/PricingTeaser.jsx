import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PricingTeaser = () => {
    const containerRef = useRef(null);
    const priceRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        // BUG FIX #16: The animated counter uses `innerHTML` as the tween target
        // property. GSAP's `snap` only works on numeric values, but the `onUpdate`
        // callback immediately overwrites innerHTML with a formatted string like
        // "₹8,000". On the next tick GSAP tries to read innerHTML as a number,
        // gets NaN, and the animation breaks or produces "₹NaN".
        //
        // The original code tries to parse innerHTML back with Math.round(), but
        // `innerHTML` is already "₹8,000" (a string with commas and a ₹ symbol),
        // so Math.round("₹8,000") = NaN.
        //
        // FIX: Use a plain JS object as the tween target instead of the DOM node.
        // Animate a `value` property on the object and update the DOM in onUpdate.

        const counter = { value: 0 };

        const ctx = gsap.context(() => {
            gsap.fromTo(
                counter,        // ← tween a plain object, not the DOM node
                { value: 0 },
                {
                    value: 8000,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { value: 100 }, // snap the numeric value, not innerHTML
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 70%',
                        toggleActions: 'play none none none'
                    },
                    onUpdate() {
                        if (priceRef.current) {
                            // BUG FIX #16 cont: read from the plain object — always a clean number
                            priceRef.current.textContent =
                                '₹' + Math.round(counter.value).toLocaleString('en-IN');
                        }
                    },
                    onStart() {
                        // BUG FIX #17: The scale + opacity entrance animation was also
                        // targeting priceRef directly via a separate fromTo. Combining
                        // both on the same element without a timeline causes them to
                        // conflict. Separate the entrance (scale/opacity) from the
                        // counter (value) by animating scale/opacity independently here.
                        gsap.fromTo(priceRef.current,
                            { scale: 0.5, opacity: 0 },
                            { scale: 1, opacity: 1, duration: 0.8, ease: 'power2.out' }
                        );
                    }
                }
            );

            // CTA button bounce
            gsap.fromTo(ctaRef.current,
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 60%',
                        toggleActions: 'play none none none'
                    }
                }
            );

            // BUG FIX #18: The continuous glow pulse is created OUTSIDE the
            // scrollTrigger, so it starts immediately on mount regardless of
            // scroll position, and — critically — it is NOT killed by ctx.revert()
            // because ctx.revert() only kills tweens registered within the ctx scope.
            // Since this tween is inside the ctx callback it IS captured, but
            // it starts before the CTA is visible (opacity: 0 from the entrance
            // tween above), causing a flash of the glow shadow before the button
            // appears. FIX: delay until after the entrance animation completes.
            gsap.to(ctaRef.current, {
                boxShadow: '0 0 40px rgba(56, 189, 248, 0.8)',
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                delay: 1.2 // BUG FIX #18: wait for entrance (elastic.out ~1s)
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                minHeight: '80vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '100px 5%',
                background: 'linear-gradient(180deg, #000000 0%, #000000 100%)',
                textAlign: 'center',
                position: 'relative'
            }}
        >
            <div style={{
                position: 'absolute',
                top: 0, left: 0,
                width: '100%', height: '150px',
                background: 'linear-gradient(to bottom, #000000, transparent)',
                pointerEvents: 'none'
            }} />

            <p style={{
                fontSize: 'clamp(18px, 2vw, 24px)',
                color: '#a0a0a0',
                marginBottom: '20px',
                textTransform: 'uppercase',
                letterSpacing: '3px',
                fontFamily: '"Inter", sans-serif'
            }}>
                Starting At
            </p>

            {/* BUG FIX #16 cont: initial display value set here; GSAP updates
                via textContent (not innerHTML) for safety and performance */}
            <div
                ref={priceRef}
                style={{
                    fontSize: 'clamp(60px, 12vw, 150px)',
                    fontWeight: 900,
                    color: '#38bdf8',
                    fontFamily: '"Syne", sans-serif',
                    textShadow: '0 0 60px rgba(56, 189, 248, 0.5)',
                    marginBottom: '20px'
                }}
            >
                ₹0
            </div>

            <p style={{
                fontSize: 'clamp(16px, 2vw, 22px)',
                color: '#a0a0a0',
                marginBottom: '50px',
                fontFamily: '"Inter", sans-serif',
                maxWidth: '500px',
                lineHeight: 1.6
            }}>
                Professional websites without the agency markup. Simple pricing, transparent process.
            </p>

            <button
                ref={ctaRef}
                style={{
                    padding: '20px 60px',
                    fontSize: '20px',
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #38bdf8, #00d4ff)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    boxShadow: '0 10px 40px rgba(56, 189, 248, 0.3)',
                    // BUG FIX #19: CSS `transition: transform` on the button conflicts
                    // with GSAP animating `scale` on the same element (onMouseEnter/Leave).
                    // When GSAP sets transform via matrix3d, the CSS transition intercepts
                    // it and causes jank or duplicate animation. Remove the CSS transition.
                    // transition: 'transform 0.3s ease'  ← REMOVED
                }}
                onMouseEnter={(e) => {
                    gsap.to(e.target, { scale: 1.1, duration: 0.3, ease: 'back.out(2)' });
                }}
                onMouseLeave={(e) => {
                    gsap.to(e.target, { scale: 1, duration: 0.3, ease: 'power2.out' });
                }}
                onClick={() => {
                    document.querySelector('.contact-section')?.scrollIntoView({
                        behavior: 'smooth'
                    });
                }}
            >
                Get Started →
            </button>

            <div style={{
                marginTop: '60px',
                display: 'flex',
                gap: '40px',
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}>
                {['No Hidden Fees', 'Fast Delivery', '30 Days Support'].map((item, index) => (
                    <div
                        key={index}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px',
                            color: '#a0a0a0',
                            fontSize: '14px',
                            textTransform: 'uppercase',
                            letterSpacing: '1px'
                        }}
                    >
                        <svg width="20" height="20" viewBox="0 0 20 20">
                            <circle cx="10" cy="10" r="9" fill="none" stroke="#38bdf8" strokeWidth="2" />
                            <path d="M6 10 L9 13 L14 7" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingTeaser;