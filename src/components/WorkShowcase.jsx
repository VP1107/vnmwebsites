import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    title: "Baby Bloom",
    category: "Garbhasanskar & Prenatal Care",
    description: "Comprehensive prenatal care platform with canvas-based particle animations, expert profiles, and community features.",
    stack: ["HTML", "CSS", "JS", "Google Apps Script"],
    image: `${import.meta.env.BASE_URL}images/babybloom-screenshot.webp`,
    link: "#" // Add actual links if available
  },
  {
    title: "Manan Shah",
    category: "Professional Portfolio",
    description: "A professional, minimalistic multi-page portfolio designed for clean aesthetics and clarity.",
    stack: ["HTML", "CSS"],
    image: `${import.meta.env.BASE_URL}images/manan-shah-screenshot.webp`,
    link: "#"
  },
  {
    title: "Chef4U",
    category: "Catering Business",
    description: "A premium catering service platform featuring elegant menu showcases, interactive booking forms, and a seamless mobile-responsive design.",
    stack: ["HTML", "CSS", "JS"],
    image: `${import.meta.env.BASE_URL}images/chef4u-screenshot.webp`,
    link: "#"
  },
  {
    title: "Corporate UI",
    category: "Business Landing Page",
    description: "A professional corporate UI clone focused on high-end design aesthetics.",
    stack: ["HTML", "CSS"],
    image: `${import.meta.env.BASE_URL}images/renav-official-screenshot.webp`,
    link: "#"
  },
  {
    title: "Messaging UI",
    category: "App Interface Demo",
    description: "A complex UI demo for a messaging application with glassmorphism effects.",
    stack: ["HTML", "CSS"],
    image: `${import.meta.env.BASE_URL}images/renav-messenger-screenshot.webp`,
    link: "#"
  }
];

const WorkShowcase = () => {
  const containerRef = useRef(null);
  const projectRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      projectRefs.current.forEach((project, index) => {
        if (!project) return;

        const isEven = index % 2 === 0;
        const image = project.querySelector('.project-image');
        const content = project.querySelector('.project-content');

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: project,
            start: 'top 80%',
            end: 'top 20%',
            scrub: 1
          }
        });

        // Image Parallax & Reveal
        tl.fromTo(image,
          {
            y: 100,
            scale: 1.1,
            opacity: 0.5
          },
          {
            y: -50,
            scale: 1,
            opacity: 1,
            duration: 1,
            ease: 'power2.out'
          }
        );

        // Content Slide In
        gsap.fromTo(content,
          {
            x: isEven ? -100 : 100,
            opacity: 0
          },
          {
            x: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: project,
              start: 'top 70%',
              end: 'top 30%',
              scrub: 1
            }
          }
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      style={{
        background: '#050505',
        padding: '100px 5%',
        overflow: 'hidden'
      }}
    >
      <div style={{
        textAlign: 'center',
        marginBottom: '150px'
      }}>
        <h2 style={{
          fontSize: 'clamp(40px, 8vw, 100px)',
          fontFamily: '"Syne", sans-serif',
          fontWeight: 900,
          color: '#ffffff',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          Selected <span style={{ color: '#00ff88', WebkitTextStroke: '1px #00ff88', WebkitTextFillColor: 'transparent' }}>Work</span>
        </h2>
        <div style={{
          width: '2px',
          height: '100px',
          background: 'linear-gradient(to bottom, #00ff88, transparent)',
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
            style={{
              display: 'flex',
              flexDirection: index % 2 === 0 ? 'row' : 'row-reverse',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '5%',
              flexWrap: 'wrap'
            }}
          >
            {/* Image Container */}
            <div
              style={{
                flex: '1 1 500px',
                height: '600px',
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative'
              }}
            >
              <img
                className="project-image"
                src={project.image}
                alt={project.title}
                loading="lazy"
                decoding="async"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(20%) contrast(1.1)',
                  transition: 'filter 0.5s ease'
                }}
                onMouseEnter={(e) => e.target.style.filter = 'grayscale(0%) contrast(1.2)'}
                onMouseLeave={(e) => e.target.style.filter = 'grayscale(20%) contrast(1.1)'}
              />
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'rgba(0,0,0,0.2)',
                pointerEvents: 'none'
              }} />
            </div>

            {/* Content Container */}
            <div
              className="project-content"
              style={{
                flex: '1 1 400px',
                textAlign: index % 2 === 0 ? 'left' : 'right'
              }}
            >
              <h3 style={{
                color: '#00ff88',
                fontFamily: '"Inter", sans-serif',
                fontSize: '14px',
                letterSpacing: '3px',
                textTransform: 'uppercase',
                marginBottom: '10px'
              }}>
                {project.category}
              </h3>
              <h2 style={{
                color: '#ffffff',
                fontFamily: '"Syne", sans-serif',
                fontSize: 'clamp(40px, 5vw, 80px)',
                fontWeight: 800,
                marginBottom: '30px',
                lineHeight: 0.9
              }}>
                {project.title}
              </h2>
              <p style={{
                color: '#a0a0a0',
                fontFamily: '"Inter", sans-serif',
                fontSize: '18px',
                lineHeight: 1.6,
                marginBottom: '40px',
                maxWidth: '500px',
                marginLeft: index % 2 === 0 ? '0' : 'auto'
              }}>
                {project.description}
              </p>

              <div style={{
                display: 'flex',
                gap: '15px',
                justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                flexWrap: 'wrap',
                marginBottom: '40px'
              }}>
                {project.stack.map((tech, i) => (
                  <span
                    key={i}
                    style={{
                      border: '1px solid #333',
                      padding: '8px 15px',
                      borderRadius: '50px',
                      color: '#fff',
                      fontSize: '12px',
                      fontFamily: '"Inter", sans-serif'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>

              <a
                href={project.link}
                style={{
                  display: 'inline-block',
                  borderBottom: '2px solid #00ff88',
                  paddingBottom: '5px',
                  color: '#ffffff',
                  textDecoration: 'none',
                  fontSize: '16px',
                  fontFamily: '"Inter", sans-serif',
                  fontWeight: 600,
                  letterSpacing: '1px'
                }}
              >
                VIEW PROJECT
              </a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WorkShowcase;
