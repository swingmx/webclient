<template>
    <RouterLink
        :to="{ name: Routes.work, params: { token: work.workhash }, query: work.albumhash ? { albumhash: work.albumhash } : {} }"
        class="album-card work-card"
    >
        <div v-if="cover" class="with-img rounded-sm no-scroll">
            <img class="shadow-lg" :src="paths.images.thumb.medium + (work as WorkRecordingCard).image" alt="" />
        </div>
        <div v-else class="tile rounded-sm" :style="composerTint(tile.tint)">
            <div class="face">
                <div class="label ellip">{{ tile.label ?? '' }}</div>
                <div v-if="alias" class="mark alias">{{ alias }}</div>
                <div v-else class="mark">{{ tile.mark }}</div>
            </div>
        </div>
        <div>
            <div v-if="work.help_text" class="rhelp album">
                <span class="help" :class="{ keep: !work.time }">{{ work.help_text }}</span>
                <span class="time">{{ work.time }}</span>
            </div>
            <h4 v-if="cover" class="title">{{ (work as WorkRecordingCard).album }}</h4>
            <template v-else>
                <h4 class="title">
                    {{ tile.name }}
                </h4>
            </template>
            <div class="artist ellip">{{ work.byline }}</div>
        </div>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { paths } from '@/config'
import { WorkCardItem, WorkRecordingCard } from '@/interfaces'
import { Routes } from '@/router'
import composerTint from '@/utils/composerTint'

const props = defineProps<{
    work: WorkCardItem | WorkRecordingCard
    // a recording of the work: its album cover, album title, and performer
    cover?: boolean
}>()

const tile = computed(() => props.work as WorkCardItem)
// the nickname or subtitle, shown on the tile in place of the mark
const alias = computed(() => tile.value.nickname || tile.value.subtitle)
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

        &.alias {
            font-size: 13cqi;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }
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
