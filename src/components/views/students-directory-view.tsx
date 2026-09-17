'use client'

import React, { useState } from 'react'
import {
  Search,
  Filter,
  Eye,
  Edit,
  FileText,
  ExternalLink,
  ChevronDown,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'

export function StudentsDirectoryView() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null)

  const sampleStudents = [
    {
      id: '1',
      rollNo: '24MCA001',
      name: 'Aarav Shah',
      email: '24mca001@nirmauni.ac.in',
      cgpa: '8.85',
      backlogs: 0,
      skills: ['TypeScript', 'Next.js', 'PostgreSQL', 'Docker'],
      status: 'INTERVIEW',
      statusLabel: 'Interviewing',
      statusVariant: 'warning' as const,
      dotColor: '#FFB224',
      targetRole: 'Full Stack SDE',
      spcNotes: 'Strong frontend fundamentals, mock interview scheduled for 18 Sept.',
    },
    {
      id: '2',
      rollNo: '24MCA014',
      name: 'Priya Joshi',
      email: '24mca014@nirmauni.ac.in',
      cgpa: '9.20',
      backlogs: 0,
      skills: ['Java', 'Spring Boot', 'AWS', 'Kafka'],
      status: 'SHORTLISTED',
      statusLabel: 'Shortlisted',
      statusVariant: 'success' as const,
      dotColor: '#30A46C',
      targetRole: 'Backend Engineer',
      spcNotes: 'Shortlisted for Amazon interview loop. Recommended distributed systems prep.',
    },
    {
      id: '3',
      rollNo: '24MCA028',
      name: 'Dev Patel',
      email: '24mca028@nirmauni.ac.in',
      cgpa: '8.40',
      backlogs: 0,
      skills: ['Python', 'Django', 'FastAPI', 'Redis'],
      status: 'PREPARATION',
      statusLabel: 'Preparation',
      statusVariant: 'secondary' as const,
      dotColor: '#A0A0AB',
      targetRole: 'Backend Developer',
      spcNotes: 'Needs resume refinement for DSA projects.',
    },
    {
      id: '4',
      rollNo: '24MCA035',
      name: 'Kunal Verma',
      email: '24mca035@nirmauni.ac.in',
      cgpa: '7.95',
      backlogs: 0,
      skills: ['React', 'Node.js', 'MongoDB', 'GraphQL'],
      status: 'APPLIED',
      statusLabel: 'Applied',
      statusVariant: 'info' as const,
      dotColor: '#0091FF',
      targetRole: 'Frontend Developer',
      spcNotes: 'Active applications at 3 product startups.',
    },
  ]

  const filteredStudents = sampleStudents.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesStatus =
      statusFilter === 'ALL' || student.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 flex flex-col gap-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
            Student Directory
          </h1>
          <p className="text-[13px] text-[#A0A0AB]">
            MCA &apos;26 Batch profiles, academic records, and placement pipeline status.
          </p>
        </div>

        {/* Search & Filter */}
        <div className="flex items-center gap-3">
          <div className="relative w-[220px]">
            <Search className="absolute left-2.5 top-2.5 w-3.5 h-3.5 text-[#6E6E78]" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by name, roll, skill..."
              className="pl-8 text-[12px] h-8 bg-[#18181B] border-[#26262A]"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            aria-label="Filter students by status"
            className="h-8 rounded-[10px] bg-[#18181B] border border-[#26262A] px-2.5 text-[12px] text-[#EDEDEF] focus:outline-none focus:border-[#6E56CF]"
          >
            <option value="ALL">All Statuses</option>
            <option value="SHORTLISTED">Shortlisted</option>
            <option value="INTERVIEW">Interviewing</option>
            <option value="APPLIED">Applied</option>
            <option value="PREPARATION">Preparation</option>
          </select>
        </div>
      </div>

      {/* Students Data Table Card */}
      <Card className="bg-[#121214] border-[#26262A] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-[13px] border-collapse">
            <thead>
              <tr className="border-b border-[#26262A] text-[#6E6E78] text-[11px] uppercase tracking-wider font-medium">
                <th className="py-3 px-5">Student</th>
                <th className="py-3 px-4 font-mono">Roll No</th>
                <th className="py-3 px-4 font-mono">CGPA</th>
                <th className="py-3 px-4">Target Role</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#26262A]">
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-[#18181B] transition-colors"
                >
                  <td className="py-3.5 px-5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-[#18181B] border border-[#26262A] flex items-center justify-center font-mono text-[11px] font-medium text-[#EDEDEF]">
                        {student.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-[#EDEDEF]">
                          {student.name}
                        </span>
                        <span className="text-[11px] text-[#6E6E78] font-mono">
                          {student.email}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[12px] text-[#A0A0AB]">
                    {student.rollNo}
                  </td>

                  <td className="py-3.5 px-4 font-mono text-[13px] font-semibold text-[#EDEDEF] tabular-nums">
                    {student.cgpa}
                  </td>

                  <td className="py-3.5 px-4 text-[#A0A0AB]">
                    {student.targetRole}
                  </td>

                  <td className="py-3.5 px-4">
                    <Badge
                      variant={student.statusVariant}
                      dotColor={student.dotColor}
                    >
                      {student.statusLabel}
                    </Badge>
                  </td>

                  <td className="py-3.5 px-5 text-right">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 text-[12px] border-[#26262A] hover:border-[#34343A]"
                      onClick={() => setSelectedStudent(student)}
                    >
                      View Profile
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Student Profile Drawer / Modal */}
      <Dialog
        open={!!selectedStudent}
        onOpenChange={(open) => !open && setSelectedStudent(null)}
      >
        <DialogContent className="max-w-lg bg-[#1F1F23] border-[#26262A]">
          <DialogHeader>
            <DialogTitle className="text-[18px] text-[#EDEDEF] flex items-center justify-between pr-6">
              <span>{selectedStudent?.name}</span>
              <Badge
                variant={selectedStudent?.statusVariant}
                dotColor={selectedStudent?.dotColor}
              >
                {selectedStudent?.statusLabel}
              </Badge>
            </DialogTitle>
            <DialogDescription className="text-[12px] text-[#A0A0AB] font-mono">
              {selectedStudent?.rollNo} · {selectedStudent?.email}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2 text-[13px]">
            <div className="grid grid-cols-2 gap-3 p-3 rounded-lg bg-[#121214] border border-[#26262A]">
              <div>
                <div className="text-[11px] text-[#6E6E78] uppercase">CGPA</div>
                <div className="text-[16px] font-mono font-semibold text-[#EDEDEF]">
                  {selectedStudent?.cgpa} / 10.0
                </div>
              </div>
              <div>
                <div className="text-[11px] text-[#6E6E78] uppercase">
                  Active Backlogs
                </div>
                <div className="text-[16px] font-mono font-semibold text-[#EDEDEF]">
                  {selectedStudent?.backlogs}
                </div>
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#6E6E78] mb-2 font-medium">
                Verified Skills
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudent?.skills.map((skill: string) => (
                  <span
                    key={skill}
                    className="px-2.5 py-1 rounded-full bg-[#18181B] border border-[#26262A] text-[12px] font-mono text-[#EDEDEF]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <div className="text-[11px] uppercase tracking-wider text-[#6E6E78] mb-1.5 font-medium">
                SPC Internal Notes
              </div>
              <div className="p-3 rounded-lg bg-[#18181B] border border-[#26262A] text-[#A0A0AB] text-[12px] leading-relaxed">
                {selectedStudent?.spcNotes}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
