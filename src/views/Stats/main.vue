<template>
    <div class="content-page" style="height: 100%; overflow: auto">
        <Charts />
        <br><br>
        <GenericHeader>
            <template #name>Stats</template>
            <template #description>Your listening stats for the past week</template>
        </GenericHeader>
        <Stats />
    </div>
</template>

<script setup lang="ts">
import Charts from '@/components/Stats/Charts.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'
import Stats from '@/components/Stats/Stats.vue'
</script>
