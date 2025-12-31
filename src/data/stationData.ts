// Station and band data for the radio app

export type RadioBand = 'FM' | 'MW' | 'SW' | 'LW'

export interface Station {
    id: string
    name: string
    frequency: number
    band: RadioBand
    streamUrl: string
    programTitle?: string
    country?: string
}

export interface BandConfig {
    band: RadioBand
    minFrequency: number
    maxFrequency: number
    step: number
    unit: string
    snapThreshold: number
}

// Band configurations
export const BAND_CONFIG: Record<RadioBand, BandConfig> = {
    FM: {
        band: 'FM',
        minFrequency: 87.5,
        maxFrequency: 108.0,
        step: 0.1,
        unit: 'MHz',
        snapThreshold: 0.3,
    },
    MW: {
        band: 'MW',
        minFrequency: 530,
        maxFrequency: 1700,
        step: 10,
        unit: 'kHz',
        snapThreshold: 15,
    },
    SW: {
        band: 'SW',
        minFrequency: 2300,
        maxFrequency: 26100,
        step: 5,
        unit: 'kHz',
        snapThreshold: 25,
    },
    LW: {
        band: 'LW',
        minFrequency: 153,
        maxFrequency: 279,
        step: 9,
        unit: 'kHz',
        snapThreshold: 10,
    },
}

// LIVE RADIO STREAMS from Nigeria, UK, USA, and France
export const STATIONS: Station[] = [
    // ========== FM STATIONS ==========
    // Nigeria 🇳🇬
    {
        id: 'fm-1',
        name: 'Wazobia FM',
        frequency: 95.1,
        band: 'FM',
        streamUrl: 'https://wazobiafmlagos951-atunwadigital.streamguys1.com/wazobiafmlagos951',
        programTitle: 'Lagos Pidgin Radio',
        country: 'Nigeria',
    },
    // UK 🇬🇧
    {
        id: 'fm-2',
        name: 'Capital FM UK',
        frequency: 95.8,
        band: 'FM',
        streamUrl: 'https://media-ice.musicradio.com/CapitalMP3',
        programTitle: 'UK Hit Music',
        country: 'UK',
    },
    // USA 🇺🇸
    {
        id: 'fm-3',
        name: 'KEXP Seattle',
        frequency: 90.3,
        band: 'FM',
        streamUrl: 'https://kexp-mp3-128.streamguys1.com/kexp128.mp3',
        programTitle: 'Indie & Alternative',
        country: 'USA',
    },
    // France 🇫🇷
    {
        id: 'fm-4',
        name: 'FIP Radio',
        frequency: 105.1,
        band: 'FM',
        streamUrl: 'https://icecast.radiofrance.fr/fip-midfi.mp3',
        programTitle: 'French Eclectic',
        country: 'France',
    },
    // USA 🇺🇸
    {
        id: 'fm-5',
        name: 'WFMU',
        frequency: 91.1,
        band: 'FM',
        streamUrl: 'https://stream0.wfmu.org/freeform-128k',
        programTitle: 'Freeform Radio',
        country: 'USA',
    },

    // ========== MW STATIONS ==========
    // UK 🇬🇧
    {
        id: 'mw-1',
        name: 'Absolute Radio',
        frequency: 1215,
        band: 'MW',
        streamUrl: 'https://icecast.thisisdax.com/AbsoluteRadioMP3',
        programTitle: 'Classic Rock',
        country: 'UK',
    },
    // USA 🇺🇸
    {
        id: 'mw-2',
        name: 'NPR News',
        frequency: 820,
        band: 'MW',
        streamUrl: 'https://npr-ice.streamguys1.com/live.mp3',
        programTitle: 'News & Talk',
        country: 'USA',
    },

    // ========== SW STATIONS ==========
    // France 🇫🇷
    {
        id: 'sw-1',
        name: 'France Inter',
        frequency: 6175,
        band: 'SW',
        streamUrl: 'https://icecast.radiofrance.fr/franceinter-midfi.mp3',
        programTitle: 'French News & Culture',
        country: 'France',
    },
    // USA 🇺🇸
    {
        id: 'sw-2',
        name: 'KCRW',
        frequency: 8920,
        band: 'SW',
        streamUrl: 'https://kcrw.streamguys1.com/kcrw_192k_mp3_on_air',
        programTitle: 'Eclectic Mix',
        country: 'USA',
    },

    // ========== LW STATIONS ==========
    // France 🇫🇷
    {
        id: 'lw-1',
        name: 'France Culture',
        frequency: 162,
        band: 'LW',
        streamUrl: 'https://icecast.radiofrance.fr/franceculture-midfi.mp3',
        programTitle: 'Arts & Ideas',
        country: 'France',
    },
]

// Get stations for a specific band
export function getStationsForBand(band: RadioBand): Station[] {
    return STATIONS.filter((station) => station.band === band)
}

// Find station nearest to a frequency within snap threshold
export function findNearestStation(frequency: number, band: RadioBand): Station | null {
    const config = BAND_CONFIG[band]
    const bandStations = getStationsForBand(band)

    let nearest: Station | null = null
    let minDistance = Infinity

    for (const station of bandStations) {
        const distance = Math.abs(station.frequency - frequency)
        if (distance < config.snapThreshold && distance < minDistance) {
            minDistance = distance
            nearest = station
        }
    }

    return nearest
}

// Clamp frequency to band range
export function clampFrequency(frequency: number, band: RadioBand): number {
    const config = BAND_CONFIG[band]
    return Math.max(config.minFrequency, Math.min(config.maxFrequency, frequency))
}

// Format frequency for display
export function formatFrequency(frequency: number, band: RadioBand): string {
    if (band === 'FM') {
        return frequency.toFixed(1)
    }
    return Math.round(frequency).toString()
}
