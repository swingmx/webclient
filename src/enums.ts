import { LicenseInfo } from "./interfaces";

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
  mix,
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
  mix = "mix",
  artistMix = "artist mix",
  albumCard = "albumCard",
  favorite = "favorite",
  work = "work",
}

export enum ContextSrc {
  PHeader = "PHeader",
  Track = "Track",
  AlbumHeader = "AlbumHeader",
  FolderCard = "FolderCard",
  FolderNav = "FolderNav",
  ArtistHeader = "ArtistHeader",
  WorkHeader = "WorkHeader",
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
  classical: "classical",
  albums: "albums",
  EPs_and_singles: "EP & singles",
  live: "live",
  soundtracks: "soundtracks",
  appearances: "appearances",
  compilations: "compilations",
};

export enum favType {
  artist = "artist",
  album = "album",
  track = "track",
  work = "work",
  composer = "composer",
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

interface Plugin {
  active: boolean;
  description: string;
  name: string;
  settings: any;
}

export interface DBSettings {
  enableWatchDog: boolean;
  rootDirs: string[];
  excludeDirs: string[];
  artistSeparators: string[];
  extractFeaturedArtists: boolean;
  removeProdBy: boolean;
  cleanAlbumTitle: boolean;
  removeRemasterInfo: boolean;
  mergeAlbums: boolean;
  showAlbumsAsSingles: boolean;
  enablePeriodicScans: boolean
  scanInterval: number
  plugins: Plugin[];
  version: string;
  serverId: string;
  lastfmApiKey: string;
  lastfmApiSecret: string;
  lastfmSessionKey: string;
  showPlaylistsInFolderView: boolean;
  artistArticleAwareSorting: boolean;
  trustCloudLyrics: boolean;

  deviceName: string;
  deviceId: string;
  licenseInfo: LicenseInfo | null;
  classicalEnabled: boolean
}
