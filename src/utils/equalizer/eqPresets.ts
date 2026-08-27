/**
 * Equalizer preset configurations
 * 8 bands: 60Hz, 150Hz, 400Hz, 1kHz, 2.4kHz, 6kHz, 12kHz, 15kHz
 * Values in dB (-12 to +12)
 */

import presetsData from './presets.json'

// Constants for band configuration
export const EQ_BAND_COUNT = 8
export const EQ_GAIN_MIN = -12
export const EQ_GAIN_MAX = 12

// Readonly frequency array - prevents accidental mutations
export const EQ_FREQUENCIES = [60, 150, 400, 1000, 2400, 6000, 12000, 15000] as const

// Type-safe gains array with exactly 8 bands
export type EQGains = readonly [number, number, number, number, number, number, number, number]

export interface EQPreset {
    name: string
    gains: EQGains
}

// Default flat preset as fallback
const DEFAULT_PRESET: EQPreset = {
    name: 'Flat',
    gains: [0, 0, 0, 0, 0, 0, 0, 0] as EQGains
}

/**
 * Validate presets data structure
 */
function validatePresetsData(data: any): data is { presets: EQPreset[] } {
    return (
        data &&
        Array.isArray(data.presets) &&
        data.presets.every((p: any) => 
            typeof p.name === 'string' &&
            Array.isArray(p.gains) &&
            p.gains.length === EQ_BAND_COUNT &&
            p.gains.every((g: any) => 
                typeof g === 'number' && 
                g >= EQ_GAIN_MIN && 
                g <= EQ_GAIN_MAX
            )
        )
    )
}

/**
 * Type guard for gains array
 */
export function isValidGains(gains: unknown): gains is EQGains {
    return (
        Array.isArray(gains) &&
        gains.length === EQ_BAND_COUNT &&
        gains.every(g => typeof g === 'number' && g >= EQ_GAIN_MIN && g <= EQ_GAIN_MAX)
    )
}

/**
 * Create validated EQ gains with clamping
 */
export function createEQGains(gains: number[]): EQGains {
    if (gains.length !== EQ_BAND_COUNT) {
        throw new Error(`Expected ${EQ_BAND_COUNT} bands, got ${gains.length}`)
    }
    
    return gains.map(g => 
        Math.max(EQ_GAIN_MIN, Math.min(EQ_GAIN_MAX, g))
    ) as EQGains
}

// Load and validate presets with fallback
export const EQ_PRESETS: EQPreset[] = validatePresetsData(presetsData) 
    ? presetsData.presets 
    : [DEFAULT_PRESET]

/**
 * Get preset by name with safe fallback
 */
export function getPreset(name: string): EQPreset {
    const preset = EQ_PRESETS.find(p => p.name === name)
    
    if (preset) return preset
    
    if (EQ_PRESETS.length > 0) return EQ_PRESETS[0]
    
    // Fallback if presets array is somehow empty
    return DEFAULT_PRESET
}

/**
 * Format frequency for display (e.g., 1000 -> "1kHz")
 */
export function formatFrequency(freq: number): string {
    if (freq >= 1000) {
        const kHz = freq / 1000
        return kHz % 1 === 0 ? `${kHz}kHz` : `${kHz.toFixed(1)}kHz`
    }
    return `${freq}Hz`
}
