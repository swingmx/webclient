<template>
  <div class="artist-buttons">
    <PlayBtnRect :source="playSources.artist" :bg_color="artist.colors.btn" />
    <ShuffleBtn :source="playSources.artist" />
    <HeartSvg
      :state="artist.info.is_favorite"
      :color="
        !useCircularImage
          ? artist.info.color
            ? artist.info.color
            : ''
          : ''
      "
      @handleFav="handleFav"
    />
    <button
      class="options"
      :class="{ context_menu_showing }"
      @click="showContext"
    >
      <MoreSvg />
    </button>
    <template v-if="artist.info.collectives">
      <span class="part-of-divider"></span>
      <RouterLink
        v-for="collective in artist.info.collectives"
        :key="collective.artisthash"
        class="part-of-pill"
        :to="{ name: Routes.artist, params: { hash: collective.artisthash } }"
      >
        <PersonImage :image="collective.image" :name="collective.name" size="small" />
        <span class="part-of-label">{{ $t("ArtistView.PartOf") }}</span>
        <b class="ellip">{{ collective.name }}</b>
        <span>→</span>
      </RouterLink>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

import { favType, playSources } from "@/enums";
import { showArtistContextMenu } from "@/helpers/contextMenuHandler";
import favoriteHandler from "@/helpers/favoriteHandler";
import { Routes } from "@/router";
import useArtistPageStore from "@/stores/pages/artist";

import MoreSvg from "@/assets/icons/more.svg";
import HeartSvg from "@/components/shared/HeartSvg.vue";
import PersonImage from "@/components/shared/PersonImage.vue";
import PlayBtnRect from "@/components/shared/PlayBtnRect.vue";
import ShuffleBtn from "@/components/shared/ShuffleBtn.vue";

defineProps<{
  useCircularImage?: boolean;
}>();

const artist = useArtistPageStore();
const context_menu_showing = ref(false);

function handleFav() {
  favoriteHandler(
    artist.info.is_favorite,
    favType.artist,
    artist.info.artisthash,
    artist.makeFavorite,
    artist.removeFavorite
  );
}

function showContext(e: MouseEvent) {
  showArtistContextMenu(
    e,
    context_menu_showing,
    artist.info.artisthash,
    artist.info.name
  );
}
</script>

<style lang="scss">
.artist-buttons {
  display: flex;
  align-items: center;
  gap: $small;

  .part-of-divider {
    width: 1px;
    height: 1.5rem;
    margin: 0 $small;
    background-color: color-mix(in srgb, currentColor 25%, transparent);
  }

  .part-of-pill {
    display: flex;
    align-items: center;
    gap: $small;
    min-width: 0;
    height: 2rem;
    padding: 0 0.85rem 0 4px;
    border: 1px solid color-mix(in srgb, currentColor 35%, transparent);
    border-radius: 2rem;
    font-size: 0.9rem;
    white-space: nowrap;

    &:hover {
      background-color: color-mix(in srgb, currentColor 12%, transparent);
    }

    img,
    .person-initials {
      width: 1.5rem;
      height: 1.5rem;
      flex-shrink: 0;
      border-radius: 50%;
      object-fit: cover;
      font-size: 0.6rem;
    }
  }

  .part-of-label {
    opacity: 0.7;
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
}
</style>
