import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    title: 'The Funny Awards 2026',
    subtitle: 'Celebrating the Funniest in Comedy',
    image: 'https://res.cloudinary.com/deqvusnd8/image/upload/v1773849510/pic1_bdodhk.png'
  },
  {
    id: 2,
    title: 'Honoring Comedy',
    subtitle: 'Across Film, TV, Stage, and Digital',
    image: 'https://res.cloudinary.com/deqvusnd8/image/upload/v1773849526/pic2_ss3dbr.png'
  },
  {
    id: 3,
    title: 'The Biggest Night',
    subtitle: 'In Funny',
    image: 'https://res.cloudinary.com/deqvusnd8/image/upload/v1773849541/pic3_nkq6jx.png'
  }
];

const HeroCarousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-black md:h-[500px]">
      {/* Sizer: gives the container its height on mobile (no extra padding/gap) */}
      <img
        src={slides[currentSlide].image}
        alt=""
        aria-hidden="true"
        className="w-full object-contain opacity-0 pointer-events-none md:hidden"
      />

      {/* Animated layer: absolute so slides overlap (prevents height doubling) */}
      <div className="absolute inset-0">
        <AnimatePresence initial={false}>
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="absolute inset-0"
          >
            <img
              src={slides[currentSlide].image}
              alt={slides[currentSlide].title}
              className="w-full h-full object-contain bg-black"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      
    </div>
  );
};

export default HeroCarousel;