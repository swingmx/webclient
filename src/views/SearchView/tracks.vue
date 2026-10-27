<template>
    <div class="search-tracks-view">
        <NoItems
            :title="$t('Common.NoTrackResults')"
            :description="desc"
            :icon="SearchSvg"
            :flag="!results.value.length"
        />
        <div :class="{ isSmall, isMedium }" style="height: 100%">
            <RecycleScroller
                id="songlist-scroller"
                v-slot="{ item, index }"
                style="height: 100%"
                :items="scrollerItems"
                :item-size="64"
                key-field="id"
            >
                <component :is="item.component" v-bind="item.props" @playThis="playFromSearch(index)" />
            </RecycleScroller>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { isMedium, isSmall } from '@/stores/content-width'

import { dropSources } from '@/enums'
import useQueue from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import useSearch from '@/stores/search'

import SearchSvg from '@/assets/icons/search.svg'
import AlbumsFetcher from '@/components/ArtistView/AlbumsFetcher.vue'
import NoItems from '@/components/shared/NoItems.vue'
import SongItem from '@/components/shared/SongItem.vue'
import SearchWorkRow from '@/components/Classical/SearchWorkRow.vue'
import { useT } from '@/i18n'

const { t } = useT()

const props = defineProps<{
    // list the classical movements instead of the other tracks
    movements?: boolean
}>()

const queue = useQueue()
const search = useSearch()
const tracklist = useTracklist()

const results = computed(() => (props.movements ? search.movements : search.tracks))

const desc = computed(() =>
    search.query === '' ? t('Views.SearchView.TypeToSearchTracks') : t('Views.SearchView.ResultsForQuery', {query: search.query})
)

interface scrollerItem {
    id: string | number | undefined
    component: typeof SongItem | typeof SearchWorkRow | typeof AlbumsFetcher
    props: Record<string, any>
}

const scrollerItems = computed(() => {
    const mixed = results.value.value.some(track => track.classical)
    const items: scrollerItem[] = results.value.value.map((track, index) =>
        track.classical
            ? {
                  id: index,
                  component: SearchWorkRow,
                  props: { track, isCurrent: queue.currenttrackhash === track.trackhash },
              }
            : {
                  id: index,
                  component: SongItem,
                  props: {
                      track,
                      index: index + 1,
                      hide_index: mixed,
                      source: dropSources.search,
                  },
              }
    )

    if (results.value.more) {
        items.push({
            // set to random to force re-render
            id: Math.random(),
            component: AlbumsFetcher,
            props: {
                fetch_callback: props.movements ? search.loadMovements : search.loadTracks,
            },
        })
    }

    return items
})

function playFromSearch(index: number) {
    tracklist.setFromSearch(search.query, results.value.value)
    queue.play(index)
}
</script>

<style lang="scss">
.search-tracks-view {
    height: 100%;

    .no-scroll {
        height: 100%;
    }

    #songlist-scroller {
        padding-left: $padleft;
        padding-right: $padright;
        padding-bottom: 4rem;

        @include allPhones {
            padding-left: 1rem;
            padding-right: 1rem;
        }
    }
}
</style>
