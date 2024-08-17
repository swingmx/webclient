<template>
    <div v-if="album_disc.is_album_disc_number" class="album_disc_header no-select">
        <div class="disc_number">
            Disc {{ album_disc.album_page_disc_number }}
            <span @click="$emit('playDisc', album_disc.album_page_disc_number || 0)" class="play">
                <PlaySvg /> Play Disc {{ album_disc.album_page_disc_number }}</span
            >
        </div>
        <div class="play"></div>
    </div>
</template>

<script setup lang="ts">
import { AlbumDisc } from '@/interfaces'
import PlaySvg from '@/assets/icons/play.svg'

defineProps<{
    album_disc: AlbumDisc
}>()

defineEmits<{
    (e: 'playDisc', disc_number: number): void
}>()
</script>

<style lang="scss">
.album_disc_header {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
    padding-left: 1rem;
    margin-top: $small;
    height: $song-item-height;

    .disc_number {
        font-size: $medium;
        font-weight: 500;
        opacity: 0.75;
        display: flex;
    }

    .play {
        margin-left: $small;
        opacity: 0;
        cursor: pointer;
        display: flex;
        align-items: center;

        svg {
            height: 12px;
        }
    }

    @include largePhones {
        padding-left: 0.5rem !important;
    }

    &:hover {
        .play {
            opacity: 1;
        }
    }
}
</style>
