import { watch } from "vue";
import { defineStore } from "pinia";
import { useRoute } from "vue-router";
import { Routes, router } from "@/router";
import { reactive, ref } from "@vue/reactivity";
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
import waitForScrollEnd from "@/helpers/useWaitForScroll";
import { Album, Artist, Playlist, Track } from "../interfaces";
import useLoaderStore from "./loader";
import useTabStore from "./tabs";
/**
 *
 * Scrolls on clicking the loadmore button
 */
function scrollOnLoad() {
  const elem = document.getElementById("tab-content") as HTMLElement;

  if (elem === null) return;

  elem.scroll({
    top: elem.scrollHeight,
    left: 0,
    behavior: "smooth",
  });
}

export default defineStore("search", () => {
  // @ts-ignore
  const query = ref("");
  const route = useRoute();
  const debouncedQuery = useDebounce(query, 500);
  const { startLoading, stopLoading } = useLoaderStore();

  const currentTab = ref("top");
  const RESULT_COUNT = 12;

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

    searchTopResults(query).then((res) => {
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
      let scrollable = document.getElementById(
        "songlist-scroller"
      ) as HTMLElement;

      if (scrollable === null) {
        scrollable = document.createElement("div");
      }

      waitForScrollEnd(scrollable, 0).then(() => {
        tracks.value = data.tracks;
        tracks.more = data.more;
        tracks.query = query;
      });
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

  function loadTracks() {
    loadCounter.tracks += RESULT_COUNT;

    startLoading();
    loadMoreTracks(loadCounter.tracks, query.value)
      .then((res) => {
        tracks.value = [...tracks.value, ...res.tracks];
        tracks.more = res.more;
      })
      .then(() => stopLoading())
      .then(() => scrollOnLoad());
  }

  function loadAlbums() {
    loadCounter.albums += RESULT_COUNT;

    startLoading();
    loadMoreAlbums(loadCounter.albums, query.value)
      .then((res) => {
        albums.value = [...albums.value, ...res.albums];
        albums.more = res.more;
      })
      .then(() => stopLoading())
      .then(() => {
        setTimeout(() => {
          scrollOnLoad();
        }, 500);
      });
  }

  function loadArtists() {
    loadCounter.artists += RESULT_COUNT;

    startLoading();
    loadMoreArtists(loadCounter.artists, query.value)
      .then((res) => {
        artists.value = [...artists.value, ...res.artists];
        artists.more = res.more;
      })
      .then(() => stopLoading())
      .then(() =>
        setTimeout(() => {
          scrollOnLoad();
        }, 500)
      );
  }

  watch(
    () => debouncedQuery.value,
    (newQuery) => {
      if (route.name === Routes.search) {
        router.replace({
          name: Routes.search,
          params: {
            page: route.params.page,
          },
          query: { q: newQuery },
        });
      }
      // reset all counters
      for (const key in loadCounter) {
        // @ts-ignore
        loadCounter[key] = 0;
      }

      const tabs = useTabStore();

      if (route.name !== Routes.search && tabs.current !== "search") {
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
