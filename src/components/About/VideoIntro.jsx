import { useRef, useEffect } from 'react';
import SplitType from 'split-type';
import { gsap, ScrollTrigger } from '../../gsap-config';

const VideoIntro = () => {
  const containerRef = useRef(null);
  const videoRef = useRef(null);
  const bgLayerRef = useRef(null);
  const gridRef = useRef(null);
  const overlayRef = useRef(null);
  const scanRef = useRef(null);
  const labelRef = useRef(null);
  const ruleRef = useRef(null);
  const headingRef = useRef(null);
  const scrollHintRef = useRef(null);
  const splitH = useRef(null);
  const splitL = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const mm = gsap.matchMedia(containerRef);

    mm.add({
      isDesktop: "(min-width: 768px)",
      isMobile: "(max-width: 767px)"
    }, (context) => {
      const { isDesktop } = context.conditions;

      /* ── PIN for 1× scroll height ── */
      if (isDesktop) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: '+=100%',
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        });
      }

      /* ── LAYER 1: Video slow zoom-out ── */
      gsap.fromTo(bgLayerRef.current,
        { scale: 1.3 },
        {
          scale: 1, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top', end: '+=100%',
            scrub: 2, invalidateOnRefresh: true,
          }
        }
      );

      /* ── LAYER 2: Grid drifts upward ── */
      gsap.fromTo(gridRef.current,
        { yPercent: 22, opacity: 0 },
        {
          yPercent: -22, opacity: 0.7, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top', end: '+=100%',
            scrub: 2.8, invalidateOnRefresh: true,
          }
        }
      );

      /* ── OVERLAY lightens mid-scroll ── */
      gsap.fromTo(overlayRef.current,
        { opacity: 0.92 },
        {
          opacity: 0.5, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top', end: '+=50%',
            scrub: 1, invalidateOnRefresh: true,
          }
        }
      );

      /* ── SCAN LINE sweeps down on entry ── */
      gsap.fromTo(scanRef.current,
        { yPercent: -105, opacity: 1 },
        {
          yPercent: 210, opacity: 0, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top', end: '+=30%',
            scrub: 0.8, invalidateOnRefresh: true,
          }
        }
      );

      /* ── LABEL: SplitType chars stagger in ── */
      splitL.current = new SplitType(labelRef.current, { types: 'chars' });
      // BUG FIX: gsap.from() with scrollTrigger does NOT set initial state
      // until the trigger fires — so chars are visible before scroll reaches them.
      // gsap.set() immediately hides them before any trigger fires.
      if (splitL.current.chars && splitL.current.chars.length > 0) {
        gsap.set(splitL.current.chars, { y: 20, opacity: 0 });
        gsap.to(splitL.current.chars, {
          y: 0, opacity: 1, stagger: 0.025, duration: 0.6, ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          }
        });
      }

      /* ── RULE: scrub draw left→right ── */
      gsap.fromTo(ruleRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, ease: 'none', transformOrigin: 'left center',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top', end: '+=40%',
            scrub: 0.9, invalidateOnRefresh: true,
          }
        }
      );

      /* ── HEADING: SplitType words+chars scrub clip-reveal ── */
      splitH.current = new SplitType(headingRef.current, { types: 'words,chars' });

      if (splitH.current.words && splitH.current.words.length > 0) {
        splitH.current.words.forEach(w => {
          w.style.display = 'inline-block';
          w.style.whiteSpace = 'nowrap';
          w.style.overflow = 'hidden';
          w.style.verticalAlign = 'bottom';
        });
      }

      if (splitH.current.chars && splitH.current.chars.length > 0) {
        splitH.current.chars.forEach(c => {
          c.style.display = 'inline-block';
          c.style.verticalAlign = 'bottom';
          c.style.willChange = 'transform';
        });
        // BUG FIX: set chars to their "from" state immediately so heading is
        // invisible on page load, only revealed as user scrolls into trigger zone.
        gsap.set(splitH.current.chars, { y: '115%', opacity: 0 });
        gsap.fromTo(splitH.current.chars,
          { y: '115%', opacity: 0 },
          {
            y: '0%', opacity: 1, stagger: 0.014, ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top', end: '+=60%',
              scrub: 0.8, invalidateOnRefresh: true,
            }
          }
        );
      }

      /* ── SCROLL HINT fades out as you scroll ── */
      gsap.to(scrollHintRef.current, {
        opacity: 0, y: 12, ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top', end: '+=15%',
          scrub: 1, invalidateOnRefresh: true,
        }
      });

    }); // end matchMedia

    return () => {
      mm.revert();
      splitH.current?.revert();
      splitL.current?.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="vi-wrap">

      {/* LAYER 1 – Video (slowest parallax) */}
      <div ref={bgLayerRef} className="vi-bg">
        <video
          ref={videoRef}
          autoPlay loop muted playsInline
          poster={`${import.meta.env.BASE_URL}images/responsive_mockup.webp`}
          className="vi-video"
        >
          <source src={`${import.meta.env.BASE_URL}videos/intro.webm`} type="video/webm" />
        </video>
      </div>

      {/* LAYER 2 – Radial vignette */}
      <div ref={overlayRef} className="vi-overlay" />

      {/* LAYER 3 – Cyan dot grid (medium parallax) */}
      <div ref={gridRef} className="vi-grid" />

      {/* LAYER 4 – Scan line */}
      <div ref={scanRef} className="vi-scan" />

      {/* Edge fades */}
      <div className="vi-fade vi-fade--top" />
      <div className="vi-fade vi-fade--bottom" />

      {/* FOREGROUND CONTENT */}
      <div className="vi-content">
        <p ref={labelRef} className="vi-label">V&amp;M Creations — About</p>
        <div className="vi-rule-track">
          <div ref={ruleRef} className="vi-rule" />
        </div>
        <h2 ref={headingRef} className="vi-heading">
          Meet The<br />Builders
        </h2>
      </div>

      {/* Corner brackets */}
      <div className="vi-corner vi-corner--tl" />
      <div className="vi-corner vi-corner--br" />

      {/* Scroll hint */}
      <div ref={scrollHintRef} className="vi-scroll-hint">
        <div className="vi-scroll-line" />
        <span className="vi-scroll-text">Scroll</span>
      </div>
    </div>
  );
};

export default VideoIntro;