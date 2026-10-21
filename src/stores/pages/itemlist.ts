import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { paths } from '@/config'
import { Album } from '@/interfaces'
import useAxios from '@/requests/useAxios'
import { router } from '@/router'

/**
 * A paged library list loaded from `endpoint`.
 */
const listState = (endpoint: () => string) => () => {
    const total = ref(0)

    const items = ref(<Album[]>[])

    const sortby = ref('created_date')

    const reverse = ref(true)

    const reverse_string = computed(() => {
        return reverse.value ? '1' : ''
    })

    let latestIndex = 0
    const canFetch = ref(true)
    const pageSize = 50

    function restart() {
        items.value = []
        latestIndex = 0
        return getAlbums(latestIndex)
    }

    function setSort(newval: string) {
        if (newval === sortby.value) {
            reverse.value = !reverse.value
            return
        }

        sortby.value = newval
        reverse.value = true
    }

    function setReverse(reverse_new: boolean) {
        reverse.value = reverse_new
    }

    async function getAlbums(start: number) {
        // stop once the whole list is in
        if (!canFetch.value || (total.value && items.value.length >= total.value)) return

        canFetch.value = false

        const res = await useAxios({
            url:
                endpoint() +
                `?start=${start}&limit=${pageSize}&sortby=${sortby.value}&reverse=${reverse_string.value}`,
            method: 'GET',
        })

        const { data } = res
        if (!total.value) {
            total.value = data.total
        }

        items.value.push(...data.items)
        latestIndex += pageSize
        canFetch.value = true
    }

    function getMoreAlbums() {
        return getAlbums(latestIndex)
    }

    function clearStore(routeName: string) {
        setTimeout(() => {
            if (router.currentRoute.value.name == routeName) {
                return
            }

            items.value = []
            total.value = 0
            latestIndex = 0
            canFetch.value = true
        }, 5000)
    }

    return {
        total,
        items,
        sortby,
        reverse,
        canFetch,
        restart,
        setSort,
        setReverse,
        getAlbums,
        getMoreAlbums,
        clearStore,
    }
}

const afterRestore = (context: any) => {
    context.store.$state.items = []
    context.store.$state.total = 0
    context.store.$state.latestIndex = 0
    context.store.$state.canFetch = true
}

export const useAlbumList = defineStore('albumlistpage', listState(() => paths.api.getall.albums), {
    persist: {
        afterRestore: afterRestore,
    },
})

export const useArtistList = defineStore('artistlistpage', listState(() => paths.api.getall.artists), {
    persist: {
        afterRestore: afterRestore,
    },
})
