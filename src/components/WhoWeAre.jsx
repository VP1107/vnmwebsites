import { useEffect, useRef } from 'react';
import { animate3DCharReveal } from '../animations/textEffects';
import { throttle } from '../utils/throttle';
import './WhoWeAre.css';

const WhoWeAre = () => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const textRef = useRef(null);
    const isAnimated = useRef(false);

    // Text reveal animation
    useEffect(() => {
        // We'll trigger this with IntersectionObserver or Locomotive Scroll event later if needed,
        // but for now let's rely on data-scroll-class or simple timeout since it's pinned.

        // Simple entrance animation
        const timer = setTimeout(() => {
            if (textRef.current) animate3DCharReveal(textRef.current, 50);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return (
        <section
            className="who-we-are-container"
            ref={sectionRef}
            data-scroll-section
        // data-scroll-section defines a scrollable section
        >
            <div
                className="who-we-are-sticky"
                data-scroll
                data-scroll-sticky
                data-scroll-target="#who-we-are-target"
                style={{ height: '100vh', overflow: 'hidden', position: 'relative' }}
            >
                {/* Video Background */}
                <video
                    ref={videoRef}
                    className="who-we-are-video"
                    muted
                    playsInline
                    preload="auto"
                    role="presentation"
                    aria-hidden="true"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                >
                    <source src="/videos/coding-montage.mp4" type="video/mp4" />
                </video>

                {/* Video Placeholder (Visible if video fails or is missing) */}
                <div className="media-placeholder-overlay" style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'rgba(0,0,0,0.7)',
                    border: '1px dashed #0f0',
                    color: '#0f0',
                    padding: '10px',
                    fontFamily: 'monospace',
                    fontSize: '12px',
                    pointerEvents: 'none',
                    zIndex: 10
                }}>
                    [VIDEO: coding-montage.mp4]
                </div>

                {/* Fallback gradient */}
                <div className="video-fallback" aria-hidden="true"></div>

                {/* Content Overlay */}
                <div className="who-we-are-content">
                    <h2 ref={textRef} className="who-we-are-text" data-scroll data-scroll-speed="2">
                        Vatsal & Mann — First-year students. Unlimited ambition.
                    </h2>
                </div>
            </div>

            {/* Invisible target for the sticky element to leverage */}
            <div id="who-we-are-target" style={{ height: '300vh', position: 'absolute', top: 0, left: 0, width: '100%', pointerEvents: 'none' }}></div>
        </section>
    );
};

export default WhoWeAre;
