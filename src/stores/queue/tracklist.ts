import { defineStore } from 'pinia'

import useInterface from '@/stores/interface'
import { NotifType, useToast } from '@/stores/notification'
import { usePlayer } from '@/stores/player'
import useQueue from '@/stores/queue'
import useSettings from '@/stores/settings'
import useRemote from '@/stores/remote'

import { FromOptions } from '@/enums'
import {
    ClassicalMovement,
    ClassicalWork,
    fromAlbum,
    fromArtist,
    fromFav,
    fromFolder,
    fromMix,
    fromPlaylist,
    fromSearch,
    fromWork,
    QueueItem,
    QueueWork,
    Track,
} from '@/interfaces'
import track from '@/context_menus/track'
import { getQueueWorks } from '@/requests/classical'
import { useT } from '@/i18n'

const { t } = useT();

export type From =
    | fromFolder
    | fromAlbum
    | fromPlaylist
    | fromSearch
    | fromArtist
    | fromFav
    | fromMix
    | fromWork

function shuffle<T>(items: T[]) {
    const shuffled = items.slice()
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
    }
    return shuffled
}

/** Shuffles `tracks`, spreading tracks by the same artist apart (same as the iOS client and server). */
function smartShuffle(tracks: QueueItem[]) {
    const groups = new Map<string, QueueItem[]>()
    for (const t of tracks) {
        const key = (t.artists?.[0]?.name ?? t.trackhash).trim().toLowerCase()
        groups.set(key, [...(groups.get(key) ?? []), t])
    }
    if (tracks.length <= 2 || groups.size < 2) return shuffle(tracks)

    const placed: [number, QueueItem][] = []
    for (const group of groups.values()) {
        const n = group.length
        const offset = Math.random() / n
        shuffle(group).forEach((t, i) => placed.push([offset + i / n + ((Math.random() * 0.3 - 0.15) / n), t]))
    }
    return placed.sort((a, b) => a[0] - b[0]).map(p => p[1])
}

