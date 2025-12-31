import { useState, useRef, useEffect, useCallback } from 'react'

interface KnobProps {
  value?: number
  onChange?: (value: number) => void
  size?: number
  step?: number
}

export default function Knob({ value = 50, onChange, size = 64, step = 5 }: KnobProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [internalValue, setInternalValue] = useState(value)
  const knobRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const startValueRef = useRef(0)

  useEffect(() => {
    setInternalValue(value)
  }, [value])

  // Update value and call onChange
  const updateValue = useCallback((newValue: number) => {
    const clampedValue = Math.max(0, Math.min(100, newValue))
    setInternalValue(clampedValue)
    onChange?.(clampedValue)
  }, [onChange])

  // Increment value
  const increment = useCallback(() => {
    updateValue(internalValue + step)
  }, [internalValue, step, updateValue])

  // Decrement value
  const decrement = useCallback(() => {
    updateValue(internalValue - step)
  }, [internalValue, step, updateValue])

  // Handle mouse/touch down on knob
  const handleDragStart = useCallback((clientY: number) => {
    setIsDragging(true)
    startYRef.current = clientY
    startValueRef.current = internalValue
  }, [internalValue])

  // Handle drag movement - vertical only (clockwise rotation)
  const handleDragMove = useCallback((clientY: number) => {
    if (!isDragging) return

    // Dragging up increases value, dragging down decreases
    const deltaY = startYRef.current - clientY
    const sensitivity = 0.5 // Value change per pixel
    const newValue = startValueRef.current + deltaY * sensitivity
    updateValue(newValue)
  }, [isDragging, updateValue])

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
  }, [])

  // Mouse events
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault()
    handleDragStart(e.clientY)
  }

  // Touch events
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      handleDragStart(e.touches[0].clientY)
    }
  }

  // Global event listeners
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY)
    const handleMouseUp = () => handleDragEnd()
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        handleDragMove(e.touches[0].clientY)
      }
    }
    const handleTouchEnd = () => handleDragEnd()

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
      window.addEventListener('touchmove', handleTouchMove)
      window.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isDragging, handleDragMove, handleDragEnd])

  // Map value 0-100 to rotation angle
  // 0 = -135deg (min, at - position, bottom-left)
  // 100 = +135deg (max, at + position, top-right)
  const rotation = (internalValue / 100) * 270 - 135

  // Calculate MAX label position on the arc at +135deg (top-right of knob path)
  // At 100% value, the dot is at +135deg from top (which is bottom-right area)
  const maxLabelAngle = 135 * (Math.PI / 180) // 135 degrees in radians
  const labelRadius = size / 2 + 18 // Outside the knob
  const maxLabelX = Math.sin(maxLabelAngle) * labelRadius
  const maxLabelY = -Math.cos(maxLabelAngle) * labelRadius

  return (
    <div className="relative flex flex-col items-center justify-center font-geist select-none">
      {/* MAX label - positioned at the max rotation point on the arc */}
      <div
        className="absolute text-[#333333] text-[7px] font-bold uppercase tracking-[0.1em] pointer-events-none"
        style={{
          top: `calc(50% + ${maxLabelY}px)`,
          left: `calc(50% + ${maxLabelX}px)`,
          transform: 'translate(-50%, -50%)'
        }}
      >
        MAX
      </div>

      {/* Plus button (top-right) - clickable */}
      <button
        onClick={increment}
        className="absolute text-[#666666] text-[20px] font-light leading-none transition-colors hover:text-white active:text-white/60 z-10"
        style={{ top: -14, right: -12 }}
        aria-label="Increase volume"
      >
        +
      </button>

      {/* Minus button (bottom-left) - clickable */}
      <button
        onClick={decrement}
        className="absolute text-[#666666] text-[24px] font-light leading-none transition-colors hover:text-white active:text-white/60 z-10"
        style={{ bottom: -6, left: -14 }}
        aria-label="Decrease volume"
      >
        -
      </button>

      <div
        ref={knobRef}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        className="relative flex items-center justify-center cursor-grab active:cursor-grabbing group"
        style={{ width: size, height: size }}
      >
        {/* Outer Well (Recessed Well) */}
        <div
          className="absolute inset-0 rounded-full bg-[#121212] shadow-[inset_0_4px_12px_rgba(0,0,0,0.8),inset_0_-2px_6px_rgba(255,255,255,0.05),0_1px_2px_rgba(255,255,255,0.05)]"
        />

        {/* Inner Knob (Floating/Rotating part) */}
        <div
          className="relative w-[76%] h-[76%] rounded-full bg-gradient-to-br from-[#2a2a2a] via-[#1e1e1e] to-[#121212] shadow-[0_10px_20px_rgba(0,0,0,0.6),0_2px_4px_rgba(0,0,0,0.4),inset_0_1px_1px_rgba(255,255,255,0.1)] flex items-center justify-center"
          style={{
            transform: `rotate(${rotation}deg)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out'
          }}
        >
          {/* Subtle Surface Texture Overlay */}
          <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.03)_0%,transparent_100%)]" />

          {/* Glowing Marker Dot */}
          <div className="absolute top-[12%] w-[5px] h-[5px] rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8),0_0_12px_rgba(255,255,255,0.4)]" />
        </div>
      </div>
    </div>
  )
}
