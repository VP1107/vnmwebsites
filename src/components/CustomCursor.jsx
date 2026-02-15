import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        // Check for touch device
        if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
            if (cursor) cursor.style.display = 'none';
            if (follower) follower.style.display = 'none';
            return;
        }

        const moveCursor = (e) => {
            // Main cursor (instant)
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0
            });

            // Follower (delayed, elastic)
            gsap.to(follower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.8,
                ease: 'power3.out'
            });
        };

        window.addEventListener('mousemove', moveCursor);

        // Hover states for interactive elements
        const handleMouseEnter = () => {
            gsap.to([cursor, follower], {
                scale: 2,
                backgroundColor: '#00ff88',
                duration: 0.3
            });
        };

        const handleMouseLeave = () => {
            gsap.to([cursor, follower], {
                scale: 1,
                backgroundColor: '#ffffff',
                duration: 0.3
            });
        };

        // Attach listeners to buttons and links safely
        const interactives = document.querySelectorAll('button, a');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', handleMouseEnter);
            el.addEventListener('mouseleave', handleMouseLeave);
        });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', handleMouseEnter);
                el.removeEventListener('mouseleave', handleMouseLeave);
            });
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                style={{
                    position: 'fixed',
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9999,
                    transform: 'translate(-50%, -50%)',
                    mixBlendMode: 'difference',
                    top: 0,
                    left: 0
                }}
            />
            <div
                ref={followerRef}
                style={{
                    position: 'fixed',
                    width: '40px',
                    height: '40px',
                    border: '2px solid #ffffff',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    transform: 'translate(-50%, -50%)',
                    opacity: 0.5,
                    top: 0,
                    left: 0
                }}
            />
        </>
    );
};

export default CustomCursor;
