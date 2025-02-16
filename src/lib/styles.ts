// Theme configuration and shared styles for the Jeopardy app
// This serves as the single source of truth for styling across the application

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Utility function to merge Tailwind classes safely
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Color palette based on team colors from masterPlan.txt
export const teamColors = {
  green: {
    primary: "bg-green-600",
    hover: "hover:bg-green-700",
    text: "text-green-600",
    border: "border-green-600",
    light: "bg-green-100",
    danish: "Grøn"
  },
  blue: {
    primary: "bg-blue-600",
    hover: "hover:bg-blue-700",
    text: "text-blue-600",
    border: "border-blue-600",
    light: "bg-blue-100",
    danish: "Blå"
  },
  red: {
    primary: "bg-red-600",
    hover: "hover:bg-red-700",
    text: "text-red-600",
    border: "border-red-600",
    light: "bg-red-100",
    danish: "Rød"
  },
  yellow: {
    primary: "bg-yellow-500",
    hover: "hover:bg-yellow-600",
    text: "text-yellow-600",
    border: "border-yellow-500",
    light: "bg-yellow-100",
    danish: "Gul"
  },
  purple: {
    primary: "bg-purple-600",
    hover: "hover:bg-purple-700",
    text: "text-purple-600",
    border: "border-purple-600",
    light: "bg-purple-100",
    danish: "Lilla"
  },
} as const

// Game board styling
export const gameBoard = {
  grid: "grid grid-cols-6 gap-4 p-4",
  category: "text-center font-bold text-xl p-4 bg-zinc-800 text-white rounded-lg",
  tile: {
    base: "aspect-square flex items-center justify-center text-2xl font-bold rounded-lg transition-all duration-200",
    available: "bg-zinc-800 hover:bg-zinc-700 cursor-pointer",
    revealed: "bg-zinc-700",
    disabled: "bg-zinc-600 cursor-not-allowed opacity-50",
  },
} as const

// Typography
export const typography = {
  h1: "scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl",
  h2: "scroll-m-20 text-3xl font-semibold tracking-tight",
  h3: "scroll-m-20 text-2xl font-semibold tracking-tight",
  h4: "scroll-m-20 text-xl font-semibold tracking-tight",
  p: "leading-7 [&:not(:first-child)]:mt-6",
  blockquote: "mt-6 border-l-2 pl-6 italic",
  list: "my-6 ml-6 list-disc [&>li]:mt-2",
} as const

// Layout containers
export const containers = {
  page: "container mx-auto px-4 py-8",
  section: "my-8",
  card: "rounded-lg border bg-card text-card-foreground shadow-sm",
} as const

// Button variants (extending shadcn/ui buttons)
export const buttons = {
  buzzer: "h-32 w-full text-2xl font-bold transition-all duration-200",
  control: "h-12 px-4",
  nav: "h-10 px-4",
} as const

// Animation classes
export const animations = {
  fadeIn: "animate-fadeIn",
  slideIn: "animate-slideIn",
  bounce: "animate-bounce",
  spin: "animate-spin",
} as const

// Timer display
export const timer = {
  container: "text-4xl font-bold text-center",
  warning: "text-yellow-500",
  danger: "text-red-500",
} as const

// Score display
export const scoreDisplay = {
  container: "flex items-center gap-2 p-2 rounded-lg",
  value: "text-2xl font-bold",
  change: "text-sm font-medium",
  positive: "text-green-500",
  negative: "text-red-500",
} as const

// Z-index management
export const zIndex = {
  modal: "z-50",
  overlay: "z-40",
  header: "z-30",
  content: "z-20",
  base: "z-10",
} as const

// Media query breakpoints (following Tailwind defaults)
export const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
  "2xl": "1536px",
} as const 