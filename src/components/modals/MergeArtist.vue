<template>
    <div class="merge-artist-dialog">
        <header class="ma-header">
            <div class="ma-title">{{ $t('Modal.MergeArtist.Title') }}</div>
            <button class="ma-close" :aria-label="$t('ConfirmModal.Cancel')" @click="$emit('hideModal')">
                <svg viewBox="0 0 16 16"><path d="M4 4l8 8M12 4l-8 8" /></svg>
            </button>
        </header>

        <div class="ma-body">
            <div class="ma-source">
                <PersonImage class="ma-avatar" :image="sourceImage" :name="artistname" size="small" />
                <div class="ma-source-text">
                    <div class="ma-name ellip">{{ artistname }}</div>
                    <div v-if="counts" class="ma-counts">{{ counts }}</div>
                </div>
                <div class="ma-into">{{ $t('Menus.Artist.MergeInto') }} ↓</div>
            </div>

            <label class="ma-search">
                <SearchSvg />
                <input
                    ref="input"
                    v-model="query"
                    type="text"
                    :placeholder="$t('Modal.MergeArtist.Search')"
                    :aria-label="$t('Modal.MergeArtist.Search')"
                />
            </label>

            <div class="ma-results" role="radiogroup" :aria-label="$t('Modal.MergeArtist.Pick')">
                <div v-if="!query.trim()" class="ma-hint">{{ $t('Modal.MergeArtist.Hint') }}</div>
                <button
                    v-for="artist in artists"
                    v-else
                    :key="artist.hash"
                    class="ma-row"
                    :class="{ picked: target?.hash === artist.hash }"
                    role="radio"
                    :aria-checked="target?.hash === artist.hash"
                    @click="target = artist"
                >
                    <PersonImage
                        class="ma-avatar"
                        :image="`${artist.hash}.webp${artist.image ? `?${artist.image}` : ''}`"
                        :name="artist.name"
                        :blurhash="artist.blurhash"
                        size="small"
                    />
                    <span class="ma-name ellip">{{ artist.name }}</span>
                    <span class="ma-radio">
                        <svg v-if="target?.hash === artist.hash" viewBox="0 0 16 16"><path d="M3.5 8.5l3 3 6-7" /></svg>
                    </span>
                </button>
            </div>
        </div>

        <footer class="ma-footer">
            <div class="ma-pick">{{ target ? '' : $t('Modal.MergeArtist.Pick') }}</div>
            <button class="ma-btn ghost" :disabled="merging" @click="$emit('hideModal')">
                {{ $t('ConfirmModal.Cancel') }}
            </button>
            <button class="ma-btn primary" :disabled="!target || merging" @click="merge">
                {{ $t('Modal.MergeArtist.Merge') }}
            </button>
        </footer>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'

import { useT } from '@/i18n'
import { mergeArtist } from '@/requests/artists'
import { Routes } from '@/router'
import useCommandPalette, { PaletteArtist } from '@/stores/commandPalette'
import { NotifType, useToast } from '@/stores/notification'
import useArtistStore from '@/stores/pages/artist'

import SearchSvg from '@/assets/icons/search.svg'
import PersonImage from '@/components/shared/PersonImage.vue'

const props = defineProps<{
    artisthash: string
    artistname: string
}>()

const emit = defineEmits<{
    (e: 'hideModal'): void
}>()

const { t } = useT()
const router = useRouter()
const palette = useCommandPalette()
const store = useArtistStore()

const input = ref<HTMLInputElement>()
const query = ref('')
const target = ref<PaletteArtist | null>(null)
const merging = ref(false)

// the open artist page holds this artist's image and counts
const info = computed(() => (store.info.artisthash === props.artisthash ? store.info : null))
const sourceImage = computed(() => info.value?.image || `${props.artisthash}.webp`)
const counts = computed(() => {
    if (!info.value) return ''
    const { trackcount, albumcount } = info.value
    return [
        t('Common.TrackCount', { count: trackcount }, trackcount),
        t('CommandPalette.AlbumCount', { n: albumcount }, albumcount),
    ].join(' · ')
})

// the command palette's index and search, narrowed to the other artists
const artists = computed(() =>
    palette.results.filter((r): r is PaletteArtist => r.type === 'artist' && r.hash !== props.artisthash).slice(0, 6)
)

