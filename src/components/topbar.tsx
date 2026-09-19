'use client'

import React from 'react'
import { Search, Bell, Menu, ArrowLeftRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface TopbarProps {
  breadcrumbs?: { label: string; href?: string }[]
  role?: 'SPC' | 'STUDENT'
  onRoleToggle?: () => void
  onMenuToggle?: () => void
  isMobileMenuOpen?: boolean
}

export function Topbar({
  breadcrumbs = [{ label: 'Dashboard' }],
  role = 'STUDENT',
  onRoleToggle,
  onMenuToggle,
  isMobileMenuOpen = false,
}: TopbarProps) {
  return (
    <header className="sticky top-0 z-20 h-[56px] w-full bg-[#0A0A0B] border-b border-[#26262A] px-3 sm:px-4 lg:px-8 flex items-center justify-between gap-2">
      {/* Left: Breadcrumbs */}
      <div className="flex min-w-0 flex-1 items-center gap-2 text-[13px]">
        <button
          type="button"
          aria-label={isMobileMenuOpen ? 'Close navigation' : 'Open navigation'}
          aria-expanded={isMobileMenuOpen}
          onClick={onMenuToggle}
          className="md:hidden h-8 w-8 shrink-0 rounded-lg text-[#A0A0AB] hover:bg-[#18181B] hover:text-[#EDEDEF]"
        >
          <Menu className="w-4 h-4" />
        </button>
        <div className="flex min-w-0 items-center gap-2">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={crumb.label}>
              {idx > 0 && (
                <span className="shrink-0 text-[#6E6E78] font-mono text-[11px]">/</span>
              )}
              <span
                className={cn(
                  idx === breadcrumbs.length - 1
                    ? 'min-w-0 max-w-[32vw] truncate text-[#EDEDEF] font-medium sm:max-w-none'
                    : 'text-[#6E6E78]',
                  idx > 0 && 'hidden sm:inline'
                )}
              >
                {crumb.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Right Controls Cluster */}
      <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
        {/* Role toggle button for testing */}
        {onRoleToggle && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRoleToggle}
            className="h-8 w-8 shrink-0 sm:w-auto sm:px-3 text-[11px] font-mono border-[#34343A] hover:border-[#6E56CF] text-[#A0A0AB] hover:text-[#EDEDEF]"
            title={`Switch to ${role === 'SPC' ? 'Student' : 'SPC'} view`}
          >
            <ArrowLeftRight className="w-4 h-4 sm:mr-1.5" />
            <span className="hidden sm:inline">Switch to {role === 'SPC' ? 'Student' : 'SPC'} View</span>
          </Button>
        )}

        {/* Search input */}
        <div className="relative hidden md:flex items-center w-[180px] xl:w-[200px]">
          <Search className="absolute left-2.5 text-[#6E6E78] w-3.5 h-3.5 pointer-events-none" />
          <input
            className="h-8 w-full bg-[#18181B] border border-[#26262A] rounded-lg pl-8 pr-11 text-[12px] text-[#EDEDEF] placeholder-[#6E6E78] focus:outline-none focus:border-[#6E56CF] transition-colors"
            placeholder="Search..."
            type="text"
            aria-label="Search"
          />
          <kbd className="absolute right-2 px-1.5 py-0.5 rounded border border-[#26262A] bg-[#121214] font-mono text-[10px] text-[#6E6E78] leading-none select-none">
            ⌘K
          </kbd>
        </div>

        {/* Ghost Bell Button */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-[#6E6E78] hover:text-[#EDEDEF] hover:bg-[#18181B] rounded-lg"
          title="Notifications"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </Button>
      </div>
    </header>
  )
}
