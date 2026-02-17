// ScrollToTop.jsx (FIXED)
import { useState, useEffect } from 'react';
import './ScrollToTop.css';

// ✅ Removed unused gsap import entirely

const ScrollToTop = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            setIsVisible(window.scrollY > 500);
        };

        window.addEventListener('scroll', toggleVisibility, { passive: true });
        return () => window.removeEventListener('scroll', toggleVisibility);
    }, []);

    const scrollToTop = () => {
        // ✅ Works with Lenis - Lenis intercepts this
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // ✅ FIX: Keyboard handler for accessibility
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            scrollToTop();
        }
    };

    return (
        <div
            className={`scroll-to-top ${isVisible ? 'visible' : ''}`}
            onClick={scrollToTop}
            onKeyDown={handleKeyDown} // ✅ Keyboard accessible
            role="button"
            aria-label="Scroll to top"
            tabIndex={0}
        >
            <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M12 19V5M12 5L5 12M12 5L19 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    );
};

export default ScrollToTop;