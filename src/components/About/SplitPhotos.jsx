import { useRef, useEffect } from 'react';
import SplitType from 'split-type';
import aboutData from '../../data/about.json';
import { gsap} from '../../gsap-config';

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

  const team    = aboutData.team   || [{ name:'Vatsal', role:'Co-Founder', color:'#38bdf8' }, { name:'Mann', role:'Co-Founder', color:'#00d4ff' }];
  const brand   = aboutData.brand  || { title: 'V&M', subtitle: 'Two builders. One vision.' };

  const stats = [
    { value: '100%', label: 'Client Focus' },
    { value: '2×',   label: 'Faster Delivery' },
    { value: '∞',    label: 'Ambition' },
  ];

  useEffect(() => {
    const ctx = gsap.context(() => {

      /* ── CARDS SLIDE IN FROM SIDES (scrub) ── */
      gsap.fromTo(leftCardRef.current,
        { x: '-38%', opacity: 0, rotate: -4 },
        {
          x: '0%', opacity: 1, rotate: 0, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%', end: 'top 20%',
            scrub: 1.2, invalidateOnRefresh: true,
          }
        }
      );

      gsap.fromTo(rightCardRef.current,
        { x: '38%', opacity: 0, rotate: 4 },
        {
          x: '0%', opacity: 1, rotate: 0, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 90%', end: 'top 20%',
            scrub: 1.2, invalidateOnRefresh: true,
          }
        }
      );

      /* ── PHOTO PARALLAX inside cards ── */
      gsap.fromTo(leftImgRef.current,
        { yPercent: 12 },
        {
          yPercent: -12, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom', end: 'bottom top',
            scrub: 1.8, invalidateOnRefresh: true,
          }
        }
      );

      gsap.fromTo(rightImgRef.current,
        { yPercent: -12 },
        {
          yPercent: 12, ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top bottom', end: 'bottom top',
            scrub: 1.8, invalidateOnRefresh: true,
          }
        }
      );

      /* ── NAME TAGS: SplitType words+chars stagger ── */
      splitLeft.current  = new SplitType(leftNameRef.current,  { types: 'words,chars' });
      splitRight.current = new SplitType(rightNameRef.current, { types: 'words,chars' });
      [splitLeft.current, splitRight.current].forEach(split => {
        split.words.forEach(w => {
          w.style.display    = 'inline-block';
          w.style.whiteSpace = 'nowrap';
          w.style.overflow   = 'hidden';
          w.style.verticalAlign = 'bottom';
        });
        split.chars.forEach(c => {
          c.style.display       = 'inline-block';
          c.style.verticalAlign = 'bottom';
        });
      });

      gsap.from(splitLeft.current.chars, {
        y: 30, opacity: 0, stagger: 0.04, duration: 0.7, ease: 'power3.out',
        scrollTrigger: {
          trigger: leftCardRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        }
      });

      gsap.from(splitRight.current.chars, {
        y: 30, opacity: 0, stagger: 0.04, duration: 0.7, ease: 'power3.out', delay: 0.15,
        scrollTrigger: {
          trigger: rightCardRef.current,
          start: 'top 75%',
          toggleActions: 'play none none reverse',
          invalidateOnRefresh: true,
        }
      });

      /* ── ROLE TAGS fade in ── */
      gsap.from([leftTagRef.current, rightTagRef.current], {
        opacity: 0, y: 12, stagger: 0.15, duration: 0.6, ease: 'power3.out',
        scrollTrigger: {
          trigger: containerRef.current, start: 'top 70%',
          toggleActions: 'play none none reverse', invalidateOnRefresh: true,
        }
      });

      /* ── CENTER BRAND: SplitType words+chars scrub reveal ── */
      splitBrand.current = new SplitType(brandRef.current, { types: 'words,chars' });
      splitBrand.current.words.forEach(w => {
        w.style.display       = 'inline-block';
        w.style.whiteSpace    = 'nowrap';
        w.style.overflow      = 'hidden';
        w.style.verticalAlign = 'bottom';
      });
      splitBrand.current.chars.forEach(c => {
        c.style.display       = 'inline-block';
        c.style.verticalAlign = 'bottom';
      });
      gsap.from(splitBrand.current.chars, {
        y: '120%', opacity: 0, stagger: 0.018, ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 75%', end: 'top 20%',
          scrub: 0.9, invalidateOnRefresh: true,
        }
      });

      /* ── CENTER RULE draws ── */
      gsap.fromTo(ruleRef.current,
        { scaleX: 0 },
        {
          scaleX: 1, transformOrigin: 'center center', ease: 'none',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 65%', end: 'top 25%',
            scrub: 0.9, invalidateOnRefresh: true,
          }
        }
      );

      /* ── STATS stagger up ── */
      const statEls = statsRef.current.filter(Boolean);
      if (statEls.length) {
        gsap.from(statEls, {
          opacity: 0, y: 28, stagger: 0.12, duration: 0.75, ease: 'power3.out',
          scrollTrigger: {
            trigger: centerRef.current, start: 'top 72%',
            toggleActions: 'play none none reverse', invalidateOnRefresh: true,
          }
        });
      }

    }, containerRef);

    return () => {
      ctx.revert();
      splitLeft.current?.revert();
      splitRight.current?.revert();
      splitBrand.current?.revert();
    };
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
            src={`${import.meta.env.BASE_URL}images/Vatsal.webp`}
            alt={team[0]?.name}
            className="sp-img"
          />
          <div className="sp-img-overlay" />
        </div>

        {/* Name tag */}
        <div className="sp-nametag sp-nametag--left" style={{ borderColor: team[0]?.color }}>
          <p ref={leftTagRef} className="sp-role" style={{ color: team[0]?.color }}>
            {team[0]?.role}
          </p>
          <h3 ref={leftNameRef} className="sp-name">{team[0]?.name}</h3>
        </div>

        {/* Glowing corner accent */}
        <div className="sp-corner-accent" style={{ background: team[0]?.color }} />
      </div>

      {/* ── CENTER ── */}
      <div ref={centerRef} className="sp-center">
        <div style={{ overflow: 'hidden' }}>
          <h2 ref={brandRef} className="sp-brand">{brand.title}</h2>
        </div>

        <div ref={ruleRef} className="sp-center-rule" />

        <p className="sp-subtitle">{brand.subtitle}</p>

        {/* Stats */}
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
            src={`${import.meta.env.BASE_URL}images/Mann.webp`}
            alt={team[1]?.name}
            className="sp-img"
          />
          <div className="sp-img-overlay" />
        </div>

        {/* Name tag */}
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