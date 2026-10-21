import { ClassicalTopResult, WorkTile } from '@/interfaces'

const CLASSICAL_TYPES = ['composer', 'performer', 'work', 'movement']

/**
 * True when the top search result is a composer, performer, work or movement.
 */
export function isClassicalTop(top: { type?: string } | null | undefined): top is ClassicalTopResult {
    return CLASSICAL_TYPES.includes(top?.type ?? '')
}

/**
 * True when the top results show works beside the top result instead of
 * tracks: a composer on top with works to list.
 */
export function showTopWorks(results: { top_result: { type?: string }; works: WorkTile[] }) {
    return results.top_result?.type === 'composer' && results.works.length > 0
}
