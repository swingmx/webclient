<template>
    <div class="np-home">
        <Header :source="store.from" />
        <div class="queuetracks">
            <div></div>
            <div class="queue-content">
                <Queue />
            </div>
            <div></div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

import useTracklist from '@/stores/queue/tracklist'
import updatePageTitle from '@/utils/updatePageTitle'

import Header from '@/components/NowPlaying/Header.vue'
import Queue from '@/components/RightSideBar/Queue.vue'

const store = useTracklist()
onMounted(() => updatePageTitle('Now Playing'))
</script>

<style lang="scss">
.np-home {
    display: grid;
    grid-template-columns: 32rem 32rem;
    gap: 4rem;

    .queuetracks {
        display: grid;
        grid-template-rows: 1fr 32rem 1fr;

        .queue-content {
            display: grid;
            grid-template-rows: max-content 1fr;
        }

        // force show remove from queue button
        .track-item {
            .float-buttons {
                opacity: 1;

                .heart-button {
                    opacity: 0;
                }

                .remove-track {
                    opacity: 0.5;

                    svg {
                        color: #fff;
                    }
                }

                .favorited {
                    opacity: 1 !important;
                }
            }

            &:hover {
                .heart-button {
                    opacity: 1 !important;
                }
            }
        }
    }

    #queue-scrollable {
        padding: 1rem 1.5rem 0rem 0 !important;
    }
}
</style>
