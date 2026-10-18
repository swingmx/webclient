import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router'

import state from '@/composables/state'
import useAlbumPageStore from '@/stores/pages/album'
import useFolderPageStore from '@/stores/pages/folder'
import usePlaylistPageStore from '@/stores/pages/playlist'
import usePlaylistListPageStore from '@/stores/pages/playlists'
import useArtistPageStore from '@/stores/pages/artist'
import useWorkPageStore from '@/stores/pages/work'
import useComposerPageStore from '@/stores/pages/composer'

import HomeView from '@/views/HomeView'
const ArtistView = () => import('@/views/ArtistView')
const NotFound = () => import('@/views/NotFound.vue')
const NowPlaying = () => import('@/views/NowPlaying')
const SearchView = () => import('@/views/SearchView')
const AlbumList = () => import('@/views/AlbumListView')
const FolderView = () => import('@/views/FolderView.vue')
const FavoritesView = () => import('@/views/Favorites.vue')
const SettingsView = () => import('@/views/SettingsView.vue')
const AlbumView = () => import('@/views/AlbumView/index.vue')
const WorkView = () => import('@/views/WorkView/index.vue')
const ComposerView = () => import('@/views/ComposerView/index.vue')
const ArtistTracksView = () => import('@/views/ArtistTracks.vue')
const PlaylistListView = () => import('@/views/PlaylistList.vue')
const FavoriteTracks = () => import('@/views/FavoriteTracks.vue')
const PlaylistView = () => import('@/views/PlaylistView/index.vue')
const ArtistDiscographyView = () => import('@/views/ArtistDiscography.vue')
const ComposerWorksView = () => import('@/views/ComposerWorks.vue')
const ComposerAlbumsView = () => import('@/views/ComposerAlbums.vue')
const FavoriteCardScroller = () => import('@/views/FavoriteCardScroller.vue')
const StatsView = () => import('@/views/Stats/main.vue')
const MixView = () => import('@/views/MixView.vue')
const MixListView = () => import('@/views/MixListView.vue')
const Collection = () => import('@/views/Collections/Collection.vue')
const Onboarding = () => import('@/views/Onboarding.vue')

const folder = {
    path: '/folder/:path',
    name: 'FolderView',
    component: FolderView,
    beforeEnter: async (to: any) => {
        state.loading.value = true
        await useFolderPageStore()
            .fetchAll(to.params.path, true)
            .then(() => {
                state.loading.value = false
            })
    },
}

const playlists = {
    path: '/playlists',
    name: 'PlaylistList',
    component: PlaylistListView,
    beforeEnter: async () => {
        state.loading.value = true
        await usePlaylistListPageStore()
            .fetchAll()
            .then(() => {
                state.loading.value = false
            })
    },
}

const playlistView = {
    path: '/playlist/:pid',
    name: 'PlaylistView',
    component: PlaylistView,
    beforeEnter: async (to: any) => {
        state.loading.value = true
        await usePlaylistPageStore()
            .fetchAll(to.params.pid)
            .then(() => {
                state.loading.value = false
            })
    },
}

const albumView = {
    path: '/albums/:albumhash',
    name: 'AlbumView',
    component: AlbumView,
    beforeEnter: async (to: any) => {
        state.loading.value = true
        const store = useAlbumPageStore()

        await store.fetchTracksAndArtists(to.params.albumhash).then(() => {
            state.loading.value = false
        })
    },
}

const workView = {
    path: '/works/:token',
    name: 'WorkView',
    component: WorkView,
    beforeEnter: async (to: any) => {
        state.loading.value = true

        await useWorkPageStore()
            .fetchWork(to.params.token, to.query.albumhash)
            .then(() => {
                state.loading.value = false
            })
    },
}

const composerView = {
    path: '/composers/:hash',
    name: 'ComposerView',
    component: ComposerView,
    beforeEnter: async (to: any) => {
        state.loading.value = true

        await useComposerPageStore()
            .fetchComposer(to.params.hash, to.query.category)
            .then(() => {
                state.loading.value = false
            })
    },
}

const composerWorks = {
    path: '/composers/:hash/works',
    name: 'ComposerWorksView',
    component: ComposerWorksView,
}

const composerAlbums = {
    path: '/composers/:hash/albums',
    name: 'ComposerAlbumsView',
    component: ComposerAlbumsView,
}

const artistView = {
    path: '/artists/:hash',
    name: 'ArtistView',
    component: ArtistView,
    beforeEnter: async (to: any) => {
        state.loading.value = true

        await useArtistPageStore()
            .getData(to.params.hash)
            .then(() => {
                state.loading.value = false
            })
    },
}

const NowPlayingView = {
    path: '/nowplaying/:tab',
    name: 'NowPlaying',
    component: NowPlaying,
}

const ArtistTracks = {
    path: '/artists/:hash/tracks',
    name: 'ArtistTracks',
    component: ArtistTracksView,
}

const artistDiscography = {
    path: '/artists/:hash/discography/:type',
    name: 'ArtistDiscographyView',
    component: ArtistDiscographyView,
}

const settings = {
    path: '/settings/:tab',
    name: 'SettingsView',
    component: SettingsView,
}

const search = {
    path: '/search/:page',
    name: 'SearchView',
    component: SearchView,
}

const favorites = {
    path: '/favorites',
    name: 'FavoritesView',
    component: FavoritesView,
}

const favoriteAlbums = {
    path: '/favorites/albums',
    name: 'FavoriteAlbums',
    component: FavoriteCardScroller,
}

const favoriteArtists = {
    path: '/favorites/artists',
    name: 'FavoriteArtists',
    component: FavoriteCardScroller,
}

const favoriteTracks = {
    path: '/favorites/tracks',
    name: 'FavoriteTracks',
    component: FavoriteTracks,
}

const notFound = {
    name: 'NotFound',
    path: '/:pathMatch(.*)',
    component: NotFound,
}

const Home = {
    path: '/',
    name: 'Home',
    component: HomeView,
}

const AlbumListView = {
    path: '/albums',
    name: 'AlbumListView',
    component: AlbumList,
}

const Stats = {
    path: '/stats',
    name: 'StatsView',
    component: StatsView,
}

const ArtistListView = {
    ...AlbumListView,
    path: '/artists',
    name: 'ArtistListView',
}

const Mix = {
    path: '/mix/:mixid',
    name: 'MixView',
    component: MixView,
}

const MixList = {
    path: '/mixes/:type',
    name: 'MixListView',
    component: MixListView,
}

const PageView = {
    path: '/collections/:collection',
    name: 'Collection',
    component: Collection,
}

const OnboardingView = {
    path: '/onboarding/:step?',
    name: 'Onboarding',
    alias: ['/manconfig/:step?'],
    component: Onboarding,
}

const routes = [
    folder,
    playlists,
    playlistView,
    albumView,
    workView,
    composerView,
    composerWorks,
    composerAlbums,
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
    Stats,
    Mix,
    MixList,
    PageView,
    OnboardingView,
]

const Routes = {
    folder: folder.name,
    playlists: playlists.name,
    playlist: playlistView.name,
    album: albumView.name,
    work: workView.name,
    composer: composerView.name,
    composerWorks: composerWorks.name,
    composerAlbums: composerAlbums.name,
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
    Stats: Stats.name,
    Mix: Mix.name,
    MixList: MixList.name,
    Page: PageView.name,
    Onboarding: OnboardingView.name,
}

const router = createRouter({
    mode: 'hash',
    history: createWebHashHistory(import.meta.env.BASE_URL),
    routes,
} as RouterOptions)

export { router, Routes }
