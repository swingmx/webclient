import { SettingCategory } from '@/interfaces/settings'
import AvatarSvg from '@/assets/icons/avatar.svg?raw'
import { SettingType } from '../enums'

export default <SettingCategory>{
    groups: [
        {
            title: 'Accounts',
            icon: AvatarSvg,
            settings: [{
                type: SettingType.accounts
            }]
        },
    ],
}
