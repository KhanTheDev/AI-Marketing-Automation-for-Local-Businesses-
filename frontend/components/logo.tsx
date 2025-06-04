import { Bot, Zap } from "lucide-react"

interface LogoProps {
  size?: "sm" | "md" | "lg"
  variant?: "full" | "icon" | "text"
  className?: string
}

export function Logo({ size = "md", variant = "full", className = "" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  }

  const iconSizes = {
    sm: "h-5 w-5",
    md: "h-7 w-7",
    lg: "h-9 w-9",
  }

  if (variant === "icon") {
    return (
      <div className={`relative ${className}`}>
        <div className="relative">
          <Bot className={`${iconSizes[size]} text-indigo-600`} />
          <Zap
            className={`absolute -top-1 -right-1 ${size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"} text-yellow-500`}
          />
        </div>
      </div>
    )
  }

  if (variant === "text") {
    return (
      <span
        className={`font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${sizeClasses[size]} ${className}`}
      >
        MarketMAte
      </span>
    )
  }

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div className="relative">
        <Bot className={`${iconSizes[size]} text-indigo-600`} />
        <Zap
          className={`absolute -top-1 -right-1 ${size === "sm" ? "h-3 w-3" : size === "md" ? "h-4 w-4" : "h-5 w-5"} text-yellow-500`}
        />
      </div>
      <span
        className={`font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent ${sizeClasses[size]}`}
      >
        MarketMAte
      </span>
    </div>
  )
}
