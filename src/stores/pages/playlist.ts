import { defineStore } from "pinia";
import { ComputedRef } from "vue";

import { useFuse } from "@/utils";

import { paths } from "@/config";
import { FuseTrackOptions } from "@/enums";
import { Artist, FuseResult, Playlist, Track } from "@/interfaces";
import { getPlaylist, removeBannerImage } from "@/requests/playlists";
import setColorsToStore from "@/utils/colortools/setColorsToStore";
import { Routes, router } from "@/router";

export default defineStore("playlist-tracks", {
  state: () => ({
    info: <Playlist>{},
    query: "",
    initialBannerPos: 0,
    allTracks: <Track[]>[],
    colors: {
      bg: "",
      btn: "",
    },
    uploadImgUrl: "",
  }),
  actions: {
    /**
     * Fetches a single playlist information, and its tracks from the server
     * @param id The id of the playlist to fetch
     */
    async fetchAll(id: number, no_tracks = false) {
      this.resetBannerPos();
      const playlist = await getPlaylist(id, no_tracks);

      this.info = playlist?.info || ({} as Playlist);
      this.initialBannerPos = this.info.settings.banner_pos;
      this.createImageLink();

      this.resetColors();
      this.extractColors();

      if (no_tracks) return;

      this.allTracks = playlist?.tracks || [];
    },
    createImageLink() {
      this.info.image = paths.images.playlist + this.info.image;
    },
    async removeBanner() {
      const { duration } = this.info;
      const res = await removeBannerImage(this.info.id);

      if (!res) return;

      this.info = { ...res, duration };
      this.extractColors();

      this.createImageLink();
    },

    /**
     * Updates the playlist header info. This is used when the playlist is
     * updated.
     * @param info Playlist info
     */
    updatePInfo(info: Playlist) {
      const { duration, count, images } = this.info;

      this.info = info;
      this.info = { ...this.info, duration, count, images };
      this.createImageLink();
      this.extractColors();
    },

    extractColors(img_url?: string) {
      if (this.info.has_image) {
        const url =
          img_url || paths.images.playlist + (this.info.thumb as string);

        setColorsToStore(this, url);
        return;
      }

      if (!this.info.images.length) return;

      const url = paths.images.thumb.small + this.info.images[1].image;
      setColorsToStore(this, url);
    },
    setInitialBannerPos() {
      this.info.settings.banner_pos = 50;
    },
    resetColors() {
      this.colors = {
        bg: "",
        btn: "",
      };
    },
    plusBannerPos() {
      this.info.settings.banner_pos !== 100
        ? (this.info.settings.banner_pos += 5)
        : null;
    },
    minusBannerPos() {
      this.info.settings.banner_pos !== 0
        ? (this.info.settings.banner_pos -= 5)
        : null;
    },
    toggleSquareImage() {
      this.info.settings.square_img = !this.info.settings.square_img;
    },
    setImage(image: string) {
      this.info.image = image;

      this.extractColors(this.info.image);
      this.info.has_image = true;
    },
    removeTrackByIndex(index: number) {
      this.allTracks.splice(index, 1);
    },
    addTrack(track: Track) {
      this.allTracks.push(track);
    },
    resetBannerPos() {
      try {
        this.info.settings.banner_pos = 50;
      } catch (e) {
        /* empty */
      }
    },
    resetAll() {
      setTimeout(() => {
        if (router.currentRoute.value.name == Routes.playlist) return;
        this.allTracks = [];
      }, 5000);
    },
  },
  getters: {
    filteredTracks(): ComputedRef<FuseResult[]> {
      return useFuse(this.query, this.allTracks, FuseTrackOptions);
    },

    tracks(): Track[] {
      const tracks = this.filteredTracks.value.map((result: FuseResult) => {
        const t = {
          ...result.item,
          index: result.refIndex,
        };

        return t;
      });

      return tracks;
    },
    bannerPosUpdated(): boolean {
      return this.info.settings.banner_pos - this.initialBannerPos !== 0;
    },
  },
});
