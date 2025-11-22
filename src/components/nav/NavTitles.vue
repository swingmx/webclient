<template>
  <div class="info">
    <SettingsTitle v-if="$route.name == Routes.settings" :text="$t('NavTitles.Settings')" />
    <SearchTitle v-if="$route.name == Routes.search" />
    <PlaylistsTitle v-if="$route.name == Routes.playlists" />
    <SimpleNav
      v-if="$route.name == Routes.artistTracks"
      :text="$route.query.artist as string || $t('NavTitles.ArtistTracks')"
    />
    <SimpleNav v-if="$route.name === Routes.nowPlaying" :text="$t('NavTitles.NowPlaying')" />
  </div>
</template>

<script setup lang="ts">
import { Routes } from "@/router";

import SimpleNav from "./Titles/SimpleNav.vue";
import SearchTitle from "./Titles/SearchTitle.vue";
import SettingsTitle from "./Titles/SettingsTitle.vue";
import PlaylistsTitle from "./Titles/PlaylistsTitle.vue";
</script>
