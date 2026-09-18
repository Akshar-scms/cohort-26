'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  User,
  CheckCircle2,
  Save,
  Plus,
  Trash2,
  MessageSquare,
  FileText,
  Sparkles,
  MapPin,
  Loader2,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SessionTimer } from '@/components/mentoring/session-timer'
import { getSessionStudents, addSessionQuestion, removeSessionQuestion, completeSession } from '@/app/actions/live-session-actions'
import { addSkill, removeSkill, addSpcNote, updateStudentBySession } from '@/app/actions/student-actions'

interface LiveMentoringSessionViewProps {
  spcId: string
  spcName: string
}

const PROFICIENCY_COLORS: Record<string, string> = {
  BEGINNER:     'border-[#FFB224]/40 text-[#FFB224] bg-[#FFB224]/10',
  INTERMEDIATE: 'border-[#0091FF]/40 text-[#0091FF] bg-[#0091FF]/10',
  ADVANCED:     'border-[#30A46C]/40 text-[#30A46C] bg-[#30A46C]/10',
}

const PLACEMENT_STATUS_OPTIONS = [
  'NOT_STARTED', 'PREPARATION', 'APPLIED', 'INTERVIEW', 'SHORTLISTED', 'OFFERED', 'PLACED'
]

const SKILL_CATEGORIES = [
  { value: 'PROGRAMMING_LANGUAGE', label: 'Programming Language' },
  { value: 'FRAMEWORK_LIBRARY',    label: 'Framework / Library' },
  { value: 'DATABASE',             label: 'Database' },
  { value: 'CLOUD_DEVOPS',         label: 'Cloud / DevOps' },
  { value: 'DATA_SCIENCE_ML',      label: 'Data Science / ML' },
  { value: 'SOFT_SKILL',           label: 'Soft Skill' },
  { value: 'OTHER',                label: 'Other' },
]

