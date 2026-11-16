import { reactive, ref } from 'vue'
import { computed, watch } from 'vue'
import { defineStore } from 'pinia'

import { Routes, router } from '@/router'
import { useDebounce } from '@vueuse/core'


import useTabs from './tabs'
import useCommandPalette from './commandPalette'
import useLoader from './loader'
import useSettings from './settings'
import { maxAbumCards } from './content-width'
import { Album, Artist, ClassicalTopResult, Playlist, Track, WorkTile } from '../interfaces'
import {
    searchAlbums,
    searchArtists,
    searchMovements,
    searchTopResults,
    searchTracks,
    searchWorks,
} from '@/requests/searchMusic'

export default defineStore('search', () => {
    const query = ref('')
    const settings = useSettings()
    const route = computed(() => router.currentRoute.value)
    const debouncedQuery = useDebounce(query, 500)
    const { startLoading, stopLoading } = useLoader()

    const currentTab = ref('top')
    const top_results = reactive({
        query: '',
        top_result: <Track | Album | Artist | ClassicalTopResult>{},
        tracks: <Track[]>[],
        works: <WorkTile[]>[],
        albums: <Album[]>[],
        artists: <Artist[]>[],
    })

    const tracks = reactive({
        query: '',
        value: <Track[]>[],
        more: false,
    })

    const movements = reactive({
        query: '',
        value: <Track[]>[],
        more: false,
    })

    const works = reactive({
        query: '',
        value: <WorkTile[]>[],
        more: false,
    })

    const albums = reactive({
        query: '',
        value: <Album[]>[],
        more: false,
    })

    const artists = reactive({
        query: '',
        value: <Artist[]>[],
        more: false,
    })

    const playlists = reactive({
        query: '',
        value: <Playlist[]>[],
        more: false,
    })

    const searching = ref(false)
    // the query sent from outside the search page, and its request number
    let submitted = ''
    let latest = 0
    watch(query, value => {
        if (value.trim() !== submitted) submitted = ''
    })

    /**
     * From outside the search page: open the artist the query clearly names
     * in the command palette index, else run the top search and open the
     * search page with the results loaded.
     */
    async function submit(query: string) {
        query = query.trim()
        if (!query || query === submitted) return
        submitted = query
        const id = ++latest
        currentTab.value = 'top'
        searching.value = true
        try {
            const artist = settings.jump_to_artist ? await useCommandPalette().match(query) : null
            if (id !== latest) return
            if (artist) {
                router.push({ name: Routes.artist, params: { hash: artist.hash } })
                return
            }

            const res = await searchTopResults(query, maxAbumCards.value)
            if (id !== latest) return
            top_results.top_result = res.top_result
            top_results.tracks = res.tracks
            top_results.works = res.works ?? []
            top_results.albums = res.albums
            top_results.artists = res.artists
            top_results.query = query
            router.push({ name: Routes.search, params: { page: 'top' }, query: { q: query } })
        } catch {
            if (id !== latest) return
            router.push({ name: Routes.search, params: { page: 'top' }, query: { q: query } })
            fetchTopResults(query)
        } finally {
            if (id === latest) searching.value = false
        }
    }

    /**
     * Open the search page for a query, with its top results, never an
     * artist page.
     */
    async function openResults(text: string) {
        text = text.trim()
        if (!text) return
        latest++
        searching.value = false
        submitted = text
        currentTab.value = 'top'
        await router.push({ name: Routes.search, params: { page: 'top' }, query: { q: text } })
        if (top_results.query !== text) {
            top_results.query = text
            fetchTopResults(text)
        }
    }

    function fetchTopResults(query: string) {
        if (!query) return
        let limit = 3

        if (route.value.name == Routes.search) {
            limit = maxAbumCards.value
        }

        searchTopResults(query, limit).then(res => {
            top_results.top_result = res.top_result
            top_results.tracks = res.tracks
            top_results.works = res.works ?? []
            top_results.albums = res.albums
            top_results.artists = res.artists
        })
    }

    // NOTE: The fetch methods are called twice from a page reload
    // This is because of the watchers down there
    // WONTFIX!

    /**
     * Searches for tracks, albums and artists
     * @param query query to search for
     */
    function fetchTracks(query: string) {
        if (!query) return

        searchTracks(query).then(data => {
            tracks.value = data.results
            tracks.more = data.more
            tracks.query = query
        })
    }

    function fetchMovements(query: string) {
        if (!query) return

        searchMovements(query).then(res => {
            movements.value = res.results
            movements.more = res.more
            movements.query = query
        })
    }

    function fetchWorks(query: string) {
        if (!query) return

        searchWorks(query).then(res => {
            works.value = res.results
            works.more = res.more
            works.query = query
        })
    }

    function fetchAlbums(query: string) {
        if (!query) return

        searchAlbums(query).then(res => {
            albums.value = res.results
            albums.more = res.more
            albums.query = query
        })
    }

    function fetchArtists(query: string) {
        if (!query) return

        searchArtists(query).then(res => {
            artists.value = res.results
            artists.more = res.more
            artists.query = query
        })
    }

    async function loadTracks() {
        startLoading()
        const { results: moretracks, more } = await searchTracks(query.value, tracks.value.length)
        tracks.value = [...tracks.value, ...moretracks]
        tracks.more = more
        return stopLoading()
    }

    async function loadMovements() {
        startLoading()
        const { results: moremovements, more } = await searchMovements(query.value, movements.value.length)
        movements.value = [...movements.value, ...moremovements]
        movements.more = more
        return stopLoading()
    }

    async function loadWorks() {
        startLoading()
        const { results: moreworks, more } = await searchWorks(query.value, works.value.length)
        works.value = [...works.value, ...moreworks]
        works.more = more
        return stopLoading()
    }

    async function loadAlbums() {
        startLoading()
        const { results: morealbums, more } = await searchAlbums(query.value, albums.value.length)
        albums.value = [...albums.value, ...morealbums]
        albums.more = more
        return stopLoading()
    }

    async function loadArtists() {
        startLoading()
        const { results: moreartists, more } = await searchArtists(query.value, artists.value.length)
        artists.value = [...artists.value, ...moreartists]
        artists.more = more
        return stopLoading()
    }

    watch(
        () => debouncedQuery.value,
        newQuery => {
            if (newQuery.trim() == '') return
            // Enter already opened the search page with these results
            if (route.value.name === Routes.search && newQuery.trim() === submitted && top_results.query === submitted) return

            if (!settings.use_sidebar && route.value.name !== Routes.search) {
                return submit(newQuery)
            }

            if (route.value.name === Routes.search) {
                router.replace({
                    name: Routes.search,
                    params: {
                        page: route.value.params.page,
                    },
                    query: { q: newQuery },
                })
            }

            const tabs = useTabs()

            if (route.value.name !== Routes.search && tabs.current !== 'search') {
                tabs.switchToSearch()
            }

            switch (currentTab.value) {
                case 'top':
                    fetchTopResults(newQuery)
                    break
                case 'tracks':
                    fetchTracks(newQuery)
                    break
                case 'movements':
                    fetchMovements(newQuery)
                    break
                case 'works':
                    fetchWorks(newQuery)
                    break
                case 'albums':
                    fetchAlbums(newQuery)
                    break
                case 'artists':
                    fetchArtists(newQuery)
                    break
                default:
                    fetchTracks(newQuery)
                    break
            }
        }
    )

    watch(
        () => currentTab.value,
        newTab => {
            const current_query: string = query.value

            switch (newTab) {
                case 'top':
                    if (top_results.query == current_query) break
                    fetchTopResults(current_query)
                    break
                case 'tracks':
                    if (tracks.query == current_query) break
                    fetchTracks(current_query)
                    break

                case 'movements':
                    if (movements.query == current_query) break
                    fetchMovements(current_query)
                    break

                case 'works':
                    if (works.query == current_query) break
                    fetchWorks(current_query)
                    break

                case 'albums':
                    if (albums.query == current_query) break
                    fetchAlbums(current_query)
                    break

                case 'artists':
                    if (artists.query == current_query) break
                    fetchArtists(current_query)
                    break
                default:
                    fetchTracks(current_query)
                    break
            }
        }
    )

    function switchTab(tab: string) {
        currentTab.value = tab
    }

    return {
        top_results,
        tracks,
        movements,
        works,
        albums,
        artists,
        playlists,
        query,
        currentTab,
        searching,
        submit,
        openResults,
        loadTracks,
        loadMovements,
        loadWorks,
        loadAlbums,
        loadArtists,
        switchTab,
    }
})
