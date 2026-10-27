<template>
    <div class="people-grid">
        <div class="heading">{{ title }}</div>
        <div class="grid">
            <div v-for="person in shown" :key="person.name" class="person">
                <RouterLink
                    v-if="person.artisthash"
                    :to="{ name: Routes.artist, params: { hash: person.artisthash } }"
                    class="name ellip"
                >
                    {{ person.name }}
                </RouterLink>
                <div v-else class="name ellip">{{ person.name }}</div>
                <div v-if="person.detail" class="detail ellip">{{ person.detail }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import { Routes } from '@/router'

export interface GridPerson {
    name: string
    artisthash?: string
    detail?: string
}

const props = defineProps<{
    title: string
    people: GridPerson[]
    limit?: number
}>()

const shown = computed(() => (props.limit ? props.people.slice(0, props.limit) : props.people))
</script>

<style lang="scss">
.people-grid {
    padding: 2rem 0.75rem 1rem 0.75rem;

    .heading {
        font-size: 1.15rem;
        font-weight: 700;
        margin-bottom: 1.25rem;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        column-gap: 2rem;
    }

    .person {
        padding: 1rem 0;
        border-top: solid 1px $gray5;
    }

    .name {
        display: block;
        font-weight: 600;
        color: inherit;
    }

    a.name:hover {
        text-decoration: underline;
    }

    .detail {
        margin-top: $smaller;
        font-size: 0.9rem;
        color: $gray1;
    }

    @include for-desktop-down {
        .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }

    @include largePhones {
        .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
        }
    }
}
</style>
