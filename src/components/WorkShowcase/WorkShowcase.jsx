import { useRef, useEffect, useState } from 'react';
import { gsap, ScrollTrigger } from '../../gsap-config';

import './WorkShowcase.css';
import projectsData from '../../data/projects.json';

const projects = projectsData.map(project => ({
  ...project,
  image: `${import.meta.env.BASE_URL}${project.image}`
}));

const WorkShowcase = () => {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const progressRef = useRef(null);
  const projectRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '150px' }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const ctx = gsap.context(() => {

      /* ── Heading line draw ── */
      gsap.from('.ws-heading-line', {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 1.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
        }
      });

      /* ── Title words drop in ── */
      gsap.from('.ws-title-word', {
        y: 120,
        opacity: 0,
        stagger: 0.12,
        duration: 1,
        ease: 'power4.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 85%',
        }
      });

      /* ── Label badge fade ── */
      gsap.from('.ws-heading-label', {
        opacity: 0,
        x: -20,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: headingRef.current,
          start: 'top 88%',
        }
      });

      /* ── Per-project animations ── */
      projectRefs.current.forEach((el, i) => {
        if (!el) return;

        const isEven = i % 2 === 0;

        const number = el.querySelector('.ws-proj-number');
        const imgWrap = el.querySelector('.ws-proj-img-wrap');
        const imgEl = el.querySelector('.ws-proj-img');
        const scan = el.querySelector('.ws-proj-scan');
        const meta = el.querySelector('.ws-proj-meta');
        const titleEl = el.querySelector('.ws-proj-title');
        const desc = el.querySelector('.ws-proj-desc');
        const cta = el.querySelector('.ws-proj-cta');
        const divider = el.querySelector('.ws-proj-divider');
        const right = el.querySelector('.ws-proj-right');
        const left = el.querySelector('.ws-proj-left');
        const tag = el.querySelector('.ws-proj-tag');

        /* Divider line draw */
        gsap.from(divider, {
          scaleX: 0,
          transformOrigin: 'left center',
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });

        /* Number slide-in from left */
        gsap.from(number, {
          opacity: 0,
          x: -50,
          duration: 0.9,
          ease: 'power4.out',
          scrollTrigger: { trigger: el, start: 'top 82%' }
        });

        /* Left column slides from left */
        gsap.from(left, {
          opacity: 0,
          x: -40,
          duration: 0.9,
          delay: 0.05,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 80%' }
        });

        /* Image clip-path reveal (top → down) */
        gsap.from(imgWrap, {
          clipPath: 'inset(100% 0% 0% 0%)',
          duration: 1.3,
          ease: 'power4.out',
          delay: 0.1,
          scrollTrigger: { trigger: el, start: 'top 80%' }
        });

        /* Scan line sweep */
        gsap.fromTo(scan,
          { scaleX: 0, opacity: 1 },
          {
            scaleX: 1,
            opacity: .5,
            transformOrigin: 'left right',
            duration: 1,
            ease: 'power2.inOut',
            delay: 0.15,
            scrollTrigger: { trigger: el, start: 'top 80%' }
          }
        );

        /* Subtle image parallax */
        gsap.to(imgEl, {
          yPercent: -12,
          ease: 'none',
          scrollTrigger: {
            trigger: el,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5,
          }
        });

        /* Right column slides in from right */
        gsap.from(right, {
          opacity: 0,
          x: isEven ? 60 : 60,
          duration: 1,
          ease: 'power3.out',
          delay: 0.2,
          scrollTrigger: { trigger: el, start: 'top 80%' }
        });

        /* Title, desc, cta stagger */
        gsap.from([titleEl, desc, cta], {
          y: 30,
          opacity: 0,
          stagger: 0.1,
          duration: 0.85,
          ease: 'power3.out',
          delay: 0.35,
          scrollTrigger: { trigger: el, start: 'top 80%' }
        });

        /* Tag badge pop */
        if (tag) {
          gsap.from(tag, {
            scale: 0.6,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.8)',
            delay: 0.5,
            scrollTrigger: { trigger: el, start: 'top 80%' }
          });
        }

        /* Meta fade */
        gsap.from(meta, {
          opacity: 0,
          y: 10,
          duration: 0.6,
          delay: 0.25,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 82%' }
        });

        /* Scrub-based horizontal drift on the whole row while scrolling through */
        gsap.fromTo(el.querySelector('.ws-proj-row'),
          { x: isEven ? -8 : 8 },
          {
            x: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: el,
              start: 'top bottom',
              end: 'top 40%',
              scrub: 1.2,
            }
          }
        );

        /* Image scale-up on enter */
        gsap.from(imgEl, {
          scale: 1.12,
          duration: 1.4,
          ease: 'power3.out',
          delay: 0.1,
          scrollTrigger: { trigger: el, start: 'top 80%' }
        });
      });

    }, sectionRef);

    const refreshTimer = setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => {
      ctx.revert();
      clearTimeout(refreshTimer);
    };
  }, [isVisible]);

  /* ── Glitch title on hover ── */
  const handleTitleEnter = (e) => {
    const el = e.currentTarget;
    const original = el.dataset.text || el.textContent;
    el.dataset.text = original;
    const chars = '!<>-_\\/[]{}—=+*^?#@$%&';
    let frame = 0;
    const total = 10;
    const interval = setInterval(() => {
      el.textContent = original
        .split('')
        .map((c, idx) =>
          c === ' ' ? ' ' : frame / total > idx / original.length
            ? c
            : chars[Math.floor(Math.random() * chars.length)]
        )
        .join('');
      frame++;
      if (frame > total) {
        el.textContent = original;
        clearInterval(interval);
      }
    }, 35);
  };

  const handleTitleLeave = (e) => {
    e.currentTarget.textContent = e.currentTarget.dataset.text || e.currentTarget.textContent;
  };

  return (
    <section
      id="work-section"
      ref={sectionRef}
      className="ws-section"
    >
      {/* Scroll progress bar */}
      <div className="ws-progress-track">
        <div className="ws-progress-bar" ref={progressRef} />
      </div>

      {/* Ambient background glows */}
      <div className="ws-glow ws-glow--a" />
      <div className="ws-glow ws-glow--b" />
      <div className="ws-glow ws-glow--c" />

      <div className="ws-inner">
        {/* ── Section heading ── */}
        <div className="ws-heading" ref={headingRef}>
          <div className="ws-heading-top">
            <span className="ws-heading-label">PORTFOLIO</span>
            <div className="ws-heading-line" />
          </div>
          <h2 className="ws-heading-title">
            <span className="ws-title-word">Selected</span>
            <span className="ws-title-word ws-title-word--accent">Work</span>
          </h2>
        </div>

        {/* ── Project list ── */}
        {isVisible && (
          <div className="ws-list">
            {projects.map((project, i) => (
              <article
                key={i}
                className="ws-proj"
                ref={el => projectRefs.current[i] = el}
              >
                <div className="ws-proj-divider" />

                <div className="ws-proj-row">
                  {/* Left: number + meta */}
                  <div className="ws-proj-left">
                    <span className="ws-proj-number">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <div className="ws-proj-meta">
                      <span className="ws-proj-category">{project.category}</span>
                      {project.tag && (
                        <span className="ws-proj-tag">{project.tag}</span>
                      )}
                    </div>
                  </div>

                  {/* Center: image */}
                  <div className="ws-proj-img-wrap">
                    <img
                      className="ws-proj-img"
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="ws-proj-img-overlay" />
                    <div className="ws-proj-scan" />
                    {/* Corner brackets */}
                    <span className="ws-corner ws-corner--tl" />
                    <span className="ws-corner ws-corner--br" />
                  </div>

                  {/* Right: content */}
                  <div className="ws-proj-right">
                    <h3
                      className="ws-proj-title"
                      onMouseEnter={handleTitleEnter}
                      onMouseLeave={handleTitleLeave}
                    >
                      {project.title}
                    </h3>
                    <p className="ws-proj-desc">{project.description}</p>
                    <a
                      href={project.link}
                      className="ws-proj-cta"
                      onClick={e => e.preventDefault()}
                    >
                      <span className="ws-proj-cta-text">View Project</span>
                      <span className="ws-proj-cta-arrow">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            ))}

            {/* Final divider */}
            <div className="ws-proj-divider ws-proj-divider--final" />
          </div>
        )}

        {!isVisible && <div style={{ minHeight: '300vh' }} />}
      </div>
    </section>
  );
};

export default WorkShowcase;