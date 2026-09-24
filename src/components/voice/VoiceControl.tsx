import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';
import { useGameStore } from '../../store/gameStore';

export const VoiceControl: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { voiceState, lastTranscript } = useGameStore();
  const { startListening, stopListening, isSupported } = useVoiceRecognition();

  const isListening = voiceState === 'listening';

  const handleMicClick = () => {
    if (!isSupported) return;
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const displayText = lastTranscript || (i18n.language === 'az' ? 'Əl et' : 'Wave');

  return (
    <div className="flex flex-col items-center">
      {/* Header */}
      <div className="w-full flex items-center gap-2 mb-3">
        <span className="text-base">🎙️</span>
        <h3 className="text-sm font-black text-slate-800">
          Səsli idarəetmə
        </h3>
      </div>

      {/* Glowing Mic Orb matching mockup */}
      <div className="relative my-2 flex items-center justify-center">
        {/* Soft Radial Glow Ring */}
        <div
          className={`absolute w-24 h-24 rounded-full transition-all duration-500 ${
            isListening
              ? 'bg-pink-400/40 animate-ping'
              : 'bg-gradient-to-tr from-purple-400/30 to-pink-400/40 blur-md'
          }`}
        />

        {/* Outer Halo */}
        <div className="absolute w-20 h-20 rounded-full border-2 border-pink-300/60 animate-pulse" />

        {/* Main Microphone Button */}
        <motion.button
          onClick={handleMicClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-white shadow-lg transition-all ${
            isListening
              ? 'bg-gradient-to-tr from-rose-500 to-pink-500 shadow-rose-300/80 ring-4 ring-pink-300'
              : 'bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.35)]'
          }`}
          disabled={!isSupported}
          aria-label={isListening ? 'Mikrofonu dayandır' : 'Danış'}
        >
          {isListening ? (
            <Mic className="w-8 h-8 animate-bounce" />
          ) : !isSupported ? (
            <MicOff className="w-7 h-7 text-white/70" />
          ) : (
            <Mic className="w-7 h-7" />
          )}
        </motion.button>
      </div>

      {/* Action Title & Subtitle */}
      <div className="text-center mt-1 mb-3">
        <h4 className="text-sm font-extrabold text-slate-800">
          {isListening ? 'Dinləyirəm...' : 'Danış'}
        </h4>
        <p className="text-[11px] text-slate-500 font-medium">
          Mikrofona toxun və əmr ver
        </p>
      </div>

      {/* Status Box matching mockup (Siz dediniz: «Əl et») */}
      <div className="w-full bg-slate-50 border border-slate-200/80 rounded-2xl p-2.5 text-center shadow-inner">
        <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">
          Siz dediniz:
        </span>
        <span className="text-sm font-black text-emerald-600 block">
          «{displayText}»
        </span>
      </div>
    </div>
  );
};

export default VoiceControl;
