import axios from 'axios'
import { defineStore } from 'pinia'
import { computed, ref, watch } from 'vue'

import { getBaseUrl, paths } from '@/config'
import { Track } from '@/interfaces'
import useColors from './colors'
import useLyrics from './lyrics'
import { audioSource, getUrl, usePlayer } from './player'
import useQueue from './queue'
import useTracklist, { From } from './queue/tracklist'
import useSettings from './settings'
import { SourceInfo, fromSource, getSource } from './tracker'

interface Playhead {
    uid: string | null
    position_ms: number
    playing: boolean
    loading?: boolean
    at: number
    played_at?: number
}

interface Device {
    id: string
    name: string
    type: string
    selectable: boolean
}

interface State {
    version: number
    active_device_id: string | null
    active_host_id: string | null
    active_reachable: boolean
    playhead: Playhead
    queue: { source: string; source_info: SourceInfo; items: { uid: string; track: Track }[]; order: string[] | null; repeat: 'none' | 'all' | 'one' }
    volume: number
    devices: Device[]
    played_at?: number
    idle_seconds?: number
    now: number
}

let localDepth = 0

export function local<T>(fn: () => T): T {
    localDepth++
    try {
        return fn()
    } finally {
        localDepth--
    }
}

function getDeviceId() {
    let id = sessionStorage.getItem('rc_device_id')
    if (!id) {
        // crypto.randomUUID needs a secure context
        id = Math.random().toString(36).slice(2) + Date.now().toString(36)
        sessionStorage.setItem('rc_device_id', id)
    }
    return id
}

function getHostId() {
    let id = localStorage.getItem('rc_host_id')
    if (!id) {
        id = Math.random().toString(36).slice(2) + Date.now().toString(36)
        localStorage.setItem('rc_host_id', id)
    }
    return id
}

