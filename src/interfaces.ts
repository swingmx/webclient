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
    // classical search results: the work this track is a movement of
    classical?: MovementInfo
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
    explicit: boolean
    type?: string

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

    color?: string
    blurhash?: string
    is_classical: boolean
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
    blurhash?: string
    copyright?: string
    help_text?: string
    time?: string
    is_favorite: boolean
    is_classical: boolean
    genres: Genre[]
    versions: string[]
    trend?: {
        trend: 'rising' | 'falling' | 'stable'
        is_new: boolean
    }
}

export interface CatalogueId {
    name: string
}

export interface ClassicalMovement extends Track {
    movement_title: string
    // the name after the movement's number
    movement_name?: string
    // the work page
    movement_number?: string | null
    arrangement?: string | null
    // added when the movement is added to the queue,
    // links back to tracklist.worklist
    workhash?: string
}

// a work with its movements, as the queue and the album page list it
export interface ClassicalWork {
    workhash: string
    name: string
    nickname: string | null
    subtitle: string | null
    composer: string | null
    composer_hash: string | null
    catalogue_ids: CatalogueId[]
    movements: ClassicalMovement[]
    // album pages
    is_favorite?: boolean
    // the arrangement every movement shares
    arrangement?: string | null
    // the movement a single track holds when it is part of a larger work
    excerpt?: string | null
    duration?: number
}

// the work a classical track in search results belongs to, as a movement row
export interface MovementInfo {
    mark: string | null
    tint: number | null
    composer: string | null
    title: string
    sub: string
}

// a classical top search result: a person, a work, or a movement
export interface ClassicalTopResult {
    type: 'composer' | 'performer' | 'work' | 'movement'
    // people
    artisthash?: string
    image?: string
    years?: string | null
    era?: string | null
    work_count?: number
    track_count?: number
    album_count?: number
    // works and movements
    workhash?: string
    albumhash?: string | null
    tint?: number | null
    mark?: string | null
    composer?: string | null
    name?: string
    nickname?: string | null
    catalogue?: string | null
    movement_count?: number
    recording_count?: number
    duration?: number
    performers?: string
    // movements
    title?: string
    work?: string
    track?: Track
}

export interface WorkPerformer {
    name: string
    artisthash: string
    roles: string
}

export interface WorkRecording {
    albumhash: string
    album: { title: string; image: string; blurhash: string; year: number | null; artists: string } | null
    movements: ClassicalMovement[]
    performers: WorkPerformer[]
}

export interface WorkRecordingCard {
    workhash: string
    albumhash: string
    image: string | null
    album: string | null
    movement_count: number
    // who the recording is by: performer, track artist, or album artist
    byline: string | null
    help_text?: string
    time?: string
}

export interface ClassicalWorkPage extends Omit<ClassicalWork, 'movements'> {
    year_composed?: number
    year_published?: number
    dedication?: string
    instrumentation?: string
    instruments?: string[]
    key?: string | null
    recording: WorkRecording
    other_recordings: WorkRecordingCard[]
}

// a work card with a tile
export interface WorkCardItem {
    type: 'work'
    workhash: string
    albumhash: string | null
    tint: number | null
    mark: string
    label: string | null
    name: string
    nickname: string | null
    byline: string | null
    help_text?: string
    time?: string
}

// a work as a search row with a tile
export interface WorkTile {
    workhash: string
    albumhash: string | null
    tint: number | null
    mark: string
    composer: string | null
    name: string
    nickname: string | null
    catalogue: string | null
    movement_count: number
    duration: number
    is_favorite?: boolean
}

// a work as a list row
export interface WorkRow {
    workhash: string
    albumhash: string | null
    name: string
    nickname: string | null
    composer?: string | null
    // catalogue ids, then the form when nobody else is credited
    meta: string
    duration?: number
    // composer pages
    year_composed?: number
    // one of these for the column before the duration
    added?: number
    recording_count?: number
    year?: number | null
    // performer pages: others credited on the recording
    with?: string[]
}

export interface ContinueItem {
    workhash: string
    albumhash: string | null
    trackhash: string
    image: string | null
    composer: string | null
    title: string
    album: string | null
}

export interface ClassicalHomeTile {
    slug: string
    name: string
    // instruments
    count?: number
    // eras
    start?: number | null
    end?: number | null
    composers?: string
    // work types
    subtitle?: string
}

