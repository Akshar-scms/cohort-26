import React from 'react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#0A0A0B] text-[#EDEDEF] flex">
      {/* Sidebar Skeleton */}
      <aside className="fixed top-0 left-0 h-screen w-[240px] z-30 hidden md:flex flex-col justify-between p-3 animate-pulse">
        <div className="flex flex-col gap-5">
          <div className="flex items-center gap-2.5 px-2 pt-1 pb-1">
            <div className="w-[28px] h-[28px] rounded-lg bg-[#26262A]" />
            <div className="flex flex-col gap-1">
              <div className="w-24 h-3.5 bg-[#26262A] rounded" />
              <div className="w-16 h-2.5 bg-[#26262A] rounded" />
            </div>
          </div>
          <div className="flex flex-col gap-3 mt-4 px-2">
            <div className="w-14 h-2.5 bg-[#26262A] rounded" />
            <div className="w-full h-8 bg-[#18181B] rounded-lg" />
            <div className="w-full h-8 bg-[#18181B] rounded-lg" />
            <div className="w-14 h-2.5 bg-[#26262A] rounded mt-2" />
            <div className="w-full h-8 bg-[#18181B] rounded-lg" />
            <div className="w-full h-8 bg-[#18181B] rounded-lg" />
          </div>
        </div>
        <div className="p-2 border-t border-[#26262A] flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-[#26262A]" />
          <div className="flex flex-col gap-1">
            <div className="w-20 h-3 bg-[#26262A] rounded" />
            <div className="w-28 h-2 bg-[#26262A] rounded" />
          </div>
        </div>
      </aside>

      {/* Main Content Area Skeleton */}
      <div className="flex-1 flex flex-col min-h-screen min-w-0 bg-[#0A0A0B] md:pl-[240px]">
        {/* Topbar Skeleton */}
        <header className="h-12 border-b border-[#26262A] px-4 flex items-center justify-between bg-[#121214]/60 backdrop-blur-md sm:px-6">
          <div className="w-32 h-4 bg-[#26262A] rounded animate-pulse" />
          <div className="flex items-center gap-3">
            <div className="w-24 h-6 bg-[#26262A] rounded-full animate-pulse" />
            <div className="w-7 h-7 bg-[#26262A] rounded-full animate-pulse" />
          </div>
        </header>

        {/* Dashboard Skeleton */}
        <main className="flex-1 w-full max-w-[1200px] mx-auto px-4 py-6 flex flex-col gap-6 animate-pulse sm:px-6 sm:py-8 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-2">
              <div className="w-48 h-7 bg-[#18181B] rounded-md" />
              <div className="w-72 h-3.5 bg-[#18181B] rounded-md" />
            </div>
            <div className="w-32 h-4 bg-[#18181B] rounded-md" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-[126px] bg-[#121214] border border-[#26262A] rounded-xl p-5 flex flex-col justify-between"
              >
                <div className="w-24 h-3 bg-[#26262A] rounded" />
                <div className="w-20 h-6 bg-[#26262A] rounded" />
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-2">
            <div className="lg:col-span-2 h-[320px] bg-[#121214] border border-[#26262A] rounded-xl p-6" />
            <div className="h-[320px] bg-[#121214] border border-[#26262A] rounded-xl p-6" />
          </div>
        </main>
      </div>
    </div>
  )
}
