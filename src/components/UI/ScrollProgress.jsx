import { useRef, useEffect } from 'react';
import { gsap} from '../../gsap-config';
import './ScrollProgress.css';

const ScrollProgress = () => {
    const progressRef = useRef(null);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.to(progressRef.current, {
                scaleX: 1,
                ease: 'none',
                scrollTrigger: {
                    trigger: document.body,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: 0.1,
                }
            });
        });

        return () => ctx.revert();
    }, []);

    return (
        <div className="scroll-progress-container" aria-hidden="true">
            <div ref={progressRef} className="scroll-progress-bar" />
        </div>
    );
};

export default ScrollProgress;
