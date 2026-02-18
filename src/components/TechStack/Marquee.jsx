import './Marquee.css';

const MARQUEE_ROW_1 = [
    'GSAP', 'ScrollTrigger', 'Lenis', 'React', 'CSS',
    'TypeScript', 'Next.js', 'Tailwind'
];

const MARQUEE_ROW_2 = [
    'Animation', 'Performance', '60 FPS', 'Smooth Scroll',
    'Scroll-Driven', 'Pinning', 'Stagger', 'Scrub'
];

const Marquee = () => {
    return (
        <div className="marquee-wrapper">
            {/* Row 1 - Forward */}
            <div className="marquee-section">
                <div className="marquee-track">
                    {[...MARQUEE_ROW_1, ...MARQUEE_ROW_1].map((item, i) => (
                        <div
                            key={`m1-${i}`}
                            className={`marquee-item${i % 2 === 1 ? ' accent' : ''}`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>

            {/* Row 2 - Reverse */}
            <div className="marquee-section">
                <div className="marquee-track marquee-track--reverse">
                    {[...MARQUEE_ROW_2, ...MARQUEE_ROW_2].map((item, i) => (
                        <div
                            key={`m2-${i}`}
                            className={`marquee-item${i % 2 === 1 ? ' accent' : ''}`}
                        >
                            {item}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Marquee;
