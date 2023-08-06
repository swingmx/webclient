<template>
  <button class="speaker">
    <div class="icon" @click="settings.toggleMute">
      <VolumeMuteSvg v-if="settings.mute || settings.volume == 0.0" />
      <VolumeFullSvg v-else-if="settings.volume > 0.75" />
      <VolumeMidSvg v-else-if="settings.volume > 0.5" />
      <VolumeLowSvg v-else-if="settings.volume > 0" />
    </div>
    <div class="dialog rounded-sm pad-sm">
      <input
        type="range"
        name="volume"
        id="volume"
        max="1"
        min="0"
        step="0.01"
        :value="settings.volume"
        @input="changeVolume"
      />
    </div>
  </button>
</template>

<script setup lang="ts">
import useSettingsStore from "@/stores/settings";
import VolumeMuteSvg from "@/assets/icons/volume-mute.svg";
import VolumeLowSvg from "@/assets/icons/volume-low.svg";
import VolumeFullSvg from "@/assets/icons/volume-full.svg";
import VolumeMidSvg from "@/assets/icons/volume-mid.svg";

const settings = useSettingsStore();

const changeVolume = (event: Event) => {
  const target = event.target as HTMLInputElement;
  settings.setVolume(parseFloat(target.value));
};
</script>

<style lang="scss">
.speaker {
  position: relative;

  .icon {
    height: 100%;
    width: 100%;
    display: grid;
    place-items: center;
  }

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
    transition: visibility 0.2s ease-in;
    transition-delay: 0.25s;

    input {
      width: max-content;
      margin: 0;

      &::-webkit-slider-thumb {
        height: 1rem;
        width: 1rem;
        cursor: pointer;
      }

      &::-moz-range-thumb {
        height: 1rem;
        width: 1rem;
        cursor: pointer;
      }
    }
  }

  &:hover {
    .dialog {
      transition-delay: 0s;
      visibility: visible;
    }
  }
}
</style>
