import React from 'react'
import Link from 'next/link'
import { FileQuestion, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EDEDEF] flex items-center justify-center p-4 selection:bg-[#6E56CF] selection:text-white font-sans antialiased">
      <div className="w-full max-w-[420px] bg-[#121214] border border-[#26262A] rounded-xl p-6 flex flex-col items-center text-center shadow-2xl">
        <div className="w-10 h-10 rounded-xl bg-[#26262A] flex items-center justify-center text-[#A0A0AB] mb-4">
          <FileQuestion className="w-5 h-5" />
        </div>

        <h1 className="text-[20px] font-semibold text-[#EDEDEF] tracking-tight font-mono">
          404 · Page Not Found
        </h1>
        <p className="text-[13px] text-[#A0A0AB] mt-1.5 leading-relaxed">
          The requested resource could not be found or you do not have permission to view it.
        </p>

        <div className="mt-6 w-full">
          <Link href="/" className="w-full block">
            <Button
              variant="default"
              className="w-full h-9 text-[13px] bg-[#6E56CF] hover:bg-[#7C66DC] text-white gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Dashboard</span>
            </Button>
          </Link>
        </div>

        <div className="w-full border-t border-[#26262A] mt-6 pt-4 flex items-center justify-center text-[11px] text-[#6E6E78]">
          Cohort &apos;26 Placement Hub · MCA Nirma University
        </div>
      </div>
    </div>
  )
}
