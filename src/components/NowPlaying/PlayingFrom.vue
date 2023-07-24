<template>
  <div class="now-playing-top">
    <router-link
      class="now-playling-from-link"
      :to="(location as RouteLocationRaw)"
      title="Go to Play Source"
    >
      <div class="from">
        <img
          v-if="
            queue.from.type === FromOptions.album ||
            queue.from.type === FromOptions.artist
          "
          :src="image + '.webp'"
          :alt="`Now Playing ${queue.from.type} image`"
          :class="`${
            queue.from.type === FromOptions.artist ? 'circular' : 'rounded-sm'
          }`"
        />
        <div class="from-icon border rounded-sm" v-else>
          <component :is="icon"></component>
        </div>
        <div class="pad-sm">
          <div class="type">{{ queue.from.type }}</div>
          <div class="ellip2">{{ name }}</div>
        </div>
      </div>
    </router-link>
    <OptionSvg
      class="optionsvg"
      @click="showMenu"
      :class="{ context_menu_showing }"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { RouteLocationRaw } from "vue-router";

import OptionSvg from "@/assets/icons/more.svg";
import { FromOptions } from "@/enums";
import { showTrackContextMenu } from "@/helpers/contextMenuHandler";
import useQueueStore from "@/stores/queue";
import playingFrom from "@/utils/playingFrom";
import { useRoute } from "vue-router";

const route = useRoute();
const queue = useQueueStore();
const context_menu_showing = ref(false);

function showMenu(e: MouseEvent) {
  if (!queue.currenttrack) return;
  showTrackContextMenu(
    e,
    queue.currenttrack,
    context_menu_showing,
    route,
    false
  );
}
const { name, location, icon, image } = playingFrom(queue.from);
</script>

<style lang="scss">
.now-playing-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;

  .optionsvg {
    transform: scale(1.5) rotate(90deg);
    border-radius: $small;

    &:hover {
      background-color: $gray3;
      cursor: pointer;
    }
  }

  svg.context_menu_showing {
    background-color: $gray3;
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
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .type {
    text-transform: capitalize;
    font-size: 0.8rem;
    color: $gray1;
  }
}
</style>
