// work card tile colours, one per server tint: gradient top, gradient bottom, label
const PALETTE = [
    ['#232D25', '#141815', '#9EBEA4'],
    ['#2F2730', '#19161A', '#C3AAC8'],
    ['#232B34', '#14171C', '#9FB6D4'],
    ['#332723', '#1B1614', '#D2AA9F'],
    ['#2F291F', '#191712', '#C3B290'],
    ['#1E2D2E', '#121919', '#8FBEC1'],
]
const NEUTRAL = ['#2A2A2C', '#161617', '#B4B4B8']

/**
 * Tile colours for the palette entry the server picked for a composer, and
 * neutral grey when there is no composer.
 */
export default function composerTint(tint: number | null | undefined) {
    const [top, bottom, label] = PALETTE[tint ?? -1] ?? NEUTRAL
    return {
        '--tile-bg': `linear-gradient(180deg, ${top}, ${bottom})`,
        '--tile-label': label,
    }
}
