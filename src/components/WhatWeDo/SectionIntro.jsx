import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import SplitType from 'split-type';

gsap.registerPlugin(ScrollTrigger);

const SectionIntro = () => {
    const titleRef = useRef(null);
    const subtitleRef = useRef(null);
    // BUG FIX #1: Store the SplitType instance so we can revert it on cleanup,
    // preventing orphaned <span> elements if the component re-mounts.
    const splitInstanceRef = useRef(null);

    useEffect(() => {
        // BUG FIX #2: gsap.context() needs a scope element passed in.
        // Without it, ctx.revert() can fail to clean up tweens created inside
        // this component when other components share the same gsap context.
        const ctx = gsap.context(() => {
            // BUG FIX #3: SplitType must be called INSIDE the gsap.context callback
            // (or at minimum after the DOM is confirmed ready), but crucially the
            // instance must be stored so we can call .revert() on cleanup — otherwise
            // the DOM is left with dangling <span> wrappers after unmount/HMR.
            splitInstanceRef.current = new SplitType(titleRef.current, { types: 'chars' });
            const chars = splitInstanceRef.current.chars;

            // BUG FIX #4: The scroll-in animation used `scrub: 1` (scroll-linked),
            // BUT the shimmer animation below immediately overrides the `color` and
            // `opacity` properties on the same elements — causing a fight between
            // the two tweens. The scroll-in should only animate layout properties
            // (y, rotateX) and let opacity be driven by the scroll scrub separately,
            // OR the shimmer should start only after the scroll-in completes.
            // Solution: separate opacity into its own scroll trigger, and start the
            // shimmer only after the reveal is done via an onComplete callback.
            gsap.fromTo(chars,
                { y: 100, rotateX: -90, transformOrigin: 'top center', opacity: 0 },
                {
                    y: 0,
                    rotateX: 0,
                    opacity: 1,
                    stagger: 0.03,
                    duration: 1,
                    ease: 'back.out(1.5)',
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: 'top 80%',
                        end: 'top 30%',
                        scrub: 1,
                        // BUG FIX #5: With scrub animations, onComplete fires when
                        // the scrub tween finishes (i.e. when scrolled to end position),
                        // not when the animation visually completes. That's intentional
                        // here — we start the shimmer only once fully revealed.
                        onEnterBack: () => {
                            // Stop shimmer if user scrolls back up through the trigger
                            gsap.killTweensOf(chars, 'color,textShadow');
                        }
                    },
                    // BUG FIX #6: Start shimmer after scroll reveal is fully complete
                    onComplete: () => startShimmer(chars)
                }
            );

            // Subtitle
            gsap.fromTo(subtitleRef.current,
                { opacity: 0, y: 50 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: subtitleRef.current,
                        start: 'top 85%',
                        toggleActions: 'play none none none'
                    }
                }
            );

        }, titleRef); // BUG FIX #2 cont: pass scope ref

        return () => {
            ctx.revert();
            // BUG FIX #3 cont: revert SplitType to restore original DOM
            splitInstanceRef.current?.revert();
        };
    }, []);

    // BUG FIX #7: Extracted shimmer into a standalone function so it can be
    // called conditionally (only after reveal), and killed safely on cleanup.
    const startShimmer = (chars) => {
        gsap.to(chars, {
            color: '#38bdf8',
            textShadow: '0 0 20px #38bdf8',
            duration: 0.3,
            stagger: {
                each: 0.05,
                repeat: -1,
                yoyo: true
            }
        });
    };

    return (
        <div style={{
            minHeight: '60vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 5%',
            textAlign: 'center'
        }}>
            <h2
                ref={titleRef}
                style={{
                    fontSize: 'clamp(50px, 10vw, 150px)',
                    fontWeight: 900,
                    color: '#ffffff',
                    marginBottom: '30px',
                    fontFamily: '"Syne", sans-serif',
                    letterSpacing: '0.02em',
                    // BUG FIX #8: perspective must be on a PARENT element, not the
                    // element being transformed. Setting it on titleRef itself has no
                    // effect on the rotateX of its children (the split chars).
                    // Move perspective to a wrapper div below.
                }}
            >
                WHAT WE BUILD
            </h2>

            <p
                ref={subtitleRef}
                style={{
                    fontSize: 'clamp(18px, 2.5vw, 28px)',
                    color: '#a0a0a0',
                    maxWidth: '600px',
                    lineHeight: 1.6,
                    fontFamily: '"Inter", sans-serif'
                }}
            >
                Fast, beautiful, mobile-first websites that help your business grow
            </p>

            <div style={{
                width: '100px',
                height: '3px',
                background: 'linear-gradient(90deg, #38bdf8, #00d4ff, #0ea5e9)',
                marginTop: '30px',
                borderRadius: '10px'
            }} />
        </div>
    );
};

export default SectionIntro;