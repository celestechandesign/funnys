import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <header id="site-header" className="sticky top-0 z-50 w-full bg-dark/90 backdrop-blur-md border-b border-white/10 py-4 px-6 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo / Home Link */}
        <Link to="/" className="group" onClick={() => setIsOpen(false)}>
          <h2
            className="
              text-2xl md:text-3xl
              font-serif font-semibold
              text-orange
              transition-colors duration-300
              group-hover:text-orange/90
            "
          >
            The Funnys
          </h2>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 md:gap-8">
          <button
            onClick={() => scrollToSection('categories')}
            className="group focus:outline-none"
            aria-label="Scroll to Categories"
          >
            <span className="text-base md:text-lg font-sans font-medium text-gray-300 group-hover:text-orange transition-colors duration-300">
              Categories
            </span>
          </button>

          <button
            onClick={() => scrollToSection('about')}
            className="group focus:outline-none"
            aria-label="Scroll to About"
          >
            <span className="text-base md:text-lg font-sans font-medium text-gray-300 group-hover:text-orange transition-colors duration-300">
              About
            </span>
          </button>

          <motion.a
            href="https://funny-con.com/tickets"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.05, backgroundColor: '#E55F15' }}
            whileTap={{ scale: 0.95 }}
            className="
              bg-orange text-white
              font-sans font-semibold
              text-sm md:text-base
              px-6 py-2.5
              rounded-full
              shadow-md
              transition-colors duration-300
              inline-flex items-center justify-center
              focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2 focus-visible:ring-offset-dark
            "
          >
            Get Tickets
          </motion.a>
        </nav>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden inline-flex items-center justify-center rounded-lg p-2 text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Open menu"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Slide-in Menu (from top, top third, full width) */}
<AnimatePresence>
  {isOpen && (
    <>
      {/* Overlay */}
      <motion.div
        className="fixed inset-0 z-50 bg-black/50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setIsOpen(false)}
      />

      {/* Panel */}
      <motion.aside
        className="
          fixed top-0 left-0 z-50
          w-full
          h-[33vh]
          bg-dark
          border-b border-white/10
          shadow-2xl
        "
        initial={{ y: '-100%' }}
        animate={{ y: 0 }}
        exit={{ y: '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Close button */}
        <div className="absolute top-4 right-4">
          <button
            className="inline-flex items-center justify-center rounded-lg p-2 text-gray-200 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close menu"
            onClick={() => setIsOpen(false)}
          >
            <X size={22} />
          </button>
        </div>

        {/* Centered vertical stack */}
        <div className="h-full flex flex-col items-center justify-center gap-6 px-6">
          <button
            onClick={() => scrollToSection('categories')}
            className="text-xl font-sans font-medium text-gray-200 hover:text-orange transition-colors"
          >
            Categories
          </button>

          <button
            onClick={() => scrollToSection('about')}
            className="text-xl font-sans font-medium text-gray-200 hover:text-orange transition-colors"
          >
            About
          </button>

          <motion.a
            href="https://funny-con.com/tickets"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            whileHover={{ scale: 1.05, backgroundColor: '#E55F15' }}
            whileTap={{ scale: 0.95 }}
            className="
              bg-orange text-white
              font-sans font-semibold
              text-base
              px-8 py-3
              rounded-full
              shadow-md
              transition-colors duration-300
              inline-flex items-center justify-center
              focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0
            "
          >
            Get Tickets
          </motion.a>
        </div>
      </motion.aside>
    </>
  )}
</AnimatePresence>

    </header>
  );
};

export default Header;