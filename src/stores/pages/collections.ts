import { Album, Artist, Collection, Playlist, Track } from '@/interfaces'
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
        async removeLocalItem(
            item: Album | Artist | Playlist | Track,
            type: 'album' | 'artist' | 'playlist' | 'track'
        ) {
            if (!this.collection) return

            if (type == 'album') {
                this.collection.items = this.collection.items.filter(i => {
                    return !('albumhash' in i) || i.albumhash != (item as Album).albumhash
                })
            } else if (type == 'artist') {
                this.collection.items = this.collection.items.filter(i => {
                    return !('artisthash' in i) || i.artisthash != (item as Artist).artisthash
                })
            } else if (type == 'playlist') {
                this.collection.items = this.collection.items.filter(i => {
                    return !('id' in i && 'trackhashes' in i) || i.id != (item as Playlist).id
                })
            } else {
                this.collection.items = this.collection.items.filter(i => {
                    return !('trackhash' in i) || i.trackhash != (item as Track).trackhash
                })
            }
        },
        clearStore() {
            this.collection = null
        },
    },
})
