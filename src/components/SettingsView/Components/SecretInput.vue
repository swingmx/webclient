<template>
    <form class="secretinput" @submit.prevent="$emit('submit', input)">
        <div class="left rounded-sm no-scroll">
            <input v-model="input" :type="showText ? 'text' : 'password'" :placeholder="placeholder" @input="() => (showTextManual = true)" />
            <button v-if="showHideButton" @click.prevent="showTextManual = !showTextManual">
                <EyeSvg v-if="showText" />
                <EyeSlashSvg v-else />
            </button>
        </div>
        <div class="right">
            <button>{{ buttonText ?? 'Save' }}</button>
        </div>
    </form>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import EyeSvg from '@/assets/icons/eye.svg'
import EyeSlashSvg from '@/assets/icons/eye.slash.svg'

const props = defineProps<{
    text?: string
    placeholder?: string
    buttonText?: string
    showHideButton?: boolean
}>()

const input = ref('')
const showTextManual = ref(false)
const showText = computed(() => {
    if (showTextManual.value) return true

    return input.value.length == 0
})

const showHideButton = computed(() => {
    if (props.showHideButton === undefined) return true
    return props.showHideButton
})

defineEmits<{
    (e: 'submit', value: string): void
}>()

onMounted(() => {
    if (props.text) {
        input.value = props.text
    }
})
</script>

<style lang="scss">
.secretinput {
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 1rem;
    width: 100%;

    .left {
        display: flex;
        align-items: center;
        gap: 1rem;
        position: relative;
        background-color: $gray5;

        input {
            height: 100%;
            width: 100%;
            border: none;
            outline: none;
            background: none;
            padding: $small;
            font-size: 12px;
            font-family: 'SF Mono', monospace;
            color: #ffffff00;
        }

        svg {
            height: 1rem;
        }

        button {
            background: none;
        }
    }

    .right {
        button {
            height: 100% !important;
        }
    }
}
</style>
