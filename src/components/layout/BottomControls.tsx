import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import type { CharacterCommand } from '../../types';

interface CommandItem {
  command: CharacterCommand;
  labelAz: string;
  labelKey: string;
  icon: string;
  bgColor: string;
  textColor: string;
  borderColor: string;
}

type CategoryKey = 'movement' | 'fun' | 'daily';

const CATEGORIES: { key: CategoryKey; labelAz: string; labelEn: string; labelRu: string; icon: string }[] = [
  { key: 'movement', labelAz: '🏃 Hərəkətlər', labelEn: '🏃 Movements', labelRu: '🏃 Движения', icon: '🏃' },
  { key: 'fun', labelAz: '🎉 Əyləncə', labelEn: '🎉 Fun & Expression', labelRu: '🎉 Веселье', icon: '🎉' },
  { key: 'daily', labelAz: '📚 Öyrənmə', labelEn: '📚 Learning & Daily', labelRu: '📚 Обучение', icon: '📚' },
];

const COMMANDS_BY_CATEGORY: Record<CategoryKey, CommandItem[][]> = {
  movement: [
    [
      { command: 'sit', labelAz: 'Otur', labelKey: 'sit', icon: '🪑', bgColor: '#DCFCE7', textColor: '#166534', borderColor: '#86EFAC' },
      { command: 'stand', labelAz: 'Dur', labelKey: 'stand', icon: '🧍', bgColor: '#DBEAFE', textColor: '#1E40AF', borderColor: '#93C5FD' },
      { command: 'run', labelAz: 'Qaç', labelKey: 'run', icon: '🏃', bgColor: '#FFEDD5', textColor: '#9A3412', borderColor: '#FDBA74' },
      { command: 'jump', labelAz: 'Tullan', labelKey: 'jump', icon: '🦘', bgColor: '#FEF3C7', textColor: '#92400E', borderColor: '#FDE68A' },
      { command: 'stop', labelAz: 'Dayan', labelKey: 'stop', icon: '🛑', bgColor: '#FEE2E2', textColor: '#991B1B', borderColor: '#FCA5A5' },
    ],
    [
      { command: 'walkForward', labelAz: 'Önə', labelKey: 'walkForward', icon: '⬆️', bgColor: '#DCFCE7', textColor: '#166534', borderColor: '#86EFAC' },
      { command: 'walkBackward', labelAz: 'Geriyə', labelKey: 'walkBackward', icon: '⬇️', bgColor: '#FFE4E6', textColor: '#9F1239', borderColor: '#FDA4AF' },
      { command: 'moveLeft', labelAz: 'Sola', labelKey: 'moveLeft', icon: '⬅️', bgColor: '#EDE9FE', textColor: '#5B21B6', borderColor: '#C4B5FD' },
      { command: 'moveRight', labelAz: 'Sağa', labelKey: 'moveRight', icon: '➡️', bgColor: '#FFEDD5', textColor: '#9A3412', borderColor: '#FDBA74' },
      { command: 'spin', labelAz: 'Dön', labelKey: 'spin', icon: '🔄', bgColor: '#EDE9FE', textColor: '#5B21B6', borderColor: '#C4B5FD' },
    ],
  ],
  fun: [
    [
      { command: 'wave', labelAz: 'Əl salla', labelKey: 'wave', icon: '🖐️', bgColor: '#CFFAFE', textColor: '#155E75', borderColor: '#A5F3FC' },
      { command: 'clap', labelAz: 'Əl çal', labelKey: 'clap', icon: '👏', bgColor: '#FEF3C7', textColor: '#92400E', borderColor: '#FDE68A' },
      { command: 'dance', labelAz: 'Rəqs et', labelKey: 'dance', icon: '💃', bgColor: '#FCE7F3', textColor: '#9D174D', borderColor: '#F472B6' },
      { command: 'laugh', labelAz: 'Gül', labelKey: 'laugh', icon: '😂', bgColor: '#FEF3C7', textColor: '#92400E', borderColor: '#FDE68A' },
    ],
    [
      { command: 'nod', labelAz: 'Bəli (baş)', labelKey: 'nod', icon: '👍', bgColor: '#DCFCE7', textColor: '#166534', borderColor: '#86EFAC' },
      { command: 'shakeHead', labelAz: 'Xeyr (baş)', labelKey: 'shakeHead', icon: '🙅', bgColor: '#FFE4E6', textColor: '#9F1239', borderColor: '#FDA4AF' },
      { command: 'think', labelAz: 'Düşün', labelKey: 'think', icon: '🤔', bgColor: '#EDE9FE', textColor: '#5B21B6', borderColor: '#C4B5FD' },
      { command: 'cry', labelAz: 'Ağla', labelKey: 'cry', icon: '😢', bgColor: '#DBEAFE', textColor: '#1E40AF', borderColor: '#93C5FD' },
    ],
  ],
  daily: [
    [
      { command: 'read', labelAz: 'Kitab oxu', labelKey: 'read', icon: '📖', bgColor: '#DCFCE7', textColor: '#166534', borderColor: '#86EFAC' },
      { command: 'write', labelAz: 'Yaz', labelKey: 'write', icon: '✏️', bgColor: '#FFEDD5', textColor: '#9A3412', borderColor: '#FDBA74' },
      { command: 'draw', labelAz: 'Şəkil çək', labelKey: 'draw', icon: '🎨', bgColor: '#FCE7F3', textColor: '#9D174D', borderColor: '#F472B6' },
      { command: 'sing', labelAz: 'Mahnı oxu', labelKey: 'sing', icon: '🎤', bgColor: '#EDE9FE', textColor: '#5B21B6', borderColor: '#C4B5FD' },
      { command: 'count', labelAz: 'Say', labelKey: 'count', icon: '🔢', bgColor: '#CFFAFE', textColor: '#155E75', borderColor: '#A5F3FC' },
    ],
    [
      { command: 'drink', labelAz: 'Su iç', labelKey: 'drink', icon: '🥤', bgColor: '#CFFAFE', textColor: '#155E75', borderColor: '#A5F3FC' },
      { command: 'eat', labelAz: 'Yemək ye', labelKey: 'eat', icon: '🍎', bgColor: '#FFE4E6', textColor: '#9F1239', borderColor: '#FDA4AF' },
      { command: 'sleep', labelAz: 'Yat', labelKey: 'sleep', icon: '😴', bgColor: '#EDE9FE', textColor: '#5B21B6', borderColor: '#C4B5FD' },
      { command: 'stretch', labelAz: 'Gəril', labelKey: 'stretch', icon: '🙆', bgColor: '#DCFCE7', textColor: '#166534', borderColor: '#86EFAC' },
      { command: 'point', labelAz: 'Göstər', labelKey: 'point', icon: '👆', bgColor: '#FEF3C7', textColor: '#92400E', borderColor: '#FDE68A' },
    ],
  ],
};

