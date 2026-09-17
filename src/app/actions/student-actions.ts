'use server'

import { db } from '@/db'
import { students, studentSkills, spcNotes, users } from '@/db/schema'
import { eq, and, ilike, or } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// ─────────────────────────────────────────────────────────────
// Student profile
// ─────────────────────────────────────────────────────────────

/**
 * Get a student's full profile (skills + notes + bookings).
 */
export async function getStudentProfile(userId: string) {
  return db.query.students.findFirst({
    where: eq(students.userId, userId),
    with: {
      user: true,
      skills: true,
      notes: {
        with: { author: true },
        orderBy: (n, { desc }) => [desc(n.createdAt)],
      },
      bookings: {
        with: {
          slot: { with: { spc: true } },
          questions: true,
        },
        orderBy: (b, { desc }) => [desc(b.bookedAt)],
      },
    },
  })
}

/**
 * Get all students — used by SPC in the students directory.
 */
export async function getAllStudents() {
  const rows = await db.query.students.findMany({
    with: {
      user: true,
      skills: true,
      notes: {
        orderBy: (n, { desc }) => [desc(n.createdAt)],
        limit: 1,
      },
    },
    orderBy: (s, { asc }) => [asc(s.createdAt)],
  })
  return rows
}

/**
 * Search students by name or email (SPC directory filter).
 */
export async function searchStudents(query: string) {
  const pattern = `%${query}%`
  const rows = await db.query.users.findMany({
    where: or(ilike(users.name, pattern), ilike(users.email, pattern)),
    with: {
      student: {
        with: { skills: true },
      },
    },
  })
  return rows.filter((u) => u.student !== null)
}

// ─────────────────────────────────────────────────────────────
// Skills — SPC-managed during live session
// ─────────────────────────────────────────────────────────────

export async function addSkill(
  studentId: string,
  name: string,
  category: typeof studentSkills.$inferInsert['category'],
  proficiency: typeof studentSkills.$inferInsert['proficiency']
) {
  await db
    .insert(studentSkills)
    .values({ studentId, name: name.trim(), category, proficiency, isVerified: true })
    .onConflictDoNothing()
  revalidatePath('/')
  return { success: true }
}

export async function removeSkill(skillId: string) {
  await db.delete(studentSkills).where(eq(studentSkills.id, skillId))
  revalidatePath('/')
  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// SPC Notes — per student
// ─────────────────────────────────────────────────────────────

export async function addSpcNote(
  studentId: string,
  authorId: string,
  content: string
) {
  if (!content.trim()) return { success: false, error: 'Note cannot be empty.' }
  await db.insert(spcNotes).values({
    studentId,
    authorId,
    content: content.trim(),
  })
  revalidatePath('/')
  return { success: true }
}

export async function deleteSpcNote(noteId: string) {
  await db.delete(spcNotes).where(eq(spcNotes.id, noteId))
  revalidatePath('/')
  return { success: true }
}

// ─────────────────────────────────────────────────────────────
// Profile update — SPC fills academic + placement info during session
// ─────────────────────────────────────────────────────────────

export async function updateStudentBySession(
  studentId: string,
  data: {
    cgpa?: string
    backlogs?: number
    targetRole?: string
    placementStatus?: typeof students.$inferInsert['placementStatus']
    resumeUrl?: string
    githubUrl?: string
    linkedinUrl?: string
    bio?: string
  }
) {
  await db
    .update(students)
    .set({
      ...(data.cgpa !== undefined && { cgpa: data.cgpa }),
      ...(data.backlogs !== undefined && { backlogs: data.backlogs }),
      ...(data.targetRole !== undefined && { targetRole: data.targetRole }),
      ...(data.placementStatus !== undefined && { placementStatus: data.placementStatus }),
      ...(data.resumeUrl !== undefined && { resumeUrl: data.resumeUrl }),
      ...(data.githubUrl !== undefined && { githubUrl: data.githubUrl }),
      ...(data.linkedinUrl !== undefined && { linkedinUrl: data.linkedinUrl }),
      ...(data.bio !== undefined && { bio: data.bio }),
      updatedAt: new Date(),
    })
    .where(eq(students.id, studentId))
  revalidatePath('/')
  return { success: true }
}
