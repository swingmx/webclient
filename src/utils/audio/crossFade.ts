import useSettings from "../../stores/settings";

/**
 * Cross-fades the volume of an HTMLAudioElement over a specified duration.
 * @param audio - The HTMLAudioElement to cross-fade.
 * @param duration - The duration of the cross-fade in milliseconds. Default is 1000ms.
 * @param start_volume - The starting volume of the audio. Default is 0.
 * @param then_destroy - Specifies whether to destroy the audio element after the cross-fade ends. Default is false.
 */
export function crossFade({
  audio,
  duration = 1000,
  start_volume = 0,
  then_destroy = false,
}: {
  audio: HTMLAudioElement;
  duration?: number;
  start_volume?: number;
  then_destroy?: boolean;
}) {
  let interval: any = null;
  const { volume, use_crossfade } = useSettings();

  if (audio.muted || duration < 1000 || !use_crossfade) {
    audio.volume = volume;
    endCrossfade();
    return;
  }

  audio.volume = start_volume;
  const fadeStepTime = 100;
  const fadeSteps = duration / fadeStepTime;
  const volumeStep = volume / fadeSteps;
  const is_up = start_volume == 0;

  function incrementOrDecrement() {
    const v = audio.volume;
    const newVolume = is_up ? v + volumeStep : v - volumeStep;

    if (newVolume > 1) {
      audio.volume = 1;
      return;
    }

    if (newVolume < 0) {
      audio.volume = 0;
      return;
    }

    audio.volume = newVolume;
  }

  let counter = 0;

  interval = setInterval(() => {
    if (counter == fadeSteps) {
      return endCrossfade();
    }

    incrementOrDecrement();
    counter++;
  }, fadeStepTime);

  function endCrossfade() {
    clearInterval(interval);

    if (then_destroy) {
      audio.pause();
      audio.src = "";
      // @ts-ignore
      audio = null;
    }
  }
}
