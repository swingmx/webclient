<template>
    <div class="file-picker">
        <div class="input-container">
            <div class="head">
                <button class="btn-back" @click="$emit('cancel')">
                    <ArrowLeftSvg height="1.2rem" />
                </button>
                <div>
                    <div class="breadcrumb">
                        <div
                            v-for="path in subPaths"
                            :key="path.path"
                            class="bitem"
                            @click="() => fetchFolders(path.path)"
                        >
                            {{ path.name }}
                        </div>
                    </div>
                </div>
                <span
                    ><button
                        class="btn-finish"
                        @click="
                            $emit(
                                'submitDirs',
                                Array.from(selectedFolders.values()).map(index => folders[index].path)
                            )
                        "
                    >
                        Continue
                    </button></span
                >
            </div>
        </div>

        <div class="folders">
            <div
                v-for="(folder, index) in renderedFolders"
                :key="folder.path"
                class="folder"
                :class="{
                    selected: selectedFolders.has(index),
                    'selected-first': selectedFolders.has(index) && isFirstSelected(index),
                    'selected-last': selectedFolders.has(index) && isLastSelected(index),
                }"
                @click.exact="handleSelect(index, false, false)"
                @click.meta="handleSelect(index, false, true)"
                @click.ctrl="handleSelect(index, false, true)"
                @click.shift="handleSelect(index, true, false)"
                @dblclick="fetchFolders(folder.path)"
            >
                <FolderSvg />
                <span>{{ folder.name }}</span>
            </div>
        </div>
        <div class="help rounded-sm">
            <div class="help-content">
                <InfoSvg />
                <span>Use (⌘/Ctrl or Shift) + Click to select multiple folders</span>
            </div>
            <span>{{ selectedFolders.size }} Selected</span>
        </div>
    </div>
</template>

<!-- TODO: Handle duplicates on final root dirs -->
<!-- TODO: Clear Errors on setting root dirs -->
<!-- TODO: Work on breadcrumb -->

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import Input from '../shared/Input.vue'
import { getFolders } from '@/requests/settings/rootdirs'
import FolderSvg from '@/assets/icons/folder.svg'
import AddSvg from '@/assets/icons/add.svg'
import SubtractSvg from '@/assets/icons/subtract.svg'
import ArrowLeftSvg from '@/assets/icons/arrow.svg'
import InfoSvg from '@/assets/icons/info.svg'
import { Folder } from '@/interfaces'
import { createSubPaths } from '@/utils'

const props = defineProps<{
    userhome: string
}>()

defineEmits<{
    (e: 'submitDirs', dirs: string[]): void
    (e: 'cancel'): void
}>()

const currentPath = ref<string>('')
const folders = ref<Folder[]>([])
const subPaths = computed(() => {
    return createSubPaths(currentPath.value, '')[1]
})
const renderedFolders = computed(() => {
    const first2 = [...folders.value]

    if (first2.length >= 2) {
        first2[0].name = '↑'
        first2[1].name = '. (this folder)'
    }

    return first2
})

const lastSelectedIndex = ref<number>(-1)
const selectedFolders = ref<Set<number>>(new Set())

function isFirstSelected(index: number): boolean {
    if (!selectedFolders.value.has(index)) return false
    const previousIndex = index - 1
    return previousIndex < 0 || !selectedFolders.value.has(previousIndex)
}

function isLastSelected(index: number): boolean {
    if (!selectedFolders.value.has(index)) return false
    const nextIndex = index + 1
    return nextIndex >= renderedFolders.value.length || !selectedFolders.value.has(nextIndex)
}

async function fetchFolders(folder: string) {
    const results = await getFolders(folder)
    folders.value = results
    currentPath.value = folder
    selectedFolders.value.clear()
    lastSelectedIndex.value = -1
}

