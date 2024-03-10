import { paths } from "@/config";
import axios from "axios";
import useAxios from "./useAxios";

const {
  top: searchTopResultsUrl,
  tracks: searchTracksUrl,
  albums: searchAlbumsUrl,
  artists: searchArtistsUrl,
  load: loadMoreUrl,
} = paths.api.search;

/**
 * Fetch data from url
 * @param url url to fetch json from
 * @returns promise that resolves to the JSON
 */
async function fetchData(url: string) {
  const { data } = await useAxios({
    url: url,
    method: "GET",
  });

  return data;
}

async function searchTopResults(query: string, limit: number) {
  const url =
    searchTopResultsUrl + encodeURIComponent(query.trim()) + `&limit=${limit}`;
  return await fetchData(url);
}

async function searchTracks(query: string) {
  const url = searchTracksUrl + encodeURIComponent(query.trim());
  return await fetchData(url);
}

async function searchAlbums(query: string) {
  const url = searchAlbumsUrl + encodeURIComponent(query.trim());
  return await fetchData(url);
}

async function searchArtists(query: string) {
  const url = searchArtistsUrl + encodeURIComponent(query.trim());
  return await fetchData(url);
}

async function loadMoreTracks(index: number, query: string) {
  const response = await axios.get(loadMoreUrl, {
    params: {
      type: "tracks",
      index: index,
      q: query,
    },
  });

  return response.data;
}

async function loadMoreAlbums(index: number, query: string) {
  const response = await axios.get(loadMoreUrl, {
    params: {
      type: "albums",
      index: index,
      q: query,
    },
  });

  return response.data;
}

async function loadMoreArtists(index: number, query: string) {
  const response = await axios.get(loadMoreUrl, {
    params: {
      type: "artists",
      index: index,
      q: query,
    },
  });

  return response.data;
}

export {
    loadMoreAlbums,
    loadMoreArtists, loadMoreTracks, searchAlbums,
    searchArtists, searchTopResults, searchTracks
};

// TODO: Rewrite this module using `useAxios` hook
