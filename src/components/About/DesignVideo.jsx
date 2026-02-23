import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../gsap-config';

const lines = [
    { text: 'First-year students.', accent: false },
    { text: 'Modern tools.', accent: false },
    { text: 'Fresh ideas.', accent: true },
    { text: 'Zero corporate BS.', accent: false },
];

const DesignVideo = () => {
    const containerRef = useRef(null);
    const bgLayerRef = useRef(null);
    const videoRef = useRef(null);
    const gridRef = useRef(null);
    const overlayRef = useRef(null);
    const progressRef = useRef(null);
    const lineRefs = useRef([]);

    useEffect(() => {
        if (
            !containerRef.current ||
            !bgLayerRef.current ||
            !gridRef.current ||
            !overlayRef.current ||
            !progressRef.current
        ) return;

        const validLines = lineRefs.current.filter(Boolean);
        if (validLines.length === 0) return;

        const mm = gsap.matchMedia(containerRef);

        mm.add(
            {
                isDesktop: '(min-width: 1024px)',
                isTablet: '(min-width: 768px) and (max-width: 1023px)',
                isMobile: '(max-width: 767px)',
            },
            (context) => {
                const { isDesktop, isTablet, isMobile } = context.conditions;

                // ── Responsive values ──────────────────────────────────────
                const pinSection  = isDesktop || isTablet;
                const scrubSpeed  = isMobile ? 0.6 : 1;
                const bgEnd       = isMobile ? '+=120%' : '+=200%';
                const tlEnd       = isMobile ? '+=120%' : '+=150%';
                const charYIn     = isMobile ? 24 : 40;
                const charYOut    = isMobile ? -24 : -40;
                const blurIn      = isMobile ? 'blur(6px)' : 'blur(10px)';

                // BUG FIX: Set lines to hidden state immediately so they don't
                // flash visible on page load before ScrollTrigger fires.
                gsap.set(validLines, { opacity: 0, y: charYIn, filter: blurIn });

                // 1. Main Timeline: pins the section and sequences lines
                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: tlEnd,
                        pin: pinSection,
                        pinSpacing: pinSection,
                        scrub: scrubSpeed,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                });

                // 2. Lines Sequence — In → Stay → Out
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

                    tl.to(el, { duration: isMobile ? 0.6 : 1 });

                    tl.to(el, {
                        opacity: 0,
                        y: charYOut,
                        filter: blurIn,
                        duration: 1,
                        ease: 'power2.in',
                    });
                });

                // 3. Video BG Zoom (independent parallax)
                gsap.fromTo(
                    bgLayerRef.current,
                    { scale: 1, yPercent: 0 },
                    {
                        scale: isMobile ? 1.08 : 1.18,
                        yPercent: isMobile ? -4 : -8,
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

                // 4. Grid Drift
                gsap.fromTo(
                    gridRef.current,
                    { yPercent: 25, opacity: 0 },
                    {
                        yPercent: -25,
                        opacity: isMobile ? 0.45 : 0.65,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: 'top top',
                            end: bgEnd,
                            scrub: 3,
                            invalidateOnRefresh: true,
                        },
                    }
                );

                // 5. Overlay Dimming
                gsap.to(overlayRef.current, {
                    opacity: isMobile ? 0.6 : 0.75,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: '+=100%',
                        scrub: 1,
                        invalidateOnRefresh: true,
                    },
                });

                // 6. Progress Bar
                gsap.to(progressRef.current, {
                    scaleX: 1,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: bgEnd,
                        // BUG FIX: scrub: 0 means no smoothing — the progress bar
                        // jumps to match scroll position instantly which is correct
                        // for a progress indicator.
                        scrub: 0,
                        invalidateOnRefresh: true,
                    },
                });
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

            {/* LAYER 1 – Video bg (slowest) */}
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

            {/* LAYER 3 – Grid (medium parallax) */}
            <div ref={gridRef} className="dv-grid" />

            {/* Edge fades */}
            <div className="dv-fade dv-fade--top" />
            <div className="dv-fade dv-fade--bottom" />

            {/* Corner brackets */}
            <div className="dv-corner dv-corner--tl" />
            <div className="dv-corner dv-corner--br" />

            {/* MANIFESTO LINES — stacked at center, each revealed sequentially */}
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