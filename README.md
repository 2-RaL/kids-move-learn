# 🌟 Kids Move & Learn (Uşaqlar üçün İnteraktiv Hərəkət Oyunu)

An interactive, educational movement game for children built with **React 18**, **TypeScript**, **Tailwind CSS**, **Framer Motion**, and **Web Speech API**. 

Children select an avatar, hear and speak voice commands in 3 languages (**Azerbaijani, English, Russian**), execute movements, solve movement challenges in Learning Mode, and earn stars, levels, and badges!

---

## ✨ Features

- **🧒 12 Diverse Characters:**
  - 6 girl characters and 6 boy characters with diverse skin tones, hairstyles, hair colors, glasses, and cultural attire (hijab, braids, curls, etc.).
- **🎭 15 Dynamic Movement Animations:**
  - Powered by Framer Motion & SVG: `Jump`, `Sit`, `Stand`, `Spin`, `Run`, `Walk Forward`, `Walk Backward`, `Move Left`, `Move Right`, `Stop`, `Wave`, `Nod`, `Shake Head`, `Clap`, `Dance`.
  - Independent motion rigging for body, head, left/right arms, left/right legs, and shadow.
  - Three adjustable speed settings: **Slow**, **Normal**, **Fast**.
- **🎙️ Trilingual Voice Recognition (Web Speech API):**
  - Speaks and understands commands in **Azerbaijani (AZ)**, **English (EN)**, and **Russian (RU)**.
  - Fuzzy-matching speech engine that tolerates child pronunciation variations.
  - Visual audio waveform and mic state indicators (idle, listening, recognized, unknown, unsupported).
- **🔊 Child-Friendly Synthesizer Audio & TTS:**
  - Browser-native Text-To-Speech (`SpeechSynthesis`) speaks cheerful encouragement and instructions in the chosen language.
  - Custom Web Audio API synthesizer chimes (pop, jump boing, star chime, fanfare) requiring no external audio files.
  - Confetti burst celebration using `canvas-confetti` when completing challenges and unlocking badges.
- **📚 Educational Learning Mode:**
  - Sequence-following movement challenges with Easy, Normal, and Hard difficulty levels.
  - Step-by-step visual command indicators with real-time completion tracking.
  - Generates randomized curriculum sequences based on difficulty.
- **🏆 Gamification System:**
  - Star collection system (5 stars per challenge, levels up every 50 stars).
  - 10 unlockable achievement badges (First Command, 10 Commands, Movement Hero, Voice Explorer, Jump Master, Wave Star, Spin King, Star Collector, Learning Pro, Multilingual).
  - Modal with unlocked timestamps and achievement descriptions.
- **🎨 Pixar/Disney-Inspired Child Aesthetic:**
  - Vibrant pastel colors, rounded glassmorphism cards, cheerful floating clouds, animated garden environment, 3D pushable buttons.
  - Clean responsive layout optimized for tablets, touchscreens, and desktops.

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- Modern web browser (Google Chrome, Microsoft Edge, or Safari with Web Speech API support)

### Installation

