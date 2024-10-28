<template>
    <RouterLink
        :to="{
            name: Routes.Mix,
            params: {
                mixid: mix.id,
            },
        }"
        class="mixcard rounded"
    >
        <MixImage :mix="mix" :on_header="on_header" />
        <div class="info">
            <!-- <div class="title">
                {{ mix.title }}
            </div> -->
            <div class="description ellip2">
                {{ mix.description }}
            </div>
        </div>
    </RouterLink>
</template>

<script setup lang="ts">
import { Mix } from '@/interfaces'

import { RouterLink } from 'vue-router'
import { Routes } from '@/router'
import MixImage from './MixImage.vue'

defineProps<{
    mix: Mix
    on_header?: boolean
}>()
</script>

<style lang="scss">
.mixcard {
    padding: $medium;

    &:hover {
        background-color: $gray;
        cursor: pointer;
    }

    .info {
        margin-top: $small;

        .title {
            font-size: 1rem;
            font-weight: 600;
        }

        .description {
            font-size: 0.8rem;
            font-weight: 500;
            color: $gray1;
            margin-top: $smaller;
        }
    }
}
</style>
