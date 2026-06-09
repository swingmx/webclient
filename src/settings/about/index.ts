import { SettingType } from '../enums'
import { SettingCategory } from '@/interfaces/settings'

import KeySvg from '@/assets/icons/key.svg?raw'
import InfoSvg from '@/assets/icons/info.svg?raw'

export default <SettingCategory>{
    groups: [
        {
            title: 'License',
            desc: 'Manage your license key, subscription and authorized devices',
            displayName: 'License and Subscription',
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
