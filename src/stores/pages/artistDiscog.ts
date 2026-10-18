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
    // composer and performer pages only
    classical: <Album[]>[],
    live: <Album[]>[],
    soundtracks: <Album[]>[],
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
        case discographyAlbumTypes.classical:
          this.toShow = this.classical;
          break;
        case discographyAlbumTypes.live:
          this.toShow = this.live;
          break;
        case discographyAlbumTypes.soundtracks:
          this.toShow = this.soundtracks;
          break;
        default:
          this.toShow = this.classical.concat(
            this.albums,
            this.singles,
            this.live,
            this.soundtracks,
            this.appearances,
            this.compilations
          );
          break;
      }
    },
    /**
     * Whether a tab has albums; "all" always shows.
     */
    hasType(type: string) {
      switch (type) {
        case discographyAlbumTypes.classical:
          return this.classical.length > 0;
        case discographyAlbumTypes.live:
          return this.live.length > 0;
        case discographyAlbumTypes.soundtracks:
          return this.soundtracks.length > 0;
        default:
          return true;
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
          this.classical = data.classical ?? [];
          this.live = data.live ?? [];
          this.soundtracks = data.soundtracks ?? [];
        })
        .then(() => this.setAlbums());
    },
    resetStore() {
      this.albums = [];
      this.singles = [];
      this.appearances = [];
      this.classical = [];
      this.live = [];
      this.soundtracks = [];

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
