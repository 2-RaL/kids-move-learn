import { create } from 'zustand';
import type {
  GameState, Language, CharacterCommand, Gender,
  GameMode, Difficulty, AnimationSpeed, CommandHistoryEntry, Achievement,
} from '../types';
import { DEFAULT_ACHIEVEMENTS } from '../config/achievements';
import { CHARACTERS, DEFAULT_CHARACTER_ID } from '../config/characters';
import i18n from '../i18n';
import {
  playPopSound,
  playJumpSound,
  playStarSound,
  playAchievementSound,
  triggerConfetti,
} from '../utils/soundEffects';
import { playCommandAudio } from '../utils/commandAudio';

const STARS_PER_LEVEL = 50;

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw !== null) return JSON.parse(raw) as T;
  } catch {}
  return fallback;
}

function save(key: string, value: unknown) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

const initialState: GameState = {
  language: loadFromStorage<Language>('kml-language', 'az'),
  selectedCharacter: loadFromStorage<string | null>('kml-character', DEFAULT_CHARACTER_ID),
  selectedGender: loadFromStorage<Gender>('kml-gender', 'girl'),
  currentCommand: 'idle',
  voiceState: 'idle',
  lastTranscript: '',
  gameMode: 'free',
  difficulty: loadFromStorage<Difficulty>('kml-difficulty', 'easy'),
  animationSpeed: loadFromStorage<AnimationSpeed>('kml-speed', 'normal'),
  stars: loadFromStorage<number>('kml-stars', 0),
  level: loadFromStorage<number>('kml-level', 1),
  commandHistory: [],
  achievements: loadFromStorage<Achievement[]>('kml-achievements', DEFAULT_ACHIEVEMENTS),
  soundEnabled: loadFromStorage<boolean>('kml-sound', true),
  isFullscreen: false,
  currentChallenge: null,
  challengeProgress: 0,
  totalChallenges: loadFromStorage<number>('kml-total-challenges', 0),
  showAchievements: false,
  isLoading: true,
  feedbackMessage: null,
  feedbackType: null,
};

// Internal counters for achievements
const counters = {
  jumpCount: 0,
  waveCount: 0,
  spinCount: 0,
  totalCommands: loadFromStorage<number>('kml-total-commands', 0),
  voiceUsed: loadFromStorage<boolean>('kml-voice-used', false),
  usedLanguages: new Set<string>(loadFromStorage<string[]>('kml-used-langs', [])),
  challengesCompleted: loadFromStorage<number>('kml-challenges-done', 0),
};

interface GameActions {
  setLanguage: (lang: Language) => void;
  setCharacter: (id: string | null) => void;
  setGender: (gender: Gender) => void;
  executeCommand: (command: CharacterCommand, source?: 'button' | 'voice', transcript?: string) => void;
  setVoiceState: (state: GameState['voiceState']) => void;
  setLastTranscript: (t: string) => void;
  setGameMode: (mode: GameMode) => void;
  setDifficulty: (d: Difficulty) => void;
  setAnimationSpeed: (s: AnimationSpeed) => void;
  toggleSound: () => void;
  toggleFullscreen: () => void;
  clearHistory: () => void;
  setShowAchievements: (v: boolean) => void;
  setLoading: (v: boolean) => void;
  generateChallenge: () => void;
  checkChallengeCommand: (command: CharacterCommand) => void;
  setFeedback: (msg: string | null, type: GameState['feedbackType']) => void;
  addStars: (amount: number) => void;
  _unlockAchievement: (id: string) => void;
}

