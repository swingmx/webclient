<template>
    <div class="cardlistrow">
        <component v-for="item in items" :key="item.key" :is="item.component" v-bind="item.props" />
    </div>
</template>

<script setup lang="ts">
import { Album, Artist, Mix } from '@/interfaces'
import AlbumCard from './AlbumCard.vue'
import ArtistCard from './ArtistCard.vue'
import MixCard from '../Mixes/MixCard.vue'
import { computed } from 'vue'

const props = defineProps<{
    items: Album[] | Artist[] | Mix[]
}>()

const items = computed(() => {
    return props.items.map((item: any) => {
        const i = {
            component: <any>null,
            props: {},
            key: '',
        }

        switch (item['type']) {
            case 'album':
                i.component = AlbumCard
                i.key = item.albumhash
                i.props = {
                    album: item,
                }
                break
            case 'artist':
                i.component = ArtistCard
                i.key = item.artisthash
                i.props = {
                    artist: item,
                }
                break
            case 'mix':
                i.component = MixCard
                i.key = item.sourcehash
                i.props = {
                    mix: item,
                }
                break
        }

        return i
    })
})
</script>

<style lang="scss">
.cardlistrow {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax($cardwidth, 1fr));
    padding-bottom: 2rem;
    z-index: -1;

    @include mediumPhones {
        grid-template-columns: repeat(auto-fill, minmax(9rem, 1fr));
    }
}
</style>
