'use server'

import { db } from '@/db'
import { students, studentSkills, spcNotes, mentoringSlots, slotBookings, users } from '@/db/schema'
import { eq, and, desc, asc, sql } from 'drizzle-orm'

export interface SpcDashboardData {
  stats: {
    totalStudents: number
    todaySessionsCount: number
    totalSlotsCreated: number
    totalSkillsVerified: number
    averageCgpa: number
    placedCount: number
    placedPercentage: number
  }
  statusCounts: Record<string, number>
  todaySessions: Array<{
    bookingId: string
    slotId: string
    slotTime: string
    durationMinutes: number
    location: string | null
    studentQuestion: string | null
    student: {
      id: string
      name: string
      email: string
      rollNumber: string | null
      cgpa: string | null
      targetRole: string | null
      placementStatus: string
      skillsCount: number
      verifiedSkillsCount: number
    }
  }>
  topSkills: Array<{ name: string; count: number; category: string }>
  recentNotes: Array<{
    id: string
    content: string
    authorName: string
    studentName: string
    createdAt: string
  }>
  attentionCandidates: Array<{
    id: string
    name: string
    email: string
    rollNumber: string | null
    cgpa: string | null
    targetRole: string | null
    reason: string
  }>
}

export async function getSpcDashboardData(spcId: string): Promise<SpcDashboardData> {
  const now = new Date()
  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  // 1. Fetch all students with user, skills, and notes
  const allStudents = await db.query.students.findMany({
    with: {
      user: true,
      skills: true,
      notes: {
        with: { author: true },
        orderBy: (n, { desc }) => [desc(n.createdAt)],
      },
    },
    orderBy: (s, { asc }) => [asc(s.createdAt)],
  })

  // 2. Fetch today's slots for this SPC
  const todaySlots = await db.query.mentoringSlots.findMany({
    where: and(
      eq(mentoringSlots.spcId, spcId),
      eq(mentoringSlots.slotDate, todayIso),
      eq(mentoringSlots.isActive, true)
    ),
    with: {
      bookings: {
        where: eq(slotBookings.status, 'CONFIRMED'),
        with: {
          student: {
            with: {
              user: true,
              skills: true,
            },
          },
        },
      },
    },
    orderBy: (s, { asc }) => [asc(s.startTime)],
  })

  // 3. Fetch total slots count for SPC
  const allSpcSlots = await db.query.mentoringSlots.findMany({
    where: eq(mentoringSlots.spcId, spcId),
    columns: { id: true },
  })

  // Compute status counts
  const statusCounts: Record<string, number> = {
    NOT_STARTED: 0,
    PREPARATION: 0,
    APPLIED: 0,
    INTERVIEW: 0,
    SHORTLISTED: 0,
    OFFERED: 0,
    PLACED: 0,
  }

  let totalCgpa = 0
  let cgpaCount = 0
  let totalSkillsVerified = 0

  const skillFrequency: Record<string, { count: number; category: string }> = {}
  const recentNotesList: Array<{
    id: string
    content: string
    authorName: string
    studentName: string
    createdAt: string
  }> = []

  const attentionCandidatesList: Array<{
    id: string
    name: string
    email: string
    rollNumber: string | null
    cgpa: string | null
    targetRole: string | null
    reason: string
  }> = []

  for (const s of allStudents) {
    if (s.placementStatus && statusCounts[s.placementStatus] !== undefined) {
      statusCounts[s.placementStatus]++
    }

    if (s.cgpa) {
      const num = parseFloat(s.cgpa)
      if (!isNaN(num)) {
        totalCgpa += num
        cgpaCount++
      }
    }

    const verifiedSkills = s.skills.filter((sk) => sk.isVerified)
    totalSkillsVerified += verifiedSkills.length

    for (const sk of s.skills) {
      if (!skillFrequency[sk.name]) {
        skillFrequency[sk.name] = { count: 0, category: sk.category }
      }
      skillFrequency[sk.name].count++
    }

    for (const note of s.notes) {
      recentNotesList.push({
        id: note.id,
        content: note.content,
        authorName: note.author?.name ?? 'SPC',
        studentName: s.user?.name ?? 'Student',
        createdAt: note.createdAt.toISOString(),
      })
    }

    // Flag students needing attention:
    // e.g. CGPA >= 8.0 with no verified skills, or backlogs > 0, or actively interviewing
    if (s.cgpa && parseFloat(s.cgpa) >= 8.0 && verifiedSkills.length === 0) {
      attentionCandidatesList.push({
        id: s.id,
        name: s.user?.name ?? 'Candidate',
        email: s.user?.email ?? '',
        rollNumber: s.rollNumber,
        cgpa: s.cgpa,
        targetRole: s.targetRole,
        reason: 'High CGPA (≥ 8.0) but 0 skills verified by SPC',
      })
    } else if (s.backlogs > 0) {
      attentionCandidatesList.push({
        id: s.id,
        name: s.user?.name ?? 'Candidate',
        email: s.user?.email ?? '',
        rollNumber: s.rollNumber,
        cgpa: s.cgpa,
        targetRole: s.targetRole,
        reason: `${s.backlogs} Active Backlog${s.backlogs > 1 ? 's' : ''} reported`,
      })
    }
  }

  // Flatten today sessions
  const todaySessions = todaySlots.flatMap((slot) =>
    slot.bookings.map((booking) => {
      const st = booking.student
      const verified = st?.skills?.filter((sk) => sk.isVerified).length ?? 0
      return {
        bookingId: booking.id,
        slotId: slot.id,
        slotTime: slot.startTime,
        durationMinutes: slot.durationMinutes,
        location: slot.location,
        studentQuestion: booking.studentQuestion,
        student: {
          id: st?.id ?? '',
          name: st?.user?.name ?? 'Candidate',
          email: st?.user?.email ?? '',
          rollNumber: st?.rollNumber ?? null,
          cgpa: st?.cgpa ?? null,
          targetRole: st?.targetRole ?? null,
          placementStatus: st?.placementStatus ?? 'NOT_STARTED',
          skillsCount: st?.skills?.length ?? 0,
          verifiedSkillsCount: verified,
        },
      }
    })
  )

  // Top skills sorted by count
  const topSkills = Object.entries(skillFrequency)
    .map(([name, val]) => ({ name, count: val.count, category: val.category }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  // Sort notes descending
  recentNotesList.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  const totalStudents = allStudents.length
  const placedCount = (statusCounts.PLACED || 0) + (statusCounts.OFFERED || 0)
  const placedPercentage = totalStudents > 0 ? Math.round((placedCount / totalStudents) * 100) : 0
  const averageCgpa = cgpaCount > 0 ? Number((totalCgpa / cgpaCount).toFixed(2)) : 0

  return {
    stats: {
      totalStudents,
      todaySessionsCount: todaySessions.length,
      totalSlotsCreated: allSpcSlots.length,
      totalSkillsVerified,
      averageCgpa,
      placedCount,
      placedPercentage,
    },
    statusCounts,
    todaySessions,
    topSkills,
    recentNotes: recentNotesList.slice(0, 5),
    attentionCandidates: attentionCandidatesList.slice(0, 6),
  }
}
