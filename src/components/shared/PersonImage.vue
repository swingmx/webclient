<template>
    <img v-if="image && !failed" :src="paths.images.artist[size] + image" alt="" @error="failed = true" />
    <div v-else class="person-initials" :style="composerTint(tint)">
        <span>{{ personInitials(name) }}</span>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

import { paths } from '@/config'
import composerTint from '@/utils/composerTint'
import personInitials from '@/utils/personInitials'

const props = withDefaults(
    defineProps<{
        image?: string | null
        name: string
        // the composer's palette entry; neutral grey without one
        tint?: number | null
        size?: 'small' | 'medium' | 'large'
    }>(),
    { size: 'medium' }
)

const failed = ref(false)
watch(
    () => props.image,
    () => (failed.value = false)
)
</script>

<style lang="scss">
.person-initials {
    width: 100%;
    aspect-ratio: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    container-type: inline-size;
    background: var(--tile-bg);
    box-shadow: inset 0 0 0 0.5px color-mix(in srgb, var(--tile-label) 16%, transparent);
    color: var(--tile-label);
    font-family: Georgia, 'Times New Roman', serif;
    font-weight: 400;
    user-select: none;

    span {
        font-size: 34cqw;
        line-height: 1;
    }
}
</style>
