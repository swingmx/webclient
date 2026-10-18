<template>
    <div class="content-page composeralbumsview">
        <GenericHeader v-if="page">
            <template #name>{{ $t('Views.ComposerView.Albums') }}</template>
            <template #description>
                <RouterLink :to="{ name: Routes.composer, params: { hash: page.composerhash } }">
                    {{ page.name }}
                </RouterLink>
                • {{ $t('Views.ComposerView.AlbumCount', { n: page.albums.length }, page.albums.length) }}
            </template>
        </GenericHeader>
        <div v-if="page" class="cards">
            <AlbumCard v-for="album in page.albums" :key="album.albumhash" :album="album" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'

import { useT } from '@/i18n'
import { Routes } from '@/router'
import useComposerStore from '@/stores/pages/composer'
import updatePageTitle from '@/utils/updatePageTitle'

import AlbumCard from '@/components/shared/AlbumCard.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'

const { t } = useT()
const route = useRoute()
const store = useComposerStore()
const page = computed(() => store.albums)

onMounted(async () => {
    await store.fetchAlbums(route.params.hash as string)
    if (page.value) updatePageTitle(`${t('Views.ComposerView.Albums')} - ${page.value.name}`)
})
</script>

<style lang="scss">
.composeralbumsview {
    height: 100%;
    overflow: auto;

    .cards {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax($cardwidth, 1fr));
        gap: 2rem 0;

        @include mediumPhones {
            grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
        }
    }
}
</style>
