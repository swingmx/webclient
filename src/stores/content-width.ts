import { computed } from "vue";
import { ref } from "@vue/reactivity";
import { useWindowSize } from "@vueuse/core";

const content_width = ref(0);
const content_height = ref(0);

const brk = {
  small: 600,
  album_header_small: 700,
  medium: 950,
};

const isSmall = computed(() => {
  return content_width.value <= brk.small;
});

const albumHeaderSmall = computed(() => {
  return content_width.value <= brk.album_header_small;
});

const isMedium = computed(() => {
  return content_width.value > brk.small && content_width.value <= brk.medium;
});

const heightLarge = computed(() => content_height.value > 1080);

const paddings = 32;
const album_card_with = 10 * 16;

const maxAbumCards = computed(() => {
  const max =
    Math.floor((content_width.value - paddings) / album_card_with) + 1;

  if (max < 1) return 7;

  return max;
});

// WINDOW SIZES
const MOBILE_WIDTH = 900;
const SMALL_MOBILE_WIDTH = 550;
const IPHONE_SE_WIDTH = 386; // very small screens

const { width: win_width } = useWindowSize();

export const isSmallPhone = computed(
  () => win_width.value <= SMALL_MOBILE_WIDTH
);
export const isMobile = computed(() => win_width.value <= MOBILE_WIDTH);
export const isLargerMobile = computed(
  () => win_width.value >= SMALL_MOBILE_WIDTH && win_width.value <= MOBILE_WIDTH
);

export const isIphoneSE = computed(() => win_width.value <= IPHONE_SE_WIDTH);

export {
  win_width,
  content_width,
  content_height,
  heightLarge,
  isSmall,
  isMedium,
  albumHeaderSmall,
  maxAbumCards,
};
