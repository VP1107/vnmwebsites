import { useRef, useEffect, useState } from 'react';
import './HorizontalCards.css';
import { gsap, ScrollTrigger } from '../../gsap-config';



const CARDS_DATA = [
    {
        index: '01 / 04',
        title: 'GSAP\nScrollTrigger',
        desc: 'Pin sections, scrub animations, and orchestrate scroll-driven choreography with pixel-perfect control.',
        tag: 'Animation Engine',
        color: '#38bdf8',
    },
    {
        index: '02 / 04',
        title: 'Lenis\nSmooth',
        desc: "Native-feeling momentum scroll that integrates seamlessly with GSAP's ScrollTrigger via RAF sync.",
        tag: 'Scroll Inertia',
        color: '#a78bfa',
    },
    {
        index: '03 / 04',
        title: 'React\n+ Refs',
        desc: "useRef + useEffect let GSAP reach into the DOM without fighting React's rendering cycle.",
        tag: 'Component Model',
        color: '#34d399',
    },
    {
        index: '04 / 04',
        title: 'CSS\nOnly Polish',
        desc: 'Shimmers, chip borders, gradient text, marquees — all pure CSS, zero JS overhead for static effects.',
        tag: 'Style Layer',
        color: '#fb923c',
    },
];

const HorizontalCards = () => {
    const outerRef = useRef(null);
    const stickyRef = useRef(null);
    const trackRef = useRef(null);
    const headerRef = useRef(null);
    const cardRefs = useRef([]);
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
            { rootMargin: '400px' } // Start early since this section is tall
        );

        if (outerRef.current) {
            observer.observe(outerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const track = trackRef.current;
        const outer = outerRef.current;
        const sticky = stickyRef.current;

        if (!track || !outer || !sticky) return;

        const totalW = () => track.scrollWidth - sticky.offsetWidth;

        const ctx = gsap.context(() => {
            // Header reveal
            ScrollTrigger.create({
                trigger: outer,
                start: 'top 60%',
                once: true,
                onEnter: () => {
                    gsap.to(headerRef.current, {
                        opacity: 1,
                        duration: 0.8,
                        ease: 'power2.out',
                    });
                },
            });

            // Cards stagger in
            ScrollTrigger.create({
                trigger: outer,
                start: 'top 75%',
                once: true,
                onEnter: () => {
                    gsap.to(cardRefs.current, {
                        opacity: 1,
                        x: 0,
                        duration: 0.85,
                        stagger: 0.14,
                        ease: 'power3.out',
                    });
                },
            });

            // Horizontal scrub
            gsap.to(track, {
                x: () => -totalW(),
                ease: 'none',
                scrollTrigger: {
                    trigger: outer,
                    pin: sticky,
                    scrub: 1.1,
                    start: 'top top',
                    end: () => '+=' + totalW(),
                    invalidateOnRefresh: true,
                },
            });
        }, outerRef);

        return () => ctx.revert();
    }, [isVisible]);

    // Card 3D tilt
    const handleCardMouseMove = (e, index) => {
        const card = cardRefs.current[index];
        if (!card) return;

        const r = card.getBoundingClientRect();
        const dx = (e.clientX - r.left - r.width / 2) / (r.width / 2);
        const dy = (e.clientY - r.top - r.height / 2) / (r.height / 2);

        gsap.to(card, {
            rotateY: dx * 7,
            rotateX: -dy * 4.5,
            duration: 0.3,
            ease: 'power2.out',
            transformPerspective: 900,
        });
    };

    const handleCardMouseLeave = (index) => {
        const card = cardRefs.current[index];
        if (!card) return;

        gsap.to(card, {
            rotateY: 0,
            rotateX: 0,
            duration: 0.7,
            ease: 'elastic.out(1, 0.55)',
            transformPerspective: 900,
        });
    };

    return (
        <div ref={outerRef} className="hscroll-outer" id="hscroll-section">
            {/* ✅ Render placeholder with proper height until visible */}
            <div style={{ minHeight: isVisible ? 'auto' : '500vh' }}>
                {isVisible && (
                    <div ref={stickyRef} className="hscroll-sticky">
                        <div ref={headerRef} className="hscroll-header">
                            — Scroll to explore
                        </div>

                        <div ref={trackRef} className="hscroll-track">
                            {CARDS_DATA.map((card, i) => (
                                <div
                                    key={card.index}
                                    ref={(el) => (cardRefs.current[i] = el)}
                                    className="hscroll-card"
                                    onMouseMove={(e) => handleCardMouseMove(e, i)}
                                    onMouseLeave={() => handleCardMouseLeave(i)}
                                >
                                    <div
                                        className="hscroll-card__glow"
                                        style={{ background: card.color }}
                                        aria-hidden="true"
                                    />

                                    <div>
                                        <div
                                            className="hscroll-card__line"
                                            style={{ background: card.color }}
                                            aria-hidden="true"
                                        />
                                        <div className="hscroll-card__index">{card.index}</div>
                                    </div>

                                    <h3
                                        className="hscroll-card__title"
                                        style={{ color: card.color }}
                                    >
                                        {card.title.split('\n').map((line, idx) => (
                                            <span key={idx}>
                                                {line}
                                                {idx === 0 && <br />}
                                            </span>
                                        ))}
                                    </h3>

                                    <p className="hscroll-card__desc">{card.desc}</p>

                                    <div className="hscroll-card__footer">
                                        <span
                                            className="hscroll-card__tag"
                                            style={{
                                                background: `${card.color}14`,
                                                border: `1px solid ${card.color}33`,
                                                color: card.color,
                                            }}
                                        >
                                            {card.tag}
                                        </span>
                                        <div className="hscroll-card__arrow">→</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default HorizontalCards;