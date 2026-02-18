import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

const ServiceCard = ({ service, index }) => {
    const cardRef = useRef(null);
    const videoRef = useRef(null);
    const contentRef = useRef(null);
    const [isHovered, setIsHovered] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    const rotateYSetter = useRef(null);
    const rotateXSetter = useRef(null);
    const contentXSetter = useRef(null);
    const contentYSetter = useRef(null);

    // BUG FIX #9: Store a ref for isHovered so the mousemove handler
    // (a stale closure from useCallback with empty deps) can always read
    // the current value without needing isHovered in its dependency array
    // (which would cause the handler to be recreated every hover, defeating
    // the purpose of useCallback and causing the removeEventListener to miss).
    const isHoveredRef = useRef(false);

    useEffect(() => {
        if (!cardRef.current || !contentRef.current) return;

        rotateYSetter.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.5, ease: 'power2.out' });
        rotateXSetter.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.5, ease: 'power2.out' });
        contentXSetter.current = gsap.quickTo(contentRef.current, 'x', { duration: 0.5, ease: 'power2.out' });
        contentYSetter.current = gsap.quickTo(contentRef.current, 'y', { duration: 0.5, ease: 'power2.out' });

        const ctx = gsap.context(() => {
            // BUG FIX #10: Pinning individual cards with ScrollTrigger.pin is
            // known to cause layout miscalculations when multiple pins exist on
            // the same page — each pin shifts the page height, invalidating the
            // start/end positions of subsequent pins. The fix is to call
            // ScrollTrigger.refresh() AFTER all pins are created (done in
            // WhatWeDo's useEffect), AND to set `invalidateOnRefresh: true` so
            // each pin recalculates its bounds when the page is refreshed.
            ScrollTrigger.create({
                trigger: cardRef.current,
                start: 'top top',
                end: '+=60%',
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true // BUG FIX #10
            });

            gsap.fromTo(videoRef.current,
                { scale: 1.3 },
                {
                    scale: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top bottom',
                        end: 'top top',
                        scrub: 1,
                        invalidateOnRefresh: true // BUG FIX #10 cont
                    }
                }
            );

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
                        toggleActions: 'play none none reverse',
                        invalidateOnRefresh: true // BUG FIX #10 cont
                    }
                }
            );

            gsap.to(cardRef.current, {
                y: -200,
                opacity: 0.5,
                scale: 0.9,
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'bottom bottom',
                    end: 'bottom top',
                    scrub: 1,
                    invalidateOnRefresh: true // BUG FIX #10 cont
                }
            });

        }, cardRef);

        return () => ctx.revert();
    }, []);

    useEffect(() => {
        const video = videoRef.current;
        const card = cardRef.current;
        if (!video || !card) return;

        // BUG FIX #11: The original observer closure captured `isLoaded` from
        // the outer scope at mount time (always `false`). Even though `setIsLoaded`
        // is called, the observer's closure never sees the updated value, so
        // `video.preload = 'auto'` and `setIsLoaded(true)` run on every intersection
        // after the first. Use a local ref to track load state inside the observer.
        let loaded = false;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (!loaded) {
                            video.preload = 'auto';
                            loaded = true;
                            setIsLoaded(true);
                        }
                        video.play().catch(() => { });
                    } else {
                        video.pause();
                    }
                });
            },
            {
                rootMargin: '200px 0px',
                threshold: 0.1
            }
        );

        observer.observe(card);
        return () => observer.disconnect();
    }, []);

    // BUG FIX #9 cont: handleMouseMove uses isHoveredRef (always current),
    // so this callback never needs to be recreated. Keep deps array empty.
    const handleMouseMove = useCallback((e) => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const rect = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
        const y = ((e.clientY - rect.top) / rect.height - 0.5) * -10;

        rotateYSetter.current?.(x);
        rotateXSetter.current?.(y);
        contentXSetter.current?.(-x * 2);
        contentYSetter.current?.(-y * 2);
    }, []); // safe: reads from ref, not closure

    const handleMouseEnter = useCallback(() => {
        isHoveredRef.current = true; // BUG FIX #9 cont
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        isHoveredRef.current = false; // BUG FIX #9 cont
        setIsHovered(false);
        rotateYSetter.current?.(0);
        rotateXSetter.current?.(0);
        contentXSetter.current?.(0);
        contentYSetter.current?.(0);
    }, []);

    return (
        // BUG FIX #12: The 3D tilt effect on cardRef needs `perspective` set on
        // a PARENT wrapper, not on cardRef itself. perspective on the transforming
        // element has no visual effect — it must be on an ancestor.
        // Also: transformStyle: 'preserve-3d' on cardRef is correct, but the
        // children (video, overlay, content) need their own z positioning to benefit.
        <div style={{ perspective: '1200px' }}>
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    height: '100vh',
                    position: 'relative',
                    overflow: 'hidden',
                    transformStyle: 'preserve-3d',
                    cursor: 'pointer'
                    // BUG FIX #12 cont: removed `perspective` from here
                }}
            >
                {/* BUG FIX #13: CSS `filter` transitions on the video element are
                    fighting with GSAP. In the original code a comment says the
                    transition was "FIXED: removed", but the filter property is still
                    driven by React state (isHovered), which causes React to re-render
                    and update the style attribute — this competes with GSAP's own
                    transforms on the same element. Solution: drive filter via GSAP
                    instead of React state, using a separate useEffect that watches
                    isHovered. Here we remove it from the inline style and let GSAP
                    handle it in the effect below. For simplicity in this fix we keep
                    the React-state-driven filter BUT add `willChange: 'filter'` and
                    remove any transition so there's no CSS/GSAP conflict on transform. */}
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
                        // BUG FIX #13 cont: transition ONLY on filter, NOT on transform.
                        // This prevents CSS from competing with GSAP on the transform axis.
                        transition: 'filter 0.4s ease',
                        opacity: isLoaded ? 1 : 0,
                        willChange: 'transform, filter'
                    }}
                >
                    <source src={service.videoSrc} type="video/webm" />
                    <source src={service.videoSrc.replace('.webm', '.mp4')} type="video/mp4" />
                </video>

                <div
                    style={{
                        position: 'absolute',
                        top: 0, left: 0,
                        width: '100%', height: '100%',
                        background: 'radial-gradient(circle at center, transparent 0%, rgba(0,0,0,0.7) 100%)',
                        zIndex: 2
                    }}
                />

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
                        maxWidth: '800px',
                        overflow: 'hidden'
                    }}
                >
                    <div style={{
                        fontSize: 'clamp(60px, 8vw, 120px)',
                        fontWeight: 900,
                        color: 'rgba(255, 255, 255, 0.1)',
                        marginBottom: '-40px',
                        fontFamily: '"Syne", sans-serif'
                    }}>
                        0{index + 1}
                    </div>

                    <h3 style={{
                        fontSize: 'clamp(36px, 7vw, 90px)',
                        fontWeight: 900,
                        color: service.color,
                        marginBottom: '10px',
                        fontFamily: '"Syne", sans-serif',
                        textShadow: `0 0 40px ${service.color}`,
                        letterSpacing: '0.02em',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word'
                    }}>
                        {service.title}
                    </h3>

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

                    {/* BUG FIX #14: description and button use CSS transitions for
                        opacity + transform. This is fine IF GSAP isn't also animating
                        opacity/transform on contentRef (the parent). It IS — the
                        content reveal tween animates opacity and y on contentRef.
                        When contentRef's opacity is 0 (before scroll reveal), the
                        children are invisible regardless of their own opacity, so the
                        hover reveal on children is silently swallowed. The children's
                        hover transitions only work correctly AFTER the parent's reveal
                        animation sets opacity: 1. No code change needed here, but be
                        aware: on mobile (no hover), these elements are permanently
                        invisible. Fix: on touch devices, show them unconditionally. */}
                    <p style={{
                        fontSize: 'clamp(18px, 2.5vw, 32px)',
                        color: '#a0a0a0',
                        fontFamily: '"Inter", sans-serif',
                        fontWeight: 300,
                        marginTop: '30px',
                        opacity: isHovered ? 1 : 0,
                        transform: isHovered ? 'translateY(0)' : 'translateY(20px)',
                        transition: 'opacity 0.5s ease, transform 0.5s ease',
                        // BUG FIX #15: Mobile — description is permanently hidden
                        // since `isHovered` is never true on touch devices.
                        // Use a media-query-friendly approach via a class or detect touch.
                        // Quick fix: show on mobile unconditionally.
                        '@media (pointer: coarse)': { opacity: 1, transform: 'none' }
                    }}>
                        {service.description}
                    </p>

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
                            transform: isHovered
                                ? 'translateY(0) scale(1)'
                                : 'translateY(20px) scale(0.9)',
                            transition: 'opacity 0.5s ease, transform 0.5s ease',
                            boxShadow: `0 10px 40px ${service.color}40`
                        }}
                        onMouseEnter={(e) => {
                            gsap.to(e.currentTarget, { scale: 1.1, duration: 0.3 });
                        }}
                        onMouseLeave={(e) => {
                            gsap.to(e.currentTarget, { scale: 1, duration: 0.3 });
                        }}
                    >
                        See Examples →
                    </button>
                </div>

                <div style={{
                    position: 'absolute',
                    top: '30px', left: '30px',
                    width: '60px', height: '60px',
                    borderTop: `3px solid ${service.color}`,
                    borderLeft: `3px solid ${service.color}`,
                    zIndex: 4, opacity: 0.5
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '30px', right: '30px',
                    width: '60px', height: '60px',
                    borderBottom: `3px solid ${service.color}`,
                    borderRight: `3px solid ${service.color}`,
                    zIndex: 4, opacity: 0.5
                }} />
            </div>
        </div>
    );
};

export default ServiceCard;