'use client'

import React from 'react'
import { SignInButton } from '@clerk/nextjs'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  Award,
  Video,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import VinayCodesLogo from '../../../public/vc.png';
import Link from 'next/link'

export function LoginScreenView() {
  return (
    <div className="relative min-h-screen bg-[#0A0A0B] text-[#EDEDEF] flex flex-col justify-between selection:bg-[#6E56CF] selection:text-white font-sans antialiased overflow-hidden">
      {/* Ambient background glow & subtle radial light */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[#6E56CF]/12 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[400px] bg-[#0091FF]/8 rounded-full blur-[140px]" />
        <div className="absolute inset-0 bg-[radial-gradient(#26262A_1px,transparent_1px)] [background-size:24px_24px] opacity-25" />
      </div>

      {/* Top Navbar Header */}
      <header className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-[#6E56CF] flex items-center justify-center text-white font-semibold text-[15px] shadow-lg shadow-[#6E56CF]/25">
            P
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-semibold text-[#EDEDEF] tracking-tight">
              Placement Hub
            </span>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-[#18181B] border border-[#26262A] text-[#A0A0AB]">
              MCA &apos;26
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-2 text-[11px] font-mono text-[#6E6E78] bg-[#121214]/80 backdrop-blur border border-[#26262A] px-3 py-1.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#30A46C] animate-pulse" />
          <span>Portal Live · Nirma University</span>
        </div>
      </header>

      {/* Center Hero Section */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121214] border border-[#6E56CF]/30 text-[#cbbeff] text-[12px] font-medium mb-6 shadow-sm shadow-[#6E56CF]/10">
          <Sparkles className="w-3.5 h-3.5 text-[#6E56CF]" />
          <span>Student Placement Cell · Cohort 2026–2028</span>
        </div>

        {/* Big Aesthetic Title */}
        <h1 className="text-[38px] sm:text-[54px] md:text-[62px] font-bold tracking-tight leading-[1.1] text-[#EDEDEF] max-w-3xl">
          Next-Gen Placement &amp; <br className="hidden sm:inline" />
          <span className="bg-gradient-to-r from-[#cbbeff] via-[#9E8CFC] to-[#0091FF] bg-clip-text text-transparent">
            Mentoring Command Center
          </span>
        </h1>

        {/* Subtitle / Description */}
        <p className="mt-5 text-[15px] sm:text-[17px] text-[#A0A0AB] max-w-2xl leading-relaxed font-normal">
          Accelerate your campus career with 1-on-1 offline SPC mentoring, verified technical skill assessments, and real-time recruitment tracking.
        </p>

        {/* Interactive Feel-Good CTA Button */}
        <div className="mt-9 flex flex-col items-center gap-3">
          <SignInButton mode="modal">
            <button className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6E56CF] to-[#5842C3] hover:from-[#7C66DC] hover:to-[#6E56CF] text-white text-[15px] font-medium shadow-xl shadow-[#6E56CF]/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer border border-[#8E7CF7]/30">
              <span className="tracking-wide">Sign In to Placement Portal</span>
              <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </SignInButton>

          <span className="text-[12px] text-[#6E6E78] font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#30A46C]" />
            Restricted to verified <strong className="text-[#A0A0AB]">@nirmauni.ac.in</strong> accounts
          </span>
        </div>

        {/* Feature Highlights Glass Strip */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl">
          <div className="p-3.5 rounded-xl bg-[#121214]/70 border border-[#26262A] backdrop-blur-sm flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#6E56CF]/15 border border-[#6E56CF]/30 flex items-center justify-center text-[#cbbeff] shrink-0">
              <CalendarCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#EDEDEF]">15-min Offline Slots</div>
              <div className="text-[11px] text-[#6E6E78]">1-on-1 guidance with SPC</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121214]/70 border border-[#26262A] backdrop-blur-sm flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#FFB224]/15 border border-[#FFB224]/30 flex items-center justify-center text-[#FFB224] shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#EDEDEF]">Skill Verification</div>
              <div className="text-[11px] text-[#6E6E78]">Verified technical badges</div>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#121214]/70 border border-[#26262A] backdrop-blur-sm flex items-center gap-3 text-left">
            <div className="w-8 h-8 rounded-lg bg-[#0091FF]/15 border border-[#0091FF]/30 flex items-center justify-center text-[#0091FF] shrink-0">
              <Video className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[13px] font-medium text-[#EDEDEF]">Live Console</div>
              <div className="text-[11px] text-[#6E6E78]">Real-time mock interview logs</div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#26262A]/60 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-center text-[12px] text-[#6E6E78]">
        <div className='flex items-center gap-2'>
          © 2026 Vinay Codes made with LLMs and ❤️ <Link href="https://vinay-th.tech" target="_blank" rel="noopener noreferrer"><Image width={80} height={80} src={VinayCodesLogo} alt="Vinay Codes Logo" /></Link>
        </div>
        <div className="font-mono text-[11px]">
          ITNU MCA Batch 2026–2028 Placement Hub
        </div>
      </footer>
    </div>
  )
}
