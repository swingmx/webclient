<template>
    <div class="onboarding pad-lg rounded-sm shadow-lg">
        <component
            :is="steps[currentStepIndex].component"
            v-bind="steps[currentStepIndex]?.props?.() ?? {}"
            v-on="steps[currentStepIndex]?.events ?? {}"
        />

        <div v-if="showProgressBar" class="progressbar">
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
import { storeToRefs } from 'pinia'
import { onMounted, ref } from 'vue'
import useModal from '@/stores/modal'
import { router, Routes } from '@/router'
import useInterface from '@/stores/interface'
import { Waiter } from '@/composables/waiter'
import { addRootDirs } from '@/requests/settings/rootdirs'

import ErrorSvg from '@/assets/icons/toast/error.svg'
import Finish from '@/components/Onboarding/Finish.vue'
import Welcome from '@/components/Onboarding/Welcome.vue'
import Account from '@/components/Onboarding/Account.vue'
import RootDirs from '@/components/Onboarding/RootDirs.vue'

const errorText = ref('')
const userhome = ref('')
const showProgressBar = ref(true)
const UI = useInterface()
const { onboardingStep: currentStepIndex } = storeToRefs(UI)

const steps = [
    {
        name: 'welcome',
        component: Welcome,
        events: {
            continue: handleContinue,
        },
    },
    {
        name: 'account',
        component: Account,
        events: {
            accountCreated: handleAccountCreated,
            error: handleError,
        },
    },
    {
        name: 'dirconfig',
        component: RootDirs,
        props: () => ({ userhome: userhome.value }),
        events: {
            setRootDirs: handleRootDirs,
            error: handleError,
        },
    },
    { name: 'finish', component: Finish, events: { finish: handleFinish } },
]

function handleAccountCreated(user_home_path: string) {
    console.log('user_home_path', user_home_path)
    userhome.value = user_home_path
    console.log('userhome', userhome.value)
    currentStepIndex.value++
}

async function handleRootDirs(dirs: string[]) {
    errorText.value = ''
    currentStepIndex.value++
    await addRootDirs(dirs, [])
}

function handleContinue() {
    errorText.value = ''
    currentStepIndex.value++
}

function handleError(error: string) {
    errorText.value = error
}

async function handleFinish() {
    UI.setHideUi(false)
    // INFO: In case the login dialog has been triggered
    useModal().resetModal()
    Waiter.resolve(Waiter.keys.ONBOARDING_COMPLETE)

    return await router.push({
        name: Routes.Home,
    })
}

onMounted(() => {
    const step = router.currentRoute.value.params.step as string

    if (step) {
        currentStepIndex.value = steps.findIndex(s => s.name === step) || 0
        showProgressBar.value = false
    }
})
</script>

<style lang="scss">
.onboarding {
    background-color: $gray;
    // border: solid 1px $gray5;

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
