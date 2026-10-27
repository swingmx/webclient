import { FromOptions, NotifType, playSources } from '@/enums'

import { useToast } from '@/stores/notification'
import useAlbum from '@/stores/pages/album'
import useArtist from '@/stores/pages/artist'
import usePlaylist from '@/stores/pages/playlist'
import useQueue from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import useSettingsStore from '@/stores/settings'

import { FavTrackKind, Track } from '@/interfaces'
import { getAlbumTracks, normalizeAlbumTracks } from '@/requests/album'
import { getArtistTracks } from '@/requests/artists'
import { getFavTracks } from '@/requests/favorite'
import { getFiles } from '@/requests/folders'
import { getPlaylist } from '@/requests/playlists'
import { useT } from '@/i18n'

const { t } = useT()

export async function utilPlayFromArtist(index: number = 0) {
    const queue = useQueue()
    const artist = useArtist()
    const tracklist = useTracklist()

    const settings = useSettingsStore()

    if (artist.tracks.length === 0) return

    if (artist.info.trackcount <= settings.artist_top_tracks_count) {
        tracklist.setFromArtist(artist.info.artisthash, artist.info.name, artist.tracks)
        queue.play()
        return
    }

    const { tracks, works } = await getArtistTracks(artist.info.artisthash)

    tracklist.setFromArtist(artist.info.artisthash, artist.info.name, tracks, works)
    queue.play(index)
}

export async function playFromAlbumCard(albumhash: string, albumname: string) {
    const queue = useQueue()
    const tracklist = useTracklist()

    const { tracks, works } = normalizeAlbumTracks(await getAlbumTracks(albumhash))

    if (tracks.length === 0) {
        useToast().showNotification(t('UsePlayFrom.AlbumTracksNotFound'), NotifType.Error)
        return
    }

    tracklist.setFromAlbum(albumname, albumhash, tracks, works)
    queue.play()
}

export async function playFromArtistCard(artisthash: string, artistname: string) {
    const queue = useQueue()
    const tracklist = useTracklist()
    const { tracks, works } = await getArtistTracks(artisthash)

    if (tracks.length === 0) {
        useToast().showNotification(t('UsePlayFrom.ArtistTracksNotFound'), NotifType.Error)
        return
    }

    tracklist.setFromArtist(artisthash, artistname, tracks, works)
    queue.play()
}

export async function playFromFolderCard(folderpath: string) {
    const queue = useQueue()
    const tracklist = useTracklist()

    const data = await getFiles(folderpath, 0, -1, true)
    const tracks = data.tracks

    if (tracks.length === 0) {
        useToast().showNotification(t('UsePlayFrom.FolderTracksNotFound'), NotifType.Error)
        return
    }

    tracklist.setFromFolder(folderpath, tracks)
    queue.play()
}

// the kind of favorite tracks the queue was last filled with
let favoritesKind: FavTrackKind = 'all'

export async function playFromFavorites(track: Track | undefined, kind: FavTrackKind = 'all') {
    const queue = useQueue()
    const tracklist = useTracklist()

    // fetch the favorites when the queue does not hold this kind of them
    if (tracklist.from.type !== FromOptions.favorite || favoritesKind !== kind) {
        const res = await getFavTracks(0, -1, kind)
        tracklist.setFromFav(res.tracks)
        favoritesKind = kind
    }

    let index = 0

    if (track) {
        index = tracklist.tracklist.findIndex(t => t.trackhash === track?.trackhash)
    }

    queue.play(index)
}

export async function playFromPlaylist(id: string, track?: Track) {
    const queue = useQueue()
    const tracklist = useTracklist()
    const data = await getPlaylist(id, false, 0, -1)

    if (!data) return

    const { tracks, info } = data

    tracklist.setFromPlaylist(info.name, info.id, tracks)

    if (track) {
        const index = tracks.findIndex(t => t.trackhash === track.trackhash)
        queue.play(index)
    } else {
        queue.play()
    }
}

export const playFrom = async (source: playSources) => {
    const queue = useQueue()
    const tracklist = useTracklist()

    switch (source) {
        case playSources.album: {
            const album = useAlbum()

            tracklist.setFromAlbum(
                album.info.title,
                album.info.albumhash,
                album.srcTracks,
                album.info.is_classical ? album.works : undefined
            )
            queue.play()
            break
        }

        case playSources.playlist: {
            const playlist = usePlaylist()

            if (playlist.tracks.length === 0) return
            if (playlist.tracks.length !== playlist.info.count) {
                // Fetch all tracks if not already fetched
                await playlist.fetchAll(playlist.info.id, false, true)
            }
            tracklist.setFromPlaylist(playlist.info.name, playlist.info.id, playlist.tracks)
            queue.play()

            break
        }

        case playSources.artist:
            utilPlayFromArtist(0)
    }
}
