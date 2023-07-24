import { paths } from "@/config";
import { defineStore } from "pinia";
import { Ref } from "vue";
import { NotifType, useNotifStore } from "./notification";

import { dropSources, favType, FromOptions } from "../composables/enums";
import updateMediaNotif from "../composables/mediaNotification";
import { isFavorite } from "@/composables/fetch/favorite";
import useSettingsStore from "./settings";
import useColorStore from "./colors";

import {
  fromAlbum,
  fromArtist,
  fromFav,
  fromFolder,
  fromPlaylist,
  fromSearch,
  Track,
} from "../interfaces";
import { fetchAlbumColor } from "@/composables/fetch/colors";
import player from "@/player";
import generateString from "@/utils/generateString";

function shuffle(tracks: Track[]) {
  const shuffled = tracks.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

const createURI = (track: Track) => {
  return `${paths.api.files}/${track.trackhash}?filepath=${encodeURIComponent(
    track.filepath as string
  )}`;
};

const compareTrackLists = (a: Track[], b: Track[]) => {
  if (a.length !== b.length) return false;

  for (let i = 0; i < a.length; i++) {
    const a_track = a[i];
    const b_track = b[i];

    if (a_track.trackhash !== b_track.trackhash) {
      return false;
    }
  }

  return true;
};

export type From =
  | fromFolder
  | fromAlbum
  | fromPlaylist
  | fromSearch
  | fromArtist
  | fromFav;

let audio = new Audio();
audio.autoplay = false;

export default defineStore("Queue", {
  state: () => ({
    duration: {
      current: 0,
      full: 0,
    },
    currentindex: 0,
    playing: false,
    from: {} as From,
    tracklist: [] as Track[],
    queueScrollFunction: (index: number) => {},
    mousover: <Ref | null>null,
    player_key: "",
  }),
  actions: {
    focusCurrentInSidebar(timeout = 500) {
      if (!this.mousover) {
        setTimeout(() => {
          this.queueScrollFunction(this.currentindex - 1);
        }, timeout);
      }
    },
    setGaplessPlayerCallbacks() {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

      player.onplay = async (track: string) => {
        const instance_key = generateString(10);
        this.player_key = instance_key;

        this.playing = true;
        updateMediaNotif();
        const track_length = player.currentLength() / 1000; // milliseconds to seconds
        this.duration.full = track_length;

        while (this.playing) {
          if (this.player_key !== instance_key) {
            break;
          }

          this.duration.current = player.getPosition() / 1000;
          await sleep(1000);
        }
      };

      player.onfinishedtrack = () => {
        this.currentindex = this.nextindex;
      };

      player.onpause = () => {
        this.playing = false;
      };
    },
    play(index: number = 0) {
      if (this.tracklist.length === 0) return;
      this.currentindex = index;
      this.focusCurrentInSidebar();

      const track = this.tracklist[index];

      const current_index_on_player = player.getIndex();
      if (current_index_on_player == index) {
        player.cue();
      } else {
        player.gotoTrack(index);
        player.play();
      }

      fetchAlbumColor(track.albumhash).then((color) => {
        useColorStore().setTheme1Color(color);
      });

      // .catch((err: ErrorEvent) => {
      //   err.stopImmediatePropagation();
      //   useNotifStore().showNotification(
      //     "Can't play: " + track.title,
      //     NotifType.Error
      //   );

      //   if (this.currentindex !== this.tracklist.length - 1) {
      //     setTimeout(() => {
      //       if (!this.playing) return;
      //       this.autoPlayNext();
      //     }, 5000);
      //   }
      // });
    },
    stop() {
      audio.src = "";
      this.playing = false;
    },
    playPause() {
      if (player.isPlaying()) {
        player.playpause();
        this.playing = false;
        return;
      }

      player.playpause();
      this.playing = true;

      console.log(player);
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
      this.play(this.previndex);
    },
    seek(pos: number) {
      player.setPosition(pos * 1000);
    },
    addTracksToPlayer(tracks?: Track[]) {
      const tracklist = tracks || this.tracklist;
      player.removeAllTracks();

      tracklist.forEach((track) => {
        const uri = createURI(track);
        player.addTrack(uri);
      });
    },
    setNewQueue(tracklist: Track[]) {
      const same_tracklist = compareTrackLists(this.tracklist, tracklist);
      if (same_tracklist) return;

      this.tracklist = [];
      this.tracklist.push(...tracklist);
      this.addTracksToPlayer();
      const settings = useSettingsStore();

      if (settings.repeat_one) {
        settings.toggleRepeatMode();
      }
      this.focusCurrentInSidebar(1000);
      console.log("set new queue");
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
    playFromPlaylist(pname: string, pid: string, tracks: Track[]) {
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
    insertTrackAtIndex(track: Track, index: number) {
      this.tracklist.splice(index, 0, track);
    },
    addTrackToQueue(track: Track) {
      this.insertTrackAtIndex(track, this.tracklist.length);
      this.addTracksToPlayer([track]);

      const Toast = useNotifStore();
      Toast.showNotification(
        `Added ${track.title} to queue`,
        NotifType.Success
      );
    },
    playTrackNext(track: Track) {
      const Toast = useNotifStore();
      const nextindex = this.currentindex + 1;

      this.insertTrackAtIndex(track, nextindex);
      const track_uri = createURI(track);
      player.insertTrack(nextindex, track_uri);

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
      this.addTracksToPlayer();
      // find current track after shuffle
      this.currentindex = 0;
      this.play(this.currentindex);
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
    setScrollFunction(
      cb: (index: number) => void,
      mousover: Ref<boolean> | null
    ) {
      this.queueScrollFunction = cb;
      this.mousover = mousover;
    },
    toggleFav(index: number) {
      const track = this.tracklist[index];

      if (track) {
        track.is_favorite = !track.is_favorite;
      }
    },
    addTracksToQueue(tracks: Track[]) {
      this.tracklist = this.tracklist.concat(tracks);
    },
    insertAfterCurrent(tracks: Track[]) {
      this.tracklist.splice(this.currentindex + 1, 0, ...tracks);
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

      store.addTracksToPlayer();

      if (store.tracklist.length === 0) return;
      // player.gotoTrack(store.currentindex);

      const current_index_on_player = player.getIndex();
      if (current_index_on_player !== store.currentindex) {
        player.gotoTrack(store.currentindex);
      }
    },
  },
});
