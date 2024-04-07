import { Routes } from '@/router'
import { RouteLocationRaw } from 'vue-router'

import useQueue from '@/stores/queue'
import { FromOptions } from '@/enums'
import { paths } from '@/config'
import { From } from '@/stores/queue/tracklist'

import AlbumSvg from '@/assets/icons/album.svg'
import ArtistSvg from '@/assets/icons/artist.svg'
import FolderSvg from '@/assets/icons/folder.svg'
import HeartSvg from '@/assets/icons/heart.fill.svg'
import PlaylistSvg from '@/assets/icons/playlist.svg'
import SearchSvg from '@/assets/icons/search.svg'

interface PlayingFrom {
    name: string
    icon: string
    location: RouteLocationRaw
    image?: string
}

export default (source: From): PlayingFrom => {
    switch (source.type) {
        case FromOptions.album:
            return {
                name: source.name,
                icon: AlbumSvg,
                location: {
                    name: Routes.album,
                    params: {
                        albumhash: source.albumhash,
                    },
                },
                image: paths.images.thumb.small + source.albumhash,
            }

        case FromOptions.folder:
            return {
                name: source.name,
                icon: FolderSvg,
                location: {
                    name: Routes.folder,
                    params: {
                        path: useQueue().currenttrack.folder,
                    },
                },
                image: '',
            }

        case FromOptions.playlist:
            return {
                name: source.name,
                icon: PlaylistSvg,
                location: {
                    name: Routes.playlist,
                    params: {
                        pid: source.id,
                    },
                },
                image: paths.images.playlist + source.id,
            }

        case FromOptions.search:
            return {
                name: `Search for: "${source.query}"`,
                icon: SearchSvg,
                location: {
                    name: Routes.search,
                    params: {
                        page: 'top',
                    },
                    query: {
                        q: source.query,
                    },
                },
                image: '',
            }

        case FromOptions.artist:
            return {
                name: source.artistname,
                icon: ArtistSvg,
                location: {
                    name: Routes.artist,
                    params: {
                        hash: source.artisthash,
                    },
                },
                image: paths.images.artist.small + source.artisthash,
            }

        case FromOptions.favorite:
            return {
                name: 'Favorite tracks',
                icon: HeartSvg,
                location: {
                    name: Routes.favoriteTracks,
                },
                image: '',
            }

        default:
            return { name: '👻 No source', location: {}, icon: '' }
    }
}
