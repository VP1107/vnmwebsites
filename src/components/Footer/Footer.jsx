import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Logo from '../UI/Logo';
import './Footer.css';

const Footer = () => {
    const footerRef = useRef(null);
    const isAnimated = useRef(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isAnimated.current) {
                        // Float up animation
                        const elements = footerRef.current.querySelectorAll('.footer-item');

                        gsap.fromTo(elements,
                            { y: 50, opacity: 0 },
                            {
                                y: 0,
                                opacity: 1,
                                stagger: 0.15,
                                duration: 0.8,
                                ease: 'power2.out',
                            }
                        );

                        isAnimated.current = true;
                    }
                });
            },
            { threshold: 0.3 }
        );

        if (footerRef.current) {
            observer.observe(footerRef.current);
        }

        return () => observer.disconnect();
    }, []);

    const handleIconHover = (e) => {
        gsap.to(e.currentTarget, {
            y: -10,
            scale: 1.2,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    const handleIconLeave = (e) => {
        gsap.to(e.currentTarget, {
            y: 0,
            scale: 1,
            duration: 0.3,
            ease: 'power2.out',
        });
    };

    return (
        <footer className="footer" ref={footerRef}>
            <div className="footer-content">
                <div className="footer-item footer-brand">
                    <Logo />
                    <p className="footer-tagline">Built with passion. Powered by coffee.</p>
                </div>

                <div className="footer-item footer-social">
                    <a
                        href="https://instagram.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon interactive"
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                        aria-label="Instagram"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                        </svg>
                    </a>

                    <a
                        href="https://linkedin.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon interactive"
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                        aria-label="LinkedIn"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                            <rect x="2" y="9" width="4" height="12" />
                            <circle cx="4" cy="4" r="2" />
                        </svg>
                    </a>

                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-icon interactive"
                        onMouseEnter={handleIconHover}
                        onMouseLeave={handleIconLeave}
                        aria-label="GitHub"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
                        </svg>
                    </a>
                </div>

                <div className="footer-item footer-copyright">
                    <p>© 2026 — Made in India 🇮🇳</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
