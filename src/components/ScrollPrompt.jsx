import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const ScrollPrompt = () => {
    const promptRef = useRef(null);

    useEffect(() => {
        // Bounce animation
        gsap.to(promptRef.current, {
            y: 15,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: 'power1.inOut'
        });

        // Fade out on scroll
        gsap.to(promptRef.current, {
            scrollTrigger: {
                trigger: 'body',
                start: 'top top',
                end: '100 top',
                scrub: true
            },
            opacity: 0,
            y: 50
        });
    }, []);

    return (
        <div
            ref={promptRef}
            style={{
                position: 'absolute',
                bottom: '40px',
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 6,
                textAlign: 'center',
                cursor: 'pointer'
            }}
            onClick={() => {
                window.scrollTo({
                    top: window.innerHeight,
                    behavior: 'smooth'
                });
            }}
        >
            <svg width="30" height="50" viewBox="0 0 30 50">
                <rect
                    x="5"
                    y="5"
                    width="20"
                    height="40"
                    rx="10"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="2"
                />
                <circle
                    cx="15"
                    cy="15"
                    r="3"
                    fill="#38bdf8"
                >
                    <animate
                        attributeName="cy"
                        from="15"
                        to="30"
                        dur="1.5s"
                        repeatCount="indefinite"
                    />
                    <animate
                        attributeName="opacity"
                        from="1"
                        to="0"
                        dur="1.5s"
                        repeatCount="indefinite"
                    />
                </circle>
            </svg>
            <p style={{
                color: '#a0a0a0',
                fontSize: '12px',
                marginTop: '10px',
                letterSpacing: '2px',
                textTransform: 'uppercase',
                fontFamily: 'var(--font-body, sans-serif)'
            }}>
                Scroll to Explore
            </p>
        </div>
    );
};

export default ScrollPrompt;
