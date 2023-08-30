<template>
  <router-link class="swing-logo rounded-md" :to="{ name: 'Home' }">
    <LogoSvg /> <span>Swing Music</span>
  </router-link>
</template>

<script setup lang="ts">
import LogoSvg from "@/assets/icons/logo-fill.svg";
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
