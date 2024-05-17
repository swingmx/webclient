<template>
    <div class="togglesetting rounded-sm">
        <div class="text">
            <div>{{ title }}</div>
            <div
                class="desc"
                v-if="desc"
            >
                {{ desc }}
            </div>
        </div>
        <Switch
            :state="value"
            @click="$emit('input', !value)"
        />
    </div>
</template>

<script setup lang="ts">
import Switch from '@/components/SettingsView/Components/Switch.vue'
defineProps<{
    title: string
    desc?: string
    value: boolean
}>()

defineEmits<{
    (e: 'input', value: boolean): void
}>()
</script>

<style lang="scss">
.togglesetting {
    display: grid;
    grid-template-columns: 1fr max-content;
    align-items: center;
    padding: $small;

    &.disabled {
        opacity: 0.5;
        pointer-events: none;
    }

    &:hover {
        background-color: $gray5;
    }
}
</style>
