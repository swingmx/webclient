<template>
  <div
    class="artist-header-ambient rounded"
    style="height: 100%; width: 100%"
    :style="{
      boxShadow: artist.info.colors.length
        ? `0 .5rem 2rem ${artist.info.colors[0]}`
        : undefined,
    }"
  ></div>
  <div
    class="artist-page-header rounded no-scroll"
    :style="{
      height: `${heightLarge || isSmallPhone ? '25rem' : '18rem'}`,
    }"
  >
    <div
      class="artist-info"
      :style="{
        color: artist.info.colors[0]
          ? getTextColor(artist.info.colors[0])
          : undefined,
      }"
    >
      <section class="text">
        <div class="card-title">Artist</div>
        <div class="artist-name ellip2">{{ artist.info.name }}</div>
        <div class="stats">
          {{ artist.info.trackcount }} Track{{
            `${artist.info.trackcount == 1 ? "" : "s"}`
          }}
          • {{ artist.info.albumcount }} Album{{
            `${artist.info.albumcount == 1 ? "" : "s"}`
          }}
          •
          {{ formatSeconds(artist.info.duration, true) }}
        </div>
      </section>
      <div class="buttons">
        <PlayBtnRect
          :source="playSources.artist"
          :store="useArtistPageStore"
          :bg_color="artist.colors.btn"
        />
        <HeartSvg
          @handleFav="handleFav"
          :state="artist.info.is_favorite"
          :color="artist.info.colors[0] ? artist.info.colors[0] : ''"
        />
        <button
          class="options"
          @click="showContext"
          :class="{ context_menu_showing }"
        >
          <MoreSvg />
        </button>
      </div>
    </div>
    <div
      class="artist-img no-select"
      :style="{
        height: `${heightLarge ? '24rem' : '18rem'}`,
      }"
    >
      <img :src="paths.images.artist.large + artist.info.image" />
    </div>
    <div
      class="gradient"
      :style="{
        backgroundImage: artist.info.colors[0]
          ? `linear-gradient(${
              isSmallPhone ? '210deg' : 'to left'
            }, transparent 20%,
      ${artist.info.colors[0]} ${isSmallPhone ? '80' : '50'}%,
      ${artist.info.colors[0]} 100%)`
          : '',
      }"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

import { paths } from "@/config";
import { favType, playSources } from "@/enums";
import favoriteHandler from "@/helpers/favoriteHandler";
import { heightLarge, isSmallPhone } from "@/stores/content-width";
import useArtistPageStore from "@/stores/pages/artist";
import { getTextColor } from "@/utils/colortools/shift";
import formatSeconds from "@/utils/useFormatSeconds";

import HeartSvg from "@/components/shared/HeartSvg.vue";
import updatePageTitle from "@/utils/updatePageTitle";
import { onBeforeRouteUpdate } from "vue-router";
import PlayBtnRect from "../shared/PlayBtnRect.vue";
import MoreSvg from "@/assets/icons/more.svg";
import { showArtistContextMenu } from "@/helpers/contextMenuHandler";

const artist = useArtistPageStore();

function handleFav() {
  favoriteHandler(
    artist.info.is_favorite,
    favType.artist,
    artist.info.artisthash,
    artist.makeFavorite,
    artist.removeFavorite
  );
}

const context_menu_showing = ref(false);

function showContext(e: MouseEvent) {
  showArtistContextMenu(
    e,
    context_menu_showing,
    artist.info.artisthash,
    artist.info.name
  );
}

const updateTitle = () => updatePageTitle(artist.info.name);
onMounted(() => updateTitle());
onBeforeRouteUpdate(() => updateTitle());
</script>

<style lang="scss">
.artist-header-ambient {
  height: 17rem;
  position: absolute;
  opacity: 0.25;
  margin-right: -1rem;
}

.artist-page-header {
  display: grid;
  grid-template-columns: 1fr minmax(min-content, 50%);
  position: relative;

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

  .artist-img {
    // width: 100%;

    img {
      height: 100%;
      width: 100%;
      aspect-ratio: 1;
      object-fit: cover;
      object-position: 0% 20%;
    }
  }

  .gradient {
    position: absolute;
    background-image: linear-gradient(
      to left,
      transparent 10%,
      $gray 50%,
      $gray 100%
    );
    height: 100%;
    width: 100%;

    @include smallPhone {
      background-image: linear-gradient(
        210deg,
        transparent 20%,
        $gray 80%,
        $gray 100%
      );
    }
  }

  .artist-info {
    z-index: 1;
    padding: 1rem;
    padding-right: 0;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    gap: 1rem;

    .text {
      display: flex;
      flex-direction: column;
      gap: $small;
    }

    .card-title {
      font-size: small;
      font-weight: 700;
    }

    .artist-name {
      font-size: 3.5rem;
      font-weight: bold;
      word-wrap: break-word;
    }

    .stats {
      font-size: small;
      font-weight: 700;
    }
  }

  .artist-info.nocontrast {
    color: $black;
  }

  .buttons {
    display: flex;
    gap: $small;
  }

  @include smallPhone {
    display: flex;
    flex-direction: column-reverse;
    position: relative;

    .artist-img {
      position: absolute;
      width: 100%;
      top: 0;
      height: 100% !important;

      img {
        height: 100%;
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        object-position: 0% 20%;
      }
    }
  }
}
</style>
