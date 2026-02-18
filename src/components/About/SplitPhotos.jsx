import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import aboutData from '../../data/about.json';

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
                background: [
                    'radial-gradient(ellipse 60vw 60vw at 90% 10%, rgba(56,189,248,0.22) 0%, transparent 70%)',
                    'radial-gradient(ellipse 45vw 45vw at 10% 90%, rgba(14,165,233,0.18) 0%, transparent 65%)',
                    '#000'
                ].join(', ')
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
                    boxShadow: '0 15px 50px rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    background: '#111'
                }}
            >
                {/* Photo Vatsal */}
                <img
                    src={`${import.meta.env.BASE_URL}images/responsive_mockup.webp`}
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
                    borderLeft: `4px solid ${aboutData.team[0].color}`
                }}>
                    <p style={{
                        color: aboutData.team[0].color,
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '5px',
                        fontFamily: '"Inter", sans-serif'
                    }}>{aboutData.team[0].role}</p>
                    <h3 style={{
                        color: '#ffffff',
                        fontSize: '24px',
                        fontWeight: 700,
                        margin: 0,
                        fontFamily: '"Syne", sans-serif'
                    }}>{aboutData.team[0].name}</h3>
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
                    boxShadow: '0 15px 50px rgba(0, 212, 255, 0.1)',
                    border: '1px solid rgba(0, 212, 255, 0.3)',
                    background: '#111'
                }}
            >
                {/* Photo Mann */}
                <img
                    src={`${import.meta.env.BASE_URL}images/responsive_mockup.webp`}
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
                    borderRight: `4px solid ${aboutData.team[1].color}`
                }}>
                    <p style={{
                        color: aboutData.team[1].color,
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        marginBottom: '5px',
                        textAlign: 'right',
                        fontFamily: '"Inter", sans-serif'
                    }}>{aboutData.team[1].role}</p>
                    <h3 style={{
                        color: '#ffffff',
                        fontSize: '24px',
                        fontWeight: 700,
                        margin: 0,
                        textAlign: 'right',
                        fontFamily: '"Syne", sans-serif'
                    }}>{aboutData.team[1].name}</h3>
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
                    WebkitTextStroke: '2px #38bdf8',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: '"Syne", sans-serif',
                    margin: 0
                }}>
                    {aboutData.brand.title}
                </h2>
                <p style={{
                    color: '#a0a0a0',
                    fontSize: '18px',
                    marginTop: '10px',
                    letterSpacing: '3px',
                    textTransform: 'uppercase',
                    fontFamily: '"Inter", sans-serif'
                }}>
                    {aboutData.brand.subtitle}
                </p>
            </div>
        </div>
    );
};

export default SplitPhotos;