export const useGameStore = create<GameState & GameActions>((set, get) => ({
  ...initialState,

  setLanguage: (lang) => {
    i18n.changeLanguage(lang);
    save('kml-language', lang);
    counters.usedLanguages.add(lang);
    save('kml-used-langs', [...counters.usedLanguages]);
    set({ language: lang });
    // Check multilingual achievement
    if (counters.usedLanguages.size >= 3) {
      get()._unlockAchievement('multilingual');
    }
  },

  setCharacter: (id) => {
    save('kml-character', id);
    const char = CHARACTERS.find((c) => c.id === id);
    if (char) {
      save('kml-gender', char.gender);
      set({ selectedCharacter: id, selectedGender: char.gender });
    } else {
      set({ selectedCharacter: id });
    }
  },

  setGender: (gender) => {
    save('kml-gender', gender);
    set({ selectedGender: gender });
  },

  executeCommand: (command, source = 'button', transcript = '') => {
    const state = get();
    const entry: CommandHistoryEntry = {
      id: `${Date.now()}-${Math.random()}`,
      command,
      transcript,
      timestamp: Date.now(),
      success: true,
      source,
    };

    const newHistory = [entry, ...state.commandHistory].slice(0, 10);
    counters.totalCommands++;
    save('kml-total-commands', counters.totalCommands);

    if (command === 'jump') counters.jumpCount++;
    if (command === 'wave') counters.waveCount++;
    if (command === 'spin') counters.spinCount++;
    if (source === 'voice') {
      counters.voiceUsed = true;
      save('kml-voice-used', true);
    }

    set({ currentCommand: command, commandHistory: newHistory });

    // Check achievements
    const s = get();
    if (counters.totalCommands === 1) s._unlockAchievement('first-command');
    if (counters.totalCommands === 10) s._unlockAchievement('ten-commands');
    if (counters.totalCommands === 50) s._unlockAchievement('movement-hero');
    if (counters.voiceUsed && source === 'voice' && counters.totalCommands === 1) s._unlockAchievement('voice-explorer');
    if (source === 'voice' && !state.achievements.find(a => a.id === 'voice-explorer')?.unlocked) {
      s._unlockAchievement('voice-explorer');
    }
    if (counters.jumpCount >= 5) s._unlockAchievement('jump-master');
    if (counters.waveCount >= 5) s._unlockAchievement('wave-star');
    if (counters.spinCount >= 5) s._unlockAchievement('spin-king');

    // Audio feedback
    if (state.soundEnabled) {
      if (command === 'jump') {
        playJumpSound();
      } else if (command !== 'idle') {
        playPopSound();
      }
    }

    // Speech feedback using pre-recorded audio (supports AZ, EN, RU)
    if (state.soundEnabled && command !== 'idle') {
      const char = CHARACTERS.find((c) => c.id === state.selectedCharacter);
      const gender = char?.gender ?? state.selectedGender ?? 'girl';
      playCommandAudio(command, state.language, gender);
    }

    // Learning mode check
    if (state.gameMode === 'learning' && state.currentChallenge) {
      get().checkChallengeCommand(command);
    }
  },

  setVoiceState: (voiceState) => set({ voiceState }),
  setLastTranscript: (lastTranscript) => set({ lastTranscript }),
  setGameMode: (gameMode) => set({ gameMode }),
  setDifficulty: (difficulty) => {
    save('kml-difficulty', difficulty);
    set({ difficulty });
  },
  setAnimationSpeed: (animationSpeed) => {
    save('kml-speed', animationSpeed);
    set({ animationSpeed });
  },
  toggleSound: () => {
    const next = !get().soundEnabled;
    save('kml-sound', next);
    set({ soundEnabled: next });
  },
  toggleFullscreen: () => {
    const isFs = !get().isFullscreen;
    if (isFs) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    } else {
      document.exitFullscreen?.().catch(() => {});
    }
    set({ isFullscreen: isFs });
  },
  clearHistory: () => set({ commandHistory: [] }),
  setShowAchievements: (v) => set({ showAchievements: v }),
  setLoading: (v) => set({ isLoading: v }),

  setFeedback: (msg, type) => {
    set({ feedbackMessage: msg, feedbackType: type });
    if (msg) {
      setTimeout(() => set({ feedbackMessage: null, feedbackType: null }), 2500);
    }
  },

  addStars: (amount) => {
    const { stars, level, soundEnabled } = get();
    const newStars = stars + amount;
    const newLevel = Math.floor(newStars / STARS_PER_LEVEL) + 1;
    save('kml-stars', newStars);
    save('kml-level', newLevel);
    set({ stars: newStars, level: newLevel });
    if (soundEnabled) {
      playStarSound();
    }
    if (newStars >= 50) get()._unlockAchievement('star-collector');
  },

  generateChallenge: () => {
    const { difficulty, language } = get();
    const challenges = i18n.t(`challenge.${difficulty}`, { returnObjects: true }) as string[];
    const taskText = challenges[Math.floor(Math.random() * challenges.length)];

    // Parse commands from text (simplified mapping)
    const commandWords: Record<string, CharacterCommand> = {
      // AZ
      'tullan': 'jump', 'otur': 'sit', 'qalx': 'stand', 'dön': 'spin', 'qaç': 'run',
      'dayan': 'stop', 'əl salla': 'wave', 'sola get': 'moveLeft', 'sağa get': 'moveRight',
      'önə get': 'walkForward', 'geriyə get': 'walkBackward',
      // EN
      'jump': 'jump', 'sit': 'sit', 'stand': 'stand', 'turn': 'spin', 'run': 'run',
      'stop': 'stop', 'wave': 'wave', 'left': 'moveLeft', 'right': 'moveRight',
      'forward': 'walkForward', 'backward': 'walkBackward',
      // RU
      'прыгай': 'jump', 'сядь': 'sit', 'встань': 'stand', 'повернись': 'spin', 'беги': 'run',
      'стой': 'stop', 'помаши': 'wave', 'налево': 'moveLeft', 'направо': 'moveRight',
      'вперёд': 'walkForward', 'назад': 'walkBackward',
    };

    const lower = taskText.toLowerCase();
    const foundCommands: CharacterCommand[] = [];
    for (const [word, cmd] of Object.entries(commandWords)) {
      if (lower.includes(word)) foundCommands.push(cmd);
    }

    set({
      currentChallenge: {
        id: `${Date.now()}`,
        commands: foundCommands.length > 0 ? foundCommands : ['jump'],
        completed: false,
      },
      challengeProgress: 0,
    });
  },

  checkChallengeCommand: (command: CharacterCommand) => {
    const { currentChallenge, challengeProgress } = get();
    if (!currentChallenge) return;

    const expected = currentChallenge.commands[challengeProgress];
    if (command === expected) {
      const nextProgress = challengeProgress + 1;
      if (nextProgress >= currentChallenge.commands.length) {
        // Challenge complete!
        const total = get().totalChallenges + 1;
        counters.challengesCompleted = total;
        save('kml-challenges-done', total);
        save('kml-total-challenges', total);
        set({ totalChallenges: total, challengeProgress: nextProgress });
        get().addStars(5);
        triggerConfetti();
        get().setFeedback(i18n.t('challengeComplete'), 'success');
        if (counters.challengesCompleted >= 5) get()._unlockAchievement('learning-pro');
        setTimeout(() => get().generateChallenge(), 2000);
      } else {
        set({ challengeProgress: nextProgress });
      }
    }
  },

  // Internal
  _unlockAchievement: (id: string) => {
    const { achievements } = get();
    const idx = achievements.findIndex(a => a.id === id);
    if (idx === -1 || achievements[idx].unlocked) return;
    const next = [...achievements];
    next[idx] = { ...next[idx], unlocked: true, unlockedAt: Date.now() };
    save('kml-achievements', next);
    set({ achievements: next });
    triggerConfetti();
    if (get().soundEnabled) {
      playAchievementSound();
    }
  },
}));

