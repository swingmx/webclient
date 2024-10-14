<template>
    <div class="chartgroup rounded" :class="group">
        <ChartsHeader :name="group" @change-period="changePeriod" @change-group="changeGroup" :period="period" />
        <br />
        <div class="noitems rounded-sm" v-if="items.length === 0">
            <div v-if="loading" class="loading">
                <div class="spinner"></div>
                <span>fetching data...</span>
            </div>
            <div v-if="!loading && loaded">No {{ group.slice(0, -1) }} data found for this period</div>
        </div>
        <ChartItem
            v-for="(item, index) in items"
            :key="index"
            :item="item"
            :index="index + 1"
            :name="(group.slice(0, -1) as any)"
        />
        <div class="scrobbleinfo rounded-sm">
            <div class="date">
                <CalendarSvg />
                {{ scrobbleInfo?.dates }}
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
import { computed, onMounted, reactive, ref } from 'vue'

import { getChartItem } from '@/requests/stats'
import { Artist, Album, Track } from '@/interfaces'

import ChartItem from './ChartItem.vue'
import ChartsHeader from './ChartsHeader.vue'
import ArrowSvg from '@/assets/icons/arrow.svg'
import CalendarSvg from '@/assets/icons/calendar.svg'

// Reactive variables
const loading = ref(true)
const loaded = ref(false)

const group = ref('artists')
const period = ref('alltime')
const items2: any = reactive({
    tracks: <Track[]>[],
    albums: <Album[]>[],
    artists: <Artist[]>[],
})

const items = computed(() => {
    return items2[group.value]
})

const scrobbleInfo = ref<{
    text: string
    trend: string
    dates: string
} | null>(null)

// Functions
async function getItems() {
    items2[group.value] = []
    loaded.value = false
    let isPending = true
    
    // Set a timeout to show the loader after 250ms
    setTimeout(() => {
        if (isPending) {
            loading.value = true
        }
    }, 450)

    try {
        const res = await getChartItem(group.value, period.value, 10, 'playduration')
        items2[group.value] = res.data[group.value]
        scrobbleInfo.value = res.data.scrobbles
        loaded.value = true
    } finally {
        isPending = false
        loading.value = false
        loaded.value = true
    }
}

async function changePeriod(newPeriod: string) {
    period.value = newPeriod
    await getItems()
}

async function changeGroup(newGroup: string) {
    group.value = newGroup
    await getItems()
}

onMounted(async () => {
    await getItems()
})
</script>

<style lang="scss">
.chartgroup {
    .loading {
        display: flex;
        gap: $small;
    }

    .noitems {
        height: 3.25rem;
        padding: 1rem;
        background-color: $gray;
        margin: 1rem;
        margin-bottom: 2rem;
        color: $white;
    }

    .scrobbleinfo {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: $small;

        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: 900;

        margin: $medium 1.2rem;
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
