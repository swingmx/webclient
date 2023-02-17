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
import { computed } from "@vue/reactivity";
import { onBeforeRouteLeave, onBeforeRouteUpdate } from "vue-router";

import { isMedium, isSmall, heightLarge } from "@/stores/content-width";
import usePlaylistStore from "@/stores/pages/playlist";
import useQueueStore from "@/stores/queue";

import Header from "@/components/PlaylistView/Header.vue";
import SongItem from "@/components/shared/SongItem.vue";
import { updateBannerPos } from "@/composables/fetch/playlists";
import NoItems from "@/components/shared/NoItems.vue";
import playlistSvg from "@/assets/icons/playlist.svg";

const queue = useQueueStore();
const playlist = usePlaylistStore();

interface ScrollerItem {
  id: string | number;
  component: typeof Header | typeof SongItem | typeof NoItems;
  size: number;
  props?: {};
}

const noItems: ScrollerItem = {
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
    size: heightLarge.value ? 25 * 16 : 19 * 16,
  };

  const tracks = playlist.tracks.map((track) => {
    return {
      id: track.filepath,
      component: SongItem,
      props: {
        track: track,
        index: track.index + 1,
      },
      size: 64,
    };
  });

  const body = playlist.tracks.length === 0 ? [noItems] : tracks;

  return [header, ...body];
});

function playFromPlaylistPage(index: number) {
  const { name, id } = playlist.info;
  queue.playFromPlaylist(name, id, playlist.allTracks);
  queue.play(index);
}

[onBeforeRouteLeave, onBeforeRouteUpdate].forEach((guard) => {
  guard(() => {
    if (playlist.bannerPosUpdated) {
      updateBannerPos(parseInt(playlist.info.id), playlist.bannerPos);
    }

    setTimeout(() => {
      playlist.resetQuery();
    }, 500);
  });
});
</script>

<style lang="scss">
.playlist-virtual-scroller {
  .nothing {
    height: 25rem;
  }
}
</style>