watch(query, q => {
    target.value = null
    palette.search(q)
})

onMounted(() => input.value?.focus())

async function merge() {
    if (!target.value) return
    const into = target.value

    merging.value = true
    const { data, status } = await mergeArtist(props.artisthash, into.hash)
    merging.value = false

    const toast = useToast()
    if (status !== 200) {
        toast.showNotification(data?.msg || t('Common.NotificationError'), NotifType.Error)
        return
    }

    toast.showNotification(
        t('Modal.MergeArtist.Done', { source: props.artistname, target: into.name }),
        NotifType.Success
    )
    emit('hideModal')
    palette.load()
    router.replace({ name: Routes.artist, params: { hash: into.hash } })
}
</script>

<style lang="scss">
.merge-artist-dialog {
    width: 100%;
    background-color: #18181b;
    border: 1px solid #2a2a2f;
    border-radius: 16px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.6);
    color: #ededed;
    text-align: left;

    .ma-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 18px 20px 12px;
    }

    .ma-title {
        font-size: 1.15rem;
        font-weight: 700;
    }

    .ma-close {
        width: 2rem;
        padding: 0;
        background-color: transparent;
        color: #8a8a91;

        svg {
            width: 1rem;
            fill: none;
            stroke: currentColor;
            stroke-width: 1.5;
        }

        &:hover {
            background-color: #26262b;
            color: #ededed;
        }
    }

    .ma-body {
        padding: 0 20px;
    }

    .ma-source,
    .ma-row {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .ma-source {
        padding: 10px 12px;
        border: 1px solid #26262b;
        border-radius: 12px;
    }

    .ma-avatar {
        flex: none;
        width: 2.25rem;
        height: 2.25rem;
        border-radius: 50%;
        object-fit: cover;
    }

    .ma-source-text {
        flex: 1;
        min-width: 0;
    }

    .ma-name {
        font-weight: 600;
    }

    .ma-counts,
    .ma-into,
    .ma-pick,
    .ma-hint {
        font-size: 0.85rem;
        color: #8a8a91;
    }

    .ma-search {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-top: 12px;
        padding: 0 12px;
        height: 2.75rem;
        border: 1px solid #2e2e33;
        border-radius: 10px;
        color: #8a8a91;

        &:focus-within {
            border-color: #5a5a62;
        }

        svg {
            flex: none;
            width: 1.1rem;
        }

        input {
            flex: 1;
            min-width: 0;
            border: none;
            outline: none;
            background-color: transparent;
            color: #ededed;
            font-size: 1rem;
        }
    }

    .ma-results {
        display: flex;
        flex-direction: column;
        gap: 2px;
        height: 11.5rem;
        margin-top: 8px;
        overflow-y: auto;
    }

    .ma-hint {
        margin: auto;
    }

    .ma-row {
        flex: none;
        height: 3.25rem;
        padding: 0 12px;
        justify-content: flex-start;
        border: 1px solid transparent;
        border-radius: 10px;
        background-color: transparent;

        .ma-name {
            flex: 1;
            text-align: left;
        }

        &:hover {
            background-color: #1f1f23;
        }

        &.picked {
            border-color: $darkblue;
            background-color: color-mix(in srgb, $darkblue 12%, transparent);
        }
    }

    .ma-radio {
        flex: none;
        display: grid;
        place-items: center;
        width: 1.25rem;
        height: 1.25rem;
        border: 1.5px solid #4a4a52;
        border-radius: 50%;

        svg {
            width: 0.75rem;
            fill: none;
            stroke: $white;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
        }
    }

    .picked .ma-radio {
        border-color: $darkblue;
        background-color: $darkblue;
    }

    .ma-footer {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 12px;
        padding: 14px 20px;
        border-top: 1px solid #222226;
    }

    .ma-pick {
        flex: 1;
    }

    .ma-btn {
        height: 2.25rem;
        padding: 0 1rem;
        border-radius: 8px;
        font-weight: 600;

        &.ghost {
            background-color: transparent;

            &:hover {
                background-color: #222226;
            }
        }

        &.primary {
            background-color: $darkblue;
            color: $white;

            &:disabled {
                opacity: 1;
                background-color: #2a2a2e;
                color: #5f5f66;
            }
        }
    }
}
</style>
