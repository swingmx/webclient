<template>
  <div class="now-playing-view v-scroll-page">
    <DynamicScroller
      :items="scrollerItems"
      :min-item-size="64"
      class="scroller"
      style="height: 100%"
    >
      <template v-slot="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.props]"
          :data-index="index"
        >
          <component
            :key="index"
            :is="item.component"
            v-bind="item.props"
          ></component>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { ScrollerItem } from "@/interfaces";
import Header from "@/components/NowPlaying/Header.vue";

const header: ScrollerItem = {
  id: "header",
  component: Header,
};

const scrollerItems = computed(() => [header]);
</script>

<style lang="scss">
.now-playing-view {
  height: 100%;
  // margin-right: -$medium;
}
</style>
