'use server'

import { db } from '@/db'
import { slotBookings, sessionQuestions, mentoringSlots } from '@/db/schema'
import { eq, and } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

/**
 * Get all booked students for an SPC's slots on a given date.
 * This populates the Live Mentoring Session console.
 */
export async function getSessionStudents(spcId: string, date: string) {
  const slots = await db.query.mentoringSlots.findMany({
    where: and(
      eq(mentoringSlots.spcId, spcId),
      eq(mentoringSlots.slotDate, date),
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
              notes: {
                with: { author: true },
                orderBy: (n, { desc }) => [desc(n.createdAt)],
              },
            },
          },
          questions: {
            orderBy: (q, { asc }) => [asc(q.createdAt)],
          },
        },
      },
    },
    orderBy: (s, { asc }) => [asc(s.startTime)],
  })

  // Flatten: one booking per slot (maxCapacity = 1)
  const sessions = slots
    .flatMap((slot) =>
      slot.bookings.map((booking) => ({
        bookingId: booking.id,
        slotId: slot.id,
        slotTime: slot.startTime,
        durationMinutes: slot.durationMinutes,
        location: slot.location,
        studentQuestion: booking.studentQuestion,
        student: booking.student,
        questionsAsked: booking.questions,
      }))
    )

  return sessions
}

/**
 * Add a mock interview question to a booking session.
 */
export async function addSessionQuestion(bookingId: string, question: string) {
  if (!question.trim()) return { success: false, error: 'Question cannot be empty.' }
  await db.insert(sessionQuestions).values({
    bookingId,
    question: question.trim(),
  })
  revalidatePath('/')
  return { success: true }
}

/**
 * Remove a mock interview question.
 */
export async function removeSessionQuestion(questionId: string) {
  await db.delete(sessionQuestions).where(eq(sessionQuestions.id, questionId))
  revalidatePath('/')
  return { success: true }
}

/**
 * Mark a slot booking as COMPLETED when the SPC wraps up the session.
 */
export async function completeSession(bookingId: string) {
  await db
    .update(slotBookings)
    .set({ status: 'COMPLETED', updatedAt: new Date() })
    .where(eq(slotBookings.id, bookingId))
  revalidatePath('/')
  return { success: true }
}
