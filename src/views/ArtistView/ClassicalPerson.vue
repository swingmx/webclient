<template>
    <div id="classical-person-scroller" class="content-page classical-person">
        <PersonHeader :page="page" @play="play" />
        <WorkList
            v-if="page.works.length || page.filters.length"
            :artisthash="page.artisthash"
            :title="page.type === 'composer' ? $t('Views.ComposerView.Works') : $t('Views.ComposerView.Repertoire')"
            :works="page.works"
            :filters="page.filters"
            :filter-key="page.filter_key"
            :filter="page.filter"
            :more-link="page.works_total > page.works.length"
            :show-composer="page.type === 'performer'"
        />
        <CardScroller
            v-for="section in albumSections"
            :key="section.key"
            :title="section.title"
            :items="section.albums.map(album => ({ type: 'album', item: album }))"
            :route="`/artists/${page.artisthash}/discography/${section.type}?artist=${page.name}`"
        />
        <ComposerAbout v-if="page.bio" :bio="page.bio" :url="page.wikipedia_url" />
        <ListeningStats v-if="page.listening" :listening="page.listening" variant="programme" />
        <PeopleGrid
            v-if="page.interpreters?.length"
            :title="$t('Views.ComposerView.Interpreters')"
            :people="people(page.interpreters, p => $t('Views.ComposerView.WorkCount', { n: p.works }, p.works ?? 0))"
            :limit="5"
        />
        <PeopleGrid
            v-if="page.composers?.length"
            :title="$t('Views.ComposerView.Composers')"
            :people="people(page.composers, p => $t('Views.ComposerView.WorkCount', { n: p.works }, p.works ?? 0), false)"
            :limit="10"
        />
        <PeopleGrid
            v-if="page.performs_with?.length"
            :title="$t('Views.ComposerView.PerformsWith')"
            :people="people(page.performs_with, p => $t('Views.ComposerView.AlbumCount', { n: p.albums }, p.albums ?? 0))"
            :limit="10"
        />
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'

import { discographyAlbumTypes } from '@/enums'
import { useT } from '@/i18n'
import { Album, ClassicalPersonPage, PersonAlbumSections, PersonEntry } from '@/interfaces'
import { getArtistRepertoire } from '@/requests/artists'
import useQueue from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import updatePageTitle from '@/utils/updatePageTitle'

import ComposerAbout from '@/components/Classical/ComposerAbout.vue'
import PeopleGrid, { GridPerson } from '@/components/Classical/PeopleGrid.vue'
import PersonHeader from '@/components/Classical/PersonHeader.vue'
import WorkList from '@/components/Classical/WorkList.vue'
import CardScroller from '@/components/shared/CardScroller.vue'
import ListeningStats from '@/components/shared/ListeningStats.vue'

const props = defineProps<{
    page: ClassicalPersonPage
}>()

const { t } = useT()

// album sections in page order, with their title and discography tab
const SECTIONS: { key: keyof PersonAlbumSections; type: string; title: () => string }[] = [
    { key: 'classical', type: discographyAlbumTypes.classical, title: () => t('Views.ComposerView.ClassicalAlbums') },
    { key: 'albums', type: discographyAlbumTypes.albums, title: () => t('Common.Album', 2) },
    { key: 'singles_and_eps', type: discographyAlbumTypes.EPs_and_singles, title: () => t('Common.Singles') },
    { key: 'live', type: discographyAlbumTypes.live, title: () => t('Views.ComposerView.LiveAlbums') },
    { key: 'soundtracks', type: discographyAlbumTypes.soundtracks, title: () => t('Views.ComposerView.Soundtracks') },
    { key: 'compilations', type: discographyAlbumTypes.compilations, title: () => t('Common.Compilations', 2) },
    { key: 'appearances', type: discographyAlbumTypes.appearances, title: () => t('Common.Appearances') },
]

const albumSections = computed(() => {
    const sections = SECTIONS.map(section => ({
        key: section.key,
        type: section.type,
        title: section.title(),
        albums: (props.page.albums[section.key] ?? []) as Album[],
    })).filter(section => section.albums.length)
    // with nothing else to set them apart, classical albums are just "Albums"
    if (sections.length === 1 && sections[0].key === 'classical') sections[0].title = t('Common.Album', 2)
    return sections
})

function people(entries: PersonEntry[], count: (entry: PersonEntry) => string, withRoles = true): GridPerson[] {
    return entries.map(entry => {
        const roles = withRoles && entry.roles?.length ? entry.roles.join(', ') : ''
        const detail = [roles && roles.charAt(0).toUpperCase() + roles.slice(1), count(entry)].filter(Boolean)
        return { name: entry.name, artisthash: entry.artisthash, detail: detail.join(' · ') }
    })
}

/**
 * Queue the whole repertoire in page order, or with the works shuffled.
 */
async function play(shuffle: boolean) {
    const data = await getArtistRepertoire(props.page.artisthash)
    if (!data || !data.works.length) return

    const works = [...data.works]
    if (shuffle) {
        for (let i = works.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[works[i], works[j]] = [works[j], works[i]]
        }
    }

    const tracks = works.flatMap(work => work.movements)
    const tracklist = useTracklist()
    tracklist.setFromArtist(props.page.artisthash, props.page.name, tracks)
    tracklist.indexWorks(works, tracks)
    useQueue().play(0)
}

function setTitle() {
    updatePageTitle(props.page.name)
}

onMounted(setTitle)
watch(() => props.page.artisthash, setTitle)
</script>

<style lang="scss">
.classical-person {
    height: 100%;
    overflow: auto;
    padding-bottom: 4rem;

    .cardscroller {
        padding: 2rem 1rem 0;
    }
}
</style>
