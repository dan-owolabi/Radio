import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { RadioBand, Station } from '../data/stationData'
import { clampFrequency, findNearestStation } from '../data/stationData'

export type PlaybackState = 'idle' | 'loading' | 'playing' | 'error'
export type RadioType = 'Hybrid' | 'Live' | 'Digital'

interface RadioState {
    // Core state
    frequency: number
    band: RadioBand
    activeStation: Station | null
    playbackState: PlaybackState
    isPoweredOn: boolean  // Power state

    // Audio settings
    volume: number // 0-1
    tempo: number // 0-100 maps to 0.9x-1.1x

    // UI settings
    radioType: RadioType

    // Band memory - remembers last frequency per band
    bandMemory: Record<RadioBand, number>

    // Actions
    setFrequency: (frequency: number, shouldSnap?: boolean) => void
    setBand: (band: RadioBand) => void
    setActiveStation: (station: Station | null) => void
    setPlaybackState: (state: PlaybackState) => void
    setVolume: (volume: number) => void
    setTempo: (tempo: number) => void
    setRadioType: (type: RadioType) => void
    togglePower: () => void

    // Helpers
    tuneToStation: (station: Station) => void
    snapToNearestStation: () => Station | null

    // Computed helpers
    getEffectiveTempo: () => number  // Returns tempo based on radio type
    isTempoLocked: () => boolean    // True if tempo should be locked (Live mode)
}

export const useRadioStore = create<RadioState>()(
    persist(
        (set, get) => ({
            // Initial state
            frequency: 92.9,
            band: 'FM',
            activeStation: null,
            playbackState: 'idle',
            isPoweredOn: true,
            volume: 0.5,
            tempo: 50, // 50 = 1.0x
            radioType: 'Hybrid',
            bandMemory: {
                FM: 92.9,
                MW: 720,
                SW: 6195,
                LW: 183,
            },

            // Actions
            setFrequency: (frequency, shouldSnap = true) => {
                const { band, bandMemory, isPoweredOn } = get()
                if (!isPoweredOn) return

                const clampedFreq = clampFrequency(frequency, band)

                // Check for nearby station if snapping is enabled
                let newStation: Station | null = null
                if (shouldSnap) {
                    newStation = findNearestStation(clampedFreq, band)
                }

                set({
                    frequency: newStation ? newStation.frequency : clampedFreq,
                    activeStation: newStation,
                    bandMemory: { ...bandMemory, [band]: newStation ? newStation.frequency : clampedFreq },
                })
            },

            setBand: (band) => {
                const { bandMemory, isPoweredOn } = get()
                if (!isPoweredOn) return

                const rememberedFreq = bandMemory[band]

                // Find station at remembered frequency
                const station = findNearestStation(rememberedFreq, band)

                set({
                    band,
                    frequency: rememberedFreq,
                    activeStation: station,
                })
            },

            setActiveStation: (station) => {
                const { isPoweredOn } = get()
                if (!isPoweredOn) return
                set({ activeStation: station })
            },

            setPlaybackState: (playbackState) => {
                set({ playbackState })
            },

            setVolume: (volume) => {
                set({ volume: Math.max(0, Math.min(1, volume)) })
            },

            setTempo: (tempo) => {
                const { radioType } = get()
                // In Live mode, tempo is locked to 50 (1.0x)
                if (radioType === 'Live') return
                set({ tempo: Math.max(0, Math.min(100, tempo)) })
            },

            setRadioType: (radioType) => {
                // When switching to Live mode, lock tempo to 50 (1.0x)
                if (radioType === 'Live') {
                    set({ radioType, tempo: 50 })
                } else {
                    set({ radioType })
                }
            },

            togglePower: () => {
                const { isPoweredOn } = get()

                if (isPoweredOn) {
                    // Turn off - stop playback
                    set({ isPoweredOn: false, playbackState: 'idle' })
                } else {
                    // Turn on - restore state (activeStation stays in memory)
                    set({ isPoweredOn: true })
                }
            },

            tuneToStation: (station) => {
                const { bandMemory, isPoweredOn } = get()
                if (!isPoweredOn) return

                set({
                    frequency: station.frequency,
                    band: station.band,
                    activeStation: station,
                    bandMemory: { ...bandMemory, [station.band]: station.frequency },
                })
            },

            snapToNearestStation: () => {
                const { frequency, band, isPoweredOn } = get()
                if (!isPoweredOn) return null

                const station = findNearestStation(frequency, band)
                if (station) {
                    set({ activeStation: station, frequency: station.frequency })
                }
                return station
            },

            // Computed helpers
            getEffectiveTempo: () => {
                const { radioType, tempo } = get()
                // Live mode always returns 50 (1.0x)
                if (radioType === 'Live') return 50
                return tempo
            },

            isTempoLocked: () => {
                const { radioType } = get()
                return radioType === 'Live'
            },
        }),
        {
            name: 'radio-storage',
            partialize: (state) => ({
                frequency: state.frequency,
                band: state.band,
                volume: state.volume,
                tempo: state.tempo,
                radioType: state.radioType,
                bandMemory: state.bandMemory,
                isPoweredOn: state.isPoweredOn,
            }),
        }
    )
)
