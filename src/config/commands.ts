import type { CommandDefinition } from '../types';

export const COMMANDS: CommandDefinition[] = [
  // Əsas hərəkətlər
  { command: 'sit',          icon: '🪑', color: '#7c3aed', gradient: 'bg-btn-purple' },
  { command: 'stand',        icon: '🧍', color: '#3b82f6', gradient: 'bg-btn-blue'   },
  { command: 'run',          icon: '🏃', color: '#f97316', gradient: 'bg-btn-orange' },
  { command: 'walkForward',  icon: '⬆️', color: '#10b981', gradient: 'bg-btn-green'  },
  { command: 'walkBackward', icon: '⬇️', color: '#f43f5e', gradient: 'bg-btn-coral'  },
  { command: 'moveLeft',     icon: '⬅️', color: '#8b5cf6', gradient: 'bg-btn-purple' },
  { command: 'moveRight',    icon: '➡️', color: '#f97316', gradient: 'bg-btn-orange' },
  { command: 'jump',         icon: '🦘', color: '#f59e0b', gradient: 'bg-btn-yellow' },
  { command: 'wave',         icon: '👋', color: '#06b6d4', gradient: 'bg-btn-cyan'   },
  { command: 'spin',         icon: '🔄', color: '#3b82f6', gradient: 'bg-btn-blue'   },
  { command: 'stop',         icon: '🛑', color: '#f43f5e', gradient: 'bg-btn-coral'  },
  { command: 'clap',         icon: '👏', color: '#f59e0b', gradient: 'bg-btn-yellow' },
  { command: 'dance',        icon: '💃', color: '#ec4899', gradient: 'bg-btn-pink'   },
  // İfadələr
  { command: 'nod',          icon: '👍', color: '#10b981', gradient: 'bg-btn-green'  },
  { command: 'shakeHead',    icon: '🙅', color: '#ec4899', gradient: 'bg-btn-pink'   },
  { command: 'laugh',        icon: '😂', color: '#f59e0b', gradient: 'bg-btn-yellow' },
  { command: 'cry',          icon: '😢', color: '#3b82f6', gradient: 'bg-btn-blue'   },
  { command: 'think',        icon: '🤔', color: '#8b5cf6', gradient: 'bg-btn-purple' },
  // Fəaliyyətlər
  { command: 'read',         icon: '📖', color: '#10b981', gradient: 'bg-btn-green'  },
  { command: 'write',        icon: '✏️', color: '#f97316', gradient: 'bg-btn-orange' },
  { command: 'draw',         icon: '🎨', color: '#ec4899', gradient: 'bg-btn-pink'   },
  { command: 'sing',         icon: '🎤', color: '#7c3aed', gradient: 'bg-btn-purple' },
  { command: 'count',        icon: '🔢', color: '#06b6d4', gradient: 'bg-btn-cyan'   },
  { command: 'point',        icon: '👆', color: '#f43f5e', gradient: 'bg-btn-coral'  },
  // Gündəlik
  { command: 'eat',          icon: '🍎', color: '#f43f5e', gradient: 'bg-btn-coral'  },
  { command: 'drink',        icon: '🥤', color: '#06b6d4', gradient: 'bg-btn-cyan'   },
  { command: 'sleep',        icon: '😴', color: '#8b5cf6', gradient: 'bg-btn-purple' },
  { command: 'stretch',      icon: '🙆', color: '#10b981', gradient: 'bg-btn-green'  },
];
