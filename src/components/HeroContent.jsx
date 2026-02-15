import { useRef, useEffect, forwardRef, memo } from 'react';
import { gsap } from 'gsap';

const HeroContent = memo(forwardRef(({ isLoaded }, ref) => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        if (!isLoaded || !titleRef.current) return;

        const tl = gsap.timeline({ delay: 1.5 });

        // Animate V&M (Slide up + fade)
        tl.from(titleRef.current.querySelector('.vm-text'), {
            y: 80,
            opacity: 0,
            duration: 1.2,
            ease: 'power3.out'
        });

        // Animate WEBSITES (Slide up + fade + spread)
        tl.from(titleRef.current.querySelector('.websites-text'), {
            y: 40,
            opacity: 0,
            letterSpacing: '0.5em',
            duration: 1.4,
            ease: 'power3.out'
        }, '-=0.8');

        // Subtitle
        tl.from(subtitleRef.current, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: 'power3.out'
        }, '-=0.6');

        // Buttons
        if (ctaRef.current && ctaRef.current.children) {
            tl.from(ctaRef.current.children, {
                scale: 0,
                opacity: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)',
                stagger: 0.15
            }, '-=0.4');
        }

    }, [isLoaded]);

    return (
        <div
            ref={ref}
            className="hero-content-wrapper"
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                zIndex: 4,
                width: '100%',
                maxWidth: '1400px',
                pointerEvents: 'none'
            }}
        >
            <h1
                ref={titleRef}
                className="hero-title"
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '30px',
                    fontFamily: '"Syne", sans-serif',
                    fontWeight: 900,
                    color: '#ffffff',
                    lineHeight: '0.9'
                }}
            >
                <span
                    className="vm-text"
                    style={{
                        fontSize: 'clamp(80px, 15vw, 220px)',
                        display: 'block',
                        background: 'linear-gradient(to bottom, #ffffff, #aaaaaa)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0 0 40px rgba(0,255,136,0.3))'
                    }}
                >
                    V&M
                </span>
                <span
                    className="websites-text"
                    style={{
                        fontSize: 'clamp(30px, 6vw, 90px)',
                        display: 'block',
                        color: 'transparent',
                        WebkitTextStroke: '2px rgba(255,255,255,0.8)', // Outlined
                        letterSpacing: '0.02em',
                        marginTop: '-2%'
                    }}
                >
                    WEBSITES
                </span>
            </h1>

            <p
                ref={subtitleRef}
                className="hero-subtitle"
                style={{
                    fontSize: 'clamp(14px, 2vw, 22px)',
                    color: '#a0a0a0',
                    marginBottom: '50px',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 400,
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                }}
            >
                We build digital experiences that shock and inspire
            </p>

            <div
                ref={ctaRef}
                style={{
                    display: 'flex',
                    gap: '20px',
                    justifyContent: 'center',
                    flexWrap: 'wrap',
                    pointerEvents: 'auto'
                }}
            >
                <button className="cta-primary">Start Your Project</button>
                <button className="cta-secondary">View Our Work</button>
            </div>
        </div>
    );
}));

export default HeroContent;
