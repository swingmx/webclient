<template>
    <div v-if="page" class="content-page classical-home">
        <GenericHeader>
            <template #name>{{ $t('Views.ClassicalHome.Title') }}</template>
            <template #description>{{ $t('Views.ClassicalHome.Description') }}</template>
            <template #right>
                <div class="stats">
                    <span class="chip">{{ $t('Views.ClassicalHome.Albums', { n: page.album_count }, page.album_count) }}</span>
                    <span class="chip">{{ $t('Views.ClassicalHome.Tracks', { n: page.track_count }, page.track_count) }}</span>
                    <span v-if="page.seconds_listened" class="chip">
                        {{ $t('Views.ClassicalHome.Listened', { time: formatSeconds(page.seconds_listened, true) }) }}
                    </span>
                </div>
            </template>
        </GenericHeader>

        <section v-if="page.continue_listening.length">
            <div class="heading">{{ $t('Views.ClassicalHome.ContinueListening') }}</div>
            <div class="continue">
                <div v-for="item in page.continue_listening" :key="item.workhash" class="resume rounded-sm">
                    <img v-if="item.image" :src="paths.images.thumb.medium + item.image" />
                    <div class="text">
                        <div class="composer ellip">{{ item.composer }}</div>
                        <RouterLink
                            :to="{ name: Routes.work, params: { token: item.workhash }, query: { albumhash: item.albumhash } }"
                            class="name ellip"
                        >
                            {{ item.title }}
                        </RouterLink>
                        <div class="album ellip">{{ item.album }}</div>
                    </div>
                    <button class="resumebtn circular" @click="resume(item)"><PlaySvg /></button>
                </div>
            </div>
        </section>

        <CardScroller
            v-if="page.albums.length"
            :title="$t('Views.ClassicalHome.AlbumsTitle')"
            :items="page.albums.map(album => ({ type: 'album', item: album }))"
            route="/classical/albums"
        />

        <div :class="{ 'two-columns': showFavorites }">
            <WorkList
                v-if="page.recently_added.length"
                artisthash=""
                :title="$t('Views.ClassicalHome.RecentlyAdded')"
                :works="showFavorites ? page.recently_added.slice(0, SIDE_BY_SIDE_ROWS) : page.recently_added"
                :columns="showFavorites ? 1 : 2"
                :filters="[]"
                filter-key=""
                :filter="null"
                :show-composer="true"
                :more-to="{ name: Routes.classicalWorks, query: { sort: 'added' } }"
            />
            <WorkList
                v-if="showFavorites"
                artisthash=""
                :title="$t('Views.ClassicalHome.FavoriteWorks')"
                :works="page.favorite_works"
                :filters="[]"
                filter-key=""
                :filter="null"
                :show-composer="true"
                :more-to="{ name: Routes.favoriteWorks }"
            />
        </div>

        <CardScroller
            v-if="page.composers.length"
            :title="$t('Views.ClassicalHome.Composers')"
            :items="page.composers.map(composer => ({ type: 'artist', item: composer }))"
            route="/classical/composers"
        />

        <section v-if="page.eras.length">
            <div class="heading">{{ $t('Views.ClassicalHome.BrowseByEra') }}</div>
            <div class="tiles eras">
                <RouterLink
                    v-for="era in page.eras"
                    :key="era.slug"
                    :to="{ name: Routes.classicalWorks, query: { era: era.slug } }"
                    class="tile rounded-sm"
                >
                    <div class="range">{{ eraRange(era) }}</div>
                    <div class="serif name">{{ era.name }}</div>
                    <div class="detail">{{ era.composers }}</div>
                </RouterLink>
            </div>
        </section>

        <section v-if="page.instruments.length">
            <div class="heading">{{ $t('Views.ClassicalHome.BrowseByInstrument') }}</div>
            <div class="chips">
                <RouterLink
                    v-for="instrument in page.instruments"
                    :key="instrument.slug"
                    :to="{ name: Routes.classicalWorks, query: { instrument: instrument.slug } }"
                    class="chip"
                >
                    <span class="serif">{{ instrument.name }}</span>
                    <span class="count">{{ $t('Views.ComposerView.WorkCount', { n: instrument.count }, instrument.count ?? 0) }}</span>
                </RouterLink>
            </div>
        </section>

        <section v-if="page.work_types.length">
            <div class="heading">{{ $t('Views.ClassicalHome.BrowseByType') }}</div>
            <div class="tiles types">
                <RouterLink
                    v-for="type in page.work_types"
                    :key="type.slug"
                    :to="{ name: Routes.classicalWorks, query: { type: type.slug } }"
                    class="tile rounded-sm"
                >
                    <div class="name">{{ type.name }}</div>
                    <div class="detail">{{ type.subtitle }}</div>
                </RouterLink>
            </div>
        </section>

        <WorkList
            v-if="page.returned_to.length"
            artisthash=""
            :title="$t('Views.ClassicalHome.ReturnTo')"
            :works="page.returned_to"
            :filters="[]"
            filter-key=""
            :filter="null"
            :show-composer="true"
        />

        <PeopleGrid
            v-if="page.performers.length"
            :title="$t('Views.ClassicalHome.Performers')"
            :people="page.performers.map(p => ({ name: p.name, artisthash: p.artisthash, detail: p.roles }))"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { paths } from '@/config'
