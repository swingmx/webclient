import { defineStore } from "pinia";

import {
  getArtistAlbums,
  getArtistData,
  getSimilarArtists,
} from "@/requests/artists";

import { paths } from "@/config";
import { Album, Artist, Track } from "@/interfaces";
import { maxAbumCards } from "@/stores/content-width";
import useSettingsStore from "@/stores/settings";
import setColorsToStore from "@/utils/colortools/setColorsToStore";

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
    colors: {
      bg: "",
      btn: "",
    },
    genres: <string[]>[],
    fetched_hash: "",
  }),
  actions: {
    async getData(hash: string) {
      const settings = useSettingsStore();
      const { artist, tracks, genres } = await getArtistData(
        hash,
        settings.artist_top_tracks_count
      );

      this.info = artist;
      this.tracks = tracks;
      this.genres = genres;

      this.extractColors();
    },
    async getArtistAlbums() {
      const { albums, singles_and_eps, appearances, compilations } =
        await getArtistAlbums(this.info.artisthash, maxAbumCards.value);

      this.albums = albums;
      this.singles = singles_and_eps;
      this.appearances = appearances;
      this.compilations = compilations;
    },
    async fetchSimilarArtists() {
      // the fetcher component is first mounted then unmounted by the recycler view,
      // resulting in this function being called twice.
      // 👇👇 To fix multiple calls, check if data is already fetched .
      if (this.fetched_hash === this.info.artisthash) return;

      this.similar_artists = await getSimilarArtists(
        this.info.artisthash,
        maxAbumCards.value
      );

      this.fetched_hash = this.info.artisthash;
    },
    extractColors() {
      const url = paths.images.artist.large + this.info.image;
      setColorsToStore(this, url, true);
    },
    setBgColor() {
      const colors = this.info.colors;
      this.colors.bg = colors[0] ? colors[0] : "";
    },
    resetAlbums() {
      this.colors.bg = "";
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
