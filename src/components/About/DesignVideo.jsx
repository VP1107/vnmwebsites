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
        if (!containerRef.current || !bgLayerRef.current || !gridRef.current || !overlayRef.current || !progressRef.current) return;

        const validLines = lineRefs.current.filter(Boolean);
        if (validLines.length === 0) return;

        const mm = gsap.matchMedia(containerRef);

        mm.add({
            isDesktop: "(min-width: 768px)",
            isMobile: "(max-width: 767px)"
        }, (context) => {
            const { isDesktop } = context.conditions;

            // 1. Initial State: Hide all lines immediately
            gsap.set(validLines, { opacity: 0, y: 40, filter: 'blur(10px)' });

            // 2. Main Timeline: Pins the section and orchestrates the lines
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=150%',
                    pin: isDesktop ? true : false,
                    pinSpacing: isDesktop ? true : false,
                    scrub: 1, // Smooth scrubbing for text
                    anticipatePin: 1,
                    invalidateOnRefresh: true,
                }
            });

            // 3. Lines Sequence
            // We divide the timeline into equal slots for each line.
            // Total lines = 4. 
            // For each line: Fade In -> Stay -> Fade Out.
            lines.forEach((_, i) => {
                const el = lineRefs.current[i];
                if (!el) return;

                // In
                tl.to(el, {
                    opacity: 1,
                    y: 0,
                    filter: 'blur(0px)',
                    duration: 1,
                    ease: 'power2.out'
                });

                // Stay visible for a bit
                tl.to(el, { duration: 1 });

                // Out
                tl.to(el, {
                    opacity: 0,
                    y: -40,
                    filter: 'blur(10px)',
                    duration: 1,
                    ease: 'power2.in'
                });
            });

            // 4. Background Animations (Independent Parallax)
            // These run in parallel to the pinned container scrub.

            // Video BG Zoom
            gsap.fromTo(bgLayerRef.current,
                { scale: 1, yPercent: 0 },
                {
                    scale: 1.18,
                    yPercent: -8,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: '+=200%',
                        scrub: 2.5, // Different smoothness for depth feel
                        invalidateOnRefresh: true,
                    }
                }
            );

            // Grid Drift
            gsap.fromTo(gridRef.current,
                { yPercent: 25, opacity: 0 },
                {
                    yPercent: -25,
                    opacity: 0.65,
                    ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top',
                        end: '+=200%',
                        scrub: 3,
                        invalidateOnRefresh: true,
                    }
                }
            );

            // Overlay Dimming
            gsap.to(overlayRef.current, {
                opacity: 0.75,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=100%', // Fades in faster
                    scrub: 1,
                    invalidateOnRefresh: true,
                }
            });

            // Progress Bar
            gsap.to(progressRef.current, {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top',
                    end: '+=200%',
                    scrub: 0,
                    invalidateOnRefresh: true,
                }
            });

        }); // end matchMedia

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