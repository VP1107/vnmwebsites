import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PricingTeaser = () => {
    const containerRef = useRef(null);
    const priceRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animated counter
            gsap.fromTo(priceRef.current,
                {
                    innerHTML: 0,
                    scale: 0.5,
                    opacity: 0
                },
                {
                    innerHTML: 8000,
                    scale: 1,
                    opacity: 1,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerHTML: 100 }, // Snap to nearest 100
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top 70%',
                        toggleActions: 'play none none none'
                    },
                    onUpdate: function () {
                        // Using raw DOM manipulation for performance in animation loop
                        if (this.targets()[0]) {
                            this.targets()[0].innerHTML = '₹' + Math.round(this.targets()[0].innerHTML).toLocaleString('en-IN');
                        }
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

            // Continuous glow pulse
            gsap.to(ctaRef.current, {
                boxShadow: '0 0 40px rgba(0, 255, 136, 0.8)',
                duration: 1.5,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut'
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
                background: 'linear-gradient(180deg, #000000 0%, #0a0a0a 100%)',
                textAlign: 'center'
            }}
        >
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

            <div
                ref={priceRef}
                style={{
                    fontSize: 'clamp(60px, 12vw, 150px)',
                    fontWeight: 900,
                    color: '#00ff88',
                    fontFamily: '"Syne", sans-serif',
                    textShadow: '0 0 60px rgba(0, 255, 136, 0.5)',
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
                    background: 'linear-gradient(135deg, #00ff88, #00d4ff)',
                    color: '#000',
                    border: 'none',
                    borderRadius: '50px',
                    cursor: 'pointer',
                    textTransform: 'uppercase',
                    letterSpacing: '2px',
                    boxShadow: '0 10px 40px rgba(0, 255, 136, 0.3)',
                    transition: 'transform 0.3s ease'
                }}
                onMouseEnter={(e) => {
                    gsap.to(e.target, {
                        scale: 1.1,
                        duration: 0.3,
                        ease: 'back.out(2)'
                    });
                }}
                onMouseLeave={(e) => {
                    gsap.to(e.target, {
                        scale: 1,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                }}
                onClick={() => {
                    document.querySelector('.contact-section')?.scrollIntoView({
                        behavior: 'smooth'
                    });
                }}
            >
                Get Started →
            </button>

            {/* Decorative elements */}
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
                            <circle cx="10" cy="10" r="9" fill="none" stroke="#00ff88" strokeWidth="2" />
                            <path d="M6 10 L9 13 L14 7" fill="none" stroke="#00ff88" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {item}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PricingTeaser;
