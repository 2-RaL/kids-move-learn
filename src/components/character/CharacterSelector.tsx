import React from 'react';
import { motion } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { CHARACTERS } from '../../config/characters';
import type { Gender } from '../../types';
import { Users, Check, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const CharacterSelector: React.FC = () => {
  const { t } = useTranslation();
  const { selectedCharacter, selectedGender, setCharacter, setGender } = useGameStore();

  const handleGenderChange = (gender: Gender) => {
    setGender(gender);
    const firstOfGender = CHARACTERS.find((c) => c.gender === gender);
    if (firstOfGender) {
      setCharacter(firstOfGender.id);
    }
  };

  return (
    <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 sm:p-5 shadow-xl border border-white/60 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3.5">
        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
          <Users className="w-4 h-4" />
        </div>
        <h2 className="text-base sm:text-lg font-black text-slate-800">
          Personaj seç
        </h2>
      </div>

      {/* Gender Capsule Buttons (QIZ / OĞLAN) */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={() => handleGenderChange('girl')}
          className={`py-2 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            selectedGender === 'girl'
              ? 'bg-gradient-to-r from-pink-500 to-rose-400 text-white shadow-pink-200 ring-2 ring-pink-300 scale-102'
              : 'bg-pink-50 hover:bg-pink-100 text-pink-700'
          }`}
        >
          <span className="text-base">👧</span>
          <span>QIZ</span>
        </button>

        <button
          onClick={() => handleGenderChange('boy')}
          className={`py-2 px-3 rounded-2xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all shadow-sm ${
            selectedGender === 'boy'
              ? 'bg-gradient-to-r from-blue-500 to-sky-400 text-white shadow-blue-200 ring-2 ring-blue-300 scale-102'
              : 'bg-blue-50 hover:bg-blue-100 text-blue-700'
          }`}
        >
          <span className="text-base">👦</span>
          <span>OĞLAN</span>
        </button>
      </div>

      {/* 2x2 Grid of 3D Pixar Character Cards filtered by Gender */}
      <div className="grid grid-cols-2 gap-2.5 flex-1 min-h-0 overflow-y-auto pr-1">
        {CHARACTERS.filter((c) => c.gender === selectedGender).map((char) => {
          const isSelected = char.id === selectedCharacter;
          return (
            <motion.button
              key={char.id}
              onClick={() => {
                setCharacter(char.id);
                setGender(char.gender);
              }}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={`relative group rounded-2xl p-1.5 transition-all flex flex-col items-center justify-center text-center overflow-hidden border-2 ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-300/60'
                  : 'border-slate-100 hover:border-indigo-200 bg-white shadow-sm'
              }`}
            >
              {/* Checkmark Badge for Selected Character */}
              {isSelected && (
                <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-md">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                </div>
              )}

              {/* 3D Character Portrait Image */}
              <div className="w-full aspect-[4/5] rounded-xl overflow-hidden bg-amber-50/50 flex items-center justify-center">
                <img
                  src={char.thumbnail || '/assets/portraits/girl_leyla.jpg'}
                  alt={char.name}
                  className="w-full h-full object-cover object-top transition duration-200 group-hover:scale-105"
                  draggable={false}
                />
              </div>

              {/* Character Name Tag */}
              <div className="mt-1.5 text-xs font-bold text-slate-800">
                {char.name}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Info note matching reference mockup */}
      <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-start gap-1.5 text-[11px] text-slate-500 font-medium">
        <Info className="w-3.5 h-3.5 text-indigo-500 flex-shrink-0 mt-0.5" />
        <span>İlk əvvəl Qız və ya Oğlan seçin, sonra personaj seçin.</span>
      </div>
    </div>
  );
};

export default CharacterSelector;
