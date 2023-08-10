const audio = new Audio();

export function setVolume(new_value: number) {
  audio.volume = new_value;
}

export function setMute(new_value: boolean) {
  audio.muted = new_value;
}

export default audio;
