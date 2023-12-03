<template>
  <div class="home-recent-items">
    <div class="rinfo">
      <div class="rtitle">
        <b>{{ title }}</b>
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
      ></component>
    </div>
    <RouterLink
      v-if="playSource == playSources.recentlyAdded"
      to="playlist/recentlyadded"
    >
      <button class="to_playlist circular">Browse recent tracks</button>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { playSources } from "@/enums";
import { maxAbumCards } from "@/stores/content-width";

import TrackCard from "./TrackCard.vue";
import FolderCard from "./FolderCard.vue";
import AlbumCard from "../shared/AlbumCard.vue";
import ArtistCard from "../shared/ArtistCard.vue";
import PlaylistCard from "../PlaylistsList/PlaylistCard.vue";

const props = defineProps<{
  title: string;
  description?: string;
  items: {
    type: string;
    item: any;
  }[];
  playSource: playSources;
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
  }
}

function getProps(item: { type: string; item: any }) {
  switch (item.type) {
    case "album":
      return {
        album: item.item,
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
  }
}
</script>

<style lang="scss">
.home-recent-items {
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
    }

    .rdesc {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.747);
    }
  }

  .rhelp {
    text-transform: uppercase;
    font-size: 11px;
    color: $purple;
    font-weight: bold;
    margin: $smaller 0;

    &.album {
      color: $orange;
    }

    &.track {
      color: $pink;
    }

    &.folder {
      color: $teal;
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
