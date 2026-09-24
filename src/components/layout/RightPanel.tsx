import React from 'react';
import VoiceControl from '../voice/VoiceControl';
import ChallengeCard from '../learning/ChallengeCard';
import CommandHistory from '../common/CommandHistory';

export const RightPanel: React.FC = () => {
  return (
    <aside className="flex flex-col gap-3 h-full overflow-y-auto pr-0.5">
      {/* 1. Voice Control Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-white/60 flex-shrink-0">
        <VoiceControl />
      </div>

      {/* 2. Learning Mode Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-white/60 flex-shrink-0">
        <ChallengeCard />
      </div>

      {/* 3. Command History Card */}
      <div className="bg-white/80 backdrop-blur-md rounded-3xl p-4 shadow-xl border border-white/60 flex-1 min-h-0">
        <CommandHistory />
      </div>
    </aside>
  );
};

export default RightPanel;
