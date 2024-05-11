<template>
  <div class="itemsortby">
    <div class="tt select circular">Sort By</div>
    <RouterLink
      v-for="i in ($route.name == Routes.AlbumList ? albumitems : artistitems).concat(items)"
      :key="i.key"
      :to="{
        name: $route.name as string,
        query: {
          sortby: i.key,
          reverse:
            i.key == store.sortby
              ? $route.query.reverse == '0'
                ? '1'
                : '0'
              : '1',
        },
        replace: true,
      }"
      class="select rounded-sm"
      :class="{ reverse: store.reverse, active: i.key == store.sortby }"
    >
      {{ i.displayName }}
      <svg
        v-if="i.key == store.sortby"
        width="18"
        height="18"
        viewBox="0 0 28 28"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.69434 13.6455C5.69434 13.9092 5.80859 14.1641 6.01074 14.3574L11.8027 20.1494C12.0137 20.3516 12.251 20.4482 12.4883 20.4482C13.042 20.4482 13.4375 20.0527 13.4375 19.5254C13.4375 19.2529 13.332 19.0156 13.1562 18.8486L11.1875 16.8535L8.58594 14.4805L10.6426 14.6035H21.3301C21.9014 14.6035 22.3057 14.208 22.3057 13.6455C22.3057 13.0742 21.9014 12.6875 21.3301 12.6875H10.6426L8.59473 12.8105L11.1875 10.4375L13.1562 8.44238C13.332 8.2666 13.4375 8.0293 13.4375 7.75684C13.4375 7.22949 13.042 6.84277 12.4883 6.84277C12.251 6.84277 12.0137 6.93066 11.7852 7.15039L6.01074 12.9336C5.80859 13.1182 5.69434 13.3818 5.69434 13.6455Z"
          fill="#F2F2F2"
        />
      </svg>
    </RouterLink>
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";
import { useAlbumList, useArtistList } from "@/stores/pages/itemlist";
import { useRoute } from "vue-router";

const route = useRoute();
const store = route.name === Routes.AlbumList ? useAlbumList() : useArtistList();

const items = [
  { key: "duration", displayName: "Duration" },
  { key: "created_date", displayName: "Date added" },
];

const albumitems = [
  { key: "title", displayName: "Title" },
  { key: "albumartists", displayName: "Artist" },
  { key: "date", displayName: "Year released" },
  { key: "count", displayName: "No. of tracks" },
];

const artistitems = [
  { key: "name", displayName: "Name" },
  { key: "trackcount", displayName: "No. of tracks" },
  { key: "albumcount", displayName: "No. of albums" },
];
</script>

<style lang="scss">
.itemsortby {
  z-index: 200;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;

  padding: 1rem $medium 2rem $medium;
  position: relative;
  font-size: 14px;
  font-weight: 500;
  text-transform: capitalize;
  user-select: none;

  .select {
    cursor: pointer;
    display: flex;
    align-items: center;
    border: solid 1px $gray5;
    padding: $small $medium;
    transition: background-color 0.2s ease-out, border-color 0.2s ease-out;
  }

  .select.circular {
    user-select: none;
    pointer-events: none;
  }

  .reverse svg {
    transform: rotate(90deg);
  }

  .select:hover {
    background-color: $gray4;
    border-color: $gray4;
  }

  .tt {
    background-color: #fff;
    color: #000;
    border: none;
  }

  svg {
    transform: rotate(-90deg);
    margin: -2px 0;
    margin-right: -6px;
    margin-left: 2px;
    transition: transform 0.1s linear;
  }

  button {
    padding-left: $medium;
  }

  .active {
    background-color: $gray4;
    border-color: $gray4;
  }
}
</style>
@/stores/pages/itemlist
