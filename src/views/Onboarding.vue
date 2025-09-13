<template>
    <div class="onboarding pad-lg rounded-sm">
        <component
            :is="steps[currentStepIndex].component"
            v-bind="steps[currentStepIndex].props ?? {}"
            @continue="handleContinue"
            @account-created="handleAccountCreated"
            @set-root-dirs="handleRootDirs"
            @error="handleError"
        />

        <div class="progressbar">
            <div
                v-for="(step, index) in steps"
                :key="step.name"
                class="dot"
                :class="{ active: index === currentStepIndex, complete: index < currentStepIndex }"
            >
                <div class="dot-inner"></div>
            </div>
        </div>
        <div v-if="errorText" class="errorbox rounded-md">
            <ErrorSvg />
            <div>{{ errorText }}</div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ErrorSvg from '@/assets/icons/toast/error.svg'
import Welcome from '@/components/Onboarding/Welcome.vue'
import Account from '@/components/Onboarding/Account.vue'
import RootDirs from '@/components/Onboarding/RootDirs.vue'

const errorText = ref('')
const currentStepIndex = ref(2)
const userhome = ref('/Users/cwilvx')

const steps = [
    { name: 'welcome', component: Welcome },
    { name: 'account', component: Account },
    { name: 'dirconfig', component: RootDirs, props: { userhome: userhome.value } },
    { name: 'finish' },
]

function handleAccountCreated(user_home_path: string) {
    userhome.value = user_home_path
    currentStepIndex.value++
}

function handleRootDirs(dirs: string[]) {
    console.log(dirs)
    // rootDirs.value = dirs
}

function handleContinue() {
    errorText.value = ''
    currentStepIndex.value++
}

function handleError(error: string) {
    errorText.value = error
}
</script>

<style lang="scss">
.onboarding {
    background-color: $gray;
    // border: solid 1px $gray4;

    height: 30rem;
    width: 50rem;
    position: absolute;
    top: 25rem;
    left: 50%;
    transform: translate(-50%, -50%);

    display: flex;
    align-items: center;
    justify-content: center;

    position: relative;

    // disable selection
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;

    .btn-continue {
        background-color: $blue;
        border-radius: 4rem;
        padding: 1.25rem 2rem;
    }

    .progressbar {
        display: flex;
        gap: $small;
        position: absolute;
        bottom: -2rem;
        left: 50%;
        transform: translateX(-50%);

        .dot {
            width: 0.5rem;
            height: 0.5rem;
            border-radius: 100%;
            background-color: $gray;
        }

        .dot.active {
            background-color: $gray3;
        }
    }

    .errorbox {
        position: absolute;
        width: 100%;
        top: 33.5rem;
        min-height: 1rem;
        left: 50%;
        transform: translateX(-50%);
        color: $red;
        background-color: $gray;
        padding: 1rem;

        display: grid;
        grid-template-columns: 2rem 1fr;
        gap: $small;
        align-items: center;
    }
}
</style>
