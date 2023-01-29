<template>
  <button
    class="heart-button circular"
    @click="!no_emit && emit('handleFav')"
    :class="{
      is_fav: state,
    }"
  >
    <Motion
      :initial="{
        opacity: 0,
      }"
      :animate="{
        opacity: 1,
        transition: {
          delay: 0.25,
          duration: 0.5,
        },
      }"
    >
      <HeartFillSvg v-if="state" />
      <HeartSvg v-else />
    </Motion>
  </button>
</template>

<script setup lang="ts">
import HeartSvg from "@/assets/icons/heart.svg";
import HeartFillSvg from "@/assets/icons/heart.fill.svg";

defineProps<{
  state: boolean | undefined;
  no_emit?: boolean;
}>();

const emit = defineEmits<{
  (event: "handleFav"): void;
}>();
</script>

<style lang="scss">
$bg: rgb(250, 33, 33);

.heart-button {
  align-items: center;
  padding: 0 1rem;
  gap: $smaller;
  border: solid 1px $bg;
  background: transparent;
  color: rgb(250, 33, 33);

  div {
    height: max-content;
    scale: 1;

    svg {
      height: 1.5rem;
    }
  }

  &:hover {
    background: transparent;
  }
}
</style>
