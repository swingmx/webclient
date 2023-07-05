<template>
  <div class="options-and-duration">
    <div class="song-duration">{{ formatSeconds(duration) }}</div>
    <div
      class="options-icon circular"
      @click.stop="$emit('showMenu', $event)"
      @dblclick.stop="() => {}"
    >
      <OptionSvg />
    </div>
  </div>
</template>

<script setup lang="ts">
import { formatSeconds } from "@/utils";
import OptionSvg from "@/assets/icons/more.svg";

defineProps<{
  duration: number;
}>();

defineEmits<{
  (e: "showMenu", event: MouseEvent): void;
}>();
</script>

<style lang="scss">
.songlist-item > .options-and-duration {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-right: $small;

  .song-duration {
    font-size: small;
    text-align: left;
  }

  .options-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    aspect-ratio: 1;
    width: 2rem;

    svg {
      stroke: $white;
    }

    &:hover {
      background-color: $gray3;
    }
  }
}
</style>
