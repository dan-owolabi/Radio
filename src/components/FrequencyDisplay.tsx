import type { RadioBand } from '../data/stationData'

interface FrequencyDisplayProps {
  time?: string
  frequency: string
  unit?: string
  band?: RadioBand
  programTitle?: string
  stationName?: string
  duration?: string
  isPlaying?: boolean
  isLoading?: boolean
  hasError?: boolean
  isPoweredOn?: boolean
}

export default function FrequencyDisplay({
  time = '9:00',
  frequency = '92.9',
  unit = 'MHz',
  band = 'FM',
  programTitle = 'Tune to a station',
  stationName = 'No station',
  duration = '1 hr 45 mins',
  isPlaying = false,
  isLoading = false,
  hasError = false,
  isPoweredOn = true,
}: FrequencyDisplayProps) {
  // Determine status indicator
  const getStatusIndicator = () => {
    if (isLoading) {
      return <div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
    }
    if (hasError) {
      return <div className="w-2 h-2 rounded-full bg-red-500" />
    }
    if (isPlaying) {
      return <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
    }
    return null
  }

  return (
    <div className="bg-[#111111] rounded-3xl p-5 max-md:p-4 flex max-md:flex-col gap-8 max-md:gap-4 items-stretch border border-white/5 font-geist">
      {/* LCD Display Block */}
      <div className={`rounded-2xl flex flex-col w-[280px] h-[190px] max-md:w-full max-md:h-[140px] relative overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] border border-black/40 transition-all duration-700
        ${isPoweredOn ? 'bg-[#94a191]' : 'bg-[#1a1c1a]'}`}>
        {/* LCD Top Gradient Shadow */}
        <div className="absolute top-0 left-0 right-0 h-10 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10"></div>

        {/* LCD Header */}
        <div className="flex items-center justify-between px-4 py-3 max-md:py-2 relative z-20">
          <div className="flex items-center gap-2">
            <div className="text-[12px] font-medium text-black/60 font-dseg">
              {time}
            </div>
            <div className="bg-black px-1.5 py-0.5 rounded text-[11px] font-bold text-white">
              {band}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIndicator()}
            <div className="text-[15px] font-semibold text-black/60 tracking-widest mr-1">P</div>
          </div>
        </div>


        {/* LCD Body (Frequency) */}
        <div className={`flex-1 flex items-center justify-center relative px-4 z-20 pt-8 max-md:pt-2 transition-opacity duration-700 ${isPoweredOn ? 'opacity-90' : 'opacity-0'}`}>
          <div className="flex items-baseline gap-1.5">
            <span className={`text-black font-bold leading-none tracking-tight font-dseg transition-all duration-300 ${frequency.length >= 6
              ? 'text-[42px] max-md:text-[36px]'
              : frequency.length >= 5
                ? 'text-[52px] max-md:text-[44px]'
                : frequency.length >= 4
                  ? 'text-[68px] max-md:text-[54px]'
                  : 'text-[84px] max-md:text-[64px]'
              }`}>
              {frequency}
            </span>
            <span className="text-black text-[13px] font-normal tracking-[0.1em] leading-none mb-4">{unit}</span>
          </div>
        </div>

      </div>

      {/* Program Info Block */}
      <div className="flex-1 flex flex-col py-0.5 overflow-hidden">
        <div className="mb-auto">
          {/* Scrolling Title with Glass Mask */}
          <div className="relative glass-mask mb-2 overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              <h1 className="text-white text-[28px] max-md:text-[20px] font-medium tracking-tighter inline-block mr-24">
                {programTitle}
              </h1>
              {/* Duplicate for seamless looping */}
              <h1 className="text-white text-[28px] max-md:text-[20px] font-medium tracking-tighter inline-block mr-24">
                {programTitle}
              </h1>
            </div>
          </div>

          <div className="text-[#666666] text-lg max-md:text-[14px] font-medium opacity-85 tracking-tight px-1 uppercase text-[15px] tracking-[0.05em]">
            {stationName}
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto pb-1">
          <div className="flex items-center gap-3">
            <svg
              className="w-5 h-5 max-md:w-4 max-md:h-4 text-[#666666]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span className="text-[#666666] text-lg max-md:text-[14px] font-semibold tracking-tight">{duration}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
