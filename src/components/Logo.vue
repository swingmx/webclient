<template>
  <router-link class="swing-logo" :to="{ name: 'Home' }" @click="goToRadio">
    <div class="link">
      <img src="/logo-fill.svg" alt="" />
      <div>Swing <br />Music</div>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { useRouter } from "vue-router";
import useSettingsStore from "@/stores/settings";

const router = useRouter();
const settings = useSettingsStore();

let clickCount = 0;

function goToRadio(e: MouseEvent) {
  // "right place, ..."
  if (!e.ctrlKey) return;
  e.preventDefault();

  clickCount++;

  if (clickCount === 3 && settings.isRadioTime()) {
    router.push({ name: Routes.hidden });
    clickCount = 0;
  }
}
</script>

<style lang="scss">
.swing-logo {
  background-color: $gray4;
  padding: $medium;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: $small;
  cursor: pointer !important;
  line-height: 1rem;
  border-radius: 12px;

  svg {
    transform: scale(1.5);
  }

  .link {
    display: flex;
    align-items: center;
    gap: $small;
  }

  span {
    font-size: 1rem;
    font-weight: 600;
    color: $white;
  }

  img {
    height: 2.25rem;
  }
}
</style>
