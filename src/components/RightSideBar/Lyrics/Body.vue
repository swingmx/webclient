<template>
  <div
    v-if="queue.currenttrack"
    id="sidelyrics"
    :style="{ background: bgColor }"
    @wheel="onScroll"
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
          paragraphEnd: checkIsParagraphEnd(index, line),
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
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted } from "vue";

import useTabs from "@/stores/tabs";
import useQueue from "@/stores/queue";
import useLyrics from "@/stores/lyrics";
import useColors from "@/stores/colors";
import useSettings from "@/stores/settings";

import { LyricsLine } from "@/interfaces";
import { getShift } from "@/utils/colortools/shift";

import LyricsHead from "./Head.vue";
import PluginFind from "./Plugins/Find.vue";

const tabs = useTabs();
const queue = useQueue();
const lyrics = useLyrics();
const colors = useColors();
const settings = useSettings();

defineProps<{
  onNowPlaying?: boolean;
}>();

const onScroll = (e: Event) => {
  lyrics.setUserScrolled(true);
};

const bgColor = computed(() => {
  return getShift(colors.theme2, [-20, -20]);
});

function checkIsParagraphEnd(index: number, line: LyricsLine) {
  if (line.text == "") return true;
  if (index == lyrics.lyrics.length - 1) return false;

  const nextLine = lyrics.lyrics[index + 1];

  if (nextLine.text == "") return false;
  if (nextLine.time - line.time > 6000) {
    if (line.text.split(" ").length > 4) return false;
    return true;
  }

  return false;
}

function fetchLyrics() {
  lyrics.getLyrics();
}

onMounted(() => {
  if (!queue.currenttrack) return;
  fetchLyrics();
  tabs.npSwitchToLyrics();
});

onBeforeUnmount(() => {
  tabs.npSwitchToThumbnail();
});
</script>

<style lang="scss">
#sidelyrics {
  padding: $medium 5rem;
  height: 100%;
  overflow: scroll;
  background-color: rgb(122, 122, 122);
  scroll-margin-top: 15rem;
  font-weight: 900;
  font-size: 3rem;
  position: relative;
  @include hideScrollbars;
  margin-right: -1rem;

  @include tablet-portrait {
    font-size: 2rem !important;
    padding: $medium 1.5rem;
  }

  .nolyrics {
    color: rgba(255, 255, 255, 0.521);
    margin-top: 2rem;
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

  .paragraphEnd {
    margin-bottom: 3rem;
  }

  #lyricsline--1 {
    margin-top: 3.5rem;
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
    margin: 2rem 0;
    opacity: 0.9;
    text-transform: uppercase;
  }
}
</style>
