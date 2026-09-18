'use client'

import React from 'react'
import { Search, Bell } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface TopbarProps {
  breadcrumbs?: { label: string; href?: string }[]
  role?: 'SPC' | 'STUDENT'
  onRoleToggle?: () => void
}

export function Topbar({
  breadcrumbs = [{ label: 'Dashboard' }],
  role = 'STUDENT',
  onRoleToggle,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 h-[56px] w-full bg-[#0A0A0B] border-b border-[#26262A] px-8 flex items-center justify-between">
      {/* Left: Breadcrumbs */}
      <div className="flex items-center gap-2 text-[13px]">
        {breadcrumbs.map((crumb, idx) => (
          <React.Fragment key={crumb.label}>
            {idx > 0 && (
              <span className="text-[#6E6E78] font-mono text-[11px]">/</span>
            )}
            <span
              className={
                idx === breadcrumbs.length - 1
                  ? 'text-[#EDEDEF] font-medium'
                  : 'text-[#6E6E78]'
              }
            >
              {crumb.label}
            </span>
          </React.Fragment>
        ))}
      </div>

      {/* Right Controls Cluster */}
      <div className="flex items-center gap-3">
        {/* Role toggle button for testing */}
        {onRoleToggle && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRoleToggle}
            className="h-7 text-[11px] font-mono border-[#34343A] hover:border-[#6E56CF] text-[#A0A0AB] hover:text-[#EDEDEF]"
          >
            Switch to {role === 'SPC' ? 'Student' : 'SPC'} View
          </Button>
        )}

        {/* 200px search input with ⌘K badge */}
        <div className="relative flex items-center w-[200px]">
          <Search className="absolute left-2.5 text-[#6E6E78] w-3.5 h-3.5 pointer-events-none" />
          <input
            className="h-8 w-full bg-[#18181B] border border-[#26262A] rounded-lg pl-8 pr-11 text-[12px] text-[#EDEDEF] placeholder-[#6E6E78] focus:outline-none focus:border-[#6E56CF] transition-colors"
            placeholder="Search..."
            type="text"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 rounded border border-[#26262A] bg-[#121214] font-mono text-[10px] text-[#6E6E78] leading-none select-none">
            ⌘K
          </kbd>
        </div>

        {/* Ghost Bell Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-[#6E6E78] hover:text-[#EDEDEF] hover:bg-[#18181B] rounded-lg"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
