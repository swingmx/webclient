import { FromOptions, NotifType } from './enums'

export interface AlbumDisc {
    is_album_disc_number?: boolean
    album_page_disc_number?: number
}

export interface Track extends AlbumDisc {
    id: string
    title: string
    album: string
    artists: Artist[]
    albumartists: Artist[]
    albumhash?: string
    folder?: string
    filepath: string
    duration?: number
    bitrate: number
    image: string
    track: number
    disc: number
    index: number
    trackhash: string
    filetype: string
    is_favorite: boolean

    og_title: string
    og_album: string
    genre?: string
    copyright?: string
    master_index?: number
    help_text?: string
    time?: string
}

export interface Folder {
    name: string
    path: string
    has_tracks: number
    is_sym: boolean
    trackcount: number
    foldercount: number
}

export interface Album {
    albumid: string
    title: string
    og_title: string
    base_title: string
    albumartists: Artist[]
    count: number
    duration: number
    date: string
    image: string
    artistimg: string
    albumhash: string
    colors: string[]
    copyright?: string

    help_text?: string
    time?: string
    is_live: boolean
    is_compilation: boolean
    is_soundtrack: boolean
    is_single: boolean
    is_EP: boolean
    is_favorite: boolean
    genres: string[]
    versions: string[]
}

export interface Artist {
    name: string
    image: string
    artisthash: string
    trackcount: number
    albumcount: number
    duration: number
    colors: string[]
    is_favorite?: boolean
    help_text?: string
    time?: string
}

export interface Option {
    type?: string
    label?: string
    action?: () => void
    children?: () => Promise<Option[] | false>
    icon?: string
    critical?: Boolean
    singleChild?: boolean
}

export interface PlaylistSettings {
    banner_pos: number
    has_gif: boolean
    square_img: boolean
    pinned: boolean
}

export interface Playlist {
    id: number
    name: string
    image: string | FormData
    has_image: boolean
    tracks: Track[]
    count: number
    last_updated: string
    thumb: string
    duration: number
    settings: PlaylistSettings
    pinned: boolean
    help_text?: string
    time?: string
    images:
        | {
              image: string
              color: string
          }[] // for playlist page
        | string[] // for playlist list page
}

export interface Radio {
    name: string
    image: string
    stream: string
    genres: string[]
}

export interface Notif {
    text: string
    type: NotifType
}

export interface fromFolder {
    type: FromOptions.folder
    path: string
    name: string
}
export interface fromAlbum {
    type: FromOptions.album
    name: string
    albumhash: string
}
export interface fromPlaylist {
    type: FromOptions.playlist
    name: string
    id: number
}

export interface fromSearch {
    type: FromOptions.search
    query: string
}

export interface fromArtist {
    type: FromOptions.artist
    artisthash: string
    artistname: string
}

export interface fromFav {
    type: FromOptions.favorite
}

export interface subPath {
    name: string
    path: string
    active: boolean
}

export interface FetchProps {
    url: string
    props?: {}
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    headers?: {}
}

export interface FuseResult {
    item: Track
    refIndex: number
}

export interface RecentFavTrack {
    trackhash: string
    image: string
    title: string
    filepath: string
}

export interface RecentFavAlbum {
    albumhash: string
    artist: string
    image: string
    title: string
    colors: string[]
}

export interface RecentFavArtist {
    artisthash: string
    image: string
    name: string
}

// export interface RecentFavResultItem {
//   type: "track" | "album" | "artist";
//   item: RecentFavTrack | RecentFavAlbum | RecentFavArtist;
// }

export interface RecentFavAlbumResult {
    type: 'album'
    item: RecentFavAlbum
}

export interface RecentFavArtistResult {
    type: 'artist'
    item: RecentFavArtist
}

export type RecentFavResult = RecentFavAlbumResult | RecentFavArtistResult

export interface ScrollerItem {
    id: string | number
    component: any
    props?: Record<string, unknown>
}

export interface LyricsLine {
    time: number
    text: string
}

// Auth
export interface UserSimplified {
    id: number
    username: string
    firstname: string
}

export interface User extends UserSimplified {
    lastname: string
    email: string
    image: string
    roles: string[]
}
