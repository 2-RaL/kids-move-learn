import type { CharacterCommand } from '../types';
import type { Language } from '../types';

/**
 * Play pre-recorded TTS audio for a command in the given language.
 * Uses edge-tts generated MP3 files stored in /assets/audio/{lang}/{command}.mp3
 * This replaces browser SpeechSynthesis which doesn't support Azerbaijani (az-AZ).
 */

let currentAudio: HTMLAudioElement | null = null;

export function playCommandAudio(
  command: CharacterCommand,
  language: Language,
  gender: 'girl' | 'boy' = 'girl'
): void {
  if (command === 'idle') return;

  try {
    // Stop any currently playing audio
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
      currentAudio = null;
    }

    const genderAudioPath = `/assets/audio/${language}/${gender}/${command}.mp3`;
    const fallbackAudioPath = `/assets/audio/${language}/${command}.mp3`;

    const audio = new Audio(genderAudioPath);
    audio.volume = 0.85;
    audio.playbackRate = 1.0;

    audio.addEventListener('ended', () => {
      currentAudio = null;
    });

    audio.addEventListener('error', () => {
      // Try fallback if gender-specific audio is missing
      const fallback = new Audio(fallbackAudioPath);
      fallback.volume = 0.85;
      fallback.addEventListener('ended', () => { currentAudio = null; });
      fallback.addEventListener('error', () => { currentAudio = null; });
      currentAudio = fallback;
      fallback.play().catch(() => { currentAudio = null; });
    });

    currentAudio = audio;
    audio.play().catch(() => {
      currentAudio = null;
    });
  } catch {
    // Silently fail
  }
}

export function stopCommandAudio(): void {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}
