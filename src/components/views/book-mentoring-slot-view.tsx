'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  CheckCircle2,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { getAvailableSlots, bookSlot } from '@/app/actions/slot-actions'

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

function getWeekDays() {
  const today = new Date()
  const days = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({
      dayName: d.toLocaleDateString('en-IN', { weekday: 'short' }).toUpperCase(),
      dayNum: d.getDate(),
      isoDate: d.toISOString().split('T')[0],
    })
  }
  return days
}

export function BookMentoringSlotView({ userId, studentId }: BookMentoringSlotViewProps) {
  const weekDays = getWeekDays()
  const [selectedDayIndex, setSelectedDayIndex] = useState(0)
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [bookingSlot, setBookingSlot] = useState<any | null>(null)
  const [studentQuestion, setStudentQuestion] = useState('')
  const [bookingSuccess, setBookingSuccess] = useState(false)
  const [bookingError, setBookingError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const selectedDate = weekDays[selectedDayIndex]?.isoDate ?? weekDays[0].isoDate

  useEffect(() => {
    setLoading(true)
    getAvailableSlots(selectedDate, studentId ?? undefined).then((data) => {
      setSlots(data)
      setLoading(false)
    })
  }, [selectedDate, studentId])

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
        // Re-fetch slots after booking
        const updated = await getAvailableSlots(selectedDate, studentId)
        setSlots(updated)
        setTimeout(() => {
          setBookingSlot(null)
          setBookingSuccess(false)
          setStudentQuestion('')
        }, 1800)
      } else {
        setBookingError(result.error ?? 'Booking failed. Please try again.')
      }
    })
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 flex flex-col">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
          Book a 1-on-1 Mentoring Slot
        </h1>
        <p className="text-[13px] text-[#A0A0AB]">
          15-minute individual session with your Student Placement Coordinator to review your resume, technical readiness, and update your placement profile.
        </p>
      </div>

      {/* Week Strip */}
      <div className="grid grid-cols-7 gap-2.5 mb-6 select-none">
        {weekDays.map((day, idx) => {
          const isActive = selectedDayIndex === idx
          return (
            <div
              key={day.isoDate}
              onClick={() => setSelectedDayIndex(idx)}
              className={`h-[56px] rounded-[10px] flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#6E56CF]/[0.16] border border-[#6E56CF] text-[#cbbeff]'
                  : 'bg-[#121214] border border-[#26262A] hover:border-[#34343A] hover:bg-[#18181B] text-[#EDEDEF]'
              }`}
            >
              <span className={`text-[11px] font-medium ${isActive ? 'text-[#cbbeff]' : 'text-[#6E6E78]'}`}>
                {day.dayName}
              </span>
              <span className={`text-[16px] font-mono leading-none ${isActive ? 'font-semibold text-[#cbbeff]' : 'text-[#EDEDEF]'}`}>
                {day.dayNum}
              </span>
            </div>
          )
        })}
      </div>

      {/* Slot count */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] text-[#6E6E78]">
          {weekDays[selectedDayIndex]?.dayName}, {weekDays[selectedDayIndex]?.dayNum}
        </span>
        <span className="text-[13px] text-[#6E6E78] font-mono tabular-nums">
          {slots.filter((s) => !s.isBooked).length} slots available
        </span>
      </div>

      {/* Slot List */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#6E6E78]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-[13px]">Loading slots...</span>
        </div>
      ) : slots.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-2">
          <div className="text-[15px] font-medium text-[#EDEDEF]">No slots available</div>
          <p className="text-[12px] text-[#A0A0AB]">
            Your SPC hasn&apos;t opened any mentoring slots for this day yet.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {slots.map((slot) => (
            <div
              key={slot.id}
              className="h-[80px] rounded-xl bg-[#121214] border border-[#26262A] px-5 flex items-center justify-between hover:border-[#34343A] transition-colors"
            >
              {/* Time */}
              <div className="w-[180px] flex flex-col shrink-0">
                <span className="font-mono text-[14px] font-medium text-[#EDEDEF] tracking-tight">
                  {formatTime(slot.startTime)} – {addMinutes(slot.startTime, slot.durationMinutes)}
                </span>
                <span className="text-[11px] text-[#6E6E78] mt-0.5">
                  {slot.durationMinutes} min · 1-on-1 Mentoring
                </span>
              </div>

              {/* SPC + Location */}
              <div className="flex flex-col w-[220px]">
                <span className="text-[13px] font-medium text-[#EDEDEF]">{slot.spcName}</span>
                {slot.location ? (
                  <div className="flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-[#6E56CF] shrink-0" />
                    <span className="text-[11px] text-[#A0A0AB] truncate">{slot.location}</span>
                  </div>
                ) : (
                  <span className="text-[11px] text-[#6E6E78] mt-0.5">Location TBA</span>
                )}
              </div>

              {/* Capacity */}
              <div className="flex items-center gap-2 w-[140px]">
                <span
                  className={`w-2 h-2 rounded-full ${
                    slot.isBooked && !slot.isBookedByMe ? 'bg-[#E5484D]' : 'bg-[#30A46C]'
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

              {/* Action */}
              <div>
                {slot.isBookedByMe ? (
                  <Button variant="outline" size="sm" className="h-8 border-[#30A46C]/40 text-[#30A46C] hover:bg-[#30A46C]/10 cursor-default">
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Booked
                  </Button>
                ) : slot.isBooked ? (
                  <Button variant="ghost" size="sm" disabled className="h-8 text-[#6E6E78]">
                    Unavailable
                  </Button>
                ) : (
                  <Button variant="default" size="sm" className="h-8 text-[12px]" onClick={() => setBookingSlot(slot)}>
                    Book Slot
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Booking Dialog */}
      <Dialog open={!!bookingSlot} onOpenChange={(open) => !open && setBookingSlot(null)}>
        <DialogContent className="max-w-md bg-[#1F1F23] border-[#26262A]">
          <DialogHeader>
            <DialogTitle className="text-[17px] text-[#EDEDEF]">
              Confirm 1-on-1 Mentoring Booking
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#A0A0AB]">
              {weekDays[selectedDayIndex]?.dayName}, {weekDays[selectedDayIndex]?.dayNum} ·{' '}
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
              {/* Slot summary */}
              <div className="p-3 rounded-lg bg-[#121214] border border-[#26262A] flex flex-col gap-2 text-[12px]">
                <div className="flex justify-between">
                  <span className="text-[#6E6E78]">Format</span>
                  <span className="text-[#EDEDEF] font-medium">{bookingSlot?.durationMinutes ?? 15}-min · 1-on-1</span>
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
              </div>

              {bookingError && (
                <div className="p-3 rounded-lg bg-[#E5484D]/10 border border-[#E5484D]/40 text-[12px] text-[#E5484D]">
                  {bookingError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#6E6E78]">
                  Questions for your SPC (Optional)
                </label>
                <textarea
                  rows={3}
                  value={studentQuestion}
                  onChange={(e) => setStudentQuestion(e.target.value)}
                  placeholder="e.g. Resume review for Backend roles, or help with system design..."
                  className="w-full rounded-[10px] bg-[#18181B] border border-[#26262A] p-3 text-[13px] text-[#EDEDEF] placeholder-[#6E6E78] focus:border-[#6E56CF] focus:outline-none resize-none"
                />
              </div>

              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setBookingSlot(null)}>
                  Cancel
                </Button>
                <Button variant="default" onClick={handleConfirmBooking} disabled={isPending}>
                  {isPending ? (
                    <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Booking...</>
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
