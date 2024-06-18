import { reactive, ref } from "vue";
import { computed, watch } from "vue";
import { defineStore } from "pinia";

import { Routes, router } from "@/router";
import { useDebounce } from "@vueuse/core";

import {
  loadMoreAlbums,
  loadMoreArtists,
  loadMoreTracks,
  searchAlbums,
  searchArtists,
  searchTopResults,
  searchTracks,
} from "@/requests/searchMusic";

import useTabs from "./tabs";
import useLoader from "./loader";
import useSettings from "./settings";
import { maxAbumCards } from "./content-width";

import { Album, Artist, Playlist, Track } from "../interfaces";

export default defineStore("search", () => {
  const query = ref("");
  const settings = useSettings();
  const route = computed(() => router.currentRoute.value);
  const debouncedQuery = useDebounce(query, 500);
  const { startLoading, stopLoading } = useLoader();

  const currentTab = ref("top");
  const RESULT_COUNT = 30;

  const loadCounter = reactive({
    tracks: 0,
    albums: 0,
    artists: 0,
    playlists: 0,
  });

  const top_results = reactive({
    query: "",
    top_result: {
      type: <null | string>null,
      item: <Track | Album | Artist>{},
    },
    tracks: <Track[]>[],
    albums: <Album[]>[],
    artists: <Artist[]>[],
  });

  const tracks = reactive({
    query: "",
    value: <Track[]>[],
    more: false,
  });

  const albums = reactive({
    query: "",
    value: <Album[]>[],
    more: false,
  });

  const artists = reactive({
    query: "",
    value: <Artist[]>[],
    more: false,
  });

  const playlists = reactive({
    query: "",
    value: <Playlist[]>[],
    more: false,
  });

  function fetchTopResults(query: string) {
    if (!query) return;
    let limit = 3;

    if (route.value.name == Routes.search) {
      limit = maxAbumCards.value;
    }

    searchTopResults(query, limit).then((res) => {
      top_results.top_result = res.top_result;
      top_results.tracks = res.tracks;
      top_results.albums = res.albums;
      top_results.artists = res.artists;
    });
  }

  /**
   * Searches for tracks, albums and artists
   * @param query query to search for
   */
  function fetchTracks(query: string) {
    if (!query) return;

    searchTracks(query).then((data) => {
      tracks.value = data.tracks;
      tracks.more = data.more;
      tracks.query = query;
    });
  }

  function fetchAlbums(query: string) {
    if (!query) return;

    searchAlbums(query).then((res) => {
      albums.value = res.albums;
      albums.more = res.more;
      albums.query = query;
    });
  }

  function fetchArtists(query: string) {
    if (!query) return;

    searchArtists(query).then((res) => {
      artists.value = res.artists;
      artists.more = res.more;
      artists.query = query;
    });
  }

  async function loadTracks() {
    loadCounter.tracks += RESULT_COUNT;

    startLoading();
    const res = await loadMoreTracks(loadCounter.tracks, query.value);
    tracks.value = [...tracks.value, ...res.tracks];
    tracks.more = res.more;
    return stopLoading();
  }

  async function loadAlbums() {
    loadCounter.albums += RESULT_COUNT;

    startLoading();
    const res = await loadMoreAlbums(loadCounter.albums, query.value);
    albums.value = [...albums.value, ...res.albums];
    albums.more = res.more;
    return stopLoading();
  }

  async function loadArtists() {
    loadCounter.artists += RESULT_COUNT;

    startLoading();
    const res = await loadMoreArtists(loadCounter.artists, query.value);
    artists.value = [...artists.value, ...res.artists];
    artists.more = res.more;
    return stopLoading();
  }

  watch(
    () => debouncedQuery.value,
    (newQuery) => {
      if (newQuery.trim() == "") return;

      if (!settings.use_sidebar && route.value.name !== Routes.search) {
        router.push({
          name: Routes.search,
          params: {
            page: "top",
          },
          query: { q: newQuery },
        });
      }

      if (route.value.name === Routes.search) {
        router.replace({
          name: Routes.search,
          params: {
            page: route.value.params.page,
          },
          query: { q: newQuery },
        });
      }

      // reset all counters
      for (const key in loadCounter) {
        // @ts-ignore
        loadCounter[key] = 0;
      }

      const tabs = useTabs();

      if (route.value.name !== Routes.search && tabs.current !== "search") {
        tabs.switchToSearch();
      }

      switch (currentTab.value) {
        case "top":
          fetchTopResults(newQuery);
          break;
        case "tracks":
          fetchTracks(newQuery);
          break;
        case "albums":
          fetchAlbums(newQuery);
          break;
        case "artists":
          fetchArtists(newQuery);
          break;
        default:
          fetchTracks(newQuery);
          break;
      }
    }
  );

  watch(
    () => currentTab.value,
    (newTab) => {
      const current_query: string = query.value;

      switch (newTab) {
        case "top":
          if (top_results.query == current_query) break;
          fetchTopResults(current_query);
          break;
        case "tracks":
          if (tracks.query == current_query) break;
          fetchTracks(current_query);
          break;

        case "albums":
          if (albums.query == current_query) break;
          fetchAlbums(current_query);
          break;

        case "artists":
          if (artists.query == current_query) break;
          fetchArtists(current_query);
          break;
        default:
          fetchTracks(current_query);
          break;
      }
    }
  );

  function switchTab(tab: string) {
    currentTab.value = tab;
  }

  return {
    top_results,
    tracks,
    albums,
    artists,
    playlists,
    query,
    currentTab,
    loadCounter,
    loadTracks,
    loadAlbums,
    loadArtists,
    switchTab,
  };
});
