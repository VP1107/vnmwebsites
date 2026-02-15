import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const GlitchOverlay = () => {
    const overlayRef = useRef(null);

    useEffect(() => {
        // Random glitch flashes
        const glitchInterval = setInterval(() => {
            if (Math.random() > 0.95) { // 5% chance every 100ms
                gsap.timeline()
                    .to(overlayRef.current, {
                        opacity: 0.3,
                        duration: 0.05,
                        ease: 'none'
                    })
                    .to(overlayRef.current, {
                        opacity: 0,
                        duration: 0.05,
                        ease: 'none'
                    });
            }
        }, 100);

        return () => clearInterval(glitchInterval);
    }, []);

    return (
        <div
            ref={overlayRef}
            style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: `
          repeating-linear-gradient(
            0deg,
            rgba(0, 255, 136, 0.1) 0px,
            transparent 2px,
            transparent 4px
          )
        `,
                opacity: 0,
                pointerEvents: 'none',
                zIndex: 5,
                mixBlendMode: 'screen'
            }}
        />
    );
};

export default GlitchOverlay;
