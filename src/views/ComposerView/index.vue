<template>
    <div v-if="composer" class="content-page composerview">
        <ComposerHeader :composer="composer" />
        <ComposerWorks
            v-if="composer.works.length || composer.categories.length"
            :composerhash="composer.composerhash"
            :works="composer.works"
            :categories="composer.categories"
            :category="composer.category"
            :more-link="composer.works_total > composer.works.length"
        />
        <CardScroller
            v-if="composer.albums.length"
            :title="$t('Views.ComposerView.Albums')"
            :items="composer.albums.map(album => ({ type: 'album', item: album }))"
            :route="`/composers/${composer.composerhash}/albums`"
        />
        <ComposerAbout v-if="composer.bio" :bio="composer.bio" :url="composer.wikipedia_url" />
        <ComposerInterpreters v-if="composer.interpreters.length" :interpreters="composer.interpreters" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

import useComposerStore from '@/stores/pages/composer'
import updatePageTitle from '@/utils/updatePageTitle'

import ComposerAbout from '@/components/Classical/ComposerAbout.vue'
import ComposerHeader from '@/components/Classical/ComposerHeader.vue'
import ComposerInterpreters from '@/components/Classical/ComposerInterpreters.vue'
import ComposerWorks from '@/components/Classical/ComposerWorks.vue'
import CardScroller from '@/components/shared/CardScroller.vue'

const store = useComposerStore()
const composer = computed(() => store.composer)

function setTitle() {
    if (composer.value) updatePageTitle(composer.value.name)
}

onMounted(setTitle)
watch(() => composer.value?.composerhash, setTitle)

onBeforeRouteUpdate(async to => {
    await store.fetchComposer(to.params.hash as string, (to.query.category as string) || undefined)
})
</script>

<style lang="scss">
.composerview {
    height: 100%;
    overflow: auto;
    padding-bottom: 4rem;

    .cardscroller {
        padding: 2rem 1rem 0;
    }
}
</style>
