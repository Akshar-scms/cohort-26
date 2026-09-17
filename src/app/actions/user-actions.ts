'use server'

import { db } from '@/db'
import { users, students } from '@/db/schema'
import { getUserRole } from '@/lib/auth-checks'
import { currentUser } from '@clerk/nextjs/server'
import { eq } from 'drizzle-orm'

/**
 * Upsert a user row from Clerk data.
 * Called by the Clerk webhook on user.created / user.updated,
 * and also defensively on first dashboard load.
 */
export async function syncClerkUser(clerkUserId: string) {
  const clerkUserObj = await currentUser()
  if (!clerkUserObj || clerkUserObj.id !== clerkUserId) return null

  const primaryEmail =
    clerkUserObj.emailAddresses.find(
      (e) => e.id === clerkUserObj.primaryEmailAddressId
    )?.emailAddress ?? ''

  const name =
    [clerkUserObj.firstName, clerkUserObj.lastName].filter(Boolean).join(' ') ||
    primaryEmail.split('@')[0]

  const role = getUserRole(primaryEmail)

  const [upserted] = await db
    .insert(users)
    .values({
      id: clerkUserId,
      clerkUserId,
      name,
      email: primaryEmail,
      role,
      avatarUrl: clerkUserObj.imageUrl ?? null,
    })
    .onConflictDoUpdate({
      target: users.id,
      set: {
        name,
        email: primaryEmail,
        role,
        avatarUrl: clerkUserObj.imageUrl ?? null,
        updatedAt: new Date(),
      },
    })
    .returning()

  // If the user is a STUDENT, ensure a blank student profile exists
  if (upserted.role === 'STUDENT') {
    await db
      .insert(students)
      .values({ userId: clerkUserId })
      .onConflictDoNothing()
  }

  return upserted
}

/**
 * Returns the currently signed-in user + their student profile (if STUDENT).
 * Safe to call from Server Components.
 */
export async function getCurrentUserWithProfile() {
  const clerkUserObj = await currentUser()
  if (!clerkUserObj) return null

  const user = await db.query.users.findFirst({
    where: eq(users.id, clerkUserObj.id),
    with: {
      student: {
        with: {
          skills: true,
          bookings: {
            with: { slot: true },
            limit: 5,
          },
        },
      },
    },
  })

  // First-time login: sync and re-fetch
  if (!user) {
    await syncClerkUser(clerkUserObj.id)
    return db.query.users.findFirst({
      where: eq(users.id, clerkUserObj.id),
      with: {
        student: {
          with: {
            skills: true,
            bookings: { with: { slot: true }, limit: 5 },
          },
        },
      },
    })
  }

  return user
}
