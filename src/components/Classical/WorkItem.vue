<template>
    <div class="classicalwork">
        <div class="workmovements" :class="{ numbered }">
            <div v-for="movement in work.movements" :key="movement.movement_title" class="workmovement">
                <TrackItem
                    :track="{
                        ...movement,
                        title: numbered ? (movement.movement_name ?? movement.movement_title) : movement.movement_title,
                    }"
                    :numbered="numbered"
                    :note="movement.arrangement"
                    :is-queue-track="$route.name === Routes.nowPlaying"
                    :is-classical-track="true"
                    :is-current="queue.currenttrack?.trackhash === movement.trackhash"
                    :is-current-playing="queue.currenttrack?.trackhash === movement.trackhash && queue.playing"
                    @playThis="$emit('playThis', movement.trackhash)"
                />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Routes } from '@/router'
import { ClassicalWork } from '@/interfaces'
import TrackItem from '../shared/TrackItem.vue'
import useQueueStore from '@/stores/queue'

const queue = useQueueStore()

defineProps<{
    work: ClassicalWork
    numbered?: boolean
}>()

defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: 'playThis', trackhash: string): void
}>()
</script>

<style lang="scss">
.classicalwork {
    display: flex;
    flex-direction: column;
}

.workmovements.numbered {
    gap: 0;
}

.workmovements {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 0.25rem 1rem 0 0.5rem;
}

.workmovement {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.workmovementtitle {
    font-size: 0.9rem;
    font-weight: 600;
}
</style>
