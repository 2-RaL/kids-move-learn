export type Language = 'az' | 'en' | 'ru';

export type CharacterCommand =
  | 'idle'
  | 'sit'
  | 'stand'
  | 'walkForward'
  | 'walkBackward'
  | 'moveLeft'
  | 'moveRight'
  | 'jump'
  | 'wave'
  | 'nod'
  | 'shakeHead'
  | 'spin'
  | 'run'
  | 'stop'
  | 'clap'
  | 'dance'
  | 'read'
  | 'write'
  | 'drink'
  | 'eat'
  | 'sleep'
  | 'think'
  | 'cry'
  | 'laugh'
  | 'draw'
  | 'sing'
  | 'stretch'
  | 'count'
  | 'point';

export type Gender = 'girl' | 'boy';

export interface Character {
  id: string;
  name: string;
  gender: Gender;
  skinTone: string;
  hairColor: string;
  hairStyle: string;
  outfitColor: string;
  outfitAccent: string;
  eyeColor: string;
  hasGlasses: boolean;
  hasHijab: boolean;
  thumbnail?: string;
}

export interface CommandDefinition {
  command: CharacterCommand;
  icon: string;
  color: string;
  gradient: string;
}

export type VoiceState =
  | 'idle'
  | 'listening'
  | 'processing'
  | 'recognized'
  | 'unknown'
  | 'denied'
  | 'unsupported';

export type GameMode = 'free' | 'learning';
export type Difficulty = 'easy' | 'normal' | 'hard';
export type AnimationSpeed = 'slow' | 'normal' | 'fast';

export interface Challenge {
  id: string;
  commands: CharacterCommand[];
  completed: boolean;
}

export interface CommandHistoryEntry {
  id: string;
  command: CharacterCommand;
  transcript?: string;
  timestamp: number;
  success: boolean;
  source: 'button' | 'voice';
}

export interface Achievement {
  id: string;
  icon: string;
  titleKey: string;
  descKey: string;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface GameState {
  language: Language;
  selectedCharacter: string | null;
  selectedGender: Gender;
  currentCommand: CharacterCommand;
  voiceState: VoiceState;
  lastTranscript: string;
  gameMode: GameMode;
  difficulty: Difficulty;
  animationSpeed: AnimationSpeed;
  stars: number;
  level: number;
  commandHistory: CommandHistoryEntry[];
  achievements: Achievement[];
  soundEnabled: boolean;
  isFullscreen: boolean;
  currentChallenge: Challenge | null;
  challengeProgress: number;
  totalChallenges: number;
  showAchievements: boolean;
  isLoading: boolean;
  feedbackMessage: string | null;
  feedbackType: 'success' | 'error' | 'info' | null;
}
