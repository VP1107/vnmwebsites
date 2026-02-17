import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { animate3DCharReveal } from '../../animations/textEffects';
import './WhoWeAre.css';

gsap.registerPlugin(ScrollTrigger);

const WhoWeAre = () => {
    const sectionRef = useRef(null);
    const videoRef = useRef(null);
    const textRef = useRef(null);

    // ✅ Lazy load video with IntersectionObserver
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    // ✅ Only load video when near viewport
                    video.preload = 'auto';
                    video.load();
                    video.play().catch(() => {});
                    observer.disconnect();
                }
            },
            { rootMargin: '300px' }
        );

        observer.observe(sectionRef.current);

        return () => observer.disconnect();
    }, []);

    // ✅ Text animation with ScrollTrigger (replaces Locomotive Scroll)
    useEffect(() => {
        if (!textRef.current || !sectionRef.current) return;

        const ctx = gsap.context(() => {
            // Pin section while animating
            ScrollTrigger.create({
                trigger: sectionRef.current,
                start: 'top top',
                end: '+=150%',
                pin: true,
                pinSpacing: true,
                onEnter: () => {
                    // ✅ Trigger text animation when section enters
                    if (textRef.current) {
                        animate3DCharReveal(textRef.current, 50);
                    }
                }
            });

            // ✅ Text parallax effect
            gsap.to(textRef.current, {
                y: -100,
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: '+=150%',
                    scrub: 1
                }
            });
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            className="who-we-are-container"
            ref={sectionRef}
            // ✅ REMOVED: All Locomotive Scroll data attributes
        >
            <div
                className="who-we-are-sticky"
                style={{
                    height: '100vh',
                    overflow: 'hidden',
                    position: 'relative'
                }}
            >
                {/* Video Background */}
                <video
                    ref={videoRef}
                    className="who-we-are-video"
                    muted
                    loop
                    playsInline
                    preload="none" // ✅ FIXED: Don't preload until near viewport
                    role="presentation"
                    aria-hidden="true"
                    style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                    }}
                >
                    <source
                        src={`${import.meta.env.BASE_URL}videos/intro.mp4`}
                        type="video/mp4"
                    />
                </video>

                {/* ✅ REMOVED: Debug placeholder overlay */}

                {/* Fallback gradient */}
                <div className="video-fallback" aria-hidden="true" />

                {/* Content Overlay */}
                <div className="who-we-are-content">
                    <h2
                        ref={textRef}
                        className="who-we-are-text"
                        // ✅ REMOVED: data-scroll attributes
                    >
                        Vatsal & Mann — First-year students. Unlimited ambition.
                    </h2>
                </div>
            </div>
        </section>
    );
};

export default WhoWeAre;