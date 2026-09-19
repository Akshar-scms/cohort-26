'use client'

import React, { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useUser, SignOutButton } from '@clerk/nextjs'
import {
  LayoutDashboard,
  Users,
  Calendar,
  CalendarCheck,
  Building2,
  FileCheck2,
  Award,
  Video,
  LogOut,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  href: string
  spcOnly?: boolean
  studentOnly?: boolean
}

interface NavGroup {
  group: string
  items: NavItem[]
}

interface SidebarProps {
  currentTab?: string
  onTabChange?: (tab: string) => void
  role?: 'SPC' | 'STUDENT'
  mobileOpen?: boolean
  onMobileOpenChange?: (open: boolean) => void
}

export function Sidebar({
  currentTab = 'dashboard',
  onTabChange,
  role = 'STUDENT',
  mobileOpen = false,
  onMobileOpenChange,
}: SidebarProps) {
  const pathname = usePathname()
  const { user } = useUser()

  const userName = user?.fullName || user?.firstName || 'Aarav Shah'
  const userInitials =
    user?.firstName && user?.lastName
      ? `${user.firstName[0]}${user.lastName[0]}`
      : userName.slice(0, 2).toUpperCase()

  const navItems: NavGroup[] = [
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
          label: 'Students Directory',
          icon: Users,
          href: '#',
          spcOnly: true,
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

  const handleTabChange = (tab: string) => {
    onTabChange?.(tab)
    onMobileOpenChange?.(false)
  }

  // Escape key closes mobile drawer + body scroll lock
  useEffect(() => {
    if (!mobileOpen) return
    document.body.classList.add('nav-open')
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onMobileOpenChange?.(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.classList.remove('nav-open')
    }
  }, [mobileOpen, onMobileOpenChange])

  return (
    <>
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => onMobileOpenChange?.(false)}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm md:hidden"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[260px] max-w-[85vw] bg-[#121214] border-r border-[#26262A] flex flex-col justify-between p-3 select-none translate-x-[-100%] transition-transform duration-200 md:z-30 md:w-[240px] md:max-w-none md:translate-x-0',
          mobileOpen && 'translate-x-0'
        )}
      >
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => onMobileOpenChange?.(false)}
          className="md:hidden absolute right-3 top-3 p-2 rounded-lg text-[#A0A0AB] hover:bg-[#18181B] hover:text-[#EDEDEF]"
        >
          <X className="w-4 h-4" />
        </button>

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
                      onClick={() => handleTabChange(item.id)}
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
        <SignOutButton redirectUrl="/">
          <button
            type="button"
            className="p-1.5 rounded-lg text-[#6E6E78] hover:text-[#E5484D] hover:bg-[#18181B] transition-colors shrink-0 cursor-pointer"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </SignOutButton>
      </div>
    </aside>
    </>
  )
}
