import * as React from "react"
import { cn } from "../../lib/utils"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CardAction } from "./card"

// Interface pour les props du DiamondCard
interface DiamondCardProps extends React.ComponentProps<typeof Card> {
  variant?: 'default' | 'elevated' | 'outlined' | 'glass'
  size?: 'sm' | 'md' | 'lg'
}

// Interface pour les props du DiamondCardHeader
interface DiamondCardHeaderProps extends React.ComponentProps<typeof CardHeader> {
  withDivider?: boolean
}

// Interface pour les props du DiamondCardTitle
interface DiamondCardTitleProps extends React.ComponentProps<typeof CardTitle> {
  gradient?: boolean
}

// Composant principal DiamondCard
function DiamondCard({ 
  className, 
  variant = 'default',
  size = 'md',
  ...props 
}: DiamondCardProps) {
  const variantStyles = {
    default: "bg-white shadow-sm",
    elevated: "bg-white shadow-lg",
    outlined: "bg-white shadow-none",
    glass: "bg-white/80 backdrop-blur-sm shadow-lg"
  }

  const sizeStyles = {
    sm: "p-4 gap-4 rounded-lg",
    md: "p-6 gap-6 rounded-xl",
    lg: "p-8 gap-8 rounded-2xl"
  }

  return (
    <Card
      className={cn(
        "border border-gray-200",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
}

// DiamondCardHeader avec styles personnalisés
function DiamondCardHeader({ 
  className, 
  withDivider = false,
  ...props 
}: DiamondCardHeaderProps) {
  return (
    <CardHeader
      className={cn(
        "space-y-2",
        withDivider && "pb-4 mb-2",
        className
      )}
      {...props}
    />
  )
}

// DiamondCardTitle avec option de dégradé
function DiamondCardTitle({ 
  className, 
  gradient = false,
  ...props 
}: DiamondCardTitleProps) {
  return (
    <CardTitle
      className={cn(
        "text-lg font-semibold text-gray-900",
        gradient && "bg-gradient-to-r from-primary to-primary-blue bg-clip-text text-transparent",
        className
      )}
      {...props}
    />
  )
}

// DiamondCardDescription avec styles cohérents
function DiamondCardDescription({ className, ...props }: React.ComponentProps<typeof CardDescription>) {
  return (
    <CardDescription
      className={cn(
        "text-sm text-gray-600 leading-relaxed",
        className
      )}
      {...props}
    />
  )
}

// DiamondCardContent avec espacement optimisé
function DiamondCardContent({ className, ...props }: React.ComponentProps<typeof CardContent>) {
  return (
    <CardContent
      className={cn(
        "space-y-4",
        className
      )}
      {...props}
    />
  )
}

// DiamondCardFooter avec styles d'actions
function DiamondCardFooter({ className, ...props }: React.ComponentProps<typeof CardFooter>) {
  return (
    <CardFooter
      className={cn(
        "flex items-center justify-between pt-4",
        className
      )}
      {...props}
    />
  )
}

// DiamondCardAction pour les actions dans l'en-tête
function DiamondCardAction({ className, ...props }: React.ComponentProps<typeof CardAction>) {
  return (
    <CardAction
      className={cn(
        "text-gray-500",
        className
      )}
      {...props}
    />
  )
}

// Export de tous les composants
export {
  DiamondCard,
  DiamondCardHeader,
  DiamondCardTitle,
  DiamondCardDescription,
  DiamondCardContent,
  DiamondCardFooter,
  DiamondCardAction,
  type DiamondCardProps,
  type DiamondCardHeaderProps,
  type DiamondCardTitleProps
}

// Export par défaut du composant principal
export default DiamondCard