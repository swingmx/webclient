import { ref } from 'vue'
import { defineStore } from 'pinia'

import { ClassicalHomePage } from '@/interfaces'
import { getClassicalHome } from '@/requests/classical'

export default defineStore('classicalHome', () => {
    // the last page fetched, shown again while the next fetch runs
    const page = ref<ClassicalHomePage | null>(null)

    async function fetch(cardLimit: number) {
        page.value = await getClassicalHome(cardLimit)
    }

    function clear() {
        page.value = null
    }

    return { page, fetch, clear }
})
