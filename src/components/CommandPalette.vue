<template>
    <Teleport to="body">
        <div v-if="store.visible" class="command-palette-overlay" @mousedown.self="store.close()">
            <div class="command-palette" role="dialog" :aria-label="$t('CommandPalette.Label')">
                <div class="search">
                    <SearchSvg />
                    <input
                        ref="input"
                        v-model="query"
                        :placeholder="$t('CommandPalette.Placeholder')"
                        autocomplete="off"
                        spellcheck="false"
                    />
                </div>

                <div ref="list" class="list" role="listbox">
                    <div v-if="!rows.length" class="empty">
                        {{ store.ready ? $t('CommandPalette.NoMatches') : $t('CommandPalette.Loading') }}
                    </div>
                    <template v-for="section in sections" :key="section.title">
                        <div class="section">{{ section.title }}</div>
                        <div
                            v-for="{ item, index } in section.rows"
                            :key="item.type + item.hash"
                            class="row"
                            :class="{ active: index === cursor }"
                            :data-i="index"
                            role="option"
                            :aria-selected="index === cursor"
                            @mousemove="cursor = index"
                            @click="act(item, false)"
                        >
                            <div
                                class="thumb"
                                :class="{ square: item.type === 'album' }"
                                :style="blurhashStyle(item.blurhash)"
                            >
                                <img :src="imageUrl(item)" loading="lazy" @error="hideImage" />
                            </div>
                            <div class="text">
                                <div class="name">
                                    {{ item.name }}
                                    <MasterFlag v-if="item.type === 'album' && item.version" :bitrate="1200" :text="item.version" />
                                </div>
                                <div class="sub">{{ subtitle(item) }}</div>
                            </div>
                        </div>
                    </template>
                </div>

                <div class="footer">
                    <span><kbd>↑</kbd> <kbd>↓</kbd> {{ $t('CommandPalette.Or') }} <kbd>Tab</kbd> <kbd>⇧</kbd><kbd>Tab</kbd> {{ $t('CommandPalette.Move') }}</span>
                    <span class="push"><kbd>↵</kbd> {{ $t('CommandPalette.Open') }}</span>
                    <span><kbd>⇧</kbd> <kbd>↵</kbd> {{ $t('CommandPalette.Play') }}</span>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { paths } from '@/config'
import { playFromAlbumCard, playFromArtistCard } from '@/helpers/usePlayFrom'
import { useT } from '@/i18n'
import { Routes } from '@/router'
import useCommandPalette, { PaletteItem } from '@/stores/commandPalette'
import blurhashStyle from '@/utils/blurhashStyle'

import SearchSvg from '@/assets/icons/search.svg'
import MasterFlag from '@/components/shared/MasterFlag.vue'

const store = useCommandPalette()
const router = useRouter()
const { t } = useT()

const query = ref('')
const cursor = ref(0)
const input = ref<HTMLInputElement>()
const list = ref<HTMLElement>()

watch(query, q => store.search(q))

/**
 * The best-matching artist, their albums in artist page order, then the other artists and albums.
 */
const sections = computed(() => {
    const results = store.results
    const top = results.find(i => i.type === 'artist')
    const own = new Set<PaletteItem>(top?.type === 'artist' ? top.albums : [])
    const rest = results.filter(i => i !== top && !own.has(i))

    const groups: [string, PaletteItem[]][] = [
        [t('CommandPalette.Artist'), top ? [top] : []],
        [t('CommandPalette.AlbumsBy', { name: top?.name }), top?.type === 'artist' ? top.albums : []],
        [t('CommandPalette.Artists'), rest.filter(i => i.type === 'artist')],
        [t('CommandPalette.Albums'), rest.filter(i => i.type === 'album')],
    ]

    let index = 0
    return groups
        .filter(([, items]) => items.length)
        .map(([title, items]) => ({ title, rows: items.map(item => ({ item, index: index++ })) }))
})

const rows = computed(() => sections.value.flatMap(s => s.rows.map(r => r.item)))

watch(rows, () => {
    cursor.value = 0
    if (list.value) list.value.scrollTop = 0
})

watch(
    () => store.visible,
    async visible => {
        if (!visible) return
        query.value = ''
        cursor.value = 0
        await nextTick()
        input.value?.focus()
    }
)

function imageUrl(item: PaletteItem) {
    if (item.type === 'album') return `${paths.images.thumb.large}${item.hash}.webp`
    return `${paths.images.artist.large}${item.hash}.webp${item.image ? `?${item.image}` : ''}`
}

function hideImage(e: Event) {
    ;(e.target as HTMLImageElement).style.display = 'none'
}

function subtitle(item: PaletteItem) {
    if (item.type === 'artist') return t('CommandPalette.AlbumCount', { n: item.albums.length }, item.albums.length)
    const names = item.artists.map(a => a.name).join(', ')
    return [names, item.year || ''].filter(Boolean).join(' · ')
}

async function moveTo(i: number) {
    const count = rows.value.length
    if (!count) return
    cursor.value = (i + count) % count

    await nextTick()
    const row = list.value?.querySelector<HTMLElement>(`.row[data-i="${cursor.value}"]`)
    // keep a section's heading in view when landing on its first row
    const heading = row?.previousElementSibling?.classList.contains('section') ? row.previousElementSibling : row
    heading?.scrollIntoView({ block: 'nearest' })
}

function act(item: PaletteItem | undefined, play: boolean) {
    if (!item) return
    store.close()

    if (item.type === 'album') {
        play ? playFromAlbumCard(item.hash, item.name) : router.push({ name: Routes.album, params: { albumhash: item.hash } })
    } else {
        play ? playFromArtistCard(item.hash, item.name) : router.push({ name: Routes.artist, params: { hash: item.hash } })
    }
}

function onKeydown(e: KeyboardEvent) {
    if (!store.visible) return

    switch (e.key) {
        case 'Escape':
            store.close()
            break
        case 'ArrowDown':
            moveTo(cursor.value + 1)
            break
        case 'ArrowUp':
            moveTo(cursor.value - 1)
            break
        case 'Tab':
            moveTo(cursor.value + (e.shiftKey ? -1 : 1))
            break
        case 'Enter':
            if (e.isComposing) return
            act(rows.value[cursor.value], e.shiftKey || e.metaKey || e.ctrlKey)
            break
        default:
            return
    }

    // keeps the app's own shortcuts from also running
    e.preventDefault()
    e.stopPropagation()
}

window.addEventListener('keydown', onKeydown, true)
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown, true))
</script>

<style lang="scss">
.command-palette-overlay {
    position: fixed;
    inset: 0;
    z-index: 2000;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    padding: 12vh 1rem 0;
    background-color: rgba(0, 0, 0, 0.6);
}

.command-palette {
    width: 100%;
    max-width: 640px;
    background-color: #161618;
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);

    .search {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px 16px;
        border-bottom: 1px solid $gray5;

        svg {
            width: 18px;
            height: 18px;
            flex-shrink: 0;
            opacity: 0.6;
        }

        input {
            flex: 1;
            min-width: 0;
            background: none;
            border: none;
            outline: none;
            color: $white;
            font: inherit;
            font-size: 16px;
        }
    }

    .list {
        max-height: min(60vh, 520px);
        overflow-y: auto;
        padding: 6px;
    }

    .section {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 0.06em;
        color: $gray1;
        padding: 12px 10px 6px;

        &:first-child {
            padding-top: 6px;
        }
    }

    .row {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 7px 10px;
        border-radius: 8px;
        cursor: pointer;

        &.active {
            background-color: #1f1f22;
        }
    }

    .thumb {
        position: relative;
        width: 36px;
        height: 36px;
        flex-shrink: 0;
        border-radius: 50%;
        overflow: hidden;
        background-color: $gray5;

        &.square {
            border-radius: 4px;
        }

        img {
            position: absolute;
            inset: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .text {
        flex: 1;
        min-width: 0;
    }

    .name {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.678);
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        font-weight: 500;
    }

    .sub {
        font-size: 12px;
        color: $gray1;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .empty {
        color: $gray1;
        font-size: 13px;
        padding: 10px 16px;
    }

    .footer {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        padding: 10px 16px;
        border-top: 1px solid $gray5;
        font-size: 12px;
        color: $gray1;

        .push {
            margin-left: auto;
        }
    }

    kbd {
        font-family: inherit;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 5px;
        border: 1px solid $gray5;
        background-color: #161618;
        color: $white;
    }
}
</style>
