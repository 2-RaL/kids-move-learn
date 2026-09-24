import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';

const LoadingScreen: React.FC = () => {
  const { t } = useTranslation();
  const { isLoading, setLoading } = useGameStore();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2200);
    return () => clearTimeout(timer);
  }, [setLoading]);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 50%, #A855F7 100%)',
          }}
        >
          {/* Decorative circles */}
          {[0, 1, 2, 3].map(i => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-white/10"
              style={{ width: 80 + i * 160, height: 80 + i * 160 }}
              animate={{ scale: [1, 1.05, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 3 + i, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}

          {/* Logo */}
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: 'spring', stiffness: 200 }}
            className="text-center mb-8 relative z-10"
          >
            <motion.div
              animate={{ rotate: [0, 15, -10, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className="text-7xl mb-4"
            >
              🌟
            </motion.div>
            <h1
              className="font-black text-white mb-1"
              style={{ fontSize: 36, fontFamily: "'Baloo 2', sans-serif", textShadow: '0 4px 20px rgba(0,0,0,0.3)' }}
            >
              Kids Move &amp; Learn
            </h1>
            <p className="text-purple-200 text-lg font-medium">Speak. Move. Learn. Have Fun!</p>
          </motion.div>

          {/* Loading message */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-purple-200 text-sm mb-6 relative z-10"
          >
            {t('loading')}
          </motion.p>

          {/* Progress bar */}
          <div className="w-64 h-2 bg-white/20 rounded-full overflow-hidden relative z-10">
            <motion.div
              className="h-full bg-gradient-to-r from-yellow-400 to-pink-400 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 2, ease: 'easeInOut' }}
            />
          </div>

          {/* Floating emojis */}
          {['🌈', '⭐', '🎉', '🏃', '💃', '🎯'].map((emoji, i) => (
            <motion.span
              key={i}
              className="absolute text-3xl"
              style={{
                left: `${10 + i * 15}%`,
                top: `${20 + (i % 3) * 20}%`,
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.4, 0.8, 0.4],
                rotate: [0, 10, -8, 0],
              }}
              transition={{ duration: 2 + i * 0.3, repeat: Infinity, delay: i * 0.2 }}
            >
              {emoji}
            </motion.span>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoadingScreen;
