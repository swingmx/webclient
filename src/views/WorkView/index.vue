<template>
    <div class="work-virtual-scroller v-scroll-page" :class="{ isSmall }" style="height: 100%">
        <DynamicScroller
            id="work-scroller"
            style="height: 100%"
            class="scroller"
            :min-item-size="64"
            :items="scrollerItems"
        >
            <template #default="{ item, index, active }">
                <DynamicScrollerItem
                    :item="item"
                    :active="active"
                    :size-dependencies="[item.props]"
                    :data-index="index"
                >
                    <component
                        :is="item.component"
                        :key="index"
                        v-bind="item.props"
                        v-on="listenersFor(item)"
                    ></component>
                </DynamicScrollerItem>
            </template>
        </DynamicScroller>
    </div>
</template>

<script setup lang="ts">
import { computed, nextTick } from 'vue'
import { onBeforeRouteUpdate } from 'vue-router'

import useWorkStore from '@/stores/pages/work'
import useQueueStore from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'

import WorkItem from '@/components/Classical/WorkItem.vue'
import WorkPageHeader from '@/components/Classical/WorkPageHeader.vue'
import WorkPerformers from '@/components/Classical/WorkPerformers.vue'
import WorkDetails from '@/components/Classical/WorkDetails.vue'
import CardScroller from '@/components/shared/CardScroller.vue'

import { useT } from '@/i18n'
import { isSmall } from '@/stores/content-width'
import formatSeconds from '@/utils/useFormatSeconds'

const { t } = useT()
const store = useWorkStore()
const queue = useQueueStore()
const tracklist = useTracklist()

interface ScrollerItem {
    id: string
    component: typeof WorkPageHeader | typeof WorkItem | typeof WorkDetails | typeof WorkPerformers | typeof CardScroller
    props?: any
}

const scrollerItems = computed((): ScrollerItem[] => {
    const page = store.work
    const work = store.asWork
    if (!page || !work) return []

    const items: ScrollerItem[] = [
        { id: 'work-header', component: WorkPageHeader, props: { work: page } },
        {
            id: `work-${page.workhash}-${page.recording.albumhash}`,
            component: WorkItem,
            props: { work, hideHeader: true, numbered: true },
        },
    ]

    if (page.dedication || page.year_composed || page.year_published || page.key || page.instruments?.length) {
        items.push({ id: 'work-details', component: WorkDetails, props: { work: page } })
    }

    if (page.recording.performers?.length) {
        items.push({
            id: 'performers',
            component: WorkPerformers,
            props: { performers: page.recording.performers },
        })
    }

    if (page.other_recordings.length) {
        const total = page.recording.movements.length

        items.push({
            id: 'other-recordings',
            component: CardScroller,
            props: {
                title: t('Views.WorkView.OtherRecordings'),
                items: page.other_recordings.map(album => ({
                    type: 'album',
                    item: {
                        ...album,
                        help_text: t('Views.WorkView.Movements', { n: album.movement_count, total }),
                        time: formatSeconds(album.duration, true),
                    },
                })),
            },
        })
    }

    return items
})

function playFromWork(index: number) {
    const page = store.work
    const work = store.asWork
    if (!page || !work) return

    tracklist.setFromWork(page.name, page.workhash, page.recording.albumhash, store.tracks, [work])
    queue.play(index)
}

function listenersFor(item: ScrollerItem) {
    if (item.component === WorkPageHeader) {
        return { playWork: () => playFromWork(0) }
    }

    if (item.component !== WorkItem) return {}

    return {
        playThis: (trackhash: string) => {
            const index = store.tracks.findIndex(t => t.trackhash === trackhash)
            if (index >= 0) playFromWork(index)
        },
        playWork: () => playFromWork(0),
    }
}

onBeforeRouteUpdate(async to => {
    await store.fetchWork(to.params.token.toString(), to.query.albumhash?.toString())
    await nextTick()

    document.getElementById('work-scroller')?.scrollTo({ top: 0 })
})
</script>

<style lang="scss">
.work-virtual-scroller {
    height: 100%;
    overflow: visible;
}
</style>
