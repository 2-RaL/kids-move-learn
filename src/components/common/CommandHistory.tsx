import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useGameStore } from '../../store/gameStore';
import { Trash2, CheckCircle2, Mic } from 'lucide-react';

const DEFAULT_DEMO_ENTRIES = [
  { id: '1', name: 'Əl et' },
  { id: '2', name: 'Tullan' },
  { id: '3', name: 'Sağa get' },
  { id: '4', name: 'Otur' },
];

export const CommandHistory: React.FC = () => {
  const { t } = useTranslation();
  const { commandHistory, clearHistory } = useGameStore();

  const entries =
    commandHistory.length > 0
      ? commandHistory.map((h) => ({
          id: h.id,
          name: t(`commands.${h.command}`) || h.command,
        }))
      : DEFAULT_DEMO_ENTRIES;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-base">🕒</span>
        <h3 className="text-sm font-black text-slate-800">
          Əmr tarixi
        </h3>
      </div>

      {/* History Items matching mockup */}
      <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto pr-1">
        <AnimatePresence initial={false}>
          {entries.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-between py-1.5 px-2.5 bg-slate-50 border border-slate-200/80 rounded-xl text-xs"
            >
              <div className="flex items-center gap-2 text-slate-700 font-bold">
                <Mic className="w-3.5 h-3.5 text-indigo-500" />
                <span>"{item.name}"</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Clear History Button matching mockup */}
      <button
        onClick={clearHistory}
        className="mt-2.5 py-1.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 active:scale-98 transition flex items-center justify-center gap-1.5 text-xs font-bold text-slate-600 border border-slate-200"
      >
        <Trash2 className="w-3.5 h-3.5 text-slate-500" />
        <span>Tarixçəni təmizlə</span>
      </button>
    </div>
  );
};

export default CommandHistory;
