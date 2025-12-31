import type { RadioBand } from '../data/stationData'

interface FrequencyDisplayProps {
  frequency: string
  unit?: string
  band?: RadioBand
  programTitle?: string
  stationName?: string
  isPlaying?: boolean
  isLoading?: boolean
  hasError?: boolean
  isPoweredOn?: boolean
}

export default function FrequencyDisplay({
  frequency = '92.9',
  unit = 'MHz',
  band = 'FM',
  programTitle = 'Tune to a station',
  stationName = 'No station',
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
    <div className="bg-[#111111] rounded-2xl max-md:rounded-xl p-4 max-md:p-3 flex max-md:flex-col gap-6 max-md:gap-3 items-stretch border border-white/5 font-geist">
      {/* LCD Display Block */}
      <div className={`rounded-xl flex flex-col w-[260px] h-[160px] max-md:w-full max-md:h-[110px] relative overflow-hidden shadow-[inset_0_4px_12px_rgba(0,0,0,0.6)] border border-black/40 transition-all duration-700
        ${isPoweredOn ? 'bg-[#94a191]' : 'bg-[#1a1c1a]'}`}>
        {/* LCD Top Gradient Shadow */}
        <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-black/40 to-transparent pointer-events-none z-10"></div>

        {/* LCD Header */}
        <div className="flex items-center justify-between px-3 py-2 relative z-20">
          <div className="flex items-center gap-2">
            <div className="bg-black px-1.5 py-0.5 rounded text-[10px] font-bold text-white">
              {band}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIndicator()}
            <div className="text-[13px] font-semibold text-black/60 tracking-widest">P</div>
          </div>
        </div>

        {/* LCD Body (Frequency) */}
        <div className={`flex-1 flex items-center justify-center relative px-3 z-20 transition-opacity duration-700 ${isPoweredOn ? 'opacity-90' : 'opacity-0'}`}>
          <div className="flex items-baseline gap-1">
            <span className={`text-black font-bold leading-none tracking-tight font-dseg transition-all duration-300 ${frequency.length >= 6
              ? 'text-[38px] max-md:text-[32px]'
              : frequency.length >= 5
                ? 'text-[48px] max-md:text-[40px]'
                : frequency.length >= 4
                  ? 'text-[60px] max-md:text-[48px]'
                  : 'text-[72px] max-md:text-[56px]'
              }`}>
              {frequency}
            </span>
            <span className="text-black text-[12px] font-normal tracking-[0.1em] leading-none mb-3">{unit}</span>
          </div>
        </div>

      </div>

      {/* Program Info Block */}
      <div className="flex-1 flex flex-col py-0 overflow-hidden justify-center">
        {/* Scrolling Title with Glass Mask */}
        <div className="relative glass-mask mb-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap">
            <h1 className="text-white text-[24px] max-md:text-[18px] font-medium tracking-tighter inline-block mr-20">
              {programTitle}
            </h1>
            {/* Duplicate for seamless looping */}
            <h1 className="text-white text-[24px] max-md:text-[18px] font-medium tracking-tighter inline-block mr-20">
              {programTitle}
            </h1>
          </div>
        </div>

        <div className="text-[#666666] max-md:text-[12px] font-medium opacity-85 tracking-tight uppercase text-[14px] tracking-[0.05em]">
          {stationName}
        </div>
      </div>
    </div>
  )
}
