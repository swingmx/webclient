<template>
    <div class="freenuminput rounded-sm">
        <div class="spinner" v-if="loading"></div>
        <input type="number" :value="props.value" @change="handleInput" />
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/stores/notification'

const toast = useToast()

const props = defineProps<{
    value: number
    callback: (newValue: number) => Promise<boolean>
}>()

const loading = ref(false)

function handleInput(e: Event) {
    const newValue = (e.target as HTMLInputElement).valueAsNumber

    if (Number.isNaN(newValue)) {
        return toast.showError('Invalid number')
    }

    if (newValue) {
        submit(newValue)
    }
}

async function submit(newValue: number) {
    const success = await props.callback(newValue)

    if (success) {
        toast.showSuccess('Updated!')
    } else {
        toast.showError('Failed to update')
    }
}
</script>

<style lang="scss">
.freenuminput {
    height: 2rem;
    border: solid 1px $gray4;
    position: relative;

    input {
        width: 4rem !important;
        border: none;
        outline: none;
        background-color: transparent;
        text-align: center;
        height: 100%;
    }

    .spinner {
        position: absolute;
        left: -2rem;
        top: 6px;

        border-color: $gray5;
        border-top-color: #fff;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }

    /* Firefox */
    input[type='number'] {
        -moz-appearance: textfield;
    }
}
</style>
