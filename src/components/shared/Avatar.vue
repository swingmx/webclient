<template>
    <img
        v-if="image"
        class="useravatar"
        :src="paths.images.user + image"
        :width="size || 80"
        :height="size || 80"
        :alt="name"
    />
    <Avatar
        v-else
        :size="size || 80"
        :name="name"
        :square="false"
        :variant="'beam'"
        :colors="['#3a3a3c']"
    />
</template>

<script setup lang="ts">
import Avatar from 'vue-boring-avatars'

import { paths } from '@/config'

defineProps<{
    name: string
    image?: string | null
    size?: number
}>()
</script>

<style lang="scss">
.useravatar {
    display: block;
    border-radius: 50%;
    object-fit: cover;
}
</style>
