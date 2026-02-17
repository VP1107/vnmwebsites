import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GSAPBackground = () => {
    const containerRef = useRef(null);
    const blobRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            const W = window.innerWidth;
            const H = window.innerHeight;

            blobRefs.current.forEach((blob, i) => {
                if (!blob) return;

                // Randomize start positions
                gsap.set(blob, {
                    x: Math.random() * W,
                    y: Math.random() * H,
                    scale: gsap.utils.random(0.8, 1.2),
                });

                // ✅ FIX: Combine position + scale in ONE tween to avoid conflict
                gsap.to(blob, {
                    duration: gsap.utils.random(10, 20),
                    x: `random(0, ${W})`,
                    y: `random(0, ${H})`,
                    scale: gsap.utils.random(1, 1.5),
                    ease: 'sine.inOut',
                    repeat: -1,
                    yoyo: true,
                    repeatRefresh: true // ✅ Picks new random values each repeat
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const blobs = [
        { color: '#5b21b6', size: '40vw', opacity: 0.4 },
        { color: '#7c3aed', size: '35vw', opacity: 0.3 },
        { color: '#4c1d95', size: '45vw', opacity: 0.3 },
    ];

    return (
        // ✅ FIX: Replaced Tailwind classes with inline styles
        <div
            ref={containerRef}
            style={{
                position: 'fixed',
                inset: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: -10,
                background: '#000'
            }}
        >
            {/* Dark overlay */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: '#000',
                opacity: 0.9,
                zIndex: 0
            }} />

            {/* Blobs */}
            {blobs.map((blob, i) => (
                <div
                    key={i}
                    ref={el => blobRefs.current[i] = el}
                    style={{
                        position: 'absolute',
                        borderRadius: '50%',
                        mixBlendMode: 'screen',
                        filter: 'blur(80px)',
                        backgroundColor: blob.color,
                        width: blob.size,
                        height: blob.size,
                        opacity: blob.opacity,
                        top: '-20%',
                        left: '-20%',
                        willChange: 'transform' // ✅ GPU hint
                    }}
                />
            ))}

            {/* Bottom gradient fade */}
            <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.8))',
                zIndex: 10,
                pointerEvents: 'none'
            }} />
        </div>
    );
};

export default GSAPBackground;