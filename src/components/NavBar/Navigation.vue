<template>
  <div class="side-nav-container">
    <router-link
      v-for="(menu, index) in menus"
      :key="index"
      :to="{
        name: menu.route_name,
        params: menu?.params,
        query: menu.query && menu.query(),
      }"
      :class="{
        separator: menu.separator,
      }"
    >
      <div v-wave class="circular">
        <div
          class="nav-button circular"
          :class="{ active: $route.name === menu.route_name }"
          id="home-button"
          v-if="!menu.separator"
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

<style lang="scss">
.side-nav-container {
  text-transform: capitalize;
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: $smaller;

  @include allPhones {
    justify-content: space-between;
    flex-direction: row;

    .in > span {
      display: none;
    }

    .separator {
      display: none;
    }
  }

  .nav-button {
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: $small 0;
    position: relative;
    font-size: 14px;
    font-weight: 700;
    transition: all 0.25s ease-out;

    &.active {
      background-color: $gray5;
      padding-left: 1rem;
      padding-right: 1rem;
    }

    &.active::before {
      transition: all 0.25s ease-out;

      content: " ";
      position: absolute;

      top: 50%;
      transform: translateY(-50%);

      opacity: 0.75;
      height: 40%;
      width: 4px;
      background-color: white;
      border-radius: 1rem;

      @include allPhones {
        display: none;
      }
    }

    &:hover {
      background-color: $gray;
    }

    .in {
      display: flex;
      align-items: center;

      & > * {
        background-size: 1.5rem;
      }
    }
  }

  svg {
    margin: 0 $small 0 $small;
    border-radius: $small;
    transform: scale(0.9);
    opacity: 0.75;
  }
}
</style>
