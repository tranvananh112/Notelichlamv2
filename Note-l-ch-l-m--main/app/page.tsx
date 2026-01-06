"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import MiniCalendar from "@/components/mini-calendar"
import CalendarView from "@/components/calendar-view"
import TaskDetailsPanel from "@/components/task-details-panel"
import AddTaskModal from "@/components/add-task-modal"
import NotificationToast, { type Toast } from "@/components/notification-toast"

export interface Task {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  category: "work" | "personal" | "meeting" | "important" | "health" | "learning"
  completed: boolean
  completion: number
  createdAt: string
  color: string
}

export interface Category {
  id: string
  name: string
  color: string
  checked: boolean
}

const DEFAULT_CATEGORIES: Category[] = [
  { id: "work", name: "Công Việc", color: "#3B82F6", checked: true },
  { id: "personal", name: "Cá Nhân", color: "#10B981", checked: true },
  { id: "meeting", name: "Cuộc Họp", color: "#F59E0B", checked: true },
  { id: "important", name: "Quan Trọng", color: "#EF4444", checked: true },
  { id: "health", name: "Sức Khỏe", color: "#8B5CF6", checked: true },
  { id: "learning", name: "Học Tập", color: "#06B6D4", checked: true },
]

const TASK_COLORS = [
  "#3B82F6", // Blue
  "#10B981", // Green
  "#F59E0B", // Amber
  "#EF4444", // Red
  "#8B5CF6", // Purple
  "#06B6D4", // Cyan
  "#EC4899", // Pink
  "#6366F1", // Indigo
]

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"week" | "month">("week")
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [selectedDateForForm, setSelectedDateForForm] = useState<string>("")
  const [workDays, setWorkDays] = useState<Set<string>>(new Set())
  const [toasts, setToasts] = useState<Toast[]>([])

  // Load from localStorage
  useEffect(() => {
    const storedTasks = localStorage.getItem("calendar_tasks")
    const storedCategories = localStorage.getItem("calendar_categories")
    const storedWorkDays = localStorage.getItem("calendar_work_days")

    if (storedTasks) {
      try {
        setTasks(JSON.parse(storedTasks))
      } catch (e) {
        console.error("[v0] Failed to load tasks:", e)
      }
    }

    if (storedCategories) {
      try {
        setCategories(JSON.parse(storedCategories))
      } catch (e) {
        console.error("[v0] Failed to load categories:", e)
      }
    }

    if (storedWorkDays) {
      try {
        setWorkDays(new Set(JSON.parse(storedWorkDays)))
      } catch (e) {
        console.error("[v0] Failed to load work days:", e)
      }
    }

    const today = new Date().toISOString().split("T")[0]
    setSelectedDateForForm(today)
  }, [])

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem("calendar_tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("calendar_categories", JSON.stringify(categories))
  }, [categories])

  useEffect(() => {
    localStorage.setItem("calendar_work_days", JSON.stringify(Array.from(workDays)))
  }, [workDays])

  const showToast = (message: string, type: "success" | "error" | "info" = "success") => {
    const id = Date.now().toString()
    const newToast: Toast = { id, message, type, duration: 3000 }
    setToasts((prev) => [...prev, newToast])

    if (newToast.duration) {
      setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
    }
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const getNextUniqueColor = (): string => {
    const usedColors = new Set<string>()
    tasks.forEach((t) => usedColors.add(t.color))

    // Find first unused color
    for (const color of TASK_COLORS) {
      if (!usedColors.has(color)) {
        return color
      }
    }
    // If all used, cycle through
    return TASK_COLORS[tasks.length % TASK_COLORS.length]
  }

  const addTask = (task: Omit<Task, "id" | "createdAt">) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      color: getNextUniqueColor(),
    }
    setTasks([...tasks, newTask])
    setShowTaskForm(false)
    showToast("Công việc được thêm thành công!", "success")
  }

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map((task) => (task.id === id ? { ...task, ...updates } : task)))
    showToast("Cập nhật công việc thành công!", "success")
  }

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id))
    setSelectedTask(null)
    showToast("Xóa công việc thành công!", "success")
  }

  const toggleCategory = (id: string) => {
    setCategories(categories.map((cat) => (cat.id === id ? { ...cat, checked: !cat.checked } : cat)))
  }

  const toggleWorkDay = (dateStr: string) => {
    const newWorkDays = new Set(workDays)
    if (newWorkDays.has(dateStr)) {
      newWorkDays.delete(dateStr)
      showToast("Đã bỏ đánh dấu ngày làm việc", "info")
    } else {
      newWorkDays.add(dateStr)
      showToast("Đã đánh dấu ngày làm việc", "success")
    }
    setWorkDays(newWorkDays)
  }

  const visibleTasks = tasks.filter((task) => {
    const category = categories.find((c) => c.id === task.category)
    return category?.checked
  })

  const handleOpenAddTask = (dateStr?: string) => {
    if (dateStr) {
      setSelectedDateForForm(dateStr)
    }
    setShowTaskForm(true)
  }

  const handleMoveTask = (taskId: string, newDate: string, newStartTime?: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            startDate: newDate,
            endDate: newDate,
            startTime: newStartTime || task.startTime,
          }
        }
        return task
      }),
    )
    showToast("Đã di chuyển công việc thành công!", "success")
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header currentDate={currentDate} viewMode={viewMode} onViewModeChange={setViewMode} />

      <div className="flex flex-1 overflow-hidden">
        {/* Mini Calendar Sidebar */}
        <MiniCalendar
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          workDays={workDays}
          onToggleWorkDay={toggleWorkDay}
        />

        {/* Main Calendar View */}
        <main className="flex-1 overflow-auto bg-background">
          <CalendarView
            tasks={visibleTasks}
            currentDate={currentDate}
            onDateChange={setCurrentDate}
            viewMode={viewMode}
            onTaskSelect={setSelectedTask}
            onAddTask={() => handleOpenAddTask()}
            categories={categories}
            onToggleCategory={toggleCategory}
            workDays={workDays}
            onMoveTask={handleMoveTask}
          />
        </main>

        {/* Task Details Panel */}
        {selectedTask && (
          <TaskDetailsPanel
            task={selectedTask}
            categories={categories}
            onUpdate={updateTask}
            onDelete={deleteTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>

      {/* Add Task Modal */}
      <AddTaskModal
        isOpen={showTaskForm}
        selectedDate={selectedDateForForm}
        onSubmit={addTask}
        onClose={() => setShowTaskForm(false)}
      />

      {/* Notification Toast */}
      <NotificationToast toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
