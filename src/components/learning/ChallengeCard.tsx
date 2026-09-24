import React, { useEffect } from 'react';
import { Lightbulb, RotateCw } from 'lucide-react';
import { useGameStore } from '../../store/gameStore';
import type { CharacterCommand } from '../../types';

export const ChallengeCard: React.FC = () => {
  const {
    currentChallenge,
    challengeProgress,
    generateChallenge,
    executeCommand,
  } = useGameStore();

  useEffect(() => {
    if (!currentChallenge) {
      generateChallenge();
    }
  }, [currentChallenge, generateChallenge]);

  const showHint = () => {
    if (!currentChallenge) return;
    const cmd = currentChallenge.commands[challengeProgress];
    if (cmd) {
      executeCommand(cmd as CharacterCommand, 'button');
    }
  };

  const totalSteps = currentChallenge?.commands?.length || 5;
  const currentStep = Math.min(challengeProgress, totalSteps);
  const progressPercent = Math.round((currentStep / totalSteps) * 100);

  // Friendly formatted task text
  const taskDescription = 'Sola get və sonra tullan!';

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-2 mb-2.5">
        <span className="text-base">🎯</span>
        <h3 className="text-sm font-black text-slate-800">
          Öyrənmə modu
        </h3>
      </div>

      {/* Task Card Box matching mockup */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 mb-2.5 shadow-inner">
        <span className="text-[11px] text-slate-500 font-semibold block mb-0.5">
          Tapşırıq:
        </span>
        <span className="text-xs sm:text-sm font-extrabold text-slate-800 block leading-snug">
          {taskDescription}
        </span>

        {/* Action Buttons: 💡 Göstəriş & 🔄 Yeni tapşırıq */}
        <div className="flex items-center gap-2 mt-2.5">
          <button
            onClick={showHint}
            className="flex-1 py-1 px-2 rounded-xl bg-white hover:bg-amber-50 active:scale-95 transition border border-amber-200 shadow-sm flex items-center justify-center gap-1 text-xs font-bold text-amber-700"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
            <span>Göstəriş</span>
          </button>

          <button
            onClick={() => generateChallenge()}
            className="flex-1 py-1 px-2 rounded-xl bg-white hover:bg-slate-50 active:scale-95 transition border border-slate-200 shadow-sm flex items-center justify-center gap-1 text-xs font-bold text-slate-700"
          >
            <RotateCw className="w-3.5 h-3.5 text-slate-500" />
            <span>Yeni tapşırıq</span>
          </button>
        </div>
      </div>

      {/* Progress Bar matching mockup (İrəliləyiş 2 / 5) */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-slate-500 text-[11px]">İrəliləyiş</span>
          <span className="text-slate-700 text-xs">{currentStep} / {totalSteps}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-300"
            style={{ width: `${Math.max(15, progressPercent)}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChallengeCard;
