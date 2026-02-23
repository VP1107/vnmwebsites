import { useRef, useEffect, useState, useCallback } from 'react';
import { gsap, ScrollTrigger } from '../../gsap-config';
import SplitType from 'split-type';


const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches;

const ServiceCard = ({ service, index, total }) => {
    const wrapRef = useRef(null);
    const cardRef = useRef(null);
    const videoRef = useRef(null);
    const bgLayerRef = useRef(null);
    const midLayerRef = useRef(null);
    const contentRef = useRef(null);
    const numberRef = useRef(null);
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    const descRef = useRef(null);
    const ctaRef = useRef(null);
    const ruleRef = useRef(null);
    const progressRef = useRef(null);

    const [isLoaded, setIsLoaded] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const isHoveredRef = useRef(false);
    const touchDevice = useRef(isTouch());
    const splitTitle = useRef(null);
    const splitSub = useRef(null);

    const rotYSet = useRef(null);
    const rotXSet = useRef(null);
    // FIX #4: Use separate refs for the tilt offset so we don't fight
    // the translate(-50%,-50%) on contentRef. We'll manage a wrapper instead.
    const tiltWrapRef = useRef(null);
    const cxSet = useRef(null);
    const cySet = useRef(null);

    useEffect(() => {
        if (!cardRef.current) return;

        rotYSet.current = gsap.quickTo(cardRef.current, 'rotateY', { duration: 0.55, ease: 'power2.out' });
        rotXSet.current = gsap.quickTo(cardRef.current, 'rotateX', { duration: 0.55, ease: 'power2.out' });
        // FIX #4: Target the inner tiltWrapRef with x/y so GSAP doesn't
        // overwrite the translate(-50%,-50%) on the outer contentRef.
        cxSet.current = gsap.quickTo(tiltWrapRef.current, 'x', { duration: 0.55, ease: 'power2.out' });
        cySet.current = gsap.quickTo(tiltWrapRef.current, 'y', { duration: 0.55, ease: 'power2.out' });

        const mm = gsap.matchMedia(wrapRef);

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            const { isDesktop } = context.conditions;
            if (!cardRef.current || !progressRef.current || !bgLayerRef.current || !midLayerRef.current) return;

            /* 1 ── PIN (scroll-stack) */
            if (isDesktop) {
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

            /* 2 ── SCRUB PROGRESS BAR */
            gsap.to(progressRef.current, {
                scaleX: 1, ease: 'none',
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'top top',
                    end: isDesktop ? '+=60%' : 'bottom top',
                    scrub: 0, invalidateOnRefresh: true,
                }
            });

            /* 3 ── DEEP BG PARALLAX (video wrapper moves slowest) */
            gsap.fromTo(bgLayerRef.current,
                { yPercent: 10 },
                {
                    yPercent: -10, ease: 'none',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top bottom', end: 'bottom top',
                        scrub: 2, invalidateOnRefresh: true,
                    }
                }
            );

            /* 4 ── MID LAYER PARALLAX (grid plane, medium speed) */
            gsap.fromTo(midLayerRef.current,
                { yPercent: 16, opacity: 0 },
                {
                    yPercent: -16, opacity: 1, ease: 'none',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top bottom', end: 'bottom top',
                        scrub: 2.5, invalidateOnRefresh: true,
                    }
                }
            );

            /* 5 ── VIDEO ZOOM-IN on approach */
            gsap.fromTo(videoRef.current,
                { scale: 1.32 },
                {
                    scale: 1, ease: 'none',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top bottom', end: 'top top',
                        scrub: 1.2, invalidateOnRefresh: true,
                    }
                }
            );

            /* 6 ── GHOST NUMBER — scrub slide from left */
            gsap.fromTo(numberRef.current,
                { x: -100, opacity: 1 },
                {
                    x: 0, opacity: 1, ease: 'none',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 90%', end: 'top 25%',
                        scrub: 1.2, invalidateOnRefresh: true,
                    }
                }
            );

            /* 7 ── RULE DRAW (scrub) */
            gsap.fromTo(ruleRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1, ease: 'none', transformOrigin: 'left center',
                    scrollTrigger: {
                        trigger: cardRef.current,
                        start: 'top 78%', end: 'top 22%',
                        scrub: 1, invalidateOnRefresh: true,
                    }
                }
            );

            /* 8 ── SPLITTYPE: subtitle chars stagger in */
            // FIX #1: Changed opacity from 1 to 0 so the fade-in actually works.
            if (subtitleRef.current) {
                splitSub.current = new SplitType(subtitleRef.current, { types: 'chars' });
                if (splitSub.current.chars && splitSub.current.chars.length > 0) {
                    gsap.from(splitSub.current.chars, {
                        opacity: 0, y: 18, stagger: 0.02, duration: 0.5, ease: 'power2.out',
                        scrollTrigger: {
                            trigger: cardRef.current, start: 'top 70%',
                            toggleActions: 'play none none reverse', invalidateOnRefresh: true,
                        }
                    });
                }
            }

            /* 9 ── SPLITTYPE: title chars scrub-clip reveal */
            if (titleRef.current) {
                splitTitle.current = new SplitType(titleRef.current, { types: 'chars' });
                if (splitTitle.current.chars && splitTitle.current.chars.length > 0) {
                    splitTitle.current.chars.forEach(char => {
                        char.style.display = 'inline-block';
                        char.style.overflow = 'hidden';
                        char.style.verticalAlign = 'bottom';
                    });
                    gsap.from(splitTitle.current.chars, {
                        y: '110%', opacity: 0, stagger: 0.014, ease: 'none',
                        scrollTrigger: {
                            trigger: cardRef.current,
                            start: 'top 68%', end: 'top 10%',
                            scrub: 0.9, invalidateOnRefresh: true,
                        }
                    });
                }
            }

            /* 10 ── DESCRIPTION fade up (toggle) */
            gsap.from(descRef.current, {
                opacity: 0, y: 28, duration: 0.85, ease: 'power3.out',
                scrollTrigger: {
                    trigger: cardRef.current, start: 'top 62%',
                    toggleActions: 'play none none reverse', invalidateOnRefresh: true,
                }
            });

            /* 11 ── CTA slide up (toggle) */
            if (ctaRef.current) {
                gsap.from(ctaRef.current, {
                    opacity: 0, y: 24, duration: 0.8, ease: 'power3.out', delay: 0.1,
                    scrollTrigger: {
                        trigger: cardRef.current, start: 'top 58%',
                        toggleActions: 'play none none reverse', invalidateOnRefresh: true,
                    }
                });
            }

            /* 12 ── EXIT: scale shrink & push up */
            gsap.to(cardRef.current, {
                y: -60, scale: 0.93, opacity: 0.6,
                scrollTrigger: {
                    trigger: cardRef.current,
                    start: 'bottom bottom', end: 'bottom top',
                    scrub: 1, invalidateOnRefresh: true,
                }
            });

        }); // end matchMedia

        return () => {
            mm.revert();
            splitTitle.current?.revert();
            splitSub.current?.revert();
        };
    }, []);

    /* ── Lazy video load + play/pause ── */
    useEffect(() => {
        const video = videoRef.current;
        const card = cardRef.current;
        if (!video || !card) return;
        let loaded = false;
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    if (!loaded) { video.preload = 'auto'; loaded = true; setIsLoaded(true); }
                    video.play().catch(() => { });
                } else { video.pause(); }
            });
        }, { rootMargin: '200px', threshold: 0.1 });
        obs.observe(card);
        return () => obs.disconnect();
    }, []);

    /* ── Mouse tilt ── */
    // FIX #3: Guard against quickTo setters not yet being initialised.
    const handleMouseMove = useCallback((e) => {
        if (!isHoveredRef.current || !cardRef.current || touchDevice.current) return;
        if (!rotYSet.current || !rotXSet.current || !cxSet.current || !cySet.current) return;
        const r = cardRef.current.getBoundingClientRect();
        const x = ((e.clientX - r.left) / r.width - 0.5) * 9;
        const y = ((e.clientY - r.top) / r.height - 0.5) * -9;
        rotYSet.current(x); rotXSet.current(y);
        cxSet.current(-x * 1.8); cySet.current(-y * 1.8);
    }, []);

    const handleMouseEnter = useCallback(() => {
        if (touchDevice.current) return;
        isHoveredRef.current = true; setIsHovered(true);
    }, []);

    const handleMouseLeave = useCallback(() => {
        if (touchDevice.current) return;
        isHoveredRef.current = false; setIsHovered(false);
        rotYSet.current?.(0); rotXSet.current?.(0);
        cxSet.current?.(0); cySet.current?.(0);
    }, []);

    // FIX #5: Safely derive the mp4 fallback regardless of the original extension.
    const videoMp4Src = (() => {
        if (!service.videoSrc) return '';
        const url = service.videoSrc.split('?')[0]; // strip query params for ext check
        if (url.endsWith('.webm')) return service.videoSrc.replace('.webm', '.webm');
        if (url.endsWith('.webm')) return service.videoSrc; // already mp4, reuse
        // Unknown extension — append before any query string
        const qIdx = service.videoSrc.indexOf('?');
        return qIdx > -1
            ? service.videoSrc.slice(0, qIdx) + '.webm' + service.videoSrc.slice(qIdx)
            : service.videoSrc + '.webm';
    })();

    const accent = service.color || '#38bdf8';
    const touch = touchDevice.current;

    return (
        <div ref={wrapRef} style={{ perspective: '1200px' }}>
            <div
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                style={{
                    height: '100vh', position: 'relative',
                    overflow: 'hidden', transformStyle: 'preserve-3d',
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

                {/* FIX #2: Corner brackets — use explicit positioning props only,
                    no ambiguous spread mix. Each bracket is a fixed 40×40 box. */}
                {/* Top-left bracket */}
                <div style={{
                    position: 'absolute',
                    top: 28, left: 28,
                    width: 40, height: 40,
                    zIndex: 5,
                    borderTop: `1px solid ${accent}`,
                    borderLeft: `1px solid ${accent}`,
                }} />
                {/* Bottom-right bracket */}
                <div style={{
                    position: 'absolute',
                    bottom: 28, right: 28,
                    width: 40, height: 40,
                    zIndex: 5,
                    borderBottom: `1px solid ${accent}`,
                    borderRight: `1px solid ${accent}`,
                }} />

                {/* Ghost number (bottom-left, scrub slide) */}
                <div ref={numberRef} style={{
                    position: 'absolute', bottom: 28, left: 40,
                    fontFamily: 'Outfit, sans-serif',
                    fontSize: 'clamp(90px, 14vw, 180px)',
                    fontWeight: 800, lineHeight: 1,
                    letterSpacing: '-0.06em',
                    color: 'transparent',
                    WebkitTextStroke: `3px ${accent}3a`,
                    zIndex: 5, userSelect: 'none', pointerEvents: 'none',
                }}>
                    {String(index + 1).padStart(2, '0')}
                </div>

                {/* FOREGROUND CONTENT
                    FIX #4: Two-layer approach.
                    - contentRef handles the absolute centering (translate -50%/-50%).
                    - tiltWrapRef is the inner div that GSAP moves with x/y for the
                      parallax tilt, keeping the two transforms completely separate. */}
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
                        }}
                    >
                        {/* Subtitle (SplitType chars) */}
                        <p ref={subtitleRef} style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 11, fontWeight: 500,
                            letterSpacing: '0.28em', textTransform: 'uppercase',
                            color: accent, marginBottom: 20,
                        }}>
                            {service.subtitle}
                        </p>

                        {/* Scrub rule */}
                        <div ref={ruleRef} style={{
                            width: '100%', height: 1,
                            background: `linear-gradient(to right, transparent, ${accent}55, transparent)`,
                            marginBottom: 15,
                        }} />

                        {/* Title (SplitType chars scrub reveal) */}
                        <h3 ref={titleRef} style={{
                            fontFamily: 'Outfit, sans-serif',
                            fontSize: 'clamp(44px, 7.5vw, 108px)',
                            fontWeight: 800, lineHeight: 0.9,
                            letterSpacing: '-0.03em', textTransform: 'uppercase',
                            color: '#ffffff',
                            textShadow: (isHovered || touch) ? `0 0 80px ${accent}55` : 'none',
                            transition: 'text-shadow 0.5s ease',
                            marginBottom: 28, wordBreak: 'break-word',
                        }}>
                            {service.title}
                        </h3>

                        {/* Description */}
                        <p ref={descRef} style={{
                            fontFamily: 'DM Sans, sans-serif',
                            fontSize: 'clamp(14px, 1.6vw, 18px)',
                            color: 'rgba(255,255,255,0.52)',
                            lineHeight: 1.75, maxWidth: 500,
                            margin: '0 auto 36px',
                        }}>
                            {service.description}
                        </p>

                        {/* CTA */}
                        {/* <div ref={ctaRef}>
                            <button
                                style={{
                                    padding: '14px 46px',
                                    fontFamily: 'DM Sans, sans-serif',
                                    fontSize: 12, fontWeight: 600,
                                    letterSpacing: '0.14em', textTransform: 'uppercase',
                                    background: 'transparent', color: accent,
                                    border: `1px solid ${accent}`, borderRadius: 0, cursor: 'pointer',
                                }}
                                onMouseEnter={e => gsap.to(e.currentTarget, { backgroundColor: accent, color: '#000', duration: 0.22 })}
                                onMouseLeave={e => gsap.to(e.currentTarget, { backgroundColor: 'transparent', color: accent, duration: 0.22 })}
                            >
                                See Examples
                                <svg style={{ marginLeft: 10, verticalAlign: 'middle' }} width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceCard;