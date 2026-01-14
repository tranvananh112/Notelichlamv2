"use client"

import type { Task, Category } from "@/types"
import { Plus } from "lucide-react"
import { useState } from "react"

interface CalendarViewProps {
  tasks: Task[]
  currentDate: Date
  onDateChange: (date: Date) => void
  viewMode: "week" | "month"
  onTaskSelect: (task: Task) => void
  onAddTask: () => void
  categories: Category[]
  onToggleCategory: (id: string) => void
  workDays: Set<string>
  onMoveTask: (taskId: string, newDate: string, newStartTime?: string) => void
  onToggleWorkDay: (dateStr: string) => void
}

export default function CalendarView({
  tasks,
  currentDate,
  onDateChange,
  viewMode,
  onTaskSelect,
  onAddTask,
  categories,
  onToggleCategory,
  workDays,
  onMoveTask,
  onToggleWorkDay,
}: CalendarViewProps) {
  const [draggedTask, setDraggedTask] = useState<Task | null>(null)

  // Tính toán thống kê thời gian thực
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
  }

  const currentMonthWorkDays = Array.from(workDays).filter(dateStr => {
    const date = new Date(dateStr)
    return date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear()
  }).length

  const totalDaysInMonth = getDaysInMonth(currentDate)
  const workDaysPercentage = totalDaysInMonth > 0 ? Math.round((currentMonthWorkDays / totalDaysInMonth) * 100) : 0

  const today = new Date()
  const currentDay = today.getDate()
  const isCurrentMonth = today.getMonth() === currentDate.getMonth() && today.getFullYear() === currentDate.getFullYear()
  const daysPassedThisMonth = isCurrentMonth ? currentDay : totalDaysInMonth
  const expectedWorkDays = Math.floor(daysPassedThisMonth * 0.7) // Giả sử 70% ngày trong tháng là ngày làm việc
  const workDaysStatus = currentMonthWorkDays >= expectedWorkDays ? "Đạt mục tiêu" : "Cần cải thiện"

  const getFirstDayOfMonth = (date: Date) => {
    const day = new Date(date.getFullYear(), date.getMonth(), 1).getDay()
    return day === 0 ? 6 : day - 1
  }

  const getWeekDates = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = d.getDate() - (day === 0 ? 6 : day - 1)
    const startDate = new Date(d.setDate(diff))

    const weekDates = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate)
      date.setDate(startDate.getDate() + i)
      weekDates.push(date)
    }
    return weekDates
  }

  const renderWeekView = () => {
    const weekDates = getWeekDates(currentDate)
    const dayLabels = ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "CN"]
    const hours = Array.from({ length: 24 }, (_, i) => i)

    return (
      <div className="flex flex-col h-full bg-background">
        <div className="grid grid-cols-8 border-b border-border sticky top-0 bg-card z-10">
          <div className="p-2 text-center text-xs font-semibold text-foreground/60 border-r border-border">Giờ</div>
          {weekDates.map((date, idx) => {
            const dateStr = date.toISOString().split("T")[0]
            const isToday = dateStr === new Date().toISOString().split("T")[0]
            const isWorkDay = workDays.has(dateStr)

            return (
              <div
                key={idx}
                className={`p-2 text-center border-r border-border cursor-pointer transition-all ${isToday ? "bg-blue-50" : isWorkDay ? "bg-green-50" : "hover:bg-gray-50"
                  }`}
                onClick={() => onToggleWorkDay(dateStr)}
              >
                <div className="text-xs font-semibold text-foreground/80">{dayLabels[idx]}</div>
                <div className={`text-sm font-bold ${isToday ? "text-blue-600" : "text-foreground"}`}>
                  {date.getDate()}
                </div>
                {isWorkDay && (
                  <div className="mt-1 text-green-600">✓</div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex-1 overflow-y-auto">
          {hours.map((hour) => (
            <div key={hour} className="grid grid-cols-8 border-b border-border/50">
              <div className="p-2 text-right text-xs font-semibold text-foreground/60 border-r border-border bg-card sticky left-0 z-5 min-w-16">
                {String(hour).padStart(2, "0")}:00
              </div>
              {weekDates.map((date, dayIdx) => {
                const dateStr = date.toISOString().split("T")[0]
                const isWorkDay = workDays.has(dateStr)
                const dayTasks = tasks.filter(
                  (t) => t.startDate === dateStr && Number.parseInt(t.startTime.split(":")[0]) === hour,
                )

                return (
                  <div
                    key={`${dayIdx}-${hour}`}
                    onDrop={(e) => {
                      e.preventDefault()
                      if (draggedTask) {
                        onMoveTask(draggedTask.id, dateStr, `${String(hour).padStart(2, "0")}:00`)
                      }
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    className={`border-r border-border hover:bg-input/50 transition-colors min-h-20 p-1 relative cursor-drop ${isWorkDay ? "bg-emerald-50/30" : ""
                      }`}
                  >
                    {dayTasks.map((task) => (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={() => setDraggedTask(task)}
                        onDragEnd={() => setDraggedTask(null)}
                        onClick={() => onTaskSelect(task)}
                        className="px-2 py-1 rounded text-xs font-medium text-white truncate cursor-move hover:shadow-lg transition-shadow"
                        style={{ backgroundColor: task.color }}
                        title={task.title}
                      >
                        {task.title}
                      </div>
                    ))}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderMonthView = () => {
    const daysInMonth = getDaysInMonth(currentDate)
    const firstDay = getFirstDayOfMonth(currentDate)
    const days = []
    const dayLabels = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]

    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="bg-card/50 p-2 min-h-28 border border-border/30" />)
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      const dateStr = date.toISOString().split("T")[0]
      const dayTasks = tasks.filter((t) => t.startDate === dateStr)
      const isToday = new Date().toISOString().split("T")[0] === dateStr
      const isWorkDay = workDays.has(dateStr)

      days.push(
        <div
          key={day}
          className={`p-2 min-h-32 border flex flex-col transition-all group relative ${isToday ? "bg-blue-50 border-blue-300" : isWorkDay ? "bg-green-50" : "bg-card border-border hover:bg-input/30"
            }`}
          onDrop={(e) => {
            e.preventDefault()
            if (draggedTask) {
              onMoveTask(draggedTask.id, dateStr)
            }
          }}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => onToggleWorkDay(dateStr)}
        >
          <div className="flex items-center justify-between mb-1">
            <div className={`text-sm font-bold ${isToday ? "text-blue-600" : "text-foreground"}`}>
              {day}
            </div>
            {isWorkDay && (
              <div className="text-green-600">
                ✓
              </div>
            )}
          </div>
          <div className="space-y-1 text-xs flex-1 overflow-y-auto">
            {dayTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                draggable
                onDragStart={() => setDraggedTask(task)}
                onDragEnd={() => setDraggedTask(null)}
                onClick={() => onTaskSelect(task)}
                className="px-2 py-1 rounded text-white truncate cursor-move hover:shadow-md transition-shadow font-medium"
                style={{ backgroundColor: task.color }}
                title={task.title}
              >
                {task.title}
              </div>
            ))}
            {dayTasks.length > 3 && (
              <div className="text-foreground/60 px-2 text-xs font-medium">+{dayTasks.length - 3} more</div>
            )}
          </div>
        </div>,
      )
    }

    return (
      <div className="space-y-4">
        <div className="grid grid-cols-7 gap-0 border border-border rounded-lg overflow-hidden shadow-sm">
          {dayLabels.map((day) => (
            <div key={day} className="p-3 text-center font-semibold text-foreground bg-input border-b border-border">
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs font-semibold text-foreground/60 uppercase">Danh mục:</span>
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onToggleCategory(category.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${category.checked ? "text-white shadow-md" : "bg-input text-foreground/60 opacity-50"
                }`}
              style={{
                backgroundColor: category.checked ? category.color : undefined,
              }}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Panel Thống Kê Thời Gian Thực */}
      <div className="p-3 border-b border-border bg-green-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{currentMonthWorkDays}</div>
              <div className="text-xs text-green-700">Ngày làm việc</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-blue-600">{workDaysPercentage}%</div>
              <div className="text-xs text-blue-700">Tỷ lệ</div>
            </div>
            <div className="text-center">
              <div className={`text-sm font-semibold ${currentMonthWorkDays >= expectedWorkDays ? "text-green-600" : "text-orange-600"}`}>
                {workDaysStatus}
              </div>
              <div className="text-xs text-gray-600">Trạng thái</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-600">
              Tháng {currentDate.getMonth() + 1}/{currentDate.getFullYear()}
            </div>
            <div className="text-xs text-gray-500">
              {totalDaysInMonth - currentMonthWorkDays} ngày còn lại
            </div>
          </div>
        </div>

        {/* Thanh tiến độ */}
        <div className="mt-2">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${workDaysPercentage}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto p-4">{viewMode === "week" ? renderWeekView() : renderMonthView()}</div>

      <button
        onClick={onAddTask}
        className="fixed bottom-8 right-8 bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg transition-all hover:scale-110 flex items-center justify-center z-50"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  )
}
