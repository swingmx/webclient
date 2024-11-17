<template>
    <div class="smdropdown buttons" :class="component_key">
        <div class="select rounded-sm">
            <button
                class="selected"
                :class="{ showDropDown }"
                @click.prevent="handleOpener"
                :title="reverse !== 'hide' ? `sort by: ${current.title} ${reverse ? 'Descending' : 'Ascending'}`.toUpperCase() : undefined"
            >
                <span class="ellip">{{ current.title }}</span>
                <ArrowSvg :class="{ reverse }" class="dropdown-arrow" v-if="reverse !== 'hide'" />
            </button>
            <div v-if="showDropDown" ref="dropOptionsRef" class="options rounded no-scroll shadow-lg">
                <div
                    v-for="item in items"
                    :key="item.key"
                    class="option"
                    :class="{ current: current.key == item.key }"
                    @click.prevent="handleClick(item)"
                >
                    {{ item.title }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onClickOutside } from '@vueuse/core'
import { Ref, ref } from 'vue'

import ArrowSvg from '@/assets/icons/arrow.svg'

const showDropDown = ref(false)
const dropOptionsRef: Ref<HTMLElement | undefined> = ref()

interface Item {
    key: string
    title: string
}

defineProps<{
    items: Item[]
    current: Item
    component_key: string
    reverse: boolean | 'hide'
}>()

const emit = defineEmits<{
    (event: 'itemClicked', item: any): void
}>()

const handleOpener = () => {
    showDropDown.value = !showDropDown.value
}

const handleClick = (item: any) => {
    emit('itemClicked', item)
    showDropDown.value = false
}

onClickOutside(dropOptionsRef, e => {
    // @ts-ignore
    e.stopImmediatePropagation()
    showDropDown.value = false
})
</script>

<style lang="scss">
.smdropdown {
    z-index: 1000;

    .dropdown-arrow {
        width: 100%;
        aspect-ratio: 1;
    }

    .selected {
        width: 100%;
        display: grid;
        grid-template-columns: 1fr 2rem;
        gap: $smaller;
        padding-left: $medium;
        padding-right: 0;
        text-transform: uppercase;
        font-size: 12px !important;

        background-color: transparent;
        outline: solid 1px $gray5;

        svg {
            transform: rotate(90deg) scale(0.65);
        }

        svg.reverse {
            transform: rotate(-90deg) scale(0.65);
        }

        &.showDropDown {
            outline: solid 1px $gray2;
        }
    }

    .select {
        position: relative;
        display: flex;
        align-items: center;
        font-size: calc($medium + 2px);
        z-index: 10;

        .options {
            background-color: $gray;
            position: absolute;
            top: 120%;
            padding: $small;
            display: grid;
            width: 100%;
        }

        .option {
            font-weight: 500;
            cursor: pointer;
            padding: $small;
            border-radius: $small;
            transition: background-color 0.2s ease-out;

            &:hover {
                background-color: $gray5;
            }

            &:last-child {
                border-bottom: none;
            }
        }

        .current {
            background-color: $gray4;
        }
    }
}
</style>
