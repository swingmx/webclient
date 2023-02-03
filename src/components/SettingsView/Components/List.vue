<template>
  <div class="list-items">
    <div class="option-list" v-for="i in items" :key="i.title">
      <div class="ellip">
        {{ i.title }}
      </div>
      <div class="icon" @click="i.action">
        <span>{{ i.buttontext }}</span>
      </div>
    </div>
    <div v-if="!items.length" class="option-list" style="opacity: 0.5">
      Root directories not configured. Use the "modify" button above to
      configure
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  items: {
    title: string;
    buttontext: string;
    action: () => void;
  }[];
}>();
</script>

<style lang="scss">
.setting-item.is-list {
  $color: $gray5;

  .list-items {
    background-color: $color;
    border-radius: $small;
    margin-top: 1rem;
    overflow: hidden;
  }

  .option-list {
    padding: $small 1rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    &:nth-child(even) {
      background-color: $gray4;
    }

    &:hover {
      background-color: rgba(255, 255, 255, 0.178);
    }

    span {
      color: $red;
      cursor: pointer;

      &:hover {
        border-bottom: solid 2px;
      }
    }
  }
}
</style>
