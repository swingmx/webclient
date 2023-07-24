<template>
  <button
    v-wave
    class="playbtnrect shadow-sm circular btn-active"
    @click="usePlayFrom(source, useQStore, store)"
  >
    <playBtnSvg />
    <div class="text">Play</div>
  </button>
</template>

<script setup lang="ts">
import playBtnSvg from "@/assets/icons/play.svg";
import { playSources } from "@/enums";
import usePlayFrom from "@/helpers/usePlayFrom";
import useAStore from "@/stores/pages/album";
import useArtistPageStore from "@/stores/pages/artist";
import useFStore from "@/stores/pages/folder";
import usePStore from "@/stores/pages/playlist";
import useQStore from "@/stores/queue";

defineProps<{
  source: playSources;
  store:
    | typeof useQStore
    | typeof useFStore
    | typeof useAStore
    | typeof usePStore
    | typeof useArtistPageStore;
}>();
</script>

<style lang="scss">
.playbtnrect {
  width: 6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease-in-out;
  color: $white;
  background-color: $pink !important;
  border: solid 1px $pink !important;
}
</style>