import { useT } from '@/i18n'
import { ClassicalHomePage, ClassicalHomeTile, ContinueItem } from '@/interfaces'
import { getClassicalHome, getWork } from '@/requests/classical'
import { maxAbumCards, updateCardWidth } from '@/stores/content-width'
import { Routes } from '@/router'
import useQueue from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import formatSeconds from '@/utils/useFormatSeconds'
import updatePageTitle from '@/utils/updatePageTitle'

import PlaySvg from '@/assets/icons/play.svg'
import PeopleGrid from '@/components/Classical/PeopleGrid.vue'
import WorkList from '@/components/Classical/WorkList.vue'
import CardScroller from '@/components/shared/CardScroller.vue'
import GenericHeader from '@/components/shared/GenericHeader.vue'

// favorite works show beside recently added only when they fill the column
const FAVORITES_MIN = 5
const SIDE_BY_SIDE_ROWS = 5

const { t } = useT()
const page = ref<ClassicalHomePage | null>(null)
const showFavorites = computed(() => (page.value?.favorite_works.length ?? 0) >= FAVORITES_MIN)


function eraRange(era: ClassicalHomeTile) {
    const start = era.start ?? ''
    const end = era.end ?? t('Views.ClassicalHome.Today')
    return era.start ? `${start}–${end}` : `–${end}`
}

/**
 * Play the work's recording from the movement last heard.
 */
async function resume(item: ContinueItem) {
    const work = await getWork(item.workhash, item.albumhash ?? undefined)
    if (!work) return
    const tracks = work.recording.movements
    const { recording, other_recordings, ...header } = work
    useTracklist().setFromWork(work.name, work.workhash, recording.albumhash, tracks, [
        { ...header, movements: tracks },
    ])
    const index = tracks.findIndex(track => track.trackhash === item.trackhash)
    useQueue().play(Math.max(index, 0))
}

onMounted(async () => {
    updatePageTitle(t('Views.ClassicalHome.Title'))
    updateCardWidth()
    page.value = await getClassicalHome(maxAbumCards.value + 2)
})
</script>

<style lang="scss">
.classical-home {
    height: 100%;
    overflow: auto;
    padding-bottom: 4rem;

    .stats,
    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: $small;
    }

    .chip {
        padding: $smaller 0.75rem;
        border: solid 1px $gray3;
        border-radius: 2rem;
        font-size: 0.85rem;
        color: inherit;

        .count {
            margin-left: $small;
            color: $gray1;
        }
    }

    section {
        padding: 2rem 0 1rem 0.75rem;
    }

    .heading {
        font-size: 1.15rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    .cardscroller {
        padding: 2rem 0 1rem 0;
    }

    .work-list .row.no-year {
        margin-left: -0.75rem;
    }

    .work-list .title {
        font-size: 1.15rem;
    }

    .serif {
        font-family: Georgia, 'Times New Roman', serif;
        font-style: italic;
    }

    // one full row: at least 3 cards, more as the width allows, the rest hidden
    .continue {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(22rem, calc((100% - 2rem) / 3)), 1fr));
        grid-template-rows: auto;
        grid-auto-rows: 0;
        column-gap: 1rem;
        row-gap: 0;
        overflow: hidden;
    }

    .resume {
        display: grid;
        grid-template-columns: 5rem 1fr max-content;
        align-items: center;
        gap: 0.75rem;
        padding: 0.85rem;
        background-color: rgb(18, 18, 18);
        border-radius: 0.85rem;
        border: solid 0.5px #252525;

        img {
            width: 5rem;
            height: 5rem;
            object-fit: cover;
            border-radius: 0.55rem;
        }

        .text {
            min-width: 0;
        }

        .composer {
            font-size: 11px;
            letter-spacing: 0.08em;
            text-transform: uppercase;
            color: $gray1;
        }

        .name {
            display: block;
            font-weight: 600;
            color: inherit;
            margin: 2px 0 2px 0;
            overflow-wrap: break-word;
            word-wrap: break-word;
            word-break: break-word;
            hyphens: auto;
        }

        .album {
            font-size: 0.85rem;
            color: $gray1;
        }

        .resumebtn {
            width: 2.5rem;
            height: 2.5rem;
            padding: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: $white;
            color: $black;

            svg {
                height: 1.25rem;
            }
        }
    }

    .two-columns {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 1rem;
        padding-top: 1rem;
    }

    .tiles {
        display: grid;
        gap: 1rem;

        // as many as fit, stretched to fill the row; extras wrap
        &.eras {
            grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
        }

        &.types {
            grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
        }
    }

    .tile {
        padding: 1rem;
        background-color: #0c0c0c;
        color: inherit;
        border: solid 0.5px #181818;

        .range {
            font-size: 0.8rem;
            color: $gray1;
        }

        .name {
            font-size: 1.1rem;
            font-weight: 600;
            margin: $smaller 0;
        }

        .serif.name {
            font-size: 1.5rem;
            font-weight: 400;
        }

        .detail {
            font-size: 0.85rem;
            color: $gray1;
        }
    }

    @include for-desktop-down {
        .two-columns {
            grid-template-columns: 1fr;
        }

        .continue {
            grid-template-columns: 1fr;
            grid-auto-rows: auto;
            row-gap: 1rem;

            .resume:nth-child(n + 4) {
                display: none;
            }
        }
    }
}
</style>
