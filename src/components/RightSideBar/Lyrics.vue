<template>
  <div v-if="queue.currenttrack" class="lyricsinfo">
    <img
      :src="paths.images.thumb.small + queue.currenttrack.image"
      class="rounded-sm"
    />
    <div class="text">
      <div class="title ellip">{{ queue.currenttrack.title }}</div>
      <ArtistName
        :artists="queue.currenttrack.artists"
        :albumartists="queue.currenttrack.albumartists"
      />
    </div>
    <div class="close">
      <button><ExpandSvg /> Back</button>
    </div>
  </div>

  <div
    v-if="queue.currenttrack"
    id="sidelyrics"
    :style="{ background: colors.theme2 }"
  >
    <div v-for="(line, index) in lyrics.lyrics" :key="line.time" class="lines">
      <div
        :id="`lyricsline-${index}`"
        class="line"
        :class="{
          currentLine: index == lyrics.currentLine,
          seenLine: index < lyrics.currentLine,
          paragraphEnd: checkIsParagraphEnd(index, line),
        }"
        @click="seek(line.time, index)"
      >
        {{ line.text }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

import useQueue from "@/stores/queue";
import useLyrics from "@/stores/lyrics";
import useColors from "@/stores/colors";

import { paths } from "@/config";
import { LyricsLine } from "@/interfaces";

import ArtistName from "../shared/ArtistName.vue";
import ExpandSvg from "@/assets/icons/expand.svg";

const queue = useQueue();
const lyrics = useLyrics();
const colors = useColors();

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

function seek(time: number, index: number) {
  queue.seek(time / 1000);
  lyrics.setCurrentLine(index);
}

onMounted(() => {
  if (!queue.currenttrack) return;
  lyrics.getLyrics(queue.currenttrack.filepath || "");
});
</script>

<style lang="scss">
.lyricsinfo {
  padding: $medium;
  display: grid;
  grid-template-columns: max-content 1fr max-content;
  gap: $small;
  align-items: flex-end;

  img {
    height: 2.5rem;
  }

  .artist {
    font-size: small;
    color: $gray1;
  }

  .title {
    font-size: 14px;
  }

  button {
    padding-left: 0.15rem;
    margin-bottom: $smaller;
  }

  svg {
    transform: rotate(180deg) scale(0.85);
  }
}

#sidelyrics {
  padding: $medium 2rem;
  height: 100%;
  overflow: scroll;
  background-color: rgb(122, 122, 122);

  .lines {
    height: max-content;
    font-weight: 900;

    @include hideScrollbars;
  }

  .line {
    scroll-margin-top: 15rem;
    font-size: 1.5rem;
    margin-top: 1rem;
    color: #000;
    cursor: pointer;
    width: fit-content;

    &:hover {
      color: white;
    }
  }

  .currentLine {
    color: white;
  }

  .seenLine {
    color: rgba(255, 255, 255, 0.726);
  }

  .paragraphEnd {
    margin-bottom: 3rem;
  }
}
</style>
