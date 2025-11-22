<template>
    <div class="content-page" style="height: 100%; overflow: auto">
        <Charts />
        <br><br>
        <GenericHeader>
            <template #name>{{ $t('Views.Stats.Title')}}</template>
            <template #description>{{$t('Views.Stats.Description')}}</template>
        </GenericHeader>
        <Stats />
    </div>
</template>

<script setup lang="ts">
import Charts from '@/components/Stats/Charts.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'
import Stats from '@/components/Stats/Stats.vue'
</script>
