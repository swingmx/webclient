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
            <div v-if="lyrics.verified" class="cloud-verified" :class="{ 'is-visible': showCheckmark }">
                <CheckmarkSvg />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { nextTick, onMounted, onUnmounted, ref, watch } from 'vue'

import useLyrics from '@/stores/lyrics'
import useQueue from '@/stores/queue'

import ArtistName from '@/components/shared/ArtistName.vue'
import { paths } from '@/config'
import { Routes } from '@/router'
import ImageLoader from '@/components/shared/ImageLoader.vue'
import TextLoader from '@/components/shared/TextLoader.vue'
import CheckmarkSvg from '@/assets/icons/checkmark.svg'

// how long the verified checkmark stays visible before fading away
const CHECKMARK_VISIBLE_DURATION_MS = 4000

// trackhashes whose checkmark has already been shown this session,
// so it is only ever revealed once per track
const seenCheckmarkTrackhashes = new Set<string>()

const queue = useQueue()
const lyrics = useLyrics()

const showCheckmark = ref(false)
let hideCheckmarkTimer: ReturnType<typeof setTimeout> | undefined

function clearHideCheckmarkTimer() {
    if (hideCheckmarkTimer) {
        clearTimeout(hideCheckmarkTimer)
        hideCheckmarkTimer = undefined
    }
}

function revealCheckmark() {
    const trackhash = lyrics.currentTrack

    if (!lyrics.verified || !trackhash) return
    if (seenCheckmarkTrackhashes.has(trackhash)) return

    seenCheckmarkTrackhashes.add(trackhash)

    // mount hidden first so the fade-in transition actually runs
    showCheckmark.value = false
    nextTick(() => {
        showCheckmark.value = true
        clearHideCheckmarkTimer()
        hideCheckmarkTimer = setTimeout(() => {
            showCheckmark.value = false
        }, CHECKMARK_VISIBLE_DURATION_MS)
    })
}

watch(
    () => [lyrics.verified, lyrics.currentTrack],
    () => revealCheckmark()
)

onMounted(() => revealCheckmark())
onUnmounted(() => clearHideCheckmarkTimer())
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

    .cloud-verified {
        opacity: 0;
        pointer-events: none;
        transition: opacity 600ms ease-in-out;
        color: #ffffff76;

        svg {
            width: 1rem;
            height: 1rem;
        }

        &.is-visible {
            opacity: 1;
        }
    }

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
