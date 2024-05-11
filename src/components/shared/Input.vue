<template>
    <div class="passinput">
        <input
            :id="props.inputId"
            class="passinput"
            :type="type"
            :placeholder="placeholder"
            @input="$emit('input', ($event.target as HTMLInputElement).value)"
            v-model="value"
        />
        <div
            class="showpass rounded-sm"
            v-if="props.type === 'password'"
            :class="{ show: value.length }"
            @click="toggleShowPassword"
        >
            <EyeSlashSvg v-if="showingPassword" />
            <EyeSvg v-else />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

import EyeSvg from '@/assets/icons/eye.svg'
import EyeSlashSvg from '@/assets/icons/eye.slash.svg'

const props = defineProps<{
    type?: string
    placeholder?: string
    inputId?: string
}>()

const value = ref('')

defineEmits<{
    (e: 'input', value: string): void
}>()

const type = ref(props.type || 'text')
const showingPassword = ref(false)

function toggleShowPassword() {
    type.value = showingPassword.value ? 'password' : 'text'
    showingPassword.value = !showingPassword.value
}
</script>

<style lang="scss">
.passinput {
    position: relative;

    .showpass {
        position: absolute;
        right: $medium;
        top: 50%;
        transform: translateY(-50%);
        display: flex;
        cursor: pointer;
        opacity: 0;

        transition: all 0.2s ease-in-out;
        transition-delay: 0;

        svg {
            width: 1.25rem;
            aspect-ratio: 1;
            color: rgb(184, 184, 184);
        }
    }

    .showpass.show {
        opacity: 1;
        transition-delay: 1s;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        margin: 0.5rem 0;
        border: solid 1px $gray5;
        border-radius: $small;
        border: none;
        background-color: $gray5;
        height: 2.75rem;
        font-size: 1rem;
        padding: 1rem;
        color: $white;

        &:focus {
            outline: solid 2px $white;
        }
    }
}
</style>
