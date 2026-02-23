import { useEffect, useRef } from 'react';
import { gsap } from '../../gsap-config';

const CustomCursor = () => {
    const cursorRef = useRef(null);
    const followerRef = useRef(null);

    useEffect(() => {
        const cursor = cursorRef.current;
        const follower = followerRef.current;

        const isStrictTouch = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && window.matchMedia('(pointer: coarse)').matches;
        if (isStrictTouch) {
            if (cursor) cursor.style.display = 'none';
            if (follower) follower.style.display = 'none';
            return;
        }

        const setCursorX = gsap.quickSetter(cursor, 'x', 'px');
        const setCursorY = gsap.quickSetter(cursor, 'y', 'px');
        const setFollowerX = gsap.quickSetter(follower, 'x', 'px');
        const setFollowerY = gsap.quickSetter(follower, 'y', 'px');

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;
        let followerX = window.innerWidth / 2;
        let followerY = window.innerHeight / 2;
        let rafId;

        let hasMoved = false;

        const moveCursor = (e) => {
            if (!hasMoved) {
                hasMoved = true;
                if (cursor) cursor.style.opacity = '1';
                if (follower) follower.style.opacity = '0.5';
            }
            mouseX = e.clientX;
            mouseY = e.clientY;

            setCursorX(mouseX);
            setCursorY(mouseY);
        };

        const followCursor = () => {
            followerX += (mouseX - followerX) * 0.12;
            followerY += (mouseY - followerY) * 0.12;

            setFollowerX(followerX);
            setFollowerY(followerY);

            rafId = requestAnimationFrame(followCursor);
        };

        // Initial opacity remains 0 until first mouse move to prevent it sitting in the center.

        followCursor();
        window.addEventListener('mousemove', moveCursor, { passive: true });

        const handleMouseEnter = (e) => {
            if (e.target.closest('button, a')) {
                gsap.to([cursor, follower], {
                    scale: 2,
                    backgroundColor: '#38bdf8',
                    duration: 0.3
                });
            }
        };

        const handleMouseLeave = (e) => {
            if (e.target.closest('button, a') && !e.relatedTarget?.closest('button, a')) {
                gsap.to([cursor], {
                    scale: 1,
                    backgroundColor: '#ffffff',
                    duration: 0.3
                });
                gsap.to([follower], {
                    scale: 1,
                    backgroundColor: 'transparent',
                    duration: 0.3
                });
            }
        };

        document.addEventListener('mouseover', handleMouseEnter, { passive: true });
        document.addEventListener('mouseout', handleMouseLeave, { passive: true });

        return () => {
            window.removeEventListener('mousemove', moveCursor);
            document.removeEventListener('mouseover', handleMouseEnter);
            document.removeEventListener('mouseout', handleMouseLeave);
            cancelAnimationFrame(rafId);
        };
    }, []);

    return (
        <>
            <div
                ref={cursorRef}
                className="custom-cursor-dot" // ✅ Added class for targeting
                style={{
                    position: 'fixed',
                    width: '10px',
                    height: '10px',
                    backgroundColor: '#ffffff',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 100003,
                    transform: 'translate(-50%, -50%)',
                    mixBlendMode: 'difference',
                    top: 0,
                    left: 0,
                    opacity: 0,
                    willChange: 'transform'
                }}
            />
            <div
                ref={followerRef}
                className="custom-cursor-ring" // ✅ Added class for targeting
                style={{
                    position: 'fixed',
                    width: '40px',
                    height: '40px',
                    border: '2px solid #ffffff',
                    borderRadius: '50%',
                    pointerEvents: 'none',
                    zIndex: 9998,
                    transform: 'translate(-50%, -50%)',
                    opacity: 0,
                    top: 0,
                    left: 0,
                    willChange: 'transform'
                }}
            />
        </>
    );
};

export default CustomCursor;