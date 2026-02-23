import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../../gsap-config';
import SplitType from 'split-type';

const isTouch = () =>
    typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

const ServiceCard = ({ service, index, total }) => {
    const wrapRef      = useRef(null);
    const cardRef      = useRef(null);
    const videoRef     = useRef(null);
    const bgLayerRef   = useRef(null);
    const midLayerRef  = useRef(null);
    const contentRef   = useRef(null);
    const numberRef    = useRef(null);
    const titleRef     = useRef(null);
    const subtitleRef  = useRef(null);
    const descRef      = useRef(null);
    const ctaRef       = useRef(null);
    const ruleRef      = useRef(null);
    const progressRef  = useRef(null);
    const tiltWrapRef  = useRef(null);

    const [isLoaded, setIsLoaded]   = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const isHoveredRef  = useRef(false);
    const touchDevice   = useRef(isTouch());
    const splitTitle    = useRef(null);
    const splitSub      = useRef(null);

    // quickTo setters — initialised once card mounts
    const rotYSet = useRef(null);
    const rotXSet = useRef(null);
    const cxSet   = useRef(null);
    const cySet   = useRef(null);

    // ── GSAP quickTo tilt setters ──────────────────────────────────────────
    useEffect(() => {
        if (!cardRef.current || !tiltWrapRef.current) return;
        rotYSet.current = gsap.quickTo(cardRef.current,    'rotateY', { duration: 0.55, ease: 'power2.out' });
        rotXSet.current = gsap.quickTo(cardRef.current,    'rotateX', { duration: 0.55, ease: 'power2.out' });
        // BUG FIX (original FIX #4): target tiltWrapRef for x/y so GSAP does not
        // overwrite the translate(-50%,-50%) that centres contentRef.
        cxSet.current   = gsap.quickTo(tiltWrapRef.current, 'x', { duration: 0.55, ease: 'power2.out' });
        cySet.current   = gsap.quickTo(tiltWrapRef.current, 'y', { duration: 0.55, ease: 'power2.out' });
    }, []);

    // ── ScrollTrigger animations ───────────────────────────────────────────
    useEffect(() => {
        if (!cardRef.current) return;

        const mm = gsap.matchMedia(wrapRef);

        mm.add(
            {
                isDesktop: '(min-width: 1024px)',
                isTablet:  '(min-width: 768px) and (max-width: 1023px)',
                isMobile:  '(max-width: 767px)',
            },
            (context) => {
                const { isDesktop, isTablet, isMobile } = context.conditions;

                if (
                    !cardRef.current    ||
                    !progressRef.current ||
                    !bgLayerRef.current  ||
                    !midLayerRef.current
                ) return;

                // ── Responsive values ──────────────────────────────────────
                const pinSection   = isDesktop || isTablet;
                const pinEnd       = pinSection ? '+=60%' : 'bottom top';
                // On mobile cards are not pinned so the progress bar maps to
                // the natural card scroll distance instead.
                const progressEnd  = isMobile ? 'bottom 20%' : pinEnd;

                const numberFromX  = isMobile ? -60  : -100;
                const numberStart  = isMobile ? 'top 95%' : 'top 90%';
                const numberEnd    = isMobile ? 'top 55%' : 'top 25%';
                const ruleStart    = isMobile ? 'top 88%' : 'top 78%';
                const ruleEnd      = isMobile ? 'top 55%' : 'top 22%';
                const subStart     = isMobile ? 'top 85%' : 'top 70%';
                const titleStart   = isMobile ? 'top 82%' : 'top 68%';
                const titleEnd     = isMobile ? 'bottom 60%' : 'top 10%';
                const descStart    = isMobile ? 'top 78%' : 'top 62%';
                const ctaStart     = isMobile ? 'top 74%' : 'top 58%';

                // 1 ── PIN (scroll-stack) ───────────────────────────────────
                if (pinSection) {
                    ScrollTrigger.create({
                        trigger: cardRef.current,
                        start: 'top top',
                        end: '+=60%',
                        pin: true,
                        pinSpacing: true,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    });
                }

                // 2 ── SCRUB PROGRESS BAR ───────────────────────────────────
                gsap.set(progressRef.current, { scaleX: 0 });
                gsap.to(progressRef.current, {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top top',
                        end: progressEnd,
                        scrub: 0,
                        invalidateOnRefresh: true,
                    },
                });

                // 3 ── DEEP BG PARALLAX ─────────────────────────────────────
                gsap.fromTo(
                    bgLayerRef.current,
                    { yPercent: isMobile ? 6 : 10 },
                    {
                        yPercent: isMobile ? -6 : -10,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: cardRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 2,
                            invalidateOnRefresh: true,
                        },
                    }
                );

                // 4 ── MID LAYER PARALLAX ───────────────────────────────────
                gsap.fromTo(
                    midLayerRef.current,
                    { yPercent: isMobile ? 9 : 16, opacity: 0 },
                    {
                        yPercent: isMobile ? -9 : -16,
                        opacity: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: cardRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 2.5,
                            invalidateOnRefresh: true,
                        },
                    }
                );

                // 5 ── VIDEO ZOOM-IN on approach ────────────────────────────
                gsap.fromTo(
                    videoRef.current,
                    { scale: isMobile ? 1.18 : 1.32 },
                    {
                        scale: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: cardRef.current,
                            start: 'top bottom',
                            end: 'top top',
                            scrub: 1.2,
                            invalidateOnRefresh: true,
                        },
                    }
                );

                // 6 ── GHOST NUMBER — scrub slide from left ─────────────────
                gsap.fromTo(
                    numberRef.current,
                    { x: numberFromX, opacity: 1 },
                    {
                        x: 0,
                        opacity: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: cardRef.current,
                            start: numberStart,
                            end: numberEnd,
                            scrub: 1.2,
                            invalidateOnRefresh: true,
                        },
                    }
                );

                // 7 ── RULE DRAW (scrub) ────────────────────────────────────
                gsap.fromTo(
                    ruleRef.current,
                    { scaleX: 0 },
                    {
                        scaleX: 1,
                        ease: 'none',
                        transformOrigin: 'left center',
                        scrollTrigger: {
                            trigger: cardRef.current,
                            start: ruleStart,
                            end: ruleEnd,
                            scrub: 1,
                            invalidateOnRefresh: true,
                        },
                    }
                );

                // 8 ── SPLITTYPE: subtitle chars stagger in ─────────────────
                if (subtitleRef.current) {
                    splitSub.current?.revert();
                    splitSub.current = new SplitType(subtitleRef.current, { types: 'chars' });
                    if (splitSub.current.chars && splitSub.current.chars.length > 0) {
                        // BUG FIX (original FIX #1): original comment said opacity was
                        // wrong but the actual .from() still risks a flash; use gsap.set()
                        // + gsap.to() pattern to guarantee hidden state before trigger.
                        gsap.set(splitSub.current.chars, { opacity: 0, y: isMobile ? 12 : 18 });
                        gsap.to(splitSub.current.chars, {
                            opacity: 1,
                            y: 0,
                            stagger: 0.02,
                            duration: isMobile ? 0.4 : 0.5,
                            ease: 'power2.out',
                            scrollTrigger: {
                                trigger: cardRef.current,
                                start: subStart,
                                toggleActions: 'play none none reverse',
                                invalidateOnRefresh: true,
                            },
                        });
                    }
                }

                // 9 ── SPLITTYPE: title chars scrub-clip reveal ─────────────
                if (titleRef.current) {
                    splitTitle.current?.revert();
                    splitTitle.current = new SplitType(titleRef.current, { types: 'chars' });
                    if (splitTitle.current.chars && splitTitle.current.chars.length > 0) {
                        splitTitle.current.chars.forEach((char) => {
                            char.style.display       = 'inline-block';
                            char.style.overflow      = 'hidden';
                            char.style.verticalAlign = 'bottom';
                        });
                        // BUG FIX: same flash-prevention pattern as above.
                        gsap.set(splitTitle.current.chars, { y: '110%', opacity: 0 });
                        gsap.to(splitTitle.current.chars, {
                            y: '0%',
                            opacity: 1,
                            stagger: isMobile ? 0.01 : 0.014,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: cardRef.current,
                                start: titleStart,
                                end: titleEnd,
                                scrub: 0.9,
                                invalidateOnRefresh: true,
                            },
                        });
                    }
                }

                // 10 ── DESCRIPTION fade up (toggle) ────────────────────────
                gsap.set(descRef.current, { opacity: 0, y: isMobile ? 18 : 28 });
                gsap.to(descRef.current, {
                    opacity: 1,
                    y: 0,
                    duration: isMobile ? 0.65 : 0.85,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: descStart,
                        toggleActions: 'play none none reverse',
                        invalidateOnRefresh: true,
                    },
                });

                // 11 ── CTA slide up (toggle) ───────────────────────────────
                if (ctaRef.current) {
                    gsap.set(ctaRef.current, { opacity: 0, y: isMobile ? 16 : 24 });
                    gsap.to(ctaRef.current, {
                        opacity: 1,
                        y: 0,
                        duration: isMobile ? 0.65 : 0.8,
                        ease: 'power3.out',
                        delay: 0.1,
                        scrollTrigger: {
                            trigger: cardRef.current,
                            start: ctaStart,
                            toggleActions: 'play none none reverse',
                            invalidateOnRefresh: true,
                        },
                    });
                }

                // 12 ── EXIT: scale shrink & push up ───────────────────────
                // BUG FIX: On mobile the card is not pinned, so animating
                // cardRef itself during 'bottom bottom → bottom top' causes
                // the card to visually shift unexpectedly as the user scrolls.
                // Skip the exit animation on mobile to avoid the glitch.
                if (pinSection) {
                    gsap.to(cardRef.current, {
                        y: -60,
                        scale: 0.93,
                        opacity: 0.6,
                        scrollTrigger: {
                            trigger: cardRef.current,
                            start: 'bottom bottom',
                            end: 'bottom top',
                            scrub: 1,
                            invalidateOnRefresh: true,
                        },
                    });
                }

                // Cleanup SplitType on breakpoint change
                return () => {
                    splitTitle.current?.revert();
                    splitSub.current?.revert();
                };
            }
        );

        return () => mm.revert();
    }, []);

    // ── Lazy video load + play/pause ──────────────────────────────────────
    useEffect(() => {
        const video = videoRef.current;
        const card  = cardRef.current;
        if (!video || !card) return;
        let loaded = false;
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((e) => {
                    if (e.isIntersecting) {
                        if (!loaded) {
                            video.preload = 'auto';
                            loaded = true;
                            setIsLoaded(true);
                        }
                        video.play().catch(() => {});
                    } else {
                        video.pause();
                    }
                });
            },
            { rootMargin: '200px', threshold: 0.1 }
        );
        obs.observe(card);
        return () => obs.disconnect();
    }, []);

    // ── Mouse tilt ────────────────────────────────────────────────────────
    const handleMouseMove = useCallback((e) => {
        // BUG FIX (original FIX #3): guard against quickTo setters not yet initialised.
        if (!isHoveredRef.current || !cardRef.current || touchDevice.current) return;
        if (!rotYSet.current || !rotXSet.current || !cxSet.current || !cySet.current) return;
        const r = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - r.left)  / r.width  - 0.5) * 9;
        const y = ((e.clientY - r.top)   / r.height - 0.5) * -9;
        rotYSet.current(x);
        rotXSet.current(y);
        cxSet.current(-x * 1.8);
        cySet.current(-y * 1.8);
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (touchDevice.current) return;
        isHoveredRef.current = true;
        setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (touchDevice.current) return;
        isHoveredRef.current = false;
        setIsHovered(false);
        rotYSet.current?.(0);
        rotXSet.current?.(0);
        cxSet.current?.(0);
        cySet.current?.(0);
    }, []);

    // BUG FIX (original FIX #5): the original videoMp4Src IIFE had a
    // duplicated .endsWith('.webm') branch — the "mp4" path was unreachable
    // because the first branch already caught .webm and returned a .webm URL.
    // Since only .webm is used as a source here the fallback is not needed,
    // so the IIFE has been removed entirely to avoid confusion.
    const accent = service.color || '#38bdf8';
    const touch  = touchDevice.current;

    return (
        <div ref={wrapRef} style={{ perspective: '1200px' }}>
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
                    background: '#000',
                }}
            >
                {/* SCRUB PROGRESS BAR */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0,
                    height: 2, zIndex: 10, overflow: 'hidden',
                    background: 'rgba(255,255,255,0.06)',
                }}>
                    <div ref={progressRef} style={{
                        width: '100%', height: '100%',
                        background: `linear-gradient(to right, ${accent}, #00d4ff)`,
                        transformOrigin: 'left center',
                        transform: 'scaleX(0)',
                        boxShadow: `0 0 8px ${accent}`,
                    }} />
                </div>

                {/* Card counter top-right */}
                <div style={{
                    position: 'absolute', top: 20, right: 36, zIndex: 9,
                    fontFamily: 'DM Sans, sans-serif',
                    fontSize: 10, letterSpacing: '0.22em',
                    color: 'rgba(255,255,255,0.22)', textTransform: 'uppercase',
                }}>
                    {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
                </div>

                {/* LAYER 1: Deep BG (slowest parallax) */}
                <div ref={bgLayerRef} style={{
                    position: 'absolute', inset: '-12% 0',
                    zIndex: 1, willChange: 'transform',
                }}>
                    <video
                        ref={videoRef}
                        loop muted playsInline preload="none"
                        style={{
                            width: '100%', height: '100%', objectFit: 'cover',
                            filter: (isHovered || touch)
                                ? 'brightness(1) saturate(1.15)'
                                : 'brightness(1) saturate(1)',
                            transition: 'filter 0.55s ease',
                            opacity: isLoaded ? 1 : 0,
                            willChange: 'filter',
                        }}
                    >
                        <source src={service.videoSrc} type="video/webm" />
                    </video>
                </div>

                {/* LAYER 2: Mid parallax — decorative grid */}
                <div ref={midLayerRef} style={{
                    position: 'absolute', inset: 0, zIndex: 2,
                    backgroundImage: `
                        linear-gradient(${accent}09 1px, transparent 1px),
                        linear-gradient(90deg, ${accent}09 1px, transparent 1px)
                    `,
                    backgroundSize: '72px 72px',
                    willChange: 'transform', pointerEvents: 'none',
                }} />

                {/* LAYER 3: Radial vignette */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
                    background: 'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 20%, rgba(0,0,0,0.9) 100%)',
                }} />

                {/* LAYER 4: Accent border glow */}
                <div style={{
                    position: 'absolute', inset: 0, zIndex: 4, pointerEvents: 'none',
                    transition: 'box-shadow 0.55s ease',
                    boxShadow: (isHovered || touch)
                        ? `inset 0 0 0 1px ${accent}55, inset 0 0 100px ${accent}16`
                        : `inset 0 0 0 1px ${accent}18`,
                }} />

                {/* BUG FIX (original FIX #2): Corner brackets use explicit positioning */}
                {/* Top-left bracket */}
                <div style={{
                    position: 'absolute', top: 28, left: 28,
                    width: 40, height: 40, zIndex: 5,
                    borderTop: `1px solid ${accent}`,
                    borderLeft: `1px solid ${accent}`,
                }} />
                {/* Bottom-right bracket */}
                <div style={{
                    position: 'absolute', bottom: 28, right: 28,
                    width: 40, height: 40, zIndex: 5,
                    borderBottom: `1px solid ${accent}`,
                    borderRight: `1px solid ${accent}`,
                }} />

                {/* Ghost number (bottom-left, scrub slide) */}
                <div ref={numberRef} style={{
                    position: 'absolute', bottom: 28, left: 40,
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(60px, 14vw, 180px)',
                    fontWeight: 800, lineHeight: 1,
                    letterSpacing: '-0.06em',
                    color: 'transparent',
                    WebkitTextStroke: `3px ${accent}3a`,
                    zIndex: 5, userSelect: 'none', pointerEvents: 'none',
                }}>
                    {String(index + 1).padStart(2, '0')}
                </div>

                {/* FOREGROUND CONTENT
                    BUG FIX (original FIX #4): Two-layer approach keeps GSAP x/y tilt
                    separate from the translate(-50%,-50%) centering transform. */}
                <div
                    ref={contentRef}
                    style={{
                        position: 'absolute', top: '50%', left: '50%',
                        transform: 'translate(-50%, -50%)',
                        zIndex: 6,
                    }}
                >
                    <div
                        ref={tiltWrapRef}
                        style={{
                            textAlign: 'center',
                            width: '90vw', maxWidth: 820,
                            padding: '0 clamp(16px, 4vw, 0px)',
                        }}
                    >
                        {/* Subtitle (SplitType chars) */}
                        <p ref={subtitleRef} style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 'clamp(9px, 1.2vw, 11px)',
                            fontWeight: 500,
                            letterSpacing: '0.28em', textTransform: 'uppercase',
                            color: accent, marginBottom: 'clamp(12px, 2vw, 20px)',
                        }}>
                            {service.subtitle}
                        </p>

                        {/* Scrub rule */}
                        <div ref={ruleRef} style={{
                            width: '100%', height: 1,
                            background: `linear-gradient(to right, transparent, ${accent}55, transparent)`,
                            marginBottom: 'clamp(10px, 1.5vw, 15px)',
                        }} />

                        {/* Title (SplitType chars scrub reveal) */}
                        <h3 ref={titleRef} style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: 'clamp(36px, 7.5vw, 108px)',
                            fontWeight: 800, lineHeight: 0.9,
                            letterSpacing: '-0.03em', textTransform: 'uppercase',
                            color: '#ffffff',
                            textShadow: (isHovered || touch) ? `0 0 80px ${accent}55` : 'none',
                            transition: 'text-shadow 0.5s ease',
                            marginBottom: 'clamp(16px, 3vw, 28px)',
                            wordBreak: 'break-word',
                        }}>
                            {service.title}
                        </h3>

                        {/* Description */}
                        <p ref={descRef} style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 'clamp(13px, 1.6vw, 18px)',
                            color: 'rgba(255,255,255,0.52)',
                            lineHeight: 1.75, maxWidth: 500,
                            margin: '0 auto clamp(20px, 3vw, 36px)',
                        }}>
                            {service.description}
                        </p>

                        {/* CTA (commented out in original — preserved) */}
                        {/* <div ref={ctaRef}>...</div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;