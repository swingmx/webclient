<template>
    <div class="artist-top-tracks">
        <h3 class="section-title" :class="{ isSmall, isMedium }">
            {{ title }}
            <SeeAll :route="route" />
        </h3>
        <div class="tracks" :class="{ isSmall, isMedium }">
            <SongItem
                v-for="(song, index) in tracks"
                :key="index"
                :track="song"
                :index="total ? total - index : index + 1"
                :source="source"
                @playThis="playHandler(index)"
            />
        </div>
        <div v-if="!tracks.length" class="error">{{ t('ArtistView.NoTracks') }}</div>
    </div>
</template>

<script setup lang="ts">
import { dropSources } from '@/enums'
import { Track } from '@/interfaces'
import { isMedium, isSmall } from '@/stores/content-width'
import SeeAll from '../shared/SeeAll.vue'
import SongItem from '../shared/SongItem.vue'
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps<{
    tracks: Track[]
    route: string
    title: string
    playHandler: (index: number) => void
    source: dropSources
    total?: number
}>()
</script>

<style lang="scss">
.artist-top-tracks {
    padding-top: 1rem;

    .section-title {
        margin-left: 0;
        align-items: baseline;
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
