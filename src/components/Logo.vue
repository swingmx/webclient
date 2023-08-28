<template>
  <router-link
    class="swing-logo rounded-md"
    :to="{ name: 'Home' }"
    @click="goToRadio"
  >
    <LogoSvg /> <span>Swing Music</span>
  </router-link>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";

import { Routes } from "@/router";
import useSettingsStore from "@/stores/settings";
import LogoSvg from "@/assets/icons/logo-fill.svg";

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
  background-image: linear-gradient(37deg, rgb(29, 28, 28), transparent);
  padding-left: 1rem;
  display: flex;
  align-items: center;
  gap: $medium;
  border: solid 1px $gray5;

  svg {
    transform: scale(1.25);
  }

  &:hover {
    background-color: $gray5;
  }
}
</style>
