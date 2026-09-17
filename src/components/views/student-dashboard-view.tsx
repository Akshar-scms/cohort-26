'use client'

import React from 'react'
import {
  ArrowRight,
  Check,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface StudentDashboardViewProps {
  onNavigateToBooking?: () => void
}

export function StudentDashboardView({ onNavigateToBooking }: StudentDashboardViewProps) {
  const checklistItems = [
    { text: 'Upload primary master resume', completed: true },
    { text: 'Verify academic score (CGPA)', completed: true },
    { text: 'Log at least 10 core skills', completed: true },
    { text: 'Link GitHub & LeetCode profiles', completed: false },
    { text: 'Attend mandatory mock technical interview', completed: false },
  ]

  const completedCount = checklistItems.filter((i) => i.completed).length

  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 flex flex-col gap-6">
      {/* Page Title & Date */}
      <div className="flex items-baseline justify-between pt-1">
        <h1 className="text-[24px] font-semibold text-[#EDEDEF] tracking-tight">
          Good evening, Aarav
        </h1>
        <div className="text-[13px] text-[#A0A0AB] font-mono">
          Wed, 17 Sept · MCA &apos;26
        </div>
      </div>

      {/* Row 1: 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <Card className="p-5 flex flex-col justify-between h-[126px] bg-[#121214] border-[#26262A]">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
            Profile Completeness
          </div>
          <div className="flex flex-col gap-2">
            <div className="text-[28px] font-semibold text-[#EDEDEF] font-mono tabular-nums leading-none">
              82%
            </div>
            <div className="w-full h-1 bg-[#26262A] rounded-full overflow-hidden">
              <div
                className="bg-[#6E56CF] h-full rounded-full"
                style={{ width: '82%' }}
              />
            </div>
          </div>
        </Card>

        {/* Metric 2 */}
        <Card className="p-5 flex flex-col justify-between h-[126px] bg-[#121214] border-[#26262A]">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
            Next Session
          </div>
          <div className="flex flex-col">
            <div className="text-[28px] font-semibold text-[#EDEDEF] tracking-tight leading-none">
              Tomorrow
            </div>
            <div className="text-[12px] text-[#A0A0AB] mt-1.5 font-mono">
              3:15 PM · with 3 peers
            </div>
          </div>
        </Card>

        {/* Metric 3 */}
        <Card className="p-5 flex flex-col justify-between h-[126px] bg-[#121214] border-[#26262A]">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
            Placement Status
          </div>
          <div className="flex items-center">
            <Badge variant="warning" dotColor="#FFB224">
              Interviewing
            </Badge>
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="p-5 flex flex-col justify-between h-[126px] bg-[#121214] border-[#26262A]">
          <div className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
            Skills Logged
          </div>
          <div className="text-[28px] font-semibold text-[#EDEDEF] font-mono tabular-nums leading-none">
            14
          </div>
        </Card>
      </div>

      {/* Row 2: 2 Column Layout (2fr / 1fr) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {/* Left Card: Mentoring Session */}
        <Card className="lg:col-span-2 bg-[#121214] border-[#26262A] flex flex-col justify-between overflow-hidden">
          <div className="p-6 flex flex-col gap-5">
            {/* Header */}
            <div className="flex items-center justify-between">
              <span className="font-mono text-[13px] text-[#EDEDEF] font-medium">
                Thu, 18 Sept · 3:15 – 3:30 PM
              </span>
              <Badge variant="info" dotColor="#0091FF">
                Scheduled
              </Badge>
            </div>

            {/* Mentor Details */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#18181B] border border-[#26262A] flex items-center justify-center text-[#EDEDEF] text-[12px] font-medium font-mono shrink-0">
                RM
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-medium text-[#EDEDEF]">
                  Prof. Riya Mehta
                </span>
                <span className="px-2 h-[20px] inline-flex items-center rounded-full border border-[#26262A] text-[11px] text-[#A0A0AB]">
                  SPC Mentor
                </span>
              </div>
            </div>

            <div className="h-[1px] bg-[#26262A] w-full" />

            {/* 4-on-1 Peer Details */}
            <div className="flex flex-col gap-2">
              <div className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
                4-on-1 Group Session · You + 3 Peers
              </div>
              <div className="flex items-center -space-x-2 overflow-hidden py-0.5">
                <div
                  className="w-8 h-8 rounded-full bg-[#18181B] text-[#EDEDEF] text-[11px] font-medium font-mono flex items-center justify-center ring-2 ring-[#6E56CF] z-40"
                  title="Aarav Shah (You)"
                >
                  AS
                </div>
                <div
                  className="w-8 h-8 rounded-full bg-[#121214] text-[#A0A0AB] text-[11px] font-medium font-mono flex items-center justify-center border border-[#26262A] z-30"
                  title="Dev Patel"
                >
                  DP
                </div>
                <div
                  className="w-8 h-8 rounded-full bg-[#121214] text-[#A0A0AB] text-[11px] font-medium font-mono flex items-center justify-center border border-[#26262A] z-20"
                  title="Priya Joshi"
                >
                  PJ
                </div>
                <div
                  className="w-8 h-8 rounded-full bg-[#121214] text-[#A0A0AB] text-[11px] font-medium font-mono flex items-center justify-center border border-[#26262A] z-10"
                  title="Kunal Verma"
                >
                  KV
                </div>
              </div>
            </div>
          </div>

          {/* Single Accent Action Rule */}
          <div className="p-5 pt-3 border-t border-[#26262A] bg-[#121214] flex items-center gap-3">
            <Button
              variant="default"
              className="gap-1.5 text-[13px]"
              onClick={() => alert('Launching Google Meet session...')}
            >
              <span>Join session</span>
              <ArrowRight className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              onClick={onNavigateToBooking}
              className="text-[13px]"
            >
              Browse other slots
            </Button>
          </div>
        </Card>

        {/* Right Card: Profile Checklist */}
        <Card className="bg-[#121214] border-[#26262A] flex flex-col justify-between overflow-hidden">
          <div className="p-5">
            <h2 className="text-[15px] font-semibold text-[#EDEDEF] mb-4">
              Profile checklist
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
                      item.completed
                        ? 'text-[#6E6E78] line-through'
                        : 'text-[#EDEDEF]'
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

      {/* Row 3: Cohort & Placement Pipeline Notice */}
      <Card className="bg-[#121214] border-[#26262A] p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#6E56CF]" />
            <h3 className="text-[14px] font-semibold text-[#EDEDEF]">
              Upcoming Drive Announcements
            </h3>
          </div>
          <span className="text-[11px] text-[#6E6E78]">MCA &apos;26 Placement Cell</span>
        </div>
        <div className="text-[13px] text-[#A0A0AB] leading-relaxed">
          Technical mock interviews for Phase-1 eligible candidates are ongoing. Ensure your CGPA and resume link are updated prior to Friday 6:00 PM for company roster verification.
        </div>
      </Card>
    </div>
  )
}
