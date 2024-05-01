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

    .title {
        font-weight: 700;
    }

    .desc {
        font-size: 1rem;
        line-height: 1.5;
        font-weight: 500;
    }
}
</style>
