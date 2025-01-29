<template>
    <RouterLink
        :to="{
            name: Routes.artist,
            params: {
                hash: artist.artisthash,
            },
        }"
        class="artist-card"
        @contextmenu.prevent="showContextMenu"
        :class="{ 'context-menu-open': contextMenuFlag }"
    >
        <div class="image circular">
            <img class="artist-image circular" :src="imguri + artist.image" />
            <div
                class="overlay circular"
                :style="{
                    background: `linear-gradient(to top, ${artist.color} 20%, transparent)`,
                }"
            ></div>
            <PlayBtn :artisthash="artist.artisthash" :artistname="artist.name" :source="playSources.artist" />
        </div>
        <div v-if="artist.help_text" class="rhelp t-center">
            <span class="help" :class="{ keep: !artist.time }">{{ artist.help_text }}</span>
            <span class="time">{{ artist.time }}</span>
        </div>
        <div class="artist-name t-center">
            {{ artist.name }}
        </div>
        <div v-if="artist.help_text && artist.trackcount" class="racount t-center">
            {{ artist.trackcount }} Track{{ artist.trackcount == 1 ? '' : 's' }}
        </div>
    </RouterLink>
</template>

<script setup lang="ts">
import { paths } from '@/config'
import { Artist } from '@/interfaces'
import { Routes } from '@/router'

import { playSources } from '@/enums'
import PlayBtn from './PlayBtn.vue'
import { ref } from 'vue'
import { showArtistContextMenu } from '@/helpers/contextMenuHandler'

const imguri = paths.images.artist.medium
const contextMenuFlag = ref(false)

const props = defineProps<{
    artist: Artist
}>()

const showContextMenu = (e: MouseEvent) => {
    showArtistContextMenu(e, contextMenuFlag, props.artist.artisthash, props.artist.name)
}
</script>

<style lang="scss">
.artist-card {
    overflow: hidden;
    position: relative;

    border-radius: $medium;
    justify-content: center;
    padding: 1.2rem 1rem !important;
    font-size: 0.95rem;
    font-weight: 700;
    height: max-content;
    transition: background-color 0.2s ease-out;

    &.context-menu-open {
        background-color: $gray5;
    }

    .image {
        position: relative;

        .overlay {
            position: absolute;
            width: 100%;
            height: calc(100% - $small + 1px);
            top: 0;
            opacity: 0;
            transition: opacity 0.25s ease;
        }
    }

    $btnwidth: 4rem;

    .play-btn {
        opacity: 0;
        position: absolute;
        width: 4rem;
        bottom: 0;
        left: calc(50% - ($btnwidth / 2));
        transition: all 0.25s;
    }

    &:hover {
        background-color: $gray5;

        .play-btn {
            opacity: 1;
            transform: translateY(-1.25rem);
        }

        .overlay {
            opacity: 1;
        }
    }

    .artist-image {
        width: 100%;
        transition: all 0.5s ease-in-out;
        object-fit: cover;
        margin-bottom: $smaller;
    }

    .artist-name {
        word-break: break-word;
    }

    .racount {
        font-size: 12px;
        color: #ffffffbf;
    }
}
</style>
