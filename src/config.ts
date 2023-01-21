import { useStorage } from "@vueuse/core";

const development = import.meta.env.DEV;
const dev_url = "http://localhost:1970";
const url = development ? dev_url : "";

export const baseApiUrl = useStorage("baseApiUrl", url, sessionStorage);

const hostname = "swingmusic.netlify.app";

if (window.location.hostname === hostname && baseApiUrl.value === "") {
  // is running on netlify and baseApiUrl is not set
  baseApiUrl.value = null;
}

const baseImgUrl = baseApiUrl.value + "/img";

export function setBaseApiUrl(url: string) {
  baseApiUrl.value = url;
  location.reload();
}

const imageRoutes = {
  thumb: {
    large: "/t/",
    small: "/t/s/",
  },
  artist: {
    large: "/a/",
    small: "/a/s/",
  },
  playlist: "/p/",
  raw: "/raw/",
};

const paths = {
  api: {
    album: baseApiUrl.value + "/album",
    favorite: baseApiUrl.value + "/favorite",
    favorites: baseApiUrl.value + "/favorites",
    favAlbums: baseApiUrl.value + "/albums/favorite",
    favTracks: baseApiUrl.value + "/tracks/favorite",
    favArtists: baseApiUrl.value + "/artists/favorite",
    isFavorite: baseApiUrl.value + "/favorites/check",
    artist: baseApiUrl.value + "/artist",
    get addFavorite() {
      return this.favorite + "/add";
    },
    get removeFavorite() {
      return this.favorite + "/remove";
    },
    get albumartists() {
      return this.album + "/artists";
    },
    get albumbio() {
      return this.album + "/bio";
    },
    get albumsByArtistUrl() {
      return this.album + "/from-artist";
    },
    folder: baseApiUrl.value + "/folder",
    playlist: {
      base: baseApiUrl.value + "/playlist",
      get new() {
        return this.base + "/new";
      },
      get all() {
        return this.base + "s";
      },
      get artists() {
        return this.base + "/artists";
      },
    },
    search: {
      base: baseApiUrl.value + "/search",
      get tracks() {
        return this.base + "/tracks?q=";
      },
      get albums() {
        return this.base + "/albums?q=";
      },
      get artists() {
        return this.base + "/artists?q=";
      },
      get load() {
        return this.base + "/loadmore";
      },
    },
    settings: {
      base: baseApiUrl.value + "/settings",
      get add_root_dir() {
        return this.base + "/add-root-dirs";
      },
    },
    files: baseApiUrl.value + "/file",
  },
  images: {
    thumb: {
      small: baseImgUrl + imageRoutes.thumb.small,
      large: baseImgUrl + imageRoutes.thumb.large,
    },
    artist: {
      small: baseImgUrl + imageRoutes.artist.small,
      large: baseImgUrl + imageRoutes.artist.large,
    },
    playlist: baseImgUrl + imageRoutes.playlist,
    raw: baseImgUrl + imageRoutes.raw,
  },
};

export { paths };