function formatTime(t: string) {
  const [h, m] = t.split(':').map(Number)
  const period = h >= 12 ? 'PM' : 'AM'
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${period}`
}

export function LiveMentoringSessionView({ spcId, spcName }: LiveMentoringSessionViewProps) {
  const [sessions, setSessions]         = useState<any[]>([])
  const [loading, setLoading]           = useState(true)
  const [activeIndex, setActiveIndex]   = useState(0)
  const [isPending, startTransition]    = useTransition()
  const [saveSuccess, setSaveSuccess]   = useState(false)

  // New skill inputs
  const [newSkillName, setNewSkillName]           = useState('')
  const [newSkillCategory, setNewSkillCategory]   = useState('PROGRAMMING_LANGUAGE')
  const [newSkillProficiency, setNewSkillProficiency] = useState<'BEGINNER'|'INTERMEDIATE'|'ADVANCED'>('INTERMEDIATE')

  // New question input
  const [newQuestion, setNewQuestion] = useState('')

  // SPC note
  const [noteText, setNoteText] = useState('')

  // Profile editable fields
  const [editCgpa, setEditCgpa]               = useState('')
  const [editBacklogs, setEditBacklogs]       = useState('')
  const [editTargetRole, setEditTargetRole]   = useState('')
  const [editStatus, setEditStatus]           = useState('')

  const now = new Date()
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  const refreshData = async (initial = false) => {
    if (initial) setLoading(true)
    try {
      const data = await getSessionStudents(spcId, todayIso)
      setSessions(data)
    } finally {
      if (initial) setLoading(false)
    }
  }

  useEffect(() => {
    refreshData(true)
  }, [spcId])

  // Sync editable fields when active session changes
  useEffect(() => {
    const s = sessions[activeIndex]?.student
    if (s) {
      setEditCgpa(s.cgpa ?? '')
      setEditBacklogs(String(s.backlogs ?? 0))
      setEditTargetRole(s.targetRole ?? '')
      setEditStatus(s.placementStatus ?? 'NOT_STARTED')
    }
  }, [activeIndex, sessions])

  const active = sessions[activeIndex]
  const student = active?.student
  const studentUser = student?.user

  const handleAddSkill = () => {
    if (!newSkillName.trim() || !student?.id) return
    const skillName = newSkillName.trim()
    const skillCat = newSkillCategory as any
    const skillProf = newSkillProficiency
    setNewSkillName('')

    // Optimistic state update: Add skill to local session state immediately
    const tempSkillId = `temp-${Date.now()}`
    setSessions((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeIndex) return s
        const currentSkills = s.student?.skills || []
        return {
          ...s,
          student: {
            ...s.student,
            skills: [
              ...currentSkills,
              {
                id: tempSkillId,
                name: skillName,
                category: skillCat,
                proficiency: skillProf,
                isVerified: true,
              },
            ],
          },
        }
      })
    )

    startTransition(async () => {
      await addSkill(student.id, skillName, skillCat, skillProf)
      refreshData(false)
    })
  }

  const handleRemoveSkill = (skillId: string) => {
    // Optimistic removal
    setSessions((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeIndex) return s
        return {
          ...s,
          student: {
            ...s.student,
            skills: (s.student?.skills || []).filter((sk: any) => sk.id !== skillId),
          },
        }
      })
    )

    startTransition(async () => {
      await removeSkill(skillId)
      refreshData(false)
    })
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim() || !active?.bookingId) return
    const qText = newQuestion.trim()
    setNewQuestion('')

    const tempQId = `temp-${Date.now()}`
    setSessions((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeIndex) return s
        return {
          ...s,
          questionsAsked: [
            ...(s.questionsAsked || []),
            { id: tempQId, question: qText },
          ],
        }
      })
    )

    startTransition(async () => {
      await addSessionQuestion(active.bookingId, qText)
      refreshData(false)
    })
  }

  const handleRemoveQuestion = (qId: string) => {
    setSessions((prev) =>
      prev.map((s, idx) => {
        if (idx !== activeIndex) return s
        return {
          ...s,
          questionsAsked: (s.questionsAsked || []).filter((q: any) => q.id !== qId),
        }
      })
    )

    startTransition(async () => {
      await removeSessionQuestion(qId)
      refreshData(false)
    })
  }

  const handleSaveNote = () => {
    if (!noteText.trim() || !student?.id) return
    const savedNoteText = noteText.trim()
    setNoteText('')

    startTransition(async () => {
      await addSpcNote(student.id, spcId, savedNoteText)
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      refreshData(false)
    })
  }

  const handleSaveProfile = () => {
    if (!student?.id) return
    startTransition(async () => {
      await updateStudentBySession(student.id, {
        cgpa: editCgpa || undefined,
        backlogs: editBacklogs ? Number(editBacklogs) : undefined,
        targetRole: editTargetRole || undefined,
        placementStatus: editStatus as any,
      })
      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 2000)
      refreshData(false)
    })
  }

  const handleCompleteSession = () => {
    if (!active?.bookingId) return
    startTransition(async () => {
      await completeSession(active.bookingId)
      refreshData(false)
    })
  }

  // ─── Loading ──────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-8 flex items-center justify-center py-24 text-[#6E6E78]">
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
        <span className="text-[13px]">Loading today&apos;s session schedule...</span>
      </div>
    )
  }

  // ─── No sessions today ────────────────────────────────────────
  if (sessions.length === 0) {
    return (
      <div className="w-full max-w-[1200px] mx-auto p-8">
        <div className="p-5 rounded-xl bg-[#121214] border border-[#26262A] mb-6 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6E56CF]/15 border border-[#6E56CF]/40 flex items-center justify-center text-[#cbbeff]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-[17px] font-semibold text-[#EDEDEF]">Live Mentoring Session Console</h1>
            <p className="text-[12px] text-[#A0A0AB] font-mono mt-0.5">No booked sessions for today · {todayIso}</p>
          </div>
        </div>
        <Card className="bg-[#121214] border-[#26262A] p-10 text-center flex flex-col items-center gap-3">
          <BookOpen className="w-8 h-8 text-[#34343A]" />
          <div className="text-[15px] font-medium text-[#EDEDEF]">No sessions scheduled for today</div>
          <p className="text-[12px] text-[#A0A0AB]">
            Students will appear here once they book one of your active mentoring slots.
          </p>
        </Card>
      </div>
    )
  }

  // ─── Main Console ─────────────────────────────────────────────
  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 flex flex-col gap-6 relative">
      {/* Floating Draggable Timer */}
      <SessionTimer
        initialMinutes={active?.durationMinutes ?? 15}
        studentName={studentUser?.name}
      />

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#121214] border border-[#26262A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6E56CF]/15 border border-[#6E56CF]/40 flex items-center justify-center text-[#cbbeff]">
            <User className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-semibold text-[#EDEDEF]">Live Mentoring Console</h1>
              <span className="w-2 h-2 rounded-full bg-[#30A46C] animate-pulse" />
              <span className="text-[11px] font-mono text-[#30A46C] uppercase font-medium">Live</span>
            </div>
            <p className="text-[12px] text-[#A0A0AB] font-mono mt-0.5">
              {todayIso} · {sessions.length} session{sessions.length !== 1 ? 's' : ''} today
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={saveSuccess ? 'outline' : 'default'}
            size="sm"
            onClick={handleSaveProfile}
            disabled={isPending}
            className={saveSuccess ? 'border-[#30A46C]/40 text-[#30A46C]' : ''}
          >
            {saveSuccess ? (
              <><CheckCircle2 className="w-3.5 h-3.5 mr-1.5" />Saved</>
            ) : isPending ? (
              <><Loader2 className="w-3.5 h-3.5 animate-spin mr-1.5" />Saving...</>
            ) : (
              <><Save className="w-3.5 h-3.5 mr-1.5" />Save Profile</>
            )}
          </Button>
          <Button variant="outline" size="sm" onClick={handleCompleteSession} disabled={isPending}>
            Complete Session
          </Button>
        </div>
      </div>

      {/* Session Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {sessions.map((s, idx) => (
          <button
            key={s.bookingId}
            onClick={() => setActiveIndex(idx)}
            className={`shrink-0 px-4 h-9 rounded-lg border text-[13px] font-medium transition-all ${
              activeIndex === idx
                ? 'bg-[#6E56CF]/15 border-[#6E56CF] text-[#cbbeff]'
                : 'bg-[#121214] border-[#26262A] text-[#A0A0AB] hover:border-[#34343A] hover:text-[#EDEDEF]'
            }`}
          >
            {s.student?.user?.name?.split(' ')[0] ?? 'Student'} · {formatTime(s.slotTime)}
          </button>
        ))}
      </div>

      {/* Content: 2 columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* LEFT: Student Info + Profile Edit */}
        <div className="flex flex-col gap-5">

          {/* Student header */}
          <Card className="bg-[#121214] border-[#26262A] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#18181B] border border-[#26262A] flex items-center justify-center font-mono text-[13px] text-[#EDEDEF] font-medium">
                {studentUser?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) ?? '??'}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#EDEDEF]">{studentUser?.name ?? '—'}</div>
                <div className="text-[11px] text-[#6E6E78] font-mono">{studentUser?.email ?? '—'}</div>
              </div>
            </div>

            {active?.location && (
              <div className="flex items-center gap-1.5 mb-4 p-2.5 rounded-lg bg-[#18181B] border border-[#26262A]">
                <MapPin className="w-3.5 h-3.5 text-[#6E56CF] shrink-0" />
                <span className="text-[12px] text-[#A0A0AB]">{active.location}</span>
              </div>
            )}

            {/* Editable profile fields */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-[#6E6E78]">CGPA</label>
                <Input
                  value={editCgpa}
                  onChange={(e) => setEditCgpa(e.target.value)}
                  placeholder="e.g. 8.75"
                  className="h-8 text-[12px] font-mono bg-[#18181B] border-[#26262A]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-[#6E6E78]">Backlogs</label>
                <Input
                  type="number"
                  value={editBacklogs}
                  onChange={(e) => setEditBacklogs(e.target.value)}
                  placeholder="0"
                  className="h-8 text-[12px] font-mono bg-[#18181B] border-[#26262A]"
                  min={0}
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-[#6E6E78]">Target Role</label>
                <Input
                  value={editTargetRole}
                  onChange={(e) => setEditTargetRole(e.target.value)}
                  placeholder="e.g. Full Stack SDE"
                  className="h-8 text-[12px] bg-[#18181B] border-[#26262A]"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] uppercase tracking-wider text-[#6E6E78]">Placement Status</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value)}
                  className="h-8 text-[12px] bg-[#18181B] border border-[#26262A] rounded-md px-2 text-[#EDEDEF] focus:border-[#6E56CF] focus:outline-none"
                >
                  {PLACEMENT_STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            </div>

            {active?.studentQuestion && (
              <div className="mt-4 p-3 rounded-lg bg-[#18181B] border border-[#26262A]">
                <div className="text-[10px] uppercase tracking-wider text-[#6E6E78] mb-1">Student&apos;s Pre-session Question</div>
                <div className="text-[12px] text-[#A0A0AB] italic">&ldquo;{active.studentQuestion}&rdquo;</div>
              </div>
            )}
          </Card>

          {/* Verified Technical Skills */}
          <Card className="bg-[#121214] border-[#26262A] p-5">
            <h3 className="text-[13px] font-semibold text-[#EDEDEF] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#6E56CF]" />
              Verified Technical Skills
            </h3>

            {/* Existing skills */}
            <div className="flex flex-wrap gap-2 mb-3 min-h-[32px]">
              {student?.skills?.length === 0 && (
                <span className="text-[12px] text-[#6E6E78]">No skills logged yet.</span>
              )}
              {student?.skills?.map((skill: any) => (
                <div
                  key={skill.id}
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[11px] font-medium ${PROFICIENCY_COLORS[skill.proficiency] ?? ''}`}
                >
                  <span>{skill.name}</span>
                  <span className="opacity-60">· {skill.proficiency.charAt(0) + skill.proficiency.slice(1).toLowerCase()}</span>
                  {skill.isVerified && <CheckCircle2 className="w-3 h-3 text-[#30A46C]" aria-label="Verified" />}
                  <button onClick={() => handleRemoveSkill(skill.id)} className="ml-1 hover:opacity-100 opacity-50 transition-opacity">
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add skill */}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#26262A]">
              <div className="flex gap-2">
                <Input
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  placeholder="Skill name (e.g. React)"
                  className="flex-1 h-8 text-[12px] bg-[#18181B] border-[#26262A]"
                  onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                />
                <select
                  value={newSkillProficiency}
                  onChange={(e) => setNewSkillProficiency(e.target.value as any)}
                  className="h-8 text-[11px] bg-[#18181B] border border-[#26262A] rounded-md px-2 text-[#EDEDEF] focus:border-[#6E56CF] focus:outline-none"
                >
                  <option value="BEGINNER">Beginner</option>
                  <option value="INTERMEDIATE">Intermediate</option>
                  <option value="ADVANCED">Advanced</option>
                </select>
              </div>
              <div className="flex gap-2">
                <select
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="flex-1 h-8 text-[11px] bg-[#18181B] border border-[#26262A] rounded-md px-2 text-[#EDEDEF] focus:border-[#6E56CF] focus:outline-none"
                >
                  {SKILL_CATEGORIES.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <Button
                  variant="default"
                  size="sm"
                  className="h-8 gap-1 text-[12px] shrink-0"
                  onClick={handleAddSkill}
                  disabled={isPending || !newSkillName.trim()}
                >
                  <Plus className="w-3.5 h-3.5" />Add
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* RIGHT: Mock Interview Questions + SPC Notes */}
        <div className="flex flex-col gap-5">

          {/* Mock Interview Questions */}
          <Card className="bg-[#121214] border-[#26262A] p-5">
            <h3 className="text-[13px] font-semibold text-[#EDEDEF] mb-3 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#6E56CF]" />
              Technical Mock Interview Questions
            </h3>

            <div className="flex flex-col gap-2 mb-3 min-h-[48px]">
              {active?.questionsAsked?.length === 0 && (
                <span className="text-[12px] text-[#6E6E78]">No questions recorded yet.</span>
              )}
              {active?.questionsAsked?.map((q: any, idx: number) => (
                <div key={q.id} className="flex items-start gap-2 group">
                  <span className="text-[11px] font-mono text-[#6E56CF] mt-0.5 shrink-0">Q{idx + 1}.</span>
                  <span className="text-[12px] text-[#EDEDEF] flex-1 leading-relaxed">{q.question}</span>
                  <button
                    onClick={() => handleRemoveQuestion(q.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-[#E5484D] hover:text-[#E5484D] shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2 pt-3 border-t border-[#26262A]">
              <Input
                value={newQuestion}
                onChange={(e) => setNewQuestion(e.target.value)}
                placeholder="How do you center a div?"
                className="flex-1 h-8 text-[12px] bg-[#18181B] border-[#26262A]"
                onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
              />
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1 text-[12px] shrink-0"
                onClick={handleAddQuestion}
                disabled={isPending || !newQuestion.trim()}
              >
                <Plus className="w-3.5 h-3.5" />Add
              </Button>
            </div>
          </Card>

          {/* SPC Notes */}
          <Card className="bg-[#121214] border-[#26262A] p-5">
            <h3 className="text-[13px] font-semibold text-[#EDEDEF] mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#6E56CF]" />
              SPC Notes
            </h3>

            {/* Past notes */}
            <div className="flex flex-col gap-2 mb-4 max-h-[200px] overflow-y-auto">
              {student?.notes?.length === 0 && (
                <span className="text-[12px] text-[#6E6E78]">No notes yet.</span>
              )}
              {student?.notes?.map((note: any) => (
                <div key={note.id} className="p-3 rounded-lg bg-[#18181B] border border-[#26262A]">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] text-[#6E6E78] font-mono">
                      {new Date(note.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} · {note.author?.name ?? 'SPC'}
                    </span>
                  </div>
                  <p className="text-[12px] text-[#A0A0AB] leading-relaxed">{note.content}</p>
                </div>
              ))}
            </div>

            {/* New note */}
            <div className="flex flex-col gap-2 pt-3 border-t border-[#26262A]">
              <textarea
                rows={3}
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add a note about this student's session..."
                className="w-full rounded-[10px] bg-[#18181B] border border-[#26262A] p-3 text-[12px] text-[#EDEDEF] placeholder-[#6E6E78] focus:border-[#6E56CF] focus:outline-none resize-none"
              />
              <Button
                variant="default"
                size="sm"
                className="h-8 gap-1 text-[12px] self-end"
                onClick={handleSaveNote}
                disabled={isPending || !noteText.trim()}
              >
                <Save className="w-3.5 h-3.5" />Save Note
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
