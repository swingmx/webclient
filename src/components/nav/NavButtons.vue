<template>
    <div id="back-forward" class="">
        <button class="back" @click="$router.back()">
            <ArrowSvg />
        </button>
        <button class="forward" @click="$router.forward()">
            <ArrowSvg />
        </button>
    </div>
</template>

<script setup lang="ts">
import ArrowSvg from '../../assets/icons/right-arrow.svg'
</script>

<style lang="scss">
#back-forward {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: $medium;
    padding-right: 1rem;
    border-right: 1px solid $gray5;
    height: max-content;

    & > * {
        width: 2.15rem;
        height: 2.15rem;
        aspect-ratio: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0;
        border-radius: 5rem;
        background-color: transparent;
        border: 1px solid $gray5;

        &:hover {
            background-color: $gray4;
            border-color: $gray4;
        }

        svg {
            transform: scale(0.96);
            transition: transform 0.2s ease;
        }

        &:active > svg {
            transform: scale(0.76);
        }
    }

    .back {
        transform: rotate(180deg);
    }
}
</style>