export const BottomControls: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { executeCommand, currentCommand } = useGameStore();
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('movement');

  const rows = COMMANDS_BY_CATEGORY[selectedCategory];

  const getCategoryLabel = (cat: typeof CATEGORIES[0]) => {
    if (i18n.language === 'en') return cat.labelEn;
    if (i18n.language === 'ru') return cat.labelRu;
    return cat.labelAz;
  };

  const renderButton = (item: CommandItem) => {
    const isActive = currentCommand === item.command;
    const label = i18n.language === 'az' ? item.labelAz : t(`commands.${item.labelKey}`);

    return (
      <motion.button
        key={item.command}
        onClick={() => executeCommand(item.command, 'button')}
        whileHover={{ scale: 1.04, y: -2 }}
        whileTap={{ scale: 0.96, y: 1 }}
        className={`flex-1 min-w-[70px] sm:min-w-[85px] py-1.5 sm:py-2 px-1.5 sm:px-2 rounded-2xl flex items-center justify-center gap-1.5 shadow-sm transition-all border-2 cursor-pointer select-none ${
          isActive ? 'ring-3 ring-indigo-400/80 scale-102 shadow-md' : 'hover:shadow'
        }`}
        style={{
          backgroundColor: item.bgColor,
          borderColor: isActive ? item.textColor : item.borderColor,
          color: item.textColor,
        }}
      >
        <span className="text-lg sm:text-xl leading-none">{item.icon}</span>
        <span className="font-extrabold text-xs sm:text-sm tracking-wide truncate">{label}</span>
      </motion.button>
    );
  };

  return (
    <div className="bg-white/85 backdrop-blur-md rounded-3xl p-2.5 sm:p-3 shadow-xl border border-white/60 flex flex-col gap-2">
      {/* Category selector tabs */}
      <div className="flex items-center justify-center gap-1.5 bg-slate-100/80 p-1 rounded-2xl">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              selectedCategory === cat.key
                ? 'bg-white text-indigo-700 shadow-sm scale-102'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            {getCategoryLabel(cat)}
          </button>
        ))}
      </div>

      {/* Row 1 */}
      <div className="flex gap-1.5 sm:gap-2 w-full">
        {rows[0].map(renderButton)}
      </div>

      {/* Row 2 */}
      <div className="flex gap-1.5 sm:gap-2 w-full">
        {rows[1].map(renderButton)}
      </div>
    </div>
  );
};

export default BottomControls;
