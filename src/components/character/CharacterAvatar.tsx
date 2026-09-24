import React, { useMemo, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Character, CharacterCommand, AnimationSpeed } from '../../types';

interface CharacterAvatarProps {
  character: Character;
  command: CharacterCommand;
  speed: AnimationSpeed;
}

const SPEED_MAP: Record<AnimationSpeed, number> = {
  slow: 1.4,
  normal: 1.0,
  fast: 0.65,
};

// Map character ID to sprite filename prefix
function getCharacterPrefix(characterId: string): string {
  const map: Record<string, string> = {
    'girl-1': 'leyla',
    'girl-2': 'amara',
    'girl-3': 'mei',
    'girl-4': 'zara',
    'boy-1': 'tom',
    'boy-2': 'leo',
    'boy-3': 'ali',
    'boy-4': 'murad',
  };
  return map[characterId] || 'leyla';
}

export const CharacterAvatar: React.FC<CharacterAvatarProps> = ({ character, command, speed }) => {
  const duration = SPEED_MAP[speed];
  const prefix = getCharacterPrefix(character.id);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [character.id, command]);

  // Select 3D rendered sprite pose based on the active command
  const poseType = useMemo(() => {
    switch (command) {
      case 'jump':
      case 'stretch':
        return 'jumping';
      case 'wave':
      case 'point':
      case 'sing':
        return 'waving';
      case 'sit':
      case 'sleep':
      case 'read':
      case 'write':
        return 'sitting';
      case 'run':
        return 'running';
      case 'stand':
      case 'walkForward':
      case 'walkBackward':
      case 'moveLeft':
      case 'moveRight':
      case 'spin':
      case 'nod':
      case 'shakeHead':
      case 'clap':
      case 'dance':
      case 'stop':
      case 'idle':
      case 'laugh':
      case 'cry':
      case 'think':
      case 'draw':
      case 'count':
      case 'eat':
      case 'drink':
      default:
        return 'standing';
    }
  }, [command]);

  // Try transparent PNG first; if still converting, fallback to jpg
  const poseImage = useMemo(() => {
    if (imgError) {
      return `/assets/characters/${prefix}_${poseType}.jpg`;
    }
    return `/assets/characters/${prefix}_${poseType}.png`;
  }, [prefix, poseType, imgError]);

  // Motion variants for natural human physics
  const motionConfig = useMemo(() => {
    switch (command) {
      case 'jump':
        return {
          animate: {
            y: [0, -115, -135, -115, 0, 8, 0],
            scaleY: [1, 0.88, 1.12, 1.06, 0.92, 1.02, 1],
            scaleX: [1, 1.08, 0.92, 0.96, 1.08, 0.99, 1],
          },
          transition: {
            duration: duration * 1.1,
            times: [0, 0.2, 0.45, 0.65, 0.85, 0.93, 1],
            ease: 'easeInOut',
          },
          shadowAnimate: {
            scaleX: [1, 0.55, 0.35, 0.55, 1.25, 1],
            opacity: [0.65, 0.25, 0.12, 0.25, 0.75, 0.65],
          },
        };

      case 'wave':
        return {
          animate: {
            rotate: [0, 1.5, -1.5, 1.5, -1, 0],
            y: [0, -3, 0, -3, 0],
          },
          transition: {
            duration: duration * 1.0,
            repeat: Infinity,
            repeatType: 'loop' as const,
            ease: 'easeInOut',
          },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'sit':
        return {
          animate: {
            y: 38,
            scaleY: 0.96,
            scaleX: 1.02,
          },
          transition: {
            duration: duration * 0.7,
            ease: [0.34, 1.56, 0.64, 1],
          },
          shadowAnimate: { scaleX: 1.15, opacity: 0.75 },
        };

      case 'stand':
        return {
          animate: {
            y: [38, -8, 0],
            scaleY: [0.96, 1.05, 1],
            scaleX: [1.02, 0.98, 1],
          },
          transition: {
            duration: duration * 0.75,
            ease: 'easeOut',
          },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'run':
        return {
          animate: {
            x: [-60, 60, -60],
            y: [0, -14, 0, -14, 0],
            rotate: [2, -2, 2],
          },
          transition: {
            duration: duration * 1.6,
            repeat: Infinity,
            repeatType: 'loop' as const,
            ease: 'easeInOut',
          },
          shadowAnimate: {
            scaleX: [0.9, 1.1, 0.9],
            opacity: [0.6, 0.7, 0.6],
          },
        };

      case 'walkForward':
        return {
          animate: {
            y: [0, 42],
            scale: [1, 1.15],
          },
          transition: {
            duration: duration * 1.2,
            ease: 'easeInOut',
          },
          shadowAnimate: { scaleX: 1.15, opacity: 0.7 },
        };

      case 'walkBackward':
        return {
          animate: {
            y: [0, -36],
            scale: [1, 0.88],
          },
          transition: {
            duration: duration * 1.2,
            ease: 'easeInOut',
          },
          shadowAnimate: { scaleX: 0.88, opacity: 0.55 },
        };

      case 'moveLeft':
        return {
          animate: {
            x: [0, -80, -70],
            y: [0, -8, 0],
          },
          transition: {
            duration: duration * 0.9,
            ease: 'easeOut',
          },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'moveRight':
        return {
          animate: {
            x: [0, 80, 70],
            y: [0, -8, 0],
          },
          transition: {
            duration: duration * 0.9,
            ease: 'easeOut',
          },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'spin':
        return {
          animate: {
            rotateY: [0, 180, 360],
            y: [0, -24, 0],
          },
          transition: {
            duration: duration * 1.2,
            ease: 'easeInOut',
          },
          shadowAnimate: {
            scaleX: [1, 0.6, 1],
            opacity: [0.65, 0.35, 0.65],
          },
        };

      case 'nod':
        return {
          animate: {
            y: [0, 8, 0, 8, 0],
            scaleY: [1, 0.97, 1, 0.97, 1],
          },
          transition: {
            duration: duration * 0.9,
            ease: 'easeInOut',
          },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'shakeHead':
        return {
          animate: {
            rotate: [0, -6, 6, -5, 5, 0],
          },
          transition: {
            duration: duration * 1.0,
            ease: 'easeInOut',
          },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'clap':
        return {
          animate: {
            y: [0, -12, 0, -12, 0],
            scaleY: [1, 1.04, 0.98, 1.04, 1],
          },
          transition: {
            duration: duration * 1.0,
            repeat: Infinity,
            repeatType: 'loop' as const,
            ease: 'easeInOut',
          },
          shadowAnimate: {
            scaleX: [1, 0.85, 1, 0.85, 1],
            opacity: [0.65, 0.45, 0.65, 0.45, 0.65],
          },
        };

      case 'dance':
        return {
          animate: {
            rotate: [0, -8, 8, -6, 6, 0],
            x: [0, -18, 18, -12, 12, 0],
            y: [0, -14, 0, -14, 0],
          },
          transition: {
            duration: duration * 1.4,
            repeat: Infinity,
            repeatType: 'loop' as const,
            ease: 'easeInOut',
          },
          shadowAnimate: {
            scaleX: [1, 0.85, 1.15, 0.9, 1],
            opacity: [0.65, 0.5, 0.7, 0.55, 0.65],
          },
        };

      case 'read':
        return {
          animate: {
            y: [38, 41, 38, 41, 38],
            rotate: [0, -2, 2, -2, 0],
          },
          transition: { duration: duration * 1.8, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: 1.15, opacity: 0.75 },
        };

      case 'write':
        return {
          animate: {
            y: [38, 40, 38],
            x: [0, 4, -4, 4, 0],
          },
          transition: { duration: duration * 1.0, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: 1.15, opacity: 0.75 },
        };

      case 'drink':
        return {
          animate: {
            y: [0, -6, -8, -6, 0],
            rotate: [0, 2, 4, 2, 0],
          },
          transition: { duration: duration * 1.4, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'eat':
        return {
          animate: {
            y: [0, -5, 0, -5, 0],
            scaleY: [1, 1.03, 0.97, 1.03, 1],
          },
          transition: { duration: duration * 1.1, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'sleep':
        return {
          animate: {
            rotate: [0, -6, -7, -6, 0],
            y: [38, 40, 42, 40, 38],
            scaleY: [0.96, 0.98, 0.96, 0.98, 0.96],
          },
          transition: { duration: duration * 2.8, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: 1.2, opacity: 0.75 },
        };

      case 'think':
        return {
          animate: {
            rotate: [0, 4, 5, 4, 0],
            y: [0, -4, -6, -4, 0],
          },
          transition: { duration: duration * 2.2, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'cry':
        return {
          animate: {
            y: [0, 8, 3, 8, 0],
            scaleY: [1, 0.96, 0.98, 0.96, 1],
          },
          transition: { duration: duration * 0.8, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: 1.05, opacity: 0.65 },
        };

      case 'laugh':
        return {
          animate: {
            y: [0, -14, 0, -14, 0],
            rotate: [0, -3, 3, -3, 0],
            scaleY: [1, 1.05, 0.97, 1.05, 1],
          },
          transition: { duration: duration * 0.85, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: [1, 0.9, 1, 0.9, 1], opacity: 0.65 },
        };

      case 'draw':
        return {
          animate: {
            x: [0, 10, -10, 8, -8, 0],
            y: [0, -5, 5, -3, 0],
          },
          transition: { duration: duration * 1.5, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'sing':
        return {
          animate: {
            scale: [1, 1.03, 0.98, 1.03, 1],
            y: [0, -8, 0, -8, 0],
            rotate: [0, 3, -3, 3, 0],
          },
          transition: { duration: duration * 1.3, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: [1, 0.95, 1, 0.95, 1], opacity: 0.65 },
        };

      case 'stretch':
        return {
          animate: {
            scaleY: [1, 1.12, 1.15, 1.12, 1],
            scaleX: [1, 0.92, 0.9, 0.92, 1],
            y: [0, -22, -26, -22, 0],
          },
          transition: { duration: duration * 1.8, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: [1, 0.8, 0.75, 0.8, 1], opacity: [0.65, 0.45, 0.4, 0.45, 0.65] },
        };

      case 'count':
        return {
          animate: {
            y: [0, -6, 0, -6, 0],
            scale: [1, 1.02, 1, 1.02, 1],
          },
          transition: { duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'point':
        return {
          animate: {
            x: [0, 18, 22, 18, 0],
            rotate: [0, 2, 3, 2, 0],
          },
          transition: { duration: duration * 1.2, repeat: Infinity, ease: 'easeInOut' },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'stop':
        return {
          animate: {
            x: 0,
            y: 0,
            scaleX: [1, 1.06, 0.98, 1],
          },
          transition: {
            duration: 0.4,
            ease: 'easeOut',
          },
          shadowAnimate: { scaleX: 1, opacity: 0.65 },
        };

      case 'idle':
      default:
        return {
          animate: {
            y: [0, -3, 0],
            scaleY: [1, 1.015, 1],
          },
          transition: {
            duration: 2.8,
            repeat: Infinity,
            repeatType: 'mirror' as const,
            ease: 'easeInOut',
          },
          shadowAnimate: {
            scaleX: [1, 1.02, 1],
            opacity: [0.65, 0.68, 0.65],
          },
        };
    }
  }, [command, duration]);

  // Action overlay config for animated command indicators & props
  const actionOverlay = useMemo(() => {
    switch (command) {
      case 'wave':
        return {
          emoji: '🖐️',
          animate: {
            rotate: [0, 30, -25, 30, -15, 0],
            scale: [1, 1.35, 1.1, 1.35, 1],
          },
          transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-10 -right-2',
          size: 'text-5xl sm:text-6xl',
        };
      case 'clap':
        return {
          emoji: '👏',
          animate: {
            scale: [0.7, 1.4, 0.9, 1.4, 0.7],
            rotate: [0, -5, 5, -5, 0],
          },
          transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-14 right-0',
          size: 'text-4xl sm:text-5xl',
        };
      case 'dance':
        return {
          emoji: '🎵',
          animate: {
            y: [-5, -30, -50],
            x: [0, 15, -10],
            opacity: [0, 1, 0],
            rotate: [0, 15, -10],
          },
          transition: { duration: 1.4, repeat: Infinity },
          position: 'top-4 left-2',
          size: 'text-3xl sm:text-4xl',
        };
      case 'jump':
        return {
          emoji: '⭐',
          animate: {
            scale: [0.5, 1.5, 0.8],
            opacity: [0, 1, 0],
            y: [-10, -40, -60],
          },
          transition: { duration: 0.9, delay: 0.3 },
          position: 'top-2 right-4',
          size: 'text-3xl sm:text-4xl',
        };
      case 'run':
        return {
          emoji: '💨',
          animate: {
            x: [0, -30, -50],
            opacity: [0, 0.8, 0],
            scale: [0.5, 1.2, 0.3],
          },
          transition: { duration: 0.7, repeat: Infinity, ease: 'easeOut' },
          position: 'bottom-8 -left-4',
          size: 'text-3xl sm:text-4xl',
        };
      case 'spin':
        return {
          emoji: '🌀',
          animate: {
            rotate: [0, 360],
            scale: [0.8, 1.2, 0.8],
          },
          transition: { duration: 1.0, repeat: Infinity, ease: 'linear' },
          position: 'top-6 right-2',
          size: 'text-3xl sm:text-4xl',
        };
      case 'read':
        return {
          emoji: '📖',
          animate: {
            scale: [0.95, 1.1, 0.95],
            rotate: [0, -3, 3, 0],
          },
          transition: { duration: 1.5, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-24 right-4',
          size: 'text-5xl sm:text-6xl',
        };
      case 'write':
        return {
          emoji: '✏️',
          animate: {
            rotate: [0, 15, -10, 15, 0],
            x: [0, 8, -6, 8, 0],
          },
          transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-20 right-2',
          size: 'text-4xl sm:text-5xl',
        };
      case 'draw':
        return {
          emoji: '🎨',
          animate: {
            scale: [0.9, 1.2, 0.9],
            rotate: [0, 10, -10, 0],
          },
          transition: { duration: 1.3, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-16 -right-2',
          size: 'text-4xl sm:text-5xl',
        };
      case 'sing':
        return {
          emoji: '🎤',
          animate: {
            scale: [1, 1.25, 1],
            rotate: [0, -10, 10, 0],
          },
          transition: { duration: 1.0, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-12 -right-2',
          size: 'text-4xl sm:text-5xl',
        };
      case 'eat':
        return {
          emoji: '🍎',
          animate: {
            y: [0, -8, 0],
            scale: [0.9, 1.15, 0.9],
          },
          transition: { duration: 1.0, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-16 -right-2',
          size: 'text-4xl sm:text-5xl',
        };
      case 'drink':
        return {
          emoji: '🥤',
          animate: {
            rotate: [0, -15, 0],
            y: [0, -6, 0],
          },
          transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-16 -right-2',
          size: 'text-4xl sm:text-5xl',
        };
      case 'sleep':
        return {
          emoji: '💤',
          animate: {
            y: [0, -25, -45],
            x: [0, 10, 20],
            opacity: [0, 1, 0],
            scale: [0.6, 1.2, 0.8],
          },
          transition: { duration: 2.0, repeat: Infinity, ease: 'easeOut' },
          position: 'top-2 right-4',
          size: 'text-4xl sm:text-5xl',
        };
      case 'think':
        return {
          emoji: '💡',
          animate: {
            scale: [0.8, 1.3, 0.9],
            opacity: [0.6, 1, 0.7],
          },
          transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-2 left-6',
          size: 'text-4xl sm:text-5xl',
        };
      case 'cry':
        return {
          emoji: '💧',
          animate: {
            y: [0, 25, 45],
            opacity: [0, 1, 0],
            scale: [0.7, 1.2, 0.9],
          },
          transition: { duration: 1.0, repeat: Infinity, ease: 'easeIn' },
          position: 'top-14 right-6',
          size: 'text-3xl sm:text-4xl',
        };
      case 'laugh':
        return {
          emoji: '😂',
          animate: {
            scale: [0.9, 1.3, 0.9],
            rotate: [-5, 5, -5],
          },
          transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-10 -right-2',
          size: 'text-4xl sm:text-5xl',
        };
      case 'count':
        return {
          emoji: '🔢',
          animate: {
            scale: [0.8, 1.3, 1],
            y: [-5, -20, -5],
          },
          transition: { duration: 1.2, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-6 right-2',
          size: 'text-4xl sm:text-5xl',
        };
      case 'point':
        return {
          emoji: '👉',
          animate: {
            x: [0, 20, 0],
            scale: [1, 1.2, 1],
          },
          transition: { duration: 0.9, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-16 -right-6',
          size: 'text-4xl sm:text-5xl',
        };
      case 'stretch':
        return {
          emoji: '✨',
          animate: {
            scale: [0.6, 1.5, 0.6],
            opacity: [0.4, 1, 0.4],
            rotate: [0, 180, 360],
          },
          transition: { duration: 1.4, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-2 left-4',
          size: 'text-4xl sm:text-5xl',
        };
      case 'sit':
        return {
          emoji: '🪑',
          animate: {
            y: [0, 10, 5],
            opacity: [0, 1, 0.8],
          },
          transition: { duration: 0.7, ease: 'easeOut' },
          position: 'top-12 right-2',
          size: 'text-2xl sm:text-3xl',
        };
      case 'stand':
        return {
          emoji: '🧍',
          animate: {
            y: [10, 0, -5],
            opacity: [0, 1, 0.8],
          },
          transition: { duration: 0.7, ease: 'easeOut' },
          position: 'top-6 right-2',
          size: 'text-2xl sm:text-3xl',
        };
      case 'nod':
        return {
          emoji: '👍',
          animate: {
            y: [0, 5, 0, 5, 0],
            scale: [1, 1.15, 1, 1.15, 1],
          },
          transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-8 right-0',
          size: 'text-3xl sm:text-4xl',
        };
      case 'shakeHead':
        return {
          emoji: '🙅',
          animate: {
            x: [-5, 5, -5, 5, 0],
            rotate: [-3, 3, -3, 3, 0],
          },
          transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-8 right-0',
          size: 'text-3xl sm:text-4xl',
        };
      case 'stop':
        return {
          emoji: '🛑',
          animate: {
            scale: [0.5, 1.3, 1.0],
            opacity: [0, 1, 0.8],
          },
          transition: { duration: 0.5, ease: 'easeOut' },
          position: 'top-8 right-0',
          size: 'text-3xl sm:text-4xl',
        };
      case 'walkForward':
        return {
          emoji: '👣',
          animate: {
            y: [0, 8, 0],
            scale: [0.9, 1.15, 0.9],
          },
          transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-8 right-2',
          size: 'text-2xl sm:text-3xl',
        };
      case 'walkBackward':
        return {
          emoji: '🔙',
          animate: {
            y: [0, -8, 0],
            scale: [1.1, 0.9, 1.1],
          },
          transition: { duration: 0.8, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-8 right-2',
          size: 'text-2xl sm:text-3xl',
        };
      case 'moveLeft':
        return {
          emoji: '⬅️',
          animate: {
            x: [0, -12, 0],
          },
          transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-8 -left-3',
          size: 'text-3xl sm:text-4xl',
        };
      case 'moveRight':
        return {
          emoji: '➡️',
          animate: {
            x: [0, 12, 0],
          },
          transition: { duration: 0.7, repeat: Infinity, ease: 'easeInOut' },
          position: 'top-8 -right-3',
          size: 'text-3xl sm:text-4xl',
        };
      default:
        return null;
    }
  }, [command]);

  return (
    <div className="relative flex flex-col items-center justify-end select-none">
      {/* Dynamic Floor Shadow beneath character */}
      <motion.div
        className="absolute -bottom-3 w-48 sm:w-56 h-9 rounded-full bg-black/35 blur-[6px] pointer-events-none z-0"
        animate={motionConfig.shadowAnimate as any}
        transition={{ duration: 0.3 }}
      />

      {/* Main Animated 3D Character Body */}
      <motion.div
        className="relative z-10 flex flex-col items-center origin-bottom will-change-transform"
        animate={motionConfig.animate as any}
        transition={motionConfig.transition as any}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={poseImage}
            src={poseImage}
            alt={character.name}
            onError={() => setImgError(true)}
            initial={{ opacity: 0.9, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0.9 }}
            transition={{ duration: 0.15 }}
            className="w-auto max-h-[74vh] h-[390px] sm:h-[440px] md:h-[480px] lg:h-[510px] object-contain drop-shadow-[0_14px_22px_rgba(0,0,0,0.24)] pointer-events-none"
            draggable={false}
          />
        </AnimatePresence>

        {/* Action Overlay - Animated emoji/icon for each command */}
        <AnimatePresence>
          {actionOverlay && (
            <motion.div
              key={`overlay-${command}`}
              initial={{ opacity: 0, scale: 0.3 }}
              animate={actionOverlay.animate as any}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={actionOverlay.transition as any}
              className={`absolute ${actionOverlay.position} ${actionOverlay.size} filter drop-shadow-xl pointer-events-none z-20`}
            >
              {actionOverlay.emoji}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Dynamic Jump Dust / Landing FX */}
        {command === 'jump' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.6, 2.0] }}
            transition={{ duration: 0.6, delay: duration * 0.7 }}
            className="absolute bottom-0 w-36 h-6 rounded-full bg-white/40 blur-sm pointer-events-none"
          />
        )}

        {/* Extra sing / dance music notes */}
        {(command === 'dance' || command === 'sing') && (
          <motion.div
            initial={{ opacity: 0, y: 0 }}
            animate={{ opacity: [0, 1, 0], y: [-10, -35], x: [10, -15] }}
            transition={{ duration: 1.6, repeat: Infinity, delay: 0.7 }}
            className="absolute top-8 right-4 text-2xl sm:text-3xl filter drop-shadow"
          >
            🎶
          </motion.div>
        )}

        {/* Wave sparkles */}
        {command === 'wave' && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.5 }}
            animate={{ opacity: [0, 1, 0], y: [-5, -25], scale: [0.8, 1.2, 0.6] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: 0.2 }}
            className="absolute top-16 left-2 text-2xl sm:text-3xl filter drop-shadow"
          >
            ✨
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CharacterAvatar;