export default defineStore('tracklist', {
    state: () => ({
        from: {} as From,
        tracklist: <QueueItem[]>[],
        worklist: <{ [workhash: string]: QueueWork }>{},
        shuffled: false,
        baseOrder: <QueueItem[]>[],
    }),
    actions: {
        loadFromLocalStorage() {
            const queue = localStorage.getItem('queue')

            if (queue) {
                const parsed = JSON.parse(queue)
                this.from = parsed.from
                this.tracklist = parsed.tracks
            }
        },
        setNewList(tracklist: Track[]) {
            const remote = useRemote()
            if (remote.routes()) remote.setList(tracklist, this.from)

            if (this.tracklist !== tracklist) {
                this.tracklist = []
                this.tracklist.push(...tracklist)
            }
            this.shuffled = false
            this.baseOrder = []

            this.worklist = {}
            this.indexMissingWorks(tracklist)

            const { focusCurrentInSidebar } = useInterface()
            focusCurrentInSidebar(1000)
            usePlayer().clearNextAudio()
        },
        /**
         * Look up the works of classical tracks added without them, such as
         * from search, favorites, or playlists, so the queue lists them
         * under their works. Runs after the adding action, which may index
         * works itself.
         */
        async indexMissingWorks(tracks: Track[]) {
            if (!useSettings().classical_on) return
            await Promise.resolve()

            const added = new Set(tracks.filter(track => track.is_classical).map(track => track.trackhash))
            // the queue's own items, so stamping them re-renders the queue
            const unindexed = () =>
                this.tracklist.filter(track => added.has(track.trackhash) && !(track as ClassicalMovement).workhash)
            if (!unindexed().length) return

            const works = await getQueueWorks([...added])
            if (works.length) this.indexWorks(works, unindexed())
        },
        indexWorks(works: ClassicalWork[], tracks: Track[]) {
            // maps each work's movements by trackhash so the flat tracks
            // can be stamped with a back-reference to their work
            const trackWork: { [trackhash: string]: ClassicalWork['movements'][number] & { workhash: string } } = {}

            for (const work of works) {
                this.worklist[work.workhash] = {
                    catalogue_ids: work.catalogue_ids,
                    composer: work.composer,
                    composer_hash: work.composer_hash,
                    name: work.name,
                    nickname: work.nickname,
                    subtitle: work.subtitle,
                    workhash: work.workhash,
                }

                for (const movement of work.movements) {
                    trackWork[movement.trackhash] = { ...movement, workhash: work.workhash }
                }
            }

            for (const track of tracks) {
                const movement = trackWork[track.trackhash]
                if (!movement) continue

                const queueMovement = track as ClassicalMovement
                queueMovement.workhash = movement.workhash
                queueMovement.movement_title = movement.movement_title
                queueMovement.movement_name = movement.movement_name
            }
        },
        setFromFolder(path: string, tracks: Track[]) {
            // remove trailing slash
            path = path.replace(/\/$/, '')
            const name = path.split('/').pop()
            this.from = <fromFolder>{
                type: FromOptions.folder,
                path: tracks[0].folder,
                name: name?.trim() === '' ? path : name,
            }
            this.setNewList(tracks)
        },
        setFromAlbum(name: string, albumhash: string, tracks: Track[], works?: ClassicalWork[]) {
            this.from = <fromAlbum>{
                type: FromOptions.album,
                name: name,
                albumhash: albumhash,
            }

            this.setNewList(tracks)

            if (works?.length) {
                this.indexWorks(works, tracks)
            }
        },
        setFromWork(name: string, workhash: string, albumhash: string, tracks: Track[], works: ClassicalWork[]) {
            this.from = <fromWork>{
                type: FromOptions.work,
                name: name,
                workhash: workhash,
                albumhash: albumhash,
            }

            this.setNewList(tracks)
            this.indexWorks(works, tracks)
        },
        setFromPlaylist(name: string, pid: number, tracks: Track[]) {
            this.from = <fromPlaylist>{
                type: FromOptions.playlist,
                name: name,
                id: pid,
            }

            this.setNewList(tracks)
        },
        setFromMix(
            name: string,
            id: string,
            tracks: Track[],
            sourcehash: string,
            image: { type: 'mix' | 'track'; image: string }
        ) {
            this.from = <fromMix>{
                type: FromOptions.mix,
                name: name,
                mixid: id,
                sourcehash,
                image,
            }

            this.setNewList(tracks)
        },
        setFromSearch(query: string, tracks: Track[]) {
            this.from = <fromSearch>{
                type: FromOptions.search,
                query: query,
            }

            this.setNewList(tracks)
        },
        setFromArtist(artisthash: string, name: string, tracks: Track[], works?: ClassicalWork[]) {
            this.from = <fromArtist>{
                type: FromOptions.artist,
                artisthash: artisthash,
                artistname: name,
            }

            this.setNewList(tracks)

            if (works?.length) {
                this.indexWorks(works, tracks)
            }
        },
        setFromFav(tracks: Track[]) {
            this.from = <fromFav>{
                type: FromOptions.favorite,
            }

            this.setNewList(tracks)
        },
        addTrack(track: Track) {
            return this.addTracks([track])
        },
        addTracks(tracks: Track[], works?: ClassicalWork[]) {
            this.insertAt(tracks, this.tracklist.length)

            if (works?.length) {
                this.indexWorks(works, tracks)
            }

            const Toast = useToast()
            Toast.showNotification(t("Stores.Tracklist.AddTrackToQueue", {n: tracks.length}, tracks.length), NotifType.Success)
        },
        insertAt(tracks: Track[], index: number) {
            const remote = useRemote()
            if (remote.routes()) return remote.insertAt(tracks, index)

            this.tracklist.splice(index, 0, ...tracks)
            this.indexMissingWorks(tracks)

            const player = usePlayer()
            const queue = useQueue()

            if (index == queue.nextindex) {
                player.clearNextAudio()
            }
        },
        clearList() {
            const remote = useRemote()
            if (remote.routes()) return remote.clear()

            this.tracklist = []
            this.worklist = {}
            this.from = {} as From
        },
        /** Toggles shuffle: the current track and those before it stay; the upcoming ones are shuffled or restored. */
        toggleShuffle(currentindex: number) {
            const head = this.tracklist.slice(0, currentindex + 1)
            const upcoming = this.tracklist.slice(currentindex + 1)

            if (!this.shuffled) {
                this.baseOrder = this.tracklist.slice()
                this.tracklist = [...head, ...smartShuffle(upcoming)]
            } else {
                const played = new Set(head)
                const base = new Set(this.baseOrder)
                const restored = this.baseOrder.filter(t => !played.has(t) && upcoming.includes(t))
                this.tracklist = [...head, ...restored, ...upcoming.filter(t => !base.has(t))]
                this.baseOrder = []
            }
            this.shuffled = !this.shuffled
        },
        removeByIndex(index: number) {
            const remote = useRemote()
            if (remote.routes()) return remote.remove(index)

            const { currentindex, nextindex, playing, playNext, moveForward, setCurrentIndex } = useQueue()
            const player = usePlayer()

            if (this.tracklist.length == 1) {
                return this.clearList()
            }

            if (index == currentindex) {
                if (playing) {
                    playNext()
                } else {
                    moveForward()
                }

                setCurrentIndex(index)
            }

            if (index < currentindex) {
                setCurrentIndex(currentindex - 1)
            }

            this.tracklist.splice(index, 1)

            if (index == nextindex) {
                player.clearNextAudio()
            }
        },
        toggleFav(index: number) {
            const track = this.tracklist[index]

            if (track) {
                track.is_favorite = !track.is_favorite
            }
        },
        insertAfterCurrent(tracks: Track[], works?: ClassicalWork[]) {
            const { currentindex } = useQueue()
            const remote = useRemote()

            if (remote.routes()) {
                remote.insert(tracks, 'next')
            } else {
                this.tracklist.splice(currentindex + 1, 0, ...tracks)
                this.indexMissingWorks(tracks)

                if (works?.length) {
                    this.indexWorks(works, tracks)
                }
            }

            const Toast = useToast()
            Toast.showNotification(t("Stores.Tracklist.AddTrackToQueue", {n: tracks.length}, tracks.length), NotifType.Success)
        },
    },
    getters: {
        length(): number {
            return this.tracklist.length
        },
    },
    persist: true,
})
