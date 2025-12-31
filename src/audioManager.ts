/**
 * Singleton Audio Manager
 * Ensures only one audio element exists across the entire app
 */

let audioInstance: HTMLAudioElement | null = null
let currentStationId: string | null = null

export function getAudioInstance(): HTMLAudioElement {
    if (!audioInstance) {
        audioInstance = new Audio()
        // Don't set crossOrigin - it causes CORS issues with simple MP3 files
    }
    return audioInstance
}

export function getCurrentStationId(): string | null {
    return currentStationId
}

export function setCurrentStationId(id: string | null): void {
    currentStationId = id
}

export function stopAudio(): void {
    if (audioInstance) {
        audioInstance.pause()
        audioInstance.currentTime = 0
        audioInstance.src = ''
    }
    currentStationId = null
}

export function playStation(stationId: string, streamUrl: string): Promise<void> {
    const audio = getAudioInstance()

    // If same station, do nothing
    if (currentStationId === stationId && !audio.paused) {
        return Promise.resolve()
    }

    // Stop current audio first
    audio.pause()
    audio.currentTime = 0

    // Set new station
    currentStationId = stationId
    audio.src = streamUrl
    audio.load()

    return audio.play().catch((err) => {
        console.warn('Playback failed:', err.message)
        throw err
    })
}

export function setVolume(volume: number): void {
    if (audioInstance) {
        audioInstance.volume = Math.max(0, Math.min(1, volume))
    }
}

export function setPlaybackRate(rate: number): void {
    if (audioInstance) {
        audioInstance.playbackRate = Math.max(0.5, Math.min(2, rate))
    }
}
