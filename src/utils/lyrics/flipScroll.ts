const FLIP_CLASS = 'flip-animating'
// keep in sync with the .flip-animating transition in LyricsView/main.vue
const DURATION_MS = 750
const STAGGER_MS = 35
const MAX_STAGGERED_LINES = 6

let animatingLines: HTMLElement[] = []
let cleanupTimer = 0
let animToken = 0

/**
 * Snap any in-flight line animation to its final state. The rest state is
 * transform: none, so this is a cheap class/style removal that leaves the
 * list fully native for user scrolling.
 */
export function cancelLineAnimation() {
    animToken++
    window.clearTimeout(cleanupTimer)

    for (const el of animatingLines) {
        el.classList.remove(FLIP_CLASS)
        el.style.removeProperty('transform')
        el.style.removeProperty('--flip-delay')
    }

    animatingLines = []
}

/**
 * FLIP-animate a lyrics line change: jump the scroll position instantly,
 * invert only the lines visible before/after the jump with a translateY,
 * then transition them back to rest with a stagger on the lines below the
 * current one. Transforms exist only while the animation runs, so user
 * scrolling between line changes stays fully native.
 *
 * Returns false when the move is too large to animate, so the caller can
 * fall back to plain scrolling.
 */
export function animateLineChange(container: HTMLElement, lineEl: HTMLElement, currentIndex: number): boolean {
    // clear in-flight transforms before measuring anything
    cancelLineAnimation()

    const containerRect = container.getBoundingClientRect()
    const lineRect = lineEl.getBoundingClientRect()

    const offset = lineRect.top + lineRect.height / 2 - (containerRect.top + containerRect.height / 2)

    // a ripple across more than a screenful looks wrong
    if (Math.abs(offset) > containerRect.height * 1.2) return false

    if (Math.abs(offset) < 1) return true

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        container.scrollTop += offset
        return true
    }

    const lines = Array.from(container.querySelectorAll<HTMLElement>('#np-lyrics-synced .line'))
    const rects = lines.map(el => el.getBoundingClientRect())

    const previousScrollTop = container.scrollTop
    container.scrollTop = previousScrollTop + offset
    // scrollTop clamps at the edges of the list
    const delta = container.scrollTop - previousScrollTop

    if (delta === 0) return true

    lines.forEach((el, index) => {
        const rect = rects[index]
        const visibleBefore = rect.bottom > containerRect.top && rect.top < containerRect.bottom
        const visibleAfter = rect.bottom - delta > containerRect.top && rect.top - delta < containerRect.bottom

        if (!visibleBefore && !visibleAfter) return

        const linesBelowCurrent = Math.max(0, Math.min(index - currentIndex, MAX_STAGGERED_LINES))
        el.style.transform = `translateY(${delta}px)`
        el.style.setProperty('--flip-delay', `${linesBelowCurrent * STAGGER_MS}ms`)
        animatingLines.push(el)
    })

    const token = ++animToken

    // double rAF so the inverted transforms are committed before transitioning
    requestAnimationFrame(() =>
        requestAnimationFrame(() => {
            if (token !== animToken) return

            for (const el of animatingLines) {
                el.classList.add(FLIP_CLASS)
                el.style.transform = ''
            }
        })
    )

    cleanupTimer = window.setTimeout(cancelLineAnimation, DURATION_MS + MAX_STAGGERED_LINES * STAGGER_MS + 100)
    return true
}
