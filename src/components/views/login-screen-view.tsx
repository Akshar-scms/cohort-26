'use client'

import React, { useRef, useState } from 'react'
import { SignInButton } from '@clerk/nextjs'
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CalendarCheck,
  Award,
  Video,
} from 'lucide-react'
import Image from 'next/image'
import VinayCodesLogo from '../../../public/vc.png'
import Link from 'next/link'
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  animate,
  useInView,
} from 'framer-motion'
import { useEffect } from 'react'

// ─── Aurora background orbs (slow animated gradient blobs) ───────────────────
const AURORA_COLORS = ['#6E56CF', '#5842C3', '#0091FF', '#6E56CF', '#9E8CFC']

function AuroraBackground() {
  const color = useMotionValue(AURORA_COLORS[0])

  useEffect(() => {
    animate(color, AURORA_COLORS, {
      ease: 'easeInOut',
      duration: 10,
      repeat: Infinity,
      repeatType: 'mirror',
    })
  }, [color])

  const background = useMotionTemplate`
    radial-gradient(ellipse 80% 50% at 50% -20%, ${color}18 0%, transparent 60%),
    radial-gradient(ellipse 60% 40% at 80% 80%, #0091FF0A 0%, transparent 55%),
    radial-gradient(ellipse 50% 35% at 10% 70%, #6E56CF08 0%, transparent 55%)
  `

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ background }}
    />
  )
}

// ─── Floating particles ───────────────────────────────────────────────────────
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 2 + 1,
  duration: Math.random() * 8 + 6,
  delay: Math.random() * 4,
}))

function FloatingParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {PARTICLES.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#6E56CF]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            opacity: 0,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0, 0.4, 0],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

// ─── Animated shimmer text ────────────────────────────────────────────────────
function ShimmerText({ children, className }: { children: React.ReactNode; className?: string }) {
  const [hovered, setHovered] = useState(false)
  return (
    <span
      className={`relative inline-block ${className ?? ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.span
        className="bg-gradient-to-r from-[#cbbeff] via-[#ffffff] to-[#9E8CFC] bg-clip-text text-transparent"
        style={{ backgroundSize: '200% 100%' }}
        animate={hovered ? { backgroundPosition: ['0% 50%', '200% 50%'] } : { backgroundPosition: '0% 50%' }}
        transition={{ duration: 0.8, ease: 'easeInOut' }}
      >
        {children}
      </motion.span>
    </span>
  )
}

// ─── Staggered word animation ─────────────────────────────────────────────────
function AnimatedTitle() {
  const ref = useRef<HTMLHeadingElement>(null)
  const inView = useInView(ref, { once: true, margin: '-50px' })

  const line1 = 'Next-Gen Placement &'.split(' ')
  const line2 = 'Mentoring Command Center'.split(' ')

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  }
  const wordVariants = {
    hidden: { opacity: 0, y: 24, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: 'easeOut' as const },
    },
  }

  return (
    <motion.h1
      ref={ref}
      className="text-[38px] sm:text-[54px] md:text-[62px] font-bold tracking-tight leading-[1.12] text-[#EDEDEF] max-w-3xl"
      variants={containerVariants}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
    >
      {/* Line 1 */}
      <span className="block">
        {line1.map((word, i) => (
          <motion.span key={i} variants={wordVariants} className="inline-block mr-[0.25em]">
            {word === '&' ? <>&amp;</> : word}
          </motion.span>
        ))}
      </span>
      {/* Line 2 – gradient shimmer */}
      <span className="block mt-1">
        {line2.map((word, i) => (
          <motion.span
            key={i}
            variants={wordVariants}
            className="inline-block mr-[0.25em] bg-gradient-to-r from-[#cbbeff] via-[#9E8CFC] to-[#0091FF] bg-clip-text text-transparent"
          >
            {word}
          </motion.span>
        ))}
      </span>
    </motion.h1>
  )
}

// ─── Feature card with hover glow border ─────────────────────────────────────
interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  desc: string
  accentColor: string
  delay?: number
}

function FeatureCard({ icon, title, desc, accentColor, delay = 0 }: FeatureCardProps) {
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - rect.left)
    mouseY.set(e.clientY - rect.top)
  }

  const background = useMotionTemplate`radial-gradient(180px circle at ${mouseX}px ${mouseY}px, ${accentColor}18, transparent 80%)`

  return (
    <motion.div
      ref={ref}
      className="group relative p-3.5 rounded-xl bg-[#121214]/80 border border-[#26262A] backdrop-blur-sm flex items-center gap-3 text-left overflow-hidden cursor-default"
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      whileHover={{ borderColor: `${accentColor}40`, y: -2 }}
    >
      {/* Spotlight glow */}
      <motion.div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background }} />

      <div
        className="relative w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border"
        style={{ backgroundColor: `${accentColor}18`, borderColor: `${accentColor}30`, color: accentColor }}
      >
        {icon}
      </div>
      <div className="relative">
        <div className="text-[13px] font-medium text-[#EDEDEF]">{title}</div>
        <div className="text-[11px] text-[#6E6E78] mt-0.5">{desc}</div>
      </div>
    </motion.div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────
export function LoginScreenView() {
  const heroRef = useRef<HTMLDivElement>(null)
  const heroMouseX = useMotionValue(0)
  const heroMouseY = useMotionValue(0)

  function handleHeroMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const rect = heroRef.current?.getBoundingClientRect()
    if (!rect) return
    heroMouseX.set(e.clientX - rect.left)
    heroMouseY.set(e.clientY - rect.top)
  }

  // Moving spotlight following the cursor across the hero
  const heroSpotlight = useMotionTemplate`radial-gradient(600px circle at ${heroMouseX}px ${heroMouseY}px, rgba(110,86,207,0.06), transparent 60%)`

  return (
    <div
      ref={heroRef}
      className="relative min-h-screen bg-[#0A0A0B] text-[#EDEDEF] flex flex-col justify-between selection:bg-[#6E56CF] selection:text-white font-sans antialiased overflow-hidden"
      onMouseMove={handleHeroMouseMove}
    >
      {/* ── Layered background ── */}
      {/* 1. Aurora animated blobs */}
      <AuroraBackground />

      {/* 2. Dot-grid pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(#26262A_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.22]" />

      {/* 3. Cursor-following spotlight */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: heroSpotlight }} />

      {/* 4. Floating particles */}
      <FloatingParticles />

      {/* 5. Bottom vignette */}
      <div className="pointer-events-none absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-[#0A0A0B] to-transparent" />

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <motion.header
        className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between"
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <div className="flex items-center gap-3">
          <motion.div
            className="w-8 h-8 rounded-xl bg-[#6E56CF] flex items-center justify-center text-white font-semibold text-[15px]"
            whileHover={{ scale: 1.08, rotate: 4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          >
            P
          </motion.div>
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
      </motion.header>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12 text-center max-w-4xl mx-auto">

        {/* Pill badge */}
        <motion.div
          className="inline-flex -translate-x-1 items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#121214] border border-[#6E56CF]/30 text-[#cbbeff] text-[12px] font-medium mb-8 shadow-sm shadow-[#6E56CF]/10"
          initial={{ opacity: 0, scale: 0.88, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ scale: 1.04, borderColor: 'rgba(110,86,207,0.55)' }}
        >
          <motion.div
            animate={{ rotate: [0, 15, -10, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', repeatDelay: 2 }}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#6E56CF]" />
          </motion.div>
          <span>Student Placement Cell · Cohort 2026–2028</span>
        </motion.div>

        {/* Title */}
        <AnimatedTitle />

        {/* Subtitle */}
        <motion.p
          className="mt-5 text-[15px] sm:text-[17px] text-[#A0A0AB] max-w-2xl leading-relaxed font-normal"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          Accelerate your campus career with 1-on-1 offline SPC mentoring, verified technical skill assessments, and real-time recruitment tracking.
        </motion.p>

        {/* CTA */}
        <motion.div
          className="mt-9 flex flex-col items-center gap-3"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <SignInButton mode="modal">
            <motion.button
              className="group relative w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#6E56CF] to-[#5842C3] text-white text-[15px] font-medium cursor-pointer border border-[#8E7CF7]/25 overflow-hidden"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              transition={{ type: 'spring', stiffness: 300, damping: 18 }}
            >
              {/* Shine sweep on hover */}
              <span className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <span className="relative tracking-wide">Sign In to Placement Portal</span>
              <ArrowRight className="relative w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
            </motion.button>
          </SignInButton>

          <motion.span
            className="text-[12px] text-[#6E6E78] font-mono flex items-center gap-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-[#30A46C]" />
            Restricted to verified <strong className="text-[#A0A0AB]">@nirmauni.ac.in</strong> accounts
          </motion.span>
        </motion.div>

        {/* Feature Cards */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full max-w-2xl">
          <FeatureCard
            icon={<CalendarCheck className="w-4 h-4" />}
            title="15-min Offline Slots"
            desc="1-on-1 guidance with SPC"
            accentColor="#6E56CF"
            delay={0.8}
          />
          <FeatureCard
            icon={<Award className="w-4 h-4" />}
            title="Skill Verification"
            desc="Verified technical badges"
            accentColor="#FFB224"
            delay={0.9}
          />
          <FeatureCard
            icon={<Video className="w-4 h-4" />}
            title="Live Console"
            desc="Real-time mock interview logs"
            accentColor="#0091FF"
            delay={1.0}
          />
        </div>
      </main>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <motion.footer
        className="relative z-10 w-full max-w-6xl mx-auto px-6 py-6 border-t border-[#26262A]/60 flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-3 text-center text-[12px] text-[#6E6E78]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.1 }}
      >
        <div className="flex items-center gap-2">
          © 2026 Vinay Codes made with LLMs and ❤️
          <Link href="https://vinay-th.tech" target="_blank" rel="noopener noreferrer">
            <Image width={80} height={80} src={VinayCodesLogo} alt="Vinay Codes Logo" />
          </Link>
        </div>
        <div className="font-mono text-[11px]">
          ITNU MCA Batch 2026–2028 Placement Hub
        </div>
      </motion.footer>
    </div>
  )
}
