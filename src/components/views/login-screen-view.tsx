'use client'

import React, { useState } from 'react'
import { SignInButton, SignUpButton } from '@clerk/nextjs'
import { ShieldCheck, ArrowRight, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function LoginScreenView() {
  const [emailInput, setEmailInput] = useState('')

  return (
    <div className="bg-dot-grid min-h-screen flex flex-col items-center justify-center p-4 selection:bg-[#6E56CF] selection:text-white font-sans antialiased text-[#EDEDEF]">
      {/* Main Login Card (Linear/Vercel Aesthetic: 380px wide, #121214 bg, 1px #26262A border) */}
      <main className="w-full max-w-[380px] bg-[#121214] border border-[#26262A] rounded-[12px] p-6 flex flex-col items-center">
        {/* 1. Monogram Icon */}
        <div
          aria-label="Placement Hub Monogram"
          className="w-8 h-8 rounded-[8px] bg-[#6E56CF] flex items-center justify-center select-none"
        >
          <span className="text-white text-[16px] font-semibold leading-none">
            P
          </span>
        </div>

        {/* 2. Brand Title */}
        <h1 className="text-[20px] leading-[26px] font-semibold text-[#EDEDEF] mt-3 tracking-tight text-center">
          Placement Hub
        </h1>

        {/* 3. Subtext */}
        <p className="text-[13px] text-[#A0A0AB] mt-1 text-center">
          Sign in to continue
        </p>

        {/* Form Section */}
        <div className="w-full mt-6 flex flex-col gap-3">
          {/* Institutional Domain Warning / Badge */}
          <div className="p-2.5 rounded-lg bg-[#18181B] border border-[#26262A] flex items-start gap-2 text-[11px] text-[#A0A0AB] leading-tight">
            <Lock className="w-3.5 h-3.5 text-[#6E56CF] shrink-0 mt-0.5" />
            <span>
              Restricted to verified{' '}
              <strong className="text-[#EDEDEF] font-mono">@nirmauni.ac.in</strong>{' '}
              institutional accounts.
            </span>
          </div>

          <div className="flex flex-col w-full text-left">
            <label
              className="text-[11px] uppercase tracking-wider text-[#6E6E78] font-medium"
              htmlFor="email"
            >
              Institute Email
            </label>
            <input
              id="email"
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="name@nirmauni.ac.in"
              className="w-full h-9 bg-[#18181B] border border-[#26262A] rounded-[10px] text-[13px] text-[#EDEDEF] placeholder-[#6E6E78] px-3 mt-1 transition-colors hover:border-[#34343A] focus:outline-none focus:border-[#6E56CF] font-sans"
            />
          </div>

          {/* Clerk Integrated Sign-In Trigger */}
          <div className="mt-2 flex flex-col gap-2">
            <SignInButton mode="modal">
              <Button
                variant="default"
                className="w-full h-10 text-[14px] font-medium gap-2"
              >
                <span>Continue with Nirma Account</span>
                <ArrowRight className="w-4 h-4" />
              </Button>
            </SignInButton>

            <SignUpButton mode="modal">
              <Button
                variant="ghost"
                className="w-full h-8 text-[12px] text-[#A0A0AB] hover:text-[#EDEDEF]"
              >
                New user? Request enrollment
              </Button>
            </SignUpButton>
          </div>
        </div>

        {/* Hairline Divider & Footer Subtext */}
        <div className="w-full border-t border-[#26262A] mt-6 pt-4 flex items-center justify-center">
          <span className="text-[11px] text-[#6E6E78] select-none font-sans">
            MCA &apos;26 · Nirma University
          </span>
        </div>
      </main>

      {/* System Status Micro-Indicator */}
      <aside
        aria-label="Portal System Operational"
        className="mt-6 flex items-center gap-2 text-[#6E6E78] text-[11px] select-none font-sans"
      >
        <span
          aria-hidden="true"
          className="w-1.5 h-1.5 rounded-full bg-[#30A46C] shrink-0"
        />
        <span>MCA Placement Portal · All systems operational</span>
      </aside>
    </div>
  )
}
