// Logo.jsx (FIXED)
// ✅ Removed unused React import
import './Logo.css';

const Logo = ({ className, style, onClick }) => {
    // ✅ FIX: Handle click to scroll to top instead of href="#"
    const handleClick = (e) => {
        e.preventDefault();
        if (onClick) {
            onClick();
        } else {
            // Scroll to top smoothly (Lenis compatible)
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    return (
        <a
            href="/"
            className={`logo-essential ${className || ''}`}
            style={style}
            onClick={handleClick}
            aria-label="V&M Creations - Go to top" // ✅ Accessibility
        >
            <span className="vm">V&M</span>
            <span className="creations">CREATIONS</span>
        </a>
    );
};

export default Logo;