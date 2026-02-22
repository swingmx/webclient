import { SettingType } from '../enums'
import { SettingCategory } from '@/interfaces/settings'

import KeySvg from '@/assets/icons/key.svg?raw'
import InfoSvg from '@/assets/icons/info.svg?raw'

export default <SettingCategory>{
    groups: [
        {
            title: 'Subscription',
            desc: 'Manage your subscription, license keys and authorized devices',
            displayName: 'Subscription and License Settings',
            icon: KeySvg,
            settings: [
                {
                    type: SettingType.license,
                },
            ],
        },
        {
            title: 'About',
            icon: InfoSvg,
            settings: [
                {
                    type: SettingType.about,
                },
            ],
        },
    ],
}
