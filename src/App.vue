<template>
    <ContextMenu v-if="!hideUI" />
    <Modal v-if="!hideUI" />
    <Notification v-if="!hideUI" />
    <div id="drag-img" class="ellip2" style=""></div>
    <section
        v-if="!hideUI"
        id="app-grid"
        :class="{
            useSidebar: settings.use_sidebar && xl,
            NoSideBorders: settings.is_alt_layout || !xxl,
            extendWidth: settings.extend_width && settings.can_extend_width,
            is_alt_layout: settings.is_alt_layout,
        }"
        :style="{
            maxWidth: `${settings.is_default_layout ? (content_height > 1080 ? '2220px' : '1760px') : ''}`,
        }"
    >
        <LeftSidebar v-if="settings.is_default_layout && !isMobile" />
        <NavBar />
        <div id="acontent" v-element-size="updateContentElemSize">
            <div id="contentresizer" ref="appcontent"></div>
            <BalancerProvider>
                <RouterView />
            </BalancerProvider>
        </div>
        <RightSideBar v-if="settings.use_sidebar && xl" />
        <BottomBar />
        <!-- <BubbleManager /> -->
    </section>
    <div v-else id="noui">
        <BalancerProvider>
            <RouterView />
        </BalancerProvider>
    </div>
</template>

<script setup lang="ts">
// @libraries
import { vElementSize } from '@vueuse/components'
import { onStartTyping } from '@vueuse/core'
import { onBeforeMount, onMounted, Ref, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { BalancerProvider } from 'vue-wrap-balancer'

// @stores
import useAuth from '@/stores/auth'
import { content_height, content_width, isMobile, resizer_width, updateCardWidth } from '@/stores/content-width'
import useLyrics from '@/stores/lyrics'
import useModal from '@/stores/modal'
import useQueue from '@/stores/queue'
import useSettings from '@/stores/settings'
import useTracker from '@/stores/tracker'
import useInterface from '@/stores/interface'

// @utils
import handleShortcuts from '@/helpers/useKeyboard'
import { xl, xxl } from './composables/useBreakpoints'

// @small-components
import ContextMenu from '@/components/ContextMenu.vue'
import Modal from '@/components/modal.vue'
import Notification from '@/components/Notification.vue'

// @app-grid-components
import BottomBar from '@/components/BottomBar/BottomBar.vue'
import LeftSidebar from '@/components/LeftSidebar/index.vue'
import NavBar from '@/components/nav/NavBar.vue'
import RightSideBar from '@/components/RightSideBar/Main.vue'

import { getAllSettings } from '@/requests/settings'
import { getRootDirs } from '@/requests/settings/rootdirs'
import { getLoggedInUser } from './requests/auth'
// import BubbleManager from "./components/bubbles/BinManager.vue";

const appcontent: Ref<HTMLLegendElement | null> = ref(null)
const auth = useAuth()
const queue = useQueue()
const modal = useModal()
const lyrics = useLyrics()
const router = useRouter()
const route = useRoute()
const settings = useSettings()
const UIStore = useInterface()
const { hideUI } = storeToRefs(UIStore)
useTracker()

handleShortcuts(useQueue, useModal)

router.afterEach(() => {
    const acontent = document.getElementById('acontent') as HTMLElement

    if (acontent) {
        acontent.scrollTo(0, 0)
    }
})

onStartTyping(() => {
    const elem = document.getElementById('globalsearch') as HTMLInputElement
    elem.focus()
    elem.value = ''
})

function getContentSize() {
    const elem = document.getElementById('acontent') as HTMLElement
    return {
        width: elem.offsetWidth,
        height: elem.offsetHeight,
    }
}

function updateContentElemSize({ width, height }: { width: number; height: number }) {
    // 1572 is the maxwidth of the #acontent. see app-grid.scss > $maxwidth
    const elem_width = appcontent.value?.offsetWidth || 0

    content_width.value = elem_width
    content_height.value = height

    resizer_width.value = elem_width
    updateCardWidth()
}

function handleRootDirsPrompt() {
    getRootDirs().then(dirs => {
        if (dirs.length === 0) {
            modal.showRootDirsPromptModal()
        } else {
            settings.setRootDirs(dirs)
        }
    })
}

const getCookieValue = (name: string) => document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)')?.pop() || ''

