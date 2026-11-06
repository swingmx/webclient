import DesktopSvg from '@/assets/icons/desktop.svg'
import LaptopSvg from '@/assets/icons/laptop.svg'
import PhoneSvg from '@/assets/icons/phone.svg'
import { useT } from '@/i18n'

export type Device = { id: string; name: string; type: string; selectable: boolean }

export { DesktopSvg, LaptopSvg, PhoneSvg }

export function deviceIcon(device: Device) {
    return device.type === 'web' ? LaptopSvg : PhoneSvg
}

export function deviceTitle(device: Device, hostId: string) {
    if (device.id === hostId) return useT().t('RemoteControl.ThisBrowser')
    return device.type === 'web' ? device.name.replace(/\s*\(.*\)$/, '') : device.name
}

export function deviceDetail(device: Device) {
    const { t } = useT()
    if (device.type === 'ios') return t('RemoteControl.App', { platform: 'iOS' })
    if (device.type === 'android') return t('RemoteControl.App', { platform: 'Android' })
    const match = device.name.match(/\((.+) on (.+)\)$/)
    return match ? `${match[1]} · ${match[2]}` : device.name
}
