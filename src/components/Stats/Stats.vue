<template>
    <div class="statshead" v-if="statItems.length">
        <div class="left">
            <StatItem
                v-for="item in statItems.slice(0, statItems.length - 1)"
                :key="item.cssclass"
                :value="item.value"
                :text="item.text"
                :icon="item.cssclass"
            />
        </div>
        <div class="right">
            <StatItem
                :value="statItems[statItems.length - 1].value"
                :text="statItems[statItems.length - 1].text"
                :icon="statItems[statItems.length - 1].cssclass"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { getStats } from '@/requests/stats'
import { onMounted, ref } from 'vue'
import StatItem from './StatItem.vue'

interface StatItem {
    cssclass: string
    value: string
    text: string
}

const statItems = ref<StatItem[]>([])

onMounted(async () => {
    const res = await getStats()
    if (res.status == 200) {
        statItems.value = res.data.stats
    }
})
</script>

<style lang="scss">
.statshead {
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 1.5rem;
    padding: 1rem;

    .left {
        display: flex;
        gap: 2rem;
    }

    .streamduration {
        padding: 1rem;
    }
}
</style>
