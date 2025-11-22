<template>
    <div class="stats-charts">
        <GenericHeader>
            <template #name>{{ $t('Charts.ChartsTitle') }}</template>
            <template #description>{{ $t('Charts.ChartsDescription') }}</template>
        </GenericHeader>
        <br>
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