1. Navigate to the project directory:
   ```bash
   cd kids-move-learn
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your web browser.

4. Build for production:
   ```bash
   npm run build
   ```
   The optimized production bundle will be generated in the `dist/` directory.

---

## 🗣️ Voice Commands Guide

Click the microphone button and say any of the following commands:

| Command | 🇦🇿 Azerbaijani (AZ) | 🇬🇧 English (EN) | 🇷🇺 Russian (RU) |
|---|---|---|---|
| **Jump** | tullan, hopban, sıçra | jump, hop, bounce | прыгай, подпрыгни |
| **Sit** | otur, əyləş | sit, sit down | сядь, садись |
| **Stand** | qalx, ayağa qalx, dur | stand, stand up | встань, вставай |
| **Spin** | dön, fırlan, dövrə vur | spin, turn around, rotate | повернись, кружись |
| **Run** | qaç, yüyür | run, jog, sprint | беги, побежали |
| **Stop** | dayan, dur | stop, halt, freeze | стой, остановись |
| **Wave** | əl salla, salam ver | wave, say hello | помаши, привет |
| **Nod** | başını tərpət, hə de | nod, nod your head | кивни, кивни головой |
| **Shake Head** | başını salla, yox de | shake head, say no | покачай головой, нет |
| **Clap** | əl çal, alqışla | clap, applause | хлопай, в ладоши |
| **Dance** | rəqs et, oyna | dance, groove | танцуй, пляши |
| **Move Left** | sola get, sola | left, go left, move left | налево, влево |
| **Move Right** | sağa get, sağa | right, go right, move right | направо, вправо |
| **Walk Forward** | önə get, irəli get | forward, move forward | вперёд, иди вперёд |
| **Walk Backward**| geriyə get, dala get | backward, back, move back | назад, иди назад |

---

## 📁 Project Architecture

```
kids-move-learn/
├── public/
│   └── favicon.svg                  # Cheerful SVG favicon
├── src/
│   ├── assets/                      # Visual assets
│   ├── components/
│   │   ├── achievements/
│   │   │   └── AchievementsModal.tsx # Achievements gallery modal
│   │   ├── character/
│   │   │   ├── CharacterAvatar.tsx  # Dynamic SVG character with 15 Framer Motion rigs
│   │   │   ├── CharacterScene.tsx   # Garden scene with parallax background & clouds
│   │   │   └── CharacterSelector.tsx# Character selector with gender filters
│   │   ├── common/
│   │   │   ├── CommandHistory.tsx   # History of recent commands
│   │   │   └── LoadingScreen.tsx    # Kid-friendly animated loading screen
│   │   ├── layout/
│   │   │   ├── BottomControls.tsx   # Primary command buttons & speed controls
│   │   │   ├── Header.tsx           # Logo, mode toggle, stars, language switcher
│   │   │   ├── LeftPanel.tsx        # Avatar selection drawer
│   │   │   └── RightPanel.tsx       # Voice control, learning mode & command history
│   │   ├── learning/
│   │   │   └── ChallengeCard.tsx    # Interactive sequence challenge card
│   │   └── voice/
│   │       └── VoiceControl.tsx     # Voice recording status, mic button, waveforms
│   ├── config/
│   │   ├── achievements.ts          # Achievement definitions & badge criteria
│   │   ├── characters.ts            # 12 diverse character configurations
│   │   ├── commands.ts              # Command icons, themes, and identifiers
│   │   └── voiceCommands.ts         # Multilingual speech dictionaries (AZ, EN, RU)
│   ├── features/
│   │   ├── challenges/
│   │   │   └── challengeGenerator.ts# Difficulty-based sequence algorithm
│   │   └── voice/
│   │       └── speechRecognition.ts # Fuzzy phonetic command parser
│   ├── hooks/
│   │   └── useVoiceRecognition.ts   # Web Speech API hook with store synchronization
│   ├── locales/
│   │   ├── az.json                  # Azerbaijani translations
│   │   ├── en.json                  # English translations
│   │   └── ru.json                  # Russian translations
│   ├── store/
│   │   └── gameStore.ts             # Zustand global state (localStorage synced)
│   ├── types/
│   │   └── index.ts                 # Full TypeScript typings
│   ├── utils/
│   │   └── soundEffects.ts          # Web Audio API synthesizers + confetti FX
│   ├── App.tsx                      # Main application layout & keyboard controls
│   ├── i18n.ts                      # i18next multilingual configuration
│   ├── index.css                    # Tailwind setup, CSS keyframes, glassmorphism
│   ├── main.tsx                     # React root mount
│   └── vite-env.d.ts                # Vite environment typings
├── index.html                       # HTML5 entry with fonts and meta tags
├── package.json                     # NPM dependencies and scripts
├── tailwind.config.js               # Child-friendly color palette & typography tokens
├── tsconfig.json                    # Strict TypeScript configuration
└── vite.config.ts                   # Vite + React plugin configuration
```

---

## 🔒 Privacy & Safety

- **No Server Voice Processing:** Voice recognition runs 100% locally via your browser's native Web Speech API. No audio recordings are ever saved, stored, or sent to external servers.
- **Child Safe:** No ads, no in-app purchases, no external tracking.
- **Offline Capable:** Core game mechanics, animations, and sound effects work completely offline in modern browsers.

---

## 📄 License

MIT License. Designed and crafted for children everywhere to move, play, and learn!
