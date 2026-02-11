import * as React from 'react'
import { cn } from '../lib/utils'

interface HeadingTitleProps {
  title: string
  subtitle?: string
  children?: React.ReactNode
  className?: string
  titleClassName?: string
  subtitleClassName?: string
  contentClassName?: string
}

function HeadingTitle({
  title,
  subtitle,
  children,
  className,
  titleClassName,
  subtitleClassName,
  contentClassName,
  ...props
}: HeadingTitleProps) {
  return (
    <div className={cn('space-y-4 w-full flex items-center justify-between', className)} {...props}>
      <div className="space-y-2">
        <h1 className={cn('text-4xl font-bold tracking-tight text-gray-900', titleClassName)}>
          {title}
        </h1>
        {subtitle && <p className={cn('text-lg text-gray-600', subtitleClassName)}>{subtitle}</p>}
      </div>
      {children && <div className={cn(contentClassName)}>{children}</div>}
    </div>
  )
}

export { HeadingTitle }
export type { HeadingTitleProps }
