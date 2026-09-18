'use client'

import React, { useState } from 'react'
import { Sidebar } from '@/components/sidebar'
import { Topbar } from '@/components/topbar'
import { StudentDashboardView } from '@/components/views/student-dashboard-view'
import { SpcDashboardView } from '@/components/views/spc-dashboard-view'
import { SpcSlotsManagerView } from '@/components/views/spc-slots-manager-view'
import { BookMentoringSlotView } from '@/components/views/book-mentoring-slot-view'
import { StudentsDirectoryView } from '@/components/views/students-directory-view'
import { LiveMentoringSessionView } from '@/components/views/live-mentoring-session-view'
import { Card } from '@/components/ui/card'
import { Building2, FileCheck2, Award } from 'lucide-react'

interface PlacementHubClientProps {
  userId: string
  userName: string
  userEmail: string
  role: 'SPC' | 'STUDENT'
  studentProfile: Record<string, unknown> | null
}

export function PlacementHubClient({
  userId,
  userName,
  userEmail,
  role,
  studentProfile,
}: PlacementHubClientProps) {
  const [currentTab, setCurrentTab] = useState<string>('dashboard')
  const [activeRole, setActiveRole] = useState<'SPC' | 'STUDENT'>(role)

  const isRealSpc = role === 'SPC'

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
      default:
        return [{ label: 'Dashboard' }]
    }
  }

  const handleRoleToggle = () => {
    setActiveRole((r) => {
      const nextRole = r === 'SPC' ? 'STUDENT' : 'SPC'
      if (nextRole === 'STUDENT' && ['live-session', 'manage-slots', 'students'].includes(currentTab)) {
        setCurrentTab('dashboard')
      } else if (nextRole === 'SPC' && currentTab === 'book-slot') {
        setCurrentTab('dashboard')
      }
      return nextRole
    })
  }

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EDEDEF] flex">
      <Sidebar
        currentTab={currentTab}
        onTabChange={setCurrentTab}
        role={activeRole}
      />

      <div className="pl-[240px] flex-1 flex flex-col min-h-screen bg-[#0A0A0B]">
        <Topbar
          breadcrumbs={getBreadcrumbs()}
          role={activeRole}
          onRoleToggle={isRealSpc ? handleRoleToggle : undefined}
        />

        <main className="flex-1">
          {currentTab === 'dashboard' && (
            activeRole === 'SPC' ? (
              <SpcDashboardView
                userId={userId}
                userName={userName}
                onNavigate={(tab) => setCurrentTab(tab)}
              />
            ) : (
              <StudentDashboardView
                userId={userId}
                userName={userName}
                role={activeRole}
                studentProfile={studentProfile}
                onNavigateToBooking={() => setCurrentTab('book-slot')}
              />
            )
          )}

          {currentTab === 'book-slot' && activeRole === 'STUDENT' && (
            <BookMentoringSlotView
              userId={userId}
              studentId={(studentProfile as any)?.id ?? null}
            />
          )}

          {currentTab === 'live-session' && activeRole === 'SPC' && (
            <LiveMentoringSessionView
              spcId={userId}
              spcName={userName}
            />
          )}

          {currentTab === 'manage-slots' && activeRole === 'SPC' && (
            <SpcSlotsManagerView spcId={userId} />
          )}

          {currentTab === 'students' && activeRole === 'SPC' && (
            <StudentsDirectoryView spcId={userId} />
          )}

          {currentTab === 'companies' && (
            <div className="w-full max-w-[1200px] mx-auto p-8">
              <div className="mb-6">
                <h1 className="text-[22px] font-semibold text-[#EDEDEF] tracking-tight">
                  Visiting Companies &amp; Drives
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
        </main>
      </div>
    </div>
  )
}
