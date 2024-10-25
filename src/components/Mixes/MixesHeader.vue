<template>
    <div class="mixheader" v-if="mix.title">
        <MixImage :mix="mix" :on_header="true" />
        <div class="mixinfo">
            <div class="header_type">{{ mix.extra['type'] }} mix</div>
            <div class="header_title">{{ mix.title }} Radio</div>
            <div class="header_description ellip2" :style="{ color: getTypeColor(mix.images[0].color) }">
                {{ mix.description }}
            </div>
            <div class="bunchofstuff">
                {{ mix.trackcount }} track{{ mix.trackcount === 1 ? '' : 's' }} ▸ {{ mix.duration }}
            </div>
            <div class="buttons">
                <PlayBtnRect :source="playSources.mix" :bg_color="'#fff'" @click.prevent="$emit('playThis')" />
                <button class="savebtn" :title="mix.saved ? 'Saved Mix' : 'Save Mix'">
                    <SaveFilledSvg v-if="mix.saved" />
                    <SaveSvg v-else />
                </button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { FullMix } from '@/interfaces'
import MixImage from './MixImage.vue'
import PlayBtnRect from '../shared/PlayBtnRect.vue'
import SaveSvg from '@/assets/icons/bookmark.svg'
import SaveFilledSvg from '@/assets/icons/bookmark.fill.svg'
import { playSources } from '@/enums'
import { getTypeColor } from '@/utils/colortools'
defineProps<{
    mix: FullMix
}>()

defineEmits<{
    (e: 'playThis'): void
}>()
</script>

<style lang="scss">
.mixheader {
    height: 18rem;
    display: grid;
    grid-template-columns: 17.5rem 1fr;
    gap: 1rem;
    padding: $small;

    .mixinfo {
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }

    .header_type {
        font-weight: 600;
        text-transform: capitalize;
        font-size: 14px;
        color: $gray1;
    }

    .header_title {
        margin-top: $smaller;
        font-size: 4rem;
        font-weight: 900;
    }

    .header_description {
        font-size: 1rem;
        font-weight: 500;
        margin-top: $smaller;
    }

    .bunchofstuff {
        margin-top: $small;
        font-size: 14px;
        font-weight: 500;
    }

    .buttons {
        margin-top: 1rem;
        display: flex;
        gap: 1rem;
        align-items: center;

        .savebtn {
            background-color: transparent;
            border: none;
            cursor: pointer;
            padding: 0;

            svg {
                height: 1.5rem;
            }
        }
    }
}
</style>
