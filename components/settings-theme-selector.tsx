"use client"

import { useTheme } from "next-themes"
import { Monitor, Sun, Moon } from "lucide-react"
import { cn } from "@/lib/utils"
import { updateTheme } from "@/app/actions"
import { useEffect, useState } from "react"

const OPTIONS = [
  { value: "system", label: "System", icon: Monitor, db: "SYSTEM" },
  { value: "light", label: "Light", icon: Sun, db: "LIGHT" },
  { value: "dark", label: "Dark", icon: Moon, db: "DARK" },
] as const

export function SettingsThemeSelector() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  function handleChange(value: string, db: "SYSTEM" | "LIGHT" | "DARK") {
    setTheme(value)
    updateTheme(db)
  }

  return (
    <div className="flex gap-3">
      {OPTIONS.map(({ value, label, icon: Icon, db }) => (
        <button
          key={value}
          onClick={() => handleChange(value, db)}
          className={cn(
            "flex flex-col items-center gap-2 flex-1 rounded-xl border p-4 text-sm transition-colors",
            mounted && theme === value
              ? "border-primary bg-primary/5 text-foreground"
              : "border-border text-muted-foreground hover:border-foreground/30 hover:text-foreground",
          )}
        >
          <Icon className="w-5 h-5" />
          {label}
        </button>
      ))}
    </div>
  )
}
