import { useEffect, useRef } from 'react';
import LocomotiveScroll from 'locomotive-scroll';
import 'locomotive-scroll/dist/locomotive-scroll.css';

const ScrollWrapper = ({ children }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (!scrollRef.current) return;

        const scroll = new LocomotiveScroll({
            el: scrollRef.current,
            smooth: true,
            lerp: 0.1, // Linear interpolation - lower is smoother/slower
            multiplier: 1, // Scroll speed
            class: 'is-revealed', // CSS class added to elements when in view
        });

        return () => {
            if (scroll) scroll.destroy();
        };
    }, []);

    return (
        <div data-scroll-container ref={scrollRef}>
            {children}
        </div>
    );
};

export default ScrollWrapper;
