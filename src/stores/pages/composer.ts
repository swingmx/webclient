import { defineStore } from 'pinia'

import { ComposerAlbumsPage, ComposerPage, ComposerWorksPage } from '@/interfaces'
import { getComposer, getComposerAlbums, getComposerTracks, getComposerWorks } from '@/requests/classical'
import useQueue from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'

export default defineStore('composerpage', {
    state: () => ({
        composer: null as ComposerPage | null,
        works: null as ComposerWorksPage | null,
        albums: null as ComposerAlbumsPage | null,
    }),
    actions: {
        async fetchComposer(composerhash: string, category?: string) {
            this.composer = await getComposer(composerhash, category)
        },
        async fetchWorks(composerhash: string, category?: string) {
            this.works = await getComposerWorks(composerhash, category)
        },
        async fetchAlbums(composerhash: string) {
            this.albums = await getComposerAlbums(composerhash)
        },
        /**
         * Queue every work by the composer, in page order or with the works
         * shuffled, and start playing.
         */
        async play(composerhash: string, name: string, shuffle = false) {
            const data = await getComposerTracks(composerhash)
            if (!data || !data.works.length) return

            const works = [...data.works]
            if (shuffle) {
                for (let i = works.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1))
                    ;[works[i], works[j]] = [works[j], works[i]]
                }
            }

            const tracks = works.flatMap(work => work.movements)
            useTracklist().setFromComposer(name, composerhash, tracks, works)
            useQueue().play(0)
        },
    },
})
