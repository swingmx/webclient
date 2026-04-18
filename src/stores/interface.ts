import { Ref } from 'vue'
import useQueue from './queue'
import { defineStore } from 'pinia'

export default defineStore('interfaceStore', {
    state: () => ({
        queueScrollFunction: (index: number) => {},
        mousover: <Ref | null>null,
        hideUI: false,
        onboardingStep: 0,
    }),
    actions: {
        focusCurrentInSidebar(timeout = 500) {
            const { currentindex } = useQueue()
            if (!this.mousover) {
                setTimeout(() => {
                    this.queueScrollFunction(currentindex - 1)
                }, timeout)
            }
        },
        setScrollFunction(cb: (index: number) => void, mousover: Ref<boolean> | null) {
            this.queueScrollFunction = cb
            this.mousover = mousover
        },
        setHideUi(hide: boolean) {
            this.hideUI = hide
        },
        setOnboardingStep(step: number) {
            this.onboardingStep = step
        },
    },
})
