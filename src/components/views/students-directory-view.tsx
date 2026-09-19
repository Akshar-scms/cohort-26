'use client'

import React, { useState, useEffect, useTransition } from 'react'
import {
  Search,
  ExternalLink,
  ChevronDown,
  Loader2,
  MapPin,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { getAllStudents } from '@/app/actions/student-actions'

interface StudentsDirectoryViewProps {
  spcId: string
}

const STATUS_MAP: Record<string, { label: string; variant: string; dot: string }> = {
  NOT_STARTED:  { label: 'Not Started',  variant: 'secondary', dot: '#6E6E78' },
  PREPARATION:  { label: 'Preparation',  variant: 'secondary', dot: '#A0A0AB' },
  APPLIED:      { label: 'Applied',      variant: 'info',      dot: '#0091FF' },
  INTERVIEW:    { label: 'Interviewing', variant: 'warning',   dot: '#FFB224' },
  SHORTLISTED:  { label: 'Shortlisted',  variant: 'success',   dot: '#30A46C' },
  OFFERED:      { label: 'Offered',      variant: 'success',   dot: '#30A46C' },
  PLACED:       { label: 'Placed',       variant: 'success',   dot: '#30A46C' },
}

export function StudentsDirectoryView({ spcId }: StudentsDirectoryViewProps) {
  const [students, setStudents]             = useState<any[]>([])
  const [loading, setLoading]               = useState(true)
  const [searchQuery, setSearchQuery]       = useState('')
  const [statusFilter, setStatusFilter]     = useState('ALL')
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)

  useEffect(() => {
    getAllStudents().then((data) => {
      setStudents(data)
      setLoading(false)
    })
  }, [])

  const filtered = students.filter((s) => {
    const name  = s.user?.name?.toLowerCase() ?? ''
    const email = s.user?.email?.toLowerCase() ?? ''
    const roll  = s.rollNumber?.toLowerCase() ?? ''
    const q = searchQuery.toLowerCase()
    const matchesSearch = !q || name.includes(q) || email.includes(q) || roll.includes(q)
    const matchesStatus = statusFilter === 'ALL' || s.placementStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const statusOptions = ['ALL', 'NOT_STARTED', 'PREPARATION', 'APPLIED', 'INTERVIEW', 'SHORTLISTED', 'OFFERED', 'PLACED']

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-6 flex flex-col sm:px-6 sm:py-8 lg:px-8 lg:py-10">
      {/* Header */}
      <div className="flex flex-col gap-1 mb-6">
        <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight break-words">
          Students Directory
        </h1>
        <p className="text-[13px] text-[#A0A0AB]">
          MCA &apos;26 batch · {students.length} students enrolled
        </p>
      </div>

      {/* Search + Filter Row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6E6E78]" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, email, or roll number..."
            className="pl-9 bg-[#121214] border-[#26262A] text-[13px]"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`h-8 px-3 rounded-full border text-[11px] font-medium transition-colors ${
                statusFilter === s
                  ? 'border-[#6E56CF] bg-[#6E56CF]/15 text-[#cbbeff]'
                  : 'border-[#26262A] bg-[#121214] text-[#A0A0AB] hover:border-[#34343A] hover:text-[#EDEDEF]'
              }`}
            >
              {s === 'ALL' ? 'All' : STATUS_MAP[s]?.label ?? s}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-[12px] text-[#6E6E78] font-mono">{filtered.length} result{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-16 text-[#6E6E78]">
          <Loader2 className="w-5 h-5 animate-spin mr-2" />
          <span className="text-[13px]">Loading students...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center gap-2 bg-[#121214] border border-[#26262A] rounded-xl">
          <div className="text-[14px] font-medium text-[#EDEDEF]">No students found</div>
          <p className="text-[12px] text-[#A0A0AB]">
            {students.length === 0
              ? 'No students have signed up yet. They must sign in using their Nirma email.'
              : 'Try adjusting your search or filter.'}
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {/* Mobile Card View - hidden on lg+ */}
          <div className="lg:hidden">
            {filtered.map((student) => {
              const status = STATUS_MAP[student.placementStatus] ?? STATUS_MAP.NOT_STARTED

              return (
                <div
                  key={student.id}
                  className="bg-[#121214] border border-[#26262A] rounded-xl p-4 hover:border-[#34343A] transition-colors"
                >
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-9 h-9 rounded-full bg-[#18181B] border border-[#26262A] flex items-center justify-center font-mono text-[12px] text-[#EDEDEF] font-medium shrink-0">
                      {student.user?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) ?? '??'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[14px] font-medium text-[#EDEDEF] truncate">{student.user?.name ?? '—'}</span>
                        <Badge variant={status.variant as any} dotColor={status.dot}>{status.label}</Badge>
                      </div>
                      <span className="text-[11px] text-[#6E6E78] font-mono truncate block mt-0.5">{student.user?.email ?? '—'}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-[#A0A0AB] mb-3">
                    <div>
                      <span className="text-[#6E6E78]">Target Role</span>
                      <span className="text-[#EDEDEF] font-medium ml-2 truncate block">{student.targetRole ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6E78]">CGPA</span>
                      <span className="font-mono text-[#EDEDEF] ml-2">{student.cgpa ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6E78]">Roll No</span>
                      <span className="font-mono text-[#EDEDEF] ml-2">{student.rollNumber ?? '—'}</span>
                    </div>
                    <div>
                      <span className="text-[#6E6E78]">Section</span>
                      <span className="text-[#EDEDEF] ml-2">{student.section ?? '—'}</span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full h-8 border-[#26262A] justify-center"
                    onClick={() => setSelectedStudent(student)}
                  >
                    View Details
                  </Button>
                </div>
              )
            })}
          </div>

          {/* Desktop Table View - hidden on mobile */}
          <div className="hidden lg:block">
            {/* Header row */}
            <div className="grid grid-cols-[1fr_160px_100px_120px_100px] gap-4 px-4 py-2 text-[11px] uppercase tracking-wider text-[#6E6E78]">
              <span>Student</span>
              <span>Target Role</span>
              <span>CGPA</span>
              <span>Status</span>
              <span className="text-right">Actions</span>
            </div>

            {filtered.map((student) => {
              const status = STATUS_MAP[student.placementStatus] ?? STATUS_MAP.NOT_STARTED
              const topSkills = student.skills?.slice(0, 4) ?? []
              const latestNote = student.notes?.[0]?.content ?? null

              return (
                <div
                  key={student.id}
                  className="grid grid-cols-[1fr_160px_100px_120px_100px] gap-4 items-center bg-[#121214] border border-[#26262A] rounded-xl px-4 py-3 hover:border-[#34343A] transition-colors"
                >
                  {/* Student info */}
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-8 h-8 rounded-full bg-[#18181B] border border-[#26262A] flex items-center justify-center font-mono text-[11px] text-[#EDEDEF] font-medium shrink-0">
                      {student.user?.name?.split(' ').map((w: string) => w[0]).join('').toUpperCase().slice(0, 2) ?? '??'}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-[13px] font-medium text-[#EDEDEF] truncate">{student.user?.name ?? '—'}</span>
                      <span className="text-[11px] text-[#6E6E78] font-mono truncate">{student.user?.email ?? '—'}</span>
                    </div>
                  </div>

                  {/* Target role */}
                  <span className="text-[12px] text-[#A0A0AB] truncate">
                    {student.targetRole ?? <span className="text-[#34343A]">—</span>}
                  </span>

                  {/* CGPA */}
                  <span className="text-[13px] font-mono text-[#EDEDEF]">
                    {student.cgpa ?? <span className="text-[#34343A]">—</span>}
                  </span>

                  {/* Status badge */}
                  <div>
                    <Badge variant={status.variant as any} dotColor={status.dot}>
                      {status.label}
                    </Badge>
                  </div>

                  {/* View button */}
                  <div className="flex justify-end">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-[11px] border-[#26262A]"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Student Detail Modal */}
      <Dialog open={!!selectedStudent} onOpenChange={(o) => !o && setSelectedStudent(null)}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-xl bg-[#1F1F23] border-[#26262A] max-h-[90vh] overflow-y-auto">
          {selectedStudent && (() => {
            const s = selectedStudent
            const status = STATUS_MAP[s.placementStatus] ?? STATUS_MAP.NOT_STARTED
            const skills = s.skills ?? []
            const latestNote = s.notes?.[0]

            return (
              <>
                <DialogHeader>
                  <DialogTitle className="text-[17px] text-[#EDEDEF]">
                    {s.user?.name ?? '—'}
                  </DialogTitle>
                  <DialogDescription className="text-[12px] text-[#6E6E78] font-mono">
                    {s.user?.email ?? '—'} · {s.rollNumber ?? 'Roll N/A'} · Batch {s.batch ?? 'MCA26'}
                  </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col gap-4 pt-2">
                  {/* Status + Target */}
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant={status.variant as any} dotColor={status.dot}>{status.label}</Badge>
                    {s.targetRole && (
                      <span className="text-[12px] text-[#A0A0AB]">→ {s.targetRole}</span>
                    )}
                  </div>

                  {/* Academics */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: 'CGPA', value: s.cgpa },
                      { label: 'Backlogs', value: s.backlogs },
                      { label: 'Section', value: s.section },
                    ].map(({ label, value }) => (
                      <div key={label} className="p-3 rounded-lg bg-[#121214] border border-[#26262A] flex flex-col gap-1">
                        <span className="text-[10px] uppercase tracking-wider text-[#6E6E78]">{label}</span>
                        <span className="text-[16px] font-mono font-semibold text-[#EDEDEF]">
                          {value ?? <span className="text-[#34343A] text-[13px]">—</span>}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Skills */}
                  {skills.length > 0 && (
                    <div>
                      <div className="text-[11px] uppercase tracking-wider text-[#6E6E78] mb-2">Verified Skills</div>
                      <div className="flex flex-wrap gap-1.5">
                        {skills.map((sk: any) => (
                          <span key={sk.id} className="px-2.5 py-1 rounded-full bg-[#18181B] border border-[#26262A] text-[11px] text-[#EDEDEF]">
                            {sk.name} · <span className="text-[#6E6E78]">{sk.proficiency.charAt(0) + sk.proficiency.slice(1).toLowerCase()}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  {(s.githubUrl || s.linkedinUrl || s.resumeUrl) && (
                    <div className="flex flex-wrap gap-2">
                      {s.githubUrl && (
                        <a href={s.githubUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] text-[#6E56CF] hover:underline">
                          GitHub <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {s.linkedinUrl && (
                        <a href={s.linkedinUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] text-[#6E56CF] hover:underline">
                          LinkedIn <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      {s.resumeUrl && (
                        <a href={s.resumeUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-[12px] text-[#6E56CF] hover:underline">
                          Resume <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  )}

                  {/* Latest SPC note */}
                  {latestNote && (
                    <div className="p-3 rounded-lg bg-[#121214] border border-[#26262A]">
                      <div className="text-[10px] uppercase tracking-wider text-[#6E6E78] mb-1">Latest SPC Note</div>
                      <p className="text-[12px] text-[#A0A0AB] leading-relaxed">{latestNote.content}</p>
                      <div className="text-[10px] text-[#6E6E78] mt-1 font-mono">
                        {new Date(latestNote.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )
          })()}
        </DialogContent>
      </Dialog>
    </div>
  )
}
