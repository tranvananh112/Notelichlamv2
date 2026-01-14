"use client"

import { useState, useEffect } from "react"
import Header from "@/components/header"
import CalendarView from "@/components/calendar-view"
import MiniCalendar from "@/components/mini-calendar"
import TaskDetailsPanelComponent from "@/components/task-details-panel"
import AddTaskModal from "@/components/add-task-modal"
import type { Task, Category } from "@/types"

export default function Home() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [viewMode, setViewMode] = useState<"week" | "month">("month")
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [workDays, setWorkDays] = useState<Set<string>>(new Set())
  const [categories, setCategories] = useState<Category[]>([
    { id: "work", name: "Công Việc", color: "#3B82F6", checked: true },
    { id: "personal", name: "Cá Nhân", color: "#10B981", checked: true },
    { id: "meeting", name: "Cuộc Họp", color: "#F59E0B", checked: true },
    { id: "important", name: "Quan Trọng", color: "#EF4444", checked: true },
    { id: "health", name: "Sức Khỏe", color: "#8B5CF6", checked: true },
    { id: "learning", name: "Học Tập", color: "#06B6D4", checked: true },
  ])

  // Load data from localStorage
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    const savedWorkDays = localStorage.getItem("workDays")
    const savedCategories = localStorage.getItem("categories")

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
    if (savedWorkDays) {
      setWorkDays(new Set(JSON.parse(savedWorkDays)))
    }
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    }
  }, [])

  // Save tasks to localStorage
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Save workDays to localStorage
  useEffect(() => {
    localStorage.setItem("workDays", JSON.stringify(Array.from(workDays)))
  }, [workDays])

  // Save categories to localStorage
  useEffect(() => {
    localStorage.setItem("categories", JSON.stringify(categories))
  }, [categories])

  const handleToggleWorkDay = (dateStr: string) => {
    setWorkDays((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(dateStr)) {
        newSet.delete(dateStr)
      } else {
        newSet.add(dateStr)
      }
      return newSet
    })
  }

  const handleAddTask = (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
    }
    setTasks((prev) => [...prev, newTask])
    setShowAddModal(false)
  }

  const handleUpdateTask = (taskId: string, updates: Partial<Task>) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, ...updates } : task)))
    const updatedTask = tasks.find((t) => t.id === taskId)
    if (updatedTask) {
      setSelectedTask({ ...updatedTask, ...updates })
    }
  }

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((task) => task.id !== taskId))
    setSelectedTask(null)
  }

  const handleMoveTask = (taskId: string, newDate: string, newStartTime?: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id === taskId) {
          return {
            ...task,
            startDate: newDate,
            endDate: newDate,
            ...(newStartTime && { startTime: newStartTime }),
          }
        }
        return task
      }),
    )
  }

  const handleToggleCategory = (categoryId: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, checked: !cat.checked } : cat)),
    )
  }

  // Filter tasks by checked categories
  const filteredTasks = tasks.filter((task) => {
    const category = categories.find((cat) => cat.id === task.category)
    return category?.checked
  })

  return (
    <div className="flex flex-col h-screen bg-background">
      <Header currentDate={currentDate} viewMode={viewMode} onViewModeChange={setViewMode} />

      <div className="flex flex-1 overflow-hidden">
        <MiniCalendar
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          workDays={workDays}
          onToggleWorkDay={handleToggleWorkDay}
        />

        <CalendarView
          tasks={filteredTasks}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          viewMode={viewMode}
          onTaskSelect={setSelectedTask}
          onAddTask={() => setShowAddModal(true)}
          categories={categories}
          onToggleCategory={handleToggleCategory}
          workDays={workDays}
          onMoveTask={handleMoveTask}
          onToggleWorkDay={handleToggleWorkDay}
        />

        {selectedTask && (
          <TaskDetailsPanelComponent
            task={selectedTask}
            categories={categories}
            onClose={() => setSelectedTask(null)}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        )}
      </div>

      {showAddModal && (
        <AddTaskModal
          onClose={() => setShowAddModal(false)}
          onSubmit={handleAddTask}
          selectedDate={currentDate.toISOString().split("T")[0]}
          categories={categories}
        />
      )}
    </div>
  )
}
