import type { RadioBand } from '../data/stationData'

interface BandSelectorProps {
  selectedBand: RadioBand
  onBandSelect?: (band: RadioBand) => void
}

export default function BandSelector({
  selectedBand,
  onBandSelect,
}: BandSelectorProps) {
  const bands: RadioBand[] = ['FM', 'MW', 'SW', 'LW']

  return (
    <div className="flex gap-1.5 font-geist">
      {bands.map((band) => {
        const isActive = selectedBand === band
        return (
          <button
            key={band}
            onClick={() => onBandSelect?.(band)}
            className={`
              px-4 py-1.5 rounded text-[13px] font-medium transition-all duration-200
              ${isActive
                ? 'bg-[#ffe8d6] text-black shadow-sm'
                : 'bg-transparent text-[#666666] hover:text-white'
              }
            `}
          >
            {band}
          </button>
        )
      })}
    </div>
  )
}
