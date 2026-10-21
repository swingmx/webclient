import { WorkPerformer } from '@/interfaces'
import { GridPerson } from '@/components/Classical/PeopleGrid.vue'

/**
 * Performers as people-grid entries: their roles as the detail line.
 */
export default function performerGrid(performers: WorkPerformer[]): GridPerson[] {
    return performers.map(performer => ({
        name: performer.name,
        artisthash: performer.artisthash,
        detail: performer.roles,
    }))
}
