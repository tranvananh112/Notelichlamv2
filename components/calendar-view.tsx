"use client"

import { useMemo } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

interface CalendarViewProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  getNoteCount: (date: Date) => number
  getHasAttendance: (date: Date) => boolean
  getAttendanceInfo: (date: Date) => { type: string; icon: string } | null
  getFutureTasksCount: (date: Date) => number
  getIncompleteNoteCount: (date: Date) => number
}

export default function CalendarView({
  selectedDate,
  onDateSelect,
  getNoteCount,
  getHasAttendance,
  getAttendanceInfo,
  getFutureTasksCount,
  getIncompleteNoteCount,
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
    if (!selectedDate) return false
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
        {["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"].map((day) => (
          <div key={day} className="text-center font-semibold text-sm text-slate-600 dark:text-slate-400 py-3">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Days */}
      <div className="grid grid-cols-7 gap-3">
        {/* Previous month's days - adjust for Monday start */}
        {Array.from({ length: (firstDayOfMonth + 6) % 7 }).map((_, index) => (
          <div
            key={`prev-${index}`}
            className="w-full h-24 rounded-lg bg-slate-50 dark:bg-slate-700/50 p-3 text-slate-400"
          />
        ))}

        {/* Current month's days */}
        {Array.from({ length: daysInMonth }).map((_, index) => {
          const day = index + 1
          const currentDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
          const noteCount = getNoteCount(currentDate)
          const hasAttendance = getHasAttendance(currentDate)
          const attendanceInfo = getAttendanceInfo(currentDate)
          const futureTasksCount = getFutureTasksCount(currentDate)
          const incompleteNoteCount = getIncompleteNoteCount(currentDate)
          const selected = isSelected(day)
          const today = isToday(day)
          const weekend = isWeekend(day)

          // Mảng màu gradient đẹp cho các ngày điểm danh
          const attendanceColors = [
            "from-blue-400 via-blue-500 to-blue-600",
            "from-purple-400 via-purple-500 to-purple-600",
            "from-pink-400 via-pink-500 to-pink-600",
            "from-indigo-400 via-indigo-500 to-indigo-600",
            "from-violet-400 via-violet-500 to-violet-600",
            "from-fuchsia-400 via-fuchsia-500 to-fuchsia-600",
            "from-cyan-400 via-cyan-500 to-cyan-600",
            "from-teal-400 via-teal-500 to-teal-600",
            "from-emerald-400 via-emerald-500 to-emerald-600",
            "from-rose-400 via-rose-500 to-rose-600",
          ]

          // Chọn màu dựa trên ngày trong tháng
          const colorIndex = (day - 1) % attendanceColors.length
          const attendanceGradient = attendanceColors[colorIndex]

          return (
            <button
              key={day}
              onClick={() => onDateSelect(currentDate)}
              className={`
                w-full h-24 rounded-xl p-3 transition-all duration-300 relative overflow-hidden group
                ${selected
                  ? "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white shadow-xl scale-105 ring-4 ring-purple-300/50"
                  : hasAttendance
                    ? `bg-gradient-to-br ${attendanceGradient} text-white shadow-lg hover:shadow-xl hover:scale-105 transform`
                    : today
                      ? "bg-gradient-to-br from-amber-300 via-yellow-300 to-orange-300 text-slate-900 font-bold shadow-md hover:shadow-lg"
                      : weekend
                        ? "bg-indigo-50 dark:bg-indigo-900/20 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-800"
                        : "bg-white dark:bg-slate-700 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600 hover:border-purple-300"
                }
              `}
            >
              <div className={`text-base font-bold ${hasAttendance || selected ? "text-white" : ""}`}>{day}</div>

              {/* Icon ca làm việc và dấu tích */}
              {hasAttendance && attendanceInfo && (
                <div className="absolute top-2 right-2 flex flex-col items-center gap-1">
                  {/* Icon ca làm việc */}
                  <div className="text-2xl drop-shadow-lg">
                    {attendanceInfo.icon}
                  </div>
                  {/* Dấu tích xanh */}
                  <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shadow-lg ring-2 ring-white">
                    <svg
                      className="w-4 h-4 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      strokeWidth="3"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
              )}

              {/* Badge Ngày làm việc */}
              {hasAttendance && (
                <div className="absolute top-2 left-2">
                  <span className="px-2 py-0.5 bg-green-500 text-white text-[10px] font-bold rounded-full shadow-md">
                    Làm việc
                  </span>
                </div>
              )}

              {/* Hiển thị badges theo hàng ngang, gọn gàng */}
              <div className="absolute bottom-1 left-1 right-1 flex flex-wrap gap-1 justify-start">
                {/* Hiển thị số nhiệm vụ dự kiến chưa hoàn thành */}
                {futureTasksCount > 0 && (
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${selected || hasAttendance
                    ? "bg-white/25 text-white"
                    : "bg-amber-500 text-white"
                    } shadow-sm`}>
                    <span>📋</span>
                    <span>{futureTasksCount}</span>
                  </div>
                )}

                {/* Hiển thị số ghi chú chưa hoàn thành */}
                {incompleteNoteCount > 0 && (
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold ${selected || hasAttendance
                    ? "bg-white/25 text-white"
                    : "bg-red-500 text-white"
                    } shadow-sm`}>
                    <span>📝</span>
                    <span>{incompleteNoteCount}</span>
                  </div>
                )}

                {/* Hiển thị tổng số ghi chú (nếu có) */}
                {noteCount > 0 && noteCount - (hasAttendance ? 1 : 0) > 0 && (
                  <div className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold ${selected || hasAttendance
                    ? "bg-white/20 text-white/90"
                    : "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300"
                    } shadow-sm`}>
                    {noteCount - (hasAttendance ? 1 : 0)} tổng
                  </div>
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
