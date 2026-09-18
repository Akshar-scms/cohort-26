'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  Users,
  Video,
  Calendar,
  Sparkles,
  Award,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Clock,
  MapPin,
  GraduationCap,
  Briefcase,
  FileText,
  RefreshCw,
  Loader2,
  CalendarPlus,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getSpcDashboardData, SpcDashboardData } from '@/app/actions/spc-dashboard-actions'
import { cn } from '@/lib/utils'

interface SpcDashboardViewProps {
  userId: string
  userName: string
  onNavigate?: (tab: string) => void
}

const STATUS_COLOR_MAP: Record<string, { label: string; bg: string; text: string; dot: string }> = {
  PLACED:       { label: 'Placed',       bg: 'bg-[#30A46C]/10',  text: 'text-[#30A46C]', dot: '#30A46C' },
  OFFERED:      { label: 'Offered',      bg: 'bg-[#30A46C]/10',  text: 'text-[#30A46C]', dot: '#30A46C' },
  SHORTLISTED:  { label: 'Shortlisted',  bg: 'bg-[#0091FF]/10',  text: 'text-[#0091FF]', dot: '#0091FF' },
  INTERVIEW:    { label: 'Interviewing', bg: 'bg-[#FFB224]/10',  text: 'text-[#FFB224]', dot: '#FFB224' },
  APPLIED:      { label: 'Applied',      bg: 'bg-[#6E56CF]/10',  text: 'text-[#cbbeff]', dot: '#6E56CF' },
  PREPARATION:  { label: 'Preparation',  bg: 'bg-[#A0A0AB]/10',  text: 'text-[#A0A0AB]', dot: '#A0A0AB' },
  NOT_STARTED:  { label: 'Not Started',  bg: 'bg-[#6E6E78]/10',  text: 'text-[#6E6E78]', dot: '#6E6E78' },
}

function formatTime(timeStr: string) {
  const [h, m] = timeStr.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  const hour = h % 12 || 12
  return `${hour}:${String(m).padStart(2, '0')} ${period}`
}

