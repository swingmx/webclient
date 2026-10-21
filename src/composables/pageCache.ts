import { nextTick, ref, watch } from 'vue'
import { Router } from 'vue-router'

import useAlbumStore from '@/stores/pages/album'
import useArtistStore from '@/stores/pages/artist'
import useArtistDiscography from '@/stores/pages/artistDiscog'
import useCollection from '@/stores/pages/collections'
import useFolderStore from '@/stores/pages/folder'
import { useAlbumList, useArtistList } from '@/stores/pages/itemlist'
import usePlaylistStore from '@/stores/pages/playlist'
import usePlaylistListStore from '@/stores/pages/playlists'
import useWorkStore from '@/stores/pages/work'
import useHomeStore from '@/stores/home'
import useSearchStore from '@/stores/search'

/**
 * A page left behind in history: its cache key, the store loads it was
 * built from, and where it was scrolled.
 */
interface Visit {
    key: string
    path: string
    stores: string[]
    loads: number[]
    scroll: [Element, number, number][]
    title: string
}

// actions that load a store from the server or wipe it, by store id
const STORE_LOADERS: [() => any, string[]][] = [
    [useAlbumStore, ['fetchTracksAndArtists', 'resetAll', 'resetAlbumArtists']],
    [useArtistStore, ['getData', 'resetAll', 'resetAlbums']],
    [useArtistDiscography, ['fetchAlbums', 'resetStore', 'resetAll']],
    [useCollection, ['fetchCollection', 'clearStore']],
    [useFolderStore, ['fetchAll', 'resetAll']],
    [useAlbumList, ['restart', 'clearStore']],
    [useArtistList, ['restart', 'clearStore']],
    [usePlaylistStore, ['fetchAll', 'resetAll']],
    [usePlaylistListStore, ['fetchAll']],
    [useWorkStore, ['fetchWork']],
    [useHomeStore, ['fetchAll']],
]

const loads: Record<string, number> = {}
const visits = new Map<number, Visit>()

// the key the routed page is cached under
export const pageKey = ref('page-0')

let keyCount = 0
let position = 0
let mode: 'push' | 'replace' | 'pop' = 'push'
let pendingMode: 'push' | 'replace' | null = null
let restoring: Visit | null = null

/**
 * True while a back or forward navigation is bringing a cached page back,
 * so route guards skip loading data the page already has.
 */
export function pageRestoring() {
    return restoring !== null
}

/**
 * True while a navigation is moving to another page instance rather than
 * updating the current one in place, so route update hooks leave the
 * current page's data alone.
 */
export function pageSwitching() {
    return mode !== 'replace'
}

function historyPosition(): number {
    return (window.history.state?.position as number) ?? 0
}

function bump(id: string) {
    loads[id] = (loads[id] ?? 0) + 1
}

/**
 * Every scrolled element inside the page area with its offsets.
 */
function scrolledElements(): [Element, number, number][] {
    const root = document.getElementById('acontent') ?? document.getElementById('noui')
    if (!root) return []
    const out: [Element, number, number][] = []
    root.querySelectorAll('*').forEach(el => {
        if (el.scrollTop || el.scrollLeft) out.push([el, el.scrollTop, el.scrollLeft])
    })
    return out
}

function restoreScroll(visit: Visit) {
    nextTick(() =>
        requestAnimationFrame(() => {
            for (const [el, top, left] of visit.scroll) {
                el.scrollTop = top
                el.scrollLeft = left
            }
            document.title = visit.title
        })
    )
}

/**
 * Keep routed pages alive per history entry: back and forward bring a
 * page back with its data and scroll position unless a store it reads has
 * loaded since; any other navigation opens a fresh page at the top.
 */
export function setupPageCache(router: Router) {
    for (const [useStore, actions] of STORE_LOADERS) {
        const store = useStore()
        loads[store.$id] = 0
        store.$onAction(({ name }: { name: string }) => {
            if (actions.includes(name)) bump(store.$id)
        })
    }
    const search = useSearchStore()
    loads[search.$id] = 0
    watch(
        () => search.query,
        () => bump(search.$id)
    )

    for (const method of ['push', 'replace'] as const) {
        const navigate = router[method].bind(router)
        router[method] = (to: any) => {
            pendingMode = method
            return navigate(to)
        }
    }

    position = historyPosition()

    router.beforeEach((to, from) => {
        // back and forward have already moved history to another entry
        mode = historyPosition() !== position ? 'pop' : (pendingMode ?? 'push')
        pendingMode = null
        restoring = null

        if (from.matched.length && from.meta.keepAlive && mode !== 'replace') {
            const stores = (from.meta.stores as string[] | undefined) ?? []
            visits.set(position, {
                key: pageKey.value,
                path: from.fullPath,
                stores,
                loads: stores.map(id => loads[id] ?? 0),
                scroll: scrolledElements(),
                title: document.title,
            })
        }

        if (mode === 'pop' && to.meta.keepAlive) {
            const visit = visits.get(historyPosition())
            const unchanged = visit?.stores.every((id, i) => (loads[id] ?? 0) === visit.loads[i])
            if (visit && visit.path === to.fullPath && unchanged) restoring = visit
        }
    })

    router.afterEach((_to, _from, failure) => {
        if (failure) {
            restoring = null
            return
        }
        const next = historyPosition()
        if (mode === 'push') {
            for (const pos of [...visits.keys()]) if (pos >= next) visits.delete(pos)
        }
        if (mode !== 'replace') {
            pageKey.value = restoring ? restoring.key : `page-${++keyCount}`
        }
        position = next

        if (restoring) {
            const visit = restoring
            restoring = null
            restoreScroll(visit)
        }
    })
}
