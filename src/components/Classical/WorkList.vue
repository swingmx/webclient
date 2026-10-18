<template>
    <div class="work-list">
        <div class="heading">
            <RouterLink
                v-if="moreLink || moreTo"
                :to="moreTo ?? { name: Routes.artistWorks, params: { hash: artisthash }, query: filterQuery(filter) }"
                class="title"
            >
                {{ title }}
                <span class="arrow">›</span>
            </RouterLink>
            <div v-else class="title">{{ title }}</div>
            <div v-if="filters.length" class="filters">
                <RouterLink :to="{ query: filterQuery(null) }" replace class="filter" :class="{ active: !filter }">
                    {{ $t('Views.ComposerView.All') }}
                </RouterLink>
                <RouterLink
                    v-for="item in filters"
                    :key="item.slug"
                    :to="{ query: filterQuery(item.slug) }"
                    replace
                    class="filter"
                    :class="{ active: filter === item.slug }"
                >
                    {{ item.name }}
                </RouterLink>
            </div>
        </div>
        <div
            ref="rowsEl"
            class="rows"
            :class="{ split: (columns ?? 1) > 1, compact }"
            :style="(columns ?? 1) > 1 ? { gridTemplateRows: `repeat(${Math.ceil(works.length / (columns ?? 1))}, auto)` } : {}"
        >
        <RouterLink
            v-for="work in shown"
            :key="work.workhash"
            :to="{ name: Routes.work, params: { token: work.workhash }, query: { albumhash: work.albumhash } }"
            class="row"
            :class="{ 'no-year': showComposer, 'rounded-sm': compact }"
        >
            <div v-if="!showComposer && !compact" class="year">{{ work.year_composed ?? '' }}</div>
            <div class="main">
                <div v-if="showComposer && work.composer" class="composer ellip">{{ work.composer }}</div>
                <div class="name ellip">
                    {{ work.name }}
                    <span v-if="work.nickname" class="nickname">“{{ work.nickname }}”</span>
                </div>
                <div class="meta ellip">{{ meta(work) }}</div>
            </div>
            <template v-if="!compact">
                <div class="recordings">{{ rightLabel(work) }}</div>
                <div class="duration">{{ work.duration ? formatSeconds(work.duration) : '' }}</div>
            </template>
        </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'

import { useT } from '@/i18n'
import { PersonFilter, PersonWorkRow, WorkCardItem } from '@/interfaces'
import { Routes } from '@/router'
import { RouteLocationRaw } from 'vue-router'
import formatSeconds from '@/utils/useFormatSeconds'

const props = defineProps<{
    artisthash: string
    title: string
    works: (PersonWorkRow | WorkCardItem)[]
    filters: PersonFilter[]
    filterKey: string
    filter: string | null
    moreLink?: boolean
    // performer pages label each work with its composer
    showComposer?: boolean
    // where the title links when it is not the artist works page
    moreTo?: RouteLocationRaw
    // rows laid out in this many columns, filled top to bottom
    columns?: number
    // small cards in a grid, without the date and duration
    compact?: boolean
    // compact grid rows to show; works past them are left out
    maxRows?: number
}>()

const { t } = useT()

// match the compact grid's minimum card width and gap in pixels
const CARD_MIN = 288
const CARD_GAP = 16

const rowsEl = ref<HTMLElement | null>(null)
const width = ref(0)
let observer: ResizeObserver | null = null

const shown = computed(() => {
    if (!props.maxRows) return props.works
    const columns = Math.max(1, Math.floor((width.value + CARD_GAP) / (CARD_MIN + CARD_GAP)))
    return props.works.slice(0, columns * props.maxRows)
})

onMounted(() => {
    if (!rowsEl.value) return
    observer = new ResizeObserver(([entry]) => (width.value = entry.contentRect.width))
    observer.observe(rowsEl.value)
})

onBeforeUnmount(() => observer?.disconnect())

/**
 * The column before the duration: the date added, the recording count, or
 * the recording year, whichever the row carries.
 */
function rightLabel(work: any) {
    if (work.added) {
        return new Date(work.added * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    }
    if (work.recording_count !== undefined) {
        return t('Views.ComposerView.Recordings', { n: work.recording_count }, work.recording_count)
    }
    return work.year ?? ''
}

function filterQuery(slug: string | null) {
    return slug ? { [props.filterKey]: slug } : {}
}

function meta(work: any) {
    const parts: string[] = work.catalogue_ids.map((id: { name: string }) => id.name)
    if (work.with?.length) parts.push(t('Views.ComposerView.With', { names: work.with.join(', ') }))
    else if (work.form) parts.push(work.form)
    return parts.join(' · ')
}
</script>

<style lang="scss">
.work-list {
    padding: 1rem;

    .heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
        margin-bottom: 1rem;
    }

    .title {
        font-size: 1.5rem;
        font-weight: 700;
        color: inherit;

        .arrow {
            color: $gray1;
            margin-left: $smaller;
        }
    }

    .rows.split {
        display: grid;
        grid-auto-flow: column;
        grid-auto-columns: minmax(0, 1fr);
        column-gap: 2rem;
    }

    .rows.compact {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(18rem, 1fr));
        gap: 1rem;

        .row {
            grid-template-columns: minmax(0, 1fr);
            border-top: none;
            background-color: $gray5;

            &:hover {
                background-color: $gray4;
            }
        }
    }

    .filters {
        display: flex;
        flex-wrap: wrap;
        gap: $small;
    }

    .filter {
        padding: $smaller 0.75rem;
        border: solid 1px $gray3;
        border-radius: 2rem;
        font-size: 0.85rem;
        color: inherit;

        &.active {
            background-color: $white;
            border-color: $white;
            color: $black;
        }
    }

    .row {
        display: grid;
        grid-template-columns: 5rem 1fr max-content 4.5rem;
        align-items: center;
        gap: 1rem;
        padding: 1rem 0.75rem;
        border-top: solid 1px $gray5;
        color: inherit;

        &:hover {
            background-color: $gray5;
        }

        &.no-year {
            grid-template-columns: 1fr max-content 4.5rem;
        }
    }

    .composer {
        font-size: 12px;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        margin-bottom: 3px;
    }

    .year,
    .recordings,
    .meta,
    .composer {
        font-size: 0.85rem;
        color: $gray1;
    }

    .main {
        min-width: 0;
    }

    .name {
        font-weight: 600;

        .nickname {
            font-family: Georgia, 'Times New Roman', serif;
            font-style: italic;
            font-weight: 400;
        }
    }

    .meta {
        margin-top: $smaller;
    }

    .duration {
        text-align: right;
        font-variant-numeric: tabular-nums;
    }

    @include for-desktop-down {
        .rows.split {
            display: block;
        }
    }

    @include largePhones {
        .heading {
            flex-direction: column;
            align-items: flex-start;
        }

        .row {
            grid-template-columns: 1fr max-content;
        }

        .year,
        .recordings {
            display: none;
        }
    }
}
</style>
