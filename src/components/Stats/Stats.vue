<template>
    <div class="statshead">
        <div class="left">
            <StatItem />
            <StatItem />
            <StatItem />
        </div>
        <div class="right">
            <div class="statitem streamduration box">
                
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import StatItem from './StatItem.vue'
</script>

<style lang="scss">
.statshead {
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 1.25rem;
    padding: 1rem;

    .left {
        display: flex;
        gap: 1rem;
    }

    

    .streamduration {
        padding: 1rem;
    }
}
</style>