<template>
  <div class="mobile-nav">
    <router-link
      v-for="menu in menus"
      :key="menu.name"
      :to="{
        name: menu.route_name,
        params: menu?.params,
        query: menu.query && menu.query(),
      }"
    >
      <div v-wave class="rounded-sm">
        <div
          v-if="menu.separator"
          :class="{
            separator: menu.separator,
          }"
        ></div>
        <div
          v-else
          id="home-button"
          class="nav-button"
          :class="{ active: $route.name === menu.route_name }"
      >
          <div class="in">
            <component :is="menu.icon"></component>
            <span>{{ menu.name }}</span>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { menus } from "./navitems";
</script>