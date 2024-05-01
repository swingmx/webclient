import { SettingCategory } from '@/interfaces/settings'
import { SettingType } from '../enums'
import InfoSvg from '@/assets/icons/info.svg?raw'

export default <SettingCategory>{
    // title: 'About',
    groups: [
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
