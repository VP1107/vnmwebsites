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

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isTablet: '(min-width: 768px) and (max-width: 1023px)',
        isMobile: '(max-width: 767px)',
      },
      (context) => {
        const { isDesktop, isTablet, isMobile } = context.conditions;

        // ── Responsive values ──────────────────────────────────────────────
        const pinSection   = isDesktop || isTablet;
        const scrubSpeed   = isMobile ? 0.6 : 2;
        const gridOpacity  = isMobile ? 0.45 : 0.7;
        const ruleEnd      = isMobile ? '+=25%' : '+=40%';
        const headingEnd   = isMobile ? '+=40%' : '+=60%';
        const scanEnd      = isMobile ? '+=20%' : '+=30%';

        // ── PIN ────────────────────────────────────────────────────────────
        if (pinSection) {
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

        // ── LAYER 1: Video slow zoom-out ───────────────────────────────────
        gsap.fromTo(
          bgLayerRef.current,
          { scale: isMobile ? 1.15 : 1.3 },
          {
            scale: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: '+=100%',
              scrub: scrubSpeed,
              invalidateOnRefresh: true,
            },
          }
        );

        // ── LAYER 2: Grid drifts upward ────────────────────────────────────
        gsap.fromTo(
          gridRef.current,
          { yPercent: isMobile ? 12 : 22, opacity: 0 },
          {
            yPercent: isMobile ? -12 : -22,
            opacity: gridOpacity,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: '+=100%',
              scrub: 2.8,
              invalidateOnRefresh: true,
            },
          }
        );

        // ── OVERLAY lightens mid-scroll ────────────────────────────────────
        gsap.fromTo(
          overlayRef.current,
          { opacity: 0.92 },
          {
            opacity: isMobile ? 0.65 : 0.5,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: '+=50%',
              scrub: 1,
              invalidateOnRefresh: true,
            },
          }
        );

        // ── SCAN LINE sweeps down on entry ─────────────────────────────────
        // BUG FIX: On mobile the scan line was still animating even with
        // pinSection=false, which caused a jarring double-movement since the
        // section scrolls naturally. Reduce yPercent range on mobile so it
        // stays within the viewport during natural scroll.
        gsap.fromTo(
          scanRef.current,
          { yPercent: -105, opacity: 1 },
          {
            yPercent: isMobile ? 105 : 210,
            opacity: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: scanEnd,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );

        // ── LABEL: SplitType chars stagger in ─────────────────────────────
        // Revert any previous split before re-splitting (breakpoint change safety)
        splitL.current?.revert();
        splitL.current = new SplitType(labelRef.current, { types: 'chars' });

        if (splitL.current.chars && splitL.current.chars.length > 0) {
          // BUG FIX (already noted in original): gsap.set() hides chars
          // immediately so they don't flash before the trigger fires.
          gsap.set(splitL.current.chars, { y: isMobile ? 14 : 20, opacity: 0 });
          gsap.to(splitL.current.chars, {
            y: 0,
            opacity: 1,
            stagger: 0.025,
            duration: isMobile ? 0.45 : 0.6,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            },
          });
        }

        // ── RULE: scrub draw left → right ──────────────────────────────────
        gsap.fromTo(
          ruleRef.current,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: 'none',
            transformOrigin: 'left center',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: ruleEnd,
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          }
        );

        // ── HEADING: SplitType words+chars scrub clip-reveal ──────────────
        // Revert any previous split before re-splitting (breakpoint change safety)
        splitH.current?.revert();
        splitH.current = new SplitType(headingRef.current, { types: 'words,chars' });

        if (splitH.current.words && splitH.current.words.length > 0) {
          splitH.current.words.forEach((w) => {
            w.style.display       = 'inline-block';
            w.style.whiteSpace    = 'nowrap';
            w.style.overflow      = 'hidden';
            w.style.verticalAlign = 'bottom';
          });
        }

        if (splitH.current.chars && splitH.current.chars.length > 0) {
          splitH.current.chars.forEach((c) => {
            c.style.display       = 'inline-block';
            c.style.verticalAlign = 'bottom';
            c.style.willChange    = 'transform';
          });

          // BUG FIX (already noted in original): set "from" state immediately
          // so heading is invisible on load and only reveals on scroll.
          gsap.set(splitH.current.chars, { y: '115%', opacity: 0 });

          gsap.fromTo(
            splitH.current.chars,
            { y: '115%', opacity: 0 },
            {
              y: '0%',
              opacity: 1,
              stagger: isMobile ? 0.01 : 0.014,
              ease: 'none',
              scrollTrigger: {
                trigger: containerRef.current,
                start: 'top top',
                end: headingEnd,
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        // ── SCROLL HINT fades out as you scroll ────────────────────────────
        gsap.to(scrollHintRef.current, {
          opacity: 0,
          y: isMobile ? 8 : 12,
          ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top top',
            end: '+=15%',
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        // Cleanup SplitType on breakpoint change
        return () => {
          splitH.current?.revert();
          splitL.current?.revert();
        };
      }
    );

    return () => {
      mm.revert();
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