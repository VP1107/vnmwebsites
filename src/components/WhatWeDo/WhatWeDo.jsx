import { useRef, useEffect } from 'react';
import {ScrollTrigger } from '../../gsap-config';
import SectionIntro from './SectionIntro';
import ServiceCard from './ServiceCard';
import PricingTeaser from './PricingTeaser';
import './WhatWeDo.css';


import servicesData from '../../data/services.json';

const services = servicesData.map(service => ({
    ...service,
    videoSrc: `${import.meta.env.BASE_URL}${service.videoSrc}`
}));

const WhatWeDo = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        // Wait a full paint cycle so all ServiceCard pins register correctly
        const raf = requestAnimationFrame(() => {
            ScrollTrigger.refresh();
        });

        // Debounced resize refresh — pins become stale after resize
        let resizeTimer;
        const handleResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 200);
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
            className="wwd-section"
            id="what-we-do-section"
        >
            <SectionIntro />

            {services.map((service, index) => (
                <ServiceCard
                    key={service.id}
                    service={service}
                    index={index}
                    total={services.length}
                />
            ))}

            <PricingTeaser />
        </section>
    );
};

export default WhatWeDo;