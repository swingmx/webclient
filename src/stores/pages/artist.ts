import { defineStore } from "pinia";

import { getArtistAlbums, getArtistData } from "@/composables/fetch/artists";
import { Album, Artist, Track } from "@/interfaces";
import { maxAbumCards } from "@/stores/content-width";
import useSettingsStore from "@/stores/settings";

export default defineStore("artistPage", {
  state: () => ({
    info: <Artist>{},
    tracks: <Track[]>[],
    albums: <Album[]>[],
    eps: <Album[]>[],
    compilations: <Album[]>[],
    singles: <Album[]>[],
    appearances: <Album[]>[],
  }),
  actions: {
    async getData(hash: string) {
      const settings = useSettingsStore();
      const { artist, tracks } = await getArtistData(
        hash,
        settings.artist_top_tracks_count
      );

      this.info = artist;
      this.tracks = tracks;
    },
    async getArtistAlbums() {
      const { albums, eps, singles, appearances, compilations } =
        await getArtistAlbums(this.info.artisthash, maxAbumCards.value);

      this.albums = albums;
      this.eps = eps;
      this.singles = singles;
      this.appearances = appearances;
      this.compilations = compilations;
    },
    resetAlbums() {
      this.albums = [];
      this.eps = [];
      this.singles = [];
    },
    makeFavorite() {
      this.info.is_favorite = true;
    },
    removeFavorite() {
      this.info.is_favorite = false;
    },
  },
});
