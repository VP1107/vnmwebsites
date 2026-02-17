import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionIntro from './SectionIntro';
import ServiceCard from './ServiceCard';
import PricingTeaser from './PricingTeaser';
import './WhatWeDo.css';

gsap.registerPlugin(ScrollTrigger);

const services = [
    {
        id: 1,
        title: 'BRANDS',
        subtitle: 'Logo • Identity • Motion',
        videoSrc: `${import.meta.env.BASE_URL}videos/intro.webm`,
        description: 'Visual identities that stick in minds',
        color: '#38bdf8'
    },
    {
        id: 2,
        title: 'BUSINESS',
        subtitle: 'E-commerce • Restaurants • Local Shops',
        videoSrc: `${import.meta.env.BASE_URL}videos/FinalCTA.webm`,
        description: 'Websites that drive sales',
        color: '#00d4ff'
    },
    {
        id: 3,
        title: 'PORTFOLIOS',
        subtitle: 'Creative • Professional • Personal',
        videoSrc: `${import.meta.env.BASE_URL}videos/design-process.webm`,
        description: 'Showcase your work beautifully',
        color: '#0ea5e9'
    }
];

const WhatWeDo = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        // BUG FIX #20: 200ms may not be enough for all ServiceCard ScrollTriggers
        // to register, especially on slower devices or when videos affect layout.
        // Use ScrollTrigger.refresh() inside a requestAnimationFrame to ensure
        // the browser has completed a full paint cycle before recalculating.
        // Also call it again after fonts/images load if needed.
        const raf = requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

        // BUG FIX #21: On window resize, pin positions become stale.
        // ScrollTrigger handles most of this internally, but with multiple
        // pins it's safer to explicitly refresh on resize (debounced).
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => {
                ScrollTrigger.refresh();
            }, 200);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(raf);
            clearTimeout(resizeTimer);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <section
            ref={sectionRef}
            className="what-we-do-section"
            id="what-we-do-section"
            style={{
                background: '#000',
                position: 'relative',
                paddingTop: '100px'
            }}
        >
            <SectionIntro />

            {services.map((service, index) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                />
            ))}

            <PricingTeaser />
        </section>
    );
};

export default WhatWeDo;