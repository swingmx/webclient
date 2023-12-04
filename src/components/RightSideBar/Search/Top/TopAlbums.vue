<template>
  <div class="right-search-top-albums-or-artists">
    <AlbumCard
      v-for="album in search.top_results.albums.slice(0, 3)"
      :key="album.albumhash"
      :album="album"
    />
  </div>
</template>

<script setup lang="ts">
import useSearchstore from "@/stores/search";
import AlbumCard from "@/components/shared/AlbumCard.vue";

const search = useSearchstore();
</script>

<style lang="scss">
.right-search-top-albums-or-artists {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(7.5rem, 1fr));
  padding: $small $smaller;
  gap: $small 0;
  margin-bottom: 2rem;
}
</style>
