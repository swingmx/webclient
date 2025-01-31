import { Artist, Album, Page } from '@/interfaces'
import { getPage } from '@/requests/pages'
import { defineStore } from 'pinia'

export default defineStore('page', {
    state: () => ({
        page: <Page | null>null,
    }),
    actions: {
        async fetchPage(page_no: string) {
            this.page = await getPage(page_no)
        },
        async removeLocalItem(item: Album | Artist, type: 'album' | 'artist') {
            if (!this.page) return

            if (type == 'album') {
                this.page.items = this.page.items.filter(i => {
                    return (i as Album).albumhash != (item as Album).albumhash
                })
            } else {
                this.page.items = this.page.items.filter(i => {
                    return (i as Artist).artisthash != (item as Artist).artisthash
                })
            }
        },
    },
})
