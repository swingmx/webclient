import { paths } from "@/config";
import axios from "axios";
import useAxios from "./useAxios";

const {
  top: searchTopResultsUrl,
  tracks: searchTracksUrl,
  albums: searchAlbumsUrl,
  artists: searchArtistsUrl,
  load: loadMoreUrl_,
} = paths.api.search;

const loadMoreUrl = loadMoreUrl_ + "?in_quotes=";
/**
 * Fetch data from url
 * @param url url to fetch json from
 * @returns promise that resolves to the JSON
 */
async function fetchData(url: string, in_quotes = false) {
  const { data } = await useAxios({
    url: url + `&in_quotes=${in_quotes}`,
    get: true,
  });

  return data;
}

async function searchTopResults(query: string, in_quotes = false) {
  const url = searchTopResultsUrl + encodeURIComponent(query.trim());
  return await fetchData(url, in_quotes);
}

async function searchTracks(query: string, in_quotes = false) {
  const url = searchTracksUrl + encodeURIComponent(query.trim());
  return await fetchData(url, in_quotes);
}

async function searchAlbums(query: string, in_quotes = false) {
  const url = searchAlbumsUrl + encodeURIComponent(query.trim());
  return await fetchData(url, in_quotes);
}

async function searchArtists(query: string, in_quotes = false) {
  const url = searchArtistsUrl + encodeURIComponent(query.trim());
  return await fetchData(url, in_quotes);
}

async function loadMoreTracks(index: number, query: string, in_quotes = false) {
  const response = await axios.get(loadMoreUrl + `${in_quotes}`, {
    params: {
      type: "tracks",
      index: index,
      q: query,
    },
  });

  return response.data;
}

async function loadMoreAlbums(index: number, query: string, in_quotes = false) {
  const response = await axios.get(loadMoreUrl + `${in_quotes}`, {
    params: {
      type: "albums",
      index: index,
      q: query,
    },
  });

  return response.data;
}

async function loadMoreArtists(
  index: number,
  query: string,
  in_quotes = false
) {
  const response = await axios.get(loadMoreUrl + `${in_quotes}`, {
    params: {
      type: "artists",
      index: index,
      q: query,
    },
  });

  return response.data;
}

export {
  searchTracks,
  searchAlbums,
  searchArtists,
  loadMoreTracks,
  loadMoreAlbums,
  loadMoreArtists,
  searchTopResults,
};

// TODO: Rewrite this module using `useAxios` hook
