import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Counters.css';

gsap.registerPlugin(ScrollTrigger);

const COUNTER_DATA = [
    { target: 12, suffix: '+', label: 'Projects shipped' },
    { target: 98, suffix: '', label: 'Perf. score' },
    { target: 60, suffix: '', label: 'FPS guaranteed' },
    { target: 5, suffix: '', label: 'Core libraries' },
];

const Counters = () => {
    const sectionRef = useRef(null);
    const counterRefs = useRef([]);
    const [isVisible, setIsVisible] = useState(false);

    // ✅ Only initialize when section is near viewport
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);
                    observer.disconnect();
                }
            },
            { rootMargin: '200px' }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (!isVisible) return;

        const ctx = gsap.context(() => {
            counterRefs.current.forEach((el, i) => {
                if (!el) return;

                const numEl = el.querySelector('.counter-item__number');
                const data = COUNTER_DATA[i];
                const obj = { val: 0 };

                ScrollTrigger.create({
                    trigger: el,
                    start: 'top 84%',
                    once: true,
                    onEnter: () => {
                        gsap.to(el, {
                            opacity: 1,
                            y: 0,
                            duration: 0.75,
                            ease: 'power3.out',
                            delay: i * 0.11,
                        });

                        gsap.to(obj, {
                            val: data.target,
                            duration: 2,
                            ease: 'power2.out',
                            delay: i * 0.11,
                            onUpdate: () => {
                                numEl.textContent = Math.round(obj.val) + data.suffix;
                            },
                        });
                    },
                });
            });
        }, sectionRef);

        return () => ctx.revert();
    }, [isVisible]);

    return (
        <section ref={sectionRef} className="counters" id="counters-section">
            {isVisible && COUNTER_DATA.map((item, index) => (
                <div
                    key={item.label}
                    ref={(el) => (counterRefs.current[index] = el)}
                    className="counter-item"
                >
                    <div className="counter-item__number" data-target={item.target}>
                        0
                    </div>
                    <div className="counter-item__label">{item.label}</div>
                </div>
            ))}
        </section>
    );
};

export default Counters;