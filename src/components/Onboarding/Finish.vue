<template>
    <div class="onboardingfinish">
        <div class="heading">
            <span v-if="isFinished">You're all set! 🎉</span>
            <span v-else>You're almost there!</span>
        </div>
        <div class="description">
            <span v-if="isFinished">Click the button below to continue to your library.</span
            ><span v-else>Swing Music is scanning your music folders. Please wait ...</span>
        </div>
        <br />
        <div class="progress">
            <div class="progress-bar rounded-sm">
                <div
                    class="progress-fill"
                    :style="{
                        width: `${progressPercentage}%`,
                    }"
                ></div>
            </div>
        </div>
        <br />
        <div class="btn-container">
            <button class="btn-continue" :class="{ 'btn-disabled': !isFinished }" @click="emit('finish')">
                Finish
            </button>
        </div>
    </div>
</template>

<script setup lang="ts">
import events from '@/stores/events'
import { getOnboardingData } from '@/requests/auth'
import { onBeforeUnmount, onMounted, ref, computed, watch } from 'vue'

const steps = ref(5)
const currentStep = ref(0.25)
const lastUpdated = ref(Date.now())
const isFinished = computed(() => {
    return currentStep.value === steps.value
})

const progressPercentage = computed(() => {
    return (currentStep.value / steps.value) * 100
})

const emit = defineEmits(['finish'])

function updateProgress(current: number, total: number) {
    if (current > currentStep.value) {
        currentStep.value = current
    }

    if (total !== steps.value) {
        steps.value = total
    }
}

onMounted(() => {
    // INFO: batch is a string like "1/5"
    events.subscribe('scan_batch_cleared', (data: { batch: `${number}/${number}` }) => {
        const [current, total] = data.batch.split('/')
        const currentVal = parseInt(current)
        const totalVal = parseInt(total)

        updateProgress(currentVal, totalVal)
        lastUpdated.value = Date.now()
    })
})

const interval = setInterval(async () => {
    if (Date.now() - lastUpdated.value > 5000) {
        const res = await getOnboardingData()

        if (res.scanMessage) {
            const [current, total] = res.scanMessage.split(':')[1].split('/')
            const currentVal = parseInt(current)
            const totalVal = parseInt(total)
            updateProgress(currentVal, totalVal)
        }
    }
}, 5000)

// Clear interval when finish state is reached
watch(isFinished, finished => {
    if (finished) {
        clearInterval(interval)
    }
})

onBeforeUnmount(() => {
    events.unsubscribe('scan_batch_cleared')
    clearInterval(interval)
})
</script>

<style lang="scss">
.onboardingfinish {
    text-align: center;

    .description {
        color: $gray1;
    }

    .progress {
        width: 26rem;
    }

    .progress-bar {
        background-color: #3a3a3c;
        height: 0.5rem;
        width: 100%;
        overflow: hidden;
        position: relative;
    }

    .progress-fill {
        // background: linear-gradient(to right, #d020f3, #ff0ae6);
        background-color: $blue;
        height: 100%;
        transition: width 0.5s ease-out;
    }
}
</style>
