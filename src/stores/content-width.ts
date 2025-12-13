import { useWindowSize } from '@vueuse/core'
import { computed, ref } from 'vue'

const content_width = ref(0)
const content_height = ref(0)

// SECTION: HEIGHT
const heightLarge = computed(() => content_height.value > 1080)

// One track height is 64px. We want to load 2.75 times
// the amount of tracks that can fit in the content height
// Comes in handy on paginated pages, because the component
// which is at the bottom of the page will reliably be remounted
// causing more tracks to be loaded again
// 2.75x is ~50 tracks on a 2560x1440 screen.
const track_limit = computed(() => Math.round((content_height.value / 64) * 2.75))

const resizer_width = ref(0)

const brk = {
    small: 660,
    album_header_small: 700,
    medium: 950,
}

const isSmall = computed(() => {
    return content_width.value <= brk.small
})

const isHeaderSmall = computed(() => {
    return content_width.value <= brk.album_header_small
})

const isMedium = computed(() => {
    return content_width.value > brk.small && content_width.value <= brk.medium
})

const paddings = 0
const album_card_with = ref(161.6)

const elemclass = 'hlistitem'

const maxAbumCards = computed(() => {
    const max = Math.round((resizer_width.value - paddings) / album_card_with.value)

    if (max == 0) return 7

    return max
})

// WINDOW SIZES
const ALL_MOBILE_WIDTH = 900
const LARGE_MOBILE_WIDTH = 660
const SMALL_MOBILE_WIDTH = 460

const { width: win_width } = useWindowSize()

export const isSmallPhone = computed(() => win_width.value <= LARGE_MOBILE_WIDTH)
export const isMobile = computed(() => win_width.value <= ALL_MOBILE_WIDTH)
export const isLargerMobile = computed(
    () => win_width.value >= LARGE_MOBILE_WIDTH && win_width.value <= ALL_MOBILE_WIDTH
)

export const isSmallestPhone = computed(() => win_width.value <= SMALL_MOBILE_WIDTH)

const updateCardWidth = () => {
    // if (album_card_with.value !== 161.6) return;
    const elems = document.getElementsByClassName(elemclass)

    if (elems.length) {
        album_card_with.value = elems[0].clientWidth
    }
}

export {
    album_card_with,
    content_height,
    content_width,
    heightLarge,
    isHeaderSmall,
    isMedium,
    isSmall,
    maxAbumCards,
    resizer_width,
    updateCardWidth,
    win_width,
    track_limit,
}