export function SpcDashboardView({
  userId,
  userName,
  onNavigate,
}: SpcDashboardViewProps) {
  const [data, setData] = useState<SpcDashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  const loadData = (showSpinner = true) => {
    if (showSpinner) setLoading(true)
    getSpcDashboardData(userId)
      .then((res) => {
        setData(res)
        if (showSpinner) setLoading(false)
      })
      .catch((err) => {
        console.error('Failed to load SPC dashboard data:', err)
        if (showSpinner) setLoading(false)
      })
  }

  useEffect(() => {
    loadData(true)
  }, [userId])

  const handleRefresh = () => {
    startTransition(() => {
      loadData(false)
    })
  }

  if (loading || !data) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-8 flex flex-col items-center justify-center py-32 text-[#6E6E78] gap-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#6E56CF]" />
        <span className="text-[13px] font-mono">Loading SPC Command Center...</span>
      </div>
    )
  }

  const { stats, statusCounts, todaySessions, topSkills, recentNotes, attentionCandidates } = data

  const totalStudents = stats.totalStudents || 1
  const todayIso = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 flex flex-col gap-6 select-none animate-in fade-in duration-300">
      {/* ─── Header & Command Strip ─── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-[#26262A]/60">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
              SPC Placement Command Center
            </h1>
            <Badge variant="outline" className="bg-[#6E56CF]/15 border-[#6E56CF]/40 text-[#cbbeff] text-[11px] font-mono">
              MCA &apos;26
            </Badge>
          </div>
          <p className="text-[12px] text-[#A0A0AB] mt-1 font-sans">
            Welcome back, <span className="text-[#EDEDEF] font-medium">{userName}</span> · {todayIso}
          </p>
        </div>

        {/* Quick Command Station */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isPending}
            className="h-8 text-[12px] text-[#A0A0AB] hover:text-[#EDEDEF] border-[#26262A] hover:bg-[#18181B]"
            title="Refresh dashboard stats"
          >
            <RefreshCw className={cn('w-3.5 h-3.5 mr-1.5', isPending && 'animate-spin text-[#6E56CF]')} />
            Refresh
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => onNavigate && onNavigate('manage-slots')}
            className="h-8 text-[12px] text-[#EDEDEF] border-[#26262A] hover:border-[#6E56CF]/50 hover:bg-[#18181B] gap-1.5"
          >
            <CalendarPlus className="w-3.5 h-3.5 text-[#6E56CF]" />
            Manage Slots
          </Button>

          <Button
            variant="default"
            size="sm"
            onClick={() => onNavigate && onNavigate('live-session')}
            className="h-8 text-[12px] gap-1.5 bg-[#6E56CF] hover:bg-[#5842C3] text-white shadow-lg shadow-[#6E56CF]/20 font-medium"
          >
            <Video className="w-3.5 h-3.5" />
            Live Mentoring Console
            {stats.todaySessionsCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white/20 text-[10px] font-mono">
                {stats.todaySessionsCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* ─── Top 4 KPI Metrics Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Placement Rate */}
        <Card className="bg-[#121214] border-[#26262A] p-4 relative overflow-hidden group hover:border-[#34343A] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
              Cohort Placement
            </span>
            <Award className="w-4 h-4 text-[#30A46C]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[26px] font-mono font-bold text-[#EDEDEF] leading-tight">
              {stats.placedPercentage}%
            </span>
            <span className="text-[11px] text-[#30A46C] font-mono">
              {stats.placedCount} / {stats.totalStudents}
            </span>
          </div>
          <div className="w-full bg-[#18181B] h-1.5 rounded-full mt-3 overflow-hidden border border-[#26262A]">
            <div
              className="bg-[#30A46C] h-full rounded-full transition-all duration-500"
              style={{ width: `${stats.placedPercentage}%` }}
            />
          </div>
        </Card>

        {/* Metric 2: Today's Mentoring Sessions */}
        <Card className="bg-[#121214] border-[#26262A] p-4 relative overflow-hidden group hover:border-[#34343A] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
              Today&apos;s Sessions
            </span>
            <div className="flex items-center gap-1.5">
              {stats.todaySessionsCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-[#30A46C] animate-pulse" />
              )}
              <Video className="w-4 h-4 text-[#6E56CF]" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[26px] font-mono font-bold text-[#EDEDEF] leading-tight">
              {stats.todaySessionsCount}
            </span>
            <span className="text-[11px] text-[#A0A0AB] font-mono">
              scheduled today
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#6E6E78] mt-3">
            <span>Total slots created:</span>
            <span className="font-mono text-[#EDEDEF]">{stats.totalSlotsCreated}</span>
          </div>
        </Card>

        {/* Metric 3: Verified Technical Skills */}
        <Card className="bg-[#121214] border-[#26262A] p-4 relative overflow-hidden group hover:border-[#34343A] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
              Verified Skills
            </span>
            <Sparkles className="w-4 h-4 text-[#FFB224]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[26px] font-mono font-bold text-[#EDEDEF] leading-tight">
              {stats.totalSkillsVerified}
            </span>
            <span className="text-[11px] text-[#FFB224] font-mono">
              skills verified
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#6E6E78] mt-3">
            <span>Student pool:</span>
            <span className="font-mono text-[#EDEDEF]">{stats.totalStudents} candidates</span>
          </div>
        </Card>

        {/* Metric 4: Academic Mean CGPA */}
        <Card className="bg-[#121214] border-[#26262A] p-4 relative overflow-hidden group hover:border-[#34343A] transition-colors">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium uppercase tracking-wider text-[#6E6E78]">
              Mean Cohort CGPA
            </span>
            <GraduationCap className="w-4 h-4 text-[#0091FF]" />
          </div>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-[26px] font-mono font-bold text-[#EDEDEF] leading-tight">
              {stats.averageCgpa > 0 ? stats.averageCgpa : '—'}
            </span>
            <span className="text-[11px] text-[#0091FF] font-mono">
              / 10.0 scale
            </span>
          </div>
          <div className="flex items-center justify-between text-[11px] text-[#6E6E78] mt-3">
            <span>Batch:</span>
            <span className="font-mono text-[#EDEDEF]">MCA 2024–2026</span>
          </div>
        </Card>
      </div>

      {/* ─── Main Two-Column Layout ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT 7 COLS: Today's Mentoring Queue & Placement Pipeline */}
        <div className="lg:col-span-7 flex flex-col gap-6">

          {/* Today's Mentoring Queue */}
          <Card className="bg-[#121214] border-[#26262A] overflow-hidden">
            <div className="p-4 border-b border-[#26262A] flex items-center justify-between bg-[#151518]">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#6E56CF]" />
                <h2 className="text-[14px] font-semibold text-[#EDEDEF]">
                  Today&apos;s Mentoring Schedule
                </h2>
                <Badge variant="outline" className="text-[10px] font-mono border-[#34343A] text-[#A0A0AB]">
                  {todaySessions.length} candidate{todaySessions.length !== 1 ? 's' : ''}
                </Badge>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate && onNavigate('live-session')}
                className="h-7 text-[11px] text-[#cbbeff] hover:text-white hover:bg-[#6E56CF]/20 gap-1 px-2"
              >
                Launch Console <ChevronRight className="w-3 h-3" />
              </Button>
            </div>

            <div className="p-4 flex flex-col gap-3">
              {todaySessions.length === 0 ? (
                <div className="py-8 text-center flex flex-col items-center justify-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-[#18181B] border border-[#26262A] flex items-center justify-center text-[#6E6E78]">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <span className="text-[13px] font-medium text-[#EDEDEF]">
                    No mentoring sessions booked for today
                  </span>
                  <p className="text-[12px] text-[#6E6E78] max-w-sm">
                    You can generate and publish 15-min slots for today or tomorrow so students can book 1-on-1 sessions.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onNavigate && onNavigate('manage-slots')}
                    className="mt-1 h-8 text-[12px] border-[#34343A] hover:border-[#6E56CF] text-[#cbbeff]"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 mr-1.5" />
                    Open Mentoring Slots
                  </Button>
                </div>
              ) : (
                todaySessions.map((item, idx) => {
                  const student = item.student
                  const statusInfo = STATUS_COLOR_MAP[student.placementStatus] ?? STATUS_COLOR_MAP.NOT_STARTED

                  return (
                    <div
                      key={item.bookingId}
                      className="p-3.5 rounded-xl bg-[#18181B] border border-[#26262A] flex flex-col gap-2.5 hover:border-[#34343A] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#121214] border border-[#26262A] flex items-center justify-center font-mono text-[12px] font-medium text-[#EDEDEF] shrink-0">
                            {student.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-medium text-[#EDEDEF]">
                                {student.name}
                              </span>
                              <span className={cn('px-2 py-0.5 rounded text-[10px] font-mono uppercase font-medium', statusInfo.bg, statusInfo.text)}>
                                {statusInfo.label}
                              </span>
                            </div>
                            <div className="text-[11px] text-[#6E6E78] font-mono flex items-center gap-2 mt-0.5">
                              {student.rollNumber && <span>{student.rollNumber}</span>}
                              {student.cgpa && (
                                <>
                                  <span>·</span>
                                  <span>CGPA: {student.cgpa}</span>
                                </>
                              )}
                              {student.targetRole && (
                                <>
                                  <span>·</span>
                                  <span className="text-[#A0A0AB]">{student.targetRole}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col items-end shrink-0">
                          <span className="text-[13px] font-mono font-bold text-[#cbbeff]">
                            {formatTime(item.slotTime)}
                          </span>
                          <span className="text-[10px] text-[#6E6E78] font-mono">
                            {item.durationMinutes} mins
                          </span>
                        </div>
                      </div>

                      {item.studentQuestion && (
                        <div className="text-[11px] text-[#A0A0AB] bg-[#121214] p-2 rounded border border-[#26262A] italic">
                          &ldquo;{item.studentQuestion}&rdquo;
                        </div>
                      )}

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <div className="flex items-center gap-2 text-[#6E6E78]">
                          {item.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#6E56CF]" />
                              {item.location}
                            </span>
                          )}
                          <span>
                            {student.verifiedSkillsCount} verified skill{student.verifiedSkillsCount !== 1 ? 's' : ''}
                          </span>
                        </div>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onNavigate && onNavigate('live-session')}
                          className="h-7 text-[11px] text-[#cbbeff] hover:text-white hover:bg-[#6E56CF]/20 px-2.5 font-medium"
                        >
                          Start Session <ArrowRight className="w-3 h-3 ml-1" />
                        </Button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </Card>

          {/* Placement Status Distribution Funnel */}
          <Card className="bg-[#121214] border-[#26262A] p-5 flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#30A46C]" />
                <h3 className="text-[14px] font-semibold text-[#EDEDEF]">
                  Placement Funnel &amp; Cohort Pipeline
                </h3>
              </div>
              <span className="text-[11px] font-mono text-[#6E6E78]">
                {stats.totalStudents} total students
              </span>
            </div>

            {/* Segmented Pipeline Bar */}
            <div className="w-full h-3 bg-[#18181B] rounded-full overflow-hidden flex border border-[#26262A]">
              {Object.entries(statusCounts).map(([status, count]) => {
                if (count === 0) return null
                const percent = (count / totalStudents) * 100
                const info = STATUS_COLOR_MAP[status] ?? STATUS_COLOR_MAP.NOT_STARTED

                return (
                  <div
                    key={status}
                    style={{ width: `${percent}%`, backgroundColor: info.dot }}
                    title={`${info.label}: ${count} (${Math.round(percent)}%)`}
                    className="h-full transition-all duration-300 hover:opacity-90"
                  />
                )
              })}
            </div>

            {/* Status Breakdown Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
              {Object.entries(statusCounts).map(([status, count]) => {
                const info = STATUS_COLOR_MAP[status] ?? STATUS_COLOR_MAP.NOT_STARTED
                const percent = Math.round((count / totalStudents) * 100)

                return (
                  <div
                    key={status}
                    className="p-2.5 rounded-lg bg-[#18181B] border border-[#26262A] flex flex-col gap-1"
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: info.dot }} />
                      <span className="text-[11px] text-[#A0A0AB] truncate font-medium">
                        {info.label}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between mt-0.5">
                      <span className="text-[16px] font-mono font-bold text-[#EDEDEF]">
                        {count}
                      </span>
                      <span className="text-[10px] text-[#6E6E78] font-mono">
                        {percent}%
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>
        </div>

        {/* RIGHT 5 COLS: Attention Candidates, Top Tech Stack, Recent Notes */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* Action Required: Candidates Needing SPC Attention */}
          <Card className="bg-[#121214] border-[#26262A] p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-[#FFB224]" />
                <h3 className="text-[13px] font-semibold text-[#EDEDEF]">
                  Candidates Needing Attention
                </h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onNavigate && onNavigate('students')}
                className="h-6 text-[11px] text-[#A0A0AB] hover:text-[#EDEDEF] px-1.5"
              >
                Directory
              </Button>
            </div>

            <div className="flex flex-col gap-2">
              {attentionCandidates.length === 0 ? (
                <div className="p-4 text-center text-[12px] text-[#6E6E78] bg-[#18181B] rounded-lg border border-[#26262A]">
                  All high-CGPA candidates have verified skills and no backlogs flagged.
                </div>
              ) : (
                attentionCandidates.map((c) => (
                  <div
                    key={c.id}
                    className="p-2.5 rounded-lg bg-[#18181B] border border-[#26262A] flex items-center justify-between gap-3 hover:border-[#34343A] transition-colors"
                  >
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-[#EDEDEF] truncate">
                          {c.name}
                        </span>
                        {c.cgpa && (
                          <span className="text-[10px] font-mono text-[#cbbeff] bg-[#6E56CF]/15 px-1.5 py-0.2 rounded">
                            {c.cgpa}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-[#FFB224] truncate mt-0.5">
                        {c.reason}
                      </p>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onNavigate && onNavigate('students')}
                      className="h-6 text-[10px] text-[#A0A0AB] hover:text-[#EDEDEF] px-2 shrink-0"
                    >
                      View
                    </Button>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Top Cohort Technical Stack */}
          <Card className="bg-[#121214] border-[#26262A] p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6E56CF]" />
                <h3 className="text-[13px] font-semibold text-[#EDEDEF]">
                  In-Demand Cohort Tech Stack
                </h3>
              </div>
              <span className="text-[10px] text-[#6E6E78] font-mono">
                Top verified skills
              </span>
            </div>

            <div className="flex flex-wrap gap-2 pt-1">
              {topSkills.length === 0 ? (
                <span className="text-[12px] text-[#6E6E78]">
                  No skills recorded yet. SPC can add skills in the live mentoring console.
                </span>
              ) : (
                topSkills.map((sk) => (
                  <div
                    key={sk.name}
                    className="px-2.5 py-1 rounded-lg bg-[#18181B] border border-[#26262A] flex items-center gap-2 text-[11px] text-[#EDEDEF]"
                  >
                    <span className="font-medium">{sk.name}</span>
                    <span className="px-1.5 py-0.2 rounded bg-[#6E56CF]/20 text-[#cbbeff] text-[10px] font-mono">
                      {sk.count}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Recent SPC Mentoring Notes Feed */}
          <Card className="bg-[#121214] border-[#26262A] p-5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#0091FF]" />
                <h3 className="text-[13px] font-semibold text-[#EDEDEF]">
                  Recent Mentoring Notes
                </h3>
              </div>
            </div>

            <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto">
              {recentNotes.length === 0 ? (
                <span className="text-[12px] text-[#6E6E78]">
                  No notes recorded yet. Add notes during live mentoring sessions.
                </span>
              ) : (
                recentNotes.map((note) => (
                  <div
                    key={note.id}
                    className="p-2.5 rounded-lg bg-[#18181B] border border-[#26262A] flex flex-col gap-1"
                  >
                    <div className="flex items-center justify-between text-[10px] text-[#6E6E78] font-mono">
                      <span className="text-[#cbbeff] font-medium">{note.studentName}</span>
                      <span>{new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>
                    <p className="text-[11px] text-[#A0A0AB] leading-relaxed line-clamp-2">
                      {note.content}
                    </p>
                  </div>
                ))
              )}
            </div>
          </Card>

        </div>
      </div>
    </div>
  )
}
