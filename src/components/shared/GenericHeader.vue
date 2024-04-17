<template>
  <div class="generichead">
    <div class="left">
      <h1><slot name="name"></slot></h1>
      <div class="desc">
        <slot name="description"></slot>
      </div>
    </div>
    <div class="right">
      <slot name="right"></slot>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss">
.generichead {
  padding: 1rem 0 1rem $small;
  height: max-content;
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;

  h1 {
    width: max-content;
    margin: 0;
    font-size: 3.25rem;
  }

  .desc {
    font-size: 1rem;
    line-height: 1.5;
  }
}
</style>
