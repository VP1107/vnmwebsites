import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { throttle } from '../utils/throttle';
import './WhatWeDo.css';

const ROTATION_INCREMENT = 30; // Degrees per key press

const WhatWeDo = () => {
    const carouselRef = useRef(null);
    const sectionRef = useRef(null);
    const isDragging = useRef(false);
    const startX = useRef(0);
    const currentRotation = useRef(0);

    const services = [
        { id: 1, title: 'BRANDS', description: 'Logo animations, brand identity' },
        { id: 2, title: 'BUSINESS', description: 'Restaurant websites, e-commerce' },
        { id: 3, title: 'PORTFOLIOS', description: 'Creative portfolio layouts' },
    ];

    // Scroll-controlled rotation can be re-enabled if we bind to locomotive-scroll instance events.
    // For now, we rely on Drag and Keyboard for interaction to avoid conflict with virtual scroll.
    useEffect(() => {
        // Optional: future integration with scroll instance
    }, []);

    // Mouse drag handlers
    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.clientX;
    };

    const handleMouseMove = throttle((e) => {
        if (!isDragging.current) return;

        const deltaX = e.clientX - startX.current;
        const deltaRotation = deltaX * 0.5;
        const newRotation = currentRotation.current + deltaRotation;

        gsap.to(carouselRef.current, {
            rotateY: newRotation,
            duration: 0,
            ease: 'none',
        });
    }, 50);

    const handleMouseUp = (e) => {
        if (isDragging.current) {
            const deltaX = e.clientX - startX.current;
            const deltaRotation = deltaX * 0.5;
            currentRotation.current += deltaRotation;
        }
        isDragging.current = false;
    };

    // Keyboard navigation
    const handleKeyDown = (e) => {
        let newRotation = currentRotation.current;
        if (e.key === 'ArrowLeft') {
            newRotation -= ROTATION_INCREMENT;
        } else if (e.key === 'ArrowRight') {
            newRotation += ROTATION_INCREMENT;
        } else {
            return;
        }
        e.preventDefault(); // Prevent page scroll

        currentRotation.current = newRotation;
        gsap.to(carouselRef.current, {
            rotateY: newRotation,
            duration: 0.4,
            ease: 'power2.out',
        });
    };

    // Card hover effect
    const handleCardHover = (e) => {
        gsap.to(e.currentTarget, {
            scale: 1.15,
            rotateX: -10,
            rotateY: 10,
            boxShadow: '0 40px 100px rgba(0, 255, 136, 0.4)',
            duration: 0.4,
            ease: 'elastic.out(1, 0.5)',
        });
    };

    const handleCardLeave = (e) => {
        gsap.to(e.currentTarget, {
            scale: 1,
            rotateX: 0,
            rotateY: 0,
            boxShadow: '0 20px 60px rgba(0, 255, 136, 0.2)',
            duration: 0.4,
            ease: 'power2.out',
        });
    };

    return (
        <section
            className="what-we-do-container"
            ref={sectionRef}
            data-scroll-section
        >
            <div
                className="what-we-do-sticky"
                data-scroll
                data-scroll-sticky
                data-scroll-target="#what-we-do-target"
                style={{
                    height: '100vh',
                    overflow: 'hidden',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    perspective: '1000px'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                onKeyDown={handleKeyDown}
                tabIndex="0"
                role="region"
                aria-roledescription="carousel"
                aria-label="What We Do services carousel"
            >
                <h2 className="section-title gradient-text" data-scroll data-scroll-speed="1">WHAT WE DO</h2>

                <div className="carousel-container">
                    <div ref={carouselRef} className="carousel-3d">
                        {services.map((service, index) => {
                            const angle = (index / services.length) * 360;
                            const translateZ = 300;

                            return (
                                <div
                                    key={service.id}
                                    className="service-card"
                                    style={{
                                        transform: `rotateY(${angle}deg) translateZ(${translateZ}px)`,
                                    }}
                                    onMouseEnter={handleCardHover}
                                    onMouseLeave={handleCardLeave}
                                    role="group"
                                    aria-label={`${service.title} service card`}
                                >
                                    <div className="card-content">
                                        <h3 className="card-title">{service.title}</h3>
                                        <p className="card-description">{service.description}</p>

                                        {/* Video placeholder - visible for user clarity */}
                                        <div className="card-video-placeholder" style={{ position: 'relative' }}>
                                            <div className="placeholder-gradient"></div>
                                            <div style={{
                                                position: 'absolute',
                                                top: 0, left: 0, width: '100%', height: '100%',
                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                border: '1px dashed #0f0',
                                                background: 'rgba(0,0,0,0.5)',
                                                color: '#0f0',
                                                fontSize: '10px',
                                                textAlign: 'center',
                                                pointerEvents: 'none'
                                            }}>
                                                [SERVICE DEMO VIDEO]
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <p className="scroll-hint">DRAG TO ROTATE • SCROLL TO EXPLORE</p>
            </div>

            {/* Invisible target for the sticky element to leverage */}
            <div id="what-we-do-target" style={{ height: '300vh', position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none' }}></div>
        </section>
    );
};

export default WhatWeDo;
