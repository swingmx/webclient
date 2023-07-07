<template>
  <div class="now-playing-tabs">
    <div class="tab-items">
      <h3>{{ $route.query.tab }}</h3>
      <div class="buttons">
        <button
          v-for="(item, index) in items"
          :key="index"
          class="circular"
          :style="{
            backgroundColor: colors.theme1,
            color: getTextColor(colors.theme1),
          }"
          @click="() => $router.push({ query: { tab: item.name } })"
        >
          <component :is="item.icon"></component>
          <span v-if="$route.query.tab === item.name">{{ item.name }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import QueueSvg from "@/assets/icons/queue.svg";
import RadioSvg from "@/assets/icons/radio.svg";
import useColorStore from "@/stores/colors";
import { getTextColor } from "@/utils/colortools/shift";

const colors = useColorStore();

const items = [
  {
    name: "queue",
    icon: QueueSvg,
  },
  {
    name: "queue radio",
    icon: RadioSvg,
  },
];
</script>

<style lang="scss">
.now-playing-tabs {
  //   padding-bottom: 1rem;

  .tab-items {
    margin-bottom: 1rem;
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    // padding-top: 2rem;

    h3 {
      text-transform: capitalize;
    }

    .buttons {
      display: flex;
      gap: 1rem;
    }

    button:last-child {
      svg {
        transform: scale(0.8);
      }
    }
  }

  .tab-items button {
    padding: 1.25rem !important;
    color: $pink;
    gap: $small;
    border: none;
    background-color: rgba(255, 0, 242, 0.219);
    text-transform: capitalize;

    &:hover {
      border: none;
    }
  }
}
</style>