onMounted(async () => {
    if (import.meta.env.DEV) {
        const onBoardingData = await useAxios({
            url: paths.api.onboardingData,
            method: 'GET',
        })

        if (onBoardingData.status !== 200) {
            // INFO: What should we do 😱?
            return
        }

        const { adminExists, rootDirsSet, onboardingComplete } = onBoardingData.data
        if (!onboardingComplete) {
            UIStore.setHideUi(true)
            if (!rootDirsSet) {
                UIStore.setOnboardingStep(2)
            }

            if (!adminExists) {
                UIStore.setOnboardingStep(0)
            }

            router.push({
                name: Routes.Onboarding,
            })
        }
    }

    if (UIStore.hideUI) {
        // console.log('waiting for onboarding complete')
        // return
        await Waiter.wait(Waiter.keys.ONBOARDING_COMPLETE, null)
    }

    let path: string = ''
    const splits = window.location.href.split('#')
    if (splits.length > 1) {
        path = splits[1]
    }

    // INFO: If we are stuck on the onboarding page at this point,
    // redirect to the home page
    if (path === '/onboarding') {
        return router.push({
            name: Routes.Home,
        })
    }

    const { width, height } = getContentSize()
    updateContentElemSize({ width, height })

    const res = await getLoggedInUser()

    if (res.status == 200) {
        auth.setUser(res.data)
    } else {
        return
    }

    settings.initializeVolume()
    handleRootDirsPrompt()

    getAllSettings()
        .then(({ settings: data }) => {
            settings.mapDbSettings(data)
        })
        .then(() => {
            if (queue.currenttrack && !settings.use_lyrics_plugin) {
                lyrics.checkExists(queue.currenttrack.filepath, queue.currenttrack.trackhash)
            }
        })
})

onBeforeMount(async () => {
    if (import.meta.env.DEV) {
        return
    }

    const onboardingComplete = getCookieValue('x-onboarding-complete')

    if (!onboardingComplete || onboardingComplete == 'true') {
        return
    }

    UIStore.setHideUi(true)

    const adminExists = getCookieValue('x-admin-exists')
    const rootDirsSet = getCookieValue('x-root-dirs-set')

    if (rootDirsSet == 'false') {
        UIStore.setOnboardingStep(2)
    }

    if (adminExists == 'false') {
        UIStore.setOnboardingStep(0)
    }

    return router.push({
        name: Routes.Onboarding,
    })
})
</script>

<script lang="ts">
// Detect OS & browser agents and add class
import { defineComponent } from 'vue'
import { Routes } from './router'
import { storeToRefs } from 'pinia'
import useAxios from './requests/useAxios'
import { paths } from './config'
import { Waiter } from './composables/waiter'
export default defineComponent({
    name: 'OsAndBrowserSpecificContent',
    mounted() {
        this.applyClassBasedOnAgent()
    },
    methods: {
        applyClassBasedOnAgent() {
            const userAgent = navigator.userAgent
            const isWindows = /Win/.test(userAgent)
            const isLinux = /Linux/.test(userAgent) && !/Android/.test(userAgent)
            const isChrome = /Chrome/.test(userAgent) && /Google Inc/.test(navigator.vendor)
            if ((isWindows || isLinux) && isChrome) {
                document.documentElement.classList.add('designatedOS')
            } else {
                document.documentElement.classList.add('otherOS')
            }
        },
    },
})
</script>

<style lang="scss">
@import './assets/scss/mixins.scss';
.designatedOS .r-sidebar {
    &::-webkit-scrollbar {
        display: none;
    }
}

#noui {
    height: 100vh;
    width: 100vw;
}
</style>
