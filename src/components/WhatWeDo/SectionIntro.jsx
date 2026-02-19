import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../gsap-config';
import SplitType from 'split-type';

const SectionIntro = () => {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const lineRef = useRef(null);
  const labelRef = useRef(null);
  const splitRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(labelRef.current, {
        opacity: 0, x: -24, duration: 0.8, ease: 'power3.out',
        scrollTrigger: { trigger: containerRef.current, start: 'top 82%' }
      });

      gsap.from(lineRef.current, {
        scaleX: 0, transformOrigin: 'left center', duration: 1.1, ease: 'power3.out', delay: 0.1,
        scrollTrigger: { trigger: containerRef.current, start: 'top 82%' }
      });

      splitRef.current = new SplitType(titleRef.current, { types: 'words,chars' });
      const chars = splitRef.current.chars;
      splitRef.current.words.forEach(w => {
        w.style.display       = 'inline-block';
        w.style.whiteSpace    = 'nowrap';
        w.style.overflow      = 'hidden';
        w.style.verticalAlign = 'bottom';
      });
      chars.forEach(c => {
        c.style.display       = 'inline-block';
        c.style.verticalAlign = 'bottom';
      });

      gsap.from(chars, {
        y: 90, opacity: 0, rotateX: -70,
        transformOrigin: 'top center',
        stagger: 0.022, duration: 0.85, ease: 'back.out(1.8)', delay: 0.2,
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none none' }
      });

      gsap.from(subtitleRef.current, {
        opacity: 0, y: 30, duration: 0.9, ease: 'power3.out', delay: 0.55,
        scrollTrigger: { trigger: containerRef.current, start: 'top 80%', toggleActions: 'play none none none' }
      });

    }, containerRef);

    return () => {
      ctx.revert();
      splitRef.current?.revert();
    };
  }, []);

  return (
    <div ref={containerRef} style={{
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '100px 5% 60px',
      textAlign: 'center',
      position: 'relative',
    }}>
      {/* Label + line */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, marginBottom: 24, width: '100%', maxWidth: 700 }}>
        <span ref={labelRef} style={{
          fontFamily: 'DM Sans, sans-serif',
          fontSize: 11,
          fontWeight: 500,
          letterSpacing: '0.28em',
          color: '#38bdf8',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>Our Services</span>
        <div ref={lineRef} style={{
          flex: 1, height: 1,
          background: 'linear-gradient(to right, #38bdf8, transparent)',
        }} />
      </div>

      <h2 ref={titleRef} style={{
        fontFamily: 'Outfit, sans-serif',
        fontSize: 'clamp(52px, 9vw, 120px)',
        fontWeight: 800,
        lineHeight: 0.95,
        letterSpacing: '-0.03em',
        textTransform: 'uppercase',
        color: '#ffffff',
        marginBottom: 32,
        perspective: '600px',
      }}>
        What We{' '}
        <span style={{
          color: 'transparent',
          WebkitTextStroke: '2px #38bdf8',
        }}>Build</span>
      </h2>

      <p ref={subtitleRef} style={{
        fontFamily: 'DM Sans, sans-serif',
        fontSize: 'clamp(16px, 2vw, 20px)',
        color: 'rgba(255,255,255,0.5)',
        maxWidth: 520,
        lineHeight: 1.75,
      }}>
        Fast, beautiful, mobile-first websites that help your business grow
      </p>
    </div>
  );
};

export default SectionIntro;