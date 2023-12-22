import { ref } from "vue";
import { defineStore } from "pinia";

import useTabs from "./tabs";
import useQueue from "./queue";
import useLyrics from "./lyrics";
import useColors from "./colors";
import useSettings from "./settings";
import useTracklist from "./queue/tracklist";
import useTracker from "./tracker";

import { NotifType, useNotifStore } from "./notification";

import { paths } from "../config";
import updateMediaNotif from "@/helpers/mediaNotification";
import getSilence from "@/requests/files";

function getUrl(filepath: string, trackhash: string) {
  return `${paths.api.files}/${trackhash}?filepath=${encodeURIComponent(
    filepath
  )}`;
}

function crossFade(
  audio: HTMLAudioElement,
  duration = 1000,
  start_volume = 0,
  then_destroy = false
) {
  audio.volume = start_volume;
  const fadeSteps = duration / 100;
  const fadeStepTime = duration / fadeSteps;
  const is_up = start_volume == 0;

  const volumeStep = is_up ? 1 / fadeSteps : audio.volume / fadeSteps;
  console.log(audio.volume, fadeSteps, fadeStepTime, volumeStep);

  const interval = setInterval(() => {
    is_up ? (audio.volume += volumeStep) : (audio.volume -= volumeStep);
  }, fadeStepTime);

  setTimeout(() => {
    clearInterval(interval);

    if (then_destroy) {
      audio = null;
    }
  }, duration);
}

let audio = new Audio();

