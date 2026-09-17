import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 h-6 text-[12px] font-medium transition-colors select-none font-sans',
  {
    variants: {
      variant: {
        default: 'border-[#26262A] bg-transparent text-[#EDEDEF]',
        secondary: 'border-[#34343A] bg-[#18181B] text-[#EDEDEF]',
        outline: 'border-[#26262A] bg-transparent text-[#A0A0AB]',
        primary: 'border-[#6E56CF]/40 bg-[#6E56CF]/10 text-[#6E56CF]',
        success: 'border-[#30A46C]/40 bg-transparent text-[#EDEDEF]',
        warning: 'border-[#FFB224]/40 bg-transparent text-[#EDEDEF]',
        danger: 'border-[#E5484D]/40 bg-transparent text-[#A0A0AB]',
        info: 'border-[#0091FF]/40 bg-transparent text-[#EDEDEF]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dotColor?: string
}

function Badge({ className, variant, dotColor, children, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {dotColor && (
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: dotColor }}
        />
      )}
      {children}
    </div>
  )
}

export { Badge, badgeVariants }
