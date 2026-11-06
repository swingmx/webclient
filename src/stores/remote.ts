import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { getBaseUrl, paths } from '@/config'
import { Track } from '@/interfaces'
import { audioSource, getUrl, usePlayer } from './player'
import useQueue from './queue'
import useTracklist, { From } from './queue/tracklist'
import useSettings from './settings'
import { getSource } from './tracker'
import { readLocalStorage } from '@/utils/useLocalStorage'

interface Playhead {
    uid: string | null
    position_ms: number
    playing: boolean
    at: number
}

interface Device {
    id: string
    name: string
    type: string
}

interface State {
    version: number
    active_device_id: string | null
    active_reachable: boolean
    playhead: Playhead
    queue: { source: string; items: { uid: string; track: Track }[]; order: string[] | null; repeat: 'none' | 'all' | 'one' }
    volume: number
    devices: Device[]
    now: number
}

let localDepth = 0

/**
 * Runs `fn` on the local player and queue, bypassing Remote Control routing.
 */
export function local<T>(fn: () => T): T {
    localDepth++
    try {
        return fn()
    } finally {
        localDepth--
    }
}

function getDeviceId() {
    let id = localStorage.getItem('rc_device_id')
    if (!id) {
        id = crypto.randomUUID()
        localStorage.setItem('rc_device_id', id)
    }
    return id
}

function getDeviceName() {
    const ua = navigator.userAgent
    const browser = /Edg\//.test(ua)
        ? 'Edge'
        : /OPR\//.test(ua)
        ? 'Opera'
        : /Firefox\//.test(ua)
        ? 'Firefox'
        : /Chrome\//.test(ua)
        ? 'Chrome'
        : /Safari\//.test(ua)
        ? 'Safari'
        : 'Browser'
    const os = /iPhone|iPad/.test(ua)
        ? 'iOS'
        : /Android/.test(ua)
        ? 'Android'
        : /Mac/.test(ua)
        ? 'macOS'
        : /Win/.test(ua)
        ? 'Windows'
        : /Linux/.test(ua)
        ? 'Linux'
        : 'Web'
    return `${browser} on ${os}`
}

function clearMediaSession() {
    if (!('mediaSession' in navigator)) return
    navigator.mediaSession.metadata = null
    navigator.mediaSession.playbackState = 'none'
    for (const action of ['play', 'pause', 'previoustrack', 'nexttrack', 'seekto'] as const) {
        navigator.mediaSession.setActionHandler(action, null)
    }
}

const SILENCE = 'data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA='
const HANDLERS = ['onplay', 'oncanplay', 'onended', 'onerror', 'ontimeupdate'] as const

/**
 * Plays and pauses both audio elements inside a user gesture. Resolves whether autoplay is unlocked.
 */
function unlockAudio() {
    const queue = useQueue()
    const settings = useSettings()

    return Promise.all(
        [audioSource.playingSource, audioSource.standbySource].map(el => {
            if (!el.paused || el.played.length) return true

            const saved = HANDLERS.map(key => el[key])
            HANDLERS.forEach(key => ((el as any)[key] = null))
            el.muted = true
            if (!el.getAttribute('src')) el.src = SILENCE

            return el
                .play()
                .then(
                    () => {
                        if (!queue.playing) el.pause()
                        return true
                    },
                    // a play interrupted by the gesture's own playback still counts as unlocked
                    (e: DOMException) => e.name !== 'NotAllowedError'
                )
                .finally(() => {
                    if (el.src === SILENCE) {
                        el.removeAttribute('src')
                        el.load()
                    }
                    el.muted = settings.mute
                    // the gesture may have started playback and assigned fresh handlers
                    HANDLERS.forEach((key, i) => el[key] === null && ((el as any)[key] = saved[i]))
                })
        })
    ).then(results => results.every(Boolean) && ((navigator as any).userActivation?.hasBeenActive ?? true))
}

