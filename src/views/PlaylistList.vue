<template>
  <div id="p-view" class="content-page">
    <Header>
      <template #description>
        You have {{ pStore.playlists.length }} playlists in your library
        <br />
        <form spellcheck="false" @submit.prevent="() => {}">
          <input
            id="playlistsearch"
            v-model="input"
            class="rounded-sm no-border"
            type="search"
            placeholder="Search playlists"
            name=""
          />
        </form>
      </template>
      <template v-if="!isSmall" #right>
        <button @click="showNewPlaylistModal()">
          <PlusSvg /> New Playlist
        </button>
      </template>
    </Header>
    <PlaylistCardGroup
      v-if="!query && pinnedPlaylists.length"
      :playlists="pinnedPlaylists"
      :title="'Pinned'"
    />
    <PlaylistCardGroup
      v-if="playlists.length"
      :playlists="playlists"
      :title="
        query
          ? 'Search Results'
          : `${pinnedPlaylists.length ? 'Other' : 'All'} Playlists`
      "
    />

    <NoItems
      :flag="!playlists.length"
      :icon="PlaylistSvg"
      :title="'No playlists found'"
      :description="description"
    />
  </div>
</template>

<script setup lang="ts">
import { debouncedRef } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";

import { useFuse } from "@/utils";
import usePStore from "@/stores/pages/playlists";
import updatePageTitle from "@/utils/updatePageTitle";
import { isMedium, isSmall, maxAbumCards } from "@/stores/content-width";

import NoItems from "@/components/shared/NoItems.vue";
import Header from "@/components/Radios/Header.vue";
import PlaylistSvg from "@/assets/icons/playlist-1.svg";
import PlaylistCardGroup from "@/components/PlaylistsList/PlaylistCardGroup.vue";
import PlusSvg from "@/assets/icons/plus.svg";
import useModalStore from "@/stores/modal";

const pStore = usePStore();
const { showNewPlaylistModal } = useModalStore();

const input = ref("");
const query = debouncedRef(input, 300);

const description = `You can create a playlist by right clicking on a track and selecting the
        "Add to Playlist" option`;

// TODO: When you add a song to playlist when you are in this page, increase the count on the card.

const pinnedPlaylists = computed(() => {
  return pStore.playlists.filter((p) => p.pinned);
});

onMounted(() => {
  updatePageTitle("Playlists");

  // focus on search input
  const elem = document.getElementById("playlistsearch");
  if (elem) elem.focus();
});

const playlists = computed(() => {
  if (!query.value) {
    return pStore.playlists.filter((p) => !p.pinned);
  }

  const p = useFuse(query.value, pStore.playlists, {
    keys: ["name"],
  });

  return p.value.map((r) => r.item);
});
</script>

<style lang="scss">
#p-view {
  padding-bottom: $content-padding-bottom;
  height: 100%;
  overflow: auto;
  padding-right: 1rem;

  .grid {
    grid-template-columns: repeat(auto-fill, minmax(9.25rem, 1fr));
    gap: 2.5rem 1.75rem;
  }

  #playlistsearch {
    width: 20rem;
    margin-top: 1rem;
    background-color: $gray5;
    color: white;
    font-size: 1rem;
    padding: $small;
    outline: none;
  }

  .nothing {
    height: 16rem;
  }
}
</style>
