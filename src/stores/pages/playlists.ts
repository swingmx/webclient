import { defineStore } from "pinia";
import { Playlist } from "@/interfaces";
import { getAllPlaylists } from "@/requests/playlists";

export default defineStore("playlists", {
  state: () => ({
    playlists: <Playlist[]>[],
  }),
  actions: {
    /**
     * Fetch all playlists from the server
     */
    async fetchAll() {
      const playlists = await getAllPlaylists();
      this.playlists = playlists;
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
  },
});
