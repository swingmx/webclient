<template>
  <div
    v-if="queue.currenttrack"
    id="sidelyrics"
    :style="{ background: colors.theme2 }"
  >
    <LyricsHead />
    <br />
    <div
      v-for="(line, index) in lyrics.lyrics"
      :id="`lyricsline-${index}`"
      :key="line.time"
      class="line"
      :class="{
        currentLine: index == lyrics.currentLine,
        seenLine: index < lyrics.currentLine,
        paragraphEnd: checkIsParagraphEnd(index, line),
      }"
      @click="queue.seek(line.time / 1000)"
    >
      {{ line.text }}
    </div>
    <div v-if="!lyrics.lyrics || lyrics.lyrics.length == 0" class="nolyrics">
      <div>You don't have</div>
      <div>synced lyrics for this song</div>
    </div>
    <div class="endline"></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import useQueue from "@/stores/queue";
import useLyrics from "@/stores/lyrics";
import useColors from "@/stores/colors";

import { LyricsLine } from "@/interfaces";
import LyricsHead from "./Head.vue";

const queue = useQueue();
const lyrics = useLyrics();
const colors = useColors();

defineProps<{
  onNowPlaying?: boolean;
}>();

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

onMounted(() => {
  if (!queue.currenttrack) return;
  lyrics.getLyrics(queue.currenttrack.filepath, queue.currenttrack.trackhash);
});
</script>

<style lang="scss">
#sidelyrics {
  padding: $medium 1.5rem;
  height: 100%;
  overflow: scroll;
  background-color: rgb(122, 122, 122);
  scroll-margin-top: 15rem;
  font-weight: 900;
  font-size: 1.5rem;
  position: relative;
  @include hideScrollbars;

  .nolyrics {
    color: rgba(255, 255, 255, 0.521);
    margin-top: 2rem;
  }

  .nothing {
    svg {
      margin-bottom: 1rem;
    }
  }

  .line {
    scroll-margin-bottom: 20rem;
    margin-top: 1rem;
    color: #000;
    cursor: pointer;
    width: fit-content;

    &:hover {
      color: white;
    }
  }

  .endline {
    height: 10rem;
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
}
</style>
