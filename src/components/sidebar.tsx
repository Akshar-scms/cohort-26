'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton, useUser } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarCheck,
  Building2,
  FileCheck2,
  Award,
  Video,
  ChevronRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  currentTab?: string
  onTabChange?: (tab: string) => void
  role?: 'SPC' | 'STUDENT'
}

export function Sidebar({ currentTab = 'dashboard', onTabChange, role = 'STUDENT' }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()

  const userName = user?.fullName || user?.firstName || 'Aarav Shah'
  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : userName.slice(0, 2).toUpperCase()

  const navItems = [
    {
      group: 'OVERVIEW',
      items: [
        {
          id: 'dashboard',
          label: 'Dashboard',
          icon: LayoutDashboard,
          href: '#',
        },
      ],
    },
    {
      group: 'PLACEMENT',
      items: [
        {
          id: 'students',
          label: role === 'SPC' ? 'Students Directory' : 'My Profile',
          icon: Users,
          href: '#',
        },
        {
          id: 'companies',
          label: 'Companies',
          icon: Building2,
          href: '#',
        },
        {
          id: 'applications',
          label: 'Applications',
          icon: FileCheck2,
          href: '#',
        },
        {
          id: 'offers',
          label: 'Offers',
          icon: Award,
          href: '#',
        },
      ],
    },
    {
      group: 'MENTORING',
      items: [
        {
          id: 'book-slot',
          label: 'Book a Slot',
          icon: CalendarCheck,
          href: '#',
          studentOnly: true,
        },
        {
          id: 'manage-slots',
          label: 'Manage Slots',
          icon: Calendar,
          href: '#',
          spcOnly: true,
        },
        {
          id: 'live-session',
          label: 'Live Mentoring Console',
          icon: Video,
          href: '#',
          spcOnly: true,
        },
      ],
    },
  ]

  return (
    <aside className="fixed top-0 left-0 h-screen w-[240px] z-30 bg-[#121214] border-r border-[#26262A] flex flex-col justify-between p-3 select-none">
      {/* Top Section */}
      <div className="flex flex-col gap-5">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2 pt-1 pb-1">
          <div className="w-[28px] h-[28px] rounded-lg bg-[#6E56CF] flex items-center justify-center text-white font-semibold text-[14px] shrink-0 shadow-none">
            P
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[14px] leading-tight font-medium text-[#EDEDEF] truncate">
              Placement Hub
            </span>
            <span className="text-[11px] text-[#6E6E78] truncate leading-tight mt-0.5">
              MCA &apos;26 · Nirma
            </span>
          </div>
        </div>

        {/* Navigation Hierarchy */}
        <nav className="flex flex-col gap-4">
          {navItems.map((group) => {
            const visibleItems = group.items.filter((item) => {
              if (item.spcOnly && role !== 'SPC') return false
              if (item.studentOnly && role !== 'STUDENT') return false
              return true
            })
            if (visibleItems.length === 0) return null

            return (
              <div key={group.group} className="flex flex-col gap-1">
                <span className="px-2 text-[10px] uppercase tracking-wider text-[#6E6E78] font-medium font-sans">
                  {group.group}
                </span>
                {visibleItems.map((item) => {
                  const Icon = item.icon
                  const isActive = currentTab === item.id

                  return (
                    <button
                      key={item.id}
                      onClick={() => onTabChange && onTabChange(item.id)}
                      className={cn(
                        'flex items-center gap-2.5 h-[34px] px-2.5 rounded-lg text-[13px] font-medium transition-colors text-left w-full cursor-pointer',
                        isActive
                          ? 'bg-[#6E56CF]/[0.14] text-[#cbbeff] border border-[#6E56CF]/30'
                          : 'text-[#A0A0AB] hover:text-[#EDEDEF] hover:bg-[#18181B] border border-transparent'
                      )}
                    >
                      <Icon
                        className={cn(
                          'w-4 h-4 shrink-0',
                          isActive ? 'text-[#cbbeff]' : 'text-[#6E6E78]'
                        )}
                      />
                      <span className="truncate">{item.label}</span>
                    </button>
                  )
                })}
              </div>
            )
          })}
        </nav>
      </div>

      {/* Sidebar Bottom: User Profile Info */}
      <div className="pt-3 border-t border-[#26262A] flex items-center justify-between px-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-7 h-7 rounded-full bg-[#18181B] border border-[#26262A] flex items-center justify-center font-mono text-[11px] font-medium text-[#EDEDEF] shrink-0">
            {userInitials}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[13px] font-medium text-[#EDEDEF] truncate leading-tight">
              {userName}
            </span>
            <span className="text-[11px] text-[#6E6E78] truncate leading-tight font-mono">
              {role}
            </span>
          </div>
        </div>
        <div className="shrink-0 flex items-center">
          <UserButton />
        </div>
      </div>
    </aside>
  )
}
