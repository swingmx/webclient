import { defineStore } from "pinia";
import { Mix, Playlist } from "@/interfaces";
import { getAllPlaylists } from "@/requests/playlists";
import { getSavedMixes } from "@/requests/mixes";

let savedMixesRequest: Promise<void> | null = null;

export default defineStore("playlists", {
  state: () => ({
    playlists: <Playlist[]>[],
    savedMixesCount: 0,
    savedMixes: <Mix[] | null>null,
  }),
  actions: {
    /**
     * Fetch all playlists and the saved mixes count from the server
     */
    async fetchAll() {
      const { playlists, savedMixes } = await getAllPlaylists();
      this.playlists = playlists;
      this.savedMixesCount = savedMixes;
      this.savedMixes = null;
    },
    /**
     * Fetch the saved mixes if not loaded
     */
    fetchSavedMixes() {
      if (this.savedMixes) return;

      savedMixesRequest ??= getSavedMixes()
        .then((mixes) => {
          this.savedMixes = mixes;
        })
        .finally(() => {
          savedMixesRequest = null;
        });

      return savedMixesRequest;
    },
    /**
     * Updates the count after a mix is saved or unsaved and drops the loaded mixes
     */
    savedMixesChanged(saved: boolean) {
      this.savedMixesCount = Math.max(0, this.savedMixesCount + (saved ? 1 : -1));
      this.savedMixes = null;
    },
    /**
     * Adds a single playlist to the store
     * @param playlist Playlist to add to the store
     * @returns void
     */
    addPlaylist(playlist: Playlist) {
      setTimeout(() => {
        this.playlists.unshift(playlist);
      }, 250);
    },
    /**
     * Removes a deleted playlist from the store
     */
    removePlaylist(id: number) {
      this.playlists = this.playlists.filter((p) => p.id !== id);
    },
  },
});
