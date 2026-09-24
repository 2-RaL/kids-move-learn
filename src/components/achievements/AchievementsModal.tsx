import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { X, Lock } from 'lucide-react';

const AchievementsModal: React.FC = () => {
  const { t } = useTranslation();
  const { achievements, showAchievements, setShowAchievements, stars } = useGameStore();
  const unlocked = achievements.filter(a => a.unlocked).length;

  return (
    <AnimatePresence>
      {showAchievements && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowAchievements(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 280, damping: 24 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div
              className="rounded-3xl p-6 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #5B21B6 0%, #7C3AED 60%, #A855F7 100%)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-black text-white">{t('achievementsTitle')} 🏆</h2>
                  <p className="text-purple-200 text-sm">{unlocked} / {achievements.length} unlocked • ⭐ {stars} stars</p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowAchievements(false)}
                  className="w-9 h-9 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X size={18} />
                </motion.button>
              </div>

              {/* Achievements grid */}
              <div className="grid grid-cols-2 gap-3 max-h-80 overflow-y-auto pr-1">
                {achievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center gap-3 rounded-xl p-3 ${
                      achievement.unlocked
                        ? 'bg-white/20 border border-white/30'
                        : 'bg-black/20 border border-white/10 opacity-60'
                    }`}
                  >
                    <div className={`w-10 h-10 flex items-center justify-center rounded-xl text-xl flex-shrink-0 ${
                      achievement.unlocked ? 'bg-white/20' : 'bg-black/20'
                    }`}>
                      {achievement.unlocked ? achievement.icon : <Lock size={16} className="text-white/40" />}
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold leading-tight ${achievement.unlocked ? 'text-white' : 'text-white/40'}`}>
                        {t(achievement.titleKey)}
                      </p>
                      <p className={`text-[10px] leading-tight mt-0.5 ${achievement.unlocked ? 'text-purple-200' : 'text-white/25'}`}>
                        {t(achievement.descKey)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAchievements(false)}
                className="w-full mt-5 py-3 bg-white text-purple-700 font-black rounded-2xl hover:bg-purple-50 transition-colors"
              >
                {t('closeBtn')} ✨
              </motion.button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default AchievementsModal;
