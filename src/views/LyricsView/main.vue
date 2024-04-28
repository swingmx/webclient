<template>
  <div class="lyricsview content-page">
    <div
      v-if="queue.currenttrack"
      id="lyricscontent"
      :style="{ background: bgColor }"
      class="content-page rounded"
      @wheel.passive="onScroll"
    >
      <LyricsHead :bg-color="bgColor" />
      <div v-if="lyrics.synced" class="synced">
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
      </div>
      <div v-if="!lyrics.synced" class="unsynced">
        <div id="lyricsline--1"></div>
        <div v-for="(line, index) in lyrics.lyrics" :key="index" class="line">
          {{ line }}
        </div>
      </div>
      <div v-if="lyrics.copyright && lyrics.lyrics" class="copyright">
        {{ lyrics.copyright }}
      </div>
      <div v-if="!lyrics.lyrics || lyrics.lyrics.length == 0" class="nolyrics">
        <div>You don't have</div>
        <div>the lyrics for this song</div>
        <PluginFind v-if="settings.use_lyrics_plugin" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from "vue";

import useColors from "@/stores/colors";
import useLyrics from "@/stores/lyrics";
import useQueue from "@/stores/queue";
import useSettings from "@/stores/settings";

import { getShift } from "@/utils/colortools/shift";

import LyricsHead from "./Head.vue";
import PluginFind from "./Plugins/Find.vue";

const queue = useQueue();
const lyrics = useLyrics();
const colors = useColors();
const settings = useSettings();

const onScroll = (e: Event) => {
  lyrics.setUserScrolled(true);
};

const bgColor = computed(() => {
  return getShift(colors.theme2, [-20, -20]);
});

function fetchLyrics() {
  lyrics.getLyrics();
}

onMounted(() => {
  if (!queue.currenttrack) return;
  fetchLyrics();
  lyrics.scrollToCurrentLine();
});
</script>

<style lang="scss">
.lyricsview {
  height: 100%;
  padding-bottom: 1rem;
}

#lyricscontent {
  padding: 0 2rem;
  padding-bottom: 4rem;
  height: 100%;
  overflow: scroll;
  background-color: rgb(122, 122, 122);
  scroll-margin-top: 15rem;
  font-weight: 700;
  font-size: 3rem;
  position: relative;
  overflow-x: hidden;
  @include hideScrollbars;

  @include allPhones {
    font-size: 2rem !important;
    padding: 0 1.5rem;
  }

  .nolyrics {
    color: rgba(255, 255, 255, 0.521);
    margin-bottom: 1rem;
  }

  .line {
    margin-top: 1rem;
    color: #000;
    cursor: pointer;
    width: fit-content;
    opacity: 1;
    transition: opacity 2s ease-in-out;

    &:hover {
      color: white;
    }
  }

  .currentLine {
    color: white;
  }

  .seenLine {
    color: rgba(255, 255, 255, 0.774);
  }

  #lyricsline--1 {
    margin-top: 1rem;
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
    padding-top: 2rem;
    opacity: 0.9;
    text-transform: uppercase;
  }
}
</style>
