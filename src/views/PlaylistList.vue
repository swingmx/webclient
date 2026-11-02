<template>
    <div id="p-view" class="content-page">
        <Header>
            <template #name>{{ $t('Views.PlaylistList.Title') }}</template>
            <template #description>
                {{
                    showingMixes
                        ? $t('Views.PlaylistList.MixesDescription', { n: pStore.savedMixesCount })
                        : $t('Views.PlaylistList.Description', { n: pStore.playlists.length })
                }}
                <div class="playlistcontrols">
                    <div v-if="pStore.savedMixesCount" class="playlisttabs">
                        <button :class="{ active: !showingMixes }" @click="setTab('playlists')">
                            {{ $t('Common.Playlists') }} <span class="count">{{ pStore.playlists.length }}</span>
                        </button>
                        <button :class="{ active: showingMixes }" @click="setTab('mixes')">
                            {{ $t('Views.PlaylistList.SavedMixes') }}
                            <span class="count">{{ pStore.savedMixesCount }}</span>
                        </button>
                    </div>
                    <form spellcheck="false" @submit.prevent="() => {}">
                        <input
                            id="playlistsearch"
                            v-model="input"
                            class="rounded-sm no-border"
                            type="search"
                            :placeholder="
                                showingMixes ? $t('Views.PlaylistList.SearchMixes') : $t('Views.PlaylistList.SearchPlaylist')
                            "
                            name=""
                        />
                    </form>
                </div>
            </template>
            <template v-if="!showingMixes" #right>
                <button class="playlist-button" @click="showNewPlaylistModal()"><PlusSvg />{{ $t('NewPlaylist.Title') }}</button>
            </template>
        </Header>
        <template v-if="showingMixes">
            <CardRow v-if="mixes.length" class="savedmixes" :items="mixes" />
            <NoItems
                :flag="pStore.savedMixes !== null && !mixes.length"
                :icon="PlaylistSvg"
                :title="$t('Views.PlaylistList.NoMixesFound')"
            />
        </template>
        <template v-else>
            <PlaylistCardGroup v-if="!query && pinnedPlaylists.length" :playlists="pinnedPlaylists" :title="$t('Common.Pinned')" />
            <PlaylistCardGroup
                v-if="playlists.length"
                :playlists="playlists"
                :title="query ? $t('Common.SearchResults') : `${ pinnedPlaylists.length ? $t('Views.PlaylistList.OtherPlaylists') : $t('Views.PlaylistList.AllPlaylists') }`"
            />
            <NoItems
                :flag="!(playlists.length + pinnedPlaylists.length)"
                :icon="PlaylistSvg"
                :title="$t('Views.PlaylistList.NoPlaylistsFound')"
                :description="$t('Views.PlaylistList.NoItemDescription')"
            />
        </template>
    </div>
</template>

<script setup lang="ts">
import { debouncedRef } from '@vueuse/core'
import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import usePStore from '@/stores/pages/playlists'
import { useFuse } from '@/utils'
import updatePageTitle from '@/utils/updatePageTitle'

import PlaylistSvg from '@/assets/icons/playlist-1.svg'
import PlusSvg from '@/assets/icons/plus.svg'
import PlaylistCardGroup from '@/components/PlaylistsList/PlaylistCardGroup.vue'
import CardRow from '@/components/shared/CardRow.vue'
import Header from '@/components/shared/GenericHeader.vue'
import NoItems from '@/components/shared/NoItems.vue'
import useModalStore from '@/stores/modal'
import { useT } from '@/i18n'

const { t } = useT()

const pStore = usePStore()
const { showNewPlaylistModal } = useModalStore()

const route = useRoute()
const router = useRouter()

const input = ref('')
const query = debouncedRef(input, 300)

const showingMixes = computed(() => route.query.tab === 'mixes' && pStore.savedMixesCount > 0)

watch(
    () => showingMixes.value && pStore.savedMixes === null,
    needed => {
        if (needed) pStore.fetchSavedMixes()
    },
    { immediate: true }
)

function setTab(tab: 'playlists' | 'mixes') {
    input.value = ''
    router.replace({ query: tab === 'mixes' ? { tab } : {} })
}

const mixes = computed(() => {
    const saved = pStore.savedMixes ?? []
    if (!query.value) {
        return saved
    }

    return useFuse(query.value, saved, {
        keys: ['title', 'description'],
    }).value.map(r => r.item)
})

// TODO: When you add a song to playlist when you are in this page, increase the count on the card.

const pinnedPlaylists = computed(() => {
    return pStore.playlists.filter(p => p.pinned)
})

onMounted(() => {
    updatePageTitle(t('Common.Playlists'))
})

const playlists = computed(() => {
    if (!query.value) {
        return pStore.playlists.filter(p => !p.pinned)
    }

    const p = useFuse(query.value, pStore.playlists, {
        keys: ['name'],
    })

    return p.value.map(r => r.item)
})
</script>

<style lang="scss">
#p-view {
    padding-bottom: $content-padding-bottom;
    height: 100%;
    overflow: auto;

    .playlist-button {
        svg {
            height: 1.5rem;
        }
    }

    .grid {
        grid-template-columns: repeat(auto-fill, minmax($cardwidth, 1fr));
        gap: 2.5rem 1.5rem;

        @include mediumPhones {
            grid-template-columns: repeat(auto-fill, minmax(8.5rem, 1fr));
            gap: 1rem;
        }
    }

    .playlistcontrols {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: $medium;
        margin-top: 1rem;
    }

    .playlisttabs {
        display: flex;
        gap: $smaller;
        padding: $smaller;
        border-radius: 2rem;
        background-color: $gray5;

        button {
            border-radius: 2rem;
            padding: $small 1rem;
            background: transparent;
            color: $white;
            font-weight: 600;

            .count {
                margin-left: $smaller;
                font-weight: 500;
                opacity: 0.6;
            }

            &.active {
                background-color: $white;
                color: $black;
            }
        }
    }

    .savedmixes {
        padding: 0 $medium;
    }

    #playlistsearch {
        width: 16rem;
        max-width: 100%;
        background-color: $gray5;
        color: white;
        font-size: 0.95rem;
        font-weight: 500;
        padding: $medium;
        outline: none;
        appearance: none;
    }

    .playlist-button {
        padding-right: $medium;
    }

    .nothing {
        height: 50%;

        svg {
            margin-bottom: 0;
        }
    }
}
</style>
