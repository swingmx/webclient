import { defineStore } from 'pinia'
import Vibrant from 'node-vibrant'
import listToRgbString from '@/utils/colortools/listToRgbString'

async function getImageColor(url: string) {
    const vib = new Vibrant(url)

    const palette = await vib.getPalette()
    const colors = [
        palette.LightMuted,
        palette.DarkMuted,
        palette.DarkVibrant,
        palette.Vibrant,
        palette.LightVibrant,
        palette.Muted,
    ].map(color => listToRgbString(color?.getRgb()) || '')

    return {
        lightMuted: colors[0],
        darkMuted: colors[1],
        darkVibrant: colors[2],
        vibrant: colors[3],
        lightVibrant: colors[4],
        muted: colors[5],
    }
}

export default defineStore('SwingMusicColors', {
    state: () => ({
        lightMuted: '',
        darkMuted: '',
        darkVibrant: '',
        vibrant: '',
        lightVibrant: '',
        muted: '',
    }),
    actions: {
        async setTheme1Color(url: string) {
            const { lightMuted, darkMuted, darkVibrant, vibrant, lightVibrant, muted } = await getImageColor(url)
            this.lightMuted = lightMuted
            this.darkMuted = darkMuted
            this.darkVibrant = darkVibrant
            this.vibrant = vibrant
            this.lightVibrant = lightVibrant
            this.muted = muted
        },
    },
    persist: true,
})
