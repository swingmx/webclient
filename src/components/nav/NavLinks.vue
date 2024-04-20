<template>
  <div class="topnavlinks">
    <RouterLink
      v-for="link in topnavitems"
      :key="link.name"
      class="link"
      :to="{
        name: link.route_name,
        params: link?.params,
      }"
      :class="{
        active: $route.name && $route.name === link.route_name,
      }"
    >
      {{ link.name || "|" }}
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { topnavitems } from "../LeftSidebar/navitems";
</script>

<style lang="scss">
.topnavlinks {
  display: flex;
  gap: $smaller;
  align-items: center;

  width: max-content;
  user-select: none;

  .link {
    text-transform: capitalize;
    padding: 0.25rem $medium;
    cursor: pointer;
    border-radius: 2rem;
    transition: background-color 0.2s ease-out, color 0.2s ease-out;

    display: flex;
    align-items: center;
    font-weight: 600;

    svg {
      transform: scale(0.75);
    }

    &:hover {
      color: $primary;
      background-color: #fff;
    }
  }

  .active {
    background-color: #fff;
    color: $primary;
  }

  .link.home {
    padding: 0;
    padding-right: $small;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: $smaller;
  }

  .separator_ {
    padding: 0;
    pointer-events: none;
    background-color: transparent;
    opacity: 0.2;
  }
}
</style>
