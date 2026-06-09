import { EQ_FREQUENCIES } from './eqPresets'

/**
 * Web Audio API Equalizer Engine
 * Creates and manages 8-band parametric equalizer using BiquadFilterNode
 */
export class EqualizerEngine {
    private audioContext: AudioContext | null = null
    private filters: BiquadFilterNode[] = []
    private sourceNodes: Map<HTMLAudioElement, MediaElementAudioSourceNode> = new Map()
    private enabled: boolean = false

    /**
     * Initialize the audio context and create filter nodes
     */
    initialize(audioContext: AudioContext) {
        this.audioContext = audioContext

        // Create 8 biquad filters for each frequency band
        this.filters = EQ_FREQUENCIES.map(freq => {
            const filter = audioContext.createBiquadFilter()
            filter.type = 'peaking'
            filter.frequency.value = freq
            filter.Q.value = 1.0 // Q factor (bandwidth)
            filter.gain.value = 0 // neutral (no boost/cut)
            return filter
        })

        // Chain filters together
        for (let i = 0; i < this.filters.length - 1; i++) {
            this.filters[i].connect(this.filters[i + 1])
        }
    }

    /**
     * Connect an audio element to the EQ chain
     * HTMLAudioElement → EQ Filters → Destination
     */
    connectAudioElement(audioElement: HTMLAudioElement): MediaElementAudioSourceNode | null {
        if (!this.audioContext) return null

        // Check if already connected
        if (this.sourceNodes.has(audioElement)) {
            return this.sourceNodes.get(audioElement)!
        }

        try {
            // Create source node from audio element
            const sourceNode = this.audioContext.createMediaElementSource(audioElement)
            this.sourceNodes.set(audioElement, sourceNode)

            // Connect: source → filter chain → destination
            if (this.filters.length > 0) {
                sourceNode.connect(this.filters[0])
                this.filters[this.filters.length - 1].connect(this.audioContext.destination)
            } else {
                // Fallback: direct connection if no filters
                sourceNode.connect(this.audioContext.destination)
            }

            return sourceNode
        } catch (error) {
            console.warn('Failed to connect audio element to EQ:', error)
            return null
        }
    }

    /**
     * Update a specific EQ band gain
     * @param bandIndex - Index of the band (0-7)
     * @param gainDB - Gain in decibels (-12 to +12)
     */
    setBandGain(bandIndex: number, gainDB: number) {
        if (bandIndex < 0 || bandIndex >= this.filters.length) return

        const clampedGain = Math.max(-12, Math.min(12, gainDB))
        this.filters[bandIndex].gain.value = clampedGain
    }

    /**
     * Update all bands at once
     * @param gains - Array of 8 gain values in dB
     */
    setAllBands(gains: number[]) {
        gains.forEach((gain, index) => {
            this.setBandGain(index, gain)
        })
    }

    /**
     * Enable or disable EQ (bypass mode)
     * When disabled, all gains are set to 0
     */
    setEnabled(enabled: boolean) {
        this.enabled = enabled

        if (!enabled) {
            // Bypass: set all gains to 0 (neutral)
            this.filters.forEach(filter => {
                filter.gain.value = 0
            })
        }
    }

    /**
     * Get current gain for a specific band
     */
    getBandGain(bandIndex: number): number {
        if (bandIndex < 0 || bandIndex >= this.filters.length) return 0
        return this.filters[bandIndex].gain.value
    }

    /**
     * Get all current gains
     */
    getAllGains(): number[] {
        return this.filters.map(filter => filter.gain.value)
    }

    /**
     * Check if EQ is enabled
     */
    isEnabled(): boolean {
        return this.enabled
    }

    /**
     * Resume audio context (required for iOS/Safari)
     */
    async resumeContext() {
        if (this.audioContext?.state === 'suspended') {
            await this.audioContext.resume()
        }
    }

    /**
     * Get audio context
     */
    getContext(): AudioContext | null {
        return this.audioContext
    }
}

// Singleton instance
export const equalizerEngine = new EqualizerEngine()
