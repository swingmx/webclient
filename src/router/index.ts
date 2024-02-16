import { createRouter, createWebHashHistory, RouterOptions } from "vue-router";

import state from "@/composables/state";
import useAlbumPageStore from "@/stores/pages/album";
import useFolderPageStore from "@/stores/pages/folder";
import usePlaylistPageStore from "@/stores/pages/playlist";
import usePlaylistListPageStore from "@/stores/pages/playlists";
import useArtistPageStore from "@/stores/pages/artist";


import HomeView from "@/views/HomeView";
const Lyrics = () => import("@/views/LyricsView");
const ArtistView = () => import("@/views/ArtistView");
const NotFound = () => import("@/views/NotFound.vue");
const NowPlaying = () => import("@/views/NowPlaying");
const SearchView = () => import("@/views/SearchView");
const AlbumList = () => import("@/views/AlbumListView");
const FolderView = () => import("@/views/FolderView.vue");
const FavoritesView = () => import("@/views/Favorites.vue");
const SettingsView = () => import("@/views/SettingsView.vue");
const AlbumView = () => import("@/views/AlbumView/index.vue");
const ArtistTracksView = () => import("@/views/ArtistTracks.vue");
const PlaylistListView = () => import("@/views/PlaylistList.vue");
const FavoriteTracks = () => import("@/views/FavoriteTracks.vue");
const PlaylistView = () => import("@/views/PlaylistView/index.vue");
const ArtistDiscographyView = () => import("@/views/ArtistDiscography.vue");
const FavoriteCardScroller = () => import("@/views/FavoriteCardScroller.vue");

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

const LyricsView = {
  path: "/lyrics",
  name: "LyricsView",
  component: Lyrics,
};

const ArtistTracks = {
  path: "/artists/:hash/tracks",
  name: "ArtistTracks",
  component: ArtistTracksView,
};

const artistDiscography = {
  path: "/artists/:hash/discography/:type",
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
  component: FavoriteCardScroller,
};

const favoriteArtists = {
  path: "/favorites/artists",
  name: "FavoriteArtists",
  component: FavoriteCardScroller,
};

const favoriteTracks = {
  path: "/favorites/tracks",
  name: "FavoriteTracks",
  component: FavoriteTracks,
};

const notFound = {
  name: "NotFound",
  path: "/:pathMatch(.*)",
  component: NotFound,
};

const Home = {
  path: "/",
  name: "Home",
  component: HomeView,
};

const AlbumListView = {
  path: "/albums",
  name: "AlbumListView",
  component: AlbumList,
};

const ArtistListView = {
  ...AlbumListView,
  path: "/artists",
  name: "ArtistListView",
};

const routes = [
  folder,
  playlists,
  playlistView,
  albumView,
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
  Home,
  AlbumListView,
  ArtistListView,
  LyricsView,
];

const Routes = {
  folder: folder.name,
  playlists: playlists.name,
  playlist: playlistView.name,
  album: albumView.name,
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
  Home: Home.name,
  AlbumList: AlbumListView.name,
  ArtistList: ArtistListView.name,
  Lyrics: LyricsView.name,
};

const router = createRouter({
  mode: "hash",
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes,
} as RouterOptions);

export { router, Routes };
