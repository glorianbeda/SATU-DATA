import React from 'react';
import { motion } from 'motion/react';

const ContentLoader = ({ height = "h-64" }) => {
  return (
    <div className={`w-full ${height} bg-gray-100 dark:bg-gray-800 rounded-xl overflow-hidden relative`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        animate={{ x: ['-100%', '100%'] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};

export default ContentLoader;
