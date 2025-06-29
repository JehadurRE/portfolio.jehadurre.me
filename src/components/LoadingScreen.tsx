import React from 'react';
import { motion } from 'framer-motion';
import { TypeAnimation } from 'react-type-animation';

const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-50 dark:from-secondary-900 dark:via-secondary-800 dark:to-secondary-900"
    >
      <div className="text-center">
        {/* Chrysanthemum Loading Animation */}
        <motion.div
          initial={{ scale: 0, rotate: 0 }}
          animate={{ scale: 1, rotate: 360 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="mb-8 mx-auto w-24 h-24 relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary-400 to-accent-400 opacity-20 animate-pulse"></div>
          <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 opacity-40 animate-pulse delay-100"></div>
          <div className="absolute inset-4 rounded-full bg-gradient-to-r from-primary-600 to-accent-600 opacity-60 animate-pulse delay-200"></div>
          <div className="absolute inset-6 rounded-full bg-gradient-to-r from-primary-700 to-accent-700 animate-pulse delay-300"></div>
          
          {/* Chrysanthemum petals */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="absolute w-2 h-8 bg-gradient-to-t from-primary-500 to-primary-300 rounded-full origin-bottom"
              style={{
                transform: `rotate(${i * 45}deg)`,
                transformOrigin: '50% 100%',
                top: '50%',
                left: '50%',
                marginLeft: '-4px',
                marginTop: '-32px',
              }}
            />
          ))}
        </motion.div>

        {/* Loading Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="space-y-4"
        >
          <h2 className="text-2xl font-bold text-gradient">
            Md. Jehadur Rahman Emran
          </h2>
          <div className="text-secondary-600 dark:text-secondary-300 font-mono text-sm">
            <TypeAnimation
              sequence={[
                'Initializing portfolio...',
                1000,
                'Loading projects...',
                1000,
                'Preparing experience...',
                1000,
                'Almost ready...',
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: 1, duration: 2, ease: "easeInOut" }}
          className="mt-8 h-1 bg-gradient-to-r from-primary-500 to-accent-500 rounded-full mx-auto max-w-xs"
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;