<template>
    <component
        :is="library ? 'div' : RouterLink"
        :to="library ? undefined : { name: Routes.favoriteTracks }"
        class="favoritescard rounded"
        :class="{ library }"
        @click="library && playFromLibrary()"
    >
        <div class="img">
            <div
                class="blur"
                :style="item.image ? { backgroundImage: `url(${paths.images.thumb.small + item.image})` } : {}"
            ></div>
        </div>
        <div class="overlay">
            <PlayBtn :source="library ? playSources.library : playSources.favorite" />
            <QueueSvg v-if="library" class="heart" />
            <svg
                v-else
                class="heart"
                width="100"
                height="100"
                viewBox="0 0 28 28"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                >
                :style="{ color: color }"
                <path
                    d="M13.9912 22.1445C14.2197 22.1445 14.5449 21.9775 14.8086 21.8105C19.7217 18.6465 22.8682 14.9375 22.8682 11.1758C22.8682 7.9502 20.6445 5.7002 17.8408 5.7002C16.0918 5.7002 14.7822 6.66699 13.9912 8.11719C13.2178 6.67578 11.8994 5.7002 10.1504 5.7002C7.34668 5.7002 5.11426 7.9502 5.11426 11.1758C5.11426 14.9375 8.26074 18.6465 13.1738 21.8105C13.4463 21.9775 13.7715 22.1445 13.9912 22.1445Z"
                />
            </svg>
        </div>
        <div class="info">
            <div class="rhelp playlist">
                <span class="help">{{ $t('FavoritesCard.PlaylistUpper') }}</span>
                <span class="time">{{ item.time }}</span>
            </div>
            <div class="title">{{ library ? $t('Utils.PlayingFrom.YourLibrary') : $t('FavoritesCard.FavoriteTracks') }}</div>
            <div v-if="showCount" class="fcount">
                <b>{{ $t('Common.TrackCount', {count: item.count}, item.count) }}</b>
            </div>
        </div>
    </component>
</template>

<script setup lang="ts">
import { paths } from '@/config'
import { Routes } from '@/router'
import { playSources } from '@/enums'
import { RouterLink } from 'vue-router'
import QueueSvg from '@/assets/icons/queue.svg'
import { playFromLibrary } from '@/helpers/usePlayFrom'
import PlayBtn from '../shared/PlayBtn.vue'

defineProps<{
    item: {
        time: string
        count: number
        image?: string
    }
    // the whole library, played as a shuffled playlist, instead of favorite tracks
    library?: boolean
    // The track count is shown only where a view asks for it, as with ArtistCard's showTrackcount.
    showCount?: boolean
}>()
</script>

<style lang="scss">
.favoritescard {
    padding: $medium;
    position: relative;

    .img,
    .overlay {
        width: 100%;
        aspect-ratio: 1/1;
        border-radius: $small;
        margin-bottom: $medium;
    }

    .img {
        overflow: hidden;

        .blur {
            height: 100%;
            width: 100%;
            background-image: linear-gradient(37deg, $gray5, $gray, $gray);
            // background-image: url('http://localhost:1980/img/thumbnail/xsmall/e74d8c49e8d6340f.webp?pathhash=24bf8142d7150965');
            background-size: cover;
            background-position: center;
            filter: brightness(0.5) blur(15px);
            background-color: rgba(0, 0, 0, 0.5);
            overflow: hidden;
            opacity: 0.5;
        }
    }

    .overlay {
        display: flex;
        align-items: center;
        justify-content: center;
        $size: calc(100% - $medium * 2);
        position: absolute;
        top: $medium;
        left: $medium;
        width: $size;
        z-index: 1;
    }

    .heart {
        color: $pink;
    }

    &.library {
        cursor: pointer;

        .heart {
            color: $white;
            width: 100px;
            height: 100px;
        }
    }

    .play-btn {
        position: absolute;
        width: 4rem;
        bottom: 0;
        opacity: 0;
        transition: all 0.25s;
    }

    .fcount {
        font-size: 0.8rem;
        opacity: 0.75;
        padding-top: 2px;
    }

    &:hover {
        background-color: $gray4;

        .play-btn {
            opacity: 1;
            transform: translateY(-1rem);
        }
    }

    .info {
        .title {
            font-weight: 600;
            font-size: 0.95rem;
        }
    }
}
</style>
