<template>
    <div class="cardscroller collective-members">
        <div class="rinfo">
            <div class="rtitle">
                <b>{{ $t('ArtistView.Members') }}</b>
                <span v-if="auth.is_admin" class="see-all">
                    <a href="#" @click.prevent="modal.showEditArtistModal()">
                        <b>{{ $t('ArtistView.EditCollective') }}</b>
                    </a>
                </span>
            </div>
        </div>
        <div class="cm-grid">
            <RouterLink
                v-for="member in members"
                :key="member.artisthash"
                class="cm-card rounded"
                :to="{ name: Routes.artist, params: { hash: member.artisthash } }"
            >
                <PersonImage
                    class="cm-avatar"
                    :image="member.image"
                    :name="member.name"
                    :blurhash="member.blurhash"
                    size="small"
                />
                <div class="cm-text">
                    <div class="cm-name ellip">{{ member.name }}</div>
                    <div class="cm-counts">
                        {{ $t('Common.TrackCount', { count: member.trackcount }, member.trackcount) }} ·
                        {{ $t('CommandPalette.AlbumCount', { n: member.albumcount }, member.albumcount) }}
                    </div>
                    <div class="cm-go">{{ $t('ArtistView.GoToArtist') }} →</div>
                </div>
            </RouterLink>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Artist } from '@/interfaces'
import { Routes } from '@/router'
import useAuth from '@/stores/auth'
import useModal from '@/stores/modal'

import PersonImage from '@/components/shared/PersonImage.vue'

defineProps<{
    members: Artist[]
}>()

const auth = useAuth()
const modal = useModal()
</script>

<style lang="scss">
.collective-members {
    .cm-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(15rem, 1fr));
        gap: $medium;
        padding: 0 $medium;
    }

    .cm-card {
        display: flex;
        align-items: center;
        gap: 1rem;
        padding: 1rem;
        background-color: $gray5;

        &:hover {
            background-color: $gray4;
        }
    }

    .cm-avatar {
        width: 4rem;
        height: 4rem;
        flex-shrink: 0;
        border-radius: 50%;
        object-fit: cover;
    }

    .cm-text {
        min-width: 0;
        display: flex;
        flex-direction: column;
        gap: 2px;
    }

    .cm-name {
        font-weight: 700;
    }

    .cm-counts {
        font-size: small;
        opacity: 0.6;
    }

    .cm-go {
        font-size: small;
        font-weight: 600;
        color: $darkblue;
    }
}
</style>
