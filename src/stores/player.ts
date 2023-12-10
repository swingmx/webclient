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

const audio = new Audio();

export const usePlayer = defineStore("player", () => {
  const tabs = useTabs();
  const queue = useQueue();
  const colors = useColors();
  const lyrics = useLyrics();
  const toast = useNotifStore();
  const settings = useSettings();
  const tracklist = useTracklist();

  let sourceTime = 0;
  let lastTime = 0;

  const buffering = ref(false);

  function setVolume(new_value: number) {
    audio.volume = new_value;
  }

  function setMute(new_value: boolean) {
    audio.muted = new_value;
  }

  audio.onerror = (err: Event | string) => {
    const { showNotification } = useNotifStore();

    if (typeof err != "string") {
      err.stopImmediatePropagation();
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

  audio.oncanplay = () => {
    if (!queue.playing) {
      audio.pause();
      return;
    }
    queue.setFullDuration(audio.duration);

    audio
      .play()
      .then(() => {
        updateMediaNotif();
        colors.setTheme1Color(
          paths.images.thumb.small + queue.currenttrack.image
        );

        if (tabs.nowplaying == tabs.tabs.lyrics) {
          return lyrics.getLyrics();
        }

        if (!settings.use_lyrics_plugin) {
          lyrics.checkExists(
            queue.currenttrack.filepath,
            queue.currenttrack.trackhash
          );
        }
      })
      .catch((e) => {
        if (e instanceof DOMException) {
          queue.playPause();

          return toast.showNotification(
            "Tap anywhere in the page and try again (autoplay blocked))",
            NotifType.Error
          );
        }

        toast.showNotification(
          "Can't play: " + queue.currenttrack.title,
          NotifType.Error
        );
      });
  };

  audio.onended = () => {
    const { submitData, setTimestamp } = useTracker();
    submitData();
    setTimestamp();

    queue.autoPlayNext();
  };

  audio.onplay = () => {
    // reset sourceTime to prevent false positives
    const date = new Date();
    sourceTime = date.getTime();
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

  audio.ontimeupdate = () => {
    tick();
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

    audio.autoplay = true;
    audio.pause();
    audio.src = uri;
  }

  return {
    audio,
    buffering,
    setMute,
    setVolume,
    playCurrent,
  };
});

export { audio };
