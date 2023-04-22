<template>
  <span
    v-if="store.show_master_quality_flag && bitrate > 1024"
    class="master-flag"
    :title="'Master audio bitrate - ' + `${bitrate} Kbps`"
    :style="{
      backgroundColor: bg_color ? bg_color : 'rgba(184, 108, 21, 0.281)',
      color: text_color ? text_color : 'rgb(255, 153, 0)',
    }"
    >{{ text ? text : "M" }}</span
  >
</template>

<script setup lang="ts">
import useSettingsStore from "@/stores/settings";

defineProps<{
  bitrate: number;
  text?: string;
  bg_color?: string;
  text_color?: string;
}>();

const store = useSettingsStore();
</script>

<style lang="scss">
.master-flag {
  font-size: 10px;
  margin-left: $smaller;
  padding: 2px 5px;
  border-radius: 5px;
  opacity: 0.75;
  text-transform: uppercase;
}
</style>
