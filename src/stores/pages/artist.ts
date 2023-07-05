import { defineStore } from "pinia";

import {
  getArtistAlbums,
  getArtistData,
  getSimilarArtists,
} from "@/composables/fetch/artists";

import useSettingsStore from "@/stores/settings";
import { Album, Artist, Track } from "@/interfaces";
import { maxAbumCards } from "@/stores/content-width";

export default defineStore("artistPage", {
  state: () => ({
    info: <Artist>{},
    tracks: <Track[]>[],
    albums: <Album[]>[],
    eps: <Album[]>[],
    compilations: <Album[]>[],
    singles: <Album[]>[],
    appearances: <Album[]>[],
    similar_artists: <Artist[]>[],
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

      console.log("meh");
    },
    async fetchSimilarArtists() {
      // the fetcher component is first mounted then unmounted by the recycler view,
      // resulting in this function being called twice.
      // 👇👇 To fix multiple calls, check if data is already fetched .
      if (this.similar_artists.length) return;

      this.similar_artists = await getSimilarArtists(
        this.info.artisthash,
        maxAbumCards.value
      );

      console.log("meh 2");
    },
    resetAlbums() {
      this.albums = [];
      this.eps = [];
      this.singles = [];
    },
    resetSimilarArtists() {
      this.similar_artists = [];
    },
    makeFavorite() {
      this.info.is_favorite = true;
    },
    removeFavorite() {
      this.info.is_favorite = false;
    },
  },
});
