import { Suspense, lazy, useState, useEffect } from 'react';
import { ScrollTrigger } from './gsap-config'; // centralised — registers once
import Hero from './components/Hero/Hero';
import CustomCursor from './components/UI/CustomCursor';
import ErrorBoundary from './components/UI/ErrorBoundary';
import ScrollWrapper from './components/UI/ScrollWrapper';
import Preloader from './components/UI/Preloader';
import './styles/global.css';
import './styles/animations.css';

const Navigation      = lazy(() => import('./components/UI/Navigation'));
const ScrollToTop     = lazy(() => import('./components/UI/ScrollToTop'));
const AboutSection    = lazy(() => import('./components/About/AboutSection'));
const WorkShowcase    = lazy(() => import('./components/WorkShowcase/WorkShowcase'));
const TechStackShowcase = lazy(() => import('./components/TechStack/TechStackShowcase'));
const WhatWeDo        = lazy(() => import('./components/WhatWeDo/WhatWeDo'));
const ContactForm     = lazy(() => import('./components/Contact/ContactForm'));
const Footer          = lazy(() => import('./components/Footer/Footer'));

function App() {
    const [isLoading, setIsLoading]     = useState(true);
    const [startHero, setStartHero]     = useState(false);
    const [showSections, setShowSections] = useState(false);

    useEffect(() => {
        // Minimum load time to prevent flashing
        const minTimePromise = new Promise(resolve => setTimeout(resolve, 2500));

        // Window load event
        const loadPromise = new Promise(resolve => {
            if (document.readyState === 'complete') {
                resolve();
            } else {
                window.addEventListener('load', resolve, { once: true });
            }
        });

        Promise.all([minTimePromise, loadPromise]).then(() => {
            setIsLoading(false);

            // Start animations after preloader exit
            setTimeout(() => {
                setStartHero(true);
                setShowSections(true);

                // Refresh ScrollTrigger once layout is stable
                setTimeout(() => {
                    ScrollTrigger.refresh();
                }, 500);
            }, 1000);
        });
    }, []);

    return (
        <div className="App">
            <Preloader isLoading={isLoading} />

            {!isLoading && (
                <>
                    <CustomCursor />
                    <Suspense fallback={null}>
                        <Navigation />
                    </Suspense>
                    <Suspense fallback={null}>
                        <ScrollToTop />
                    </Suspense>
                </>
            )}

            <ScrollWrapper>
                <main style={{ visibility: isLoading ? 'hidden' : 'visible' }}>
                    <ErrorBoundary>
                        <Hero startAnimation={startHero} />

                        {showSections && (
                            <>
                                <Suspense fallback={null}>
                                    <AboutSection />
                                </Suspense>
                                <Suspense fallback={null}>
                                    <WorkShowcase />
                                </Suspense>
                                <Suspense fallback={null}>
                                    <TechStackShowcase />
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
        </div>
    );
}

export default App;