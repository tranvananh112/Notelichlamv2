"use client"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"

interface HeaderProps {
  currentDate: Date
  viewMode: "week" | "month"
  onViewModeChange: (mode: "week" | "month") => void
}

export default function Header({ currentDate, viewMode, onViewModeChange }: HeaderProps) {
  const [time, setTime] = useState<string>("")
  const [date, setDate] = useState<string>("")

  useEffect(() => {
    const updateTime = () => {
      const now = new Date()
      setTime(now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
      setDate(now.toLocaleDateString("vi-VN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }))
    }
    updateTime()
    const interval = setInterval(updateTime, 1000)
    return () => clearInterval(interval)
  }, [])

  const monthYear = currentDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })

  return (
    <header className="bg-card border-b border-border shadow-sm sticky top-0 z-40">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-primary to-secondary p-2.5 rounded-lg shadow-md">
              <Calendar className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Lịch Công Việc</h1>
              <p className="text-sm text-foreground/60">Quản lý và theo dõi công việc hàng ngày</p>
            </div>
          </div>

          <div className="text-right">
            <div className="text-3xl font-bold text-foreground font-mono">{time}</div>
            <p className="text-sm text-foreground/60">{date}</p>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-input rounded-lg transition-colors text-foreground/70">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-foreground min-w-40 text-center capitalize">{monthYear}</h2>
            <button className="p-2 hover:bg-input rounded-lg transition-colors text-foreground/70">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2 bg-input rounded-lg p-1">
            <button
              onClick={() => onViewModeChange("week")}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                viewMode === "week"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Tuần
            </button>
            <button
              onClick={() => onViewModeChange("month")}
              className={`px-4 py-2 rounded-md font-medium transition-all ${
                viewMode === "month"
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "text-foreground/70 hover:text-foreground"
              }`}
            >
              Tháng
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}
