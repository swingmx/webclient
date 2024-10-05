<template>
    <div class="p-after-header">
        <div>All Tracks</div>
    </div>
</template>

<style lang="scss">
.isSmall .p-after-header {
    padding-left: 0.5rem;
}

.p-after-header {
    display: flex;
    align-items: center;
    height: 64px;
    padding: 0 1rem;
    margin-top: $small;

    font-size: 14px;
    font-weight: 500;
    color: $gray1;

    @media only screen and (max-width: 724px) {
        padding-left: 0.5rem;
    }

    /* Somehow has to be replaced by above now
  @include largePhones {
    padding-left: 0.5rem;
  }
  */
}
</style>
