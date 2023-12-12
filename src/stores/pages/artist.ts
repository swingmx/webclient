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
import { Routes, router } from "@/router";

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
    fetched_similar_hash: "",
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
      if (this.fetched_similar_hash === this.info.artisthash) return;
      this.fetched_similar_hash = this.info.artisthash;
      this.similar_artists = await getSimilarArtists(
        this.info.artisthash,
        maxAbumCards.value
      );
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
    resetAll() {
      setTimeout(() => {
        if (router.currentRoute.value.name == Routes.artist) return;
        this.resetAlbums();
        this.resetSimilarArtists();
        this.fetched_similar_hash = "";
      }, 5000);
    },
    makeFavorite() {
      this.info.is_favorite = true;
    },
    removeFavorite() {
      this.info.is_favorite = false;
    },
  },
});
