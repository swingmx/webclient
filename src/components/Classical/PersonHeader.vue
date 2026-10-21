<template>
    <div class="person-header">
        <div class="portrait circular shadow-lg">
            <img v-if="page.image" class="circular" :src="paths.images.artist.large + page.image" />
        </div>
        <div class="info">
            <div class="kicker">
                <span class="kind">{{ page.type === 'composer' ? $t('Views.ComposerView.Composer') : $t('Views.ComposerView.Performer') }}</span>
                <template v-for="part in page.kicker" :key="part">
                    <span class="dot">·</span>
                    <span>{{ part }}</span>
                </template>
            </div>
            <div class="name">{{ page.name }}</div>
            <div v-if="page.nickname || page.years" class="names">
                <span v-if="page.nickname">{{ capitalize(page.nickname) }}</span>
                <span v-if="page.nickname && page.years"> · </span>
                <span v-if="page.years">{{ page.years }}</span>
            </div>
            <div class="chips">
                <span v-for="chip in page.chips" :key="chip" class="chip">{{ chip }}</span>
                <span class="chip">
                    {{ $t('Views.ComposerView.WorksInLibrary', { n: page.work_count }, page.work_count) }}
                </span>
                <span class="chip">
                    {{ $t('Views.ComposerView.AlbumCount', { n: page.album_count }, page.album_count) }}
                </span>
            </div>
            <div class="buttons">
                <button v-wave class="playbtn circular btn-active" @click="$emit('play', false)">
                    <PlaySvg />
                    <div class="text">{{ $t('Views.ComposerView.PlayAll') }}</div>
                </button>
                <button v-wave class="shufflebtn circular" @click="$emit('play', true)">
                    {{ page.type === 'composer' ? $t('Views.ComposerView.ShuffleWorks') : $t('Views.ComposerView.Shuffle') }}
                </button>
                <HeartSvg :state="page.is_favorite ?? false" @handleFav="toggleFavorite" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { paths } from '@/config'
import { favType } from '@/enums'
import favoriteHandler from '@/helpers/favoriteHandler'
import { ClassicalPersonPage } from '@/interfaces'
import useArtistStore from '@/stores/pages/artist'

import HeartSvg from '@/components/shared/HeartSvg.vue'

import PlaySvg from '@/assets/icons/play.svg'

const props = defineProps<{
    page: ClassicalPersonPage
}>()

defineEmits<{
    // eslint-disable-next-line no-unused-vars
    (event: 'play', shuffle: boolean): void
}>()

function toggleFavorite() {
    const store = useArtistStore()
    const person = store.person
    if (!person) return
    favoriteHandler(
        person.is_favorite,
        person.type === 'composer' ? favType.composer : favType.artist,
        person.artisthash,
        () => (person.is_favorite = true),
        () => (person.is_favorite = false)
    )
}

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

</script>

<style lang="scss">
.person-header {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: 4rem;
    align-items: center;
    padding: 2rem 1rem;

    .portrait {
        width: 14rem;
        height: 14rem;
        background-color: $gray4;
        overflow: hidden;

        img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .info {
        display: flex;
        flex-direction: column;
        gap: $small;
        min-width: 0;
    }

    .kicker {
        font-size: 12px;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: $gray1;

        .kind {
            color: $white;
            font-weight: 700;
        }

        .dot {
            margin: 0 $small;
        }
    }

    .name {
        font-size: 3.75rem;
        font-weight: 700;
        line-height: 1.1;
    }

    .names {
        font-family: Georgia, 'Times New Roman', serif;
        font-style: italic;
        font-size: 1.5rem;
        opacity: 0.9;
    }

    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: $small;

        .chip {
            padding: $smaller 0.75rem;
            border: solid 1px $gray3;
            border-radius: 2rem;
            font-size: 0.85rem;
        }
    }

    .buttons {
        display: flex;
        align-items: center;
        gap: $small;
        margin-top: $small;
    }

    .playbtn {
        display: flex;
        align-items: center;
        gap: $smaller;
        padding: 0 1.25rem 0 0.75rem;
        color: $white;

        svg {
            height: 1.75rem;
        }
    }

    .shufflebtn {
        padding: 0 1.25rem;
        background-color: transparent;
        border: solid 1px $gray3;
    }

    @include largePhones {
        grid-template-columns: 1fr;
        gap: 1.5rem;

        .portrait {
            margin: 0 auto;
        }

        .name {
            font-size: 2rem;
        }
    }
}
</style>
