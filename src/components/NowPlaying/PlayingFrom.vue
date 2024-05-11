<template>
  <div class="now-playing-top">
    <router-link class="now-playling-from-link" :to="(data.location as RouteLocationRaw)" title="Go to Play Source">
      <div class="from">
        <img
          v-if="tracklist.from.type === FromOptions.album || tracklist.from.type === FromOptions.artist"
          :src="data.image + '.webp'"
          :alt="`Now Playing ${tracklist.from.type} image`"
          :class="`${tracklist.from.type === FromOptions.artist ? 'circular' : 'rounded-sm'}`"
        />
        <div v-else class="from-icon border rounded-sm">
          <component :is="data.icon"></component>
        </div>
        <div class="pad-sm">
          <div class="type">{{ tracklist.from.type }}</div>
          <div class="ellip2">{{ data.name }}</div>
        </div>
      </div>
    </router-link>
    <button class="options" @click="showContextMenu">
      <MoreSvg />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouteLocationRaw } from "vue-router";

import useTracklist from "@/stores/queue/tracklist";

import { FromOptions } from "@/enums";
import playingFrom from "@/utils/playingFrom";

import MoreSvg from "@/assets/icons/more.svg";
import { showQueueContextMenu } from "@/helpers/contextMenuHandler";

const tracklist = useTracklist();

const context_showing = ref(false);

const data = computed(() => {
  const { name, location, icon, image } = playingFrom(tracklist.from);
  return { name, location, icon, image };
});

function showContextMenu(e: MouseEvent) {
  if (!tracklist.tracklist.length) return;

  showQueueContextMenu(e, context_showing);
}
</script>

<style lang="scss">
.now-playing-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  .options {
    transform: rotate(90deg);

    svg {
      transform: scale(1.25);
    }
  }
}

.now-playling-from-link {
  display: block;
  width: fit-content;
}

.now-playling-from-link > .from {
  display: flex;
  align-items: center;

  img {
    width: 2.5rem;
    aspect-ratio: 1;
    object-fit: cover;
  }

  .from-icon {
    padding: $smaller;
    aspect-ratio: 1;
    width: 2.5rem;
    margin-right: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $gray;
    border: solid 1px $gray4;
  }

  .type {
    text-transform: capitalize;
    font-size: 0.8rem;
    color: $gray1;
    font-weight: 500;
  }

  .type + div {
    font-weight: 500;
  }
}
</style>
