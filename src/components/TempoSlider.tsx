interface TempoSliderProps {
  value: number
  onChange?: (value: number) => void
  disabled?: boolean
}

export default function TempoSlider({ value, onChange, disabled = false }: TempoSliderProps) {
  return (
    <div className={`relative h-10 w-full flex items-center group ${disabled ? 'cursor-not-allowed' : ''}`}>
      {/* Track */}
      <div className="absolute inset-0 bg-black/40 rounded-lg overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-[#59c3ad] to-[#4185d2] transition-[width] duration-[50ms] ease-out"
          style={{ width: `${value}%` }}
        />
      </div>

      {/* Vertical Indicator (Thumb) */}
      <div
        className="absolute h-12 w-[3px] bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.4)] pointer-events-none z-10 transition-[left] duration-[50ms] ease-out"
        style={{ left: `${value}%`, transform: 'translateX(-50%)' }}
      />

      {/* Interaction Layer */}
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => !disabled && onChange?.(parseInt(e.target.value))}
        disabled={disabled}
        className={`absolute inset-0 w-full h-full opacity-0 z-20 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
      />
    </div>
  )
}
