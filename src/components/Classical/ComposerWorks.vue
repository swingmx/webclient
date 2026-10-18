<template>
    <div class="composer-works">
        <div class="heading">
            <RouterLink
                v-if="moreLink"
                :to="{ name: Routes.composerWorks, params: { hash: composerhash }, query: categoryQuery(category) }"
                class="title"
            >
                {{ $t('Views.ComposerView.Works') }}
                <span class="arrow">›</span>
            </RouterLink>
            <div v-else class="title">{{ $t('Views.ComposerView.Works') }}</div>
            <div v-if="categories.length" class="filters">
                <RouterLink
                    :to="{ query: categoryQuery(null) }"
                    replace
                    class="filter"
                    :class="{ active: !category }"
                >
                    {{ $t('Views.ComposerView.All') }}
                </RouterLink>
                <RouterLink
                    v-for="item in categories"
                    :key="item.slug"
                    :to="{ query: categoryQuery(item.slug) }"
                    replace
                    class="filter"
                    :class="{ active: category === item.slug }"
                >
                    {{ item.name }}
                </RouterLink>
            </div>
        </div>
        <RouterLink
            v-for="work in works"
            :key="work.workhash"
            :to="{ name: Routes.work, params: { token: work.workhash }, query: { albumhash: work.albumhash } }"
            class="row"
        >
            <div class="year">{{ work.year_composed ?? '' }}</div>
            <div class="main">
                <div class="name ellip">
                    {{ work.name }}
                    <span v-if="work.nickname" class="nickname">“{{ work.nickname }}”</span>
                </div>
                <div class="meta ellip">{{ meta(work) }}</div>
            </div>
            <div class="recordings">
                {{ $t('Views.ComposerView.Recordings', { n: work.recording_count }, work.recording_count) }}
            </div>
            <div class="duration">{{ formatSeconds(work.duration) }}</div>
        </RouterLink>
    </div>
</template>

<script setup lang="ts">
import { ComposerCategory, ComposerWorkRow } from '@/interfaces'
import { Routes } from '@/router'
import formatSeconds from '@/utils/useFormatSeconds'

defineProps<{
    composerhash: string
    works: ComposerWorkRow[]
    categories: ComposerCategory[]
    category: string | null
    moreLink?: boolean
}>()

function categoryQuery(slug: string | null) {
    return slug ? { category: slug } : {}
}

function meta(work: ComposerWorkRow) {
    return [...work.catalogue_ids.map(id => id.name), work.form].filter(Boolean).join(' · ')
}
</script>

<style lang="scss">
.composer-works {
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
    }

    .year,
    .recordings,
    .meta {
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
