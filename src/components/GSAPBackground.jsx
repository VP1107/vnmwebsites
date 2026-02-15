import { useEffect, useRef } from 'react';
import gsap from 'gsap';

const GSAPBackground = () => {
    const containerRef = useRef(null);
    const blobRefs = useRef([]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Animate blobs moving around
            blobRefs.current.forEach((blob, i) => {
                if (!blob) return;

                // Randomize start positions
                gsap.set(blob, {
                    x: Math.random() * window.innerWidth,
                    y: Math.random() * window.innerHeight,
                    scale: gsap.utils.random(0.8, 1.2),
                });

                // Create a continuous wandering motion
                gsap.to(blob, {
                    duration: gsap.utils.random(10, 20),
                    x: `random(0, ${window.innerWidth})`,
                    y: `random(0, ${window.innerHeight})`,
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true,
                    modifiers: {
                        x: x => `${parseFloat(x)}px`,
                        y: y => `${parseFloat(y)}px`
                    }
                });

                // Pulse scale
                gsap.to(blob, {
                    duration: gsap.utils.random(4, 8),
                    scale: gsap.utils.random(1, 1.5),
                    ease: "sine.inOut",
                    repeat: -1,
                    yoyo: true
                });
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    const blobs = [
        { color: '#5b21b6', size: '40vw', opacity: 0.4 }, // Violet
        { color: '#7c3aed', size: '35vw', opacity: 0.3 }, // Purple
        { color: '#4c1d95', size: '45vw', opacity: 0.3 }, // Dark Violet
    ];

    return (
        <div ref={containerRef} className="fixed inset-0 w-full h-full overflow-hidden -z-10 bg-black">
            <div className="absolute inset-0 bg-black opacity-90 z-0"></div>
            {blobs.map((blob, i) => (
                <div
                    key={i}
                    ref={el => blobRefs.current[i] = el}
                    className="absolute rounded-full mix-blend-screen filter blur-[80px]"
                    style={{
                        backgroundColor: blob.color,
                        width: blob.size,
                        height: blob.size,
                        opacity: blob.opacity,
                        top: '-20%',
                        left: '-20%',
                    }}
                />
            ))}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10"></div>
        </div>
    );
};

export default GSAPBackground;
