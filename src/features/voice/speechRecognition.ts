import type { CharacterCommand } from '../../types';
import { VOICE_COMMANDS } from '../../config/voiceCommands';
import type { Language } from '../../types';

function normalize(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[.,!?;:'"()]/g, '')
    .replace(/\s+/g, ' ');
}

export function parseVoiceCommand(transcript: string, language: Language): CharacterCommand | null {
  const normalized = normalize(transcript);

  // First pass: exact match
  for (const [command, langMap] of Object.entries(VOICE_COMMANDS)) {
    const phrases = langMap[language] as string[];
    for (const phrase of phrases) {
      if (normalized === normalize(phrase)) {
        return command as CharacterCommand;
      }
    }
  }

  // Second pass: contains match (check longer phrases first)
  const allPhrases: { command: CharacterCommand; phrase: string }[] = [];
  for (const [command, langMap] of Object.entries(VOICE_COMMANDS)) {
    const phrases = langMap[language] as string[];
    for (const phrase of phrases) {
      allPhrases.push({ command: command as CharacterCommand, phrase: normalize(phrase) });
    }
  }
  allPhrases.sort((a, b) => b.phrase.length - a.phrase.length);

  for (const { command, phrase } of allPhrases) {
    if (normalized.includes(phrase)) {
      return command;
    }
  }

  // Third pass: word-level fuzzy match
  const words = normalized.split(' ');
  for (const word of words) {
    for (const { command, phrase } of allPhrases) {
      const phraseWords = phrase.split(' ');
      if (phraseWords.some(pw => pw === word && pw.length > 2)) {
        return command;
      }
    }
  }

  return null;
}
