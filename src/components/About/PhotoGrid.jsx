import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const PhotoGrid = () => {
    const gridRef = useRef(null);
    const photosRef = useRef([]);

    const photos = Array(9).fill(null); // Placeholders

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Stagger fade-in for all photos
            gsap.fromTo(photosRef.current,
                {
                    opacity: 0,
                    scale: 0.8,
                    rotation: () => gsap.utils.random(-10, 10)
                },
                {
                    opacity: 1,
                    scale: 1,
                    rotation: 0,
                    duration: 1,
                    stagger: {
                        amount: 0.8,
                        from: 'random'
                    },
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top 80%',
                        end: 'top 20%',
                        scrub: 1
                    }
                }
            );

            // Individual photo hover animations
            photosRef.current.forEach((photo, index) => {
                if (!photo) return;
                // Parallax effect based on position
                const row = Math.floor(index / 3);
                const offsetY = (row - 1) * 50; // Middle row = 0, others offset

                gsap.to(photo, {
                    y: offsetY,
                    scrollTrigger: {
                        trigger: gridRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 1
                    }
                });

                // Mouse hover 3D tilt
                const onMouseEnter = () => {
                    gsap.to(photo, {
                        scale: 1.05,
                        zIndex: 10,
                        boxShadow: '0 30px 80px rgba(56, 189, 248, 0.4)',
                        duration: 0.4,
                        ease: 'power2.out'
                    });
                };

                const onMouseLeave = () => {
                    gsap.to(photo, {
                        scale: 1,
                        zIndex: 1,
                        boxShadow: 'none', // or default
                        duration: 0.5,
                        ease: 'power2.out',
                        rotateY: 0,
                        rotateX: 0
                    });
                };

                const onMouseMove = (e) => {
                    const rect = photo.getBoundingClientRect();
                    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 20;
                    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -20;

                    gsap.to(photo, {
                        rotateY: x,
                        rotateX: y,
                        duration: 0.3,
                        ease: 'power2.out'
                    });
                };

                photo.addEventListener('mouseenter', onMouseEnter);
                photo.addEventListener('mouseleave', onMouseLeave);
                photo.addEventListener('mousemove', onMouseMove);
            });
        }, gridRef);

        return () => ctx.revert();
    }, []);

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '100px 5%',
            background: '#000000',
            overflow: 'hidden'
        }}>
            <div
                ref={gridRef}
                style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px',
                    width: '100%',
                    maxWidth: '1200px'
                }}
            >
                {photos.map((_, index) => (
                    <div
                        key={index}
                        ref={el => photosRef.current[index] = el}
                        style={{
                            aspectRatio: '1/1',
                            borderRadius: '15px',
                            overflow: 'hidden',
                            cursor: 'pointer',
                            transformStyle: 'preserve-3d',
                            perspective: '1000px',
                            background: '#222'
                        }}
                    >
                        {/* Photo Content */}
                        <img
                            src={`${import.meta.env.BASE_URL}images/responsive_mockup.webp`}
                            alt={`Workspace ${index + 1}`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                filter: 'grayscale(40%) contrast(1.1)'
                            }}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PhotoGrid;
