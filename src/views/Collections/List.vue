<template>
  <div class="content-page collections-list">
    <GenericHeader>
      <template #name>Collections</template>
      <template #description>You have {{ collections.length }} collections in your library</template>
      <template #right>
        <button class="new-collection" @click="openNewCollectionModal"><PlusSvg /> New Collection</button>
      </template>
    </GenericHeader>

    <div v-if="loading" class="state">Loading collections...</div>
    <div v-else-if="error" class="state">{{ error }}</div>

    <div v-else-if="collections.length" class="list">
      <RouterLink
        v-for="item in collections"
        :key="item.id"
        :to="{ name: Routes.Collection, params: { collection: String(item.id) } }"
        class="collection-item"
      >
        <div class="name">{{ item.name }}</div>
        <div class="desc">{{ item.extra?.description || 'No description' }}</div>
        <div class="meta">{{ item.items?.length || 0 }} items</div>
      </RouterLink>
    </div>

    <NoItems
      :flag="!loading && !error && collections.length === 0"
      :icon="CollectionSvg"
      :title="'No collections found'"
      :description="emptyDescription"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import PlusSvg from '@/assets/icons/plus.svg'
import CollectionSvg from '@/assets/icons/folder-1.svg'
import GenericHeader from '@/components/shared/GenericHeader.vue'
import NoItems from '@/components/shared/NoItems.vue'
import type { Collection } from '@/interfaces'
import { getAllCollections } from '@/requests/collections'
import useModal from '@/stores/modal'
import { Routes } from '@/router'
import updatePageTitle from '@/utils/updatePageTitle'

const collections = ref<Collection[]>([])
const loading = ref(true)
const error = ref('')
const modal = useModal()

const emptyDescription =
  'Collections help you group albums, artists, playlists, and mixes together for quick access.'

onMounted(async () => {
  updatePageTitle('Collections')

  try {
    collections.value = await getAllCollections()
  } catch {
    error.value = 'Failed to load collections.'
  } finally {
    loading.value = false
  }
})

function openNewCollectionModal() {
  modal.showCollectionModal()
}
</script>

<style scoped lang="scss">
.collections-list {
  height: 100%;
  overflow: auto;
  padding-bottom: $content-padding-bottom;

  .new-collection {
    padding-right: $medium;

    svg {
      height: 1.3rem;
    }
  }

  .state {
    margin-left: $medium;
    margin-top: 1rem;
    opacity: 0.85;
  }

  .list {
    display: grid;
    margin-top: 1rem;
    padding: 0 $medium;
    gap: $small;
  }

  .collection-item {
    display: block;
    padding: $medium;
    border-radius: 0.5rem;
    background: $gray5;
    text-decoration: none;

    &:hover {
      background: $gray;
    }
  }

  .name {
    font-weight: 600;
  }

  .desc,
  .meta {
    opacity: 0.8;
    font-size: 0.9rem;
    margin-top: 0.25rem;
  }
}
</style>