export interface ClassicalHomePage {
    album_count: number
    track_count: number
    seconds_listened: number
    continue_listening: ContinueItem[]
    albums: Album[]
    recently_added: WorkRow[]
    favorite_works: WorkRow[]
    composers: Artist[]
    eras: ClassicalHomeTile[]
    instruments: ClassicalHomeTile[]
    work_types: ClassicalHomeTile[]
    returned_to: WorkRow[]
    performers: { name: string; artisthash: string; roles: string }[]
}

export interface PersonFilter {
    name: string
    slug: string
}

export type PersonWorkRow = WorkRow

export interface PersonEntry {
    name: string
    artisthash: string
    roles?: string
    works?: number
    albums?: number
}

export interface PersonAlbumSections {
    classical: Album[]
    albums: Album[]
    singles_and_eps: Album[]
    live: Album[]
    soundtracks: Album[]
    compilations: Album[]
    appearances: Album[]
}

export interface ListeningRank {
    position: number
    total: number
    of: 'artists' | 'composers'
}

export interface Listening {
    playduration: number
    playcount: number
    lastplayed: number
    lastplayed_ago: string | null
    rank: ListeningRank | null
    top_album: { albumhash: string; title: string; image: string; artist: string | null; playduration: number } | null
    // artist pages
    top_track?: { trackhash: string; title: string; image: string; playduration: number } | null
    // composer and performer pages
    top_work?: {
        workhash: string
        albumhash: string
        title: string
        ids: string | null
        playduration: number
    } | null
}

export interface ClassicalPersonPage {
    type: 'composer' | 'performer'
    artisthash: string
    is_favorite?: boolean
    listening?: Listening | null
    name: string
    image: string | null
    tint?: number | null
    // the parts after the person's kind, the chips before the counts, and the life years
    kicker: string[]
    chips: string[]
    years: string | null
    work_count: number
    album_count: number
    filter_key: 'category' | 'composer'
    filters: PersonFilter[]
    filter: string | null
    works: PersonWorkRow[]
    works_total: number
    albums: PersonAlbumSections
    // composers
    nickname?: string
    bio?: string
    wikipedia_url?: string
    interpreters?: PersonEntry[]
    // performers
    composers?: PersonEntry[]
    performs_with?: PersonEntry[]
}

export interface ClassicalPersonWorks {
    type: 'composer' | 'performer'
    artisthash: string
    name: string
    filter_key: 'category' | 'composer'
    filters: PersonFilter[]
    filter: string | null
    works: PersonWorkRow[]
}

export type QueueItem = Track | ClassicalMovement
export type QueueWork = Pick<
    ClassicalWork,
    'workhash' | 'name' | 'nickname' | 'subtitle' | 'composer' | 'composer_hash' | 'catalogue_ids'
>

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
    url?: string
}

export interface Artist {
    name: string
    image: string
    artisthash: string
    trackcount: number
    albumcount: number
    duration: number
    color?: string
    blurhash?: string
    is_favorite?: boolean
    help_text?: string
    time?: string
    genres: Genre[]
    type?: string
    // a composer's palette entry, for the initials tile when there is no image
    tint?: number | null

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
    images: {
        image: string
        color: string
    }[]
}

export interface Collection {
    id: number
    name: string
    items: (Album | Artist | Mix | Playlist)[]
    extra: {
        description: string
    }
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

export interface fromWork {
    type: FromOptions.work
    name: string
    workhash: string
    albumhash: string
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
    tint?: number | null
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

// License

interface Device {
    current: boolean
    device_id: string
    device_name: string
    last_seen: string | null
    device_type: 'server' | 'laptop' | 'desktop' | 'handheld'
}

interface Customer {
    email: string
    id: string
    name: string | null
}

interface Devices {
    active: number
    limit: number
    list: Device[]
}

interface License {
    created_at: string
    device_id: string
    device_name: string
    expires_at: string | null
    license_type: 'lifetime' | 'subscription' | 'gh_sponsor'
    public_key: string
    status: string
    subscription: {
        amount: number
        cancel_at_period_end: boolean
        canceled_at: string | null
        created_at: string
        currency: string
        current_period_end: string
        current_period_start: string
        custom_field_data: { [key: string]: any }
        discount_id: string | null
        ends_at: string
        id: string
        metadata: { [key: string]: any }
        meters: any[]
        modified_at: string
        price_id: string
        product_id: string
        recurring_interval: 'month' | 'year' | 'one_time'
        started_at: string
        status: string
        trial_end: string | null
        trial_start: string | null
    }
}

export interface LicenseInfo {
    customer: Customer
    devices: Devices
    license: License
    msg: string
    license_key: string
}

// favorite tracks: every one, those that are not classical movements, or the movements
export type FavTrackKind = 'all' | 'tracks' | 'classical'
