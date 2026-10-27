import { paths } from '@/config'
import axios from 'axios'
import useAxios from './useAxios'
import { Album, Artist, Track, WorkTile } from '@/interfaces'

const {
    top: searchTopResultsUrl,
    base,
} = paths.api.search

/**
 * Fetch data from url
 * @param url url to fetch json from
 * @returns promise that resolves to the JSON
 */
async function fetchData(url: string) {
    const { data } = await useAxios({
        url: url,
        method: 'GET',
    })

    return data
}

async function searchTopResults(query: string, limit: number) {
    const url = searchTopResultsUrl + encodeURIComponent(query.trim()) + `&limit=${limit}&classical=true`
    return await fetchData(url)
}

async function searchItems(type: 'tracks' | 'movements' | 'works' | 'albums' | 'artists', index: number, query: string) {
    const { data } = await useAxios({
        url: base + `/?itemtype=${type}&start=${index}&q=${encodeURIComponent(query)}&limit=30&classical=true`,
        method: 'GET',
    })

    return data
}

async function searchTracks(query: string, start: number = 0): Promise<{ results: Track[]; more: boolean }> {
    return searchItems('tracks', start, query)
}

async function searchMovements(query: string, start: number = 0): Promise<{ results: Track[]; more: boolean }> {
    return searchItems('movements', start, query)
}

async function searchWorks(query: string, start: number = 0): Promise<{ results: WorkTile[]; more: boolean }> {
    return searchItems('works', start, query)
}

async function searchAlbums(query: string, start: number = 0): Promise<{ results: Album[]; more: boolean }> {
    return searchItems('albums', start, query)
}

async function searchArtists(query: string, start: number = 0): Promise<{ results: Artist[]; more: boolean }> {
    return searchItems('artists', start, query)
}

export { searchAlbums, searchArtists, searchMovements, searchTracks, searchTopResults, searchWorks }

// TODO: Rewrite this module using `useAxios` hook
