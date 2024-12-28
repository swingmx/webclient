<template>
    <div class="mixheader" v-if="mix.title">
        <MixImage :mix="mix" :on_header="true" />
        <div class="mixinfo">
            <div class="header_type">{{ mix.extra['type'] }} mix</div>
            <div class="header_title">{{ mix.title }}</div>
            <div class="header_description ellip2">
                {{ mix.description }}
            </div>
            <div class="bunchofstuff">
                {{ mix.trackcount }} track{{ mix.trackcount === 1 ? '' : 's' }} ▸ {{ mix.duration }}
            </div>
            <div class="buttons">
                <PlayBtnRect :source="playSources.mix" :bg_color="'#fff'" @click.prevent="$emit('playThis')" />
                <button class="savebtn" :title="mix.saved ? 'Saved Mix' : 'Save Mix'" @click="saveMix">
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
import useAxios from '@/requests/useAxios'
import { paths } from '@/config'

const props = defineProps<{
    mix: FullMix
}>()

defineEmits<{
    (e: 'playThis'): void
}>()

async function saveMix() {
    const initialState = props.mix.saved
    props.mix.saved = !initialState

    const res = await useAxios({
        url: paths.api.mixes + '/save',
        method: 'POST',
        props: {
            type: props.mix.extra.type,
            mixid: props.mix.id,
            // INFO: save artist mixes using their sourcehash,
            // but track mixes using their og_sourcehash, as track mixes are based
            // on artist mixes
            sourcehash: props.mix.extra.type === 'artist' ? props.mix.sourcehash : props.mix.extra.og_sourcehash,
        },
    })

    if (res.status !== 200) {
        props.mix.saved = initialState
    }
}
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
        font-size: 4rem;
        font-weight: 900;
    }

    .header_description {
        font-size: 1rem;
        font-weight: 500;
        margin-top: $smaller;
        color: $brown;
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
