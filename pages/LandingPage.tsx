
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from '../components/landing/Header';
import Hero from '../components/landing/Hero';
import Stats from '../components/landing/Stats';
import About from '../components/landing/About';
import Features from '../components/landing/Features';
import Testimonials from '../components/landing/Testimonials';
import Pricing from '../components/landing/Pricing';
import Contact from '../components/landing/Contact';
import CTA from '../components/landing/CTA';
import Footer from '../components/landing/Footer';

const LandingPage: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    // Check if we need to scroll to a specific section passed via navigation state
    if (location.state && (location.state as any).scrollTo) {
        const targetId = (location.state as any).scrollTo;
        // Small timeout ensures the DOM is fully rendered
        setTimeout(() => {
            const element = document.getElementById(targetId);
            if (element) {
                element.scrollIntoView({ behavior: 'smooth' });
            }
        }, 100);
        
        // Clean up the state to prevent scrolling on simple refresh
        window.history.replaceState({}, document.title);
    } else {
        // If simply navigating to home without a target, scroll to top
        window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-sans transition-colors duration-300">
      <Header />
      <main>
        <Hero />
        <Stats />
        <About />
        <Features />
        <Testimonials />
        <Pricing />
        <CTA />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
