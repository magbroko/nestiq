import { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import SocialProof from './components/SocialProof';
import Features from './components/Features';
import HowItWorks from './components/HowItWorks';
import LiveDemo from './components/LiveDemo';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import LeadCapture from './components/LeadCapture';
import Footer from './components/Footer';

function CustomCursor() {
  const cursorX = useMotionValue(-100);
  const cursorY = useMotionValue(-100);
  const ringX = useMotionValue(-100);
  const ringY = useMotionValue(-100);

  const springX = useSpring(cursorX, { stiffness: 500, damping: 40 });
  const springY = useSpring(cursorY, { stiffness: 500, damping: 40 });
  const ringSpringX = useSpring(ringX, { stiffness: 150, damping: 20 });
  const ringSpringY = useSpring(ringY, { stiffness: 150, damping: 20 });

  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      cursorX.set(e.clientX - 6);
      cursorY.set(e.clientY - 6);
      ringX.set(e.clientX - 18);
      ringY.set(e.clientY - 18);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'BUTTON' ||
        target.tagName === 'A' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'SELECT' ||
        target.closest('button') ||
        target.closest('a')
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="custom-cursor"
        style={{ x: springX, y: springY }}
        animate={{ scale: isHovering ? 1.8 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        className="custom-cursor-ring"
        style={{ x: ringSpringX, y: ringSpringY }}
        animate={{ scale: isHovering ? 1.4 : 1, opacity: isHovering ? 0.4 : 0.6 }}
        transition={{ duration: 0.2 }}
      />
    </>
  );
}

export default function App() {
  return (
    <div className="relative" style={{ background: '#0D1B2A' }}>
      <CustomCursor />
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <Features />
        <HowItWorks />
        <LiveDemo />
        <Pricing />
        <Testimonials />
        <LeadCapture />
      </main>
      <Footer />
    </div>
  );
}
