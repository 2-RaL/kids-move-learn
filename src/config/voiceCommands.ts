import type { CharacterCommand } from '../types';

export interface VoiceCommandMap {
  az: string[];
  en: string[];
  ru: string[];
}

export const VOICE_COMMANDS: Record<CharacterCommand, VoiceCommandMap> = {
  idle: {
    az: [],
    en: [],
    ru: [],
  },
  sit: {
    az: ['otur', 'otur aşağı', 'əyləş', 'oturmaq'],
    en: ['sit', 'sit down', 'take a seat', 'have a seat'],
    ru: ['сядь', 'садись', 'сесть', 'присядь'],
  },
  stand: {
    az: ['qalx', 'ayağa qalx', 'dur', 'ayaq üstə dur', 'qalxmaq'],
    en: ['stand', 'stand up', 'get up', 'rise', 'stand please'],
    ru: ['встань', 'вставай', 'поднимись', 'встать', 'подняться'],
  },
  walkForward: {
    az: ['irəli', 'irəli get', 'qabağa get', 'önə get', 'qabağa'],
    en: ['forward', 'go forward', 'move forward', 'come forward', 'walk forward', 'march forward'],
    ru: ['вперёд', 'иди вперёд', 'двигайся вперёд', 'шагай вперёд', 'марш вперёд'],
  },
  walkBackward: {
    az: ['geri', 'geriyə get', 'arxaya get', 'geri get', 'arxaya'],
    en: ['back', 'go back', 'move backward', 'step back', 'walk back', 'backwards'],
    ru: ['назад', 'иди назад', 'двигайся назад', 'шагай назад', 'отступи'],
  },
  moveLeft: {
    az: ['sola', 'sola get', 'sola hərəkət et', 'sola doğru'],
    en: ['left', 'go left', 'move left', 'step left', 'walk left'],
    ru: ['налево', 'иди налево', 'двигайся налево', 'шагай налево', 'влево'],
  },
  moveRight: {
    az: ['sağa', 'sağa get', 'sağa hərəkət et', 'sağa doğru'],
    en: ['right', 'go right', 'move right', 'step right', 'walk right'],
    ru: ['направо', 'иди направо', 'двигайся направо', 'шагай направо', 'вправо'],
  },
  jump: {
    az: ['tullan', 'hoppa', 'tullan yuxarı', 'zıpla', 'sıçra'],
    en: ['jump', 'jump up', 'leap', 'hop', 'bounce'],
    ru: ['прыгай', 'прыгни', 'подпрыгни', 'прыжок', 'скачи'],
  },
  wave: {
    az: ['əl salla', 'əlini salla', 'əl elə', 'əlini yellə', 'salam ver', 'əl ver'],
    en: ['wave', 'wave your hand', 'say hello', 'wave hello', 'wave hi'],
    ru: ['помаши', 'помаши рукой', 'помахай рукой', 'помахай', 'привет рукой'],
  },
  nod: {
    az: ['başını salla', 'başınla hə de', 'başını tərpət', 'hə de'],
    en: ['nod', 'nod your head', 'nod yes', 'shake your head yes'],
    ru: ['кивни', 'кивни головой', 'кивни да', 'кивай'],
  },
  shakeHead: {
    az: ['başını silk', 'yox de', 'xeyr de', 'başını sil'],
    en: ['shake head', 'shake your head', 'shake head no', 'no'],
    ru: ['покачай головой', 'покачай', 'нет', 'помотай головой'],
  },
  spin: {
    az: ['dön', 'yerində dön', 'fırlan', 'dövrə vur', 'fır vur'],
    en: ['turn', 'turn around', 'spin', 'spin around', 'rotate', 'twirl'],
    ru: ['повернись', 'крутись', 'обернись', 'покрутись', 'покружись'],
  },
  run: {
    az: ['qaç', 'qaçmağa başla', 'qaçış', 'sürətlə get'],
    en: ['run', 'start running', 'sprint', 'jog', 'run fast'],
    ru: ['беги', 'начни бежать', 'бегом', 'побеги', 'беги быстро'],
  },
  stop: {
    az: ['dayan', 'saxla', 'dur yerində', 'dayanmaq', 'hərəkət etmə'],
    en: ['stop', 'freeze', 'halt', 'stand still', 'dont move', "don't move"],
    ru: ['стой', 'остановись', 'стоп', 'замри', 'не двигайся'],
  },
  clap: {
    az: ['əl çal', 'alqışla', 'çap et'],
    en: ['clap', 'clap your hands', 'applaud'],
    ru: ['хлопай', 'похлопай', 'аплодируй'],
  },
  dance: {
    az: ['rəqs et', 'oyna', 'dans et'],
    en: ['dance', 'start dancing', 'boogie'],
    ru: ['танцуй', 'потанцуй', 'пляши'],
  },
  // Yeni komutlar
  read: {
    az: ['oxu', 'kitab oxu', 'oxumaq', 'kitab aç'],
    en: ['read', 'read a book', 'start reading', 'open a book'],
    ru: ['читай', 'читай книгу', 'открой книгу', 'почитай'],
  },
  write: {
    az: ['yaz', 'yazmaq', 'yazı yaz', 'qələm al'],
    en: ['write', 'start writing', 'write something', 'pick up pen'],
    ru: ['пиши', 'пиши что-нибудь', 'начни писать', 'возьми ручку'],
  },
  drink: {
    az: ['su iç', 'iç', 'içmək', 'su'],
    en: ['drink', 'drink water', 'have a drink', 'take a sip'],
    ru: ['пей', 'пей воду', 'попей', 'выпей воды'],
  },
  eat: {
    az: ['ye', 'yemək ye', 'yemək', 'aç'],
    en: ['eat', 'eat food', 'have a bite', 'start eating'],
    ru: ['ешь', 'кушай', 'поешь', 'начни есть'],
  },
  sleep: {
    az: ['yat', 'uzan', 'yatmaq', 'yuxula'],
    en: ['sleep', 'go to sleep', 'take a nap', 'lie down'],
    ru: ['спи', 'ложись спать', 'засыпай', 'ляг'],
  },
  think: {
    az: ['fikirləş', 'düşün', 'fikirləşmək', 'fikir'],
    en: ['think', 'start thinking', 'wonder', 'ponder'],
    ru: ['думай', 'подумай', 'размышляй', 'задумайся'],
  },
  cry: {
    az: ['ağla', 'ağlamaq', 'göz yaşı tök'],
    en: ['cry', 'start crying', 'be sad', 'weep'],
    ru: ['плачь', 'заплачь', 'поплачь', 'грусти'],
  },
  laugh: {
    az: ['gül', 'gülmək', 'gül hahaha', 'xoşhal ol'],
    en: ['laugh', 'start laughing', 'giggle', 'be happy'],
    ru: ['смейся', 'засмейся', 'хохочи', 'веселись'],
  },
  draw: {
    az: ['şəkil çək', 'çək', 'rəsm çək', 'rəsm et'],
    en: ['draw', 'start drawing', 'draw a picture', 'paint'],
    ru: ['рисуй', 'нарисуй', 'начни рисовать', 'порисуй'],
  },
  sing: {
    az: ['mahnı oxu', 'oxu mahnı', 'mahnı söylə', 'mahnı'],
    en: ['sing', 'start singing', 'sing a song', 'hum'],
    ru: ['пой', 'спой', 'запой', 'начни петь'],
  },
  stretch: {
    az: ['gərin', 'gərinmək', 'uzanış et', 'əzələləri gər'],
    en: ['stretch', 'do stretching', 'stretch out', 'limber up'],
    ru: ['потянись', 'растянись', 'сделай растяжку', 'разомнись'],
  },
  count: {
    az: ['say', 'saymaq', 'rəqəm say', 'bir iki üç'],
    en: ['count', 'start counting', 'count numbers', 'one two three'],
    ru: ['считай', 'посчитай', 'начни считать', 'раз два три'],
  },
  point: {
    az: ['göstər', 'barmağınla göstər', 'işarə et', 'göstərmək'],
    en: ['point', 'point at', 'point your finger', 'show me'],
    ru: ['покажи', 'укажи', 'покажи пальцем', 'укажи пальцем'],
  },
};
