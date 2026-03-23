import React from 'react';
import { motion } from 'framer-motion';

const AwardCategoryCard = ({ title, icon: Icon }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
  transition={{ duration: 0.3 }}
  className="
    relative
    bg-light rounded-2xl shadow-lg border-l-4 border-orange cursor-pointer group
    w-full
    p-3 md:p-8
    h-44 md:h-64
  "
>

  
  <div className="relative h-full grid grid-rows-[1fr_2fr]">
        {/* Icon */}
        <div className="flex items-center justify-center">
          <div className="text-orange transition-transform duration-300 group-hover:scale-110">
            <Icon size={28} strokeWidth={1.5} className="md:hidden" />
            <Icon size={48} strokeWidth={1.5} className="hidden md:block" />
          </div>
        </div>

        {/* Title */}
        <div className="flex justify-center items-center text-center">
          <h3 className="
            font-serif
            text-sm md:text-xl
            leading-snug md:leading-tight
            text-dark
            w-[95%] md:w-[80%]
          ">
            {title}
          </h3>
        </div>
      </div>
    </motion.div>
  );
};

export default AwardCategoryCard;