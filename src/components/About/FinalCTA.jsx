import { useRef, useEffect } from 'react';
import SplitType from 'split-type';
import { gsap, ScrollTrigger} from '../../gsap-config';

const FinalCTA = () => {
  const containerRef = useRef(null);
  const bgLayerRef   = useRef(null);
  const videoRef     = useRef(null);
  const gridRef      = useRef(null);
  const glowRef      = useRef(null);
  const labelRef     = useRef(null);
  const ruleRef      = useRef(null);
  const headingRef   = useRef(null);
  const accentRef    = useRef(null);
  const ctaRef       = useRef(null);
  const perksRef     = useRef(null);
  const splitH       = useRef(null);
  const splitA       = useRef(null);
  const splitL       = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── PARALLAX LAYERS ── */
      // Video bg drifts up as section scrolls past
      gsap.fromTo(bgLayerRef.current,
        { yPercent: 10 },
        {
          yPercent: -10, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom', end: 'bottom top',
            scrub: 2, invalidateOnRefresh: true,
          }
        }
      );

      // Ambient glow parallax (faster than bg)
      gsap.fromTo(glowRef.current,
        { yPercent: 22, scale: 0.85 },
        {
          yPercent: -22, scale: 1.15, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom', end: 'bottom top',
            scrub: 1.5, invalidateOnRefresh: true,
          }
        }
      );

      // Grid drifts at medium speed
      gsap.fromTo(gridRef.current,
        { yPercent: 16, opacity: 0 },
        {
          yPercent: -16, opacity: 0.7, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom', end: 'bottom top',
            scrub: 2.5, invalidateOnRefresh: true,
          }
        }
      );

      /* ── LABEL: SplitType chars stagger in ── */
      splitL.current = new SplitType(labelRef.current, { types: 'chars' });
      gsap.from(splitL.current.chars, {
        y: 18, opacity: 0, stagger: 0.022, duration: 0.6, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current, start: 'top 85%',
          toggleActions: 'play none none none', invalidateOnRefresh: true,
        }
      });

      /* ── RULE scrub draw ── */
      gsap.fromTo(ruleRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, transformOrigin: 'left center', ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 82%', end: 'top 45%',
            scrub: 0.9, invalidateOnRefresh: true,
          }
        }
      );

      /* ── MAIN HEADING: SplitType words+chars scrub reveal ──
         Split by words FIRST so each word gets a wrapper, then chars
         animate inside. Word wrappers get white-space:nowrap so the
         browser can never break mid-word. */
      splitH.current = new SplitType(headingRef.current, { types: 'words,chars' });
      // Word wrappers: inline-block + nowrap = no mid-word breaks
      splitH.current.words.forEach(w => {
        w.style.display        = 'inline-block';
        w.style.whiteSpace     = 'nowrap';
        w.style.overflow       = 'hidden';
        w.style.verticalAlign  = 'bottom';
      });
      // Chars animate inside the word container
      splitH.current.chars.forEach(c => {
        c.style.display       = 'inline-block';
        c.style.verticalAlign = 'bottom';
      });
      gsap.from(splitH.current.chars, {
        y: '115%', opacity: 0, stagger: 0.014, ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 78%', end: 'top 25%',
          scrub: 0.85, invalidateOnRefresh: true,
        }
      });

      /* ── ACCENT WORD: same pattern ── */
      splitA.current = new SplitType(accentRef.current, { types: 'words,chars' });
      splitA.current.words.forEach(w => {
        w.style.display       = 'inline-block';
        w.style.whiteSpace    = 'nowrap';
        w.style.overflow      = 'hidden';
        w.style.verticalAlign = 'bottom';
      });
      splitA.current.chars.forEach(c => {
        c.style.display       = 'inline-block';
        c.style.verticalAlign = 'bottom';
      });
      gsap.from(splitA.current.chars, {
        y: '120%', opacity: 0, stagger: 0.016, ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 72%', end: 'top 18%',
          scrub: 0.85, invalidateOnRefresh: true,
        }
      });

      /* ── CTA BUTTON: elastic bounce in ── */
      gsap.fromTo(ctaRef.current,
        { y: 60, opacity: 0, scale: 0.8 },
        {
          y: 0, opacity: 1, scale: 1,
          duration: 1.1, ease: 'elastic.out(1, 0.55)',
          scrollTrigger: {
            trigger: containerRef.current, start: 'top 60%',
            toggleActions: 'play none none none', invalidateOnRefresh: true,
          }
        }
      );

      /* ── BUTTON GLOW PULSE (after entrance) ── */
      gsap.to(ctaRef.current, {
        boxShadow: '0 0 55px rgba(56,189,248,0.72)',
        duration: 1.6, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 1.5,
      });

      /* ── PERKS stagger up ── */
      const perkEls = perksRef.current?.querySelectorAll('.fcta-perk');
      if (perkEls?.length) {
        gsap.from(perkEls, {
          opacity: 0, y: 22, stagger: 0.1, duration: 0.7, ease: 'power3.out',
          scrollTrigger: {
            trigger: perksRef.current, start: 'top 88%',
            toggleActions: 'play none none none', invalidateOnRefresh: true,
          }
        });
      }

    }, containerRef);

    return () => {
      ctx.revert();
      splitH.current?.revert();
      splitA.current?.revert();
      splitL.current?.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className="fcta-wrap">

      {/* LAYER 1 – Video bg (slowest) */}
      <div ref={bgLayerRef} className="fcta-bg">
        <video
          ref={videoRef}
          autoPlay loop muted playsInline
          poster={`${import.meta.env.BASE_URL}images/responsive_mockup.webp`}
          className="fcta-video"
        >
          <source src={`${import.meta.env.BASE_URL}videos/FinalCTA.webm`} type="video/webm" />
        </video>
      </div>

      {/* LAYER 2 – Radial vignette */}
      <div className="fcta-overlay" />

      {/* LAYER 3 – Ambient glow blob (fast parallax) */}
      <div ref={glowRef} className="fcta-glow" />

      {/* LAYER 4 – Grid (medium parallax) */}
      <div ref={gridRef} className="fcta-grid" />

      {/* Edge fades */}
      <div className="fcta-fade fcta-fade--top" />
      <div className="fcta-fade fcta-fade--bottom" />

      {/* Corner brackets */}
      <div className="fcta-corner fcta-corner--tl" />
      <div className="fcta-corner fcta-corner--br" />

      {/* CONTENT */}
      <div className="fcta-content">

        {/* Label + rule */}
        <div className="fcta-label-row">
          <span ref={labelRef} className="fcta-label">Let's Build</span>
          <div ref={ruleRef} className="fcta-rule" />
        </div>

        {/* Heading */}
        <h2 ref={headingRef} className="fcta-heading">
          Ready to build<br />something
        </h2>

        {/* Accent word */}
        <div style={{ overflow: 'hidden' }}>
          <span ref={accentRef} className="fcta-accent">extraordinary?</span>
        </div>

        {/* CTA */}
        <button
          ref={ctaRef}
          className="fcta-btn"
          onMouseEnter={e => gsap.to(e.currentTarget, { scale: 1.07, duration: 0.26, ease: 'back.out(2)' })}
          onMouseLeave={e => gsap.to(e.currentTarget, { scale: 1,    duration: 0.26, ease: 'power2.out' })}
          onClick={() => document.querySelector('#contact-section')?.scrollIntoView({ behavior: 'smooth' })}
        >
          Let's Work Together
          <svg style={{ marginLeft: 12, verticalAlign: 'middle' }} width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M2 8h12M9 3l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Perks */}
        <div ref={perksRef} className="fcta-perks">
          {['Free Consultation', 'Fast Turnaround', 'Student Pricing'].map((p, i) => (
            <div key={i} className="fcta-perk">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <circle cx="7" cy="7" r="6" stroke="#38bdf8" strokeWidth="1"/>
                <path d="M4 7l2.5 2.5L10 4.5" stroke="#38bdf8" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {p}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinalCTA;