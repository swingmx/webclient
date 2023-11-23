import { Ref } from "vue";
import { defineStore } from "pinia";

import { paths } from "@/config";
import { NotifType, useNotifStore } from "./notification";

import audio from "@/player";
import { dropSources, favType } from "@/enums";
import updateMediaNotif from "@/helpers/mediaNotification";
import { isFavorite } from "@/requests/favorite";

import useTabs from "./tabs";
import useLyrics from "./lyrics";
import useColors from "./colors";
import useSettings from "./settings";
import useTracklist from "./queue/tracklist";

import {
  fromAlbum,
  fromArtist,
  fromFav,
  fromFolder,
  fromPlaylist,
  fromSearch,
  Track,
} from "@/interfaces";

export type From =
  | fromFolder
  | fromAlbum
  | fromPlaylist
  | fromSearch
  | fromArtist
  | fromFav;

export default defineStore("Queue", {
  state: () => ({
    duration: {
      current: 0,
      full: 0,
    },
    currentindex: 0,
    playing: false,
    buffering: true,
    queueScrollFunction: (index: number) => {},
    mousover: <Ref | null>null,
  }),
  actions: {
    focusCurrentInSidebar(timeout = 500) {
      if (!this.mousover) {
        setTimeout(() => {
          this.queueScrollFunction(this.currentindex - 1);
        }, timeout);
      }
    },
    play(index: number = 0) {
      // TODO: extract this into a separate util file
      const { tracklist } = useTracklist();
      if (tracklist.length === 0) return;

      this.playing = true;
      this.currentindex = index;
      this.focusCurrentInSidebar();

      const tab = useTabs();

      const track = tracklist[index];
      const uri = `${paths.api.files}/${
        track.trackhash
      }?filepath=${encodeURIComponent(track.filepath as string)}`;

      audio.autoplay = true;
      audio.pause();
      audio.src = uri;

      const playEventHandler = () => {
        if (!this.playing) {
          audio.pause();
          return;
        }

        this.duration.full = audio.duration;

        audio
          .play()
          .then(() => {
            const colors = useColors();
            const lyrics = useLyrics();

            updateMediaNotif();
            this.duration.full = audio.duration;

            colors.setTheme1Color(
              paths.images.thumb.small + this.currenttrack.image
            );

            if (tab.nowplaying == tab.tabs.lyrics) {
              return lyrics.getLyrics();
            }

            const settings = useSettings();

            if (!settings.use_lyrics_plugin) {
              lyrics.checkExists(
                this.currenttrack.filepath,
                this.currenttrack.trackhash
              );
            }
          })
          .catch((e) => {
            const Toast = useNotifStore();
            if (e instanceof DOMException) {
              this.playPause();

              return Toast.showNotification(
                "Tap anywhere in the page and try again (autoplay blocked))",
                NotifType.Error
              );
            }

            Toast.showNotification(
              "Can't play: " + track.title,
              NotifType.Error
            );
          });
      };

      const errorEventHandler = (err: Event | string) => {
        if (typeof err != "string") {
          err.stopImmediatePropagation();
        }

        useNotifStore().showNotification(
          "Can't play: " + track.title,
          NotifType.Error
        );

        if (this.currentindex !== tracklist.length - 1) {
          if (!this.playing) return;

          if (this.currenttrack.trackhash !== track.trackhash) return;
          setTimeout(() => {
            this.playNext();
          }, 3000);
          return;
        }

        this.playing = false;
      };

      audio.oncanplay = playEventHandler;
      audio.onerror = errorEventHandler;
    },
    startBufferingStatusWatcher() {
      // TODO: move this to a separate util file
      let sourceTime = 0;
      let lastTime = 0;

      const tabs = useTabs();
      const lyrics = useLyrics();

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
        this.duration.current = audio.currentTime;

        const date = new Date();
        sourceTime = date.getTime();
      };

      audio.onplay = () => {
        // reset sourceTime to prevent false positives
        const date = new Date();
        sourceTime = date.getTime();
      };

      audio.onended = () => {
        this.autoPlayNext();
      };

      const compare = () => {
        const difference = Math.abs(sourceTime - lastTime);

        if (difference > 600 && this.playing) {
          this.buffering = true;
          return;
        }

        this.buffering = false;
      };

      const updateTime = () => {
        if (!this.playing) return;
        const date = new Date();
        lastTime = date.getTime();
        compare();
      };

      // Loader will misbehave on HMR because of multiple setInterval calls
      setInterval(() => {
        if (!this.playing) {
          this.buffering = false;
          return;
        }

        updateTime();
      }, 100);
    },
    playPause() {
      if (audio.src === "") {
        this.play(this.currentindex);
        return;
      }

      if (audio.paused && !this.playing) {
        audio.currentTime === 0 ? this.play(this.currentindex) : null;
        audio.play().catch(() => {
          // do nothing
        });
        this.playing = true;
        return;
      }

      audio.pause();
      this.playing = false;
    },
    autoPlayNext() {
      const settings = useSettings();
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
        this.focusCurrentInSidebar();
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
      const store = useTracklist();
      store.shuffleList();

      this.currentindex = 0;
      this.play(this.currentindex);
      this.focusCurrentInSidebar();
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
    // called from app.vue
    setScrollFunction(
      cb: (index: number) => void,
      mousover: Ref<boolean> | null
    ) {
      this.queueScrollFunction = cb;
      this.mousover = mousover;
    },
  },
  getters: {
    next(): Track {
      const { tracklist } = useTracklist();
      if (this.currentindex == tracklist.length - 1) {
        return tracklist[0];
      } else {
        return tracklist[this.currentindex + 1];
      }
    },
    prev(): Track | undefined {
      const { tracklist } = useTracklist();
      if (this.currentindex === 0) {
        return tracklist[tracklist.length - 1];
      } else {
        return tracklist[this.currentindex - 1];
      }
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
