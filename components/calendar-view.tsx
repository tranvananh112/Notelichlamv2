"use client"

import { useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CalendarViewProps {
  selectedDate: Date
  onDateSelect: (date: Date) => void
  getNoteCount: (date: Date) => number
  getHasAttendance: (date: Date) => boolean
}

export default function CalendarView({
  selectedDate,
  onDateSelect,
  getNoteCount,
  getHasAttendance,
}: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const { daysInMonth, firstDayOfMonth, previousDays } = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    const firstDayOfMonth = new Date(year, month, 1).getDay()
    const previousDays = new Date(year, month, 0).getDate()

    return { daysInMonth, firstDayOfMonth, previousDays }
  }, [currentMonth])

  const monthNames = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ]
  const monthName = `${monthNames[currentMonth.getMonth()]} ${currentMonth.getFullYear()}`

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const isSelected = (day: number) => {
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    )
  }

  const isToday = (day: number) => {
    const today = new Date()
    return (
      today.getDate() === day &&
      today.getMonth() === currentMonth.getMonth() &&
      today.getFullYear() === currentMonth.getFullYear()
    )
  }

  const getDayOfWeek = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
    return date.getDay()
  }

  const isWeekend = (day: number) => {
    const dayOfWeek = getDayOfWeek(day)
    return dayOfWeek === 0 || dayOfWeek === 6
  }

  return (
    <div className="p-6">
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
          {monthName}
        </h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={previousMonth}
            className="border-purple-200 hover:bg-purple-50 dark:border-slate-700 dark:hover:bg-slate-700 bg-transparent"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
            className="border-purple-200 hover:bg-purple-50 dark:border-slate-700 dark:hover:bg-slate-700"
          >
            Hôm Nay
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextMonth}
            className="border-purple-200 hover:bg-purple-50 dark:border-slate-700 dark:hover:bg-slate-700 bg-transparent"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-3 mb-4">
        {["CN", "Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7"].map((day) => (
          <div key={day} className="text-center font-semibold text-sm text-slate-600 dark:text-slate-400 py-3">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-3">
        {/* Previous month's days */}
        {Array.from({ length: firstDayOfMonth }).map((_, index) => (
          <div
            key={`prev-${index}`}
            className="w-full h-24 rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3 text-slate-400"
          />
        ))}

        {/* Current month's days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const noteCount = getNoteCount(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
          const hasAttendance = getHasAttendance(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
          const selected = isSelected(day)
          const today = isToday(day)
          const weekend = isWeekend(day)

          return (
            <button
              key={day}
              onClick={() => onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))}
              className={`
                w-full h-24 rounded-lg p-3 transition-all duration-200 relative overflow-hidden
                ${
                  selected
                    ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-lg"
                    : today
                      ? "bg-gradient-to-br from-yellow-200 to-orange-200 text-slate-900 font-bold"
                      : weekend
                        ? "bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30"
                        : "bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600"
                }
              `}
            >
              <div className="text-base font-bold">{day}</div>
              {noteCount > 0 && (
                <div className={`text-xs mt-2 ${selected ? "text-white" : "text-purple-600 dark:text-purple-400"}`}>
                  {hasAttendance && <span className="block text-lg">✓</span>}
                  {noteCount - (hasAttendance ? 1 : 0) > 0 && (
                    <span className="text-[10px]">{noteCount - (hasAttendance ? 1 : 0)} ghi chú</span>
                  )}
                </div>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
