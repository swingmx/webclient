import { SettingCategory } from '@/interfaces/settings'
import AvatarSvg from '@/assets/icons/avatar.svg?raw'

export default <SettingCategory>{
    groups: [
        {
            title: 'Accounts',
            icon: AvatarSvg,
            settings: [{}]
        },
    ],
}
