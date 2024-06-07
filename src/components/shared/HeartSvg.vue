<template>
    <button
        v-wave
        class="heart-button circular"
        :style="{
            color: color ? getTextColor(color) : '',
        }"
        @click="!no_emit && $emit('handleFav')"
    >
        <Motion
            :initial="{
                opacity: 0,
            }"
            :animate="{
                opacity: 1,
                transition: {
                    delay: 0.25,
                    duration: 0.5,
                },
            }"
        >
            <HeartFillSvg v-if="state" />
            <HeartSvg v-else />
        </Motion>
    </button>
</template>

<script setup lang="ts">
import { Motion } from "motion/vue";

import HeartFillSvg from "@/assets/icons/heart.fill.svg";
import HeartSvg from "@/assets/icons/heart.svg";

import { getTextColor } from "@/utils/colortools/shift";

defineProps<{
    state: Boolean | undefined;
    no_emit?: Boolean;
    color?: string;
}>();

defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: "handleFav"): void;
}>();
</script>

<style lang="scss">
$bg: rgb(255, 255, 255);

.heart-button {
    line-height: normal;
    align-items: center;
    gap: $smaller;
    border: none;
    color: $bg;
    aspect-ratio: 1.5;
    background: rgba(255, 255, 255, 0.13);

    div {
        height: max-content;
        transform: scale(1);

        svg {
            height: 1.5rem;
            display: block;
        }
    }

    &:hover {
        background: transparent;
        border: none;
    }
}
</style>
