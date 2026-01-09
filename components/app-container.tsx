"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import CalendarView from "./calendar-view"
import NotePanel from "./note-panel"
import Header from "./header"
import ReportsModal from "./reports-modal"
import PayrollModal from "./payroll-modal"
import ReportsButton from "./reports-button"
import AdminDashboard from "./admin-dashboard"
import { Card } from "./ui/card"
import { Button } from "./ui/button"
import { LogOut, Settings } from "lucide-react"

interface User {
  id: string
  email: string
}

export default function AppContainer({ user, isAdmin }: { user: User; isAdmin: boolean }) {
  const router = useRouter()
  const supabase = createClient()
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
    created_at: string
  }>>([])


  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load future tasks from localStorage
  useEffect(() => {
    const loadFutureTasks = () => {
      const storageKey = `futureTasks_${user.id}`
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        try {
          const tasks = JSON.parse(saved)
          setFutureTasks(tasks)
        } catch (error) {
          console.error("Error loading future tasks:", error)
          setFutureTasks([])
        }
      }
    }

    loadFutureTasks()
  }, [user.id])

  // Save future tasks to localStorage
  const saveFutureTasksToStorage = (tasks: typeof futureTasks) => {
    const storageKey = `futureTasks_${user.id}`
    localStorage.setItem(storageKey, JSON.stringify(tasks))
  }

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      // Chỉ lấy notes có date (ghi chú thường)
      const { data: allNotesData } = await supabase
        .from("notes")
        .select("*")
        .eq("user_id", user.id)

      const { data: payrollData } = await supabase.from("payroll_history").select("*").eq("user_id", user.id)

      const { data: workData } = await supabase.from("work_tracking").select("*").eq("user_id", user.id).single()

      if (allNotesData) {
        // Chỉ lấy notes có date
        const notesWithDate = allNotesData.filter(note => note.date !== null)

        // Group notes có date
        const groupedNotes = notesWithDate.reduce(
          (acc, note) => {
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
            })
            return acc
          },
          {} as typeof notes,
        )
        setNotes(groupedNotes)
      }

      if (payrollData) {
        setPayrollHistory(payrollData.map((p) => ({ date: p.paid_date, amount: p.amount })))
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
    }

    // Save to Supabase với timestamp chính xác
    const { data } = await supabase.from("notes").insert({
      user_id: user.id,
      date: dateKey,
      text,
      type,
      color: type === "attendance" ? "green" : color,
      progress: progress || 0,
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
    updates: Partial<{ text: string; color: string; progress: number; completed: boolean }>,
  ) => {
    await supabase.from("notes").update(updates).eq("id", noteId)

    setNotes((prev) => ({
      ...prev,
      [dateKey]: prev[dateKey].map((note) => (note.id === noteId ? { ...note, ...updates } : note)),
    }))
  }

  const addFutureTask = (text: string, color = "blue", priority = "medium") => {
    const newTask = {
      id: Date.now().toString(),
      text,
      color,
      priority,
      created_at: new Date().toISOString(),
    }

    const updatedTasks = [...futureTasks, newTask]
    setFutureTasks(updatedTasks)
    saveFutureTasksToStorage(updatedTasks)
  }

  const deleteFutureTask = (taskId: string) => {
    const updatedTasks = futureTasks.filter((task) => task.id !== taskId)
    setFutureTasks(updatedTasks)
    saveFutureTasksToStorage(updatedTasks)
  }

  const updateFutureTask = (
    taskId: string,
    updates: Partial<{ text: string; color: string; priority: string }>,
  ) => {
    const updatedTasks = futureTasks.map((task) => (task.id === taskId ? { ...task, ...updates } : task))
    setFutureTasks(updatedTasks)
    saveFutureTasksToStorage(updatedTasks)
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

  const getNoteCount = (date: Date): number => {
    const key = date.toISOString().split("T")[0]
    return notes[key]?.length || 0
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
    return <AdminDashboard onBack={() => setShowAdminDashboard(false)} currentUserEmail={user.email} />
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      <Header currentTime={currentTime} />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Xin chào, {user.email}</h1>
            {isAdmin && <p className="text-sm text-purple-600 dark:text-purple-400">Quản Trị Viên</p>}
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
    </main>
  )
}
