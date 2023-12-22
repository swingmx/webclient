import { defineStore } from "pinia";

import { favType } from "@/enums";
import { Track } from "@/interfaces";
import useInterface from "./interface";
import { isFavorite } from "@/requests/favorite";
import updateMediaNotif from "@/helpers/mediaNotification";

import useTabs from "./tabs";
import useLyrics from "./lyrics";
import useSettings from "./settings";
import useTracklist from "./queue/tracklist";
import { audio, usePlayer } from "@/stores/player";
import { NotifType, useNotifStore } from "./notification";

export default defineStore("Queue", {
  state: () => ({
    duration: {
      current: 0,
      full: 0,
    },
    currentindex: 0,
    playing: false,
  }),
  actions: {
    setPlaying(val: boolean) {
      this.playing = val;
    },
    setFullDuration(duration: number) {
      this.duration.full = duration;
    },
    setCurrentDuration(duration: number) {
      this.duration.current = duration;
    },
    play(index: number = 0) {
      const { tracklist } = useTracklist();
      if (tracklist.length === 0) return;

      this.playing = true;
      this.currentindex = index;

      const { playCurrent } = usePlayer();
      const { focusCurrentInSidebar } = useInterface();

      playCurrent();
      focusCurrentInSidebar();
    },
    playPause() {
      if (audio.src === "") {
        this.play(this.currentindex);
        return;
      }

      if (audio.paused && !this.playing) {
        audio.currentTime === 0 ? this.play(this.currentindex) : null;
        audio.play();
        this.playing = true;
        return;
      }

      audio.pause();
      this.playing = false;
    },
    autoPlayNext() {
      const settings = useSettings();
      const { focusCurrentInSidebar } = useInterface();
      const { tracklist } = useTracklist();
      const is_last = this.currentindex === tracklist.length - 1;

      if (settings.repeat_one) {
        this.play(this.currentindex);
        return;
      }

      if (settings.repeat_all) {
        this.play(is_last ? 0 : this.currentindex + 1);
        return;
      }

      const resetQueue = () => {
        this.currentindex = 0;
        audio.src = "";
        audio.pause();
        this.playing = false;

        updateMediaNotif();
        focusCurrentInSidebar();
      };

      !is_last ? this.play(this.currentindex + 1) : resetQueue();
    },
    playNext() {
      this.play(this.nextindex);
    },
    playPrev() {
      const lyrics = useLyrics();

      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        lyrics.setCurrentLine(-1);
        return;
      }

      this.play(this.previndex);
      usePlayer().clearNextAudio();
    },
    moveForward() {
      this.currentindex = this.nextindex;
    },
    seek(pos: number) {
      const tabs = useTabs();
      const lyrics = useLyrics();

      try {
        audio.currentTime = pos;
        this.duration.current = pos;
      } catch (error) {
        if (error instanceof TypeError) {
          console.error("Seek error: no audio");
        }
      }

      if (tabs.nowplaying == tabs.tabs.lyrics) {
        const line = lyrics.calculateCurrentLine();
        lyrics.setCurrentLine(line);
      }
    },

    playTrackNext(track: Track) {
      const Toast = useNotifStore();
      const { insertAt } = useTracklist();

      const nextindex = this.currentindex + 1;
      insertAt(track, nextindex);
      Toast.showNotification(`Added 1 track to queue`, NotifType.Success);
    },
    clearQueue() {
      const store = useTracklist();
      store.clearList();
      this.currentindex = 0;
    },
    shuffleQueue() {
      const { shuffleList } = useTracklist();
      const { focusCurrentInSidebar } = useInterface();

      shuffleList();
      this.currentindex = 0;
      this.play(this.currentindex);
      focusCurrentInSidebar();
    },
    removeFromQueue(index: number = 0) {
      const { tracklist, removeByIndex } = useTracklist();

      if (index === this.currentindex) {
        const is_last = index === tracklist.length - 1;
        const was_playing = this.playing;

        audio.src = "";
        // this.tracklist.splice(index, 1);

        if (is_last) {
          this.currentindex = 0;
        }

        if (was_playing) {
          this.playPause();
        }
        return;
      }

      removeByIndex(index);

      if (index < this.currentindex) {
        this.currentindex -= 1;
      }
    },
  },
  getters: {
    next(): Track {
      const { tracklist } = useTracklist();
      if (this.currentindex == tracklist.length - 1) {
        return tracklist[0];
      }

      return tracklist[this.currentindex + 1];
    },
    prev(): Track | undefined {
      const { tracklist } = useTracklist();
      if (this.currentindex === 0) {
        return tracklist[tracklist.length - 1];
      }

      return tracklist[this.currentindex - 1];
    },
    currenttrack(): Track {
      const { tracklist } = useTracklist();
      const current = tracklist[this.currentindex];

      isFavorite(current?.trackhash || "", favType.track).then((is_fav) => {
        if (current) {
          current.is_favorite = is_fav;
        }
      });

      return current;
    },
    currenttrackhash(): string {
      return this.currenttrack?.trackhash || "";
    },
    previndex(): number {
      const { tracklist } = useTracklist();
      return this.currentindex === 0
        ? tracklist.length - 1
        : this.currentindex - 1;
    },
    nextindex(): number {
      const { tracklist } = useTracklist();
      return this.currentindex === tracklist.length - 1
        ? 0
        : this.currentindex + 1;
    },
  },
  persist: {
    afterRestore: (context) => {
      let store = context.store;
      store.duration.current = 0;
      store.playing = false;
    },
  },
});
