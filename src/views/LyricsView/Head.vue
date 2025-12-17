<template>
    <div v-if="queue.currenttrack" class="lyricsinfo">
        <RouterLink
            :to="{
                name: Routes.album,
                params: {
                    albumhash: queue.currenttrack.albumhash,
                },
            }"
        >
            <ImageLoader
                :image="paths.images.thumb.small + queue.currenttrack.image"
                :blurhash="queue.currenttrack.blurhash"
                :duration="1000"
                img-class="rounded-xsm shadow-sm"
            />
        </RouterLink>

        <div class="text">
            <TextLoader :text="queue.currenttrack.title" :duration="1000" :fade-duration="1000" class="" />
            <ArtistName :artists="queue.currenttrack.artists" :albumartists="queue.currenttrack.albumartists" />
        </div>
        <div class="right">
            <div v-if="lyrics.lyrics.length && !lyrics.synced" class="lyricstype">unsynced</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useLyrics from '@/stores/lyrics'
import useQueue from '@/stores/queue'

import ArtistName from '@/components/shared/ArtistName.vue'
import { paths } from '@/config'
import { Routes } from '@/router'
import ImageLoader from '@/components/shared/ImageLoader.vue'
import TextLoader from '@/components/shared/TextLoader.vue'

const queue = useQueue()
const lyrics = useLyrics()
</script>

<style lang="scss">
.lyricsinfo {
    padding: 2rem 0 1rem 0;
    font-size: 1rem;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    gap: $medium;
    align-items: center;

    @include allPhones {
        padding: $large 0;
        margin-bottom: -$small;
    }

    .image-loader {
        display: block;
        width: 2.5rem;
        height: 2.5rem;
        border-radius: $smaller;

        img {
            height: 2.5rem;
        }
    }

    .text-loader {
        height: 1rem;
        font-size: 0.8rem;
    }

    // .title {
    //     font-size: 0.85rem;
    // }

    .artist {
        font-size: 0.8rem;
    }

    .lyricstype {
        border-radius: $smaller;
        font-size: 12px;
        padding: $smaller $small;
        background-color: $white;
        color: $black;
    }
}
</style>
