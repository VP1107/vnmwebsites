import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
// Note: MorphSVGPlugin is a paid Club GSAP plugin.
// If it is not present, we use the fallback logic.
let MorphSVGPlugin;
try {
    // MorphSVGPlugin = require('gsap/MorphSVGPlugin'); 
} catch (e) {
    console.warn("GSAP MorphSVGPlugin not found.");
}
if (typeof window !== 'undefined' && window.gsap && window.gsap.plugins && window.gsap.plugins.MorphSVGPlugin) {
    gsap.registerPlugin(window.gsap.plugins.MorphSVGPlugin);
}
const MorphingLogo = ({ isLoaded }) => {
    const logoRef = useRef(null);
    const pathRef = useRef(null);
    useEffect(() => {
        if (!isLoaded) return;
        const tl = gsap.timeline({ delay: 1 });
        const hasMorph = gsap.plugins && gsap.plugins.MorphSVGPlugin;
        // Continuous glow pulse - we store verification to kill it later if needed, 
        // but fading out the container handles it.
        const glowTween = gsap.to(pathRef.current, {
            filter: 'drop-shadow(0 0 20px #00ff88) drop-shadow(0 0 40px #00ff88)',
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: 'sine.inOut'
        });
        if (hasMorph) {
                // Instead of morphing to letters, we fade out while the REAL text appears
            tl.to(logoRef.current, {
                opacity: 0,
                duration: 1.5, // Gradual fade matching text reveal
                ease: 'power1.out',
                onComplete: () => {
                    if (logoRef.current) logoRef.current.style.display = 'none';
                    glowTween.kill();
                }
            }, "+=0.2"); // Slight overlap
        } else {
                tl.to(logoRef.current, {
                    scale: 1, // Stay same size (don't move out)
                    y: 0,     // Stay centered
                    opacity: 0,
                    duration: 1.5, // Gradual fade
                    ease: 'power1.inOut',
                    onComplete: () => {
                        if (logoRef.current) logoRef.current.style.display = 'none';
                        glowTween.kill();
                    }
                });
        }
    }, [isLoaded]);
    return (
        <div
            ref={logoRef}
            style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                zIndex: 3,
                pointerEvents: 'none',
                mixBlendMode: 'screen'
            }}
        >
            <svg width="400" height="400" viewBox="0 0 400 400">
                <defs>
                    <path id="shape-square" d="M100,100 L300,100 L300,300 L100,300 Z" style={{ display: 'none' }} />
                    <path id="shape-hexagon" d="M200,60 L300,130 L300,270 L200,340 L100,270 L100,130 Z" style={{ display: 'none' }} />
                    <path id="shape-vm-letters" d="M120,100 L160,250 L200,100 M250,100 L280,200 L310,100 M280,200 L280,250" style={{ display: 'none' }} />
                </defs>
                <path
                    ref={pathRef}
                    d="M200,50 A150,150 0 1,1 200,350 A150,150 0 1,1 200,50"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00ff88" />
                        <stop offset="50%" stopColor="#00d4ff" />
                        <stop offset="100%" stopColor="#ff0080" />
                    </linearGradient>
                </defs>
            </svg>
        </div>
    );
};
export default MorphingLogo;
