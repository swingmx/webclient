import { SettingType } from '../enums'
import AvatarSvg from '@/assets/icons/phone.svg?raw'
import { SettingCategory } from '@/interfaces/settings'

export default <SettingCategory>{
    groups: [
        {
            title: 'Pair device',
            desc: 'Login to the mobile client using QR code',
            icon: AvatarSvg,
            settings: [
                {
                    type: SettingType.pairing,
                },
            ],
        },
    ],
}
