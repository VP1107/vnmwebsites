import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const SectionIntro = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Split text into characters
            const titleSplit = new SplitType(titleRef.current, { types: 'chars' });

            // Animate on scroll
            gsap.fromTo(titleSplit.chars,
                {
                    opacity: 0,
                    y: 100,
                    rotateX: -90,
                    transformOrigin: 'top center'
                },
                {
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    stagger: 0.03,
                    duration: 1,
                    ease: 'back.out(1.5)',
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: 'top 80%',
                        end: 'top 30%',
                        scrub: 1
                    }
                }
            );

            // Subtitle fades + slides up
            gsap.fromTo(subtitleRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: subtitleRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );

            // Continuous shimmer effect
            gsap.to(titleSplit.chars, {
                color: '#38bdf8',
                textShadow: '0 0 20px #38bdf8',
                duration: 0.3,
                stagger: {
                    each: 0.05,
                    repeat: -1,
                    yoyo: true
                }
            });

        });

        return () => ctx.revert();
    }, []);

    return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 5%',
            textAlign: 'center'
        }}>
            <h2
                ref={titleRef}
                style={{
                    fontSize: 'clamp(50px, 10vw, 150px)',
                    fontWeight: 900,
                    color: '#ffffff',
                    marginBottom: '30px',
                    fontFamily: '"Syne", sans-serif',
                    letterSpacing: '0.02em',
                    perspective: '1000px'
                }}
            >
                WHAT WE BUILD
            </h2>

            <p
                ref={subtitleRef}
                style={{
                    fontSize: 'clamp(18px, 2.5vw, 28px)',
                    color: '#a0a0a0',
                    maxWidth: '600px',
                    lineHeight: 1.6,
                    fontFamily: '"Inter", sans-serif'
                }}
            >
                Fast, beautiful, mobile-first websites that help your business grow
            </p>

            {/* Decorative line */}
            <div style={{
                width: '100px',
                height: '3px',
                background: 'linear-gradient(90deg, #38bdf8, #00d4ff, #0ea5e9)',
                marginTop: '30px',
                borderRadius: '10px'
            }} />
        </div>
    );
};

export default SectionIntro;
