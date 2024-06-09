import { router } from '@/router'
import { Artist, Playlist, Track } from '@/interfaces'
import { router as Router, Routes } from '@/router'

import { Option } from '@/interfaces'
import { openInFiles } from '@/requests/folders'
import { addTracksToPlaylist, removeTracks } from '@/requests/playlists'

import {
    AddToQueueIcon,
    AlbumIcon,
    ArtistIcon,
    DeleteIcon,
    FolderIcon,
    PlayNextIcon,
    PlusIcon,
} from '@/icons'
import usePlaylistStore from '@/stores/pages/playlist'
import useQueueStore from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import { getAddToPlaylistOptions, get_find_on_social } from './utils'

/**
 * Returns a list of context menu items for a track.
 * @param  {any} track a track object.
 * @return {Array<Option>()} a list of context menu items.
 */

export default async (track: Track): Promise<Option[]> => {
    const route = router.currentRoute.value
    const on_playlist =
        route.name === Routes.playlist &&
        !Number.isNaN(parseInt(route.params.pid as string))
    const single_artist = track.artists.length === 1
    const single_album_artist = track.albumartists.length === 1

    const goToArtist = async (artists: Artist[]) => {
        if (artists.length === 1) {
            return false
        }

        return artists.map((artist) => {
            return <Option>{
                label: artist.name,
                action: () =>
                    Router.push({
                        name: Routes.artist,
                        params: {
                            hash: artist.artisthash,
                        },
                    }),
            }
        })
    }

    const AddToPlaylistAction = (playlist: Playlist) => {
        addTracksToPlaylist(playlist, [track]).then((success) => {
            if (
                !(
                    route.name == Routes.playlist &&
                    parseInt(route.params.pid as string) == playlist.id
                )
            )
                return

            if (!success) return
            const store = usePlaylistStore()
            store.addTrack(track)
            store.fetchAll(parseInt(route.params.pid as string), true)
        })
    }

    const add_to_playlist: Option = {
        label: 'Add to Playlist',
        children: () =>
            getAddToPlaylistOptions(AddToPlaylistAction, {
                trackhash: track.trackhash,
                playlist_name: track.title + ' Radio',
            }),
        icon: PlusIcon,
    }

    const add_to_q: Option = {
        label: 'Add to Queue',
        action: () => {
            useTracklist().addTrack(track)
        },
        icon: AddToQueueIcon,
    }

    const play_next: Option = {
        label: 'Play next',
        action: () => {
            useQueueStore().playTrackNext(track)
        },
        icon: PlayNextIcon,
    }

    const go_to_folder: Option = {
        label: 'Go to Folder',
        action: () => {
            Router.push({
                name: Routes.folder,
                params: { path: track.folder },
            })
        },
        icon: FolderIcon,
    }

    const go_to_artist: Option = {
        label: `Go to Artist`,
        icon: ArtistIcon,
        action: () => {
            single_artist
                ? Router.push({
                      name: Routes.artist,
                      params: {
                          hash: track.artists[0].artisthash,
                      },
                  })
                : null
        },
        singleChild: track.artists.length === 1,
        children: () => goToArtist(track.artists),
    }

    const go_to_alb_artist: Option = {
        label: `Go to Album Artist`,
        action: () => {
            single_album_artist
                ? Router.push({
                      name: Routes.artist,
                      params: {
                          hash: track.albumartists[0].artisthash,
                      },
                  })
                : null
        },
        icon: ArtistIcon,
        singleChild: track.albumartists.length === 1,
        children: () => goToArtist(track.albumartists),
    }

    const open_in_explorer: Option = {
        label: 'Open in files',
        action: () => {
            openInFiles(track.filepath || track.folder || '')
        },
        icon: FolderIcon,
    }

    const go_to_album: Option = {
        label: 'Go to Album',
        action: () => {
            Router.push({
                name: Routes.album,
                params: { albumhash: track.albumhash },
            })
        },
        icon: AlbumIcon,
    }

    // const del_track: Option = {
    //   label: "Delete Track",
    //   action: () => console.log("Delete Track"),
    //   icon: DeleteIcon,
    //   critical: true,
    // };

    const getRemoveFromPlaylistOption = () =>
        <Option>{
            label: 'Remove From Playlist',
            action: () => {
                removeTracks(parseInt(route.params.pid as string), [
                    { trackhash: track.trackhash, index: track.index },
                ]).then(() => {
                    const store = usePlaylistStore()
                    store.removeTrackByIndex(track.index)
                    store.fetchAll(parseInt(route.params.pid as string), true)
                })
            },
            icon: DeleteIcon,
            critical: true,
        }

    const options: Option[] = [
        play_next,
        add_to_q,
        add_to_playlist,
        go_to_album,
        go_to_folder,
        go_to_artist,
        go_to_alb_artist,
        open_in_explorer,
        get_find_on_social('track', `${track.title} ${track.artists[0].name}`),
        // del_track,
    ]

    if (route.name === Routes.playlist && on_playlist) {
        options.splice(0, 0, getRemoveFromPlaylistOption())
    }

    if (route.name === Routes.nowPlaying) {
        options.splice(0, 0, <Option>{
            label: 'Remove from Queue',
            action: () => {
                useTracklist().removeByIndex(track.index)
            },
            icon: DeleteIcon,
            critical: true,
        })
    }

    return options
}

// TODO: Find a way to fetch playlists lazily. ie. When the "Add to playlist" option is triggered.
