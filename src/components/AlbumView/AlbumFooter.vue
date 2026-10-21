<template>
    <div class="album-footer" :class="{ ruled }">
        <div v-if="released">{{ $t('Views.AlbumViews.Released', { date: released }) }}</div>
        <div v-if="copyright">{{ copyright.startsWith('©') ? copyright : `© ${copyright}` }}</div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{
    date?: number
    copyright?: string
    // a rule above, closing a classical works list
    ruled?: boolean
}>()

/**
 * The release date in full, or only the year when the tag held just a
 * year (stored as January 1).
 */
const released = computed(() => {
    if (!props.date) return ''
    const date = new Date(props.date * 1000)
    if (date.getUTCMonth() === 0 && date.getUTCDate() === 1) return String(date.getUTCFullYear())
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' })
})
</script>

<style lang="scss">
.album-footer {
    padding: 1.5rem 1rem 1rem;
    font-size: 0.85rem;
    color: $gray1;
    line-height: 1.6;

    &.ruled {
        border-top: solid 1px $gray5;
    }
}
</style>
