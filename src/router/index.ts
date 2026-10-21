import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router'

import state from '@/composables/state'
import { pageRestoring } from '@/composables/pageCache'
import useAlbumPageStore from '@/stores/pages/album'
import useFolderPageStore from '@/stores/pages/folder'
import usePlaylistPageStore from '@/stores/pages/playlist'
import usePlaylistListPageStore from '@/stores/pages/playlists'
import useArtistPageStore from '@/stores/pages/artist'
import useWorkPageStore from '@/stores/pages/work'

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
const ArtistTracksView = () => import('@/views/ArtistTracks.vue')
const PlaylistListView = () => import('@/views/PlaylistList.vue')
const FavoriteTracks = () => import('@/views/FavoriteTracks.vue')
const PlaylistView = () => import('@/views/PlaylistView/index.vue')
const ArtistDiscographyView = () => import('@/views/ArtistDiscography.vue')
const ArtistWorksView = () => import('@/views/ArtistWorks.vue')
const ClassicalHomeView = () => import('@/views/ClassicalHome.vue')
const ClassicalWorksView = () => import('@/views/ClassicalWorks.vue')
const ClassicalComposersView = () => import('@/views/ClassicalComposers.vue')
const FavoriteCardScroller = () => import('@/views/FavoriteCardScroller.vue')
const StatsView = () => import('@/views/Stats/main.vue')
const MixView = () => import('@/views/MixView.vue')
const MixListView = () => import('@/views/MixListView.vue')
const Collection = () => import('@/views/Collections/Collection.vue')
const Onboarding = () => import('@/views/Onboarding.vue')

const folder = {
    path: '/folder/:path',
    name: 'FolderView',
    meta: { keepAlive: true, stores: ['FolderDirs&Tracks'] },
    component: FolderView,
    beforeEnter: async (to: any) => {
        if (pageRestoring()) return
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
    meta: { keepAlive: true, stores: ['playlists'] },
    component: PlaylistListView,
    beforeEnter: async () => {
        if (pageRestoring()) return
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
    meta: { keepAlive: true, stores: ['playlist-tracks'] },
    component: PlaylistView,
    beforeEnter: async (to: any) => {
        if (pageRestoring()) return
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
    meta: { keepAlive: true, stores: ['album'] },
    component: AlbumView,
    beforeEnter: async (to: any) => {
        if (pageRestoring()) return
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
    meta: { keepAlive: true, stores: ['workpage'] },
    component: WorkView,
    beforeEnter: async (to: any) => {
        if (pageRestoring()) return
        state.loading.value = true

        await useWorkPageStore()
            .fetchWork(to.params.token, to.query.albumhash)
            .then(() => {
                state.loading.value = false
            })
    },
}

const artistWorks = {
    path: '/artists/:hash/works',
    name: 'ArtistWorksView',
    meta: { keepAlive: true, stores: [] },
    component: ArtistWorksView,
}

const artistView = {
    path: '/artists/:hash',
    name: 'ArtistView',
    meta: { keepAlive: true, stores: ['artistPage'] },
    component: ArtistView,
    beforeEnter: async (to: any) => {
        if (pageRestoring()) return
        state.loading.value = true

        await useArtistPageStore()
            .getData(to.params.hash, to.query)
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
    meta: { keepAlive: true, stores: [] },
    component: ArtistTracksView,
}

const artistDiscography = {
    path: '/artists/:hash/discography/:type',
    name: 'ArtistDiscographyView',
    meta: { keepAlive: true, stores: ['artistDiscography'] },
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
    meta: { keepAlive: true, stores: ['search'] },
    component: SearchView,
}

const favorites = {
    path: '/favorites',
    name: 'FavoritesView',
    meta: { keepAlive: true, stores: [] },
    component: FavoritesView,
}

const favoriteAlbums = {
    path: '/favorites/albums',
    name: 'FavoriteAlbums',
    meta: { keepAlive: true, stores: [] },
    component: FavoriteCardScroller,
}

const favoriteArtists = {
    path: '/favorites/artists',
    name: 'FavoriteArtists',
    meta: { keepAlive: true, stores: [] },
    component: FavoriteCardScroller,
}

const favoriteWorks = {
    path: '/favorites/works',
    name: 'FavoriteWorks',
    meta: { keepAlive: true, stores: [] },
    component: FavoriteCardScroller,
}

const favoriteComposers = {
    path: '/favorites/composers',
    name: 'FavoriteComposers',
    meta: { keepAlive: true, stores: [] },
    component: FavoriteCardScroller,
}

const classicalHome = {
    path: '/classical',
    name: 'ClassicalHome',
    meta: { keepAlive: true, stores: [] },
    component: ClassicalHomeView,
}

const classicalWorks = {
    path: '/classical/works',
    name: 'ClassicalWorks',
    meta: { keepAlive: true, stores: [] },
    component: ClassicalWorksView,
}

const classicalAlbums = {
    path: '/classical/albums',
    name: 'ClassicalAlbums',
    meta: { keepAlive: true, stores: [] },
    component: ClassicalComposersView,
}

const classicalComposers = {
    path: '/classical/composers',
    name: 'ClassicalComposers',
    meta: { keepAlive: true, stores: [] },
    component: ClassicalComposersView,
}

const favoriteTracks = {
    path: '/favorites/tracks',
    name: 'FavoriteTracks',
    meta: { keepAlive: true, stores: [] },
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
    meta: { keepAlive: true, stores: ['homepage'] },
    component: HomeView,
}

const AlbumListView = {
    path: '/albums',
    name: 'AlbumListView',
    meta: { keepAlive: true, stores: ['albumlistpage'] },
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
    meta: { keepAlive: true, stores: ['artistlistpage'] },
}

const Mix = {
    path: '/mix/:mixid',
    name: 'MixView',
    meta: { keepAlive: true, stores: [] },
    component: MixView,
}

const MixList = {
    path: '/mixes/:type',
    name: 'MixListView',
    meta: { keepAlive: true, stores: [] },
    component: MixListView,
}

const PageView = {
    path: '/collections/:collection',
    name: 'Collection',
    meta: { keepAlive: true, stores: ['collections'] },
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
    artistWorks,
    artistView,
    artistDiscography,
    settings,
    search,
    notFound,
    ArtistTracks,
    favorites,
    favoriteAlbums,
    favoriteWorks,
    favoriteComposers,
    classicalHome,
    classicalWorks,
    classicalAlbums,
    classicalComposers,
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
    artistWorks: artistWorks.name,
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
    favoriteWorks: favoriteWorks.name,
    favoriteComposers: favoriteComposers.name,
    classicalHome: classicalHome.name,
    classicalWorks: classicalWorks.name,
    classicalAlbums: classicalAlbums.name,
    classicalComposers: classicalComposers.name,
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
