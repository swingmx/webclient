import { defineStore } from 'pinia'

import { ClassicalWork, ClassicalWorkPage, Track } from '@/interfaces'
import { getWork } from '@/requests/classical'

export default defineStore('workpage', {
    state: () => ({
        token: '',
        work: null as ClassicalWorkPage | null,
    }),
    actions: {
        async fetchWork(token: string, albumhash?: string) {
            this.token = token
            this.work = await getWork(token, albumhash)
        },
    },
    getters: {
        tracks(): Track[] {
            return this.work?.recording.movements ?? []
        },
        asWork(): ClassicalWork | null {
            if (!this.work) return null

            const { recording, other_recordings, ...header } = this.work
            return { ...header, movements: recording.movements }
        },
    },
})
