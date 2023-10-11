<template>
  <button class="speaker" @wheel.passive="handleMouseWheel">
    <div class="icon" @click="settings.toggleMute">
      <VolumeMuteSvg v-if="settings.mute || settings.volume == 0.0" />
      <VolumeMidSvg v-else-if="settings.volume > 0.75" />
      <VolumeLowSvg v-else-if="settings.volume > 0" />
    </div>
    <div class="dialog rounded-sm pad-sm">
      <input
        id="volume"
        type="range"
        name="volume"
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
import VolumeMidSvg from "@/assets/icons/volume-mid.svg";

const settings = useSettingsStore();

const changeVolume = (event: Event) => {
  const target = event.target as HTMLInputElement;
  settings.setVolume(parseFloat(target.value));
};

const handleMouseWheel = (event: WheelEvent) => {
  event.preventDefault();
  const delta = event.deltaY / 1000;
  let newVolume = settings.volume - delta / 3;

  if (newVolume > 1) {
    newVolume = 1;
  }

  if (newVolume < 0) {
    newVolume = 0;
  }

  settings.setVolume(newVolume);
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
    cursor: default;

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
      transition-delay: 0.25s;
      visibility: visible;
    }
  }
}
</style>
