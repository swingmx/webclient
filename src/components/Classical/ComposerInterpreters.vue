<template>
    <div class="composer-interpreters">
        <div class="heading">{{ $t('Views.ComposerView.Interpreters') }}</div>
        <div class="grid">
            <div v-for="person in interpreters.slice(0, MAX_INTERPRETERS)" :key="person.name" class="performer">
                <div class="name ellip">{{ person.name }}</div>
                <div class="roles ellip">
                    {{ capitalize(person.roles.join(', ')) }} ·
                    {{ $t('Views.ComposerView.WorkCount', { n: person.works }, person.works) }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ComposerInterpreter } from '@/interfaces'

const MAX_INTERPRETERS = 5

defineProps<{
    interpreters: ComposerInterpreter[]
}>()

function capitalize(text: string) {
    return text.charAt(0).toUpperCase() + text.slice(1)
}
</script>

<style lang="scss">
.composer-interpreters {
    padding: 2rem 1rem 1rem;

    .heading {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1.25rem;
    }

    .grid {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        column-gap: 2rem;
    }

    .performer {
        padding: 1rem 0;
        border-top: solid 1px $gray5;
    }

    .name {
        font-weight: 600;
    }

    .roles {
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
