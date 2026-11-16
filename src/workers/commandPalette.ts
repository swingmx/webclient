/// <reference lib="webworker" />
import Fuse from 'fuse.js'

import type { SearchIndex } from '@/stores/commandPalette'

export type WorkerRequest =
    | { type: 'load'; url: string }
    | { type: 'search'; id: number; q: string }
    | { type: 'match'; id: number; q: string }

export type WorkerResponse =
    | { type: 'index'; index: SearchIndex }
    | { type: 'error'; status: number }
    | { type: 'results'; id: number; hits: [kind: 0 | 1, position: number][] }
    | { type: 'match'; id: number; artist: number | null }

let fuse: Fuse<{ kind: 0 | 1; i: number; name: string }> | null = null

const reply = (message: WorkerResponse) => postMessage(message)

onmessage = async ({ data }: MessageEvent<WorkerRequest>) => {
    if (data.type === 'load') {
        const res = await fetch(data.url, { credentials: 'include' }).catch(() => null)
        if (!res?.ok) return reply({ type: 'error', status: res?.status ?? 0 })

        const index: SearchIndex = await res.json()
        fuse = new Fuse(
            [
                ...index.artists.flatMap(([, name, displayName], i) => [
                    { kind: 0 as const, i, name },
                    ...(displayName ? [{ kind: 0 as const, i, name: displayName }] : []),
                ]),
                ...index.albums.map(([, title], i) => ({ kind: 1 as const, i, name: title })),
            ],
            { keys: ['name'], threshold: 0.3, ignoreLocation: true, includeScore: true }
        )
        return reply({ type: 'index', index })
    }

    if (data.type === 'match') return reply({ type: 'match', id: data.id, artist: fuse ? bestArtist(fuse, data.q) : null })

    if (!fuse) return reply({ type: 'results', id: data.id, hits: [] })

    const seen = new Set<string>()
    const hits: [0 | 1, number][] = []
    for (const { item } of fuse.search(data.q, { limit: 30 })) {
        const key = `${item.kind}:${item.i}`
        if (seen.has(key)) continue
        seen.add(key)
        hits.push([item.kind, item.i])
        if (hits.length === 20) break
    }
    reply({ type: 'results', id: data.id, hits })
}

const norm = (text: string) =>
    text
        .normalize('NFD')
        .replace(/\p{M}/gu, '')
        .toLowerCase()
        .replace(/[^\p{L}\p{N}]/gu, '')

/**
 * The artist a typed query clearly names: the top hit, a close match, well
 * ahead of the next one (or named exactly), so "london" doesn't open a page
 * while "yoyo ma" opens Yo-Yo Ma.
 */
function bestArtist(fuse: Fuse<{ kind: 0 | 1; i: number; name: string }>, q: string) {
    const [top, ...rest] = fuse.search(q, { limit: 5 })
    if (!top || top.item.kind !== 0 || top.score! > 0.26) return null
    if (norm(q) === norm(top.item.name)) return top.item.i
    const next = rest.find(r => r.item.kind !== 0 || r.item.i !== top.item.i)
    if (next && next.score! - top.score! < 0.1) return null
    return top.item.i
}
