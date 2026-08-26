// maps a slider position onto an amplitude with a decibel-linear taper, so that equal
// slider movement gives an equal perceived change in loudness
// https://www.dr-lex.be/info-stuff/volumecontrols.html

// how far below full scale the bottom of the slider sits, in decibels
export const VOLUME_RANGE_DB = 50

// slider positions under this are faded to silence so that 0 means properly muted
const FADE_BELOW = 0.05

// gain at the bottom of the taper, before the fade-to-silence is applied
const MIN_GAIN = decibelsToGain(-VOLUME_RANGE_DB)

export function clamp(value: number, min = 0, max = 1) {
    if (Number.isNaN(value)) return min
    return Math.min(Math.max(value, min), max)
}

function decibelsToGain(db: number) {
    return Math.pow(10, db / 20)
}

// converts a slider position (0 silent, 1 full) into the amplitude for an audio element
export function volumeToGain(position: number) {
    const pos = clamp(position)

    if (pos <= 0) return 0
    if (pos >= 1) return 1

    // straight line in dB: full scale at 1, -VOLUME_RANGE_DB as we approach 0
    let gain = Math.pow(MIN_GAIN, 1 - pos)

    // ease that floor down to actual silence over the last sliver of travel
    if (pos < FADE_BELOW) {
        gain *= pos / FADE_BELOW
    }

    return clamp(gain)
}

// interpolates between two slider positions and returns the resulting gain
export function volumeRampGain(from: number, to: number, progress: number) {
    const t = clamp(progress)
    return volumeToGain(from + (to - from) * t)
}
