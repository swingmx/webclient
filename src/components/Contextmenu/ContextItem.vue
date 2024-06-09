<template>
    <!-- TODO:  -->
    <div
        ref="parentRef"
        class="context-item"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
        @click="runAction"
    >
        <div
            class="icon image"
            v-html="option.icon"
        ></div>
        <div class="label ellip">{{ option.label }}</div>
        <div
            v-if="hasChildren && !option.singleChild"
            class="more"
            v-html="ExpandIcon"
        ></div>
        <div
            v-if="children"
            ref="childRef"
            class="children rounded shadow-sm"
        >
            <div className="wrapper">
                <div
                    v-for="child in children"
                    :key="child.label"
                    class="context-item"
                    :class="[{ critical: child.critical }, child.type]"
                    @click="child.action && runChildAction(child.action)"
                >
                    <div class="label ellip">
                        {{ child.label }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import {
    createPopper,
    Instance,
    Modifier,
    Placement,
    Rect,
} from '@popperjs/core'
import { computed, ref } from 'vue'

import { contextChildrenShowMode } from '@/enums'
import { ExpandIcon } from '@/icons'
import { Option } from '@/interfaces'

const props = defineProps<{
    option: Option
    childrenShowMode: contextChildrenShowMode
}>()

const emit = defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: 'hideContextMenu'): void
}>()

const showChildrenDelay = 250
const stillWaitingForChildren = ref(false)
const children = ref<Option[] | false>(false)

const childrenShown = ref(false)
const childRef = ref<HTMLElement>()
const parentRef = ref<HTMLElement>()

const hasChildren = computed(() => {
    return (
        props.option.children &&
        props.childrenShowMode === contextChildrenShowMode.hover
    )
})

let popperInstance: Instance | null = null

async function handleMouseEnter() {
    if (!hasChildren.value) return

    stillWaitingForChildren.value = true
    await new Promise((resolve) => setTimeout(resolve, showChildrenDelay))

    if (stillWaitingForChildren.value) {
        showChildren()
    }
}

function handleMouseLeave() {
    if (!hasChildren.value) return
    stillWaitingForChildren.value = false
    hideChildren()
}

async function getChildren() {
    if (!props.option.children) return
    const childs = await props.option.children()

    if (childs) {
        children.value = childs
    }
}

async function showChildren() {
    if (childrenShown.value) {
        childrenShown.value = false
        return
    }

    if (props.option.children) {
        await getChildren()
        // return;
    }

    const offsetModifier: Modifier<
        'offset',
        {
            offset:
                | [number, number]
                | ((args: {
                      placement: Placement
                      reference: Rect
                      popper: Rect
                  }) => [number, number])
        }
    > = {
        name: 'offset',
        options: {
            offset: ({ placement }) => {
                // Correct type for placement automatically inferred
                if (placement.includes('right') || placement.includes('left')) {
                    return [-7, 0]
                }
                return [0, 0]
            },
        },
    }

    popperInstance = createPopper(
        parentRef.value as HTMLElement,
        childRef.value as HTMLElement,
        {
            placement: 'right-start',
            modifiers: [
                {
                    name: 'preventOverflow',
                    options: {
                        altAxis: true,
                        boundariesElement: 'viewport',
                    },
                },
                {
                    name: 'flip',
                    options: {
                        fallbackPlacements: ['left-start', 'auto'],
                        boundariesElement: 'viewport',
                    },
                },
                offsetModifier,
            ],
        }
    )
    childRef.value ? (childRef.value.style.visibility = 'visible') : null
    childRef.value ? (childRef.value.style.opacity = '1') : null
    childrenShown.value = true
}

function hideChildren() {
    childRef.value ? (childRef.value.style.visibility = 'hidden') : null
    childRef.value ? (childRef.value.style.opacity = '0') : null
    popperInstance?.destroy()
    childrenShown.value = false
}

function hideContextMenu() {
    emit('hideContextMenu')
}

function runAction() {
    if (!props.option.singleChild && props.option.children) {
        if (childrenShown.value) {
            hideChildren()
            return
        }

        showChildren()
        return
    }

    props.option.action && props.option.action()
    hideContextMenu()
}

function runChildAction(action: () => void) {
    action()
    emit('hideContextMenu')
}
</script>

<style lang="scss">
.context-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0.4rem;
    position: relative;
    border-radius: $small;
    transition: background-color 0.2s ease-out;

    .more {
        height: 1.5rem;
        width: 1.5rem;
        position: absolute;
        right: 2px;
        bottom: 5px;
        transform: scale(0.65);
    }

    .children {
        position: absolute;
        width: 12rem;
        z-index: 10;
        transform: scale(0);
        background-color: $context;
        padding: $small $smaller;
        border: solid 1px $gray3;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.25s ease-out, visibility 0.25s ease-out;

        ::-webkit-scrollbar-thumb {
            background-color: transparent;
        }

        &:hover ::-webkit-scrollbar-thumb {
            background-color: $gray2;
        }

        &:hover ::-webkit-scrollbar-thumb:hover {
            background-color: $gray1;
        }

        .wrapper {
            padding: 0 $smaller;
            overflow: auto;
            overflow-x: hidden;
            max-height: calc(100vh / 2 - 2rem);
            -webkit-overflow-scrolling: touch;
        }

        .context-item {
            line-height: 1.2;
            padding: $small 1rem;
            padding: 0.4rem 0.6rem;
        }

        .separator {
            padding: 0;
        }
    }

    &:hover {
        background: $darkestblue;
    }

    .icon {
        height: 1.25rem;
        width: 1.25rem;
        margin-right: $small;

        svg {
            height: 100%;
            width: 100%;
        }
    }

    // add to queue icon
    &:nth-child(2) .icon > svg {
        transform: scale(0.85);
    }

    .label {
        width: 9rem;
    }
}
</style>
