<template>
    <div ref="aboutEl" class="composer-about">
        <div class="heading">{{ $t('Views.ComposerView.About') }}</div>
        <p v-for="(paragraph, index) in shown" :key="index">{{ paragraph }}</p>
        <div class="footer">
            <button v-if="paragraphs.length > collapsedCount" class="readmore" @click="expanded = !expanded">
                {{ expanded ? $t('Views.ComposerView.ShowLess') : $t('Views.ComposerView.ReadMore') }}
            </button>
            <span class="source">
                {{ $t('Views.ComposerView.SourceLabel') }}
                <a v-if="url" :href="url" target="_blank" rel="noopener noreferrer">{{ $t('Views.ComposerView.Wikipedia') }}</a>
                <template v-else>{{ $t('Views.ComposerView.Wikipedia') }}</template>
            </span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'

// collapsed view: about this many lines, ending on a paragraph break
const TARGET_LINES = 10
const LINE_TOLERANCE = 3
// average character width as a share of the font size
const CHAR_WIDTH = 0.5

const props = defineProps<{
    bio: string
    url?: string
}>()

const aboutEl = ref<HTMLElement>()
const width = ref(0)
const expanded = ref(false)

const paragraphs = computed(() => props.bio.split('\n').filter(Boolean))

/**
 * How many leading paragraphs fit in about TARGET_LINES lines at the
 * current width. The first paragraph always shows, in full.
 */
const collapsedCount = computed(() => {
    const fontSize = aboutEl.value ? parseFloat(getComputedStyle(aboutEl.value).fontSize) : 16
    const charsPerLine = width.value ? Math.max(20, width.value / (fontSize * CHAR_WIDTH)) : 90
    let lines = 0
    let count = 0
    for (const paragraph of paragraphs.value) {
        const paragraphLines = Math.ceil(paragraph.length / charsPerLine)
        if (count > 0 && lines + paragraphLines > TARGET_LINES + LINE_TOLERANCE) break
        lines += paragraphLines
        count += 1
        if (lines >= TARGET_LINES) break
    }
    return Math.max(1, count)
})

const shown = computed(() => (expanded.value ? paragraphs.value : paragraphs.value.slice(0, collapsedCount.value)))

let observer: ResizeObserver | null = null

onMounted(() => {
    if (!aboutEl.value) return
    width.value = aboutEl.value.clientWidth
    observer = new ResizeObserver(entries => {
        width.value = entries[0].contentRect.width
    })
    observer.observe(aboutEl.value)
})

onBeforeUnmount(() => observer?.disconnect())

watch(() => props.bio, () => (expanded.value = false))
</script>

<style lang="scss">
.composer-about {
    padding: 2rem 1rem 1rem;
    max-width: 48rem;

    .heading {
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
    }

    p {
        line-height: 1.7;
        margin: 0 0 1rem;
        opacity: 0.9;
    }

    .footer {
        display: flex;
        align-items: center;
        gap: 1rem;
        font-size: 0.85rem;
    }

    .readmore {
        padding: 0;
        background: none;
        border: none;
        font-weight: 600;
        font-size: inherit;
        color: inherit;
        cursor: pointer;

        &:hover {
            text-decoration: underline;
        }
    }

    .source {
        color: $gray1;

        a {
            color: inherit;
            text-decoration: underline;
        }
    }
}
</style>
