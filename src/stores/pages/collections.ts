import { Album, Artist, Collection } from '@/interfaces'
import { getCollection } from '@/requests/collections'
import { defineStore } from 'pinia'

export default defineStore('collections', {
    state: () => ({
        collection: <Collection | null>null,
    }),
    actions: {
        async fetchCollection(collection_id: string) {
            this.collection = await getCollection(collection_id)
        },
        async removeLocalItem(item: Album | Artist, type: 'album' | 'artist') {
            if (!this.collection) return

            if (type == 'album') {
                this.collection.items = this.collection.items.filter(i => {
                    return (i as Album).albumhash != (item as Album).albumhash
                })
            } else {
                this.collection.items = this.collection.items.filter(i => {
                    return (i as Artist).artisthash != (item as Artist).artisthash
                })
            }
        },
        clearStore() {
            this.collection = null
        },
    },
})
