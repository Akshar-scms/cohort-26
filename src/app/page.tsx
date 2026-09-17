import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { isEmailAllowed, getUserRole } from '@/lib/auth-checks'
import { getCurrentUserWithProfile } from '@/app/actions/user-actions'
import { PlacementHubClient } from '@/components/placement-hub-client'
import { LoginScreenView } from '@/components/views/login-screen-view'
import { AccessRestricted } from '@/components/access-restricted'

export default async function PlacementHubPage() {
  const clerkUser = await currentUser()

  // Not signed in → show login screen
  if (!clerkUser) {
    return <LoginScreenView />
  }

  const primaryEmail =
    clerkUser.emailAddresses.find(
      (e) => e.id === clerkUser.primaryEmailAddressId
    )?.emailAddress ?? ''

  // Domain restriction check
  if (!isEmailAllowed(primaryEmail)) {
    return <AccessRestricted email={primaryEmail} />
  }

  // Fetch real user + profile from DB (auto-syncs on first login)
  const userWithProfile = await getCurrentUserWithProfile()

  const role = getUserRole(primaryEmail)
  const userName =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
    primaryEmail.split('@')[0]

  return (
    <PlacementHubClient
      userId={clerkUser.id}
      userName={userName}
      userEmail={primaryEmail}
      role={role}
      studentProfile={userWithProfile?.student ?? null}
    />
  )
}
