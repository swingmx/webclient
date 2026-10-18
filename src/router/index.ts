import { createRouter, createWebHashHistory, RouterOptions } from 'vue-router'

import state from '@/composables/state'
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

const artistWorks = {
    path: '/artists/:hash/works',
    name: 'ArtistWorksView',
    component: ArtistWorksView,
}

const artistView = {
    path: '/artists/:hash',
    name: 'ArtistView',
    component: ArtistView,
    beforeEnter: async (to: any) => {
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

const favoriteWorks = {
    path: '/favorites/works',
    name: 'FavoriteWorks',
    component: FavoriteCardScroller,
}

const favoriteComposers = {
    path: '/favorites/composers',
    name: 'FavoriteComposers',
    component: FavoriteCardScroller,
}

const classicalHome = {
    path: '/classical',
    name: 'ClassicalHome',
    component: ClassicalHomeView,
}

const classicalWorks = {
    path: '/classical/works',
    name: 'ClassicalWorks',
    component: ClassicalWorksView,
}

const classicalAlbums = {
    path: '/classical/albums',
    name: 'ClassicalAlbums',
    component: ClassicalComposersView,
}

const classicalComposers = {
    path: '/classical/composers',
    name: 'ClassicalComposers',
    component: ClassicalComposersView,
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
