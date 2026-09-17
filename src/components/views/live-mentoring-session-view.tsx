'use client'

import React, { useState } from 'react'
import {
  Users,
  CheckCircle2,
  AlertCircle,
  Save,
  Plus,
  Trash2,
  ExternalLink,
  MessageSquare,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SessionTimer } from '@/components/mentoring/session-timer'

export function LiveMentoringSessionView() {
  // Sample 4-on-1 session students
  const [students, setStudents] = useState([
    {
      id: '1',
      rollNo: '24MCA001',
      name: 'Aarav Shah',
      email: '24mca001@nirmauni.ac.in',
      cgpa: '8.85',
      backlogs: 0,
      targetRole: 'Full Stack SDE',
      placementStatus: 'INTERVIEW',
      resumeUrl: 'https://drive.google.com/resume-aarav.pdf',
      githubUrl: 'https://github.com/aarav-shah',
      skills: [
        { name: 'TypeScript', proficiency: 'ADVANCED', category: 'PROGRAMMING_LANGUAGE' },
        { name: 'Next.js', proficiency: 'ADVANCED', category: 'FRAMEWORK_LIBRARY' },
        { name: 'PostgreSQL', proficiency: 'INTERMEDIATE', category: 'DATABASE' },
        { name: 'Docker', proficiency: 'INTERMEDIATE', category: 'CLOUD_DEVOPS' },
      ],
      questionsAsked: [
        'How does Next.js Server Components differ from Client hydration?',
        'Optimize SQL query with composite indexes in PostgreSQL.',
      ],
      currentNote: 'Strong frontend fundamentals. Suggested practicing Trie & Graph traversal algorithms before next round.',
      pastNotes: [
        { date: '10 Sept 2026', author: 'Prof. Riya Mehta', note: 'Resume reviewed. Advised adding production metrics to portfolio.' },
      ],
    },
    {
      id: '2',
      rollNo: '24MCA014',
      name: 'Priya Joshi',
      email: '24mca014@nirmauni.ac.in',
      cgpa: '9.20',
      backlogs: 0,
      targetRole: 'Backend Engineer',
      placementStatus: 'SHORTLISTED',
      resumeUrl: 'https://drive.google.com/resume-priya.pdf',
      githubUrl: 'https://github.com/priyajoshi-dev',
      skills: [
        { name: 'Java', proficiency: 'EXPERT', category: 'PROGRAMMING_LANGUAGE' },
        { name: 'Spring Boot', proficiency: 'ADVANCED', category: 'FRAMEWORK_LIBRARY' },
        { name: 'Kafka', proficiency: 'INTERMEDIATE', category: 'DATABASE' },
        { name: 'AWS', proficiency: 'INTERMEDIATE', category: 'CLOUD_DEVOPS' },
      ],
      questionsAsked: [
        'Explain event streaming architecture with Apache Kafka and partition rebalancing.',
      ],
      currentNote: 'Shortlisted for Amazon interview loop. Recommended distributed systems prep.',
      pastNotes: [
        { date: '04 Sept 2026', author: 'Prof. Kunal Joshi', note: 'Excellent system design clarity.' },
      ],
    },
    {
      id: '3',
      rollNo: '24MCA028',
      name: 'Dev Patel',
      email: '24mca028@nirmauni.ac.in',
      cgpa: '8.40',
      backlogs: 0,
      targetRole: 'Backend Developer',
      placementStatus: 'PREPARATION',
      resumeUrl: 'https://drive.google.com/resume-dev.pdf',
      githubUrl: 'https://github.com/devpatel',
      skills: [
        { name: 'Python', proficiency: 'ADVANCED', category: 'PROGRAMMING_LANGUAGE' },
        { name: 'FastAPI', proficiency: 'INTERMEDIATE', category: 'FRAMEWORK_LIBRARY' },
        { name: 'Redis', proficiency: 'INTERMEDIATE', category: 'DATABASE' },
      ],
      questionsAsked: [],
      currentNote: 'Needs resume refinement for DSA projects.',
      pastNotes: [],
    },
    {
      id: '4',
      rollNo: '24MCA035',
      name: 'Kunal Verma',
      email: '24mca035@nirmauni.ac.in',
      cgpa: '7.95',
      backlogs: 0,
      targetRole: 'Frontend Developer',
      placementStatus: 'APPLIED',
      resumeUrl: 'https://drive.google.com/resume-kunal.pdf',
      githubUrl: 'https://github.com/kunalv',
      skills: [
        { name: 'React', proficiency: 'ADVANCED', category: 'FRAMEWORK_LIBRARY' },
        { name: 'Node.js', proficiency: 'INTERMEDIATE', category: 'PROGRAMMING_LANGUAGE' },
      ],
      questionsAsked: [],
      currentNote: '',
      pastNotes: [],
    },
  ])

  const [activeStudentIndex, setActiveStudentIndex] = useState(0)
  const [newSkillName, setNewSkillName] = useState('')
  const [newQuestion, setNewQuestion] = useState('')
  const [saveSuccess, setSaveSuccess] = useState(false)

  const activeStudent = students[activeStudentIndex]

  const handleUpdateStudent = (field: string, value: any) => {
    const updated = [...students]
    updated[activeStudentIndex] = {
      ...updated[activeStudentIndex],
      [field]: value,
    }
    setStudents(updated)
  }

  const handleAddSkill = () => {
    if (!newSkillName.trim()) return
    const updated = [...students]
    updated[activeStudentIndex].skills.push({
      name: newSkillName.trim(),
      proficiency: 'INTERMEDIATE',
      category: 'PROGRAMMING_LANGUAGE',
    })
    setStudents(updated)
    setNewSkillName('')
  }

  const handleRemoveSkill = (skillIndex: number) => {
    const updated = [...students]
    updated[activeStudentIndex].skills.splice(skillIndex, 1)
    setStudents(updated)
  }

  const handleAddQuestion = () => {
    if (!newQuestion.trim()) return
    const updated = [...students]
    updated[activeStudentIndex].questionsAsked.push(newQuestion.trim())
    setStudents(updated)
    setNewQuestion('')
  }

  const handleSaveNotes = () => {
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 2000)
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto p-8 flex flex-col gap-6 relative">
      {/* Top Banner: Active Slot Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-xl bg-[#121214] border border-[#26262A]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#6E56CF]/15 border border-[#6E56CF]/40 flex items-center justify-center text-[#cbbeff]">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-[17px] font-semibold text-[#EDEDEF]">
                Live Mentoring Session Console
              </h1>
              <span className="w-2 h-2 rounded-full bg-[#30A46C] animate-pulse" />
              <span className="text-[11px] font-mono text-[#30A46C] uppercase font-medium">
                Live Slot
              </span>
            </div>
            <p className="text-[12px] text-[#A0A0AB] font-mono mt-0.5">
              Thursday, 18 Sept · 3:15 – 3:30 PM (15-min 4-on-1 Group)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="default"
            size="sm"
            onClick={handleSaveNotes}
            className="gap-1.5 h-8 text-[12px]"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{saveSuccess ? 'Saved to DB!' : 'Save & Sync Candidate Data'}</span>
          </Button>
        </div>
      </div>

      {/* 4-on-1 Student Selection Strip */}
      <div className="flex flex-col gap-2">
        <div className="text-[11px] uppercase tracking-wider text-[#6E6E78] font-medium font-mono">
          Session Candidates (Select to review & update data during slot)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {students.map((st, idx) => {
            const isSelected = activeStudentIndex === idx
            return (
              <div
                key={st.id}
                onClick={() => setActiveStudentIndex(idx)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center gap-3 ${
                  isSelected
                    ? 'bg-[#18181B] border-[#6E56CF] shadow-lg'
                    : 'bg-[#121214] border-[#26262A] hover:border-[#34343A]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-mono font-medium ${
                    isSelected
                      ? 'bg-[#6E56CF] text-white'
                      : 'bg-[#18181B] text-[#A0A0AB] border border-[#26262A]'
                  }`}
                >
                  {st.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="flex flex-col min-w-0">
                  <span
                    className={`text-[13px] font-medium truncate leading-tight ${
                      isSelected ? 'text-[#EDEDEF]' : 'text-[#A0A0AB]'
                    }`}
                  >
                    {st.name}
                  </span>
                  <span className="text-[11px] text-[#6E6E78] font-mono truncate">
                    {st.rollNo} · CGPA {st.cgpa}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Main Working Grid: Left (Candidate Data Management) & Right (SPC Notes & Assessment) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pb-20">
        {/* Left Column (7 cols): Data Entry by SPC */}
        <div className="lg:col-span-7 flex flex-col gap-5">
          {/* Card: Academic & Placement Data */}
          <Card className="p-5 bg-[#121214] border-[#26262A] flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#EDEDEF]">
                  Academic & Placement Info
                </h2>
                <p className="text-[11px] text-[#6E6E78]">
                  Managed and verified exclusively by SPC coordinators.
                </p>
              </div>
              <Badge variant="outline" className="font-mono text-[11px]">
                {activeStudent.email}
              </Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-[13px]">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6E6E78]">
                  CGPA (0 - 10)
                </label>
                <Input
                  value={activeStudent.cgpa}
                  onChange={(e) => handleUpdateStudent('cgpa', e.target.value)}
                  className="font-mono font-semibold text-[14px] bg-[#18181B] border-[#26262A]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6E6E78]">
                  Active Backlogs
                </label>
                <Input
                  type="number"
                  value={activeStudent.backlogs}
                  onChange={(e) => handleUpdateStudent('backlogs', Number(e.target.value))}
                  className="font-mono text-[14px] bg-[#18181B] border-[#26262A]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6E6E78]">
                  Placement Readiness
                </label>
                <select
                  value={activeStudent.placementStatus}
                  onChange={(e) => handleUpdateStudent('placementStatus', e.target.value)}
                  aria-label="Placement status selector"
                  className="h-9 rounded-[10px] bg-[#18181B] border border-[#26262A] px-2.5 text-[12px] text-[#EDEDEF] focus:border-[#6E56CF] focus:outline-none"
                >
                  <option value="NOT_STARTED">Not Started</option>
                  <option value="PREPARATION">Preparation</option>
                  <option value="APPLIED">Applied</option>
                  <option value="INTERVIEW">Interviewing</option>
                  <option value="SHORTLISTED">Shortlisted</option>
                  <option value="OFFERED">Offered</option>
                  <option value="PLACED">Placed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[13px]">
              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6E6E78]">
                  Target Role / Track
                </label>
                <Input
                  value={activeStudent.targetRole}
                  onChange={(e) => handleUpdateStudent('targetRole', e.target.value)}
                  placeholder="e.g. Backend SDE, Cloud Engineer"
                  className="bg-[#18181B] border-[#26262A]"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[11px] uppercase tracking-wider text-[#6E6E78]">
                  Master Resume URL
                </label>
                <Input
                  value={activeStudent.resumeUrl}
                  onChange={(e) => handleUpdateStudent('resumeUrl', e.target.value)}
                  className="bg-[#18181B] border-[#26262A] font-mono text-[12px]"
                />
              </div>
            </div>
          </Card>

          {/* Card: Verified Skills Management */}
          <Card className="p-5 bg-[#121214] border-[#26262A] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-3">
              <div>
                <h2 className="text-[15px] font-semibold text-[#EDEDEF]">
                  Verified Technical Skills
                </h2>
                <p className="text-[11px] text-[#6E6E78]">
                  Endorsed and validated during technical mock discussions.
                </p>
              </div>
              <span className="text-[11px] font-mono text-[#A0A0AB]">
                {activeStudent.skills.length} skills logged
              </span>
            </div>

            {/* Skills Badges list */}
            <div className="flex flex-wrap gap-2 py-1">
              {activeStudent.skills.map((skill, sIdx) => (
                <div
                  key={skill.name}
                  className="flex items-center gap-2 pl-3 pr-2 py-1 rounded-full bg-[#18181B] border border-[#26262A] text-[12px] font-mono text-[#EDEDEF]"
                >
                  <span>{skill.name}</span>
                  <span className="text-[10px] text-[#6E6E78] uppercase font-sans">
                    {skill.proficiency}
                  </span>
                  <button
                    onClick={() => handleRemoveSkill(sIdx)}
                    className="w-4 h-4 rounded-full text-[#6E6E78] hover:text-[#E5484D] hover:bg-[#E5484D]/10 flex items-center justify-center transition-colors"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Add Skill Input */}
            <div className="flex items-center gap-2 pt-2">
              <Input
                value={newSkillName}
                onChange={(e) => setNewSkillName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddSkill()}
                placeholder="Add verified skill (e.g. System Design, Redis, Golang)..."
                className="h-8 text-[12px] bg-[#18181B] border-[#26262A]"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleAddSkill}
                className="h-8 text-[12px] shrink-0 gap-1 border-[#26262A]"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Column (5 cols): SPC Notes & Questions Log */}
        <div className="lg:col-span-5 flex flex-col gap-5">
          {/* Card: Live SPC Notes */}
          <Card className="p-5 bg-[#121214] border-[#26262A] flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-[#26262A] pb-3">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[#6E56CF]" />
                <h2 className="text-[15px] font-semibold text-[#EDEDEF]">
                  SPC Feedback & Notes
                </h2>
              </div>
              <span className="text-[10px] font-mono text-[#6E6E78] uppercase">
                Internal Only
              </span>
            </div>

            <textarea
              rows={4}
              value={activeStudent.currentNote}
              onChange={(e) => handleUpdateStudent('currentNote', e.target.value)}
              placeholder="Record mentoring notes, candidate strengths, weaknesses, interview readiness, and action items..."
              className="w-full rounded-[10px] bg-[#18181B] border border-[#26262A] p-3 text-[13px] text-[#EDEDEF] placeholder-[#6E6E78] focus:border-[#6E56CF] focus:outline-none leading-relaxed"
            />

            {/* Questions Asked Log during this Session */}
            <div className="flex flex-col gap-2 pt-2">
              <span className="text-[11px] uppercase tracking-wider text-[#6E6E78] font-medium font-mono">
                Technical Questions Tested
              </span>
              <div className="flex flex-col gap-1.5">
                {activeStudent.questionsAsked.map((q, qIdx) => (
                  <div
                    key={qIdx}
                    className="p-2 rounded-lg bg-[#18181B] border border-[#26262A] text-[12px] text-[#A0A0AB] leading-snug flex items-start gap-2"
                  >
                    <span className="font-mono text-[#6E56CF] font-bold text-[11px] shrink-0">
                      Q{qIdx + 1}.
                    </span>
                    <span>{q}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Input
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddQuestion()}
                  placeholder="Log technical question asked..."
                  className="h-8 text-[12px] bg-[#18181B] border-[#26262A]"
                />
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleAddQuestion}
                  className="h-8 text-[12px] shrink-0 border-[#26262A]"
                >
                  Log
                </Button>
              </div>
            </div>

            {/* Past Notes History */}
            {activeStudent.pastNotes.length > 0 && (
              <div className="border-t border-[#26262A] pt-3 flex flex-col gap-2">
                <span className="text-[10px] uppercase tracking-wider text-[#6E6E78] font-medium">
                  Past Session History
                </span>
                {activeStudent.pastNotes.map((pn, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-2.5 rounded-lg bg-[#18181B]/50 border border-[#26262A] text-[11px] text-[#A0A0AB]"
                  >
                    <div className="flex items-center justify-between text-[#6E6E78] mb-1 font-mono">
                      <span>{pn.author}</span>
                      <span>{pn.date}</span>
                    </div>
                    <div>{pn.note}</div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Floating Session Timer (Bottom Right) */}
      <SessionTimer
        initialMinutes={15}
        studentName={activeStudent.name}
        slotLabel="Live 15-min Slot"
      />
    </div>
  )
}
