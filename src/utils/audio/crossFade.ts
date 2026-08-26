import useSettings from '../../stores/settings'
import { volumeRampGain } from './volume'

// how often the ramp updates the gain, in milliseconds
const STEP_MS = 25

// fades already running, keyed by element, so a new fade can cancel the old one
const running = new WeakMap<HTMLAudioElement, number>()

// fades an audio element in or out over the given duration, interpolated over slider
// positions rather than raw amplitude so that the ramp is even to the ear
export function crossFade({
    audio,
    duration = 1000,
    fade_out = false,
    then_destroy = false,
}: {
    audio: HTMLAudioElement
    duration?: number
    fade_out?: boolean
    then_destroy?: boolean
}) {
    const settings = useSettings()

    cancel(audio)

    if (audio.muted || duration < 1000 || !settings.use_crossfade) {
        audio.volume = settings.volume_gain
        return endCrossfade()
    }

    const started_at = performance.now()

    const interval = setInterval(() => {
        const progress = (performance.now() - started_at) / duration

        // read the position live so grabbing the slider mid-fade still works
        const [from, to] = fade_out ? [settings.volume, 0] : [0, settings.volume]
        audio.volume = volumeRampGain(from, to, progress)

        if (progress >= 1) endCrossfade()
    }, STEP_MS) as unknown as number

    running.set(audio, interval)

    function endCrossfade() {
        cancel(audio)

        if (then_destroy) {
            audio.pause()
            audio.src = ''
        }
    }
}

function cancel(audio: HTMLAudioElement) {
    const interval = running.get(audio)

    if (interval !== undefined) {
        clearInterval(interval)
        running.delete(audio)
    }
}
