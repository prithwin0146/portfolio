import { Howl } from 'howler';

// Store audio instances
let isMuted = false;

const sounds = {
  hover: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3'], // Subtle mechanical click
    volume: 0.1,
  }),
  success: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/1042/1042-preview.mp3'], // Sci-fi chime
    volume: 0.2,
  }),
  levelUp: new Howl({
    src: ['https://assets.mixkit.co/active_storage/sfx/2018/2018-preview.mp3'], // Grand level up
    volume: 0.3,
  })
};

export const audioService = {
  playHover: () => {
    if (!isMuted) sounds.hover.play();
  },
  playSuccess: () => {
    if (!isMuted) sounds.success.play();
  },
  playLevelUp: () => {
    if (!isMuted) sounds.levelUp.play();
  },
  toggleMute: () => {
    isMuted = !isMuted;
    Howler.mute(isMuted);
    return isMuted;
  },
  isMuted: () => isMuted
};
