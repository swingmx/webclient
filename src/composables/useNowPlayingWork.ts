import { computed } from 'vue'

import { ClassicalMovement } from '@/interfaces'
import useQueue from '@/stores/queue'
import useTracklist from '@/stores/queue/tracklist'
import composerSurname from '@/utils/composerSurname'
import sameTitle from '@/utils/sameTitle'

/**
 * The playing movement's lines: its name, then its composer's surname and
 * its work. A movement that is the whole work takes the work as its name.
 * Null for a track not queued under a work.
 */
export default function useNowPlayingWork() {
    const queue = useQueue()
    const tracklist = useTracklist()

    return computed(() => {
        const track = queue.currenttrack as ClassicalMovement | undefined
        const work = track?.workhash ? tracklist.worklist[track.workhash] : undefined
        if (!track || !work) return null

        const catalogue = work.catalogue_ids[0]?.name
        const workName = work.nickname
            ? `${work.name} “${work.nickname}”`
            : [work.name, catalogue].filter(Boolean).join(', ')
        const movement = track.movement_title ?? ''
        const whole = sameTitle(movement, work.name)

        return {
            title: whole ? workName : (track.movement_name ?? movement),
            work: whole ? null : workName,
            composer: work.composer ? composerSurname(work.composer) : null,
            composer_hash: work.composer_hash,
            workhash: work.workhash,
            albumhash: track.albumhash,
        }
    })
}
