<template>
    <div class="workheader">
        <div class="workcomposer">
            <RouterLink
                v-if="work.composer && work.composer_hash"
                :to="{ name: Routes.artist, params: { hash: work.composer_hash } }"
                class="composername composerlink"
                @click.stop
            >
                {{ work.composer }}
            </RouterLink>
            <span v-else-if="work.composer" class="composername">{{ work.composer }}</span>
            <span v-if="playable" class="play" @click.stop="$emit('playWork')"> <PlaySvg /> {{ $t('Common.Play') }}</span>
        </div>
        <div class="worktitle">
            <RouterLink
                v-if="work.workhash"
                :to="{ name: Routes.work, params: { token: work.workhash }, query: albumhash ? { albumhash } : {} }"
                class="worktitlelink"
            >
                {{ title }}
            </RouterLink>
            <template v-else>{{ title }}</template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { QueueWork } from '@/interfaces'
import { Routes } from '@/router'
import PlaySvg from '@/assets/icons/play.svg'

const props = defineProps<{
    work: QueueWork
    albumhash?: string
    playable?: boolean
}>()

defineEmits<{
    (e: 'playWork'): void
}>()

const title = computed(() => {
    let title = props.work.name

    const catalogueIds = (props.work.catalogue_ids ?? []).map(id => id.name).join(', ')
    if (catalogueIds) {
        title += ', ' + catalogueIds
    }

    if (props.work.subtitle) {
        title += ' · ' + `"${props.work.subtitle}"`
    }

    return title
})
</script>

<style lang="scss">
.workheader {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding-left: $small;
    // separates this work from whatever sits above it (previous work or tracks)
    padding-top: 1.25rem;
    padding-bottom: $smaller;
}

.composerlink {
    color: inherit;

    &:hover {
        text-decoration: underline;
    }
}

.worktitle {
    font-size: 1rem;
    font-weight: 600;

    .worktitlelink {
        color: inherit;

        &:hover {
            text-decoration: underline;
        }
    }
}

.workcomposer {
    font-size: 12px;
    color: $gray1;
    text-transform: uppercase;
    display: flex;
    align-items: center;

    .composername {
        margin-right: $smaller;
    }

    .play {
        opacity: 0;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: opacity 0.2s ease-out;

        svg {
            height: 12px;
        }
    }

    .play {
        text-transform: none;
    }
}

.workheader:hover .workcomposer .play {
    opacity: 1;
}
</style>
