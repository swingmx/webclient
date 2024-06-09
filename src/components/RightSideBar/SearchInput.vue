<template>
    <div
        class="gsearch-input"
        @click="
            !settings.use_sidebar &&
                $route.name !== Routes.search &&
                $router.push({
                    name: Routes.search,
                    params: { page: 'top' },
                    query: { q: search.query },
                })
        "
    >
        <div id="ginner" ref="inputRef" tabindex="0">
            <button
                v-auto-animate
                :title="tabs.current === tabs.tabs.search ? 'back to queue' : 'go to search'"
                :class="{ no_bg: on_nav }"
                @click.prevent="handleButton"
            >
                <SearchSvg v-if="on_nav || tabs.current === tabs.tabs.queue" />
                <BackSvg v-else />
            </button>
            <input
                id="globalsearch"
                v-model.trim="search.query"
                placeholder="Start typing to search"
                type="search"
                autocomplete="off"
                spellcheck="false"
                @blur.prevent="removeFocusedClass"
                @focus.prevent="addFocusedClass"
            />
            <div class="clear_input circular noSelect" :class="{ active: search.query.length > 0 }" @click.stop="clearInput">
                <CancelSvg />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import useSearch from "@/stores/search";
import useSettings from "@/stores/settings";
import useTabStore from "@/stores/tabs";
import { ref } from "vue";

import CancelSvg from "@/assets/icons/a.svg";
import BackSvg from "@/assets/icons/arrow.svg";
import SearchSvg from "@/assets/icons/search.svg";
import { Routes } from "@/router";

const props = defineProps<{
    on_nav?: boolean;
}>();

const tabs = useTabStore();
const search = useSearch();
const settings = useSettings();

// HANDLE FOCUS
const inputRef = ref<HTMLInputElement | null>(null);

// NOTE: Functions are used because classes are added to the sorrounding element
// and not the input itself.
function addFocusedClass() {
    if (inputRef.value) {
        inputRef.value.classList.add("search-focused");
    }
}

function removeFocusedClass() {
    if (inputRef.value) {
        inputRef.value.classList.remove("search-focused");
    }
}

function clearInput() {
    search.query = "";
    if (inputRef.value) {
        inputRef.value.focus();
    }
}

// @end

function handleButton() {
    if (props.on_nav) return;

    if (tabs.current === tabs.tabs.search) {
        tabs.switchToQueue();
    } else {
        tabs.switchToSearch();
    }
}
</script>

<style>
.clear_search {
    /* Style applied when clear_search class is active */
    visibility: visible;
    cursor: pointer;
}
</style>

<style lang="scss">
.right > .gsearch-input > #ginner > input {
    width: 140px;

    @include allPhones {
        width: 100%;
    }
}

.gsearch-input {
    display: grid;
    grid-template-columns: 1fr max-content;

    #ginner {
        width: 100%;
        display: flex;
        align-items: center;
        border-radius: 3rem;
        background-color: $gray5;
        outline: solid 2px transparent;
        transition: outline-color 0.2s ease-out;

        button {
            background: transparent;
            border: none;
            width: 2rem;
            height: 2rem;
            padding: 0;
            margin-left: 4px;
            border-radius: 3rem;
            cursor: pointer;
            flex-shrink: 0;

            &:hover {
                transition: all 0.2s ease;
                background-color: $gray2;
            }

            @include allPhones {
                display: none;
            }
        }

        button.no_bg {
            pointer-events: none;
        }

        input {
            width: 100%;
            border: none;
            line-height: 2.25rem;
            color: inherit;
            font-size: 14px;
            font-weight: 500;
            background-color: transparent;
            outline: none;
            appearance: none;
            text-overflow: ellipsis;

            @include allPhones {
                font-size: 0.9rem;
                font-weight: 600;
                padding-right: $small;
            }
        }

        .clear_input {
            cursor: pointer;
            margin-right: $smaller;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.3s ease-out, visibility 0.3s ease-out, background-color 0.2s ease-out;
            width: 1.75rem;
            aspect-ratio: 1;

            display: grid;
            place-items: center;

            &:hover {
                background-color: $gray;
            }

            svg {
                height: 1rem;
            }

            @include allPhones {
                width: $larger;
                border-radius: 4px;
                margin-right: $small;
            }
        }

        .clear_input.active {
            opacity: 1;
            visibility: visible;
        }

        .clear_input.active:active {
            opacity: 0.3;
        }

        @include allPhones {
            border-radius: unset;
            background-color: transparent;
        }
    }

    @include allPhones {
        width: 100%;
    }
}

.search-focused {
    outline: solid 2px #fff;

    @include allPhones {
        outline: none;
    }
}
</style>
