import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-9 w-full rounded-[10px] border border-[#26262A] bg-[#18181B] px-3 py-1.5 text-[14px] text-[#EDEDEF] placeholder:text-[#6E6E78] transition-colors hover:border-[#34343A] focus:border-[#6E56CF] focus:outline-none focus:ring-1 focus:ring-[#6E56CF] disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = 'Input'

export { Input }
