import { createRouter, createWebHashHistory, RouterOptions } from "vue-router";

import state from "@/composables/state";
import useAlbumPageStore from "@/stores/pages/album";
import useFolderPageStore from "@/stores/pages/folder";
import usePlaylistPageStore from "@/stores/pages/playlist";
import usePlaylistListPageStore from "@/stores/pages/playlists";
import useArtistPageStore from "@/stores/pages/artist";

const FolderView = () => import("@/views/FolderView.vue");
const PlaylistListView = () => import("@/views/PlaylistList.vue");
const PlaylistView = () => import("@/views/PlaylistView/index.vue");
const AlbumView = () => import("@/views/AlbumView/index.vue");
const ArtistExplorer = () => import("@/views/ArtistsExplorer.vue");
const ArtistView = () => import("@/views/ArtistView");
const ArtistTracksView = () => import("@/views/ArtistTracks.vue");
const ArtistDiscographyView = () => import("@/views/ArtistDiscography.vue");
const SettingsView = () => import("@/views/SettingsView.vue");
const SearchView = () => import("@/views/SearchView");
const FavoritesView = () => import("@/views/Favorites.vue");
const FavoriteAlbums = () => import("@/views/FavoriteAlbums.vue");
const FavoriteTracks = () => import("@/views/FavoriteTracks.vue");
const FavoriteArtists = () => import("@/views/FavoriteArtists.vue");
const NotFound = () => import("@/views/NotFound.vue");
const NowPlaying = () => import("@/views/NowPlaying");

const home = {
  path: "/",
  name: "Home",
  redirect: "/folder/$home",
};

const folder = {
  path: "/folder/:path",
  name: "FolderView",
  component: FolderView,
  beforeEnter: async (to: any) => {
    state.loading.value = true;
    await useFolderPageStore()
      .fetchAll(to.params.path)
      .then(() => {
        state.loading.value = false;
      });
  },
};

const playlists = {
  path: "/playlists",
  name: "PlaylistList",
  component: PlaylistListView,
  beforeEnter: async () => {
    state.loading.value = true;
    await usePlaylistListPageStore()
      .fetchAll()
      .then(() => {
        state.loading.value = false;
      });
  },
};

const playlistView = {
  path: "/playlist/:pid",
  name: "PlaylistView",
  component: PlaylistView,
  beforeEnter: async (to: any) => {
    state.loading.value = true;
    await usePlaylistPageStore()
      .fetchAll(to.params.pid)
      .then(() => {
        state.loading.value = false;
      });
  },
};

const albumView = {
  path: "/albums/:albumhash",
  name: "AlbumView",
  component: AlbumView,
  beforeEnter: async (to: any) => {
    state.loading.value = true;
    const store = useAlbumPageStore();

    await store.fetchTracksAndArtists(to.params.albumhash).then(() => {
      state.loading.value = false;
    });
  },
};

const artists = {
  path: "/artists",
  name: "ArtistsView",
  component: ArtistExplorer,
};

const artistView = {
  path: "/artists/:hash",
  name: "ArtistView",
  component: ArtistView,
  beforeEnter: async (to: any) => {
    state.loading.value = true;

    await useArtistPageStore()
      .getData(to.params.hash)
      .then(() => {
        state.loading.value = false;
      });
  },
};

const NowPlayingView = {
  path: "/nowplaying/:tab",
  name: "NowPlaying",
  component: NowPlaying,
};

const ArtistTracks = {
  path: "/artists/:hash/tracks",
  name: "ArtistTracks",
  component: ArtistTracksView,
};

const artistDiscography = {
  path: "/artists/:hash/discography",
  name: "ArtistDiscographyView",
  component: ArtistDiscographyView,
};

const settings = {
  path: "/settings/:tab",
  name: "SettingsView",
  component: SettingsView,
};

const search = {
  path: "/search/:page",
  name: "SearchView",
  component: SearchView,
};

const favorites = {
  path: "/favorites",
  name: "FavoritesView",
  component: FavoritesView,
};

const favoriteAlbums = {
  path: "/favorites/albums",
  name: "FavoriteAlbums",
  component: FavoriteAlbums,
};

const favoriteTracks = {
  path: "/favorites/tracks",
  name: "FavoriteTracks",
  component: FavoriteTracks,
};

const favoriteArtists = {
  path: "/favorites/artists",
  name: "FavoriteArtists",
  component: FavoriteArtists,
};

const notFound = {
  name: "NotFound",
  path: "/:pathMatch(.*)",
  component: NotFound,
};

const routes = [
  home,
  folder,
  playlists,
  playlistView,
  albumView,
  artists,
  artistView,
  artistDiscography,
  settings,
  search,
  notFound,
  ArtistTracks,
  favorites,
  favoriteAlbums,
  favoriteTracks,
  favoriteArtists,
  NowPlayingView,
];

export const Routes = {
  home: home.name,
  folder: folder.name,
  playlists: playlists.name,
  playlist: playlistView.name,
  album: albumView.name,
  artists: artists.name,
  artist: artistView.name,
  artistDiscography: artistDiscography.name,
  settings: settings.name,
  search: search.name,
  notFound: notFound.name,
  artistTracks: ArtistTracks.name,
  favorites: favorites.name,
  favoriteAlbums: favoriteAlbums.name,
  favoriteTracks: favoriteTracks.name,
  favoriteArtists: favoriteArtists.name,
  nowPlaying: NowPlayingView.name,
};

const router = createRouter({
  mode: "hash",
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
} as RouterOptions);

export { router };
