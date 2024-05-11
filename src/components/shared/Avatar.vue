<template>
    <Avatar
        :size="size || 80"
        :name="name"
        :square="false"
    />
</template>

<script setup lang="ts">
import Avatar from 'vue-boring-avatars'

defineProps<{
    name: string
    size?: number
}>()
</script>
