"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils"

interface SegmentedProgressProps {
  value?: number
  segments?: number
  label?: string
  showPercentage?: boolean
  showDemo?: boolean
  className?: string
}

export function SegmentedProgress({
  value: initialValue = 80,
  segments = 20,
  label,
  showPercentage = true,
  showDemo = false,
  className,
}: SegmentedProgressProps) {
  const [progress, setProgress] = useState(initialValue)
  const value = showDemo ? progress : initialValue

  const [displayValue, setDisplayValue] = useState(0)
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const animationRef = useRef<number | null>(null)
  const startValueRef = useRef(0)
  const startTimeRef = useRef(0)

  const filledSegments = Math.round((displayValue / 100) * segments)

  useEffect(() => {
    if (!isInitialized) {
      const initTimeout = setTimeout(() => setIsInitialized(true), 50)
      return () => clearTimeout(initTimeout)
    }

    const duration = 800
    startValueRef.current = displayValue
    startTimeRef.current = performance.now()

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTimeRef.current
      const currentProgress = Math.min(elapsed / duration, 1)

      const eased = 1 - Math.pow(1 - currentProgress, 3)

      const newValue = startValueRef.current + (value - startValueRef.current) * eased
      setDisplayValue(newValue)

      if (currentProgress < 1) {
        animationRef.current = requestAnimationFrame(animate)
      }
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, isInitialized])

  // Update value when initialValue prop changes (if not in demo mode)
  useEffect(() => {
    if (!showDemo) {
      setProgress(initialValue)
    }
  }, [initialValue, showDemo])

  const getSegmentStyle = (index: number, isFilled: boolean) => {
    let scale = 1
    const opacity = 1
    let translateY = 0

    if (hoveredSegment !== null) {
      const distance = Math.abs(hoveredSegment - index)
      if (distance === 0) {
        scale = 1.3
        translateY = -1
      } else if (distance <= 3) {
        const falloff = Math.cos((distance / 3) * (Math.PI / 2))
        scale = 1 + 0.2 * falloff
        translateY = -0.5 * falloff
      }
    }

    const delay = isInitialized ? index * 20 : 0

    return {
      transform: `scaleY(${scale}) translateY(${translateY}px)`,
      transitionDelay: `${delay}ms`,
      opacity,
    }
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="flex flex-col gap-2">
        {/* Header with label and percentage */}
        {(label || showPercentage) && (
          <div className="flex items-center justify-between px-1">
            {label && <span className="text-sm font-medium text-muted-foreground tracking-wide">{label}</span>}
            {showPercentage && (
              <span
                className="text-sm font-bold text-primary tabular-nums tracking-tight transition-all duration-300"
                style={{
                  filter: hoveredSegment !== null ? "brightness(1.1)" : "brightness(1)",
                }}
              >
                {Math.round(displayValue)}%
              </span>
            )}
          </div>
        )}

        {/* Segmented bar */}
        <div
          className="flex gap-[3px] py-1 px-1"
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          {Array.from({ length: segments }).map((_, index) => {
            const isFilled = index < filledSegments
            const isHovered = hoveredSegment === index

            return (
              <div
                key={index}
                onMouseEnter={() => setHoveredSegment(index)}
                onMouseLeave={() => setHoveredSegment(null)}
                className={cn(
                  "h-2 sm:h-3 flex-1 rounded-sm cursor-pointer origin-center border border-border/50",
                  "transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
                  isFilled ? "bg-primary" : "bg-muted",
                  isHovered && isFilled && "brightness-110",
                  isHovered && !isFilled && "bg-muted-foreground/20",
                  hoveredSegment !== null && !isFilled && !isHovered && "bg-muted/50",
                )}
                style={getSegmentStyle(index, isFilled)}
              />
            )
          })}
        </div>
      </div>

      {showDemo && (
        <div className="flex flex-col gap-4 mt-4">
          <input
            type="range"
            min={0}
            max={100}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
              transition-all duration-300
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-4
              [&::-webkit-slider-thumb]:h-4
              [&::-webkit-slider-thumb]:rounded-md
              [&::-webkit-slider-thumb]:bg-primary
              [&::-webkit-slider-thumb]:cursor-pointer
              [&::-webkit-slider-thumb]:transition-all
              [&::-webkit-slider-thumb]:duration-300
              [&::-webkit-slider-thumb]:ease-out
              [&::-webkit-slider-thumb]:hover:scale-125"
          />
          <p className="text-center text-xs text-muted-foreground tracking-wide">Drag to adjust value</p>
        </div>
      )}
    </div>
  )
}
