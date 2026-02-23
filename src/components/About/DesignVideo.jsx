import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../gsap-config';

const lines = [
    { text: 'First-year students.', accent: false },
    { text: 'Modern tools.',        accent: false },
    { text: 'Fresh ideas.',         accent: true  },
    { text: 'Zero corporate BS.',   accent: false },
];

const DesignVideo = () => {
    const containerRef = useRef(null);
    const bgLayerRef   = useRef(null);
    const videoRef     = useRef(null);
    const gridRef      = useRef(null);
    const overlayRef   = useRef(null);
    const progressRef  = useRef(null);
    const lineRefs     = useRef([]);

    useEffect(() => {
        if (
            !containerRef.current ||
            !bgLayerRef.current   ||
            !gridRef.current      ||
            !overlayRef.current   ||
            !progressRef.current
        ) return;

        const validLines = lineRefs.current.filter(Boolean);
        if (validLines.length === 0) return;

        const mm = gsap.matchMedia(containerRef);

        mm.add(
            {
                isDesktop: '(min-width: 1024px)',
                isTablet:  '(min-width: 768px) and (max-width: 1023px)',
                isMobile:  '(max-width: 767px)',
            },
            (context) => {
                const { isDesktop, isTablet, isMobile } = context.conditions;

                // ── Responsive values ──────────────────────────────────────────

                // MOBILE STRATEGY: On mobile the sequential scrub carousel doesn't
                // work without pinning — and pinning on mobile with enough scroll
                // distance to read all 4 lines (4 × ~3 scroll units = ~300% scroll)
                // feels too heavy. Instead, mobile gets a stacked layout where all
                // 4 lines are visible simultaneously, each triggered by scroll with
                // a simple stagger fade-in. No scrub, no pin, no carousel.
                //
                // DESKTOP/TABLET: Pin the section and run the full scrub carousel.

                const charYIn  = isMobile ? 20  : 40;
                const charYOut = isMobile ? -20 : -40;
                const blurIn   = isMobile ? 'blur(4px)' : 'blur(10px)';

                // Always hide lines initially
                gsap.set(validLines, { opacity: 0, y: charYIn, filter: blurIn });

                if (isMobile) {
                    // ── MOBILE: stacked vertical layout ───────────────────────
                    // The .dv-lines container and its .dv-line children use
                    // position:absolute in CSS (needed for desktop carousel).
                    // On mobile we override this so lines stack in a column.
                    const linesContainer = containerRef.current.querySelector('.dv-lines');
                    if (linesContainer) {
                        gsap.set(linesContainer, {
                            position:      'absolute',
                            top:           '50%',
                            left:          '50%',
                            xPercent:      -50,
                            yPercent:      -50,
                            display:       'flex',
                            flexDirection: 'column',
                            alignItems:    'center',
                            gap:           '12px',
                            width:         '90%',
                            textAlign:     'center',
                        });
                    }

                    // Override each line back to relative flow so they stack,
                    // not absolute-on-top-of-each-other.
                    gsap.set(validLines, {
                        position: 'relative',
                        top:      'auto',
                        left:     'auto',
                        width:    '100%',
                    });

                    // Now re-apply the hidden state (gsap.set above cleared y/opacity)
                    gsap.set(validLines, { opacity: 0, y: charYIn, filter: blurIn });

                    // Stagger fade-in as section enters viewport
                    gsap.to(validLines, {
                        opacity: 1,
                        y: 0,
                        filter: 'blur(0px)',
                        duration: 0.65,
                        ease: 'power2.out',
                        stagger: 0.14,
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top 65%',
                            toggleActions: 'play none none reverse',
                            invalidateOnRefresh: true,
                        },
                    });

                } else {
                    // ── TABLET + DESKTOP: pinned scrub carousel ────────────────
                    // Pin the section for enough scroll distance to sequence all lines.
                    // Each line: 1 (in) + 1 (hold) + 1 (out) = 3 units × 4 lines = 12.
                    // We map that onto scroll distance via tlEnd.
                    const tlEnd    = isTablet ? '+=130%' : '+=150%';
                    const bgEnd    = isTablet ? '+=160%' : '+=200%';
                    const scrub    = isTablet ? 0.8 : 1;

                    const tl = gsap.timeline({
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top top',
                            end: tlEnd,
                            pin: true,
                            pinSpacing: true,
                            scrub,
                            anticipatePin: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    // Lines Sequence — In → Hold → Out
                    lines.forEach((_, i) => {
                        const el = lineRefs.current[i];
                        if (!el) return;

                        tl.to(el, {
                            opacity: 1,
                            y: 0,
                            filter: 'blur(0px)',
                            duration: 1,
                            ease: 'power2.out',
                        });

                        tl.to(el, { duration: 1 }); // hold

                        tl.to(el, {
                            opacity: 0,
                            y: charYOut,
                            filter: blurIn,
                            duration: 1,
                            ease: 'power2.in',
                        });
                    });

                    // BG Zoom — independent of pin timeline
                    gsap.fromTo(bgLayerRef.current,
                        { scale: 1, yPercent: 0 },
                        {
                            scale: isTablet ? 1.12 : 1.18,
                            yPercent: isTablet ? -5 : -8,
                            ease: 'none',
                            scrollTrigger: {
                                trigger: containerRef.current,
                                start: 'top top',
                                end: bgEnd,
                                scrub: 2.5,
                                invalidateOnRefresh: true,
                            },
                        }
                    );

                    // Overlay dimming
                    gsap.to(overlayRef.current, {
                        opacity: isTablet ? 0.65 : 0.75,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top top',
                            end: '+=100%',
                            scrub: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    // Progress bar
                    gsap.set(progressRef.current, { scaleX: 0 });
                    gsap.to(progressRef.current, {
                        scaleX: 1,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top top',
                            end: bgEnd,
                            scrub: 0,
                            invalidateOnRefresh: true,
                        },
                    });
                }

                // ── Grid Drift — both breakpoints ──────────────────────────────
                // Uses top bottom / bottom top so it always has scroll distance
                // to travel regardless of whether the section is pinned.
                gsap.set(gridRef.current, {
                    yPercent: 25,
                    opacity: isMobile ? 0.25 : 0,
                });
                gsap.to(gridRef.current, {
                    yPercent: -25,
                    opacity: isMobile ? 0.45 : 0.65,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top bottom',
                        end: 'bottom top',
                        scrub: 3,
                        invalidateOnRefresh: true,
                    },
                });

                // ── Mobile-only overlay + progress ─────────────────────────────
                // On desktop/tablet these are set above inside the pin block.
                if (isMobile) {
                    gsap.to(overlayRef.current, {
                        opacity: 0.55,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: 1,
                            invalidateOnRefresh: true,
                        },
                    });

                    // No progress bar scrub on mobile — the section isn't pinned
                    // so a scrub bar tracking pin progress is meaningless.
                    // Hide it entirely.
                    gsap.set(progressRef.current, { scaleX: 0, opacity: 0 });
                }
            }
        );

        return () => mm.revert();
    }, []);

    return (
        <div ref={containerRef} className="dv-wrap">

            {/* SCRUB PROGRESS BAR */}
            <div className="dv-progress-track">
                <div ref={progressRef} className="dv-progress-bar" />
            </div>

            {/* LAYER 1 – Video bg */}
            <div ref={bgLayerRef} className="dv-bg">
                <video
                    ref={videoRef}
                    autoPlay loop muted playsInline preload="none"
                    className="dv-video"
                >
                    <source src={`${import.meta.env.BASE_URL}videos/design-process.webm`} type="video/webm" />
                </video>
            </div>

            {/* LAYER 2 – Vignette */}
            <div ref={overlayRef} className="dv-overlay" />

            {/* LAYER 3 – Grid */}
            <div ref={gridRef} className="dv-grid" />

            {/* Edge fades */}
            <div className="dv-fade dv-fade--top" />
            <div className="dv-fade dv-fade--bottom" />

            {/* Corner brackets */}
            <div className="dv-corner dv-corner--tl" />
            <div className="dv-corner dv-corner--br" />

            {/* MANIFESTO LINES */}
            <div className="dv-lines">
                {lines.map((line, i) => (
                    <h2
                        key={i}
                        ref={el => lineRefs.current[i] = el}
                        className={`dv-line${line.accent ? ' dv-line--accent' : ''}`}
                    >
                        {line.text}
                    </h2>
                ))}
            </div>

            {/* Section index */}
            <div className="dv-index">03</div>
        </div>
    );
};

export default DesignVideo;