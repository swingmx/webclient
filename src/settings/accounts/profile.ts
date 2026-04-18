import { SettingCategory } from '@/interfaces/settings'
import { SettingType } from '../enums'

export default <SettingCategory>{
    groups: [
        {
            title: 'Profile',
            desc: 'Manage your profile and login information',
            settings: [
                {
                    type: SettingType.profile,
                },
            ],
        },
    ],
}
