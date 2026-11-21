import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { Track } from '@/interfaces'

const mocks = vi.hoisted(() => ({
    queue: { currentindex: 0, nextindex: 1, setCurrentIndex: vi.fn() },
    player: { clearNextAudio: vi.fn() },
    remote: { routing: false, routes: () => mocks.remote.routing, newList: vi.fn(), reordered: vi.fn() },
}))

vi.mock('@/stores/queue', () => ({ default: () => mocks.queue }))
vi.mock('@/stores/player', () => ({ usePlayer: () => mocks.player }))
vi.mock('@/stores/remote', () => ({ default: () => mocks.remote }))
vi.mock('@/stores/interface', () => ({ default: () => ({ focusCurrentInSidebar: vi.fn() }) }))
vi.mock('@/stores/settings', () => ({ default: () => ({}) }))
vi.mock('@/stores/notification', () => ({ NotifType: {}, useToast: () => ({ showNotification: vi.fn() }) }))
vi.mock('@/context_menus/track', () => ({ default: {} }))
vi.mock('@/requests/classical', () => ({ getQueueWorks: vi.fn(async () => []) }))
vi.mock('@/i18n', () => ({ useT: () => ({ t: (key: string) => key }) }))

import useTracklist from './tracklist'

const track = (hash: string, artist = hash) => ({ trackhash: hash, artists: [{ name: artist }] }) as unknown as Track
const hashes = (tracks: Track[]) => tracks.map(t => t.trackhash)

describe('toggleShuffle', () => {
    let store: ReturnType<typeof useTracklist>

    beforeEach(() => {
        setActivePinia(createPinia())
        vi.clearAllMocks()
        mocks.remote.routing = false
        mocks.queue.setCurrentIndex.mockImplementation((i: number) => (mocks.queue.currentindex = i))
        store = useTracklist()
        store.tracklist = ['a', 'b', 'c', 'd', 'e'].map(h => track(h))
    })

    it('on: moves the current track to the top and shuffles every other track behind it', () => {
        store.toggleShuffle(3)

        expect(store.shuffled).toBe(true)
        expect(store.tracklist[0].trackhash).toBe('d')
        expect(hashes(store.tracklist).sort()).toEqual(['a', 'b', 'c', 'd', 'e'])
        expect(hashes(store.baseOrder)).toEqual(['a', 'b', 'c', 'd', 'e'])
        expect(mocks.queue.currentindex).toBe(0)
    })

    it('on with nothing playing: shuffles the whole list and leaves the index alone', () => {
        store.toggleShuffle(-1)

        expect(hashes(store.tracklist).sort()).toEqual(['a', 'b', 'c', 'd', 'e'])
        expect(mocks.queue.setCurrentIndex).not.toHaveBeenCalled()
    })

    it('off: restores the order from before the shuffle and follows the current track', () => {
        store.toggleShuffle(3)
        const playing = store.tracklist.findIndex(t => t.trackhash === 'b')

        store.toggleShuffle(playing)

        expect(store.shuffled).toBe(false)
        expect(hashes(store.tracklist)).toEqual(['a', 'b', 'c', 'd', 'e'])
        expect(mocks.queue.currentindex).toBe(1)
        expect(store.baseOrder).toEqual([])
    })

    it('off: tracks added since go last and removed ones stay out', () => {
        store.toggleShuffle(0)
        store.tracklist.splice(
            store.tracklist.findIndex(t => t.trackhash === 'c'),
            1
        )
        store.tracklist.splice(1, 0, track('x'))

        store.toggleShuffle(0)

        expect(hashes(store.tracklist)).toEqual(['a', 'b', 'd', 'e', 'x'])
        expect(mocks.queue.currentindex).toBe(0)
    })

    it('off: still restores when the saved order holds copies, as after a reload', () => {
        store.toggleShuffle(2)
        store.baseOrder = JSON.parse(JSON.stringify(store.baseOrder))

        store.toggleShuffle(0)

        expect(hashes(store.tracklist)).toEqual(['a', 'b', 'c', 'd', 'e'])
        expect(mocks.queue.currentindex).toBe(2)
    })

    it('drops the preloaded next track and reports the old order to remote sync', () => {
        mocks.remote.routing = true
        const before = store.tracklist.slice()

        store.toggleShuffle(1)

        expect(mocks.player.clearNextAudio).toHaveBeenCalled()
        expect(mocks.remote.reordered).toHaveBeenCalledWith(before)
    })
})
