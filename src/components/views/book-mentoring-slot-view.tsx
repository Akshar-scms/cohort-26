'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  CheckCircle2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Calendar as CalendarIcon,
  Info,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { getAvailableSlots, getMonthSlotsSummary, bookSlot } from '@/app/actions/slot-actions'

interface BookMentoringSlotViewProps {
  userId: string
  studentId: string | null
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

export function BookMentoringSlotView({ userId, studentId }: BookMentoringSlotViewProps) {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth()) // 0-based
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  const [slots, setSlots] = useState<any[]>([])
  const [monthSummary, setMonthSummary] = useState<Record<string, { total: number; available: number; booked: number; myBooked: boolean }>>({})
  const [loading, setLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)

  const [bookingSlot, setBookingSlot] = useState<any | null>(null)
  const [studentQuestion, setStudentQuestion] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  // Selected date as standard local YYYY-MM-DD
  const selectedIso = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`

  // Load slots for selected day
  const loadDaySlots = () => {
    setLoading(true)
    getAvailableSlots(selectedIso, studentId ?? undefined).then((data) => {
      setSlots(data)
      setLoading(false)
    })
  }

  // Load monthly summary for dots
  const loadMonthSummary = () => {
    setSummaryLoading(true)
    getMonthSlotsSummary(viewYear, viewMonth, studentId ?? undefined).then((data) => {
      setMonthSummary(data)
      setSummaryLoading(false)
    })
  }

  useEffect(() => {
    loadMonthSummary()
  }, [viewYear, viewMonth, studentId])

  useEffect(() => {
    loadDaySlots()
  }, [selectedIso, studentId])

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

  const handleConfirmBooking = () => {
    if (!studentId) {
      setBookingError('Your student profile is not set up yet. Please contact your SPC.')
      return
    }
    if (!bookingSlot) return
    setBookingError(null)
    startTransition(async () => {
      const result = await bookSlot(bookingSlot.id, studentId, studentQuestion)
      if (result.success) {
        setBookingSuccess(true)
        loadDaySlots()
        loadMonthSummary()
        setTimeout(() => {
          setBookingSlot(null)
          setBookingSuccess(false)
          setStudentQuestion('')
        }, 1600)
      } else {
        setBookingError(result.error ?? 'Booking failed. Please try again.')
      }
    })
  }

  const selectedDateFormatted = new Date(viewYear, viewMonth, selectedDay).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-6 flex flex-col gap-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight break-words">
          Book a 1-on-1 Mentoring Slot
        </h1>
        <p className="text-[13px] text-[#A0A0AB]">
          15-minute offline session with your Student Placement Coordinator to review technical readiness and update your profile.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: Interactive Calendar Card */}
        <section className="w-full lg:w-[320px] shrink-0 bg-[#121214] border border-[#26262A] rounded-xl p-5 flex flex-col select-none">
          {/* Month & Year Navigation */}
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

          {/* Weekday headers */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAY_NAMES.map((d) => (
              <span key={d} className="text-[11px] uppercase text-[#6E6E78] font-medium">
                {d}
              </span>
            ))}
          </div>

          {/* Days Grid */}
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
              const isMyBookingDay = !!(dayData && dayData.myBooked)

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

                  {/* Dot status indicators */}
                  <div className="flex items-center gap-0.5 absolute bottom-1">
                    {isMyBookingDay ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#30A46C] ring-1 ring-[#30A46C]/40" title="Your confirmed booking" />
                    ) : hasAvailable ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#EDEDEF] shadow-sm" title="Available slots" />
                    ) : hasBooked ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-[#34343A]" title="All slots booked" />
                    ) : null}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Legend */}
          <div className="mt-5 pt-4 border-t border-[#26262A] flex flex-col gap-2">
            <span className="text-[10px] uppercase tracking-wider text-[#6E6E78] font-medium">
              Calendar Legend
            </span>
            <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A0A0AB]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#EDEDEF]" />
                <span>Available</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#34343A]" />
                <span>Fully Booked</span>
              </div>
              <div className="flex items-center gap-1.5 col-span-2">
                <span className="w-2 h-2 rounded-full bg-[#30A46C]" />
                <span>Your Session</span>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Slots List for Selected Date */}
        <section className="flex-1 w-full flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[#EDEDEF] break-words">
              {selectedDateFormatted}
            </h2>
            <span className="text-[13px] text-[#6E6E78] font-mono tabular-nums shrink-0">
              {loading ? '...' : `${slots.filter((s) => !s.isBooked).length} available / ${slots.length} total`}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 text-[#6E6E78]">
              <Loader2 className="w-5 h-5 animate-spin mr-2" />
              <span className="text-[13px]">Loading slots for {MONTH_NAMES[viewMonth]} {selectedDay}...</span>
            </div>
          ) : slots.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2 bg-[#121214] border border-[#26262A] rounded-xl p-6">
              <CalendarIcon className="w-8 h-8 text-[#6E6E78]" />
              <div className="text-[15px] font-medium text-[#EDEDEF]">No Slots Opened for this Date</div>
              <p className="text-[12px] text-[#A0A0AB] max-w-sm">
                Your Student Placement Coordinators haven&apos;t opened any mentoring slots for {MONTH_NAMES[viewMonth]} {selectedDay}. Look for white dots on the calendar for active dates.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {slots.map((slot) => (
                <div
                  key={slot.id}
                  className="rounded-xl bg-[#121214] border border-[#26262A] p-4 hover:border-[#34343A] transition-colors sm:p-5 sm:flex sm:items-center sm:justify-between sm:h-auto"
                >
                  {/* Time */}
                  <div className="flex flex-col shrink-0 mb-3 sm:mb-0 sm:w-[160px]">
                    <span className="font-mono text-[14px] font-medium text-[#EDEDEF] tracking-tight">
                      {formatTime(slot.startTime)} – {addMinutes(slot.startTime, slot.durationMinutes)}
                    </span>
                    <span className="text-[11px] text-[#6E6E78] mt-0.5">
                      {slot.durationMinutes} min · 1-on-1 Mentoring
                    </span>
                  </div>

                  {/* SPC + Location */}
                  <div className="flex flex-col gap-1 mb-3 sm:mb-0 sm:w-[200px]">
                    <span className="text-[13px] font-medium text-[#EDEDEF]">SPC: {slot.spcName}</span>
                    {slot.location ? (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#6E56CF] shrink-0" />
                        <span className="text-[11px] text-[#A0A0AB] truncate">{slot.location}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#6E6E78]">Offline Venue TBA</span>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 mb-3 sm:mb-0 sm:w-[120px]">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        slot.isBookedByMe
                          ? 'bg-[#30A46C]'
                          : slot.isBooked
                          ? 'bg-[#34343A]'
                          : 'bg-[#EDEDEF]'
                      }`}
                    />
                    <span className="text-[12px] font-mono text-[#A0A0AB]">
                      {slot.isBookedByMe
                        ? 'Your Booking'
                        : slot.isBooked
                        ? 'Slot Booked'
                        : 'Available'}
                    </span>
                  </div>

                  {/* Action Button */}
                  <div className="w-full sm:w-auto">
                    {slot.isBookedByMe ? (
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 border-[#30A46C]/40 text-[#30A46C] hover:bg-[#30A46C]/10 cursor-default justify-center"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                        Booked
                      </Button>
                    ) : slot.isBooked ? (
                      <Button variant="ghost" size="sm" disabled className="w-full h-9 text-[#6E6E78] justify-center">
                        Unavailable
                      </Button>
                    ) : (
                      <Button
                        variant="default"
                        size="sm"
                        className="w-full h-9 text-[12px] bg-[#6E56CF] hover:bg-[#7C66DC] text-white justify-center"
                        onClick={() => setBookingSlot(slot)}
                      >
                        Book Slot
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Booking Modal */}
      <Dialog open={!!bookingSlot} onOpenChange={(open) => !open && setBookingSlot(null)}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-md bg-[#121214] border-[#26262A] text-[#EDEDEF] max-h-[calc(100vh-2rem)] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-[17px] text-[#EDEDEF]">
              Confirm 1-on-1 Mentoring Booking
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#A0A0AB]">
              {selectedDateFormatted} ·{' '}
              {bookingSlot ? formatTime(bookingSlot.startTime) : ''} with {bookingSlot?.spcName}
            </DialogDescription>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-center">
              <CheckCircle2 className="w-10 h-10 text-[#30A46C]" />
              <div className="text-[15px] font-semibold text-[#EDEDEF]">Slot Booked Successfully!</div>
              <p className="text-[12px] text-[#A0A0AB]">
                Your SPC will verify your academic info and conduct mock interview prep during this session.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-2">
              {/* Slot details */}
              <div className="p-3 rounded-lg bg-[#18181B] border border-[#26262A] flex flex-col gap-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#6E6E78]">Format</span>
                  <span className="text-[#EDEDEF] font-medium">15-minute 1-on-1 Offline Session</span>
                </div>
                {bookingSlot?.location && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#6E6E78]">Location</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#6E56CF]" />
                      <span className="text-[#EDEDEF] font-medium">{bookingSlot.location}</span>
                    </div>
                  </div>
                )}
                {bookingSlot?.notes && (
                  <div className="flex justify-between items-center">
                    <span className="text-[#6E6E78]">Notes</span>
                    <span className="text-[#A0A0AB]">{bookingSlot.notes}</span>
                  </div>
                )}
              </div>

              {bookingError && (
                <div className="p-3 rounded-lg bg-[#E5484D]/10 border border-[#E5484D]/40 text-[12px] text-[#E5484D]">
                  {bookingError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#6E6E78]">
                  Topics or questions for SPC (Optional)
                </label>
                <textarea
                  rows={3}
                  value={studentQuestion}
                  onChange={(e) => setStudentQuestion(e.target.value)}
                  placeholder="e.g. Resume feedback for Backend roles, questions on DSA..."
                  className="w-full rounded-[10px] bg-[#18181B] border border-[#26262A] p-3 text-[13px] text-[#EDEDEF] placeholder-[#6E6E78] focus:border-[#6E56CF] focus:outline-none resize-none"
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBookingSlot(null)}
                  className="border-[#26262A] bg-[#18181B] text-[#EDEDEF] hover:bg-[#202024]"
                >
                  Cancel
                </Button>
                <Button
                  variant="default"
                  onClick={handleConfirmBooking}
                  disabled={isPending}
                  className="bg-[#6E56CF] hover:bg-[#7C66DC] text-white"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />
                      Booking...
                    </>
                  ) : (
                    'Confirm Booking'
                  )}
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
