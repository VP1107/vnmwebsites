import { useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SectionIntro from './WhatWeDo/SectionIntro';
import ServiceCard from './WhatWeDo/ServiceCard';
import PricingTeaser from './WhatWeDo/PricingTeaser';

gsap.registerPlugin(ScrollTrigger);

const WhatWeDo = () => {
    const sectionRef = useRef(null);

    const services = [
        {
            id: 1,
            title: 'BRANDS',
            subtitle: 'Logo • Identity • Motion',
            videoSrc: `${import.meta.env.BASE_URL}videos/intro.webm`, // Optimized WebM
            description: 'Visual identities that stick in minds',
            color: '#38bdf8'
        },
        {
            id: 2,
            title: 'BUSINESS',
            subtitle: 'E-commerce • Restaurants • Local Shops',
            videoSrc: `${import.meta.env.BASE_URL}videos/FinalCTA.webm`, // Optimized WebM
            description: 'Websites that drive sales',
            color: '#00d4ff'
        },
        {
            id: 3,
            title: 'PORTFOLIOS',
            subtitle: 'Creative • Professional • Personal',
            videoSrc: `${import.meta.env.BASE_URL}videos/design-process.webm`, // Optimized WebM
            description: 'Showcase your work beautifully',
            color: '#0ea5e9'
        }
    ];

    return (
        <section
            ref={sectionRef}
            className="what-we-do-section"
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
