<template>
  <div class="albumlistview v-scroll-page">
    <DynamicScroller
      style="height: 100%"
      class="scroller"
      :min-item-size="64"
      :items="scrollerItems"
    >
      <template #default="{ item, index, active }">
        <DynamicScrollerItem
          :item="item"
          :active="active"
          :size-dependencies="[item.props]"
          :data-index="index"
        >
          <component
            :is="item.component"
            :key="index"
            v-bind="item.props"
          ></component>
        </DynamicScrollerItem>
      </template>
    </DynamicScroller>
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { storeToRefs } from "pinia";
import { computed } from "vue";
import { onBeforeRouteUpdate, useRoute } from "vue-router";

import { pageRestoring } from "@/composables/pageCache";
import { maxAbumCards } from "@/stores/content-width";
import { useAlbumList, useArtistList } from "@/stores/pages/itemlist";

import Fetcher from "@/components/ArtistView/AlbumsFetcher.vue";
import CardRow from "@/components/shared/CardRow.vue";
import Header from "./Header.vue";
import SortBanner from "@/components/CardListView/SortBanner.vue";

const route = useRoute();
// fixed at setup; a cached page must not follow the current route
const isAlbumList = route.name == Routes.AlbumList;
const store = isAlbumList ? useAlbumList() : useArtistList();

const { items: storeitems, total } = storeToRefs(store);

const scrollerItems = computed(() => {
  const items = [];

  items.push(
    ...[
      {
        id: "header",
        component: Header,
        props: {
          total: total.value,
        },
      },
      {
        id: "sortbanner",
        component: SortBanner,
      },
    ]
  );

  console.log(maxAbumCards.value)

  const groups = Math.ceil(storeitems.value.length / maxAbumCards.value);
  for (let i = 0; i < groups; i++) {
    items.push({
      id: i,
      component: CardRow,
      props: {
        type: isAlbumList ? "album" : "artist",
        items: storeitems.value.slice(
          i * maxAbumCards.value,
          (i + 1) * maxAbumCards.value
        ),
      },
    });
  }

  items.push({
    id: Math.random(),
    component: Fetcher,
    props: {
      fetch_callback: () => store.getMoreAlbums(),
      show_text: storeitems.value.length < total.value && store.canFetch,
    },
  });

  return items;
});

onBeforeRouteUpdate((to, from, next) => {
  if (pageRestoring()) return next();
  const { sortby, reverse } = to.query;
  store.setSort(sortby as string);
  store.setReverse(reverse == "1");

  next();
  store.restart();
});

</script>

<style lang="scss">
.albumlistview {
  height: 100%;
}
</style>
