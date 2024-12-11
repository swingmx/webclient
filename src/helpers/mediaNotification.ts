import { paths } from '../config'
import useSettings from '../stores/settings'
import useQueueStore from '../stores/queue'
import updatePageTitle from '@/utils/updatePageTitle'

export default () => {
    if ('mediaSession' in navigator) {
        const queue = useQueueStore()
        const { currenttrack: track } = queue

        if (track === undefined) {
            return
        }

        const settings = useSettings()

        if (settings.nowPlayingTrackOnTabTitle) {
            updatePageTitle(`${track.title} - ${track.artists[0].name}`, true)
        }

        const url = paths.images.thumb

        navigator.mediaSession.metadata = new window.MediaMetadata({
            title: track.title,
            album: track.album,
            artist: track.artists.map(a => a.name).join(', '),
            artwork: [
                {
                    src: url.small + track.image,
                    sizes: '96x96',
                    type: 'image/jpeg',
                },
                {
                    src: url.medium + track.image,
                    sizes: '128x128',
                    type: 'image/webp',
                },
                {
                    src: url.medium + track.image,
                    sizes: '192x192',
                    type: 'image/webp',
                },
                {
                    src: url.medium + track.image,
                    sizes: '256x256',
                    type: 'image/webp',
                },
                {
                    src: url.large + track.image,
                    sizes: '384x384',
                    type: 'image/webp',
                },
                {
                    src: url.large + track.image,
                    sizes: '512x512',
                    type: 'image/webp',
                },
            ],
        })

        navigator.mediaSession.setActionHandler('play', () => {
            queue.playPause()
        })
        navigator.mediaSession.setActionHandler('pause', () => {
            queue.playPause()
        })
        navigator.mediaSession.setActionHandler('previoustrack', () => {
            queue.playPrev()
        })
        navigator.mediaSession.setActionHandler('nexttrack', () => {
            queue.playNext()
        })
        navigator.mediaSession.setActionHandler('seekto', details => {
            if (details.fastSeek || details.seekTime == undefined) {
                return
            }

            queue.seek(details.seekTime)
        })
    }
}
