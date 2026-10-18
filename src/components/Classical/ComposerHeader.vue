<template>
    <div class="composer-header">
        <div class="portrait circular shadow-lg">
            <img v-if="composer.image" class="circular" :src="paths.images.artist.large + composer.image" />
        </div>
        <div class="info">
            <div class="kicker">
                <span class="kind">{{ $t('Views.ComposerView.Composer') }}</span>
                <template v-for="part in kicker" :key="part">
                    <span class="dot">·</span>
                    <span>{{ part }}</span>
                </template>
            </div>
            <div class="name">{{ composer.name }}</div>
            <div v-if="composer.nickname || years" class="names">
                <span v-if="composer.nickname">{{ capitalize(composer.nickname) }}</span>
                <span v-if="composer.nickname && years"> · </span>
                <span v-if="years">{{ years }}</span>
            </div>
            <div class="chips">
                <span v-for="occupation in composer.occupations ?? []" :key="occupation" class="chip">
                    {{ capitalize(occupation) }}
                </span>
                <span class="chip">
                    {{ $t('Views.ComposerView.WorksInLibrary', { n: composer.work_count }, composer.work_count) }}
                </span>
                <span class="chip">
                    {{ $t('Views.ComposerView.AlbumCount', { n: composer.album_count }, composer.album_count) }}
                </span>
            </div>
            <div class="buttons">
                <button v-wave class="playbtn circular btn-active" @click="store.play(composer.composerhash, composer.name)">
                    <PlaySvg />
                    <div class="text">{{ $t('Views.ComposerView.PlayAll') }}</div>
                </button>
                <button
                    v-wave
                    class="shufflebtn circular"
                    @click="store.play(composer.composerhash, composer.name, true)"
                >
                    {{ $t('Views.ComposerView.ShuffleWorks') }}
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { paths } from '@/config'
import { ComposerPage } from '@/interfaces'
import useComposerStore from '@/stores/pages/composer'

import PlaySvg from '@/assets/icons/play.svg'

const props = defineProps<{
    composer: ComposerPage
}>()

const store = useComposerStore()

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}

const kicker = computed(() => [props.composer.epoch, props.composer.birthplace].filter(Boolean) as string[])

const years = computed(() => {
    const born = props.composer.birth?.slice(0, 4)
    const died = props.composer.death?.slice(0, 4)
    if (!born && !died) return ''
    return `${born ?? '?'} – ${died ?? ''}`.trim()
})
</script>

<style lang="scss">
.composer-header {
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
