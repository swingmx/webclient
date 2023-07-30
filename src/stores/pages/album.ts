import { defineStore } from "pinia";
import { ComputedRef } from "vue";

import { FuseTrackOptions } from "@/enums";
import { Album, AlbumDisc, FuseResult, Track } from "@/interfaces";
import { maxAbumCards } from "@/stores/content-width";
import { useFuse } from "@/utils";

import { paths } from "@/config";
import {
  getAlbum,
  getAlbumsFromArtist,
  getAlbumVersions,
  getSimilarAlbums,
} from "@/requests/album";
import setColorsToStore from "@/utils/colortools/setColorsToStore";
import { useNotifStore } from "../notification";

interface Disc {
  [key: string]: Track[];
}

function sortByTrackNumber(tracks: Track[]) {
  return tracks.sort((a, b) => {
    if (a.track && b.track) {
      return a.track - b.track;
    }

    return 0;
  });
}

/**
 *
 * @param tracks The raw tracklist from the server
 * @returns A list of `Disc` objects
 */
function createDiscs(tracks: Track[]) {
  return tracks.reduce((group, track) => {
    const { disc } = track;

    group[disc] = group[disc] ?? [];
    group[disc].push(track);

    return group;
  }, {} as Disc);
}

export default defineStore("album", {
  state: () => ({
    query: "",
    info: <Album>{},
    srcTracks: <Track[]>[],
    albumArtists: <{ artisthash: string; albums: Album[] }[]>[],
    otherVersions: <Album[]>[],
    similarAlbums: <Album[]>[],
    bio: null,
    discs: <Disc>{},
    colors: {
      bg: "",
      btn: "",
    },
  }),
  actions: {
    /**
     * Fetches a single album information, artists and its tracks from the server
     * using the title and album-artist of the album.
     * @param albumhash title of the album
     */
    async fetchTracksAndArtists(albumhash: string) {
      const album = await getAlbum(albumhash, useNotifStore);

      this.srcTracks = album.tracks;
      this.info = album.info;
      this.extractColors();

      const tracks = sortByTrackNumber(this.srcTracks);
      this.discs = createDiscs(tracks);

      this.srcTracks = Object.keys(this.discs).reduce(
        (tracks: Track[], disc) => {
          const disc_tracks = this.discs[disc];

          return [...tracks, ...disc_tracks];
        },
        []
      );

      this.srcTracks.forEach((t, index) => {
        t.master_index = index;
      });
    },
    async fetchArtistAlbums() {
      const albumartists = this.info.albumartists;

      const albumartisthashes = albumartists.map((artist) => artist.artisthash);

      this.albumArtists = await getAlbumsFromArtist(
        albumartisthashes.join(),
        maxAbumCards.value,
        this.info.base_title
      );
    },
    async fetchAlbumVersions() {
      this.otherVersions = await getAlbumVersions(
        this.info.og_title,
        this.info.base_title,
        this.info.albumartists[0].artisthash
      );
    },
    async fetchSimilarAlbums() {
      if (this.similarAlbums.length) return;

      this.similarAlbums = await getSimilarAlbums(
        this.info.albumartists[0].artisthash,
        maxAbumCards.value
      );
    },
    extractColors() {
      const url = paths.images.thumb.small + this.info.image;
      setColorsToStore(this, url);
    },
    resetQuery() {
      this.query = "";
    },
    resetAlbumArtists() {
      this.albumArtists = [];
    },
    resetOtherVersions() {
      this.otherVersions = [];
    },
    resetSimilarAlbums() {
      this.similarAlbums = [];
    },
    makeFavorite() {
      this.info.is_favorite = true;
    },
    removeFavorite() {
      this.info.is_favorite = false;
    },
  },
  getters: {
    filteredTracks(): ComputedRef<FuseResult[]> {
      const discs = this.discs;
      let tracks: Track[] | AlbumDisc[] = [];

      Object.keys(discs).forEach((disc) => {
        const discHeader = {
          is_album_disc_number: true,
          album_page_disc_number: parseInt(disc),
        } as AlbumDisc;

        tracks = [...tracks, discHeader, ...discs[disc]];
      });

      return useFuse(this.query, tracks, FuseTrackOptions);
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
  },
});

// TODO: Implement Disc interface using a class
