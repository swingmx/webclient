<template>
    <div class="now-playing-info">
        <div class="text">
            <div class="title">
                <RouterLink
                    v-if="playing"
                    class="worklink"
                    :to="{
                        name: Routes.work,
                        params: { token: playing.workhash },
                        query: { albumhash: playing.albumhash },
                    }"
                >
                    {{ playing.title }}
                </RouterLink>
                <template v-else>
                    {{ (queue.currenttrack as Track)?.title ?? $t('Common.AppTitle') }}
                </template>
            </div>
            <div v-if="playing" class="artist work-line">
                <RouterLink
                    v-if="playing.composer && playing.composer_hash"
                    :to="{ name: Routes.artist, params: { hash: playing.composer_hash } }"
                    class="composer"
                >
                    {{ playing.composer }}
                </RouterLink>
                <span v-else-if="playing.composer" class="composer">{{ playing.composer }}</span>
                <template v-if="playing.work">
                    <span v-if="playing.composer"> · </span>
                    <span class="work">{{ playing.work }}</span>
                </template>
            </div>
            <div v-else class="artist">
                <ArtistName
                    v-if="queue.currenttrack"
                    :artists="queue.currenttrack?.artists || null"
                    :albumartists="queue.currenttrack?.albumartists || ''"
                />
                <span v-else class="artist author">
                    <a href="https://github.com/cwilvx" target="_blank">{{ $t('Common.BuiltBy') }}</a>
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
import { Routes } from '@/router'
import useQueueStore from '@/stores/queue'
import ArtistName from '../shared/ArtistName.vue'
import useNowPlayingWork from '@/composables/useNowPlayingWork'
import { Track } from '@/interfaces'
import { showTrackContextMenu } from '@/helpers/contextMenuHandler'

const context_menu_showing = ref(false)

const queue = useQueueStore()
const playing = useNowPlayingWork()

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

        .worklink {
            color: inherit;

            &:hover {
                text-decoration: underline;
            }
        }
    }

    .artist {
        font-size: 1rem;
        color: $gray1;
    }

    .work-line .composer {
        color: $white;

        &:hover {
            text-decoration: underline;
        }
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
