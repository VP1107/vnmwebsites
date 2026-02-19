import { useRef, useEffect } from 'react';
import VideoIntro from './VideoIntro';
import SplitPhotos from './SplitPhotos';
import DesignVideo from './DesignVideo';
import FinalCTA from './FinalCTA';
import './AboutSection.css';

import { ScrollTrigger } from '../../gsap-config';

const AboutSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        // FIX: was requestAnimationFrame — too early, child useEffects may not have
        // registered their ScrollTriggers yet. 300ms gives all children time to mount.
        const t = setTimeout(() => ScrollTrigger.refresh(), 300);

        let resizeTimer;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
        };
        window.addEventListener('resize', onResize);

        return () => {
            clearTimeout(t);
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', onResize);
        };
    }, []);

    return (
        <section ref={sectionRef} id="about-section" className="about-section">
            <VideoIntro />
            <SplitPhotos />
            <DesignVideo />
            <FinalCTA />
        </section>
    );
};

export default AboutSection;