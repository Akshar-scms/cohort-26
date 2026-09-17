'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Trash2,
  MapPin,
  Loader2,
  AlertTriangle,
  Calendar as CalendarIcon,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { getSpcSlots, getMonthSlotsSummary, createSlot, deleteSlot } from '@/app/actions/slot-actions'

interface SpcSlotsManagerViewProps {
  spcId: string
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function addMinutes(timeStr: string, mins: number) {
  const [h, m] = timeStr.split(':').map(Number)
  const total = h * 60 + m + mins
  const nh = Math.floor(total / 60) % 24
  const nm = total % 60
  const period = nh >= 12 ? 'PM' : 'AM'
  const hour = nh % 12 || 12
  return `${hour}:${String(nm).padStart(2, '0')} ${period}`
}

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]
const DAY_NAMES = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

export function SpcSlotsManagerView({ spcId }: SpcSlotsManagerViewProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth()) // 0-based
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  const [slots, setSlots] = useState<any[]>([])
  const [monthSummary, setMonthSummary] = useState<Record<string, { total: number; available: number; booked: number }>>({})
  const [loading, setLoading] = useState(true)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [newStartTime, setNewStartTime] = useState('15:00')
  const [newLocation, setNewLocation] = useState('')
  const [newNotes, setNewNotes] = useState('')
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Selected date as standard local YYYY-MM-DD
  const selectedIso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`

  const loadSlots = () => {
    setLoading(true)
    getSpcSlots(spcId, selectedIso).then((data) => {
      setSlots(data)
      setLoading(false)
    })
  }

  const loadMonthSummary = () => {
    getMonthSlotsSummary(viewYear, viewMonth).then((data) => {
      setMonthSummary(data)
    })
  }

  useEffect(() => {
    loadMonthSummary()
  }, [viewYear, viewMonth])

  useEffect(() => {
    loadSlots()
  }, [selectedIso, spcId])

  // Calendar helpers
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1)
      setViewMonth(11)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1)
      setViewMonth(0)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  const handleAddSlot = () => {
    startTransition(async () => {
      await createSlot(spcId, selectedIso, newStartTime, 15, newLocation, newNotes)
      setIsAddModalOpen(false)
      setNewStartTime('15:00')
      setNewLocation('')
      setNewNotes('')
      loadSlots()
      loadMonthSummary()
    })
  }

  const handleDeleteSlot = (slotId: string) => {
    setDeleteError(null)
    startTransition(async () => {
      const result = await deleteSlot(slotId)
      if (result.success) {
        loadSlots()
        loadMonthSummary()
      } else {
        setDeleteError(result.error ?? 'Failed to delete slot.')
      }
    })
  }

  const bookedCount = slots.filter((s) => s.bookedStudent).length
  const selectedDateFormatted = new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 flex-1 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
          Manage 1-on-1 Mentoring Slots
        </h1>
        <p className="text-[13px] text-[#A0A0AB]">
          Open individual 15-minute mentoring slots for your batch students (1 student per slot).
        </p>
      </div>

      {deleteError && (
        <div className="p-3 rounded-lg bg-[#E5484D]/10 border border-[#E5484D]/40 text-[12px] text-[#E5484D] flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {deleteError}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: Calendar Card */}
        <section className="w-full lg:w-[320px] shrink-0 bg-[#121214] border border-[#26262A] rounded-xl p-5 flex flex-col select-none">
          {/* Month header */}
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={prevMonth}
              aria-label="Previous Month"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#26262A] bg-[#121214] hover:bg-[#18181B] text-[#A0A0AB] hover:text-[#EDEDEF] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[14px] font-medium text-[#EDEDEF]">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              onClick={nextMonth}
              aria-label="Next Month"
              className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#26262A] bg-[#121214] hover:bg-[#18181B] text-[#A0A0AB] hover:text-[#EDEDEF] transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Day labels */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((d) => (
              <span key={d} className="text-[11px] uppercase text-[#6E6E78] font-medium">
                {d}
              </span>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`pad-${i}`} className="h-9" />
            ))}

            {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => {
              const isSelected = selectedDay === day
              const isToday =
                day === today.getDate() &&
                viewYear === today.getFullYear() &&
                viewMonth === today.getMonth()

              const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              const dayData = monthSummary[dateStr]
              const hasAvailable = !!(dayData && dayData.available > 0)
              const hasBooked = !!(dayData && dayData.booked > 0 && dayData.available === 0)

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-9 flex flex-col items-center justify-center rounded-[8px] relative cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#6E56CF]/[0.18] text-[#cbbeff] font-semibold border border-[#6E56CF]'
                      : isToday
                      ? 'border border-[#34343A] text-[#EDEDEF]'
                      : 'text-[#A0A0AB] hover:text-[#EDEDEF] hover:bg-[#18181B]'
                  }`}
                >
                  <span className="text-[12px] font-mono leading-none">{day}</span>
                  <div className="flex items-center gap-0.5 absolute bottom-1">
                    {hasAvailable ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDEF]" title="Available slots" />
                    ) : hasBooked ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34343A]" title="All slots booked" />
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Add Slot Button */}
          <div className="mt-5 pt-4 border-t border-[#26262A] flex flex-col gap-3">
            <Button
              variant="default"
              className="w-full h-9 gap-1.5 bg-[#6E56CF] hover:bg-[#7C66DC] text-white"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              Add 1-on-1 Slot
            </Button>
            <div className="flex items-center justify-between text-[11px] text-[#6E6E78] px-1">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDEF]" /> Open
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#34343A]" /> Fully Booked
              </span>
            </div>
          </div>
        </section>

        {/* Right: Slots List */}
        <section className="flex-1 w-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[#EDEDEF]">
              {selectedDateFormatted}
            </h2>
            <span className="text-[13px] text-[#6E6E78] font-mono tabular-nums">
              {loading ? '...' : `${slots.length} slots · ${bookedCount}/${slots.length} booked`}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#6E6E78]">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-[13px]">Loading slots for {MONTH_NAMES[viewMonth]} {selectedDay}...</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center gap-2 bg-[#121214] border border-[#26262A] rounded-xl p-8">
              <CalendarIcon className="w-8 h-8 text-[#6E6E78]" />
              <div className="text-[14px] font-medium text-[#EDEDEF]">No slots created for this date</div>
              <p className="text-[12px] text-[#A0A0AB] max-w-sm">
                Click &quot;Add 1-on-1 Slot&quot; to open mentoring windows for {MONTH_NAMES[viewMonth]} {selectedDay}.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {slots.map((slot) => {
                const isBooked = !!slot.bookedStudent
                return (
                  <div
                    key={slot.id}
                    className="h-[80px] bg-[#121214] border border-[#26262A] rounded-xl px-5 flex items-center justify-between hover:border-[#34343A] transition-colors"
                  >
                    {/* Time + Location */}
                    <div className="w-[200px] flex flex-col justify-center shrink-0">
                      <span className="font-mono text-[13px] font-medium text-[#EDEDEF] tabular-nums">
                        {formatTime(slot.startTime)} – {addMinutes(slot.startTime, slot.durationMinutes)}
                      </span>
                      {slot.location ? (
                        <div className="flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-[#6E56CF] shrink-0" />
                          <span className="text-[11px] text-[#A0A0AB] truncate">{slot.location}</span>
                        </div>
                      ) : (
                        <span className="text-[11px] text-[#6E6E78] mt-0.5">15 min · Venue not specified</span>
                      )}
                    </div>

                    {/* Booked student status */}
                    <div className="flex items-center gap-3 w-[260px]">
                      {isBooked ? (
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-[#18181B] border border-[#26262A] flex items-center justify-center font-mono text-[11px] text-[#EDEDEF] font-medium">
                            {slot.bookedStudent.rollNumber
                              ? slot.bookedStudent.rollNumber.slice(-3)
                              : slot.bookedStudent.name.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-[13px] font-medium text-[#EDEDEF] truncate">
                              {slot.bookedStudent.name}
                            </span>
                            <span className="text-[11px] text-[#6E6E78] font-mono truncate">
                              {slot.bookedStudent.rollNumber || slot.bookedStudent.email}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 text-[#6E6E78] text-[12px]">
                          <span className="w-2 h-2 rounded-full bg-[#EDEDEF]" />
                          <span>Open for booking</span>
                        </div>
                      )}
                    </div>

                    {/* Action */}
                    <div>
                      {isBooked ? (
                        <span className="text-[11px] font-mono text-[#30A46C] bg-[#30A46C]/10 border border-[#30A46C]/30 px-2.5 py-1 rounded-full">
                          Booked
                        </span>
                      ) : (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSlot(slot.id)}
                          disabled={isPending}
                          className="h-8 text-[#6E6E78] hover:text-[#E5484D] hover:bg-[#E5484D]/10"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          Delete
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      {/* Add Slot Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md bg-[#121214] border-[#26262A] text-[#EDEDEF]">
          <DialogHeader>
            <DialogTitle className="text-[17px] text-[#EDEDEF]">
              Create 1-on-1 Mentoring Slot
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#A0A0AB]">
              Date: <strong className="text-[#EDEDEF] font-medium">{selectedDateFormatted}</strong> (15 minutes)
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#6E6E78] font-medium">
                Start Time
              </label>
              <Input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="bg-[#18181B] border-[#26262A] text-[#EDEDEF] font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#6E6E78] font-medium">
                Offline Location / Venue
              </label>
              <Input
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                placeholder="e.g. Lab 302, Block-A or Placement Cell Room"
                className="bg-[#18181B] border-[#26262A] text-[#EDEDEF] placeholder-[#6E6E78]"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#6E6E78] font-medium">
                Preparation Instructions (Optional)
              </label>
              <Input
                value={newNotes}
                onChange={(e) => setNewNotes(e.target.value)}
                placeholder="e.g. Bring updated resume and laptop"
                className="bg-[#18181B] border-[#26262A] text-[#EDEDEF] placeholder-[#6E6E78]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
              className="border-[#26262A] bg-[#18181B] text-[#EDEDEF] hover:bg-[#202024]"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleAddSlot}
              disabled={isPending || !newStartTime}
              className="bg-[#6E56CF] hover:bg-[#7C66DC] text-white"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                  Creating...
                </>
              ) : (
                'Create Slot'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
