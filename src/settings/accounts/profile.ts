import { SettingCategory } from '@/interfaces/settings'
import { SettingType } from '../enums'

export default <SettingCategory>{
    groups: [
        {
            title: 'Profile',
            settings: [
                {
                    type: SettingType.profile,
                },
            ],
        },
    ],
}
