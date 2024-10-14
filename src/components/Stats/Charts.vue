<template>
    <div class="stats-charts">
        <GenericHeader>
            <template #name>Charts</template>
            <template #description>Your top artists, albums, and tracks</template>
        </GenericHeader>

        <div class="chartitemgroupsgrid">
            <ChartItemGroup />
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
        display: grid;
        grid-template-columns: 1fr;
        gap: 3rem;
    }
}
</style>
