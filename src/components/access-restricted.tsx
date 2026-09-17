'use client'

import { SignOutButton } from '@clerk/nextjs'
import { ShieldAlert, LogOut, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface AccessRestrictedProps {
  email?: string | null
}

export function AccessRestricted({ email }: AccessRestrictedProps) {
  return (
    <div className="min-h-screen bg-dot-grid flex flex-col items-center justify-center p-4">
      <Card className="w-full max-w-[420px] bg-[#121214] border border-[#26262A] rounded-[12px] p-6 text-center">
        <div className="mx-auto w-12 h-12 rounded-full bg-[#E5484D]/10 border border-[#E5484D]/30 flex items-center justify-center text-[#E5484D] mb-4">
          <ShieldAlert className="w-6 h-6" />
        </div>

        <h1 className="text-[20px] font-semibold text-[#EDEDEF] tracking-tight mb-2">
          Access Restricted
        </h1>

        <p className="text-[13px] text-[#A0A0AB] leading-relaxed mb-5">
          This portal is strictly reserved for the MCA &apos;26 Batch at Nirma University.
          Only email addresses ending with{' '}
          <span className="text-[#EDEDEF] font-mono font-medium">@nirmauni.ac.in</span>{' '}
          (or verified exceptions) are permitted.
        </p>

        {email && (
          <div className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-[#18181B] border border-[#26262A] text-[12px] font-mono text-[#A0A0AB] mb-6">
            <Mail className="w-3.5 h-3.5 text-[#6E6E78]" />
            <span className="truncate">{email}</span>
          </div>
        )}

        <div className="flex flex-col gap-3">
          <SignOutButton redirectUrl="/">
            <Button variant="default" className="w-full h-10 gap-2">
              <LogOut className="w-4 h-4" />
              Sign in with institutional account
            </Button>
          </SignOutButton>
        </div>

        <div className="mt-6 pt-4 border-t border-[#26262A] flex items-center justify-between text-[11px] text-[#6E6E78]">
          <span>Placement Hub · MCA &apos;26</span>
          <span>Nirma University</span>
        </div>
      </Card>
    </div>
  )
}
