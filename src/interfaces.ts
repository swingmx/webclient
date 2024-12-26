import { FromOptions, NotifType } from './enums'

export interface Genre {
    name: string
    genrehash: string
}

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
    trend?: {
        trend: 'rising' | 'falling' | 'stable'
        is_new: boolean
    }
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
    trackcount: number
    duration: number
    date: number
    image: string
    artistimg: string
    albumhash: string
    type?: string

    color?: string
    copyright?: string
    help_text?: string
    time?: string
    is_favorite: boolean
    genres: Genre[]
    versions: string[]
    trend?: {
        trend: 'rising' | 'falling' | 'stable'
        is_new: boolean
    }
}

export interface Mix {
    id: string
    title: string
    description: string
    sourcehash: string
    userid: number
    timestamp: number | string
    saved: boolean
    extra: {
        type: string
        artisthash: string
        og_sourcehash: string
        image?: {
            image: string
            color: string
        }
        images?: {
            image: string
            color: string
        }[]
    }
    duration: number
    trackcount: number
    help_text?: string
    time?: string
}

export interface FullMix extends Mix {
    tracks: Track[]
    saved: boolean
}

export interface HomePageItem {
    position: number
    title?: string
    description?: string
    items: { type: string; item?: any; with_helptext?: boolean }[]
    path?: string
    seeAllText?: string
}

export interface Artist {
    name: string
    image: string
    artisthash: string
    trackcount: number
    albumcount: number
    duration: number
    color: string
    is_favorite?: boolean
    help_text?: string
    time?: string
    genres: Genre[]

    // available in charts
    trend?: {
        trend: 'rising' | 'falling' | 'stable'
        is_new: boolean
    }
    extra?: any
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
    _last_updated: string
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
          }[]
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

export interface fromMix {
    type: FromOptions.mix
    name: string
    mixid: string
    sourcehash: string
    image: {
        type: 'mix' | 'track'
        image: string
    }
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
}

export interface User extends UserSimplified {
    image: string
    roles: string[]
}

export interface StatItem {
    cssclass: string
    value: string
    text: string
    image?: string
}
