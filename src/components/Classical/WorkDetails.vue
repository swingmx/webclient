<template>
    <div class="work-details">
        <div v-if="work.dedication" class="dedication">
            {{ $t('Views.WorkView.DedicatedTo', { name: work.dedication }) }}
        </div>
        <div v-if="facts.length" class="facts">
            <div v-for="fact in facts" :key="fact.label" class="fact">
                <div class="label">{{ fact.label }}</div>
                <div class="value">{{ fact.value }}</div>
            </div>
        </div>
        <div v-if="work.instruments?.length" class="instrumentation">
            <div class="label">
                {{ $t('Views.WorkView.Instrumentation') }}
                <template v-if="work.instrumentation"> · {{ work.instrumentation }}</template>
            </div>
            <div class="chips">
                <span v-for="chip in work.instruments" :key="chip" class="chip">{{ chip }}</span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { ClassicalWorkPage } from '@/interfaces'

const props = defineProps<{
    work: ClassicalWorkPage
}>()

const { t } = useI18n()

const facts = computed(() => {
    const out: { label: string; value: string }[] = []
    if (props.work.year_composed) {
        out.push({ label: t('Views.WorkView.Composed'), value: String(props.work.year_composed) })
    }
    if (props.work.year_published) {
        out.push({ label: t('Views.WorkView.Published'), value: String(props.work.year_published) })
    }
    if (props.work.key) {
        out.push({ label: t('Views.WorkView.Key'), value: props.work.key })
    }
    return out
})
</script>

<style lang="scss">
.work-details {
    padding: 1rem;

    .dedication {
        font-size: 0.9rem;
        color: $gray1;
        padding-bottom: 2rem;
    }

    .facts {
        display: grid;
        grid-template-columns: repeat(5, minmax(0, 1fr));
        column-gap: 2rem;
        margin-bottom: 2rem;
    }

    .fact {
        padding-top: 1rem;
        border-top: solid 1px $gray5;

        .value {
            margin-top: $smaller;
            font-size: 1.1rem;
            font-weight: 700;
        }
    }

    .label {
        font-size: 0.9rem;
        color: $gray1;
    }

    .chips {
        display: flex;
        flex-wrap: wrap;
        gap: $small;
        margin-top: 0.75rem;

        .chip {
            padding: $smaller 0.75rem;
            border: solid 1px $gray3;
            border-radius: 2rem;
            font-size: 0.9rem;
        }
    }

    @include for-desktop-down {
        .facts {
            grid-template-columns: repeat(3, minmax(0, 1fr));
        }
    }
}
</style>
