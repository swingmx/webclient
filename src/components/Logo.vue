<template>
  <router-link class="swing-logo rounded" :to="{ name: 'Home' }">
    <div class="link">
      <img src="/logo-fill.svg" alt="" />
      <div>Swing <br />Music</div>
    </div>
    <SettingsSvg />
  </router-link>
</template>

<script setup lang="ts">
import SettingsSvg from "@/assets/icons/more.svg";
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

  svg {
    scale: 1.5;
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
