<template>
    <div class="work-performers">
        <div class="heading">{{ $t('Views.WorkView.Performers') }}</div>
        <div class="grid">
            <div v-for="performer in performers" :key="performer.name" class="performer">
                <div class="name ellip">{{ performer.name }}</div>
                <div class="roles ellip">{{ rolesText(performer) }}</div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { WorkPerformer } from '@/interfaces'

defineProps<{
    performers: WorkPerformer[]
}>()

function rolesText(performer: WorkPerformer) {
    const text = performer.roles.join(', ')
    return text.charAt(0).toUpperCase() + text.slice(1)
}
</script>

<style lang="scss">
.work-performers {
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
