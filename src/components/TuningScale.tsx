import { useRef, useEffect, useCallback } from 'react'
import { useRadioStore } from '../stores/useRadioStore'
import { BAND_CONFIG } from '../data/stationData'

interface TuningScaleProps {
  onFrequencyChange?: (frequency: number) => void
}

export default function TuningScale({ onFrequencyChange }: TuningScaleProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isDraggingRef = useRef(false)

  const { frequency, band, setFrequency } = useRadioStore()
  const config = BAND_CONFIG[band]

  // Dynamic range based on current band
  const minFrequency = config.minFrequency
  const maxFrequency = config.maxFrequency
  const range = maxFrequency - minFrequency

  // Calculate indicator position
  const indicatorPosition = ((frequency - minFrequency) / range) * 100

  // Generate tick marks based on band
  const getMajorTickInterval = () => {
    switch (band) {
      case 'FM': return 1
      case 'MW': return 200
      case 'SW': return 5000  // Wider spacing for SW band
      case 'LW': return 30
      default: return 1
    }
  }

  const majorTickInterval = getMajorTickInterval()
  const majorTicks: number[] = []

  for (let i = Math.ceil(minFrequency / majorTickInterval) * majorTickInterval; i <= maxFrequency; i += majorTickInterval) {
    majorTicks.push(i)
  }

  // Position to frequency conversion
  const positionToFrequency = useCallback((clientX: number) => {
    if (!containerRef.current) return frequency

    const rect = containerRef.current.getBoundingClientRect()
    const relativeX = clientX - rect.left
    const percentage = Math.max(0, Math.min(1, relativeX / rect.width))
    const newFrequency = minFrequency + percentage * range

    // Round to step
    const step = config.step
    return Math.round(newFrequency / step) * step
  }, [frequency, minFrequency, range, config.step])

  // Drag handlers
  const handleDragStart = useCallback((clientX: number) => {
    isDraggingRef.current = true
    const newFreq = positionToFrequency(clientX)
    setFrequency(newFreq, false) // Don't snap while dragging
    onFrequencyChange?.(newFreq)
  }, [positionToFrequency, setFrequency, onFrequencyChange])

  const handleDragMove = useCallback((clientX: number) => {
    if (!isDraggingRef.current) return
    const newFreq = positionToFrequency(clientX)
    setFrequency(newFreq, false) // Don't snap while dragging
    onFrequencyChange?.(newFreq)
  }, [positionToFrequency, setFrequency, onFrequencyChange])

  const handleDragEnd = useCallback(() => {
    if (isDraggingRef.current) {
      isDraggingRef.current = false
      // Snap to nearest station when drag ends
      setFrequency(frequency, true)
    }
  }, [frequency, setFrequency])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientX)
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientX)
    }
  }

  // Global mouse/touch move and up handlers
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientX)
    const handleMouseUp = () => handleDragEnd()
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleDragMove(e.touches[0].clientX)
      }
    }
    const handleTouchEnd = () => handleDragEnd()

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('touchmove', handleTouchMove)
    window.addEventListener('touchend', handleTouchEnd)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [handleDragMove, handleDragEnd])

  // Format tick label
  const formatTickLabel = (tick: number) => {
    if (band === 'FM') {
      return tick.toFixed(0)
    }
    if (band === 'SW') {
      // Format as "5k", "10k", "15k" etc for SW band
      return (tick / 1000).toFixed(0) + 'k'
    }
    return tick.toString()
  }

  // Generate minor ticks
  const getMinorTicks = () => {
    const ticks: number[] = []
    const minorInterval = majorTickInterval / 2

    for (let i = minFrequency; i <= maxFrequency; i += minorInterval) {
      if (i % majorTickInterval !== 0) {
        ticks.push(i)
      }
    }
    return ticks
  }

  return (
    <div
      ref={containerRef}
      className="relative h-24 max-md:h-16 bg-transparent mt-4 max-md:mt-2 cursor-grab active:cursor-grabbing select-none"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Decorative vertical lines on sides */}
      <div className="absolute left-0 top-0 bottom-4 w-px bg-white/5"></div>
      <div className="absolute right-0 top-0 bottom-4 w-px bg-white/5"></div>

      {/* Main scale container */}
      <div className="relative h-full px-2">
        {/* Baseline */}
        <div className="absolute top-8 max-md:top-6 left-0 right-0 h-px bg-white/10"></div>

        {/* Major Tick Marks and Labels */}
        <div className="relative h-full">
          {majorTicks.map((tick, index) => {
            const position = ((tick - minFrequency) / range) * 100
            // On mobile, only show every other label to prevent overlap
            const showLabel = true
            return (
              <div
                key={tick}
                className="absolute top-0 bottom-0 flex flex-col items-center pointer-events-none"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              >
                {/* Major tick mark */}
                <div className="w-[1.5px] h-8 max-md:h-6 bg-white/30"></div>
                {/* Label - hide every other one on mobile */}
                <div className={`mt-2 text-[#666666] text-[12px] max-md:text-[10px] font-semibold tracking-tighter ${index % 2 !== 0 ? 'max-md:hidden' : ''}`}>
                  {showLabel && formatTickLabel(tick)}
                </div>
              </div>
            )
          })}

          {/* Minor tick marks */}
          {getMinorTicks().map((tick, i) => {
            const position = ((tick - minFrequency) / range) * 100
            return (
              <div
                key={`minor-${i}`}
                className="absolute top-0 w-[1.5px] h-5 max-md:h-4 bg-white/20 pointer-events-none"
                style={{ left: `${position}%`, transform: 'translateX(-50%)' }}
              ></div>
            )
          })}

          {/* Current frequency indicator (The Needle) */}
          <div
            className="absolute top-0 bottom-4 w-[2.5px] bg-white z-20 pointer-events-none"
            style={{
              left: `${indicatorPosition}%`,
              transform: 'translateX(-50%)',
              transition: isDraggingRef.current ? 'none' : 'left 0.1s ease-out'
            }}
          >
            <div className="absolute -top-[5px] left-1/2 -translate-x-1/2 w-[10px] h-[10px] bg-white rounded-full shadow-[0_0_12px_rgba(255,255,255,0.8)]"></div>
          </div>
        </div>
      </div>
    </div>
  )
}
