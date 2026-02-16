import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const VideoIntro = () => {
    const containerRef = useRef(null);
    const videoRef = useRef(null);
    const overlayRef = useRef(null);
    const textRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Video zoom + opacity on scroll
            gsap.to(videoRef.current, {
                scale: 1.3,
                opacity: 0.3,
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1,
                    pin: false
                }
            });

            // Text fade in then out
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            tl.fromTo(textRef.current,
                { opacity: 0, y: 50, scale: 0.8 },
                { opacity: 1, y: 0, scale: 1, duration: 0.3 }
            )
                .to(textRef.current,
                    { opacity: 0, y: -50, scale: 1.2, duration: 0.3 },
                    0.7
                );

            // Overlay vignette darkens as you scroll
            gsap.to(overlayRef.current, {
                opacity: 0.9, // Darken more
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: 'bottom top',
                    scrub: 1
                }
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
                background: '#000000'
            }}
        >
            {/* Top Fade Gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '200px',
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
                height: '200px',
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
                    filter: 'brightness(0.5)'
                }}
            >
                <source src={`${import.meta.env.BASE_URL}videos/intro.mp4`} type="video/mp4" />
            </video>

            {/* Dark Overlay */}
            <div
                ref={overlayRef}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    background: 'radial-gradient(circle, transparent 0%, #000000 100%)',
                    opacity: 0.4,
                    zIndex: 2
                }}
            />

            {/* Center Text */}
            <div
                ref={textRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3,
                    textAlign: 'center',
                    color: '#ffffff',
                    width: '100%'
                }}
            >
                <h2 style={{
                    fontSize: 'clamp(40px, 6vw, 80px)',
                    fontWeight: 900,
                    marginBottom: '20px',
                    letterSpacing: '0.02em',
                    textShadow: '0 4px 30px rgba(0, 0, 0, 0.8)',
                    fontFamily: '"Syne", sans-serif'
                }}>
                    MEET THE BUILDERS
                </h2>
                <div style={{
                    width: '100px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #38bdf8, #00d4ff)',
                    margin: '0 auto',
                    boxShadow: '0 0 20px #38bdf8'
                }} />
            </div>
        </div>
    );
};

export default VideoIntro;
