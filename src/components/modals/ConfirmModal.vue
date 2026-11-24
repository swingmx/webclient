<template>
    <div class="m-dialog">
        <div class="m-body">{{ text }}</div>
        <footer class="m-footer">
            <button class="m-btn ghost" @click="cancelAction">{{ $t('ConfirmModal.Cancel') }}</button>
            <button class="m-btn destructive" @click="confirmAction">{{ $t('ConfirmModal.Delete') }}</button>
        </footer>
    </div>
</template>

<script setup lang="ts">

defineProps<{
    text: string
    confirmAction: () => void
    cancelAction: () => void
}>()
</script>
