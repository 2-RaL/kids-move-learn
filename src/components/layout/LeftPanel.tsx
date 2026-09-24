import React from 'react';
import CharacterSelector from '../character/CharacterSelector';

export const LeftPanel: React.FC = () => (
  <aside className="flex flex-col h-full overflow-y-auto">
    <CharacterSelector />
  </aside>
);

export default LeftPanel;
