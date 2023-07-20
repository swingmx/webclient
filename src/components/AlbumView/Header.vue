<template>
  <div
    class="album-header-ambient rounded"
    style="height: 100%; width: 100%"
    :style="{
      boxShadow: album.colors[0]
        ? `0 .5rem 2rem ${album.colors[0]}`
        : '0 .5rem 2rem black',
    }"
  ></div>
  <div
    class="a-header rounded"
    ref="albumheaderthing"
    :style="{
      background: backgroundColor,
    }"
  >
    <div
      class="big-img no-scroll"
      :class="`${albumHeaderSmall ? 'imgSmall' : ''} shadow-lg rounded-sm`"
    >
      <img :src="imguri.thumb.large + album.image" class="rounded-sm" />
    </div>
    <div class="info" :style="{ color: textColor }">
      <div class="album-info">
        <div class="top">
          <div v-auto-animate class="h" v-if="!isSmallPhone">
            <span v-if="album.is_soundtrack">Soundtrack</span>
            <span v-else-if="album.is_live">Concert</span>
            <span v-else-if="album.is_compilation">Compilation</span>
            <span v-else-if="album.is_EP">EP</span>
            <span v-else-if="album.is_single">Single</span>
            <span v-else>Album</span>
          </div>
          <div class="title ellip2" id="albumheadertitle">
            <span v-for="t in titleSplits">{{ t }}<br /></span>
          </div>
        </div>
        <div class="bottom">
          <div id="test-elem"></div>
          <div class="versions">
            <MasterFlag
              v-for="(v, index) in album.versions"
              :bitrate="1200"
              :text="v"
              :key="v"
              :bg_color="
                album.colors[0]
                  ? getShift(album.colors[0], [80, -90])
                  : undefined
              "
              :text_color="
                album.colors[0]
                  ? getShift(album.colors[0], [-100, 80])
                  : undefined
              "
              :fill="album.versions.length > 1 && index === 0"
            />
          </div>
          <div class="stats ellip2">
            <div class="border rounded-sm pad-sm ellip">
              <ArtistName
                :artists="album.albumartists"
                :albumartists="''"
                :small="true"
                :append="
                  !isSmallPhone
                    ? `• ${album.date}  •  ${album.count} ${
                        album.count === 1 ? 'Track' : 'Tracks'
                      }  •  ${formatSeconds(album.duration, true)}`
                    : ''
                "
              />
            </div>
            <div class="stats2" v-if="isSmallPhone">
              {{ album.date }} • {{ album.count }} Tracks •
              {{ formatSeconds(album.duration, true) }}
            </div>
          </div>
          <div class="buttons">
            <PlayBtnRect :source="playSources.album" :store="useAlbumStore" />

            <HeartSvg
              :state="album.is_favorite"
              @handleFav="handleFav"
              :color="album.colors[0] ? album.colors[0] : ''"
            />
            <button
              class="options"
              :class="{ context_menu_showing }"
              @click.prevent="showContextMenu"
            >
              <MoreSvg
                :style="{
                  color: textColor,
                }"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

import { paths } from "@/config";
import {
  albumHeaderSmall,
  isSmallPhone,
  heightLarge,
} from "@/stores/content-width";

import useNavStore from "@/stores/nav";
import useAlbumStore from "@/stores/pages/album";

import {
  getBackgroundColor,
  getShift,
  getTextColor,
} from "@/utils/colortools/shift";

import { favType, playSources } from "@/composables/enums";
import { formatSeconds, useVisibility } from "@/utils";
import updatePageTitle from "@/utils/updatePageTitle";
import favoriteHandler from "@/composables/favoriteHandler";
import { showAlbumContextMenu } from "@/composables/context";

import HeartSvg from "../shared/HeartSvg.vue";
import MasterFlag from "../shared/MasterFlag.vue";
import PlayBtnRect from "../shared/PlayBtnRect.vue";
import MoreSvg from "@/assets/icons/more.svg";
import ArtistName from "@/components/shared/ArtistName.vue";

const albumheaderthing = ref<any>(null);
const imguri = paths.images;
const nav = useNavStore();
const store = useAlbumStore();

const titleSplits = ref([""]);
const context_menu_showing = ref(false);

const { info: album } = storeToRefs(store);

defineEmits<{
  (event: "playThis"): void;
}>();

function showContextMenu(e: MouseEvent) {
  showAlbumContextMenu(e, context_menu_showing);
}

/**
 * Calls the `toggleShowPlay` method which toggles the play button in the nav.
 * Emits the `resetBottomPadding` event to reset the album page content bottom padding.
 *
 * @param {boolean} state the new visibility state of the album page header.
 */
function handleVisibilityState(state: boolean) {
  nav.toggleShowPlay(state);
}

useVisibility(albumheaderthing, handleVisibilityState);

