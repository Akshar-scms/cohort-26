import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[10px] text-[13px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6E56CF] disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default:
          'bg-[#6E56CF] text-white hover:bg-[#7C66DC] active:scale-[0.99] border-none shadow-none',
        secondary:
          'bg-[#121214] text-[#EDEDEF] border border-[#26262A] hover:bg-[#18181B] hover:border-[#34343A]',
        outline:
          'bg-transparent text-[#A0A0AB] border border-[#26262A] hover:bg-[#18181B] hover:text-[#EDEDEF] hover:border-[#34343A]',
        ghost:
          'bg-transparent text-[#A0A0AB] hover:bg-[#18181B] hover:text-[#EDEDEF]',
        destructive:
          'bg-transparent text-[#E5484D] border border-[#E5484D]/40 hover:bg-[#E5484D]/10',
        link: 'text-[#6E56CF] underline-offset-4 hover:underline p-0 h-auto',
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-7 rounded-lg px-2.5 text-xs',
        lg: 'h-10 rounded-xl px-6 text-sm',
        icon: 'h-8 w-8',
        'icon-sm': 'h-7 w-7 rounded-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
