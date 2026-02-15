import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const SplitPhotos = () => {
    const containerRef = useRef(null);
    const leftPhotoRef = useRef(null);
    const rightPhotoRef = useRef(null);
    const centerTextRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });

            // Left photo moves slower (parallax) - Starts offset
            tl.fromTo(leftPhotoRef.current,
                { y: 100, opacity: 0.5, rotation: -2 },
                { y: -100, opacity: 1, rotation: 0 },
                0
            );

            // Right photo moves faster (opposite parallax)
            tl.fromTo(rightPhotoRef.current,
                { y: 200, opacity: 0.5, rotation: 2 },
                { y: -200, opacity: 1, rotation: 0 },
                0
            );

            // Center text scales up dramatically
            tl.fromTo(centerTextRef.current,
                { scale: 0.5, opacity: 0 },
                { scale: 1.2, opacity: 1 },
                0.2
            )
                .to(centerTextRef.current,
                    { scale: 1, opacity: 0.8 },
                    0.6
                );
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                height: '120vh',
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                padding: '0 5%',
                background: '#000000'
            }}
        >
            {/* Left Photo - Vatsal */}
            <div
                ref={leftPhotoRef}
                style={{
                    position: 'absolute',
                    left: '5%',
                    width: '40%', // Slightly smaller to fit
                    height: '60vh',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 30px 100px rgba(0, 255, 136, 0.2)',
                    border: '1px solid rgba(0, 255, 136, 0.3)',
                    background: '#111'
                }}
            >
                {/* Photo Vatsal */}
                <img
                    src="/images/responsive_mockup.webp"
                    alt="Vatsal"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }}
                />

                {/* Name Tag Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    left: '30px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '15px 25px',
                    borderRadius: '10px',
                    backdropFilter: 'blur(10px)',
                    borderLeft: '4px solid #00ff88'
                }}>
                    <p style={{
                        color: '#00ff88',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '5px',
                        fontFamily: '"Inter", sans-serif'
                    }}>Frontend Dev</p>
                    <h3 style={{
                        color: '#ffffff',
                        fontSize: '24px',
                        fontWeight: 700,
                        margin: 0,
                        fontFamily: '"Syne", sans-serif'
                    }}>VATSAL</h3>
                </div>
            </div>

            {/* Right Photo - Mann */}
            <div
                ref={rightPhotoRef}
                style={{
                    position: 'absolute',
                    right: '5%',
                    width: '40%',
                    height: '60vh',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    boxShadow: '0 30px 100px rgba(0, 212, 255, 0.2)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    background: '#111'
                }}
            >
                {/* Photo Mann */}
                <img
                    src="/images/responsive_mockup.webp"
                    alt="Mann"
                    style={{ width: '100%', height: '100%', objectFit: 'cover', filter: 'grayscale(20%)' }}
                />

                {/* Name Tag Overlay */}
                <div style={{
                    position: 'absolute',
                    bottom: '30px',
                    right: '30px',
                    background: 'rgba(0, 0, 0, 0.8)',
                    padding: '15px 25px',
                    borderRadius: '10px',
                    backdropFilter: 'blur(10px)',
                    borderRight: '4px solid #00d4ff'
                }}>
                    <p style={{
                        color: '#00d4ff',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '5px',
                        textAlign: 'right',
                        fontFamily: '"Inter", sans-serif'
                    }}>UI Designer</p>
                    <h3 style={{
                        color: '#ffffff',
                        fontSize: '24px',
                        fontWeight: 700,
                        margin: 0,
                        textAlign: 'right',
                        fontFamily: '"Syne", sans-serif'
                    }}>MANN</h3>
                </div>
            </div>

            {/* Center Connecting Text */}
            <div
                ref={centerTextRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 10,
                    textAlign: 'center'
                }}
            >
                <h2 style={{
                    fontSize: 'clamp(50px, 8vw, 120px)',
                    fontWeight: 900,
                    color: '#ffffff',
                    textShadow: '0 0 40px rgba(0, 0, 0, 0.9)',
                    letterSpacing: '0.05em',
                    WebkitTextStroke: '2px #00ff88',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: '"Syne", sans-serif',
                    margin: 0
                }}>
                    V&M
                </h2>
                <p style={{
                    color: '#a0a0a0',
                    fontSize: '18px',
                    marginTop: '10px',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    fontFamily: '"Inter", sans-serif'
                }}>
                    Est. 2025
                </p>
            </div>
        </div>
    );
};

export default SplitPhotos;
