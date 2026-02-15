import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const AnimatedBackground = () => {
    const bgRef = useRef(null);

    useEffect(() => {
        // Animate gradient position continuously
        gsap.to(bgRef.current, {
            backgroundPosition: '400% 400%',
            duration: 20,
            ease: 'none',
            repeat: -1,
            yoyo: true
        });
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
            #00ff88 25%,
            #00d4ff 50%,
            #ff0080 75%,
            #000000 100%
          )
        `,
                backgroundSize: '400% 400%',
                opacity: 0.15,
                filter: 'blur(100px)',
                zIndex: 1
            }}
        />
    );
};

export default AnimatedBackground;
