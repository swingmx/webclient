import { WorkPerformer } from '@/interfaces'
import { GridPerson } from '@/components/Classical/PeopleGrid.vue'

/**
 * Performers as people-grid entries: their roles as the detail line.
 */
export default function performerGrid(performers: WorkPerformer[]): GridPerson[] {
    return performers.map(performer => {
        const roles = performer.roles.join(', ')
        return {
            name: performer.name,
            artisthash: performer.artisthash,
            detail: roles.charAt(0).toUpperCase() + roles.slice(1),
        }
    })
}
