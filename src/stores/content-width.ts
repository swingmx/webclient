import { ref } from "vue";
import { useWindowSize } from "@vueuse/core";
import { computed } from "vue";

const content_width = ref(0);
const content_height = ref(0);

const brk = {
  small: 550,
  album_header_small: 700,
  medium: 950,
};

const isSmall = computed(() => {
  return content_width.value <= brk.small;
});

const isHeaderSmall = computed(() => {
  return content_width.value <= brk.album_header_small;
});

const isMedium = computed(() => {
  return content_width.value > brk.small && content_width.value <= brk.medium;
});

const heightLarge = computed(() => content_height.value > 1080);

const paddings = 64;
const album_card_with = ref(161.6);

const elemclass = "hlistitem";

const maxAbumCards = computed(() => {
  // const elems = document.getElementsByClassName(elemclass);
  // let width = album_card_with.value;

  // if (elems.length > 0) {
  //   width = elems[0].clientWidth;
  // }

  const max = Math.round(
    (content_width.value - paddings) / album_card_with.value
  );

  if (max == 0) return 7;
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

const updateCardWidth = () => {
  // if (album_card_with.value !== 161.6) return;
  const elems = document.getElementsByClassName(elemclass);

  if (elems.length) {
    album_card_with.value = elems[0].clientWidth;
  }

  console.log(album_card_with.value);
};

export {
  album_card_with,
  content_height,
  content_width,
  heightLarge,
  isHeaderSmall,
  isMedium,
  isSmall,
  maxAbumCards,
  win_width,
  updateCardWidth,
};
