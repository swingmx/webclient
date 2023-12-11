import { Routes, router } from "@/router";
import { defineStore } from "pinia";

import { discographyAlbumTypes } from "@/enums";
import { Album } from "@/interfaces";
import { getArtistAlbums } from "@/requests/artists";

export default defineStore("artistDiscography", {
  state: () => ({
    artistname: <string>"",
    page: discographyAlbumTypes.all,

    toShow: <Album[]>[],

    albums: <Album[]>[],
    singles: <Album[]>[],
    appearances: <Album[]>[],
    compilations: <Album[]>[],
  }),
  actions: {
    setAlbums(page?: string) {
      if (!page) {
        const route = router.currentRoute.value;
        page = route.params.type as string;
      }

      this.setPage(page);
      switch (page) {
        case discographyAlbumTypes.albums:
          this.toShow = this.albums;
          break;
        case discographyAlbumTypes.EPs_and_singles:
          this.toShow = this.singles;
          break;
        case discographyAlbumTypes.appearances:
          this.toShow = this.appearances;
          break;
        case discographyAlbumTypes.compilations:
          this.toShow = this.compilations;
          break;
        default:
          this.toShow = this.albums.concat(
            this.singles,
            this.appearances,
            this.compilations
          );
          break;
      }
    },
    setPage(page: string | undefined) {
      // @ts-ignore
      this.page = page;
    },
    fetchAlbums(artisthash: string) {
      this.resetStore();
      getArtistAlbums(artisthash, 0, true)
        .then((data) => {
          this.albums = data.albums;
          this.singles = data.singles_and_eps;
          this.appearances = data.appearances;
          this.artistname = data.artistname;
          this.compilations = data.compilations;
        })
        .then(() => this.setAlbums());
    },
    resetStore() {
      this.albums = [];
      this.singles = [];
      this.appearances = [];

      this.toShow = [];
      this.artistname = "";
    },
    resetAll() {
      setTimeout(() => {
        if (router.currentRoute.value.name == Routes.artistDiscography) return;
        this.resetStore();
      }, 5000);
    },
  },
});
