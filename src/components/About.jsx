import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  return (
    <section id="about" className="bg-dark pt-12 pb-20 px-6 relative overflow-hidden">
      {/* Subtle background gradient for depth */}
      
      <div className="max-w-4xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="
  text-3xl md:text-5xl lg:text-6xl font-serif mb-8 drop-shadow-lg
  bg-gradient-to-r from-[#FF671A] via-[#FDD74A] to-[#FF671A]
  bg-clip-text text-transparent
">
            ABOUT
          </h2>
          
          
          <h3 className="text-left text-lg md:text-xl font-light text-gray-300 leading-relaxed max-w-3xl mx-auto">
  The Funny Awards is the grand finale to the laugh-packed bonanza that is{' '}
  <a
    href="https://funny-con.com"
    target="_blank"
    rel="noopener noreferrer"
    className="text-orange hover:underline transition-colors duration-200"
  >
    FunnyCon
  </a>
  , where comedy professionals and enthusiasts celebrate the best in humor across all media. From screens big and small to stages, pages and pixels, it's a night for the jokes that landed, the risks that paid off, and the people who made us laugh when we needed it most.
</h3>




        </motion.div>
      </div>
    </section>
  );
};

export default About;