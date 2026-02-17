// App.jsx (FIXED)
import { Suspense, lazy, useState, useEffect } from 'react';
import Hero from './components/Hero/Hero';
import CustomCursor from './components/UI/CustomCursor';
import ErrorBoundary from './components/UI/ErrorBoundary';
import ScrollWrapper from './components/UI/ScrollWrapper';
import Preloader from './components/UI/Preloader';
import Navigation from './components/UI/Navigation';
import ScrollToTop from './components/UI/ScrollToTop';
import './styles/global.css';
import './styles/animations.css';

// ✅ Lazy load ALL below-fold sections
const AboutSection = lazy(() => import('./components/About/AboutSection'));
const WorkShowcase = lazy(() => import('./components/WorkShowcase/WorkShowcase'));
const WhatWeDo = lazy(() => import('./components/WhatWeDo/WhatWeDo'));
const ContactForm = lazy(() => import('./components/Contact/ContactForm'));
const Footer = lazy(() => import('./components/Footer/Footer'));

function App() {
    const [isLoading, setIsLoading] = useState(true);
    const [startHero, setStartHero] = useState(false);
    const [showSections, setShowSections] = useState(false);

    useEffect(() => {
        // Minimum 2.5s + window load
        const minTimePromise = new Promise(resolve => 
            setTimeout(resolve, 2500)
        );

        const loadPromise = new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve, { once: true }); // ✅ once: true prevents memory leak
            }
        });

        Promise.all([minTimePromise, loadPromise]).then(() => {
            setIsLoading(false);

            // ✅ Start hero animation after preloader exit animation (1s)
            setTimeout(() => setStartHero(true), 1000);

            // ✅ Load below-fold sections even later (don't compete with hero)
            setTimeout(() => setShowSections(true), 2000);
        });
    }, []);

    return (
        <div className="App">
            {/* ✅ Always render preloader */}
            <Preloader isLoading={isLoading} />

            {/* ✅ Only render UI after preloader is done */}
            {!isLoading && (
                <>
                    <CustomCursor />
                    <Navigation />
                    <ScrollToTop />
                </>
            )}

            {/* ✅ ScrollWrapper only after preloader */}
            {!isLoading && (
                <ScrollWrapper>
                    <main>
                        <ErrorBoundary>
                            {/* ✅ Hero only mounts after preloader */}
                            <Hero startAnimation={startHero} />

                            {/* ✅ Below-fold sections mount after hero is ready */}
                            {showSections && (
                                <>
                                    {/* ✅ No LoadingFallback - prevents layout shift */}
                                    <Suspense fallback={null}>
                                        <AboutSection />
                                    </Suspense>

                                    <Suspense fallback={null}>
                                        <WorkShowcase />
                                    </Suspense>

                                    <Suspense fallback={null}>
                                        <WhatWeDo />
                                    </Suspense>

                                    <Suspense fallback={null}>
                                        <ContactForm />
                                    </Suspense>

                                    <Suspense fallback={null}>
                                        <Footer />
                                    </Suspense>
                                </>
                            )}
                        </ErrorBoundary>
                    </main>
                </ScrollWrapper>
            )}
        </div>
    );
}

export default App;