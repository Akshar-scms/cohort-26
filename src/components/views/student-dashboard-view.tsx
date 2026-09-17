'use client'

import React, { useEffect, useState } from 'react'
import {
  ArrowRight,
  Check,
  Sparkles,
  MapPin,
  ShieldCheck,
  Clock,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getStudentUpcomingBooking } from '@/app/actions/slot-actions'

interface StudentDashboardViewProps {
  userId: string
  userName: string
  role: 'SPC' | 'STUDENT'
  studentProfile: Record<string, unknown> | null
  onNavigateToBooking?: () => void
}

const PLACEMENT_STATUS_LABELS: Record<string, { label: string; variant: string; dot: string }> = {
  NOT_STARTED:  { label: 'Not Started',  variant: 'secondary', dot: '#6E6E78' },
  PREPARATION:  { label: 'Preparation',  variant: 'secondary', dot: '#A0A0AB' },
  APPLIED:      { label: 'Applied',      variant: 'info',      dot: '#0091FF' },
  INTERVIEW:    { label: 'Interviewing', variant: 'warning',   dot: '#FFB224' },
  SHORTLISTED:  { label: 'Shortlisted',  variant: 'success',   dot: '#30A46C' },
  OFFERED:      { label: 'Offered',      variant: 'success',   dot: '#30A46C' },
  PLACED:       { label: 'Placed',       variant: 'success',   dot: '#30A46C' },
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatTime(timeStr: string) {
  // "14:30:00" → "2:30 PM"
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })
}

function profileCompleteness(profile: Record<string, unknown> | null): number {
  if (!profile) return 0
  const fields = ['cgpa', 'phone', 'linkedinUrl', 'githubUrl', 'resumeUrl', 'targetRole', 'bio', 'enrollmentNumber']
  const filled = fields.filter((f) => !!profile[f]).length
  return Math.round((filled / fields.length) * 100)
}

