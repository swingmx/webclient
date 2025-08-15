<template>
    <div
        class="artist-info"
        :style="{
            color: !useCircularImage ? (artist.color ? getTextColor(artist.color) : undefined) : undefined,
        }"
    >
        <section class="text">
            <div class="card-title">{{ t('ArtistView.Title') }}</div>
            <div class="artist-name" :class="`${useCircularImage ? 'ellip' : 'ellip2'}`" :title="artist.name">
                {{ artist.name }}
            </div>
            <div class="stats">
                <span v-if="artist.trackcount">
                    {{ artist.trackcount.toLocaleString() }} {{ `${artist.trackcount == 1 ? t('ArtistView.TrackCount') : t('ArtistView.TrackCountPlural')} • ` }}
                </span>
                <span v-if="artist.albumcount">
                    {{ artist.albumcount.toLocaleString() }} {{ `${artist.albumcount == 1 ? t('ArtistView.AlbumCount') : t('ArtistView.AlbumCountPlural')} • ` }}
                </span>
                <span v-if="artist.duration">
                    {{ `${formatSeconds(artist.duration, true)}` }}
                </span>
            </div>
        </section>
        <Buttons :use-circular-image="useCircularImage" />
    </div>
</template>

<script setup lang="ts">
import { getTextColor } from '@/utils/colortools/shift'

import { Artist } from '@/interfaces'
import formatSeconds from '@/utils/useFormatSeconds'
import Buttons from './Buttons.vue'
import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineProps<{
    artist: Artist
    useCircularImage?: boolean
}>()
</script>

<style lang="scss">
.artist-info {
    z-index: 1;
    padding: 1rem;
    padding-right: 0;

    display: flex;
    flex-direction: column;
    justify-content: flex-end;

    gap: 1rem;

    .text {
        display: flex;
        flex-direction: column;
        gap: $small;
    }

    .card-title {
        font-size: small;
        font-weight: 700;
    }

    .artist-name {
        font-size: 3.5rem;
        font-weight: 700;
        word-wrap: break-all;
        margin-left: -1px;
    }

    .stats {
        font-size: small;
        font-weight: 700;
    }
}
</style>
