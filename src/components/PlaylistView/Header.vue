<template>
  <div
    class="p-header image rounded-lg"
    :style="[
      {
        background: bg,
        backgroundPosition: `center ${info.settings.banner_pos}%`,
        height: `${isSmallPhone ? '24rem' : '18rem'}`,
      },
    ]"
    :class="{ 'use-sqr_img': useSqrImg }"
  >
  <div
    v-if="!info.has_image || info.settings.square_img"
    class="album-header-ambient rounded-lg"
    style="height: 100%; width: 100%"
    :style="{
      // hide shadow on small screen
      boxShadow: isSmallPhone ? '' : colors.bg ? `0 .5rem 2rem ${colors.bg}` : '0 .5rem 2rem black',
    }"
  ></div>
    <div
      v-if="Number.isInteger(info.id)"
      class="float"
      :style="{
        color: textColor,
      }"
      @click="pinPlaylist(info.id)"
    >
      <PinFillSvg v-if="info.pinned" />
      <PinSvg v-else />
    </div>

    <div v-if="!isSmallPhone && info.has_image" class="gradient rounded-lg"></div>
    <div
      v-if="useSqrImg && (info.has_image || playlist.info.count)"
      class="sqr_img cover"
      :class="{ editable: canEdit, droptarget: dropping }"
      :style="{ '--cover-outline': textColor || '#ffffff' }"
      @click="pasteTarget?.focus()"
      @dragover="onDragOver"
      @dragleave="dropping = false"
      @drop="onDrop"
    >
      <img v-if="info.has_image" :src="(playlist.info.image as string)" class="rounded-sm" />
      <BannerImages v-else class="rounded-sm" />
      <PasteTarget
        v-if="canEdit"
        ref="pasteTarget"
        :label="$t('PlaylistView.Edit')"
        @image="file => modal.showEditPlaylistModal(file)"
        @enter="modal.showEditPlaylistModal()"
      />
    </div>
    <Info :text-color="textColor" :btn_color="colors.btn" />
    <LastUpdated />
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

import { pinUnpinPlaylist } from "@/requests/playlists";
import { isSmallPhone } from "@/stores/content-width";
import usePStore from "@/stores/pages/playlist";
import { getTextColor } from "@/utils/colortools/shift";

import PinFillSvg from "@/assets/icons/pin.fill.svg";
import PinSvg from "@/assets/icons/pin.svg";
import PasteTarget from "@/components/shared/PasteTarget.vue";
import useModalStore from "@/stores/modal";
import { firstImage } from "@/utils/imageFiles";
import BannerImages from "./Header/BannerImages.vue";
import Info from "./Header/Info.vue";
import LastUpdated from "./Header/LastUpdated.vue";

const playlist = usePStore();

const { info, colors } = storeToRefs(playlist);

const modal = useModalStore();
const canEdit = computed(() => Number.isInteger(playlist.info.id));
const pasteTarget = ref<InstanceType<typeof PasteTarget>>();
const dropping = ref(false);

function onDragOver(e: DragEvent) {
  if (!canEdit.value || !e.dataTransfer?.types.includes("Files")) return;
  e.preventDefault();
  dropping.value = true;
}

function onDrop(e: DragEvent) {
  dropping.value = false;
  const file = firstImage(e.dataTransfer?.files);
  if (!canEdit.value || !file) return;
  e.preventDefault();
  modal.showEditPlaylistModal(file);
}

const bg = computed(() => {
  // hide background on small screen
  if (isSmallPhone.value){
    return "";
  }

  if (playlist.info.has_image) {
    if (isSmallPhone.value || (!playlist.info.settings.square_img && !isSmallPhone.value)) {
      return `url(${info.value.image})`;
    }
  }

  return colors.value.bg ? colors.value.bg : "";
});

const useSqrImg = computed(() => !playlist.info.has_image || !bg.value.startsWith("url"));

const textColor = computed(() => {
  if (colors.value.bg !== "") {
    // @ts-ignore
    return getTextColor(colors.value.bg);
  }

  return "";
});

function pinPlaylist(pid: number) {
  pinUnpinPlaylist(pid).then((success) => {
    if (success) {
      playlist.info.pinned = !playlist.info.pinned;
    }
  });
}
</script>

<style lang="scss">
.p-header {
  display: grid;
  grid-template-columns: 1fr;
  position: relative;
  background-position: center 50%;
  background-size: cover !important;
  padding-bottom: 1rem;

  .album-header-ambient {
    position: absolute;
    opacity: 0.25;
  }

  .float {
    position: absolute;
    top: 1rem;
    right: 1rem;
    transform: scale(0.75);
    z-index: 100;
    cursor: pointer;
  }

  &.use-sqr_img {
    grid-template-columns: max-content 1fr;
    align-items: flex-end;

    .title {
      font-size: 3.75rem !important;
    }

    @include largePhones {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      align-items: flex-start;
      gap: 1rem;

      // take up the space left by the gradient element
      height: 25rem !important;


      .playlist-info {
        text-align: center;
        height: max-content;
      }

      .sqr_img {
        height: 12rem;
        width: 12rem;
        margin-top: 1rem;
        margin: 0 auto;
      }

      .title {
        font-size: 2rem !important;
      }
    }
  }

  .sqr_img {
    height: 16rem;
    width: 16rem;
    z-index: 100;
    margin-left: 1rem;
    position: relative;

    img {
      height: 100%;
      width: 100%;
      object-fit: cover;
    }

    // transparent at rest, so focusing doesn't animate the outline in from the text colour
    > :first-child {
      height: 100%;
      width: 100%;
      outline: 2px solid transparent;
      outline-offset: 4px;
    }

    // focused, the cover takes a pasted image; the outline follows the header's text colour
    &.editable:focus-within > :first-child {
      outline-color: color-mix(in srgb, var(--cover-outline) 45%, transparent);
    }

    &.droptarget > :first-child {
      outline: 2px dashed var(--cover-outline);
    }
  }

  .gradient {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: $black;
    opacity: 0.5;
  }

  @include largePhones {
    .title {
      font-size: 2.5rem !important;
    }
  }
}
</style>
