import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const DesignVideo = () => {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const textLinesRef = useRef([]);

    const textLines = [
        "First-year students.",
        "Modern tools.",
        "Fresh ideas.",
        "Zero corporate BS."
    ];

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Master timeline for the entire sequence
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=400%',
                    scrub: 1,
                    pin: true,
                    pinSpacing: true
                }
            });

            // Video zoom effect
            tl.to(videoRef.current, {
                scale: 1.15,
                ease: 'none'
            }, 0);

            // Sequential text animations
            textLinesRef.current.forEach((line, index) => {
                if (!line) return;

                const fadeInStart = index * 2.5;
                const holdStart = fadeInStart + 1;
                const fadeOutStart = holdStart + 0.5;

                // 1. Fade In
                tl.fromTo(line,
                    {
                        opacity: 0,
                        y: 80,
                        scale: 0.9,
                        filter: 'blur(10px)'
                    },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        filter: 'blur(0px)',
                        duration: 1,
                        ease: 'power3.out'
                    },
                    fadeInStart
                );

                // 2. Hold
                tl.to(line, {
                    opacity: 1,
                    duration: 0.5
                }, holdStart);

                // 3. Fade Out
                tl.to(line, {
                    opacity: 0,
                    y: -80,
                    scale: 1.1,
                    filter: 'blur(10px)',
                    duration: 0.8,
                    ease: 'power3.in'
                }, fadeOutStart);
            });

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                background: '#000'
            }}
        >
            {/* Background Video using PUBLIC path */}
            <video
                ref={videoRef}
                autoPlay
                loop
                muted
                playsInline
                preload="none"
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
                    filter: 'brightness(0.6)'
                }}
            >
                <source src={`${import.meta.env.BASE_URL}videos/design-process.mp4`} type="video/mp4" />
            </video>

            {/* Gradient Overlay for legibility */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
                zIndex: 1,
                pointerEvents: 'none'
            }} />

            {/* Scrolling Text Lines Container */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 2,
                width: '90%',
                maxWidth: '1200px',
                pointerEvents: 'none',
                display: 'grid',
                placeItems: 'center'
            }}>
                {textLines.map((text, index) => (
                    <h2
                        key={index}
                        ref={el => textLinesRef.current[index] = el}
                        style={{
                            gridArea: '1 / 1',
                            fontSize: 'clamp(40px, 7vw, 100px)',
                            fontWeight: 900,
                            color: '#ffffff',
                            textAlign: 'center',
                            opacity: 0,
                            textShadow: '0 4px 40px rgba(0, 0, 0, 0.9)',
                            fontFamily: '"Syne", sans-serif',
                            margin: 0,
                            willChange: 'opacity, transform, filter'
                        }}
                    >
                        {text}
                    </h2>
                ))}
            </div>
        </div>
    );
};

export default DesignVideo;