export const usePlayer = defineStore("player", () => {
  const tabs = useTabs();
  const queue = useQueue();
  const colors = useColors();
  const lyrics = useLyrics();
  const toast = useNotifStore();
  const settings = useSettings();
  const tracklist = useTracklist();

  const crossfade_duration = 2000;
  let currentAudio = {
    filepath: "",
    silence: {
      start: 0,
      end: 0,
    },
  };

  let nextAudio = {
    filepath: "",
    audio: new Audio(),
    loaded: false,
    ticking: false,
    silence: {
      start: 0,
      end: 0,
    },
  };

  function clearNextAudio() {
    nextAudio.filepath = "";
    nextAudio.audio = new Audio();
    nextAudio.loaded = false;
    nextAudio.ticking = false;
    nextAudio.silence = {
      start: 0,
      end: 0,
    };
  }

  let sourceTime = 0;
  let lastTime = 0;

  const buffering = ref(false);

  function setVolume(new_value: number) {
    audio.volume = new_value;
  }

  function setMute(new_value: boolean) {
    audio.muted = new_value;
  }

  const audio_onerror = (err: Event | string) => {
    const { showNotification } = useNotifStore();

    if (typeof err != "string") {
      err.stopImmediatePropagation();
    }

    if (err instanceof DOMException) {
      queue.playPause();

      return toast.showNotification(
        "Tap anywhere in the page and try again (autoplay blocked))",
        NotifType.Error
      );
    }

    showNotification(
      "Can't play: " + queue.currenttrack.title,
      NotifType.Error
    );

    if (queue.currentindex !== tracklist.tracklist.length - 1) {
      if (!queue.playing) return;

      // if (queue.currenttrack.trackhash !== track.trackhash) return;
      setTimeout(() => {
        queue.playNext();
      }, 3000);
      return;
    }

    // TODO: move this to a queue action
    queue.setPlaying(false);
  };

  // const audio_play_then_catch = (e: Event) => {
  //   if (e instanceof DOMException) {
  //     queue.playPause();

  //     return toast.showNotification(
  //       "Tap anywhere in the page and try again (autoplay blocked))",
  //       NotifType.Error
  //     );
  //   }

  //   toast.showNotification(
  //     "Can't play: " + queue.currenttrack.title,
  //     NotifType.Error
  //   );
  // };

  const audio_play_then = async () => {
    console.log("audio play then ....");
    if (queue.duration.current <= 4) {
      crossFade(audio, crossfade_duration, 0);
    }

    updateMediaNotif();
    colors.setTheme1Color(paths.images.thumb.small + queue.currenttrack.image);

    if (tabs.nowplaying == tabs.tabs.lyrics) {
      return lyrics.getLyrics();
    }

    if (!settings.use_lyrics_plugin) {
      lyrics.checkExists(
        queue.currenttrack.filepath,
        queue.currenttrack.trackhash
      );
    }

    if (currentAudio.filepath !== queue.currenttrack.filepath) {
      const silence = await getSilence(queue.currenttrack.filepath);
      currentAudio.silence = silence;
      console.log(silence);
    }
  };

  const audio_oncanplay = () => {
    console.log("can play");
    if (!queue.playing) {
      audio.pause();
      return;
    }
    queue.setFullDuration(audio.duration);

    audio.play();

    // .then(audio_play_then).catch(audio_play_then_catch);
  };

  const audio_onended = () => {
    const { submitData, setTimestamp } = useTracker();
    submitData();
    setTimestamp();
    console.log("track ended");
    queue.autoPlayNext();
  };

  const audio_onplay = () => {
    // reset sourceTime to prevent false positives
    const date = new Date();
    sourceTime = date.getTime();

    audio_play_then();
  };

  const tick = () => {
    if (!lyrics.exists || tabs.nowplaying !== tabs.tabs.lyrics) return;

    const millis = Math.round(audio.currentTime * 1000);
    const diff = lyrics.nextLineTime - millis;

    if (diff < 0) {
      const line = lyrics.calculateCurrentLine();
      lyrics.setCurrentLine(line + 1, false);
      return;
    }

    if (diff < 1200) {
      // set timer to next line
      if (
        lyrics.lyrics &&
        !(lyrics.lyrics.length <= lyrics.currentLine + 1) &&
        !lyrics.ticking
      ) {
        lyrics.setNextLineTimer(diff);
      }
    }
  };

  const next_canplay_handler = async () => {
    console.log(nextAudio.audio.currentTime);
    const silence = await getSilence(queue.next.filepath);
    nextAudio.silence = silence;
    nextAudio.loaded = silence !== null;
    console.log(silence);
    console.log("next track loaded ... ✅: ", silence !== null);
  };

  let nextTrackHash = "";

  function loadNextTrack() {
    console.log("^^^^^^^^^^^");
    if (nextTrackHash === queue.next.trackhash) return;

    nextTrackHash = queue.next.trackhash;
    console.log("loading next track: ", queue.next.title);

    const uri = getUrl(queue.next.filepath, queue.next.trackhash);
    nextAudio.audio = new Audio(uri);
    nextAudio.filepath = queue.next.filepath;
    nextAudio.audio.oncanplay = next_canplay_handler;
    nextAudio.audio.load();
  }

  function moveLoadedForward() {
    clearEventHandlers();

    const oldAudio = audio;
    crossFade(oldAudio, crossfade_duration, audio.volume, true);

    audio = nextAudio.audio;
    audio.currentTime = nextAudio.silence.start / 1000;
    currentAudio.silence = nextAudio.silence;
    currentAudio.filepath = nextAudio.filepath;

    clearNextAudio();
    queue.moveForward();
    assignEventHandlers();
  }

  const nextTrackLoader = () => {
    const currentTime = audio.currentTime;

    // if track has less than 20 seconds left, load next track
    if (audio.duration - currentTime > 20) {
      return;
    }

    if (!nextAudio.loaded) {
      console.log("loading next track");
      loadNextTrack();
    }

    console.log(nextAudio.loaded, !nextAudio.ticking, currentAudio.silence.end);
    console.log(nextAudio);

    if (nextAudio.loaded && !nextAudio.ticking && currentAudio.silence.end) {
      const diff =
        currentAudio.silence.end - Math.floor(audio.currentTime * 1000);
      console.log(diff, audio.duration);

      const newdiff =
        crossfade_duration > diff ? diff : diff - crossfade_duration;

      if (diff > 0) {
        nextAudio.ticking = true;
        setTimeout(() => {
          nextAudio.ticking = false;
          if (!queue.playing && nextAudio.filepath == queue.next.filepath)
            return;
          moveLoadedForward();
        }, newdiff);
      }
    }
  };

  const audio_ontimeupdate = () => {
    tick();
    nextTrackLoader();
    queue.setCurrentDuration(audio.currentTime);

    const date = new Date();
    sourceTime = date.getTime();
  };

  const compare = () => {
    const difference = Math.abs(sourceTime - lastTime);

    if (difference > 600 && queue.playing) {
      buffering.value = true;
      return;
    }

    buffering.value = false;
  };

  const updateTime = () => {
    if (!queue.playing) return;
    const date = new Date();
    lastTime = date.getTime();
    compare();
  };

  // Loader will misbehave on HMR because of multiple setInterval calls
  setInterval(() => {
    if (!queue.playing) {
      buffering.value = false;
      return;
    }

    updateTime();
  }, 100);

  function playCurrent() {
    const { currenttrack: track } = queue;
    const uri = `${paths.api.files}/${
      track.trackhash
    }?filepath=${encodeURIComponent(track.filepath as string)}`;

    // audio.autoplay = true;
    // audio.play();
    // audio.pause();
    audio.src = uri;
  }

  const assignEventHandlers = () => {
    audio.onerror = audio_onerror;
    audio.oncanplay = audio_oncanplay;
    audio.onended = audio_onended;
    audio.onplay = audio_onplay;
    audio.ontimeupdate = audio_ontimeupdate;
  };

  const clearEventHandlers = () => {
    audio.onerror = null;
    audio.oncanplay = null;
    audio.onended = null;
    audio.onplay = null;
    audio.ontimeupdate = null;
  };

  assignEventHandlers();

  return {
    audio,
    buffering,
    setMute,
    setVolume,
    playCurrent,
    clearNextAudio,
  };
});

export { audio };
