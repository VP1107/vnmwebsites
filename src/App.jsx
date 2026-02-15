import React, { Suspense, lazy } from 'react';
import Hero from './components/Hero';
import CustomCursor from './components/CustomCursor';
import LoadingFallback from './components/LoadingFallback';
import ErrorBoundary from './components/ErrorBoundary';
import ScrollWrapper from './components/ScrollWrapper';
import './styles/global.css';
import './styles/animations.css';

// Lazy load heavy components
const AboutSection = lazy(() => import('./components/About/AboutSection'));
const WorkShowcase = lazy(() => import('./components/WorkShowcase'));
const WhatWeDo = lazy(() => import('./components/WhatWeDo'));
const ContactForm = lazy(() => import('./components/ContactForm'));
const Footer = lazy(() => import('./components/Footer'));

function App() {
  return (
    <div className="App">
      <CustomCursor />
      <ScrollWrapper>
        <main>
          <ErrorBoundary>
            {/* Critical: Load immediately */}
            <Hero />
            
            {/* Progressive loading with individual suspense boundaries */}
            <Suspense fallback={<LoadingFallback />}>
              <AboutSection />
            </Suspense>
            
            <Suspense fallback={<LoadingFallback />}>
              <WorkShowcase />
            </Suspense>
            
            <Suspense fallback={<LoadingFallback />}>
              <WhatWeDo />
            </Suspense>
            
            <Suspense fallback={<LoadingFallback />}>
              <ContactForm />
            </Suspense>
            
            <Suspense fallback={<LoadingFallback />}>
              <Footer />
            </Suspense>
          </ErrorBoundary>
        </main>
      </ScrollWrapper>
    </div>
  );
}

export default App;