<template>
    <div class="chartgroup rounded" :class="name">
        <ChartsHeader :name="name" @change-period="changePeriod" :period="period" />
        <br />
        <ChartItem
            v-for="(item, index) in items"
            :key="index"
            :item="item"
            :index="index + 1"
            :name="(name.slice(0, -1) as any)"
        />
        <div class="scrobbleinfo rounded-sm">
            <div class="date">

                <CalendarSvg />
                {{ date }}
            </div>
            <div class="scrobbleinfo-trend">
                <ArrowSvg class="trend" :class="scrobbleInfo?.trend" />
                <div class="text">
                    {{ scrobbleInfo?.text }}
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

import { getDateRange, getDateRangeFromSecondsAgo, getDuration } from '@/utils/stats'
import { getChartItem } from '@/requests/stats'
import { Artist, Album, Track } from '@/interfaces'

import ChartItem from './ChartItem.vue'
import ChartsHeader from './ChartsHeader.vue'
import ArrowSvg from '@/assets/icons/arrow.svg'
import CalendarSvg from '@/assets/icons/calendar.svg'

const props = defineProps<{
    name: 'artists' | 'albums' | 'tracks'
}>()

const period = ref('month')
const items = ref<Artist | Album | Track[]>([])
const scrobbleInfo = ref<{
    text: string
    trend: string
} | null>(null)

const date = computed(() => {
    return getDateRangeFromSecondsAgo(getDuration(period.value))
})

async function getItems() {
    const res = await getChartItem(props.name, getDuration(period.value), 10, 'playduration')
    items.value = res.data[props.name]
    scrobbleInfo.value = res.data.scrobbles
}

async function changePeriod(newPeriod: string) {
    period.value = newPeriod
    await getItems()
}

onMounted(async () => {
    await getItems()
})
</script>

<style lang="scss">
.chartgroup {
    border: solid 1px #e0e0e01a;
    padding: 1rem;

    .scrobbleinfo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $small;

        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: 900;

        border: solid 1px $gray5;
        padding: $medium 1.2rem;
        color: $gray1;

        .date {
            display: flex;
            align-items: center;
            gap: $small;

            svg {
                width: 1.25rem;
            }
        }

        .scrobbleinfo-trend {
            color: #8280f0;
            display: flex;
            align-items: center;
            gap: $small;
        }

        .trend {
            width: 1.25rem;
        }

        .trend.rising {
            transform: rotate(90deg);
            color: rgb(75, 170, 67);
        }

        .trend.falling {
            transform: rotate(-90deg);
            color: $red;
        }
    }
}
</style>
