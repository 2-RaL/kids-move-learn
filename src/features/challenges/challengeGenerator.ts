import type { CharacterCommand } from '../../types';
import type { Difficulty } from '../../types';

const EASY_COMMANDS: CharacterCommand[] = ['jump', 'sit', 'stand', 'spin', 'run', 'stop', 'wave'];
const NORMAL_COMMANDS: CharacterCommand[] = [
  'moveLeft', 'moveRight', 'walkForward', 'walkBackward',
  'nod', 'shakeHead', 'clap',
];
const HARD_COMMANDS: CharacterCommand[] = [
  ...EASY_COMMANDS, ...NORMAL_COMMANDS, 'dance',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateChallengeCommands(difficulty: Difficulty): CharacterCommand[] {
  switch (difficulty) {
    case 'easy':
      return [randomFrom(EASY_COMMANDS)];
    case 'normal':
      return [randomFrom([...EASY_COMMANDS, ...NORMAL_COMMANDS]), randomFrom(EASY_COMMANDS)];
    case 'hard':
      return [
        randomFrom(HARD_COMMANDS),
        randomFrom(HARD_COMMANDS),
        randomFrom(EASY_COMMANDS),
      ].filter((c, i, arr) => arr.indexOf(c) === i); // unique
  }
}
