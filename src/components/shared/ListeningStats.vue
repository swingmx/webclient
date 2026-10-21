<template>
    <div class="listening-stats" :class="variant">
        <div class="group">
            <div v-if="rank" class="card rank">
                <template v-if="variant === 'programme'">
                    <div class="label">{{ rank.of === 'composers' ? $t('Views.Listening.ComposerRank') : $t('Views.Listening.ArtistRank') }}</div>
                    <div class="value serif">
                        {{ rank.position }}<sup>{{ ordinal(rank.position) }}</sup>
                    </div>
                    <div class="sub serif">{{ rankTotal }}</div>
                </template>
                <template v-else>
                    <div class="ghost">{{ rank.position }}</div>
                    <div class="top">
                        {{ rank.of === 'composers' ? $t('Views.Listening.MostPlayedComposers') : $t('Views.Listening.MostPlayedArtists') }}
                    </div>
                    <div class="value">#{{ rank.position }}</div>
                    <div class="sub">{{ rankTotal }}</div>
                </template>
            </div>
            <div class="card">
                <div v-if="variant === 'programme'" class="label">{{ $t('Views.Listening.TimeListened') }}</div>
                <ClockSvg v-else class="icon" />
                <div class="value" :class="{ serif: variant === 'programme' }">{{ time(listening.playduration) }}</div>
                <div class="sub" :class="{ serif: variant === 'programme' }">
                    {{ variant === 'programme' ? $t('Views.Listening.AllTime') : $t('Views.Listening.ListenedAllTime') }}
                </div>
            </div>
            <div class="card">
                <div v-if="variant === 'programme'" class="label">{{ $t('Views.Listening.PlayCount') }}</div>
                <div v-else class="icon play"><PlaySvg /></div>
                <div class="value" :class="{ serif: variant === 'programme' }">
                    {{ $t('Views.Listening.Plays', { n: listening.playcount }, listening.playcount) }}
                </div>
                <div class="sub" :class="{ serif: variant === 'programme' }">
                    {{
                        listening.lastplayed_ago
                            ? $t('Views.Listening.LastPlayed', { ago: listening.lastplayed_ago })
                            : $t('Views.Listening.NotPlayed')
                    }}
                </div>
            </div>
        </div>
        <div class="group wide">
            <component
                :is="album ? 'RouterLink' : 'div'"
                class="card"
                :to="album ? { name: Routes.album, params: { albumhash: album.albumhash } } : undefined"
            >
                <div v-if="variant === 'programme'" class="label">{{ $t('Views.Listening.MostPlayedAlbum') }}</div>
                <Thumb v-else :image="album?.image" />
                <div class="value ellip" :class="{ title: variant === 'programme' }">{{ album?.title ?? '—' }}</div>
                <div v-if="album" class="sub plain">
                    <template v-if="variant === 'programme'">
                        {{ [album.artist, short(album.playduration)].filter(Boolean).join(' · ') }}
                    </template>
                    <template v-else>{{ $t('Views.Listening.TopAlbum', { time: long(album.playduration) }) }}</template>
                </div>
            </component>
            <component
                :is="work ? 'RouterLink' : 'div'"
                v-if="variant === 'programme'"
                class="card"
                :to="work ? { name: Routes.work, params: { token: work.workhash }, query: { albumhash: work.albumhash } } : undefined"
            >
                <div class="label">{{ $t('Views.Listening.MostPlayedWork') }}</div>
                <div class="value title ellip">{{ work ? (work.nickname ? `“${work.nickname}”` : work.name) : '—' }}</div>
                <div v-if="work" class="sub plain">{{ workLine }}</div>
            </component>
            <div v-else class="card">
                <Thumb :image="track?.image" />
                <div class="value ellip">{{ track?.title ?? '—' }}</div>
                <div v-if="track" class="sub">{{ $t('Views.Listening.TopTrack', { time: long(track.playduration) }) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h } from 'vue'

import { paths } from '@/config'
import { useT } from '@/i18n'
import { Listening } from '@/interfaces'
import { Routes } from '@/router'
import formatSeconds from '@/utils/useFormatSeconds'

import ClockSvg from '@/assets/icons/clock.svg'
import PlaySvg from '@/assets/icons/play.svg'

const props = defineProps<{
    listening: Listening
    // programme: classical pages; hero: artist pages
    variant: 'programme' | 'hero'
}>()

const { t } = useT()

const rank = computed(() => props.listening.rank)
const album = computed(() => props.listening.top_album)
const track = computed(() => props.listening.top_track)
const work = computed(() => props.listening.top_work)

const rankTotal = computed(() => {
    const total = rank.value?.total ?? 0
    return rank.value?.of === 'composers'
        ? t('Views.Listening.OfComposers', { n: total }, total)
        : t('Views.Listening.OfArtists', { n: total }, total)
})

/**
 * The work's name and catalogue number when the nickname is the title,
 * else the catalogue number, then the time listened.
 */
const workLine = computed(() => {
    if (!work.value) return ''
    const id = work.value.nickname ? [work.value.name, work.value.catalogue].filter(Boolean).join(', ') : work.value.catalogue
    return [id, short(work.value.playduration)].filter(Boolean).join(' · ')
})

const Thumb = defineComponent({
    props: { image: { type: String, default: null } },
    setup: thumb => () =>
        thumb.image
            ? h('img', { class: 'thumb rounded-sm', src: paths.images.thumb.small + thumb.image })
            : h('div', { class: 'thumb empty rounded-sm' }),
})

function ordinal(n: number) {
    const tens = n % 100
    if (tens >= 11 && tens <= 13) return 'th'
    return ['th', 'st', 'nd', 'rd'][n % 10] ?? 'th'
}

function short(seconds: number) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return hours
        ? t('Views.Listening.ShortTime', { h: hours, m: minutes })
        : t('Views.Listening.ShortMinutes', { m: minutes })
}

