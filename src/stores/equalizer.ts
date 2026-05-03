import { defineStore } from 'pinia'
import { equalizerEngine } from '@/utils/equalizer/equalizer'
import { EQ_PRESETS, getPreset } from '@/utils/equalizer/eqPresets'

export const useEqualizer = defineStore('equalizer', {
    state: () => ({
        enabled: false, // EQ starts disabled
        bands: [0, 0, 0, 0, 0, 0, 0, 0], // 8 bands, all at 0dB initially
        currentPreset: 'Flat',
    }),
    
    getters: {
        /**
         * Check if any band is modified from flat (0dB)
         */
        isModified(): boolean {
            return this.bands.some(gain => gain !== 0)
        },
        
        /**
         * Get available presets
         */
        availablePresets(): string[] {
            return EQ_PRESETS.map(p => p.name)
        },
    },
    
    actions: {
        /**
         * Set gain for a specific band
         * Auto-enables EQ if user changes any band
         */
        setBandGain(bandIndex: number, gainDB: number) {
            if (bandIndex < 0 || bandIndex >= 8) return
            
            const clampedGain = Math.max(-12, Math.min(12, gainDB))
            this.bands[bandIndex] = clampedGain
            
            // Auto-enable EQ when user modifies any band
            if (!this.enabled && clampedGain !== 0) {
                this.enabled = true
                equalizerEngine.setEnabled(true)
            }
            
            // Apply to audio engine if EQ is enabled
            if (this.enabled) {
                equalizerEngine.setBandGain(bandIndex, clampedGain)
            }
            
            // Save to localStorage
            this.saveToLocalStorage()
        },
        
        /**
         * Toggle EQ on/off
         * When off, keeps values but bypasses processing
         */
        toggleEnabled() {
            this.enabled = !this.enabled
            
            if (this.enabled) {
                // Apply current bands to audio engine
                equalizerEngine.setEnabled(true)
                equalizerEngine.setAllBands(this.bands)
            } else {
                // Bypass EQ (set all gains to 0 in engine)
                equalizerEngine.setEnabled(false)
            }
            
            this.saveToLocalStorage()
        },
        
        /**
         * Load a preset
         */
        loadPreset(presetName: string) {
            const preset = getPreset(presetName)
            this.bands = [...preset.gains]
            this.currentPreset = presetName
            
            // Auto-enable EQ if preset is not flat
            if (this.isModified && !this.enabled) {
                this.enabled = true
            }
            
            // Apply to audio engine
            if (this.enabled) {
                equalizerEngine.setEnabled(true)
                equalizerEngine.setAllBands(this.bands)
            }
            
            this.saveToLocalStorage()
        },
        
        /**
         * Reset all bands to 0 (flat)
         */
        reset() {
            this.bands = [0, 0, 0, 0, 0, 0, 0, 0]
            this.currentPreset = 'Flat'
            
            if (this.enabled) {
                equalizerEngine.setAllBands(this.bands)
            }
            
            this.saveToLocalStorage()
        },
        
        /**
         * Load EQ settings from localStorage
         */
        loadFromLocalStorage() {
            try {
                const savedEnabled = localStorage.getItem('eq_enabled')
                const savedBands = localStorage.getItem('eq_bands')
                const savedPreset = localStorage.getItem('eq_preset')
                
                if (savedEnabled !== null) {
                    this.enabled = JSON.parse(savedEnabled)
                }
                
                if (savedBands) {
                    const parsed = JSON.parse(savedBands)
                    if (Array.isArray(parsed) && parsed.length === 8) {
                        this.bands = parsed
                    }
                }
                
                if (savedPreset) {
                    this.currentPreset = savedPreset
                }
                
                // Apply to audio engine if enabled
                if (this.enabled) {
                    equalizerEngine.setEnabled(true)
                    equalizerEngine.setAllBands(this.bands)
                }
            } catch (error) {
                console.warn('Failed to load EQ settings from localStorage:', error)
            }
        },
        
        /**
         * Save EQ settings to localStorage
         */
        saveToLocalStorage() {
            try {
                localStorage.setItem('eq_enabled', JSON.stringify(this.enabled))
                localStorage.setItem('eq_bands', JSON.stringify(this.bands))
                localStorage.setItem('eq_preset', this.currentPreset)
                
                // If custom preset, save it
                if (this.currentPreset === 'Custom') {
                    localStorage.setItem('eq_custom_preset', JSON.stringify(this.bands))
                }
            } catch (error) {
                console.warn('Failed to save EQ settings to localStorage:', error)
            }
        },
        
        /**
         * Load custom preset from localStorage if it exists
         */
        loadCustomPreset() {
            try {
                const customPreset = localStorage.getItem('eq_custom_preset')
                if (customPreset) {
                    const gains = JSON.parse(customPreset)
                    if (Array.isArray(gains) && gains.length === 8) {
                        this.bands = gains
                        this.currentPreset = 'Custom'
                        return true
                    }
                }
            } catch (error) {
                console.warn('Failed to load custom preset:', error)
            }
            return false
        },
    },
})

export default useEqualizer
