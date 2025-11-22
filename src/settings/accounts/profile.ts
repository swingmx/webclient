import { SettingCategory } from '@/interfaces/settings'
import { SettingType } from '../enums'
import { getT } from '@/i18n'

const { t } = getT()

export default <SettingCategory>{
    groups: [
        {
            title: t('Settings.Profile.Title'),
            settings: [
                {
                    type: SettingType.profile,
                },
            ],
        },
    ],
}
