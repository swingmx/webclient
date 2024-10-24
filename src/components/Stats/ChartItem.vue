<template>
    <RouterLink :to="getRouterParams()" class="chartitem rounded-sm">
        <ArrowSvg class="trend" :class="item.trend?.trend" />
        <div class="index">{{ index }}</div>
        <img :src="getItemImage(item)" class="chartimage" :class="name" />
        <div class="iteminfo">
            <div class="title" :title="item.name" v-if="isArtist">
                {{ item.name }} <MasterFlag v-if="item.trend?.is_new" :text="item.trend?.is_new ? 'New' : ''" :bitrate="1900"/>
            </div>
            <div class="title" :title="item.title" v-if="isAlbumOrTrack">
                {{ item.title }} <MasterFlag v-if="item.trend?.is_new" :text="item.trend?.is_new ? 'New' : ''" :bitrate="1900"/>
            </div>
            <div class="artist" v-if="isAlbumOrTrack">
                <ArtistName
                    :artists="item.artists ? item.artists : item.albumartists"
                    :albumartists="item.albumartists"
                />
            </div>
            <div class="artist" v-if="isArtist">
                {{ item.extra['playcount'] }} track plays
            </div>
        </div>
        <div class="helptext">
            {{ item.help_text }}
        </div>
    </RouterLink>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { paths } from '@/config'
import { Album, Artist, Track } from '@/interfaces'
import ArrowSvg from '@/assets/icons/arrow.svg'
import ArtistName from '../shared/ArtistName.vue'
import { Routes } from '@/router'
import MasterFlag from '../shared/MasterFlag.vue'

type name = 'artist' | 'album' | 'track'
type ChartItem = Artist | Album | Track

const props = defineProps<{
    item: ChartItem
    index: number
    name: name
}>()

const isArtist = computed(() => props.name === 'artist')
const isAlbumOrTrack = computed(() => props.name === 'album' || props.name === 'track')

function getItemImage(item: ChartItem) {
    switch (props.name) {
        case 'artist':
            return paths.images.artist.medium + item.image
        case 'album':
            return paths.images.thumb.medium + item.image
        case 'track':
            return paths.images.thumb.medium + item.image
    }
}

function getRouterParams() {
    switch (props.name) {
        case 'artist':
            return { name: Routes.artist, params: { hash: props.item.artisthash } }
        default:
            return { name: Routes.album, params: { albumhash: props.item.albumhash } }
    }
}
</script>

<style lang="scss">
.chartitem {
    padding: $small 2rem;
    padding-left: 1.25rem;

    display: grid;
    grid-template-columns: 1rem 1rem max-content 1fr max-content;
    gap: 1.5rem;
    align-items: center;

    margin-bottom: $medium;

    .index {
        font-size: 1.25rem;
        font-weight: 900;
        color: $gray2;
        text-align: right;
    }

    .chartimage.artist {
        border-radius: 50%;
    }

    .iteminfo {
        .title {
            font-size: 1rem;
            font-weight: bold;
        }

        .artist {
            font-size: 0.85rem;
            color: $gray1;
            margin-top: 0.2rem;
        }
    }

    .chartimage {
        border-radius: 0.25rem;
        height: 48px;
        width: auto;
    }
    .trend {
        height: 1.25rem;
    }

    .trend.rising {
        transform: rotate(90deg);
        color: rgb(75, 170, 67);
    }

    .trend.falling {
        transform: rotate(-90deg);
        color: $red;
    }

    .is_new {
        color: $orange;
    }

    .helptext {
        font-size: 0.75rem;
        color: $gray2;
        text-align: right;
        text-transform: uppercase;
        font-weight: bold;
    }
}
</style>
