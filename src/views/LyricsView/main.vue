<template>
    <div v-if="queue.currenttrack && lyrics.lyrics.length" id="lyricscontent" @wheel.passive="onScroll">
        <LyricsHead />
        <div id="scrollbale">
            <div v-if="lyrics.lyrics.length && lyrics.synced" id="np-lyrics-synced">
                <div id="lyricsline--1"></div>
                <div
                    v-for="(line, index) in lyrics.lyrics"
                    :id="`lyricsline-${index}`"
                    :key="line.time"
                    class="line"
                    :class="{
                        currentLine: index == lyrics.currentLine,
                        seenLine: index < lyrics.currentLine,
                        opacity_25: index <= lyrics.currentLine - 3,
                        opacity_5: index == lyrics.currentLine - 2,
                        opacity_75: index == lyrics.currentLine - 1,
                    }"
                    @click="queue.seek(line.time / 1000)"
                >
                    {{ line.text }}
                </div>
                <div v-if="lyrics.copyright && lyrics.lyrics" class="copyright">
                    {{ lyrics.copyright }}
                </div>
                <div class="spacer"></div>
            </div>
            <div v-if="!lyrics.synced" class="unsynced">
                <div id="lyricsline--1"></div>
                <div v-for="(line, index) in lyrics.lyrics" :key="index" class="line">
                    {{ line }}
                </div>
                <div class="spacer"></div>
            </div>
        </div>
    </div>
    <div v-if="!lyrics.lyrics || lyrics.lyrics.length == 0" class="nolyrics">
        <LyricsHead />
        <div>You don't have</div>
        <div>the lyrics for this song</div>
        <!-- <div class="trackinfo">
          {{ queue.currenttrack.title }}
        </div> -->
        <PluginFind v-if="settings.use_lyrics_plugin" />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'

import useLyrics from '@/stores/lyrics'
import useQueue from '@/stores/queue'
import useSettings from '@/stores/settings'
import useColor from '@/stores/colors'

import LyricsHead from './Head.vue'
import PluginFind from './Plugins/Find.vue'
import { getBackgroundColor, getShift } from '@/utils/colortools/shift'

const queue = useQueue()
const colors = useColor()
const lyrics = useLyrics()
const settings = useSettings()

const textColor = computed(() => {
    return getBackgroundColor(colors.darkVibrant)
})

const seenLineColor = computed(() => {
    return getShift(textColor.value, [30, -70])
})

const nextLineColor = computed(() => {
    return getShift(textColor.value, [10, -25])
})

const onScroll = (e: Event) => {
    lyrics.setUserScrolled(true)
}

function fetchLyrics() {
    lyrics.getLyrics()
}

onMounted(() => {
    if (!queue.currenttrack) return
    fetchLyrics()
    lyrics.scrollToCurrentLine()
})
</script>

<style lang="scss">
#lyricscontent,
.nolyrics {
    font-weight: 700;
    font-size: 3rem;
}

#lyricscontent {
    padding: 0 2rem;
    position: inherit;
    overflow: scroll;
    scroll-margin-top: 15rem;
    overflow: hidden;
    height: 100%;
    text-wrap: balance;

    .lyricsinfo {
        width: min(100%, 54rem);
        margin: 0 auto;
    }

    #scrollbale {
        overflow: auto;
        // margin: 0 auto;
        // in case the scrollbar is visible, move it to the far right
        margin-right: -2rem;
        padding-right: 2rem;
        @include hideScrollbars;
    }

    @include allPhones {
        font-size: 2rem !important;
        padding: 0 1.5rem;
    }

    display: grid;
    grid-template-rows: max-content 1fr;

    #np-lyrics-synced {
        height: 100%;
        max-width: 54rem;
        padding-bottom: 6rem;
        margin: 0 auto;
    }

    #np-lyrics-synced::after,
    .unsynced::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 6rem;
        background: linear-gradient(to top, #000, transparent);
    }

    .line {
        margin-top: 1.5rem;
        color: rgba(255, 255, 255, 0.314);
        cursor: pointer;
        text-align: center;
        width: fit-content;
        opacity: 1;
        transition: opacity 2s ease-in-out;

        &:hover {
            color: white;
        }
    }

    .currentLine {
        color: white !important;
    }

    .seenLine {
        color: rgba(255, 255, 255, 0.822);
    }

    #lyricsline-0 {
        margin-top: 0;
    }

    .opacity_75 {
        opacity: 0.9;
    }

    .opacity_5 {
        opacity: 0.8;
    }

    .opacity_25 {
        opacity: 0.7;
    }

    .copyright {
        font-size: 12px;
        opacity: 0.65;
        text-transform: uppercase;
    }

    .spacer {
        height: 8rem;
    }
}

.nolyrics {
    color: rgba(255, 255, 255, 0.521);
    z-index: 10;
    position: inherit;
    height: 100%;
    padding: 0 2rem;
    display: grid;
    place-content: center;

    @include allPhones {
        font-size: 1.75rem;
    }

    button {
        width: fit-content;
    }

    .trackinfo {
        font-size: 1rem;
        opacity: 0.7;
        margin-top: 1rem;
        font-weight: normal;
    }
}
</style>
