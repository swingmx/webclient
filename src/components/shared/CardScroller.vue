<template>
  <div class="cardscroller">
    <div class="rinfo">
      <div class="rtitle">
        <b>{{ title }}</b>
        <SeeAll v-if="route && items.length >= maxAbumCards" :route="route" />
      </div>
      <div v-if="description" class="rdesc">{{ description }}</div>
    </div>
    <div class="recentitems">
      <component
        :is="getComponent(i.type)"
        v-for="(i, index) in items.slice(0, maxAbumCards)"
        :key="index"
        class="hlistitem"
        v-bind="getProps(i)"
        @playThis="() => $emit('playThis', index)"
      ></component>
    </div>
  </div>
</template>

<script setup lang="ts">
import { playSources } from "@/enums";
import { maxAbumCards } from "@/stores/content-width";

import TrackCard from "./TrackCard.vue";
import SeeAll from "../shared/SeeAll.vue";
import FolderCard from "./FolderCard.vue";
import AlbumCard from "./AlbumCard.vue";
import ArtistCard from "./ArtistCard.vue";
import PlaylistCard from "../PlaylistsList/PlaylistCard.vue";
import FavoritesCard from "./FavoritesCard.vue";

const props = defineProps<{
  title: string;
  description?: string;
  items: {
    type: string;
    item: any;
  }[];
  playSource?: playSources;
  child_props?: any;
  route?: string;
}>();

defineEmits<{
  playThis: (index: number) => void;
}>();

function getComponent(type: string) {
  switch (type) {
    case "album":
      return AlbumCard;
    case "track":
      return TrackCard;
    case "artist":
      return ArtistCard;
    case "folder":
      return FolderCard;
    case "playlist":
      return PlaylistCard;
    case "favorite_tracks":
      return FavoritesCard;
  }
}

function getProps(item: { type: string; item: any }) {
  switch (item.type) {
    case "album":
      return {
        album: item.item,
        ...props.child_props,
      };
    case "track":
      return {
        track: item.item,
        playSource: props.playSource,
      };
    case "artist":
      return {
        artist: item.item,
      };
    case "folder":
      return {
        folder: item.item,
      };
    case "playlist":
      return {
        playlist: item.item,
      };
    case "favorite_tracks":
      return {
        item: item.item,
      };
  }
}
</script>

<style lang="scss">
.cardscroller {
  padding: 1.5rem 0;

  .recentitems {
    gap: 1.5rem 0;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(10.1rem, 1fr));
  }

  .p-card {
    background-color: transparent;
  }

  .rinfo {
    padding: 0 $medium;
    margin-bottom: $medium;

    .rtitle {
      font-size: 1.15rem;
      display: flex;
      align-items: baseline;
      justify-content: space-between;
    }

    .rdesc {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.747);
    }
  }

  .to_playlist {
    background-color: #fff;
    color: #000;
    border: 1px solid #fff;
    padding: 1.25rem 2rem;
    margin: 1rem;
  }
}
</style>
