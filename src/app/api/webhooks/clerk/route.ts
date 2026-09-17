/**
 * Clerk Webhook Handler
 * Syncs Clerk user events (user.created / user.updated) to the Neon DB users table.
 *
 * SETUP REQUIRED:
 * 1. Add CLERK_WEBHOOK_SECRET to your .env file
 * 2. In Clerk Dashboard → Webhooks → Add endpoint:
 *    URL: https://<your-domain>/api/webhooks/clerk
 *    Events: user.created, user.updated
 */
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/db'
import { users, students } from '@/db/schema'
import { getUserRole } from '@/lib/auth-checks'

type ClerkWebhookEvent = {
  type: 'user.created' | 'user.updated' | 'user.deleted'
  data: {
    id: string
    first_name: string | null
    last_name: string | null
    image_url: string | null
    email_addresses: { email_address: string; id: string }[]
    primary_email_address_id: string | null
  }
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET
  if (!WEBHOOK_SECRET) {
    console.error('CLERK_WEBHOOK_SECRET is not set')
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  // Get Svix headers for verification
  const headerPayload = await headers()
  const svixId = headerPayload.get('svix-id')
  const svixTimestamp = headerPayload.get('svix-timestamp')
  const svixSignature = headerPayload.get('svix-signature')

  if (!svixId || !svixTimestamp || !svixSignature) {
    return NextResponse.json({ error: 'Missing Svix headers' }, { status: 400 })
  }

  const body = await req.text()

  let event: ClerkWebhookEvent
  try {
    const wh = new Webhook(WEBHOOK_SECRET)
    event = wh.verify(body, {
      'svix-id': svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as unknown as ClerkWebhookEvent
  } catch {
    return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 })
  }

  const { type, data } = event

  if (type === 'user.created' || type === 'user.updated') {
    const primaryEmail =
      data.email_addresses.find((e) => e.id === data.primary_email_address_id)
        ?.email_address ?? ''

    const name =
      [data.first_name, data.last_name].filter(Boolean).join(' ') ||
      primaryEmail.split('@')[0]

    const role = getUserRole(primaryEmail)

    const [upserted] = await db
      .insert(users)
      .values({
        id: data.id,
        clerkUserId: data.id,
        name,
        email: primaryEmail,
        role,
        avatarUrl: data.image_url ?? null,
      })
      .onConflictDoUpdate({
        target: users.id,
        set: {
          name,
          email: primaryEmail,
          role,
          avatarUrl: data.image_url ?? null,
          updatedAt: new Date(),
        },
      })
      .returning()

    // Ensure blank student profile exists for STUDENT role
    if (upserted.role === 'STUDENT') {
      await db
        .insert(students)
        .values({ userId: data.id })
        .onConflictDoNothing()
    }

    return NextResponse.json({ received: true, role: upserted.role })
  }

  // Ignore other event types
  return NextResponse.json({ received: true })
}
