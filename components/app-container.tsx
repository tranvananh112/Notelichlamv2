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
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
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

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      const { data: notesData } = await supabase.from("notes").select("*").eq("user_id", user.id)

      const { data: payrollData } = await supabase.from("payroll_history").select("*").eq("user_id", user.id)

      const { data: workData } = await supabase.from("work_tracking").select("*").eq("user_id", user.id).single()

      if (notesData) {
        const groupedNotes = notesData.reduce(
          (acc, note) => {
            const dateKey = note.date
            if (!acc[dateKey]) acc[dateKey] = []
            acc[dateKey].push({
              id: note.id,
              text: note.text,
              timestamp: new Date(note.created_at).toLocaleTimeString("vi-VN"),
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

  const dateKey = selectedDate.toISOString().split("T")[0]
  const dayNotes = notes[dateKey] || []

  const addNote = async (text: string, type: "note" | "attendance" = "note", color = "blue", progress?: number) => {
    const newNote = {
      id: Date.now().toString(),
      text,
      timestamp: new Date().toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" }),
      type,
      color: type === "attendance" ? "green" : color,
      progress,
    }

    // Save to Supabase
    await supabase.from("notes").insert({
      user_id: user.id,
      date: dateKey,
      text,
      type,
      color: type === "attendance" ? "green" : color,
      progress: progress || 0,
    })

    setNotes((prev) => {
      const updated = {
        ...prev,
        [dateKey]: [...(prev[dateKey] || []), newNote],
      }

      if (type === "attendance" && !workStartDate) {
        setWorkStartDate(new Date(selectedDate))
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

  const checkPayrollProgress = async () => {
    if (!workStartDate) return

    let count = 0
    const currentCheck = new Date(workStartDate)
    const endDate = new Date(selectedDate)

    const notesArray = Object.values(notes).flat()
    const attendanceNotes = notesArray.filter((n) => n.type === "attendance")

    count = attendanceNotes.length

    setDaysWorked(count)

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

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <Card className="lg:col-span-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 shadow-lg">
            <CalendarView
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
              getNoteCount={getNoteCount}
              getHasAttendance={getHasAttendance}
            />
          </Card>

          <div className="lg:col-span-2 flex flex-col gap-6">
            <Card className="flex-1 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-slate-200/50 dark:border-slate-700/50 shadow-lg overflow-hidden">
              <NotePanel
                selectedDate={selectedDate}
                dayNotes={dayNotes}
                onAddNote={addNote}
                onDeleteNote={deleteNote}
                onUpdateNote={updateNote}
                hasWorkStarted={workStartDate !== null}
              />
            </Card>

            <div className="flex justify-end">
              <ReportsButton onClick={() => setShowReportsModal(true)} />
            </div>
          </div>
        </div>
      </div>

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
