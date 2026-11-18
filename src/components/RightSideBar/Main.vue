<template>
    <div class="r-sidebar">
        <div class="rtopbar">
            <SearchInput />
            <AvatarWithDropdown />
        </div>
        <div v-auto-animate class="r-content no-scroll">
            <div v-if="tabs.current === tabs.tabs.home" class="r-dash">
                <DashBoard />
            </div>
            <div v-if="tabs.current === tabs.tabs.search" class="r-search">
                <Search />
            </div>
            <div v-if="tabs.current === tabs.tabs.queue" class="r-queue">
                <Queue />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useTabStore from '@/stores/tabs'

import AvatarWithDropdown from '@/components/nav/AvatarWithDropdown.vue'
import DashBoard from './Home/Main.vue'
import Queue from './Queue.vue'
import Search from './Search/Main.vue'
import SearchInput from './SearchInput.vue'

const tabs = useTabStore()
</script>

<style lang="scss">
.r-sidebar {
    width: 100%;
    display: grid;
    grid-template-rows: max-content 1fr;
    background-color: rgb(22, 22, 22);
    border-top: none;
    border-bottom: none;

    .rtopbar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-right: 1.25rem;
    }

    .gsearch-input {
        height: 2.5rem;
        margin: 1rem 1rem 1rem 1.25rem;
        width: 100%;

        #ginner {
            button:not(.cmdk-keys) {
                width: 2rem;
                height: 2rem;
                margin-left: 4px;
                margin-right: $smallest;

                > svg {
                    width: 1.75rem;
                    height: 1.75rem;
                }
            }
            > .clear_input {
                width: 2rem;
                height: 2rem;
            }
        }
    }

    .r-content {
        width: 100%;
        height: 100%;
        // background-color: $gray;

        .r-search {
            height: 100%;
            padding: 0 0.25rem;

            &,
            * {
                @include hideScrollbars;
            }
        }

        .r-dash {
            height: 100%;
        }

        .r-queue {
            height: 100%;
            overflow: hidden;
            display: grid;
            gap: $small;
            grid-template-rows: max-content 1fr;
        }

        #queue-scrollable {
            padding: 0 0.75rem 2rem 0.75rem;
            scrollbar-gutter: auto;
            @include hideScrollbars;
        }

        .now-playing-top {
            margin: 0 1.25rem;
            scrollbar-gutter: auto;
        }

        .track-item.currentInQueue,
        .queue-movement .row.current,
        .queue-work-head .row.current {
            background-color: $gray5;
        }
    }

    .top-result-item {
        background-color: $gray5;
    }
}
</style>
