const timers = new WeakMap<Element, number>()

/**
 * Marks an element with `data-scrolling` while it scrolls, and for `delay`
 * ms after, so its scrollbar thumb shows.
 */
export default function trackScrolling(delay = 1800) {
    document.addEventListener(
        'scroll',
        e => {
            const el = e.target === document ? document.scrollingElement : e.target
            if (!(el instanceof Element)) return
            el.setAttribute('data-scrolling', '')
            clearTimeout(timers.get(el))
            timers.set(
                el,
                window.setTimeout(() => el.removeAttribute('data-scrolling'), delay)
            )
        },
        { capture: true, passive: true }
    )
}
