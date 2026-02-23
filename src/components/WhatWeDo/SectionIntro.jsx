import { useRef, useEffect } from 'react';
import { gsap } from '../../gsap-config';
import SplitType from 'split-type';

const SectionIntro = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const lineRef = useRef(null);
  const labelRef = useRef(null);
  const splitRef = useRef(null);

  useEffect(() => {
    if (
      !containerRef.current ||
      !labelRef.current ||
      !lineRef.current ||
      !titleRef.current ||
      !subtitleRef.current
    ) return;

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
        const scrollStart     = isMobile ? 'top 92%' : isTablet ? 'top 86%' : 'top 82%';
        const charY           = isMobile ? 50        : isTablet ? 70        : 90;
        const charDuration    = isMobile ? 0.65      : isTablet ? 0.75      : 0.85;
        const charStagger     = isMobile ? 0.016     : isTablet ? 0.019     : 0.022;
        const subtitleY       = isMobile ? 18        : 30;
        const labelX          = isMobile ? -14       : -24;

        // ── LABEL slide in ─────────────────────────────────────────────────
        gsap.from(labelRef.current, {
          opacity: 0,
          x: labelX,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: scrollStart,
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        });

        // ── RULE draw ──────────────────────────────────────────────────────
        gsap.from(lineRef.current, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: isMobile ? 0.85 : 1.1,
          ease: 'power3.out',
          delay: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: scrollStart,
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        });

        // ── TITLE SplitType reveal ─────────────────────────────────────────
        splitRef.current = new SplitType(titleRef.current, { types: 'words,chars' });

        if (splitRef.current.words) {
          splitRef.current.words.forEach((w) => {
            w.style.display    = 'inline-block';
            w.style.whiteSpace = 'nowrap';
            w.style.overflow   = 'hidden';
            w.style.verticalAlign = 'bottom';
          });
        }

        const chars = splitRef.current.chars;
        if (chars && chars.length > 0) {
          chars.forEach((c) => {
            c.style.display       = 'inline-block';
            c.style.verticalAlign = 'bottom';
          });

          // Set hidden state immediately so chars don't flash before trigger
          gsap.set(chars, { y: charY, opacity: 0, rotateX: -70 });

          gsap.to(chars, {
            y: 0,
            opacity: 1,
            rotateX: 0,
            transformOrigin: 'top center',
            stagger: charStagger,
            duration: charDuration,
            ease: 'back.out(1.8)',
            delay: 0.2,
            scrollTrigger: {
              trigger: containerRef.current,
              start: scrollStart,
              toggleActions: 'play none none none',
              invalidateOnRefresh: true,
            },
          });
        }

        // ── SUBTITLE fade up ───────────────────────────────────────────────
        gsap.from(subtitleRef.current, {
          opacity: 0,
          y: subtitleY,
          duration: 0.9,
          ease: 'power3.out',
          delay: isMobile ? 0.35 : 0.55,
          scrollTrigger: {
            trigger: containerRef.current,
            start: scrollStart,
            toggleActions: 'play none none none',
            invalidateOnRefresh: true,
          },
        });

        // Cleanup SplitType inside the matchMedia context
        return () => {
          splitRef.current?.revert();
        };
      }
    );

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'clamp(60px, 10vw, 100px) 5% clamp(40px, 6vw, 60px)',
        textAlign: 'center',
        position: 'relative',
      }}
    >
      {/* Label + line */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(12px, 2vw, 20px)',
          marginBottom: 'clamp(16px, 2.5vw, 24px)',
          width: '100%',
          maxWidth: 700,
        }}
      >
        <span
          ref={labelRef}
          style={{
            fontFamily: 'DM Sans, sans-serif',
            fontSize: 'clamp(9px, 1.2vw, 11px)',
            fontWeight: 500,
            letterSpacing: '0.28em',
            color: '#38bdf8',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}
        >
          Our Services
        </span>
        <div
          ref={lineRef}
          style={{
            flex: 1,
            height: 1,
            background: 'linear-gradient(to right, #38bdf8, transparent)',
          }}
        />
      </div>

      <h2
        ref={titleRef}
        style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: 'clamp(42px, 9vw, 120px)',
          fontWeight: 800,
          lineHeight: 0.95,
          letterSpacing: '-0.03em',
          textTransform: 'uppercase',
          color: '#ffffff',
          marginBottom: 'clamp(20px, 3.5vw, 32px)',
          perspective: '600px',
        }}
      >
        What We{' '}
        <span
          style={{
            color: 'transparent',
            WebkitTextStroke: '2px #38bdf8',
          }}
        >
          Build
        </span>
      </h2>

      <p
        ref={subtitleRef}
        style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 'clamp(14px, 2vw, 20px)',
          color: 'rgba(255,255,255,0.5)',
          maxWidth: 520,
          lineHeight: 1.75,
          padding: '0 clamp(0px, 2vw, 20px)',
        }}
      >
        Fast, beautiful, mobile-first websites that help your business grow
      </p>
    </div>
  );
};

export default SectionIntro;