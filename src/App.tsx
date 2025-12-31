import RotateDeviceOverlay from './components/RotateDeviceOverlay'
import AppShell from './components/AppShell'
import FrequencyDisplay from './components/FrequencyDisplay'
import TuningScale from './components/TuningScale'
import StationList from './components/StationList'
import BandSelector from './components/BandSelector'
import TempoSlider from './components/TempoSlider'
import Knob from './components/Knob'
import SpeakerGrille from './components/SpeakerGrille'
import { useRadioStore } from './stores/useRadioStore'
import { useAudioPlayer } from './hooks/useAudioPlayer'
import { getStationsForBand, formatFrequency, BAND_CONFIG } from './data/stationData'

function App() {
  const {
    frequency,
    band,
    activeStation,
    volume,
    tempo,
    radioType,
    isPoweredOn,
    setBand,
    setVolume,
    setTempo,
    setRadioType,
    togglePower,
    tuneToStation,
    isTempoLocked,
  } = useRadioStore()

  // Initialize audio player
  const { isPlaying, isLoading, hasError, stop } = useAudioPlayer()

  // Get stations for current band
  const stations = getStationsForBand(band)
  const config = BAND_CONFIG[band]

  // Handle station selection
  const handleStationSelect = (stationId: string) => {
    if (!isPoweredOn) return
    const station = stations.find((s) => s.id === stationId)
    if (station) {
      tuneToStation(station)
    }
  }

  // Handle volume change from knob (0-100 maps to 0-1)
  const handleVolumeChange = (knobValue: number) => {
    setVolume(knobValue / 100)
  }

  // Handle tempo change
  const handleTempoChange = (value: number) => {
    if (!isTempoLocked() && isPoweredOn) {
      setTempo(value)
    }
  }

  // Handle band change
  const handleBandChange = (newBand: typeof band) => {
    if (!isPoweredOn) return
    setBand(newBand)
  }

  // Handle power toggle
  const handlePowerToggle = () => {
    if (isPoweredOn) {
      stop() // Stop audio when powering off
    }
    togglePower()
  }

  // Handle radio type toggle (Hybrid -> Live -> Digital -> Hybrid)
  const handleRadioTypeToggle = () => {
    if (!isPoweredOn) return
    const types: typeof radioType[] = ['Hybrid', 'Live', 'Digital']
    const currentIndex = types.indexOf(radioType)
    const nextIndex = (currentIndex + 1) % types.length
    setRadioType(types[nextIndex])
  }

  // Display values
  const displayFrequency = formatFrequency(frequency, band)
  // Map 0-100 to 0.9-1.1 for display
  const tempoRate = 0.9 + (tempo / 100) * 0.2
  const displayTempo = tempoRate.toFixed(1) + '×'

  return (
    <RotateDeviceOverlay>
      <AppShell>
        {/* Left Panel - Independent Part */}
        <div className="flex-[0.55] min-w-[700px] max-md:flex-none max-md:min-w-0 max-md:w-full flex flex-col bg-[#1E1E1E] rounded-l-[2.5rem] max-md:rounded-l-none max-md:rounded-t-[1.5rem] overflow-hidden border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
          <div className="flex flex-col p-6 max-md:p-4 pb-0">
            <FrequencyDisplay
              frequency={displayFrequency}
              unit={config.unit}
              band={band}
              programTitle={activeStation?.programTitle || 'Tune to a station'}
              stationName={activeStation?.name || 'No station'}
              isPlaying={isPlaying && isPoweredOn}
              isLoading={isLoading && isPoweredOn}
              hasError={hasError}
              isPoweredOn={isPoweredOn}
            />
            <div className="mt-6">
              <TuningScale />
            </div>
          </div>
          <div className="max-md:hidden">
            <SpeakerGrille />
          </div>
        </div>

        {/* Right Panel Wrapper - Independent Path */}
        <div className="flex-[0.45] min-w-[450px] max-md:flex-1 max-md:min-w-0 max-md:w-full flex flex-col gap-[3px] font-geist">
          {/* Top Section - Selection Controls (Physical Part) */}
          <div className="flex-1 p-6 max-md:p-3 max-md:py-2 flex flex-col bg-[#1E1E1E] rounded-tr-[2.5rem] max-md:rounded-tr-none border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            {/* Radio Type & Power Button */}
            <div className="flex items-start gap-3 mb-6 max-md:mb-3">
              <div className="flex-1 flex items-center justify-between bg-transparent rounded-xl px-5 border-2 border-white/15 h-[52px]">
                <span className="text-[#666666] text-[13px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap">
                  RADIO TYPE:
                </span>
                <button
                  onClick={handleRadioTypeToggle}
                  className="flex items-center gap-1.5 text-[16px] font-medium group"
                  disabled={!isPoweredOn}
                >
                  <span className="text-white/50 group-hover:text-white transition-colors">{radioType}</span>
                  <svg
                    className="w-4 h-4 text-white/50 group-hover:text-white transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth="2.5"
                  >
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>

              {/* Circular Power Button - Hardware Style */}
              <div className="flex flex-col items-center justify-center ml-2">
                <button
                  onClick={handlePowerToggle}
                  className={`relative w-[48px] h-[48px] rounded-full transition-all duration-500 group flex items-center justify-center
                    ${isPoweredOn
                      ? 'bg-[#1a1a1a] shadow-[inset_0_2px_4px_rgba(255,255,255,0.1)]'
                      : 'bg-[#121212] shadow-[inset_0_4px_10px_rgba(0,0,0,0.8),0_1px_2px_rgba(255,255,255,0.05)]'
                    }`}
                >

                  {/* Button Surface */}
                  <div className={`relative w-[82%] h-[82%] rounded-full flex items-center justify-center transition-all duration-500
                    ${isPoweredOn
                      ? 'bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] shadow-[0_4px_8px_rgba(0,0,0,0.6)]'
                      : 'bg-[#1a1a1a] shadow-inner'
                    }`}
                  >
                    <svg
                      className={`w-5 h-5 transition-all duration-500 ${isPoweredOn
                        ? 'text-[#FFE4CC]'
                        : 'text-[#444444]'}`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 2v10" />
                      <path d="M18.4 6.6a9 9 0 1 1-12.77.04" />
                    </svg>
                  </div>
                </button>
                <span className={`text-[8px] font-bold tracking-[0.2em] mt-1 transition-colors duration-500 ${isPoweredOn ? 'text-[#FFE4CC]' : 'text-[#333333]'}`}>
                  {isPoweredOn ? 'ON' : 'OFF'}
                </span>
              </div>
            </div>

            {/* Stations Section */}
            <div className="mb-6 max-md:mb-3">
              <div className="text-white text-[14px] font-medium mb-3">
                Stations ({band})
              </div>
              <StationList
                stations={stations}
                selectedStationId={activeStation?.id}
                onStationSelect={handleStationSelect}
              />
            </div>

            {/* Band Selector Section */}
            <div className="border border-white/10 rounded-xl p-1 w-fit bg-[#0d0d0d]">
              <BandSelector
                selectedBand={band}
                onBandSelect={handleBandChange}
              />
            </div>
          </div>

          {/* Bottom Section - Tuning Controls (Physical Part) */}
          <div className="p-6 max-md:p-3 max-md:py-2 flex flex-col bg-[#1E1E1E] rounded-br-[2.5rem] max-md:rounded-br-none max-md:rounded-b-[2rem] border border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="text-white text-[14px] font-medium mb-2 flex items-center gap-2">
              Tempo
              {isTempoLocked() && (
                <svg
                  className="ml-1 w-3.5 h-3.5 text-white/50"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                </svg>
              )}
            </div>
            <div className="flex items-center gap-12">
              <div className={`flex-1 flex items-center bg-[#353231] p-1 rounded-xl border border-white/5 group ${isTempoLocked() ? 'opacity-50' : ''}`}>
                <div className="flex-1 px-0">
                  <TempoSlider
                    value={tempo}
                    onChange={handleTempoChange}
                    disabled={isTempoLocked() || !isPoweredOn}
                  />
                </div>
                <div className="flex-shrink-0 bg-black border border-white/10 rounded-lg min-w-[48px] h-10 ml-0.5 px-2 flex items-center justify-center">
                  <span className="text-white text-[13px] font-semibold font-geist">
                    {displayTempo}
                  </span>
                </div>
              </div>
              <div className="flex-shrink-0">
                <Knob
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  size={96}
                />
              </div>
            </div>
          </div>
        </div>
      </AppShell>
    </RotateDeviceOverlay>
  )
}

export default App
