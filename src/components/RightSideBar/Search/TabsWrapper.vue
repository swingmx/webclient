<template>
  <div id="right-tabs" :class="{ tabContent: tabContent }">
    <div class="tabheaders">
      <button
        v-for="tab in tabs"
        :key="tab"
        class="tab circular"
        :class="{ activetab: tab === currentTab }"
        @click="$emit('switchTab', tab)"
      >
        {{ tab }}
      </button>
    </div>

    <div v-if="tabContent" id="tab-content" v-auto-animate>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  tabs: string[];
  currentTab: string;
  tabContent?: boolean;
}>();

defineEmits<{
  (e: "switchTab", tab: string): void;
}>();
</script>

<style lang="scss">
#right-tabs {
  display: grid;
  position: absolute; // TODO: Find a way to fix scrollability without using position absolute.
  overflow: hidden;

  height: 100%;
  width: 100%;

  .tab-buttons-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .vue-recycle-scroller {
    padding: 0 $small;
  }

  .cardlistrow {
    grid-template-columns: repeat(auto-fill, minmax(8.1rem, 1fr));
  }
}

#tab-content {
  height: 100%;
  overflow: auto;
  overflow-x: hidden;
  -webkit-overflow-scrolling: touch;
}

.designatedOS #tab-content::-webkit-scrollbar-track {
  background-color: $gray;
}

.designatedOS #tab-content::-webkit-scrollbar-thumb {
  border: 4px solid $gray;
}

#right-tabs.tabContent {
  grid-template-rows: min-content 1fr;
}
</style>
