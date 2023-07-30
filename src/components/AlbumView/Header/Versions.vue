<template>
  <div class="versions">
    <MasterFlag
      v-for="(v, index) in versions"
      :bitrate="1200"
      :text="v"
      :key="v"
      :bg_color="color ? 'getShift(color, [80, -90])' : undefined"
      :text_color="color ? 'getShift(color, [-100, 80])' : undefined"
      :fill="versions.length > 1 && index === 0"
    />
  </div>
</template>

<script setup lang="ts">
import { getShift } from "@/utils/colortools/shift";
import MasterFlag from "@/components/shared/MasterFlag.vue";

defineProps<{
  color: string;
  versions: string[];
}>();
</script>

<style scoped></style>