export function StudentDashboardView({
  userId,
  userName,
  role,
  studentProfile,
  onNavigateToBooking,
}: StudentDashboardViewProps) {
  const [upcomingBooking, setUpcomingBooking] = useState<any>(null)
  const [loadingBooking, setLoadingBooking] = useState(true)

  const studentId = (studentProfile as any)?.id ?? null
  const skillCount = (studentProfile as any)?.skills?.length ?? 0
  const placementStatus = (studentProfile as any)?.placementStatus ?? 'NOT_STARTED'
  const statusInfo = PLACEMENT_STATUS_LABELS[placementStatus] ?? PLACEMENT_STATUS_LABELS.NOT_STARTED
  const completeness = profileCompleteness(studentProfile)

  const checklistItems = [
    { text: 'Book 1-on-1 mentoring slot with SPC', completed: !!upcomingBooking },
    { text: 'Verify academic CGPA during session', completed: !!(studentProfile as any)?.cgpa },
    { text: 'Have SPC verify technical skills', completed: skillCount > 0 },
    { text: 'Link GitHub profile', completed: !!(studentProfile as any)?.githubUrl },
    { text: 'Complete mock interview prep', completed: placementStatus === 'PLACED' || placementStatus === 'OFFERED' },
  ]
  const completedCount = checklistItems.filter((i) => i.completed).length

  useEffect(() => {
    if (!studentId) {
      setLoadingBooking(false)
      return
    }
    getStudentUpcomingBooking(studentId).then((b) => {
      setUpcomingBooking(b)
      setLoadingBooking(false)
    })
  }, [studentId])

  const slot = upcomingBooking?.slot
  const spcName = slot?.spc?.name ?? null
  const slotDate = slot?.slotDate ?? null
  const slotTime = slot?.startTime ?? null
  const slotLocation = slot?.location ?? null
  const durationMins = slot?.durationMinutes ?? 15

  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-baseline justify-between pt-1">
        <div>
          <h1 className="text-[24px] font-semibold text-[#EDEDEF] tracking-tight">
            {getGreeting()}, {userName.split(' ')[0]}
          </h1>
          <p className="text-[12px] text-[#A0A0AB] mt-0.5">
            {role === 'SPC'
              ? 'SPC Portal · Manage mentoring slots and student profiles.'
              : 'Student Portal · Your profile is updated during 1-on-1 mentoring sessions.'}
          </p>
        </div>
        <div className="text-[13px] text-[#A0A0AB] font-mono">
          {new Date().toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' })} · MCA &apos;26
        </div>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-5 flex flex-col justify-between h-[126px] bg-[#121214] border-[#26262A]">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
            Profile Completeness
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[28px] font-semibold text-[#EDEDEF] font-mono tabular-nums leading-none">
              {completeness}%
            </div>
            <div className="w-full h-1 bg-[#26262A] rounded-full overflow-hidden">
              <div
                className="bg-[#6E56CF] h-full rounded-full transition-all"
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-[126px] bg-[#121214] border-[#26262A]">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
            Next 1-on-1 Session
          </div>
          <div className="flex flex-col">
            {loadingBooking ? (
              <div className="text-[13px] text-[#6E6E78] font-mono">Loading...</div>
            ) : slotDate && slotTime ? (
              <>
                <div className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight leading-none">
                  {formatDate(slotDate)}
                </div>
                <div className="text-[12px] text-[#A0A0AB] mt-1.5 font-mono">
                  {formatTime(slotTime)} · {durationMins}-min slot
                </div>
              </>
            ) : (
              <>
                <div className="text-[18px] font-semibold text-[#6E6E78] leading-none">
                  Not booked
                </div>
                <div className="text-[11px] text-[#6E6E78] mt-1.5">
                  Book a slot to get started
                </div>
              </>
            )}
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-[126px] bg-[#121214] border-[#26262A]">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
            Placement Status
          </div>
          <div className="flex items-center">
            <Badge variant={statusInfo.variant as any} dotColor={statusInfo.dot}>
              {statusInfo.label}
            </Badge>
          </div>
        </Card>

        <Card className="p-5 flex flex-col justify-between h-[126px] bg-[#121214] border-[#26262A]">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
            Verified Skills Logged
          </div>
          <div className="text-[28px] font-semibold text-[#EDEDEF] font-mono tabular-nums leading-none">
            {skillCount}
          </div>
        </Card>
      </div>

      {/* 2-Column: Booking card + Checklist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Booking Card */}
        <Card className="lg:col-span-2 bg-[#121214] border-[#26262A] flex flex-col justify-between overflow-hidden">
          <div className="p-6 flex flex-col gap-5">
            {upcomingBooking && spcName ? (
              <>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[13px] text-[#EDEDEF] font-medium">
                    {slotDate ? formatDate(slotDate) : '—'} · {slotTime ? formatTime(slotTime) : '—'}
                  </span>
                  <Badge variant="info" dotColor="#0091FF">
                    1-on-1 Confirmed
                  </Badge>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#18181B] border border-[#26262A] flex items-center justify-center text-[#EDEDEF] text-[12px] font-medium font-mono shrink-0">
                    {spcName
                      .split(' ')
                      .slice(0, 2)
                      .map((w: string) => w[0])
                      .join('')
                      .toUpperCase()}
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-2">
                      <span className="text-[14px] font-medium text-[#EDEDEF]">
                        {spcName}
                      </span>
                      <span className="px-2 h-[20px] inline-flex items-center rounded-full border border-[#26262A] text-[11px] text-[#A0A0AB]">
                        SPC Coordinator
                      </span>
                    </div>
                    {slotLocation ? (
                      <div className="flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 text-[#6E56CF]" />
                        <span className="text-[11px] text-[#A0A0AB]">{slotLocation}</span>
                      </div>
                    ) : (
                      <span className="text-[11px] text-[#6E6E78]">
                        Individual {durationMins}-min Session · Location TBA
                      </span>
                    )}
                  </div>
                </div>

                <div className="h-[1px] bg-[#26262A] w-full" />

                <div className="p-3.5 rounded-lg bg-[#18181B] border border-[#26262A] text-[12px] text-[#A0A0AB] leading-relaxed flex items-start gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-[#6E56CF] shrink-0 mt-0.5" />
                  <span>
                    During this session, your SPC will verify your CGPA, log your technical skills, conduct mock interview questions, and update your placement readiness.
                  </span>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center justify-center gap-3 py-6 text-center">
                <Clock className="w-8 h-8 text-[#34343A]" />
                <div className="text-[15px] font-medium text-[#EDEDEF]">
                  No mentoring session booked yet
                </div>
                <p className="text-[12px] text-[#A0A0AB] max-w-xs">
                  Book a 15-minute 1-on-1 session with your SPC to begin your placement journey.
                </p>
              </div>
            )}
          </div>

          <div className="p-5 pt-3 border-t border-[#26262A] bg-[#121214] flex items-center gap-3">
            <Button
              variant="default"
              className="gap-1.5 text-[13px]"
              onClick={onNavigateToBooking}
            >
              <span>{upcomingBooking ? 'View / Manage Slots' : 'Book a Session'}</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </Card>

        {/* Checklist */}
        <Card className="bg-[#121214] border-[#26262A] flex flex-col justify-between overflow-hidden">
          <div className="p-5">
            <h2 className="text-[15px] font-semibold text-[#EDEDEF] mb-4">
              Placement checklist
            </h2>
            <div className="flex flex-col gap-3">
              {checklistItems.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  {item.completed ? (
                    <div className="w-4 h-4 rounded bg-[#6E56CF] flex items-center justify-center text-white shrink-0">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  ) : (
                    <div className="w-4 h-4 rounded border border-[#34343A] bg-[#121214] shrink-0" />
                  )}
                  <span
                    className={`text-[13px] ${
                      item.completed ? 'text-[#6E6E78] line-through' : 'text-[#EDEDEF]'
                    }`}
                  >
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-[#26262A] bg-[#121214] text-[11px] text-[#6E6E78]">
            {completedCount} of {checklistItems.length} complete
          </div>
        </Card>
      </div>

      {/* Notice */}
      <Card className="bg-[#121214] border-[#26262A] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6E56CF]" />
            <h3 className="text-[14px] font-semibold text-[#EDEDEF]">
              MCA &apos;26 Mentoring Guidelines
            </h3>
          </div>
          <span className="text-[11px] text-[#6E6E78]">Placement Cell · Nirma University</span>
        </div>
        <div className="text-[13px] text-[#A0A0AB] leading-relaxed">
          Each candidate is allocated one 15-minute 1-on-1 mentoring slot per cycle. Ensure your resume and project repository links are ready before your session begins.
        </div>
      </Card>
    </div>
  )
}
