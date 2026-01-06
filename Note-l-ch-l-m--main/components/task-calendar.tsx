"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface Task {
  id: string
  date: string
  category: "work" | "personal" | "meeting" | "deadline"
  completed: boolean
}

interface TaskCalendarProps {
  tasks: Task[]
  selectedDate: string
  onSelectDate: (date: string) => void
}

export default function TaskCalendar({ tasks, selectedDate, onSelectDate }: TaskCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const getTasksForDate = (date: string) => {
    return tasks.filter((task) => task.date === date)
  }

  const hasTasksOnDate = (date: string) => {
    return getTasksForDate(date).length > 0
  }

  const getTodaysTasks = (date: string) => {
    const dayTasks = getTasksForDate(date)
    return {
      total: dayTasks.length,
      completed: dayTasks.filter((t) => t.completed).length,
    }
  }

  const days = []
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)

  for (let i = 0; i < firstDay; i++) {
    days.push(null)
  }

  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i)
  }

  const monthYear = currentMonth.toLocaleDateString("vi-VN", { month: "long", year: "numeric" })

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-foreground">{monthYear}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-4">
        {["CN", "T2", "T3", "T4", "T5", "T6", "T7"].map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dateStr = day
            ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
            : ""
          const isSelected = dateStr === selectedDate
          const hasTasks = dateStr && hasTasksOnDate(dateStr)
          const dayTasks = dateStr ? getTodaysTasks(dateStr) : { total: 0, completed: 0 }

          return (
            <button
              key={index}
              onClick={() => dateStr && onSelectDate(dateStr)}
              className={`
                aspect-square rounded-lg text-sm font-semibold transition-all relative
                ${!day ? "opacity-0 cursor-default" : ""}
                ${isSelected ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg scale-105" : "bg-gray-50 hover:bg-gray-100 text-foreground"}
                ${hasTasks && !isSelected ? "ring-2 ring-accent" : ""}
              `}
              disabled={!day}
            >
              {day}
              {hasTasks && (
                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 flex gap-0.5">
                  {[...Array(Math.min(dayTasks.total, 3))].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${i < dayTasks.completed ? "bg-green-500" : "bg-orange-400"}`}
                    />
                  ))}
                </div>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
        <h4 className="font-semibold text-foreground mb-3">Huyền thoại</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-400"></div>
            <span>Công việc chưa hoàn thành</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Công việc hoàn thành</span>
          </div>
        </div>
      </div>
    </div>
  )
}
