<template>
  <div id="works-results">
    <div v-if="!search.works.value.length" class="t-center">
      <h5>{{ $t('Search.NoResultsTitle') }}</h5>
    </div>

    <RecycleScroller
      v-slot="{ item }"
      class="scroller"
      style="height: 100%"
      :items="scrollerItems"
      :item-size="64"
      key-field="id"
    >
      <component :is="item.component" v-bind="item.props" />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

import useSearch from "@/stores/search";

import AlbumsFetcher from "@/components/ArtistView/AlbumsFetcher.vue";
import SearchWorkRow from "@/components/Classical/SearchWorkRow.vue";

const search = useSearch();

const scrollerItems = computed(() => {
  const items: any[] = search.works.value.map((work) => ({
    id: `${work.workhash}-${work.albumhash}`,
    component: SearchWorkRow,
    props: { work },
  }));

  if (search.works.more) {
    items.push({
      id: Math.random(),
      component: AlbumsFetcher,
      props: {
        fetch_callback: search.loadWorks,
        outside_route: true,
      },
    });
  }

  return items;
});

onMounted(() => {
  search.switchTab("works");
});
</script>

<style lang="scss">
#works-results {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr max-content;

  .scroller {
    padding-bottom: 0rem !important;
  }
}
</style>
