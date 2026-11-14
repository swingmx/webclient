/// <reference lib="webworker" />
import Fuse from 'fuse.js'

import type { SearchIndex } from '@/stores/commandPalette'

export type WorkerRequest = { type: 'load'; url: string } | { type: 'search'; id: number; q: string }

export type WorkerResponse =
    | { type: 'index'; index: SearchIndex }
    | { type: 'error'; status: number }
    | { type: 'results'; id: number; hits: [kind: 0 | 1, position: number][] }

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
            { keys: ['name'], threshold: 0.3, ignoreLocation: true }
        )
        return reply({ type: 'index', index })
    }

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