export function getDeviceName() {
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
    return `Web Player (${browser} on ${os})`
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
    const selectable = ref(false)
    const connected = ref(false)
    const version = ref(0)
    const activeId = ref<string | null>(null)
    const reachable = ref(false)
    const devices = ref<Device[]>([])
    const playhead = ref<Playhead>({ uid: null, position_ms: 0, playing: false, at: 0 })
    const shuffled = ref(false)
    const pickerOpen = ref(false)
    const offerPlayHere = ref(false)
    const handingOff = ref(false)
    const deviceId = ref('')
    const hostId = ref('')
    const activeHostId = ref<string | null>(null)

    const uids: string[] = []
    let synced = false
    let skew = 0
    let pending: { source: string; trackhashes: string[] } | null = null
    let es: EventSource | null = null
    let unlocking = false
    let chain: Promise<unknown> = Promise.resolve()
    let activeEpoch = 0
    let started = false
    let retry = 0
    let refused = ''
    let initing: Promise<void> | null = null
    let heard = 0
    let idleSeconds = 0
    // Server queue (hashes, shuffle, repeat) last applied here, so it isn't pushed straight back.
    let serverKey = ''
    let dirty = false
    let inflight = 0
    let pushTimer: ReturnType<typeof setTimeout> | undefined

    const isActive = computed(() => connected.value && reachable.value && activeId.value === deviceId.value)
    const activeName = computed(() => {
        if (!reachable.value || activeId.value === deviceId.value) return ''
        return devices.value.find(d => d.id === activeHostId.value)?.name || ''
    })

    function routes() {
        return connected.value && localDepth === 0
    }

    // Another reachable device is active and hasn't sat idle: player and queue actions go to it.
    function elsewhere() {
        return connected.value && reachable.value && !isActive.value && !idle()
    }

    // Otherwise this tab acts at once and the server takes a copy.
    function controls() {
        return localDepth === 0 && elsewhere()
    }

    function idle() {
        const p = playhead.value
        return (
            idleSeconds > 0 &&
            activeHostId.value !== hostId.value &&
            !p.playing &&
            !p.loading &&
            Date.now() / 1000 + skew - (p.played_at ?? 0) > idleSeconds
        )
    }

    // Nothing reachable is playing: pick up the paused session here, at its position.
    function resume() {
        if (!uids.includes(playhead.value.uid ?? '')) return false
        activate(playhead.value, true)
        return true
    }

    function hasNewList() {
        return pending !== null
    }


    async function send(path: string, body: object, retry = true): Promise<any> {
        const req = chain.then(() =>
            axios.post(paths.api.remote + path, { device_id: deviceId.value, ...body }, { withCredentials: true })
        )
        chain = req.catch(() => {})

        try {
            return (await req).data
        } catch (e: any) {
            const code = e.response?.data?.error
            if (code === 'not_selectable' && retry && selectable.value && path !== '/queue') return send(path, body, false)
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
            refused = ''
            return res.data
        } catch (e: any) {
            refused = e?.response ? e.response.data?.error ?? 'unavailable' : ''
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
        if (id === hostId.value && selectable.value) send('/devices', { selectable: true })
        return send('/transfer', { device_id: id, play })
    }


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


    function render(state: State, withActive = true) {
        if (withActive) {
            activeId.value = state.active_device_id
            activeHostId.value = state.active_host_id
            reachable.value = state.active_reachable
            devices.value = state.devices
        }
        applyVolume(state.volume)
        idleSeconds = state.idle_seconds ?? 0

        if (state.version > 0 && state.version >= version.value) renderQueue(state)
        if (state.playhead.at >= playhead.value.at) renderPlayhead(state.playhead)
    }

    function renderQueue(state: State) {
        const tracks = new Map(state.queue.items.map(i => [i.uid, i.track]))
        const order = state.queue.order ?? state.queue.items.map(i => i.uid)

        if (!elsewhere()) {
            // This tab's queue is the truth; a pending push of its own wins over what the server has.
            if (dirty || inflight) return
            version.value = state.version
            shuffled.value = state.queue.order !== null
            const hashes = order.map(uid => tracks.get(uid)!.trackhash)
            serverKey = [hashes.join(), shuffled.value, state.queue.repeat].join('|')
            settings.repeat = state.queue.repeat
            if (hashes.join() !== tracklist.tracklist.map(t => t.trackhash).join()) {
                const current = queue.currenttrack?.trackhash
                local(() => tracklist.setNewList(order.map(uid => tracks.get(uid)!)))
                const index = current ? hashes.indexOf(current) : -1
                index >= 0 ? queue.setCurrentIndex(index) : placeIndex(undefined, order)
            }
            tracklist.shuffled = shuffled.value
            synced = true
            pending = null
            uids.splice(0, uids.length, ...order)
            renderSource(state, tracks, order)
            return report()
        }

        version.value = state.version
        shuffled.value = state.queue.order !== null
        settings.repeat = state.queue.repeat

        if (!synced || order.join() !== uids.join()) {
            synced = true
            pending = null
            uids.splice(0, uids.length, ...order)
            local(() => tracklist.setNewList(order.map(uid => tracks.get(uid)!)))
        }

        renderSource(state, tracks, order)
        placeIndex()
    }

    function renderSource(state: State, tracks: Map<string, Track>, order: string[]) {
        if (getSource(tracklist.from) === state.queue.source) return
        tracklist.from = fromSource(state.queue.source, state.queue.source_info, tracks.get(order[0])?.albumhash)
    }

    function placeIndex(uid?: string, list = uids) {
        const index = list.indexOf(uid ?? playhead.value.uid ?? '')
        if (index >= 0) queue.setCurrentIndex(index)
    }

    function renderPlayhead(p: Playhead) {
        playhead.value = p
        if (isActive.value || !audioSource.playingSource.paused) return

        placeIndex()
        queue.setPlaying(p.playing)
        queue.setDurationFromFile(queue.currenttrack.duration || 0)
        queue.setCurrentDuration(position())

        const lyrics = useLyrics()
        if (queue.currenttrack?.trackhash && lyrics.currentTrack !== queue.currenttrack.trackhash) {
            lyrics.getLyrics()
            useColors().setTheme1Color(paths.images.thumb.small + queue.currenttrack.image)
        }
    }

    function position() {
        const p = playhead.value
        const at = p.position_ms / 1000 + (p.playing ? Math.max(Date.now() / 1000 + skew - p.at, 0) : 0)
        return Math.min(at, queue.currenttrack.duration || at)
    }

    function applyVolume(value: number) {
        settings.volume = value
        usePlayer().setVolume(settings.volume_gain)
    }


    // This tab changed its own queue: it already plays it, so the server just takes a copy.
    function changed(key: string) {
        if (!connected.value || elsewhere() || key === serverKey) return
        dirty = true
        uids.length = 0
        clearTimeout(pushTimer)
        pushTimer = setTimeout(() => push(), 300)
    }

    function push(played_at?: number) {
        dirty = false
        inflight++
        const audio = audioSource.playingSource
        return edit([
            {
                type: 'replace',
                source: getSource(tracklist.from),
                trackhashes: tracklist.tracklist.map(t => t.trackhash),
                start_index: queue.currentindex,
                position_ms: Math.round((audio.currentTime || 0) * 1000),
                play: queue.playing && !audio.paused,
                take: true,
                shuffled: tracklist.shuffled,
                ...(played_at ? { played_at } : {}),
            },
            { type: 'repeat', mode: settings.repeat },
        ]).finally(() => --inflight === 0 && !dirty && refresh())
    }

    function markPlayed() {
        if (!elsewhere()) localStorage.setItem('rc_played_at', String(Date.now() / 1000))
    }

    let reportTimer: ReturnType<typeof setTimeout> | undefined
    function report() {
        clearTimeout(reportTimer)
        reportTimer = setTimeout(() => {
            const audio = audioSource.playingSource
            const uid = uids[queue.currentindex]
            // A tab playing while no other device is reachable reports too; the server makes it active.
            const claims = connected.value && !audio.paused && !controls()
            if (!(isActive.value || claims) || audio.readyState < HTMLMediaElement.HAVE_METADATA) return
            if (uid === undefined && tracklist.tracklist.length) return
            send('/playhead', {
                uid: uid ?? null,
                position_ms: Math.round((audio.currentTime || 0) * 1000),
                playing: queue.playing && !audio.paused && audio.readyState >= HTMLMediaElement.HAVE_FUTURE_DATA,
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
        activeHostId.value = hostId.value
        reachable.value = true
        if (p.uid && !uids.includes(p.uid)) await refresh()

        local(() => {
            const index = uids.indexOf(p.uid ?? '')
            const track = tracklist.tracklist[index]
            if (!track) return

            const url = getUrl(track.filepath, track.trackhash, settings.use_legacy_streaming_endpoint)
            queue.setCurrentIndex(index)

            if (audioSource.playingSource.src.endsWith(url)) {
                const audio = audioSource.playingSource
                if (Math.abs(audio.currentTime - p.position_ms / 1000) > 1) audio.currentTime = p.position_ms / 1000
                queue.setPlaying(play)
                play ? audioSource.playPlayingSource() : audioSource.pausePlayingSource()
                return
            }

            handingOff.value = true
            queue.setPlaying(play)
            usePlayer().playCurrent()
            audioSource.playingSource.currentTime = p.position_ms / 1000
            queue.setCurrentDuration(p.position_ms / 1000)
        })
        report()
    }

    function becomeController() {
        local(() => {
            const audio = audioSource.playingSource
            audio.pause()
            audioSource.standbySource.pause()
            usePlayer().clearNextAudio()
        })
        clearMediaSession()
        renderPlayhead(playhead.value)
    }


    function handle(event: string, data: any) {
        switch (event) {
            case 'heartbeat':
                if (data?.ack === false) break
                axios.post(paths.api.remote + '/alive', { device_id: deviceId.value }, { withCredentials: true }).catch(() => {})
                break
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
                activeHostId.value = data.active_host_id
                reachable.value = data.active_reachable
                if (reachable.value) offerPlayHere.value = false
                else if (playhead.value.playing) {
                    renderPlayhead({ ...playhead.value, playing: false })
                }
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

    // Playing here, or nothing on the server: this device's queue wins. Otherwise take the server's.
    async function sync() {
        // A controller's queue.playing mirrors the active device; only count audio playing here.
        const playingHere = queue.playing && (!connected.value || isActive.value)
        const state = await fetchState()
        if (!state) return

        synced = false
        connected.value = true
        devices.value = state.devices
        idleSeconds = state.idle_seconds ?? 0

        const playedAt = Number(localStorage.getItem('rc_played_at')) || 0
        // Never over a device that is playing right now, and only against a server that reports played_at.
        const newer = playedAt > 0 && !state.playhead.playing && state.played_at !== undefined && playedAt + skew > state.played_at
        if (tracklist.tracklist.length && (playingHere || !state.queue.items.length || newer)) {
            if (selectable.value) {
                activeId.value = deviceId.value
                activeHostId.value = hostId.value
                reachable.value = true
            }
            player('volume', { value: settings.volume })
            uids.length = 0
            push(playedAt ? playedAt + skew : undefined)
            return
        }

        render(state)

        if (!isActive.value) return becomeController()
        if (audioSource.playingSource.src) return report()
        activate(state.playhead, false)
    }

    function connect() {
        const query = new URLSearchParams({
            device_id: deviceId.value,
            name: getDeviceName(),
            type: 'web',
            selectable: String(selectable.value),
            host_id: hostId.value,
        })
        es = new EventSource(`${getBaseUrl()}${paths.api.remote}/stream?${query}`, { withCredentials: true })
        heard = Date.now()
        es.onopen = () => {
            heard = Date.now()
            if (selectable.value) send('/devices', { selectable: true })
            sync()
        }
        es.onmessage = e => {
            heard = Date.now()
            const message = JSON.parse(e.data)
            handle(message.event, message.data)
        }
        es.onerror = () => {
            if (es?.readyState === EventSource.CLOSED) lost()
        }
    }

    async function lost() {
        es?.close()
        es = null
        dropOut()
        clearTimeout(retry)
        if (!(await fetchState()) && refused === 'disabled') return init()
        retry = window.setTimeout(init, 10000)
    }

    function leave() {
        if (!es) return
        es.close()
        es = null
        const body = new Blob([JSON.stringify({ device_id: deviceId.value })], { type: 'application/json' })
        navigator.sendBeacon(`${getBaseUrl()}${paths.api.remote}/leave`, body)
    }

    // The device playing keeps playing on its own; a controller has nothing to play.
    function dropOut() {
        if (!connected.value) return
        const playingHere = !audioSource.playingSource.paused
        connected.value = false
        pickerOpen.value = false
        synced = false
        pending = null
        dirty = false
        clearTimeout(pushTimer)
        uids.length = 0
        version.value = 0
        if (playingHere) return

        local(() => {
            queue.setPlaying(false)
            audioSource.pausePlayingSource()
        })
    }

    function disconnect() {
        leave()
        dropOut()
    }

    function onGesture() {
        if (selectable.value || unlocking || !usable() || !settings.use_remote_control) return
        unlocking = true

        const unlocked = unlockAudio()
        chain = chain
            .then(() => unlocked)
            .then(ok => {
                unlocking = false
                if (!ok) return
                selectable.value = true
                if (es) return axios.post(paths.api.remote + '/devices', { device_id: deviceId.value, selectable: true }, { withCredentials: true })
            })
            .catch(() => {})
    }

    async function claimDeviceId() {
        const id = getDeviceId()
        const channel = new BroadcastChannel('rc_device_id')

        const taken = await new Promise<boolean>(resolve => {
            channel.onmessage = e => {
                if (e.data.query && e.data.query === deviceId.value) channel.postMessage({ taken: e.data.query })
                if (e.data.taken === id && !deviceId.value) resolve(true)
            }
            channel.postMessage({ query: id })
            setTimeout(() => resolve(false), 100)
        })

        if (!taken) return id
        sessionStorage.removeItem('rc_device_id')
        return getDeviceId()
    }

    function usable() {
        return available.value && settings.remote_control_enabled
    }

    function init() {
        return (initing ??= start().finally(() => (initing = null)))
    }

    async function start() {
        clearTimeout(retry)
        if (es) return
        const state = await fetchState()
        if (!state && refused !== 'disabled') {
            available.value = false
            if (!refused) retry = window.setTimeout(init, 10000)
            return
        }

        available.value = true
        settings.remote_control_enabled = !!state
        if (!state || !settings.use_remote_control) return

        if (!started) {
            started = true
            deviceId.value = await claimDeviceId()
            hostId.value = getHostId()
            document.addEventListener('click', onGesture, true)
            document.addEventListener('keydown', onGesture, true)
            window.addEventListener('pagehide', leave)
        }

        connect()
    }

    function setEnabled(on: boolean) {
        if (!usable()) return
        if (!on) return disconnect()
        init()
        onGesture()
    }

    watch(
        () => settings.remote_control_enabled,
        on => {
            if (on) return init()
            if (es) {
                es.close()
                es = null
            }
            dropOut()
        }
    )

    watch(() => [queue.currentindex, queue.playing], report)
    watch(isActive, (now, was) => was && !now && connected.value && becomeController())
    document.addEventListener('seeked', report, true)
    // Heartbeats arrive every 5s; a stream that stays quiet longer is dead even if the browser hasn't noticed.
    setInterval(() => es && Date.now() - heard > 15000 && lost(), 5000)
    setInterval(() => {
        if (!queue.playing) return
        report()
        if (!audioSource.playingSource.paused) markPlayed()
    }, 5000)
    watch(
        () => [tracklist.tracklist.map(t => t.trackhash).join(), tracklist.shuffled, settings.repeat].join('|'),
        changed
    )
    for (const el of [audioSource.playingSource, audioSource.standbySource]) {
        el.addEventListener('playing', () => el === audioSource.playingSource && report())
        el.addEventListener('pause', () => el === audioSource.playingSource && markPlayed())
        el.addEventListener('waiting', () => el === audioSource.playingSource && report())
        el.addEventListener('loadedmetadata', () => el === audioSource.playingSource && report())
        for (const event of ['canplay', 'playing', 'error']) {
            el.addEventListener(event, () => el === audioSource.playingSource && (handingOff.value = false))
        }
    }
    setInterval(() => {
        if (!elsewhere() || !playhead.value.playing) return
        queue.setCurrentDuration(position())
        usePlayer().updateLyricsPosition()
    }, 250)

    return {
        available,
        selectable,
        connected,
        activeId,
        devices,
        playhead,
        shuffled,
        pickerOpen,
        offerPlayHere,
        reachable,
        handingOff,
        deviceId,
        hostId,
        activeHostId,
        isActive,
        activeName,
        routes,
        controls,
        elsewhere,
        hasNewList,
        resume,
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
