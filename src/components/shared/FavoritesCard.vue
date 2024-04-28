<template>
  <RouterLink :to="{ name: Routes.favoriteTracks }" class="favoritescard rounded">
    <div class="img">
      <svg width="100" height="100" viewBox="0 0 28 28" fill="#ff453a" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M13.9912 22.1445C14.2197 22.1445 14.5449 21.9775 14.8086 21.8105C19.7217 18.6465 22.8682 14.9375 22.8682 11.1758C22.8682 7.9502 20.6445 5.7002 17.8408 5.7002C16.0918 5.7002 14.7822 6.66699 13.9912 8.11719C13.2178 6.67578 11.8994 5.7002 10.1504 5.7002C7.34668 5.7002 5.11426 7.9502 5.11426 11.1758C5.11426 14.9375 8.26074 18.6465 13.1738 21.8105C13.4463 21.9775 13.7715 22.1445 13.9912 22.1445Z"
        />
      </svg>
      <PlayBtn :source="playSources.favorite" />
    </div>
    <div class="info">
      <div class="rhelp playlist">
        <span class="help">PLAYLIST</span>
        <span class="time">{{ item.time }}</span>
      </div>
      <div class="title">Favorite Tracks</div>
      <div class="fcount">
        <b>{{ item.count + ` Track${item.count == 1 ? "" : "s"}` }}</b>
      </div>
    </div>
  </RouterLink>
</template>

<script setup lang="ts">
import { playSources } from "@/enums";
import { Routes } from "@/router";
import PlayBtn from "../shared/PlayBtn.vue";
defineProps<{
  item: any;
}>();
</script>

<style lang="scss">
.favoritescard {
  padding: $medium;

  .img {
    width: 100%;
    aspect-ratio: 1/1;
    background-color: $gray5;
    border-radius: $small;
    margin-bottom: $medium;
    display: flex;
    align-items: center;
    background-image: linear-gradient(37deg, $gray5, $gray, $gray);
    justify-content: center;
    position: relative;
  }

  .play-btn {
    position: absolute;
    width: 4rem;
    bottom: 0;
    opacity: 0;
    transition: all 0.25s;
  }

  .fcount {
    font-size: 0.8rem;
    opacity: 0.75;
    padding-top: 2px;
  }

  &:hover {
    background-color: $gray4;

    .play-btn {
      opacity: 1;
      transform: translateY(-1rem);
    }
  }

  .info {
    .title {
      font-weight: 600;
      font-size: 0.95rem;
    }
  }
}
</style>
