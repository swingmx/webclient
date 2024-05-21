<template>
  <div
    class="index t-center ellip"
    @click.prevent="$emit('addToFav')"
    @dblclick.prevent.stop="() => {}"
  >
    <div class="text">
      {{ index }}
    </div>
    <div class="heart-icon">
      <HeartSvg :state="is_fav" :no_emit="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import HeartSvg from "../HeartSvg.vue";

defineProps<{
  index: number | string;
  is_fav: boolean | undefined;
}>();

defineEmits<{
  (e: "addToFav"): void;
}>();
</script>

<style lang="scss">
.songlist-item > .index {
  font-size: 0.8rem;
  width: 100%;
  position: relative;
  height: 3rem;
  display: flex;
  justify-content: center;

  .text {
    opacity: 0.5;
    margin: auto 0;
    transform: translateX($smaller);

    transition: all 0.25s;
    width: 100%;
  }

  .heart-icon {
    position: absolute;
    left: -2px;
    display: grid;
    height: 100%;
    align-content: center;
    transition: all 0.2s;
    transform: translateX(-1.5rem);


    button {
      border: none;
      width: 2rem;
      height: 2rem;
      padding: 0;
      background-color: transparent;
    }
  }
}
</style>
