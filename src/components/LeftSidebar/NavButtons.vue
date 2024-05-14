<template>
  <div class="side-nav-container">
    <router-link
      v-for="(menu, index) in menus"
      :key="index"
      v-wave
      :to="{
        name: menu.route_name || '',
        params: menu?.params,
        query: menu.query && menu.query(),
      }"
      class="circular nav-item"
      :class="{
        separator: menu.separator,
        active: $route.name === menu.route_name,
      }"
      @click="menu.action && menu.action()"
    >
      <div v-if="!menu.separator">
        <component :is="menu.icon" />
        <span>{{ menu.name }}</span>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { menus } from "./navitems";
</script>

<style lang="scss">
.side-nav-container {
  text-transform: capitalize;
  display: flex;
  flex-direction: column;
  gap: $smaller;
  overflow: hidden;

  .nav-item {
    width: 100%;
    display: flex;
    align-items: center;
    padding: $small 0;
    font-size: 14px;
    font-weight: 500;
    transition: background-color 0.2s ease-out;

    & > div {
      display: flex;
      align-items: center;
    }

    &.active {
      background-color: $gray5;
    }

    &:hover {
      background-color: $gray;
    }
  }

  .nav-item.separator {
    height: 1px;
    padding: 0;
  }

  @include allPhones {
    justify-content: space-between;
    flex-direction: row;

    .nav-item {
      justify-content: center;
    }

    .nav-item span {
      display: none;
    }

    .separator {
      display: none;
    }
  }

  @include allPhones {
    .circular.nav-item:last-child {
      display: none;
    }

    .circular.nav-item:nth-child(3) {
      display: none;
    }
  }

  svg {
    height: 1.5rem;
    margin: 0 $small 0 $small;
    border-radius: $small;
    transform: scale(0.9);
    opacity: 0.75;
  }

  svg.radiosvg {
    transform: scale(0.7);
  }
}
</style>
