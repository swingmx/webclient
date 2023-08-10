import { createRouter, createWebHashHistory, RouterOptions } from "vue-router";

import state from "@/composables/state";
import useAlbumPageStore from "@/stores/pages/album";
import useFolderPageStore from "@/stores/pages/folder";
import usePlaylistPageStore from "@/stores/pages/playlist";
import usePlaylistListPageStore from "@/stores/pages/playlists";
import useArtistPageStore from "@/stores/pages/artist";

import FolderView from "@/views/FolderView.vue";
import PlaylistListView from "@/views/PlaylistList.vue";
import PlaylistView from "@/views/PlaylistView/index.vue";
import AlbumsExplorer from "@/views/AlbumsExplorer.vue";
import AlbumView from "@/views/AlbumView/index.vue";
import ArtistExplorer from "@/views/ArtistsExplorer.vue";
import ArtistView from "@/views/ArtistView";
import ArtistTracksView from "@/views/ArtistTracks.vue";
import ArtistDiscographyView from "@/views/ArtistDiscography.vue";
import SettingsView from "@/views/SettingsView.vue";
import SearchView from "@/views/SearchView";
import FavoritesView from "@/views/Favorites.vue";
import FavoriteAlbums from "@/views/FavoriteAlbums.vue";
import FavoriteTracks from "@/views/FavoriteTracks.vue";
import FavoriteArtists from "@/views/FavoriteArtists.vue";
import NotFound from "@/views/NotFound.vue";
import NowPlaying from "@/views/NowPlaying";

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

const albums = {
  path: "/albums",
  name: "AlbumsView",
  component: AlbumsExplorer,
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
  path: "/nowplaying",
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
  path: "/settings",
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
  albums,
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
  albums: albums.name,
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
