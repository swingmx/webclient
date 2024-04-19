<template>
  <span
    v-if="bitrate > 1024"
    class="master-flag"
    :title="!text ? 'Master audio bitrate - ' + `${bitrate} Kbps` : ''"
    :style="{
      backgroundColor: bg_color ? (fill ? bg_color : 'transparent') : 'rgba(184, 108, 21, 0.281)',
      color: text_color ? (fill ? text_color : '') : 'rgb(255, 153, 0)',
      border: !fill ? `1px solid ${bg_color}` : 'none',
    }"
    >{{ text ? text : "M" }}</span
  >
</template>

<script setup lang="ts">
defineProps<{
  bitrate: number;
  text?: string;
  bg_color?: string;
  text_color?: string;
  fill?: boolean;
}>();
</script>

<style lang="scss">
.master-flag {
  font-size: 10px;
  font-weight: 600;
  margin-left: $smaller;
  padding: 2px 5px;
  border-radius: 5px;
  opacity: 0.75;
  text-transform: uppercase;
}
</style>
