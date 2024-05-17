<template>
  <div id="p-view" class="content-page">
    <Header>
      <template #name>Playlists</template>
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
      <template #right>
        <button class="playlist-button" @click="showNewPlaylistModal()"><PlusSvg /> New Playlist</button>
      </template>
    </Header>
    <PlaylistCardGroup v-if="!query && pinnedPlaylists.length" :playlists="pinnedPlaylists" :title="'Pinned'" />
    <PlaylistCardGroup
      v-if="playlists.length"
      :playlists="playlists"
      :title="query ? 'Search Results' : `${pinnedPlaylists.length ? 'Other' : 'All'} Playlists`"
    />

    <NoItems :flag="!playlists.length" :icon="PlaylistSvg" :title="'No playlists found'" :description="description" />
  </div>
</template>

<script setup lang="ts">
import { debouncedRef } from "@vueuse/core";
import { computed, onMounted, ref } from "vue";

import usePStore from "@/stores/pages/playlists";
import { useFuse } from "@/utils";
import updatePageTitle from "@/utils/updatePageTitle";

import PlaylistSvg from "@/assets/icons/playlist-1.svg";
import PlusSvg from "@/assets/icons/plus.svg";
import PlaylistCardGroup from "@/components/PlaylistsList/PlaylistCardGroup.vue";
import Header from "@/components/shared/GenericHeader.vue";
import NoItems from "@/components/shared/NoItems.vue";
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

  .playlist-button {
    svg {
      height: 1.5rem;
    }
  }

  .grid {
    grid-template-columns: repeat(auto-fill, minmax($cardwidth, 1fr));
    gap: 2.5rem 1.5rem;

    @include mediumPhones {
      grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
      gap: 1rem;
    }
  }

  #playlistsearch {
    width: 16rem;
    max-width: 100%;
    margin-top: 1rem;
    background-color: $gray5;
    color: white;
    font-size: 0.95rem;
    font-weight: 500;
    padding: $medium;
    outline: none;
    appearance: none;
  }

  .playlist-button {
    padding-right: $medium;
  }

  .nothing {
    height: 50%;

    svg {
      margin-bottom: 0;
    }
  }
}
</style>
