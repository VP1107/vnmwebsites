import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../gsap-config';
import SplitType from 'split-type';

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
    const splitRefs    = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {

            /* ── PIN ── */
            ScrollTrigger.create({
                trigger: containerRef.current,
                start: 'top top',
                end: '+=400%',
                pin: true,
                pinSpacing: true,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            });

            /* ── PROGRESS BAR ── */
            gsap.fromTo(progressRef.current,
                { scaleX: 0 },
                {
                    scaleX: 1, ease: 'none', transformOrigin: 'left center',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top', end: '+=400%',
                        scrub: 0, invalidateOnRefresh: true,
                    }
                }
            );

            /* ── VIDEO parallax zoom ── */
            gsap.fromTo(bgLayerRef.current,
                { scale: 1, yPercent: 0 },
                {
                    scale: 1.28, yPercent: -8, ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top', end: '+=400%',
                        scrub: 2.5, invalidateOnRefresh: true,
                    }
                }
            );

            /* ── GRID drift ── */
            gsap.fromTo(gridRef.current,
                { yPercent: 25, opacity: 0 },
                {
                    yPercent: -25, opacity: 0.65, ease: 'none',
                    scrollTrigger: {
                        trigger: containerRef.current,
                        start: 'top top', end: '+=400%',
                        scrub: 3, invalidateOnRefresh: true,
                    }
                }
            );

            /* ── OVERLAY ── */
            gsap.to(overlayRef.current, {
                opacity: 0.75, ease: 'none',
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top top', end: '+=200%',
                    scrub: 1, invalidateOnRefresh: true,
                }
            });

            /* ── SEQUENTIAL LINE REVEALS ── */
            const total       = lines.length;
            const segmentSize = 1 / total;
            const pinVh       = 400;

            lines.forEach((_, i) => {
                const el = lineRefs.current[i];
                if (!el) return;

                splitRefs.current[i] = new SplitType(el, { types: 'words,chars' });

                splitRefs.current[i].words.forEach(w => {
                    w.style.display       = 'inline-block';
                    w.style.whiteSpace    = 'nowrap';
                    w.style.overflow      = 'clip';
                    w.style.verticalAlign = 'bottom';
                });

                splitRefs.current[i].chars.forEach(c => {
                    c.style.display       = 'inline-block';
                    c.style.verticalAlign = 'bottom';
                    c.style.willChange    = 'transform';
                });

                const chars = splitRefs.current[i].chars;

                // FIX: explicitly set all chars invisible BEFORE any ScrollTrigger
                // fires. This is the correct way — not CSS opacity:0 on the parent
                // (which breaks the stacked grid layout) but gsap.set on chars directly.
                gsap.set(chars, { y: '120%', opacity: 0 });

                const lineStart = i * segmentSize;
                const inEnd     = lineStart + segmentSize * 0.35;
                const outStart  = lineStart + segmentSize * 0.80;
                const lineEnd   = lineStart + segmentSize;

                const toOffset  = p => `top+=${p * pinVh}% top`;

                /* IN */
                gsap.fromTo(chars,
                    { y: '120%', opacity: 0, filter: 'blur(8px)' },
                    {
                        y: '0%', opacity: 1, filter: 'blur(0px)',
                        stagger: 0.012, ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: toOffset(lineStart),
                            end:   toOffset(inEnd),
                            scrub: 0.8, invalidateOnRefresh: true,
                        }
                    }
                );

                /* OUT */
                gsap.fromTo(chars,
                    { y: '0%', opacity: 1, filter: 'blur(0px)' },
                    {
                        y: '-110%', opacity: 0, filter: 'blur(6px)',
                        stagger: 0.008, ease: 'none',
                        scrollTrigger: {
                            trigger: containerRef.current,
                            start: toOffset(outStart),
                            end:   toOffset(lineEnd),
                            scrub: 0.8, invalidateOnRefresh: true,
                        }
                    }
                );
            });

        }, containerRef);

        return () => {
            ctx.revert();
            splitRefs.current.forEach(s => s?.revert());
        };
    }, []);

    return (
        <div ref={containerRef} className="dv-wrap">
            <div className="dv-progress-track">
                <div ref={progressRef} className="dv-progress-bar" />
            </div>
            <div ref={bgLayerRef} className="dv-bg">
                <video ref={videoRef} autoPlay loop muted playsInline preload="none" className="dv-video">
                    <source src={`${import.meta.env.BASE_URL}videos/design-process.mp4`} type="video/mp4" />
                </video>
            </div>
            <div ref={overlayRef} className="dv-overlay" />
            <div ref={gridRef} className="dv-grid" />
            <div className="dv-fade dv-fade--top" />
            <div className="dv-fade dv-fade--bottom" />
            <div className="dv-corner dv-corner--tl" />
            <div className="dv-corner dv-corner--br" />
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
            <div className="dv-index">03</div>
        </div>
    );
};

export default DesignVideo;