export default defineStore('remote', () => {
    const queue = useQueue()
    const tracklist = useTracklist()
    const settings = useSettings()

    const available = ref(false)
    /** another tab of this browser is the device */
    const otherTab = ref(false)
    /** the stream is open and the server state is rendered */
    const connected = ref(false)
    const version = ref(0)
    const activeId = ref<string | null>(null)
    const reachable = ref(false)
    const devices = ref<Device[]>([])
    const playhead = ref<Playhead>({ uid: null, position_ms: 0, playing: false, at: 0 })
    const shuffled = ref(false)
    const pickerOpen = ref(false)
    const offerPlayHere = ref(false)
    const deviceId = ref('')

    // queue item uids, aligned with tracklist.tracklist
    const uids: string[] = []
    let synced = false
    let skew = 0
    let pending: { source: string; trackhashes: string[] } | null = null
    let es: EventSource | null = null
    let releaseLock: (() => void) | null = null
    let requested = false
    let chain: Promise<unknown> = Promise.resolve()
    // bumped by active-device events so older state responses don't override them
    let activeEpoch = 0

    const isActive = computed(() => connected.value && reachable.value && activeId.value === deviceId.value)
    const activeName = computed(() => {
        if (!reachable.value || activeId.value === deviceId.value) return ''
        return devices.value.find(d => d.id === activeId.value)?.name || ''
    })

    /** Whether store actions should go to the server instead of the local player. */
    function routes() {
        return connected.value && localDepth === 0
    }

    // requests

    async function send(path: string, body: object) {
        const req = chain.then(() =>
            axios.post(paths.api.remote + path, { device_id: deviceId.value, ...body }, { withCredentials: true })
        )
        chain = req.catch(() => {})

        try {
            return (await req).data
        } catch (e: any) {
            const code = e.response?.data?.error
            if (code === 'unknown_uid') refresh()
            if (code === 'no_active_device' || code === 'active_unreachable') {
                offerPlayHere.value = true
                pickerOpen.value = true
            }
        }
    }

    async function fetchState(): Promise<State | null> {
        try {
            const res = await axios.get(paths.api.remote + '/state', { withCredentials: true })
            skew = res.data.now - Date.now() / 1000
            return res.data
        } catch {
            return null
        }
    }

    async function refresh() {
        const epoch = activeEpoch
        const state = await fetchState()
        if (state) render(state, epoch === activeEpoch)
    }

    function edit(ops: object[]) {
        return send('/queue', { ops })
    }

    function player(action: string, args: object = {}) {
        return send('/player', { action, ...args })
    }

    function transfer(id: string, play = playhead.value.playing || offerPlayHere.value) {
        pickerOpen.value = false
        offerPlayHere.value = false
        return send('/transfer', { device_id: id, play })
    }

    // routed store actions

    function play(index: number) {
        if (pending) {
            const p = pending
            pending = null
            return edit([{ type: 'replace', ...p, start_index: index, play: true }])
        }

        const uid = uids[index]
        if (uid) player('jump', { uid })
    }

    function setList(tracks: Track[], from: From) {
        pending = { source: getSource(from), trackhashes: tracks.map(t => t.trackhash) }
        uids.length = 0
        synced = false
    }

    function insert(tracks: Track[], at: string | { after: string }) {
        return edit([{ type: 'insert', trackhashes: tracks.map(t => t.trackhash), at }])
    }

    function insertAt(tracks: Track[], index: number) {
        return insert(tracks, index > 0 && index < uids.length ? { after: uids[index - 1] } : 'end')
    }

    function remove(index: number) {
        if (uids[index]) edit([{ type: 'remove', uids: [uids[index]] }])
    }

    function clear() {
        edit([{ type: 'replace', source: '', trackhashes: [], start_index: 0, play: false }])
    }

    let volumeTimer: ReturnType<typeof setTimeout> | undefined
    function setVolume(value: number) {
        clearTimeout(volumeTimer)
        volumeTimer = setTimeout(() => player('volume', { value }), 150)
    }

    // rendering

    function render(state: State, withActive = true) {
        if (withActive) {
            activeId.value = state.active_device_id
            reachable.value = state.active_reachable
            devices.value = state.devices
        }
        applyVolume(state.volume)

        if (state.version > 0 && state.version >= version.value) renderQueue(state)
        if (state.playhead.at >= playhead.value.at) renderPlayhead(state.playhead)
    }

    function renderQueue(state: State) {
        version.value = state.version
        shuffled.value = state.queue.order !== null
        settings.repeat = state.queue.repeat

        const tracks = new Map(state.queue.items.map(i => [i.uid, i.track]))
        const order = state.queue.order ?? state.queue.items.map(i => i.uid)
        const current = isActive.value ? uids[queue.currentindex] : undefined

        if (!synced || order.join() !== uids.join()) {
            synced = true
            pending = null
            uids.splice(0, uids.length, ...order)
            local(() => tracklist.setNewList(order.map(uid => tracks.get(uid)!)))
        }

        if (getSource(tracklist.from) !== state.queue.source) tracklist.from = {} as From
        placeIndex(current)
    }

    function placeIndex(uid?: string) {
        const index = uids.indexOf(uid ?? playhead.value.uid ?? '')
        if (index >= 0) queue.setCurrentIndex(index)
    }

    function renderPlayhead(p: Playhead) {
        playhead.value = p
        if (isActive.value) return

        placeIndex()
        queue.setPlaying(p.playing)
        queue.setDurationFromFile(queue.currenttrack.duration || 0)
        queue.setCurrentDuration(position())
    }

    function position() {
        const p = playhead.value
        return p.position_ms / 1000 + (p.playing ? Math.max(Date.now() / 1000 + skew - p.at, 0) : 0)
    }

    function applyVolume(value: number) {
        settings.volume = value
        usePlayer().setVolume(settings.volume_gain)
    }

    // the active device

    let reportTimer: ReturnType<typeof setTimeout> | undefined
    function report() {
        clearTimeout(reportTimer)
        reportTimer = setTimeout(() => {
            if (!isActive.value) return
            send('/playhead', {
                uid: uids[queue.currentindex] ?? null,
                position_ms: Math.round((audioSource.playingSource.currentTime || 0) * 1000),
                playing: queue.playing,
            })
        }, 250)
    }

    async function command(c: { action: string; uid?: string | null; play?: boolean; position_ms?: number }) {
        if (c.action === 'jump' && c.uid && !uids.includes(c.uid)) await refresh()

        local(() => {
            switch (c.action) {
                case 'play':
                    if (!queue.playing) queue.playPause()
                    break
                case 'pause':
                    if (queue.playing) queue.playPause()
                    break
                case 'toggle':
                    queue.playPause()
                    break
                case 'next':
                    queue.playNext()
                    break
                case 'prev':
                    queue.playPrev()
                    break
                case 'seek':
                    queue.seek((c.position_ms || 0) / 1000)
                    break
                case 'jump':
                    jump(c.uid ?? null, c.play ?? true)
                    break
            }
        })
        report()
    }

    function jump(uid: string | null, play: boolean) {
        if (uid === null) {
            if (queue.playing) queue.playPause()
            return
        }

        const index = uids.indexOf(uid)
        if (index < 0) return
        if (play) return queue.play(index)

        queue.setCurrentIndex(index)
        queue.setPlaying(false)
        usePlayer().playCurrent()
    }

    async function activate(p: Playhead, play: boolean) {
        activeEpoch++
        activeId.value = deviceId.value
        reachable.value = true
        if (p.uid && !uids.includes(p.uid)) await refresh()

        local(() => {
            const index = uids.indexOf(p.uid ?? '')
            const track = tracklist.tracklist[index]
            if (!track) return

            const url = getUrl(track.filepath, track.trackhash, settings.use_legacy_streaming_endpoint)
            queue.setCurrentIndex(index)

            if (audioSource.playingSource.src.endsWith(url)) {
                if (play !== queue.playing) queue.playPause()
                return
            }

            queue.setPlaying(play)
            usePlayer().playCurrent()
            audioSource.playingSource.currentTime = p.position_ms / 1000
        })
        report()
    }

    function becomeController() {
        local(() => {
            const audio = audioSource.playingSource
            audio.pause()
            audio.removeAttribute('src')
            audio.load()
            audioSource.standbySource.pause()
            usePlayer().clearNextAudio()
        })
        clearMediaSession()
        renderPlayhead(playhead.value)
    }

    // connection

    function handle(event: string, data: any) {
        switch (event) {
            case 'queue':
                if (data.version > version.value) refresh()
                break
            case 'playhead':
                renderPlayhead(data)
                break
            case 'devices':
                devices.value = data
                break
            case 'active':
                activeEpoch++
                activeId.value = data.active_device_id
                reachable.value = data.active_reachable
                if (reachable.value) offerPlayHere.value = false
                break
            case 'volume':
                applyVolume(data.value)
                break
            case 'command':
                command(data)
                break
            case 'activate':
                activate(data.playhead, data.play)
                break
            case 'release':
                activeEpoch++
                becomeController()
                break
        }
    }

    async function sync() {
        const playingHere = queue.playing
        const state = await fetchState()
        if (!state) return

        synced = false
        connected.value = true

        // first use, or the server restarted, or this tab started playing before it joined
        const fresh = state.version === 0
        if (fresh || (playingHere && state.active_device_id !== deviceId.value)) {
            activeId.value = state.active_device_id
            reachable.value = state.active_reachable
            devices.value = state.devices
            const replace = {
                type: 'replace',
                source: getSource(tracklist.from),
                trackhashes: tracklist.tracklist.map(t => t.trackhash),
                start_index: queue.currentindex,
                play: playingHere,
            }
            edit(fresh ? [replace, { type: 'repeat', mode: settings.repeat }] : [replace])
            if (fresh) player('volume', { value: settings.volume })
            if (!isActive.value && (!playingHere || state.active_reachable)) becomeController()
            return
        }

        render(state)

        if (!isActive.value) return becomeController()
        if (audioSource.playingSource.src) return report()
        activate(state.playhead, false)
    }

    function connect() {
        const query = new URLSearchParams({ device_id: deviceId.value, name: getDeviceName(), type: 'web' })
        es = new EventSource(`${getBaseUrl()}${paths.api.remote}/stream?${query}`, { withCredentials: true })
        es.onopen = sync
        es.onmessage = e => {
            const message = JSON.parse(e.data)
            handle(message.event, message.data)
        }
        es.onerror = () => {
            if (es?.readyState !== EventSource.CLOSED) return
            es = null
            connected.value = false
            setTimeout(() => releaseLock && !es && connect(), 10000)
        }
    }

    function disconnect() {
        es?.close()
        es = null
        connected.value = false
        releaseLock?.()
        releaseLock = null
        requested = false
        pickerOpen.value = false

        local(() => {
            queue.setPlaying(false)
            audioSource.pausePlayingSource()
        })
    }

    async function onGesture() {
        if (requested || releaseLock || !available.value || !settings.use_remote_control) return
        requested = true

        if (!(await unlockAudio())) {
            requested = false
            return
        }

        navigator.locks.request(
            'rc',
            () =>
                new Promise<void>(resolve => {
                    // another tab may have turned Remote Control off while this one waited
                    if (readLocalStorage('settings')?.use_remote_control === false) return resolve()
                    releaseLock = resolve
                    otherTab.value = false
                    connect()
                })
        )
        checkOtherTab()
    }

    async function checkOtherTab() {
        if (releaseLock || !settings.use_remote_control) return (otherTab.value = false)
        const { held } = await navigator.locks.query()
        otherTab.value = !!held?.some(lock => lock.name === 'rc')
        if (otherTab.value && queue.playing) local(() => queue.playPause())
    }

    /** Detects Remote Control and waits for a user gesture to join it. */
    async function init() {
        if (available.value || !navigator.locks || !window.crypto?.randomUUID) return
        if (!(await fetchState())) return

        available.value = true
        deviceId.value = getDeviceId()

        checkOtherTab()
        setInterval(checkOtherTab, 3000)
        document.addEventListener('click', onGesture, true)
        document.addEventListener('keydown', onGesture, true)
    }

    function setEnabled(on: boolean) {
        if (!available.value) return
        on ? onGesture() : disconnect()
    }

    watch(() => [queue.currentindex, queue.playing], report)
    watch(isActive, (now, was) => was && !now && connected.value && becomeController())
    document.addEventListener('seeked', report, true)
    setInterval(() => queue.playing && report(), 15000)
    setInterval(() => {
        if (connected.value && !isActive.value && playhead.value.playing) queue.setCurrentDuration(position())
    }, 500)

    return {
        available,
        otherTab,
        connected,
        activeId,
        devices,
        playhead,
        shuffled,
        pickerOpen,
        offerPlayHere,
        deviceId,
        isActive,
        activeName,
        routes,
        init,
        setEnabled,
        edit,
        player,
        transfer,
        play,
        setList,
        insert,
        insertAt,
        remove,
        clear,
        setVolume,
    }
})
