import { useState, useEffect, useRef } from 'react';
import { gsap} from '../../gsap-config';
import './Navigation.css';

const Navigation = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const menuRef = useRef(null);
    const buttonRef = useRef(null);
    const tweensRef = useRef([]); // ✅ Track all tweens for cleanup

    // ✅ FIX: Passive scroll listener
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // ✅ FIX: Entrance animation with cleanup
    useEffect(() => {
        if (!buttonRef.current) return;

        const tween = gsap.fromTo(buttonRef.current,
            { y: -50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, delay: 4, ease: 'power3.out' }
            // ✅ delay: 4 - waits for preloader (2.5s) + hero start (1s) + buffer
        );

        tweensRef.current.push(tween);

        return () => tween.kill();
    }, []);

    // ✅ FIX: Scoped nav-link selection + cleanup
    useEffect(() => {
        if (!menuRef.current) return;

        let openTween, linkTween, closeTween;

        if (isOpen) {
            openTween = gsap.to(menuRef.current, {
                opacity: 1,
                visibility: 'visible',
                pointerEvents: 'all',
                duration: 0.5,
                ease: 'power3.out'
            });

            // ✅ FIX: Scope to menuRef instead of global .nav-link
            const links = menuRef.current.querySelectorAll('.nav-link');
            linkTween = gsap.fromTo(links,
                { y: 20, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.4, stagger: 0.1, delay: 0.2, ease: 'power2.out' }
            );
        } else {
            closeTween = gsap.to(menuRef.current, {
                opacity: 0,
                visibility: 'hidden',
                pointerEvents: 'none',
                duration: 0.4,
                ease: 'power3.in'
            });
        }

        return () => {
            openTween?.kill();
            linkTween?.kill();
            closeTween?.kill();
        };
    }, [isOpen]);

    const toggleMenu = () => setIsOpen(prev => !prev);

    // ✅ FIX: Use Lenis-compatible scroll (no GSAP ScrollToPlugin)
    const handleScrollTo = (e, targetId) => {
        e.preventDefault();
        setIsOpen(false);

        setTimeout(() => {
            if (targetId === 'top') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const target = document.querySelector(targetId);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }, 300);
    };

    return (
        <>
            <button
                ref={buttonRef}
                className={`nav-toggle ${isOpen ? 'active' : ''} ${isScrolled ? 'scrolled' : ''}`}
                onClick={toggleMenu}
                aria-label="Toggle navigation"
                style={{ opacity: 0 }} // ✅ Start hidden, GSAP reveals it
            >
                <div className="hamburger">
                    <span></span>
                    <span></span>
                </div>
            </button>

            <nav
                className="navigation-overlay"
                ref={menuRef}
                style={{ opacity: 0, visibility: 'hidden' }} // ✅ Start hidden
            >
                <div className="nav-content">
                    <ul className="nav-list">
                        <li><a className="nav-link" href="#" onClick={(e) => handleScrollTo(e, 'top')}>Home</a></li>
                        <li><a className="nav-link" href="#about-section" onClick={(e) => handleScrollTo(e, '#about-section')}>About</a></li>
                        <li><a className="nav-link" href="#work-section" onClick={(e) => handleScrollTo(e, '#work-section')}>Work</a></li>
                        <li><a className="nav-link" href="#what-we-do-section" onClick={(e) => handleScrollTo(e, '#what-we-do-section')}>Services</a></li>
                        <li><a className="nav-link" href="#contact-section" onClick={(e) => handleScrollTo(e, '#contact-section')}>Contact</a></li>
                    </ul>
                </div>
                <div className="nav-backdrop"></div>
            </nav>
        </>
    );
};

export default Navigation;