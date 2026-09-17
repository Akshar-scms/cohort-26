'use client'

import React, { useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  AlertTriangle,
  X,
  Clock,
  Video,
  CheckCircle2,
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

export function SpcSlotsManagerView() {
  const [selectedDay, setSelectedDay] = useState<number>(18)
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false)
  const [newStartTime, setNewStartTime] = useState('15:00')
  const [newMeetingLink, setNewMeetingLink] = useState('https://meet.google.com/abc-defg-hij')

  // Sample slots reflecting the Stitch design state
  const [slots, setSlots] = useState([
    {
      id: '1',
      time: '3:00 – 3:15 PM',
      duration: '15 min · Google Meet',
      booked: 4,
      max: 4,
      students: [
        { initials: 'KP', name: 'Karan Patel' },
        { initials: 'SS', name: 'Sneha Shah' },
        { initials: 'AD', name: 'Arjun Dave' },
        { initials: 'PJ', name: 'Pooja Joshi' },
      ],
      warning: null,
    },
    {
      id: '2',
      time: '3:15 – 3:30 PM',
      duration: '15 min · Google Meet',
      booked: 2,
      max: 4,
      students: [
        { initials: 'AS', name: 'Aman Sharma' },
        { initials: 'DP', name: 'Dhruv Parikh' },
      ],
      warning: null,
    },
    {
      id: '3',
      time: '3:25 – 3:40 PM',
      duration: '15 min · Google Meet',
      booked: 1,
      max: 4,
      students: [{ initials: 'VV', name: 'Vikas Verma' }],
      warning: 'Overlaps with 3:15 PM slot',
    },
    {
      id: '4',
      time: '3:45 – 4:00 PM',
      duration: '15 min · Google Meet',
      booked: 3,
      max: 4,
      students: [
        { initials: 'NK', name: 'Nikhil Kumar' },
        { initials: 'RY', name: 'Rohan Yadav' },
        { initials: 'MS', name: 'Mansi Shah' },
      ],
      warning: null,
    },
  ])

  const handleAddSlot = () => {
    const newSlot = {
      id: String(Date.now()),
      time: `${newStartTime} – 15 mins`,
      duration: '15 min · Google Meet',
      booked: 0,
      max: 4,
      students: [],
      warning: null,
    }
    setSlots([...slots, newSlot])
    setIsAddModalOpen(false)
  }

  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter((s) => s.id !== id))
  }

  const daysWithSlots = [10, 15, 17, 18, 22, 24]

  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 flex-1 flex flex-col">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1">
        <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
          Manage slots
        </h1>
        <p className="text-[13px] text-[#A0A0AB]">
          Open 15-minute 4-on-1 mentoring slots for your batch.
        </p>
      </div>

      {/* Two-Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left Column: Calendar Card (320px fixed) */}
        <section className="w-full lg:w-[320px] shrink-0 bg-[#121214] border border-[#26262A] rounded-xl p-5 flex flex-col">
          {/* Month Header */}
          <div className="flex items-center justify-between mb-4">
            <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#26262A] bg-[#121214] hover:bg-[#18181B] text-[#A0A0AB] hover:text-[#EDEDEF] transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[14px] font-medium text-[#EDEDEF]">
              September 2026
            </span>
            <button className="w-7 h-7 flex items-center justify-center rounded-lg border border-[#26262A] bg-[#121214] hover:bg-[#18181B] text-[#A0A0AB] hover:text-[#EDEDEF] transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
              <span
                key={day}
                className="text-[11px] uppercase text-[#6E6E78] font-medium"
              >
                {day}
              </span>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1 text-center">
            {/* Padded previous month */}
            <div className="h-8 flex items-center justify-center text-[12px] text-[#34343A]">
              30
            </div>
            <div className="h-8 flex items-center justify-center text-[12px] text-[#34343A]">
              31
            </div>

            {/* Current month days 1 to 30 */}
            {Array.from({ length: 30 }, (_, i) => i + 1).map((day) => {
              const isSelected = selectedDay === day
              const isToday = day === 17
              const hasSlots = daysWithSlots.includes(day)

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  className={`h-8 flex flex-col items-center justify-center rounded-[8px] relative cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#6E56CF]/[0.18] text-[#cbbeff] font-semibold border border-[#6E56CF]'
                      : isToday
                      ? 'border border-[#34343A] text-[#EDEDEF]'
                      : 'text-[#A0A0AB] hover:text-[#EDEDEF] hover:bg-[#18181B]'
                  }`}
                >
                  <span className="text-[12px] font-mono leading-none">{day}</span>
                  {hasSlots && (
                    <span
                      className={`w-1 h-1 rounded-full absolute bottom-1 ${
                        isSelected ? 'bg-[#cbbeff]' : 'bg-[#6E56CF]'
                      }`}
                    />
                  )}
                </div>
              )
            })}
          </div>

          {/* Single Accent Action Rule */}
          <div className="mt-5">
            <Button
              variant="default"
              className="w-full h-9 gap-1.5"
              onClick={() => setIsAddModalOpen(true)}
            >
              <Plus className="w-4 h-4" />
              <span>Add availability</span>
            </Button>
          </div>
        </section>

        {/* Right Column: Slots Stack */}
        <section className="flex-1 w-full flex flex-col">
          {/* Day Header Row */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-[16px] font-semibold text-[#EDEDEF]">
              Thursday, {selectedDay} September
            </h2>
            <span className="text-[13px] text-[#6E6E78] font-mono tabular-nums">
              {slots.length} slots ·{' '}
              {slots.reduce((acc, s) => acc + s.booked, 0)}/
              {slots.length * 4} booked
            </span>
          </div>

          {/* Slots Cards Stack */}
          <div className="flex flex-col gap-3">
            {slots.map((slot) => {
              const isWarning = !!slot.warning

              return (
                <div
                  key={slot.id}
                  className={`h-[76px] bg-[#121214] border rounded-xl px-5 flex items-center justify-between transition-colors ${
                    isWarning
                      ? 'border-[#FFB224]'
                      : 'border-[#26262A] hover:border-[#34343A]'
                  }`}
                >
                  {/* Left info */}
                  <div className="w-[170px] flex flex-col justify-center shrink-0">
                    <span className="font-mono text-[13px] font-medium text-[#EDEDEF] tabular-nums">
                      {slot.time}
                    </span>
                    {isWarning ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <AlertTriangle className="w-3 h-3 text-[#FFB224] shrink-0" />
                        <span className="text-[11px] text-[#FFB224] truncate">
                          {slot.warning}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#6E6E78] mt-0.5">
                        {slot.duration}
                      </span>
                    )}
                  </div>

                  {/* Middle: 4-on-1 Indicators */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 4 }).map((_, i) => (
                        <span
                          key={i}
                          className={`w-1.5 h-1.5 rounded-full ${
                            i < slot.booked
                              ? 'bg-[#6E56CF]'
                              : 'bg-[#34343A]'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-[12px] text-[#A0A0AB] font-mono tabular-nums">
                      {slot.booked}/4 booked
                    </span>

                    {/* Student Avatars */}
                    <div className="flex items-center -space-x-2">
                      {slot.students.map((st, idx) => (
                        <div
                          key={idx}
                          className="w-6 h-6 rounded-full bg-[#18181B] border border-[#26262A] flex items-center justify-center font-mono text-[10px] text-[#EDEDEF] font-medium"
                          title={st.name}
                        >
                          {st.initials}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-[12px] border-[#26262A] hover:border-[#34343A]"
                      onClick={() => alert(`Editing slot ${slot.time}`)}
                    >
                      Edit
                    </Button>
                    <button
                      onClick={() => handleDeleteSlot(slot.id)}
                      className="w-7 h-7 rounded-lg border border-[#E5484D]/40 text-[#E5484D] hover:bg-[#E5484D]/10 flex items-center justify-center transition-colors"
                      title="Remove Slot"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
      </div>

      {/* Add Availability Modal Dialog */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-md bg-[#1F1F23] border-[#26262A]">
          <DialogHeader>
            <DialogTitle className="text-[17px] text-[#EDEDEF]">
              Add Mentoring Availability
            </DialogTitle>
            <DialogDescription className="text-[13px] text-[#A0A0AB]">
              Create a 15-minute, 4-on-1 mentoring slot for Thursday, {selectedDay} Sept 2026.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#6E6E78]">
                Start Time
              </label>
              <Input
                type="time"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
                className="font-mono bg-[#18181B] border-[#26262A]"
              />
              <span className="text-[11px] text-[#6E6E78]">
                Duration is automatically set to 15 minutes (Max 4 students)
              </span>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] uppercase tracking-wider text-[#6E6E78]">
                Google Meet / Zoom URL
              </label>
              <Input
                type="url"
                value={newMeetingLink}
                onChange={(e) => setNewMeetingLink(e.target.value)}
                placeholder="https://meet.google.com/..."
                className="bg-[#18181B] border-[#26262A]"
              />
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setIsAddModalOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="default" onClick={handleAddSlot}>
              Publish Slot
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
