<template>
    <div class="chartheader">
        <!-- <div class="title">{{ name }}</div> -->
        <div class="group">
            <div
                class="group-item"
                v-for="g in groups"
                :key="g"
                :class="g === name ? 'active' : ''"
                @click="$emit('changeGroup', g)"
            >
                {{ g }}
            </div>
        </div>
        <div class="period">
            <div
                class="period-item"
                v-for="p in periods"
                :key="p"
                :class="p === period ? 'active' : ''"
                @click="$emit('changePeriod', p)"
            >
                {{ p }}
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    name: string
    period: string
}>()

defineEmits<{
    (e: 'changePeriod', period: string): void
    (e: 'changeGroup', group: string): void
}>()

const groups = ['artists', 'albums', 'tracks']
const periods = ['week', 'month', 'year', 'alltime']
</script>

<style lang="scss">
.chartheader {
    padding: $smaller 0 1rem 0;
    margin: 0 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px $gray5;
    // margin-left: -1rem;

    .title {
        font-size: 1rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .period,
    .group {
        display: flex;
        gap: 1rem;
        text-transform: uppercase;

        .period-item,
        .group-item {
            cursor: pointer;
            font-size: 0.85rem;
            font-weight: 600;
            color: $gray2;

            &.active {
                color: $white;
            }
        }
    }
}
</style>
