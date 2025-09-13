<template>
    <FilePicker v-if="showFilePicker" :userhome="userhome" @submitDirs="handleSubmitDirs" @cancel="toggleFilePicker" />
    <div v-else class="rootdirconfig">
        <div class="heading">Configure root directories</div>
        <div class="description">Where do you want to look for music?</div>
        <br />
        <div class="options">
            <div class="option" @click="toggleHomeDir">
                <div>
                    <div class="option-title">Home directory</div>
                    <div class="option-description">
                        Scan all folders in <span class="userhome">{{ userhome }}</span>
                    </div>
                </div>
                <div class="option-selected">
                    <CheckSvg v-if="homeDirSelected" height="1.75rem" />
                </div>
            </div>
            <br />
            <div class="option" @click="toggleFilePicker">
                <div>
                    <div class="option-title">Specific directory</div>
                    <div class="option-description">
                        {{
                            specificDirsSelected
                                ? `${finalRootDirs.length} folder${finalRootDirs.length !== 1 ? 's' : ''} selected`
                                : 'Select folder to scan for music'
                        }}
                    </div>
                </div>
                <div v-show="specificDirsSelected" class="option-selected">
                    <span>Add Folders</span>
                    <CheckSvg v-if="specificDirsSelected" height="1.75rem" />
                </div>
            </div>
        </div>
        <br />
        <div class="btn-container">
            <button class="btn-continue" @click="handleContinue">Continue</button>
        </div>
    </div>
    <div v-if="rootDirs.length > 0 && !homeDirSelected" class="selected-folders rounded-sm">
        <div class="heading">{{ finalRootDirs.length }} Selected Folders</div>
        <div class="folders">
            <div v-for="folder in finalRootDirs" :key="folder" class="folder">
                <FolderSvg />
                {{ folder.startsWith(userhome) ? folder.replace(userhome, '~') : folder }}
                <div class="action" @click="handleRemoveFolder(folder)">
                    <SubtractSvg />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import FilePicker from './FilePicker.vue'
import CheckSvg from '@/assets/icons/check.filled.svg'
import FolderSvg from '@/assets/icons/folder.svg'
import SubtractSvg from '@/assets/icons/subtract.svg'

// SECTION: Props & Emits
const props = defineProps<{
    userhome: string
}>()
const emit = defineEmits<{
    (e: 'setRootDirs', dirs: string[]): void
    (e: 'error', error: string): void
}>()

// SECTION: Properties
const showFilePicker = ref(false)
const rootDirs = ref<string[]>([])
const finalRootDirs = computed(() => {
    if (rootDirs.value.length <= 1) {
        return rootDirs.value
    }

    // Remove duplicates first
    const uniqueDirs = [...new Set(rootDirs.value)]
    
    // Sort directories by length (shortest first) to process parents before children
    const sortedDirs = uniqueDirs.sort((a, b) => a.length - b.length)
    const filteredDirs: string[] = []

    for (const dir of sortedDirs) {
        // Check if this directory is a child of any already selected directory
        const isChild = filteredDirs.some(parentDir => {
            // Ensure parent directory ends with '/' for proper path comparison
            const normalizedParent = parentDir.endsWith('/') ? parentDir : parentDir + '/'
            return dir.startsWith(normalizedParent)
        })

        // Only add if it's not a child of any parent directory
        if (!isChild) {
            filteredDirs.push(dir)
        }
    }

    return filteredDirs
})
const homeDirSelected = computed(() => {
    return finalRootDirs.value.length == 1 && finalRootDirs.value[0] == props.userhome
})
const specificDirsSelected = computed(() => finalRootDirs.value.length && !homeDirSelected.value)

// SECTION: Handlers
function toggleFilePicker() {
    // INFO: Reset root dirs if home dir is selected
    if (homeDirSelected.value) {
        rootDirs.value = []
    }

    showFilePicker.value = !showFilePicker.value
}

function toggleHomeDir() {
    if (homeDirSelected.value) {
        rootDirs.value = []
    } else {
        rootDirs.value = [props.userhome]
    }
}

function handleSubmitDirs(dirs: string[]) {
    rootDirs.value.push(...dirs)
    emit("error", "")
    showFilePicker.value = false
}

function handleRemoveFolder(folder: string) {
    rootDirs.value = rootDirs.value.filter(dir => dir !== folder)
}

function handleContinue() {
    if (!rootDirs.value.length) {
        emit('error', 'Please select a root directory')
        return
    }

    emit('setRootDirs', rootDirs.value)
}
</script>

<style lang="scss">
.rootdirconfig {
    width: 30rem;
    // text-align: center;

    .heading {
        margin-bottom: $smaller;
    }
}

.option {
    padding: 1rem;
    border-radius: $small;
    background-color: $gray5;
    cursor: pointer;

    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 1rem;
    align-items: center;

    &:hover {
        background-color: $gray3;
    }

    .option-selected {
        // width: 1.25rem;
        font-size: 0.8rem;
        font-weight: 500;
        color: $gray1;

        svg {
            color: $green;
        }

        display: flex;
        align-items: center;
        gap: $small;
    }
}

.userhome {
    font-weight: 500;
    font-family: 'SF Mono';
}

.option-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: $smaller;
}

.option-description {
    font-size: 0.8rem;
    font-weight: 500;
}

.options {
    display: flex;
    flex-direction: column;
    gap: $small;
}

.btn-container {
    display: flex;
    justify-content: center;
}

.selected-folders {
    position: absolute;
    top: 34rem;
    width: 100%;

    background-color: $gray;
    padding: $small;
    padding-top: 1rem;

    .folders {
        height: auto;
        max-height: 12rem;
        overflow-y: auto;
    }

    .heading {
        position: absolute;
        top: -2rem;
        font-size: 0.8rem;
        font-weight: 600;
        color: $gray1;
    }

    // font-size: 0.8rem;

    .action {
        opacity: 0.5;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;

        &:hover {
            color: $red;
        }
    }
}
</style>
