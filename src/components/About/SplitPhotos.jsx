import { useRef, useEffect } from 'react';
import SplitType from 'split-type';
import aboutData from '../../data/about.json';
import { gsap } from '../../gsap-config';

const SplitPhotos = () => {
  const containerRef  = useRef(null);
  const leftCardRef   = useRef(null);
  const rightCardRef  = useRef(null);
  const leftImgRef    = useRef(null);
  const rightImgRef   = useRef(null);
  const leftNameRef   = useRef(null);
  const rightNameRef  = useRef(null);
  const leftTagRef    = useRef(null);
  const rightTagRef   = useRef(null);
  const centerRef     = useRef(null);
  const brandRef      = useRef(null);
  const ruleRef       = useRef(null);
  const statsRef      = useRef([]);
  const splitLeft     = useRef(null);
  const splitRight    = useRef(null);
  const splitBrand    = useRef(null);

  const team  = aboutData.team  || [
    { name: 'Vatsal', role: 'Co-Founder', color: '#38bdf8' },
    { name: 'Mann',   role: 'Co-Founder', color: '#00d4ff' },
  ];
  const brand = aboutData.brand || { title: 'V&M', subtitle: 'Two builders. One vision.' };

  const stats = [
    { value: '100%', label: 'Client Focus'   },
    { value: '2×',   label: 'Faster Delivery' },
    { value: '∞',    label: 'Ambition'        },
  ];

  useEffect(() => {
    if (!containerRef.current) return;

    const mm = gsap.matchMedia(containerRef);

    mm.add(
      {
        isDesktop: '(min-width: 1024px)',
        isTablet:  '(min-width: 768px) and (max-width: 1023px)',
        isMobile:  '(max-width: 767px)',
      },
      (context) => {
        const { isDesktop, isTablet, isMobile } = context.conditions;

        // ── Responsive values ────────────────────────────────────────────────
        // On mobile, cards stack vertically so the side-slide distance and
        // rotation are smaller. Parallax ranges are also reduced.
        const cardSlideX      = isMobile ? '18%'  : isTablet ? '28%' : '38%';
        const cardRotate      = isMobile ? 2       : isTablet ? 3     : 4;
        const cardScrubEnd    = isMobile ? 'top 35%' : 'top 20%';
        const imgParallax     = isMobile ? 6       : 12;
        const nameCharY       = isMobile ? 18      : 30;
        const nameStagger     = isMobile ? 0.025   : 0.04;
        const nameDuration    = isMobile ? 0.5     : 0.7;
        const brandEnd        = isMobile ? 'top 30%' : 'top 20%';
        const statY           = isMobile ? 18      : 28;
        const statDuration    = isMobile ? 0.6     : 0.75;

        // ── 1. CARDS SLIDE IN FROM SIDES (scrub) ─────────────────────────────
        // BUG FIX: Use gsap.set() + gsap.to() instead of gsap.from() to guarantee
        // the hidden state is applied immediately, preventing a flash of the card
        // at its final position before the ScrollTrigger fires.
        gsap.set(leftCardRef.current,  { x: `-${cardSlideX}`, opacity: 0, rotate: -cardRotate });
        gsap.set(rightCardRef.current, { x:  `${cardSlideX}`, opacity: 0, rotate:  cardRotate });

        gsap.to(leftCardRef.current, {
          x: '0%', opacity: 1, rotate: 0, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            end: cardScrubEnd,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        gsap.to(rightCardRef.current, {
          x: '0%', opacity: 1, rotate: 0, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%',
            end: cardScrubEnd,
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });

        // ── 2. PHOTO PARALLAX inside cards ──────────────────────────────────
        gsap.fromTo(leftImgRef.current,
          { yPercent:  imgParallax },
          {
            yPercent: -imgParallax, ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom', end: 'bottom top',
              scrub: 1.8, invalidateOnRefresh: true,
            },
          }
        );

        gsap.fromTo(rightImgRef.current,
          { yPercent: -imgParallax },
          {
            yPercent:  imgParallax, ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top bottom', end: 'bottom top',
              scrub: 1.8, invalidateOnRefresh: true,
            },
          }
        );

        // ── 3. NAME TAGS: SplitType chars stagger ───────────────────────────
        // Revert before re-splitting (safe on breakpoint change)
        splitLeft.current?.revert();
        splitRight.current?.revert();
        splitLeft.current  = new SplitType(leftNameRef.current,  { types: 'words,chars' });
        splitRight.current = new SplitType(rightNameRef.current, { types: 'words,chars' });

        [splitLeft.current, splitRight.current].forEach(split => {
          if (!split.words || !split.chars) return;
          split.words.forEach(w => {
            w.style.display       = 'inline-block';
            w.style.whiteSpace    = 'nowrap';
            w.style.overflow      = 'hidden';
            w.style.verticalAlign = 'bottom';
          });
          split.chars.forEach(c => {
            c.style.display       = 'inline-block';
            c.style.verticalAlign = 'bottom';
          });
        });

        // BUG FIX: Use set + to instead of from so chars are never visible
        // before the scroll trigger fires (prevents flash on page load).
        if (splitLeft.current?.chars?.length) {
          gsap.set(splitLeft.current.chars, { y: nameCharY, opacity: 0 });
          gsap.to(splitLeft.current.chars, {
            y: 0, opacity: 1,
            stagger: nameStagger, duration: nameDuration, ease: 'power3.out',
            scrollTrigger: {
              trigger: leftCardRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          });
        }

        if (splitRight.current?.chars?.length) {
          gsap.set(splitRight.current.chars, { y: nameCharY, opacity: 0 });
          gsap.to(splitRight.current.chars, {
            y: 0, opacity: 1,
            stagger: nameStagger, duration: nameDuration, ease: 'power3.out',
            delay: isMobile ? 0 : 0.15, // no delay offset needed on mobile (cards stack)
            scrollTrigger: {
              trigger: rightCardRef.current,
              start: 'top 75%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          });
        }

        // ── 4. ROLE TAGS fade in ─────────────────────────────────────────────
        // BUG FIX: same set + to pattern.
        gsap.set([leftTagRef.current, rightTagRef.current], { opacity: 0, y: 12 });
        gsap.to([leftTagRef.current, rightTagRef.current], {
          opacity: 1, y: 0,
          stagger: isMobile ? 0 : 0.15,
          duration: isMobile ? 0.5 : 0.6,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 70%',
            toggleActions: 'play none none reverse',
            invalidateOnRefresh: true,
          },
        });

        // ── 5. CENTER BRAND: SplitType scrub reveal ─────────────────────────
        splitBrand.current?.revert();
        splitBrand.current = new SplitType(brandRef.current, { types: 'words,chars' });

        if (splitBrand.current.words) {
          splitBrand.current.words.forEach(w => {
            w.style.display       = 'inline-block';
            w.style.whiteSpace    = 'nowrap';
            w.style.overflow      = 'hidden';
            w.style.verticalAlign = 'bottom';
          });
        }
        if (splitBrand.current.chars) {
          splitBrand.current.chars.forEach(c => {
            c.style.display       = 'inline-block';
            c.style.verticalAlign = 'bottom';
          });
        }

        // BUG FIX: set initial hidden state before the tween so chars never
        // flash at their final position before the trigger fires.
        if (splitBrand.current?.chars?.length) {
          gsap.set(splitBrand.current.chars, { y: '120%', opacity: 0 });
          gsap.to(splitBrand.current.chars, {
            y: '0%', opacity: 1,
            stagger: isMobile ? 0.012 : 0.018,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 75%',
              end: brandEnd,
              scrub: 0.9,
              invalidateOnRefresh: true,
            },
          });
        }

        // ── 6. CENTER RULE draws ─────────────────────────────────────────────
        gsap.fromTo(ruleRef.current,
          { scaleX: 0 },
          {
            scaleX: 1, transformOrigin: 'center center', ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top 65%',
              end: isMobile ? 'top 40%' : 'top 25%',
              scrub: 0.9, invalidateOnRefresh: true,
            },
          }
        );

        // ── 7. STATS stagger up ──────────────────────────────────────────────
        const statEls = statsRef.current.filter(Boolean);
        if (statEls.length) {
          gsap.set(statEls, { opacity: 0, y: statY });
          gsap.to(statEls, {
            opacity: 1, y: 0,
            stagger: isMobile ? 0.08 : 0.12,
            duration: statDuration,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: centerRef.current,
              start: isMobile ? 'top 85%' : 'top 72%',
              toggleActions: 'play none none reverse',
              invalidateOnRefresh: true,
            },
          });
        }

        // Cleanup SplitType on breakpoint change
        return () => {
          splitLeft.current?.revert();
          splitRight.current?.revert();
          splitBrand.current?.revert();
        };
      }
    );

    return () => mm.revert();
  }, []);

  return (
    <div ref={containerRef} className="sp-wrap">

      {/* Ambient glows */}
      <div className="sp-glow sp-glow--left"  style={{ background: `radial-gradient(circle, ${team[0]?.color || '#38bdf8'}18 0%, transparent 70%)` }} />
      <div className="sp-glow sp-glow--right" style={{ background: `radial-gradient(circle, ${team[1]?.color || '#00d4ff'}18 0%, transparent 70%)` }} />

      {/* ── LEFT CARD ── */}
      <div ref={leftCardRef} className="sp-card sp-card--left" style={{ borderColor: team[0]?.color || '#38bdf8' }}>
        <div className="sp-img-wrap">
          <img
            ref={leftImgRef}
            src={`${import.meta.env.BASE_URL}${team[0]?.image}`}
            alt={team[0]?.name}
            className="sp-img"
          />
          <div className="sp-img-overlay" />
        </div>

        <div className="sp-nametag sp-nametag--left" style={{ borderColor: team[0]?.color }}>
          <p ref={leftTagRef} className="sp-role" style={{ color: team[0]?.color }}>
            {team[0]?.role}
          </p>
          <h3 ref={leftNameRef} className="sp-name">{team[0]?.name}</h3>
        </div>

        <div className="sp-corner-accent" style={{ background: team[0]?.color }} />
      </div>

      {/* ── CENTER ── */}
      <div ref={centerRef} className="sp-center">
        <div style={{ overflow: 'hidden' }}>
          <h2 ref={brandRef} className="sp-brand">{brand.title}</h2>
        </div>

        <div ref={ruleRef} className="sp-center-rule" />

        <p className="sp-subtitle">{brand.subtitle}</p>

        <div className="sp-stats">
          {stats.map((s, i) => (
            <div key={i} ref={el => statsRef.current[i] = el} className="sp-stat">
              <span className="sp-stat-value">{s.value}</span>
              <span className="sp-stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT CARD ── */}
      <div ref={rightCardRef} className="sp-card sp-card--right" style={{ borderColor: team[1]?.color || '#00d4ff' }}>
        <div className="sp-img-wrap">
          <img
            ref={rightImgRef}
            src={`${import.meta.env.BASE_URL}${team[1]?.image}`}
            alt={team[1]?.name}
            className="sp-img"
          />
          <div className="sp-img-overlay" />
        </div>

        <div className="sp-nametag sp-nametag--right" style={{ borderColor: team[1]?.color }}>
          <p ref={rightTagRef} className="sp-role" style={{ color: team[1]?.color }}>
            {team[1]?.role}
          </p>
          <h3 ref={rightNameRef} className="sp-name">{team[1]?.name}</h3>
        </div>

        <div className="sp-corner-accent" style={{ background: team[1]?.color }} />
      </div>
    </div>
  );
};

export default SplitPhotos;