<template>
    <div class="now-playing-info">
        <div class="text">
            <div class="title">{{ queue.currenttrack?.title || 'Swing Music' }}</div>
            <div class="artist">
                <ArtistName
                    v-if="queue.currenttrack"
                    :artists="queue.currenttrack?.artists || null"
                    :albumartists="queue.currenttrack?.albumartists || ''"
                />
                <span v-else class="artist author">
                    <a href="https://github.com/cwilvx" target="_blank">built by @cwilvx ↗</a>
                </span>
            </div>
        </div>
        <!-- <div class="actions">
      <HeartSvg :state="queue.currenttrack?.is_favorite" @handle-fav="$emit('handleFav', queue.currenttrackhash)" />
      <OptionSvg class="optionsvg" :class="{ context_menu_showing }" @click="showMenu" />
    </div> -->
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import ArtistName from '../shared/ArtistName.vue'
import HeartSvg from '../shared/HeartSvg.vue'

import OptionSvg from '@/assets/icons/more.svg'
import { showTrackContextMenu } from '@/helpers/contextMenuHandler'
import useQueueStore from '@/stores/queue'

const context_menu_showing = ref(false)

const queue = useQueueStore()

defineEmits<{
    (e: 'handleFav', trackhash: string): void
}>()

function showMenu(e: MouseEvent) {
    if (!queue.currenttrack) return

    showTrackContextMenu(e, queue.currenttrack, context_menu_showing)
}
</script>

<style lang="scss">
.now-playing-info {
    display: grid;
    // grid-template-columns: 1fr;
    gap: 1rem;
    margin-top: 1rem;
    text-align: center;

    .text {
        display: grid;
        place-items: center;
    }

    .title {
        font-weight: 600;
        font-size: 1.5rem;
    }

    .artist {
        font-size: 1rem;
        color: $gray1;
    }

    .actions {
        display: flex;
        align-items: center;
        gap: 1rem;

        .optionsvg {
            transform: scale(1.5) rotate(90deg);
            border-radius: $small;
            transition: background-color 0.2s ease-out;

            &:hover {
                background-color: $gray3;
                cursor: pointer;
            }
        }

        svg.context_menu_showing {
            background-color: $gray3;
        }
    }

    .heart-button {
        background-color: $gray;
        transition: background-color 0.2s ease-out;

        &:hover {
            background-color: $gray4;
        }
    }

    .author {
        & > * {
            color: $gray1 !important;
        }
    }
}
</style>
