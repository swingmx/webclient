<template>
    <div class="card-placeholder" :class="{ with_helptext }">
        <div class="image rounded-sm holder"></div>
        <div class="help holder"></div>
        <div class="name holder"></div>
        <div class="itemcount holder"></div>
    </div>
</template>

<script setup lang="ts">
defineProps<{
    with_helptext?: boolean;
}>()
</script>

<style lang="scss">
@keyframes placeholderAnimate {
    0% {
        background-position: -650px 0;
    }

    100% {
        background-position: 650px 0;
    }
}


.card-placeholder {
    // border: solid 1px;
    padding: $medium;

    .holder {
        background-color: $gray;
        animation-duration: 1.7s;
        animation-fill-mode: forwards;
        animation-iteration-count: infinite;
        animation-timing-function: linear;
        animation-name: placeholderAnimate;
        // background: #f6f7f8; // Fallback
        background: linear-gradient(to right, $gray 2%, $gray5 18%, $gray 33%);
        background-size: 1300px;
    }

    .image {
        width: 100%;
        aspect-ratio: 1;
        background-color: $gray;
    }

    .help,
    .itemcount {
        margin-top: $small;
        height: 1rem;
        border-radius: $smaller;
    }

    .help {
        height: 0;
    }

    .itemcount {
        width: 100%;
    }

    .name {
        width: 80%;
        border-radius: $smaller;
        height: 1rem;
        margin-top: $small;
    }

    &.with_helptext {
        .help {
            height: 1rem;
            width: 70%;
        }

        .name {
            width: 100%;
        }

        .itemcount {
            width: 85%;
        }
    }
}
</style>