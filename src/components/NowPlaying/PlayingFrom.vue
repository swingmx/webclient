<template>
  <div class="now-playing-top">
    <router-link
      class="now-playling-from-link"
      :to="(data.location as RouteLocationRaw)"
      title="Go to Play Source"
    >
      <div class="from">
        <img
          v-if="
            queue.from.type === FromOptions.album ||
            queue.from.type === FromOptions.artist
          "
          :src="data.image + '.webp'"
          :alt="`Now Playing ${queue.from.type} image`"
          :class="`${
            queue.from.type === FromOptions.artist ? 'circular' : 'rounded-sm'
          }`"
        />
        <div v-else class="from-icon border rounded-sm">
          <component :is="data.icon"></component>
        </div>
        <div class="pad-sm">
          <div class="type">{{ queue.from.type }}</div>
          <div class="ellip2">{{ data.name }}</div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouteLocationRaw } from "vue-router";

import { FromOptions } from "@/enums";
import useQueueStore from "@/stores/queue";
import playingFrom from "@/utils/playingFrom";

const queue = useQueueStore();

const data = computed(() => {
  const { name, location, icon, image } = playingFrom(queue.from);
  return { name, location, icon, image };
});
</script>

<style lang="scss">
.now-playing-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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
    background-color: $gray;
    border: solid 1px $gray4;
  }

  .type {
    text-transform: capitalize;
    font-size: 0.8rem;
    color: $gray1;
  }
}
</style>
