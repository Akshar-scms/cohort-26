'use client'

import React, { useState, useEffect, useRef } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  Plus,
  Clock,
  Volume2,
  VolumeX,
  Minimize2,
  Maximize2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SessionTimerProps {
  initialMinutes?: number
  onTimeEnd?: () => void
  studentName?: string
  slotLabel?: string
}

export function SessionTimer({
  initialMinutes = 15,
  onTimeEnd,
  studentName,
  slotLabel = '15-min Slot',
}: SessionTimerProps) {
  const [totalSeconds, setTotalSeconds] = useState(initialMinutes * 60)
  const [secondsLeft, setSecondsLeft] = useState(initialMinutes * 60)
  const [isActive, setIsActive] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)

  const audioContextRef = useRef<AudioContext | null>(null)

  // Web Audio chime generator
  const playAlertSound = () => {
    if (!soundEnabled) return
    try {
      if (!audioContextRef.current) {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        audioContextRef.current = new AudioCtx()
      }
      const ctx = audioContextRef.current
      if (ctx.state === 'suspended') {
        ctx.resume()
      }
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(587.33, ctx.currentTime) // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.1) // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.5)
    } catch {
      // Ignore audio block
    }
  }

  // Timer interval
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isActive && secondsLeft > 0) {
      interval = setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false)
            playAlertSound()
            if (onTimeEnd) onTimeEnd()
            return 0
          }
          if (prev === 60 || prev === 180) {
            playAlertSound()
          }
          return prev - 1
        })
      }, 1000)
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isActive, secondsLeft, onTimeEnd])

  const toggleTimer = () => setIsActive(!isActive)

  const resetTimer = (mins: number = initialMinutes) => {
    setIsActive(false)
    setTotalSeconds(mins * 60)
    setSecondsLeft(mins * 60)
  }

  const addMinutes = (mins: number) => {
    setSecondsLeft((prev) => prev + mins * 60)
    setTotalSeconds((prev) => prev + mins * 60)
  }

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  const progressPercent = totalSeconds > 0 ? (secondsLeft / totalSeconds) * 100 : 0

  // Status Colors
  const isUrgent = secondsLeft < 60 && secondsLeft > 0
  const isWarning = secondsLeft <= 180 && secondsLeft >= 60
  const isExpired = secondsLeft === 0

  const statusColor = isExpired
    ? 'text-[#E5484D] border-[#E5484D]'
    : isUrgent
    ? 'text-[#E5484D] border-[#E5484D]'
    : isWarning
    ? 'text-[#FFB224] border-[#FFB224]'
    : 'text-[#cbbeff] border-[#6E56CF]'

  const barColor = isExpired
    ? 'bg-[#E5484D]'
    : isUrgent
    ? 'bg-[#E5484D]'
    : isWarning
    ? 'bg-[#FFB224]'
    : 'bg-[#6E56CF]'

  if (isMinimized) {
    return (
      <div
        onClick={() => setIsMinimized(false)}
        className={cn(
          'fixed bottom-6 right-6 z-50 flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-[#121214] border shadow-2xl cursor-pointer transition-all hover:scale-105 select-none',
          statusColor
        )}
      >
        <Clock className="w-4 h-4 animate-pulse" />
        <span className="font-mono font-bold text-[14px] tabular-nums tracking-wider">
          {formattedTime}
        </span>
        <Maximize2 className="w-3.5 h-3.5 text-[#6E6E78] ml-1" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        'fixed bottom-6 right-6 z-50 w-[290px] rounded-xl bg-[#121214] border shadow-2xl p-4 flex flex-col gap-3 select-none backdrop-blur-md transition-all',
        isUrgent ? 'border-[#E5484D]/70 shadow-[#E5484D]/10' : 'border-[#26262A]'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#6E56CF]" />
          <span className="text-[11px] font-medium uppercase tracking-wider text-[#A0A0AB]">
            Live Mentoring Timer
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1 rounded text-[#6E6E78] hover:text-[#EDEDEF] transition-colors"
            title={soundEnabled ? 'Mute chimes' : 'Enable chimes'}
          >
            {soundEnabled ? (
              <Volume2 className="w-3.5 h-3.5 text-[#6E56CF]" />
            ) : (
              <VolumeX className="w-3.5 h-3.5" />
            )}
          </button>
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 rounded text-[#6E6E78] hover:text-[#EDEDEF] transition-colors"
            title="Minimize"
          >
            <Minimize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Target student metadata */}
      {studentName && (
        <div className="text-[12px] font-medium text-[#EDEDEF] truncate">
          Candidate: <span className="text-[#cbbeff]">{studentName}</span>
        </div>
      )}

      {/* Main Timer Display */}
      <div className="flex flex-col items-center justify-center py-2 bg-[#18181B] border border-[#26262A] rounded-lg">
        <div
          className={cn(
            'text-[36px] font-mono font-bold leading-none tracking-widest tabular-nums',
            isExpired
              ? 'text-[#E5484D] animate-pulse'
              : isUrgent
              ? 'text-[#E5484D]'
              : isWarning
              ? 'text-[#FFB224]'
              : 'text-[#EDEDEF]'
          )}
        >
          {formattedTime}
        </div>
        <span className="text-[10px] text-[#6E6E78] mt-1 uppercase tracking-wider font-mono">
          {isExpired ? 'Session Time Expired' : isActive ? 'Session In Progress' : 'Paused / Ready'}
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-1.5 bg-[#18181B] border border-[#26262A] rounded-full overflow-hidden">
        <div
          className={cn('h-full transition-all duration-300 rounded-full', barColor)}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-1.5 pt-1">
        <Button
          variant={isActive ? 'secondary' : 'default'}
          size="sm"
          onClick={toggleTimer}
          className="flex-1 h-8 text-[12px] gap-1.5"
        >
          {isActive ? (
            <>
              <Pause className="w-3.5 h-3.5" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-3.5 h-3.5 fill-current" />
              {secondsLeft === totalSeconds ? 'Start Slot' : 'Resume'}
            </>
          )}
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => addMinutes(2)}
          className="h-8 px-2 text-[11px] font-mono"
          title="Add 2 minutes"
        >
          +2m
        </Button>

        <Button
          variant="outline"
          size="sm"
          onClick={() => resetTimer(15)}
          className="h-8 px-2.5 text-[#A0A0AB] hover:text-[#EDEDEF]"
          title="Reset to 15m"
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </Button>
      </div>

      {/* Quick Slot Preset Selector */}
      <div className="flex items-center justify-between border-t border-[#26262A] pt-2 text-[10px] text-[#6E6E78]">
        <span>Slot duration:</span>
        <div className="flex items-center gap-1 font-mono">
          {[10, 15, 20].map((m) => (
            <button
              key={m}
              onClick={() => resetTimer(m)}
              className={cn(
                'px-1.5 py-0.5 rounded border text-[10px]',
                totalSeconds === m * 60
                  ? 'border-[#6E56CF] bg-[#6E56CF]/10 text-[#cbbeff]'
                  : 'border-[#26262A] text-[#A0A0AB] hover:border-[#34343A]'
              )}
            >
              {m}m
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
