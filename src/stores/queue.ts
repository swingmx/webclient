import { paths } from "@/config";
import { defineStore } from "pinia";
import { Ref } from "vue";
import { NotifType, useNotifStore } from "./notification";

import audio from "@/player";
import useColorStore from "./colors";
import { dropSources, favType, FromOptions } from "@/enums";
import updateMediaNotif from "@/helpers/mediaNotification";
import { isFavorite } from "@/requests/favorite";

import useSettingsStore from "./settings";
import { fetchAlbumColor } from "@/requests/colors";
import {
  fromAlbum,
  fromArtist,
  fromFav,
  fromFolder,
  fromPlaylist,
  fromSearch,
  Track,
} from "../interfaces";

function shuffle(tracks: Track[]) {
  const shuffled = tracks.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

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
    from: {} as From,
    tracklist: [] as Track[],
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
      if (this.tracklist.length === 0) return;

      this.playing = true;
      this.currentindex = index;
      this.focusCurrentInSidebar();

      const track = this.tracklist[index];
      const uri = `${paths.api.files}/${
        track.trackhash
      }?filepath=${encodeURIComponent(track.filepath as string)}`;

      new Promise((resolve, reject) => {
        audio.autoplay = true;
        audio.pause();
        audio.src = uri;

        audio.oncanplay = resolve;
        audio.onerror = reject;
      })
        .then(() => {
          audio.currentTime = 0;
          this.duration.full = audio.duration;

          audio.play().then(() => {
            updateMediaNotif();
            this.duration.full = audio.duration;

            fetchAlbumColor(track.albumhash).then((color) => {
              useColorStore().setTheme1Color(color);
            });

            audio.onended = () => {
              this.autoPlayNext();
            };
          });
        })
        .catch((err: ErrorEvent) => {
          err.stopImmediatePropagation();
          useNotifStore().showNotification(
            "Can't play: " + track.title,
            NotifType.Error
          );

          // if not last track, try to play next
          if (this.currentindex !== this.tracklist.length - 1) {
            if (!this.playing) return;

            setTimeout(() => {
              // if track changed, don't play next
              if (this.currenttrack.trackhash !== track.trackhash) return;
              this.playNext();
            }, 5000);
          }
        });
    },
    startBufferingStatusWatcher() {
      audio.ontimeupdate = () => {
        this.duration.current = audio.currentTime;

        const date = new Date();
        sourceTime = date.getTime();
      };

      let sourceTime = 0;
      let lastTime = 0;

      const compare = () => {
        const difference = Math.abs(sourceTime - lastTime);

        // I WROTE THIS CODE WHILE EXHAUSTED, PLEASE REVIEW IT LATER WITH A CLEAR HEAD

        if (difference > 600 && this.playing) {
          this.buffering = true;
          return;
        }

        this.buffering = false;
      };

      const updateTime = () => {
        console.log(sourceTime);
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

      if (audio.paused) {
        audio.currentTime === 0 ? this.play(this.currentindex) : null;
        audio.play();
        this.playing = true;
      } else {
        audio.pause();
        this.playing = false;
      }
    },
    autoPlayNext() {
      const settings = useSettingsStore();
      const is_last = this.currentindex === this.tracklist.length - 1;

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
      if (audio.currentTime > 3) {
        audio.currentTime = 0;
        return;
      }

      this.play(this.previndex);
    },
    seek(pos: number) {
      try {
        audio.currentTime = pos;
      } catch (error) {
        if (error instanceof TypeError) {
          console.error("Seek error: no audio");
        }
      }
    },
    readQueue() {
      const queue = localStorage.getItem("queue");

      if (queue) {
        const parsed = JSON.parse(queue);
        this.from = parsed.from;
        this.tracklist = parsed.tracks;
      }
    },
    setNewQueue(tracklist: Track[]) {
      if (this.tracklist !== tracklist) {
        this.tracklist = [];
        this.tracklist.push(...tracklist);
      }

      const settings = useSettingsStore();

      if (settings.repeat_one) {
        settings.toggleRepeatMode();
      }
      this.focusCurrentInSidebar(1000);
    },
    playFromFolder(fpath: string, tracks: Track[]) {
      const name = fpath.split("/").pop();
      this.from = <fromFolder>{
        type: FromOptions.folder,
        path: fpath,
        name: name?.trim() === "" ? fpath : name,
      };
      this.setNewQueue(tracks);
    },
    playFromAlbum(aname: string, albumhash: string, tracks: Track[]) {
      this.from = <fromAlbum>{
        type: FromOptions.album,
        name: aname,
        albumhash: albumhash,
      };

      this.setNewQueue(tracks);
    },
    playFromPlaylist(pname: string, pid: number, tracks: Track[]) {
      this.from = <fromPlaylist>{
        type: FromOptions.playlist,
        name: pname,
        id: pid,
      };

      this.setNewQueue(tracks);
    },
    playFromSearch(query: string, tracks: Track[]) {
      this.from = <fromSearch>{
        type: FromOptions.search,
        query: query,
      };

      this.setNewQueue(tracks);
    },
    playFromArtist(artisthash: string, artistname: string, tracks: Track[]) {
      this.from = <fromArtist>{
        type: FromOptions.artist,
        artisthash: artisthash,
        artistname: artistname,
      };

      this.setNewQueue(tracks);
    },
    playFromFav(tracks: Track[]) {
      this.from = <fromFav>{
        type: FromOptions.favorite,
      };

      this.setNewQueue(tracks);
    },
    addTrackToQueue(track: Track) {
      this.tracklist.push(track);

      const Toast = useNotifStore();
      Toast.showNotification(
        `Added ${track.title} to queue`,
        NotifType.Success
      );
    },
    insertTrackAtIndex(track: Track, index: number) {
      this.tracklist.splice(index, 0, track);
    },
    playTrackNext(track: Track) {
      const Toast = useNotifStore();
      const nextindex = this.currentindex + 1;

      this.insertTrackAtIndex(track, nextindex);
      Toast.showNotification(`Added 1 track to queue`, NotifType.Success);
    },
    addTrackToIndex(
      source: dropSources,
      track: Track,
      newIndex: number,
      oldIndex: number
    ) {
      if (source === dropSources.queue) {
        this.tracklist.splice(oldIndex, 1);
        this.tracklist.splice(newIndex, 0, track);
        return;
      }

      // else, just insert track at newIndex
      this.tracklist.splice(newIndex, 0, track);
    },
    clearQueue() {
      this.tracklist = [] as Track[];
      this.currentindex = 0;
      this.from = <From>{};
    },
    shuffleQueue() {
      const Toast = useNotifStore();
      if (this.tracklist.length < 2) {
        Toast.showNotification("Queue is too short", NotifType.Info);
        return;
      }
      this.tracklist = shuffle(this.tracklist);

      this.currentindex = 0;
      this.play(this.currentindex);
      this.focusCurrentInSidebar();
    },
    removeFromQueue(index: number = 0) {
      if (index === this.currentindex) {
        const is_last = index === this.tracklist.length - 1;
        const was_playing = this.playing;

        audio.src = "";
        this.tracklist.splice(index, 1);

        if (is_last) {
          this.currentindex = 0;
        }

        if (was_playing) {
          this.playPause();
        }
        return;
      }

      this.tracklist.splice(index, 1);

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
    // called from app.vue
    toggleFav(index: number) {
      const track = this.tracklist[index];

      if (track) {
        track.is_favorite = !track.is_favorite;
      }
    },
    addTracksToQueue(tracks: Track[]) {
      this.tracklist = this.tracklist.concat(tracks);

      const Toast = useNotifStore();
      Toast.showNotification(
        `Added ${tracks.length} tracks to queue`,
        NotifType.Success
      );
    },
    insertAfterCurrent(tracks: Track[]) {
      this.tracklist.splice(this.currentindex + 1, 0, ...tracks);

      const Toast = useNotifStore();
      Toast.showNotification(
        `Added ${tracks.length} tracks to queue`,
        NotifType.Success
      );
    },
  },
  getters: {
    next(): Track {
      if (this.currentindex == this.tracklist.length - 1) {
        return this.tracklist[0];
      } else {
        return this.tracklist[this.currentindex + 1];
      }
    },
    prev(): Track | undefined {
      if (this.currentindex === 0) {
        return this.tracklist[this.tracklist.length - 1];
      } else {
        return this.tracklist[this.currentindex - 1];
      }
    },
    currenttrack(): Track {
      const current = this.tracklist[this.currentindex];

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
      return this.currentindex === 0
        ? this.tracklist.length - 1
        : this.currentindex - 1;
    },
    nextindex(): number {
      return this.currentindex === this.tracklist.length - 1
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