function handleSelect(index: number, shift: boolean, ctrl: boolean) {
    // INFO: Handle shift - range selection
    if (shift) {
        // INFO: Handle selection of parent and current folder
        // INFO: .. and . folder should only be selected alone
        // INFO: Handle selection from ../. to folder N
        if (lastSelectedIndex.value <= 1) {
            lastSelectedIndex.value = 2
            selectedFolders.value = new Set([2])
        }

        // INFO: Handle selection from folder N to parent
        if (index <= 1) {
            selectedFolders.value = new Set([lastSelectedIndex.value])
            index = 2
        }

        // Select range from last selected to current
        const start = Math.min(lastSelectedIndex.value, index)
        const end = Math.max(lastSelectedIndex.value, index)

        for (let i = start; i <= end; i++) {
            selectedFolders.value.add(i)
        }

        lastSelectedIndex.value = index
        return
    }

    // INFO: Handle ctrl - toggle selection
    if (ctrl) {
        if (index <= 1) {
            selectedFolders.value = new Set([index])
            lastSelectedIndex.value = index
            return
        }

        if (selectedFolders.value.has(0) || selectedFolders.value.has(1)) {
            selectedFolders.value = new Set([index])
            lastSelectedIndex.value = index
            return
        }

        if (selectedFolders.value.has(index)) {
            selectedFolders.value.delete(index)
        } else {
            selectedFolders.value.add(index)
        }

        lastSelectedIndex.value = index
        return
    }

    // INFO: Handle regular click - single selection
    selectedFolders.value.clear()
    selectedFolders.value.add(index)
    lastSelectedIndex.value = index
}

onMounted(async () => {
    currentPath.value = props.userhome

    await fetchFolders(props.userhome)
})
</script>

<style lang="scss">
.file-picker {
    width: 100%;
    height: 100%;

    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: max-content 1fr max-content;
    position: relative;
    gap: $small;

    .breadcrumb {
        display: flex;
        flex-direction: row;
        gap: $small;
        font-weight: 500;
        font-size: 0.8rem;

        .bitem {
            color: rgb(155, 154, 154);
            position: relative;
            cursor: pointer;
            // outline: solid 1px;
        }

        .bitem:last-child {
            color: $blue;
            cursor: default;

            &::after {
                display: none;
            }
        }

        .bitem::after {
            content: '/';
            margin-right: $small;
            color: $gray2;
            font-size: 0.8rem;
            font-weight: 500;
            cursor: default;

            position: absolute;
            // center the before vertical
            top: 50%;
            right: -0.9rem;
            transform: translateY(-50%);
        }
    }

    .head {
        margin-bottom: $small;
        font-size: 1rem;
        font-weight: 600;

        display: grid;
        grid-template-columns: max-content 1fr max-content;
        align-items: center;
        gap: 1rem;

        button {
            font-size: 0.8rem;
        }
    }

    .help {
        display: flex;
        align-items: center;
        justify-content: space-between;
        // margin: $small $small;
        font-size: 0.65rem;

        .help-content {
            display: flex;
            align-items: center;
            gap: $small;
        }

        background-color: transparent;
        padding: $small;
        margin-bottom: -$small;
        color: $gray1;

        svg {
            height: 0.75rem;
        }
    }

    .folder:nth-child(2),
    .folder:first-child {
        font-size: 0.7rem;
        color: $gray1;

        svg {
            color: #fff;
        }
    }

    .folder:nth-child(2) {
        font-style: italic;
    }
}

.folders {
    display: flex;
    flex-direction: column;
    height: 100%;
    width: calc(100% + $small);
    overflow-y: auto;
    margin-left: $smaller;

    .folder {
        display: grid;
        grid-template-columns: max-content 1fr max-content;
        align-items: center;
        gap: $small;
        padding: $small;
        cursor: default;
        border-radius: $smaller;
        font-size: 0.9rem;
        font-weight: 500;

        // disable select
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;

        width: calc(100% - 1rem);

        &:hover {
            background-color: $gray5;

            .action {
                opacity: 1;
            }
        }
    }

    .folder.selected {
        background-color: $darkblue;
        border-radius: 0;
    }

    .folder.selected-first {
        border-top-left-radius: $small;
        border-top-right-radius: $small;
    }

    .folder.selected-last {
        border-bottom-left-radius: $small;
        border-bottom-right-radius: $small;
    }

    svg {
        height: 1.2rem;
    }
}
</style>
