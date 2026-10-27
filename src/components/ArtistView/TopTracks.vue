<template>
    <div class="artist-top-tracks">
        <h3 class="section-title" :class="{ isSmall, isMedium }">
            <div v-if="tabs" class="tabheaders">
                <button
                    v-for="tab in tabs"
                    :key="tab.id"
                    class="tab circular"
                    :class="{ activetab: tab.id === activeTab }"
                    @click="$emit('switchTab', tab.id)"
                >
                    {{ tab.label }}
                </button>
            </div>
            <template v-else>{{ title }}</template>
            <SeeAll :route="route" />
        </h3>
        <div class="tracks" :class="{ isSmall, isMedium }">
            <template v-for="(song, index) in tracks" :key="index">
                <SearchWorkRow
                    v-if="classical && song.classical"
                    :track="song"
                    :index="total ? total - index : index + 1"
                    :is-current="queue.currenttrackhash === song.trackhash"
                    @playThis="playHandler(index)"
                />
                <SongItem
                    v-else
                    :track="song"
                    :index="total ? total - index : index + 1"
                    :source="source"
                    @playThis="playHandler(index)"
                />
            </template>
        </div>
        <NoItems
            v-if="empty"
            :flag="!tracks.length"
            :title="empty.title"
            :description="empty.description"
            :icon="HeartSvg"
        />
        <div v-else-if="!tracks.length" class="error">{{ $t('ArtistView.NoTracks') }}</div>
    </div>
</template>

<script setup lang="ts">
import { dropSources } from '@/enums'
import { Track } from '@/interfaces'
import { isMedium, isSmall } from '@/stores/content-width'
import HeartSvg from '@/assets/icons/heart-no-color.svg'
import NoItems from '../shared/NoItems.vue'
import SeeAll from '../shared/SeeAll.vue'
import SongItem from '../shared/SongItem.vue'
import SearchWorkRow from '@/components/Classical/SearchWorkRow.vue'
import useQueue from '@/stores/queue'

const queue = useQueue()

defineProps<{
    tracks: Track[]
    route: string
    title: string
    playHandler: (index: number) => void
    source: dropSources
    total?: number
    // pills in place of the title, as on the search page
    tabs?: { id: string; label: string }[]
    activeTab?: string
    // movements drawn with the classical row
    classical?: boolean
    // shown in place of the rows when there are none
    empty?: { title: string; description: string }
}>()

defineEmits<{
    (e: 'switchTab', id: string): void
}>()
</script>

<style lang="scss">
.artist-top-tracks {
    padding-top: 1rem;

    .section-title {
        margin-left: 0;
        align-items: baseline;

        .tabheaders {
            font-size: 1rem;
            font-weight: 500;
        }
    }

    .nothing {
        height: auto;
        padding: 2rem 0;
    }

    .section-title.isSmall {
        padding-left: 0.5rem !important;
    }

    .error {
        padding-left: 1rem;
        color: $red;
    }

    h3 {
        display: flex;
        justify-content: space-between;
        padding-left: 1rem !important; // applies to favorite page
        padding-right: $small;

        @media only screen and (max-width: 724px) {
            padding-left: $small !important; // applies to favorite page
        }
    }
}
</style>
