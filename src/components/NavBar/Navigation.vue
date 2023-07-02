<template>
  <div class="side-nav-container">
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
          class="nav-button"
          :class="{ active: $route.name === menu.route_name }"
          id="home-button"
          v-else
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

  @media screen and (max-width: 768px) {
    display: flex;
    justify-content: space-between;

    .in > span {
      display: none;
    }
  }

  .nav-button {
    border-radius: $small;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    padding: $small 0;
    position: relative;
    font-size: 14px;
    font-weight: 700;

    &.active::before {
      content: " ";
      position: absolute;

      top: 50%;
      transform: translateY(-50%);

      opacity: 0.75;
      height: 40%;
      width: 4px;
      background-color: $pink;
      border-radius: 1rem;

      @media screen and (max-width: 768px) {
        top: 90%;
        left: 50%;
        transform: translateX(-50%);
        height: 4px;
        width: 40%;
      }
    }

    &:hover {
      background-color: $darkestblue;

      &::before {
        background-color: $white;
      }
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
