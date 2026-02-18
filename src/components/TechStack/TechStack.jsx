import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './TechStack.css';

gsap.registerPlugin(ScrollTrigger);

import TECH_ITEMS from '../../data/techStack.json';

const TechStack = () => {
  const sectionRef = useRef(null);
  const labelRef = useRef(null);
  const headingRef = useRef(null);
  const containerRef = useRef(null);
  const chipRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Only initialize when section is near viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '300px' } // Start loading early
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // ✅ GSAP scroll animations only run when visible
  useEffect(() => {
    if (!isVisible) return;

    const ctx = gsap.context(() => {
      /* Label + heading slide up */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 76%',
        once: true,
        onEnter: () => {
          gsap.to(labelRef.current, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power3.out',
          });
          gsap.to(headingRef.current, {
            opacity: 1,
            y: 0,
            duration: 1.05,
            ease: 'power3.out',
            delay: 0.14,
          });
        },
      });

      /* Staggered chip bounce-in */
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          chipRefs.current.forEach((chip, i) => {
            if (!chip) return;
            gsap.to(chip, {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.7,
              ease: 'back.out(1.6)',
              delay: i * 0.075,
            });
          });
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isVisible]);

  /* ── Magnetic chip handlers ─────────────────────────────────── */
  const handleMouseMove = (e, color) => {
    const chip = e.currentTarget;
    const r = chip.getBoundingClientRect();
    const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
    const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);
    gsap.to(chip, { x: dx * 7, y: dy * 4, duration: 0.25, ease: 'power2.out' });
  };

  const handleMouseEnter = (e, color) => {
    const chip = e.currentTarget;
    gsap.to(chip, { scale: 1.1, duration: 0.25, ease: 'power2.out' });
    chip.style.borderColor = `${color}70`;
    chip.style.background = `${color}14`;
    chip.style.boxShadow = `0 0 28px ${color}25, inset 0 0 14px ${color}0c`;
    
    const appCursorRing = document.querySelector('.custom-cursor-ring');
    if (appCursorRing) {
      gsap.to(appCursorRing, {
        width: 56,
        height: 56,
        borderColor: color,
        duration: 0.25,
        ease: 'power2.out',
      });
    }
  };

  const handleMouseLeave = (e, color) => {
    const chip = e.currentTarget;
    gsap.to(chip, {
      scale: 1,
      x: 0,
      y: 0,
      duration: 0.5,
      ease: 'elastic.out(1, 0.55)',
    });
    chip.style.borderColor = `${color}2a`;
    chip.style.background = `${color}07`;
    chip.style.boxShadow = 'none';

    const appCursorRing = document.querySelector('.custom-cursor-ring');
    if (appCursorRing) {
      gsap.to(appCursorRing, {
        width: 40,
        height: 40,
        borderColor: '#ffffff',
        duration: 0.4,
        ease: 'power2.out',
      });
    }
  };

  return (
    <section ref={sectionRef} className="tech-stack">
      <div className="tech-stack__rule" />

      <span ref={labelRef} className="tech-stack__label">
        The Foundation
      </span>

      <h2 ref={headingRef} className="tech-stack__heading">
        TECH STACK
      </h2>

      {/* ✅ Only render chips when visible */}
      {isVisible && (
        <div ref={containerRef} className="tech-stack-container">
          {TECH_ITEMS.map((tech, index) => (
            <span
              key={tech.label}
              ref={(el) => (chipRefs.current[index] = el)}
              className="tech-chip"
              onMouseMove={(e) => handleMouseMove(e, tech.color)}
              onMouseEnter={(e) => handleMouseEnter(e, tech.color)}
              onMouseLeave={(e) => handleMouseLeave(e, tech.color)}
              style={{
                color: tech.color,
                textShadow: `0 0 22px ${tech.color}44`,
                border: `1px solid ${tech.color}2a`,
                background: `${tech.color}07`,
              }}
            >
              {tech.label}
            </span>
          ))}
        </div>
      )}
    </section>
  );
};

export default TechStack;