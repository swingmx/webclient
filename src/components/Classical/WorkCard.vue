<template>
    <RouterLink
        :to="{ name: Routes.work, params: { token: work.workhash }, query: work.albumhash ? { albumhash: work.albumhash } : {} }"
        class="album-card work-card"
    >
        <div class="tile rounded-sm" :style="composerTint(work.composer_hash)">
            <div class="face">
                <div class="label ellip">{{ work.label ?? '' }}</div>
                <div class="mark">{{ mark }}</div>
            </div>
        </div>
        <div>
            <div v-if="work.help_text" class="rhelp album">
                <span class="help" :class="{ keep: !work.time }">{{ work.help_text }}</span>
                <span class="time">{{ work.time }}</span>
            </div>
            <h4 class="title">
                {{ work.name }}<template v-if="work.nickname"> “{{ work.nickname }}”</template>
            </h4>
            <div class="artist ellip">{{ work.byline }}</div>
        </div>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { WorkCardItem } from '@/interfaces'
import { Routes } from '@/router'
import composerTint from '@/utils/composerTint'

const props = defineProps<{
    work: WorkCardItem
}>()

/**
 * The first catalogue number, else the initials of the composer or byline.
 */
const mark = computed(() => {
    const id = props.work.catalogue_ids[0]?.name
    if (id) return id
    const name = props.work.composer ?? props.work.byline ?? ''
    return name
        .split(/\s+/)
        .filter(word => /^\p{Lu}/u.test(word))
        .map(word => word[0])
        .join('')
        .slice(0, 3)
})
</script>

<style lang="scss">
.work-card {
    .tile {
        container-type: inline-size;
        aspect-ratio: 1;
        background: var(--tile-bg);
        box-shadow: inset 0 0 0 0.5px color-mix(in srgb, var(--tile-label) 16%, transparent);
        overflow: hidden;
    }

    // sized from .tile, which cannot size its own padding in cqi
    .face {
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 8cqi;
    }

    .label {
        font-size: 6.5cqi;
        font-weight: 600;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: var(--tile-label);
    }

    .mark {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 22cqi;
        line-height: 1.05;
        color: #f2ece4;
    }

    .title {
        width: auto;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }
}
</style>
