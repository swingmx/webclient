import { defineStore } from "pinia";

import useQueue from "@/stores/queue";
import useInterface from "@/stores/interface";
import useSettings from "@/stores/settings";
import { useNotifStore, NotifType } from "@/stores/notification";

import {
  fromAlbum,
  fromArtist,
  fromFav,
  fromFolder,
  fromPlaylist,
  fromSearch,
  Track,
} from "@/interfaces";
import { FromOptions } from "@/enums";

export type From =
  | fromFolder
  | fromAlbum
  | fromPlaylist
  | fromSearch
  | fromArtist
  | fromFav;

function shuffle(tracks: Track[]) {
  const shuffled = tracks.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
export default defineStore("tracklist", {
  state: () => ({
    from: {} as From,
    tracklist: <Track[]>[],
  }),
  actions: {
    loadFromLocalStorage() {
      const queue = localStorage.getItem("queue");

      if (queue) {
        const parsed = JSON.parse(queue);
        this.from = parsed.from;
        this.tracklist = parsed.tracks;
      }
    },
    setNewList(tracklist: Track[]) {
      if (this.tracklist !== tracklist) {
        this.tracklist = [];
        this.tracklist.push(...tracklist);
      }

      const settings = useSettings();

      if (settings.repeat_one) {
        settings.toggleRepeatMode();
      }

      const { focusCurrentInSidebar } = useInterface();
      focusCurrentInSidebar(1000);
    },
    setFromFolder(path: string, tracks: Track[]) {
      const name = path.split("/").pop();
      this.from = <fromFolder>{
        type: FromOptions.folder,
        path: path,
        name: name?.trim() === "" ? path : name,
      };
      this.setNewList(tracks);
    },
    setFromAlbum(name: string, albumhash: string, tracks: Track[]) {
      this.from = <fromAlbum>{
        type: FromOptions.album,
        name: name,
        albumhash: albumhash,
      };

      this.setNewList(tracks);
    },
    setFromPlaylist(name: string, pid: number, tracks: Track[]) {
      this.from = <fromPlaylist>{
        type: FromOptions.playlist,
        name: name,
        id: pid,
      };

      this.setNewList(tracks);
    },
    setFromSearch(query: string, tracks: Track[]) {
      this.from = <fromSearch>{
        type: FromOptions.search,
        query: query,
      };

      this.setNewList(tracks);
    },
    setFromArtist(artisthash: string, name: string, tracks: Track[]) {
      this.from = <fromArtist>{
        type: FromOptions.artist,
        artisthash: artisthash,
        artistname: name,
      };

      this.setNewList(tracks);
    },
    setFromFav(tracks: Track[]) {
      this.from = <fromFav>{
        type: FromOptions.favorite,
      };

      this.setNewList(tracks);
    },
    addTrack(track: Track) {
      this.tracklist.push(track);

      const Toast = useNotifStore();
      Toast.showNotification(
        `Added ${track.title} to queue`,
        NotifType.Success
      );
    },
    addTracks(tracks: Track[]) {
      this.tracklist = this.tracklist.concat(tracks);

      const Toast = useNotifStore();
      Toast.showNotification(
        `Added ${tracks.length} tracks to queue`,
        NotifType.Success
      );
    },
    insertAt(track: Track, index: number) {
      this.tracklist.splice(index, 0, track);
    },
    removeTrack(index: number) {
      this.tracklist.splice(index, 1);
    },
    clearList() {
      this.tracklist = [];
      this.from = {} as From;
    },
    shuffleList() {
      const Toast = useNotifStore();
      if (this.tracklist.length < 2) {
        Toast.showNotification("Queue is too short", NotifType.Info);
        return;
      }
      this.tracklist = shuffle(this.tracklist);
    },
    removeByIndex(index: number) {
      this.tracklist.splice(index, 1);
    },
    toggleFav(index: number) {
      const track = this.tracklist[index];

      if (track) {
        track.is_favorite = !track.is_favorite;
      }
    },
    insertAfterCurrent(tracks: Track[]) {
      const { currentindex } = useQueue();

      this.tracklist.splice(currentindex + 1, 0, ...tracks);

      const Toast = useNotifStore();
      Toast.showNotification(
        `Added ${tracks.length} tracks to queue`,
        NotifType.Success
      );
    },
  },
  persist: true,
});
