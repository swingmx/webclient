<template>
    <div class="generichead">
        <div class="left">
            <h1 class="title"><slot name="name"></slot></h1>
            <div class="desc">
                <slot name="description"></slot>
            </div>
        </div>
        <div class="right">
            <slot name="right"></slot>
        </div>
    </div>
</template>

<style lang="scss">
.generichead {
  padding: 1rem 0 1rem $medium;
  height: max-content;
  display: grid;
  grid-template-columns: 1fr max-content;
  align-items: center;
  max-width: 100%;
  overflow: hidden;

  .left {
    max-width: 100%;
    overflow: hidden;
  }

    h1 {
        width: max-content;
        margin: 0;
        font-size: 3.25rem;
    }

  .title {
    font-weight: 700;
    margin-left: -1px;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .desc {
    font-size: 1rem;
    line-height: 1.5;
    font-weight: 500;
  }

  @include mediumPhones {
    gap: 1rem;
    grid-template-columns: repeat(auto-fill, 100%);
  }
}
</style>
