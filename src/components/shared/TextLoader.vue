<template>
    <div class="text-loader" :style="{ '--duration': `${duration}ms`, '--fade-duration': `${fadeDuration}ms` }">
        <div
            v-for="(textItem, index) in textItems"
            :key="textItem.key"
            :class="[
                'text-item',
                {
                    'active': index === activeIndex,
                    'prev': index === prevIndex,
                    'slide-up': direction === 'up',
                    'slide-down': direction === 'down'
                }
            ]"
        >
            {{ textItem.text }}
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
    text: string
    direction?: 'up' | 'down'
    duration?: number
    fadeDuration?: number
}>(), {
    direction: 'up',
    duration: 500,
    fadeDuration: 500
})

const textItems = ref<Array<{ text: string; key: number }>>([])
const activeIndex = ref(0)
const prevIndex = ref(-1)
const textKey = ref(0)

watch(
    () => props.text,
    (newText) => {
        if (newText === undefined || newText === null) return

        const currentText = textItems.value[activeIndex.value]?.text
        if (currentText === newText) return

        const isInitialRender = textItems.value.length === 0

        const newTextItem = {
            text: newText,
            key: textKey.value++,
        }

        if (isInitialRender) {
            textItems.value.push(newTextItem)
            activeIndex.value = 0
            prevIndex.value = -1
            return
        }

        prevIndex.value = activeIndex.value
        textItems.value.push(newTextItem)

        if (textItems.value.length > 2) {
            textItems.value.shift()
            prevIndex.value = activeIndex.value - 1
        }

        setTimeout(() => {
            activeIndex.value = textItems.value.length - 1
        }, 10)

        setTimeout(() => {
            if (textItems.value.length > 1) {
                textItems.value = textItems.value.slice(-1)
                activeIndex.value = 0
                prevIndex.value = -1
            }
        }, props.duration)
    },
    { immediate: true }
)
</script>

<style lang="scss">
.text-loader {
    position: relative;
    overflow: hidden;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;

    .text-item {
        position: absolute;
        width: 100%;
        white-space: nowrap;
        opacity: 0;
        transition: transform var(--duration) cubic-bezier(0.68, -0.55, 0.265, 1.55),
                    opacity var(--fade-duration) ease-out;

        &.active {
            opacity: 1;
        }

        &.prev {
            opacity: 0;
        }

        &.slide-up {
            &.active {
                transform: translateY(0);
            }

            &.prev {
                transform: translateY(-100%);
            }

            &:not(.active):not(.prev) {
                transform: translateY(100%);
            }
        }

        &.slide-down {
            &.active {
                transform: translateY(0);
            }

            &.prev {
                transform: translateY(100%);
            }

            &:not(.active):not(.prev) {
                transform: translateY(-100%);
            }
        }
    }
}
</style>

