import { loggedInUserIsAdmin } from '../utils'

import { SettingCategory } from '@/interfaces/settings'
import AvatarSvg from '@/assets/icons/phone.svg?raw'
import { SettingType } from '../enums'

export default <SettingCategory>{
    groups: [
        {
            title: 'Pair device',
            icon: AvatarSvg,
            settings: [
                {
                    type: SettingType.pairing,
                },
            ],
        },
    ],
}
