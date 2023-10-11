<template>
  <div class="album-info" :style="{ color: textColor }">
    <div class="top">
      <AlbumType :album="album" />
      <div id="albumheadertitle" class="title ellip2">
        <span v-for="t in titleSplits" :key="t">{{ t }}<br /></span>
      </div>
    </div>
    <div class="bottom">
      <div id="test-elem"></div>
      <Versions :color="colors.bg" :versions="album.versions" />
      <Stats :album="album" />
      <Buttons :text-color="textColor || ''" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, onMounted, ref } from "vue";
import { onBeforeRouteUpdate } from "vue-router";

import { balanceText } from "@/utils/balanceText";
import { getTextColor } from "@/utils/colortools/shift";

import useAlbumStore from "@/stores/pages/album";
import updatePageTitle from "@/utils/updatePageTitle";

import Stats from "./Stats.vue";
import Buttons from "./Buttons.vue";
import Versions from "./Versions.vue";
import AlbumType from "./AlbumType.vue";

const store = useAlbumStore();

const { info: album, colors } = storeToRefs(store);
const titleSplits = ref([""]);

const textColor = computed((): string => {
  if (colors.value.bg) {
    return getTextColor(colors.value.bg);
  }

  return "";
});

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
.album-info {
  img {
    height: 6rem;
    aspect-ratio: 1;
    object-fit: cover;
    user-select: none;
  }

  .top {
    .albumtype {
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
</style>
