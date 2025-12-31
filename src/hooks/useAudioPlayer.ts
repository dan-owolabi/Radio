import { useEffect, useCallback } from 'react'
import { useRadioStore } from '../stores/useRadioStore'
import {
    getAudioInstance,
    playStation,
    stopAudio,
    setVolume as setAudioVolume,
    setPlaybackRate,
    getCurrentStationId,
} from '../audioManager'

/**
 * Custom hook for managing audio playback
 * Uses singleton audio manager to prevent multiple audio instances
 */
export function useAudioPlayer() {
    const {
        activeStation,
        playbackState,
        volume,
        isPoweredOn,
        getEffectiveTempo,
        setPlaybackState,
    } = useRadioStore()

    // Setup audio event listeners once
    useEffect(() => {
        const audio = getAudioInstance()

        const handleLoadStart = () => setPlaybackState('loading')
        const handlePlaying = () => setPlaybackState('playing')
        const handleError = () => setPlaybackState('error')
        const handleEnded = () => setPlaybackState('idle')
        const handlePause = () => {
            if (!audio.ended) setPlaybackState('idle')
        }

        audio.addEventListener('loadstart', handleLoadStart)
        audio.addEventListener('playing', handlePlaying)
        audio.addEventListener('error', handleError)
        audio.addEventListener('ended', handleEnded)
        audio.addEventListener('pause', handlePause)

        return () => {
            audio.removeEventListener('loadstart', handleLoadStart)
            audio.removeEventListener('playing', handlePlaying)
            audio.removeEventListener('error', handleError)
            audio.removeEventListener('ended', handleEnded)
            audio.removeEventListener('pause', handlePause)
        }
    }, [setPlaybackState])

    // Handle station changes and power state
    useEffect(() => {
        if (!isPoweredOn) {
            stopAudio()
            return
        }

        if (activeStation) {
            // Only switch if station actually changed
            if (getCurrentStationId() !== activeStation.id) {
                playStation(activeStation.id, activeStation.streamUrl)
                    .catch(() => setPlaybackState('error'))
            }
        } else {
            stopAudio()
            setPlaybackState('idle')
        }
    }, [activeStation, isPoweredOn, setPlaybackState])

    // Handle volume changes
    useEffect(() => {
        setAudioVolume(volume)
    }, [volume])

    // Handle tempo/playback rate changes (uses effective tempo based on radio type)
    useEffect(() => {
        const effectiveTempo = getEffectiveTempo()
        const rate = 0.9 + (effectiveTempo / 100) * 0.2
        setPlaybackRate(rate)
    }, [getEffectiveTempo])

    // Manual controls
    const play = useCallback(() => {
        if (activeStation && isPoweredOn) {
            playStation(activeStation.id, activeStation.streamUrl)
                .catch(() => setPlaybackState('error'))
        }
    }, [activeStation, isPoweredOn, setPlaybackState])

    const pause = useCallback(() => {
        const audio = getAudioInstance()
        audio.pause()
    }, [])

    const stop = useCallback(() => {
        stopAudio()
        setPlaybackState('idle')
    }, [setPlaybackState])

    return {
        play,
        pause,
        stop,
        isPlaying: playbackState === 'playing' && isPoweredOn,
        isLoading: playbackState === 'loading' && isPoweredOn,
        hasError: playbackState === 'error',
    }
}
