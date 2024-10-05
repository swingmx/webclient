<template>
    <div class="chartheader">
        <div class="title">{{ name }}</div>
        <div class="period">
            <div class="period-item">
                this week
            </div>
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
    name: 'artists' | 'albums' | 'tracks'
    period: string
}>()

defineEmits<{
    (e: 'changePeriod', period: string): void
}>()

const periods = ['week', 'month', 'year', 'alltime']
</script>

<style lang="scss">
.chartheader {
    padding: $smaller 3rem 1rem 2.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: solid 1px $gray5;
    width: calc(100% + 2rem);
    margin-left: -1rem;

    .title {
        font-size: 1.25rem;
        font-weight: 600;
        text-transform: uppercase;
    }

    .period {
        display: flex;
        gap: 1rem;
        text-transform: uppercase;

        .period-item {
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
