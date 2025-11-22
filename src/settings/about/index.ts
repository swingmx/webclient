import { SettingCategory } from '@/interfaces/settings'
import { SettingType } from '../enums'
import InfoSvg from '@/assets/icons/info.svg?raw'
import { getT } from '@/i18n'

const { t } = getT();

export default <SettingCategory>{
    // title: 'About',
    groups: [
        {
            title: t("Settings.About.Title"),
            icon: InfoSvg,
            settings: [
                {
                    type: SettingType.about,
                },
            ],
        },
    ],
}
