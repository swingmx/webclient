import useWorkStore from '@/stores/pages/work'
import useTracklist from '@/stores/queue/tracklist'

import { AddToQueueIcon, PlayNextIcon } from '@/icons'
import { Option } from '@/interfaces'
import { useT } from '@/i18n'

const { t } = useT()

/**
 * Queue options for the movements of the open work page's recording.
 */
export default async () => {
    const store = useWorkStore()

    const works = () => (store.asWork ? [store.asWork] : undefined)

    const play_next = <Option>{
        label: t('Menus.Common.PlayNext'),
        action: () => useTracklist().insertAfterCurrent(store.tracks, works()),
        icon: PlayNextIcon,
    }

    const add_to_queue = <Option>{
        label: t('Menus.Common.AddToQueue'),
        action: () => useTracklist().addTracks(store.tracks, works()),
        icon: AddToQueueIcon,
    }

    return [play_next, add_to_queue]
}
