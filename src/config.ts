import axios from 'axios'

const development = import.meta.env.DEV

export function getBaseUrl() {
    if (!development) {
        return ''
    }

    const base_url = window.location.origin
    const splits = base_url.split(':')
    return base_url.replace(splits[splits.length - 1], '1980')
}

const base_url = getBaseUrl()
axios.defaults.baseURL = base_url

const baseImgUrl = base_url + '/img'

const imageRoutes = {
    thumb: {
        large: '/thumbnail/',
        small: '/thumbnail/xsmall/',
        smallish: '/thumbnail/small/',
        medium: '/thumbnail/medium/',
    },
    artist: {
        large: '/artist/',
        small: '/artist/small/',
        medium: '/artist/medium/',
    },
    playlist: '/playlist/',
}

export const paths = {
    api: {
        favorites: '/favorites',
        get favAlbums() {
            return this.favorites + '/albums'
        },
        get favTracks() {
            return this.favorites + '/tracks'
        },
        get favArtists() {
            return this.favorites + '/artists'
        },
        get isFavorite() {
            return this.favorites + '/check'
        },
        get addFavorite() {
            return this.favorites + '/add'
        },
        get removeFavorite() {
            return this.favorites + '/remove'
        },
        artist: '/artist',
        lyrics: '/lyrics',
        plugins: '/plugins',
        get mixes() {
            return this.plugins + '/mixes'
        },

        // Single album
        album: '/album',
        get albumartists() {
            return this.album + '/artists'
        },
        get albumbio() {
            return this.album + '/bio'
        },
        get albumsByArtistUrl() {
            return this.album + '/from-artist'
        },
        get albumVersions() {
            return this.album + '/other-versions'
        },
        folder: {
            base: '/folder',
            showInFiles: '/folder/show-in-files',
        },
        dir_browser: '/folder/dir-browser',
        playlist: {
            base: '/playlists',
            get new() {
                return this.base + '/new'
            },
            get artists() {
                return this.base + '/artists'
            },
        },
        collections: {
            base: '/collections',
        },
        search: {
            base: '/search',
            get top() {
                return this.base + '/top?q='
            },
            get tracks() {
                return this.base + '/tracks?q='
            },
            get albums() {
                return this.base + '/albums?q='
            },
            get artists() {
                return this.base + '/artists?q='
            },
            get load() {
                return this.base + '/loadmore'
            },
        },
        logger: {
            base: '/logger',
            get logTrack() {
                return this.base + '/track/log'
            },
        },
        getall: {
            base: '/getall',
            get albums() {
                return this.base + '/albums'
            },
            get artists() {
                return this.base + '/artists'
            },
        },
        colors: {
            base: '/colors',
            get album() {
                return this.base + '/album'
            },
        },
        settings: {
            base: '/notsettings',
            get get_root_dirs() {
                return this.base + '/get-root-dirs'
            },
            get add_root_dir() {
                return this.base + '/add-root-dirs'
            },
            get remove_root_dir() {
                return this.base + '/remove-root-dirs'
            },
            get trigger_scan() {
                return this.base + '/trigger-scan'
            },
            get updateConfig() {
                return this.base + '/update'
            },
        },
        files: '/file',
        home: {
            base: '/nothome',
            get recentlyAdded() {
                return this.base + '/recents/added'
            },
            get recentlyPlayed() {
                return this.base + '/recents/played'
            },
        },
        auth: {
            base: '/auth',
            get login() {
                return this.base + '/login'
            },
            get logout() {
                return this.base + '/logout'
            },
            get allUsers() {
                return this.base + '/users'
            },
            get currentUser() {
                return this.base + '/user'
            },
            get addUser() {
                return this.base + '/profile/create'
            },
            get addGuestUser() {
                return this.base + '/profile/guest/create'
            },
            get updateProfile() {
                return this.base + '/profile/update'
            },
            get deleteUser() {
                return this.base + '/profile/delete'
            },
            get pair() {
                return this.base + '/getpaircode'
            },
        },
        backups: {
            base: '/backup',
            get get_backups() {
                return this.base + '/list'
            },
            get create_backup() {
                return this.base + '/create'
            },
            get restore_backup() {
                return this.base + '/restore'
            },
            get delete_backup() {
                return this.base + '/delete'
            },
        },
        stats: {
            base: '/logger',
            get topArtists() {
                return this.base + '/top-artists'
            },
            get topAlbums() {
                return this.base + '/top-albums'
            },
            get topTracks() {
                return this.base + '/top-tracks'
            },
        },
    },
    images: {
        thumb: {
            small: baseImgUrl + imageRoutes.thumb.small,
            smallish: baseImgUrl + imageRoutes.thumb.smallish,
            large: baseImgUrl + imageRoutes.thumb.large,
            medium: baseImgUrl + imageRoutes.thumb.medium,
        },
        artist: {
            small: baseImgUrl + imageRoutes.artist.small,
            large: baseImgUrl + imageRoutes.artist.large,
            medium: baseImgUrl + imageRoutes.artist.medium,
        },
        playlist: baseImgUrl + imageRoutes.playlist,
        mix: {
            medium: baseImgUrl + '/mix/medium/',
            small: baseImgUrl + '/mix/small/',
        },
    },
}
