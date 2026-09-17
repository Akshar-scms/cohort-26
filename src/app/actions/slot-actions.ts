'use server'

import { db } from '@/db'
import { mentoringSlots, slotBookings, students } from '@/db/schema'
import { eq, and, sql } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

// ─────────────────────────────────────────────────────────────
// STUDENT-FACING ACTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Fetch all active slots for a given date (ISO string, e.g. "2026-09-18").
 * Returns slots with their spc info and whether the current student has booked.
 */
export async function getAvailableSlots(date: string, currentStudentId?: string) {
  const slots = await db.query.mentoringSlots.findMany({
    where: and(
      eq(mentoringSlots.slotDate, date),
      eq(mentoringSlots.isActive, true)
    ),
    with: {
      spc: true,
      bookings: true,
    },
    orderBy: (s, { asc }) => [asc(s.startTime)],
  })

  return slots.map((slot) => {
    const isBooked = slot.currentBookings >= slot.maxCapacity
    const isBookedByMe = currentStudentId
      ? slot.bookings.some((b) => b.studentId === currentStudentId && b.status === 'CONFIRMED')
      : false

    return {
      id: slot.id,
      startTime: slot.startTime,
      durationMinutes: slot.durationMinutes,
      location: slot.location,
      notes: slot.notes,
      spcId: slot.spcId,
      spcName: slot.spc?.name ?? 'SPC',
      currentBookings: slot.currentBookings,
      maxCapacity: slot.maxCapacity,
      isBooked,
      isBookedByMe,
    }
  })
}

/**
 * Fetch month summary of slots for calendar dot indicators
 */
export async function getMonthSlotsSummary(year: number, month: number, currentStudentId?: string) {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const lastDay = new Date(year, month + 1, 0).getDate()
  const endDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(lastDay).padStart(2, '0')}`

  const allSlots = await db.query.mentoringSlots.findMany({
    where: and(
      sql`${mentoringSlots.slotDate} >= ${startDate}`,
      sql`${mentoringSlots.slotDate} <= ${endDate}`,
      eq(mentoringSlots.isActive, true)
    ),
    with: {
      bookings: true,
    },
  })

  // Map each date string to status: { hasAvailable: boolean, hasBooked: boolean, myBooked: boolean }
  const summary: Record<string, { total: number; available: number; booked: number; myBooked: boolean }> = {}

  for (const slot of allSlots) {
    const d = slot.slotDate
    if (!summary[d]) {
      summary[d] = { total: 0, available: 0, booked: 0, myBooked: false }
    }
    summary[d].total += 1
    const isFull = slot.currentBookings >= slot.maxCapacity
    if (isFull) {
      summary[d].booked += 1
    } else {
      summary[d].available += 1
    }
    if (currentStudentId && slot.bookings.some((b) => b.studentId === currentStudentId && b.status === 'CONFIRMED')) {
      summary[d].myBooked = true
    }
  }

  return summary
}

/**
 * Book a slot for a student.
 * Validates: slot must be active, not full, student must not already have a booking.
 */
export async function bookSlot(
  slotId: string,
  studentId: string,
  studentQuestion?: string
) {
  // Load slot
  const slot = await db.query.mentoringSlots.findFirst({
    where: eq(mentoringSlots.id, slotId),
  })
  if (!slot) return { success: false, error: 'Slot not found.' }
  if (!slot.isActive) return { success: false, error: 'Slot is no longer active.' }
  if (slot.currentBookings >= slot.maxCapacity)
    return { success: false, error: 'Slot is fully booked.' }

  // Check duplicate booking
  const existing = await db.query.slotBookings.findFirst({
    where: and(
      eq(slotBookings.slotId, slotId),
      eq(slotBookings.studentId, studentId)
    ),
  })
  if (existing) return { success: false, error: 'You have already booked this slot.' }

  // Neon HTTP driver does not support interactive transactions.
  // We perform sequential operations:
  await db.insert(slotBookings).values({
    slotId,
    studentId,
    studentQuestion: studentQuestion?.trim() || null,
    status: 'CONFIRMED',
  })

  await db
    .update(mentoringSlots)
    .set({ currentBookings: sql`${mentoringSlots.currentBookings} + 1` })
    .where(eq(mentoringSlots.id, slotId))

  revalidatePath('/')
  return { success: true }
}

/**
 * Get the next upcoming confirmed booking for a student (for the dashboard card).
 */
export async function getStudentUpcomingBooking(studentId: string) {
  const booking = await db.query.slotBookings.findFirst({
    where: and(
      eq(slotBookings.studentId, studentId),
      eq(slotBookings.status, 'CONFIRMED')
    ),
    with: { slot: { with: { spc: true } } },
    orderBy: (b, { asc }) => [asc(b.bookedAt)],
  })
  return booking ?? null
}

// ─────────────────────────────────────────────────────────────
// SPC-FACING ACTIONS
// ─────────────────────────────────────────────────────────────

/**
 * Fetch all slots created by this SPC for a given date.
 */
export async function getSpcSlots(spcId: string, date: string) {
  const slots = await db.query.mentoringSlots.findMany({
    where: and(
      eq(mentoringSlots.spcId, spcId),
      eq(mentoringSlots.slotDate, date)
    ),
    with: {
      bookings: {
        with: { student: { with: { user: true } } },
      },
    },
    orderBy: (s, { asc }) => [asc(s.startTime)],
  })

  return slots.map((slot) => {
    const booking = slot.bookings.find((b) => b.status === 'CONFIRMED')
    return {
      id: slot.id,
      startTime: slot.startTime,
      durationMinutes: slot.durationMinutes,
      location: slot.location,
      notes: slot.notes,
      isActive: slot.isActive,
      currentBookings: slot.currentBookings,
      maxCapacity: slot.maxCapacity,
      bookedStudent: booking
        ? {
            id: booking.studentId,
            name: booking.student?.user?.name ?? 'Unknown',
            email: booking.student?.user?.email ?? '',
            rollNumber: booking.student?.rollNumber ?? '',
          }
        : null,
    }
  })
}

/**
 * SPC creates a new 15-min slot.
 */
export async function createSlot(
  spcId: string,
  date: string,
  startTime: string,
  durationMinutes: number = 15,
  location?: string,
  notes?: string
) {
  await db.insert(mentoringSlots).values({
    spcId,
    slotDate: date,
    startTime,
    durationMinutes,
    maxCapacity: 1,
    currentBookings: 0,
    isActive: true,
    location: location?.trim() || null,
    notes: notes?.trim() || null,
  })
  revalidatePath('/')
  return { success: true }
}

/**
 * SPC deletes a slot - only allowed if it has no confirmed bookings.
 */
export async function deleteSlot(slotId: string) {
  const slot = await db.query.mentoringSlots.findFirst({
    where: eq(mentoringSlots.id, slotId),
    with: { bookings: true },
  })
  if (!slot) return { success: false, error: 'Slot not found.' }

  const hasBookings = slot.bookings.some((b) => b.status === 'CONFIRMED')
  if (hasBookings)
    return { success: false, error: 'Cannot delete a slot that has a confirmed booking.' }

  await db.delete(mentoringSlots).where(eq(mentoringSlots.id, slotId))
  revalidatePath('/')
  return { success: true }
}
