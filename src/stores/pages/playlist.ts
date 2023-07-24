import { defineStore } from "pinia";
import { ComputedRef } from "vue";

import { useFuse } from "@/utils";

import { FuseTrackOptions } from "@/enums";
import { Artist, FuseResult, Playlist, Track } from "@/interfaces";
import { getPlaylist } from "@/requests/playlists";

export default defineStore("playlist-tracks", {
  state: () => ({
    info: <Playlist>{},
    query: "",
    bannerPos: 0,
    allTracks: <Track[]>[],
    artists: <Artist[]>[],
  }),
  actions: {
    /**
     * Fetches a single playlist information, and its tracks from the server
     * @param id The id of the playlist to fetch
     */
    async fetchAll(id: string, no_tracks = false) {
      this.resetBannerPos();
      const playlist = await getPlaylist(id, no_tracks);

      this.info = playlist?.info || ({} as Playlist);
      this.bannerPos = this.info.banner_pos;

      if (no_tracks) return;

      this.allTracks = playlist?.tracks || [];
    },

    // async fetchArtists(id: string) {
    //   this.artists = await getPlaylistArtists(id);
    // },

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
