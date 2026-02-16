import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const FinalCTA = () => {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const textRef = useRef(null);
    const buttonRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top 70%',
                    end: 'top 30%',
                    scrub: 1
                }
            });

            // Text slides up
            tl.fromTo(textRef.current,
                { y: 100, opacity: 0 },
                { y: 0, opacity: 1 }
            );

            // Button elastic bounce
            tl.fromTo(buttonRef.current,
                { scale: 0, rotation: -180 },
                {
                    scale: 1,
                    rotation: 0,
                    ease: 'elastic.out(1, 0.5)',
                    duration: 1
                },
                '-=0.3'
            );

            // Video zoom effect
            gsap.to(videoRef.current, {
                scale: 1.2,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            // Button hover animation
            if (buttonRef.current) {
                buttonRef.current.addEventListener('mouseenter', () => {
                    gsap.to(buttonRef.current, {
                        scale: 1.1,
                        boxShadow: '0 20px 60px rgba(56, 189, 248, 0.5)',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });

                buttonRef.current.addEventListener('mouseleave', () => {
                    gsap.to(buttonRef.current, {
                        scale: 1,
                        boxShadow: '0 10px 40px rgba(56, 189, 248, 0.3)',
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                });
            }
        }, containerRef);

        return () => ctx.revert();

    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                height: '100vh',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                background: '#000000'
            }}
        >
            {/* Top Fade Gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '250px',
                background: 'linear-gradient(to bottom, #000000, transparent)',
                zIndex: 4,
                pointerEvents: 'none'
            }} />

            {/* Bottom Fade Gradient */}
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '250px',
                background: 'linear-gradient(to top, #000000, transparent)',
                zIndex: 4,
                pointerEvents: 'none'
            }} />
            {/* Background Video */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                poster={`${import.meta.env.BASE_URL}images/responsive_mockup.webp`}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    minWidth: '100%',
                    minHeight: '100%',
                    width: 'auto',
                    height: 'auto',
                    transform: 'translate(-50%, -50%)',
                    objectFit: 'cover',
                    zIndex: 1,
                    filter: 'brightness(0.3) blur(2px)'
                }}
            >
                <source src={`${import.meta.env.BASE_URL}videos/FinalCTA.mp4`} type="video/mp4" />
            </video>

            {/* Gradient Overlay */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'radial-gradient(circle, transparent 0%, #000000 80%)',
                zIndex: 2
            }} />

            {/* Content */}
            <div style={{
                position: 'relative',
                zIndex: 3,
                textAlign: 'center',
                width: '90%'
            }}>
                <h2
                    ref={textRef}
                    style={{
                        fontSize: 'clamp(30px, 5vw, 70px)',
                        fontWeight: 900,
                        color: '#ffffff',
                        marginBottom: '40px',
                        lineHeight: 1.2,
                        fontFamily: '"Syne", sans-serif'
                    }}
                >
                    Ready to build something<br />
                    <span style={{
                        color: '#38bdf8',
                        WebkitTextStroke: '1px #38bdf8',
                        fontStyle: 'italic'
                    }}>
                        extraordinary?
                    </span>
                </h2>

                <button
                    ref={buttonRef}
                    className="final-cta-btn" // Added class for potential global style hook
                    style={{
                        padding: '20px 50px',
                        fontSize: 'max(16px, 1.5vw)',
                        fontWeight: 700,
                        background: 'linear-gradient(135deg, #38bdf8, #00d4ff)',
                        color: '#000000',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        boxShadow: '0 10px 40px rgba(56, 189, 248, 0.3)',
                        textTransform: 'uppercase',
                        letterSpacing: '1px',
                        fontFamily: '"Inter", sans-serif'
                    }}
                    onClick={() => {
                        // Placeholder logic
                        console.log("Scroll to contact");
                    }}
                >
                    Let's Work Together
                </button>
            </div>
        </div>
    );
};

export default FinalCTA;
