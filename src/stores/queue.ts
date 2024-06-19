import { router, Routes } from '@/router'
import { defineStore } from 'pinia'

import { favType } from '@/enums'
import updateMediaNotif from '@/helpers/mediaNotification'
import { Track } from '@/interfaces'
import { isFavorite } from '@/requests/favorite'
import useInterface from './interface'

import { audio, getUrl, usePlayer } from '@/stores/player'
import useLyrics from './lyrics'
import { NotifType, useToast } from './notification'
import useTracklist from './queue/tracklist'
import useSettings from './settings'

export default defineStore('Queue', {
    state: () => ({
        duration: {
            current: 0,
            full: 0,
        },
        currentindex: 0,
        playing: false,
        /** Whether track has been triggered manually */
        manual: true,
    }),
    actions: {
        setPlaying(val: boolean) {
            this.playing = val
        },
        setDurationFromFile(duration: number) {
            this.duration.full = duration
        },
        setManual(val: boolean) {
            this.manual = val
        },
        setCurrentDuration(duration: number) {
            this.duration.current = duration
        },
        setCurrentIndex(val: number) {
            this.currentindex = val
        },
        play(index: number = 0, manual = true) {
            const { tracklist } = useTracklist()
            if (tracklist.length === 0) return

            this.playing = true
            this.currentindex = index
            this.manual = manual

            const { playCurrent } = usePlayer()
            const { focusCurrentInSidebar } = useInterface()

            playCurrent()
            focusCurrentInSidebar()
        },
        playPause() {
            if (audio.src === '') {
                this.play(this.currentindex)
                return
            }

            if (audio.paused && !this.playing) {
                audio.currentTime === 0 ? this.play(this.currentindex) : null
                audio.play()
                this.playing = true
                return
            }

            audio.pause()
            this.playing = false
        },
        autoPlayNext() {
            const settings = useSettings()
            const { focusCurrentInSidebar } = useInterface()
            const { tracklist } = useTracklist()
            const is_last = this.currentindex === tracklist.length - 1

            if (settings.repeat_one) {
                this.play(this.currentindex, false)
                return
            }

            if (settings.repeat_all) {
                this.play(is_last ? 0 : this.currentindex + 1, false)
                return
            }

            const resetQueue = () => {
                this.currentindex = 0
                audio.src = getUrl(this.next.filepath, this.next.trackhash, settings.use_legacy_streaming_endpoint)
                audio.pause()
                this.playing = false

                updateMediaNotif()
                focusCurrentInSidebar()
            }

            !is_last ? this.play(this.currentindex + 1, false) : resetQueue()
        },
        playNext() {
            this.play(this.nextindex)
        },
        playPrev() {
            const lyrics = useLyrics()

            if (audio.currentTime > 3) {
                this.seek(0)
                lyrics.setCurrentLine(-1)
                return
            }

            this.play(this.previndex)
            usePlayer().clearNextAudio()
        },
        moveForward() {
            this.currentindex = this.nextindex
        },
        seek(pos: number) {
            const lyrics = useLyrics()

            try {
                audio.currentTime = pos
                this.duration.current = pos
            } catch (error) {
                if (error instanceof TypeError) {
                    console.error('Seek error: no audio')
                }
            }

            if (router.currentRoute.value.name == Routes.Lyrics) {
                const line = lyrics.calculateCurrentLine()
                lyrics.setCurrentLine(line)
            }

            const player = usePlayer()
            player.clearMovingNextTimeout()
        },

        playTrackNext(track: Track) {
            const Toast = useToast()
            const { insertAt } = useTracklist()

            const nextindex = this.currentindex + 1
            insertAt([track], nextindex)
            Toast.showNotification(`Added 1 track to queue`, NotifType.Success)
        },
        clearQueue() {
            const store = useTracklist()
            store.clearList()
            this.currentindex = 0
        },
        shuffleQueue() {
            const { shuffleList } = useTracklist()
            const { focusCurrentInSidebar } = useInterface()

            shuffleList()
            this.currentindex = 0
            this.play(this.currentindex)
            focusCurrentInSidebar()
        },
    },
    getters: {
        next(): Track {
            const { tracklist } = useTracklist()
            return tracklist[this.nextindex]
        },
        prev(): Track {
            const { tracklist } = useTracklist()
            return tracklist[this.previndex]
        },
        currenttrack(): Track {
            const { tracklist } = useTracklist()
            const current = tracklist[this.currentindex]

            isFavorite(current?.trackhash || '', favType.track).then(is_fav => {
                if (current) {
                    current.is_favorite = is_fav
                }
            })

            return current
        },
        currenttrackhash(): string {
            return this.currenttrack?.trackhash || ''
        },
        previndex(): number {
            const { tracklist } = useTracklist()
            const { repeat_one } = useSettings()

            if (repeat_one) {
                return this.currentindex
            }

            return this.currentindex === 0 ? tracklist.length - 1 : this.currentindex - 1
        },
        nextindex(): number {
            const { tracklist } = useTracklist()
            const { repeat_one } = useSettings()

            if (repeat_one) {
                return this.currentindex
            }

            return this.currentindex === tracklist.length - 1 ? 0 : this.currentindex + 1
        },
    },
    persist: {
        afterRestore: context => {
            let store = context.store
            store.duration.current = 0
            store.playing = false
        },
    },
})
