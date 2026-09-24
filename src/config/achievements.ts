import type { Achievement } from '../types';

export const ACHIEVEMENTS_CONFIG: Omit<Achievement, 'unlocked' | 'unlockedAt'>[] = [
  { id: 'first-command',   icon: '🎉', titleKey: 'achievement.firstCommand',   descKey: 'achievement.firstCommandDesc'   },
  { id: 'ten-commands',    icon: '🔥', titleKey: 'achievement.tenCommands',    descKey: 'achievement.tenCommandsDesc'    },
  { id: 'voice-explorer',  icon: '🎙️', titleKey: 'achievement.voiceExplorer',  descKey: 'achievement.voiceExplorerDesc'  },
  { id: 'jump-master',     icon: '🦘', titleKey: 'achievement.jumpMaster',     descKey: 'achievement.jumpMasterDesc'     },
  { id: 'wave-star',       icon: '👋', titleKey: 'achievement.waveStar',       descKey: 'achievement.waveStarDesc'       },
  { id: 'spin-king',       icon: '🔄', titleKey: 'achievement.spinKing',       descKey: 'achievement.spinKingDesc'       },
  { id: 'learning-pro',    icon: '📚', titleKey: 'achievement.learningPro',    descKey: 'achievement.learningProDesc'    },
  { id: 'star-collector',  icon: '⭐', titleKey: 'achievement.starCollector',  descKey: 'achievement.starCollectorDesc'  },
  { id: 'movement-hero',   icon: '🏆', titleKey: 'achievement.movementHero',   descKey: 'achievement.movementHeroDesc'   },
  { id: 'multilingual',    icon: '🌍', titleKey: 'achievement.multilingual',   descKey: 'achievement.multilingualDesc'   },
];

export const DEFAULT_ACHIEVEMENTS: Achievement[] = ACHIEVEMENTS_CONFIG.map(a => ({
  ...a,
  unlocked: false,
}));
