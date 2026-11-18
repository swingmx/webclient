<template>
    <div class="np-home">
        <Header :source="store.from" />
        <div class="queuetracks">
            <div></div>
            <div class="queue-content">
                <Queue grip />
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
import { useT } from '@/i18n'

const { t } = useT()
const store = useTracklist()

onMounted(() => updatePageTitle(t('Common.NowPlaying')))
</script>

<style lang="scss">
.np-home {
    position: relative;
    display: grid;
    grid-template-columns: min(32rem, 45%) min(32rem, 45%);
    gap: 4rem;
    height: 100%;
    place-content: center;
    $gap: $smaller;

    @include allPhones {
        gap: 2rem;
    }

    @include largePhones {
        display: block;
        overflow: auto;
        padding-bottom: 2rem;
        @include hideScrollbars;
    }

    .queuetracks {
        display: grid;
        grid-template-rows: 1fr calc(32rem - $gap) 1fr;

        .queue-content {
            display: grid;
            grid-template-rows: max-content 1fr;
            gap: $smaller;
        }

        // force show remove from queue button
        .queue-work-head .remove,
        .queue-movement .remove {
            opacity: 0.6;
        }

        .queue-virtual-scroller {
            margin-left: calc(-1rem - #{$small});
        }
    }

    #queue-scrollable {
        padding: 32px 0.5rem 64px 0 !important;
        mask-image: linear-gradient(to bottom, transparent, #000 32px, #000 calc(100% - 64px), transparent);
        -webkit-mask-image: linear-gradient(to bottom, transparent, #000 32px, #000 calc(100% - 64px), transparent);

        @include largePhones {
            padding: 1rem 1rem 64px 1rem !important;
            @include hideScrollbars;
        }
    }
}
</style>
