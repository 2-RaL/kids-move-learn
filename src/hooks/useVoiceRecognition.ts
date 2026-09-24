import { useEffect, useRef, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { parseVoiceCommand } from '../features/voice/speechRecognition';
import { useTranslation } from 'react-i18next';

const SpeechRecognition =
  (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

const LANG_MAP: Record<string, string> = {
  az: 'az-AZ',
  en: 'en-US',
  ru: 'ru-RU',
};

export function useVoiceRecognition() {
  const { t } = useTranslation();
  const recognitionRef = useRef<any>(null);
  const { language, voiceState, setVoiceState, setLastTranscript, executeCommand, setFeedback } =
    useGameStore();

  const isSupported = !!SpeechRecognition;

  const startListening = useCallback(() => {
    if (!isSupported) {
      setVoiceState('unsupported');
      return;
    }
    if (voiceState === 'listening') return;

    const recognition = new SpeechRecognition();
    recognition.lang = LANG_MAP[language] || 'en-US';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 3;

    recognition.onstart = () => setVoiceState('listening');

    recognition.onresult = (event: any) => {
      setVoiceState('processing');
      const results = Array.from(event.results[0] as SpeechRecognitionResultList[0])
        .map((r: any) => r.transcript as string);

      let matched = null;
      for (const transcript of results) {
        setLastTranscript(transcript);
        matched = parseVoiceCommand(transcript, language);
        if (matched) break;
      }

      if (matched) {
        setVoiceState('recognized');
        setFeedback(t('commandUnderstood'), 'success');
        executeCommand(matched, 'voice', results[0]);
      } else {
        setVoiceState('unknown');
        setLastTranscript(results[0] || '');
        setFeedback(t('commandNotUnderstood'), 'error');
      }

      setTimeout(() => setVoiceState('idle'), 2500);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') {
        setVoiceState('denied');
      } else if (event.error === 'no-speech') {
        setVoiceState('idle');
      } else {
        setVoiceState('unknown');
        setTimeout(() => setVoiceState('idle'), 2000);
      }
    };

    recognition.onend = () => {
      if (useGameStore.getState().voiceState === 'listening') {
        setVoiceState('idle');
      }
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [isSupported, language, voiceState, setVoiceState, setLastTranscript, executeCommand, setFeedback, t]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setVoiceState('idle');
  }, [setVoiceState]);

  useEffect(() => {
    return () => recognitionRef.current?.abort();
  }, []);

  return { startListening, stopListening, isSupported, voiceState };
}