function handleFav() {
  favoriteHandler(
    album.value.is_favorite,
    favType.album,
    album.value.albumhash,
    store.makeFavorite,
    store.removeFavorite
  );
}

const textColor = computed((): string => {
  if (album.value.colors[0]) {
    return getTextColor(album.value.colors[0]);
  }

  return "";
});

const backgroundColor = computed((): string => {
  if (album.value.colors[0]) {
    return getBackgroundColor(album.value.colors[0]);
  }

  return "";
});

function balanceText(text: string, container_width: number) {
  if (isSmallPhone.value) return [text];

  const tempElem = document.createElement("span");
  tempElem.classList.add("balance-text-temp");
  tempElem.style.fontSize = "2.75rem";
  tempElem.style.fontWeight = "700";
  tempElem.innerText = text;
  document.body.appendChild(tempElem);

  const tempWidth = tempElem.offsetWidth;

  document.body.removeChild(tempElem);

  const ratio = tempWidth / container_width;

  if (ratio < 1 || ratio > 1.5) {
    // text fits properly or overflows 2 lines.
    return [text];
  }

  const words = text.split(" ");
  const wordsPerLine = Math.ceil(words.length / 2);
  // TODO: use characters to determine if text should be split. Check if the middle word is too short or too long, and if so, split at the next word or previous.

  const firstLine = words.slice(0, wordsPerLine).join(" ");
  const secondLine = words.slice(wordsPerLine).join(" ");

  return [firstLine, secondLine];
}

const updateTitle = () => {
  updatePageTitle(album.value.title + " - " + album.value.albumartists[0].name);
  const elem = document.getElementById("test-elem");
  titleSplits.value = balanceText(album.value.title, elem?.offsetWidth || 0);
};

onMounted(() => {
  updateTitle();
});

onBeforeRouteUpdate(() => {
  updateTitle();
});
</script>

<style lang="scss">
.balance-text-temp {
  visibility: hidden;
  position: absolute;
  top: -9999px;
  left: -9999px;
}

.album-header-ambient {
  width: 20rem;
  position: absolute;
  z-index: -100 !important;
  opacity: 0.25;
}

.a-header {
  display: grid;
  grid-template-columns: max-content 1fr;
  gap: 1rem;
  padding: 1rem;
  height: $banner-height;
  background-color: $black;
  align-items: flex-end;

  .buttons {
    display: flex;
    gap: $small;
  }

  .options {
    background-color: transparent;
    border: none;

    &.context_menu_showing {
      background-color: $darkblue;


      svg {
        color: $white !important;
      }
    }

    svg {
      transform: scale(1.25);
    }
  }

  .big-img {
    width: 16rem;
    height: 16rem;
    display: flex;
    align-items: flex-end;

    img {
      height: 16rem;
      aspect-ratio: 1;
      object-fit: cover;
    }
  }

  .big-img.imgSmall {
    width: 12rem;
    height: 12rem;

    img {
      height: 12rem;
    }
  }

  .nocontrast {
    color: $black;

    .top {
      .h {
        color: $pink;
      }
    }
  }

  .info {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr max-content;
    height: 100%;
    align-items: flex-end;

    img {
      height: 6rem;
      aspect-ratio: 1;
      object-fit: cover;
      user-select: none;
    }

    .top {
      .h {
        font-size: 14px;
        font-weight: 700;
      }

      .title {
        font-size: 2.75rem;
        font-weight: 700;
        width: fit-content;
        cursor: text;
      }

      .artist {
        font-size: 1.15rem;
      }
    }

    .bottom {
      margin-top: $smaller;

      .stats2 {
        text-align: center;
        margin: 0;
      }

      .stats {
        font-weight: bold;
        margin-bottom: 0.75rem;
        font-size: 0.8rem;

        .artistname {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        div {
          font-size: 0.8rem;
          word-break: normal;
        }
      }

      .versions {
        margin-bottom: $medium;
        margin-left: -$smaller;

        // &:first-child {}
        // .master-flag {
        //   background-color: transparent !important;
        //   border: solid 1px !important;
        // }
      }
    }
  }

  @include smallPhone {
    grid-template-columns: 1fr;
    padding: 2rem 1rem;
    height: 25rem;

    .big-img {
      width: 10rem !important;
      height: 10rem !important;
      aspect-ratio: 1;
      margin: 0 auto;

      img {
        height: 10rem !important;
      }
    }

    .title {
      font-size: 1.5rem !important;
      max-width: fit-content;
      margin: 0 auto;
      text-align: center;
    }

    .buttons {
      justify-content: center;
    }

    .stats > div {
      border: none;
      margin: 0 auto;
    }

    .versions {
      margin-bottom: 0 !important;
      margin-left: 0 !important;
      text-align: center;
    }
  }
}
</style>
