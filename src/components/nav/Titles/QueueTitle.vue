<template>
  <div class="nav-queue-title">
    <div class="first no-scroll">
      <div class="playing-from">
        <router-link :to="(location as RouteLocationRaw)">
          <div class="border rounded-sm pad-sm">
            <component :is="SourceIcon" v-if="SourceIcon" />
            <b class="ellip">{{ name }}</b>
          </div>
        </router-link>
      </div>
    </div>
    <QueueActions />
  </div>
</template>

<script setup lang="ts">
import QueueActions from "@/components/RightSideBar/Queue/QueueActions.vue";

import useQueueStore from "@/stores/queue";
import playingFrom from "@/utils/playingFrom";

import { RouteLocationRaw } from "vue-router";

const queue = useQueueStore();

const { name, icon: SourceIcon, location } = playingFrom(queue.from);
</script>

<style lang="scss">
.nav-queue-title {
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 1rem;
  align-items: center;

  .first {
    .playing-from {
      display: flex;
      align-items: center;
      gap: $small;
      opacity: 0.75;

      .border {
        cursor: pointer;
        display: grid;
        grid-template-columns: max-content 1fr;
        align-items: center;
        padding: $smaller $small;
        height: 100%;

        &:hover {
          background-color: $darkestblue;
          border: solid 1px $darkestblue;
        }
      }

      svg {
        transform: scale(0.9);
      }
    }
  }

  .queue-actions {
    margin: 0;
  }
}
</style>
