import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedBackground = () => {
    const bgRef = useRef(null);

    useEffect(() => {
        if (!bgRef.current) return;

        // ✅ Store tween reference for cleanup
        const tween = gsap.to(bgRef.current, {
            backgroundPosition: '400% 400%',
            duration: 20,
            ease: 'none',
            repeat: -1,
            yoyo: true
        });

        // ✅ Proper cleanup
        return () => tween.kill();
    }, []);

    return (
        <div
            ref={bgRef}
            className="animated-bg"
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
                    linear-gradient(
                        135deg,
                        #000000 0%,
                        #38bdf8 25%,
                        #00d4ff 50%,
                        #007bff 75%,
                        #000000 100%
                    )
                `,
                backgroundSize: '400% 400%',
                opacity: 0.15,
                filter: 'blur(100px)',
                zIndex: 1,
                willChange: 'background-position' // ✅ GPU hint
            }}
        />
    );
};

export default AnimatedBackground;