import { router, Routes } from '@/router'
import { defineStore } from 'pinia'
import { ref } from 'vue'

import useColors from './colors'
import useLyrics from './lyrics'
import { NotifType, useToast } from './notification'
import useQueue from './queue'
import useTracklist from './queue/tracklist'
import useSettings from './settings'
import useTracker from './tracker'

import { paths } from '@/config'
import updateMediaNotif from '@/helpers/mediaNotification'
import { crossFade } from '@/utils/audio/crossFade'

export function getUrl(filepath: string, trackhash: string, use_legacy: boolean) {
    return `${paths.api.files}/${trackhash + (use_legacy ? '/legacy' : '')}?filepath=${encodeURIComponent(filepath)}`
}

let audio = new Audio()
const buffering = ref(true)
const maxSeekPercent = ref(0)

export const usePlayer = defineStore('player', () => {
    const queue = useQueue()
    const colors = useColors()
    const lyrics = useLyrics()
    const tracker = useTracker()
    const toast = useToast()
    const settings = useSettings()
    const tracklist = useTracklist()

    let currentAudioData = {
        filepath: '',
        silence: {
            starting_file: 0,
            ending_file: 0,
        },
    }

    let nextAudioData = {
        filepath: '',
        audio: new Audio(),
        loaded: false,
        ticking: false,
        silence: {
            starting_file: 0,
            ending_file: 0,
        },
    }

    let movingNextTimer: any = null
    function clearMovingNextTimeout() {
        if (movingNextTimer) {
            clearTimeout(movingNextTimer)
            movingNextTimer = null
            nextAudioData.ticking = false
        }
    }

    function clearNextAudioData() {
        nextAudioData.filepath = ''
        nextAudioData.audio = new Audio()
        nextAudioData.loaded = false
        nextAudioData.ticking = false
        nextAudioData.silence = {
            starting_file: 0,
            ending_file: 0,
        }

        clearMovingNextTimeout()
    }

    // let sourceTime = 0
    // let lastTime = 0

    function setVolume(new_value: number) {
        audio.volume = new_value
    }


    function setMute(new_value: boolean) {
        audio.muted = new_value
    }

    const audio_onerror = (err: Event | string) => {
        const { showNotification } = useToast()

        if (typeof err != 'string') {
            err.stopImmediatePropagation()
        }

        if (err instanceof DOMException) {
            queue.playPause()

            return toast.showNotification('Tap anywhere in the page and try again (autoplay blocked))', NotifType.Error)
        }

        showNotification("Can't load: " + queue.currenttrack.title, NotifType.Error)

        // if (queue.currentindex !== tracklist.tracklist.length - 1) {
        //     if (!queue.playing) return

        //     let onErrorPrevTrackHash: string = queue.currenttrackhash

        //     setTimeout(() => {
        //         // if another track has been played, don't play next track
        //         if (queue.currenttrackhash !== onErrorPrevTrackHash) {
        //             return
        //         }

        //         queue.playNext()
        //     }, 3000)
        //     return
        // }

        // TODO: move this to a queue action
        // queue.setPlaying(false)
    }

    const handlePlayErrors = (e: Event) => {
        if (e instanceof DOMException) {
            queue.playPause()

            return toast.showNotification('Tap anywhere in the page and try again (autoplay blocked))', NotifType.Error)
        }

        toast.showNotification("Can't load: " + queue.currenttrack.title, NotifType.Error)
    }

    const runActionsOnPlay = () => {
        if (
            !queue.manual &&
            !audio.src.includes('sm.radio.jingles') &&
            audio.currentTime - currentAudioData.silence.starting_file / 1000 <= 4
        ) {
            crossFade({
                audio,
                duration: settings.crossfade_duration,
                start_volume: 0,
            })
        }

        updateMediaNotif()
        colors.setTheme1Color(paths.images.thumb.small + queue.currenttrack.image)

        if (router.currentRoute.value.name == Routes.Lyrics) {
            return lyrics.getLyrics()
        }

        if (!settings.use_lyrics_plugin) {
            lyrics.checkExists(queue.currenttrack.filepath, queue.currenttrack.trackhash)
        }
    }

    const onAudioCanPlay = () => {
        if (!queue.playing) {
            audio.pause()
            return
        }
        queue.setDurationFromFile(audio.duration)

        audio.play().catch(handlePlayErrors)
    }

    const onAudioEnded = () => {
        const { submitData } = tracker
        submitData()
        // queue.autoPlayNext()
    }

    const onAudioPlay = () => {
        // reset sourceTime to prevent false positives
        // const date = new Date()
        // sourceTime = date.getTime()

        runActionsOnPlay()
    }

    const updateLyricsPosition = () => {
        if (!lyrics.exists || router.currentRoute.value.name !== Routes.Lyrics) return

        const millis = Math.round(audio.currentTime * 1000)
        const diff = lyrics.nextLineTime - millis

        if (diff < 0) {
            const line = lyrics.calculateCurrentLine()
            lyrics.setCurrentLine(line + 1, false)
            return
        }

        if (diff < 1200) {
            // set timer to next line
            if (lyrics.lyrics && !(lyrics.lyrics.length <= lyrics.currentLine + 1) && !lyrics.ticking) {
                lyrics.setNextLineTimer(diff)
            }
        }
    }

    const handleNextAudioCanPlay = async () => {
        if (!settings.use_silence_skip) {
            nextAudioData.silence.starting_file = 0
            currentAudioData.silence.ending_file = Math.floor(audio.duration * 1000)
            nextAudioData.loaded = true
            return
        }

        const worker = new Worker('/workers/silence.js')

        worker.postMessage({
            ending_file: queue.currenttrack.filepath,
            starting_file: queue.next.filepath,
        })

        worker.onmessage = e => {
            const silence = e.data
            nextAudioData.silence.starting_file = silence.starting_file
            currentAudioData.silence.ending_file = silence.ending_file
            nextAudioData.loaded = silence !== null
        }
    }

    function loadNextTrack() {
        if (nextAudioData.filepath === queue.next.filepath) return

        const uri = getUrl(queue.next.filepath, queue.next.trackhash, settings.use_legacy_streaming_endpoint)
        nextAudioData.audio = new Audio(uri)
        nextAudioData.audio.muted = settings.mute
        nextAudioData.filepath = queue.next.filepath
        nextAudioData.audio.oncanplay = handleNextAudioCanPlay
        nextAudioData.audio.load()
    }

    function moveLoadedForward() {
        clearEventHandlers(audio)

        const oldAudio = audio
        queue.setManual(false)
        crossFade({
            audio: oldAudio,
            duration: settings.crossfade_duration,
            start_volume: settings.volume,
            then_destroy: true,
        })

        // INFO: Set stuff
        audio = nextAudioData.audio
        audio.currentTime = nextAudioData.silence.starting_file / 1000
        currentAudioData.silence = nextAudioData.silence
        currentAudioData.filepath = nextAudioData.filepath
        maxSeekPercent.value = 0

        clearNextAudioData()
        queue.moveForward()
        assignEventHandlers(audio)
        tracker.changeKey()
    }

    const initLoadingNextTrackAudio = () => {
        const { currentindex } = queue
        const { length } = tracklist
        const { repeat_all, repeat_one } = settings

        // if no repeat && is last track, return
        if (currentindex === length - 1 && !repeat_all && !repeat_one) {
            return
        }

        const currentTime = audio.currentTime

        // if track has less than 30 seconds left, load next track
        if (Number.isNaN(audio.duration) || audio.duration - currentTime > 30) {
            return
        }

        if (!nextAudioData.loaded) {
            loadNextTrack()
        }

        if (nextAudioData.loaded && !nextAudioData.ticking && currentAudioData.silence.ending_file) {
            const { crossfade_duration, use_crossfade } = settings
            const diff = currentAudioData.silence.ending_file - Math.floor(audio.currentTime * 1000)

            const is_jingle = queue.currenttrack.filepath.includes('sm.radio.jingles')
            const newdiff = crossfade_duration > diff || is_jingle || !use_crossfade ? diff : diff - crossfade_duration

            if (diff > 0) {
                nextAudioData.ticking = true
                movingNextTimer = setTimeout(() => {
                    nextAudioData.ticking = false
                    if (!queue.playing && nextAudioData.filepath == queue.next.filepath) return
                    moveLoadedForward()
                }, newdiff)
            }
        }
    }

    const onAudioTimeUpdateHandler = () => {
        updateLyricsPosition()
        initLoadingNextTrackAudio()
        queue.setCurrentDuration(audio.currentTime)

        // const date = new Date()
        // sourceTime = date.getTime()
    }

    const handleBufferingStatus = () => {
        try {
            const latestBufferedTime = audio.buffered.end(audio.buffered.length - 1)
            const buffer = latestBufferedTime - audio.currentTime
            buffering.value = buffer < 1
            maxSeekPercent.value = Math.max(maxSeekPercent.value, (latestBufferedTime / audio.duration) * 100)
        } catch (error) {
            buffering.value = true
        }
    }

    const updateBufferWatcherTime = () => {
        if (!queue.playing) return
        handleBufferingStatus()
    }

    // Loader will misbehave on HMR because of multiple setInterval calls
    setInterval(() => {
        if (!queue.playing) {
            buffering.value = false
            return
        }

        updateBufferWatcherTime()
    }, 1000)

    function playCurrentTrack() {
        tracker.changeKey()
        clearEventHandlers(audio)
        maxSeekPercent.value = 0

        if (!queue.manual && queue.playing && audio.src !== '' && !audio.src.includes('sm.radio.jingles')) {
            const oldAudio = audio
            crossFade({
                audio: oldAudio,
                duration: settings.crossfade_duration,
                start_volume: settings.volume,
                then_destroy: true,
            })
            audio = new Audio()
            audio.muted = settings.mute
        }

        const { currenttrack: track } = queue
        // const uri = `${paths.api.files}/${track.trackhash}?filepath=${encodeURIComponent(track.filepath as string)}`
        const uri = getUrl(track.filepath, track.trackhash, settings.use_legacy_streaming_endpoint)

        audio.src = uri

        clearNextAudioData()
        assignEventHandlers(audio)
    }

    const assignEventHandlers = (audioElem: HTMLAudioElement) => {
        audioElem.onerror = audio_onerror
        audioElem.oncanplay = onAudioCanPlay
        audioElem.onended = onAudioEnded
        audioElem.onplay = onAudioPlay
        audioElem.ontimeupdate = onAudioTimeUpdateHandler
        tracker.reassignEventListener()
    }

    const clearEventHandlers = (audioElem: HTMLAudioElement) => {
        audioElem.onerror = null
        audioElem.oncanplay = null
        audioElem.onended = null
        audioElem.onplay = null
        audioElem.ontimeupdate = null

        // removes listener added in stores/tracker.ts
        audioElem.removeEventListener('timeupdate', () => {})
    }

    assignEventHandlers(audio)

    return {
        audio,
        setMute,
        setVolume,
        playCurrent: playCurrentTrack,
        clearNextAudio: clearNextAudioData,
        clearMovingNextTimeout,
    }
})

export { audio, buffering, maxSeekPercent }
