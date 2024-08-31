<template>
    <div class="itemsortby">
        <div class="tt select circular">Sort By</div>
        <div class="left group">
            <SortKey
                :items="($route.name == Routes.AlbumList ? albumitems : artistitems).concat(items)"
                :sortby="store.sortby"
                :reverse="store.reverse"
            />
        </div>
        <div class="right group">
            <div class="tt select circular"><ChartSvg /></div>
            <SortKey :items="statitems" :sortby="store.sortby" :reverse="store.reverse" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { Routes } from '@/router'
import { useRoute } from 'vue-router'

import { useAlbumList, useArtistList } from '@/stores/pages/itemlist'
import SortKey from './SortKey.vue'
import ChartSvg from '@/assets/icons/chart.svg'

const route = useRoute()
const store = route.name === Routes.AlbumList ? useAlbumList() : useArtistList()

const items = [
    { key: 'trackcount', displayName: 'No. of tracks' },
    { key: 'duration', displayName: 'Duration' },
    { key: 'created_date', displayName: 'Date added' },
    { key: 'lastplayed', displayName: 'Last played' },
]

const statitems = [
    { key: 'playcount', displayName: 'Plays' },
    { key: 'playduration', displayName: 'Play duration' },
]

const albumitems = [
    { key: 'title', displayName: 'Title' },
    { key: 'albumartists', displayName: 'Artist' },
    { key: 'date', displayName: 'Year released' },
]

const artistitems = [
    { key: 'name', displayName: 'Name' },
    { key: 'albumcount', displayName: 'No. of albums' },
]
</script>

<style lang="scss">
.itemsortby {
    z-index: 200;
    display: grid;
    grid-template-columns: max-content 1fr max-content;
    gap: 1rem;

    @include allPhones {
        grid-template-columns: 1fr;

        .tt {
            display: none !important;
        }
    }

    .group {
        display: flex;
        flex-wrap: wrap;
        align-items: flex-start;
        gap: 1rem;
    }

    padding: 1rem $medium 2rem $medium;
    position: relative;
    font-size: 14px;
    font-weight: 500;
    text-transform: capitalize;
    user-select: none;

    .select {
        cursor: pointer;
        display: flex;
        align-items: center;
        border: solid 1px $gray5;
        padding: $small $medium;
        transition: background-color 0.2s ease-out, border-color 0.2s ease-out;
    }

    .select.circular {
        user-select: none;
        pointer-events: none;
    }

    .reverse svg.direction {
        transform: rotate(90deg);
    }

    .select:hover {
        background-color: $gray4;
        border-color: $gray4;
    }

    .tt {
        background-color: #fff;
        color: #000;
        border: none;
        height: max-content;

        display: flex;
        gap: $small;

        svg {
            height: 1rem;
        }
    }

    svg.direction {
        transform: rotate(-90deg);
        margin: -2px 0;
        margin-right: -6px;
        margin-left: 2px;
        transition: transform 0.1s linear;
    }

    .active {
        background-color: $gray4;
        border-color: $gray4;
    }

    button {
        padding-left: $medium;
    }
}
</style>
