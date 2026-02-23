import { useRef, useEffect } from 'react';
import { gsap, ScrollTrigger } from '../../gsap-config';
import './ScrollProgress.css';

const ScrollProgress = () => {
    const progressRef = useRef(null);

    useEffect(() => {
        if (!progressRef.current) return;

        // BUG FIX 1: document.body vs document.documentElement
        // document.body does not always equal the full scrollable height —
        // especially when GSAP pin spacers are present. documentElement
        // (i.e. <html>) is the actual scroll container in all browsers.
        //
        // BUG FIX 2: pinSpacing inflation
        // GSAP's pin:true inserts spacer divs which inflate the DOM height.
        // These spacers are NOT at the visual bottom — they sit next to each
        // pinned section. So 'bottom bottom' of the body fires before the user
        // reaches the footer.
        //
        // The correct fix is to anchor the progress bar end to the LAST
        // element on the page (the footer, or a dedicated end marker) rather
        // than the body bottom. This way pin spacers don't affect the calculation.
        //
        // We also set refreshPriority: -1 so this ScrollTrigger recalculates
        // AFTER all pinned sections have been measured, ensuring correct total
        // scroll distance.

        const mm = gsap.matchMedia();

        mm.add('(min-width: 0px)', () => {
            // Find the last meaningful element on the page to use as end anchor.
            // Try footer first, fall back to the last section, then documentElement.
            const endTarget =
                document.querySelector('footer') ||
                document.querySelector('section:last-of-type') ||
                document.documentElement;

            const st = ScrollTrigger.create({
                trigger:         document.documentElement,
                start:           'top top',
                end:             () => {
                    // Calculate end as the bottom of the last element relative
                    // to the document, not including overflow from pin spacers.
                    // Using a function lets ScrollTrigger re-evaluate on refresh.
                    const footer = document.querySelector('footer') ||
                                   document.querySelector('section:last-of-type');
                    if (footer) {
                        const rect = footer.getBoundingClientRect();
                        const scrollTop = window.scrollY || document.documentElement.scrollTop;
                        return `+=${scrollTop + rect.bottom - window.innerHeight}`;
                    }
                    // Fallback: full document scroll height
                    return `+=${document.documentElement.scrollHeight - window.innerHeight}`;
                },
                scrub:             0.1,
                refreshPriority:  -1,   // recalculate AFTER pinned sections
                invalidateOnRefresh: true,
                onUpdate: (self) => {
                    if (progressRef.current) {
                        gsap.set(progressRef.current, { scaleX: self.progress });
                    }
                },
            });

            return () => st.kill();
        });

        return () => mm.revert();
    }, []);

    return (
        <div className="scroll-progress-container" aria-hidden="true">
            <div ref={progressRef} className="scroll-progress-bar" />
        </div>
    );
};

export default ScrollProgress;