// Preloader.jsx (FIXED)
import { useEffect, useState } from 'react'; // ✅ Removed unused React import
import './Preloader.css';

const Preloader = ({ isLoading }) => {
    // ✅ FIX: Initialize based on isLoading prop
    const [shouldRender, setShouldRender] = useState(isLoading);

    useEffect(() => {
        if (!isLoading) {
            // Wait for exit animation to complete before unmounting
            const timeout = setTimeout(() => {
                setShouldRender(false);
            }, 1000);
            return () => clearTimeout(timeout);
        } else {
            setShouldRender(true);
        }
    }, [isLoading]);

    // ✅ FIX: Use Lenis-compatible scroll lock
    useEffect(() => {
        if (isLoading) {
            // ✅ Lock scroll via CSS class instead of direct style
            // This works with Lenis without conflicts
            document.documentElement.classList.add('is-loading');
        } else {
            document.documentElement.classList.remove('is-loading');
        }

        return () => {
            document.documentElement.classList.remove('is-loading');
        };
    }, [isLoading]);

    if (!shouldRender) return null;

    return (
        // ✅ Added ARIA attributes for accessibility
        <div
            className={`preloader-container ${!isLoading ? 'exit' : ''}`}
            role="status"
            aria-live="polite"
            aria-label="Loading V&M Creations"
            aria-busy={isLoading}
        >
            <div className="panel panel-left">
                <div className="text-container">
                    <span className="big-text" aria-hidden="true">V</span>
                    <span className="small-text" aria-hidden="true">CREA</span>
                </div>
            </div>
            <div className="panel panel-right">
                <div className="text-container">
                    <span className="big-text" aria-hidden="true">&M</span>
                    <span className="small-text" aria-hidden="true">TIONS</span>
                </div>
            </div>
        </div>
    );
};

export default Preloader;