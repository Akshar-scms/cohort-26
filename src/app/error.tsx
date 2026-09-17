'use client'

import React, { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Unhandled app runtime error:', error)
  }, [error])

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EDEDEF] flex items-center justify-center p-4 selection:bg-[#6E56CF] selection:text-white font-sans antialiased">
      <div className="w-full max-w-[420px] bg-[#121214] border border-[#26262A] rounded-xl p-6 flex flex-col items-center text-center shadow-2xl">
        <div className="w-10 h-10 rounded-xl bg-[#E5484D]/10 border border-[#E5484D]/20 flex items-center justify-center text-[#E5484D] mb-4">
          <AlertCircle className="w-5 h-5" />
        </div>

        <h1 className="text-[18px] font-semibold text-[#EDEDEF] tracking-tight">
          Application Exception
        </h1>
        <p className="text-[13px] text-[#A0A0AB] mt-1.5 leading-relaxed">
          An unexpected error occurred while loading this view. The issue has been logged for review.
        </p>

        {error.message && (
          <div className="w-full bg-[#18181B] border border-[#26262A] rounded-lg p-3 my-4 text-left font-mono text-[11px] text-[#E5484D] overflow-x-auto">
            {error.message}
          </div>
        )}

        <div className="flex items-center gap-3 w-full mt-2">
          <Button
            variant="outline"
            onClick={() => {
              window.location.href = '/'
            }}
            className="flex-1 h-9 text-[13px] border-[#26262A] bg-[#18181B] hover:bg-[#202024] text-[#EDEDEF]"
          >
            <Home className="w-3.5 h-3.5 mr-2" />
            Home
          </Button>
          <Button
            variant="default"
            onClick={() => reset()}
            className="flex-1 h-9 text-[13px] bg-[#6E56CF] hover:bg-[#7C66DC] text-white"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-2" />
            Try again
          </Button>
        </div>

        <div className="w-full border-t border-[#26262A] mt-6 pt-4 flex items-center justify-center text-[11px] text-[#6E6E78]">
          Cohort &apos;26 Placement Hub · MCA Nirma University
        </div>
      </div>
    </div>
  )
}
