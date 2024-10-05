<template>
    <div class="stats-charts">
        <GenericHeader>
            <template #name>Charts</template>
            <template #description>Your top artists, albums, and tracks</template>
        </GenericHeader>

        <div class="chartitemgroupsgrid">
            <ChartItemGroup :name="item" v-for="item in ['albums', 'artists', 'tracks']" :key="item" />
        </div>
    </div>
</template>

<script setup lang="ts">
import GenericHeader from '@/components/shared/GenericHeader.vue'
import ChartItemGroup from './ChartItemGroup.vue'
</script>

<style lang="scss">
.stats-charts {
    .chartitemgroupsgrid {
        padding: 1rem;
        display: grid;
        grid-template-columns: 2fr 1.25fr;
        grid-template-rows: 1fr 1fr;
        gap: 3rem;

        grid-template-areas:
            'tracks artists'
            'albums albums';

        .artists {
            grid-area: artists;
        }
        .tracks {
            grid-area: tracks;
        }

        .albums {
            grid-area: albums;
        }
    }
}
</style>