function long(seconds: number) {
    return formatSeconds(seconds, true)
}

function time(seconds: number) {
    return props.variant === 'programme' ? short(seconds) : long(seconds)
}
</script>

<style lang="scss">
// left group at the start, right group at the end, at least 3rem apart
.listening-stats {
    display: flex;
    justify-content: space-between;
    gap: 3rem;
    padding: 2rem 1rem 1rem;
    overflow-x: auto;

    .group {
        display: flex;
        gap: 1rem;
    }

    .card {
        position: relative;
        flex-shrink: 0;
        width: 13rem;
        height: 10.5rem;
        padding: 1.5rem;
        border-radius: 1rem;
        background-color: #221f1d;
        color: inherit;
        overflow: hidden;
    }

    .wide .card {
        width: 15.5rem;
    }

    .serif {
        font-family: Georgia, 'Times New Roman', serif;
    }

    // centred small caps over a hairline rule, like a printed programme
    &.programme {
        .card {
            display: flex;
            flex-direction: column;
            align-items: center;
            text-align: center;
        }

        .label {
            font-size: 0.75rem;
            letter-spacing: 0.18em;
            text-transform: uppercase;
            color: $gray1;

            &::after {
                content: '';
                display: block;
                width: 1.75rem;
                height: 1px;
                margin: 0.75rem auto 0;
                background-color: $gray3;
            }
        }

        .value {
            margin: auto 0;
            max-width: 100%;
            font-size: 2rem;

            sup {
                font-size: 0.6em;
                font-style: italic;
                margin-left: 2px;
            }

            &.title {
                font-family: Georgia, 'Times New Roman', serif;
                font-style: italic;
                font-size: 1.6rem;
            }
        }

        .rank .value {
            font-size: 3rem;
        }

        .sub {
            font-style: italic;
            color: $gray1;

            &.plain {
                font-style: normal;
                font-size: 0.9rem;
                color: $gray1;
            }
        }
    }

    // bold figures low in the card, with a faded giant rank numeral
    &.hero {
        .card {
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
        }

        .top {
            position: absolute;
            top: 1.5rem;
            left: 1.5rem;
            font-weight: 600;
            font-size: 0.95rem;
        }

        .ghost {
            position: absolute;
            right: -0.5rem;
            bottom: -2.5rem;
            font-size: 11rem;
            font-weight: 800;
            line-height: 1;
            color: rgba(255, 255, 255, 0.03);
            pointer-events: none;
        }

        .icon,
        .thumb {
            position: absolute;
            top: 1.5rem;
            left: 1.5rem;
        }

        .icon {
            width: 1.75rem;
            height: 1.75rem;
            opacity: 0.6;
        }

        .icon.play {
            display: grid;
            place-items: center;
            border: solid 2px $white;
            border-radius: 50%;

            svg {
                width: 0.9rem;
                height: 0.9rem;
            }
        }

        .thumb {
            width: 3rem;
            height: 3rem;
            object-fit: cover;

            &.empty {
                background: repeating-linear-gradient(135deg, $gray4 0 6px, $gray5 6px 12px);
            }
        }

        .value {
            font-size: 1.5rem;
            font-weight: 700;
        }

        .rank .value {
            font-size: 3.5rem;
            font-weight: 800;
        }

        .sub {
            margin-top: $smaller;
            color: $gray1;
            font-size: 14px;
        }
    }
}
</style>
