export enum playSources {
  playlist,
  album,
  search,
  folder,
  artist,
  favorite,
  track,
  recentlyAdded,
  recentlyPlayed,
}

export enum NotifType {
  Success = "success",
  Info = "info",
  Error = "error",
  Working = "working",
  Favorite = "favorite",
}

export enum FromOptions {
  playlist = "playlist",
  folder = "folder",
  album = "album",
  search = "search",
  artist = "artist",
  albumCard = "albumCard",
  favorite = "favorite",
}

export enum ContextSrc {
  PHeader = "PHeader",
  Track = "Track",
  AlbumHeader = "AlbumHeader",
  FolderCard = "FolderCard",
  FolderNav = "FolderNav",
  ArtistHeader = "ArtistHeader",
  Queue = "Queue",
}

export const FuseTrackOptions = {
  keys: [
    { name: "title", weight: 1 },
    { name: "album", weight: 0.7 },
    { name: "artist.name", weight: 0.5 },
    { name: "albumartist", weight: 0.25 },
  ],
};

export enum contextChildrenShowMode {
  click = "click",
  hover = "hover",
}

// rewrite the above as an object
export const discographyAlbumTypes = {
  all: "all",
  albums: "albums",
  EPs_and_singles: "EP & singles",
  appearances: "appearances",
  compilations: "compilations",
};

export enum favType {
  artist = "artist",
  album = "album",
  track = "track",
}

export enum dropSources {
  queue = "queue",
  playlist = "playlist",
  folder = "folder",
  album = "album",
  search = "search",
  artist = "artist",
  favorite = "favorite",
}

export enum DbSettingKeys {
  root_dirs = "root_dirs",
  exclude_dirs = "exclude_dirs",
  artist_separators = "artist_separators",
  extract_feat = "extract_feat",
  remove_prod = "remove_prod",
  clean_album_title = "clean_album_title",
  show_album_version = "show_album_version",
  remove_remaster = "remove_remaster",
  merge_albums = "merge_albums",
  show_albums_as_singles = "show_albums_as_singles",
}

interface Plugin {
  active: boolean;
  description: string;
  name: string;
  settings: any;
}

export interface DBSettings {
  root_dirs: string[];
  exclude_dirs: string[];
  artist_separators: string[];
  extract_feat: boolean;
  remove_prod: boolean;
  clean_album_title: boolean;
  show_album_version: boolean;
  remove_remaster: boolean;
  merge_albums: boolean;
  show_albums_as_singles: boolean;
  plugins: Plugin[];
  version: string;
}
