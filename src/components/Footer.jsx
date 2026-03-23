import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark text-light">
      <div className="border-t border-orange/60" />
      
      <div className="max-w-7xl mx-auto py-12 px-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <div className="text-left">
  <h3 className="text-2xl md:text-3xl font-serif text-orange mb-4">
    The Funny Awards 2026
  </h3>

  <div className="flex flex-col gap-2 text-lg font-light">
    <div className="flex items-center gap-2 justify-start">
      <Calendar size={20} className="text-orange" />
      <span>Apr 1, 2026 8 PM</span>
    </div>

    <div className="flex items-start gap-2 justify-start">
      <MapPin size={20} className="text-orange mt-1" />
      <span className="leading-snug">
        The Lincoln Lodge<br />
        2040 N Milwaukee Ave,<br />
        Chicago, IL 60647
      </span>
    </div>
  </div>
</div>

<a
  href="https://funny-con.com/tickets"
  target="_blank"
  rel="noopener noreferrer"
>
  <motion.button
    whileHover={{ scale: 1.05, backgroundColor: '#E55F15' }}
    whileTap={{ scale: 0.95 }}
    className="bg-orange text-white font-sans font-semibold text-lg px-10 py-4 rounded-full shadow-lg transition-all duration-300"
  >
    Get Tickets
  </motion.button>
</a>
        </div>

        <div className="mt-12 pt-8 border-t border-light border-opacity-20 text-center text-sm text-light text-opacity-70">
          <p>&copy; 2026 The Funny Awards. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;