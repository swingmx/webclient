import { defineStore } from "pinia";
import { ComputedRef } from "vue";

import Vibrant from "node-vibrant";
import { useFuse } from "@/utils";

import { FuseTrackOptions } from "@/enums";
import { Artist, FuseResult, Playlist, Track } from "@/interfaces";
import { getPlaylist, removeBannerImage } from "@/requests/playlists";
import { paths } from "@/config";
import listToRgbString from "@/utils/colortools/listToRgbString";

interface ColorPalette {
  Vibrant: {
    _rgb: [number, number, number];
    _population: number;
    _hsl?: [number, number, number];
  };
  LightVibrant: {
    _rgb: [number, number, number];
    _population: number;
  };
  DarkVibrant: {
    _rgb: [number, number, number];
    _population: number;
    _hsl?: [number, number, number];
  };
  Muted: {
    _rgb: [number, number, number];
    _population: number;
    _hsl?: [number, number, number];
  };
  LightMuted: {
    _rgb: [number, number, number];
    _population: number;
    _hsl?: [number, number, number];
  };
  DarkMuted: {
    _rgb: [number, number, number];
    _population: number;
    _hsl?: [number, number, number];
  };
}

export default defineStore("playlist-tracks", {
  state: () => ({
    info: <Playlist>{},
    query: "",
    bannerPos: 0,
    allTracks: <Track[]>[],
    artists: <Artist[]>[],
    colors: {
      bg: "",
      btn: "",
    },
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
      this.info.sqr_img = true;
      this.bannerPos = this.info.banner_pos;

      if (no_tracks) return;

      this.allTracks = playlist?.tracks || [];

      this.extractColors();
    },

    async removeBanner() {
      const res = await removeBannerImage(this.info.id);

      if (!res) return;

      this.info = res;
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
      this.bannerPos = this.info.banner_pos;
    },
    extractColors() {
      if (!this.info.has_image) return;

      const vibrant = new Vibrant(
        paths.images.playlist + (this.info.thumb as string)
      );

      vibrant.getPalette().then((palette) => {
        // @ts-ignore
        this.colors.bg = listToRgbString(palette.DarkMuted?.getRgb()) || "#fff";

        this.colors.btn =
        // @ts-ignore
          listToRgbString(palette.LightVibrant?.getRgb()) || "#fff";
      });
    },
    plusBannerPos() {
      this.bannerPos !== 100 ? (this.bannerPos += 5) : null;
    },
    minusBannerPos() {
      this.bannerPos !== 0 ? (this.bannerPos -= 5) : null;
    },
    removeTrackByIndex(index: number) {
      this.allTracks.splice(index, 1);
    },
    addTrack(track: Track) {
      this.allTracks.push(track);
    },
    resetArtists() {
      this.artists = [];
    },
    resetQuery() {
      this.query = "";
    },
    resetBannerPos() {
      this.bannerPos = 50;
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
      return this.info.banner_pos - this.bannerPos !== 0;
    },
  },
});
