import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Track } from '@/interfaces'

const mocks = vi.hoisted(() => {
    const element = () => ({ addEventListener: () => {}, currentTime: 0, paused: true, readyState: 0 })
    return {
        post: vi.fn(async (_url: string, _body: { ops: any[] }) => ({ data: {} })),
        tracklist: { tracklist: [] as any[], shuffled: false, baseOrder: [] as any[], from: {} },
        queue: { currentindex: 0, playing: false, playPause: vi.fn() },
        audioSource: { playingSource: element(), standbySource: element() },
    }
})

vi.mock('axios', () => ({ default: { post: mocks.post, get: vi.fn(async () => ({ status: 204 })) } }))
vi.mock('@/config', () => ({ getBaseUrl: () => '', paths: { api: { remote: '/remote' } } }))
vi.mock('./colors', () => ({ default: () => ({}) }))
vi.mock('./lyrics', () => ({ default: () => ({}) }))
vi.mock('./player', () => ({ audioSource: mocks.audioSource, getUrl: () => '', usePlayer: () => ({}) }))
vi.mock('./queue', () => ({ default: () => mocks.queue }))
vi.mock('./queue/tracklist', () => ({ default: () => mocks.tracklist }))
vi.mock('./settings', () => ({ default: () => ({ repeat: 'none', remote_control_enabled: false }) }))
vi.mock('./tracker', () => ({ getSource: () => 'al:1', fromSource: () => ({}) }))

import useRemote, { busyElsewhere } from './remote'

const track = (hash: string) => ({ trackhash: hash }) as unknown as Track
const queueOps = () => mocks.post.mock.calls.filter(c => c[0] === '/remote/queue').flatMap(c => c[1].ops)

describe('a new queue shuffled before it reaches the server', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.clearAllTimers()
        vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {} })
        vi.stubGlobal('document', { addEventListener: () => {} })
        vi.stubGlobal('HTMLMediaElement', { HAVE_METADATA: 1, HAVE_FUTURE_DATA: 3 })
        setActivePinia(createPinia())
        mocks.post.mockClear()
    })

    it('is sent as one replace in the shuffled order, with no separate reorder', async () => {
        const remote = useRemote()
        const tracks = ['a', 'b', 'c'].map(track)

        mocks.tracklist.tracklist = tracks
        remote.newList(tracks, {} as any)

        mocks.tracklist.tracklist = [tracks[2], tracks[0], tracks[1]]
        mocks.tracklist.shuffled = true
        remote.reordered(tracks)

        await vi.runAllTicks()
        await Promise.resolve()

        const ops = queueOps()
        expect(ops.map(op => op.type)).toEqual(['replace', 'repeat'])
        expect(ops[0].trackhashes).toEqual(['c', 'a', 'b'])
        expect(ops[0].shuffled).toBe(true)
        expect(ops[0].uids).toHaveLength(3)
    })
})

describe('audio that is not paused but has stopped advancing', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.clearAllTimers()
        vi.stubGlobal('localStorage', { getItem: () => null, setItem: () => {} })
        vi.stubGlobal('document', { addEventListener: () => {} })
        vi.stubGlobal('HTMLMediaElement', { HAVE_METADATA: 1, HAVE_FUTURE_DATA: 3 })
        setActivePinia(createPinia())
        mocks.queue.playPause.mockClear()
        mocks.queue.playing = true
        Object.assign(mocks.audioSource.playingSource, { paused: false, readyState: 4, currentTime: 42 })
        useRemote()
    })

    it('is paused once the clock has stood still between two checks', () => {
        vi.advanceTimersByTime(5000)
        expect(mocks.queue.playPause).not.toHaveBeenCalled()

        vi.advanceTimersByTime(5000)
        expect(mocks.queue.playPause).toHaveBeenCalledTimes(1)
    })

    it('is left alone while the clock moves', () => {
        vi.advanceTimersByTime(5000)
        mocks.audioSource.playingSource.currentTime = 47
        vi.advanceTimersByTime(5000)

        expect(mocks.queue.playPause).not.toHaveBeenCalled()
    })
})

describe('busyElsewhere', () => {
    const state = (active: string | null, reachable: boolean, playing: boolean, loading = false) => ({
        active_device_id: active,
        active_reachable: reachable,
        playhead: { playing, loading },
    })

    it('is true while another reachable device plays or loads', () => {
        expect(busyElsewhere(state('phone', true, true), 'web')).toBe(true)
        expect(busyElsewhere(state('phone', true, false, true), 'web')).toBe(true)
    })

    it('is false when this device is the active one, or the other is paused or gone', () => {
        expect(busyElsewhere(state('web', true, true), 'web')).toBe(false)
        expect(busyElsewhere(state('phone', true, false), 'web')).toBe(false)
        expect(busyElsewhere(state('phone', false, true), 'web')).toBe(false)
        expect(busyElsewhere(state(null, false, false), 'web')).toBe(false)
    })
})
