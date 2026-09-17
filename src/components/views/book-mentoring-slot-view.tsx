'use client'

import React, { useState } from 'react'
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Users,
  Video,
  Clock,
  Filter,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export function BookMentoringSlotView() {
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(3) // THU 18
  const [filterAvailableOnly, setFilterAvailableOnly] = useState<boolean>(true)
  const [bookingSlot, setBookingSlot] = useState<any | null>(null)
  const [studentQuestion, setStudentQuestion] = useState<string>('')
  const [bookingSuccess, setBookingSuccess] = useState<boolean>(false)

  const weekDays = [
    { dayName: 'MON', dayNum: 15 },
    { dayName: 'TUE', dayNum: 16 },
    { dayName: 'WED', dayNum: 17 },
    { dayName: 'THU', dayNum: 18 },
    { dayName: 'FRI', dayNum: 19 },
    { dayName: 'SAT', dayNum: 20 },
    { dayName: 'SUN', dayNum: 21 },
  ]

  const sampleSlots = [
    {
      id: '1',
      time: '2:45 PM',
      endTime: '3:00 PM',
      duration: '15 min · Google Meet',
      spcName: 'Prof. Riya Mehta',
      spcInitials: 'RM',
      booked: 3,
      max: 4,
      isBookedByMe: false,
    },
    {
      id: '2',
      time: '3:00 PM',
      endTime: '3:15 PM',
      duration: '15 min · Google Meet',
      spcName: 'Prof. Riya Mehta',
      spcInitials: 'RM',
      booked: 4,
      max: 4,
      isBookedByMe: false,
    },
    {
      id: '3',
      time: '3:15 PM',
      endTime: '3:30 PM',
      duration: '15 min · Google Meet',
      spcName: 'Prof. Riya Mehta',
      spcInitials: 'RM',
      booked: 2,
      max: 4,
      isBookedByMe: true,
    },
    {
      id: '4',
      time: '3:45 PM',
      endTime: '4:00 PM',
      duration: '15 min · Google Meet',
      spcName: 'Prof. Kunal Joshi',
      spcInitials: 'KJ',
      booked: 1,
      max: 4,
      isBookedByMe: false,
    },
    {
      id: '5',
      time: '4:15 PM',
      endTime: '4:30 PM',
      duration: '15 min · Google Meet',
      spcName: 'Prof. Kunal Joshi',
      spcInitials: 'KJ',
      booked: 2,
      max: 4,
      isBookedByMe: false,
    },
  ]

  const displayedSlots = sampleSlots.filter((slot) => {
    if (filterAvailableOnly && slot.booked >= slot.max && !slot.isBookedByMe) {
      return false
    }
    return true
  })

  const handleConfirmBooking = () => {
    setBookingSuccess(true)
    setTimeout(() => {
      setBookingSlot(null)
      setBookingSuccess(false)
      setStudentQuestion('')
    }, 1500)
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 flex flex-col">
      {/* Page Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
          Book a mentoring slot
        </h1>
        <p className="text-[13px] text-[#A0A0AB]">
          15-minute 4-on-1 sessions with your SPCs to review resumes, technical prep, and mock interviews.
        </p>
      </div>

      {/* Week Strip: 7 Horizontally Arranged Cards */}
      <div className="grid grid-cols-7 gap-2.5 mb-4 select-none">
        {weekDays.map((day, idx) => {
          const isActive = selectedDayIndex === idx

          return (
            <div
              key={day.dayNum}
              onClick={() => setSelectedDayIndex(idx)}
              className={`h-[56px] rounded-[10px] flex flex-col items-center justify-center gap-0.5 cursor-pointer transition-all ${
                isActive
                  ? 'bg-[#6E56CF]/[0.16] border border-[#6E56CF] text-[#cbbeff]'
                  : 'bg-[#121214] border border-[#26262A] hover:border-[#34343A] hover:bg-[#18181B] text-[#EDEDEF]'
              }`}
            >
              <span
                className={`text-[11px] font-medium ${
                  isActive ? 'text-[#cbbeff]' : 'text-[#6E6E78]'
                }`}
              >
                {day.dayName}
              </span>
              <span
                className={`text-[16px] font-mono leading-none ${
                  isActive ? 'font-semibold text-[#cbbeff]' : 'text-[#EDEDEF]'
                }`}
              >
                {day.dayNum}
              </span>
            </div>
          )
        })}
      </div>

      {/* Filter Row */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {/* Filter 1 */}
          <button className="h-[28px] px-3 rounded-full border border-[#26262A] bg-[#121214] hover:bg-[#18181B] hover:border-[#34343A] flex items-center gap-1.5 text-[12px] text-[#A0A0AB] transition-colors">
            <span>All SPCs</span>
          </button>

          {/* Filter 2: Available only */}
          <button
            onClick={() => setFilterAvailableOnly(!filterAvailableOnly)}
            className={`h-[28px] px-3 rounded-full border flex items-center gap-2 text-[12px] transition-colors ${
              filterAvailableOnly
                ? 'border-[#484553] bg-[#18181B] text-[#EDEDEF]'
                : 'border-[#26262A] bg-[#121214] text-[#6E6E78]'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                filterAvailableOnly ? 'bg-[#6E56CF]' : 'bg-[#6E6E78]'
              }`}
            />
            <span>Available only</span>
          </button>

          {/* Filter 3 */}
          <button className="h-[28px] px-3 rounded-full border border-[#26262A] bg-[#121214] hover:bg-[#18181B] hover:border-[#34343A] flex items-center gap-1.5 text-[12px] text-[#A0A0AB] transition-colors">
            <span>This week</span>
          </button>
        </div>

        {/* Counter label */}
        <span className="text-[13px] text-[#6E6E78] font-mono tabular-nums">
          {displayedSlots.length} slots available
        </span>
      </div>

      {/* Slot List */}
      <div className="flex flex-col gap-3">
        {displayedSlots.map((slot) => {
          const isFull = slot.booked >= slot.max
          const spotsLeft = slot.max - slot.booked

          return (
            <div
              key={slot.id}
              className="h-[72px] rounded-xl bg-[#121214] border border-[#26262A] px-5 flex items-center justify-between hover:border-[#34343A] transition-colors"
            >
              {/* Left Time & Duration */}
              <div className="w-[140px] flex flex-col shrink-0">
                <span className="font-mono text-[14px] font-medium text-[#EDEDEF] tracking-tight">
                  {slot.time}
                </span>
                <span className="text-[11px] text-[#6E6E78] mt-0.5">
                  15 min session
                </span>
              </div>

              {/* Mentor */}
              <div className="flex items-center gap-2.5 w-[200px]">
                <div className="w-7 h-7 rounded-full bg-[#18181B] border border-[#26262A] flex items-center justify-center text-[#EDEDEF] text-[11px] font-medium font-mono">
                  {slot.spcInitials}
                </div>
                <div className="flex flex-col">
                  <span className="text-[13px] font-medium text-[#EDEDEF]">
                    {slot.spcName}
                  </span>
                  <span className="text-[11px] text-[#6E6E78]">Google Meet</span>
                </div>
              </div>

              {/* Capacity 4-on-1 */}
              <div className="flex items-center gap-3 w-[180px]">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        i < slot.booked ? 'bg-[#6E56CF]' : 'bg-[#34343A]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-[12px] text-[#A0A0AB] font-mono">
                  {isFull
                    ? 'Full (4/4)'
                    : `${spotsLeft} spot${spotsLeft > 1 ? 's' : ''} left`}
                </span>
              </div>

              {/* Action */}
              <div>
                {slot.isBookedByMe ? (
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-8 border-[#30A46C]/40 text-[#30A46C] hover:bg-[#30A46C]/10 cursor-default"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    You are booked
                  </Button>
                ) : isFull ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled
                    className="h-8 text-[#6E6E78]"
                  >
                    Slot Full
                  </Button>
                ) : (
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 text-[12px]"
                    onClick={() => setBookingSlot(slot)}
                  >
                    Book Slot
                  </Button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Booking Dialog Modal */}
      <Dialog
        open={!!bookingSlot}
        onOpenChange={(open) => !open && setBookingSlot(null)}
      >
        <DialogContent className="max-w-md bg-[#1F1F23] border-[#26262A]">
          <DialogHeader>
            <DialogTitle className="text-[17px] text-[#EDEDEF]">
              Confirm Mentoring Booking
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#A0A0AB]">
              Thursday, {weekDays[selectedDayIndex]?.dayNum} Sept 2026 ·{' '}
              {bookingSlot?.time} with {bookingSlot?.spcName}
            </DialogDescription>
          </DialogHeader>

          {bookingSuccess ? (
            <div className="py-6 flex flex-col items-center justify-center gap-2 text-center">
              <CheckCircle2 className="w-10 h-10 text-[#30A46C]" />
              <div className="text-[15px] font-semibold text-[#EDEDEF]">
                Slot Booked Successfully!
              </div>
              <p className="text-[12px] text-[#A0A0AB]">
                Google Meet link and calendar invitation will be sent to your Nirma email.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 py-2">
              <div className="p-3 rounded-lg bg-[#121214] border border-[#26262A] flex flex-col gap-1 text-[12px]">
                <div className="text-[#6E6E78]">Format</div>
                <div className="text-[#EDEDEF] font-medium">
                  15-minute 4-on-1 Peer Mentoring Group Session
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] uppercase tracking-wider text-[#6E6E78]">
                  Questions or topics for your SPC (Optional)
                </label>
                <textarea
                  rows={3}
                  value={studentQuestion}
                  onChange={(e) => setStudentQuestion(e.target.value)}
                  placeholder="e.g., Resume review for Backend roles, or LeetCode graph problem strategies..."
                  className="w-full rounded-[10px] bg-[#18181B] border border-[#26262A] p-3 text-[13px] text-[#EDEDEF] placeholder-[#6E6E78] focus:border-[#6E56CF] focus:outline-none"
                />
              </div>

              <DialogFooter className="gap-2">
                <Button
                  variant="outline"
                  onClick={() => setBookingSlot(null)}
                >
                  Cancel
                </Button>
                <Button variant="default" onClick={handleConfirmBooking}>
                  Confirm Booking
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
