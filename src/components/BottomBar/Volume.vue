<template>
  <button class="speaker">
    <SpeakerSvg />
    <div class="dialog rounded-sm pad-sm">
      <input type="range" name="volume" id="volume" />
    </div>
  </button>
</template>

<script setup lang="ts">
import SpeakerSvg from "@/assets/icons/speaker.svg";
</script>

<style lang="scss">
.speaker {
  position: relative;

  svg {
    transform: scale(0.75);
  }

  .dialog {
    background-color: $gray4;
    position: absolute;
    bottom: 2.95rem;
    height: 2.5rem;
    display: flex;
    align-items: center;
    visibility: hidden;

    input {
      width: max-content;
      margin: 0;

      &::-webkit-slider-thumb {
        height: 1.25rem;
        width: 1.25rem;
        cursor: pointer;
      }

      &::-moz-range-thumb {
        height: 1.25rem;
        width: 1.25rem;
        cursor: pointer;
      }
    }
  }

  &:hover {
    .dialog {
      visibility: visible;
    }
  }
}
</style>
