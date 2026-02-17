import { useRef, useEffect, forwardRef, memo } from 'react';
import { gsap } from 'gsap';
import SplitType from 'split-type';

const HeroContent = memo(forwardRef(({ isLoaded }, ref) => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const ctaRef = useRef(null);

    useEffect(() => {
        if (!isLoaded || !titleRef.current || !subtitleRef.current) return;

        const subtitleSplit = new SplitType(subtitleRef.current, {
            types: 'words',
            tagName: 'span'
        });

        // ✅ FIX: Increased delay to ensure fonts are loaded
        const tl = gsap.timeline({ delay: 0.5 });

        const vmText = titleRef.current.querySelector('.vm-text');
        const websitesText = titleRef.current.querySelector('.websites-text');

        if (vmText) {
            tl.from(vmText, {
                y: 80,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            });
        }

        if (websitesText) {
            tl.from(websitesText, {
                y: 80,
                opacity: 0,
                duration: 1.2,
                ease: 'power3.out'
            }, '<');
        }

        if (subtitleSplit.words) {
            tl.from(subtitleSplit.words, {
                opacity: 0,
                y: 20,
                duration: 0.6,
                stagger: 0.05,
                ease: 'power3.out'
            }, '-=0.6');
        }

        if (ctaRef.current?.children?.length > 0) {
            tl.from(ctaRef.current.children, {
                scale: 0,
                opacity: 0,
                duration: 0.8,
                ease: 'elastic.out(1, 0.5)',
                stagger: 0.15
            }, '-=0.4');
        }

        return () => {
            subtitleSplit.revert();
            tl.kill();
        };
    }, [isLoaded]);

    // ✅ FIX: Lenis-compatible scroll handler
    const scrollToSection = (id) => {
        const section = document.getElementById(id);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

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
                    fontFamily: 'var(--font-display)',
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
                        color: '#ffffff',
                        textShadow: '0 0 30px rgba(56, 189, 248, 0.8), 0 0 10px rgba(255, 255, 255, 0.8)',
                        willChange: 'transform, opacity'
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
                        WebkitTextStroke: '2px rgba(255,255,255,0.8)',
                        letterSpacing: '0.02em',
                        marginTop: '0',
                        willChange: 'transform, opacity'
                    }}
                >
                    CREATIONS
                </span>
            </h1>

            <p
                ref={subtitleRef}
                className="hero-subtitle"
                style={{
                    fontSize: 'clamp(14px, 2vw, 22px)',
                    color: '#a0a0a0',
                    marginBottom: '50px',
                    fontFamily: 'var(--font-body)',
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
                <button
                    className="cta-primary"
                    onClick={() => scrollToSection('work-section')}
                >
                    See Our Work
                </button>
                <button
                    className="cta-secondary"
                    onClick={() => scrollToSection('contact-section')}
                >
                    Get in Touch
                </button>
            </div>
        </div>
    );
}));

HeroContent.displayName = 'HeroContent';

export default HeroContent;