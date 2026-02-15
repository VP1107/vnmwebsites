import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import VideoIntro from './VideoIntro';
import SplitPhotos from './SplitPhotos';
import DesignVideo from './DesignVideo';
import PhotoGrid from './PhotoGrid';
import FinalCTA from './FinalCTA';

gsap.registerPlugin(ScrollTrigger);

const AboutSection = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        // We rely on the global ScrollTrigger setup, but we can add specific section logic here if needed.
        const ctx = gsap.context(() => {
            // Any section-global animations
        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section
            ref={sectionRef}
            className="about-section"
            style={{
                position: 'relative',
                background: '#000000',
                zIndex: 10 // Ensure it sits above subsequent sections if needed
            }}
        >
            <VideoIntro />
            <SplitPhotos />
            <DesignVideo />
            <PhotoGrid />
            <FinalCTA />
        </section>
    );
};

export default AboutSection;
