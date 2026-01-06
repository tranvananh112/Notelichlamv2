"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

interface MiniCalendarProps {
  currentDate: Date
  onDateChange: (date: Date) => void
  workDays: Set<string>
  onToggleWorkDay: (dateStr: string) => void
}

export default function MiniCalendar({ currentDate, onDateChange, workDays, onToggleWorkDay }: MiniCalendarProps) {
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    // Get first day and adjust so Monday is 0
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  const handlePrevMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const handleNextMonth = () => {
    onDateChange(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  const daysInMonth = getDaysInMonth(currentDate)
  const firstDay = getFirstDayOfMonth(currentDate)
  const today = new Date().toISOString().split("T")[0]

  const days = []

  // Empty cells before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  // Days of month
  for (let day = 1; day <= daysInMonth; day++) {
    const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
    const dateStr = date.toISOString().split("T")[0]
    days.push({ day, dateStr, isToday: dateStr === today })
  }

  const monthYear = currentDate.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })

  return (
    <div className="w-72 bg-card border-r border-border flex flex-col">
      {/* Mini Calendar Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">{monthYear}</h2>
          <div className="flex gap-1">
            <button onClick={handlePrevMonth} className="p-1 hover:bg-input rounded transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={handleNextMonth} className="p-1 hover:bg-input rounded transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Weekday headers - Monday to Sunday */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((day) => (
            <div key={day} className="text-center text-xs font-medium text-foreground/60">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} className="aspect-square" />

            const isWorkDay = workDays.has(day.dateStr)
            const isToday = day.isToday

            return (
              <div key={day.dateStr} className="relative aspect-square">
                <button
                  onClick={() => onToggleWorkDay(day.dateStr)}
                  className={`w-full h-full text-xs font-medium rounded transition-colors relative group
                    ${isToday ? "bg-primary text-primary-foreground" : "hover:bg-input text-foreground"}
                  `}
                >
                  {day.day}
                  {/* Work day indicator - small checkmark */}
                  {isWorkDay && <div className="absolute top-0.5 right-0.5 w-2 h-2 bg-success rounded-full" />}
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Statistics Section */}
      <div className="p-4 flex-1 overflow-y-auto">
        <h3 className="text-xs font-semibold text-foreground mb-3 uppercase tracking-wide">Thống Kê</h3>
        <div className="space-y-3 text-xs">
          <div className="bg-success/10 border border-success/30 rounded p-3">
            <div className="flex justify-between mb-1">
              <span className="text-foreground/60">Ngày làm việc</span>
              <span className="font-bold text-success text-sm">{workDays.size}</span>
            </div>
            <div className="text-foreground/50 text-xs">Tháng {currentDate.getMonth() + 1}</div>
          </div>

          <div className="bg-primary/10 border border-primary/30 rounded p-3">
            <div className="flex justify-between">
              <span className="text-foreground/60">Tổng ngày tháng</span>
              <span className="font-bold text-primary text-sm">{daysInMonth}</span>
            </div>
          </div>

          <div className="bg-input rounded p-3">
            <div className="flex justify-between">
              <span className="text-foreground/60">Ngày còn lại</span>
              <span className="font-bold text-foreground text-sm">{daysInMonth - workDays.size}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
