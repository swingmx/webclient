<template>
  <div class="sidenav noSelect">
    <div class="sidenav_header">
      <a @click="closeSidenav" class="sidenav_logo" href="#">
        <div class="art"><LogoSvg /></div>
        <div class="title">Swing Music</div>
      </a>
    </div>
    <div class="sidenav_content scrollable">
      <RouterLink
        v-for="link in topnavitems"
        :key="link.name"
        class="link"
        :to="{ name: link.route_name, params: link.params }"
        :class="{ active: $route.name === link.route_name }"
        @click="closeSidenav"
      >
        <component :is="link.icon" />
        <!-- Render the icon as a Vue component -->
        <span>{{ link.name }}</span>
      </RouterLink>
    </div>
    <div class="sidenav_footer">Swing Music - v</div>
  </div>
</template>

<script setup lang="ts">
import LogoSvg from "@/assets/icons/logos/logo-fill.light.svg";
import { topnavitems } from "../LeftSidebar/navitems";

const emit = defineEmits(["close"]);

function closeSidenav() {
  emit("close");
}
</script>

<style lang="scss">
.sidenav_toggle {
  display: none;

  @include allPhones {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    gap: 6px;
    width: 28px;
    height: 28px;
    cursor: pointer;

    > .bar {
      height: 2px;
      width: calc(100% - 14px);
      border-radius: 1rem;
      background-color: $white;
      opacity: 0.75;
      transition: color 0.2s ease-out, transform 0.2s ease-out;
    }

    &:hover {
      > .bar {
        background-color: #ffffff;
      }
    }
  }
}

.sidenav {
  display: none;

  @include allPhones {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1002;
    width: 240px;
    height: 100%;
    display: flex;
    flex-direction: column;
    background-color: $body;
    transform: translateX(-240px);
    transition: transform 300ms cubic-bezier(0.4, 0, 0.2, 1);

    .sidenav_header {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: $large 24px;
      box-sizing: border-box;

      .sidenav_logo {
        display: flex;
        align-items: center;
        gap: 1rem;

        .title {
          font-size: 1rem;
          font-weight: 600;
          line-height: 1.4;
        }
      }
    }

    .sidenav_content {
      display: flex;
      flex-direction: column;
      position: relative;
      height: 100%;
      margin-right: 2px;
      overflow: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      -webkit-overflow-scrolling: touch;

      .link {
        font-size: 0.9rem;
        font-weight: 500;
        line-height: 1.2;
        text-transform: capitalize;
        position: relative;
        display: flex;
        align-items: center;
        gap: 1rem;
        margin: $smaller $medium;
        padding: $small $medium;
        cursor: pointer;
      }

      svg {
        height: 1.5rem;
      }
    }

    .sidenav_footer {
      font-size: $medium;
      margin: $large auto;
      opacity: 0.5;
    }
  }
}

.sidenav.active {
  transform: translateX(0);
}
</style>
