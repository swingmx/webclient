// work card tile colours: gradient top, gradient bottom, label
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
 * Tile colours for a composer, the same on every card, and neutral grey
 * when there is no composer.
 */
export default function composerTint(composerhash: string | null | undefined) {
    let colours = NEUTRAL
    if (composerhash) {
        const sum = [...composerhash].reduce((total, char) => total + char.charCodeAt(0), 0)
        colours = PALETTE[sum % PALETTE.length]
    }
    const [top, bottom, label] = colours
    return {
        '--tile-bg': `linear-gradient(180deg, ${top}, ${bottom})`,
        '--tile-label': label,
    }
}
