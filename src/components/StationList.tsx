import type { Station } from '../data/stationData'

interface StationListProps {
  stations: Station[]
  selectedStationId?: string
  onStationSelect?: (id: string) => void
}

export default function StationList({
  stations,
  selectedStationId,
  onStationSelect,
}: StationListProps) {
  if (stations.length === 0) {
    return (
      <div className="flex gap-2 pb-0 -mx-1 px-1 font-geist">
        <div className="text-[#666666] text-sm">No stations available for this band</div>
      </div>
    )
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-0 -mx-1 px-1 no-scrollbar font-geist">
      {stations.map((station, index) => {
        const isSelected = station.id === selectedStationId
        return (
          <button
            key={station.id}
            onClick={() => onStationSelect?.(station.id)}
            className={`
              flex-shrink-0 flex items-center gap-6 px-6 py-2.5 rounded-xl border
              transition-all duration-200 whitespace-nowrap
              ${isSelected
                ? 'bg-[#333333] border-white/10 text-white shadow-lg'
                : 'bg-[#0d0d0d] border-white/5 text-[#666666] hover:border-white/10 hover:text-white/80'
              }
            `}
          >
            <div className="flex items-center gap-1">
              <span
                className={`text-[12px] font-medium tracking-tighter ${isSelected ? 'text-white/40' : 'text-white/30'
                  }`}
              >
                {index + 1}.
              </span>
              <span className={`font-semibold text-[15px] tracking-tight ${isSelected ? 'text-white' : ''}`}>{station.name}</span>
            </div>
            <span
              className={`text-[14px] font-medium font-geist-mono ${isSelected ? 'text-white/70' : ''
                }`}
            >
              {station.frequency}
            </span>
          </button>
        )
      })}
    </div>
  )
}
