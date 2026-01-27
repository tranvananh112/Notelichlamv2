"use client"

import { useState, useEffect, useCallback, useMemo, Suspense } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import { useSupabaseSync } from "@/hooks/use-supabase-sync"
import { useOptimizedData } from "@/hooks/use-optimized-data"
import dynamic from "next/dynamic"

// Lazy load heavy components
const CalendarView = dynamic(() => import("./calendar-view"), {
  loading: () => <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg h-96" />
})
const NotePanel = dynamic(() => import("./note-panel"), {
  loading: () => <div className="animate-pulse bg-slate-200 dark:bg-slate-700 rounded-lg h-full" />
})
const ReportsModal = dynamic(() => import("./reports-modal"))
const PayrollModal = dynamic(() => import("./payroll-modal"))
const AdminDashboard = dynamic(() => import("./admin-dashboard"))
const SpecialDayModal = dynamic(() => import("./special-day-modal"))

import Header from "./header"
import ReportsButton from "./reports-button"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { LogOut, Settings } from "lucide-react"
import router from "next/router"

interface User {
  id: string
  email: string | undefined
}

export default function AppContainer({ user, isAdmin }: { user: User; isAdmin: boolean }) {
  const router = useRouter()
  const supabase = createClient()
  const { status: saveStatus, lastSaved, syncData } = useSupabaseSync({
    onError: (error) => console.error('Sync failed:', error),
    onSuccess: () => console.log('Data synced successfully')
  })
  const { loadNotes, loadFutureTasks, preloadData, cache } = useOptimizedData(user.id)

  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [notes, setNotes] = useState<
    Record<
      string,
      Array<{
        id: string
        text: string
        timestamp: string
        type: "note" | "attendance"
        color?: string
        progress?: number
        completed?: boolean
        status?: string
      }>
    >
  >({})
  const [currentTime, setCurrentTime] = useState<Date>(new Date())
  const [workStartDate, setWorkStartDate] = useState<Date | null>(null)
  const [daysWorked, setDaysWorked] = useState<number>(0)
  const [showPayrollModal, setShowPayrollModal] = useState(false)
  const [payrollHistory, setPayrollHistory] = useState<Array<{ date: string; amount: number }>>([])
  const [showReportsModal, setShowReportsModal] = useState(false)
  const [showAdminDashboard, setShowAdminDashboard] = useState(false)
  const [showNotePanel, setShowNotePanel] = useState(false)
  const [futureTasks, setFutureTasks] = useState<Array<{
    id: string
    text: string
    color?: string
    priority?: string
    status?: string
    completed?: boolean
    created_at: string
  }>>([])
  const [allFutureTasks, setAllFutureTasks] = useState<Record<string, Array<{
    id: string
    text: string
    color?: string
    priority?: string
    status?: string
    completed?: boolean
    created_at: string
  }>>>({}) // Store all future tasks by date
  const [specialDays, setSpecialDays] = useState<Record<string, string>>({}) // dateKey -> type
  const [showSpecialDayModal, setShowSpecialDayModal] = useState(false)
  const [specialDayModalDate, setSpecialDayModalDate] = useState<Date | null>(null)

  // Load all future tasks for calendar display
  useEffect(() => {
    const loadAllFutureTasks = async () => {
      try {
        const { data: allTasksData, error } = await supabase
          .from("future_tasks")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: true })

        if (error) {
          console.error("Error loading all future tasks:", error)
        } else {
          // Group tasks by date
          const tasksByDate = allTasksData?.reduce((acc: typeof allFutureTasks, task: any) => {
            const dateKey = task.date
            if (!acc[dateKey]) acc[dateKey] = []
            acc[dateKey].push({
              id: task.id,
              text: task.text,
              color: task.color,
              priority: task.priority,
              status: task.status,
              completed: task.completed || false,
              created_at: task.created_at
            })
            return acc
          }, {} as typeof allFutureTasks) || {}

          setAllFutureTasks(tasksByDate)
        }
      } catch (error) {
        console.error("Error loading all future tasks:", error)
      }
    }

    loadAllFutureTasks()
  }, [user.id])

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load special days
  useEffect(() => {
    const loadSpecialDays = async () => {
      try {
        const { data, error } = await supabase
          .from("special_days")
          .select("*")
          .eq("user_id", user.id)

        if (error) {
          console.error("Error loading special days:", error)
        } else {
          const daysMap = data?.reduce((acc: Record<string, string>, day: any) => {
            acc[day.date] = day.type
            return acc
          }, {}) || {}
          setSpecialDays(daysMap)
        }
      } catch (error) {
        console.error("Error loading special days:", error)
      }
    }

    loadSpecialDays()
  }, [user.id])

  // Load future tasks from Supabase for specific date
  useEffect(() => {
    const loadFutureTasks = async () => {
      if (!selectedDate) return

      try {
        const dateKey = selectedDate.toISOString().split("T")[0]
        const { data: futureTasksData, error } = await supabase
          .from("future_tasks")
          .select("*")
          .eq("user_id", user.id)
          .eq("date", dateKey)
          .order("created_at", { ascending: true })

        if (error) {
          console.error("Error loading future tasks:", error)
          // Fallback to localStorage if Supabase fails
          const storageKey = `futureTasks_${user.id}_${dateKey}`
          const saved = localStorage.getItem(storageKey)
          if (saved) {
            const tasks = JSON.parse(saved)
            setFutureTasks(tasks)
          } else {
            setFutureTasks([])
          }
        } else {
          const tasks = futureTasksData?.map((task: any) => ({
            id: task.id,
            text: task.text,
            color: task.color,
            priority: task.priority,
            status: task.status,
            completed: task.completed || false,
            created_at: task.created_at,
            tags: task.tags || []
          })) || []
          setFutureTasks(tasks)

          // Update allFutureTasks as well
          setAllFutureTasks(prev => ({
            ...prev,
            [dateKey]: tasks
          }))
        }
      } catch (error) {
        console.error("Error loading future tasks:", error)
        setFutureTasks([])
      }
    }

    loadFutureTasks()
  }, [user.id, selectedDate])

  // Backup to localStorage (as fallback)
  const backupFutureTasksToStorage = (tasks: typeof futureTasks) => {
    if (!selectedDate) return
    try {
      const dateKey = selectedDate.toISOString().split("T")[0]
      const storageKey = `futureTasks_${user.id}_${dateKey}`
      localStorage.setItem(storageKey, JSON.stringify(tasks))
    } catch (error) {
      console.error("Error backing up to localStorage:", error)
    }
  }

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      // Lấy tất cả notes và sắp xếp theo created_at
      const { data: allNotesData } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: true }) // Sắp xếp theo thời gian tạo

      const { data: payrollData } = await supabase.from("payroll_history").select("*").eq("user_id", user.id)

      const { data: workData } = await supabase.from("work_tracking").select("*").eq("user_id", user.id).single()

      if (allNotesData) {
        // Chỉ lấy notes có date
        const notesWithDate = allNotesData.filter((note: any) => note.date !== null)

        // Group notes có date
        const groupedNotes = notesWithDate.reduce(
          (acc: typeof notes, note: any) => {
            const dateKey = note.date
            if (!acc[dateKey]) acc[dateKey] = []
            acc[dateKey].push({
              id: note.id,
              text: note.text,
              timestamp:
                note.timestamp ||
                new Date(note.created_at).toLocaleTimeString("vi-VN", {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }),
              type: note.type,
              color: note.color,
              progress: note.progress,
              completed: note.completed,
              status: note.status,
            })
            return acc
          },
          {} as typeof notes,
        )
        setNotes(groupedNotes)
      }

      if (payrollData) {
        setPayrollHistory(payrollData.map((p: any) => ({ date: p.paid_date, amount: p.amount })))
      }

      if (workData) {
        setWorkStartDate(workData.start_date ? new Date(workData.start_date) : null)
        setDaysWorked(workData.days_worked || 0)
      }
    }

    loadData()
  }, [user.id])

  const dateKey = selectedDate ? selectedDate.toISOString().split("T")[0] : ""
  const dayNotes = dateKey ? notes[dateKey] || [] : []

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    setShowNotePanel(true)
  }

  const addNote = async (text: string, type: "note" | "attendance" = "note", color = "blue", progress?: number) => {
    // Lấy thời gian thực hiện tại
    const now = new Date()
    const timestamp = now.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit", second: "2-digit" })

    const newNote = {
      id: Date.now().toString(),
      text,
      timestamp,
      type,
      color: type === "attendance" ? "green" : color,
      progress,
      completed: false, // Default to false for new notes
    }

    // Save to Supabase với timestamp chính xác
    const { data } = await supabase.from("notes").insert({
      user_id: user.id,
      date: dateKey,
      text,
      type,
      color: type === "attendance" ? "green" : color,
      progress: progress || 0,
      completed: false, // Default to false for new notes
      created_at: now.toISOString(), // Lưu thời gian UTC
      timestamp: timestamp, // Lưu timestamp hiển thị riêng
    }).select()

    if (data && data[0]) {
      newNote.id = data[0].id
      // Giữ nguyên timestamp đã tạo ở trên (thời gian thực)
    }

    setNotes((prev) => {
      const updated = {
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newNote],
      }

      return updated
    })
  }

  const deleteNote = async (noteId: string) => {
    await supabase.from("notes").delete().eq("id", noteId)

    setNotes((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].filter((note) => note.id !== noteId),
    }))
  }

  const updateNote = async (
    noteId: string,
    updates: Partial<{ text: string; color: string; progress: number; completed: boolean; status: string }>,
  ) => {
    await supabase.from("notes").update(updates).eq("id", noteId)

    setNotes((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((note) => (note.id === noteId ? { ...note, ...updates } : note)),
    }))
  }

  const addFutureTask = async (text: string, color = "blue", priority = "medium", tags: string[] = []) => {
    if (!selectedDate) return

    const dateKey = selectedDate.toISOString().split("T")[0]

    await syncData(
      async () => {
        const { data, error } = await supabase
          .from("future_tasks")
          .insert({
            user_id: user.id,
            date: dateKey,
            text,
            color,
            priority,
            status: "planning",
            tags
          })
          .select()
          .single()

        if (error) throw error

        const newTask = {
          id: data.id,
          text: data.text,
          color: data.color,
          priority: data.priority,
          status: data.status,
          completed: data.completed || false,
          created_at: data.created_at,
          tags: data.tags || []
        }

        const updatedTasks = [...futureTasks, newTask]
        setFutureTasks(updatedTasks)
        backupFutureTasksToStorage(updatedTasks)

        // Update allFutureTasks as well
        setAllFutureTasks(prev => ({
          ...prev,
          [dateKey]: updatedTasks
        }))
      },
      () => {
        // Fallback to localStorage
        const newTask = {
          id: Date.now().toString(),
          text,
          color,
          priority,
          status: "planning",
          completed: false,
          created_at: new Date().toISOString(),
          tags
        }
        const updatedTasks = [...futureTasks, newTask]
        setFutureTasks(updatedTasks)
        backupFutureTasksToStorage(updatedTasks)

        // Update allFutureTasks as well
        setAllFutureTasks(prev => ({
          ...prev,
          [dateKey]: updatedTasks
        }))
      }
    )
  }

  const deleteFutureTask = async (taskId: string) => {
    await syncData(
      async () => {
        const { error } = await supabase
          .from("future_tasks")
          .delete()
          .eq("id", taskId)

        if (error) throw error

        const updatedTasks = futureTasks.filter((task) => task.id !== taskId)
        setFutureTasks(updatedTasks)
        backupFutureTasksToStorage(updatedTasks)

        // Update allFutureTasks as well
        if (selectedDate) {
          const dateKey = selectedDate.toISOString().split("T")[0]
          setAllFutureTasks(prev => ({
            ...prev,
            [dateKey]: updatedTasks
          }))
        }
      }
    )
  }

  const updateFutureTask = async (
    taskId: string,
    updates: Partial<{ text: string; color: string; priority: string; status: string; completed: boolean; tags: string[] }>
  ) => {
    await syncData(
      async () => {
        const { error } = await supabase
          .from("future_tasks")
          .update(updates)
          .eq("id", taskId)

        if (error) throw error

        const updatedTasks = futureTasks.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        )
        setFutureTasks(updatedTasks)
        backupFutureTasksToStorage(updatedTasks)

        // Update allFutureTasks as well
        if (selectedDate) {
          const dateKey = selectedDate.toISOString().split("T")[0]
          setAllFutureTasks(prev => ({
            ...prev,
            [dateKey]: updatedTasks
          }))
        }
      }
    )
  }

  const handlePayrollConfirm = async (amount: number) => {
    const today = new Date().toISOString().split("T")[0]

    await supabase.from("payroll_history").insert({
      user_id: user.id,
      amount,
      paid_date: today,
    })

    setPayrollHistory((prev) => [...prev, { date: today, amount }])
    setShowPayrollModal(false)
    setWorkStartDate(null)
    setDaysWorked(0)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/auth/login")
  }

  const getSpecialDayType = (date: Date): string | null => {
    const key = date.toISOString().split("T")[0]
    return specialDays[key] || null
  }

  const handleSpecialDayClick = (date: Date) => {
    setSpecialDayModalDate(date)
    setShowSpecialDayModal(true)
  }

  const saveSpecialDay = async (type: string | null) => {
    if (!specialDayModalDate) return

    const dateKey = specialDayModalDate.toISOString().split("T")[0]

    try {
      if (type === null) {
        // Remove special day
        await supabase
          .from("special_days")
          .delete()
          .eq("user_id", user.id)
          .eq("date", dateKey)

        setSpecialDays(prev => {
          const updated = { ...prev }
          delete updated[dateKey]
          return updated
        })
      } else {
        // Add or update special day
        await supabase
          .from("special_days")
          .upsert({
            user_id: user.id,
            date: dateKey,
            type: type
          })

        setSpecialDays(prev => ({
          ...prev,
          [dateKey]: type
        }))
      }
    } catch (error) {
      console.error("Error saving special day:", error)
    }
  }

  const getNoteCount = (date: Date): number => {
    const key = date.toISOString().split("T")[0]
    return notes[key]?.length || 0
  }

  const getIncompleteNoteCount = (date: Date): number => {
    const key = date.toISOString().split("T")[0]
    const dayNotes = notes[key] || []
    // Chỉ đếm ghi chú thường (không phải attendance) và chưa hoàn thành
    return dayNotes.filter(note => note.type === "note" && !note.completed).length
  }

  const getFutureTasksCount = (date: Date): number => {
    const key = date.toISOString().split("T")[0]
    const tasks = allFutureTasks[key] || []
    // Chỉ đếm những nhiệm vụ chưa hoàn thành
    return tasks.filter(task => !task.completed).length
  }

  const getHasAttendance = (date: Date): boolean => {
    const key = date.toISOString().split("T")[0]
    return notes[key]?.some((note) => note.type === "attendance") || false
  }

  const getAttendanceInfo = (date: Date): { type: string; icon: string } | null => {
    const key = date.toISOString().split("T")[0]
    const attendanceNote = notes[key]?.find((note) => note.type === "attendance")

    if (!attendanceNote) return null

    if (attendanceNote.text.includes("Cả ngày")) {
      return { type: "full", icon: "🌞" }
    } else if (attendanceNote.text.includes("Buổi sáng")) {
      return { type: "morning", icon: "🌅" }
    } else if (attendanceNote.text.includes("Buổi chiều")) {
      return { type: "afternoon", icon: "🌆" }
    }

    return { type: "full", icon: "✓" }
  }

  const checkPayrollProgress = async () => {
    // Đếm tổng số ngày đã điểm danh
    const notesArray = Object.values(notes).flat()
    const attendanceNotes = notesArray.filter((n) => n.type === "attendance")
    const count = attendanceNotes.length

    setDaysWorked(count)

    // Tự động set workStartDate nếu chưa có và đã có điểm danh
    if (!workStartDate && count > 0) {
      // Tìm ngày điểm danh đầu tiên
      const dates = Object.keys(notes).filter(date =>
        notes[date].some(n => n.type === "attendance")
      ).sort()
      if (dates.length > 0) {
        setWorkStartDate(new Date(dates[0]))
      }
    }

    if (count === 30) {
      setShowPayrollModal(true)
    }
  }

  useEffect(() => {
    checkPayrollProgress()
  }, [notes])

  if (showAdminDashboard && isAdmin) {
    return <AdminDashboard onBack={() => setShowAdminDashboard(false)} currentUserEmail={user.email || "Unknown"} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <Header currentTime={currentTime} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Xin chào, {user.email}</h1>
            {isAdmin && <p className="text-sm text-purple-600 dark:text-purple-400">Quản Trị Viên</p>}

            {/* Save Status Indicator */}
            <div className="flex items-center gap-2 mt-2">
              {saveStatus === 'saving' && (
                <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400">
                  <div className="w-3 h-3 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  <span>Đang lưu...</span>
                </div>
              )}
              {saveStatus === 'saved' && lastSaved && (
                <div className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span>Đã lưu lúc {lastSaved.toLocaleTimeString('vi-VN')}</span>
                </div>
              )}
              {saveStatus === 'error' && (
                <div className="flex items-center gap-2 text-xs text-red-600 dark:text-red-400">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span>Lỗi lưu dữ liệu - Đã backup local</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex gap-2">
            {isAdmin && (
              <Button variant="outline" onClick={() => setShowAdminDashboard(true)} className="gap-2">
                <Settings className="w-4 h-4" />
                Quản Lí Tài Khoản
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout} className="gap-2 bg-transparent">
              <LogOut className="w-4 h-4" />
              Đăng Xuất
            </Button>
          </div>
        </div>

        {/* Calendar Full Screen */}
        <Card className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 shadow-lg">
          <CalendarView
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            getNoteCount={getNoteCount}
            getHasAttendance={getHasAttendance}
            getAttendanceInfo={getAttendanceInfo}
            getFutureTasksCount={getFutureTasksCount}
            getIncompleteNoteCount={getIncompleteNoteCount}
            getSpecialDayType={getSpecialDayType}
            onSpecialDayClick={handleSpecialDayClick}
          />
        </Card>

        {/* Reports Button */}
        <div className="flex justify-end mt-6">
          <ReportsButton onClick={() => setShowReportsModal(true)} />
        </div>
      </div>

      {/* Note Panel Drawer */}
      {showNotePanel && selectedDate && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl h-[90vh] bg-white dark:bg-slate-800 shadow-2xl overflow-hidden flex flex-col">
            <NotePanel
              selectedDate={selectedDate}
              dayNotes={dayNotes}
              onAddNote={addNote}
              onDeleteNote={deleteNote}
              onUpdateNote={updateNote}
              hasWorkStarted={workStartDate !== null}
              onClose={() => setShowNotePanel(false)}
              futureTasks={futureTasks}
              onAddFutureTask={addFutureTask}
              onDeleteFutureTask={deleteFutureTask}
              onUpdateFutureTask={updateFutureTask}
            />
          </Card>
        </div>
      )}

      <ReportsModal
        daysWorked={daysWorked}
        workStartDate={workStartDate}
        payrollHistory={payrollHistory}
        notes={notes}
        isOpen={showReportsModal}
        onClose={() => setShowReportsModal(false)}
      />

      {showPayrollModal && (
        <PayrollModal
          daysWorked={daysWorked}
          onConfirm={handlePayrollConfirm}
          onClose={() => setShowPayrollModal(false)}
        />
      )}

      {showSpecialDayModal && specialDayModalDate && (
        <SpecialDayModal
          date={specialDayModalDate}
          currentType={getSpecialDayType(specialDayModalDate)}
          onSave={saveSpecialDay}
          onClose={() => setShowSpecialDayModal(false)}
        />
      )}
    </main>
  )
}
