import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

import './WorkShowcase.css';

import projectsData from '../../data/projects.json';

const projects = projectsData.map(project => ({
  ...project,
  image: `${import.meta.env.BASE_URL}${project.image}`
}));

const WorkShowcase = () => {
  const containerRef = useRef(null);
  const projectRefs = useRef([]);
  const [isVisible, setIsVisible] = useState(false);

  // ✅ Only initialize when section is near viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;

    const ctx = gsap.context(() => {
      projectRefs.current.forEach((project, index) => {
        if (!project) return;

        const isEven = index % 2 === 0;
        const image = project.querySelector('.project-image');
        const content = project.querySelector('.project-content');

        // ✅ Use gsap.set() for scroll-linked animations (no tweens)
        ScrollTrigger.create({
          trigger: project,
          start: 'top 80%',
          end: 'top 20%',
          onUpdate: (self) => {
            const progress = self.progress;

            // Image parallax
            gsap.set(image, {
              y: 100 - (progress * 150),
              scale: 1.1 - (progress * 0.1),
              opacity: 0.5 + (progress * 0.5)
            });

            // Content slide
            gsap.set(content, {
              x: (isEven ? -100 : 100) * (1 - progress),
              opacity: progress
            });
          }
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [isVisible]);

  // ✅ Force ScrollTrigger refresh when content loads to prevent overlap
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  return (
    <section
      id="work-section"
      ref={containerRef}
      className="work-showcase"
      style={{
        padding: '100px 5%',
        overflow: 'hidden',
        position: 'relative',
        minHeight: '100vh'
      }}
    >
      {/* Top Gradient Fade */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '200px',
        background: 'linear-gradient(to bottom, #080d18, transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Bottom Gradient Fade */}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        width: '100%',
        height: '200px',
        background: 'linear-gradient(to top, #080d18, transparent)',
        zIndex: 2,
        pointerEvents: 'none'
      }} />

      {/* Render placeholder until visible */}
      <div style={{ minHeight: isVisible ? 'auto' : '500vh' }}>
        {isVisible && (
          <>
            <div style={{
              textAlign: 'center',
              marginBottom: '150px',
              position: 'relative',
              zIndex: 3
            }}>
              <h2 style={{
                fontSize: 'clamp(40px, 8vw, 100px)',
                fontFamily: '"Syne", sans-serif',
                fontWeight: 900,
                color: '#ffffff',
                marginBottom: '20px',
                textTransform: 'uppercase'
              }}>
                Selected <span style={{ color: '#38bdf8', WebkitTextStroke: '1px #38bdf8', WebkitTextFillColor: 'transparent' }}>Work</span>
              </h2>
              <div style={{
                width: '2px',
                height: '100px',
                background: 'linear-gradient(to bottom, #38bdf8, transparent)',
                margin: '0 auto'
              }} />
            </div>

            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '20vh'
            }}>
              {projects.map((project, index) => (
                <div
                  key={index}
                  ref={el => projectRefs.current[index] = el}
                  className={`project-card ${index % 2 === 0 ? 'even' : 'odd'}`}
                >
                  {/* Image */}
                  <div className="project-image-container">
                    <img
                      className="project-image"
                      src={project.image}
                      alt={project.title}
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="overlay" />
                  </div>

                  {/* Content */}
                  <div className="project-content project-content-container">
                    <h3>{project.category}</h3>
                    <h2>{project.title}</h2>
                    <p>{project.description}</p>

                    <a
                      href={project.link}
                      onClick={(e) => e.preventDefault()}
                    >
                      VIEW PROJECT
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

    </section >
  );
};

export default WorkShowcase;
