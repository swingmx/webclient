<template>
    <span class="see-all">
        <RouterLink :to="route">
            <b>{{ text || `SEE ALL` }}</b>
        </RouterLink>
    </span>
</template>

<script setup lang="ts">
defineProps<{
    route: string
    text?: string
}>()
</script>

<style lang="scss">
.see-all {
    font-size: $medium;
    opacity: 0.75;

    a:hover {
        text-decoration: underline;
    }
}
</style>
