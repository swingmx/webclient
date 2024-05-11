<template>
  <div class="p-after-header">
    <div>All Tracks</div>
  </div>
</template>

<style lang="scss">
.p-after-header {
  display: flex;
  align-items: center;
  height: 64px;
  padding: 0 1rem;
  margin-top: $small;

  font-size: 14px;
  font-weight: 500;
  color: $gray1;

  @include largePhones {
    padding-left: 0.5rem;
  }
}
</style>
