'use client'

import React, { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { isEmailAllowed, getUserRole, SPC_EMAILS } from '@/lib/auth-checks'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { LoginScreenView } from '@/components/views/login-screen-view'
import { AccessRestricted } from '@/components/access-restricted'
import { StudentDashboardView } from '@/components/views/student-dashboard-view'
import { SpcSlotsManagerView } from '@/components/views/spc-slots-manager-view'
import { BookMentoringSlotView } from '@/components/views/book-mentoring-slot-view'
import { StudentsDirectoryView } from '@/components/views/students-directory-view'
import { LiveMentoringSessionView } from '@/components/views/live-mentoring-session-view'
import { Card } from '@/components/ui/card'
import { Building2, FileCheck2, Award, Video } from 'lucide-react'

export default function PlacementHubPage() {
  const { isSignedIn, isLoaded, user } = useUser()
  const [currentTab, setCurrentTab] = useState<string>('dashboard')
  const [activeRole, setActiveRole] = useState<'SPC' | 'STUDENT'>('STUDENT')

  const primaryEmail = user?.primaryEmailAddress?.emailAddress
  const detectedRole = getUserRole(primaryEmail)

  // Sync role when user loads
  useEffect(() => {
    if (detectedRole) {
      setActiveRole(detectedRole)
    }
  }, [detectedRole])

  // Loading state
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center text-[#6E6E78] font-mono text-[13px]">
        Loading Placement Hub...
      </div>
    )
  }

  // If not signed in -> show the Stitch Login screen
  if (!isSignedIn || !user) {
    return <LoginScreenView />
  }

  // Email Domain Restriction Check
  const isAuthorized = isEmailAllowed(primaryEmail)

  // If email domain is not authorized -> show Access Restricted view
  if (!isAuthorized) {
    return <AccessRestricted email={primaryEmail} />
  }

  const isRealSpc = detectedRole === 'SPC'

  // Navigation breadcrumbs mapping
  const getBreadcrumbs = () => {
    switch (currentTab) {
      case 'dashboard':
        return [{ label: 'Overview' }, { label: 'Dashboard' }]
      case 'students':
        return [{ label: 'Placement' }, { label: 'Students Directory' }]
      case 'companies':
        return [{ label: 'Placement' }, { label: 'Companies' }]
      case 'applications':
        return [{ label: 'Placement' }, { label: 'Applications' }]
      case 'offers':
        return [{ label: 'Placement' }, { label: 'Offers' }]
      case 'book-slot':
        return [{ label: 'Mentoring' }, { label: 'Book a Slot' }]
      case 'live-session':
        return [{ label: 'Mentoring' }, { label: 'Live Mentoring Console' }]
      case 'manage-slots':
        return [{ label: 'Mentoring' }, { label: 'Manage Slots' }]
      case 'mock-interviews':
        return [{ label: 'Mentoring' }, { label: 'Mock Interviews' }]
      default:
        return [{ label: 'Dashboard' }]
    }
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EDEDEF] flex">
      {/* 240px Fixed Left Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        role={activeRole}
      />

      {/* Main Canvas Area */}
      <div className="pl-[240px] flex-1 flex flex-col min-h-screen bg-[#0A0A0B]">
        {/* Topbar with optional role switcher for SPCs to preview student view */}
        <Topbar
          breadcrumbs={getBreadcrumbs()}
          role={activeRole}
          onRoleToggle={
            isRealSpc
              ? () => setActiveRole((r) => (r === 'SPC' ? 'STUDENT' : 'SPC'))
              : undefined
          }
        />

        {/* Dynamic View Content */}
        <main className="flex-1">
          {currentTab === 'dashboard' && (
            <StudentDashboardView
              onNavigateToBooking={() => setCurrentTab('book-slot')}
            />
          )}

          {currentTab === 'book-slot' && <BookMentoringSlotView />}

          {currentTab === 'live-session' && <LiveMentoringSessionView />}

          {currentTab === 'manage-slots' && <SpcSlotsManagerView />}

          {currentTab === 'students' && <StudentsDirectoryView />}

          {currentTab === 'companies' && (
            <div className="w-full max-w-[1200px] mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
                  Visiting Companies & Drives
                </h1>
                <p className="text-[13px] text-[#A0A0AB]">
                  Active recruiters and upcoming on-campus drives for MCA &apos;26.
                </p>
              </div>
              <Card className="bg-[#121214] border-[#26262A] p-8 text-center flex flex-col items-center justify-center gap-3">
                <Building2 className="w-8 h-8 text-[#6E6E78]" />
                <span className="text-[14px] font-medium text-[#EDEDEF]">
                  Company recruitment drives will open in October 2026.
                </span>
                <span className="text-[12px] text-[#A0A0AB]">
                  Contact your SPC coordinator for specific eligibility criteria.
                </span>
              </Card>
            </div>
          )}

          {currentTab === 'applications' && (
            <div className="w-full max-w-[1200px] mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
                  Application Tracking
                </h1>
                <p className="text-[13px] text-[#A0A0AB]">
                  Real-time status of your company submissions.
                </p>
              </div>
              <Card className="bg-[#121214] border-[#26262A] p-8 text-center flex flex-col items-center justify-center gap-3">
                <FileCheck2 className="w-8 h-8 text-[#6E6E78]" />
                <span className="text-[14px] font-medium text-[#EDEDEF]">
                  No active company applications at this time.
                </span>
              </Card>
            </div>
          )}

          {currentTab === 'offers' && (
            <div className="w-full max-w-[1200px] mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
                  Placement Offers
                </h1>
                <p className="text-[13px] text-[#A0A0AB]">
                  Verified offer letters and compensation packages.
                </p>
              </div>
              <Card className="bg-[#121214] border-[#26262A] p-8 text-center flex flex-col items-center justify-center gap-3">
                <Award className="w-8 h-8 text-[#6E6E78]" />
                <span className="text-[14px] font-medium text-[#EDEDEF]">
                  Offer letters verified through the SPC cell will appear here.
                </span>
              </Card>
            </div>
          )}

          {currentTab === 'mock-interviews' && (
            <div className="w-full max-w-[1200px] mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
                  Mock Interview Sessions
                </h1>
                <p className="text-[13px] text-[#A0A0AB]">
                  Technical, DSA, and HR mock interviews with SPCs and alumni.
                </p>
              </div>
              <Card className="bg-[#121214] border-[#26262A] p-8 text-center flex flex-col items-center justify-center gap-3">
                <Video className="w-8 h-8 text-[#6E6E78]" />
                <span className="text-[14px] font-medium text-[#EDEDEF]">
                  Mock interview feedback and recorded notes will be accessible after your scheduled session.
                </span>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
