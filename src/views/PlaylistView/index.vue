<template>
  <div
    class="playlist-virtual-scroller v-scroll-page"
    :class="{ isSmall, isMedium }"
    style="height: 100%"
  >
    <RecycleScroller
      class="scroller"
      :items="scrollerItems"
      :item-size="null"
      key-field="id"
      v-slot="{ item }"
      style="height: 100%"
    >
      <component
        :is="item.component"
        v-bind="item.props"
        @playThis="playFromPlaylistPage(item.props.index - 1)"
      />
    </RecycleScroller>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUpdated } from "vue";
import { computed } from "@vue/reactivity";

import {
  heightLarge,
  isMedium,
  isSmall,
  isSmallPhone,
} from "@/stores/content-width";
import { dropSources } from "@/enums";
import useQueueStore from "@/stores/queue";
import usePlaylistStore from "@/stores/pages/playlist";

import updatePageTitle from "@/utils/updatePageTitle";

import playlistSvg from "@/assets/icons/playlist.svg";
import Header from "@/components/PlaylistView/Header.vue";
import NoItems from "@/components/shared/NoItems.vue";
import SongItem from "@/components/shared/SongItem.vue";
import AfterHeader from "@/components/PlaylistView/AfterHeader.vue";

const queue = useQueueStore();
const playlist = usePlaylistStore();

interface ScrollerItem {
  id: string | number;
  component: typeof Header | typeof SongItem | typeof NoItems;
  size: number;
  props?: {};
}

const getNoItemsComponent = () =>
  <ScrollerItem>{
    id: "Noitems",
    component: NoItems,
    size: 300, // somehow it doesn't work, patched with CSS
    props: {
      icon: playlistSvg,
      flag: playlist.tracks.length === 0,
      title: "No tracks in this playlist",
      description:
        'Add tracks to this playlist by right clicking on a track and selecting "add to playlist"',
    },
  };

const scrollerItems = computed(() => {
  const header: ScrollerItem = {
    id: "header",
    component: Header,
    size: heightLarge.value || isSmallPhone.value ? 25 * 16 : 19 * 16,
  };

  const afterHeader: ScrollerItem = {
    id: "afterHeader",
    component: AfterHeader,
    size: 4 * 16,
  };

  const tracks = playlist.tracks.map((track) => {
    return {
      id: track.filepath,
      component: SongItem,
      props: {
        track: track,
        index: track.index + 1,
        is_last: track.index === playlist.tracks.length - 1,
        droppable: true,
        source: dropSources.playlist,
      },
      size: 64,
    };
  });

  const body = playlist.tracks.length === 0 ? [getNoItemsComponent()] : tracks;

  return [header, afterHeader, ...body];
});

function playFromPlaylistPage(index: number) {
  const { name, id } = playlist.info;
  queue.playFromPlaylist(name, id, playlist.allTracks);
  queue.play(index);
}

[onMounted, onUpdated].forEach(() => {
  updatePageTitle(playlist.info.name);
});
</script>

<style lang="scss">
.playlist-virtual-scroller {
  .nothing {
    height: 25rem;
  }
}
</style>
