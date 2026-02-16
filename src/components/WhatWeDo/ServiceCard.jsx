import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ServiceCard = ({ service, index }) => {
    const cardRef = useRef(null);
    const videoRef = useRef(null);
    const overlayRef = useRef(null);
    const contentRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Pin card while scrolling through it
            ScrollTrigger.create({
                trigger: cardRef.current,
                start: 'top top',
                end: '+=100%',
                pin: true,
                pinSpacing: true,
                anticipatePin: 1
            });

            // Video zoom on scroll
            gsap.fromTo(videoRef.current,
                { scale: 1.3 },
                {
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top bottom',
                        end: 'top top',
                        scrub: 1
                    }
                }
            );

            // Content reveal on scroll
            gsap.fromTo(contentRef.current,
                { opacity: 0, y: 100 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 60%',
                        toggleActions: 'play none none reverse'
                    }
                }
            );

            // Parallax effect on scroll-out
            gsap.to(cardRef.current, {
                y: -200,
                opacity: 0.5,
                scale: 0.9,
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'bottom bottom',
                    end: 'bottom top',
                    scrub: 1
                }
            });

        }, cardRef);

        return () => ctx.revert();
    }, []);

    // Lazy Load & Play/Pause Logic
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    // Load video when completely or partially in view (with margin)
                    if (entry.isIntersecting) {
                        if (!isLoaded) {
                            video.d = 'auto'; // Set preload to auto to start loading
                            setIsLoaded(true);
                        }

                        // Play if it's actually visible on screen
                        video.play().catch(e => console.log('Autoplay prevented:', e));
                        setIsPlaying(true);
                    } else {
                        // Pause when out of view
                        video.pause();
                        setIsPlaying(false);
                    }
                });
            },
            {
                rootMargin: '200px 0px', // Start loading 200px before it enters viewport
                threshold: 0.1
            }
        );

        observer.observe(cardRef.current);

        return () => {
            observer.disconnect();
        };
    }, [isLoaded]);

    // Mouse move 3D tilt effect
    const handleMouseMove = (e) => {
        if (!isHovered) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;

        gsap.to(cardRef.current, {
            rotateY: x,
            rotateX: y,
            duration: 0.5,
            ease: 'power2.out'
        });

        gsap.to(contentRef.current, {
            x: -x * 2,
            y: -y * 2,
            duration: 0.5,
            ease: 'power2.out'
        });
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
        gsap.to(cardRef.current, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
        gsap.to(contentRef.current, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: 'power2.out'
        });
    };

    return (
        <div
            ref={cardRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
            style={{
                height: '100vh',
                position: 'relative',
                overflow: 'hidden',
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                cursor: 'pointer'
            }}
        >
            {/* Background Video */}
            <video
                ref={videoRef}
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
                    filter: isHovered ? 'brightness(0.8) blur(5px)' : 'brightness(0.6)',
                    transition: 'filter 0.5s ease',
                    opacity: isLoaded ? 1 : 0 // Fade in when loaded
                }}
                onLoadedData={() => gsap.to(videoRef.current, { opacity: 1, duration: 0.5 })}
            >
                <source src={service.videoSrc} type="video/mp4" />
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
                    background: `radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)`,
                    zIndex: 2
                }}
            />

            {/* Content */}
            <div
                ref={contentRef}
                style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 3,
                    textAlign: 'center',
                    width: '90%',
                    maxWidth: '800px'
                }}
            >
                {/* Service Number */}
                <div style={{
                    fontSize: 'clamp(60px, 8vw, 120px)',
                    fontWeight: 900,
                    color: 'rgba(255, 255, 255, 0.1)',
                    marginBottom: '-40px',
                    fontFamily: '"Syne", sans-serif'
                }}>
                    0{index + 1}
                </div>

                {/* Service Title */}
                <h3 style={{
                    fontSize: 'clamp(50px, 8vw, 100px)',
                    fontWeight: 900,
                    color: service.color,
                    marginBottom: '10px',
                    fontFamily: '"Syne", sans-serif',
                    textShadow: `0 0 40px ${service.color}`,
                    letterSpacing: '0.05em'
                }}>
                    {service.title}
                </h3>

                {/* Subtitle */}
                <p style={{
                    fontSize: 'clamp(16px, 2vw, 24px)',
                    color: '#ffffff',
                    marginBottom: '20px',
                    fontFamily: '"Inter", sans-serif',
                    textTransform: 'uppercase',
                    letterSpacing: '3px',
                    opacity: 0.8
                }}>
                    {service.subtitle}
                </p>

                {/* Description */}
                <p style={{
                    fontSize: 'clamp(18px, 2.5vw, 32px)',
                    color: '#a0a0a0',
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: 300,
                    marginTop: '30px',
                    opacity: isHovered ? 1 : 0,
                    transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s ease'
                }}>
                    {service.description}
                </p>

                {/* CTA Button (appears on hover) */}
                <button
                    style={{
                        marginTop: '40px',
                        padding: '18px 50px',
                        fontSize: '18px',
                        fontWeight: 700,
                        background: service.color,
                        color: '#000',
                        border: 'none',
                        borderRadius: '50px',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '2px',
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.9)',
                        transition: 'all 0.5s ease',
                        boxShadow: `0 10px 40px ${service.color}40`
                    }}
                    onMouseEnter={(e) => {
                        gsap.to(e.target, {
                            scale: 1.1,
                            boxShadow: `0 20px 60px ${service.color}80`,
                            duration: 0.3
                        });
                    }}
                    onMouseLeave={(e) => {
                        gsap.to(e.target, {
                            scale: 1,
                            boxShadow: `0 10px 40px ${service.color}40`,
                            duration: 0.3
                        });
                    }}
                >
                    See Examples →
                </button>
            </div>

            {/* Decorative Corner Accents */}
            <div style={{
                position: 'absolute',
                top: '30px',
                left: '30px',
                width: '60px',
                height: '60px',
                borderTop: `3px solid ${service.color}`,
                borderLeft: `3px solid ${service.color}`,
                zIndex: 4,
                opacity: 0.5
            }} />
            <div style={{
                position: 'absolute',
                bottom: '30px',
                right: '30px',
                width: '60px',
                height: '60px',
                borderBottom: `3px solid ${service.color}`,
                borderRight: `3px solid ${service.color}`,
                zIndex: 4,
                opacity: 0.5
            }} />
        </div>
    );
};

export default ServiceCard;
