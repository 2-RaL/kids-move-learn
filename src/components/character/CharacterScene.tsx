import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { CHARACTERS } from '../../config/characters';
import CharacterAvatar from './CharacterAvatar';
import { RotateCcw, RotateCw, CheckCircle2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import type { AnimationSpeed, Difficulty } from '../../types';

export const CharacterScene: React.FC = () => {
  const { t } = useTranslation();
  const {
    selectedCharacter,
    currentCommand,
    animationSpeed,
    setAnimationSpeed,
    difficulty,
    setDifficulty,
    voiceState,
    feedbackMessage,
    feedbackType,
    executeCommand,
  } = useGameStore();

  const character = CHARACTERS.find((c) => c.id === selectedCharacter) || CHARACTERS[0];

  const handleReset = () => {
    executeCommand('idle');
  };

  return (
    <div className="flex flex-col w-full h-full min-h-0">
      {/* 3D Main Stage Area */}
      <div className="relative flex-1 min-h-[360px] sm:min-h-[420px] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/60 bg-sky-200">
        {/* 3D Pixar Village Background */}
        <img
          src="/assets/scene/village_garden.jpg"
          alt="Village Garden"
          className="absolute inset-0 w-full h-full object-cover object-bottom pointer-events-none select-none"
          draggable={false}
        />

        {/* Soft Ambient Sunlight Vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-black/10 pointer-events-none" />

        {/* Top Status Banner (e.g. 🔴 Tom dinləyirəm...) */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`px-5 py-2 rounded-full backdrop-blur-md text-white font-bold text-sm sm:text-base flex items-center gap-2 shadow-lg border border-white/25 ${
              voiceState === 'listening'
                ? 'bg-rose-600/90 ring-4 ring-rose-400/40 animate-pulse'
                : 'bg-black/50'
            }`}
          >
            <span className={`w-3 h-3 rounded-full ${voiceState === 'listening' ? 'bg-red-300 animate-ping' : 'bg-rose-500'}`} />
            <span>
              {voiceState === 'listening'
                ? `${character.name} dinləyirəm...`
                : `${character.name} hazırdır! 🌟`}
            </span>
          </motion.div>
        </div>

        {/* Center Character on the Cobblestone Path */}
        <div className="absolute inset-0 flex items-end justify-center pb-8 sm:pb-12 z-10">
          <CharacterAvatar character={character} command={currentCommand} speed={animationSpeed} />
        </div>

        {/* Bottom Feedback Badge (e.g. Əmr başa düşüldü! ✅) */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <AnimatePresence>
            {(feedbackMessage || currentCommand !== 'idle') && (
              <motion.div
                initial={{ opacity: 0, y: 15, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="px-6 py-2.5 rounded-full bg-black/75 backdrop-blur-md text-white font-extrabold text-sm sm:text-base flex items-center gap-2.5 shadow-2xl border border-white/30"
              >
                <span>{feedbackMessage || t('commandUnderstood') || 'Əmr başa düşüldü!'}</span>
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Control Bar right below the stage matching mockup */}
      <div className="mt-3 py-2 px-3 sm:px-4 bg-white/70 backdrop-blur-md rounded-2xl border border-white/60 shadow-md flex flex-wrap items-center justify-between gap-2.5 text-xs sm:text-sm font-bold text-slate-700">
        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 transition shadow-sm border border-slate-200 text-slate-700"
            title="Sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Sıfırla</span>
          </button>
          <button
            onClick={() => executeCommand('idle')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 active:scale-95 transition shadow-sm border border-slate-200 text-slate-700"
            title="Geri al"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Geri al</span>
          </button>
        </div>

        {/* Speed Selector (Sürət: 🐢 Yavaş | 🏃 Normal | 🏃‍♂️ Sürətli) */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 mr-0.5">Sürət:</span>
          <button
            onClick={() => setAnimationSpeed('slow')}
            className={`px-2.5 py-1 rounded-xl transition flex items-center gap-1 ${
              animationSpeed === 'slow'
                ? 'bg-emerald-500 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600'
            }`}
          >
            <span>🐢</span>
            <span className="hidden sm:inline">Yavaş</span>
          </button>
          <button
            onClick={() => setAnimationSpeed('normal')}
            className={`px-2.5 py-1 rounded-xl transition flex items-center gap-1 ${
              animationSpeed === 'normal'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600'
            }`}
          >
            <span>🏃</span>
            <span>Normal</span>
          </button>
          <button
            onClick={() => setAnimationSpeed('fast')}
            className={`px-2.5 py-1 rounded-xl transition flex items-center gap-1 ${
              animationSpeed === 'fast'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600'
            }`}
          >
            <span>🏃‍♂️</span>
            <span className="hidden sm:inline">Sürətli</span>
          </button>
        </div>

        {/* Difficulty Selector (Çətinlik: 😊 Asan | 😐 Normal | 🔥 Çətin) */}
        <div className="flex items-center gap-1.5">
          <span className="text-slate-500 mr-0.5">Çətinlik:</span>
          <button
            onClick={() => setDifficulty('easy')}
            className={`px-2 py-1 rounded-xl transition flex items-center gap-1 ${
              difficulty === 'easy'
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600'
            }`}
          >
            <span>😊</span>
            <span>Asan</span>
          </button>
          <button
            onClick={() => setDifficulty('normal')}
            className={`px-2 py-1 rounded-xl transition flex items-center gap-1 ${
              difficulty === 'normal'
                ? 'bg-indigo-500 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600'
            }`}
          >
            <span>😐</span>
            <span>Normal</span>
          </button>
          <button
            onClick={() => setDifficulty('hard')}
            className={`px-2 py-1 rounded-xl transition flex items-center gap-1 ${
              difficulty === 'hard'
                ? 'bg-rose-500 text-white shadow-sm'
                : 'bg-white hover:bg-slate-100 text-slate-600'
            }`}
          >
            <span>🔥</span>
            <span>Çətin</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CharacterScene;
