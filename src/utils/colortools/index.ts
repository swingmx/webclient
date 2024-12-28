import { brightness } from '@nextcss/color-tools'
import rgb2Hex from '@/utils/colortools/rgb2Hex'

export function getTypeColor(color: string) {
    const lightness = brightness(rgb2Hex(color))
    const is_light = lightness > 50
    return is_light ? 'rgb(109, 69, 16)' : '#ac8e68'
}